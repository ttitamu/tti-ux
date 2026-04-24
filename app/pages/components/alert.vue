<script setup lang="ts">
useHead({ title: "TuxAlert · tti-ux" });

const variants = [
  "note",
  "tip",
  "info",
  "important",
  "success",
  "warning",
  "danger",
  "compliance",
] as const;
</script>

<template>
  <div class="space-y-10">
    <section>
      <p class="eyebrow">component</p>
      <h1 class="heading--bold text-3xl font-bold">TuxAlert</h1>
      <p class="mt-3 max-w-2xl text-text-secondary">
        Wraps <code>UAlert</code>. Adds a 4px left border in the admonition's
        own color family — Docusaurus-style rhythm that Nuxt UI's <code>subtle</code>
        variant omits by default. <code>important</code> and <code>compliance</code>
        both lean on brand maroon but at different visual weights (subtle vs. solid).
      </p>
    </section>

    <section>
      <p class="eyebrow">all variants</p>
      <h2 class="heading--bold text-xl font-bold">Gallery</h2>
      <div class="mt-4 space-y-3">
        <TuxAlert
          v-for="v in variants"
          :key="v"
          :variant="v"
          :title="v.charAt(0).toUpperCase() + v.slice(1)"
          :description="`This is a ${v} admonition. Left bar picks up the variant's color family.`"
        />
      </div>
    </section>

    <section>
      <p class="eyebrow">title only</p>
      <h2 class="heading--bold text-xl font-bold">Compact form</h2>
      <p class="text-sm text-text-secondary mb-4">
        Omit <code>description</code> for a single-line admonition — good for
        inline heads-up messages in table cells or form fields.
      </p>
      <TuxAlert variant="tip" title="Use `heading--bold` for section titles, not page chrome." />
    </section>

    <section>
      <p class="eyebrow">custom icon</p>
      <h2 class="heading--bold text-xl font-bold">Override icon</h2>
      <TuxAlert
        variant="info"
        icon="lucide:database"
        title="Index scaffolded"
        description="Pass any Lucide icon name via `icon` to override the variant default."
      />
    </section>

    <section>
      <p class="eyebrow">usage</p>
      <h2 class="heading--bold text-xl font-bold">Source</h2>
      <pre class="mt-3 p-4 rounded-md bg-surface-sunken text-xs font-mono overflow-auto border border-surface-border"><code>&lt;tux-alert
  variant="compliance"
  title="Export controlled"
  description="ITAR-designated records. Do not share outside TAMUS."
/&gt;</code></pre>
    </section>
  </div>
</template>
