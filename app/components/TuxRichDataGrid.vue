<script setup lang="ts">
/**
 * TuxRichDataGrid — interactive data grid for operational and
 * research-dashboard surfaces (PECAN-class apps where the reader
 * needs to *act* on rows, not just read them).
 *
 * Anatomy adapted from Ant Design Table and Microsoft Fabric
 * Rich-data-grid; identity stays TUX (Work Sans / JetBrains Mono,
 * maroon focus ring, warm-neutral surfaces, tabular figures
 * throughout). No chrome borrowed — anatomy only.
 *
 * Capabilities:
 *   - Toolbar: title + meta + search + filter / columns / export
 *   - Active-filter chip strip (each chip removable; clear-all)
 *   - Bulk-action bar (visible only when ≥1 row selected)
 *   - Sticky column header that survives vertical scroll
 *   - Sortable columns w/ direction indicator (host-driven)
 *   - Row selection (header indeterminate when partial)
 *   - Expandable rows (per-row chevron + inline detail panel)
 *   - Footer pagination strip (host emits `page` events)
 *
 * State is **host-driven** — every interactive concern (selection,
 * expansion, sort, filters, pagination) is a v-model or event so
 * consumers wire the grid to whatever store / fetcher they use.
 * The component renders; it doesn't own the data.
 *
 * For static editorial tables (research-deliverable, prints clean,
 * no row interactions) use `TuxDataTable`. For the thin UTable
 * wrap with maroon header use `TuxTable`.
 *
 * Slots:
 *   - `cell-<key>` — custom cell rendering for column `<key>`
 *   - `expanded` — expanded-row detail body, gets `{ row }`
 *   - `bulk-actions` — replace the default Export / Archive /
 *                      Reassign trio with custom buttons
 */

interface Column {
  /** Accessor key into a row; matches the `cell-<key>` slot name. */
  key: string;
  label: string;
  /** CSS width — `120px`, `12rem`, `auto`. Optional. */
  width?: string;
  align?: "left" | "right" | "center";
  /** When true, header is a sort button. */
  sortable?: boolean;
  /** Numeric columns get tabular-nums + right-align by default. */
  numeric?: boolean;
}

interface FilterChip {
  /** Field label, e.g. "District". */
  label: string;
  /** Active value, e.g. "Houston, Austin, San Antonio". */
  value: string;
}

interface BulkAction {
  /** Stable identifier passed back via `bulk-action` event. */
  key: string;
  label: string;
  /** Lucide icon name, e.g. `lucide:download`. Optional. */
  icon?: string;
}

interface PaginationToken {
  /** Display label — number or '…' or '‹' / '›'. */
  label: string;
  /** Stable id; emit `page` with this when clicked. */
  value: string | number;
  /** Whether this token is the current page. */
  current?: boolean;
  /** Disabled (e.g. ‹ when on page 1). */
  disabled?: boolean;
}

interface Props {
  columns: Column[];
  rows: Record<string, unknown>[];
  /** Accessor for the row's stable id. Default `"id"`. */
  rowKey?: string;

  // Toolbar
  title?: string;
  /** Secondary line under the title — count, last-sync, scope. */
  meta?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showFilter?: boolean;
  showColumns?: boolean;
  showExport?: boolean;

  // Filter chip strip
  filters?: FilterChip[];

  // Selection (host-driven via v-model:selected)
  selected?: (string | number)[];
  /** When true, every row's checkbox is hidden. */
  selectionDisabled?: boolean;
  bulkActions?: BulkAction[];

  // Expansion (host-driven via v-model:expanded)
  expanded?: (string | number)[];
  /** When true, every row's chevron is hidden. */
  expansionDisabled?: boolean;

  // Sort (host-driven via v-model:sortKey + v-model:sortDir)
  sortKey?: string;
  sortDir?: "asc" | "desc";

  // Layout
  /** Max viewport height for the scrollable body. Default 440px. */
  maxHeight?: string;
  density?: "comfortable" | "compact";

  // Pagination (host renders meta; component renders strip)
  paginationLabel?: string;
  paginationTokens?: PaginationToken[];
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: "id",
  searchPlaceholder: "Search…",
  showSearch: true,
  showFilter: true,
  showColumns: true,
  showExport: true,
  filters: () => [],
  selected: () => [],
  selectionDisabled: false,
  expanded: () => [],
  expansionDisabled: false,
  bulkActions: () => [
    { key: "export", label: "Export CSV", icon: "lucide:download" },
    { key: "archive", label: "Archive", icon: "lucide:archive" },
    { key: "reassign", label: "Reassign", icon: "lucide:user-plus" },
  ],
  maxHeight: "440px",
  density: "comfortable",
  paginationLabel: "",
  paginationTokens: () => [],
});

const emit = defineEmits<{
  "update:selected": [keys: (string | number)[]];
  "update:expanded": [keys: (string | number)[]];
  "update:sortKey": [key: string];
  "update:sortDir": [dir: "asc" | "desc"];
  search: [term: string];
  "filter-remove": [index: number];
  "filter-clear": [];
  "bulk-action": [actionKey: string, rowKeys: (string | number)[]];
  page: [token: string | number];
  toolbar: [actionKey: "filter" | "columns" | "export"];
}>();

const selectedSet = computed(() => new Set(props.selected));
const expandedSet = computed(() => new Set(props.expanded));

const allChecked = computed(
  () => props.rows.length > 0 && selectedSet.value.size === props.rows.length,
);
const someChecked = computed(
  () => selectedSet.value.size > 0 && !allChecked.value,
);

function rowKeyOf(row: Record<string, unknown>): string | number {
  const v = row[props.rowKey];
  return (v as string | number) ?? "";
}

function toggleRow(key: string | number) {
  const next = new Set(selectedSet.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  emit("update:selected", Array.from(next));
}
function toggleAll() {
  if (allChecked.value) emit("update:selected", []);
  else emit("update:selected", props.rows.map(rowKeyOf));
}
function clearSelection() {
  emit("update:selected", []);
}
function toggleExpand(key: string | number) {
  const next = new Set(expandedSet.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  emit("update:expanded", Array.from(next));
}
function onSort(key: string) {
  if (key === props.sortKey) {
    emit("update:sortDir", props.sortDir === "asc" ? "desc" : "asc");
  } else {
    emit("update:sortKey", key);
    emit("update:sortDir", "asc");
  }
}

function isNumericCol(col: Column): boolean {
  return !!col.numeric || col.align === "right";
}
function alignOf(col: Column): "left" | "right" | "center" {
  if (col.align) return col.align;
  return col.numeric ? "right" : "left";
}
function cellValue(row: Record<string, unknown>, col: Column) {
  return row[col.key];
}

const searchTerm = ref("");
function onSearchInput(e: Event) {
  searchTerm.value = (e.target as HTMLInputElement).value;
  emit("search", searchTerm.value);
}
</script>

<template>
  <div
    class="tux-rich-data-grid"
    :class="[`tux-rich-data-grid--${density}`]"
    :aria-busy="false"
  >
    <!-- Toolbar -->
    <div class="tux-rich-data-grid__toolbar">
      <div class="tux-rich-data-grid__title-block">
        <div v-if="title" class="tux-rich-data-grid__title">{{ title }}</div>
        <div v-if="meta" class="tux-rich-data-grid__meta">{{ meta }}</div>
      </div>
      <div class="tux-rich-data-grid__toolbar-spacer" />
      <div v-if="showSearch" class="tux-rich-data-grid__search">
        <UIcon name="lucide:search" class="tux-rich-data-grid__search-icon" />
        <input
          type="search"
          :placeholder="searchPlaceholder"
          :value="searchTerm"
          class="tux-rich-data-grid__search-input"
          @input="onSearchInput"
        >
      </div>
      <button
        v-if="showFilter"
        type="button"
        class="tux-rich-data-grid__tool-btn"
        @click="emit('toolbar', 'filter')"
      >
        <UIcon name="lucide:filter" /> Filter
      </button>
      <button
        v-if="showColumns"
        type="button"
        class="tux-rich-data-grid__tool-btn"
        @click="emit('toolbar', 'columns')"
      >
        <UIcon name="lucide:columns-3" /> Columns
      </button>
      <button
        v-if="showExport"
        type="button"
        class="tux-rich-data-grid__tool-btn"
        @click="emit('toolbar', 'export')"
      >
        <UIcon name="lucide:download" /> Export
      </button>
    </div>

    <!-- Active-filter chip strip -->
    <div
      v-if="filters.length"
      class="tux-rich-data-grid__filter-chips"
    >
      <span class="tux-rich-data-grid__filter-eyebrow">Filters</span>
      <span
        v-for="(chip, i) in filters"
        :key="`${chip.label}-${i}`"
        class="tux-rich-data-grid__filter-chip"
      >
        <span class="tux-rich-data-grid__filter-chip-label">{{ chip.label }}:</span>
        <span class="tux-rich-data-grid__filter-chip-value">{{ chip.value }}</span>
        <button
          type="button"
          :aria-label="`Remove ${chip.label} filter`"
          class="tux-rich-data-grid__filter-chip-remove"
          @click="emit('filter-remove', i)"
        >
          <UIcon name="lucide:x" />
        </button>
      </span>
      <button
        type="button"
        class="tux-rich-data-grid__filter-clear"
        @click="emit('filter-clear')"
      >
        Clear all
      </button>
    </div>

    <!-- Bulk-action bar -->
    <div
      v-if="selectedSet.size > 0 && !selectionDisabled"
      class="tux-rich-data-grid__bulk-bar"
      role="region"
      aria-label="Bulk actions"
    >
      <button
        type="button"
        :aria-label="`Clear selection of ${selectedSet.size} rows`"
        class="tux-rich-data-grid__bulk-clear-cb"
        @click="clearSelection"
      >
        <span class="tux-rich-data-grid__bulk-cb-box" aria-hidden="true">
          <UIcon name="lucide:check" />
        </span>
      </button>
      <span class="tux-rich-data-grid__bulk-count">
        {{ selectedSet.size }} selected
      </span>
      <span class="tux-rich-data-grid__bulk-spacer" />
      <slot name="bulk-actions" :selected="Array.from(selectedSet)">
        <button
          v-for="action in bulkActions"
          :key="action.key"
          type="button"
          class="tux-rich-data-grid__bulk-btn"
          @click="emit('bulk-action', action.key, Array.from(selectedSet))"
        >
          <UIcon v-if="action.icon" :name="action.icon" />
          {{ action.label }}
        </button>
      </slot>
      <button
        type="button"
        aria-label="Clear selection"
        class="tux-rich-data-grid__bulk-btn tux-rich-data-grid__bulk-btn--icon"
        @click="clearSelection"
      >
        <UIcon name="lucide:x" />
      </button>
    </div>

    <!-- Scrollable grid body -->
    <div
      class="tux-rich-data-grid__scroll"
      :style="{ maxHeight }"
    >
      <table class="tux-rich-data-grid__table">
        <thead>
          <tr>
            <th
              v-if="!selectionDisabled"
              scope="col"
              class="tux-rich-data-grid__th tux-rich-data-grid__th--cb"
            >
              <button
                type="button"
                :aria-label="allChecked ? 'Deselect all rows' : 'Select all rows'"
                class="tux-rich-data-grid__cb"
                :data-state="allChecked ? 'checked' : someChecked ? 'mixed' : 'unchecked'"
                @click="toggleAll"
              >
                <span class="tux-rich-data-grid__cb-box" aria-hidden="true">
                  <UIcon v-if="allChecked" name="lucide:check" />
                  <span v-else-if="someChecked" class="tux-rich-data-grid__cb-dash" />
                </span>
              </button>
            </th>
            <th
              v-if="!expansionDisabled"
              scope="col"
              class="tux-rich-data-grid__th tux-rich-data-grid__th--chevron"
              aria-label="Expand row"
            />
            <th
              v-for="(col, ci) in columns"
              :key="col.key"
              scope="col"
              :class="[
                'tux-rich-data-grid__th',
                `tux-rich-data-grid__th--${alignOf(col)}`,
                ci === columns.length - 1 && 'tux-rich-data-grid__th--last',
              ]"
              :style="col.width ? { width: col.width } : undefined"
              :aria-sort="
                col.sortable && sortKey === col.key
                  ? sortDir === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : col.sortable
                    ? 'none'
                    : undefined
              "
            >
              <button
                v-if="col.sortable"
                type="button"
                class="tux-rich-data-grid__sort-btn"
                :data-active="sortKey === col.key"
                @click="onSort(col.key)"
              >
                <span>{{ col.label }}</span>
                <span class="tux-rich-data-grid__sort-arrows" aria-hidden="true">
                  <span
                    class="tux-rich-data-grid__sort-arrow"
                    :data-direction="sortKey === col.key && sortDir === 'asc' ? 'active' : ''"
                  >▲</span>
                  <span
                    class="tux-rich-data-grid__sort-arrow"
                    :data-direction="sortKey === col.key && sortDir === 'desc' ? 'active' : ''"
                  >▼</span>
                </span>
              </button>
              <span v-else class="tux-rich-data-grid__th-label">{{ col.label }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="row in rows" :key="rowKeyOf(row)">
            <tr
              :class="[
                'tux-rich-data-grid__row',
                selectedSet.has(rowKeyOf(row)) && 'tux-rich-data-grid__row--selected',
              ]"
            >
              <td v-if="!selectionDisabled" class="tux-rich-data-grid__td tux-rich-data-grid__td--cb">
                <button
                  type="button"
                  :aria-label="`Select row ${rowKeyOf(row)}`"
                  class="tux-rich-data-grid__cb"
                  :data-state="selectedSet.has(rowKeyOf(row)) ? 'checked' : 'unchecked'"
                  @click="toggleRow(rowKeyOf(row))"
                >
                  <span class="tux-rich-data-grid__cb-box" aria-hidden="true">
                    <UIcon v-if="selectedSet.has(rowKeyOf(row))" name="lucide:check" />
                  </span>
                </button>
              </td>
              <td v-if="!expansionDisabled" class="tux-rich-data-grid__td tux-rich-data-grid__td--chevron">
                <button
                  type="button"
                  :aria-label="expandedSet.has(rowKeyOf(row)) ? 'Collapse row' : 'Expand row'"
                  :aria-expanded="expandedSet.has(rowKeyOf(row))"
                  class="tux-rich-data-grid__chevron"
                  :data-expanded="expandedSet.has(rowKeyOf(row))"
                  @click="toggleExpand(rowKeyOf(row))"
                >
                  <UIcon name="lucide:chevron-right" />
                </button>
              </td>
              <td
                v-for="col in columns"
                :key="col.key"
                :class="[
                  'tux-rich-data-grid__td',
                  `tux-rich-data-grid__td--${alignOf(col)}`,
                  isNumericCol(col) && 'tux-rich-data-grid__td--num',
                ]"
              >
                <slot
                  :name="`cell-${col.key}`"
                  :row="row"
                  :value="cellValue(row, col)"
                  :col="col"
                >
                  {{ cellValue(row, col) }}
                </slot>
              </td>
            </tr>
            <tr
              v-if="expandedSet.has(rowKeyOf(row)) && !expansionDisabled"
              class="tux-rich-data-grid__expanded"
            >
              <td
                :colspan="columns.length + (selectionDisabled ? 0 : 1) + 1"
                class="tux-rich-data-grid__expanded-cell"
              >
                <slot name="expanded" :row="row">
                  <em>No expanded content slot provided.</em>
                </slot>
              </td>
            </tr>
          </template>
          <tr v-if="!rows.length">
            <td
              :colspan="columns.length + (selectionDisabled ? 0 : 1) + (expansionDisabled ? 0 : 1)"
              class="tux-rich-data-grid__empty"
            >
              <slot name="empty">No rows.</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer pagination -->
    <div
      v-if="paginationLabel || paginationTokens.length"
      class="tux-rich-data-grid__footer"
    >
      <span class="tux-rich-data-grid__pagination-label">{{ paginationLabel }}</span>
      <div v-if="paginationTokens.length" class="tux-rich-data-grid__pagination">
        <button
          v-for="token in paginationTokens"
          :key="token.value"
          type="button"
          :class="[
            'tux-rich-data-grid__page-btn',
            token.current && 'tux-rich-data-grid__page-btn--current',
          ]"
          :disabled="token.disabled"
          :aria-current="token.current ? 'page' : undefined"
          @click="emit('page', token.value)"
        >
          {{ token.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tux-rich-data-grid {
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  font-family: var(--font-body);
  color: var(--text-secondary);
  container-type: inline-size;
  container-name: tux-rich-data-grid;
}

/* ── Toolbar ─────────────────────────────────────────────────── */
.tux-rich-data-grid__toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.875rem;
  border-bottom: 1px solid var(--surface-border);
  flex-wrap: wrap;
}
.tux-rich-data-grid__title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: var(--text-primary);
}
.tux-rich-data-grid__meta {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 0.125rem;
  font-family: var(--font-body);
}
.tux-rich-data-grid__toolbar-spacer { flex: 1; min-width: 0; }

.tux-rich-data-grid__search {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3125rem 0.625rem;
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: 3px;
  min-width: 12.5rem;
}
.tux-rich-data-grid__search-icon {
  color: var(--text-muted);
  font-size: 0.75rem;
}
.tux-rich-data-grid__search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 0.78rem;
  color: var(--text-primary);
  min-width: 0;
}
.tux-rich-data-grid__search-input:focus-visible {
  outline: none;
}
.tux-rich-data-grid__search:focus-within {
  box-shadow: var(--shadow-focus);
  border-color: var(--brand-primary);
}

.tux-rich-data-grid__tool-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3125rem 0.6875rem;
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: 3px;
  color: var(--text-primary);
  font-family: var(--font-bold);
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: border-color 120ms, background 120ms;
}
.tux-rich-data-grid__tool-btn:hover {
  border-color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 4%, var(--surface-page));
}
.tux-rich-data-grid__tool-btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

/* ── Filter chips ────────────────────────────────────────────── */
.tux-rich-data-grid__filter-chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  border-bottom: 1px solid var(--surface-border);
  background: var(--surface-raised);
}
.tux-rich-data-grid__filter-eyebrow {
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.11em;
  color: var(--text-muted);
  font-family: var(--font-bold);
  margin-right: 0.25rem;
}
.tux-rich-data-grid__filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.1875rem 0.25rem 0.1875rem 0.625rem;
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
  color: var(--brand-primary);
  font-size: 0.74rem;
  font-family: var(--font-bold);
  font-weight: 600;
  border-radius: 3px;
  border: 1px solid color-mix(in srgb, var(--brand-primary) 22%, transparent);
}
.tux-rich-data-grid__filter-chip-label {
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.65rem;
}
.tux-rich-data-grid__filter-chip-remove {
  background: transparent;
  border: none;
  color: inherit;
  padding: 0 0.25rem;
  cursor: pointer;
  line-height: 0;
  opacity: 0.7;
  display: inline-flex;
  align-items: center;
}
.tux-rich-data-grid__filter-chip-remove :deep(.iconify) {
  font-size: 0.7rem;
}
.tux-rich-data-grid__filter-chip-remove:hover { opacity: 1; }
.tux-rich-data-grid__filter-chip-remove:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
  border-radius: 2px;
}
.tux-rich-data-grid__filter-clear {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-bold);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  cursor: pointer;
  margin-left: 0.25rem;
}
.tux-rich-data-grid__filter-clear:hover { color: var(--brand-primary); }
.tux-rich-data-grid__filter-clear:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
  border-radius: 2px;
}

/* ── Bulk-action bar ─────────────────────────────────────────── */
.tux-rich-data-grid__bulk-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5625rem 0.875rem;
  background: var(--brand-primary);
  color: #fff;
  font-size: 0.82rem;
}
.tux-rich-data-grid__bulk-clear-cb {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
}
.tux-rich-data-grid__bulk-cb-box {
  width: 1rem;
  height: 1rem;
  border-radius: 3px;
  border: 1.5px solid #fff;
  background: rgba(255, 255, 255, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.tux-rich-data-grid__bulk-cb-box :deep(.iconify) {
  font-size: 0.7rem;
  color: #fff;
}
.tux-rich-data-grid__bulk-count {
  font-family: var(--font-bold);
  font-weight: 600;
}
.tux-rich-data-grid__bulk-spacer { flex: 1; }
.tux-rich-data-grid__bulk-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3125rem 0.6875rem;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 3px;
  color: #fff;
  font-family: var(--font-bold);
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: background 120ms;
}
.tux-rich-data-grid__bulk-btn:hover { background: rgba(255, 255, 255, 0.22); }
.tux-rich-data-grid__bulk-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--brand-primary), 0 0 0 4px #fff;
}
.tux-rich-data-grid__bulk-btn--icon {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

/* ── Table scroll body ───────────────────────────────────────── */
.tux-rich-data-grid__scroll {
  overflow: auto;
  position: relative;
}
.tux-rich-data-grid__table {
  width: 100%;
  border-collapse: collapse;
  color: var(--text-secondary);
}

/* Sticky header */
.tux-rich-data-grid__table thead {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--surface-sunken);
}
.tux-rich-data-grid__table thead::after {
  content: "";
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 2px;
  background: var(--surface-border);
}

.tux-rich-data-grid__th {
  padding: 0.625rem 0.875rem;
  text-align: left;
  vertical-align: bottom;
  border-bottom: 2px solid var(--surface-border);
  background: var(--surface-sunken);
  white-space: nowrap;
  position: relative;
}
.tux-rich-data-grid__th--right { text-align: right; }
.tux-rich-data-grid__th--center { text-align: center; }
.tux-rich-data-grid__th--cb {
  width: 2.25rem;
  padding: 0.625rem 0 0.625rem 0.875rem;
}
.tux-rich-data-grid__th--chevron {
  width: 1.75rem;
  padding: 0.625rem 0;
}
.tux-rich-data-grid__th:not(.tux-rich-data-grid__th--last):not(.tux-rich-data-grid__th--cb):not(.tux-rich-data-grid__th--chevron) {
  border-right: 1px solid color-mix(in srgb, var(--surface-border) 40%, transparent);
}

.tux-rich-data-grid__sort-btn,
.tux-rich-data-grid__th-label {
  background: transparent;
  border: none;
  padding: 0;
  font-family: var(--font-bold);
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}
.tux-rich-data-grid__sort-btn {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
}
.tux-rich-data-grid__sort-btn[data-active="true"] {
  color: var(--text-primary);
}
.tux-rich-data-grid__sort-btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
  border-radius: 2px;
}
.tux-rich-data-grid__sort-arrows {
  display: inline-flex;
  flex-direction: column;
  line-height: 0.6;
  opacity: 0.35;
}
.tux-rich-data-grid__sort-btn[data-active="true"] .tux-rich-data-grid__sort-arrows {
  opacity: 1;
}
.tux-rich-data-grid__sort-arrow {
  font-size: 0.56rem;
  color: currentColor;
}
.tux-rich-data-grid__sort-arrow[data-direction="active"] {
  color: var(--brand-primary);
}

/* ── Body cells ──────────────────────────────────────────────── */
.tux-rich-data-grid__row {
  transition: background 100ms;
}
.tux-rich-data-grid__row:hover {
  background: color-mix(in srgb, var(--brand-primary) 3%, transparent);
}
.tux-rich-data-grid__row--selected,
.tux-rich-data-grid__row--selected:hover {
  background: color-mix(in srgb, var(--brand-primary) 5%, transparent);
}
.tux-rich-data-grid__td {
  padding: 0.6875rem 0.875rem;
  border-bottom: 1px solid var(--surface-border);
  font-size: 0.86rem;
  vertical-align: middle;
}
.tux-rich-data-grid__td--right { text-align: right; }
.tux-rich-data-grid__td--center { text-align: center; }
.tux-rich-data-grid__td--num {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.tux-rich-data-grid__td--cb {
  width: 2.25rem;
  padding: 0.6875rem 0 0.6875rem 0.875rem;
}
.tux-rich-data-grid__td--chevron {
  width: 1.75rem;
  padding: 0.6875rem 0;
}

.tux-rich-data-grid--compact .tux-rich-data-grid__td,
.tux-rich-data-grid--compact .tux-rich-data-grid__th {
  padding-top: 0.4375rem;
  padding-bottom: 0.4375rem;
  font-size: 0.8rem;
}

/* ── Checkbox + chevron primitives ───────────────────────────── */
.tux-rich-data-grid__cb {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
}
.tux-rich-data-grid__cb-box {
  width: 1rem;
  height: 1rem;
  border-radius: 3px;
  border: 1.5px solid var(--surface-border);
  background: var(--surface-raised);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 120ms, border-color 120ms;
}
.tux-rich-data-grid__cb[data-state="checked"] .tux-rich-data-grid__cb-box,
.tux-rich-data-grid__cb[data-state="mixed"] .tux-rich-data-grid__cb-box {
  border-color: var(--brand-primary);
  background: var(--brand-primary);
}
.tux-rich-data-grid__cb-box :deep(.iconify) {
  color: #fff;
  font-size: 0.7rem;
}
.tux-rich-data-grid__cb-dash {
  width: 0.5rem;
  height: 0.125rem;
  background: #fff;
  border-radius: 1px;
}
.tux-rich-data-grid__cb:focus-visible .tux-rich-data-grid__cb-box {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-rich-data-grid__chevron {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: inline-flex;
  transition: transform 160ms cubic-bezier(0.2, 0, 0, 1);
}
.tux-rich-data-grid__chevron[data-expanded="true"] {
  transform: rotate(90deg);
}
.tux-rich-data-grid__chevron:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
  border-radius: 2px;
}
.tux-rich-data-grid__chevron :deep(.iconify) {
  font-size: 0.8rem;
}

/* ── Expanded row ────────────────────────────────────────────── */
.tux-rich-data-grid__expanded {
  background: var(--surface-sunken);
}
.tux-rich-data-grid__expanded-cell {
  padding: 1rem 3.5rem 1.125rem;
  border-bottom: 1px solid var(--surface-border);
  font-size: 0.86rem;
  line-height: 1.55;
  color: var(--text-secondary);
}

.tux-rich-data-grid__empty {
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.86rem;
}

/* ── Footer pagination ───────────────────────────────────────── */
.tux-rich-data-grid__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  border-top: 1px solid var(--surface-border);
  font-size: 0.78rem;
  color: var(--text-muted);
  background: var(--surface-raised);
  flex-wrap: wrap;
}
.tux-rich-data-grid__pagination {
  display: inline-flex;
  gap: 0.25rem;
}
.tux-rich-data-grid__page-btn {
  min-width: 1.75rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--surface-border);
  background: var(--surface-page);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.78rem;
  border-radius: 3px;
  cursor: pointer;
}
.tux-rich-data-grid__page-btn:hover:not([disabled]):not(.tux-rich-data-grid__page-btn--current) {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}
.tux-rich-data-grid__page-btn--current {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: #fff;
}
.tux-rich-data-grid__page-btn[disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}
.tux-rich-data-grid__page-btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

/* ── Container-query collapse for narrow widths ──────────────── */
@container tux-rich-data-grid (max-width: 38rem) {
  .tux-rich-data-grid__toolbar { gap: 0.5rem; }
  .tux-rich-data-grid__search { min-width: 0; flex: 1 1 100%; order: 99; }
  .tux-rich-data-grid__tool-btn { padding: 0.25rem 0.5rem; }
  .tux-rich-data-grid__expanded-cell { padding: 0.875rem 1rem 1rem; }
}
</style>
