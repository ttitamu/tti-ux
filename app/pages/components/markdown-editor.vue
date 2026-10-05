<script setup lang="ts">
/**
 * /components/markdown-editor — Dedicated showcase for TuxMarkdownEditor.
 */
useHead({ title: "TuxMarkdownEditor · Components · TUX" });

const markdownContent = ref(`## Connected Vehicle Corridors — Q3 Telemetry Report

Preliminary findings from the **I-35 Connected Work Zone** pilot indicate significant speed variance reductions during active lane closures.

### Key Observations
- Average travel delay reduced by **14.2%** across monitored segments.
- Driver compliance with dynamic variable speed limits (VSL) reached **88.6%**.
- Incident clearance times improved by **4.5 minutes** on average.

> Note: Real-time DSRC/C-V2X broadcast latency remained consistently under **20ms** across all roadside units (RSUs).
`);

const rows = ref(10);
const previewEnabled = ref(true);
const disabled = ref(false);
const enforceLimits = ref(false);

const minLength = computed(() => (enforceLimits.value ? 50 : undefined));
const maxLength = computed(() => (enforceLimits.value ? 2000 : undefined));

const sampleVue = computed(() => `<TuxMarkdownEditor
  v-model="content"
  :rows="${rows.value}"
  :preview="${previewEnabled.value}"
  :disabled="${disabled.value}"${enforceLimits.value ? '\n  :min-length="50"\n  :max-length="2000"' : ''}
/>`);
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · forms & controls" title="TuxMarkdownEditor">
      Lightweight markdown authoring surface with formatting toolbar, keyboard
      shortcuts (⌘B, ⌘I, ⌘K, ⌘E), Tab indentation support, character/word
      counting, and instant MDC preview rendering.
    </TuxPageHeader>

    <!-- Interactive Playground -->
    <section class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p class="eyebrow">interactive showcase</p>
          <h2 class="heading--bold text-xl font-bold">Live Editor</h2>
        </div>

        <!-- Controls Toolbar -->
        <div class="flex items-center gap-2 sm:gap-3 text-xs bg-surface-sunken p-2 rounded-lg border border-surface-border flex-wrap">
          <label class="flex items-center gap-1.5 cursor-pointer text-text-secondary hover:text-text-primary">
            <input v-model="previewEnabled" type="checkbox" class="rounded border-surface-border text-brand-primary" />
            <span>Enable Preview</span>
          </label>
          <label class="flex items-center gap-1.5 cursor-pointer text-text-secondary hover:text-text-primary">
            <input v-model="enforceLimits" type="checkbox" class="rounded border-surface-border text-brand-primary" />
            <span>Min/Max Limits</span>
          </label>
          <label class="flex items-center gap-1.5 cursor-pointer text-text-secondary hover:text-text-primary">
            <input v-model="disabled" type="checkbox" class="rounded border-surface-border text-brand-primary" />
            <span>Disabled</span>
          </label>
          <div class="flex items-center gap-1 pl-2 border-l border-surface-border">
            <span class="text-text-muted">Rows:</span>
            <select v-model.number="rows" aria-label="Editor rows" class="bg-surface-raised border border-surface-border rounded px-1.5 py-0.5 text-xs text-text-primary">
              <option :value="6">6</option>
              <option :value="10">10</option>
              <option :value="14">14</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-xs space-y-4">
        <TuxMarkdownEditor
          v-model="markdownContent"
          :rows="rows"
          :preview="previewEnabled"
          :disabled="disabled"
          :min-length="minLength"
          :max-length="maxLength"
          placeholder="Compose research notes or article sections in markdown…"
        />
      </div>
    </section>

    <!-- Code Example -->
    <section class="space-y-3">
      <p class="eyebrow">usage syntax</p>
      <h2 class="heading--bold text-xl font-bold">Code snippet</h2>
      <TuxCodeBlock :code="sampleVue" lang="vue" />
    </section>

    <!-- Props Reference Table -->
    <section class="space-y-3">
      <p class="eyebrow">api reference</p>
      <h2 class="heading--bold text-xl font-bold">Props & Bindings</h2>
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
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">""</td>
              <td class="p-3 font-sans text-text-secondary">Two-way bound markdown string content.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">rows</td>
              <td class="p-3 text-text-secondary">number</td>
              <td class="p-3 text-text-muted">12</td>
              <td class="p-3 font-sans text-text-secondary">Visible text area height in rows.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">preview</td>
              <td class="p-3 text-text-secondary">boolean</td>
              <td class="p-3 text-text-muted">true</td>
              <td class="p-3 font-sans text-text-secondary">Toggles visibility of the preview tab render.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">minLength / maxLength</td>
              <td class="p-3 text-text-secondary">number</td>
              <td class="p-3 text-text-muted">undefined</td>
              <td class="p-3 font-sans text-text-secondary">Validation boundaries with visual counters and status warnings.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">disabled</td>
              <td class="p-3 text-text-secondary">boolean</td>
              <td class="p-3 text-text-muted">false</td>
              <td class="p-3 font-sans text-text-secondary">Prevents editing while maintaining accessible viewing state.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
