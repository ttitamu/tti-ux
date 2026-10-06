import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxCodeMaroon from "../../app/components/TuxCodeMaroon.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxCodeMaroon Component", () => {
  it("renders emergency banner with role alert when active is true", async () => {
    const wrapper = await mountSuspended(TuxCodeMaroon, {
      props: {
        active: true,
        tone: "error",
        title: "Code Maroon Active",
        message: "Severe weather warning in effect for RELLIS campus. Shelter in place.",
        detailsUrl: "https://rellis.tamus.edu/emergency/",
        detailsLabel: "Emergency Information",
      },
    });

    const banner = wrapper.find(".tux-codemaroon");
    expect(banner.exists()).toBe(true);
    expect(banner.attributes("role")).toBe("alert");
    expect(banner.attributes("aria-live")).toBe("assertive");
    expect(banner.classes()).toContain("tux-codemaroon--error");
    expect(banner.find(".tux-codemaroon__title").text()).toBe("Code Maroon Active");
    expect(banner.find(".tux-codemaroon__message").text()).toContain("Severe weather warning");

    const link = banner.find("a.tux-codemaroon__details");
    expect(link.exists()).toBe(true);
    expect(link.attributes("href")).toBe("https://rellis.tamus.edu/emergency/");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("handles dismissible state and emits dismiss events", async () => {
    const wrapper = await mountSuspended(TuxCodeMaroon, {
      props: {
        active: true,
        tone: "warning",
        title: "Advisory",
        message: "Scheduled loop detector maintenance on SH-21.",
        dismissible: true,
      },
    });

    const dismissBtn = wrapper.find("button.tux-codemaroon__dismiss");
    expect(dismissBtn.exists()).toBe(true);
    expect(dismissBtn.attributes("aria-label")).toBe("Dismiss alert");

    await dismissBtn.trigger("click");
    expect(wrapper.emitted("dismiss")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")![0]).toEqual([true]);
  });

  it("renders nothing when active is false", async () => {
    const wrapper = await mountSuspended(TuxCodeMaroon, {
      props: {
        active: false,
      },
    });

    expect(wrapper.find(".tux-codemaroon").exists()).toBe(false);
  });
});
