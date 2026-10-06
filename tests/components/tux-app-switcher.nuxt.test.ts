import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxAppSwitcher from "../../app/components/TuxAppSwitcher.vue";

describe("TuxAppSwitcher Component", () => {
  const sampleApps = [
    {
      id: "portal",
      name: "TTI Portal",
      tagline: "Main agency directory",
      icon: "lucide:home",
      to: "https://tti.tamu.edu",
      current: true,
    },
    {
      id: "atlas",
      name: "TTI Atlas",
      tagline: "Geospatial corridor intelligence",
      icon: "lucide:map",
      to: "https://atlas.tti.tamu.edu",
      target: "_blank" as const,
      kind: "desktop" as const,
    },
  ];

  it("renders trigger button with accessible name and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxAppSwitcher, {
      props: {
        apps: sampleApps,
      },
    });

    const trigger = wrapper.find(".tux-app-switcher__trigger");
    expect(trigger.exists()).toBe(true);
    expect(trigger.attributes("aria-label")).toBe("Switch apps");
    expect(trigger.attributes("type")).toBe("button");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("accepts custom ariaLabel and heading props", async () => {
    const wrapper = await mountSuspended(TuxAppSwitcher, {
      props: {
        apps: sampleApps,
        ariaLabel: "Launch institutional suites",
        heading: "TTI Core Portals",
        footerText: "Showing 2 active suites",
      },
    });

    const trigger = wrapper.find(".tux-app-switcher__trigger");
    expect(trigger.exists()).toBe(true);
    expect(trigger.attributes("aria-label")).toBe("Launch institutional suites");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
