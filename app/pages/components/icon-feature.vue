<script setup lang="ts">
useHead({ title: "TuxIconFeature · tti-ux" });

const items = [
  {
    icon: "lucide:radar",
    title: "Connected & Automated Vehicles",
    body: "Field-deployed sensor networks across the Texas Triangle, with longitudinal corridor data feeding both safety research and policy frameworks.",
    cta: { label: "Browse program", to: "/research/cav" },
  },
  {
    icon: "lucide:shield-check",
    title: "Roadway Safety",
    body: "Twelve-county before/after studies on rural intersection treatments. Outcomes tracked through 36-month follow-up windows for durability.",
    cta: { label: "Browse program", to: "/research/safety" },
  },
  {
    icon: "lucide:line-chart",
    title: "Mobility & Economics",
    body: "Equity-weighted outcome measures for state DOT performance frameworks. Validated against three years of corridor data.",
    cta: { label: "Browse program", to: "/research/mobility" },
  },
  {
    icon: "lucide:landmark",
    title: "Policy Research",
    body: "Translation of research findings into actionable guidance for TxDOT, FHWA, and member institutions.",
    cta: { label: "Browse program", to: "/research/policy" },
  },
];

const exampleVue = `<TuxIconFeature :items="items" :columns="3" />`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxIconFeature">
      The "our services" / "focus areas" block. Each item: a Lucide icon
      in a tinted circle, a short headline, a 1–2-sentence body, and an
      optional CTA link. Two layouts: <strong>grid</strong> (cards, 2/3/4
      columns) for landing pages, and <strong>list</strong> (vertical
      stack, icons left) for sidebars and inline content.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Grid · 3-up</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxIconFeature :items="items.slice(0, 3)" :columns="3" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">grid · 4-up</p>
      <h2 class="heading--bold text-xl font-bold">Compact · four columns</h2>
      <TuxExample class="mt-4">
        <TuxIconFeature :items="items" :columns="4" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">list layout</p>
      <h2 class="heading--bold text-xl font-bold">Sidebar / inline</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>layout="list"</code>. Icons are smaller, copy is denser,
        items are separated by hairlines. Right for sidebars and inline
        content where a marketing-y grid would feel out of place.
      </p>
      <TuxExample class="mt-4">
        <div class="max-w-md">
          <TuxIconFeature layout="list" :items="items" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">tones</p>
      <h2 class="heading--bold text-xl font-bold">Maroon / gold / navy cycling</h2>
      <p class="text-sm text-text-secondary mb-3">
        Icon circles cycle through three tones automatically. Override per
        item with <code>tone</code> if a specific item needs to break the
        cycle.
      </p>
      <TuxExample class="mt-4">
        <TuxIconFeature
          :items="[
            { icon: 'lucide:flag',   title: 'Maroon',    body: 'Default brand color — primary tone.', tone: 'maroon' },
            { icon: 'lucide:star',   title: 'Gold',      body: 'Accent tone — for emphasis.',          tone: 'gold' },
            { icon: 'lucide:anchor', title: 'Navy',      body: 'Secondary brand color.',               tone: 'navy' },
          ]"
          :columns="3"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + item shape</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>items</code> — array. Required.</li>
        <li>Each item — <code>{ icon, title, body?, cta?, tone? }</code>.</li>
        <li><code>icon</code> — Lucide icon name (<code>"lucide:radar"</code>).</li>
        <li><code>cta</code> — <code>{ label, to?, href? }</code>. Renders as a small "Read more →" link.</li>
        <li><code>tone</code> — <code>"maroon" | "gold" | "navy"</code>. Cycles automatically if omitted.</li>
        <li><code>layout</code> — <code>"grid" | "list"</code>. Defaults to <code>"grid"</code>.</li>
        <li><code>columns</code> — <code>2 | 3 | 4</code>. Grid layout only.</li>
      </ul>
    </section>
  </div>
</template>
