<script setup lang="ts">
useHead({ title: "TuxBadge · tti-ux" });

const tiers = ["public", "internal", "sensitive", "restricted"] as const;
const statuses = ["queued", "running", "completed", "failed"] as const;
const tags = ["pii:us_ssn", "pii:email", "pii:phone", "license:cc-by", "format:pdf"];
</script>

<template>
  <div class="space-y-10">
    <section>
      <p class="eyebrow">component</p>
      <h1 class="heading--bold text-3xl font-bold">TuxBadge</h1>
      <p class="mt-3 max-w-2xl text-text-secondary">
        Five shapes over one <code>UBadge</code>: classification tier, scan status
        (with spinner on <code>running</code>), classifier tag (mono + outline),
        facet-plus-count, and a plain default.
      </p>
    </section>

    <section>
      <p class="eyebrow">tiers</p>
      <h2 class="heading--bold text-xl font-bold">Classification tier</h2>
      <div class="mt-4 flex flex-wrap gap-2">
        <TuxBadge v-for="t in tiers" :key="t" :tier="t" />
      </div>
    </section>

    <section>
      <p class="eyebrow">state</p>
      <h2 class="heading--bold text-xl font-bold">Scan status</h2>
      <div class="mt-4 flex flex-wrap gap-2">
        <TuxBadge v-for="s in statuses" :key="s" :status="s" />
      </div>
    </section>

    <section>
      <p class="eyebrow">classifier output</p>
      <h2 class="heading--bold text-xl font-bold">Tags</h2>
      <p class="text-sm text-text-secondary mb-3">
        Monospace + outline to read as machine tokens, not editorial copy.
      </p>
      <div class="flex flex-wrap gap-2">
        <TuxBadge v-for="t in tags" :key="t" kind="tag">{{ t }}</TuxBadge>
      </div>
    </section>

    <section>
      <p class="eyebrow">facet · count</p>
      <h2 class="heading--bold text-xl font-bold">Counts</h2>
      <div class="mt-4 flex flex-wrap gap-2">
        <TuxBadge kind="count" :count="42">pdf</TuxBadge>
        <TuxBadge kind="count" :count="11">md</TuxBadge>
        <TuxBadge kind="count" :count="3">xlsx</TuxBadge>
        <TuxBadge kind="count" :count="1204">csv</TuxBadge>
      </div>
    </section>

    <section>
      <p class="eyebrow">usage</p>
      <h2 class="heading--bold text-xl font-bold">Source</h2>
      <pre class="mt-3 p-4 rounded-md bg-surface-sunken text-xs font-mono overflow-auto border border-surface-border"><code>&lt;tux-badge tier="sensitive" /&gt;
&lt;tux-badge status="running" /&gt;
&lt;tux-badge kind="tag"&gt;pii:us_ssn&lt;/tux-badge&gt;
&lt;tux-badge kind="count" :count="11"&gt;md&lt;/tux-badge&gt;</code></pre>
    </section>
  </div>
</template>
