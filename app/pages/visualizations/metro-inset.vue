<script setup lang="ts">
useHead({ title: "TuxMetroInset · TUX" });

const fourUpVue = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <TuxMetroInset name="Houston" highway-label="I-45" />
  <TuxMetroInset name="Dallas–Fort Worth" highway-label="I-35E" />
  <TuxMetroInset name="Austin" highway-label="I-35" />
  <TuxMetroInset name="San Antonio" highway-label="I-10" />
</div>`;

const palettesVue = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div class="card-static p-4">
    <p class="eyebrow mb-2">maroon ramp (default)</p>
    <TuxMetroInset name="Austin Metro" highway-label="Loop 1" palette="maroon" />
  </div>
  <div class="card-static p-4">
    <p class="eyebrow mb-2">slate ramp (neutral)</p>
    <TuxMetroInset name="El Paso Metro" highway-label="I-10" palette="slate" />
  </div>
</div>`;

const customGridVue = `<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
  <div class="card-static p-4">
    <p class="eyebrow mb-2">compact (6 × 4)</p>
    <TuxMetroInset name="Bryan-College Station" highway-label="SH 6" :cols="6" :rows="4" :height="160" />
  </div>
  <div class="card-static p-4">
    <p class="eyebrow mb-2">dense (10 × 8)</p>
    <TuxMetroInset name="Houston Outer Ring" highway-label="Beltway 8" :cols="10" :rows="8" :height="260" />
  </div>
  <div class="card-static p-4">
    <p class="eyebrow mb-2">custom seed</p>
    <TuxMetroInset name="Corpus Christi" highway-label="I-37" seed="port-corpus" :height="220" />
  </div>
</div>`;

const frameVue = `<TuxChartFrame
  eyebrow="Exhibit 5.04 · Comparative Insets"
  title="Urban Congestion Heatmaps by Metro"
  subtitle="Synthesized census tract intensity across major Texas metropolitan hubs."
  source="Source: TxDOT GIS Division / TTI Mobility Analysis 2026."
  notes="Each cell represents tract travel delay index. Diagonal line indicates primary interstate trunkline."
>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
    <TuxMetroInset name="Houston" highway-label="I-45" />
    <TuxMetroInset name="Dallas–Fort Worth" highway-label="I-35E" />
    <TuxMetroInset name="Austin" highway-label="I-35" />
    <TuxMetroInset name="San Antonio" highway-label="I-10" />
  </div>
</TuxChartFrame>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="visualizations" title="TuxMetroInset">
      Single-metro neighborhood-grid companion component designed for comparative
      side-by-side analysis (Houston · DFW · Austin · San Antonio). Each cell represents
      an abstracted census tract encoded along a 5-step sequential color ramp, overlaid
      with a dashed diagonal highway trunkline and route marker.
      <br><br>
      <span class="text-sm text-text-muted">
        Sister to <code>TuxChartGeographic</code>. When the question is statewide, use
        the county, district, dot-density, or flow maps; when drilling down into metro-level
        patterns, pair with <code>TuxMetroInset</code>.
      </span>
    </TuxPageHeader>

    <!-- 01 4-Up Metro Grid -->
    <section>
      <p class="eyebrow">canonical presentation</p>
      <h2 class="heading--bold text-xl font-bold">4-Up Texas Metro Grid</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Standard comparative quadrant for the Texas Big Four metropolitan areas.
        Each inset renders responsive SVG cells with an interstate highway badge.
      </p>
      <TuxExample class="mt-4" :vue="fourUpVue">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TuxMetroInset name="Houston" highway-label="I-45" />
          <TuxMetroInset name="Dallas–Fort Worth" highway-label="I-35E" />
          <TuxMetroInset name="Austin" highway-label="I-35" />
          <TuxMetroInset name="San Antonio" highway-label="I-10" />
        </div>
      </TuxExample>
    </section>

    <!-- 02 Sequential Palettes -->
    <section>
      <p class="eyebrow">color ramps</p>
      <h2 class="heading--bold text-xl font-bold">Maroon vs. Slate Palettes</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Choose between the signature Texas A&M maroon sequential ramp (<code>--map-seq-maroon-1..5</code>)
        or the neutral slate sequential ramp (<code>--map-seq-slate-1..5</code>) for secondary exhibits.
      </p>
      <TuxExample class="mt-4" :vue="palettesVue">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="card-static p-4">
            <p class="eyebrow mb-2">maroon ramp (default)</p>
            <TuxMetroInset name="Austin Metro" highway-label="Loop 1" palette="maroon" />
          </div>
          <div class="card-static p-4">
            <p class="eyebrow mb-2">slate ramp (neutral)</p>
            <TuxMetroInset name="El Paso Metro" highway-label="I-10" palette="slate" />
          </div>
        </div>
      </TuxExample>
    </section>

    <!-- 03 Custom Grid Dimensions -->
    <section>
      <p class="eyebrow">configuration</p>
      <h2 class="heading--bold text-xl font-bold">Custom Grid Dimensions & Seeds</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Control grid granularity with <code>:cols</code> and <code>:rows</code>, configure
        height with <code>:height</code>, and generate deterministic pseudo-random heat patterns
        via the <code>seed</code> prop.
      </p>
      <TuxExample class="mt-4" :vue="customGridVue">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="card-static p-4">
            <p class="eyebrow mb-2">compact (6 × 4)</p>
            <TuxMetroInset name="Bryan-College Station" highway-label="SH 6" :cols="6" :rows="4" :height="160" />
          </div>
          <div class="card-static p-4">
            <p class="eyebrow mb-2">dense (10 × 8)</p>
            <TuxMetroInset name="Houston Outer Ring" highway-label="Beltway 8" :cols="10" :rows="8" :height="260" />
          </div>
          <div class="card-static p-4">
            <p class="eyebrow mb-2">custom seed</p>
            <TuxMetroInset name="Corpus Christi" highway-label="I-37" seed="port-corpus" :height="220" />
          </div>
        </div>
      </TuxExample>
    </section>

    <!-- 04 Inside TuxChartFrame -->
    <section>
      <p class="eyebrow">editorial framing</p>
      <h2 class="heading--bold text-xl font-bold">Inside a TuxChartFrame</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Wrap the 4-up grid inside <code>TuxChartFrame</code> to produce publication-ready
        exhibits complete with report numbering, title, and citation.
      </p>
      <TuxExample class="mt-4" :vue="frameVue">
        <TuxChartFrame
          eyebrow="Exhibit 5.04 · Comparative Insets"
          title="Urban Congestion Heatmaps by Metro"
          subtitle="Synthesized census tract intensity across major Texas metropolitan hubs."
          source="Source: TxDOT GIS Division / TTI Mobility Analysis 2026."
          notes="Each cell represents tract travel delay index. Diagonal line indicates primary interstate trunkline."
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            <TuxMetroInset name="Houston" highway-label="I-45" />
            <TuxMetroInset name="Dallas–Fort Worth" highway-label="I-35E" />
            <TuxMetroInset name="Austin" highway-label="I-35" />
            <TuxMetroInset name="San Antonio" highway-label="I-10" />
          </div>
        </TuxChartFrame>
      </TuxExample>
    </section>

    <!-- 05 Props Documentation -->
    <section>
      <p class="eyebrow">api reference</p>
      <h2 class="heading--bold text-xl font-bold">Props</h2>
      <div class="mt-4 overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b border-surface-border text-left">
              <th class="py-2 pr-4 font-semibold">Prop</th>
              <th class="py-2 pr-4 font-semibold">Type</th>
              <th class="py-2 pr-4 font-semibold">Default</th>
              <th class="py-2 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody class="align-top divide-y divide-surface-border">
            <tr>
              <td class="py-2 pr-4 font-mono text-xs">name</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-secondary">string</td>
              <td class="py-2 pr-4 font-mono text-xs text-brand-primary">required</td>
              <td class="py-2 text-text-secondary">Metropolitan area label displayed in bold tracked uppercase above the inset.</td>
            </tr>
            <tr>
              <td class="py-2 pr-4 font-mono text-xs">highwayLabel</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-secondary">string</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-muted">""</td>
              <td class="py-2 text-text-secondary">Label placed on the maroon badge at the highway midpoint (e.g. "I-35").</td>
            </tr>
            <tr>
              <td class="py-2 pr-4 font-mono text-xs">height</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-secondary">number</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-muted">220</td>
              <td class="py-2 text-text-secondary">SVG viewport height in pixels.</td>
            </tr>
            <tr>
              <td class="py-2 pr-4 font-mono text-xs">palette</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-secondary">"maroon" | "slate"</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-muted">"maroon"</td>
              <td class="py-2 text-text-secondary">5-step sequential color ramp token collection.</td>
            </tr>
            <tr>
              <td class="py-2 pr-4 font-mono text-xs">seed</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-secondary">string</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-muted">""</td>
              <td class="py-2 text-text-secondary">Custom string seed for deterministic pseudorandom cell values (defaults to name).</td>
            </tr>
            <tr>
              <td class="py-2 pr-4 font-mono text-xs">cols</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-secondary">number</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-muted">8</td>
              <td class="py-2 text-text-secondary">Number of horizontal cell columns across the tract grid.</td>
            </tr>
            <tr>
              <td class="py-2 pr-4 font-mono text-xs">rows</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-secondary">number</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-muted">6</td>
              <td class="py-2 text-text-secondary">Number of vertical cell rows down the tract grid.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
