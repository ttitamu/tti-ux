#!/usr/bin/env node
/**
 * audit-tokens.mjs — CSS custom-property reference validator.
 *
 * Catches the `--surface-base` class of bug: a component references
 * `var(--some-token)` that isn't defined anywhere, so it silently falls
 * back to nothing (transparent background, no color, collapsed size). The
 * AAA contrast audit can't see these because the element renders with no
 * color at all; typecheck can't see them because CSS isn't typed. This
 * static pass closes that gap with zero browser and near-zero runtime.
 *
 * What counts as "defined":
 *   1. A `--token:` declaration in any app CSS file (tokens.css + friends).
 *   2. A custom property set inline in a .vue file — e.g.
 *      `:style="{ '--tux-photo-aspect': ratio }"` or a `<style>` block.
 *      These are component-local and legitimately never hit tokens.css.
 *   3. A name under a known external namespace (Tailwind 4 theme tokens,
 *      Nuxt UI `--ui-*`) — see EXTERNAL_PREFIXES.
 *
 * What is skipped (not flagged):
 *   - Dynamic references: `var(--chart-${i})` — the token name is built at
 *     runtime, so a static check can't resolve it. Detected by interpolation
 *     (`${`, backtick, `{`) inside the var() argument.
 *   - References with a fallback: `var(--status-error, var(--color-error))`.
 *     The fallback means it can never resolve to *nothing* — which is the
 *     only failure mode this audit exists to catch. `--surface-base` was a
 *     *bare* `var(--surface-base)` with no fallback; that's what we flag.
 *
 * Anything referenced via `var(--x)` that is none of the above is reported,
 * and the script exits non-zero — making it a CI gate alongside lint +
 * typecheck.
 *
 * Usage:
 *   npm run audit:tokens
 *   AUDIT_TOKENS_DEBUG=1 npm run audit:tokens   # also print the defined set
 *
 * Consumer usage (the script ships in the package; `tux-audit` is the bin):
 *   npx tux-audit tokens            # audits ./app against layer + own tokens
 *   npx tux-audit tokens src app    # explicit target dirs
 *   TUX_AUDIT_DIRS=frontend/app npx tux-audit tokens
 *   TUX_AUDIT_EXTERNAL_PREFIXES=--my-app- npx tux-audit tokens
 * Token definitions are harvested from BOTH the tti-ux layer's CSS (so
 * canonical tokens always resolve) and the target dirs' own CSS/Vue files.
 * This is the zero-dependency audit that would have caught the 17
 * undefined tokens one consumer shipped (--surface-base et al.).
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const FIX_MODE = process.argv.includes("--fix");

/**
 * Canonical migration map for legacy or consumer-invented CSS custom properties.
 * Used by `npx tux-audit tokens --fix` and the TUX MCP server.
 */
export const CANONICAL_TOKEN_MIGRATIONS = {
  "--surface-base": "--surface-page",
  "--bg-page": "--surface-page",
  "--bg-card": "--surface-raised",
  "--surface-card": "--surface-raised",
  "--text-default": "--text-primary",
  "--text-main": "--text-primary",
  "--danger": "--color-danger",
  "--status-info": "--color-info",
  "--status-success": "--color-success",
  "--status-warning": "--color-warning",
  "--status-error": "--color-error",
  "--border-subtle": "--surface-border-subtle",
  "--border-default": "--surface-border",
  "--font-sans": "--font-body",
};

// Target dirs: CLI args > TUX_AUDIT_DIRS (comma/colon-separated) > ./app.
// Resolved against cwd so the same invocation works in tti-ux itself and
// in any consumer running the shipped bin.
const argDirs = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const envDirs = (process.env.TUX_AUDIT_DIRS ?? "").split(/[,:]/).filter(Boolean);
const TARGET_DIRS = (argDirs.length ? argDirs : envDirs.length ? envDirs : ["app"])
  .map((d) => path.resolve(process.cwd(), d));

// The layer's own app/ tree — harvested for token DEFINITIONS regardless of
// target, so consumers get the canonical set for free. Identical to the
// target in a self-run (deduped below).
const LAYER_APP_DIR = path.join(ROOT, "app");

// External token namespaces we don't own. Nuxt UI emits --ui-*, and a
// handful of Tailwind 4 @theme namespaces resolve at build/runtime
// outside our CSS. ⚠ Namespaces the APP ALSO DEFINES (--radius-,
// --font-, --shadow-, --text-, --ease-, --tracking-, --color-) must
// NOT be blanket-exempted: the blanket form let `--radius-full` ship
// undefined for months (six components, chips rendered square) because
// the "--radius-" prefix swallowed it. Those shared namespaces are now
// audited like everything else — a legit Tailwind-only reference can be
// added to the narrow list below with a comment.
const EXTERNAL_PREFIXES = [
  "--ui-",
  "--spacing-",
  "--leading-",
  "--breakpoint-",
  "--container-",
  "--blur-",
  "--inset-",
  "--aspect-",
  "--animate-",
  "--perspective-",
  "--default-",
  // Consumer-declared namespaces (comma-separated), e.g. an app's own
  // component-local custom-property convention.
  ...(process.env.TUX_AUDIT_EXTERNAL_PREFIXES ?? "").split(",").filter(Boolean),
];

const isExternal = (name) => EXTERNAL_PREFIXES.some((p) => name.startsWith(p));

// ── walk app/ for .vue and .css ─────────────────────────────────────────────
function walk(dir, exts, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === "node_modules" || entry === ".nuxt" || entry === ".output") continue;
      walk(full, exts, out);
    } else if (exts.some((e) => entry.endsWith(e))) {
      out.push(full);
    }
  }
  return out;
}

for (const d of TARGET_DIRS) {
  try {
    statSync(d);
  } catch {
    console.error(`✗ audit:tokens — target dir does not exist: ${d}`);
    process.exit(2);
  }
}

const cssFiles = [...new Set(TARGET_DIRS.flatMap((d) => walk(d, [".css"])))];
const vueFiles = [...new Set(TARGET_DIRS.flatMap((d) => walk(d, [".vue"])))];

// Layer CSS/Vue — definitions only (never audited as references unless the
// layer is itself a target).
const layerDefFiles = TARGET_DIRS.includes(LAYER_APP_DIR)
  ? []
  : [...walk(LAYER_APP_DIR, [".css"]), ...walk(LAYER_APP_DIR, [".vue"])];

// ── build the "defined" set ─────────────────────────────────────────────────
// Matches `--token:` (CSS decl) and `'--token':` / `"--token":` (inline style
// object key in a .vue file). The optional quote before the colon is what
// lets us harvest component-local props set via :style bindings.
const DECL_RE = /(--[a-z][a-z0-9-]*)\s*['"]?\s*:/g;

const defined = new Set();
const declSource = new Map(); // token -> first file it was defined in (debug)
const selfReferential = []; // { token, file } — `--x: var(--x)` resolves to nothing
// A definition whose value is a bare var() of ITSELF is invalid at
// computed-value time — the token "exists" but resolves to nothing.
// This shipped once: a mechanical wash sweep rewrote the GENERATED
// tokens.css, turning `--wash-brand-4: color-mix(…)` into
// `--wash-brand-4: var(--wash-brand-4)`, and this audit counted it as
// defined. Now it's a hard failure.
const SELF_REF_RE = /(--[a-z][a-z0-9-]*)\s*:\s*var\(\s*\1\s*[),]/g;
function harvestDecls(file) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(DECL_RE)) {
    defined.add(m[1]);
    if (!declSource.has(m[1])) declSource.set(m[1], file);
  }
  for (const m of text.matchAll(SELF_REF_RE)) {
    // The Tailwind @theme bridge in globals.css legitimately re-exports
    // root values as `--x: var(--x)` inside an @theme block — those are
    // Tailwind theme keys, not CSS custom-property self-references.
    if (/globals\.css$/.test(file)) continue;
    selfReferential.push({ token: m[1], file });
  }
}
cssFiles.forEach(harvestDecls);
vueFiles.forEach(harvestDecls);
layerDefFiles.forEach(harvestDecls);

// ── collect var() references ────────────────────────────────────────────────
// Capture the token name plus the rest of the var() argument so we can detect
// dynamic interpolation and skip it.
const VAR_RE = /var\(\s*(--[a-z][a-z0-9-]*)([^)]*)\)/g;

const violations = []; // { token, file, line, suggested }
const referenced = new Set();
let dynamicSkipped = 0;
let fallbackSkipped = 0;
let autoFixedCount = 0;

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

export function suggestCanonicalToken(token, definedTokens = defined) {
  if (CANONICAL_TOKEN_MIGRATIONS[token]) {
    return CANONICAL_TOKEN_MIGRATIONS[token];
  }
  let best = null;
  let bestDist = 3; // only suggest close typo matches (distance <= 2)
  for (const cand of definedTokens) {
    if (Math.abs(cand.length - token.length) > 2) continue;
    const d = levenshtein(token, cand);
    if (d < bestDist) {
      bestDist = d;
      best = cand;
    }
  }
  return best;
}

for (const file of [...cssFiles, ...vueFiles]) {
  let text = readFileSync(file, "utf8");
  let fileModified = false;

  for (const m of text.matchAll(VAR_RE)) {
    const token = m[1];
    const rest = m[2] || "";
    // Dynamic reference — token name built via template interpolation.
    if (/[$`{]/.test(rest) || /[$`{]/.test(text.slice(Math.max(0, m.index - 2), m.index))) {
      dynamicSkipped++;
      continue;
    }
    // Reference with a fallback — `var(--x, <fallback>)` can never resolve to
    // nothing, so it's safe by construction even if --x is undefined.
    if (rest.includes(",")) {
      fallbackSkipped++;
      continue;
    }
    referenced.add(token);
    if (defined.has(token) || isExternal(token)) continue;

    const suggested = suggestCanonicalToken(token, defined);
    if (FIX_MODE && suggested && defined.has(suggested)) {
      const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`var\\(\\s*${escaped}\\s*\\)`, "g");
      text = text.replace(re, `var(${suggested})`);
      fileModified = true;
      autoFixedCount++;
      continue;
    }

    violations.push({
      token,
      file: path.relative(ROOT, file),
      line: lineOf(text, m.index),
      suggested,
    });
  }

  if (fileModified) {
    writeFileSync(file, text, "utf8");
  }
}

// ── report ──────────────────────────────────────────────────────────────────
if (process.env.AUDIT_TOKENS_DEBUG === "1") {
  console.log(
    `defined: ${defined.size}  referenced(bare): ${referenced.size}  ` +
      `fallback-skipped: ${fallbackSkipped}  dynamic-skipped: ${dynamicSkipped}  ` +
      `external-prefixes: ${EXTERNAL_PREFIXES.length}\n`
  );
}

if (autoFixedCount > 0) {
  console.log(`✓ auto-fixed ${autoFixedCount} legacy/invented token reference(s) via --fix.`);
}

if (selfReferential.length > 0) {
  console.error(
    `✗ ${selfReferential.length} self-referential token definition(s) — ` +
      `these resolve to NOTHING at computed-value time:\n`
  );
  for (const s of selfReferential) console.error(`  ${s.token}  (${s.file})`);
  console.error(
    `\nRegenerate the file (npm run build:tokens) or fix the definition.`
  );
  process.exit(1);
}

if (violations.length === 0) {
  console.log(
    `✓ token-references OK — every var(--token) in app/ resolves ` +
      `(${defined.size} defined, ${referenced.size} referenced).`
  );
  process.exit(0);
}

// Group by token for a compact report.
const byToken = new Map();
const suggestionByToken = new Map();
for (const v of violations) {
  if (!byToken.has(v.token)) byToken.set(v.token, []);
  byToken.get(v.token).push(`${v.file}:${v.line}`);
  if (v.suggested) suggestionByToken.set(v.token, v.suggested);
}

console.error(
  `✗ ${violations.length} undefined token reference(s) across ` +
    `${byToken.size} token name(s):\n`
);
for (const [token, sites] of [...byToken.entries()].sort()) {
  const hint = suggestionByToken.get(token);
  console.error(`  ${token}${hint ? `  → did you mean ${hint}? (run with --fix)` : ""}`);
  for (const site of sites) console.error(`      ${site}`);
}
console.error(
  `\nEach var(${[...byToken.keys()][0]}) etc. resolves to nothing at runtime.\n` +
    `Define it in design/tokens.json (never hand-edit tokens.css), fix the\n` +
    `name, or — if it's a Tailwind/Nuxt UI token — add its namespace to\n` +
    `EXTERNAL_PREFIXES in scripts/audit-tokens.mjs.\n\n` +
    `If this is a consumer-invented alias, run \`npx tux-audit tokens --fix\`\n` +
    `or rename to the canonical token (migration table in kit/README.md):\n` +
    `--surface-base → --surface-page · --text-default → --text-primary ·\n` +
    `--danger → --color-danger · --status-* → --color-{info,success,warning,error} ·\n` +
    `--border-subtle → --surface-border-subtle.`
);
process.exit(1);
