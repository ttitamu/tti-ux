<script setup lang="ts">
useHead({ title: "TuxVizRPlot · Visualizations · TUX" });

const svgVue = `<tux-viz-rplot
  kind="svg"
  src="/viz-rplot-grants.svg"
  title="Grant draws by sponsor — FY26 by quarter"
  eyebrow="ggplot2 · facet_wrap"
  ratio="8/5"
  source="R 4.4.1 · ggplot2 3.5.1 · scripts/grants-by-quarter.R"
/>`;

const imageVue = `<tux-viz-rplot
  kind="image"
  src="/charts/q1-grants.png"
  src2x="/charts/q1-grants@2x.png"
  title="Grant draws by source · 2026 Q1"
  eyebrow="ggplot2 · facet_wrap"
  ratio="16/10"
  source="R 4.4.1 · ggplot2 3.5 · scripts/q1-grants.R"
/>`;

const htmlVue = `<tux-viz-rplot
  kind="html"
  src="/charts/funding-stream.html"
  title="Funding stream · interactive"
  eyebrow="plotly::ggplotly"
  ratio="16/9"
  source="scripts/funding-stream.Rmd"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="visualizations" title="TuxVizRPlot">
      Branded chrome around an R-language plot artifact. R produces
      charts as one of three things — static raster (PNG), static
      vector (SVG), or interactive widget (HTML). This component
      normalizes the editorial frame across all three so research
      reports keep the same chrome regardless of artifact type.
      <br><br>
      <span class="text-sm text-text-muted">
        This component does not run R. Pre-render artifacts via
        <code>ggsave()</code>, <code>htmlwidgets::saveWidget()</code>,
        or your Quarto build, then point <code>src</code> at the result.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">svg · ggplot ggsave</p>
      <h2 class="heading--bold text-xl font-bold">Faceted bar chart</h2>
      <TuxExample class="mt-4" :vue="svgVue">
        <TuxVizRPlot
          kind="svg"
          src="/viz-rplot-grants.svg"
          title="Grant draws by sponsor — FY26 by quarter"
          eyebrow="ggplot2 · facet_wrap"
          ratio="8/5"
          source="R 4.4.1 · ggplot2 3.5.1 · scripts/grants-by-quarter.R"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">api</p>
      <h2 class="heading--bold text-xl font-bold">Three artifact kinds</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div class="card-static p-4">
          <p class="eyebrow">kind="image"</p>
          <p class="text-sm text-text-secondary mt-1">PNG / JPG. Use <code>src2x</code> for retina.</p>
          <pre class="mt-3 text-xs text-text-muted whitespace-pre-wrap">{{ imageVue }}</pre>
        </div>
        <div class="card-static p-4">
          <p class="eyebrow">kind="svg"</p>
          <p class="text-sm text-text-secondary mt-1">Vector. Embedded via <code>&lt;object&gt;</code> so it stays interactive.</p>
          <pre class="mt-3 text-xs text-text-muted whitespace-pre-wrap">{{ svgVue }}</pre>
        </div>
        <div class="card-static p-4">
          <p class="eyebrow">kind="html"</p>
          <p class="text-sm text-text-secondary mt-1">htmlwidget (plotly, leaflet, DT). Sandboxed iframe.</p>
          <pre class="mt-3 text-xs text-text-muted whitespace-pre-wrap">{{ htmlVue }}</pre>
        </div>
      </div>
    </section>
  </div>
</template>
