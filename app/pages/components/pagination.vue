<script setup lang="ts">
useHead({ title: "TuxPagination · TUX" });

const page1 = ref(1);
const page2 = ref(7);
const page3 = ref(1);
const page4 = ref(43);

const exampleVue = `<TuxPagination
  v-model="page"
  :total="412"
  :page-size="20"
  show-status
  noun="result"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxPagination">
      Page-number controls for result lists. Used by PECAN result tables,
      news collections, publication catalogs, any surface where N items
      spread across multiple pages. Native Vue (not UPagination) so the
      visual rhythm — square corners, maroon active page, tabular
      numerals — matches the system exactly.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">PECAN-style results page</h2>
      <p class="text-sm text-text-secondary mb-3">
        With status line. v-model'd to <code>page1</code>, current page
        <strong>{{ page1 }}</strong>.
      </p>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxPagination
          v-model="page1"
          :total="412"
          :page-size="20"
          show-status
          noun="result"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">middle of long range</p>
      <h2 class="heading--bold text-xl font-bold">Ellipsis truncation</h2>
      <p class="text-sm text-text-secondary mb-3">
        When the page count is too long to show every number, the
        component shows the first/last page, ellipses for the gap, and
        sibling pages around the current. Currently on page
        <strong>{{ page2 }}</strong> of 50.
      </p>
      <TuxExample class="mt-4">
        <TuxPagination v-model="page2" :total="1000" :page-size="20" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">small range</p>
      <h2 class="heading--bold text-xl font-bold">All numbers visible</h2>
      <p class="text-sm text-text-secondary mb-3">
        Under ~7 pages, every number shows — no ellipses needed.
      </p>
      <TuxExample class="mt-4">
        <TuxPagination v-model="page3" :total="80" :page-size="20" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">end of range</p>
      <h2 class="heading--bold text-xl font-bold">Last page state</h2>
      <p class="text-sm text-text-secondary mb-3">
        Next button disables on the last page. Currently on
        <strong>{{ page4 }}</strong> of 43.
      </p>
      <TuxExample class="mt-4">
        <TuxPagination v-model="page4" :total="850" :page-size="20" show-status noun="publication" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + events</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>v-model</code> — current page (1-indexed). Required.</li>
        <li><code>total</code> — total items across all pages. Required.</li>
        <li><code>pageSize</code> — items per page. Defaults to <code>20</code>.</li>
        <li><code>siblingCount</code> — pages to show on each side of current. Defaults to <code>1</code>.</li>
        <li><code>boundaryCount</code> — pages always shown at start/end. Defaults to <code>1</code>.</li>
        <li><code>showStatus</code> — show "Showing X–Y of Z" line. Defaults to <code>false</code>.</li>
        <li><code>noun</code> — singular item name for the status line. Defaults to <code>"result"</code>.</li>
      </ul>
    </section>
  </div>
</template>
