<script setup lang="ts">
/**
 * TuxVizGrid — small-multiples layout primitive for the
 * Visualizations section. Lays out 2-, 3-, or 4-up panes of
 * `TuxVizEmbed` / `TuxVizRPlot` (or any visualization-shaped
 * thing) with consistent gap, optional shared header, and
 * container-query collapsing on narrow widths.
 *
 * What this is and isn't:
 *   - IS: a layout shell. Provides editorial header (eyebrow /
 *     title / dek), the grid, and an optional footnote / source
 *     line beneath. Doesn't repaint the chrome of what goes inside.
 *   - IS NOT: a chart. The panes do the rendering; this just
 *     tiles them. If you want a single embed, drop `TuxVizEmbed`
 *     directly — no need to wrap it in a 1-up grid.
 *
 * Use when comparing several views of the same metric (a "by
 * region" small-multiples grid) or when an exec dashboard needs
 * 3 BI tiles with one editorial heading. For two unrelated
 * dashboards, just stack two `<TuxVizEmbed>` calls — the grid
 * implies "these belong together".
 */
type Cols = 2 | 3 | 4;

interface Props {
  /** Number of columns at the wide breakpoint. Collapses to fewer below. */
  cols?: Cols;
  eyebrow?: string;
  title?: string;
  /** One-line dek under the title. */
  dek?: string;
}

withDefaults(defineProps<Props>(), {
  cols: 2,
  eyebrow: undefined,
  title: undefined,
  dek: undefined,
});
</script>

<template>
  <section class="tux-viz-grid" :class="`tux-viz-grid--${cols}`">
    <header
      v-if="eyebrow || title || dek || $slots.header"
      class="tux-viz-grid__head"
    >
      <slot name="header">
        <p v-if="eyebrow" class="eyebrow tux-viz-grid__eyebrow">{{ eyebrow }}</p>
        <h2 v-if="title" class="heading--bold tux-viz-grid__title">{{ title }}</h2>
        <p v-if="dek" class="tux-viz-grid__dek">{{ dek }}</p>
      </slot>
    </header>

    <div class="tux-viz-grid__panes">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="tux-viz-grid__foot">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.tux-viz-grid {
  container-type: inline-size;
  container-name: tux-viz-grid;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tux-viz-grid__head {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tux-viz-grid__eyebrow { margin: 0; }

.tux-viz-grid__title {
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.2;
}

.tux-viz-grid__dek {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--text-secondary);
  max-width: 60rem;
}

.tux-viz-grid__panes {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.875rem;
}

.tux-viz-grid__panes :deep(> *) {
  min-width: 0;
}

.tux-viz-grid__foot {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
  border-top: 1px solid var(--surface-border);
  padding-top: 0.625rem;
}

@container tux-viz-grid (min-width: 32rem) {
  .tux-viz-grid--2 .tux-viz-grid__panes,
  .tux-viz-grid--3 .tux-viz-grid__panes,
  .tux-viz-grid--4 .tux-viz-grid__panes {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@container tux-viz-grid (min-width: 56rem) {
  .tux-viz-grid--3 .tux-viz-grid__panes {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .tux-viz-grid--4 .tux-viz-grid__panes {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
