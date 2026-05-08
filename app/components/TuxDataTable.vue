<script setup lang="ts">
/**
 * TuxDataTable — research-flavored table for finished deliverables
 * (papers, reports, appendices). The reader is parsing exact
 * numbers under a numbered caption, not interacting with rows;
 * for that, use `TuxRichDataGrid`.
 *
 * Anatomy adapted from research-publishing conventions:
 *   - numbered caption (`Table 4-2`) over a display-face title
 *     and an optional descriptive lede
 *   - tabular-figure body cells with right-aligned numerics
 *   - uncertainty cells rendered as `value ± CI` (auto-format
 *     when a column is `.numeric` and has a `ciKey`)
 *   - footnote anchors that link to a formal note block under
 *     the table
 *   - row groups banded by category (when `groups` is set)
 *   - optional sticky header w/ max-height for appendix-density
 *   - optional totals row for column sums / grand-mean rows
 *   - source citation line at the bottom — so the table can be
 *     lifted directly into a report PDF
 *
 * Sort is host-driven: pass `sortKey` + `sortDir` and listen to
 * `update:sortKey` / `update:sortDir`. The component renders the
 * sort affordance and emits; the host re-orders `rows`. This
 * matches the rest of the catalog (charts, grid, comments).
 *
 * For the lightweight, non-research flavor (mono-cell, hover
 * tint, no caption) use `TuxTable`. For a TTI-flavored chart
 * frame, use `TuxChartFrame`.
 *
 * Slots:
 *   - `cell-<key>` — custom cell rendering for column `<key>`,
 *                    receives `{ row, value, col }`
 *   - `caption-aside` — right-aligned caption companion (e.g.
 *                       a download link, table-of-contents anchor)
 *   - `note` — additional editorial note above the footnote block
 */

interface Column {
  key: string;
  label: string;
  /** Width: `120px`, `12rem`, etc. Optional. */
  width?: string;
  align?: "left" | "right" | "center";
  /** Numeric columns get tabular-nums + right-align by default. */
  numeric?: boolean;
  /** When set, header is a sort button (host owns ordering). */
  sortable?: boolean;
  /** Number of decimals when auto-formatting numeric values. */
  decimals?: number;
  /** Unit suffix (e.g. "%", " mph") rendered after the number. */
  unit?: string;
  /** When set, the cell renders `<value> ± <ciKey value>`. */
  ciKey?: string;
  /**
   * Footnote-anchor key — when the row has a truthy
   * `<footnoteKey>` field, a numbered superscript appears next
   * to the cell value (linking to `#fn-<n>`).
   */
  footnoteKey?: string;
  /** Render integers with `toLocaleString()`. Default true for numeric ints. */
  thousandsSep?: boolean;
}

interface Footnote {
  /** Anchor id (matches the `n` superscript). */
  n: number;
  text: string;
}

interface RowGroup {
  /** Group label (e.g. "North", "Coast"). */
  label: string;
  /** Rows in this group. */
  rows: Record<string, unknown>[];
}

interface TotalsRow {
  /** Label rendered in the first column. */
  label: string;
  /** Map of column key → cell value (string or number). Override default. */
  values: Record<string, unknown>;
}

interface Props {
  columns: Column[];
  /** Use `rows` for a flat table; use `groups` for category-banded. */
  rows?: Record<string, unknown>[];
  groups?: RowGroup[];
  rowKey?: string;

  /** Caption: e.g. "Table 4-2". */
  tableNumber?: string;
  /** Display-face title rendered under the table number. */
  caption?: string;
  /** Lede paragraph under the caption. */
  description?: string;

  /** Sort state (host-driven via v-model:sortKey + v-model:sortDir). */
  sortKey?: string;
  sortDir?: "asc" | "desc";

  /** When true, header sticks during scroll w/ `max-height`. */
  sticky?: boolean;
  /** Max body height when `sticky`. Default `20rem`. */
  maxHeight?: string;

  /** When `comfortable` (default), 0.625rem cell padding. `compact` 0.4375rem. */
  density?: "comfortable" | "compact";
  /** Stripe alternating rows for legibility. Default true. */
  banded?: boolean;

  /** Footnotes block under the table. */
  footnotes?: Footnote[];
  /** Source / citation line below footnotes. */
  source?: string;

  /** Optional totals row (rendered with maroon top-rule). */
  totals?: TotalsRow;
}

const props = withDefaults(defineProps<Props>(), {
  rows: () => [],
  groups: () => [],
  rowKey: "id",
  tableNumber: "",
  caption: "",
  description: "",
  sticky: false,
  maxHeight: "20rem",
  density: "comfortable",
  banded: true,
  footnotes: () => [],
  source: "",
  totals: undefined,
});

const emit = defineEmits<{
  "update:sortKey": [key: string];
  "update:sortDir": [dir: "asc" | "desc"];
}>();

const isGrouped = computed(() => props.groups && props.groups.length > 0);

function alignOf(col: Column): "left" | "right" | "center" {
  if (col.align) return col.align;
  return col.numeric ? "right" : "left";
}
function isNumericCol(col: Column): boolean {
  return !!col.numeric || col.align === "right";
}

function formatValue(row: Record<string, unknown>, col: Column): string {
  const raw = row[col.key];
  if (raw == null) return "";
  if (typeof raw === "number") {
    const decimals = col.decimals;
    let out: string;
    if (decimals != null) {
      out = raw.toFixed(decimals);
    } else if (Number.isInteger(raw) && col.thousandsSep !== false) {
      out = raw.toLocaleString();
    } else {
      out = String(raw);
    }
    return col.unit ? `${out}${col.unit}` : out;
  }
  return String(raw);
}

function ciValue(row: Record<string, unknown>, col: Column): string {
  if (!col.ciKey) return "";
  const raw = row[col.ciKey];
  if (raw == null) return "";
  if (typeof raw === "number") {
    return col.decimals != null ? raw.toFixed(col.decimals) : String(raw);
  }
  return String(raw);
}

function footnoteN(row: Record<string, unknown>, col: Column): number | null {
  if (!col.footnoteKey) return null;
  const v = row[col.footnoteKey];
  return typeof v === "number" ? v : null;
}

function onSort(col: Column) {
  if (!col.sortable) return;
  if (props.sortKey === col.key) {
    emit("update:sortDir", props.sortDir === "asc" ? "desc" : "asc");
  } else {
    emit("update:sortKey", col.key);
    emit("update:sortDir", col.numeric ? "desc" : "asc");
  }
}

function ariaSort(col: Column): "ascending" | "descending" | "none" | undefined {
  if (!col.sortable) return undefined;
  if (props.sortKey !== col.key) return "none";
  return props.sortDir === "asc" ? "ascending" : "descending";
}
</script>

<template>
  <figure
    class="tux-data-table"
    :class="[
      `tux-data-table--${density}`,
      banded && 'tux-data-table--banded',
      sticky && 'tux-data-table--sticky',
    ]"
  >
    <figcaption v-if="tableNumber || caption || description" class="tux-data-table__caption">
      <div class="tux-data-table__caption-main">
        <div v-if="tableNumber" class="tux-data-table__table-number">{{ tableNumber }}</div>
        <div v-if="caption" class="tux-data-table__title">{{ caption }}</div>
        <div v-if="description" class="tux-data-table__description">{{ description }}</div>
      </div>
      <div v-if="$slots['caption-aside']" class="tux-data-table__caption-aside">
        <slot name="caption-aside" />
      </div>
    </figcaption>

    <div
      class="tux-data-table__scroll"
      :style="sticky ? { maxHeight } : undefined"
    >
      <table class="tux-data-table__table">
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              scope="col"
              :class="[
                'tux-data-table__th',
                `tux-data-table__th--${alignOf(col)}`,
                col.sortable && 'tux-data-table__th--sortable',
              ]"
              :style="col.width ? { width: col.width } : undefined"
              :aria-sort="ariaSort(col)"
            >
              <button
                v-if="col.sortable"
                type="button"
                class="tux-data-table__sort-btn"
                :data-active="sortKey === col.key"
                @click="onSort(col)"
              >
                <span>{{ col.label }}</span>
                <span class="tux-data-table__sort-arrows" aria-hidden="true">
                  <span
                    class="tux-data-table__sort-arrow"
                    :data-direction="sortKey === col.key && sortDir === 'asc' ? 'active' : ''"
                  >▲</span>
                  <span
                    class="tux-data-table__sort-arrow"
                    :data-direction="sortKey === col.key && sortDir === 'desc' ? 'active' : ''"
                  >▼</span>
                </span>
              </button>
              <span v-else class="tux-data-table__th-label">{{ col.label }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Grouped layout -->
          <template v-if="isGrouped">
            <template v-for="group in groups" :key="group.label">
              <tr class="tux-data-table__group-header">
                <th
                  :colspan="columns.length"
                  scope="rowgroup"
                  class="tux-data-table__group-cell"
                >
                  {{ group.label }}
                </th>
              </tr>
              <tr
                v-for="(row, ri) in group.rows"
                :key="`${group.label}-${ri}`"
                class="tux-data-table__row"
              >
                <td
                  v-for="col in columns"
                  :key="col.key"
                  :class="[
                    'tux-data-table__td',
                    `tux-data-table__td--${alignOf(col)}`,
                    isNumericCol(col) && 'tux-data-table__td--num',
                  ]"
                >
                  <slot
                    :name="`cell-${col.key}`"
                    :row="row"
                    :col="col"
                    :value="row[col.key]"
                  >
                    <span class="tux-data-table__cell-value">
                      <template v-if="col.ciKey">
                        <span>{{ formatValue(row, col) }}</span>
                        <span class="tux-data-table__ci">±&nbsp;{{ ciValue(row, col) }}</span>
                      </template>
                      <template v-else>{{ formatValue(row, col) }}</template>
                      <sup v-if="footnoteN(row, col)" class="tux-data-table__fn-anchor">
                        <a :href="`#fn-${footnoteN(row, col)}`">{{ footnoteN(row, col) }}</a>
                      </sup>
                    </span>
                  </slot>
                </td>
              </tr>
            </template>
          </template>

          <!-- Flat layout -->
          <template v-else>
            <tr
              v-for="(row, ri) in rows"
              :key="(row[rowKey] as string | number) ?? ri"
              class="tux-data-table__row"
            >
              <td
                v-for="col in columns"
                :key="col.key"
                :class="[
                  'tux-data-table__td',
                  `tux-data-table__td--${alignOf(col)}`,
                  isNumericCol(col) && 'tux-data-table__td--num',
                ]"
              >
                <slot
                  :name="`cell-${col.key}`"
                  :row="row"
                  :col="col"
                  :value="row[col.key]"
                >
                  <span class="tux-data-table__cell-value">
                    <template v-if="col.ciKey">
                      <span>{{ formatValue(row, col) }}</span>
                      <span class="tux-data-table__ci">±&nbsp;{{ ciValue(row, col) }}</span>
                    </template>
                    <template v-else>{{ formatValue(row, col) }}</template>
                    <sup v-if="footnoteN(row, col)" class="tux-data-table__fn-anchor">
                      <a :href="`#fn-${footnoteN(row, col)}`">{{ footnoteN(row, col) }}</a>
                    </sup>
                  </span>
                </slot>
              </td>
            </tr>
          </template>

          <!-- Totals row -->
          <tr v-if="totals" class="tux-data-table__totals">
            <td
              v-for="(col, ci) in columns"
              :key="col.key"
              :class="[
                'tux-data-table__td',
                `tux-data-table__td--${alignOf(col)}`,
                isNumericCol(col) && 'tux-data-table__td--num',
              ]"
            >
              <template v-if="ci === 0">{{ totals.label }}</template>
              <template v-else>
                <slot
                  :name="`cell-${col.key}`"
                  :row="totals.values"
                  :col="col"
                  :value="totals.values[col.key]"
                  :is-totals="true"
                >
                  <template v-if="col.ciKey">
                    <span>{{ formatValue(totals.values, col) }}</span>
                    <span class="tux-data-table__ci">±&nbsp;{{ ciValue(totals.values, col) }}</span>
                  </template>
                  <template v-else>{{ formatValue(totals.values, col) }}</template>
                </slot>
              </template>
            </td>
          </tr>

          <tr v-if="!isGrouped && !rows.length">
            <td :colspan="columns.length" class="tux-data-table__empty">
              <slot name="empty">No rows.</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="$slots.note" class="tux-data-table__note">
      <slot name="note" />
    </div>

    <div v-if="footnotes.length || source" class="tux-data-table__footer">
      <ol v-if="footnotes.length" class="tux-data-table__footnotes">
        <li
          v-for="fn in footnotes"
          :id="`fn-${fn.n}`"
          :key="fn.n"
          class="tux-data-table__footnote"
        >
          <span class="tux-data-table__footnote-marker">{{ fn.n }}</span>
          {{ fn.text }}
        </li>
      </ol>
      <div v-if="source" class="tux-data-table__source">{{ source }}</div>
    </div>
  </figure>
</template>

<style scoped>
.tux-data-table {
  margin: 0;
  font-family: var(--font-body);
  color: var(--text-secondary);
  container-type: inline-size;
  container-name: tux-data-table;
}

/* ── Caption ─────────────────────────────────────────────────── */
.tux-data-table__caption {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}
.tux-data-table__caption-main { flex: 1; min-width: 0; }
.tux-data-table__table-number {
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.11em;
  color: var(--text-muted);
  font-family: var(--font-bold);
}
.tux-data-table__title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-top: 0.25rem;
  line-height: 1.3;
}
.tux-data-table__description {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.375rem;
  max-width: 45rem;
  line-height: 1.6;
}
.tux-data-table__caption-aside {
  flex-shrink: 0;
  font-size: 0.78rem;
  color: var(--text-muted);
}

/* ── Table shell ─────────────────────────────────────────────── */
.tux-data-table__scroll {
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  overflow-x: auto;
  background: var(--surface-page);
}
.tux-data-table--sticky .tux-data-table__scroll {
  overflow-y: auto;
}
.tux-data-table__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 32rem;
}

/* ── Header ──────────────────────────────────────────────────── */
.tux-data-table__th {
  padding: 0.625rem 0.75rem;
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  font-family: var(--font-bold);
  background: var(--surface-sunken);
  border-bottom: 2px solid var(--surface-border);
  text-align: left;
  vertical-align: bottom;
  white-space: nowrap;
}
.tux-data-table__th--right { text-align: right; }
.tux-data-table__th--center { text-align: center; }

.tux-data-table--sticky thead {
  position: sticky;
  top: 0;
  z-index: 1;
}

.tux-data-table__th-label,
.tux-data-table__sort-btn {
  font: inherit;
  color: inherit;
  background: transparent;
  border: none;
  padding: 0;
}
.tux-data-table__sort-btn {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  user-select: none;
}
.tux-data-table__sort-btn[data-active="true"] {
  color: var(--brand-primary);
}
.tux-data-table__sort-btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
  border-radius: 2px;
}
.tux-data-table__sort-arrows {
  display: inline-flex;
  flex-direction: column;
  line-height: 0.6;
  font-size: 0.5rem;
  opacity: 0.4;
}
.tux-data-table__sort-btn[data-active="true"] .tux-data-table__sort-arrows {
  opacity: 1;
}
.tux-data-table__sort-arrow {
  color: currentColor;
}
.tux-data-table__sort-arrow[data-direction="active"] {
  color: var(--brand-primary);
}

/* ── Body ────────────────────────────────────────────────────── */
.tux-data-table__td {
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid var(--surface-border);
  font-size: 0.86rem;
  color: var(--text-primary);
  vertical-align: top;
}
.tux-data-table__td--right { text-align: right; }
.tux-data-table__td--center { text-align: center; }
.tux-data-table__td--num {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.tux-data-table--compact .tux-data-table__td,
.tux-data-table--compact .tux-data-table__th {
  padding-top: 0.4375rem;
  padding-bottom: 0.4375rem;
}

.tux-data-table--banded .tux-data-table__row:nth-child(odd) .tux-data-table__td {
  background: color-mix(in srgb, var(--surface-sunken) 35%, transparent);
}

/* Group banding */
.tux-data-table__group-cell {
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--brand-primary);
  font-family: var(--font-bold);
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
  border-bottom: 1px solid var(--surface-border);
}

/* Uncertainty + footnote anchor */
.tux-data-table__cell-value {
  display: inline-flex;
  align-items: baseline;
  gap: 0.25rem;
}
.tux-data-table__ci {
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 400;
}
.tux-data-table__fn-anchor {
  margin-left: 0.125rem;
}
.tux-data-table__fn-anchor a {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  color: var(--brand-primary);
  text-decoration: none;
}
.tux-data-table__fn-anchor a:hover {
  text-decoration: underline;
}
.tux-data-table__fn-anchor a:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
  border-radius: 2px;
}

/* Totals row */
.tux-data-table__totals .tux-data-table__td {
  background: color-mix(in srgb, var(--brand-primary) 6%, transparent);
  font-weight: 700;
  color: var(--text-primary);
  border-top: 2px solid var(--brand-primary);
  border-bottom: none;
}
.tux-data-table--banded .tux-data-table__totals .tux-data-table__td {
  background: color-mix(in srgb, var(--brand-primary) 6%, transparent);
}

.tux-data-table__empty {
  padding: 1.75rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.86rem;
}

/* ── Note + footer ───────────────────────────────────────────── */
.tux-data-table__note {
  margin-top: 0.75rem;
  padding: 0.625rem 0.875rem;
  background: var(--surface-sunken);
  border-radius: 3px;
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.tux-data-table__footer {
  margin-top: 0.875rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--surface-border);
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.6;
}
.tux-data-table__footnotes {
  list-style: none;
  margin: 0;
  padding: 0;
}
.tux-data-table__footnote {
  margin-bottom: 0.25rem;
}
.tux-data-table__footnote-marker {
  display: inline-block;
  vertical-align: super;
  color: var(--brand-primary);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  margin-right: 0.375rem;
  font-weight: 600;
}
.tux-data-table__source {
  margin-top: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
}

/* ── Container-query collapse for narrow widths ──────────────── */
@container tux-data-table (max-width: 28rem) {
  .tux-data-table__caption {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .tux-data-table__title {
    font-size: 1rem;
  }
}
</style>
