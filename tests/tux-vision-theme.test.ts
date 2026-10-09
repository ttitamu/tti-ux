// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { runComponentAxe } from "./axe-helper";

/** Helper relative luminance and contrast ratio according to WCAG 2.2 */
function getRelativeLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const [rL, gL, bL] = [r, g, b].map((val) =>
    val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4),
  );

  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Anti-Halation Soft Dark Theme (Astigmatism Comfort)", () => {
  it("verifies clinical contrast ratios exceed WCAG 2.2 Level AAA requirements", () => {
    const pageCanvas = "#161a22";
    const textPrimary = "#e6edf3";
    const textSecondary = "#9da7b5";
    const surfaceBorder = "#384152";

    const primaryContrast = getContrastRatio(textPrimary, pageCanvas);
    const secondaryContrast = getContrastRatio(textSecondary, pageCanvas);
    const borderContrast = getContrastRatio(surfaceBorder, pageCanvas);

    // WCAG 2.2 Level AAA requires >= 7.0:1 for normal text copy
    expect(primaryContrast).toBeGreaterThanOrEqual(7.0);
    expect(primaryContrast).toBeCloseTo(14.75, 1);

    // Secondary subheadings / labels also exceed 7.0:1
    expect(secondaryContrast).toBeGreaterThanOrEqual(7.0);
    expect(secondaryContrast).toBeCloseTo(7.16, 1);

    // Focused / active interactive UI boundary requires >= 3.0:1
    const focusIndicator = "#6bb4c0";
    const focusContrast = getContrastRatio(focusIndicator, pageCanvas);
    expect(focusContrast).toBeGreaterThanOrEqual(3.0);
    expect(focusContrast).toBeCloseTo(7.40, 1);
  });

  it("mounts soft dark container and passes axe accessibility checks", async () => {
    const container = document.createElement("div");
    container.className = "tux-theme--soft-dark p-6";
    container.setAttribute("data-theme", "tti-dark");
    container.setAttribute("data-theme-variant", "soft");
    container.setAttribute("data-vision-comfort", "anti-halation");
    container.innerHTML = `
      <h1 class="heading--bold text-xl font-bold mb-2">Astigmatism Comfort Mode</h1>
      <p class="text-sm text-text-secondary leading-relaxed">
        Calibrated slate-charcoal canvas eliminates optical halation.
      </p>
      <div class="mt-4 p-4 border rounded">Card container with soft borders</div>
    `;

    expect(container.getAttribute("data-theme")).toBe("tti-dark");
    expect(container.getAttribute("data-theme-variant")).toBe("soft");
    expect(container.getAttribute("data-vision-comfort")).toBe("anti-halation");
    expect(container.classList.contains("tux-theme--soft-dark")).toBe(true);

    const violations = await runComponentAxe(container);
    expect(violations).toEqual([]);
  });
});
