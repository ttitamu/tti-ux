<script setup lang="ts">
/**
 * TuxScrollTop — EmDash-inspired circular reading-progress scroll-to-top button.
 *
 * Direct EmDash CMS 1.0 architecture adapted for TUX:
 * - 48×48px physical geometry (WCAG 2.2 Level AAA touch target >=44px).
 * - Inset concentric reading progress gauge (r=20, stroke-width=2.5) nested cleanly
 *   within the white circular disc, matching Cloudflare's refined EmDash dial design.
 * - Precision Phosphor vector arrow, optically centered at (24, 24).
 * - Hardware-accelerated elevation (var(--elevation-overlay)) with zero software-raster artifacts.
 *
 * Accessibility (WCAG 2.2 Level AAA):
 * - Target size: 48×48px (exceeds >=44px AAA requirement).
 * - Full keyboard support (Enter / Space activation).
 * - High-contrast indicators (>=7:1 against surrounding surface).
 * - Respects prefers-reduced-motion for instant scroll when preferred.
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
const radius = 20;
const circumference = 2 * Math.PI * radius; // ~125.664

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
    <!-- Direct EmDash 1.0 Vector SVG Architecture -->
    <svg
      class="tux-scroll-top__svg tux-scroll-top__ring"
      viewBox="0 0 48 48"
      width="48"
      height="48"
      shape-rendering="geometricPrecision"
      aria-hidden="true"
    >
      <!-- Background track ring (inset dial) -->
      <circle
        class="tux-scroll-top__track"
        cx="24"
        cy="24"
        :r="radius"
        stroke-width="2.5"
      />

      <!-- Clockwise reading progress ring -->
      <circle
        class="tux-scroll-top__indicator"
        cx="24"
        cy="24"
        :r="radius"
        stroke-width="2.5"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        transform="rotate(-90 24 24)"
      />

      <!-- Precision EmDash Phosphor arrow icon -->
      <svg x="14" y="14" width="20" height="20" viewBox="0 0 256 256">
        <path
          class="tux-scroll-top__arrow"
          fill="currentColor"
          d="M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z"
        />
      </svg>
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
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, color 0.15s ease;
  user-select: none;
  outline: none;
}

.tux-scroll-top:hover {
  transform: translateY(-2px);
  box-shadow: var(--elevation-overlay);
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
  transform: translateY(0);
}

.tux-scroll-top--hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px);
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
  opacity: 0.9;
}

.tux-scroll-top__indicator {
  fill: none;
  stroke: var(--brand-primary);
  transition: stroke-dashoffset 0.15s linear;
}

[data-theme="tti-dark"] .tux-scroll-top__indicator {
  stroke: var(--brand-accent);
}

.tux-scroll-top__arrow {
  transition: transform 0.2s ease;
  transform-origin: 128px 128px;
}

.tux-scroll-top:hover .tux-scroll-top__arrow {
  transform: translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .tux-scroll-top,
  .tux-scroll-top__indicator,
  .tux-scroll-top__arrow {
    transition: none;
  }
}
</style>
