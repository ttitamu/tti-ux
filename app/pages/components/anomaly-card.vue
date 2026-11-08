<script setup lang="ts">
import tuxAnomalyCardSource from "~/components/TuxAnomalyCard.vue?raw";
import type { AnomalySeriesPoint } from "~/components/TuxAnomalyCard.vue";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxAnomalyCard · TUX" });

const computeSpikeSeries: AnomalySeriesPoint[] = [
  { label: "10-22", actual: 42, baselineMin: 34, baselineMax: 52 },
  { label: "10-24", actual: 46, baselineMin: 35, baselineMax: 54 },
  { label: "10-26", actual: 39, baselineMin: 34, baselineMax: 52 },
  { label: "10-28", actual: 48, baselineMin: 36, baselineMax: 55 },
  { label: "10-30", actual: 51, baselineMin: 36, baselineMax: 56 },
  { label: "11-01", actual: 94, baselineMin: 36, baselineMax: 56 },
  { label: "11-03", actual: 198, baselineMin: 37, baselineMax: 58 },
];

const egressWarningSeries: AnomalySeriesPoint[] = [
  { label: "06:00", actual: 1.2, baselineMin: 0.9, baselineMax: 1.6 },
  { label: "08:00", actual: 1.5, baselineMin: 1.1, baselineMax: 1.9 },
  { label: "10:00", actual: 1.7, baselineMin: 1.2, baselineMax: 2.0 },
  { label: "12:00", actual: 2.1, baselineMin: 1.2, baselineMax: 2.1 },
  { label: "14:00", actual: 3.4, baselineMin: 1.3, baselineMax: 2.2 },
];

const liveState = ref<"open" | "acknowledged" | "snoozed">("open");
const triageLog = ref<string>("");

function onAcknowledge(id: string) {
  liveState.value = "acknowledged";
  triageLog.value = `Acknowledged ${id} — card sunk onto --surface-sunken`;
}

function onSnooze(id: string) {
  liveState.value = "snoozed";
  triageLog.value = `Snoozed ${id} for 24h`;
}

function onEscalate(id: string) {
  triageLog.value = `Escalated ${id} to on-call infrastructure lead`;
}

function resetTriage() {
  liveState.value = "open";
  triageLog.value = "";
}

const anomalyControls: TuxPropControl[] = [
  {
    prop: "title",
    label: "Anomaly Title",
    type: "text",
    defaultValue: "Unbounded Join Scan on Distributed Query Pool",
  },
  {
    prop: "targetEntity",
    label: "Target Entity",
    type: "text",
    defaultValue: "Study 02-411085 · Distributed Query Pool",
  },
  {
    prop: "metricLabel",
    label: "Metric Label",
    type: "text",
    defaultValue: "Hourly Compute Slot Hours",
  },
  {
    prop: "currentValue",
    label: "Current Value",
    type: "text",
    defaultValue: "198.0 slot-hr/h",
  },
  {
    prop: "baselineLabel",
    label: "Baseline Label",
    type: "text",
    defaultValue: "14d rolling envelope: 37.0 – 58.0 slot-hr/h",
  },
  {
    prop: "deltaLabel",
    label: "Delta Label",
    type: "text",
    defaultValue: "+340% vs 14d baseline",
  },
  {
    prop: "projectionLabel",
    label: "Projection Label",
    type: "text",
    defaultValue: "Projected to exhaust monthly study allocation in 4 days.",
  },
  {
    prop: "severity",
    label: "Severity",
    type: "select",
    options: ["critical", "warning"],
    defaultValue: "critical",
  },
  {
    prop: "state",
    label: "Lifecycle State",
    type: "select",
    options: ["open", "acknowledged", "snoozed"],
    defaultValue: "open",
  },
];

const anomalyPresets: TuxPlaygroundPreset[] = [
  {
    name: "critical-open",
    label: "Critical Open Excursion",
    description: "Unowned statistical spike breaching 3-sigma baseline envelope",
    icon: "lucide:flame",
    values: {
      severity: "critical",
      state: "open",
      title: "Unbounded Join Scan on Distributed Query Pool",
      currentValue: "198.0 slot-hr/h",
      deltaLabel: "+340% vs 14d baseline",
    },
  },
  {
    name: "acknowledged-triage",
    label: "Acknowledged (ACK != MAINT)",
    description: "Owned incident sunk onto --surface-sunken so unowned alerts stay prominent",
    icon: "lucide:check",
    values: {
      severity: "critical",
      state: "acknowledged",
      title: "Unbounded Join Scan on Distributed Query Pool",
      currentValue: "198.0 slot-hr/h",
      deltaLabel: "+340% vs 14d baseline",
    },
  },
  {
    name: "warning-drift",
    label: "Warning Sensor Drift",
    description: "Moderate throughput excursion on corridor ingest relay",
    icon: "lucide:alert-triangle",
    values: {
      severity: "warning",
      state: "open",
      title: "Elevated Replay Volume on Corridor Ingest Broker",
      targetEntity: "Corridor Ingest Broker · Segment IH-35",
      metricLabel: "Ingest Write Rate",
      currentValue: "3.4 GiB/h",
      baselineLabel: "7d diurnal band: 1.3 – 2.2 GiB/h",
      deltaLabel: "+68% vs 7d baseline",
      projectionLabel: "Local staging volume reaches 85% watermark in 19 hours.",
    },
  },
];

const liveVue = `<tux-anomaly-card
  id="anom-query-04"
  title="Unbounded Join Scan on Distributed Query Pool"
  target-entity="Study 02-411085 · Distributed Query Pool"
  metric-label="Hourly Compute Slot Hours"
  current-value="198.0 slot-hr/h"
  baseline-label="14d rolling envelope: 37.0 – 58.0 slot-hr/h"
  delta-label="+340% vs 14d baseline"
  projection-label="Projected to exhaust monthly study allocation in 4 days."
  rule-summary="actual > 3.0 sigma above 14-day diurnal baseline for >= 30m"
  severity="critical"
  :state="state"
  :series="series"
  @acknowledge="onAcknowledge"
  @snooze="onSnooze"
  @escalate="onEscalate"
/>`;

const comparisonVue = `<tux-anomaly-card
  id="anom-warn-01"
  title="Elevated Replay Volume on Corridor Ingest Broker"
  metric-label="Ingest Write Rate"
  current-value="3.4 GiB/h"
  baseline-label="7d diurnal band: 1.3 – 2.2 GiB/h"
  delta-label="+68% vs 7d baseline"
  severity="warning"
  state="acknowledged"
  :series="egressWarningSeries"
/>`;

const typesTs = `export interface AnomalySeriesPoint {
  label: string;
  actual: number;
  baselineMin: number;
  baselineMax: number;
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · operations & telemetry" title="TuxAnomalyCard">
      Statistical anomaly excursion and quota-burn alert card. Plots an inline
      SVG baseline-envelope sparkband with a highlighted spike marker and follows
      the TUX Ops Doctrine (<code>ACK != MAINT</code>): acknowledged and snoozed
      cards sink onto <code>--surface-sunken</code> rather than borrowing
      maintenance blue.
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-anomaly-card"
        component-name="TuxAnomalyCard"
        title="TuxAnomalyCard Workbench"
        eyebrow="Interactive Component Playground"
        :controls="anomalyControls"
        :presets="anomalyPresets"
        :source="tuxAnomalyCardSource"
      >
        <template #default="{ values }">
          <div class="max-w-2xl w-full">
            <TuxAnomalyCard
              id="anom-workbench"
              :title="values.title"
              :target-entity="values.targetEntity || undefined"
              :metric-label="values.metricLabel"
              :current-value="values.currentValue"
              :baseline-label="values.baselineLabel"
              :delta-label="values.deltaLabel"
              :projection-label="values.projectionLabel || undefined"
              :severity="values.severity"
              :state="values.state"
              rule-summary="actual > 3.0 sigma above 14-day rolling envelope"
              :series="computeSpikeSeries"
              @acknowledge="onAcknowledge"
              @snooze="onSnooze"
              @escalate="onEscalate"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <!-- Flagship Triage Lifecycle -->
    <section>
      <p class="eyebrow">flagship · live triage & ack != maint</p>
      <h2 class="heading--bold text-xl font-bold">Baseline envelope excursion &amp; operator triage</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Click <em>Acknowledge</em> or <em>Snooze 24h</em> below to observe the
        card sink onto <code>--surface-sunken</code> with a muted frame so
        unowned open incidents retain visual priority.
      </p>
      <TuxExample class="mt-4" :vue="liveVue" :source="tuxAnomalyCardSource">
        <div class="max-w-2xl space-y-3">
          <TuxAnomalyCard
            id="anom-query-04"
            title="Unbounded Join Scan on Distributed Query Pool"
            target-entity="Study 02-411085 · Distributed Query Pool"
            metric-label="Hourly Compute Slot Hours"
            current-value="198.0 slot-hr/h"
            baseline-label="14d rolling envelope: 37.0 – 58.0 slot-hr/h"
            delta-label="+340% vs 14d baseline"
            projection-label="Projected to exhaust monthly study allocation in 4 days."
            rule-summary="actual > 3.0 sigma above 14-day diurnal baseline for >= 30m"
            severity="critical"
            :state="liveState"
            :series="computeSpikeSeries"
            @acknowledge="onAcknowledge"
            @snooze="onSnooze"
            @escalate="onEscalate"
          />
          <div class="flex items-center justify-between flex-wrap gap-3 text-xs font-mono text-text-muted">
            <span>{{ triageLog || `state: ${liveState}` }}</span>
            <button
              type="button"
              class="min-h-11 px-3 py-1.5 border border-surface-border rounded bg-surface-sunken text-text-primary cursor-pointer"
              @click="resetTriage"
            >
              Reset state
            </button>
          </div>
        </div>
      </TuxExample>
    </section>

    <!-- Warning / Acknowledged Comparison -->
    <section>
      <p class="eyebrow">owned incident · warning severity</p>
      <h2 class="heading--bold text-xl font-bold">Triaged warning anomaly</h2>
      <TuxExample class="mt-4" :vue="comparisonVue" :source="tuxAnomalyCardSource">
        <div class="max-w-2xl">
          <TuxAnomalyCard
            id="anom-warn-01"
            title="Elevated Replay Volume on Corridor Ingest Broker"
            target-entity="Corridor Ingest Broker · Segment IH-35"
            metric-label="Ingest Write Rate"
            current-value="3.4 GiB/h"
            baseline-label="7d diurnal band: 1.3 – 2.2 GiB/h"
            delta-label="+68% vs 7d baseline"
            severity="warning"
            state="acknowledged"
            :series="egressWarningSeries"
          />
        </div>
      </TuxExample>
    </section>

    <!-- Data Shape -->
    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Sparkband series point interface</h2>
      <TuxCodeBlock class="mt-4" :code="typesTs" lang="ts" filename="TuxAnomalyCard.ts" />
    </section>
  </div>
</template>
