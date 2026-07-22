<script setup lang="ts">
/**
 * TuxFocusView — full-viewport overlay for inspecting one piece of
 * content without sidebar / navigation distraction.
 *
 * Absorbed from the Microsoft Teams UI Kit "Stage view" + "Lightbox
 * view" patterns. Use case for Landscape: "open this chart in focus
 * mode" — a chart-frame the researcher can pin full-screen with a
 * back button + title + optional actions, dismissing returns to the
 * original page.
 *
 * Lighter-weight than `TuxModal` — the focus view is content-led,
 * not dialog-led. No form submission, no confirm/cancel buttons by
 * convention; the only mandatory chrome is a back/close affordance.
 *
 * Behavior:
 *   - Renders into a teleport target at <body> end, with a backdrop
 *     above all other content.
 *   - Esc dismisses (emits `update:open`).
 *   - Click on backdrop dismisses (configurable via
 *     `dismissOnBackdropClick`).
 *   - Focus moves into the dialog on open; restored on close.
 *   - Reduced-motion: instant fade with no scale animation.
 *
 * Slots:
 *   #title     — title strip content (defaults to `props.title` text)
 *   #actions   — right-aligned action buttons in the top bar
 *   (default) — content of the focus surface
 */
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";

interface Props {
  /** Two-way bound; `v-model:open`. */
  open?: boolean;
  /** Title shown in the top bar (next to the back/close button). */
  title?: string;
  /** Optional eyebrow above the title. */
  eyebrow?: string;
  /** Click on backdrop dismisses? Default true. */
  dismissOnBackdropClick?: boolean;
  /** Esc key dismisses? Default true. */
  dismissOnEscape?: boolean;
  /** Label for the back / close button. Default "Close". */
  backLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  title: undefined,
  eyebrow: undefined,
  dismissOnBackdropClick: true,
  dismissOnEscape: true,
  backLabel: "Close",
});

const emit = defineEmits<{
  "update:open": [value: boolean];
  close: [];
}>();

const surface = ref<HTMLElement | null>(null);
const lastActive = ref<HTMLElement | null>(null);

function dismiss() {
  emit("update:open", false);
  emit("close");
}

function onBackdropClick(e: MouseEvent) {
  if (!props.dismissOnBackdropClick) return;
  // Dismiss only if the click was on the backdrop, not on the surface.
  if (e.target === e.currentTarget) dismiss();
}

function onKey(e: KeyboardEvent) {
  if (e.key === "Escape" && props.dismissOnEscape) {
    e.stopPropagation();
    dismiss();
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (typeof window === "undefined") return;
    if (isOpen) {
      lastActive.value = document.activeElement as HTMLElement | null;
      document.addEventListener("keydown", onKey);
      // Lock body scroll under the overlay.
      document.body.style.overflow = "hidden";
      await nextTick();
      surface.value?.focus();
    } else {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastActive.value?.focus();
    }
  }
);

onMounted(() => {
  if (props.open && typeof window !== "undefined") {
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
  }
});
onUnmounted(() => {
  if (typeof window === "undefined") return;
  document.removeEventListener("keydown", onKey);
  document.body.style.overflow = "";
});

const titleId = computed(() => `tux-focus-${Math.random().toString(36).slice(2, 9)}`);
</script>

<template>
  <Teleport to="body">
    <Transition name="tux-focus">
      <div
        v-if="open"
        class="tux-focus-view"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? titleId : undefined"
        @click="onBackdropClick"
      >
        <div ref="surface" class="tux-focus-view__surface" tabindex="-1">
          <header class="tux-focus-view__bar">
            <UButton
              variant="ghost"
              color="neutral"
              icon="lucide:arrow-left"
              :aria-label="backLabel"
              @click="dismiss"
            >
              {{ backLabel }}
            </UButton>
            <div class="tux-focus-view__title-stack">
              <slot name="title">
                <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
                <h2 v-if="title" :id="titleId" class="tux-focus-view__title">
                  {{ title }}
                </h2>
              </slot>
            </div>
            <div class="tux-focus-view__actions">
              <slot name="actions" />
            </div>
          </header>
          <div class="tux-focus-view__body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.tux-focus-view {
  position: fixed;
  inset: 0;
  z-index: 80;
  background: color-mix(in srgb, var(--surface-page) 92%, transparent);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  padding: max(1.5rem, env(safe-area-inset-top))
           max(1.5rem, env(safe-area-inset-right))
           max(1.5rem, env(safe-area-inset-bottom))
           max(1.5rem, env(safe-area-inset-left));
}

.tux-focus-view__surface {
  flex: 1;
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  min-height: 0;
  outline: none;
}

.tux-focus-view__bar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--surface-border);
  flex-shrink: 0;
}

.tux-focus-view__title-stack {
  text-align: center;
  min-width: 0;
}

.tux-focus-view__title {
  font-family: var(--font-display, var(--font-sans));
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tux-focus-view__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
}

.tux-focus-view__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 1.5rem;
}

@media (prefers-reduced-transparency: reduce) {
  .tux-focus-view {
    backdrop-filter: none;
    background: var(--surface-page);
  }
}

/* Transition */
.tux-focus-enter-active,
.tux-focus-leave-active {
  transition: opacity 180ms ease-out;
}
.tux-focus-enter-active .tux-focus-view__surface,
.tux-focus-leave-active .tux-focus-view__surface {
  transition: transform 180ms ease-out, opacity 180ms ease-out;
}
.tux-focus-enter-from,
.tux-focus-leave-to {
  opacity: 0;
}
.tux-focus-enter-from .tux-focus-view__surface,
.tux-focus-leave-to .tux-focus-view__surface {
  transform: scale(0.96);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .tux-focus-enter-active,
  .tux-focus-leave-active,
  .tux-focus-enter-active .tux-focus-view__surface,
  .tux-focus-leave-active .tux-focus-view__surface {
    transition: opacity 80ms ease-out;
    transform: none !important;
  }
}
</style>
