// Demo data for /visualizations/chart-gauge. Pulled out of the .vue
// page so we can use real TS annotations to narrow `tone` to the
// `Band.tone` union — Nuxt's page-extract macro parser doesn't
// honor TS syntax in top-level `<script setup>` declarations.

type Band = {
  from: number;
  to: number;
  tone: "success" | "warning" | "error";
};

export const utilizationBands: Band[] = [
  { from: 0,  to: 60,  tone: "success"    },
  { from: 60, to: 85,  tone: "warning"  },
  { from: 85, to: 100, tone: "error" },
];

export const slaBands: Band[] = [
  { from: 0,  to: 95,  tone: "error" },
  { from: 95, to: 99,  tone: "warning"  },
  { from: 99, to: 100, tone: "success"    },
];
