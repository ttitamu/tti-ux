<script setup lang="ts">
// Style-guide shell: minimal header (logo + theme toggle) and a grouped
// sidebar that does all the navigation. Main content fills the rest.

const colorMode = useColorMode();

// Header toggle: light ↔ dark only. High-contrast is an accessibility option,
// not an aesthetic preference — it lives in the footer so users don't get
// pushed through it during casual theme switching (see ADR-0006). The icon
// shows the state a click will produce, mirroring OS-level toggles.
const isDark = computed(() => colorMode.preference === "tti-dark");
const isHighContrast = computed(() => colorMode.preference === "tti-hc");

const themeToggleIcon = computed(() =>
  isDark.value ? "lucide:sun" : "lucide:moon"
);

const themeToggleLabel = computed(() =>
  isDark.value ? "Switch to light theme" : "Switch to dark theme"
);

function toggleTheme() {
  // From HC, clicking the light/dark toggle exits HC into whichever non-HC
  // theme makes sense. Default to tti (light) — users on HC who want dark
  // can click again.
  colorMode.preference = isDark.value ? "tti" : "tti-dark";
}

function toggleHighContrast() {
  colorMode.preference = isHighContrast.value ? "tti" : "tti-hc";
}

// Sidebar nav — grouped by role so newcomers orient by "what are you looking
// for?" rather than alphabetical. Icons are Lucide; mostly mnemonic.
//
// Shape is the `TuxDocsSidebar` tree: top-level entries are collapsible
// section parents (no `to`, no `icon` — uppercase eyebrow alone reads as
// the group header, matching the AggieUX reference-kit pattern). Leaves
// keep their Lucide glyphs.
const navTree = [
  {
    label: "Welcome",
    children: [
      { label: "Home",      to: "/",          icon: "lucide:home" },
      { label: "Changelog", to: "/changelog", icon: "lucide:scroll-text" },
    ],
  },
  {
    label: "Design",
    children: [
      { label: "Doctrine",   to: "/design/tux",        icon: "lucide:book-open" },
      { label: "Components", to: "/design/components", icon: "lucide:layers" },
      { label: "Palette",    to: "/design/palette",    icon: "lucide:swatch-book" },
      { label: "Roadmap",    to: "/design/roadmap",    icon: "lucide:map" },
    ],
  },
  {
    label: "Foundations",
    children: [
      { label: "Tokens",         to: "/tokens",         icon: "lucide:palette" },
      { label: "Typography",     to: "/typography",     icon: "lucide:type" },
      { label: "Style variants", to: "/style-variants", icon: "lucide:layout-template" },
      { label: "Motion",         to: "/motion",         icon: "lucide:zap" },
      { label: "Icons",          to: "/icons",          icon: "lucide:sparkles" },
    ],
  },
  {
    label: "Components",
    children: [
      { label: "TuxAlert",         to: "/components/alert",          icon: "lucide:message-square" },
      { label: "TuxAnnouncementBanner", to: "/components/announcement-banner", icon: "lucide:megaphone" },
      { label: "TuxBadge",         to: "/components/badge",          icon: "lucide:badge" },
      { label: "TuxAccordion",     to: "/components/accordion",      icon: "lucide:chevrons-up-down" },
      { label: "TuxAlphaNav",      to: "/components/alpha-nav",      icon: "lucide:case-sensitive" },
      { label: "TuxBetaRibbon",    to: "/components/beta-ribbon",    icon: "lucide:flag-triangle-right" },
      { label: "TuxBigStat",       to: "/components/big-stat",       icon: "lucide:trending-up" },
      { label: "TuxBlockquote",    to: "/components/blockquote",     icon: "lucide:quote" },
      { label: "TuxBreadcrumbs",   to: "/components/breadcrumbs",    icon: "lucide:chevrons-right" },
      { label: "TuxButton",        to: "/components/button",         icon: "lucide:rectangle-horizontal" },
      { label: "TuxCallout",       to: "/components/callout",        icon: "lucide:flag-triangle-right" },
      { label: "TuxCaptionedMedia", to: "/components/captioned-media", icon: "lucide:image" },
      { label: "TuxCard",          to: "/components/card",           icon: "lucide:square-stack" },
      { label: "TuxCardSlab",      to: "/components/card-slab",      icon: "lucide:rows-3" },
      { label: "TuxChatMessage",   to: "/components/chat-message",   icon: "lucide:message-square-text" },
      { label: "TuxCitations",     to: "/components/citations",      icon: "lucide:quote" },
      { label: "TuxCodeBlock",     to: "/components/code-block",     icon: "lucide:code" },
      { label: "TuxCodeMaroon",    to: "/components/code-maroon",    icon: "lucide:siren" },
      { label: "TuxCommandPalette", to: "/components/command-palette", icon: "lucide:command" },
      { label: "TuxContactCard",   to: "/components/contact-card",   icon: "lucide:user-circle" },
      { label: "TuxContextPanel",  to: "/components/context-panel",  icon: "lucide:panel-right" },
      { label: "TuxConversationList", to: "/components/conversation-list", icon: "lucide:message-square" },
      { label: "TuxCookieConsent", to: "/components/cookie-consent", icon: "lucide:cookie" },
      { label: "TuxComposer",      to: "/components/composer",       icon: "lucide:pencil-line" },
      { label: "TuxCTA",           to: "/components/cta",            icon: "lucide:megaphone" },
      { label: "TuxDataTable",     to: "/components/data-table",     icon: "lucide:table-2" },
      { label: "TuxDescriptionList", to: "/components/description-list", icon: "lucide:list" },
      { label: "TuxDiagram",       to: "/components/diagram",        icon: "lucide:workflow" },
      { label: "TuxDocsSidebar",   to: "/components/docs-sidebar",   icon: "lucide:panel-left" },
      { label: "TuxEmptyState",    to: "/components/empty-state",    icon: "lucide:inbox" },
      { label: "TuxErrorPage",     to: "/components/error-page",     icon: "lucide:circle-alert" },
      { label: "TuxFactoid",       to: "/components/factoid",        icon: "lucide:hash" },
      { label: "TuxFilterPanel",   to: "/components/filter-panel",   icon: "lucide:list-filter" },
      { label: "TuxFooter",        to: "/components/footer",         icon: "lucide:panel-bottom" },
      { label: "TuxIconFeature",   to: "/components/icon-feature",   icon: "lucide:layout-grid" },
      { label: "TuxIdentity",      to: "/components/identity",       icon: "lucide:flag" },
      { label: "TuxKbd",           to: "/components/kbd",            icon: "lucide:keyboard" },
      { label: "TuxLinkList",      to: "/components/link-list",      icon: "lucide:list-tree" },
      { label: "TuxLinkSlab",      to: "/components/link-slab",      icon: "lucide:menu" },
      { label: "TuxMediaSlab",     to: "/components/media-slab",     icon: "lucide:image-plus" },
      { label: "TuxModal",         to: "/components/modal",          icon: "lucide:panel-top-open" },
      { label: "TuxNewsCollection", to: "/components/news-collection", icon: "lucide:newspaper" },
      { label: "TuxPagination",    to: "/components/pagination",     icon: "lucide:list-ordered" },
      { label: "TuxPageHeader",    to: "/components/page-header",    icon: "lucide:pilcrow" },
      { label: "TuxPhotoGrid",     to: "/components/photo-grid",     icon: "lucide:images" },
      { label: "TuxProse",         to: "/components/prose",          icon: "lucide:text" },
      { label: "TuxQACollection",  to: "/components/qa-collection",  icon: "lucide:message-circle-question" },
      { label: "TuxRichDataGrid",  to: "/components/rich-data-grid", icon: "lucide:layout-grid" },
      { label: "TuxSearch",        to: "/components/search",         icon: "lucide:search" },
      { label: "TuxSectionHeader", to: "/components/section-header", icon: "lucide:heading" },
      { label: "TuxSidebarBlock",  to: "/components/sidebar-block",  icon: "lucide:panel-right" },
      { label: "TuxSignupFeature", to: "/components/signup-feature", icon: "lucide:mail-plus" },
      { label: "TuxSiteNav",       to: "/components/site-nav",       icon: "lucide:menu-square" },
      { label: "TuxSkeleton",      to: "/components/skeleton",       icon: "lucide:loader" },
      { label: "TuxSlideover",     to: "/components/slideover",      icon: "lucide:panel-right" },
      { label: "TuxStepper",       to: "/components/stepper",        icon: "lucide:list-checks" },
      { label: "TuxTable",         to: "/components/table",          icon: "lucide:table" },
      { label: "TuxTestimonial",   to: "/components/testimonial",    icon: "lucide:message-circle-heart" },
      { label: "TuxTOC",           to: "/components/toc",            icon: "lucide:list-ordered" },
      { label: "TuxTree",          to: "/components/tree",           icon: "lucide:list-tree" },
      { label: "TuxTreemap",       to: "/components/treemap",        icon: "lucide:layout-dashboard" },
    ],
  },
  {
    label: "Composition",
    children: [
      { label: "Examples", to: "/examples", icon: "lucide:layout-panel-left" },
      { label: "Markdown", to: "/markdown", icon: "lucide:file-text" },
      { label: "Patterns", to: "/patterns", icon: "lucide:layers-2" },
      { label: "Preview",  to: "/preview",  icon: "lucide:image" },
      { label: "Kits",     to: "/kits",     icon: "lucide:library" },
    ],
  },
  {
    label: "Forms",
    children: [
      { label: "Forms overview",     to: "/forms",                    icon: "lucide:clipboard-list" },
      { label: "Text field",         to: "/forms/text-field",         icon: "lucide:type" },
      { label: "Select",             to: "/forms/select",             icon: "lucide:list" },
      { label: "Choice",             to: "/forms/choice",             icon: "lucide:check-square" },
      { label: "Date picker",        to: "/forms/date-picker",        icon: "lucide:calendar" },
      { label: "File upload",        to: "/forms/file-upload",        icon: "lucide:upload" },
      { label: "Inline validation",  to: "/forms/inline-validation",  icon: "lucide:check-circle-2" },
      { label: "All-in-one demo",    to: "/forms/all-in-one",         icon: "lucide:layout-panel-left" },
    ],
  },
  {
    label: "Reports",
    children: [
      { label: "Reports overview",     to: "/reports",             icon: "lucide:file-output" },
      { label: "TuxReportFrame",       to: "/reports/frame",       icon: "lucide:file-text" },
      { label: "TuxReportPrintSheet",  to: "/reports/print-sheet", icon: "lucide:printer" },
      { label: "TuxReportWebFrame",    to: "/reports/web-frame",   icon: "lucide:globe" },
    ],
  },
  {
    label: "Visualizations",
    children: [
      { label: "Visualizations overview", to: "/visualizations",                  icon: "lucide:chart-pie" },
      { label: "TuxChartGeographic",      to: "/visualizations/chart-geographic", icon: "lucide:map" },
      { label: "TuxChartSunburst",        to: "/visualizations/chart-sunburst",   icon: "lucide:circle-dot" },
      { label: "TuxVizEmbed",             to: "/visualizations/embed",            icon: "lucide:bar-chart-3" },
      { label: "TuxVizRPlot",             to: "/visualizations/rplot",            icon: "lucide:square-sigma" },
      { label: "TuxVizGrid",              to: "/visualizations/grid",             icon: "lucide:grid-2x2" },
      { label: "TuxSparkline",            to: "/visualizations/sparkline",        icon: "lucide:trending-up" },
    ],
  },
  {
    label: "Tooling",
    children: [
      { label: "Accessibility",  to: "/accessibility",  icon: "lucide:accessibility" },
      { label: "Contrast audit", to: "/contrast-audit", icon: "lucide:contrast" },
    ],
  },
];

// Mobile sidebar toggle — below md, sidebar slides in from the left.
const sidebarOpen = ref(false);
const route = useRoute();
const router = useRouter();
watch(() => route.fullPath, () => {
  sidebarOpen.value = false;
});

// Global command palette + shortcuts-help overlay. Mounted once at the
// shell so any page benefits from ⌘K and ?. The palette's groups derive
// from `navTree` so a single source of truth drives sidebar nav and
// fuzzy-search jump.
const paletteRef = ref<{ open: () => void; close: () => void } | null>(null);
const shortcutsHelpRef = ref<{ open: () => void; close: () => void; toggle: () => void } | null>(null);

const paletteGroups = computed(() =>
  navTree.map(section => ({
    heading: section.label,
    items: (section.children ?? [])
      .filter(c => !!c.to)
      .map(c => ({
        id: `${section.label}-${c.label}`.toLowerCase().replace(/\s+/g, "-"),
        label: c.label,
        icon: c.icon,
        to: c.to,
      })),
  })),
);

// Help-overlay groups document every shortcut wired below. Keep this
// in sync with the `defineShortcuts` block — if you add a binding,
// add a row here so users can discover it via ?.
const shortcutGroups = [
  {
    heading: "Navigation",
    items: [
      { keys: ["meta", "k"], label: "Open command palette", description: "Fuzzy-search and jump anywhere" },
      { keys: ["/"], label: "Open command palette", description: "GitHub-style alias for ⌘K" },
      { keys: ["?"], label: "Show this shortcuts overlay" },
    ],
  },
  {
    heading: "Jump to",
    items: [
      { keys: ["g", "c"], label: "Components catalog", description: "Goes to /components" },
      { keys: ["g", "t"], label: "Tokens", description: "Goes to /tokens" },
      { keys: ["g", "d"], label: "Doctrine", description: "Goes to /design/tux" },
      { keys: ["g", "h"], label: "Home", description: "Goes to /" },
    ],
  },
  {
    heading: "Inside the command palette",
    items: [
      { keys: ["arrowup"], label: "Previous result" },
      { keys: ["arrowdown"], label: "Next result" },
      { keys: ["enter"], label: "Run selected" },
      { keys: ["escape"], label: "Close" },
    ],
  },
];

// Use Nuxt UI's defineShortcuts at the shell so every binding gets
// platform-correct meta/ctrl handling and respects "usingInput" (we
// don't want the route-jump sequences firing while someone's typing
// in TuxSearch's filter).
defineShortcuts({
  "/": {
    handler: () => paletteRef.value?.open(),
  },
  "?": {
    handler: () => shortcutsHelpRef.value?.toggle(),
  },
  // Hyphen, not underscore: defineShortcuts uses `_` for combos (modifier
  // held with key, e.g. meta_k) and `-` for sequences (press g, then t —
  // GitHub idiom). Sequences time out after 800ms by default.
  "g-c": () => router.push("/components"),
  "g-t": () => router.push("/tokens"),
  "g-d": () => router.push("/design/tux"),
  "g-h": () => router.push("/"),
});

// Version surfaced in the header pill + welcome page. Sourced from
// package.json so a `npm version` bump propagates without code edits.
import pkg from "../package.json";
const pkgVersion = pkg.version;

// Marketing-footer config — mirrors the comm-team's Kadence footer
// for tti.tamu.edu so consumers (PECAN, ai-studio, marcom pages,
// this style guide) inherit the production handles and link
// inventory verbatim. Threads ships as inline SVG since Lucide
// doesn't carry the brand mark yet — see TuxFooter's `svg` field.
const footerSocial = [
  { icon: "lucide:linkedin",  label: "LinkedIn",  href: "https://www.linkedin.com/company/texasa-mtransportationinstitute" },
  { icon: "lucide:facebook",  label: "Facebook",  href: "https://www.facebook.com/ttitamu" },
  { icon: "lucide:instagram", label: "Instagram", href: "https://www.instagram.com/ttitamu/" },
  { icon: "lucide:youtube",   label: "YouTube",   href: "https://www.youtube.com/ttitamu" },
  {
    label: "Threads",
    href: "https://www.threads.com/@ttitamu",
    // Simple Icons "threads" path — CC0. Inline because Lucide
    // lacks a Threads glyph.
    svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true"><path fill="currentColor" d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.598.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291 1.062-.06 2.046.04 2.916.282-.115-.651-.34-1.176-.679-1.567-.485-.561-1.235-.847-2.228-.853h-.028c-.798 0-1.881.221-2.572 1.247l-1.737-1.166c.925-1.373 2.428-2.13 4.32-2.13h.043c3.176.02 5.072 1.97 5.263 5.36q.18.077.347.158c2.318 1.09 3.609 2.96 3.633 5.27.024 2.7-1.27 4.85-3.836 6.55-1.945 1.21-4.46 1.79-7.18 1.79zm1.359-9.93q-.41 0-.823.025c-1.265.073-2.058.692-2.005 1.586.06 1.022 1.151 1.499 2.179 1.491 1.061-.034 2.105-.405 2.205-2.602q-.769-.235-1.556-.5z"/></svg>',
  },
  { icon: "lucide:twitter",   label: "X (Twitter)", href: "https://twitter.com/TTITAMU" },
];

// Two columns mirror the Kadence source: TTI-owned URLs for the
// Policies set; canonical state URLs for State Resources. The only
// non-Kadence extra is the internal WCAG audit page — it's
// style-guide-specific (production tti.tamu.edu doesn't expose an
// accessibility audit), but valuable surfacing it here for
// designers/auditors landing on the system docs.
const footerColumns = [
  {
    heading: "State Resources",
    links: [
      { label: "The State of Texas",          href: "https://www.texas.gov/" },
      { label: "Texas Homeland Security",     href: "https://gov.texas.gov/" },
      { label: "Texas Veterans Portal",       href: "https://veterans.portal.texas.gov/" },
      { label: "State Expenditure Database",  href: "https://comptroller.texas.gov/transparency/" },
      { label: "Statewide Search",            href: "https://www.tsl.texas.gov/trail/index.html" },
      { label: "State Auditor's Office Hotline", href: "https://sao.fraud.texas.gov/" },
    ],
  },
  {
    heading: "Policies",
    links: [
      { label: "TAMUS Risk, Fraud & Misconduct Hotline", href: "https://secure.ethicspoint.com/domain/media/en/gui/19681/index.html" },
      { label: "Digital Accessibility",       href: "https://tti.tamu.edu/notices-policies/accessibility-policy/" },
      { label: "Site Policies",               href: "https://tti.tamu.edu/notices-policies/" },
      { label: "Open Records Policy",         href: "https://tti.tamu.edu/notices-policies/open-records-policy/" },
      { label: "Statutorily Required Reports", href: "https://tti.tamu.edu/notices-policies/statereq-reports/" },
      { label: "TTI Rules",                   href: "https://tti.tamu.edu/notices-policies/rules/" },
      { label: "Veterans",                    href: "https://tti.tamu.edu/notices-policies/veterans/" },
      { label: "Equal Opportunity",           href: "https://tti.tamu.edu/jobs/commitment-to-equal-opportunity/" },
      { label: "Jobs",                        href: "https://tti.tamu.edu/jobs/" },
      { label: "Accessibility (WCAG 2.2 AA · AAA contrast)", to: "/accessibility" },
    ],
  },
];

// Copyright line formatted to match the Kadence footer ("© Copyright
// {year} … (TTI)") and linked to the institutional copyright-
// statement page.
const copyrightLine = `© Copyright ${new Date().getFullYear()} Texas A&M Transportation Institute (TTI)`;
</script>

<template>
  <UApp>
    <!-- Global command palette + keyboard-shortcut overlay. Mounted once;
         the shell-level defineShortcuts block above drives both. -->
    <ClientOnly>
      <TuxCommandPalette
        ref="paletteRef"
        :groups="paletteGroups"
      />
      <TuxShortcutsHelp
        ref="shortcutsHelpRef"
        :groups="shortcutGroups"
      />
    </ClientOnly>

    <div class="min-h-screen flex flex-col bg-surface-page text-text-primary">
      <header
        class="tti-shell-header bg-surface-raised sticky top-0 z-30"
        role="banner"
      >
        <div class="px-4 sm:px-6 py-3 flex items-center gap-4">
          <UButton
            icon="lucide:menu"
            color="neutral"
            variant="ghost"
            size="sm"
            class="md:hidden"
            aria-label="Open navigation"
            @click="sidebarOpen = !sidebarOpen"
          />

          <!-- Dogfood: the style guide uses its own TuxIdentity for the
               header lockup. `level="center"` puts the institutional
               line above the product name, the same rhythm consuming
               apps will use. `logoSize` is shrunk a hair (32px) so the
               header keeps the same vertical density it had before. -->
          <div class="flex items-center gap-3">
            <TuxIdentity
              level="center"
              superhead="Texas A&M Transportation Institute"
              name="tti-ux"
              href="/"
              :logo-size="32"
            />
            <!-- Version pill — kept local to the style guide chrome. If
                 a second product ever wants this affordance, promote
                 it to a TuxIdentity prop. Until then: don't bolt the
                 abstraction on speculatively. -->
            <span
              class="tux-version-pill"
              :title="`tti-ux ${pkgVersion} \u2014 see /changelog for release notes`"
            >v{{ pkgVersion }}</span>
          </div>

          <div class="flex-1" />

          <ClientOnly>
            <UButton
              :icon="themeToggleIcon"
              color="neutral"
              variant="ghost"
              size="sm"
              :aria-label="themeToggleLabel"
              @click="toggleTheme"
            />
            <template #fallback>
              <div class="w-8 h-8" />
            </template>
          </ClientOnly>
        </div>
      </header>

      <div class="flex flex-1 min-h-0">
        <!-- Sidebar backdrop (mobile only) -->
        <div
          v-if="sidebarOpen"
          class="fixed inset-0 z-10 bg-black/40 md:hidden"
          aria-hidden="true"
          @click="sidebarOpen = false"
        />

        <!-- Sidebar — fixed-positioned on mobile (slides in from left
             with the menu toggle), static-positioned on desktop. We use
             `md:transform-none` (rather than `md:translate-x-0`) so the
             desktop sidebar doesn't carry a `transform` declaration —
             a transformed static element creates a stacking context that
             paints over the sticky header (z-index doesn't apply to
             static elements, so the header's z-30 wouldn't help).
             The chrome (border, surface, slide-in) is provided here; the
             inner `<TuxDocsSidebar>` carries the navigation landmark,
             collapsible groups, active-trail highlighting, filter, and
             sessionStorage-persisted collapse state. The outer is a
             plain <div> to avoid a duplicate "navigation" landmark. -->
        <!-- Sticky on desktop so the sidebar stays pinned to the
             viewport as the page scrolls — otherwise the flex row's
             stretch makes the sidebar as tall as the main content,
             and you scroll past it (and the tapered hairline rides
             down into the footer). `md:self-start` opts this child
             out of the flex parent's default stretch so sticky can
             actually take effect, and `md:max-h-[calc(100vh-57px)]`
             caps the sidebar at the viewport minus the 57px sticky
             header. `overflow-x-hidden` on the inner scroll wrapper
             clips any horizontal overflow from long item labels
             (the leaf links also truncate with ellipsis, but this is
             a belt-and-braces guard so a runaway label can never
             trigger a horizontal scrollbar). -->
        <div
          :class="[
            'tti-shell-sidebar bg-surface-raised flex-shrink-0 w-60 overflow-y-auto overflow-x-hidden',
            'md:sticky md:top-[57px] md:self-start md:max-h-[calc(100vh-57px)]',
            'md:translate-x-0 md:transform-none',
            'fixed inset-y-0 left-0 top-[57px] z-20 transition-transform duration-200',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          ]"
        >
          <div class="p-4">
            <TuxDocsSidebar
              :tree="navTree"
              title="Navigation"
              :search="true"
              search-placeholder="Filter the system…"
              storage-key="tti-ux-sidebar"
              :exclusive-top-level="true"
            />
          </div>
        </div>

        <main class="flex-1 min-w-0">
          <!-- max-w-6xl (72rem / 1152px) — wider than the previous
               5xl cap, but still leaves a right-side margin for the
               future TuxTOC rail. Bump again if the gap still reads
               as wasted space. -->
          <div class="max-w-6xl mx-auto px-6 md:px-10 py-8">
            <NuxtLayout>
              <NuxtPage />
            </NuxtLayout>
          </div>
        </main>
      </div>

      <!-- Dogfood: real TuxFooter + mandatory TAMUS subfooter. The
           high-contrast toggle is an opt-in accessibility control, not
           a chrome theme — it lives in the footer's #extra slot so
           users don't get pushed through it during casual theme
           switching (see ADR-0006). -->
      <!-- Unified institutional footer — maroon marketing top + black
           legal strip in one component. Same shape across PECAN,
           tti-ai-studio, marcom pages, and the style guide itself.
           HC toggle slots into #preferences (accessibility-as-
           compliance per ADR-0006). -->
      <TuxFooter
        :columns="footerColumns"
        :social="footerSocial"
        tagline=""
        :copyright-text="copyrightLine"
        copyright-href="https://tti.tamu.edu/notices-policies/copyright-statement/"
      >
        <template #preferences>
          <ClientOnly>
            <button
              type="button"
              :aria-pressed="isHighContrast"
              :title="
                isHighContrast
                  ? 'High-contrast mode is on — click to exit'
                  : 'Enable WCAG AAA high-contrast mode (accessibility)'
              "
              @click="toggleHighContrast"
            >
              <UIcon name="lucide:accessibility" class="w-3.5 h-3.5" />
              <span>
                {{ isHighContrast ? "Exit high-contrast" : "High-contrast mode" }}
              </span>
            </button>
            <template #fallback>
              <span class="inline-flex items-center gap-1">
                <UIcon name="lucide:accessibility" class="w-3.5 h-3.5" />
                <span>High-contrast mode</span>
              </span>
            </template>
          </ClientOnly>
        </template>
      </TuxFooter>
    </div>
  </UApp>
</template>

<style scoped>
/* Tapered hairlines — mirrors the pattern shipped in tti-ai-studio
   (studio-shell): a 1px line drawn via a pseudo-element with a
   linear-gradient background that fades to transparent at both ends
   and holds the border color through the middle. Reads as a soft
   ruled line rather than a hard corner-to-corner stroke, giving the
   shell a more modern, sleek feel. The 18%/82% stops match the
   ai-studio values for cross-product consistency. */
.tti-shell-header {
  position: sticky;
}

.tti-shell-header::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent 0%,
    var(--surface-border) 18%,
    var(--surface-border) 82%,
    transparent 100%
  );
  pointer-events: none;
}

.tti-shell-sidebar::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--surface-border) 18%,
    var(--surface-border) 82%,
    transparent 100%
  );
  pointer-events: none;
}

/* Version chip next to the header lockup. Monospace + brand maroon
   to read as "this is a system token, not editorial copy". The
   weight is heavier than the address copy so it pops against the
   wordmark without competing with the lockup itself. */
.tux-version-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.4375rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--brand-primary) 22%, transparent);
  border-radius: var(--radius-sm);
  letter-spacing: 0.01em;
  white-space: nowrap;
}

[data-theme="tti-dark"] .tux-version-pill {
  color: var(--brand-accent);
  background: color-mix(in srgb, var(--brand-accent) 12%, transparent);
  border-color: color-mix(in srgb, var(--brand-accent) 28%, transparent);
}
</style>
