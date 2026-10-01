import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxKbd from "../../app/components/TuxKbd.vue";

describe("TuxKbd Component", () => {
  it("renders single key with uppercase formatting and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxKbd, {
      props: {
        value: "k",
      },
    });

    expect(wrapper.classes()).toContain("tux-kbd-group");
    expect(wrapper.classes()).toContain("tux-kbd-group--sm");
    expect(wrapper.find("kbd").text()).toBe("K");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders multi-key combo with separator", async () => {
    const wrapper = await mountSuspended(TuxKbd, {
      props: {
        keys: ["ctrl", "shift", "p"],
        separator: "+",
        size: "lg",
      },
    });

    expect(wrapper.classes()).toContain("tux-kbd-group--lg");
    const kbds = wrapper.findAll("kbd");
    expect(kbds.length).toBe(3);
    const seps = wrapper.findAll(".tux-kbd-sep");
    expect(seps.length).toBe(2);
    expect(seps[0].text()).toBe("+");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders slot content when neither value nor keys are provided", async () => {
    const wrapper = await mountSuspended(TuxKbd, {
      props: {
        size: "xs",
      },
      slots: {
        default: () => "?",
      },
    });

    expect(wrapper.classes()).toContain("tux-kbd-group--xs");
    expect(wrapper.find("kbd").text()).toBe("?");
  });
});
