import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxAvatar from "../../app/components/TuxAvatar.vue";

describe("TuxAvatar Component", () => {
  it("derives initials from name and passes axe accessibility audit", async () => {
    const wrapper = await mountSuspended(TuxAvatar, {
      props: {
        name: "Gregory Winfree",
        size: "md",
        decorative: true,
      },
    });

    expect(wrapper.text()).toContain("GW");
    expect(wrapper.classes()).toContain("tux-avatar--md");
    expect(wrapper.attributes("aria-hidden")).toBe("true");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports explicit initials override", async () => {
    const wrapper = await mountSuspended(TuxAvatar, {
      props: {
        name: "Texas A&M Transportation Institute",
        initials: "TTI",
      },
    });

    expect(wrapper.text()).toContain("TTI");
  });

  it("renders status dot indicator with semantic tone", async () => {
    const wrapper = await mountSuspended(TuxAvatar, {
      props: {
        name: "Test Researcher",
        dot: "success",
      },
    });

    const dot = wrapper.find(".tux-avatar__dot");
    expect(dot.exists()).toBe(true);
    expect(dot.classes()).toContain("tux-avatar__dot--success");
  });

  it("supports non-decorative mode with alt label", async () => {
    const wrapper = await mountSuspended(TuxAvatar, {
      props: {
        name: "Beverly Kuhn",
        decorative: false,
        alt: "Profile photo of Dr. Beverly Kuhn",
      },
    });

    expect(wrapper.attributes("aria-label")).toBe("Profile photo of Dr. Beverly Kuhn");
    expect(wrapper.attributes("role")).toBe("img");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
