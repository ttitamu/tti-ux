<script setup lang="ts">
/**
 * TuxFigureCaption — auto-numbered caption for figures, tables,
 * exhibits, equations.
 *
 * The numbering and label semantics are consumer-driven (pass
 * `kind` + `number` explicitly) so consumers can manage their own
 * counter — TUX doesn't introspect doc order. Pairs with the
 * companion `TuxTableCaption` for tabular content; both share
 * styling.
 *
 * Wraps the figure / table itself + the caption in a `<figure>`
 * element so screen readers announce them as a unit.
 *
 * Usage:
 *   <TuxFigureCaption :number="3" kind="Figure" caption="Mean delay reduction over 36 months.">
 *     <img src="/research/figs/fig-3.png" alt="Mean delay reduction" />
 *   </TuxFigureCaption>
 */
interface Props {
  /** Kind label. "Figure" / "Table" / "Exhibit" / "Equation" /
   *  consumer-defined. */
  kind?: string;
  /** Number — passed by the consumer; TUX doesn't auto-increment. */
  number: number | string;
  /** Caption text. Plain string for the simple case; use #default
   *  + #caption slots for rich captions. */
  caption?: string;
  /** Optional source/credit citation rendered after the caption
   *  in muted text. */
  source?: string;
  /** Caption placement. Default "below"; pass "above" for tables. */
  placement?: "above" | "below";
}

withDefaults(defineProps<Props>(), {
  kind: "Figure",
  caption: undefined,
  source: undefined,
  placement: "below",
});
</script>

<template>
  <figure class="tux-figure-caption">
    <figcaption v-if="placement === 'above'" class="tux-figure-caption__caption">
      <span class="tux-figure-caption__label">{{ kind }} {{ number }}.</span>
      <slot name="caption">{{ caption }}</slot>
      <span v-if="source || $slots.source" class="tux-figure-caption__source">
        <slot name="source">{{ source }}</slot>
      </span>
    </figcaption>

    <div class="tux-figure-caption__content">
      <slot />
    </div>

    <figcaption v-if="placement === 'below'" class="tux-figure-caption__caption">
      <span class="tux-figure-caption__label">{{ kind }} {{ number }}.</span>
      <slot name="caption">{{ caption }}</slot>
      <span v-if="source || $slots.source" class="tux-figure-caption__source">
        <slot name="source">{{ source }}</slot>
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.tux-figure-caption {
  margin: 1.5rem 0;
  font-family: var(--font-sans);
}

.tux-figure-caption__content {
  margin: 0;
}

.tux-figure-caption__content :deep(img),
.tux-figure-caption__content :deep(svg) {
  max-width: 100%;
  height: auto;
  display: block;
}

.tux-figure-caption__caption {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-secondary);
  padding: 0.5rem 0 0 0;
  border-top: 1px solid var(--surface-border);
  margin-top: 0.5rem;
}

.tux-figure-caption__caption:first-child {
  border-top: none;
  border-bottom: 1px solid var(--surface-border);
  padding: 0 0 0.5rem 0;
  margin: 0 0 0.5rem 0;
}

.tux-figure-caption__label {
  font-weight: 700;
  color: var(--brand-primary);
  margin-right: 0.375rem;
}

.tux-figure-caption__source {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.6875rem;
  color: var(--text-muted);
  font-style: italic;
}
</style>
