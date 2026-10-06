import { describe, expect, it } from "vitest";
import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxPortalHeader from "../../app/components/TuxPortalHeader.vue";
import TuxPortalShell from "../../app/components/TuxPortalShell.vue";

const sampleNav = [
  {
    label: "Research",
    children: [
      { label: "Connected Infrastructure", to: "/tokens" },
      { label: "Automated Fleets", to: "/typography" },
    ],
  },
  { label: "Data", to: "/components" },
  { label: "About", to: "/design/tux" },
];

const sampleBreadcrumbs = [
  { label: "TTI Portals", to: "/" },
  { label: "Mobility Division", to: "/tokens" },
  { label: "Connected Corridors" },
];

describe("TuxPortalHeader Component", () => {
  it("renders Tier 1 utility bar with agency name and default utility links", async () => {
    const wrapper = await mountSuspended(TuxPortalHeader, {
      props: {
        agencyName: "Texas A&M Transportation Institute",
        portalTitle: "Connected Corridors Initiative",
        navItems: sampleNav,
      },
    });

    expect(wrapper.text()).toContain("Texas A&M Transportation Institute");
    expect(wrapper.text()).toContain("Jobs");
    expect(wrapper.text()).toContain("Pressroom");
    expect(wrapper.text()).toContain("Directory");
    expect(wrapper.text()).toContain("Contact");
  });

  it("renders Tier 2 brand bar with portal title and badge", async () => {
    const wrapper = await mountSuspended(TuxPortalHeader, {
      props: {
        portalTitle: "Crash Records Information System",
        portalBadge: "Lab Portal",
        navItems: sampleNav,
      },
    });

    expect(wrapper.text()).toContain("Crash Records Information System");
    expect(wrapper.text()).toContain("Lab Portal");
    expect(wrapper.text()).toContain("Research");
    expect(wrapper.text()).toContain("Data");
  });

  it("emits search-click when search button is clicked", async () => {
    const wrapper = await mountSuspended(TuxPortalHeader, {
      props: {
        showSearch: true,
      },
    });

    const searchBtn = wrapper.find(".tux-portal-header__search-btn");
    expect(searchBtn.exists()).toBe(true);

    await searchBtn.trigger("click");
    expect(wrapper.emitted("search-click")).toBeTruthy();
    expect(wrapper.emitted("search-click")?.length).toBe(1);
  });

  it("emits action-click when action CTA button is clicked", async () => {
    const wrapper = await mountSuspended(TuxPortalHeader, {
      props: {
        actionText: "Launch Console",
      },
    });

    expect(wrapper.text()).toContain("Launch Console");
    const actionBtn = wrapper.findAll("button").find(b => b.text().includes("Launch Console"));
    expect(actionBtn?.exists()).toBe(true);

    await actionBtn?.trigger("click");
    expect(wrapper.emitted("action-click")).toBeTruthy();
  });

  it("toggles dropdown when a nav item with children is clicked", async () => {
    const wrapper = await mountSuspended(TuxPortalHeader, {
      props: {
        navItems: sampleNav,
      },
    });

    const dropdownTrigger = wrapper.find(".tux-portal-nav__trigger");
    expect(dropdownTrigger.exists()).toBe(true);
    expect(dropdownTrigger.text()).toContain("Research");

    // Initially dropdown menu is hidden (v-show false)
    const dropdown = wrapper.find(".tux-portal-nav__dropdown");
    expect(dropdown.attributes("style")).toContain("display: none");

    // Click to open
    await dropdownTrigger.trigger("click");
    expect(dropdown.attributes("style") || "").not.toContain("display: none");
    expect(dropdown.text()).toContain("Connected Infrastructure");
    expect(dropdown.text()).toContain("Automated Fleets");

    // Click again to close
    await dropdownTrigger.trigger("click");
    expect(dropdown.attributes("style")).toContain("display: none");
  });
});

describe("TuxPortalShell Component", () => {
  it("renders breadcrumbs strip with Warm Gold accent rule when trail provided", async () => {
    const wrapper = await mountSuspended(TuxPortalShell, {
      props: {
        portalTitle: "Connected Corridors Initiative",
        breadcrumbs: sampleBreadcrumbs,
      },
    });

    const subnav = wrapper.find(".tux-portal-shell__subnav");
    expect(subnav.exists()).toBe(true);
    expect(subnav.classes()).toContain("border-brand-accent");
    expect(subnav.text()).toContain("TTI Portals");
    expect(subnav.text()).toContain("Mobility Division");
    expect(subnav.text()).toContain("Connected Corridors");
  });

  it("renders default slot content inside main container", async () => {
    const wrapper = await mountSuspended(TuxPortalShell, {
      props: {
        portalTitle: "Test Portal",
      },
      slots: {
        default: () => h("div", { id: "test-content" }, "Welcome to the portal"),
      },
    });

    const main = wrapper.find("main#main-content");
    expect(main.exists()).toBe(true);
    expect(main.find("#test-content").exists()).toBe(true);
    expect(main.text()).toContain("Welcome to the portal");
  });

  it("renders floating feedback pill and emits feedback-click on interaction", async () => {
    const wrapper = await mountSuspended(TuxPortalShell, {
      props: {
        showFeedback: true,
        feedbackLabel: "Feedback",
      },
    });

    const feedbackBtn = wrapper.find(".tux-portal-shell__feedback-btn");
    expect(feedbackBtn.exists()).toBe(true);
    expect(feedbackBtn.text()).toContain("Feedback");

    await feedbackBtn.trigger("click");
    expect(wrapper.emitted("feedback-click")).toBeTruthy();
    expect(wrapper.emitted("feedback-click")?.length).toBe(1);
  });
});
