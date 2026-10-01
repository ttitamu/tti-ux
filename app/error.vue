<script setup lang="ts">
/**
 * app/error.vue — Institutional root error boundary for the TTI UX Framework.
 * Catches uncaught runtime exceptions, 404 Not Found, 401/403 Auth failures,
 * and 500/503 system exceptions with full WCAG 2.2 AAA fidelity.
 */
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const isDev = import.meta.dev;

const handleError = () => {
  clearError({ redirect: "/" });
};

const handleComponents = () => {
  clearError({ redirect: "/components" });
};

useHead({
  title: `${props.error.statusCode || 404} — TTI UX Framework`,
  meta: [
    { name: "description", content: props.error.message || "An institutional error occurred." },
  ],
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface-page text-text-primary">
    <!-- Institutional Top Navigation Bar -->
    <header class="border-b border-surface-border bg-surface-raised/95 backdrop-blur-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="flex items-center gap-3 bg-transparent border-0 p-0 text-left cursor-pointer group focus-visible:outline-2 focus-visible:outline-brand-primary"
          @click="handleError"
        >
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-none bg-brand-primary text-text-inverse font-mono font-bold text-xs tracking-wider shadow-xs">
            TTI
          </span>
          <div class="flex flex-col">
            <span class="font-display font-bold text-sm tracking-tight text-text-primary group-hover:text-brand-primary transition-colors">
              TTI UX Framework
            </span>
            <span class="text-[10px] font-mono uppercase tracking-widest text-text-muted">
              Texas A&M Transportation Institute
            </span>
          </div>
        </button>
      </div>

      <div class="flex items-center gap-3">
        <TuxButton
          intent="ghost"
          size="sm"
          shape="sharp"
          icon="lucide:arrow-left"
          @click="handleError"
        >
          Back to Safety
        </TuxButton>
        <TuxButton
          intent="primary"
          size="sm"
          shape="sharp"
          icon="lucide:home"
          @click="handleError"
        >
          Return Home
        </TuxButton>
      </div>
    </header>

    <!-- Error View Body -->
    <main class="flex-1 flex items-center justify-center p-6 md:p-12">
      <TuxErrorPage
        :code="String(error.statusCode || 404)"
        :title="error.statusMessage"
        :lede="error.message && error.message !== error.statusMessage ? error.message : undefined"
        :details="isDev || error.statusCode === 500 ? (error.stack || error.message) : undefined"
        :actions="[
          { label: 'Return to Homepage', intent: 'primary', icon: 'lucide:home', onClick: handleError },
          { label: 'Browse Component Lab', intent: 'secondary', icon: 'lucide:blocks', onClick: handleComponents },
        ]"
      />
    </main>

    <!-- Institutional Footer Ribbon -->
    <footer class="border-t border-surface-border bg-surface-sunken/60 py-4 px-6 text-center text-xs text-text-muted flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-status-maroon inline-block" />
        <span>Texas A&M Transportation Institute · System Error Boundary</span>
      </div>
      <div class="flex items-center gap-4">
        <NuxtLink to="/components/health" class="text-text-muted hover:text-brand-primary underline" @click.prevent="clearError({ redirect: '/components/health' })">
          System Health Matrix
        </NuxtLink>
        <span class="text-surface-border">|</span>
        <a href="mailto:helpdesk@tti.tamu.edu" class="text-text-muted hover:text-brand-primary underline">
          TTI Help Desk
        </a>
      </div>
    </footer>
  </div>
</template>
