<script setup lang="ts">
import tuxContextMeterSource from "~/components/TuxContextMeter.vue?raw";

useHead({ title: "TuxContextMeter · TUX" });

const okVue = `<tux-context-meter
  :used="48000"
  :max="200000"
  model-label="opus-4-7 · 200k context"
  :breakdown="{
    input:  { tokens: 40000, cost: '$0.20' },
    output: { tokens:  8000, cost: '$0.40' },
    totalCost: '$0.60',
  }"
/>`;

const warnVue = `<tux-context-meter
  :used="142000"
  :max="200000"
  model-label="opus-4-7"
  :breakdown="{
    input:  { tokens: 118400, cost: '$0.59' },
    output: { tokens:  23600, cost: '$1.18' },
    totalCost: '$1.77',
  }"
/>`;

const alertVue = `<tux-context-meter
  :used="186000"
  :max="200000"
  model-label="opus-4-7 · approaching limit"
  :breakdown="{
    input:  { tokens: 162000, cost: '$0.81' },
    output: { tokens:  24000, cost: '$1.20' },
    totalCost: '$2.01',
  }"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxContextMeter">
      Token-utilization indicator with cost breakdown. A compact badge
      shows the current percentage of the model's context window; hover
      reveals input/output token counts + cost detail. Tone-codes
      <strong>ok</strong> under 60%, <strong>warn</strong> from 60–85%,
      <strong>alert</strong> over 85% — so long research sessions get a
      visible signal as they approach the context limit. Lives well in
      a session-header actions slot.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">ok band</p>
      <h2 class="heading--bold text-xl font-bold">Under 60% used</h2>
      <p class="text-sm text-text-secondary mb-3">
        Hover the pill to see the breakdown popover.
      </p>
      <TuxExample class="mt-4" :vue="okVue" :source="tuxContextMeterSource">
        <TuxContextMeter
          :used="48000"
          :max="200000"
          model-label="opus-4-7 · 200k context"
          :breakdown="{
            input:  { tokens: 40000, cost: '$0.20' },
            output: { tokens:  8000, cost: '$0.40' },
            totalCost: '$0.60',
          }"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">warn band</p>
      <h2 class="heading--bold text-xl font-bold">60–85% used</h2>
      <p class="text-sm text-text-secondary mb-3">
        Amber tone signals "starting to fill" — a visual nudge to think
        about compacting context before the limit.
      </p>
      <TuxExample :vue="warnVue">
        <TuxContextMeter
          :used="142000"
          :max="200000"
          model-label="opus-4-7"
          :breakdown="{
            input:  { tokens: 118400, cost: '$0.59' },
            output: { tokens:  23600, cost: '$1.18' },
            totalCost: '$1.77',
          }"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">alert band</p>
      <h2 class="heading--bold text-xl font-bold">Over 85% used</h2>
      <p class="text-sm text-text-secondary mb-3">
        Red tone signals "approaching limit" — actions like switching
        models, summarizing, or starting a new session should be obvious.
      </p>
      <TuxExample :vue="alertVue">
        <TuxContextMeter
          :used="186000"
          :max="200000"
          model-label="opus-4-7 · approaching limit"
          :breakdown="{
            input:  { tokens: 162000, cost: '$0.81' },
            output: { tokens:  24000, cost: '$1.20' },
            totalCost: '$2.01',
          }"
        />
      </TuxExample>
    </section>
  </div>
</template>
