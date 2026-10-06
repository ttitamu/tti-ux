import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxPortalHeader from "~/components/TuxPortalHeader.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxPortalHeader Component", () => {
  const sampleNavItems = [
    { label: "Corridors", to: "/corridors" },
    {
      label: "Research",
      children: [
        { label: "Connected Vehicles", to: "/research/cav", description: "V2X and roadside infrastructure" },
        { label: "Freight Modeling", to: "/research/freight", description: "Statewide commercial freight tracking" },
      ],
    },
  ];

  it("renders two-tier institutional header and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxPortalHeader, {
      props: {
        portalTitle: "Connected Infrastructure Portal",
        portalBadge: "Lab Suite",
        navItems: sampleNavItems,
        actionText: "Access Portal",
      },
    });

    expect(wrapper.text()).toContain("Texas A&M Transportation Institute");
    expect(wrapper.text()).toContain("Connected Infrastructure Portal");
    expect(wrapper.text()).toContain("Lab Suite");
    expect(wrapper.text()).toContain("Corridors");
    expect(wrapper.text()).toContain("Access Portal");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("emits search-click and action-click events", async () => {
    const wrapper = await mountSuspended(TuxPortalHeader, {
      props: {
        portalTitle: "Traffic Operations Center",
        actionText: "Request Clearance",
      },
    });

    const searchBtn = wrapper.find(".tux-portal-header__search-btn");
    expect(searchBtn.exists()).toBe(true);
    await searchBtn.trigger("click");
    expect(wrapper.emitted("search-click")).toBeTruthy();

    const actionBtn = wrapper.findAll("button").find(b => b.text().includes("Request Clearance"));
    expect(actionBtn).toBeDefined();
    await actionBtn!.trigger("click");
    expect(wrapper.emitted("action-click")).toBeTruthy();

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders intranet mode with charcoal bar, MY APPS launcher, and spectrum ribbon", async () => {
    const wrapper = await mountSuspended(TuxPortalHeader, {
      props: {
        mode: "intranet",
        portalTitle: "MyTTI Intranet",
      },
    });

    // Charcoal bar and MY APPS
    expect(wrapper.find(".tux-portal-header__utility").classes()).toContain("bg-neutral-900");
    const myAppsBtn = wrapper.find(".tux-portal-header__my-apps-btn");
    expect(myAppsBtn.exists()).toBe(true);
    expect(myAppsBtn.text()).toContain("MY APPS");

    // Spectrum ribbon presence
    const ribbon = wrapper.find(".tux-portal-header__spectrum-ribbon");
    expect(ribbon.exists()).toBe(true);

    // Toggle MY APPS launcher
    await myAppsBtn.trigger("click");
    expect(wrapper.text()).toContain("TTI Internal Apps");
    expect(wrapper.text()).toContain("App Catalog");
    expect(wrapper.text()).toContain("People Finder");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
