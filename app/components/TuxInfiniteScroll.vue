<script setup lang="ts">
/**
 * TuxInfiniteScroll — sentinel-driven auto-load.
 *
 * The aggressive end of pagination. Uses an `IntersectionObserver` on
 * a hidden sentinel `<div>` at the bottom of the list — when the
 * sentinel enters the viewport, the component emits `@load`. Use for
 * feeds (news, conversation history, image galleries) where the user
 * is in a scanning rhythm and shouldn't be interrupted by a button.
 *
 * **Choose deliberately.** Three trade-offs vs `TuxLoadMore`:
 *   1. SEO — infinite scroll is invisible to crawlers below the
 *      initial page. Don't use for indexable content.
 *   2. Footer visibility — users can't reach the footer reliably
 *      because new items keep appearing. Put a `TuxLoadMore` at the
 *      end of long feeds instead, or accept the loss.
 *   3. Keyboard nav — keyboard-only users can't trigger
 *      IntersectionObserver. The component renders a fallback "Load
 *      more" button when `prefers-reduced-motion` is on, or when
 *      the consumer passes `keyboardFallback`.
 *
 * State is host-driven. The component:
 *   - mounts an IntersectionObserver on the sentinel
 *   - emits `@load` when the sentinel hits the viewport
 *   - throttles to one emit per `loaded` change (no double-fire while
 *     the consumer is fetching)
 *   - exposes `loading` and `loaded >= total` terminal states
 *
 * Usage:
 *   <tux-infinite-scroll
 *     :loaded="items.length"
 *     :total="412"
 *     :loading="fetching"
 *     @load="fetchNext"
 *   />
 */

interface Props {
  loaded: number;
  total: number;
  loading?: boolean;
  /** When true, always render a fallback button alongside the
   *  sentinel — for surfaces where keyboard reachability matters. */
  keyboardFallback?: boolean;
  /** Root margin for the IntersectionObserver. Default `"200px"` so
   *  the next page starts fetching before the user actually hits the
   *  end (smoother perceived scroll). */
  rootMargin?: string;
  /** Optional noun for the terminal line ("96 results"). */
  noun?: string;
  nounPlural?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  keyboardFallback: false,
  rootMargin: "200px",
  noun: undefined,
  nounPlural: undefined,
});

const emit = defineEmits<{
  load: [];
}>();

const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;
const isTerminal = computed(() => props.loaded >= props.total && props.total > 0);

function maybeFire(entries: IntersectionObserverEntry[]) {
  if (props.loading || isTerminal.value) return;
  if (entries.some((e) => e.isIntersecting)) {
    emit("load");
  }
}

onMounted(() => {
  if (!sentinel.value || typeof IntersectionObserver === "undefined") return;
  observer = new IntersectionObserver(maybeFire, { rootMargin: props.rootMargin });
  observer.observe(sentinel.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

// Detect `prefers-reduced-motion` so users with reduced-motion settings
// get an explicit button instead of auto-fetched content (autoload
// reads as "the page keeps moving on me," which violates the spirit
// of reduced-motion).
const prefersReduced = ref(false);
onMounted(() => {
  if (typeof window !== "undefined" && window.matchMedia) {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReduced.value = mql.matches;
    mql.addEventListener?.("change", (e) => { prefersReduced.value = e.matches; });
  }
});

const showFallback = computed(() =>
  (props.keyboardFallback || prefersReduced.value) && !isTerminal.value
);
</script>

<template>
  <div class="tux-infinite-scroll">
    <button
      v-if="showFallback"
      type="button"
      class="tux-infinite-scroll__btn"
      :disabled="loading"
      @click="$emit('load')"
    >
      <UIcon
        v-if="loading"
        name="lucide:loader-2"
        class="tux-infinite-scroll__spinner"
        aria-hidden="true"
      />
      <span>{{ loading ? 'Loading…' : 'Load more' }}</span>
    </button>
    <div v-else-if="loading" class="tux-infinite-scroll__loading">
      <UIcon name="lucide:loader-2" class="tux-infinite-scroll__spinner" aria-hidden="true" />
      <span>Loading…</span>
    </div>
    <div v-else-if="isTerminal" class="tux-infinite-scroll__terminal">
      <span class="tux-infinite-scroll__rule" aria-hidden="true" />
      <span class="tux-infinite-scroll__terminal-text">
        End of list · {{ total.toLocaleString() }}<template v-if="noun"> {{ nounPlural ?? noun + 's' }}</template>
      </span>
      <span class="tux-infinite-scroll__rule" aria-hidden="true" />
    </div>
    <div
      ref="sentinel"
      class="tux-infinite-scroll__sentinel"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.tux-infinite-scroll {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 0;
  position: relative;
}
.tux-infinite-scroll__sentinel {
  width: 1px;
  height: 1px;
  position: absolute;
  bottom: 0;
}
.tux-infinite-scroll__loading,
.tux-infinite-scroll__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
}
.tux-infinite-scroll__btn {
  padding: 0.625rem 1.25rem;
  font-family: var(--font-bold);
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
.tux-infinite-scroll__btn:hover {
  background: var(--brand-primary);
  color: var(--text-inverse, #fff);
}
.tux-infinite-scroll__btn:disabled {
  cursor: progress;
  opacity: 0.7;
}
.tux-infinite-scroll__spinner {
  width: 1rem;
  height: 1rem;
  animation: tux-infinite-scroll-spin 800ms linear infinite;
}
@keyframes tux-infinite-scroll-spin {
  to { transform: rotate(360deg); }
}
.tux-infinite-scroll__terminal {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  max-width: 32rem;
}
.tux-infinite-scroll__rule {
  flex: 1;
  height: 1px;
  background: var(--surface-border);
}
.tux-infinite-scroll__terminal-text {
  font-family: var(--font-bold);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  color: var(--text-muted);
}
</style>
