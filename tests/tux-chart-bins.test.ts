/**
 * Behavior locks for tuxChartBins — the shared binning + quantile
 * math under TuxChartHistogram and TuxChartHeatmap. Same doctrine as
 * tests/tux-chart-scale.test.ts: these two charts must never drift
 * apart on "snap to 1/2/5 × 10^k" or bin-index math the way the
 * cartesian family once did on niceTicks.
 */
import { describe, expect, it } from "vitest";
import {
  tuxBinCounts,
  tuxBinEdges,
  tuxQuantile,
  tuxQuantileSorted,
  tuxQuantizeBin,
} from "../app/utils/tuxChartBins";

describe("tuxBinEdges", () => {
  it("covers the domain: first edge ≤ lo, last edge ≥ hi", () => {
    const edges = tuxBinEdges(8.3, 51.7, 12);
    expect(edges[0]!).toBeLessThanOrEqual(8.3);
    expect(edges[edges.length - 1]!).toBeGreaterThanOrEqual(51.7);
  });

  it("snaps steps to 1/2/5 × 10^k so edges read clean", () => {
    const edges = tuxBinEdges(8.3, 51.7, 12);
    const step = edges[1]! - edges[0]!;
    expect(step).toBe(5);
    // Every edge lands on a step multiple — no 9.37s.
    for (const e of edges) expect(Math.abs(e / step - Math.round(e / step))).toBeLessThan(1e-9);
  });

  it("lands near the target bin count", () => {
    const edges = tuxBinEdges(0, 100, 12);
    expect(edges.length - 1).toBeGreaterThanOrEqual(8);
    expect(edges.length - 1).toBeLessThanOrEqual(16);
  });

  it("kills float drift in edge values", () => {
    const edges = tuxBinEdges(0, 1, 10);
    expect(edges).toContain(0.3); // not 0.30000000000000004
  });

  it("degenerate span yields one unit-wide bin centered on the value", () => {
    expect(tuxBinEdges(4, 4, 10)).toEqual([3.5, 4.5]);
  });

  it("returns [] for non-finite input", () => {
    expect(tuxBinEdges(Number.NaN, 10, 10)).toEqual([]);
    expect(tuxBinEdges(0, Number.POSITIVE_INFINITY, 10)).toEqual([]);
  });
});

describe("tuxBinCounts", () => {
  const edges = [0, 10, 20, 30];

  it("counts values into left-closed bins", () => {
    expect(tuxBinCounts([1, 5, 9, 10, 15, 25], edges)).toEqual([3, 2, 1]);
  });

  it("the last bin is right-closed: max value is counted, not dropped", () => {
    expect(tuxBinCounts([30], edges)).toEqual([0, 0, 1]);
  });

  it("skips non-finite and out-of-range values instead of throwing", () => {
    expect(tuxBinCounts([Number.NaN, -5, 35, 15], edges)).toEqual([0, 1, 0]);
  });

  it("returns [] for degenerate edge arrays", () => {
    expect(tuxBinCounts([1, 2], [5])).toEqual([]);
  });
});

describe("tuxQuantile", () => {
  it("interpolates between order statistics (R-7)", () => {
    // Sorted: [10, 20, 30, 40]; q=0.5 → h=1.5 → 25.
    expect(tuxQuantile([40, 10, 30, 20], 0.5)).toBe(25);
  });

  it("q=0 and q=1 return min and max", () => {
    expect(tuxQuantile([3, 1, 2], 0)).toBe(1);
    expect(tuxQuantile([3, 1, 2], 1)).toBe(3);
  });

  it("ignores non-finite samples", () => {
    expect(tuxQuantile([Number.NaN, 5, Number.POSITIVE_INFINITY, 15], 0.5)).toBe(10);
  });

  it("NaN for an empty set", () => {
    expect(tuxQuantile([], 0.5)).toBeNaN();
  });

  it("sorted variant matches the sorting variant", () => {
    const samples = [8, 3, 12, 7, 5, 20, 11];
    const sorted = [...samples].sort((a, b) => a - b);
    for (const q of [0.1, 0.5, 0.95]) {
      expect(tuxQuantileSorted(sorted, q)).toBe(tuxQuantile(samples, q));
    }
  });
});

describe("tuxQuantizeBin", () => {
  it("maps the domain onto 0 … bins-1 in equal intervals", () => {
    expect(tuxQuantizeBin(0, 0, 100, 5)).toBe(0);
    expect(tuxQuantizeBin(19.9, 0, 100, 5)).toBe(0);
    expect(tuxQuantizeBin(20, 0, 100, 5)).toBe(1);
    expect(tuxQuantizeBin(99, 0, 100, 5)).toBe(4);
  });

  it("the max value clamps into the top bin, never out of range", () => {
    expect(tuxQuantizeBin(100, 0, 100, 5)).toBe(4);
  });

  it("a flat matrix reads mid-intensity, not maxed", () => {
    expect(tuxQuantizeBin(7, 7, 7, 5)).toBe(2);
    expect(tuxQuantizeBin(7, 7, 7, 4)).toBe(1);
  });
});
