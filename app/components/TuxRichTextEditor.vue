<script setup lang="ts">
/**
 * TuxRichTextEditor — Tiptap-based WYSIWYG editor.
 *
 * Sister to `TuxMarkdownEditor` for the rendered-only case — when
 * the consumer surface wants "what you see is what you get" with
 * inline media embeds. The split:
 *
 *   - `TuxMarkdownEditor` — source-controllable markdown authoring.
 *     Default for editorial-research output (clean diffs, portable,
 *     no lossy round-trip).
 *   - `TuxRichTextEditor`  — WYSIWYG for surfaces where users won't
 *     hand-edit the source: blog drafts, internal-comms notes,
 *     comments-with-formatting, AI-studio chat composition.
 *
 * **Canonical TUX rich-text surface.** Feature set mirrors the
 * docs-tti-tamu-edu admin-center editor: source / WYSIWYG toggle,
 * tables, task lists, code-block syntax highlighting, typography
 * substitutions, full-screen mode, word / character count, save
 * keyboard shortcut. Designed so consumers across the TTI stack
 * (Landscape, tti-ai-studio, docs.it.tamu.edu admin, internal CMS
 * surfaces) can adopt one shared editor with one shared chrome.
 *
 * **v-model binds HTML** (not markdown). Host owns sanitization on
 * persist. Source-mode toggle exposes the raw HTML for direct
 * editing; round-trips cleanly back to WYSIWYG.
 *
 * **Bundle.** Tiptap core / vue-3 / starter-kit / link / image /
 * placeholder / underline are transitive via `@nuxt/ui` 4.7. Tables,
 * task lists, typography, and code-block-lowlight (+ `lowlight`) are
 * direct devDependencies pinned to NuxtUI's exact Tiptap version
 * (3.22.4) to avoid peer-dep churn.
 */

import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Typography from "@tiptap/extension-typography";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

interface Props {
  /** v-model — HTML string. */
  modelValue?: string;
  /** Placeholder rendered while empty. */
  placeholder?: string;
  /** Disable the editor + toolbar. */
  disabled?: boolean;
  /** Minimum editor height. Default `12rem`. */
  minHeight?: string;
  /** Maximum editor height before scroll. Default `auto`. */
  maxHeight?: string;
  /** Which toolbar groups to show. Default all seven. */
  toolbar?: Array<"format" | "headings" | "lists" | "block" | "media" | "table" | "mode">;
  /** Heading levels exposed in the toolbar. Default `[1, 2, 3, 4]`. */
  headingLevels?: Array<1 | 2 | 3 | 4>;
  /** Show the word / character count footer. Default true. */
  showCount?: boolean;
  /** Show the full-screen toggle button. Default true. */
  fullscreenable?: boolean;
  /** Accessible label for the editor surface. */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  placeholder: "Start writing…",
  disabled: false,
  minHeight: "12rem",
  maxHeight: "auto",
  toolbar: () => ["format", "headings", "lists", "block", "media", "table", "mode"],
  headingLevels: () => [1, 2, 3, 4],
  showCount: true,
  fullscreenable: true,
  ariaLabel: "Rich text editor",
});

const emit = defineEmits<{
  "update:modelValue": [v: string];
  update: [v: string];
  focus: [];
  blur: [];
  save: [];
  "mode-change": [mode: "wysiwyg" | "source"];
  "fullscreen-change": [v: boolean];
}>();

// `shallowRef` per Tiptap's vue-3 docs: the Editor instance carries its
// own reactivity, and wrapping it in a deep `ref()` makes Vue try to
// proxy ProseMirror's internal state — which both breaks editor
// behavior and confuses vue-tsc into inferring a Vue component-instance
// shape on the bound prop (TS2322 vs Editor | undefined).
//
// `undefined` (not `null`) as the empty state to line up with
// `<EditorContent>`'s prop type.
const editor = shallowRef<Editor | undefined>(undefined);
const mode = ref<"wysiwyg" | "source">("wysiwyg");
const isFullscreen = ref(false);
const sourceText = ref(props.modelValue);
const sourceTextarea = ref<HTMLTextAreaElement | null>(null);
const wordCount = ref(0);
const characterCount = ref(0);

// Lowlight registry — `common` covers ~30 popular languages without
// pulling all of highlight.js. Consumers can extend by re-importing
// this module and calling `lowlight.register(...)`; the Editor's
// existing CodeBlockLowlight extension picks up the additions.
const lowlight = createLowlight(common);

function recountFromHtml(html: string) {
  const text = html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
  characterCount.value = text.replace(/\s/g, "").length;
  wordCount.value = text.trim().split(/\s+/).filter(Boolean).length;
}

onMounted(() => {
  editor.value = new Editor({
    content: props.modelValue,
    editable: !props.disabled,
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "tux-rte__link", rel: "noopener noreferrer" },
      }),
      Image.configure({
        HTMLAttributes: { class: "tux-rte__image" },
        allowBase64: true,
      }),
      Placeholder.configure({ placeholder: props.placeholder }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Typography,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    editorProps: {
      attributes: {
        class: "tux-rte__content",
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": props.ariaLabel,
      },
      handleKeyDown: (_view, event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "s") {
          event.preventDefault();
          emit("save");
          return true;
        }
        return false;
      },
    },
    onCreate({ editor: e }) {
      recountFromHtml(e.getHTML());
    },
    onUpdate({ editor: e }) {
      const html = e.getHTML();
      recountFromHtml(html);
      if (mode.value === "wysiwyg") {
        sourceText.value = html;
        emit("update:modelValue", html);
        emit("update", html);
      }
    },
    onFocus() { emit("focus"); },
    onBlur()  { emit("blur"); },
  });
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

// Keep external v-model writes in sync without re-running the
// constructor (Tiptap manages its own internal state).
watch(() => props.modelValue, (next) => {
  if (!editor.value) return;
  if (mode.value === "source") {
    sourceText.value = next;
    return;
  }
  if (next === editor.value.getHTML()) return;
  editor.value.commands.setContent(next, { emitUpdate: false });
  recountFromHtml(next);
  sourceText.value = next;
});

watch(() => props.disabled, (next) => {
  editor.value?.setEditable(!next);
});

function toggleMode() {
  if (mode.value === "wysiwyg") {
    sourceText.value = editor.value?.getHTML() ?? "";
    mode.value = "source";
    nextTick(() => sourceTextarea.value?.focus());
  } else {
    // Bring source edits back into the WYSIWYG editor.
    editor.value?.commands.setContent(sourceText.value, { emitUpdate: false });
    recountFromHtml(sourceText.value);
    emit("update:modelValue", sourceText.value);
    emit("update", sourceText.value);
    mode.value = "wysiwyg";
    nextTick(() => editor.value?.commands.focus());
  }
  emit("mode-change", mode.value);
}

function onSourceInput(e: Event) {
  const html = (e.target as HTMLTextAreaElement).value;
  sourceText.value = html;
  recountFromHtml(html);
  emit("update:modelValue", html);
  emit("update", html);
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
  emit("fullscreen-change", isFullscreen.value);
}

// Escape closes full-screen mode (mirrors browser conventions).
function onWindowKey(e: KeyboardEvent) {
  if (e.key === "Escape" && isFullscreen.value) {
    isFullscreen.value = false;
    emit("fullscreen-change", false);
  }
}
onMounted(() => window.addEventListener("keydown", onWindowKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onWindowKey));

// `Props["toolbar"]` is `Array<...> | undefined` (it's an optional prop
// even though it always resolves to a default in `withDefaults`). Strip
// the `undefined` before indexing or TS rejects the `[number]` lookup.
type ToolbarGroup = NonNullable<Props["toolbar"]>[number];

function showGroup(name: ToolbarGroup) {
  return props.toolbar.includes(name);
}

function isActive(name: string, attrs?: Record<string, unknown>): boolean {
  return editor.value?.isActive(name, attrs) ?? false;
}

function chain() {
  return editor.value?.chain().focus();
}

function setLink() {
  if (!editor.value) return;
  const previous = editor.value.getAttributes("link")?.href as string | undefined;
  const url = window.prompt("Link URL", previous ?? "https://");
  if (url === null) return;
  if (url === "") {
    chain()?.unsetLink().run();
    return;
  }
  chain()?.extendMarkRange("link").setLink({ href: url }).run();
}

function setImage() {
  if (!editor.value) return;
  const url = window.prompt("Image URL", "https://");
  if (!url) return;
  const alt = window.prompt("Alt text (describe the image — leave empty for decorative)", "") ?? "";
  chain()?.setImage({ src: url, alt }).run();
}

function insertTable() {
  chain()?.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
}

function addColumn() { chain()?.addColumnAfter().run(); }
function addRow()    { chain()?.addRowAfter().run(); }
function deleteCol() { chain()?.deleteColumn().run(); }
function deleteRow() { chain()?.deleteRow().run(); }
function deleteTable() { chain()?.deleteTable().run(); }

const inTable = computed(() => isActive("table"));
</script>

<template>
  <div
    class="tux-rte"
    :class="{
      'tux-rte--disabled': disabled,
      'tux-rte--fullscreen': isFullscreen,
      'tux-rte--source-mode': mode === 'source',
    }"
  >
    <div
      v-if="!disabled"
      class="tux-rte__toolbar"
      role="toolbar"
      :aria-label="`${ariaLabel} toolbar`"
    >
      <template v-if="showGroup('format')">
        <button
          type="button"
          class="tux-rte__btn"
          :class="isActive('bold') && 'tux-rte__btn--active'"
          :disabled="mode === 'source'"
          aria-label="Bold"
          title="Bold (⌘B)"
          @click="chain()?.toggleBold().run()"
        >
          <UIcon name="lucide:bold" class="tux-rte__btn-icon" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="tux-rte__btn"
          :class="isActive('italic') && 'tux-rte__btn--active'"
          :disabled="mode === 'source'"
          aria-label="Italic"
          title="Italic (⌘I)"
          @click="chain()?.toggleItalic().run()"
        >
          <UIcon name="lucide:italic" class="tux-rte__btn-icon" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="tux-rte__btn"
          :class="isActive('underline') && 'tux-rte__btn--active'"
          :disabled="mode === 'source'"
          aria-label="Underline"
          title="Underline (⌘U)"
          @click="chain()?.toggleUnderline().run()"
        >
          <UIcon name="lucide:underline" class="tux-rte__btn-icon" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="tux-rte__btn"
          :class="isActive('strike') && 'tux-rte__btn--active'"
          :disabled="mode === 'source'"
          aria-label="Strikethrough"
          @click="chain()?.toggleStrike().run()"
        >
          <UIcon name="lucide:strikethrough" class="tux-rte__btn-icon" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="tux-rte__btn"
          :class="isActive('code') && 'tux-rte__btn--active'"
          :disabled="mode === 'source'"
          aria-label="Inline code"
          @click="chain()?.toggleCode().run()"
        >
          <UIcon name="lucide:code" class="tux-rte__btn-icon" aria-hidden="true" />
        </button>
      </template>

      <span v-if="showGroup('format') && showGroup('headings')" class="tux-rte__divider" aria-hidden="true" />

      <template v-if="showGroup('headings')">
        <button
          v-for="level in headingLevels"
          :key="level"
          type="button"
          class="tux-rte__btn"
          :class="isActive('heading', { level }) && 'tux-rte__btn--active'"
          :disabled="mode === 'source'"
          :aria-label="`Heading ${level}`"
          @click="chain()?.toggleHeading({ level }).run()"
        >
          <UIcon :name="`lucide:heading-${level}`" class="tux-rte__btn-icon" aria-hidden="true" />
        </button>
      </template>

      <span v-if="showGroup('headings') && showGroup('lists')" class="tux-rte__divider" aria-hidden="true" />

      <template v-if="showGroup('lists')">
        <button
          type="button"
          class="tux-rte__btn"
          :class="isActive('bulletList') && 'tux-rte__btn--active'"
          :disabled="mode === 'source'"
          aria-label="Bulleted list"
          @click="chain()?.toggleBulletList().run()"
        >
          <UIcon name="lucide:list" class="tux-rte__btn-icon" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="tux-rte__btn"
          :class="isActive('orderedList') && 'tux-rte__btn--active'"
          :disabled="mode === 'source'"
          aria-label="Numbered list"
          @click="chain()?.toggleOrderedList().run()"
        >
          <UIcon name="lucide:list-ordered" class="tux-rte__btn-icon" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="tux-rte__btn"
          :class="isActive('taskList') && 'tux-rte__btn--active'"
          :disabled="mode === 'source'"
          aria-label="Task list"
          @click="chain()?.toggleTaskList().run()"
        >
          <UIcon name="lucide:list-checks" class="tux-rte__btn-icon" aria-hidden="true" />
        </button>
      </template>

      <span v-if="showGroup('lists') && showGroup('block')" class="tux-rte__divider" aria-hidden="true" />

      <template v-if="showGroup('block')">
        <button
          type="button"
          class="tux-rte__btn"
          :class="isActive('blockquote') && 'tux-rte__btn--active'"
          :disabled="mode === 'source'"
          aria-label="Blockquote"
          @click="chain()?.toggleBlockquote().run()"
        >
          <UIcon name="lucide:quote" class="tux-rte__btn-icon" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="tux-rte__btn"
          :class="isActive('codeBlock') && 'tux-rte__btn--active'"
          :disabled="mode === 'source'"
          aria-label="Code block"
          @click="chain()?.toggleCodeBlock().run()"
        >
          <UIcon name="lucide:square-code" class="tux-rte__btn-icon" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="tux-rte__btn"
          :disabled="mode === 'source'"
          aria-label="Horizontal rule"
          @click="chain()?.setHorizontalRule().run()"
        >
          <UIcon name="lucide:minus" class="tux-rte__btn-icon" aria-hidden="true" />
        </button>
      </template>

      <span v-if="showGroup('block') && showGroup('media')" class="tux-rte__divider" aria-hidden="true" />

      <template v-if="showGroup('media')">
        <button
          type="button"
          class="tux-rte__btn"
          :class="isActive('link') && 'tux-rte__btn--active'"
          :disabled="mode === 'source'"
          aria-label="Link"
          title="Link (⌘K)"
          @click="setLink"
        >
          <UIcon name="lucide:link" class="tux-rte__btn-icon" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="tux-rte__btn"
          :disabled="mode === 'source'"
          aria-label="Image"
          @click="setImage"
        >
          <UIcon name="lucide:image" class="tux-rte__btn-icon" aria-hidden="true" />
        </button>
      </template>

      <span v-if="showGroup('media') && showGroup('table')" class="tux-rte__divider" aria-hidden="true" />

      <template v-if="showGroup('table')">
        <button
          type="button"
          class="tux-rte__btn"
          :disabled="mode === 'source'"
          aria-label="Insert table"
          @click="insertTable"
        >
          <UIcon name="lucide:table" class="tux-rte__btn-icon" aria-hidden="true" />
        </button>
        <template v-if="inTable">
          <button type="button" class="tux-rte__btn" aria-label="Add column" @click="addColumn">
            <UIcon name="lucide:between-horizontal-end" class="tux-rte__btn-icon" aria-hidden="true" />
          </button>
          <button type="button" class="tux-rte__btn" aria-label="Add row" @click="addRow">
            <UIcon name="lucide:between-vertical-end" class="tux-rte__btn-icon" aria-hidden="true" />
          </button>
          <button type="button" class="tux-rte__btn" aria-label="Delete column" @click="deleteCol">
            <UIcon name="lucide:columns-2" class="tux-rte__btn-icon" aria-hidden="true" />
          </button>
          <button type="button" class="tux-rte__btn" aria-label="Delete row" @click="deleteRow">
            <UIcon name="lucide:rows-2" class="tux-rte__btn-icon" aria-hidden="true" />
          </button>
          <button type="button" class="tux-rte__btn" aria-label="Delete table" @click="deleteTable">
            <UIcon name="lucide:trash-2" class="tux-rte__btn-icon" aria-hidden="true" />
          </button>
        </template>
      </template>

      <span class="tux-rte__toolbar-spacer" />

      <button
        type="button"
        class="tux-rte__btn"
        aria-label="Undo"
        :disabled="!editor || !editor.can().undo() || mode === 'source'"
        @click="chain()?.undo().run()"
      >
        <UIcon name="lucide:undo-2" class="tux-rte__btn-icon" aria-hidden="true" />
      </button>
      <button
        type="button"
        class="tux-rte__btn"
        aria-label="Redo"
        :disabled="!editor || !editor.can().redo() || mode === 'source'"
        @click="chain()?.redo().run()"
      >
        <UIcon name="lucide:redo-2" class="tux-rte__btn-icon" aria-hidden="true" />
      </button>

      <button
        v-if="fullscreenable"
        type="button"
        class="tux-rte__btn"
        :aria-label="isFullscreen ? 'Exit full screen' : 'Enter full screen'"
        :title="isFullscreen ? 'Exit full screen (Esc)' : 'Full screen'"
        @click="toggleFullscreen"
      >
        <UIcon
          :name="isFullscreen ? 'lucide:minimize-2' : 'lucide:maximize-2'"
          class="tux-rte__btn-icon"
          aria-hidden="true"
        />
      </button>

      <button
        v-if="showGroup('mode')"
        type="button"
        class="tux-rte__btn tux-rte__btn--mode"
        :class="mode === 'source' && 'tux-rte__btn--active'"
        :aria-label="mode === 'wysiwyg' ? 'View HTML source' : 'View rendered'"
        :title="mode === 'wysiwyg' ? 'Source' : 'WYSIWYG'"
        @click="toggleMode"
      >
        <UIcon
          :name="mode === 'wysiwyg' ? 'lucide:code-2' : 'lucide:eye'"
          class="tux-rte__btn-icon"
          aria-hidden="true"
        />
        <span class="tux-rte__btn-text">{{ mode === 'wysiwyg' ? 'Source' : 'WYSIWYG' }}</span>
      </button>
    </div>

    <EditorContent
      v-show="mode === 'wysiwyg'"
      :editor="editor"
      class="tux-rte__editor"
      :style="{
        minHeight: isFullscreen ? undefined : minHeight,
        maxHeight: isFullscreen ? undefined : (maxHeight === 'auto' ? undefined : maxHeight),
        overflowY: maxHeight === 'auto' && !isFullscreen ? undefined : 'auto',
      }"
    />
    <textarea
      v-show="mode === 'source'"
      ref="sourceTextarea"
      class="tux-rte__source"
      :value="sourceText"
      :style="{ minHeight: isFullscreen ? undefined : minHeight }"
      spellcheck="false"
      :aria-label="`${ariaLabel} (HTML source)`"
      @input="onSourceInput"
    />

    <footer v-if="showCount" class="tux-rte__footer">
      <span class="tux-rte__count">
        <strong>{{ wordCount }}</strong> words ·
        <strong>{{ characterCount }}</strong> chars
      </span>
      <span v-if="mode === 'source'" class="tux-rte__mode-pill" title="You are editing raw HTML">
        <UIcon name="lucide:code-2" class="tux-rte__mode-pill-icon" aria-hidden="true" />
        source
      </span>
    </footer>
  </div>
</template>

<style scoped>
.tux-rte {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--surface-border);
  border-radius: 0.5rem;
  background: var(--surface-raised);
  font-family: var(--font-body);
  container-type: inline-size;
}
.tux-rte--disabled {
  opacity: 0.7;
}
.tux-rte--fullscreen {
  position: fixed;
  inset: 0;
  z-index: 60;
  border-radius: 0;
  border: none;
}

.tux-rte__toolbar {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.375rem 0.5rem;
  border-bottom: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  border-radius: 0.5rem 0.5rem 0 0;
  flex-wrap: wrap;
}
.tux-rte--fullscreen .tux-rte__toolbar {
  border-radius: 0;
}

.tux-rte__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  min-width: 1.75rem;
  height: 1.75rem;
  padding: 0 0.375rem;
  background: transparent;
  border: none;
  border-radius: 0.25rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;
  font-family: var(--font-sans);
  font-size: 0.6875rem;
  font-weight: 600;
}
.tux-rte__btn:hover:not(:disabled) {
  background: var(--surface-raised);
  color: var(--brand-primary);
}
.tux-rte__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.tux-rte__btn--active {
  background: color-mix(in srgb, var(--brand-primary) 14%, transparent);
  color: var(--brand-primary);
}
.tux-rte__btn--mode {
  border: 1px solid var(--surface-border);
  padding: 0 0.5rem;
}
.tux-rte__btn-icon {
  width: 0.9375rem;
  height: 0.9375rem;
}
.tux-rte__btn-text {
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.tux-rte__divider {
  width: 1px;
  height: 1rem;
  background: var(--surface-border);
  margin: 0 0.25rem;
}
.tux-rte__toolbar-spacer {
  flex: 1;
}

.tux-rte__editor {
  padding: 0.875rem 1rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-primary);
  flex: 1;
}
.tux-rte--fullscreen .tux-rte__editor {
  overflow-y: auto;
}

.tux-rte__editor :deep(.tux-rte__content) {
  outline: none;
  min-height: inherit;
}

.tux-rte__source {
  flex: 1;
  width: 100%;
  border: none;
  padding: 0.875rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--text-primary);
  background: var(--surface-sunken);
  resize: vertical;
  tab-size: 2;
}
.tux-rte__source:focus {
  outline: none;
}
.tux-rte--fullscreen .tux-rte__source {
  overflow-y: auto;
}

.tux-rte__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-top: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  border-radius: 0 0 0.5rem 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-muted);
}
.tux-rte--fullscreen .tux-rte__footer {
  border-radius: 0;
}
.tux-rte__count strong {
  color: var(--text-secondary);
  font-weight: 600;
}
.tux-rte__mode-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.0625rem 0.375rem;
  background: color-mix(in srgb, var(--brand-primary) 12%, transparent);
  color: var(--brand-primary);
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.tux-rte__mode-pill-icon {
  width: 0.75rem;
  height: 0.75rem;
}

/* ─── Content styles ───────────────────────────────────── */

.tux-rte__editor :deep(.tux-rte__content > * + *) {
  margin-top: 0.75rem;
}
.tux-rte__editor :deep(.tux-rte__content h1) {
  font-family: var(--font-display);
  font-size: 1.625rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--brand-primary);
  margin-top: 1.5rem;
}
.tux-rte__editor :deep(.tux-rte__content h2) {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.25;
  margin-top: 1.25rem;
}
.tux-rte__editor :deep(.tux-rte__content h3) {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.3;
  margin-top: 1rem;
}
.tux-rte__editor :deep(.tux-rte__content h4) {
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 700;
  margin-top: 0.875rem;
}
.tux-rte__editor :deep(.tux-rte__content ul),
.tux-rte__editor :deep(.tux-rte__content ol) {
  padding-left: 1.5rem;
}
.tux-rte__editor :deep(.tux-rte__content ul) { list-style: disc; }
.tux-rte__editor :deep(.tux-rte__content ol) { list-style: decimal; }
.tux-rte__editor :deep(.tux-rte__content li > p) { margin: 0; }

.tux-rte__editor :deep(.tux-rte__content ul[data-type="taskList"]) {
  list-style: none;
  padding-left: 0;
}
.tux-rte__editor :deep(.tux-rte__content ul[data-type="taskList"] li) {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}
.tux-rte__editor :deep(.tux-rte__content ul[data-type="taskList"] li > label) {
  margin-top: 0.1875rem;
  flex-shrink: 0;
}
.tux-rte__editor :deep(.tux-rte__content ul[data-type="taskList"] li > div) {
  flex: 1;
  min-width: 0;
}
.tux-rte__editor :deep(.tux-rte__content ul[data-type="taskList"] input[type="checkbox"]) {
  accent-color: var(--brand-primary);
}

.tux-rte__editor :deep(.tux-rte__content blockquote) {
  border-left: 3px solid var(--brand-primary);
  padding-left: 0.875rem;
  color: var(--text-secondary);
  font-style: italic;
}
.tux-rte__editor :deep(.tux-rte__content code) {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--surface-sunken);
  padding: 0.0625rem 0.25rem;
  border-radius: 0.25rem;
}
.tux-rte__editor :deep(.tux-rte__content pre) {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--surface-sunken);
  padding: 0.75rem 0.875rem;
  border-radius: 0.375rem;
  overflow-x: auto;
}
.tux-rte__editor :deep(.tux-rte__content pre code) {
  background: none;
  padding: 0;
}

/* Tables — Tiptap's resizable table extension wraps the table in a
   .tableWrapper div for horizontal scroll. */
.tux-rte__editor :deep(.tux-rte__content .tableWrapper) {
  overflow-x: auto;
  margin: 0.5rem 0;
}
.tux-rte__editor :deep(.tux-rte__content table) {
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
}
.tux-rte__editor :deep(.tux-rte__content th),
.tux-rte__editor :deep(.tux-rte__content td) {
  border: 1px solid var(--surface-border);
  padding: 0.4375rem 0.625rem;
  text-align: left;
  vertical-align: top;
  position: relative;
}
.tux-rte__editor :deep(.tux-rte__content th) {
  background: var(--surface-sunken);
  font-weight: 700;
}
.tux-rte__editor :deep(.tux-rte__content .selectedCell::after) {
  content: "";
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--brand-primary) 12%, transparent);
  pointer-events: none;
}
.tux-rte__editor :deep(.tux-rte__content .column-resize-handle) {
  position: absolute;
  right: -2px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--brand-primary);
  opacity: 0;
  cursor: col-resize;
}
.tux-rte__editor :deep(.tux-rte__content .tableWrapper:hover .column-resize-handle) {
  opacity: 0.4;
}

.tux-rte__editor :deep(.tux-rte__content hr) {
  border: none;
  border-top: 1px solid var(--surface-border);
  margin: 1.25rem 0;
}

.tux-rte__editor :deep(.tux-rte__link) {
  color: var(--brand-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.tux-rte__editor :deep(.tux-rte__image) {
  max-width: 100%;
  height: auto;
  border-radius: 0.375rem;
  border: 1px solid var(--surface-border);
}

.tux-rte__editor :deep(.tux-rte__content p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: var(--text-muted);
  pointer-events: none;
  height: 0;
}

/* Selection */
.tux-rte__editor :deep(.tux-rte__content ::selection) {
  background: color-mix(in srgb, var(--brand-primary) 20%, transparent);
}

/* Lowlight / highlight.js token classes — minimal set keyed to TUX
   palette. Lowlight emits `.hljs-keyword` / `.hljs-string` / etc.;
   we light up the common families and leave the rest at body color. */
.tux-rte__editor :deep(.hljs-keyword),
.tux-rte__editor :deep(.hljs-selector-tag),
.tux-rte__editor :deep(.hljs-built_in) {
  color: var(--brand-primary);
  font-weight: 600;
}
.tux-rte__editor :deep(.hljs-string),
.tux-rte__editor :deep(.hljs-attr) {
  color: color-mix(in srgb, var(--brand-accent) 80%, var(--text-primary));
}
.tux-rte__editor :deep(.hljs-comment),
.tux-rte__editor :deep(.hljs-quote) {
  color: var(--text-muted);
  font-style: italic;
}
.tux-rte__editor :deep(.hljs-number),
.tux-rte__editor :deep(.hljs-literal) {
  color: var(--brand-accent);
}
.tux-rte__editor :deep(.hljs-function .hljs-title),
.tux-rte__editor :deep(.hljs-title.function_) {
  color: var(--text-primary);
  font-weight: 600;
}
</style>
