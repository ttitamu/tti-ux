// useTuxSwipe — pointer/touch swipe detection on a target element.
//
// Captured from the Android UI Kit absorption (swipe-to-dismiss on
// list rows + nav drawer swipe-from-edge). Pure pointer events; works
// on Tauri Mobile, Tauri Desktop, and plain web.
//
// **Accessibility rule** (documented in design/platform-awareness.md):
// every swipe action MUST have a visible alternative — a button,
// link, or keyboard shortcut. Swipe-only is a screen-reader and
// keyboard trap. Don't ship swipe-only.
//
// Usage:
//
//   const el = ref<HTMLElement | null>(null);
//   useTuxSwipe(el, {
//     onSwipeLeft:  () => dismiss(),
//     onSwipeRight: () => reveal(),
//     threshold:    48,        // px, default 32
//     direction:    "horizontal", // | "vertical" | "any" (default "any")
//   });
//
// Swipe is fired on pointer-up if both:
//   - the gesture exceeded `threshold` px in the matching direction
//   - the gesture's primary axis matched the configured direction
//
// Honors `prefers-reduced-motion`: if the user has reduce-motion set,
// the swipe handler still fires (motion isn't the issue), but
// consuming components should respect reduce-motion when animating
// the response (e.g., snap-back vs slide-out).

import { onMounted, onBeforeUnmount, type Ref } from "vue";

export type SwipeDirection = "horizontal" | "vertical" | "any";

export interface TuxSwipeOptions {
  /** Fires when the swipe's net X displacement is < -threshold. */
  onSwipeLeft?: () => void;
  /** Fires when net X > +threshold. */
  onSwipeRight?: () => void;
  /** Fires when net Y < -threshold. */
  onSwipeUp?: () => void;
  /** Fires when net Y > +threshold. */
  onSwipeDown?: () => void;
  /** Min pixel displacement before a swipe registers. Default 32. */
  threshold?: number;
  /** Which axes to listen on. Default "any". */
  direction?: SwipeDirection;
  /** Cap the pointer-up time delta (ms). Above this, the gesture is
   *  treated as a drag, not a swipe. Default 600. */
  maxDuration?: number;
}

export function useTuxSwipe(
  target: Ref<HTMLElement | null>,
  opts: TuxSwipeOptions
) {
  const threshold = opts.threshold ?? 32;
  const direction = opts.direction ?? "any";
  const maxDuration = opts.maxDuration ?? 600;

  let startX = 0;
  let startY = 0;
  let startT = 0;
  let active = false;

  function onPointerDown(e: PointerEvent) {
    active = true;
    startX = e.clientX;
    startY = e.clientY;
    startT = performance.now();
  }

  function onPointerUp(e: PointerEvent) {
    if (!active) return;
    active = false;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const dt = performance.now() - startT;
    if (dt > maxDuration) return;

    const horizontal =
      Math.abs(dx) >= threshold && Math.abs(dx) > Math.abs(dy);
    const vertical =
      Math.abs(dy) >= threshold && Math.abs(dy) > Math.abs(dx);

    if ((direction === "horizontal" || direction === "any") && horizontal) {
      if (dx < 0) opts.onSwipeLeft?.();
      else opts.onSwipeRight?.();
    }
    if ((direction === "vertical" || direction === "any") && vertical) {
      if (dy < 0) opts.onSwipeUp?.();
      else opts.onSwipeDown?.();
    }
  }

  function onPointerCancel() {
    active = false;
  }

  onMounted(() => {
    const el = target.value;
    if (!el) return;
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerCancel);
  });

  onBeforeUnmount(() => {
    const el = target.value;
    if (!el) return;
    el.removeEventListener("pointerdown", onPointerDown);
    el.removeEventListener("pointerup", onPointerUp);
    el.removeEventListener("pointercancel", onPointerCancel);
  });
}
