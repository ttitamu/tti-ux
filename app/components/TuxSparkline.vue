<script setup lang="ts">
/**
 * TuxSparkline — inline mini trend line. No axes, no legend, no
 * tooltip. The point is "what's the shape of this metric over the
 * last N periods?" alongside a TuxBigStat or TuxFactoid value.
 *
 * Native SVG, no chart library. The line is computed from a flat
 * array of numbers; an optional area fill, last-point marker, and
 * delta arrow are opt-in.
 *
 * Theming: the stroke uses `--brand-primary` by default and lightens
 * automatically in dark + HC themes (those tokens already remap).
 * Pass `tone="success"` / `"error"` / `"warning"` / `"neutral"` to
 * pick a semantic color instead.
 *
 * Reading affordance: the component renders an SR-only summary —
 * "Trend: 12 points, low 18.2, high 24.7, last 23.1 (up 4.9 from
 * first)" — derived from the data, plus a screen-readable `<title>`
 * inside the SVG.
 *
 * NOT for: full charts with axes (use a TuxChartLine when shipped),
 * comparison overlays (multiple series), or anything where the
 * reader needs to read a value off a tick. This is a glance widget.
 */
type Tone = "brand" | "success" | "error" | "warning" | "neutral";

interface Props {
  /** Array of y-values. x is implicit (evenly spaced). */
  data: number[];
  /** Render width in CSS px. Height adapts to ratio. */
  width?: number;
  height?: number;
  /** Color tone for the stroke + fill + last-point marker. */
  tone?: Tone;
  /** Stroke weight in px. */
  strokeWidth?: number;
  /** Show a soft area fill under the line. */
  showArea?: boolean;
  /** Show a dot at the last data point. */
  showLastPoint?: boolean;
  /** Show a small +/− delta vs the first point, right-aligned. */
  showDelta?: boolean;
  /** Format the delta number — defaults to compact: "+12%" / "-2.3". */
  deltaFormat?: "percent" | "absolute";
  /** Override the SR-only summary string. Auto-computed if omitted. */
  ariaSummary?: string;
  /** Optional units label appended to the SR summary ("requests/min"). */
  units?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: 120,
  height: 32,
  tone: "brand",
  strokeWidth: 1.5,
  showArea: false,
  showLastPoint: true,
  showDelta: false,
  deltaFormat: "percent",
  ariaSummary: undefined,
  units: undefined,
});

const points = computed(() => {
  const d = props.data;
  if (d.length < 2) return { path: "", area: "", last: null as null | { x: number; y: number } };

  const min = Math.min(...d);
  const max = Math.max(...d);
  const span = max - min || 1;
  const w = props.width;
  const h = props.height;
  const pad = props.strokeWidth + 1;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;

  const coords = d.map((v, i) => {
    const x = pad + (i / (d.length - 1)) * innerW;
    const y = pad + innerH - ((v - min) / span) * innerH;
    return { x, y };
  });

  const path = coords
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(2)} ${c.y.toFixed(2)}`)
    .join(" ");

  const area =
    `M${coords[0]!.x.toFixed(2)} ${(h - pad).toFixed(2)} ` +
    coords.map((c) => `L${c.x.toFixed(2)} ${c.y.toFixed(2)}`).join(" ") +
    ` L${coords[coords.length - 1]!.x.toFixed(2)} ${(h - pad).toFixed(2)} Z`;

  return { path, area, last: coords[coords.length - 1] ?? null };
});

const delta = computed(() => {
  const d = props.data;
  if (d.length < 2) return null;
  const first = d[0]!;
  const last = d[d.length - 1]!;
  const abs = last - first;
  const pct = first === 0 ? 0 : (abs / Math.abs(first)) * 100;
  const sign = abs === 0 ? "" : abs > 0 ? "+" : "";
  return {
    direction: abs === 0 ? "flat" : abs > 0 ? "up" : "down",
    abs,
    pct,
    label:
      props.deltaFormat === "percent"
        ? `${sign}${pct.toFixed(pct >= 10 || pct <= -10 ? 0 : 1)}%`
        : `${sign}${abs.toFixed(Math.abs(abs) >= 10 ? 0 : 1)}`,
  };
});

const summary = computed(() => {
  if (props.ariaSummary) return props.ariaSummary;
  const d = props.data;
  if (!d.length) return "Trend chart with no data";
  const lo = Math.min(...d);
  const hi = Math.max(...d);
  const last = d[d.length - 1]!;
  const dl = delta.value?.label ?? "";
  const u = props.units ? ` ${props.units}` : "";
  return `Trend: ${d.length} points, low ${lo}${u}, high ${hi}${u}, last ${last}${u}${dl ? ` (${dl} from first)` : ""}.`;
});

const arrowIcon = computed(() => {
  if (!delta.value) return "";
  if (delta.value.direction === "up") return "lucide:arrow-up-right";
  if (delta.value.direction === "down") return "lucide:arrow-down-right";
  return "lucide:minus";
});
</script>

<template>
  <span class="tux-sparkline" :class="`tux-sparkline--${tone}`">
    <svg
      :width="width"
      :height="height"
      :viewBox="`0 0 ${width} ${height}`"
      role="img"
      :aria-label="summary"
      class="tux-sparkline__svg"
      preserveAspectRatio="none"
    >
      <title>{{ summary }}</title>
      <path
        v-if="showArea && points.area"
        :d="points.area"
        class="tux-sparkline__area"
      />
      <path
        v-if="points.path"
        :d="points.path"
        :stroke-width="strokeWidth"
        class="tux-sparkline__line"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        v-if="showLastPoint && points.last"
        :cx="points.last.x"
        :cy="points.last.y"
        :r="Math.max(strokeWidth + 0.5, 2)"
        class="tux-sparkline__last"
      />
    </svg>
    <span
      v-if="showDelta && delta"
      class="tux-sparkline__delta"
      :class="`tux-sparkline__delta--${delta.direction}`"
      aria-hidden="true"
    >
      <UIcon :name="arrowIcon" class="tux-sparkline__delta-icon" />
      {{ delta.label }}
    </span>
  </span>
</template>

<style scoped>
.tux-sparkline {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  vertical-align: middle;
  line-height: 1;
}

.tux-sparkline__svg {
  display: block;
}

/* Tone tokens — line, area, last-point all derived from one var
   so theme overrides only need to remap that var per tone. */
.tux-sparkline--brand    { --tux-spark-color: var(--brand-primary); }
.tux-sparkline--success  { --tux-spark-color: var(--color-success); }
.tux-sparkline--error    { --tux-spark-color: var(--color-error); }
.tux-sparkline--warning  { --tux-spark-color: #b8860b; }
.tux-sparkline--neutral  { --tux-spark-color: var(--text-secondary); }

[data-theme="tti-dark"] .tux-sparkline--warning  { --tux-spark-color: #f0c362; }
[data-theme="tti-hc"]   .tux-sparkline--warning  { --tux-spark-color: #8a5a00; }

.tux-sparkline__line {
  stroke: var(--tux-spark-color);
}

.tux-sparkline__area {
  fill: var(--tux-spark-color);
  opacity: 0.14;
}

.tux-sparkline__last {
  fill: var(--tux-spark-color);
}

.tux-sparkline__delta {
  display: inline-flex;
  align-items: center;
  gap: 0.1875rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
}

.tux-sparkline__delta--up      { color: var(--color-success); }
.tux-sparkline__delta--down    { color: var(--color-error); }
.tux-sparkline__delta--flat    { color: var(--text-muted); }

.tux-sparkline__delta-icon {
  width: 0.8125rem;
  height: 0.8125rem;
}
</style>
