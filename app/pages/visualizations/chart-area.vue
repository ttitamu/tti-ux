<script setup lang="ts">
// Per ADR-0010, keep top-level <script setup> expressions plain JS.
import pbiCartesian from "../../../kit/powerbi/pbir/fragments/tti/chart-cartesian.json?raw";
import tuxChartAreaSource from "~/components/TuxChartArea.vue?raw";

useHead({ title: "TuxChartArea · TUX" });

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const recentMonths = months.slice(0, 8);

const singleSeries = [
  {
    key: "ingest",
    label: "Files ingested (M)",
    data: [12.4, 14.8, 18.2, 22.1, 24.7, 28.3, 30.1, 33.4, 35.8, 38.9, 41.2, 44.0],
  },
];

const stackedSeries = [
  { key: "csv",     label: "CSV",     data: [12, 14, 17, 19, 22, 26, 29, 33] },
  { key: "pdf",     label: "PDF",     data: [8, 10, 11, 13, 13, 15, 16, 18] },
  { key: "geojson", label: "GeoJSON", data: [4, 5, 6, 7, 9, 11, 12, 14] },
];

const datasetMap = {
  single: {
    labels: months,
    series: singleSeries,
    codeLabels: "months",
    codeSeries: "singleSeries",
  },
  stacked: {
    labels: recentMonths,
    series: stackedSeries,
    codeLabels: "recentMonths",
    codeSeries: "stackedSeries",
  },
};

const areaControls = [
  {
    prop: "dataset",
    label: "Telemetry Dataset",
    type: "select" as const,
    options: [
      { label: "Annual Ingest Volume (Single Series)", value: "single" },
      { label: "Corpus File Formats (Stacked 3 Series)", value: "stacked" },
    ],
    defaultValue: "stacked",
    description: "Transportation operations time series dataset",
  },
  {
    prop: "variant",
    label: "Area Stacking",
    type: "select" as const,
    options: [
      { label: "Overlay (Translucent fill from zero)", value: "overlay" },
      { label: "Stacked (Cumulative band layers)", value: "stacked" },
    ],
    defaultValue: "stacked",
    description: "Visual layering mode",
  },
  {
    prop: "legend",
    label: "Show Legend",
    type: "boolean" as const,
    defaultValue: true,
    description: "Display series legend strip",
  },
];

const areaPresets = [
  {
    name: "stacked-composition",
    label: "Stacked Corpus Composition",
    description: "Multi-layer cumulative bands showing total volume composition",
    icon: "lucide:layers",
    values: {
      dataset: "stacked",
      variant: "stacked",
      legend: true,
    },
  },
  {
    name: "single-volume",
    label: "Cumulative Ingest Volume",
    description: "Single-series overlay area fill with end-of-line value callout",
    icon: "lucide:trending-up",
    values: {
      dataset: "single",
      variant: "overlay",
      legend: false,
    },
  },
];

const basicVue = `<tux-chart-area :labels="months" :series="singleSeries" />`;
const stackedVue = `<tux-chart-area :labels="months" :series="stackedSeries" variant="stacked" legend />`;

const compositionVue = `<!-- "KPI strip over stacked area" — pattern absorbed from Charts UI Kit -->
<div class="kpi-strip">
  <TuxBigStat label="Total" :value="184" suffix="M" delta="+12% MoM" />
  <TuxBigStat label="CSV"  :value="33" suffix="M" />
  <TuxBigStat label="PDF"  :value="18" suffix="M" />
  <TuxBigStat label="GeoJSON" :value="14" suffix="M" />
</div>
<tux-chart-area :labels="months" :series="stackedSeries" variant="stacked" />`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="visualization · native chart" title="TuxChartArea">
      Native SVG area chart, sibling to <code>TuxChartLine</code>.
      Use when the magnitude is the message — cumulative ingest
      volume, daily totals, compositional time-series. Same data shape
      as TuxChartLine for easy switching.
    </TuxPageHeader>

    <!-- Interactive Props & Telemetry Workbench -->
    <section>
      <TuxPlayground
        tag="tux-chart-area"
        component-name="TuxChartArea"
        title="Area Chart & Telemetry Volume Workbench"
        eyebrow="Interactive Telemetry Lab"
        :controls="areaControls"
        :presets="areaPresets"
        :source="tuxChartAreaSource"
        :powerbi="pbiCartesian"
        :code-template="(values) => {
          const ds = datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.stacked;
          const varAttr = values.variant !== 'overlay' ? `\n  variant=\x22${values.variant}\x22` : '';
          const legAttr = values.legend ? '\n  legend' : '';
          return `<tux-chart-area\n  :labels=\x22${ds.codeLabels}\x22\n  :series=\x22${ds.codeSeries}\x22${varAttr}${legAttr}\n/>`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full max-w-3xl">
            <TuxChartArea
              :labels="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.stacked).labels"
              :series="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.stacked).series"
              :variant="values.variant"
              :legend="values.legend"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">flagship · single series</p>
      <h2 class="heading--bold text-xl font-bold">Files ingested</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Overlay (default) variant — area fills from 0 with 0.22
        opacity, edged with a crisp top line. End-of-area value label
        colored to series.
      </p>
      <TuxExample :powerbi="pbiCartesian" :source="tuxChartAreaSource" class="mt-4" :vue="basicVue">
        <TuxChartArea :labels="months" :series="singleSeries" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">stacked · composition over time</p>
      <h2 class="heading--bold text-xl font-bold">Corpus composition</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>variant="stacked"</code> for cumulative bands — the
        top edge of the stack is the total. Each band fills with 0.78
        opacity so series identity stays legible.
      </p>
      <TuxExample :powerbi="pbiCartesian" :source="tuxChartAreaSource" class="mt-4" :vue="stackedVue">
        <TuxChartArea
          :labels="recentMonths"
          :series="stackedSeries"
          variant="stacked"
          legend
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">composition · KPI strip + stacked area</p>
      <h2 class="heading--bold text-xl font-bold">"Total · Series A · Series B" above the stack</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        The canonical "summary + trend" composition absorbed from the
        Charts UI Kit (NOTES.md §Absorb #2). Anchor a row of
        <code>TuxBigStat</code> above the area chart so the operator
        reads the headline numbers first, then sees the shape.
      </p>
      <TuxExample :powerbi="pbiCartesian" :source="tuxChartAreaSource" class="mt-4" :vue="compositionVue">
        <div class="space-y-4">
          <div class="grid grid-cols-4 gap-4">
            <TuxBigStat label="Total"   :value="184" suffix="M" delta="+12% MoM" />
            <TuxBigStat label="CSV"     :value="33"  suffix="M" />
            <TuxBigStat label="PDF"     :value="18"  suffix="M" />
            <TuxBigStat label="GeoJSON" :value="14"  suffix="M" />
          </div>
          <TuxChartArea
            :labels="recentMonths"
            :series="stackedSeries"
            variant="stacked"
          />
        </div>
      </TuxExample>
    </section>
  </div>
</template>
