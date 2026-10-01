import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxFundingSource from "../../app/components/TuxFundingSource.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxFundingSource Component", () => {
  it("renders funder name and grant code", async () => {
    const wrapper = await mountSuspended(TuxFundingSource, {
      props: {
        funder: "Federal Highway Administration",
        grant: "DTFH61-16-C-00028",
        size: "md",
        layout: "inline",
      },
    });

    expect(wrapper.classes()).toContain("tux-funding-source");
    expect(wrapper.classes()).toContain("tux-funding-source--md");
    expect(wrapper.classes()).toContain("tux-funding-source--inline");
    expect(wrapper.find(".tux-funding-source__funder").text()).toBe("Federal Highway Administration");
    expect(wrapper.find(".tux-funding-source__grant").text()).toBe("DTFH61-16-C-00028");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders linked wrapper when 'to' prop is provided", async () => {
    const wrapper = await mountSuspended(TuxFundingSource, {
      props: {
        funder: "Texas Department of Transportation",
        abbrev: "TxDOT",
        to: "https://www.txdot.gov",
        size: "sm",
      },
    });

    expect(wrapper.element.tagName).toBe("A");
    expect(wrapper.attributes("href")).toBe("https://www.txdot.gov");
    expect(wrapper.attributes("target")).toBe("_blank");
    expect(wrapper.find(".tux-funding-source__abbrev").text()).toBe("TxDOT");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
