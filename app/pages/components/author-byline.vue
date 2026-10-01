<script setup lang="ts">
/**
 * /components/author-byline — Dedicated showcase for TuxAuthorByline.
 */
import type { TuxByLineAuthor } from "../../components/TuxAuthorByline.vue";

useHead({ title: "TuxAuthorByline · Components · TUX" });

const layout = ref<"compact" | "stacked">("compact");
const showOrcid = ref(true);

const sampleAuthors: TuxByLineAuthor[] = [
  {
    name: "Dr. Marcus Hassan",
    affiliations: [1, 2],
    orcid: "0000-0002-1234-5678",
    corresponding: true,
    email: "mhassan@tti.tamu.edu",
  },
  {
    name: "L. Velazquez",
    affiliations: [1],
    orcid: "0000-0001-9876-5432",
  },
  {
    name: "Dr. Ricardo Chen",
    affiliations: [1, 3],
  },
];

const sampleAffiliations = [
  "Texas A&M Transportation Institute, System Reliability Division",
  "Zachry Department of Civil & Environmental Engineering, Texas A&M University",
  "Center for Connected and Automated Transportation (CCAT)",
];

const sampleVue = computed(() => `<TuxAuthorByline
  layout="${layout.value}"
  :authors="[
    { name: 'Dr. Marcus Hassan', affiliations: [1, 2], orcid: '0000-0002-1234-5678', corresponding: true, email: 'mhassan@tti.tamu.edu' },
    { name: 'L. Velazquez', affiliations: [1]${showOrcid.value ? ", orcid: '0000-0001-9876-5432'" : ""} },
    { name: 'Dr. Ricardo Chen', affiliations: [1, 3] },
  ]"
  :affiliations="[
    'Texas A&M Transportation Institute, System Reliability Division',
    'Zachry Department of Civil & Environmental Engineering, Texas A&M University',
    'Center for Connected and Automated Transportation (CCAT)',
  ]"
/>`);
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · research & publishing" title="TuxAuthorByline">
      Canonical academic author byline with numbered affiliation superscripts,
      ORCID identifiers, corresponding author markers, and responsive compact/stacked layouts.
    </TuxPageHeader>

    <!-- Interactive Showcase -->
    <section class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p class="eyebrow">interactive showcase</p>
          <h2 class="heading--bold text-xl font-bold">Byline Rhythms</h2>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-3 text-xs bg-surface-sunken p-2 rounded-lg border border-surface-border">
          <div class="flex items-center gap-1.5">
            <span class="text-text-muted">Layout:</span>
            <select
              v-model="layout"
              aria-label="Author byline layout"
              class="bg-surface-raised border border-surface-border rounded px-1.5 py-0.5 text-xs text-text-primary"
            >
              <option value="compact">compact</option>
              <option value="stacked">stacked</option>
            </select>
          </div>
          <label class="flex items-center gap-1.5 pl-2 border-l border-surface-border cursor-pointer text-text-secondary hover:text-text-primary">
            <input v-model="showOrcid" type="checkbox" class="rounded border-surface-border text-brand-primary" />
            <span>Show ORCID</span>
          </label>
        </div>
      </div>

      <!-- Preview -->
      <div class="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-xs space-y-4">
        <TuxAuthorByline
          :layout="layout"
          :authors="sampleAuthors"
          :affiliations="sampleAffiliations"
        />
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
              <td class="p-3 font-semibold text-brand-primary">authors</td>
              <td class="p-3 text-text-secondary">TuxByLineAuthor[]</td>
              <td class="p-3 text-text-muted">required</td>
              <td class="p-3 font-sans text-text-secondary">Array of author records with names, affiliation indices, ORCIDs, and corresponding author indicators.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">affiliations</td>
              <td class="p-3 text-text-secondary">string[]</td>
              <td class="p-3 text-text-muted">[]</td>
              <td class="p-3 font-sans text-text-secondary">Numbered institutional affiliations list corresponding to author indices (1-indexed).</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">layout</td>
              <td class="p-3 text-text-secondary">"compact" | "stacked"</td>
              <td class="p-3 text-text-muted">"compact"</td>
              <td class="p-3 font-sans text-text-secondary">Inline flowing byline with footnotes list vs. vertically stacked multi-row layout.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
