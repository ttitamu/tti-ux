<script setup lang="ts">
import type { KeySchemaDef, KeyValuePair } from "~/components/TuxKeyValueInput.vue";

useHead({ title: "TuxKeyValueInput · TUX" });

const datasetSchema: KeySchemaDef[] = [
  {
    key: "corridor_id",
    label: "Corridor Identifier",
    required: true,
    suggestions: ["IH-35-CENTRAL", "US-290-WEST", "SH-130-SOUTH", "IH-10-KATY"],
  },
  {
    key: "sensor_type",
    label: "Detector Modality",
    required: true,
    suggestions: ["inductive-loop", "radar-fmcw", "lidar-overhead", "weigh-in-motion"],
  },
  {
    key: "sampling_hz",
    label: "Sampling Frequency",
    required: true,
    suggestions: ["1Hz", "10Hz", "20Hz", "60Hz"],
  },
  {
    key: "qc_tier",
    label: "Quality Assurance Tier",
    suggestions: ["raw", "calibrated", "research-grade"],
  },
];

const telemetryAttrs = ref<KeyValuePair[]>([
  { key: "corridor_id", value: "IH-35-CENTRAL" },
  { key: "sensor_type", value: "radar-fmcw" },
]);

const strictAttrs = ref<KeyValuePair[]>([
  { key: "corridor_id", value: "US-290-WEST" },
  { key: "sensor_type", value: "weigh-in-motion" },
  { key: "sampling_hz", value: "20Hz" },
  { key: "unregistered_flag", value: "experimental" },
]);

const basicVue = `<tux-key-value-input
  v-model="telemetryAttrs"
  :schema="datasetSchema"
  key-placeholder="attribute"
  value-placeholder="value"
  add-label="Add dataset tag"
/>`;

const strictVue = `<tux-key-value-input
  v-model="strictAttrs"
  :schema="datasetSchema"
  :strict-keys="true"
/>`;

const typesTs = `export interface KeyValuePair {
  key: string;
  value: string;
}

export interface KeySchemaDef {
  key: string;
  label?: string;
  required?: boolean;
  suggestions?: string[];
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · metadata & tag editor" title="TuxKeyValueInput">
      Schema-aware <code>key = value</code> editor for dataset provenance tags,
      sensor calibration parameters, and catalog attributes. Pairs native
      <code>&lt;datalist&gt;</code> key/value autocomplete with missing-required-key
      prompts and duplicate or unapproved key alerts.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · schema suggestions &amp; required keys</p>
      <h2 class="heading--bold text-xl font-bold">Telemetry dataset provenance metadata</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Notice that <code>sampling_hz</code> is marked <code>required: true</code>
        in the schema and not yet present — click
        <strong>Add missing required keys</strong> to populate all missing required
        rows in one step, then pick from value suggestions.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <div class="max-w-2xl">
          <TuxKeyValueInput
            v-model="telemetryAttrs"
            :schema="datasetSchema"
            key-placeholder="attribute"
            value-placeholder="value"
            add-label="Add dataset tag"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">strict governance · duplicate &amp; schema validation</p>
      <h2 class="heading--bold text-xl font-bold">Strict key enforcement</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Enabling <code>:strict-keys="true"</code> flags keys outside the approved
        catalog alongside duplicate-key checks so governed data dictionaries stay
        consistent before submission.
      </p>
      <TuxExample class="mt-4" :vue="strictVue">
        <div class="max-w-2xl">
          <TuxKeyValueInput
            v-model="strictAttrs"
            :schema="datasetSchema"
            :strict-keys="true"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Exported types</h2>
      <TuxCodeBlock class="mt-4" :code="typesTs" lang="ts" filename="TuxKeyValueInput.ts" />
    </section>
  </div>
</template>
