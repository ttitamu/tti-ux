<script setup lang="ts">
/**
 * /components/validation-summary — Dedicated showcase for TuxValidationSummary.
 */
import type { TuxValidationError } from "../../components/TuxValidationSummary.vue";

useHead({ title: "TuxValidationSummary · Components · TUX" });

const summaryVariant = ref<"error" | "warning">("error");
const showErrors = ref(true);

const sampleErrors: TuxValidationError[] = [
  { fieldId: "fld-title", fieldLabel: "Project Title", message: "Title must be between 10 and 120 characters." },
  { fieldId: "fld-pi-email", fieldLabel: "PI Email", message: "Enter a valid @tti.tamu.edu institutional address." },
  { fieldId: "fld-grant-num", fieldLabel: "Grant Number", message: "Grant identifier format must match FHWA or TxDOT syntax (e.g. 0-7042)." },
  { message: "You must confirm compliance with the institutional export control and ITAR policy." },
];

const sampleVue = computed(() => `<TuxValidationSummary
  variant="${summaryVariant.value}"
  title="${summaryVariant.value === 'error' ? 'Please correct the 4 issues below:' : 'Please review the following warnings:'}"
  :errors="[
    { fieldId: 'fld-title', fieldLabel: 'Project Title', message: 'Title must be between 10 and 120 characters.' },
    { fieldId: 'fld-pi-email', fieldLabel: 'PI Email', message: 'Enter a valid @tti.tamu.edu address.' },
    { fieldId: 'fld-grant-num', fieldLabel: 'Grant Number', message: 'Grant identifier format must match syntax.' },
    { message: 'You must confirm compliance with export control policy.' },
  ]"
/>`);
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · forms & controls" title="TuxValidationSummary">
      Aggregated top-of-form error summary box. Gathers all form issues into a single,
      accessible landmark with clickable anchor links that immediately jump to and focus the invalid input.
    </TuxPageHeader>

    <!-- Interactive Showcase -->
    <section class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p class="eyebrow">interactive showcase</p>
          <h2 class="heading--bold text-xl font-bold">Error List & Field Jumping</h2>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-3 text-xs bg-surface-sunken p-2 rounded-lg border border-surface-border">
          <div class="flex items-center gap-1.5">
            <span class="text-text-muted">Tone:</span>
            <select v-model="summaryVariant" aria-label="Summary tone" class="bg-surface-raised border border-surface-border rounded px-1.5 py-0.5 text-xs text-text-primary">
              <option value="error">error (blocking)</option>
              <option value="warning">warning (advisory)</option>
            </select>
          </div>
          <label class="flex items-center gap-1.5 pl-2 border-l border-surface-border cursor-pointer text-text-secondary hover:text-text-primary">
            <input v-model="showErrors" type="checkbox" class="rounded border-surface-border text-brand-primary" />
            <span>Show Summary</span>
          </label>
        </div>
      </div>

      <!-- Preview -->
      <div class="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-xs space-y-4">
        <TuxValidationSummary
          v-if="showErrors"
          :variant="summaryVariant"
          :errors="sampleErrors"
        />
        <p v-else class="text-xs text-text-muted italic py-4 text-center">
          Summary hidden — zero validation errors present.
        </p>
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
              <td class="p-3 font-semibold text-brand-primary">errors</td>
              <td class="p-3 text-text-secondary">TuxValidationError[]</td>
              <td class="p-3 text-text-muted">required</td>
              <td class="p-3 font-sans text-text-secondary">Array of error messages, optional fieldId targets, and field labels.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">title</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">"Please fix the following before submitting:"</td>
              <td class="p-3 font-sans text-text-secondary">Heading text rendered above the error list.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">variant</td>
              <td class="p-3 text-text-secondary">"error" | "warning"</td>
              <td class="p-3 text-text-muted">"error"</td>
              <td class="p-3 font-sans text-text-secondary">Visual styling tone for blocking errors vs advisory warnings.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
