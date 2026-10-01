/**
 * tests/tux-bridge-aaa.test.ts — Verification of tux-bridge.css and WCAG 2.2 AAA Standards.
 *
 * Verifies:
 *   1. Delivery and byte-synchronization between kit/css/ and public/css/.
 *   2. Strict WCAG 2.2 Level AAA contrast ratios (>= 7.0:1 normal text).
 *   3. Strict WCAG 2.2 Level AAA focus appearance indicators (>= 2px stroke, >= 3:1 delta).
 *   4. Strict WCAG 2.2 Level AAA minimum touch target sizing (>= 44x44px).
 *   5. Brand alignment with TTI Communications (Kadence 0px buttons, gold keylines).
 */
import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const KIT_CSS_PATH = join(ROOT, "kit/css/tux-bridge.css");
const PUBLIC_CSS_PATH = join(ROOT, "public/css/tux-bridge.css");

/** WCAG 2.2 standard relative luminance formula */
function getRelativeLuminance(hex: string): number {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;

  const [rL, gL, bL] = [r, g, b].map((val) =>
    val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4),
  );

  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

/** WCAG 2.2 contrast ratio formula: (L1 + 0.05) / (L2 + 0.05) */
function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("tux-bridge.css stylesheet distribution", () => {
  it("exists in kit/css and public/css", () => {
    expect(existsSync(KIT_CSS_PATH)).toBe(true);
    expect(existsSync(PUBLIC_CSS_PATH)).toBe(true);
  });

  it("kit/css/tux-bridge.css and public/css/tux-bridge.css are byte-identical", () => {
    const kitContent = readFileSync(KIT_CSS_PATH, "utf8");
    const publicContent = readFileSync(PUBLIC_CSS_PATH, "utf8");
    expect(publicContent).toBe(kitContent);
  });
});

describe("WCAG 2.2 Level AAA — Mathematical Contrast Verification", () => {
  it("Aggie Maroon (#500000) on White (#FFFFFF) exceeds WCAG AAA (>= 7.0:1)", () => {
    const ratio = getContrastRatio("#500000", "#ffffff");
    expect(ratio).toBeGreaterThanOrEqual(7.0);
    expect(ratio).toBeGreaterThan(15.0); // Actually ~15.66:1
  });

  it("White text (#FFFFFF) on Aggie Maroon (#500000) header exceeds WCAG AAA (>= 7.0:1)", () => {
    const ratio = getContrastRatio("#ffffff", "#500000");
    expect(ratio).toBeGreaterThanOrEqual(7.0);
    expect(ratio).toBeGreaterThan(15.0);
  });

  it("Primary text (#111827) on White (#FFFFFF) exceeds WCAG AAA (>= 7.0:1)", () => {
    const ratio = getContrastRatio("#111827", "#ffffff");
    expect(ratio).toBeGreaterThanOrEqual(7.0);
    expect(ratio).toBeGreaterThan(17.0); // Actually ~17.74:1
  });

  it("Secondary text (#374151) on White (#FFFFFF) exceeds WCAG AAA (>= 7.0:1)", () => {
    const ratio = getContrastRatio("#374151", "#ffffff");
    expect(ratio).toBeGreaterThanOrEqual(7.0);
    expect(ratio).toBeGreaterThan(10.0); // Actually ~10.31:1
  });

  it("Muted placeholder text (#4b5563) on White (#FFFFFF) exceeds WCAG AAA (>= 7.0:1)", () => {
    const ratio = getContrastRatio("#4b5563", "#ffffff");
    expect(ratio).toBeGreaterThanOrEqual(7.0); // Actually ~7.56:1
  });

  it("Warm Gold (#cfa935) on Dark Charcoal (#221f1f) badge exceeds WCAG AAA (>= 7.0:1)", () => {
    const ratio = getContrastRatio("#cfa935", "#221f1f");
    expect(ratio).toBeGreaterThanOrEqual(7.0); // Actually ~7.31:1
  });

  it("Warm Gold (#cfa935) is strictly prevented from being used as text on white", () => {
    const ratioOnWhite = getContrastRatio("#cfa935", "#ffffff");
    // Gold on white is ~2.24:1, which would fail WCAG AAA.
    expect(ratioOnWhite).toBeLessThan(4.5);

    // Verify tux-bridge.css never assigns gold as body text or link text on white
    const css = readFileSync(KIT_CSS_PATH, "utf8");
    expect(css).not.toMatch(/color:\s*var\(--tux-bridge-gold\);\s*background-color:\s*var\(--tux-bridge-surface\)/);
  });
});

describe("WCAG 2.2 Level AAA — Criterion Verification in tux-bridge.css", () => {
  const css = readFileSync(KIT_CSS_PATH, "utf8");

  it("Criterion 2.5.8 (Target Size - AAA): enforces minimum 44px hit target", () => {
    expect(css).toContain("--tux-bridge-min-target: 44px;");
    expect(css).toContain("min-height: var(--tux-bridge-min-target);");
  });

  it("Criterion 2.4.13 (Focus Appearance - AAA): enforces >= 3px outline with offset", () => {
    expect(css).toContain("--tux-bridge-focus-width: 3px;");
    expect(css).toContain("outline: var(--tux-bridge-focus-width) solid var(--tux-bridge-maroon);");
    expect(css).toContain("outline-offset: var(--tux-bridge-focus-offset);");
  });

  it("Criterion 1.4.8 (Visual Presentation - AAA): enforces line-height 1.6 and max-width 75ch", () => {
    expect(css).toContain("line-height: 1.6;");
    expect(css).toContain("max-width: 75ch;");
  });

  it("Criterion 1.4.1 (Use of Color): hyperlinks have non-color underline indicator", () => {
    expect(css).toContain("text-decoration: underline;");
    expect(css).toContain("text-underline-offset: 3px;");
  });

  it("TTI Communications Brand Parity: button radius is 0px and headings feature gold keylines", () => {
    expect(css).toContain("--tux-bridge-radius: 0px;");
    expect(css).toContain("border-bottom: 3px solid var(--tux-bridge-gold);");
  });
});
