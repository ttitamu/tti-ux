<script setup lang="ts">
/**
 * TuxRecordHighlights.vue — Pinned Entity Summary & Highlights Panel.
 *
 * Inspired by Salesforce SLDS 2 Record Highlights Panel and Shopify Polaris Page Headers.
 * Pinned at the top of entity detail records, research corridors, test track views,
 * and editorial CMS canvases.
 *
 * Displays:
 * - Entity Icon, Eyebrow classification, and Primary Title
 * - Status Badge slot (<TuxBadge> or <TuxStatus>)
 * - Top 4-6 primary KPI metric chips with values, change indicators, and labels
 * - Right-docked primary & secondary action buttons
 */

export interface HighlightItem {
  label: string;
  value: string | number;
  change?: string;
  changeTone?: "positive" | "negative" | "neutral";
  tone?: string;
  icon?: string;
}

interface Props {
  title: string;
  eyebrow?: string;
  icon?: string;
  items?: HighlightItem[];
}

const props = withDefaults(defineProps<Props>(), {
  eyebrow: undefined,
  icon: undefined,
  items: () => [],
});
</script>

<template>
  <div
    class="tux-record-highlights bg-surface-raised border border-surface-border rounded-xl p-4 sm:p-5 shadow-xs space-y-4"
    data-testid="tux-record-highlights"
  >
    <!-- Top Row: Identity, Title, Badges & Action Buttons -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
      <!-- Left: Icon, Eyebrow, Title & Badge -->
      <div class="flex items-start gap-3 min-w-0">
        <div
          v-if="props.icon"
          class="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5"
          aria-hidden="true"
        >
          <UIcon :name="props.icon" class="w-5 h-5" />
        </div>

        <div class="space-y-0.5 min-w-0">
          <div v-if="props.eyebrow" class="flex items-center gap-2">
            <span class="eyebrow text-brand-primary m-0 text-[10px] font-mono uppercase tracking-wider font-bold">
              {{ props.eyebrow }}
            </span>
          </div>

          <div class="flex items-center flex-wrap gap-2">
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-text-primary m-0 truncate">
              {{ props.title }}
            </h2>
            <div v-if="$slots.badge" class="flex items-center">
              <slot name="badge" />
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Action Button Cluster -->
      <div v-if="$slots.actions" class="flex items-center gap-2 flex-shrink-0 sm:self-center">
        <slot name="actions" />
      </div>
    </div>

    <!-- Bottom Row: Primary KPI Highlight Metric Chips -->
    <div
      v-if="props.items && props.items.length > 0"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-0.5"
    >
      <div
        v-for="(item, idx) in props.items"
        :key="item.label || idx"
        class="p-2.5 rounded-lg bg-surface-sunken border border-surface-border space-y-1 transition-all hover:border-brand-primary/40"
      >
        <span class="block text-[10px] font-mono uppercase font-bold text-text-muted tracking-wider truncate">
          {{ item.label }}
        </span>

        <div class="flex items-baseline gap-1.5 flex-wrap">
          <span class="text-base sm:text-lg font-bold text-text-primary tracking-tight font-mono">
            {{ item.value }}
          </span>

          <span
            v-if="item.change"
            class="text-[9px] font-mono font-bold px-1 py-0.2 rounded"
            :class="[
              item.changeTone === 'positive' ? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300' :
              item.changeTone === 'negative' ? 'bg-rose-500/12 text-rose-700 dark:text-rose-300' :
              'bg-surface-raised text-text-muted'
            ]"
          >
            {{ item.change }}
          </span>
        </div>
      </div>
    </div>

    <!-- Optional Contextual Extra Slot -->
    <div v-if="$slots.extra" class="pt-1 text-xs text-text-muted">
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped>
.tux-record-highlights {
  box-sizing: border-box;
}
</style>
