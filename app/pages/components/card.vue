<script setup lang="ts">
import tuxCardSource from "~/components/TuxCard.vue?raw";

useHead({ title: "TuxCard · TUX" });

const staticVue = `<tux-card>
  <p class="eyebrow">project · 2026-04-22</p>
  <h3 class="text-xl font-bold">Corridor safety review</h3>
  <p class="mt-2 text-sm text-text-secondary">
    Static card — no hover motion. Use for summary blocks inside a page.
  </p>
</tux-card>`;

const linkedVue = `<tux-card to="/tokens">
  <p class="eyebrow">foundations</p>
  <h3 class="text-xl font-bold">Browse tokens</h3>
  <p class="mt-2 text-sm text-text-secondary">
    Every CSS variable the system exposes.
  </p>
</tux-card>`;

import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

const cardControls: TuxPropControl[] = [
  {
    prop: "eyebrow",
    label: "Eyebrow",
    type: "text",
    defaultValue: "research project · 2026",
  },
  {
    prop: "title",
    label: "Card Title",
    type: "text",
    defaultValue: "Corridor Safety & Congestion Review",
  },
  {
    prop: "body",
    label: "Body Description",
    type: "text",
    defaultValue: "Multimodal analysis of automated safety interventions and incident response along the I-35 corridor.",
  },
  {
    prop: "to",
    label: "Link Destination (`to`)",
    type: "text",
    defaultValue: "/tokens",
  },
  {
    prop: "padded",
    label: "Padded Inner Surface",
    type: "boolean",
    defaultValue: true,
  },
];

const cardPresets: TuxPlaygroundPreset[] = [
  {
    name: "linked-corridor",
    label: "Linked Research Program",
    description: "Interactive card with hover choreography and arrow affordance",
    icon: "lucide:arrow-up-right",
    values: {
      eyebrow: "corridor intelligence · fy26",
      title: "Connected Freight Infrastructure",
      body: "Edge-computed vehicle-to-infrastructure telemetry deployed along the Texas Triangle.",
      to: "/examples/corridor-analytics",
      padded: true,
    },
  },
  {
    name: "static-summary",
    label: "Static Factsheet Card",
    description: "Branded rectangular surface without interactive link hover",
    icon: "lucide:file-text",
    values: {
      eyebrow: "institutional milestone",
      title: "Highway Safety Performance Audit",
      body: "Synthesized executive findings covering 10-year crash frequency and speed mitigation.",
      to: "",
      padded: true,
    },
  },
  {
    name: "flush-media",
    label: "Flush Media Container",
    description: "Edge-to-edge card for housing visualization embeds and plots",
    icon: "lucide:maximize",
    values: {
      eyebrow: "",
      title: "GIS Corridor Inset",
      body: "High-resolution geospatial detector map with real-time incident cluster overlays.",
      to: "/visualizations",
      padded: false,
    },
  },
];
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxCard">
      A static branded block, or pass <code>to</code> and it becomes a <code>NuxtLink</code>
      with corner-drop choreography — the card shifts +6/-6px on hover and an arrow
      fades in at the top-right. The 2px maroon border is load-bearing, so we don't
      wrap <code>UCard</code>.
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-card"
        component-name="TuxCard"
        title="TuxCard Workbench"
        eyebrow="Interactive Component Playground"
        :controls="cardControls"
        :presets="cardPresets"
        :source="tuxCardSource"
        :code-template="(values) => {
          const toAttr = values.to ? ` to=\x22${values.to}\x22` : '';
          const padAttr = values.padded === false ? ' :padded=\x22false\x22' : '';
          return `<tux-card${toAttr}${padAttr}>\n  <p class=\x22eyebrow\x22>${values.eyebrow}</p>\n  <h3 class=\x22text-xl font-bold\x22>${values.title}</h3>\n  <p class=\x22mt-2 text-sm text-text-secondary\x22>\n    ${values.body}\n  </p>\n</tux-card>`;
        }"
      >
        <template #default="{ values }">
          <div class="max-w-md w-full">
            <TuxCard :to="values.to || undefined" :padded="values.padded">
              <p v-if="values.eyebrow" class="eyebrow">{{ values.eyebrow }}</p>
              <h3 class="text-xl font-bold">{{ values.title }}</h3>
              <p v-if="values.body" class="mt-2 text-sm text-text-secondary">
                {{ values.body }}
              </p>
            </TuxCard>
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">static</p>
      <h2 class="heading--bold text-xl font-bold">Without `to`</h2>
      <TuxExample class="mt-4" :vue="staticVue" :source="tuxCardSource">
        <TuxCard>
          <p class="eyebrow">project · 2026-04-22</p>
          <h3 class="text-xl font-bold">Corridor safety review</h3>
          <p class="mt-2 text-sm text-text-secondary">
            Static card — no hover motion. Use for summary blocks inside a page.
          </p>
        </TuxCard>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">linked</p>
      <h2 class="heading--bold text-xl font-bold">With `to`</h2>
      <p class="text-sm text-text-secondary mb-3">
        Hover to see the corner-drop + arrow. The destination (/tokens) works —
        click to navigate back.
      </p>
      <TuxExample :vue="linkedVue" :source="tuxCardSource">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TuxCard to="/tokens">
            <p class="eyebrow">foundations</p>
            <h3 class="text-xl font-bold">Browse tokens</h3>
            <p class="mt-2 text-sm text-text-secondary">
              Every CSS variable the system exposes.
            </p>
          </TuxCard>
          <TuxCard to="/typography">
            <p class="eyebrow">foundations</p>
            <h3 class="text-xl font-bold">Typography</h3>
            <p class="mt-2 text-sm text-text-secondary">
              The heading utilities + scale in context.
            </p>
          </TuxCard>
        </div>
      </TuxExample>
    </section>
  </div>
</template>
