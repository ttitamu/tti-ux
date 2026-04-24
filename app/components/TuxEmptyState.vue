<script setup lang="ts">
/**
 * TuxEmptyState — the "no data yet" pattern extracted.
 *
 * Icon in a tinted circle, heading, one-sentence explanation of the state,
 * and a slot for the CTA button. Wrapped in a TuxCard so it reads as its
 * own bordered block in a page grid.
 *
 * Usage:
 *   <tux-empty-state
 *     icon="lucide:folder-plus"
 *     title="No projects yet"
 *     description="Create your first project to get started."
 *   >
 *     <tux-button intent="primary" icon="lucide:plus" to="/projects/new">
 *       Create project
 *     </tux-button>
 *   </tux-empty-state>
 *
 * Pass `no-card` to drop the card frame — useful when the empty state IS
 * the page (not a block inside another layout).
 */

interface Props {
  icon: string;
  title: string;
  description?: string;
  noCard?: boolean;
}

defineProps<Props>();
</script>

<template>
  <TuxCard v-if="!noCard">
    <div class="flex flex-col items-center text-center py-6 gap-3">
      <div
        class="w-14 h-14 rounded-full flex items-center justify-center"
        style="background: color-mix(in srgb, var(--brand-primary) 8%, var(--surface-raised))"
      >
        <UIcon :name="icon" class="w-7 h-7" style="color: var(--brand-primary)" />
      </div>
      <h3 class="text-lg font-bold text-text-primary">{{ title }}</h3>
      <p
        v-if="description"
        class="text-sm text-text-secondary max-w-md leading-relaxed"
      >
        {{ description }}
      </p>
      <div v-if="$slots.default" class="mt-1">
        <slot />
      </div>
    </div>
  </TuxCard>
  <div v-else class="flex flex-col items-center text-center py-6 gap-3">
    <div
      class="w-14 h-14 rounded-full flex items-center justify-center"
      style="background: color-mix(in srgb, var(--brand-primary) 8%, var(--surface-raised))"
    >
      <UIcon :name="icon" class="w-7 h-7" style="color: var(--brand-primary)" />
    </div>
    <h3 class="text-lg font-bold text-text-primary">{{ title }}</h3>
    <p
      v-if="description"
      class="text-sm text-text-secondary max-w-md leading-relaxed"
    >
      {{ description }}
    </p>
    <div v-if="$slots.default" class="mt-1">
      <slot />
    </div>
  </div>
</template>
