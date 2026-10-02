/**
 * tuxCatalog — the single source of truth for the component catalog.
 *
 * Drives the app.vue sidebar navTree (Components / Reports / Visualizations
 * sections), the /components index card grid, the command-palette jump list
 * (via navTree), and the homepage catalog count. tests/tux-catalog.test.ts
 * enforces agreement between this list, app/components/ on disk, the page
 * routes, and the design/components.md catalog tables — add a component
 * anywhere and the test tells you every other place it must appear.
 *
 * INTERNAL_COMPONENTS are recursive children or showcase primitives that
 * deliberately have no catalog entry of their own.
 */

export type TuxCatalogFamily = "components" | "reports" | "visualizations";

export type TuxComponentCategory =
  | "actions"       // Actions & Commands
  | "navigation"    // Navigation & Layout
  | "data-display"  // Data Display & Records
  | "feedback"      // Feedback & Status
  | "forms"         // Forms & Controls
  | "ai"            // AI & Conversational
  | "publishing";   // Research & Publishing

export type TuxVizCategory =
  | "timeseries"    // Timeseries & Trends
  | "geospatial"    // Geospatial & Maps
  | "statistical"   // Statistical & Distributions
  | "embeds";       // BI & Analytics Embeds

export interface TuxCatalogEntry {
  /** Component or composable name as auto-imported, e.g. "TuxAlert". */
  name: string;
  /** Showcase route. Clustered families share one route. */
  to: string;
  /** Sidebar/palette icon (validated against app/utils/lucide-names.ts). */
  icon: string;
  /** Sidebar grouping. */
  family: TuxCatalogFamily;
  kind: "component" | "composable";
  /** What it wraps — mirrors the design/components.md "Wraps" column. */
  wraps: string;
  /** One-line card description for the /components index. */
  blurb: string;
  /** Semantic enterprise category for Component Lab organization. */
  category?: TuxComponentCategory;
  /** Semantic enterprise category for Data & Telemetry organization. */
  vizCategory?: TuxVizCategory;
}

export const INTERNAL_COMPONENTS = [
  "TuxExample",         // showcase primitive, used on every component page
  "TuxDocsSidebarNode", // recursive child of TuxDocsSidebar
  "TuxTreeNode",        // recursive child of TuxTree
  "TuxRuleBuilderGroup",// recursive child of TuxRuleBuilder
  // Async per-kind children of TuxChartGeographic (payload split: each
  // statically imports only its own geo data module) + their shared
  // SVG-fragment chrome. The parent stays the one catalogued API.
  "TuxChartGeoCounty",
  "TuxChartGeoDistricts",
  "TuxChartGeoUsContext",
  "TuxChartGeoDotDensity",
  "TuxChartGeoFlow",
  "TuxChartGeoTitle",
  "TuxChartGeoChoroplethLegend",
  "TuxDocSearch",
  "TuxFeedback",
  "TuxReactiveSidebar",
  "TuxStalenessBanner",
  "TuxFrameworkSwitcher",
  "TuxPlayground",
];

export const tuxCatalog: TuxCatalogEntry[] = [
  { name: "TuxAbstract", to: "/components/abstract", icon: "lucide:file-text", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Structured academic abstract block." },
  { name: "TuxAccordion", to: "/components/accordion", icon: "lucide:chevrons-up-down", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "FAQ + publication disclosure — native details/summary, zero-JS, single-mode + slot composition." },
  { name: "TuxAcknowledgments", to: "/components/acknowledgments", icon: "lucide:hand-heart", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Funding + acknowledgments + ethics block." },
  { name: "TuxActivityTimeline", to: "/components/activity-timeline", icon: "lucide:activity", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Editorial vertical timeline — maroon spine, mono timestamps, gold-ringed current node. Milestones, ingest feeds, session history." },
  { name: "TuxAlert", to: "/components/alert", icon: "lucide:message-square", family: "components", kind: "component", wraps: "UAlert", category: "feedback",
    blurb: "Docusaurus-style admonitions — 8 variants including compliance and tip." },
  { name: "TuxAlphaNav", to: "/components/alpha-nav", icon: "lucide:case-sensitive", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "A–Z jump bar — anchor mode for in-page jumps, emit mode for filter-in-place." },
  { name: "TuxAnnouncementBanner", to: "/components/announcement-banner", icon: "lucide:megaphone", family: "components", kind: "component", wraps: "tux native", category: "feedback",
    blurb: "Top-of-page dismissable strip for site-wide notices. localStorage-backed dismissal memory." },
  { name: "TuxAppFrame", to: "/components/app-frame", icon: "lucide:app-window", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "Custom Tauri titlebar — traffic lights (Mac) / min-max-close (Win/Linux), brand + toolbar slots, drag regions. Replaces native window decoration." },
  { name: "TuxAppSwitcher", to: "/components/app-switcher", icon: "lucide:layout-grid", family: "components", kind: "component", wraps: "UPopover", category: "actions",
    blurb: "Waffle-button popover for hopping between TTI portals — registry-fed via useTuxApps(), registry order everywhere, current tile carries aria-current." },
  { name: "TuxArtifact", to: "/components/artifact", icon: "lucide:file-output", family: "components", kind: "component", wraps: "tux native", category: "ai",
    blurb: "AI output container — header + actions + body slot. Wraps generated code, docs, exported datasets." },
  { name: "TuxAuthorByline", to: "/components/author-byline", icon: "lucide:users", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Multi-author byline with affiliations + ORCID." },
  { name: "TuxAvatar", to: "/components/avatar", icon: "lucide:circle-user-round", family: "components", kind: "component", wraps: "tux native", category: "feedback",
    blurb: "Identity mark primitive — photo with initials fallback + optional status dot. Extracted from TuxUserMenu." },
  { name: "TuxBadge", to: "/components/badge", icon: "lucide:badge", family: "components", kind: "component", wraps: "UBadge", category: "feedback",
    blurb: "Unified status & taxonomy badge — classification tiers, lifecycle states, bold modes, status dots, leading icons, and facet counts." },
  { name: "TuxBetaRibbon", to: "/components/beta-ribbon", icon: "lucide:flag-triangle-right", family: "components", kind: "component", wraps: "tux native", category: "feedback",
    blurb: "Environment label — corner ribbon, top stripe, or inline pill. preview/beta/dev tones." },
  { name: "TuxBigStat", to: "/components/big-stat", icon: "lucide:trending-up", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Single oversized metric — three sizes, three tones, three style variants." },
  { name: "TuxBlockquote", to: "/components/blockquote", icon: "lucide:quote", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Standalone pull quote — centered or magazine-style drop-cap. Variant-aware rule + face." },
  { name: "TuxBranchNav", to: "/components/branch-nav", icon: "lucide:git-branch", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "‹ N of M › navigator for response alternatives. Lives in TuxChatMessage's #header-trailing slot." },
  { name: "TuxBreadcrumbs", to: "/components/breadcrumbs", icon: "lucide:chevrons-right", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "Page-depth nav — home icon, italic intermediates, pipe rules collapsing to chevron on narrow." },
  { name: "TuxButton", to: "/components/button", icon: "lucide:rectangle-horizontal", family: "components", kind: "component", wraps: "UButton", category: "actions",
    blurb: "Semantic intent prop — primary, secondary, ghost, destructive (fills on hover)." },
  { name: "TuxCTA", to: "/components/cta", icon: "lucide:megaphone", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Big promotional block — three tones, three style variants, action slot." },
  { name: "TuxCallout", to: "/components/callout", icon: "lucide:flag-triangle-right", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Pulled-aside editorial accent — fact / stat / quote with style-variant left rule." },
  { name: "TuxCapabilityCluster", to: "/components/capability-cluster", icon: "lucide:orbit", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Orbital research capability medallions with concentric gold and maroon halos." },
  { name: "TuxCaptionedMedia", to: "/components/captioned-media", icon: "lucide:image", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Single image + caption + credit. 16:9 / 1:1 / 4:3 / 3:4 aspect, full / wide / right alignment." },
  { name: "TuxCard", to: "/components/card", icon: "lucide:square-stack", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Static or linked — linked mode has corner-drop hover + appearing arrow." },
  { name: "TuxCardCarousel", to: "/components/card-carousel", icon: "lucide:gallery-horizontal-end", family: "components", kind: "component", wraps: "UCarousel (embla) wrap", category: "data-display",
    blurb: "Horizontal scroll of cards — eyebrow + display title + arrows + dots. Wraps UCarousel." },
  { name: "TuxCardSlab", to: "/components/card-slab", icon: "lucide:rows-3", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Full-bleed band of media-forward cards — \\\"browse our programs\\\" pattern, 2/3/4-up." },
  { name: "TuxCenterBadge", to: "/components/tti-identity", icon: "lucide:landmark", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "TTI center / division marker." },
  { name: "TuxECharts", to: "/visualizations/echarts", icon: "lucide:activity", family: "visualizations", kind: "component", wraps: "Apache ECharts", vizCategory: "timeseries",
    blurb: "High-performance Canvas and WebGL interactive telemetry charts, live multi-series telemetry, and massive dataset exploration with TUX design tokens." },
  { name: "TuxChartArea", to: "/visualizations/chart-area", icon: "lucide:area-chart", family: "visualizations", kind: "component", wraps: "tux native SVG", vizCategory: "timeseries",
    blurb: "Native SVG area chart — overlay or stacked variants, end-of-area labels, paired with TuxBigStat for the KPI-strip composition." },
  { name: "TuxChartBar", to: "/visualizations/chart-bar", icon: "lucide:bar-chart-3", family: "visualizations", kind: "component", wraps: "tux native SVG", vizCategory: "timeseries",
    blurb: "Native SVG bar chart — single / grouped / stacked variants, vertical or horizontal, optional comparison overlay (projection vs actual)." },
  { name: "TuxChartDonut", to: "/visualizations/chart-donut", icon: "lucide:pie-chart", family: "visualizations", kind: "component", wraps: "tux native SVG", vizCategory: "statistical",
    blurb: "Share-of-total donut — center stat slot, slice-label colored to wedge, minSlice% auto-folds tiny slices into Other." },
  { name: "TuxChartFrame", to: "/visualizations/chart-frame", icon: "lucide:frame", family: "visualizations", kind: "component", wraps: "tux native (editorial wrapper)", vizCategory: "timeseries",
    blurb: "Editorial wrapper that ties native chart components into the TUX type system." },
  { name: "TuxChartGauge", to: "/visualizations/chart-gauge", icon: "lucide:gauge", family: "visualizations", kind: "component", wraps: "tux native SVG", vizCategory: "timeseries",
    blurb: "270° arc gauge for single-target metrics — needle + tone bands, or radial-progress variant. Use sparingly." },
  { name: "TuxChartGeographic", to: "/visualizations/chart-geographic", icon: "lucide:map", family: "visualizations", kind: "component", wraps: "tux native (5-kind Texas map)", vizCategory: "geospatial",
    blurb: "Texas-flavored geographic charts." },
  { name: "TuxChartHeatmap", to: "/visualizations/chart-heatmap", icon: "lucide:grid-3x3", family: "visualizations", kind: "component", wraps: "tux native SVG", vizCategory: "statistical",
    blurb: "Matrix heatmap on the sequential map ramps — crashes by day × hour, corridor demand by month. 2-D keyboard cursor, honest null cells." },
  { name: "TuxChartHistogram", to: "/visualizations/chart-histogram", icon: "lucide:bar-chart-4", family: "visualizations", kind: "component", wraps: "tux native SVG", vizCategory: "statistical",
    blurb: "Distribution over raw samples — nice 1/2/5 bin edges, dashed gold p50/p95 percentile rules, normalize-to-share mode. The reliability chart." },
  { name: "TuxChartLine", to: "/visualizations/chart-line", icon: "lucide:line-chart", family: "visualizations", kind: "component", wraps: "tux native SVG", vizCategory: "timeseries",
    blurb: "Native SVG line chart — end-of-line value labels, optional previous-period overlay + confidence band, auto SR summary." },
  { name: "TuxChartScatter", to: "/visualizations/chart-scatter", icon: "lucide:scatter-chart", family: "visualizations", kind: "component", wraps: "tux native SVG", vizCategory: "statistical",
    blurb: "Correlation plot — x vs y dots, optional linear-regression trendline + R², bubble-chart mode via per-point size." },
  { name: "TuxChartSunburst", to: "/visualizations/chart-sunburst", icon: "lucide:circle-dot", family: "visualizations", kind: "component", wraps: "tux native (two-ring radial)", vizCategory: "statistical",
    blurb: "Radial counterpart to `TuxTreemap`." },
  { name: "TuxChatBubble", to: "/components/chat-bubble", icon: "lucide:bot-message-square", family: "components", kind: "component", wraps: "tux native", category: "ai",
    blurb: "Conversational speech bubble and floating assistant launcher primitive for interactive queries." },
  { name: "TuxChatMessage", to: "/components/chat-message", icon: "lucide:message-square-text", family: "components", kind: "component", wraps: "tux native", category: "ai",
    blurb: "One conversation turn — user or assistant role, citations slot, tool row. Powers tti-ai-chat." },
  { name: "TuxCitationExport", to: "/components/citation-export", icon: "lucide:download", family: "components", kind: "component", wraps: "UDropdownMenu", category: "publishing",
    blurb: "Academic citation export menu." },
  { name: "TuxCitations", to: "/components/citations", icon: "lucide:quote", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Numbered source list under an assistant message — title + path + score in a 3-col grid." },
  { name: "TuxCodeBlock", to: "/components/code-block", icon: "lucide:code", family: "components", kind: "component", wraps: "Shiki", category: "publishing",
    blurb: "Standalone Shiki code block — filename, line numbers, copy. Lazy-loads grammar on mount." },
  { name: "TuxCodeMaroon", to: "/components/code-maroon", icon: "lucide:siren", family: "components", kind: "component", wraps: "tux native", category: "feedback",
    blurb: "Mandatory emergency alert banner — Rellis Code Maroon. Three severities, non-themed colors." },
  { name: "TuxCommandBar", to: "/components/command-bar", icon: "lucide:menu", family: "components", kind: "component", wraps: "tux native", category: "actions",
    blurb: "Standardized action ribbon — contextual actions, search filter, and bulk selection mode." },
  { name: "TuxCommandPalette", to: "/components/command-palette", icon: "lucide:command", family: "components", kind: "component", wraps: "tux native", category: "actions",
    blurb: "Global ⌘K jump — search + grouped commands + keyboard nav, native <dialog>." },
  { name: "TuxCommentThread", to: "/components/comment-thread", icon: "lucide:message-square-quote", family: "components", kind: "component", wraps: "tux native", category: "ai",
    blurb: "Peer-review / editorial threads — root + replies, @mentions, resolve/reopen, edit/delete own." },
  { name: "TuxCommHero", to: "/components/comm-hero", icon: "lucide:panel-top", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Architectural portal hero with diagonal chamfer cut, gold accent block, and framed photography." },
  { name: "TuxComposer", to: "/components/composer", icon: "lucide:pencil-line", family: "components", kind: "component", wraps: "tux native", category: "ai",
    blurb: "Chat input with optional compliance scope banner — model picker, corpus attach, ⌘↵ send." },
  { name: "TuxConfirmDialog", to: "/components/confirm-dialog", icon: "lucide:square-check", family: "components", kind: "component", wraps: "TuxModal preset", category: "feedback",
    blurb: "TuxModal preset for destructive-action confirmation." },
  { name: "TuxContactCard", to: "/components/contact-card", icon: "lucide:circle-user", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Directory card — portrait + name + role + typed contact rows. Vertical or horizontal." },
  { name: "TuxContextMeter", to: "/components/context-meter", icon: "lucide:gauge", family: "components", kind: "component", wraps: "UPopover", category: "ai",
    blurb: "Token-utilization meter — pill + conic ring + popover with input/output/cost. Tone-codes success/warning/error." },
  { name: "TuxContextPanel", to: "/components/context-panel", icon: "lucide:panel-right", family: "components", kind: "component", wraps: "tux native", category: "ai",
    blurb: "Right-rail surface for chat grounding context (corpus, retrieval, usage). Slot-driven chrome." },
  { name: "TuxConversationList", to: "/components/conversation-list", icon: "lucide:message-square", family: "components", kind: "component", wraps: "tux native", category: "ai",
    blurb: "Sidebar history of past conversations grouped by temporal bucket (TODAY / YESTERDAY / …)." },
  { name: "TuxCookieConsent", to: "/components/cookie-consent", icon: "lucide:cookie", family: "components", kind: "component", wraps: "tux native", category: "feedback",
    blurb: "Privacy notice — bottom-right or full-width strip. localStorage-backed decision memory; categories slot." },
  { name: "TuxCorridorStrip", to: "/components/geospatial", icon: "lucide:route", family: "components", kind: "component", wraps: "tux native SVG", category: "data-display",
    blurb: "Linear corridor visualization." },
  { name: "TuxDataTable", to: "/components/data-table", icon: "lucide:table-2", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Research-deliverable table — numbered caption, uncertainty cells (value ± CI), footnote anchors, totals row, source citation. Static (printable)." },
  { name: "TuxDescriptionList", to: "/components/description-list", icon: "lucide:list", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Term/definition pairs — native dl/dt/dd. Inline or stacked, editorial or data emphasis." },
  { name: "TuxDiagram", to: "/components/diagram", icon: "lucide:workflow", family: "components", kind: "component", wraps: "Mermaid", category: "publishing",
    blurb: "Mermaid diagrams-as-code — flowcharts, sequences, ERDs. Lazy-loaded ~3MB; brand-themed." },
  { name: "TuxDocsSidebar", to: "/components/docs-sidebar", icon: "lucide:panel-left", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "Hierarchical doc-site sidebar — collapsible sections, search filter, persisted collapse state." },
  { name: "TuxDropdown", to: "/components/site-nav", icon: "lucide:chevron-down", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "Single-column dropdown from a top-bar nav item. Composes inside TuxSiteNav." },
  { name: "TuxEditorialArticle", to: "/components/editorial-article", icon: "lucide:newspaper", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Flagship publication reader parities MyTTI Inside Lane and EmDash CMS with switchable hero presentations, sticky TOC, and reading progress." },
  { name: "TuxEmptyState", to: "/components/empty-state", icon: "lucide:inbox", family: "components", kind: "component", wraps: "TuxCard composite", category: "feedback",
    blurb: "No-data placeholder — tinted icon circle, title, description, CTA slot." },
  { name: "TuxErrorPage", to: "/components/error-page", icon: "lucide:circle-alert", family: "components", kind: "component", wraps: "tux native", category: "feedback",
    blurb: "Full-page 404/500/403/503 template — display-type code, recovery actions, support slot." },
  { name: "TuxEventCalendarRow", to: "/components/event-calendar-row", icon: "lucide:calendar-days", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Institutional event row with emerald date chip, time, title, and RSVP/view action." },
  { name: "TuxFAB", to: "/components/fab", icon: "lucide:circle-plus", family: "components", kind: "component", wraps: "tux native", category: "actions",
    blurb: "Floating Action Button. Material-pattern primary action; icon-only circle or extended pill. Honors safe-area-inset." },
  { name: "TuxFactoid", to: "/components/factoid", icon: "lucide:hash", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Institutional \\\"by the numbers\\\" — 3/4/5-up oversized stats, variant-aware numerals." },
  { name: "TuxFigureCaption", to: "/components/figure-caption", icon: "lucide:captions", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Auto-numbered caption for figures, tables, exhibits, equations." },
  { name: "TuxFileDropzone", to: "/components/file-dropzone", icon: "lucide:cloud-upload", family: "components", kind: "component", wraps: "tux native", category: "forms",
    blurb: "Drag-and-drop file upload." },
  { name: "TuxFilterPanel", to: "/components/filter-panel", icon: "lucide:list-filter", family: "components", kind: "component", wraps: "tux native", category: "forms",
    blurb: "Left-rail facet panel — collapsible groups, checkbox lists with counts, applied-filter chips." },
  { name: "TuxFocusView", to: "/components/focus-view", icon: "lucide:focus", family: "components", kind: "component", wraps: "Teleport + native", category: "navigation",
    blurb: "Full-viewport overlay for inspecting one piece of content — back + title + actions chrome, content slot. \\\"Open chart in focus mode.\\\"" },
  { name: "TuxFooter", to: "/components/footer", icon: "lucide:panel-bottom", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "Unified institutional footer \\u2014 maroon contact and resources block over accessible legal baseline." },
  { name: "TuxFootnote", to: "/components/footnote", icon: "lucide:asterisk", family: "components", kind: "component", wraps: "UPopover", category: "publishing",
    blurb: "Inline footnote reference + hover preview." },
  { name: "TuxFormField", to: "/components/form-field", icon: "lucide:text-cursor-input", family: "components", kind: "component", wraps: "tux native", category: "forms",
    blurb: "Label + help + input + error stack." },
  { name: "TuxFundingSource", to: "/components/tti-identity", icon: "lucide:hand-coins", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Funder identity strip / chip." },
  { name: "TuxHeroCanvas", to: "/components/hero-canvas", icon: "lucide:sparkles", family: "components", kind: "component", wraps: "HTML5 2D Canvas", category: "publishing",
    blurb: "Atmospheric celestial and telemetry hero simulation inspired by OpenAI Sol with glowing corona, stardust sparks, constellation mesh, and seamless bottom dissolve." },
  { name: "TuxIconFeature", to: "/components/icon-feature", icon: "lucide:layout-grid", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Icon + headline + body grid — classic \\\"our services\\\" block, three tones, grid or list." },
  { name: "TuxIdentity", to: "/components/identity", icon: "lucide:flag", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Header lockup — logo + wordmark. Lockup or text-only, horizontal or stacked, three levels." },
  { name: "TuxInfiniteScroll", to: "/components/infinite-scroll", icon: "lucide:chevrons-down", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "IntersectionObserver sentinel that auto-fetches the next page. Honors prefers-reduced-motion + keyboard fallback." },
  { name: "TuxInfoLabel", to: "/components/info-label", icon: "lucide:info", family: "components", kind: "component", wraps: "UPopover", category: "forms",
    blurb: "Form-field label with (i) help — hover or click popover with the explanation. For ITAR rubrics, retention classes, classifier metrics." },
  { name: "TuxInlineCitation", to: "/components/inline-citation", icon: "lucide:text-quote", family: "components", kind: "component", wraps: "UPopover", category: "publishing",
    blurb: "Academic-style inline [N] citation pill — hover reveals title + URL + excerpt + score. Composes with TuxCitations footer list." },
  { name: "TuxKbd", to: "/components/kbd", icon: "lucide:keyboard", family: "components", kind: "component", wraps: "tux native", category: "actions",
    blurb: "Token-styled <kbd> for shortcut hints. Mac/PC modifier normalization, three sizes, combo + sequence forms." },
  { name: "TuxLab", to: "/components/tti-identity", icon: "lucide:flask-conical", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "TTI lab / center identity card." },
  { name: "TuxLinkList", to: "/components/link-list", icon: "lucide:list-tree", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Categorized resource list — grouped headings, optional descriptions, featured-item left bar." },
  { name: "TuxLinkSlab", to: "/components/link-slab", icon: "lucide:menu", family: "components", kind: "component", wraps: "tux native", category: "actions",
    blurb: "Full-width band of prominent links — footer-of-section navigation, three tones." },
  { name: "TuxLoadMore", to: "/components/load-more", icon: "lucide:circle-plus", family: "components", kind: "component", wraps: "tux native", category: "actions",
    blurb: "Explicit \\\"Load more\\\" button + remaining count + terminal divider when all loaded. SEO-friendly middle ground." },
  { name: "TuxMapEmbed", to: "/components/geospatial", icon: "lucide:map", family: "components", kind: "component", wraps: "iframe / slot", category: "data-display",
    blurb: "Library-agnostic map embed wrapper." },
  { name: "TuxMapLegend", to: "/components/geospatial", icon: "lucide:list-tree", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Standalone legend for embedded maps." },
  { name: "TuxMapMarker", to: "/components/geospatial", icon: "lucide:map-pin", family: "components", kind: "component", wraps: "tux native SVG", category: "data-display",
    blurb: "Research-typed map marker." },
  { name: "TuxMarkdownEditor", to: "/components/markdown-editor", icon: "lucide:pen-line", family: "components", kind: "component", wraps: "tux native (no deps)", category: "forms",
    blurb: "Textarea with markdown shortcuts." },
  { name: "TuxMcpEmbed", to: "/components/mcp-embed", icon: "lucide:plug", family: "components", kind: "component", wraps: "tux native", category: "ai",
    blurb: "Frame for interactive third-party MCP app output — app icon + name + window controls + skeleton. Sister to TuxArtifact." },
  { name: "TuxMediaSlab", to: "/components/media-slab", icon: "lucide:image-plus", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Full-bleed hero band — overlay (drama) or split (editorial), three heights, three tones." },
  { name: "TuxMegaMenu", to: "/components/site-nav", icon: "lucide:panels-top-left", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "Full-width multi-column panel from a top-bar item, optional featured tile. Composes inside TuxSiteNav." },
  { name: "TuxMenuBar", to: "/components/menu-bar", icon: "lucide:menu", family: "components", kind: "component", wraps: "UDropdownMenu", category: "actions",
    blurb: "In-window File / Edit / View / Help menu strip for Windows / Linux Tauri shells. Skipped on Mac (system menu wins)." },
  { name: "TuxMetroInset", to: "/visualizations/metro-inset", icon: "lucide:locate", family: "visualizations", kind: "component", wraps: "tux native (neighborhood grid)", vizCategory: "geospatial",
    blurb: "Neighborhood-grid inset for a single metro, intended for 4-up side-by-side layouts (Houston · DFW · Austin · San Antonio)." },
  { name: "TuxMobileFrame", to: "/components/mobile-frame", icon: "lucide:smartphone", family: "components", kind: "component", wraps: "tux native (CSS)", category: "publishing",
    blurb: "Stylized device chrome for screenshots — iOS (iPhone) or Android (Pixel) via platform prop. Doc-only marketing helper." },
  { name: "TuxModal", to: "/components/modal", icon: "lucide:panel-top-open", family: "components", kind: "component", wraps: "UModal", category: "feedback",
    blurb: "UModal with editorial rhythm — optional eyebrow, gold-bar underlined title." },
  { name: "TuxNewsCollection", to: "/components/news-collection", icon: "lucide:newspaper", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "News article list — date + thumbnail + headline + dek + read-more, stacked or grid." },
  { name: "TuxPageContainer", to: "/components/page-container", icon: "lucide:scaling", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "Content-width primitive — default/wide/prose measures backed by --layout-* tokens; pairs with --tux-nav-height." },
  { name: "TuxPageHeader", to: "/components/page-header", icon: "lucide:pilcrow", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Eyebrow + gold-bar heading + subtitle — plain default, neutral or maroon panel, hero rhythm." },
  { name: "TuxPagination", to: "/components/pagination", icon: "lucide:list-ordered", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "Page-number controls — squarified active page, ellipsis truncation, optional status line." },
  { name: "TuxPaperMeta", to: "/components/paper-meta", icon: "lucide:file-badge", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Academic paper metadata block." },
  { name: "TuxPhotoGrid", to: "/components/photo-grid", icon: "lucide:images", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Uniform image grid — photo (full color, captioned) or logo wall (grayscale-on-hover)." },
  { name: "TuxPopover", to: "/components/popover", icon: "lucide:message-square-more", family: "components", kind: "component", wraps: "UPopover", category: "feedback",
    blurb: "Richer-than-tooltip floating panel — title + body + actions. Maroon hairline rule under title. Click default; hover for read-only." },
  { name: "TuxPortalHeader", to: "/components/portal-shell", icon: "lucide:panel-top", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "Two-tier institutional header matching tti.tamu.edu — Maroon utility bar + crisp brand ribbon + mobile drawer." },
  { name: "TuxPortalShell", to: "/components/portal-shell", icon: "lucide:layout-template", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "Turnkey institutional portal layout shell — sticky header, gold-rule breadcrumbs subnav, hero slot, feedback pill, and TuxFooter." },
  { name: "TuxProgram", to: "/components/tti-identity", icon: "lucide:milestone", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Research-program identity card." },
  { name: "TuxProse", to: "/components/prose", icon: "lucide:text", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Typographic shell for long-form markdown — H1/H2/H3/p/list/code/table/blockquote rhythm in one wrapper." },
  { name: "TuxQACollection", to: "/components/qa-collection", icon: "lucide:message-circle-question-mark", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Long-form Q&A — always expanded, designed to be read top-to-bottom (companion to TuxAccordion)." },
  { name: "TuxRailNav", to: "/components/rail-nav", icon: "lucide:panel-left", family: "components", kind: "component", wraps: "tux (no U-primitive)", category: "navigation",
    blurb: "Collapsible sidebar/rail navigation — native <details> disclosure groups (accessible without roleless aria-expanded), icon-only collapsed mode. tux-owned replacement for UNavigationMenu in app shells." },
  { name: "TuxReactionBar", to: "/components/reaction-bar", icon: "lucide:thumbs-up", family: "components", kind: "component", wraps: "tux native", category: "actions",
    blurb: "Light-touch helpful/question/disagree row. Lower friction than a feedback form; counts display-only." },
  { name: "TuxRecordHighlights", to: "/components/record-highlights", icon: "lucide:panel-top", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Pinned entity summary bar — title, status badge, KPI metric chips, and primary action buttons." },
  { name: "TuxRemovableChip", to: "/components/removable-chip", icon: "lucide:tag", family: "components", kind: "component", wraps: "tux native", category: "forms",
    blurb: "Interactive dismissible chip — leading icon, three sizes, removable × or click-to-remove whole pill. Distinct from TuxBadge (decorative)." },
  { name: "TuxReportFrame", to: "/reports/frame", icon: "lucide:file-text", family: "reports", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Page-sized canvas (letter / a4) for PDF + print. Stats, charts, prose go inside." },
  { name: "TuxReportPrintSheet", to: "/reports/print-sheet", icon: "lucide:printer", family: "reports", kind: "component", wraps: "useHead injection", category: "publishing",
    blurb: "Drop-in print stylesheet; hides chrome, paginates with data-print-break attrs." },
  { name: "TuxReportWebFrame", to: "/reports/web-frame", icon: "lucide:globe", family: "reports", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Long-form web-hosted narrative — cover, byline, lede, sticky TOC, body, footer." },
  { name: "TuxResearcher", to: "/components/tti-identity", icon: "lucide:user-round", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Researcher profile card." },
  { name: "TuxResultCount", to: "/components/result-count", icon: "lucide:sigma", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "\\\"Showing 1–24 of 412 corridors · 24 per page\\\". Pairs with TuxPagination / TuxLoadMore / TuxInfiniteScroll." },
  { name: "TuxRichDataGrid", to: "/components/rich-data-grid", icon: "lucide:layout-grid", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Interactive data grid — sticky header, row selection, expandable detail, sort + filter chips, bulk-action bar. Landscape-class operational surfaces." },
  { name: "TuxRichTextEditor", to: "/components/rich-text-editor", icon: "lucide:pen-line", family: "components", kind: "component", wraps: "Tiptap + lowlight", category: "forms",
    blurb: "Canonical WYSIWYG — Tiptap-based, 7 toolbar groups, tables, task lists, source-mode toggle, full-screen, syntax highlighting." },
  { name: "TuxRuleBuilder", to: "/components/rule-builder", icon: "lucide:filter", family: "components", kind: "component", wraps: "tux native", category: "forms",
    blurb: "Relational query UI — field + operator + value rows, AND/OR groupers, nestable. Sister to faceted TuxFilterPanel." },
  { name: "TuxScrollTop", to: "/components/scroll-top", icon: "lucide:circle-arrow-up", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "EmDash-inspired circular reading-progress button that smoothly scrolls back to the top of the page." },
  { name: "TuxSearch", to: "/components/search", icon: "lucide:search", family: "components", kind: "component", wraps: "tux native", category: "forms",
    blurb: "Branded search bar — bordered input + uppercase action button. Regular / slim / focus state." },
  { name: "TuxSectionHeader", to: "/components/section-header", icon: "lucide:heading", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Editorial section heading — ALL-CAPS, tracked-out, maroon underline." },
  { name: "TuxShortcutsHelp", to: "/components/shortcuts-help", icon: "lucide:keyboard", family: "components", kind: "component", wraps: "tux native (<dialog>)", category: "actions",
    blurb: "Modal overlay listing every wired keyboard shortcut — combos vs sequences, opens on ?. Sibling to TuxCommandPalette." },
  { name: "TuxSidebarBlock", to: "/components/sidebar-block", icon: "lucide:panel-right", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Sidebar widget wrapper — eyebrow + maroon underline + content. Default/bordered/filled." },
  { name: "TuxSignupFeature", to: "/components/signup-feature", icon: "lucide:mail-plus", family: "components", kind: "component", wraps: "tux native", category: "publishing",
    blurb: "Newsletter signup — email input + uppercase action + consent. Three tones, three style variants." },
  { name: "TuxSiteNav", to: "/components/site-nav", icon: "lucide:square-menu", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "Top-bar with TuxIdentity + utility nav + primary nav. Hosts TuxDropdown / TuxMegaMenu items." },
  { name: "TuxSkeleton", to: "/components/skeleton", icon: "lucide:loader", family: "components", kind: "component", wraps: "tux native", category: "feedback",
    blurb: "Loading-state placeholder — primitive shapes + 6 composed presets. Honors prefers-reduced-motion." },
  { name: "TuxSlideover", to: "/components/slideover", icon: "lucide:panel-right", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "Edge-anchored drawer — row detail, filter panel, mobile nav, action sheet. Right/left/bottom anchors, native <dialog>." },
  { name: "TuxSparkline", to: "/visualizations/sparkline", icon: "lucide:trending-up", family: "visualizations", kind: "component", wraps: "tux native (inline SVG)", vizCategory: "timeseries",
    blurb: "Inline mini trend line — no axes, optional area fill, last-point dot, delta arrow. Native SVG." },
  { name: "TuxSpectrumFacts", to: "/components/spectrum-facts", icon: "lucide:layout-list", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "5-column institutional metrics banner mapping the Comm spectrum palette with icon headers and colored footers." },
  { name: "TuxSpectrumRibbon", to: "/components/spectrum-ribbon", icon: "lucide:palette", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "5-band responsive institutional color ribbon representing TTI research divisions." },
  { name: "TuxSplashScreen", to: "/components/splash-screen", icon: "lucide:loader-circle", family: "components", kind: "component", wraps: "tux native", category: "feedback",
    blurb: "Branded app-launch overlay — brand mark + maroon hairline + status. Bridges Tauri window-show → Vue hydrate gap. Fades when loaded." },
  { name: "TuxSplitPane", to: "/components/split-pane", icon: "lucide:columns-2", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "In-page master-detail layout — resizable list + detail + optional bottom pane. Width persists via localStorage. URL-bound selection." },
  { name: "TuxStatComparison", to: "/components/stat-comparison", icon: "lucide:arrow-up-right", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Before/after stat block with delta + tone. Direct or inverted polarity (down-is-good metrics). Row / stack / inline layouts." },
  { name: "TuxStatus", to: "/components/status", icon: "lucide:heart-pulse", family: "components", kind: "component", wraps: "tux native (tux-ops.css)", category: "feedback",
    blurb: "Operational state chip — ok / warning / unknown / critical / pending / maintenance. Class API is kit/css/tux-ops.css so CGI overlays and Vue share pixels." },
  { name: "TuxStatusToast", to: "/components/status-toast", icon: "lucide:bell-ring", family: "components", kind: "component", wraps: "tux native (useTuxToast bus)", category: "feedback",
    blurb: "Transient-notification host + useTuxToast() bus — polite live region, sticky errors, reduced-motion aware, Tauri OS-notification escalation." },
  { name: "TuxStepper", to: "/components/stepper", icon: "lucide:list-checks", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "Numbered-circle multi-step indicator — funding application, IRB submission, study onboarding." },
  { name: "TuxSuggestionChips", to: "/components/suggestion-chips", icon: "lucide:sparkles", family: "components", kind: "component", wraps: "tux native", category: "ai",
    blurb: "Horizontal row of clickable prompt-suggestion chips. Empty-state composer or post-response follow-ups." },
  { name: "TuxTOC", to: "/components/toc", icon: "lucide:list-ordered", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "Article table-of-contents — sticky right rail with IntersectionObserver-driven active state." },
  { name: "TuxTabBar", to: "/components/tab-bar", icon: "lucide:layout-panel-top", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "Bottom-anchored 3-5 mobile tabs — icon + label, maroon top-edge active rule, safe-area-inset-bottom honored. Tauri Mobile target." },
  { name: "TuxTable", to: "/components/table", icon: "lucide:table", family: "components", kind: "component", wraps: "UTable", category: "data-display",
    blurb: "UTable with tux chrome, automatic status-cell rendering via TuxBadge." },
  { name: "TuxTableCaption", to: "/components/table-caption", icon: "lucide:table-properties", family: "components", kind: "component", wraps: "composes TuxFigureCaption", category: "publishing",
    blurb: "Auto-numbered caption for tables." },
  { name: "TuxTabs", to: "/components/tabs", icon: "lucide:rectangle-vertical", family: "components", kind: "component", wraps: "UTabs", category: "navigation",
    blurb: "Editorial tabs with maroon active underline. Horizontal + vertical orientations; `bold` intent for eyebrow-rhythm labels." },
  { name: "TuxTeachingPopover", to: "/components/teaching-popover", icon: "lucide:graduation-cap", family: "components", kind: "component", wraps: "tux native", category: "feedback",
    blurb: "Onboarding/guided-tour tooltip — image, body, Next/Skip, step counter. On-brand variant for high emphasis." },
  { name: "TuxTestimonial", to: "/components/testimonial", icon: "lucide:message-circle-heart", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Attributed quotes with portrait + name + role — grid or row layout, three style variants." },
  { name: "TuxTileGrid", to: "/components/tile-grid", icon: "lucide:grid-2x2", family: "components", kind: "component", wraps: "tux native", category: "navigation",
    blurb: "Service launcher grid with eggshell background, line icons, titles, and descriptive subtitles." },
  { name: "TuxTooltip", to: "/components/tooltip", icon: "lucide:message-square-quote", family: "components", kind: "component", wraps: "UTooltip", category: "feedback",
    blurb: "Keyboard-accessible hover-help with optional title + hairline rule. Tuned max-width (~22ch)." },
  { name: "TuxTree", to: "/components/tree", icon: "lucide:list-tree", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Hierarchical list — sitemap, corpus + filesystem browser, BI dataset explorer. Mono leaf labels, sand guide lines, persistence." },
  { name: "TuxTreemap", to: "/components/treemap", icon: "lucide:layout-dashboard", family: "components", kind: "component", wraps: "tux native", category: "data-display",
    blurb: "Squarified hierarchical-size viz — Landscape's headline chart, drill-in, no external library." },
  { name: "TuxUserMenu", to: "/components/utility-cluster", icon: "lucide:circle-user", family: "components", kind: "component", wraps: "UDropdownMenu", category: "navigation",
    blurb: "The suite's one identity affordance — cluster chip or rail-footer mount, state-complete (loading / signed-out / signed-in / local-only / error), law-fixed menu order." },
  { name: "TuxUtilityCluster", to: "/components/utility-cluster", icon: "lucide:layout-grid", family: "components", kind: "component", wraps: "tux (composes TuxAppSwitcher + TuxUserMenu)", category: "navigation",
    blurb: "The trailing app-control cluster — search · notifications · theme · waffle · identity in law-fixed DOM order. Registry-fed waffle + role=status theme announcements." },
  { name: "TuxValidationSummary", to: "/components/validation-summary", icon: "lucide:circle-alert", family: "components", kind: "component", wraps: "tux native", category: "feedback",
    blurb: "Error list at the top of a long form." },
  { name: "TuxVizEmbed", to: "/visualizations/embed", icon: "lucide:bar-chart-3", family: "visualizations", kind: "component", wraps: "sandboxed <iframe> + poster fallback", vizCategory: "embeds",
    blurb: "Tableau / Power BI / Apache Superset / Grafana iframe wrapper with poster fallback." },
  { name: "TuxVizGrid", to: "/visualizations/grid", icon: "lucide:grid-2x2", family: "visualizations", kind: "component", wraps: "tux native (CSS Grid layout shell)", vizCategory: "embeds",
    blurb: "Small-multiples layout primitive — 2/3/4-up panes with shared editorial header. Container-queried." },
  { name: "TuxVizRPlot", to: "/visualizations/rplot", icon: "lucide:square-sigma", family: "visualizations", kind: "component", wraps: "<img> / <object> / <iframe>", vizCategory: "embeds",
    blurb: "R artifact wrapper — image / svg / htmlwidget — with source-line caption gutter." },
  { name: "useTuxPlatform", to: "/components/app-frame", icon: "lucide:monitor-smartphone", family: "components", kind: "composable", wraps: "composable", category: "navigation",
    blurb: "Host-OS + Tauri detection for platform-adaptive chrome." },
  { name: "useTuxRipple", to: "/components/ripple", icon: "lucide:circle-dot", family: "components", kind: "composable", wraps: "composable", category: "actions",
    blurb: "Composable: Material-style tap-feedback ripple on a target element. Opt-in only; honors prefers-reduced-motion." },
  { name: "useTuxSwipe", to: "/components/swipe", icon: "lucide:move-horizontal", family: "components", kind: "composable", wraps: "composable", category: "actions",
    blurb: "Composable: pointer/touch swipe detection with directional callbacks. Requires a11y-pair button per platform-awareness doctrine." },];

/** Count of catalogued components (composables excluded) — homepage + README figure. */
export const tuxComponentCount = tuxCatalog.filter((e) => e.kind === "component").length;

export interface TuxCategoryMeta {
  id: TuxComponentCategory;
  label: string;
  sectionCode: string;
  icon: string;
  blurb: string;
}

export const TUX_COMPONENT_CATEGORIES: TuxCategoryMeta[] = [
  { id: "actions", label: "Actions & Commands", sectionCode: "03a", icon: "lucide:mouse-pointer-click", blurb: "Buttons, toolbars, command palettes, and interactive triggers." },
  { id: "navigation", label: "Navigation & Layout", sectionCode: "03b", icon: "lucide:navigation", blurb: "Sidebars, breadcrumbs, steppers, tabs, and layout shells." },
  { id: "data-display", label: "Data Display & Tables", sectionCode: "03c", icon: "lucide:table", blurb: "Tables, grids, cards, stats, and timelines." },
  { id: "feedback", label: "Feedback & Alerts", sectionCode: "03d", icon: "lucide:bell", blurb: "Badges, alerts, banners, toasts, and dialogs." },
  { id: "forms", label: "Forms & Controls", sectionCode: "03e", icon: "lucide:text-cursor-input", blurb: "Form fields, search, editors, filters, and query builders." },
  { id: "ai", label: "AI & Conversational", sectionCode: "03f", icon: "lucide:bot", blurb: "Chat messages, composers, artifacts, and context meters." },
  { id: "publishing", label: "Research & Publishing", sectionCode: "03g", icon: "lucide:book-open", blurb: "Citations, bylines, abstracts, prose, and academic blocks." },
];

export function catalogByCategory(category: TuxComponentCategory) {
  return tuxCatalog
    .filter((e) => e.family === "components" && e.category === category)
    .map((e) => ({ label: e.name, to: e.to, icon: e.icon, wraps: e.wraps, blurb: e.blurb }));
}

export interface TuxVizCategoryMeta {
  id: TuxVizCategory;
  label: string;
  sectionCode: string;
  icon: string;
  blurb: string;
}

export const TUX_VIZ_CATEGORIES: TuxVizCategoryMeta[] = [
  { id: "timeseries", label: "Timeseries & Trends", sectionCode: "06a", icon: "lucide:trending-up", blurb: "Lines, areas, bars, gauges, sparklines, and editorial frames for temporal and directional series." },
  { id: "geospatial", label: "Geospatial & Maps", sectionCode: "06b", icon: "lucide:map", blurb: "Texas counties, TxDOT districts, OD flows, and neighborhood insets." },
  { id: "statistical", label: "Statistical & Distributions", sectionCode: "06c", icon: "lucide:scatter-chart", blurb: "Scatter, histograms, heatmaps, sunbursts, and donuts for statistical distributions." },
  { id: "embeds", label: "BI & Analytics Embeds", sectionCode: "06d", icon: "lucide:layout-grid", blurb: "Sandboxed frames for Tableau, Power BI, Superset, Grafana, and R artifacts." },
];

export function catalogByVizCategory(vizCategory: TuxVizCategory) {
  return tuxCatalog
    .filter((e) => e.family === "visualizations" && e.vizCategory === vizCategory)
    .map((e) => ({ label: e.name, to: e.to, icon: e.icon, wraps: e.wraps, blurb: e.blurb }));
}

export interface TuxSpectrumDivision {
  id: "maroon" | "blue" | "teal" | "green" | "gold";
  name: string;
  token: string;
  hex: string;
  focus: string;
}

export const TUX_SPECTRUM_DIVISIONS: TuxSpectrumDivision[] = [
  {
    id: "maroon",
    name: "Administration, Infrastructure & Materials",
    token: "--spectrum-maroon",
    hex: "#500000",
    focus: "Pavements, structural mechanics, roadside safety testing, materials science",
  },
  {
    id: "blue",
    name: "Connected & Automated Vehicles",
    token: "--spectrum-blue",
    hex: "#005480",
    focus: "V2X telemetry, automated shuttles, sensor networks, systems analytics",
  },
  {
    id: "teal",
    name: "Safety, Crash Analysis & Environment",
    token: "--spectrum-teal",
    hex: "#006F79",
    focus: "Crash records analysis, vulnerable road user safety, emissions, human factors",
  },
  {
    id: "green",
    name: "Freight, Transit, Policy & Economics",
    token: "--spectrum-green",
    hex: "#285C4D",
    focus: "Supply chain logistics, multimodal rail, transit operations, public policy",
  },
  {
    id: "gold",
    name: "Innovation, AI & Advanced Technologies",
    token: "--spectrum-gold",
    hex: "#CFA935",
    focus: "AI foundation models, edge inferencing, computer vision, digital twins",
  },
];


