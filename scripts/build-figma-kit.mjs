/**
 * scripts/build-figma-kit.mjs — Deterministic Zero-Subscription Figma Kit Generator
 *
 * Generates `kit/figma/` from `design/tokens.json` and `app/utils/tuxCatalog.ts`:
 *   1. kit/figma/tokens.dtcg.json          — W3C DTCG 2025.10 tokens (Figma, Tokens Studio, Penpot)
 *   2. kit/figma/tokens-studio.json        — Multi-mode Tokens Studio for Figma payload (tti, tti-dark, tti-hc)
 *   3. kit/figma/figma-variables.json      — Native Figma Variables payload (COLOR/FLOAT/STRING + scopes + RGBA)
 *   4. kit/figma/code-connect.json         — 183-component Code Connect & multi-framework snippet registry
 *   5. kit/figma/svg-components/*.svg      — 12 Copy-to-Figma vector component sheets + manifest.json
 *   6. kit/figma/plugin/{manifest.json,code.js,ui.html} — Zero-subscription Local Figma Builder & Inspector Plugin
 *   7. kit/figma/README.md                 — Setup & architecture documentation
 *
 * DOCTRINE — Tier 1 of the two-tier kit pipeline (design/kit-pipeline.md):
 * Deterministic, zero external network dependencies, zero subscription required.
 * Locked by `tests/tux-kit-targets.test.ts` and `tests/tux-figma-kit.test.ts`.
 *
 * Run via `npm run build:figma` (part of `npm run build:kit`).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolvedThemes } from "./build-framework-targets.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const lucidePkg = JSON.parse(
  fs.readFileSync(path.join(ROOT, "node_modules/@iconify-json/lucide/icons.json"), "utf8"),
);

function getLucideBody(name) {
  const clean = String(name).replace(/^lucide:/, "");
  const resolved = lucidePkg.aliases?.[clean]?.parent || clean;
  return lucidePkg.icons?.[resolved]?.body || "";
}

/**
 * Render an inline Lucide vector group positioned at (x, y) with pixel size and stroke hex.
 */
function lucideSvgGroup(name, x, y, size, strokeHex) {
  const clean = String(name).replace(/^lucide:/, "");
  const body = getLucideBody(clean).replace(/currentColor/g, strokeHex);
  const scale = Math.round((size / 24) * 10000) / 10000;
  return `<g id="Icon / lucide:${clean}" transform="translate(${x}, ${y}) scale(${scale})">${body}</g>`;
}

/**
 * Render an inline <svg> tag for HTML plugin UI buttons.
 */
function lucideInlineHtmlSvg(name, size = 14) {
  const clean = String(name).replace(/^lucide:/, "");
  const body = getLucideBody(clean);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="flex-shrink:0">${body}</svg>`;
}

const GENERATED_NOTE =
  "GENERATED FILE — do not edit. Source: design/tokens.json & app/utils/tuxCatalog.ts via " +
  "scripts/build-figma-kit.mjs (npm run build:figma).";

// ---------------------------------------------------------------------------
// Color & Dimension Helpers
// ---------------------------------------------------------------------------

/**
 * Parse a #RRGGBB, #RGB, or rgba(r, g, b, a) string into Figma 0..1 RGBA + normalized hex.
 */
export function parseColorToFigmaRgba(raw) {
  const str = String(raw).trim();
  const hexMatch = str.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (hexMatch) {
    let h = hexMatch[1];
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    const r = Number.parseInt(h.slice(0, 2), 16);
    const g = Number.parseInt(h.slice(2, 4), 16);
    const b = Number.parseInt(h.slice(4, 6), 16);
    return {
      hex: `#${h.toUpperCase()}`,
      rgba: {
        r: Math.round((r / 255) * 10000) / 10000,
        g: Math.round((g / 255) * 10000) / 10000,
        b: Math.round((b / 255) * 10000) / 10000,
        a: 1,
      },
    };
  }
  const rgbaMatch = str.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9.]+))?\s*\)$/,
  );
  if (rgbaMatch) {
    const r = Number.parseInt(rgbaMatch[1], 10);
    const g = Number.parseInt(rgbaMatch[2], 10);
    const b = Number.parseInt(rgbaMatch[3], 10);
    const a = rgbaMatch[4] !== undefined ? Number.parseFloat(rgbaMatch[4]) : 1;
    const toHex = (n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0").toUpperCase();
    return {
      hex: `#${toHex(r)}${toHex(g)}${toHex(b)}`,
      rgba: {
        r: Math.round((r / 255) * 10000) / 10000,
        g: Math.round((g / 255) * 10000) / 10000,
        b: Math.round((b / 255) * 10000) / 10000,
        a: Math.round(a * 10000) / 10000,
      },
    };
  }
  return null;
}

/**
 * Convert CSS dimension strings ("0.375rem", "16px", "0", "80rem", "72ch") to numeric pixels.
 */
export function parseDimensionPx(raw) {
  const str = String(raw).trim();
  if (str === "0" || str === "0px" || str === "0rem") return 0;
  const pxMatch = str.match(/^(-?[0-9.]+)px$/);
  if (pxMatch) return Number.parseFloat(pxMatch[1]);
  const remMatch = str.match(/^(-?[0-9.]+)rem$/);
  if (remMatch) return Math.round(Number.parseFloat(remMatch[1]) * 16 * 100) / 100;
  const chMatch = str.match(/^(-?[0-9.]+)ch$/);
  if (chMatch) return Math.round(Number.parseFloat(chMatch[1]) * 8.5 * 100) / 100;
  return null;
}

/**
 * Extract primary font family name from a CSS font-family stack.
 */
export function primaryFontFamily(stack) {
  const m = String(stack).match(/^"?([^",]+)/);
  return m ? m[1].trim() : String(stack);
}

/**
 * Classify a flat token key (e.g. "brand-primary", "radius-md", "font-body") into category + DTCG type.
 */
function classifyToken(name, sampleValue) {
  const parts = name.split("-");
  const group = parts[0];
  const rest = parts.slice(1).join("-") || name;

  if (parseColorToFigmaRgba(sampleValue) !== null) {
    return { group, key: rest, dtcgType: "color", figmaType: "COLOR" };
  }
  if (group === "font") {
    return { group, key: rest, dtcgType: "fontFamily", figmaType: "STRING" };
  }
  if (group === "radius" || group === "space" || group === "rhythm" || group === "layout") {
    return { group, key: rest, dtcgType: "dimension", figmaType: "FLOAT" };
  }
  if (group === "motion") {
    return { group, key: rest, dtcgType: "duration", figmaType: "STRING" };
  }
  if (group === "ease") {
    return { group, key: rest, dtcgType: "cubicBezier", figmaType: "STRING" };
  }
  if (group === "shadow" || group === "elevation") {
    return { group, key: rest, dtcgType: "shadow", figmaType: "STRING" };
  }
  return { group, key: rest, dtcgType: "string", figmaType: "STRING" };
}

function getFigmaScopes(group, figmaType) {
  if (figmaType === "COLOR") {
    if (group === "surface" || group === "wash") return ["FRAME_FILL", "SHAPE_FILL"];
    if (group === "text") return ["TEXT_FILL"];
    if (group === "focus") return ["STROKE_COLOR"];
    return ["ALL_FILLS", "STROKE_COLOR"];
  }
  if (figmaType === "FLOAT") {
    if (group === "radius") return ["CORNER_RADIUS"];
    return ["GAP", "WIDTH_HEIGHT"];
  }
  if (group === "font") return ["FONT_FAMILY"];
  return ["ALL_SCOPES"];
}

// ---------------------------------------------------------------------------
// 1. W3C DTCG 2025.10 Exporter (kit/figma/tokens.dtcg.json)
// ---------------------------------------------------------------------------

export function renderDtcgTokens(themes) {
  const base = themes.tti;
  const dark = themes["tti-dark"];
  const hc = themes["tti-hc"];

  const groups = {};
  for (const [name, lightVal] of Object.entries(base)) {
    const { group, key, dtcgType } = classifyToken(name, lightVal);
    groups[group] ??= {};
    groups[group][key] = {
      $type: dtcgType,
      $value: lightVal,
      $description: `TUX canonical token --${name}`,
      $extensions: {
        "edu.tamu.tti.tux": {
          cssVar: `--${name}`,
          modes: {
            tti: lightVal,
            "tti-dark": dark[name] ?? lightVal,
            "tti-hc": hc[name] ?? lightVal,
          },
        },
      },
    };
  }

  const doc = {
    $schema: "https://tr.designtokens.org/format/",
    $metadata: {
      generator: GENERATED_NOTE,
      designSystem: "TUX (@tti/tti-ux)",
      institution: "Texas A&M Transportation Institute (TTI)",
      wcagConformance: "WCAG 2.2 Level AAA (7.0:1 text, 3.0:1 UI boundaries)",
      modes: ["tti", "tti-dark", "tti-hc"],
    },
    ...groups,
  };

  return JSON.stringify(doc, null, 2) + "\n";
}

// ---------------------------------------------------------------------------
// 2. Tokens Studio for Figma Exporter (kit/figma/tokens-studio.json)
// ---------------------------------------------------------------------------

export function renderTokensStudio(themes) {
  const modeSets = {};
  for (const [themeName, map] of Object.entries(themes)) {
    const grouped = {};
    for (const [name, val] of Object.entries(map)) {
      const { group, key, dtcgType } = classifyToken(name, val);
      grouped[group] ??= {};
      let studioType = "other";
      if (dtcgType === "color") studioType = "color";
      else if (dtcgType === "dimension") studioType = "dimension";
      else if (dtcgType === "fontFamily") studioType = "fontFamilies";
      else if (dtcgType === "shadow") studioType = "boxShadow";

      grouped[group][key] = {
        value: group === "font" ? primaryFontFamily(val) : val,
        type: studioType,
        description: `TUX --${name} (${themeName})`,
      };
    }
    modeSets[themeName] = grouped;
  }

  const doc = {
    _generated: GENERATED_NOTE,
    ...modeSets,
    $themes: [
      {
        id: "tux-light-tti",
        name: "Light (tti)",
        group: "TUX Theme",
        selectedTokenSets: { tti: "enabled", "tti-dark": "disabled", "tti-hc": "disabled" },
      },
      {
        id: "tux-dark-tti",
        name: "Dark (tti-dark)",
        group: "TUX Theme",
        selectedTokenSets: { tti: "disabled", "tti-dark": "enabled", "tti-hc": "disabled" },
      },
      {
        id: "tux-hc-tti",
        name: "High Contrast AAA (tti-hc)",
        group: "TUX Theme",
        selectedTokenSets: { tti: "disabled", "tti-dark": "disabled", "tti-hc": "enabled" },
      },
    ],
    $metadata: {
      tokenSetOrder: ["tti", "tti-dark", "tti-hc"],
    },
  };

  return JSON.stringify(doc, null, 2) + "\n";
}

// ---------------------------------------------------------------------------
// 3. Figma Variables Native Payload (kit/figma/figma-variables.json)
// ---------------------------------------------------------------------------

export function buildFigmaVariablesPayload(themes) {
  const base = themes.tti;
  const dark = themes["tti-dark"];
  const hc = themes["tti-hc"];

  const variables = [];

  for (const [name, lightVal] of Object.entries(base)) {
    const { group, key, figmaType } = classifyToken(name, lightVal);
    // Skip complex CSS shadows/cubic-beziers in Variables (handled as Effect Styles)
    if (group === "shadow" || group === "elevation" || group === "ease" || group === "motion") {
      continue;
    }

    const figmaName = `${group}/${key}`;
    const scopes = getFigmaScopes(group, figmaType);
    const pascal = name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
    const camel = pascal.charAt(0).toLowerCase() + pascal.slice(1);
    const screaming = name.replace(/-/g, "_").toUpperCase();

    const formatModeVal = (rawVal) => {
      if (figmaType === "COLOR") {
        return parseColorToFigmaRgba(rawVal) ?? parseColorToFigmaRgba("#000000");
      }
      if (figmaType === "FLOAT") {
        return parseDimensionPx(rawVal) ?? 0;
      }
      if (group === "font") {
        return primaryFontFamily(rawVal);
      }
      return String(rawVal);
    };

    variables.push({
      name: figmaName,
      cssToken: `--${name}`,
      resolvedType: figmaType,
      description: `TUX canonical token --${name}`,
      scopes,
      codeSyntax: {
        WEB: `var(--${name})`,
        ANDROID: `TuxTokens.Tti.${screaming}`,
        iOS: `TuxTokens.Tti.${camel}`,
      },
      valuesByMode: {
        tti: formatModeVal(lightVal),
        "tti-dark": formatModeVal(dark[name] ?? lightVal),
        "tti-hc": formatModeVal(hc[name] ?? lightVal),
      },
    });
  }

  return {
    _generated: GENERATED_NOTE,
    version: "3.0.0",
    collection: "TUX Institutional Tokens",
    zeroSubscriptionNote:
      "Works on Figma Free Starter Plan via kit/figma/plugin/manifest.json (auto-falls back to 3 single-mode collections if team limits multi-mode variables).",
    modes: [
      { modeId: "tti", name: "Light (tti)" },
      { modeId: "tti-dark", name: "Dark (tti-dark)" },
      { modeId: "tti-hc", name: "High Contrast AAA (tti-hc)" },
    ],
    variables,
  };
}

export function renderFigmaVariables(themes) {
  return JSON.stringify(buildFigmaVariablesPayload(themes), null, 2) + "\n";
}

// ---------------------------------------------------------------------------
// 4. Code Connect & 183-Component Registry (kit/figma/code-connect.json)
// ---------------------------------------------------------------------------

function kebabCase(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function loadCatalogEntries() {
  const catalogPath = path.join(ROOT, "app/utils/tuxCatalog.ts");
  const fullSrc = fs.readFileSync(catalogPath, "utf8");
  const startIdx = fullSrc.indexOf("export const tuxCatalog: TuxCatalogEntry[] = [");
  const endIdx = fullSrc.indexOf("];", startIdx);
  const src = startIdx >= 0 && endIdx > startIdx ? fullSrc.slice(startIdx, endIdx) : fullSrc;

  const entries = [];
  const entryRe = /\{\s*name:\s*"([^"]+)"[\s\S]*?blurb:\s*"((?:[^"\\]|\\.)*)"\s*,?\s*\}/g;
  for (const m of src.matchAll(entryRe)) {
    const block = m[0];
    const name = m[1];
    const blurb = m[2].replace(/\\"/g, '"');
    const to = block.match(/to:\s*"([^"]+)"/)?.[1] || "";
    const icon = block.match(/icon:\s*"([^"]+)"/)?.[1] || "lucide:box";
    const family = block.match(/family:\s*"([^"]+)"/)?.[1] || "components";
    const kind = block.match(/kind:\s*"([^"]+)"/)?.[1] || "component";
    const wraps = block.match(/wraps:\s*"((?:[^"\\]|\\.)*)"/)?.[1]?.replace(/\\"/g, '"') || "tux native";
    const category =
      block.match(/category:\s*"([^"]+)"/)?.[1] ||
      block.match(/vizCategory:\s*"([^"]+)"/)?.[1] ||
      "general";
    entries.push({ name, to, icon, family, kind, wraps, category, blurb });
  }
  return entries;
}

export function buildCodeConnectRegistry() {
  const entries = loadCatalogEntries();
  const components = entries.map((entry) => {
    const tag = kebabCase(entry.name);
    const shortSlug = tag.replace(/^tux-/, "");
    const isComposable = entry.kind === "composable" || entry.name.startsWith("use");

    const snippets = isComposable
      ? {
          vue: `const state = ${entry.name}();`,
          react: `import { ${entry.name} } from "@tti/tti-ux-react";\nconst state = ${entry.name}();`,
          webComponents: `// Composable utility — bind via custom element properties`,
          blazor: `@inject I${entry.name.replace(/^use/, "")}Service Service`,
          wordpress: `<?php /* TUX ${entry.name} helper */ ?>`,
        }
      : {
          vue: `<${entry.name} />`,
          react: `import { ${entry.name} } from "@tti/tti-ux-react";\n\n<${entry.name} />`,
          webComponents: `<${tag}></${tag}>`,
          blazor: `<${entry.name} />`,
          wordpress: `[tux_${shortSlug.replace(/-/g, "_")}]`,
        };

    return {
      name: entry.name,
      tagName: isComposable ? entry.name : tag,
      kind: entry.kind,
      family: entry.family,
      category: entry.category,
      wraps: entry.wraps,
      blurb: entry.blurb,
      route: entry.to,
      docsUrl: `https://ux.tti.tamu.edu${entry.to}`,
      figmaNodePattern: `TUX / ${entry.name}`,
      a11y: {
        wcagLevel: "AAA",
        textContrast: ">= 7.0:1",
        uiContrast: ">= 3.0:1",
        minTouchTarget: "44x44px",
      },
      snippets,
    };
  });

  return {
    _generated: GENERATED_NOTE,
    version: "3.0.0",
    totalCatalogCount: components.length,
    description:
      "Complete 183-entry TUX Code Connect & Component Blueprint Registry. Powers the built-in Zero-Subscription Figma Plugin Inspector and Dev Mode mappings.",
    components,
  };
}

export function renderCodeConnect() {
  return JSON.stringify(buildCodeConnectRegistry(), null, 2) + "\n";
}

// ---------------------------------------------------------------------------
// 5. Copy-to-Figma SVG Component Sheets (kit/figma/svg-components/*.svg)
// ---------------------------------------------------------------------------

export function buildSvgComponentSheets(themes) {
  const t = themes.tti;
  const d = themes["tti-dark"];

  const sheets = [
    {
      id: "tux-color-palette",
      name: "TuxTokens · Color Swatches & Typography",
      category: "Foundations & Tokens",
      route: "/tokens",
      dimensions: "760 × 260",
      description:
        "Canonical TTI Light, Dark, 5-Band Spectrum, and ADR-0013 Status color swatches plus Oswald, Open Sans, and JetBrains Mono type specimens.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="260" viewBox="0 0 760 260" fill="none">
  <rect id="TUX / Color &amp; Typography Sheet" width="760" height="260" rx="8" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
  <text x="24" y="32" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">TUX / FOUNDATIONS · BRAND, SURFACE, SPECTRUM &amp; STATUS SWATCHES</text>
  <line x1="24" y1="42" x2="736" y2="42" stroke="${t["brand-accent"]}" stroke-width="2"/>
  <g id="Swatches / Brand &amp; Surfaces" transform="translate(24, 54)">
    <g id="Swatch / brand-primary" transform="translate(0, 0)">
      <rect width="82" height="56" rx="4" fill="${t["brand-primary"]}"/>
      <text x="8" y="24" fill="${t["text-on-brand"]}" font-family="Open Sans, sans-serif" font-size="11" font-weight="700">Maroon</text>
      <text x="8" y="42" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="10">${t["brand-primary"]}</text>
    </g>
    <g id="Swatch / brand-primary-deep" transform="translate(90, 0)">
      <rect width="82" height="56" rx="4" fill="${t["brand-primary-deep"]}"/>
      <text x="8" y="24" fill="${t["text-on-brand"]}" font-family="Open Sans, sans-serif" font-size="11" font-weight="700">Deep</text>
      <text x="8" y="42" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="10">${t["brand-primary-deep"]}</text>
    </g>
    <g id="Swatch / brand-accent" transform="translate(180, 0)">
      <rect width="82" height="56" rx="4" fill="${t["brand-accent"]}"/>
      <text x="8" y="24" fill="${t["brand-accent-ink"]}" font-family="Open Sans, sans-serif" font-size="11" font-weight="700">Warm Gold</text>
      <text x="8" y="42" fill="${t["brand-accent-ink"]}" font-family="JetBrains Mono, monospace" font-size="10">${t["brand-accent"]}</text>
    </g>
    <g id="Swatch / tti-navy" transform="translate(270, 0)">
      <rect width="82" height="56" rx="4" fill="${t["tti-navy"]}"/>
      <text x="8" y="24" fill="${t["text-on-brand"]}" font-family="Open Sans, sans-serif" font-size="11" font-weight="700">TTI Navy</text>
      <text x="8" y="42" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="10">${t["tti-navy"]}</text>
    </g>
    <g id="Swatch / surface-eggshell" transform="translate(360, 0)">
      <rect width="82" height="56" rx="4" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
      <text x="8" y="24" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="11" font-weight="700">Eggshell</text>
      <text x="8" y="42" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="10">${t["surface-eggshell"]}</text>
    </g>
    <g id="Swatch / surface-sunken" transform="translate(450, 0)">
      <rect width="82" height="56" rx="4" fill="${t["surface-sunken"]}" stroke="${t["surface-border"]}"/>
      <text x="8" y="24" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="11" font-weight="700">Sunken</text>
      <text x="8" y="42" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="10">${t["surface-sunken"]}</text>
    </g>
    <g id="Swatch / dark-surface" transform="translate(540, 0)">
      <rect width="82" height="56" rx="4" fill="${d["surface-page"]}" stroke="${d["surface-border"]}"/>
      <text x="8" y="24" fill="${d["text-primary"]}" font-family="Open Sans, sans-serif" font-size="11" font-weight="700">Dark Page</text>
      <text x="8" y="42" fill="${d["text-secondary"]}" font-family="JetBrains Mono, monospace" font-size="10">${d["surface-page"]}</text>
    </g>
    <g id="Swatch / dark-brand" transform="translate(630, 0)">
      <rect width="82" height="56" rx="4" fill="${d["brand-primary"]}"/>
      <text x="8" y="24" fill="${d["surface-page"]}" font-family="Open Sans, sans-serif" font-size="11" font-weight="700">Dark Teal</text>
      <text x="8" y="42" fill="${d["surface-page"]}" font-family="JetBrains Mono, monospace" font-size="10">${d["brand-primary"]}</text>
    </g>
  </g>
  <g id="Swatches / Spectrum &amp; Status" transform="translate(24, 120)">
    <rect x="0" y="0" width="76" height="36" rx="3" fill="${t["spectrum-maroon"]}"/>
    <text x="8" y="22" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="10">${t["spectrum-maroon"]}</text>
    <rect x="82" y="0" width="76" height="36" rx="3" fill="${t["spectrum-blue"]}"/>
    <text x="90" y="22" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="10">${t["spectrum-blue"]}</text>
    <rect x="164" y="0" width="76" height="36" rx="3" fill="${t["spectrum-teal"]}"/>
    <text x="172" y="22" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="10">${t["spectrum-teal"]}</text>
    <rect x="246" y="0" width="76" height="36" rx="3" fill="${t["spectrum-green"]}"/>
    <text x="254" y="22" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="10">${t["spectrum-green"]}</text>
    <rect x="328" y="0" width="76" height="36" rx="3" fill="${t["spectrum-gold"]}"/>
    <text x="336" y="22" fill="${t["text-primary"]}" font-family="JetBrains Mono, monospace" font-size="10">${t["spectrum-gold"]}</text>
    <rect x="416" y="0" width="70" height="36" rx="3" fill="${t["status-ok"]}"/>
    <text x="424" y="22" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="10">OK</text>
    <rect x="492" y="0" width="70" height="36" rx="3" fill="${t["status-warning"]}"/>
    <text x="500" y="22" fill="${t["text-primary"]}" font-family="JetBrains Mono, monospace" font-size="10">WARN</text>
    <rect x="568" y="0" width="70" height="36" rx="3" fill="${t["status-unknown"]}"/>
    <text x="576" y="22" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="10">UNK</text>
    <rect x="644" y="0" width="68" height="36" rx="3" fill="${t["status-critical"]}"/>
    <text x="652" y="22" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="10">CRIT</text>
  </g>
  <g id="Typography Scale" transform="translate(24, 172)">
    <rect width="712" height="68" rx="4" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
    <text x="16" y="28" fill="${t["text-primary"]}" font-family="Oswald, sans-serif" font-size="20" font-weight="700">Oswald Display · H1–H3 Headings</text>
    <text x="16" y="50" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="13">Open Sans Body (16px / 1.65) · ≥ 7.0:1 AAA Contrast</text>
    <text x="410" y="28" fill="${t["brand-primary"]}" font-family="JetBrains Mono, monospace" font-size="13" font-weight="700">JetBrains Mono · Tabular Telemetry</text>
    <text x="410" y="50" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="12">STA 104+00 · n = 28,400 · 99.4% ± 0.2%</text>
  </g>
</svg>`,
    },
    {
      id: "tux-button",
      name: "TuxButton",
      category: "Actions & Commands",
      route: "/components/button",
      dimensions: "760 × 220",
      description:
        "Primary, Secondary, Ghost, and Destructive intents with Lucide icons and dark-mode variants.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="220" viewBox="0 0 760 220" fill="none">
  <rect id="TUX / TuxButton Sheet" width="760" height="220" rx="8" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
  <text x="24" y="34" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">TUX / TUXBUTTON · INTENTS (PRIMARY, SECONDARY, GHOST, DESTRUCTIVE)</text>
  <line x1="24" y1="44" x2="736" y2="44" stroke="${t["brand-accent"]}" stroke-width="2"/>
  <g id="Button / Primary (Light)" transform="translate(24, 64)">
    <rect width="164" height="44" rx="2" fill="${t["brand-primary"]}"/>
    ${lucideSvgGroup("play", 20, 14, 16, t["text-on-brand"])}
    <text x="44" y="27" fill="${t["text-on-brand"]}" font-family="Open Sans, sans-serif" font-size="14" font-weight="600">Primary Action</text>
  </g>
  <g id="Button / Secondary (Light)" transform="translate(204, 64)">
    <rect width="164" height="44" rx="2" fill="${t["surface-page"]}" stroke="${t["surface-border"]}" stroke-width="1.5"/>
    <text x="82" y="27" text-anchor="middle" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="14" font-weight="600">Secondary</text>
  </g>
  <g id="Button / Ghost (Light)" transform="translate(384, 64)">
    <rect width="152" height="44" rx="2" fill="${t["surface-sunken"]}"/>
    <text x="76" y="27" text-anchor="middle" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="14" font-weight="600">Ghost Action</text>
  </g>
  <g id="Button / Destructive (Light)" transform="translate(552, 64)">
    <rect width="160" height="44" rx="2" fill="${t["surface-page"]}" stroke="${t["color-error"]}" stroke-width="1.5"/>
    ${lucideSvgGroup("trash-2", 26, 14, 16, t["color-error"])}
    <text x="50" y="27" fill="${t["color-error"]}" font-family="Open Sans, sans-serif" font-size="14" font-weight="600">Destructive</text>
  </g>
  <g id="Dark Surface Strip" transform="translate(24, 128)">
    <rect width="712" height="68" rx="6" fill="${d["surface-page"]}" stroke="${d["surface-border"]}"/>
    <g id="Button / Primary (Dark)" transform="translate(16, 12)">
      <rect width="164" height="44" rx="2" fill="${d["brand-primary"]}"/>
      <text x="82" y="27" text-anchor="middle" fill="${d["surface-page"]}" font-family="Open Sans, sans-serif" font-size="14" font-weight="700">Dark Primary</text>
    </g>
    <g id="Button / Secondary (Dark)" transform="translate(196, 12)">
      <rect width="164" height="44" rx="2" fill="${d["surface-raised"]}" stroke="${d["surface-border"]}" stroke-width="1.5"/>
      <text x="82" y="27" text-anchor="middle" fill="${d["text-primary"]}" font-family="Open Sans, sans-serif" font-size="14" font-weight="600">Dark Secondary</text>
    </g>
    <text x="384" y="39" fill="${d["text-secondary"]}" font-family="JetBrains Mono, monospace" font-size="12">shape="default | sharp | pill" · Focus ring: ${t["focus-ring-outer"]}</text>
  </g>
</svg>`,
    },
    {
      id: "tux-badge",
      name: "TuxBadge",
      category: "Feedback & Status",
      route: "/components/badge",
      dimensions: "760 × 200",
      description:
        "Security classification tiers (public, internal, sensitive, restricted) and HCM Level-of-Service (LOS A–F) badges with Lucide glyphs.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="200" viewBox="0 0 760 200" fill="none">
  <rect id="TUX / TuxBadge Sheet" width="760" height="200" rx="8" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
  <text x="24" y="34" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">TUX / TUXBADGE · SECURITY TIERS &amp; HCM LOS A–F (LUCIDE GLYPHS)</text>
  <line x1="24" y1="44" x2="736" y2="44" stroke="${t["brand-accent"]}" stroke-width="2"/>
  <g id="Badge / Tier Public" transform="translate(24, 62)">
    <rect width="112" height="28" rx="2" fill="${t["surface-sunken"]}" stroke="${t["color-info"]}"/>
    ${lucideSvgGroup("globe", 10, 7, 14, t["color-info"])}
    <text x="30" y="18" fill="${t["color-info"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="600">public</text>
  </g>
  <g id="Badge / Tier Internal" transform="translate(148, 62)">
    <rect width="118" height="28" rx="2" fill="${t["surface-sunken"]}" stroke="${t["surface-border"]}"/>
    ${lucideSvgGroup("building-2", 10, 7, 14, t["text-primary"])}
    <text x="30" y="18" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="600">internal</text>
  </g>
  <g id="Badge / Tier Sensitive" transform="translate(278, 62)">
    <rect width="124" height="28" rx="2" fill="${t["surface-eggshell"]}" stroke="${t["brand-primary"]}"/>
    ${lucideSvgGroup("shield-alert", 10, 7, 14, t["brand-primary"])}
    <text x="30" y="18" fill="${t["brand-primary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="600">sensitive</text>
  </g>
  <g id="Badge / Tier Restricted" transform="translate(414, 62)">
    <rect width="132" height="28" rx="2" fill="${t["brand-primary"]}"/>
    ${lucideSvgGroup("lock", 10, 7, 14, t["text-on-brand"])}
    <text x="30" y="18" fill="${t["text-on-brand"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="700">restricted</text>
  </g>
  <g id="HCM Level of Service Row" transform="translate(24, 112)">
    <text x="0" y="18" fill="${t["text-secondary"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="600">HCM LOS:</text>
    <g id="LOS A" transform="translate(72, 0)">
      <rect width="88" height="28" rx="2" fill="${t["status-ok"]}"/>
      ${lucideSvgGroup("gauge", 10, 7, 14, t["text-on-brand"])}
      <text x="30" y="18" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">LOS A</text>
    </g>
    <g id="LOS B" transform="translate(170, 0)">
      <rect width="88" height="28" rx="2" fill="${t["color-success"]}"/>
      ${lucideSvgGroup("check-circle-2", 10, 7, 14, t["text-on-brand"])}
      <text x="30" y="18" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">LOS B</text>
    </g>
    <g id="LOS C" transform="translate(268, 0)">
      <rect width="88" height="28" rx="2" fill="${t["color-info"]}"/>
      ${lucideSvgGroup("activity", 10, 7, 14, t["text-on-brand"])}
      <text x="30" y="18" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">LOS C</text>
    </g>
    <g id="LOS D" transform="translate(366, 0)">
      <rect width="88" height="28" rx="2" fill="${t["color-gold-800"]}"/>
      ${lucideSvgGroup("alert-circle", 10, 7, 14, t["text-on-brand"])}
      <text x="30" y="18" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">LOS D</text>
    </g>
    <g id="LOS E" transform="translate(464, 0)">
      <rect width="88" height="28" rx="2" fill="${t["status-unknown"]}"/>
      ${lucideSvgGroup("alert-triangle", 10, 7, 14, t["text-on-brand"])}
      <text x="30" y="18" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">LOS E</text>
    </g>
    <g id="LOS F" transform="translate(562, 0)">
      <rect width="88" height="28" rx="2" fill="${t["status-critical"]}"/>
      ${lucideSvgGroup("alert-octagon", 10, 7, 14, t["text-on-brand"])}
      <text x="30" y="18" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">LOS F</text>
    </g>
  </g>
  <text x="24" y="174" fill="${t["text-muted"]}" font-family="Open Sans, sans-serif" font-size="12">Multi-channel encoding: Semantic Color + Lucide Glyph + Explicit Label</text>
</svg>`,
    },
    {
      id: "tux-alert",
      name: "TuxAlert",
      category: "Feedback & Status",
      route: "/components/alert",
      dimensions: "760 × 230",
      description:
        "Callout banners with 4px left-bar accents and leading Lucide icons across 8 variants (note, tip, info, important, success, warning, danger, compliance).",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="230" viewBox="0 0 760 230" fill="none">
  <rect id="TUX / TuxAlert Sheet" width="760" height="230" rx="8" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
  <text x="24" y="34" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">TUX / TUXALERT · CALLOUTS WITH 4PX LEFT BAR &amp; LUCIDE ICONS</text>
  <line x1="24" y1="44" x2="736" y2="44" stroke="${t["brand-accent"]}" stroke-width="2"/>
  <g id="Alert / Important" transform="translate(24, 60)">
    <rect width="712" height="68" rx="4" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
    <rect width="4" height="68" fill="${t["brand-primary"]}"/>
    ${lucideSvgGroup("bookmark", 18, 16, 18, t["brand-primary"])}
    <text x="44" y="28" fill="${t["brand-primary"]}" font-family="Open Sans, sans-serif" font-size="14" font-weight="700">Institutional Provenance &amp; Accessibility Standard</text>
    <text x="44" y="50" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="13">All telemetry tables and roadway advisories maintain ≥ 7.0:1 normal text contrast across light, dark, and high-contrast modes.</text>
  </g>
  <g id="Alert / Danger" transform="translate(24, 142)">
    <rect width="712" height="68" rx="4" fill="${t["surface-page"]}" stroke="${t["status-critical"]}"/>
    <rect width="4" height="68" fill="${t["status-critical"]}"/>
    ${lucideSvgGroup("circle-x", 18, 16, 18, t["status-critical"])}
    <text x="44" y="28" fill="${t["status-critical"]}" font-family="Open Sans, sans-serif" font-size="14" font-weight="700">Corridor Telemetry Feed Interrupted — IH-35W Northbound Sensor Array</text>
    <text x="44" y="50" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="13">Automatic fallback to archival 5-minute loop detector aggregates activated. Verify RSU uplink at STA 142+50.</text>
  </g>
</svg>`,
    },
    {
      id: "tux-card",
      name: "TuxCard",
      category: "Data Display & Records",
      route: "/components/card",
      dimensions: "760 × 240",
      description:
        "Elevation-aware surface card with spectrum top bar, eyebrow kicker, Oswald display heading, and metadata footer.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="240" viewBox="0 0 760 240" fill="none">
  <rect id="TUX / TuxCard Sheet" width="760" height="240" rx="8" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
  <g id="Card / Research Division (Light)" transform="translate(24, 20)">
    <rect width="344" height="200" rx="6" fill="${t["surface-raised"]}" stroke="${t["surface-border"]}"/>
    <rect width="344" height="4" rx="2" fill="${t["brand-primary"]}"/>
    <text x="20" y="32" fill="${t["brand-primary"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" letter-spacing="1">CONNECTED CORRIDORS · TXDOT</text>
    <text x="20" y="58" fill="${t["text-primary"]}" font-family="Oswald, sans-serif" font-size="20" font-weight="700">Automated Freight Platooning Study</text>
    <line x1="20" y1="68" x2="84" y2="68" stroke="${t["brand-accent"]}" stroke-width="2"/>
    <text x="20" y="94" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="13">Field evaluation of V2X low-latency BSM telemetry along the I-10 Texas Freight Corridor.</text>
    <line x1="20" y1="154" x2="324" y2="154" stroke="${t["surface-border-subtle"]}"/>
    <text x="20" y="178" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11">Project 0-7142 · DOI: 10.5555/tti.2026</text>
  </g>
  <g id="Card / Research Division (Dark)" transform="translate(392, 20)">
    <rect width="344" height="200" rx="6" fill="${d["surface-raised"]}" stroke="${d["surface-border"]}"/>
    <rect width="344" height="4" rx="2" fill="${d["brand-primary"]}"/>
    <text x="20" y="32" fill="${d["brand-primary"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" letter-spacing="1">RELLIS PROVING GROUNDS · DARK</text>
    <text x="20" y="58" fill="${d["text-primary"]}" font-family="Oswald, sans-serif" font-size="20" font-weight="700">Roadside LiDAR Occlusion Benchmark</text>
    <line x1="20" y1="68" x2="84" y2="68" stroke="${d["brand-accent"]}" stroke-width="2"/>
    <text x="20" y="94" fill="${d["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="13">Sub-centimeter pedestrian trajectory reconstruction under heavy precipitation conditions.</text>
    <line x1="20" y1="154" x2="324" y2="154" stroke="${d["surface-border-subtle"]}"/>
    <text x="20" y="178" fill="${d["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11">n = 28,400 frames · 99.4% Recall</text>
  </g>
</svg>`,
    },
    {
      id: "tux-big-stat",
      name: "TuxBigStat",
      category: "Data Display & Records",
      route: "/components/big-stat",
      dimensions: "760 × 190",
      description:
        "Hero KPI statistical readout with Oswald tabular numerals, YoY delta badge, sample size (n), confidence interval, and DOI provenance.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="190" viewBox="0 0 760 190" fill="none">
  <rect id="TUX / TuxBigStat Sheet" width="760" height="190" rx="8" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
  <g id="BigStat / Sponsored Research" transform="translate(24, 20)">
    <rect width="344" height="150" rx="6" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
    <rect width="4" height="150" fill="${t["brand-primary"]}"/>
    <text x="24" y="34" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="600">SPONSORED RESEARCH EXPENDITURE</text>
    <text x="24" y="84" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="44" font-weight="700">$126.4M</text>
    <rect x="204" y="56" width="96" height="24" rx="4" fill="${t["status-ok"]}"/>
    <text x="252" y="72" text-anchor="middle" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">+14.2% YoY</text>
    <text x="24" y="112" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="13">Across 720+ active federal, state, and industry studies</text>
    <text x="24" y="136" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11">n = 724 projects · 95% CI [±1.4%] · FY 2026</text>
  </g>
  <g id="BigStat / Crash Reduction" transform="translate(392, 20)">
    <rect width="344" height="150" rx="6" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
    <rect width="4" height="150" fill="${t["tti-navy"]}"/>
    <text x="24" y="34" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="600">WORK-ZONE QUEUE WARNING EFFICACY</text>
    <text x="24" y="84" fill="${t["tti-navy"]}" font-family="Oswald, sans-serif" font-size="44" font-weight="700">-38.6%</text>
    <rect x="190" y="56" width="124" height="24" rx="4" fill="${t["tti-navy"]}"/>
    <text x="252" y="72" text-anchor="middle" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">REAR-END CRASHES</text>
    <text x="24" y="112" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="13">Smart Arrow Board + portable radar queue deployment</text>
    <text x="24" y="136" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11">n = 148 corridors · DOI: 10.5555/tti.wz.26</text>
  </g>
</svg>`,
    },
    {
      id: "tux-status",
      name: "TuxStatus",
      category: "Feedback & Status",
      route: "/components/status",
      dimensions: "760 × 170",
      description:
        "ADR-0013 Operational Status Palette (OK, WARNING, UNKNOWN, CRITICAL, MAINT, PENDING) with multi-channel shape glyphs.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="170" viewBox="0 0 760 170" fill="none">
  <rect id="TUX / TuxStatus Sheet" width="760" height="170" rx="8" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
  <text x="24" y="34" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">TUX / TUXSTATUS · ADR-0013 OPERATIONAL TELEMETRY PALETTE</text>
  <line x1="24" y1="44" x2="736" y2="44" stroke="${t["brand-accent"]}" stroke-width="2"/>
  <g id="Status / OK" transform="translate(24, 68)">
    <rect width="96" height="32" rx="4" fill="${t["status-ok-fill"]}" stroke="${t["status-ok"]}" stroke-width="1.5"/>
    <g id="Glyph / OK" transform="translate(10, 8)">
      <circle cx="8" cy="8" r="7" fill="${t["status-ok"]}"/>
      <path d="M4.75 8.25 L6.75 10.25 L11.25 5.75" fill="none" stroke="${t["text-on-brand"]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <text x="34" y="20" fill="${t["status-ok-ink"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">OK</text>
  </g>
  <g id="Status / Warning" transform="translate(132, 68)">
    <rect width="114" height="32" rx="4" fill="${t["status-warning-fill"]}" stroke="${t["status-warning"]}" stroke-width="1.5"/>
    <g id="Glyph / Warning" transform="translate(10, 8)">
      <path d="M8 1.75 L15 14.25 H1 Z" fill="${t["status-warning"]}"/>
      <path d="M8 5.75 V9.5 M8 12 V12.5" stroke="${t["text-primary"]}" stroke-width="1.75" stroke-linecap="round"/>
    </g>
    <text x="32" y="20" fill="${t["status-warning-ink"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">WARNING</text>
  </g>
  <g id="Status / Unknown" transform="translate(258, 68)">
    <rect width="116" height="32" rx="4" fill="${t["status-unknown-fill"]}" stroke="${t["status-unknown"]}" stroke-width="1.5"/>
    <g id="Glyph / Unknown" transform="translate(10, 8)">
      <polygon points="8,1.5 14.5,8 8,14.5 1.5,8" fill="${t["status-unknown"]}"/>
      <path d="M6.5 6 C6.5 5 7.2 4.5 8 4.5 C8.8 4.5 9.5 5 9.5 5.8 C9.5 6.6 8.8 7.2 8 7.7 V9 M8 11.25 V11.75" fill="none" stroke="${t["text-on-brand"]}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <text x="32" y="20" fill="${t["status-unknown-ink"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">UNKNOWN</text>
  </g>
  <g id="Status / Critical" transform="translate(386, 68)">
    <rect width="120" height="32" rx="4" fill="${t["status-critical-fill"]}" stroke="${t["status-critical"]}" stroke-width="1.5"/>
    <g id="Glyph / Critical" transform="translate(10, 8)">
      <polygon points="5.25,1 10.75,1 15,5.25 15,10.75 10.75,15 5.25,15 1,10.75 1,5.25" fill="${t["status-critical"]}"/>
      <path d="M5.5 5.5 L10.5 10.5 M10.5 5.5 L5.5 10.5" stroke="${t["text-on-brand"]}" stroke-width="2" stroke-linecap="round"/>
    </g>
    <text x="32" y="20" fill="${t["status-critical-ink"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">CRITICAL</text>
  </g>
  <g id="Status / Maintenance" transform="translate(518, 68)">
    <rect width="102" height="32" rx="4" fill="${t["status-maintenance-fill"]}" stroke="${t["status-maintenance"]}" stroke-width="1.5"/>
    <g id="Glyph / Maintenance" transform="translate(10, 8)">
      <rect x="1.5" y="1.5" width="13" height="13" rx="2.5" fill="${t["status-maintenance"]}"/>
      <path d="M4.5 8 H11.5" stroke="${t["text-on-brand"]}" stroke-width="2" stroke-linecap="round"/>
    </g>
    <text x="32" y="20" fill="${t["status-maintenance-ink"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">MAINT</text>
  </g>
  <g id="Status / Pending" transform="translate(632, 68)">
    <rect width="104" height="32" rx="4" fill="${t["status-pending-fill"]}" stroke="${t["status-pending"]}" stroke-width="1.5"/>
    <g id="Glyph / Pending" transform="translate(10, 8)">
      <circle cx="8" cy="8" r="7" fill="${t["status-pending"]}"/>
      <path d="M8 4.5 V8 H11" fill="none" stroke="${t["text-on-brand"]}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <text x="32" y="20" fill="${t["status-pending-ink"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">PENDING</text>
  </g>
  <text x="24" y="138" fill="${t["text-secondary"]}" font-family="JetBrains Mono, monospace" font-size="12">OK ${t["status-ok"]} · WARN ${t["status-warning"]} · UNK ${t["status-unknown"]} · CRIT ${t["status-critical"]} · MAINT ${t["status-maintenance"]}</text>
</svg>`,
    },
    {
      id: "tux-spectrum-ribbon",
      name: "TuxSpectrumRibbon",
      category: "Navigation & Layout",
      route: "/components/spectrum-ribbon",
      dimensions: "760 × 160",
      description:
        "The 5-band institutional brand spectrum ribbon (Maroon, Slate Blue, Slate Teal, Sage Green, Ochre Gold) from my.tti.tamu.edu.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="160" viewBox="0 0 760 160" fill="none">
  <rect id="TUX / TuxSpectrumRibbon Sheet" width="760" height="160" rx="8" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
  <text x="24" y="34" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">TUX / TUXSPECTRUMRIBBON · 5-BAND TTI BRAND SPECTRUM</text>
  <g id="Spectrum 5-Band Bar" transform="translate(24, 52)">
    <g id="Band 1 / Maroon">
      <rect x="0" y="0" width="142.4" height="16" fill="${t["spectrum-maroon"]}"/>
      <rect x="0" y="24" width="136" height="58" rx="4" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
      <text x="10" y="44" fill="${t["spectrum-maroon"]}" font-family="Oswald, sans-serif" font-size="13" font-weight="700">MAROON</text>
      <text x="10" y="64" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11">${t["spectrum-maroon"]}</text>
    </g>
    <g id="Band 2 / Slate Blue" transform="translate(142.4, 0)">
      <rect x="0" y="0" width="142.4" height="16" fill="${t["spectrum-blue"]}"/>
      <rect x="2" y="24" width="136" height="58" rx="4" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
      <text x="12" y="44" fill="${t["spectrum-blue"]}" font-family="Oswald, sans-serif" font-size="13" font-weight="700">SLATE BLUE</text>
      <text x="12" y="64" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11">${t["spectrum-blue"]}</text>
    </g>
    <g id="Band 3 / Slate Teal" transform="translate(284.8, 0)">
      <rect x="0" y="0" width="142.4" height="16" fill="${t["spectrum-teal"]}"/>
      <rect x="4" y="24" width="136" height="58" rx="4" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
      <text x="14" y="44" fill="${t["spectrum-teal"]}" font-family="Oswald, sans-serif" font-size="13" font-weight="700">SLATE TEAL</text>
      <text x="14" y="64" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11">${t["spectrum-teal"]}</text>
    </g>
    <g id="Band 4 / Sage Green" transform="translate(427.2, 0)">
      <rect x="0" y="0" width="142.4" height="16" fill="${t["spectrum-green"]}"/>
      <rect x="6" y="24" width="136" height="58" rx="4" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
      <text x="16" y="44" fill="${t["spectrum-green"]}" font-family="Oswald, sans-serif" font-size="13" font-weight="700">SAGE GREEN</text>
      <text x="16" y="64" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11">${t["spectrum-green"]}</text>
    </g>
    <g id="Band 5 / Ochre Gold" transform="translate(569.6, 0)">
      <rect x="0" y="0" width="142.4" height="16" fill="${t["spectrum-gold"]}"/>
      <rect x="6" y="24" width="136" height="58" rx="4" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
      <text x="16" y="44" fill="${t["color-gold-800"]}" font-family="Oswald, sans-serif" font-size="13" font-weight="700">OCHRE GOLD</text>
      <text x="16" y="64" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11">${t["spectrum-gold"]}</text>
    </g>
  </g>
</svg>`,
    },
    {
      id: "tux-portal-header",
      name: "TuxPortalHeader",
      category: "Navigation & Layout",
      route: "/components/portal-shell",
      dimensions: "760 × 150",
      description:
        "Two-tier institutional header: Maroon utility bar with agency links and search, crisp brand navigation ribbon, and 5-band spectrum bar.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="150" viewBox="0 0 760 150" fill="none">
  <rect id="TUX / TuxPortalHeader Sheet" width="760" height="150" rx="8" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
  <g id="Masthead / Tier 1 Utility Bar" transform="translate(16, 16)">
    <rect width="728" height="32" fill="${t["brand-primary"]}"/>
    <text x="16" y="20" fill="${t["text-on-brand"]}" font-family="Open Sans, sans-serif" font-size="11" font-weight="600">TEXAS A&amp;M TRANSPORTATION INSTITUTE</text>
    ${lucideSvgGroup("external-link", 242, 10, 12, t["text-on-brand"])}
    <text x="618" y="20" text-anchor="end" fill="${t["text-on-brand"]}" font-family="Open Sans, sans-serif" font-size="11">JOBS · PRESSROOM · DIRECTORY</text>
    <rect x="632" y="5" width="84" height="22" rx="3" fill="${t["brand-primary-deep"]}" stroke="${t["brand-accent"]}"/>
    ${lucideSvgGroup("search", 640, 10, 12, t["brand-accent"])}
    <text x="656" y="19" fill="${t["text-on-brand"]}" font-family="Open Sans, sans-serif" font-size="11">Search</text>
  </g>
  <g id="Masthead / Tier 2 Brand Ribbon" transform="translate(16, 48)">
    <rect width="728" height="62" fill="${t["surface-raised"]}" stroke="${t["surface-border"]}"/>
    <rect x="16" y="13" width="52" height="36" rx="2" fill="${t["brand-primary"]}"/>
    <text x="42" y="36" text-anchor="middle" fill="${t["text-on-brand"]}" font-family="Oswald, sans-serif" font-size="18" font-weight="700">TTI</text>
    <line x1="80" y1="16" x2="80" y2="46" stroke="${t["surface-border"]}"/>
    <text x="92" y="36" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="15" font-weight="700">Corridor Telemetry Portal</text>
    <text x="430" y="36" fill="${t["brand-primary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="700">OVERVIEW</text>
    <line x1="430" y1="44" x2="494" y2="44" stroke="${t["brand-accent"]}" stroke-width="2"/>
    <text x="514" y="36" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="700">CORRIDORS</text>
    <text x="602" y="36" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="700">DATASETS</text>
  </g>
  <g id="Masthead / 5-Band Spectrum Ribbon" transform="translate(16, 110)">
    <rect x="0" y="0" width="145.6" height="6" fill="${t["spectrum-maroon"]}"/>
    <rect x="145.6" y="0" width="145.6" height="6" fill="${t["spectrum-blue"]}"/>
    <rect x="291.2" y="0" width="145.6" height="6" fill="${t["spectrum-teal"]}"/>
    <rect x="436.8" y="0" width="145.6" height="6" fill="${t["spectrum-green"]}"/>
    <rect x="582.4" y="0" width="145.6" height="6" fill="${t["spectrum-gold"]}"/>
  </g>
</svg>`,
    },
    {
      id: "tux-section-header",
      name: "TuxSectionHeader",
      category: "Navigation & Layout",
      route: "/components/section-header",
      dimensions: "760 × 150",
      description:
        "Editorial section header with monospace kicker, Oswald display typography, and signature 2px Warm Gold keyline rule.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="150" viewBox="0 0 760 150" fill="none">
  <rect id="TUX / TuxSectionHeader Sheet" width="760" height="150" rx="8" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
  <g id="SectionHeader / Editorial" transform="translate(24, 24)">
    <text x="0" y="14" fill="${t["brand-primary"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" letter-spacing="1.4">ROADWAY SAFETY &amp; HUMAN FACTORS</text>
    <text x="0" y="48" fill="${t["text-primary"]}" font-family="Oswald, sans-serif" font-size="26" font-weight="700">Statewide Intersection Conflict Analysis</text>
    <rect x="0" y="60" width="96" height="3" fill="${t["brand-accent"]}"/>
    <line x1="96" y1="61.5" x2="712" y2="61.5" stroke="${t["surface-border"]}"/>
    <text x="0" y="88" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="14">Surrogate safety measures (PET &amp; TTC) aggregated across 420 signalized intersections in TxDOT districts.</text>
  </g>
</svg>`,
    },
    {
      id: "tux-data-table",
      name: "TuxDataTable",
      category: "Data Display & Records",
      route: "/components/data-table",
      dimensions: "760 × 230",
      description:
        "High-density engineering table with tabular numerals, operational status badges, unit system toggle, and provenance footer.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="230" viewBox="0 0 760 230" fill="none">
  <rect id="TUX / TuxDataTable Sheet" width="760" height="230" rx="8" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
  <g id="Table Header Bar" transform="translate(16, 16)">
    <rect width="728" height="36" fill="${t["surface-sunken"]}" stroke="${t["surface-border"]}"/>
    <text x="16" y="23" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="700">CORRIDOR SEGMENT</text>
    <text x="230" y="23" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="700">STATIONING</text>
    <text x="380" y="23" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="700">AADT (VEH/DAY)</text>
    <text x="530" y="23" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="700">MEAN SPEED</text>
    <text x="640" y="23" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="700">STATUS</text>
  </g>
  <g id="Row 1" transform="translate(16, 52)">
    <rect width="728" height="40" fill="${t["surface-page"]}" stroke="${t["surface-border-subtle"]}"/>
    <text x="16" y="25" fill="${t["brand-primary"]}" font-family="Open Sans, sans-serif" font-size="13" font-weight="600">IH-35E Northbound · Waco</text>
    <text x="230" y="25" fill="${t["text-secondary"]}" font-family="JetBrains Mono, monospace" font-size="12">STA 104+00</text>
    <text x="380" y="25" fill="${t["text-primary"]}" font-family="JetBrains Mono, monospace" font-size="13" font-weight="600">142,800</text>
    <text x="530" y="25" fill="${t["text-primary"]}" font-family="JetBrains Mono, monospace" font-size="13">64.2 mph</text>
    <rect x="640" y="9" width="72" height="22" rx="3" fill="${t["status-ok-fill"]}" stroke="${t["status-ok"]}"/>
    <text x="676" y="24" text-anchor="middle" fill="${t["status-ok-ink"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">LOS B</text>
  </g>
  <g id="Row 2" transform="translate(16, 92)">
    <rect width="728" height="40" fill="${t["surface-eggshell"]}" stroke="${t["surface-border-subtle"]}"/>
    <text x="16" y="25" fill="${t["brand-primary"]}" font-family="Open Sans, sans-serif" font-size="13" font-weight="600">IH-10 Katy Managed Lanes</text>
    <text x="230" y="25" fill="${t["text-secondary"]}" font-family="JetBrains Mono, monospace" font-size="12">RM 748.5</text>
    <text x="380" y="25" fill="${t["text-primary"]}" font-family="JetBrains Mono, monospace" font-size="13" font-weight="600">218,450</text>
    <text x="530" y="25" fill="${t["text-primary"]}" font-family="JetBrains Mono, monospace" font-size="13">48.7 mph</text>
    <rect x="640" y="9" width="72" height="22" rx="3" fill="${t["status-warning-fill"]}" stroke="${t["status-warning"]}"/>
    <text x="676" y="24" text-anchor="middle" fill="${t["status-warning-ink"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">LOS D</text>
  </g>
  <g id="Row 3" transform="translate(16, 132)">
    <rect width="728" height="40" fill="${t["surface-page"]}" stroke="${t["surface-border-subtle"]}"/>
    <text x="16" y="25" fill="${t["brand-primary"]}" font-family="Open Sans, sans-serif" font-size="13" font-weight="600">SH-6 Bryan / College Station</text>
    <text x="230" y="25" fill="${t["text-secondary"]}" font-family="JetBrains Mono, monospace" font-size="12">STA 042+50</text>
    <text x="380" y="25" fill="${t["text-primary"]}" font-family="JetBrains Mono, monospace" font-size="13" font-weight="600">68,120</text>
    <text x="530" y="25" fill="${t["text-primary"]}" font-family="JetBrains Mono, monospace" font-size="13">67.9 mph</text>
    <rect x="640" y="9" width="72" height="22" rx="3" fill="${t["status-ok-fill"]}" stroke="${t["status-ok"]}"/>
    <text x="676" y="24" text-anchor="middle" fill="${t["status-ok-ink"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">LOS A</text>
  </g>
  <g id="Provenance Footer" transform="translate(16, 178)">
    <rect width="728" height="34" rx="4" fill="${t["surface-sunken"]}"/>
    <text x="14" y="21" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11">Provenance: TxDOT PeMS Archive · Project 0-7142 · Units: US Customary (mph / veh)</text>
    ${lucideSvgGroup("copy", 622, 11, 12, t["brand-primary"])}
    <text x="714" y="21" text-anchor="end" fill="${t["brand-primary"]}" font-family="Open Sans, sans-serif" font-size="11" font-weight="700">Copy Citation</text>
  </g>
</svg>`,
    },
    {
      id: "tux-form-controls",
      name: "TuxFilterBar & Form Controls",
      category: "Forms & Controls",
      route: "/components/forms",
      dimensions: "760 × 200",
      description:
        "WCAG 2.2 AAA form inputs: 3:1 UI boundary borders (#525252), 44px touch height, double-ring focus indicator, and accessible error messaging.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="200" viewBox="0 0 760 200" fill="none">
  <rect id="TUX / Form Controls Sheet" width="760" height="200" rx="8" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
  <text x="24" y="34" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">TUX / FORM CONTROLS · 44PX AAA TARGETS &amp; 3:1 BOUNDARY CONTRAST</text>
  <line x1="24" y1="44" x2="736" y2="44" stroke="${t["brand-accent"]}" stroke-width="2"/>
  <g id="Input / Focused State" transform="translate(24, 62)">
    <text x="0" y="14" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="13" font-weight="700">Corridor Reference Marker (Focused)</text>
    <rect x="-3" y="21" width="234" height="50" rx="6" fill="none" stroke="${t["focus-ring-outer"]}" stroke-width="3"/>
    <rect x="0" y="24" width="228" height="44" rx="4" fill="${t["surface-page"]}" stroke="${t["text-muted"]}" stroke-width="1.5"/>
    <text x="12" y="51" fill="${t["text-primary"]}" font-family="JetBrains Mono, monospace" font-size="13">IH-0035-E · RM 240.5</text>
    <text x="0" y="92" fill="${t["text-muted"]}" font-family="Open Sans, sans-serif" font-size="11">3px solid #5C0025 focus ring (WCAG 2.4.13 AAA)</text>
  </g>
  <g id="Select / District Selector" transform="translate(276, 62)">
    <text x="0" y="14" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="13" font-weight="700">TxDOT District</text>
    <rect x="0" y="24" width="216" height="44" rx="4" fill="${t["surface-page"]}" stroke="${t["text-muted"]}" stroke-width="1.5"/>
    <text x="12" y="51" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="13">17 — Bryan District (BRY)</text>
    ${lucideSvgGroup("chevron-down", 190, 38, 16, t["text-primary"])}
  </g>
  <g id="Toggle &amp; Checkbox" transform="translate(516, 62)">
    <text x="0" y="14" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="13" font-weight="700">Telemetry Options</text>
    <rect x="0" y="28" width="24" height="24" rx="4" fill="${t["brand-primary"]}"/>
    ${lucideSvgGroup("check", 4, 32, 16, t["text-on-brand"])}
    <text x="34" y="45" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="13">Metric (SI) Units</text>
    <rect x="0" y="64" width="48" height="26" rx="13" fill="${t["brand-primary"]}"/>
    <circle cx="35" cy="77" r="9" fill="${t["text-on-brand"]}"/>
    <text x="58" y="82" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="13">Live Cursor Sync</text>
  </g>
</svg>`,
    },
    {
      id: "tux-corridor-strip",
      name: "TuxCorridorStrip",
      category: "Geospatial & Maps",
      route: "/components/corridor-strip",
      dimensions: "760 × 190",
      description:
        "Linear Referencing System (LRS) highway corridor diagram with civil-engineering stationing ticks (STA 00+00 to STA 45+00) and sensor nodes.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="190" viewBox="0 0 760 190" fill="none">
  <rect id="TUX / TuxCorridorStrip Sheet" width="760" height="190" rx="8" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
  <text x="24" y="34" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">TUX / TUXCORRIDORSTRIP · LINEAR REFERENCING &amp; CIVIL STATIONING</text>
  <text x="736" y="34" text-anchor="end" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11">SYNC CHANNEL: ih35-main</text>
  <line x1="24" y1="44" x2="736" y2="44" stroke="${t["brand-accent"]}" stroke-width="2"/>
  <g id="Corridor Spine" transform="translate(48, 86)">
    <line x1="0" y1="16" x2="664" y2="16" stroke="${t["neutral-300"]}" stroke-width="8" stroke-linecap="round"/>
    <line x1="0" y1="16" x2="440" y2="16" stroke="${t["status-ok"]}" stroke-width="8" stroke-linecap="round"/>
    <line x1="440" y1="16" x2="560" y2="16" stroke="${t["status-warning"]}" stroke-width="8"/>
    <line x1="560" y1="16" x2="664" y2="16" stroke="${t["status-critical"]}" stroke-width="8" stroke-linecap="round"/>
    <g id="Node 1 / STA 00+00" transform="translate(0, 0)">
      <circle cx="0" cy="16" r="10" fill="${t["surface-page"]}" stroke="${t["brand-primary"]}" stroke-width="3"/>
      <text x="0" y="46" text-anchor="middle" fill="${t["text-primary"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">STA 00+00</text>
      <text x="0" y="62" text-anchor="middle" fill="${t["text-muted"]}" font-family="Open Sans, sans-serif" font-size="11">US-290 Jct</text>
    </g>
    <g id="Node 2 / STA 15+00" transform="translate(220, 0)">
      <circle cx="0" cy="16" r="10" fill="${t["surface-page"]}" stroke="${t["status-ok"]}" stroke-width="3"/>
      <text x="0" y="46" text-anchor="middle" fill="${t["text-primary"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">STA 15+00</text>
      <text x="0" y="62" text-anchor="middle" fill="${t["text-muted"]}" font-family="Open Sans, sans-serif" font-size="11">66 mph · LOS A</text>
    </g>
    <g id="Node 3 / STA 30+00 (Active Crosshair)" transform="translate(440, 0)">
      <line x1="0" y1="-22" x2="0" y2="34" stroke="${t["brand-primary"]}" stroke-width="2" stroke-dasharray="3 3"/>
      <circle cx="0" cy="16" r="12" fill="${t["brand-primary"]}" stroke="${t["brand-accent"]}" stroke-width="3"/>
      <text x="0" y="46" text-anchor="middle" fill="${t["brand-primary"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">STA 30+00</text>
      <text x="0" y="62" text-anchor="middle" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="11" font-weight="600">Queue Detector</text>
    </g>
    <g id="Node 4 / STA 45+00" transform="translate(664, 0)">
      <circle cx="0" cy="16" r="10" fill="${t["status-critical"]}" stroke="${t["surface-page"]}" stroke-width="2"/>
      <text x="0" y="46" text-anchor="middle" fill="${t["status-critical"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">STA 45+00</text>
      <text x="0" y="62" text-anchor="middle" fill="${t["text-muted"]}" font-family="Open Sans, sans-serif" font-size="11">Work Zone</text>
    </g>
  </g>
</svg>`,
    },
    {
      id: "tux-tabs-breadcrumbs",
      name: "TuxTabs & TuxBreadcrumbs",
      category: "Navigation & Layout",
      route: "/components/tabs",
      dimensions: "760 × 190",
      description:
        "Hierarchical breadcrumbs with origin icon and WAI-ARIA tab bar with 2px maroon/gold active indicators.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="190" viewBox="0 0 760 190" fill="none">
  <rect id="TUX / Tabs &amp; Breadcrumbs Sheet" width="760" height="190" rx="8" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
  <text x="24" y="34" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">TUX / TUXBREADCRUMBS &amp; TUXTABS · WAYFINDING &amp; DISCLOSURE</text>
  <line x1="24" y1="44" x2="736" y2="44" stroke="${t["brand-accent"]}" stroke-width="2"/>
  <g id="Breadcrumbs / Trail" transform="translate(24, 60)">
    <rect width="712" height="36" rx="4" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
    ${lucideSvgGroup("house", 12, 10, 14, t["brand-primary"])}
    <text x="32" y="22" fill="${t["brand-primary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="600">Home</text>
    ${lucideSvgGroup("chevron-right", 72, 11, 12, t["text-muted"])}
    <text x="90" y="22" fill="${t["brand-primary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="600">Corridors</text>
    ${lucideSvgGroup("chevron-right", 150, 11, 12, t["text-muted"])}
    <text x="168" y="22" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="700">IH-35E Northbound</text>
  </g>
  <g id="Tabs / WAI-ARIA Tablist" transform="translate(24, 112)">
    <line x1="0" y1="44" x2="712" y2="44" stroke="${t["surface-border"]}"/>
    <g id="Tab / Active" transform="translate(0, 0)">
      <rect width="148" height="44" fill="${t["surface-page"]}"/>
      <line x1="0" y1="43" x2="148" y2="43" stroke="${t["brand-primary"]}" stroke-width="3"/>
      <text x="74" y="27" text-anchor="middle" fill="${t["brand-primary"]}" font-family="Open Sans, sans-serif" font-size="13" font-weight="700">Live Telemetry</text>
    </g>
    <g id="Tab / Inactive 1" transform="translate(156, 0)">
      <rect width="148" height="44" fill="none"/>
      <text x="74" y="27" text-anchor="middle" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="13" font-weight="600">Incident Log (4)</text>
    </g>
    <g id="Tab / Inactive 2" transform="translate(312, 0)">
      <rect width="148" height="44" fill="none"/>
      <text x="74" y="27" text-anchor="middle" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="13" font-weight="600">Sensor Health</text>
    </g>
    <g id="Tab / Inactive 3" transform="translate(468, 0)">
      <rect width="148" height="44" fill="none"/>
      <text x="74" y="27" text-anchor="middle" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="13" font-weight="600">Provenance</text>
    </g>
  </g>
</svg>`,
    },
    {
      id: "tux-modal-toast",
      name: "TuxModal & TuxToast",
      category: "Feedback & Status",
      route: "/components/modal",
      dimensions: "760 × 220",
      description:
        "Accessible modal dialog with focus-trap chrome and non-blocking toast notifications with Lucide status icons.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="220" viewBox="0 0 760 220" fill="none">
  <rect id="TUX / Modal &amp; Toast Sheet" width="760" height="220" rx="8" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
  <text x="24" y="34" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">TUX / TUXMODAL &amp; TUXTOAST · DIALOGS &amp; NOTIFICATIONS</text>
  <line x1="24" y1="44" x2="736" y2="44" stroke="${t["brand-accent"]}" stroke-width="2"/>
  <g id="Modal / Confirmation Dialog" transform="translate(24, 58)">
    <rect width="416" height="142" rx="6" fill="${t["surface-page"]}" stroke="${t["surface-border"]}" stroke-width="1.5"/>
    <rect width="416" height="4" rx="2" fill="${t["brand-primary"]}"/>
    <text x="20" y="30" fill="${t["text-primary"]}" font-family="Oswald, sans-serif" font-size="17" font-weight="700">Export Corridor Dataset (CSV / Parquet)</text>
    ${lucideSvgGroup("x", 382, 16, 16, t["text-muted"])}
    <text x="20" y="56" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="12">Includes 28,400 loop-detector rows with DOI citation metadata.</text>
    <line x1="20" y1="78" x2="396" y2="78" stroke="${t["surface-border-subtle"]}"/>
    <rect x="204" y="90" width="90" height="36" rx="2" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
    <text x="249" y="113" text-anchor="middle" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="600">Cancel</text>
    <rect x="302" y="90" width="94" height="36" rx="2" fill="${t["brand-primary"]}"/>
    <text x="349" y="113" text-anchor="middle" fill="${t["text-on-brand"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="600">Download</text>
  </g>
  <g id="Toast / Stack" transform="translate(456, 58)">
    <g id="Toast / Success" transform="translate(0, 0)">
      <rect width="280" height="64" rx="4" fill="${t["surface-page"]}" stroke="${t["status-ok"]}" stroke-width="1.5"/>
      <rect width="4" height="64" fill="${t["status-ok"]}"/>
      ${lucideSvgGroup("check-circle-2", 16, 14, 16, t["status-ok"])}
      <text x="40" y="26" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="700">Telemetry Snapshot Saved</text>
      <text x="40" y="46" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="11">Synced to TxDOT District 17 archive.</text>
    </g>
    <g id="Toast / Warning" transform="translate(0, 78)">
      <rect width="280" height="64" rx="4" fill="${t["surface-page"]}" stroke="${t["status-warning"]}" stroke-width="1.5"/>
      <rect width="4" height="64" fill="${t["status-warning"]}"/>
      ${lucideSvgGroup("triangle-alert", 16, 14, 16, t["color-gold-800"])}
      <text x="40" y="26" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="700">High Latency Detected</text>
      <text x="40" y="46" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="11">RSU STA 30+00 response &gt; 450 ms.</text>
    </g>
  </g>
</svg>`,
    },
    {
      id: "tux-sidebar-footer",
      name: "TuxDocsSidebar & TuxFooter",
      category: "Navigation & Layout",
      route: "/components/docs-sidebar",
      dimensions: "760 × 210",
      description:
        "Collapsible hierarchical sidebar navigation with live filter input and institutional footer colophon.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="210" viewBox="0 0 760 210" fill="none">
  <rect id="TUX / Sidebar &amp; Footer Sheet" width="760" height="210" rx="8" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
  <text x="24" y="34" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">TUX / TUXDOCSSIDEBAR &amp; TUXFOOTER · SHELL NAVIGATION</text>
  <line x1="24" y1="44" x2="736" y2="44" stroke="${t["brand-accent"]}" stroke-width="2"/>
  <g id="Sidebar / Navigation Tree" transform="translate(24, 58)">
    <rect width="224" height="132" rx="4" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
    <rect x="12" y="12" width="200" height="28" rx="3" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
    ${lucideSvgGroup("search", 20, 20, 12, t["text-muted"])}
    <text x="38" y="30" fill="${t["text-muted"]}" font-family="Open Sans, sans-serif" font-size="11">Filter navigation...</text>
    <rect x="12" y="48" width="200" height="28" rx="3" fill="${t["brand-primary"]}"/>
    <text x="24" y="66" fill="${t["text-on-brand"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="700">Foundations &amp; Tokens</text>
    <text x="24" y="94" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="600">Components (183)</text>
    <text x="24" y="118" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="12">Visualizations &amp; Maps</text>
  </g>
  <g id="Footer / Institutional Colophon" transform="translate(264, 58)">
    <rect width="472" height="132" rx="4" fill="${t["tti-charcoal"]}"/>
    <rect x="0" y="0" width="472" height="4" fill="${t["brand-accent"]}"/>
    <text x="20" y="32" fill="${t["text-on-brand"]}" font-family="Oswald, sans-serif" font-size="16" font-weight="700">TEXAS A&amp;M TRANSPORTATION INSTITUTE</text>
    <text x="20" y="54" fill="${t["neutral-300"]}" font-family="Open Sans, sans-serif" font-size="11">3135 TAMU · College Station, TX 77843-3135 · A Member of The Texas A&amp;M University System</text>
    <line x1="20" y1="74" x2="452" y2="74" stroke="${t["neutral-700"]}"/>
    <text x="20" y="100" fill="${t["brand-accent"]}" font-family="Open Sans, sans-serif" font-size="11" font-weight="600">Accessibility (WCAG 2.2 AAA) · Site Policies · Open Records · Texas.gov</text>
  </g>
</svg>`,
    },
    {
      id: "tux-stat-empty",
      name: "TuxStatComparison & TuxEmptyState",
      category: "Data Display & Records",
      route: "/components/stat-comparison",
      dimensions: "760 × 190",
      description:
        "Before/after KPI comparison card with automatic delta calculation and structured zero-data empty state.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="190" viewBox="0 0 760 190" fill="none">
  <rect id="TUX / StatComparison &amp; EmptyState Sheet" width="760" height="190" rx="8" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
  <text x="24" y="34" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">TUX / TUXSTATCOMPARISON &amp; TUXEMPTYSTATE</text>
  <line x1="24" y1="44" x2="736" y2="44" stroke="${t["brand-accent"]}" stroke-width="2"/>
  <g id="StatComparison / Corridor Travel Time" transform="translate(24, 58)">
    <rect width="344" height="112" rx="6" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
    <text x="18" y="26" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">MEAN TRAVEL TIME INDEX (TTI)</text>
    <text x="18" y="64" fill="${t["text-primary"]}" font-family="Oswald, sans-serif" font-size="32" font-weight="700">1.18</text>
    <text x="92" y="62" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="12">vs 1.42 baseline</text>
    <rect x="234" y="42" width="92" height="24" rx="3" fill="${t["status-ok-fill"]}" stroke="${t["status-ok"]}"/>
    <text x="280" y="58" text-anchor="middle" fill="${t["status-ok-ink"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">-16.9% DELAY</text>
    <text x="18" y="94" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="12">Adaptive ramp metering active across 14 interchanges</text>
  </g>
  <g id="EmptyState / Zero Results" transform="translate(392, 58)">
    <rect width="344" height="112" rx="6" fill="${t["surface-page"]}" stroke="${t["surface-border"]}" stroke-dasharray="4 4"/>
    ${lucideSvgGroup("inbox", 160, 16, 22, t["brand-primary"])}
    <text x="172" y="60" text-anchor="middle" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="13" font-weight="700">No Active Work-Zone Alerts</text>
    <text x="172" y="80" text-anchor="middle" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="11">All 42 monitored segments are operating at LOS A–B.</text>
  </g>
</svg>`,
    },
    {
      id: "tux-ai-primitives",
      name: "TuxGroundedSources & TuxToolCall",
      category: "AI & Research",
      route: "/components/grounded-sources",
      dimensions: "760 × 190",
      description:
        "AI research provenance strip with verified DOI source pills and structured tool-invocation inspection card.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="190" viewBox="0 0 760 190" fill="none">
  <rect id="TUX / AI &amp; Research Primitives Sheet" width="760" height="190" rx="8" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
  <text x="24" y="34" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">TUX / TUXGROUNDEDSOURCES &amp; TUXTOOLCALL · AI PROVENANCE</text>
  <line x1="24" y1="44" x2="736" y2="44" stroke="${t["brand-accent"]}" stroke-width="2"/>
  <g id="GroundedSources / Citation Strip" transform="translate(24, 58)">
    <rect width="344" height="112" rx="6" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
    ${lucideSvgGroup("shield-check", 16, 16, 16, t["brand-primary"])}
    <text x="38" y="29" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="700">3 Grounded TTI Research Sources</text>
    <rect x="16" y="44" width="312" height="26" rx="3" fill="${t["surface-sunken"]}"/>
    <text x="24" y="61" fill="${t["brand-primary"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="600">[1] TxDOT Report 0-7142 · Freight Platooning</text>
    <rect x="16" y="76" width="312" height="26" rx="3" fill="${t["surface-sunken"]}"/>
    <text x="24" y="93" fill="${t["brand-primary"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="600">[2] HCM 7th Ed. · Freeway Facilities LOS</text>
  </g>
  <g id="ToolCall / Inspector" transform="translate(392, 58)">
    <rect width="344" height="112" rx="6" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
    ${lucideSvgGroup("check-circle-2", 16, 16, 16, t["status-ok"])}
    <text x="38" y="29" fill="${t["text-primary"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">queryCorridorTelemetry()</text>
    <text x="328" y="29" text-anchor="end" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11">42 ms</text>
    <rect x="16" y="44" width="312" height="54" rx="4" fill="${d["surface-page"]}"/>
    <text x="26" y="66" fill="${d["text-primary"]}" font-family="JetBrains Mono, monospace" font-size="11">{ "corridor": "IH-35E", "station": "104+00" }</text>
    <text x="26" y="86" fill="${d["brand-primary"]}" font-family="JetBrains Mono, monospace" font-size="11">→ { "speedMph": 64.2, "los": "B" }</text>
  </g>
</svg>`,
    },
  ];

  return sheets;
}

// ---------------------------------------------------------------------------
// 6. Zero-Subscription Local Figma Plugin (kit/figma/plugin/*)
// ---------------------------------------------------------------------------

export function renderPluginManifest() {
  const manifest = {
    name: "TUX Design System — Zero-Subscription Kit Builder & Code Connect",
    id: "edu.tamu.tti.tux.figma-kit",
    api: "1.0.0",
    main: "code.js",
    ui: "ui.html",
    editorType: ["figma", "dev"],
    capabilities: ["inspect"],
    networkAccess: {
      allowedDomains: ["none"],
    },
  };
  return JSON.stringify(manifest, null, 2) + "\n";
}

export function renderPluginCode(themes) {
  const varsPayload = buildFigmaVariablesPayload(themes);
  const codeConnect = buildCodeConnectRegistry();

  // Select key tokens for the visual palette & component sheet generator
  const light = themes.tti;
  const dark = themes["tti-dark"];
  const hc = themes["tti-hc"];

  return `/**
 * ${GENERATED_NOTE}
 *
 * Zero-Subscription Local Figma Plugin for TUX (@tti/tti-ux).
 * Works 100% offline on the Figma Free Starter Plan:
 *   1. Syncs Paint Styles, Text Styles, and Effect Styles (no mode limits on Free tier).
 *   2. Syncs Figma Variables (auto-detects Free 1-mode limit and falls back to 3 themed collections).
 *   3. Generates Auto-Layout TUX Component Library frames directly onto the Figma canvas.
 *   4. Provides a built-in Code Connect Inspector for all 183 Tux* components without paid Dev Mode.
 */

const TUX_THEMES = ${JSON.stringify({ tti: light, "tti-dark": dark, "tti-hc": hc }, null, 2)};
const TUX_VARIABLES = ${JSON.stringify(varsPayload.variables, null, 2)};
const TUX_COMPONENTS = ${JSON.stringify(codeConnect.components, null, 2)};

figma.showUI(__html__, { width: 480, height: 660, themeColors: true });

function hexToRgb01(hexStr) {
  const clean = String(hexStr || "#5C0025").replace(/^#/, "");
  const full = clean.length === 3
    ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
    : clean.padEnd(6, "0");
  const n = parseInt(full.slice(0, 6), 16);
  return {
    r: ((n >> 16) & 255) / 255,
    g: ((n >> 8) & 255) / 255,
    b: (n & 255) / 255,
  };
}

/**
 * 1. Sync Paint Styles, Text Styles & Effect Styles across all 3 themes
 *    (100% supported on Figma Free Starter Plan with zero mode restrictions)
 */
async function syncPaintAndTextStyles() {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  const existingPaints = new Map(
    (await figma.getLocalPaintStylesAsync()).map((s) => [s.name, s]),
  );

  const styleTokens = [
    "brand-primary", "brand-primary-deep", "brand-accent", "brand-accent-deep",
    "brand-secondary", "brand-fill", "brand-accent-ink",
    "surface-page", "surface-raised", "surface-sunken", "surface-eggshell", "surface-border",
    "text-primary", "text-secondary", "text-muted", "text-on-brand",
    "status-ok", "status-warning", "status-unknown", "status-critical", "status-maintenance", "status-pending",
    "color-success", "color-warning", "color-danger", "color-error", "color-info",
    "spectrum-maroon", "spectrum-blue", "spectrum-teal", "spectrum-green", "spectrum-gold",
  ];

  let paintCount = 0;
  for (const [themeKey, themeObj] of Object.entries(TUX_THEMES)) {
    for (const tokenName of styleTokens) {
      const raw = themeObj[tokenName];
      if (!raw || !String(raw).startsWith("#")) continue;
      const styleName = "TUX / " + themeKey + " / " + tokenName;
      const style = existingPaints.get(styleName) || figma.createPaintStyle();
      style.name = styleName;
      style.description = "TUX canonical token var(--" + tokenName + ") in theme " + themeKey;
      style.paints = [{ type: "SOLID", color: hexToRgb01(raw) }];
      paintCount++;
    }
  }

  // Sync Text Styles (Free tier unlimited)
  const existingTexts = new Map(
    (await figma.getLocalTextStylesAsync()).map((s) => [s.name, s]),
  );
  const textSpecs = [
    { name: "TUX / Display / Hero (36px Bold)", size: 36, style: "Bold", lineHeight: 42 },
    { name: "TUX / Heading / H1 (28px Bold)", size: 28, style: "Bold", lineHeight: 34 },
    { name: "TUX / Heading / H2 (22px Bold)", size: 22, style: "Bold", lineHeight: 28 },
    { name: "TUX / Heading / H3 (18px Bold)", size: 18, style: "Bold", lineHeight: 24 },
    { name: "TUX / Body / Regular (16px AAA)", size: 16, style: "Regular", lineHeight: 26 },
    { name: "TUX / Body / Small (14px)", size: 14, style: "Regular", lineHeight: 22 },
    { name: "TUX / UI / Label & Button (14px Bold)", size: 14, style: "Bold", lineHeight: 20 },
    { name: "TUX / Mono / Telemetry & Kicker (12px Bold)", size: 12, style: "Bold", lineHeight: 18 },
  ];
  for (const spec of textSpecs) {
    const ts = existingTexts.get(spec.name) || figma.createTextStyle();
    ts.name = spec.name;
    ts.fontName = { family: "Inter", style: spec.style };
    ts.fontSize = spec.size;
    ts.lineHeight = { value: spec.lineHeight, unit: "PIXELS" };
  }

  // Sync Effect Styles (Free tier unlimited)
  const existingEffects = new Map(
    (await figma.getLocalEffectStylesAsync()).map((s) => [s.name, s]),
  );
  const effectSpecs = [
    {
      name: "TUX / Elevation / Raised Card",
      effects: [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.06 }, offset: { x: 0, y: 2 }, radius: 6, spread: 0, visible: true, blendMode: "NORMAL" }],
    },
    {
      name: "TUX / Elevation / Floating Overlay",
      effects: [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.14 }, offset: { x: 0, y: 8 }, radius: 24, spread: -2, visible: true, blendMode: "NORMAL" }],
    },
  ];
  for (const ef of effectSpecs) {
    const es = existingEffects.get(ef.name) || figma.createEffectStyle();
    es.name = ef.name;
    es.effects = ef.effects;
  }

  return paintCount + textSpecs.length + effectSpecs.length;
}

/**
 * 2. Sync Figma Variables with automatic Free Starter Plan 1-mode fallback
 */
async function syncFigmaVariables() {
  if (!figma.variables) {
    throw new Error("Figma Variables API is not available in this version of Figma.");
  }

  const existingCollections = await figma.variables.getLocalVariableCollectionsAsync();
  const findOrCreateCollection = (name) =>
    existingCollections.find((c) => c.name === name) ||
    figma.variables.createVariableCollection(name);

  const existingVars = await figma.variables.getLocalVariablesAsync();
  const findOrCreateVar = (name, coll, resolvedType) =>
    existingVars.find((v) => v.name === name && v.variableCollectionId === coll.id) ||
    figma.variables.createVariable(name, coll, resolvedType);

  const collection = findOrCreateCollection("TUX Institutional Tokens");
  const lightModeId = collection.modes[0].modeId;
  collection.renameMode(lightModeId, "Light (tti)");

  let darkModeId = null;
  let hcModeId = null;
  let multiModeSupported = true;

  try {
    const existingDark = collection.modes.find((m) => m.name === "Dark (tti-dark)");
    const existingHc = collection.modes.find((m) => m.name === "High Contrast AAA (tti-hc)");
    darkModeId = existingDark ? existingDark.modeId : collection.addMode("Dark (tti-dark)");
    hcModeId = existingHc ? existingHc.modeId : collection.addMode("High Contrast AAA (tti-hc)");
  } catch (_err) {
    // Figma Free Starter plan limits Variable Collections to 1 mode.
    // We automatically create 2 companion single-mode collections so free users get all 3 themes!
    multiModeSupported = false;
  }

  let createdCount = 0;

  if (multiModeSupported) {
    for (const v of TUX_VARIABLES) {
      const figVar = findOrCreateVar(v.name, collection, v.resolvedType);
      figVar.description = v.description;
      if (v.resolvedType === "COLOR") {
        figVar.setValueForMode(lightModeId, v.valuesByMode.tti.rgba);
        figVar.setValueForMode(darkModeId, v.valuesByMode["tti-dark"].rgba);
        figVar.setValueForMode(hcModeId, v.valuesByMode["tti-hc"].rgba);
      } else {
        figVar.setValueForMode(lightModeId, v.valuesByMode.tti);
        figVar.setValueForMode(darkModeId, v.valuesByMode["tti-dark"]);
        figVar.setValueForMode(hcModeId, v.valuesByMode["tti-hc"]);
      }
      createdCount++;
    }
  } else {
    const darkCollection = findOrCreateCollection("TUX Tokens — Dark (tti-dark)");
    const darkSingleModeId = darkCollection.modes[0].modeId;
    darkCollection.renameMode(darkSingleModeId, "Dark (tti-dark)");

    const hcCollection = findOrCreateCollection("TUX Tokens — High Contrast (tti-hc)");
    const hcSingleModeId = hcCollection.modes[0].modeId;
    hcCollection.renameMode(hcSingleModeId, "High Contrast AAA (tti-hc)");

    for (const v of TUX_VARIABLES) {
      const vLight = findOrCreateVar(v.name, collection, v.resolvedType);
      const vDark = findOrCreateVar(v.name, darkCollection, v.resolvedType);
      const vHc = findOrCreateVar(v.name, hcCollection, v.resolvedType);

      if (v.resolvedType === "COLOR") {
        vLight.setValueForMode(lightModeId, v.valuesByMode.tti.rgba);
        vDark.setValueForMode(darkSingleModeId, v.valuesByMode["tti-dark"].rgba);
        vHc.setValueForMode(hcSingleModeId, v.valuesByMode["tti-hc"].rgba);
      } else {
        vLight.setValueForMode(lightModeId, v.valuesByMode.tti);
        vDark.setValueForMode(darkSingleModeId, v.valuesByMode["tti-dark"]);
        vHc.setValueForMode(hcSingleModeId, v.valuesByMode["tti-hc"]);
      }
      createdCount++;
    }
  }

  return { createdCount, multiModeSupported };
}

/**
 * 3. Programmatically generate Auto-Layout TUX Component Kit on the active Figma page
 */
async function generateAutoLayoutKitOnCanvas() {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  let componentCount = 0;

  const rootFrame = figma.createFrame();
  rootFrame.name = "TUX — Institutional Figma UI Kit (Free Starter Plan Compatible)";
  rootFrame.layoutMode = "VERTICAL";
  rootFrame.primaryAxisSizingMode = "AUTO";
  rootFrame.counterAxisSizingMode = "AUTO";
  rootFrame.paddingTop = 32;
  rootFrame.paddingBottom = 32;
  rootFrame.paddingLeft = 32;
  rootFrame.paddingRight = 32;
  rootFrame.itemSpacing = 24;
  rootFrame.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["surface-eggshell"]) }];

  // 1. Masthead Component
  const header = figma.createComponent();
  header.name = "TUX / TuxPortalHeader";
  header.layoutMode = "VERTICAL";
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "AUTO";
  header.paddingTop = 20;
  header.paddingBottom = 20;
  header.paddingLeft = 24;
  header.paddingRight = 24;
  header.itemSpacing = 6;
  header.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["brand-fill"]) }];

  const title = figma.createText();
  title.fontName = { family: "Inter", style: "Bold" };
  title.fontSize = 20;
  title.characters = "TEXAS A&M TRANSPORTATION INSTITUTE · TUX DESIGN SYSTEM KIT";
  title.fills = [{ type: "SOLID", color: hexToRgb01("#FFFFFF") }];

  const sub = figma.createText();
  sub.fontName = { family: "Inter", style: "Regular" };
  sub.fontSize = 12;
  sub.characters = "WCAG 2.2 Level AAA (≥ 7.0:1 Contrast · ≥ 44×44px Touch Targets) · Free Starter Plan Kit";
  sub.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["brand-accent"]) }];

  header.appendChild(title);
  header.appendChild(sub);
  rootFrame.appendChild(header);
  componentCount++;

  // 2. 5-Band Spectrum Ribbon Component
  const ribbonComp = figma.createComponent();
  ribbonComp.name = "TUX / TuxSpectrumRibbon";
  ribbonComp.layoutMode = "HORIZONTAL";
  ribbonComp.primaryAxisSizingMode = "AUTO";
  ribbonComp.counterAxisSizingMode = "AUTO";
  ribbonComp.itemSpacing = 0;

  const spectrumColors = [
    ["Maroon", TUX_THEMES.tti["spectrum-maroon"]],
    ["Slate Blue", TUX_THEMES.tti["spectrum-blue"]],
    ["Slate Teal", TUX_THEMES.tti["spectrum-teal"]],
    ["Sage Green", TUX_THEMES.tti["spectrum-green"]],
    ["Ochre Gold", TUX_THEMES.tti["spectrum-gold"]],
  ];
  for (const [bandName, hex] of spectrumColors) {
    const band = figma.createRectangle();
    band.name = "Spectrum / " + bandName;
    band.resize(140, 12);
    band.fills = [{ type: "SOLID", color: hexToRgb01(hex) }];
    ribbonComp.appendChild(band);
  }
  rootFrame.appendChild(ribbonComp);
  componentCount++;

  // 3. Button Components Row
  const buttonRow = figma.createFrame();
  buttonRow.name = "TUX / Buttons Row (44px AAA)";
  buttonRow.layoutMode = "HORIZONTAL";
  buttonRow.primaryAxisSizingMode = "AUTO";
  buttonRow.counterAxisSizingMode = "AUTO";
  buttonRow.itemSpacing = 16;
  buttonRow.fills = [];

  const buttonVariants = [
    { name: "TUX / TuxButton / Primary", bg: TUX_THEMES.tti["brand-primary"], fg: "#FFFFFF", border: null, label: "Primary Action" },
    { name: "TUX / TuxButton / Secondary", bg: TUX_THEMES.tti["surface-page"], fg: TUX_THEMES.tti["text-primary"], border: TUX_THEMES.tti["surface-border"], label: "Secondary" },
    { name: "TUX / TuxButton / Ghost", bg: TUX_THEMES.tti["surface-sunken"], fg: TUX_THEMES.tti["text-secondary"], border: null, label: "Ghost Action" },
    { name: "TUX / TuxButton / Destructive", bg: TUX_THEMES.tti["surface-page"], fg: TUX_THEMES.tti["color-error"], border: TUX_THEMES.tti["color-error"], label: "Destructive" },
  ];

  for (const b of buttonVariants) {
    const btnComp = figma.createComponent();
    btnComp.name = b.name;
    btnComp.layoutMode = "HORIZONTAL";
    btnComp.primaryAxisAlignItems = "CENTER";
    btnComp.counterAxisAlignItems = "CENTER";
    btnComp.paddingLeft = 20;
    btnComp.paddingRight = 20;
    btnComp.paddingTop = 12;
    btnComp.paddingBottom = 12;
    btnComp.cornerRadius = 2;
    btnComp.fills = [{ type: "SOLID", color: hexToRgb01(b.bg) }];
    if (b.border) {
      btnComp.strokes = [{ type: "SOLID", color: hexToRgb01(b.border) }];
      btnComp.strokeWeight = 1.5;
    }

    const txt = figma.createText();
    txt.fontName = { family: "Inter", style: "Bold" };
    txt.fontSize = 14;
    txt.characters = b.label;
    txt.fills = [{ type: "SOLID", color: hexToRgb01(b.fg) }];
    btnComp.appendChild(txt);
    buttonRow.appendChild(btnComp);
    componentCount++;
  }
  rootFrame.appendChild(buttonRow);

  // 4. Badges & Status Chips Row
  const badgeRow = figma.createFrame();
  badgeRow.name = "TUX / Badges & Status Row";
  badgeRow.layoutMode = "HORIZONTAL";
  badgeRow.primaryAxisSizingMode = "AUTO";
  badgeRow.counterAxisSizingMode = "AUTO";
  badgeRow.itemSpacing = 12;
  badgeRow.fills = [];

  const badgeVariants = [
    { name: "TUX / TuxBadge / Restricted", bg: TUX_THEMES.tti["brand-primary"], fg: "#FFFFFF", label: "RESTRICTED" },
    { name: "TUX / TuxBadge / LOS A", bg: TUX_THEMES.tti["status-ok"], fg: "#FFFFFF", label: "LOS A · Free Flow" },
    { name: "TUX / TuxStatus / OK", bg: TUX_THEMES.tti["status-ok-fill"], fg: TUX_THEMES.tti["status-ok-ink"], label: "OK" },
    { name: "TUX / TuxStatus / WARNING", bg: TUX_THEMES.tti["status-warning-fill"], fg: TUX_THEMES.tti["status-warning-ink"], label: "WARNING" },
    { name: "TUX / TuxStatus / CRITICAL", bg: TUX_THEMES.tti["status-critical-fill"], fg: TUX_THEMES.tti["status-critical-ink"], label: "CRITICAL" },
  ];

  for (const bv of badgeVariants) {
    const chip = figma.createComponent();
    chip.name = bv.name;
    chip.layoutMode = "HORIZONTAL";
    chip.primaryAxisAlignItems = "CENTER";
    chip.counterAxisAlignItems = "CENTER";
    chip.paddingLeft = 12;
    chip.paddingRight = 12;
    chip.paddingTop = 6;
    chip.paddingBottom = 6;
    chip.cornerRadius = 3;
    chip.fills = [{ type: "SOLID", color: hexToRgb01(bv.bg) }];

    const txt = figma.createText();
    txt.fontName = { family: "Inter", style: "Bold" };
    txt.fontSize = 12;
    txt.characters = bv.label;
    txt.fills = [{ type: "SOLID", color: hexToRgb01(bv.fg) }];
    chip.appendChild(txt);
    badgeRow.appendChild(chip);
    componentCount++;
  }
  rootFrame.appendChild(badgeRow);

  // 5. Card & BigStat Row
  const cardRow = figma.createFrame();
  cardRow.name = "TUX / Cards & KPI Row";
  cardRow.layoutMode = "HORIZONTAL";
  cardRow.primaryAxisSizingMode = "AUTO";
  cardRow.counterAxisSizingMode = "AUTO";
  cardRow.itemSpacing = 20;
  cardRow.fills = [];

  const cardComp = figma.createComponent();
  cardComp.name = "TUX / TuxCard";
  cardComp.layoutMode = "VERTICAL";
  cardComp.primaryAxisSizingMode = "AUTO";
  cardComp.counterAxisSizingMode = "AUTO";
  cardComp.paddingTop = 20;
  cardComp.paddingBottom = 20;
  cardComp.paddingLeft = 20;
  cardComp.paddingRight = 20;
  cardComp.itemSpacing = 8;
  cardComp.cornerRadius = 6;
  cardComp.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["surface-page"]) }];
  cardComp.strokes = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["surface-border"]) }];

  const cardKicker = figma.createText();
  cardKicker.fontName = { family: "Inter", style: "Bold" };
  cardKicker.fontSize = 11;
  cardKicker.characters = "CONNECTED CORRIDORS · TXDOT";
  cardKicker.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["brand-primary"]) }];

  const cardTitle = figma.createText();
  cardTitle.fontName = { family: "Inter", style: "Bold" };
  cardTitle.fontSize = 18;
  cardTitle.characters = "Automated Freight Platooning Study";
  cardTitle.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["text-primary"]) }];

  const cardBody = figma.createText();
  cardBody.fontName = { family: "Inter", style: "Regular" };
  cardBody.fontSize = 13;
  cardBody.characters = "Field evaluation of V2X low-latency BSM telemetry along I-10.";
  cardBody.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["text-secondary"]) }];

  cardComp.appendChild(cardKicker);
  cardComp.appendChild(cardTitle);
  cardComp.appendChild(cardBody);
  cardRow.appendChild(cardComp);
  componentCount++;

  const statComp = figma.createComponent();
  statComp.name = "TUX / TuxBigStat";
  statComp.layoutMode = "VERTICAL";
  statComp.primaryAxisSizingMode = "AUTO";
  statComp.counterAxisSizingMode = "AUTO";
  statComp.paddingTop = 20;
  statComp.paddingBottom = 20;
  statComp.paddingLeft = 20;
  statComp.paddingRight = 20;
  statComp.itemSpacing = 6;
  statComp.cornerRadius = 6;
  statComp.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["surface-page"]) }];
  statComp.strokes = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["surface-border"]) }];

  const statLabel = figma.createText();
  statLabel.fontName = { family: "Inter", style: "Bold" };
  statLabel.fontSize = 11;
  statLabel.characters = "SPONSORED RESEARCH EXPENDITURE";
  statLabel.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["text-muted"]) }];

  const statValue = figma.createText();
  statValue.fontName = { family: "Inter", style: "Bold" };
  statValue.fontSize = 36;
  statValue.characters = "$126.4M (+14.2% YoY)";
  statValue.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["brand-primary"]) }];

  statComp.appendChild(statLabel);
  statComp.appendChild(statValue);
  cardRow.appendChild(statComp);
  componentCount++;

  rootFrame.appendChild(cardRow);

  figma.currentPage.appendChild(rootFrame);
  figma.viewport.scrollAndZoomIntoView([rootFrame]);
  return componentCount;
}

// Selection listener for Free Code Connect Inspector
figma.on("selectionchange", () => {
  const sel = figma.currentPage.selection[0];
  if (!sel) return;
  const matched = TUX_COMPONENTS.find(
    (c) => sel.name.toLowerCase().includes(c.name.toLowerCase()) || sel.name.toLowerCase().includes(c.tagName.toLowerCase()),
  );
  if (matched) {
    figma.ui.postMessage({ type: "selection-matched", component: matched });
  }
});

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === "sync-styles") {
      const count = await syncPaintAndTextStyles();
      figma.notify("TUX: Synced " + count + " Paint, Text & Effect Styles.");
      figma.ui.postMessage({ type: "status", text: "Synced " + count + " Paint, Text & Effect Styles across all 3 themes." });
    } else if (msg.type === "sync-variables") {
      const res = await syncFigmaVariables();
      const modeMsg = res.multiModeSupported
        ? "3-mode collection"
        : "3 single-mode collections (Free Starter Plan auto-fallback)";
      figma.notify("TUX: Synced " + res.createdCount + " Figma Variables (" + modeMsg + ").");
      figma.ui.postMessage({
        type: "status",
        text: "Synced " + res.createdCount + " Figma Variables (" + modeMsg + ").",
      });
    } else if (msg.type === "generate-kit") {
      const count = await generateAutoLayoutKitOnCanvas();
      figma.notify("TUX: Generated " + count + " Auto-Layout components on canvas.");
      figma.ui.postMessage({
        type: "status",
        text: "Generated " + count + " Auto-Layout master components on canvas.",
      });
    }
  } catch (err) {
    figma.notify("TUX Error: " + err.message, { error: true });
    figma.ui.postMessage({ type: "status", text: "Error: " + err.message });
  }
};
`;
}

export function renderPluginUi(themes) {
  const t = themes.tti;
  const codeConnect = buildCodeConnectRegistry();
  const allComponents = codeConnect.components;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>TUX Figma Kit Builder &amp; Code Connect</title>
  <style>
    :root {
      --brand-primary: ${t["brand-primary"]};
      --brand-accent: ${t["brand-accent"]};
      --surface-page: ${t["surface-page"]};
      --surface-eggshell: ${t["surface-eggshell"]};
      --surface-border: ${t["surface-border"]};
      --text-primary: ${t["text-primary"]};
      --text-secondary: ${t["text-secondary"]};
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Open Sans", sans-serif;
      background: var(--surface-eggshell);
      color: var(--text-primary);
      font-size: 13px;
    }
    .masthead {
      background: var(--brand-primary);
      color: #FFFFFF;
      padding: 12px 14px;
      border-bottom: 3px solid var(--brand-accent);
      border-radius: 4px;
      margin-bottom: 14px;
    }
    .masthead h1 {
      margin: 0;
      font-size: 15px;
      letter-spacing: 0.4px;
    }
    .masthead p {
      margin: 4px 0 0;
      font-size: 11px;
      opacity: 0.9;
    }
    .card {
      background: var(--surface-page);
      border: 1px solid var(--surface-border);
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 12px;
    }
    .card h2 {
      margin: 0 0 6px;
      font-size: 13px;
      color: var(--brand-primary);
    }
    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      min-height: 40px;
      padding: 8px 12px;
      margin-top: 8px;
      background: var(--brand-primary);
      color: #FFFFFF;
      border: none;
      border-radius: 4px;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
      text-align: left;
    }
    .btn--secondary {
      background: #FFFFFF;
      color: var(--brand-primary);
      border: 1.5px solid var(--brand-primary);
    }
    input[type="search"], select {
      width: 100%;
      height: 34px;
      border: 1px solid #525252;
      border-radius: 4px;
      padding: 0 8px;
      margin-bottom: 8px;
      font-size: 12px;
    }
    pre {
      background: #221F1F;
      color: #F9F9F7;
      padding: 10px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 11px;
      overflow-x: auto;
      margin: 6px 0 0;
    }
    #status {
      font-size: 11px;
      font-family: monospace;
      color: var(--brand-primary);
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="masthead">
    <h1>TUX · Figma Kit Builder</h1>
    <p>Texas A&amp;M Transportation Institute · Free Starter Plan Compatible</p>
  </div>

  <div class="card">
    <h2>1. Figma Document Setup</h2>
    <button class="btn" id="btn-kit">${lucideInlineHtmlSvg("layers")}<span>Generate Auto-Layout Component Kit on Canvas</span></button>
    <button class="btn btn--secondary" id="btn-styles">${lucideInlineHtmlSvg("palette")}<span>Sync Paint, Text &amp; Effect Styles (All 3 Themes)</span></button>
    <button class="btn btn--secondary" id="btn-vars">${lucideInlineHtmlSvg("sliders-horizontal")}<span>Sync Figma Variables (Free-Tier Compatible)</span></button>
    <div id="status">Ready · Offline plugin · Free Starter Plan supported.</div>
  </div>

  <div class="card">
    <h2>2. Code Connect Inspector (${allComponents.length} Components)</h2>
    <input type="search" id="comp-search" placeholder="Filter ${allComponents.length} components (e.g. Button, Table, Map)..." aria-label="Filter components" />
    <select id="comp-select" aria-label="Select component"></select>
    <div id="comp-blurb" style="font-size:12px;color:#424242;margin-bottom:6px;"></div>
    <strong>Vue 3 / Nuxt 4:</strong>
    <pre id="code-vue"></pre>
    <strong>React (@tti/tti-ux-react):</strong>
    <pre id="code-react"></pre>
    <strong>Web Components (@tti/tti-ux-elements):</strong>
    <pre id="code-wc"></pre>
  </div>

  <script>
    const ALL_COMPONENTS = ${JSON.stringify(allComponents)};
    let filtered = ALL_COMPONENTS;
    const searchEl = document.getElementById("comp-search");
    const selectEl = document.getElementById("comp-select");
    const blurbEl = document.getElementById("comp-blurb");
    const vueEl = document.getElementById("code-vue");
    const reactEl = document.getElementById("code-react");
    const wcEl = document.getElementById("code-wc");

    function renderComp(c) {
      if (!c) return;
      blurbEl.textContent = c.blurb + " (" + c.a11y.wcagLevel + " · " + c.a11y.textContrast + ")";
      vueEl.textContent = c.snippets.vue;
      reactEl.textContent = c.snippets.react;
      wcEl.textContent = c.snippets.webComponents;
    }

    function populateOptions(list) {
      selectEl.innerHTML = "";
      list.forEach((c, idx) => {
        const opt = document.createElement("option");
        opt.value = String(idx);
        opt.textContent = c.name + " (" + c.category + ")";
        selectEl.appendChild(opt);
      });
      if (list.length > 0) renderComp(list[0]);
    }

    searchEl.addEventListener("input", () => {
      const q = searchEl.value.trim().toLowerCase();
      filtered = q
        ? ALL_COMPONENTS.filter((c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.blurb.toLowerCase().includes(q))
        : ALL_COMPONENTS;
      populateOptions(filtered);
    });

    selectEl.addEventListener("change", () => renderComp(filtered[Number(selectEl.value)]));
    populateOptions(ALL_COMPONENTS);

    document.getElementById("btn-kit").onclick = () => parent.postMessage({ pluginMessage: { type: "generate-kit" } }, "*");
    document.getElementById("btn-styles").onclick = () => parent.postMessage({ pluginMessage: { type: "sync-styles" } }, "*");
    document.getElementById("btn-vars").onclick = () => parent.postMessage({ pluginMessage: { type: "sync-variables" } }, "*");

    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      if (!msg) return;
      if (msg.type === "status") {
        document.getElementById("status").textContent = msg.text;
      } else if (msg.type === "selection-matched" && msg.component) {
        renderComp(msg.component);
      }
    };
  </script>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// 7. Kit README (kit/figma/README.md)
// ---------------------------------------------------------------------------

export function renderFigmaReadme() {
  return `# TUX Figma Design Kit (\`kit/figma/\`)

Offline-capable Figma and W3C Design Token kit for the Texas A&M Transportation Institute (**TUX**) design system.

Every artifact in \`kit/figma/\` is deterministically compiled from [\`design/tokens.json\`](../../design/tokens.json) and [\`app/utils/tuxCatalog.ts\`](../../app/utils/tuxCatalog.ts) via \`npm run build:figma\`.

## Emitted Artifacts

| File | Purpose |
|---|---|
| \`kit/figma/tokens.dtcg.json\` | **W3C Design Tokens (DTCG 2025.10)** with \`$type\`, \`$value\`, and 3-mode extensions (\`tti\`, \`tti-dark\`, \`tti-hc\`). Compatible with Figma, Penpot, and Style Dictionary. |
| \`kit/figma/tokens-studio.json\` | **Tokens Studio for Figma** multi-mode token set with pre-configured \`$themes\` (\`Light (tti)\`, \`Dark (tti-dark)\`, \`High Contrast AAA (tti-hc)\`). |
| \`kit/figma/figma-variables.json\` | **Figma Variables payload** with \`COLOR\`, \`FLOAT\`, and \`STRING\` types, \`0..1\` RGBA floats, variable scopes, and platform \`codeSyntax\`. |
| \`kit/figma/code-connect.json\` | **183-Component Code Connect Registry** mapping every \`Tux*\` primitive to Vue 3, React, Web Component, Blazor, and WordPress snippets. |
| \`kit/figma/svg-components/*.svg\` | **18 Copy-to-Figma Vector Component Sheets** (\`TuxColorPalette\`, \`TuxButton\`, \`TuxBadge\`, \`TuxAlert\`, \`TuxCard\`, \`TuxBigStat\`, \`TuxStatus\`, \`TuxSpectrumRibbon\`, \`TuxPortalHeader\`, \`TuxSectionHeader\`, \`TuxDataTable\`, \`TuxFormControls\`, \`TuxCorridorStrip\`, \`TuxTabs\`, \`TuxBreadcrumbs\`, \`TuxModal\`, \`TuxToast\`, \`TuxDocsSidebar\`, \`TuxFooter\`, \`TuxStatComparison\`, \`TuxEmptyState\`, \`TuxGroundedSources\`, \`TuxToolCall\`). |
| \`kit/figma/plugin/manifest.json\` | **Local Figma Plugin** (\`allowedDomains: ["none"]\`) that builds Auto-Layout components, Paint/Text/Effect Styles, and Variables on the Figma Free Starter plan. |

## Quick Start

1. **Copy & Paste Vector Sheets (Web or Desktop):** On [\`/install/figma\`](/install/figma), click **Copy SVG** on any component sheet and press \`Cmd+V\` (macOS) or \`Ctrl+V\` (Windows) in Figma to paste editable vector frames and text layers.
2. **Tokens Studio Plugin:** Copy \`kit/figma/tokens-studio.json\` into the JSON tab of the free **Tokens Studio for Figma** plugin to load Light, Dark, and High-Contrast themes.
3. **Local Figma Desktop Plugin:** In Figma Desktop, select **Plugins → Development → Import plugin from manifest...** and choose \`kit/figma/plugin/manifest.json\` to generate Auto-Layout components, Paint Styles, and Variables (with automatic single-mode collection fallback on the Free Starter plan).
`;
}

// ---------------------------------------------------------------------------
// Generator Entrypoint
// ---------------------------------------------------------------------------

export function generate() {
  const themes = resolvedThemes();
  const sheets = buildSvgComponentSheets(themes);

  const svgManifest = {
    _generated: GENERATED_NOTE,
    count: sheets.length,
    sheets: sheets.map(({ id, name, category, route, dimensions, description }) => ({
      id,
      name,
      category,
      route,
      dimensions,
      description,
      file: `kit/figma/svg-components/${id}.svg`,
    })),
  };

  const out = new Map([
    ["kit/figma/tokens.dtcg.json", renderDtcgTokens(themes)],
    ["kit/figma/tokens-studio.json", renderTokensStudio(themes)],
    ["kit/figma/figma-variables.json", renderFigmaVariables(themes)],
    ["kit/figma/code-connect.json", renderCodeConnect()],
    ["kit/figma/svg-components/manifest.json", JSON.stringify(svgManifest, null, 2) + "\n"],
    ["kit/figma/plugin/manifest.json", renderPluginManifest()],
    ["kit/figma/plugin/code.js", renderPluginCode(themes)],
    ["kit/figma/plugin/ui.html", renderPluginUi(themes)],
    ["kit/figma/README.md", renderFigmaReadme()],
  ]);

  for (const sheet of sheets) {
    out.set(`kit/figma/svg-components/${sheet.id}.svg`, sheet.svg + "\n");
  }

  return out;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const isCheck = process.argv.includes("--check") || process.argv.includes("--verify");
  const files = generate();

  if (isCheck) {
    let failed = false;
    for (const [rel, expected] of files) {
      const abs = path.join(ROOT, rel);
      if (!fs.existsSync(abs)) {
        console.error(`Missing generated Figma kit file: ${rel}`);
        failed = true;
        continue;
      }
      const actual = fs.readFileSync(abs, "utf8");
      if (actual !== expected) {
        console.error(`Drift detected in ${rel}. Run 'npm run build:figma'.`);
        failed = true;
      }
    }
    if (failed) process.exit(1);
    console.log(`Verified ${files.size} Figma kit artifacts in kit/figma/.`);
  } else {
    for (const [rel, content] of files) {
      const abs = path.join(ROOT, rel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, content);
    }
    console.log(`Wrote ${files.size} Figma kit artifacts to kit/figma/.`);
  }
}
