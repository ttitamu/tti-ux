/**
 * TUX Design Token Studio Utilities
 *
 * Pure utilities for the interactive Design Token Studio (/tokens/playground):
 *   1. WCAG 2.2 relative luminance & contrast ratio math
 *   2. 1-click perceptual hue-preserving AAA contrast snapper (≥ 7.0:1)
 *   3. W3C Design Tokens Community Group (DTCG 2025.10) JSON exporter
 *   4. Figma Variables & Tokens Studio multi-mode JSON exporter
 */

export interface TokenStudioExportInput {
  presetId: string;
  presetName?: string;
  primaryColor: string;
  accentColor: string;
  radius: number;
  fontFamily: string;
  density: "compact" | "standard" | "roomy";
  shape: "default" | "sharp" | "pill";
  theme: "light" | "dark";
}

export interface ContrastGuardrailResult {
  ratio: number;
  passesAAA: boolean;
  passesAA: boolean;
  level: "AAA" | "AA" | "Fail";
  targetRatio: number;
  surfaceHex: string;
  recommendedHex: string;
}

/**
 * Parse a 3-digit or 6-digit hex color string into [r, g, b] in 0..255.
 */
export function parseHexRgb(hex: string): [number, number, number] {
  const clean = hex.trim().replace(/^#/, "");
  if (clean.length === 3) {
    const r = Number.parseInt(clean[0]! + clean[0]!, 16);
    const g = Number.parseInt(clean[1]! + clean[1]!, 16);
    const b = Number.parseInt(clean[2]! + clean[2]!, 16);
    return [
      Number.isNaN(r) ? 0 : r,
      Number.isNaN(g) ? 0 : g,
      Number.isNaN(b) ? 0 : b,
    ];
  }
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  return [
    Number.isNaN(r) ? 0 : r,
    Number.isNaN(g) ? 0 : g,
    Number.isNaN(b) ? 0 : b,
  ];
}

/**
 * Compute WCAG 2.x relative luminance (0.0 to 1.0) for a hex color.
 */
export function relativeLuminance(hex: string): number {
  const [r8, g8, b8] = parseHexRgb(hex);
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const r = toLinear(r8);
  const g = toLinear(g8);
  const b = toLinear(b8);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Compute WCAG 2.2 contrast ratio (1.00 to 21.00) between two hex colors.
 */
export function computeContrastRatio(fgHex: string, bgHex: string): number {
  const l1 = relativeLuminance(fgHex);
  const l2 = relativeLuminance(bgHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      case bn:
        h = (rn - gn) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = Math.max(0, Math.min(100, s)) / 100;
  const ln = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let r1: number;
  let g1: number;
  let b1: number;

  if (h >= 0 && h < 60) {
    r1 = c;
    g1 = x;
    b1 = 0;
  } else if (h >= 60 && h < 120) {
    r1 = x;
    g1 = c;
    b1 = 0;
  } else if (h >= 120 && h < 180) {
    r1 = 0;
    g1 = c;
    b1 = x;
  } else if (h >= 180 && h < 240) {
    r1 = 0;
    g1 = x;
    b1 = c;
  } else if (h >= 240 && h < 300) {
    r1 = x;
    g1 = 0;
    b1 = c;
  } else {
    r1 = c;
    g1 = 0;
    b1 = x;
  }

  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, (n + m) * 255)))
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();

  return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`;
}

/**
 * Snap any foreground hex color to achieve at least `targetRatio` (default 7.0:1 WCAG AAA)
 * against `surfaceHex`, preserving the original hue and saturation as closely as possible.
 */
export function snapHexToAAA(
  fgHex: string,
  surfaceHex: string,
  targetRatio = 7.0,
): string {
  if (computeContrastRatio(fgHex, surfaceHex) >= targetRatio) {
    return fgHex.toUpperCase();
  }

  const [r, g, b] = parseHexRgb(fgHex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const bgLum = relativeLuminance(surfaceHex);

  // If background is light (lum > 0.5), we darken lightness toward 0.
  // If background is dark (lum <= 0.5), we lighten lightness toward 100.
  const darken = bgLum > 0.5;
  let low = darken ? 0 : l;
  let high = darken ? l : 100;
  let bestHex = darken ? "#000000" : "#FFFFFF";

  for (let i = 0; i < 28; i++) {
    const mid = (low + high) / 2;
    const candidate = hslToHex(h, s, mid);
    const ratio = computeContrastRatio(candidate, surfaceHex);

    if (ratio >= targetRatio) {
      bestHex = candidate;
      // Move closer to the original lightness `l` while keeping >= targetRatio
      if (darken) {
        low = mid;
      } else {
        high = mid;
      }
    } else {
      if (darken) {
        high = mid;
      } else {
        low = mid;
      }
    }
  }

  return bestHex;
}

/**
 * Evaluate WCAG 2.2 contrast guardrail for a foreground color on a given canvas surface.
 */
export function evaluateContrastGuardrail(
  fgHex: string,
  surfaceHex: string,
  targetRatio = 7.0,
): ContrastGuardrailResult {
  const ratio = computeContrastRatio(fgHex, surfaceHex);
  const passesAAA = ratio >= targetRatio;
  const passesAA = ratio >= 4.5;
  const level = passesAAA ? "AAA" : passesAA ? "AA" : "Fail";
  const recommendedHex = passesAAA
    ? fgHex.toUpperCase()
    : snapHexToAAA(fgHex, surfaceHex, targetRatio);

  return {
    ratio,
    passesAAA,
    passesAA,
    level,
    targetRatio,
    surfaceHex,
    recommendedHex,
  };
}

/**
 * Generate W3C Design Tokens Community Group (DTCG) format JSON.
 */
export function generateW3cDtcgTokens(input: TokenStudioExportInput): string {
  const surfaceHex = input.theme === "light" ? "#FFFFFF" : "#09090B";
  const primaryGuard = evaluateContrastGuardrail(input.primaryColor, surfaceHex, 7.0);
  const accentGuard = evaluateContrastGuardrail(input.accentColor, surfaceHex, 7.0);

  const payload = {
    $schema: "https://tr.designtokens.org/format/",
    $metadata: {
      generator: "TUX v3.2 Design Token Studio",
      institution: "Texas A&M Transportation Institute (TTI)",
      preset: input.presetId,
      wcagTarget: "WCAG 2.2 Level AAA (7.0:1)",
    },
    color: {
      brand: {
        primary: {
          $type: "color",
          $value: input.primaryColor,
          $description: `TTI Brand Primary (${primaryGuard.ratio}:1 on ${input.theme} surface)`,
        },
        accent: {
          $type: "color",
          $value: input.accentColor,
          $description: `TTI Warm Gold Accent (${accentGuard.ratio}:1 on ${input.theme} surface)`,
        },
        "accent-aaa-ink": {
          $type: "color",
          $value: accentGuard.recommendedHex,
          $description: "Auto-snapped WCAG AAA (7.0:1) text/ink variant for accent gold",
        },
      },
      division: {
        maroon: { $type: "color", $value: "#500000", $description: "Executive & Policy" },
        blue: { $type: "color", $value: "#003C71", $description: "Connected & Automated Vehicles" },
        teal: { $type: "color", $value: "#0D5C63", $description: "Freight & Maritime" },
        green: { $type: "color", $value: "#1B5E20", $description: "Roadway Safety & Human Factors" },
        gold: { $type: "color", $value: "#7A5200", $description: "Infrastructure & Pavements" },
      },
    },
    dimension: {
      radius: {
        sm: { $type: "dimension", $value: `${Math.max(0, input.radius - 2)}px` },
        md: { $type: "dimension", $value: `${input.radius}px` },
        lg: { $type: "dimension", $value: `${input.radius * 2}px` },
        full: { $type: "dimension", $value: input.radius === 0 ? "0px" : "9999px" },
      },
    },
    fontFamily: {
      body: {
        $type: "fontFamily",
        $value: input.fontFamily,
        $description: "Primary UI & longform reading stack",
      },
      display: {
        $type: "fontFamily",
        $value: input.fontFamily,
        $description: "Institutional display heading stack",
      },
    },
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Generate Figma Variables & Tokens Studio multi-mode JSON export.
 */
export function generateFigmaVariablesJson(input: TokenStudioExportInput): string {
  const lightPrimaryAAA = snapHexToAAA(input.primaryColor, "#FFFFFF", 7.0);
  const darkPrimaryAAA = snapHexToAAA(input.primaryColor, "#09090B", 7.0);
  const lightAccentAAA = snapHexToAAA(input.accentColor, "#FFFFFF", 7.0);
  const darkAccentAAA = snapHexToAAA(input.accentColor, "#09090B", 7.0);

  const payload = {
    version: "1.0",
    collection: "TUX Institutional Variables",
    modes: ["Light", "Dark", "Field Sunlight (RELLIS)"],
    variables: [
      {
        name: "brand/primary",
        type: "COLOR",
        scopes: ["ALL_FILLS", "STROKE_COLOR"],
        valuesByMode: {
          Light: lightPrimaryAAA,
          Dark: darkPrimaryAAA,
          "Field Sunlight (RELLIS)": "#3A0000",
        },
      },
      {
        name: "brand/accent",
        type: "COLOR",
        scopes: ["ALL_FILLS", "STROKE_COLOR"],
        valuesByMode: {
          Light: input.accentColor,
          Dark: darkAccentAAA,
          "Field Sunlight (RELLIS)": lightAccentAAA,
        },
      },
      {
        name: "surface/page",
        type: "COLOR",
        scopes: ["FRAME_FILL", "SHAPE_FILL"],
        valuesByMode: {
          Light: "#FFFFFF",
          Dark: "#09090B",
          "Field Sunlight (RELLIS)": "#FFFFFF",
        },
      },
      {
        name: "geometry/radius-md",
        type: "FLOAT",
        scopes: ["CORNER_RADIUS"],
        valuesByMode: {
          Light: input.radius,
          Dark: input.radius,
          "Field Sunlight (RELLIS)": 0,
        },
      },
      {
        name: "typography/font-body",
        type: "STRING",
        scopes: ["FONT_FAMILY"],
        valuesByMode: {
          Light: input.fontFamily,
          Dark: input.fontFamily,
          "Field Sunlight (RELLIS)": input.fontFamily,
        },
      },
    ],
  };

  return JSON.stringify(payload, null, 2);
}
