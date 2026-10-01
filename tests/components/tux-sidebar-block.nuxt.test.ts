import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxSidebarBlock from "~/components/TuxSidebarBlock.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxSidebarBlock Component", () => {
  it("renders title, eyebrow, icon, slot content, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxSidebarBlock, {
      props: {
        title: "Quick Facts",
        eyebrow: "Program Telemetry",
        icon: "lucide:info",
        variant: "default",
      },
      slots: {
        default: "<p class='content'>Annual research expenditures reached $80M in FY25.</p>",
      },
    });

    expect(wrapper.classes()).toContain("tux-sidebar-block");
    expect(wrapper.classes()).toContain("tux-sidebar-block--default");
    expect(wrapper.find(".tux-sidebar-block__title").text()).toContain("Quick Facts");
    expect(wrapper.find(".tux-sidebar-block__eyebrow").text()).toBe("Program Telemetry");
    expect(wrapper.text()).toContain("Annual research expenditures reached $80M in FY25.");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders bordered and filled variants correctly", async () => {
    const borderedWrapper = await mountSuspended(TuxSidebarBlock, {
      props: {
        title: "Key Contacts",
        variant: "bordered",
      },
    });
    expect(borderedWrapper.classes()).toContain("tux-sidebar-block--bordered");
    const borderedViolations = await runComponentAxe(borderedWrapper.element);
    expect(borderedViolations).toEqual([]);

    const filledWrapper = await mountSuspended(TuxSidebarBlock, {
      props: {
        title: "Division Resources",
        variant: "filled",
      },
    });
    expect(filledWrapper.classes()).toContain("tux-sidebar-block--filled");
    const filledViolations = await runComponentAxe(filledWrapper.element);
    expect(filledViolations).toEqual([]);
  });
});
