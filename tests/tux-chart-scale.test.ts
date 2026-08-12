/**
 * Behavior lock for the shared chart scale math + hover composable.
 *
 * These exist because the four chart components previously carried
 * four DIVERGENT copies of this logic (two tick algorithms, a
 * floor/ceil bug in Scatter's, clamp-vs-wrap tone rules, different
 * arrow-key seeds) — extracting the shared module is only safe if the
 * canonical behavior is pinned down here first.
 */
import { describe, expect, it } from "vitest";
import {
  TUX_CHART_MARGINS,
  tuxExtent,
  tuxIndexFromPointer,
  tuxNiceTicks,
  tuxPadDomain,
  tuxSeriesTone,
} from "../app/utils/tuxChartScale";
import { useTuxChartHover } from "../app/composables/useTuxChartHover";

describe("tuxNiceTicks", () => {
  it("keeps every tick inside the domain", () => {
    for (const [lo, hi, n] of [[3, 97, 5], [0, 1, 4], [-50, 120, 6], [0.02, 0.94, 5]] as const) {
      for (const t of tuxNiceTicks(lo, hi, n)) {
        expect(t).toBeGreaterThanOrEqual(lo);
        expect(t).toBeLessThanOrEqual(hi);
      }
    }
  });

  it("lands steps on 1/2/5 × 10^k", () => {
    const ticks = tuxNiceTicks(3, 97, 5);
    expect(ticks).toEqual([20, 40, 60, 80]);
    const small = tuxNiceTicks(0, 1, 4);
    // step 0.2 → mantissa 2
    expect(small).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1]);
  });

  it("is deterministic — the same domain always yields the same ticks (the Line-vs-Bar dashboard bug)", () => {
    expect(tuxNiceTicks(3, 97, 5)).toEqual(tuxNiceTicks(3, 97, 5));
    expect(tuxNiceTicks(0, 831, 5)).toEqual(tuxNiceTicks(0, 831, 5));
  });

  it("emits clean floats (no 0.30000000000000004 labels)", () => {
    for (const t of tuxNiceTicks(0, 1, 4)) {
      expect(String(t).length).toBeLessThanOrEqual(4);
    }
  });

  it("returns [] on degenerate or non-finite domains", () => {
    expect(tuxNiceTicks(5, 5, 4)).toEqual([]);
    expect(tuxNiceTicks(9, 3, 4)).toEqual([]);
    expect(tuxNiceTicks(Number.NaN, 10, 4)).toEqual([]);
    expect(tuxNiceTicks(0, Number.POSITIVE_INFINITY, 4)).toEqual([]);
    expect(tuxNiceTicks(0, 10, 0)).toEqual([]);
  });
});

describe("tuxExtent", () => {
  it("finds min/max and ignores non-finite entries", () => {
    expect(tuxExtent([3, -2, Number.NaN, 7, Number.POSITIVE_INFINITY])).toEqual([-2, 7]);
  });

  it("falls back to [0, 1] when nothing finite remains", () => {
    expect(tuxExtent([])).toEqual([0, 1]);
    expect(tuxExtent([Number.NaN])).toEqual([0, 1]);
  });

  it("survives very large inputs (Math.min(...arr) would blow the stack)", () => {
    const big = new Array(300_000).fill(0).map((_, i) => i % 1000);
    expect(tuxExtent(big)).toEqual([0, 999]);
  });
});

describe("tuxPadDomain", () => {
  it("pads 8% each side by default", () => {
    expect(tuxPadDomain(0, 100)).toEqual([-8, 108]);
  });
  it("widens a zero-span domain to ±1", () => {
    expect(tuxPadDomain(42, 42)).toEqual([41, 43]);
  });
});

describe("tuxSeriesTone", () => {
  it("walks the ramp by index and respects an explicit toneIndex", () => {
    expect(tuxSeriesTone(0)).toBe(1);
    expect(tuxSeriesTone(3)).toBe(4);
    expect(tuxSeriesTone(0, 6)).toBe(6);
  });
  it("clamps to 1..8 — never wraps (9th series must not reuse hue 1)", () => {
    expect(tuxSeriesTone(8)).toBe(8);
    expect(tuxSeriesTone(40)).toBe(8);
    expect(tuxSeriesTone(0, 0)).toBe(1);
    expect(tuxSeriesTone(0, -3)).toBe(1);
  });
});

describe("tuxIndexFromPointer", () => {
  const base = { rectLeft: 0, rectWidth: 600, viewWidth: 600, padLeft: 48, innerWidth: 528 };

  it("point mode snaps to the nearest of n points", () => {
    // 5 points at x = 0/132/264/396/528 inside the plot; pointer at
    // plot-x 200 sits nearest 264 → index 2 (|200−264| < |200−132|).
    expect(tuxIndexFromPointer({ ...base, clientX: 248, count: 5, mode: "point" })).toBe(2);
    expect(tuxIndexFromPointer({ ...base, clientX: 48, count: 5, mode: "point" })).toBe(0);
    expect(tuxIndexFromPointer({ ...base, clientX: 576, count: 5, mode: "point" })).toBe(4);
  });

  it("band mode buckets into equal category bands", () => {
    // 4 bands of 132px; x just past the second boundary
    expect(tuxIndexFromPointer({ ...base, clientX: 48 + 265, count: 4, mode: "band" })).toBe(2);
  });

  it("scales client px into viewBox units when the svg is CSS-resized", () => {
    // rect is half the viewBox width → clientX doubles
    expect(
      tuxIndexFromPointer({ ...base, rectWidth: 300, clientX: (48 + 528) / 2, count: 5, mode: "point" }),
    ).toBe(4);
  });

  it("clamps outside the plot and nulls on empty data", () => {
    expect(tuxIndexFromPointer({ ...base, clientX: -500, count: 5, mode: "point" })).toBe(0);
    expect(tuxIndexFromPointer({ ...base, clientX: 5000, count: 4, mode: "band" })).toBe(3);
    expect(tuxIndexFromPointer({ ...base, clientX: 100, count: 0, mode: "point" })).toBeNull();
  });
});

describe("useTuxChartHover", () => {
  function harness(count = 5, enabled = true) {
    const changes: Array<number | null> = [];
    const hover = useTuxChartHover({
      count: () => count,
      enabled: () => enabled,
      indexFromPointer: (e) => (e as unknown as { fakeIndex: number | null }).fakeIndex,
      onChange: (i) => changes.push(i),
    });
    const key = (k: string) => {
      hover.onKeydown({ key: k, preventDefault: () => {} } as KeyboardEvent);
    };
    return { hover, changes, key };
  }

  it("seeds arrow navigation at the midpoint (canonical — Bar's old 0-seed is gone)", () => {
    const { hover, key } = harness(5);
    key("ArrowRight");
    expect(hover.hoverIndex.value).toBe(3); // floor(5/2)=2 → +1
  });

  it("arrows clamp at both ends; Escape clears; ArrowUp/Down alias Left/Right", () => {
    const { hover, key } = harness(3);
    key("ArrowLeft"); // mid 1 → 0
    key("ArrowLeft");
    expect(hover.hoverIndex.value).toBe(0);
    key("ArrowDown"); // fwd
    expect(hover.hoverIndex.value).toBe(1);
    key("ArrowUp"); // back
    expect(hover.hoverIndex.value).toBe(0);
    key("Escape");
    expect(hover.hoverIndex.value).toBeNull();
  });

  it("reports each distinct change exactly once through onChange", () => {
    const { hover, changes } = harness();
    hover.onPointerMove({ fakeIndex: 2 } as unknown as PointerEvent);
    hover.onPointerMove({ fakeIndex: 2 } as unknown as PointerEvent);
    hover.onPointerMove({ fakeIndex: 4 } as unknown as PointerEvent);
    hover.onPointerLeave();
    expect(changes).toEqual([2, 4, null]);
  });

  it("does nothing when disabled", () => {
    const { hover, changes, key } = harness(5, false);
    key("ArrowRight");
    hover.onPointerMove({ fakeIndex: 1 } as unknown as PointerEvent);
    expect(hover.hoverIndex.value).toBeNull();
    expect(changes).toEqual([]);
  });
});

describe("TUX_CHART_MARGINS", () => {
  it("shares left/bottom so stacked exhibits baseline-align", () => {
    expect(TUX_CHART_MARGINS.left).toBe(48);
    expect(TUX_CHART_MARGINS.bottom).toBe(36);
  });
});
