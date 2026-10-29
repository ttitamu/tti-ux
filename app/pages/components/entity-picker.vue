<script setup lang="ts">
import type { EntityOption } from "~/components/TuxEntityPicker.vue";

useHead({ title: "TuxEntityPicker · TUX" });

const studyCorridors: EntityOption[] = [
  {
    id: "cor-ih35",
    code: "CSJ-0015-13",
    label: "I-35 Central Austin Managed Lanes",
    subtitle: "Travis County · Milepoints 230.2–241.8",
    owner: "Dr. M. Chen",
    status: "active",
    metaLabel: "42 detectors",
  },
  {
    id: "cor-us290",
    code: "CSJ-0114-02",
    label: "US-290 Freight Signal Priority Study",
    subtitle: "Waller & Harris Counties · 18 intersections",
    owner: "A. Alvarez",
    status: "expiring",
    metaLabel: "Ends 2026-06-30",
  },
  {
    id: "cor-sh6",
    code: "CSJ-0049-12",
    label: "SH-6 Connected Work-Zone Telemetry Archive",
    subtitle: "Brazos County · Field phase completed",
    owner: "R. Patel",
    status: "closed",
    metaLabel: "Archived FY25",
  },
  {
    id: "cor-ih10",
    code: "CSJ-0271-07",
    label: "I-10 Heavy-Vehicle Platooning Corridor",
    subtitle: "Seguin to Columbus · Weigh-in-motion array",
    owner: "Dr. K. Brooks",
    status: "active",
    metaLabel: "19 stations",
  },
];

const selectedId = ref<string | null>("cor-ih35");
const emptySelectionId = ref<string | null>(null);
const lastSearchQuery = ref("");

function onSearch(q: string) {
  lastSearchQuery.value = q;
}

const flagshipVue = `<tux-entity-picker
  v-model="selectedId"
  label="Target Research Corridor"
  :options="studyCorridors"
  @search="onSearch"
/>`;

const emptyVue = `<tux-entity-picker
  v-model="emptySelectionId"
  label="Calibration Field Study"
  placeholder="Filter by CSJ code, corridor title, or principal investigator…"
  :options="studyCorridors"
/>`;

const typesTs = `export interface EntityOption {
  id: string;
  code?: string;
  label: string;
  subtitle?: string;
  owner?: string;
  status?: "active" | "expiring" | "closed";
  metaLabel?: string;
  disabled?: boolean;
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · rich entity combobox" title="TuxEntityPicker">
      Accessible ARIA 1.2 combobox and multi-line listbox for selecting structured
      institutional records — research projects, highway corridors, calibration
      studies, or sensor stations. Closed or disabled records remain visible in
      context with <code>aria-disabled="true"</code> so operators see why an entry
      cannot be assigned.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · pre-selected record with status context</p>
      <h2 class="heading--bold text-xl font-bold">Research corridor assignment</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Type to filter across <code>code</code>, <code>label</code>,
        <code>subtitle</code>, and <code>owner</code>, or use
        <code>ArrowDown</code>, <code>ArrowUp</code>, <code>Enter</code>, and
        <code>Escape</code>. Try clicking or pressing <code>Enter</code> on the
        <code>Closed</code> SH-6 archive to verify non-selectable context preservation.
      </p>
      <TuxExample class="mt-4" :vue="flagshipVue">
        <div class="max-w-xl">
          <TuxEntityPicker
            v-model="selectedId"
            label="Target Research Corridor"
            :options="studyCorridors"
            @search="onSearch"
          />
        </div>
      </TuxExample>
      <div class="mt-3 text-xs text-text-muted font-mono max-w-xl">
        selectedId: <code>{{ selectedId ?? "null" }}</code>
        <span v-if="lastSearchQuery"> · last @search: <code>"{{ lastSearchQuery }}"</code></span>
      </div>
    </section>

    <section>
      <p class="eyebrow">unselected state · search from scratch</p>
      <h2 class="heading--bold text-xl font-bold">Empty initial selection</h2>
      <TuxExample class="mt-4" :vue="emptyVue">
        <div class="max-w-xl">
          <TuxEntityPicker
            v-model="emptySelectionId"
            label="Calibration Field Study"
            placeholder="Filter by CSJ code, corridor title, or principal investigator…"
            :options="studyCorridors"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">EntityOption interface</h2>
      <TuxCodeBlock class="mt-4" :code="typesTs" lang="ts" filename="TuxEntityPicker.ts" />
    </section>
  </div>
</template>
