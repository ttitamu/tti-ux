import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxSiteNav from "~/components/TuxSiteNav.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxSiteNav Component", () => {
  it("renders institutional identity, primary navigation links, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxSiteNav, {
      props: {
        identity: {
          name: "Texas A&M Transportation Institute",
          level: "institution",
        },
        primaryNav: [
          { label: "Research", to: "/research" },
          { label: "Divisions", to: "/divisions" },
          { label: "Facilities", to: "/facilities" },
        ],
        ariaLabel: "Primary site navigation",
      },
    });

    expect(wrapper.classes()).toContain("tux-site-nav");
    expect(wrapper.text()).toContain("Texas A&M Transportation Institute");

    const nav = wrapper.find("nav.tux-site-nav__primary");
    expect(nav.exists()).toBe(true);
    expect(nav.attributes("aria-label")).toBe("Primary site navigation");

    expect(wrapper.text()).toContain("Research");
    expect(wrapper.text()).toContain("Divisions");
    expect(wrapper.text()).toContain("Facilities");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders utility bar, search trigger, and supports mobile toggle", async () => {
    const wrapper = await mountSuspended(TuxSiteNav, {
      props: {
        identity: {
          name: "TTI Center for Transportation Safety",
        },
        utilityNav: [
          { label: "Jobs", to: "/jobs" },
          { label: "Contact", to: "/contact" },
        ],
        search: true,
      },
    });

    expect(wrapper.find(".tux-site-nav__utility").exists()).toBe(true);
    expect(wrapper.text()).toContain("Jobs");
    expect(wrapper.text()).toContain("Contact");

    const searchBtn = wrapper.find("button.tux-site-nav__search-trigger");
    expect(searchBtn.exists()).toBe(true);
    await searchBtn.trigger("click");
    expect(wrapper.emitted("search:open")).toBeTruthy();

    const mobileToggle = wrapper.find("button.tux-site-nav__mobile-toggle");
    expect(mobileToggle.exists()).toBe(true);
    expect(mobileToggle.attributes("aria-expanded")).toBe("false");
    await mobileToggle.trigger("click");
    expect(mobileToggle.attributes("aria-expanded")).toBe("true");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
