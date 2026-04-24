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
 *   <tux-table :data="scans" :columns="cols" status-accessor="status" />
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

withDefaults(defineProps<Props>(), {
  statusAccessor: "status",
});

// UTable's default classes are dense SaaS table. These overrides give the
// aggieux flavoring without forking the component.
const tableUi = {
  thead: "bg-[color-mix(in_srgb,var(--brand-primary)_6%,var(--surface-raised))]",
  th: "uppercase text-text-secondary font-semibold text-xs tracking-wider py-3",
  tr: "hover:bg-[color-mix(in_srgb,var(--brand-primary)_4%,transparent)] transition-colors",
  td: "text-sm font-mono py-3",
};
</script>

<template>
  <div class="tux-table">
    <UTable v-bind="$attrs" :ui="tableUi">
      <template v-if="statusAccessor" #[`${statusAccessor}-cell`]="{ row }">
        <TuxBadge :status="(row.original || row)[statusAccessor]" />
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
