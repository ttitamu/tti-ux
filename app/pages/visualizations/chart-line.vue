<script setup lang="ts">
// `bandSeries` (tuple-typed) and `brushRange` (tuple-typed ref) are
// imported from a sibling `.demo-data.ts` module so we can use real
// TS annotations — Nuxt's page-extract macro parser doesn't honor
// TS-only syntax in top-level `<script setup>` declarations (`as`,
// type annotations, `satisfies` all break it with "Unexpected token"),
// but an external .ts import sidesteps that entirely.
import { bandSeries, brushRange } from "./chart-line.demo-data";

// Note for future authors: keep top-level expressions in this script
// block as plain JS. Nuxt's page-extract pass uses a JS-only parser
// path that doesn't honor `lang="ts"`, and any TS-only syntax (`as`,
// type annotations, `satisfies`) surfaces as a confusing
// "?macro=true — Error parsing JavaScript expression (1:30)" with
// the position pointing nowhere useful. Type-annotated locals are
// fine inside function bodies; the constraint is on the top-level
// statements the macro extractor walks.
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

    <section>
      <p class="eyebrow">flagship · single series</p>
      <h2 class="heading--bold text-xl font-bold">Annual ingest rate</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Single-series line with end-of-line value label. The label
        carries series identity — even without a legend, the reader
        sees the final value at a glance.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <TuxChartLine :labels="months" :series="singleSeries" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">multi-series · markers</p>
      <h2 class="heading--bold text-xl font-bold">Scan throughput by status</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Three series — palette indexes 1, 2, 3 (maroon / slate teal /
        wheat). Markers on every point make individual data points
        clickable in interactive consumers. Legend stays off; the
        end-of-line labels carry identity.
      </p>
      <TuxExample class="mt-4" :vue="multiVue">
        <TuxChartLine :labels="months" :series="multiSeries" markers />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">previous-period overlay</p>
      <h2 class="heading--bold text-xl font-bold">Current week vs prior week</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>series[i].previous</code> with the same length as
        <code>data</code>. The component renders a 60% opacity dashed
        companion in the same hue family — the visual cue that says
        "same metric, prior window."
      </p>
      <TuxExample class="mt-4" :vue="prevVue">
        <TuxChartLine
          :labels="months.slice(3)"
          :series="previousSeries"
          markers
          aria-summary="Files ingested (M), comparison of current 8-week window to prior 8-week window. Current ranges 22 to 41; prior ranged 18 to 32."
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">confidence band</p>
      <h2 class="heading--bold text-xl font-bold">Estimated rate with 95% CI</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>series[i].band</code> as an array of
        <code>[low, high]</code> tuples. Soft fill in the same hue
        family. Use for forecasts, estimates, and any chart where the
        reader needs to see uncertainty alongside the central line.
      </p>
      <TuxExample class="mt-4" :vue="bandVue">
        <TuxChartLine :labels="months" :series="bandSeries" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">hover tooltip · keyboard arrow nav</p>
      <h2 class="heading--bold text-xl font-bold">Pointer-driven readout</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        On by default. Hover, click into the plot area, or tab focus +
        arrow-key to cycle through data points. The tooltip shows every
        series' value at the active index, with a 60%-opacity "previous"
        readout when applicable.
      </p>
      <TuxExample class="mt-4" :vue="tooltipVue">
        <TuxChartLine :labels="months" :series="multiSeries" markers />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">brush selector · drill into a window</p>
      <h2 class="heading--bold text-xl font-bold">Drag the handles below</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>brush</code> + <code>v-model:range</code> to get a
        compact preview strip below the main chart with two draggable
        handles. The main chart rescales to the window. Drag the window
        itself (between the handles) to pan; drag handles to resize.
        Carry-forward from the Charts UI Kit absorption.
      </p>
      <TuxExample class="mt-4" :vue="brushVue">
        <TuxChartLine
          v-model:range="brushRange"
          :labels="months"
          :series="singleSeries"
          brush
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">composition · open in focus mode</p>
      <h2 class="heading--bold text-xl font-bold">Pin the chart full-viewport</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Compose with <NuxtLink to="/components/focus-view" class="link-tti">TuxFocusView</NuxtLink>
        to give consumers a "pin this chart full-screen" affordance —
        useful in dashboard tiles when a chart needs more breathing
        room for analysis. The brush + tooltip still work inside the
        overlay.
      </p>
      <TuxExample class="mt-4" :vue="focusVue">
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
      <TuxExample class="mt-4" :vue="framedVue">
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
