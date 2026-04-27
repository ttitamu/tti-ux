<script setup lang="ts">
useHead({ title: "Composition examples · tti-ux" });

const examples = [
  {
    slug: "pecan-dashboard",
    eyebrow: "product · IT-facing",
    title: "PECAN dashboard",
    blurb: "Index overview for a research-IT product. Composes TuxBreadcrumbs, TuxPageHeader (with media slot), TuxFactoid, TuxAlert, TuxTreemap, TuxFilterPanel, TuxSearch, TuxBadge, TuxPagination, TuxDescriptionList, TuxSectionHeader, and TuxCallout.",
    components: 13,
  },
  {
    slug: "research-landing",
    eyebrow: "marketing · public",
    title: "Research program landing",
    blurb: "Public-facing research-program hero. Composes TuxPageHeader (hero), TuxFactoid, TuxBlockquote, TuxMediaSlab, TuxIconFeature, TuxCardSlab, TuxNewsCollection, TuxTestimonial, TuxCTA, and TuxLinkList.",
    components: 10,
  },
  {
    slug: "tti-ai-studio-session",
    eyebrow: "product · chat",
    title: "tti-ai-studio session",
    blurb: "LLM/agent session view. Composes TuxBreadcrumbs, TuxPageHeader, TuxAlert (compliance), TuxSectionHeader, TuxCallout, TuxDescriptionList, TuxFactoid, TuxAccordion, and TuxCommandPalette.",
    components: 9,
  },
];
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="examples" title="Composition examples">
      What the system enables. Each example assembles 9–13 Tux*
      components into a real-shape surface — a PECAN dashboard, a
      research-program landing, a tti-ai-studio session. Data is
      illustrative; the goal is to show how the components compose
      under realistic constraints, not to ship working product views.
    </TuxPageHeader>

    <p class="text-sm text-text-secondary leading-relaxed max-w-2xl">
      If you're trying to figure out what tux is <em>for</em>, start
      here. The component-detail pages show each Tux* in isolation;
      these examples show them together at the density and rhythm of
      real product surfaces.
    </p>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <TuxCard
        v-for="ex in examples"
        :key="ex.slug"
        :to="`/examples/${ex.slug}`"
      >
        <p class="eyebrow">{{ ex.eyebrow }}</p>
        <h3 class="text-xl font-bold">{{ ex.title }}</h3>
        <p class="mt-2 text-sm text-text-secondary leading-relaxed">{{ ex.blurb }}</p>
        <p class="mt-3 font-mono text-xs text-text-muted">
          {{ ex.components }} Tux* components
        </p>
      </TuxCard>
    </section>

    <section class="space-y-3">
      <TuxSectionHeader>Why these three</TuxSectionHeader>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        tux serves three product shapes: data-dense IT chrome (PECAN),
        marketing/research surfaces (the public site, the docs site,
        program landings), and chat/agent product views
        (tti-ai-studio). Each example here demonstrates one of those
        shapes end-to-end so consumers can see the system stretched in
        the direction they care about.
      </p>
    </section>
  </div>
</template>
