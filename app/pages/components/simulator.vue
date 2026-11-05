<script setup>
// Per ADR-0010, keep top-level <script setup> expressions plain JS.
import tuxSimulatorSource from "~/components/TuxSimulator.vue?raw";

useHead({ title: "TuxSimulator · TUX" });

const initialWorkloadParams = [
  {
    id: "gpu-hours",
    label: "Accelerated GPU Compute",
    description: "80GB multi-GPU training and computer-vision inference runs",
    unit: "GPU-hr",
    min: 0,
    max: 1000,
    step: 10,
    value: 240,
    primaryRate: 2.15,
    comparisonRate: 4.1,
  },
  {
    id: "archive-storage",
    label: "Parquet Archive Storage",
    description: "Columnar corridor telemetry and calibrated LiDAR point clouds",
    unit: "TiB-mo",
    min: 0,
    max: 500,
    step: 5,
    value: 80,
    primaryRate: 12.0,
    comparisonRate: 23.5,
  },
  {
    id: "sim-vcpu",
    label: "Microsimulation vCPU Pool",
    description: "Parallel mesoscopic corridor traffic assignment workers",
    unit: "vCPU-hr",
    min: 0,
    max: 10000,
    step: 100,
    value: 3200,
    primaryRate: 0.08,
    comparisonRate: 0.14,
  },
];

const scenarioPresets = [
  {
    id: "pilot-study",
    label: "Pilot Corridor Study",
    values: {
      "gpu-hours": 120,
      "archive-storage": 35,
      "sim-vcpu": 1500,
    },
  },
  {
    id: "quarterly-baseline",
    label: "Quarterly Baseline",
    values: {
      "gpu-hours": 240,
      "archive-storage": 80,
      "sim-vcpu": 3200,
    },
  },
  {
    id: "full-scale-surge",
    label: "Full-Scale Model Surge",
    values: {
      "gpu-hours": 780,
      "archive-storage": 220,
      "sim-vcpu": 8400,
    },
  },
];

const simParams = ref(structuredClone(initialWorkloadParams));
const overBudgetParams = ref([
  {
    id: "gpu-burst",
    label: "On-Prem GPU Cluster Burst",
    unit: "GPU-hr",
    min: 0,
    max: 1000,
    step: 25,
    value: 650,
    primaryRate: 2.4,
    comparisonRate: 4.2,
  },
  {
    id: "sensor-ingest",
    label: "Corridor Video Frame Processing",
    unit: "k-frames",
    min: 0,
    max: 2000,
    step: 50,
    value: 900,
    primaryRate: 0.65,
    comparisonRate: 1.1,
  },
]);

const playgroundControls = [
  {
    prop: "title",
    label: "Simulator Title",
    type: "text",
    defaultValue: "Study 02-410922 Workload & Cost Simulator",
  },
  {
    prop: "primaryLabel",
    label: "Primary Pool Label",
    type: "text",
    defaultValue: "On-Prem Shared Pool",
  },
  {
    prop: "comparisonLabel",
    label: "Comparison Pool Label",
    type: "text",
    defaultValue: "External Compute Pool",
  },
  {
    prop: "budgetLimit",
    label: "Budget Ceiling ($)",
    type: "number",
    defaultValue: 3500,
  },
  {
    prop: "showComparison",
    label: "Show Baseline Comparison",
    type: "boolean",
    defaultValue: true,
  },
];

const playgroundPresets = [
  {
    name: "pool-comparison",
    label: "On-Prem vs External Pool",
    description: "Side-by-side unit cost comparison against a $3,500 quarterly study ceiling",
    icon: "lucide:scale",
    values: {
      title: "Study 02-410922 Workload & Cost Simulator",
      primaryLabel: "On-Prem Shared Pool",
      comparisonLabel: "External Compute Pool",
      budgetLimit: 3500,
      showComparison: true,
    },
  },
  {
    name: "direct-estimate",
    label: "Single-Pool Grant Estimate",
    description: "Focused proposal cost estimator without external comparison columns",
    icon: "lucide:sliders-horizontal",
    values: {
      title: "Proposal Resource Allocation Estimator",
      primaryLabel: "Institutional Tariff",
      comparisonLabel: "Baseline Pool",
      budgetLimit: 2500,
      showComparison: false,
    },
  },
];

const flagshipVue = `<tux-simulator
  v-model:parameters="simParams"
  title="Study 02-410922 Quarterly Resource Projection"
  subtitle="Compare shared institutional cluster rates against external commercial compute pools."
  :presets="scenarioPresets"
  primary-label="On-Prem Shared Pool"
  comparison-label="External Compute Pool"
  :budget-limit="3500"
/>`;

const ceilingVue = `<tux-simulator
  v-model:parameters="overBudgetParams"
  title="Peak Processing Window — Ceiling Alert"
  primary-label="Proposed Allocation"
  :budget-limit="1800"
  :show-comparison="false"
/>`;

const typesTs = `export interface SimulatorParameter {
  id: string;
  label: string;
  description?: string;
  unit: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  primaryRate: number;      // e.g. self-hosted or proposed unit rate
  comparisonRate?: number;  // optional external/baseline unit rate for delta comparison
}

export interface SimulatorPreset {
  id: string;
  label: string;
  values: Record<string, number>;
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · forecasting & estimation" title="TuxSimulator">
      Interactive multi-parameter workload and cost projection calculator.
      Pairs accessible range sliders with exact numeric inputs, scenario
      presets, side-by-side baseline pool delta/savings math, and budget
      ceiling utilization alerts.
    </TuxPageHeader>

    <section>
      <TuxPlayground
        tag="tux-simulator"
        component-name="TuxSimulator"
        title="Workload & Cost Simulator Workbench"
        eyebrow="Interactive Component Lab"
        :controls="playgroundControls"
        :presets="playgroundPresets"
        :source="tuxSimulatorSource"
        :code-template="(values) => {
          const budgetAttr = values.budgetLimit > 0 ? `\n  :budget-limit=\x22${values.budgetLimit}\x22` : '';
          const compAttr = !values.showComparison ? '\n  :show-comparison=\x22false\x22' : '';
          return `<tux-simulator\n  v-model:parameters=\x22simParams\x22\n  title=\x22${values.title}\x22\n  primary-label=\x22${values.primaryLabel}\x22\n  comparison-label=\x22${values.comparisonLabel}\x22${budgetAttr}${compAttr}\n/>`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full">
            <TuxSimulator
              v-model:parameters="simParams"
              :title="values.title"
              :presets="scenarioPresets"
              :primary-label="values.primaryLabel"
              :comparison-label="values.comparisonLabel"
              :budget-limit="values.budgetLimit"
              :show-comparison="values.showComparison"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">flagship · multi-pool savings &amp; scenario presets</p>
      <h2 class="heading--bold text-xl font-bold">
        On-prem cluster vs. external compute pool cost comparison
      </h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Switch between named workload scenarios or type exact quantities into
        the synced numeric inputs to evaluate projected line-item charges,
        net savings percentage, and remaining study budget headroom.
      </p>
      <TuxExample class="mt-4" :vue="flagshipVue" :source="tuxSimulatorSource">
        <TuxSimulator
          v-model:parameters="simParams"
          title="Study 02-410922 Quarterly Resource Projection"
          subtitle="Compare shared institutional cluster rates against external commercial compute pools."
          :presets="scenarioPresets"
          primary-label="On-Prem Shared Pool"
          comparison-label="External Compute Pool"
          :budget-limit="3500"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">over-ceiling · live budget threshold status</p>
      <h2 class="heading--bold text-xl font-bold">
        Allocation exceeding authorized study budget ceiling
      </h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        When projected primary charges exceed <code>budgetLimit</code>, the
        live <code>role="status"</code> footer announces the exact overage
        amount alongside a multi-channel status badge.
      </p>
      <TuxExample class="mt-4" :vue="ceilingVue">
        <TuxSimulator
          v-model:parameters="overBudgetParams"
          title="Peak Processing Window — Ceiling Alert"
          primary-label="Proposed Allocation"
          :budget-limit="1800"
          :show-comparison="false"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Exported interfaces</h2>
      <TuxCodeBlock class="mt-4" :code="typesTs" lang="ts" filename="TuxSimulator.ts" />
    </section>
  </div>
</template>
