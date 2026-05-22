<script setup lang="ts">
/**
 * TuxMapLegend — standalone legend for embedded maps.
 *
 * Drops into `TuxMapEmbed`'s `#legend` slot, or works standalone
 * next to any map. Renders categorical entries (color swatch +
 * label) and/or a continuous gradient scale (for choropleths).
 *
 * Three layouts:
 *   - **stack** (default) — vertical list with swatch + label rows
 *   - **inline** — horizontal pill row (good for short legends)
 *   - **gradient** — single horizontal gradient bar with min/max
 *     + optional intermediate stops (for choropleths)
 *
 * All variants render on an opaque branded chip that reads cleanly
 * over any map background.
 */
export interface TuxMapLegendEntry {
  /** Display label. */
  label: string;
  /** CSS color (any valid form). */
  color: string;
  /** Optional shape — "square" (default), "circle", "line". */
  shape?: "square" | "circle" | "line";
}

interface Props {
  /** Optional title shown above entries. */
  title?: string;
  /** Optional eyebrow above the title. */
  eyebrow?: string;
  /** Categorical entries (used when layout="stack" or "inline"). */
  entries?: TuxMapLegendEntry[];
  /** Layout. Default "stack". */
  layout?: "stack" | "inline" | "gradient";
  /** Gradient stops (used when layout="gradient"). */
  gradient?: {
    /** Min value label. */
    minLabel: string;
    /** Max value label. */
    maxLabel: string;
    /** CSS gradient string (e.g. "linear-gradient(to right, #fee, #fcc, #f88)"). */
    css?: string;
    /** Alternative: array of color stops + labels. */
    stops?: Array<{ color: string; label?: string }>;
  };
}

withDefaults(defineProps<Props>(), {
  title: undefined,
  eyebrow: undefined,
  entries: undefined,
  layout: "stack",
  gradient: undefined,
});

function gradientCss(stops?: Array<{ color: string }>): string {
  if (!stops || stops.length === 0) return "linear-gradient(to right, #ccc, #999)";
  if (stops.length === 1) return stops[0]!.color;
  return `linear-gradient(to right, ${stops.map((s) => s.color).join(", ")})`;
}
</script>

<template>
  <div class="tux-map-legend" :class="`tux-map-legend--${layout}`">
    <header v-if="eyebrow || title" class="tux-map-legend__header">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <p v-if="title" class="tux-map-legend__title">{{ title }}</p>
    </header>

    <ul v-if="layout === 'stack' && entries" class="tux-map-legend__list">
      <li
        v-for="entry in entries"
        :key="entry.label"
        class="tux-map-legend__row"
      >
        <span
          class="tux-map-legend__swatch"
          :class="`tux-map-legend__swatch--${entry.shape || 'square'}`"
          :style="entry.shape === 'line' ? { borderTopColor: entry.color } : { background: entry.color }"
        />
        <span class="tux-map-legend__label">{{ entry.label }}</span>
      </li>
    </ul>

    <ul v-else-if="layout === 'inline' && entries" class="tux-map-legend__inline-list">
      <li
        v-for="entry in entries"
        :key="entry.label"
        class="tux-map-legend__inline-row"
      >
        <span
          class="tux-map-legend__swatch"
          :class="`tux-map-legend__swatch--${entry.shape || 'square'}`"
          :style="entry.shape === 'line' ? { borderTopColor: entry.color } : { background: entry.color }"
        />
        <span class="tux-map-legend__label">{{ entry.label }}</span>
      </li>
    </ul>

    <div v-else-if="layout === 'gradient' && gradient" class="tux-map-legend__gradient">
      <div
        class="tux-map-legend__gradient-bar"
        :style="{ background: gradient.css || gradientCss(gradient.stops) }"
      />
      <div class="tux-map-legend__gradient-labels">
        <span>{{ gradient.minLabel }}</span>
        <template v-if="gradient.stops">
          <span
            v-for="(stop, i) in gradient.stops.slice(1, -1)"
            :key="i"
            class="tux-map-legend__gradient-stop-label"
          >
            {{ stop.label }}
          </span>
        </template>
        <span>{{ gradient.maxLabel }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tux-map-legend {
  font-family: var(--font-sans);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.625rem;
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.06);
  min-width: 8rem;
  max-width: 16rem;
  font-size: 0.75rem;
}

.tux-map-legend__header {
  margin-bottom: 0.375rem;
}

.tux-map-legend__title {
  font-weight: 600;
  color: var(--text-primary);
  margin: 0.125rem 0 0 0;
  font-size: 0.8125rem;
}

/* ---- Stack layout ---- */
.tux-map-legend__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tux-map-legend__row {
  display: grid;
  grid-template-columns: 0.875rem 1fr;
  gap: 0.5rem;
  align-items: center;
}

/* ---- Inline layout ---- */
.tux-map-legend--inline {
  max-width: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.tux-map-legend__inline-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.875rem;
}

.tux-map-legend__inline-row {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

/* ---- Swatches ---- */
.tux-map-legend__swatch {
  display: inline-block;
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
}

.tux-map-legend__swatch--square { border-radius: 2px; }
.tux-map-legend__swatch--circle { border-radius: 50%; }
.tux-map-legend__swatch--line {
  height: 0;
  border-top-width: 2px;
  border-top-style: solid;
  align-self: center;
  background: none !important;
}

/* ---- Gradient layout ---- */
.tux-map-legend--gradient {
  max-width: 20rem;
}

.tux-map-legend__gradient-bar {
  height: 0.625rem;
  border-radius: 2px;
  border: 1px solid var(--surface-border);
}

.tux-map-legend__gradient-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;
  font-size: 0.6875rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.tux-map-legend__gradient-stop-label {
  font-style: italic;
}
</style>
