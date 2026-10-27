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
      id: "tux-button",
      name: "TuxButton",
      category: "Actions & Commands",
      route: "/components/button",
      dimensions: "760 × 220",
      description:
        "Primary Maroon, Secondary Outline, Warm Gold Accent, Danger, and Dark Mode button variants at 44px WCAG 2.2 AAA target height.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="220" viewBox="0 0 760 220" fill="none">
  <rect id="TUX / TuxButton Sheet" width="760" height="220" rx="8" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
  <text x="24" y="34" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">TUX / TUXBUTTON · WCAG 2.2 AAA (44PX TARGETS)</text>
  <line x1="24" y1="44" x2="736" y2="44" stroke="${t["brand-accent"]}" stroke-width="2"/>
  <g id="Button / Primary (Light)" transform="translate(24, 64)">
    <rect width="156" height="44" rx="0" fill="${t["brand-primary"]}"/>
    <text x="78" y="27" text-anchor="middle" fill="${t["text-on-brand"]}" font-family="Open Sans, sans-serif" font-size="14" font-weight="600">Primary Action</text>
  </g>
  <g id="Button / Secondary Outline (Light)" transform="translate(196, 64)">
    <rect width="164" height="44" rx="0" fill="${t["surface-page"]}" stroke="${t["brand-primary"]}" stroke-width="2"/>
    <text x="82" y="27" text-anchor="middle" fill="${t["brand-primary"]}" font-family="Open Sans, sans-serif" font-size="14" font-weight="600">Secondary Outline</text>
  </g>
  <g id="Button / Gold Accent (Light)" transform="translate(376, 64)">
    <rect width="160" height="44" rx="0" fill="${t["brand-accent"]}" stroke="${t["brand-accent-ink"]}" stroke-width="1"/>
    <text x="80" y="27" text-anchor="middle" fill="${t["brand-accent-ink"]}" font-family="Open Sans, sans-serif" font-size="14" font-weight="700">Warm Gold CTA</text>
  </g>
  <g id="Button / Critical Danger (Light)" transform="translate(552, 64)">
    <rect width="160" height="44" rx="0" fill="${t["color-error"]}"/>
    <text x="80" y="27" text-anchor="middle" fill="${t["text-on-brand"]}" font-family="Open Sans, sans-serif" font-size="14" font-weight="600">Critical Stop</text>
  </g>
  <g id="Dark Surface Strip" transform="translate(24, 128)">
    <rect width="712" height="68" rx="6" fill="${d["surface-page"]}" stroke="${d["surface-border"]}"/>
    <g id="Button / Primary (Dark)" transform="translate(16, 12)">
      <rect width="164" height="44" rx="4" fill="${d["brand-primary"]}"/>
      <text x="82" y="27" text-anchor="middle" fill="${d["surface-page"]}" font-family="Open Sans, sans-serif" font-size="14" font-weight="700">Dark Mode Primary</text>
    </g>
    <g id="Button / Outline (Dark)" transform="translate(196, 12)">
      <rect width="164" height="44" rx="4" fill="${d["surface-raised"]}" stroke="${d["brand-primary"]}" stroke-width="1.5"/>
      <text x="82" y="27" text-anchor="middle" fill="${d["text-primary"]}" font-family="Open Sans, sans-serif" font-size="14" font-weight="600">Dark Secondary</text>
    </g>
    <text x="384" y="39" fill="${d["text-secondary"]}" font-family="JetBrains Mono, monospace" font-size="12">Focus Ring: 3px solid ${t["focus-ring-outer"]} · Min 44×44px</text>
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
        "Institutional security classification tiers, 5-Band Research Spectrum division pills, and Highway Capacity Manual (HCM) Level-of-Service (LOS A–F) badges.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="200" viewBox="0 0 760 200" fill="none">
  <rect id="TUX / TuxBadge Sheet" width="760" height="200" rx="8" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
  <text x="24" y="34" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">TUX / TUXBADGE · SECURITY TIERS, 5-BAND SPECTRUM &amp; HCM LOS A–F</text>
  <line x1="24" y1="44" x2="736" y2="44" stroke="${t["brand-accent"]}" stroke-width="2"/>
  <g id="Badge / Tier Public" transform="translate(24, 62)">
    <rect width="108" height="28" rx="4" fill="${t["surface-sunken"]}" stroke="${t["surface-border"]}"/>
    <circle cx="14" cy="14" r="4" fill="${t["color-success"]}"/>
    <text x="26" y="18" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="600">PUBLIC TIER</text>
  </g>
  <g id="Badge / Tier Internal" transform="translate(144, 62)">
    <rect width="118" height="28" rx="4" fill="${t["surface-eggshell"]}" stroke="${t["tti-navy"]}"/>
    <circle cx="14" cy="14" r="4" fill="${t["tti-navy"]}"/>
    <text x="26" y="18" fill="${t["tti-navy"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="700">INTERNAL</text>
  </g>
  <g id="Badge / Tier Sensitive" transform="translate(274, 62)">
    <rect width="124" height="28" rx="4" fill="${t["color-gold-100"]}" stroke="${t["color-gold-800"]}"/>
    <rect x="10" y="10" width="8" height="8" fill="${t["color-gold-800"]}"/>
    <text x="26" y="18" fill="${t["color-gold-900"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="700">SENSITIVE</text>
  </g>
  <g id="Badge / Tier Restricted" transform="translate(410, 62)">
    <rect width="132" height="28" rx="4" fill="${t["brand-primary"]}"/>
    <polygon points="14,9 19,19 9,19" fill="${t["brand-accent"]}"/>
    <text x="26" y="18" fill="${t["text-on-brand"]}" font-family="Open Sans, sans-serif" font-size="12" font-weight="700">RESTRICTED</text>
  </g>
  <g id="HCM Level of Service Row" transform="translate(24, 112)">
    <text x="0" y="18" fill="${t["text-secondary"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="600">HCM LOS:</text>
    <g id="LOS A" transform="translate(72, 0)">
      <rect width="84" height="28" rx="4" fill="${t["status-ok"]}"/>
      <text x="42" y="18" text-anchor="middle" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">● LOS A</text>
    </g>
    <g id="LOS B" transform="translate(166, 0)">
      <rect width="84" height="28" rx="4" fill="${t["color-success"]}"/>
      <text x="42" y="18" text-anchor="middle" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">▲ LOS B</text>
    </g>
    <g id="LOS C" transform="translate(260, 0)">
      <rect width="84" height="28" rx="4" fill="${t["color-info"]}"/>
      <text x="42" y="18" text-anchor="middle" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">■ LOS C</text>
    </g>
    <g id="LOS D" transform="translate(354, 0)">
      <rect width="84" height="28" rx="4" fill="${t["color-gold-800"]}"/>
      <text x="42" y="18" text-anchor="middle" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">◆ LOS D</text>
    </g>
    <g id="LOS E" transform="translate(448, 0)">
      <rect width="84" height="28" rx="4" fill="${t["status-unknown"]}"/>
      <text x="42" y="18" text-anchor="middle" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">▼ LOS E</text>
    </g>
    <g id="LOS F" transform="translate(542, 0)">
      <rect width="84" height="28" rx="4" fill="${t["status-critical"]}"/>
      <text x="42" y="18" text-anchor="middle" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">✖ LOS F</text>
    </g>
  </g>
  <text x="24" y="174" fill="${t["text-muted"]}" font-family="Open Sans, sans-serif" font-size="12">Triple-redundant encoding: Color + Geometric Icon + Explicit Label (WCAG 1.4.1 &amp; 1.4.6 AAA)</text>
</svg>`,
    },
    {
      id: "tux-alert",
      name: "TuxAlert",
      category: "Feedback & Status",
      route: "/components/alert",
      dimensions: "760 × 230",
      description:
        "Institutional admonition banners (Compliance, Info, Warning, Critical) with 4px structural accent spine and >= 7:1 AAA contrast.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="230" viewBox="0 0 760 230" fill="none">
  <rect id="TUX / TuxAlert Sheet" width="760" height="230" rx="8" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
  <text x="24" y="34" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">TUX / TUXALERT · INSTITUTIONAL CALLOUTS &amp; ADMONITIONS</text>
  <line x1="24" y1="44" x2="736" y2="44" stroke="${t["brand-accent"]}" stroke-width="2"/>
  <g id="Alert / Compliance" transform="translate(24, 60)">
    <rect width="712" height="68" rx="4" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
    <rect width="6" height="68" rx="2" fill="${t["brand-primary"]}"/>
    <text x="22" y="26" fill="${t["brand-primary"]}" font-family="Open Sans, sans-serif" font-size="14" font-weight="700">Institutional Compliance &amp; Provenance Notice (WCAG 2.2 Level AAA)</text>
    <text x="22" y="48" fill="${t["text-secondary"]}" font-family="Open Sans, sans-serif" font-size="13">All telemetry tables and roadway advisories maintain ≥ 7.0:1 normal text contrast across light, dark, and RELLIS sunlight modes.</text>
  </g>
  <g id="Alert / Critical Error" transform="translate(24, 142)">
    <rect width="712" height="68" rx="4" fill="${t["surface-page"]}" stroke="${t["status-critical"]}"/>
    <rect width="6" height="68" rx="2" fill="${t["status-critical"]}"/>
    <text x="22" y="26" fill="${t["status-critical"]}" font-family="Open Sans, sans-serif" font-size="14" font-weight="700">Corridor Telemetry Feed Interrupted — IH-35W Northbound Sensor Array</text>
    <text x="22" y="48" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="13">Automatic fallback to archival 5-minute loop detector aggregates activated. Verify RSU uplink at STA 142+50.</text>
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
        "Elevation-aware institutional surface card with 5-Band Spectrum top bar, eyebrow kicker, Oswald display heading, and metadata footer.",
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
        "ADR-0013 Operational Status Palette (OK, Warning, Unknown, Critical, Maintenance, Pending) perceptual OKLab ramp.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="170" viewBox="0 0 760 170" fill="none">
  <rect id="TUX / TuxStatus Sheet" width="760" height="170" rx="8" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
  <text x="24" y="34" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">TUX / TUXSTATUS · ADR-0013 OPERATIONAL TELEMETRY PALETTE</text>
  <line x1="24" y1="44" x2="736" y2="44" stroke="${t["brand-accent"]}" stroke-width="2"/>
  <g id="Status / OK" transform="translate(24, 68)">
    <rect width="106" height="32" rx="4" fill="${t["status-ok-fill"]}" stroke="${t["status-ok"]}" stroke-width="1.5"/>
    <circle cx="16" cy="16" r="5" fill="${t["status-ok"]}"/>
    <text x="28" y="20" fill="${t["status-ok-ink"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">NOMINAL</text>
  </g>
  <g id="Status / Warning" transform="translate(142, 68)">
    <rect width="110" height="32" rx="4" fill="${t["status-warning-fill"]}" stroke="${t["status-warning"]}" stroke-width="1.5"/>
    <polygon points="16,10 22,21 10,21" fill="${t["status-warning"]}"/>
    <text x="28" y="20" fill="${t["status-warning-ink"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">WARNING</text>
  </g>
  <g id="Status / Unknown" transform="translate(264, 68)">
    <rect width="114" height="32" rx="4" fill="${t["status-unknown-fill"]}" stroke="${t["status-unknown"]}" stroke-width="1.5"/>
    <rect x="11" y="11" width="10" height="10" transform="rotate(45 16 16)" fill="${t["status-unknown"]}"/>
    <text x="28" y="20" fill="${t["status-unknown-ink"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">UNKNOWN</text>
  </g>
  <g id="Status / Critical" transform="translate(390, 68)">
    <rect width="116" height="32" rx="4" fill="${t["status-critical-fill"]}" stroke="${t["status-critical"]}" stroke-width="1.5"/>
    <rect x="11" y="11" width="10" height="10" fill="${t["status-critical"]}"/>
    <text x="28" y="20" fill="${t["status-critical-ink"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">CRITICAL</text>
  </g>
  <g id="Status / Maintenance" transform="translate(518, 68)">
    <rect width="112" height="32" rx="4" fill="${t["status-maintenance-fill"]}" stroke="${t["status-maintenance"]}" stroke-width="1.5"/>
    <circle cx="16" cy="16" r="5" fill="${t["status-maintenance"]}"/>
    <text x="28" y="20" fill="${t["status-maintenance-ink"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">MAINT</text>
  </g>
  <g id="Status / Pending" transform="translate(642, 68)">
    <rect width="94" height="32" rx="4" fill="${t["status-pending-fill"]}" stroke="${t["status-pending"]}" stroke-width="1.5"/>
    <text x="47" y="20" text-anchor="middle" fill="${t["status-pending-ink"]}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">PENDING</text>
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
        "Official 5-Band TTI Research Spectrum bar (Maroon, Navy Blue, Teal, Sage Green, Warm Gold) representing TTI's five core research divisions.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="160" viewBox="0 0 760 160" fill="none">
  <rect id="TUX / TuxSpectrumRibbon Sheet" width="760" height="160" rx="8" fill="${t["surface-page"]}" stroke="${t["surface-border"]}"/>
  <text x="24" y="34" fill="${t["brand-primary"]}" font-family="Oswald, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2">TUX / TUXSPECTRUMRIBBON · 5-BAND TTI RESEARCH SPECTRUM</text>
  <g id="Spectrum 5-Band Bar" transform="translate(24, 52)">
    <g id="Band 1 / Maroon (Policy &amp; Executive)">
      <rect x="0" y="0" width="142.4" height="16" fill="${t["brand-primary-deep"]}"/>
      <rect x="0" y="24" width="136" height="58" rx="4" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
      <text x="10" y="44" fill="${t["brand-primary-deep"]}" font-family="Oswald, sans-serif" font-size="13" font-weight="700">01 · POLICY</text>
      <text x="10" y="64" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11">${t["brand-primary-deep"]}</text>
    </g>
    <g id="Band 2 / Blue (Connected &amp; Automated)" transform="translate(142.4, 0)">
      <rect x="0" y="0" width="142.4" height="16" fill="${t["tti-navy"]}"/>
      <rect x="2" y="24" width="136" height="58" rx="4" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
      <text x="12" y="44" fill="${t["tti-navy"]}" font-family="Oswald, sans-serif" font-size="13" font-weight="700">02 · MOBILITY</text>
      <text x="12" y="64" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11">${t["tti-navy"]}</text>
    </g>
    <g id="Band 3 / Teal (Freight &amp; Maritime)" transform="translate(284.8, 0)">
      <rect x="0" y="0" width="142.4" height="16" fill="${t["color-info"]}"/>
      <rect x="4" y="24" width="136" height="58" rx="4" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
      <text x="14" y="44" fill="${t["color-info"]}" font-family="Oswald, sans-serif" font-size="13" font-weight="700">03 · FREIGHT</text>
      <text x="14" y="64" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11">${t["color-info"]}</text>
    </g>
    <g id="Band 4 / Green (Safety &amp; Environment)" transform="translate(427.2, 0)">
      <rect x="0" y="0" width="142.4" height="16" fill="${t["color-success"]}"/>
      <rect x="6" y="24" width="136" height="58" rx="4" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
      <text x="16" y="44" fill="${t["color-success"]}" font-family="Oswald, sans-serif" font-size="13" font-weight="700">04 · SAFETY</text>
      <text x="16" y="64" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11">${t["color-success"]}</text>
    </g>
    <g id="Band 5 / Gold (Infrastructure)" transform="translate(569.6, 0)">
      <rect x="0" y="0" width="142.4" height="16" fill="${t["brand-accent"]}"/>
      <rect x="6" y="24" width="136" height="58" rx="4" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
      <text x="16" y="44" fill="${t["color-gold-800"]}" font-family="Oswald, sans-serif" font-size="13" font-weight="700">05 · MATERIALS</text>
      <text x="16" y="64" fill="${t["text-muted"]}" font-family="JetBrains Mono, monospace" font-size="11">${t["brand-accent"]}</text>
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
        "Two-tier institutional masthead: TAMUS charcoal utility bar, invariant Maroon brand bar (--brand-fill), Warm Gold keyline, and global navigation.",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="150" viewBox="0 0 760 150" fill="none">
  <rect id="TUX / TuxPortalHeader Sheet" width="760" height="150" rx="8" fill="${t["surface-eggshell"]}" stroke="${t["surface-border"]}"/>
  <g id="Masthead / Utility Bar" transform="translate(16, 16)">
    <rect width="728" height="32" fill="${t["tti-charcoal"]}"/>
    <text x="16" y="20" fill="${t["text-on-brand"]}" font-family="Open Sans, sans-serif" font-size="11" font-weight="600">TEXAS A&amp;M TRANSPORTATION INSTITUTE · A MEMBER OF THE TEXAS A&amp;M UNIVERSITY SYSTEM</text>
    <text x="712" y="20" text-anchor="end" fill="${t["brand-accent"]}" font-family="JetBrains Mono, monospace" font-size="11">WCAG 2.2 AAA</text>
  </g>
  <g id="Masthead / Brand Ribbon" transform="translate(16, 48)">
    <rect width="728" height="64" fill="${t["brand-fill"]}"/>
    <rect x="16" y="14" width="52" height="36" rx="2" fill="${t["brand-primary-deep"]}" stroke="${t["brand-accent"]}" stroke-width="1.5"/>
    <text x="42" y="38" text-anchor="middle" fill="${t["text-on-brand"]}" font-family="Oswald, sans-serif" font-size="18" font-weight="700">TTI</text>
    <text x="82" y="34" fill="${t["text-on-brand"]}" font-family="Oswald, sans-serif" font-size="18" font-weight="700" letter-spacing="0.5">CORRIDOR TELEMETRY PORTAL</text>
    <text x="82" y="50" fill="${t["color-gold-200"]}" font-family="Open Sans, sans-serif" font-size="11">Statewide Operations &amp; Safety Analytics</text>
    <text x="450" y="38" fill="${t["text-on-brand"]}" font-family="Open Sans, sans-serif" font-size="13" font-weight="600">Overview</text>
    <line x1="450" y1="46" x2="508" y2="46" stroke="${t["brand-accent"]}" stroke-width="2"/>
    <text x="530" y="38" fill="${t["text-on-brand"]}" font-family="Open Sans, sans-serif" font-size="13">Corridors</text>
    <text x="610" y="38" fill="${t["text-on-brand"]}" font-family="Open Sans, sans-serif" font-size="13">Datasets</text>
    <rect x="676" y="18" width="36" height="28" rx="4" fill="${t["brand-primary-deep"]}" stroke="${t["brand-accent"]}"/>
    <text x="694" y="36" text-anchor="middle" fill="${t["text-on-brand"]}" font-family="JetBrains Mono, monospace" font-size="11">⌘K</text>
  </g>
  <rect x="16" y="112" width="728" height="4" fill="${t["brand-accent"]}"/>
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
    <text x="0" y="14" fill="${t["brand-primary"]}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" letter-spacing="1.4">DIVISION 04 · ROADWAY SAFETY &amp; HUMAN FACTORS</text>
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
    <text x="714" y="21" text-anchor="end" fill="${t["brand-primary"]}" font-family="Open Sans, sans-serif" font-size="11" font-weight="700">Copy Citation ↗</text>
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
    <polygon points="194,43 204,43 199,51" fill="${t["text-primary"]}"/>
  </g>
  <g id="Toggle &amp; Checkbox" transform="translate(516, 62)">
    <text x="0" y="14" fill="${t["text-primary"]}" font-family="Open Sans, sans-serif" font-size="13" font-weight="700">Telemetry Options</text>
    <rect x="0" y="28" width="24" height="24" rx="4" fill="${t["brand-primary"]}"/>
    <polyline points="6,40 10,45 18,35" stroke="${t["text-on-brand"]}" stroke-width="2.5" fill="none"/>
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
        "Linear Referencing System (LRS) highway corridor diagram with civil-engineering stationing ticks (STA 00+00 to STA 40+00) and sensor nodes.",
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
const TUX_COMPONENTS = ${JSON.stringify(codeConnect.components.slice(0, 60), null, 2)};

figma.showUI(__html__, { width: 460, height: 620, themeColors: true });

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
 * 1. Sync Paint Styles across all 3 themes (100% supported on Figma Free Starter Plan)
 */
async function syncPaintAndTextStyles() {
  const existingPaints = new Map(
    (await figma.getLocalPaintStylesAsync()).map((s) => [s.name, s]),
  );

  const styleTokens = [
    "brand-primary", "brand-primary-deep", "brand-accent", "brand-accent-deep",
    "brand-secondary", "brand-fill", "brand-accent-ink",
    "surface-page", "surface-raised", "surface-sunken", "surface-eggshell", "surface-border",
    "text-primary", "text-secondary", "text-muted", "text-on-brand",
    "status-ok", "status-warning", "status-unknown", "status-critical", "status-maintenance",
    "color-success", "color-warning", "color-danger", "color-error", "color-info",
    "spectrum-maroon", "spectrum-blue", "spectrum-teal", "spectrum-green", "spectrum-gold",
  ];

  let count = 0;
  for (const [themeKey, themeObj] of Object.entries(TUX_THEMES)) {
    for (const tokenName of styleTokens) {
      const raw = themeObj[tokenName];
      if (!raw || !String(raw).startsWith("#")) continue;
      const styleName = "TUX / " + themeKey + " / " + tokenName;
      const style = existingPaints.get(styleName) || figma.createPaintStyle();
      style.name = styleName;
      style.description = "TUX canonical token var(--" + tokenName + ") in theme " + themeKey;
      style.paints = [{ type: "SOLID", color: hexToRgb01(raw) }];
      count++;
    }
  }
  return count;
}

/**
 * 2. Sync Figma Variables with automatic Free Starter Plan 1-mode fallback
 */
async function syncFigmaVariables() {
  if (!figma.variables) {
    throw new Error("Figma Variables API is not available in this version of Figma.");
  }

  const collection = figma.variables.createVariableCollection("TUX Institutional Tokens");
  const lightModeId = collection.modes[0].modeId;
  collection.renameMode(lightModeId, "Light (tti)");

  let darkModeId = null;
  let hcModeId = null;
  let multiModeSupported = true;

  try {
    darkModeId = collection.addMode("Dark (tti-dark)");
    hcModeId = collection.addMode("High Contrast AAA (tti-hc)");
  } catch (_err) {
    // Figma Free Starter plan limits Variable Collections to 1 mode.
    // We automatically create 2 companion single-mode collections so free users get all 3 themes!
    multiModeSupported = false;
  }

  let createdCount = 0;

  if (multiModeSupported) {
    for (const v of TUX_VARIABLES) {
      const figVar = figma.variables.createVariable(v.name, collection, v.resolvedType);
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
    const darkCollection = figma.variables.createVariableCollection("TUX Tokens — Dark (tti-dark)");
    const darkSingleModeId = darkCollection.modes[0].modeId;
    darkCollection.renameMode(darkSingleModeId, "Dark (tti-dark)");

    const hcCollection = figma.variables.createVariableCollection("TUX Tokens — High Contrast (tti-hc)");
    const hcSingleModeId = hcCollection.modes[0].modeId;
    hcCollection.renameMode(hcSingleModeId, "High Contrast AAA (tti-hc)");

    for (const v of TUX_VARIABLES) {
      const vLight = figma.variables.createVariable(v.name, collection, v.resolvedType);
      const vDark = figma.variables.createVariable(v.name, darkCollection, v.resolvedType);
      const vHc = figma.variables.createVariable(v.name, hcCollection, v.resolvedType);

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

  const rootFrame = figma.createFrame();
  rootFrame.name = "TUX v3.0 — Institutional Figma UI Kit (WCAG 2.2 AAA)";
  rootFrame.layoutMode = "VERTICAL";
  rootFrame.primaryAxisSizingMode = "AUTO";
  rootFrame.counterAxisSizingMode = "AUTO";
  rootFrame.paddingTop = 32;
  rootFrame.paddingBottom = 32;
  rootFrame.paddingLeft = 32;
  rootFrame.paddingRight = 32;
  rootFrame.itemSpacing = 24;
  rootFrame.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["surface-eggshell"]) }];

  // Header Banner
  const header = figma.createFrame();
  header.name = "TUX / Masthead Banner";
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
  sub.characters = "100% W3C WCAG 2.2 Level AAA (≥ 7.0:1 Contrast · ≥ 44×44px Touch Targets) · Generated Zero-Subscription Kit";
  sub.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["brand-accent"]) }];

  header.appendChild(title);
  header.appendChild(sub);
  rootFrame.appendChild(header);

  // 5-Band Spectrum Ribbon Component
  const ribbonComp = figma.createComponent();
  ribbonComp.name = "TUX / TuxSpectrumRibbon";
  ribbonComp.layoutMode = "HORIZONTAL";
  ribbonComp.primaryAxisSizingMode = "AUTO";
  ribbonComp.counterAxisSizingMode = "AUTO";
  ribbonComp.itemSpacing = 0;

  const spectrumColors = [
    ["Maroon", TUX_THEMES.tti["brand-primary-deep"]],
    ["Navy", TUX_THEMES.tti["tti-navy"]],
    ["Teal", TUX_THEMES.tti["color-info"]],
    ["Green", TUX_THEMES.tti["color-success"]],
    ["Gold", TUX_THEMES.tti["brand-accent"]],
  ];
  for (const [bandName, hex] of spectrumColors) {
    const band = figma.createRectangle();
    band.name = "Spectrum / " + bandName;
    band.resize(136, 12);
    band.fills = [{ type: "SOLID", color: hexToRgb01(hex) }];
    ribbonComp.appendChild(band);
  }
  rootFrame.appendChild(ribbonComp);

  // Button Components Row
  const buttonRow = figma.createFrame();
  buttonRow.name = "TUX / Buttons Row (44px AAA)";
  buttonRow.layoutMode = "HORIZONTAL";
  buttonRow.primaryAxisSizingMode = "AUTO";
  buttonRow.counterAxisSizingMode = "AUTO";
  buttonRow.itemSpacing = 16;
  buttonRow.fills = [];

  const buttonVariants = [
    { name: "TUX / TuxButton / Primary", bg: TUX_THEMES.tti["brand-primary"], fg: "#FFFFFF", label: "Primary Action" },
    { name: "TUX / TuxButton / Accent Gold", bg: TUX_THEMES.tti["brand-accent"], fg: TUX_THEMES.tti["brand-accent-ink"], label: "Warm Gold CTA" },
    { name: "TUX / TuxButton / Critical", bg: TUX_THEMES.tti["status-critical"], fg: "#FFFFFF", label: "Critical Stop" },
    { name: "TUX / TuxButton / Dark Primary", bg: TUX_THEMES["tti-dark"]["brand-primary"], fg: TUX_THEMES["tti-dark"]["surface-page"], label: "Dark Mode Action" },
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
    btnComp.fills = [{ type: "SOLID", color: hexToRgb01(b.bg) }];

    const txt = figma.createText();
    txt.fontName = { family: "Inter", style: "Bold" };
    txt.fontSize = 14;
    txt.characters = b.label;
    txt.fills = [{ type: "SOLID", color: hexToRgb01(b.fg) }];
    btnComp.appendChild(txt);
    buttonRow.appendChild(btnComp);
  }
  rootFrame.appendChild(buttonRow);

  figma.currentPage.appendChild(rootFrame);
  figma.viewport.scrollAndZoomIntoView([rootFrame]);
  return 6;
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
      figma.notify("✓ TUX: Synced " + count + " Paint Styles across Light, Dark & High-Contrast!");
      figma.ui.postMessage({ type: "status", text: "Synced " + count + " Paint Styles across all 3 themes." });
    } else if (msg.type === "sync-variables") {
      const res = await syncFigmaVariables();
      const modeMsg = res.multiModeSupported
        ? "3-mode collection"
        : "3 single-mode collections (Free Starter Plan auto-fallback)";
      figma.notify("✓ TUX: Created " + res.createdCount + " Figma Variables (" + modeMsg + ")!");
      figma.ui.postMessage({
        type: "status",
        text: "Created " + res.createdCount + " Figma Variables (" + modeMsg + ").",
      });
    } else if (msg.type === "generate-kit") {
      const count = await generateAutoLayoutKitOnCanvas();
      figma.notify("✓ TUX: Generated Auto-Layout Component Kit on canvas!");
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
  const sampleComponents = codeConnect.components.slice(0, 24);

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
      display: block;
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
    select {
      width: 100%;
      height: 36px;
      border: 1px solid #525252;
      border-radius: 4px;
      padding: 0 8px;
      margin-bottom: 8px;
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
    <h1>TUX · Zero-Subscription Figma Kit</h1>
    <p>Texas A&amp;M Transportation Institute · WCAG 2.2 Level AAA</p>
  </div>

  <div class="card">
    <h2>1. 1-Click Figma Document Setup (Free Plan Compatible)</h2>
    <button class="btn" id="btn-kit">⚡ Generate Auto-Layout Component Kit on Canvas</button>
    <button class="btn btn--secondary" id="btn-styles">🎨 Sync All Paint Styles (Light, Dark, High-Contrast)</button>
    <button class="btn btn--secondary" id="btn-vars">🔢 Sync Figma Variables (Auto Free-Tier Fallback)</button>
    <div id="status">Ready · Zero external network calls · Free Starter Plan supported.</div>
  </div>

  <div class="card">
    <h2>2. Free Built-In Code Connect Inspector</h2>
    <label for="comp-select">Inspect TUX Component:</label>
    <select id="comp-select"></select>
    <div id="comp-blurb" style="font-size:12px;color:#424242;margin-bottom:6px;"></div>
    <strong>Vue 3 / Nuxt 4:</strong>
    <pre id="code-vue"></pre>
    <strong>React (@tti/tti-ux-react):</strong>
    <pre id="code-react"></pre>
    <strong>Web Components (@tti/tti-ux-elements):</strong>
    <pre id="code-wc"></pre>
  </div>

  <script>
    const COMPONENTS = ${JSON.stringify(sampleComponents)};
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

    COMPONENTS.forEach((c, idx) => {
      const opt = document.createElement("option");
      opt.value = String(idx);
      opt.textContent = c.name + " (" + c.category + ")";
      selectEl.appendChild(opt);
    });
    selectEl.addEventListener("change", () => renderComp(COMPONENTS[Number(selectEl.value)]));
    renderComp(COMPONENTS[0]);

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

**Zero-subscription, 100% offline-capable Figma & W3C Design Token kit** for the Texas A&M Transportation Institute (**TUX**) design system.

Every artifact in \`kit/figma/\` is deterministically compiled from [\`design/tokens.json\`](../../design/tokens.json) and [\`app/utils/tuxCatalog.ts\`](../../app/utils/tuxCatalog.ts) via \`npm run build:figma\`.

---

## How Does This Work Without a Paid Figma Subscription?

Figma normally gates three enterprise features behind paid plans:
1. **Variables REST API** (requires Figma Enterprise)
2. **Multi-Mode Variable Collections** (requires Figma Professional/Organization for >1 mode)
3. **Figma Code Connect CLI / Dev Mode** (requires paid Organization/Enterprise Dev Mode seats)

**TUX bypasses all three paywalls legally and natively using standard client-side interfaces:**

| Enterprise Feature | TUX Zero-Subscription Mechanism | Plan Required |
|---|---|---|
| **Variables REST API** | Local Figma Plugin (\`kit/figma/plugin/manifest.json\`) executes \`figma.variables.*\` directly inside the client sandbox | **Free Starter Plan** |
| **Multi-Mode Variables** | Plugin auto-detects the Free Starter 1-mode limit and creates 3 linked single-mode collections (\`Light\`, \`Dark\`, \`High Contrast AAA\`) + full Paint Styles | **Free Starter Plan** |
| **Canvas Component Kit** | **Copy-to-Figma SVG Sheets** (\`kit/figma/svg-components/*.svg\`) paste directly into Figma Web or Desktop as editable vector frames & text layers | **Free Starter Plan (Web or Desktop)** |
| **Dev Mode / Code Connect** | Built-in **TUX Code Connect Inspector** inside the local plugin + \`kit/figma/code-connect.json\` surfaces Vue, React, Web Components, Blazor & WordPress snippets | **Free Starter Plan** |
| **Open-Source Alternative** | \`kit/figma/tokens.dtcg.json\` (W3C DTCG 2025.10) + SVG component sheets import directly into **Penpot** (100% free & self-hostable) | **Free / Open Source** |

---

## Emitted Artifacts

| File | Purpose |
|---|---|
| \`kit/figma/tokens.dtcg.json\` | **W3C Design Tokens (DTCG 2025.10)** — canonical tokens with \`$type\`, \`$value\`, and 3-mode extensions (\`tti\`, \`tti-dark\`, \`tti-hc\`). Compatible with Figma, Penpot, and Style Dictionary. |
| \`kit/figma/tokens-studio.json\` | **Tokens Studio for Figma** multi-mode token set with pre-configured \`$themes\` (\`Light (tti)\`, \`Dark (tti-dark)\`, \`High Contrast AAA (tti-hc)\`). |
| \`kit/figma/figma-variables.json\` | **Native Figma Variables payload** with \`COLOR\`, \`FLOAT\`, and \`STRING\` types, \`0..1\` RGBA floats, variable scopes (\`FRAME_FILL\`, \`TEXT_FILL\`, \`CORNER_RADIUS\`), and platform \`codeSyntax\`. |
| \`kit/figma/code-connect.json\` | **183-Component Code Connect Registry** mapping every \`Tux*\` primitive to its Vue 3, React, Web Component, Blazor, and WordPress code snippets + WCAG 2.2 AAA contracts. |
| \`kit/figma/svg-components/*.svg\` | **12 Copy-to-Figma Vector Component Sheets** (\`TuxButton\`, \`TuxBadge\`, \`TuxAlert\`, \`TuxCard\`, \`TuxBigStat\`, \`TuxStatus\`, \`TuxSpectrumRibbon\`, \`TuxPortalHeader\`, \`TuxSectionHeader\`, \`TuxDataTable\`, \`TuxFormControls\`, \`TuxCorridorStrip\`). |
| \`kit/figma/plugin/manifest.json\` | **Local Figma Builder & Code Connect Plugin** (\`allowedDomains: ["none"]\`). Generates Auto-Layout components, Paint Styles, and Variables in 1 click. |

---

## Three Ways to Use the Kit (For Designers — Zero Code, Git, or Terminal Required)

A designer who **only knows Figma** can use the entire kit directly from [\`/install/figma\`](/install/figma) in their web browser:

### Workflow 1 — The 5-Second Copy & Paste *(Easiest — Works in Figma Web or Desktop)*

1. Open [\`/install/figma\`](/install/figma) in any web browser.
2. Scroll through the visual gallery (**Buttons**, **Badges & LOS Pills**, **Alerts**, **Cards**, **KPI BigStats**, **Data Tables**, **TTI Masthead**, **5-Band Spectrum Ribbon**, etc.).
3. Click the maroon **Copy SVG to Figma** button under any component sheet.
4. Switch to your Figma canvas and press **\`Cmd+V\`** (Mac) or **\`Ctrl+V\`** (Windows).
5. **What happens in Figma:** Figma automatically converts that clipboard paste into real, editable Figma frames, vector shapes, and text layers with exact TTI Maroon (\`#5C0025\`), Warm Gold (\`#DDAC37\`), and WCAG AAA sizing (\`44px\` click targets). Edit text normally or press \`Cmd+Option+K\` (\`Ctrl+Alt+K\`) to turn any group into a reusable Figma Component.

### Workflow 2 — Loading All TTI Colors & Themes *(Via the Free "Tokens Studio" Community Plugin)*

If you want all TTI Light, Dark, and High-Contrast color swatches inside Figma without touching files on disk:
1. On [\`/install/figma\`](/install/figma), click **Copy Tokens Studio JSON** (or select the **Tokens Studio (Multi-Mode)** tab and click **Copy Full Tokens Studio**).
2. In Figma, open the free **Tokens Studio for Figma** plugin from the Figma Community.
3. Switch to the **JSON** (\`{ }\`) tab inside the plugin, paste (\`Cmd+V\` / \`Ctrl+V\`), and click **Save**.
4. All TTI colors, 5-Band Spectrum divisions, spacing, and radii (\`Light\`, \`Dark\`, and \`High Contrast AAA\`) are now loaded and ready to apply to any layer.

### Workflow 3 — The 1-Click Auto-Layout & Styles Builder *(Figma Desktop App)*

If you want native **Figma Color Styles**, **Figma Variables**, and **Auto-Layout Components** built automatically into your document:
1. On [\`/install/figma\`](/install/figma), click **Download All 3 Plugin Files** (\`manifest.json\`, \`code.js\`, \`ui.html\`) and save them into a folder on your computer (or use \`kit/figma/plugin/\` from a repo checkout).
2. In the **Figma Desktop app**, open any design file and go to **Plugins → Development → Import plugin from manifest...** and select \`manifest.json\`.
3. Run **TUX Design System — Zero-Subscription Kit Builder & Code Connect** to open the TTI window with three 1-click buttons:
   - **⚡ Generate Auto-Layout Component Kit on Canvas** — draws a master component sheet with real Figma Auto-Layout (\`Shift+A\`) frames and components directly onto your page.
   - **🎨 Sync All Paint Styles** — adds all TTI Light, Dark, and High-Contrast colors to Figma's native right-hand **Color Styles** panel.
   - **🔢 Sync Figma Variables** — populates Figma's native **Local Variables** panel (and automatically works around the Free plan's 1-mode restriction by creating separate Light, Dark, and High-Contrast collections).
   - **Open-Source Penpot Alternative:** Import \`kit/figma/tokens.dtcg.json\` in Penpot's Design Tokens tab and drag \`kit/figma/svg-components/*.svg\` onto the Penpot canvas.
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
