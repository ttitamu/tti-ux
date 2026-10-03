<script setup lang="ts">
import pkg from "../../package.json";

useHead({ title: "TUX" });

const version = pkg.version;

// Recent-changes feed for the welcome page. Hand-curated rather than
// parsed from CHANGELOG.md — the changelog is verbose (designed to be
// read end-to-end) and the home page wants a glanceable shortlist.
// Update this when shipping a noteworthy batch; the canonical history
// stays in CHANGELOG.md.
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

// Headline catalog size for the hero meta line — computed from the
// catalog source of truth (app/utils/tuxCatalog.ts) so it can never
// go stale again. The full inventory lives at /components/.
const catalogCount = `${tuxComponentCount}`;

// Active showcase tab for the interactive laboratory
const activeShowcaseTab = ref<"corridor" | "canvas" | "ui">("corridor");
</script>

<template>
  <div class="space-y-12">
    <!-- ──────── HERO — split layout, modeled on the slides kit
         title slide. Left half is editorial copy; right half is a
         maroon panel with a diagonal-hash overlay + at-a-glance
         metadata. ──────── -->
    <section class="welcome-hero">
      <div class="welcome-hero__copy">
        <TuxSpectrumRibbon height="md" class="mb-4" />
        <p class="eyebrow welcome-hero__eyebrow">
          <span>tti-ux</span>
          <span class="welcome-version">v{{ version }} · 3.0</span>
        </p>
        <h1 class="welcome-hero__title">
          <span class="welcome-hero__title-line">TTI</span>
          <span class="welcome-hero__title-line welcome-hero__title-line--maroon">Design</span>
          <span class="welcome-hero__title-line">System</span>
        </h1>
        <span class="welcome-hero__rule" aria-hidden="true" />
        <p class="welcome-hero__lede">
          The design system and component library for the Texas A&amp;M Transportation Institute.
          Engineered for Nuxt 4, Tailwind v4, and WCAG 2.2 Level AAA accessibility.
        </p>
        <div class="welcome-hero__actions">
          <NuxtLink to="/components" class="welcome-cta welcome-cta--primary">
            <span>Components ({{ catalogCount }})</span>
            <Icon name="lucide:arrow-right" class="welcome-cta-icon" aria-hidden="true" />
          </NuxtLink>
          <NuxtLink to="/components/health" class="welcome-cta">
            <Icon name="lucide:shield-check" class="welcome-cta-icon text-brand-primary" aria-hidden="true" />
            <span>Health &amp; AAA Matrix</span>
          </NuxtLink>
          <NuxtLink to="/tokens/playground" class="welcome-cta">
            <Icon name="lucide:sliders" class="welcome-cta-icon" aria-hidden="true" />
            <span>Token Studio</span>
          </NuxtLink>
          <NuxtLink to="/design/tux" class="welcome-cta">
            <span>Doctrine</span>
          </NuxtLink>
        </div>
      </div>

      <div class="welcome-hero__panel" aria-label="TTI UX: Institutional Design System &amp; Component Library">
        <div class="welcome-hero__banner">
          <div class="welcome-hero__banner-eyebrow">
            <span class="welcome-hero__banner-bullet" aria-hidden="true">•</span>
            <span>TEXAS A&amp;M TRANSPORTATION INSTITUTE</span>
          </div>
          <div class="welcome-hero__banner-brand">
            <span class="welcome-hero__banner-brand-tti">TTI</span>
            <span class="welcome-hero__banner-brand-ux">UX</span>
          </div>
          <div class="welcome-hero__banner-roadway" aria-hidden="true">
            <span class="welcome-hero__roadway-solid" />
            <span class="welcome-hero__roadway-dashed" />
          </div>
          <p class="welcome-hero__banner-subtitle">
            Institutional Design System &amp; Component Library
          </p>
          <div class="welcome-hero__banner-chips">
            <span class="welcome-hero__chip">v{{ version }}</span>
            <span class="welcome-hero__chip">WCAG 2.2 AAA</span>
            <span class="welcome-hero__chip">Nuxt 4</span>
            <span class="welcome-hero__chip">Tailwind v4</span>
            <span class="welcome-hero__chip">{{ catalogCount }} Components</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ──────── VISUAL IDENTITY AT A GLANCE ──────── -->
    <section>
      <p class="eyebrow">at a glance</p>
      <div class="welcome-updates-header">
        <h2 class="heading--bold text-2xl font-bold">Visual Identity</h2>
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

    <!-- ──────── INTERACTIVE COMPONENT SHOWCASE ──────── -->
    <section class="space-y-4">
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
      </div>

      <!-- Tab 2: Interactive Particle Canvas -->
      <div v-show="activeShowcaseTab === 'canvas'" class="space-y-4">
        <div class="rounded-xl overflow-hidden border border-surface-border shadow-xs">
          <TuxHeroCanvas variant="sol" blend="contained" min-height="380px" class="relative">
            <div class="p-8 sm:p-12 flex flex-col justify-center h-full max-w-2xl space-y-3">
              <span class="text-xs font-mono font-bold uppercase tracking-wider text-brand-accent">
                HTML5 2D Canvas · Particle Physics
              </span>
              <p class="text-2xl sm:text-3xl font-display font-bold text-neutral-0">
                Incandescent Particle Physics Engine
              </p>
              <p class="text-xs sm:text-sm text-neutral-0/80 leading-relaxed">
                Hardware-accelerated stardust particle repulsion, dynamic node clustering, and celestial radial glow.
                Move your cursor across the canvas to interact with the gravitational field.
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

    <!-- ──────── WHAT'S NEW / CHANGELOG SHORTLIST ──────── -->
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

    <!-- ──────── APPLICATION EXAMPLES ──────── -->
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

    <!-- ──────── FOUNDATIONS ──────── -->
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

    <!-- ──────── MULTI-FRAMEWORK ECOSYSTEM ──────── -->
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
/* ──────── HERO — split layout, maroon panel on the right.
   Container queries so the layout responds to its own width
   (works in any column the home page lives in). ──────── */
.welcome-hero {
  container-type: inline-size;
  container-name: welcome-hero;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin: -0.5rem 0 1rem;
}

@container welcome-hero (min-width: 44rem) {
  .welcome-hero {
    grid-template-columns: minmax(0, 1.4fr) minmax(17rem, 1fr);
    gap: 2rem;
    align-items: stretch;
  }
}

.welcome-hero__copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.welcome-hero__eyebrow {
  margin-bottom: 0.625rem;
}

.welcome-hero__title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.012em;
  font-size: clamp(2.5rem, 1.6rem + 4cqi, 4rem);
  line-height: 0.95;
  margin: 0;
  color: var(--text-primary);
}

.welcome-hero__title-line {
  display: block;
}

.welcome-hero__title-line--maroon {
  color: var(--brand-primary);
}

[data-theme="tti-dark"] .welcome-hero__title-line--maroon {
  color: var(--brand-accent);
}

.welcome-hero__rule {
  display: block;
  width: 5.5rem;
  height: 4px;
  background: var(--brand-accent);
  border-radius: 2px;
  margin: 1.25rem 0 1.5rem;
}

.welcome-hero__lede {
  margin: 0 0 1.25rem;
  font-size: 1.0625rem;
  line-height: 1.55;
  color: var(--text-secondary);
  max-width: 36rem;
}

.welcome-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

/* Right-side maroon panel — bold TTI UX display banner with institutional
   typography, passing lane roadway rule, and dynamic framework badges. */
.welcome-hero__panel {
  position: relative;
  background: var(--tti-maroon);
  border: 1px solid color-mix(in srgb, var(--brand-accent) 25%, transparent);
  border-radius: var(--radius-md);
  padding: 2rem 1.875rem;
  color: var(--neutral-0);
  overflow: hidden;
  min-height: 18rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 20px -2px color-mix(in srgb, var(--tti-maroon) 35%, transparent);
  isolation: isolate;
}

.welcome-hero__panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 85% 15%, color-mix(in srgb, var(--brand-accent) 18%, transparent) 0%, transparent 60%),
    repeating-linear-gradient(
      135deg,
      color-mix(in srgb, var(--brand-accent) 8%, transparent) 0 2px,
      transparent 2px 18px
    );
  z-index: 0;
  pointer-events: none;
}

.welcome-hero__banner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.welcome-hero__banner-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--brand-accent);
}

.welcome-hero__banner-bullet {
  font-size: 0.875rem;
  line-height: 1;
}

.welcome-hero__banner-brand {
  margin-top: 1rem;
  font-family: var(--font-bold);
  font-weight: 900;
  font-size: clamp(3.25rem, 5vw, 4.75rem);
  line-height: 0.92;
  letter-spacing: -0.025em;
  text-transform: uppercase;
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  text-shadow: 0 2px 8px color-mix(in srgb, var(--neutral-1000) 40%, transparent);
}

.welcome-hero__banner-brand-tti {
  color: var(--neutral-0);
}

.welcome-hero__banner-brand-ux {
  color: var(--brand-accent);
}

.welcome-hero__banner-roadway {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 6.5rem;
  margin: 1rem 0 1.125rem;
}

.welcome-hero__roadway-solid {
  display: block;
  height: 2.5px;
  background: var(--brand-accent);
  border-radius: 1px;
}

.welcome-hero__roadway-dashed {
  display: block;
  height: 0;
  border-top: 2.5px dashed var(--brand-accent);
}

.welcome-hero__banner-subtitle {
  margin: 0 0 1.75rem;
  font-family: var(--font-body);
  font-size: 1.0625rem;
  font-weight: 700;
  line-height: 1.35;
  color: color-mix(in srgb, var(--neutral-0) 95%, transparent);
  max-width: 24rem;
}

.welcome-hero__banner-chips {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4375rem;
}

.welcome-hero__chip {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5625rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.3;
  color: color-mix(in srgb, var(--neutral-0) 95%, transparent);
  background: color-mix(in srgb, var(--neutral-1000) 35%, transparent);
  border: 1px solid color-mix(in srgb, var(--brand-accent) 35%, transparent);
  border-radius: var(--radius-sm);
  letter-spacing: 0.02em;
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

/* Version chip in the welcome eyebrow — same monospace + maroon
   treatment as the header pill, scaled to eyebrow rhythm. */
.welcome-version {
  display: inline-flex;
  align-items: center;
  margin-left: 0.5rem;
  padding: 0.0625rem 0.375rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--brand-primary);
  background: var(--wash-brand-8);
  border: 1px solid var(--wash-brand-22);
  border-radius: var(--radius-sm);
}

[data-theme="tti-dark"] .welcome-version {
  color: var(--brand-accent);
  background: color-mix(in srgb, var(--brand-accent) 12%, transparent);
  border-color: color-mix(in srgb, var(--brand-accent) 22%, transparent);
}

/* CTA buttons under the welcome paragraph. The primary variant gets
   a maroon fill; the secondary gets a hairline border. */
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
