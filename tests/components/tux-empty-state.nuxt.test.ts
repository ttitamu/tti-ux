import { describe, expect, it } from "vitest";
import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxEmptyState from "../../app/components/TuxEmptyState.vue";

describe("TuxEmptyState Component", () => {
  it("renders preset kind defaults with clean accessibility", async () => {
    const wrapper = await mountSuspended(TuxEmptyState, {
      props: {
        kind: "no-results",
      },
    });

    expect(wrapper.text()).toContain("No matches");
    expect(wrapper.text()).toContain("Try a broader query, or clear the active filters.");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports explicit custom props and CTA slot content", async () => {
    const wrapper = await mountSuspended(TuxEmptyState, {
      props: {
        icon: "lucide:database-zap",
        title: "No Telemetry Streams Active",
        description: "Connect roadside radar detectors to populate real-time speed metrics.",
      },
      slots: {
        default: () => h("button", { type: "button", class: "btn-connect", "aria-label": "Connect detector" }, "Connect Detector"),
      },
    });

    expect(wrapper.text()).toContain("No Telemetry Streams Active");
    expect(wrapper.text()).toContain("Connect roadside radar detectors");
    expect(wrapper.find(".btn-connect").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports noCard and compact options cleanly", async () => {
    const wrapper = await mountSuspended(TuxEmptyState, {
      props: {
        kind: "first-run",
        noCard: true,
        compact: true,
      },
    });

    expect(wrapper.text()).toContain("Welcome");
    expect(wrapper.find(".py-3").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
