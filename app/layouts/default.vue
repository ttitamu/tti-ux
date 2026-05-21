<script setup lang="ts">
// Default layout — passthrough. Lets pages opt into a sidebar layout later
// via `definePageMeta({ layout: 'sidebar' })` without rewriting app.vue.
//
// The bare `<slot />` root is intentional — Vue 3 supports fragment-style
// single-root templates and we want zero extra DOM nodes around page
// content. eslint-plugin-vue's `vue/no-multiple-template-root` is a
// Vue-2-era rule that hasn't caught up; disabled below.
</script>

<template>
  <!-- eslint-disable-next-line vue/no-multiple-template-root -->
  <slot />
</template>
