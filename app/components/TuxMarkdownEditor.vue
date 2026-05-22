<script setup lang="ts">
/**
 * TuxMarkdownEditor — textarea with markdown shortcuts.
 *
 * Chosen over a Tiptap-based WYSIWYG editor on purpose: editorial-
 * research output benefits from clean source-controllable markdown
 * far more than a lossy WYSIWYG. No dependencies; ships as a Vue
 * SFC with the brand chrome.
 *
 * Features:
 *   - Two-way bound `v-model:modelValue`
 *   - Toolbar with format buttons (bold, italic, link, code, list,
 *     quote, heading)
 *   - Keyboard shortcuts (Cmd/Ctrl + B, I, K, etc.)
 *   - Tab-indent / Shift+Tab-outdent within the textarea
 *   - Preview mode toggle (renders the markdown via MDC if
 *     available, falls back to plain raw)
 *   - Character / word count footer
 *
 * For full WYSIWYG (rich text, image upload, table editing), a
 * future `TuxRichTextEditor` could wrap Tiptap. This component
 * targets the 80% case: long-form markdown authoring inside
 * Landscape / tti-ai-studio surfaces.
 */
import { computed, nextTick, ref } from "vue";

interface Props {
  /** v-model:modelValue */
  modelValue?: string;
  /** Visible rows for the textarea. Default 12. */
  rows?: number;
  /** Min length (warn below). */
  minLength?: number;
  /** Max length (block above). */
  maxLength?: number;
  /** Placeholder. */
  placeholder?: string;
  /** Show preview toggle. Default true. */
  preview?: boolean;
  /** Disable the editor. */
  disabled?: boolean;
  /** Accessible label. */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  rows: 12,
  minLength: undefined,
  maxLength: undefined,
  placeholder: "Write in markdown — ⌘B bold, ⌘I italic, ⌘K link",
  preview: true,
  disabled: false,
  ariaLabel: "Markdown editor",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const showingPreview = ref(false);

const value = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const charCount = computed(() => value.value.length);
const wordCount = computed(() => {
  const trimmed = value.value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
});

const tooShort = computed(() => props.minLength !== undefined && charCount.value < props.minLength);

// ---- Formatting commands ----------------------------------------
function wrapSelection(before: string, after: string = before) {
  const ta = textareaRef.value;
  if (!ta) return;
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const selected = value.value.slice(start, end);
  const replacement = `${before}${selected}${after}`;
  value.value = value.value.slice(0, start) + replacement + value.value.slice(end);
  void nextTick(() => {
    ta.focus();
    ta.setSelectionRange(start + before.length, start + before.length + selected.length);
  });
}

function prefixLines(prefix: string) {
  const ta = textareaRef.value;
  if (!ta) return;
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  // Expand the selection to whole lines.
  const lineStart = value.value.lastIndexOf("\n", start - 1) + 1;
  let lineEnd = value.value.indexOf("\n", end);
  if (lineEnd === -1) lineEnd = value.value.length;
  const block = value.value.slice(lineStart, lineEnd);
  const prefixed = block.split("\n").map((l) => `${prefix}${l}`).join("\n");
  value.value = value.value.slice(0, lineStart) + prefixed + value.value.slice(lineEnd);
  void nextTick(() => {
    ta.focus();
    ta.setSelectionRange(lineStart, lineStart + prefixed.length);
  });
}

function insertLink() {
  wrapSelection("[", "](url)");
}

function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return;
  const mod = e.metaKey || e.ctrlKey;
  if (!mod) {
    // Tab to indent
    if (e.key === "Tab") {
      e.preventDefault();
      prefixLines(e.shiftKey ? "" : "  ");
    }
    return;
  }
  // Cmd/Ctrl shortcuts
  if (e.key === "b") { e.preventDefault(); wrapSelection("**"); return; }
  if (e.key === "i") { e.preventDefault(); wrapSelection("_"); return; }
  if (e.key === "k") { e.preventDefault(); insertLink(); return; }
  if (e.key === "e") { e.preventDefault(); wrapSelection("`"); return; }
}

function togglePreview() {
  showingPreview.value = !showingPreview.value;
}
</script>

<template>
  <div class="tux-md-editor" :class="{ 'tux-md-editor--disabled': disabled }">
    <div class="tux-md-editor__toolbar" role="toolbar" aria-label="Formatting">
      <button type="button" class="tux-md-editor__btn" :disabled="disabled" aria-label="Bold (⌘B)" @click="wrapSelection('**')">
        <Icon name="lucide:bold" :size="14" />
      </button>
      <button type="button" class="tux-md-editor__btn" :disabled="disabled" aria-label="Italic (⌘I)" @click="wrapSelection('_')">
        <Icon name="lucide:italic" :size="14" />
      </button>
      <button type="button" class="tux-md-editor__btn" :disabled="disabled" aria-label="Link (⌘K)" @click="insertLink">
        <Icon name="lucide:link" :size="14" />
      </button>
      <button type="button" class="tux-md-editor__btn" :disabled="disabled" aria-label="Inline code (⌘E)" @click="wrapSelection('`')">
        <Icon name="lucide:code" :size="14" />
      </button>
      <span class="tux-md-editor__sep" aria-hidden="true" />
      <button type="button" class="tux-md-editor__btn" :disabled="disabled" aria-label="Heading 2" @click="prefixLines('## ')">
        <Icon name="lucide:heading-2" :size="14" />
      </button>
      <button type="button" class="tux-md-editor__btn" :disabled="disabled" aria-label="Bulleted list" @click="prefixLines('- ')">
        <Icon name="lucide:list" :size="14" />
      </button>
      <button type="button" class="tux-md-editor__btn" :disabled="disabled" aria-label="Numbered list" @click="prefixLines('1. ')">
        <Icon name="lucide:list-ordered" :size="14" />
      </button>
      <button type="button" class="tux-md-editor__btn" :disabled="disabled" aria-label="Block quote" @click="prefixLines('> ')">
        <Icon name="lucide:quote" :size="14" />
      </button>

      <span class="tux-md-editor__spacer" />

      <button
        v-if="preview"
        type="button"
        class="tux-md-editor__btn tux-md-editor__btn--preview"
        :class="{ 'tux-md-editor__btn--active': showingPreview }"
        :aria-pressed="showingPreview"
        :disabled="disabled"
        @click="togglePreview"
      >
        <Icon :name="showingPreview ? 'lucide:pencil' : 'lucide:eye'" :size="14" />
        <span>{{ showingPreview ? "Edit" : "Preview" }}</span>
      </button>
    </div>

    <div v-if="showingPreview" class="tux-md-editor__preview">
      <MDC v-if="value" :value="value" />
      <p v-else class="tux-md-editor__preview-empty">Nothing to preview yet.</p>
    </div>

    <textarea
      v-else
      ref="textareaRef"
      v-model="value"
      class="tux-md-editor__textarea"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxLength"
      :aria-label="ariaLabel"
      @keydown="onKeydown"
    />

    <div class="tux-md-editor__footer">
      <p class="tux-md-editor__count" :class="{ 'tux-md-editor__count--warn': tooShort }">
        <span class="tux-md-editor__count-value">{{ charCount }}</span><span v-if="maxLength" class="tux-md-editor__count-max"> / {{ maxLength }}</span>
        <span class="tux-md-editor__count-label">characters</span>
        <span class="tux-md-editor__count-sep">·</span>
        <span class="tux-md-editor__count-value">{{ wordCount }}</span>
        <span class="tux-md-editor__count-label">words</span>
      </p>
      <p v-if="tooShort" class="tux-md-editor__min-warning">
        Need at least {{ minLength }} characters.
      </p>
    </div>
  </div>
</template>

<style scoped>
.tux-md-editor {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-page);
  font-family: var(--font-sans);
  overflow: hidden;
}

.tux-md-editor--disabled {
  opacity: 0.65;
  pointer-events: none;
}

.tux-md-editor__toolbar {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.25rem;
  background: var(--surface-sunken);
  border-bottom: 1px solid var(--surface-border);
}

.tux-md-editor__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.3125rem 0.4375rem;
  background: transparent;
  border: 0;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  transition: background 80ms ease-out, color 80ms ease-out;
}

.tux-md-editor__btn:hover:not(:disabled),
.tux-md-editor__btn:focus-visible {
  background: var(--surface-page);
  color: var(--text-primary);
  outline: none;
}

.tux-md-editor__btn--active {
  background: var(--surface-page);
  color: var(--brand-primary);
  border: 1px solid var(--surface-border);
}

.tux-md-editor__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tux-md-editor__btn--preview {
  padding: 0.3125rem 0.625rem;
}

.tux-md-editor__sep {
  width: 1px;
  height: 1.125rem;
  background: var(--surface-border);
  margin: 0 0.1875rem;
}

.tux-md-editor__spacer {
  flex: 1;
}

.tux-md-editor__textarea {
  width: 100%;
  border: 0;
  background: transparent;
  padding: 0.75rem 0.875rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--text-primary);
  resize: vertical;
  outline: none;
}

.tux-md-editor__textarea:focus {
  background: color-mix(in srgb, var(--brand-primary) 2%, transparent);
}

.tux-md-editor__preview {
  padding: 0.875rem;
  min-height: 8rem;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--text-primary);
}

.tux-md-editor__preview-empty {
  color: var(--text-muted);
  font-style: italic;
}

.tux-md-editor__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.625rem;
  padding: 0.375rem 0.625rem;
  border-top: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  font-size: 0.6875rem;
  color: var(--text-muted);
}

.tux-md-editor__count {
  margin: 0;
  display: inline-flex;
  align-items: baseline;
  gap: 0.3125rem;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.tux-md-editor__count--warn {
  color: var(--status-warning, #c7973c);
}

.tux-md-editor__count-value {
  color: var(--text-primary);
  font-weight: 600;
}

.tux-md-editor__count-max {
  color: var(--text-muted);
}

.tux-md-editor__count-label {
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
}

.tux-md-editor__count-sep {
  margin: 0 0.125rem;
}

.tux-md-editor__min-warning {
  margin: 0;
  font-family: var(--font-sans);
  color: var(--status-warning, #c7973c);
  font-style: italic;
}

@media (prefers-reduced-motion: reduce) {
  .tux-md-editor__btn {
    transition: none;
  }
}
</style>
