<script setup lang="ts">
/**
 * TuxPageHeader — composite: eyebrow + gold-bar heading + subtitle.
 *
 * The rhythm most pages open with. Before this extract, every page wrote:
 *
 *   <p class="eyebrow">primitives</p>
 *   <h1 class="heading--bold text-3xl font-bold">TuxButton</h1>
 *   <p class="mt-3 max-w-2xl text-text-secondary">...</p>
 *
 * Now:
 *   <tux-page-header eyebrow="primitives" title="TuxButton">
 *     One-sentence description of what this page covers.
 *   </tux-page-header>
 *
 * `level` flips h1 vs h2 without changing visual weight — use h2 when the
 * page header sits under a layout-level h1 (e.g. inside a card).
 */

interface Props {
  eyebrow?: string;
  title: string;
  level?: 1 | 2;
}

withDefaults(defineProps<Props>(), {
  level: 1,
});
</script>

<template>
  <header class="mb-6">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <component
      :is="`h${level}`"
      class="heading--bold font-bold"
      :class="level === 1 ? 'text-3xl' : 'text-2xl'"
    >
      {{ title }}
    </component>
    <div v-if="$slots.default" class="mt-3 max-w-2xl text-text-secondary">
      <slot />
    </div>
  </header>
</template>
