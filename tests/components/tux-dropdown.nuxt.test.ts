import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxDropdown from "../../app/components/TuxDropdown.vue";

describe("TuxDropdown Component", () => {
  const sampleItems = [
    { label: "Corridor Analytics", to: "/research/corridors", description: "Real-time congestion and volume metrics" },
    { label: "Safety Studies", to: "/research/safety", description: "Empirical crash rate evaluations" },
    { label: "Transit Network", to: "/research/transit" },
  ];

  it("renders trigger label and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxDropdown, {
      props: {
        label: "Research Areas",
        items: sampleItems,
      },
    });

    const trigger = wrapper.find("button.tux-dropdown__trigger");
    expect(trigger.exists()).toBe(true);
    expect(trigger.text()).toContain("Research Areas");
    expect(trigger.attributes("aria-expanded")).toBe("false");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  // Closed, the panel is display:none and axe skips it, so the audit above
  // never saw the panel's structure. Open, the old role="menu" panel around
  // a <ul> of <li role="none"><a role="menuitem"> failed
  // aria-required-children, aria-required-parent and list.
  it("passes axe with the panel open (disclosure pattern, no menu roles)", async () => {
    const wrapper = await mountSuspended(TuxDropdown, {
      props: { label: "Research Areas", items: sampleItems },
    });

    const trigger = wrapper.find("button.tux-dropdown__trigger");
    await trigger.trigger("click");
    const panel = wrapper.find(".tux-dropdown__panel");
    expect(panel.isVisible()).toBe(true);

    // APG disclosure navigation: the trigger says it is expanded and which
    // element it controls; no aria-haspopup (that announces a menu).
    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(trigger.attributes("aria-haspopup")).toBeUndefined();
    expect(panel.attributes("id")).toBeTruthy();
    expect(trigger.attributes("aria-controls")).toBe(panel.attributes("id"));
    expect(wrapper.findAll("[role='menu'], [role='menuitem'], [role='none']")).toHaveLength(0);
    expect(wrapper.findAll(".tux-dropdown__list > li")).toHaveLength(sampleItems.length);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("names the panel it controls from a link trigger too", async () => {
    const wrapper = await mountSuspended(TuxDropdown, {
      props: { label: "Overview", to: "/research", items: sampleItems },
    });

    const link = wrapper.find("a.tux-dropdown__trigger");
    expect(link.attributes("aria-haspopup")).toBeUndefined();
    expect(link.attributes("aria-controls")).toBe(wrapper.find(".tux-dropdown__panel").attributes("id"));
  });

  it("leads each row with its icon, and keeps the column empty on a row without one", async () => {
    const wrapper = await mountSuspended(TuxDropdown, {
      props: {
        label: "Catalog",
        items: [
          { label: "Search", to: "/search", description: "Find files", icon: "lucide:search" },
          { label: "Sites", to: "/sites", icon: "lucide:globe" },
          { label: "Help", to: "/help" },
        ],
      },
    });

    const links = wrapper.findAll(".tux-dropdown__link");
    expect(links).toHaveLength(3);
    for (const link of links) {
      expect(link.classes()).toContain("tux-dropdown__link--with-icon");
      // The icon column comes first, before the label and description.
      const first = link.element.firstElementChild;
      expect(first?.classList.contains("tux-dropdown__link-icon")).toBe(true);
      expect(first?.getAttribute("aria-hidden")).toBe("true");
    }
    expect(links[0]!.find(".tux-dropdown__link-icon").attributes("class")).not.toContain("--empty");
    expect(links[2]!.find(".tux-dropdown__link-icon").classes()).toContain("tux-dropdown__link-icon--empty");

    await wrapper.find("button.tux-dropdown__trigger").trigger("click");
    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("keeps today's layout when no item has an icon", async () => {
    const wrapper = await mountSuspended(TuxDropdown, {
      props: { label: "Programs", items: sampleItems },
    });

    expect(wrapper.findAll(".tux-dropdown__link-icon")).toHaveLength(0);
    for (const link of wrapper.findAll(".tux-dropdown__link")) {
      expect(link.classes()).not.toContain("tux-dropdown__link--with-icon");
    }
  });

  it("toggles panel visibility on trigger click", async () => {
    const wrapper = await mountSuspended(TuxDropdown, {
      props: {
        label: "Programs",
        items: sampleItems,
      },
    });

    const trigger = wrapper.find("button.tux-dropdown__trigger");
    await trigger.trigger("click");

    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(wrapper.find(".tux-dropdown__panel").isVisible()).toBe(true);
    expect(wrapper.text()).toContain("Corridor Analytics");
    expect(wrapper.text()).toContain("Real-time congestion and volume metrics");
  });

  it("renders direct navigation link trigger when 'to' is provided", async () => {
    const wrapper = await mountSuspended(TuxDropdown, {
      props: {
        label: "Overview",
        to: "/research",
        items: sampleItems,
      },
    });

    const link = wrapper.find("a.tux-dropdown__trigger");
    expect(link.exists()).toBe(true);
    expect(link.attributes("href")).toBe("/research");
  });
});
