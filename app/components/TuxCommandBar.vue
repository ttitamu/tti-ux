<script setup lang="ts">
/**
 * TuxCommandBar.vue — Standard Enterprise Action Ribbon & Selection Bar.
 *
 * Inspired by Microsoft Fluent 2 Command Bar and IBM Carbon Data Table Toolbar.
 * Provides a standardized horizontal ribbon for operational surfaces, tables,
 * editors, and entity lists.
 *
 * Supports:
 * - Primary/Secondary action button groups
 * - Bulk selection bar with selection count and batch actions
 * - View mode switcher slots
 * - Search filter input slot
 */

interface Props {
  selectedCount?: number;
  density?: "compact" | "comfortable";
  bordered?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selectedCount: 0,
  density: "compact",
  bordered: true,
});

const emit = defineEmits<{
  (e: "clear-selection"): void;
}>();
</script>

<template>
  <div
    class="tux-command-bar flex items-center justify-between gap-2 bg-surface-sunken transition-all select-none overflow-x-auto"
    :class="[
      props.density === 'compact' ? 'px-3 py-1.5 min-h-[38px] text-xs' : 'px-4 py-2.5 min-h-[46px] text-sm',
      props.bordered ? 'border border-surface-border rounded-lg' : '',
    ]"
    data-testid="tux-command-bar"
    role="toolbar"
    aria-label="Command actions"
  >
    <!-- Normal Mode: Actions, Filter & View Switcher -->
    <template v-if="props.selectedCount <= 0">
      <!-- Left: Primary & Secondary Actions Slot -->
      <div class="flex items-center gap-1.5 flex-shrink-0">
        <slot name="actions" />
      </div>

      <!-- Center / Right: Filter, View Switcher & Custom End Cluster -->
      <div class="flex items-center gap-2 flex-shrink-0 ml-auto">
        <!-- Search / Filter Slot -->
        <div v-if="$slots.filter" class="flex items-center">
          <slot name="filter" />
        </div>

        <!-- View Switcher Slot -->
        <div v-if="$slots.views" class="flex items-center">
          <slot name="views" />
        </div>

        <!-- End Custom Utilities -->
        <div v-if="$slots.end" class="flex items-center gap-1">
          <slot name="end" />
        </div>
      </div>
    </template>

    <!-- Selection / Batch Mode: When selectedCount > 0 -->
    <template v-else>
      <!-- Left: Selection Badge & Clear Trigger -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono font-bold text-xs bg-brand-primary text-text-on-brand shadow-xs">
          <UIcon name="lucide:check-square" class="w-3.5 h-3.5" aria-hidden="true" />
          <span>{{ props.selectedCount }} selected</span>
        </span>
        <button
          type="button"
          class="px-2 py-1 rounded text-xs font-semibold text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
          title="Clear selected items"
          aria-label="Clear selected items"
          @click="emit('clear-selection')"
        >
          Deselect all
        </button>
      </div>

      <!-- Right: Batch Action Buttons -->
      <div class="flex items-center gap-1.5 flex-shrink-0 ml-auto">
        <slot name="selection-actions" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.tux-command-bar {
  box-sizing: border-box;
}
</style>
