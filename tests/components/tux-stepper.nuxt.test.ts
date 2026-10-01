import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxStepper from "../../app/components/TuxStepper.vue";

describe("TuxStepper Component", () => {
  const steps = [
    { label: "Corridor Ingest", description: "Select sensor stream" },
    { label: "Data Quality", description: "Verify packet integrity" },
    { label: "Synthesis", description: "Generate corridor report" },
  ];

  it("renders steps with active status and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxStepper, {
      props: {
        steps,
        currentIndex: 1,
        ariaLabel: "Project Submission Progress",
      },
    });

    expect(wrapper.attributes("aria-label")).toBe("Project Submission Progress");
    expect(wrapper.classes()).toContain("tux-stepper--horizontal");

    const items = wrapper.findAll(".tux-stepper__item");
    expect(items.length).toBe(3);

    // Step 0 should be done, Step 1 active, Step 2 todo
    expect(items[0].classes()).toContain("tux-stepper__item--done");
    expect(items[1].classes()).toContain("tux-stepper__item--active");
    expect(items[1].attributes("aria-current")).toBe("step");
    expect(items[2].classes()).toContain("tux-stepper__item--todo");

    expect(wrapper.text()).toContain("Corridor Ingest");
    expect(wrapper.text()).toContain("Select sensor stream");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports vertical orientation", async () => {
    const wrapper = await mountSuspended(TuxStepper, {
      props: {
        steps,
        orientation: "vertical",
        currentIndex: 0,
      },
    });

    expect(wrapper.classes()).toContain("tux-stepper--vertical");
    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
