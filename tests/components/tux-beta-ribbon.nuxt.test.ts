import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxBetaRibbon from "../../app/components/TuxBetaRibbon.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxBetaRibbon Component", () => {
  it("renders diagonal corner ribbon for preview environments", async () => {
    const wrapper = await mountSuspended(TuxBetaRibbon, {
      props: {
        variant: "corner",
        kind: "preview",
        corner: "top-right",
      },
    });

    const el = wrapper.find(".tux-beta-corner");
    expect(el.exists()).toBe(true);
    expect(el.classes()).toContain("tux-beta-corner--top-right");
    expect(el.classes()).toContain("tux-beta--preview");
    expect(el.text()).toContain("preview");
    expect(el.attributes("role")).toBe("note");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders horizontal stripe variant with custom message", async () => {
    const wrapper = await mountSuspended(TuxBetaRibbon, {
      props: {
        variant: "stripe",
        kind: "beta",
        message: "You are previewing the TUX 3.0 experimental research dashboard.",
      },
    });

    const el = wrapper.find(".tux-beta-stripe");
    expect(el.exists()).toBe(true);
    expect(el.classes()).toContain("tux-beta--beta");
    expect(el.text()).toContain("TUX 3.0 experimental research dashboard");
    expect(el.attributes("role")).toBe("note");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders inline pill variant", async () => {
    const wrapper = await mountSuspended(TuxBetaRibbon, {
      props: {
        variant: "pill",
        kind: "dev",
        label: "Sandbox",
      },
    });

    const el = wrapper.find(".tux-beta-pill");
    expect(el.exists()).toBe(true);
    expect(el.classes()).toContain("tux-beta--dev");
    expect(el.text()).toContain("Sandbox");
    expect(el.attributes("role")).toBe("note");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
