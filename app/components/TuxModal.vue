<script setup lang="ts">
/**
 * TuxModal — UModal with TTI flavor + platform-aware variant.
 *
 * Nuxt UI's UModal gives us the heavy lifting (scrim, focus trap, body
 * scroll lock, Escape to close). This wrapper adds:
 *   - optional eyebrow above the title (editorial rhythm)
 *   - gold-bar underline on the title (tux signature)
 *   - title uses the `heading--bold` utility
 *   - `size` prop for predictable max-width (sm→3xl)
 *   - `variant` for platform-aware presentation:
 *       - "standard" — centered dialog with scale-in (default desktop)
 *       - "sheet"    — bottom-anchored sheet with drag handle (mobile)
 *       - "auto"     — picks `sheet` on iOS/Android, `standard` elsewhere
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
 *
 * The sheet variant is absorbed from iOS / Material 3 mobile patterns
 * (bottom-anchored, drag-handle pill, rounded top corners only). On
 * desktop / web, sheets still work but standard centered modals read
 * better.
 */
import { computed } from "vue";

interface Props {
  open?: boolean;
  title?: string;
  eyebrow?: string;
  /**
   * Max-width of the modal content (standard variant only). Maps to a
   * Tailwind `max-w-*` class:
   *   - "sm"  → 24rem  (~384px)  — tight confirmations
   *   - "md"  → 28rem  (~448px)  — short forms
   *   - "lg"  → 32rem  (~512px)  — Nuxt UI default
   *   - "xl"  → 36rem  (~576px)
   *   - "2xl" → 42rem  (~672px)  — multi-section panels (Settings)
   *   - "3xl" → 48rem  (~768px)  — dense tables / wizards
   * Leave undefined to inherit UModal's default ("lg").
   */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  /**
   * Presentation variant. "auto" picks sheet on iOS/Android,
   * standard elsewhere. Default "standard" — most consumers want
   * a predictable shape across hosts.
   */
  variant?: "standard" | "sheet" | "auto";
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  title: undefined,
  eyebrow: undefined,
  size: undefined,
  variant: "standard",
});

const platform = useTuxPlatform();

const resolvedVariant = computed<"standard" | "sheet">(() => {
  if (props.variant === "sheet") return "sheet";
  if (props.variant === "auto") {
    return platform.value.os === "ios" || platform.value.os === "android"
      ? "sheet"
      : "standard";
  }
  return "standard";
});

const sizeClass = computed(() => {
  if (resolvedVariant.value === "sheet") return undefined;
  switch (props.size) {
    case "sm": return "sm:max-w-sm";
    case "md": return "sm:max-w-md";
    case "lg": return "sm:max-w-lg";
    case "xl": return "sm:max-w-xl";
    case "2xl": return "sm:max-w-2xl";
    case "3xl": return "sm:max-w-3xl";
    default: return undefined; // UModal default
  }
});

// Sheet variant UI overrides — bottom-anchored, rounded-top corners,
// full-width, drag-handle pill.
const sheetUi = computed(() => {
  if (resolvedVariant.value !== "sheet") return undefined;
  return {
    overlay: "items-end sm:items-end",
    content:
      "w-full max-w-none sm:max-w-2xl rounded-t-xl rounded-b-none translate-y-0 sm:translate-y-0",
  } as const;
});

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

function handleUpdate(value: boolean) {
  emit("update:open", value);
}
</script>

<template>
  <UModal
    :open="open"
    :ui="sheetUi || (sizeClass ? { content: sizeClass } : undefined)"
    @update:open="handleUpdate"
  >
    <template #header>
      <div>
        <!-- Sheet variant gets a drag-handle pill above the title.
             Visual only — the real dismiss interaction is the
             backdrop click + Escape that UModal already provides. -->
        <div
          v-if="resolvedVariant === 'sheet'"
          class="tux-modal__sheet-handle"
          aria-hidden="true"
        />
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

<style scoped>
.tux-modal__sheet-handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--surface-border);
  margin: 0 auto 0.75rem auto;
}
</style>
