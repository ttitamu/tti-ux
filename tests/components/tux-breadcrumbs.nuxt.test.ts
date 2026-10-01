import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxBreadcrumbs from "../../app/components/TuxBreadcrumbs.vue";

describe("TuxBreadcrumbs Component", () => {
  const sampleTrail = [
    { label: "Home", to: "/" },
    { label: "Research", to: "/research" },
    { label: "Connected Infrastructure" },
  ];

  it("renders accessible navigation landmark with breadcrumb list", async () => {
    const wrapper = await mountSuspended(TuxBreadcrumbs, {
      props: {
        trail: sampleTrail,
      },
    });

    const nav = wrapper.find("nav.tux-breadcrumbs");
    expect(nav.exists()).toBe(true);
    expect(nav.attributes("aria-label")).toBe("Breadcrumb");

    const items = wrapper.findAll("li.tux-breadcrumbs__item");
    expect(items.length).toBe(3);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("marks the final crumb with aria-current='page' and renders as text rather than a link", async () => {
    const wrapper = await mountSuspended(TuxBreadcrumbs, {
      props: {
        trail: sampleTrail,
      },
    });

    const current = wrapper.find(".tux-breadcrumbs__current");
    expect(current.exists()).toBe(true);
    expect(current.attributes("aria-current")).toBe("page");
    expect(current.text()).toBe("Connected Infrastructure");
    expect(current.element.tagName.toLowerCase()).toBe("span");
  });

  it("renders home icon on the first crumb and supports chevron separator override", async () => {
    const wrapper = await mountSuspended(TuxBreadcrumbs, {
      props: {
        trail: sampleTrail,
        homeIcon: true,
        chevron: true,
      },
    });

    expect(wrapper.classes()).toContain("tux-breadcrumbs--chevron");
    expect(wrapper.find(".tux-breadcrumbs__home").exists()).toBe(true);
  });

  it("supports custom ariaLabel for multiple landmark disambiguation", async () => {
    const wrapper = await mountSuspended(TuxBreadcrumbs, {
      props: {
        trail: sampleTrail,
        ariaLabel: "Project Secondary Navigation",
      },
    });

    expect(wrapper.find("nav").attributes("aria-label")).toBe("Project Secondary Navigation");
  });
});
