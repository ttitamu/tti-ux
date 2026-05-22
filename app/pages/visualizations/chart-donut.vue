<script setup lang="ts">
// Per ADR-0010, keep top-level <script setup> expressions plain JS.
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

const totalFiles = fileTypes.reduce((a, b) => a + b.value, 0);

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

    <section>
      <p class="eyebrow">flagship · center stat</p>
      <h2 class="heading--bold text-xl font-bold">File type distribution</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>centerLabel</code> + <code>centerValue</code> for
        the headline-in-the-hole composition. Six slices auto-fold
        to "Other" past <code>minSlice</code> (default 3%).
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
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
      <TuxExample class="mt-4" :vue="legendVue">
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
      <TuxExample class="mt-4" :vue="framedVue">
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
