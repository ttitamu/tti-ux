# Telemetry, Chargeback & Governance Architecture

When an operational application unifies pre-priced external resource feeds with self-hosted compute, accelerator, query, and storage pools, UI primitives alone are only half the contract. Without a normalized usage ledger, effective-dated rate schedules, and persistent attribution rules, human operators end up stitching together monthly spreadsheets and email signoffs.

This doctrine specifies how TUX's **27 resource-governance and telemetry primitives** map onto three canonical, system-agnostic backend subsystems. Compare [Operational Surfaces](ops-surfaces.md) for status-ramp token rules (`--status-*`, `ACK ≠ MAINT`) and [`/examples/resource-governance`](/examples/resource-governance) + [`/examples/telemetry-chargeback`](/examples/telemetry-chargeback) for live assemblies.

---

## 1. Normalized Usage Ledger (`usage_ledger_entries`)

External resource feeds typically arrive pre-priced in currency, whereas self-hosted pools (container clusters, GPU nodes, distributed query engines, table catalogs, and object archives) emit raw physical or logical units (`vCPU-hr`, `GPU-hr`, `TiB-mo`, `GiB`). Both streams normalize into one canonical fact table:

| Column | Type | Purpose & UI Binding |
|---|---|---|
| `entry_id` | `UUID` | Immutable primary key; displayed via [`TuxCopyToken`](/components/copy-token). |
| `billing_period` | `CHAR(7)` | Cycle partition (`YYYY-MM`); selected via [`TuxPeriodPicker`](/components/period-picker). |
| `usage_start` / `usage_end` | `TIMESTAMPTZ` | Metering window; connector lag surfaced in [`TuxFeedStatus`](/components/feed-status). |
| `pool_id` | `TEXT` | Source pool identifier (external account or self-hosted cluster). |
| `service_category` | `TEXT` | `compute`, `accelerator`, `storage`, `query`, or `network` — drives [`TuxChartSankey`](/visualizations/chart-sankey) and [`TuxPivotMatrix`](/components/pivot-matrix). |
| `resource_identifier` | `TEXT` | Namespace, workspace, catalog table URI, or node identifier. |
| `raw_tags` | `JSONB` | Harvested `key = value` metadata validated against [`TuxKeyValueInput`](/components/key-value-input) schemas. |
| `quantity` / `unit` | `NUMERIC` / `TEXT` | Raw metered consumption (`124.5`, `GPU-hr`). |
| `pricing_origin` | `TEXT` | `external_billed` or `rate_schedule_computed`. |
| `rate_schedule_id` | `UUID` | Foreign key to the effective-dated [`TuxRateSchedule`](/components/rate-schedule) version active during `usage_start`. |
| `applied_unit_rate` | `NUMERIC` | Unit rate resolved from flat or tiered schedule brackets. |
| `overhead_multiplier` | `NUMERIC` | Indirect/facilities recovery factor (`1.0000` default). |
| `effective_amount` | `NUMERIC` | `quantity × applied_unit_rate × overhead_multiplier` — rolled up in [`TuxLedgerTable`](/components/ledger-table). |
| `entity_id` | `TEXT` | Target project/account code from [`TuxEntityPicker`](/components/entity-picker) / [`TuxSegmentedInput`](/components/segmented-input); `NULL` when unlinked. |
| `attribution_method` | `TEXT` | `exact_tag`, `rule_match`, `proportional_split`, `manual`, or `unlinked`. |
| `confidence_score` | `NUMERIC` | `0.000–1.000` candidate match score surfaced in [`TuxRecordMatcher`](/components/record-matcher). |
| `snapshot_id` | `UUID` | Populated when frozen into an immutable settled statement ([`TuxStatementSheet`](/components/statement-sheet)). |

---

## 2. Effective-Dated Rate Schedules & Immutable Cycle Snapshots

Self-hosted infrastructure requires transparent unit pricing that never retroactively mutates closed fiscal periods:

1. **Versioned Rate Schedules (`rate_schedules` + `rate_tiers`)**:
   - Each schedule carries `[effective_from, effective_to)` bounds (`effective_to IS NULL` marks the active schedule) and a pricing model (`flat`, `tiered`, or `volume`).
   - Authoring a new rate for next quarter closes the prior schedule's `effective_to` timestamp and inserts a new `scheduled` revision in [`TuxRateSchedule`](/components/rate-schedule).
   - Project leads model upcoming compute/storage demand or compare external vs. self-hosted pool economics interactively in [`TuxSimulator`](/components/simulator) before committing capacity.
2. **Multi-Party Signoff & Lease Gating (`statement_snapshots`)**:
   - Cycle state machine surfaced in [`TuxStageBoard`](/components/stage-board) and [`TuxSignoffChain`](/components/signoff-chain):
     `open` → `reconciling` → `contract_verification` → `owner_attestation` → `finance_review` → `settled`.
   - During `owner_attestation`, responsible leads select a continuation lease posture (`continue`, `scale_down`, or `decommission`), updating [`TuxLeaseBadge`](/components/lease-badge) and optional [`TuxScheduleMatrix`](/components/schedule-matrix) operating windows.
   - Transitioning to `settled` computes a `payload_sha256` digest, locks all member `usage_ledger_entries`, renders archival vouchers via [`TuxStatementSheet`](/components/statement-sheet) inside [`TuxReportFrame`](/reports/frame), and records every state transition and field delta in [`TuxAuditLog`](/components/audit-log) / [`TuxRecordDiff`](/components/record-diff).

---

## 3. Persistent Attribution Rules & Live Monitoring Loop

Replacing manual end-of-cycle triage requires closing two operational loops — **automated attribution on ingest** and **continuous mid-cycle telemetry monitoring**:

### Attribution Precedence (`attribution_rules`)
1. **Validated Direct Tags (`exact_tag`)**: Harvested account/project tags verified against active [`TuxEntityPicker`](/components/entity-picker) entities (expired or closed entities automatically divert to the exception queue rather than failing downstream procurement).
2. **Scoped Match Rules (`rule_match`)**: Rules saved from [`TuxRecordMatcher`](/components/record-matcher) mapping `(pool_id, namespace | schema | job_prefix)` → `entity_id`, turning month-1 human resolutions into month-2+ zero-touch ingestion.
3. **Proportional Split Templates (`proportional_split`)**: Named [`TuxProportionalInput`](/components/proportional-input) allocations that distribute shared platform subscriptions, catalog overhead, or multi-tenant clusters across participating projects.
4. **Orphan Queue (`unlinked`)**: Only unseen, untagged workloads enter [`TuxRecordMatcher`](/components/record-matcher); schema-drifted CSV/Parquet imports align through [`TuxColumnMapper`](/components/column-mapper).

### Continuous Capacity, SLI & Velocity Monitoring
- **Allocated vs. Actual Efficiency**: [`TuxResourceMeter`](/components/resource-meter) compares billed reservation against real utilization across CPU, memory, accelerators, and storage so idle over-reservations are reclaimed mid-cycle.
- **Historical Availability**: [`TuxUptimeStrip`](/components/uptime-strip) tracks 24h / 30d / 90d SLI ticks alongside [`TuxFeedStatus`](/components/feed-status) sync health.
- **Mid-Cycle Burn-Rate & Spike Alerts**: [`TuxAnomalyCard`](/components/anomaly-card) and [`TuxThresholdBar`](/components/threshold-bar) flag runaway workloads or unlinked spend spikes against rolling baselines and ceilings, while [`TuxLogViewer`](/components/log-viewer) surfaces collector and job diagnostics inline.
