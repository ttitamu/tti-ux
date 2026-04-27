<script setup lang="ts">
// TuxQACollection — long-form Q&A editorial pattern.
//
// Different from `TuxAccordion`. Accordion is collapsible — for FAQ
// pages where users scan headlines and expand selectively.
// QACollection is **always-expanded**, designed to be read top-to-
// bottom: a question sets up the answer, then the answer flows as
// prose. Right for explainers, methodology sections, "frequently
// considered questions" — content where the answer matters more than
// the index.
//
// Each question gets a maroon "Q." marker + bold question text, then
// the answer renders below as flowing prose. Optional follow-up
// "see also" link list per item.
//
// For richer answer content (lists, code, embedded components), use
// the `#answer-{idx}` slot instead of the `answer` string.

interface QAItem {
  question: string;
  /** Plain text answer. For richer markup, leave undefined and use
   *  the `#answer-{idx}` slot. */
  answer?: string;
  /** Optional "see also" link list rendered below the answer. */
  seeAlso?: Array<{ label: string; to?: string; href?: string }>;
}

interface Props {
  items: QAItem[];
  /** Style variant — affects question face. */
  variant?: "default" | "bold" | "elegant";
}

withDefaults(defineProps<Props>(), {
  variant: "default",
});

function isInternal(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}
</script>

<template>
  <ol
    class="tux-qa"
    :class="`tux-qa--${variant}`"
  >
    <li
      v-for="(item, idx) in items"
      :key="idx"
      class="tux-qa__item"
    >
      <header class="tux-qa__question-row">
        <span class="tux-qa__marker" aria-hidden="true">Q.</span>
        <h3 class="tux-qa__question">{{ item.question }}</h3>
      </header>

      <div class="tux-qa__answer">
        <slot :name="`answer-${idx}`" :item="item">
          <p v-if="item.answer">{{ item.answer }}</p>
        </slot>

        <p v-if="item.seeAlso && item.seeAlso.length > 0" class="tux-qa__see-also">
          <span class="tux-qa__see-also-label">See also</span>
          <template v-for="(link, lIdx) in item.seeAlso" :key="lIdx">
            <NuxtLink
              v-if="isInternal(link.href ?? link.to ?? '')"
              :to="link.to ?? link.href"
              class="tux-qa__see-also-link"
            >{{ link.label }}</NuxtLink>
            <a
              v-else
              :href="link.href"
              target="_blank"
              rel="noopener"
              class="tux-qa__see-also-link"
            >{{ link.label }}</a>
            <span
              v-if="lIdx < (item.seeAlso?.length ?? 0) - 1"
              class="tux-qa__see-also-sep"
              aria-hidden="true"
            >·</span>
          </template>
        </p>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.tux-qa {
  container-type: inline-size;
  container-name: tux-qa;
  list-style: none;
  margin: 0;
  padding: 0;
  counter-reset: tux-qa-counter;
}

.tux-qa__item {
  padding: 1.75rem 0;
  border-bottom: 1px solid var(--surface-border);
  counter-increment: tux-qa-counter;
}

.tux-qa__item:first-child {
  border-top: 2px solid var(--brand-primary);
}

.tux-qa__item:last-child {
  border-bottom: 0;
}

.tux-qa__question-row {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  gap: 0.75rem;
  align-items: baseline;
  margin-bottom: 0.875rem;
}

.tux-qa__marker {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--brand-primary);
  letter-spacing: -0.01em;
}

.tux-qa--bold .tux-qa__marker {
  font-family: var(--font-bold);
  font-weight: 800;
  font-style: italic;
}

.tux-qa--elegant .tux-qa__marker {
  font-family: var(--font-elegant);
  font-style: italic;
}

.tux-qa__question {
  margin: 0;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: clamp(1.0625rem, 0.875rem + 1cqi, 1.25rem);
  line-height: 1.35;
  color: var(--text-primary);
}

.tux-qa--elegant .tux-qa__question {
  font-family: var(--font-elegant);
  font-weight: 400;
  font-style: italic;
}

.tux-qa__answer {
  padding-left: 3.25rem;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

@container tux-qa (max-width: 32rem) {
  .tux-qa__answer {
    padding-left: 0;
  }
}

.tux-qa__answer :deep(p) {
  margin: 0 0 0.875rem;
}

.tux-qa__answer :deep(p:last-child) {
  margin-bottom: 0;
}

.tux-qa__answer :deep(ul),
.tux-qa__answer :deep(ol) {
  margin: 0 0 0.875rem;
  padding-left: 1.25rem;
}

.tux-qa__answer :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--brand-primary);
}

.tux-qa__see-also {
  margin: 1rem 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.tux-qa__see-also-label {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--text-muted);
}

.tux-qa__see-also-link {
  color: var(--brand-secondary);
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--brand-secondary) 40%, transparent);
  text-underline-offset: 2px;
  transition: color 0.15s ease;
}

.tux-qa__see-also-link:hover,
.tux-qa__see-also-link:focus-visible {
  color: var(--brand-primary);
  text-decoration-color: currentColor;
  outline: none;
}

.tux-qa__see-also-sep {
  color: var(--text-muted);
  opacity: 0.5;
}
</style>
