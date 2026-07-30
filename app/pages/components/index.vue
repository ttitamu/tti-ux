<script setup lang="ts">
useHead({ title: "Components · TUX" });

// Card grid derives from the single catalog source (app/utils/tuxCatalog.ts);
// tests/tux-catalog.test.ts guarantees every shipped component appears here.
const components = tuxCatalog.map((e) => ({
  name: e.name,
  to: e.to,
  uses: e.wraps,
  blurb: e.blurb,
}));
</script>

<template>
  <div class="space-y-8">
    <TuxPageHeader eyebrow="primitives" title="Components">
      Thin wrappers around Nuxt UI primitives. Each adds the TTI flavor
      (maroon brand, gold accents, editorial typography) without forking the
      underlying component — so a11y, theming, and color-mode all keep working.
    </TuxPageHeader>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TuxCard v-for="c in components" :key="c.name" :to="c.to">
        <p class="eyebrow">wraps {{ c.uses }}</p>
        <h2 class="text-xl font-bold">{{ c.name }}</h2>
        <p class="mt-2 text-sm text-text-secondary">{{ c.blurb }}</p>
      </TuxCard>
    </section>
  </div>
</template>
