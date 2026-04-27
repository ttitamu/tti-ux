<script setup lang="ts">
useHead({ title: "tti-ux — Living style guide" });

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
  { name: "TuxEmptyState",    to: "/components/empty-state",    blurb: "No-data placeholder w/ icon + CTA slot." },
  { name: "TuxFactoid",       to: "/components/factoid",        blurb: "Institutional \"by the numbers\" — 3/4/5-up oversized stats." },
  { name: "TuxFilterPanel",   to: "/components/filter-panel",   blurb: "Left-rail facet panel — collapsible groups, checkbox lists, applied-filter chips." },
  { name: "TuxFooter",        to: "/components/footer",         blurb: "Slim app footer + mandatory TAMUS legal subfooter (the canonical pairing)." },
  { name: "TuxIconFeature",   to: "/components/icon-feature",   blurb: "Icon + headline + body grid — the classic \"focus areas / our services\" block." },
  { name: "TuxIdentity",      to: "/components/identity",       blurb: "Header lockup — logo + wordmark, three hierarchy levels, two orientations." },
  { name: "TuxLinkList",      to: "/components/link-list",      blurb: "Categorized resource lists — for sponsors / for partners / for students." },
  { name: "TuxLinkSlab",      to: "/components/link-slab",      blurb: "Full-width band of prominent links — footer-of-section navigation, three tones." },
  { name: "TuxMediaSlab",     to: "/components/media-slab",     blurb: "Full-bleed hero band — overlay or split layout, three heights, three tones." },
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
  { name: "TuxTable",         to: "/components/table",          blurb: "UTable with tux chrome + auto status cells." },
  { name: "TuxTestimonial",   to: "/components/testimonial",    blurb: "Attributed quotes with portrait + name + role — grid or row." },
  { name: "TuxTreemap",       to: "/components/treemap",        blurb: "Squarified hierarchical-size viz — PECAN's headline chart, no external viz library." },
];
</script>

<template>
  <div class="space-y-10">
    <section>
      <p class="eyebrow">tti-ux</p>
      <h1 class="heading--display text-4xl">TTI Design System</h1>
      <p class="mt-4 max-w-2xl text-text-secondary leading-relaxed">
        A living style guide for Texas A&amp;M Transportation Institute apps built on Nuxt 4.
        Every page you see is rendered by the same components your app imports — so this site
        <span class="link-tti">is</span> the source of truth, not a doc of it.
      </p>
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
