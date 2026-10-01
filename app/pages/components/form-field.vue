<script setup lang="ts">
/**
 * /components/form-field — Dedicated showcase for TuxFormField.
 */
useHead({ title: "TuxFormField · Components · TUX" });

const layout = ref<"stacked" | "inline">("stacked");
const isRequired = ref(true);
const showHelp = ref(true);
const triggerError = ref(false);

const emailValue = ref("");
const errorMessage = computed(() =>
  triggerError.value ? "Enter a valid institutional email address ending with @tti.tamu.edu." : ""
);

const sampleVue = computed(() => `<TuxFormField
  label="Principal Investigator Email"
  layout="${layout.value}"
  ${isRequired.value ? "required" : ""}
  ${showHelp.value ? 'help="Used strictly for project notification dispatches and access verification."' : ""}
  hint="Institutional @tti.tamu.edu address preferred."
  ${triggerError.value ? 'error="Enter a valid institutional email address."' : ""}
>
  <template #default="{ inputId, ariaDescribedby, ariaInvalid, ariaRequired }">
    <UInput
      :id="inputId"
      v-model="email"
      type="email"
      placeholder="researcher@tti.tamu.edu"
      :aria-describedby="ariaDescribedby"
      :aria-invalid="ariaInvalid"
      :aria-required="ariaRequired"
    />
  </template>
</TuxFormField>`);
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · forms & controls" title="TuxFormField">
      The canonical form-field wrapper: consistently arranges label, required indicator,
      info-popover help, input slot with automatic a11y attributes, hint text, and inline validation errors.
    </TuxPageHeader>

    <!-- Interactive Showcase -->
    <section class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p class="eyebrow">interactive showcase</p>
          <h2 class="heading--bold text-xl font-bold">Field Cluster & a11y Scope</h2>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-3 text-xs bg-surface-sunken p-2 rounded-lg border border-surface-border">
          <div class="flex items-center gap-1.5">
            <span class="text-text-muted">Layout:</span>
            <select v-model="layout" aria-label="Layout" class="bg-surface-raised border border-surface-border rounded px-1.5 py-0.5 text-xs text-text-primary">
              <option value="stacked">stacked</option>
              <option value="inline">inline</option>
            </select>
          </div>
          <label class="flex items-center gap-1.5 pl-2 border-l border-surface-border cursor-pointer text-text-secondary hover:text-text-primary">
            <input v-model="isRequired" type="checkbox" class="rounded border-surface-border text-brand-primary" />
            <span>Required</span>
          </label>
          <label class="flex items-center gap-1.5 cursor-pointer text-text-secondary hover:text-text-primary">
            <input v-model="showHelp" type="checkbox" class="rounded border-surface-border text-brand-primary" />
            <span>Help Icon</span>
          </label>
          <label class="flex items-center gap-1.5 cursor-pointer text-text-secondary hover:text-text-primary">
            <input v-model="triggerError" type="checkbox" class="rounded border-surface-border text-brand-primary" />
            <span>Simulate Error</span>
          </label>
        </div>
      </div>

      <!-- Preview -->
      <div class="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-xs space-y-4 max-w-xl">
        <TuxFormField
          label="Principal Investigator Email"
          :layout="layout"
          :required="isRequired"
          :help="showHelp ? 'Used strictly for project notification dispatches and access verification.' : undefined"
          hint="Institutional @tti.tamu.edu address preferred."
          :error="errorMessage"
        >
          <template #default="{ inputId, ariaDescribedby, ariaInvalid, ariaRequired }">
            <UInput
              :id="inputId"
              v-model="emailValue"
              type="email"
              placeholder="researcher@tti.tamu.edu"
              :aria-describedby="ariaDescribedby"
              :aria-invalid="ariaInvalid"
              :aria-required="ariaRequired"
            />
          </template>
        </TuxFormField>
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
      <h2 class="heading--bold text-xl font-bold">Props & Scoped Slot</h2>
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
              <td class="p-3 text-text-muted">required</td>
              <td class="p-3 font-sans text-text-secondary">Primary label rendered above or adjacent to the input element.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">help</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">undefined</td>
              <td class="p-3 font-sans text-text-secondary">Additional context revealed via an accessible info-icon popover.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">hint</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">undefined</td>
              <td class="p-3 font-sans text-text-secondary">Permanently visible supplementary instruction text beneath the label.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">error</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">undefined</td>
              <td class="p-3 font-sans text-text-secondary">Validation error message; automatically wires aria-invalid on the input.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">layout</td>
              <td class="p-3 text-text-secondary">"stacked" | "inline"</td>
              <td class="p-3 text-text-muted">"stacked"</td>
              <td class="p-3 font-sans text-text-secondary">Arrangement geometry for label and input elements.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
