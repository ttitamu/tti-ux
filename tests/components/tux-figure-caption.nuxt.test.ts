import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { h } from "vue";
import TuxFigureCaption from "../../app/components/TuxFigureCaption.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxFigureCaption Component", () => {
  it("renders figure caption placed below content with label and number", async () => {
    const wrapper = await mountSuspended(TuxFigureCaption, {
      props: {
        label: "Figure",
        number: "4.2",
        caption: "Hourly speed variance along the I-35 corridor during peak hours.",
        source: "Source: TTI Mobility Analysis Division, 2025.",
        placement: "below",
      },
      slots: {
        default: () => h("img", { src: "/test-figure.png", alt: "Speed variance graph" }),
      },
    });

    expect(wrapper.classes()).toContain("tux-figure-caption");
    expect(wrapper.text()).toContain("Figure 4.2.");
    expect(wrapper.text()).toContain("Hourly speed variance along the I-35 corridor");
    expect(wrapper.text()).toContain("Source: TTI Mobility Analysis Division, 2025.");

    const figcaption = wrapper.find("figcaption");
    expect(figcaption.exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders caption placed above content for tables", async () => {
    const wrapper = await mountSuspended(TuxFigureCaption, {
      props: {
        label: "Exhibit",
        number: 7,
        caption: "Comparative throughput metrics.",
        placement: "above",
      },
      slots: {
        default: () => h("div", {}, "Table content here"),
      },
    });

    const caption = wrapper.find("figcaption");
    expect(caption.exists()).toBe(true);
    expect(wrapper.text()).toContain("Exhibit 7.");
    expect(wrapper.text()).toContain("Comparative throughput metrics.");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
