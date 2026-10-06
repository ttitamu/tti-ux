<script setup lang="ts">
/**
 * /components/form-field — Dedicated showcase for TuxFormField.
 */
import tuxFormFieldSource from "~/components/TuxFormField.vue?raw";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxFormField · Components · TUX" });

const formFieldControls: TuxPropControl[] = [
  {
    prop: "label",
    label: "Field Label",
    type: "text",
    defaultValue: "Principal Investigator Email",
  },
  {
    prop: "layout",
    label: "Layout Geometry",
    type: "select",
    options: ["stacked", "inline"],
    defaultValue: "stacked",
  },
  {
    prop: "required",
    label: "Required Field",
    type: "boolean",
    defaultValue: true,
  },
  {
    prop: "hint",
    label: "Hint Text",
    type: "text",
    defaultValue: "Institutional @tti.tamu.edu address preferred.",
  },
  {
    prop: "help",
    label: "Info Popover Help",
    type: "text",
    defaultValue: "Used strictly for project notification dispatches and access verification.",
  },
  {
    prop: "error",
    label: "Validation Error Message",
    type: "text",
    defaultValue: "",
  },
];

const formFieldPresets: TuxPlaygroundPreset[] = [
  {
    name: "required-email",
    label: "Required Email",
    description: "Standard stacked research field with hint & help popover",
    icon: "lucide:mail",
    values: {
      label: "Principal Investigator Email",
      layout: "stacked",
      required: true,
      hint: "Institutional @tti.tamu.edu address preferred.",
      help: "Used strictly for project notification dispatches and access verification.",
      error: "",
    },
  },
  {
    name: "project-id-inline",
    label: "Inline Project ID",
    description: "Horizontal layout for dense administrative forms",
    icon: "lucide:hash",
    values: {
      label: "Project Charge Number",
      layout: "inline",
      required: true,
      hint: "7-digit TxDOT research agreement code.",
      help: "Found on your sponsored research agreement header.",
      error: "",
    },
  },
  {
    name: "validation-error",
    label: "Simulated Error",
    description: "Invalid state wiring aria-invalid and high-contrast error message",
    icon: "lucide:alert-circle",
    values: {
      label: "Account Number",
      layout: "stacked",
      required: true,
      hint: "Must match active FRS account format.",
      help: "",
      error: "Enter a valid 6-digit departmental account number.",
    },
  },
];

const emailValue = ref("");
const sampleVue = `<TuxFormField
  label="Principal Investigator Email"
  layout="stacked"
  required
  help="Used strictly for project notification dispatches and access verification."
  hint="Institutional @tti.tamu.edu address preferred."
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
</TuxFormField>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · forms & controls" title="TuxFormField">
      The canonical form-field wrapper: consistently arranges label, required indicator,
      info-popover help, input slot with automatic a11y attributes, hint text, and inline validation errors.
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-form-field"
        component-name="TuxFormField"
        title="TuxFormField Workbench"
        eyebrow="Interactive Component Playground"
        :controls="formFieldControls"
        :presets="formFieldPresets"
        :source="tuxFormFieldSource"
        :code-template="(values) => {
          const layoutAttr = values.layout !== 'stacked' ? ` layout=\x22${values.layout}\x22` : '';
          const reqAttr = values.required ? ' required' : '';
          const hintAttr = values.hint ? ` hint=\x22${values.hint}\x22` : '';
          const helpAttr = values.help ? ` help=\x22${values.help}\x22` : '';
          const errAttr = values.error ? ` error=\x22${values.error}\x22` : '';
          return `<TuxFormField\n  label=\x22${values.label}\x22${layoutAttr}${reqAttr}${hintAttr}${helpAttr}${errAttr}\n>\n  <template #default=\x22{ inputId, ariaDescribedby, ariaInvalid, ariaRequired }\x22>\n    <UInput\n      :id=\x22inputId\x22\n      type=\x22text\x22\n      :aria-describedby=\x22ariaDescribedby\x22\n      :aria-invalid=\x22ariaInvalid\x22\n      :aria-required=\x22ariaRequired\x22\n    />\n  </template>\n</TuxFormField>`;
        }"
      >
        <template #default="{ values }">
          <div class="max-w-xl w-full">
            <TuxFormField
              :label="values.label"
              :layout="values.layout"
              :required="values.required"
              :hint="values.hint || undefined"
              :help="values.help || undefined"
              :error="values.error || undefined"
            >
              <template #default="{ inputId, ariaDescribedby, ariaInvalid, ariaRequired }">
                <UInput
                  :id="inputId"
                  v-model="emailValue"
                  type="text"
                  placeholder="Enter value..."
                  :aria-describedby="ariaDescribedby"
                  :aria-invalid="ariaInvalid"
                  :aria-required="ariaRequired"
                />
              </template>
            </TuxFormField>
          </div>
        </template>
      </TuxPlayground>
    </section>

    <!-- Code Snippet -->
    <section class="space-y-3">
      <p class="eyebrow">usage syntax</p>
      <h2 class="heading--bold text-xl font-bold">Standard Form Field Cluster</h2>
      <TuxExample class="mt-4" :vue="sampleVue" :source="tuxFormFieldSource">
        <div class="max-w-xl">
          <TuxFormField
            label="Principal Investigator Email"
            required
            hint="Institutional @tti.tamu.edu address preferred."
            help="Used strictly for project notification dispatches and access verification."
          >
            <template #default="{ inputId, ariaDescribedby, ariaInvalid, ariaRequired }">
              <UInput
                :id="inputId"
                type="email"
                placeholder="researcher@tti.tamu.edu"
                :aria-describedby="ariaDescribedby"
                :aria-invalid="ariaInvalid"
                :aria-required="ariaRequired"
              />
            </template>
          </TuxFormField>
        </div>
      </TuxExample>
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
