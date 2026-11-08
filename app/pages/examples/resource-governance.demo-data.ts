import type { PeriodPreset, PeriodRangeValue } from "~/components/TuxPeriodPicker.vue";
import type { EntityOption } from "~/components/TuxEntityPicker.vue";
import type { ThresholdSegment } from "~/components/TuxThresholdBar.vue";
import type { SankeyLink, SankeyNode } from "~/components/TuxChartSankey.vue";
import type { WaterfallStep } from "~/components/TuxChartWaterfall.vue";
import type { FeedConnectorItem } from "~/components/TuxFeedStatus.vue";
import type { UnmatchedRecordItem } from "~/components/TuxRecordMatcher.vue";
import type { ProportionalSlice } from "~/components/TuxProportionalInput.vue";
import type { TargetFieldSpec } from "~/components/TuxColumnMapper.vue";
import type { StageCardItem, StageLane } from "~/components/TuxStageBoard.vue";
import type { RecordDiffField } from "~/components/TuxRecordDiff.vue";
import type { SignoffDecisionOption, SignoffStage } from "~/components/TuxSignoffChain.vue";
import type { LedgerGroup } from "~/components/TuxLedgerTable.vue";
import type { CodeSegmentDef } from "~/components/TuxSegmentedInput.vue";
import type { KeySchemaDef, KeyValuePair } from "~/components/TuxKeyValueInput.vue";

export const initialPeriod: PeriodRangeValue = {
  start: "2026-10-01",
  end: "2026-10-31",
  preset: "oct",
  comparePrevious: true,
};

export const governancePresets: PeriodPreset[] = [
  { key: "oct", label: "Current Cycle (Oct)", start: "2026-10-01", end: "2026-10-31" },
  { key: "sep", label: "Prior Cycle (Sep)", start: "2026-09-01", end: "2026-09-30" },
  { key: "q4", label: "Q4 Window", start: "2026-10-01", end: "2026-12-31" },
  { key: "fy27", label: "FY27 YTD", start: "2026-09-01", end: "2026-10-31" },
];

export const studyEntities: EntityOption[] = [
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
    metaLabel: "Closes in 18d · $6,120 left",
  },
  {
    id: "study-409110",
    code: "02-409110-00005",
    label: "Legacy Urban Signal Retiming Phase I",
    subtitle: "Traffic Operations Group",
    owner: "Dr. Owen Mercer",
    status: "closed",
    metaLabel: "Period closed 2026-08-31",
    disabled: true,
  },
];

export const ceilingSegments: ThresholdSegment[] = [
  { key: "billed", label: "Prior Settled Cycles", value: 64.2, tone: "primary", pattern: "solid" },
  { key: "current", label: "Current Cycle Statement", value: 14.8, tone: "accent", pattern: "solid" },
  { key: "forecast", label: "Projected Run-Rate (30d)", value: 12.5, tone: "secondary", pattern: "hatched" },
];

export const flowNodes: SankeyNode[] = [
  { id: "src-cloud-a", label: "External Compute Pool A", stage: 0, toneIndex: 1 },
  { id: "src-cloud-b", label: "External Object & Warehouse Pool", stage: 0, toneIndex: 2 },
  { id: "src-onprem", label: "On-Prem Lakehouse & GPU Cluster", stage: 0, toneIndex: 3 },
  { id: "wk-spark", label: "Distributed Query & Batch Engine", stage: 1, toneIndex: 4 },
  { id: "wk-gpu", label: "Vision & Simulation GPU Nodes", stage: 1, toneIndex: 5 },
  { id: "wk-lake", label: "Table Catalog & Parquet Storage", stage: 1, toneIndex: 6 },
  { id: "st-freight", label: "02-410922 · Freight Telemetry", stage: 2, toneIndex: 1 },
  { id: "st-cav", label: "02-411085 · Intersection Safety", stage: 2, toneIndex: 2 },
  { id: "st-lidar", label: "02-410740 · Pavement LiDAR", stage: 2, toneIndex: 3 },
];

export const flowLinks: SankeyLink[] = [
  { source: "src-cloud-a", target: "wk-gpu", value: 8400 },
  { source: "src-cloud-a", target: "wk-spark", value: 4200 },
  { source: "src-cloud-b", target: "wk-spark", value: 6100 },
  { source: "src-cloud-b", target: "wk-lake", value: 3900 },
  { source: "src-onprem", target: "wk-gpu", value: 7500 },
  { source: "src-onprem", target: "wk-lake", value: 5800 },
  { source: "wk-spark", target: "st-freight", value: 6800 },
  { source: "wk-spark", target: "st-cav", value: 3500 },
  { source: "wk-gpu", target: "st-cav", value: 11200 },
  { source: "wk-gpu", target: "st-freight", value: 4700 },
  { source: "wk-lake", target: "st-lidar", value: 6200 },
  { source: "wk-lake", target: "st-freight", value: 3500 },
];

export const varianceSteps: WaterfallStep[] = [
  { key: "sep-base", label: "Prior Cycle", value: 34200, kind: "start" },
  { key: "gpu-burst", label: "LiDAR Re-Indexing", value: 4850, kind: "delta" },
  { key: "onprem-shift", label: "On-Prem Migration", value: -3900, kind: "delta" },
  { key: "idle-reclaim", label: "Standby Schedule", value: -1650, kind: "delta" },
  { key: "new-stream", label: "Corridor Stream", value: 2400, kind: "delta" },
  { key: "oct-total", label: "Current Cycle", value: 35900, kind: "total" },
];

export const pivotRows = [
  "02-410922 · Freight Telemetry",
  "02-411085 · Intersection Safety",
  "02-410740 · Pavement LiDAR",
];

export const pivotCols = [
  "Batch & Query Compute",
  "GPU Acceleration",
  "Columnar Table Storage",
  "Edge Stream Egress",
];

export const pivotValues = [
  [6800, 4700, 2100, 1400],
  [3500, 11200, 1400, 600],
  [1200, 900, 3200, 400],
];

export const initialFeeds: FeedConnectorItem[] = [
  {
    id: "feed-focus-a",
    name: "External Compute Pool A (Normalized Usage Export)",
    category: "External Provider",
    status: "healthy",
    lastSynced: "12m ago",
    recordCount: 48210,
    lagLabel: "0h lag",
  },
  {
    id: "feed-warehouse",
    name: "Shared Analytics Cluster System Metering",
    category: "Shared Subscription",
    status: "healthy",
    lastSynced: "18m ago",
    recordCount: 19405,
    lagLabel: "0h lag",
  },
  {
    id: "feed-lakehouse",
    name: "On-Prem Catalog, Query Engine & GPU Telemetry",
    category: "Private Cluster",
    status: "healthy",
    lastSynced: "4m ago",
    recordCount: 84120,
    lagLabel: "Real-time",
  },
  {
    id: "feed-registry",
    name: "Internal Study & Allocation Registry Sync",
    category: "Master Directory",
    status: "stale",
    lastSynced: "7h ago",
    recordCount: 1240,
    lagLabel: "7h behind",
    message: "Nightly delta sync queued behind maintenance window; manual sync available.",
  },
];

export const initialOrphans: UnmatchedRecordItem[] = [
  {
    id: "orph-1",
    sourceTitle: "Untagged Shared Analytics Cluster · wksp-freight-sim-04",
    sourceCode: "clus-9941a",
    sourceMeta: "Executed by e-vance@example.edu · 312.5 DBU-hrs · tag study_code=<missing>",
    amountLabel: "$624.80",
    candidates: [
      {
        id: "study-410922",
        code: "02-410922-00010",
        label: "Connected Freight Corridor Telemetry",
        confidence: 96,
        meta: "Matched via job owner e-vance@example.edu & namespace prefix",
      },
      {
        id: "study-411085",
        code: "02-411085-00020",
        label: "Autonomous Intersection Safety Evaluation",
        confidence: 41,
        meta: "Secondary co-investigator match",
      },
    ],
  },
  {
    id: "orph-2",
    sourceTitle: "On-Prem Table Namespace · catalog.pavement_raw_scans_v3",
    sourceCode: "ns-lidar-03",
    sourceMeta: "Owner group: materials-lab · 18.4 TB Parquet snapshots",
    amountLabel: "$276.00",
    candidates: [
      {
        id: "study-410740",
        code: "02-410740-00015",
        label: "Statewide Pavement LiDAR Archive",
        confidence: 92,
        meta: "Matched via schema owner group materials-lab",
      },
      {
        id: "study-410922",
        code: "02-410922-00010",
        label: "Connected Freight Corridor Telemetry",
        confidence: 28,
        meta: "Shared corridor boundary overlap",
      },
    ],
  },
];

export const initialSlices: ProportionalSlice[] = [
  { id: "s-freight", code: "02-410922", label: "Connected Freight Corridor Telemetry", value: 50, locked: false },
  { id: "s-cav", code: "02-411085", label: "Autonomous Intersection Safety", value: 35, locked: false },
  { id: "s-lidar", code: "02-410740", label: "Statewide Pavement LiDAR Archive", value: 15, locked: true },
];

export const externalCsvColumns = [
  "billing_period_start",
  "resource_identifier",
  "study_acct_code",
  "consumed_qty",
  "billed_usd",
  "operator_email",
];

export const externalCsvSamples = [
  {
    billing_period_start: "2026-10-01",
    resource_identifier: "gpu-node-pool-07",
    study_acct_code: "02-411085-00020",
    consumed_qty: 420,
    billed_usd: 1890.0,
    operator_email: "m-sterling@example.edu",
  },
  {
    billing_period_start: "2026-10-02",
    resource_identifier: "iceberg-compact-worker",
    study_acct_code: "02-410922-00010",
    consumed_qty: 185,
    billed_usd: 222.0,
    operator_email: "e-vance@example.edu",
  },
];

export const mapperTargetFields: TargetFieldSpec[] = [
  { key: "period_start", label: "Usage Date", required: true, type: "date", aliases: ["billing_period_start", "date"] },
  { key: "resource_id", label: "Resource Identifier", required: true, type: "string", aliases: ["resource_identifier"] },
  { key: "account_code", label: "Allocation Code", required: true, type: "string", aliases: ["study_acct_code", "project"] },
  { key: "quantity", label: "Consumed Units", required: false, type: "number", aliases: ["consumed_qty"] },
  { key: "amount", label: "Net Amount", required: true, type: "number", aliases: ["billed_usd", "cost"] },
];

export const workflowLanes: StageLane[] = [
  { id: "exceptions", label: "1 · Exception Triage", description: "Untagged or expiring items" },
  { id: "capacity", label: "2 · Funding & Ceiling Check", description: "Contract balance verification" },
  { id: "attestation", label: "3 · Lead Attestation", description: "Spend & continuation confirmation" },
  { id: "review", label: "4 · Final Fiscal Review", description: "Pre-posting audit check" },
  { id: "ready", label: "5 · Verified for Posting", description: "Single-click settlement ready" },
];

export const initialStageItems: StageCardItem[] = [
  {
    id: "stmt-101",
    stageId: "attestation",
    code: "02-410922-00010",
    title: "Connected Freight Corridor Telemetry",
    subtitle: "3 resource pools · +4.9% vs prior cycle",
    owner: "Dr. Elena Vance",
    metricValue: 15000,
    tags: ["Multi-Pool", "On-Prem Lakehouse"],
    priority: "normal",
  },
  {
    id: "stmt-102",
    stageId: "ready",
    code: "02-411085-00020",
    title: "Autonomous Intersection Safety",
    subtitle: "All 4 stages digitally signed off",
    owner: "Dr. Marcus Sterling",
    metricValue: 16700,
    tags: ["GPU Cluster", "Continue Next Cycle"],
    priority: "normal",
  },
  {
    id: "stmt-103",
    stageId: "capacity",
    code: "02-410740-00015",
    title: "Statewide Pavement LiDAR Archive",
    subtitle: "Window closes in 18 days · verify remaining ceiling",
    owner: "Dr. Priya Nair",
    metricValue: 5700,
    tags: ["Expiring Window", "18.4 TB Parquet"],
    priority: "high",
  },
];

export const statementDiffFields: RecordDiffField[] = [
  { key: "allocation_code", label: "Allocation Reference", before: "02-410922-00010", after: "02-410922-00010" },
  { key: "lead_owner", label: "Responsible Lead", before: "Dr. Elena Vance", after: "Dr. Elena Vance" },
  { key: "query_compute", label: "Distributed Query Engine", before: 5900, after: 6800, unit: "USD", thresholdPct: 10 },
  { key: "gpu_compute", label: "GPU Vision & Simulation", before: 5100, after: 4700, unit: "USD", thresholdPct: 10 },
  { key: "table_storage", label: "Columnar Table Storage", before: 2050, after: 2100, unit: "USD", thresholdPct: 10 },
  { key: "stream_egress", label: "Corridor Stream Ingest", before: 0, after: 1400, unit: "USD", thresholdPct: 10 },
];

export const initialSignoffStages: SignoffStage[] = [
  {
    id: "stg-admin",
    label: "1 · Operations Reconciliation",
    actorName: "M. Alvarez",
    actorRole: "Resource Operations Coordinator",
    status: "approved",
    timestamp: "2026-10-28 09:14",
    note: "All shared cluster workloads matched and split rules applied.",
  },
  {
    id: "stg-contracts",
    label: "2 · Agreement & Balance Verification",
    actorName: "S. Lindqvist",
    actorRole: "Sponsored Agreements Specialist",
    status: "approved",
    timestamp: "2026-10-28 13:40",
    note: "$48,200 unencumbered ceiling verified through 2027-08-31.",
  },
  {
    id: "stg-lead",
    label: "3 · Principal Lead Attestation & Renewal",
    actorName: "Dr. Elena Vance",
    actorRole: "Principal Investigator",
    status: "pending",
  },
  {
    id: "stg-finance",
    label: "4 · Final Accounting Sign-Off",
    actorName: "R. Takahashi",
    actorRole: "Fiscal Ledger Reviewer",
    status: "pending",
  },
];

export const continuationOptions: SignoffDecisionOption[] = [
  {
    value: "continue",
    label: "Continue active resources into next cycle",
    description: "Keep current compute pools, table namespaces, and weekday schedules active.",
  },
  {
    value: "hibernate",
    label: "Archive storage & pause compute at cycle end",
    description: "Retain cold table snapshots only and release active compute nodes.",
  },
];

export const ledgerGroups: LedgerGroup[] = [
  {
    id: "grp-onprem",
    label: "On-Prem Lakehouse & GPU Cluster",
    code: "POOL-LOCAL-01",
    badge: "Internal Rate Card",
    rows: [
      { id: "l-1", code: "TRINO-CPU", label: "Distributed SQL Engine Compute", meta: "ns: freight_corridor", quantity: 42500, unit: "core-hr", rate: 0.08, amount: 3400 },
      { id: "l-2", code: "GPU-L40S", label: "Vision Inference Node Pool", meta: "job: axle-class-v4", quantity: 1000, unit: "gpu-hr", rate: 2.35, amount: 2350 },
      { id: "l-3", code: "ICEBERG-S3", label: "Managed Columnar Table Storage", meta: "42.0 TB Parquet", quantity: 42000, unit: "GB-mo", rate: 0.025, amount: 1050 },
    ],
  },
  {
    id: "grp-shared",
    label: "Shared Analytics Subscription (Attributed)",
    code: "POOL-SHARED-02",
    badge: "50% Split + Tag Match",
    rows: [
      { id: "l-4", code: "DBU-BATCH", label: "Automated Feature Engineering Pipelines", meta: "wksp-freight-sim-04", quantity: 17000, unit: "unit-hr", rate: 0.2, amount: 3400 },
      { id: "l-5", code: "OBJ-HOT", label: "Staging Checkpoint Object Tier", meta: "35.0 TB hot tier", quantity: 35000, unit: "GB-mo", rate: 0.03, amount: 1050 },
    ],
  },
  {
    id: "grp-ext",
    label: "External Compute & Telemetry Ingest",
    code: "POOL-EXT-03",
    badge: "Direct Tag Match",
    rows: [
      { id: "l-6", code: "GPU-BURST", label: "Elastic Simulation Burst Nodes", meta: "tag: 02-410922-00010", quantity: 781.25, unit: "gpu-hr", rate: 3.008, amount: 2350 },
      { id: "l-7", code: "INGEST-MQTT", label: "Roadside Edge Telemetry Broker", meta: "280M messages", quantity: 1400, unit: "GB", rate: 1.0, amount: 1400 },
    ],
  },
];

export const referenceSegments: CodeSegmentDef[] = [
  { key: "member", label: "Unit", length: 2, charset: "digits", placeholder: "02" },
  { key: "study", label: "Study", length: 6, charset: "digits", placeholder: "410922" },
  { key: "sub", label: "Sub-Acct", length: 5, charset: "digits", placeholder: "00010" },
];

export const metadataSchema: KeySchemaDef[] = [
  { key: "allocation_code", label: "Allocation Code", required: true, suggestions: ["02-410922-00010", "02-411085-00020", "02-410740-00015"] },
  { key: "environment", label: "Environment Tier", required: true, suggestions: ["production", "staging", "sandbox"] },
  { key: "owner_contact", label: "Technical Owner", required: true, suggestions: ["e-vance@example.edu", "m-sterling@example.edu"] },
  { key: "lifecycle_policy", label: "Lifecycle Policy", required: false, suggestions: ["weekday-daytime", "24x7-critical", "archive-at-cycle-end"] },
];

export const initialMetadataPairs: KeyValuePair[] = [
  { key: "allocation_code", value: "02-410922-00010" },
  { key: "environment", value: "production" },
  { key: "owner_contact", value: "e-vance@example.edu" },
];

export const initialScheduleGrid: boolean[][] = Array.from({ length: 7 }, (_, dayIdx) =>
  Array.from({ length: 8 }, (__, slotIdx) => dayIdx < 5 && slotIdx >= 2 && slotIdx <= 5),
);
