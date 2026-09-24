// @vitest-environment nuxt
/**
 * TuxSlideover — the two contracts the forge's work-surface panel needs:
 * a sheet MOUNTED open (a deep link to a record) actually opens, and an
 * Escape meant for a popover/listbox inside the sheet does not also close
 * the sheet. jsdom has no <dialog> methods, so showModal/close are stubbed
 * to toggle `open` the way a browser does.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxSlideover from "../../app/components/TuxSlideover.vue";

const proto = HTMLDialogElement.prototype as HTMLDialogElement & { showModal?: () => void; close?: () => void };
const had = { showModal: proto.showModal, close: proto.close };
beforeAll(() => {
  proto.showModal = function (this: HTMLDialogElement) { this.setAttribute("open", ""); };
  proto.close = function (this: HTMLDialogElement) {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});
afterAll(() => { proto.showModal = had.showModal; proto.close = had.close; });

describe("TuxSlideover", () => {
  it("opens when it is mounted already open", async () => {
    const w = await mountSuspended(TuxSlideover, { props: { modelValue: true, title: "Record #184" } });
    expect((w.find("dialog").element as HTMLDialogElement).hasAttribute("open")).toBe(true);
  });

  it("keeps the sheet open when Escape was meant for a layer inside it", async () => {
    const w = await mountSuspended(TuxSlideover, {
      props: { modelValue: true, title: "Record" },
      slots: { default: () => h("div", { "data-dismissable-layer": "" }, "an open popover") },
    });
    const dialog = w.find("dialog").element;
    dialog.querySelector("[data-dismissable-layer]")!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    const cancel = new Event("cancel", { cancelable: true });
    dialog.dispatchEvent(cancel);
    expect(cancel.defaultPrevented).toBe(true);
  });

  it("still closes on Escape when nothing inside is open", async () => {
    const w = await mountSuspended(TuxSlideover, {
      props: { modelValue: true, title: "Record" },
      slots: { default: () => h("p", "plain content") },
    });
    const dialog = w.find("dialog").element;
    dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    const cancel = new Event("cancel", { cancelable: true });
    dialog.dispatchEvent(cancel);
    expect(cancel.defaultPrevented).toBe(false);
  });
});
