<script setup lang="ts">
/**
 * TuxFootnote — inline footnote reference + hover preview.
 *
 * Renders an inline superscript number that links to the
 * footnote at the bottom of the document. On hover/focus, a small
 * popover previews the footnote text without requiring the
 * reader to scroll.
 *
 * Pairs with `TuxFootnotesList` (the consumer's responsibility to
 * render at the document end). Both this component and the list
 * share the same footnote `id` so anchor links resolve.
 *
 * Usage:
 *   The signal-to-noise gain held across all four corridor
 *   segments<TuxFootnote :n="3" text="Segments selected for treatment in 2024 Q1; pre-treatment baselines run 2023 Q3–Q4." />.
 *
 *   ...later in the document...
 *
 *   <TuxFootnotesList :notes="[
 *     { n: 1, text: '...' },
 *     { n: 2, text: '...' },
 *     { n: 3, text: '...' },
 *   ]" />
 */
interface Props {
  /** Footnote number (1-based). Consumer maintains the counter. */
  n: number;
  /** Footnote text (shown in the hover preview). The full text
   *  must also live in the TuxFootnotesList at the document end. */
  text: string;
  /** ID prefix used for the anchor link. Default "fn"; combined
   *  with `n` to form `#fn-3` etc. */
  idPrefix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  idPrefix: "fn",
});

const refId = computed(() => `${props.idPrefix}-ref-${props.n}`);
const targetId = computed(() => `${props.idPrefix}-${props.n}`);
</script>

<template>
  <UPopover
    :ui="{ content: 'max-w-xs' }"
  >
    <a
      :id="refId"
      :href="`#${targetId}`"
      class="tux-footnote"
      :aria-label="`Footnote ${n}: ${text}`"
    ><sup>{{ n }}</sup></a>

    <template #content>
      <div class="tux-footnote__preview">
        <p class="eyebrow">Footnote {{ n }}</p>
        <p class="tux-footnote__preview-text">{{ text }}</p>
        <a :href="`#${targetId}`" class="tux-footnote__preview-link">
          Jump to footnotes →
        </a>
      </div>
    </template>
  </UPopover>
</template>

<style scoped>
.tux-footnote {
  color: var(--brand-primary);
  text-decoration: none;
  font-weight: 600;
  padding: 0 0.0625rem;
  border-radius: 2px;
  transition: background 80ms ease-out;
}

.tux-footnote:hover,
.tux-footnote:focus-visible {
  background: color-mix(in srgb, var(--brand-primary) 12%, transparent);
  outline: none;
}

.tux-footnote sup {
  font-size: 0.75em;
  line-height: 1;
  vertical-align: super;
}

.tux-footnote__preview {
  padding: 0.5rem 0.625rem;
  font-family: var(--font-sans);
}

.tux-footnote__preview-text {
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--text-primary);
  margin: 0.25rem 0 0.5rem 0;
}

.tux-footnote__preview-link {
  display: inline-block;
  font-size: 0.6875rem;
  color: var(--brand-primary);
  text-decoration: none;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
}

.tux-footnote__preview-link:hover {
  text-decoration: underline;
}

@media (prefers-reduced-motion: reduce) {
  .tux-footnote {
    transition: none;
  }
}
</style>
