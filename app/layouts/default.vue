<script setup lang="ts">
// Default layout — minimal wrapper. Lets pages opt into a sidebar layout
// later via `definePageMeta({ layout: 'sidebar' })` without rewriting
// app.vue.
//
// Wraps content in a `<div>` with safe-area-inset CSS so Tauri Mobile
// builds (iOS / Android) get notch / dynamic-island / home-indicator /
// gesture-nav clearance automatically. Zero cost on desktop / web —
// env() values evaluate to 0 there. Captured in
// design/platform-awareness.md as the one no-regret change available
// today.
</script>

<template>
  <div class="tux-default-layout">
    <slot />
  </div>
</template>

<style scoped>
.tux-default-layout {
  min-height: 100vh;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
</style>
