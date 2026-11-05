<script setup lang="ts">
/**
 * /examples/telemetry-chargeback — Live Infrastructure Telemetry, Self-Hosted Rate-Card
 * Chargeback, Scenario Simulation, Printable Statement Voucher, and Immutable Audit Trail
 * workspace composing all 8 v3.11.0 primitives alongside v3.10.0 governance controls.
 */
import { computed, ref } from "vue";
import type { ResourceChannelMetric } from "~/components/TuxResourceMeter.vue";
import type { RateScheduleItem } from "~/components/TuxRateSchedule.vue";
import {
  anomalySeries,
  catalogUptimeBuckets,
  collectorFeeds,
  collectorLogs,
  gpuClusterChannels,
  initialAuditEntries,
  initialRateSchedules,
  initialSimulatorParams,
  initialTelemetryPeriod,
  lakehousePoolChannels,
  simulatorPresets,
  statementAdjustments,
  statementApprovals,
  statementIssuer,
  statementLines,
  statementRecipient,
  telemetryEntities,
  telemetryPresets,
} from "./telemetry-chargeback.demo-data";

useHead({ title: "Example · Telemetry, Rate Cards & Chargeback · TUX" });

const activeTab = ref<"monitor" | "rates" | "statement" | "audit">("monitor");

const period = ref({ ...initialTelemetryPeriod });
const selectedEntityId = ref<string | null>("study-410922");

const gpuChannels = ref(gpuClusterChannels.map((c) => ({ ...c })));
const lakeChannels = ref(lakehousePoolChannels.map((c) => ({ ...c })));
const anomalyState = ref<"open" | "acknowledged" | "snoozed">("open");
const feeds = ref(collectorFeeds.map((f) => ({ ...f })));
const rateItems = ref(initialRateSchedules.map((r) => ({ ...r, tiers: r.tiers ? [...r.tiers] : undefined })));
const simParams = ref(initialSimulatorParams.map((p) => ({ ...p })));
const auditEntries = ref(initialAuditEntries.map((e) => ({ ...e })));
const actionNotice = ref("");

const selectedEntity = computed(
  () => telemetryEntities.find((e) => e.id === selectedEntityId.value) ?? telemetryEntities[0],
);

function notify(msg: string) {
  actionNotice.value = msg;
}

function onReclaimGpu(flagged: ResourceChannelMetric[]) {
  for (const ch of gpuChannels.value) {
    if (flagged.some((f) => f.id === ch.id)) {
      ch.allocated = Math.max(ch.utilized + 4, Math.round(ch.utilized * 1.4));
    }
  }
  notify(`Reclaimed idle reservation across ${flagged.length} channel(s) and logged policy credit.`);
}

function onAcknowledgeAnomaly(id: string) {
  anomalyState.value = "acknowledged";
  notify(`Acknowledged burn-rate alert (${id}) and notified principal investigator.`);
}

function onSnoozeAnomaly(id: string) {
  anomalyState.value = "snoozed";
  notify(`Snoozed alert (${id}) for 24h during approved batch replay.`);
}

function onSyncFeed(feedId: string) {
  const target = feeds.value.find((f) => f.id === feedId);
  if (target) {
    target.status = "healthy";
    target.lastSynced = "Just now";
    target.lagLabel = "0m lag";
    target.message = undefined;
    notify(`Synchronized collector "${target.name}".`);
  }
}

function onCreateRateRevision(item: RateScheduleItem) {
  notify(`Drafted effective-dated rate revision from ${item.code} (${item.name}).`);
}

const navTabs = [
  {
    id: "monitor" as const,
    label: "1 · Live Telemetry & Anomalies",
    badge: computed(() => (anomalyState.value === "open" ? "1 alert" : null)),
  },
  { id: "rates" as const, label: "2 · Rate Cards & Simulator", badge: computed(() => null) },
  { id: "statement" as const, label: "3 · Statement Voucher", badge: computed(() => null) },
  { id: "audit" as const, label: "4 · Immutable Audit Trail", badge: computed(() => null) },
];
</script>

<template>
  <div class="space-y-8">
    <TuxPageHeader
      eyebrow="product · live monitoring, rate schedules & chargeback"
      title="Telemetry & Chargeback Engine"
    >
      Self-hosted and external pool saturation monitoring, SLI availability history, mid-cycle
      burn-rate anomaly detection, effective-dated rate-card authoring, interactive cost simulation,
      printable archival statements, and tamper-evident audit trails.
    </TuxPageHeader>

    <!-- Live Polite Action Feedback -->
    <div
      v-if="actionNotice"
      data-testid="telemetry-action-notice"
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
          label="Metering & Monitoring Window"
          :presets="telemetryPresets"
          @apply="(p) => notify(`Scoped telemetry window ${p.start} → ${p.end}`)"
        />
      </div>
      <div class="xl:col-span-5 min-w-0 space-y-3">
        <TuxEntityPicker
          v-model="selectedEntityId"
          label="Scoped Project / Account"
          :options="telemetryEntities"
        />
        <div class="flex items-center justify-between flex-wrap gap-2 pt-1">
          <TuxCopyToken
            v-if="selectedEntity?.code"
            label="ACCT"
            :value="selectedEntity.code"
            verified
            @copy="(v) => notify(`Copied account code ${v}`)"
          />
          <TuxCopyToken
            label="SNAP"
            value="urn:tux:snapshot:stmt-2026-10-0419"
            :max-length="26"
            verified
            @copy="(v) => notify(`Copied snapshot URN ${v}`)"
          />
        </div>
      </div>
    </div>

    <!-- Workspace Tab Bar -->
    <div
      role="tablist"
      aria-label="Telemetry and chargeback workspace views"
      class="flex flex-wrap gap-2 border-b border-surface-border pb-2"
    >
      <button
        v-for="tab in navTabs"
        :id="`tc-tab-${tab.id}`"
        :key="tab.id"
        type="button"
        role="tab"
        aria-controls="tc-tabpanel"
        :aria-selected="activeTab === tab.id"
        :data-state="activeTab === tab.id ? 'active' : 'inactive'"
        class="min-h-11 px-4 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2"
        :class="
          activeTab === tab.id
            ? 'bg-brand-fill text-text-on-brand'
            : 'bg-surface-sunken text-text-primary hover:bg-surface-eggshell border border-surface-border'
        "
        @click="activeTab = tab.id"
      >
        <span>{{ tab.label }}</span>
        <span
          v-if="tab.badge.value"
          class="px-2 py-0.5 text-xs font-mono rounded-full bg-surface-page text-text-primary"
        >
          {{ tab.badge.value }}
        </span>
      </button>
    </div>

    <div
      id="tc-tabpanel"
      role="tabpanel"
      :aria-labelledby="`tc-tab-${activeTab}`"
    >
      <!-- VIEW 1: LIVE TELEMETRY, SLI UPTIME, ANOMALIES & LOGS -->
      <section v-if="activeTab === 'monitor'" class="space-y-8">
        <TuxSectionHeader eyebrow="sli & velocity guardrails">
          Cluster Efficiency, Availability & Mid-Cycle Burn Alerts
        </TuxSectionHeader>

        <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div class="xl:col-span-7 min-w-0 space-y-6">
            <TuxUptimeStrip
              service-name="Table Catalog & Distributed Query Engine"
              service-group="Self-Hosted Data Platform"
              :buckets="catalogUptimeBuckets"
              window-label="Last 30 days"
              :sla-target-pct="99.5"
              :current-latency-ms="21"
            />

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TuxResourceMeter
                title="Self-Hosted Tensor GPU Pool A"
                subtitle="Allocated reservation vs. active kernel utilization"
                pool-status="warning"
                :channels="gpuChannels"
                @reclaim="onReclaimGpu"
              />
              <TuxResourceMeter
                title="Partitioned Table & Query Cluster"
                subtitle="Columnar object storage & distributed SQL workers"
                pool-status="ok"
                :channels="lakeChannels"
                :show-reclaim-action="false"
              />
            </div>
          </div>

          <div class="xl:col-span-5 min-w-0 space-y-6">
            <TuxAnomalyCard
              id="anom-lidar-410922"
              title="Runaway Accelerator Spend Velocity"
              metric-label="Daily Metered Charge"
              current-value="$1,840 / day"
              baseline-label="14d rolling band: $380 – $490 / day"
              delta-label="+318% vs 14d baseline"
              projection-label="Projected to exhaust remaining study ceiling in 26 days"
              severity="critical"
              :state="anomalyState"
              target-entity="02-410922-00010 · Connected Freight Corridor"
              rule-summary="Trigger: daily_burn > 2.0x rolling_14d_p90 for >= 12h"
              :series="anomalySeries"
              @acknowledge="onAcknowledgeAnomaly"
              @snooze="onSnoozeAnomaly"
              @escalate="(id) => notify(`Escalated anomaly ${id} to division director.`)"
            />

            <TuxFeedStatus
              title="Metering & Billing Collectors"
              :feeds="feeds"
              @sync="onSyncFeed"
              @sync-all="() => feeds.forEach((f) => onSyncFeed(f.id))"
            />
          </div>
        </div>

        <TuxLogViewer
          title="Metering Rollup & Attribution Engine Logs"
          :lines="collectorLogs"
          max-height="18rem"
          @copy="() => notify('Copied filtered collector log lines to clipboard.')"
          @download="() => notify('Downloaded raw collector log transcript.')"
        />
      </section>

      <!-- VIEW 2: EFFECTIVE-DATED RATE CARDS & WHAT-IF SIMULATOR -->
      <section v-else-if="activeTab === 'rates'" class="space-y-8">
        <TuxSectionHeader eyebrow="transparent unit economics">
          Effective-Dated Rate Schedules & Workload Cost Simulator
        </TuxSectionHeader>

        <TuxRateSchedule
          v-model:items="rateItems"
          title="Self-Hosted Infrastructure Rate Schedules"
          subtitle="Versioned by effective date so future tariff updates never mutate settled prior-period statements"
          :sample-quantity="250"
          @create-revision="onCreateRateRevision"
        />

        <TuxSimulator
          v-model:parameters="simParams"
          title="Next-Cycle Capacity & Pool Comparison Simulator"
          subtitle="Model upcoming GPU, query, and archive demand before attesting next-cycle continuation"
          :presets="simulatorPresets"
          primary-label="Self-Hosted Cluster Tariff"
          comparison-label="External Cloud Equivalent"
          :budget-limit="4820"
          @apply-preset="(p) => notify(`Loaded simulation scenario '${p.label}'.`)"
        />
      </section>

      <!-- VIEW 3: ARCHIVAL STATEMENT VOUCHER -->
      <section v-else-if="activeTab === 'statement'" class="space-y-8">
        <TuxSectionHeader eyebrow="archival & portal voucher">
          Settled Period Chargeback Statement
        </TuxSectionHeader>

        <TuxStatementSheet
          statement-id="STMT-2026-10-0419"
          title="Monthly Resource Chargeback Statement"
          period-label="2026-10-01 — 2026-10-31 (Cycle Closed)"
          issue-date="2026-11-02"
          status="settled"
          :issuer="statementIssuer"
          :recipient="statementRecipient"
          :lines="statementLines"
          :adjustments="statementAdjustments"
          :approvals="statementApprovals"
          remittance-ref="PORTAL-BATCH-20261102-0419"
          digest="sha256:9f84c2e17b30a9"
          @print="(id) => notify(`Opened print sheet for statement ${id}.`)"
          @export-csv="(id) => notify(`Exported line-item CSV for statement ${id}.`)"
        />
      </section>

      <!-- VIEW 4: IMMUTABLE AUDIT LOG -->
      <section v-else-if="activeTab === 'audit'" class="space-y-8">
        <TuxSectionHeader eyebrow="compliance & provenance">
          Tamper-Evident Governance & Rate Mutation Ledger
        </TuxSectionHeader>

        <TuxAuditLog
          title="Cycle Attribution, Rate & Signoff Audit Stream"
          :entries="auditEntries"
          @export="(fmt) => notify(`Exported ${auditEntries.length} audit records as ${fmt.toUpperCase()}.`)"
        />
      </section>
    </div>
  </div>
</template>
