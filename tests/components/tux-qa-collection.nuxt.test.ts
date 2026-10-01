import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import { h } from "vue";
import TuxQACollection from "~/components/TuxQACollection.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxQACollection Component", () => {
  it("renders questions, prose answers, see-also links, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxQACollection, {
      props: {
        items: [
          {
            question: "How does TTI calibrate connected vehicle radar sensors?",
            answer: "Calibration relies on retroreflective laser targets and synchronized RTK GPS ground truth points stationed across the Proving Grounds.",
            seeAlso: [
              { label: "Sensor Calibration Protocols", to: "/research/sensor-protocols" },
              { label: "RELLIS Proving Grounds", href: "https://rellis.tamus.edu" },
            ],
          },
          {
            question: "What communication protocols are supported on the test track?",
            answer: "Both DSRC (IEEE 802.11p) and C-V2X (3GPP Rel 14/15) radios are deployed at 500-meter intervals.",
          },
        ],
      },
    });

    expect(wrapper.text()).toContain("How does TTI calibrate connected vehicle radar sensors?");
    expect(wrapper.text()).toContain("Calibration relies on retroreflective laser targets");
    expect(wrapper.text()).toContain("Sensor Calibration Protocols");
    expect(wrapper.text()).toContain("RELLIS Proving Grounds");
    expect(wrapper.text()).toContain("What communication protocols are supported on the test track?");
    expect(wrapper.findAll(".tux-qa__item").length).toBe(2);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports variants and custom answer slots", async () => {
    const wrapper = await mountSuspended(TuxQACollection, {
      props: {
        variant: "elegant",
        items: [
          {
            question: "Where can researchers request telemetry datasets?",
          },
        ],
      },
      slots: {
        "answer-0": () =>
          h("div", { class: "custom-answer" }, [
            h("p", [
              "Requests can be submitted via the ",
              h("a", { href: "/data" }, "Data Portal"),
              ".",
            ]),
          ]),
      },
    });

    expect(wrapper.find(".tux-qa--elegant").exists()).toBe(true);
    expect(wrapper.text()).toContain("Where can researchers request telemetry datasets?");
    expect(wrapper.text()).toContain("Requests can be submitted via the Data Portal");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
