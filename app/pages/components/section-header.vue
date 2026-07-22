<script setup lang="ts">
useHead({ title: "TuxSectionHeader · TUX" });

const level1Vue = `<tux-section-header :level="1" subtitle="Level 1 — the biggest">
  Research grants overview
</tux-section-header>`;

const level2Vue = `<tux-section-header :level="2" subtitle="Level 2 — default">
  Classification tiers
</tux-section-header>`;

const level3Vue = `<tux-section-header :level="3">Tag namespaces</tux-section-header>`;

const subtitleVue = `<tux-section-header :level="2" subtitle="4,218 documents across 17 indices">
  Index catalog
</tux-section-header>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxSectionHeader">
      The tux editorial heading — ALL-CAPS, tracked-out, maroon underline rule.
      Distinct from <code>heading--bold</code> (which uses a gold bar) and
      <code>heading--display</code> (italic maximalist). Use this for mid-page
      section titles inside a longer document — it's quieter than the gold-bar
      headings and reads as rhythmic navigation between sections.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">level 1</p>
      <h2 class="heading--bold text-xl font-bold">Biggest section heading</h2>
      <TuxExample class="mt-4" :vue="level1Vue">
        <TuxSectionHeader :level="1" subtitle="Level 1 — the biggest">
          Research grants overview
        </TuxSectionHeader>
      </TuxExample>
      <p class="mt-3 text-sm text-text-secondary">
        <code>level="1"</code> renders as <code>&lt;h1&gt;</code> with
        <code>text-2xl</code>. Use for page sections that stand in for the
        main document heading.
      </p>
    </section>

    <section>
      <p class="eyebrow">level 2 (default)</p>
      <h2 class="heading--bold text-xl font-bold">Default section heading</h2>
      <TuxExample class="mt-4" :vue="level2Vue">
        <TuxSectionHeader :level="2" subtitle="Level 2 — default">
          Classification tiers
        </TuxSectionHeader>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">level 3</p>
      <h2 class="heading--bold text-xl font-bold">Smallest variant</h2>
      <TuxExample class="mt-4" :vue="level3Vue">
        <TuxSectionHeader :level="3">Tag namespaces</TuxSectionHeader>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">with subtitle</p>
      <h2 class="heading--bold text-xl font-bold">Metadata below the bar</h2>
      <TuxExample class="mt-4" :vue="subtitleVue">
        <TuxSectionHeader :level="2" subtitle="4,218 documents across 17 indices">
          Index catalog
        </TuxSectionHeader>
      </TuxExample>
      <p class="mt-3 text-sm text-text-secondary">
        <code>subtitle</code> renders as smaller secondary text beneath the heading
        — good for counts, timestamps, or "last updated" metadata.
      </p>
    </section>
  </div>
</template>
