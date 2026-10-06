<script setup lang="ts">
/**
 * TuxDeskSourceEditor.vue — Bidirectional Code / Source Editor.
 * Supports Markdown / MDC (::tux-*), Semantic HTML, and TipTap JSON AST.
 */
import type { JSONContent } from "@tiptap/core";
import {
  docToMdc,
  mdcToDoc,
  docToHtml,
  htmlToDoc,
} from "../../utils/desk/mdc-converter";

type SourceFormat = "mdc" | "html" | "json";

interface Props {
  doc: JSONContent;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:doc", doc: JSONContent): void;
}>();

const activeFormat = ref<SourceFormat>("mdc");
const rawSource = ref("");
const isDirty = ref(false);
const parseError = ref<string | null>(null);
const copied = ref(false);

// Generate formatted source string from doc based on active format
function generateSourceFromDoc(format: SourceFormat, doc: JSONContent): string {
  switch (format) {
    case "mdc":
      return docToMdc(doc);
    case "html":
      return docToHtml(doc);
    case "json":
      return JSON.stringify(doc, null, 2);
  }
}

// Initial populate
rawSource.value = generateSourceFromDoc(activeFormat.value, props.doc);

// When incoming doc changes from visual editor, update source if not dirty
watch(
  () => props.doc,
  (newDoc) => {
    if (!isDirty.value) {
      rawSource.value = generateSourceFromDoc(activeFormat.value, newDoc);
      parseError.value = null;
    }
  },
  { deep: true }
);

function switchFormat(format: SourceFormat) {
  if (format === activeFormat.value) return;
  // Apply any pending changes before switching
  if (isDirty.value) {
    applyChanges();
  }
  activeFormat.value = format;
  rawSource.value = generateSourceFromDoc(format, props.doc);
  isDirty.value = false;
  parseError.value = null;
}

function onInput() {
  isDirty.value = true;
  parseError.value = null;
  // Debounced auto-apply after 800ms
  scheduleAutoApply();
}

let autoApplyTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleAutoApply() {
  if (autoApplyTimer) clearTimeout(autoApplyTimer);
  autoApplyTimer = setTimeout(() => {
    applyChanges(true);
  }, 800);
}

function applyChanges(silent = false) {
  parseError.value = null;
  try {
    let newDoc: JSONContent;
    if (activeFormat.value === "json") {
      newDoc = JSON.parse(rawSource.value);
      if (!newDoc || newDoc.type !== "doc") {
        throw new Error("JSON must have a root object with type: 'doc'");
      }
    } else if (activeFormat.value === "html") {
      newDoc = htmlToDoc(rawSource.value);
    } else {
      newDoc = mdcToDoc(rawSource.value);
    }

    emit("update:doc", newDoc);
    isDirty.value = false;
  } catch (err: any) {
    parseError.value = err?.message || "Syntax error parsing source code.";
  }
}

function resetToCanvas() {
  rawSource.value = generateSourceFromDoc(activeFormat.value, props.doc);
  isDirty.value = false;
  parseError.value = null;
}

function copySource() {
  navigator.clipboard.writeText(rawSource.value);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}

function formatCode() {
  if (activeFormat.value === "json") {
    try {
      const parsed = JSON.parse(rawSource.value);
      rawSource.value = JSON.stringify(parsed, null, 2);
    } catch {
      // ignore if invalid JSON
    }
  }
}

// Line numbering helper
const lineCount = computed(() => {
  return rawSource.value.split("\n").length;
});
</script>

<template>
  <div class="tux-desk-source-editor flex flex-col h-full bg-surface-raised border border-surface-border rounded-xl overflow-hidden text-xs">
    <!-- Top Bar -->
    <div class="px-4 py-2.5 bg-surface-sunken border-b border-surface-border flex flex-wrap items-center justify-between gap-3">
      <!-- Format Switcher Tabs -->
      <div class="flex items-center gap-1 bg-surface-raised p-1 rounded-lg border border-surface-border">
        <button
          type="button"
          class="px-2.5 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1.5"
          :class="activeFormat === 'mdc' ? 'bg-brand-primary text-text-on-brand shadow-xs' : 'text-text-muted hover:text-text-primary'"
          @click="switchFormat('mdc')"
        >
          <UIcon name="lucide:file-text" class="w-3.5 h-3.5" />
          <span>Markdown (MDC)</span>
        </button>

        <button
          type="button"
          class="px-2.5 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1.5"
          :class="activeFormat === 'html' ? 'bg-brand-primary text-text-on-brand shadow-xs' : 'text-text-muted hover:text-text-primary'"
          @click="switchFormat('html')"
        >
          <UIcon name="lucide:code" class="w-3.5 h-3.5" />
          <span>HTML Template</span>
        </button>

        <button
          type="button"
          class="px-2.5 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1.5"
          :class="activeFormat === 'json' ? 'bg-brand-primary text-text-on-brand shadow-xs' : 'text-text-muted hover:text-text-primary'"
          @click="switchFormat('json')"
        >
          <UIcon name="lucide:braces" class="w-3.5 h-3.5" />
          <span>JSON AST</span>
        </button>
      </div>

      <!-- Action Utilities -->
      <div class="flex items-center gap-2">
        <span v-if="isDirty" class="text-[11px] text-amber-500 flex items-center gap-1 font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Unsaved edits
        </span>

        <button
          v-if="isDirty"
          type="button"
          class="px-2.5 py-1 rounded bg-surface-raised border border-surface-border text-text-primary hover:border-brand-primary flex items-center gap-1 font-semibold"
          @click="resetToCanvas"
        >
          <UIcon name="lucide:undo-2" class="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <button
          v-if="isDirty"
          type="button"
          class="px-2.5 py-1 rounded bg-brand-primary text-text-on-brand hover:opacity-90 flex items-center gap-1 font-semibold shadow-xs"
          @click="applyChanges(false)"
        >
          <UIcon name="lucide:check" class="w-3.5 h-3.5" />
          <span>Apply to Canvas</span>
        </button>

        <button
          v-if="activeFormat === 'json'"
          type="button"
          class="p-1.5 rounded bg-surface-raised border border-surface-border text-text-muted hover:text-text-primary"
          title="Format code"
          aria-label="Format code"
          @click="formatCode"
        >
          <UIcon name="lucide:wand-2" class="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          class="px-2.5 py-1 rounded bg-surface-raised border border-surface-border text-text-muted hover:text-text-primary flex items-center gap-1 transition-colors"
          :class="{ '!text-emerald-500 border-emerald-500': copied }"
          @click="copySource"
        >
          <UIcon :name="copied ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5" />
          <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
        </button>
      </div>
    </div>

    <!-- Error Banner -->
    <div
      v-if="parseError"
      class="px-4 py-2 bg-rose-500/10 border-b border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center gap-2 text-xs"
    >
      <UIcon name="lucide:alert-triangle" class="w-4 h-4 flex-shrink-0" />
      <span class="font-mono flex-1">{{ parseError }}</span>
    </div>

    <!-- Code Editor Canvas with Line Numbers -->
    <div class="flex-1 flex overflow-hidden font-mono text-xs bg-surface-sunken">
      <!-- Line Numbers Gutter -->
      <div
        class="py-3 px-2 text-right text-text-muted/40 bg-surface-sunken select-none border-r border-surface-border flex-shrink-0"
        style="min-width: 2.75rem;"
      >
        <div v-for="n in lineCount" :key="n" class="leading-relaxed">
          {{ n }}
        </div>
      </div>

      <!-- Textarea Code Input -->
      <textarea
        v-model="rawSource"
        :disabled="disabled"
        spellcheck="false"
        class="flex-1 p-3 bg-transparent text-text-primary outline-none resize-none leading-relaxed overflow-auto selection:bg-brand-primary/25 border-none"
        placeholder="Type markdown, HTML or JSON..."
        aria-label="Source code"
        @input="onInput"
      />
    </div>

    <!-- Footer Bar -->
    <div class="px-4 py-1.5 bg-surface-sunken border-t border-surface-border text-[11px] text-text-muted flex items-center justify-between font-mono">
      <span>{{ activeFormat.toUpperCase() }} SOURCE · {{ lineCount }} lines</span>
      <span>Live Bidirectional Sync Enabled</span>
    </div>
  </div>
</template>

<style scoped>
.tux-desk-source-editor {
  min-height: 480px;
}
</style>
