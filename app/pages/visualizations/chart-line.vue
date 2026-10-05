<script setup lang="ts">
// `bandSeries` (tuple-typed) and `brushRange` (tuple-typed ref) are
// imported from a sibling `.demo-data.ts` module so we can use real
// TS annotations — Nuxt's page-extract macro parser doesn't honor
// TS-only syntax in top-level `<script setup>` declarations (`as`,
// type annotations, `satisfies` all break it with "Unexpected token"),
// but an external .ts import sidesteps that entirely.
import { bandSeries, brushRange } from "./chart-line.demo-data";
import pbiCartesian from "../../../kit/powerbi/pbir/fragments/tti/chart-cartesian.json?raw";
import tuxChartLineSource from "~/components/TuxChartLine.vue?raw";

useHead({ title: "TuxChartLine · TUX" });

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const singleSeries = [
  { key: "ingest", label: "Files ingested (M)", data: [12.4, 14.8, 18.2, 22.1, 24.7, 28.3, 30.1, 33.4, 35.8, 38.9, 41.2, 44.0] },
];

const multiSeries = [
  { key: "active",   label: "Active scans",   data: [142, 168, 155, 189, 210, 174, 198, 221, 240, 226, 248, 263] },
  { key: "queued",   label: "Queued",         data: [88, 102, 120, 134, 142, 138, 156, 162, 188, 170, 182, 198] },
  { key: "failed",   label: "Failed",         data: [4, 6, 3, 8, 5, 9, 7, 4, 11, 8, 6, 9] },
];

const previousSeries = [
  {
    key: "ingest",
    label: "Files ingested (M)",
    data:     [22.1, 24.7, 28.3, 30.1, 33.4, 35.8, 38.9, 41.2],
    previous: [18.5, 20.4, 22.1, 24.6, 27.0, 28.4, 30.2, 32.1],
  },
];

const datasetMap = {
  single: {
    labels: months,
    series: singleSeries,
    codeLabels: "months",
    codeSeries: "singleSeries",
  },
  multi: {
    labels: months,
    series: multiSeries,
    codeLabels: "months",
    codeSeries: "multiSeries",
  },
  previous: {
    labels: months.slice(0, 8),
    series: previousSeries,
    codeLabels: "months",
    codeSeries: "previousSeries",
  },
  band: {
    labels: months,
    series: bandSeries,
    codeLabels: "months",
    codeSeries: "bandSeries",
  },
};

const lineControls = [
  {
    prop: "dataset",
    label: "Telemetry Dataset",
    type: "select" as const,
    options: [
      { label: "Annual Ingest Rate (Single Series)", value: "single" },
      { label: "Scan Operations (Active / Queued / Failed)", value: "multi" },
      { label: "Prior Period Comparison (Ingest M)", value: "previous" },
      { label: "Confidence Band Model (CI Upper/Lower)", value: "band" },
    ],
    defaultValue: "multi",
    description: "Multi-point telemetry time series dataset",
  },
  {
    prop: "markers",
    label: "Show Point Markers",
    type: "boolean" as const,
    defaultValue: true,
    description: "Render circle markers at each observation point",
  },
  {
    prop: "brush",
    label: "Interactive Range Brush",
    type: "boolean" as const,
    defaultValue: false,
    description: "Provide interactive two-way window zoom scrub handles",
  },
  {
    prop: "legend",
    label: "Show Series Legend",
    type: "boolean" as const,
    defaultValue: true,
    description: "Display series legend strip",
  },
];

const linePresets = [
  {
    name: "multi-operations",
    label: "Operations Telemetry (Multi-Series)",
    description: "3-series operations timeline with point markers and legend",
    icon: "lucide:activity",
    values: {
      dataset: "multi",
      markers: true,
      brush: false,
      legend: true,
    },
  },
  {
    name: "prior-period-overlay",
    label: "Prior Period Comparison",
    description: "Dashed 60% opacity companion overlay representing prior time window",
    icon: "lucide:git-compare",
    values: {
      dataset: "previous",
      markers: true,
      brush: false,
      legend: false,
    },
  },
  {
    name: "confidence-band",
    label: "Confidence Band Model",
    description: "Translucent CI boundary fill backing forecast curve",
    icon: "lucide:trending-up",
    values: {
      dataset: "band",
      markers: false,
      brush: false,
      legend: false,
    },
  },
  {
    name: "timeline-brush",
    label: "Interactive Range Brush",
    description: "Draggable timeline window scrub bar for wide telemetry ranges",
    icon: "lucide:sliders",
    values: {
      dataset: "single",
      markers: true,
      brush: true,
      legend: false,
    },
  },
];

const basicVue = `<tux-chart-line :labels="months" :series="series" :width="640" :height="280" />`;
const multiVue = `<tux-chart-line :labels="months" :series="multiSeries" markers />`;
const prevVue = `<!-- series[].previous renders as a 60% opacity dashed
     companion in the same hue. Same metric, prior window. -->
<tux-chart-line :labels="labels" :series="previousSeries" markers />`;
const bandVue = `<!-- series[].band renders a soft CI fill behind the line. -->
<tux-chart-line :labels="months" :series="bandSeries" />`;

const framedVue = `<tux-chart-frame
  eyebrow="Exhibit 11.04"
  title="Monthly ingest rate"
  source="Source: TTI Landscape index, 2026"
>
  <tux-chart-line :labels="months" :series="singleSeries" />
</tux-chart-frame>`;

const tooltipVue = `<!-- Tooltip is on by default — disable with :tooltip="false" -->
<tux-chart-line :labels="months" :series="multiSeries" markers />`;

const brushVue = `<!-- Two-way bound range; drag the handles below the chart -->
<tux-chart-line
  v-model:range="visibleRange"
  :labels="months"
  :series="singleSeries"
  brush
/>`;

const focusOpen = ref(false);
const focusVue = `<UButton icon="lucide:maximize" @click="focusOpen = true">Open in focus mode</UButton>
<TuxFocusView
  v-model:open="focusOpen"
  eyebrow="Exhibit 11.04"
  title="Monthly ingest rate"
>
  <template #actions>
    <UButton variant="ghost" icon="lucide:download" />
  </template>
  <TuxChartLine :labels="months" :series="multiSeries" :width="1100" :height="500" markers brush />
</TuxFocusView>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="visualization · native chart" title="TuxChartLine">
      Native SVG line chart. No external library. Follows
      <NuxtLink to="/design/chart-foundations" class="link-tti">chart-foundations</NuxtLink>:
      maroon-led palette via <code>--chart-1..8</code>, end-of-line
      value labels colored to the series (color-blind users get
      identity from text adjacency, not just hue), optional
      previous-period dashed overlay, optional confidence band, and
      an auto-derived screen-reader summary.
      <br><br>
      <span class="text-sm text-text-muted">
        Renders bare in dashboard tiles; wrap in
        <code>TuxChartFrame</code> to inherit the editorial chrome
        (eyebrow / display-face title / signature rule / source line)
        for reports.
      </span>
    </TuxPageHeader>

    <!-- Interactive Props & Telemetry Workbench -->
    <section>
      <TuxPlayground
        tag="tux-chart-line"
        component-name="TuxChartLine"
        title="Line Chart & Telemetry Series Workbench"
        eyebrow="Interactive Telemetry Lab"
        :controls="lineControls"
        :presets="linePresets"
        :source="tuxChartLineSource"
        :powerbi="pbiCartesian"
        :code-template="(values) => {
          const ds = datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.multi;
          const markerAttr = values.markers ? '\n  markers' : '';
          const brushAttr = values.brush ? '\n  brush' : '';
          const legendAttr = values.legend ? '\n  legend' : '';
          return `<tux-chart-line\n  :labels=\x22${ds.codeLabels}\x22\n  :series=\x22${ds.codeSeries}\x22${markerAttr}${brushAttr}${legendAttr}\n  :width=\x22640\x22\n  :height=\x22280\x22\n/>`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full max-w-3xl">
            <TuxChartLine
              :labels="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.multi).labels"
              :series="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.multi).series"
              :markers="values.markers"
              :brush="values.brush"
              :legend="values.legend"
              :width="640"
              :height="280"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">flagship · single series</p>
      <h2 class="heading--bold text-xl font-bold">Annual ingest rate</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Single-series line with end-of-line value label. The label
        carries series identity — even without a legend, the reader
        sees the final value at a glance.
      </p>
      <TuxExample :powerbi="pbiCartesian" :source="tuxChartLineSource" class="mt-4" :vue="basicVue">
        <TuxChartLine :labels="months" :series="singleSeries" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">multi-series</p>
      <h2 class="heading--bold text-xl font-bold">Scan operations by status</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Three series walking the palette (maroon / slate teal / wheat).
        Pass <code>markers</code> to drop dots on each observation
        point; helpful when data isn't dense.
      </p>
      <TuxExample :powerbi="pbiCartesian" :source="tuxChartLineSource" class="mt-4" :vue="multiVue">
        <TuxChartLine :labels="months" :series="multiSeries" markers />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">comparison overlay · prior period</p>
      <h2 class="heading--bold text-xl font-bold">Same metric, prior window</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>series[i].previous</code> with the same length as
        <code>data</code>. The component draws a 60%-opacity dashed
        line in the same hue behind the primary — an instant read on
        "ahead or behind last year" without taking a whole extra series
        color.
      </p>
      <TuxExample :powerbi="pbiCartesian" :source="tuxChartLineSource" class="mt-4" :vue="prevVue">
        <TuxChartLine :labels="months.slice(0, 8)" :series="previousSeries" markers />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">statistical · confidence band</p>
      <h2 class="heading--bold text-xl font-bold">Estimate with uncertainty band</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>series[i].band</code> as an array of <code>[low, high]</code>
        tuples. Renders a soft 12%-opacity fill behind the line — right
        for projections, sensor error margins, or 95% CIs.
      </p>
      <TuxExample :powerbi="pbiCartesian" :source="tuxChartLineSource" class="mt-4" :vue="bandVue">
        <TuxChartLine :labels="months" :series="bandSeries" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">interactive · crosshair tooltip</p>
      <h2 class="heading--bold text-xl font-bold">Inspect values across series</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Hover or tap to drop a vertical cursor rule; the floating
        card shows values across all series at that x-position.
        Keyboard accessible: Tab into the chart, Arrow keys scrub.
      </p>
      <TuxExample :powerbi="pbiCartesian" :source="tuxChartLineSource" class="mt-4" :vue="tooltipVue">
        <TuxChartLine :labels="months" :series="multiSeries" markers />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">interactive · timeline brush</p>
      <h2 class="heading--bold text-xl font-bold">Pan and zoom over long ranges</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>brush</code> to render a mini-map strip beneath the
        chart. Drag the handles or pan the window to zoom into a
        subset of the series without page-level controls. Two-way
        bind with <code>v-model:range="[startIndex, endIndex]"</code>.
      </p>
      <TuxExample :powerbi="pbiCartesian" :source="tuxChartLineSource" class="mt-4" :vue="brushVue">
        <div class="space-y-2">
          <p class="text-xs text-text-muted font-mono">
            Visible: months[{{ brushRange[0] }}..{{ brushRange[1] }}] = {{ months[brushRange[0]] }}–{{ months[brushRange[1]] }}
          </p>
          <TuxChartLine
            v-model:range="brushRange"
            :labels="months"
            :series="singleSeries"
            brush
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">modal · focus view</p>
      <h2 class="heading--bold text-xl font-bold">Pin the chart full-viewport</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Compose with <NuxtLink to="/components/focus-view" class="link-tti">TuxFocusView</NuxtLink>
        to give consumers a "pin this chart full-screen" affordance —
        useful in dashboard tiles when a chart needs more breathing
        room for analysis. The brush + tooltip still work inside the
        overlay.
      </p>
      <TuxExample :powerbi="pbiCartesian" :source="tuxChartLineSource" class="mt-4" :vue="focusVue">
        <UButton icon="lucide:maximize" @click="focusOpen = true">Open in focus mode</UButton>
        <TuxFocusView
          v-model:open="focusOpen"
          eyebrow="Exhibit 11.04"
          title="Monthly ingest rate"
        >
          <template #actions>
            <UButton variant="ghost" icon="lucide:download" />
          </template>
          <TuxChartLine
            :labels="months"
            :series="multiSeries"
            :width="1100"
            :height="500"
            markers
            brush
          />
        </TuxFocusView>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">wrapped · editorial frame</p>
      <h2 class="heading--bold text-xl font-bold">Inside a TuxChartFrame</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Wrap in <code>TuxChartFrame</code> to make the chart a numbered
        exhibit (eyebrow + display-face title + maroon signature rule +
        source citation below). This is the report rhythm; bare lines
        belong in dashboard tiles.
      </p>
      <TuxExample :powerbi="pbiCartesian" :source="tuxChartLineSource" class="mt-4" :vue="framedVue">
        <TuxChartFrame
          eyebrow="Exhibit 11.04"
          title="Monthly ingest rate"
          subtitle="Files added to the corpus per month — total across all agents"
          source="Source: TTI Landscape index, 2026"
        >
          <TuxChartLine :labels="months" :series="singleSeries" :width="700" :height="300" />
        </TuxChartFrame>
      </TuxExample>
    </section>
  </div>
</template>
