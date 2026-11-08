<script setup lang="ts">
import type { RecordDiffField } from "~/components/TuxRecordDiff.vue";

useHead({ title: "TuxRecordDiff · TUX" });

const signalRetimingFields: RecordDiffField[] = [
  {
    key: "cycle_length_sec",
    label: "Coordinated Cycle Length",
    before: 120,
    after: 110,
    unit: "sec",
    thresholdPct: 5,
  },
  {
    key: "corridor_travel_time",
    label: "85th Percentile Corridor Travel Time",
    before: 14.8,
    after: 11.4,
    unit: "min",
    thresholdPct: 10,
  },
  {
    key: "green_band_efficiency",
    label: "Arterial Progression Efficiency",
    before: 42,
    after: 58,
    unit: "%",
    thresholdPct: 15,
  },
  {
    key: "radar_sample_hz",
    label: "Cabinet Telemetry Polling Rate",
    before: 10,
    after: 10,
    unit: "Hz",
  },
  {
    key: "coordination_plan",
    label: "Active Timing Plan Profile",
    before: "Fixed-Time Plan B",
    after: "Traffic-Responsive Plan TR-4",
  },
  {
    key: "leading_ped_interval",
    label: "Leading Pedestrian Interval (LPI)",
    before: null,
    after: 5,
    unit: "sec",
  },
  {
    key: "legacy_serial_channel",
    label: "Twisted-Pair Copper Drops",
    before: "COM-2 (9600 baud)",
    after: null,
  },
];

const filterState = ref(false);

function onToggleFilter(changesOnly: boolean) {
  filterState.value = changesOnly;
}

const flagshipVue = `<TuxRecordDiff
  title="SH-6 Arterial Signal Retiming & Telemetry Firmware Audit"
  before-label="Pre-Timing (Q1)"
  after-label="Post-Timing (Q2)"
  :fields="signalRetimingFields"
  @toggle-filter="onToggleFilter"
/>`;

const filteredVue = `<TuxRecordDiff
  title="Changes-Only Snapshot"
  :fields="signalRetimingFields"
  :changes-only-default="true"
/>`;

const typesCode = `export interface RecordDiffField {
  key: string;
  label: string;
  before: string | number | null;
  after: string | number | null;
  unit?: string;
  thresholdPct?: number;
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · delta comparison" title="TuxRecordDiff">
      Structured field-by-field and period-over-period delta viewer.
      Classifies additions, removals, modifications, and unchanged fields,
      calculates signed numeric deltas and percent variances, flags threshold
      excursions, and toggles to modified rows on demand.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · telemetry configuration &amp; corridor KPI diff</p>
      <h2 class="heading--bold text-xl font-bold">
        Signal controller retiming &amp; before/after performance audit
      </h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Numeric pairs automatically compute signed absolute and percentage
        deltas, highlighting fields whose percentage variance exceeds
        <code>thresholdPct</code>. Toggle <strong>Changes only</strong> to
        suppress unchanged configuration parameters.
      </p>

      <TuxExample class="mt-4" :vue="flagshipVue">
        <TuxRecordDiff
          title="SH-6 Arterial Signal Retiming & Telemetry Firmware Audit"
          before-label="Pre-Timing (Q1)"
          after-label="Post-Timing (Q2)"
          :fields="signalRetimingFields"
          @toggle-filter="onToggleFilter"
        />
      </TuxExample>

      <p class="mt-3 text-xs font-mono text-text-muted">
        Filter state (<code>changesOnly</code>): {{ filterState }}
      </p>
    </section>

    <section>
      <p class="eyebrow">pre-filtered · changesOnlyDefault</p>
      <h2 class="heading--bold text-xl font-bold">Default changes-only audit view</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>:changes-only-default="true"</code> when embedding inside
        compact change-log drawers where unchanged fields add noise.
      </p>
      <TuxExample class="mt-4" :vue="filteredVue">
        <TuxRecordDiff
          title="Changes-Only Snapshot"
          :fields="signalRetimingFields"
          :changes-only-default="true"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Exported TypeScript interface</h2>
      <TuxCodeBlock class="mt-4" :code="typesCode" lang="ts" filename="TuxRecordDiff.ts" />
    </section>
  </div>
</template>
