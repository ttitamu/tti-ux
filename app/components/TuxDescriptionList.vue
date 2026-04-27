<script setup lang="ts">
// TuxDescriptionList — term / definition pairs.
//
// The right structure for spec tables, event details, file metadata, and
// any "label : value" content. Renders as native `<dl>` for semantic +
// screen-reader benefits — `<dt>` and `<dd>` carry meaning that
// generic `<div>`-based tables don't.
//
// Two layouts:
//   - inline (default) — term left, value right. Single column. Compact.
//                        Right for sidebar widgets, compact spec lists.
//   - stacked          — term above, value below. More breathing room.
//                        Right for full-width metadata blocks.
//
// Two emphases:
//   - editorial (default) — eyebrow-styled terms (uppercase, tracked).
//                          Editorial rhythm. Right for content surfaces.
//   - data                 — mono terms + tabular numerals on values.
//                          Right for PECAN file detail, classifier specs.

interface DLItem {
  term: string;
  /** Value can be a string, or HTML content via the `#value-{idx}` slot. */
  value?: string | number;
}

interface Props {
  items: DLItem[];
  layout?: "inline" | "stacked";
  emphasis?: "editorial" | "data";
  /** Optional heading rendered above the list. */
  title?: string;
}

withDefaults(defineProps<Props>(), {
  layout: "inline",
  emphasis: "editorial",
  title: undefined,
});
</script>

<template>
  <div class="tux-dl-wrap">
    <h3 v-if="title" class="tux-dl__title">{{ title }}</h3>
    <dl
      class="tux-dl"
      :class="[
        `tux-dl--${layout}`,
        `tux-dl--${emphasis}`,
      ]"
    >
      <template v-for="(item, idx) in items" :key="idx">
        <dt class="tux-dl__term">{{ item.term }}</dt>
        <dd class="tux-dl__value">
          <slot :name="`value-${idx}`" :item="item">{{ item.value }}</slot>
        </dd>
      </template>
    </dl>
  </div>
</template>

<style scoped>
.tux-dl__title {
  margin: 0 0 0.875rem;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-primary);
  padding-bottom: 0.625rem;
  border-bottom: 2px solid var(--brand-primary);
}

.tux-dl {
  margin: 0;
  padding: 0;
  font-family: var(--font-body);
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Inline layout — term left, value right. Native CSS grid for crisp
   alignment without table semantics. */
.tux-dl--inline {
  display: grid;
  grid-template-columns: minmax(8rem, max-content) 1fr;
  gap: 0.5rem 1.25rem;
}

.tux-dl--inline .tux-dl__term {
  grid-column: 1;
}
.tux-dl--inline .tux-dl__value {
  grid-column: 2;
  margin: 0;
}

/* Stacked layout — term above, value below. Each pair gets vertical
   breathing room. */
.tux-dl--stacked .tux-dl__term {
  margin-top: 1rem;
}
.tux-dl--stacked .tux-dl__term:first-child {
  margin-top: 0;
}

.tux-dl--stacked .tux-dl__value {
  margin: 0.25rem 0 0;
}

/* Editorial emphasis — uppercase tracked terms */
.tux-dl--editorial .tux-dl__term {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-muted);
  align-self: baseline;
}

.tux-dl--editorial .tux-dl__value {
  color: var(--text-primary);
}

/* Data emphasis — mono terms, tabular numerals on values */
.tux-dl--data .tux-dl__term {
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 0.75rem;
  color: var(--text-secondary);
  align-self: baseline;
}

.tux-dl--data .tux-dl__value {
  font-family: var(--font-body);
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.tux-dl--data .tux-dl__value :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--brand-primary);
}
</style>
