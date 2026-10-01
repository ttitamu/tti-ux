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
    title: "TUX 3.0 & Comm Brand Transformation",
    body: "Harmonized TUX and operational suites (Atlas, Landscape, Forgejo/Code, AI Studio) with the official TTI Communications identity: 5-band spectrum ribbon, warm eggshell surface wash (#F9F9F7), Warm Gold navigation keylines, and sharp button geometry.",
    to: "/examples/comm-portal",
  },
  {
    date: "2026-09-30",
    title: "100% Component Health & Census Milestone (183 Suites)",
    body: "Achieved 100% unit test and in-component Axe coverage across all 183 components in the system census. All 183 components elevated to Tier 1 · Verified (Score >= 80). Tier 2 and Tier 3 completely extinguished.",
    to: "/components/health",
  },
  {
    date: "2026-09-28",
    title: "Turnkey WordPress & Kadence Integration",
    body: "Shipped the Kadence child theme (packages/wordpress/kadence-child-tti) and tti-ux-core plugin v3.0.0 with Gutenberg block patterns, instant WCAG AAA bridge enqueuing, and live shortcodes.",
    to: "/install/wordpress",
  },
  {
    date: "2026-09-27",
    title: "W3C WCAG 2.2 Level AAA Architecture & Zero-JS Bridge",
    body: "Engineered tux-bridge.css and scripts/audit-wcag-aaa.mjs to mathematically enforce >= 7.0:1 text contrast, >= 44px touch targets, and >= 3px dual-ring focus appearance across all legacy and modern surfaces.",
    to: "/examples/legacy-bridge",
  },
  {
    date: "2026-09-20",
    title: "Interactive Design Token Studio & Playground",
    body: "Built the real-time token customizer at /tokens/playground with live theme previews, two-way URL state sharing, and one-click JSON/Kadence theme.json export.",
    to: "/tokens/playground",
  },
];

// Headline catalog size for the hero meta line — computed from the
// catalog source of truth (app/utils/tuxCatalog.ts) so it can never
// go stale again. The full inventory lives at /components/.
const catalogCount = `${tuxComponentCount}`;
</script>

<template>
  <div class="space-y-10">
    <!-- ──────── HERO — split layout, modeled on the slides kit
         title slide. Left half is editorial copy; right half is a
         maroon panel with a diagonal-hash overlay + at-a-glance
         metadata. The hero collapses to a single column under
         48rem container width. ──────── -->
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
          The living institutional design system and component architecture for the
          Texas A&amp;M Transportation Institute, aligning digital products with
          the TTI Communications redesign and certified for <strong>WCAG 2.2 Level AAA</strong>.
        </p>
        <p class="welcome-hero__body">
          Powering institutional suites across TTI: <strong>Atlas</strong> (security &amp; policy audit),
          <strong>TTI Code / Forgejo</strong> (Git developer portal), <strong>Landscape</strong> (operations telemetry),
          <strong>TTI AI Studio</strong> (research assistant), <strong>MyTTI Intranet</strong>, and
          <strong>WordPress Kadence</strong> research centers.
        </p>
        <div class="welcome-hero__actions">
          <NuxtLink to="/components" class="welcome-cta welcome-cta--primary">
            <span>Browse 183 Components</span>
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

      <div class="welcome-hero__panel" aria-hidden="true">
        <div class="welcome-hero__panel-meta">
          <p class="welcome-hero__meta-label">Stack</p>
          <p class="welcome-hero__meta-value">Nuxt 4 · Tailwind v4 · Vue 3.5</p>

          <p class="welcome-hero__meta-label">Operational Suites</p>
          <p class="welcome-hero__meta-value">Atlas · Forgejo · Landscape · AI Studio · MyTTI</p>

          <p class="welcome-hero__meta-label">Component Census</p>
          <p class="welcome-hero__meta-value">183 components (100% Tier 1 Verified)</p>

          <p class="welcome-hero__meta-label">Accessibility</p>
          <p class="welcome-hero__meta-value">100% W3C WCAG 2.2 Level AAA (0 Violations)</p>

          <p class="welcome-hero__meta-label">Brand Palette</p>
          <p class="welcome-hero__meta-value">Aggie Maroon (#500000) · 5-Band Spectrum</p>
        </div>
        <span class="welcome-hero__glyph" aria-hidden="true">A</span>
      </div>
    </section>

    <!-- ──────── VISUAL IDENTITY AT A GLANCE ──────── -->
    <section>
      <p class="eyebrow">at a glance</p>
      <div class="welcome-updates-header">
        <h2 class="heading--bold text-2xl font-bold">Comm Brand Visual Identity</h2>
        <NuxtLink to="/tokens" class="welcome-updates-changelog">
          <span>Full token reference</span>
          <Icon name="lucide:arrow-right" class="welcome-cta-icon" aria-hidden="true" />
        </NuxtLink>
      </div>
      <div class="welcome-glance">
        <NuxtLink to="/tokens" class="welcome-glance__tile welcome-glance__tile--maroon">
          <p class="welcome-glance__label">brand · primary</p>
          <p class="welcome-glance__value welcome-glance__value--mono">#500000</p>
          <p class="welcome-glance__caption">Aggie Maroon (Comm Anchor)</p>
        </NuxtLink>
        <NuxtLink to="/tokens" class="welcome-glance__tile welcome-glance__tile--gold">
          <p class="welcome-glance__label">brand · accent</p>
          <p class="welcome-glance__value welcome-glance__value--mono">#CFA935</p>
          <p class="welcome-glance__caption">Warm Gold (Signature Rules)</p>
        </NuxtLink>
        <NuxtLink to="/tokens" class="welcome-glance__tile">
          <p class="welcome-glance__label">spectrum · 5 divisions</p>
          <div class="mt-1 flex h-6 w-full rounded-none overflow-hidden border border-surface-border">
            <span class="flex-1 bg-[#500000]" title="Crash Testing & Roadside Safety" />
            <span class="flex-1 bg-[#005480]" title="Network Modeling & Connected Infra" />
            <span class="flex-1 bg-[#006F79]" title="Policy & Economic Analysis" />
            <span class="flex-1 bg-[#285C4D]" title="Transit Mobility & Multimodal" />
            <span class="flex-1 bg-[#CFA935]" title="Human Factors & Automated Vehicles" />
          </div>
          <p class="welcome-glance__caption">Official 5-Band Division Ribbon</p>
        </NuxtLink>
        <NuxtLink to="/components/badge" class="welcome-glance__tile">
          <p class="welcome-glance__label">component · live</p>
          <div class="welcome-glance__live">
            <TuxBadge tier="sensitive">L3 · sensitive</TuxBadge>
            <TuxBadge status="completed">active</TuxBadge>
          </div>
          <p class="welcome-glance__caption">TuxBadge — sharp Kadence profile</p>
        </NuxtLink>
        <NuxtLink to="/components/alert" class="welcome-glance__tile welcome-glance__tile--wide">
          <p class="welcome-glance__label">component · live</p>
          <div class="welcome-glance__live welcome-glance__live--full">
            <TuxAlert
              variant="tip"
              title="WCAG 2.2 Level AAA Certified."
            >
              Every component qualifies at >= 7.0:1 text contrast, >= 44px touch targets,
              and 3px high-contrast dual-ring focus appearance.
            </TuxAlert>
          </div>
        </NuxtLink>
        <NuxtLink to="/components/health" class="welcome-glance__tile">
          <p class="welcome-glance__label">telemetry · census</p>
          <p class="welcome-glance__value welcome-glance__value--mono text-brand-primary">183 / 183</p>
          <p class="welcome-glance__caption">100% Tested · 0 Untested Gaps</p>
        </NuxtLink>
      </div>
    </section>

    <section>
      <p class="eyebrow">recent updates</p>
      <div class="welcome-updates-header">
        <h2 class="heading--bold text-2xl font-bold">What's new</h2>
        <a href="https://github.com/anthonyguevara/tti-ux-test/blob/main/CHANGELOG.md" target="_blank" rel="noopener" class="welcome-updates-changelog">
          <span>Full changelog</span>
          <Icon name="lucide:external-link" class="welcome-cta-icon" aria-hidden="true" />
        </a>
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

    <section>
      <p class="eyebrow">operational suites &amp; comm portals</p>
      <div class="welcome-updates-header">
        <h2 class="heading--bold text-2xl font-bold">Flagship Operational Showcases</h2>
        <NuxtLink to="/examples" class="welcome-updates-changelog">
          <span>View all 14 examples</span>
          <Icon name="lucide:arrow-right" class="welcome-cta-icon" aria-hidden="true" />
        </NuxtLink>
      </div>
      <p class="mt-2 max-w-3xl text-text-secondary leading-relaxed">
        TUX powers the mission-critical applications across the Texas A&amp;M Transportation Institute.
        Each turnkey showcase assembles dozens of primitives into real-shape institutional products
        styled in complete harmony with the TTI Communications redesign:
      </p>
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <TuxCard to="/examples/atlas">
          <p class="eyebrow text-brand-primary">internal suite · governance</p>
          <h3 class="text-lg font-bold">Atlas Security &amp; Policy Audit</h3>
          <p class="mt-1 text-xs text-text-secondary">
            M365, Azure, NIST 800-171, and CJIS compliance portal with 5-band spectrum facts banner, 6-tile governance launcher, findings table, and milestone calendar.
          </p>
        </TuxCard>
        <TuxCard to="/examples/forgejo-code">
          <p class="eyebrow text-brand-primary">developer tool · git</p>
          <h3 class="text-lg font-bold">TTI Code (Forgejo) Developer Portal</h3>
          <p class="mt-1 text-xs text-text-secondary">
            Institutional self-hosted Git server: repository browser, pull requests, CAV division badge, clone drawer, and README well in eggshell wash.
          </p>
        </TuxCard>
        <TuxCard to="/examples/comm-portal">
          <p class="eyebrow text-brand-primary">public marcom · tti.tamu.edu</p>
          <h3 class="text-lg font-bold">Comm Redesign Showcase</h3>
          <p class="mt-1 text-xs text-text-secondary">
            Exact replication of the new tti.tamu.edu public website: architectural hero, 5-band spectrum facts, capability node cluster, and sticky TOC.
          </p>
        </TuxCard>
        <TuxCard to="/examples/intranet-dashboard">
          <p class="eyebrow text-brand-primary">employee intranet · my.tti</p>
          <h3 class="text-lg font-bold">MyTTI Intranet Dashboard</h3>
          <p class="mt-1 text-xs text-text-secondary">
            Exact replication of my.tti.tamu.edu: charcoal header, MY APPS off-canvas drawer launcher, 6-tile service grid, green date calendar rows, and notices.
          </p>
        </TuxCard>
        <TuxCard to="/examples/landscape-dashboard">
          <p class="eyebrow text-brand-primary">operations telemetry · it</p>
          <h3 class="text-lg font-bold">Landscape Operations Dashboard</h3>
          <p class="mt-1 text-xs text-text-secondary">
            Statewide telemetry monitoring: spectrum division color coding, rectangular Kadence buttons, treemap data viz, and compliance alerts.
          </p>
        </TuxCard>
        <TuxCard to="/examples/tti-ai-studio-session">
          <p class="eyebrow text-brand-primary">research assistant · ai</p>
          <h3 class="text-lg font-bold">TTI AI Studio Session</h3>
          <p class="mt-1 text-xs text-text-secondary">
            Transportation LLM chat interface: prompt suggestion chips, live citations, model selector badges, and context window telemetry.
          </p>
        </TuxCard>
      </div>
    </section>

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

@container welcome-hero (min-width: 48rem) {
  .welcome-hero {
    grid-template-columns: minmax(0, 1.6fr) minmax(16rem, 1fr);
    gap: 2.5rem;
    align-items: stretch;
  }
}

.welcome-hero__copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.welcome-hero__eyebrow {
  /* Override .eyebrow's default margin so it pairs tightly with
     the headline below. */
  margin-bottom: 0.625rem;
}

.welcome-hero__title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.012em;
  /* Fluid clamp tied to container width — smaller in narrow demo
     wrappers, big on a desktop home page. */
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
  margin: 0 0 0.75rem;
  font-size: 1.0625rem;
  line-height: 1.55;
  color: var(--text-secondary);
  max-width: 36rem;
}

.welcome-hero__body {
  margin: 0 0 1.5rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 36rem;
}

.welcome-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

/* Right-side maroon panel — diagonal hash overlay matches the
   slides kit's "stack" hash. The big italic A glyph is a faint
   echo of TAMUS identity at low opacity. */
.welcome-hero__panel {
  position: relative;
  background: var(--brand-primary);
  border-radius: var(--radius-md);
  padding: 1.75rem 1.625rem;
  color: rgba(255, 255, 255, 0.92);
  overflow: hidden;
  min-height: 16rem;
  isolation: isolate;
}

.welcome-hero__panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(transparent 50%, rgba(0, 0, 0, 0.18)),
    repeating-linear-gradient(
      135deg,
      rgba(221, 172, 55, 0.09) 0 2px,
      transparent 2px 18px
    );
  z-index: 0;
}

.welcome-hero__panel-meta {
  position: relative;
  z-index: 1;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1.5;
}

.welcome-hero__meta-label {
  margin: 0;
  color: var(--brand-accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.625rem;
  font-weight: 600;
  opacity: 0.95;
}

.welcome-hero__meta-label:not(:first-child) {
  margin-top: 0.875rem;
}

.welcome-hero__meta-value {
  margin: 0.125rem 0 0;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 500;
}

.welcome-hero__glyph {
  position: absolute;
  right: -0.5rem;
  bottom: -2rem;
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 800;
  font-size: 12rem;
  line-height: 0.8;
  color: var(--brand-accent);
  opacity: 0.14;
  z-index: 0;
  pointer-events: none;
  user-select: none;
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
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: rgba(255, 255, 255, 0.95);
}

.welcome-glance__tile--maroon:hover,
.welcome-glance__tile--maroon:focus-visible {
  border-color: var(--brand-accent);
  box-shadow: 0 0 0 1px var(--brand-accent) inset;
}

.welcome-glance__tile--gold {
  background: var(--brand-accent);
  border-color: var(--brand-accent);
  color: #1f1c1c;
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
  color: #5a3500;
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
  opacity: 0.55;
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
   a maroon fill; the secondary gets a hairline border. Same tone
   pattern used in TuxButton but kept inline because these are
   landing-page-only and don't warrant adding a new TuxButton variant. */
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
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: #fff;
}

.welcome-cta--primary:hover,
.welcome-cta--primary:focus-visible {
  background: color-mix(in srgb, var(--brand-primary) 88%, #000);
  border-color: var(--brand-primary);
  color: #fff;
}

.welcome-cta-icon {
  width: 0.875rem;
  height: 0.875rem;
}

/* Recent-updates feed — date column + title + body. Reads as a
   timeline rather than a card grid so it's clearly "log of changes"
   not "categories of content". */
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
