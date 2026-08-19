<script setup lang="ts">
/**
 * TuxChartHeatmap — native SVG matrix heatmap (time × category).
 *
 * The top-ranked viz gap for TTI work: crash counts by day-of-week ×
 * hour-of-day, corridor demand by month, sensor uptime by station ×
 * week. No external library. Follows
 * [`design/chart-foundations.md`](../../design/chart-foundations.md):
 *
 *   - **Ramp, not categorical palette:** cells quantize onto the
 *     5-stop sequential map ramps (`--map-seq-maroon-*` default,
 *     `--map-seq-slate-*` via `ramp="slate"`) — the same ramps the
 *     choropleth family uses, so a heatmap tile and a county map on
 *     one dashboard read as one system. Equal-interval bins; the
 *     legend prints the bin ranges so color is never the only encoder.
 *   - **Interactivity contract** (components.md "Chart tooltips"):
 *     one tab stop; the roving cursor here is **two-dimensional** —
 *     Left/Right walk columns, Up/Down walk rows, Escape clears.
 *     Branded tooltip card with row · column · value, auto-flip past
 *     60% width, `hover` emit, `:tooltip="false"` for print.
 *   - **Missing data is honest:** `null` cells render as a hollow
 *     hatch, are skipped in the extent, and read "No data" in the
 *     tooltip — never zero.
 *   - **Screen-reader summary** auto-derived ("Heatmap: 7 rows ×
 *     24 columns, low 2, high 41, peak Friday · 5 PM."). Override
 *     via `ariaSummary`.
 *
 * Data shape:
 *   rows: string[]                 // y labels, top → bottom
 *   cols: string[]                 // x labels, left → right
 *   values: (number | null)[][]    // values[rowIndex][colIndex]
 *
 * Usage:
 *   <tux-chart-heatmap
 *     :rows="['Mon', 'Tue', 'Wed', 'Thu', 'Fri']"
 *     :cols="hours"
 *     :values="crashMatrix"
 *     units="crashes"
 *   />
 */
import { computed, ref } from "vue";

interface Props {
  /** Row (y) category labels, rendered top → bottom. */
  rows: string[];
  /** Column (x) category labels, rendered left → right. */
  cols: string[];
  /** Cell values, `values[rowIndex][colIndex]`. `null` = no data. */
  values: Array<Array<number | null>>;
  /** Render width in CSS px. */
  width?: number;
  /** Render height in CSS px. */
  height?: number;
  /** Sequential ramp. Maroon leads (brand anchor); slate is the
   *  neutral second voice for side-by-side heatmap pairs. */
  ramp?: "maroon" | "slate";
  /** Equal-interval bin count on the ramp (3–5). Default 5. */
  bins?: 3 | 4 | 5;
  /** Print the value inside each cell. Default false — right for
   *  dense matrices; turn on for small ones (≤ ~12 columns). */
  valueLabels?: boolean;
  /** Show the binned-ramp legend below the chart. Default true. */
  legend?: boolean;
  /** Label every Nth column (1 = all). Default 0 = auto (aims for
   *  ≤ 12 printed labels so a 24-hour axis doesn't shingle). */
  colLabelEvery?: number;
  /** Number formatter for cells, tooltip, and legend ranges. */
  format?: (n: number) => string;
  /** Decimals for the SR summary. */
  decimals?: number;
  /** Override the auto-derived SR summary. */
  ariaSummary?: string;
  /** Units label for tooltip + SR summary ("crashes"). */
  units?: string;
  /** Enable the hover tooltip + keyboard cursor. Default true. */
  tooltip?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: 640,
  height: 280,
  ramp: "maroon",
  bins: 5,
  valueLabels: false,
  legend: true,
  colLabelEvery: 0,
  format: (n: number) => n.toLocaleString(),
  decimals: 1,
  ariaSummary: undefined,
  units: undefined,
  tooltip: true,
});

const emit = defineEmits<{
  hover: [payload: { row: number; col: number; rowLabel: string; colLabel: string; value: number | null } | null];
}>();

// Layout — family-standard margins (tuxChartScale) so a heatmap
// stacked above a bar chart keeps the shared left gutter.
const PAD_TOP = TUX_CHART_MARGINS.top;
const PAD_RIGHT = TUX_CHART_MARGINS.right;
const PAD_BOTTOM = TUX_CHART_MARGINS.bottom;
const PAD_LEFT = TUX_CHART_MARGINS.left;

const innerW = computed(() => props.width - PAD_LEFT - PAD_RIGHT);
const innerH = computed(() => props.height - PAD_TOP - PAD_BOTTOM);
const cellW = computed(() => innerW.value / Math.max(1, props.cols.length));
const cellH = computed(() => innerH.value / Math.max(1, props.rows.length));

// 2dp rounding at the geometry boundary — the house hydration
// discipline (raw division floats serialize differently across V8
// builds and trip "Hydration completed but contains mismatches").
const r2 = (n: number) => Number(n.toFixed(2));

const extent = computed(() => {
  const flat: number[] = [];
  for (const row of props.values) {
    for (const v of row) if (v !== null) flat.push(v);
  }
  return tuxExtent(flat);
});

// Ramp stop per bin count — fewer bins spread across the full ramp
// so a 3-bin heatmap still ends on the anchor stop.
const RAMP_STOPS: Record<number, number[]> = {
  3: [1, 3, 5],
  4: [1, 2, 4, 5],
  5: [1, 2, 3, 4, 5],
};

function cellBin(v: number): number {
  const [lo, hi] = extent.value;
  return tuxQuantizeBin(v, lo, hi, props.bins);
}

function cellClass(v: number | null): string {
  if (v === null) return "tux-chart-heatmap__cell tux-chart-heatmap__cell--null";
  const stop = RAMP_STOPS[props.bins]![cellBin(v)]!;
  return `tux-chart-heatmap__cell tux-chart-heatmap__cell--s${stop}`;
}

function cellRect(rowIdx: number, colIdx: number): { x: number; y: number; w: number; h: number } {
  // 1px gutter between cells so the matrix reads as cells, not a
  // continuous field (the choropleth-legend convention).
  return {
    x: r2(PAD_LEFT + colIdx * cellW.value + 0.5),
    y: r2(PAD_TOP + rowIdx * cellH.value + 0.5),
    w: r2(Math.max(0, cellW.value - 1)),
    h: r2(Math.max(0, cellH.value - 1)),
  };
}

// Column labels: auto-thin dense axes (a 24-hour axis prints every
// 2nd–3rd label instead of shingling).
const colEvery = computed(() => {
  if (props.colLabelEvery > 0) return props.colLabelEvery;
  return Math.max(1, Math.ceil(props.cols.length / 12));
});

// Legend bins — equal intervals over the extent, printed as ranges.
const legendBins = computed(() => {
  const [lo, hi] = extent.value;
  const span = hi - lo;
  return RAMP_STOPS[props.bins]!.map((stop, i) => ({
    stop,
    from: lo + (span * i) / props.bins,
    to: lo + (span * (i + 1)) / props.bins,
  }));
});

// Auto SR summary — includes the peak cell so a non-visual reader
// gets the headline without walking 168 cells.
const ariaSummary = computed(() => {
  if (props.ariaSummary) return props.ariaSummary;
  const [lo, hi] = extent.value;
  let peakRow = 0;
  let peakCol = 0;
  let peak = -Infinity;
  props.values.forEach((row, r) => {
    row.forEach((v, c) => {
      if (v !== null && v > peak) {
        peak = v;
        peakRow = r;
        peakCol = c;
      }
    });
  });
  const unitsTrail = props.units ? ` ${props.units}` : "";
  return `Heatmap: ${props.rows.length} rows by ${props.cols.length} columns, low ${lo.toFixed(props.decimals)}, high ${hi.toFixed(props.decimals)}${unitsTrail}, peak at ${props.rows[peakRow]} · ${props.cols[peakCol]}.`;
});

// ----- Hover + 2-D roving cursor ----------------------------------
// The family contract (components.md "Chart tooltips") with the one
// matrix-shaped extension: the cursor moves in two dimensions, so
// Up/Down walk rows instead of aliasing Left/Right. Single tab stop;
// Escape clears; every change emits `hover`.
const active = ref<{ r: number; c: number } | null>(null);

function setActive(next: { r: number; c: number } | null) {
  if (next?.r === active.value?.r && next?.c === active.value?.c) return;
  active.value = next;
  if (next === null) {
    emit("hover", null);
    return;
  }
  emit("hover", {
    row: next.r,
    col: next.c,
    rowLabel: props.rows[next.r] ?? "",
    colLabel: props.cols[next.c] ?? "",
    value: props.values[next.r]?.[next.c] ?? null,
  });
}

function onCellMove(e: PointerEvent) {
  if (!props.tooltip) return;
  const svg = e.currentTarget as SVGSVGElement;
  const rect = svg.getBoundingClientRect();
  const c = tuxIndexFromPointer({
    clientX: e.clientX,
    rectLeft: rect.left,
    rectWidth: rect.width,
    viewWidth: props.width,
    padLeft: PAD_LEFT,
    innerWidth: innerW.value,
    count: props.cols.length,
    mode: "band",
  });
  const r = tuxIndexFromPointer({
    clientX: e.clientY,
    rectLeft: rect.top,
    rectWidth: rect.height,
    viewWidth: props.height,
    padLeft: PAD_TOP,
    innerWidth: innerH.value,
    count: props.rows.length,
    mode: "band",
  });
  if (r !== null && c !== null) setActive({ r, c });
}

function onCellLeave() {
  setActive(null);
}

function onCellKey(e: KeyboardEvent) {
  if (!props.tooltip) return;
  const nR = props.rows.length;
  const nC = props.cols.length;
  if (nR === 0 || nC === 0) return;
  const moves: Record<string, [number, number]> = {
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1],
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
  };
  const move = moves[e.key];
  if (move) {
    e.preventDefault();
    const cur = active.value ?? { r: Math.floor(nR / 2), c: Math.floor(nC / 2) };
    setActive({
      r: Math.max(0, Math.min(nR - 1, cur.r + move[0])),
      c: Math.max(0, Math.min(nC - 1, cur.c + move[1])),
    });
  } else if (e.key === "Escape") {
    setActive(null);
  }
}

const tooltipPayload = computed(() => {
  if (active.value === null) return null;
  const { r, c } = active.value;
  return {
    rowLabel: props.rows[r] ?? "",
    colLabel: props.cols[c] ?? "",
    value: props.values[r]?.[c] ?? null,
  };
});

const tooltipAnchorPercent = computed(() => {
  if (active.value === null) return 0;
  return ((PAD_LEFT + (active.value.c + 0.5) * cellW.value) / props.width) * 100;
});

const tooltipTopPercent = computed(() => {
  if (active.value === null) return 0;
  return ((PAD_TOP + active.value.r * cellH.value) / props.height) * 100;
});
</script>

<template>
  <figure
    class="tux-chart-heatmap"
    role="figure"
    :aria-label="ariaSummary"
    :data-ramp="ramp"
  >
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      :width="width"
      :height="height"
      preserveAspectRatio="xMidYMid meet"
      class="tux-chart-heatmap__svg"
    >
      <!-- Cells -->
      <g class="tux-chart-heatmap__cells">
        <template v-for="(row, r) in values" :key="`r-${r}`">
          <template v-for="(v, c) in row" :key="`c-${r}-${c}`">
            <rect
              :x="cellRect(r, c).x"
              :y="cellRect(r, c).y"
              :width="cellRect(r, c).w"
              :height="cellRect(r, c).h"
              :class="cellClass(v)"
              :style="`--tux-chart-stagger-index: ${c};`"
            >
              <title>{{ rows[r] }} · {{ cols[c] }}: {{ v === null ? "No data" : format(v) }}</title>
            </rect>
            <text
              v-if="valueLabels && v !== null"
              :x="r2(cellRect(r, c).x + cellRect(r, c).w / 2)"
              :y="r2(cellRect(r, c).y + cellRect(r, c).h / 2 + 3.5)"
              text-anchor="middle"
              class="tux-chart-heatmap__cell-label"
            >
              {{ format(v) }}
            </text>
          </template>
        </template>
      </g>

      <!-- Row labels -->
      <g class="tux-chart-heatmap__row-labels">
        <text
          v-for="(label, r) in rows"
          :key="`rl-${r}`"
          :x="PAD_LEFT - 8"
          :y="r2(PAD_TOP + (r + 0.5) * cellH + 4)"
          text-anchor="end"
        >
          {{ label }}
        </text>
      </g>

      <!-- Column labels (auto-thinned on dense axes) -->
      <g class="tux-chart-heatmap__col-labels">
        <template v-for="(label, c) in cols" :key="`cl-${c}`">
          <text
            v-if="c % colEvery === 0"
            :x="r2(PAD_LEFT + (c + 0.5) * cellW)"
            :y="PAD_TOP + innerH + 18"
            text-anchor="middle"
          >
            {{ label }}
          </text>
        </template>
      </g>

      <!-- Hover layer: active-cell ring + capture rect -->
      <g v-if="tooltip" class="tux-chart-heatmap__hover-layer">
        <rect
          v-if="active"
          :x="cellRect(active.r, active.c).x"
          :y="cellRect(active.r, active.c).y"
          :width="cellRect(active.r, active.c).w"
          :height="cellRect(active.r, active.c).h"
          class="tux-chart-heatmap__hover-ring"
        />
        <rect
          :x="PAD_LEFT"
          :y="PAD_TOP"
          :width="innerW"
          :height="innerH"
          class="tux-chart-heatmap__hover-capture"
          tabindex="0"
          role="img"
          :aria-label="`Matrix, ${rows.length} rows by ${cols.length} columns; use arrow keys to read each cell.`"
          @pointermove="onCellMove"
          @pointerleave="onCellLeave"
          @keydown="onCellKey"
        />
      </g>
    </svg>

    <!-- Tooltip card; flips left past 60% width (family contract). -->
    <div
      v-if="tooltip && tooltipPayload"
      class="tux-chart-heatmap__tooltip"
      :class="{ 'tux-chart-heatmap__tooltip--flip': tooltipAnchorPercent > 60 }"
      role="status"
      aria-live="polite"
      :style="{
        left: `calc(${tooltipAnchorPercent}% + ${tooltipAnchorPercent > 60 ? '-12px' : '12px'})`,
        top: `${tooltipTopPercent}%`,
      }"
    >
      <p class="tux-chart-heatmap__tooltip-label">
        {{ tooltipPayload.rowLabel }} · {{ tooltipPayload.colLabel }}
      </p>
      <p class="tux-chart-heatmap__tooltip-value">
        <template v-if="tooltipPayload.value === null">No data</template>
        <template v-else>
          {{ format(tooltipPayload.value) }}<span v-if="units" class="tux-chart-heatmap__tooltip-units">&nbsp;{{ units }}</span>
        </template>
      </p>
    </div>

    <!-- Binned-ramp legend: ranges printed, never color alone. -->
    <ul v-if="legend" class="tux-chart-heatmap__legend">
      <li
        v-for="bin in legendBins"
        :key="bin.stop"
        :class="`tux-chart-heatmap__legend-item tux-chart-heatmap__legend-item--s${bin.stop}`"
      >
        <span class="tux-chart-heatmap__legend-swatch" />
        <span class="tux-chart-heatmap__legend-range">{{ format(Number(bin.from.toFixed(decimals))) }}–{{ format(Number(bin.to.toFixed(decimals))) }}</span>
      </li>
      <li v-if="values.some((row) => row.includes(null))" class="tux-chart-heatmap__legend-item tux-chart-heatmap__legend-item--null">
        <span class="tux-chart-heatmap__legend-swatch" />
        <span class="tux-chart-heatmap__legend-range">No data</span>
      </li>
    </ul>
  </figure>
</template>

<style scoped>
.tux-chart-heatmap {
  margin: 0;
  position: relative;
  font-family: var(--font-body);
}

.tux-chart-heatmap__svg {
  display: block;
  max-width: 100%;
  height: auto;
}

/* Sequential ramps — the same 5 stops the choropleth family uses.
   Fallback hexes mirror design/tokens.json's light theme. */
[data-ramp="maroon"] .tux-chart-heatmap__cell--s1,
[data-ramp="maroon"] .tux-chart-heatmap__legend-item--s1 { --tux-heat-stop: var(--map-seq-maroon-1, #f1e4e0); }
[data-ramp="maroon"] .tux-chart-heatmap__cell--s2,
[data-ramp="maroon"] .tux-chart-heatmap__legend-item--s2 { --tux-heat-stop: var(--map-seq-maroon-2, #ddb7ac); }
[data-ramp="maroon"] .tux-chart-heatmap__cell--s3,
[data-ramp="maroon"] .tux-chart-heatmap__legend-item--s3 { --tux-heat-stop: var(--map-seq-maroon-3, #c58675); }
[data-ramp="maroon"] .tux-chart-heatmap__cell--s4,
[data-ramp="maroon"] .tux-chart-heatmap__legend-item--s4 { --tux-heat-stop: var(--map-seq-maroon-4, #9e483a); }
[data-ramp="maroon"] .tux-chart-heatmap__cell--s5,
[data-ramp="maroon"] .tux-chart-heatmap__legend-item--s5 { --tux-heat-stop: var(--map-seq-maroon-5, #500000); }

[data-ramp="slate"] .tux-chart-heatmap__cell--s1,
[data-ramp="slate"] .tux-chart-heatmap__legend-item--s1 { --tux-heat-stop: var(--map-seq-slate-1, #e2e7ec); }
[data-ramp="slate"] .tux-chart-heatmap__cell--s2,
[data-ramp="slate"] .tux-chart-heatmap__legend-item--s2 { --tux-heat-stop: var(--map-seq-slate-2, #b7c2cc); }
[data-ramp="slate"] .tux-chart-heatmap__cell--s3,
[data-ramp="slate"] .tux-chart-heatmap__legend-item--s3 { --tux-heat-stop: var(--map-seq-slate-3, #7e94a4); }
[data-ramp="slate"] .tux-chart-heatmap__cell--s4,
[data-ramp="slate"] .tux-chart-heatmap__legend-item--s4 { --tux-heat-stop: var(--map-seq-slate-4, #52677a); }
[data-ramp="slate"] .tux-chart-heatmap__cell--s5,
[data-ramp="slate"] .tux-chart-heatmap__legend-item--s5 { --tux-heat-stop: var(--map-seq-slate-5, #283544); }

.tux-chart-heatmap__cell {
  fill: var(--tux-heat-stop, var(--surface-border));
  transition: fill 120ms ease-out;
}

.tux-chart-heatmap__cell--null {
  fill: transparent;
  stroke: var(--surface-border);
  stroke-width: 1;
  stroke-dasharray: 2 3;
}

.tux-chart-heatmap__cell-label {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  fill: var(--text-primary);
  /* Page-surface halo keeps the numeral legible on every ramp stop in
     every theme — the dark theme reverses ramp luminance, so any
     stop-indexed ink split would invert there. */
  stroke: var(--surface-page);
  stroke-width: 2.5;
  paint-order: stroke;
  pointer-events: none;
}

.tux-chart-heatmap__row-labels text,
.tux-chart-heatmap__col-labels text {
  fill: var(--text-secondary);
  font-size: 11px;
}

/* ---- Hover layer ---- */
.tux-chart-heatmap__hover-capture {
  fill: transparent;
  cursor: crosshair;
  outline: none;
}

.tux-chart-heatmap__hover-capture:focus-visible {
  fill: color-mix(in srgb, var(--brand-primary) 4%, transparent);
}

.tux-chart-heatmap__hover-ring {
  fill: none;
  stroke: var(--brand-accent, #ddac37);
  stroke-width: 2;
  pointer-events: none;
}

.tux-chart-heatmap__tooltip {
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

.tux-chart-heatmap__tooltip--flip {
  transform: translateX(-100%);
}

.tux-chart-heatmap__tooltip-label {
  font-weight: 600;
  margin: 0 0 0.125rem 0;
  color: var(--text-primary);
}

.tux-chart-heatmap__tooltip-value {
  margin: 0;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: var(--text-primary);
}

.tux-chart-heatmap__tooltip-units {
  font-family: var(--font-body);
  font-weight: 400;
  color: var(--text-muted);
}

/* ---- Legend ---- */
.tux-chart-heatmap__legend {
  list-style: none;
  margin: 0.5rem 0 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.75rem;
}

.tux-chart-heatmap__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--text-secondary);
}

.tux-chart-heatmap__legend-swatch {
  background: var(--tux-heat-stop);
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.tux-chart-heatmap__legend-item--null .tux-chart-heatmap__legend-swatch {
  background: transparent;
  border: 1px dashed var(--surface-border);
}

.tux-chart-heatmap__legend-range {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .tux-chart-heatmap__cell {
    transition: none;
  }
}
</style>
