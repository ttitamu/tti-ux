<script setup lang="ts">
/**
 * /components/figure-caption — Dedicated showcase for TuxFigureCaption.
 */
useHead({ title: "TuxFigureCaption · Components · TUX" });

const figureLabel = ref("Figure");
const figureNumber = ref(4);
const placement = ref<"above" | "below">("below");
const figureCaption = ref("Mean speed recovery trajectories following dynamic variable speed limit (VSL) alerts across 12 treated test sectors.");
const sourceCredit = ref("Source: TTI Connected Work Zone Pilot Dataset (2025–2026), Federal Highway Administration.");

const sampleVue = computed(() => `<TuxFigureCaption
  label="${figureLabel.value}"
  :number="${figureNumber.value}"
  caption="${figureCaption.value}"
  source="${sourceCredit.value}"
  placement="${placement.value}"
>
  <div class="h-48 bg-surface-sunken rounded-lg flex items-center justify-center">
    <!-- Chart, diagram, or graphic element -->
  </div>
</TuxFigureCaption>`);
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · research & publishing" title="TuxFigureCaption">
      Academic figure and diagram caption container providing accessible
      <code>&lt;figure&gt;</code> wrapping, custom numbering, source credits, and flexible placement.
    </TuxPageHeader>

    <!-- Interactive Showcase -->
    <section class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p class="eyebrow">interactive showcase</p>
          <h2 class="heading--bold text-xl font-bold">Captioned Media & Figures</h2>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-3 text-xs bg-surface-sunken p-2 rounded-lg border border-surface-border">
          <div class="flex items-center gap-1.5">
            <span class="text-text-muted">Placement:</span>
            <select
              v-model="placement"
              aria-label="Caption placement"
              class="bg-surface-raised border border-surface-border rounded px-1.5 py-0.5 text-xs text-text-primary"
            >
              <option value="below">below (figures standard)</option>
              <option value="above">above (tables standard)</option>
            </select>
          </div>
          <div class="flex items-center gap-1.5 pl-2 border-l border-surface-border">
            <span class="text-text-muted">Label:</span>
            <input
              v-model="figureLabel"
              type="text"
              aria-label="Figure label"
              class="bg-surface-raised border border-surface-border rounded px-1.5 py-0.5 text-xs text-text-primary w-20"
            />
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div class="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-xs space-y-4">
        <TuxFigureCaption
          :label="figureLabel"
          :number="figureNumber"
          :caption="figureCaption"
          :source="sourceCredit"
          :placement="placement"
        >
          <div class="h-44 bg-surface-sunken rounded-lg border border-surface-border flex flex-col items-center justify-center gap-2 p-4 text-center">
            <UIcon name="lucide:line-chart" class="w-8 h-8 text-brand-primary/60" />
            <span class="text-xs font-mono text-text-muted">Simulated Visual Graphic / Chart Surface</span>
          </div>
        </TuxFigureCaption>
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
              <td class="p-3 font-semibold text-brand-primary">label</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">"Figure"</td>
              <td class="p-3 font-sans text-text-secondary">Kind prefix ("Figure", "Exhibit", "Diagram", "Plate").</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">number</td>
              <td class="p-3 text-text-secondary">number | string</td>
              <td class="p-3 text-text-muted">required</td>
              <td class="p-3 font-sans text-text-secondary">Figure number identifier (e.g. 1, 2.1, or 'A-3').</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">caption</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">undefined</td>
              <td class="p-3 font-sans text-text-secondary">Descriptive caption prose explaining the illustration.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">source</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">undefined</td>
              <td class="p-3 font-sans text-text-secondary">Attribution note or data credit rendered in muted italic typography.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">placement</td>
              <td class="p-3 text-text-secondary">"above" | "below"</td>
              <td class="p-3 text-text-muted">"below"</td>
              <td class="p-3 font-sans text-text-secondary">Position of the caption element relative to the graphic slot content.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
