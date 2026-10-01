<script setup lang="ts">
useHead({ title: "Composition examples · TUX" });

const examples = [
  {
    slug: "landscape-dashboard",
    eyebrow: "product · IT-facing",
    title: "Landscape dashboard",
    blurb: "Index overview for a research-IT product (Landscape). Sidebar shell + KPI row with deltas + inline ingest-rate sparkline + treemap + faceted file search + right-rail activity + active-agents tile. Composes TuxBreadcrumbs, TuxPageHeader, TuxBigStat, TuxFactoid, TuxSparkline, TuxAlert, TuxTreemap, TuxFilterPanel, TuxSearch, TuxBadge, TuxPagination, TuxSectionHeader, TuxDescriptionList, TuxCard, and the sidebar layout primitives (UDashboardSidebarToggle, UNavigationMenu).",
    components: 15,
  },
  {
    slug: "ops-board",
    eyebrow: "product · operations",
    title: "Ops board",
    blurb: "Monitoring pane: status chips, row tints, gold heading keyline, hairline table. Composes TuxStatus, TuxSparkline, and kit/css/tux-ops.css — the overlay class API, not a Core fork.",
    components: 4,
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
  {
    slug: "corridor-analytics",
    eyebrow: "product · telemetry & research",
    title: "Corridor analytics",
    blurb: "Connected corridor operations pane for Texas multimodal transportation networks. Composes TuxPageHeader, TuxStatus, TuxSparkline, TuxAlert, TuxBadge, TuxCitationExport, TuxButton, and real-time detector telemetry tables.",
    components: 8,
  },
  {
    slug: "portal-shell",
    eyebrow: "institutional · two-tier shell",
    title: "Connected transportation portal",
    blurb: "Turnkey institutional portal layout shell matching tti.tamu.edu. Composes TuxPortalShell + TuxPortalHeader (two-tier Aggie Maroon utility bar + crisp brand ribbon) + TuxBreadcrumbs with Warm Gold accent rule + TuxButton (Kadence sharp profile) + floating feedback pill + institutional TuxFooter.",
    components: 7,
  },
  {
    slug: "legacy-bridge",
    eyebrow: "modernization · zero-js stylesheet",
    title: "Legacy bridge & WCAG 2.2 AAA",
    blurb: "Zero-JavaScript drop-in stylesheet (tux-bridge.css) upgrading legacy PHP, ASP.NET, and WordPress sites to 2026 aesthetics with full WCAG 2.2 Level AAA compliance. Features Before/After toggle and real-time contrast auditor.",
    components: 6,
  },
  {
    slug: "comm-portal",
    eyebrow: "marcom · public redesign parity",
    title: "TTI communications portal",
    blurb: "Flagship public redesign showcase replicating tti.tamu.edu. Composes TuxPortalHeader (Comm mode) + TuxCommHero (diagonal chamfer + maroon slab + gold square) + TuxSectionHeader (two-tone rule) + TuxCapabilityCluster (orbital medallions) + TuxTOC (Comm gold keyline) + TuxButton (Kadence sharp profile).",
    components: 8,
  },
  {
    slug: "intranet-dashboard",
    eyebrow: "internal · my.tti.tamu.edu parity",
    title: "MyTTI intranet portal",
    blurb: "Flagship employee portal reproducing my.tti.tamu.edu. Composes TuxPortalHeader (intranet mode with social icons + MY APPS launcher) + TuxSpectrumRibbon (5-band institutional ribbon) + TuxSpectrumFacts (5-column metric banner) + TuxTileGrid (fundamentals launcher) + TuxEventCalendarRow (green date chips) + TuxFooter.",
    components: 9,
  },
  {
    slug: "atlas",
    eyebrow: "internal · security & audit",
    title: "Atlas policy audit corpus",
    blurb: "Continuous compliance and policy audit console reproducing atlas.tti.tamu.edu. Composes TuxPortalHeader (intranet mode) + TuxSpectrumFacts (telemetry metric banner) + TuxTileGrid (governance suites) + TuxEventCalendarRow (audit milestones) + policy findings ledger.",
    components: 8,
  },
  {
    slug: "forgejo-code",
    eyebrow: "developer · git collaboration",
    title: "TTI Code developer portal",
    blurb: "Self-hosted Git repository portal reproducing code.tti.tamu.edu. Branded in Comm language with sharp buttons, 5-band spectrum division tags, Warm Gold keylines, and eggshell README wells.",
    components: 7,
  },
];
</script>

<template>
  <div class="space-y-10">
    <TuxSectionHeader
      :level="1"
      title="Composition"
      secondary-title="Examples & Showcases"
      variant="two-tone-rule"
      kicker="INSTITUTIONAL SUITES & TEMPLATES"
      subtitle="What TUX enables across TTI's application ecosystem. Each example assembles components into an authentic operational surface under realistic institutional constraints."
    />

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
        (Landscape), marketing/research surfaces (the
        public site, the docs site, program landings), and chat/agent
        product views (tti-ai-studio). Each example here demonstrates
        one of those shapes end-to-end so consumers can see the system
        stretched in the direction they care about.
      </p>
    </section>
  </div>
</template>
