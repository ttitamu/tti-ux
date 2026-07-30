/**
 * scripts/build-powerbi-theme.mjs — generate Power BI report themes from
 * design/tokens.json.
 *
 * Emits kit/powerbi/tti-theme.json (light) + tti-theme-dark.json —
 * colors and fonts only; report-side visual/shell logic stays in the
 * reporting repo, which re-vendors these at pin-bump (or curls the CDN
 * path) instead of hand-maintaining a token snapshot. Ends the drift
 * class where the reporting stack was pinned to a v1.1.0 hand-copy with
 * docs mapping to token names that no longer exist.
 *
 * dataColors is the 10-series chart ramp (chart-1..10 — 9/10 added
 * v1.8.0 exactly so this artifact satisfies 10-series validators from
 * tokens, not hand-mixed extras).
 *
 * Brand surfaces (maroon masthead/footer + on-brand text) are
 * THEME-INVARIANT by doctrine — both files carry the same brand block;
 * the dark file changes page/text/neutral surfaces only.
 *
 * Run via `npm run build:powerbi`. Committed output, ships over git dep
 * + jsDelivr like the rest of kit/.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, "design/tokens.json"), "utf8"));
const OUT_DIR = path.join(ROOT, "kit/powerbi");

const val = (node) => (node && typeof node === "object" ? node.$value : node);

function resolveRef(v, theme, seen = new Set()) {
  if (typeof v !== "string") return v;
  const alias = v.match(/^\{([^}]+)\}$/);
  const cssVar = v.match(/^var\(--([a-z0-9-]+)\)$/);
  if (cssVar) {
    // A stored CSS-var literal like var(--brand-primary): resolve against
    // the same theme's groups (brand-primary → theme.brand.primary).
    const name = cssVar[1];
    for (const group of ["brand", "surface", "text", "semantic"]) {
      for (const key of Object.keys(theme[group] ?? {})) {
        if (`${group}-${key}` === name) {
          return resolveRef(val(theme[group][key]), theme, seen);
        }
      }
    }
    throw new Error(`unresolvable css-var reference: ${v}`);
  }
  if (!alias) return v;
  const pathStr = alias[1];
  if (seen.has(pathStr)) throw new Error(`circular reference: ${pathStr}`);
  seen.add(pathStr);
  let node = tokens;
  for (const key of pathStr.split(".")) {
    node = node?.[key];
    if (node == null) throw new Error(`unresolvable reference: {${pathStr}}`);
  }
  return resolveRef(val(node), theme, seen);
}

// Fonts: Power BI wants family names, not CSS stacks.
const family = (stack) => resolveRef(stack, tokens.themes.tti).match(/^"?([^",]+)/)[1];
const FONT_BODY = family(val(tokens.globals.font.body));       // Open Sans
const FONT_BOLD = family(val(tokens.globals.font.bold));       // Work Sans
const FONT_DISPLAY = family(val(tokens.globals.font.display)); // Oswald

function buildTheme(themeName) {
  const theme = tokens.themes[themeName];
  const r = (v) => resolveRef(v, theme);
  const chart = theme.chart;
  const dataColors = Object.keys(chart)
    .filter((k) => /^\d+$/.test(k))
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => r(val(chart[k])));

  // Brand block is deliberately taken from the DEFAULT theme — maroon
  // mastheads stay maroon in dark mode (the on-brand rule).
  const tti = tokens.themes.tti;
  const brand = (v) => resolveRef(v, tti);

  return {
    name: themeName === "tti" ? "TTI (tux)" : "TTI Dark (tux)",
    _generated:
      "by tti-ux scripts/build-powerbi-theme.mjs from design/tokens.json — do not hand-edit; re-vendor at a pinned tag",
    dataColors,
    background: r(val(theme.surface.page)),
    foreground: r(val(theme.text.primary)),
    tableAccent: brand(val(tti.brand.primary)),
    good: r(val(theme.semantic?.success ?? tokens.color.semantic.success)),
    neutral: r(val(theme.text.muted)),
    bad: r(val(theme.semantic?.error ?? tokens.color.semantic.error)),
    textClasses: {
      title: { fontFace: FONT_BOLD, color: r(val(theme.text.primary)), fontSize: 12 },
      callout: { fontFace: FONT_DISPLAY, color: r(val(theme.text.primary)), fontSize: 40 },
      label: { fontFace: FONT_BODY, color: r(val(theme.text.secondary)), fontSize: 10 },
      header: { fontFace: FONT_BODY, color: r(val(theme.text.primary)), fontSize: 11 },
    },
  };
}

fs.mkdirSync(OUT_DIR, { recursive: true });
for (const [themeName, file] of [
  ["tti", "tti-theme.json"],
  ["tti-dark", "tti-theme-dark.json"],
]) {
  const out = path.join(OUT_DIR, file);
  fs.writeFileSync(out, JSON.stringify(buildTheme(themeName), null, 2) + "\n");
  console.log(`Wrote ${path.relative(ROOT, out)}`);
}
