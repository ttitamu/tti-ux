// @vitest-environment nuxt
import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxDeskModuleBlock from "../../app/components/desk/TuxDeskModuleBlock.vue";

describe("TuxDeskModuleBlock Component", () => {
  it("renders hero module with action button", async () => {
    const wrapper = await mountSuspended(TuxDeskModuleBlock, {
      props: {
        kind: "hero",
        payload: {
          eyebrow: "Research Program",
          title: "Connected Corridors Initiative",
          lead: "Accelerating automated vehicle research across Texas.",
          actionLabel: "Explore Program Data",
          actionHref: "/research/connected-corridors",
        },
      },
    });

    expect(wrapper.find("[data-testid='tux-desk-module']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Connected Corridors Initiative");
    expect(wrapper.text()).toContain("Explore Program Data");
  });

  it("renders callout module with TuxAlert", async () => {
    const wrapper = await mountSuspended(TuxDeskModuleBlock, {
      props: {
        kind: "callout",
        payload: {
          tone: "warn",
          title: "Calibration in Progress",
          body: "Sensors are undergoing active test loop sweeps.",
        },
      },
    });

    expect(wrapper.text()).toContain("Calibration in Progress");
    expect(wrapper.text()).toContain("Sensors are undergoing active test loop sweeps.");
  });

  it("renders stats module with statistics", async () => {
    const wrapper = await mountSuspended(TuxDeskModuleBlock, {
      props: {
        kind: "stats",
        payload: {
          v1: "$126M+",
          l1: "Annual Research Expenditures",
          v2: "700+",
          l2: "Researchers & Staff",
        },
      },
    });

    expect(wrapper.text()).toContain("$126M+");
    expect(wrapper.text()).toContain("Annual Research Expenditures");
    expect(wrapper.text()).toContain("700+");
  });

  it("renders procedure steps module", async () => {
    const wrapper = await mountSuspended(TuxDeskModuleBlock, {
      props: {
        kind: "steps",
        payload: {
          heading: "Sensor Installation Sequence",
          s1Title: "Mounting Bracket Alignment",
          s1Body: "Secure to vertical support at 4.2 meters.",
        },
      },
    });

    expect(wrapper.text()).toContain("Sensor Installation Sequence");
    expect(wrapper.text()).toContain("Mounting Bracket Alignment");
  });
});
