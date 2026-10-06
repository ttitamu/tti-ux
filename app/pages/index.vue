<script setup lang="ts">
import pkg from "../../package.json";

useHead({ title: "TUX" });

const version = pkg.version;

// Headline catalog size for the hero meta line — computed from the
// catalog source of truth (app/utils/tuxCatalog.ts) so it can never
// go stale again. The full inventory lives at /components/.
const catalogCount = `${tuxComponentCount}`;

// Active showcase tab for the interactive laboratory
const activeShowcaseTab = ref<"corridor" | "canvas" | "ui">("corridor");

// 8 Component Families structuring the complete TUX 3.0 Arsenal (189 units)
const componentFamilies = [
  {
    title: "Primitives & Form Controls",
    count: 32,
    icon: "lucide:sliders-horizontal",
    description: "Buttons, text fields, selects, date pickers, switches, and sliders with strict AAA contrast.",
    tags: ["TuxButton", "TuxSelect", "TuxDatePicker", "TuxSwitch"],
    to: "/forms",
  },
  {
    title: "Data Presentation & Grids",
    count: 26,
    icon: "lucide:table",
    description: "High-density data tables, sortable grids, metric cards, trees, and hierarchical factoids.",
    tags: ["TuxDataTable", "TuxRichDataGrid", "TuxMetricCard", "TuxTree"],
    to: "/components",
  },
  {
    title: "Navigation & Application Shell",
    count: 22,
    icon: "lucide:layout-template",
    description: "Multi-level site headers, dual-mode reactive sidebars, rail navs, breadcrumbs, and tab bars.",
    tags: ["TuxReactiveSidebar", "TuxSiteNav", "TuxRailNav", "TuxBreadcrumb"],
    to: "/components",
  },
  {
    title: "Feedback, Status & Alerts",
    count: 24,
    icon: "lucide:bell",
    description: "Level AAA alerts, modal dialogs, non-modal slide drawers, toast notifications, and badges.",
    tags: ["TuxAlert", "TuxBadge", "TuxModal", "TuxToast"],
    to: "/components/alert",
  },
  {
    title: "Structural & Spatial Layout",
    count: 21,
    icon: "lucide:panels-top-left",
    description: "Cards, interactive card slabs, containers, dividers, and simulated OS app frames.",
    tags: ["TuxCard", "TuxCardSlab", "TuxAppFrame", "TuxSplitPane"],
    to: "/components",
  },
  {
    title: "Geospatial & Roadway Analysis",
    count: 18,
    icon: "lucide:map-pin",
    description: "3D roadway cross-section cuts, AASHTO CAD elevation models, map flow legends, and strata.",
    tags: ["TuxRoadwayCrossSection", "TuxMapLegend", "TuxFlowVectors"],
    to: "/components/roadway-cross-section",
  },
  {
    title: "Content, Media & Publishing",
    count: 24,
    icon: "lucide:newspaper",
    description: "Celestial hero canvases, longform research publishing, author bylines, and code blocks.",
    tags: ["TuxHeroCanvas", "TuxEditorialArticle", "TuxCodeBlock"],
    to: "/components/hero-canvas",
  },
  {
    title: "Workflow, Overlays & AI Studio",
    count: 22,
    icon: "lucide:bot",
    description: "Dynamic filter drawers, multi-step wizards, AI prompt chips, and research session streams.",
    tags: ["TuxFilterPanel", "TuxStepper", "TuxPromptChips"],
    to: "/examples/tti-ai-studio-session",
  },
];

// Recent-changes feed for the welcome page. Hand-curated rather than
// parsed from CHANGELOG.md — the changelog is verbose (designed to be
// read end-to-end) and the home page wants a glanceable shortlist.
const recentUpdates = [
  {
    date: "2026-10-01",
    title: "TUX 3.0 Release",
    body: "Aligned component styles with the TTI Communications identity: 5-band spectrum ribbon, warm eggshell surfaces, Warm Gold rules, and sharp buttons.",
    to: "/examples/comm-portal",
  },
  {
    date: "2026-09-30",
    title: "Component Test Coverage",
    body: "Automated unit tests and Axe-core accessibility checks for all 189 components. 0 violations.",
    to: "/components/health",
  },
  {
    date: "2026-09-28",
    title: "WordPress & Kadence Support",
    body: "Added Kadence child theme and TTI core plugin with Gutenberg patterns and WCAG AAA stylesheet.",
    to: "/install/wordpress",
  },
  {
    date: "2026-09-27",
    title: "WCAG 2.2 Level AAA Stylesheet",
    body: "Added tux-bridge.css and audit scripts for 7.0:1 text contrast, 44px touch targets, and 3px focus indicators.",
    to: "/examples/legacy-bridge",
  },
  {
    date: "2026-09-20",
    title: "Token Studio",
    body: "Interactive editor for inspecting and adjusting CSS tokens with JSON export.",
    to: "/tokens/playground",
  },
];

// Developer DX: One-click install command copy state
const copiedInstall = ref(false);
function copyInstallCommand() {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText("npm i @tti/tti-ux");
    copiedInstall.value = true;
    setTimeout(() => {
      copiedInstall.value = false;
    }, 2000);
  }
}

// Accessibility: High-contrast toggle for quick AAA evaluation
const colorMode = useColorMode();
const isHighContrast = computed(() => colorMode.preference === "tti-hc");
function toggleHighContrast() {
  colorMode.preference = isHighContrast.value ? "tti" : "tti-hc";
}

// 12 Synchronized Ecosystem Targets
const ecosystemTargets = [
  { name: "Vue 3 / Nuxt 4", id: "vue", pkg: "@tti/tti-ux", to: "/install/nuxt-studio", icon: "lucide:layers", desc: "Canonical SFCs, auto-imports & SSR layer" },
  { name: "React 19 JSX", id: "react", pkg: "@tti/tti-ux-react", to: "/install/react", icon: "lucide:atom", desc: "Native React components & typed hooks" },
  { name: "Web Components", id: "elements", pkg: "@tti/tti-ux-elements", to: "/install", icon: "lucide:code", desc: "Framework-agnostic custom elements" },
  { name: "HTML & Tokens", id: "html", pkg: "tux-tokens.css", to: "/tokens", icon: "lucide:file-code", desc: "Light, Dark & AAA custom properties" },
  { name: "CSS Utility & Bridge", id: "css", pkg: "tux-bridge.css", to: "/examples/legacy-bridge", icon: "lucide:palette", desc: "Drop-in WCAG 2.2 AAA styles & ops" },
  { name: "WordPress & Kadence", id: "wordpress", pkg: "@tti/tti-ux-wordpress", to: "/install/wordpress", icon: "lucide:file-text", desc: "Kadence blocks & Gutenberg patterns" },
  { name: "PHP Helpers", id: "php", pkg: "tti-ux-php", to: "/install/wordpress", icon: "lucide:server", desc: "Server-side templates & markup helpers" },
  { name: ".NET Blazor / Razor", id: "dotnet", pkg: "@tti/tti-ux-razor", to: "/install/dotnet", icon: "lucide:cpu", desc: "C# Razor components & tag helpers" },
  { name: "C# / .NET Assemblies", id: "csharp", pkg: "TTI.UX.Core", to: "/install/dotnet", icon: "lucide:binary", desc: "Strongly typed C# models & token constants" },
  { name: "Python / Data Apps", id: "python", pkg: "tti-ux-python", to: "/install", icon: "lucide:terminal", desc: "Streamlit, Dash & Jupyter theme bridges" },
  { name: "Modern JavaScript", id: "js", pkg: "@tti/tti-ux-js", to: "/install", icon: "lucide:braces", desc: "Universal ESM/CJS bundles & runtime utilities" },
  { name: "Swift / iOS Native", id: "swift", pkg: "TTIUXSwift", to: "/install", icon: "lucide:smartphone", desc: "SwiftUI views, tokens & Dynamic Type" },
  { name: "Kotlin / Android Native", id: "kotlin", pkg: "tti-ux-kotlin", to: "/install", icon: "lucide:tablet", desc: "Jetpack Compose composables & Material 3" },
];
</script>

<template>
  <div class="space-y-12">
    <!-- ══════════════════════════════════════════════════════════════════════
         1. HERO STAGE — Texas Corridor Network & Kinetic Arterial Flow Canvas
         ══════════════════════════════════════════════════════════════════════ -->
    <section class="tux-home-hero -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 sm:-mt-8 mb-8">
      <TuxHeroCanvas variant="wash" blend="seamless" min-height="640px">
        <div class="w-full px-6 sm:px-8 lg:px-10 pt-6 sm:pt-8 lg:pt-10 pb-8 sm:pb-12 flex flex-col justify-between min-h-[600px] sm:min-h-[640px]">
          
          <!-- 1. Across the Top: 5-color Spectrum Ribbon -->
          <div class="w-full mb-8 sm:mb-10 lg:mb-12">
            <TuxSpectrumRibbon height="md" class="w-full rounded-full overflow-hidden shadow-sm" />
          </div>

          <!-- 2. Top-Left: TTI DESIGN SYSTEM Branding, Mission & Persona Gateways -->
          <div class="space-y-4 max-w-2xl">
            <div>
              <p class="font-mono text-xs uppercase tracking-widest text-brand-primary dark:text-brand-accent font-bold mb-2 flex items-center gap-2">
                <span class="inline-block w-2 h-2 rounded-full bg-brand-primary dark:bg-brand-accent"></span>
                <span>Texas A&amp;M Transportation Institute · State of Texas Mobility Research</span>
              </p>
              <h1 class="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold uppercase italic tracking-tight text-text-primary leading-[0.88]">
                TTI<br />
                <span class="text-brand-primary dark:text-brand-accent">DESIGN</span><br />
                SYSTEM
              </h1>
            </div>

            <p class="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl font-body pt-1">
              The unified institutional design system, component laboratory, and mobility intelligence platform
              for the Texas A&amp;M Transportation Institute. Built for Nuxt 4, Tailwind v4, and mathematically
              certified WCAG 2.2 Level AAA accessibility.
            </p>

            <!-- Developer DX Quick Install Box + Persona Jump Chips -->
            <div class="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
              <div class="flex items-center justify-between px-3.5 py-2 rounded-lg bg-surface-raised/90 border border-surface-border text-xs font-mono font-medium text-text-primary shadow-xs flex-1">
                <div class="flex items-center gap-2 truncate">
                  <span class="text-brand-primary dark:text-brand-accent font-bold select-none">$</span>
                  <span class="select-all">npm i @tti/tti-ux</span>
                </div>
                <button
                  type="button"
                  class="ml-3 inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-sans font-bold text-text-secondary hover:text-brand-primary hover:bg-surface-sunken border border-transparent hover:border-surface-border transition-all cursor-pointer shrink-0"
                  :title="copiedInstall ? 'Copied to clipboard' : 'Copy install command'"
                  @click="copyInstallCommand"
                >
                  <Icon :name="copiedInstall ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5 text-brand-primary dark:text-brand-accent" />
                  <span>{{ copiedInstall ? 'Copied!' : 'Copy' }}</span>
                </button>
              </div>

              <!-- Persona Quick Navigation Jump Chips -->
              <div class="flex items-center gap-1.5 flex-wrap">
                <a
                  href="#component-arsenal"
                  class="px-2.5 py-1.5 rounded text-[11px] font-mono font-semibold bg-surface-raised/80 hover:bg-surface-raised text-text-secondary hover:text-text-primary border border-surface-border hover:border-brand-primary transition-all shadow-2xs"
                  title="Jump to component families"
                >
                  For Developers
                </a>
                <a
                  href="#interactive-showcase"
                  class="px-2.5 py-1.5 rounded text-[11px] font-mono font-semibold bg-surface-raised/80 hover:bg-surface-raised text-text-secondary hover:text-text-primary border border-surface-border hover:border-brand-primary transition-all shadow-2xs"
                  title="Jump to 3D corridor visualizer and laboratory"
                >
                  For Researchers
                </a>
              </div>
            </div>
          </div>

          <!-- 3. Bottom Row: Left Action Buttons + Right Faint Horizontal TUX & AAA Tout -->
          <div class="pt-8 sm:pt-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <!-- Left: Buttons with Distinct Visual Hierarchy -->
            <div class="flex flex-wrap items-center gap-2.5">
              <NuxtLink
                to="/components"
                class="px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider bg-brand-primary hover:bg-brand-primary-deep text-text-on-brand shadow-sm hover:shadow transition-all flex items-center gap-2 border border-brand-accent/40"
              >
                <span>Explore Components ({{ catalogCount }})</span>
                <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" aria-hidden="true" />
              </NuxtLink>
              <a
                href="#interactive-showcase"
                class="px-3.5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider bg-surface-raised hover:bg-surface-page text-text-primary border border-surface-border hover:border-brand-primary dark:border-surface-border transition-all flex items-center gap-2 shadow-xs"
              >
                <Icon name="lucide:box" class="w-3.5 h-3.5 text-brand-primary dark:text-brand-accent" aria-hidden="true" />
                <span>3D Corridor Visualizer</span>
              </a>
              <NuxtLink
                to="/components/health"
                class="px-3.5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider bg-surface-raised hover:bg-surface-page text-text-secondary hover:text-text-primary border border-surface-border hover:border-color-success dark:border-surface-border transition-all flex items-center gap-2 shadow-xs"
              >
                <Icon name="lucide:shield-check" class="w-3.5 h-3.5 text-color-success" aria-hidden="true" />
                <span>Health &amp; AAA Matrix</span>
              </NuxtLink>
              <NuxtLink
                to="/tokens/playground"
                class="px-3.5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider bg-surface-raised hover:bg-surface-page text-text-secondary hover:text-text-primary border border-surface-border hover:border-brand-primary dark:border-surface-border transition-all flex items-center gap-2 shadow-xs"
              >
                <Icon name="lucide:sliders" class="w-3.5 h-3.5 text-brand-primary dark:text-brand-accent" aria-hidden="true" />
                <span>Token Studio</span>
              </NuxtLink>
            </div>

            <!-- Right: Faint Straight Horizontal TUX Monogram + Certified WCAG 2.2 Level AAA Tout with Interactive High-Contrast Toggle -->
            <div class="flex flex-col items-start md:items-end text-left md:text-right select-none">
              <div
                class="welcome-hero__faint-monogram text-7xl sm:text-8xl lg:text-9xl translate-x-1 mb-1"
                aria-hidden="true"
              >
                TUX
              </div>

              <div class="space-y-2 select-auto">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-raised border border-surface-border shadow-xs backdrop-blur-md">
                  <span class="w-2 h-2 rounded-full bg-color-success animate-pulse" />
                  <span class="font-mono text-xs font-bold tracking-wider uppercase text-text-primary">
                    Certified WCAG 2.2 Level AAA
                  </span>
                  <span class="text-[10px] font-mono text-brand-primary dark:text-brand-accent font-bold px-1.5 py-0.5 rounded-xs bg-wash-brand-8 dark:bg-brand-accent/20">
                    14.8:1
                  </span>
                </div>

                <div class="flex items-center justify-start md:justify-end gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-1 rounded bg-surface-raised hover:bg-surface-sunken border border-surface-border text-text-secondary hover:text-text-primary transition-all cursor-pointer shadow-2xs"
                    :title="isHighContrast ? 'Disable high-contrast mode' : 'Enable pure black/white high-contrast mode (WCAG AAA)'"
                    @click="toggleHighContrast"
                  >
                    <Icon :name="isHighContrast ? 'lucide:eye-off' : 'lucide:eye'" class="w-3.5 h-3.5 text-brand-accent" />
                    <span>{{ isHighContrast ? 'Exit High-Contrast' : 'High-Contrast AAA (7:1)' }}</span>
                  </button>
                  <NuxtLink
                    to="/accessibility"
                    class="text-[11px] font-mono text-brand-primary dark:text-brand-accent hover:underline px-1 py-0.5"
                    title="View institutional accessibility statement"
                  >
                    Audit Report &rarr;
                  </NuxtLink>
                </div>

                <p class="text-[11px] font-mono text-text-muted tracking-wide">
                  0 Axe Violations · 189 Certified Components · 500 Prerendered Routes
                </p>
              </div>
            </div>
          </div>
        </div>
      </TuxHeroCanvas>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════
         2. VISUAL IDENTITY AT A GLANCE
         ══════════════════════════════════════════════════════════════════════ -->
    <section class="space-y-4">
      <div class="welcome-updates-header">
        <div>
          <p class="eyebrow">system foundations</p>
          <h2 class="heading--bold text-2xl font-bold">Visual Identity &amp; System Tokens</h2>
        </div>
        <NuxtLink to="/tokens" class="welcome-updates-changelog">
          <span>Token reference</span>
          <Icon name="lucide:arrow-right" class="welcome-cta-icon" aria-hidden="true" />
        </NuxtLink>
      </div>
      <div class="welcome-glance">
        <NuxtLink to="/tokens" class="welcome-glance__tile welcome-glance__tile--maroon">
          <p class="welcome-glance__label">brand · primary</p>
          <p class="welcome-glance__value welcome-glance__value--mono">#500000</p>
          <p class="welcome-glance__caption">TTI Maroon · 14.8:1 AAA</p>
        </NuxtLink>
        <NuxtLink to="/tokens" class="welcome-glance__tile welcome-glance__tile--gold">
          <p class="welcome-glance__label">brand · accent</p>
          <p class="welcome-glance__value welcome-glance__value--mono">#CFA935</p>
          <p class="welcome-glance__caption">Warm Gold · Active Focus</p>
        </NuxtLink>
        <NuxtLink to="/tokens" class="welcome-glance__tile">
          <p class="welcome-glance__label">spectrum · 5 divisions</p>
          <div class="mt-1 flex h-6 w-full rounded-none overflow-hidden border border-surface-border">
            <span class="flex-1 bg-spectrum-maroon" title="Crash Testing & Roadside Safety" />
            <span class="flex-1 bg-spectrum-blue" title="Network Modeling & Connected Infrastructure" />
            <span class="flex-1 bg-spectrum-teal" title="Policy & Economic Analysis" />
            <span class="flex-1 bg-spectrum-green" title="Transit Mobility & Multimodal" />
            <span class="flex-1 bg-spectrum-gold" title="Human Factors & Automated Vehicles" />
          </div>
          <p class="welcome-glance__caption">5-Band Division Ribbon</p>
        </NuxtLink>
        <NuxtLink to="/components/badge" class="welcome-glance__tile">
          <p class="welcome-glance__label">component · badge</p>
          <div class="welcome-glance__live">
            <TuxBadge tier="sensitive">L3 · sensitive</TuxBadge>
            <TuxBadge status="completed">active</TuxBadge>
          </div>
          <p class="welcome-glance__caption">TuxBadge — sharp profile</p>
        </NuxtLink>
        <NuxtLink to="/components/alert" class="welcome-glance__tile welcome-glance__tile--wide">
          <p class="welcome-glance__label">component · alert</p>
          <div class="welcome-glance__live welcome-glance__live--full">
            <TuxAlert
              variant="tip"
              title="WCAG 2.2 Level AAA Compliant"
            >
              Components provide &gt;= 7.0:1 text contrast, &gt;= 44px touch targets,
              and 3px focus rings.
            </TuxAlert>
          </div>
        </NuxtLink>
        <NuxtLink to="/components/health" class="welcome-glance__tile">
          <p class="welcome-glance__label">coverage · census</p>
          <p class="welcome-glance__value welcome-glance__value--mono text-brand-primary">{{ catalogCount }} / {{ catalogCount }}</p>
          <p class="welcome-glance__caption">Automated Unit &amp; Axe Tests</p>
        </NuxtLink>
        <NuxtLink to="/motion" class="welcome-glance__tile welcome-glance__tile--corner-drop">
          <span class="welcome-glance__hint">hover me</span>
          <p class="welcome-glance__label">motion · corner-drop</p>
          <p class="welcome-glance__value">4px / -4px</p>
          <p class="welcome-glance__caption">Signature TUX hover offset</p>
        </NuxtLink>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════
         3. THE COMPONENT ARSENAL: Full Taxonomy by Family
         ══════════════════════════════════════════════════════════════════════ -->
    <section id="component-arsenal" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <p class="eyebrow">institutional component library</p>
          <h2 class="heading--bold text-2xl sm:text-3xl font-bold tracking-tight">
            The Complete TTI-UX Component Arsenal
          </h2>
          <p class="mt-2 text-sm sm:text-base text-text-secondary max-w-3xl leading-relaxed">
            189 production-ready components organized across 8 engineering families. Every component adheres to
            tokenized styling, responsive geometry, keyboard accessibility, and 100% WCAG 2.2 Level AAA compliance.
          </p>
        </div>
        <NuxtLink
          to="/components"
          class="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-brand-primary hover:underline whitespace-nowrap self-start sm:self-end"
        >
          <span>Browse all 189 components</span>
          <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" aria-hidden="true" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink
          v-for="family in componentFamilies"
          :key="family.title"
          :to="family.to"
          class="group p-5 rounded-xl bg-surface-raised border border-surface-border hover:border-brand-primary transition-all flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md"
        >
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <div class="w-8 h-8 rounded-lg bg-wash-brand-8 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-neutral-0 transition-colors">
                <Icon :name="family.icon" class="w-4 h-4" aria-hidden="true" />
              </div>
              <span class="text-xs font-mono font-bold text-brand-primary bg-wash-brand-8 px-2 py-0.5 rounded">
                {{ family.count }} units
              </span>
            </div>
            <h3 class="text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors">
              {{ family.title }}
            </h3>
            <p class="text-xs text-text-secondary leading-relaxed">
              {{ family.description }}
            </p>
          </div>

          <div class="pt-2 border-t border-surface-border space-y-2">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="tag in family.tags"
                :key="tag"
                class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-sunken text-text-muted"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════
         4. INTERACTIVE COMPONENT SHOWCASE (The Interactive Arsenal in Action)
         ══════════════════════════════════════════════════════════════════════ -->
    <section id="interactive-showcase" class="space-y-4 pt-4">
      <div class="welcome-updates-header">
        <div>
          <p class="eyebrow">interactive laboratory</p>
          <h2 class="heading--bold text-2xl font-bold">Interactive Component Showcase</h2>
        </div>
        <NuxtLink to="/components" class="welcome-updates-changelog">
          <span>Explore all {{ catalogCount }} components</span>
          <Icon name="lucide:arrow-right" class="welcome-cta-icon" aria-hidden="true" />
        </NuxtLink>
      </div>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        Test and inspect our advanced engineering, geospatial, and interactive components in real-time.
      </p>

      <!-- Showcase Tabs -->
      <div class="flex items-center gap-2 border-b border-surface-border pb-2 overflow-x-auto">
        <button
          type="button"
          class="showcase-tab-btn"
          :class="activeShowcaseTab === 'corridor' ? 'showcase-tab-btn--active' : 'showcase-tab-btn--inactive'"
          @click="activeShowcaseTab = 'corridor'"
        >
          <Icon name="lucide:box" class="w-3.5 h-3.5" aria-hidden="true" />
          <span>3D Roadway Visualizer</span>
        </button>
        <button
          type="button"
          class="showcase-tab-btn"
          :class="activeShowcaseTab === 'canvas' ? 'showcase-tab-btn--active' : 'showcase-tab-btn--inactive'"
          @click="activeShowcaseTab = 'canvas'"
        >
          <Icon name="lucide:sparkles" class="w-3.5 h-3.5" aria-hidden="true" />
          <span>Interactive Particle Canvas</span>
        </button>
        <button
          type="button"
          class="showcase-tab-btn"
          :class="activeShowcaseTab === 'ui' ? 'showcase-tab-btn--active' : 'showcase-tab-btn--inactive'"
          @click="activeShowcaseTab = 'ui'"
        >
          <Icon name="lucide:sliders-horizontal" class="w-3.5 h-3.5" aria-hidden="true" />
          <span>UI Primitives &amp; Controls</span>
        </button>
      </div>

      <!-- Tab 1: 3D Roadway & Embankment Visualizer -->
      <div v-show="activeShowcaseTab === 'corridor'" class="space-y-4">
        <TuxRoadwayCrossSection :interactive="true" />

        <!-- Spatial Corridor Context & Next-Step Signposting -->
        <div class="p-4 rounded-xl bg-surface-raised border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-primary text-white uppercase tracking-wider">
                Geospatial &amp; CAD
              </span>
              <h4 class="text-xs font-bold text-text-primary font-mono m-0">
                &lt;TuxRoadwayCrossSection /&gt; · AASHTO &amp; TxDOT Geometric Modeling
              </h4>
            </div>
            <p class="text-xs text-text-secondary m-0">
              Native CSS 3D corridor cut with volumetric geotechnical strata, hydrodynamic drainage swale, and real-time HCM Level of Service (LOS) telemetry.
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0 flex-wrap">
            <NuxtLink
              to="/components/geospatial"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-surface-sunken hover:bg-surface-page border border-surface-border text-text-primary hover:border-brand-primary transition-all shadow-2xs"
            >
              <span>Component Docs</span>
              <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
            </NuxtLink>
            <NuxtLink
              to="/examples/corridor-analytics"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-brand-primary text-text-on-brand hover:bg-brand-primary-deep transition-all shadow-2xs"
            >
              <span>Live Corridor Analytics</span>
              <Icon name="lucide:external-link" class="w-3.5 h-3.5" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Tab 2: Interactive Corridor Simulation Canvas -->
      <div v-show="activeShowcaseTab === 'canvas'" class="space-y-4">
        <div class="rounded-xl overflow-hidden border border-surface-border shadow-xs">
          <TuxHeroCanvas variant="corridor" blend="contained" min-height="380px" class="relative">
            <div class="p-8 sm:p-12 flex flex-col justify-center h-full max-w-2xl space-y-3">
              <span class="text-xs font-mono font-bold uppercase tracking-wider text-brand-accent">
                HTML5 2D Canvas · Mobility Intelligence
              </span>
              <p class="text-2xl sm:text-3xl font-display font-bold text-neutral-0">
                Kinetic Arterial Flow &amp; Telemetry Simulation
              </p>
              <p class="text-xs sm:text-sm text-neutral-0/80 leading-relaxed">
                Hardware-accelerated corridor vector graph, connected autonomous vehicle (CAV) telemetry pulses,
                and dynamic interchange routing. Move your cursor across the canvas to interact with the corridor sensor topology.
              </p>
              <div class="pt-2 flex items-center gap-3">
                <NuxtLink to="/components/hero-canvas" class="welcome-cta welcome-cta--primary">
                  <span>View Canvas Documentation</span>
                  <Icon name="lucide:arrow-right" class="welcome-cta-icon" aria-hidden="true" />
                </NuxtLink>
              </div>
            </div>
          </TuxHeroCanvas>
        </div>
      </div>

      <!-- Tab 3: UI Primitives & Controls -->
      <div v-show="activeShowcaseTab === 'ui'" class="p-6 rounded-xl bg-surface-raised border border-surface-border shadow-xs space-y-6">
        <div>
          <h3 class="text-base font-bold text-text-primary">Interactive UI Components &amp; Invariants</h3>
          <p class="text-xs text-text-secondary mt-1">Live demonstration of TUX buttons, badges, and alerts with Level AAA contrast.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-3">
            <p class="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Buttons &amp; Actions</p>
            <div class="flex flex-wrap gap-2">
              <TuxButton intent="primary">Primary</TuxButton>
              <TuxButton intent="secondary">Secondary</TuxButton>
              <TuxButton intent="ghost">Ghost</TuxButton>
            </div>
          </div>
          <div class="space-y-3">
            <p class="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Badges &amp; Status</p>
            <div class="flex flex-wrap gap-2 items-center">
              <TuxBadge status="completed">completed</TuxBadge>
              <TuxBadge status="in-progress">active</TuxBadge>
              <TuxBadge status="pending">pending</TuxBadge>
              <TuxBadge tier="sensitive">L3 sensitive</TuxBadge>
            </div>
          </div>
          <div class="space-y-3">
            <p class="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Accessibility Guardrails</p>
            <div class="text-xs font-mono text-text-secondary space-y-1">
              <p>• &gt;= 7.0:1 Text Contrast</p>
              <p>• &gt;= 44px Touch Targets</p>
              <p>• 3px Warm Gold Focus Rings</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════
         5. APPLICATION EXAMPLES (Reference Implementations)
         ══════════════════════════════════════════════════════════════════════ -->
    <section>
      <p class="eyebrow">examples &amp; layouts</p>
      <div class="welcome-updates-header">
        <h2 class="heading--bold text-2xl font-bold">Application Examples</h2>
        <NuxtLink to="/examples" class="welcome-updates-changelog">
          <span>View all 15 examples</span>
          <Icon name="lucide:arrow-right" class="welcome-cta-icon" aria-hidden="true" />
        </NuxtLink>
      </div>
      <p class="mt-2 max-w-3xl text-text-secondary leading-relaxed">
        Reference implementations demonstrating how components assemble into complete TTI applications:
      </p>
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <TuxCard to="/examples/atlas">
          <p class="eyebrow text-brand-primary">internal suite · governance</p>
          <h3 class="text-lg font-bold">Atlas Security &amp; Policy Audit</h3>
          <p class="mt-1 text-xs text-text-secondary">
            Compliance and policy audit console with findings ledger, telemetry metrics, and milestone schedule.
          </p>
        </TuxCard>
        <TuxCard to="/examples/forgejo-code">
          <p class="eyebrow text-brand-primary">developer tool · git</p>
          <h3 class="text-lg font-bold">TTI Code (Forgejo) Developer Portal</h3>
          <p class="mt-1 text-xs text-text-secondary">
            Self-hosted Git repository interface with file browser, pull requests, clone modal, and README display.
          </p>
        </TuxCard>
        <TuxCard to="/examples/comm-portal">
          <p class="eyebrow text-brand-primary">public marcom · tti.tamu.edu</p>
          <h3 class="text-lg font-bold">Communications Portal</h3>
          <p class="mt-1 text-xs text-text-secondary">
            Public site layout matching tti.tamu.edu: header ribbon, division spectrum, capability cluster, and section navigation.
          </p>
        </TuxCard>
        <TuxCard to="/examples/intranet-dashboard">
          <p class="eyebrow text-brand-primary">employee intranet · my.tti</p>
          <h3 class="text-lg font-bold">MyTTI Intranet Dashboard</h3>
          <p class="mt-1 text-xs text-text-secondary">
            Intranet layout matching my.tti.tamu.edu: navigation header, application drawer, service grid, calendar, and notices.
          </p>
        </TuxCard>
        <TuxCard to="/examples/landscape-dashboard">
          <p class="eyebrow text-brand-primary">operations telemetry · it</p>
          <h3 class="text-lg font-bold">Landscape Operations Dashboard</h3>
          <p class="mt-1 text-xs text-text-secondary">
            Telemetry monitoring console with division tags, data tables, treemap visualization, and status alerts.
          </p>
        </TuxCard>
        <TuxCard to="/examples/tti-ai-studio-session">
          <p class="eyebrow text-brand-primary">research assistant · ai</p>
          <h3 class="text-lg font-bold">TTI AI Studio Session</h3>
          <p class="mt-1 text-xs text-text-secondary">
            Research chat interface with prompt chips, reference citations, model selector, and telemetry details.
          </p>
        </TuxCard>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════
         6. FOUNDATIONS
         ══════════════════════════════════════════════════════════════════════ -->
    <section>
      <p class="eyebrow">get started</p>
      <h2 class="heading--bold text-2xl font-bold">Foundations</h2>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <TuxCard to="/tokens">
          <p class="eyebrow">foundations</p>
          <h3 class="text-xl font-bold">Tokens</h3>
          <p class="mt-2 text-sm text-text-secondary">
            Brand colors, surfaces, text roles, shadows, radii — every CSS variable
            the system exposes, visible at a glance.
          </p>
        </TuxCard>
        <TuxCard to="/typography">
          <p class="eyebrow">foundations</p>
          <h3 class="text-xl font-bold">Typography</h3>
          <p class="mt-2 text-sm text-text-secondary">
            Public Sans + JetBrains Mono. The <code>heading--bold</code>,
            <code>heading--display</code>, and eyebrow utilities in context.
          </p>
        </TuxCard>
        <TuxCard to="/motion">
          <p class="eyebrow">foundations</p>
          <h3 class="text-xl font-bold">Motion &amp; spacing</h3>
          <p class="mt-2 text-sm text-text-secondary">
            Three durations, the 4px spacing ramp, and the tux corner-drop
            signature.
          </p>
        </TuxCard>
        <TuxCard to="/icons">
          <p class="eyebrow">foundations</p>
          <h3 class="text-xl font-bold">Icons</h3>
          <p class="mt-2 text-sm text-text-secondary">
            1,755 Lucide glyphs via <code>@nuxt/icon</code>. Click-to-copy
            in a searchable catalog.
          </p>
        </TuxCard>
        <TuxCard to="/forms">
          <p class="eyebrow">primitives</p>
          <h3 class="text-xl font-bold">Forms</h3>
          <p class="mt-2 text-sm text-text-secondary">
            Inputs, selects, radios, switches, sliders, and chip inputs — Nuxt UI
            form primitives with TTI maroon focus rings and consistent label rhythm.
          </p>
        </TuxCard>
        <TuxCard to="/patterns">
          <p class="eyebrow">beyond components</p>
          <h3 class="text-xl font-bold">Patterns</h3>
          <p class="mt-2 text-sm text-text-secondary">
            Empty states, loading skeletons, confirmation flows, admonition stacks —
            conventions for the decisions components don't answer.
          </p>
        </TuxCard>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════
         7. MULTI-FRAMEWORK & MULTI-LANGUAGE ECOSYSTEM
         ══════════════════════════════════════════════════════════════════════ -->
    <section class="p-6 sm:p-8 rounded-2xl bg-surface-raised border border-surface-border space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <span class="text-[10px] font-mono uppercase tracking-wider text-brand-primary dark:text-brand-accent font-bold">Cross-Platform Architecture</span>
          <h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-1">Institutional Ecosystem &amp; Synchronized Targets</h2>
          <p class="text-xs sm:text-sm text-text-secondary mt-1 max-w-3xl leading-relaxed">
            Native design tokens, primitives, and component schemas synchronized across web, enterprise systems, and native mobile platforms with zero visual or behavioral drift.
          </p>
        </div>
        <NuxtLink
          to="/install"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-surface-sunken hover:bg-surface-raised border border-surface-border text-text-primary hover:border-brand-primary transition-all self-start sm:self-center shrink-0 shadow-2xs"
        >
          <span>Installation Guide</span>
          <Icon name="lucide:package" class="w-4 h-4 text-brand-primary dark:text-brand-accent" aria-hidden="true" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
        <NuxtLink
          v-for="target in ecosystemTargets"
          :key="target.id"
          :to="target.to"
          class="p-3.5 rounded-xl bg-surface-sunken border border-surface-border hover:border-brand-primary transition-all block group shadow-2xs hover:shadow-xs"
        >
          <div class="flex items-center justify-between mb-2">
            <Icon :name="target.icon" class="w-4 h-4 text-brand-primary dark:text-brand-accent" aria-hidden="true" />
            <span class="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface-raised text-text-muted font-semibold">
              {{ target.id }}
            </span>
          </div>
          <p class="text-xs font-bold text-text-primary group-hover:text-brand-primary transition-colors">
            {{ target.name }}
          </p>
          <p class="text-[10px] font-mono text-brand-primary dark:text-brand-accent truncate mt-0.5">
            {{ target.pkg }}
          </p>
          <p class="text-[11px] text-text-secondary leading-snug mt-1 line-clamp-2">
            {{ target.desc }}
          </p>
        </NuxtLink>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════
         8. WHAT'S NEW / CHANGELOG SHORTLIST
         ══════════════════════════════════════════════════════════════════════ -->
    <section>
      <p class="eyebrow">recent updates</p>
      <div class="welcome-updates-header">
        <h2 class="heading--bold text-2xl font-bold">What's new</h2>
        <NuxtLink to="/changelog" class="welcome-updates-changelog">
          <span>Full changelog</span>
          <Icon name="lucide:arrow-right" class="welcome-cta-icon" aria-hidden="true" />
        </NuxtLink>
      </div>
      <ul class="welcome-updates">
        <li v-for="u in recentUpdates" :key="u.title" class="welcome-update">
          <time class="welcome-update__date">{{ u.date }}</time>
          <div class="welcome-update__body">
            <NuxtLink :to="u.to" class="welcome-update__title">{{ u.title }}</NuxtLink>
            <p class="welcome-update__text">{{ u.body }}</p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
/* ──────── HERO STAGE ──────── */
.tux-home-hero {
  position: relative;
  background-color: var(--surface-page);
}

.tux-hero-pill {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-lg);
  background-color: color-mix(in srgb, var(--neutral-1000) 65%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid color-mix(in srgb, var(--neutral-0) 18%, transparent);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--neutral-1000) 50%, transparent);
}

/* Faint Straight Horizontal "TUX" Monogram Watermark (Unrotated) */
.welcome-hero__faint-monogram {
  font-family: var(--font-bold);
  font-weight: 900;
  text-transform: uppercase;
  font-style: italic;
  letter-spacing: -0.05em;
  line-height: 0.80;
  color: color-mix(in srgb, var(--brand-primary) 8%, transparent);
  pointer-events: none;
  user-select: none;
  display: inline-block;
}

[data-theme="tti-dark"] .welcome-hero__faint-monogram {
  color: color-mix(in srgb, var(--neutral-0) 6%, transparent);
}

/* ──────── VISUAL IDENTITY GLANCE — six tiles showing the system
   in the wild (color + type + live components + motion). Each
   tile is a NuxtLink so the whole grid is navigation. ──────── */
.welcome-glance {
  margin-top: 1.25rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
  gap: 1rem;
}

.welcome-glance__tile {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.125rem 1.125rem 1rem;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--text-primary);
  position: relative;
  overflow: hidden;
  min-height: 9rem;
  transition: border-color 0.15s ease, transform 0.18s ease, box-shadow 0.18s ease;
}

.welcome-glance__tile:hover,
.welcome-glance__tile:focus-visible {
  border-color: var(--brand-primary);
  outline: none;
}

.welcome-glance__tile--wide {
  grid-column: span 2;
}

@container (max-width: 38rem) {
  .welcome-glance__tile--wide {
    grid-column: span 1;
  }
}

/* Maroon and gold "color sample" tiles — the tile IS the color. */
.welcome-glance__tile--maroon {
  background: var(--tti-maroon);
  border-color: var(--tti-maroon);
  color: var(--neutral-0);
}

.welcome-glance__tile--maroon:hover,
.welcome-glance__tile--maroon:focus-visible {
  border-color: var(--brand-accent);
  box-shadow: 0 0 0 1px var(--brand-accent) inset;
}

.welcome-glance__tile--gold {
  background: var(--brand-accent);
  border-color: var(--brand-accent);
  color: var(--neutral-1000);
}

.welcome-glance__tile--gold:hover,
.welcome-glance__tile--gold:focus-visible {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 1px var(--brand-primary) inset;
}

.welcome-glance__label {
  margin: 0;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.welcome-glance__tile--maroon .welcome-glance__label {
  color: var(--brand-accent);
}

.welcome-glance__tile--gold .welcome-glance__label {
  color: color-mix(in srgb, var(--neutral-1000) 75%, transparent);
}

.welcome-glance__value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  font-style: italic;
  font-family: var(--font-display);
  line-height: 1.1;
  text-transform: uppercase;
  letter-spacing: -0.005em;
}

.welcome-glance__value--mono {
  font-size: 1rem;
  font-family: var(--font-mono);
  font-weight: 600;
  font-style: normal;
  text-transform: none;
  letter-spacing: 0.01em;
}

.welcome-glance__value--display {
  font-size: 3.5rem;
  line-height: 0.9;
  margin-top: -0.25rem;
}

.welcome-glance__caption {
  margin: 0;
  margin-top: auto;
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.45;
}

.welcome-glance__tile--maroon .welcome-glance__caption,
.welcome-glance__tile--gold .welcome-glance__caption {
  color: inherit;
  opacity: 0.85;
}

.welcome-glance__live {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
  margin-bottom: auto;
}

.welcome-glance__live--full {
  display: block;
  margin: 0.25rem 0 0;
}

.welcome-glance__live--full :deep(.tux-alert) {
  margin: 0;
}

/* Corner-drop preview: the tile itself does the corner-drop on
   hover, so the visitor experiences the signature motion. */
.welcome-glance__tile--corner-drop {
  border-color: var(--brand-primary);
}

.welcome-glance__tile--corner-drop:hover,
.welcome-glance__tile--corner-drop:focus-visible {
  transform: translate(4px, -4px);
  box-shadow: -4px 4px 0 0 var(--brand-primary);
}

.welcome-glance__hint {
  position: absolute;
  top: 0.625rem;
  right: 0.875rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--brand-primary);
  opacity: 0.75;
}

/* CTA buttons under the welcome paragraph. */
.welcome-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  padding: 0.5rem 0.875rem;
  font-family: var(--font-bold);
  font-weight: 600;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid var(--surface-border);
  border-radius: 0px !important;
  text-decoration: none;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
}

.welcome-cta:hover,
.welcome-cta:focus-visible {
  background: var(--surface-sunken);
  border-color: var(--brand-primary);
  color: var(--brand-primary);
  outline: none;
  transform: translateY(-1px);
}

.welcome-cta--primary {
  background: var(--tti-maroon);
  border-color: var(--tti-maroon);
  color: var(--neutral-0);
}

.welcome-cta--primary:hover,
.welcome-cta--primary:focus-visible {
  background: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
  color: var(--neutral-0);
}

.welcome-cta-icon {
  width: 0.875rem;
  height: 0.875rem;
}

/* Showcase tab switcher */
.showcase-tab-btn {
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all var(--motion-fast) var(--ease-standard);
  border: 1px solid transparent;
}

.showcase-tab-btn--active {
  background-color: var(--brand-primary);
  color: var(--neutral-0);
  box-shadow: var(--shadow-sm);
}

[data-theme="tti-dark"] .showcase-tab-btn--active {
  color: var(--neutral-1000);
}

.showcase-tab-btn--inactive {
  color: var(--text-secondary);
  background-color: transparent;
}

.showcase-tab-btn--inactive:hover {
  color: var(--text-primary);
  background-color: var(--surface-sunken);
}

/* Recent-updates feed — date column + title + body. */
.welcome-updates-header {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: space-between;
}

.welcome-updates-changelog {
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 1px;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.welcome-updates-changelog:hover,
.welcome-updates-changelog:focus-visible {
  color: var(--brand-primary);
  border-color: var(--brand-primary);
  outline: none;
}

.welcome-updates {
  margin: 1.25rem 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0;
  border-top: 1px solid var(--surface-border);
}

.welcome-update {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.25rem 1.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--surface-border);
}

@container (min-width: 38rem) {
  .welcome-update {
    grid-template-columns: 7rem 1fr;
    gap: 0 1.5rem;
  }
}

.welcome-update__date {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.welcome-update__title {
  display: block;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.15s ease;
}

.welcome-update__title:hover,
.welcome-update__title:focus-visible {
  color: var(--brand-primary);
  outline: none;
}

.welcome-update__text {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--text-secondary);
}
</style>
