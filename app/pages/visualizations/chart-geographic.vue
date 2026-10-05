<script setup lang="ts">
import tuxChartGeographicSource from "~/components/TuxChartGeographic.vue?raw";

useHead({ title: "TuxChartGeographic · TUX" });

const odFlows = [
  { from: "DFW", to: "HOU", value: 95 },
  { from: "AUS", to: "SAT", value: 60 },
  { from: "AUS", to: "DFW", value: 55 },
  { from: "AUS", to: "HOU", value: 45 },
  { from: "HOU", to: "SAT", value: 38 },
  { from: "DFW", to: "SAT", value: 30 },
  { from: "ELP", to: "DFW", value: 12 },
  { from: "LBB", to: "DFW", value: 18 },
  { from: "MCA", to: "SAT", value: 28 },
];

const geoControls = [
  {
    prop: "kind",
    label: "Geographic Geometry",
    type: "select" as const,
    options: [
      { label: "Texas County Choropleth (254 Counties)", value: "county" },
      { label: "TxDOT Engineering Districts (25 Districts)", value: "districts" },
      { label: "US Peer States (Albers USA)", value: "us-context" },
      { label: "Incident Dot Density (Sampling)", value: "dot-density" },
      { label: "Inter-Metro OD Corridor Flows", value: "flow" },
    ],
    defaultValue: "county",
    description: "Projection and boundary model geometry",
  },
  {
    prop: "palette",
    label: "Sequential Ramp",
    type: "select" as const,
    options: [
      { label: "Maroon Sequential (Aggie Core)", value: "maroon" },
      { label: "Slate Sequential (Neutral / Civic)", value: "slate" },
    ],
    defaultValue: "maroon",
    description: "5-step sequential color ramp applied to quantile classes",
  },
  {
    prop: "framed",
    label: "Editorial Frame",
    type: "boolean" as const,
    defaultValue: true,
    description: "Wrap inside standard institutional TuxChartFrame with metadata line",
  },
];

const geoPresets = [
  {
    name: "tx-county-vmt",
    label: "Texas County VMT Choropleth",
    description: "254 TIGER/Line counties with 5-quantile sequential maroon ramp",
    icon: "lucide:map",
    values: {
      kind: "county",
      palette: "maroon",
      framed: true,
    },
  },
  {
    name: "txdot-districts-priority",
    label: "TxDOT Districts Priority",
    description: "25 official engineering districts with centroid badges and slate ramp",
    icon: "lucide:network",
    values: {
      kind: "districts",
      palette: "slate",
      framed: true,
    },
  },
  {
    name: "national-rd-states",
    label: "US Peer States Context",
    description: "50 states + DC AlbersUSA projection with Texas highlight",
    icon: "lucide:globe",
    values: {
      kind: "us-context",
      palette: "maroon",
      framed: true,
    },
  },
  {
    name: "pedestrian-incidents",
    label: "Safety Dot-Density",
    description: "Geographically faithful incident distribution sampled inside Texas outline",
    icon: "lucide:scatter-chart",
    values: {
      kind: "dot-density",
      palette: "maroon",
      framed: true,
    },
  },
  {
    name: "freight-od-flows",
    label: "Inter-Metro OD Flows",
    description: "Curved directional arcs between primary Texas freight and travel hubs",
    icon: "lucide:git-pull-request",
    values: {
      kind: "flow",
      palette: "maroon",
      framed: true,
    },
  },
];

const countyVue = `<tux-chart-frame
  eyebrow="Exhibit 11.01"
  title="Vehicle miles traveled per capita, by Texas county · 2024"
  source="TTI Travel Behavior Survey · 2024 · Texas Demographic Center population estimates"
>
  <tux-chart-geographic
    kind="county"
    title="VMT per capita"
    legend-label="VMT per capita"
    :legend-stops="['≤ 6K', '6–9K', '9–12K', '12–15K', '≥ 15K']"
  />
</tux-chart-frame>`;

const districtsVue = `<tux-chart-frame
  eyebrow="Exhibit 11.02"
  title="Project-priority score by TxDOT district · MIP 2025 cycle"
  source="TTI Mobility Investment Priorities · 2025"
>
  <tux-chart-geographic
    kind="districts"
    palette="slate"
    title="Project-priority score"
    legend-label="Score"
    :legend-stops="['LOW', '', '', '', 'HIGH']"
  />
</tux-chart-frame>`;

const usContextVue = `<tux-chart-frame
  eyebrow="Exhibit 11.03"
  title="Federal transportation R&D dollars per capita, FY24"
  source="USDOT FHWA grant database · 2024"
>
  <tux-chart-geographic
    kind="us-context"
    highlight="TX"
    :legend-stops="['LOW', '', '', '', 'HIGH']"
    legend-label="R&D dollars per capita"
  />
</tux-chart-frame>`;

const dotDensityVue = `<tux-chart-frame
  eyebrow="Exhibit 11.05"
  title="Reported pedestrian-involved crashes, Texas · 2024"
  source="TxDOT Crash Records Information System · 2024"
>
  <tux-chart-geographic
    kind="dot-density"
    :dots="800"
    dot-legend="1 dot = 100 incidents"
  />
</tux-chart-frame>`;

const flowVue = `<tux-chart-frame
  eyebrow="Exhibit 11.06"
  title="Inter-metro daily trip flows, Texas · 2024"
  source="TTI Inter-City Travel Survey · 2024"
>
  <tux-chart-geographic
    kind="flow"
    :flows="odFlows"
    flow-legend="Daily trips (thousands)"
  />
</tux-chart-frame>`;

const metroGridVue = `<tux-chart-frame
  eyebrow="Exhibit 11.04"
  title="Tract-level commute-time variability across four Texas metros"
  source="ACS 5-year tract estimates · 2020–2024"
>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3.5">
    <tux-metro-inset name="Houston" highway-label="I-45" />
    <tux-metro-inset name="Dallas–Fort Worth" highway-label="I-35E" />
    <tux-metro-inset name="Austin" highway-label="I-35" />
    <tux-metro-inset name="San Antonio" highway-label="I-10" />
  </div>
</tux-chart-frame>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="data viz · geographic" title="TuxChartGeographic">
      Texas-flavored geographic charts using real geometry. Five
      kinds via the <code>kind</code> prop, all native SVG (no
      library): county choropleth (254 TIGER/Line counties),
      TxDOT 25-district map (official MapServer boundaries),
      US states with TX highlighted (AlbersUsa projection,
      AK / HI insets handled), dot-density incident map (rejection-
      sampled inside the actual state outline), and origin-
      destination flow arcs between metros (projected from real
      lat/lng).
      <br><br>
      <span class="text-sm text-text-muted">
        Geometry is pre-projected at build time by
        <code>scripts/build-geo.mjs</code> — us-atlas + TxDOT
        MapServer through Visvalingam simplification through
        d3-geoAlbers / d3-geoAlbersUsa. The component renders
        static SVG path strings; no runtime projection or topology
        library. Wrap in <code>TuxChartFrame</code> for the
        eyebrow + Oswald title + source-line rhythm.
      </span>
    </TuxPageHeader>

    <!-- Interactive Props & Geometry Workbench -->
    <section>
      <TuxPlayground
        tag="tux-chart-geographic"
        component-name="TuxChartGeographic"
        title="Geographic Telemetry & Projections Workbench"
        eyebrow="Interactive Geographic Lab"
        :controls="geoControls"
        :presets="geoPresets"
        :source="tuxChartGeographicSource"
        :code-template="(values) => {
          const palAttr = values.palette !== 'maroon' ? `\n  palette=\x22${values.palette}\x22` : '';
          const chartTag = `<tux-chart-geographic\n  kind=\x22${values.kind}\x22${palAttr}\n/>`;
          if (!values.framed) return chartTag;
          return `<tux-chart-frame\n  eyebrow=\x22Exhibit 11.XX\x22\n  title=\x22Texas Transportation Telemetry Map\x22\n  source=\x22TTI Geospatial Core 2026\x22\n>\n  ${chartTag}\n</tux-chart-frame>`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full max-w-3xl">
            <TuxChartFrame
              v-if="values.framed"
              eyebrow="Interactive Preview"
              :title="values.kind === 'county' ? 'Texas County VMT Distribution' :
                     values.kind === 'districts' ? 'TxDOT Engineering Districts' :
                     values.kind === 'us-context' ? 'National Transportation R&D Context' :
                     values.kind === 'dot-density' ? 'Reported Crash Incident Hotspots' :
                     'Inter-Metro Freight Corridors'"
              source="TTI Geospatial Repository · 2026"
            >
              <TuxChartGeographic
                v-if="values.kind === 'county'"
                kind="county"
                :palette="values.palette"
                title="VMT per capita"
                legend-label="VMT per capita"
                :legend-stops="['≤ 6K', '6–9K', '9–12K', '12–15K', '≥ 15K']"
              />
              <TuxChartGeographic
                v-else-if="values.kind === 'districts'"
                kind="districts"
                :palette="values.palette"
                title="Project-priority score"
                legend-label="Score"
                :legend-stops="['LOW', '', '', '', 'HIGH']"
              />
              <TuxChartGeographic
                v-else-if="values.kind === 'us-context'"
                kind="us-context"
                :palette="values.palette"
                highlight="TX"
                :legend-stops="['LOW', '', '', '', 'HIGH']"
                legend-label="R&D dollars per capita"
              />
              <TuxChartGeographic
                v-else-if="values.kind === 'dot-density'"
                kind="dot-density"
                :palette="values.palette"
                :dots="800"
                dot-legend="1 dot = 100 incidents"
              />
              <TuxChartGeographic
                v-else-if="values.kind === 'flow'"
                kind="flow"
                :palette="values.palette"
                :flows="odFlows"
                flow-legend="Daily trips (thousands)"
              />
            </TuxChartFrame>
            <div v-else>
              <TuxChartGeographic
                v-if="values.kind === 'county'"
                kind="county"
                :palette="values.palette"
                title="VMT per capita"
                legend-label="VMT per capita"
                :legend-stops="['≤ 6K', '6–9K', '9–12K', '12–15K', '≥ 15K']"
              />
              <TuxChartGeographic
                v-else-if="values.kind === 'districts'"
                kind="districts"
                :palette="values.palette"
                title="Project-priority score"
                legend-label="Score"
                :legend-stops="['LOW', '', '', '', 'HIGH']"
              />
              <TuxChartGeographic
                v-else-if="values.kind === 'us-context'"
                kind="us-context"
                :palette="values.palette"
                highlight="TX"
                :legend-stops="['LOW', '', '', '', 'HIGH']"
                legend-label="R&D dollars per capita"
              />
              <TuxChartGeographic
                v-else-if="values.kind === 'dot-density'"
                kind="dot-density"
                :palette="values.palette"
                :dots="800"
                dot-legend="1 dot = 100 incidents"
              />
              <TuxChartGeographic
                v-else-if="values.kind === 'flow'"
                kind="flow"
                :palette="values.palette"
                :flows="odFlows"
                flow-legend="Daily trips (thousands)"
              />
            </div>
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">flagship · 254 real counties</p>
      <h2 class="heading--bold text-xl font-bold">County choropleth — sequential maroon</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Real TIGER/Line county geometry projected with d3-geoAlbers
        (Texas-centered, parallels at 27°N and 35°N to minimize
        distortion across the state). Five-step quantile-binned
        ramp; never linear-scale (one outlier washes out everything
        else). Pass a <code>:counties="[{ fips, value }]"</code>
        array to drive the choropleth; the showcase below uses a
        deterministic FIPS-hash demo.
      </p>
      <TuxExample class="mt-4" :vue="countyVue" :source="tuxChartGeographicSource">
        <TuxChartFrame
          eyebrow="Exhibit 11.01"
          title="Vehicle miles traveled per capita, by Texas county · 2024"
          source="TTI Travel Behavior Survey · 2024 · Texas Demographic Center population estimates"
        >
          <TuxChartGeographic
            kind="county"
            title="VMT per capita"
            legend-label="VMT per capita"
            :legend-stops="['≤ 6K', '6–9K', '9–12K', '12–15K', '≥ 15K']"
          />
        </TuxChartFrame>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">25 districts · slate ramp</p>
      <h2 class="heading--bold text-xl font-bold">TxDOT districts</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Coarser geography — easier to label, faster to read. Use
        for project-priority, district-submitted inventories, and
        MIP scoring. Districts are numbered per TxDOT engineering
        directive; the badge sits at each polygon's centroid.
      </p>
      <TuxExample class="mt-4" :vue="districtsVue" :source="tuxChartGeographicSource">
        <TuxChartFrame
          eyebrow="Exhibit 11.02"
          title="Project-priority score by TxDOT district · MIP 2025 cycle"
          source="TTI Mobility Investment Priorities · 2025"
        >
          <TuxChartGeographic
            kind="districts"
            palette="slate"
            title="Project-priority score"
            legend-label="Score"
            :legend-stops="['LOW', '', '', '', 'HIGH']"
          />
        </TuxChartFrame>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">national context · AlbersUsa</p>
      <h2 class="heading--bold text-xl font-bold">US states — Texas highlighted</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        For proposals that compare Texas to peer states. AlbersUsa
        projection handles AK and HI as insets natively (real
        geography, not a tilegram). The highlighted state shifts
        to maroon brand color; everyone else uses the chosen ramp.
        Pass a <code>:states="[{ code, value }]"</code> array;
        codes are USPS two-letter abbreviations.
      </p>
      <TuxExample class="mt-4" :vue="usContextVue" :source="tuxChartGeographicSource">
        <TuxChartFrame
          eyebrow="Exhibit 11.03"
          title="Federal transportation R&D dollars per capita, FY24"
          source="USDOT FHWA grant database · 2024"
        >
          <TuxChartGeographic
            kind="us-context"
            highlight="TX"
            :legend-stops="['LOW', '', '', '', 'HIGH']"
            legend-label="R&D dollars per capita"
          />
        </TuxChartFrame>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">incident dots · distribution-as-message</p>
      <h2 class="heading--bold text-xl font-bold">Dot density</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Each dot represents one event (or N events at a fixed
        scale). Use when the geographic distribution itself is the
        message — pedestrian-involved crashes, freight-crash
        hotspots, weather-related closures.
      </p>
      <TuxExample class="mt-4" :vue="dotDensityVue" :source="tuxChartGeographicSource">
        <TuxChartFrame
          eyebrow="Exhibit 11.05"
          title="Reported pedestrian-involved crashes, Texas · 2024"
          source="TxDOT Crash Records Information System · 2024"
        >
          <TuxChartGeographic
            kind="dot-density"
            :dots="800"
            dot-legend="1 dot = 100 incidents"
          />
        </TuxChartFrame>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">origin-destination · curved arcs</p>
      <h2 class="heading--bold text-xl font-bold">Inter-metro flow map</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Curved arcs between Texas's seven primary metros (DFW,
        HOU, SAT, AUS, ELP, MCA, LBB). Arc width scales linearly
        with volume; arrows mark the destination so directionality
        reads at a glance.
      </p>
      <TuxExample class="mt-4" :vue="flowVue" :source="tuxChartGeographicSource">
        <TuxChartFrame
          eyebrow="Exhibit 11.06"
          title="Inter-metro daily trip flows, Texas · 2024"
          source="TTI Inter-City Travel Survey · 2024"
        >
          <TuxChartGeographic
            kind="flow"
            :flows="odFlows"
            flow-legend="Daily trips (thousands)"
          />
        </TuxChartFrame>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">drill-in · 4-up neighborhood inset</p>
      <h2 class="heading--bold text-xl font-bold">Metro insets — companion to TuxChartGeographic</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        When statewide geography ends and the question turns to
        "what does it look like inside one metro," compose
        <code>TuxMetroInset</code> in a four-up grid. Each inset
        is an 8 × 6 census-tract grid plus a labelled diagonal
        highway overlay. The seed is the metro name, so the same
        metro always renders the same pattern.
      </p>
      <TuxExample class="mt-4" :vue="metroGridVue" :source="tuxChartGeographicSource">
        <TuxChartFrame
          eyebrow="Exhibit 11.04"
          title="Tract-level commute-time variability across four Texas metros"
          source="ACS 5-year tract estimates · 2020–2024"
        >
          <div class="cg-demo__metro-grid">
            <TuxMetroInset name="Houston" highway-label="I-45" />
            <TuxMetroInset name="Dallas–Fort Worth" highway-label="I-35E" />
            <TuxMetroInset name="Austin" highway-label="I-35" />
            <TuxMetroInset name="San Antonio" highway-label="I-10" />
          </div>
        </TuxChartFrame>
      </TuxExample>
    </section>
  </div>
</template>

<style scoped>
.cg-demo__metro-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.875rem;
}
@container (max-width: 48rem) {
  .cg-demo__metro-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
