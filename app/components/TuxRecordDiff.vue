<script setup lang="ts">
/**
 * TuxRecordDiff — structured field and metric period-over-period delta viewer.
 *
 * Classifies each field as added, removed, changed, or unchanged, computes
 * signed deltas and percentage changes for numeric pairs, flags variances
 * exceeding `thresholdPct`, and supports a `Changes only` filter toggle.
 */
import { computed, ref, watch } from "vue";

export type RecordDiffStatus = "added" | "removed" | "changed" | "unchanged";

export interface RecordDiffField {
  key: string;
  label: string;
  before: string | number | null;
  after: string | number | null;
  unit?: string;
  thresholdPct?: number;
}

interface ComputedDiffRow {
  field: RecordDiffField;
  status: RecordDiffStatus;
  isNumericPair: boolean;
  delta: number | null;
  pctChange: number | null;
  exceedsThreshold: boolean;
}

interface Props {
  /** Ordered list of structured fields or metrics to compare. */
  fields: RecordDiffField[];
  /** Column header label for the baseline/prior snapshot. */
  beforeLabel?: string;
  /** Column header label for the current/updated snapshot. */
  afterLabel?: string;
  /** Start with unchanged rows hidden. */
  changesOnlyDefault?: boolean;
  /** Optional heading rendered in the component header bar. */
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  beforeLabel: "Baseline",
  afterLabel: "Current",
  changesOnlyDefault: false,
  title: undefined,
});

const emit = defineEmits<{
  toggleFilter: [changesOnly: boolean];
}>();

const changesOnly = ref<boolean>(props.changesOnlyDefault);

watch(
  () => props.changesOnlyDefault,
  (next) => {
    changesOnly.value = next;
  },
);

function isEmptyValue(val: string | number | null | undefined): boolean {
  return val === null || val === undefined || val === "";
}

function classifyField(field: RecordDiffField): RecordDiffStatus {
  const beforeEmpty = isEmptyValue(field.before);
  const afterEmpty = isEmptyValue(field.after);
  if (beforeEmpty && !afterEmpty) return "added";
  if (!beforeEmpty && afterEmpty) return "removed";
  if (beforeEmpty && afterEmpty) return "unchanged";
  if (field.before === field.after) return "unchanged";
  return "changed";
}

const computedRows = computed<ComputedDiffRow[]>(() =>
  props.fields.map((field) => {
    const status = classifyField(field);
    const isNumericPair =
      typeof field.before === "number" &&
      Number.isFinite(field.before) &&
      typeof field.after === "number" &&
      Number.isFinite(field.after);

    let delta: number | null = null;
    let pctChange: number | null = null;
    let exceedsThreshold = false;

    if (isNumericPair) {
      const beforeNum = field.before as number;
      const afterNum = field.after as number;
      delta = Number((afterNum - beforeNum).toFixed(4));
      pctChange = beforeNum !== 0 ? (delta / Math.abs(beforeNum)) * 100 : null;
      if (field.thresholdPct !== undefined && pctChange !== null) {
        exceedsThreshold = Math.abs(pctChange) > field.thresholdPct;
      }
    }

    return {
      field,
      status,
      isNumericPair,
      delta,
      pctChange,
      exceedsThreshold,
    };
  }),
);

const changedCount = computed(
  () => computedRows.value.filter((r) => r.status === "changed").length,
);
const addedCount = computed(
  () => computedRows.value.filter((r) => r.status === "added").length,
);
const removedCount = computed(
  () => computedRows.value.filter((r) => r.status === "removed").length,
);

const visibleRows = computed<ComputedDiffRow[]>(() =>
  changesOnly.value
    ? computedRows.value.filter((r) => r.status !== "unchanged")
    : computedRows.value,
);

function toggleChangesOnly() {
  changesOnly.value = !changesOnly.value;
  emit("toggleFilter", changesOnly.value);
}

function formatScalar(val: string | number | null, unit?: string): string {
  if (isEmptyValue(val)) return "—";
  if (typeof val === "number") {
    const formatted = val.toLocaleString("en-US", { maximumFractionDigits: 4 });
    return unit ? `${formatted} ${unit}` : formatted;
  }
  return unit ? `${val} ${unit}` : String(val);
}

function formatSignedDelta(delta: number, unit?: string): string {
  const sign = delta > 0 ? "+" : delta < 0 ? "-" : "";
  const formatted = Math.abs(delta).toLocaleString("en-US", {
    maximumFractionDigits: 4,
  });
  const suffix = unit ? ` ${unit}` : "";
  return `${sign}${formatted}${suffix}`;
}

function formatSignedPct(pct: number): string {
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

function statusBadgeLabel(status: RecordDiffStatus): string {
  if (status === "added") return "+ Added";
  if (status === "removed") return "− Removed";
  if (status === "changed") return "Δ Changed";
  return "= Unchanged";
}
</script>

<template>
  <div class="tux-record-diff">
    <div class="tux-record-diff__header">
      <div class="tux-record-diff__heading-group">
        <h3 v-if="title" class="tux-record-diff__title">{{ title }}</h3>
        <p class="tux-record-diff__summary">
          {{ changedCount }} changed · {{ addedCount }} added · {{ removedCount }} removed
        </p>
      </div>

      <button
        type="button"
        class="tux-record-diff__filter-btn"
        :class="{ 'tux-record-diff__filter-btn--active': changesOnly }"
        :aria-pressed="changesOnly"
        @click="toggleChangesOnly"
      >
        Changes only
      </button>
    </div>

    <div
      class="tux-record-diff__scroll"
      tabindex="0"
      role="region"
      :aria-label="title || `${beforeLabel} versus ${afterLabel} field comparison`"
    >
      <table class="tux-record-diff__table">
        <caption class="tux-record-diff__sr-caption">
          {{ title || `${beforeLabel} versus ${afterLabel} field comparison` }}
        </caption>

        <thead>
          <tr>
            <th scope="col" class="tux-record-diff__th">Field</th>
            <th scope="col" class="tux-record-diff__th">Status</th>
            <th scope="col" class="tux-record-diff__th tux-record-diff__th--val">
              {{ beforeLabel }}
            </th>
            <th scope="col" class="tux-record-diff__th tux-record-diff__th--val">
              {{ afterLabel }}
            </th>
            <th scope="col" class="tux-record-diff__th tux-record-diff__th--val">
              Delta
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="visibleRows.length === 0">
            <td colspan="5" class="tux-record-diff__empty">
              No differences detected between {{ beforeLabel }} and {{ afterLabel }}.
            </td>
          </tr>

          <tr
            v-for="row in visibleRows"
            :key="row.field.key"
            class="tux-record-diff__row"
            :class="[
              `tux-record-diff__row--${row.status}`,
              { 'tux-record-diff__row--exceeded': row.exceedsThreshold },
            ]"
          >
            <th scope="row" class="tux-record-diff__field-th">
              <span class="tux-record-diff__field-label">{{ row.field.label }}</span>
              <code class="tux-record-diff__field-key">{{ row.field.key }}</code>
            </th>

            <td class="tux-record-diff__td">
              <span
                class="tux-record-diff__status-badge"
                :class="`tux-record-diff__status-badge--${row.status}`"
              >
                {{ statusBadgeLabel(row.status) }}
              </span>
            </td>

            <td class="tux-record-diff__td tux-record-diff__td--val">
              {{ formatScalar(row.field.before, row.field.unit) }}
            </td>

            <td class="tux-record-diff__td tux-record-diff__td--val tux-record-diff__td--after">
              {{ formatScalar(row.field.after, row.field.unit) }}
            </td>

            <td class="tux-record-diff__td tux-record-diff__td--val">
              <div class="tux-record-diff__delta-cell">
                <template v-if="row.isNumericPair && row.delta !== null">
                  <span class="tux-record-diff__delta-num">
                    {{ formatSignedDelta(row.delta, row.field.unit) }}
                    <span v-if="row.pctChange !== null" class="tux-record-diff__delta-pct">
                      ({{ formatSignedPct(row.pctChange) }})
                    </span>
                  </span>
                  <span
                    v-if="row.exceedsThreshold"
                    class="tux-record-diff__threshold-badge"
                  >
                    Exceeds &plusmn;{{ row.field.thresholdPct }}%
                  </span>
                </template>
                <span v-else-if="row.status === 'added'" class="tux-record-diff__delta-text">
                  New value
                </span>
                <span v-else-if="row.status === 'removed'" class="tux-record-diff__delta-text">
                  Cleared
                </span>
                <span v-else-if="row.status === 'changed'" class="tux-record-diff__delta-text">
                  Updated
                </span>
                <span v-else class="tux-record-diff__delta-muted">
                  —
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.tux-record-diff {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  font-family: var(--font-body);
  color: var(--text-primary);
  line-height: 1.5;
}

.tux-record-diff__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  padding: var(--space-12) var(--space-16);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.tux-record-diff__heading-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tux-record-diff__title {
  margin: 0;
  font-family: var(--font-bold);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-record-diff__summary {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
}

.tux-record-diff__filter-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-16);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.tux-record-diff__filter-btn:hover {
  border-color: var(--brand-primary);
}

.tux-record-diff__filter-btn--active {
  background: var(--brand-fill);
  color: var(--text-on-brand);
  border-color: var(--brand-fill);
}

.tux-record-diff__filter-btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-record-diff__scroll {
  overflow-x: auto;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
}

.tux-record-diff__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.tux-record-diff__sr-caption {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.tux-record-diff__th {
  padding: var(--space-12) var(--space-16);
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-secondary);
  background: var(--surface-sunken);
  border-bottom: 2px solid var(--surface-border);
  white-space: nowrap;
}

.tux-record-diff__th--val {
  text-align: right;
}

.tux-record-diff__empty {
  padding: var(--space-24);
  text-align: center;
  color: var(--text-secondary);
}

.tux-record-diff__row {
  border-bottom: 1px solid var(--surface-border-subtle);
}

.tux-record-diff__row:last-child {
  border-bottom: 0;
}

.tux-record-diff__row--exceeded {
  background: var(--wash-brand-4);
}

.tux-record-diff__field-th {
  padding: var(--space-12) var(--space-16);
  text-align: left;
  vertical-align: middle;
}

.tux-record-diff__field-label {
  display: block;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-record-diff__field-key {
  display: inline-block;
  margin-top: 2px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-muted);
}

.tux-record-diff__td {
  padding: var(--space-12) var(--space-16);
  vertical-align: middle;
}

.tux-record-diff__td--val {
  text-align: right;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.tux-record-diff__td--after {
  font-weight: 600;
}

.tux-record-diff__status-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px var(--space-8);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.tux-record-diff__status-badge--added {
  background: var(--status-ok-fill);
  color: var(--status-ok-ink);
  border: 1px solid var(--status-ok);
}

.tux-record-diff__status-badge--changed {
  background: var(--status-warning-fill);
  color: var(--status-warning-ink);
  border: 1px solid var(--status-warning);
}

.tux-record-diff__status-badge--removed {
  background: var(--surface-sunken);
  color: var(--text-primary);
  border: 1px solid var(--color-error);
  border-left-width: 3px;
}

.tux-record-diff__status-badge--unchanged {
  background: var(--surface-sunken);
  color: var(--text-secondary);
  border: 1px solid var(--surface-border);
}

.tux-record-diff__delta-cell {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-4);
}

.tux-record-diff__delta-num {
  font-weight: 700;
  color: var(--text-primary);
}

.tux-record-diff__delta-pct {
  font-weight: 500;
  color: var(--text-secondary);
  margin-left: var(--space-4);
}

.tux-record-diff__threshold-badge {
  display: inline-block;
  padding: 1px var(--space-8);
  border-radius: var(--radius-sm);
  background: var(--brand-fill);
  color: var(--text-on-brand);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 700;
}

.tux-record-diff__delta-text {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.tux-record-diff__delta-muted {
  color: var(--text-muted);
}

@media (prefers-reduced-motion: reduce) {
  .tux-record-diff__filter-btn {
    transition: none;
  }
}
</style>
