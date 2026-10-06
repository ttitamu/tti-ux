import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxButton from "../../app/components/TuxButton.vue";

describe("TuxButton Component", () => {
  it("renders with default primary intent and slot content", async () => {
    const wrapper = await mountSuspended(TuxButton, {
      slots: {
        default: () => "Save Changes",
      },
    });

    expect(wrapper.text()).toContain("Save Changes");
    // Passes axe accessibility check
    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports all semantic intents (primary, secondary, ghost, destructive)", async () => {
    const primary = await mountSuspended(TuxButton, {
      props: { intent: "primary" },
      slots: { default: () => "Primary" },
    });
    expect(primary.exists()).toBe(true);

    const secondary = await mountSuspended(TuxButton, {
      props: { intent: "secondary" },
      slots: { default: () => "Secondary" },
    });
    expect(secondary.exists()).toBe(true);

    const ghost = await mountSuspended(TuxButton, {
      props: { intent: "ghost" },
      slots: { default: () => "Ghost" },
    });
    expect(ghost.exists()).toBe(true);

    const destructive = await mountSuspended(TuxButton, {
      props: { intent: "destructive" },
      slots: { default: () => "Delete Record" },
    });
    expect(destructive.classes()).toContain("btn-fill-on-hover");
  });

  it("applies rectangular 0px shape for Kadence institutional brand parity", async () => {
    const sharpWrapper = await mountSuspended(TuxButton, {
      props: { shape: "sharp" },
      slots: { default: () => "Institutional Action" },
    });
    expect(sharpWrapper.classes()).toContain("!rounded-none");

    const squareWrapper = await mountSuspended(TuxButton, {
      props: { shape: "square" },
      slots: { default: () => "Square Action" },
    });
    expect(squareWrapper.classes()).toContain("!rounded-none");

    const pillWrapper = await mountSuspended(TuxButton, {
      props: { shape: "pill" },
      slots: { default: () => "Pill Action" },
    });
    expect(pillWrapper.classes()).toContain("!rounded-full");
  });

  it("supports disabled and loading states while maintaining accessibility", async () => {
    const disabledWrapper = await mountSuspended(TuxButton, {
      attrs: { disabled: true },
      slots: { default: () => "Disabled Action" },
    });
    expect(disabledWrapper.attributes("disabled")).toBeDefined();

    const violations = await runComponentAxe(disabledWrapper.element);
    expect(violations).toEqual([]);
  });
});
