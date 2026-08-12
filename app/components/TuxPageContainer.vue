<script setup lang="ts">
/**
 * TuxPageContainer — the page-content width primitive.
 *
 * Centers content at one of three token-backed widths so every product
 * shares the same measure instead of inventing its own (Landscape alone
 * carried 80rem / 72rem / 64rem across three layouts before this
 * existed). Pairs with the measured `--tux-nav-height` custom property
 * (published by TuxSiteNav / TuxAppFrame) for sticky-offset math.
 *
 *   default — --layout-content-max (80rem): standard app/docs pages
 *   wide    — --layout-content-wide (96rem): data grids, dashboards
 *   prose   — --layout-prose-max (72ch): long-form reading measure
 *
 * `flush` drops the horizontal gutter for surfaces that manage their
 * own edge padding (full-bleed slabs, hero bands).
 */
interface Props {
  /** Content measure. */
  width?: "default" | "wide" | "prose";
  /** Drop the horizontal gutter (component manages its own edges). */
  flush?: boolean;
  /** Element to render. `main` for the page's primary region. */
  as?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: "default",
  flush: false,
  as: "div",
});

const widthClass = computed(() => `tux-page-container--${props.width}`);
</script>

<template>
  <component
    :is="as"
    class="tux-page-container"
    :class="[widthClass, { 'tux-page-container--flush': flush }]"
  >
    <slot />
  </component>
</template>

<style scoped>
.tux-page-container {
  width: 100%;
  margin-inline: auto;
  padding-inline: 1.5rem;
}

.tux-page-container--default { max-width: var(--layout-content-max); }
.tux-page-container--wide    { max-width: var(--layout-content-wide); }
.tux-page-container--prose   { max-width: var(--layout-prose-max); }

.tux-page-container--flush { padding-inline: 0; }
</style>
