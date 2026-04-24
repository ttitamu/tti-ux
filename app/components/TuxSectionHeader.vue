<script setup lang="ts">
/**
 * TuxSectionHeader — aggieux signature. ALL-CAPS, tracked-out, with a maroon
 * underline rule. Echoes TTI's editorial rhythm.
 *
 * Pass `level` to control which heading tag renders (h1/h2/h3) — semantic
 * weight without restyling, so nested sections can nest their heading levels
 * without losing the visual treatment.
 *
 *   <tux-section-header level="1" subtitle="Q1 2026">Research grants</tux-section-header>
 */
interface Props {
  level?: 1 | 2 | 3;
  subtitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  level: 2,
  subtitle: undefined,
});
</script>

<template>
  <header class="mb-6">
    <component
      :is="`h${props.level}`"
      class="uppercase font-bold text-text-primary inline-block pb-1.5"
      :class="{
        'text-2xl': props.level === 1,
        'text-lg': props.level === 2,
        'text-sm': props.level === 3,
      }"
      :style="{
        letterSpacing: 'var(--tracking-wider)',
        borderBottom: '2px solid var(--brand-primary)',
      }"
    >
      <slot />
    </component>
    <p v-if="props.subtitle" class="text-sm text-text-secondary mt-2">
      {{ props.subtitle }}
    </p>
  </header>
</template>
