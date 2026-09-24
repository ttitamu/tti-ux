<script setup lang="ts">
/**
 * TuxKanbanLane — one column of a TuxKanbanBoard, and a drop target.
 * Header: a tone dot, the title, a count and an optional hint; the `actions`
 * slot adds buttons (e.g. "add"). The default slot takes TuxKanbanCards; the
 * `empty` slot shows when there are none.
 *
 * While a drag is over the lane it highlights, shows where the card will land
 * and — when the board's canDrop refuses it — says why, instead of highlighting.
 */
import { computed } from "vue";
import { useTuxKanbanDnd } from "./TuxKanbanBoard.vue";

type Tone = "brand" | "info" | "success" | "warning" | "error" | "neutral" | "muted";

const props = withDefaults(defineProps<{
  laneId: string;
  title: string;
  count?: number;
  /** A sentence under the title ("Being worked on"). */
  hint?: string;
  tone?: Tone;
}>(), {
  count: undefined,
  hint: undefined,
  tone: "brand",
});

const dnd = useTuxKanbanDnd();
const isOver = computed(() => !!dnd.draggingId.value && dnd.overLaneId.value === props.laneId);
const refused = computed(() => isOver.value && !!dnd.refusal.value);
const showAppend = computed(() => isOver.value && !refused.value && dnd.beforeCardId.value === null);

const TONE: Record<Tone, string> = {
  brand: "var(--brand-primary)",
  info: "var(--color-info)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  error: "var(--color-error)",
  neutral: "var(--text-secondary)",
  muted: "var(--text-muted)",
};
const titleId = `tux-kanban-lane-${props.laneId.replace(/[^\w-]/g, "_")}-${Math.random().toString(36).slice(2, 6)}`;
</script>

<template>
  <!-- a named group, not a <section>: a landmark per lane repeats "Now",
       "Next"… on any page with two boards (axe landmark-unique) -->
  <div
    role="group"
    class="tux-kanban-lane"
    :class="{ 'tux-kanban-lane--over': isOver && !refused, 'tux-kanban-lane--refused': refused }"
    :data-kanban-lane="laneId"
    :data-kanban-title="title"
    :aria-labelledby="titleId"
  >
    <header class="tux-kanban-lane__header">
      <slot name="header">
        <span class="tux-kanban-lane__dot" :style="{ background: TONE[tone] }" aria-hidden="true" />
        <span :id="titleId" class="tux-kanban-lane__title">{{ title }}</span>
        <span v-if="count !== undefined" class="tux-kanban-lane__count" :aria-label="`${count} ${count === 1 ? 'card' : 'cards'}`">{{ count }}</span>
        <span class="tux-kanban-lane__actions"><slot name="actions" /></span>
        <span v-if="hint" class="tux-kanban-lane__hint">{{ hint }}</span>
      </slot>
    </header>
    <p v-if="refused" class="tux-kanban-lane__refusal" role="status">{{ dnd.refusal.value }}</p>
    <div class="tux-kanban-lane__cards">
      <slot />
      <div v-if="!$slots.default || count === 0" class="tux-kanban-lane__empty"><slot name="empty">Nothing here</slot></div>
      <div v-if="showAppend" class="tux-kanban-lane__append" aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
.tux-kanban-lane {
  display: flex;
  flex-direction: column;
  flex: 0 0 var(--tux-kanban-lane-width, 18rem);
  min-width: 0;
  max-height: var(--tux-kanban-lane-max-height, none);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border-subtle);
  border-radius: var(--radius-md);
  transition: border-color var(--motion-fast) var(--ease-standard), background var(--motion-fast) var(--ease-standard);
}

.tux-kanban-lane--over {
  border-color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 7%, var(--surface-sunken));
}

.tux-kanban-lane--refused {
  border-color: var(--color-error);
  border-style: dashed;
}

.tux-kanban-lane__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  padding: 10px 12px 8px;
}

.tux-kanban-lane__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
}

.tux-kanban-lane__title {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-primary);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tux-kanban-lane__count {
  font-size: 0.75rem;
  color: var(--text-secondary);
  background: var(--surface-raised);
  border-radius: var(--radius-sm);
  padding: 0 6px;
  font-variant-numeric: tabular-nums;
}

.tux-kanban-lane__actions {
  margin-left: auto;
  display: inline-flex;
  gap: 4px;
}

.tux-kanban-lane__hint {
  flex-basis: 100%;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.tux-kanban-lane__refusal {
  margin: 0 8px 4px;
  padding: 6px 8px;
  font-size: 0.8125rem;
  color: var(--color-error);
  background: color-mix(in srgb, var(--color-error) 8%, transparent);
  border-radius: var(--radius-sm);
}

.tux-kanban-lane__cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 8px 10px;
  overflow-y: auto;
  flex: 1;
  min-height: 3rem;
}

.tux-kanban-lane__empty {
  padding: 12px 4px;
  font-size: 0.8125rem;
  color: var(--text-muted);
  text-align: center;
}

.tux-kanban-lane__append {
  height: 3px;
  border-radius: 3px;
  background: var(--brand-primary);
  flex: none;
}

@media (prefers-reduced-motion: reduce) {
  .tux-kanban-lane { transition: none; }
}
</style>
