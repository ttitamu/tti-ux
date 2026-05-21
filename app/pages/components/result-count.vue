<script setup lang="ts">
useHead({ title: "TuxResultCount · TUX" });

const page = ref(2);
const pageSize = ref(24);
const total = 412;

const emptyVue = `<tux-result-count :page="1" :page-size="24" :total="0" noun="corridor" />`;
const basicVue = `<tux-result-count
  v-model:page="page"
  v-model:page-size="pageSize"
  :total="412"
  noun="corridor"
  :page-size-options="[24, 48, 96]"
/>`;
const irregularVue = `<tux-result-count
  v-model:page="page"
  v-model:page-size="pageSize"
  :total="208"
  noun="study"
  noun-plural="studies"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · pagination" title="TuxResultCount">
      The status strip that sits above (or below) a list of results.
      "Showing 1–24 of 412 corridors · 24 per page." Composes the
      range readout, total count with optional noun, and an optional
      page-size picker. Pairs with <code>TuxPagination</code>,
      <code>TuxLoadMore</code>, or <code>TuxInfiniteScroll</code> —
      the readout is a derived display, not a control.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · with size picker</p>
      <h2 class="heading--bold text-xl font-bold">Above a corridor table</h2>
      <TuxExample class="mt-4" :vue="basicVue">
        <TuxResultCount
          v-model:page="page"
          v-model:page-size="pageSize"
          :total="total"
          noun="corridor"
          :page-size-options="[24, 48, 96]"
        />
      </TuxExample>
      <p class="mt-3 text-xs text-text-muted">
        Try the picker — the demo's bound state updates above.
        Active page: <strong>{{ page }}</strong> · page size: <strong>{{ pageSize }}</strong>
      </p>
    </section>

    <section>
      <p class="eyebrow">irregular plural</p>
      <h2 class="heading--bold text-xl font-bold">Studies / observations</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>nounPlural</code> when naive <code>+s</code> reads
        wrong ("studys", "observations" / "observation"). Singular form
        is used automatically when total is exactly 1.
      </p>
      <TuxExample class="mt-4" :vue="irregularVue">
        <TuxResultCount
          :page="1"
          :page-size="24"
          :total="208"
          noun="study"
          noun-plural="studies"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">empty state</p>
      <h2 class="heading--bold text-xl font-bold">Zero results</h2>
      <TuxExample class="mt-4" :vue="emptyVue">
        <TuxResultCount :page="1" :page-size="24" :total="0" noun="corridor" />
      </TuxExample>
    </section>
  </div>
</template>
