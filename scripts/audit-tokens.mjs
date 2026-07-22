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
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const APP_DIR = path.join(ROOT, "app");

// External token namespaces we don't own: Tailwind 4 emits theme tokens
// (--color-*, --radius-*, --spacing-*, --text-*, --font-*, …) from its
// `@theme` block, and Nuxt UI emits --ui-*. These resolve at build/runtime
// outside our CSS, so a missing one is not our bug to catch here.
const EXTERNAL_PREFIXES = [
  "--ui-",
  "--color-",
  "--radius-",
  "--spacing-",
  "--text-",
  "--font-",
  "--leading-",
  "--tracking-",
  "--breakpoint-",
  "--container-",
  "--ease-",
  "--blur-",
  "--shadow-",
  "--inset-",
  "--aspect-",
  "--animate-",
  "--perspective-",
  "--default-",
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

const cssFiles = walk(APP_DIR, [".css"]);
const vueFiles = walk(APP_DIR, [".vue"]);

// ── build the "defined" set ─────────────────────────────────────────────────
// Matches `--token:` (CSS decl) and `'--token':` / `"--token":` (inline style
// object key in a .vue file). The optional quote before the colon is what
// lets us harvest component-local props set via :style bindings.
const DECL_RE = /(--[a-z][a-z0-9-]*)\s*['"]?\s*:/g;

const defined = new Set();
const declSource = new Map(); // token -> first file it was defined in (debug)
function harvestDecls(file) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(DECL_RE)) {
    defined.add(m[1]);
    if (!declSource.has(m[1])) declSource.set(m[1], file);
  }
}
cssFiles.forEach(harvestDecls);
vueFiles.forEach(harvestDecls);

// ── collect var() references ────────────────────────────────────────────────
// Capture the token name plus the rest of the var() argument so we can detect
// dynamic interpolation and skip it.
const VAR_RE = /var\(\s*(--[a-z][a-z0-9-]*)([^)]*)\)/g;

const violations = []; // { token, file, line }
const referenced = new Set();
let dynamicSkipped = 0;
let fallbackSkipped = 0;

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

for (const file of [...cssFiles, ...vueFiles]) {
  const text = readFileSync(file, "utf8");
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
    violations.push({
      token,
      file: path.relative(ROOT, file),
      line: lineOf(text, m.index),
    });
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

if (violations.length === 0) {
  console.log(
    `✓ token-references OK — every var(--token) in app/ resolves ` +
      `(${defined.size} defined, ${referenced.size} referenced).`
  );
  process.exit(0);
}

// Group by token for a compact report.
const byToken = new Map();
for (const v of violations) {
  if (!byToken.has(v.token)) byToken.set(v.token, []);
  byToken.get(v.token).push(`${v.file}:${v.line}`);
}

console.error(
  `✗ ${violations.length} undefined token reference(s) across ` +
    `${byToken.size} token name(s):\n`
);
for (const [token, sites] of [...byToken.entries()].sort()) {
  console.error(`  ${token}`);
  for (const site of sites) console.error(`      ${site}`);
}
console.error(
  `\nEach var(${[...byToken.keys()][0]}) etc. resolves to nothing at runtime.\n` +
    `Define it in app/assets/css/tokens.css, fix the name, or — if it's a\n` +
    `Tailwind/Nuxt UI token — add its namespace to EXTERNAL_PREFIXES in\n` +
    `scripts/audit-tokens.mjs.`
);
process.exit(1);
