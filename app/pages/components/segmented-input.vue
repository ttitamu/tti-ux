<script setup lang="ts">
import type { CodeSegmentDef } from "~/components/TuxSegmentedInput.vue";

useHead({ title: "TuxSegmentedInput · TUX" });

const csjSegments: CodeSegmentDef[] = [
  { key: "control", label: "Control", length: 4, charset: "digits", placeholder: "0015" },
  { key: "section", label: "Section", length: 2, charset: "digits", placeholder: "13" },
  { key: "job", label: "Job", length: 3, charset: "digits", placeholder: "074" },
];

const sensorSegments: CodeSegmentDef[] = [
  { key: "district", label: "District", length: 3, charset: "alpha", placeholder: "AUS" },
  { key: "corridor", label: "Corridor", length: 4, charset: "alphanumeric", placeholder: "IH35" },
  { key: "station", label: "Station", length: 4, charset: "digits", placeholder: "0142" },
];

const csjCode = ref("0015-13-074");
const sensorCode = ref("");
const lastCompleted = ref<string | null>(null);

function onComplete(code: string) {
  lastCompleted.value = code;
}

const csjVue = `<tux-segmented-input
  v-model="csjCode"
  label="Highway Control-Section-Job (CSJ)"
  :segments="csjSegments"
  help-text="Paste a full 9-digit CSJ with or without hyphens (e.g. 0015-13-074 or 001513074)."
  @complete="onComplete"
/>`;

const sensorVue = `<tux-segmented-input
  v-model="sensorCode"
  label="Roadside Radar Station Identifier"
  :segments="sensorSegments"
  separator=":"
  help-text="District (3 letters), corridor code (4 chars), and 4-digit milepoint station."
/>`;

const typesTs = `export interface CodeSegmentDef {
  key: string;
  label: string;
  length: number;
  charset?: "digits" | "alpha" | "alphanumeric";
  placeholder?: string;
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · structured code input" title="TuxSegmentedInput">
      Multi-segment monospace input for structured reference numbers — highway
      Control-Section-Job (CSJ) identifiers, roadside telemetry station codes,
      and multi-part research project accounts. Enforces per-segment character
      classes, auto-focuses across segments, and splits pasted codes cleanly.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · numeric highway CSJ</p>
      <h2 class="heading--bold text-xl font-bold">Control-Section-Job (4-2-3 digits)</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Each segment filters characters to its declared <code>charset</code>,
        auto-advances when full, steps focus backward on <code>Backspace</code>
        when empty, and distributes pasted strings whether formatted with hyphens
        or stripped.
      </p>
      <TuxExample class="mt-4" :vue="csjVue">
        <div class="max-w-xl">
          <TuxSegmentedInput
            v-model="csjCode"
            label="Highway Control-Section-Job (CSJ)"
            :segments="csjSegments"
            help-text="Paste a full 9-digit CSJ with or without hyphens (e.g. 0015-13-074 or 001513074)."
            @complete="onComplete"
          />
        </div>
      </TuxExample>
      <div class="mt-3 text-xs text-text-muted font-mono max-w-xl">
        modelValue: <code>{{ csjCode || "(empty)" }}</code>
        <span v-if="lastCompleted"> · last @complete: <code>{{ lastCompleted }}</code></span>
      </div>
    </section>

    <section>
      <p class="eyebrow">mixed charsets · custom separator</p>
      <h2 class="heading--bold text-xl font-bold">Roadside telemetry station ID</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Combine <code>alpha</code>, <code>alphanumeric</code>, and <code>digits</code>
        segments with a custom colon delimiter and automatic uppercase normalization.
      </p>
      <TuxExample class="mt-4" :vue="sensorVue">
        <div class="max-w-xl">
          <TuxSegmentedInput
            v-model="sensorCode"
            label="Roadside Radar Station Identifier"
            :segments="sensorSegments"
            separator=":"
            help-text="District (3 letters), corridor code (4 chars), and 4-digit milepoint station."
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Segment schema</h2>
      <TuxCodeBlock class="mt-4" :code="typesTs" lang="ts" filename="TuxSegmentedInput.ts" />
    </section>
  </div>
</template>
