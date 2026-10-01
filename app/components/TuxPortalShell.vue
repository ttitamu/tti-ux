<script setup lang="ts">
/**
 * TuxPortalShell — Turnkey Two-Tier Institutional Portal Layout Shell.
 *
 * Wraps TuxPortalHeader, sticky navigation, optional breadcrumbs/subnav strip
 * with signature Warm Gold accent rule, full-bleed hero slot, main content
 * container with responsive width modes, floating Maroon feedback pill,
 * and institutional TuxFooter.
 */
import type { PortalNavItem, PortalUtilityLink } from "./TuxPortalHeader.vue";

export interface PortalBreadcrumb {
  label: string;
  to?: string;
  href?: string;
}

interface Props {
  /** Title of the portal, research center, or initiative. */
  portalTitle?: string;
  /** Optional badge pill next to portal title. */
  portalBadge?: string;
  /** Badge color variant. */
  portalBadgeVariant?: "neutral" | "maroon" | "gold" | "info" | "success";
  /** Primary navigation items. */
  navItems?: PortalNavItem[];
  /** Primary CTA button text. */
  actionText?: string;
  /** Primary CTA router target. */
  actionTo?: string;
  /** Primary CTA external URL. */
  actionHref?: string;
  /** Tier 1 institutional utility links. */
  utilityLinks?: PortalUtilityLink[];
  /** Agency name in Tier 1. */
  agencyName?: string;
  /** Agency URL in Tier 1. */
  agencyUrl?: string;
  /** Root home URL for logo link. */
  homeUrl?: string;
  /** Show search trigger in Tier 1. */
  showSearch?: boolean;
  /** Sticky-position the header at the top of the viewport. */
  stickyHeader?: boolean;
  /** Breadcrumb trail for the subnav bar. */
  breadcrumbs?: PortalBreadcrumb[];
  /** Container max-width mode: standard (80rem / 7xl), wide (96rem), or full. */
  maxWidth?: "standard" | "wide" | "full";
  /** Whether to render the floating feedback pill button. */
  showFeedback?: boolean;
  /** Label for the floating feedback button. */
  feedbackLabel?: string;
  /** Whether to render the institutional TuxFooter at the bottom. */
  showFooter?: boolean;
  /** Extra props forwarded to TuxPortalHeader. */
  headerProps?: Record<string, any>;
  /** Extra props forwarded to TuxFooter. */
  footerProps?: Record<string, any>;
  /** Main content wrapper padding class override. */
  mainClass?: string;
  /** Element tag for main container: 'main' (default for layouts) or 'div' (for embedded demos). */
  as?: "main" | "div";
}

const props = withDefaults(defineProps<Props>(), {
  portalTitle: "",
  portalBadge: "",
  portalBadgeVariant: "gold",
  navItems: () => [],
  actionText: "",
  actionTo: "",
  actionHref: "",
  agencyName: "Texas A&M Transportation Institute",
  agencyUrl: "https://tti.tamu.edu",
  homeUrl: "/",
  showSearch: true,
  stickyHeader: true,
  breadcrumbs: () => [],
  maxWidth: "standard",
  showFeedback: true,
  feedbackLabel: "Feedback",
  showFooter: true,
  headerProps: () => ({}),
  footerProps: () => ({}),
  mainClass: "py-8",
  as: "main",
});

const emit = defineEmits<{
  "search-click": [];
  "action-click": [payload: MouseEvent];
  "feedback-click": [];
}>();

const containerWidthClass = computed(() => {
  if (props.maxWidth === "wide") return "max-w-[96rem]";
  if (props.maxWidth === "full") return "max-w-none";
  return "max-w-7xl";
});

function handleSearchClick() {
  emit("search-click");
}

function handleActionClick(event: MouseEvent) {
  emit("action-click", event);
}

function handleFeedbackClick() {
  emit("feedback-click");
}
</script>

<template>
  <div class="tux-portal-shell min-h-screen flex flex-col bg-surface-page text-text-primary font-sans antialiased">
    <!-- Header Section -->
    <slot name="header">
      <TuxPortalHeader
        :sticky="stickyHeader"
        :portal-title="portalTitle"
        :portal-badge="portalBadge"
        :portal-badge-variant="portalBadgeVariant"
        :nav-items="navItems"
        :action-text="actionText"
        :action-to="actionTo"
        :action-href="actionHref"
        :agency-name="agencyName"
        :agency-url="agencyUrl"
        :home-url="homeUrl"
        :show-search="showSearch"
        :max-width="maxWidth"
        v-bind="headerProps"
        @search-click="handleSearchClick"
        @action-click="handleActionClick"
      >
        <template v-if="$slots.brand" #brand>
          <slot name="brand" />
        </template>
        <template v-if="$slots['portal-title']" #portal-title>
          <slot name="portal-title" />
        </template>
        <template v-if="$slots.nav" #nav>
          <slot name="nav" />
        </template>
        <template v-if="$slots.action" #action>
          <slot name="action" />
        </template>
        <template v-if="$slots['utility-extra']" #utility-extra>
          <slot name="utility-extra" />
        </template>
      </TuxPortalHeader>
    </slot>

    <!-- Subnav / Breadcrumbs Bar with Signature Warm Gold Accent Rule -->
    <div
      v-if="breadcrumbs.length > 0 || $slots.subnav"
      class="tux-portal-shell__subnav bg-surface-sunken border-b-2 border-brand-accent"
    >
      <div
        class="mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4"
        :class="containerWidthClass"
      >
        <slot name="subnav">
          <TuxBreadcrumbs
            v-if="breadcrumbs.length > 0"
            :trail="breadcrumbs"
            :home-icon="true"
          />
        </slot>
      </div>
    </div>

    <!-- Full-Bleed Hero Slot (Optional) -->
    <section v-if="$slots.hero" aria-label="Featured Highlight" class="tux-portal-shell__hero w-full">
      <slot name="hero" />
    </section>

    <!-- Main Content Container -->
    <component
      :is="as"
      :id="as === 'main' ? 'main-content' : undefined"
      class="tux-portal-shell__main flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8"
      :class="[containerWidthClass, mainClass]"
    >
      <slot />
    </component>

    <!-- Floating Maroon Feedback Pill -->
    <div v-if="showFeedback" class="tux-portal-shell__feedback fixed bottom-6 right-6 z-40 select-none">
      <slot name="feedback">
        <button
          type="button"
          class="tux-portal-shell__feedback-btn inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-brand-primary text-text-inverse font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-150 border border-white/20 cursor-pointer"
          aria-label="Submit portal feedback"
          @click="handleFeedbackClick"
        >
          <Icon name="lucide:message-square-plus" class="w-4 h-4 text-brand-accent" aria-hidden="true" />
          <span>{{ feedbackLabel }}</span>
        </button>
      </slot>
    </div>

    <!-- Institutional Footer Wrapper -->
    <div v-if="showFooter" class="tux-portal-shell__footer mt-auto">
      <slot name="footer">
        <TuxFooter v-bind="footerProps" />
      </slot>
    </div>
  </div>
</template>

<style scoped>
.tux-portal-shell {
  font-family: var(--font-body, system-ui, sans-serif);
}

.tux-portal-shell__feedback-btn:focus-visible {
  outline: 2px solid var(--brand-accent);
  outline-offset: 3px;
}
</style>
