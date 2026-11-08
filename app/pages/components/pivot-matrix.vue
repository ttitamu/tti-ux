<script setup lang="ts">
import type { PivotCellSelection } from "~/components/TuxPivotMatrix.vue";

useHead({ title: "TuxPivotMatrix · TUX" });

const severityRows = [
  "K · Fatal Crash",
  "A · Suspected Serious Injury",
  "B · Suspected Minor Injury",
  "C · Possible Injury",
  "O · Property Damage Only",
];

const lightingCols = [
  "Daylight",
  "Dark — Lighted",
  "Dark — Not Lighted",
  "Dusk / Dawn",
];

const crashCounts = [
  [18, 14, 29, 4],
  [92, 61, 84, 19],
  [310, 185, 142, 48],
  [465, 224, 118, 63],
  [1240, 590, 315, 152],
];

const selectedCrashCell = ref<PivotCellSelection | null>(null);

function onSelectCrashCell(payload: PivotCellSelection) {
  selectedCrashCell.value = payload;
}

const corridorRows = ["IH-35 Central", "US-290 East", "SH-6 Brazos"];
const periodCols = ["AM Peak", "Midday", "PM Peak", "Overnight"];
const heavyTruckPct = [
  [11.4, 16.8, 10.9, 28.5],
  [14.2, 19.1, 13.7, 31.2],
  [9.8, 14.5, 9.2, 22.6],
];

const flagshipVue = `<TuxPivotMatrix
  caption="Corridor Study Crash Cross-Tabulation — KABCO Severity × Lighting Condition"
  row-header-label="KABCO Severity"
  :row-labels="severityRows"
  :col-labels="lightingCols"
  :values="crashCounts"
  @select-cell="onSelectCrashCell"
/>`;

const unshadedVue = `<TuxPivotMatrix
  caption="Class 8+ Heavy Truck Share (%) by Corridor × Time Period"
  row-header-label="Corridor"
  :row-labels="corridorRows"
  :col-labels="periodCols"
  :values="heavyTruckPct"
  value-suffix="%"
  :decimals="1"
  :shaded="false"
/>`;

const propsTs = `export interface PivotCellSelection {
  rowIndex: number;
  colIndex: number;
  rowLabel: string;
  colLabel: string;
  value: number;
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · cross-tabulation" title="TuxPivotMatrix">
      Two-axis cross-tabulation and contingency table with automatic row
      totals, column totals, grand total, WCAG 2.2 AAA wash shading, and
      interactive drill-down cell selection.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · crash severity cross-tabulation</p>
      <h2 class="heading--bold text-xl font-bold">
        KABCO Crash Severity &times; Roadway Lighting Condition
      </h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Interior cells use subtle surface washes that preserve &ge; 7.0:1 AAA
        text contrast across light, dark, and high-contrast themes. Click any
        cell to inspect its coordinates and trigger downstream filtering.
      </p>

      <TuxExample class="mt-4" :vue="flagshipVue">
        <TuxPivotMatrix
          caption="Corridor Study Crash Cross-Tabulation — KABCO Severity × Lighting Condition"
          row-header-label="KABCO Severity"
          :row-labels="severityRows"
          :col-labels="lightingCols"
          :values="crashCounts"
          @select-cell="onSelectCrashCell"
        />
      </TuxExample>

      <div class="mt-3 text-xs font-mono text-text-secondary">
        <template v-if="selectedCrashCell">
          Selected cell:
          <strong class="text-text-primary">{{ selectedCrashCell.rowLabel }}</strong>
          &times;
          <strong class="text-text-primary">{{ selectedCrashCell.colLabel }}</strong>
          = <strong class="text-text-primary">{{ selectedCrashCell.value.toLocaleString() }} crashes</strong>
          (row {{ selectedCrashCell.rowIndex }}, col {{ selectedCrashCell.colIndex }})
        </template>
        <template v-else>
          Click any interior cell in the matrix above to emit <code>selectCell</code>.
        </template>
      </div>
    </section>

    <section>
      <p class="eyebrow">unshaded · formatted decimal rates</p>
      <h2 class="heading--bold text-xl font-bold">Plain tabular matrix mode</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Disable intensity washes with <code>:shaded="false"</code> and configure
        <code>:decimals="1"</code> + <code>value-suffix="%"</code> for rate or share summaries.
      </p>
      <TuxExample class="mt-4" :vue="unshadedVue">
        <TuxPivotMatrix
          caption="Class 8+ Heavy Truck Share (%) by Corridor × Time Period"
          row-header-label="Corridor"
          :row-labels="corridorRows"
          :col-labels="periodCols"
          :values="heavyTruckPct"
          value-suffix="%"
          :decimals="1"
          :shaded="false"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Selection payload interface</h2>
      <TuxCodeBlock class="mt-4" :code="propsTs" lang="ts" filename="TuxPivotMatrix.ts" />
    </section>
  </div>
</template>
