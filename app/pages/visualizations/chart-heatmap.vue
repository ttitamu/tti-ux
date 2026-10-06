<script setup lang="ts">
import tuxChartHeatmapSource from "~/components/TuxChartHeatmap.vue?raw";
import {
  heatmapDays,
  heatmapHours,
  crashMatrix,
  corridorNames,
  monthNames,
  ttiMatrix,
} from "./chart-heatmap.demo-data";

useHead({ title: "TuxChartHeatmap · TUX" });

const datasetMap = {
  crashes: {
    rows: heatmapDays,
    cols: heatmapHours,
    values: crashMatrix,
    labelRows: "days",
    labelCols: "hours",
    labelVals: "crashMatrix",
    units: "crashes",
    format: undefined,
  },
  tti: {
    rows: corridorNames,
    cols: monthNames,
    values: ttiMatrix,
    labelRows: "corridors",
    labelCols: "months",
    labelVals: "ttiMatrix",
    units: "TTI",
    format: (n: number) => n.toFixed(2),
  },
};

const heatmapControls = [
  {
    prop: "dataset",
    label: "Telemetry Matrix",
    type: "select" as const,
    options: [
      { label: "Crash Counts by Day × Hour (7 × 24 matrix)", value: "crashes" },
      { label: "Travel Time Index by Corridor × Month (4 × 12 matrix)", value: "tti" },
    ],
    defaultValue: "crashes",
    description: "Transportation time-of-day or corridor demand matrix",
  },
  {
    prop: "ramp",
    label: "Sequential Ramp",
    type: "select" as const,
    options: [
      { label: "Maroon Sequential (Brand Anchor)", value: "maroon" },
      { label: "Slate Sequential (Neutral Secondary)", value: "slate" },
    ],
    defaultValue: "maroon",
    description: "Color ramp matching TUX geographic map ramps",
  },
  {
    prop: "bins",
    label: "Quantization Bins",
    type: "select" as const,
    options: [
      { label: "3 Interval Bins", value: 3 },
      { label: "4 Interval Bins", value: 4 },
      { label: "5 Interval Bins", value: 5 },
    ],
    defaultValue: 5,
    description: "Equal-interval bin quantization count",
  },
  {
    prop: "valueLabels",
    label: "Cell Text Labels",
    type: "boolean" as const,
    defaultValue: false,
    description: "Print numeric values directly inside matrix cells (best on small matrices)",
  },
];

const heatmapPresets = [
  {
    name: "crash-peak-hours",
    label: "Crash Hotspots (Day × Hour)",
    description: "High-density commute matrix with 5-quantile maroon ramp",
    icon: "lucide:grid",
    values: {
      dataset: "crashes",
      ramp: "maroon",
      bins: 5,
      valueLabels: false,
    },
  },
  {
    name: "corridor-tti-monthly",
    label: "Monthly Corridor Congestion (TTI)",
    description: "Labeled 4-bin matrix with slate ramp and formatted numbers",
    icon: "lucide:table",
    values: {
      dataset: "tti",
      ramp: "slate",
      bins: 4,
      valueLabels: true,
    },
  },
];

const flagshipVue = `<tux-chart-heatmap
  :rows="days"
  :cols="hours"
  :values="crashMatrix"
  units="crashes"
/>`;

const slateVue = `<tux-chart-heatmap
  :rows="corridors"
  :cols="months"
  :values="ttiMatrix"
  ramp="slate"
  :bins="4"
  value-labels
  :height="220"
  :format="(n) => n.toFixed(2)"
  :decimals="2"
  units="TTI"
/>`;

const printVue = `<tux-chart-heatmap
  :rows="days"
  :cols="hours"
  :values="crashMatrix"
  :tooltip="false"
  :legend="false"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="visualization · native chart" title="TuxChartHeatmap">
      Matrix heatmap — one cell per row × column pair, intensity on
      the same 5-stop sequential ramps the choropleth family uses.
      The workhorse for time-of-day patterns: crash counts by day ×
      hour, corridor demand by month, sensor uptime by station ×
      week. Cells quantize into equal-interval bins and the legend
      prints the ranges, so color is never the only encoder.
    </TuxPageHeader>

    <!-- Interactive Props & Telemetry Workbench -->
    <section>
      <TuxPlayground
        tag="tux-chart-heatmap"
        component-name="TuxChartHeatmap"
        title="Heatmap Matrix & Telemetry Workbench"
        eyebrow="Interactive Telemetry Lab"
        :controls="heatmapControls"
        :presets="heatmapPresets"
        :source="tuxChartHeatmapSource"
        :code-template="(values) => {
          const ds = datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.crashes;
          const rampAttr = values.ramp !== 'maroon' ? `\n  ramp=\x22${values.ramp}\x22` : '';
          const binAttr = values.bins !== 5 ? `\n  :bins=\x22${values.bins}\x22` : '';
          const labelAttr = values.valueLabels ? '\n  value-labels' : '';
          return `<tux-chart-heatmap\n  :rows=\x22${ds.labelRows}\x22\n  :cols=\x22${ds.labelCols}\x22\n  :values=\x22${ds.labelVals}\x22${rampAttr}${binAttr}${labelAttr}\n  units=\x22${ds.units}\x22\n/>`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full max-w-3xl">
            <TuxChartHeatmap
              :rows="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.crashes).rows"
              :cols="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.crashes).cols"
              :values="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.crashes).values"
              :ramp="values.ramp"
              :bins="Number(values.bins) as 3 | 4 | 5"
              :value-labels="values.valueLabels"
              :units="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.crashes).units"
              :format="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.crashes).format"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">flagship · day × hour</p>
      <h2 class="heading--bold text-xl font-bold">Crashes by day of week and hour</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        The classic safety-analysis matrix: weekday AM/PM commute
        peaks in deep maroon, the weekend late-night shelf visible on
        Saturday and Sunday. Hover a cell — or Tab in and walk the
        grid with arrow keys.
      </p>
      <TuxExample class="mt-4" :vue="flagshipVue" :source="tuxChartHeatmapSource">
        <TuxChartHeatmap
          :rows="heatmapDays"
          :cols="heatmapHours"
          :values="crashMatrix"
          units="crashes"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">slate ramp + value labels</p>
      <h2 class="heading--bold text-xl font-bold">Travel Time Index by corridor and month</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        For smaller matrices (few columns), turn on <code>value-labels</code>
        to print the number directly in the cell. <code>ramp="slate"</code>
        provides the neutral secondary voice. Null cells (missing sensor data)
        draw as a hollow hatch pattern with "No data" tooltip.
      </p>
      <TuxExample class="mt-4" :vue="slateVue" :source="tuxChartHeatmapSource">
        <TuxChartHeatmap
          :rows="corridorNames"
          :cols="monthNames"
          :values="ttiMatrix"
          ramp="slate"
          :bins="4"
          value-labels
          :height="220"
          :format="(n) => n.toFixed(2)"
          :decimals="2"
          units="TTI"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">print variant · no chrome</p>
      <h2 class="heading--bold text-xl font-bold">Static / export layout</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>:tooltip="false"</code> and <code>:legend="false"</code>
        for embedded tiles in dense paper/PDF reports.
      </p>
      <TuxExample class="mt-4" :vue="printVue" :source="tuxChartHeatmapSource">
        <TuxChartHeatmap
          :rows="heatmapDays"
          :cols="heatmapHours"
          :values="crashMatrix"
          :tooltip="false"
          :legend="false"
        />
      </TuxExample>
    </section>
  </div>
</template>
