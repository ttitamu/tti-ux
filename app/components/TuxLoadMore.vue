<script setup lang="ts">
/**
 * TuxLoadMore — explicit "Load more" button.
 *
 * The middle ground between numbered pagination (`TuxPagination`) and
 * infinite scroll (`TuxInfiniteScroll`). Use when:
 *   - the user should *decide* to expand the list (vs auto-loading)
 *   - search-engine indexing matters (infinite scroll hurts SEO)
 *   - you want a clear "stop point" in long news/article feeds
 *
 * Renders a single full-width button with the remaining count below.
 * Click → emits `@load`. The host fetches the next page and bumps
 * the `loaded` prop. When `loaded >= total`, the component switches
 * to a "you've seen everything" terminal state.
 *
 * State is host-driven. The component renders one of three states:
 *   - default — clickable button with the count remaining
 *   - loading — disabled with a spinner; consumer sets `loading=true`
 *   - terminal — all items loaded, button replaced with a divider
 *
 * Usage:
 *   <tux-load-more
 *     :loaded="items.length"
 *     :total="412"
 *     :loading="fetching"
 *     noun="result"
 *     @load="fetchNext"
 *   />
 */

interface Props {
  /** Items already loaded (typically `items.length` from the host). */
  loaded: number;
  /** Total items across all pages. When `loaded >= total`, terminal. */
  total: number;
  /** Show the loading spinner + disable the button. */
  loading?: boolean;
  /** Item noun for the count line ("412 results", "8 of 412 corridors"). */
  noun?: string;
  /** Override naive plural when "+s" doesn't fit. */
  nounPlural?: string;
  /** Button label. Default `"Load more"`. */
  label?: string;
  /** Terminal-state message. Default `"All loaded"`. */
  terminalLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  noun: undefined,
  nounPlural: undefined,
  label: "Load more",
  terminalLabel: "All loaded",
});

defineEmits<{
  load: [];
}>();

const remaining = computed(() => Math.max(0, props.total - props.loaded));
const isTerminal = computed(() => props.loaded >= props.total && props.total > 0);

const nounLabel = computed(() => {
  if (!props.noun) return null;
  if (remaining.value === 1) return props.noun;
  return props.nounPlural ?? `${props.noun}s`;
});
</script>

<template>
  <div class="tux-load-more">
    <div v-if="isTerminal" class="tux-load-more__terminal">
      <span class="tux-load-more__rule" aria-hidden="true" />
      <span class="tux-load-more__terminal-text">{{ terminalLabel }} · {{ total.toLocaleString() }}<template v-if="noun"> {{ nounPlural ?? noun + 's' }}</template></span>
      <span class="tux-load-more__rule" aria-hidden="true" />
    </div>
    <template v-else>
      <button
        type="button"
        class="tux-load-more__btn"
        :disabled="loading"
        @click="$emit('load')"
      >
        <UIcon
          v-if="loading"
          name="lucide:loader-2"
          class="tux-load-more__spinner"
          aria-hidden="true"
        />
        <span>{{ loading ? 'Loading…' : label }}</span>
      </button>
      <p class="tux-load-more__count">
        <span class="tux-load-more__num">{{ loaded.toLocaleString() }}</span>
        of
        <span class="tux-load-more__num">{{ total.toLocaleString() }}</span>
        <span v-if="nounLabel">{{ ' ' }}{{ nounLabel }}</span>
        ·
        <span class="tux-load-more__num">{{ remaining.toLocaleString() }}</span> remaining
      </p>
    </template>
  </div>
</template>

<style scoped>
.tux-load-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 0;
}
.tux-load-more__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 12rem;
  padding: 0.625rem 1.25rem;
  font-family: var(--font-bold);
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  color: var(--brand-primary);
  background: transparent;
  border: 2px solid var(--brand-primary);
  border-radius: var(--radius-md, 0.375rem);
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}
.tux-load-more__btn:hover {
  background: var(--brand-primary);
  color: var(--text-inverse, #fff);
}
.tux-load-more__btn:disabled {
  cursor: progress;
  opacity: 0.7;
}
.tux-load-more__spinner {
  width: 1rem;
  height: 1rem;
  animation: tux-load-more-spin 800ms linear infinite;
}
@keyframes tux-load-more-spin {
  to { transform: rotate(360deg); }
}
.tux-load-more__count {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}
.tux-load-more__num {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: var(--text-secondary);
}
.tux-load-more__terminal {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  max-width: 32rem;
}
.tux-load-more__rule {
  flex: 1;
  height: 1px;
  background: var(--surface-border);
}
.tux-load-more__terminal-text {
  font-family: var(--font-bold);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  color: var(--text-muted);
}
</style>
