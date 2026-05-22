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
  /** Enable the styled hover tooltip overlay. Default true. Mouse +
   *  keyboard (arrow keys cycle data points). Native SVG title
   *  fallback is always present regardless. */
  tooltip?: boolean;
  /** Enable a brush selector sub-strip beneath the main chart. Drag
   *  the handles to narrow the visible window. Emits `update:range`
   *  with [startIdx, endIdx]. Use with v-model:range. Charts UI Kit
   *  carry-forward. */
  brush?: boolean;
  /** Two-way bound range as [startIdx, endIdx] (inclusive). When set,
   *  the main chart renders only data within the range. Default is
   *  the full range. */
  range?: [number, number];
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
  tooltip: true,
  brush: false,
  range: undefined,
});

const emit = defineEmits<{
  "update:range": [value: [number, number]];
  hover: [payload: { index: number; label: string; values: Array<{ key: string; label: string; value: number }> } | null];
}>();

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

// ----- Visible window (brush selection) ----------------------------
// When `range` is set, slice each series' data + previous + band to
// the [start, end] index window. yDomain + render loops then work
// against the visible slice naturally.
const effectiveRange = computed<[number, number]>(() => {
  const n = props.labels.length;
  if (n === 0) return [0, 0];
  if (props.range) {
    const [a, b] = props.range;
    return [Math.max(0, Math.min(a, n - 1)), Math.max(0, Math.min(b, n - 1))];
  }
  return [0, n - 1];
});

const visibleLabels = computed(() => {
  const [a, b] = effectiveRange.value;
  return props.labels.slice(a, b + 1);
});

const visibleSeries = computed(() => {
  const [a, b] = effectiveRange.value;
  return props.series.map((s) => ({
    ...s,
    data: s.data.slice(a, b + 1),
    previous: s.previous ? s.previous.slice(a, b + 1) : undefined,
    band: s.band ? s.band.slice(a, b + 1) : undefined,
  }));
});

// ----- Hover tooltip ----------------------------------------------
const hoverIndex = ref<number | null>(null);
// Pixel position of the focus line within the SVG. Used to position
// the tooltip card.
const hoverX = computed(() => {
  if (hoverIndex.value === null) return 0;
  return xAt(hoverIndex.value, visibleLabels.value.length);
});

function indexFromPointerX(clientX: number, svg: SVGSVGElement): number | null {
  const rect = svg.getBoundingClientRect();
  const scaleX = props.width / rect.width;
  const xInSvg = (clientX - rect.left) * scaleX;
  const n = visibleLabels.value.length;
  if (n === 0) return null;
  if (xInSvg < padLeft) return 0;
  if (xInSvg > padLeft + plotW.value) return n - 1;
  // Map xInSvg back to index — nearest data point.
  const frac = (xInSvg - padLeft) / Math.max(1, plotW.value);
  return Math.max(0, Math.min(n - 1, Math.round(frac * (n - 1))));
}

function onPlotMove(e: PointerEvent) {
  if (!props.tooltip) return;
  const svg = e.currentTarget as SVGSVGElement;
  const idx = indexFromPointerX(e.clientX, svg);
  if (idx !== null) setHoverIndex(idx);
}

function onPlotLeave() {
  setHoverIndex(null);
}

function onPlotKey(e: KeyboardEvent) {
  if (!props.tooltip) return;
  const n = visibleLabels.value.length;
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
  const label = visibleLabels.value[idx] ?? "";
  const values = visibleSeries.value.map((s) => ({
    key: s.key,
    label: s.label,
    value: s.data[idx] ?? 0,
  }));
  emit("hover", { index: idx, label, values });
}

const tooltipPayload = computed(() => {
  if (hoverIndex.value === null) return null;
  const idx = hoverIndex.value;
  return {
    label: visibleLabels.value[idx] ?? "",
    rows: visibleSeries.value.map((s, i) => ({
      key: s.key,
      label: s.label,
      value: s.data[idx],
      previous: s.previous?.[idx],
      tone: toneVar(s.toneIndex ?? i + 1),
    })),
  };
});

// ----- Brush sub-strip ---------------------------------------------
// Renders a compact preview of the full series with two draggable
// handles. Geometry: 48px tall, full width, sits beneath the main
// chart with 12px gap.
const BRUSH_H = 48;

function brushXAt(i: number, n: number): number {
  if (n <= 1) return padLeft;
  return padLeft + (i / (n - 1)) * plotW.value;
}

function brushYAt(v: number, lo: number, hi: number): number {
  const range = hi - lo;
  if (range === 0) return BRUSH_H / 2;
  const t = (v - lo) / range;
  return (1 - t) * (BRUSH_H - 4) + 2;
}

const brushDomain = computed<[number, number]>(() => {
  let lo = Infinity;
  let hi = -Infinity;
  for (const s of props.series) {
    for (const v of s.data) {
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
  }
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [0, 1];
  if (lo === hi) return [lo - 1, hi + 1];
  return [lo, hi];
});

const brushPaths = computed(() =>
  props.series.map((s, i) => {
    const [lo, hi] = brushDomain.value;
    return {
      tone: toneVar(s.toneIndex ?? i + 1),
      d: s.data
        .map(
          (v, j) =>
            `${j === 0 ? "M" : "L"}${brushXAt(j, s.data.length).toFixed(2)},${brushYAt(v, lo, hi).toFixed(2)}`
        )
        .join(" "),
    };
  })
);

const brushStartX = computed(() => {
  const [a] = effectiveRange.value;
  return brushXAt(a, Math.max(1, props.labels.length));
});

const brushEndX = computed(() => {
  const [, b] = effectiveRange.value;
  return brushXAt(b, Math.max(1, props.labels.length));
});

type BrushDrag = "start" | "end" | "window" | null;
const dragging = ref<BrushDrag>(null);
const dragOffset = ref(0);

function brushIndexFromX(clientX: number, svg: SVGSVGElement): number {
  const rect = svg.getBoundingClientRect();
  const scaleX = props.width / rect.width;
  const xInSvg = (clientX - rect.left) * scaleX;
  const n = props.labels.length;
  const frac = (xInSvg - padLeft) / Math.max(1, plotW.value);
  return Math.max(0, Math.min(n - 1, Math.round(frac * (n - 1))));
}

function onBrushDown(which: BrushDrag, e: PointerEvent) {
  dragging.value = which;
  (e.target as Element).setPointerCapture(e.pointerId);
  if (which === "window") {
    const svg = (e.currentTarget as HTMLElement).querySelector("svg") as SVGSVGElement | null;
    if (svg) {
      const idx = brushIndexFromX(e.clientX, svg);
      const [a] = effectiveRange.value;
      dragOffset.value = idx - a;
    }
  }
}

function onBrushMove(e: PointerEvent) {
  if (!dragging.value) return;
  const svg = (e.currentTarget as HTMLElement).querySelector("svg") as SVGSVGElement | null;
  if (!svg) return;
  const idx = brushIndexFromX(e.clientX, svg);
  const [a, b] = effectiveRange.value;
  const n = props.labels.length;

  if (dragging.value === "start") {
    emit("update:range", [Math.min(idx, b - 1), b]);
  } else if (dragging.value === "end") {
    emit("update:range", [a, Math.max(idx, a + 1)]);
  } else if (dragging.value === "window") {
    const span = b - a;
    let newA = idx - dragOffset.value;
    newA = Math.max(0, Math.min(n - 1 - span, newA));
    emit("update:range", [newA, newA + span]);
  }
}

function onBrushUp() {
  dragging.value = null;
}
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
          v-for="(lab, i) in visibleLabels"
          :key="`x-${i}`"
        >
          <text
            v-if="visibleLabels.length <= 8 || i % Math.ceil(visibleLabels.length / 6) === 0 || i === visibleLabels.length - 1"
            :x="xAt(i, visibleLabels.length)"
            :y="height - padBottom + 18"
            text-anchor="middle"
          >{{ lab }}</text>
        </template>
      </g>

      <!-- Confidence bands (drawn behind lines) -->
      <g class="tux-chart-line__bands">
        <path
          v-for="(s, i) in visibleSeries.filter(x => x.band)"
          :key="`band-${s.key}`"
          :d="bandPath(s.band!)"
          :style="{ fill: toneVar(s.toneIndex ?? i + 1) }"
          class="tux-chart-line__band"
        />
      </g>

      <!-- Previous-period overlays (drawn behind primary lines) -->
      <g class="tux-chart-line__previous-overlays">
        <path
          v-for="(s, i) in visibleSeries.filter(x => x.previous)"
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
          v-for="(s, i) in visibleSeries"
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
          v-for="(s, i) in visibleSeries"
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
          v-for="(s, i) in visibleSeries"
          :key="`end-${s.key}`"
          :x="xAt(s.data.length - 1, s.data.length) + 8"
          :y="yAt(s.data[s.data.length - 1] as number)"
          dominant-baseline="middle"
          :style="{ fill: toneVar(s.toneIndex ?? i + 1) }"
          class="tux-chart-line__end-label"
        >{{ yFormat(s.data[s.data.length - 1] as number) }}</text>
      </g>

      <!-- Hover overlay: vertical guide + focus dots at the active
           index; transparent rect captures pointer events across the
           full plot area. Renders last so it sits on top. -->
      <g v-if="tooltip" class="tux-chart-line__hover-layer">
        <line
          v-if="hoverIndex !== null"
          :x1="hoverX"
          :x2="hoverX"
          :y1="padTop"
          :y2="padTop + plotH"
          class="tux-chart-line__hover-guide"
        />
        <template v-if="hoverIndex !== null">
          <circle
            v-for="(s, i) in visibleSeries"
            :key="`focus-${s.key}`"
            :cx="hoverX"
            :cy="yAt(s.data[hoverIndex] as number)"
            r="4"
            :style="{ stroke: toneVar(s.toneIndex ?? i + 1) }"
            class="tux-chart-line__hover-dot"
          />
        </template>
        <rect
          :x="padLeft"
          :y="padTop"
          :width="plotW"
          :height="plotH"
          class="tux-chart-line__hover-capture"
          tabindex="0"
          :aria-label="`Plot area, ${visibleLabels.length} points; use left/right arrows to read values.`"
          @pointermove="onPlotMove"
          @pointerleave="onPlotLeave"
          @keydown="onPlotKey"
        />
      </g>
    </svg>

    <!-- Tooltip card (HTML, absolutely positioned over the plot).
         When the active index sits past 60% of the chart width, flip
         the card to the *left* of the cursor so it doesn't overflow
         the parent container on the right. -->
    <div
      v-if="tooltip && tooltipPayload"
      class="tux-chart-line__tooltip"
      :class="{ 'tux-chart-line__tooltip--flip': (hoverX / width) > 0.6 }"
      role="status"
      aria-live="polite"
      :style="{
        left: `calc(${(hoverX / width) * 100}% + ${(hoverX / width) > 0.6 ? '-8px' : '8px'})`,
        top: '8px',
      }"
    >
      <p class="tux-chart-line__tooltip-label">{{ tooltipPayload.label }}</p>
      <ul>
        <li
          v-for="row in tooltipPayload.rows"
          :key="row.key"
        >
          <span class="tux-chart-line__tooltip-swatch" :style="{ background: row.tone }" />
          <span class="tux-chart-line__tooltip-name">{{ row.label }}</span>
          <span class="tux-chart-line__tooltip-value">{{ yFormat(row.value as number) }}</span>
          <span
            v-if="row.previous !== undefined"
            class="tux-chart-line__tooltip-previous"
          >
            (was {{ yFormat(row.previous as number) }})
          </span>
        </li>
      </ul>
    </div>

    <!-- Brush strip — compact preview of full data, two draggable
         handles defining the visible window. -->
    <div
      v-if="brush"
      class="tux-chart-line__brush"
      @pointermove="onBrushMove"
      @pointerup="onBrushUp"
      @pointercancel="onBrushUp"
    >
      <svg
        :viewBox="`0 0 ${width} ${BRUSH_H}`"
        :width="width"
        :height="BRUSH_H"
        preserveAspectRatio="none"
        class="tux-chart-line__brush-svg"
        :aria-label="`Brush selector: drag the handles to narrow the visible window. Showing points ${effectiveRange[0] + 1}–${effectiveRange[1] + 1} of ${labels.length}.`"
      >
        <!-- Mini full-data preview -->
        <g class="tux-chart-line__brush-lines">
          <path
            v-for="(p, i) in brushPaths"
            :key="`bp-${i}`"
            :d="p.d"
            :style="{ stroke: p.tone }"
            fill="none"
            stroke-width="1"
          />
        </g>

        <!-- Outside-window dimming -->
        <rect
          :x="padLeft"
          :y="0"
          :width="Math.max(0, brushStartX - padLeft)"
          :height="BRUSH_H"
          class="tux-chart-line__brush-shade"
        />
        <rect
          :x="brushEndX"
          :y="0"
          :width="Math.max(0, padLeft + plotW - brushEndX)"
          :height="BRUSH_H"
          class="tux-chart-line__brush-shade"
        />

        <!-- Window outline + drag region -->
        <rect
          :x="brushStartX"
          :y="0"
          :width="Math.max(0, brushEndX - brushStartX)"
          :height="BRUSH_H"
          class="tux-chart-line__brush-window"
          @pointerdown="onBrushDown('window', $event)"
        />

        <!-- Start handle -->
        <rect
          :x="brushStartX - 4"
          :y="2"
          width="8"
          :height="BRUSH_H - 4"
          rx="2"
          tabindex="0"
          aria-label="Brush start handle"
          class="tux-chart-line__brush-handle"
          @pointerdown="onBrushDown('start', $event)"
        />

        <!-- End handle -->
        <rect
          :x="brushEndX - 4"
          :y="2"
          width="8"
          :height="BRUSH_H - 4"
          rx="2"
          tabindex="0"
          aria-label="Brush end handle"
          class="tux-chart-line__brush-handle"
          @pointerdown="onBrushDown('end', $event)"
        />
      </svg>
    </div>

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

/* ---- Hover layer ---- */
.tux-chart-line {
  position: relative;
}

.tux-chart-line__hover-capture {
  fill: transparent;
  cursor: crosshair;
  outline: none;
}

.tux-chart-line__hover-capture:focus-visible {
  fill: color-mix(in srgb, var(--brand-primary) 4%, transparent);
}

.tux-chart-line__hover-guide {
  stroke: var(--text-muted);
  stroke-width: 1;
  stroke-dasharray: 2 3;
  opacity: 0.6;
  pointer-events: none;
}

.tux-chart-line__hover-dot {
  fill: var(--surface-page);
  stroke-width: 2;
  pointer-events: none;
}

.tux-chart-line__tooltip {
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

/* When the active index is past 60% of the chart width, flip the
   tooltip to the *left* of the cursor so it doesn't overflow the
   container on the right. */
.tux-chart-line__tooltip--flip {
  transform: translateX(-100%);
}

.tux-chart-line__tooltip-label {
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
  font-family: var(--font-sans);
}

.tux-chart-line__tooltip ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tux-chart-line__tooltip li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.375rem;
  align-items: baseline;
  padding: 0.125rem 0;
}

.tux-chart-line__tooltip-swatch {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  align-self: center;
}

.tux-chart-line__tooltip-name {
  color: var(--text-secondary);
}

.tux-chart-line__tooltip-value {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
  font-weight: 600;
}

.tux-chart-line__tooltip-previous {
  grid-column: 1 / -1;
  color: var(--text-muted);
  font-size: 0.6875rem;
  text-align: right;
}

/* ---- Brush sub-strip ---- */
.tux-chart-line__brush {
  margin-top: 0.5rem;
  width: 100%;
  user-select: none;
  touch-action: none;
}

.tux-chart-line__brush-svg {
  display: block;
  width: 100%;
  max-width: 100%;
}

.tux-chart-line__brush-lines path {
  opacity: 0.5;
}

.tux-chart-line__brush-shade {
  fill: var(--surface-page);
  opacity: 0.6;
  pointer-events: none;
}

.tux-chart-line__brush-window {
  fill: color-mix(in srgb, var(--brand-primary) 6%, transparent);
  stroke: color-mix(in srgb, var(--brand-primary) 35%, transparent);
  stroke-width: 1;
  cursor: grab;
}

.tux-chart-line__brush-window:active {
  cursor: grabbing;
}

.tux-chart-line__brush-handle {
  fill: var(--brand-primary);
  cursor: ew-resize;
  outline: none;
}

.tux-chart-line__brush-handle:hover,
.tux-chart-line__brush-handle:focus-visible {
  fill: var(--brand-primary-deep, var(--brand-primary));
}

@media (prefers-reduced-motion: reduce) {
  .tux-chart-line__hover-capture,
  .tux-chart-line__brush-handle,
  .tux-chart-line__brush-window {
    transition: none;
  }
}
</style>
