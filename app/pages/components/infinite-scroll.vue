<script setup lang="ts">
useHead({ title: "TuxInfiniteScroll · TUX" });

const loaded = ref(12);
const total = 60;
const loading = ref(false);

function loadMore() {
  if (loading.value) return;
  loading.value = true;
  setTimeout(() => {
    loaded.value = Math.min(loaded.value + 12, total);
    loading.value = false;
  }, 700);
}

const items = computed(() =>
  Array.from({ length: loaded.value }, (_, i) => ({
    id: i + 1,
    title: `Item ${(i + 1).toString().padStart(2, '0')}`,
    blurb: "An entry in a scrollable feed. Real surfaces would render actual content here.",
  }))
);

const basicVue = `<tux-infinite-scroll
  :loaded="items.length"
  :total="412"
  :loading="fetching"
  @load="fetchNext"
/>`;

const fallbackVue = `<tux-infinite-scroll
  :loaded="items.length"
  :total="412"
  :loading="fetching"
  keyboard-fallback
  @load="fetchNext"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · pagination" title="TuxInfiniteScroll">
      Sentinel-driven auto-load via <code>IntersectionObserver</code>.
      The aggressive end of pagination — use for feeds (news,
      conversation history, image galleries) where the user is in a
      scanning rhythm. Three real trade-offs vs <code>TuxLoadMore</code>
      (SEO, footer visibility, keyboard nav) — see the JSDoc.
      <br><br>
      <span class="text-sm text-text-muted">
        Honors <code>prefers-reduced-motion</code> automatically — for
        users with reduced-motion, the component renders an explicit
        button instead of auto-fetching. <code>keyboardFallback</code>
        forces the button on for any surface where keyboard
        reachability matters.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · live demo</p>
      <h2 class="heading--bold text-xl font-bold">Scroll to load more</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Scroll the demo below — when the sentinel enters the viewport,
        the component auto-fetches 12 more items. After 60 items, the
        terminal state appears.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <div class="infinite-demo">
          <div
            v-for="item in items"
            :key="item.id"
            class="infinite-demo__item"
          >
            <p class="font-mono text-xs text-text-muted">#{{ item.id.toString().padStart(2, '0') }}</p>
            <p class="font-bold">{{ item.title }}</p>
            <p class="text-sm text-text-secondary">{{ item.blurb }}</p>
          </div>
          <TuxInfiniteScroll
            :loaded="loaded"
            :total="total"
            :loading="loading"
            noun="item"
            @load="loadMore"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">accessibility · keyboard fallback</p>
      <h2 class="heading--bold text-xl font-bold">Explicit button mode</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>keyboardFallback</code> when keyboard reachability
        matters (forms, documents, admin surfaces). The component
        renders a "Load more" button instead of an observer-only
        sentinel, so keyboard users can advance the list with Enter.
      </p>
      <TuxExample class="mt-4" :vue="fallbackVue">
        <TuxInfiniteScroll
          :loaded="24"
          :total="96"
          keyboard-fallback
          noun="report"
        />
      </TuxExample>
    </section>
  </div>
</template>

<style scoped>
.infinite-demo {
  max-height: 24rem;
  overflow-y: auto;
  padding: 0.75rem;
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md, 0.375rem);
}
.infinite-demo__item {
  padding: 0.625rem 0;
  border-bottom: 1px solid var(--surface-border);
}
.infinite-demo__item:last-of-type {
  border-bottom: none;
}
</style>
