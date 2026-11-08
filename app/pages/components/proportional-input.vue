<script setup lang="ts">
import type { ProportionalSlice } from "~/components/TuxProportionalInput.vue";

useHead({ title: "TuxProportionalInput · TUX" });

const modeShareSlices = ref<ProportionalSlice[]>([
  { id: "sov", code: "SOV", label: "Single-Occupancy Vehicle", value: 58.0, locked: false },
  { id: "hov", code: "HOV", label: "Carpool & Vanpool (2+)", value: 18.5, locked: false },
  { id: "brt", code: "BRT", label: "Bus Rapid Transit", value: 15.0, locked: true },
  { id: "act", code: "ACT", label: "Active Micromobility & Bike", value: 8.5, locked: false },
]);

const unbalancedFundingSlices = ref<ProportionalSlice[]>([
  { id: "safety", code: "SAF", label: "Intersection Safety Countermeasures", value: 40, locked: true },
  { id: "its", code: "ITS", label: "Roadside Telemetry & Fiber", value: 25, locked: false },
  { id: "pave", code: "PVM", label: "Pavement Preservation", value: 20, locked: false },
]);

const flagshipVue = `<tux-proportional-input
  v-model="modeShareSlices"
  title="Target Corridor Peak-Hour Mode Share"
  :target-total="100"
  unit="%"
  :decimals="1"
  :step="0.5"
/>`;

const unbalancedVue = `<tux-proportional-input
  v-model="unbalancedFundingSlices"
  title="Corridor Improvement Program Split"
  :target-total="100"
  unit="%"
  :decimals="1"
  :step="1"
/>`;

const typesTs = `export interface ProportionalSlice {
  id: string;
  label: string;
  code?: string;
  value: number;
  locked?: boolean;
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · constrained allocation" title="TuxProportionalInput">
      Fixed-sum percentage and budget-share allocator with a live stacked
      distribution bar, per-slice lock toggles (<code>aria-pressed</code>),
      synchronized slider + numeric inputs, and one-click
      <strong>Split Evenly</strong> / <strong>Rebalance Unlocked</strong> helpers.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · balanced corridor mode-share target</p>
      <h2 class="heading--bold text-xl font-bold">Peak-hour corridor mode-share scenario (100.0%)</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Bus Rapid Transit (<code>BRT</code>) is locked at <code>15.0%</code>.
        Adjust any unlocked mode via slider or numeric input, then press
        <strong>Rebalance Unlocked</strong> to proportionally scale the remaining
        unlocked modes back to an exact <code>100.0%</code> sum.
      </p>
      <TuxExample class="mt-4" :vue="flagshipVue">
        <div class="max-w-3xl">
          <TuxProportionalInput
            v-model="modeShareSlices"
            title="Target Corridor Peak-Hour Mode Share"
            :target-total="100"
            unit="%"
            :decimals="1"
            :step="0.5"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">unbalanced state · remaining delta alert</p>
      <h2 class="heading--bold text-xl font-bold">15.0% unallocated program reserve</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        When the sum diverges from <code>targetTotal</code>, the stacked bar
        highlights unallocated capacity with a hatched reserve segment and
        surfaces an explicit delta alert.
      </p>
      <TuxExample class="mt-4" :vue="unbalancedVue">
        <div class="max-w-3xl">
          <TuxProportionalInput
            v-model="unbalancedFundingSlices"
            title="Corridor Improvement Program Split"
            :target-total="100"
            unit="%"
            :decimals="1"
            :step="1"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">ProportionalSlice interface</h2>
      <TuxCodeBlock class="mt-4" :code="typesTs" lang="ts" filename="TuxProportionalInput.ts" />
    </section>
  </div>
</template>
