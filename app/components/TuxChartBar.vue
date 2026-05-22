<script setup lang="ts">
/**
 * TuxChartBar — native SVG bar chart.
 *
 * Second Priority B chart, sibling to TuxChartLine. No external
 * library. Follows
 * [`design/chart-foundations.md`](../../design/chart-foundations.md):
 *
 *   - **Palette:** `--chart-1` … `--chart-8` per series, maroon-led.
 *   - **Orientations:** vertical (default) + horizontal.
 *   - **Variants:** single series, grouped (side-by-side bars per
 *     category), stacked (segments per bar), and a `comparison`
 *     overlay (muted "projection" bar behind a solid "actual" bar
 *     — absorbed from the Snow dashboard "Projections vs Actuals"
 *     pattern).
 *   - **Value labels:** above the bar (vertical) or after the bar
 *     (horizontal) by default; opt-into in-bar via `inBarLabels`.
 *   - **Screen-reader summary** auto-derived ("Bar chart: 12
 *     categories, low 4, high 38, total 184"). Override via
 *     `ariaSummary`.
 *   - **Editorial chrome** not baked in — wrap in `TuxChartFrame`
 *     for exhibits; bare in dashboard tiles.
 *
 * Data shape:
 *   labels: string[]          // category names; one bar per
 *   series: Array<{
 *     key: string,
 *     label: string,
 *     data: number[],         // value per category
 *     comparison?: number[],  // optional "target" overlay
 *     toneIndex?: number,     // 1–8; default = position in array
 *   }>
 *
 * When `series.length === 1` the chart renders single-series bars
 * with the category palette walking through `--chart-1..8`. With
 * multiple series, default is grouped; pass `stacked` to stack.
 *
 * Usage:
 *   <tux-chart-bar
 *     :labels="months"
 *     :series="[
 *       { key: 'ingest', label: 'Files ingested', data: [12, 18, 24, 31, 28, 35] },
 *     ]"
 *   />
 */
import { computed } from "vue";

interface Series {
  key: string;
  label: string;
  data: number[];
  /** Muted "projection" overlay; same length as `data`. */
  comparison?: number[];
  /** Override palette index (1..8). Default = position. */
  toneIndex?: number;
}

interface Props {
  labels: string[];
  series: Series[];
  /** Render width in CSS px. */
  width?: number;
  /** Render height in CSS px. */
  height?: number;
  /** Orientation. Default "vertical". */
  orientation?: "vertical" | "horizontal";
  /** Grouped (side-by-side) or stacked when multi-series.
   *  Default "grouped". */
  variant?: "grouped" | "stacked";
  /** Show value labels above each bar (vertical) or after each bar
   *  (horizontal). Default true. */
  valueLabels?: boolean;
  /** Render value labels inside the bar instead of outside (good for
   *  tall bars or tight layouts). Default false. */
  inBarLabels?: boolean;
  /** Show horizontal gridlines at y-axis ticks (vertical
   *  orientation) or vertical gridlines (horizontal). */
  gridlines?: boolean;
  /** Show the legend below the chart. Default false; turn on when
   *  end-bar labels can't carry identity. */
  legend?: boolean;
  /** y-axis (vertical) / x-axis (horizontal) tick count. Default 5. */
  ticks?: number;
  /** Number formatter for axes + value labels. */
  format?: (n: number) => string;
  /** Decimals for the SR summary. */
  decimals?: number;
  /** Override the auto-derived SR summary. */
  ariaSummary?: string;
  /** Units label appended to the SR summary ("requests/min"). */
  units?: string;
  /** Enable the styled hover tooltip. Default true. Hovering a bar
   *  highlights its category column + shows a tooltip card with the
   *  category total + per-series values. */
  tooltip?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: 640,
  height: 280,
  orientation: "vertical",
  variant: "grouped",
  valueLabels: true,
  inBarLabels: false,
  gridlines: true,
  legend: false,
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

// Layout — same paddings as TuxChartLine for visual rhythm consistency.
const PAD_TOP = 16;
const PAD_RIGHT = 24;
const PAD_BOTTOM = 36;
const PAD_LEFT = 48;

const innerW = computed(() => props.width - PAD_LEFT - PAD_RIGHT);
const innerH = computed(() => props.height - PAD_TOP - PAD_BOTTOM);

const isStacked = computed(() => props.variant === "stacked" && props.series.length > 1);
const isHorizontal = computed(() => props.orientation === "horizontal");

// Value extent — depends on variant.
const extent = computed(() => {
  const vals: number[] = [];
  if (isStacked.value) {
    // Stacked: max is the per-category sum.
    for (let i = 0; i < props.labels.length; i++) {
      let sum = 0;
      for (const s of props.series) sum += (s.data[i] ?? 0);
      vals.push(sum);
    }
  } else {
    for (const s of props.series) {
      for (const v of s.data) vals.push(v);
      if (s.comparison) for (const v of s.comparison) vals.push(v);
    }
  }
  const max = Math.max(0, ...vals);
  // Always anchor at 0 — bar charts shouldn't truncate.
  return { min: 0, max: max || 1 };
});

// Nice-rounded ticks.
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

// Scales: value scale + category scale.
function vScale(v: number): number {
  const { min, max } = extent.value;
  const range = max - min;
  if (isHorizontal.value) {
    return ((v - min) / range) * innerW.value;
  }
  return ((v - min) / range) * innerH.value;
}

const categoryCount = computed(() => props.labels.length);

const groupWidth = computed(() => {
  const dim = isHorizontal.value ? innerH.value : innerW.value;
  return dim / Math.max(1, categoryCount.value);
});

const barWidth = computed(() => {
  if (isStacked.value || props.series.length === 1) {
    return groupWidth.value * 0.6;
  }
  // Grouped: divide the slot by series count, with small gaps.
  return (groupWidth.value * 0.78) / props.series.length;
});

function categoryOffset(catIndex: number): number {
  // Left/top edge of the slot for category `catIndex`.
  return catIndex * groupWidth.value;
}

function barRect(catIndex: number, seriesIndex: number, value: number, baseV = 0): {
  x: number;
  y: number;
  w: number;
  h: number;
} {
  const slotStart = categoryOffset(catIndex);
  const slotCenter = slotStart + groupWidth.value / 2;
  const w = barWidth.value;

  if (isHorizontal.value) {
    // Horizontal: bars grow rightward; categories stack vertically.
    const groupTop = slotCenter - (props.series.length * w) / 2 + (isStacked.value ? 0 : seriesIndex * w);
    return {
      x: PAD_LEFT + vScale(baseV),
      y: PAD_TOP + (isStacked.value ? slotCenter - w / 2 : groupTop),
      w: vScale(value) - vScale(baseV),
      h: w,
    };
  }
  // Vertical: bars grow upward; categories stack horizontally.
  const groupLeft = slotCenter - (props.series.length * w) / 2 + (isStacked.value ? 0 : seriesIndex * w);
  return {
    x: PAD_LEFT + (isStacked.value ? slotCenter - w / 2 : groupLeft),
    y: PAD_TOP + innerH.value - vScale(value),
    w,
    h: vScale(value) - vScale(baseV),
  };
}

function toneClass(s: Series, fallbackIndex: number): string {
  const idx = s.toneIndex ?? fallbackIndex + 1;
  const clamped = Math.max(1, Math.min(8, idx));
  return `tux-chart-bar__series--c${clamped}`;
}

// For single-series mode, walk the palette across categories (gives
// the categorical-chart visual).
function categoryToneClass(catIndex: number): string {
  return `tux-chart-bar__series--c${(catIndex % 8) + 1}`;
}

// Iteration helper: stacked needs cumulative base per category.
function stackedBars(): Array<{
  catIndex: number;
  seriesIndex: number;
  series: Series;
  value: number;
  base: number;
  toneClass: string;
}> {
  const out: Array<{
    catIndex: number;
    seriesIndex: number;
    series: Series;
    value: number;
    base: number;
    toneClass: string;
  }> = [];
  for (let i = 0; i < props.labels.length; i++) {
    let base = 0;
    props.series.forEach((s, j) => {
      const v = s.data[i] ?? 0;
      out.push({
        catIndex: i,
        seriesIndex: j,
        series: s,
        value: base + v,
        base,
        toneClass: toneClass(s, j),
      });
      base += v;
    });
  }
  return out;
}

const stackBars = computed(() => stackedBars());

// Auto SR summary.
const ariaSummary = computed(() => {
  if (props.ariaSummary) return props.ariaSummary;
  const all = props.series.flatMap((s) => s.data);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const total = all.reduce((a, b) => a + b, 0);
  const unitsTrail = props.units ? ` ${props.units}` : "";
  return `Bar chart: ${props.labels.length} categories, ${props.series.length} series, low ${min.toFixed(props.decimals)}, high ${max.toFixed(props.decimals)}, total ${total.toFixed(props.decimals)}${unitsTrail}.`;
});

// Render labels at category positions.
function categoryAnchorPos(catIndex: number): { x: number; y: number } {
  const slotCenter = categoryOffset(catIndex) + groupWidth.value / 2;
  if (isHorizontal.value) {
    return { x: PAD_LEFT - 8, y: PAD_TOP + slotCenter + 4 };
  }
  return { x: PAD_LEFT + slotCenter, y: PAD_TOP + innerH.value + 18 };
}

// Value label positions per non-stacked bar.
function valueLabelPos(rect: { x: number; y: number; w: number; h: number }): {
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
  baseline: string;
} {
  if (isHorizontal.value) {
    return {
      x: props.inBarLabels ? rect.x + rect.w - 6 : rect.x + rect.w + 6,
      y: rect.y + rect.h / 2 + 4,
      anchor: props.inBarLabels ? "end" : "start",
      baseline: "middle",
    };
  }
  return {
    x: rect.x + rect.w / 2,
    y: props.inBarLabels ? rect.y + 14 : rect.y - 6,
    anchor: "middle",
    baseline: props.inBarLabels ? "hanging" : "ideographic",
  };
}

// ----- Hover tooltip (bar-highlight pattern) ----------------------
const hoverCategory = ref<number | null>(null);

function categoryIndexFromPointer(clientX: number, clientY: number, svg: SVGSVGElement): number | null {
  const rect = svg.getBoundingClientRect();
  const scaleX = props.width / rect.width;
  const scaleY = props.height / rect.height;
  const xInSvg = (clientX - rect.left) * scaleX;
  const yInSvg = (clientY - rect.top) * scaleY;
  const n = props.labels.length;
  if (n === 0) return null;

  if (isHorizontal.value) {
    if (yInSvg < PAD_TOP || yInSvg > PAD_TOP + innerH.value) return null;
    const slot = (yInSvg - PAD_TOP) / Math.max(1, groupWidth.value);
    return Math.max(0, Math.min(n - 1, Math.floor(slot)));
  }
  if (xInSvg < PAD_LEFT || xInSvg > PAD_LEFT + innerW.value) return null;
  const slot = (xInSvg - PAD_LEFT) / Math.max(1, groupWidth.value);
  return Math.max(0, Math.min(n - 1, Math.floor(slot)));
}

function onBarMove(e: PointerEvent) {
  if (!props.tooltip) return;
  const svg = e.currentTarget as SVGSVGElement;
  const idx = categoryIndexFromPointer(e.clientX, e.clientY, svg);
  setHoverCategory(idx);
}

function onBarLeave() {
  setHoverCategory(null);
}

function onBarKey(e: KeyboardEvent) {
  if (!props.tooltip) return;
  const n = props.labels.length;
  if (n === 0) return;
  if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
    const cur = hoverCategory.value ?? 0;
    const advance = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
    setHoverCategory(Math.max(0, Math.min(n - 1, cur + advance)));
  } else if (e.key === "Escape") {
    setHoverCategory(null);
  }
}

function setHoverCategory(idx: number | null) {
  hoverCategory.value = idx;
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
  if (hoverCategory.value === null) return null;
  const idx = hoverCategory.value;
  const total = props.series.reduce((sum, s) => sum + (s.data[idx] ?? 0), 0);
  return {
    label: props.labels[idx] ?? "",
    total,
    rows: props.series.map((s, i) => {
      const tone = props.series.length === 1
        ? (idx % 8) + 1
        : Math.max(1, Math.min(8, s.toneIndex ?? i + 1));
      return {
        key: s.key,
        label: s.label,
        value: s.data[idx] ?? 0,
        toneClass: `tux-chart-bar__series--c${tone}`,
        comparison: s.comparison?.[idx],
      };
    }),
  };
});

// Pixel position to anchor the tooltip card.
const tooltipAnchorPercent = computed(() => {
  if (hoverCategory.value === null) return 0;
  const slotCenter = categoryOffset(hoverCategory.value) + groupWidth.value / 2;
  if (isHorizontal.value) return ((PAD_LEFT + innerW.value / 2) / props.width) * 100;
  return ((PAD_LEFT + slotCenter) / props.width) * 100;
});

// Highlight rect geometry per active category.
const highlightRect = computed(() => {
  if (hoverCategory.value === null) return null;
  const i = hoverCategory.value;
  if (isHorizontal.value) {
    return {
      x: PAD_LEFT,
      y: PAD_TOP + categoryOffset(i),
      width: innerW.value,
      height: groupWidth.value,
    };
  }
  return {
    x: PAD_LEFT + categoryOffset(i),
    y: PAD_TOP,
    width: groupWidth.value,
    height: innerH.value,
  };
});
</script>

<template>
  <figure
    class="tux-chart-bar"
    role="figure"
    :aria-label="ariaSummary"
    :data-orient="orientation"
  >
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      :width="width"
      :height="height"
      preserveAspectRatio="xMidYMid meet"
      class="tux-chart-bar__svg"
    >
      <!-- Gridlines -->
      <g v-if="gridlines" class="tux-chart-bar__gridlines">
        <template v-if="!isHorizontal">
          <line
            v-for="(t, i) in yTickValues"
            :key="`gl-v-${i}`"
            :x1="PAD_LEFT"
            :x2="PAD_LEFT + innerW"
            :y1="PAD_TOP + innerH - vScale(t)"
            :y2="PAD_TOP + innerH - vScale(t)"
          />
        </template>
        <template v-else>
          <line
            v-for="(t, i) in yTickValues"
            :key="`gl-h-${i}`"
            :y1="PAD_TOP"
            :y2="PAD_TOP + innerH"
            :x1="PAD_LEFT + vScale(t)"
            :x2="PAD_LEFT + vScale(t)"
          />
        </template>
      </g>

      <!-- Axis ticks -->
      <g class="tux-chart-bar__axis">
        <template v-if="!isHorizontal">
          <text
            v-for="(t, i) in yTickValues"
            :key="`yt-${i}`"
            :x="PAD_LEFT - 8"
            :y="PAD_TOP + innerH - vScale(t) + 4"
            text-anchor="end"
          >
            {{ format(t) }}
          </text>
        </template>
        <template v-else>
          <text
            v-for="(t, i) in yTickValues"
            :key="`xt-${i}`"
            :x="PAD_LEFT + vScale(t)"
            :y="PAD_TOP + innerH + 18"
            text-anchor="middle"
          >
            {{ format(t) }}
          </text>
        </template>
      </g>

      <!-- Category labels -->
      <g class="tux-chart-bar__category-labels">
        <text
          v-for="(label, i) in labels"
          :key="`cat-${i}`"
          :x="categoryAnchorPos(i).x"
          :y="categoryAnchorPos(i).y"
          :text-anchor="isHorizontal ? 'end' : 'middle'"
        >
          {{ label }}
        </text>
      </g>

      <!-- Comparison overlay (drawn first, behind primary) -->
      <g v-if="!isStacked && series.some((s) => s.comparison)" class="tux-chart-bar__comparison">
        <template v-for="(s, j) in series" :key="`cmp-s-${j}`">
          <template v-if="s.comparison">
            <rect
              v-for="(v, i) in s.comparison"
              :key="`cmp-${j}-${i}`"
              :x="barRect(i, j, v).x"
              :y="barRect(i, j, v).y"
              :width="barRect(i, j, v).w"
              :height="barRect(i, j, v).h"
              :class="['tux-chart-bar__bar tux-chart-bar__bar--comparison', toneClass(s, j)]"
            />
          </template>
        </template>
      </g>

      <!-- Bars: grouped / single -->
      <g v-if="!isStacked" class="tux-chart-bar__bars">
        <template v-for="(s, j) in series" :key="`s-${j}`">
          <template v-for="(v, i) in s.data" :key="`b-${j}-${i}`">
            <rect
              :x="barRect(i, j, v).x"
              :y="barRect(i, j, v).y"
              :width="barRect(i, j, v).w"
              :height="Math.max(0, barRect(i, j, v).h)"
              :class="['tux-chart-bar__bar', series.length === 1 ? categoryToneClass(i) : toneClass(s, j)]"
              :style="`--tux-chart-stagger-index: ${i};`"
            />
            <text
              v-if="valueLabels"
              :x="valueLabelPos(barRect(i, j, v)).x"
              :y="valueLabelPos(barRect(i, j, v)).y"
              :text-anchor="valueLabelPos(barRect(i, j, v)).anchor"
              :class="['tux-chart-bar__value-label', series.length === 1 ? categoryToneClass(i) : toneClass(s, j)]"
            >
              {{ format(v) }}
            </text>
          </template>
        </template>
      </g>

      <!-- Bars: stacked -->
      <g v-else class="tux-chart-bar__bars tux-chart-bar__bars--stacked">
        <template v-for="(seg, k) in stackBars" :key="`st-${k}`">
          <rect
            :x="barRect(seg.catIndex, seg.seriesIndex, seg.value, seg.base).x"
            :y="barRect(seg.catIndex, seg.seriesIndex, seg.value, seg.base).y"
            :width="barRect(seg.catIndex, seg.seriesIndex, seg.value, seg.base).w"
            :height="Math.max(0, barRect(seg.catIndex, seg.seriesIndex, seg.value, seg.base).h)"
            :class="['tux-chart-bar__bar', seg.toneClass]"
            :style="`--tux-chart-stagger-index: ${seg.catIndex};`"
          />
        </template>
      </g>

      <!-- Hover overlay: column-wash highlight + capture rect -->
      <g v-if="tooltip" class="tux-chart-bar__hover-layer">
        <rect
          v-if="highlightRect"
          :x="highlightRect.x"
          :y="highlightRect.y"
          :width="highlightRect.width"
          :height="highlightRect.height"
          class="tux-chart-bar__hover-highlight"
        />
        <rect
          :x="PAD_LEFT"
          :y="PAD_TOP"
          :width="innerW"
          :height="innerH"
          class="tux-chart-bar__hover-capture"
          tabindex="0"
          :aria-label="`Plot area, ${labels.length} categories; use arrow keys to read each.`"
          @pointermove="onBarMove"
          @pointerleave="onBarLeave"
          @keydown="onBarKey"
        />
      </g>
    </svg>

    <!-- Tooltip card -->
    <div
      v-if="tooltip && tooltipPayload"
      class="tux-chart-bar__tooltip"
      role="status"
      aria-live="polite"
      :style="{ left: `calc(${tooltipAnchorPercent}% + 12px)`, top: '8px' }"
    >
      <p class="tux-chart-bar__tooltip-label">{{ tooltipPayload.label }}</p>
      <ul>
        <li
          v-for="row in tooltipPayload.rows"
          :key="row.key"
          :class="row.toneClass"
        >
          <span class="tux-chart-bar__tooltip-swatch" />
          <span class="tux-chart-bar__tooltip-name">{{ row.label }}</span>
          <span class="tux-chart-bar__tooltip-value">{{ format(row.value as number) }}</span>
          <span
            v-if="row.comparison !== undefined"
            class="tux-chart-bar__tooltip-comparison"
          >
            (target {{ format(row.comparison as number) }})
          </span>
        </li>
        <li
          v-if="series.length > 1"
          class="tux-chart-bar__tooltip-total"
        >
          <span class="tux-chart-bar__tooltip-name">Total</span>
          <span class="tux-chart-bar__tooltip-value">{{ format(tooltipPayload.total) }}</span>
        </li>
      </ul>
    </div>

    <!-- Legend -->
    <ul v-if="legend" class="tux-chart-bar__legend">
      <li
        v-for="(s, i) in series"
        :key="s.key"
        :class="['tux-chart-bar__legend-item', toneClass(s, i)]"
      >
        <span class="tux-chart-bar__legend-swatch" />
        <span class="tux-chart-bar__legend-label">{{ s.label }}</span>
      </li>
    </ul>
  </figure>
</template>

<style scoped>
.tux-chart-bar {
  margin: 0;
  font-family: var(--font-sans);
}

.tux-chart-bar__svg {
  display: block;
  max-width: 100%;
  height: auto;
}

.tux-chart-bar__gridlines line {
  stroke: var(--surface-border);
  stroke-width: 1;
  stroke-dasharray: 2 4;
}

.tux-chart-bar__axis text {
  fill: var(--text-muted);
  font-size: 11px;
}

.tux-chart-bar__category-labels text {
  fill: var(--text-secondary);
  font-size: 11px;
}

.tux-chart-bar__bar {
  /* Default fill — overridden by tone classes below. */
  fill: var(--chart-1, var(--brand-primary));
  transition: fill 120ms ease-out;
}

.tux-chart-bar__bar--comparison {
  opacity: 0.32;
}

.tux-chart-bar__value-label {
  font-size: 11px;
  font-weight: 600;
  fill: var(--text-secondary);
}

/* Palette — eight chart tones. */
.tux-chart-bar__series--c1 .tux-chart-bar__legend-swatch,
.tux-chart-bar__bar.tux-chart-bar__series--c1,
.tux-chart-bar__value-label.tux-chart-bar__series--c1 { fill: var(--chart-1, var(--brand-primary)); background: var(--chart-1, var(--brand-primary)); }
.tux-chart-bar__series--c2 .tux-chart-bar__legend-swatch,
.tux-chart-bar__bar.tux-chart-bar__series--c2,
.tux-chart-bar__value-label.tux-chart-bar__series--c2 { fill: var(--chart-2, #3f5a6f); background: var(--chart-2, #3f5a6f); }
.tux-chart-bar__series--c3 .tux-chart-bar__legend-swatch,
.tux-chart-bar__bar.tux-chart-bar__series--c3,
.tux-chart-bar__value-label.tux-chart-bar__series--c3 { fill: var(--chart-3, #c7973c); background: var(--chart-3, #c7973c); }
.tux-chart-bar__series--c4 .tux-chart-bar__legend-swatch,
.tux-chart-bar__bar.tux-chart-bar__series--c4,
.tux-chart-bar__value-label.tux-chart-bar__series--c4 { fill: var(--chart-4, #6b8e5a); background: var(--chart-4, #6b8e5a); }
.tux-chart-bar__series--c5 .tux-chart-bar__legend-swatch,
.tux-chart-bar__bar.tux-chart-bar__series--c5,
.tux-chart-bar__value-label.tux-chart-bar__series--c5 { fill: var(--chart-5, #8c5a3c); background: var(--chart-5, #8c5a3c); }
.tux-chart-bar__series--c6 .tux-chart-bar__legend-swatch,
.tux-chart-bar__bar.tux-chart-bar__series--c6,
.tux-chart-bar__value-label.tux-chart-bar__series--c6 { fill: var(--chart-6, #5c7080); background: var(--chart-6, #5c7080); }
.tux-chart-bar__series--c7 .tux-chart-bar__legend-swatch,
.tux-chart-bar__bar.tux-chart-bar__series--c7,
.tux-chart-bar__value-label.tux-chart-bar__series--c7 { fill: var(--chart-7, #a33a3a); background: var(--chart-7, #a33a3a); }
.tux-chart-bar__series--c8 .tux-chart-bar__legend-swatch,
.tux-chart-bar__bar.tux-chart-bar__series--c8,
.tux-chart-bar__value-label.tux-chart-bar__series--c8 { fill: var(--chart-8, #3c5a87); background: var(--chart-8, #3c5a87); }

.tux-chart-bar__legend {
  list-style: none;
  margin: 0.5rem 0 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.75rem;
}

.tux-chart-bar__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--text-secondary);
}

.tux-chart-bar__legend-swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .tux-chart-bar__bar {
    transition: none;
  }
}

/* ---- Hover layer ---- */
.tux-chart-bar {
  position: relative;
}

.tux-chart-bar__hover-capture {
  fill: transparent;
  cursor: crosshair;
  outline: none;
}

.tux-chart-bar__hover-capture:focus-visible {
  fill: color-mix(in srgb, var(--brand-primary) 4%, transparent);
}

.tux-chart-bar__hover-highlight {
  fill: color-mix(in srgb, var(--brand-primary) 5%, transparent);
  pointer-events: none;
}

.tux-chart-bar__tooltip {
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

.tux-chart-bar__tooltip-label {
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
  font-family: var(--font-sans);
}

.tux-chart-bar__tooltip ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tux-chart-bar__tooltip li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.375rem;
  align-items: baseline;
  padding: 0.125rem 0;
}

.tux-chart-bar__tooltip-swatch {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  align-self: center;
}
.tux-chart-bar__tooltip li.tux-chart-bar__series--c1 .tux-chart-bar__tooltip-swatch { background: var(--chart-1, var(--brand-primary)); }
.tux-chart-bar__tooltip li.tux-chart-bar__series--c2 .tux-chart-bar__tooltip-swatch { background: var(--chart-2, #3f5a6f); }
.tux-chart-bar__tooltip li.tux-chart-bar__series--c3 .tux-chart-bar__tooltip-swatch { background: var(--chart-3, #c7973c); }
.tux-chart-bar__tooltip li.tux-chart-bar__series--c4 .tux-chart-bar__tooltip-swatch { background: var(--chart-4, #6b8e5a); }
.tux-chart-bar__tooltip li.tux-chart-bar__series--c5 .tux-chart-bar__tooltip-swatch { background: var(--chart-5, #8c5a3c); }
.tux-chart-bar__tooltip li.tux-chart-bar__series--c6 .tux-chart-bar__tooltip-swatch { background: var(--chart-6, #5c7080); }
.tux-chart-bar__tooltip li.tux-chart-bar__series--c7 .tux-chart-bar__tooltip-swatch { background: var(--chart-7, #a33a3a); }
.tux-chart-bar__tooltip li.tux-chart-bar__series--c8 .tux-chart-bar__tooltip-swatch { background: var(--chart-8, #3c5a87); }

.tux-chart-bar__tooltip-name {
  color: var(--text-secondary);
}

.tux-chart-bar__tooltip-value {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
  font-weight: 600;
}

.tux-chart-bar__tooltip-comparison {
  grid-column: 1 / -1;
  color: var(--text-muted);
  font-size: 0.6875rem;
  text-align: right;
}

.tux-chart-bar__tooltip-total {
  border-top: 1px solid var(--surface-border);
  margin-top: 0.25rem;
  padding-top: 0.25rem !important;
}

.tux-chart-bar__tooltip-total .tux-chart-bar__tooltip-name {
  font-weight: 600;
  color: var(--text-primary);
  grid-column: 1 / 3;
}
</style>
