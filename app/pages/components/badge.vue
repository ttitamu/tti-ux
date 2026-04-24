<script setup lang="ts">
useHead({ title: "TuxBadge · tti-ux" });

const tiers = ["public", "internal", "sensitive", "restricted"] as const;
const statuses = ["queued", "running", "completed", "failed"] as const;
const tags = ["pii:us_ssn", "pii:email", "pii:phone", "license:cc-by", "format:pdf"];

const tiersVue = `<tux-badge tier="public" />
<tux-badge tier="internal" />
<tux-badge tier="sensitive" />
<tux-badge tier="restricted" />`;

const statusVue = `<tux-badge status="queued" />
<tux-badge status="running" />   <!-- spinner renders automatically -->
<tux-badge status="completed" />
<tux-badge status="failed" />`;

const tagsVue = `<tux-badge kind="tag">pii:us_ssn</tux-badge>
<tux-badge kind="tag">pii:email</tux-badge>
<tux-badge kind="tag">license:cc-by</tux-badge>`;

const countVue = `<tux-badge kind="count" :count="42">pdf</tux-badge>
<tux-badge kind="count" :count="11">md</tux-badge>
<tux-badge kind="count" :count="1204">csv</tux-badge>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxBadge">
      Five shapes over one <code>UBadge</code>: classification tier, scan status
      (with spinner on <code>running</code>), classifier tag (mono + outline),
      facet-plus-count, and a plain default.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">tiers</p>
      <h2 class="heading--bold text-xl font-bold">Classification tier</h2>
      <TuxExample class="mt-4" :vue="tiersVue">
        <div class="flex flex-wrap gap-2">
          <TuxBadge v-for="t in tiers" :key="t" :tier="t" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">state</p>
      <h2 class="heading--bold text-xl font-bold">Scan status</h2>
      <TuxExample class="mt-4" :vue="statusVue">
        <div class="flex flex-wrap gap-2">
          <TuxBadge v-for="s in statuses" :key="s" :status="s" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">classifier output</p>
      <h2 class="heading--bold text-xl font-bold">Tags</h2>
      <p class="text-sm text-text-secondary mb-3">
        Monospace + outline to read as machine tokens, not editorial copy.
      </p>
      <TuxExample :vue="tagsVue">
        <div class="flex flex-wrap gap-2">
          <TuxBadge v-for="t in tags" :key="t" kind="tag">{{ t }}</TuxBadge>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">facet · count</p>
      <h2 class="heading--bold text-xl font-bold">Counts</h2>
      <TuxExample class="mt-4" :vue="countVue">
        <div class="flex flex-wrap gap-2">
          <TuxBadge kind="count" :count="42">pdf</TuxBadge>
          <TuxBadge kind="count" :count="11">md</TuxBadge>
          <TuxBadge kind="count" :count="3">xlsx</TuxBadge>
          <TuxBadge kind="count" :count="1204">csv</TuxBadge>
        </div>
      </TuxExample>
    </section>
  </div>
</template>
