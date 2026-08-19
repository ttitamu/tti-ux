/**
 * Color-discipline guards — sister to tux-typography.test.ts.
 *
 * Two rules from the 2026-08-19 visual-language pass:
 *
 * 1. **The wash ladder.** Every `color-mix(… N%, transparent)` wash
 *    below 60% uses a ladder percentage {4, 6, 8, 12, 18, 22, 35, 50}
 *    (visual-language-evolution.md § Batch L). ≥ 60% is a scrim/fill
 *    and exempt.
 *
 * 2. **The literal ratchet.** Raw color literals (bare hex, rgb/rgba)
 *    in component styles are frozen at the census below — the
 *    remaining budget is sanctioned chrome (OS window controls, ORCID
 *    green, emergency palettes, photo-overlay gradient art, print
 *    stylesheets). Adding a literal anywhere fails CI; removing one
 *    requires updating the map, which keeps the census honest. The
 *    sanctioned idiom `var(--token, #hex)` is not counted.
 *
 * The long-term direction is DOWN: shrink budgets as clusters get
 * tokenized, never grow them without a design decision.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const COMPONENTS = join(ROOT, "app/components");

const LADDER = new Set([4, 6, 8, 12, 18, 22, 35, 50]);

function componentFiles(): string[] {
  return readdirSync(COMPONENTS).filter((f) => f.endsWith(".vue"));
}

describe("wash ladder", () => {
  it("every sub-60% color-mix wash sits on the ladder", () => {
    const offenders: string[] = [];
    for (const f of componentFiles()) {
      const s = readFileSync(join(COMPONENTS, f), "utf8");
      for (const m of s.matchAll(/color-mix\(in srgb,[^,]+ (\d+)%, transparent\)/g)) {
        const pct = Number(m[1]);
        if (pct < 60 && !LADDER.has(pct)) offenders.push(`${f}: ${m[0]}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("raw color-literal ratchet", () => {
  // { file: [bareHexCount, rgbCallCount] } — exact, not a ceiling.
  const BUDGET: Record<string, [number, number]> = {
    "TuxAlert.vue": [1, 0],
    "TuxAnnouncementBanner.vue": [0, 1],
    "TuxAppFrame.vue": [5, 0], // OS window-chrome simulation (sanctioned)
    "TuxAuthorByline.vue": [2, 0], // ORCID brand green
    "TuxBetaRibbon.vue": [3, 0],
    "TuxCTA.vue": [1, 2],
    "TuxCaptionedMedia.vue": [2, 1], // photo-overlay gradient art
    "TuxCardSlab.vue": [4, 5], // photo-overlay gradient art
    "TuxChartGeoDistricts.vue": [1, 1],
    "TuxChartGeoUsContext.vue": [1, 1],
    "TuxCodeMaroon.vue": [8, 2], // emergency palette — deliberately unthemed
    "TuxCommandPalette.vue": [0, 1],
    "TuxContactCard.vue": [3, 1],
    "TuxFilterPanel.vue": [1, 0],
    "TuxFooter.vue": [2, 12],
    "TuxIconFeature.vue": [1, 0],
    "TuxLinkSlab.vue": [1, 1],
    "TuxMapLegend.vue": [5, 0],
    "TuxMediaSlab.vue": [4, 5], // photo-overlay gradient art
    "TuxMetroInset.vue": [1, 0],
    "TuxNewsCollection.vue": [2, 1], // photo-overlay gradient art
    "TuxPageHeader.vue": [0, 2],
    "TuxPhotoGrid.vue": [2, 1], // photo-overlay gradient art
    "TuxProgram.vue": [0, 3],
    "TuxReportPrintSheet.vue": [4, 0], // @media print block
    "TuxResearcher.vue": [2, 0], // ORCID brand green
    "TuxRichDataGrid.vue": [2, 2],
    "TuxSearch.vue": [3, 2],
    "TuxShortcutsHelp.vue": [0, 1],
    "TuxSignupFeature.vue": [0, 1],
    "TuxSlideover.vue": [0, 1],
    "TuxSparkline.vue": [3, 0],
    "TuxStepper.vue": [1, 0],
    "TuxTeachingPopover.vue": [4, 0],
    "TuxTestimonial.vue": [3, 2], // photo-overlay gradient art
  };

  it("no component exceeds (or silently shrinks) its literal budget", () => {
    const actual: Record<string, [number, number]> = {};
    for (const f of componentFiles()) {
      const s = readFileSync(join(COMPONENTS, f), "utf8");
      // The sanctioned fallback idiom doesn't count.
      const stripped = s.replace(/var\(--[a-z0-9-]+,\s*#[0-9a-fA-F]{3,8}\)/g, "");
      const hexes = (stripped.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g) ?? []).length;
      const rgbs = (stripped.match(/rgba?\(/g) ?? []).length;
      if (hexes + rgbs > 0) actual[f] = [hexes, rgbs];
    }
    expect(actual).toEqual(BUDGET);
  });
});
