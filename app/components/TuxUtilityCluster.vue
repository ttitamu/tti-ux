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
  /** Hide the built-in high-contrast toggle. Defaults to false. */
  hideHighContrast?: boolean;
  /** Hide the vision & accessibility preferences modal toggle. Defaults to false. */
  hideVisionPrefs?: boolean;
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
  hideHighContrast: false,
  hideVisionPrefs: false,
  userMenu: undefined,
});

const emit = defineEmits<{ (e: "sign-out" | "refresh"): void }>();

const { apps, heading, footerText } = useTuxApps({
  current: () => props.current,
  signedIn: () => props.signedIn,
  entitled: () => props.entitled,
});

// Theme toggle — tti ↔ tti-dark and accessible WCAG AAA tti-hc.
const colorMode = useColorMode();
const isDark = computed(() => colorMode.preference === "tti-dark");
const isHighContrast = computed(() => colorMode.preference === "tti-hc");
const lastNormalTheme = ref<"tti" | "tti-dark">("tti");

const themeIcon = computed(() => (isDark.value ? "lucide:sun" : "lucide:moon"));
const themeLabel = computed(() =>
  isDark.value ? "Switch to light theme" : "Switch to dark theme",
);
const hcLabel = computed(() =>
  isHighContrast.value ? "Exit high-contrast mode" : "Enable WCAG AAA high-contrast mode",
);

const themeAnnouncement = ref("");
const visionModalOpen = ref(false);

function toggleTheme() {
  if (isHighContrast.value) {
    colorMode.preference = isDark.value ? "tti" : "tti-dark";
    themeAnnouncement.value = isDark.value ? "Theme: light" : "Theme: dark";
    return;
  }
  colorMode.preference = isDark.value ? "tti" : "tti-dark";
  themeAnnouncement.value = isDark.value ? "Theme: light" : "Theme: dark";
}

function toggleHighContrast() {
  if (isHighContrast.value) {
    colorMode.preference = lastNormalTheme.value;
    themeAnnouncement.value = `Theme: ${lastNormalTheme.value === "tti-dark" ? "dark" : "light"}`;
  } else {
    if (colorMode.preference === "tti" || colorMode.preference === "tti-dark") {
      lastNormalTheme.value = colorMode.preference;
    }
    colorMode.preference = "tti-hc";
    themeAnnouncement.value = "Theme: high-contrast (WCAG AAA)";
  }
}
</script>

<template>
  <div class="tux-utility-cluster">
    <slot name="search" />
    <slot name="notifications" />

    <ClientOnly v-if="!hideTheme">
      <button
        v-if="!hideVisionPrefs"
        type="button"
        class="tux-utility-cluster__theme tux-utility-cluster__vision-btn"
        aria-label="Vision & Accessibility Preferences"
        title="Vision & Accessibility Preferences"
        @click="visionModalOpen = true"
      >
        <Icon name="lucide:sliders-horizontal" :size="16" />
      </button>

      <button
        v-if="!hideHighContrast"
        type="button"
        class="tux-utility-cluster__theme tux-utility-cluster__hc-btn"
        :class="{ 'tux-utility-cluster__hc-btn--active': isHighContrast }"
        :aria-label="hcLabel"
        :aria-pressed="isHighContrast"
        :title="hcLabel"
        @click="toggleHighContrast"
      >
        <Icon name="lucide:accessibility" :size="16" />
      </button>

      <button
        type="button"
        class="tux-utility-cluster__theme"
        :aria-label="themeLabel"
        :title="themeLabel"
        @click="toggleTheme"
      >
        <Icon :name="themeIcon" :size="16" />
      </button>

      <TuxVisionPreferencesModal v-model:open="visionModalOpen" />

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
  flex-shrink: 0;
  white-space: nowrap;
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
  background: color-mix(in srgb, var(--text-primary) 8%, transparent);
  color: var(--text-primary);
}

.tux-utility-cluster__hc-btn--active {
  background: var(--brand-primary);
  color: var(--neutral-0);
}
.tux-utility-cluster__hc-btn--active:hover {
  background: var(--brand-primary-deep);
  color: var(--neutral-0);
}

@media (max-width: 639px) {
  .tux-utility-cluster__hc-btn {
    display: none !important;
  }
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
