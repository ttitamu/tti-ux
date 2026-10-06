<script setup lang="ts">
import tuxVizEmbedSource from "~/components/TuxVizEmbed.vue?raw";

useHead({ title: "TuxVizEmbed · TUX" });

const embedControls = [
  {
    prop: "provider",
    label: "BI & Analytics Provider",
    type: "select" as const,
    options: [
      { label: "Tableau Public / Server", value: "tableau" },
      { label: "Microsoft Power BI", value: "powerbi" },
      { label: "Apache Superset", value: "superset" },
      { label: "Grafana Telemetry", value: "grafana" },
      { label: "Generic External Dashboard", value: "generic" },
    ],
    defaultValue: "powerbi",
    description: "Third-party platform provider framing",
  },
  {
    prop: "title",
    label: "Dashboard Title",
    type: "text" as const,
    defaultValue: "Sponsored Research · FY26 Spend Overview",
    description: "Title displayed above embedded surface",
  },
  {
    prop: "eyebrow",
    label: "Eyebrow Tag",
    type: "text" as const,
    defaultValue: "Power BI · Embed",
    description: "Tracked category tag above title",
  },
  {
    prop: "ratio",
    label: "Aspect Ratio",
    type: "select" as const,
    options: ["16/9", "16/10", "4/3", "1/1"],
    defaultValue: "16/10",
    description: "Aspect ratio constraining the embed container",
  },
];

const embedPresets = [
  {
    name: "powerbi-research",
    label: "Power BI Research Spend",
    description: "Institutional Power BI dashboard embed with 16:10 aspect ratio",
    icon: "lucide:pie-chart",
    values: {
      provider: "powerbi",
      title: "Sponsored Research · FY26 Spend Overview",
      eyebrow: "Power BI · Embed",
      ratio: "16/10",
    },
  },
  {
    name: "tableau-crash",
    label: "Tableau Corridor Safety",
    description: "Tableau Public interactive crash rate exploration",
    icon: "lucide:bar-chart-3",
    values: {
      provider: "tableau",
      title: "Crash Report Rates · 2024 · TTI Corridor Study",
      eyebrow: "Tableau Public",
      ratio: "16/10",
    },
  },
  {
    name: "grafana-ingest",
    label: "Grafana Sensor Operations",
    description: "Wide 16:9 kiosk operational telemetry monitoring",
    icon: "lucide:activity",
    values: {
      provider: "grafana",
      title: "Landscape Ingestion · Last 24h",
      eyebrow: "Grafana Operations",
      ratio: "16/9",
    },
  },
];

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
  title="Landscape ingestion · last 24h"
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

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-viz-embed"
        component-name="TuxVizEmbed"
        title="BI Embed Workbench"
        eyebrow="Interactive Analytics Embed Lab"
        :controls="embedControls"
        :presets="embedPresets"
        :source="tuxVizEmbedSource"
        :code-template="(values) => {
          const poster = values.provider === 'tableau' ? '/viz-poster-tableau.svg' :
                         values.provider === 'grafana' ? '/viz-poster-grafana.svg' :
                         '/viz-poster-powerbi.svg';
          return `<tux-viz-embed\n  provider=\x22${values.provider}\x22\n  src=\x22https://${values.provider}.example.edu/view?id=123\x22\n  poster-src=\x22${poster}\x22\n  title=\x22${values.title}\x22\n  eyebrow=\x22${values.eyebrow}\x22\n  ratio=\x22${values.ratio}\x22\n/>`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full max-w-2xl">
            <TuxVizEmbed
              :provider="values.provider"
              :src="values.provider === 'tableau' ? 'https://public.tableau.com/views/demo' :
                    values.provider === 'grafana' ? 'https://grafana.example.org/d/abc' :
                    'https://app.powerbi.com/view?r=demo'"
              :poster-src="values.provider === 'tableau' ? '/viz-poster-tableau.svg' :
                           values.provider === 'grafana' ? '/viz-poster-grafana.svg' :
                           '/viz-poster-powerbi.svg'"
              :title="values.title"
              :eyebrow="values.eyebrow"
              :ratio="values.ratio"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">tableau</p>
      <h2 class="heading--bold text-xl font-bold">Crash-rate dashboard</h2>
      <TuxExample class="mt-4" :vue="tableauVue" :source="tuxVizEmbedSource">
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
      <TuxExample class="mt-4" :vue="powerbiVue" :source="tuxVizEmbedSource">
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
      <h2 class="heading--bold text-xl font-bold">Landscape ingestion dashboard</h2>
      <TuxExample class="mt-4" :vue="grafanaVue" :source="tuxVizEmbedSource">
        <TuxVizEmbed
          provider="grafana"
          src="https://grafana.example.org/d/abc/dashboard?kiosk=tv"
          poster-src="/viz-poster-grafana.svg"
          title="Landscape ingestion · last 24h"
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
