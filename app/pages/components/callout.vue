<script setup lang="ts">
useHead({ title: "TuxCallout · TUX" });

const exampleVue = `<TuxCallout kind="stat">
  <p>
    Compliance gains held steady through the 36-month follow-up window —
    suggesting the treatments work via persistent infrastructure cues rather
    than a novelty effect.
  </p>
</TuxCallout>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxCallout">
      Pulled-aside editorial accent — a fact, finding, or quote that interrupts
      body flow. The leading rule on the left adopts the page's style
      signature. Use sparingly — <strong>≤2 callouts per article</strong>;
      each one breaks reading flow.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Default · in body context</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <div>
          <p class="text-text-secondary leading-relaxed mb-4">
            Roadway departure crashes account for more than half of rural
            fatalities, and the persistent geographic distribution of these
            events points to enduring infrastructure conditions rather than
            transient driver behavior.
          </p>
          <TuxCallout kind="stat">
            <p>
              Compliance gains held steady through the 36-month follow-up
              window — suggesting the treatments work via persistent
              infrastructure cues rather than a novelty effect.
            </p>
          </TuxCallout>
          <p class="text-text-secondary leading-relaxed mt-4">
            TTI's twelve-county before/after study began in 2020, with
            reconstruction work staggered across three field seasons.
          </p>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">three kinds</p>
      <h2 class="heading--bold text-xl font-bold">fact / stat / quote</h2>
      <p class="text-sm text-text-secondary mb-3">
        Eyebrow defaults: <code>fact</code> → "Worth noting",
        <code>stat</code> → "Key finding", <code>quote</code> → "Voice".
        Override with <code>eyebrow="..."</code>.
      </p>
      <TuxExample class="mt-4">
        <div class="space-y-6">
          <TuxCallout kind="fact">
            <p>The Texas Triangle's monitored corridors carry an average
            <strong>2.1M vehicles per day</strong> — roughly half of the
            state's total continuously instrumented network.</p>
          </TuxCallout>
          <TuxCallout kind="stat">
            <p>Treated intersections showed a <strong>37% reduction</strong>
            in stop-line non-compliance, sustained through the 36-month
            follow-up window.</p>
          </TuxCallout>
          <TuxCallout kind="quote">
            <p>"What surprised us was the durability of the effect — three
            years out, we expected some regression toward baseline. We didn't
            see it." — <em>Dr. R. Hassan, principal investigator</em></p>
          </TuxCallout>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">style variants</p>
      <h2 class="heading--bold text-xl font-bold">Per-variant left rule</h2>
      <p class="text-sm text-text-secondary mb-3">
        Default = soft-faded maroon hairline. Bold = three stacked bars,
        decreasing in length and opacity. Elegant = 8px diagonal maroon
        hash with vertical fade mask.
      </p>
      <TuxExample class="mt-4">
        <div class="space-y-6">
          <TuxCallout variant="default" kind="fact">
            <p>Default style — the quietest. The hairline rule reads as
            editorial typesetting, not a UI accent.</p>
          </TuxCallout>
          <TuxCallout variant="bold" kind="fact">
            <p>Bold style — three stacked maroon bars. Right for landing
            pages and athletic surfaces where the rest of the page is also
            shouting.</p>
          </TuxCallout>
          <TuxCallout variant="elegant" kind="fact">
            <p>Elegant style — 8px diagonal hash. Right for research
            publications and policy docs, where the rest of the page reads
            as editorial.</p>
          </TuxCallout>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props reference</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>kind</code> — <code>"fact" | "stat" | "quote"</code>. Defaults to <code>"fact"</code>. Sets the eyebrow label.</li>
        <li><code>eyebrow</code> — custom eyebrow string. Overrides <code>kind</code>'s default mapping.</li>
        <li><code>variant</code> — <code>"default" | "bold" | "elegant"</code>. Determines the left-rule signature.</li>
        <li>Default slot — the callout body. <code>&lt;p&gt;</code> tags inside get appropriate spacing.</li>
      </ul>
    </section>
  </div>
</template>
