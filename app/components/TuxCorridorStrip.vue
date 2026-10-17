<script setup lang="ts">
/**
 * TuxCorridorStrip — linear corridor visualization.
 *
 * Native SVG horizontal strip showing a 1-D corridor (a highway,
 * a freight route, a transit line) with mile-markers + segment-
 * level data + point-event markers (intersections, treatments,
 * incidents).
 *
 * Use when the chart shape is fundamentally **one-dimensional**
 * (mile X to mile Y along a single route) — that's where a
 * `TuxChartGeographic` (2-D map) over-delivers and a bar/line
 * chart under-delivers.
 *
 * Two data layers:
 *   - **segments** — colored stretches between mile markers
 *     (treatment / control / construction zones / pavement type).
 *   - **events** — point markers along the corridor (signal
 *     intersections, study sites, incidents, treatments applied).
 *
 * Optional value series renders a small overlay above the corridor
 * (e.g., crash rate per mile, speed compliance, AADT).
 */
import { computed } from "vue";
import { formatStationing } from "../composables/useTuxUnits";
import { useTuxSyncCursor } from "../composables/useTuxSyncCursor";

export interface TuxCorridorSegment {
  /** Start mile (inclusive). */
  from: number;
  /** End mile (exclusive — or inclusive for the final segment). */
  to: number;
  /** Display label. */
  label?: string;
  /** Palette tone (1-8) for the segment fill. */
  toneIndex?: number;
}

export interface TuxCorridorEvent {
  /** Mile location. */
  mile: number;
  /** Event label (for the popover). */
  label: string;
  /** Lucide icon name. */
  icon?: string;
  /** Tone index (1-8). */
  toneIndex?: number;
}

interface Props {
  /** Display name of the corridor. */
  name?: string;
  /** Start mile (inclusive). */
  fromMile: number;
  /** End mile (inclusive). */
  toMile: number;
  /** Colored segments along the corridor. */
  segments?: TuxCorridorSegment[];
  /** Point events along the corridor. */
  events?: TuxCorridorEvent[];
  /** Optional value series (length must equal toMile - fromMile + 1
   *  for one value per mile). Rendered as a small spark above the
   *  corridor. */
  values?: number[];
  /** Label for the value-series spark. */
  valuesLabel?: string;
  /** Direction marker — e.g. "Northbound → " or "Westbound ← ".
   *  Rendered as an eyebrow. */
  direction?: string;
  /** Render width in CSS px. */
  width?: number;
  /** Render height in CSS px. */
  height?: number;
  /** Mile-marker tick density. Default 5 (every 5 miles). */
  tickEvery?: number;
  /**
   * Tick notation format:
   * - "mile" (default): numeric milepost (e.g. "10")
   * - "rm": TxDOT Reference Marker (e.g. "RM 10")
   * - "station": Civil-engineering stationing (e.g. "STA 528+00")
   */
  tickFormat?: "mile" | "rm" | "station";
  /** Optional synchronized telemetry cursor channel name (links with useTuxSyncCursor). */
  syncChannel?: string;
  /** Optional explicit active milepost crosshair position. */
  activeMile?: number | null;
  /** Render an interactive accessible range scrubber below the header to scrub mileposts/stationing. */
  interactiveScrub?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  segments: undefined,
  events: undefined,
  values: undefined,
  valuesLabel: undefined,
  direction: undefined,
  width: 800,
  height: 140,
  tickEvery: 5,
  tickFormat: "mile",
  syncChannel: undefined,
  activeMile: undefined,
  interactiveScrub: false,
});

const emit = defineEmits<{
  (e: "update:activeMile", mile: number | null): void;
}>();

const syncBus = computed(() =>
  props.syncChannel ? useTuxSyncCursor(props.syncChannel) : null,
);

const effectiveActiveMile = computed<number | null>(() => {
  if (props.activeMile != null) return props.activeMile;
  const busMile = syncBus.value?.cursor.value.milepost ?? null;
  if (busMile != null && busMile >= props.fromMile && busMile <= props.toMile) {
    return busMile;
  }
  return null;
});

function formatTickLabel(m: number): string {
  if (props.tickFormat === "rm") return `RM ${m}`;
  if (props.tickFormat === "station") return formatStationing(m * 5280, 0);
  return String(m);
}

function handleScrubInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const mile = Number(target.value);
  if (Number.isNaN(mile)) return;
  emit("update:activeMile", mile);
  syncBus.value?.setMilepost(mile, `${props.name ?? "Corridor"} · RM ${mile}`, props.name);
}

function selectEventMile(ev: TuxCorridorEvent) {
  emit("update:activeMile", ev.mile);
  syncBus.value?.setMilepost(ev.mile, ev.label, props.name);
}

const totalMiles = computed(() => props.toMile - props.fromMile);
const valuesH = computed(() => (props.values ? 32 : 0));
const corridorY = computed(() => 60 + valuesH.value);
const corridorH = computed(() => 24);
const labelsY = computed(() => corridorY.value + corridorH.value + 18);

function mileToX(mile: number): number {
  const PAD = 24;
  const range = totalMiles.value || 1;
  return PAD + ((mile - props.fromMile) / range) * (props.width - PAD * 2);
}

function toneClass(idx?: number, fallback = 1): string {
  const tone = tuxSeriesTone(fallback - 1, idx);
  return `tux-corridor__c${tone} tux-chart-tone--c${tone}`;
}

const tickMiles = computed(() => {
  const ticks: number[] = [];
  const start = Math.ceil(props.fromMile / props.tickEvery) * props.tickEvery;
  for (let m = start; m <= props.toMile; m += props.tickEvery) ticks.push(m);
  // Always include endpoints.
  if (ticks[0] !== props.fromMile) ticks.unshift(props.fromMile);
  if (ticks[ticks.length - 1] !== props.toMile) ticks.push(props.toMile);
  return ticks;
});

// Value-series spark coordinates.
const valuesPath = computed(() => {
  if (!props.values || props.values.length === 0) return "";
  const [min, max] = tuxExtent(props.values);
  const range = max - min || 1;
  const PAD = 24;
  const w = props.width - PAD * 2;
  const baseY = 40 + valuesH.value;
  return props.values
    .map((v, i) => {
      const x = PAD + (i / Math.max(1, props.values!.length - 1)) * w;
      const y = baseY - ((v - min) / range) * (valuesH.value - 4);
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
});

const ariaSummary = computed(() => {
  const n = props.name ?? "Corridor";
  const ev = props.events?.length ?? 0;
  return `${n}, mile ${props.fromMile} to mile ${props.toMile} (${totalMiles.value} miles); ${props.segments?.length ?? 0} segments, ${ev} events.`;
});
</script>

<template>
  <figure class="tux-corridor" role="figure" :aria-label="ariaSummary">
    <header
      v-if="name || direction || interactiveScrub || effectiveActiveMile != null"
      class="tux-corridor__header"
    >
      <div class="tux-corridor__header-top">
        <div>
          <p v-if="direction" class="eyebrow">{{ direction }}</p>
          <h3 v-if="name" class="tux-corridor__name">{{ name }}</h3>
        </div>

        <div v-if="effectiveActiveMile != null" class="tux-corridor__readout" aria-live="polite">
          <span class="tux-corridor__readout-rm">RM {{ effectiveActiveMile }}</span>
          <span class="tux-corridor__readout-sta">
            {{ formatStationing(effectiveActiveMile * 5280, 0) }}
          </span>
        </div>
      </div>

      <div v-if="interactiveScrub" class="tux-corridor__scrubber">
        <label class="tux-corridor__scrubber-label">
          <span>Corridor Milepost Scrubber</span>
          <input
            type="range"
            class="tux-corridor__scrubber-input"
            :min="fromMile"
            :max="toMile"
            step="0.5"
            :value="effectiveActiveMile ?? fromMile"
            @input="handleScrubInput"
          >
        </label>
      </div>
    </header>

    <svg
      :viewBox="`0 0 ${width} ${height}`"
      :width="width"
      :height="height"
      preserveAspectRatio="xMidYMid meet"
      class="tux-corridor__svg"
    >
      <!-- Value-series spark (optional) -->
      <g v-if="values && values.length" class="tux-corridor__values">
        <text
          v-if="valuesLabel"
          x="24"
          :y="14"
          class="tux-corridor__values-label"
        >{{ valuesLabel }}</text>
        <path
          :d="valuesPath"
          class="tux-corridor__values-path"
          fill="none"
          stroke-width="1.5"
        />
      </g>

      <!-- Corridor base -->
      <rect
        :x="24"
        :y="corridorY"
        :width="width - 48"
        :height="corridorH"
        rx="2"
        class="tux-corridor__base"
      />

      <!-- Segments -->
      <g v-if="segments && segments.length" class="tux-corridor__segments">
        <rect
          v-for="(seg, i) in segments"
          :key="i"
          :x="mileToX(seg.from)"
          :y="corridorY"
          :width="Math.max(0, mileToX(seg.to) - mileToX(seg.from))"
          :height="corridorH"
          :class="['tux-corridor__segment', toneClass(seg.toneIndex, (i % 8) + 1)]"
        >
          <title v-if="seg.label">{{ seg.label }} — mile {{ seg.from }} to {{ seg.to }}</title>
        </rect>
      </g>

      <!-- Event markers -->
      <g v-if="events && events.length" class="tux-corridor__events">
        <g
          v-for="(ev, i) in events"
          :key="i"
          :transform="`translate(${mileToX(ev.mile)}, ${corridorY - 4})`"
          class="tux-corridor__event-group"
          @click="selectEventMile(ev)"
        >
          <circle
            r="6"
            :class="['tux-corridor__event-dot', toneClass(ev.toneIndex, 1)]"
          >
            <title>{{ ev.label }} — mile {{ ev.mile }}</title>
          </circle>
          <line
            :y1="4"
            :y2="corridorH + 4"
            class="tux-corridor__event-tick"
          />
        </g>
      </g>

      <!-- Synchronized Telemetry Crosshair -->
      <g
        v-if="effectiveActiveMile != null && effectiveActiveMile >= fromMile && effectiveActiveMile <= toMile"
        :transform="`translate(${mileToX(effectiveActiveMile)}, 0)`"
        class="tux-corridor__crosshair"
      >
        <line
          :y1="16"
          :y2="corridorY + corridorH + 8"
          class="tux-corridor__crosshair-line"
        />
        <circle
          :cy="corridorY + corridorH / 2"
          r="5"
          class="tux-corridor__crosshair-knot"
        />
      </g>

      <!-- Mile markers -->
      <g class="tux-corridor__ticks">
        <g
          v-for="m in tickMiles"
          :key="m"
          :transform="`translate(${mileToX(m)}, 0)`"
        >
          <line
            :y1="corridorY + corridorH"
            :y2="corridorY + corridorH + 4"
            class="tux-corridor__tick"
          />
          <text :y="labelsY" text-anchor="middle" class="tux-corridor__tick-label">
            {{ formatTickLabel(m) }}
          </text>
        </g>
      </g>
    </svg>
  </figure>
</template>

<style scoped>
.tux-corridor {
  margin: 1rem 0;
  font-family: var(--font-body);
}

.tux-corridor__header {
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tux-corridor__header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.tux-corridor__name {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.tux-corridor__readout {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-variant-numeric: tabular-nums;
}

.tux-corridor__readout-rm {
  font-weight: 700;
  color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--brand-primary) 22%, transparent);
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-sm);
}

.tux-corridor__readout-sta {
  color: var(--text-secondary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-sm);
}

.tux-corridor__scrubber {
  padding: 0.375rem 0.625rem;
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
}

.tux-corridor__scrubber-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.tux-corridor__scrubber-input {
  flex: 1;
  accent-color: var(--brand-primary);
  cursor: pointer;
}

.tux-corridor__svg {
  display: block;
  max-width: 100%;
  height: auto;
  background: var(--surface-sunken);
  border-radius: var(--radius-sm);
}

.tux-corridor__base {
  fill: var(--surface-page);
  stroke: var(--surface-border);
  stroke-width: 1;
}

.tux-corridor__segment {
  opacity: 0.78;
}

.tux-corridor__event-group {
  cursor: pointer;
}

.tux-corridor__event-dot {
  stroke: var(--surface-page);
  stroke-width: 1.5;
}

.tux-corridor__event-tick {
  stroke: var(--text-primary);
  stroke-width: 1;
  opacity: 0.55;
}

.tux-corridor__crosshair-line {
  stroke: var(--brand-primary);
  stroke-width: 2;
  stroke-dasharray: 3 2;
}

.tux-corridor__crosshair-knot {
  fill: var(--brand-accent);
  stroke: var(--brand-primary);
  stroke-width: 2;
}

.tux-corridor__tick {
  stroke: var(--text-muted);
  stroke-width: 1;
}

.tux-corridor__tick-label {
  font-size: 10px;
  font-family: var(--font-mono);
  fill: var(--text-muted);
}

.tux-corridor__values-label {
  font-size: 10px;
  fill: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
}

.tux-corridor__values-path {
  stroke: var(--brand-primary);
  opacity: 0.85;
}

/* Series tones come from tux-chart-palette.css via --tux-chart-tone. */
.tux-corridor__segment[class*="tux-chart-tone--"],
.tux-corridor__event-dot[class*="tux-chart-tone--"] { fill: var(--tux-chart-tone); }
</style>
