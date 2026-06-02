<script setup lang="ts">
/**
 * TuxFileDropzone — drag-and-drop file upload.
 *
 * Replaces / supplements the standard `<input type="file">` with a
 * branded drop target. Drag a file (or click) to select; emits
 * `update:modelValue` with the selected File array.
 *
 * Features:
 *   - Drag-enter highlight + drop animation (reduced-motion-safe)
 *   - Multi-file or single-file mode
 *   - Accept filter (file extensions or MIME)
 *   - Max size + max file count validation with inline errors
 *   - Selected-file preview list with remove buttons
 *   - Keyboard accessible (Enter/Space activates picker)
 *
 * Two-way bound via `v-model:modelValue` (File[]). For controlled
 * use, set the model from the consumer.
 */
import { computed, ref } from "vue";

interface Props {
  /** Selected files (v-model). */
  modelValue?: File[];
  /** Accept filter — same syntax as <input accept>. */
  accept?: string;
  /** Multi-file mode. Default false. */
  multiple?: boolean;
  /** Max per-file size in bytes. Default 50 MB. */
  maxSize?: number;
  /** Max total file count (when multiple). Default 10. */
  maxFiles?: number;
  /** Disabled state. */
  disabled?: boolean;
  /** Label inside the drop zone. */
  label?: string;
  /** Sub-label (smaller, below the main label). */
  hint?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  accept: undefined,
  multiple: false,
  maxSize: 50 * 1024 * 1024,
  maxFiles: 10,
  disabled: false,
  label: undefined,
  hint: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [files: File[]];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const dragOver = ref(false);
const error = ref<string | null>(null);

const labelText = computed(() =>
  props.label || (props.multiple ? "Drop files here, or click to browse" : "Drop a file here, or click to browse")
);

function onInputChange(e: Event) {
  const target = e.target as HTMLInputElement;
  handleFiles(Array.from(target.files || []));
  target.value = ""; // allow picking the same file twice in a row
}

function onDragOver(e: DragEvent) {
  if (props.disabled) return;
  e.preventDefault();
  dragOver.value = true;
}

function onDragLeave() {
  dragOver.value = false;
}

function onDrop(e: DragEvent) {
  if (props.disabled) return;
  e.preventDefault();
  dragOver.value = false;
  const files = Array.from(e.dataTransfer?.files || []);
  handleFiles(files);
}

function handleFiles(files: File[]) {
  error.value = null;
  if (files.length === 0) return;

  // Filter by accept (when set — match extension or MIME type).
  if (props.accept) {
    const filters = props.accept.split(",").map((f) => f.trim().toLowerCase());
    files = files.filter((f) => {
      const name = f.name.toLowerCase();
      const type = (f.type || "").toLowerCase();
      return filters.some((filter) => {
        if (filter.startsWith(".")) return name.endsWith(filter);
        if (filter.endsWith("/*")) return type.startsWith(filter.slice(0, -1));
        return type === filter;
      });
    });
    if (files.length === 0) {
      error.value = `File type not accepted. Allowed: ${props.accept}`;
      return;
    }
  }

  // Size check.
  const tooBig = files.find((f) => f.size > props.maxSize);
  if (tooBig) {
    error.value = `"${tooBig.name}" is ${formatSize(tooBig.size)} — exceeds the ${formatSize(props.maxSize)} limit.`;
    return;
  }

  const next = props.multiple
    ? [...props.modelValue, ...files].slice(0, props.maxFiles)
    : files.slice(0, 1);

  if (props.multiple && next.length === props.maxFiles && files.length > 0) {
    error.value = `Max ${props.maxFiles} files reached; extras ignored.`;
  }

  emit("update:modelValue", next);
}

function removeFile(idx: number) {
  emit("update:modelValue", props.modelValue.filter((_, i) => i !== idx));
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
</script>

<template>
  <div class="tux-file-dropzone">
    <label
      class="tux-file-dropzone__zone"
      :class="{
        'tux-file-dropzone__zone--drag': dragOver,
        'tux-file-dropzone__zone--disabled': disabled,
      }"
      :aria-disabled="disabled"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <Icon name="lucide:upload-cloud" :size="32" class="tux-file-dropzone__icon" />
      <p class="tux-file-dropzone__label">{{ labelText }}</p>
      <p v-if="hint" class="tux-file-dropzone__hint">{{ hint }}</p>
      <p class="tux-file-dropzone__limits">
        {{ multiple ? `Up to ${maxFiles} files` : "Single file" }} ·
        max {{ formatSize(maxSize) }}{{ accept ? ` · ${accept}` : "" }}
      </p>
      <input
        ref="inputRef"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        :aria-label="labelText"
        class="tux-file-dropzone__input"
        @change="onInputChange"
      >
    </label>

    <p v-if="error" class="tux-file-dropzone__error" role="alert">
      <Icon name="lucide:alert-circle" :size="14" />
      {{ error }}
    </p>

    <ul v-if="modelValue && modelValue.length" class="tux-file-dropzone__list">
      <li v-for="(f, i) in modelValue" :key="i" class="tux-file-dropzone__file">
        <Icon name="lucide:file" :size="16" class="tux-file-dropzone__file-icon" />
        <div class="tux-file-dropzone__file-text">
          <p class="tux-file-dropzone__file-name">{{ f.name }}</p>
          <p class="tux-file-dropzone__file-size">{{ formatSize(f.size) }}</p>
        </div>
        <UButton
          variant="ghost"
          size="xs"
          icon="lucide:x"
          :aria-label="`Remove ${f.name}`"
          @click="removeFile(i)"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tux-file-dropzone {
  font-family: var(--font-sans);
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.tux-file-dropzone__zone {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  border: 2px dashed var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-sunken);
  cursor: pointer;
  color: var(--text-secondary);
  transition: border-color 120ms ease-out, background 120ms ease-out, transform 120ms ease-out;
  text-align: center;
}

.tux-file-dropzone__zone:hover:not(.tux-file-dropzone__zone--disabled),
.tux-file-dropzone__zone:focus-visible:not(.tux-file-dropzone__zone--disabled) {
  border-color: color-mix(in srgb, var(--brand-primary) 50%, var(--surface-border));
  background: color-mix(in srgb, var(--brand-primary) 4%, var(--surface-sunken));
  outline: none;
}

.tux-file-dropzone__zone--drag {
  border-color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 8%, var(--surface-sunken));
  transform: scale(1.005);
}

.tux-file-dropzone__zone--disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.tux-file-dropzone__icon {
  color: var(--brand-primary);
  opacity: 0.7;
}

.tux-file-dropzone__label {
  margin: 0.5rem 0 0 0;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.tux-file-dropzone__hint {
  margin: 0.125rem 0 0 0;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.tux-file-dropzone__limits {
  margin: 0.375rem 0 0 0;
  font-size: 0.6875rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.tux-file-dropzone__input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  border: 0;
}

.tux-file-dropzone__error {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--status-error, #a33a3a);
  font-size: 0.75rem;
  margin: 0;
}

.tux-file-dropzone__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tux-file-dropzone__file {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.625rem;
  background: var(--surface-sunken);
  border-radius: var(--radius-sm);
}

.tux-file-dropzone__file-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.tux-file-dropzone__file-text {
  flex: 1;
  min-width: 0;
}

.tux-file-dropzone__file-name {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tux-file-dropzone__file-size {
  margin: 0;
  font-size: 0.6875rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

@media (prefers-reduced-motion: reduce) {
  .tux-file-dropzone__zone {
    transition: none;
    transform: none !important;
  }
}
</style>
