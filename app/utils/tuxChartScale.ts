/**
 * tuxChartScale — shared scale math for the native chart family
 * (TuxChartLine / Bar / Area / Scatter, plus future charts).
 *
 * Before this module each chart carried its own copy of this logic and
 * they had drifted: four different `niceTicks` (two algorithms, one
 * floor/ceil bug), two series-tone rules (clamp vs modulo-wrap), and
 * four margin conventions — so a line and a bar chart over the same
 * domain could render different axes and misaligned baselines on one
 * dashboard. These are the canonical versions; `tests/tux-chart-scale.
 * test.ts` locks the behavior.
 */

/** Standard plot margins. Charts share left/bottom so stacked exhibits
 *  baseline-align; a chart may widen `right`/`top` for its own chrome
 *  (e.g. TuxChartLine's end-of-line labels). */
export interface TuxChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const TUX_CHART_MARGINS: Readonly<TuxChartMargins> = {
  top: 16,
  right: 24,
  bottom: 36,
  left: 48,
};

/**
 * Nice axis ticks — the canonical algorithm for every chart.
 * (Error-ratio step selection; steps land on 1/2/5 × 10^k.)
 *
 * Ticks are kept INSIDE [lo, hi]: callers pad their domain first (see
 * `tuxPadDomain`) when they want breathing room above the data. Returns
 * [] for empty/degenerate/non-finite spans — callers render no
 * gridlines rather than lying.
 */
export function tuxNiceTicks(lo: number, hi: number, count: number): number[] {
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi <= lo || count < 1) return [];
  const span = hi - lo;
  const step = Math.pow(10, Math.floor(Math.log10(span / count)));
  const err = (count * step) / span;
  let m = step;
  if (err <= 0.15) m = step * 10;
  else if (err <= 0.35) m = step * 5;
  else if (err <= 0.75) m = step * 2;
  const t0 = Math.floor(lo / m) * m;
  const t1 = Math.ceil(hi / m) * m;
  const out: number[] = [];
  for (let v = t0; v <= t1 + m * 0.5; v += m) {
    // Kill float drift (0.30000000000000004) so labels format clean.
    out.push(Number(v.toFixed(10)));
  }
  return out.filter((v) => v >= lo && v <= hi);
}

/** Min/max across values, ignoring non-finite entries. Falls back to
 *  [0, 1] when nothing finite remains — a renderable, honest default.
 *  Loop-based on purpose: `Math.min(...arr)` overflows the stack on
 *  ~100k+ points. */
export function tuxExtent(values: Iterable<number>): [number, number] {
  let lo = Infinity;
  let hi = -Infinity;
  for (const v of values) {
    if (!Number.isFinite(v)) continue;
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [0, 1];
  return [lo, hi];
}

/** Pad a domain by `ratio` headroom + footroom so marks don't kiss the
 *  plot edges; a zero-span domain widens to ±1. */
export function tuxPadDomain(lo: number, hi: number, ratio = 0.08): [number, number] {
  if (lo === hi) return [lo - 1, hi + 1];
  const span = hi - lo;
  return [lo - span * ratio, hi + span * ratio];
}

/**
 * Series tone index on the 8-hue chart ramp — CLAMPED, not wrapped.
 * chart-foundations.md caps charts at 8 series ("9+ belongs in a table
 * or small multiples"); wrapping would silently reuse hue 1 for series
 * 9 and read as a data relationship that isn't there.
 */
export function tuxSeriesTone(fallbackIndex: number, toneIndex?: number): number {
  const idx = toneIndex ?? fallbackIndex + 1;
  return Math.max(1, Math.min(8, idx));
}

/** Pointer-x → data index, DOM-free (callers pass the numbers from
 *  `svg.getBoundingClientRect()` so this stays unit-testable).
 *  `mode: "point"` maps to the nearest of n points spread across the
 *  inner width (line/area); `mode: "band"` maps into n equal category
 *  bands (bar). Returns null when there's nothing to hit. */
export function tuxIndexFromPointer(opts: {
  clientX: number;
  rectLeft: number;
  rectWidth: number;
  /** SVG viewBox width — pointer coords scale by viewWidth/rectWidth. */
  viewWidth: number;
  padLeft: number;
  innerWidth: number;
  count: number;
  mode: "point" | "band";
}): number | null {
  const { clientX, rectLeft, rectWidth, viewWidth, padLeft, innerWidth, count, mode } = opts;
  if (count <= 0 || rectWidth <= 0 || innerWidth <= 0) return null;
  const x = (clientX - rectLeft) * (viewWidth / rectWidth) - padLeft;
  if (mode === "band") {
    const band = innerWidth / count;
    return Math.max(0, Math.min(count - 1, Math.floor(x / band)));
  }
  if (count === 1) return 0;
  const t = x / innerWidth;
  return Math.max(0, Math.min(count - 1, Math.round(t * (count - 1))));
}
