<script setup lang="ts">
import tuxUnitValueSource from "~/components/TuxUnitValue.vue?raw";
import { useTuxUnits } from "~/composables/useTuxUnits";

useHead({ title: "TuxUnitValue · TUX" });

const { unitSystem, toggleUnitSystem } = useTuxUnits();

const inlineSampleVue = `<p>
  Corridor operating speed averaged
  <TuxUnitValue :value="68.5" unit="mph" :ci="2.4" interactive />
  across a <TuxUnitValue :value="14.2" unit="mi" /> segment of IH-35.
</p>`;

const cardGridVue = `<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <TuxUnitValue
    variant="card"
    division="maroon"
    station="STA 04+50"
    label="Crash Barrier Impact Load"
    :value="42.5"
    unit="kip"
    :ci="1.8"
    interactive
  />
  <TuxUnitValue
    variant="card"
    division="blue"
    station="IH-35 RM 234"
    label="85th Percentile Speed"
    :value="72.4"
    unit="mph"
    :ci="1.5"
    interactive
  />
  <TuxUnitValue
    variant="card"
    division="green"
    station="Port Houston"
    label="Daily Freight Payload"
    :value="1840"
    unit="ton"
    interactive
  />
</div>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="data display · tti engineering" title="TuxUnitValue">
      Scientific and civil-engineering measurement primitive for Texas A&amp;M Transportation
      Institute telemetry, reports, and pavement studies. Formats transportation quantities
      (<code>mph</code> ↔ <code>km/h</code>, <code>mi</code> ↔ <code>km</code>,
      <code>VMT</code> ↔ <code>VKT</code>, <code>kip</code> ↔ <code>kN</code>,
      <code>psi</code> ↔ <code>kPa</code>, <code>tons</code> ↔ <code>t</code>,
      <code>°F</code> ↔ <code>°C</code>, <code>AADT</code>, <code>PCE</code>, <code>SN40R</code>)
      with tabular numerals, 95% confidence intervals (<code>± CI</code>), highway stationing tags,
      and a synchronized <strong>US Customary ↔ Metric (SI)</strong> unit-system toggle.
    </TuxPageHeader>

    <!-- Global Unit System Control Banner -->
    <section class="p-5 bg-surface-raised border border-surface-border rounded flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="eyebrow">global measurement state · useTuxUnits()</p>
        <h2 class="heading--bold text-lg font-bold">
          Active System: {{ unitSystem === "us" ? "US Customary (AASHTO / TxDOT)" : "Metric (SI / International Journal)" }}
        </h2>
        <p class="text-sm text-text-secondary mt-1">
          Toggling the unit system updates every <code>&lt;TuxUnitValue&gt;</code> instance on the page simultaneously.
        </p>
      </div>
      <TuxButton intent="primary" @click="toggleUnitSystem">
        Switch to {{ unitSystem === "us" ? "Metric (SI)" : "US Customary" }}
      </TuxButton>
    </section>

    <!-- 01 Card Telemetry Strip with 5-Band Spectrum Divisions -->
    <section>
      <p class="eyebrow">engineering cards · 5-band spectrum</p>
      <h2 class="heading--bold text-xl font-bold">Proving-Ground &amp; Corridor Telemetry Cards</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Use <code>variant="card"</code> with <code>station</code> and <code>division</code> props
        to key telemetry readouts to TTI's five core research divisions.
      </p>
      <TuxExample class="mt-4" :vue="cardGridVue" :source="tuxUnitValueSource">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TuxUnitValue
            variant="card"
            division="maroon"
            station="STA 04+50"
            label="Crash Barrier Impact Load"
            :value="42.5"
            unit="kip"
            :ci="1.8"
            interactive
          />
          <TuxUnitValue
            variant="card"
            division="blue"
            station="IH-35 RM 234"
            label="85th Percentile Speed"
            :value="72.4"
            unit="mph"
            :ci="1.5"
            interactive
          />
          <TuxUnitValue
            variant="card"
            division="green"
            station="Port Houston"
            label="Daily Freight Payload"
            :value="1840"
            unit="ton"
            interactive
          />
        </div>
      </TuxExample>
    </section>

    <!-- 02 Inline Prose & Pill Variants -->
    <section>
      <p class="eyebrow">inline &amp; pill variants</p>
      <h2 class="heading--bold text-xl font-bold">Inline Prose &amp; Stationing Pills</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Embed <code>TuxUnitValue</code> directly inside long-form research narratives or table cells.
      </p>
      <TuxExample class="mt-4" :vue="inlineSampleVue" :source="tuxUnitValueSource">
        <div class="space-y-4">
          <p class="text-base text-text-primary leading-relaxed">
            Corridor operating speed averaged
            <TuxUnitValue :value="68.5" unit="mph" :ci="2.4" interactive />
            across a <TuxUnitValue :value="14.2" unit="mi" :decimals="1" /> managed-lane segment of IH-35,
            carrying <TuxUnitValue :value="142500" unit="AADT" :decimals="0" /> with a pavement surface
            temperature of <TuxUnitValue :value="118.4" unit="F" :ci="3.6" :decimals="1" />.
          </p>
          <div class="flex flex-wrap gap-3">
            <TuxUnitValue variant="pill" division="teal" station="STA 01+00" label="Rut Depth" :value="0.35" unit="in" :decimals="2" />
            <TuxUnitValue variant="pill" division="gold" station="Subgrade" label="Modulus" :value="1450" unit="psi" :decimals="0" />
            <TuxUnitValue variant="pill" division="maroon" station="Track 4" label="Skid Resistance" :value="52.4" unit="SN" :decimals="1" />
          </div>
        </div>
      </TuxExample>
    </section>
  </div>
</template>
