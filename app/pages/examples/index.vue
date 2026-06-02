<script setup lang="ts">
useHead({ title: "Composition examples · TUX" });

const examples = [
  {
    slug: "landscape-dashboard",
    eyebrow: "product · IT-facing",
    title: "Landscape dashboard",
    blurb: "Index overview for a research-IT product (Landscape, formerly PECAN). Sidebar shell + KPI row with deltas + inline ingest-rate sparkline + treemap + faceted file search + right-rail activity + active-agents tile. Composes TuxBreadcrumbs, TuxPageHeader, TuxBigStat, TuxFactoid, TuxSparkline, TuxAlert, TuxTreemap, TuxFilterPanel, TuxSearch, TuxBadge, TuxPagination, TuxSectionHeader, TuxDescriptionList, TuxCard, and the sidebar layout primitives (UDashboardSidebarToggle, UNavigationMenu).",
    components: 15,
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
  {
    slug: "sidebar-shell",
    eyebrow: "layout · app shell",
    title: "Sidebar shell",
    blurb: "Demonstrates `app/layouts/sidebar.vue` — the opt-in app-shell layout built on UDashboardGroup + UDashboardSidebar + UDashboardPanel. Four named slots (header, rail-header, rail, rail-footer) + default content. Try resizing.",
    components: 5,
  },
  {
    slug: "paper-page",
    eyebrow: "publishing · academic article",
    title: "Research paper",
    blurb: "Full editorial-research paper page exercising the research-publishing cluster end-to-end. Composes TuxPageHeader + TuxAuthorByline + TuxPaperMeta + TuxAbstract + TuxChartLine (inside TuxFigureCaption) + TuxTableCaption + TuxCorridorStrip + TuxFootnote (inline + bottom list) + TuxCitationExport (6 formats) + TuxAcknowledgments + TuxCenterBadge + TuxFundingSource.",
    components: 12,
  },
  {
    slug: "center-landing",
    eyebrow: "marketing · TTI identity",
    title: "TTI center landing",
    blurb: "Mobility Division landing page exercising the TTI identity cluster end-to-end. TuxLab as hero, TuxResearcher × 3 featured, TuxProgram × 3 active programs, TuxFundingSource strip, TuxCenterBadge throughout (including cross-division links to the other five TTI centers).",
    components: 8,
  },
];
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="examples" title="Composition examples">
      What the system enables. Each example assembles 9–13 Tux*
      components into a real-shape surface — a Landscape dashboard, a
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
        <h2 class="text-xl font-bold">{{ ex.title }}</h2>
        <p class="mt-2 text-sm text-text-secondary leading-relaxed">{{ ex.blurb }}</p>
        <p class="mt-3 font-mono text-xs text-text-muted">
          {{ ex.components }} Tux* components
        </p>
      </TuxCard>
    </section>

    <section class="space-y-3">
      <TuxSectionHeader>Why these three</TuxSectionHeader>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        tux serves three product shapes: data-dense IT chrome
        (Landscape, formerly PECAN), marketing/research surfaces (the
        public site, the docs site, program landings), and chat/agent
        product views (tti-ai-studio). Each example here demonstrates
        one of those shapes end-to-end so consumers can see the system
        stretched in the direction they care about.
      </p>
    </section>
  </div>
</template>
