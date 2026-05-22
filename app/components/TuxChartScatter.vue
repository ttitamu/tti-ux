<script setup lang="ts">
/**
 * TuxChartScatter — native SVG scatter plot for correlation surfaces.
 *
 * X vs Y, one dot per observation. Optional linear-regression
 * trendline + R² readout. Multi-series colored from `--chart-1..8`.
 * Variable point sizes (bubble chart mode) via the `size` field on
 * each point.
 *
 * Follows [`chart-foundations.md`](../../design/chart-foundations.md):
 *   - Palette walks chart tokens.
 *   - Axes have labels (the only chart in the family where
 *     **two axes need names**, since x is no longer ordinal).
 *   - Auto SR summary covers n, x range, y range, correlation
 *     direction when a trendline is shown.
 *
 * Data shape:
 *   series: Array<{
 *     key: string,
 *     label: string,
 *     points: { x: number; y: number; size?: number; label?: string }[],
 *     toneIndex?: number,
 *   }>
 *   xLabel: string  (axis label)
 *   yLabel: string  (axis label)
 *
 * Usage:
 *   <tux-chart-scatter
 *     x-label="Hours of training"
 *     y-label="Errors per shift"
 *     :series="[
 *       { key: 'crew', label: 'Crew', points: [
 *         { x: 4, y: 18 }, { x: 8, y: 12 }, { x: 12, y: 7 }, ...
 *       ]},
 *     ]"
 *     trendline
 *   />
 */
import { computed } from "vue";

interface Point {
  x: number;
  y: number;
  /** Optional point size in CSS px (defaults to 5). Pass to render
   *  a bubble-chart-style variable point size. */
  size?: number;
  /** Optional per-point label (rendered inline next to the dot at
   *  small chart sizes; omitted at large sizes). */
  label?: string;
}

interface Series {
  key: string;
  label: string;
  points: Point[];
  toneIndex?: number;
}

interface Props {
  series: Series[];
  /** X-axis label. */
  xLabel?: string;
  /** Y-axis label. */
  yLabel?: string;
  width?: number;
  height?: number;
  /** Render a linear-regression trendline per series. Default false. */
  trendline?: boolean;
  /** Show legend below. Default true (axes labels carry less identity
   *  than line/area end-labels). */
  legend?: boolean;
  gridlines?: boolean;
  xTicks?: number;
  yTicks?: number;
  /** Number formatter for axes + SR. */
  format?: (n: number) => string;
  decimals?: number;
  ariaSummary?: string;
  units?: string;
  /** Enable the styled tooltip on dot hover. Default true. Replaces
   *  the native SVG <title> on the dot with a branded card. */
  tooltip?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  xLabel: "x",
  yLabel: "y",
  width: 640,
  height: 320,
  trendline: false,
  legend: true,
  gridlines: true,
  xTicks: 6,
  yTicks: 5,
  format: (n: number) => n.toLocaleString(),
  decimals: 2,
  ariaSummary: undefined,
  units: undefined,
  tooltip: true,
});

const emit = defineEmits<{
  hover: [payload: { seriesKey: string; seriesLabel: string; x: number; y: number; label?: string } | null];
}>();

const PAD_TOP = 16;
const PAD_RIGHT = 16;
const PAD_BOTTOM = 48;
const PAD_LEFT = 56;

const innerW = computed(() => props.width - PAD_LEFT - PAD_RIGHT);
const innerH = computed(() => props.height - PAD_TOP - PAD_BOTTOM);

const allPoints = computed(() => props.series.flatMap((s) => s.points));

const extent = computed(() => {
  const xs = allPoints.value.map((p) => p.x);
  const ys = allPoints.value.map((p) => p.y);
  return {
    xMin: Math.min(...xs),
    xMax: Math.max(...xs),
    yMin: Math.min(...ys),
    yMax: Math.max(...ys),
  };
});

function nicePad(min: number, max: number): { min: number; max: number } {
  const range = max - min;
  if (range === 0) return { min: min - 1, max: max + 1 };
  const pad = range * 0.08;
  return { min: min - pad, max: max + pad };
}

const xRange = computed(() => nicePad(extent.value.xMin, extent.value.xMax));
const yRange = computed(() => nicePad(extent.value.yMin, extent.value.yMax));

function niceTicks(min: number, max: number, count: number): number[] {
  const range = max - min;
  const step = Math.pow(10, Math.floor(Math.log10(range / Math.max(1, count))));
  const candidates = [1, 2, 2.5, 5, 10].map((m) => m * step);
  let chosen = step;
  for (const c of candidates) {
    if (range / c <= count + 1) {
      chosen = c;
      break;
    }
  }
  const ticks: number[] = [];
  for (let v = Math.ceil(min / chosen) * chosen; v <= max + chosen / 2; v += chosen) {
    ticks.push(Number(v.toFixed(8)));
  }
  return ticks;
}

const xTickValues = computed(() => niceTicks(xRange.value.min, xRange.value.max, props.xTicks));
const yTickValues = computed(() => niceTicks(yRange.value.min, yRange.value.max, props.yTicks));

function xCoord(x: number): number {
  const { min, max } = xRange.value;
  return PAD_LEFT + ((x - min) / (max - min || 1)) * innerW.value;
}
function yCoord(y: number): number {
  const { min, max } = yRange.value;
  return PAD_TOP + innerH.value - ((y - min) / (max - min || 1)) * innerH.value;
}

function toneClass(s: Series, fallbackIndex: number): string {
  const idx = s.toneIndex ?? fallbackIndex + 1;
  const tone = Math.max(1, Math.min(8, idx));
  return `tux-chart-scatter__series--c${tone}`;
}

// Linear regression per series.
interface Trend {
  m: number;
  b: number;
  r2: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function regress(points: Point[]): Trend | null {
  const n = points.length;
  if (n < 2) return null;
  const meanX = points.reduce((a, p) => a + p.x, 0) / n;
  const meanY = points.reduce((a, p) => a + p.y, 0) / n;
  let num = 0;
  let denX = 0;
  let denY = 0;
  for (const p of points) {
    num += (p.x - meanX) * (p.y - meanY);
    denX += (p.x - meanX) ** 2;
    denY += (p.y - meanY) ** 2;
  }
  if (denX === 0) return null;
  const m = num / denX;
  const b = meanY - m * meanX;
  const r = num / Math.sqrt(denX * denY || 1);
  const r2 = r * r;
  const { min, max } = xRange.value;
  return { m, b, r2, x1: min, y1: m * min + b, x2: max, y2: m * max + b };
}

const trends = computed(() => {
  if (!props.trendline) return [];
  return props.series.map((s, i) => ({ trend: regress(s.points), tone: toneClass(s, i) }));
});

const ariaSummary = computed(() => {
  if (props.ariaSummary) return props.ariaSummary;
  const n = allPoints.value.length;
  const { xMin, xMax, yMin, yMax } = extent.value;
  const u = props.units ? ` ${props.units}` : "";
  let trendNote = "";
  if (props.trendline && trends.value.length > 0) {
    const dir = trends.value
      .map((t) => (t.trend ? (t.trend.m > 0 ? "positive" : t.trend.m < 0 ? "negative" : "flat") : null))
      .filter((x): x is string => !!x);
    if (dir.length > 0) {
      const avgR2 = trends.value.reduce((a, t) => a + (t.trend?.r2 ?? 0), 0) / trends.value.length;
      trendNote = `, ${dir[0]} trend, R² = ${avgR2.toFixed(props.decimals)}`;
    }
  }
  return `Scatter plot: ${n} points across ${props.series.length} series; x from ${xMin.toFixed(props.decimals)} to ${xMax.toFixed(props.decimals)}, y from ${yMin.toFixed(props.decimals)} to ${yMax.toFixed(props.decimals)}${u}${trendNote}.`;
});

// ----- Hover tooltip ----------------------------------------------
interface HoveredPoint {
  seriesIdx: number;
  pointIdx: number;
  series: Series;
  point: Point;
}
const hovered = ref<HoveredPoint | null>(null);

function onDotEnter(seriesIdx: number, pointIdx: number) {
  if (!props.tooltip) return;
  const s = props.series[seriesIdx];
  const p = s?.points[pointIdx];
  if (!s || !p) return;
  hovered.value = { seriesIdx, pointIdx, series: s, point: p };
  emit("hover", {
    seriesKey: s.key,
    seriesLabel: s.label,
    x: p.x,
    y: p.y,
    label: p.label,
  });
}

function onDotLeave() {
  hovered.value = null;
  emit("hover", null);
}

function onDotFocus(seriesIdx: number, pointIdx: number) {
  onDotEnter(seriesIdx, pointIdx);
}

function onDotBlur() {
  onDotLeave();
}

const tooltipPos = computed(() => {
  if (!hovered.value) return null;
  const { point } = hovered.value;
  return {
    leftPercent: (xCoord(point.x) / props.width) * 100,
    topPercent: (yCoord(point.y) / props.height) * 100,
  };
});

function hoverToneClass(seriesIdx: number): string {
  const s = props.series[seriesIdx];
  const idx = s?.toneIndex ?? seriesIdx + 1;
  const tone = Math.max(1, Math.min(8, idx));
  return `tux-chart-scatter__series--c${tone}`;
}
</script>

<template>
  <figure class="tux-chart-scatter" role="figure" :aria-label="ariaSummary">
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      :width="width"
      :height="height"
      preserveAspectRatio="xMidYMid meet"
      class="tux-chart-scatter__svg"
    >
      <!-- Gridlines -->
      <g v-if="gridlines" class="tux-chart-scatter__gridlines">
        <line
          v-for="(t, i) in yTickValues"
          :key="`gl-y-${i}`"
          :x1="PAD_LEFT"
          :x2="PAD_LEFT + innerW"
          :y1="yCoord(t)"
          :y2="yCoord(t)"
        />
        <line
          v-for="(t, i) in xTickValues"
          :key="`gl-x-${i}`"
          :y1="PAD_TOP"
          :y2="PAD_TOP + innerH"
          :x1="xCoord(t)"
          :x2="xCoord(t)"
        />
      </g>

      <!-- Axis ticks -->
      <g class="tux-chart-scatter__axis">
        <text
          v-for="(t, i) in yTickValues"
          :key="`yt-${i}`"
          :x="PAD_LEFT - 8"
          :y="yCoord(t) + 4"
          text-anchor="end"
        >
          {{ format(t) }}
        </text>
        <text
          v-for="(t, i) in xTickValues"
          :key="`xt-${i}`"
          :x="xCoord(t)"
          :y="PAD_TOP + innerH + 18"
          text-anchor="middle"
        >
          {{ format(t) }}
        </text>
      </g>

      <!-- Axis titles -->
      <g class="tux-chart-scatter__axis-titles">
        <text
          :x="PAD_LEFT + innerW / 2"
          :y="PAD_TOP + innerH + 38"
          text-anchor="middle"
        >
          {{ xLabel }}
        </text>
        <text
          :x="-(PAD_TOP + innerH / 2)"
          :y="14"
          transform="rotate(-90)"
          text-anchor="middle"
        >
          {{ yLabel }}
        </text>
      </g>

      <!-- Trendlines (drawn before dots so dots sit on top) -->
      <g v-if="trendline" class="tux-chart-scatter__trends">
        <template v-for="(t, i) in trends" :key="`tr-${i}`">
          <line
            v-if="t.trend"
            :x1="xCoord(t.trend.x1)"
            :y1="yCoord(t.trend.y1)"
            :x2="xCoord(t.trend.x2)"
            :y2="yCoord(t.trend.y2)"
            :class="['tux-chart-scatter__trend', t.tone]"
            stroke-dasharray="4 4"
          />
        </template>
      </g>

      <!-- Dots -->
      <g class="tux-chart-scatter__dots">
        <template v-for="(s, i) in series" :key="`s-${i}`">
          <circle
            v-for="(p, j) in s.points"
            :key="`pt-${i}-${j}`"
            :cx="xCoord(p.x)"
            :cy="yCoord(p.y)"
            :r="hovered && hovered.seriesIdx === i && hovered.pointIdx === j ? (p.size ?? 5) + 2 : (p.size ?? 5)"
            :class="[
              'tux-chart-scatter__dot',
              toneClass(s, i),
              { 'tux-chart-scatter__dot--active': hovered && hovered.seriesIdx === i && hovered.pointIdx === j },
            ]"
            tabindex="0"
            :style="`--tux-chart-stagger-index: ${j};`"
            :aria-label="`${s.label}: ${p.label ? p.label + ', ' : ''}x ${format(p.x)}, y ${format(p.y)}`"
            @pointerenter="onDotEnter(i, j)"
            @pointerleave="onDotLeave"
            @focus="onDotFocus(i, j)"
            @blur="onDotBlur"
          >
            <title>{{ s.label }}{{ p.label ? ' · ' + p.label : '' }}: ({{ format(p.x) }}, {{ format(p.y) }})</title>
          </circle>
        </template>
      </g>
    </svg>

    <!-- Tooltip card anchored to the active dot. -->
    <div
      v-if="tooltip && hovered && tooltipPos"
      class="tux-chart-scatter__tooltip"
      role="status"
      aria-live="polite"
      :style="{
        left: `calc(${tooltipPos.leftPercent}% + 12px)`,
        top: `calc(${tooltipPos.topPercent}% - 6px)`,
      }"
    >
      <p
        :class="['tux-chart-scatter__tooltip-series', hoverToneClass(hovered.seriesIdx)]"
      >
        <span class="tux-chart-scatter__tooltip-swatch" />
        {{ hovered.series.label }}
      </p>
      <p v-if="hovered.point.label" class="tux-chart-scatter__tooltip-pointlabel">
        {{ hovered.point.label }}
      </p>
      <dl class="tux-chart-scatter__tooltip-values">
        <div>
          <dt>{{ xLabel }}</dt>
          <dd>{{ format(hovered.point.x) }}</dd>
        </div>
        <div>
          <dt>{{ yLabel }}</dt>
          <dd>{{ format(hovered.point.y) }}</dd>
        </div>
      </dl>
    </div>

    <ul v-if="legend" class="tux-chart-scatter__legend">
      <li
        v-for="(s, i) in series"
        :key="s.key"
        :class="['tux-chart-scatter__legend-item', toneClass(s, i)]"
      >
        <span class="tux-chart-scatter__legend-swatch" />
        <span>{{ s.label }} <span class="tux-chart-scatter__legend-count">({{ s.points.length }})</span></span>
        <span v-if="trendline && trends[i]?.trend" class="tux-chart-scatter__legend-r2">
          R² = {{ trends[i].trend!.r2.toFixed(decimals) }}
        </span>
      </li>
    </ul>
  </figure>
</template>

<style scoped>
.tux-chart-scatter {
  margin: 0;
  font-family: var(--font-sans);
}

.tux-chart-scatter__svg {
  display: block;
  max-width: 100%;
  height: auto;
}

.tux-chart-scatter__gridlines line {
  stroke: var(--surface-border);
  stroke-width: 1;
  stroke-dasharray: 2 4;
}

.tux-chart-scatter__axis text {
  fill: var(--text-muted);
  font-size: 11px;
}

.tux-chart-scatter__axis-titles text {
  fill: var(--text-secondary);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.tux-chart-scatter__dot {
  fill: var(--chart-1, var(--brand-primary));
  opacity: 0.78;
  transition: opacity 120ms ease-out, r 120ms ease-out;
  cursor: pointer;
  outline: none;
}

.tux-chart-scatter__dot:hover,
.tux-chart-scatter__dot:focus-visible,
.tux-chart-scatter__dot--active {
  opacity: 1;
}

.tux-chart-scatter__dot:focus-visible {
  stroke: var(--brand-primary);
  stroke-width: 2;
}

.tux-chart-scatter__trend {
  stroke: var(--chart-1, var(--brand-primary));
  stroke-width: 1.5;
  opacity: 0.6;
}

/* Palette */
.tux-chart-scatter__dot.tux-chart-scatter__series--c1   { fill: var(--chart-1, var(--brand-primary)); }
.tux-chart-scatter__dot.tux-chart-scatter__series--c2   { fill: var(--chart-2, #3f5a6f); }
.tux-chart-scatter__dot.tux-chart-scatter__series--c3   { fill: var(--chart-3, #c7973c); }
.tux-chart-scatter__dot.tux-chart-scatter__series--c4   { fill: var(--chart-4, #6b8e5a); }
.tux-chart-scatter__dot.tux-chart-scatter__series--c5   { fill: var(--chart-5, #8c5a3c); }
.tux-chart-scatter__dot.tux-chart-scatter__series--c6   { fill: var(--chart-6, #5c7080); }
.tux-chart-scatter__dot.tux-chart-scatter__series--c7   { fill: var(--chart-7, #a33a3a); }
.tux-chart-scatter__dot.tux-chart-scatter__series--c8   { fill: var(--chart-8, #3c5a87); }

.tux-chart-scatter__trend.tux-chart-scatter__series--c1 { stroke: var(--chart-1, var(--brand-primary)); }
.tux-chart-scatter__trend.tux-chart-scatter__series--c2 { stroke: var(--chart-2, #3f5a6f); }
.tux-chart-scatter__trend.tux-chart-scatter__series--c3 { stroke: var(--chart-3, #c7973c); }
.tux-chart-scatter__trend.tux-chart-scatter__series--c4 { stroke: var(--chart-4, #6b8e5a); }
.tux-chart-scatter__trend.tux-chart-scatter__series--c5 { stroke: var(--chart-5, #8c5a3c); }
.tux-chart-scatter__trend.tux-chart-scatter__series--c6 { stroke: var(--chart-6, #5c7080); }
.tux-chart-scatter__trend.tux-chart-scatter__series--c7 { stroke: var(--chart-7, #a33a3a); }
.tux-chart-scatter__trend.tux-chart-scatter__series--c8 { stroke: var(--chart-8, #3c5a87); }

.tux-chart-scatter__legend {
  list-style: none;
  margin: 0.5rem 0 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  font-size: 0.75rem;
}

.tux-chart-scatter__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--text-secondary);
}

.tux-chart-scatter__legend-swatch {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.tux-chart-scatter__legend-item.tux-chart-scatter__series--c1 .tux-chart-scatter__legend-swatch { background: var(--chart-1, var(--brand-primary)); }
.tux-chart-scatter__legend-item.tux-chart-scatter__series--c2 .tux-chart-scatter__legend-swatch { background: var(--chart-2, #3f5a6f); }
.tux-chart-scatter__legend-item.tux-chart-scatter__series--c3 .tux-chart-scatter__legend-swatch { background: var(--chart-3, #c7973c); }
.tux-chart-scatter__legend-item.tux-chart-scatter__series--c4 .tux-chart-scatter__legend-swatch { background: var(--chart-4, #6b8e5a); }
.tux-chart-scatter__legend-item.tux-chart-scatter__series--c5 .tux-chart-scatter__legend-swatch { background: var(--chart-5, #8c5a3c); }
.tux-chart-scatter__legend-item.tux-chart-scatter__series--c6 .tux-chart-scatter__legend-swatch { background: var(--chart-6, #5c7080); }
.tux-chart-scatter__legend-item.tux-chart-scatter__series--c7 .tux-chart-scatter__legend-swatch { background: var(--chart-7, #a33a3a); }
.tux-chart-scatter__legend-item.tux-chart-scatter__series--c8 .tux-chart-scatter__legend-swatch { background: var(--chart-8, #3c5a87); }

.tux-chart-scatter__legend-count {
  color: var(--text-muted);
}

.tux-chart-scatter__legend-r2 {
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  margin-left: 0.25rem;
}

@media (prefers-reduced-motion: reduce) {
  .tux-chart-scatter__dot {
    transition: none;
  }
}

/* ---- Tooltip ---- */
.tux-chart-scatter {
  position: relative;
}

.tux-chart-scatter__tooltip {
  position: absolute;
  z-index: 4;
  min-width: 9rem;
  max-width: 18rem;
  padding: 0.5rem 0.625rem;
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm, 4px);
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.08);
  font-size: 0.75rem;
  pointer-events: none;
}

.tux-chart-scatter__tooltip-series {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.tux-chart-scatter__tooltip-swatch {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.tux-chart-scatter__tooltip-series.tux-chart-scatter__series--c1 .tux-chart-scatter__tooltip-swatch { background: var(--chart-1, var(--brand-primary)); }
.tux-chart-scatter__tooltip-series.tux-chart-scatter__series--c2 .tux-chart-scatter__tooltip-swatch { background: var(--chart-2, #3f5a6f); }
.tux-chart-scatter__tooltip-series.tux-chart-scatter__series--c3 .tux-chart-scatter__tooltip-swatch { background: var(--chart-3, #c7973c); }
.tux-chart-scatter__tooltip-series.tux-chart-scatter__series--c4 .tux-chart-scatter__tooltip-swatch { background: var(--chart-4, #6b8e5a); }
.tux-chart-scatter__tooltip-series.tux-chart-scatter__series--c5 .tux-chart-scatter__tooltip-swatch { background: var(--chart-5, #8c5a3c); }
.tux-chart-scatter__tooltip-series.tux-chart-scatter__series--c6 .tux-chart-scatter__tooltip-swatch { background: var(--chart-6, #5c7080); }
.tux-chart-scatter__tooltip-series.tux-chart-scatter__series--c7 .tux-chart-scatter__tooltip-swatch { background: var(--chart-7, #a33a3a); }
.tux-chart-scatter__tooltip-series.tux-chart-scatter__series--c8 .tux-chart-scatter__tooltip-swatch { background: var(--chart-8, #3c5a87); }

.tux-chart-scatter__tooltip-pointlabel {
  color: var(--text-secondary);
  margin: 0.25rem 0 0.375rem 0;
  font-style: italic;
}

.tux-chart-scatter__tooltip-values {
  margin: 0;
  display: grid;
  grid-template-columns: auto auto;
  gap: 0.125rem 0.75rem;
}

.tux-chart-scatter__tooltip-values > div {
  display: contents;
}

.tux-chart-scatter__tooltip-values dt {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: lowercase;
}

.tux-chart-scatter__tooltip-values dd {
  margin: 0;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: var(--text-primary);
  text-align: right;
}
</style>
