<script setup lang="ts">
useHead({ title: "TuxSplitPane · TUX" });

const records = [
  { id: "r-1", title: "I-35 corridor study · 2024-Q2", agency: "TxDOT", status: "active" },
  { id: "r-2", title: "Rural broadband + safety overlay", agency: "FHWA",  status: "active" },
  { id: "r-3", title: "Houston freight network resilience", agency: "Port Houston", status: "review" },
  { id: "r-4", title: "Connected vehicle pilot — DFW",     agency: "USDOT", status: "draft" },
  { id: "r-5", title: "Workforce mobility study",          agency: "TTI internal", status: "review" },
  { id: "r-6", title: "Border crossing throughput",        agency: "GSA",    status: "active" },
];

const selected = ref<string | null>("r-1");
const selectedRecord = computed(() => records.find((r) => r.id === selected.value) || null);
const showBottom = ref(true);

const basicVue = `<tux-split-pane
  v-model="selected"
  id="landscape-records"
>
  <template #list>
    <ul>
      <li v-for="r in records" :key="r.id">
        <a @click="selected = r.id">{{ r.title }}</a>
      </li>
    </ul>
  </template>
  <template #detail>
    <h2>{{ selectedRecord?.title }}</h2>
    <p>Detail content…</p>
  </template>
</tux-split-pane>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · layout" title="TuxSplitPane">
      In-page master-detail layout. Resizable list pane (persistent
      via localStorage when an <code>id</code> is set) + detail pane
      that reads selection from the consumer (URL-bound, Pinia store,
      or a simple ref). Optional bottom pane for related content
      (history / comments / linked records). Source: Microsoft Fabric
      "Multiview" absorption.
      <br><br>
      <span class="text-sm text-text-muted">
        Drag the handle to resize, double-click to collapse, sliver
        click to expand. Below tablet width the layout folds into a
        single column (list above, detail below).
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic · master-detail</p>
      <h2 class="heading--bold text-xl font-bold">Records browser</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Selecting a row in the list pane updates the detail pane.
        In a real consumer surface, the row click would set a URL
        param (Vue Router <code>push({ query: { id } })</code>) and
        the detail slot would read from <code>useRoute()</code>.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <div class="h-[420px] rounded-md border border-surface-border overflow-hidden">
          <TuxSplitPane
            id="showcase-records"
            v-model="selected"
            :show-bottom="showBottom"
          >
            <template #list>
              <ul class="m-0 p-0 list-none">
                <li
                  v-for="r in records"
                  :key="r.id"
                >
                  <button
                    type="button"
                    class="w-full text-left px-3 py-2 border-b border-surface-border hover:bg-surface-sunken"
                    :class="selected === r.id ? 'bg-surface-sunken' : ''"
                    @click="selected = r.id"
                  >
                    <p class="text-sm font-semibold">{{ r.title }}</p>
                    <p class="text-xs text-text-muted">{{ r.agency }} · {{ r.status }}</p>
                  </button>
                </li>
              </ul>
            </template>
            <template #detail>
              <div v-if="selectedRecord">
                <p class="eyebrow">record · {{ selectedRecord.id }}</p>
                <h3 class="heading--bold text-lg font-bold">{{ selectedRecord.title }}</h3>
                <p class="mt-3 text-sm text-text-secondary">
                  Lead agency: <strong>{{ selectedRecord.agency }}</strong>. Status:
                  <TuxBadge :tone="selectedRecord.status === 'active' ? 'success' : selectedRecord.status === 'review' ? 'warning' : 'muted'">
                    {{ selectedRecord.status }}
                  </TuxBadge>
                </p>
                <p class="mt-3 text-sm text-text-secondary">
                  In a real Landscape surface, this slot would render
                  the record's full detail — methodology, dataset,
                  findings, downloadable artifacts.
                </p>
              </div>
            </template>
            <template #bottom>
              <p class="eyebrow">related</p>
              <p class="text-sm text-text-muted">
                Bottom pane is opt-in via <code>show-bottom</code>. Hosts
                a UTabs strip with History / Comments / Linked
                records.
              </p>
            </template>
          </TuxSplitPane>
        </div>
        <div class="mt-3 flex items-center gap-3">
          <UCheckbox v-model="showBottom" label="Show bottom pane" />
          <UButton variant="ghost" size="sm" @click="selected = null">Clear selection</UButton>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">empty state</p>
      <h2 class="heading--bold text-xl font-bold">Nothing selected</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        When <code>modelValue</code> is null, the detail pane renders
        the <code>#empty</code> slot — defaulting to a friendly
        <code>TuxEmptyState</code> if you don't override it.
      </p>
    </section>
  </div>
</template>
