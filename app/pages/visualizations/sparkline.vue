<script setup lang="ts">
useHead({ title: "TuxSparkline · Visualizations · TUX" });

const grants = [62, 64, 61, 68, 71, 74, 73, 78, 82, 84];
const crashes = [142, 138, 135, 131, 128, 124, 119, 117, 115, 112];
const ingest = [4.1, 3.9, 4.4, 4.0, 4.2, 4.1, 3.8, 3.9, 4.0, 4.1, 3.9, 4.0];
const erratic = [10, 14, 9, 18, 12, 22, 14, 25, 18, 26];

const inlineVue = `<tux-sparkline
  :data="[62, 64, 61, 68, 71, 74, 73, 78, 82, 84]"
  :width="120"
  :height="32"
  show-delta
  units="$M awarded"
/>`;

const factoidVue = `<div class="card-static p-4">
  <p class="eyebrow">awarded \u00b7 fy26</p>
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

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Inline trend with delta</h2>
      <TuxExample class="mt-4" :vue="inlineVue">
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
      <TuxExample class="mt-4" :vue="factoidVue">
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
            <p class="eyebrow">ingest · pecan</p>
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
