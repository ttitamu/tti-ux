<script setup lang="ts">
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxSectionHeader · TUX" });

const sectionHeaderControls: TuxPropControl[] = [
  {
    prop: "title",
    label: "Section Title",
    type: "text",
    defaultValue: "Active Research Programs",
  },
  {
    prop: "subtitle",
    label: "Subtitle / Description",
    type: "text",
    defaultValue: "Multimodal freight & automated vehicle safety initiatives across Texas corridors",
  },
  {
    prop: "kicker",
    label: "Kicker / Eyebrow",
    type: "text",
    defaultValue: "Division 04 // Mobility Analysis",
  },
  {
    prop: "variant",
    label: "Header Variant",
    type: "select",
    options: ["institutional", "rule-full", "classic", "minimal"],
    defaultValue: "institutional",
  },
  {
    prop: "level",
    label: "Heading Level",
    type: "select",
    options: [1, 2, 3, 4],
    defaultValue: 2,
  },
];

const sectionHeaderPresets: TuxPlaygroundPreset[] = [
  {
    name: "institutional",
    label: "Institutional Maroon & Gold",
    description: "Signature TTI heading: Maroon title with 3px Warm Gold underline keyline",
    icon: "lucide:bookmark",
    values: {
      title: "Active Research Programs",
      subtitle: "Multimodal freight & automated vehicle safety initiatives across Texas corridors",
      kicker: "Division 04 // Mobility Analysis",
      variant: "institutional",
      level: 2,
    },
  },
  {
    name: "rule-full",
    label: "Full Width Keyline Hero",
    description: "Expanded section divider spanning the full container width with Warm Gold keyline",
    icon: "lucide:minus",
    values: {
      title: "Connected Transportation Infrastructure",
      subtitle: "Statewide V2X roadside unit telemetry and crash mitigation testbeds",
      kicker: "Strategic Priority",
      variant: "rule-full",
      level: 1,
    },
  },
  {
    name: "classic",
    label: "Classic Tracked Maroon",
    description: "Historical TUX tracked heading with maroon underline",
    icon: "lucide:type",
    values: {
      title: "Telemetry Ingest Pipelines",
      subtitle: "",
      kicker: "",
      variant: "classic",
      level: 2,
    },
  },
  {
    name: "minimal",
    label: "Minimal Boundary Divider",
    description: "Clean border-bottom divider for dense analytical layouts",
    icon: "lucide:layout-list",
    values: {
      title: "Sensor Diagnostics",
      subtitle: "Real-time battery and solar telemetry across detector network",
      kicker: "Subsystem Telemetry",
      variant: "minimal",
      level: 3,
    },
  },
];

const level1Vue = `<tux-section-header :level="1" subtitle="Level 1 — the biggest">
  Research grants overview
</tux-section-header>`;

const level2Vue = `<tux-section-header :level="2" subtitle="Level 2 — default">
  Classification tiers
</tux-section-header>`;

const level3Vue = `<tux-section-header :level="3">Tag namespaces</tux-section-header>`;

const subtitleVue = `<tux-section-header :level="2" subtitle="4,218 documents across 17 indices">
  Index catalog
</tux-section-header>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxSectionHeader">
      The signature TTI editorial section header — ALL-CAPS Maroon title paired with a Warm Gold
      accent keyline rule. Reflects the institutional header rhythm found across <code>tti.tamu.edu</code>.
      Distinct from <code>heading--bold</code> and generic dividers, providing clear visual hierarchy across long documents.
    </TuxPageHeader>

    <!-- Interactive Component Playground with Presets & Deep-Linking -->
    <section>
      <TuxPlayground
        tag="tux-section-header"
        component-name="TuxSectionHeader"
        title="TuxSectionHeader Workbench"
        eyebrow="Interactive Component Playground"
        :controls="sectionHeaderControls"
        :presets="sectionHeaderPresets"
      >
        <template #default="{ values }">
          <div class="p-6 bg-surface-raised rounded-xl border border-surface-border w-full">
            <TuxSectionHeader
              :title="values.title"
              :subtitle="values.subtitle || undefined"
              :kicker="values.kicker || undefined"
              :variant="values.variant"
              :level="Number(values.level) as any"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">level 1</p>
      <h2 class="heading--bold text-xl font-bold">Biggest section heading</h2>
      <TuxExample class="mt-4" :vue="level1Vue">
        <TuxSectionHeader :level="1" subtitle="Level 1 — the biggest">
          Research grants overview
        </TuxSectionHeader>
      </TuxExample>
      <p class="mt-3 text-sm text-text-secondary">
        <code>level="1"</code> renders as <code>&lt;h1&gt;</code> with
        <code>text-2xl md:text-3xl</code>. Use for primary division headers.
      </p>
    </section>

    <section>
      <p class="eyebrow">level 2 (default)</p>
      <h2 class="heading--bold text-xl font-bold">Default section heading</h2>
      <TuxExample class="mt-4" :vue="level2Vue">
        <TuxSectionHeader :level="2" subtitle="Level 2 — default">
          Classification tiers
        </TuxSectionHeader>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">level 3</p>
      <h2 class="heading--bold text-xl font-bold">Smallest variant</h2>
      <TuxExample class="mt-4" :vue="level3Vue">
        <TuxSectionHeader :level="3">Tag namespaces</TuxSectionHeader>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">with subtitle</p>
      <h2 class="heading--bold text-xl font-bold">Metadata below the bar</h2>
      <TuxExample class="mt-4" :vue="subtitleVue">
        <TuxSectionHeader :level="2" subtitle="4,218 documents across 17 indices">
          Index catalog
        </TuxSectionHeader>
      </TuxExample>
      <p class="mt-3 text-sm text-text-secondary">
        <code>subtitle</code> renders as secondary text beneath the heading
        — ideal for counts, timestamps, or "last verified" metadata.
      </p>
    </section>
  </div>
</template>
