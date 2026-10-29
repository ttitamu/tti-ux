<script setup lang="ts">
/**
 * /examples/resource-governance — End-to-end operational workspace demonstrating
 * multi-source resource metering, unlinked workload reconciliation, proportional
 * allocation, threshold tracking, multi-party attestation, and structured export
 * using 19 domain-agnostic TUX primitives.
 */
import { computed, ref } from "vue";
import {
  ceilingSegments,
  continuationOptions,
  externalCsvColumns,
  externalCsvSamples,
  flowLinks,
  flowNodes,
  governancePresets,
  initialFeeds,
  initialMetadataPairs,
  initialOrphans,
  initialPeriod,
  initialScheduleGrid,
  initialSignoffStages,
  initialSlices,
  initialStageItems,
  ledgerGroups,
  mapperTargetFields,
  metadataSchema,
  pivotCols,
  pivotRows,
  pivotValues,
  referenceSegments,
  statementDiffFields,
  studyEntities,
  varianceSteps,
  workflowLanes,
} from "./resource-governance.demo-data";

useHead({ title: "Example · Resource Governance & Attribution · TUX" });

const activeSection = ref<"overview" | "reconcile" | "attest" | "ledger" | "policy">("overview");

const period = ref({ ...initialPeriod });
const selectedEntityId = ref<string | null>("study-410922");

const feeds = ref(initialFeeds.map((f) => ({ ...f })));
const orphans = ref(initialOrphans.map((o) => ({ ...o, candidates: [...o.candidates] })));
const slices = ref(initialSlices.map((s) => ({ ...s })));
const columnMapping = ref<Record<string, string>>({
  period_start: "billing_period_start",
  resource_id: "resource_identifier",
  account_code: "study_acct_code",
  quantity: "consumed_qty",
  amount: "billed_usd",
});

const stageItems = ref(initialStageItems.map((i) => ({ ...i })));
const signoffStages = ref(initialSignoffStages.map((s) => ({ ...s })));
const continuationChoice = ref("continue");

const validatedCode = ref("02-410922-00010");
const metadataPairs = ref(initialMetadataPairs.map((p) => ({ ...p })));
const scheduleGrid = ref(initialScheduleGrid.map((row) => [...row]));
const leaseHours = ref(48);
const actionNotice = ref("");

const selectedEntity = computed(
  () => studyEntities.find((e) => e.id === selectedEntityId.value) ?? studyEntities[0],
);

function notify(msg: string) {
  actionNotice.value = msg;
}

function onSyncFeed(feedId: string) {
  const target = feeds.value.find((f) => f.id === feedId);
  if (target) {
    target.status = "healthy";
    target.lastSynced = "Just now";
    target.lagLabel = "0h lag";
    target.message = undefined;
    notify(`Synchronized connector "${target.name}".`);
  }
}

function onSyncAllFeeds() {
  for (const f of feeds.value) {
    f.status = "healthy";
    f.lastSynced = "Just now";
    f.lagLabel = "0h lag";
    f.message = undefined;
  }
  notify("Synchronized all upstream usage and directory connectors.");
}

function onResolveOrphan(payload: { itemId: string; candidateId: string; createRule: boolean }) {
  orphans.value = orphans.value.filter((o) => o.id !== payload.itemId);
  notify(
    `Matched ${payload.itemId} to ${payload.candidateId}${payload.createRule ? " and saved persistent rule" : ""}.`,
  );
}

function onResolveBatch(batch: Array<{ itemId: string; candidateId: string; createRule: boolean }>) {
  const ids = new Set(batch.map((b) => b.itemId));
  orphans.value = orphans.value.filter((o) => !ids.has(o.id));
  notify(`Batch-resolved ${batch.length} high-confidence records.`);
}

function onDismissOrphan(itemId: string) {
  orphans.value = orphans.value.filter((o) => o.id !== itemId);
  notify(`Deferred record ${itemId} for manual review.`);
}

function onMoveStage(payload: { itemId: string; fromStageId: string; toStageId: string }) {
  const item = stageItems.value.find((c) => c.id === payload.itemId);
  if (item) {
    item.stageId = payload.toStageId;
    notify(`Moved "${item.title}" to stage "${payload.toStageId}".`);
  }
}

function onApproveSignoff(payload: { stageId: string; attested: boolean; decision?: string; comment: string }) {
  const stage = signoffStages.value.find((s) => s.id === payload.stageId);
  if (stage) {
    stage.status = "approved";
    stage.timestamp = "2026-10-29 10:15";
    stage.note = payload.comment || `Attested (${payload.decision ?? "continue"})`;
    notify(`Recorded sign-off for "${stage.label}".`);
  }
}

function onRejectSignoff(payload: { stageId: string; comment: string }) {
  const stage = signoffStages.value.find((s) => s.id === payload.stageId);
  if (stage) {
    stage.status = "rejected";
    stage.timestamp = "2026-10-29 10:15";
    stage.note = payload.comment || "Returned for allocation adjustment.";
    notify(`Returned "${stage.label}" for revision.`);
  }
}

function extendLease() {
  leaseHours.value += 720;
  notify("Extended workspace lease window by 30 days.");
}

const navTabs = [
  { id: "overview" as const, label: "1 · Overview & Flow", count: null },
  { id: "reconcile" as const, label: "2 · Reconcile & Split", count: computed(() => orphans.value.length) },
  { id: "attest" as const, label: "3 · Workflow & Attestation", count: null },
  { id: "ledger" as const, label: "4 · Ledger & Handoff", count: null },
  { id: "policy" as const, label: "5 · Tags & Schedules", count: null },
];
</script>

<template>
  <div class="space-y-8">
    <TuxPageHeader eyebrow="product · resource governance & attribution" title="Resource Governance Workspace">
      Unified multi-pool metering, unlinked workload resolution, proportional split allocation,
      multi-party attestation, and single-click settlement preparation — built entirely from
      19 domain-agnostic TUX primitives with zero spreadsheet or email handoffs.
    </TuxPageHeader>

    <!-- Live Polite Action Feedback -->
    <div
      v-if="actionNotice"
      data-testid="gov-action-notice"
      role="status"
      aria-live="polite"
      class="px-4 py-3 rounded-md bg-surface-eggshell border border-surface-border text-sm text-text-primary flex items-center justify-between gap-4"
    >
      <span class="font-medium">{{ actionNotice }}</span>
      <button
        type="button"
        class="min-h-11 min-w-11 px-3 text-xs font-mono uppercase text-brand-primary underline cursor-pointer"
        @click="actionNotice = ''"
      >
        Dismiss
      </button>
    </div>

    <!-- Global Cycle & Study Scope Bar -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      <div class="xl:col-span-7 min-w-0">
        <TuxPeriodPicker
          v-model="period"
          label="Active Reporting Cycle"
          :presets="governancePresets"
          @apply="(p) => notify(`Applied reporting window ${p.start} → ${p.end}`)"
        />
      </div>
      <div class="xl:col-span-5 min-w-0 space-y-3">
        <TuxEntityPicker
          v-model="selectedEntityId"
          label="Scoped Allocation Target"
          :options="studyEntities"
        />
        <div class="flex items-center justify-between flex-wrap gap-2 pt-1">
          <TuxCopyToken
            v-if="selectedEntity?.code"
            label="ACCT"
            :value="selectedEntity.code"
            verified
            @copy="(v) => notify(`Copied verified code ${v}`)"
          />
          <TuxLeaseBadge
            label="Workspace Lease"
            :remaining-hours="leaseHours"
            extendable
            @extend="extendLease"
          />
        </div>
      </div>
    </div>

    <!-- Workspace Mode Switcher -->
    <div
      role="tablist"
      aria-label="Resource governance workspace views"
      class="flex flex-wrap gap-2 border-b border-surface-border pb-2"
    >
      <button
        v-for="tab in navTabs"
        :id="`gov-tab-${tab.id}`"
        :key="tab.id"
        type="button"
        role="tab"
        aria-controls="gov-tabpanel"
        :aria-selected="activeSection === tab.id"
        :data-state="activeSection === tab.id ? 'active' : 'inactive'"
        class="min-h-11 px-4 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2"
        :class="
          activeSection === tab.id
            ? 'bg-brand-fill text-text-on-brand'
            : 'bg-surface-sunken text-text-primary hover:bg-surface-eggshell border border-surface-border'
        "
        @click="activeSection = tab.id"
      >
        <span>{{ tab.label }}</span>
        <span
          v-if="tab.count && tab.count.value > 0"
          class="px-2 py-0.5 text-xs font-mono rounded-full bg-surface-page text-text-primary"
        >
          {{ tab.count.value }}
        </span>
      </button>
    </div>

    <div
      id="gov-tabpanel"
      role="tabpanel"
      :aria-labelledby="`gov-tab-${activeSection}`"
    >
      <!-- 1. OVERVIEW & FLOW ATTRIBUTION -->
      <section v-if="activeSection === 'overview'" class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TuxCard>
          <TuxStatComparison
            eyebrow="current cycle total"
            :current="35.9"
            :previous="34.2"
            suffix="k USD"
            label="vs prior cycle"
            polarity="invert"
          />
        </TuxCard>
        <TuxCard>
          <TuxStatComparison
            eyebrow="on-prem cluster share"
            :current="41.8"
            :previous="29.4"
            suffix="%"
            label="migrated to local lakehouse"
            polarity="direct"
          />
        </TuxCard>
        <TuxCard>
          <TuxStatComparison
            eyebrow="unattributed usage"
            :current="2.5"
            :previous="14.2"
            suffix="%"
            label="down via fallback rules"
            polarity="invert"
          />
        </TuxCard>
      </div>

      <TuxCard>
        <TuxThresholdBar
          title="Scoped Allocation Ceiling Utilization ($k)"
          :segments="ceilingSegments"
          :limit="100"
          unit="k USD"
          :warning-ratio="0.85"
        />
      </TuxCard>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TuxCard class="overflow-x-auto">
          <TuxSectionHeader>Pool → Engine → Allocation Flow</TuxSectionHeader>
          <p class="mt-2 mb-4 text-sm text-text-secondary">
            Traces metered resource pools through shared compute/storage tiers into target studies.
          </p>
          <TuxChartSankey
            :nodes="flowNodes"
            :links="flowLinks"
            :width="620"
            :height="320"
            units="USD"
          />
        </TuxCard>

        <TuxCard class="overflow-x-auto">
          <TuxSectionHeader>Cycle-over-Cycle Variance Bridge</TuxSectionHeader>
          <p class="mt-2 mb-4 text-sm text-text-secondary">
            Explains net movement from prior baseline to current statement with inverted cost polarity.
          </p>
          <TuxChartWaterfall
            :steps="varianceSteps"
            :width="600"
            :height="320"
            polarity="invert"
            units="USD"
          />
        </TuxCard>
      </div>

      <TuxCard>
        <TuxPivotMatrix
          caption="Allocation × Resource Category Cross-Tabulation (USD)"
          row-header-label="Target Allocation"
          :row-labels="pivotRows"
          :col-labels="pivotCols"
          :values="pivotValues"
          value-prefix="$"
          @select-cell="(c) => notify(`Selected ${c.rowLabel} × ${c.colLabel}: $${c.value.toLocaleString()}`)"
        />
      </TuxCard>
    </section>

      <!-- 2. RECONCILE & PROPORTIONAL SPLIT -->
      <section v-else-if="activeSection === 'reconcile'" class="space-y-8">
      <TuxFeedStatus
        title="Upstream Metering & Directory Connectors"
        :feeds="feeds"
        @sync="onSyncFeed"
        @sync-all="onSyncAllFeeds"
      />

      <div class="space-y-3">
        <TuxSectionHeader>Unlinked Workload & Namespace Queue</TuxSectionHeader>
        <p class="text-sm text-text-secondary">
          Resolves untagged shared clusters or local table namespaces using operator identity and group fallback rules.
        </p>
        <TuxRecordMatcher
          :items="orphans"
          @resolve="onResolveOrphan"
          @resolve-batch="onResolveBatch"
          @dismiss="onDismissOrphan"
        />
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TuxCard>
          <TuxProportionalInput
            v-model="slices"
            title="Shared Subscription Multi-Study Split"
            :target-total="100"
            unit="%"
          />
        </TuxCard>

        <TuxCard>
          <TuxSectionHeader class="mb-3">External Statement Schema Mapper</TuxSectionHeader>
          <TuxColumnMapper
            v-model="columnMapping"
            :source-columns="externalCsvColumns"
            :sample-rows="externalCsvSamples"
            :target-fields="mapperTargetFields"
            @confirm="() => notify('External tabular schema aligned and queued for ingestion.')"
          />
        </TuxCard>
      </div>
    </section>

      <!-- 3. WORKFLOW BOARD & MULTI-PARTY ATTESTATION -->
      <section v-else-if="activeSection === 'attest'" class="space-y-8">
      <div class="space-y-3">
        <TuxSectionHeader>Monthly Cycle Progression Board</TuxSectionHeader>
        <p class="text-sm text-text-secondary">
          Live visibility across every statement in the cycle, replacing ad-hoc chat threads and emailed spreadsheets.
        </p>
        <TuxStageBoard
          :stages="workflowLanes"
          :items="stageItems"
          metric-prefix="$"
          @move="onMoveStage"
          @select="(item) => notify(`Inspecting statement ${item.code} (${item.title})`)"
        />
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div class="xl:col-span-6 min-w-0">
          <TuxCard>
            <TuxRecordDiff
              title="Statement Variance vs. Prior Cycle (02-410922-00010)"
              before-label="Prior Cycle (Sep)"
              after-label="Current Cycle (Oct)"
              :fields="statementDiffFields"
            />
          </TuxCard>
        </div>

        <div class="xl:col-span-6 min-w-0">
          <TuxCard>
            <TuxSignoffChain
              v-model="continuationChoice"
              :stages="signoffStages"
              attestation-text="I verify that the itemized resource consumption above directly supported this study and meets institutional allowability criteria."
              decision-label="Next-Cycle Resource Disposition"
              :decision-options="continuationOptions"
              @approve="onApproveSignoff"
              @reject="onRejectSignoff"
            />
          </TuxCard>
        </div>
      </div>
    </section>

      <!-- 4. ITEMIZED LEDGER & EXTERNAL SETTLEMENT HANDOFF -->
      <section v-else-if="activeSection === 'ledger'" class="space-y-8">
      <TuxLedgerTable
        caption="Verified Statement · 02-410922-00010 · Cycle 2026-10"
        :groups="ledgerGroups"
        value-prefix="$"
        :decimals="2"
        @export="(e) => notify(`Exported verified ledger (${e.format.toUpperCase()}, ${e.content.length} bytes).`)"
      />

      <TuxCard>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div class="space-y-3">
            <TuxSectionHeader>Pre-Validated Settlement Identifiers</TuxSectionHeader>
            <p class="text-sm text-text-secondary">
              One-click verified tokens eliminate manual re-keying errors when posting to downstream accounting portals.
            </p>
            <div class="flex flex-wrap gap-3 pt-1">
              <TuxCopyToken label="ALLOC" :value="validatedCode" verified />
              <TuxCopyToken
                label="DIGEST"
                value="sha256:9f84c2e10ab47d8819e3c44b20f17e9a62d01bc8"
                :max-length="24"
                verified
              />
              <TuxCopyToken
                label="URI"
                value="urn:lakehouse:governance:statements:2026-10:02-410922-00010"
                :max-length="28"
                verified
              />
            </div>
          </div>

          <div>
            <TuxSegmentedInput
              v-model="validatedCode"
              label="Structured Allocation String Validator"
              help-text="Paste or edit a 3-part reference string (Unit · Study · Sub-Account) to verify format."
              :segments="referenceSegments"
              @complete="(code) => notify(`Verified complete allocation code: ${code}`)"
            />
          </div>
        </div>
      </TuxCard>
    </section>

      <!-- 5. METADATA HYGIENE & ACTIVE OPERATING SCHEDULES -->
      <section v-else class="space-y-8">
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div class="xl:col-span-5 min-w-0">
          <TuxCard>
            <TuxSectionHeader class="mb-3">Required Resource Metadata Schema</TuxSectionHeader>
            <p class="mb-4 text-sm text-text-secondary">
              Enforces canonical key-value attributes at workspace creation so clusters never enter the untagged queue.
            </p>
            <TuxKeyValueInput
              v-model="metadataPairs"
              :schema="metadataSchema"
            />
          </TuxCard>
        </div>

        <div class="xl:col-span-7 min-w-0">
          <TuxCard>
            <TuxSectionHeader class="mb-3">Automated Compute Active / Standby Window</TuxSectionHeader>
            <p class="mb-4 text-sm text-text-secondary">
              Paints active vs. standby operating windows across days and 3-hour blocks to curb off-hours idle burn.
            </p>
            <TuxScheduleMatrix v-model="scheduleGrid" />
          </TuxCard>
        </div>
      </div>
      </section>
    </div>
  </div>
</template>
