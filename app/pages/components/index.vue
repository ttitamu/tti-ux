<script setup lang="ts">
useHead({ title: "Components · tti-ux" });

const components = [
  { name: "TuxAlert",  to: "/components/alert",  blurb: "Docusaurus-style admonitions — 8 variants including compliance and tip.",                         uses: "UAlert" },
  { name: "TuxBadge",  to: "/components/badge",  blurb: "Classification tiers, scan states, classifier tags, and facet counts.",                             uses: "UBadge" },
  { name: "TuxCard",   to: "/components/card",   blurb: "Static or linked — linked mode has corner-drop hover + appearing arrow.",                           uses: "aggieux (no U-primitive)" },
  { name: "TuxModal",  to: "/components/modal",  blurb: "UModal with editorial rhythm — optional eyebrow, gold-bar underlined title.",                       uses: "UModal" },
  { name: "TuxTable",  to: "/components/table",  blurb: "UTable with aggieux chrome, automatic status-cell rendering via TuxBadge.",                         uses: "UTable" },
];
</script>

<template>
  <div class="space-y-8">
    <section>
      <p class="eyebrow">primitives</p>
      <h1 class="heading--bold text-3xl font-bold">Components</h1>
      <p class="mt-3 max-w-2xl text-text-secondary">
        Five thin wrappers around Nuxt UI primitives. Each adds the TTI flavor
        (maroon brand, gold accents, editorial typography) without forking the
        underlying component — so a11y, theming, and color-mode all keep working.
      </p>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TuxCard v-for="c in components" :key="c.name" :to="c.to">
        <p class="eyebrow">wraps {{ c.uses }}</p>
        <h2 class="text-xl font-bold">{{ c.name }}</h2>
        <p class="mt-2 text-sm text-text-secondary">{{ c.blurb }}</p>
      </TuxCard>
    </section>
  </div>
</template>
