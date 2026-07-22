<script setup lang="ts">
// Same Nuxt-macro-extractor constraint as chart-line.vue: keep top-
// level expressions in this <script setup> as plain JS (no `as`
// casts, no type annotations on const, no `satisfies`). Inference
// gives `number[]` / `number[][]` which is what the runtime wants.
// See ADR-0010 for the full context.
useHead({ title: "TuxChartBar · TUX" });

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const trafficByStatus = [
  { key: "active",   label: "Active",   data: [142, 168, 155, 189, 210, 174, 198, 221] },
  { key: "queued",   label: "Queued",   data: [88, 102, 120, 134, 142, 138, 156, 162] },
  { key: "failed",   label: "Failed",   data: [4, 6, 3, 8, 5, 9, 7, 4] },
];

const projectionsActuals = [
  {
    key: "revenue",
    label: "Revenue (M)",
    data:        [22, 31, 28, 35, 38, 44],
    comparison:  [25, 28, 33, 32, 40, 41],
  },
];

const corridorScores = [
  {
    key: "score",
    label: "Resilience score",
    data: [82, 76, 68, 62, 55, 48, 42, 38],
  },
];

const basicVue = `<tux-chart-bar
  :labels="months"
  :series="[
    { key: 'ingest', label: 'Files ingested', data: [12, 18, 24, 31, 28, 35] },
  ]"
/>`;

const groupedVue = `<tux-chart-bar :labels="months" :series="trafficByStatus" />`;

const stackedVue = `<tux-chart-bar :labels="months" :series="trafficByStatus" variant="stacked" />`;

const comparisonVue = `<!-- The lighter "comparison" overlay sits behind the primary bar -->
<tux-chart-bar :labels="quarters" :series="projectionsActuals" />`;

const horizontalVue = `<tux-chart-bar
  :labels="corridors"
  :series="corridorScores"
  orientation="horizontal"
  :width="640"
  :height="360"
/>`;

const framedVue = `<tux-chart-frame
  eyebrow="Exhibit 12.01"
  title="Scan throughput by status"
  source="Source: TTI Landscape index, 2026"
>
  <tux-chart-bar :labels="months" :series="trafficByStatus" />
</tux-chart-frame>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="visualization · native chart" title="TuxChartBar">
      Native SVG bar chart. No external library. Sibling to
      <NuxtLink to="/visualizations/chart-line" class="link-tti">TuxChartLine</NuxtLink>
      and follows the same chart-foundations doctrine:
      maroon-led palette via <code>--chart-1..8</code>, value labels
      colored to the bar in single-series mode, optional comparison
      overlay for projection-vs-actual, and an auto-derived screen-
      reader summary.
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
      <h2 class="heading--bold text-xl font-bold">Files ingested per month</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Single-series mode walks the palette across categories so each
        bar carries its own hue + colored value label. Use when the
        data point itself is the focus.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <TuxChartBar
          :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']"
          :series="[{ key: 'ingest', label: 'Files ingested', data: [12, 18, 24, 31, 28, 35] }]"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">multi-series · grouped</p>
      <h2 class="heading--bold text-xl font-bold">Scan throughput by status</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Three series — palette indexes 1, 2, 3 (maroon / slate teal /
        wheat). Each category shows the three series side-by-side.
      </p>
      <TuxExample class="mt-4" :vue="groupedVue">
        <TuxChartBar :labels="months" :series="trafficByStatus" legend />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">stacked variant</p>
      <h2 class="heading--bold text-xl font-bold">Same data, stacked</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>variant="stacked"</code> when the *total per
        category* matters more than the individual values. Useful for
        "of all scans this month, what's the composition?"
      </p>
      <TuxExample class="mt-4" :vue="stackedVue">
        <TuxChartBar :labels="months" :series="trafficByStatus" variant="stacked" legend />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">comparison overlay · projections vs actuals</p>
      <h2 class="heading--bold text-xl font-bold">Forecast vs realized</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>series[i].comparison</code> with the same length as
        <code>data</code>. The component draws a 32%-opacity bar at
        each comparison value behind the primary bar — a single-glance
        read on "where did we hit / miss." Absorbed from the Snow
        Dashboard "Projections vs Actuals" pattern.
      </p>
      <TuxExample class="mt-4" :vue="comparisonVue">
        <TuxChartBar
          :labels="['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6']"
          :series="projectionsActuals"
          aria-summary="Revenue per quarter — solid bar is actual, lighter bar is projection. Actuals beat projection in 3 of 6 quarters."
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">horizontal orientation</p>
      <h2 class="heading--bold text-xl font-bold">Long category labels</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Use horizontal when categories have long names or when you have
        more than ~10 categories — the bars stack vertically and the
        labels read naturally left of each bar.
      </p>
      <TuxExample class="mt-4" :vue="horizontalVue">
        <TuxChartBar
          :labels="['I-35', 'I-45', 'I-10 East', 'I-10 West', 'US-59', 'SH-130', 'SH-99', 'Loop 410']"
          :series="corridorScores"
          orientation="horizontal"
          :width="640"
          :height="360"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">wrapped · editorial frame</p>
      <h2 class="heading--bold text-xl font-bold">Inside a TuxChartFrame</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Wrap in <code>TuxChartFrame</code> to make the chart a numbered
        exhibit (eyebrow + display-face title + maroon signature rule +
        source citation below).
      </p>
      <TuxExample class="mt-4" :vue="framedVue">
        <TuxChartFrame
          eyebrow="Exhibit 12.01"
          title="Scan throughput by status"
          subtitle="Active / queued / failed counts per month"
          source="Source: TTI Landscape index, 2026"
        >
          <TuxChartBar :labels="months" :series="trafficByStatus" legend />
        </TuxChartFrame>
      </TuxExample>
    </section>
  </div>
</template>
