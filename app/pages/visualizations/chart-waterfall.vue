<script setup lang="ts">
import tuxChartWaterfallSource from "~/components/TuxChartWaterfall.vue?raw";

useHead({ title: "TuxChartWaterfall · TUX" });

const crashAttributionSteps = [
  { key: "base", label: "Baseline", value: 184, kind: "start" as const },
  { key: "vmt", label: "VMT Growth", value: 16, kind: "delta" as const },
  { key: "roundabout", label: "Roundabouts", value: -38, kind: "delta" as const },
  { key: "lighting", label: "LED Lighting", value: -22, kind: "delta" as const },
  { key: "lpi", label: "Ped Intervals", value: -18, kind: "delta" as const },
  { key: "median", label: "Raised Median", value: -26, kind: "delta" as const },
  { key: "net", label: "Observed", value: 0, kind: "total" as const },
];

const ridershipBridgeSteps = [
  { key: "fy25", label: "FY25 Base", value: 120, kind: "start" as const },
  { key: "headway", label: "10-Min BRT", value: 34, kind: "delta" as const },
  { key: "fare", label: "Fare Cap", value: 18, kind: "delta" as const },
  { key: "detour", label: "Bridge Work", value: -14, kind: "delta" as const },
  { key: "mid", label: "Q2 Subtotal", value: 0, kind: "subtotal" as const },
  { key: "feeder", label: "Microtransit", value: 22, kind: "delta" as const },
  { key: "fy26", label: "FY26 Total", value: 0, kind: "total" as const },
];

const delayWaterfallSteps = [
  { key: "before", label: "Pre-Deploy", value: 68, kind: "start" as const },
  { key: "demand", label: "Seasonal Peak", value: 9, kind: "delta" as const },
  { key: "tsp", label: "Transit Priority", value: -14, kind: "delta" as const },
  { key: "adaptive", label: "Adaptive Signals", value: -19, kind: "delta" as const },
  { key: "incident", label: "Clearance Ops", value: -11, kind: "delta" as const },
  { key: "after", label: "Post-Deploy", value: 0, kind: "total" as const },
];

const datasetMap = {
  crashes: {
    steps: crashAttributionSteps,
    codeSteps: "crashAttributionSteps",
    polarity: "invert" as const,
    units: "crashes/yr",
  },
  ridership: {
    steps: ridershipBridgeSteps,
    codeSteps: "ridershipBridgeSteps",
    polarity: "direct" as const,
    units: "k boardings",
  },
  delay: {
    steps: delayWaterfallSteps,
    codeSteps: "delayWaterfallSteps",
    polarity: "invert" as const,
    units: "sec/veh",
  },
};

const waterfallControls = [
  {
    prop: "dataset",
    label: "Attribution Dataset",
    type: "select" as const,
    options: [
      { label: "Corridor Crash-Reduction Attribution", value: "crashes" },
      { label: "BRT Ridership Growth Bridge", value: "ridership" },
      { label: "Arterial Control Delay Reduction", value: "delay" },
    ],
    defaultValue: "crashes",
    description: "Sequential baseline-to-total step attribution series",
  },
  {
    prop: "polarity",
    label: "Delta Polarity",
    type: "select" as const,
    options: [
      { label: "Invert (Negative = Improvement)", value: "invert" },
      { label: "Direct (Positive = Improvement)", value: "direct" },
    ],
    defaultValue: "invert",
    description: "Semantic coloring direction for positive vs negative deltas",
  },
  {
    prop: "gridlines",
    label: "Show Gridlines",
    type: "boolean" as const,
    defaultValue: true,
    description: "Render horizontal y-axis reference gridlines",
  },
  {
    prop: "tooltip",
    label: "Interactive Tooltip",
    type: "boolean" as const,
    defaultValue: true,
    description: "Enable pointer & keyboard roving-cursor bridge tooltip",
  },
];

const waterfallPresets = [
  {
    name: "crash-countermeasures",
    label: "Crash-Reduction Attribution",
    description: "Inverted polarity waterfall attributing safety countermeasure reductions",
    icon: "lucide:shield-check",
    values: {
      dataset: "crashes",
      polarity: "invert",
      gridlines: true,
      tooltip: true,
    },
  },
  {
    name: "ridership-growth",
    label: "Transit Ridership Bridge",
    description: "Direct polarity bridge with intermediate Q2 subtotal pillar",
    icon: "lucide:trending-up",
    values: {
      dataset: "ridership",
      polarity: "direct",
      gridlines: true,
      tooltip: true,
    },
  },
  {
    name: "signal-delay",
    label: "Signal Delay Reduction",
    description: "Pre- vs post-deployment intersection delay bridge in sec/veh",
    icon: "lucide:timer",
    values: {
      dataset: "delay",
      polarity: "invert",
      gridlines: true,
      tooltip: true,
    },
  },
];

const crashVue = `<tux-chart-frame
  eyebrow="Exhibit 15.01"
  title="Corridor safety countermeasure crash attribution"
  source="Source: Highway Safety Improvement Evaluation · 2026"
>
  <tux-chart-waterfall
    :steps="crashAttributionSteps"
    polarity="invert"
    units="crashes/yr"
  />
</tux-chart-frame>`;

const ridershipVue = `<tux-chart-waterfall
  :steps="ridershipBridgeSteps"
  polarity="direct"
  units="k boardings"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="data viz · attribution & bridge" title="TuxChartWaterfall">
      Native SVG cumulative step-delta bridge chart. Connects an initial
      <code>start</code> baseline across signed <code>delta</code>
      interventions, optional <code>subtotal</code> checkpoints, and a
      reconciled <code>total</code> pillar via dashed bridge lines.
      <br><br>
      <span class="text-sm text-text-muted">
        Pass <code>polarity="invert"</code> for crash frequency, travel
        time delay, emissions, or cost waterfalls where negative deltas
        represent favorable outcomes. Every delta carries an explicit
        <code>+</code> / <code>-</code> prefix so direction is never
        conveyed by color alone.
      </span>
    </TuxPageHeader>

    <section>
      <TuxPlayground
        tag="tux-chart-waterfall"
        component-name="TuxChartWaterfall"
        title="Cumulative Step-Delta Attribution Workbench"
        eyebrow="Interactive Telemetry Lab"
        :controls="waterfallControls"
        :presets="waterfallPresets"
        :source="tuxChartWaterfallSource"
        :code-template="(values) => {
          const ds = datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.crashes;
          const polAttr = values.polarity !== 'direct' ? `\n  polarity=\x22${values.polarity}\x22` : '';
          const gridAttr = !values.gridlines ? '\n  :gridlines=\x22false\x22' : '';
          const tipAttr = !values.tooltip ? '\n  :tooltip=\x22false\x22' : '';
          return `<tux-chart-waterfall\n  :steps=\x22${ds.codeSteps}\x22${polAttr}\n  units=\x22${ds.units}\x22${gridAttr}${tipAttr}\n/>`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full max-w-3xl">
            <TuxChartWaterfall
              :steps="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.crashes).steps"
              :units="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.crashes).units"
              :polarity="values.polarity"
              :gridlines="values.gridlines"
              :tooltip="values.tooltip"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">flagship · inverted polarity safety attribution</p>
      <h2 class="heading--bold text-xl font-bold">Crash-Reduction Countermeasure Bridge</h2>
      <p class="mt-2 text-text-secondary leading-relaxed max-w-2xl">
        When evaluating roadway safety treatments, exposure growth
        (<code>+16</code>) increases expected crashes while engineering
        countermeasures step the running total downward to the observed
        post-treatment count (<code>96 crashes/yr</code>). Setting
        <code>polarity="invert"</code> colors reductions as favorable
        improvements.
      </p>
      <TuxExample class="mt-4" :vue="crashVue" :source="tuxChartWaterfallSource">
        <TuxChartFrame
          eyebrow="Exhibit 15.01"
          title="Corridor safety countermeasure crash attribution"
          source="Source: Highway Safety Improvement Evaluation · 2026"
        >
          <TuxChartWaterfall
            :steps="crashAttributionSteps"
            polarity="invert"
            units="crashes/yr"
          />
        </TuxChartFrame>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">direct polarity · intermediate subtotal</p>
      <h2 class="heading--bold text-xl font-bold">BRT Ridership Bridge with Subtotal Checkpoint</h2>
      <p class="mt-2 text-text-secondary leading-relaxed max-w-2xl">
        Include a <code>kind: "subtotal"</code> step mid-sequence to
        re-anchor an interim checkpoint to zero before continuing with
        subsequent expansion phases.
      </p>
      <TuxExample class="mt-4" :vue="ridershipVue">
        <TuxChartWaterfall
          :steps="ridershipBridgeSteps"
          polarity="direct"
          units="k boardings"
        />
      </TuxExample>
    </section>
  </div>
</template>
