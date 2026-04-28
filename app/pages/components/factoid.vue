<script setup lang="ts">
useHead({ title: "TuxFactoid · TUX" });

const FACTOID_DATA = [
  { value: "412", suffix: " mi", label: "Continuously instrumented freight corridor coming online by year's end.", source: "TTI Freight Operations Group · 2025" },
  { value: "37",  suffix: "%",   label: "Reduction in stop-line non-compliance at twelve treated rural intersections.", source: "Hassan et al. · 36-mo follow-up" },
  { value: "2.1", suffix: "M",   label: "Vehicles per day across the Texas Triangle's monitored corridors.", source: "TTI MovementLab · Q3 2025" },
  { value: "84",  suffix: "%",   label: "Reduction in late-night roadway-departure crashes at retrofit sites.", source: "Year-three control comparison" },
  { value: "12",  suffix: null,  label: "Counties enrolled in the rural-roadway before/after study.", source: "TxDOT IAC 2020-78-104" },
];

const exampleVue = `<TuxFactoid
  variant="default"
  :density="3"
  :items="items"
  eyebrow="By the numbers"
  title="What three years of follow-up data is telling us."
  dek="Treatment outcomes from twelve rural intersections, measured through 36 months of post-construction observation."
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxFactoid">
      The institutional <strong>"by the numbers"</strong> block — oversized
      statistics in a row, each with its own short label and optional source
      line. The numeral face changes per style variant: <strong>Open Sans
      heavy</strong> on default, <strong>Work Sans bold-italic</strong> on
      bold, <strong>Georgia italic</strong> on elegant. Three densities —
      3-up (96px), 4-up (72px), 5-up (56px).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">default · 3-up</p>
      <h2 class="heading--bold text-xl font-bold">Large numerals · Open Sans 700</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxFactoid
          variant="default"
          :density="3"
          :items="FACTOID_DATA"
          eyebrow="By the numbers"
          title="What three years of follow-up data is telling us."
          dek="Treatment outcomes from twelve rural intersections, measured through 36 months of post-construction observation."
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">bold · 4-up</p>
      <h2 class="heading--bold text-xl font-bold">Medium numerals · Work Sans 800-italic</h2>
      <TuxExample class="mt-4">
        <TuxFactoid
          variant="bold"
          :density="4"
          :items="FACTOID_DATA"
          eyebrow="Statewide measurement"
          title="The numbers behind a year of monitoring."
          dek="What our continuous-instrumentation network captured across the Texas Triangle in 2025."
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">elegant · 4-up · bare grid</p>
      <h2 class="heading--bold text-xl font-bold">Compact numerals · Georgia italic</h2>
      <p class="text-sm text-text-secondary mb-3">
        Headers are optional — omit <code>eyebrow</code>, <code>title</code>,
        and <code>dek</code> for a bare grid you can drop into any layout.
      </p>
      <TuxExample class="mt-4">
        <TuxFactoid variant="elegant" :density="4" :items="FACTOID_DATA" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">default · 5-up</p>
      <h2 class="heading--bold text-xl font-bold">Smallest numerals · dashboard tier</h2>
      <TuxExample class="mt-4">
        <TuxFactoid variant="default" :density="5" :items="FACTOID_DATA" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props reference</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>items</code> — array of <code>{ value, suffix?, label, source? }</code>. Required.</li>
        <li><code>variant</code> — <code>"default" | "bold" | "elegant"</code>. Defaults to <code>"default"</code>.</li>
        <li><code>density</code> — <code>3 | 4 | 5</code> columns. Sets numeral size accordingly.</li>
        <li><code>eyebrow</code>, <code>title</code>, <code>dek</code> — optional header trio. Omit all three for a bare grid.</li>
      </ul>
    </section>
  </div>
</template>
