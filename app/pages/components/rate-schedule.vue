<script setup>
// Per ADR-0010, keep top-level <script setup> expressions plain JS.
import tuxRateScheduleSource from "~/components/TuxRateSchedule.vue?raw";

useHead({ title: "TuxRateSchedule · TUX" });

const initialSchedules = [
  {
    id: "rs-gpu-h100",
    code: "CMP-GPU-01",
    name: "On-Prem GPU Cluster (80GB Node)",
    category: "Accelerated Compute",
    unit: "GPU-hr",
    pricingModel: "tiered",
    baseRate: 2.4,
    overheadMultiplier: 1.15,
    effectiveFrom: "2026-09-01",
    effectiveTo: null,
    status: "active",
    tiers: [
      { id: "t-1", label: "Baseline Allocation", fromQuantity: 0, upToQuantity: 100, unitRate: 2.4 },
      { id: "t-2", label: "Sustained Study Tier", fromQuantity: 100, upToQuantity: 500, unitRate: 1.95 },
      { id: "t-3", label: "Bulk Batch Window", fromQuantity: 500, upToQuantity: null, unitRate: 1.55 },
    ],
  },
  {
    id: "rs-archive-parquet",
    code: "STR-PRQ-04",
    name: "Parquet Archive Storage Pool",
    category: "Research Data Storage",
    unit: "TiB-mo",
    pricingModel: "volume",
    baseRate: 14.5,
    overheadMultiplier: 1.0,
    effectiveFrom: "2026-09-01",
    effectiveTo: null,
    status: "active",
    tiers: [
      { id: "v-1", label: "Standard Tier", fromQuantity: 0, upToQuantity: 50, unitRate: 14.5 },
      { id: "v-2", label: "Corridor Telemetry Pool", fromQuantity: 50, upToQuantity: 250, unitRate: 11.8 },
      { id: "v-3", label: "Multi-Year Archive", fromQuantity: 250, upToQuantity: null, unitRate: 9.25 },
    ],
  },
  {
    id: "rs-vcpu-fy27",
    code: "CMP-CPU-09",
    name: "High-Memory Simulation vCPU Pool",
    category: "General Compute",
    unit: "vCPU-hr",
    pricingModel: "flat",
    baseRate: 0.085,
    overheadMultiplier: 1.1,
    effectiveFrom: "2027-01-01",
    effectiveTo: "2027-08-31",
    status: "scheduled",
  },
  {
    id: "rs-lidar-fy25",
    code: "ING-LDR-02",
    name: "Roadside LiDAR Frame Ingestion",
    category: "Sensor Telemetry",
    unit: "k-frames",
    pricingModel: "flat",
    baseRate: 0.42,
    overheadMultiplier: 1.0,
    effectiveFrom: "2025-09-01",
    effectiveTo: "2026-08-31",
    status: "archived",
  },
];

const scheduleItems = ref(structuredClone(initialSchedules));
const lastAction = ref(null);

function onSelect(item) {
  lastAction.value = `Selected ${item.code} (${item.name})`;
}

function onCreateRevision(item) {
  lastAction.value = `Drafted revision from ${item.code} effective next period`;
}

const playgroundControls = [
  {
    prop: "title",
    label: "Schedule Title",
    type: "text",
    defaultValue: "Effective-Dated Rate Schedule",
  },
  {
    prop: "statusFilter",
    label: "Status Filter",
    type: "select",
    options: ["all", "active", "scheduled", "archived"],
    defaultValue: "all",
  },
  {
    prop: "sampleQuantity",
    label: "Sample Preview Quantity",
    type: "number",
    defaultValue: 150,
  },
  {
    prop: "currencySymbol",
    label: "Currency Symbol",
    type: "text",
    defaultValue: "$",
  },
  {
    prop: "editable",
    label: "Inline Rate Editing",
    type: "boolean",
    defaultValue: true,
  },
];

const playgroundPresets = [
  {
    name: "fy27-active-review",
    label: "Active Rate Review",
    description: "Editable active rate schedules evaluated at 250 sample units",
    icon: "lucide:calculator",
    values: {
      title: "FY27 Shared Compute & Storage Rate Schedule",
      statusFilter: "active",
      sampleQuantity: 250,
      currencySymbol: "$",
      editable: true,
    },
  },
  {
    name: "published-catalog",
    label: "Published Read-Only Tariff",
    description: "Locked institutional rate catalog across all effective epochs",
    icon: "lucide:lock",
    values: {
      title: "Published Institutional Resource Tariff",
      statusFilter: "all",
      sampleQuantity: 100,
      currencySymbol: "$",
      editable: false,
    },
  },
];

const flagshipVue = `<tux-rate-schedule
  v-model:items="scheduleItems"
  title="Shared Research Compute & Telemetry Tariff"
  subtitle="FY27 institutional recovery rates including indirect facility overhead multipliers."
  :sample-quantity="250"
  @select="onSelect"
  @create-revision="onCreateRevision"
/>`;

const readOnlyVue = `<tux-rate-schedule
  :items="scheduleItems"
  title="Published Active Rate Sheet"
  status-filter="active"
  :sample-quantity="600"
  :editable="false"
/>`;

const typesTs = `export interface RateTierBracket {
  id: string;
  label: string;
  fromQuantity: number;
  upToQuantity?: number | null; // null/undefined = unbounded ("∞")
  unitRate: number;
}

export interface RateScheduleItem {
  id: string;
  code: string;
  name: string;
  category?: string;
  unit: string; // e.g. "GPU-hr", "TiB-mo", "vCPU-hr"
  pricingModel: "flat" | "tiered" | "volume";
  baseRate: number;
  overheadMultiplier?: number; // default 1.0
  effectiveFrom: string;
  effectiveTo?: string | null;
  status: "active" | "scheduled" | "archived";
  tiers?: RateTierBracket[];
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · chargeback & tariff" title="TuxRateSchedule">
      Effective-dated resource tariff schedule with status epoch filtering,
      live sample-quantity preview math across flat, stepped tiered, and
      volume pricing brackets, inline rate/overhead adjustment, and one-click
      revision drafting.
    </TuxPageHeader>

    <section>
      <TuxPlayground
        tag="tux-rate-schedule"
        component-name="TuxRateSchedule"
        title="Rate Schedule Workbench"
        eyebrow="Interactive Component Lab"
        :controls="playgroundControls"
        :presets="playgroundPresets"
        :source="tuxRateScheduleSource"
        :code-template="(values) => {
          const filterAttr = values.statusFilter !== 'all' ? `\n  status-filter=\x22${values.statusFilter}\x22` : '';
          const qtyAttr = values.sampleQuantity !== 100 ? `\n  :sample-quantity=\x22${values.sampleQuantity}\x22` : '';
          const editAttr = !values.editable ? '\n  :editable=\x22false\x22' : '';
          return `<tux-rate-schedule\n  v-model:items=\x22scheduleItems\x22\n  title=\x22${values.title}\x22${filterAttr}${qtyAttr}${editAttr}\n/>`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full">
            <TuxRateSchedule
              v-model:items="scheduleItems"
              :title="values.title"
              :status-filter="values.statusFilter"
              :sample-quantity="values.sampleQuantity"
              :currency-symbol="values.currencySymbol || '$'"
              :editable="values.editable"
              @select="onSelect"
              @create-revision="onCreateRevision"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">flagship · interactive tariff calibration</p>
      <h2 class="heading--bold text-xl font-bold">
        Effective-dated compute and archive storage schedules
      </h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Expand tiered or volume rows to inspect bracket allocations at any
        preview quantity, edit base rates or overhead multipliers inline, and
        trigger <strong>New Revision</strong> on active schedules.
      </p>
      <TuxExample class="mt-4" :vue="flagshipVue" :source="tuxRateScheduleSource">
        <div class="space-y-3">
          <TuxRateSchedule
            v-model:items="scheduleItems"
            title="Shared Research Compute & Telemetry Tariff"
            subtitle="FY27 institutional recovery rates including indirect facility overhead multipliers."
            :sample-quantity="250"
            @select="onSelect"
            @create-revision="onCreateRevision"
          />
          <p v-if="lastAction" class="text-xs font-mono text-text-secondary">
            Event: {{ lastAction }}
          </p>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">read-only · published rate sheet</p>
      <h2 class="heading--bold text-xl font-bold">Locked active-only tariff view</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>:editable="false"</code> and <code>status-filter="active"</code>
        when presenting ratified study recovery rates to principal investigators.
      </p>
      <TuxExample class="mt-4" :vue="readOnlyVue">
        <TuxRateSchedule
          :items="scheduleItems"
          title="Published Active Rate Sheet"
          status-filter="active"
          :sample-quantity="600"
          :editable="false"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Exported interfaces</h2>
      <TuxCodeBlock class="mt-4" :code="typesTs" lang="ts" filename="TuxRateSchedule.ts" />
    </section>
  </div>
</template>
