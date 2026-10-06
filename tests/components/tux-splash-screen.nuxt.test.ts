import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxSplashScreen from "~/components/TuxSplashScreen.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxSplashScreen Component", () => {
  it("renders branded wordmark, loading status, role='status', and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxSplashScreen, {
      props: {
        status: "Hydrating Transportation Telemetry System…",
        loaded: false,
      },
    });

    const splash = wrapper.find(".tux-splash-screen");
    expect(splash.exists()).toBe(true);
    expect(splash.attributes("role")).toBe("status");
    expect(splash.attributes("aria-live")).toBe("polite");
    expect(splash.text()).toContain("TTI");
    expect(splash.text()).toContain("Texas A&M Transportation Institute");
    expect(splash.text()).toContain("Hydrating Transportation Telemetry System…");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports custom brand, status, and footer slots", async () => {
    const wrapper = await mountSuspended(TuxSplashScreen, {
      props: {
        loaded: false,
      },
      slots: {
        brand: '<h1 class="custom-brand">TTI Connected Corridors</h1>',
        status: '<p class="custom-status">Initializing sensor telemetry</p>',
        footer: '<div class="custom-footer">Version 3.0.0-rc2</div>',
      },
    });

    expect(wrapper.text()).toContain("TTI Connected Corridors");
    expect(wrapper.text()).toContain("Initializing sensor telemetry");
    expect(wrapper.text()).toContain("Version 3.0.0-rc2");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
