import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxTestimonial from "~/components/TuxTestimonial.vue";
import { runComponentAxe } from "../axe-helper";

const sampleTestimonials = [
  {
    quote: "The unified design tokens cut our portal prototyping time by half while guaranteeing WCAG 2.2 AAA compliance out of the box.",
    name: "Dr. Sarah Chen",
    role: "Senior Research Director, TTI Mobility Division",
    tone: "maroon" as const,
  },
  {
    quote: "Standardized arterial telemetry visualizations allowed our municipal partners to instantly interpret signal phase bottlenecks.",
    name: "David Morales",
    role: "Traffic Operations Engineer, TxDOT",
    image: "/images/david-morales.jpg",
  },
];

describe("TuxTestimonial Component", () => {
  it("renders testimonial card grid with quotes, attributions, portraits, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxTestimonial, {
      props: {
        items: sampleTestimonials,
        layout: "grid",
        columns: 2,
      },
    });

    expect(wrapper.text()).toContain("Dr. Sarah Chen");
    expect(wrapper.text()).toContain("Senior Research Director, TTI Mobility Division");
    expect(wrapper.text()).toContain("The unified design tokens cut our portal prototyping time");
    expect(wrapper.text()).toContain("David Morales");
    expect(wrapper.text()).toContain("Traffic Operations Engineer, TxDOT");
    expect(wrapper.find(".tux-testimonial--grid").exists()).toBe(true);
    expect(wrapper.find(".tux-testimonial--cols-2").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports row layout and variant styling", async () => {
    const wrapper = await mountSuspended(TuxTestimonial, {
      props: {
        items: sampleTestimonials,
        layout: "row",
        variant: "elegant",
      },
    });

    expect(wrapper.find(".tux-testimonial--row").exists()).toBe(true);
    expect(wrapper.find(".tux-testimonial--elegant").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
