/**
 * tuxChartBins — shared binning + quantile math for the
 * distribution-flavored charts (TuxChartHistogram's nice bin edges,
 * TuxChartHeatmap's equal-interval ramp quantization). Lives beside
 * tuxChartScale for the same reason that module exists: two charts
 * carrying private copies of "snap to 1/2/5 × 10^k" math is how the
 * family drifted last time. `tests/tux-chart-bins.test.ts` locks the
 * behavior.
 */

/**
 * Nice histogram bin edges COVERING [lo, hi] — unlike `tuxNiceTicks`,
 * which keeps ticks inside the domain, bin edges must contain every
 * sample, so the first edge is ≤ lo and the last is ≥ hi. Steps land
 * on 1/2/5 × 10^k so bin boundaries read clean ("10–15 min", never
 * "9.37–14.12 min"). Returns [] for non-finite input; a zero-span
 * domain yields one unit-wide bin centered on the value.
 */
export function tuxBinEdges(lo: number, hi: number, targetBins = 12): number[] {
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || targetBins < 1) return [];
  if (hi <= lo) return [lo - 0.5, lo + 0.5];
  const raw = (hi - lo) / targetBins;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const snap = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const step = snap * mag;
  const start = Math.floor(lo / step) * step;
  const edges: number[] = [];
  for (let v = start; v < hi + step * 0.5; v += step) {
    // Kill float drift (0.30000000000000004) so edge labels format clean.
    edges.push(Number(v.toFixed(10)));
  }
  // Guarantee coverage: the loop exits with the last edge ≥ hi except
  // when float drift left it a hair short.
  if (edges[edges.length - 1]! < hi) edges.push(Number((edges[edges.length - 1]! + step).toFixed(10)));
  return edges;
}

/**
 * Count samples into the bins described by `edges` (uniform, from
 * `tuxBinEdges`). Returns `edges.length - 1` counts. Values landing
 * exactly on the last edge count into the last bin (right-closed
 * final bin — the histogram convention); non-finite and out-of-range
 * values are skipped, never thrown.
 */
export function tuxBinCounts(values: Iterable<number>, edges: number[]): number[] {
  const n = edges.length - 1;
  if (n < 1) return [];
  const lo = edges[0]!;
  const hi = edges[n]!;
  const step = (hi - lo) / n;
  const counts = new Array<number>(n).fill(0);
  for (const v of values) {
    if (!Number.isFinite(v) || v < lo || v > hi) continue;
    const idx = Math.min(n - 1, Math.floor((v - lo) / step));
    counts[idx]!++;
  }
  return counts;
}

/**
 * Interpolated quantile (R-7 / Excel-style), `q` in [0, 1]. Sorts a
 * copy — callers with many percentiles over big samples should sort
 * once and call `tuxQuantileSorted`. NaN for an empty/non-finite set.
 */
export function tuxQuantile(values: Iterable<number>, q: number): number {
  const sorted = [...values].filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  return tuxQuantileSorted(sorted, q);
}

/** `tuxQuantile` over an already-sorted, finite-only array. */
export function tuxQuantileSorted(sorted: readonly number[], q: number): number {
  if (sorted.length === 0 || !Number.isFinite(q)) return NaN;
  const h = (sorted.length - 1) * Math.min(1, Math.max(0, q));
  const i = Math.floor(h);
  const frac = h - i;
  const a = sorted[i]!;
  const b = sorted[Math.min(sorted.length - 1, i + 1)]!;
  return a + frac * (b - a);
}

/**
 * Equal-interval ramp bin for a heatmap cell: maps `v` in [lo, hi]
 * onto 0 … bins-1. The max value clamps into the top bin (never an
 * out-of-range index); a degenerate span puts everything in the
 * middle bin — a flat matrix should read mid-intensity, not maxed.
 */
export function tuxQuantizeBin(v: number, lo: number, hi: number, bins: number): number {
  if (bins < 1 || !Number.isFinite(v)) return 0;
  if (hi <= lo) return Math.floor((bins - 1) / 2);
  const t = (v - lo) / (hi - lo);
  return Math.max(0, Math.min(bins - 1, Math.floor(t * bins)));
}
