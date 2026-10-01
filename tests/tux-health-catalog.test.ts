/**
 * tests/tux-health-catalog.test.ts
 *
 * Invariant tests for the TTI-UX 3.0 health catalog and coverage scoring system.
 * Validates:
 * 1. COMPONENTS_WITH_UNIT_TESTS matches actual test files in tests/components/
 * 2. COMPONENTS_PORTED_REACT matches manifest.json react ports
 * 3. Health scoring logic and summary computations
 * 4. Filtering and gap identification
 */

import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  COMPONENTS_WITH_UNIT_TESTS,
  COMPONENTS_PORTED_REACT,
  getTuxHealthCatalog,
  getTuxHealthSummary,
  filterHealthCatalog,
} from "../app/utils/tuxHealthCatalog";
import { tuxCatalog } from "../app/utils/tuxCatalog";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("tuxHealthCatalog Invariants", () => {
  it("COMPONENTS_WITH_UNIT_TESTS is strictly in sync with tests/components/*.nuxt.test.ts", () => {
    const testFiles = readdirSync(join(ROOT, "tests/components"))
      .filter((f) => f.endsWith(".nuxt.test.ts"))
      .map((f) => {
        const base = f.replace(".nuxt.test.ts", "");
        if (base === "tux-cta") return "TuxCTA";
        if (base === "tux-fab") return "TuxFAB";
        if (base === "tux-toc") return "TuxTOC";
        if (base === "tux-qa-collection") return "TuxQACollection";
        if (base === "use-tux-platform") return "useTuxPlatform";
        if (base === "use-tux-ripple") return "useTuxRipple";
        if (base === "use-tux-swipe") return "useTuxSwipe";
        return base.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());
      });

    // Check every file on disk is recorded in COMPONENTS_WITH_UNIT_TESTS
    for (const name of testFiles) {
      expect(
        COMPONENTS_WITH_UNIT_TESTS,
        `Test file for ${name} exists on disk but is missing in COMPONENTS_WITH_UNIT_TESTS`,
      ).toContain(name);
    }

    // Check no ghosts in COMPONENTS_WITH_UNIT_TESTS
    for (const name of COMPONENTS_WITH_UNIT_TESTS) {
      expect(
        testFiles,
        `${name} is in COMPONENTS_WITH_UNIT_TESTS but no corresponding file in tests/components/`,
      ).toContain(name);
    }
  });

  it("COMPONENTS_PORTED_REACT matches kit/ports/manifest.json react ports", () => {
    const manifestPath = join(ROOT, "kit/ports/manifest.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

    const portedInManifest = Object.keys(manifest.components || {}).filter(
      (name) => manifest.components[name]?.ports?.react?.hash !== null,
    );

    expect([...COMPONENTS_PORTED_REACT].sort()).toEqual(portedInManifest.sort());
  });

  it("getTuxHealthCatalog returns records for catalogued, internal, and desk components", () => {
    const catalog = getTuxHealthCatalog();
    expect(catalog.length).toBeGreaterThanOrEqual(tuxCatalog.length);

    for (const item of catalog) {
      expect(item.name).toBeTruthy();
      expect(item.healthScore).toBeGreaterThanOrEqual(0);
      expect(item.healthScore).toBeLessThanOrEqual(100);
      expect(["excellent", "fair", "needs-attention"]).toContain(item.healthTier);
      expect(item.auditNotes).toBeInstanceOf(Array);
    }
  });

  it("verified components with tests and ports score higher than unverified ones", () => {
    const catalog = getTuxHealthCatalog();
    const bigStat = catalog.find((c) => c.name === "TuxBigStat");
    expect(bigStat).toBeDefined();
    // TuxBigStat has React port (+20) + showcase (+30) + metadata (+15) = 65
    expect(bigStat?.healthScore).toBeGreaterThanOrEqual(60);

    const badge = catalog.find((c) => c.name === "TuxBadge");
    expect(badge).toBeDefined();
    // TuxBadge has unit test (+35) + showcase (+30) + metadata (+15) = 80
    expect(badge?.healthScore).toBeGreaterThanOrEqual(80);
    expect(badge?.healthTier).toBe("excellent");
  });

  it("getTuxHealthSummary produces consistent statistics and gap lists", () => {
    const summary = getTuxHealthSummary();
    const catalog = getTuxHealthCatalog();
    expect(summary.totalComponents).toBe(catalog.length);
    expect(summary.showcaseCoverageCount).toBeGreaterThan(0);
    expect(summary.testCoverageCount).toBe(COMPONENTS_WITH_UNIT_TESTS.length);
    expect(summary.reactPortCount).toBe(COMPONENTS_PORTED_REACT.length);
    expect(summary.averageScore).toBeGreaterThan(0);
    expect(summary.byCategory.length).toBeGreaterThan(0);

    const totalTiers =
      summary.tiers.excellent + summary.tiers.fair + summary.tiers.needsAttention;
    expect(totalTiers).toBe(summary.totalComponents);

    // Gaps must be present
    expect(summary.gaps.missingTests.length).toBe(
      summary.totalComponents - COMPONENTS_WITH_UNIT_TESTS.length,
    );
    expect(summary.gaps.lowestScores.length).toBeLessThanOrEqual(15);
  });

  it("filterHealthCatalog correctly filters by query, category, and gaps", () => {
    const catalog = getTuxHealthCatalog();

    // Query filter
    const queryResults = filterHealthCatalog(catalog, { query: "button" });
    expect(queryResults.some((c) => c.name === "TuxButton")).toBe(true);

    // Category filter
    const actions = filterHealthCatalog(catalog, { category: "actions" });
    expect(actions.every((c) => c.category === "actions")).toBe(true);

    // Gaps filter
    const gaps = filterHealthCatalog(catalog, { gapsOnly: true });
    expect(gaps.every((c) => c.healthScore < 80)).toBe(true);

    // Missing tests filter
    const missingTests = filterHealthCatalog(catalog, { missingTestsOnly: true });
    expect(missingTests.every((c) => !c.hasUnitTest)).toBe(true);

    // WCAG 2.2 AAA filter
    const aaaCertified = filterHealthCatalog(catalog, { a11yTier: "AAA" });
    expect(aaaCertified.length).toBe(catalog.length);
  });

  it("verifies WCAG 2.2 AAA compliance metrics across all component records", () => {
    const catalog = getTuxHealthCatalog();
    const summary = getTuxHealthSummary();

    expect(summary.a11yAAAComplianceCount).toBe(catalog.length);
    expect(summary.a11yAAACompliancePercent).toBe(100);

    for (const item of catalog) {
      expect(item.a11y, `Missing a11y record on ${item.name}`).toBeDefined();
      expect(item.a11y.tier).toBe("AAA");
      expect(item.a11y.contrastStandard).toBe("7.0:1 (AAA)");
      expect(item.a11y.minTouchTarget).toBe("44x44px");
      expect(item.a11y.focusAppearance).toBeTruthy();
    }
  });
});

