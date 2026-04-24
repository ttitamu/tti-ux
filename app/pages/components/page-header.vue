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
  </div>
</template>
