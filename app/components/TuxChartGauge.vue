<script setup lang="ts">
/**
 * TuxChartGauge — 270° arc gauge for single-target metrics.
 *
 * Use sparingly — research dashboards rarely need gauges (they
 * imply a single normative target). Good fits:
 *   - Token-utilization meter when the limit is hard ("87% of
 *     8K context used").
 *   - SLA / uptime where 99% is the target floor.
 *   - Compliance score against a published target.
 *
 * Bad fits: anything where the "right" value depends on context.
 * For those, use TuxBigStat + TuxSparkline.
 *
 * Two flavors:
 *   - **Arc gauge** (default) — 270° arc with a needle at `value`.
 *     Optional tone bands behind the arc mark target zones
 *     (red 0-40 / amber 40-70 / green 70-100).
 *   - **Radial progress** (`variant="progress"`) — single filled
 *     arc representing percent-of-max; no needle, no bands. Better
 *     for "X% used" idioms where there's no qualitative target zones.
 *
 * Geometry: 270° sweep from 7 o'clock (bottom-left) to 5 o'clock
 * (bottom-right), passing through 12 o'clock at the top. Needle
 * pivots at the center.
 *
 * Usage:
 *   <tux-chart-gauge
 *     :value="78"
 *     :min="0"
 *     :max="100"
 *     center-label="On-time delivery"
 *     :center-value="78"
 *     units="%"
 *   />
 */
import { computed } from "vue";

interface Band {
  /** Inclusive lower bound (in same scale as value). */
  from: number;
  /** Inclusive upper bound. */
  to: number;
  /** Palette index 1..8. */
  toneIndex?: number;
  /** Visual intent — overrides toneIndex with a status color. */
  intent?: "ok" | "warn" | "alert";
  label?: string;
}

interface Props {
  /** Current value. */
  value: number;
  /** Minimum scale value. Default 0. */
  min?: number;
  /** Maximum scale value. Default 100. */
  max?: number;
  /** Render width in CSS px. Square layout. */
  size?: number;
  /** Variant. "arc" = needle + optional bands; "progress" = single
   *  fill arc. Default "arc". */
  variant?: "arc" | "progress";
  /** Optional bands to render behind the arc (arc variant only). */
  bands?: Band[];
  /** Center label (above the value). */
  centerLabel?: string;
  /** Center value (large headline). Omit to hide. */
  centerValue?: string | number;
  /** Units suffix appended to centerValue + SR ("%", " kWh", etc). */
  units?: string;
  /** Number formatter. */
  format?: (n: number) => string;
  decimals?: number;
  /** Override the auto-derived SR summary. */
  ariaSummary?: string;
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  size: 240,
  variant: "arc",
  bands: () => [],
  centerLabel: undefined,
  centerValue: undefined,
  units: undefined,
  format: (n: number) => n.toLocaleString(),
  decimals: 1,
  ariaSummary: undefined,
});

const cx = computed(() => props.size / 2);
const cy = computed(() => props.size / 2);
const radius = computed(() => props.size / 2 - 22);
const strokeW = computed(() => Math.max(10, props.size * 0.08));
const trackW = computed(() => strokeW.value - 2);

// 270° sweep from -135° (7 o'clock) to +135° (5 o'clock), measured
// from the 12 o'clock origin and increasing clockwise (so we work
// in standard polar-but-y-down SVG coords).
const START_ANGLE = -135 * (Math.PI / 180);
const END_ANGLE = 135 * (Math.PI / 180);
const SWEEP = END_ANGLE - START_ANGLE; // 4.71... rad = 270°

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function valueToAngle(v: number): number {
  const t = (clamp(v, props.min, props.max) - props.min) / (props.max - props.min || 1);
  return START_ANGLE + t * SWEEP;
}

function polar(angle: number, r: number): { x: number; y: number } {
  return {
    x: cx.value + r * Math.sin(angle),
    y: cy.value - r * Math.cos(angle),
  };
}

function arcPath(startAngle: number, endAngle: number, r: number): string {
  const start = polar(startAngle, r);
  const end = polar(endAngle, r);
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${start.x},${start.y} A ${r},${r} 0 ${large} 1 ${end.x},${end.y}`;
}

const trackPath = computed(() => arcPath(START_ANGLE, END_ANGLE, radius.value));

const fillPath = computed(() => {
  const end = valueToAngle(props.value);
  return arcPath(START_ANGLE, end, radius.value);
});

interface RenderedBand {
  path: string;
  toneClass: string;
}

const renderedBands = computed<RenderedBand[]>(() => {
  if (props.variant !== "arc") return [];
  return props.bands.map((b) => {
    const sa = valueToAngle(b.from);
    const ea = valueToAngle(b.to);
    let toneClass = "";
    if (b.intent === "ok") toneClass = "tux-chart-gauge__band--ok";
    else if (b.intent === "warn") toneClass = "tux-chart-gauge__band--warn";
    else if (b.intent === "alert") toneClass = "tux-chart-gauge__band--alert";
    else {
      const tone = Math.max(1, Math.min(8, b.toneIndex ?? 1));
      toneClass = `tux-chart-gauge__band--c${tone}`;
    }
    return { path: arcPath(sa, ea, radius.value), toneClass };
  });
});

// Needle (arc variant only).
const needleAngle = computed(() => valueToAngle(props.value));
const needleEnd = computed(() => polar(needleAngle.value, radius.value - strokeW.value / 2 - 4));

// Tick marks at min + max for legibility.
const minTick = computed(() => polar(START_ANGLE, radius.value + 8));
const maxTick = computed(() => polar(END_ANGLE, radius.value + 8));

const ariaSummary = computed(() => {
  if (props.ariaSummary) return props.ariaSummary;
  const pct = ((props.value - props.min) / (props.max - props.min || 1)) * 100;
  const u = props.units ? props.units : "";
  return `Gauge: ${props.format(props.value)}${u} of ${props.format(props.max)}${u} (${pct.toFixed(props.decimals)}% of scale).`;
});

const fillToneClass = computed(() => {
  // For progress variant, walk a status tone if a single matching
  // band exists; otherwise default to brand-primary.
  if (props.variant !== "progress") return "";
  if (props.bands.length === 0) return "tux-chart-gauge__fill--brand";
  const matching = props.bands.find((b) => props.value >= b.from && props.value <= b.to);
  if (matching?.intent === "ok") return "tux-chart-gauge__fill--ok";
  if (matching?.intent === "warn") return "tux-chart-gauge__fill--warn";
  if (matching?.intent === "alert") return "tux-chart-gauge__fill--alert";
  return "tux-chart-gauge__fill--brand";
});
</script>

<template>
  <figure class="tux-chart-gauge" role="figure" :aria-label="ariaSummary">
    <div class="tux-chart-gauge__wrap">
      <svg
        :viewBox="`0 0 ${size} ${size}`"
        :width="size"
        :height="size"
        preserveAspectRatio="xMidYMid meet"
        class="tux-chart-gauge__svg"
      >
        <!-- Track (always rendered, even in progress variant — sits
             behind the fill as a backing rail). -->
        <path
          :d="trackPath"
          :stroke-width="trackW"
          class="tux-chart-gauge__track"
          fill="none"
        />

        <!-- Bands (arc variant only) -->
        <template v-if="variant === 'arc'">
          <path
            v-for="(b, i) in renderedBands"
            :key="`band-${i}`"
            :d="b.path"
            :class="['tux-chart-gauge__band', b.toneClass]"
            :stroke-width="strokeW"
            fill="none"
          />
        </template>

        <!-- Progress fill (progress variant) -->
        <path
          v-if="variant === 'progress'"
          :d="fillPath"
          :class="['tux-chart-gauge__fill', fillToneClass]"
          :stroke-width="strokeW"
          fill="none"
        />

        <!-- Needle (arc variant) -->
        <template v-if="variant === 'arc'">
          <line
            :x1="cx"
            :y1="cy"
            :x2="needleEnd.x"
            :y2="needleEnd.y"
            class="tux-chart-gauge__needle"
          />
          <circle
            :cx="cx"
            :cy="cy"
            :r="strokeW / 2"
            class="tux-chart-gauge__pivot"
          />
        </template>

        <!-- Min / max ticks -->
        <text
          :x="minTick.x"
          :y="minTick.y + 4"
          text-anchor="middle"
          class="tux-chart-gauge__tick"
        >
          {{ format(min) }}
        </text>
        <text
          :x="maxTick.x"
          :y="maxTick.y + 4"
          text-anchor="middle"
          class="tux-chart-gauge__tick"
        >
          {{ format(max) }}
        </text>
      </svg>

      <!-- Center stat -->
      <div v-if="$slots.center || centerLabel || centerValue !== undefined" class="tux-chart-gauge__center">
        <slot name="center">
          <p v-if="centerLabel" class="tux-chart-gauge__center-label">{{ centerLabel }}</p>
          <p v-if="centerValue !== undefined" class="tux-chart-gauge__center-value">
            <template v-if="typeof centerValue === 'number'">{{ format(centerValue) }}</template>
            <template v-else>{{ centerValue }}</template>
            <span v-if="units" class="tux-chart-gauge__center-units">{{ units }}</span>
          </p>
        </slot>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.tux-chart-gauge {
  margin: 0;
  font-family: var(--font-sans);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.tux-chart-gauge__wrap {
  position: relative;
  display: inline-block;
}

.tux-chart-gauge__svg {
  display: block;
  max-width: 100%;
  height: auto;
}

.tux-chart-gauge__track {
  stroke: var(--surface-sunken);
}

.tux-chart-gauge__band--ok    { stroke: var(--status-success, #6b8e5a); opacity: 0.7; }
.tux-chart-gauge__band--warn  { stroke: var(--status-warning, #c7973c); opacity: 0.7; }
.tux-chart-gauge__band--alert { stroke: var(--status-error,   #a33a3a); opacity: 0.7; }
.tux-chart-gauge__band--c1    { stroke: var(--chart-1, var(--brand-primary)); opacity: 0.55; }
.tux-chart-gauge__band--c2    { stroke: var(--chart-2, #3f5a6f); opacity: 0.55; }
.tux-chart-gauge__band--c3    { stroke: var(--chart-3, #c7973c); opacity: 0.55; }
.tux-chart-gauge__band--c4    { stroke: var(--chart-4, #6b8e5a); opacity: 0.55; }
.tux-chart-gauge__band--c5    { stroke: var(--chart-5, #8c5a3c); opacity: 0.55; }
.tux-chart-gauge__band--c6    { stroke: var(--chart-6, #5c7080); opacity: 0.55; }
.tux-chart-gauge__band--c7    { stroke: var(--chart-7, #a33a3a); opacity: 0.55; }
.tux-chart-gauge__band--c8    { stroke: var(--chart-8, #3c5a87); opacity: 0.55; }

.tux-chart-gauge__fill--brand { stroke: var(--brand-primary); }
.tux-chart-gauge__fill--ok    { stroke: var(--status-success, #6b8e5a); }
.tux-chart-gauge__fill--warn  { stroke: var(--status-warning, #c7973c); }
.tux-chart-gauge__fill--alert { stroke: var(--status-error,   #a33a3a); }

.tux-chart-gauge__needle {
  stroke: var(--text-primary);
  stroke-width: 3;
  stroke-linecap: round;
}

.tux-chart-gauge__pivot {
  fill: var(--text-primary);
}

.tux-chart-gauge__tick {
  fill: var(--text-muted);
  font-size: 10px;
}

.tux-chart-gauge__center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
  /* Push toward the bottom of the dial — the 270° arc opens at the
     bottom, so the center stat reads above that opening. */
  padding-bottom: 0.5rem;
}

.tux-chart-gauge__center-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin: 0;
}

.tux-chart-gauge__center-value {
  font-family: var(--font-display, var(--font-sans));
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.05;
}

.tux-chart-gauge__center-units {
  font-size: 1.125rem;
  font-weight: 600;
  margin-left: 0.125rem;
  color: var(--text-secondary);
}
</style>
