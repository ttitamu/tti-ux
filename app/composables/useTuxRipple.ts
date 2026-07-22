// useTuxRipple — Material-style tap-feedback ripple on a target element.
//
// Captured from the Material 3 absorption as an **opt-in** affordance
// for `[data-platform="android"]` surfaces; not enabled globally on
// TuxButton or other interactive components. Use sparingly — TUX
// motion restraint applies.
//
// Pure DOM + CSS: appends a transient `<span>` overlay to the target
// element on pointer-down, animates a ring expansion from the click
// origin, then removes the span on animation-end. Respects
// `prefers-reduced-motion` (skips the animation, no-op).
//
// Usage:
//
//   const btn = ref<HTMLElement | null>(null);
//   useTuxRipple(btn, { color: "var(--brand-primary)" });
//
// The target element MUST have `position: relative` (or `absolute` /
// `sticky` / `fixed`) and `overflow: hidden`. The composable doesn't
// override these — the consumer's CSS is the source of truth so
// container shapes (pill vs square vs circle) work as expected.

import { onMounted, onBeforeUnmount, type Ref } from "vue";

export interface TuxRippleOptions {
  /** CSS color string for the ripple. Default rgba(255, 255, 255, 0.4). */
  color?: string;
  /** Animation duration in ms. Default 600. */
  duration?: number;
  /** Skip rendering if user has prefers-reduced-motion. Default true. */
  respectReducedMotion?: boolean;
}

export function useTuxRipple(
  target: Ref<HTMLElement | null>,
  opts: TuxRippleOptions = {}
) {
  const color = opts.color ?? "rgba(255, 255, 255, 0.4)";
  const duration = opts.duration ?? 600;
  const respectReducedMotion = opts.respectReducedMotion ?? true;

  function shouldSkip(): boolean {
    if (!respectReducedMotion || typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function onPointerDown(e: PointerEvent) {
    if (shouldSkip()) return;
    const el = target.value;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.style.position = "absolute";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.borderRadius = "50%";
    ripple.style.background = color;
    ripple.style.transform = "scale(0)";
    ripple.style.opacity = "0.6";
    ripple.style.pointerEvents = "none";
    ripple.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
    ripple.dataset.tuxRipple = "true";
    el.appendChild(ripple);

    // Force layout, then animate.
    void ripple.offsetWidth;
    ripple.style.transform = "scale(1)";
    ripple.style.opacity = "0";

    setTimeout(() => {
      ripple.remove();
    }, duration);
  }

  onMounted(() => {
    const el = target.value;
    if (!el) return;
    el.addEventListener("pointerdown", onPointerDown);
  });

  onBeforeUnmount(() => {
    const el = target.value;
    if (!el) return;
    el.removeEventListener("pointerdown", onPointerDown);
    // Best-effort cleanup of any in-flight ripples.
    el.querySelectorAll('[data-tux-ripple="true"]').forEach((n) => n.remove());
  });
}
