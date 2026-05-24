// Demo data for /visualizations/chart-line. Pulled out of the .vue
// page so we can use real TS annotations to narrow `band` to the
// `Series.band` tuple type and `brushRange` to the v-model:range
// tuple — Nuxt's page-extract macro parser doesn't honor TS syntax
// in top-level `<script setup>` declarations.

import { ref, type Ref } from "vue";

type BandSeries = {
  key: string;
  label: string;
  data: number[];
  /** [low, high] tuples; same length as `data`. */
  band: [number, number][];
};

export const bandSeries: BandSeries[] = [
  {
    key: "estimate",
    label: "Estimated rate (95% CI)",
    data: [42, 48, 54, 58, 61, 65, 68, 72, 78, 84, 88, 92],
    band: [
      [38, 46], [44, 52], [50, 58], [54, 62],
      [57, 65], [61, 69], [64, 72], [68, 76],
      [73, 83], [79, 89], [83, 93], [86, 98],
    ],
  },
];

export const brushRange: Ref<[number, number]> = ref<[number, number]>([2, 9]);
