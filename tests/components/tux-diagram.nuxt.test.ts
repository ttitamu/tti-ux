import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxDiagram from "../../app/components/TuxDiagram.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxDiagram Component", () => {
  const sampleCode = `flowchart LR
    A["Raw Sensor Stream"] --> B["Edge Preprocessing"]
    B --> C["Corridor Analytics Engine"]
  `;

  it("renders diagram container with caption and eyebrow", async () => {
    const wrapper = await mountSuspended(TuxDiagram, {
      props: {
        code: sampleCode,
        caption: "Figure 4: Corridor data ingest and edge intelligence architecture pipeline.",
        eyebrow: "Architecture Overview",
      },
    });

    expect(wrapper.element.tagName).toBe("FIGURE");
    expect(wrapper.classes()).toContain("tux-diagram");
    expect(wrapper.find(".tux-diagram__eyebrow").text()).toBe("Architecture Overview");
    expect(wrapper.find(".tux-diagram__caption").text()).toContain("Figure 4: Corridor data ingest");

    const canvas = wrapper.find(".tux-diagram__canvas");
    expect(canvas.exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders without caption or eyebrow when omitted", async () => {
    const wrapper = await mountSuspended(TuxDiagram, {
      props: {
        code: "graph TD; X-->Y;",
      },
    });

    expect(wrapper.find(".tux-diagram__eyebrow").exists()).toBe(false);
    expect(wrapper.find(".tux-diagram__caption").exists()).toBe(false);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
