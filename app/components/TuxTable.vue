<script setup lang="ts">
/**
 * TuxTable — TTI-flavored UTable.
 *
 * Forwards all props + slots to UTable. Adds:
 *   - maroon-wash header + uppercase tracked header labels
 *   - brand-tinted row hover
 *   - rounded card frame (wraps the table in the .tux-table shell)
 *   - default monospace font on all body cells — paths / IDs read right;
 *     override per-column with a `#{column}-cell` slot if you need prose
 *
 * Status columns get a ready-made `#status-cell` slot when `statusAccessor`
 * is set — just point it at the accessorKey of the status column and the
 * cell auto-renders as <tux-badge :status="..." />.
 *
 * Usage:
 *   <tux-table :data="projects" :columns="cols" status-accessor="status" />
 *
 * Custom per-column:
 *   <tux-table :data :columns>
 *     <template #path-cell="{ row }">
 *       <NuxtLink :to="`/item/${row.id}`" class="font-mono">{{ row.path }}</NuxtLink>
 *     </template>
 *   </tux-table>
 */

interface Props {
  /**
   * Accessor key of the status column — when set, that column auto-renders
   * as a TuxBadge. Defaults to `"status"` if that column exists in data.
   */
  statusAccessor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  statusAccessor: "status",
});

// UTable's default classes are dense SaaS table. These overrides give the
// tux flavoring without forking the component.
const tableUi = {
  thead: "bg-[color-mix(in_srgb,var(--brand-primary)_6%,var(--surface-raised))]",
  th: "uppercase text-text-secondary font-semibold text-xs tracking-wider py-3",
  tr: "hover:bg-[color-mix(in_srgb,var(--brand-primary)_4%,transparent)] transition-colors",
  td: "text-sm font-mono py-3",
};

// Read the status value off a row in a way that keeps the type cast out
// of the template. Inline TypeScript union literals (`'a' | 'b'`) in
// template expressions trip vue-eslint-parser's filter rule — extracting
// the cast here both sidesteps the false positive and makes the typing
// reusable if we add more status-typed slots.
type ScanStatus = "running" | "completed" | "failed" | "queued";
// `row` comes in as `Row<unknown>` from UTable's slot — accept that
// shape (original is `unknown`) and do the narrowing cast inside the
// function so the call site stays clean.
function readStatus(row: { original?: unknown }): ScanStatus {
  const source = (row.original ?? row) as Record<string, string>;
  return source[props.statusAccessor] as ScanStatus;
}
</script>

<template>
  <div class="tux-table">
    <UTable v-bind="$attrs" :ui="tableUi">
      <template v-if="statusAccessor" #[`${statusAccessor}-cell`]="{ row }">
        <TuxBadge :status="readStatus(row)" />
      </template>

      <template
        v-for="(_, name) in $slots"
        :key="name"
        #[name]="slotData"
      >
        <slot :name="name" v-bind="slotData" />
      </template>
    </UTable>
  </div>
</template>
