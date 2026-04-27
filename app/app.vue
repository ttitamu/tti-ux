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
          <TuxIdentity
            level="center"
            superhead="Texas A&M Transportation Institute"
            name="tti-ux"
            href="/"
            :logo-size="32"
          />

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
      <TuxFooter
        version="tti-ux · living style guide · Apache 2.0"
        name="Texas A&M Transportation Institute · Networking & Information Services"
        :links="[
          { label: 'Repo',       href: 'https://github.com/anthonyguevara/tti-ux-test' },
          { label: 'Components', to: '/components' },
          { label: 'Tokens',     to: '/tokens' },
        ]"
      >
        <template #extra>
          <ClientOnly>
            <button
              type="button"
              class="inline-flex items-center gap-1 hover:text-text-brand transition-colors"
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
      <TuxSubfooter />
    </div>
  </UApp>
</template>
