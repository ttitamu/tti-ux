import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxRailNav from "~/components/TuxRailNav.vue";
import { runComponentAxe } from "../axe-helper";

const sampleRailItems = [
  [
    {
      label: "Corridor Operations",
      icon: "lucide:route",
      defaultOpen: true,
      children: [
        { label: "Arterials", to: "/corridors/arterials" },
        { label: "Freeways", to: "/corridors/freeways" },
      ],
    },
    { label: "Fleet Sensors", icon: "lucide:radio", to: "/sensors" },
  ],
  [
    { label: "System Health", icon: "lucide:activity", to: "/health" },
  ],
];

describe("TuxRailNav Component", () => {
  it("renders navigation rail with disclosure groups, leaf links, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxRailNav, {
      props: {
        items: sampleRailItems,
        ariaLabel: "Operational Rail",
      },
    });

    const nav = wrapper.find("nav.tux-rail-nav");
    expect(nav.exists()).toBe(true);
    expect(nav.attributes("aria-label")).toBe("Operational Rail");
    expect(wrapper.text()).toContain("Corridor Operations");
    expect(wrapper.text()).toContain("Arterials");
    expect(wrapper.text()).toContain("Freeways");
    expect(wrapper.text()).toContain("Fleet Sensors");
    expect(wrapper.text()).toContain("System Health");

    const details = wrapper.find("details.tux-rail-nav__disclosure");
    expect(details.exists()).toBe(true);
    expect(details.attributes("open")).toBeDefined();

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports collapsed icon-only mode with accessible labels", async () => {
    const wrapper = await mountSuspended(TuxRailNav, {
      props: {
        items: sampleRailItems,
        collapsed: true,
        ariaLabel: "Collapsed Rail",
      },
    });

    expect(wrapper.find("[data-collapsed]").exists()).toBe(true);
    expect(wrapper.find("details").exists()).toBe(false);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
