<script setup lang="ts">
/**
 * TuxDeskInspector.vue — Dedicated Properties & Page Settings Inspector.
 * Docked or slide-over panel for editing block properties and document metadata.
 */
import type { JSONContent } from "@tiptap/core";
import {
  isModuleKind,
  moduleSpec,
  type ModuleFieldKind,
  type ModuleKind,
} from "../../utils/desk/modules";

interface PageMeta {
  title: string;
  slug: string;
  reviewCadenceDays: number;
  status?: string;
}

interface Props {
  selectedNode?: JSONContent | null;
  selectedIndex?: number | null;
  pageMeta?: PageMeta;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selectedNode: null,
  selectedIndex: null,
  pageMeta: () => ({ title: "", slug: "", reviewCadenceDays: 90 }),
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:payload", payload: Record<string, string>): void;
  (e: "update:meta", meta: PageMeta): void;
  (e: "delete-selected"): void;
  (e: "duplicate-selected"): void;
  (e: "close"): void;
}>();

const activeGridHighlight = inject<Ref<{ start: number; end: number } | null> | null>("tuxActiveGridHighlight", null);

const isDeskModule = computed(() => props.selectedNode?.type === "deskModule");

const moduleKind = computed<ModuleKind>(() => {
  if (!isDeskModule.value) return "callout";
  const raw = String(props.selectedNode?.attrs?.kind || "");
  return isModuleKind(raw) ? raw : "callout";
});

const currentSpec = computed(() => moduleSpec(moduleKind.value));

const currentPayload = computed<Record<string, string>>(() => {
  if (!isDeskModule.value) return {};
  const raw = props.selectedNode?.attrs?.payload;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, string>;
  }
  return {};
});

const colStart = computed(() => {
  return Math.min(12, Math.max(1, parseInt(currentPayload.value._colStart || "1", 10) || 1));
});

const colSpan = computed(() => {
  return Math.min(13 - colStart.value, Math.max(1, parseInt(currentPayload.value._colSpan || "12", 10) || 12));
});

const colEnd = computed(() => colStart.value + colSpan.value - 1);

const blockAlign = computed(() => (currentPayload.value._align || "").toLowerCase());

function setGridPosition(start: number, span: number, align?: string) {
  const clampedStart = Math.max(1, Math.min(12, start));
  const clampedSpan = Math.max(1, Math.min(13 - clampedStart, span));
  const newPayload: Record<string, string> = {
    ...currentPayload.value,
    _colStart: String(clampedStart),
    _colSpan: String(clampedSpan),
    _width: `${Math.round((clampedSpan / 12) * 100)}%`,
  };
  if (align !== undefined) {
    newPayload._align = align;
  }
  emit("update:payload", newPayload);
  if (activeGridHighlight) {
    activeGridHighlight.value = {
      start: clampedStart,
      end: clampedStart + clampedSpan - 1,
    };
  }
}

function shiftGrid(delta: -1 | 1) {
  const newStart = colStart.value + delta;
  if (newStart >= 1 && newStart + colSpan.value - 1 <= 12) {
    setGridPosition(newStart, colSpan.value, "");
  }
}

function onColumnCellClick(col: number) {
  if (col < colStart.value) {
    setGridPosition(col, colEnd.value - col + 1, "");
  } else if (col > colEnd.value) {
    setGridPosition(colStart.value, col - colStart.value + 1, "");
  } else {
    if (col === colStart.value && colSpan.value > 1) {
      setGridPosition(colStart.value + 1, colSpan.value - 1, "");
    } else {
      setGridPosition(colStart.value, col - colStart.value + 1, "");
    }
  }
}

watch(
  () => [props.selectedNode, colStart.value, colEnd.value],
  () => {
    if (isDeskModule.value && activeGridHighlight) {
      activeGridHighlight.value = { start: colStart.value, end: colEnd.value };
    }
  },
  { immediate: true }
);

function fieldControl(kind: ModuleFieldKind): "select" | "textarea" | "input" {
  switch (kind) {
    case "select": return "select";
    case "textarea": return "textarea";
    default: return "input";
  }
}

function getFieldValue(key: string): string {
  return currentPayload.value[key] ?? currentSpec.value.defaults[key] ?? "";
}

function updateField(key: string, value: string) {
  emit("update:payload", {
    ...currentPayload.value,
    [key]: value.slice(0, 2000),
  });
}

function onMetaFieldChange(field: keyof PageMeta, val: any) {
  emit("update:meta", {
    ...props.pageMeta,
    [field]: val,
  });
}
</script>

<template>
  <aside
    class="tux-desk-inspector flex flex-col h-full bg-surface-raised border-l border-surface-border text-xs"
    aria-label="Inspector Panel"
  >
    <!-- Inspector Header -->
    <div class="px-3.5 py-2.5 border-b border-surface-border flex items-center justify-between bg-surface-sunken">
      <div class="flex items-center gap-2">
        <UIcon
          :name="selectedNode ? 'lucide:sliders-horizontal' : 'lucide:file-cog'"
          class="w-4 h-4 text-brand-primary"
          aria-hidden="true"
        />
        <span class="font-bold uppercase tracking-wider text-text-primary text-[11px]">
          {{ selectedNode ? 'Block Properties' : 'Page Settings' }}
        </span>
      </div>
      <button
        type="button"
        class="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-raised"
        title="Close Inspector"
        aria-label="Close Inspector"
        @click="emit('close')"
      >
        <UIcon name="lucide:x" class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Inspector Body -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <!-- 1. Module Properties Mode -->
      <div v-if="isDeskModule" class="space-y-4">
        <div class="flex items-center justify-between p-2.5 rounded-lg bg-surface-sunken border border-surface-border">
          <div class="space-y-0.5">
            <span class="text-[10px] font-mono uppercase tracking-wider text-brand-primary font-bold">
              TUX Module Component
            </span>
            <h4 class="text-xs font-bold text-text-primary m-0">
              {{ currentSpec.label }}
            </h4>
          </div>
          <div v-if="!disabled" class="flex items-center gap-1">
            <button
              type="button"
              class="p-1.5 rounded bg-surface-raised border border-surface-border text-text-muted hover:text-text-primary hover:border-brand-primary"
              title="Duplicate block"
              aria-label="Duplicate block"
              @click="emit('duplicate-selected')"
            >
              <UIcon name="lucide:copy" class="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              class="p-1.5 rounded bg-surface-raised border border-surface-border text-text-muted hover:text-rose-500 hover:border-rose-500"
              title="Delete block"
              aria-label="Delete block"
              @click="emit('delete-selected')"
            >
              <UIcon name="lucide:trash-2" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- 12-Column Grid Matrix & Positioning Control -->
        <div class="space-y-2.5 p-2.5 rounded-lg bg-surface-sunken border border-surface-border">
          <div class="flex items-center justify-between">
            <label class="block text-[11px] font-semibold text-text-muted uppercase">
              12-Column Grid Matrix
            </label>
            <div class="flex items-center gap-1 font-mono text-[10px] text-brand-primary font-bold">
              <span>Cols {{ colStart }}–{{ colEnd }}</span>
              <span class="text-text-muted">({{ colSpan }}/12 · {{ Math.round((colSpan / 12) * 100) }}%)</span>
            </div>
          </div>

          <!-- Interactive 12-Column Visual Strip -->
          <div class="space-y-1">
            <div class="grid grid-cols-12 gap-0.5 p-1 bg-surface-raised rounded-md border border-surface-border">
              <button
                v-for="c in 12"
                :key="c"
                type="button"
                :disabled="disabled"
                class="h-6 rounded-xs text-[9px] font-mono font-bold flex items-center justify-center transition-all"
                :class="[
                  c >= colStart && c <= colEnd
                    ? 'bg-brand-primary text-text-on-brand shadow-xs'
                    : 'bg-surface-sunken text-text-muted hover:bg-brand-primary/20 hover:text-text-primary'
                ]"
                :title="`Column ${c}${c >= colStart && c <= colEnd ? ' (Active)' : ''}`"
                @click="onColumnCellClick(c)"
                @mouseenter="activeGridHighlight && (activeGridHighlight.value = { start: colStart, end: colEnd })"
              >
                {{ c }}
              </button>
            </div>
            <div class="flex justify-between text-[9px] font-mono text-text-muted px-0.5">
              <span>Col 1</span>
              <span>Col 6</span>
              <span>Col 12</span>
            </div>
          </div>

          <!-- Alignment & Horizontal Shifting -->
          <div class="flex items-center justify-between gap-1 pt-1 border-t border-surface-border">
            <!-- Alignment buttons -->
            <div class="flex items-center gap-0.5 bg-surface-raised p-0.5 rounded border border-surface-border">
              <button
                type="button"
                :disabled="disabled"
                class="px-2 py-1 rounded text-[10px] font-semibold transition-colors flex items-center gap-1"
                :class="blockAlign === 'left' ? 'bg-brand-primary text-text-on-brand font-bold' : 'text-text-muted hover:text-text-primary'"
                title="Align Left"
                @click="setGridPosition(colStart, colSpan, 'left')"
              >
                <UIcon name="lucide:align-left" class="w-3 h-3" />
                <span>Left</span>
              </button>
              <button
                type="button"
                :disabled="disabled"
                class="px-2 py-1 rounded text-[10px] font-semibold transition-colors flex items-center gap-1"
                :class="blockAlign === 'center' || (!blockAlign && colStart > 1 && colEnd < 12) ? 'bg-brand-primary text-text-on-brand font-bold' : 'text-text-muted hover:text-text-primary'"
                title="Align Center"
                @click="setGridPosition(colStart, colSpan, 'center')"
              >
                <UIcon name="lucide:align-center" class="w-3 h-3" />
                <span>Center</span>
              </button>
              <button
                type="button"
                :disabled="disabled"
                class="px-2 py-1 rounded text-[10px] font-semibold transition-colors flex items-center gap-1"
                :class="blockAlign === 'right' ? 'bg-brand-primary text-text-on-brand font-bold' : 'text-text-muted hover:text-text-primary'"
                title="Align Right"
                @click="setGridPosition(colStart, colSpan, 'right')"
              >
                <UIcon name="lucide:align-right" class="w-3 h-3" />
                <span>Right</span>
              </button>
            </div>

            <!-- Shift buttons -->
            <div class="flex items-center gap-0.5 bg-surface-raised p-0.5 rounded border border-surface-border">
              <button
                type="button"
                :disabled="disabled || colStart <= 1"
                class="px-1.5 py-1 rounded text-[10px] text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                title="Shift Column Left"
                aria-label="Shift Column Left"
                @click="shiftGrid(-1)"
              >
                <UIcon name="lucide:arrow-left" class="w-3 h-3" />
              </button>
              <button
                type="button"
                :disabled="disabled || colEnd >= 12"
                class="px-1.5 py-1 rounded text-[10px] text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                title="Shift Column Right"
                aria-label="Shift Column Right"
                @click="shiftGrid(1)"
              >
                <UIcon name="lucide:arrow-right" class="w-3 h-3" />
              </button>
            </div>
          </div>

          <!-- Quick Span Presets -->
          <div class="grid grid-cols-4 gap-1 text-[10px] font-mono">
            <button
              v-for="snap in [
                { cols: 12, label: 'Full 12c', w: '100%' },
                { cols: 8, label: 'Wide 8c', w: '67%' },
                { cols: 6, label: 'Half 6c', w: '50%' },
                { cols: 4, label: 'Third 4c', w: '33%' },
              ]"
              :key="snap.cols"
              type="button"
              :disabled="disabled"
              class="px-1 py-1 rounded text-center transition-colors border"
              :class="[
                colSpan === snap.cols
                  ? 'bg-brand-primary text-text-on-brand border-brand-primary font-bold'
                  : 'bg-surface-raised border-surface-border text-text-primary hover:border-brand-primary'
              ]"
              :title="`Set span to ${snap.cols} columns (${snap.w})`"
              @click="setGridPosition(colStart + snap.cols - 1 > 12 ? Math.max(1, 13 - snap.cols) : colStart, snap.cols, blockAlign)"
            >
              {{ snap.label }}
            </button>
          </div>
        </div>

        <!-- Dynamic Fields -->
        <div class="space-y-3">
          <div
            v-for="field in currentSpec.fields"
            :key="field.key"
            class="space-y-1"
          >
            <label class="block text-[11px] font-semibold text-text-muted uppercase">
              {{ field.label }}
            </label>

            <!-- Select Control -->
            <select
              v-if="fieldControl(field.kind) === 'select'"
              :value="getFieldValue(field.key)"
              :disabled="disabled"
              :aria-label="field.label"
              class="w-full px-2.5 py-1.5 rounded-md bg-surface-sunken border border-surface-border focus:border-brand-primary outline-none text-text-primary text-xs"
              @change="updateField(field.key, ($event.target as HTMLSelectElement).value)"
            >
              <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>

            <!-- Textarea Control -->
            <textarea
              v-else-if="fieldControl(field.kind) === 'textarea'"
              :value="getFieldValue(field.key)"
              :disabled="disabled"
              :aria-label="field.label"
              rows="3"
              class="w-full px-2.5 py-1.5 rounded-md bg-surface-sunken border border-surface-border focus:border-brand-primary outline-none text-text-primary text-xs resize-y"
              @input="updateField(field.key, ($event.target as HTMLTextAreaElement).value)"
            />

            <!-- Input Control -->
            <input
              v-else
              type="text"
              :value="getFieldValue(field.key)"
              :disabled="disabled"
              :aria-label="field.label"
              class="w-full px-2.5 py-1.5 rounded-md bg-surface-sunken border border-surface-border focus:border-brand-primary outline-none text-text-primary text-xs"
              @input="updateField(field.key, ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </div>

      <!-- 2. Prose / Non-Module Block Mode -->
      <div v-else-if="selectedNode" class="space-y-4">
        <div class="p-3 rounded-lg bg-surface-sunken border border-surface-border space-y-1">
          <span class="text-[10px] font-mono uppercase tracking-wider text-text-muted">Prose Node</span>
          <h4 class="text-xs font-bold text-text-primary capitalize m-0">
            {{ selectedNode.type }}
          </h4>
        </div>

        <div class="text-xs text-text-secondary leading-relaxed">
          This is a standard typography block. You can edit the text directly on the visual canvas, format with the toolbar, or jump to the <strong>Source</strong> tab to edit the Markdown.
        </div>

        <div v-if="!disabled" class="pt-2 border-t border-surface-border flex items-center justify-between">
          <span class="text-text-muted">Block Actions</span>
          <div class="flex items-center gap-1.5">
            <button
              type="button"
              class="px-2 py-1 rounded bg-surface-sunken border border-surface-border text-text-muted hover:text-text-primary flex items-center gap-1"
              @click="emit('duplicate-selected')"
            >
              <UIcon name="lucide:copy" class="w-3 h-3" />
              Duplicate
            </button>
            <button
              type="button"
              class="px-2 py-1 rounded bg-surface-sunken border border-surface-border text-text-muted hover:text-rose-500 flex items-center gap-1"
              @click="emit('delete-selected')"
            >
              <UIcon name="lucide:trash-2" class="w-3 h-3" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- 3. Document / Page Settings Mode (Default when no block selected) -->
      <div v-else class="space-y-4">
        <div class="space-y-1">
          <label class="block text-[11px] font-semibold text-text-muted uppercase">Document Title</label>
          <input
            type="text"
            :value="pageMeta.title"
            :disabled="disabled"
            aria-label="Document Title"
            placeholder="e.g. Connected Corridors Program"
            class="w-full px-2.5 py-1.5 rounded-md bg-surface-sunken border border-surface-border focus:border-brand-primary outline-none text-text-primary text-xs"
            @input="onMetaFieldChange('title', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-[11px] font-semibold text-text-muted uppercase">Public URL Slug</label>
          <div class="flex items-center gap-1">
            <span class="text-text-muted font-mono text-[11px]">/p/</span>
            <input
              type="text"
              :value="pageMeta.slug"
              :disabled="disabled"
              aria-label="Public URL Slug"
              placeholder="connected-corridors"
              class="w-full px-2 py-1 rounded-md bg-surface-sunken border border-surface-border focus:border-brand-primary outline-none text-text-primary font-mono text-xs"
              @input="onMetaFieldChange('slug', ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-[11px] font-semibold text-text-muted uppercase">Review Cadence</label>
          <select
            :value="pageMeta.reviewCadenceDays"
            :disabled="disabled"
            aria-label="Review Cadence"
            class="w-full px-2.5 py-1.5 rounded-md bg-surface-sunken border border-surface-border focus:border-brand-primary outline-none text-text-primary text-xs"
            @change="onMetaFieldChange('reviewCadenceDays', Number(($event.target as HTMLSelectElement).value))"
          >
            <option :value="30">30 days (High turnover)</option>
            <option :value="60">60 days</option>
            <option :value="90">90 days (Standard)</option>
            <option :value="180">180 days (Semiannual)</option>
            <option :value="365">365 days (Annual)</option>
          </select>
        </div>

        <div class="p-3 rounded-lg bg-surface-sunken border border-surface-border space-y-2">
          <span class="text-[10px] font-mono uppercase tracking-wider text-text-muted font-bold">
            TTI Publishing Standards
          </span>
          <ul class="text-[11px] text-text-muted space-y-1 pl-4 list-disc m-0">
            <li>WCAG 2.2 AA compliant contrast on all surfaces</li>
            <li>Canonical TUX design tokens and responsive grids</li>
            <li>Automated review staleness alerts after cadence threshold</li>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.tux-desk-inspector {
  width: 290px;
  min-width: 260px;
}
</style>
