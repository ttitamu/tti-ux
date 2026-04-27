<script setup lang="ts">
// TuxAccordion — disclosure group for FAQ + publication lists.
//
// Built on native `<details>`/`<summary>` for zero-JS toggling and
// perfect a11y. Keyboard navigation, screen-reader semantics, and
// "find on page" all work without JavaScript wiring.
//
// Two kinds:
//   - faq         (default) — question + answer rhythm. Title is the
//                              question; content is the answer.
//   - publication             — citation rhythm. Title is the work;
//                              `meta` shows authors/year/journal in the
//                              summary; content is the abstract.
//
// Mutually-exclusive mode: pass `single` to make opening one item close
// the others (radio-style). Uses the `name` attribute on `<details>`,
// supported in modern browsers — graceful degradation in older browsers
// (they just allow multiple open).

interface AccordionItem {
  title: string;
  /** Optional eyebrow above the title — small tracked-out label. */
  eyebrow?: string;
  /** Inline meta line under the title — authors/year/journal for
   *  publications, or a short subtitle for FAQ entries. */
  meta?: string;
  /** Content shown when expanded. Plain text or HTML string. For richer
   *  content (lists, tables, components), use the `#item-{idx}` slot. */
  content?: string;
  /** Open by default. */
  defaultOpen?: boolean;
}

interface Props {
  items: AccordionItem[];
  /** Disclosure kind. Affects type rhythm + summary layout. */
  kind?: "faq" | "publication";
  /** Mutually-exclusive — opening one closes the others. */
  single?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  kind: "faq",
  single: false,
});

// `name` attribute scopes `<details>` into an exclusive group. We need a
// stable but unique value per component instance so nested accordions
// don't collide. useId() gives us a stable SSR-safe id.
const groupId = useId();
const groupName = computed(() => (props.single ? `tux-accordion-${groupId}` : undefined));
</script>

<template>
  <div class="tux-accordion" :class="`tux-accordion--${kind}`">
    <details
      v-for="(item, idx) in items"
      :key="idx"
      :name="groupName"
      :open="item.defaultOpen"
      class="tux-accordion__item"
    >
      <summary class="tux-accordion__summary">
        <div class="tux-accordion__summary-content">
          <span v-if="item.eyebrow" class="tux-accordion__eyebrow">{{ item.eyebrow }}</span>
          <span class="tux-accordion__title">{{ item.title }}</span>
          <span v-if="item.meta" class="tux-accordion__meta">{{ item.meta }}</span>
        </div>
        <Icon
          name="lucide:plus"
          class="tux-accordion__chevron"
          aria-hidden="true"
        />
      </summary>
      <div class="tux-accordion__content">
        <slot :name="`item-${idx}`" :item="item">
          <p v-if="item.content">{{ item.content }}</p>
        </slot>
      </div>
    </details>
  </div>
</template>

<style scoped>
.tux-accordion {
  width: 100%;
  font-family: var(--font-body);
}

.tux-accordion__item {
  border-bottom: 1px solid var(--surface-border);
}
.tux-accordion__item:first-child {
  border-top: 2px solid var(--brand-primary);
}

.tux-accordion__summary {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.125rem 0.25rem 1.125rem 0;
  cursor: pointer;
  list-style: none;
  user-select: none;
  color: var(--text-primary);
  transition: background-color 0.15s ease;
}
.tux-accordion__summary::-webkit-details-marker { display: none; }

.tux-accordion__summary:hover {
  background: color-mix(in srgb, var(--brand-primary) 3%, transparent);
}

.tux-accordion__summary:focus-visible {
  outline: 2px solid var(--brand-primary);
  outline-offset: -2px;
}

.tux-accordion__summary-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.tux-accordion__eyebrow {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--brand-primary);
}

.tux-accordion__title {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.4;
  color: var(--text-primary);
}

.tux-accordion--publication .tux-accordion__title {
  font-family: var(--font-elegant);
  font-weight: 400;
  font-style: italic;
  font-size: 1.125rem;
}

.tux-accordion__meta {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.tux-accordion__chevron {
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;
  margin-top: 0.1875rem;
  color: var(--brand-primary);
  transition: transform 0.2s ease;
}

.tux-accordion__item[open] .tux-accordion__chevron {
  transform: rotate(45deg);
}

.tux-accordion__content {
  padding: 0 0 1.5rem;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--text-secondary);
}

.tux-accordion__content :deep(p) {
  margin: 0 0 0.75rem;
}
.tux-accordion__content :deep(p:last-child) {
  margin-bottom: 0;
}

.tux-accordion__content :deep(ul),
.tux-accordion__content :deep(ol) {
  margin: 0 0 0.75rem;
  padding-left: 1.25rem;
}
</style>
