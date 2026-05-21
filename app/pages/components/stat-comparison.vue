<script setup lang="ts">
useHead({ title: "TuxStatComparison · TUX" });

const basicVue = `<tux-stat-comparison
  eyebrow="indexed corpus"
  :current="47.2"
  :previous="45.8"
  suffix=" TB"
  label="vs last week"
/>`;

const invertedVue = `<!-- Inverted polarity: down is good -->
<tux-stat-comparison
  eyebrow="median response time"
  :current="180"
  :previous="240"
  suffix=" ms"
  label="vs last release"
  polarity="invert"
/>`;

const stackedVue = `<tux-stat-comparison
  eyebrow="active sessions"
  :current="8"
  :previous="6"
  :decimals="0"
  label="vs yesterday"
  layout="stack"
/>`;

const inlineVue = `<!-- Inline layout — for KPI rows next to other stats -->
<tux-stat-comparison
  :current="412"
  :previous="389"
  :decimals="0"
  label="files tracked"
  layout="inline"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · data" title="TuxStatComparison">
      One headline metric with a comparison reading. Pairs with
      <code>TuxBigStat</code> (value + label, no comparison) and
      <code>TuxFactoid</code> (row of stats, no comparison logic).
      Use this when the comparison reading is the point —
      "we moved by X." Direction-aware: up + good = success (green);
      down + good (latency, error rate) = success too via
      <code>polarity="invert"</code>.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · direct polarity</p>
      <h2 class="heading--bold text-xl font-bold">Indexed corpus growth</h2>
      <TuxExample class="mt-4" :vue="basicVue">
        <TuxStatComparison
          eyebrow="indexed corpus"
          :current="47.2"
          :previous="45.8"
          suffix=" TB"
          label="vs last week"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">inverted polarity</p>
      <h2 class="heading--bold text-xl font-bold">Latency improvement</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        For metrics where going <em>down</em> is good (response time,
        error rate, cost), pass <code>polarity="invert"</code>. The
        delta direction reads the same, but the tone flips to success
        for a downward move.
      </p>
      <TuxExample class="mt-4" :vue="invertedVue">
        <TuxStatComparison
          eyebrow="median response time"
          :current="180"
          :previous="240"
          suffix=" ms"
          label="vs last release"
          polarity="invert"
          :decimals="0"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">stack layout</p>
      <h2 class="heading--bold text-xl font-bold">For narrow tiles</h2>
      <TuxExample class="mt-4" :vue="stackedVue">
        <TuxStatComparison
          eyebrow="active sessions"
          :current="8"
          :previous="6"
          :decimals="0"
          label="vs yesterday"
          layout="stack"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">inline · KPI rows</p>
      <h2 class="heading--bold text-xl font-bold">Compact format</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Use <code>layout="inline"</code> when a row of comparisons sits
        in a tight KPI strip. Smaller value, smaller delta pill,
        single-line layout.
      </p>
      <TuxExample class="mt-4" :vue="inlineVue">
        <div class="space-y-2">
          <TuxStatComparison
            :current="412"
            :previous="389"
            :decimals="0"
            label="files tracked"
            layout="inline"
          />
          <TuxStatComparison
            :current="14"
            :previous="22"
            :decimals="0"
            label="errors / hr"
            layout="inline"
            polarity="invert"
          />
          <TuxStatComparison
            :current="100"
            :previous="100"
            :decimals="0"
            label="uptime · 30d"
            layout="inline"
            suffix="%"
          />
        </div>
      </TuxExample>
    </section>
  </div>
</template>
