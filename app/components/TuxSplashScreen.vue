<script setup lang="ts">
/**
 * TuxSplashScreen — branded app-launch overlay for Tauri shells.
 *
 * Shown while the WebView mounts the Vue app and any first-paint data
 * loads. Covers the viewport with the TTI brand mark + maroon hairline
 * + optional status copy ("Loading data…"). Fades out when the host
 * app sets `loaded` to true.
 *
 * In plain-web builds this still works — useful for slow-loading
 * dashboard pages — but the more common path is Tauri, where the
 * splash bridges the "Tauri window appears" → "Vue app hydrates"
 * gap.
 *
 * Honors `prefers-reduced-motion`: no fade animation if requested.
 *
 * Slots:
 *   #brand     — replace the default brand-mark SVG with custom content.
 *   #status    — copy beneath the brand mark.
 *   #footer    — bottom strip (e.g., app version pill).
 */
import { computed, watch } from "vue";

interface Props {
  /** Show the splash. Bind via v-model:loaded as the inverse —
   *  `:loaded="appReady"` keeps the splash up until appReady flips true. */
  loaded?: boolean;
  /** Status text under the brand. Default "Loading…". */
  status?: string;
  /** Force-hide. Useful for testing in-isolation in a showcase. */
  hidden?: boolean;
  /** Delay (ms) to wait before fading after `loaded` flips true.
   *  Default 300ms — gives Tauri's window-show event time to settle. */
  fadeDelay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loaded: false,
  status: "Loading…",
  hidden: false,
  fadeDelay: 300,
});

const showSplash = ref(!props.hidden);

watch(
  () => props.loaded,
  (isLoaded) => {
    if (isLoaded) {
      setTimeout(() => {
        showSplash.value = false;
      }, props.fadeDelay);
    } else {
      showSplash.value = true;
    }
  },
  { immediate: true }
);

const ariaBusy = computed(() => (showSplash.value ? "true" : "false"));
</script>

<template>
  <Transition name="tux-splash">
    <div
      v-if="showSplash && !hidden"
      class="tux-splash-screen"
      role="status"
      :aria-busy="ariaBusy"
      aria-live="polite"
    >
      <div class="tux-splash-screen__mark">
        <slot name="brand">
          <!-- Default brand: TTI maroon wordmark + thin hairline. -->
          <p class="tux-splash-screen__wordmark">TTI</p>
          <p class="tux-splash-screen__subwordmark">
            Texas A&amp;M Transportation Institute
          </p>
          <div class="tux-splash-screen__rule" aria-hidden="true" />
        </slot>
      </div>
      <p class="tux-splash-screen__status">
        <slot name="status">{{ status }}</slot>
      </p>
      <div v-if="$slots.footer" class="tux-splash-screen__footer">
        <slot name="footer" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.tux-splash-screen {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: var(--surface-page);
  /* Safe-area-respecting in case a Tauri Mobile splash is invoked. */
  padding: env(safe-area-inset-top)
           env(safe-area-inset-right)
           env(safe-area-inset-bottom)
           env(safe-area-inset-left);
  text-align: center;
}

.tux-splash-screen__mark {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
}

.tux-splash-screen__wordmark {
  font-family: var(--font-display, var(--font-sans));
  font-size: 3rem;
  font-weight: 800;
  color: var(--brand-primary);
  letter-spacing: -0.02em;
  line-height: 1;
  margin: 0;
}

.tux-splash-screen__subwordmark {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
  margin: 0;
}

.tux-splash-screen__rule {
  width: 64px;
  height: 3px;
  background: var(--brand-accent);
  border-radius: 1.5px;
  margin-top: 0.25rem;
}

.tux-splash-screen__status {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

.tux-splash-screen__footer {
  position: absolute;
  bottom: max(1.5rem, env(safe-area-inset-bottom));
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Fade transition */
.tux-splash-enter-active,
.tux-splash-leave-active {
  transition: opacity 320ms ease-out;
}
.tux-splash-enter-from,
.tux-splash-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .tux-splash-enter-active,
  .tux-splash-leave-active {
    transition: opacity 80ms ease-out;
  }
}
</style>
