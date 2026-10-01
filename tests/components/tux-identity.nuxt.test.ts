import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxIdentity from "../../app/components/TuxIdentity.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxIdentity Component", () => {
  it("renders standard institutional lockup with name and logos", async () => {
    const wrapper = await mountSuspended(TuxIdentity, {
      props: {
        name: "Texas A&M Transportation Institute",
        level: "institution",
        orientation: "horizontal",
        kind: "lockup",
      },
    });

    expect(wrapper.classes()).toContain("tux-identity");
    expect(wrapper.classes()).toContain("tux-identity--horizontal");
    expect(wrapper.classes()).toContain("tux-identity--lockup");
    expect(wrapper.classes()).toContain("tux-identity--institution");
    expect(wrapper.text()).toContain("Texas A&M Transportation Institute");

    const logos = wrapper.findAll(".tux-identity__logo");
    expect(logos.length).toBe(2);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders center level with superhead and link wrapper", async () => {
    const wrapper = await mountSuspended(TuxIdentity, {
      props: {
        name: "Center for Transportation Safety",
        superhead: "Texas A&M Transportation Institute",
        level: "center",
        orientation: "stacked",
        href: "/safety",
      },
    });

    expect(wrapper.classes()).toContain("tux-identity--stacked");
    expect(wrapper.classes()).toContain("tux-identity--center");
    expect(wrapper.text()).toContain("Texas A&M Transportation Institute");
    expect(wrapper.text()).toContain("Center for Transportation Safety");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders text-only department level with hairline rule", async () => {
    const wrapper = await mountSuspended(TuxIdentity, {
      props: {
        name: "Information Technology Services",
        superhead: "Administration Division",
        level: "department",
        kind: "text",
      },
    });

    expect(wrapper.classes()).toContain("tux-identity--text");
    expect(wrapper.classes()).toContain("tux-identity--department");
    expect(wrapper.find(".tux-identity__rule").exists()).toBe(true);
    expect(wrapper.findAll(".tux-identity__logo").length).toBe(0);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
