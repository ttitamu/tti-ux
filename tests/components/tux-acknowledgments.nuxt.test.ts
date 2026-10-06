import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxAcknowledgments from "../../app/components/TuxAcknowledgments.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxAcknowledgments Component", () => {
  const sampleFunding = [
    { funder: "Federal Highway Administration", grant: "DTFH61-16-C-00028", url: "https://highways.dot.gov" },
    { funder: "Texas Department of Transportation", grant: "Project 0-7124" },
  ];

  it("renders funding grants, acknowledgments, and conflict disclosures", async () => {
    const wrapper = await mountSuspended(TuxAcknowledgments, {
      props: {
        funding: sampleFunding,
        acknowledgments: "The authors thank the Bryan District TxDOT engineers for traffic signal plan access.",
        conflicts: "None declared.",
        ethics: "IRB approval Protocol 2024-0418 exempted under standard telemetry monitoring.",
        level: 4,
      },
    });

    expect(wrapper.classes()).toContain("tux-acknowledgments");
    expect(wrapper.find(".tux-acknowledgments__eyebrow").text()).toContain("Acknowledgments & declarations");

    const sections = wrapper.findAll(".tux-acknowledgments__section");
    expect(sections.length).toBe(4);

    expect(wrapper.text()).toContain("Federal Highway Administration");
    expect(wrapper.text()).toContain("DTFH61-16-C-00028");
    expect(wrapper.text()).toContain("None declared.");
    expect(wrapper.text()).toContain("IRB approval Protocol 2024-0418");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders gracefully with partial disclosure sections", async () => {
    const wrapper = await mountSuspended(TuxAcknowledgments, {
      props: {
        funding: [{ funder: "National Science Foundation" }],
      },
    });

    const sections = wrapper.findAll(".tux-acknowledgments__section");
    expect(sections.length).toBe(1);
    expect(wrapper.text()).toContain("National Science Foundation");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
