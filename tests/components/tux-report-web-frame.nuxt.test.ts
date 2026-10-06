import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxReportWebFrame from "~/components/TuxReportWebFrame.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxReportWebFrame Component", () => {
  it("renders cover headers, metadata, prose body, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxReportWebFrame, {
      props: {
        title: "Connected Automated Vehicle Deployment in Texas",
        eyebrow: "Research Findings 2026",
        lede: "A comprehensive assessment of infrastructure readiness and safety telemetry across 1,200 lane miles.",
        byline: "TTI Connected Transportation Program",
        date: "May 2026",
        readingTime: "8 min read",
        width: "default",
      },
      slots: {
        default: () => "<p>Pilot deployments demonstrated a 34% reduction in recurring merge-point deceleration incidents.</p>",
      },
    });

    expect(wrapper.text()).toContain("Connected Automated Vehicle Deployment in Texas");
    expect(wrapper.text()).toContain("Research Findings 2026");
    expect(wrapper.text()).toContain("A comprehensive assessment of infrastructure readiness");
    expect(wrapper.text()).toContain("TTI Connected Transportation Program");
    expect(wrapper.text()).toContain("May 2026");
    expect(wrapper.text()).toContain("8 min read");
    expect(wrapper.find("h1").exists()).toBe(true);
    expect(wrapper.find(".tux-report-web-frame--default").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports table of contents navigation, narrow/wide measures, and footer slot", async () => {
    const wrapper = await mountSuspended(TuxReportWebFrame, {
      props: {
        title: "Statewide Freight Corridors",
        width: "wide",
        toc: [
          { to: "#overview", label: "Executive Overview" },
          { to: "#methodology", label: "Sensor Instrumentation" },
          { to: "#findings", label: "Empirical Outcomes" },
        ],
      },
      slots: {
        default: () => "<h2 id=\"overview\">Executive Overview</h2><p>Data payload...</p>",
        footer: () => "<div class=\"report-citation\"><p>Citation: Texas A&M Transportation Institute (2026).</p></div>",
      },
    });

    expect(wrapper.find(".tux-report-web-frame--wide").exists()).toBe(true);
    const toc = wrapper.find(".tux-report-web-frame__toc");
    expect(toc.exists()).toBe(true);
    expect(toc.attributes("aria-label")).toBe("On this page");
    expect(wrapper.text()).toContain("Executive Overview");
    expect(wrapper.text()).toContain("Sensor Instrumentation");
    expect(wrapper.text()).toContain("Empirical Outcomes");
    expect(wrapper.text()).toContain("Texas A&M Transportation Institute (2026)");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
