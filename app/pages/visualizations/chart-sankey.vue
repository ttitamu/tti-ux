<script setup lang="ts">
import tuxChartSankeySource from "~/components/TuxChartSankey.vue?raw";

useHead({ title: "TuxChartSankey · TUX" });

const commuterModeNodes = [
  { id: "orig-north", label: "North Suburbs" },
  { id: "orig-west", label: "West Corridor" },
  { id: "orig-south", label: "South Metro" },
  { id: "hub-parkride", label: "Park-and-Ride" },
  { id: "hub-arterial", label: "Managed Lanes" },
  { id: "hub-mainlane", label: "General Mainlanes" },
  { id: "dest-brt", label: "Express BRT" },
  { id: "dest-hov", label: "Carpool / HOV" },
  { id: "dest-sov", label: "Single-Occupant" },
];

const commuterModeLinks = [
  { source: "orig-north", target: "hub-parkride", value: 18 },
  { source: "orig-north", target: "hub-arterial", value: 24 },
  { source: "orig-north", target: "hub-mainlane", value: 32 },
  { source: "orig-west", target: "hub-parkride", value: 14 },
  { source: "orig-west", target: "hub-arterial", value: 19 },
  { source: "orig-west", target: "hub-mainlane", value: 28 },
  { source: "orig-south", target: "hub-arterial", value: 16 },
  { source: "orig-south", target: "hub-mainlane", value: 25 },
  { source: "hub-parkride", target: "dest-brt", value: 26 },
  { source: "hub-parkride", target: "dest-hov", value: 6 },
  { source: "hub-arterial", target: "dest-brt", value: 14 },
  { source: "hub-arterial", target: "dest-hov", value: 39 },
  { source: "hub-arterial", target: "dest-sov", value: 6 },
  { source: "hub-mainlane", target: "dest-hov", value: 12 },
  { source: "hub-mainlane", target: "dest-sov", value: 73 },
];

const freightCorridorNodes = [
  { id: "port-gulf", label: "Gulf Maritime Ports" },
  { id: "port-border", label: "Inland Border Crossings" },
  { id: "cor-ih45", label: "IH-45 Freight Spine" },
  { id: "cor-ih35", label: "IH-35 Trade Corridor" },
  { id: "cor-ih10", label: "IH-10 East-West Trunk" },
  { id: "term-inland", label: "Inland Intermodal Hubs" },
  { id: "term-regional", label: "Regional Distribution" },
  { id: "term-interstate", label: "Out-of-State Export" },
];

const freightCorridorLinks = [
  { source: "port-gulf", target: "cor-ih45", value: 42 },
  { source: "port-gulf", target: "cor-ih10", value: 31 },
  { source: "port-border", target: "cor-ih35", value: 54 },
  { source: "port-border", target: "cor-ih10", value: 22 },
  { source: "cor-ih45", target: "term-inland", value: 28 },
  { source: "cor-ih45", target: "term-interstate", value: 14 },
  { source: "cor-ih35", target: "term-inland", value: 24 },
  { source: "cor-ih35", target: "term-regional", value: 18 },
  { source: "cor-ih35", target: "term-interstate", value: 12 },
  { source: "cor-ih10", target: "term-regional", value: 29 },
  { source: "cor-ih10", target: "term-interstate", value: 24 },
];

const datasetMap = {
  commuter: {
    nodes: commuterModeNodes,
    links: commuterModeLinks,
    codeNodes: "commuterModeNodes",
    codeLinks: "commuterModeLinks",
    units: "k trips/day",
  },
  freight: {
    nodes: freightCorridorNodes,
    links: freightCorridorLinks,
    codeNodes: "freightCorridorNodes",
    codeLinks: "freightCorridorLinks",
    units: "M tons/yr",
  },
};

const sankeyControls = [
  {
    prop: "dataset",
    label: "Flow Network Dataset",
    type: "select" as const,
    options: [
      { label: "Origin-Destination Commuter Mode Shift", value: "commuter" },
      { label: "Multi-Stage Freight Corridor Tonnage", value: "freight" },
    ],
    defaultValue: "commuter",
    description: "Multi-stage directed acyclic network",
  },
  {
    prop: "palette",
    label: "Color Palette",
    type: "select" as const,
    options: [
      { label: "Brand Categorical (--chart-1..8)", value: "brand" },
      { label: "Okabe-Ito Universal CVD (--chart-cvd-1..8)", value: "cvd" },
    ],
    defaultValue: "brand",
    description: "Institutional brand ramp or barrier-free CVD ramp",
  },
  {
    prop: "height",
    label: "Canvas Height",
    type: "select" as const,
    options: [
      { label: "Compact (280px)", value: 280 },
      { label: "Standard (340px)", value: 340 },
      { label: "Tall (420px)", value: 420 },
    ],
    defaultValue: 340,
    description: "SVG render height in CSS pixels",
  },
  {
    prop: "tooltip",
    label: "Interactive Tooltip",
    type: "boolean" as const,
    defaultValue: true,
    description: "Enable pointer & keyboard roving-cursor flow card",
  },
];

const sankeyPresets = [
  {
    name: "od-mode-shift",
    label: "O-D Commuter Mode Shift",
    description: "Three-stage suburban origin to corridor facility to travel mode split",
    icon: "lucide:git-fork",
    values: {
      dataset: "commuter",
      palette: "brand",
      height: 340,
      tooltip: true,
    },
  },
  {
    name: "freight-cvd",
    label: "Freight Tonnage (CVD Safe)",
    description: "Port and border freight flows across trunk corridors using Okabe-Ito palette",
    icon: "lucide:eye",
    values: {
      dataset: "freight",
      palette: "cvd",
      height: 340,
      tooltip: true,
    },
  },
  {
    name: "print-static",
    label: "Print Exhibit (Static)",
    description: "Tooltip-disabled high-legibility layout for PDF and print reports",
    icon: "lucide:printer",
    values: {
      dataset: "freight",
      palette: "brand",
      height: 280,
      tooltip: false,
    },
  },
];

const flagshipVue = `<tux-chart-frame
  eyebrow="Exhibit 14.01"
  title="AM peak origin-to-corridor mode allocation"
  source="Source: Regional Travel Demand Model · 2026"
>
  <tux-chart-sankey
    :nodes="commuterModeNodes"
    :links="commuterModeLinks"
    units="k trips/day"
  />
</tux-chart-frame>`;

const freightVue = `<tux-chart-sankey
  :nodes="freightCorridorNodes"
  :links="freightCorridorLinks"
  palette="cvd"
  units="M tons/yr"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="data viz · flow & network" title="TuxChartSankey">
      Native SVG multi-stage directed acyclic flow diagram. Automatically
      infers topological column depth from <code>source → target</code>
      edges when explicit node stages are omitted, scales node bars
      proportionally to throughput, and connects ports with smooth
      cubic-Bezier ribbons.
      <br><br>
      <span class="text-sm text-text-muted">
        Focus the chart with <code>Tab</code> and step across flow
        ribbons with <code>ArrowLeft</code> / <code>ArrowRight</code>.
        For geographical desire lines over a basemap, pair with
        <code>TuxChartGeoFlow</code>; when stage-by-stage conservation
        and split ratios are the primary story, use
        <code>TuxChartSankey</code>.
      </span>
    </TuxPageHeader>

    <section>
      <TuxPlayground
        tag="tux-chart-sankey"
        component-name="TuxChartSankey"
        title="Multi-Stage Corridor Flow Workbench"
        eyebrow="Interactive Telemetry Lab"
        :controls="sankeyControls"
        :presets="sankeyPresets"
        :source="tuxChartSankeySource"
        :code-template="(values) => {
          const ds = datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.commuter;
          const palAttr = values.palette === 'cvd' ? '\n  palette=\x22cvd\x22' : '';
          const hAttr = values.height !== 340 ? `\n  :height=\x22${values.height}\x22` : '';
          const tipAttr = !values.tooltip ? '\n  :tooltip=\x22false\x22' : '';
          return `<tux-chart-sankey\n  :nodes=\x22${ds.codeNodes}\x22\n  :links=\x22${ds.codeLinks}\x22\n  units=\x22${ds.units}\x22${palAttr}${hAttr}${tipAttr}\n/>`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full max-w-3xl">
            <TuxChartSankey
              :nodes="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.commuter).nodes"
              :links="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.commuter).links"
              :units="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.commuter).units"
              :palette="values.palette"
              :height="Number(values.height)"
              :tooltip="values.tooltip"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">flagship · origin-destination mode shift</p>
      <h2 class="heading--bold text-xl font-bold">Suburban Origin → Facility → Mode Split</h2>
      <p class="mt-2 text-text-secondary leading-relaxed max-w-2xl">
        Three-stage commuter network inferred directly from edge
        topology. Ribbon widths preserve volume conservation from
        suburban origin zones through Park-and-Ride and Managed Lane
        gateways into final transit, HOV, and single-occupant modes.
      </p>
      <TuxExample class="mt-4" :vue="flagshipVue" :source="tuxChartSankeySource">
        <TuxChartFrame
          eyebrow="Exhibit 14.01"
          title="AM peak origin-to-corridor mode allocation"
          source="Source: Regional Travel Demand Model · 2026"
        >
          <TuxChartSankey
            :nodes="commuterModeNodes"
            :links="commuterModeLinks"
            units="k trips/day"
          />
        </TuxChartFrame>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">cvd palette · freight commodity flows</p>
      <h2 class="heading--bold text-xl font-bold">Port &amp; Border Freight Corridor Tonnage</h2>
      <p class="mt-2 text-text-secondary leading-relaxed max-w-2xl">
        Set <code>palette="cvd"</code> to bind source node bars and
        outbound ribbons to the Okabe-Ito universal color-vision-safe
        ramp while keeping full node totals directly labeled beside each
        stage bar.
      </p>
      <TuxExample class="mt-4" :vue="freightVue">
        <TuxChartSankey
          :nodes="freightCorridorNodes"
          :links="freightCorridorLinks"
          palette="cvd"
          units="M tons/yr"
        />
      </TuxExample>
    </section>
  </div>
</template>
