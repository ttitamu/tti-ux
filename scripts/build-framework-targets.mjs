/**
 * scripts/build-framework-targets.mjs — deterministic framework targets
 * generated from design/tokens.json (via build-tokens.mjs's selector
 * builder, the same single source the CSS comes from).
 *
 * Targets (all committed under kit/, all shipped in the npm package):
 *   kit/csharp/TuxTokens.cs   — .NET (WPF / MAUI / Blazor server-side
 *                               styling, report generators): per-theme
 *                               static classes of resolved literals +
 *                               an All dictionary for dynamic lookup.
 *   kit/react/tux-tokens.ts   — React/TS (non-Nuxt web apps): per-theme
 *                               resolved token maps + a tuxVar() helper
 *                               for the CSS-custom-property spelling.
 *   kit/wp/theme.json         — WordPress block-theme settings (marcom
 *                               sites): palette, font families, custom
 *                               radius/spacing — tti light theme.
 *
 * DOCTRINE — the two-tier kit pipeline (design/kit-pipeline.md):
 * this tier is DETERMINISTIC. Values are resolved (var() chains
 * followed, {aliases} flattened, wash color-mix computed to rgba) at
 * build time, so consumers on platforms without CSS custom properties
 * get literals that cannot drift from tokens.json. No AI is involved
 * here and none should be: same input, same bytes, forever.
 * `tests/tux-kit-targets.test.ts` locks committed outputs to the
 * generator (the build-tokens --check discipline).
 *
 * Run via `npm run build:framework` (part of `npm run build:kit`).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readTokens, buildSelectors } from "./build-tokens.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Resolution — flatten each theme to literal values
// ---------------------------------------------------------------------------

/** Per-theme flat maps: dark/hc overlay the tti base, like the cascade. */
function themeMaps(sel) {
  const base = new Map(sel.tti.filter(([k]) => k.startsWith("--")));
  const overlay = (name) =>
    new Map([...base, ...sel[name].filter(([k]) => k.startsWith("--"))]);
  return { tti: base, "tti-dark": overlay("tti-dark"), "tti-hc": overlay("tti-hc") };
}

/** Follow var() chains to literals. Throws on cycles/undefined — a
 *  broken chain must fail the build, not ship a var() to C#. */
function resolveValue(value, map, seen = new Set()) {
  let out = String(value);
  for (let guard = 0; guard < 16; guard++) {
    const m = out.match(/var\((--[a-z0-9-]+)\s*(?:,\s*([^)]*))?\)/);
    if (!m) break;
    const [whole, name, fallback] = m;
    if (seen.has(name + out)) throw new Error(`var() cycle at ${name}`);
    seen.add(name + out);
    const target = map.has(name) ? map.get(name) : fallback;
    if (target === undefined) throw new Error(`unresolvable ${name}`);
    out = out.replace(whole, String(target).trim());
  }
  if (out.includes("var(")) throw new Error(`unresolved var() in: ${out}`);
  return computeColorMix(out);
}

/** color-mix(in srgb, #hex N%, transparent) → rgba(r, g, b, N/100).
 *  The wash-ladder shape is the only color-mix in the token set. */
function computeColorMix(value) {
  return value.replace(
    /color-mix\(in srgb,\s*#([0-9a-fA-F]{6})\s+(\d+)%,\s*transparent\)/g,
    (_, hex, pct) => {
      const n = parseInt(hex, 16);
      const a = Number(pct) / 100;
      return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
    },
  );
}

function resolvedThemes() {
  const sel = buildSelectors(readTokens());
  const maps = themeMaps(sel);
  const out = {};
  for (const [theme, map] of Object.entries(maps)) {
    const resolved = {};
    for (const [name, raw] of map) {
      resolved[name.replace(/^--/, "")] = resolveValue(raw, map);
    }
    out[theme] = resolved;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Emitters
// ---------------------------------------------------------------------------

const GENERATED_NOTE =
  "GENERATED FILE — do not edit. Source: design/tokens.json via " +
  "scripts/build-framework-targets.mjs (npm run build:framework).";

function pascal(name) {
  return name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
}

function csEscape(v) {
  return v.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function renderCsharp(themes) {
  const cls = { tti: "Tti", "tti-dark": "TtiDark", "tti-hc": "TtiHc" };
  const lines = [
    `// ${GENERATED_NOTE}`,
    "//",
    "// Resolved design-token literals for .NET consumers (WPF, MAUI,",
    "// Blazor, report generators). One static class per theme; token",
    "// names are the CSS custom-property names without the leading",
    '// dashes, PascalCased ("brand-primary" -> BrandPrimary). The All',
    "// dictionary keeps the original kebab names for dynamic lookup.",
    "",
    "namespace Tti.Tux;",
    "",
    "public static class TuxTokens",
    "{",
  ];
  for (const [theme, values] of Object.entries(themes)) {
    lines.push(`    /// <summary>Theme "${theme}".</summary>`);
    lines.push(`    public static class ${cls[theme]}`);
    lines.push("    {");
    for (const [name, value] of Object.entries(values)) {
      lines.push(`        public const string ${pascal(name)} = "${csEscape(value)}";`);
    }
    lines.push("");
    lines.push(
      "        public static readonly System.Collections.Generic.IReadOnlyDictionary<string, string> All =",
    );
    lines.push("            new System.Collections.Generic.Dictionary<string, string>");
    lines.push("            {");
    for (const [name, value] of Object.entries(values)) {
      lines.push(`                ["${name}"] = "${csEscape(value)}",`);
    }
    lines.push("            };");
    lines.push("    }");
    lines.push("");
  }
  lines.push("}");
  return lines.join("\n") + "\n";
}

export function renderReact(themes) {
  const body = JSON.stringify(themes, null, 2);
  return `/**
 * ${GENERATED_NOTE}
 *
 * Resolved design tokens for React / TypeScript consumers outside the
 * Nuxt layer. Two spellings, two jobs:
 *   - tuxTokens: literal values per theme — for JS-side styling
 *     (inline styles, emotion/styled objects, canvas, chart configs).
 *   - tuxVar(): the CSS custom-property spelling — prefer it whenever
 *     the target is CSS and kit/css/tux-tokens.css is loaded, so the
 *     browser cascade (data-theme switching) keeps doing the theming.
 */

export const tuxTokens = ${body} as const;

export type TuxThemeName = keyof typeof tuxTokens;
export type TuxTokenName = keyof (typeof tuxTokens)["tti"];

/** CSS custom-property spelling for a token ("brand-primary" -> "var(--brand-primary)"). */
export function tuxVar(name: TuxTokenName): string {
  return \`var(--\${name})\`;
}
`;
}

export function renderWordPress(themes) {
  const t = themes.tti;
  const title = (slug) =>
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const palette = [];
  const paletteSlugs = [
    "brand-primary", "brand-primary-deep", "brand-accent", "brand-accent-deep",
    "brand-secondary", "brand-fill", "brand-accent-ink", "brand-accent-shade",
    "surface-page", "surface-raised", "surface-sunken", "surface-border",
    "text-primary", "text-secondary", "text-muted", "text-inverse",
    "color-success", "color-warning", "color-danger", "color-error", "color-info",
    "chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "chart-6", "chart-7", "chart-8",
  ];
  for (const slug of paletteSlugs) {
    if (t[slug]) palette.push({ slug: `tux-${slug}`, color: t[slug], name: `TUX ${title(slug)}` });
  }
  const font = (slug, family, name) => ({
    slug: `tux-${slug}`,
    name,
    fontFamily: family,
  });
  const doc = {
    $schema: "https://schemas.wp.org/trunk/theme.json",
    version: 3,
    _generated: GENERATED_NOTE,
    settings: {
      color: {
        palette,
        defaultPalette: false,
      },
      typography: {
        fontFamilies: [
          font("body", t["font-body"], "TUX Body (Open Sans)"),
          font("display", t["font-display"], "TUX Display (Oswald)"),
          font("bold", t["font-bold"], "TUX Bold (Work Sans)"),
          font("elegant", t["font-elegant"], "TUX Elegant (Georgia)"),
          font("mono", t["font-mono"], "TUX Mono (JetBrains Mono)"),
        ],
      },
      custom: {
        tux: {
          radius: {
            sm: t["radius-sm"], md: t["radius-md"], lg: t["radius-lg"],
            xl: t["radius-xl"], full: t["radius-full"],
          },
          wash: Object.fromEntries(
            Object.entries(t).filter(([k]) => k.startsWith("wash-")),
          ),
          rhythm: Object.fromEntries(
            Object.entries(t).filter(([k]) => k.startsWith("rhythm-")),
          ),
        },
      },
    },
  };
  return JSON.stringify(doc, null, 2) + "\n";
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

export function generate() {
  const themes = resolvedThemes();
  return new Map([
    ["kit/csharp/TuxTokens.cs", renderCsharp(themes)],
    ["kit/react/tux-tokens.ts", renderReact(themes)],
    ["kit/wp/theme.json", renderWordPress(themes)],
  ]);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const files = generate();
  for (const [rel, content] of files) {
    const abs = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  }
  process.stdout.write(`Wrote ${[...files.keys()].join(", ")}\n`);
}
