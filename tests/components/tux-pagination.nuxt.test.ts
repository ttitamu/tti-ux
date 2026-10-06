import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxPagination from "../../app/components/TuxPagination.vue";

describe("TuxPagination Component", () => {
  it("renders accessible navigation landmark with pagination controls and passes axe", async () => {
    const wrapper = await mountSuspended(TuxPagination, {
      props: {
        total: 100,
        pageSize: 10,
        modelValue: 1,
      },
    });

    const nav = wrapper.find("nav.tux-pagination");
    expect(nav.exists()).toBe(true);
    expect(nav.attributes("aria-label")).toBe("Pagination");

    const buttons = wrapper.findAll("button.tux-pagination__btn");
    expect(buttons.length).toBeGreaterThan(0);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("marks active page with aria-current='page' and emits update:modelValue on click", async () => {
    const wrapper = await mountSuspended(TuxPagination, {
      props: {
        total: 50,
        pageSize: 10,
        modelValue: 2,
      },
    });

    const activeBtn = wrapper.find("button.tux-pagination__btn--active");
    expect(activeBtn.exists()).toBe(true);
    expect(activeBtn.text()).toBe("2");
    expect(activeBtn.attributes("aria-current")).toBe("page");

    // Click page 3 button
    const pageButtons = wrapper.findAll("button.tux-pagination__btn--page");
    const page3Btn = pageButtons.find((btn) => btn.text() === "3");
    expect(page3Btn).toBeDefined();
    await page3Btn!.trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeDefined();
    expect(wrapper.emitted("update:modelValue")![0]).toEqual([3]);
  });

  it("disables prev button on page 1 and next button on the last page", async () => {
    const wrapperPage1 = await mountSuspended(TuxPagination, {
      props: {
        total: 30,
        pageSize: 10,
        modelValue: 1,
      },
    });

    const prevBtn1 = wrapperPage1.find("button[aria-label='Previous page']");
    const nextBtn1 = wrapperPage1.find("button[aria-label='Next page']");
    expect(prevBtn1.attributes("disabled")).toBeDefined();
    expect(nextBtn1.attributes("disabled")).toBeUndefined();

    const wrapperPageLast = await mountSuspended(TuxPagination, {
      props: {
        total: 30,
        pageSize: 10,
        modelValue: 3,
      },
    });

    const prevBtnLast = wrapperPageLast.find("button[aria-label='Previous page']");
    const nextBtnLast = wrapperPageLast.find("button[aria-label='Next page']");
    expect(prevBtnLast.attributes("disabled")).toBeUndefined();
    expect(nextBtnLast.attributes("disabled")).toBeDefined();
  });

  it("renders live status readout when showStatus is true", async () => {
    const wrapper = await mountSuspended(TuxPagination, {
      props: {
        total: 412,
        pageSize: 20,
        modelValue: 2,
        showStatus: true,
        noun: "study",
        pluralNoun: "studies",
      },
    });

    const status = wrapper.find(".tux-pagination__status");
    expect(status.exists()).toBe(true);
    expect(status.attributes("aria-live")).toBe("polite");
    expect(status.text()).toContain("Showing 21–40 of 412 studies");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders ellipsis indicators for large page sets", async () => {
    const wrapper = await mountSuspended(TuxPagination, {
      props: {
        total: 200,
        pageSize: 10,
        modelValue: 10,
        siblingCount: 1,
        boundaryCount: 1,
      },
    });

    const ellipses = wrapper.findAll(".tux-pagination__ellipsis");
    expect(ellipses.length).toBeGreaterThan(0);
    expect(ellipses[0].text()).toBe("…");
    expect(ellipses[0].attributes("aria-hidden")).toBe("true");
  });

  it("supports custom ariaLabel for landmark disambiguation", async () => {
    const wrapper = await mountSuspended(TuxPagination, {
      props: {
        total: 50,
        pageSize: 10,
        modelValue: 1,
        ariaLabel: "Research Publications Pagination",
      },
    });

    expect(wrapper.find("nav").attributes("aria-label")).toBe("Research Publications Pagination");
  });
});
