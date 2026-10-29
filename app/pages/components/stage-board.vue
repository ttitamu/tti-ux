<script setup>
// Per ADR-0010, keep top-level <script setup> expressions plain JS.
useHead({ title: "TuxStageBoard · TUX" });

const corridorStages = [
  { id: "intake", label: "Field Intake", description: "Logged corridor requests" },
  { id: "calibration", label: "Bench Calibration", description: "Lab timing & bench QA" },
  { id: "deployment", label: "Roadside Cutover", description: "Active cabinet updates" },
  { id: "verified", label: "Verified", description: "Post-cutover telemetry sign-off" },
];

const initialWorkOrders = [
  {
    id: "wo-101",
    stageId: "intake",
    code: "SIG-204",
    title: "SH-6 & University Dr Progression",
    subtitle: "PM peak arterial green-wave retiming",
    owner: "A. Morales",
    metricValue: 14,
    tags: ["arterial", "retiming"],
    priority: "high",
  },
  {
    id: "wo-102",
    stageId: "calibration",
    code: "WIM-088",
    title: "US-290 Piezoelectric Axle Array",
    subtitle: "Quartz sensor drift compensation",
    owner: "K. Lindqvist",
    metricValue: 8,
    tags: ["freight", "wim"],
    priority: "critical",
  },
  {
    id: "wo-103",
    stageId: "calibration",
    code: "RAD-412",
    title: "FM-2818 Dilemma-Zone Radar",
    subtitle: "Approach speed threshold verification",
    owner: "D. Okafor",
    metricValue: 6,
    tags: ["safety", "radar"],
    priority: "normal",
  },
  {
    id: "wo-104",
    stageId: "deployment",
    code: "CV-019",
    title: "Transit Signal Priority RSU Corridor",
    subtitle: "SPaT broadcast latency validation",
    owner: "S. Patel",
    metricValue: 11,
    tags: ["v2x", "transit"],
    priority: "normal",
  },
];

const workOrders = ref(structuredClone(initialWorkOrders));
const selectedCard = ref(null);
const lastMove = ref(null);

function onMove(payload) {
  lastMove.value = payload;
  workOrders.value = workOrders.value.map((item) =>
    item.id === payload.itemId ? { ...item, stageId: payload.toStageId } : item,
  );
}

function onSelect(item) {
  selectedCard.value = item;
}

const flagshipVue = `<tux-stage-board
  :stages="corridorStages"
  :items="workOrders"
  metric-suffix=" sensors"
  @move="onMove"
  @select="onSelect"
/>`;

const readonlyVue = `<tux-stage-board
  :stages="corridorStages.slice(0, 3)"
  :items="workOrders.slice(0, 3)"
  metric-suffix=" sensors"
  :movable="false"
/>`;

const typesTs = `export interface StageLane {
  id: string;
  label: string;
  description?: string;
}

export interface StageCardItem {
  id: string;
  stageId: string;
  title: string;
  code?: string;
  subtitle?: string;
  owner?: string;
  metricValue?: number;
  tags?: string[];
  priority?: "normal" | "high" | "critical";
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · workflow & operations" title="TuxStageBoard">
      Multi-lane workflow and Kanban board with live per-lane item counts,
      summed numeric metric rollups, and accessible 44×44px keyboard stage
      transfer controls — no pointer-only drag-and-drop traps.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · live rollups &amp; keyboard movement</p>
      <h2 class="heading--bold text-xl font-bold">Roadside instrumentation &amp; signal retiming board</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Advancing or returning any card recalculates both the lane count pill
        and the summed <code>metricValue</code> rollup header immediately. Every
        stage-transfer button exposes an explicit
        <code>Move &lt;title&gt; to &lt;stage&gt;</code> accessible name.
      </p>
      <TuxExample class="mt-4" :vue="flagshipVue">
        <div class="space-y-4">
          <TuxStageBoard
            :stages="corridorStages"
            :items="workOrders"
            metric-suffix=" sensors"
            @move="onMove"
            @select="onSelect"
          />
          <div class="text-xs font-mono text-text-muted flex flex-wrap gap-4">
            <span v-if="selectedCard">
              selected: {{ selectedCard.code }} · {{ selectedCard.title }}
            </span>
            <span v-if="lastMove">
              moved {{ lastMove.itemId }}: {{ lastMove.fromStageId }} → {{ lastMove.toStageId }}
            </span>
            <span v-if="!selectedCard && !lastMove">
              tip: click a card title to inspect or use stage buttons to transfer between lanes
            </span>
          </div>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">read-only · status wallboard</p>
      <h2 class="heading--bold text-xl font-bold">Non-movable operations display</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>:movable="false"</code> when rendering a status wallboard
        where viewers can still select cards to open detail drawers without
        modifying workflow stages.
      </p>
      <TuxExample class="mt-4" :vue="readonlyVue">
        <TuxStageBoard
          :stages="corridorStages.slice(0, 3)"
          :items="workOrders.slice(0, 3)"
          metric-suffix=" sensors"
          :movable="false"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Lane &amp; card interfaces</h2>
      <TuxCodeBlock class="mt-4" :code="typesTs" lang="ts" filename="TuxStageBoard.ts" />
    </section>
  </div>
</template>
