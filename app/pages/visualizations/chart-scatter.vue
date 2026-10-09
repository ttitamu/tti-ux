<script setup lang="ts">
// Per ADR-0010, keep top-level <script setup> expressions plain JS.
import pbiCartesian from "../../../kit/powerbi/pbir/fragments/tti/chart-cartesian.json?raw";
import tuxChartScatterSource from "~/components/TuxChartScatter.vue?raw";

useHead({ title: "TuxChartScatter · TUX" });

// Training-hours vs errors: clear negative correlation.
const crewTraining = [
  {
    key: "crew",
    label: "Operations crew",
    points: [
      { x: 2, y: 22 }, { x: 3, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 16 },
      { x: 6, y: 15 }, { x: 7, y: 13 }, { x: 8, y: 11 }, { x: 9, y: 12 },
      { x: 10, y: 9 }, { x: 11, y: 8 }, { x: 12, y: 7 }, { x: 13, y: 6 },
      { x: 14, y: 7 }, { x: 16, y: 5 }, { x: 18, y: 4 }, { x: 20, y: 3 },
    ],
  },
];

// Two-series with weaker correlation.
const corridorData = [
  {
    key: "urban",
    label: "Urban corridors",
    points: [
      { x: 40, y: 78 }, { x: 50, y: 82 }, { x: 55, y: 88 }, { x: 60, y: 86 },
      { x: 65, y: 91 }, { x: 70, y: 89 }, { x: 75, y: 93 }, { x: 80, y: 92 },
      { x: 85, y: 94 },
    ],
  },
  {
    key: "rural",
    label: "Rural corridors",
    points: [
      { x: 35, y: 62 }, { x: 42, y: 68 }, { x: 48, y: 64 }, { x: 54, y: 72 },
      { x: 60, y: 75 }, { x: 68, y: 71 }, { x: 75, y: 80 }, { x: 82, y: 78 },
    ],
  },
];

// Bubble-chart sample with variable point sizes.
const bubbleData = [
  {
    key: "projects",
    label: "Projects (size = budget M$)",
    points: [
      { x: 12, y: 88, size: 14, label: "Houston freight" },
      { x: 24, y: 76, size: 10, label: "I-35" },
      { x: 8,  y: 92, size: 22, label: "DFW connected vehicle" },
      { x: 18, y: 68, size: 7,  label: "Rural broadband" },
      { x: 30, y: 84, size: 18, label: "Port mobility" },
      { x: 14, y: 72, size: 6,  label: "Workforce" },
      { x: 22, y: 80, size: 12, label: "Border crossing" },
    ],
  },
];

const datasetMap = {
  training: {
    series: crewTraining,
    codeSeries: "crewTraining",
    xLabel: "Hours of training",
    yLabel: "Errors per shift",
  },
  corridors: {
    series: corridorData,
    codeSeries: "corridorData",
    xLabel: "Vehicle miles / capita",
    yLabel: "Safety score",
  },
  bubble: {
    series: bubbleData,
    codeSeries: "bubbleData",
    xLabel: "Months elapsed",
    yLabel: "Completion score",
  },
};

const scatterControls = [
  {
    prop: "dataset",
    label: "Telemetry Dataset",
    type: "select" as const,
    options: [
      { label: "Operations Training vs Errors (1 Series)", value: "training" },
      { label: "Urban vs Rural Corridors (2 Series)", value: "corridors" },
      { label: "Project Portfolio Investment (Bubble Sizes)", value: "bubble" },
    ],
    defaultValue: "training",
    description: "Multi-dimensional observation telemetry",
  },
  {
    prop: "palette",
    label: "Color Palette",
    type: "select" as const,
    options: [
      { label: "Aggie Brand Anchor (--chart-1..8)", value: "brand" },
      { label: "Okabe-Ito Universal CVD (--chart-cvd-1..8)", value: "cvd" },
    ],
    defaultValue: "brand",
    description: "Color system: brand maroon anchor or Okabe-Ito colorblindness-safe palette",
  },
  {
    prop: "distinctMarkers",
    label: "Distinct Geometric Markers",
    type: "boolean" as const,
    defaultValue: true,
    description: "Cycle unique glyphs (circle, square, triangle, diamond, cross, star) per series for CVD legibility",
  },
  {
    prop: "trendline",
    label: "Regression Trendline (R²)",
    type: "boolean" as const,
    defaultValue: true,
    description: "Compute and render linear regression line with coefficient of determination",
  },
];

const scatterPresets = [
  {
    name: "cvd-accessible",
    label: "Universal CVD & Distinct Markers",
    description: "Okabe-Ito barrier-free palette with distinct geometric glyphs per series and matching legend",
    icon: "lucide:eye",
    values: {
      dataset: "corridors",
      palette: "cvd",
      distinctMarkers: true,
      trendline: true,
    },
  },
  {
    name: "training-regression",
    label: "Linear Regression Trendline (R²)",
    description: "Negative correlation slope showing training impact on errors",
    icon: "lucide:trending-down",
    values: {
      dataset: "training",
      palette: "brand",
      distinctMarkers: true,
      trendline: true,
    },
  },
  {
    name: "corridor-comparison",
    label: "Urban vs Rural Corridors",
    description: "Two-series correlation with individual per-series regression fits",
    icon: "lucide:git-compare",
    values: {
      dataset: "corridors",
      palette: "brand",
      distinctMarkers: true,
      trendline: true,
    },
  },
  {
    name: "portfolio-bubble",
    label: "Bubble Point Sizing",
    description: "3rd dimension variable radius representing capital budget",
    icon: "lucide:circle-dot",
    values: {
      dataset: "bubble",
      palette: "brand",
      distinctMarkers: false,
      trendline: false,
    },
  },
];

const basicVue = `<tux-chart-scatter
  x-label="Hours of training"
  y-label="Errors per shift"
  :series="crewTraining"
  trendline
/>`;

const cvdScatterVue = `<!-- Okabe-Ito CVD palette with unique geometric glyphs per series -->
<tux-chart-scatter
  x-label="Vehicle miles / capita"
  y-label="Safety score"
  :series="corridorData"
  palette="cvd"
  distinct-markers
  trendline
/>`;

const multiVue = `<tux-chart-scatter
  x-label="Vehicle miles / capita"
  y-label="Safety score"
  :series="corridorData"
  trendline
/>`;

const bubbleVue = `<tux-chart-scatter
  x-label="Months elapsed"
  y-label="Completion score"
  :series="bubbleData"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="visualization · native chart" title="TuxChartScatter">
      Correlation plot — x vs y, one dot per observation. Optional
      linear-regression trendline with R² readout. Use to answer
      "does X relate to Y?" questions — training vs error rate,
      density vs safety, age vs sentiment. Only chart in the family
      where <strong>both axes need names</strong>.
    </TuxPageHeader>

    <!-- Interactive Props & Telemetry Workbench -->
    <section>
      <TuxPlayground
        tag="tux-chart-scatter"
        component-name="TuxChartScatter"
        title="Scatter Plot & Correlation Workbench"
        eyebrow="Interactive Telemetry Lab"
        :controls="scatterControls"
        :presets="scatterPresets"
        :source="tuxChartScatterSource"
        :powerbi="pbiCartesian"
        :code-template="(values) => {
          const ds = datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.training;
          const palAttr = values.palette === 'cvd' ? '\n  palette=\x22cvd\x22' : '';
          const markerAttr = values.distinctMarkers === false ? '\n  :distinct-markers=\x22false\x22' : '';
          const trendAttr = values.trendline ? '\n  trendline' : '';
          return `<tux-chart-scatter\n  x-label=\x22${ds.xLabel}\x22\n  y-label=\x22${ds.yLabel}\x22\n  :series=\x22${ds.codeSeries}\x22${palAttr}${markerAttr}${trendAttr}\n/>`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full max-w-3xl">
            <TuxChartScatter
              :x-label="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.training).xLabel"
              :y-label="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.training).yLabel"
              :series="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.training).series"
              :palette="values.palette"
              :distinct-markers="values.distinctMarkers"
              :trendline="values.trendline"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">accessible · cvd geometric markers</p>
      <h2 class="heading--bold text-xl font-bold">Universal CVD & Distinct Geometric Markers</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>palette="cvd"</code> and <code>distinctMarkers</code> so each series displays a
        unique geometric glyph (circle ●, square ■, triangle ▲, diamond ◆, cross ✚, star ★).
        The legend swatches pair the exact marker glyph and regression rule, guaranteeing that
        observations from overlapping series can be disambiguated regardless of color perception.
      </p>
      <TuxExample :powerbi="pbiCartesian" :source="tuxChartScatterSource" class="mt-4" :vue="cvdScatterVue">
        <TuxChartScatter
          x-label="Vehicle miles / capita"
          y-label="Safety score"
          :series="corridorData"
          palette="cvd"
          distinct-markers
          trendline
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">flagship · single series + trendline</p>
      <h2 class="heading--bold text-xl font-bold">Training hours vs errors</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Negative slope shows the expected relationship — more training,
        fewer errors. The R² shows how tightly the dots cluster
        around the line.
      </p>
      <TuxExample :powerbi="pbiCartesian" :source="tuxChartScatterSource" class="mt-4" :vue="basicVue">
        <TuxChartScatter
          x-label="Hours of training"
          y-label="Errors per shift"
          :series="crewTraining"
          trendline
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">multi-series · per-series trendlines</p>
      <h2 class="heading--bold text-xl font-bold">Urban vs rural corridors</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Each series gets its own trendline + R² in the legend. The two
        groups show the same direction of correlation but at different
        levels — common in transportation data.
      </p>
      <TuxExample :powerbi="pbiCartesian" :source="tuxChartScatterSource" class="mt-4" :vue="multiVue">
        <TuxChartScatter
          x-label="Vehicle miles / capita"
          y-label="Safety score"
          :series="corridorData"
          trendline
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">bubble · variable point size</p>
      <h2 class="heading--bold text-xl font-bold">Project portfolio</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>size</code> on individual points for a bubble-chart-
        style third dimension. The native SVG <code>&lt;title&gt;</code>
        on each circle gives you a free hover-tooltip with the
        point label + values.
      </p>
      <TuxExample :powerbi="pbiCartesian" :source="tuxChartScatterSource" class="mt-4" :vue="bubbleVue">
        <TuxChartScatter
          x-label="Months elapsed"
          y-label="Completion score"
          :series="bubbleData"
        />
      </TuxExample>
    </section>
  </div>
</template>
