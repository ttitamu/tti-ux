<script setup lang="ts">
/**
 * TuxChartArea — native SVG area chart.
 *
 * Sibling to TuxChartLine; differs by *filling* the region under
 * each line. Use when the **magnitude** is the message (cumulative
 * traffic, daily ingest volume) rather than the trend's shape alone.
 *
 * Follows [`chart-foundations.md`](../../design/chart-foundations.md):
 *   - Palette `--chart-1..8`; first series at brand maroon.
 *   - **Stacked variant** (multi-series) renders each series as a
 *     cumulative band — the canonical composition for
 *     "Total · Series A · Series B" KPI strips over a stack.
 *   - **End-of-area value labels** on the right edge, colored to
 *     series.
 *   - Optional gridlines, ticks, legend.
 *   - Auto SR summary; override via `ariaSummary`.
 *
 * Data shape — identical to TuxChartLine for easy switching:
 *   series: Array<{
 *     key: string,
 *     label: string,
 *     data: number[],
 *     toneIndex?: number,
 *   }>
 *   labels: string[]
 *
 * Variants:
 *   - "overlay" (default) — each series fills from 0 with 0.18 opacity
 *     so multiple stacks read at once. Single-series default.
 *   - "stacked" — series cumulate; the top edge of the stack is the
 *     total. Use for compositional time-series.
 */
import { computed } from "vue";

interface Series {
  key: string;
  label: string;
  data: number[];
  toneIndex?: number;
}

interface Props {
  labels: string[];
  series: Series[];
  width?: number;
  height?: number;
  variant?: "overlay" | "stacked";
  /** Render data-point markers on each line. Default false (area
   *  chart usually doesn't need them). */
  markers?: boolean;
  /** Show end-of-area value labels colored to series. Default true. */
  endLabels?: boolean;
  /** Render the legend below. Off by default; turn on when endLabels
   *  collide. */
  legend?: boolean;
  /** Show horizontal gridlines at y ticks. */
  gridlines?: boolean;
  ticks?: number;
  /** y-axis formatter. */
  format?: (n: number) => string;
  decimals?: number;
  ariaSummary?: string;
  units?: string;
  /** Enable the styled hover tooltip overlay. Default true. Mouse +
   *  keyboard (tab + arrow keys cycle data points). */
  tooltip?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: 640,
  height: 280,
  variant: "overlay",
  markers: false,
  endLabels: true,
  legend: false,
  gridlines: true,
  ticks: 5,
  format: (n: number) => n.toLocaleString(),
  decimals: 1,
  ariaSummary: undefined,
  units: undefined,
  tooltip: true,
});

const emit = defineEmits<{
  hover: [payload: { index: number; label: string; values: Array<{ key: string; label: string; value: number }> } | null];
}>();

const PAD_TOP = 14;
const PAD_RIGHT = 56; // room for end-of-area labels
const PAD_BOTTOM = 32;
const PAD_LEFT = 48;

const innerW = computed(() => props.width - PAD_LEFT - PAD_RIGHT);
const innerH = computed(() => props.height - PAD_TOP - PAD_BOTTOM);

const isStacked = computed(() => props.variant === "stacked" && props.series.length > 1);

// Stacked cumulative arrays per series.
const stackedSeries = computed(() => {
  if (!isStacked.value) return null;
  const N = props.labels.length;
  const accum = new Array(N).fill(0);
  return props.series.map((s) => {
    const top = s.data.map((v, i) => {
      accum[i] += v;
      return accum[i];
    });
    const bottom = top.map((tv, i) => tv - (s.data[i] ?? 0));
    return { ...s, top, bottom };
  });
});

const extent = computed(() => {
  if (isStacked.value) {
    const totals: number[] = [];
    for (let i = 0; i < props.labels.length; i++) {
      let sum = 0;
      for (const s of props.series) sum += s.data[i] ?? 0;
      totals.push(sum);
    }
    return { min: 0, max: Math.max(0, ...totals) || 1 };
  }
  const vals = props.series.flatMap((s) => s.data);
  return { min: 0, max: Math.max(0, ...vals) || 1 };
});

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
  for (let v = Math.floor(min / chosen) * chosen; v <= max + chosen / 2; v += chosen) {
    ticks.push(Number(v.toFixed(8)));
  }
  return ticks;
}

const yTickValues = computed(() => niceTicks(extent.value.min, extent.value.max, props.ticks));

function xCoord(i: number): number {
  const n = props.labels.length;
  if (n <= 1) return PAD_LEFT;
  return PAD_LEFT + (i / (n - 1)) * innerW.value;
}

function yCoord(v: number): number {
  const { min, max } = extent.value;
  return PAD_TOP + innerH.value - ((v - min) / (max - min || 1)) * innerH.value;
}

function toneClass(s: Series, fallbackIndex: number): string {
  const idx = s.toneIndex ?? fallbackIndex + 1;
  const tone = Math.max(1, Math.min(8, idx));
  return `tux-chart-area__series--c${tone}`;
}

interface AreaPath {
  series: Series;
  path: string;
  topLine: string;
  endLabel: { x: number; y: number; text: string };
  toneClass: string;
}

const areaPaths = computed<AreaPath[]>(() => {
  if (isStacked.value && stackedSeries.value) {
    return stackedSeries.value.map((s, i) => {
      const N = s.top.length;
      const top = s.top.map((tv, idx) => `${idx === 0 ? "M" : "L"} ${xCoord(idx)},${yCoord(tv)}`).join(" ");
      const bottom = s.bottom
        .map((bv, idx) => `${idx === 0 ? "M" : "L"} ${xCoord(idx)},${yCoord(bv)}`)
        .reverse()
        .join(" ")
        .replace(/^M/, "L");
      const path = `${top} ${bottom} Z`;
      const lastIdx = N - 1;
      const topLine = s.top.map((tv, idx) => `${idx === 0 ? "M" : "L"} ${xCoord(idx)},${yCoord(tv)}`).join(" ");
      const last = s.data[lastIdx] ?? 0;
      return {
        series: s,
        path,
        topLine,
        endLabel: {
          x: xCoord(lastIdx) + 6,
          y: yCoord(s.top[lastIdx] ?? 0) + 4,
          text: props.format(last),
        },
        toneClass: toneClass(s, i),
      };
    });
  }
  return props.series.map((s, i) => {
    const N = s.data.length;
    const top = s.data.map((v, idx) => `${idx === 0 ? "M" : "L"} ${xCoord(idx)},${yCoord(v)}`).join(" ");
    const baseY = yCoord(extent.value.min);
    const path = `${top} L ${xCoord(N - 1)},${baseY} L ${xCoord(0)},${baseY} Z`;
    const lastIdx = N - 1;
    const last = s.data[lastIdx] ?? 0;
    return {
      series: s,
      path,
      topLine: top,
      endLabel: {
        x: xCoord(lastIdx) + 6,
        y: yCoord(last) + 4,
        text: props.format(last),
      },
      toneClass: toneClass(s, i),
    };
  });
});

const ariaSummary = computed(() => {
  if (props.ariaSummary) return props.ariaSummary;
  const all = props.series.flatMap((s) => s.data);
  const max = Math.max(...all);
  const min = Math.min(...all);
  const last = props.series.map((s) => s.data[s.data.length - 1] ?? 0);
  const lastTotal = last.reduce((a, b) => a + b, 0);
  const u = props.units ? ` ${props.units}` : "";
  const variantNote = isStacked.value ? " (stacked)" : "";
  return `Area chart${variantNote}: ${props.labels.length} points, ${props.series.length} series, low ${min.toFixed(props.decimals)}, high ${max.toFixed(props.decimals)}, latest total ${lastTotal.toFixed(props.decimals)}${u}.`;
});

// ----- Hover tooltip (Line-style: vertical guide + focus dots) ----
const hoverIndex = ref<number | null>(null);
const hoverX = computed(() => (hoverIndex.value === null ? 0 : xCoord(hoverIndex.value)));

function indexFromPointer(clientX: number, svg: SVGSVGElement): number | null {
  const rect = svg.getBoundingClientRect();
  const scaleX = props.width / rect.width;
  const xInSvg = (clientX - rect.left) * scaleX;
  const n = props.labels.length;
  if (n === 0) return null;
  if (xInSvg < PAD_LEFT) return 0;
  if (xInSvg > PAD_LEFT + innerW.value) return n - 1;
  const frac = (xInSvg - PAD_LEFT) / Math.max(1, innerW.value);
  return Math.max(0, Math.min(n - 1, Math.round(frac * (n - 1))));
}

function onAreaMove(e: PointerEvent) {
  if (!props.tooltip) return;
  const svg = e.currentTarget as SVGSVGElement;
  const idx = indexFromPointer(e.clientX, svg);
  if (idx !== null) setHoverIndex(idx);
}

function onAreaLeave() {
  setHoverIndex(null);
}

function onAreaKey(e: KeyboardEvent) {
  if (!props.tooltip) return;
  const n = props.labels.length;
  if (n === 0) return;
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    e.preventDefault();
    const cur = hoverIndex.value ?? Math.floor(n / 2);
    const next = e.key === "ArrowLeft" ? Math.max(0, cur - 1) : Math.min(n - 1, cur + 1);
    setHoverIndex(next);
  } else if (e.key === "Escape") {
    setHoverIndex(null);
  }
}

function setHoverIndex(idx: number | null) {
  hoverIndex.value = idx;
  if (idx === null) {
    emit("hover", null);
    return;
  }
  const label = props.labels[idx] ?? "";
  const values = props.series.map((s) => ({
    key: s.key,
    label: s.label,
    value: s.data[idx] ?? 0,
  }));
  emit("hover", { index: idx, label, values });
}

const tooltipPayload = computed(() => {
  if (hoverIndex.value === null) return null;
  const idx = hoverIndex.value;
  const total = props.series.reduce((sum, s) => sum + (s.data[idx] ?? 0), 0);
  return {
    label: props.labels[idx] ?? "",
    total: isStacked.value ? total : undefined,
    rows: props.series.map((s, i) => {
      const tone = Math.max(1, Math.min(8, s.toneIndex ?? i + 1));
      return {
        key: s.key,
        label: s.label,
        value: s.data[idx] ?? 0,
        toneClass: `tux-chart-area__series--c${tone}`,
      };
    }),
  };
});

// For focus dots on the area chart we draw at the top edge of each
// series' band (stacked) or at the data value (overlay).
function focusY(seriesIdx: number, idx: number): number {
  if (isStacked.value && stackedSeries.value) {
    return yCoord(stackedSeries.value[seriesIdx]?.top[idx] ?? 0);
  }
  return yCoord(props.series[seriesIdx]?.data[idx] ?? 0);
}
</script>

<template>
  <figure class="tux-chart-area" role="figure" :aria-label="ariaSummary">
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      :width="width"
      :height="height"
      preserveAspectRatio="xMidYMid meet"
      class="tux-chart-area__svg"
    >
      <!-- Gridlines -->
      <g v-if="gridlines" class="tux-chart-area__gridlines">
        <line
          v-for="(t, i) in yTickValues"
          :key="`gl-${i}`"
          :x1="PAD_LEFT"
          :x2="PAD_LEFT + innerW"
          :y1="yCoord(t)"
          :y2="yCoord(t)"
        />
      </g>

      <!-- y axis -->
      <g class="tux-chart-area__axis">
        <text
          v-for="(t, i) in yTickValues"
          :key="`yt-${i}`"
          :x="PAD_LEFT - 8"
          :y="yCoord(t) + 4"
          text-anchor="end"
        >
          {{ format(t) }}
        </text>
      </g>

      <!-- x labels -->
      <g class="tux-chart-area__x-labels">
        <text
          v-for="(label, i) in labels"
          :key="`xl-${i}`"
          :x="xCoord(i)"
          :y="PAD_TOP + innerH + 18"
          text-anchor="middle"
        >
          {{ label }}
        </text>
      </g>

      <!-- Areas (drawn in stacking order; topmost on top in DOM order
           so the visual stack reads as expected). For "overlay"
           variant, opacity is reduced. -->
      <g class="tux-chart-area__areas">
        <path
          v-for="(area, i) in areaPaths"
          :key="`area-${i}`"
          :d="area.path"
          :class="[
            'tux-chart-area__area',
            area.toneClass,
            isStacked ? 'tux-chart-area__area--stacked' : 'tux-chart-area__area--overlay',
          ]"
        />
      </g>

      <!-- Top line of each band — crisper edge than the fill alone. -->
      <g class="tux-chart-area__top-lines">
        <path
          v-for="(area, i) in areaPaths"
          :key="`top-${i}`"
          :d="area.topLine"
          :class="['tux-chart-area__top-line', area.toneClass]"
          fill="none"
        />
      </g>

      <!-- End-of-area value labels -->
      <g v-if="endLabels" class="tux-chart-area__end-labels">
        <text
          v-for="(area, i) in areaPaths"
          :key="`elbl-${i}`"
          :x="area.endLabel.x"
          :y="area.endLabel.y"
          :class="['tux-chart-area__end-label', area.toneClass]"
        >
          {{ area.endLabel.text }}
        </text>
      </g>

      <!-- Hover layer: vertical guide + focus dots + capture rect. -->
      <g v-if="tooltip" class="tux-chart-area__hover-layer">
        <line
          v-if="hoverIndex !== null"
          :x1="hoverX"
          :x2="hoverX"
          :y1="PAD_TOP"
          :y2="PAD_TOP + innerH"
          class="tux-chart-area__hover-guide"
        />
        <template v-if="hoverIndex !== null">
          <circle
            v-for="(s, i) in series"
            :key="`focus-${s.key}`"
            :cx="hoverX"
            :cy="focusY(i, hoverIndex)"
            r="4"
            :class="['tux-chart-area__hover-dot', `tux-chart-area__series--c${Math.max(1, Math.min(8, s.toneIndex ?? i + 1))}`]"
          />
        </template>
        <rect
          :x="PAD_LEFT"
          :y="PAD_TOP"
          :width="innerW"
          :height="innerH"
          class="tux-chart-area__hover-capture"
          tabindex="0"
          role="img"
          :aria-label="`Plot area, ${labels.length} points; use left/right arrows to read values.`"
          @pointermove="onAreaMove"
          @pointerleave="onAreaLeave"
          @keydown="onAreaKey"
        />
      </g>
    </svg>

    <!-- Tooltip card (HTML, absolutely positioned over the plot).
         Flips left of cursor when active index > 60% of width to
         avoid right-edge overflow in tight cards. -->
    <div
      v-if="tooltip && tooltipPayload"
      class="tux-chart-area__tooltip"
      :class="{ 'tux-chart-area__tooltip--flip': (hoverX / width) > 0.6 }"
      role="status"
      aria-live="polite"
      :style="{
        left: `calc(${(hoverX / width) * 100}% + ${(hoverX / width) > 0.6 ? '-8px' : '8px'})`,
        top: '8px',
      }"
    >
      <p class="tux-chart-area__tooltip-label">{{ tooltipPayload.label }}</p>
      <ul>
        <li
          v-for="row in tooltipPayload.rows"
          :key="row.key"
          :class="row.toneClass"
        >
          <span class="tux-chart-area__tooltip-swatch" />
          <span class="tux-chart-area__tooltip-name">{{ row.label }}</span>
          <span class="tux-chart-area__tooltip-value">{{ format(row.value as number) }}</span>
        </li>
        <li
          v-if="tooltipPayload.total !== undefined"
          class="tux-chart-area__tooltip-total"
        >
          <span class="tux-chart-area__tooltip-name">Total</span>
          <span class="tux-chart-area__tooltip-value">{{ format(tooltipPayload.total) }}</span>
        </li>
      </ul>
    </div>

    <ul v-if="legend" class="tux-chart-area__legend">
      <li
        v-for="(area, i) in areaPaths"
        :key="`leg-${i}`"
        :class="['tux-chart-area__legend-item', area.toneClass]"
      >
        <span class="tux-chart-area__legend-swatch" />
        <span>{{ area.series.label }}</span>
      </li>
    </ul>
  </figure>
</template>

<style scoped>
.tux-chart-area {
  margin: 0;
  font-family: var(--font-sans);
}

.tux-chart-area__svg {
  display: block;
  max-width: 100%;
  height: auto;
}

.tux-chart-area__gridlines line {
  stroke: var(--surface-border);
  stroke-width: 1;
  stroke-dasharray: 2 4;
}

.tux-chart-area__axis text,
.tux-chart-area__x-labels text {
  fill: var(--text-muted);
  font-size: 11px;
}

.tux-chart-area__area {
  fill: var(--chart-1, var(--brand-primary));
}
.tux-chart-area__area--overlay {
  opacity: 0.22;
}
.tux-chart-area__area--stacked {
  opacity: 0.78;
}

.tux-chart-area__top-line {
  stroke: var(--chart-1, var(--brand-primary));
  stroke-width: 1.75;
}

.tux-chart-area__end-label {
  font-size: 11px;
  font-weight: 600;
  fill: var(--chart-1, var(--brand-primary));
}

/* Palette */
.tux-chart-area__area.tux-chart-area__series--c1 { fill: var(--chart-1, var(--brand-primary)); }
.tux-chart-area__area.tux-chart-area__series--c2 { fill: var(--chart-2, #3f5a6f); }
.tux-chart-area__area.tux-chart-area__series--c3 { fill: var(--chart-3, #c7973c); }
.tux-chart-area__area.tux-chart-area__series--c4 { fill: var(--chart-4, #6b8e5a); }
.tux-chart-area__area.tux-chart-area__series--c5 { fill: var(--chart-5, #8c5a3c); }
.tux-chart-area__area.tux-chart-area__series--c6 { fill: var(--chart-6, #5c7080); }
.tux-chart-area__area.tux-chart-area__series--c7 { fill: var(--chart-7, #a33a3a); }
.tux-chart-area__area.tux-chart-area__series--c8 { fill: var(--chart-8, #3c5a87); }

.tux-chart-area__top-line.tux-chart-area__series--c1 { stroke: var(--chart-1, var(--brand-primary)); }
.tux-chart-area__top-line.tux-chart-area__series--c2 { stroke: var(--chart-2, #3f5a6f); }
.tux-chart-area__top-line.tux-chart-area__series--c3 { stroke: var(--chart-3, #c7973c); }
.tux-chart-area__top-line.tux-chart-area__series--c4 { stroke: var(--chart-4, #6b8e5a); }
.tux-chart-area__top-line.tux-chart-area__series--c5 { stroke: var(--chart-5, #8c5a3c); }
.tux-chart-area__top-line.tux-chart-area__series--c6 { stroke: var(--chart-6, #5c7080); }
.tux-chart-area__top-line.tux-chart-area__series--c7 { stroke: var(--chart-7, #a33a3a); }
.tux-chart-area__top-line.tux-chart-area__series--c8 { stroke: var(--chart-8, #3c5a87); }

.tux-chart-area__end-label.tux-chart-area__series--c1 { fill: var(--chart-1, var(--brand-primary)); }
.tux-chart-area__end-label.tux-chart-area__series--c2 { fill: var(--chart-2, #3f5a6f); }
.tux-chart-area__end-label.tux-chart-area__series--c3 { fill: var(--chart-3, #c7973c); }
.tux-chart-area__end-label.tux-chart-area__series--c4 { fill: var(--chart-4, #6b8e5a); }
.tux-chart-area__end-label.tux-chart-area__series--c5 { fill: var(--chart-5, #8c5a3c); }
.tux-chart-area__end-label.tux-chart-area__series--c6 { fill: var(--chart-6, #5c7080); }
.tux-chart-area__end-label.tux-chart-area__series--c7 { fill: var(--chart-7, #a33a3a); }
.tux-chart-area__end-label.tux-chart-area__series--c8 { fill: var(--chart-8, #3c5a87); }

.tux-chart-area__legend {
  list-style: none;
  margin: 0.5rem 0 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.75rem;
}

.tux-chart-area__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--text-secondary);
}

.tux-chart-area__legend-swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}
.tux-chart-area__legend-item.tux-chart-area__series--c1 .tux-chart-area__legend-swatch { background: var(--chart-1, var(--brand-primary)); }
.tux-chart-area__legend-item.tux-chart-area__series--c2 .tux-chart-area__legend-swatch { background: var(--chart-2, #3f5a6f); }
.tux-chart-area__legend-item.tux-chart-area__series--c3 .tux-chart-area__legend-swatch { background: var(--chart-3, #c7973c); }
.tux-chart-area__legend-item.tux-chart-area__series--c4 .tux-chart-area__legend-swatch { background: var(--chart-4, #6b8e5a); }
.tux-chart-area__legend-item.tux-chart-area__series--c5 .tux-chart-area__legend-swatch { background: var(--chart-5, #8c5a3c); }
.tux-chart-area__legend-item.tux-chart-area__series--c6 .tux-chart-area__legend-swatch { background: var(--chart-6, #5c7080); }
.tux-chart-area__legend-item.tux-chart-area__series--c7 .tux-chart-area__legend-swatch { background: var(--chart-7, #a33a3a); }
.tux-chart-area__legend-item.tux-chart-area__series--c8 .tux-chart-area__legend-swatch { background: var(--chart-8, #3c5a87); }

/* ---- Hover layer ---- */
.tux-chart-area {
  position: relative;
}

.tux-chart-area__hover-capture {
  fill: transparent;
  cursor: crosshair;
  outline: none;
}

.tux-chart-area__hover-capture:focus-visible {
  fill: color-mix(in srgb, var(--brand-primary) 4%, transparent);
}

.tux-chart-area__hover-guide {
  stroke: var(--text-muted);
  stroke-width: 1;
  stroke-dasharray: 2 3;
  opacity: 0.6;
  pointer-events: none;
}

.tux-chart-area__hover-dot {
  fill: var(--surface-page);
  stroke-width: 2;
  pointer-events: none;
}

.tux-chart-area__hover-dot.tux-chart-area__series--c1 { stroke: var(--chart-1, var(--brand-primary)); }
.tux-chart-area__hover-dot.tux-chart-area__series--c2 { stroke: var(--chart-2, #3f5a6f); }
.tux-chart-area__hover-dot.tux-chart-area__series--c3 { stroke: var(--chart-3, #c7973c); }
.tux-chart-area__hover-dot.tux-chart-area__series--c4 { stroke: var(--chart-4, #6b8e5a); }
.tux-chart-area__hover-dot.tux-chart-area__series--c5 { stroke: var(--chart-5, #8c5a3c); }
.tux-chart-area__hover-dot.tux-chart-area__series--c6 { stroke: var(--chart-6, #5c7080); }
.tux-chart-area__hover-dot.tux-chart-area__series--c7 { stroke: var(--chart-7, #a33a3a); }
.tux-chart-area__hover-dot.tux-chart-area__series--c8 { stroke: var(--chart-8, #3c5a87); }

.tux-chart-area__tooltip {
  position: absolute;
  z-index: 4;
  min-width: 8rem;
  max-width: 16rem;
  padding: 0.5rem 0.625rem;
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm, 4px);
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.08);
  font-size: 0.75rem;
  pointer-events: none;
  transform: translateX(0);
}

.tux-chart-area__tooltip--flip {
  transform: translateX(-100%);
}

.tux-chart-area__tooltip-label {
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
}

.tux-chart-area__tooltip ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tux-chart-area__tooltip li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.375rem;
  align-items: baseline;
  padding: 0.125rem 0;
}

.tux-chart-area__tooltip-swatch {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  align-self: center;
}
.tux-chart-area__tooltip li.tux-chart-area__series--c1 .tux-chart-area__tooltip-swatch { background: var(--chart-1, var(--brand-primary)); }
.tux-chart-area__tooltip li.tux-chart-area__series--c2 .tux-chart-area__tooltip-swatch { background: var(--chart-2, #3f5a6f); }
.tux-chart-area__tooltip li.tux-chart-area__series--c3 .tux-chart-area__tooltip-swatch { background: var(--chart-3, #c7973c); }
.tux-chart-area__tooltip li.tux-chart-area__series--c4 .tux-chart-area__tooltip-swatch { background: var(--chart-4, #6b8e5a); }
.tux-chart-area__tooltip li.tux-chart-area__series--c5 .tux-chart-area__tooltip-swatch { background: var(--chart-5, #8c5a3c); }
.tux-chart-area__tooltip li.tux-chart-area__series--c6 .tux-chart-area__tooltip-swatch { background: var(--chart-6, #5c7080); }
.tux-chart-area__tooltip li.tux-chart-area__series--c7 .tux-chart-area__tooltip-swatch { background: var(--chart-7, #a33a3a); }
.tux-chart-area__tooltip li.tux-chart-area__series--c8 .tux-chart-area__tooltip-swatch { background: var(--chart-8, #3c5a87); }

.tux-chart-area__tooltip-name {
  color: var(--text-secondary);
}

.tux-chart-area__tooltip-value {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
  font-weight: 600;
}

.tux-chart-area__tooltip-total {
  border-top: 1px solid var(--surface-border);
  margin-top: 0.25rem;
  padding-top: 0.25rem !important;
}

.tux-chart-area__tooltip-total .tux-chart-area__tooltip-name {
  font-weight: 600;
  color: var(--text-primary);
  grid-column: 1 / 3;
}
</style>
