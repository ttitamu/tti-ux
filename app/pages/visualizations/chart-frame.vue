<script setup lang="ts">
useHead({ title: "TuxChartFrame · TUX" });

const corridorLabels = [
  "IH-35 Austin",
  "IH-610 Houston",
  "US-59 SW Fwy",
  "IH-35E Dallas",
  "IH-10 Katy",
];

const corridorSeries = [
  {
    key: "tti",
    label: "Congestion Index",
    data: [1.84, 1.68, 1.55, 1.48, 1.41],
  },
];

const standardVue = `<TuxChartFrame
  eyebrow="Exhibit 4.02 · TxDOT Project 0-6999"
  title="Corridor Travel Time Index"
  subtitle="Peak congestion index across top 5 urban corridors statewide. Threshold target is 1.45."
  source="Source: TTI Urban Mobility Report 2026, Table 3. TxDOT Project 0-6999."
  notes="Index reflects average peak travel time relative to free-flow conditions."
>
  <TuxChartBar
    :labels="corridorLabels"
    :series="corridorSeries"
    orientation="horizontal"
    unit="index"
  />
</TuxChartFrame>`;

const bareVue = `<TuxChartFrame
  eyebrow="Real-Time Telemetry"
  title="Corridor Flow Ratio"
  bare
  source="Sensor loop 14A · Refreshed 30s ago"
>
  <div class="h-28 flex items-center justify-center border border-dashed border-surface-border rounded text-text-muted text-sm">
    Compact telemetry chart body inside bare frame
  </div>
</TuxChartFrame>`;

const slotFooterVue = `<TuxChartFrame
  eyebrow="Exhibit 8.01"
  title="Freight Corridor Tonnage"
  source="FHWA FAF5 Database · Bureau of Transportation Statistics"
>
  <div class="h-32 flex items-center justify-center bg-surface-sunken rounded text-text-secondary text-sm">
    Primary Visualization Content Area
  </div>

  <template #footer>
    <div class="mt-3 flex items-center justify-between pt-2 border-t border-surface-border text-xs">
      <span class="badge-status">Peer Reviewed</span>
      <div class="flex gap-2">
        <button class="link-tti">Download CSV</button>
        <button class="link-tti">API Query</button>
      </div>
    </div>
  </template>
</TuxChartFrame>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="visualizations" title="TuxChartFrame">
      Editorial wrapper that ties native chart components into the TUX type system.
      Provides an uppercase tracked eyebrow, Oswald display title, 2px maroon signature rule,
      container-queried layout slot, and methodological notes with source citations.
      <br><br>
      <span class="text-sm text-text-muted">
        Use bare charts in dashboard tiles; reach for <code>TuxChartFrame</code> whenever
        a chart represents a numbered exhibit or formal publication figure.
      </span>
    </TuxPageHeader>

    <!-- 01 Standard Editorial Exhibit -->
    <section>
      <p class="eyebrow">editorial exhibit</p>
      <h2 class="heading--bold text-xl font-bold">Standard Numbered Exhibit</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        The default presentation establishes an authoritative publication rhythm with an
        eyebrow tag, Oswald headline, maroon accent rule, and formal source line.
      </p>
      <TuxExample class="mt-4" :vue="standardVue">
        <TuxChartFrame
          eyebrow="Exhibit 4.02 · TxDOT Project 0-6999"
          title="Corridor Travel Time Index"
          subtitle="Peak congestion index across top 5 urban corridors statewide. Threshold target is 1.45."
          source="Source: TTI Urban Mobility Report 2026, Table 3. TxDOT Project 0-6999."
          notes="Index reflects average peak travel time relative to free-flow conditions."
        >
          <TuxChartBar
            :labels="corridorLabels"
            :series="corridorSeries"
            orientation="horizontal"
          />
        </TuxChartFrame>
      </TuxExample>
    </section>

    <!-- 02 Bare Mode -->
    <section>
      <p class="eyebrow">compact variant</p>
      <h2 class="heading--bold text-xl font-bold">Bare Mode for Dashboard Tiles</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Pass <code>:bare="true"</code> to omit the maroon signature rule and streamline the
        typography, optimal for dense operational dashboards and multi-column telemetry grids.
      </p>
      <TuxExample class="mt-4" :vue="bareVue">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TuxChartFrame
            eyebrow="Telemetry Feed 01"
            title="IH-35 Northbound Flow"
            bare
            source="Sensor Loop 14A · Live"
          >
            <div class="p-6 bg-surface-sunken rounded border border-surface-border text-center text-sm text-text-secondary">
              <span class="font-mono text-2xl font-bold text-text-primary block">64.2 mph</span>
              Average Corridor Velocity
            </div>
          </TuxChartFrame>
          <TuxChartFrame
            eyebrow="Telemetry Feed 02"
            title="Loop 1 Southbound Flow"
            bare
            source="Sensor Loop 09B · Live"
          >
            <div class="p-6 bg-surface-sunken rounded border border-surface-border text-center text-sm text-text-secondary">
              <span class="font-mono text-2xl font-bold text-brand-primary block">28.7 mph</span>
              Congestion Incident Detected
            </div>
          </TuxChartFrame>
        </div>
      </TuxExample>
    </section>

    <!-- 03 Custom Footer Slot -->
    <section>
      <p class="eyebrow">slot composition</p>
      <h2 class="heading--bold text-xl font-bold">Footer Slot Composition</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Use the <code>#footer</code> slot to append interactive controls, data export links,
        or governance badges directly below the source citation.
      </p>
      <TuxExample class="mt-4" :vue="slotFooterVue">
        <TuxChartFrame
          eyebrow="Exhibit 8.01"
          title="Freight Corridor Tonnage"
          source="FHWA FAF5 Database · Bureau of Transportation Statistics"
          notes="Annual commercial freight tonnage aggregated at standard metropolitan boundaries."
        >
          <div class="p-8 bg-surface-sunken rounded border border-surface-border text-center text-sm text-text-muted">
            Freight Distribution Density Matrix
          </div>
          <template #footer>
            <div class="mt-3 flex items-center justify-between pt-2 border-t border-surface-border text-xs">
              <span class="px-2 py-0.5 rounded bg-surface-raised border border-surface-border font-medium text-text-secondary">
                Validated Dataset · FY26
              </span>
              <div class="flex gap-3">
                <a href="#export" class="link-tti font-medium">Export CSV</a>
                <a href="#metadata" class="link-tti font-medium">View Metadata</a>
              </div>
            </div>
          </template>
        </TuxChartFrame>
      </TuxExample>
    </section>

    <!-- 04 Props & Slots Documentation -->
    <section>
      <p class="eyebrow">api reference</p>
      <h2 class="heading--bold text-xl font-bold">Props & Slots</h2>
      <div class="mt-4 overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b border-surface-border text-left">
              <th class="py-2 pr-4 font-semibold">Prop / Slot</th>
              <th class="py-2 pr-4 font-semibold">Type</th>
              <th class="py-2 pr-4 font-semibold">Default</th>
              <th class="py-2 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody class="align-top divide-y divide-surface-border">
            <tr>
              <td class="py-2 pr-4 font-mono text-xs">eyebrow</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-secondary">string</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-muted">""</td>
              <td class="py-2 text-text-secondary">Tracked uppercase exhibit label (e.g. "Exhibit 11.01" or "Slide 9").</td>
            </tr>
            <tr>
              <td class="py-2 pr-4 font-mono text-xs">title</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-secondary">string</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-muted">""</td>
              <td class="py-2 text-text-secondary">Display-face title rendered in Oswald typography.</td>
            </tr>
            <tr>
              <td class="py-2 pr-4 font-mono text-xs">subtitle</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-secondary">string</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-muted">""</td>
              <td class="py-2 text-text-secondary">Lede or clarifying context below title, preceding the rule.</td>
            </tr>
            <tr>
              <td class="py-2 pr-4 font-mono text-xs">source</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-secondary">string</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-muted">""</td>
              <td class="py-2 text-text-secondary">Mono uppercase formal source citation rendered in the footer.</td>
            </tr>
            <tr>
              <td class="py-2 pr-4 font-mono text-xs">notes</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-secondary">string</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-muted">""</td>
              <td class="py-2 text-text-secondary">Methodological note preceding the source line.</td>
            </tr>
            <tr>
              <td class="py-2 pr-4 font-mono text-xs">bare</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-secondary">boolean</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-muted">false</td>
              <td class="py-2 text-text-secondary">Omits the maroon signature rule for compact dashboard tile layouts.</td>
            </tr>
            <tr>
              <td class="py-2 pr-4 font-mono text-xs">default</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-secondary">slot</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-muted">—</td>
              <td class="py-2 text-text-secondary">Primary chart body container.</td>
            </tr>
            <tr>
              <td class="py-2 pr-4 font-mono text-xs">footer</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-secondary">slot</td>
              <td class="py-2 pr-4 font-mono text-xs text-text-muted">—</td>
              <td class="py-2 text-text-secondary">Optional slot appended beneath the source and notes lines.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
