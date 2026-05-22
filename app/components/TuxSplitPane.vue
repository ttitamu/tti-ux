<script setup lang="ts">
/**
 * TuxSplitPane — in-page master-detail layout with optional bottom pane.
 *
 * Source: Microsoft Fabric "Multiview" pattern (see absorption notes
 * at reference/figma-cache/microsoft-fabric-ui-kit/NOTES.md §Absorb #1).
 * Common in BI / analytics tools — left pane is a list of records, right
 * pane is the selected record's detail, optional bottom pane shows
 * related data (history, comments, references).
 *
 * Geometry:
 *   - Two-pane (default): list left (320px default, resizable), detail
 *     right (fills).
 *   - Three-pane: same + bottom pane spanning both columns (160px
 *     default), pushed up from below.
 *
 * Behaviors:
 *   - **Resizable** drag handle between list and detail. Width persists
 *     via the `id` prop into localStorage (one entry per surface).
 *   - **Collapsible** list pane — drag below `minListWidth` collapses;
 *     a sliver shows a "show list" affordance.
 *   - **URL-bound selection** is the consumer's responsibility (they
 *     wire NuxtLink in the list slot; the detail slot reads route
 *     params). The component just provides the layout.
 *
 * Slots:
 *   #list     — left rail content (typically TuxLinkList, TuxTree,
 *              or TuxRichDataGrid)
 *   #detail   — main content (typically TuxPageHeader + body)
 *   #bottom   — optional bottom pane (typically TuxTabs with
 *              History / Comments / Related)
 *   #empty    — shown in detail slot when nothing is selected
 *              (defaults to a friendly TuxEmptyState if not provided)
 *
 * Reduced-motion: pane-resize stays instant either way (no animation
 * during drag); the collapse-to-sliver transition collapses to instant
 * on `prefers-reduced-motion: reduce`.
 */
import { computed, onMounted, ref, watch } from "vue";

interface Props {
  /** Selection ID. When truthy, the detail slot renders; when falsy,
   *  #empty (or default empty-state) renders. */
  modelValue?: string | number | null;
  /** Initial width of the list pane in CSS units. Default "320px". */
  initialListWidth?: string;
  /** Min width before the list collapses to sliver. Default 220 (px). */
  minListWidth?: number;
  /** Max list width. Default 560 (px). */
  maxListWidth?: number;
  /** Storage key for persisting list width. Required for resize
   *  persistence to work (each surface needs a unique key). */
  id?: string;
  /** Initial height of the bottom pane. Default "160px". */
  initialBottomHeight?: string;
  /** Show the bottom pane? Bound — toggle from consumer. */
  showBottom?: boolean;
  /** Accessible label for the list pane. */
  listLabel?: string;
  /** Accessible label for the detail pane. */
  detailLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  initialListWidth: "320px",
  minListWidth: 220,
  maxListWidth: 560,
  id: undefined,
  initialBottomHeight: "160px",
  showBottom: false,
  listLabel: "Records",
  detailLabel: "Detail",
});

defineEmits<{
  "update:modelValue": [value: string | number | null];
}>();

const listWidth = ref(props.initialListWidth);
const collapsed = ref(false);
const container = ref<HTMLElement | null>(null);

// Hydrate persisted width (if a storage id is provided).
onMounted(() => {
  if (typeof window === "undefined" || !props.id) return;
  try {
    const stored = localStorage.getItem(`tux-split-pane:${props.id}`);
    if (stored) {
      const parsed = JSON.parse(stored) as { width?: string; collapsed?: boolean };
      if (parsed.width) listWidth.value = parsed.width;
      if (typeof parsed.collapsed === "boolean") collapsed.value = parsed.collapsed;
    }
  } catch {
    // Ignore storage errors.
  }
});

watch([listWidth, collapsed], () => {
  if (typeof window === "undefined" || !props.id) return;
  try {
    localStorage.setItem(
      `tux-split-pane:${props.id}`,
      JSON.stringify({ width: listWidth.value, collapsed: collapsed.value })
    );
  } catch {
    // Ignore.
  }
});

// Resize drag — pointer-based.
let dragging = false;
let startX = 0;
let startWidthPx = 0;

function onHandleDown(e: PointerEvent) {
  if (!container.value) return;
  dragging = true;
  startX = e.clientX;
  const listEl = container.value.querySelector(".tux-split-pane__list") as HTMLElement | null;
  startWidthPx = listEl?.offsetWidth ?? 320;
  (e.target as HTMLElement).setPointerCapture(e.pointerId);
  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
}

function onHandleMove(e: PointerEvent) {
  if (!dragging) return;
  const delta = e.clientX - startX;
  let next = startWidthPx + delta;

  if (next < props.minListWidth) {
    collapsed.value = true;
    return;
  }
  collapsed.value = false;
  next = Math.min(props.maxListWidth, next);
  listWidth.value = `${Math.round(next)}px`;
}

function onHandleUp(e: PointerEvent) {
  dragging = false;
  (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
}

function toggleCollapsed() {
  collapsed.value = !collapsed.value;
}

const effectiveListWidth = computed(() => (collapsed.value ? "0px" : listWidth.value));
const hasSelection = computed(() => props.modelValue !== null && props.modelValue !== undefined);
const hasBottomSlot = computed(() => !!useSlots().bottom);
</script>

<template>
  <div ref="container" class="tux-split-pane" :class="{ 'tux-split-pane--has-bottom': showBottom && hasBottomSlot }">
    <div class="tux-split-pane__top">
      <aside
        class="tux-split-pane__list"
        :class="{ 'tux-split-pane__list--collapsed': collapsed }"
        :style="{ width: effectiveListWidth }"
        :aria-label="listLabel"
      >
        <slot name="list" />
      </aside>

      <button
        v-if="collapsed"
        type="button"
        class="tux-split-pane__expand-sliver"
        :aria-label="`Expand ${listLabel.toLowerCase()} pane`"
        @click="toggleCollapsed"
      >
        <Icon name="lucide:panel-left-open" :size="14" />
      </button>

      <button
        v-else
        type="button"
        class="tux-split-pane__handle"
        :aria-label="`Resize ${listLabel.toLowerCase()} pane (drag, or click to collapse)`"
        @pointerdown="onHandleDown"
        @pointermove="onHandleMove"
        @pointerup="onHandleUp"
        @dblclick="toggleCollapsed"
      />

      <main
        class="tux-split-pane__detail"
        :aria-label="detailLabel"
      >
        <slot v-if="hasSelection" name="detail" />
        <slot v-else name="empty">
          <TuxEmptyState
            kind="no-results"
            title="Nothing selected"
            description="Pick an item from the list to see details here."
          />
        </slot>
      </main>
    </div>

    <section
      v-if="showBottom && hasBottomSlot"
      class="tux-split-pane__bottom"
      :style="{ height: initialBottomHeight }"
      aria-label="Related"
    >
      <slot name="bottom" />
    </section>
  </div>
</template>

<style scoped>
.tux-split-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: var(--surface-page);
}

.tux-split-pane__top {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.tux-split-pane__list {
  flex-shrink: 0;
  border-right: 1px solid var(--surface-border);
  overflow-y: auto;
  background: var(--surface-page);
  transition: width 180ms ease-out;
}

.tux-split-pane__list--collapsed {
  width: 0 !important;
  border-right: none;
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .tux-split-pane__list {
    transition: none;
  }
}

.tux-split-pane__handle {
  width: 4px;
  flex-shrink: 0;
  background: transparent;
  border: 0;
  cursor: col-resize;
  padding: 0;
  position: relative;
}

.tux-split-pane__handle::after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--surface-border);
  opacity: 0;
  transition: opacity 120ms ease-out;
}

.tux-split-pane__handle:hover::after,
.tux-split-pane__handle:focus-visible::after {
  opacity: 1;
}

.tux-split-pane__expand-sliver {
  width: 22px;
  flex-shrink: 0;
  border: 0;
  background: var(--surface-sunken);
  color: var(--text-muted);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-right: 1px solid var(--surface-border);
  transition: background 80ms ease-out, color 80ms ease-out;
}

.tux-split-pane__expand-sliver:hover,
.tux-split-pane__expand-sliver:focus-visible {
  background: var(--surface-raised);
  color: var(--text-primary);
}

.tux-split-pane__detail {
  flex: 1;
  min-width: 0;
  overflow: auto;
  padding: 1.5rem;
}

.tux-split-pane__bottom {
  border-top: 1px solid var(--surface-border);
  overflow-y: auto;
  flex-shrink: 0;
  background: var(--surface-sunken);
  padding: 1rem 1.5rem;
}

/* Below tablet, fold the layout into a single column — the list pane
   becomes a full-width row above the detail, and the resize handle
   hides (handle is desktop-only ergonomics). */
@media (max-width: 47.99rem) {
  .tux-split-pane__top {
    flex-direction: column;
  }
  .tux-split-pane__list {
    width: 100% !important;
    max-height: 40vh;
    border-right: none;
    border-bottom: 1px solid var(--surface-border);
  }
  .tux-split-pane__handle,
  .tux-split-pane__expand-sliver {
    display: none;
  }
}
</style>
