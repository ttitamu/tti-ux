<script setup lang="ts">
/**
 * TuxResultCount — "Showing 1–24 of 412 · 24 per page".
 *
 * The status strip that sits above (or below) a list of results.
 * Anatomy:
 *   - Range readout (computed from `page` + `pageSize`)
 *   - Total count with optional noun ("412 corridors", "412 files")
 *   - Optional page-size picker (24 / 48 / 96 typical)
 *
 * Pairs with `TuxPagination`, `TuxLoadMore`, or `TuxInfiniteScroll`.
 * The range readout works the same way regardless of which pager
 * sits next to it — it's a derived display, not a control.
 *
 * State is host-driven. `page` + `pageSize` are bound v-model; the
 * component emits when either changes via the size-picker. Tabular
 * numerals throughout for visual stability.
 *
 * Usage:
 *   <tux-result-count
 *     v-model:page="page"
 *     v-model:page-size="pageSize"
 *     :total="412"
 *     noun="corridor"
 *     :page-size-options="[24, 48, 96]"
 *   />
 */

interface Props {
  /** Current page (1-indexed). */
  page: number;
  /** Items per page. */
  pageSize: number;
  /** Total items across all pages. */
  total: number;
  /** Item noun for the count line, e.g. "412 corridors". Singular —
   *  the component pluralizes naively (adds "s"). Pass an explicit
   *  pair via `nounPlural` if irregular ("study" → "studies"). */
  noun?: string;
  /** Override plural noun when naive `+s` doesn't fit. */
  nounPlural?: string;
  /** Page-size options for the picker. Omit to hide the picker. */
  pageSizeOptions?: number[];
  /** Hide the range readout (rare; for when you only want the picker). */
  hideRange?: boolean;
  /** Picker label. Default "per page". */
  pageSizeLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  noun: undefined,
  nounPlural: undefined,
  pageSizeOptions: undefined,
  hideRange: false,
  pageSizeLabel: "per page",
});

const emit = defineEmits<{
  "update:page": [v: number];
  "update:pageSize": [v: number];
}>();

const start = computed(() =>
  props.total === 0 ? 0 : Math.min((props.page - 1) * props.pageSize + 1, props.total)
);
const end = computed(() =>
  Math.min(props.page * props.pageSize, props.total)
);

const nounLabel = computed(() => {
  if (!props.noun) return null;
  if (props.total === 1) return props.noun;
  return props.nounPlural ?? `${props.noun}s`;
});

function changeSize(e: Event) {
  const next = Number((e.target as HTMLSelectElement).value);
  emit("update:pageSize", next);
  // Snap back to page 1 when the size changes so the user doesn't
  // land in an empty range.
  if (props.page !== 1) emit("update:page", 1);
}
</script>

<template>
  <div class="tux-result-count">
    <p v-if="!hideRange" class="tux-result-count__range">
      <span v-if="total === 0">
        No results
      </span>
      <span v-else>
        Showing
        <span class="tux-result-count__num">{{ start.toLocaleString() }}–{{ end.toLocaleString() }}</span>
        of
        <span class="tux-result-count__num">{{ total.toLocaleString() }}</span>
        <span v-if="nounLabel">{{ ' ' }}{{ nounLabel }}</span>
      </span>
    </p>
    <label v-if="pageSizeOptions?.length" class="tux-result-count__picker">
      <select
        :value="pageSize"
        class="tux-result-count__select"
        @change="changeSize"
      >
        <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }}</option>
      </select>
      <span>{{ pageSizeLabel }}</span>
    </label>
  </div>
</template>

<style scoped>
.tux-result-count {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}
.tux-result-count__range {
  margin: 0;
}
.tux-result-count__num {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: var(--text-primary);
}
.tux-result-count__picker {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--text-muted);
}
.tux-result-count__select {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.8125rem;
  padding: 0.25rem 1.5rem 0.25rem 0.5rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm, 0.25rem);
  background: var(--surface-raised);
  color: var(--text-primary);
}
.tux-result-count__select:focus {
  outline: 2px solid var(--brand-primary);
  outline-offset: 1px;
}
</style>
