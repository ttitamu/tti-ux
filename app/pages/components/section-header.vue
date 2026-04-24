<script setup lang="ts">
useHead({ title: "TuxSectionHeader · tti-ux" });
</script>

<template>
  <div class="space-y-10">
    <section>
      <p class="eyebrow">component</p>
      <h1 class="heading--bold text-3xl font-bold">TuxSectionHeader</h1>
      <p class="mt-3 max-w-2xl text-text-secondary">
        The aggieux editorial heading — ALL-CAPS, tracked-out, maroon underline rule.
        Distinct from <code>heading--bold</code> (which uses a gold bar) and
        <code>heading--display</code> (italic maximalist). Use this for mid-page
        section titles inside a longer document — it's quieter than the gold-bar
        headings and reads as rhythmic navigation between sections.
      </p>
    </section>

    <section>
      <TuxSectionHeader :level="1" subtitle="Level 1 — the biggest">
        Research grants overview
      </TuxSectionHeader>
      <p class="text-text-secondary max-w-2xl">
        <code>:level="1"</code> renders as <code>&lt;h1&gt;</code> with
        <code>text-2xl</code>. Use for page sections that stand in for the
        main document heading.
      </p>
    </section>

    <section>
      <TuxSectionHeader :level="2" subtitle="Level 2 — default">
        Classification tiers
      </TuxSectionHeader>
      <p class="text-text-secondary max-w-2xl">
        <code>:level="2"</code> is the default — <code>text-lg</code>. Use for the
        top-level sections inside a page, where you'd otherwise reach for an h2.
      </p>
    </section>

    <section>
      <TuxSectionHeader :level="3">Tag namespaces</TuxSectionHeader>
      <p class="text-text-secondary max-w-2xl">
        <code>:level="3"</code> is <code>text-sm</code>. Small, tight, great for
        nested sub-sections inside a card or alongside a table.
      </p>
    </section>

    <section>
      <TuxSectionHeader :level="2" subtitle="4,218 documents across 17 indices">
        Index catalog
      </TuxSectionHeader>
      <p class="text-sm text-text-secondary max-w-2xl">
        <code>subtitle</code> renders as smaller secondary text beneath the heading
        — good for counts, timestamps, or "last updated" metadata.
      </p>
    </section>

    <section>
      <p class="eyebrow">usage</p>
      <h2 class="heading--bold text-xl font-bold">Source</h2>
      <pre v-pre class="mt-3 p-4 rounded-md bg-surface-sunken text-xs font-mono overflow-auto border border-surface-border"><code>&lt;tux-section-header :level="1" subtitle="Q1 2026"&gt;
  Research grants
&lt;/tux-section-header&gt;

&lt;tux-section-header :level="2"&gt;Classifications&lt;/tux-section-header&gt;

&lt;tux-section-header :level="3"&gt;Tag namespaces&lt;/tux-section-header&gt;</code></pre>
    </section>
  </div>
</template>
