<script setup lang="ts">
// Per ADR-0010, keep top-level <script setup> expressions plain JS.
useHead({ title: "TuxChartArea · TUX" });

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

const recentMonths = months.slice(0, 8);

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

    <section>
      <p class="eyebrow">flagship · single series</p>
      <h2 class="heading--bold text-xl font-bold">Files ingested</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Overlay (default) variant — area fills from 0 with 0.22
        opacity, edged with a crisp top line. End-of-area value label
        colored to series.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
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
      <TuxExample class="mt-4" :vue="stackedVue">
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
      <TuxExample class="mt-4" :vue="compositionVue">
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
