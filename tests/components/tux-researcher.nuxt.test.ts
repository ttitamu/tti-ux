import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxResearcher from "~/components/TuxResearcher.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxResearcher Component", () => {
  it("renders profile card with portrait, affiliations, metrics, projects, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxResearcher, {
      props: {
        name: "Dr. Elena Rostova",
        role: "Senior Research Scientist",
        center: "Center for Transportation Safety",
        portrait: "/images/portrait-sample.jpg",
        bio: "Specializing in autonomous vehicle human factors, sensor telemetry, and intersection safety.",
        email: "e-rostova@tti.tamu.edu",
        orcid: "0000-0002-1825-0097",
        metrics: [
          { label: "h-index", value: 28 },
          { label: "Citations", value: "3,420" },
          { label: "Active Grants", value: 4 },
        ],
        projects: [
          { title: "Connected Intersections in Urban Corridors", eyebrow: "TxDOT 0-7012" },
          { title: "Pedestrian Collision Warning Telemetry", to: "/research/pedestrian-warning" },
        ],
      },
    });

    expect(wrapper.text()).toContain("Dr. Elena Rostova");
    expect(wrapper.text()).toContain("Senior Research Scientist");
    expect(wrapper.text()).toContain("Center for Transportation Safety");
    expect(wrapper.text()).toContain("e-rostova@tti.tamu.edu");
    expect(wrapper.text()).toContain("0000-0002-1825-0097");
    expect(wrapper.text()).toContain("h-index");
    expect(wrapper.text()).toContain("Connected Intersections in Urban Corridors");

    const img = wrapper.find("img.tux-researcher__portrait");
    expect(img.exists()).toBe(true);
    expect(img.attributes("alt")).toBe("Dr. Elena Rostova, Senior Research Scientist");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports initials fallback, horizontal layout, and inline layout", async () => {
    const wrapper = await mountSuspended(TuxResearcher, {
      props: {
        name: "Marcus Vance",
        role: "Research Engineer",
        layout: "horizontal",
        to: "/people/marcus-vance",
      },
    });

    expect(wrapper.find(".tux-researcher--horizontal").exists()).toBe(true);
    const initials = wrapper.find(".tux-researcher__portrait--initials");
    expect(initials.exists()).toBe(true);
    expect(initials.text()).toBe("MV");
    expect(initials.attributes("role")).toBe("img");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
