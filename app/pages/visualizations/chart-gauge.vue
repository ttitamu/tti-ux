<script setup lang="ts">
import pbiCard from "../../../kit/powerbi/pbir/fragments/tti/card-chrome.json?raw";
import tuxChartGaugeSource from "~/components/TuxChartGauge.vue?raw";
import { utilizationBands, slaBands, corridorBands } from "./chart-gauge.demo-data";

useHead({ title: "TuxChartGauge · TUX" });

const datasetMap = {
  delivery: {
    value: 78,
    min: 0,
    max: 100,
    centerLabel: "On-time delivery",
    centerValue: 78,
    units: "%",
    bands: undefined,
  },
  token: {
    value: 72,
    min: 0,
    max: 100,
    centerLabel: "Token utilization",
    centerValue: 72,
    units: "%",
    bands: utilizationBands,
  },
  sla: {
    value: 99.84,
    min: 95,
    max: 100,
    centerLabel: "API uptime",
    centerValue: 99.84,
    units: "%",
    bands: slaBands,
  },
  corridor: {
    value: 68,
    min: 0,
    max: 100,
    centerLabel: "Congestion index",
    centerValue: 68,
    units: "%",
    bands: corridorBands,
  },
};

const gaugeControls = [
  {
    prop: "dataset",
    label: "Telemetry Metric",
    type: "select" as const,
    options: [
      { label: "On-Time Dispatch Delivery (78%)", value: "delivery" },
      { label: "GPU Token Utilization (72%)", value: "token" },
      { label: "API High-Availability SLA (99.84%)", value: "sla" },
      { label: "Corridor Congestion Index (68%)", value: "corridor" },
    ],
    defaultValue: "token",
    description: "Transportation operational telemetry metric",
  },
  {
    prop: "variant",
    label: "Gauge Variant",
    type: "select" as const,
    options: [
      { label: "Arc Gauge (Needle + Sweep)", value: "arc" },
      { label: "Radial Progress (Single Arc Fill)", value: "progress" },
    ],
    defaultValue: "arc",
    description: "Choose between needle indicator or filled radial progress",
  },
  {
    prop: "showBands",
    label: "Show Tone Bands",
    type: "boolean" as const,
    defaultValue: true,
    description: "Render qualitative target bands (success / warning / error)",
  },
  {
    prop: "size",
    label: "Gauge Size",
    type: "select" as const,
    options: [
      { label: "Compact (200px)", value: 200 },
      { label: "Standard (240px)", value: 240 },
      { label: "Expanded (280px)", value: 280 },
    ],
    defaultValue: 240,
    description: "Rendered SVG dimension in CSS pixels",
  },
];

const gaugePresets = [
  {
    name: "token-utilization",
    label: "Context Token Utilization (72%)",
    description: "Arc needle gauge with 3-tier qualitative target bands",
    icon: "lucide:cpu",
    values: {
      dataset: "token",
      variant: "arc",
      showBands: true,
      size: 240,
    },
  },
  {
    name: "sla-uptime",
    label: "API SLA Uptime (99.84%)",
    description: "Radial progress showing 99%+ SLA floor with green tier",
    icon: "lucide:check-circle",
    values: {
      dataset: "sla",
      variant: "progress",
      showBands: true,
      size: 240,
    },
  },
  {
    name: "corridor-congestion",
    label: "Corridor Congestion Index",
    description: "Peak-hour travel congestion with amber warning band",
    icon: "lucide:traffic-cone",
    values: {
      dataset: "corridor",
      variant: "arc",
      showBands: true,
      size: 240,
    },
  },
];

const basicVue = `<tux-chart-gauge
  :value="78"
  :min="0"
  :max="100"
  center-label="On-time delivery"
  :center-value="78"
  units="%"
/>`;

const bandsVue = `<tux-chart-gauge
  :value="72"
  :min="0"
  :max="100"
  :bands="utilizationBands"
  center-label="Token utilization"
  :center-value="72"
  units="%"
/>`;

const progressVue = `<tux-chart-gauge
  variant="progress"
  :value="6420"
  :min="0"
  :max="8000"
  center-label="Context used"
  :center-value="6420"
  units=" tok"
/>`;

const slaVue = `<tux-chart-gauge
  variant="progress"
  :value="99.84"
  :min="95"
  :max="100"
  :bands="slaBands"
  center-label="API uptime"
  :center-value="99.84"
  units="%"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="visualization · native chart" title="TuxChartGauge">
      270° arc gauge for <strong>single-target</strong> metrics where
      one value matters and the target zones are qualitative
      (success/warning/error) or hard limits. Use sparingly — research
      dashboards rarely need gauges. Good fits: token utilization,
      SLA uptime, compliance score. Bad fits: anything contextual
      (use <code>TuxBigStat</code> + <code>TuxSparkline</code>).
      <br><br>
      <span class="text-sm text-text-muted">
        Two variants: <code>arc</code> (default, with needle + bands)
        and <code>progress</code> (single filled arc, no needle).
      </span>
    </TuxPageHeader>

    <!-- Interactive Props & Telemetry Workbench -->
    <section>
      <TuxPlayground
        tag="tux-chart-gauge"
        component-name="TuxChartGauge"
        title="Arc Gauge & Progress Telemetry Workbench"
        eyebrow="Interactive Telemetry Lab"
        :controls="gaugeControls"
        :presets="gaugePresets"
        :source="tuxChartGaugeSource"
        :powerbi="pbiCard"
        :code-template="(values) => {
          const ds = datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.token;
          const varAttr = values.variant !== 'arc' ? `\n  variant=\x22${values.variant}\x22` : '';
          const sizeAttr = values.size !== 240 ? `\n  :size=\x22${values.size}\x22` : '';
          const bandsAttr = values.showBands && ds.bands ? '\n  :bands=\x22targetBands\x22' : '';
          return `<tux-chart-gauge\n  :value=\x22${ds.value}\x22\n  :min=\x22${ds.min}\x22\n  :max=\x22${ds.max}\x22\n  center-label=\x22${ds.centerLabel}\x22\n  :center-value=\x22${ds.centerValue}\x22\n  units=\x22${ds.units}\x22${varAttr}${sizeAttr}${bandsAttr}\n/>`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full flex justify-center py-4">
            <TuxChartGauge
              :value="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.token).value"
              :min="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.token).min"
              :max="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.token).max"
              :center-label="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.token).centerLabel"
              :center-value="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.token).centerValue"
              :units="(datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.token).units"
              :variant="values.variant"
              :size="Number(values.size)"
              :bands="values.showBands ? (datasetMap[values.dataset as keyof typeof datasetMap] || datasetMap.token).bands : undefined"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">flagship · arc with needle</p>
      <h2 class="heading--bold text-xl font-bold">On-time delivery</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        No bands — neutral track with a needle at <code>value</code>.
        Use when target zones aren't well-defined; the needle
        position itself is the signal.
      </p>
      <TuxExample class="mt-4" :vue="basicVue" :source="tuxChartGaugeSource" :powerbi="pbiCard">
        <TuxChartGauge
          :value="78"
          :min="0"
          :max="100"
          center-label="On-time delivery"
          :center-value="78"
          units="%"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">arc with tone bands</p>
      <h2 class="heading--bold text-xl font-bold">Token utilization</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>bands</code> to mark target zones. Each band has
        <code>from</code>, <code>to</code>, and either a
        <code>tone</code> (success / warning / error — status tokens) or a
        <code>toneIndex</code> (1..8 chart palette). The needle reads
        against the bands.
      </p>
      <TuxExample class="mt-4" :vue="bandsVue" :source="tuxChartGaugeSource" :powerbi="pbiCard">
        <TuxChartGauge
          :value="72"
          :min="0"
          :max="100"
          :bands="utilizationBands"
          center-label="Token utilization"
          :center-value="72"
          units="%"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">progress variant</p>
      <h2 class="heading--bold text-xl font-bold">Radial progress</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>variant="progress"</code> for a single filled arc
        with no needle and no bands. Better for percent-of-max
        ("X tokens of Y context") where there are no qualitative
        zones.
      </p>
      <TuxExample class="mt-4" :vue="progressVue" :source="tuxChartGaugeSource" :powerbi="pbiCard">
        <TuxChartGauge
          variant="progress"
          :value="6420"
          :min="0"
          :max="8000"
          center-label="Context used"
          :center-value="6420"
          units=" tok"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">progress with status bands</p>
      <h2 class="heading--bold text-xl font-bold">High-availability SLA uptime</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Progress variant with colored background track showing target
        thresholds. The arc fill changes hue based on which band the
        value currently falls in.
      </p>
      <TuxExample class="mt-4" :vue="slaVue" :source="tuxChartGaugeSource" :powerbi="pbiCard">
        <TuxChartGauge
          variant="progress"
          :value="99.84"
          :min="95"
          :max="100"
          :bands="slaBands"
          center-label="API uptime"
          :center-value="99.84"
          units="%"
        />
      </TuxExample>
    </section>
  </div>
</template>
