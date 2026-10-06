<script setup lang="ts">
import pbiCard from "../../../kit/powerbi/pbir/fragments/tti/card-chrome.json?raw";
import tuxSparklineSource from "~/components/TuxSparkline.vue?raw";

useHead({ title: "TuxSparkline · TUX" });

const grants = [62, 64, 61, 68, 71, 74, 73, 78, 82, 84];
const crashes = [142, 138, 135, 131, 128, 124, 119, 117, 115, 112];
const ingest = [4.1, 3.9, 4.4, 4.0, 4.2, 4.1, 3.8, 3.9, 4.0, 4.1, 3.9, 4.0];
const erratic = [10, 14, 9, 18, 12, 22, 14, 25, 18, 26];

const datasetMap = {
  grants: {
    data: grants,
    label: "grants",
    headline: "$84.2M",
    statLabel: "Awarded · FY26",
    units: "$M awarded",
  },
  crashes: {
    data: crashes,
    label: "crashes",
    headline: "112",
    statLabel: "Crash rate · IH-35",
    units: "crashes / 100M VMT",
  },
  ingest: {
    data: ingest,
    label: "ingest",
    headline: "4.0k",
    statLabel: "Ingest · Landscape",
    units: "events/sec",
  },
  erratic: {
    data: erratic,
    label: "erratic",
    headline: "26",
    statLabel: "Anomaly surges",
    units: "surge alerts",
  },
};

const sparklineControls = [
  {
    prop: "dataset",
    label: "Telemetry Series",
    type: "select" as const,
    options: [
      { label: "Grant Awards ($M, 10 quarters)", value: "grants" },
      { label: "Corridor Crash Rate (IH-35, 10 periods)", value: "crashes" },
      { label: "Sensor Ingest Rate (k events/sec)", value: "ingest" },
      { label: "Volatile Sensor Telemetry", value: "erratic" },
    ],
    defaultValue: "grants",
    description: "Sample transportation metric trendline",
  },
  {
    prop: "tone",
    label: "Semantic Tone",
    type: "select" as const,
    options: ["brand", "success", "error", "warning", "neutral"],
    defaultValue: "brand",
    description: "Visual hue mapping for stroke, area wash, and delta chip",
  },
  {
    prop: "showDelta",
    label: "Show Delta Badge",
    type: "boolean" as const,
    defaultValue: true,
    description: "Display percentage change between start and end observations",
  },
  {
    prop: "showArea",
    label: "Show Soft Area Fill",
    type: "boolean" as const,
    defaultValue: true,
    description: "Render translucent area wash beneath the trend stroke",
  },
  {
    prop: "showLastPoint",
    label: "Show Terminal Dot",
    type: "boolean" as const,
    defaultValue: true,
    description: "Render highlighted dot on the final data point",
  },
  {
    prop: "width",
    label: "Width (px)",
    type: "select" as const,
    options: [
      { label: "Compact (96px)", value: 96 },
      { label: "Standard (140px)", value: 140 },
      { label: "Expanded (180px)", value: 180 },
    ],
    defaultValue: 140,
    description: "Rendered SVG width",
  },
  {
    prop: "height",
    label: "Height (px)",
    type: "select" as const,
    options: [
      { label: "Slim (24px)", value: 24 },
      { label: "Standard (36px)", value: 36 },
      { label: "Tall (48px)", value: 48 },
    ],
    defaultValue: 36,
    description: "Rendered SVG height",
  },
];

const sparklinePresets = [
  {
    name: "grant-trajectory",
    label: "Grant Funding Trajectory",
    description: "Quarterly award growth with positive delta indicator",
    icon: "lucide:trending-up",
    values: {
      dataset: "grants",
      tone: "brand",
      showDelta: true,
      showArea: true,
      showLastPoint: true,
      width: 140,
      height: 36,
    },
  },
  {
    name: "vision-zero-safety",
    label: "Vision Zero Crash Decline",
    description: "Downward incident trajectory with success tone",
    icon: "lucide:shield-check",
    values: {
      dataset: "crashes",
      tone: "success",
      showDelta: true,
      showArea: true,
      showLastPoint: true,
      width: 140,
      height: 36,
    },
  },
  {
    name: "sensor-ingest-rate",
    label: "Steady Ingest Telemetry",
    description: "High-density steady streaming sensor telemetry",
    icon: "lucide:activity",
    values: {
      dataset: "ingest",
      tone: "neutral",
      showDelta: false,
      showArea: false,
      showLastPoint: true,
      width: 96,
      height: 24,
    },
  },
  {
    name: "incident-surge-warning",
    label: "Incident Surge Anomaly",
    description: "Volatile anomaly spike with error tone and alert framing",
    icon: "lucide:alert-triangle",
    values: {
      dataset: "erratic",
      tone: "error",
      showDelta: true,
      showArea: true,
      showLastPoint: true,
      width: 140,
      height: 36,
    },
  },
];

const inlineVue = `<tux-sparkline
  :data="grants"
  :width="120"
  :height="32"
  show-delta
  units="$M awarded"
/>`;

const factoidVue = `<div class="card-static p-4">
  <p class="eyebrow">awarded · fy26</p>
  <div class="flex items-end gap-3">
    <span class="text-3xl font-bold">$84.2M</span>
    <tux-sparkline
      :data="grants"
      :width="96"
      :height="28"
      tone="brand"
      show-area
      show-delta
    />
  </div>
</div>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="visualizations" title="TuxSparkline">
      Inline mini trend line. No axes, no legend, no tooltip — the
      point is "what's the shape of this metric over the last N
      periods?" alongside a <code>TuxBigStat</code> or
      <code>TuxFactoid</code>. Native SVG; no chart library.
      <br><br>
      <span class="text-sm text-text-muted">
        For first-class native charts with axes / multiple series /
        confidence bands, see <code>TuxChartLine</code> in
        <NuxtLink to="/design/roadmap" class="link-tti">design/roadmap.md</NuxtLink>
        Priority B.
      </span>
    </TuxPageHeader>

    <!-- Interactive Props & Telemetry Workbench -->
    <section>
      <TuxPlayground
        tag="tux-sparkline"
        component-name="TuxSparkline"
        title="Sparkline KPI & Trend Workbench"
        eyebrow="Interactive Telemetry Lab"
        :controls="sparklineControls"
        :presets="sparklinePresets"
        :source="tuxSparklineSource"
        :powerbi="pbiCard"
        :code-template="(values) => {
          const ds = datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.grants;
          const toneAttr = values.tone !== 'brand' ? `\n  tone=\x22${values.tone}\x22` : '';
          const areaAttr = values.showArea ? '\n  show-area' : '';
          const deltaAttr = values.showDelta ? '\n  show-delta' : '';
          const noLastPoint = !values.showLastPoint ? '\n  :show-last-point=\x22false\x22' : '';
          const wAttr = values.width !== 120 ? `\n  :width=\x22${values.width}\x22` : '';
          const hAttr = values.height !== 32 ? `\n  :height=\x22${values.height}\x22` : '';
          return `<tux-sparkline\n  :data=\x22${ds.label}\x22${wAttr}${hAttr}${toneAttr}${areaAttr}${deltaAttr}${noLastPoint}\n  units=\x22${ds.units}\x22\n/>`;
        }"
      >
        <template #default="{ values }">
          <div class="flex items-center gap-6 p-4 rounded-xl border border-surface-border bg-surface-raised shadow-xs">
            <div>
              <p class="text-xs font-mono uppercase tracking-wider text-text-muted">
                {{ (datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.grants).statLabel }}
              </p>
              <div class="flex items-baseline gap-4 mt-1">
                <span class="text-3xl font-extrabold text-text-primary tracking-tight">
                  {{ (datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.grants).headline }}
                </span>
                <TuxSparkline
                  :data="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.grants).data"
                  :width="Number(values.width)"
                  :height="Number(values.height)"
                  :tone="values.tone"
                  :show-area="values.showArea"
                  :show-delta="values.showDelta"
                  :show-last-point="values.showLastPoint"
                  :units="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.grants).units"
                />
              </div>
            </div>
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Inline trend with delta</h2>
      <TuxExample class="mt-4" :vue="inlineVue" :source="tuxSparklineSource" :powerbi="pbiCard">
        <p class="leading-relaxed">
          Awarded funding has trended up over ten quarters
          <TuxSparkline :data="grants" :width="120" :height="32" show-delta units="$M awarded" />
          driven by the IH-35 corridor renewal and the FHWA work-zone
          classifier grant.
        </p>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">paired with a stat</p>
      <h2 class="heading--bold text-xl font-bold">KPI card composition</h2>
      <TuxExample class="mt-4" :vue="factoidVue" :source="tuxSparklineSource" :powerbi="pbiCard">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="card-static p-4">
            <p class="eyebrow">awarded · fy26</p>
            <div class="flex items-end gap-3 mt-1">
              <span class="text-3xl font-bold">$84.2M</span>
              <TuxSparkline :data="grants" :width="96" :height="28" tone="brand" show-area show-delta />
            </div>
            <p class="mt-1 text-xs text-text-muted">10-quarter trend</p>
          </div>
          <div class="card-static p-4">
            <p class="eyebrow">crash rate · ih-35</p>
            <div class="flex items-end gap-3 mt-1">
              <span class="text-3xl font-bold">112</span>
              <TuxSparkline :data="crashes" :width="96" :height="28" tone="success" show-area show-delta />
            </div>
            <p class="mt-1 text-xs text-text-muted">per 100M VMT · 10-q trend</p>
          </div>
          <div class="card-static p-4">
            <p class="eyebrow">ingest · landscape</p>
            <div class="flex items-end gap-3 mt-1">
              <span class="text-3xl font-bold">4.0</span>
              <TuxSparkline :data="ingest" :width="96" :height="28" tone="neutral" show-delta delta-format="absolute" />
            </div>
            <p class="mt-1 text-xs text-text-muted">k events/sec · 12-h window</p>
          </div>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">tones</p>
      <h2 class="heading--bold text-xl font-bold">Five tones, all theme-aware</h2>
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <div class="card-static p-3 text-center">
          <p class="eyebrow mb-2">brand</p>
          <TuxSparkline :data="grants" :width="120" :height="32" tone="brand" show-area />
        </div>
        <div class="card-static p-3 text-center">
          <p class="eyebrow mb-2">success</p>
          <TuxSparkline :data="grants" :width="120" :height="32" tone="success" show-area />
        </div>
        <div class="card-static p-3 text-center">
          <p class="eyebrow mb-2">error</p>
          <TuxSparkline :data="erratic" :width="120" :height="32" tone="error" show-area />
        </div>
        <div class="card-static p-3 text-center">
          <p class="eyebrow mb-2">warning</p>
          <TuxSparkline :data="erratic" :width="120" :height="32" tone="warning" show-area />
        </div>
        <div class="card-static p-3 text-center">
          <p class="eyebrow mb-2">neutral</p>
          <TuxSparkline :data="ingest" :width="120" :height="32" tone="neutral" show-area />
        </div>
      </div>
    </section>

    <section>
      <p class="eyebrow">accessibility</p>
      <h2 class="heading--bold text-lg font-bold">SR-only summary, auto-derived</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        The SVG carries a computed <code>aria-label</code> and matching
        <code>&lt;title&gt;</code> derived from the data: "Trend: 10
        points, low 61, high 84, last 84 (+35.5% from first)". Pass
        <code>units="$M awarded"</code> to append a units suffix; pass
        <code>aria-summary</code> to override entirely.
      </p>
    </section>
  </div>
</template>
