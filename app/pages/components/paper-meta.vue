<script setup lang="ts">
/**
 * /components/paper-meta — Dedicated showcase for TuxPaperMeta.
 */
useHead({ title: "TuxPaperMeta · Components · TUX" });

const paperType = ref("Research Article");
const venue = ref("Transportation Research Record");
const publishedDate = ref("2026-08-14");
const doi = ref("10.1177/03611981251123456");
const license = ref("CC-BY 4.0");

const sampleVue = computed(() => `<TuxPaperMeta
  type="${paperType.value}"
  venue="${venue.value}"
  published="${publishedDate.value}"
  pages="118-134"
  doi="${doi.value}"
  license="${license.value}"
  :funders="['Federal Highway Administration (FHWA HRDS-30)', 'TxDOT Research Project 0-7042']"
/>`);
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · research & publishing" title="TuxPaperMeta">
      Compact metadata strip for academic papers and technical research reports.
      Standardizes DOI links, open-access licensing badges, funding grant numbers, and journal venues.
    </TuxPageHeader>

    <!-- Interactive Showcase -->
    <section class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p class="eyebrow">interactive showcase</p>
          <h2 class="heading--bold text-xl font-bold">Publication Metadata Strip</h2>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-3 text-xs bg-surface-sunken p-2 rounded-lg border border-surface-border">
          <div class="flex items-center gap-1.5">
            <span class="text-text-muted">Type:</span>
            <select v-model="paperType" aria-label="Paper type" class="bg-surface-raised border border-surface-border rounded px-1.5 py-0.5 text-xs text-text-primary">
              <option value="Research Article">Research Article</option>
              <option value="Technical Report">Technical Report</option>
              <option value="Policy Brief">Policy Brief</option>
            </select>
          </div>
          <div class="flex items-center gap-1.5 pl-2 border-l border-surface-border">
            <span class="text-text-muted">License:</span>
            <select v-model="license" aria-label="Publication license" class="bg-surface-raised border border-surface-border rounded px-1.5 py-0.5 text-xs text-text-primary">
              <option value="CC-BY 4.0">CC-BY 4.0</option>
              <option value="CC0 Public Domain">CC0</option>
              <option value="All Rights Reserved">Copyrighted</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div class="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-xs space-y-4">
        <TuxPaperMeta
          :type="paperType"
          :venue="venue"
          :published="publishedDate"
          pages="118-134"
          :doi="doi"
          :license="license"
          :funders="['Federal Highway Administration (FHWA HRDS-30)', 'TxDOT Research Project 0-7042']"
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
              <td class="p-3 font-semibold text-brand-primary">doi</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">undefined</td>
              <td class="p-3 font-sans text-text-secondary">Digital Object Identifier suffix linking to the official resolver.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">license</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">undefined</td>
              <td class="p-3 font-sans text-text-secondary">Distribution licensing string (e.g. CC-BY 4.0).</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">funders</td>
              <td class="p-3 text-text-secondary">string[]</td>
              <td class="p-3 text-text-muted">[]</td>
              <td class="p-3 font-sans text-text-secondary">Array of sponsoring agency names and grant reference IDs.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">published</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">undefined</td>
              <td class="p-3 font-sans text-text-secondary">Publication or release date string.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">venue</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">undefined</td>
              <td class="p-3 font-sans text-text-secondary">Journal name, conference proceedings, or research series title.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
