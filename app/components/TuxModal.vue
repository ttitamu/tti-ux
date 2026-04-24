<script setup lang="ts">
/**
 * TuxModal — UModal with TTI flavor.
 *
 * Nuxt UI's UModal gives us the heavy lifting (scrim, focus trap, body
 * scroll lock, Escape to close). This wrapper adds:
 *   - optional eyebrow above the title (editorial rhythm)
 *   - gold-bar underline on the title (aggieux signature)
 *   - title uses the `heading--bold` utility
 *
 * Pass `v-model:open` like you would to UModal. Body and footer go in the
 * default and `#footer` slots. Suggested footer pattern:
 *
 *   <template #footer>
 *     <div class="flex justify-end gap-2">
 *       <UButton color="success" icon="lucide:check">Keep</UButton>
 *       <UButton color="error">Confirm</UButton>
 *     </div>
 *   </template>
 */

interface Props {
  open?: boolean;
  title?: string;
  eyebrow?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

function handleUpdate(value: boolean) {
  emit("update:open", value);
}
</script>

<template>
  <UModal :open="open" @update:open="handleUpdate">
    <template #header>
      <div>
        <p v-if="eyebrow" class="eyebrow" style="margin-bottom: 0.25rem">{{ eyebrow }}</p>
        <h3 class="heading--bold text-xl font-extrabold text-text-primary" style="margin: 0">
          {{ title }}
        </h3>
      </div>
    </template>

    <template #body>
      <slot />
    </template>

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UModal>
</template>
