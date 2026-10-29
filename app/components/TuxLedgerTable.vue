<script setup lang="ts">
/**
 * TuxLedgerTable — hierarchical grouped rollup table with collapsible
 * category headers, unit × rate math, subtotals, grand total, and
 * structured CSV/TSV export.
 */
import { computed, ref, useId } from "vue";

export interface LedgerLineItem {
  id: string;
  label: string;
  code?: string;
  meta?: string;
  quantity?: number;
  unit?: string;
  rate?: number;
  amount: number;
}

export interface LedgerGroup {
  id: string;
  label: string;
  code?: string;
  badge?: string;
  rows: LedgerLineItem[];
}

interface Props {
  /** Accessible table caption describing the ledger contents. */
  caption: string;
  /** Hierarchical category groups containing itemized ledger rows. */
  groups: LedgerGroup[];
  /** Prefix prepended to formatted monetary or metric values (e.g. "$"). */
  valuePrefix?: string;
  /** Suffix appended to formatted values (e.g. " kWh"). */
  valueSuffix?: string;
  /** Fixed decimal places for rates, subtotals, and amounts. */
  decimals?: number;
  /** Display Quantity and Rate columns alongside Line Item and Amount. */
  showQuantityRate?: boolean;
  /** Display Copy TSV and Export CSV actions in the toolbar. */
  exportable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  valuePrefix: "",
  valueSuffix: "",
  decimals: 2,
  showQuantityRate: true,
  exportable: true,
});

const emit = defineEmits<{
  export: [payload: { format: "csv" | "tsv"; content: string }];
}>();

const instanceId = useId();
const collapsedGroupIds = ref<Record<string, boolean>>({});
const copiedTsv = ref(false);

const colCount = computed(() => (props.showQuantityRate ? 5 : 3));

function isExpanded(groupId: string): boolean {
  return !collapsedGroupIds.value[groupId];
}

function toggleGroup(groupId: string) {
  collapsedGroupIds.value = {
    ...collapsedGroupIds.value,
    [groupId]: !collapsedGroupIds.value[groupId],
  };
}

function expandAll() {
  collapsedGroupIds.value = {};
}

function collapseAll() {
  const next: Record<string, boolean> = {};
  for (const group of props.groups) {
    next[group.id] = true;
  }
  collapsedGroupIds.value = next;
}

function groupSubtotal(group: LedgerGroup): number {
  let sum = 0;
  for (const row of group.rows) {
    sum += row.amount;
  }
  return sum;
}

const grandTotal = computed(() => {
  let sum = 0;
  for (const group of props.groups) {
    sum += groupSubtotal(group);
  }
  return sum;
});

const totalItemCount = computed(() => {
  let count = 0;
  for (const group of props.groups) {
    count += group.rows.length;
  }
  return count;
});

function formatValue(val: number): string {
  const sign = val < 0 ? "-" : "";
  const formatted = Math.abs(val).toLocaleString("en-US", {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals,
  });
  return `${sign}${props.valuePrefix}${formatted}${props.valueSuffix}`;
}

function formatQuantity(row: LedgerLineItem): string {
  if (row.quantity === undefined) return "—";
  const num = Number.isInteger(row.quantity)
    ? row.quantity.toLocaleString("en-US")
    : row.quantity.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return row.unit ? `${num} ${row.unit}` : num;
}

function escapeCsvCell(raw: string): string {
  if (/[",\r\n]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

function sanitizeTsvCell(raw: string): string {
  return raw.replace(/[\t\r\n]+/g, " ").trim();
}

function buildDelimitedContent(format: "csv" | "tsv"): string {
  const headers = props.showQuantityRate
    ? ["Group Code", "Group", "Item Code", "Line Item", "Quantity", "Unit", "Rate", "Amount"]
    : ["Group Code", "Group", "Item Code", "Line Item", "Amount"];

  const matrix: string[][] = [headers];

  for (const group of props.groups) {
    for (const row of group.rows) {
      if (props.showQuantityRate) {
        matrix.push([
          group.code ?? "",
          group.label,
          row.code ?? "",
          row.label,
          row.quantity !== undefined ? String(row.quantity) : "",
          row.unit ?? "",
          row.rate !== undefined ? row.rate.toFixed(props.decimals) : "",
          row.amount.toFixed(props.decimals),
        ]);
      } else {
        matrix.push([
          group.code ?? "",
          group.label,
          row.code ?? "",
          row.label,
          row.amount.toFixed(props.decimals),
        ]);
      }
    }

    const sub = groupSubtotal(group).toFixed(props.decimals);
    if (props.showQuantityRate) {
      matrix.push([group.code ?? "", `${group.label} Subtotal`, "", "", "", "", "", sub]);
    } else {
      matrix.push([group.code ?? "", `${group.label} Subtotal`, "", "", sub]);
    }
  }

  const grand = grandTotal.value.toFixed(props.decimals);
  if (props.showQuantityRate) {
    matrix.push(["", "Grand Total", "", "", "", "", "", grand]);
  } else {
    matrix.push(["", "Grand Total", "", "", grand]);
  }

  if (format === "csv") {
    return matrix.map((line) => line.map(escapeCsvCell).join(",")).join("\n");
  }
  return matrix.map((line) => line.map(sanitizeTsvCell).join("\t")).join("\n");
}

function handleExport(format: "csv" | "tsv") {
  const content = buildDelimitedContent(format);
  if (format === "tsv") {
    if (globalThis.navigator?.clipboard?.writeText) {
      globalThis.navigator.clipboard.writeText(content).catch(() => {});
    }
    copiedTsv.value = true;
    setTimeout(() => {
      copiedTsv.value = false;
    }, 1800);
  }
  emit("export", { format, content });
}

function groupBodyId(groupId: string): string {
  return `tux-ledger-${instanceId}-${groupId}`;
}
</script>

<template>
  <div class="tux-ledger-table">
    <div class="tux-ledger-table__toolbar">
      <div class="tux-ledger-table__toolbar-group" role="group" aria-label="Row expansion controls">
        <button
          type="button"
          class="tux-ledger-table__btn"
          @click="expandAll"
        >
          Expand All
        </button>
        <button
          type="button"
          class="tux-ledger-table__btn"
          @click="collapseAll"
        >
          Collapse All
        </button>
        <span class="tux-ledger-table__meta">
          {{ groups.length }} {{ groups.length === 1 ? "category" : "categories" }} ·
          {{ totalItemCount }} {{ totalItemCount === 1 ? "line item" : "line items" }}
        </span>
      </div>

      <div
        v-if="exportable"
        class="tux-ledger-table__toolbar-group"
        role="group"
        aria-label="Structured export controls"
      >
        <button
          type="button"
          class="tux-ledger-table__btn"
          @click="handleExport('tsv')"
        >
          {{ copiedTsv ? "Copied TSV" : "Copy TSV" }}
        </button>
        <button
          type="button"
          class="tux-ledger-table__btn tux-ledger-table__btn--primary"
          @click="handleExport('csv')"
        >
          Export CSV
        </button>
      </div>
    </div>

    <div class="tux-ledger-table__scroll">
      <table class="tux-ledger-table__table">
        <caption class="tux-ledger-table__caption">
          {{ caption }}
        </caption>

        <thead>
          <tr>
            <th scope="col" class="tux-ledger-table__th">Line Item</th>
            <th scope="col" class="tux-ledger-table__th tux-ledger-table__th--code">Code</th>
            <template v-if="showQuantityRate">
              <th scope="col" class="tux-ledger-table__th tux-ledger-table__th--num">Quantity</th>
              <th scope="col" class="tux-ledger-table__th tux-ledger-table__th--num">Rate</th>
            </template>
            <th scope="col" class="tux-ledger-table__th tux-ledger-table__th--num">Amount</th>
          </tr>
        </thead>

        <tbody
          v-for="group in groups"
          :id="groupBodyId(group.id)"
          :key="group.id"
          class="tux-ledger-table__tbody"
        >
          <tr class="tux-ledger-table__group-row">
            <td :colspan="colCount" class="tux-ledger-table__group-cell">
              <button
                type="button"
                class="tux-ledger-table__group-toggle"
                :aria-expanded="isExpanded(group.id)"
                :aria-controls="groupBodyId(group.id)"
                @click="toggleGroup(group.id)"
              >
                <span class="tux-ledger-table__group-left">
                  <span
                    class="tux-ledger-table__chevron"
                    :class="{ 'tux-ledger-table__chevron--open': isExpanded(group.id) }"
                    aria-hidden="true"
                  >
                    &#9656;
                  </span>
                  <span v-if="group.code" class="tux-ledger-table__code">
                    {{ group.code }}
                  </span>
                  <span class="tux-ledger-table__group-label">
                    {{ group.label }}
                  </span>
                  <span v-if="group.badge" class="tux-ledger-table__badge">
                    {{ group.badge }}
                  </span>
                  <span class="tux-ledger-table__item-count">
                    ({{ group.rows.length }} {{ group.rows.length === 1 ? "item" : "items" }})
                  </span>
                </span>
                <span class="tux-ledger-table__group-subtotal">
                  {{ formatValue(groupSubtotal(group)) }}
                </span>
              </button>
            </td>
          </tr>

          <template v-if="isExpanded(group.id)">
            <tr
              v-for="row in group.rows"
              :key="row.id"
              class="tux-ledger-table__item-row"
            >
              <th scope="row" class="tux-ledger-table__item-th">
                <span class="tux-ledger-table__item-label">{{ row.label }}</span>
                <span v-if="row.meta" class="tux-ledger-table__item-meta">{{ row.meta }}</span>
              </th>
              <td class="tux-ledger-table__td tux-ledger-table__td--code">
                <span v-if="row.code" class="tux-ledger-table__code">{{ row.code }}</span>
                <span v-else class="tux-ledger-table__muted">—</span>
              </td>
              <template v-if="showQuantityRate">
                <td class="tux-ledger-table__td tux-ledger-table__td--num">
                  {{ formatQuantity(row) }}
                </td>
                <td class="tux-ledger-table__td tux-ledger-table__td--num">
                  {{ row.rate !== undefined ? formatValue(row.rate) : "—" }}
                </td>
              </template>
              <td class="tux-ledger-table__td tux-ledger-table__td--num tux-ledger-table__td--amount">
                {{ formatValue(row.amount) }}
              </td>
            </tr>
          </template>
        </tbody>

        <tfoot>
          <tr class="tux-ledger-table__grand-row">
            <th
              scope="row"
              :colspan="colCount - 1"
              class="tux-ledger-table__grand-th"
            >
              Grand Total
            </th>
            <td class="tux-ledger-table__grand-td">
              {{ formatValue(grandTotal) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<style scoped>
.tux-ledger-table {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  font-family: var(--font-body);
  color: var(--text-primary);
  line-height: 1.5;
}

.tux-ledger-table__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
}

.tux-ledger-table__toolbar-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.tux-ledger-table__meta {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
  padding-left: var(--space-4);
}

.tux-ledger-table__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-12);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.tux-ledger-table__btn:hover {
  border-color: var(--brand-primary);
  background: var(--wash-brand-4);
}

.tux-ledger-table__btn--primary {
  background: var(--brand-fill);
  color: var(--text-on-brand);
  border-color: var(--brand-fill);
}

.tux-ledger-table__btn--primary:hover {
  background: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
}

.tux-ledger-table__btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-ledger-table__scroll {
  overflow-x: auto;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
}

.tux-ledger-table__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.tux-ledger-table__caption {
  caption-side: top;
  text-align: left;
  padding: var(--space-12) var(--space-16);
  font-family: var(--font-bold);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-eggshell);
  border-bottom: 1px solid var(--surface-border);
}

.tux-ledger-table__th {
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

.tux-ledger-table__th--num {
  text-align: right;
}

.tux-ledger-table__group-cell {
  padding: 0;
  background: var(--wash-brand-4);
  border-top: 1px solid var(--surface-border);
  border-bottom: 1px solid var(--surface-border);
}

.tux-ledger-table__group-toggle {
  width: 100%;
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  padding: var(--space-8) var(--space-16);
  background: transparent;
  border: 0;
  color: var(--text-primary);
  font-family: var(--font-body);
  text-align: left;
  cursor: pointer;
}

.tux-ledger-table__group-toggle:hover {
  background: var(--wash-brand-8);
}

.tux-ledger-table__group-toggle:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 3px var(--brand-primary);
}

.tux-ledger-table__group-left {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.tux-ledger-table__chevron {
  display: inline-block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: transform 0.15s ease;
}

.tux-ledger-table__chevron--open {
  transform: rotate(90deg);
}

.tux-ledger-table__group-label {
  font-family: var(--font-bold);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-ledger-table__badge {
  display: inline-block;
  padding: 1px var(--space-8);
  border-radius: var(--radius-full);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.tux-ledger-table__item-count {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.tux-ledger-table__group-subtotal {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
  white-space: nowrap;
}

.tux-ledger-table__item-row {
  border-bottom: 1px solid var(--surface-border-subtle);
}

.tux-ledger-table__item-row:hover {
  background: var(--surface-eggshell);
}

.tux-ledger-table__item-th {
  padding: var(--space-12) var(--space-16) var(--space-12) var(--space-24);
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
}

.tux-ledger-table__item-label {
  display: block;
}

.tux-ledger-table__item-meta {
  display: block;
  margin-top: 2px;
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-secondary);
}

.tux-ledger-table__td {
  padding: var(--space-12) var(--space-16);
  color: var(--text-primary);
  vertical-align: middle;
}

.tux-ledger-table__td--code {
  white-space: nowrap;
}

.tux-ledger-table__code {
  display: inline-block;
  padding: 2px var(--space-8);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
}

.tux-ledger-table__muted {
  color: var(--text-muted);
}

.tux-ledger-table__td--num {
  text-align: right;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.tux-ledger-table__td--amount {
  font-weight: 600;
}

.tux-ledger-table__grand-row {
  background: var(--surface-sunken);
  border-top: 2px solid var(--brand-primary);
}

.tux-ledger-table__grand-th {
  padding: var(--space-12) var(--space-16);
  text-align: left;
  font-family: var(--font-bold);
  font-size: 0.9375rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--text-primary);
}

.tux-ledger-table__grand-td {
  padding: var(--space-12) var(--space-16);
  text-align: right;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .tux-ledger-table__btn,
  .tux-ledger-table__chevron {
    transition: none;
  }
}
</style>
