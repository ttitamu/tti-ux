/**
 * scripts/build-tokens.mjs — Phase 0 cross-framework token pipeline.
 *
 * Makes design/tokens.json the single source of truth for the CSS custom
 * properties in app/assets/css/tokens.css (and a self-contained external
 * kit copy at kit/css/tux-tokens.css — a COMMITTED path, not dist/, so it
 * ships over jsDelivr-from-GitHub: cdn.jsdelivr.net/gh/<org>/tti-ux@<tag>/
 * kit/css/tux-tokens.css).
 *
 * The generator walks structured groups in tokens.json and emits CSS
 * custom properties under three selectors:
 *   :root,[data-theme="tti"]   — the default tti theme + all global tokens
 *   [data-theme="tti-dark"]    — dark theme + Tailwind @theme alias rebinds
 *   [data-theme="tti-hc"]      — high-contrast theme + alias rebinds
 *
 * Values are emitted VERBATIM from tokens.json: where a value is a
 * `var(--x)` reference in the CSS it is stored (and emitted) as the literal
 * string "var(--x)"; where it is a literal hex/rgba it is stored as such.
 * `{token.path}` aliases (used elsewhere in tokens.json, e.g. theme brand
 * colors that point at the base palette) are resolved to the *var name* of
 * their target so the emitted CSS preserves the var() reference that the
 * hand-maintained file used.
 *
 * Modes:
 *   (default)   read tokens.json → write tokens.css + dist kit copy.
 *   --check     regenerate in-memory; diff against git HEAD's tokens.css as
 *               a canonical { selector -> { var -> value } } map; print
 *               MISSING / EXTRA / CHANGED per selector; exit 0 iff identical.
 *   --extract   parse the current tokens.css → emit a structured JSON dump
 *               on stdout (bootstrapping aid only).
 *
 * Run via `npm run build:tokens`. The --check mode is the acceptance gate.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TOKENS_JSON = path.join(ROOT, "design/tokens.json");
const TOKENS_CSS = path.join(ROOT, "app/assets/css/tokens.css");
// Committed (not dist/, which is gitignored) so jsDelivr-from-GitHub serves it.
const KIT_CSS = path.join(ROOT, "kit/css/tux-tokens.css");

const SELECTORS = {
  tti: ':root,\n[data-theme="tti"]',
  "tti-dark": '[data-theme="tti-dark"]',
  "tti-hc": '[data-theme="tti-hc"]',
};

// ---------------------------------------------------------------------------
// tokens.json helpers
// ---------------------------------------------------------------------------

/** Read a `{ "$value": ... }` leaf, or a bare value, returning the value. */
function val(node) {
  if (node && typeof node === "object" && "$value" in node) return node.$value;
  return node;
}

/** Resolve a `{a.b.c}` alias to the CSS var NAME of its referent. */
function aliasToVarName(ref) {
  // ref like "{color.tti.maroon}" → maps to --tti-maroon
  const inner = ref.slice(1, -1); // strip { }
  const parts = inner.split(".");
  if (parts[0] === "color" && parts[1] === "tti") return `var(--tti-${parts[2]})`;
  if (parts[0] === "color" && parts[1] === "neutral") return `var(--neutral-${parts[2]})`;
  throw new Error(`Unsupported alias reference: ${ref}`);
}

/** Coerce a stored value into a CSS-ready string (resolving {aliases}). */
function cssValue(raw) {
  const v = val(raw);
  if (typeof v === "string" && v.startsWith("{") && v.endsWith("}")) {
    return aliasToVarName(v);
  }
  return String(v);
}

/**
 * Emit declarations for a group object whose keys map to a var prefix.
 * Skips meta keys (those starting with `_` or `$`). Returns array of
 * [varName, value] pairs.
 */
function group(obj, prefix) {
  const out = [];
  if (!obj) return out;
  for (const [key, node] of Object.entries(obj)) {
    if (key.startsWith("_") || key.startsWith("$")) continue;
    out.push([`--${prefix}${key}`, cssValue(node)]);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Build per-selector declaration lists from tokens.json
// ---------------------------------------------------------------------------

function buildSelectors(tokens) {
  const sel = { tti: [], "tti-dark": [], "tti-hc": [] };

  // ---- :root / tti -------------------------------------------------------
  const root = sel.tti;

  // Brand anchor (--tti-*)
  root.push(...group(tokens.color.tti, "tti-"));
  // Neutrals (--neutral-*)
  root.push(...group(tokens.color.neutral, "neutral-"));
  // Brand → semantic (--brand-*) for tti theme
  root.push(...group(tokens.themes.tti.brand, "brand-"));
  // Surfaces / text
  root.push(...group(tokens.themes.tti.surface, "surface-"));
  root.push(...group(tokens.themes.tti.text, "text-"));
  // Base semantic colors (--color-*)
  root.push(...semantic(tokens.themes.tti.semantic ?? tokens.color.semantic));

  // Globals — fonts, tracking, shadow, focus, elevation, radius, motion,
  // ease, space, rhythm — :root only.
  const g = tokens.globals;
  root.push(...group(g.font, "font-"));
  root.push(...group(g.tracking, "tracking-"));
  root.push(...group(g.shadow, "shadow-"));
  root.push(...focus(g.focus, tokens.themes.tti.focus));
  root.push(...group(g.elevation, "elevation-"));
  root.push(...group(g.radius, "radius-"));
  root.push(...group(g.motion, "motion-"));
  root.push(...group(g.ease, "ease-"));
  root.push(...group(g.space, "space-"));
  root.push(...group(g.rhythm, "rhythm-"));

  // Nuxt UI ramps (--color-maroon-*, --color-gold-*)
  root.push(...ramp(tokens.ramps.maroon, "color-maroon-"));
  root.push(...ramp(tokens.ramps.gold, "color-gold-"));

  // Chart + map (tti theme)
  root.push(...group(tokens.themes.tti.chart, "chart-"));
  root.push(...group(tokens.themes.tti.map, "map-"));

  // ---- tti-dark + tti-hc -------------------------------------------------
  for (const name of ["tti-dark", "tti-hc"]) {
    const t = tokens.themes[name];
    const out = sel[name];

    if (t.colorScheme) out.push(["color-scheme", t.colorScheme]);

    out.push(...group(t.brand, "brand-"));
    out.push(...group(t.surface, "surface-"));
    out.push(...group(t.text, "text-"));

    // Nuxt UI ramp overrides (only specific steps)
    out.push(...ramp(t.rampOverrides, "color-maroon-"));

    out.push(...semantic(t.semantic));
    out.push(...focus(t.focus, t.focus));
    out.push(...group(t.elevation, "elevation-"));

    // Tailwind @theme alias rebindings (--color-brand-*/surface-*/text-*)
    out.push(...aliasRebinds(t));

    out.push(...group(t.chart, "chart-"));
    out.push(...group(t.map, "map-"));
  }

  return sel;
}

/** Semantic block → --color-{success,warning,danger,error,info}. */
function semantic(obj) {
  const out = [];
  if (!obj) return out;
  for (const [k, node] of Object.entries(obj)) {
    if (k.startsWith("_") || k.startsWith("$")) continue;
    out.push([`--color-${k}`, cssValue(node)]);
  }
  return out;
}

/** Focus block → --focus-ring-outer/inner + composed --shadow-focus. */
function focus(globalFocus, themeFocus) {
  const f = themeFocus ?? globalFocus;
  if (!f) return [];
  const out = [
    ["--focus-ring-outer", cssValue(f["ring-outer"])],
    ["--focus-ring-inner", cssValue(f["ring-inner"])],
  ];
  out.push(["--shadow-focus", cssValue(f["shadow"])]);
  return out;
}

/** Numeric/keyed color ramp → --<prefix><step>. */
function ramp(obj, prefix) {
  const out = [];
  if (!obj) return out;
  for (const [k, node] of Object.entries(obj)) {
    if (k.startsWith("_") || k.startsWith("$")) continue;
    out.push([`--${prefix}${k}`, cssValue(node)]);
  }
  return out;
}

/** Tailwind @theme alias rebindings present in dark/hc blocks. */
function aliasRebinds(t) {
  const out = [];
  const push = (name, refVar) => out.push([`--color-${name}`, `var(--${refVar})`]);
  for (const k of Object.keys(t.brand)) {
    if (k.startsWith("_") || k.startsWith("$")) continue;
    push(`brand-${k}`, `brand-${k}`);
  }
  for (const k of Object.keys(t.surface)) {
    if (k.startsWith("_") || k.startsWith("$")) continue;
    push(`surface-${k}`, `surface-${k}`);
  }
  for (const k of Object.keys(t.text)) {
    if (k.startsWith("_") || k.startsWith("$")) continue;
    push(`text-${k}`, `text-${k}`);
  }
  return out;
}

// ---------------------------------------------------------------------------
// CSS rendering
// ---------------------------------------------------------------------------

const HEADER = `/*
 * tux design tokens — GENERATED FILE. DO NOT EDIT BY HAND.
 *
 * Generated by scripts/build-tokens.mjs from design/tokens.json,
 * the single source of truth for tux theme tokens. Run
 * \`npm run build:tokens\` to regenerate; \`node scripts/build-tokens.mjs --check\`
 * verifies this file is value-equivalent to its source.
 *
 * Switch themes by setting data-theme="<name>" on <html>.
 */`;

function renderBlock(selector, decls) {
  const lines = decls.map(([name, value]) => `  ${name}: ${value};`);
  return `${selector} {\n${lines.join("\n")}\n}`;
}

function renderCss(sel) {
  const blocks = [
    renderBlock(SELECTORS.tti, sel.tti),
    renderBlock(SELECTORS["tti-dark"], sel["tti-dark"]),
    renderBlock(SELECTORS["tti-hc"], sel["tti-hc"]),
  ];
  return `${HEADER}\n\n${blocks.join("\n\n")}\n`;
}

// ---------------------------------------------------------------------------
// Canonical parse: CSS text → { selectorKey -> { varName -> value } }
// ---------------------------------------------------------------------------

function classifySelector(selectorText) {
  if (/tti-dark/.test(selectorText)) return "tti-dark";
  if (/tti-hc/.test(selectorText)) return "tti-hc";
  if (/:root/.test(selectorText) || /"tti"/.test(selectorText)) return "tti";
  return null;
}

function canonicalize(css) {
  // Strip comments.
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const map = {};
  const ruleRe = /([^{}]+)\{([^}]*)\}/g;
  let m;
  while ((m = ruleRe.exec(noComments)) !== null) {
    const selectorText = m[1].trim();
    const body = m[2];
    const key = classifySelector(selectorText);
    if (!key) continue;
    map[key] = map[key] || {};
    const declRe = /([\w-]+)\s*:\s*([^;]+);/g;
    let d;
    while ((d = declRe.exec(body)) !== null) {
      const name = d[1].trim();
      // normalize whitespace inside the value
      const value = d[2].replace(/\s+/g, " ").trim();
      map[key][name] = value;
    }
  }
  return map;
}

// ---------------------------------------------------------------------------
// Diff
// ---------------------------------------------------------------------------

function diff(reference, generated) {
  const selectorKeys = new Set([
    ...Object.keys(reference),
    ...Object.keys(generated),
  ]);
  const report = [];
  let total = 0;
  let varCount = 0;

  for (const sel of selectorKeys) {
    const ref = reference[sel] || {};
    const gen = generated[sel] || {};
    const names = new Set([...Object.keys(ref), ...Object.keys(gen)]);
    for (const name of names) {
      varCount++;
      const inRef = name in ref;
      const inGen = name in gen;
      if (inRef && !inGen) {
        report.push(`  [${sel}] MISSING ${name} (ref: ${ref[name]})`);
        total++;
      } else if (!inRef && inGen) {
        report.push(`  [${sel}] EXTRA   ${name} (gen: ${gen[name]})`);
        total++;
      } else if (ref[name] !== gen[name]) {
        report.push(`  [${sel}] CHANGED ${name}: ${ref[name]} → ${gen[name]}`);
        total++;
      }
    }
  }
  return { report, total, varCount, selectorCount: selectorKeys.size };
}

// ---------------------------------------------------------------------------
// --extract (bootstrap aid)
// ---------------------------------------------------------------------------

function extract() {
  const css = fs.readFileSync(TOKENS_CSS, "utf8");
  const map = canonicalize(css);
  process.stdout.write(JSON.stringify(map, null, 2) + "\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function readTokens() {
  return JSON.parse(fs.readFileSync(TOKENS_JSON, "utf8"));
}

function generateCss() {
  const tokens = readTokens();
  const sel = buildSelectors(tokens);
  return renderCss(sel);
}

function referenceCss() {
  return execSync("git show HEAD:app/assets/css/tokens.css", {
    cwd: ROOT,
    encoding: "utf8",
  });
}

function check() {
  const generated = canonicalize(generateCss());
  const reference = canonicalize(referenceCss());
  const { report, total, varCount, selectorCount } = diff(reference, generated);
  if (total === 0) {
    process.stdout.write(
      `PASS: 0 value differences across ${selectorCount} selectors (${varCount} vars)\n`,
    );
    process.exit(0);
  }
  process.stdout.write(report.join("\n") + "\n");
  process.stdout.write(
    `FAIL: ${total} value difference(s) across ${selectorCount} selectors (${varCount} vars)\n`,
  );
  process.exit(1);
}

function write() {
  const css = generateCss();
  fs.writeFileSync(TOKENS_CSS, css);
  fs.mkdirSync(path.dirname(KIT_CSS), { recursive: true });
  fs.writeFileSync(KIT_CSS, css);
  process.stdout.write(
    `Wrote ${path.relative(ROOT, TOKENS_CSS)} and ${path.relative(ROOT, KIT_CSS)}\n`,
  );
}

const mode = process.argv[2];
if (mode === "--check") check();
else if (mode === "--extract") extract();
else write();
