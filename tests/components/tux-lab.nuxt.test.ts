import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxLab from "~/components/TuxLab.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxLab Component", () => {
  it("renders lab card with initials avatar, location, summary, focus tags, stats, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxLab, {
      props: {
        name: "Center for Transportation Safety",
        summary: "Conducting data-driven research to eliminate traffic fatalities and severe injuries across Texas.",
        location: "College Station, TX",
        focus: ["Safety", "Crash Analysis", "Human Factors"],
        projectsCount: 24,
        peopleCount: 42,
      },
    });

    expect(wrapper.find(".tux-lab").exists()).toBe(true);
    expect(wrapper.find(".tux-lab__logo-wrap--initials").exists()).toBe(true);
    expect(wrapper.text()).toContain("Center for Transportation Safety");
    expect(wrapper.text()).toContain("College Station, TX");
    expect(wrapper.text()).toContain("Safety");
    expect(wrapper.text()).toContain("24");
    expect(wrapper.text()).toContain("Active projects");
    expect(wrapper.text()).toContain("42");
    expect(wrapper.text()).toContain("Researchers");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports logo mark, navigation link, and leadership roster with portraits and initial fallbacks", async () => {
    const wrapper = await mountSuspended(TuxLab, {
      props: {
        name: "Connected Vehicles Lab",
        logo: "https://tti.tamu.edu/images/cv-lab.svg",
        to: "/centers/connected-vehicles",
        leaders: [
          {
            name: "Dr. Andrea Miller",
            role: "Director",
            portrait: "https://tti.tamu.edu/portraits/miller.jpg",
            to: "/researchers/miller",
          },
          {
            name: "Marcus Vance",
            role: "Associate Director",
          },
        ],
      },
    });

    expect(wrapper.find("img.tux-lab__logo").exists()).toBe(true);
    expect(wrapper.find("a.link-tti").attributes("href")).toBe("/centers/connected-vehicles");
    expect(wrapper.findAll(".tux-lab__leader").length).toBe(2);
    expect(wrapper.text()).toContain("Dr. Andrea Miller");
    expect(wrapper.text()).toContain("Marcus Vance");
    expect(wrapper.find(".tux-lab__leader-portrait--initials").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
