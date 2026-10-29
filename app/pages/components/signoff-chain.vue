<script setup>
// Per ADR-0010, keep top-level <script setup> expressions plain JS.
useHead({ title: "TuxSignoffChain · TUX" });

const initialProtocolStages = [
  {
    id: "st-instrumentation",
    label: "Accelerometer & High-Speed Rig Calibration",
    actorName: "Dr. Elena Vance",
    actorRole: "Lead Instrumentation Engineer",
    status: "approved",
    timestamp: "2026-10-28 08:40",
    note: "All 24 triaxial channels verified within ±0.15% linearity against reference shaker table.",
  },
  {
    id: "st-safety",
    label: "Test Track Clear-Zone & Barrier Inspection",
    actorName: "Marcus Holloway",
    actorRole: "Proving Ground Range Officer",
    status: "pending",
    note: "Awaiting final perimeter gate lock and telemetry bunker readiness check.",
  },
  {
    id: "st-director",
    label: "Full-Scale Impact Run Authorization",
    actorName: "Dr. Priya Nair",
    actorRole: "Crashworthiness Division Director",
    status: "pending",
  },
];

const stages = ref(structuredClone(initialProtocolStages));
const selectedDecision = ref("release-standard");
const lastEvent = ref(null);

const decisionOptions = [
  {
    value: "release-standard",
    label: "Authorize standard 62 mph impact profile",
    description: "Proceed under nominal dry-pavement MASH Test Level 4 parameters.",
  },
  {
    value: "release-instrumented-hold",
    label: "Authorize with pre-ignition telemetry hold",
    description: "Pause countdown at T-60s for secondary optical tracker verification.",
  },
];

const auditTrailStages = [
  {
    id: "au-1",
    label: "Field Core Extraction Log",
    actorName: "Tomasz Kowalski",
    actorRole: "Materials Technician",
    status: "approved",
    timestamp: "2026-10-21 11:15",
    note: "12 asphalt cores logged from SH-6 northbound outside lane.",
  },
  {
    id: "au-2",
    label: "Thermal Conditioning Bypass",
    actorName: "Lab Automation Queue",
    actorRole: "Environmental Chamber",
    status: "skipped",
    timestamp: "2026-10-21 13:00",
    note: "Ambient dry-test protocol selected; freeze-thaw conditioning not applicable.",
  },
  {
    id: "au-3",
    label: "Superpave GyratoryQA Review",
    actorName: "Dr. Hannah Lin",
    actorRole: "Pavement Mechanics Reviewer",
    status: "rejected",
    timestamp: "2026-10-22 09:20",
    note: "Specimen #07 bulk specific gravity variance exceeded 1.5% threshold; re-weigh requested.",
  },
];

function onApprove(payload) {
  lastEvent.value = { type: "approve", ...payload };
  stages.value = stages.value.map((s) =>
    s.id === payload.stageId
      ? {
          ...s,
          status: "approved",
          timestamp: "2026-10-29 10:15",
          note: payload.comment || s.note,
        }
      : s,
  );
}

function onReject(payload) {
  lastEvent.value = { type: "reject", ...payload };
  stages.value = stages.value.map((s) =>
    s.id === payload.stageId
      ? {
          ...s,
          status: "rejected",
          timestamp: "2026-10-29 10:15",
          note: payload.comment || "Returned for revision during sign-off review.",
        }
      : s,
  );
}

function resetDemo() {
  stages.value = structuredClone(initialProtocolStages);
  selectedDecision.value = "release-standard";
  lastEvent.value = null;
}

const flagshipVue = `<tux-signoff-chain
  v-model="selectedDecision"
  :stages="stages"
  :decision-options="decisionOptions"
  decision-label="Run Authorization Mode"
  attestation-text="I attest that range perimeter locks and optical telemetry channels are verified."
  @approve="onApprove"
  @reject="onReject"
/>`;

const readonlyVue = `<tux-signoff-chain
  :stages="auditTrailStages"
  :show-actions="false"
/>`;

const typesTs = `export interface SignoffStage {
  id: string;
  label: string;
  actorName: string;
  actorRole?: string;
  status: "approved" | "pending" | "rejected" | "skipped";
  timestamp?: string;
  note?: string;
}

export interface SignoffDecisionOption {
  value: string;
  label: string;
  description?: string;
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · workflow & governance" title="TuxSignoffChain">
      Sequential multi-actor verification, attestation, and continuation gate.
      Tracks ordered sign-off stages with actor credentials, tabular timestamps,
      and audit notes while gating active approvals behind explicit attestation
      and structured continuation options.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · interactive attestation gate</p>
      <h2 class="heading--bold text-xl font-bold">Proving ground impact run sign-off</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        When <code>attestationText</code> is provided, the primary approval
        action stays disabled until the reviewer checks the attestation box.
        Optional <code>decisionOptions</code> capture structured continuation
        modes alongside free-text commentary.
      </p>
      <TuxExample class="mt-4" :vue="flagshipVue">
        <div class="max-w-2xl space-y-4">
          <TuxSignoffChain
            v-model="selectedDecision"
            :stages="stages"
            :decision-options="decisionOptions"
            decision-label="Run Authorization Mode"
            attestation-text="I attest that range perimeter locks and optical telemetry channels are verified."
            @approve="onApprove"
            @reject="onReject"
          />
          <div class="flex items-center justify-between gap-3 pt-2 text-xs font-mono text-text-muted">
            <span v-if="lastEvent">
              emitted {{ lastEvent.type }}: {{ JSON.stringify(lastEvent) }}
            </span>
            <span v-else>state: awaiting range officer attestation</span>
            <button
              type="button"
              class="min-h-11 px-3 py-1.5 border border-surface-border rounded bg-surface-sunken text-text-primary cursor-pointer"
              @click="resetDemo"
            >
              Reset chain
            </button>
          </div>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">read-only · completed or halted ledger</p>
      <h2 class="heading--bold text-xl font-bold">Materials laboratory QA audit trail</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Set <code>:show-actions="false"</code> to render a pure verification
        record showing approved, skipped, and returned stages with multi-channel
        status icons and timestamps.
      </p>
      <TuxExample class="mt-4" :vue="readonlyVue">
        <div class="max-w-2xl">
          <TuxSignoffChain :stages="auditTrailStages" :show-actions="false" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Exported interfaces</h2>
      <TuxCodeBlock class="mt-4" :code="typesTs" lang="ts" filename="TuxSignoffChain.ts" />
    </section>
  </div>
</template>
