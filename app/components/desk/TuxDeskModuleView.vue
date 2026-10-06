<script setup lang="ts">
/**
 * TuxDeskModuleView — TipTap NodeView wrapper for visual module blocks.
 * Renders the live component preview, plus an interactive property editor when selected.
 */
import type { NodeViewProps } from "@tiptap/core";
import { NodeViewWrapper, nodeViewProps } from "@tiptap/vue-3";
import { assertNever } from "../../utils/desk/types";
import {
  isModuleKind,
  moduleSpec,
  type ModuleFieldKind,
  moduleGridStyle,
  calcGridColumnFromCoord,
} from "../../utils/desk/modules";
import TuxDeskModuleBlock from "./TuxDeskModuleBlock.vue";

const props = defineProps(nodeViewProps) as NodeViewProps;

const activeGridHighlight = inject<Ref<{ start: number; end: number } | null> | null>("tuxActiveGridHighlight", null);

const kind = computed(() => {
  const value = String(props.node.attrs.kind || "");
  return isModuleKind(value) ? value : "callout";
});

const spec = computed(() => moduleSpec(kind.value));

const rawPayload = computed(() => {
  const raw = props.node.attrs.payload;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, string>;
  }
  return {} as Record<string, string>;
});

const colStart = computed(() => {
  return Math.min(12, Math.max(1, parseInt(rawPayload.value._colStart || "1", 10) || 1));
});

const colSpan = computed(() => {
  return Math.min(13 - colStart.value, Math.max(1, parseInt(rawPayload.value._colSpan || "12", 10) || 12));
});

const colEnd = computed(() => colStart.value + colSpan.value - 1);

const blockAlign = computed(() => (rawPayload.value._align || "").toLowerCase());

function fieldControl(fieldKind: ModuleFieldKind): "select" | "textarea" | "input" {
  switch (fieldKind) {
    case "select": return "select";
    case "textarea": return "textarea";
    case "text":
    case "url": return "input";
    default: return assertNever(fieldKind, "module field kind");
  }
}

function fieldValue(key: string): string {
  return rawPayload.value[key] ?? spec.value.defaults[key] ?? "";
}

function setField(key: string, value: string) {
  props.updateAttributes({
    payload: {
      ...rawPayload.value,
      [key]: value.slice(0, 2000),
    },
  });
}

function onFieldInput(key: string, event: Event) {
  const target = event.target;
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  ) {
    setField(key, target.value);
  }
}

const nodeWrapperRef = ref<any>(null);
const isResizing = ref(false);
const dragWidthPercent = ref<number | null>(null);
const dragSpanCols = ref<number | null>(null);
const dragStartCol = ref<number | null>(null);
const dragEndCol = ref<number | null>(null);
const isSnapped = ref(false);

const computedGridStyle = computed(() => {
  if (isResizing.value && dragStartCol.value !== null && dragEndCol.value !== null) {
    const start = dragStartCol.value;
    const span = dragEndCol.value - start + 1;
    const leftPct = `${Math.round(((start - 1) / 12) * 10000) / 100}%`;
    const widthPct = `${Math.round((span / 12) * 10000) / 100}%`;
    return {
      width: widthPct,
      maxWidth: "100%",
      marginLeft: leftPct,
      marginRight: "auto",
    };
  }
  return moduleGridStyle(rawPayload.value);
});

function onHoverStart() {
  if (activeGridHighlight) {
    activeGridHighlight.value = {
      start: dragStartCol.value ?? colStart.value,
      end: dragEndCol.value ?? colEnd.value,
    };
  }
}

function onHoverEnd() {
  if (!isResizing.value && activeGridHighlight) {
    activeGridHighlight.value = null;
  }
}

function setColumns(start: number, span: number, align?: string) {
  const clampedStart = Math.max(1, Math.min(12, start));
  const clampedSpan = Math.max(1, Math.min(13 - clampedStart, span));
  const payload: Record<string, string> = {
    ...rawPayload.value,
    _colStart: String(clampedStart),
    _colSpan: String(clampedSpan),
    _width: `${Math.round((clampedSpan / 12) * 100)}%`,
  };
  if (align !== undefined) {
    payload._align = align;
  }
  props.updateAttributes({ payload });
  if (activeGridHighlight) {
    activeGridHighlight.value = {
      start: clampedStart,
      end: clampedStart + clampedSpan - 1,
    };
  }
}

function shiftColumns(delta: -1 | 1) {
  const newStart = colStart.value + delta;
  if (newStart >= 1 && newStart + colSpan.value - 1 <= 12) {
    setColumns(newStart, colSpan.value, "");
  }
}

function setBlockAlign(align: "left" | "center" | "right") {
  setColumns(colStart.value, colSpan.value, align);
}

function setSpanPreset(span: number) {
  let start = colStart.value;
  if (start + span - 1 > 12) {
    start = Math.max(1, 13 - span);
  }
  setColumns(start, span, blockAlign.value);
}

function startResize(handle: "left" | "right" | "bottom-left" | "bottom-right", event: MouseEvent | PointerEvent) {
  if (isResizing.value) return;
  event.preventDefault();
  event.stopPropagation();

  const el = (nodeWrapperRef.value?.$el || nodeWrapperRef.value) as HTMLElement | null;
  if (!el) return;

  const parentEl = (el.closest(".ProseMirror") || el.parentElement) as HTMLElement | null;
  if (!parentEl) return;

  isResizing.value = true;
  const parentRect = parentEl.getBoundingClientRect();

  const initialStart = colStart.value;
  const initialEnd = colEnd.value;
  let currentStart = initialStart;
  let currentEnd = initialEnd;

  dragStartCol.value = currentStart;
  dragEndCol.value = currentEnd;
  dragSpanCols.value = currentEnd - currentStart + 1;
  dragWidthPercent.value = Math.round((dragSpanCols.value / 12) * 100);

  if (activeGridHighlight) {
    activeGridHighlight.value = { start: currentStart, end: currentEnd };
  }

  el.style.transition = "none";

  function onMove(e: MouseEvent | PointerEvent) {
    const hoveredCol = calcGridColumnFromCoord(e.clientX, parentRect, 12);

    if (handle === "right" || handle === "bottom-right") {
      // Lock start, move end: must be >= currentStart and <= 12
      currentEnd = Math.max(initialStart, Math.min(12, hoveredCol));
    } else {
      // Lock end, move start: must be >= 1 and <= initialEnd
      currentStart = Math.max(1, Math.min(initialEnd, hoveredCol));
    }

    const newSpan = currentEnd - currentStart + 1;
    dragStartCol.value = currentStart;
    dragEndCol.value = currentEnd;
    dragSpanCols.value = newSpan;
    dragWidthPercent.value = Math.round((newSpan / 12) * 100);
    isSnapped.value = true;

    if (activeGridHighlight) {
      activeGridHighlight.value = { start: currentStart, end: currentEnd };
    }

    // Zero-latency DOM updates during drag
    const leftPct = `${Math.round(((currentStart - 1) / 12) * 10000) / 100}%`;
    const widthPct = `${Math.round((newSpan / 12) * 10000) / 100}%`;
    el.style.marginLeft = leftPct;
    el.style.marginRight = "auto";
    el.style.width = widthPct;
  }

  function onEnd() {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onEnd);
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onEnd);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    const finalStart = dragStartCol.value ?? initialStart;
    const finalEnd = dragEndCol.value ?? initialEnd;
    const finalSpan = finalEnd - finalStart + 1;

    setColumns(finalStart, finalSpan, "");

    el.style.transition = "";
    isResizing.value = false;
    dragStartCol.value = null;
    dragEndCol.value = null;
    dragSpanCols.value = null;
    dragWidthPercent.value = null;
  }

  document.body.style.cursor = handle.includes("bottom") ? "nwse-resize" : "ew-resize";
  document.body.style.userSelect = "none";

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerup", onEnd);
  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mouseup", onEnd);
}

function moveNode(direction: -1 | 1) {
  const pos = props.getPos();
  if (typeof pos !== "number") return;
  const doc = props.editor.state.doc;
  const node = props.node;
  const $pos = doc.resolve(pos);
  const index = $pos.index();

  if (direction === -1 && index > 0) {
    const prevPos = $pos.posAtIndex(index - 1);
    const tr = props.editor.state.tr;
    tr.delete(pos, pos + node.nodeSize);
    tr.insert(prevPos, node);
    props.editor.view.dispatch(tr);
  } else if (direction === 1 && index < $pos.parent.childCount - 1) {
    const nextChild = $pos.parent.child(index + 1);
    const tr = props.editor.state.tr;
    tr.delete(pos, pos + node.nodeSize);
    tr.insert(pos + nextChild.nodeSize, node);
    props.editor.view.dispatch(tr);
  }
}
</script>

<template>
  <NodeViewWrapper
    ref="nodeWrapperRef"
    as="div"
    class="tux-desk-node-view transition-all duration-200 relative group"
    :class="{
      'tux-desk-node-view--selected': selected,
      'tux-desk-node-view--resizing': isResizing,
    }"
    :style="computedGridStyle"
    @mouseenter="onHoverStart"
    @mouseleave="onHoverEnd"
  >
    <!-- Floating Drag Sizing Tooltip Badge -->
    <div
      v-if="isResizing"
      class="tux-desk-resize-badge pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-brand-primary text-text-on-brand font-mono text-[11px] font-bold shadow-lg z-30 flex items-center gap-1.5 whitespace-nowrap"
    >
      <UIcon name="lucide:grid" class="w-3.5 h-3.5" />
      <span>Cols {{ dragStartCol }}–{{ dragEndCol }} ({{ dragSpanCols }}/12 · {{ dragWidthPercent }}%)</span>
      <span v-if="isSnapped" class="text-[9px] bg-white/25 px-1 py-0.5 rounded font-mono uppercase tracking-wider">Snap</span>
    </div>

    <!-- Edge & Corner Resize Handles (active when editable) -->
    <template v-if="editor.isEditable">
      <!-- Left Edge Drag Handle -->
      <div
        class="tux-desk-resize-handle tux-desk-resize-handle--left"
        data-resize-handle
        draggable="false"
        title="Drag left edge to resize block width (snaps to 12 columns)"
        @pointerdown.stop.prevent="startResize('left', $event)"
        @mousedown.stop.prevent="startResize('left', $event)"
      >
        <div class="tux-desk-resize-handle__pill" />
      </div>

      <!-- Right Edge Drag Handle -->
      <div
        class="tux-desk-resize-handle tux-desk-resize-handle--right"
        data-resize-handle
        draggable="false"
        title="Drag right edge to resize block width (snaps to 12 columns)"
        @pointerdown.stop.prevent="startResize('right', $event)"
        @mousedown.stop.prevent="startResize('right', $event)"
      >
        <div class="tux-desk-resize-handle__pill" />
      </div>

      <!-- Corner Handles -->
      <div
        class="tux-desk-resize-handle tux-desk-resize-handle--corner-left"
        data-resize-handle
        draggable="false"
        title="Drag corner to resize block"
        @pointerdown.stop.prevent="startResize('bottom-left', $event)"
        @mousedown.stop.prevent="startResize('bottom-left', $event)"
      />
      <div
        class="tux-desk-resize-handle tux-desk-resize-handle--corner-right"
        data-resize-handle
        draggable="false"
        title="Drag corner to resize block"
        @pointerdown.stop.prevent="startResize('bottom-right', $event)"
        @mousedown.stop.prevent="startResize('bottom-right', $event)"
      />
    </template>

    <!-- Module Header Ribbon -->
    <div class="tux-desk-node-view__bar">
      <div class="flex items-center gap-1.5 min-w-0">
        <span
          data-drag-handle
          class="cursor-grab active:cursor-grabbing p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-raised flex items-center flex-shrink-0"
          title="Drag block to reorder"
        >
          <UIcon name="lucide:grip-vertical" class="w-3.5 h-3.5" />
        </span>
        <UIcon name="lucide:blocks" class="w-3.5 h-3.5 text-brand-primary flex-shrink-0" aria-hidden="true" />
        <span class="tux-desk-node-view__kind truncate">{{ spec.label }}</span>
      </div>

      <!-- Center: Grid Footprint, Alignment & Presets -->
      <div class="flex items-center gap-1 bg-surface-raised p-0.5 rounded border border-surface-border text-[10px] font-mono flex-shrink-0">
        <!-- Footprint indicator -->
        <span
          class="px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary font-bold flex items-center gap-1"
          title="Grid Column Span"
        >
          <UIcon name="lucide:grid" class="w-3 h-3" />
          <span>Cols {{ colStart }}–{{ colEnd }} ({{ colSpan }}/12)</span>
        </span>

        <div class="h-3 w-px bg-surface-border mx-0.5" />

        <!-- Quick Align -->
        <div class="flex items-center gap-0.5">
          <button
            type="button"
            class="px-1 py-0.5 rounded transition-colors"
            :class="blockAlign === 'left' ? 'bg-brand-primary text-text-on-brand font-bold' : 'text-text-muted hover:text-text-primary'"
            title="Align Left"
            aria-label="Align Left"
            @click.stop="setBlockAlign('left')"
          >
            <UIcon name="lucide:align-left" class="w-3 h-3" />
          </button>
          <button
            type="button"
            class="px-1 py-0.5 rounded transition-colors"
            :class="blockAlign === 'center' || (!blockAlign && colStart > 1 && colStart + colSpan - 1 < 12) ? 'bg-brand-primary text-text-on-brand font-bold' : 'text-text-muted hover:text-text-primary'"
            title="Align Center"
            aria-label="Align Center"
            @click.stop="setBlockAlign('center')"
          >
            <UIcon name="lucide:align-center" class="w-3 h-3" />
          </button>
          <button
            type="button"
            class="px-1 py-0.5 rounded transition-colors"
            :class="blockAlign === 'right' ? 'bg-brand-primary text-text-on-brand font-bold' : 'text-text-muted hover:text-text-primary'"
            title="Align Right"
            aria-label="Align Right"
            @click.stop="setBlockAlign('right')"
          >
            <UIcon name="lucide:align-right" class="w-3 h-3" />
          </button>
        </div>

        <div class="h-3 w-px bg-surface-border mx-0.5" />

        <!-- Shift Column -->
        <div class="flex items-center gap-0.5">
          <button
            type="button"
            class="p-0.5 rounded text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="colStart <= 1"
            title="Shift 1 column left"
            aria-label="Shift 1 column left"
            @click.stop="shiftColumns(-1)"
          >
            <UIcon name="lucide:chevron-left" class="w-3 h-3" />
          </button>
          <button
            type="button"
            class="p-0.5 rounded text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="colEnd >= 12"
            title="Shift 1 column right"
            aria-label="Shift 1 column right"
            @click.stop="shiftColumns(1)"
          >
            <UIcon name="lucide:chevron-right" class="w-3 h-3" />
          </button>
        </div>

        <div class="h-3 w-px bg-surface-border mx-0.5" />

        <!-- Span Presets -->
        <button
          v-for="s in [12, 8, 6, 4]"
          :key="s"
          type="button"
          class="px-1 py-0.5 rounded transition-colors"
          :class="colSpan === s ? 'bg-brand-primary text-text-on-brand font-bold' : 'text-text-muted hover:text-text-primary'"
          :title="`Span ${s} columns (${Math.round((s/12)*100)}%)`"
          :aria-label="`Span ${s} columns`"
          @click.stop="setSpanPreset(s)"
        >
          {{ s }}c
        </button>
      </div>

      <!-- Right Actions: Move Up, Move Down, Remove -->
      <div class="flex items-center gap-0.5 flex-shrink-0">
        <button
          type="button"
          class="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-raised"
          title="Move block up"
          aria-label="Move block up"
          @click.stop="moveNode(-1)"
        >
          <UIcon name="lucide:arrow-up" class="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          class="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-raised"
          title="Move block down"
          aria-label="Move block down"
          @click.stop="moveNode(1)"
        >
          <UIcon name="lucide:arrow-down" class="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          class="tux-desk-node-view__remove p-1"
          :disabled="!editor.isEditable"
          title="Remove module"
          aria-label="Remove module"
          @click.stop="deleteNode"
        >
          <UIcon name="lucide:trash-2" class="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Live Component Preview -->
    <div class="tux-desk-node-view__preview" @click.prevent>
      <TuxDeskModuleBlock :kind="kind" :payload="rawPayload" />
    </div>

    <!-- Inspector Drawer (when selected) -->
    <div
      v-if="selected && editor.isEditable"
      class="tux-desk-node-view__inspector"
      contenteditable="false"
      @keydown.stop
      @mousedown.stop
    >
      <p class="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
        Configure {{ spec.label }}
      </p>

      <div class="space-y-3">
        <div
          v-for="field in spec.fields"
          :key="field.key"
          class="tux-desk-node-view__field"
        >
          <label :for="`desk-field-${field.key}`" class="block text-xs font-semibold text-text-muted mb-1">
            {{ field.label }}
          </label>

          <select
            v-if="fieldControl(field.kind) === 'select'"
            :id="`desk-field-${field.key}`"
            :value="fieldValue(field.key)"
            :aria-label="field.label"
            class="tux-desk-node-view__input"
            @change="onFieldInput(field.key, $event)"
          >
            <option
              v-for="option in field.options || []"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <textarea
            v-else-if="fieldControl(field.kind) === 'textarea'"
            :id="`desk-field-${field.key}`"
            rows="2"
            :value="fieldValue(field.key)"
            :aria-label="field.label"
            class="tux-desk-node-view__input"
            @input="onFieldInput(field.key, $event)"
          />

          <input
            v-else
            :id="`desk-field-${field.key}`"
            type="text"
            :value="fieldValue(field.key)"
            :aria-label="field.label"
            class="tux-desk-node-view__input"
            @input="onFieldInput(field.key, $event)"
          />
        </div>
      </div>
    </div>
  </NodeViewWrapper>
</template>

<style scoped>
.tux-desk-node-view {
  position: relative;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  box-sizing: border-box;
  border-radius: var(--radius-md);
  border: 1px dashed var(--surface-border);
  background: var(--surface-raised);
  box-shadow: 0 2px 8px -2px color-mix(in srgb, var(--brand-primary) 8%, transparent);
  transition: width var(--motion-fast) var(--ease-standard), border-color var(--motion-fast) var(--ease-standard);
}

.tux-desk-node-view--selected {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 2px var(--wash-brand-22);
}

.tux-desk-node-view__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.875rem;
  border-bottom: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}

.tux-desk-node-view__kind {
  font-family: var(--font-bold);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-desk-node-view__remove {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-error, #dc2626);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--motion-fast) var(--ease-standard);
}

.tux-desk-node-view__remove:hover {
  background: color-mix(in srgb, var(--color-error, #dc2626) 12%, transparent);
  border-color: color-mix(in srgb, var(--color-error, #dc2626) 35%, transparent);
}

.tux-desk-node-view__preview {
  padding: 0.5rem 1rem;
}

.tux-desk-node-view__inspector {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  border-radius: 0 0 var(--radius-md) var(--radius-md);
}

.tux-desk-node-view__input {
  width: 100%;
  padding: 0.4rem 0.625rem;
  font-size: 0.8125rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-raised);
  color: var(--text-primary);
  outline: none;
  transition: border-color var(--motion-fast) var(--ease-standard);
}

.tux-desk-node-view__input option {
  background: var(--surface-raised);
  color: var(--text-primary);
}

.tux-desk-node-view__input:focus {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 1px var(--brand-primary);
}

/* Drag Resize Handles & Snapping Badge */
.tux-desk-resize-handle {
  position: absolute;
  z-index: 25;
  user-select: none;
}

.tux-desk-resize-handle--left {
  top: 50%;
  left: -8px;
  transform: translateY(-50%);
  width: 16px;
  height: 40px;
  cursor: ew-resize;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tux-desk-resize-handle--right {
  top: 50%;
  right: -8px;
  transform: translateY(-50%);
  width: 16px;
  height: 40px;
  cursor: ew-resize;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tux-desk-resize-handle__pill {
  width: 5px;
  height: 24px;
  border-radius: 9999px;
  background: var(--brand-primary);
  opacity: 0.7;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform var(--motion-fast) var(--ease-standard), opacity var(--motion-fast) var(--ease-standard);
}

.tux-desk-node-view:hover .tux-desk-resize-handle__pill,
.tux-desk-node-view--selected .tux-desk-resize-handle__pill {
  opacity: 1;
}

.tux-desk-resize-handle:hover .tux-desk-resize-handle__pill {
  transform: scaleY(1.15) scaleX(1.4);
  opacity: 1;
}

.tux-desk-resize-handle--corner-left {
  bottom: -5px;
  left: -5px;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: var(--brand-primary);
  border: 1px solid var(--surface-raised);
  cursor: nesw-resize;
  opacity: 0.6;
  transition: opacity var(--motion-fast) var(--ease-standard), transform var(--motion-fast) var(--ease-standard);
}

.tux-desk-resize-handle--corner-right {
  bottom: -5px;
  right: -5px;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: var(--brand-primary);
  border: 1px solid var(--surface-raised);
  cursor: nwse-resize;
  opacity: 0.6;
  transition: opacity var(--motion-fast) var(--ease-standard), transform var(--motion-fast) var(--ease-standard);
}

.tux-desk-node-view:hover .tux-desk-resize-handle--corner-left,
.tux-desk-node-view:hover .tux-desk-resize-handle--corner-right,
.tux-desk-node-view--selected .tux-desk-resize-handle--corner-left,
.tux-desk-node-view--selected .tux-desk-resize-handle--corner-right {
  opacity: 1;
}

.tux-desk-resize-handle--corner-left:hover,
.tux-desk-resize-handle--corner-right:hover {
  transform: scale(1.3);
  opacity: 1;
}

.tux-desk-node-view--resizing {
  transition: none !important;
  border-color: var(--brand-primary) !important;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--brand-primary) 35%, transparent) !important;
  user-select: none !important;
}

.tux-desk-resize-handle {
  touch-action: none;
  pointer-events: auto;
}

.tux-desk-node-view__preview :deep(.tux-desk-module) {
  margin: 0 !important;
  width: 100% !important;
}
</style>
