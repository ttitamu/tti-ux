<script setup lang="ts">
useHead({ title: "Visualizations · TUX" });

/**
 * /visualizations — landing for the visualization section.
 *
 * Reports vs visualizations — the distinction TTI cares about:
 *   - **Reports** (paper, PDF, print) deliver a finished narrative.
 *     The reader reads top-to-bottom; they don't pivot or filter.
 *     Lives in /reports.
 *   - **Visualizations** (BI tools, R artifacts, native charts)
 *     deliver an interactive surface. The reader pivots, filters,
 *     drills in, asks new questions of the data. Lives here.
 *
 * The separation makes the toolkit explicit: TuxVizEmbed wraps
 * BI iframes (Tableau, Power BI, Superset, Grafana). TuxVizRPlot
 * wraps R artifacts (ggplot PNG, ggsave SVG, htmlwidget). Future
 * native chart components (TuxChartBar, TuxChartLine — see
 * `design/roadmap.md` Priority B) will land in the same section.
 */
const tiles = [
  {
    label: "TuxVizEmbed",
    to: "/visualizations/embed",
    icon: "lucide:bar-chart-3",
    kind: "BI iframe wrapper",
    blurb: "Branded chrome around a Tableau · Power BI · Apache Superset · Grafana iframe. Sandboxed; loading + error + poster fallback states.",
  },
  {
    label: "TuxVizRPlot",
    to: "/visualizations/rplot",
    icon: "lucide:square-sigma",
    kind: "R artifact wrapper",
    blurb: "R-language plot artifact (PNG · SVG · htmlwidget) with editorial chrome and a source-line caption gutter.",
  },
  {
    label: "TuxVizGrid",
    to: "/visualizations/grid",
    icon: "lucide:grid-2x2",
    kind: "layout primitive",
    blurb: "Small-multiples shell — 2-, 3-, or 4-up panes of TuxVizEmbed / TuxVizRPlot with a shared editorial header. Container-queried collapse.",
  },
  {
    label: "TuxSparkline",
    to: "/visualizations/sparkline",
    icon: "lucide:trending-up",
    kind: "native mini chart",
    blurb: "Inline trend line — no axes, no legend. Pairs with TuxBigStat / TuxFactoid for KPI rows. Native SVG, theme-aware tones.",
  },
];
</script>

<template>
  <div class="space-y-8">
    <TuxPageHeader eyebrow="section" title="Visualizations">
      Interactive data surfaces — BI dashboards, R artifacts, native
      charts. Distinct from <NuxtLink to="/reports" class="link-tti">Reports</NuxtLink>:
      reports deliver a finished narrative, visualizations deliver
      an interactive surface a reader can pivot. Same tokens, different
      chrome (provider chip, source caption, sandboxed iframe).
    </TuxPageHeader>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NuxtLink
        v-for="t in tiles"
        :key="t.to"
        :to="t.to"
        class="card-linked p-5 flex gap-4 items-start"
      >
        <UIcon :name="t.icon" class="w-6 h-6 text-text-brand flex-shrink-0 mt-1" />
        <div>
          <p class="eyebrow">{{ t.kind }}</p>
          <h3 class="heading--bold text-base font-bold">{{ t.label }}</h3>
          <p class="mt-1 text-sm text-text-secondary leading-relaxed">{{ t.blurb }}</p>
        </div>
      </NuxtLink>
    </section>

    <section>
      <p class="eyebrow">scope</p>
      <h2 class="heading--bold text-lg font-bold">Full native chart family is still pending</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        <code>TuxSparkline</code> ships as the first native chart;
        the broader family (<code>TuxChartBar</code>, <code>TuxChartLine</code>,
        <code>TuxChartScatter</code>, <code>TuxStatComparison</code>) is
        still on the
        <NuxtLink to="/design/roadmap" class="link-tti">roadmap</NuxtLink>
        Priority B. Until those land, route axis-bearing cases
        through <code>TuxVizEmbed</code> + a Tableau / Superset URL,
        or <code>TuxVizRPlot</code> + a pre-rendered ggplot artifact.
      </p>
    </section>
  </div>
</template>
