<script setup lang="ts">
import type { PeriodPreset, PeriodRangeValue } from "~/components/TuxPeriodPicker.vue";

useHead({ title: "TuxPeriodPicker · TUX" });

const fiscalPresets: PeriodPreset[] = [
  { key: "fy26-q1", label: "FY26 Q1", start: "2025-09-01", end: "2025-11-30" },
  { key: "fy26-q2", label: "FY26 Q2", start: "2025-12-01", end: "2026-02-28" },
  { key: "fy26-q3", label: "FY26 Q3", start: "2026-03-01", end: "2026-05-31" },
  { key: "march", label: "March Telemetry", start: "2026-03-01", end: "2026-03-31" },
];

const corridorRange = ref<PeriodRangeValue>({
  start: "2026-03-01",
  end: "2026-03-31",
  preset: "march",
  comparePrevious: true,
});

const rollingSensorWindow = ref<PeriodRangeValue>({
  start: "2026-04-06",
  end: "2026-04-12",
  comparePrevious: false,
});

const appliedPayload = ref<PeriodRangeValue | null>(null);

function onApply(next: PeriodRangeValue) {
  appliedPayload.value = { ...next };
}

const flagshipVue = `<tux-period-picker
  v-model="corridorRange"
  label="Corridor Volume Reporting Cycle"
  :presets="fiscalPresets"
  @apply="onApply"
/>`;

const steppedVue = `<tux-period-picker
  v-model="rollingSensorWindow"
  label="7-Day Weigh-in-Motion Calibration Window"
  :step-days="7"
  :allow-compare="false"
/>`;

const typesTs = `export interface PeriodRangeValue {
  start: string;           // ISO YYYY-MM-DD
  end: string;             // ISO YYYY-MM-DD
  preset?: string;         // Active preset key when matched
  comparePrevious?: boolean;
}

export interface PeriodPreset {
  key: string;
  label: string;
  start: string;
  end: string;
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · form & temporal input" title="TuxPeriodPicker">
      Keyboard-accessible reporting cycle, quarter, and date-range selector with
      cycle stepping and optional prior-period comparison. Designed for corridor
      volume summaries, weigh-in-motion calibration logs, and longitudinal safety
      evaluations.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · reporting cycle &amp; prior comparison</p>
      <h2 class="heading--bold text-xl font-bold">Quarterly &amp; monthly corridor volume cycle</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Preset pills synchronize <code>aria-pressed</code> with the active date bounds.
        Stepping backward or forward via <code>‹</code> / <code>›</code> shifts the window
        by the active span while computing the matching prior comparison window.
      </p>
      <TuxExample class="mt-4" :vue="flagshipVue">
        <div class="max-w-3xl">
          <TuxPeriodPicker
            v-model="corridorRange"
            label="Corridor Volume Reporting Cycle"
            :presets="fiscalPresets"
            @apply="onApply"
          />
        </div>
      </TuxExample>
      <div class="mt-3 text-xs text-text-muted font-mono max-w-3xl">
        <template v-if="appliedPayload">
          <strong>applied range:</strong>
          {{ appliedPayload.start }} → {{ appliedPayload.end }}
          (comparePrevious: {{ Boolean(appliedPayload.comparePrevious) }})
        </template>
        <template v-else>
          live v-model: {{ corridorRange.start }} → {{ corridorRange.end }} · press <em>Apply</em> to commit
        </template>
      </div>
    </section>

    <section>
      <p class="eyebrow">fixed step window · no comparison</p>
      <h2 class="heading--bold text-xl font-bold">7-day sensor calibration window</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>:step-days="7"</code> and <code>:allow-compare="false"</code> when
        stepping weekly roadside detector calibration intervals with built-in default presets.
      </p>
      <TuxExample class="mt-4" :vue="steppedVue">
        <div class="max-w-3xl">
          <TuxPeriodPicker
            v-model="rollingSensorWindow"
            label="7-Day Weigh-in-Motion Calibration Window"
            :step-days="7"
            :allow-compare="false"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Exported types</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Dates use deterministic ISO <code>YYYY-MM-DD</code> strings evaluated in UTC
        so day-span arithmetic never drifts across daylight-saving boundaries.
      </p>
      <TuxCodeBlock class="mt-4" :code="typesTs" lang="ts" filename="TuxPeriodPicker.ts" />
    </section>
  </div>
</template>
