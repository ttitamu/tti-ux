<script setup lang="ts">
/**
 * TuxMapMarker — research-typed map marker.
 *
 * Standalone SVG marker designed to be passed to a map library's
 * custom-marker API (Mapbox, Leaflet, MapLibre all accept SVG /
 * DOM markers) or used as a legend swatch. Library-agnostic by
 * design — the marker is just visual; positioning is the consumer's
 * responsibility.
 *
 * Five canonical research-typed markers:
 *   - **intersection** — diamond pin (intersection studies)
 *   - **corridor** — bar (corridor segment endpoint)
 *   - **site** — circle (study site / instrumented location)
 *   - **incident** — warning triangle (incident location)
 *   - **treatment** — checkmark dot (where a treatment was applied)
 *
 * Optional number badge for site IDs, tone override for custom
 * categories, size variants (sm/md/lg).
 */
type MarkerKind = "intersection" | "corridor" | "site" | "incident" | "treatment";

interface Props {
  /** Marker kind. */
  kind: MarkerKind;
  /** Optional number badge (e.g. "12" for the 12th site). */
  number?: number | string;
  /** Tone index (1-8) — overrides the kind's default tone. */
  toneIndex?: number;
  /** Size. Default md. */
  size?: "sm" | "md" | "lg";
  /** Optional title (rendered as SVG <title> for AT). */
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  number: undefined,
  toneIndex: undefined,
  size: "md",
  title: undefined,
});

// Default tone per kind — distinct so a mixed-marker map reads.
const DEFAULT_TONES: Record<MarkerKind, number> = {
  intersection: 1, // maroon
  corridor:     2, // slate teal
  site:         3, // wheat
  incident:     7, // rust red (status-alert hue)
  treatment:    4, // sage
};

const tone = computed(() => props.toneIndex ?? DEFAULT_TONES[props.kind]);
const toneClass = computed(() => `tux-map-marker--c${Math.max(1, Math.min(8, tone.value))}`);

const SIZES: Record<"sm" | "md" | "lg", number> = {
  sm: 18,
  md: 26,
  lg: 36,
};

const px = computed(() => SIZES[props.size]);
</script>

<template>
  <svg
    :width="px"
    :height="px"
    viewBox="0 0 26 26"
    class="tux-map-marker"
    :class="toneClass"
    role="img"
    :aria-label="title || `${kind} marker`"
  >
    <title v-if="title">{{ title }}</title>

    <!-- Intersection: diamond pin -->
    <g v-if="kind === 'intersection'">
      <path d="M13 1 L25 13 L13 25 L1 13 Z" class="tux-map-marker__fill" />
      <circle cx="13" cy="13" r="3" class="tux-map-marker__center" />
    </g>

    <!-- Corridor: vertical bar (endpoint of a segment) -->
    <g v-else-if="kind === 'corridor'">
      <rect x="9" y="2" width="8" height="22" rx="2" class="tux-map-marker__fill" />
    </g>

    <!-- Site: circle with halo -->
    <g v-else-if="kind === 'site'">
      <circle cx="13" cy="13" r="11" class="tux-map-marker__halo" />
      <circle cx="13" cy="13" r="7" class="tux-map-marker__fill" />
    </g>

    <!-- Incident: warning triangle -->
    <g v-else-if="kind === 'incident'">
      <path d="M13 2 L25 24 L1 24 Z" class="tux-map-marker__fill" />
      <text x="13" y="20" class="tux-map-marker__icon-text">!</text>
    </g>

    <!-- Treatment: checkmark dot -->
    <g v-else-if="kind === 'treatment'">
      <circle cx="13" cy="13" r="11" class="tux-map-marker__fill" />
      <path
        d="M8 13 L11.5 16.5 L18 10"
        class="tux-map-marker__check"
        fill="none"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- Number badge -->
    <text
      v-if="number !== undefined && kind !== 'incident'"
      x="13"
      y="17"
      class="tux-map-marker__number"
    >{{ number }}</text>
  </svg>
</template>

<style scoped>
.tux-map-marker {
  display: inline-block;
  vertical-align: middle;
}

.tux-map-marker__fill {
  fill: var(--marker-color, var(--brand-primary));
  stroke: var(--surface-page);
  stroke-width: 1.5;
}

.tux-map-marker__halo {
  fill: var(--marker-color, var(--brand-primary));
  opacity: 0.25;
}

.tux-map-marker__center {
  fill: var(--surface-page);
}

.tux-map-marker__check {
  stroke: var(--surface-page);
}

.tux-map-marker__icon-text {
  fill: var(--surface-page);
  font-family: var(--font-display, var(--font-sans));
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
}

.tux-map-marker__number {
  fill: var(--surface-page);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  text-anchor: middle;
}

/* Palette — same eight chart tones. */
.tux-map-marker--c1 { --marker-color: var(--chart-1, var(--brand-primary)); }
.tux-map-marker--c2 { --marker-color: var(--chart-2, #3f5a6f); }
.tux-map-marker--c3 { --marker-color: var(--chart-3, #c7973c); }
.tux-map-marker--c4 { --marker-color: var(--chart-4, #6b8e5a); }
.tux-map-marker--c5 { --marker-color: var(--chart-5, #8c5a3c); }
.tux-map-marker--c6 { --marker-color: var(--chart-6, #5c7080); }
.tux-map-marker--c7 { --marker-color: var(--chart-7, #a33a3a); }
.tux-map-marker--c8 { --marker-color: var(--chart-8, #3c5a87); }
</style>
