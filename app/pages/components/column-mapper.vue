<script setup lang="ts">
import type { TargetFieldSpec } from "~/components/TuxColumnMapper.vue";

useHead({ title: "TuxColumnMapper · TUX" });

const sourceColumns = [
  "STA_CODE",
  "CORRIDOR_DESC",
  "SURVEY_DT",
  "AADT_VOL",
  "MEAN_SPD_MPH",
  "IRI_IN_MI",
];

const sampleRows = [
  {
    STA_CODE: "TX-021-0142",
    CORRIDOR_DESC: "SH-21 Eastbound · Brazos River Approach",
    SURVEY_DT: "2026-03-18",
    AADT_VOL: 18420,
    MEAN_SPD_MPH: 63.4,
    IRI_IN_MI: 74.2,
  },
];

const targetFields: TargetFieldSpec[] = [
  {
    key: "stationId",
    label: "Station Identifier",
    required: true,
    type: "string",
    aliases: ["sta_code", "station_code", "site_id"],
  },
  {
    key: "surveyDate",
    label: "Survey Date",
    required: true,
    type: "date",
    aliases: ["survey_dt", "obs_date", "date"],
  },
  {
    key: "aadt",
    label: "Annual Average Daily Traffic",
    required: true,
    type: "number",
    aliases: ["aadt_vol", "daily_volume", "traffic_count"],
  },
  {
    key: "meanSpeed",
    label: "Mean Operating Speed (mph)",
    required: false,
    type: "number",
    aliases: ["mean_spd_mph", "avg_speed"],
  },
  {
    key: "roughnessIndex",
    label: "International Roughness Index (in/mi)",
    required: false,
    type: "number",
    aliases: ["iri_in_mi", "iri"],
  },
  {
    key: "corridorName",
    label: "Corridor Description",
    required: false,
    type: "string",
    aliases: ["corridor_desc", "facility_name"],
  },
];

const mapping = ref<Record<string, string>>({
  stationId: "STA_CODE",
  aadt: "CORRIDOR_DESC", // Intentional initial mismatch so user sees numeric type warning!
});

const confirmedSnapshot = ref<Record<string, string> | null>(null);

function onConfirm(result: Record<string, string>) {
  confirmedSnapshot.value = result;
}

const basicVue = `<TuxColumnMapper
  v-model="mapping"
  :source-columns="sourceColumns"
  :sample-rows="sampleRows"
  :target-fields="targetFields"
  confirm-label="Import Corridor Survey"
  @confirm="onConfirm"
/>`;

const typesCode = `export interface TargetFieldSpec {
  key: string;
  label: string;
  required?: boolean;
  type?: "string" | "number" | "date";
  aliases?: string[];
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · schema alignment" title="TuxColumnMapper">
      Tabular CSV and field-survey import alignment wizard. Pairs incoming
      source headers with canonical target schema specifications, previews
      live sample values, flags numeric type mismatches, and provides
      one-click fuzzy alias auto-mapping.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · pavement &amp; traffic survey import</p>
      <h2 class="heading--bold text-xl font-bold">
        Interactive column alignment with numeric validation &amp; auto-mapping
      </h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Notice how mapping <code>CORRIDOR_DESC</code> onto the numeric
        <strong>Annual Average Daily Traffic</strong> field triggers an inline
        type-mismatch warning, and the submit button remains disabled until
        all required fields are mapped. Click <strong>Auto-Map Columns</strong>
        to align every column automatically via normalized header and alias matching.
      </p>

      <TuxExample class="mt-4" :vue="basicVue">
        <TuxColumnMapper
          v-model="mapping"
          :source-columns="sourceColumns"
          :sample-rows="sampleRows"
          :target-fields="targetFields"
          confirm-label="Import Corridor Survey"
          @confirm="onConfirm"
        />
      </TuxExample>

      <div v-if="confirmedSnapshot" class="mt-3 p-3 rounded border border-surface-border bg-surface-sunken text-xs font-mono text-text-secondary">
        <div class="font-bold text-text-primary uppercase tracking-wider mb-1">
          Confirmed Schema Mapping
        </div>
        <pre class="overflow-x-auto">{{ JSON.stringify(confirmedSnapshot, null, 2) }}</pre>
      </div>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Exported TypeScript interface</h2>
      <TuxCodeBlock class="mt-4" :code="typesCode" lang="ts" filename="TuxColumnMapper.ts" />
    </section>
  </div>
</template>
