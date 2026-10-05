<script setup lang="ts">
import tuxBigStatSource from "~/components/TuxBigStat.vue?raw";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxBigStat · TUX" });

const exampleVue = `<TuxBigStat
  value="$126"
  suffix="M"
  label="Annual research expenditure"
  source="FY 2025 sponsored research report"
/>`;

const sizesVue = `<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
  <TuxBigStat size="lg" :value="412" suffix=" mi" label="Instrumented freight corridor" />
  <TuxBigStat size="md" :value="650" suffix="+" label="Active research projects" />
  <TuxBigStat size="sm" :value="23" label="States with TTI deployments" />
</div>`;

const tonesVue = `<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
  <TuxBigStat tone="maroon" :value="93.4" suffix="%" label="Classifier precision (CLS-204)" />
  <TuxBigStat tone="gold" :value="60" suffix=" yrs" label="Of transportation research" />
  <TuxBigStat tone="neutral" :value="1.4" suffix="K" label="Researchers + grad assistants" />
</div>`;

const variantsVue = `<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
  <TuxBigStat variant="default" :value="2.1" suffix="M" label="Vehicles per day · monitored corridors" />
  <TuxBigStat variant="bold" :value="84" suffix="%" label="Reduction in roadway-departure crashes" />
  <TuxBigStat variant="elegant" :value="37" suffix="%" label="Stop-line non-compliance reduction" />
</div>`;

const bigStatControls: TuxPropControl[] = [
  {
    prop: "value",
    label: "Metric Value",
    type: "text",
    defaultValue: "94.2",
  },
  {
    prop: "suffix",
    label: "Value Suffix",
    type: "text",
    defaultValue: "%",
  },
  {
    prop: "prefix",
    label: "Value Prefix",
    type: "text",
    defaultValue: "",
  },
  {
    prop: "label",
    label: "Descriptor Label",
    type: "text",
    defaultValue: "Corridor Travel-Time Reliability",
  },
  {
    prop: "size",
    label: "Size Tier",
    type: "select",
    options: ["sm", "md", "lg"],
    defaultValue: "md",
  },
  {
    prop: "tone",
    label: "Brand Tone",
    type: "select",
    options: ["maroon", "gold", "neutral"],
    defaultValue: "maroon",
  },
  {
    prop: "source",
    label: "Attribution Source",
    type: "text",
    defaultValue: "TTI Mobility Division Sensor Telemetry",
  },
];

const bigStatPresets: TuxPlaygroundPreset[] = [
  {
    name: "reliability",
    label: "Reliability Index",
    description: "Standard percentage metric with maroon brand tone",
    icon: "lucide:percent",
    values: {
      value: "94.2",
      suffix: "%",
      prefix: "",
      label: "Corridor Travel-Time Reliability",
      size: "md",
      tone: "maroon",
      source: "TTI Mobility Division Sensor Telemetry",
    },
  },
  {
    name: "expenditure",
    label: "Research Expenditure",
    description: "Large currency stat for factsheets and annual reports",
    icon: "lucide:dollar-sign",
    values: {
      value: "126.4",
      suffix: "M",
      prefix: "$",
      label: "Annual Sponsored Research Expenditure",
      size: "lg",
      tone: "maroon",
      source: "Texas A&M Transportation Institute FY25 Annual Report",
    },
  },
  {
    name: "safety-impact",
    label: "Incident Reduction",
    description: "Warm gold accent stat highlighting safety outcomes",
    icon: "lucide:trending-down",
    values: {
      value: "-38.5",
      suffix: "%",
      prefix: "",
      label: "Peak Severe Incident Probability",
      size: "md",
      tone: "gold",
      source: "TxDOT Connected Work Zone Safety Evaluation",
    },
  },
  {
    name: "traffic-volume",
    label: "Hourly Vehicle Volume",
    description: "Compact telemetry count for operations dashboards",
    icon: "lucide:gauge",
    values: {
      value: "14,820",
      suffix: "vph",
      prefix: "",
      label: "Freeway Mainlane Traffic Throughput",
      size: "sm",
      tone: "neutral",
      source: "Live Austin District Radar Ingest",
    },
  },
];
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxBigStat">
      The institutional <strong>headline metric</strong>: one oversized
      number, one tracked-out label. Pulled directly from TTI's factsheets.
      Companion to <code>TuxFactoid</code> — use BigStat for a single hero
      metric, Factoid for a row of them.
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-big-stat"
        component-name="TuxBigStat"
        title="TuxBigStat Workbench"
        eyebrow="Interactive Component Playground"
        :controls="bigStatControls"
        :presets="bigStatPresets"
        :source="tuxBigStatSource"
        :self-closing="true"
      >
        <template #default="{ values }">
          <TuxBigStat
            :value="values.value"
            :suffix="values.suffix || undefined"
            :prefix="values.prefix || undefined"
            :label="values.label"
            :size="values.size"
            :tone="values.tone"
            :source="values.source || undefined"
          />
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Default · medium · maroon</h2>
      <TuxExample class="mt-4" :vue="exampleVue" :source="tuxBigStatSource">
        <TuxBigStat
          :value="126"
          suffix="M"
          label="Annual research expenditure"
          source="FY 2025 sponsored research report"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">size tiers</p>
      <h2 class="heading--bold text-xl font-bold">Three sizes — lg / md / sm</h2>
      <p class="text-sm text-text-secondary mb-3">
        <code>lg</code> = 144px landing hero,
        <code>md</code> = 96px dashboard hero (default),
        <code>sm</code> = 64px in-card metric.
      </p>
      <TuxExample class="mt-4" :vue="sizesVue" :source="tuxBigStatSource">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TuxBigStat size="lg" :value="412" suffix=" mi" label="Instrumented freight corridor" />
          <TuxBigStat size="md" :value="650" suffix="+" label="Active research projects" />
          <TuxBigStat size="sm" :value="23"          label="States with TTI deployments" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">tones</p>
      <h2 class="heading--bold text-xl font-bold">Maroon / gold / neutral</h2>
      <p class="text-sm text-text-secondary mb-3">
        Maroon is canonical. Gold for emphasis on landing surfaces. Neutral
        for supporting metrics that shouldn't compete with brand stats.
      </p>
      <TuxExample class="mt-4" :vue="tonesVue" :source="tuxBigStatSource">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TuxBigStat tone="maroon"  :value="93.4" suffix="%" label="Classifier precision (CLS-204)" />
          <TuxBigStat tone="gold"    :value="60"   suffix=" yrs" label="Of transportation research" />
          <TuxBigStat tone="neutral" :value="1.4"  suffix="K" label="Researchers + grad assistants" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">style variants</p>
      <h2 class="heading--bold text-xl font-bold">Per-variant numeral face</h2>
      <p class="text-sm text-text-secondary mb-3">
        Numeral switches per <code>variant</code>: Open Sans 700 (default),
        Work Sans 800 italic (bold), Georgia italic (elegant). The label
        stays Open Sans throughout — the eyebrow rhythm is constant.
      </p>
      <TuxExample class="mt-4" :vue="variantsVue" :source="tuxBigStatSource">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TuxBigStat variant="default" :value="2.1" suffix="M" label="Vehicles per day · monitored corridors" />
          <TuxBigStat variant="bold"    :value="84"  suffix="%" label="Reduction in roadway-departure crashes" />
          <TuxBigStat variant="elegant" :value="37"  suffix="%" label="Stop-line non-compliance reduction" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props reference</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>value</code> — string or number. Required.</li>
        <li><code>label</code> — tracked-out label below. Required.</li>
        <li><code>suffix</code> — trailing unit (<code>%</code>, <code>M</code>, <code> mi</code>). Optional.</li>
        <li><code>source</code> — italic attribution line. Optional.</li>
        <li><code>variant</code> — <code>"default" | "bold" | "elegant"</code>. Defaults to <code>"default"</code>.</li>
        <li><code>tone</code> — <code>"maroon" | "gold" | "neutral"</code>. Defaults to <code>"maroon"</code>.</li>
        <li><code>size</code> — <code>"lg" | "md" | "sm"</code>. Defaults to <code>"md"</code>.</li>
      </ul>
    </section>
  </div>
</template>
