<script setup>
// Per ADR-0010, keep top-level <script setup> expressions plain JS.
import {
  heatmapDays,
  heatmapHours,
  crashMatrix,
  corridorNames,
  monthNames,
  ttiMatrix,
} from "./chart-heatmap.demo-data";

useHead({ title: "TuxChartHeatmap · TUX" });

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

    <section>
      <p class="eyebrow">flagship · day × hour</p>
      <h2 class="heading--bold text-xl font-bold">Crashes by day of week and hour</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        The classic safety-analysis matrix: weekday AM/PM commute
        peaks in deep maroon, the weekend late-night shelf visible on
        Saturday and Sunday. Hover a cell — or Tab in and walk the
        matrix with arrow keys in <strong>two dimensions</strong> —
        for the exact count. Column labels auto-thin so the 24-hour
        axis never shingles.
      </p>
      <TuxExample class="mt-4" :vue="flagshipVue">
        <TuxChartHeatmap
          :rows="heatmapDays"
          :cols="heatmapHours"
          :values="crashMatrix"
          units="crashes"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">slate ramp · value labels · missing data</p>
      <h2 class="heading--bold text-xl font-bold">Travel-time index by corridor and month</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Small matrices (≤ ~12 columns) can afford in-cell values —
        turn on <code>value-labels</code>. The slate ramp is the
        neutral second voice for a dashboard already anchored by a
        maroon exhibit. Two sensor outages render as hollow hatched
        cells and read "No data" — a hole is a hole, never a zero.
      </p>
      <TuxExample class="mt-4" :vue="slateVue">
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
      <p class="eyebrow">print posture</p>
      <h2 class="heading--bold text-xl font-bold">Static, for reports</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        <code>:tooltip="false"</code> drops the hover layer for PDF /
        print contexts (the family contract), and the legend can go
        when a <code>TuxChartFrame</code> caption or a
        <code>TuxMapLegend</code> nearby already carries the ramp.
        The SVG <code>&lt;title&gt;</code> per cell and the derived
        screen-reader summary stay.
      </p>
      <TuxExample class="mt-4" :vue="printVue">
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
