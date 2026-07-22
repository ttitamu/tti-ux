<script setup lang="ts">
/**
 * TuxCard — TTI-flavored card.
 *
 * Wraps the tux `.card-static` / `.card-linked` chrome in a simple slot
 * API. Pass `to` to make it a `<NuxtLink>` with corner-drop + hover-arrow
 * motion (signals navigation). Without `to` it's a static branded block.
 *
 * `linked` (without `to`) renders the linked-card chrome — hover-lift +
 * corner arrow — on a plain `<div>` instead of an anchor. Use it when the
 * actual link lives on an inner element (e.g. a title link with a stretched
 * `::after` overlay), when the link is EXTERNAL, or when the card holds
 * several interactive children that an anchor wrapper would swallow. The
 * consumer owns the inner link + clickable overlay; TuxCard just supplies
 * the chrome. (`to` wins if both are set.)
 *
 * We don't wrap UCard — UCard's default thin-border would fight the 2px
 * maroon border. Headers/footers compose inside the default slot.
 *
 * Usage:
 *   <tux-card to="/components/alert">
 *     <p class="eyebrow">component</p>
 *     <h3>TuxAlert</h3>
 *   </tux-card>
 *
 *   <!-- title-link / external / multi-interactive: chrome only -->
 *   <tux-card linked :padded="false">
 *     <h3><a href="https://…" class="stretched">External thing</a></h3>
 *     <TuxBadge tone="info">tag</TuxBadge>
 *   </tux-card>
 */

interface Props {
  to?: string;
  padded?: boolean;
  linked?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  padded: true,
  to: undefined,
  linked: false,
});

const isAnchor = computed(() => !!props.to);

// Multi-root component (the three branches below), so Vue can't auto-inherit
// fallthrough attrs. Forward them explicitly with v-bind="$attrs" so consumers
// can pass `class` / `id` / etc. onto whichever root renders.
defineOptions({ inheritAttrs: false });
</script>

<template>
  <NuxtLink
    v-if="isAnchor"
    :to="to"
    :class="['card-linked no-underline block', padded && 'p-6']"
    v-bind="$attrs"
  >
    <span class="card-linked__arrow" aria-hidden="true">
      <UIcon name="lucide:arrow-up-right" class="w-7 h-7" />
    </span>
    <slot />
  </NuxtLink>
  <div
    v-else-if="linked"
    :class="['card-linked', padded && 'p-6']"
    v-bind="$attrs"
  >
    <span class="card-linked__arrow" aria-hidden="true">
      <UIcon name="lucide:arrow-up-right" class="w-7 h-7" />
    </span>
    <slot />
  </div>
  <div v-else :class="['card-static', padded && 'p-6']" v-bind="$attrs">
    <slot />
  </div>
</template>
