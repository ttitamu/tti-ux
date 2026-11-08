<script setup>
// Per ADR-0010, keep top-level <script setup> expressions plain JS.
import tuxAuditLogSource from "~/components/TuxAuditLog.vue?raw";

useHead({ title: "TuxAuditLog · TUX" });

const governanceEntries = [
  {
    id: "aud-9041",
    timestamp: "2026-10-30 14:22:09Z",
    actor: "Dr. Elena Vance",
    actorRole: "Principal Investigator",
    action: "Reattributed Compute Batch",
    category: "attribution",
    severity: "warning",
    target: "Study 02-410922 / Run #88",
    reason: "Split shared roadside LiDAR calibration run across corridor sponsors.",
    digest: "sha256:9f4c82b1",
    changes: [
      { field: "account_code", before: "UNALLOC-POOL-00", after: "STUDY-02-410922" },
      { field: "allocation_share", before: "0%", after: "65%" },
    ],
  },
  {
    id: "aud-9040",
    timestamp: "2026-10-30 11:05:44Z",
    actor: "Marcus Holloway",
    actorRole: "Resource Governance Officer",
    action: "Ratified FY27 Tariff Revision",
    category: "rate",
    severity: "info",
    target: "CMP-GPU-01 (On-Prem GPU Cluster)",
    reason: "Annual indirect cooling & power recovery recalibration.",
    digest: "sha256:3a17e0d4",
    changes: [
      { field: "base_rate_usd", before: "2.25", after: "2.40" },
      { field: "overhead_multiplier", before: "1.10", after: "1.15" },
    ],
  },
  {
    id: "aud-9039",
    timestamp: "2026-10-29 18:49:12Z",
    actor: "Dr. Priya Nair",
    actorRole: "Division Fiscal Reviewer",
    action: "Countersigned Monthly Statement",
    category: "signoff",
    severity: "info",
    target: "STMT-2026-10-014",
    reason: "Verified sensor archive TiB-mo metering against telemetry collector logs.",
    digest: "sha256:7d81c55a",
  },
  {
    id: "aud-9038",
    timestamp: "2026-10-29 09:14:03Z",
    actor: "Ledger Reconciliation Worker",
    actorRole: "Automated Settlement Service",
    action: "Halted Over-Ceiling Posting",
    category: "settlement",
    severity: "critical",
    target: "Study 04-882310",
    reason: "Monthly compute recovery exceeded authorized $4,000 study ceiling.",
    digest: "sha256:e402b91c",
    changes: [
      { field: "posting_state", before: "QUEUED", after: "HELD_OVER_CEILING" },
      { field: "variance_usd", before: "0.00", after: "+312.50" },
    ],
  },
  {
    id: "aud-9037",
    timestamp: "2026-10-28 23:59:58Z",
    actor: "Telemetry Collector Daemon",
    actorRole: "System",
    action: "Sealed Hourly Metering Window",
    category: "system",
    severity: "info",
    target: "EPOCH-2026-10-28T23",
    digest: "sha256:1b90f32e",
  },
];

const lastInspected = ref(null);
const lastExportMeta = ref(null);

function onInspect(entry) {
  lastInspected.value = `${entry.id} — ${entry.action} (${entry.target})`;
}

function onExport(format, entries) {
  lastExportMeta.value = `Exported ${entries.length} entries as ${format.toUpperCase()}`;
}

const playgroundControls = [
  {
    prop: "title",
    label: "Audit Log Title",
    type: "text",
    defaultValue: "Immutable Governance Audit Log",
  },
  {
    prop: "initialCategory",
    label: "Initial Category",
    type: "select",
    options: ["all", "attribution", "rate", "signoff", "settlement", "system"],
    defaultValue: "all",
  },
  {
    prop: "searchable",
    label: "Show Search Input",
    type: "boolean",
    defaultValue: true,
  },
  {
    prop: "exportable",
    label: "Show Export Controls",
    type: "boolean",
    defaultValue: true,
  },
];

const playgroundPresets = [
  {
    name: "full-governance-trail",
    label: "Full Governance Trail",
    description: "Searchable and exportable ledger across all five operational categories",
    icon: "lucide:shield-check",
    values: {
      title: "Immutable Governance Audit Log",
      initialCategory: "all",
      searchable: true,
      exportable: true,
    },
  },
  {
    name: "settlement-exceptions",
    label: "Settlement Exceptions Only",
    description: "Focused review of period-close settlement events without toolbar search",
    icon: "lucide:alert-triangle",
    values: {
      title: "Period-Close Settlement Ledger",
      initialCategory: "settlement",
      searchable: false,
      exportable: true,
    },
  },
];

const flagshipVue = `<tux-audit-log
  :entries="governanceEntries"
  title="Resource Attribution & Tariff Audit Trail"
  @inspect="onInspect"
  @export="onExport"
/>`;

const compactVue = `<tux-audit-log
  :entries="governanceEntries"
  title="Rate Revision History"
  initial-category="rate"
  :searchable="false"
  :exportable="false"
/>`;

const typesTs = `export interface AuditFieldDelta {
  field: string;
  before: string;
  after: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole?: string;
  action: string;
  category: "attribution" | "rate" | "signoff" | "settlement" | "system";
  severity?: "info" | "warning" | "critical";
  target: string;
  reason?: string;
  digest?: string; // e.g. short sha256 verification token
  changes?: AuditFieldDelta[];
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · compliance & provenance" title="TuxAuditLog">
      Immutable governance and operational event log with monospace UTC
      timestamps, actor credentials, cryptographic verification digests,
      accessible inline before &rarr; after field diff disclosures, and
      structured CSV/JSON export.
    </TuxPageHeader>

    <section>
      <TuxPlayground
        tag="tux-audit-log"
        component-name="TuxAuditLog"
        title="Governance Audit Log Workbench"
        eyebrow="Interactive Component Lab"
        :controls="playgroundControls"
        :presets="playgroundPresets"
        :source="tuxAuditLogSource"
        :code-template="(values) => {
          const catAttr = values.initialCategory !== 'all' ? `\n  initial-category=\x22${values.initialCategory}\x22` : '';
          const searchAttr = !values.searchable ? '\n  :searchable=\x22false\x22' : '';
          const expAttr = !values.exportable ? '\n  :exportable=\x22false\x22' : '';
          return `<tux-audit-log\n  :entries=\x22governanceEntries\x22\n  title=\x22${values.title}\x22${catAttr}${searchAttr}${expAttr}\n/>`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full">
            <TuxAuditLog
              :entries="governanceEntries"
              :title="values.title"
              :initial-category="values.initialCategory"
              :searchable="values.searchable"
              :exportable="values.exportable"
              @inspect="onInspect"
              @export="onExport"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">flagship · cryptographic digests &amp; field diffs</p>
      <h2 class="heading--bold text-xl font-bold">
        Searchable governance trail with inline field deltas
      </h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Click <strong>Changes (N)</strong> on any modified record to expand an
        inline before &rarr; after field comparison table, filter by category,
        or export filtered snapshots in CSV or JSON format.
      </p>
      <TuxExample class="mt-4" :vue="flagshipVue" :source="tuxAuditLogSource">
        <div class="space-y-3">
          <TuxAuditLog
            :entries="governanceEntries"
            title="Resource Attribution & Tariff Audit Trail"
            @inspect="onInspect"
            @export="onExport"
          />
          <p v-if="lastInspected || lastExportMeta" class="text-xs font-mono text-text-secondary">
            {{ lastInspected }} {{ lastExportMeta ? `· ${lastExportMeta}` : "" }}
          </p>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">embedded · pre-filtered category slice</p>
      <h2 class="heading--bold text-xl font-bold">Focused rate change history</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Set <code>initial-category="rate"</code> with
        <code>:searchable="false"</code> and <code>:exportable="false"</code>
        to embed a compact domain-specific history list inside a detail drawer.
      </p>
      <TuxExample class="mt-4" :vue="compactVue">
        <TuxAuditLog
          :entries="governanceEntries"
          title="Rate Revision History"
          initial-category="rate"
          :searchable="false"
          :exportable="false"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Exported interfaces</h2>
      <TuxCodeBlock class="mt-4" :code="typesTs" lang="ts" filename="TuxAuditLog.ts" />
    </section>
  </div>
</template>
