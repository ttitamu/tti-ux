<script setup lang="ts">
/**
 * TuxChartFrame — editorial wrapper that ties native chart
 * components into the TUX type system. Anatomy:
 *
 *   - eyebrow (uppercase tracked label, e.g. "Exhibit 11.01")
 *   - display-face title (Oswald) under the eyebrow
 *   - 2px maroon signature rule under the title
 *   - chart body via default slot
 *   - footnote and source lines below the chart
 *
 * Wraps any native chart (`TuxChartBar`, `TuxChartLine`,
 * `TuxChartGeographic`, `TuxChartSunburst`, etc.) so a multi-
 * exhibit report reads as one document. Use bare in dashboard
 * tiles; reach for the frame when the chart is a numbered
 * exhibit in a report or paper.
 */

interface Props {
  /** Uppercase tracked eyebrow — e.g. `"Exhibit 11.01"` or `"Slide 9"`. */
  eyebrow?: string;
  /** Display-face title under the eyebrow. */
  title?: string;
  /** Optional subtitle / lede below the title, above the rule. */
  subtitle?: string;
  /** Source citation line below the chart body. */
  source?: string;
  /** Methodological note above the source line. */
  notes?: string;
  /** Hide the maroon signature rule (for tight tile layouts). */
  bare?: boolean;
}

withDefaults(defineProps<Props>(), {
  eyebrow: "",
  title: "",
  subtitle: "",
  source: "",
  notes: "",
  bare: false,
});
</script>

<template>
  <figure class="tux-chart-frame" :class="{ 'tux-chart-frame--bare': bare }">
    <figcaption v-if="eyebrow || title || subtitle" class="tux-chart-frame__caption">
      <p v-if="eyebrow" class="tux-chart-frame__eyebrow">{{ eyebrow }}</p>
      <h3 v-if="title" class="tux-chart-frame__title">{{ title }}</h3>
      <p v-if="subtitle" class="tux-chart-frame__subtitle">{{ subtitle }}</p>
      <hr v-if="!bare" class="tux-chart-frame__rule">
    </figcaption>

    <div class="tux-chart-frame__body">
      <slot />
    </div>

    <div v-if="notes || source || $slots.footer" class="tux-chart-frame__footer">
      <p v-if="notes" class="tux-chart-frame__notes">{{ notes }}</p>
      <p v-if="source" class="tux-chart-frame__source">{{ source }}</p>
      <slot name="footer" />
    </div>
  </figure>
</template>

<style scoped>
.tux-chart-frame {
  margin: 0;
  padding: 1.25rem;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  container-type: inline-size;
  container-name: tux-chart-frame;
}

.tux-chart-frame__caption {
  margin-bottom: 1rem;
}

.tux-chart-frame__eyebrow {
  font-family: var(--font-bold);
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  margin: 0;
}

.tux-chart-frame__title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: var(--text-primary);
  margin: 0.25rem 0 0;
  line-height: 1.25;
}

.tux-chart-frame__subtitle {
  font-size: 0.86rem;
  color: var(--text-secondary);
  margin: 0.375rem 0 0;
  line-height: 1.55;
  max-width: 48rem;
}

.tux-chart-frame__rule {
  height: 2px;
  width: 4rem;
  background: var(--brand-primary);
  border: none;
  margin: 0.625rem 0 0;
}

.tux-chart-frame__body {
  margin: 0;
}

.tux-chart-frame__footer {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--surface-border);
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.tux-chart-frame__notes {
  margin: 0 0 0.375rem;
}

.tux-chart-frame__source {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
</style>
