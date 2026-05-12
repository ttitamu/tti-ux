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
    date: "2026-04-27",
    title: "Doc-site chrome batch",
    body: "TuxDocsSidebar, TuxTOC, TuxSiteNav, TuxDropdown, TuxMegaMenu — the navigation + doc-shape components for technical documentation sites.",
    to: "/components/docs-sidebar",
  },
  {
    date: "2026-04-26",
    title: "Authoring + content batch",
    body: "TuxCodeBlock, TuxDiagram, MDC integration. Markdown rendering with Tux* components inline; SSR-rendered Shiki + Mermaid.",
    to: "/components/code-block",
  },
  {
    date: "2026-04-25",
    title: "Container queries everywhere",
    body: "Responsive layouts now key off component width via container queries, not viewport width — fixes the long-standing \"works in full-width but breaks in a narrow demo wrapper\" bug.",
    to: "/design/components",
  },
  {
    date: "2026-04-24",
    title: "tti-ux extracted from PECAN",
    body: "Forked the design-system source out of pecan into a standalone runnable style guide. Three downstream consumers: PECAN, tti-ai-studio, this style guide itself.",
    to: "/design/tux",
  },
];

// Headline catalog size for the hero meta line. The full inventory
// lives at /components/ (and is reachable via the collapsible
// sidebar). Update when batches ship.
const catalogCount = "70+";
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
        <p class="eyebrow welcome-hero__eyebrow">
          <span>tti-ux</span>
          <span class="welcome-version">v{{ version }}</span>
        </p>
        <h1 class="welcome-hero__title">
          <span class="welcome-hero__title-line">TTI</span>
          <span class="welcome-hero__title-line welcome-hero__title-line--maroon">Design</span>
          <span class="welcome-hero__title-line">System</span>
        </h1>
        <span class="welcome-hero__rule" aria-hidden="true" />
        <p class="welcome-hero__lede">
          A living style guide for Texas A&amp;M Transportation Institute
          apps built on Nuxt 4. Every page you see is rendered by the
          same components your app imports — so this site
          <span class="link-tti">is</span> the source of truth, not a
          doc of it.
        </p>
        <p class="welcome-hero__body">
          Three products consume this system today:
          <strong>PECAN</strong> (sensitive-data classifier),
          <strong>tti-ai-studio</strong> (LLM tooling), and this style
          guide itself. Themed for TTI maroon &amp; gold, structured so
          a sister institution can repaint via tokens without forking.
          Apache 2.0.
        </p>
        <div class="welcome-hero__actions">
          <NuxtLink to="/design/tux" class="welcome-cta welcome-cta--primary">
            <span>Read the doctrine</span>
            <Icon name="lucide:arrow-right" class="welcome-cta-icon" aria-hidden="true" />
          </NuxtLink>
          <NuxtLink to="/components" class="welcome-cta">
            <span>Browse components</span>
            <Icon name="lucide:arrow-right" class="welcome-cta-icon" aria-hidden="true" />
          </NuxtLink>
          <a href="https://github.com/anthonyguevara/tti-ux-test" target="_blank" rel="noopener" class="welcome-cta">
            <Icon name="lucide:github" class="welcome-cta-icon" aria-hidden="true" />
            <span>Repo</span>
          </a>
        </div>
      </div>

      <div class="welcome-hero__panel" aria-hidden="true">
        <div class="welcome-hero__panel-meta">
          <p class="welcome-hero__meta-label">Stack</p>
          <p class="welcome-hero__meta-value">Nuxt 4 · Nuxt UI · Tailwind v4</p>

          <p class="welcome-hero__meta-label">Consumers</p>
          <p class="welcome-hero__meta-value">PECAN · tti-ai-studio · tti-ux</p>

          <p class="welcome-hero__meta-label">Catalog</p>
          <p class="welcome-hero__meta-value">{{ catalogCount }} components · 5 foundations</p>

          <p class="welcome-hero__meta-label">Themes</p>
          <p class="welcome-hero__meta-value">tti · tti-dark · tti-hc</p>

          <p class="welcome-hero__meta-label">License</p>
          <p class="welcome-hero__meta-value">Apache 2.0</p>
        </div>
        <span class="welcome-hero__glyph" aria-hidden="true">A</span>
      </div>
    </section>

    <!-- ──────── VISUAL IDENTITY AT A GLANCE — show the system, not
         a description of it. Six tiles: brand color, gold accent,
         type sample, a live TuxBadge, a live TuxAlert preview, the
         corner-drop card hover. ──────── -->
    <section>
      <p class="eyebrow">at a glance</p>
      <div class="welcome-updates-header">
        <h2 class="heading--bold text-2xl font-bold">Visual identity</h2>
        <NuxtLink to="/tokens" class="welcome-updates-changelog">
          <span>Full token reference</span>
          <Icon name="lucide:arrow-right" class="welcome-cta-icon" aria-hidden="true" />
        </NuxtLink>
      </div>
      <div class="welcome-glance">
        <NuxtLink to="/tokens" class="welcome-glance__tile welcome-glance__tile--maroon">
          <p class="welcome-glance__label">brand · primary</p>
          <p class="welcome-glance__value welcome-glance__value--mono">#5C0025</p>
          <p class="welcome-glance__caption">TTI maroon</p>
        </NuxtLink>
        <NuxtLink to="/tokens" class="welcome-glance__tile welcome-glance__tile--gold">
          <p class="welcome-glance__label">brand · accent</p>
          <p class="welcome-glance__value welcome-glance__value--mono">#DDAC37</p>
          <p class="welcome-glance__caption">Aggie gold</p>
        </NuxtLink>
        <NuxtLink to="/typography" class="welcome-glance__tile">
          <p class="welcome-glance__label">type · display</p>
          <p class="welcome-glance__value welcome-glance__value--display">Aa</p>
          <p class="welcome-glance__caption">Public Sans · italic 800</p>
        </NuxtLink>
        <NuxtLink to="/components/badge" class="welcome-glance__tile">
          <p class="welcome-glance__label">component · live</p>
          <div class="welcome-glance__live">
            <TuxBadge tier="sensitive">L3 · sensitive</TuxBadge>
            <TuxBadge status="completed">active</TuxBadge>
          </div>
          <p class="welcome-glance__caption">TuxBadge — tiers + states</p>
        </NuxtLink>
        <NuxtLink to="/components/alert" class="welcome-glance__tile welcome-glance__tile--wide">
          <p class="welcome-glance__label">component · live</p>
          <div class="welcome-glance__live welcome-glance__live--full">
            <TuxAlert
              variant="tip"
              title="Container queries everywhere."
            >
              Components key off their own width via <code>@container</code>,
              not viewport width — so a header in a 320px sidebar
              renders the right way.
            </TuxAlert>
          </div>
        </NuxtLink>
        <NuxtLink to="/motion" class="welcome-glance__tile welcome-glance__tile--corner-drop">
          <p class="welcome-glance__label">motion · signature</p>
          <p class="welcome-glance__value">Corner-drop</p>
          <p class="welcome-glance__caption">Hover → 6px translate + maroon shadow</p>
          <span class="welcome-glance__hint">hover me</span>
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
      <p class="eyebrow">see it in context</p>
      <h2 class="heading--bold text-2xl font-bold">Composition examples</h2>
      <p class="mt-2 max-w-2xl text-text-secondary leading-relaxed">
        If you're trying to figure out what tux is <em>for</em>,
        these three pages assemble 9–13 components into real-shape
        surfaces — a PECAN dashboard, a research-program landing,
        a tti-ai-studio session.
      </p>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <TuxCard to="/examples/pecan-dashboard">
          <p class="eyebrow">product · IT-facing</p>
          <h3 class="text-xl font-bold">PECAN dashboard</h3>
          <p class="mt-2 text-sm text-text-secondary">
            Index overview — treemap viz, faceted file search, scan
            table, compliance alert.
          </p>
        </TuxCard>
        <TuxCard to="/examples/research-landing">
          <p class="eyebrow">marketing · public</p>
          <h3 class="text-xl font-bold">Research landing</h3>
          <p class="mt-2 text-sm text-text-secondary">
            Hero + factoids + media slab + focus areas + program
            slabs + news + testimonials + CTA.
          </p>
        </TuxCard>
        <TuxCard to="/examples/tti-ai-studio-session">
          <p class="eyebrow">product · chat</p>
          <h3 class="text-xl font-bold">tti-ai-studio session</h3>
          <p class="mt-2 text-sm text-text-secondary">
            LLM session view — composer, citations, right-rail
            corpus + usage + recent sessions, ⌘K palette.
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
  border-radius: var(--radius-md);
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
  background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--brand-primary) 22%, transparent);
  border-radius: var(--radius-sm);
}

[data-theme="tti-dark"] .welcome-version {
  color: var(--brand-accent);
  background: color-mix(in srgb, var(--brand-accent) 12%, transparent);
  border-color: color-mix(in srgb, var(--brand-accent) 28%, transparent);
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
  border-radius: var(--radius-sm);
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
