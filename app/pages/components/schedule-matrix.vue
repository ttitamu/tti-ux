<script setup lang="ts">
import tuxScheduleMatrixSource from "~/components/TuxScheduleMatrix.vue?raw";

useHead({ title: "TuxScheduleMatrix · TUX" });

const hovGrid = ref([
  [false, false, true, true, true, true, false, false],
  [false, false, true, true, true, true, false, false],
  [false, false, true, true, true, true, false, false],
  [false, false, true, true, true, true, false, false],
  [false, false, true, true, true, true, false, false],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
]);

const signalTimingRows = [
  "Arterial North",
  "Downtown Core",
  "Campus Loop",
  "Freight Bypass",
];

const signalTimingCols = [
  "AM Early",
  "AM Peak",
  "Midday",
  "School Out",
  "PM Peak",
  "Night Free",
];

const signalGrid = ref([
  [false, true, false, true, true, false],
  [false, true, true, true, true, false],
  [false, true, true, true, false, false],
  [true, false, false, false, false, true],
]);

const matrixControls = [
  {
    prop: "showPresets",
    label: "Show Preset Toolbar",
    type: "boolean" as const,
    defaultValue: true,
    description: "Display quick-apply preset buttons above the schedule grid",
  },
  {
    prop: "activeLabel",
    label: "Active State Label",
    type: "text" as const,
    defaultValue: "HOV Enforced",
    description: "Accessible & legend label for active time blocks",
  },
  {
    prop: "inactiveLabel",
    label: "Inactive State Label",
    type: "text" as const,
    defaultValue: "General Access",
    description: "Accessible & legend label for standby time blocks",
  },
];

const matrixPresets = [
  {
    name: "hov-managed-lane",
    label: "Managed HOV Window",
    description: "Weekday daytime HOV enforcement schedule across 3-hour blocks",
    icon: "lucide:calendar-clock",
    values: {
      showPresets: true,
      activeLabel: "HOV Enforced",
      inactiveLabel: "General Access",
    },
  },
  {
    name: "compact-telemetry",
    label: "Telemetry Polling Cadence",
    description: "Preset-free schedule matrix for roadside radar polling windows",
    icon: "lucide:radio",
    values: {
      showPresets: false,
      activeLabel: "High-Rate 10Hz",
      inactiveLabel: "Low-Power 1Hz",
    },
  },
];

const hovVue = `<tux-schedule-matrix
  v-model="hovGrid"
  active-label="HOV Enforced"
  inactive-label="General Access"
/>`;

const signalVue = `<tux-schedule-matrix
  v-model="signalGrid"
  :row-labels="['Arterial North', 'Downtown Core', 'Campus Loop', 'Freight Bypass']"
  :col-labels="['AM Early', 'AM Peak', 'Midday', 'School Out', 'PM Peak', 'Night Free']"
  active-label="Coordinated Green Wave"
  inactive-label="Actuated Free"
  :show-presets="false"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · scheduling & operations" title="TuxScheduleMatrix">
      Interactive Day × Time-Block (or generic Row × Column) schedule
      paint matrix. Click or drag across cells to paint operating
      windows, toggle full days via row headers or full time blocks via
      column headers, and apply common operational schedules in one
      click. Every header, preset, and cell control meets WCAG 2.2 AAA
      44×44px target sizing with checkmark + color redundancy.
    </TuxPageHeader>

    <section>
      <TuxPlayground
        tag="tux-schedule-matrix"
        component-name="TuxScheduleMatrix"
        title="Corridor Operating Window Workbench"
        eyebrow="Interactive Component Lab"
        :controls="matrixControls"
        :presets="matrixPresets"
        :source="tuxScheduleMatrixSource"
        :code-template="(values) => {
          const presetAttr = !values.showPresets ? '\n  :show-presets=\x22false\x22' : '';
          const actAttr = values.activeLabel !== 'Active' ? `\n  active-label=\x22${values.activeLabel}\x22` : '';
          const inactAttr = values.inactiveLabel !== 'Standby' ? `\n  inactive-label=\x22${values.inactiveLabel}\x22` : '';
          return `<tux-schedule-matrix\n  v-model=\x22hovGrid\x22${actAttr}${inactAttr}${presetAttr}\n/>`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full max-w-3xl">
            <TuxScheduleMatrix
              v-model="hovGrid"
              :show-presets="values.showPresets"
              :active-label="values.activeLabel || 'Active'"
              :inactive-label="values.inactiveLabel || 'Standby'"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">managed lanes · 7×8 weekly blocks</p>
      <h2 class="heading--bold text-xl font-bold">HOV &amp; Reversible Lane Enforcement Schedule</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Default configuration renders Monday through Sunday across eight
        3-hour windows (56 weekly slots) with quick-fill presets for
        weekday daytime operations, 24×7 activation, and off-peak
        overnight windows.
      </p>
      <TuxExample class="mt-4" :vue="hovVue" :source="tuxScheduleMatrixSource">
        <TuxScheduleMatrix
          v-model="hovGrid"
          active-label="HOV Enforced"
          inactive-label="General Access"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">custom axes · signal progression plans</p>
      <h2 class="heading--bold text-xl font-bold">Corridor Signal Timing Coordination Matrix</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass custom <code>:row-labels</code> and <code>:col-labels</code>
        to model any two-dimensional operational plan — such as arterial
        signal progression zones across time-of-day coordination plans.
      </p>
      <TuxExample class="mt-4" :vue="signalVue">
        <TuxScheduleMatrix
          v-model="signalGrid"
          :row-labels="signalTimingRows"
          :col-labels="signalTimingCols"
          active-label="Coordinated Green Wave"
          inactive-label="Actuated Free"
          :show-presets="false"
        />
      </TuxExample>
    </section>
  </div>
</template>
