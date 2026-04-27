<script setup lang="ts">
import tuxPageHeaderSource from "~/components/TuxPageHeader.vue?raw";

useHead({ title: "TuxPageHeader · tti-ux" });

const basicVue = `<tux-page-header eyebrow="primitives" title="TuxButton">
  Wraps <code>UButton</code>. The <code>intent</code> prop picks one of four
  TTI-conventional combinations so call sites don't juggle colors and classes.
</tux-page-header>`;

const noSubtitleVue = `<tux-page-header eyebrow="foundations" title="Tokens" />`;

const h2Vue = `<tux-page-header :level="2" eyebrow="inner section" title="Classification tiers">
  When the page already has an h1 elsewhere (e.g. inside a dashboard tile),
  use <code>:level="2"</code> to drop to h2 without changing visual weight.
</tux-page-header>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxPageHeader">
      Composite: eyebrow label above a gold-bar heading, with optional body copy
      underneath in muted text. This is the rhythm most pages open with —
      extracted so we stop hand-rolling the same three-line dance.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Eyebrow + title + body</h2>
      <TuxExample class="mt-4" :vue="basicVue" :source="tuxPageHeaderSource">
        <TuxPageHeader eyebrow="primitives" title="TuxButton">
          Wraps <code>UButton</code>. The <code>intent</code> prop picks one of four
          TTI-conventional combinations so call sites don't juggle colors and classes.
        </TuxPageHeader>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">no subtitle</p>
      <h2 class="heading--bold text-xl font-bold">Just the heading</h2>
      <p class="text-sm text-text-secondary mb-3">
        Omit the default slot for a bare eyebrow + heading — use when the page
        body starts immediately after.
      </p>
      <TuxExample :vue="noSubtitleVue">
        <TuxPageHeader eyebrow="foundations" title="Tokens" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">nested</p>
      <h2 class="heading--bold text-xl font-bold">Level 2</h2>
      <TuxExample class="mt-4" :vue="h2Vue">
        <TuxPageHeader :level="2" eyebrow="inner section" title="Classification tiers">
          When the page already has an h1 elsewhere, use <code>:level="2"</code>
          to drop to h2 without changing visual weight.
        </TuxPageHeader>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">tone — neutral</p>
      <h2 class="heading--bold text-xl font-bold">Sunken-gray panel</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>tone="neutral"</code> for a softly distinct page header —
        useful when the page has rich body content and the header should
        read as separate from it.
      </p>
      <TuxExample>
        <TuxPageHeader
          tone="neutral"
          eyebrow="research"
          title="Roadway safety program"
        >
          Twelve-county before/after studies on rural intersection
          treatments. Outcomes tracked through 36-month follow-up windows
          for durability.
          <template #actions>
            <TuxButton intent="primary">Browse projects</TuxButton>
            <TuxButton intent="ghost">Read the report</TuxButton>
          </template>
        </TuxPageHeader>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">tone — maroon · rhythm — hero</p>
      <h2 class="heading--bold text-xl font-bold">Marketing landing surface</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>tone="maroon"</code> + <code>rhythm="hero"</code> for the
        loudest possible opener — brand-colored panel, oversized heading,
        inverted text. Use sparingly; this is for the very top of a
        landing page, not interior chrome.
      </p>
      <TuxExample>
        <TuxPageHeader
          tone="maroon"
          rhythm="hero"
          eyebrow="research"
          title="Connected & Automated Vehicles"
        >
          Field-deployed sensor networks across the Texas Triangle, with
          longitudinal corridor data feeding both safety research and
          policy frameworks.
          <template #actions>
            <TuxButton intent="primary">Browse program</TuxButton>
            <TuxButton intent="ghost">Read the 2025 report</TuxButton>
          </template>
        </TuxPageHeader>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">media slot</p>
      <h2 class="heading--bold text-xl font-bold">Two-column with quick fact</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass content into the <code>#media</code> slot to anchor a column
        on the right (≥48rem). Common uses: a quick-fact callout, a hero
        image, or a TuxBigStat anchoring the headline number.
      </p>
      <TuxExample>
        <TuxPageHeader
          tone="neutral"
          rhythm="hero"
          eyebrow="program"
          title="MovementLab"
        >
          Continuous instrumentation of the Texas Triangle freight network.
          Real-time corridor data feeds both research and operational
          decisions.
          <template #media>
            <TuxBigStat
              :value="412"
              suffix=" mi"
              label="Continuously instrumented corridor"
              tone="maroon"
              size="lg"
            />
          </template>
        </TuxPageHeader>
      </TuxExample>
    </section>
  </div>
</template>
