// @vitest-environment nuxt
/**
 * TuxAnnouncementBanner — localStorage-backed dismissal memory, one of
 * the hand-rolled persistence behaviors nothing exercised before. A
 * dismissed banner must stay dismissed for the same `id` on the next
 * mount, and an `id`-less banner must not write anything.
 *
 * The nuxt test environment's jsdom window exposes NO localStorage
 * (the component's try/catch silently degrades there), so the suite
 * installs a minimal in-memory Storage — which is also what makes the
 * persistence assertions deterministic.
 */
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxAnnouncementBanner from "../../app/components/TuxAnnouncementBanner.vue";

const store = new Map<string, string>();

beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, String(v)),
      removeItem: (k: string) => void store.delete(k),
      clear: () => store.clear(),
      key: (i: number) => [...store.keys()][i] ?? null,
      get length() {
        return store.size;
      },
    },
  });
});

afterEach(() => {
  store.clear();
});

describe("TuxAnnouncementBanner dismissal memory", () => {
  it("dismiss persists under tux-announcement-<id> and survives a remount", async () => {
    const first = await mountSuspended(TuxAnnouncementBanner, {
      props: { id: "maintenance-2026-08", message: "Scheduled maintenance tonight" },
    });
    expect(first.text()).toContain("Scheduled maintenance");
    await first.find("button[aria-label*='ismiss'], .tux-announcement-banner__dismiss").trigger("click");
    expect(store.get("tux-announcement-maintenance-2026-08")).toBe("1");
    expect(first.find(".tux-announcement-banner").exists()).toBe(false);

    const second = await mountSuspended(TuxAnnouncementBanner, {
      props: { id: "maintenance-2026-08", message: "Scheduled maintenance tonight" },
    });
    expect(second.find(".tux-announcement-banner").exists()).toBe(false);
  });

  it("without an id, dismissal is session-only and writes nothing", async () => {
    const w = await mountSuspended(TuxAnnouncementBanner, {
      props: { message: "Ephemeral notice" },
    });
    await w.find("button[aria-label*='ismiss'], .tux-announcement-banner__dismiss").trigger("click");
    expect(w.find(".tux-announcement-banner").exists()).toBe(false);
    expect(store.size).toBe(0);
  });
});
