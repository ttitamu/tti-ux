<script setup lang="ts">
import pkg from "../../package.json";

useHead({ title: "tti-ux — Living style guide" });

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

const components = [
  { name: "TuxAlert",         to: "/components/alert",          blurb: "Docusaurus-style admonitions — 8 variants." },
  { name: "TuxBadge",         to: "/components/badge",          blurb: "Classification tiers, lifecycle states, tags, counts." },
  { name: "TuxAccordion",     to: "/components/accordion",      blurb: "FAQ + publication group disclosure — native details/summary, zero-JS, perfect a11y." },
  { name: "TuxAlphaNav",      to: "/components/alpha-nav",      blurb: "A–Z jump bar for directory + glossary pages. Anchor or filter-in-place mode." },
  { name: "TuxBigStat",       to: "/components/big-stat",       blurb: "Single oversized metric — the institutional headline number." },
  { name: "TuxBlockquote",    to: "/components/blockquote",     blurb: "Standalone editorial pull quote — centered or magazine-style drop-cap." },
  { name: "TuxBreadcrumbs",   to: "/components/breadcrumbs",    blurb: "Page-depth navigation — home icon, italic intermediates, pipe rules." },
  { name: "TuxButton",        to: "/components/button",         blurb: "Four semantic intents incl. destructive fill-on-hover." },
  { name: "TuxCallout",       to: "/components/callout",        blurb: "Pulled-aside editorial accent — fact / stat / quote with style-variant left rule." },
  { name: "TuxCaptionedMedia", to: "/components/captioned-media", blurb: "Single image + caption + credit — four aspect ratios, three alignments, video-embed slot." },
  { name: "TuxCard",          to: "/components/card",           blurb: "Static or linked — corner-drop hover choreography." },
  { name: "TuxCardSlab",      to: "/components/card-slab",      blurb: "Full-bleed band of media-forward cards — the \"browse our programs\" pattern." },
  { name: "TuxCodeBlock",     to: "/components/code-block",     blurb: "Standalone Shiki-backed code block — filename, line numbers, copy, all langs." },
  { name: "TuxCodeMaroon",    to: "/components/code-maroon",    blurb: "Mandatory emergency alert banner — Rellis Code Maroon. Hard-coded colors, non-themed." },
  { name: "TuxCommandPalette", to: "/components/command-palette", blurb: "Global ⌘K jump bar — search input + grouped commands + keyboard navigation." },
  { name: "TuxContactCard",   to: "/components/contact-card",   blurb: "Faculty/staff directory card — portrait + name + role + typed contact rows." },
  { name: "TuxCTA",           to: "/components/cta",            blurb: "Big promotional block — three tones, three style variants, action slot." },
  { name: "TuxDescriptionList", to: "/components/description-list", blurb: "Term/definition pairs — event details, file metadata, spec lists." },
  { name: "TuxDiagram",       to: "/components/diagram",        blurb: "Mermaid diagrams-as-code — flowcharts, sequences, ERDs. Lazy-loaded; brand-themed." },
  { name: "TuxDocsSidebar",   to: "/components/docs-sidebar",   blurb: "Hierarchical doc-site sidebar — collapsible sections, active-route, search filter." },
  { name: "TuxDropdown",      to: "/components/site-nav",       blurb: "Single-column dropdown from a top-bar nav item (composes inside TuxSiteNav)." },
  { name: "TuxEmptyState",    to: "/components/empty-state",    blurb: "No-data placeholder w/ icon + CTA slot." },
  { name: "TuxFactoid",       to: "/components/factoid",        blurb: "Institutional \"by the numbers\" — 3/4/5-up oversized stats." },
  { name: "TuxFilterPanel",   to: "/components/filter-panel",   blurb: "Left-rail facet panel — collapsible groups, checkbox lists, applied-filter chips." },
  { name: "TuxFooter",        to: "/components/footer",         blurb: "Slim app footer + mandatory TAMUS legal subfooter (the canonical pairing)." },
  { name: "TuxIconFeature",   to: "/components/icon-feature",   blurb: "Icon + headline + body grid — the classic \"focus areas / our services\" block." },
  { name: "TuxIdentity",      to: "/components/identity",       blurb: "Header lockup — logo + wordmark, three hierarchy levels, two orientations." },
  { name: "TuxLinkList",      to: "/components/link-list",      blurb: "Categorized resource lists — for sponsors / for partners / for students." },
  { name: "TuxLinkSlab",      to: "/components/link-slab",      blurb: "Full-width band of prominent links — footer-of-section navigation, three tones." },
  { name: "TuxMediaSlab",     to: "/components/media-slab",     blurb: "Full-bleed hero band — overlay or split layout, three heights, three tones." },
  { name: "TuxMegaMenu",      to: "/components/site-nav",       blurb: "Full-width multi-column panel from a top-bar nav item (composes inside TuxSiteNav)." },
  { name: "TuxModal",         to: "/components/modal",          blurb: "UModal with eyebrow + gold-bar title." },
  { name: "TuxNewsCollection", to: "/components/news-collection", blurb: "News article list — date + thumbnail + headline + dek + read-more, stacked or grid." },
  { name: "TuxPagination",    to: "/components/pagination",     blurb: "Page-number controls — squarified active page, ellipsis truncation, optional status line." },
  { name: "TuxPageHeader",    to: "/components/page-header",    blurb: "Eyebrow + heading + subtitle opener." },
  { name: "TuxPhotoGrid",     to: "/components/photo-grid",     blurb: "Uniform image grid — photo (4:3, captioned) or logo wall (1:1, grayscale-on-hover)." },
  { name: "TuxQACollection",  to: "/components/qa-collection",  blurb: "Long-form Q&A editorial pattern — always expanded, designed to be read top-to-bottom." },
  { name: "TuxSearch",        to: "/components/search",         blurb: "Branded search bar — bordered input + uppercase action button, two sizes." },
  { name: "TuxSectionHeader", to: "/components/section-header", blurb: "Editorial ALL-CAPS heading, maroon underline." },
  { name: "TuxSidebarBlock",  to: "/components/sidebar-block",  blurb: "Sidebar widget wrapper — related links, contact box, quick facts, in-page nav." },
  { name: "TuxSignupFeature", to: "/components/signup-feature", blurb: "Newsletter signup block — email input + uppercase action + consent line, three tones." },
  { name: "TuxSiteNav",       to: "/components/site-nav",       blurb: "Top-bar with TuxIdentity + utility nav + primary nav. Compose with TuxDropdown / TuxMegaMenu." },
  { name: "TuxTable",         to: "/components/table",          blurb: "UTable with tux chrome + auto status cells." },
  { name: "TuxTestimonial",   to: "/components/testimonial",    blurb: "Attributed quotes with portrait + name + role — grid or row." },
  { name: "TuxTOC",           to: "/components/toc",            blurb: "Article table-of-contents — sticky right rail, IntersectionObserver-driven active state." },
  { name: "TuxTreemap",       to: "/components/treemap",        blurb: "Squarified hierarchical-size viz — PECAN's headline chart, no external viz library." },
];
</script>

<template>
  <div class="space-y-10">
    <section>
      <p class="eyebrow">
        <span>tti-ux</span>
        <span class="welcome-version">v{{ version }}</span>
      </p>
      <h1 class="heading--display text-4xl">TTI Design System</h1>
      <p class="mt-4 max-w-2xl text-text-secondary leading-relaxed">
        A living style guide for Texas A&amp;M Transportation Institute apps built on Nuxt 4.
        Every page you see is rendered by the same components your app imports — so this site
        <span class="link-tti">is</span> the source of truth, not a doc of it.
      </p>
      <p class="mt-3 max-w-2xl text-text-secondary leading-relaxed">
        Three products consume this system today: <strong>PECAN</strong>
        (sensitive-data classifier for IT), <strong>tti-ai-studio</strong>
        (LLM tooling for researchers), and this style guide itself.
        Themed for TTI maroon &amp; gold, structured so a sister
        institution can repaint via tokens without forking the
        components. Apache 2.0.
      </p>
      <div class="mt-5 flex flex-wrap gap-3">
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

    <section>
      <p class="eyebrow">primitives</p>
      <h2 class="heading--bold text-2xl font-bold">Components</h2>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TuxCard v-for="c in components" :key="c.name" :to="c.to">
          <p class="eyebrow">component</p>
          <h3 class="text-xl font-bold">{{ c.name }}</h3>
          <p class="mt-2 text-sm text-text-secondary">{{ c.blurb }}</p>
        </TuxCard>
      </div>
    </section>
  </div>
</template>

<style scoped>
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
