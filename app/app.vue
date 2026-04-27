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
const nav = [
  {
    group: "Welcome",
    items: [
      { label: "Home",      to: "/",          icon: "lucide:home" },
      { label: "Changelog", to: "/changelog", icon: "lucide:scroll-text" },
    ],
  },
  {
    group: "Foundations",
    items: [
      { label: "Tokens",         to: "/tokens",         icon: "lucide:palette" },
      { label: "Typography",     to: "/typography",     icon: "lucide:type" },
      { label: "Style variants", to: "/style-variants", icon: "lucide:layout-template" },
      { label: "Motion",         to: "/motion",         icon: "lucide:zap" },
      { label: "Icons",          to: "/icons",          icon: "lucide:sparkles" },
    ],
  },
  {
    group: "Components",
    items: [
      { label: "TuxAlert",         to: "/components/alert",          icon: "lucide:message-square" },
      { label: "TuxBadge",         to: "/components/badge",          icon: "lucide:badge" },
      { label: "TuxAccordion",     to: "/components/accordion",      icon: "lucide:chevrons-up-down" },
      { label: "TuxAlphaNav",      to: "/components/alpha-nav",      icon: "lucide:case-sensitive" },
      { label: "TuxBigStat",       to: "/components/big-stat",       icon: "lucide:trending-up" },
      { label: "TuxBlockquote",    to: "/components/blockquote",     icon: "lucide:quote" },
      { label: "TuxBreadcrumbs",   to: "/components/breadcrumbs",    icon: "lucide:chevrons-right" },
      { label: "TuxButton",        to: "/components/button",         icon: "lucide:rectangle-horizontal" },
      { label: "TuxCallout",       to: "/components/callout",        icon: "lucide:flag-triangle-right" },
      { label: "TuxCaptionedMedia", to: "/components/captioned-media", icon: "lucide:image" },
      { label: "TuxCard",          to: "/components/card",           icon: "lucide:square-stack" },
      { label: "TuxCardSlab",      to: "/components/card-slab",      icon: "lucide:rows-3" },
      { label: "TuxCodeBlock",     to: "/components/code-block",     icon: "lucide:code" },
      { label: "TuxCodeMaroon",    to: "/components/code-maroon",    icon: "lucide:siren" },
      { label: "TuxCommandPalette", to: "/components/command-palette", icon: "lucide:command" },
      { label: "TuxContactCard",   to: "/components/contact-card",   icon: "lucide:user-circle" },
      { label: "TuxCTA",           to: "/components/cta",            icon: "lucide:megaphone" },
      { label: "TuxDescriptionList", to: "/components/description-list", icon: "lucide:list" },
      { label: "TuxDiagram",       to: "/components/diagram",        icon: "lucide:workflow" },
      { label: "TuxDocsSidebar",   to: "/components/docs-sidebar",   icon: "lucide:panel-left" },
      { label: "TuxDropdown",      to: "/components/site-nav",       icon: "lucide:chevron-down" },
      { label: "TuxEmptyState",    to: "/components/empty-state",    icon: "lucide:inbox" },
      { label: "TuxFactoid",       to: "/components/factoid",        icon: "lucide:hash" },
      { label: "TuxFilterPanel",   to: "/components/filter-panel",   icon: "lucide:list-filter" },
      { label: "TuxFooter",        to: "/components/footer",         icon: "lucide:panel-bottom" },
      { label: "TuxIconFeature",   to: "/components/icon-feature",   icon: "lucide:layout-grid" },
      { label: "TuxIdentity",      to: "/components/identity",       icon: "lucide:flag" },
      { label: "TuxLinkList",      to: "/components/link-list",      icon: "lucide:list-tree" },
      { label: "TuxLinkSlab",      to: "/components/link-slab",      icon: "lucide:menu" },
      { label: "TuxMediaSlab",     to: "/components/media-slab",     icon: "lucide:image-plus" },
      { label: "TuxMegaMenu",      to: "/components/site-nav",       icon: "lucide:layout-panel-top" },
      { label: "TuxModal",         to: "/components/modal",          icon: "lucide:panel-top-open" },
      { label: "TuxNewsCollection", to: "/components/news-collection", icon: "lucide:newspaper" },
      { label: "TuxPagination",    to: "/components/pagination",     icon: "lucide:list-ordered" },
      { label: "TuxPageHeader",    to: "/components/page-header",    icon: "lucide:pilcrow" },
      { label: "TuxPhotoGrid",     to: "/components/photo-grid",     icon: "lucide:images" },
      { label: "TuxQACollection",  to: "/components/qa-collection",  icon: "lucide:message-circle-question" },
      { label: "TuxSearch",        to: "/components/search",         icon: "lucide:search" },
      { label: "TuxSectionHeader", to: "/components/section-header", icon: "lucide:heading" },
      { label: "TuxSidebarBlock",  to: "/components/sidebar-block",  icon: "lucide:panel-right" },
      { label: "TuxSignupFeature", to: "/components/signup-feature", icon: "lucide:mail-plus" },
      { label: "TuxSiteNav",       to: "/components/site-nav",       icon: "lucide:menu-square" },
      { label: "TuxTable",         to: "/components/table",          icon: "lucide:table" },
      { label: "TuxTestimonial",   to: "/components/testimonial",    icon: "lucide:message-circle-heart" },
      { label: "TuxTOC",           to: "/components/toc",            icon: "lucide:list-ordered" },
      { label: "TuxTreemap",       to: "/components/treemap",        icon: "lucide:layout-dashboard" },
    ],
  },
  {
    group: "Composition",
    items: [
      { label: "Design docs", to: "/design",   icon: "lucide:book-open" },
      { label: "Examples",    to: "/examples", icon: "lucide:layout-panel-left" },
      { label: "Markdown",    to: "/markdown", icon: "lucide:file-text" },
      { label: "Forms",       to: "/forms",    icon: "lucide:clipboard-list" },
      { label: "Patterns",    to: "/patterns", icon: "lucide:layers" },
      { label: "Preview",     to: "/preview",  icon: "lucide:image" },
      { label: "Kits",        to: "/kits",     icon: "lucide:library" },
    ],
  },
];

// Mobile sidebar toggle — below md, sidebar slides in from the left.
const sidebarOpen = ref(false);
const route = useRoute();
watch(() => route.fullPath, () => {
  sidebarOpen.value = false;
});

// Version surfaced in the header pill + welcome page. Sourced from
// package.json so a `npm version` bump propagates without code edits.
import pkg from "../package.json";
const pkgVersion = pkg.version;

// Marketing-footer config — modeled on tti.tamu.edu's footer
// inventory. Two columns of state-resource + policy links, plus a
// social-icon row beneath the address. Lucide ships the brand
// glyphs we need; Threads doesn't have a Lucide icon yet so we
// drop it (the production tti.tamu.edu has 6 socials; we ship 5).
const footerSocial = [
  { icon: "lucide:linkedin",  label: "LinkedIn",  href: "https://www.linkedin.com/company/texas-a-m-transportation-institute/" },
  { icon: "lucide:facebook",  label: "Facebook",  href: "https://www.facebook.com/TTITAMUS" },
  { icon: "lucide:instagram", label: "Instagram", href: "https://www.instagram.com/ttitamus/" },
  { icon: "lucide:youtube",   label: "YouTube",   href: "https://www.youtube.com/user/TTIVideoChannel" },
  { icon: "lucide:twitter",   label: "X (Twitter)", href: "https://x.com/TTITAMUS" },
];

const footerColumns = [
  {
    heading: "State Resources",
    links: [
      { label: "The State of Texas",          href: "https://www.texas.gov/" },
      { label: "Texas Homeland Security",     href: "https://gov.texas.gov/organization/hs" },
      { label: "Texas Veterans Portal",       href: "https://veterans.portal.texas.gov/" },
      { label: "State Expenditure Database",  href: "https://comptroller.texas.gov/transparency/" },
      { label: "Statewide Search",            href: "https://www.tsl.texas.gov/trail/" },
      { label: "State Auditor's Office Hotline", href: "https://sao.fraud.texas.gov/" },
    ],
  },
  {
    heading: "Policies",
    links: [
      { label: "TAMUS Risk, Fraud & Misconduct Hotline", href: "https://secure.ethicspoint.com/domain/media/en/gui/19681/index.html" },
      { label: "Digital Accessibility",       href: "https://gov.texas.gov/organization/disabilities/accessibility-policy" },
      { label: "Site Policies",               href: "https://www.tamus.edu/site-policies/" },
      { label: "Open Records Policy",         href: "https://www.tamus.edu/open-records/" },
      { label: "State Link Policy",           href: "https://statelinkpolicy.texas.gov/" },
      { label: "Statutorily Required Reports", href: "https://www.tamus.edu/legal/statutorily-required-reports/" },
      { label: "Repo on GitHub",              href: "https://github.com/anthonyguevara/tti-ux-test" },
    ],
  },
];
</script>

<template>
  <UApp>
    <div class="min-h-screen flex flex-col bg-surface-page text-text-primary">
      <header
        class="border-b border-surface-border bg-surface-raised sticky top-0 z-20"
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

        <aside
          :class="[
            'border-r border-surface-border bg-surface-raised flex-shrink-0 w-60',
            'md:static md:translate-x-0',
            'fixed inset-y-0 left-0 top-[57px] z-20 transition-transform duration-200',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          ]"
          role="navigation"
          aria-label="Main navigation"
        >
          <nav class="p-4 space-y-6 overflow-y-auto h-full">
            <div v-for="section in nav" :key="section.group">
              <h2
                class="text-xs font-semibold uppercase text-text-muted mb-2 px-2"
                style="letter-spacing: var(--tracking-wider)"
              >
                {{ section.group }}
              </h2>
              <ul class="space-y-0.5">
                <li v-for="item in section.items" :key="item.to">
                  <NuxtLink
                    :to="item.to"
                    class="flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm text-text-secondary hover:bg-surface-sunken hover:text-text-brand transition-colors"
                    active-class="bg-surface-sunken text-text-brand font-medium"
                  >
                    <UIcon :name="item.icon" class="w-4 h-4 opacity-70" />
                    <span>{{ item.label }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        <main class="flex-1 min-w-0">
          <div class="max-w-5xl mx-auto px-6 md:px-10 py-8">
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
