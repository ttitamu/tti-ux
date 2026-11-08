<script setup lang="ts">
import type { LedgerGroup } from "~/components/TuxLedgerTable.vue";

useHead({ title: "TuxLedgerTable · TUX" });

const pavementBomGroups: LedgerGroup[] = [
  {
    id: "grp-surface",
    code: "ITEM-344",
    label: "Superpave Mixtures & Surface Milling",
    badge: "Mainlanes",
    rows: [
      {
        id: "li-1",
        code: "354-6045",
        label: "Plane Asphalt Concrete Pavement (2 in.)",
        meta: "Full-width cold milling · Station 110+00 to 245+00",
        quantity: 48200,
        unit: "SY",
        rate: 2.85,
        amount: 137370,
      },
      {
        id: "li-2",
        code: "344-6106",
        label: "Superpave Mixtures SP-D PG 76-22",
        meta: "2-inch dense-graded wearing course",
        quantity: 5300,
        unit: "TON",
        rate: 118.5,
        amount: 628050,
      },
    ],
  },
  {
    id: "grp-its",
    code: "ITEM-6000",
    label: "Roadside Sensing & Fiber Telemetry",
    badge: "ITS Corridor",
    rows: [
      {
        id: "li-3",
        code: "618-6046",
        label: "Conduit (PVC) (Sch 80) (2 in.) (Bore)",
        meta: "Directional bore beneath ramp gore",
        quantity: 2400,
        unit: "LF",
        rate: 34.0,
        amount: 81600,
      },
      {
        id: "li-4",
        code: "6064-6001",
        label: "Non-Intrusive Radar Vehicle Detector Assembly",
        meta: "Cabinet interface + mounting bracket",
        quantity: 6,
        unit: "EA",
        rate: 6850,
        amount: 41100,
      },
    ],
  },
  {
    id: "grp-wz",
    code: "ITEM-502",
    label: "Work-Zone Protection & Striping",
    badge: "Safety",
    rows: [
      {
        id: "li-5",
        code: "502-6001",
        label: "Barricades, Signs, and Traffic Handling",
        meta: "Nighttime lane closure operations",
        quantity: 4,
        unit: "MO",
        rate: 9400,
        amount: 37600,
      },
      {
        id: "li-6",
        code: "666-6303",
        label: "Reflectorized Pavement Markings (Type I) (6 in. White)",
        meta: "High-build thermoplastic edge + lane lines",
        quantity: 54000,
        unit: "LF",
        rate: 0.92,
        amount: 49680,
      },
    ],
  },
];

const lastExport = ref<{ format: "csv" | "tsv"; content: string } | null>(null);

function onExport(payload: { format: "csv" | "tsv"; content: string }) {
  lastExport.value = payload;
}

const basicVue = `<TuxLedgerTable
  caption="SH-21 Corridor Rehabilitation — Engineer's Estimate Bill of Materials"
  :groups="pavementBomGroups"
  value-prefix="$"
  :decimals="2"
  @export="onExport"
/>`;

const summaryOnlyVue = `<TuxLedgerTable
  caption="Summary Category Rollup (Amounts Only)"
  :groups="pavementBomGroups"
  value-prefix="$"
  :decimals="0"
  :show-quantity-rate="false"
  :exportable="false"
/>`;

const typesCode = `export interface LedgerLineItem {
  id: string;
  label: string;
  code?: string;
  meta?: string;
  quantity?: number;
  unit?: string;
  rate?: number;
  amount: number;
}

export interface LedgerGroup {
  id: string;
  label: string;
  code?: string;
  badge?: string;
  rows: LedgerLineItem[];
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · tabular rollup" title="TuxLedgerTable">
      Hierarchical grouped ledger table with collapsible category sections,
      unit &times; rate itemization, automatic subtotals, a bold grand-total
      footer, and one-click CSV/TSV export.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · pavement rehabilitation bill of materials</p>
      <h2 class="heading--bold text-xl font-bold">
        Collapsible category rollups with unit &times; rate itemization
      </h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Toggle individual bid item categories or use <strong>Collapse All</strong>
        to compare category subtotals at a glance. Click <strong>Copy TSV</strong>
        or <strong>Export CSV</strong> to emit structured tabular output.
      </p>

      <TuxExample class="mt-4" :vue="basicVue">
        <TuxLedgerTable
          caption="SH-21 Corridor Rehabilitation — Engineer's Estimate Bill of Materials"
          :groups="pavementBomGroups"
          value-prefix="$"
          :decimals="2"
          @export="onExport"
        />
      </TuxExample>

      <div v-if="lastExport" class="mt-3 p-3 rounded border border-surface-border bg-surface-sunken text-xs font-mono text-text-secondary">
        <div class="font-bold text-text-primary uppercase tracking-wider mb-1">
          Emitted {{ lastExport.format.toUpperCase() }} Payload
        </div>
        <pre class="overflow-x-auto whitespace-pre">{{ lastExport.content }}</pre>
      </div>
    </section>

    <section>
      <p class="eyebrow">compact · lump-sum amounts without quantity/rate columns</p>
      <h2 class="heading--bold text-xl font-bold">Condensed ledger mode</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>:show-quantity-rate="false"</code> and <code>:decimals="0"</code>
        for lump-sum program budgets or inventory counts where unit rates do not apply.
      </p>
      <TuxExample class="mt-4" :vue="summaryOnlyVue">
        <TuxLedgerTable
          caption="Summary Category Rollup (Amounts Only)"
          :groups="pavementBomGroups"
          value-prefix="$"
          :decimals="0"
          :show-quantity-rate="false"
          :exportable="false"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Exported TypeScript interfaces</h2>
      <TuxCodeBlock class="mt-4" :code="typesCode" lang="ts" filename="TuxLedgerTable.ts" />
    </section>
  </div>
</template>
