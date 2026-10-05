<script setup lang="ts">
import pbiCard from "../../../kit/powerbi/pbir/fragments/tti/card-chrome.json?raw";
import tuxChartDonutSource from "~/components/TuxChartDonut.vue?raw";

useHead({ title: "TuxChartDonut · TUX" });

const fileTypes = [
  { key: "csv",     label: "CSV",       value: 4820 },
  { key: "pdf",     label: "PDF",       value: 3140 },
  { key: "geojson", label: "GeoJSON",   value: 1880 },
  { key: "parquet", label: "Parquet",   value: 1210 },
  { key: "tiff",    label: "GeoTIFF",   value: 740 },
  { key: "other",   label: "Other",     value: 220 },
];

const trafficSources = [
  { key: "direct",   label: "Direct",   value: 184 },
  { key: "search",   label: "Search",   value: 142 },
  { key: "referral", label: "Referral", value: 88 },
  { key: "social",   label: "Social",   value: 24 },
];

const crashModes = [
  { key: "fatal",     label: "Fatal (K)",                  value: 38 },
  { key: "serious",   label: "Suspected Serious (A)",      value: 164 },
  { key: "minor",     label: "Non-Incapacitating (B)",     value: 580 },
  { key: "pdo",       label: "Property Damage Only (C/O)", value: 2410 },
];

const totalFiles = fileTypes.reduce((a, b) => a + b.value, 0);

const datasetMap = {
  fileTypes: {
    slices: fileTypes,
    label: "fileTypes",
    centerLabel: "Files indexed",
    centerValue: totalFiles,
  },
  trafficSources: {
    slices: trafficSources,
    label: "trafficSources",
    centerLabel: "Active users",
    centerValue: trafficSources.reduce((a, b) => a + b.value, 0),
  },
  crashModes: {
    slices: crashModes,
    label: "crashModes",
    centerLabel: "Crashes",
    centerValue: crashModes.reduce((a, b) => a + b.value, 0),
  },
};

const donutControls = [
  {
    prop: "dataset",
    label: "Telemetry Dataset",
    type: "select" as const,
    options: [
      { label: "Data Archive File Formats (6 types)", value: "fileTypes" },
      { label: "Portal Traffic Ingest Sources (4 sources)", value: "trafficSources" },
      { label: "Crash Severity Distribution (4 categories)", value: "crashModes" },
    ],
    defaultValue: "fileTypes",
    description: "Categorical breakdown dataset",
  },
  {
    prop: "size",
    label: "Donut Diameter",
    type: "select" as const,
    options: [
      { label: "Compact (240px)", value: 240 },
      { label: "Standard (300px)", value: 300 },
      { label: "Expanded (360px)", value: 360 },
    ],
    defaultValue: 300,
    description: "Rendered SVG diameter in CSS pixels",
  },
  {
    prop: "thickness",
    label: "Ring Thickness Ratio",
    type: "select" as const,
    options: [
      { label: "Fat Ring (0.35)", value: 0.35 },
      { label: "Standard Donut (0.50)", value: 0.5 },
      { label: "Thin Radial Ring (0.65)", value: 0.65 },
    ],
    defaultValue: 0.5,
    description: "Hole ratio (0.50 = classic donut hole)",
  },
  {
    prop: "sliceLabels",
    label: "Outer Callout Labels",
    type: "boolean" as const,
    defaultValue: true,
    description: "Draw external pointer labels around the circumference",
  },
  {
    prop: "legend",
    label: "Bottom Breakdown Legend",
    type: "boolean" as const,
    defaultValue: false,
    description: "Render bottom categorical table legend",
  },
];

const donutPresets = [
  {
    name: "data-archive-formats",
    label: "Data Archive Formats",
    description: "File type share with center total and external callout labels",
    icon: "lucide:file-text",
    values: {
      dataset: "fileTypes",
      size: 300,
      thickness: 0.5,
      sliceLabels: true,
      legend: false,
    },
  },
  {
    name: "traffic-sources-legend",
    label: "Traffic Ingest (Compact Legend)",
    description: "Dashboard tile configuration with bottom legend table",
    icon: "lucide:layers",
    values: {
      dataset: "trafficSources",
      size: 240,
      thickness: 0.5,
      sliceLabels: false,
      legend: true,
    },
  },
  {
    name: "crash-severity-donut",
    label: "Vision Zero Crash Severity",
    description: "Slimmer donut ring highlighting severe injury vs PDO proportions",
    icon: "lucide:alert-circle",
    values: {
      dataset: "crashModes",
      size: 300,
      thickness: 0.65,
      sliceLabels: true,
      legend: false,
    },
  },
];

const basicVue = `<tux-chart-donut
  :slices="[
    { key: 'csv',     label: 'CSV',     value: 4820 },
    { key: 'pdf',     label: 'PDF',     value: 3140 },
    { key: 'geojson', label: 'GeoJSON', value: 1880 },
  ]"
  center-label="Files indexed"
  :center-value="9840"
/>`;

const legendVue = `<tux-chart-donut :slices="trafficSources" legend />`;

const framedVue = `<tux-chart-frame
  eyebrow="Exhibit 12.04"
  title="File type distribution"
  source="Source: TTI Landscape corpus, 2026-Q2"
>
  <tux-chart-donut :slices="fileTypes" center-label="Total" :center-value="totalFiles" />
</tux-chart-frame>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="visualization · native chart" title="TuxChartDonut">
      Native SVG donut for share-of-total. The empty center reads as
      a label slot — perfect for "X total" headlines. Slices below
      <code>minSlice%</code> fold into an "Other" wedge so the chart
      stays legible past six categories. Walks
      <code>--chart-1..8</code> across slices; slice labels are
      colored to match the wedge they point at.
    </TuxPageHeader>

    <!-- Interactive Props & Telemetry Workbench -->
    <section>
      <TuxPlayground
        tag="tux-chart-donut"
        component-name="TuxChartDonut"
        title="Donut & Share-of-Total Workbench"
        eyebrow="Interactive Telemetry Lab"
        :controls="donutControls"
        :presets="donutPresets"
        :source="tuxChartDonutSource"
        :powerbi="pbiCard"
        :code-template="(values) => {
          const ds = datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.fileTypes;
          const sizeAttr = values.size !== 320 ? `\n  :size=\x22${values.size}\x22` : '';
          const thickAttr = values.thickness !== 0.5 ? `\n  :thickness=\x22${values.thickness}\x22` : '';
          const labelAttr = !values.sliceLabels ? '\n  :slice-labels=\x22false\x22' : '';
          const legendAttr = values.legend ? '\n  legend' : '';
          return `<tux-chart-donut\n  :slices=\x22${ds.label}\x22\n  center-label=\x22${ds.centerLabel}\x22\n  :center-value=\x22${ds.centerValue}\x22${sizeAttr}${thickAttr}${labelAttr}${legendAttr}\n/>`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full flex justify-center py-4">
            <TuxChartDonut
              :slices="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.fileTypes).slices"
              :size="Number(values.size)"
              :thickness="Number(values.thickness)"
              :slice-labels="values.sliceLabels"
              :legend="values.legend"
              :center-label="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.fileTypes).centerLabel"
              :center-value="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.fileTypes).centerValue"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">flagship · center stat</p>
      <h2 class="heading--bold text-xl font-bold">File type distribution</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>centerLabel</code> + <code>centerValue</code> for
        the headline-in-the-hole composition. Six slices auto-fold
        to "Other" past <code>minSlice</code> (default 3%).
      </p>
      <TuxExample class="mt-4" :vue="basicVue" :source="tuxChartDonutSource" :powerbi="pbiCard">
        <TuxChartDonut
          :slices="fileTypes"
          center-label="Files indexed"
          :center-value="totalFiles"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">with legend · compact tile</p>
      <h2 class="heading--bold text-xl font-bold">Traffic by source</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Turn on <code>legend</code> when outside slice labels would be
        cramped (dashboard tiles, small surfaces). Legend rows show
        absolute value + percent.
      </p>
      <TuxExample class="mt-4" :vue="legendVue" :source="tuxChartDonutSource" :powerbi="pbiCard">
        <TuxChartDonut
          :slices="trafficSources"
          :size="240"
          :slice-labels="false"
          legend
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">wrapped · editorial frame</p>
      <h2 class="heading--bold text-xl font-bold">Inside a TuxChartFrame</h2>
      <TuxExample class="mt-4" :vue="framedVue" :source="tuxChartDonutSource" :powerbi="pbiCard">
        <TuxChartFrame
          eyebrow="Exhibit 12.04"
          title="File type distribution"
          subtitle="Corpus composition by extension; Q2 2026"
          source="Source: TTI Landscape corpus, 2026-Q2"
        >
          <TuxChartDonut
            :slices="fileTypes"
            center-label="Total"
            :center-value="totalFiles"
          />
        </TuxChartFrame>
      </TuxExample>
    </section>
  </div>
</template>
