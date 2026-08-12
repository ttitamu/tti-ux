// @vitest-environment nuxt
/**
 * TuxFocusView — dialog semantics. Locks two behaviors: the Escape
 * handler (hand-rolled document listener) emits close, and
 * aria-labelledby actually resolves to the rendered title element —
 * the id was a Math.random() computed until 2026-08-12, which could
 * re-roll and point at nothing.
 */
import { afterEach, describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxFocusView from "../../app/components/TuxFocusView.vue";

// TuxFocusView teleports to <body>, so assertions go through document.
afterEach(() => {
  document.body.innerHTML = "";
});

describe("TuxFocusView dialog semantics", () => {
  it("aria-labelledby resolves to the rendered title element", async () => {
    await mountSuspended(TuxFocusView, {
      props: { open: true, title: "Document inspector" },
      slots: { default: () => "content" },
    });
    const dialog = document.querySelector(".tux-focus-view");
    expect(dialog).toBeTruthy();
    const labelledby = dialog!.getAttribute("aria-labelledby");
    expect(labelledby).toBeTruthy();
    const titleEl = document.getElementById(labelledby!);
    expect(titleEl).toBeTruthy();
    expect(titleEl!.textContent).toContain("Document inspector");
  });

  it("Escape on the document dismisses and emits update:open + close", async () => {
    const w = await mountSuspended(TuxFocusView, {
      props: { open: true, title: "Inspector" },
      slots: { default: () => "content" },
    });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(w.emitted("close")).toBeTruthy();
    expect(w.emitted("update:open")?.at(-1)?.[0]).toBe(false);
  });

  it("dismissOnEscape=false keeps the view open", async () => {
    const w = await mountSuspended(TuxFocusView, {
      props: { open: true, title: "Inspector", dismissOnEscape: false },
      slots: { default: () => "content" },
    });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(w.emitted("close")).toBeUndefined();
  });
});
