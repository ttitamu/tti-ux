<script setup lang="ts">
// TuxDocsSidebar — hierarchical sidebar for documentation sites.
//
// Distinct from the style-guide sidebar in `app.vue` (which is a
// flat list, fine for a component catalog). Real doc sites need:
//
//   - hierarchical tree with collapsible parent sections
//   - active route highlighted including ancestors
//   - inline search input filtering the tree (matches label +
//     descendants — a hit deep in the tree expands its ancestors)
//   - persistent collapse state across navigation (sessionStorage)
//   - keyboard navigation (Tab + Enter on summary toggles)
//
// Built on native `<details>`/`<summary>` for the collapse mechanic
// — zero JS toggling, full keyboard access for free, and the
// browser's open-state attribute is what we persist.

interface DocsSection {
  /** Visible label. Required. */
  label: string;
  /** Internal route. If omitted, the entry acts as a non-link parent
   *  whose children are the actual destinations. */
  to?: string;
  /** Optional Lucide icon for top-level sections. */
  icon?: string;
  /** Nested sections. Renders as a collapsible group. */
  children?: DocsSection[];
}

interface Props {
  /** The doc tree. Top-level entries become section headings. */
  tree: DocsSection[];
  /** Heading rendered above the tree. */
  title?: string;
  /** Show inline search filter at the top. */
  search?: boolean;
  /** Placeholder for the search input. */
  searchPlaceholder?: string;
  /** Persist collapse state under this key (sessionStorage). Set to
   *  `null` to disable persistence. */
  storageKey?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Docs",
  search: true,
  searchPlaceholder: "Filter docs…",
  storageKey: "tux-docs-sidebar",
});

const route = useRoute();
const query = ref("");

// Persisted collapse state. Map of section path → isOpen. Defaults
// to "all collapsed unless on an ancestor of the active route."
const openMap = ref<Record<string, boolean>>({});

onMounted(() => {
  if (typeof window === "undefined" || !props.storageKey) return;
  try {
    const raw = window.sessionStorage.getItem(props.storageKey);
    if (raw) openMap.value = JSON.parse(raw);
  } catch { /* corrupt storage; ignore */ }
});

watch(openMap, (val) => {
  if (typeof window === "undefined" || !props.storageKey) return;
  try {
    window.sessionStorage.setItem(props.storageKey, JSON.stringify(val));
  } catch { /* quota or denied storage; ignore */ }
}, { deep: true });

function pathOf(section: DocsSection, parentPath: string): string {
  return parentPath ? `${parentPath}/${section.label}` : section.label;
}

function isActive(section: DocsSection): boolean {
  if (!section.to) return false;
  return route.path === section.to;
}

// True when the active route is at or below this section — used to
// auto-expand ancestors on initial load.
function containsActive(section: DocsSection): boolean {
  if (isActive(section)) return true;
  return section.children?.some(c => containsActive(c)) ?? false;
}

function isOpen(section: DocsSection, path: string): boolean {
  // Filter mode: open everything that has a match.
  if (query.value && hasMatch(section, query.value)) return true;
  // Manual override wins.
  if (path in openMap.value) return openMap.value[path]!;
  // Default: open if it's an ancestor of the active route.
  return containsActive(section);
}

function setOpen(path: string, open: boolean) {
  openMap.value = { ...openMap.value, [path]: open };
}

// Returns true if `section` (or any descendant) matches the query.
function hasMatch(section: DocsSection, q: string): boolean {
  const needle = q.toLowerCase();
  if (section.label.toLowerCase().includes(needle)) return true;
  return section.children?.some(c => hasMatch(c, needle)) ?? false;
}

const filteredTree = computed(() => {
  if (!query.value) return props.tree;
  return props.tree.filter(s => hasMatch(s, query.value));
});
</script>

<template>
  <aside
    class="tux-docs-sidebar"
    role="navigation"
    :aria-label="title"
  >
    <header class="tux-docs-sidebar__header">
      <h2 class="tux-docs-sidebar__title">{{ title }}</h2>
    </header>

    <div v-if="search" class="tux-docs-sidebar__search">
      <Icon name="lucide:search" class="tux-docs-sidebar__search-icon" aria-hidden="true" />
      <input
        v-model="query"
        type="search"
        :placeholder="searchPlaceholder"
        class="tux-docs-sidebar__search-input"
      >
      <button
        v-if="query"
        type="button"
        class="tux-docs-sidebar__search-clear"
        aria-label="Clear filter"
        @click="query = ''"
      >
        <Icon name="lucide:x" class="tux-docs-sidebar__search-clear-icon" />
      </button>
    </div>

    <p
      v-if="query && filteredTree.length === 0"
      class="tux-docs-sidebar__empty"
    >No docs match "{{ query }}".</p>

    <nav class="tux-docs-sidebar__nav">
      <ul class="tux-docs-sidebar__list">
        <TuxDocsSidebarNode
          v-for="section in filteredTree"
          :key="section.label"
          :section="section"
          :path="pathOf(section, '')"
          :query="query"
          :open-map="openMap"
          :is-open="(s, p) => isOpen(s, p)"
          :is-active="isActive"
          :on-toggle="setOpen"
          :depth="0"
        />
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.tux-docs-sidebar {
  container-type: inline-size;
  container-name: tux-docs-sidebar;
  width: 100%;
  max-width: 18rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
}

.tux-docs-sidebar__header {
  padding-bottom: 0.625rem;
  margin-bottom: 0.875rem;
  border-bottom: 2px solid var(--brand-primary);
}

.tux-docs-sidebar__title {
  margin: 0;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-primary);
}

.tux-docs-sidebar__search {
  position: relative;
  margin-bottom: 0.875rem;
}

.tux-docs-sidebar__search-icon {
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.875rem;
  height: 0.875rem;
  color: var(--text-muted);
  pointer-events: none;
}

.tux-docs-sidebar__search-input {
  width: 100%;
  padding: 0.4375rem 1.875rem 0.4375rem 1.875rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--text-primary);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  outline: 0;
  transition: border-color 0.15s ease;
}

.tux-docs-sidebar__search-input:focus-visible {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--brand-primary) 18%, transparent);
}

.tux-docs-sidebar__search-input::placeholder {
  font-style: italic;
  color: var(--text-muted);
}

.tux-docs-sidebar__search-clear {
  position: absolute;
  right: 0.375rem;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border: 0;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: var(--radius-sm);
}

.tux-docs-sidebar__search-clear:hover {
  background: var(--surface-sunken);
  color: var(--text-primary);
}

.tux-docs-sidebar__search-clear-icon {
  width: 0.75rem;
  height: 0.75rem;
}

.tux-docs-sidebar__empty {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--text-muted);
  font-style: italic;
}

.tux-docs-sidebar__nav {
  overflow-y: auto;
}

.tux-docs-sidebar__list {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
