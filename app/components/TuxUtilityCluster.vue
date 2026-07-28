<script setup lang="ts">
/**
 * TuxUtilityCluster — the suite's trailing app-control cluster, and the
 * enforcement point for its anatomy law (design/compositions.md §Suite
 * chrome):
 *
 *   [ #search ] [ #notifications ] [ theme ] [ waffle ] [ identity ]
 *
 * Fixed DOM order, always — optional seats are absent, never reordered.
 * The waffle never folds; identity never folds. One cluster per app
 * shell. In Tauri shells the cluster sits before the OS window
 * controls ("trailing cluster", not "top-right" — Windows owns the
 * literal corner).
 *
 * Theme behavior: the built-in toggle flips tti ↔ tti-dark and
 * announces the change through a `role="status"` region (screen
 * readers don't re-announce a label rewrite on the focused element).
 * `tti-hc` stays reachable from the footer (ADR-0006) and from the
 * identity menu's prefs section — never from this toggle's cycle.
 *
 * The waffle is registry-fed: pass `current` (+ auth state) and the
 * cluster calls useTuxApps() itself; hand-declared app lists are
 * banned by doctrine.
 *
 * Identity: pass `userMenu` props through, or use the #identity slot
 * for portals with exotic identity needs. Omit both on unauthenticated
 * products (docs site) — the seat renders deliberately absent.
 */
import { computed, ref } from "vue";
import type { TuxUserIdentity, TuxUserMenuItem } from "./TuxUserMenu.vue";

interface Props {
  /** Registry id of this app (marks the waffle's current tile). */
  current?: string;
  /** Auth state for registry filtering (Tier 0/1). */
  signedIn?: boolean;
  /** Ids granted by the portal's my-apps resolver (Tier 1/2). */
  entitled?: string[];
  /** Hide the waffle entirely (rare — e.g. print layouts). */
  hideSwitcher?: boolean;
  /** Hide the built-in theme toggle (portal renders its own). */
  hideTheme?: boolean;
  /** TuxUserMenu passthrough. Omit (and omit #identity) on
   *  unauthenticated products. */
  userMenu?: {
    state: "loading" | "signed-out" | "signed-in" | "local-only" | "error";
    identity?: TuxUserIdentity;
    signInHref?: string;
    signInLabel?: string;
    items?: TuxUserMenuItem[];
    prefs?: TuxUserMenuItem[];
    statusLine?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  current: undefined,
  signedIn: false,
  entitled: undefined,
  hideSwitcher: false,
  hideTheme: false,
  userMenu: undefined,
});

const emit = defineEmits<{ (e: "sign-out" | "refresh"): void }>();

const { apps, heading, footerText } = useTuxApps({
  current: () => props.current,
  signedIn: () => props.signedIn,
  entitled: () => props.entitled,
});

// Theme toggle — tti ↔ tti-dark only (ADR-0006 keeps tti-hc out of
// the casual cycle). colorMode is repurposed as the theme selector
// (dataValue: "theme" in the layer's nuxt.config).
const colorMode = useColorMode();
const isDark = computed(() => colorMode.preference === "tti-dark");
const themeIcon = computed(() => (isDark.value ? "lucide:sun" : "lucide:moon"));
const themeLabel = computed(() =>
  isDark.value ? "Switch to light theme" : "Switch to dark theme",
);
const themeAnnouncement = ref("");
function toggleTheme() {
  colorMode.preference = isDark.value ? "tti" : "tti-dark";
  themeAnnouncement.value = isDark.value ? "Theme: dark" : "Theme: light";
}
</script>

<template>
  <div class="tux-utility-cluster">
    <slot name="search" />
    <slot name="notifications" />

    <ClientOnly v-if="!hideTheme">
      <button
        type="button"
        class="tux-utility-cluster__theme"
        :aria-label="themeLabel"
        @click="toggleTheme"
      >
        <Icon :name="themeIcon" :size="16" />
      </button>
      <template #fallback>
        <div class="tux-utility-cluster__theme" aria-hidden="true" />
      </template>
    </ClientOnly>
    <span class="sr-only" role="status">{{ themeAnnouncement }}</span>

    <TuxAppSwitcher
      v-if="!hideSwitcher"
      :apps="apps"
      :heading="heading"
      :footer-text="footerText"
    />

    <slot name="identity">
      <TuxUserMenu
        v-if="userMenu"
        v-bind="userMenu"
        placement="cluster"
        @sign-out="emit('sign-out')"
        @refresh="emit('refresh')"
      />
    </slot>
  </div>
</template>

<style scoped>
.tux-utility-cluster {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.tux-utility-cluster__theme {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition:
    background var(--motion-fast) var(--ease-survey),
    color var(--motion-fast) var(--ease-survey);
}
.tux-utility-cluster__theme:hover {
  background: color-mix(in srgb, var(--text-primary) 7%, transparent);
  color: var(--text-primary);
}

@media (forced-colors: active) {
  .tux-utility-cluster__theme:focus-visible {
    outline: 2px solid;
  }
}
@media (prefers-reduced-motion: reduce) {
  .tux-utility-cluster__theme {
    transition: none;
  }
}
</style>
