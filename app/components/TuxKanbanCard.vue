<script setup lang="ts">
/**
 * TuxKanbanCard — a card in a TuxKanbanLane. The slot is its visual body;
 * this wrapper makes it draggable (pointer and keyboard), focusable, and
 * openable: click or Enter emits `open`. Buttons and links inside the slot
 * keep working — a drag only arms after the pointer travels 4px, and never
 * from an interactive element.
 *
 * `label` names the card for screen readers and is what the board announces
 * while it moves ("Picked up Upgrade the VM…"); pass it. The card is a named
 * group, not a button, because card bodies often hold their own buttons.
 */
import { computed, onMounted, ref } from "vue";
import { useTuxKanbanDnd } from "./TuxKanbanBoard.vue";

const props = withDefaults(defineProps<{
  cardId: string;
  laneId: string;
  label?: string;
  /** This card never moves (the rest of the board still can). */
  locked?: boolean;
}>(), {
  label: undefined,
  locked: false,
});

const emit = defineEmits<{ open: [cardId: string] }>();
const dnd = useTuxKanbanDnd();
const el = ref<HTMLElement | null>(null);

const dragging = computed(() => dnd.draggingId.value === props.cardId);
const lifted = computed(() => dragging.value && dnd.mode.value === "keyboard");
const movable = computed(() => !dnd.disabled.value && !props.locked);
// A drop line above this card when the dragged card would land before it.
const showIndicator = computed(() =>
  !!dnd.draggingId.value && !dragging.value && !dnd.refusal.value &&
  dnd.overLaneId.value === props.laneId && dnd.beforeCardId.value === props.cardId);

const text = () => props.label || el.value?.textContent?.replace(/\s+/g, " ").trim().slice(0, 120) || props.cardId;

function onKey(e: KeyboardEvent) {
  if (e.target !== el.value) return;                    // keys inside the card's own controls are theirs
  if (lifted.value || (e.key === " " && movable.value)) return dnd.onCardKey(props.cardId, props.laneId, text(), e);
  if (e.key === "Enter") { e.preventDefault(); emit("open", props.cardId); }
}
function onPointerDown(e: PointerEvent) {
  if (movable.value) dnd.beginDrag(props.cardId, props.laneId, e);
}
function onClick(e: MouseEvent) {
  if ((e.target as Element | null)?.closest('button, a, input, textarea, select, [contenteditable="true"]')) return;
  emit("open", props.cardId);
}

// The parent may re-render the card in another lane after a keyboard move;
// keep the keyboard user where they were.
onMounted(() => {
  if (dnd.pendingFocus.value === props.cardId) {
    dnd.pendingFocus.value = null;
    el.value?.focus();
  }
});
</script>

<template>
  <div class="tux-kanban-card-slot" :data-kanban-card="cardId">
    <div v-if="showIndicator" class="tux-kanban-card__indicator" aria-hidden="true" />
    <div
      ref="el"
      class="tux-kanban-card"
      :class="{ 'tux-kanban-card--dragging': dragging && !lifted, 'tux-kanban-card--lifted': lifted, 'tux-kanban-card--movable': movable }"
      tabindex="0"
      role="group"
      :aria-label="label"
      :aria-roledescription="movable ? 'movable card' : 'card'"
      @pointerdown="onPointerDown"
      @click="onClick"
      @keydown="onKey"
      @blur="lifted && dnd.cancelKeyboard()"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.tux-kanban-card-slot {
  position: relative;
}

.tux-kanban-card__indicator {
  position: absolute;
  top: -6px;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 3px;
  background: var(--brand-primary);
}

.tux-kanban-card {
  display: block;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  color: var(--text-primary);
  cursor: pointer;
  transition: border-color var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard),
    opacity var(--motion-fast) var(--ease-standard);
}

.tux-kanban-card--movable {
  /* On touch, a vertical swipe still scrolls the lane; a sideways drag moves
     the card to another lane (the browser would otherwise take both). */
  touch-action: pan-y;
}

.tux-kanban-card:hover {
  border-color: var(--brand-primary);
}

.tux-kanban-card:focus-visible {
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
}

.tux-kanban-card--dragging {
  opacity: 0.4;
}

.tux-kanban-card--lifted {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 22%, transparent), var(--shadow-md);
}

@media (prefers-reduced-motion: reduce) {
  .tux-kanban-card { transition: none; }
}
</style>
