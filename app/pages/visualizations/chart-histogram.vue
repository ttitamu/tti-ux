<script setup lang="ts">
import pbiCartesian from "../../../kit/powerbi/pbir/fragments/tti/chart-cartesian.json?raw";
import tuxChartHistogramSource from "~/components/TuxChartHistogram.vue?raw";
import { travelTimes, controlDelays, speedReadings } from "./chart-histogram.demo-data";

useHead({ title: "TuxChartHistogram · TUX" });

const datasetMap = {
  travelTimes: {
    values: travelTimes,
    label: "travelTimes",
    xLabel: "Corridor travel time (min)",
    units: "trips",
  },
  controlDelays: {
    values: controlDelays,
    label: "controlDelays",
    xLabel: "Control delay (s)",
    units: "intersections",
  },
  speedReadings: {
    values: speedReadings,
    label: "speedReadings",
    xLabel: "Spot radar speed (mph)",
    units: "vehicles",
  },
};

const histogramControls = [
  {
    prop: "dataset",
    label: "Telemetry Dataset",
    type: "select" as const,
    options: [
      { label: "Corridor Travel Times (240 samples)", value: "travelTimes" },
      { label: "Intersection Control Delays (180 samples)", value: "controlDelays" },
      { label: "Freeway Radar Spot Speeds (260 samples)", value: "speedReadings" },
    ],
    defaultValue: "travelTimes",
    description: "Switch between live transportation telemetry sample distributions",
  },
  {
    prop: "binCount",
    label: "Target Bin Count",
    type: "number" as const,
    defaultValue: 12,
    description: "Target number of histogram bins (actual count snaps to nice 1/2/5 multiples)",
  },
  {
    prop: "percentileMode",
    label: "Percentile Markers",
    type: "select" as const,
    options: [
      { label: "p50 / p95 (Planning Time Index)", value: "50-95" },
      { label: "p50 / p85 (Speed Pacing 85th %ile)", value: "50-85" },
      { label: "p25 / p50 / p75 (Quartiles)", value: "25-50-75" },
      { label: "None", value: "none" },
    ],
    defaultValue: "50-95",
    description: "Institutional reliability and speed percentile markers",
  },
  {
    prop: "normalize",
    label: "Normalize to % Share",
    type: "boolean" as const,
    defaultValue: false,
    description: "Render y-axis as percentage share instead of raw sample counts",
  },
  {
    prop: "gridlines",
    label: "Gridlines",
    type: "boolean" as const,
    defaultValue: true,
    description: "Show horizontal background reference gridlines",
  },
];

const histogramPresets = [
  {
    name: "travel-time-reliability",
    label: "Travel Time Reliability (p50 / p95)",
    description: "FHWA/TxDOT planning time index pair marking free-flow vs incident tail",
    icon: "lucide:clock",
    values: {
      dataset: "travelTimes",
      binCount: 12,
      percentileMode: "50-95",
      normalize: false,
      gridlines: true,
    },
  },
  {
    name: "normalized-control-delay",
    label: "Signalized Intersection Delay",
    description: "Normalized percent share across intersection control delay observations",
    icon: "lucide:percent",
    values: {
      dataset: "controlDelays",
      binCount: 16,
      percentileMode: "50-95",
      normalize: true,
      gridlines: true,
    },
  },
  {
    name: "freeway-spot-speeds",
    label: "Freeway Radar Spot Speeds",
    description: "85th percentile speed study with radar speed detection telemetry",
    icon: "lucide:gauge",
    values: {
      dataset: "speedReadings",
      binCount: 14,
      percentileMode: "50-85",
      normalize: false,
      gridlines: true,
    },
  },
];

function getPercentiles(mode: string): number[] | undefined {
  if (mode === "none") return undefined;
  if (mode === "50-95") return [50, 95];
  if (mode === "50-85") return [50, 85];
  if (mode === "25-50-75") return [25, 50, 75];
  return undefined;
}

const flagshipVue = `<tux-chart-histogram
  :values="travelTimes"
  :percentiles="[50, 95]"
  x-label="Corridor travel time (min)"
  units="trips"
/>`;

const normalizedVue = `<tux-chart-histogram
  :values="controlDelays"
  normalize
  :bin-count="16"
  x-label="Control delay (s)"
  units="intersections"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="visualization · native chart" title="TuxChartHistogram">
      Distribution chart over raw samples — hand it the observations
      and it bins, counts, and draws. Bin edges snap to 1/2/5 ×
      10<sup>k</sup> so ranges read "10–15 min", never
      "9.37–14.12 min". Built for the travel-time-reliability shape:
      the <code>percentiles</code> prop drops dashed gold rules at
      p50 / p95, the planning-time-index pair every reliability
      exhibit prints.
    </TuxPageHeader>

    <!-- Interactive Props & Telemetry Workbench -->
    <section>
      <TuxPlayground
        tag="tux-chart-histogram"
        component-name="TuxChartHistogram"
        title="Histogram & Distribution Workbench"
        eyebrow="Interactive Telemetry Lab"
        :controls="histogramControls"
        :presets="histogramPresets"
        :source="tuxChartHistogramSource"
        :powerbi="pbiCartesian"
        :code-template="(values) => {
          const ds = datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.travelTimes;
          const p = getPercentiles(values.percentileMode);
          const pAttr = p ? `\n  :percentiles=\x22${JSON.stringify(p)}\x22` : '';
          const binAttr = values.binCount !== 12 ? `\n  :bin-count=\x22${values.binCount}\x22` : '';
          const normAttr = values.normalize ? '\n  normalize' : '';
          const gridAttr = !values.gridlines ? '\n  :gridlines=\x22false\x22' : '';
          return `<tux-chart-histogram\n  :values=\x22${ds.label}\x22${pAttr}${binAttr}${normAttr}${gridAttr}\n  x-label=\x22${ds.xLabel}\x22\n  units=\x22${ds.units}\x22\n/>`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full max-w-3xl">
            <TuxChartHistogram
              :values="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.travelTimes).values"
              :percentiles="getPercentiles(values.percentileMode)"
              :bin-count="values.binCount"
              :normalize="values.normalize"
              :gridlines="values.gridlines"
              :x-label="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.travelTimes).xLabel"
              :units="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.travelTimes).units"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">flagship · reliability</p>
      <h2 class="heading--bold text-xl font-bold">Travel-time distribution with p50 / p95</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Real travel times are right-skewed: a tight free-flow cluster
        and a long incident tail. The distance between the two gold
        rules <em>is</em> the reliability story — a p95 far from the
        median means travelers must budget for the tail, not the
        average. Hover or arrow-key across bins for count + share.
      </p>
      <TuxExample class="mt-4" :vue="flagshipVue" :source="tuxChartHistogramSource" :powerbi="pbiCartesian">
        <TuxChartHistogram
          :values="travelTimes"
          :percentiles="[50, 95]"
          x-label="Corridor travel time (min)"
          units="trips"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">normalized · share of samples</p>
      <h2 class="heading--bold text-xl font-bold">Control delay, percent of intersections</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        <code>normalize</code> re-labels the y axis as percent of
        samples — right when two distributions with different sample
        sizes sit side by side in a <code>TuxVizGrid</code> and raw
        counts would mislead. <code>bin-count</code> is a target;
        the actual count lands nearby on nice edges.
      </p>
      <TuxExample class="mt-4" :vue="normalizedVue" :source="tuxChartHistogramSource" :powerbi="pbiCartesian">
        <TuxChartHistogram
          :values="controlDelays"
          normalize
          :bin-count="16"
          x-label="Control delay (s)"
          units="intersections"
        />
      </TuxExample>
    </section>
  </div>
</template>
