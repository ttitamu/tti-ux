<script setup lang="ts">
/**
 * TuxBranchNav — `‹ N of M ›` navigator for response alternatives.
 *
 * Pattern from Vercel's AI SDK Elements (`Branch`): when the model
 * has produced multiple candidate responses for the same prompt
 * (regeneration / branching), surface a tiny prev/next pair so users
 * can cycle through. Live position is text ("2 of 5") so screen
 * readers announce the change.
 *
 * Pure presentation. Host app decides what data each branch
 * represents — the component only tracks the index.
 *
 * v-model binds to a 1-indexed position. Emits `update:modelValue`,
 * `prev`, `next`, and `select(index)` so consumers can hook fine-
 * grained analytics if they want.
 */

interface Props {
  /** Current 1-indexed position. */
  modelValue: number;
  /** Total number of branches. */
  total: number;
  /** Loop around at the ends (wrapping nav). */
  loop?: boolean;
  /** Visually hide everything when total ≤ 1 (default true — a single
   *  response doesn't need a nav). */
  hideSingleton?: boolean;
  /** ARIA label for the nav. */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loop: false,
  hideSingleton: true,
  ariaLabel: "Response alternatives",
});

const emit = defineEmits<{
  "update:modelValue": [n: number];
  prev: [];
  next: [];
  select: [n: number];
}>();

const visible = computed(() => !props.hideSingleton || props.total > 1);
const atStart = computed(() => props.modelValue <= 1);
const atEnd = computed(() => props.modelValue >= props.total);

function step(delta: 1 | -1) {
  let next = props.modelValue + delta;
  if (next < 1) next = props.loop ? props.total : 1;
  if (next > props.total) next = props.loop ? 1 : props.total;
  if (next === props.modelValue) return;
  emit("update:modelValue", next);
  emit("select", next);
  // Narrow to the literal so the union doesn't widen the emit signature.
  if (delta === 1) emit("next");
  else emit("prev");
}
</script>

<template>
  <nav
    v-if="visible"
    class="tux-branch-nav"
    :aria-label="ariaLabel"
  >
    <button
      type="button"
      class="tux-branch-nav__btn"
      :disabled="!loop && atStart"
      :aria-label="`Previous ${ariaLabel}`"
      @click="step(-1)"
    >
      <Icon name="lucide:chevron-left" class="tux-branch-nav__icon" aria-hidden="true" />
    </button>
    <span class="tux-branch-nav__position" aria-live="polite">
      {{ modelValue }} of {{ total }}
    </span>
    <button
      type="button"
      class="tux-branch-nav__btn"
      :disabled="!loop && atEnd"
      :aria-label="`Next ${ariaLabel}`"
      @click="step(1)"
    >
      <Icon name="lucide:chevron-right" class="tux-branch-nav__icon" aria-hidden="true" />
    </button>
  </nav>
</template>

<style scoped>
.tux-branch-nav {
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-secondary);
  user-select: none;
}

.tux-branch-nav__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  color: inherit;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.tux-branch-nav__btn:hover:not(:disabled),
.tux-branch-nav__btn:focus-visible:not(:disabled) {
  background: var(--surface-sunken);
  color: var(--brand-primary);
  outline: none;
}

.tux-branch-nav__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tux-branch-nav__icon {
  width: 0.875rem;
  height: 0.875rem;
}

.tux-branch-nav__position {
  min-width: 3.5rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
</style>
