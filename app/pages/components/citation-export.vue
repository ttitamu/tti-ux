<script setup lang="ts">
/**
 * /components/citation-export — Dedicated showcase for TuxCitationExport.
 */
import type { TuxCitationData } from "../../components/TuxCitationExport.vue";

useHead({ title: "TuxCitationExport · Components · TUX" });

const sampleCitation: TuxCitationData = {
  authors: ["Hassan, M.", "Velazquez, L.", "Chen, R."],
  title: "Enduring infrastructure cues vs novelty effects: a 36-month follow-up on twelve rural intersection treatments.",
  venue: "Transportation Research Record",
  year: 2025,
  volume: 2671,
  issue: 4,
  pages: "118-134",
  doi: "10.1177/03611981251123456",
  publisher: "SAGE Publications",
};

const triggerLabel = ref("Cite this research");
const buttonVariant = ref<"outline" | "solid" | "ghost">("outline");

const sampleVue = computed(() => `<TuxCitationExport
  :citation="{
    authors: ['Hassan, M.', 'Velazquez, L.', 'Chen, R.'],
    title: 'Enduring infrastructure cues vs novelty effects…',
    venue: 'Transportation Research Record',
    year: 2025,
    volume: 2671,
    issue: 4,
    pages: '118-134',
    doi: '10.1177/03611981251123456'
  }"
  label="${triggerLabel.value}"
  variant="${buttonVariant.value}"
/>`);
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · research & publishing" title="TuxCitationExport">
      Standardized academic citation export menu supporting APA, Chicago,
      MLA, IEEE, BibTeX, and RIS formats with 1-click clipboard copying.
    </TuxPageHeader>

    <!-- Interactive Showcase -->
    <section class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p class="eyebrow">interactive showcase</p>
          <h2 class="heading--bold text-xl font-bold">Citation Trigger & Formats</h2>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-3 text-xs bg-surface-sunken p-2 rounded-lg border border-surface-border">
          <div class="flex items-center gap-1.5">
            <span class="text-text-muted">Variant:</span>
            <select
              v-model="buttonVariant"
              aria-label="Citation button variant"
              class="bg-surface-raised border border-surface-border rounded px-1.5 py-0.5 text-xs text-text-primary"
            >
              <option value="outline">outline</option>
              <option value="solid">solid</option>
              <option value="ghost">ghost</option>
            </select>
          </div>
          <div class="flex items-center gap-1.5 pl-2 border-l border-surface-border">
            <span class="text-text-muted">Label:</span>
            <input
              v-model="triggerLabel"
              type="text"
              aria-label="Citation button label"
              class="bg-surface-raised border border-surface-border rounded px-2 py-0.5 text-xs text-text-primary w-32"
            />
          </div>
        </div>
      </div>

      <!-- Preview Card -->
      <div class="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-xs space-y-6">
        <div class="flex items-center justify-between p-4 bg-surface-sunken rounded-lg border border-surface-border">
          <div class="space-y-1 max-w-xl">
            <p class="text-xs font-mono text-text-muted">Paper: TRR-2025-0982</p>
            <p class="text-sm font-semibold text-text-primary">{{ sampleCitation.title }}</p>
            <p class="text-xs text-text-secondary">{{ sampleCitation.venue }} ({{ sampleCitation.year }}) · DOI: {{ sampleCitation.doi }}</p>
          </div>

          <div class="flex-shrink-0">
            <TuxCitationExport
              :citation="sampleCitation"
              :label="triggerLabel"
              :variant="buttonVariant"
            />
          </div>
        </div>

        <!-- Format breakdown preview -->
        <div class="space-y-2">
          <p class="text-xs font-mono font-semibold uppercase text-text-muted">Supported Output Formats</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div class="p-3 bg-surface-sunken/60 rounded-lg border border-surface-border">
              <span class="font-mono font-bold text-brand-primary block mb-1">APA (7th ed.)</span>
              <p class="text-text-secondary">Author-date citation format common in social and behavioral sciences.</p>
            </div>
            <div class="p-3 bg-surface-sunken/60 rounded-lg border border-surface-border">
              <span class="font-mono font-bold text-brand-primary block mb-1">IEEE</span>
              <p class="text-text-secondary">Bracketed numerical standard for engineering and computing literature.</p>
            </div>
            <div class="p-3 bg-surface-sunken/60 rounded-lg border border-surface-border">
              <span class="font-mono font-bold text-brand-primary block mb-1">BibTeX & RIS</span>
              <p class="text-text-secondary">Structured records compatible with Zotero, Mendeley, and Overleaf / LaTeX.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Usage Code -->
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
              <td class="p-3 font-semibold text-brand-primary">citation</td>
              <td class="p-3 text-text-secondary">TuxCitationData</td>
              <td class="p-3 text-text-muted">required</td>
              <td class="p-3 font-sans text-text-secondary">Source metadata object containing authors, title, venue, year, doi, etc.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">label</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">"Cite"</td>
              <td class="p-3 font-sans text-text-secondary">Visible trigger button label text.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">variant</td>
              <td class="p-3 text-text-secondary">"ghost" | "outline" | "solid"</td>
              <td class="p-3 text-text-muted">"outline"</td>
              <td class="p-3 font-sans text-text-secondary">Visual styling variant passed to the trigger button.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
