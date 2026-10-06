<script setup lang="ts">
/**
 * Composition Examples & Application Suites Gallery — TUX
 *
 * Showcases 15 production page compositions, operational telemetry boards,
 * public marcom portals, and enterprise intranet suites built with native
 * TUX components.
 */

useHead({ title: "Composition Examples & Application Suites · TUX" });

interface ExampleEntry {
  slug: string;
  eyebrow: string;
  title: string;
  category: "ops" | "marcom" | "intranet" | "publishing" | "shells";
  categoryLabel: string;
  archetype: string;
  blurb: string;
  componentsCount: number;
  featuredComponents: string[];
  kitId?: string;
}

const examples: ExampleEntry[] = [
  {
    slug: "landscape-dashboard",
    eyebrow: "product · IT-facing",
    title: "Landscape dashboard",
    category: "ops",
    categoryLabel: "Operational Telemetry",
    archetype: "High-Density Operations",
    blurb: "Index overview for a research-IT product (Landscape). Sidebar shell + KPI row with deltas + inline ingest-rate sparkline + treemap + faceted file search + right-rail activity + active-agents tile.",
    componentsCount: 15,
    featuredComponents: ["TuxBreadcrumbs", "TuxFactoid", "TuxSparkline", "TuxAlert", "TuxTreemap", "TuxFilterPanel", "TuxSearch"],
    kitId: "landscape",
  },
  {
    slug: "ops-board",
    eyebrow: "product · operations",
    title: "Ops board",
    category: "ops",
    categoryLabel: "Operational Telemetry",
    archetype: "High-Density Operations",
    blurb: "Monitoring pane: status chips, row tints, gold heading keyline, hairline table. Composes TuxStatus, TuxSparkline, and kit/css/tux-ops.css — the overlay class API, not a Core fork.",
    componentsCount: 4,
    featuredComponents: ["TuxStatus", "TuxSparkline", "tux-ops.css", "TuxBadge"],
    kitId: "ops-board",
  },
  {
    slug: "corridor-analytics",
    eyebrow: "product · telemetry & research",
    title: "Corridor analytics",
    category: "ops",
    categoryLabel: "Operational Telemetry",
    archetype: "High-Density Operations",
    blurb: "Connected corridor operations pane for Texas multimodal transportation networks. Composes TuxPageHeader, TuxStatus, TuxSparkline, TuxAlert, TuxBadge, TuxCitationExport, TuxButton, and real-time detector telemetry tables.",
    componentsCount: 8,
    featuredComponents: ["TuxStatus", "TuxSparkline", "TuxCitationExport", "TuxAlert", "TuxBadge"],
    kitId: "corridor",
  },
  {
    slug: "comm-portal",
    eyebrow: "marcom · public redesign parity",
    title: "TTI communications portal",
    category: "marcom",
    categoryLabel: "Public & Marcom",
    archetype: "Public Brand & Editorial",
    blurb: "Flagship public redesign showcase replicating tti.tamu.edu. Composes TuxPortalHeader (Comm mode) + TuxCommHero (diagonal chamfer + maroon slab + gold square) + TuxSectionHeader (two-tone rule) + TuxCapabilityCluster (orbital medallions) + TuxTOC (Comm gold keyline) + TuxButton (Kadence sharp profile).",
    componentsCount: 8,
    featuredComponents: ["TuxPortalHeader", "TuxCommHero", "TuxSectionHeader", "TuxCapabilityCluster", "TuxTOC", "TuxButton"],
    kitId: "comm-portal",
  },
  {
    slug: "research-landing",
    eyebrow: "marketing · public",
    title: "Research program landing",
    category: "marcom",
    categoryLabel: "Public & Marcom",
    archetype: "Public Brand & Editorial",
    blurb: "Public-facing research-program hero. Composes TuxPageHeader (hero), TuxFactoid, TuxBlockquote, TuxMediaSlab, TuxIconFeature, TuxCardSlab, TuxNewsCollection, TuxTestimonial, TuxCTA, and TuxLinkList.",
    componentsCount: 10,
    featuredComponents: ["TuxPageHeader", "TuxFactoid", "TuxBlockquote", "TuxMediaSlab", "TuxNewsCollection", "TuxCTA"],
  },
  {
    slug: "center-landing",
    eyebrow: "marketing · TTI identity",
    title: "TTI center landing",
    category: "marcom",
    categoryLabel: "Public & Marcom",
    archetype: "Public Brand & Editorial",
    blurb: "Mobility Division landing page exercising the TTI identity cluster end-to-end. TuxLab as hero, TuxResearcher × 3 featured, TuxProgram × 3 active programs, TuxFundingSource strip, TuxCenterBadge throughout (including cross-division links to the other five TTI centers).",
    componentsCount: 8,
    featuredComponents: ["TuxPageHeader", "TuxFactoid", "TuxCard", "TuxBadge", "TuxButton"],
  },
  {
    slug: "portal-shell",
    eyebrow: "institutional · two-tier shell",
    title: "Connected transportation portal",
    category: "marcom",
    categoryLabel: "Public & Marcom",
    archetype: "Public Brand & Editorial",
    blurb: "Institutional portal layout matching tti.tamu.edu conventions. Composes TuxPortalShell + TuxPortalHeader (two-tier maroon utility bar and brand ribbon) + TuxBreadcrumbs + sharp buttons + feedback pill + institutional TuxFooter.",
    componentsCount: 7,
    featuredComponents: ["TuxPortalShell", "TuxPortalHeader", "TuxBreadcrumbs", "TuxFooter", "TuxButton"],
  },
  {
    slug: "intranet-dashboard",
    eyebrow: "internal · my.tti.tamu.edu parity",
    title: "MyTTI intranet portal",
    category: "intranet",
    categoryLabel: "Internal & Intranet",
    archetype: "Internal Enterprise & Operations",
    blurb: "Flagship employee portal reproducing my.tti.tamu.edu. Composes TuxPortalHeader (intranet mode with social icons + MY APPS launcher) + TuxSpectrumRibbon (5-band institutional ribbon) + TuxSpectrumFacts (5-column metric banner) + TuxTileGrid (fundamentals launcher) + TuxEventCalendarRow (green date chips) + TuxFooter.",
    componentsCount: 9,
    featuredComponents: ["TuxPortalHeader", "TuxSpectrumRibbon", "TuxSpectrumFacts", "TuxTileGrid", "TuxEventCalendarRow"],
    kitId: "intranet",
  },
  {
    slug: "atlas",
    eyebrow: "internal · security & audit",
    title: "Atlas policy audit corpus",
    category: "intranet",
    categoryLabel: "Internal & Intranet",
    archetype: "Security, Governance & Audit",
    blurb: "Continuous compliance and policy audit console reproducing atlas.tti.tamu.edu. Composes TuxPortalHeader (intranet mode) + TuxSpectrumFacts (telemetry metric banner) + TuxTileGrid (governance suites) + TuxEventCalendarRow (audit milestones) + policy findings ledger.",
    componentsCount: 8,
    featuredComponents: ["TuxPortalHeader", "TuxSpectrumFacts", "TuxTileGrid", "TuxStatus", "TuxButton"],
    kitId: "atlas",
  },
  {
    slug: "forgejo-code",
    eyebrow: "developer · git collaboration",
    title: "TTI Code developer portal",
    category: "intranet",
    categoryLabel: "Internal & Intranet",
    archetype: "Developer Tools & Code Collaboration",
    blurb: "Self-hosted Git repository portal reproducing code.tti.tamu.edu. Branded in Comm language with sharp buttons, 5-band spectrum division tags, Warm Gold keylines, and eggshell README wells.",
    componentsCount: 7,
    featuredComponents: ["TuxTabs", "TuxBreadcrumbs", "TuxCodeBlock", "TuxButton", "TuxBadge"],
    kitId: "forgejo",
  },
  {
    slug: "paper-page",
    eyebrow: "publishing · academic article",
    title: "Research paper",
    category: "publishing",
    categoryLabel: "Research & Academic",
    archetype: "Research & Academic Publishing",
    blurb: "Full editorial-research paper page exercising the research-publishing cluster end-to-end. Composes TuxPageHeader + TuxAuthorByline + TuxPaperMeta + TuxAbstract + TuxFigureCaption + TuxTableCaption + TuxFootnote + TuxCitationExport + TuxAcknowledgments.",
    componentsCount: 12,
    featuredComponents: ["TuxPageHeader", "TuxAuthorByline", "TuxPaperMeta", "TuxAbstract", "TuxFigureCaption", "TuxCitationExport"],
    kitId: "paper-page",
  },
  {
    slug: "tti-ai-studio-session",
    eyebrow: "product · chat",
    title: "tti-ai-studio session",
    category: "publishing",
    categoryLabel: "Research & Academic",
    archetype: "Conversational & Agentic Workspace",
    blurb: "LLM/agent session view. Composes TuxBreadcrumbs, TuxPageHeader, TuxAlert (compliance), TuxSectionHeader, TuxCallout, TuxDescriptionList, TuxFactoid, TuxAccordion, and TuxCommandPalette.",
    componentsCount: 9,
    featuredComponents: ["TuxAlert", "TuxCommandPalette", "TuxAccordion", "TuxCallout", "TuxFactoid"],
    kitId: "ai-studio",
  },
  {
    slug: "sidebar-shell",
    eyebrow: "layout · app shell",
    title: "Sidebar shell",
    category: "shells",
    categoryLabel: "Layouts & Foundations",
    archetype: "Layout Shells & Foundations",
    blurb: "Demonstrates `app/layouts/sidebar.vue` — the opt-in app-shell layout built on UDashboardGroup + UDashboardSidebar + UDashboardPanel. Four named slots (header, rail-header, rail, rail-footer) + default content. Try resizing.",
    componentsCount: 5,
    featuredComponents: ["UDashboardGroup", "UDashboardSidebar", "UDashboardPanel", "TuxBreadcrumbs"],
  },
  {
    slug: "legacy-bridge",
    eyebrow: "modernization · zero-js stylesheet",
    title: "Legacy bridge & WCAG 2.2 AAA",
    category: "shells",
    categoryLabel: "Layouts & Foundations",
    archetype: "Layout Shells & Foundations",
    blurb: "Zero-JavaScript drop-in stylesheet (tux-bridge.css) upgrading legacy PHP, ASP.NET, and WordPress sites to 2026 aesthetics with full WCAG 2.2 Level AAA compliance. Features Before/After toggle and real-time contrast auditor.",
    componentsCount: 6,
    featuredComponents: ["tux-bridge.css", "TuxBadge", "TuxButton", "TuxCard"],
  },
  {
    slug: "error-pages",
    eyebrow: "resilience · institutional error states",
    title: "System error pages (404, 401, 403, 503, 500)",
    category: "shells",
    categoryLabel: "Layouts & Foundations",
    archetype: "Layout Shells & Foundations",
    blurb: "Full-page editorial error boundaries with 5-band spectrum ribbons, sharp Kadence buttons, diagnostic trace wells, and recovery routing for TTI applications.",
    componentsCount: 4,
    featuredComponents: ["TuxErrorPage", "TuxSpectrumRibbon", "TuxButton", "TuxCodeBlock"],
  },
];

const selectedCategory = ref<string>("all");
const searchQuery = ref<string>("");

const categories = [
  { id: "all", label: "All Compositions", count: examples.length },
  { id: "ops", label: "Operational Telemetry", count: examples.filter((e) => e.category === "ops").length },
  { id: "marcom", label: "Public & Marcom", count: examples.filter((e) => e.category === "marcom").length },
  { id: "intranet", label: "Internal & Intranet", count: examples.filter((e) => e.category === "intranet").length },
  { id: "publishing", label: "Research & Academic", count: examples.filter((e) => e.category === "publishing").length },
  { id: "shells", label: "Layouts & Shells", count: examples.filter((e) => e.category === "shells").length },
];

const filteredExamples = computed(() => {
  return examples.filter((ex) => {
    // Category match
    if (selectedCategory.value !== "all" && ex.category !== selectedCategory.value) {
      return false;
    }
    // Search query match
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase();
      const matchTitle = ex.title.toLowerCase().includes(q);
      const matchBlurb = ex.blurb.toLowerCase().includes(q);
      const matchEyebrow = ex.eyebrow.toLowerCase().includes(q);
      const matchComponents = ex.featuredComponents.some((c) => c.toLowerCase().includes(q));
      return matchTitle || matchBlurb || matchEyebrow || matchComponents;
    }
    return true;
  });
});
</script>

<template>
  <div class="space-y-10">
    <TuxSectionHeader
      :level="1"
      title="Composition"
      secondary-title="Examples & Layouts"
      variant="two-tone-rule"
      kicker="TEMPLATES & REFERENCES"
      subtitle="Complete page layouts and operational surfaces built with TUX components for Texas A&M Transportation Institute applications."
    />

    <!-- Overview Bar & Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="p-4 rounded-md bg-surface-raised border border-surface-border">
        <p class="eyebrow">Composition Gallery</p>
        <p class="text-2xl font-bold text-text-primary mt-1">15 Suites</p>
        <p class="text-xs text-text-muted mt-0.5">End-to-end production pages</p>
      </div>
      <div class="p-4 rounded-md bg-surface-raised border border-surface-border">
        <p class="eyebrow">TUX Component Count</p>
        <p class="text-2xl font-bold text-text-primary mt-1">112 Instances</p>
        <p class="text-xs text-text-muted mt-0.5">Composed across all suites</p>
      </div>
      <div class="p-4 rounded-md bg-surface-raised border border-surface-border">
        <p class="eyebrow">Interactive Viewports</p>
        <p class="text-2xl font-bold text-brand-primary mt-1">100% Tested</p>
        <p class="text-xs text-text-muted mt-0.5">Desktop, tablet, & mobile</p>
      </div>
      <div class="p-4 rounded-md bg-surface-raised border border-surface-border">
        <p class="eyebrow">Workflow Hub</p>
        <NuxtLink to="/kits" class="inline-flex items-center gap-1 text-sm font-bold text-brand-primary mt-2 hover:underline">
          <span>Explore /kits Hub</span>
          <UIcon name="lucide:arrow-right" class="w-4 h-4" />
        </NuxtLink>
        <p class="text-xs text-text-muted mt-0.5">With multi-device stage</p>
      </div>
    </div>

    <!-- Interactive Filters & Search -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-4">
      <!-- Category Tabs -->
      <div class="flex flex-wrap items-center gap-1.5">
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          class="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5"
          :class="selectedCategory === cat.id ? 'bg-brand-primary text-text-on-brand' : 'bg-surface-raised border border-surface-border text-text-secondary hover:text-text-primary hover:border-brand-primary'"
          @click="selectedCategory = cat.id"
        >
          <span>{{ cat.label }}</span>
          <span
            class="text-[10px] px-1.5 py-0.2 rounded-full"
            :class="selectedCategory === cat.id ? 'bg-brand-maroon-light/30 text-text-on-brand' : 'bg-surface-sunken text-text-muted'"
          >
            {{ cat.count }}
          </span>
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative w-full md:w-64">
        <UIcon name="lucide:search" class="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter by title or component..."
          class="w-full pl-9 pr-8 py-1.5 text-xs bg-surface-raised border border-surface-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-primary"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="absolute right-2.5 top-2 text-text-muted hover:text-text-primary text-xs"
          @click="searchQuery = ''"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Active Results Bar -->
    <div class="flex items-center justify-between text-xs text-text-muted">
      <span>Showing {{ filteredExamples.length }} of {{ examples.length }} compositions</span>
      <span v-if="searchQuery">Matching query: "{{ searchQuery }}"</span>
    </div>

    <!-- Compositions Grid -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="ex in filteredExamples"
        :key="ex.slug"
        class="border border-surface-border rounded-lg bg-surface-raised p-6 flex flex-col justify-between hover:border-brand-primary/50 transition-all shadow-sm hover:shadow-md"
      >
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            <span class="eyebrow truncate">{{ ex.eyebrow }}</span>
            <TuxBadge tone="primary" class="shrink-0">{{ ex.archetype }}</TuxBadge>
          </div>

          <NuxtLink :to="`/examples/${ex.slug}`" class="block group">
            <h2 class="text-xl font-bold text-text-primary group-hover:text-brand-primary transition-colors flex items-center justify-between">
              <span>{{ ex.title }}</span>
              <UIcon name="lucide:arrow-right" class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-brand-primary" />
            </h2>
          </NuxtLink>

          <p class="text-sm text-text-secondary leading-relaxed">
            {{ ex.blurb }}
          </p>

          <!-- Featured Components Chips -->
          <div class="space-y-1.5 pt-2">
            <p class="text-[11px] font-mono font-semibold text-text-muted">COMPOSED COMPONENTS ({{ ex.componentsCount }}):</p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="comp in ex.featuredComponents"
                :key="comp"
                class="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-sunken border border-surface-border/60 text-text-secondary"
              >
                {{ comp }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Links Footer -->
        <div class="pt-5 mt-5 border-t border-surface-border flex items-center justify-between">
          <NuxtLink
            :to="`/examples/${ex.slug}`"
            class="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
          >
            <span>Launch Suite</span>
            <UIcon name="lucide:arrow-right" class="w-3.5 h-3.5" />
          </NuxtLink>

          <NuxtLink
            v-if="ex.kitId"
            :to="`/kits?suite=${ex.kitId}`"
            class="text-xs text-text-muted hover:text-text-primary flex items-center gap-1"
            title="Inspect in Kits Viewport Simulator"
          >
            <span>Simulate in /kits</span>
            <UIcon name="lucide:monitor" class="w-3 h-3" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Empty State -->
    <div
      v-if="filteredExamples.length === 0"
      class="p-12 text-center rounded-lg border border-dashed border-surface-border bg-surface-raised space-y-3"
    >
      <UIcon name="lucide:search" class="w-8 h-8 text-text-muted mx-auto" />
      <h3 class="text-base font-bold text-text-primary">No compositions found</h3>
      <p class="text-sm text-text-secondary max-w-md mx-auto">
        No suites matched your search criteria "{{ searchQuery }}". Try clearing your search or switching categories.
      </p>
      <button
        type="button"
        class="px-3 py-1.5 text-xs font-semibold rounded bg-brand-primary text-text-on-brand"
        @click="searchQuery = ''; selectedCategory = 'all'"
      >
        Reset Filters
      </button>
    </div>

    <!-- Application Archetypes Architectural Doctrine -->
    <section class="space-y-4 pt-6 border-t border-surface-border">
      <TuxSectionHeader>Application Archetypes Doctrine</TuxSectionHeader>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        TUX supports three primary application formats: data-dense monitoring dashboards (Landscape, Ops Board),
        public and research publications (portals, reports, and identity landings), and conversational interfaces
        (TTI AI Studio). Each archetype implements strict token contracts and WCAG 2.2 Level AAA standards.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div class="p-5 rounded-lg bg-surface-raised border border-surface-border space-y-2">
          <p class="font-bold text-text-primary">1. Operational Telemetry</p>
          <p class="text-xs text-text-secondary leading-relaxed">
            Status is <code>--status-*</code>, never <code>--brand-primary</code>. Maroon is reserved for institutional chrome.
            Gold is an accent keyline. Hairline tables use <code>--surface-border</code>.
          </p>
          <NuxtLink to="/design/ops-surfaces" class="text-xs text-brand-primary font-semibold hover:underline block pt-1">
            Read ops-surfaces.md →
          </NuxtLink>
        </div>

        <div class="p-5 rounded-lg bg-surface-raised border border-surface-border space-y-2">
          <p class="font-bold text-text-primary">2. Public Editorial & Marcom</p>
          <p class="text-xs text-text-secondary leading-relaxed">
            Two-tier institutional header, diagonal chamfer hero slabs, Kadence sharp button geometry,
            and 5-band institutional brand spectrum ribbons matching tti.tamu.edu.
          </p>
          <NuxtLink to="/design/compositions" class="text-xs text-brand-primary font-semibold hover:underline block pt-1">
            Read compositions.md →
          </NuxtLink>
        </div>

        <div class="p-5 rounded-lg bg-surface-raised border border-surface-border space-y-2">
          <p class="font-bold text-text-primary">3. Enterprise Workspaces & AI</p>
          <p class="text-xs text-text-secondary leading-relaxed">
            Command palettes, day-grouped chat sessions, grounding source rails, CUI / ITAR compliance banners,
            and multi-format citation export engines.
          </p>
          <NuxtLink to="/design/unification-plan" class="text-xs text-brand-primary font-semibold hover:underline block pt-1">
            Read unification-plan.md →
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
