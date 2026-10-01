import { beforeAll, describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxCookieConsent from "../../app/components/TuxCookieConsent.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxCookieConsent Component", () => {
  const mockStorage: Record<string, string> = {};
  const storageStub = {
    getItem: (k: string) => mockStorage[k] ?? null,
    setItem: (k: string, v: string) => { mockStorage[k] = v; },
    removeItem: (k: string) => { delete mockStorage[k]; },
    clear: () => { for (const k of Object.keys(mockStorage)) delete mockStorage[k]; },
    length: 0,
    key: () => null,
  };

  beforeAll(() => {
    Object.defineProperty(globalThis, "localStorage", {
      value: storageStub,
      configurable: true,
      writable: true,
    });
    if (typeof window !== "undefined") {
      Object.defineProperty(window, "localStorage", {
        value: storageStub,
        configurable: true,
        writable: true,
      });
    }
  });

  it("renders privacy notice dialog with actions and passes axe audit", async () => {
    delete mockStorage["tux-test-cookie-1"];

    const wrapper = await mountSuspended(TuxCookieConsent, {
      props: {
        storageKey: "tux-test-cookie-1",
        message: "We use essential cookies to maintain institutional authentication sessions.",
      },
    });

    const cookieEl = document.body.querySelector(".tux-cookie") as HTMLElement;
    expect(cookieEl).not.toBeNull();
    expect(cookieEl.getAttribute("role")).toBe("dialog");
    expect(cookieEl.getAttribute("aria-label")).toBe("Cookie preferences");
    expect(cookieEl.textContent).toContain("Cookies on this site");
    expect(cookieEl.textContent).toContain("institutional authentication sessions");

    const violations = await runComponentAxe(cookieEl);
    expect(violations).toEqual([]);

    wrapper.unmount();
  });

  it("handles user acceptance and emits decision", async () => {
    delete mockStorage["tux-test-cookie-2"];

    const wrapper = await mountSuspended(TuxCookieConsent, {
      props: {
        storageKey: "tux-test-cookie-2",
      },
    });

    const buttons = Array.from(document.body.querySelectorAll(".tux-cookie button")) as HTMLButtonElement[];
    const acceptBtn = buttons.find((b) => b.textContent?.includes("Accept all"));
    expect(acceptBtn).toBeDefined();

    acceptBtn?.click();
    expect(wrapper.emitted("decision")).toBeTruthy();
    expect(wrapper.emitted("decision")![0]).toEqual(["accepted"]);

    wrapper.unmount();
  });
});
