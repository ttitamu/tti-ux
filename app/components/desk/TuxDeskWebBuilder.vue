<script setup lang="ts">
/**
 * TuxDeskWebBuilder.vue — Comprehensive Visual Web Builder & Source Authoring Suite.
 *
 * Combines:
 * - Visual WYSIWYG canvas with TUX component blocks
 * - Responsive viewport simulation (Desktop / Tablet / Mobile)
 * - Outline tree navigator with drag/drop/reordering
 * - Dedicated properties inspector panel
 * - Live bidirectional Source Editor (Markdown/MDC, Semantic HTML, JSON AST)
 * - Published preview simulation
 */
import type { JSONContent } from "@tiptap/core";
import { moduleSpec, type ModuleKind, isModuleKind } from "../../utils/desk/modules";
import { clonePresetDoc, type TuxDeskPreset } from "../../utils/desk/presets";
import TuxDeskEditor from "./TuxDeskEditor.client.vue";
import TuxDeskOutline from "./TuxDeskOutline.vue";
import TuxDeskInspector from "./TuxDeskInspector.vue";
import TuxDeskSourceEditor from "./TuxDeskSourceEditor.vue";
import TuxDeskArticle from "./TuxDeskArticle.vue";
import TuxDeskPresetPicker from "./TuxDeskPresetPicker.vue";

interface PageMeta {
  title: string;
  slug: string;
  reviewCadenceDays: number;
  status?: string;
}

interface Props {
  modelValue: JSONContent;
  pageMeta?: PageMeta;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  pageMeta: () => ({ title: "Untitled Page", slug: "untitled-page", reviewCadenceDays: 90 }),
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", doc: JSONContent): void;
  (e: "update:pageMeta", meta: PageMeta): void;
  (e: "update:html", html: string): void;
}>();

// Modes: visual (default) | split (side-by-side) | source (full code) | preview (rendered article)
type BuilderMode = "visual" | "split" | "source" | "preview";
type ViewportSize = "desktop" | "tablet" | "mobile";
type GridMode = "dots" | "cells" | "columns" | "none";
type DesktopWidthPreset = "fluid" | "1440" | "1140";

const activeMode = ref<BuilderMode>("visual");
const activeViewport = ref<ViewportSize>("desktop");
const gridMode = ref<GridMode>("dots");
const desktopWidthPreset = ref<DesktopWidthPreset>("fluid");

function cycleGridMode() {
  const modes: GridMode[] = ["dots", "cells", "columns", "none"];
  const nextIdx = (modes.indexOf(gridMode.value) + 1) % modes.length;
  gridMode.value = modes[nextIdx];
}

// Active 12-column track highlight shared with child module blocks
const activeGridHighlight = ref<{ start: number; end: number } | null>(null);
provide("tuxActiveGridHighlight", activeGridHighlight);

// Panels — responsive: start closed on smaller screens, open on wide screens
const showOutline = ref(false);
const showInspector = ref(false);
const showInserter = ref(false);
const showPresets = ref(false);
const activePresetId = ref<string | undefined>(undefined);

onMounted(() => {
  if (typeof window !== "undefined") {
    if (window.innerWidth >= 1400) {
      showOutline.value = true;
      showInspector.value = true;
    }
  }
});

// Active block selection
const selectedBlockIndex = ref<number | null>(null);

const currentDoc = computed({
  get: () => props.modelValue,
  set: (val: JSONContent) => emit("update:modelValue", val),
});

const selectedBlockNode = computed<JSONContent | null>(() => {
  if (selectedBlockIndex.value === null) return null;
  const content = currentDoc.value?.content || [];
  return content[selectedBlockIndex.value] || null;
});

// Reorder & Block Manipulation
function mutateDocContent(mutator: (content: JSONContent[]) => void) {
  const content = JSON.parse(JSON.stringify(currentDoc.value?.content || []));
  mutator(content);
  currentDoc.value = {
    ...currentDoc.value,
    content,
  };
}

function onSelectBlock(index: number) {
  selectedBlockIndex.value = index;
  // Auto-open inspector if closed
  showInspector.value = true;
}

function onMoveUp(index: number) {
  if (index <= 0) return;
  mutateDocContent((content) => {
    const temp = content[index - 1];
    content[index - 1] = content[index];
    content[index] = temp;
  });
  selectedBlockIndex.value = index - 1;
}

function onMoveDown(index: number) {
  const max = (currentDoc.value?.content?.length || 1) - 1;
  if (index >= max) return;
  mutateDocContent((content) => {
    const temp = content[index + 1];
    content[index + 1] = content[index];
    content[index] = temp;
  });
  selectedBlockIndex.value = index + 1;
}

function onDuplicateBlock(index: number) {
  mutateDocContent((content) => {
    const clone = JSON.parse(JSON.stringify(content[index]));
    content.splice(index + 1, 0, clone);
  });
  selectedBlockIndex.value = index + 1;
}

function onDeleteBlock(index: number) {
  mutateDocContent((content) => {
    content.splice(index, 1);
  });
  selectedBlockIndex.value = null;
}

function onInsertBlock(kind: string) {
  mutateDocContent((content) => {
    let newBlock: JSONContent;
    if (isModuleKind(kind)) {
      const spec = moduleSpec(kind);
      newBlock = {
        type: "deskModule",
        attrs: {
          kind,
          payload: { ...spec.defaults },
        },
      };
    } else if (kind === "heading") {
      newBlock = {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "New Section Heading" }],
      };
    } else {
      newBlock = {
        type: "paragraph",
        content: [{ type: "text", text: "Enter your documentation narrative here..." }],
      };
    }

    const insertAt = selectedBlockIndex.value !== null
      ? selectedBlockIndex.value + 1
      : content.length;
    content.splice(insertAt, 0, newBlock);
    selectedBlockIndex.value = insertAt;
  });
  showInserter.value = false;
  showInspector.value = true;
}

function onUpdatePayload(payload: Record<string, string>) {
  if (selectedBlockIndex.value === null) return;
  mutateDocContent((content) => {
    const target = content[selectedBlockIndex.value!];
    if (target && target.type === "deskModule") {
      target.attrs = {
        ...target.attrs,
        payload,
      };
    }
  });
}

function onUpdateMeta(meta: PageMeta) {
  emit("update:pageMeta", meta);
}

function onSourceUpdateDoc(newDoc: JSONContent) {
  currentDoc.value = newDoc;
}

function onUpdateHtml(html: string) {
  emit("update:html", html);
}

function onSelectPreset(preset: TuxDeskPreset) {
  const cloned = clonePresetDoc(preset.id);
  if (cloned) {
    currentDoc.value = cloned;
    activePresetId.value = preset.id;
    emit("update:pageMeta", {
      title: preset.title,
      slug: preset.suggestedSlug,
      reviewCadenceDays: preset.reviewCadenceDays,
      status: props.pageMeta?.status || "draft",
    });
    selectedBlockIndex.value = 0;
    showPresets.value = false;
  }
}
</script>

<template>
  <div class="tux-desk-web-builder flex flex-col bg-surface-raised border border-surface-border rounded-xl overflow-hidden shadow-xs">
    <!-- 1. Builder Top Command Bar -->
    <header class="px-3 py-2 bg-surface-sunken border-b border-surface-border flex items-center justify-between gap-2 overflow-x-auto text-xs flex-nowrap">
      <!-- Left: Tools & Drawer Toggles -->
      <div class="flex items-center gap-1.5 flex-shrink-0">
        <button
          type="button"
          class="px-2.5 py-1.5 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-colors"
          :class="showOutline ? 'bg-surface-raised border-brand-primary text-brand-primary' : 'bg-surface-sunken border-surface-border text-text-muted hover:text-text-primary'"
          title="Toggle Outline Navigator (⌘1)"
          @click="showOutline = !showOutline"
        >
          <UIcon name="lucide:list-tree" class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">Navigator</span>
        </button>

        <button
          type="button"
          class="px-2.5 py-1.5 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-colors"
          :class="showInspector ? 'bg-surface-raised border-brand-primary text-brand-primary' : 'bg-surface-sunken border-surface-border text-text-muted hover:text-text-primary'"
          title="Toggle Properties Inspector (⌘2)"
          @click="showInspector = !showInspector"
        >
          <UIcon name="lucide:sliders-horizontal" class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">Inspector</span>
        </button>

        <div class="h-4 w-px bg-surface-border mx-1" />

        <!-- Template Presets Button -->
        <button
          type="button"
          class="px-2.5 py-1.5 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-colors"
          :class="showPresets ? 'bg-surface-raised border-brand-primary text-brand-primary' : 'bg-surface-sunken border-surface-border text-text-muted hover:text-text-primary'"
          title="Browse Template Presets"
          @click="showPresets = !showPresets; if (showPresets) showInserter = false"
        >
          <UIcon name="lucide:layout-template" class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">Presets</span>
        </button>

        <!-- Add Section Button -->
        <button
          type="button"
          class="px-2.5 py-1.5 rounded-md bg-brand-primary text-text-on-brand hover:opacity-95 font-semibold flex items-center gap-1.5 shadow-xs"
          @click="showInserter = !showInserter; if (showInserter) showPresets = false"
        >
          <UIcon name="lucide:plus" class="w-3.5 h-3.5" />
          <span>Add Block</span>
        </button>
      </div>

      <!-- Center: Mode & Viewport Switchers -->
      <div class="flex items-center gap-2">
        <!-- Mode Switcher -->
        <div class="flex items-center gap-0.5 bg-surface-raised p-0.5 rounded-lg border border-surface-border">
          <button
            type="button"
            class="px-2.5 py-1 rounded font-semibold transition-all flex items-center gap-1"
            :class="activeMode === 'visual' ? 'bg-brand-primary text-text-on-brand shadow-xs' : 'text-text-muted hover:text-text-primary'"
            @click="activeMode = 'visual'"
          >
            <UIcon name="lucide:palette" class="w-3.5 h-3.5" />
            <span>Visual</span>
          </button>

          <button
            type="button"
            class="px-2.5 py-1 rounded font-semibold transition-all flex items-center gap-1"
            :class="activeMode === 'split' ? 'bg-brand-primary text-text-on-brand shadow-xs' : 'text-text-muted hover:text-text-primary'"
            @click="activeMode = 'split'"
          >
            <UIcon name="lucide:columns-2" class="w-3.5 h-3.5" />
            <span>Split</span>
          </button>

          <button
            type="button"
            class="px-2.5 py-1 rounded font-semibold transition-all flex items-center gap-1"
            :class="activeMode === 'source' ? 'bg-brand-primary text-text-on-brand shadow-xs' : 'text-text-muted hover:text-text-primary'"
            @click="activeMode = 'source'"
          >
            <UIcon name="lucide:code-2" class="w-3.5 h-3.5" />
            <span>Source</span>
          </button>

          <button
            type="button"
            class="px-2.5 py-1 rounded font-semibold transition-all flex items-center gap-1"
            :class="activeMode === 'preview' ? 'bg-brand-primary text-text-on-brand shadow-xs' : 'text-text-muted hover:text-text-primary'"
            @click="activeMode = 'preview'"
          >
            <UIcon name="lucide:eye" class="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        <!-- Viewport Simulator (only in visual/preview mode) -->
        <div
          v-if="activeMode === 'visual' || activeMode === 'preview'"
          class="hidden md:flex items-center gap-0.5 bg-surface-raised p-0.5 rounded-lg border border-surface-border"
        >
          <button
            type="button"
            class="p-1 rounded transition-colors"
            :class="activeViewport === 'desktop' ? 'bg-brand-primary text-text-on-brand' : 'text-text-muted hover:text-text-primary'"
            title="Desktop Simulation"
            aria-label="Desktop Simulation"
            @click="activeViewport = 'desktop'"
          >
            <UIcon name="lucide:monitor" class="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            class="p-1 rounded transition-colors"
            :class="activeViewport === 'tablet' ? 'bg-brand-primary text-text-on-brand' : 'text-text-muted hover:text-text-primary'"
            title="Tablet (768px)"
            aria-label="Tablet (768px)"
            @click="activeViewport = 'tablet'"
          >
            <UIcon name="lucide:tablet" class="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            class="p-1 rounded transition-colors"
            :class="activeViewport === 'mobile' ? 'bg-brand-primary text-text-on-brand' : 'text-text-muted hover:text-text-primary'"
            title="Mobile (375px)"
            aria-label="Mobile (375px)"
            @click="activeViewport = 'mobile'"
          >
            <UIcon name="lucide:smartphone" class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Desktop Width Presets (Fluid / 1440 / 1140) -->
        <div
          v-if="(activeMode === 'visual' || activeMode === 'preview') && activeViewport === 'desktop'"
          class="hidden lg:flex items-center gap-0.5 bg-surface-raised p-0.5 rounded-lg border border-surface-border text-[11px] font-mono"
        >
          <button
            v-for="preset in [
              { id: 'fluid', label: 'Fluid' },
              { id: '1440', label: '1440px' },
              { id: '1140', label: '1140px' },
            ]"
            :key="preset.id"
            type="button"
            class="px-2 py-0.5 rounded transition-colors"
            :class="desktopWidthPreset === preset.id ? 'bg-brand-primary text-text-on-brand font-bold' : 'text-text-muted hover:text-text-primary'"
            :title="`Desktop Canvas Width: ${preset.label}`"
            @click="desktopWidthPreset = (preset.id as DesktopWidthPreset)"
          >
            {{ preset.label }}
          </button>
        </div>

        <!-- Grid Anchoring Toggle Button (Dots, Cells, 12-Col, None) -->
        <button
          v-if="activeMode === 'visual'"
          type="button"
          class="px-2 py-1 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-colors"
          :class="gridMode !== 'none' ? 'bg-surface-raised border-brand-primary text-brand-primary shadow-xs' : 'bg-surface-sunken border-surface-border text-text-muted hover:text-text-primary'"
          title="Toggle alignment grid overlay (Dots, Cells, 12-Column, Off)"
          @click="cycleGridMode"
        >
          <UIcon name="lucide:grid" class="w-3.5 h-3.5" />
          <span class="font-mono text-[10px] uppercase font-bold tracking-wider hidden sm:inline">
            Grid: {{ gridMode === 'columns' ? '12-Col' : gridMode }}
          </span>
        </button>
      </div>

      <!-- Right: Action Slots -->
      <div class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </header>

    <!-- 2. Template Presets Drawer -->
    <TuxDeskPresetPicker
      v-if="showPresets"
      :active-preset-id="activePresetId"
      :confirm-replace="true"
      @select="onSelectPreset"
      @close="showPresets = false"
    />

    <!-- 3. Block Inserter Modal / Drawer -->
    <div
      v-if="showInserter"
      class="p-4 bg-surface-sunken border-b border-surface-border animate-fadeIn"
    >
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-surface-border">
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-text-primary m-0">
            Insert Component Block
          </h4>
          <p class="text-[11px] text-text-muted m-0">
            Select a canonical TUX design system block to insert into the page layout.
          </p>
        </div>
        <button
          type="button"
          class="p-1 rounded text-text-muted hover:text-text-primary"
          title="Close inserter"
          aria-label="Close inserter"
          @click="showInserter = false"
        >
          <UIcon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        <button
          type="button"
          class="p-3 rounded-lg bg-surface-raised border border-surface-border hover:border-brand-primary text-left transition-all group flex flex-col items-center text-center gap-1.5"
          @click="onInsertBlock('hero')"
        >
          <UIcon name="lucide:layout-template" class="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
          <span class="text-xs font-bold text-text-primary">Hero Banner</span>
          <span class="text-[10px] text-text-muted">Header & Kicker</span>
        </button>

        <button
          type="button"
          class="p-3 rounded-lg bg-surface-raised border border-surface-border hover:border-brand-primary text-left transition-all group flex flex-col items-center text-center gap-1.5"
          @click="onInsertBlock('callout')"
        >
          <UIcon name="lucide:alert-circle" class="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
          <span class="text-xs font-bold text-text-primary">Callout Alert</span>
          <span class="text-[10px] text-text-muted">Notice Box</span>
        </button>

        <button
          type="button"
          class="p-3 rounded-lg bg-surface-raised border border-surface-border hover:border-brand-primary text-left transition-all group flex flex-col items-center text-center gap-1.5"
          @click="onInsertBlock('stats')"
        >
          <UIcon name="lucide:bar-chart-3" class="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
          <span class="text-xs font-bold text-text-primary">Data Stats</span>
          <span class="text-[10px] text-text-muted">Metric Highlights</span>
        </button>

        <button
          type="button"
          class="p-3 rounded-lg bg-surface-raised border border-surface-border hover:border-brand-primary text-left transition-all group flex flex-col items-center text-center gap-1.5"
          @click="onInsertBlock('cards')"
        >
          <UIcon name="lucide:grid" class="w-5 h-5 text-sky-500 group-hover:scale-110 transition-transform" />
          <span class="text-xs font-bold text-text-primary">Feature Cards</span>
          <span class="text-[10px] text-text-muted">3-Column Grid</span>
        </button>

        <button
          type="button"
          class="p-3 rounded-lg bg-surface-raised border border-surface-border hover:border-brand-primary text-left transition-all group flex flex-col items-center text-center gap-1.5"
          @click="onInsertBlock('split')"
        >
          <UIcon name="lucide:columns" class="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
          <span class="text-xs font-bold text-text-primary">Split Layout</span>
          <span class="text-[10px] text-text-muted">Narrative + Aside</span>
        </button>

        <button
          type="button"
          class="p-3 rounded-lg bg-surface-raised border border-surface-border hover:border-brand-primary text-left transition-all group flex flex-col items-center text-center gap-1.5"
          @click="onInsertBlock('steps')"
        >
          <UIcon name="lucide:list-ordered" class="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
          <span class="text-xs font-bold text-text-primary">Steps Sequence</span>
          <span class="text-[10px] text-text-muted">Process Flow</span>
        </button>

        <button
          type="button"
          class="p-3 rounded-lg bg-surface-raised border border-surface-border hover:border-brand-primary text-left transition-all group flex flex-col items-center text-center gap-1.5"
          @click="onInsertBlock('cta')"
        >
          <UIcon name="lucide:megaphone" class="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
          <span class="text-xs font-bold text-text-primary">Call to Action</span>
          <span class="text-[10px] text-text-muted">Action Banner</span>
        </button>
      </div>
    </div>

    <!-- 3. Main Builder Workspace Layout -->
    <div class="flex-1 flex relative overflow-hidden min-h-[640px]">
      <!-- Left Rail: Outline Navigator -->
      <div
        v-if="showOutline && activeMode !== 'source' && activeMode !== 'preview'"
        class="flex-shrink-0 z-20 xl:relative xl:top-auto xl:bottom-auto xl:left-auto absolute top-0 bottom-0 left-0 shadow-2xl xl:shadow-none bg-surface-raised"
      >
        <TuxDeskOutline
          :doc="currentDoc"
          :selected-index="selectedBlockIndex"
          :disabled="disabled"
          @select="onSelectBlock"
          @move-up="onMoveUp"
          @move-down="onMoveDown"
          @duplicate="onDuplicateBlock"
          @delete="onDeleteBlock"
          @close="showOutline = false"
        />
      </div>

      <!-- Center: Active Canvas Area with Dynamic Grid Worksurface -->
      <div
        role="region"
        aria-label="Worksurface canvas"
        class="flex-1 min-w-[340px] overflow-y-auto flex flex-col relative transition-colors duration-200"
        :class="{
          'builder-worksurface--dots': gridMode === 'dots' || gridMode === 'columns',
          'builder-worksurface--cells': gridMode === 'cells',
          'builder-worksurface--none': gridMode === 'none',
        }"
      >
        <!-- MODE 1: VISUAL BUILDER CANVAS -->
        <div
          v-if="activeMode === 'visual'"
          class="flex-1 transition-all duration-200 flex justify-center relative"
          :class="{
            'p-3 sm:p-5 lg:p-6': desktopWidthPreset !== 'fluid' || activeViewport !== 'desktop',
            'p-1 sm:p-2 lg:p-3': desktopWidthPreset === 'fluid' && activeViewport === 'desktop',
          }"
        >
          <!-- Artboard Container -->
          <div
            class="w-full transition-all duration-200 relative z-20"
            :class="{
              'max-w-full': activeViewport === 'desktop' && desktopWidthPreset === 'fluid',
              'max-w-[1440px]': activeViewport === 'desktop' && desktopWidthPreset === '1440',
              'max-w-[1140px]': activeViewport === 'desktop' && desktopWidthPreset === '1140',
              'max-w-[768px] border-x-4 border-t-8 border-b-8 border-surface-border rounded-2xl shadow-lg': activeViewport === 'tablet',
              'max-w-[375px] border-x-8 border-t-12 border-b-12 border-surface-border rounded-3xl shadow-xl': activeViewport === 'mobile',
            }"
          >
            <!-- 12-Column Alignment Overlay (Unified into exact artboard container space) -->
            <div
              v-if="gridMode === 'columns'"
              class="pointer-events-none absolute inset-0 px-4 grid grid-cols-12 gap-3 sm:gap-4 z-10"
              aria-hidden="true"
            >
              <div
                v-for="col in 12"
                :key="col"
                class="h-full border-x transition-all duration-150 flex flex-col items-center justify-between py-2 select-none"
                :class="[
                  activeGridHighlight && col >= activeGridHighlight.start && col <= activeGridHighlight.end
                    ? 'border-brand-primary bg-brand-primary/10 shadow-xs'
                    : 'border-dashed border-brand-primary/18 bg-brand-primary/4'
                ]"
              >
                <div class="flex items-center gap-1">
                  <span
                    class="text-[9px] font-mono font-bold transition-all"
                    :class="activeGridHighlight && col >= activeGridHighlight.start && col <= activeGridHighlight.end
                      ? 'text-brand-primary font-black scale-110'
                      : 'text-brand-primary/50'"
                  >
                    C{{ col }}
                  </span>
                </div>
                <div
                  v-if="activeGridHighlight && col === activeGridHighlight.start"
                  class="text-[8px] font-mono font-bold bg-brand-primary text-text-on-brand px-1 py-0.5 rounded shadow-xs uppercase tracking-wider"
                >
                  Start
                </div>
                <div
                  v-else-if="activeGridHighlight && col === activeGridHighlight.end"
                  class="text-[8px] font-mono font-bold bg-brand-primary text-text-on-brand px-1 py-0.5 rounded shadow-xs uppercase tracking-wider"
                >
                  End
                </div>
                <div v-else class="h-3" />
              </div>
            </div>

            <!-- Viewport Badge (in tablet/mobile mode) -->
            <div
              v-if="activeViewport !== 'desktop'"
              class="px-4 py-1.5 bg-surface-sunken border-b border-surface-border flex items-center justify-between text-[11px] font-mono text-text-muted"
            >
              <span>{{ activeViewport.toUpperCase() }} SIMULATION</span>
              <span>{{ activeViewport === 'tablet' ? '768px' : '375px' }}</span>
            </div>

            <ClientOnly>
              <TuxDeskEditor
                v-model="currentDoc"
                :disabled="disabled"
                :seamless="true"
                @update:html="onUpdateHtml"
              />
              <template #fallback>
                <div class="p-12 text-center text-text-muted bg-surface-raised rounded-xl border border-surface-border">
                  Loading visual builder...
                </div>
              </template>
            </ClientOnly>
          </div>
        </div>

        <!-- MODE 2: SPLIT SCREEN (Visual on Left, Source on Right) -->
        <div
          v-else-if="activeMode === 'split'"
          class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4"
        >
          <!-- Left: Visual Canvas -->
          <div class="flex flex-col bg-surface-raised rounded-xl border border-surface-border overflow-hidden">
            <div class="px-4 py-2 bg-surface-sunken border-b border-surface-border font-bold text-xs text-text-primary flex items-center gap-1.5">
              <UIcon name="lucide:palette" class="w-3.5 h-3.5 text-brand-primary" />
              <span>Live Visual Canvas</span>
            </div>
            <div class="p-4 flex-1 overflow-y-auto">
              <ClientOnly>
                <TuxDeskEditor
                  v-model="currentDoc"
                  :disabled="disabled"
                  @update:html="onUpdateHtml"
                />
              </ClientOnly>
            </div>
          </div>

          <!-- Right: Source Code Editor -->
          <div class="flex flex-col">
            <TuxDeskSourceEditor
              :doc="currentDoc"
              :disabled="disabled"
              @update:doc="onSourceUpdateDoc"
            />
          </div>
        </div>

        <!-- MODE 3: FULL SOURCE CODE EDITOR -->
        <div
          v-else-if="activeMode === 'source'"
          class="flex-1 p-4 flex flex-col"
        >
          <TuxDeskSourceEditor
            :doc="currentDoc"
            :disabled="disabled"
            @update:doc="onSourceUpdateDoc"
          />
        </div>

        <!-- MODE 4: PUBLISHED PREVIEW -->
        <div
          v-else-if="activeMode === 'preview'"
          class="flex-1 p-4 sm:p-6 lg:p-8 flex justify-center"
        >
          <div
            class="w-full transition-all duration-300 bg-surface-raised p-6 sm:p-8 rounded-xl border border-surface-border shadow-xs"
            :class="{
              'max-w-full': activeViewport === 'desktop' && desktopWidthPreset === 'fluid',
              'max-w-[1440px]': activeViewport === 'desktop' && desktopWidthPreset === '1440',
              'max-w-[1140px]': activeViewport === 'desktop' && desktopWidthPreset === '1140',
              'max-w-[768px]': activeViewport === 'tablet',
              'max-w-[375px]': activeViewport === 'mobile',
            }"
          >
            <TuxDeskArticle
              :title="pageMeta.title"
              kicker="Texas A&M Transportation Institute"
              :body-json="currentDoc"
              :stale="false"
              owner="TTI Communications & Research"
              page-id="builder-preview"
            />
          </div>
        </div>
      </div>

      <!-- Right Rail: Properties & Page Settings Inspector -->
      <div
        v-if="showInspector && activeMode !== 'preview'"
        class="flex-shrink-0 z-20 xl:relative xl:top-auto xl:bottom-auto xl:right-auto absolute top-0 bottom-0 right-0 shadow-2xl xl:shadow-none bg-surface-raised"
      >
        <TuxDeskInspector
          :selected-node="selectedBlockNode"
          :selected-index="selectedBlockIndex"
          :page-meta="pageMeta"
          :disabled="disabled"
          @update:payload="onUpdatePayload"
          @update:meta="onUpdateMeta"
          @delete-selected="selectedBlockIndex !== null && onDeleteBlock(selectedBlockIndex)"
          @duplicate-selected="selectedBlockIndex !== null && onDuplicateBlock(selectedBlockIndex)"
          @close="showInspector = false"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.15s ease-out forwards;
}

/* Dynamic Grid Anchoring Worksurfaces */
.builder-worksurface--dots {
  background-color: var(--surface-sunken);
  background-image: radial-gradient(circle, color-mix(in srgb, var(--text-muted) 35%, transparent) 1.5px, transparent 1.5px);
  background-size: 24px 24px;
}

.builder-worksurface--cells {
  background-color: var(--surface-sunken);
  background-image:
    linear-gradient(to right, color-mix(in srgb, var(--surface-border) 80%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--surface-border) 80%, transparent) 1px, transparent 1px);
  background-size: 24px 24px;
}

.builder-worksurface--none {
  background-color: var(--surface-sunken);
}
</style>
