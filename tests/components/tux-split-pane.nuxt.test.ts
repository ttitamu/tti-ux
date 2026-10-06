import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeAll, describe, expect, it } from "vitest";
import TuxSplitPane from "~/components/TuxSplitPane.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxSplitPane Component", () => {
  beforeAll(() => {
    const storageMap = new Map<string, string>();
    const storageStub = {
      getItem: (k: string) => storageMap.get(k) ?? null,
      setItem: (k: string, v: string) => { storageMap.set(k, String(v)); },
      removeItem: (k: string) => { storageMap.delete(k); },
      clear: () => { storageMap.clear(); },
      length: 0,
      key: () => null,
    };
    try {
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
    } catch {
      // Ignored
    }
  });

  it("renders list pane and empty state when no item is selected", async () => {
    const wrapper = await mountSuspended(TuxSplitPane, {
      props: {
        modelValue: null,
        listLabel: "Corridor List",
        detailLabel: "Corridor Details",
      },
      slots: {
        list: () => "<ul><li>I-35 Central</li><li>I-10 East</li></ul>",
        empty: () => "<p class='empty-note'>Select a corridor to view sensor telemetry.</p>",
      },
    });

    expect(wrapper.text()).toContain("I-35 Central");
    expect(wrapper.text()).toContain("Select a corridor to view sensor telemetry.");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders detail pane when modelValue is provided, plus bottom pane", async () => {
    const wrapper = await mountSuspended(TuxSplitPane, {
      props: {
        modelValue: "corridor-i35",
        showBottom: true,
      },
      slots: {
        list: () => "<ul><li>I-35 Central</li></ul>",
        detail: () => "<div><h3>I-35 Live Telemetry</h3><p>Average speed: 58 mph</p></div>",
        bottom: () => "<div><p>Recent Incidents: 0 active</p></div>",
      },
    });

    expect(wrapper.text()).toContain("I-35 Live Telemetry");
    expect(wrapper.text()).toContain("Average speed: 58 mph");
    expect(wrapper.text()).toContain("Recent Incidents: 0 active");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
