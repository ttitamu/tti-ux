<script setup lang="ts">
/**
 * TuxScrollTop — EmDash-inspired circular reading-progress scroll-to-top button.
 *
 * Tracks the current viewport scroll depth and renders a clockwise SVG radial
 * progress ring. Appears gracefully once scroll passes `threshold`, and smoothly
 * scrolls back to the top on click or keyboard activation.
 *
 * Hardware-Accelerated Hybrid CSS & Vector SVG Architecture:
 * - Native CSS circular surface with GPU box-shadow eliminates rasterization filter blur.
 * - Concentric SVG radial ring (r=22.75, stroke-width=2.5) perfectly aligns with the
 *   physical 48px circle boundary (22.75 + 1.25 = 24.0), eliminating double-borders,
 *   white halos, and subpixel stair-stepping across light, dark, and brand-colored surfaces.
 * - Locked center coordinates (24, 24) guarantee optical alignment on all displays.
 *
 * Accessibility (WCAG 2.2 Level AAA):
 * - Target size: 48×48px (exceeds >=44px AAA requirement).
 * - Full keyboard support (Enter / Space activation).
 * - High-contrast indicators (>=7:1 against surrounding surface).
 * - Respects `prefers-reduced-motion` for instant scroll when preferred.
 */

interface Props {
  /** Scroll distance in pixels before the button appears. */
  threshold?: number;
  /** Positioning mode.
   *  - bottom-right: standard fixed placement (bottom: 1.75rem, right: 1.75rem).
   *  - bottom-right-stacked: offset vertically (bottom: 5.5rem) to coexist with a floating chat bubble or assistant launcher.
   *  - bottom-left: fixed placement on the left corner.
   */
  position?: "bottom-right" | "bottom-right-stacked" | "bottom-left";
  /** Optional custom accessible label. */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 160,
  position: "bottom-right",
  ariaLabel: "Scroll to top of page",
});

const progress = ref(0);
const isVisible = ref(false);
const radius = 22.75;
const circumference = 2 * Math.PI * radius; // ~142.942

const dashOffset = computed(() => {
  const p = Math.min(100, Math.max(0, progress.value));
  return circumference * (1 - p / 100);
});

let rafId: number | null = null;

function updateScroll() {
  if (typeof window === "undefined") return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (docHeight > 0) {
    progress.value = Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)));
  } else {
    progress.value = 0;
  }

  isVisible.value = scrollTop > props.threshold;
}

function onScroll() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(updateScroll);
}

function scrollToTop() {
  if (typeof window === "undefined") return;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: 0,
    behavior: prefersReduced ? "auto" : "smooth",
  });
}

onMounted(() => {
  updateScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", onScroll);
    if (rafId) cancelAnimationFrame(rafId);
  }
});
</script>

<template>
  <button
    type="button"
    class="tux-scroll-top group"
    :class="[
      `tux-scroll-top--${position}`,
      isVisible ? 'tux-scroll-top--visible' : 'tux-scroll-top--hidden',
    ]"
    :aria-label="`${ariaLabel} (${progress}% read)`"
    :title="`Return to top (${progress}% read)`"
    :tabindex="isVisible ? 0 : -1"
    @click="scrollToTop"
  >
    <!-- Pure Vector SVG Component -->
    <svg
      class="tux-scroll-top__svg tux-scroll-top__ring"
      viewBox="0 0 48 48"
      width="48"
      height="48"
      shape-rendering="geometricPrecision"
      aria-hidden="true"
    >
      <!-- Background track ring -->
      <circle
        class="tux-scroll-top__track"
        cx="24"
        cy="24"
        :r="radius"
      />

      <!-- Clockwise reading progress ring -->
      <circle
        class="tux-scroll-top__indicator"
        cx="24"
        cy="24"
        :r="radius"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        transform="rotate(-90 24 24)"
      />

      <!-- Optically centered crisp vector arrow -->
      <g
        class="tux-scroll-top__arrow"
        stroke="currentColor"
        stroke-width="2.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="24" y1="16.5" x2="24" y2="31.5" />
        <polyline points="17.5 22.5, 24 16.5, 30.5 22.5" fill="none" />
      </g>
    </svg>
  </button>
</template>

<style scoped>
.tux-scroll-top {
  position: fixed;
  z-index: 45;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: var(--surface-raised);
  box-shadow: var(--elevation-overlay);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, color 0.15s ease, background-color 0.15s ease;
  user-select: none;
  outline: none;
}

.tux-scroll-top:hover {
  transform: translateY(-2px);
  background: var(--surface-sunken);
  color: var(--brand-primary);
  box-shadow: var(--elevation-overlay);
}

[data-theme="tti-dark"] .tux-scroll-top:hover {
  color: var(--brand-accent);
}

.tux-scroll-top:active {
  transform: translateY(0);
  box-shadow: var(--elevation-hover);
}

.tux-scroll-top:focus-visible {
  outline: 2px solid var(--brand-primary);
  outline-offset: 3px;
}

[data-theme="tti-dark"] .tux-scroll-top:focus-visible {
  outline-color: var(--brand-accent);
}

/* Placements */
.tux-scroll-top--bottom-right {
  bottom: var(--tux-scroll-top-bottom, 1.75rem);
  right: var(--tux-scroll-top-right, 1.75rem);
}

.tux-scroll-top--bottom-right-stacked {
  bottom: var(--tux-scroll-top-bottom, 5.5rem);
  right: var(--tux-scroll-top-right, 1.75rem);
}

.tux-scroll-top--bottom-left {
  bottom: var(--tux-scroll-top-bottom, 1.75rem);
  left: var(--tux-scroll-top-left, 1.75rem);
}

/* Visibility transitions */
.tux-scroll-top--visible {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1);
}

.tux-scroll-top--hidden {
  opacity: 0;
  pointer-events: none;
  transform: scale(0.8) translateY(12px);
}

/* SVG Vector Elements */
.tux-scroll-top__svg {
  display: block;
  width: 48px;
  height: 48px;
  overflow: visible;
}

.tux-scroll-top__track {
  fill: none;
  stroke: var(--surface-border);
  stroke-width: 2.5;
  opacity: 0.9;
}

.tux-scroll-top__indicator {
  fill: none;
  stroke: var(--brand-primary);
  stroke-width: 2.5;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.1s linear;
}

[data-theme="tti-dark"] .tux-scroll-top__indicator {
  stroke: var(--brand-accent);
}

.tux-scroll-top__arrow {
  transition: transform 0.2s ease;
  transform-origin: 24px 24px;
}

.tux-scroll-top:hover .tux-scroll-top__arrow {
  transform: translateY(-1.5px);
}

@media (prefers-reduced-motion: reduce) {
  .tux-scroll-top {
    transition: none;
  }
  .tux-scroll-top__indicator {
    transition: none;
  }
  .tux-scroll-top__arrow {
    transition: none;
  }
}
</style>
