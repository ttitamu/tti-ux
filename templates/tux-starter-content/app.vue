<script setup lang="ts">
// Root template for TTI-UX Content Site
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface-page text-text-primary">
    <!-- Institutional Header with theme switcher -->
    <header class="border-b border-surface-border bg-surface-raised px-6 py-4 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-3 no-underline">
        <span class="font-bold text-lg text-brand-primary">TTI</span>
        <span class="text-surface-border">|</span>
        <span class="text-sm font-semibold text-text-secondary">Center for Connected Infrastructure</span>
      </NuxtLink>
      <nav class="flex items-center gap-6 text-sm">
        <NuxtLink to="/" class="hover:text-brand-primary">Home</NuxtLink>
        <NuxtLink to="/research/smart-corridors" class="hover:text-brand-primary">Research</NuxtLink>
      </nav>
    </header>

    <!-- Main Content Container with ContentDoc renderer -->
    <main class="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
      <ContentDoc>
        <template #not-found>
          <TuxAlert variant="warning" title="Page Not Found">
            The requested document could not be found.
          </TuxAlert>
        </template>
      </ContentDoc>
    </main>

    <!-- Institutional TUX Footer -->
    <TuxFooter />
  </div>
</template>
