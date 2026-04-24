<script setup lang="ts">
// Root shell for the style-guide app. Header with logo + theme toggle;
// sidebar nav + content live in layouts/default.vue (auto-applied via
// <NuxtLayout> passthrough).

const colorMode = useColorMode();

// Three-way cycle: tti → tti-dark → tti-hc → tti.
// Icon shows what you'll GET on click (the next state), which matches how
// OS theme toggles tend to read (the sun icon means "click for light mode").
const themeToggleIcon = computed(() => {
  if (colorMode.preference === "tti") return "lucide:moon";         // → dark
  if (colorMode.preference === "tti-dark") return "lucide:contrast"; // → high-contrast
  return "lucide:sun";                                                // → light
});

const themeToggleLabel = computed(() => {
  if (colorMode.preference === "tti") return "Switch to dark theme";
  if (colorMode.preference === "tti-dark") return "Switch to high-contrast theme";
  return "Switch to standard theme";
});

function toggleTheme() {
  const next = { tti: "tti-dark", "tti-dark": "tti-hc", "tti-hc": "tti" } as const;
  colorMode.preference = next[colorMode.preference as keyof typeof next] ?? "tti";
}
</script>

<template>
  <!-- UApp hosts the portal containers for <UModal>, <UToast>, tooltips. -->
  <UApp>
    <div class="min-h-screen flex flex-col bg-surface-page text-text-primary">
      <header
        class="border-b border-surface-border bg-surface-raised"
        role="banner"
      >
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
          <div class="flex-1 flex items-center">
            <NuxtLink to="/" class="flex items-center gap-3 no-underline">
              <img src="/logo.svg" alt="" class="w-9 h-9" aria-hidden="true" />
              <div>
                <div class="font-semibold tracking-tight leading-none text-text-primary">
                  tti-ux
                </div>
                <div
                  class="text-xs uppercase text-text-muted mt-0.5"
                  style="letter-spacing: var(--tracking-wider)"
                >
                  TTI Design System
                </div>
              </div>
            </NuxtLink>
          </div>

          <nav class="flex items-center gap-6 text-sm">
            <NuxtLink
              to="/tokens"
              class="text-text-secondary hover:text-text-brand"
              active-class="text-text-brand font-medium"
            >
              Tokens
            </NuxtLink>
            <NuxtLink
              to="/typography"
              class="text-text-secondary hover:text-text-brand"
              active-class="text-text-brand font-medium"
            >
              Typography
            </NuxtLink>
            <NuxtLink
              to="/motion"
              class="text-text-secondary hover:text-text-brand"
              active-class="text-text-brand font-medium"
            >
              Motion
            </NuxtLink>
            <NuxtLink
              to="/components"
              class="text-text-secondary hover:text-text-brand"
              active-class="text-text-brand font-medium"
            >
              Components
            </NuxtLink>
            <NuxtLink
              to="/forms"
              class="text-text-secondary hover:text-text-brand"
              active-class="text-text-brand font-medium"
            >
              Forms
            </NuxtLink>
            <NuxtLink
              to="/patterns"
              class="text-text-secondary hover:text-text-brand"
              active-class="text-text-brand font-medium"
            >
              Patterns
            </NuxtLink>
          </nav>

          <div class="flex-1 flex items-center justify-end gap-3">
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
        </div>
      </header>

      <main class="flex-1">
        <div class="max-w-7xl mx-auto px-6 py-8">
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </div>
      </main>

      <footer class="border-t border-surface-border bg-surface-sunken mt-16">
        <div
          class="max-w-7xl mx-auto px-6 py-4 text-xs text-text-muted flex items-center justify-between"
        >
          <div>tti-ux &middot; living style guide &middot; Apache 2.0</div>
          <div class="flex items-center gap-4">
            <span>Texas A&amp;M Transportation Institute</span>
            <span class="text-text-muted/50">&bull;</span>
            <span>Networking &amp; Information Services</span>
          </div>
        </div>
      </footer>
    </div>
  </UApp>
</template>
