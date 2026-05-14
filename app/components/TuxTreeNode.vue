<script setup lang="ts">
// TuxTreeNode — single row in TuxTree. Recursive: if the node has
// children and is expanded, renders itself again for each child.
//
// All state lives in the parent TuxTree (expand set, selection) —
// this component receives the relevant slice via props and emits
// changes back up. Keeps the tree single-source-of-truth so
// keyboard nav / expand-all / persistence stay easy to reason about.

import type { TreeItem } from "./TuxTree.vue";

interface Props {
  node: TreeItem;
  /** Indentation depth (0-based). */
  depth: number;
  /** Currently selected node id (from parent). */
  selectedId?: string;
  /** Whether a given node id is expanded (queried via callback). */
  isExpanded: (id: string) => boolean;
  /** Pass through to nested calls. */
  showGuides: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  toggle: [id: string];
  select: [id: string];
}>();

const hasChildren = computed(() =>
  Array.isArray(props.node.children) && props.node.children.length > 0,
);

const open = computed(() => hasChildren.value && props.isExpanded(props.node.id));

const isSelected = computed(() => props.selectedId === props.node.id);

// Default icon: folder when there are children, file when leaf. Caller
// can override with `node.icon`.
const defaultIcon = computed(() => {
  if (props.node.icon) return props.node.icon;
  return hasChildren.value
    ? (open.value ? "lucide:folder-open" : "lucide:folder")
    : "lucide:file";
});

const indentRem = computed(() => props.depth * 1.125);

function handleClick() {
  // Click on a leaf selects; click on a branch toggles AND selects so
  // keyboard nav has a sensible anchor.
  emit("select", props.node.id);
  if (hasChildren.value) emit("toggle", props.node.id);
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    handleClick();
  } else if (e.key === "ArrowRight" && hasChildren.value && !open.value) {
    e.preventDefault();
    emit("toggle", props.node.id);
  } else if (e.key === "ArrowLeft" && hasChildren.value && open.value) {
    e.preventDefault();
    emit("toggle", props.node.id);
  }
}

// Use a div with role="button" rather than a real <button>. The
// surrounding [role="tree"] / [role="treeitem"] / [role="group"]
// semantics already announce the row as interactive; using a div
// sidesteps Tailwind v4's @layer base button-reset, which would
// otherwise win over scoped rules for background-color via layer
// cascade order.
const rowComponent = computed<string>(() => {
  if (props.node.to) return "NuxtLink";
  if (props.node.href) return "a";
  return "div";
});

const rowAttrs = computed<Record<string, unknown>>(() => {
  if (props.node.to) return { to: props.node.to };
  if (props.node.href) {
    return {
      href: props.node.href,
      target: props.node.href.startsWith("http") ? "_blank" : undefined,
      rel: props.node.href.startsWith("http") ? "noopener" : undefined,
    };
  }
  return {
    role: "button",
    tabindex: 0,
  };
});
</script>

<template>
  <li
    class="tux-tree__node"
    role="treeitem"
    :aria-expanded="hasChildren ? open : undefined"
    :aria-selected="isSelected || undefined"
  >
    <component
      :is="rowComponent"
      v-bind="rowAttrs"
      class="tux-tree__row"
      :class="{
        'tux-tree__row--branch': hasChildren,
        'tux-tree__row--leaf': !hasChildren,
        'tux-tree__row--selected': isSelected,
        'tux-tree__row--mono': node.mono,
      }"
      :style="{ paddingLeft: `${indentRem + 0.5}rem` }"
      @click="handleClick"
      @keydown="handleKeydown"
    >
      <Icon
        v-if="hasChildren"
        :name="open ? 'lucide:chevron-down' : 'lucide:chevron-right'"
        class="tux-tree__chevron"
        aria-hidden="true"
      />
      <span v-else class="tux-tree__chevron-spacer" aria-hidden="true" />

      <Icon
        :name="defaultIcon"
        class="tux-tree__icon"
        :class="{ 'tux-tree__icon--branch': hasChildren }"
        aria-hidden="true"
      />

      <span class="tux-tree__label-block">
        <span class="tux-tree__label">{{ node.label }}</span>
        <span v-if="node.description" class="tux-tree__description">{{ node.description }}</span>
      </span>

      <span v-if="node.badge !== undefined && node.badge !== ''" class="tux-tree__badge">
        {{ node.badge }}
      </span>
    </component>

    <ul
      v-if="hasChildren && open"
      class="tux-tree__children"
      :class="{ 'tux-tree__children--guides': showGuides }"
      role="group"
      :style="{ '--tux-tree-guide-offset': `${indentRem + 1.4375}rem` }"
    >
      <TuxTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :selected-id="selectedId"
        :is-expanded="isExpanded"
        :show-guides="showGuides"
        @toggle="(id) => emit('toggle', id)"
        @select="(id) => emit('select', id)"
      />
    </ul>
  </li>
</template>

<style scoped>
.tux-tree__node {
  margin: 0;
  padding: 0;
  list-style: none;
}

.tux-tree__row {
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  width: 100%;
  padding: 0.3125rem 0.75rem 0.3125rem 0.5rem;
  background: transparent;
  border: 0;
  border-left: 2px solid transparent;
  text-align: left;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--text-primary);
  text-decoration: none;
  cursor: pointer;
}

.tux-tree__row:hover {
  background: color-mix(in srgb, var(--brand-primary) 6%, transparent);
}

.tux-tree__row:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
  border-radius: var(--radius-sm);
}

/* Selected row. !important + a more specific selector defends against
   Tailwind v4's @layer base resets and Nuxt UI's @layer utilities
   `background-color: var(--ui-*)` rules that win over scoped CSS due
   to layer cascade order (later layers beat unlayered with normal
   declarations; only !important inside an unlayered rule reliably
   defeats them). */
.tux-tree__node > .tux-tree__row--selected {
  background: color-mix(in srgb, var(--brand-primary) 10%, transparent) !important;
  border-left-color: var(--brand-primary) !important;
}

.tux-tree__row--selected .tux-tree__label,
.tux-tree__row--selected .tux-tree__icon {
  color: var(--brand-primary);
}

.tux-tree__row--mono .tux-tree__label {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--brand-primary);
}

.tux-tree__chevron {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.tux-tree__row--selected .tux-tree__chevron {
  color: var(--brand-primary);
}

.tux-tree__chevron-spacer {
  width: 0.875rem;
  flex-shrink: 0;
}

.tux-tree__icon {
  width: 0.9375rem;
  height: 0.9375rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.tux-tree__icon--branch {
  color: var(--brand-primary);
  opacity: 0.85;
}

.tux-tree__label-block {
  display: flex;
  flex-direction: column;
  gap: 0.0625rem;
  min-width: 0;
  flex: 1;
}

.tux-tree__label {
  font-family: var(--font-body);
  font-weight: 500;
  line-height: 1.3;
  color: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tux-tree__description {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tux-tree__badge {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-muted);
  background: var(--surface-sunken);
  padding: 0.0625rem 0.4375rem;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

/* Children list. Optional sand guide line under the parent row. */
.tux-tree__children {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}

.tux-tree__children--guides::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0.3125rem;
  left: var(--tux-tree-guide-offset);
  width: 1px;
  background: var(--surface-border);
  pointer-events: none;
}

/* Container-query density — at narrow widths (<= 280px), drop the
   description line and tighten padding. Per CLAUDE.md rule 1. */
@container tux-tree (max-width: 280px) {
  .tux-tree__description {
    display: none;
  }
  .tux-tree__row {
    padding: 0.25rem 0.5rem 0.25rem 0.5rem;
    font-size: 0.8125rem;
  }
}
</style>
