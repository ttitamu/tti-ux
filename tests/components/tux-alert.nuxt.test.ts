import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxAlert from "../../app/components/TuxAlert.vue";

describe("TuxAlert Component", () => {
  it("renders with default info variant, title, and description", async () => {
    const wrapper = await mountSuspended(TuxAlert, {
      props: {
        title: "System Notification",
        description: "Scheduled maintenance will commence at midnight.",
      },
    });

    expect(wrapper.text()).toContain("System Notification");
    expect(wrapper.text()).toContain("Scheduled maintenance will commence at midnight.");
    expect(wrapper.classes()).toContain("tux-alert--info");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports multiple semantic variants with distinctive left-border styling", async () => {
    const variants = ["note", "tip", "info", "important", "success", "warning", "danger", "compliance"] as const;

    for (const v of variants) {
      const wrapper = await mountSuspended(TuxAlert, {
        props: {
          variant: v,
          title: `Alert ${v}`,
        },
      });
      expect(wrapper.classes()).toContain(`tux-alert--${v}`);
    }
  });

  it("gracefully falls back to danger for unknown variants without crashing", async () => {
    const wrapper = await mountSuspended(TuxAlert, {
      props: {
        // @ts-expect-error testing invalid consumer input
        variant: "unexpected-error",
        title: "Unexpected Event",
      },
    });

    expect(wrapper.text()).toContain("Unexpected Event");
    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports default slot content for rich markdown or action buttons", async () => {
    const wrapper = await mountSuspended(TuxAlert, {
      props: {
        variant: "warning",
        title: "Action Required",
      },
      slots: {
        default: () => "Please review the updated corridor speed limits.",
      },
    });

    expect(wrapper.text()).toContain("Please review the updated corridor speed limits.");
  });
});
