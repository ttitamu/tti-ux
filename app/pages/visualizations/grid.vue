<script setup lang="ts">
useHead({ title: "TuxVizGrid · Visualizations · TUX" });

const twoUpVue = `<tux-viz-grid
  cols="2"
  eyebrow="executive overview"
  title="Sponsored research \u00b7 FY26 Q1"
  dek="Two complementary views of the same quarter \u2014 a Tableau
       crash-rate dashboard alongside a Power BI spend overview."
>
  <tux-viz-embed
    provider="tableau"
    src="https://public.tableau.com/views/your-viz/Sheet1?:embed=y"
    poster-src="/viz-poster-tableau.svg"
    title="Crash rates \u00b7 corridor program"
    eyebrow="tableau"
    ratio="16/10"
  />
  <tux-viz-embed
    provider="powerbi"
    src="https://app.powerbi.com/view?r=eyJrIjoi..."
    poster-src="/viz-poster-powerbi.svg"
    title="Sponsored research spend"
    eyebrow="power bi"
    ratio="16/10"
  />

  <template #footer>
    Source: TxDOT CRIS-2 \u00b7 TTI sponsored-research ledger
  </template>
</tux-viz-grid>`;

const threeUpVue = `<tux-viz-grid
  cols="3"
  eyebrow="ingest health"
  title="PECAN \u00b7 last 24h across all stages"
>
  <tux-viz-embed provider="grafana" src="\u2026" title="Producer" \u2026 />
  <tux-viz-embed provider="grafana" src="\u2026" title="Pipeline" \u2026 />
  <tux-viz-embed provider="grafana" src="\u2026" title="Storage"  \u2026 />
</tux-viz-grid>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="visualizations" title="TuxVizGrid">
      Small-multiples layout primitive. Lays out 2-, 3-, or 4-up
      panes of <code>TuxVizEmbed</code> / <code>TuxVizRPlot</code>
      (or any viz-shaped thing) with a shared editorial header and
      consistent spacing. Container-queried — collapses to fewer
      columns on narrow widths.
      <br><br>
      <span class="text-sm text-text-muted">
        For a single embed, drop <code>TuxVizEmbed</code> directly —
        wrapping one pane in a grid implies "these belong together"
        which is the wrong signal.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">two-up</p>
      <h2 class="heading--bold text-xl font-bold">Tableau + Power BI side-by-side</h2>
      <TuxExample class="mt-4" :vue="twoUpVue">
        <TuxVizGrid
          :cols="2"
          eyebrow="executive overview"
          title="Sponsored research · FY26 Q1"
          dek="Two complementary views of the same quarter — a Tableau crash-rate dashboard alongside a Power BI spend overview."
        >
          <TuxVizEmbed
            provider="tableau"
            src="https://public.tableau.com/views/your-viz/Sheet1?:embed=y"
            poster-src="/viz-poster-tableau.svg"
            title="Crash rates · corridor program"
            eyebrow="tableau"
            ratio="16/10"
          />
          <TuxVizEmbed
            provider="powerbi"
            src="https://app.powerbi.com/view?r=eyJrIjoi"
            poster-src="/viz-poster-powerbi.svg"
            title="Sponsored research spend"
            eyebrow="power bi"
            ratio="16/10"
          />

          <template #footer>
            Source: TxDOT CRIS-2 · TTI sponsored-research ledger
          </template>
        </TuxVizGrid>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">three-up</p>
      <h2 class="heading--bold text-xl font-bold">Grafana stage-by-stage</h2>
      <TuxExample class="mt-4" :vue="threeUpVue">
        <TuxVizGrid
          :cols="3"
          eyebrow="ingest health"
          title="PECAN · last 24h across all stages"
        >
          <TuxVizEmbed
            provider="grafana"
            src="https://grafana.example.org/d/abc/producer?kiosk=tv"
            poster-src="/viz-poster-grafana.svg"
            title="Producer"
            eyebrow="stage 1"
            ratio="4/3"
          />
          <TuxVizEmbed
            provider="grafana"
            src="https://grafana.example.org/d/abc/pipeline?kiosk=tv"
            poster-src="/viz-poster-grafana.svg"
            title="Pipeline"
            eyebrow="stage 2"
            ratio="4/3"
          />
          <TuxVizEmbed
            provider="grafana"
            src="https://grafana.example.org/d/abc/storage?kiosk=tv"
            poster-src="/viz-poster-grafana.svg"
            title="Storage"
            eyebrow="stage 3"
            ratio="4/3"
          />
        </TuxVizGrid>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">notes</p>
      <h2 class="heading--bold text-lg font-bold">Layout rules</h2>
      <ul class="mt-2 text-text-secondary leading-relaxed list-disc pl-5 space-y-1">
        <li>Below ~32rem container width, every variant collapses to a single column — viz chrome stays legible.</li>
        <li>Between ~32rem and ~56rem, both 3-up and 4-up render as 2-up. Above ~56rem they unfold to their full column count.</li>
        <li>Pass aspect ratios on the panes (<code>ratio="16/10"</code>, <code>ratio="4/3"</code>) — the grid doesn't override them.</li>
        <li>The footer slot is for source / data-cutoff / caveat copy. Mono font, muted, hairline rule above.</li>
      </ul>
    </section>
  </div>
</template>
