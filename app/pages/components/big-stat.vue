<script setup lang="ts">
useHead({ title: "TuxBigStat · tti-ux" });

const exampleVue = `<TuxBigStat
  value="$126"
  suffix="M"
  label="Annual research expenditure"
  source="FY 2025 sponsored research report"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxBigStat">
      The institutional <strong>headline metric</strong>: one oversized
      number, one tracked-out label. Pulled directly from TTI's factsheets.
      Companion to <code>TuxFactoid</code> — use BigStat for a single hero
      metric, Factoid for a row of them.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Default · medium · maroon</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxBigStat
          :value="126"
          suffix="M"
          label="Annual research expenditure"
          source="FY 2025 sponsored research report"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">size tiers</p>
      <h2 class="heading--bold text-xl font-bold">Three sizes — lg / md / sm</h2>
      <p class="text-sm text-text-secondary mb-3">
        <code>lg</code> = 144px landing hero,
        <code>md</code> = 96px dashboard hero (default),
        <code>sm</code> = 64px in-card metric.
      </p>
      <TuxExample class="mt-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TuxBigStat size="lg" :value="412" suffix=" mi" label="Instrumented freight corridor" />
          <TuxBigStat size="md" :value="650" suffix="+" label="Active research projects" />
          <TuxBigStat size="sm" :value="23"          label="States with TTI deployments" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">tones</p>
      <h2 class="heading--bold text-xl font-bold">Maroon / gold / neutral</h2>
      <p class="text-sm text-text-secondary mb-3">
        Maroon is canonical. Gold for emphasis on landing surfaces. Neutral
        for supporting metrics that shouldn't compete with brand stats.
      </p>
      <TuxExample class="mt-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TuxBigStat tone="maroon"  :value="93.4" suffix="%" label="Classifier precision (CLS-204)" />
          <TuxBigStat tone="gold"    :value="60"   suffix=" yrs" label="Of transportation research" />
          <TuxBigStat tone="neutral" :value="1.4"  suffix="K" label="Researchers + grad assistants" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">style variants</p>
      <h2 class="heading--bold text-xl font-bold">Per-variant numeral face</h2>
      <p class="text-sm text-text-secondary mb-3">
        Numeral switches per <code>variant</code>: Open Sans 700 (default),
        Work Sans 800 italic (bold), Georgia italic (elegant). The label
        stays Open Sans throughout — the eyebrow rhythm is constant.
      </p>
      <TuxExample class="mt-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TuxBigStat variant="default" :value="2.1" suffix="M" label="Vehicles per day · monitored corridors" />
          <TuxBigStat variant="bold"    :value="84"  suffix="%" label="Reduction in roadway-departure crashes" />
          <TuxBigStat variant="elegant" :value="37"  suffix="%" label="Stop-line non-compliance reduction" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props reference</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>value</code> — string or number. Required.</li>
        <li><code>label</code> — tracked-out label below. Required.</li>
        <li><code>suffix</code> — trailing unit (<code>%</code>, <code>M</code>, <code> mi</code>). Optional.</li>
        <li><code>source</code> — italic attribution line. Optional.</li>
        <li><code>variant</code> — <code>"default" | "bold" | "elegant"</code>. Defaults to <code>"default"</code>.</li>
        <li><code>tone</code> — <code>"maroon" | "gold" | "neutral"</code>. Defaults to <code>"maroon"</code>.</li>
        <li><code>size</code> — <code>"lg" | "md" | "sm"</code>. Defaults to <code>"md"</code>.</li>
      </ul>
    </section>
  </div>
</template>
