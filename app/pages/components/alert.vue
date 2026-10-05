<script setup lang="ts">
// Vite's `?raw` query: the SFC file contents land here as a plain string,
// no duplication. That powers the `Source` tab on the gallery example below.
import tuxAlertSource from "~/components/TuxAlert.vue?raw";

useHead({ title: "TuxAlert · TUX" });

const variants = [
  "note",
  "tip",
  "info",
  "important",
  "success",
  "warning",
  "danger",
  "compliance",
] as const;

const galleryVue = `<!-- renders all 8 variants with the same props shape -->
<tux-alert
  v-for="v in variants"
  :key="v"
  :variant="v"
  :title="v"
  :description="\`This is a \${v} admonition.\`"
/>`;

const compactVue = `<tux-alert
  variant="tip"
  title="Use \`heading--bold\` for section titles, not page chrome."
/>`;

const iconVue = `<tux-alert
  variant="info"
  icon="lucide:database"
  title="Saved to server"
  description="Pass any Lucide icon name via \`icon\` to override the variant default."
/>`;

import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

const alertControls: TuxPropControl[] = [
  {
    prop: "title",
    label: "Alert Title",
    type: "text",
    defaultValue: "Corridor Telemetry Advisory",
  },
  {
    prop: "description",
    label: "Description",
    type: "text",
    defaultValue: "Average vehicular throughput on I-35 southbound increased by 14.2% following adaptive signal retiming.",
  },
  {
    prop: "variant",
    label: "Variant",
    type: "select",
    options: ["tip", "note", "info", "important", "success", "warning", "danger", "compliance"],
    defaultValue: "tip",
  },
  {
    prop: "icon",
    label: "Custom Icon",
    type: "select",
    options: ["", "lucide:bell", "lucide:shield-alert", "lucide:info", "lucide:database", "lucide:sparkles"],
    defaultValue: "",
  },
  {
    prop: "close",
    label: "Closeable Dismiss Action",
    type: "boolean",
    defaultValue: false,
  },
];

const alertPresets: TuxPlaygroundPreset[] = [
  {
    name: "compliance",
    label: "Compliance Mandate",
    description: "Solid Maroon callout for legal or export control governance",
    icon: "lucide:shield-alert",
    values: {
      variant: "compliance",
      title: "ITAR Regulated Research Asset",
      description: "Access to this telemetry pipeline requires TTI institutional authentication.",
      icon: "lucide:shield-alert",
      close: false,
    },
  },
  {
    name: "warning",
    label: "Operational Warning",
    description: "High-contrast warning banner for active field interruptions",
    icon: "lucide:triangle-alert",
    values: {
      variant: "warning",
      title: "Variable Speed Limit Advisory",
      description: "Severe weather detected along SH-130 corridor. Advisory speed reduced to 55 MPH.",
      icon: "",
      close: false,
    },
  },
  {
    name: "important",
    label: "Institutional Policy",
    description: "Subtle maroon border for formal reporting advisories",
    icon: "lucide:bookmark",
    values: {
      variant: "important",
      title: "Annual Safety Review Submissions",
      description: "All corridor crash telemetry datasets must be certified before fiscal closeout.",
      icon: "",
      close: false,
    },
  },
  {
    name: "tip",
    label: "Research Guidance",
    description: "Soft violet accent for best practice suggestions",
    icon: "lucide:lightbulb",
    values: {
      variant: "tip",
      title: "Vectorized Query Recommendation",
      description: "Use DuckDB or Parquet partition filters for multi-gigabyte loop detector tables.",
      icon: "",
      close: true,
    },
  },
];
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxAlert">
      Wraps <code>UAlert</code>. Adds a 4px left border in the admonition's
      own color family — Docusaurus-style rhythm that Nuxt UI's <code>subtle</code>
      variant omits by default. <code>important</code> and <code>compliance</code>
      both lean on brand maroon but at different visual weights (subtle vs. solid).
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-alert"
        component-name="TuxAlert"
        title="TuxAlert Workbench"
        eyebrow="Interactive Component Playground"
        :controls="alertControls"
        :presets="alertPresets"
        :source="tuxAlertSource"
        :self-closing="true"
      >
        <template #default="{ values }">
          <div class="max-w-2xl w-full">
            <TuxAlert
              :variant="values.variant"
              :title="values.title"
              :description="values.description"
              :icon="values.icon || undefined"
              :close="values.close"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">all variants</p>
      <h2 class="heading--bold text-xl font-bold">Gallery</h2>
      <TuxExample
        class="mt-4"
        title="All 8 variants"
        :vue="galleryVue"
        :source="tuxAlertSource"
      >
        <div class="space-y-3">
          <TuxAlert
            v-for="v in variants"
            :key="v"
            :variant="v"
            :title="v.charAt(0).toUpperCase() + v.slice(1)"
            :description="`This is a ${v} admonition. Left bar picks up the variant's color family.`"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">title only</p>
      <h2 class="heading--bold text-xl font-bold">Compact form</h2>
      <p class="text-sm text-text-secondary mb-4">
        Omit <code>description</code> for a single-line admonition — good for
        inline heads-up messages in table cells or form fields.
      </p>
      <TuxExample :vue="compactVue" :source="tuxAlertSource">
        <TuxAlert variant="tip" title="Use `heading--bold` for section titles, not page chrome." />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">custom icon</p>
      <h2 class="heading--bold text-xl font-bold">Override icon</h2>
      <TuxExample :vue="iconVue" :source="tuxAlertSource">
        <TuxAlert
          variant="info"
          icon="lucide:database"
          title="Saved to server"
          description="Pass any Lucide icon name via `icon` to override the variant default."
        />
      </TuxExample>
    </section>
  </div>
</template>
