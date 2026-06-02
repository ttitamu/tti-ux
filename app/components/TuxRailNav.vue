<script setup lang="ts">
// TuxRailNav — accessible collapsible sidebar/rail navigation.
//
// Native `<details>`/`<summary>` for the collapsible groups (the same
// "zero JS, perfect a11y" disclosure pattern as TuxFilterPanel): the
// <summary> is a real disclosure button the browser wires up with
// correct aria-expanded + keyboard semantics, so no roleless span ever
// carries widget ARIA. This is the tux-owned replacement for Nuxt UI's
// <UNavigationMenu> in vertical mode, which renders a collapsible
// group's chevron as a roleless <span aria-expanded> (axe
// aria-allowed-attr — upstream, not fixable from the consumer side).
//
// Items are grouped: `items` is an array of groups, each group an array
// of entries. Groups render with a divider between them. An entry with
// `children` becomes a disclosure; otherwise a link.

interface RailLink {
  label: string;
  icon?: string;
  to?: string;
  badge?: string | number;
}

interface RailItem extends RailLink {
  /** Nested links — presence makes this entry a collapsible group. */
  children?: RailLink[];
  /** Group starts expanded. Ignored in `collapsed` (icon-only) mode. */
  defaultOpen?: boolean;
}

const props = withDefaults(
  defineProps<{
    /** Groups of nav entries; a divider sits between groups. */
    items: RailItem[][];
    /** Icon-only mode (the rail's narrow state). Hides labels +
     *  collapses groups to a single icon link. */
    collapsed?: boolean;
    /** Accessible name for the <nav> landmark. */
    ariaLabel?: string;
  }>(),
  {
    collapsed: false,
    ariaLabel: "Primary",
  }
);

// In collapsed mode a group can't show its children inline, so the
// parent acts as a plain icon link. Point it at its first child's
// destination so the icon still navigates somewhere sensible.
function collapsedTarget(item: RailItem): string {
  return item.to ?? item.children?.find((c) => c.to)?.to ?? "#";
}
</script>

<template>
  <nav class="tux-rail-nav" :aria-label="ariaLabel" :data-collapsed="props.collapsed || undefined">
    <ul
      v-for="(group, gi) in items"
      :key="gi"
      class="tux-rail-nav__group"
      :class="{ 'tux-rail-nav__group--divided': gi > 0 }"
    >
      <li v-for="(item, ii) in group" :key="ii" class="tux-rail-nav__item">
        <!-- Collapsible group (expanded mode) -->
        <details
          v-if="item.children?.length && !props.collapsed"
          class="tux-rail-nav__disclosure"
          :open="item.defaultOpen || undefined"
        >
          <summary class="tux-rail-nav__summary">
            <Icon v-if="item.icon" :name="item.icon" class="tux-rail-nav__icon" aria-hidden="true" />
            <span class="tux-rail-nav__label">{{ item.label }}</span>
            <Icon
              name="lucide:chevron-down"
              class="tux-rail-nav__chevron"
              aria-hidden="true"
            />
          </summary>
          <ul class="tux-rail-nav__children">
            <li v-for="(child, ci) in item.children" :key="ci">
              <NuxtLink :to="child.to ?? '#'" class="tux-rail-nav__link tux-rail-nav__link--child">
                <Icon v-if="child.icon" :name="child.icon" class="tux-rail-nav__icon" aria-hidden="true" />
                <span class="tux-rail-nav__label">{{ child.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </details>

        <!-- Leaf link, or a group rendered icon-only in collapsed mode.
             When collapsed the visible label is hidden, so the link
             carries an aria-label to stay named for screen readers. -->
        <NuxtLink
          v-else
          :to="item.children?.length ? collapsedTarget(item) : (item.to ?? '#')"
          class="tux-rail-nav__link"
          :aria-label="props.collapsed ? item.label : undefined"
        >
          <Icon v-if="item.icon" :name="item.icon" class="tux-rail-nav__icon" aria-hidden="true" />
          <span v-if="!props.collapsed" class="tux-rail-nav__label">{{ item.label }}</span>
          <span
            v-if="item.badge !== undefined && !props.collapsed"
            class="tux-rail-nav__badge"
          >{{ item.badge }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.tux-rail-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tux-rail-nav__group {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tux-rail-nav__group--divided {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--surface-border);
}

.tux-rail-nav__item {
  margin: 0;
}

/* Links + summary share the same row treatment. */
.tux-rail-nav__link,
.tux-rail-nav__summary {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.4rem 0.6rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  list-style: none;
  transition: background-color 0.12s ease, color 0.12s ease;
}

.tux-rail-nav__summary::-webkit-details-marker {
  display: none;
}

.tux-rail-nav__link:hover,
.tux-rail-nav__summary:hover {
  background: var(--surface-sunken);
  color: var(--text-primary);
}

.tux-rail-nav__link:focus-visible,
.tux-rail-nav__summary:focus-visible {
  outline: 2px solid var(--focus-ring, var(--brand-primary));
  outline-offset: 2px;
}

/* Active route — NuxtLink applies router-link-active. */
.tux-rail-nav__link.router-link-active {
  background: var(--surface-sunken);
  color: var(--brand-primary);
  font-weight: 600;
}

.tux-rail-nav__icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.tux-rail-nav__label {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tux-rail-nav__badge {
  flex-shrink: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-muted);
}

.tux-rail-nav__chevron {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
  color: var(--text-muted);
  transition: transform 0.15s ease;
}

.tux-rail-nav__disclosure[open] > .tux-rail-nav__summary > .tux-rail-nav__chevron {
  transform: rotate(180deg);
}

.tux-rail-nav__children {
  margin: 0.125rem 0 0;
  padding: 0 0 0 1.125rem;
  list-style: none;
  border-left: 1px solid var(--surface-border);
  margin-left: 0.85rem;
}

.tux-rail-nav__link--child {
  font-weight: 400;
  font-size: 0.78125rem;
}

/* Icon-only collapsed rail: center the icons, drop the row padding to a
   square hit target. */
.tux-rail-nav[data-collapsed] .tux-rail-nav__link {
  justify-content: center;
  padding: 0.45rem;
}

@media (prefers-reduced-motion: reduce) {
  .tux-rail-nav__chevron,
  .tux-rail-nav__link,
  .tux-rail-nav__summary {
    transition: none;
  }
}
</style>
