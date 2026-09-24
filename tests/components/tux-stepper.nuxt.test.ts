// @vitest-environment nuxt
/**
 * TuxStepper — selectable steps and the path variant: a step button emits
 * select(index, step); the current step and a locked step don't; a locked
 * step says why in its accessible name; the default stepper is unchanged
 * (no buttons unless asked).
 */
import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxStepper from "../../app/components/TuxStepper.vue";

const steps = [
  { label: "Triage" }, { label: "Ready" }, { label: "In progress" },
  { label: "Done", locked: "Can't be done while it waits on #183" },
];

describe("TuxStepper selectable path", () => {
  it("emits select for another step, not for the current or a locked one", async () => {
    const w = await mountSuspended(TuxStepper, { props: { steps, currentIndex: 1, selectable: true, variant: "path" } });
    const buttons = w.findAll("button");
    expect(buttons).toHaveLength(4);
    await buttons[2]!.trigger("click");
    await buttons[1]!.trigger("click");                 // current
    await buttons[3]!.trigger("click");                 // locked
    expect(w.emitted("select")).toEqual([[2, expect.objectContaining({ label: "In progress" })]]);
  });

  it("names the current and the locked step for screen readers", async () => {
    const w = await mountSuspended(TuxStepper, { props: { steps, currentIndex: 1, selectable: true, variant: "path" } });
    const buttons = w.findAll("button");
    expect(buttons[1]!.attributes("aria-current")).toBe("step");
    expect(buttons[1]!.attributes("aria-label")).toBe("Ready (current)");
    expect(buttons[3]!.attributes("aria-disabled")).toBe("true");
    expect(buttons[3]!.attributes("aria-label")).toBe("Done: Can't be done while it waits on #183");
  });

  it("does nothing while a step is saving", async () => {
    const w = await mountSuspended(TuxStepper, { props: { steps, currentIndex: 0, selectable: true, variant: "path", busyIndex: 1 } });
    await w.findAll("button")[2]!.trigger("click");
    expect(w.emitted("select")).toBeUndefined();
  });

  it("the default stepper renders no buttons", async () => {
    const w = await mountSuspended(TuxStepper, { props: { steps, currentIndex: 1 } });
    expect(w.findAll("button")).toHaveLength(0);
    expect(w.find(".tux-stepper").exists()).toBe(true);
  });
});
