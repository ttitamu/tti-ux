import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxReportFrame from "~/components/TuxReportFrame.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxReportFrame Component", () => {
  it("renders with title, eyebrow, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxReportFrame, {
      props: {
        title: "Annual Transportation Mobility Report",
        eyebrow: "TTI Technical Report 0-6999-1",
      },
      slots: {
        default: () => "<p>Executive summary of multimodal network reliability and congestion metrics.</p>",
      },
    });

    expect(wrapper.text()).toContain("Annual Transportation Mobility Report");
    expect(wrapper.text()).toContain("TTI Technical Report 0-6999-1");
    expect(wrapper.text()).toContain("Executive summary of multimodal network reliability");
    expect(wrapper.find("h1").exists()).toBe(true);
    expect(wrapper.find(".tux-report-frame--letter").exists()).toBe(true);
    expect(wrapper.find(".tux-report-frame--editorial").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports sizes, compact density, breakAfter, and custom header/footer slots", async () => {
    const wrapper = await mountSuspended(TuxReportFrame, {
      props: {
        size: "letter-landscape",
        density: "compact",
        breakAfter: true,
      },
      slots: {
        header: () => "<div class=\"custom-head\"><h1>Quarterly Fleet Telemetry</h1></div>",
        default: () => "<div class=\"telemetry-table\">Data Grid</div>",
        footer: () => "<div class=\"custom-foot\"><p>Page 1 of 12 — Confidential Research Output</p></div>",
      },
    });

    expect(wrapper.find(".tux-report-frame--letter-landscape").exists()).toBe(true);
    expect(wrapper.find(".tux-report-frame--compact").exists()).toBe(true);
    expect(wrapper.find(".tux-report-frame--break-after").exists()).toBe(true);
    expect(wrapper.text()).toContain("Quarterly Fleet Telemetry");
    expect(wrapper.text()).toContain("Data Grid");
    expect(wrapper.text()).toContain("Page 1 of 12 — Confidential Research Output");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
