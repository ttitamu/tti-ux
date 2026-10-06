import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxStatus from "../../app/components/TuxStatus.vue";

describe("TuxStatus Component", () => {
  it("renders chip kind with default state label and passes axe checks", async () => {
    const wrapper = await mountSuspended(TuxStatus, {
      props: {
        state: "ok",
      },
    });

    expect(wrapper.classes()).toContain("tux-status--ok");
    expect(wrapper.text()).toBe("OK");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders dot kind with accessible role and aria-label", async () => {
    const wrapper = await mountSuspended(TuxStatus, {
      props: {
        state: "critical",
        kind: "dot",
      },
    });

    expect(wrapper.classes()).toContain("tux-status--critical");
    expect(wrapper.classes()).toContain("tux-status--dot");
    expect(wrapper.attributes("role")).toBe("status");
    expect(wrapper.attributes("aria-label")).toBe("CRITICAL");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports acked state, custom label, and text kind", async () => {
    const wrapper = await mountSuspended(TuxStatus, {
      props: {
        state: "warning",
        kind: "text",
        acked: true,
        label: "Acknowledged Ingest Latency",
      },
    });

    expect(wrapper.classes()).toContain("tux-status--warning");
    expect(wrapper.classes()).toContain("tux-status--text");
    expect(wrapper.classes()).toContain("tux-status--acked");
    expect(wrapper.text()).toBe("Acknowledged Ingest Latency");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
