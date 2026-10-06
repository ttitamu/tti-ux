import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxValidationSummary from "../../app/components/TuxValidationSummary.vue";

describe("TuxValidationSummary Component", () => {
  it("renders form error list with issue count and passes axe audit", async () => {
    const errors = [
      { fieldId: "email", fieldLabel: "Email Address", message: "A valid university email is required." },
      { fieldId: "project-title", fieldLabel: "Project Title", message: "Title cannot be blank." },
      { message: "Please accept the data compliance agreement." },
    ];

    const wrapper = await mountSuspended(TuxValidationSummary, {
      props: {
        errors,
        title: "Please correct the following errors:",
      },
    });

    expect(wrapper.attributes("role")).toBe("alert");
    expect(wrapper.classes()).toContain("tux-validation-summary--error");
    expect(wrapper.text()).toContain("Please correct the following errors:");
    expect(wrapper.text()).toContain("3 issues");
    expect(wrapper.text()).toContain("Email Address:");
    expect(wrapper.text()).toContain("A valid university email is required.");

    const jumpButtons = wrapper.findAll(".tux-validation-summary__link");
    expect(jumpButtons.length).toBe(2);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports warning variant and single issue singular grammar", async () => {
    const wrapper = await mountSuspended(TuxValidationSummary, {
      props: {
        variant: "warning",
        errors: [{ message: "Sensor calibration date expires within 7 days." }],
      },
    });

    expect(wrapper.classes()).toContain("tux-validation-summary--warning");
    expect(wrapper.text()).toContain("1 issue");
    expect(wrapper.text()).toContain("Sensor calibration date expires");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders nothing when errors array is empty", async () => {
    const wrapper = await mountSuspended(TuxValidationSummary, {
      props: {
        errors: [],
      },
    });

    expect(wrapper.find(".tux-validation-summary").exists()).toBe(false);
  });
});
