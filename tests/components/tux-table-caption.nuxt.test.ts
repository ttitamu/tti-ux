import { describe, expect, it } from "vitest";
import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxTableCaption from "../../app/components/TuxTableCaption.vue";

describe("TuxTableCaption Component", () => {
  it("renders academic table caption above table content and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxTableCaption, {
      props: {
        number: 4,
        caption: "Summary of Crash Rates by Speed Zone (2020-2025).",
        source: "Source: Texas Department of Transportation Crash Records.",
      },
      slots: {
        default: () =>
          h("table", [
            h("thead", [h("tr", [h("th", "Zone"), h("th", "Rate")])]),
            h("tbody", [h("tr", [h("td", "Urban"), h("td", "1.42")])]),
          ]),
      },
    });

    const figure = wrapper.find("figure");
    expect(figure.exists()).toBe(true);
    expect(figure.classes()).toContain("tux-figure-caption");

    const figcaption = wrapper.find("figcaption");
    expect(figcaption.exists()).toBe(true);
    expect(figcaption.text()).toContain("Table 4.");
    expect(figcaption.text()).toContain("Summary of Crash Rates");
    expect(figcaption.text()).toContain("Source: Texas Department of Transportation");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports custom label and below placement", async () => {
    const wrapper = await mountSuspended(TuxTableCaption, {
      props: {
        label: "Exhibit",
        number: "B-1",
        caption: "Sensor deployment matrix.",
        placement: "below",
      },
      slots: {
        default: () => h("div", { class: "table-wrapper" }, "Table Content"),
      },
    });

    expect(wrapper.find("figcaption").text()).toContain("Exhibit B-1.");
    expect(wrapper.find("figcaption").text()).toContain("Sensor deployment matrix.");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
