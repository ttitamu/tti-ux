<script setup>
// Per ADR-0010, keep top-level <script setup> expressions plain JS.
import { travelTimes, controlDelays } from "./chart-histogram.demo-data";

useHead({ title: "TuxChartHistogram · TUX" });

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
      <TuxExample class="mt-4" :vue="flagshipVue">
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
      <TuxExample class="mt-4" :vue="normalizedVue">
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
