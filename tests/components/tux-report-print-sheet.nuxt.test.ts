import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxReportPrintSheet from "~/components/TuxReportPrintSheet.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxReportPrintSheet Component", () => {
  it("mounts clean hidden marker and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxReportPrintSheet, {
      props: {
        size: "letter",
        margin: "0.6in",
      },
    });

    const marker = wrapper.find(".tux-report-print-sheet");
    expect(marker.exists()).toBe(true);
    expect(marker.attributes("aria-hidden")).toBe("true");
    expect(marker.attributes("hidden")).toBeDefined();

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports custom paper size and margins", async () => {
    const wrapper = await mountSuspended(TuxReportPrintSheet, {
      props: {
        size: "a4",
        margin: "15mm",
      },
    });

    expect(wrapper.find(".tux-report-print-sheet").exists()).toBe(true);
    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
