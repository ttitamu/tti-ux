<script setup lang="ts">
// TuxSidebarBlock — generic sidebar widget wrapper.
//
// The visual chrome for in-page sidebar blocks: related links, contact
// boxes, quick-fact callouts, in-page nav. Provides the consistent
// editorial rhythm (eyebrow → maroon underline → content) that makes
// a stack of distinct widgets read as a unified rail rather than four
// orphan boxes.
//
// Content composes inside the default slot — pass plain prose, a list
// of NuxtLinks, a TuxDescriptionList, a TuxLinkList, anything. The
// block adds the heading + visual frame; the contents are yours.
//
// Variants:
//   - default — title above maroon-underline rule, content below.
//   - bordered — wraps the whole block in a maroon hairline border (for
//     "important sidebar" emphasis, or to break up a long content
//     column).
//   - filled — sunken-gray background panel.

interface Props {
  /** Block heading. Renders ALL-CAPS tracked-out with maroon underline. */
  title: string;
  /** Optional eyebrow above the title. */
  eyebrow?: string;
  /** Optional Lucide icon shown next to the title. */
  icon?: string;
  /** Visual treatment. */
  variant?: "default" | "bordered" | "filled";
}

withDefaults(defineProps<Props>(), {
  eyebrow: undefined,
  icon: undefined,
  variant: "default",
});
</script>

<template>
  <section
    class="tux-sidebar-block"
    :class="`tux-sidebar-block--${variant}`"
  >
    <header class="tux-sidebar-block__header">
      <p v-if="eyebrow" class="tux-sidebar-block__eyebrow">{{ eyebrow }}</p>
      <h3 class="tux-sidebar-block__title">
        <Icon
          v-if="icon"
          :name="icon"
          class="tux-sidebar-block__icon"
          aria-hidden="true"
        />
        <span>{{ title }}</span>
      </h3>
    </header>

    <div class="tux-sidebar-block__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.tux-sidebar-block {
  container-type: inline-size;
  container-name: tux-sidebar-block;
  font-family: var(--font-body);
}

.tux-sidebar-block + .tux-sidebar-block {
  margin-top: 1.75rem;
}

.tux-sidebar-block--bordered {
  border: 1px solid var(--brand-primary);
  border-radius: var(--radius-sm);
  padding: 1.125rem 1.25rem;
}

.tux-sidebar-block--filled {
  background: var(--surface-sunken);
  border-radius: var(--radius-sm);
  padding: 1.125rem 1.25rem;
}

.tux-sidebar-block__header {
  margin-bottom: 0.875rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--brand-primary);
}

.tux-sidebar-block__eyebrow {
  margin: 0 0 0.25rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--brand-primary);
}

.tux-sidebar-block__title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-primary);
}

.tux-sidebar-block__icon {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--brand-primary);
  flex-shrink: 0;
}

.tux-sidebar-block__body {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.tux-sidebar-block__body :deep(ul),
.tux-sidebar-block__body :deep(ol) {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Default styling for a list of NuxtLinks inside the body — gives
   "related links" / "in-page nav" patterns clean visuals without
   needing a separate component. */
.tux-sidebar-block__body :deep(ul > li) {
  padding: 0.375rem 0;
  border-bottom: 1px solid var(--surface-border);
}

.tux-sidebar-block__body :deep(ul > li:last-child) {
  border-bottom: 0;
}

.tux-sidebar-block__body :deep(a) {
  color: var(--brand-secondary);
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.15s ease, gap 0.15s ease;
}

.tux-sidebar-block__body :deep(a:hover),
.tux-sidebar-block__body :deep(a:focus-visible) {
  color: var(--brand-primary);
  gap: 0.5rem;
  outline: none;
}

.tux-sidebar-block__body :deep(p) {
  margin: 0 0 0.5rem;
}
.tux-sidebar-block__body :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
