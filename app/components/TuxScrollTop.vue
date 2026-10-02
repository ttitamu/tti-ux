<script setup lang="ts">
/**
 * TuxScrollTop — EmDash-inspired circular reading-progress scroll-to-top button.
 *
 * Tracks the current viewport scroll depth and renders a clockwise SVG radial
 * progress ring. Appears gracefully once scroll passes `threshold`, and smoothly
 * scrolls back to the top on click or keyboard activation.
 *
 * 100% Vector SVG Architecture:
 * - Unified concentric SVG geometry eliminates subpixel rasterization, double borders, and blur.
 * - Mathematically locked center coordinates (24, 24) guarantee optical alignment on all displays.
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
const radius = 21;
const circumference = 2 * Math.PI * radius; // ~131.947

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
      aria-hidden="true"
    >
      <defs>
        <filter id="tux-scroll-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="black" flood-opacity="0.32" />
        </filter>
      </defs>

      <!-- Background filled surface disc with SVG drop shadow -->
      <circle
        class="tux-scroll-top__bg"
        cx="24"
        cy="24"
        :r="radius"
        filter="url(#tux-scroll-shadow)"
      />

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
  border-radius: 9999px;
  border: none;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.15s ease;
  user-select: none;
  outline: none;
}

.tux-scroll-top:hover {
  transform: translateY(-2px);
  color: var(--brand-primary);
}

[data-theme="tti-dark"] .tux-scroll-top:hover {
  color: var(--brand-accent);
}

.tux-scroll-top:active {
  transform: translateY(0);
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
  overflow: visible;
}

.tux-scroll-top__bg {
  fill: var(--surface-raised);
  transition: fill 0.15s ease;
}

.tux-scroll-top:hover .tux-scroll-top__bg {
  fill: var(--surface-sunken);
}

.tux-scroll-top__track {
  fill: none;
  stroke: var(--surface-border);
  stroke-width: 2.5;
  opacity: 0.8;
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
