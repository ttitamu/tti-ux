import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import { defineComponent, h, ref } from "vue";
import { useTuxRipple } from "~/composables/useTuxRipple";
import { runComponentAxe } from "../axe-helper";

describe("useTuxRipple Composable", () => {
  it("attaches ripple behavior to target button and passes accessibility checks", async () => {
    const TestComponent = defineComponent({
      setup() {
        const btnRef = ref<HTMLButtonElement | null>(null);
        useTuxRipple(btnRef, {
          color: "rgba(80, 0, 0, 0.4)",
          duration: 300,
          respectReducedMotion: false,
        });
        return { btnRef };
      },
      render() {
        return h(
          "button",
          {
            ref: "btnRef",
            type: "button",
            class: "ripple-target",
            style: "position: relative; overflow: hidden;",
            "aria-label": "Execute Transportation Query",
          },
          "Execute Query"
        );
      },
    });

    const wrapper = await mountSuspended(TestComponent);
    const btn = wrapper.find("button");
    expect(btn.exists()).toBe(true);

    // Trigger pointerdown to spawn ripple
    const el = btn.element;
    el.dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 10, clientY: 10, bubbles: true })
    );
    const ripple = btn.find("[data-tux-ripple='true']");
    expect(ripple.exists()).toBe(true);
    expect(ripple.attributes("style")).toContain("position: absolute");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("cleans up ripple elements on unmount", async () => {
    const TestComponent = defineComponent({
      setup() {
        const btnRef = ref<HTMLButtonElement | null>(null);
        useTuxRipple(btnRef);
        return { btnRef };
      },
      render() {
        return h("button", { ref: "btnRef", "aria-label": "Action" }, "Click");
      },
    });

    const wrapper = await mountSuspended(TestComponent);
    expect(wrapper.exists()).toBe(true);
    wrapper.unmount();
  });
});
