import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxVizGrid from "~/components/TuxVizGrid.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxVizGrid Component", () => {
  it("renders small-multiples grid layout with header, eyebrow, dek, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxVizGrid, {
      props: {
        cols: 2,
        title: "Metropolitan Corridor Comparisons",
        eyebrow: "Regional Analytics",
        dek: "Side-by-side travel time reliability metrics across Houston and Dallas-Fort Worth.",
      },
      slots: {
        default: `
          <div class="test-pane">Houston Pane</div>
          <div class="test-pane">Dallas-Fort Worth Pane</div>
        `,
      },
    });

    const section = wrapper.find("section");
    expect(section.exists()).toBe(true);
    expect(section.classes()).toContain("tux-viz-grid--2");
    expect(section.attributes("aria-label")).toBe("Metropolitan Corridor Comparisons");

    expect(wrapper.text()).toContain("Regional Analytics");
    expect(wrapper.text()).toContain("Metropolitan Corridor Comparisons");
    expect(wrapper.text()).toContain("Side-by-side travel time reliability metrics");
    expect(wrapper.text()).toContain("Houston Pane");
    expect(wrapper.text()).toContain("Dallas-Fort Worth Pane");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports 3-column layout and footer slot", async () => {
    const wrapper = await mountSuspended(TuxVizGrid, {
      props: {
        cols: 3,
        title: "Multi-Region Dashboard",
      },
      slots: {
        default: "<div class='pane'>Pane 1</div><div class='pane'>Pane 2</div><div class='pane'>Pane 3</div>",
        footer: "<p class='custom-footer'>Source: TTI Mobility Analysis 2026</p>",
      },
    });

    expect(wrapper.classes()).toContain("tux-viz-grid--3");
    expect(wrapper.find(".tux-viz-grid__foot").text()).toContain("Source: TTI Mobility Analysis 2026");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
