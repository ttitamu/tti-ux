<script setup lang="ts">
/**
 * /components/file-dropzone — Dedicated showcase for TuxFileDropzone.
 */
useHead({ title: "TuxFileDropzone · Components · TUX" });

const uploadedFiles = ref<File[]>([]);
const isMultiple = ref(true);
const acceptFormats = ref(".csv,.json,.parquet,.geojson");
const maxFiles = ref(5);
const maxSizeMB = ref(25);

const sampleVue = computed(() => `<TuxFileDropzone
  v-model="files"
  ${isMultiple.value ? 'multiple\n  :max-files="5"' : ''}
  :max-size="${maxSizeMB.value} * 1024 * 1024"
  accept="${acceptFormats.value}"
  hint="Drop transportation telemetry, crash records, or corridor GIS data here."
/>`);
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · forms & controls" title="TuxFileDropzone">
      Accessible drag-and-drop file upload target supporting format filtering,
      size and count constraints, file removal affordances, and keyboard selection.
    </TuxPageHeader>

    <!-- Interactive Showcase -->
    <section class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p class="eyebrow">interactive showcase</p>
          <h2 class="heading--bold text-xl font-bold">Dropzone Target</h2>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-3 text-xs bg-surface-sunken p-2 rounded-lg border border-surface-border">
          <label class="flex items-center gap-1.5 cursor-pointer text-text-secondary hover:text-text-primary">
            <input v-model="isMultiple" type="checkbox" class="rounded border-surface-border text-brand-primary" />
            <span>Multiple Files</span>
          </label>
          <div class="flex items-center gap-1 pl-2 border-l border-surface-border">
            <span class="text-text-muted">Max MB:</span>
            <select v-model.number="maxSizeMB" aria-label="Max file size" class="bg-surface-raised border border-surface-border rounded px-1.5 py-0.5 text-xs text-text-primary">
              <option :value="5">5 MB</option>
              <option :value="25">25 MB</option>
              <option :value="50">50 MB</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Preview Container -->
      <div class="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-xs space-y-4">
        <TuxFileDropzone
          v-model="uploadedFiles"
          :multiple="isMultiple"
          :max-files="maxFiles"
          :max-size="maxSizeMB * 1024 * 1024"
          :accept="acceptFormats"
          hint="Drop CSV / JSON / Parquet / GeoJSON datasets (up to 5 files, 25MB each)."
        />

        <div v-if="uploadedFiles.length > 0" class="pt-2 flex items-center justify-between text-xs text-text-muted">
          <span>{{ uploadedFiles.length }} file{{ uploadedFiles.length > 1 ? 's' : '' }} staged for upload</span>
          <button
            type="button"
            class="text-brand-primary hover:underline font-mono cursor-pointer"
            @click="uploadedFiles = []"
          >
            Clear all files
          </button>
        </div>
      </div>
    </section>

    <!-- Code Snippet -->
    <section class="space-y-3">
      <p class="eyebrow">usage syntax</p>
      <h2 class="heading--bold text-xl font-bold">Code snippet</h2>
      <TuxCodeBlock :code="sampleVue" lang="vue" />
    </section>

    <!-- Props Table -->
    <section class="space-y-3">
      <p class="eyebrow">api reference</p>
      <h2 class="heading--bold text-xl font-bold">Props</h2>
      <div class="overflow-x-auto rounded-lg border border-surface-border">
        <table class="w-full text-left text-sm">
          <thead class="bg-surface-sunken text-xs font-mono font-semibold text-text-secondary uppercase border-b border-surface-border">
            <tr>
              <th class="p-3">Prop</th>
              <th class="p-3">Type</th>
              <th class="p-3">Default</th>
              <th class="p-3">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-border font-mono text-xs">
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">v-model</td>
              <td class="p-3 text-text-secondary">File[]</td>
              <td class="p-3 text-text-muted">[]</td>
              <td class="p-3 font-sans text-text-secondary">Two-way bound array of currently staged files.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">accept</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">undefined</td>
              <td class="p-3 font-sans text-text-secondary">Comma-separated extension or MIME pattern (e.g. ".csv,.json").</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">multiple</td>
              <td class="p-3 text-text-secondary">boolean</td>
              <td class="p-3 text-text-muted">false</td>
              <td class="p-3 font-sans text-text-secondary">Allows staging multiple files simultaneously.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">maxSize</td>
              <td class="p-3 text-text-secondary">number</td>
              <td class="p-3 text-text-muted">50 MB</td>
              <td class="p-3 font-sans text-text-secondary">Maximum allowed file size per item in bytes.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">maxFiles</td>
              <td class="p-3 text-text-secondary">number</td>
              <td class="p-3 text-text-muted">10</td>
              <td class="p-3 font-sans text-text-secondary">Upper limit on staged files when multiple is true.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
