<script setup lang="ts">
import tuxChartSunburstSource from "~/components/TuxChartSunburst.vue?raw";

useHead({ title: "TuxChartSunburst · TUX" });

const programs = [
  {
    label: "Capacity",
    children: [
      { label: "New mainlanes",       value: 480 },
      { label: "Frontage rebuild",    value: 220 },
      { label: "HOV / managed lanes", value: 180 },
    ],
  },
  {
    label: "Preservation",
    children: [
      { label: "Pavement",   value: 320 },
      { label: "Bridge",     value: 240 },
      { label: "Drainage",   value: 110 },
    ],
  },
  {
    label: "Safety",
    children: [
      { label: "Intersection",  value: 175 },
      { label: "Roadside",      value: 95 },
      { label: "Pedestrian",    value: 60 },
    ],
  },
  {
    label: "Operations",
    children: [
      { label: "ITS",          value: 90 },
      { label: "Signals",      value: 60 },
      { label: "Incident mgmt", value: 50 },
    ],
  },
];

const portfolio = [
  {
    label: "Safety",
    children: [
      { label: "Roadway",      value: 28 },
      { label: "Vehicle",      value: 14 },
      { label: "Driver / VRU", value: 10 },
    ],
  },
  {
    label: "Mobility",
    children: [
      { label: "Connected vehicle", value: 22 },
      { label: "Freight",           value: 18 },
      { label: "Transit",           value: 12 },
    ],
  },
  {
    label: "Infrastructure",
    children: [
      { label: "Pavement",  value: 16 },
      { label: "Bridge",    value: 10 },
      { label: "Materials", value:  6 },
    ],
  },
];

const fleetTelemetry = [
  {
    label: "Autonomous / CAV",
    children: [
      { label: "LiDAR clusters", value: 145 },
      { label: "DSRC V2X beacons", value: 92 },
      { label: "Edge CV processors", value: 68 },
    ],
  },
  {
    label: "Connected Fleet",
    children: [
      { label: "TxDOT Maintenance", value: 210 },
      { label: "Incident response trucks", value: 115 },
      { label: "Automated attenuators", value: 45 },
    ],
  },
  {
    label: "Electrification",
    children: [
      { label: "Fast DC chargers", value: 80 },
      { label: "Depot telematics", value: 55 },
      { label: "Grid balancing nodes", value: 30 },
    ],
  },
];

const datasetMap = {
  programs: {
    data: programs,
    label: "programs",
    formatTotal: (t: number) => `$${t.toLocaleString()}M`,
    formatValue: (v: number) => `$${v}M`,
  },
  portfolio: {
    data: portfolio,
    label: "portfolio",
    formatTotal: (t: number) => `$${t}M`,
    formatValue: (v: number) => `$${v}M`,
  },
  fleetTelemetry: {
    data: fleetTelemetry,
    label: "fleetTelemetry",
    formatTotal: (t: number) => `${t.toLocaleString()} units`,
    formatValue: (v: number) => `${v} units`,
  },
};

const sunburstControls = [
  {
    prop: "dataset",
    label: "Telemetry Dataset",
    type: "select" as const,
    options: [
      { label: "Capital Program MIP ($2,080M)", value: "programs" },
      { label: "Research Portfolio ($104M)", value: "portfolio" },
      { label: "Connected Fleet Sensors (840 units)", value: "fleetTelemetry" },
    ],
    defaultValue: "programs",
    description: "Hierarchical portfolio or sensor telemetry tree",
  },
  {
    prop: "size",
    label: "Diameter Size",
    type: "select" as const,
    options: [
      { label: "Compact (240px)", value: 240 },
      { label: "Standard (320px)", value: 320 },
      { label: "Expanded (380px)", value: 380 },
    ],
    defaultValue: 320,
    description: "Rendered SVG diameter in CSS pixels",
  },
  {
    prop: "showLegend",
    label: "Show Breakdown Legend",
    type: "boolean" as const,
    defaultValue: true,
    description: "Display right-side category breakdown table with shares",
  },
  {
    prop: "centerLabel",
    label: "Center Label",
    type: "text" as const,
    defaultValue: "Total",
    description: "Uppercase label above the central display total",
  },
];

const sunburstPresets = [
  {
    name: "mip-capital-portfolio",
    label: "MIP Capital Portfolio",
    description: "Two-ring investment breakdown with detailed side breakdown legend",
    icon: "lucide:pie-chart",
    values: {
      dataset: "programs",
      size: 320,
      showLegend: true,
      centerLabel: "Total",
    },
  },
  {
    name: "research-tight",
    label: "Research Mix (Tight Tile)",
    description: "Legendless dense radial layout for dashboard KPI tiles",
    icon: "lucide:layout-grid",
    values: {
      dataset: "portfolio",
      size: 240,
      showLegend: false,
      centerLabel: "FY25",
    },
  },
  {
    name: "connected-fleet-telemetry",
    label: "Connected Fleet Telemetry",
    description: "Autonomous sensor hierarchy across CAV, operations fleet, and EV nodes",
    icon: "lucide:activity",
    values: {
      dataset: "fleetTelemetry",
      size: 380,
      showLegend: true,
      centerLabel: "Fleet",
    },
  },
];

const flagshipVue = `<tux-chart-frame
  eyebrow="Exhibit 12.01"
  title="MIP 2025 program portfolio · $2.08B"
  source="TTI Mobility Investment Priorities · 2025"
>
  <tux-chart-sunburst
    :data="programs"
    :size="320"
    center-label="Total"
    :format-total="(t) => '$' + t.toLocaleString() + 'M'"
  />
</tux-chart-frame>`;

const bareVue = `<div class="cs-demo__bare">
  <tux-chart-sunburst
    :data="portfolio"
    :size="240"
    :show-legend="false"
    :format-total="(t) => '$' + t + 'M'"
  />
  <div>
    <p class="eyebrow">research portfolio · FY 2025</p>
    <p>
      Hover any arc for the exact label, value, and share. Pair this density
      with a stat row beneath to call out headline category totals.
    </p>
  </div>
</div>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="data viz · hierarchical" title="TuxChartSunburst">
      Two-ring radial breakdown — inner ring is top-level groups,
      outer ring is children with stepped opacity. Use when the
      audience needs to feel the radial structure of a program
      (budget, portfolio, capacity inventory).
      <br><br>
      <span class="text-sm text-text-muted">
        Sunburst is a sister to <code>TuxTreemap</code>. Treemap
        is better when comparative size of children matters
        (rectangles encode area, easier to read for tight ratios).
        Sunburst is better when the radial structure is the story.
        For ranked lists, prefer <code>TuxChartBar</code> — bars
        are far easier to read than any hierarchical chart. Two
        rings is the maximum that stays readable.
      </span>
    </TuxPageHeader>

    <!-- Interactive Props & Telemetry Workbench -->
    <section>
      <TuxPlayground
        tag="tux-chart-sunburst"
        component-name="TuxChartSunburst"
        title="Sunburst & Hierarchical Radial Workbench"
        eyebrow="Interactive Telemetry Lab"
        :controls="sunburstControls"
        :presets="sunburstPresets"
        :source="tuxChartSunburstSource"
        :code-template="(values) => {
          const ds = datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.programs;
          const sizeAttr = values.size !== 320 ? `\n  :size=\x22${values.size}\x22` : '';
          const legendAttr = !values.showLegend ? '\n  :show-legend=\x22false\x22' : '';
          const centerAttr = values.centerLabel !== 'Total' ? `\n  center-label=\x22${values.centerLabel}\x22` : '';
          return `<tux-chart-sunburst\n  :data=\x22${ds.label}\x22${sizeAttr}${legendAttr}${centerAttr}\n/>`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full flex justify-center py-4">
            <TuxChartSunburst
              :data="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.programs).data"
              :size="Number(values.size)"
              :show-legend="values.showLegend"
              :center-label="values.centerLabel"
              :format-total="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.programs).formatTotal"
              :format-value="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.programs).formatValue"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">flagship · two-ring with legend</p>
      <h2 class="heading--bold text-xl font-bold">Program portfolio</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Inner ring: the four MIP investment categories. Outer
        ring: each category's spend mix. Center carries the
        program total in display-grade tabular numerals. The
        right-side table lists every child with its share — so
        the precise number is always recoverable, not estimated
        off arc length.
      </p>
      <TuxExample class="mt-4" :vue="flagshipVue" :source="tuxChartSunburstSource">
        <TuxChartFrame
          eyebrow="Exhibit 12.01"
          title="MIP 2025 program portfolio · $2.08B"
          source="TTI Mobility Investment Priorities · 2025"
        >
          <TuxChartSunburst
            :data="programs"
            :size="320"
            center-label="Total"
            :format-total="t => `$${t.toLocaleString()}M`"
          />
        </TuxChartFrame>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">bare · no legend</p>
      <h2 class="heading--bold text-xl font-bold">Tight-layout variant</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        For dashboard tiles or composed exhibits where the legend
        would crowd the surface, set <code>:show-legend="false"</code>.
        Each arc carries an SVG <code>&lt;title&gt;</code> tooltip
        with label · value · share, so the data is still
        accessible — just not laid out beside the chart.
      </p>
      <TuxExample class="mt-4" :vue="bareVue" :source="tuxChartSunburstSource">
        <div class="cs-demo__bare">
          <TuxChartSunburst
            :data="portfolio"
            :size="240"
            :show-legend="false"
            :format-total="t => `$${t}M`"
          />
          <div>
            <p class="eyebrow">research portfolio · FY 2025</p>
            <p>
              Hover any arc for the exact label, value, and share.
              Pair this density with a stat row beneath to call out
              the headline category totals — sunburst is great for
              "where does the money go?" but the precise totals
              belong on a stat row.
            </p>
          </div>
        </div>
      </TuxExample>
    </section>
  </div>
</template>

<style scoped>
.cs-demo__bare {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: center;
}
.cs-demo__bare aside {
  font-size: 0.86rem;
  color: var(--text-secondary);
  line-height: 1.6;
}
.cs-demo__bare aside p:not(:first-child) { margin-top: 0.625rem; }
@container (max-width: 38rem) {
  .cs-demo__bare { grid-template-columns: 1fr; }
}
</style>
