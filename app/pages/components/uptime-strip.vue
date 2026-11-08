<script setup lang="ts">
import tuxUptimeStripSource from "~/components/TuxUptimeStrip.vue?raw";
import type { UptimeBucketItem } from "~/components/TuxUptimeStrip.vue";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxUptimeStrip · TUX" });

function buildSampleBuckets(): UptimeBucketItem[] {
  const items: UptimeBucketItem[] = [];
  for (let day = 1; day <= 30; day++) {
    const dd = String(day).padStart(2, "0");
    const label = `2026-10-${dd}`;
    if (day === 9) {
      items.push({
        id: `d-${dd}`,
        label,
        state: "maintenance",
        uptimePct: 100,
        latencyMs: 31,
        incidentSummary: "Scheduled 20m rolling broker certificate rotation.",
      });
    } else if (day === 18) {
      items.push({
        id: `d-${dd}`,
        label,
        state: "outage",
        uptimePct: 97.4,
        latencyMs: 410,
        incidentSummary: "37m upstream fiber cut at regional corridor cabinet.",
      });
    } else if (day === 24) {
      items.push({
        id: `d-${dd}`,
        label,
        state: "degraded",
        uptimePct: 99.65,
        latencyMs: 148,
        incidentSummary: "12m partition rebalance backlog during peak rush.",
      });
    } else {
      items.push({
        id: `d-${dd}`,
        label,
        state: "operational",
        uptimePct: 100,
        latencyMs: 22 + (day % 9),
      });
    }
  }
  return items;
}

const ingestBrokerBuckets = buildSampleBuckets();

const catalogServiceBuckets: UptimeBucketItem[] = Array.from(
  { length: 30 },
  (_, idx) => {
    const dd = String(idx + 1).padStart(2, "0");
    if (idx === 14) {
      return {
        id: `cat-${dd}`,
        label: `2026-10-${dd}`,
        state: "degraded",
        uptimePct: 99.88,
        latencyMs: 92,
        incidentSummary: "8m table metadata lock contention during schema compaction.",
      };
    }
    return {
      id: `cat-${dd}`,
      label: `2026-10-${dd}`,
      state: "operational",
      uptimePct: 100,
      latencyMs: 14 + (idx % 5),
    };
  },
);

const selectedLog = ref<string>("");

function onSelectBucket(bucket: UptimeBucketItem) {
  selectedLog.value = `Inspected ${bucket.label}: ${bucket.state.toUpperCase()} (${bucket.uptimePct ?? 100}% · ${bucket.latencyMs ?? 0} ms)`;
}

const uptimeControls: TuxPropControl[] = [
  {
    prop: "serviceName",
    label: "Service Name",
    type: "text",
    defaultValue: "Corridor Ingest Broker",
  },
  {
    prop: "serviceGroup",
    label: "Service Group",
    type: "text",
    defaultValue: "Telemetry Pipeline",
  },
  {
    prop: "windowLabel",
    label: "Window Label",
    type: "text",
    defaultValue: "Last 30 days",
  },
  {
    prop: "slaTargetPct",
    label: "SLA Target (%)",
    type: "number",
    defaultValue: 99.9,
  },
  {
    prop: "currentLatencyMs",
    label: "Current Latency (ms)",
    type: "number",
    defaultValue: 28,
  },
];

const uptimePresets: TuxPlaygroundPreset[] = [
  {
    name: "sla-breached",
    label: "SLA Breached (99.9% Target)",
    description: "30-day corridor broker history with 1 outage and 1 degraded day",
    icon: "lucide:activity",
    values: {
      serviceName: "Corridor Ingest Broker",
      serviceGroup: "Telemetry Pipeline",
      windowLabel: "Last 30 days",
      slaTargetPct: 99.9,
      currentLatencyMs: 28,
    },
  },
  {
    name: "sla-compliant",
    label: "Standard Tier (99.5% SLA Met)",
    description: "Evaluates the same telemetry window against a 99.5% tier target",
    icon: "lucide:check-circle-2",
    values: {
      serviceName: "Corridor Ingest Broker",
      serviceGroup: "Field Relay Tier",
      windowLabel: "Last 30 days",
      slaTargetPct: 99.5,
      currentLatencyMs: 28,
    },
  },
  {
    name: "strict-four-nines",
    label: "Strict 99.99% Target",
    description: "Mission-critical availability target for core catalog services",
    icon: "lucide:shield-alert",
    values: {
      serviceName: "Table Catalog Service",
      serviceGroup: "Core Metadata",
      windowLabel: "Last 30 days",
      slaTargetPct: 99.99,
      currentLatencyMs: 16,
    },
  },
];

const stripVue = `<tux-uptime-strip
  service-name="Corridor Ingest Broker"
  service-group="Telemetry Pipeline"
  :buckets="buckets"
  window-label="Last 30 days"
  :sla-target-pct="99.9"
  :current-latency-ms="28"
  @select-bucket="onSelectBucket"
/>`;

const stackVue = `<tux-uptime-strip
  service-name="Table Catalog Service"
  service-group="Research Data Platform"
  :buckets="catalogBuckets"
  :sla-target-pct="99.9"
  :current-latency-ms="16"
/>`;

const typesTs = `export type UptimeBucketState =
  | "operational"
  | "degraded"
  | "outage"
  | "maintenance"
  | "empty";

export interface UptimeBucketItem {
  id: string;
  label: string;             // e.g. "2026-11-01" or "14:00 UTC"
  state: UptimeBucketState;
  uptimePct?: number;        // e.g. 99.98
  incidentSummary?: string;  // e.g. "12m table metadata lock"
  latencyMs?: number;
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · operations & telemetry" title="TuxUptimeStrip">
      Rolling SLI availability bar and incident bucket inspector. Pairs
      <code>--status-*</code> tick encoding and redundant bar heights with full
      <code>ArrowLeft</code> / <code>ArrowRight</code> / <code>Home</code> /
      <code>End</code> roving keyboard navigation and 44×44px stepper controls.
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-uptime-strip"
        component-name="TuxUptimeStrip"
        title="TuxUptimeStrip Workbench"
        eyebrow="Interactive Component Playground"
        :controls="uptimeControls"
        :presets="uptimePresets"
        :source="tuxUptimeStripSource"
      >
        <template #default="{ values }">
          <div class="max-w-3xl w-full">
            <TuxUptimeStrip
              :service-name="values.serviceName"
              :service-group="values.serviceGroup || undefined"
              :buckets="ingestBrokerBuckets"
              :window-label="values.windowLabel"
              :sla-target-pct="values.slaTargetPct"
              :current-latency-ms="values.currentLatencyMs"
              @select-bucket="onSelectBucket"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <!-- Flagship Multi-Service Status Rollup -->
    <section>
      <p class="eyebrow">flagship · interactive bucket inspection</p>
      <h2 class="heading--bold text-xl font-bold">Service SLI availability board</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Click any daily tick, press the 44×44px stepper buttons, or focus the
        listbox strip and use arrow keys to inspect per-day availability,
        response latency, and incident notes.
      </p>
      <TuxExample class="mt-4" :vue="stripVue" :source="tuxUptimeStripSource">
        <div class="max-w-3xl space-y-4">
          <TuxUptimeStrip
            service-name="Corridor Ingest Broker"
            service-group="Telemetry Pipeline"
            :buckets="ingestBrokerBuckets"
            window-label="Last 30 days"
            :sla-target-pct="99.9"
            :current-latency-ms="28"
            @select-bucket="onSelectBucket"
          />
          <p class="text-xs font-mono text-text-muted">
            {{ selectedLog || "Focus the tick strip and press ArrowLeft / Home to inspect historical incidents." }}
          </p>
        </div>
      </TuxExample>
    </section>

    <!-- SLA Met Comparison -->
    <section>
      <p class="eyebrow">sla compliance · catalog service</p>
      <h2 class="heading--bold text-xl font-bold">Compliant rolling availability</h2>
      <TuxExample class="mt-4" :vue="stackVue" :source="tuxUptimeStripSource">
        <div class="max-w-3xl">
          <TuxUptimeStrip
            service-name="Table Catalog Service"
            service-group="Research Data Platform"
            :buckets="catalogServiceBuckets"
            :sla-target-pct="99.9"
            :current-latency-ms="16"
          />
        </div>
      </TuxExample>
    </section>

    <!-- Data Shape -->
    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Uptime bucket interface</h2>
      <TuxCodeBlock class="mt-4" :code="typesTs" lang="ts" filename="TuxUptimeStrip.ts" />
    </section>
  </div>
</template>
