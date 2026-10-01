import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxMetroInset from "~/components/TuxMetroInset.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxMetroInset Component", () => {
  it("renders metro name, SVG role='img', cells, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxMetroInset, {
      props: {
        name: "Houston Metro",
        highwayLabel: "I-610",
        cols: 6,
        rows: 4,
      },
    });

    expect(wrapper.find(".tux-metro-inset__name").text()).toBe("Houston Metro");

    const svg = wrapper.find("svg");
    expect(svg.exists()).toBe(true);
    expect(svg.attributes("role")).toBe("img");
    expect(svg.attributes("aria-label")).toBe("Houston Metro neighborhood inset");

    // Total cells = cols * rows (24) + 1 highwayLabel badge = 25
    const rects = svg.findAll("rect");
    expect(rects.length).toBe(25);

    expect(wrapper.text()).toContain("I-610");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders with custom height, seed, and slate palette", async () => {
    const wrapper = await mountSuspended(TuxMetroInset, {
      props: {
        name: "DFW Metroplex",
        palette: "slate",
        height: 260,
        seed: "DFW-1",
        cols: 5,
        rows: 5,
      },
    });

    const svg = wrapper.find("svg");
    expect(svg.attributes("height")).toBe("260");

    const rects = svg.findAll("rect");
    expect(rects.length).toBe(25);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
