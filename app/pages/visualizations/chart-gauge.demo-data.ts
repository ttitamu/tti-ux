// Demo data for /visualizations/chart-gauge. Pulled out of the .vue
// page so we can use real TS annotations to narrow `intent` to the
// `Band.intent` union — Nuxt's page-extract macro parser doesn't
// honor TS syntax in top-level `<script setup>` declarations.

type Band = {
  from: number;
  to: number;
  intent: "ok" | "warn" | "alert";
};

export const utilizationBands: Band[] = [
  { from: 0,  to: 60,  intent: "ok"    },
  { from: 60, to: 85,  intent: "warn"  },
  { from: 85, to: 100, intent: "alert" },
];

export const slaBands: Band[] = [
  { from: 0,  to: 95,  intent: "alert" },
  { from: 95, to: 99,  intent: "warn"  },
  { from: 99, to: 100, intent: "ok"    },
];
