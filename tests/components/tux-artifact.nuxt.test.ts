import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArtifact from "../../app/components/TuxArtifact.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxArtifact Component", () => {
  it("renders artifact header, metadata, action buttons, and slot content", async () => {
    const wrapper = await mountSuspended(TuxArtifact, {
      props: {
        title: "corridor_optimization.py",
        meta: "Generated 2 minutes ago · 48 lines",
        actions: ["copy", "download"],
      },
      slots: {
        default: () => "def optimize_signals(detector_rates): return True",
      },
    });

    expect(wrapper.classes()).toContain("tux-artifact");
    expect(wrapper.find(".tux-artifact__title").text()).toBe("corridor_optimization.py");
    expect(wrapper.find(".tux-artifact__meta").text()).toContain("Generated 2 minutes ago");
    expect(wrapper.find(".tux-artifact__body").text()).toContain("def optimize_signals");

    const actionBtns = wrapper.findAll(".tux-artifact__action");
    expect(actionBtns.length).toBe(2);

    await actionBtns[0].trigger("click");
    expect(wrapper.emitted("copy")).toHaveLength(1);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("handles busy state on actions", async () => {
    const wrapper = await mountSuspended(TuxArtifact, {
      props: {
        title: "Dataset Export",
        busy: true,
        actions: ["regenerate"],
      },
    });

    const btn = wrapper.find(".tux-artifact__action");
    expect(btn.attributes("disabled")).toBeDefined();
  });
});
