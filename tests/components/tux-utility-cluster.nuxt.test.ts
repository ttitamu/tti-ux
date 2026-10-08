import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxUtilityCluster from "~/components/TuxUtilityCluster.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxUtilityCluster Component", () => {
  it("renders utility cluster with search, notifications slots, theme toggle, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxUtilityCluster, {
      props: {
        current: "tti-ux",
        signedIn: true,
      },
      slots: {
        search: () => "<button type=\"button\" aria-label=\"Global search\">Search</button>",
        notifications: () => "<button type=\"button\" aria-label=\"Notifications\">Inbox</button>",
      },
    });

    expect(wrapper.text()).toContain("Search");
    expect(wrapper.text()).toContain("Inbox");
    expect(wrapper.find(".tux-utility-cluster").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports userMenu passthrough and hidden toggles", async () => {
    const wrapper = await mountSuspended(TuxUtilityCluster, {
      props: {
        hideTheme: true,
        hideSwitcher: true,
        userMenu: {
          state: "signed-in",
          identity: {
            name: "Marcus Vance",
            initials: "MV",
          },
        },
      },
    });

    expect(wrapper.text()).toContain("MV");
    expect(wrapper.find(".tux-utility-cluster__theme").exists()).toBe(false);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports toggling WCAG AAA high-contrast mode", async () => {
    const wrapper = await mountSuspended(TuxUtilityCluster, {
      props: {
        current: "tti-ux",
      },
    });

    const hcBtn = wrapper.find(".tux-utility-cluster__hc-btn");
    expect(hcBtn.exists()).toBe(true);
    expect(hcBtn.attributes("aria-label")).toContain("high-contrast");

    await hcBtn.trigger("click");
    expect(wrapper.find(".tux-utility-cluster__hc-btn--active").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders vision preferences button and opens vision modal on click", async () => {
    const wrapper = await mountSuspended(TuxUtilityCluster, {
      props: {
        current: "tti-ux",
      },
    });

    const visionBtn = wrapper.find(".tux-utility-cluster__vision-btn");
    expect(visionBtn.exists()).toBe(true);
    expect(visionBtn.attributes("aria-label")).toContain("Vision & Accessibility Preferences");

    await visionBtn.trigger("click");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
