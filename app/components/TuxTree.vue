<script setup lang="ts">
// TuxTree — hierarchical list. Use for:
//   - filesystem / corpus browsers (paths, JetBrains-mono leaf labels)
//   - sitemap / IA explorers (nav structure)
//   - BI dataset hierarchies (per ADR-0009 — dataset → tables → fields)
//   - any nested category navigation
//
// Native (not a UTree wrapper) — the visual is brand-specific (maroon
// expand markers, container-query density, monospace leaf option,
// optional sand guide lines) and the keyboard semantics are
// straightforward enough to own. Recursive: each node renders a
// `<TuxTreeNode>`, which renders any children as nested `<TuxTreeNode>`s.
//
// Expand state lives in the root component (a Set keyed by node `id`).
// Optionally persisted to sessionStorage via `storageKey`. Selection
// is a v-model so consumers can drive it from a route param.

import TuxTreeNode from "./TuxTreeNode.vue";

export interface TreeItem {
  /** Stable identifier. Used for expand state + selection. */
  id: string;
  /** Visible label. */
  label: string;
  /** Lucide icon (e.g. "lucide:folder"). Defaults to folder/file based on `children`. */
  icon?: string;
  /** Optional second line below label. */
  description?: string;
  /** Render label in --font-mono (paths, identifiers, hashes). */
  mono?: boolean;
  /** Internal route. Clicking navigates. */
  to?: string;
  /** External href. */
  href?: string;
  /** Right-side pill (e.g. row count, status). */
  badge?: string | number;
  /** Subtree. Absent → leaf. */
  children?: TreeItem[];
}

interface Props {
  items: TreeItem[];
  /** Initial expanded node IDs. Default expands every root-level node. */
  defaultExpanded?: string[];
  /** sessionStorage key for collapse persistence. Omit to disable. */
  storageKey?: string;
  /** Show 1px sand vertical guide lines under expanded parents. */
  showGuides?: boolean;
  /** ARIA tree label. */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  defaultExpanded: undefined,
  storageKey: undefined,
  showGuides: true,
  ariaLabel: "Tree",
});

// v-model:selected — currently selected node id. Optional; the tree
// works as a pure expand/collapse navigator without it.
const selected = defineModel<string | undefined>("selected");

// Build initial expanded set: caller-provided list, else every root item.
function buildInitialExpanded(): Set<string> {
  if (props.defaultExpanded) return new Set(props.defaultExpanded);
  return new Set(props.items.map(i => i.id));
}

const expanded = ref<Set<string>>(buildInitialExpanded());

// Hydrate from sessionStorage on mount. SSR-safe — server starts with
// the computed initial set so the first paint matches.
onMounted(() => {
  if (!props.storageKey || typeof window === "undefined") return;
  try {
    const raw = window.sessionStorage.getItem(props.storageKey);
    if (!raw) return;
    const ids = JSON.parse(raw) as string[];
    if (Array.isArray(ids)) expanded.value = new Set(ids);
  } catch {
    // Bad JSON — ignore and keep the initial set.
  }
});

function persist() {
  if (!props.storageKey || typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      props.storageKey,
      JSON.stringify([...expanded.value]),
    );
  } catch {
    // Storage quota / private mode — silent.
  }
}

function isExpanded(id: string): boolean {
  return expanded.value.has(id);
}

function toggle(id: string) {
  const next = new Set(expanded.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  expanded.value = next;
  persist();
}

function selectNode(id: string) {
  selected.value = id;
}

// Expose a few imperative methods for parents that want to drive
// expand-all / collapse-all from a toolbar.
function expandAll() {
  const all = new Set<string>();
  const walk = (nodes: TreeItem[]) => {
    for (const n of nodes) {
      if (n.children?.length) {
        all.add(n.id);
        walk(n.children);
      }
    }
  };
  walk(props.items);
  expanded.value = all;
  persist();
}

function collapseAll() {
  expanded.value = new Set();
  persist();
}

defineExpose({ expandAll, collapseAll });
</script>

<template>
  <ul
    class="tux-tree"
    :class="{ 'tux-tree--guides': showGuides }"
    role="tree"
    :aria-label="ariaLabel"
  >
    <TuxTreeNode
      v-for="item in items"
      :key="item.id"
      :node="item"
      :depth="0"
      :selected-id="selected"
      :is-expanded="isExpanded"
      :show-guides="showGuides"
      @toggle="toggle"
      @select="selectNode"
    />
  </ul>
</template>

<style scoped>
.tux-tree {
  list-style: none;
  margin: 0;
  padding: 0;
  container-type: inline-size;
  container-name: tux-tree;
  font-family: var(--font-body);
}
</style>
