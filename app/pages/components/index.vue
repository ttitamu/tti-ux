<script setup lang="ts">
useHead({ title: "Components · TUX" });

const components = [
  { name: "TuxAlert",         to: "/components/alert",          blurb: "Docusaurus-style admonitions — 8 variants including compliance and tip.",                    uses: "UAlert" },
  { name: "TuxAnnouncementBanner", to: "/components/announcement-banner", blurb: "Top-of-page dismissable strip for site-wide notices. localStorage-backed dismissal memory.", uses: "tux (no U-primitive)" },
  { name: "TuxBadge",         to: "/components/badge",          blurb: "Classification tiers, lifecycle statuses, monospace tags, and facet counts.",                 uses: "UBadge" },
  { name: "TuxAccordion",     to: "/components/accordion",      blurb: "FAQ + publication disclosure — native details/summary, zero-JS, single-mode + slot composition.",  uses: "tux (no U-primitive)" },
  { name: "TuxAlphaNav",      to: "/components/alpha-nav",      blurb: "A–Z jump bar — anchor mode for in-page jumps, emit mode for filter-in-place.",                 uses: "tux (no U-primitive)" },
  { name: "TuxBetaRibbon",    to: "/components/beta-ribbon",    blurb: "Environment label — corner ribbon, top stripe, or inline pill. preview/beta/dev tones.",       uses: "tux (no U-primitive)" },
  { name: "TuxBigStat",       to: "/components/big-stat",       blurb: "Single oversized metric — three sizes, three tones, three style variants.",                  uses: "tux (no U-primitive)" },
  { name: "TuxBlockquote",    to: "/components/blockquote",     blurb: "Standalone pull quote — centered or magazine-style drop-cap. Variant-aware rule + face.",      uses: "tux (no U-primitive)" },
  { name: "TuxBreadcrumbs",   to: "/components/breadcrumbs",    blurb: "Page-depth nav — home icon, italic intermediates, pipe rules collapsing to chevron on narrow.", uses: "tux (no U-primitive)" },
  { name: "TuxButton",        to: "/components/button",         blurb: "Semantic intent prop — primary, secondary, ghost, destructive (fills on hover).",              uses: "UButton" },
  { name: "TuxCallout",       to: "/components/callout",        blurb: "Pulled-aside editorial accent — fact / stat / quote with style-variant left rule.",          uses: "tux (no U-primitive)" },
  { name: "TuxCaptionedMedia", to: "/components/captioned-media", blurb: "Single image + caption + credit. 16:9 / 1:1 / 4:3 / 3:4 aspect, full / wide / right alignment.", uses: "tux (no U-primitive)" },
  { name: "TuxCard",          to: "/components/card",           blurb: "Static or linked — linked mode has corner-drop hover + appearing arrow.",                      uses: "tux (no U-primitive)" },
  { name: "TuxCardSlab",      to: "/components/card-slab",      blurb: "Full-bleed band of media-forward cards — \"browse our programs\" pattern, 2/3/4-up.",          uses: "tux (no U-primitive)" },
  { name: "TuxChatMessage",   to: "/components/chat-message",   blurb: "One conversation turn — user or assistant role, citations slot, tool row. Powers tti-ai-chat.", uses: "tux (no U-primitive)" },
  { name: "TuxCitations",     to: "/components/citations",      blurb: "Numbered source list under an assistant message — title + path + score in a 3-col grid.",      uses: "tux (no U-primitive)" },
  { name: "TuxCodeBlock",     to: "/components/code-block",     blurb: "Standalone Shiki code block — filename, line numbers, copy. Lazy-loads grammar on mount.",     uses: "Shiki" },
  { name: "TuxCodeMaroon",    to: "/components/code-maroon",    blurb: "Mandatory emergency alert banner — Rellis Code Maroon. Three severities, non-themed colors.",   uses: "tux (no U-primitive)" },
  { name: "TuxCommandPalette", to: "/components/command-palette", blurb: "Global ⌘K jump — search + grouped commands + keyboard nav, native <dialog>.",                  uses: "tux (no U-primitive)" },
  { name: "TuxContactCard",   to: "/components/contact-card",   blurb: "Directory card — portrait + name + role + typed contact rows. Vertical or horizontal.",       uses: "tux (no U-primitive)" },
  { name: "TuxContextPanel",  to: "/components/context-panel",  blurb: "Right-rail surface for chat grounding context (corpus, retrieval, usage). Slot-driven chrome.",  uses: "tux (no U-primitive)" },
  { name: "TuxConversationList", to: "/components/conversation-list", blurb: "Sidebar history of past conversations grouped by temporal bucket (TODAY / YESTERDAY / …).",  uses: "tux (no U-primitive)" },
  { name: "TuxCookieConsent", to: "/components/cookie-consent", blurb: "Privacy notice — bottom-right or full-width strip. localStorage-backed decision memory; categories slot.", uses: "tux (no U-primitive)" },
  { name: "TuxComposer",      to: "/components/composer",       blurb: "Chat input with optional compliance scope banner — model picker, corpus attach, ⌘↵ send.",     uses: "tux (no U-primitive)" },
  { name: "TuxReportFrame",   to: "/reports/frame",             blurb: "Page-sized canvas (letter / a4) for PDF + print. Stats, charts, prose go inside.",             uses: "tux (no U-primitive)" },
  { name: "TuxReportPrintSheet", to: "/reports/print-sheet",    blurb: "Drop-in print stylesheet; hides chrome, paginates with data-print-break attrs.",                uses: "useHead" },
  { name: "TuxReportWebFrame", to: "/reports/web-frame",        blurb: "Long-form web-hosted narrative — cover, byline, lede, sticky TOC, body, footer.",              uses: "tux (no U-primitive)" },
  { name: "TuxSparkline",     to: "/visualizations/sparkline",  blurb: "Inline mini trend line — no axes, optional area fill, last-point dot, delta arrow. Native SVG.", uses: "tux (no U-primitive)" },
  { name: "TuxVizEmbed",      to: "/visualizations/embed",      blurb: "Tableau / Power BI / Apache Superset / Grafana iframe wrapper with poster fallback.",          uses: "sandboxed iframe" },
  { name: "TuxVizGrid",       to: "/visualizations/grid",       blurb: "Small-multiples layout primitive — 2/3/4-up panes with shared editorial header. Container-queried.", uses: "tux (no U-primitive)" },
  { name: "TuxVizRPlot",      to: "/visualizations/rplot",      blurb: "R artifact wrapper — image / svg / htmlwidget — with source-line caption gutter.",              uses: "img / object / iframe" },
  { name: "TuxCTA",           to: "/components/cta",            blurb: "Big promotional block — three tones, three style variants, action slot.",                      uses: "tux (no U-primitive)" },
  { name: "TuxDescriptionList", to: "/components/description-list", blurb: "Term/definition pairs — native dl/dt/dd. Inline or stacked, editorial or data emphasis.",   uses: "tux (no U-primitive)" },
  { name: "TuxDiagram",       to: "/components/diagram",        blurb: "Mermaid diagrams-as-code — flowcharts, sequences, ERDs. Lazy-loaded ~3MB; brand-themed.",     uses: "Mermaid" },
  { name: "TuxDocsSidebar",   to: "/components/docs-sidebar",   blurb: "Hierarchical doc-site sidebar — collapsible sections, search filter, persisted collapse state.", uses: "tux (no U-primitive)" },
  { name: "TuxDropdown",      to: "/components/site-nav",       blurb: "Single-column dropdown from a top-bar nav item. Composes inside TuxSiteNav.",                  uses: "tux (no U-primitive)" },
  { name: "TuxEmptyState",    to: "/components/empty-state",    blurb: "No-data placeholder — tinted icon circle, title, description, CTA slot.",                     uses: "TuxCard composite" },
  { name: "TuxErrorPage",     to: "/components/error-page",     blurb: "Full-page 404/500/403/503 template — display-type code, recovery actions, support slot.",        uses: "tux (no U-primitive)" },
  { name: "TuxFactoid",       to: "/components/factoid",        blurb: "Institutional \"by the numbers\" — 3/4/5-up oversized stats, variant-aware numerals.",        uses: "tux (no U-primitive)" },
  { name: "TuxFilterPanel",   to: "/components/filter-panel",   blurb: "Left-rail facet panel — collapsible groups, checkbox lists with counts, applied-filter chips.", uses: "tux (no U-primitive)" },
  { name: "TuxFooter",        to: "/components/footer",         blurb: "Unified institutional footer \u2014 maroon marketing top (logo + address + social + columns) over the mandatory TAMUS legal strip.",     uses: "tux (no U-primitive)" },
  { name: "TuxIconFeature",   to: "/components/icon-feature",   blurb: "Icon + headline + body grid — classic \"our services\" block, three tones, grid or list.",   uses: "tux (no U-primitive)" },
  { name: "TuxIdentity",      to: "/components/identity",       blurb: "Header lockup — logo + wordmark. Lockup or text-only, horizontal or stacked, three levels.",   uses: "tux (no U-primitive)" },
  { name: "TuxLinkList",      to: "/components/link-list",      blurb: "Categorized resource list — grouped headings, optional descriptions, featured-item left bar.",   uses: "tux (no U-primitive)" },
  { name: "TuxLinkSlab",      to: "/components/link-slab",      blurb: "Full-width band of prominent links — footer-of-section navigation, three tones.",              uses: "tux (no U-primitive)" },
  { name: "TuxMediaSlab",     to: "/components/media-slab",     blurb: "Full-bleed hero band — overlay (drama) or split (editorial), three heights, three tones.",     uses: "tux (no U-primitive)" },
  { name: "TuxMegaMenu",      to: "/components/site-nav",       blurb: "Full-width multi-column panel from a top-bar item, optional featured tile. Composes inside TuxSiteNav.", uses: "tux (no U-primitive)" },
  { name: "TuxModal",         to: "/components/modal",          blurb: "UModal with editorial rhythm — optional eyebrow, gold-bar underlined title.",                  uses: "UModal" },
  { name: "TuxNewsCollection", to: "/components/news-collection", blurb: "News article list — date + thumbnail + headline + dek + read-more, stacked or grid.",        uses: "tux (no U-primitive)" },
  { name: "TuxPageHeader",    to: "/components/page-header",    blurb: "Eyebrow + gold-bar heading + subtitle — plain default, neutral or maroon panel, hero rhythm.", uses: "tux (no U-primitive)" },
  { name: "TuxPagination",    to: "/components/pagination",     blurb: "Page-number controls — squarified active page, ellipsis truncation, optional status line.",     uses: "tux (no U-primitive)" },
  { name: "TuxPhotoGrid",     to: "/components/photo-grid",     blurb: "Uniform image grid — photo (full color, captioned) or logo wall (grayscale-on-hover).",        uses: "tux (no U-primitive)" },
  { name: "TuxQACollection",  to: "/components/qa-collection",  blurb: "Long-form Q&A — always expanded, designed to be read top-to-bottom (companion to TuxAccordion).", uses: "tux (no U-primitive)" },
  { name: "TuxSearch",        to: "/components/search",         blurb: "Branded search bar — bordered input + uppercase action button. Regular / slim / focus state.", uses: "tux (no U-primitive)" },
  { name: "TuxSectionHeader", to: "/components/section-header", blurb: "Editorial section heading — ALL-CAPS, tracked-out, maroon underline.",                         uses: "tux (no U-primitive)" },
  { name: "TuxSidebarBlock",  to: "/components/sidebar-block",  blurb: "Sidebar widget wrapper — eyebrow + maroon underline + content. Default/bordered/filled.",      uses: "tux (no U-primitive)" },
  { name: "TuxSignupFeature", to: "/components/signup-feature", blurb: "Newsletter signup — email input + uppercase action + consent. Three tones, three style variants.", uses: "tux (no U-primitive)" },
  { name: "TuxSiteNav",       to: "/components/site-nav",       blurb: "Top-bar with TuxIdentity + utility nav + primary nav. Hosts TuxDropdown / TuxMegaMenu items.",   uses: "tux (no U-primitive)" },
  { name: "TuxSkeleton",      to: "/components/skeleton",       blurb: "Loading-state placeholder — primitive shapes + 6 composed presets. Honors prefers-reduced-motion.", uses: "tux (no U-primitive)" },
  { name: "TuxStepper",       to: "/components/stepper",        blurb: "Numbered-circle multi-step indicator — funding application, IRB submission, study onboarding.",   uses: "tux (no U-primitive)" },
  { name: "TuxTable",         to: "/components/table",          blurb: "UTable with tux chrome, automatic status-cell rendering via TuxBadge.",                    uses: "UTable" },
  { name: "TuxTestimonial",   to: "/components/testimonial",    blurb: "Attributed quotes with portrait + name + role — grid or row layout, three style variants.",   uses: "tux (no U-primitive)" },
  { name: "TuxTOC",           to: "/components/toc",            blurb: "Article table-of-contents — sticky right rail with IntersectionObserver-driven active state.",  uses: "tux (no U-primitive)" },
  { name: "TuxTreemap",       to: "/components/treemap",        blurb: "Squarified hierarchical-size viz — PECAN's headline chart, drill-in, no external library.",   uses: "tux (no U-primitive)" },
];
</script>

<template>
  <div class="space-y-8">
    <TuxPageHeader eyebrow="primitives" title="Components">
      Thin wrappers around Nuxt UI primitives. Each adds the TTI flavor
      (maroon brand, gold accents, editorial typography) without forking the
      underlying component — so a11y, theming, and color-mode all keep working.
    </TuxPageHeader>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TuxCard v-for="c in components" :key="c.name" :to="c.to">
        <p class="eyebrow">wraps {{ c.uses }}</p>
        <h2 class="text-xl font-bold">{{ c.name }}</h2>
        <p class="mt-2 text-sm text-text-secondary">{{ c.blurb }}</p>
      </TuxCard>
    </section>
  </div>
</template>
