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
      { label: "Tokens",     to: "/tokens",     icon: "lucide:palette" },
      { label: "Typography", to: "/typography", icon: "lucide:type" },
      { label: "Motion",     to: "/motion",     icon: "lucide:zap" },
      { label: "Icons",      to: "/icons",      icon: "lucide:sparkles" },
    ],
  },
  {
    group: "Components",
    items: [
      { label: "TuxAlert",         to: "/components/alert",          icon: "lucide:message-square" },
      { label: "TuxBadge",         to: "/components/badge",          icon: "lucide:badge" },
      { label: "TuxButton",        to: "/components/button",         icon: "lucide:rectangle-horizontal" },
      { label: "TuxCard",          to: "/components/card",           icon: "lucide:square-stack" },
      { label: "TuxEmptyState",    to: "/components/empty-state",    icon: "lucide:inbox" },
      { label: "TuxModal",         to: "/components/modal",          icon: "lucide:panel-top-open" },
      { label: "TuxPageHeader",    to: "/components/page-header",    icon: "lucide:pilcrow" },
      { label: "TuxSectionHeader", to: "/components/section-header", icon: "lucide:heading" },
      { label: "TuxTable",         to: "/components/table",          icon: "lucide:table" },
    ],
  },
  {
    group: "Composition",
    items: [
      { label: "Forms",    to: "/forms",    icon: "lucide:clipboard-list" },
      { label: "Patterns", to: "/patterns", icon: "lucide:layers" },
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

          <NuxtLink to="/" class="flex items-center gap-3 no-underline">
            <!-- Theme-aware logo. CSS swaps which one shows (instead of
                 :src-binding via useColorMode) so SSR picks the right
                 initial file without a post-hydration flash. Both are
                 tiny, both stay in the DOM, toggling is instant. -->
            <img
              src="/logo.svg"
              alt=""
              class="w-8 h-8 logo-light-only"
              aria-hidden="true"
            />
            <img
              src="/logo-dark.svg"
              alt=""
              class="w-8 h-8 logo-dark-only"
              aria-hidden="true"
            />
            <div>
              <div class="font-semibold tracking-tight leading-none text-text-primary">
                tti-ux
              </div>
              <div
                class="text-xs uppercase text-text-muted mt-0.5 hidden sm:block"
                style="letter-spacing: var(--tracking-wider)"
              >
                TTI Design System
              </div>
            </div>
          </NuxtLink>

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

      <footer class="border-t border-surface-border bg-surface-sunken">
        <div
          class="px-6 py-3 text-xs text-text-muted flex flex-col md:flex-row items-start md:items-center md:justify-between gap-1"
        >
          <div class="flex items-center gap-3">
            <span>tti-ux &middot; living style guide &middot; Apache 2.0</span>
            <span class="text-text-muted/50">&bull;</span>
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
          </div>
          <div class="flex items-center gap-3">
            <span>Texas A&amp;M Transportation Institute</span>
            <span class="text-text-muted/50">&bull;</span>
            <span>Networking &amp; Information Services</span>
          </div>
        </div>
      </footer>
    </div>
  </UApp>
</template>
