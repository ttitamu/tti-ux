import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxVizEmbed from "~/components/TuxVizEmbed.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxVizEmbed Component", () => {
  it("renders embed container with title, eyebrow, provider chip, open link, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxVizEmbed, {
      props: {
        src: "https://public.tableau.com/views/StatewideCrashDashboard/Overview",
        title: "Statewide Crash Density Telemetry",
        eyebrow: "TxDOT Crash Records",
        provider: "tableau",
        ratio: "16/9",
      },
    });

    const figure = wrapper.find("figure");
    expect(figure.exists()).toBe(true);
    expect(figure.attributes("aria-label")).toBe("Statewide Crash Density Telemetry");
    expect(wrapper.text()).toContain("TxDOT Crash Records");
    expect(wrapper.text()).toContain("Statewide Crash Density Telemetry");
    expect(wrapper.text()).toContain("Tableau");

    const iframe = wrapper.find("iframe");
    expect(iframe.exists()).toBe(true);
    expect(iframe.attributes("title")).toBe("Statewide Crash Density Telemetry");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders poster preview image when posterSrc is provided and supports powerbi provider", async () => {
    const wrapper = await mountSuspended(TuxVizEmbed, {
      props: {
        src: "https://app.powerbi.com/view?r=eyJrIjoi...",
        title: "Freight Flow Analytics",
        provider: "powerbi",
        posterSrc: "/images/posters/freight-flow.png",
        posterAlt: "Freight Flow corridor analytics map poster",
        openInNew: false,
      },
    });

    expect(wrapper.text()).toContain("Power BI");
    const img = wrapper.find("img.tux-viz-embed__poster");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("/images/posters/freight-flow.png");
    expect(img.attributes("alt")).toBe("Freight Flow corridor analytics map poster");
    expect(wrapper.find("iframe").exists()).toBe(false);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
