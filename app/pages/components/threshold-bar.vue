<script setup>
// Per ADR-0010, keep top-level <script setup> expressions plain JS.
useHead({ title: "TuxThresholdBar · TUX" });

const storageSegments = [
  {
    key: "committed-raw",
    label: "Raw Photogrammetry Captures",
    value: 46.5,
    tone: "primary",
    pattern: "solid",
  },
  {
    key: "lidar-clouds",
    label: "Calibrated Point Clouds",
    value: 24.0,
    tone: "secondary",
    pattern: "solid",
  },
  {
    key: "projected-run",
    label: "Scheduled Run #14 Burst",
    value: 18.5,
    tone: "warning",
    pattern: "hatched",
  },
];

const overCapacityCorridor = [
  {
    key: "mainlane-thru",
    label: "Mainlane Through Traffic",
    value: 4950,
    tone: "primary",
    pattern: "solid",
  },
  {
    key: "freight-heavy",
    label: "Heavy Freight Platoons",
    value: 1180,
    tone: "secondary",
    pattern: "solid",
  },
  {
    key: "diverted-inflow",
    label: "Projected Ramp Diversion",
    value: 820,
    tone: "danger",
    pattern: "hatched",
  },
];

const nominalPower = [
  {
    key: "base-chiller",
    label: "Environmental Chamber Base",
    value: 110,
    tone: "success",
  },
  {
    key: "shaker-rig",
    label: "Hydraulic Actuator Load",
    value: 75,
    tone: "accent",
  },
];

const storageVue = `<tux-threshold-bar
  title="Optical Telemetry Array Storage"
  :segments="storageSegments"
  :limit="100"
  unit="TB"
  :decimals="1"
/>`;

const overLimitVue = `<tux-threshold-bar
  title="IH-35 Northbound Peak Demand vs. HCM Capacity"
  :segments="overCapacityCorridor"
  :limit="6000"
  unit="veh/hr"
  :decimals="0"
/>`;

const compactVue = `<tux-threshold-bar
  title="Structures Lab Substation Feeder"
  :segments="nominalPower"
  :limit="350"
  unit="kW"
  :decimals="0"
  :show-legend="false"
/>`;

const typesTs = `export interface ThresholdSegment {
  key: string;
  label: string;
  value: number;
  tone?: "primary" | "secondary" | "accent" | "success" | "warning" | "danger";
  pattern?: "solid" | "hatched";
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · capacity & telemetry" title="TuxThresholdBar">
      Multi-segment horizontal capacity, allocation, and projection bar evaluated
      against a hard threshold limit. Uses diagonal hatched patterns for
      forecasted segments so color is never the sole channel, and rescales
      proportionally when demand exceeds 100% of capacity.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · approaching warning threshold</p>
      <h2 class="heading--bold text-xl font-bold">Committed vs. projected telemetry storage</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        When total utilization reaches <code>warningRatio</code> (default
        <code>0.85</code>), the status chip shifts to an approaching-limit
        warning. Forecasted segments use <code>pattern: "hatched"</code> to
        distinguish scheduled allocations from committed usage.
      </p>
      <TuxExample class="mt-4" :vue="storageVue">
        <div class="max-w-3xl">
          <TuxThresholdBar
            title="Optical Telemetry Array Storage"
            :segments="storageSegments"
            :limit="100"
            unit="TB"
            :decimals="1"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">over-limit · > 100% proportional scaling</p>
      <h2 class="heading--bold text-xl font-bold">Corridor demand exceeding highway capacity</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        When summed segments exceed <code>limit</code>, the bar rescales its
        track to the total demand and shifts the vertical threshold marker
        proportionally inside the bar so the exact overage share is visible.
      </p>
      <TuxExample class="mt-4" :vue="overLimitVue">
        <div class="max-w-3xl">
          <TuxThresholdBar
            title="IH-35 Northbound Peak Demand vs. HCM Capacity"
            :segments="overCapacityCorridor"
            :limit="6000"
            unit="veh/hr"
            :decimals="0"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">compact · nominal headroom without legend</p>
      <h2 class="heading--bold text-xl font-bold">Inline facility load summary</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>:show-legend="false"</code> for dense overview cards where
        only the aggregate figures and <code>role="meter"</code> track are needed.
      </p>
      <TuxExample class="mt-4" :vue="compactVue">
        <div class="max-w-xl">
          <TuxThresholdBar
            title="Structures Lab Substation Feeder"
            :segments="nominalPower"
            :limit="350"
            unit="kW"
            :decimals="0"
            :show-legend="false"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Segment interface</h2>
      <TuxCodeBlock class="mt-4" :code="typesTs" lang="ts" filename="TuxThresholdBar.ts" />
    </section>
  </div>
</template>
