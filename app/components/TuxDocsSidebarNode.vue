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

.tux-docs-sidebar__summary--depth-1 {
  font-weight: 600;
  padding-left: 1.125rem;
}

.tux-docs-sidebar__summary--depth-2 {
  padding-left: 1.875rem;
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

/* Indent guide — single thin vertical line per nesting level. The
   "active trail" modifier (set by the parent node when it contains
   the active route) thickens + colors this line so the eye can
   follow the maroon up the ancestor chain to the active item.
   This is what Drupal calls "active trail" and Microsoft Learn
   calls "tree guides with active state." */
.tux-docs-sidebar__sublist {
  list-style: none;
  margin: 0.125rem 0 0.375rem;
  padding: 0;
  margin-left: 0.875rem;
  border-left: 1px solid var(--surface-border);
  transition: border-color 0.15s ease;
}

.tux-docs-sidebar__sublist--active-trail {
  border-left-color: var(--brand-primary);
}

.tux-docs-sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  padding: 0.3125rem 0.5rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  /* Negative margin pulls the link's left edge over the parent
     sublist's border, so the active treatment "merges" with the
     trail line instead of stacking next to it. */
  border-left: 2px solid transparent;
  margin-left: -1px;
  position: relative;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.tux-docs-sidebar__link--depth-0 {
  padding-left: 0.5rem;
  border-radius: var(--radius-sm);
  margin-left: 0;
  border-left: 0;
}
.tux-docs-sidebar__link--depth-1 { padding-left: 1.125rem; }
.tux-docs-sidebar__link--depth-2 { padding-left: 1.875rem; }
.tux-docs-sidebar__link--depth-3 { padding-left: 2.625rem; }

/* Subtle horizontal connector — a tiny tick from the guide line to
   the link's left edge. Adds a small visual cue without going full
   ASCII-tree. Suppressed at depth 0 (no parent guide to connect to). */
.tux-docs-sidebar__link:not(.tux-docs-sidebar__link--depth-0)::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 0.4375rem;
  height: 1px;
  background: var(--surface-border);
  transform: translateY(-50%);
}

.tux-docs-sidebar__sublist--active-trail > .tux-docs-sidebar__item > .tux-docs-sidebar__link::before {
  background: var(--brand-primary);
}

/* On the active item, the 3px bar already connects to the trail
   guide on the left. The connector tick would just add a redundant
   visual note inside the rounded bg pill, so hide it — the bar +
   bg do the work cleanly. Inactive items keep their tick so the
   parent-child hierarchy stays readable. */
.tux-docs-sidebar__link--active::before {
  display: none;
}

.tux-docs-sidebar__link:hover {
  background: var(--surface-sunken);
  color: var(--text-primary);
}

/* Active item — rounded "card pill" with maroon left bar + soft
   tinted fill. The card-style rounded radius (matches --radius-md
   used elsewhere in the system) plus the bg fill turn the active
   row into a clearly bounded shape; the connector tick now visually
   flows INTO the rounded shape from the trail guide line, instead
   of floating with a white-space gap between them. Bold maroon
   text remains the primary affordance. */
.tux-docs-sidebar__link--active {
  color: var(--brand-primary);
  font-weight: 700;
  border-left-color: var(--brand-primary);
  /* Stronger fill (12%) so the card shape is clearly visible. 7%
     was nearly imperceptible against the page surface and read as
     "no fill" — the rounding wasn't doing visible work. 12% reads
     as a clear pink-tinted pill while still being soft enough not
     to compete with the body text. */
  background: color-mix(in srgb, var(--brand-primary) 12%, transparent);
  /* Round the right corners only. The left edge stays straight so
     it sits flush with the trail guide line — the active row reads
     as a "tab" coming out from the trail, not a free-floating
     pill. Matches the card radius (--radius-md). */
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.tux-docs-sidebar__link--active:not(.tux-docs-sidebar__link--depth-0) {
  /* 3px bar at the active item — heavier than the 2px ancestor
     guide lines so the eye lands on the active row first. Negative
     margin pulls the bar over the parent guide so they merge into
     a single continuous trail; the rounded bg starts at that same
     edge so the connector tick lands inside the pill, not before it. */
  border-left-width: 3px;
  margin-left: -2px;
}

/* Same treatment for summary rows in the active trail — when an
   ancestor is the trail, the chevron + label of the open section
   above the active item gets the brand color so the user can see
   "I'm inside this section" at a glance. */
.tux-docs-sidebar__group:has(.tux-docs-sidebar__link--active) > .tux-docs-sidebar__summary,
.tux-docs-sidebar__group:has(.tux-docs-sidebar__sublist--active-trail) > .tux-docs-sidebar__summary {
  color: var(--brand-primary);
}

.tux-docs-sidebar__group:has(.tux-docs-sidebar__link--active) > .tux-docs-sidebar__summary .tux-docs-sidebar__chevron,
.tux-docs-sidebar__group:has(.tux-docs-sidebar__sublist--active-trail) > .tux-docs-sidebar__summary .tux-docs-sidebar__chevron {
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
