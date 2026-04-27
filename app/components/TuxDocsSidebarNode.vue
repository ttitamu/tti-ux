<script setup lang="ts">
// TuxDocsSidebarNode — internal recursive component for TuxDocsSidebar.
// Recursion lives in its own SFC because Vue requires named components
// for the recursive case (otherwise `<TuxDocsSidebarNode>` is unresolved
// inside its own template).

interface DocsSection {
  label: string;
  to?: string;
  icon?: string;
  children?: DocsSection[];
}

interface Props {
  section: DocsSection;
  path: string;
  query: string;
  openMap: Record<string, boolean>;
  isOpen: (s: DocsSection, p: string) => boolean;
  isActive: (s: DocsSection) => boolean;
  onToggle: (path: string, open: boolean) => void;
  depth: number;
}

const props = defineProps<Props>();

const hasChildren = computed(() => (props.section.children?.length ?? 0) > 0);
const open = computed(() => props.isOpen(props.section, props.path));

// "Active trail" — true when this section is the active route OR any
// descendant is. Used to render a maroon guide line up the ancestor
// chain so the eye can trace from the active item back to its section
// root. Same pattern Drupal calls "active trail" and Microsoft Learn
// calls "tree guides with active state."
const inActiveTrail = computed(() => containsActive(props.section));

function containsActive(section: DocsSection): boolean {
  if (props.isActive(section)) return true;
  return section.children?.some(c => containsActive(c)) ?? false;
}

function pathOf(child: DocsSection): string {
  return `${props.path}/${child.label}`;
}

// Highlight the matched substring inside labels when filtering. Pure
// presentation — doesn't change the rendered text otherwise.
function highlight(label: string): string {
  if (!props.query) return label;
  const needle = props.query.toLowerCase();
  const haystack = label.toLowerCase();
  const idx = haystack.indexOf(needle);
  if (idx === -1) return label;
  const before = label.slice(0, idx);
  const match  = label.slice(idx, idx + props.query.length);
  const after  = label.slice(idx + props.query.length);
  return `${escape(before)}<mark>${escape(match)}</mark>${escape(after)}`;
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
</script>

<template>
  <li
    class="tux-docs-sidebar__item"
    :class="{ 'tux-docs-sidebar__item--has-children': hasChildren }"
  >
    <!-- Section with children: <details>/<summary> for native collapse. -->
    <details
      v-if="hasChildren"
      :open="open"
      class="tux-docs-sidebar__group"
      @toggle="(e) => onToggle(path, (e.target as HTMLDetailsElement).open)"
    >
      <summary class="tux-docs-sidebar__summary" :class="`tux-docs-sidebar__summary--depth-${depth}`">
        <Icon
          v-if="section.icon"
          :name="section.icon"
          class="tux-docs-sidebar__icon"
          aria-hidden="true"
        />
        <span class="tux-docs-sidebar__label" v-html="highlight(section.label)" />
        <Icon
          name="lucide:chevron-right"
          class="tux-docs-sidebar__chevron"
          aria-hidden="true"
        />
      </summary>
      <ul
        class="tux-docs-sidebar__sublist"
        :class="{ 'tux-docs-sidebar__sublist--active-trail': inActiveTrail }"
      >
        <TuxDocsSidebarNode
          v-for="child in section.children"
          :key="child.label"
          :section="child"
          :path="pathOf(child)"
          :query="query"
          :open-map="openMap"
          :is-open="isOpen"
          :is-active="isActive"
          :on-toggle="onToggle"
          :depth="depth + 1"
        />
      </ul>
    </details>

    <!-- Leaf link -->
    <NuxtLink
      v-else-if="section.to"
      :to="section.to"
      class="tux-docs-sidebar__link"
      :class="[`tux-docs-sidebar__link--depth-${depth}`, { 'tux-docs-sidebar__link--active': isActive(section) }]"
    >
      <Icon
        v-if="section.icon"
        :name="section.icon"
        class="tux-docs-sidebar__icon"
        aria-hidden="true"
      />
      <span v-html="highlight(section.label)" />
    </NuxtLink>

    <!-- Childless non-link (rare; section header without nav) -->
    <span
      v-else
      class="tux-docs-sidebar__heading"
      :class="`tux-docs-sidebar__heading--depth-${depth}`"
      v-html="highlight(section.label)"
    />
  </li>
</template>

<style scoped>
.tux-docs-sidebar__item {
  list-style: none;
}

.tux-docs-sidebar__group {
  /* Collapse state managed by `<details>` + emitted via @toggle. */
}

.tux-docs-sidebar__summary {
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  padding: 0.375rem 0.5rem;
  cursor: pointer;
  list-style: none;
  user-select: none;
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  color: var(--text-primary);
  transition: background-color 0.15s ease;
}

.tux-docs-sidebar__summary::-webkit-details-marker {
  display: none;
}

.tux-docs-sidebar__summary:hover {
  background: var(--surface-sunken);
}

.tux-docs-sidebar__summary--depth-0 {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-secondary);
  padding: 0.5rem 0.5rem;
}

.tux-docs-sidebar__summary--depth-1,
.tux-docs-sidebar__summary--depth-2 {
  font-weight: 600;
}

.tux-docs-sidebar__icon {
  flex-shrink: 0;
  width: 0.875rem;
  height: 0.875rem;
  opacity: 0.7;
}

.tux-docs-sidebar__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tux-docs-sidebar__label :deep(mark) {
  background: color-mix(in srgb, var(--brand-accent) 50%, transparent);
  color: inherit;
  padding: 0 1px;
  border-radius: 1px;
}

.tux-docs-sidebar__chevron {
  flex-shrink: 0;
  width: 0.75rem;
  height: 0.75rem;
  color: var(--text-muted);
  transition: transform 0.18s ease;
}

.tux-docs-sidebar__group[open] > .tux-docs-sidebar__summary .tux-docs-sidebar__chevron {
  transform: rotate(90deg);
}

/* Indent guide — single thin neutral vertical line per nesting
   level. The line stays the same neutral gray whether or not a
   descendant is active; the active item's pill alone carries the
   "you are here" affordance. This matches the docs-it-tamu-edu
   and docs-tti-tamu-edu sidebar pattern. */
.tux-docs-sidebar__sublist {
  list-style: none;
  margin: 0.125rem 0 0.375rem;
  padding: 0 0 0 0.75rem;
  margin-left: 0.6rem;
  position: relative;
  border-left: 1px solid var(--surface-border);
  display: grid;
  gap: 0.125rem;
}

/* Horizontal connector tick from the guide line to each child
   item — neutral gray, always. Drawn on the <li> (item) so the
   tick aligns with the row regardless of whether the child renders
   as a link, summary, or heading. */
.tux-docs-sidebar__sublist > .tux-docs-sidebar__item {
  position: relative;
}

.tux-docs-sidebar__sublist > .tux-docs-sidebar__item::before {
  content: "";
  position: absolute;
  left: -0.75rem;
  top: 0.85rem;
  width: 0.55rem;
  border-top: 1px solid var(--surface-border);
}

/* Cap the vertical guide at the last child — paint over the line
   below the last tick using the surface color, so the guide ends
   cleanly at the final item rather than dangling past it. */
.tux-docs-sidebar__sublist > .tux-docs-sidebar__item:last-child::after {
  content: "";
  position: absolute;
  left: -0.76rem;
  top: 0.85rem;
  bottom: 0;
  width: 2px;
  background: var(--surface-page);
}

.tux-docs-sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  padding: 0.3125rem 0.5rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: background-color 0.15s ease, color 0.15s ease;
}

.tux-docs-sidebar__link:hover {
  background: var(--surface-sunken);
  color: var(--text-primary);
}

/* Active item — soft pink pill, fully rounded on all four
   corners. No left bar, no trail-color change on the guide line,
   no negative margins. The pill alone reads as "you are here";
   the neutral guide + tick give the parent-child context. Bold
   maroon text is the primary affordance. */
.tux-docs-sidebar__link--active {
  color: var(--brand-primary);
  font-weight: 700;
  background: color-mix(in srgb, var(--brand-primary) 12%, transparent);
}

/* Summary rows whose subtree contains the active item get bold
   maroon text + chevron, so the eye can trace the section header
   back to the active page. The guide line itself stays neutral. */
.tux-docs-sidebar__group:has(.tux-docs-sidebar__link--active) > .tux-docs-sidebar__summary {
  color: var(--brand-primary);
}

.tux-docs-sidebar__group:has(.tux-docs-sidebar__link--active) > .tux-docs-sidebar__summary .tux-docs-sidebar__chevron {
  color: var(--brand-primary);
}

.tux-docs-sidebar__heading {
  display: block;
  padding: 0.5rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-secondary);
}
</style>
