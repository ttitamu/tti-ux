<script setup lang="ts">
useHead({ title: "TuxRichDataGrid · TUX" });

interface Project {
  id: string;
  name: string;
  district: string;
  lead: string;
  status: "Active" | "Hold" | "Risk" | "Closed";
  delay: number;
  freight: number;
  lastUpdate: string;
  phase: string;
  budget: number;
  scope: string;
  // Index signature so Project satisfies TuxRichDataGrid's
  // `Record<string, unknown>[]` row-data prop type.
  [key: string]: unknown;
}

const PROJECTS: Project[] = [
  { id: "PRJ-2841", name: "I-35 Capital Express",     district: "Austin",      lead: "L. Whitfield",  status: "Active", delay: 18.4, freight: 23.6, lastUpdate: "2025-10-14", phase: "Construction", budget: 482.0, scope: "Adds two managed lanes Williamson → Hays. Tolling per FasTrak §4.2." },
  { id: "PRJ-2842", name: "US-290 East Reliever",     district: "Houston",     lead: "C. Okafor",     status: "Active", delay: 12.1, freight: 31.4, lastUpdate: "2025-10-22", phase: "Design 60%",   budget: 218.5, scope: "Frontage rebuild + reversible HOV between Beltway 8 and SH-6." },
  { id: "PRJ-2843", name: "SH-130 Rural ITS",         district: "San Antonio", lead: "M. Reyes",      status: "Hold",   delay: 4.2,  freight: 9.8,  lastUpdate: "2025-09-29", phase: "Scoping",      budget: 36.2,  scope: "Travel-time signage and weather-responsive limits, MM 412–436." },
  { id: "PRJ-2844", name: "I-10 Border Freight",      district: "El Paso",     lead: "J. Aguirre",    status: "Active", delay: 21.0, freight: 48.2, lastUpdate: "2025-10-31", phase: "Construction", budget: 644.8, scope: "Truck-only lanes BridgePort to Cesar Chavez. Coord w/ Mexico SCT." },
  { id: "PRJ-2845", name: "Loop 1604 Reconstruction", district: "San Antonio", lead: "P. Choudhury",  status: "Active", delay: 9.3,  freight: 14.0, lastUpdate: "2025-10-18", phase: "Design 90%",   budget: 312.4, scope: "Six-lane mainlane build NW quadrant w/ diverging-diamond at Bandera." },
  { id: "PRJ-2846", name: "FM-1488 Rural Realign",    district: "Houston",     lead: "S. Patel",      status: "Closed", delay: 0.0,  freight: 5.1,  lastUpdate: "2025-08-04", phase: "Closeout",     budget: 41.7,  scope: "Two-lane realign w/ wildlife crossings; closed under final acceptance." },
  { id: "PRJ-2847", name: "I-45 Central Sustained",   district: "Houston",     lead: "T. Nguyen",     status: "Risk",   delay: 28.7, freight: 19.9, lastUpdate: "2025-10-29", phase: "Construction", budget: 1280.0, scope: "Stack reconstruction; ROW acquisition lagging 14% behind plan." },
  { id: "PRJ-2848", name: "US-59 Lufkin Bypass",      district: "Atlanta",     lead: "K. Boyd",       status: "Active", delay: 6.8,  freight: 11.2, lastUpdate: "2025-10-20", phase: "Design 30%",   budget: 154.1, scope: "Four-lane divided bypass NE of Lufkin; environmental clearance underway." },
];

const columns = [
  { key: "name",     label: "Project",      width: "16rem", sortable: true },
  { key: "district", label: "District",     width: "8rem",  sortable: true },
  { key: "lead",     label: "Lead",         width: "9rem",  sortable: true },
  { key: "status",   label: "Status",       width: "7rem",  sortable: true },
  { key: "delay",    label: "Delay (min)",  width: "7rem",  sortable: true, numeric: true, decimals: 1 },
  { key: "freight",  label: "Freight %",    width: "6rem",  sortable: true, numeric: true, decimals: 1 },
  { key: "budget",   label: "Budget ($M)",  width: "8rem",  sortable: true, numeric: true, decimals: 1 },
];

const sortKey = ref("delay");
const sortDir = ref<"asc" | "desc">("desc");
const selected = ref<(string | number)[]>(["PRJ-2841", "PRJ-2847"]);
const expanded = ref<(string | number)[]>(["PRJ-2847"]);
const filters = ref([
  { label: "District", value: "Houston, Austin, San Antonio" },
  { label: "Status",   value: "Active or Risk" },
]);

const sortedRows = computed(() => {
  const rows = [...PROJECTS];
  rows.sort((a, b) => {
    const av = (a as Record<string, unknown>)[sortKey.value];
    const bv = (b as Record<string, unknown>)[sortKey.value];
    let cmp = 0;
    if (typeof av === "number" && typeof bv === "number") {
      cmp = av - bv;
    } else {
      cmp = String(av).localeCompare(String(bv));
    }
    return sortDir.value === "asc" ? cmp : -cmp;
  });
  return rows;
});

const STATUS_TONE: Record<Project["status"], string> = {
  Active: "var(--color-success, oklch(0.55 0.13 145))",
  Hold:   "var(--brand-accent)",
  Risk:   "var(--color-error, oklch(0.55 0.18 25))",
  Closed: "var(--text-muted)",
};

const paginationTokens = [
  { label: "‹", value: "prev", disabled: true },
  { label: "1", value: 1, current: true },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "…", value: "gap", disabled: true },
  { label: "23", value: 23 },
  { label: "›", value: "next" },
];

const compactColumns = [
  { key: "name",   label: "Project", width: "14rem" },
  { key: "status", label: "Status",  width: "6rem" },
  { key: "delay",  label: "Delay",   width: "5rem", numeric: true, decimals: 1, unit: " min" },
  { key: "budget", label: "Budget",  width: "6rem", numeric: true, decimals: 0, unit: "M" },
];
const compactRows = PROJECTS.slice(0, 5);

const richVue = `<TuxRichDataGrid
  title="Active corridor projects"
  meta="FY 2025 · 8 of 184 · last sync 14 min ago"
  :columns="columns"
  :rows="sortedRows"
  :filters="filters"
  v-model:selected="selected"
  v-model:expanded="expanded"
  v-model:sort-key="sortKey"
  v-model:sort-dir="sortDir"
  pagination-label="Showing 1–8 of 184 projects"
  :pagination-tokens="paginationTokens"
>
  <template #cell-status="{ row }">
    <span class="rdg-status" :data-tone="row.status">
      <span class="rdg-status-dot" />
      {{ row.status }}
    </span>
  </template>

  <template #expanded="{ row }">
    <div class="rdg-expanded">
      <p class="eyebrow">Scope · {{ row.id }}</p>
      <p>{{ row.scope }}</p>
    </div>
  </template>
</TuxRichDataGrid>`;

const compactVue = `<TuxRichDataGrid
  title="Top corridors by delay"
  :columns="compactColumns"
  :rows="compactRows"
  density="compact"
  selection-disabled
  expansion-disabled
  :show-search="false"
  :show-filter="false"
  :show-columns="false"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader
      eyebrow="data · interactive grid"
      title="TuxRichDataGrid"
    >
      Interactive data grid for operational and research-dashboard
      surfaces — PECAN-class apps where the reader needs to
      <em>act</em> on rows, not just read them. Anatomy adapted from
      Ant Design Table and Microsoft Fabric Rich-data-grid; identity
      stays TUX (Work Sans / JetBrains Mono, maroon focus, warm-
      neutral surfaces, tabular figures throughout).
      <br><br>
      <span class="text-sm text-text-muted">
        State is host-driven — selection, expansion, sort, filters,
        and pagination are all v-model bindings or events. The
        component renders; it doesn't own the data. For static
        editorial tables (numbered captions, footnotes, source
        line), use <code>TuxDataTable</code>. For the thin UTable
        wrap, use <code>TuxTable</code>.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · operational dashboard</p>
      <h2 class="heading--bold text-xl font-bold">Full interactive grid</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Sticky header, row selection, expandable detail panels,
        sortable columns, active-filter chips, and a bulk-action
        bar that surfaces when ≥1 row is selected. Click the
        chevron to expand a row; click headers to sort.
      </p>
      <TuxExample class="mt-4" :vue="richVue">
        <TuxRichDataGrid
          title="Active corridor projects"
          meta="FY 2025 · 8 of 184 · last sync 14 min ago"
          :columns="columns"
          :rows="sortedRows"
          :filters="filters"
          v-model:selected="selected"
          v-model:expanded="expanded"
          v-model:sort-key="sortKey"
          v-model:sort-dir="sortDir"
          pagination-label="Showing 1–8 of 184 projects"
          :pagination-tokens="paginationTokens"
          @filter-remove="filters.splice($event, 1)"
          @filter-clear="filters = []"
        >
          <template #cell-name="{ row }">
            <div class="rdg-demo__name">{{ (row as Project).name }}</div>
            <div class="rdg-demo__id">{{ (row as Project).id }} · {{ (row as Project).phase }}</div>
          </template>

          <template #cell-status="{ row }">
            <span
              class="rdg-demo__status"
              :style="{ color: STATUS_TONE[(row as Project).status] }"
            >
              <span
                class="rdg-demo__status-dot"
                :style="{ background: STATUS_TONE[(row as Project).status] }"
              />
              {{ (row as Project).status }}
            </span>
          </template>

          <template #cell-delay="{ row }">
            <span
              :class="{
                'rdg-demo__delay': true,
                'rdg-demo__delay--critical': (row as Project).delay > 20,
                'rdg-demo__delay--warning': (row as Project).delay > 12 && (row as Project).delay <= 20,
              }"
            >
              {{ (row as Project).delay.toFixed(1) }}
            </span>
          </template>

          <template #expanded="{ row }">
            <div class="rdg-demo__expanded">
              <div>
                <p class="eyebrow">Scope · {{ (row as Project).id }}</p>
                <p>{{ (row as Project).scope }}</p>
              </div>
              <div>
                <p class="eyebrow">Last update</p>
                <p class="rdg-demo__mono">{{ (row as Project).lastUpdate }}</p>
              </div>
            </div>
          </template>
        </TuxRichDataGrid>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">embedded · dashboard tile</p>
      <h2 class="heading--bold text-xl font-bold">Compact variant</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Disable selection, expansion, and the search/filter trio
        for a denser surface that lives inside a dashboard tile or
        side rail. Density set to <code>compact</code> for tighter
        row rhythm.
      </p>
      <TuxExample class="mt-4" :vue="compactVue">
        <TuxRichDataGrid
          title="Top corridors by delay"
          :columns="compactColumns"
          :rows="compactRows"
          density="compact"
          selection-disabled
          expansion-disabled
          :show-search="false"
          :show-filter="false"
          :show-columns="false"
        >
          <template #cell-status="{ row }">
            <span
              class="rdg-demo__status"
              :style="{ color: STATUS_TONE[(row as Project).status] }"
            >
              <span
                class="rdg-demo__status-dot"
                :style="{ background: STATUS_TONE[(row as Project).status] }"
              />
              {{ (row as Project).status }}
            </span>
          </template>
        </TuxRichDataGrid>
      </TuxExample>
    </section>
  </div>
</template>

<style scoped>
.rdg-demo__name {
  font-family: var(--font-bold);
  font-weight: 600;
  font-size: 0.86rem;
  color: var(--text-primary);
}
.rdg-demo__id {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 500;
  margin-top: 0.125rem;
}
.rdg-demo__status {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-bold);
  font-weight: 600;
  font-size: 0.8rem;
}
.rdg-demo__status-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
}
.rdg-demo__delay {
  font-weight: 500;
}
.rdg-demo__delay--critical {
  color: var(--color-error, oklch(0.55 0.18 25));
  font-weight: 700;
}
.rdg-demo__delay--warning {
  color: var(--brand-accent);
  font-weight: 600;
}
.rdg-demo__expanded {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 12.5rem;
  gap: 2rem;
}
.rdg-demo__mono {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--text-primary);
}
@container (max-width: 38rem) {
  .rdg-demo__expanded {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}
</style>
