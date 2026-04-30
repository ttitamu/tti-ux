<script setup lang="ts">
useHead({ title: "File upload · Forms · TUX" });

interface UploadFile {
  id: string;
  name: string;
  size: number;
  progress: number; // 0-100
  status: "uploading" | "complete" | "error";
  error?: string;
}

const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<UploadFile[]>([
  { id: "1", name: "corridor-protocol-v3.pdf", size: 2_412_882, progress: 100, status: "complete" },
  { id: "2", name: "field-data-march.csv",     size: 184_211,   progress: 100, status: "complete" },
  { id: "3", name: "geo-overlay.shp.zip",      size: 8_904_512, progress: 62,  status: "uploading" },
  { id: "4", name: "video-12gb.mp4",           size: 12_104_882_000, progress: 0, status: "error", error: "File exceeds 5 GB limit" },
]);

const isDragging = ref(false);

function format(bytes: number): string {
  const u = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(n >= 10 ? 0 : 1)} ${u[i]}`;
}

function handleDrop(e: DragEvent) {
  e.preventDefault();
  isDragging.value = false;
  const list = e.dataTransfer?.files;
  if (!list) return;
  for (const f of Array.from(list)) {
    files.value.push({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      progress: 0,
      status: "uploading",
    });
  }
}

function handleSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files) return;
  for (const f of Array.from(input.files)) {
    files.value.push({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      progress: 0,
      status: "uploading",
    });
  }
}

function remove(id: string) {
  files.value = files.value.filter((f) => f.id !== id);
}
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="forms · primitive" title="File upload">
      Drag-drop dropzone with file list and per-file progress. Native
      <code>&lt;input type="file"&gt;</code> + drag handlers — no
      external dependency. Pattern shown here is a working sketch;
      consuming apps wire it to their actual upload backend (S3
      presigned URL, server endpoint, etc.).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">dropzone</p>
      <h2 class="heading--bold text-xl font-bold">Drag-drop or click to select</h2>
      <div
        class="mt-4 dropzone"
        :class="isDragging ? 'dropzone--active' : ''"
        @dragenter.prevent="isDragging = true"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop="handleDrop"
        @click="fileInput?.click()"
        @keydown.enter="fileInput?.click()"
        role="button"
        tabindex="0"
        aria-label="Upload files: drag and drop, or click to select"
      >
        <UIcon name="lucide:upload-cloud" class="w-8 h-8 text-text-brand" />
        <p class="mt-2 font-bold">Drop files here, or click to select</p>
        <p class="mt-1 text-sm text-text-secondary">PDF, CSV, ZIP, or image files up to 5 GB each.</p>
        <input
          ref="fileInput"
          type="file"
          multiple
          class="sr-only"
          @change="handleSelect"
        />
      </div>
    </section>

    <section>
      <p class="eyebrow">file list</p>
      <h2 class="heading--bold text-xl font-bold">Status states + per-file progress</h2>
      <ul class="mt-4 space-y-2">
        <li
          v-for="f in files"
          :key="f.id"
          class="flex items-center gap-3 px-3 py-2 border border-surface-border rounded-md bg-surface-raised"
        >
          <UIcon
            :name="f.status === 'complete' ? 'lucide:check-circle-2'
                 : f.status === 'error'    ? 'lucide:alert-triangle'
                 :                           'lucide:upload'"
            class="w-5 h-5 flex-shrink-0"
            :class="f.status === 'complete' ? 'text-text-success'
                  : f.status === 'error'    ? 'text-text-error'
                  :                           'text-text-brand'"
          />
          <div class="flex-1 min-w-0">
            <p class="font-mono text-sm truncate">{{ f.name }}</p>
            <p class="text-xs text-text-muted">
              {{ format(f.size) }}
              <span v-if="f.status === 'uploading'"> · {{ f.progress }}%</span>
              <span v-if="f.status === 'error'" class="text-text-error"> · {{ f.error }}</span>
            </p>
            <div
              v-if="f.status === 'uploading'"
              class="mt-1 h-1 bg-surface-sunken rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-text-brand transition-all"
                :style="{ width: `${f.progress}%` }"
              />
            </div>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            size="xs"
            icon="lucide:x"
            :aria-label="`Remove ${f.name}`"
            @click="remove(f.id)"
          />
        </li>
      </ul>
    </section>

    <section>
      <p class="eyebrow">notes</p>
      <h2 class="heading--bold text-lg font-bold">Wiring it up</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        The pattern above stops at the UI surface. Actual upload
        flow (chunked PUTs, retry, abort) lives in the host app.
        For PECAN, the agent ingests files on disk; this surface
        applies to the admin UI's "register a corpus document" path.
        Standard browser file APIs apply — <code>File</code> +
        <code>FormData</code> + <code>fetch</code>, or your S3 SDK.
      </p>
    </section>
  </div>
</template>

<style scoped>
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  border: 2px dashed var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-sunken);
  cursor: pointer;
  text-align: center;
  transition:
    border-color var(--motion-fast) var(--ease-standard),
    background var(--motion-fast) var(--ease-standard);
}

.dropzone:hover,
.dropzone:focus-visible {
  border-color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 4%, var(--surface-sunken));
}

.dropzone--active {
  border-color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 10%, var(--surface-sunken));
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
