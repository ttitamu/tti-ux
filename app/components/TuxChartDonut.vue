<script setup lang="ts">
/**
 * TuxChartDonut — native SVG donut chart for share-of-total.
 *
 * Categorical composition (browsers, file types, statuses, traffic
 * sources) where the **whole** is meaningful and each slice's share
 * matters more than its absolute value. Pie's better-behaved cousin:
 * the empty center reads as a label slot ("184M total") rather than
 * fighting the slices for attention.
 *
 * Follows [`chart-foundations.md`](../../design/chart-foundations.md):
 *   - Palette walks `--chart-1..8` across slices.
 *   - First slice anchors at 12 o'clock (top), proceeds clockwise.
 *   - Slices below `minSlice%` are folded into a single "Other"
 *     slice (keeps the chart legible at >6 categories).
 *   - End-slice labels on the outside of the donut by default; legend
 *     below for compact tiles.
 *   - Center slot is bind-able: pass a stat total + label inline or
 *     via the `#center` slot.
 *   - Auto SR summary ("Donut chart: 6 categories, largest Active
 *     38% / 184M, smallest Failed 2% / 9M, total 480M").
 *
 * Data shape:
 *   slices: Array<{
 *     key: string,
 *     label: string,
 *     value: number,
 *     toneIndex?: number,  // 1–8; default = position
 *   }>
 *
 * Usage:
 *   <tux-chart-donut
 *     :slices="[
 *       { key: 'active', label: 'Active', value: 184 },
 *       { key: 'queued', label: 'Queued', value: 142 },
 *       { key: 'failed', label: 'Failed', value: 9 },
 *     ]"
 *     center-label="Total scans"
 *     :center-value="335"
 *   />
 */
import { computed } from "vue";

interface Slice {
  key: string;
  label: string;
  value: number;
  /** Override palette index (1..8). Default = position in the array. */
  toneIndex?: number;
}

interface Props {
  slices: Slice[];
  /** Render width in CSS px. Square layout — height matches. */
  size?: number;
  /** Donut thickness ratio (0..1; 0 = pie, 1 = full hole). Default 0.5. */
  thickness?: number;
  /** Show slice labels on the outside of the ring? Default true.
   *  Turn off in compact dashboard tiles. */
  sliceLabels?: boolean;
  /** Show the legend (below the donut)? Default false; turn on when
   *  outside slice labels are too cramped. */
  legend?: boolean;
  /** Optional center label (small text above the value). */
  centerLabel?: string;
  /** Optional center value (large headline number). */
  centerValue?: string | number;
  /** Fold slices below this %% into "Other". 0 disables. Default 3. */
  minSlice?: number;
  /** Number formatter for value labels + SR summary. */
  format?: (n: number) => string;
  /** Decimals for the SR summary. */
  decimals?: number;
  /** Override the SR summary. */
  ariaSummary?: string;
  /** Units label appended to the SR summary. */
  units?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 280,
  thickness: 0.5,
  sliceLabels: true,
  legend: false,
  centerLabel: undefined,
  centerValue: undefined,
  minSlice: 3,
  format: (n: number) => n.toLocaleString(),
  decimals: 1,
  ariaSummary: undefined,
  units: undefined,
});

// Fold tiny slices into "Other" so we don't get a wheel of 1° wedges.
const foldedSlices = computed<Slice[]>(() => {
  const total = props.slices.reduce((a, b) => a + b.value, 0) || 1;
  const big: Slice[] = [];
  let otherValue = 0;
  let otherCount = 0;
  for (const s of props.slices) {
    const pct = (s.value / total) * 100;
    if (props.minSlice > 0 && pct < props.minSlice) {
      otherValue += s.value;
      otherCount += 1;
    } else {
      big.push(s);
    }
  }
  if (otherValue > 0 && otherCount > 0) {
    big.push({
      key: "__other__",
      label: `Other (${otherCount})`,
      value: otherValue,
      toneIndex: 8,
    });
  }
  return big;
});

const total = computed(() => foldedSlices.value.reduce((a, b) => a + b.value, 0) || 1);

// Geometry: arcs in SVG path-data with two arc commands per slice.
const cx = computed(() => props.size / 2);
const cy = computed(() => props.size / 2);
const outerR = computed(() => props.size / 2 - 28); // leave room for outside labels
const innerR = computed(() =>
  Math.max(0, outerR.value * (1 - Math.max(0, Math.min(1, props.thickness))))
);

function polar(cxv: number, cyv: number, r: number, angle: number): { x: number; y: number } {
  // Angle in radians; 0 at 12 o'clock, clockwise.
  return {
    x: cxv + r * Math.sin(angle),
    y: cyv - r * Math.cos(angle),
  };
}

interface Arc {
  slice: Slice;
  fraction: number;
  startAngle: number;
  endAngle: number;
  midAngle: number;
  d: string;
  labelPos: { x: number; y: number; anchor: "start" | "middle" | "end" };
  toneClass: string;
}

const arcs = computed<Arc[]>(() => {
  let a = 0;
  return foldedSlices.value.map((s, i) => {
    const frac = s.value / total.value;
    const start = a;
    const end = a + frac * Math.PI * 2;
    a = end;
    const mid = (start + end) / 2;

    const oStart = polar(cx.value, cy.value, outerR.value, start);
    const oEnd = polar(cx.value, cy.value, outerR.value, end);
    const iStart = polar(cx.value, cy.value, innerR.value, end);
    const iEnd = polar(cx.value, cy.value, innerR.value, start);
    const largeArc = end - start > Math.PI ? 1 : 0;

    const d = [
      `M ${oStart.x},${oStart.y}`,
      `A ${outerR.value},${outerR.value} 0 ${largeArc} 1 ${oEnd.x},${oEnd.y}`,
      `L ${iStart.x},${iStart.y}`,
      `A ${innerR.value},${innerR.value} 0 ${largeArc} 0 ${iEnd.x},${iEnd.y}`,
      "Z",
    ].join(" ");

    // Outside slice label positioned just past the outer radius.
    const labelR = outerR.value + 14;
    const labelP = polar(cx.value, cy.value, labelR, mid);
    const anchor: "start" | "middle" | "end" =
      Math.sin(mid) > 0.15 ? "start" : Math.sin(mid) < -0.15 ? "end" : "middle";

    const toneIdx = s.toneIndex ?? i + 1;
    const tone = Math.max(1, Math.min(8, toneIdx));

    return {
      slice: s,
      fraction: frac,
      startAngle: start,
      endAngle: end,
      midAngle: mid,
      d,
      labelPos: { x: labelP.x, y: labelP.y + 4, anchor },
      toneClass: `tux-chart-donut__slice--c${tone}`,
    };
  });
});

const ariaSummary = computed(() => {
  if (props.ariaSummary) return props.ariaSummary;
  const sorted = [...foldedSlices.value].sort((a, b) => b.value - a.value);
  const largest = sorted[0];
  const smallest = sorted[sorted.length - 1];
  const t = total.value;
  const fmt = (n: number) => `${((n / t) * 100).toFixed(props.decimals)}% / ${props.format(n)}`;
  const u = props.units ? ` ${props.units}` : "";
  return `Donut chart: ${foldedSlices.value.length} categories, largest ${largest?.label} ${fmt(largest?.value ?? 0)}, smallest ${smallest?.label} ${fmt(smallest?.value ?? 0)}, total ${props.format(t)}${u}.`;
});

function fmtPercent(frac: number): string {
  return `${(frac * 100).toFixed(props.decimals)}%`;
}
</script>

<template>
  <figure class="tux-chart-donut" role="figure" :aria-label="ariaSummary">
    <div class="tux-chart-donut__wrap">
      <svg
        :viewBox="`0 0 ${size} ${size}`"
        :width="size"
        :height="size"
        preserveAspectRatio="xMidYMid meet"
        class="tux-chart-donut__svg"
      >
        <g class="tux-chart-donut__slices">
          <path
            v-for="arc in arcs"
            :key="arc.slice.key"
            :d="arc.d"
            :class="['tux-chart-donut__slice', arc.toneClass]"
          />
        </g>

        <g v-if="sliceLabels" class="tux-chart-donut__labels">
          <text
            v-for="arc in arcs"
            :key="`lbl-${arc.slice.key}`"
            :x="arc.labelPos.x"
            :y="arc.labelPos.y"
            :text-anchor="arc.labelPos.anchor"
            :class="['tux-chart-donut__slice-label', arc.toneClass]"
          >
            {{ arc.slice.label }} · {{ fmtPercent(arc.fraction) }}
          </text>
        </g>
      </svg>

      <!-- Center: slot wins over centerLabel/centerValue props if provided. -->
      <div v-if="$slots.center || centerLabel || centerValue !== undefined" class="tux-chart-donut__center">
        <slot name="center">
          <p v-if="centerLabel" class="tux-chart-donut__center-label">{{ centerLabel }}</p>
          <p v-if="centerValue !== undefined" class="tux-chart-donut__center-value">
            {{ typeof centerValue === "number" ? format(centerValue) : centerValue }}
          </p>
        </slot>
      </div>
    </div>

    <ul v-if="legend" class="tux-chart-donut__legend">
      <li
        v-for="arc in arcs"
        :key="`leg-${arc.slice.key}`"
        :class="['tux-chart-donut__legend-item', arc.toneClass]"
      >
        <span class="tux-chart-donut__legend-swatch" />
        <span class="tux-chart-donut__legend-label">
          {{ arc.slice.label }}
        </span>
        <span class="tux-chart-donut__legend-value">
          {{ format(arc.slice.value) }} · {{ fmtPercent(arc.fraction) }}
        </span>
      </li>
    </ul>
  </figure>
</template>

<style scoped>
.tux-chart-donut {
  margin: 0;
  font-family: var(--font-sans);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.tux-chart-donut__wrap {
  position: relative;
  display: inline-block;
}

.tux-chart-donut__svg {
  display: block;
  max-width: 100%;
  height: auto;
}

.tux-chart-donut__slice {
  fill: var(--chart-1, var(--brand-primary));
  stroke: var(--surface-page);
  stroke-width: 1.5;
  transition: opacity 120ms ease-out;
}

.tux-chart-donut__slice-label {
  font-size: 11px;
  font-weight: 500;
  fill: var(--text-secondary);
}

.tux-chart-donut__center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
}

.tux-chart-donut__center-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.tux-chart-donut__center-value {
  font-family: var(--font-display, var(--font-sans));
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.05;
}

/* Palette — eight chart tones, same as TuxChartLine + TuxChartBar. */
.tux-chart-donut__slice--c1 { fill: var(--chart-1, var(--brand-primary)); }
.tux-chart-donut__slice--c2 { fill: var(--chart-2, #3f5a6f); }
.tux-chart-donut__slice--c3 { fill: var(--chart-3, #c7973c); }
.tux-chart-donut__slice--c4 { fill: var(--chart-4, #6b8e5a); }
.tux-chart-donut__slice--c5 { fill: var(--chart-5, #8c5a3c); }
.tux-chart-donut__slice--c6 { fill: var(--chart-6, #5c7080); }
.tux-chart-donut__slice--c7 { fill: var(--chart-7, #a33a3a); }
.tux-chart-donut__slice--c8 { fill: var(--chart-8, #3c5a87); }

/* Slice-label tones echo the slice fill so identity is preserved
   even on grayscale prints / colorblind viewers — they see the
   label colored to match the slice it points at. */
.tux-chart-donut__slice-label.tux-chart-donut__slice--c1 { fill: var(--chart-1, var(--brand-primary)); }
.tux-chart-donut__slice-label.tux-chart-donut__slice--c2 { fill: var(--chart-2, #3f5a6f); }
.tux-chart-donut__slice-label.tux-chart-donut__slice--c3 { fill: var(--chart-3, #c7973c); }
.tux-chart-donut__slice-label.tux-chart-donut__slice--c4 { fill: var(--chart-4, #6b8e5a); }
.tux-chart-donut__slice-label.tux-chart-donut__slice--c5 { fill: var(--chart-5, #8c5a3c); }
.tux-chart-donut__slice-label.tux-chart-donut__slice--c6 { fill: var(--chart-6, #5c7080); }
.tux-chart-donut__slice-label.tux-chart-donut__slice--c7 { fill: var(--chart-7, #a33a3a); }
.tux-chart-donut__slice-label.tux-chart-donut__slice--c8 { fill: var(--chart-8, #3c5a87); }

.tux-chart-donut__legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 0.375rem 0.75rem;
  width: 100%;
  max-width: 36rem;
  font-size: 0.75rem;
}

.tux-chart-donut__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.tux-chart-donut__legend-swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}
.tux-chart-donut__legend-item.tux-chart-donut__slice--c1 .tux-chart-donut__legend-swatch { background: var(--chart-1, var(--brand-primary)); }
.tux-chart-donut__legend-item.tux-chart-donut__slice--c2 .tux-chart-donut__legend-swatch { background: var(--chart-2, #3f5a6f); }
.tux-chart-donut__legend-item.tux-chart-donut__slice--c3 .tux-chart-donut__legend-swatch { background: var(--chart-3, #c7973c); }
.tux-chart-donut__legend-item.tux-chart-donut__slice--c4 .tux-chart-donut__legend-swatch { background: var(--chart-4, #6b8e5a); }
.tux-chart-donut__legend-item.tux-chart-donut__slice--c5 .tux-chart-donut__legend-swatch { background: var(--chart-5, #8c5a3c); }
.tux-chart-donut__legend-item.tux-chart-donut__slice--c6 .tux-chart-donut__legend-swatch { background: var(--chart-6, #5c7080); }
.tux-chart-donut__legend-item.tux-chart-donut__slice--c7 .tux-chart-donut__legend-swatch { background: var(--chart-7, #a33a3a); }
.tux-chart-donut__legend-item.tux-chart-donut__slice--c8 .tux-chart-donut__legend-swatch { background: var(--chart-8, #3c5a87); }

.tux-chart-donut__legend-label {
  font-weight: 500;
}

.tux-chart-donut__legend-value {
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  margin-left: auto;
}

@media (prefers-reduced-motion: reduce) {
  .tux-chart-donut__slice {
    transition: none;
  }
}
</style>
