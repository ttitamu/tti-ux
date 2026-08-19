<script setup lang="ts">
/**
 * TuxChartHistogram — native SVG distribution chart over raw samples.
 *
 * Built for the travel-time-reliability shape TTI reports live on:
 * hand it the raw observations (segment travel times, headways, delay
 * minutes) and it bins, counts, and draws — no pre-aggregation. No
 * external library. Follows
 * [`design/chart-foundations.md`](../../design/chart-foundations.md):
 *
 *   - **Nice bins:** edges snap to 1/2/5 × 10^k (`tuxBinEdges`), so
 *     axis labels read "10–15 min", never "9.37–14.12 min". Bars are
 *     contiguous — the histogram convention — separated by a hairline
 *     of page surface, not gaps.
 *   - **Percentile markers:** `:percentiles="[50, 95]"` drops dashed
 *     gold rules with `p50` / `p95` flags — the planning-time-index
 *     pair every reliability exhibit prints. Interpolated quantiles
 *     (`tuxQuantile`).
 *   - **Interactivity contract** (components.md "Chart tooltips"):
 *     one tab stop, Arrow-key roving cursor over bins, Escape clears,
 *     branded tooltip (bin range · count · share), auto-flip past
 *     60% width, `hover` emit, `:tooltip="false"` for print.
 *   - **Screen-reader summary** auto-derived ("Histogram: 240
 *     samples in 14 bins from 8 to 52, median 21.4, 95th percentile
 *     38.9."). Override via `ariaSummary`.
 *
 * Usage:
 *   <tux-chart-histogram
 *     :values="travelTimes"
 *     :percentiles="[50, 95]"
 *     x-label="Travel time (min)"
 *     units="trips"
 *   />
 */
import { computed } from "vue";

interface Props {
  /** Raw sample values — the component bins them. */
  values: number[];
  /** Render width in CSS px. */
  width?: number;
  /** Render height in CSS px. */
  height?: number;
  /** Target bin count; actual count lands nearby on nice edges.
   *  Default 12. */
  binCount?: number;
  /** Percentiles (0–100) to mark with dashed gold rules, e.g.
   *  `[50, 95]`. Default none. */
  percentiles?: number[];
  /** Show share-of-samples (%) on the y axis instead of counts. */
  normalize?: boolean;
  /** Show horizontal gridlines at y ticks. Default true. */
  gridlines?: boolean;
  /** y-axis tick count. Default 5. */
  ticks?: number;
  /** x-axis title under the chart ("Travel time (min)"). */
  xLabel?: string;
  /** Formatter for sample values (bin edges, percentile flags). */
  format?: (n: number) => string;
  /** Decimals for the SR summary + percentile flags. */
  decimals?: number;
  /** Override the auto-derived SR summary. */
  ariaSummary?: string;
  /** What one sample is, for tooltip + SR summary ("trips"). */
  units?: string;
  /** Enable the hover tooltip + keyboard cursor. Default true. */
  tooltip?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: 640,
  height: 280,
  binCount: 12,
  percentiles: () => [],
  normalize: false,
  gridlines: true,
  ticks: 5,
  xLabel: undefined,
  format: (n: number) => n.toLocaleString(),
  decimals: 1,
  ariaSummary: undefined,
  units: undefined,
  tooltip: true,
});

const emit = defineEmits<{
  hover: [payload: { index: number; from: number; to: number; count: number; share: number } | null];
}>();

// Layout — family-standard margins (tuxChartScale).
const PAD_TOP = TUX_CHART_MARGINS.top;
const PAD_RIGHT = TUX_CHART_MARGINS.right;
const PAD_BOTTOM = TUX_CHART_MARGINS.bottom;
const PAD_LEFT = TUX_CHART_MARGINS.left;

const innerW = computed(() => props.width - PAD_LEFT - PAD_RIGHT);
const innerH = computed(() => props.height - PAD_TOP - PAD_BOTTOM);

// 2dp rounding at the geometry boundary — house hydration discipline.
const r2 = (n: number) => Number(n.toFixed(2));

const finiteSorted = computed(() =>
  props.values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b),
);

const edges = computed(() => {
  const s = finiteSorted.value;
  if (s.length === 0) return [];
  return tuxBinEdges(s[0]!, s[s.length - 1]!, props.binCount);
});

const counts = computed(() => tuxBinCounts(finiteSorted.value, edges.value));
const binCountActual = computed(() => counts.value.length);
const sampleCount = computed(() => finiteSorted.value.length);

/** Bar heights in y-units: counts, or % share when normalized. */
const barValues = computed(() => {
  if (!props.normalize) return counts.value;
  const n = Math.max(1, sampleCount.value);
  return counts.value.map((c) => (c / n) * 100);
});

const yMax = computed(() => Math.max(1, tuxExtent(barValues.value)[1]));
const yTickValues = computed(() => tuxNiceTicks(0, yMax.value, props.ticks));

function yScale(v: number): number {
  return (v / yMax.value) * innerH.value;
}

/** Sample-value → x px inside the plot (edges are uniform). */
function xScale(v: number): number {
  const e = edges.value;
  if (e.length < 2) return 0;
  const lo = e[0]!;
  const hi = e[e.length - 1]!;
  return ((v - lo) / (hi - lo)) * innerW.value;
}

function barRect(i: number): { x: number; y: number; w: number; h: number } {
  const e = edges.value;
  const x0 = xScale(e[i]!);
  const x1 = xScale(e[i + 1]!);
  const h = yScale(barValues.value[i]!);
  return {
    x: r2(PAD_LEFT + x0),
    y: r2(PAD_TOP + innerH.value - h),
    w: r2(Math.max(0, x1 - x0)),
    h: r2(h),
  };
}

// Edge labels: auto-thin so a 16-bin axis doesn't shingle.
const edgeEvery = computed(() => Math.max(1, Math.ceil((edges.value.length - 1) / 10)));

// Percentile markers — interpolated over the sorted sample.
const percentileMarks = computed(() =>
  props.percentiles
    .filter((p) => Number.isFinite(p) && p >= 0 && p <= 100 && sampleCount.value > 0)
    .map((p) => {
      const value = tuxQuantileSorted(finiteSorted.value, p / 100);
      return { p, value, x: r2(PAD_LEFT + xScale(value)) };
    }),
);

const yAxisTitle = computed(() => (props.normalize ? "% of samples" : "Count"));

// Auto SR summary — median + p95 give a non-visual reader the
// reliability headline whether or not markers are drawn.
const ariaSummary = computed(() => {
  if (props.ariaSummary) return props.ariaSummary;
  const s = finiteSorted.value;
  if (s.length === 0) return "Histogram: no samples.";
  const unitsTrail = props.units ? ` ${props.units}` : " samples";
  const median = tuxQuantileSorted(s, 0.5);
  const p95 = tuxQuantileSorted(s, 0.95);
  return `Histogram: ${s.length}${unitsTrail} in ${binCountActual.value} bins from ${s[0]!.toFixed(props.decimals)} to ${s[s.length - 1]!.toFixed(props.decimals)}, median ${median.toFixed(props.decimals)}, 95th percentile ${p95.toFixed(props.decimals)}.`;
});

// ----- Hover tooltip (shared roving-cursor model) ------------------
const { hoverIndex, onPointerMove, onPointerLeave, onKeydown } = useTuxChartHover({
  count: () => binCountActual.value,
  enabled: () => props.tooltip,
  indexFromPointer(e) {
    const svg = e.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    return tuxIndexFromPointer({
      clientX: e.clientX,
      rectLeft: rect.left,
      rectWidth: rect.width,
      viewWidth: props.width,
      padLeft: PAD_LEFT,
      innerWidth: innerW.value,
      count: binCountActual.value,
      mode: "band",
    });
  },
  onChange(idx) {
    if (idx === null) {
      emit("hover", null);
      return;
    }
    emit("hover", {
      index: idx,
      from: edges.value[idx]!,
      to: edges.value[idx + 1]!,
      count: counts.value[idx]!,
      share: sampleCount.value ? (counts.value[idx]! / sampleCount.value) * 100 : 0,
    });
  },
});

const tooltipPayload = computed(() => {
  const i = hoverIndex.value;
  if (i === null || !edges.value[i + 1]) return null;
  return {
    range: `${props.format(edges.value[i]!)}–${props.format(edges.value[i + 1]!)}`,
    count: counts.value[i]!,
    share: sampleCount.value ? (counts.value[i]! / sampleCount.value) * 100 : 0,
  };
});

const tooltipAnchorPercent = computed(() => {
  const i = hoverIndex.value;
  if (i === null) return 0;
  const rect = barRect(i);
  return ((rect.x + rect.w / 2) / props.width) * 100;
});
</script>

<template>
  <figure class="tux-chart-histogram" role="figure" :aria-label="ariaSummary">
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      :width="width"
      :height="height"
      preserveAspectRatio="xMidYMid meet"
      class="tux-chart-histogram__svg"
    >
      <!-- Gridlines -->
      <g v-if="gridlines" class="tux-chart-histogram__gridlines">
        <line
          v-for="(t, i) in yTickValues"
          :key="`gl-${i}`"
          :x1="PAD_LEFT"
          :x2="PAD_LEFT + innerW"
          :y1="r2(PAD_TOP + innerH - yScale(t))"
          :y2="r2(PAD_TOP + innerH - yScale(t))"
        />
      </g>

      <!-- y-axis ticks + title -->
      <g class="tux-chart-histogram__axis">
        <text
          v-for="(t, i) in yTickValues"
          :key="`yt-${i}`"
          :x="PAD_LEFT - 8"
          :y="r2(PAD_TOP + innerH - yScale(t) + 4)"
          text-anchor="end"
        >
          {{ normalize ? `${t}%` : t.toLocaleString() }}
        </text>
        <text
          class="tux-chart-histogram__axis-title"
          :x="PAD_LEFT"
          :y="PAD_TOP - 4"
          text-anchor="start"
        >
          {{ yAxisTitle }}
        </text>
      </g>

      <!-- Bin-edge labels (auto-thinned) + x-axis title -->
      <g class="tux-chart-histogram__axis">
        <template v-for="(e, i) in edges" :key="`xe-${i}`">
          <text
            v-if="i % edgeEvery === 0"
            :x="r2(PAD_LEFT + xScale(e))"
            :y="PAD_TOP + innerH + 16"
            text-anchor="middle"
          >
            {{ format(e) }}
          </text>
        </template>
        <text
          v-if="xLabel"
          class="tux-chart-histogram__axis-title"
          :x="r2(PAD_LEFT + innerW / 2)"
          :y="PAD_TOP + innerH + 32"
          text-anchor="middle"
        >
          {{ xLabel }}
        </text>
      </g>

      <!-- Bars — contiguous, hairline-separated -->
      <g class="tux-chart-histogram__bars">
        <rect
          v-for="(c, i) in counts"
          :key="`b-${i}`"
          :x="barRect(i).x"
          :y="barRect(i).y"
          :width="barRect(i).w"
          :height="barRect(i).h"
          class="tux-chart-histogram__bar"
          :class="{ 'tux-chart-histogram__bar--active': hoverIndex === i }"
          :style="`--tux-chart-stagger-index: ${i};`"
        >
          <title>{{ format(edges[i]!) }}–{{ format(edges[i + 1]!) }}: {{ c }}</title>
        </rect>
      </g>

      <!-- Percentile markers -->
      <g class="tux-chart-histogram__percentiles">
        <template v-for="mark in percentileMarks" :key="`p-${mark.p}`">
          <line
            :x1="mark.x"
            :x2="mark.x"
            :y1="PAD_TOP"
            :y2="PAD_TOP + innerH"
            class="tux-chart-histogram__percentile-line"
          />
          <text
            :x="mark.x + 4"
            :y="PAD_TOP + 10"
            text-anchor="start"
            class="tux-chart-histogram__percentile-flag"
          >
            p{{ mark.p }} · {{ format(Number(mark.value.toFixed(decimals))) }}
          </text>
        </template>
      </g>

      <!-- Hover capture -->
      <g v-if="tooltip" class="tux-chart-histogram__hover-layer">
        <rect
          :x="PAD_LEFT"
          :y="PAD_TOP"
          :width="innerW"
          :height="innerH"
          class="tux-chart-histogram__hover-capture"
          tabindex="0"
          role="img"
          :aria-label="`Plot area, ${binCountActual} bins; use arrow keys to read each.`"
          @pointermove="onPointerMove"
          @pointerleave="onPointerLeave"
          @keydown="onKeydown"
        />
      </g>
    </svg>

    <!-- Tooltip card; flips left past 60% width (family contract). -->
    <div
      v-if="tooltip && tooltipPayload"
      class="tux-chart-histogram__tooltip"
      :class="{ 'tux-chart-histogram__tooltip--flip': tooltipAnchorPercent > 60 }"
      role="status"
      aria-live="polite"
      :style="{
        left: `calc(${tooltipAnchorPercent}% + ${tooltipAnchorPercent > 60 ? '-12px' : '12px'})`,
        top: '8px',
      }"
    >
      <p class="tux-chart-histogram__tooltip-label">{{ tooltipPayload.range }}</p>
      <p class="tux-chart-histogram__tooltip-value">
        {{ tooltipPayload.count.toLocaleString() }}<span v-if="units" class="tux-chart-histogram__tooltip-units">&nbsp;{{ units }}</span>
        <span class="tux-chart-histogram__tooltip-share">({{ tooltipPayload.share.toFixed(1) }}%)</span>
      </p>
    </div>
  </figure>
</template>

<style scoped>
.tux-chart-histogram {
  margin: 0;
  position: relative;
  font-family: var(--font-body);
}

.tux-chart-histogram__svg {
  display: block;
  max-width: 100%;
  height: auto;
}

.tux-chart-histogram__gridlines line {
  stroke: var(--surface-border);
  stroke-width: 1;
  stroke-dasharray: 2 4;
}

.tux-chart-histogram__axis text {
  fill: var(--text-muted);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}

.tux-chart-histogram__axis-title {
  fill: var(--text-secondary);
  font-weight: 600;
}

.tux-chart-histogram__bar {
  fill: var(--chart-1, var(--brand-primary));
  stroke: var(--surface-page);
  stroke-width: 1;
  transition: fill 120ms ease-out;
}

.tux-chart-histogram__bar--active {
  fill: color-mix(in srgb, var(--chart-1, var(--brand-primary)) 82%, var(--brand-accent, #ddac37));
}

.tux-chart-histogram__percentile-line {
  stroke: var(--brand-accent-deep, var(--brand-accent, #ddac37));
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
}

.tux-chart-histogram__percentile-flag {
  font-family: var(--font-mono);
  fill: var(--text-primary);
  font-size: 10px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  /* Page-surface halo so the flag stays legible over a tall bar. */
  stroke: var(--surface-page);
  stroke-width: 3;
  paint-order: stroke;
}

/* ---- Hover layer ---- */
.tux-chart-histogram__hover-capture {
  fill: transparent;
  cursor: crosshair;
  outline: none;
}

.tux-chart-histogram__hover-capture:focus-visible {
  fill: color-mix(in srgb, var(--brand-primary) 4%, transparent);
}

.tux-chart-histogram__tooltip {
  position: absolute;
  z-index: 4;
  min-width: 8rem;
  max-width: 16rem;
  padding: 0.5rem 0.625rem;
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  box-shadow: var(--elevation-overlay);
  font-size: 0.75rem;
  pointer-events: none;
}

.tux-chart-histogram__tooltip--flip {
  transform: translateX(-100%);
}

.tux-chart-histogram__tooltip-label {
  font-family: var(--font-mono);
  font-weight: 600;
  margin: 0 0 0.125rem 0;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.tux-chart-histogram__tooltip-value {
  margin: 0;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: var(--text-primary);
}

.tux-chart-histogram__tooltip-units {
  font-family: var(--font-body);
  font-weight: 400;
  color: var(--text-muted);
}

.tux-chart-histogram__tooltip-share {
  font-family: var(--font-body);
  font-weight: 400;
  color: var(--text-muted);
  margin-left: 0.25rem;
}

@media (prefers-reduced-motion: reduce) {
  .tux-chart-histogram__bar {
    transition: none;
  }
}
</style>
