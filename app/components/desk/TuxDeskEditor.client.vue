<script setup lang="ts">
/**
 * TuxDeskEditor — Visual Block & Prose Editor for TUX.
 *
 * Combines TipTap rich text editing with canonical TUX module components
 * (Hero, Callout, Split, Cards, Steps, CTA, Stats).
 */
import FileHandler from "@tiptap/extension-file-handler";
import Placeholder from "@tiptap/extension-placeholder";
import type { Editor, JSONContent } from "@tiptap/core";
import { EditorContent, useEditor, VueNodeViewRenderer } from "@tiptap/vue-3";
import { assertNever, type MediaKind } from "../../utils/desk/types";
import { parseMediaUrl } from "../../utils/desk/embed";
import { deskRenderExtensions } from "../../utils/desk/extensions";
import { MEDIA_ACCEPT } from "../../utils/desk/media";
import type { ModuleKind } from "../../utils/desk/modules";
import { DeskModule } from "../../utils/desk/nodes";
import { emptyDoc, sanitizeDeskHtml } from "../../utils/desk/render";
import TuxDeskModuleView from "./TuxDeskModuleView.vue";
import TuxDeskModulePalette from "./TuxDeskModulePalette.vue";

interface Props {
  modelValue?: JSONContent;
  disabled?: boolean;
  placeholder?: string;
  seamless?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => emptyDoc,
  disabled: false,
  placeholder: "Write documentation narrative or insert a TUX page module below...",
  seamless: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", doc: JSONContent): void;
  (e: "update:html", html: string): void;
}>();

const toolbarTick = ref(0);
function bumpToolbar() {
  toolbarTick.value += 1;
}

function emitState(instance: Editor) {
  emit("update:modelValue", instance.getJSON());
  emit("update:html", sanitizeDeskHtml(instance.getHTML()));
}

const uploadError = ref("");

function insertMediaUrl(url: string) {
  if (!editor.value || !url.trim()) return;
  const parsed = parseMediaUrl(url);
  switch (parsed.kind) {
    case "youtube":
      editor.value.chain().focus().setYoutubeVideo({ src: parsed.src }).run();
      break;
    case "vimeo":
      editor.value.chain().focus().setDeskVimeo({ src: parsed.src }).run();
      break;
    case "video":
      editor.value.chain().focus().setDeskVideo({ src: parsed.src }).run();
      break;
    case "image":
    case "gif":
    default:
      editor.value.chain().focus().setImage({ src: parsed.src, alt: "" }).run();
      break;
  }
}

function promptMedia() {
  const url = window.prompt("Enter image or video URL (supports YouTube, Vimeo, direct media links):");
  if (url) insertMediaUrl(url);
}

function promptLink() {
  if (!editor.value) return;
  const current = editor.value.getAttributes("link").href || "";
  const url = window.prompt("Enter link URL (e.g. /docs/adr/0001 or https://...):", current);
  if (url === null) return;
  if (url.trim() === "") {
    editor.value.chain().focus().unsetLink().run();
  } else {
    editor.value.chain().focus().setLink({ href: url.trim() }).run();
  }
}

const editor = useEditor({
  content: props.modelValue || emptyDoc,
  editable: !props.disabled,
  extensions: [
    ...deskRenderExtensions.filter((ext) => ext.name !== "deskModule"),
    DeskModule.extend({
      addNodeView() {
        return VueNodeViewRenderer(TuxDeskModuleView, {
          stopEvent: ({ event }) => {
            const el = event.target;
            return (
              el instanceof HTMLElement &&
              Boolean(
                el.closest(
                  "input, textarea, select, button, label, .tux-desk-resize-handle, [data-resize-handle], .tux-desk-node-view__bar"
                )
              )
            );
          },
        });
      },
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
    FileHandler.configure({
      allowedMimeTypes: MEDIA_ACCEPT.split(","),
      consumePasteEvent: true,
      onPaste: (instance, files) => {
        // Handle pasted images as data URIs if offline, or upload
        for (const file of files) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            if (result) instance.chain().focus().setImage({ src: result, alt: file.name }).run();
          };
          reader.readAsDataURL(file);
        }
      },
      onDrop: (instance, files, pos) => {
        for (const file of files) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            if (result) {
              instance.chain().focus().setTextSelection(pos).setImage({ src: result, alt: file.name }).run();
            }
          };
          reader.readAsDataURL(file);
        }
      },
    }),
  ],
  editorProps: {
    attributes: {
      class: "tux-prose tux-desk-editor__doc focus:outline-none min-h-[220px] p-4",
    },
  },
  onCreate: ({ editor: instance }) => {
    emitState(instance);
    bumpToolbar();
  },
  onUpdate: ({ editor: instance }) => {
    emitState(instance);
    bumpToolbar();
  },
  onSelectionUpdate: () => bumpToolbar(),
});

watch(
  () => props.modelValue,
  (newDoc) => {
    if (!editor.value || !newDoc) return;
    if (JSON.stringify(editor.value.getJSON()) === JSON.stringify(newDoc)) return;
    editor.value.commands.setContent(newDoc, { emitUpdate: false });
    emit("update:html", sanitizeDeskHtml(editor.value.getHTML()));
  }
);

watch(
  () => props.disabled,
  (disabled) => {
    editor.value?.setEditable(!disabled);
  }
);

function onInsertModule(kind: ModuleKind) {
  if (!editor.value) return;
  editor.value.chain().focus().setDeskModule({ kind }).run();
}
</script>

<template>
  <div
    class="tux-desk-editor"
    :class="{ 'tux-desk-editor--seamless': seamless }"
    data-testid="tux-desk-editor"
  >
    <!-- Toolbar -->
    <div v-if="editor && !disabled" class="tux-desk-editor__toolbar">
      <div class="flex items-center gap-1 flex-wrap">
        <button
          type="button"
          class="tux-desk-editor__btn"
          :class="{ 'tux-desk-editor__btn--active': editor.isActive('bold') }"
          title="Bold (Ctrl+B)"
          aria-label="Bold (Ctrl+B)"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <UIcon name="lucide:bold" class="w-4 h-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          class="tux-desk-editor__btn"
          :class="{ 'tux-desk-editor__btn--active': editor.isActive('italic') }"
          title="Italic (Ctrl+I)"
          aria-label="Italic (Ctrl+I)"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <UIcon name="lucide:italic" class="w-4 h-4" aria-hidden="true" />
        </button>

        <div class="tux-desk-editor__divider" />

        <button
          type="button"
          class="tux-desk-editor__btn"
          :class="{ 'tux-desk-editor__btn--active': editor.isActive('heading', { level: 2 }) }"
          title="Heading 2"
          aria-label="Heading 2"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        >
          <UIcon name="lucide:heading-2" class="w-4 h-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          class="tux-desk-editor__btn"
          :class="{ 'tux-desk-editor__btn--active': editor.isActive('heading', { level: 3 }) }"
          title="Heading 3"
          aria-label="Heading 3"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        >
          <UIcon name="lucide:heading-3" class="w-4 h-4" aria-hidden="true" />
        </button>

        <div class="tux-desk-editor__divider" />

        <button
          type="button"
          class="tux-desk-editor__btn"
          :class="{ 'tux-desk-editor__btn--active': editor.isActive('bulletList') }"
          title="Bullet list"
          aria-label="Bullet list"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <UIcon name="lucide:list" class="w-4 h-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          class="tux-desk-editor__btn"
          :class="{ 'tux-desk-editor__btn--active': editor.isActive('orderedList') }"
          title="Numbered list"
          aria-label="Numbered list"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <UIcon name="lucide:list-ordered" class="w-4 h-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          class="tux-desk-editor__btn"
          :class="{ 'tux-desk-editor__btn--active': editor.isActive('blockquote') }"
          title="Blockquote"
          aria-label="Blockquote"
          @click="editor.chain().focus().toggleBlockquote().run()"
        >
          <UIcon name="lucide:quote" class="w-4 h-4" aria-hidden="true" />
        </button>

        <div class="tux-desk-editor__divider" />

        <button
          type="button"
          class="tux-desk-editor__btn"
          :class="{ 'tux-desk-editor__btn--active': editor.isActive('link') }"
          title="Link"
          aria-label="Link"
          @click="promptLink"
        >
          <UIcon name="lucide:link" class="w-4 h-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          class="tux-desk-editor__btn"
          title="Insert Media URL"
          aria-label="Insert Media URL"
          @click="promptMedia"
        >
          <UIcon name="lucide:image-plus" class="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- TipTap Editable Area -->
    <div class="tux-desk-editor__canvas">
      <EditorContent :editor="editor" />
    </div>

    <!-- Bottom Module Palette -->
    <div v-if="!disabled" class="mt-4">
      <TuxDeskModulePalette @insert="onInsertModule" />
    </div>
  </div>
</template>

<style scoped>
.tux-desk-editor {
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  overflow: hidden;
  width: 100%;
  min-width: 0;
}

.tux-desk-editor--seamless {
  background: transparent !important;
  border-color: transparent !important;
  box-shadow: none !important;
}

.tux-desk-editor--seamless .tux-desk-editor__toolbar {
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 10px -2px color-mix(in srgb, var(--brand-primary) 8%, transparent);
}

.tux-desk-editor--seamless .tux-desk-editor__canvas {
  background: transparent !important;
}

.tux-desk-editor__toolbar {
  padding: 0.5rem 0.75rem;
  background: var(--surface-sunken);
  border-bottom: 1px solid var(--surface-border);
}

.tux-desk-editor__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.875rem;
  height: 1.875rem;
  border-radius: var(--radius-sm);
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--motion-fast) var(--ease-standard);
}

.tux-desk-editor__btn:hover {
  background: color-mix(in srgb, var(--brand-primary) 12%, transparent);
  color: var(--brand-primary);
}

.tux-desk-editor__btn--active {
  background: var(--brand-primary);
  color: var(--text-on-brand, #ffffff);
}

.tux-desk-editor__divider {
  width: 1px;
  height: 1.25rem;
  background: var(--surface-border);
  margin: 0 0.25rem;
}

.tux-desk-editor__canvas {
  min-height: 240px;
  background: var(--surface-raised);
  width: 100%;
  min-width: 0;
  overflow-x: auto;
}

:deep(.tux-desk-editor__doc) {
  color: var(--text-primary);
  min-width: 0;
  word-break: normal;
  overflow-wrap: break-word;
}

:deep(.tux-desk-editor__doc h1),
:deep(.tux-desk-editor__doc h2),
:deep(.tux-desk-editor__doc h3) {
  color: var(--text-primary);
}

:deep(.tux-desk-editor__doc p),
:deep(.tux-desk-editor__doc ul),
:deep(.tux-desk-editor__doc ol) {
  color: var(--text-secondary);
}

:deep(.tux-desk-editor__doc a) {
  color: var(--brand-secondary);
}

:deep(.tux-desk-editor__doc blockquote) {
  border-left: 3px solid var(--brand-primary);
  color: var(--text-secondary);
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
}

:deep(.tux-desk-editor__doc code) {
  background: var(--surface-sunken);
  color: var(--brand-primary);
  border-radius: var(--radius-sm);
  padding: 0.125rem 0.375rem;
  font-family: var(--font-mono);
}

:deep(.tiptap p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: var(--text-muted);
  pointer-events: none;
  height: 0;
}
</style>
