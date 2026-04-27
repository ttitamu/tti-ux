<script setup lang="ts">
// TuxPagination — page-number controls for result lists.
//
// Used by PECAN result tables, news collections, publication lists, any
// surface where N items spread across multiple pages. v-modeled as the
// current page number (1-indexed).
//
// Renders prev | numbered pages | next, with ellipsis for runs that won't
// fit. Optional status line ("Showing 21–40 of 412 results") and page-size
// selector.
//
// Native Vue (not UPagination) so the visual rhythm — square corners,
// maroon active page, tabular numerals — exactly matches the system.

interface Props {
  /** Total number of items across all pages. */
  total: number;
  /** Current page (1-indexed). v-model. */
  modelValue: number;
  /** Items per page. */
  pageSize?: number;
  /** How many pages to show on each side of the current page. */
  siblingCount?: number;
  /** Always show first/last page numbers (with ellipsis as needed). */
  boundaryCount?: number;
  /** Show "Showing X–Y of Z results" line above the controls. */
  showStatus?: boolean;
  /** Singular noun for the status line ("result" → "results"). */
  noun?: string;
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 20,
  siblingCount: 1,
  boundaryCount: 1,
  showStatus: false,
  noun: "result",
});

const emit = defineEmits<{
  "update:modelValue": [page: number];
}>();

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));

const currentPage = computed({
  get: () => Math.min(Math.max(1, props.modelValue), totalPages.value),
  set: (n: number) => emit("update:modelValue", n),
});

const rangeStart = computed(() => (currentPage.value - 1) * props.pageSize + 1);
const rangeEnd = computed(() => Math.min(currentPage.value * props.pageSize, props.total));

// Build the pagination range with ellipses.
// Adapted from MUI's pagination algorithm: always show boundaryCount at
// each end, siblingCount around the current page, and "…" for gaps.
const paginationRange = computed<(number | "ellipsis-left" | "ellipsis-right")[]>(() => {
  const total = totalPages.value;
  const page = currentPage.value;
  const sib = props.siblingCount;
  const bnd = props.boundaryCount;

  const minSlots = bnd * 2 + sib * 2 + 3; // first..last + current + 2 ellipses
  if (total <= minSlots) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSiblingStart = Math.max(page - sib, bnd + 2);
  const rightSiblingEnd = Math.min(page + sib, total - bnd - 1);

  const showLeftEllipsis = leftSiblingStart > bnd + 2;
  const showRightEllipsis = rightSiblingEnd < total - bnd - 1;

  const range: (number | "ellipsis-left" | "ellipsis-right")[] = [];

  for (let i = 1; i <= bnd; i++) range.push(i);
  if (showLeftEllipsis) range.push("ellipsis-left");
  else if (bnd + 1 < leftSiblingStart) range.push(bnd + 1);

  for (let i = leftSiblingStart; i <= rightSiblingEnd; i++) range.push(i);

  if (showRightEllipsis) range.push("ellipsis-right");
  else if (rightSiblingEnd + 1 < total - bnd + 1) range.push(rightSiblingEnd + 1);

  for (let i = total - bnd + 1; i <= total; i++) range.push(i);

  return range;
});

function go(page: number) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return;
  currentPage.value = page;
}

function formatNumber(n: number): string {
  return n.toLocaleString();
}
</script>

<template>
  <nav class="tux-pagination" aria-label="Pagination">
    <p
      v-if="showStatus"
      class="tux-pagination__status"
      aria-live="polite"
    >
      Showing
      <span class="tux-pagination__range">{{ formatNumber(rangeStart) }}–{{ formatNumber(rangeEnd) }}</span>
      of
      <span class="tux-pagination__total">{{ formatNumber(total) }}</span>
      {{ total === 1 ? noun : `${noun}s` }}
    </p>

    <ul class="tux-pagination__list">
      <li>
        <button
          type="button"
          class="tux-pagination__btn tux-pagination__btn--nav"
          :disabled="currentPage === 1"
          aria-label="Previous page"
          @click="go(currentPage - 1)"
        >
          <Icon name="lucide:chevron-left" aria-hidden="true" />
          <span class="tux-pagination__nav-label">Prev</span>
        </button>
      </li>

      <li
        v-for="(slot, idx) in paginationRange"
        :key="`${slot}-${idx}`"
      >
        <span
          v-if="slot === 'ellipsis-left' || slot === 'ellipsis-right'"
          class="tux-pagination__ellipsis"
          aria-hidden="true"
        >…</span>
        <button
          v-else
          type="button"
          class="tux-pagination__btn tux-pagination__btn--page"
          :class="{ 'tux-pagination__btn--active': slot === currentPage }"
          :aria-current="slot === currentPage ? 'page' : undefined"
          :aria-label="`Page ${slot}`"
          @click="go(slot)"
        >{{ slot }}</button>
      </li>

      <li>
        <button
          type="button"
          class="tux-pagination__btn tux-pagination__btn--nav"
          :disabled="currentPage === totalPages"
          aria-label="Next page"
          @click="go(currentPage + 1)"
        >
          <span class="tux-pagination__nav-label">Next</span>
          <Icon name="lucide:chevron-right" aria-hidden="true" />
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.tux-pagination {
  container-type: inline-size;
  container-name: tux-pagination;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  align-items: center;
}

.tux-pagination__status {
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--text-muted);
  text-align: center;
}

.tux-pagination__range,
.tux-pagination__total {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.tux-pagination__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  align-items: center;
}

.tux-pagination__btn {
  min-width: 2.25rem;
  height: 2.25rem;
  padding: 0 0.625rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.tux-pagination__btn:hover:not(:disabled),
.tux-pagination__btn:focus-visible:not(:disabled) {
  background: color-mix(in srgb, var(--brand-primary) 6%, transparent);
  color: var(--brand-primary);
  border-color: color-mix(in srgb, var(--brand-primary) 35%, var(--surface-border));
  outline: none;
}

.tux-pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tux-pagination__btn--active {
  background: var(--brand-primary);
  color: #fff;
  border-color: var(--brand-primary);
  font-weight: 700;
}

.tux-pagination__btn--active:hover,
.tux-pagination__btn--active:focus-visible {
  background: var(--brand-primary-deep);
  color: #fff;
  border-color: var(--brand-primary-deep);
}

.tux-pagination__btn--nav {
  padding: 0 0.875rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.tux-pagination__nav-label {
  display: none;
}

@container tux-pagination (min-width: 30rem) {
  .tux-pagination__nav-label {
    display: inline;
  }
}

.tux-pagination__btn--nav :deep(svg) {
  width: 0.875rem;
  height: 0.875rem;
}

.tux-pagination__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2.25rem;
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 0.875rem;
}
</style>
