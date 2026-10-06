<script setup lang="ts">
/**
 * TuxPortalHeader — Two-Tier Institutional Header matching tti.tamu.edu & my.tti.tamu.edu.
 *
 * Tier 1: Maroon utility bar with official agency mark, quick links,
 *         and search trigger.
 * Tier 2: Crisp brand ribbon with TTI winged-A logo, sub-brand / portal title,
 *         multi-level primary navigation dropdowns, active underline indicator,
 *         Kadence-styled sharp CTA button, and responsive mobile slideover drawer.
 */

export interface PortalUtilityLink {
  label: string;
  href?: string;
  to?: string;
  icon?: string;
  external?: boolean;
}

export interface PortalNavChild {
  label: string;
  to?: string;
  href?: string;
  description?: string;
  badge?: string;
}

export interface PortalNavItem {
  label: string;
  to?: string;
  href?: string;
  children?: PortalNavChild[];
}

interface Props {
  /** Visual & functional mode: 'comm' (public maroon utility bar) or 'intranet' (charcoal bar with social icons + MY APPS launcher). */
  mode?: "comm" | "intranet";
  /** Agency name in Tier 1 utility bar. */
  agencyName?: string;
  /** Agency URL link in Tier 1 utility bar. */
  agencyUrl?: string;
  /** Root home URL when clicking logo. */
  homeUrl?: string;
  /** Sub-brand, research center, or portal title displayed adjacent to the logo. */
  portalTitle?: string;
  /** Optional badge pill next to portal title. */
  portalBadge?: string;
  /** Badge color variant. */
  portalBadgeVariant?: "neutral" | "maroon" | "gold" | "info" | "success";
  /** Tier 1 utility navigation links. */
  utilityLinks?: PortalUtilityLink[];
  /** Whether to render the Tier 1 search trigger button. */
  showSearch?: boolean;
  /** Whether to show the 5-band institutional spectrum ribbon beneath the header. Defaults to true in intranet mode. */
  showSpectrumRibbon?: boolean;
  /** Intranet app links shown in the MY APPS launcher menu (intranet mode). */
  intranetApps?: Array<{ label: string; href?: string; to?: string; icon?: string; description?: string }>;
  /** Primary navigation items in Tier 2. */
  navItems?: PortalNavItem[];
  /** Primary action CTA button label. */
  actionText?: string;
  /** Primary action CTA destination route. */
  actionTo?: string;
  /** Primary action CTA external URL. */
  actionHref?: string;
  /** Sticky-position the header at the top of the viewport. */
  sticky?: boolean;
  /** Max-width container mode: standard (80rem / 7xl), wide (96rem), or full. */
  maxWidth?: "standard" | "wide" | "full";
  /** Accessible label for the navigation landmark (default 'Portal Navigation'). */
  navAriaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  mode: "comm",
  agencyName: "Texas A&M Transportation Institute",
  agencyUrl: "https://tti.tamu.edu",
  homeUrl: "/",
  portalTitle: "",
  portalBadge: "",
  portalBadgeVariant: "gold",
  utilityLinks: () => [
    { label: "Jobs", href: "https://tti.tamu.edu/careers/" },
    { label: "Pressroom", href: "https://tti.tamu.edu/news/" },
    { label: "Directory", href: "https://tti.tamu.edu/people/" },
    { label: "Contact", href: "https://tti.tamu.edu/contact/" },
  ],
  showSearch: true,
  showSpectrumRibbon: undefined,
  intranetApps: () => [
    { label: "App Catalog", href: "https://my.tti.tamu.edu/app-catalog/", description: "Directory of all TTI web apps & internal services", icon: "lucide:layout-grid" },
    { label: "People Finder", href: "https://my.tti.tamu.edu/directory/", description: "Staff directory, phone numbers, and office locations", icon: "lucide:users" },
    { label: "Timecard (SSO)", href: "https://sso.tamus.edu/", description: "Employee Single Sign-On, Workday, and leave balances", icon: "lucide:clock" },
    { label: "Concur Travel", href: "https://sso.tamus.edu/", description: "Travel authorization, booking, and expense reports", icon: "lucide:plane" },
    { label: "Facilities & Safety", href: "https://my.tti.tamu.edu/fss/", description: "Work orders, building access, and incident reporting", icon: "lucide:shield-check" },
    { label: "IT Helpdesk", href: "https://my.tti.tamu.edu/it/", description: "Technical support, ticket tracking, and software requests", icon: "lucide:life-buoy" },
  ],
  navItems: () => [],
  actionText: "",
  actionTo: "",
  actionHref: "",
  sticky: false,
  maxWidth: "standard",
  navAriaLabel: "Portal Navigation",
});

const emit = defineEmits<{
  "search-click": [];
  "action-click": [payload: MouseEvent];
}>();

const route = useRoute();
const mobileOpen = ref(false);
const activeDropdown = ref<string | null>(null);
const myAppsOpen = ref(false);
const expandedMobileSections = ref<Record<string, boolean>>({});

const effectiveShowSpectrumRibbon = computed(() => {
  if (props.showSpectrumRibbon !== undefined) return props.showSpectrumRibbon;
  return props.mode === "intranet";
});

// Close menus when route changes
watch(() => route?.fullPath, () => {
  mobileOpen.value = false;
  activeDropdown.value = null;
  myAppsOpen.value = false;
});

const containerWidthClass = computed(() => {
  if (props.maxWidth === "wide") return "max-w-[96rem]";
  if (props.maxWidth === "full") return "max-w-none";
  return "max-w-7xl";
});

function isItemActive(item: PortalNavItem): boolean {
  if (!route?.path) return false;
  if (item.to && route.path === item.to) return true;
  if (item.to && item.to !== "/" && route.path.startsWith(item.to)) return true;
  if (item.children?.some(c => c.to && (route.path === c.to || (c.to !== "/" && route.path.startsWith(c.to))))) {
    return true;
  }
  return false;
}

function toggleDropdown(label: string) {
  activeDropdown.value = activeDropdown.value === label ? null : label;
  if (activeDropdown.value) myAppsOpen.value = false;
}

function toggleMyApps() {
  myAppsOpen.value = !myAppsOpen.value;
  if (myAppsOpen.value) activeDropdown.value = null;
}

function closeDropdowns() {
  activeDropdown.value = null;
  myAppsOpen.value = false;
}

function toggleMobileSection(label: string) {
  expandedMobileSections.value[label] = !expandedMobileSections.value[label];
}

function handleSearchClick() {
  emit("search-click");
}

function handleActionClick(event: MouseEvent) {
  emit("action-click", event);
}
</script>

<template>
  <header
    class="tux-portal-header w-full border-b border-surface-border font-sans transition-all z-30"
    :class="{ 'sticky top-0 shadow-sm': sticky }"
    @keydown.escape="closeDropdowns"
  >
    <!-- TIER 1: Utility Bar (Comm: Maroon / Intranet: Editorial Charcoal) -->
    <div
      class="tux-portal-header__utility text-text-inverse text-xs select-none transition-colors"
      :class="mode === 'intranet' ? 'bg-neutral-900' : 'bg-brand-primary'"
    >
      <div
        class="mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-4"
        :class="containerWidthClass"
      >
        <!-- Left: Agency Mark (Comm) or Social Media Icons (Intranet) -->
        <div class="flex items-center gap-3">
          <template v-if="mode === 'intranet'">
            <div class="flex items-center gap-3 text-white/80">
              <a
                href="https://www.facebook.com/ttitamu"
                target="_blank"
                rel="noopener"
                class="hover:text-white transition-colors"
                aria-label="TTI Facebook"
              >
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://twitter.com/TTITAMU"
                target="_blank"
                rel="noopener"
                class="hover:text-white transition-colors"
                aria-label="TTI X (Twitter)"
              >
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="https://www.instagram.com/ttitamu/"
                target="_blank"
                rel="noopener"
                class="hover:text-white transition-colors"
                aria-label="TTI Instagram"
              >
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href="https://www.youtube.com/user/ttitamu"
                target="_blank"
                rel="noopener"
                class="hover:text-white transition-colors"
                aria-label="TTI YouTube"
              >
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a
                href="https://www.linkedin.com/school/texas-a&m-transportation-institute/"
                target="_blank"
                rel="noopener"
                class="hover:text-white transition-colors"
                aria-label="TTI LinkedIn"
              >
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </template>
          <template v-else>
            <a
              :href="agencyUrl"
              target="_blank"
              rel="noopener"
              class="tux-portal-header__agency-link inline-flex items-center gap-1.5 font-semibold text-text-inverse hover:text-white transition-opacity tracking-wide uppercase text-[11px]"
              title="Texas A&M Transportation Institute"
            >
              <span>{{ agencyName }}</span>
              <Icon name="lucide:external-link" class="w-3 h-3 opacity-75" aria-hidden="true" />
            </a>
          </template>
        </div>

        <!-- Utility Links, Search & MY APPS Trigger -->
        <div class="flex items-center gap-3 sm:gap-4">
          <ul v-if="utilityLinks.length > 0" class="hidden sm:flex items-center gap-3.5 list-none m-0 p-0">
            <li v-for="link in utilityLinks" :key="link.label">
              <NuxtLink
                v-if="link.to"
                :to="link.to"
                class="text-text-inverse/90 hover:text-white transition-colors text-[11px] font-medium tracking-wide uppercase"
              >
                {{ link.label }}
              </NuxtLink>
              <a
                v-else-if="link.href"
                :href="link.href"
                :target="link.external !== false ? '_blank' : undefined"
                :rel="link.external !== false ? 'noopener' : undefined"
                class="text-text-inverse/90 hover:text-white transition-colors text-[11px] font-medium tracking-wide uppercase"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>

          <slot name="utility-extra" />

          <!-- Search affordance -->
          <button
            v-if="showSearch"
            type="button"
            class="tux-portal-header__search-btn inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium text-text-inverse bg-black/20 hover:bg-black/35 border border-white/20 hover:border-white/40 transition-all cursor-pointer"
            aria-label="Open search dialog"
            @click="handleSearchClick"
          >
            <Icon name="lucide:search" class="w-3 h-3 text-brand-accent" aria-hidden="true" />
            <span class="hidden md:inline">Search</span>
            <span class="hidden lg:inline text-[10px] text-white/70 font-mono pl-1">⌘K</span>
          </button>

          <!-- Intranet Mode: MY APPS launcher button -->
          <div v-if="mode === 'intranet'" class="relative">
            <button
              type="button"
              class="tux-portal-header__my-apps-btn inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-primary hover:bg-brand-deep text-white font-bold text-[11px] tracking-wider uppercase transition-colors cursor-pointer border border-brand-accent/40 rounded-sm"
              :aria-expanded="myAppsOpen"
              aria-label="Toggle My Apps menu"
              @click="toggleMyApps"
            >
              <span>MY APPS</span>
              <Icon name="lucide:menu" class="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            <!-- MY APPS Flyout Grid -->
            <div
              v-show="myAppsOpen"
              class="absolute right-0 top-full mt-1.5 w-80 sm:w-96 bg-surface-raised border border-surface-border shadow-2xl p-4 z-50 animate-fade-in text-text-primary"
              @click.stop
            >
              <div class="flex items-center justify-between pb-2 mb-3 border-b border-surface-border">
                <div class="flex items-center gap-2">
                  <Icon name="lucide:layout-grid" class="w-4 h-4 text-brand-primary" aria-hidden="true" />
                  <span class="text-xs font-bold uppercase tracking-wider text-text-primary">TTI Internal Apps</span>
                </div>
                <a
                  href="https://my.tti.tamu.edu/app-catalog/"
                  target="_blank"
                  rel="noopener"
                  class="text-[11px] font-semibold text-brand-primary hover:underline"
                >
                  All Apps &rarr;
                </a>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <a
                  v-for="app in intranetApps"
                  :key="app.label"
                  :href="app.href"
                  target="_blank"
                  rel="noopener"
                  class="flex items-start gap-2.5 p-2 rounded hover:bg-surface-sunken transition-colors group"
                >
                  <Icon
                    :name="app.icon || 'lucide:external-link'"
                    class="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  />
                  <div class="min-w-0">
                    <div class="text-xs font-bold text-text-primary group-hover:text-brand-primary truncate">
                      {{ app.label }}
                    </div>
                    <div v-if="app.description" class="text-[10px] text-text-muted leading-tight line-clamp-2">
                      {{ app.description }}
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TIER 2: Crisp Brand Navigation Ribbon -->
    <div class="tux-portal-header__ribbon bg-surface-raised relative">
      <div
        class="mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4"
        :class="containerWidthClass"
      >
        <!-- Brand Lockup & Portal Title -->
        <div class="flex items-center gap-3 min-w-0">
          <slot name="brand">
            <NuxtLink :to="homeUrl" class="inline-flex items-center flex-shrink-0 group" title="Home">
              <!-- Official TTI Color Logo (Light) -->
              <img
                src="/resources/logos/tti-logo-color.png"
                alt="Texas A&M Transportation Institute"
                class="h-9 sm:h-10 w-auto object-contain dark:hidden transition-transform group-hover:scale-[1.02]"
              />
              <!-- Official TTI White Logo (Dark Mode) -->
              <img
                src="/resources/logos/tti-logo-white.png"
                alt="Texas A&M Transportation Institute"
                class="h-9 sm:h-10 w-auto object-contain hidden dark:block transition-transform group-hover:scale-[1.02]"
              />
            </NuxtLink>
          </slot>

          <!-- Sub-brand / Portal Title Lockup -->
          <div v-if="portalTitle || $slots['portal-title']" class="hidden sm:flex items-center gap-2.5 min-w-0">
            <div class="h-7 w-px bg-surface-border flex-shrink-0" aria-hidden="true" />
            <slot name="portal-title">
              <NuxtLink
                :to="homeUrl"
                class="text-base lg:text-lg font-bold text-text-primary hover:text-brand-primary transition-colors tracking-tight truncate max-w-[200px] md:max-w-xs xl:max-w-md"
              >
                {{ portalTitle }}
              </NuxtLink>
            </slot>
            <span
              v-if="portalBadge"
              class="inline-flex items-center flex-shrink-0 whitespace-nowrap px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-brand-accent/18 text-text-primary border border-brand-accent/40"
            >
              {{ portalBadge }}
            </span>
          </div>
        </div>

        <!-- Desktop Primary Navigation -->
        <nav
          v-if="navItems.length > 0 || $slots.nav"
          class="hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-end ml-4"
          :aria-label="navAriaLabel"
        >
          <slot name="nav">
            <template v-for="item in navItems" :key="item.label">
              <!-- Dropdown Trigger -->
              <div v-if="item.children && item.children.length > 0" class="relative group flex-shrink-0">
                <button
                  type="button"
                  class="tux-portal-nav__trigger inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold tracking-wide uppercase transition-colors border-b-2 whitespace-nowrap"
                  :class="[
                    isItemActive(item)
                      ? 'border-brand-accent text-brand-primary'
                      : 'border-transparent text-text-secondary hover:text-brand-primary hover:border-surface-border',
                    activeDropdown === item.label ? 'text-brand-primary' : ''
                  ]"
                  :aria-expanded="activeDropdown === item.label"
                  @click="toggleDropdown(item.label)"
                >
                  <span>{{ item.label }}</span>
                  <Icon
                    name="lucide:chevron-down"
                    class="w-3.5 h-3.5 transition-transform duration-150 flex-shrink-0"
                    :class="{ 'rotate-180': activeDropdown === item.label }"
                    aria-hidden="true"
                  />
                </button>

                <!-- Flyout Dropdown Menu -->
                <div
                  v-show="activeDropdown === item.label"
                  class="tux-portal-nav__dropdown absolute right-0 top-full mt-1.5 w-64 bg-surface-raised border border-surface-border rounded-none shadow-xl py-2 z-40 animate-fade-in"
                  @click.stop
                >
                  <div
                    v-for="child in item.children"
                    :key="child.label"
                    class="group/item"
                  >
                    <NuxtLink
                      v-if="child.to"
                      :to="child.to"
                      class="flex flex-col px-4 py-2 hover:bg-surface-sunken transition-colors"
                      @click="closeDropdowns"
                    >
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold text-text-primary group-hover/item:text-brand-primary">
                          {{ child.label }}
                        </span>
                        <span
                          v-if="child.badge"
                          class="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface-border text-text-muted"
                        >
                          {{ child.badge }}
                        </span>
                      </div>
                      <p v-if="child.description" class="text-xs text-text-muted mt-0.5 leading-snug">
                        {{ child.description }}
                      </p>
                    </NuxtLink>
                    <a
                      v-else-if="child.href"
                      :href="child.href"
                      target="_blank"
                      rel="noopener"
                      class="flex flex-col px-4 py-2 hover:bg-surface-sunken transition-colors"
                      @click="closeDropdowns"
                    >
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold text-text-primary group-hover/item:text-brand-primary">
                          {{ child.label }}
                        </span>
                        <Icon name="lucide:external-link" class="w-3 h-3 text-text-muted" aria-hidden="true" />
                      </div>
                      <p v-if="child.description" class="text-xs text-text-muted mt-0.5 leading-snug">
                        {{ child.description }}
                      </p>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Plain Link -->
              <NuxtLink
                v-else-if="item.to"
                :to="item.to"
                class="inline-flex items-center px-3 py-2 text-sm font-semibold tracking-wide uppercase transition-colors border-b-2 whitespace-nowrap flex-shrink-0"
                :class="[
                  isItemActive(item)
                    ? 'border-brand-accent text-brand-primary'
                    : 'border-transparent text-text-secondary hover:text-brand-primary hover:border-surface-border'
                ]"
              >
                {{ item.label }}
              </NuxtLink>

              <a
                v-else-if="item.href"
                :href="item.href"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center px-3 py-2 text-sm font-semibold tracking-wide uppercase transition-colors border-b-2 border-transparent text-text-secondary hover:text-brand-primary whitespace-nowrap flex-shrink-0"
              >
                {{ item.label }}
              </a>
            </template>
          </slot>
        </nav>

        <!-- Action CTA Button (Kadence Sharp Shape) -->
        <div class="hidden sm:flex items-center gap-3 flex-shrink-0">
          <slot name="action">
            <TuxButton
              v-if="actionText"
              shape="sharp"
              intent="primary"
              :to="actionTo || undefined"
              :href="actionHref || undefined"
              @click="handleActionClick"
            >
              {{ actionText }}
            </TuxButton>
          </slot>
        </div>

        <!-- Mobile Hamburger Toggle -->
        <button
          type="button"
          class="md:hidden inline-flex items-center justify-center p-2 rounded-sm border border-surface-border text-text-primary hover:bg-surface-sunken hover:text-brand-primary transition-colors cursor-pointer"
          :aria-expanded="mobileOpen"
          aria-label="Toggle navigation menu"
          @click="mobileOpen = !mobileOpen"
        >
          <Icon :name="mobileOpen ? 'lucide:x' : 'lucide:menu'" class="w-6 h-6" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- 5-Band Institutional Spectrum Ribbon -->
    <div
      v-if="effectiveShowSpectrumRibbon"
      class="tux-portal-header__spectrum-ribbon flex w-full h-1 sm:h-1.5"
      role="presentation"
      aria-hidden="true"
    >
      <div class="flex-1 bg-spectrum-maroon" />
      <div class="flex-1 bg-spectrum-blue" />
      <div class="flex-1 bg-spectrum-teal" />
      <div class="flex-1 bg-spectrum-green" />
      <div class="flex-1 bg-spectrum-gold" />
    </div>

    <!-- Mobile Slideover Navigation Drawer -->
    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-50 md:hidden bg-neutral-950/60 backdrop-blur-xs transition-opacity"
      @click="mobileOpen = false"
    >
      <div
        class="fixed inset-y-0 right-0 w-full max-w-sm bg-surface-raised shadow-2xl flex flex-col p-6 overflow-y-auto animate-slide-in-right"
        @click.stop
      >
        <!-- Drawer Header -->
        <div class="flex items-center justify-between pb-4 border-b border-surface-border">
          <div class="flex items-center gap-2">
            <img
              src="/resources/logos/tti-logo-color.png"
              alt="Texas A&M Transportation Institute"
              class="h-8 w-auto dark:hidden"
            />
            <img
              src="/resources/logos/tti-logo-white.png"
              alt="Texas A&M Transportation Institute"
              class="h-8 w-auto hidden dark:block"
            />
          </div>
          <button
            type="button"
            class="p-2 rounded-sm text-text-muted hover:text-text-primary hover:bg-surface-sunken"
            aria-label="Close menu"
            @click="mobileOpen = false"
          >
            <Icon name="lucide:x" class="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <!-- Mobile Portal Title -->
        <div v-if="portalTitle" class="py-3 border-b border-surface-border">
          <div class="text-sm font-bold text-text-primary">{{ portalTitle }}</div>
          <div v-if="portalBadge" class="mt-1">
            <span class="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase bg-brand-accent/18 text-text-primary border border-brand-accent/40 rounded">
              {{ portalBadge }}
            </span>
          </div>
        </div>

        <!-- Mobile Search -->
        <div v-if="showSearch" class="py-3">
          <button
            type="button"
            class="w-full flex items-center justify-between px-3 py-2 text-xs text-text-muted bg-surface-sunken border border-surface-border rounded-none"
            @click="handleSearchClick(); mobileOpen = false"
          >
            <span class="inline-flex items-center gap-2">
              <Icon name="lucide:search" class="w-4 h-4 text-brand-primary" aria-hidden="true" />
              <span>Search TTI resources...</span>
            </span>
            <span class="font-mono text-[10px]">⌘K</span>
          </button>
        </div>

        <!-- Mobile Intranet Apps Quick Links (Intranet mode) -->
        <div v-if="mode === 'intranet' && intranetApps.length > 0" class="py-3 border-b border-surface-border">
          <div class="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">My Apps</div>
          <div class="grid grid-cols-2 gap-1.5">
            <a
              v-for="app in intranetApps"
              :key="app.label"
              :href="app.href"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-2 py-1.5 px-2 rounded bg-surface-sunken text-xs font-semibold text-text-primary hover:text-brand-primary truncate"
            >
              <Icon :name="app.icon || 'lucide:external-link'" class="w-3.5 h-3.5 text-brand-primary flex-shrink-0" aria-hidden="true" />
              <span class="truncate">{{ app.label }}</span>
            </a>
          </div>
        </div>

        <!-- Mobile Navigation List -->
        <nav class="flex-1 py-2" aria-label="Mobile Navigation">
          <ul class="space-y-1 list-none p-0 m-0">
            <li v-for="item in navItems" :key="item.label">
              <div v-if="item.children && item.children.length > 0">
                <button
                  type="button"
                  class="w-full flex items-center justify-between py-2 text-sm font-semibold uppercase text-text-primary hover:text-brand-primary"
                  @click="toggleMobileSection(item.label)"
                >
                  <span>{{ item.label }}</span>
                  <Icon
                    name="lucide:chevron-down"
                    class="w-4 h-4 transition-transform"
                    :class="{ 'rotate-180': expandedMobileSections[item.label] }"
                    aria-hidden="true"
                  />
                </button>
                <div v-show="expandedMobileSections[item.label]" class="pl-4 space-y-1 pb-2">
                  <NuxtLink
                    v-for="child in item.children"
                    :key="child.label"
                    :to="child.to || child.href || '#'"
                    class="block py-1.5 text-xs text-text-secondary hover:text-brand-primary"
                    @click="mobileOpen = false"
                  >
                    {{ child.label }}
                  </NuxtLink>
                </div>
              </div>
              <NuxtLink
                v-else
                :to="item.to || item.href || '#'"
                class="block py-2 text-sm font-semibold uppercase text-text-primary hover:text-brand-primary"
                @click="mobileOpen = false"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Mobile Utility Section -->
        <div class="pt-4 border-t border-surface-border mt-auto">
          <div class="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">
            Institutional Links
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <a
              v-for="link in utilityLinks"
              :key="link.label"
              :href="link.href"
              target="_blank"
              rel="noopener"
              class="text-text-secondary hover:text-brand-primary py-1"
            >
              {{ link.label }}
            </a>
          </div>

          <!-- Mobile Action Button -->
          <div v-if="actionText" class="mt-4">
            <TuxButton
              shape="sharp"
              intent="primary"
              class="w-full justify-center"
              :to="actionTo || undefined"
              :href="actionHref || undefined"
              @click="handleActionClick"
            >
              {{ actionText }}
            </TuxButton>
          </div>

          <slot name="mobile-drawer-footer" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.tux-portal-header {
  font-family: var(--font-body, system-ui, sans-serif);
}

.tux-portal-header__search-btn:focus-visible,
.tux-portal-nav__trigger:focus-visible {
  outline: 2px solid var(--brand-accent);
  outline-offset: 2px;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-slide-in-right {
  animation: slideInRight 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
