<script setup lang="ts">
/**
 * TuxChartWaterfall — native SVG cumulative step-delta bridge chart.
 *
 * Models sequential attribution from an initial baseline through signed
 * positive/negative step deltas to intermediate subtotals and a final
 * cumulative total. Supports `polarity="invert"` for safety, delay, or
 * cost-reduction waterfalls where negative deltas represent improvements.
 */
import { computed } from "vue";
import { useTuxChartHover } from "../composables/useTuxChartHover";
import { useTuxVisionPrefs } from "../composables/useTuxVisionPrefs";
import {
  TUX_CHART_MARGINS,
  tuxExtent,
  tuxIndexFromPointer,
  tuxNiceTicks,
} from "../utils/tuxChartScale";

export interface WaterfallStep {
  key: string;
  label: string;
  value: number;
  kind?: "start" | "delta" | "subtotal" | "total";
}

export interface WaterfallHoverPayload {
  index: number;
  key: string;
  label: string;
  kind: "start" | "delta" | "subtotal" | "total";
  value: number;
  cumulative: number;
  y0: number;
  y1: number;
}

export interface TuxChartWaterfallProps {
  steps: WaterfallStep[];
  width?: number;
  height?: number;
  /** When `"invert"`, negative deltas are colored favorable/good and positive deltas warning/adverse. */
  polarity?: "direct" | "invert";
  units?: string;
  format?: (n: number) => string;
  gridlines?: boolean;
  ariaSummary?: string;
  tooltip?: boolean;
}

const props = withDefaults(defineProps<TuxChartWaterfallProps>(), {
  width: 640,
  height: 300,
  polarity: "direct",
  units: undefined,
  format: (n: number) => n.toLocaleString(),
  gridlines: true,
  ariaSummary: undefined,
  tooltip: true,
});

const emit = defineEmits<{
  hover: [payload: WaterfallHoverPayload | null];
}>();

const { prefs: visionPrefs } = useTuxVisionPrefs();

const PAD_TOP = 24;
const PAD_RIGHT = TUX_CHART_MARGINS.right;
const PAD_BOTTOM = 42;
const PAD_LEFT = 54;

const f2 = (n: number): number => Math.round(n * 100) / 100;

const innerW = computed(() => Math.max(80, props.width - PAD_LEFT - PAD_RIGHT));
const innerH = computed(() => Math.max(60, props.height - PAD_TOP - PAD_BOTTOM));

function formatSignedDelta(n: number): string {
  if (n > 0) {
    const formatted = props.format(n);
    return formatted.startsWith("+") ? formatted : `+${formatted}`;
  }
  if (n < 0) {
    return `-${props.format(Math.abs(n))}`;
  }
  return props.format(0);
}

function formatWithUnits(text: string): string {
  return props.units ? `${text} ${props.units}` : text;
}

type StepTone = "anchor" | "total" | "favorable" | "adverse" | "neutral";

interface ComputedStep {
  index: number;
  key: string;
  label: string;
  kind: "start" | "delta" | "subtotal" | "total";
  rawDelta: number;
  cumulative: number;
  y0: number;
  y1: number;
  tone: StepTone;
  displayLabel: string;
}

const computedSteps = computed<ComputedStep[]>(() => {
  let running = 0;
  return props.steps.map((step, index) => {
    const kind = step.kind ?? "delta";
    const val = Number.isFinite(step.value) ? step.value : 0;

    let y0: number;
    let y1: number;
    let rawDelta = val;

    if (kind === "start") {
      y0 = 0;
      y1 = val;
      running = val;
    } else if (kind === "subtotal" || kind === "total") {
      const resolved = val !== 0 ? val : running;
      y0 = 0;
      y1 = resolved;
      running = resolved;
      rawDelta = resolved;
    } else {
      y0 = running;
      y1 = running + val;
      running = y1;
    }

    let tone: StepTone;
    if (kind === "total") {
      tone = "total";
    } else if (kind === "start" || kind === "subtotal") {
      tone = "anchor";
    } else if (val === 0) {
      tone = "neutral";
    } else if (props.polarity === "invert") {
      tone = val < 0 ? "favorable" : "adverse";
    } else {
      tone = val > 0 ? "favorable" : "adverse";
    }

    const displayLabel =
      kind === "delta" ? formatSignedDelta(val) : props.format(running);

    return {
      index,
      key: step.key,
      label: step.label,
      kind,
      rawDelta,
      cumulative: running,
      y0,
      y1,
      tone,
      displayLabel,
    };
  });
});

const yDomain = computed(() => {
  const vals: number[] = [0];
  for (const s of computedSteps.value) {
    vals.push(s.y0, s.y1);
  }
  const [rawMin, rawMax] = tuxExtent(vals);
  const span = Math.max(1, rawMax - rawMin);
  const hasDownwardNearMin = computedSteps.value.some(
    (s) => s.y1 < s.y0 && Math.min(s.y0, s.y1) <= rawMin + span * 0.08,
  );
  const min = rawMin < 0 || hasDownwardNearMin ? rawMin - span * 0.16 : 0;
  const max = rawMax + span * 0.16;
  return { min, max: max > min ? max : min + 1 };
});

const yTickValues = computed(() =>
  tuxNiceTicks(yDomain.value.min, yDomain.value.max, 5),
);

function yCoord(v: number): number {
  const { min, max } = yDomain.value;
  const ratio = (v - min) / (max - min || 1);
  return f2(PAD_TOP + innerH.value - ratio * innerH.value);
}

const bandWidth = computed(() =>
  innerW.value / Math.max(1, computedSteps.value.length),
);

const barWidth = computed(() => Math.max(8, f2(bandWidth.value * 0.58)));

function barGeometry(s: ComputedStep) {
  const slotX = PAD_LEFT + s.index * bandWidth.value;
  const x = f2(slotX + (bandWidth.value - barWidth.value) / 2);
  const py0 = yCoord(s.y0);
  const py1 = yCoord(s.y1);
  const top = Math.min(py0, py1);
  const bottom = Math.max(py0, py1);
  const h = Math.max(2, f2(bottom - top));
  const isDownward = s.kind === "delta" ? s.rawDelta < 0 : s.y1 < 0;
  const labelY = isDownward ? f2(bottom + 13) : f2(top - 6);

  return {
    slotX: f2(slotX),
    slotCenter: f2(slotX + bandWidth.value / 2),
    x,
    y: f2(top),
    w: barWidth.value,
    h,
    bridgeY: py1,
    labelY,
  };
}

const barGeometries = computed(() =>
  computedSteps.value.map((s) => barGeometry(s)),
);

const connectors = computed(() => {
  const steps = computedSteps.value;
  const geoms = barGeometries.value;
  const out: Array<{ key: string; x1: number; x2: number; y: number }> = [];
  for (let i = 0; i < steps.length - 1; i++) {
    const gCurr = geoms[i]!;
    const gNext = geoms[i + 1]!;
    out.push({
      key: `${steps[i]!.key}-${steps[i + 1]!.key}`,
      x1: f2(gCurr.x + gCurr.w),
      x2: gNext.x,
      y: gCurr.bridgeY,
    });
  }
  return out;
});

const zeroY = computed(() => {
  const { min, max } = yDomain.value;
  if (min <= 0 && max >= 0) return yCoord(0);
  return null;
});

const computedAriaSummary = computed(() => {
  if (props.ariaSummary) return props.ariaSummary;
  const steps = computedSteps.value;
  if (steps.length === 0) return "Waterfall chart: 0 steps.";
  const first = steps[0]!;
  const last = steps[steps.length - 1]!;
  return `Waterfall chart: ${steps.length} steps from ${first.label} (${formatWithUnits(props.format(first.cumulative))}) to ${last.label} (${formatWithUnits(props.format(last.cumulative))}). Use Left and Right arrow keys to inspect each step.`;
});

function kindBadgeLabel(kind: ComputedStep["kind"]): string {
  switch (kind) {
    case "start":
      return "Baseline";
    case "subtotal":
      return "Subtotal";
    case "total":
      return "Total";
    default:
      return "Step delta";
  }
}

// ----- Hover & Single-Tab-Stop Keyboard Roving Cursor ----------------
const {
  hoverIndex,
  setHoverIndex,
  onPointerMove: onWaterfallMove,
  onPointerLeave: onWaterfallLeave,
  onKeydown: onWaterfallKey,
} = useTuxChartHover({
  count: () => computedSteps.value.length,
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
      count: computedSteps.value.length,
      mode: "band",
    });
  },
  onChange(idx) {
    if (idx === null) {
      emit("hover", null);
      return;
    }
    const step = computedSteps.value[idx];
    if (!step) return;
    emit("hover", {
      index: step.index,
      key: step.key,
      label: step.label,
      kind: step.kind,
      value: step.rawDelta,
      cumulative: step.cumulative,
      y0: step.y0,
      y1: step.y1,
    });
  },
});

function onBarEnter(idx: number) {
  if (props.tooltip) setHoverIndex(idx);
}

const activeStep = computed(() =>
  hoverIndex.value === null ? null : computedSteps.value[hoverIndex.value] ?? null,
);

const activeGeom = computed(() =>
  hoverIndex.value === null ? null : barGeometries.value[hoverIndex.value] ?? null,
);

const tooltipAnchorPercent = computed(() => {
  if (!activeGeom.value) return 0;
  return f2((activeGeom.value.slotCenter / Math.max(1, props.width)) * 100);
});
</script>

<template>
  <div
    class="tux-chart-waterfall"
    :class="[visionPrefs.cvdMode !== 'brand' && 'tux-chart--cvd']"
    :data-polarity="polarity"
    :data-cvd-mode="visionPrefs.cvdMode"
  >
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      :width="width"
      :height="height"
      preserveAspectRatio="xMidYMid meet"
      class="tux-chart-waterfall__svg"
      tabindex="0"
      role="img"
      :aria-label="computedAriaSummary"
      @pointermove="onWaterfallMove"
      @pointerleave="onWaterfallLeave"
      @keydown="onWaterfallKey"
    >
      <!-- Gridlines -->
      <g v-if="gridlines" class="tux-chart-waterfall__gridlines">
        <line
          v-for="(t, i) in yTickValues"
          :key="`gl-${i}`"
          :x1="PAD_LEFT"
          :x2="PAD_LEFT + innerW"
          :y1="yCoord(t)"
          :y2="yCoord(t)"
        />
      </g>

      <!-- Zero baseline -->
      <line
        v-if="zeroY !== null"
        :x1="PAD_LEFT"
        :x2="PAD_LEFT + innerW"
        :y1="zeroY"
        :y2="zeroY"
        class="tux-chart-waterfall__zero-line"
      />

      <!-- Y-axis ticks -->
      <g class="tux-chart-waterfall__axis">
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

      <!-- Active column highlight wash -->
      <rect
        v-if="tooltip && activeGeom"
        :x="activeGeom.slotX"
        :y="PAD_TOP"
        :width="f2(bandWidth)"
        :height="innerH"
        class="tux-chart-waterfall__hover-wash"
      />

      <!-- Dashed step-to-step bridge connectors -->
      <g class="tux-chart-waterfall__connectors">
        <line
          v-for="conn in connectors"
          :key="`conn-${conn.key}`"
          :x1="conn.x1"
          :x2="conn.x2"
          :y1="conn.y"
          :y2="conn.y"
          stroke-dasharray="3 3"
          class="tux-chart-waterfall__connector"
        />
      </g>

      <!-- Step Bars & Signed Value Labels -->
      <g class="tux-chart-waterfall__bars">
        <g
          v-for="(step, i) in computedSteps"
          :key="step.key"
          class="tux-chart-waterfall__step"
        >
          <rect
            :x="barGeometries[i]!.x"
            :y="barGeometries[i]!.y"
            :width="barGeometries[i]!.w"
            :height="barGeometries[i]!.h"
            rx="2"
            :class="[
              'tux-chart-waterfall__bar',
              `tux-chart-waterfall__bar--${step.tone}`,
              hoverIndex === i && 'tux-chart-waterfall__bar--active',
            ]"
            @pointerenter="onBarEnter(i)"
          >
            <title>{{ step.label }} ({{ kindBadgeLabel(step.kind) }}): {{ formatWithUnits(step.displayLabel) }} · Cumulative {{ formatWithUnits(format(step.cumulative)) }}</title>
          </rect>

          <text
            :x="barGeometries[i]!.slotCenter"
            :y="barGeometries[i]!.labelY"
            text-anchor="middle"
            :class="[
              'tux-chart-waterfall__value-label',
              `tux-chart-waterfall__value-label--${step.tone}`,
            ]"
          >
            {{ step.displayLabel }}
          </text>

          <text
            :x="barGeometries[i]!.slotCenter"
            :y="PAD_TOP + innerH + 18"
            text-anchor="middle"
            class="tux-chart-waterfall__cat-label"
          >
            {{ step.label }}
          </text>
        </g>
      </g>
    </svg>

    <!-- Branded Auto-Flipping Tooltip Card -->
    <div
      v-if="tooltip && activeStep"
      class="tux-chart-tooltip tux-chart-waterfall__tooltip"
      :class="{ 'tux-chart-tooltip--flip': tooltipAnchorPercent > 60 }"
      role="status"
      aria-live="polite"
      :style="{
        left: `calc(${tooltipAnchorPercent}% + ${tooltipAnchorPercent > 60 ? '-12px' : '12px'})`,
        top: '10px',
      }"
    >
      <div class="tux-chart-waterfall__tooltip-head">
        <span
          :class="[
            'tux-chart-waterfall__tooltip-swatch',
            `tux-chart-waterfall__bar--${activeStep.tone}`,
          ]"
        />
        <span class="tux-chart-waterfall__tooltip-label">{{ activeStep.label }}</span>
        <span class="tux-chart-waterfall__tooltip-kind">{{ kindBadgeLabel(activeStep.kind) }}</span>
      </div>
      <dl class="tux-chart-waterfall__tooltip-dl">
        <div v-if="activeStep.kind === 'delta'">
          <dt>Step change</dt>
          <dd>{{ formatWithUnits(activeStep.displayLabel) }}</dd>
        </div>
        <div>
          <dt>Cumulative</dt>
          <dd>{{ formatWithUnits(format(activeStep.cumulative)) }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<style scoped>
.tux-chart-waterfall {
  position: relative;
  width: 100%;
  font-family: var(--font-body);
  line-height: 1.5;
}

.tux-chart-waterfall__svg {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
}

.tux-chart-waterfall__svg:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-chart-waterfall__gridlines line {
  stroke: var(--surface-border);
  stroke-width: 1;
  stroke-dasharray: 2 4;
}

.tux-chart-waterfall__zero-line {
  stroke: var(--text-muted);
  stroke-width: 1;
  opacity: 0.55;
}

.tux-chart-waterfall__axis text {
  fill: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}

.tux-chart-waterfall__hover-wash {
  fill: var(--wash-brand-4);
  pointer-events: none;
}

.tux-chart-waterfall__connector {
  stroke: var(--text-muted);
  stroke-width: 1;
  opacity: 0.7;
  pointer-events: none;
}

.tux-chart-waterfall__bar {
  stroke: var(--surface-page);
  stroke-width: 1;
  transition: opacity 120ms ease, stroke-width 120ms ease;
}

.tux-chart-waterfall__bar--anchor {
  fill: var(--chart-2);
  background: var(--chart-2);
}

.tux-chart-waterfall__bar--total {
  fill: var(--brand-primary);
  background: var(--brand-primary);
}

.tux-chart-waterfall__bar--favorable {
  fill: var(--color-success);
  background: var(--color-success);
}

.tux-chart-waterfall__bar--adverse {
  fill: var(--color-error);
  background: var(--color-error);
}

.tux-chart-waterfall__bar--neutral {
  fill: var(--text-muted);
  background: var(--text-muted);
}

.tux-chart--cvd .tux-chart-waterfall__bar--anchor {
  fill: var(--chart-cvd-1);
  background: var(--chart-cvd-1);
}

.tux-chart--cvd .tux-chart-waterfall__bar--total {
  fill: var(--chart-cvd-8);
  background: var(--chart-cvd-8);
}

.tux-chart--cvd .tux-chart-waterfall__bar--favorable {
  fill: var(--chart-cvd-3);
  background: var(--chart-cvd-3);
}

.tux-chart--cvd .tux-chart-waterfall__bar--adverse {
  fill: var(--chart-cvd-6);
  background: var(--chart-cvd-6);
}

.tux-chart-waterfall__bar--active {
  stroke: var(--text-primary);
  stroke-width: 2;
}

.tux-chart-waterfall__value-label {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  fill: var(--text-primary);
  pointer-events: none;
}

.tux-chart-waterfall__value-label--favorable {
  fill: var(--color-success);
}

.tux-chart-waterfall__value-label--adverse {
  fill: var(--color-error);
}

.tux-chart-waterfall__value-label--total {
  fill: var(--brand-primary);
}

.tux-chart-waterfall__cat-label {
  fill: var(--text-secondary);
  font-size: 11px;
  pointer-events: none;
}

.tux-chart-waterfall__tooltip-head {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  margin-bottom: var(--space-4);
}

.tux-chart-waterfall__tooltip-swatch {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.tux-chart-waterfall__tooltip-label {
  font-weight: 700;
  color: var(--text-primary);
}

.tux-chart-waterfall__tooltip-kind {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-muted);
}

.tux-chart-waterfall__tooltip-dl {
  margin: 0;
  display: grid;
  grid-template-columns: auto auto;
  gap: var(--space-2) var(--space-12);
}

.tux-chart-waterfall__tooltip-dl > div {
  display: contents;
}

.tux-chart-waterfall__tooltip-dl dt {
  color: var(--text-muted);
  font-size: 0.6875rem;
}

.tux-chart-waterfall__tooltip-dl dd {
  margin: 0;
  text-align: right;
  font-family: var(--font-mono);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
}

@media (prefers-reduced-motion: reduce) {
  .tux-chart-waterfall__bar {
    transition: none;
  }
}
</style>
