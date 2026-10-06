import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxVizRPlot from "~/components/TuxVizRPlot.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxVizRPlot Component", () => {
  it("renders image plot with R chip, alt text, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxVizRPlot, {
      props: {
        src: "/images/plots/speed-distribution.png",
        title: "Speed Distribution by Lane Density",
        eyebrow: "ggplot2 Artifact",
        kind: "image",
        source: "scripts/models/weibull-fit.R",
        alt: "Empirical density plot showing bimodal speed distributions across managed lanes",
      },
    });

    const figure = wrapper.find("figure");
    expect(figure.exists()).toBe(true);
    expect(figure.attributes("aria-label")).toBe("Speed Distribution by Lane Density");
    expect(wrapper.text()).toContain("ggplot2 Artifact");
    expect(wrapper.text()).toContain("Speed Distribution by Lane Density");
    expect(wrapper.text()).toContain("R · image");
    expect(wrapper.text()).toContain("scripts/models/weibull-fit.R");

    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("/images/plots/speed-distribution.png");
    expect(img.attributes("alt")).toBe("Empirical density plot showing bimodal speed distributions across managed lanes");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports SVG vector plot mode and custom heading level", async () => {
    const wrapper = await mountSuspended(TuxVizRPlot, {
      props: {
        src: "/images/plots/bottleneck-flow.svg",
        title: "Bottleneck Flow Vector",
        kind: "svg",
        level: 2,
      },
    });

    expect(wrapper.find("h2.tux-viz-rplot__title").text()).toBe("Bottleneck Flow Vector");
    const obj = wrapper.find("object");
    expect(obj.exists()).toBe(true);
    expect(obj.attributes("type")).toBe("image/svg+xml");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
