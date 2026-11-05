<script setup>
// Per ADR-0010, keep top-level <script setup> expressions plain JS.
import tuxStatementSheetSource from "~/components/TuxStatementSheet.vue?raw";

useHead({ title: "TuxStatementSheet · TUX" });

const issuerParty = {
  name: "Shared Research Compute & Telemetry Facility",
  code: "SVC-POOL-01",
  department: "Research Infrastructure & Data Operations",
  contact: "metering-desk@example.edu",
};

const recipientParty = {
  name: "Study 02-410922 — Automated Freight Platoon Telemetry",
  code: "ACCT-02-410922",
  department: "Connected Corridor Systems Division",
  contact: "PI: Dr. Elena Vance",
};

const statementLines = [
  {
    id: "ln-gpu",
    category: "Accelerated Compute",
    description: "On-Prem GPU Cluster (80GB Node) — Multi-Sensor Fusion Runs",
    quantity: 320,
    unit: "GPU-hr",
    unitRate: 2.4,
  },
  {
    id: "ln-parquet",
    category: "Archive Storage",
    description: "Parquet Archive Storage — Calibrated LiDAR & Radar Captures",
    quantity: 64,
    unit: "TiB-mo",
    unitRate: 11.8,
  },
  {
    id: "ln-vcpu",
    category: "General Compute",
    description: "High-Memory Simulation vCPU Pool — Corridor Assignment",
    quantity: 2800,
    unit: "vCPU-hr",
    unitRate: 0.085,
  },
];

const statementAdjustments = [
  { label: "Shared Infrastructure Facility Overhead (10%)", amount: 176.12 },
  { label: "Sponsored Pilot Co-Funding Credit", amount: -250.0 },
];

const settledStamps = [
  {
    id: "st-1",
    role: "Metering Collector Attestation",
    signer: "Marcus Holloway",
    status: "approved",
    timestamp: "2026-10-31 17:10Z",
    decisionNote: "Hourly cluster & storage telemetry reconciled with zero gaps.",
  },
  {
    id: "st-2",
    role: "Principal Investigator Signoff",
    signer: "Dr. Elena Vance",
    status: "approved",
    timestamp: "2026-11-01 09:42Z",
    decisionNote: "Verified allocation shares for Study 02-410922.",
  },
  {
    id: "st-3",
    role: "Division Fiscal Settlement",
    signer: "Dr. Priya Nair",
    status: "approved",
    timestamp: "2026-11-02 14:05Z",
    decisionNote: "Posted to monthly internal recovery journal.",
  },
];

const pendingStamps = [
  {
    id: "pst-1",
    role: "Metering Collector Attestation",
    signer: "Marcus Holloway",
    status: "approved",
    timestamp: "2026-11-03 08:30Z",
  },
  {
    id: "pst-2",
    role: "Principal Investigator Signoff",
    signer: "Dr. Hannah Lin",
    status: "pending",
    decisionNote: "Awaiting PI review of burst GPU window on Oct 28.",
  },
];

const lastAction = ref(null);

function onPrint(id) {
  lastAction.value = `Print triggered for ${id}`;
}

function onExportCsv(id) {
  lastAction.value = `CSV exported for ${id}`;
}

const playgroundControls = [
  {
    prop: "title",
    label: "Statement Title",
    type: "text",
    defaultValue: "Resource Chargeback Statement",
  },
  {
    prop: "status",
    label: "Settlement Status",
    type: "select",
    options: ["settled", "pending", "draft", "void"],
    defaultValue: "settled",
  },
  {
    prop: "periodLabel",
    label: "Period Label",
    type: "text",
    defaultValue: "October 2026 (FY27-M02)",
  },
  {
    prop: "showPrintAction",
    label: "Show Print & CSV Actions",
    type: "boolean",
    defaultValue: true,
  },
];

const playgroundPresets = [
  {
    name: "settled-voucher",
    label: "Settled Monthly Voucher",
    description: "Finalized chargeback voucher with digital signoff stamps and remittance ref",
    icon: "lucide:file-check-2",
    values: {
      title: "Resource Chargeback Statement",
      status: "settled",
      periodLabel: "October 2026 (FY27-M02)",
      showPrintAction: true,
    },
  },
  {
    name: "draft-preview",
    label: "Mid-Month Draft Preview",
    description: "Read-only mid-period accrual preview without print toolbar",
    icon: "lucide:file-clock",
    values: {
      title: "Preliminary Resource Accrual Preview",
      status: "draft",
      periodLabel: "November 2026 (In-Progress)",
      showPrintAction: false,
    },
  },
];

const flagshipVue = `<tux-statement-sheet
  statement-id="STMT-2026-10-014"
  title="Resource Chargeback Statement"
  period-label="October 2026 (FY27-M02)"
  issue-date="2026-11-02"
  status="settled"
  :issuer="issuerParty"
  :recipient="recipientParty"
  :lines="statementLines"
  :adjustments="statementAdjustments"
  :approvals="settledStamps"
  remittance-ref="JRNL-2026-11-8841"
  digest="sha256:4e91c07b8a2f"
  @print="onPrint"
  @export-csv="onExportCsv"
/>`;

const pendingVue = `<tux-statement-sheet
  statement-id="STMT-2026-11-003"
  title="Pending Study Recovery Voucher"
  period-label="November 2026"
  issue-date="2026-11-03"
  status="pending"
  :issuer="issuerParty"
  :recipient="recipientParty"
  :lines="statementLines"
  :approvals="pendingStamps"
  :show-print-action="false"
/>`;

const typesTs = `export interface StatementParty {
  name: string;
  code?: string;
  department?: string;
  contact?: string;
}

export interface StatementLineItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unitRate: number;
  amount?: number; // defaults to quantity * unitRate
}

export interface StatementApprovalStamp {
  id: string;
  role: string;
  signer: string;
  status: "approved" | "pending" | "rejected";
  timestamp?: string;
  decisionNote?: string;
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · settlement & vouchers" title="TuxStatementSheet">
      Institutional resource chargeback voucher and period settlement sheet.
      Presents two-column issuer and account metadata, an itemized
      <code>quantity &times; unitRate</code> ledger, overhead or grant credit
      adjustments, net statement total, digital attestation stamps, and print /
      CSV export triggers.
    </TuxPageHeader>

    <section>
      <TuxPlayground
        tag="tux-statement-sheet"
        component-name="TuxStatementSheet"
        title="Statement Voucher Workbench"
        eyebrow="Interactive Component Lab"
        :controls="playgroundControls"
        :presets="playgroundPresets"
        :source="tuxStatementSheetSource"
        :code-template="(values) => {
          const printAttr = !values.showPrintAction ? '\n  :show-print-action=\x22false\x22' : '';
          return `<tux-statement-sheet\n  statement-id=\x22STMT-2026-10-014\x22\n  title=\x22${values.title}\x22\n  period-label=\x22${values.periodLabel}\x22\n  issue-date=\x222026-11-02\x22\n  status=\x22${values.status}\x22\n  :issuer=\x22issuerParty\x22\n  :recipient=\x22recipientParty\x22\n  :lines=\x22statementLines\x22${printAttr}\n/>`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full">
            <TuxStatementSheet
              statement-id="STMT-2026-10-001"
              :title="values.title"
              :period-label="values.periodLabel"
              issue-date="2026-11-02"
              :status="values.status"
              :issuer="issuerParty"
              :recipient="recipientParty"
              :lines="statementLines"
              :adjustments="statementAdjustments"
              :approvals="settledStamps"
              remittance-ref="JRNL-2026-11-8841"
              digest="sha256:4e91c07b8a2f"
              :show-print-action="values.showPrintAction"
              @print="onPrint"
              @export-csv="onExportCsv"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">flagship · settled voucher with digital signoff stamps</p>
      <h2 class="heading--bold text-xl font-bold">
        Finalized monthly study recovery statement
      </h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Displays itemized consumption lines, indirect overhead and credit
        adjustments, cryptographic verification digest, and sequential signoff
        attestation cards.
      </p>
      <TuxExample class="mt-4" :vue="flagshipVue" :source="tuxStatementSheetSource">
        <div class="space-y-3">
          <TuxStatementSheet
            statement-id="STMT-2026-10-014"
            title="Resource Chargeback Statement"
            period-label="October 2026 (FY27-M02)"
            issue-date="2026-11-02"
            status="settled"
            :issuer="issuerParty"
            :recipient="recipientParty"
            :lines="statementLines"
            :adjustments="statementAdjustments"
            :approvals="settledStamps"
            remittance-ref="JRNL-2026-11-8841"
            digest="sha256:4e91c07b8a2f"
            @print="onPrint"
            @export-csv="onExportCsv"
          />
          <p v-if="lastAction" class="text-xs font-mono text-text-secondary">
            Event: {{ lastAction }}
          </p>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">pending review · embedded voucher without print toolbar</p>
      <h2 class="heading--bold text-xl font-bold">Awaiting principal investigator attestation</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>status="pending"</code> and <code>:show-print-action="false"</code>
        when embedding an unratified voucher inside an approval workflow view.
      </p>
      <TuxExample class="mt-4" :vue="pendingVue">
        <TuxStatementSheet
          statement-id="STMT-2026-11-003"
          title="Pending Study Recovery Voucher"
          period-label="November 2026"
          issue-date="2026-11-03"
          status="pending"
          :issuer="issuerParty"
          :recipient="recipientParty"
          :lines="statementLines"
          :approvals="pendingStamps"
          :show-print-action="false"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Exported interfaces</h2>
      <TuxCodeBlock class="mt-4" :code="typesTs" lang="ts" filename="TuxStatementSheet.ts" />
    </section>
  </div>
</template>
