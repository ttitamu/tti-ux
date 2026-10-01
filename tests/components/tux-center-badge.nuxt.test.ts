import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxCenterBadge from "../../app/components/TuxCenterBadge.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxCenterBadge Component", () => {
  it("renders canonical division badge with icon and label", async () => {
    const wrapper = await mountSuspended(TuxCenterBadge, {
      props: {
        center: "safety",
        size: "md",
        layout: "chip",
      },
    });

    expect(wrapper.classes()).toContain("tux-center-badge");
    expect(wrapper.classes()).toContain("tux-center-badge--md");
    expect(wrapper.classes()).toContain("tux-center-badge--chip");
    expect(wrapper.find(".tux-center-badge__label").text()).toBe("Roadway Safety Division");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders short label variant and custom center", async () => {
    const wrapperShort = await mountSuspended(TuxCenterBadge, {
      props: {
        center: "mobility",
        short: true,
      },
    });
    expect(wrapperShort.find(".tux-center-badge__label").text()).toBe("Mobility");

    const wrapperCustom = await mountSuspended(TuxCenterBadge, {
      props: {
        center: "custom",
        label: "Connected Fleet Proving Grounds",
      },
    });
    expect(wrapperCustom.find(".tux-center-badge__label").text()).toBe("Connected Fleet Proving Grounds");

    const violations = await runComponentAxe(wrapperShort.element);
    expect(violations).toEqual([]);
  });
});
