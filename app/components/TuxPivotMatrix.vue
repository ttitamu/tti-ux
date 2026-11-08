<script setup lang="ts">
/**
 * TuxPivotMatrix — two-axis cross-tabulation and aggregation matrix
 * with row/column marginals, grand total, WCAG AAA wash shading, and
 * interactive cell selection.
 */
import { computed, ref } from "vue";

export interface PivotCellSelection {
  rowIndex: number;
  colIndex: number;
  rowLabel: string;
  colLabel: string;
  value: number;
}

interface Props {
  /** Accessible table caption describing the cross-tabulation. */
  caption: string;
  /** Row category labels (y-axis). */
  rowLabels: string[];
  /** Column category labels (x-axis). */
  colLabels: string[];
  /** Numeric cell matrix indexed as values[rowIndex][colIndex]. */
  values: number[][];
  /** Header label for the leading row-category column. */
  rowHeaderLabel?: string;
  /** Prefix prepended to formatted cell and marginal numbers. */
  valuePrefix?: string;
  /** Suffix appended to formatted cell and marginal numbers. */
  valueSuffix?: string;
  /** Fixed decimal places for cell and marginal values. */
  decimals?: number;
  /** Apply subtle magnitude wash tints to interior cells. */
  shaded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  rowHeaderLabel: "Category",
  valuePrefix: "",
  valueSuffix: "",
  decimals: 0,
  shaded: true,
});

const emit = defineEmits<{
  selectCell: [
    payload: {
      rowIndex: number;
      colIndex: number;
      rowLabel: string;
      colLabel: string;
      value: number;
    },
  ];
}>();

const selectedCoords = ref<{ rowIndex: number; colIndex: number } | null>(null);

function cellValue(rIdx: number, cIdx: number): number {
  const raw = props.values[rIdx]?.[cIdx];
  return typeof raw === "number" && Number.isFinite(raw) ? raw : 0;
}

const rowSums = computed<number[]>(() =>
  props.rowLabels.map((_, rIdx) => {
    let sum = 0;
    for (let cIdx = 0; cIdx < props.colLabels.length; cIdx++) {
      sum += cellValue(rIdx, cIdx);
    }
    return sum;
  }),
);

const colSums = computed<number[]>(() =>
  props.colLabels.map((_, cIdx) => {
    let sum = 0;
    for (let rIdx = 0; rIdx < props.rowLabels.length; rIdx++) {
      sum += cellValue(rIdx, cIdx);
    }
    return sum;
  }),
);

const grandTotal = computed<number>(() => {
  let sum = 0;
  for (const rSum of rowSums.value) {
    sum += rSum;
  }
  return sum;
});

const valueRange = computed<{ min: number; max: number }>(() => {
  let min = Infinity;
  let max = -Infinity;
  for (let rIdx = 0; rIdx < props.rowLabels.length; rIdx++) {
    for (let cIdx = 0; cIdx < props.colLabels.length; cIdx++) {
      const v = cellValue(rIdx, cIdx);
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: 0, max: 0 };
  }
  return { min, max };
});

function shadeTier(rIdx: number, cIdx: number): number {
  if (!props.shaded) return 0;
  const { min, max } = valueRange.value;
  if (max <= min) return 0;
  const val = cellValue(rIdx, cIdx);
  const ratio = (val - min) / (max - min);
  if (ratio <= 0) return 0;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.55) return 2;
  if (ratio <= 0.85) return 3;
  return 4;
}

function formatNumber(val: number): string {
  const sign = val < 0 ? "-" : "";
  const formatted = Math.abs(val).toLocaleString("en-US", {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals,
  });
  return `${sign}${props.valuePrefix}${formatted}${props.valueSuffix}`;
}

function isSelected(rIdx: number, cIdx: number): boolean {
  return (
    selectedCoords.value?.rowIndex === rIdx &&
    selectedCoords.value?.colIndex === cIdx
  );
}

function onCellClick(rIdx: number, cIdx: number) {
  selectedCoords.value = { rowIndex: rIdx, colIndex: cIdx };
  emit("selectCell", {
    rowIndex: rIdx,
    colIndex: cIdx,
    rowLabel: props.rowLabels[rIdx] ?? "",
    colLabel: props.colLabels[cIdx] ?? "",
    value: cellValue(rIdx, cIdx),
  });
}
</script>

<template>
  <div class="tux-pivot-matrix">
    <div
      class="tux-pivot-matrix__scroll"
      tabindex="0"
      role="region"
      :aria-label="caption"
    >
      <table class="tux-pivot-matrix__table">
        <caption class="tux-pivot-matrix__caption">
          {{ caption }}
        </caption>

        <thead>
          <tr>
            <th scope="col" class="tux-pivot-matrix__th tux-pivot-matrix__th--corner">
              {{ rowHeaderLabel }}
            </th>
            <th
              v-for="(colLabel, cIdx) in colLabels"
              :key="`col-${cIdx}-${colLabel}`"
              scope="col"
              class="tux-pivot-matrix__th tux-pivot-matrix__th--num"
            >
              {{ colLabel }}
            </th>
            <th scope="col" class="tux-pivot-matrix__th tux-pivot-matrix__th--num tux-pivot-matrix__th--marginal">
              Row Total
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(rowLabel, rIdx) in rowLabels"
            :key="`row-${rIdx}-${rowLabel}`"
            class="tux-pivot-matrix__row"
          >
            <th scope="row" class="tux-pivot-matrix__row-th">
              {{ rowLabel }}
            </th>

            <td
              v-for="(colLabel, cIdx) in colLabels"
              :key="`cell-${rIdx}-${cIdx}`"
              class="tux-pivot-matrix__cell"
              :class="`tux-pivot-matrix__cell--tier-${shadeTier(rIdx, cIdx)}`"
            >
              <button
                type="button"
                class="tux-pivot-matrix__cell-btn"
                :class="{ 'tux-pivot-matrix__cell-btn--selected': isSelected(rIdx, cIdx) }"
                :aria-pressed="isSelected(rIdx, cIdx)"
                :aria-label="`${rowLabel}, ${colLabel}: ${formatNumber(cellValue(rIdx, cIdx))}`"
                @click="onCellClick(rIdx, cIdx)"
              >
                {{ formatNumber(cellValue(rIdx, cIdx)) }}
              </button>
            </td>

            <td class="tux-pivot-matrix__marginal-td">
              {{ formatNumber(rowSums[rIdx] ?? 0) }}
            </td>
          </tr>
        </tbody>

        <tfoot>
          <tr class="tux-pivot-matrix__foot-row">
            <th scope="row" class="tux-pivot-matrix__foot-th">
              Column Total
            </th>
            <td
              v-for="(colSum, cIdx) in colSums"
              :key="`colsum-${cIdx}`"
              class="tux-pivot-matrix__foot-td"
            >
              {{ formatNumber(colSum) }}
            </td>
            <td class="tux-pivot-matrix__grand-td">
              {{ formatNumber(grandTotal) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<style scoped>
.tux-pivot-matrix {
  container-type: inline-size;
  font-family: var(--font-body);
  color: var(--text-primary);
  line-height: 1.5;
}

.tux-pivot-matrix__scroll {
  overflow-x: auto;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
}

.tux-pivot-matrix__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.tux-pivot-matrix__caption {
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

.tux-pivot-matrix__th {
  padding: var(--space-12) var(--space-12);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-secondary);
  background: var(--surface-sunken);
  border-bottom: 2px solid var(--surface-border);
  white-space: nowrap;
}

.tux-pivot-matrix__th--corner {
  text-align: left;
  padding-left: var(--space-16);
}

.tux-pivot-matrix__th--num {
  text-align: right;
}

.tux-pivot-matrix__th--marginal {
  border-left: 2px solid var(--surface-border);
  color: var(--text-primary);
}

.tux-pivot-matrix__row {
  border-bottom: 1px solid var(--surface-border-subtle);
}

.tux-pivot-matrix__row-th {
  padding: var(--space-8) var(--space-16);
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--surface-raised);
  border-right: 1px solid var(--surface-border);
  white-space: nowrap;
}

.tux-pivot-matrix__cell {
  padding: 2px;
  border-right: 1px solid var(--surface-border-subtle);
  transition: background-color 0.15s ease;
}

/* Subtle wash ramp preserving >= 7.0:1 AAA text contrast across light & dark themes */
.tux-pivot-matrix__cell--tier-0 {
  background: transparent;
}

.tux-pivot-matrix__cell--tier-1 {
  background: var(--surface-eggshell);
}

.tux-pivot-matrix__cell--tier-2 {
  background: var(--wash-brand-4);
}

.tux-pivot-matrix__cell--tier-3 {
  background: var(--wash-brand-8);
}

.tux-pivot-matrix__cell--tier-4 {
  background: var(--wash-brand-12);
}

.tux-pivot-matrix__cell-btn {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-12);
  background: transparent;
  border: 2px solid transparent;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.tux-pivot-matrix__cell--tier-4 .tux-pivot-matrix__cell-btn {
  font-weight: 700;
  box-shadow: inset 0 -2px 0 var(--brand-primary);
}

.tux-pivot-matrix__cell-btn:hover {
  border-color: var(--brand-primary);
}

.tux-pivot-matrix__cell-btn--selected {
  border-color: var(--brand-primary);
  font-weight: 700;
}

.tux-pivot-matrix__cell-btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-pivot-matrix__marginal-td {
  padding: var(--space-8) var(--space-16);
  text-align: right;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border-left: 2px solid var(--surface-border);
  white-space: nowrap;
}

.tux-pivot-matrix__foot-row {
  background: var(--surface-sunken);
  border-top: 2px solid var(--brand-primary);
}

.tux-pivot-matrix__foot-th {
  padding: var(--space-12) var(--space-16);
  text-align: left;
  font-family: var(--font-bold);
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--text-primary);
  border-right: 1px solid var(--surface-border);
}

.tux-pivot-matrix__foot-td {
  padding: var(--space-12) var(--space-12);
  text-align: right;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
  white-space: nowrap;
}

.tux-pivot-matrix__grand-td {
  padding: var(--space-12) var(--space-16);
  text-align: right;
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
  background: var(--wash-brand-8);
  border-left: 2px solid var(--surface-border);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .tux-pivot-matrix__cell,
  .tux-pivot-matrix__cell-btn {
    transition: none;
  }
}
</style>
