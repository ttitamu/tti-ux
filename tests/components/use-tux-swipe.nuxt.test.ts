import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h, ref } from "vue";
import { useTuxSwipe } from "~/composables/useTuxSwipe";
import { runComponentAxe } from "../axe-helper";

describe("useTuxSwipe Composable", () => {
  it("detects horizontal swipe gestures and triggers directional callbacks", async () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();

    const TestComponent = defineComponent({
      setup() {
        const rowRef = ref<HTMLDivElement | null>(null);
        useTuxSwipe(rowRef, {
          onSwipeLeft,
          onSwipeRight,
          threshold: 20,
          direction: "horizontal",
        });
        return { rowRef };
      },
      render() {
        return h(
          "div",
          {
            ref: "rowRef",
            class: "swipeable-row",
            role: "region",
            "aria-label": "Telemetry Row",
          },
          [
            h("span", {}, "Swipeable Incident Record"),
            h("button", { type: "button", "aria-label": "Dismiss Incident" }, "Dismiss"),
          ]
        );
      },
    });

    const wrapper = await mountSuspended(TestComponent);
    const row = wrapper.find(".swipeable-row");
    expect(row.exists()).toBe(true);

    // Simulate swipe left: pointerdown at 100, pointerup at 40 (dx = -60)
    const el = row.element;
    el.dispatchEvent(new PointerEvent("pointerdown", { clientX: 100, clientY: 50, bubbles: true }));
    el.dispatchEvent(new PointerEvent("pointerup", { clientX: 40, clientY: 50, bubbles: true }));

    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
    expect(onSwipeRight).not.toHaveBeenCalled();

    // Simulate swipe right: pointerdown at 50, pointerup at 120 (dx = +70)
    el.dispatchEvent(new PointerEvent("pointerdown", { clientX: 50, clientY: 50, bubbles: true }));
    el.dispatchEvent(new PointerEvent("pointerup", { clientX: 120, clientY: 50, bubbles: true }));

    expect(onSwipeRight).toHaveBeenCalledTimes(1);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("ignores gestures under threshold", async () => {
    const onSwipeLeft = vi.fn();

    const TestComponent = defineComponent({
      setup() {
        const rowRef = ref<HTMLDivElement | null>(null);
        useTuxSwipe(rowRef, {
          onSwipeLeft,
          threshold: 40,
        });
        return { rowRef };
      },
      render() {
        return h("div", { ref: "rowRef", "aria-label": "Swipe Area" }, "Content");
      },
    });

    const wrapper = await mountSuspended(TestComponent);
    const row = wrapper.find("div");

    // Gesture with dx = -10 (under 40 threshold)
    const el = row.element;
    el.dispatchEvent(new PointerEvent("pointerdown", { clientX: 50, clientY: 50, bubbles: true }));
    el.dispatchEvent(new PointerEvent("pointerup", { clientX: 40, clientY: 50, bubbles: true }));

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });
});
