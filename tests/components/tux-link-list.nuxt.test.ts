import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxLinkList from "../../app/components/TuxLinkList.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxLinkList Component", () => {
  const sampleGroups = [
    {
      heading: "Research Portals",
      items: [
        { label: "Connected Work Zones", to: "/research/work-zones", description: "Real-time telemetry feeds" },
        { label: "Crash Analytics System", href: "https://cris.dot.state.tx.us", external: true },
      ],
    },
    {
      heading: "Developer Resources",
      items: [
        { label: "API Documentation", to: "/docs/api", featured: true },
      ],
    },
  ];

  it("renders grouped resource links in column layout", async () => {
    const wrapper = await mountSuspended(TuxLinkList, {
      props: {
        groups: sampleGroups,
        layout: "columns",
        columns: 3,
      },
    });

    expect(wrapper.classes()).toContain("tux-link-list");
    expect(wrapper.classes()).toContain("tux-link-list--columns");
    expect(wrapper.classes()).toContain("tux-link-list--cols-3");

    const headings = wrapper.findAll(".tux-link-list__heading");
    expect(headings.length).toBe(2);
    expect(headings[0].text()).toBe("Research Portals");
    expect(headings[1].text()).toBe("Developer Resources");

    const items = wrapper.findAll(".tux-link-list__item");
    expect(items.length).toBe(3);
    expect(items[2].classes()).toContain("tux-link-list__item--featured");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders stacked layout for sidebar placement", async () => {
    const wrapper = await mountSuspended(TuxLinkList, {
      props: {
        groups: sampleGroups,
        layout: "stacked",
      },
    });

    expect(wrapper.classes()).toContain("tux-link-list--stacked");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
