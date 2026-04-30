<script setup lang="ts">
useHead({ title: "TuxVizEmbed · Visualizations · TUX" });

const tableauVue = `<tux-viz-embed
  provider="tableau"
  src="https://public.tableau.com/views/your-viz/Sheet1?:embed=y"
  poster-src="/viz-poster-tableau.svg"
  title="Crash report rates · 2024 · TTI corridor study"
  eyebrow="tableau public"
  ratio="16/10"
/>`;

const powerbiVue = `<tux-viz-embed
  provider="powerbi"
  src="https://app.powerbi.com/view?r=eyJrIjoiYWJjMTIz..."
  poster-src="/viz-poster-powerbi.svg"
  title="Sponsored research · FY26 spend overview"
  eyebrow="power bi · embed"
  ratio="16/10"
/>`;

const grafanaVue = `<tux-viz-embed
  provider="grafana"
  src="https://grafana.example.org/d/abc/dashboard?kiosk=tv"
  poster-src="/viz-poster-grafana.svg"
  title="PECAN ingestion · last 24h"
  eyebrow="grafana"
  ratio="16/9"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="visualizations" title="TuxVizEmbed">
      Branded chrome around a third-party visualization iframe. Wraps
      Tableau · Power BI · Apache Superset · Grafana · any URL.
      Provider chip + open-in-new + sandbox + loading/error states are
      built in.
      <br><br>
      <span class="text-sm text-text-muted">
        Demos use <code>poster-src</code> (a static screenshot) instead
        of a live iframe — most institutional BI tenants block third-
        party embedding without auth. In production, drop the
        <code>poster-src</code> prop and provide your tenant URL.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">tableau</p>
      <h2 class="heading--bold text-xl font-bold">Crash-rate dashboard</h2>
      <TuxExample class="mt-4" :vue="tableauVue">
        <TuxVizEmbed
          provider="tableau"
          src="https://public.tableau.com/views/your-viz/Sheet1?:embed=y"
          poster-src="/viz-poster-tableau.svg"
          title="Crash report rates · 2024 · TTI corridor study"
          eyebrow="tableau public"
          ratio="16/10"
        >
          <template #caption>
            Static poster used in the style guide. In production, replace
            <code>poster-src</code> with your tenant URL plus
            <code>?:embed=y&amp;:display_count=n</code>.
          </template>
        </TuxVizEmbed>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">power bi</p>
      <h2 class="heading--bold text-xl font-bold">Executive overview</h2>
      <TuxExample class="mt-4" :vue="powerbiVue">
        <TuxVizEmbed
          provider="powerbi"
          src="https://app.powerbi.com/view?r=eyJrIjoiYWJjMTIz"
          poster-src="/viz-poster-powerbi.svg"
          title="Sponsored research · FY26 spend overview"
          eyebrow="power bi · embed"
          ratio="16/10"
        >
          <template #caption>
            For Power BI Embedded with row-level security, use the
            JS embedding SDK and pass the access token rather than
            an iframe URL — TuxVizEmbed is the iframe-only path.
          </template>
        </TuxVizEmbed>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">grafana</p>
      <h2 class="heading--bold text-xl font-bold">PECAN ingestion dashboard</h2>
      <TuxExample class="mt-4" :vue="grafanaVue">
        <TuxVizEmbed
          provider="grafana"
          src="https://grafana.example.org/d/abc/dashboard?kiosk=tv"
          poster-src="/viz-poster-grafana.svg"
          title="PECAN ingestion · last 24h"
          eyebrow="grafana"
          ratio="16/9"
        >
          <template #caption>
            Grafana's <code>kiosk=tv</code> URL parameter strips the
            sidebar and top nav so the dashboard fills the iframe.
          </template>
        </TuxVizEmbed>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">notes</p>
      <h2 class="heading--bold text-lg font-bold">Provider posture defaults</h2>
      <ul class="mt-2 text-text-secondary leading-relaxed list-disc pl-5 space-y-1">
        <li>All providers default to <code>strict-origin-when-cross-origin</code> referrer policy.</li>
        <li>Tableau · Power BI · Superset get <code>allow-scripts allow-same-origin allow-popups allow-forms</code>.</li>
        <li>Grafana drops <code>allow-forms</code>: kiosk dashboards don't need it.</li>
        <li>Override the sandbox via the <code>sandbox</code> prop if your tenant requires different posture.</li>
        <li>Set <code>poster-src</code> to render a static image instead of the iframe — useful for style-guide demos and air-gapped previews.</li>
      </ul>
    </section>
  </div>
</template>
