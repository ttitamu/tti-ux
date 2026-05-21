<script setup lang="ts">
// Sidebar layout — opt-in app shell for data-dense surfaces.
//
// Composes Nuxt UI 4's UDashboard* primitives: UDashboardGroup +
// UDashboardSidebar + UDashboardPanel. They handle responsive
// behavior (mobile slideover via USlideover/UDrawer/UModal),
// collapsible-to-icon-only at narrow widths, persistent open/collapsed
// state via cookie or local storage, and the accessibility plumbing.
//
// TUX principle #1 is "editorial, not dashboard-y" — most pages stay
// on the default passthrough layout + TuxSiteNav. This layout exists
// for the exception: application surfaces where a persistent left rail
// genuinely helps (Landscape dashboard, tti-ai-studio session, future
// research console).
//
// Opt in from any page:
//
//   definePageMeta({ layout: "sidebar" });
//
// Slots (scope variables forwarded from UDashboardSidebar where noted):
//
//   #header        — top bar across the page (UDashboardPanel header).
//                    Typical content: UDashboardNavbar with breadcrumbs
//                    + page actions.
//   #rail-header   — top of the rail; brand / account lockup.
//                    Scope: { collapsed, collapse }
//   #rail          — rail body; nav items.
//                    Scope: { collapsed, collapse }
//   #rail-footer   — bottom of the rail; user / settings.
//                    Scope: { collapsed, collapse }
//   (default)      — main content surface (UDashboardPanel body).

interface Props {
  /** Initial mobile-overlay open state. Default closed. */
  initialOpen?: boolean;
  /** Initial collapsed-to-icons state at lg+. Default expanded. */
  initialCollapsed?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  initialOpen: false,
  initialCollapsed: false,
});

// Typed slot surface — UDashboardSidebar forwards `{ collapsed, collapse }`
// to its header / body / footer slots; we re-expose under TUX-named slots
// so consumer pages can destructure with full type narrowing.
interface RailScope {
  collapsed: boolean;
  collapse: (value: boolean) => void;
}
defineSlots<{
  header(): unknown;
  "rail-header"(props: RailScope): unknown;
  rail(props: RailScope): unknown;
  "rail-footer"(props: RailScope): unknown;
  default(): unknown;
}>();

const open = ref(props.initialOpen);
const collapsed = ref(props.initialCollapsed);
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      v-model:open="open"
      v-model:collapsed="collapsed"
      collapsible
      resizable
    >
      <template v-if="$slots['rail-header']" #header="scope">
        <slot name="rail-header" v-bind="scope" />
      </template>

      <template #default="scope">
        <slot name="rail" v-bind="scope" />
      </template>

      <template v-if="$slots['rail-footer']" #footer="scope">
        <slot name="rail-footer" v-bind="scope" />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <template v-if="$slots.header" #header>
        <slot name="header" />
      </template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
