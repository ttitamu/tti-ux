<script setup lang="ts">
useHead({ title: "TuxLoadMore · TUX" });

const loaded = ref(24);
const total = 96;
const loading = ref(false);

function loadMore() {
  loading.value = true;
  setTimeout(() => {
    loaded.value = Math.min(loaded.value + 24, total);
    loading.value = false;
  }, 800);
}

const basicVue = `<tux-load-more
  :loaded="items.length"
  :total="412"
  :loading="fetching"
  noun="result"
  @load="fetchNext"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · pagination" title="TuxLoadMore">
      Explicit "Load more" button. The middle ground between numbered
      pagination and infinite scroll — the user decides when to expand
      the list, SEO indexes the next page on click, and there's a
      clear stop point in long feeds. When all items load, the button
      switches to a terminal divider ("All loaded · 96 results").
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · interactive</p>
      <h2 class="heading--bold text-xl font-bold">Live demo</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Click <em>Load more</em> to advance 24 items. The component
        switches to a loading spinner during the fetch, then to a
        terminal divider when <code>loaded &gt;= total</code>.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <div class="space-y-3">
          <div class="text-xs text-text-muted">
            {{ loaded }} items loaded so far…
          </div>
          <TuxLoadMore
            :loaded="loaded"
            :total="total"
            :loading="loading"
            noun="result"
            @load="loadMore"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">terminal state</p>
      <h2 class="heading--bold text-xl font-bold">All loaded</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        When the host has fetched everything, the button is replaced
        with a horizontal-rule divider so the list has a visual end
        instead of just stopping.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <TuxLoadMore :loaded="96" :total="96" noun="result" />
      </TuxExample>
    </section>
  </div>
</template>
