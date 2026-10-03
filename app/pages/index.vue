<script setup lang="ts">
import pkg from "../../package.json";
import { tuxComponentCount } from "../utils/tuxCatalog";

useHead({
  title: "TTI Design System · TUX 3.0",
  meta: [
    {
      name: "description",
      content:
        "The institutional design system, component laboratory, and spatial intelligence platform for the Texas A&M Transportation Institute.",
    },
  ],
});

const version = pkg.version;
const catalogCount = `${tuxComponentCount}`;

// Recent-changes feed for the home page.
const recentUpdates = [
  {
    date: "2026-10-02",
    title: "Spatial Geometry & 3D Roadway Visualizer",
    body: "Delivered TuxRoadwayCrossSection with AASHTO/TxDOT roadway anatomy, interactive 3D spatial pitch and yaw controls, 2D vector CAD elevations, pavement structural strata, and embankment hydrology.",
    to: "/components/geospatial",
  },
  {
    date: "2026-10-01",
    title: "TUX 3.0 Institutional Unification",
    body: "Aligned all component styles with the TTI Communications identity: 5-band spectrum ribbon, warm surfaces, Warm Gold rules, and sharp buttons.",
    to: "/examples/comm-portal",
  },
  {
    date: "2026-09-30",
    title: "100% WCAG 2.2 AAA Test Coverage",
    body: "Automated unit tests and Axe-core accessibility checks for all 176+ components. Certified 0 violations and >= 7.0:1 text contrast.",
    to: "/components/health",
  },
  {
    date: "2026-09-28",
    title: "ECharts Spatial Intelligence Gallery",
    body: "Deployed high-density transport analytics exhibits including Texas Triangle flow vectors, timespace shockwaves, and maritime port gateways.",
    to: "/visualizations/echarts",
  },
  {
    date: "2026-09-20",
    title: "Design Token Studio",
    body: "Interactive editor for inspecting and adjusting CSS design tokens with OKLab perceptual color palettes and JSON export.",
    to: "/tokens/playground",
  },
];

const componentFamilies = [
  {
    title: "Actions & Commands",
    count: 16,
    icon: "lucide:mouse-pointer-click",
    description: "Buttons, Segmented Controls, Command Palette (⌘K), and Floating Action Buttons.",
    to: "/components#actions",
    badge: "Interactive",
  },
  {
    title: "Navigation & Shell",
    count: 24,
    icon: "lucide:compass",
    description: "Reactive Sidebar, Site Navigation, Tab Bar, Split Pane, Breadcrumbs, and Rail Navigation.",
    to: "/components#navigation",
    badge: "Layout",
  },
  {
    title: "Data Display & Tables",
    count: 32,
    icon: "lucide:table-properties",
    description: "Rich Data Grid, Data Table, Treemap, Record Highlights, Factoids, and Metric Cards.",
    to: "/components#data-display",
    badge: "Analytics",
  },
  {
    title: "Feedback & Status",
    count: 18,
    icon: "lucide:bell-ring",
    description: "Alerts, Status Badges, Toast Notification System, Skeletons, and Empty States.",
    to: "/components#feedback",
    badge: "Telemetry",
  },
  {
    title: "Forms & Controls",
    count: 22,
    icon: "lucide:check-square",
    description: "Form Fields, Rule Builder, Markdown Editor, File Dropzone, and Inline Validation.",
    to: "/components#forms",
    badge: "Inputs",
  },
  {
    title: "AI & Conversational",
    count: 14,
    icon: "lucide:bot",
    description: "Chat Composer, Conversation List, Prompt Chips, Citation Exporter, and MCP Embeds.",
    to: "/components#ai",
    badge: "Cognitive",
  },
  {
    title: "Research & Publishing",
    count: 26,
    icon: "lucide:book-open",
    description: "Editorial Article, Hero Canvas, Paper Meta, Author Byline, Citation Export, and Footnotes.",
    to: "/components#publishing",
    badge: "Academic",
  },
  {
    title: "Geospatial & Visualization",
    count: 24,
    icon: "lucide:map",
    description: "3D Roadway Cross-Section, Corridor Strip, Map Embed, Legend, and Native SVG Charts.",
    to: "/components#geospatial",
    badge: "Corridors",
  },
];

const telemetryMetrics = [
  {
    value: "1,280 mi",
    label: "Texas Triangle Corridor Network",
    detail: "High-priority multimodal freight & passenger corridor coverage.",
  },
  {
    value: "4.8M",
    label: "Tons Daily Commercial Freight",
    detail: "Real-time statewide intermodal freight telemetry tracking.",
  },
  {
    value: "99.8%",
    label: "IoT Telemetry Uptime",
    detail: "High-reliability sensor streaming & predictive safety analytics.",
  },
  {
    value: "0",
    label: "Axe Accessibility Violations",
    detail: "Certified Level AAA across all 500 prerendered routes.",
  },
];
</script>

<template>
  <div class="tux-home-page space-y-16">
    <!-- ══════════════════════════════════════════════════════════════════════
         1. HERO SECTION: Interactive Hero Canvas with Seamless Cosmic Dissolve
         ══════════════════════════════════════════════════════════════════════ -->
    <section class="tux-home-hero relative rounded-2xl overflow-hidden border border-surface-border shadow-lg">
      <TuxHeroCanvas variant="sol" blend="seamless" min-height="560px">
        <div class="tux-home-hero__content px-6 sm:px-10 lg:px-12 py-10 sm:py-14 max-w-5xl">
          <!-- Institutional Ribbon & Eyebrow -->
          <div class="flex items-center gap-3 mb-4">
            <TuxSpectrumRibbon height="sm" class="w-32" />
            <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-accent">
              TEXAS A&amp;M TRANSPORTATION INSTITUTE · TTI-UX v{{ version }}
            </span>
          </div>

          <!-- Hero Headline -->
          <h1 class="tux-home-hero__title font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-0 leading-[1.08] mb-5">
            Engineering the Next Generation of Transportation Experiences
          </h1>

          <!-- Hero Dek -->
          <p class="tux-home-hero__dek text-base sm:text-lg lg:text-xl text-neutral-0/85 leading-relaxed max-w-3xl mb-8">
            The unified institutional design system, component laboratory, and spatial intelligence platform
            for the Texas A&amp;M Transportation Institute. Built with Nuxt 4, Tailwind v4, and mathematically
            certified WCAG 2.2 Level AAA accessibility.
          </p>

          <!-- Telemetry Stats Pill Strip -->
          <div class="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-8">
            <div class="tux-home-hero__pill">
              <Icon name="lucide:blocks" class="w-3.5 h-3.5 text-brand-accent" aria-hidden="true" />
              <span><strong>{{ catalogCount }}+</strong> Components</span>
            </div>
            <div class="tux-home-hero__pill">
              <Icon name="lucide:shield-check" class="w-3.5 h-3.5 text-color-success" aria-hidden="true" />
              <span><strong>0</strong> Axe Violations</span>
            </div>
            <div class="tux-home-hero__pill">
              <Icon name="lucide:route" class="w-3.5 h-3.5 text-color-info" aria-hidden="true" />
              <span><strong>500</strong> Prerendered Routes</span>
            </div>
            <div class="tux-home-hero__pill">
              <Icon name="lucide:layers" class="w-3.5 h-3.5 text-brand-accent" aria-hidden="true" />
              <span><strong>5</strong> Research Divisions</span>
            </div>
          </div>

          <!-- CTA Buttons Cluster -->
          <div class="flex flex-wrap items-center gap-3 sm:gap-4">
            <NuxtLink
              to="/components"
              class="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold bg-brand-primary text-text-inverse hover:bg-brand-primary-deep shadow-md hover:shadow-lg transition-all"
            >
              <span>Explore Component Arsenal ({{ catalogCount }})</span>
              <Icon name="lucide:arrow-right" class="w-4 h-4" aria-hidden="true" />
            </NuxtLink>

            <a
              href="#corridor-showcase"
              class="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-neutral-1000/65 backdrop-blur-md border border-neutral-0/22 text-neutral-0 hover:bg-neutral-1000/85 hover:border-neutral-0/50 shadow-xs transition-all"
            >
              <Icon name="lucide:box" class="w-4 h-4 text-brand-accent" aria-hidden="true" />
              <span>3D Corridor Visualizer</span>
            </a>

            <NuxtLink
              to="/visualizations/echarts"
              class="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-neutral-1000/65 backdrop-blur-md border border-neutral-0/22 text-neutral-0 hover:bg-neutral-1000/85 hover:border-neutral-0/50 shadow-xs transition-all"
            >
              <Icon name="lucide:chart-pie" class="w-4 h-4 text-color-info" aria-hidden="true" />
              <span>Data &amp; Telemetry</span>
            </NuxtLink>

            <NuxtLink
              to="/components/health"
              class="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-neutral-1000/65 backdrop-blur-md border border-neutral-0/22 text-neutral-0 hover:bg-neutral-1000/85 hover:border-neutral-0/50 shadow-xs transition-all"
            >
              <Icon name="lucide:shield-check" class="w-4 h-4 text-color-success" aria-hidden="true" />
              <span>Health &amp; AAA Matrix</span>
            </NuxtLink>
          </div>
        </div>
      </TuxHeroCanvas>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════
         2. FEATURED ENGINEERING SHOWCASE: 3D Roadway & Embankment Visualizer
         ══════════════════════════════════════════════════════════════════════ -->
    <section id="corridor-showcase" class="space-y-6 pt-2">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <p class="text-xs font-mono font-bold uppercase tracking-wider text-brand-primary mb-1">
            Spatial Geometry &amp; Corridor Engineering
          </p>
          <h2 class="text-2xl sm:text-3xl font-display font-bold text-text-primary tracking-tight">
            Real-World Highway Cross-Section Visualizer
          </h2>
          <p class="mt-2 text-sm sm:text-base text-text-secondary max-w-3xl leading-relaxed">
            Transportation analysis demands physical and geometric fidelity. TTI-UX models true AASHTO
            and TxDOT corridor cross-sections with interactive 3D spatial pitch, 2D vector CAD elevations,
            pavement structural strata, and embankment geotechnical stability.
          </p>
        </div>
        <NuxtLink
          to="/components/geospatial"
          class="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-brand-primary hover:underline whitespace-nowrap self-start sm:self-end"
        >
          <span>Geospatial component docs</span>
          <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" aria-hidden="true" />
        </NuxtLink>
      </div>

      <!-- Live Interactive Visualizer Embed -->
      <div class="rounded-xl overflow-hidden border border-surface-border bg-surface-raised shadow-md">
        <TuxRoadwayCrossSection :interactive="true" />
      </div>

      <!-- Engineering Core Pillars Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        <div class="p-4 rounded-lg bg-surface-raised border border-surface-border space-y-2">
          <div class="flex items-center gap-2 text-brand-primary font-bold text-sm">
            <Icon name="lucide:ruler" class="w-4 h-4" aria-hidden="true" />
            <span>Geometric Accuracy</span>
          </div>
          <p class="text-xs text-text-secondary leading-relaxed">
            Standard AASHTO normal crown cross-slopes (-2.0%), SSCB 42" Jersey barriers, 4:1 recoverable foreslopes, and backslope swales.
          </p>
        </div>

        <div class="p-4 rounded-lg bg-surface-raised border border-surface-border space-y-2">
          <div class="flex items-center gap-2 text-color-info font-bold text-sm">
            <Icon name="lucide:box" class="w-4 h-4" aria-hidden="true" />
            <span>3D Spatial Perspective</span>
          </div>
          <p class="text-xs text-text-secondary leading-relaxed">
            Adjustable 3D matrix pitch (15°–75°), yaw rotation, and dynamic connected autonomous vehicle platoons in motion.
          </p>
        </div>

        <div class="p-4 rounded-lg bg-surface-raised border border-surface-border space-y-2">
          <div class="flex items-center gap-2 text-brand-accent font-bold text-sm">
            <Icon name="lucide:layers" class="w-4 h-4" aria-hidden="true" />
            <span>Structural Strata</span>
          </div>
          <p class="text-xs text-text-secondary leading-relaxed">
            Layer-by-layer HMAC surface course, binder, crushed stone base, lime subbase, and resilient modulus telemetry.
          </p>
        </div>

        <div class="p-4 rounded-lg bg-surface-raised border border-surface-border space-y-2">
          <div class="flex items-center gap-2 text-color-success font-bold text-sm">
            <Icon name="lucide:droplets" class="w-4 h-4" aria-hidden="true" />
            <span>Geotechnical Hydrology</span>
          </div>
          <p class="text-xs text-text-secondary leading-relaxed">
            Bishop circular slip surface stability (FS = 1.84 Stable), FDR soil moisture probe readings, and 10-year storm capacity.
          </p>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════
         3. DATA INTELLIGENCE & TELEMETRY SHOWCASE (ECharts Exhibit)
         ══════════════════════════════════════════════════════════════════════ -->
    <section class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <p class="text-xs font-mono font-bold uppercase tracking-wider text-color-info mb-1">
            Data Intelligence &amp; Telemetry
          </p>
          <h2 class="text-2xl sm:text-3xl font-display font-bold text-text-primary tracking-tight">
            Statewide Multimodal Intelligence
          </h2>
          <p class="mt-2 text-sm sm:text-base text-text-secondary max-w-3xl leading-relaxed">
            High-density interactive graphics engineered for research dashboards, freight telemetry,
            and statewide infrastructure planning across the Texas Triangle and border gateways.
          </p>
        </div>
        <NuxtLink
          to="/visualizations/echarts"
          class="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-color-info hover:underline whitespace-nowrap self-start sm:self-end"
        >
          <span>View all ECharts exhibits</span>
          <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" aria-hidden="true" />
        </NuxtLink>
      </div>

      <!-- Telemetry Stat Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="stat in telemetryMetrics"
          :key="stat.label"
          class="p-5 rounded-xl bg-surface-raised border border-surface-border shadow-xs hover:border-brand-primary/40 transition-colors"
        >
          <p class="text-2xl sm:text-3xl font-bold font-mono text-brand-primary tracking-tight">
            {{ stat.value }}
          </p>
          <p class="text-sm font-bold text-text-primary mt-1">
            {{ stat.label }}
          </p>
          <p class="text-xs text-text-secondary mt-1 leading-relaxed">
            {{ stat.detail }}
          </p>
        </div>
      </div>

      <!-- Analytics Feature Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <NuxtLink
          to="/visualizations/echarts"
          class="group p-5 rounded-xl bg-surface-raised border border-surface-border hover:border-brand-primary transition-all flex flex-col justify-between space-y-4 shadow-xs"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-color-info bg-wash-info-8 px-2 py-0.5 rounded">
                Exhibit 2.1
              </span>
              <Icon name="lucide:arrow-up-right" class="w-4 h-4 text-text-muted group-hover:text-brand-primary transition-colors" aria-hidden="true" />
            </div>
            <h3 class="text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors">
              Texas Triangle Flow Vectors
            </h3>
            <p class="text-xs text-text-secondary leading-relaxed">
              Multimodal freight and passenger spatial vector lines connecting Dallas–Fort Worth, Houston, Austin, and San Antonio.
            </p>
          </div>
          <div class="pt-2 border-t border-surface-border text-[11px] font-mono text-text-muted">
            Interactive Node Topology · D3 + ECharts
          </div>
        </NuxtLink>

        <NuxtLink
          to="/visualizations/echarts"
          class="group p-5 rounded-xl bg-surface-raised border border-surface-border hover:border-brand-primary transition-all flex flex-col justify-between space-y-4 shadow-xs"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-accent bg-wash-brand-8 px-2 py-0.5 rounded">
                Exhibit 2.2
              </span>
              <Icon name="lucide:arrow-up-right" class="w-4 h-4 text-text-muted group-hover:text-brand-primary transition-colors" aria-hidden="true" />
            </div>
            <h3 class="text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors">
              Timespace Shockwave Simulator
            </h3>
            <p class="text-xs text-text-secondary leading-relaxed">
              Lighthill-Whitham-Richards kinematic wave flow equations simulating bottleneck traffic shockwave propagation.
            </p>
          </div>
          <div class="pt-2 border-t border-surface-border text-[11px] font-mono text-text-muted">
            Continuous Phase Surface · LWR Physics
          </div>
        </NuxtLink>

        <NuxtLink
          to="/visualizations/echarts"
          class="group p-5 rounded-xl bg-surface-raised border border-surface-border hover:border-brand-primary transition-all flex flex-col justify-between space-y-4 shadow-xs"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-color-success bg-wash-success-8 px-2 py-0.5 rounded">
                Exhibit 2.3
              </span>
              <Icon name="lucide:arrow-up-right" class="w-4 h-4 text-text-muted group-hover:text-brand-primary transition-colors" aria-hidden="true" />
            </div>
            <h3 class="text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors">
              Gulf Maritime Port Gateways
            </h3>
            <p class="text-xs text-text-secondary leading-relaxed">
              Real-time TEU container volume, drayage queue times, and intermodal connectivity at Texas deepwater port terminals.
            </p>
          </div>
          <div class="pt-2 border-t border-surface-border text-[11px] font-mono text-text-muted">
            Intermodal Telemetry · Freight Logistics
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════
         4. COMPONENT ARSENAL: Taxonomy by Family
         ══════════════════════════════════════════════════════════════════════ -->
    <section class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <p class="text-xs font-mono font-bold uppercase tracking-wider text-brand-primary mb-1">
            System Inventory
          </p>
          <h2 class="text-2xl sm:text-3xl font-display font-bold text-text-primary tracking-tight">
            The TUX Component Arsenal
          </h2>
          <p class="mt-2 text-sm sm:text-base text-text-secondary max-w-3xl leading-relaxed">
            {{ catalogCount }}+ production components engineered for research publishing, data telemetry,
            administrative operations, and public communication. Every component meets WCAG 2.2 Level AAA standards.
          </p>
        </div>
        <NuxtLink
          to="/components"
          class="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-brand-primary hover:underline whitespace-nowrap self-start sm:self-end"
        >
          <span>Browse full directory</span>
          <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" aria-hidden="true" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink
          v-for="family in componentFamilies"
          :key="family.title"
          :to="family.to"
          class="group p-5 rounded-xl bg-surface-raised border border-surface-border hover:border-brand-primary hover:shadow-md transition-all flex flex-col justify-between space-y-3"
        >
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <div class="w-9 h-9 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-text-inverse transition-colors">
                <Icon :name="family.icon" class="w-5 h-5" aria-hidden="true" />
              </div>
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface-sunken border border-surface-border text-text-muted">
                {{ family.count }} primitives
              </span>
            </div>
            <h3 class="text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors">
              {{ family.title }}
            </h3>
            <p class="text-xs text-text-secondary leading-relaxed">
              {{ family.description }}
            </p>
          </div>
          <div class="pt-2 border-t border-surface-border flex items-center justify-between text-xs font-bold text-brand-primary">
            <span>Explore family</span>
            <Icon name="lucide:chevron-right" class="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════
         5. DESIGN FOUNDATIONS & TOKEN ARCHITECTURE
         ══════════════════════════════════════════════════════════════════════ -->
    <section class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <p class="text-xs font-mono font-bold uppercase tracking-wider text-brand-primary mb-1">
            Design Language
          </p>
          <h2 class="text-2xl sm:text-3xl font-display font-bold text-text-primary tracking-tight">
            Institutional Foundations &amp; Token Architecture
          </h2>
          <p class="mt-2 text-sm sm:text-base text-text-secondary max-w-3xl leading-relaxed">
            Built upon strict token invariants: OKLab perceptual color spaces, mathematical wash ladders,
            and guaranteed Level AAA contrast ratios (>= 7.0:1) with zero bare literal overrides.
          </p>
        </div>
        <NuxtLink
          to="/tokens"
          class="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-brand-primary hover:underline whitespace-nowrap self-start sm:self-end"
        >
          <span>Token reference guide</span>
          <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" aria-hidden="true" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Brand Primary -->
        <NuxtLink to="/tokens" class="p-5 rounded-xl bg-brand-primary text-neutral-0 flex flex-col justify-between h-40 shadow-sm hover:shadow-md transition-shadow">
          <div>
            <span class="text-[10px] font-mono uppercase tracking-wider text-brand-accent">Brand · Primary</span>
            <p class="text-xl font-bold font-mono mt-1">#500000</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-neutral-0/90">TTI Maroon</p>
            <p class="text-[10px] text-neutral-0/70 font-mono">var(--brand-primary) · 14.8:1 AAA</p>
          </div>
        </NuxtLink>

        <!-- Brand Accent -->
        <NuxtLink to="/tokens" class="p-5 rounded-xl bg-brand-accent text-neutral-1000 flex flex-col justify-between h-40 shadow-sm hover:shadow-md transition-shadow">
          <div>
            <span class="text-[10px] font-mono uppercase tracking-wider text-neutral-900/70">Brand · Accent</span>
            <p class="text-xl font-bold font-mono mt-1">#CFA935</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-neutral-1000">Warm Gold</p>
            <p class="text-[10px] text-neutral-1000/70 font-mono">var(--brand-accent) · Active Focus Ring</p>
          </div>
        </NuxtLink>

        <!-- Division Spectrum -->
        <NuxtLink to="/tokens" class="p-5 rounded-xl bg-surface-raised border border-surface-border flex flex-col justify-between h-40 shadow-sm hover:border-brand-primary transition-colors">
          <div>
            <span class="text-[10px] font-mono uppercase tracking-wider text-text-muted">Spectrum · 5 Divisions</span>
            <div class="mt-2 flex h-5 w-full rounded overflow-hidden border border-surface-border">
              <span class="flex-1 bg-spectrum-maroon" title="Crash Safety" />
              <span class="flex-1 bg-spectrum-blue" title="Network Modeling" />
              <span class="flex-1 bg-spectrum-teal" title="Policy Analysis" />
              <span class="flex-1 bg-spectrum-green" title="Transit Mobility" />
              <span class="flex-1 bg-spectrum-gold" title="Automated Vehicles" />
            </div>
          </div>
          <div>
            <p class="text-xs font-semibold text-text-primary">5-Band Division Spectrum</p>
            <p class="text-[10px] text-text-muted font-mono">Institutional Marcom Standard</p>
          </div>
        </NuxtLink>

        <!-- WCAG 2.2 AAA Audit -->
        <NuxtLink to="/components/health" class="p-5 rounded-xl bg-surface-raised border border-surface-border flex flex-col justify-between h-40 shadow-sm hover:border-color-success transition-colors">
          <div>
            <span class="text-[10px] font-mono uppercase tracking-wider text-color-success">Accessibility · Tier AAA</span>
            <div class="flex items-center gap-1.5 mt-1 text-color-success font-bold text-xl">
              <Icon name="lucide:shield-check" class="w-5 h-5" aria-hidden="true" />
              <span>100% Certified</span>
            </div>
          </div>
          <div>
            <p class="text-xs font-semibold text-text-primary">0 Axe Violations Across All Pages</p>
            <p class="text-[10px] text-text-muted font-mono">&gt;= 7:1 Contrast · &gt;= 44px Touch Targets</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════
         6. APPLICATION BLUEPRINTS & ARCHITECTURE
         ══════════════════════════════════════════════════════════════════════ -->
    <section class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <p class="text-xs font-mono font-bold uppercase tracking-wider text-brand-primary mb-1">
            Reference Implementations
          </p>
          <h2 class="text-2xl sm:text-3xl font-display font-bold text-text-primary tracking-tight">
            Enterprise Application Blueprints
          </h2>
          <p class="mt-2 text-sm sm:text-base text-text-secondary max-w-3xl leading-relaxed">
            Real-world layouts demonstrating how TUX components assemble into cohesive institutional portals,
            data telemetry consoles, and publishing platforms.
          </p>
        </div>
        <NuxtLink
          to="/examples"
          class="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-brand-primary hover:underline whitespace-nowrap self-start sm:self-end"
        >
          <span>View all 15 blueprints</span>
          <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" aria-hidden="true" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <TuxCard to="/examples/corridor-analytics">
          <p class="text-[10px] font-mono uppercase tracking-wider text-color-info">Corridors · Spatial Analytics</p>
          <h3 class="text-base font-bold text-text-primary mt-1">Corridor Analytics Console</h3>
          <p class="mt-1 text-xs text-text-secondary leading-relaxed">
            Integrated 3D highway geometry visualizer, live sensor telemetry, bottleneck shockwaves, and pavement health index.
          </p>
        </TuxCard>

        <TuxCard to="/examples/comm-portal">
          <p class="text-[10px] font-mono uppercase tracking-wider text-brand-primary">Public Portal · tti.tamu.edu</p>
          <h3 class="text-base font-bold text-text-primary mt-1">TTI Communications Portal</h3>
          <p class="mt-1 text-xs text-text-secondary leading-relaxed">
            Institutional home layout with 5-band spectrum ribbon, capability cluster, featured news, and researcher spotlights.
          </p>
        </TuxCard>

        <TuxCard to="/examples/atlas">
          <p class="text-[10px] font-mono uppercase tracking-wider text-color-warning">Governance · Security</p>
          <h3 class="text-base font-bold text-text-primary mt-1">Atlas Security &amp; Policy Audit</h3>
          <p class="mt-1 text-xs text-text-secondary leading-relaxed">
            Internal governance console with compliance finding ledgers, risk meters, and milestone schedule tracking.
          </p>
        </TuxCard>

        <TuxCard to="/examples/forgejo-code">
          <p class="text-[10px] font-mono uppercase tracking-wider text-brand-accent">Developer Tooling · Git</p>
          <h3 class="text-base font-bold text-text-primary mt-1">TTI Code (Forgejo) Developer Portal</h3>
          <p class="mt-1 text-xs text-text-secondary leading-relaxed">
            Self-hosted institutional Git repository browser with branch tree, commit log, pull requests, and file preview.
          </p>
        </TuxCard>

        <TuxCard to="/examples/intranet-dashboard">
          <p class="text-[10px] font-mono uppercase tracking-wider text-color-success">Intranet · my.tti</p>
          <h3 class="text-base font-bold text-text-primary mt-1">MyTTI Enterprise Intranet</h3>
          <p class="mt-1 text-xs text-text-secondary leading-relaxed">
            Employee operations workspace matching my.tti.tamu.edu: application drawer, service grid, calendar, and notices.
          </p>
        </TuxCard>

        <TuxCard to="/examples/tti-ai-studio-session">
          <p class="text-[10px] font-mono uppercase tracking-wider text-brand-primary">AI Research · Assistant</p>
          <h3 class="text-base font-bold text-text-primary mt-1">TTI AI Studio Research Session</h3>
          <p class="mt-1 text-xs text-text-secondary leading-relaxed">
            Research conversational interface with dynamic prompt chips, citation references, and LLM telemetry.
          </p>
        </TuxCard>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════
         7. RECENT UPDATES FEED
         ══════════════════════════════════════════════════════════════════════ -->
    <section class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <p class="text-xs font-mono font-bold uppercase tracking-wider text-brand-primary mb-1">
            Changelog Feed
          </p>
          <h2 class="text-2xl sm:text-3xl font-display font-bold text-text-primary tracking-tight">
            Recent System Milestones
          </h2>
          <p class="mt-2 text-sm sm:text-base text-text-secondary max-w-3xl leading-relaxed">
            Continuously advancing institutional capabilities, component ergonomics, and accessibility compliance.
          </p>
        </div>
        <NuxtLink
          to="/changelog"
          class="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-brand-primary hover:underline whitespace-nowrap self-start sm:self-end"
        >
          <span>Full changelog history</span>
          <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" aria-hidden="true" />
        </NuxtLink>
      </div>

      <div class="space-y-3">
        <div
          v-for="u in recentUpdates"
          :key="u.title"
          class="p-4 sm:p-5 rounded-xl bg-surface-raised border border-surface-border hover:border-brand-primary/40 transition-colors flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6"
        >
          <time class="text-xs font-mono font-bold text-brand-primary flex-shrink-0 w-28">
            {{ u.date }}
          </time>
          <div class="space-y-1 min-w-0 flex-1">
            <NuxtLink :to="u.to" class="text-sm font-bold text-text-primary hover:text-brand-primary hover:underline transition-colors block">
              {{ u.title }}
            </NuxtLink>
            <p class="text-xs text-text-secondary leading-relaxed">
              {{ u.body }}
            </p>
          </div>
          <NuxtLink :to="u.to" class="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1 self-start sm:self-center flex-shrink-0">
            <span>Explore</span>
            <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" aria-hidden="true" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════
         8. MULTI-FRAMEWORK ECOSYSTEM
         ══════════════════════════════════════════════════════════════════════ -->
    <section class="p-6 sm:p-8 rounded-2xl bg-surface-raised border border-surface-border space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="text-[10px] font-mono uppercase tracking-wider text-brand-primary font-bold">Multi-Target Generation</span>
          <h2 class="text-xl font-bold text-text-primary mt-1">Multi-Framework Port Pipeline</h2>
          <p class="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
            Write once in canonical Vue 3 SFCs. Automated CI codegen ports components to React 19 JSX,
            Framework-Agnostic Web Components, and .NET Razor/Blazor assemblies with zero drift.
          </p>
        </div>
        <NuxtLink
          to="/install"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-surface-sunken hover:bg-surface-raised border border-surface-border text-text-primary hover:border-brand-primary transition-all self-start sm:self-center"
        >
          <span>Installation Guide</span>
          <Icon name="lucide:package" class="w-4 h-4 text-brand-primary" aria-hidden="true" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <NuxtLink to="/install/nuxt-studio" class="p-3 rounded-lg bg-surface-sunken border border-surface-border hover:border-brand-primary text-center space-y-1 block transition-colors">
          <p class="text-xs font-bold text-text-primary">Vue 3 / Nuxt 4</p>
          <p class="text-[10px] font-mono text-text-muted">@tti/tti-ux</p>
        </NuxtLink>
        <NuxtLink to="/install/react" class="p-3 rounded-lg bg-surface-sunken border border-surface-border hover:border-brand-primary text-center space-y-1 block transition-colors">
          <p class="text-xs font-bold text-text-primary">React 19 JSX</p>
          <p class="text-[10px] font-mono text-text-muted">@tti/tti-ux-react</p>
        </NuxtLink>
        <NuxtLink to="/install" class="p-3 rounded-lg bg-surface-sunken border border-surface-border hover:border-brand-primary text-center space-y-1 block transition-colors">
          <p class="text-xs font-bold text-text-primary">Web Components</p>
          <p class="text-[10px] font-mono text-text-muted">@tti/tti-ux-elements</p>
        </NuxtLink>
        <NuxtLink to="/install/dotnet" class="p-3 rounded-lg bg-surface-sunken border border-surface-border hover:border-brand-primary text-center space-y-1 block transition-colors">
          <p class="text-xs font-bold text-text-primary">.NET Blazor / Razor</p>
          <p class="text-[10px] font-mono text-text-muted">@tti/tti-ux-razor</p>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tux-home-page {
  width: 100%;
}

.tux-home-hero {
  position: relative;
  background-color: var(--neutral-1000);
}

.tux-home-hero__content {
  position: relative;
  z-index: 10;
}

.tux-home-hero__pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-full);
  background-color: color-mix(in srgb, var(--neutral-1000) 65%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid color-mix(in srgb, var(--neutral-0) 22%, transparent);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--neutral-1000) 50%, transparent);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--neutral-0);
}
</style>
