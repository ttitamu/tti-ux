<script setup lang="ts">
/**
 * TuxFAB — Floating Action Button.
 *
 * Material-pattern bottom-right anchored primary action. Use sparingly:
 * exactly one FAB per screen, for the single "create new" action.
 * Multiple FABs or FABs for secondary actions break the convention.
 *
 * Anchored to bottom-right of the **nearest positioned ancestor** (use
 * a `position: relative` page wrapper) or to the viewport if there
 * isn't one. Respects `env(safe-area-inset-*)` so it stays clear of
 * the iOS home indicator + Android gesture nav + Tauri-mobile
 * status / nav bars.
 *
 * Three modes:
 *   - **Icon-only** (default, smaller) — circular 56px button with
 *     centered icon.
 *   - **Extended** (`extended` prop) — pill with icon + label.
 *   - **Mini** (`size="sm"`) — 40px for compact surfaces.
 *
 * Slots:
 *   (default) — label text for the extended form
 */
interface Props {
  /** Lucide icon name. */
  icon: string;
  /** Show the label next to the icon (pill shape). */
  extended?: boolean;
  /** Size variant. Default md. */
  size?: "sm" | "md";
  /** Override anchor side. Default 'right'. */
  side?: "left" | "right";
  /** Aria-label. Required if no default-slot label. */
  ariaLabel?: string;
  /** Disable the button. */
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  extended: false,
  size: "md",
  side: "right",
  ariaLabel: undefined,
  disabled: false,
});

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <button
    type="button"
    class="tux-fab"
    :class="[
      `tux-fab--${size}`,
      `tux-fab--side-${side}`,
      { 'tux-fab--extended': extended },
    ]"
    :disabled="disabled"
    :aria-label="ariaLabel || (extended ? undefined : 'Floating action')"
    @click="$emit('click', $event)"
  >
    <Icon :name="icon" :size="size === 'sm' ? 18 : 22" />
    <span v-if="extended" class="tux-fab__label">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.tux-fab {
  position: fixed;
  bottom: calc(1rem + env(safe-area-inset-bottom));
  z-index: 60;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--brand-primary);
  color: var(--text-inverse, #fff);
  border: 0;
  cursor: pointer;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 6px 16px rgb(0 0 0 / 0.18),
              0 2px 4px rgb(0 0 0 / 0.08);
  transition: transform 120ms ease-out, box-shadow 120ms ease-out;
}

.tux-fab--side-right { right: calc(1rem + env(safe-area-inset-right)); }
.tux-fab--side-left  { left:  calc(1rem + env(safe-area-inset-left));  }

.tux-fab--md {
  width: 56px;
  height: 56px;
  border-radius: 50%;
}

.tux-fab--sm {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.tux-fab--extended {
  width: auto;
  padding: 0 1.25rem;
  height: 48px;
  border-radius: 24px;
}

.tux-fab:hover:not([disabled]) {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgb(0 0 0 / 0.22),
              0 3px 6px rgb(0 0 0 / 0.1);
}

.tux-fab:active:not([disabled]) {
  transform: translateY(0);
}

.tux-fab:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.tux-fab__label {
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .tux-fab {
    transition: none;
  }
  .tux-fab:hover {
    transform: none;
  }
}
</style>
