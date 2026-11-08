import type { PeriodPreset, PeriodRangeValue } from "~/components/TuxPeriodPicker.vue";
import type { EntityOption } from "~/components/TuxEntityPicker.vue";
import type { ResourceChannelMetric } from "~/components/TuxResourceMeter.vue";
import type { UptimeBucketItem } from "~/components/TuxUptimeStrip.vue";
import type { AnomalySeriesPoint } from "~/components/TuxAnomalyCard.vue";
import type { LogLineEntry } from "~/components/TuxLogViewer.vue";
import type { RateScheduleItem } from "~/components/TuxRateSchedule.vue";
import type { SimulatorParameter, SimulatorPreset } from "~/components/TuxSimulator.vue";
import type {
  StatementApprovalStamp,
  StatementLineItem,
  StatementParty,
} from "~/components/TuxStatementSheet.vue";
import type { AuditLogEntry } from "~/components/TuxAuditLog.vue";
import type { FeedConnectorItem } from "~/components/TuxFeedStatus.vue";

export const initialTelemetryPeriod: PeriodRangeValue = {
  start: "2026-11-01",
  end: "2026-11-30",
  preset: "nov",
  comparePrevious: true,
};

export const telemetryPresets: PeriodPreset[] = [
  { key: "nov", label: "Current Cycle (Nov)", start: "2026-11-01", end: "2026-11-30" },
  { key: "oct", label: "Prior Settled (Oct)", start: "2026-10-01", end: "2026-10-31" },
  { key: "q4", label: "Q4 Window", start: "2026-10-01", end: "2026-12-31" },
];

export const telemetryEntities: EntityOption[] = [
  {
    id: "study-410922",
    code: "02-410922-00010",
    label: "Connected Freight Corridor Telemetry",
    subtitle: "Multimodal Network Analytics Division",
    owner: "Dr. Elena Vance",
    status: "active",
    metaLabel: "$48,200 remaining",
  },
  {
    id: "study-411085",
    code: "02-411085-00020",
    label: "Autonomous Intersection Safety Evaluation",
    subtitle: "Automated Mobility & Sensing Lab",
    owner: "Dr. Marcus Sterling",
    status: "active",
    metaLabel: "$91,450 remaining",
  },
  {
    id: "study-410740",
    code: "02-410740-00015",
    label: "Statewide Pavement LiDAR Archive",
    subtitle: "Materials & Structural Systems",
    owner: "Dr. Priya Nair",
    status: "expiring",
    metaLabel: "Closes in 14d · $6,120 left",
  },
];

export const gpuClusterChannels: ResourceChannelMetric[] = [
  { id: "gpu", label: "GPU Accelerators", capacity: 32, allocated: 28, utilized: 6, unit: "GPUs" },
  { id: "vcpu", label: "Compute vCPU Cores", capacity: 512, allocated: 384, utilized: 312, unit: "cores" },
  { id: "mem", label: "System Memory", capacity: 2048, allocated: 1536, utilized: 1290, unit: "GiB" },
  { id: "nvme", label: "Scratch NVMe Pool", capacity: 120, allocated: 96, utilized: 82, unit: "TiB" },
];

export const lakehousePoolChannels: ResourceChannelMetric[] = [
  { id: "obj", label: "Table Archive Storage", capacity: 800, allocated: 620, utilized: 594, unit: "TiB" },
  { id: "qcpu", label: "Query Engine Workers", capacity: 256, allocated: 192, utilized: 168, unit: "cores" },
  { id: "cat", label: "Metadata Catalog Memory", capacity: 256, allocated: 128, utilized: 94, unit: "GiB" },
];

export const catalogUptimeBuckets: UptimeBucketItem[] = Array.from({ length: 30 }, (_, idx) => {
  const day = String(idx + 1).padStart(2, "0");
  if (idx === 11) {
    return {
      id: `d-${day}`,
      label: `2026-10-${day}`,
      state: "maintenance",
      uptimePct: 99.4,
      latencyMs: 38,
      incidentSummary: "Scheduled 8m catalog compaction window",
    };
  }
  if (idx === 22) {
    return {
      id: `d-${day}`,
      label: `2026-10-${day}`,
      state: "degraded",
      uptimePct: 98.7,
      latencyMs: 142,
      incidentSummary: "Elevated partition scan latency during bulk LiDAR ingest",
    };
  }
  return {
    id: `d-${day}`,
    label: `2026-10-${day}`,
    state: "operational",
    uptimePct: 100,
    latencyMs: 19 + (idx % 7),
  };
});

export const anomalySeries: AnomalySeriesPoint[] = [
  { label: "D-6", actual: 410, baselineMin: 360, baselineMax: 460 },
  { label: "D-5", actual: 435, baselineMin: 365, baselineMax: 470 },
  { label: "D-4", actual: 420, baselineMin: 360, baselineMax: 465 },
  { label: "D-3", actual: 448, baselineMin: 370, baselineMax: 475 },
  { label: "D-2", actual: 690, baselineMin: 370, baselineMax: 480 },
  { label: "D-1", actual: 1280, baselineMin: 375, baselineMax: 485 },
  { label: "Today", actual: 1840, baselineMin: 380, baselineMax: 490 },
];

export const collectorFeeds: FeedConnectorItem[] = [
  {
    id: "feed-prom",
    name: "Self-Hosted Cluster Metrics Collector",
    category: "15s scrape · vCPU / GPU / NVMe",
    status: "healthy",
    lastSynced: "1 min ago",
    lagLabel: "0m lag",
    recordCount: 148920,
  },
  {
    id: "feed-cat",
    name: "Table Catalog & Object Snapshot Meter",
    category: "Hourly snapshot · TiB-mo & query ops",
    status: "healthy",
    lastSynced: "14 mins ago",
    lagLabel: "0.2h lag",
    recordCount: 19410,
  },
  {
    id: "feed-ext",
    name: "External Multi-Pool Usage Export",
    category: "Daily normalized usage feed",
    status: "stale",
    lastSynced: "7 hours ago",
    lagLabel: "7h lag",
    recordCount: 42810,
    message: "2 unlinked ephemeral namespaces routed to attribution rules engine.",
  },
];

export const collectorLogs: LogLineEntry[] = [
  {
    id: 1,
    timestamp: "2026-11-04 14:58:02Z",
    level: "info",
    source: "meter-rollup",
    message: "Normalized 148,920 self-hosted container & GPU samples against active rate schedule rev-2026-Q4.",
  },
  {
    id: 2,
    timestamp: "2026-11-04 14:58:09Z",
    level: "info",
    source: "attribution-engine",
    message: "Auto-attributed 98.4% of ledger rows (exact_tag: 81.2%, rule_match: 11.9%, proportional_split: 5.3%).",
  },
  {
    id: 3,
    timestamp: "2026-11-04 14:59:14Z",
    level: "warn",
    source: "efficiency-guard",
    message: "Pool 'onprem-gpu-pool-a' allocated 28/32 GPUs (87.5%) with 6 GPUs active (21.4% efficiency) — 22 idle GPUs flagged.",
  },
  {
    id: 4,
    timestamp: "2026-11-04 15:00:01Z",
    level: "error",
    source: "velocity-detector",
    message: "Burn-rate threshold breached on study 02-410922-00010: $1,840/day (+318% vs 14d rolling band) from unthrottled LiDAR replay job.",
  },
  {
    id: 5,
    timestamp: "2026-11-04 15:00:04Z",
    level: "info",
    source: "snapshot-verifier",
    message: "Prior cycle snapshot STMT-2026-10-0419 verified immutable (sha256: 9f84c2e1...7b30a9).",
  },
];

export const initialRateSchedules: RateScheduleItem[] = [
  {
    id: "rate-gpu-a100",
    code: "SCHED-ACCEL-01",
    name: "Self-Hosted Tensor GPU Node",
    category: "Accelerator Compute",
    unit: "GPU-hr",
    pricingModel: "tiered",
    baseRate: 1.85,
    overheadMultiplier: 1.0,
    effectiveFrom: "2026-09-01",
    effectiveTo: null,
    status: "active",
    tiers: [
      { id: "t1", label: "Baseline Research Allocation", fromQuantity: 0, upToQuantity: 200, unitRate: 1.85 },
      { id: "t2", label: "Sustained Batch Tier", fromQuantity: 200, upToQuantity: 1000, unitRate: 1.45 },
      { id: "t3", label: "High-Volume Dedicated Tier", fromQuantity: 1000, upToQuantity: null, unitRate: 1.15 },
    ],
  },
  {
    id: "rate-lake-tib",
    code: "SCHED-STOR-02",
    name: "Partitioned Table & Parquet Object Archive",
    category: "Managed Storage",
    unit: "TiB-mo",
    pricingModel: "tiered",
    baseRate: 14.0,
    overheadMultiplier: 1.0,
    effectiveFrom: "2026-09-01",
    effectiveTo: null,
    status: "active",
    tiers: [
      { id: "s1", label: "Standard Study Quota", fromQuantity: 0, upToQuantity: 50, unitRate: 14.0 },
      { id: "s2", label: "Bulk Corridor Telemetry Tier", fromQuantity: 50, upToQuantity: null, unitRate: 9.5 },
    ],
  },
  {
    id: "rate-query-vcpu",
    code: "SCHED-QRY-03",
    name: "Distributed SQL & Batch Worker Pool",
    category: "Query Compute",
    unit: "vCPU-hr",
    pricingModel: "flat",
    baseRate: 0.065,
    overheadMultiplier: 1.08,
    effectiveFrom: "2026-09-01",
    effectiveTo: null,
    status: "active",
  },
  {
    id: "rate-gpu-fy27q2",
    code: "SCHED-ACCEL-02",
    name: "Self-Hosted Tensor GPU Node (Next Quarter)",
    category: "Accelerator Compute",
    unit: "GPU-hr",
    pricingModel: "flat",
    baseRate: 1.65,
    overheadMultiplier: 1.0,
    effectiveFrom: "2027-01-01",
    effectiveTo: null,
    status: "scheduled",
  },
];

export const initialSimulatorParams: SimulatorParameter[] = [
  {
    id: "sim-gpu",
    label: "Accelerator Compute Hours",
    description: "Vision model training & corridor simulation runs",
    unit: "GPU-hr",
    min: 0,
    max: 1200,
    step: 20,
    value: 320,
    primaryRate: 1.65,
    comparisonRate: 4.10,
  },
  {
    id: "sim-query",
    label: "Distributed Worker Compute",
    description: "Scheduled ETL & interactive analytics queries",
    unit: "vCPU-hr",
    min: 0,
    max: 20000,
    step: 250,
    value: 6500,
    primaryRate: 0.07,
    comparisonRate: 0.14,
  },
  {
    id: "sim-storage",
    label: "Immutable Table & Object Storage",
    description: "Compressed columnar sensor & video frame archives",
    unit: "TiB-mo",
    min: 0,
    max: 400,
    step: 5,
    value: 85,
    primaryRate: 11.50,
    comparisonRate: 23.00,
  },
];

export const simulatorPresets: SimulatorPreset[] = [
  {
    id: "steady",
    label: "Steady Corridor Ops",
    values: { "sim-gpu": 160, "sim-query": 4000, "sim-storage": 60 },
  },
  {
    id: "retrain",
    label: "Quarterly Model Retraining",
    values: { "sim-gpu": 760, "sim-query": 11500, "sim-storage": 140 },
  },
  {
    id: "archive",
    label: "Cold Archive Mode",
    values: { "sim-gpu": 0, "sim-query": 1000, "sim-storage": 210 },
  },
];

export const statementIssuer: StatementParty = {
  name: "Research Computing & Data Infrastructure",
  code: "SVC-RCDI-004",
  department: "Enterprise Systems & Private Cloud Operations",
  contact: "rcdi-billing@example.edu",
};

export const statementRecipient: StatementParty = {
  name: "Connected Freight Corridor Telemetry",
  code: "02-410922-00010",
  department: "Multimodal Network Analytics Division",
  contact: "Dr. Elena Vance (Principal Investigator)",
};

export const statementLines: StatementLineItem[] = [
  {
    id: "ln-1",
    category: "Self-Hosted Accelerator Pool",
    description: "Tensor GPU Node Allocation (SCHED-ACCEL-01 · Tiered)",
    quantity: 310,
    unit: "GPU-hr",
    unitRate: 1.72,
    amount: 533.20,
  },
  {
    id: "ln-2",
    category: "Self-Hosted Query & Table Pool",
    description: "Distributed Worker Compute (SCHED-QRY-03 · 1.08x recovery)",
    quantity: 6420,
    unit: "vCPU-hr",
    unitRate: 0.0702,
    amount: 450.68,
  },
  {
    id: "ln-3",
    category: "Self-Hosted Query & Table Pool",
    description: "Partitioned Parquet & Table Storage (SCHED-STOR-02)",
    quantity: 78,
    unit: "TiB-mo",
    unitRate: 12.38,
    amount: 965.64,
  },
  {
    id: "ln-4",
    category: "External Compute Pool",
    description: "Pass-Through Burst Object Egress & Edge Relay",
    quantity: 1,
    unit: "cycle",
    unitRate: 618.40,
    amount: 618.40,
  },
];

export const statementAdjustments = [
  { label: "Idle Reservation Reclaim Credit (Auto-Policy)", amount: -142.00 },
];

export const statementApprovals: StatementApprovalStamp[] = [
  {
    id: "ap-1",
    role: "Operations Reconciliation",
    signer: "M. Alvarez",
    status: "approved",
    timestamp: "2026-11-01 09:14",
    decisionNote: "100% of external & self-hosted rows attributed.",
  },
  {
    id: "ap-2",
    role: "Sponsored Contract Verification",
    signer: "S. Lindqvist",
    status: "approved",
    timestamp: "2026-11-01 13:42",
    decisionNote: "Allowable under active contract ceiling ($48,200 remaining).",
  },
  {
    id: "ap-3",
    role: "Principal Investigator Attestation",
    signer: "Dr. Elena Vance",
    status: "approved",
    timestamp: "2026-11-02 08:30",
    decisionNote: "Verified · Continue lease into next 30-day cycle.",
  },
  {
    id: "ap-4",
    role: "Financial Settlement Review",
    signer: "R. Takahashi",
    status: "approved",
    timestamp: "2026-11-02 15:05",
    decisionNote: "Queued for single-click portal posting.",
  },
];

export const initialAuditEntries: AuditLogEntry[] = [
  {
    id: "aud-904",
    timestamp: "2026-11-02 15:05:19Z",
    actor: "R. Takahashi",
    actorRole: "Financial Reviewer",
    action: "Frozen cycle statement snapshot STMT-2026-10-0419",
    category: "settlement",
    severity: "info",
    target: "02-410922-00010",
    reason: "All 4 verification stages signed; locked 168,330 underlying usage rows.",
    digest: "sha256:9f84c2e17b30a9",
    changes: [
      { field: "snapshot_status", before: "pending_finance_review", after: "settled" },
      { field: "net_amount", before: "$2,567.92", after: "$2,425.92" },
    ],
  },
  {
    id: "aud-903",
    timestamp: "2026-11-02 08:30:04Z",
    actor: "Dr. Elena Vance",
    actorRole: "Principal Investigator",
    action: "Attested monthly statement & extended workspace lease (+30d)",
    category: "signoff",
    severity: "info",
    target: "02-410922-00010",
    reason: "Confirmed corridor LiDAR replay runs and continued active compute window.",
    digest: "sha256:41bc08d2e519f0",
    changes: [
      { field: "pi_attestation", before: "pending", after: "approved (continue)" },
      { field: "lease_expires_at", before: "2026-11-05", after: "2026-12-05" },
    ],
  },
  {
    id: "aud-902",
    timestamp: "2026-11-01 11:18:44Z",
    actor: "M. Alvarez",
    actorRole: "Resource Administrator",
    action: "Created persistent namespace attribution rule",
    category: "attribution",
    severity: "info",
    target: "ns/corridor-lidar-ingest-*",
    reason: "Mapped untagged batch namespace to 02-410922-00010 for automatic future ingestion.",
    digest: "sha256:73de91a044cc12",
    changes: [
      { field: "attribution_method", before: "unlinked", after: "rule_match (RULE-118)" },
      { field: "entity_id", before: "NULL", after: "02-410922-00010" },
    ],
  },
  {
    id: "aud-901",
    timestamp: "2026-10-28 16:40:11Z",
    actor: "C. Patel",
    actorRole: "Platform Architect",
    action: "Scheduled Q1 GPU unit-rate revision (SCHED-ACCEL-02)",
    category: "rate",
    severity: "warning",
    target: "SCHED-ACCEL-02",
    reason: "Lowered self-hosted GPU-hr tariff after cluster amortization milestone; prior closed cycles untouched.",
    digest: "sha256:18fa67c902be41",
    changes: [
      { field: "base_rate", before: "$1.85 / GPU-hr", after: "$1.65 / GPU-hr (effective 2027-01-01)" },
    ],
  },
];
