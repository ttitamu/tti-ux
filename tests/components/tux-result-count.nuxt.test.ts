import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxResultCount from "../../app/components/TuxResultCount.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxResultCount Component", () => {
  it("renders range readout and pluralized noun", async () => {
    const wrapper = await mountSuspended(TuxResultCount, {
      props: {
        page: 2,
        pageSize: 25,
        total: 104,
        noun: "corridor",
      },
    });

    expect(wrapper.classes()).toContain("tux-result-count");
    expect(wrapper.text()).toContain("Showing");
    expect(wrapper.text()).toContain("26–50");
    expect(wrapper.text()).toContain("of");
    expect(wrapper.text()).toContain("104");
    expect(wrapper.text()).toContain("corridors");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("handles zero total results gracefully", async () => {
    const wrapper = await mountSuspended(TuxResultCount, {
      props: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
    });

    expect(wrapper.text()).toContain("No results");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders page size picker when options provided", async () => {
    const wrapper = await mountSuspended(TuxResultCount, {
      props: {
        page: 1,
        pageSize: 24,
        total: 150,
        pageSizeOptions: [24, 48, 96],
        pageSizeLabel: "records per page",
      },
    });

    const select = wrapper.find("select");
    expect(select.exists()).toBe(true);
    expect(wrapper.text()).toContain("records per page");
    const options = select.findAll("option");
    expect(options.length).toBe(3);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
