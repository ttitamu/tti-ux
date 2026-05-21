<script setup lang="ts">
/**
 * TuxChartLine — native SVG line chart.
 *
 * First-class native rendering for time-series and ordinal-x line
 * data. No external chart library. Follows
 * [`design/chart-foundations.md`](../../design/chart-foundations.md):
 *
 *   - **Palette:** `--chart-1` … `--chart-8` per series, maroon-led.
 *   - **End-of-line value labels** by default, colored to match the
 *     series stroke — color-blind users get series identity from text
 *     adjacency, not just hue.
 *   - **Previous-period overlay:** pass `series[i].previous` and the
 *     component renders a 60% opacity dashed companion line at the
 *     same hue.
 *   - **Markers** on data points, optional.
 *   - **Confidence band** via `series[i].band: [low, high]` array of
 *     the same length, rendered as a soft fill behind the line.
 *   - **Screen-reader summary:** auto-derived ("Trend: 12 points,
 *     low 18.2, high 24.7, last 23.1, up 4.9 from first") with an
 *     `ariaSummary` override for curated alt-text.
 *   - **Editorial chrome** is *not* baked in — wrap in
 *     `TuxChartFrame` to inherit the eyebrow / title / signature
 *     rule / source citation. Used bare in dashboard tiles.
 *
 * Data shape (line by line):
 *   series: Array<{
 *     key: string,
 *     label: string,
 *     data: number[],          // primary y-values
 *     previous?: number[],     // optional previous-period overlay
 *     band?: [number, number][], // optional [low, high] CI band
 *     toneIndex?: number,      // 1–8; default = position in array
 *   }>
 *   labels: string[]           // x-axis labels; same length as data
 *
 * Mathematical mode is implicit: x is index-based (0..N-1) by
 * default. For time-series rendered with uneven spacing, the host
 * pre-interpolates and passes the resulting fixed-spacing array —
 * keeps the component simple. (Future: a `xValues` prop for
 * continuous numeric x.)
 *
 * Usage:
 *   <tux-chart-line
 *     :labels="months"
 *     :series="[
 *       { key: 'total',  label: 'Total',  data: [12, 18, 24, 31, 28, 35] },
 *       { key: 'errors', label: 'Errors', data: [2, 3, 4, 5, 5, 6] },
 *     ]"
 *     :width="640"
 *     :height="280"
 *   />
 */

interface Series {
  key: string;
  label: string;
  data: number[];
  /** Previous-period overlay; same length as `data`. Rendered as
   *  60% opacity dashed companion in the same hue. */
  previous?: number[];
  /** Confidence band — array of [low, high] tuples; same length as
   *  `data`. Rendered as soft fill behind the line. */
  band?: Array<[number, number]>;
  /** Override the auto-assigned palette index (1..8). Default is
   *  position in the `series` array. */
  toneIndex?: number;
}

interface Props {
  /** x-axis labels. Length determines the number of data points. */
  labels: string[];
  /** One or more series. Length determines the number of lines. */
  series: Series[];
  /** Render width in CSS px. */
  width?: number;
  /** Render height in CSS px. */
  height?: number;
  /** Show data-point markers on each line. */
  markers?: boolean;
  /** Show end-of-line value labels colored to match the series. */
  endLabels?: boolean;
  /** Show the legend below the chart. Off by default — end-of-line
   *  labels usually suffice. Turn on when end-labels collide. */
  legend?: boolean;
  /** Show horizontal gridlines at axis ticks. */
  gridlines?: boolean;
  /** y-axis tick count (approximate). Default 5. */
  yTicks?: number;
  /** y-axis formatter — e.g. (n) => `${n}%` or n.toLocaleString(). */
  yFormat?: (n: number) => string;
  /** Decimals for the auto-derived screen-reader summary. */
  decimals?: number;
  /** Override the auto-derived SR summary. */
  ariaSummary?: string;
  /** Optional units label appended to the SR summary ("requests/min"). */
  units?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: 640,
  height: 280,
  markers: false,
  endLabels: true,
  legend: false,
  gridlines: true,
  yTicks: 5,
  yFormat: (n: number) => String(n),
  decimals: 1,
  ariaSummary: undefined,
  units: undefined,
});

// Layout — 36px left for y-axis labels, 56px right for end-of-line
// labels, 24px top for breathing room, 36px bottom for x-axis labels.
const padTop = 24;
const padBottom = 36;
const padLeft = 44;
const padRight = computed(() => (props.endLabels ? 64 : 16));

const plotW = computed(() => Math.max(0, props.width - padLeft - padRight.value));
const plotH = computed(() => Math.max(0, props.height - padTop - padBottom));

// y-axis domain — compute min/max across all series + bands + previous.
const yDomain = computed(() => {
  let lo = Infinity;
  let hi = -Infinity;
  for (const s of props.series) {
    for (const v of s.data) { if (v < lo) lo = v; if (v > hi) hi = v; }
    if (s.previous) for (const v of s.previous) { if (v < lo) lo = v; if (v > hi) hi = v; }
    if (s.band) for (const [l, h] of s.band) { if (l < lo) lo = l; if (h > hi) hi = h; }
  }
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [0, 1];
  if (lo === hi) { lo -= 1; hi += 1; }
  // Add 8% headroom + footroom so lines don't kiss the chart edges.
  const span = hi - lo;
  return [lo - span * 0.08, hi + span * 0.08] as [number, number];
});

// Pretty y-axis ticks — round to nice numbers.
function niceTicks(lo: number, hi: number, count: number) {
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
  for (let v = t0; v <= t1 + m * 0.5; v += m) out.push(v);
  return out.filter((v) => v >= lo && v <= hi);
}

const yTicksValues = computed(() => {
  const [lo, hi] = yDomain.value;
  return niceTicks(lo, hi, props.yTicks);
});

// Coordinate transforms.
function xAt(i: number, n: number) {
  if (n <= 1) return padLeft + plotW.value / 2;
  return padLeft + (i / (n - 1)) * plotW.value;
}
function yAt(v: number) {
  const [lo, hi] = yDomain.value;
  const t = (v - lo) / (hi - lo);
  return padTop + (1 - t) * plotH.value;
}

// Build path strings.
function linePath(data: number[]) {
  return data
    .map((v, i) => `${i === 0 ? "M" : "L"}${xAt(i, data.length).toFixed(2)},${yAt(v).toFixed(2)}`)
    .join(" ");
}

function bandPath(band: Array<[number, number]>) {
  const top = band.map((p, i) => `${i === 0 ? "M" : "L"}${xAt(i, band.length).toFixed(2)},${yAt(p[1]).toFixed(2)}`).join(" ");
  const bottom = band
    .slice()
    .reverse()
    .map((p, i) => `L${xAt(band.length - 1 - i, band.length).toFixed(2)},${yAt(p[0]).toFixed(2)}`)
    .join(" ");
  return `${top} ${bottom} Z`;
}

function toneVar(idx: number) {
  const n = ((idx - 1) % 8) + 1; // 1..8
  return `var(--chart-${n})`;
}

// Auto-derive an SR summary covering all series.
const autoSummary = computed(() => {
  const parts: string[] = [];
  for (const s of props.series) {
    if (!s.data.length) continue;
    const lo = Math.min(...s.data);
    const hi = Math.max(...s.data);
    const first = s.data[0];
    const last = s.data[s.data.length - 1];
    const delta = (last as number) - (first as number);
    const dir = delta === 0 ? "unchanged" : delta > 0 ? "up" : "down";
    const d = props.decimals;
    parts.push(
      `${s.label}: ${s.data.length} points, low ${lo.toFixed(d)}, high ${hi.toFixed(d)}, last ${(last as number).toFixed(d)} (${dir} ${Math.abs(delta).toFixed(d)} from first)${props.units ? " " + props.units : ""}.`
    );
  }
  return parts.join(" ");
});

const summary = computed(() => props.ariaSummary ?? autoSummary.value);
</script>

<template>
  <figure
    class="tux-chart-line"
    role="img"
    :aria-label="summary"
  >
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      :width="width"
      :height="height"
      preserveAspectRatio="xMidYMid meet"
      class="tux-chart-line__svg"
    >
      <title>{{ summary }}</title>

      <!-- Gridlines -->
      <g v-if="gridlines" class="tux-chart-line__gridlines">
        <line
          v-for="t in yTicksValues"
          :key="`grid-${t}`"
          :x1="padLeft"
          :y1="yAt(t)"
          :x2="padLeft + plotW"
          :y2="yAt(t)"
        />
      </g>

      <!-- y-axis tick labels -->
      <g class="tux-chart-line__y-labels">
        <text
          v-for="t in yTicksValues"
          :key="`y-${t}`"
          :x="padLeft - 8"
          :y="yAt(t)"
          text-anchor="end"
          dominant-baseline="middle"
        >{{ yFormat(t) }}</text>
      </g>

      <!-- x-axis tick labels (label every N to avoid crowding for
           long series; ~6 ticks max) -->
      <g class="tux-chart-line__x-labels">
        <template
          v-for="(lab, i) in labels"
          :key="`x-${i}`"
        >
          <text
            v-if="labels.length <= 8 || i % Math.ceil(labels.length / 6) === 0 || i === labels.length - 1"
            :x="xAt(i, labels.length)"
            :y="height - padBottom + 18"
            text-anchor="middle"
          >{{ lab }}</text>
        </template>
      </g>

      <!-- Confidence bands (drawn behind lines) -->
      <g class="tux-chart-line__bands">
        <path
          v-for="(s, i) in series.filter(x => x.band)"
          :key="`band-${s.key}`"
          :d="bandPath(s.band!)"
          :style="{ fill: toneVar(s.toneIndex ?? i + 1) }"
          class="tux-chart-line__band"
        />
      </g>

      <!-- Previous-period overlays (drawn behind primary lines) -->
      <g class="tux-chart-line__previous-overlays">
        <path
          v-for="(s, i) in series.filter(x => x.previous)"
          :key="`prev-${s.key}`"
          :d="linePath(s.previous!)"
          :style="{ stroke: toneVar(s.toneIndex ?? i + 1) }"
          class="tux-chart-line__previous"
          fill="none"
          stroke-dasharray="4 4"
        />
      </g>

      <!-- Primary lines -->
      <g class="tux-chart-line__lines">
        <path
          v-for="(s, i) in series"
          :key="`line-${s.key}`"
          :d="linePath(s.data)"
          :style="{ stroke: toneVar(s.toneIndex ?? i + 1) }"
          class="tux-chart-line__line"
          fill="none"
          stroke-width="2"
        />
      </g>

      <!-- Markers -->
      <g v-if="markers" class="tux-chart-line__markers">
        <template
          v-for="(s, i) in series"
          :key="`mk-${s.key}`"
        >
          <circle
            v-for="(v, j) in s.data"
            :key="`mk-${s.key}-${j}`"
            :cx="xAt(j, s.data.length)"
            :cy="yAt(v)"
            r="3"
            :style="{ fill: toneVar(s.toneIndex ?? i + 1) }"
          />
        </template>
      </g>

      <!-- End-of-line value labels -->
      <g v-if="endLabels" class="tux-chart-line__end-labels">
        <text
          v-for="(s, i) in series"
          :key="`end-${s.key}`"
          :x="xAt(s.data.length - 1, s.data.length) + 8"
          :y="yAt(s.data[s.data.length - 1] as number)"
          dominant-baseline="middle"
          :style="{ fill: toneVar(s.toneIndex ?? i + 1) }"
          class="tux-chart-line__end-label"
        >{{ yFormat(s.data[s.data.length - 1] as number) }}</text>
      </g>
    </svg>

    <!-- Legend (off by default) -->
    <ul v-if="legend" class="tux-chart-line__legend">
      <li
        v-for="(s, i) in series"
        :key="`leg-${s.key}`"
      >
        <span
          class="tux-chart-line__legend-swatch"
          :style="{ background: toneVar(s.toneIndex ?? i + 1) }"
          aria-hidden="true"
        />
        {{ s.label }}
      </li>
    </ul>
  </figure>
</template>

<style scoped>
.tux-chart-line {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
}
.tux-chart-line__svg {
  max-width: 100%;
  height: auto;
}
.tux-chart-line__gridlines line {
  stroke: var(--surface-border);
  stroke-width: 1;
  opacity: 0.5;
}
.tux-chart-line__y-labels text,
.tux-chart-line__x-labels text {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-variant-numeric: tabular-nums;
  fill: var(--text-muted);
}
.tux-chart-line__band {
  opacity: 0.12;
}
.tux-chart-line__previous {
  opacity: 0.55;
  stroke-width: 1.5;
}
.tux-chart-line__end-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.tux-chart-line__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}
.tux-chart-line__legend li {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}
.tux-chart-line__legend-swatch {
  display: inline-block;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 2px;
}
</style>
