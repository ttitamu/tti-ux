<script setup lang="ts">
import tuxRecordHighlightsSource from "~/components/TuxRecordHighlights.vue?raw";

useHead({ title: "TuxRecordHighlights · TUX" });

const items = [
  { label: "Active Sensors", value: "248", change: "+14%", changeTone: "positive" },
  { label: "Stream Latency", value: "18ms", change: "-2ms", changeTone: "positive" },
  { label: "Review Cadence", value: "90 Days" },
  { label: "Data Quality", value: "99.4%" },
  { label: "Ingest Rate", value: "52 kHz" },
  { label: "Lead Investigator", value: "Dr. K. Higgins" },
];

const exampleVue = `<TuxRecordHighlights
  title="I-35 Connected Corridors Initiative"
  eyebrow="Research Program // CAV-04"
  icon="lucide:radio-tower"
  :items="items"
>
  <template #badge>
    <TuxBadge tone="success" dot>STREAM ACTIVE</TuxBadge>
  </template>
  <template #actions>
    <TuxButton intent="ghost" size="sm" icon="lucide:share-2">Share</TuxButton>
    <TuxButton intent="primary" size="sm" icon="lucide:sliders">Configure Corridor</TuxButton>
  </template>
</TuxRecordHighlights>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxRecordHighlights">
      Pinned entity summary bar inspired by Salesforce SLDS 2 Record Highlights Panel and
      Shopify Polaris Page Headers. Grounds the top of detail records, research corridors,
      and data monitoring views with title, status badge, and key operational KPI metric chips.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">transportation entity view</p>
      <h2 class="heading--bold text-xl font-bold">Research Corridor Highlights</h2>
      <p class="text-sm text-text-secondary mb-3">
        Combines entity classification, title, live status badge, primary action buttons, and a 6-metric KPI strip.
      </p>
      <TuxExample :vue="exampleVue" :source="tuxRecordHighlightsSource">
        <TuxRecordHighlights
          title="I-35 Connected Corridors Initiative"
          eyebrow="Research Program // CAV-04"
          icon="lucide:radio-tower"
          :items="items"
        >
          <template #badge>
            <TuxBadge tone="success" dot>STREAM ACTIVE</TuxBadge>
          </template>
          <template #actions>
            <TuxButton intent="ghost" size="sm" icon="lucide:share-2">Share</TuxButton>
            <TuxButton intent="primary" size="sm" icon="lucide:sliders">Configure Corridor</TuxButton>
          </template>
        </TuxRecordHighlights>
      </TuxExample>
    </section>
  </div>
</template>
