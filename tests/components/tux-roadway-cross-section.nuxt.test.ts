import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxRoadwayCrossSection from "~/components/TuxRoadwayCrossSection.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxRoadwayCrossSection Component", () => {
  it("renders 3D spatial perspective view with camera controls and 0 Axe violations", async () => {
    const wrapper = await mountSuspended(TuxRoadwayCrossSection, {
      props: {
        preset: "urban-managed",
        initialView: "3d-perspective",
      },
    });

    expect(wrapper.find(".tux-roadway-cross-section").exists()).toBe(true);
    expect(wrapper.find(".tux-roadway__3d-viewport").exists()).toBe(true);
    expect(wrapper.find(".tux-roadway__3d-controls").exists()).toBe(true);
    expect(wrapper.find("#pitch-slider").exists()).toBe(true);
    expect(wrapper.find(".tux-roadway__3d-corridor").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("switches to 2D CAD blueprint profile and renders engineering elements", async () => {
    const wrapper = await mountSuspended(TuxRoadwayCrossSection, {
      props: {
        preset: "urban-managed",
        initialView: "2d-engineering",
      },
    });

    expect(wrapper.find(".tux-roadway__cad-viewport").exists()).toBe(true);
    expect(wrapper.find(".tux-roadway__cad-svg").exists()).toBe(true);
    expect(wrapper.text()).toContain("AASHTO EXHIBIT 4-1");
    expect(wrapper.text()).toContain("HINGE POINT");
    expect(wrapper.text()).toContain("SWALE INVERT");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports structural pavement strata and hydrology analysis views", async () => {
    const wrapper = await mountSuspended(TuxRoadwayCrossSection, {
      props: {
        preset: "rural-divided",
        initialView: "structural-layers",
      },
    });

    expect(wrapper.find(".tux-roadway__layers-viewport").exists()).toBe(true);
    expect(wrapper.text()).toContain("Subsurface Pavement Layer Design");
    expect(wrapper.text()).toContain("CRCP");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
