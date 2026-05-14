<script setup lang="ts">
useHead({ title: "TuxDataTable · TUX" });

// ── Variant 1: sortable research table with uncertainty + footnotes ──
const sortableColumns = [
  { key: "dist",  label: "District",                width: "10rem", sortable: true },
  { key: "vmt",   label: "VMT (B mi)",              sortable: true, numeric: true, decimals: 1 },
  { key: "fr",    label: "Fatal+SI rate (per HMVMT)", sortable: true, numeric: true, decimals: 2, ciKey: "ci" },
  { key: "ksi",   label: "K + A count",             sortable: true, numeric: true },
  { key: "n",     label: "Total crashes (n)",       sortable: true, numeric: true },
];

interface DistrictRow {
  dist: string;
  vmt: number;
  fr: number;
  ci: number;
  ksi: number;
  n: number;
  fn?: number;
  // Index signature so DistrictRow satisfies TuxDataTable's
  // `Record<string, unknown>[]` row-data prop type.
  [key: string]: unknown;
}

const districtData: DistrictRow[] = [
  { dist: "Atlanta",        vmt: 14.3, fr: 1.42, ci: 0.18, ksi: 312,  n: 2840, fn: 1 },
  { dist: "Austin",         vmt: 28.7, fr: 1.08, ci: 0.11, ksi: 521,  n: 4830 },
  { dist: "Beaumont",       vmt: 9.6,  fr: 1.61, ci: 0.22, ksi: 198,  n: 1920 },
  { dist: "Brownwood",      vmt: 5.2,  fr: 1.78, ci: 0.31, ksi: 124,  n: 1140 },
  { dist: "Bryan",          vmt: 7.4,  fr: 1.34, ci: 0.24, ksi: 156,  n: 1560 },
  { dist: "Childress",      vmt: 2.1,  fr: 1.92, ci: 0.45, ksi: 58,   n: 480, fn: 2 },
  { dist: "Corpus Christi", vmt: 12.8, fr: 1.27, ci: 0.19, ksi: 247,  n: 2680 },
  { dist: "Dallas",         vmt: 47.2, fr: 0.94, ci: 0.08, ksi: 712,  n: 7420 },
  { dist: "El Paso",        vmt: 11.4, fr: 1.18, ci: 0.21, ksi: 218,  n: 2230 },
  { dist: "Fort Worth",     vmt: 38.6, fr: 1.02, ci: 0.10, ksi: 614,  n: 6180 },
  { dist: "Houston",        vmt: 62.4, fr: 0.88, ci: 0.07, ksi: 891,  n: 9240 },
  { dist: "Lubbock",        vmt: 6.8,  fr: 1.45, ci: 0.27, ksi: 142,  n: 1380 },
  { dist: "San Antonio",    vmt: 32.1, fr: 1.04, ci: 0.10, ksi: 558,  n: 5210 },
  { dist: "Tyler",          vmt: 8.9,  fr: 1.51, ci: 0.23, ksi: 187,  n: 1820 },
];

const sortableColumnsWithFn = sortableColumns.map(c =>
  c.key === "dist" ? { ...c, footnoteKey: "fn" } : c,
);

const sortKey = ref("dist");
const sortDir = ref<"asc" | "desc">("asc");

const sortedDistricts = computed(() => {
  const rows = [...districtData];
  rows.sort((a, b) => {
    const av = (a as Record<string, unknown>)[sortKey.value];
    const bv = (b as Record<string, unknown>)[sortKey.value];
    let cmp = 0;
    if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
    else cmp = String(av).localeCompare(String(bv));
    return sortDir.value === "asc" ? cmp : -cmp;
  });
  return rows;
});

const totalsRow = {
  label: "Statewide total",
  values: {
    dist: "Statewide total",
    vmt: districtData.reduce((s, r) => s + r.vmt, 0),
    fr: 1.10,
    ci: 0.04,
    ksi: districtData.reduce((s, r) => s + r.ksi, 0),
    n: districtData.reduce((s, r) => s + r.n, 0),
  },
};

const sortableFootnotes = [
  { n: 1, text: "Atlanta district VMT estimate revised in 2023 following the FHWA/HPMS reconciliation." },
  { n: 2, text: "Childress rate based on small sample (n < 500); interpret with care." },
];

// ── Variant 2: grouped (banded by region) ──
const groupedColumns = [
  { key: "project",  label: "Project" },
  { key: "ph",       label: "Phase",      width: "10rem" },
  { key: "cost",     label: "Cost ($M)",  numeric: true, decimals: 1, footnoteKey: "fn" },
  { key: "schedule", label: "Schedule",   width: "12rem" },
];
const groups = [
  {
    label: "North",
    rows: [
      { project: "I-35E Lewisville bridge", ph: "Construction", cost: 142.8, schedule: 92 },
      { project: "US-380 widening",         ph: "Design",       cost: 98.4,  schedule: 100 },
      { project: "DFW connector",           ph: "Construction", cost: 1240,  schedule: 78, fn: 3 },
    ],
  },
  {
    label: "Central",
    rows: [
      { project: "MoPac South",              ph: "Letting",      cost: 488,  schedule: 100 },
      { project: "I-35 Cap Express Central", ph: "Construction", cost: 4500, schedule: 84 },
    ],
  },
  {
    label: "Coast",
    rows: [
      { project: "I-45 NHHIP Segment 2",  ph: "On hold", cost: 7400, schedule: 0, fn: 4 },
      { project: "SH-249 toll extension", ph: "Open",    cost: 632,  schedule: 100 },
    ],
  },
];
const groupedFootnotes = [
  { n: 3, text: "DFW connector includes federal INFRA grant of $192M." },
  { n: 4, text: "NHHIP Segment 2 paused pending federal Title VI review (since 2023)." },
];
const PHASE_TONE: Record<string, string> = {
  Construction: "var(--brand-primary)",
  Design:       "var(--text-secondary)",
  Letting:      "var(--brand-accent)",
  Open:         "var(--color-success, oklch(0.55 0.13 145))",
  "On hold":    "var(--color-error, oklch(0.55 0.18 25))",
};

// ── Variant 3: sticky-header dense ──
interface SegmentRow {
  seg: string;
  from: number;
  to: number;
  pci: number;
  iri: number;
  rut: number;
  year: number;
  [key: string]: unknown;
}
const denseRows: SegmentRow[] = (() => {
  const segs: SegmentRow[] = [];
  let seed = 1234;
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 1; i <= 18; i++) {
    segs.push({
      seg: `I-35 N-${String(i).padStart(2, "0")}`,
      from: 220 + i * 4,
      to: 224 + i * 4,
      pci: Math.round(45 + rng() * 50),
      iri: Math.round(60 + rng() * 80),
      rut: Number((rng() * 0.6).toFixed(2)),
      year: 2017 + Math.floor(rng() * 7),
    });
  }
  return segs;
})();
const denseColumns = [
  { key: "seg",  label: "Segment ID" },
  { key: "from", label: "From MP", numeric: true },
  { key: "to",   label: "To MP",   numeric: true },
  { key: "pci",  label: "PCI",     numeric: true },
  { key: "iri",  label: "IRI (in/mi)", numeric: true },
  { key: "rut",  label: "Rut (in)",    numeric: true, decimals: 2 },
  { key: "year", label: "Year built",  numeric: true, thousandsSep: false },
];

// ── Variant 4: comparison (before/after) ──
interface ComparisonRow {
  metric: string;
  before: number;
  after: number;
  pct: number;
  improved: boolean;
  [key: string]: unknown;
}
const comparisonRowsRaw = [
  { metric: "Average daily delay (veh-hr)", before: 18420, after: 11240, lower: true },
  { metric: "Worst-hour speed (mph)",        before: 22.4,  after: 38.7,  lower: false },
  { metric: "Crash rate (per HMVMT)",        before: 1.84,  after: 1.21,  lower: true },
  { metric: "Travel time index (PM peak)",   before: 1.92,  after: 1.41,  lower: true },
];
const comparisonRows: ComparisonRow[] = comparisonRowsRaw.map(r => {
  const pct = ((r.after - r.before) / r.before) * 100;
  return { metric: r.metric, before: r.before, after: r.after, pct, improved: r.lower ? pct < 0 : pct > 0 };
});
const comparisonColumns = [
  { key: "metric", label: "Metric" },
  { key: "before", label: "Before (2018)", numeric: true, decimals: 2 },
  { key: "after",  label: "After (2023)",  numeric: true, decimals: 2 },
  { key: "pct",    label: "Δ",             numeric: true, decimals: 1, unit: "%" },
];

const sortableVue = `<TuxDataTable
  table-number="Table 4-2"
  caption="Fatal & serious-injury rate by TxDOT district, 2019–2023"
  description="Five-year average rate per hundred million vehicle-miles travelled (HMVMT). Confidence intervals are 95%, computed by Poisson exact method."
  :columns="sortableColumnsWithFn"
  :rows="sortedDistricts"
  v-model:sort-key="sortKey"
  v-model:sort-dir="sortDir"
  :totals="totalsRow"
  :footnotes="sortableFootnotes"
  source="Source: TxDOT CRIS, FHWA HPMS · Compiled by TTI Center for Transportation Safety, 2024."
/>`;

function pciClass(value: number): string {
  if (value >= 80) return "pci pci--good";
  if (value >= 60) return "pci pci--fair";
  return "pci pci--poor";
}
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="data · research deliverable" title="TuxDataTable">
      Tables tuned for research-publication output: numbered
      captions over a display-face title, tabular figures with
      uncertainty cells (<code>value ± CI</code>), footnote
      anchors wired to a formal note block, optional row groups
      banded by category, and a source-citation line so the table
      can be lifted directly into a report PDF.
      <br><br>
      <span class="text-sm text-text-muted">
        Sort is host-driven (<code>v-model:sortKey</code> +
        <code>v-model:sortDir</code>). For interactive grids
        (selection, expansion, bulk actions, sticky toolbar) use
        <code>TuxRichDataGrid</code>. For the lightweight
        UTable wrap, use <code>TuxTable</code>.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · sortable · uncertainty + footnotes</p>
      <h2 class="heading--bold text-xl font-bold">Sortable research table</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Click headers to sort; the active column shows a maroon
        arrow. The fatality-rate column auto-renders <code>value ± CI</code>
        when a <code>ciKey</code> is set on the column definition. The
        footnote superscript next to district names links to the formal
        note block under the table.
      </p>
      <TuxExample class="mt-4" :vue="sortableVue">
        <TuxDataTable
          table-number="Table 4-2"
          caption="Fatal & serious-injury rate by TxDOT district, 2019–2023"
          description="Five-year average rate per hundred million vehicle-miles travelled (HMVMT). Confidence intervals are 95%, computed by Poisson exact method."
          :columns="sortableColumnsWithFn"
          :rows="sortedDistricts"
          v-model:sort-key="sortKey"
          v-model:sort-dir="sortDir"
          :totals="totalsRow"
          :footnotes="sortableFootnotes"
          source="Source: TxDOT CRIS, FHWA HPMS · Compiled by TTI Center for Transportation Safety, 2024."
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">grouped · banded by category</p>
      <h2 class="heading--bold text-xl font-bold">Grouped row layout</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Pass <code>groups</code> instead of <code>rows</code>;
        each group renders a maroon-tinted divider above its
        rows. Column slots (<code>#cell-ph</code>,
        <code>#cell-schedule</code>) carry the phase chip and the
        schedule-progress bar without the component knowing about
        either pattern.
      </p>
      <TuxExample class="mt-4">
        <TuxDataTable
          table-number="Table 6-1"
          caption="Major capital projects in flight, by region"
          :columns="groupedColumns"
          :groups="groups"
          :footnotes="groupedFootnotes"
        >
          <template #cell-ph="{ value }">
            <span class="dt-demo__phase" :style="{ color: PHASE_TONE[value as string] }">
              <span class="dt-demo__phase-dot" :style="{ background: PHASE_TONE[value as string] }" />
              {{ value }}
            </span>
          </template>

          <template #cell-cost="{ value, row }">
            <span class="dt-demo__cost">
              {{ (value as number) >= 1000 ? (value as number).toLocaleString() : (value as number).toFixed(1) }}
              <sup v-if="row.fn" class="dt-demo__fn">
                <a :href="`#fn-${row.fn}`">{{ row.fn }}</a>
              </sup>
            </span>
          </template>

          <template #cell-schedule="{ row }">
            <div class="dt-demo__schedule">
              <div class="dt-demo__track">
                <div
                  class="dt-demo__bar"
                  :style="{
                    width: (row.schedule as number) + '%',
                    background: PHASE_TONE[row.ph as string],
                    opacity: (row.schedule as number) === 0 ? 0.3 : 1,
                  }"
                />
              </div>
              <span class="dt-demo__pct">{{ row.schedule }}%</span>
            </div>
          </template>
        </TuxDataTable>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">dense · sticky · appendix-grade</p>
      <h2 class="heading--bold text-xl font-bold">Sticky-header dense table</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        For appendix-grade exhaustive listings — segment inventories,
        station catalogs, asset databases. Header pins during scroll;
        density drops to <code>compact</code> for tighter rhythm.
        PCI cells are color-coded by band (good ≥ 80 green, fair 60–79
        gold, poor &lt; 60 red).
      </p>
      <TuxExample class="mt-4">
        <TuxDataTable
          table-number="Table A-7 (excerpt)"
          caption="Pavement segment inventory · I-35 northbound, MP 220–296"
          :columns="denseColumns"
          :rows="denseRows"
          density="compact"
          sticky
          max-height="20rem"
        >
          <template #cell-pci="{ value }">
            <span :class="pciClass(value as number)">{{ value }}</span>
          </template>

          <template #note>
            Showing 18 of 312 segments · Header sticks during scroll · Color encodes PCI band (good ≥ 80, fair 60–79, poor &lt; 60)
          </template>
        </TuxDataTable>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">comparison · before / after</p>
      <h2 class="heading--bold text-xl font-bold">Two-period comparison</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        For pilot studies and impact reports — two value columns
        plus a delta column. The improvement direction is encoded
        by color (green for the right way, red for the wrong way),
        and the convention is local to the metric: lower is good
        for delay, higher is good for speed.
      </p>
      <TuxExample class="mt-4">
        <TuxDataTable
          table-number="Table 8-3"
          caption="Operational results · I-635 LBJ Express · before vs. after"
          :columns="comparisonColumns"
          :rows="comparisonRows"
          :banded="false"
        >
          <template #cell-pct="{ row }">
            <span :class="(row as ComparisonRow).improved ? 'dt-demo__delta-good' : 'dt-demo__delta-bad'">
              {{ (row as ComparisonRow).pct > 0 ? "+" : "" }}{{ (row as ComparisonRow).pct.toFixed(1) }}%
            </span>
          </template>
        </TuxDataTable>
      </TuxExample>
    </section>
  </div>
</template>

<style scoped>
.dt-demo__phase {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-bold);
  font-weight: 600;
  font-size: 0.78rem;
}
.dt-demo__phase-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
}

.dt-demo__cost {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
.dt-demo__fn {
  margin-left: 0.125rem;
}
.dt-demo__fn a {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  color: var(--brand-primary);
  text-decoration: none;
}
.dt-demo__fn a:hover { text-decoration: underline; }

.dt-demo__schedule {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.dt-demo__track {
  flex: 1;
  height: 0.375rem;
  background: var(--surface-sunken);
  border-radius: 3px;
  overflow: hidden;
  max-width: 8.75rem;
}
.dt-demo__bar {
  height: 100%;
  transition: width 240ms cubic-bezier(0.2, 0, 0, 1);
}
.dt-demo__pct {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.72rem;
  color: var(--text-muted);
  min-width: 2.25rem;
  text-align: right;
}

.pci { font-weight: 700; }
.pci--good { color: var(--color-success, oklch(0.55 0.13 145)); }
.pci--fair { color: var(--brand-accent); }
.pci--poor { color: var(--color-error, oklch(0.55 0.18 25)); }

.dt-demo__delta-good {
  color: var(--color-success, oklch(0.55 0.13 145));
  font-weight: 700;
}
.dt-demo__delta-bad {
  color: var(--color-error, oklch(0.55 0.18 25));
  font-weight: 700;
}
</style>
