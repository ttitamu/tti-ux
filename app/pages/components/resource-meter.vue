<script setup lang="ts">
import tuxResourceMeterSource from "~/components/TuxResourceMeter.vue?raw";
import type { ResourceChannelMetric } from "~/components/TuxResourceMeter.vue";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxResourceMeter · TUX" });

const initialGpuClusterChannels: ResourceChannelMetric[] = [
  {
    id: "vcpu",
    label: "vCPU Cores",
    capacity: 128,
    allocated: 96,
    utilized: 18,
    unit: "cores",
  },
  {
    id: "memory",
    label: "System Memory",
    capacity: 1024,
    allocated: 768,
    utilized: 612,
    unit: "GiB",
  },
  {
    id: "gpu",
    label: "GPU Accelerators",
    capacity: 16,
    allocated: 12,
    utilized: 2,
    unit: "GPUs",
  },
  {
    id: "nvme",
    label: "NVMe Scratch Pool",
    capacity: 64,
    allocated: 60,
    utilized: 56,
    unit: "TiB",
  },
];

const balancedPoolChannels: ResourceChannelMetric[] = [
  {
    id: "workers",
    label: "Compute Worker Slots",
    capacity: 64,
    allocated: 48,
    utilized: 41,
    unit: "slots",
  },
  {
    id: "ram",
    label: "Buffer Cache Memory",
    capacity: 512,
    allocated: 384,
    utilized: 310,
    unit: "GiB",
  },
  {
    id: "storage",
    label: "Archive Object Volume",
    capacity: 200,
    allocated: 140,
    utilized: 118,
    unit: "TiB",
  },
];

const liveChannels = ref<ResourceChannelMetric[]>(
  structuredClone(initialGpuClusterChannels),
);
const actionLog = ref<string>("");

function onReclaim(flagged: ResourceChannelMetric[]) {
  const names = flagged.map((c) => c.label).join(", ");
  actionLog.value = `Reclaimed idle reservations across ${flagged.length} channel(s): ${names}`;
  const flaggedIds = new Set(flagged.map((c) => c.id));
  liveChannels.value = liveChannels.value.map((ch) =>
    flaggedIds.has(ch.id)
      ? {
          ...ch,
          allocated: Math.max(ch.utilized + Math.ceil(ch.capacity * 0.05), ch.utilized),
        }
      : ch,
  );
}

function onSelectChannel(channel: ResourceChannelMetric) {
  actionLog.value = `Selected ${channel.label}: ${channel.utilized} / ${channel.allocated} ${channel.unit} active`;
}

function resetCluster() {
  liveChannels.value = structuredClone(initialGpuClusterChannels);
  actionLog.value = "";
}

const meterControls: TuxPropControl[] = [
  {
    prop: "title",
    label: "Pool Title",
    type: "text",
    defaultValue: "On-Prem GPU Cluster",
  },
  {
    prop: "subtitle",
    label: "Subtitle",
    type: "text",
    defaultValue: "Study 02-411085 · Vision & LiDAR Trajectory Batch Quota",
  },
  {
    prop: "poolStatus",
    label: "Pool Status",
    type: "select",
    options: ["ok", "warning", "critical", "maintenance"],
    defaultValue: "warning",
  },
  {
    prop: "wasteThresholdRatio",
    label: "Waste Threshold Ratio",
    type: "number",
    defaultValue: 0.35,
  },
  {
    prop: "saturationThresholdRatio",
    label: "Saturation Threshold Ratio",
    type: "number",
    defaultValue: 0.85,
  },
  {
    prop: "reclaimLabel",
    label: "Reclaim Button Label",
    type: "text",
    defaultValue: "Reclaim Idle",
  },
  {
    prop: "showReclaimAction",
    label: "Show Reclaim Action",
    type: "boolean",
    defaultValue: true,
  },
];

const meterPresets: TuxPlaygroundPreset[] = [
  {
    name: "zombie-reservations",
    label: "Idle Over-Reservation",
    description: "Highlights idle reserved slices eligible for quota reclamation",
    icon: "lucide:gauge",
    values: {
      title: "On-Prem GPU Cluster",
      subtitle: "Study 02-411085 · Vision & LiDAR Trajectory Batch Quota",
      poolStatus: "warning",
      wasteThresholdRatio: 0.35,
      saturationThresholdRatio: 0.85,
      reclaimLabel: "Reclaim Idle",
      showReclaimAction: true,
    },
  },
  {
    name: "strict-saturation",
    label: "Tight Saturation Guard",
    description: "Lowers saturation threshold to surface storage & memory pressure early",
    icon: "lucide:alert-triangle",
    values: {
      title: "Distributed Query Pool",
      subtitle: "Regional Corridor Telemetry Aggregation Tier",
      poolStatus: "critical",
      wasteThresholdRatio: 0.3,
      saturationThresholdRatio: 0.55,
      reclaimLabel: "Right-Size Quota",
      showReclaimAction: true,
    },
  },
  {
    name: "maintenance-readonly",
    label: "Maintenance Window (Read-Only)",
    description: "Passive capacity inspection during scheduled node drain",
    icon: "lucide:wrench",
    values: {
      title: "On-Prem GPU Cluster",
      subtitle: "Scheduled kernel & firmware rolling upgrade",
      poolStatus: "maintenance",
      wasteThresholdRatio: 0.35,
      saturationThresholdRatio: 0.85,
      reclaimLabel: "Reclaim Idle",
      showReclaimAction: false,
    },
  },
];

const flagshipVue = `<tux-resource-meter
  title="On-Prem GPU Cluster"
  subtitle="Study 02-411085 · Corridor Vision & Sensor Fusion Pool"
  pool-status="warning"
  :channels="channels"
  @reclaim="onReclaim"
  @select-channel="onSelectChannel"
/>`;

const balancedVue = `<tux-resource-meter
  title="Distributed Query Pool"
  subtitle="Statewide Traffic Count Analytical Tier"
  pool-status="ok"
  :channels="balancedChannels"
  :show-reclaim-action="false"
/>`;

const typesTs = `export interface ResourceChannelMetric {
  id: string;
  label: string;        // e.g. "vCPU Cores", "System Memory", "GPU Accelerators"
  capacity: number;     // total physical/quota pool capacity (e.g. 128)
  allocated: number;    // reserved/billed slice (e.g. 96)
  utilized: number;     // actual active usage (e.g. 18)
  unit: string;         // e.g. "cores", "GiB", "GPUs", "TiB"
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · operations & telemetry" title="TuxResourceMeter">
      Dual-overlay capacity and allocation efficiency meter for compute clusters,
      query pools, and storage tiers. Contrasts hatched <em>Allocated</em> quota
      slices against solid <em>Active Utilized</em> load so operators immediately
      spot idle over-reserved ("zombie") allocations alongside saturated channels.
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-resource-meter"
        component-name="TuxResourceMeter"
        title="TuxResourceMeter Workbench"
        eyebrow="Interactive Component Playground"
        :controls="meterControls"
        :presets="meterPresets"
        :source="tuxResourceMeterSource"
      >
        <template #default="{ values }">
          <div class="max-w-3xl w-full">
            <TuxResourceMeter
              :title="values.title"
              :subtitle="values.subtitle || undefined"
              :pool-status="values.poolStatus"
              :channels="liveChannels"
              :waste-threshold-ratio="values.wasteThresholdRatio"
              :saturation-threshold-ratio="values.saturationThresholdRatio"
              :reclaim-label="values.reclaimLabel"
              :show-reclaim-action="values.showReclaimAction"
              @reclaim="onReclaim"
              @select-channel="onSelectChannel"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <!-- Flagship Interactive Reclamation Workflow -->
    <section>
      <p class="eyebrow">flagship · idle reservation detection & reclamation</p>
      <h2 class="heading--bold text-xl font-bold">On-prem compute quota right-sizing</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Channels reserving at least 25% of pool capacity while utilizing below
        <code>wasteThresholdRatio</code> (default <code>0.35</code>) surface an
        <strong>Idle Waste</strong> flag and enable the one-click
        <em>Reclaim Idle</em> action. Channels exceeding
        <code>saturationThresholdRatio</code> (default <code>0.85</code>) surface
        a <strong>Saturated</strong> indicator.
      </p>
      <TuxExample class="mt-4" :vue="flagshipVue" :source="tuxResourceMeterSource">
        <div class="max-w-3xl space-y-3">
          <TuxResourceMeter
            title="On-Prem GPU Cluster"
            subtitle="Study 02-411085 · Corridor Vision & Sensor Fusion Pool"
            pool-status="warning"
            :channels="liveChannels"
            @reclaim="onReclaim"
            @select-channel="onSelectChannel"
          />
          <div class="flex items-center justify-between flex-wrap gap-3 text-xs font-mono text-text-muted">
            <span>{{ actionLog || "state: 2 idle-waste channels · 1 saturated channel" }}</span>
            <button
              type="button"
              class="min-h-11 px-3 py-1.5 border border-surface-border rounded bg-surface-sunken text-text-primary cursor-pointer"
              @click="resetCluster"
            >
              Reset pool quotas
            </button>
          </div>
        </div>
      </TuxExample>
    </section>

    <!-- Balanced Wallboard Example -->
    <section>
      <p class="eyebrow">balanced pool · passive telemetry</p>
      <h2 class="heading--bold text-xl font-bold">High-efficiency query pool</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        When active utilization tracks closely with reserved allocations and no
        channels breach saturation, the reclamation button automatically stays
        hidden.
      </p>
      <TuxExample class="mt-4" :vue="balancedVue" :source="tuxResourceMeterSource">
        <div class="max-w-3xl">
          <TuxResourceMeter
            title="Distributed Query Pool"
            subtitle="Statewide Traffic Count Analytical Tier"
            pool-status="ok"
            :channels="balancedPoolChannels"
            :show-reclaim-action="false"
          />
        </div>
      </TuxExample>
    </section>

    <!-- Data Shape -->
    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Resource channel interface</h2>
      <TuxCodeBlock class="mt-4" :code="typesTs" lang="ts" filename="TuxResourceMeter.ts" />
    </section>
  </div>
</template>
