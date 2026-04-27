<script setup lang="ts">
/**
 * TuxCard — TTI-flavored card.
 *
 * Wraps the tux `.card-static` / `.card-linked` chrome in a simple slot
 * API. Pass `to` to make it a `<NuxtLink>` with corner-drop + hover-arrow
 * motion (signals navigation). Without `to` it's a static branded block.
 *
 * We don't wrap UCard — UCard's default thin-border would fight the 2px
 * maroon border. Headers/footers compose inside the default slot.
 *
 * Usage:
 *   <tux-card to="/components/alert">
 *     <p class="eyebrow">component</p>
 *     <h3>TuxAlert</h3>
 *   </tux-card>
 */

interface Props {
  to?: string;
  padded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  padded: true,
});

const isLinked = computed(() => !!props.to);
</script>

<template>
  <NuxtLink
    v-if="isLinked"
    :to="to"
    :class="['card-linked no-underline block', padded && 'p-6']"
  >
    <span class="card-linked__arrow" aria-hidden="true">
      <UIcon name="lucide:arrow-up-right" class="w-7 h-7" />
    </span>
    <slot />
  </NuxtLink>
  <div v-else :class="['card-static', padded && 'p-6']">
    <slot />
  </div>
</template>
