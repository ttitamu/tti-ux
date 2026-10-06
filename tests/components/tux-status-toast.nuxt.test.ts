import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxStatusToast from "~/components/TuxStatusToast.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxStatusToast Component", () => {
  it("renders toast host container with role='status', aria-live='polite', and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxStatusToast, {
      props: {
        edge: "bottom",
      },
    });

    const host = wrapper.find(".tux-status-toast");
    expect(host.exists()).toBe(true);
    expect(host.classes()).toContain("tux-status-toast--bottom");
    expect(host.attributes("role")).toBe("status");
    expect(host.attributes("aria-live")).toBe("polite");
    expect(host.attributes("aria-label")).toBe("Notifications");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports top edge positioning and integrates with useTuxToast", async () => {
    const wrapper = await mountSuspended(TuxStatusToast, {
      props: {
        edge: "top",
      },
    });

    expect(wrapper.find(".tux-status-toast--top").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
