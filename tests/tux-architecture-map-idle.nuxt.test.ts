// @vitest-environment nuxt
/**
 * Work that is not on screen when the map is first drawn waits for idle time
 * (#226): the Go-To index and the model's links. Neither runs before the first
 * render; each runs once idle time is given; and the Go-To palette or a
 * selection used before then builds what it needs on demand. The validator's
 * shape check does not wait: the sanitizer reads the document as the check
 * repairs it. The first size of the viewport comes from the ResizeObserver,
 * not from a layout forced in the mount, and the card under a resting pointer
 * after a level change is found by arithmetic, with no hit test.
 *
 * `requestIdleCallback` and `ResizeObserver` are stubbed here: jsdom has
 * neither, and the stubs let the test say when idle time and the first
 * observation come.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import * as mapUtils from "../packages/diagrams/app/utils/tuxArchitectureMap";
import {
  collapseModelSubgraphs,
  sanitizeMapModel,
  TUX_MAP_SCHEMA,
  type TuxMapLevelModel,
} from "../packages/diagrams/app/utils/tuxArchitectureMap";
import { everyShapeError } from "../packages/diagrams/tests/support/mapShapeErrors";

vi.mock("../packages/diagrams/app/utils/tuxArchitectureMap", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../packages/diagrams/app/utils/tuxArchitectureMap")>();
  return {
    ...mod,
    buildMapSearchIndexKept: vi.fn(mod.buildMapSearchIndexKept),
    extractModelLinksKept: vi.fn(mod.extractModelLinksKept),
  };
});

const searchBuilds = vi.mocked(mapUtils.buildMapSearchIndexKept);
const linkBuilds = vi.mocked(mapUtils.extractModelLinksKept);

type Mounted = Awaited<ReturnType<typeof mountSuspended>>;
const stateOf = (w: Mounted) => (w.vm as unknown as { $: { setupState: Record<string, any> } }).$.setupState;

/** A small model with links and one element kind this release does not list (a shape warning). */
function model(): TuxMapLevelModel {
  return {
    schema: TUX_MAP_SCHEMA,
    level1: {
      elements: [
        { id: "sys", kind: "system", name: "Sys" },
        { id: "odd", kind: "gizmo" as never, name: "Odd" },
      ],
      rels: [],
    },
    level2: {
      boundary: "sys",
      elements: [
        { id: "c-a", kind: "container", name: "A" },
        { id: "c-b", kind: "container", name: "B" },
      ],
      rels: [{ from: "c-a", to: "c-b", label: "calls" }],
    },
    level3: {
      "c-a": [
        { id: "f:a/one.ts", kind: "file", name: "one.ts" },
        { id: "f:a/two.ts", kind: "file", name: "two.ts" },
      ],
      "c-b": [{ id: "f:b/three.ts", kind: "file", name: "three.ts" }],
    },
    level4: { groups: [], nodes: [], links: [] },
    links: [
      { from: "f:a/one.ts", to: "f:a/two.ts", kind: "imports" },
      { from: "f:b/three.ts", to: "f:a/one.ts", kind: "calls" },
    ],
  };
}

const shapeWarning = /gizmo|kind/;

let idleQueue: Array<{ cb: () => void; cancelled: boolean }> = [];
let observers: Array<{ cb: ResizeObserverCallback; targets: Element[] }> = [];
const warn = vi.spyOn(console, "warn");

/** Gives the map its idle time, one callback after another, until nothing more is asked for. */
async function giveIdle() {
  for (let round = 0; round < 10 && idleQueue.length > 0; round++) {
    const due = idleQueue.splice(0);
    for (const t of due) if (!t.cancelled) t.cb();
    await nextTick();
  }
}

beforeEach(() => {
  idleQueue = [];
  observers = [];
  searchBuilds.mockClear();
  linkBuilds.mockClear();
  warn.mockReset();
  warn.mockImplementation(() => {});
  window.requestIdleCallback = ((cb: IdleRequestCallback) => {
    idleQueue.push({ cb: () => cb({ didTimeout: false, timeRemaining: () => 50 }), cancelled: false });
    return idleQueue.length;
  }) as typeof window.requestIdleCallback;
  window.cancelIdleCallback = (h: number) => {
    const t = idleQueue[h - 1];
    if (t) t.cancelled = true;
  };
  window.ResizeObserver = class {
    private entry: { cb: ResizeObserverCallback; targets: Element[] };
    constructor(cb: ResizeObserverCallback) {
      this.entry = { cb, targets: [] };
      observers.push(this.entry);
    }
    observe(el: Element) {
      this.entry.targets.push(el);
    }
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

afterEach(() => {
  delete (window as Partial<Window>).requestIdleCallback;
  delete (window as Partial<Window>).cancelIdleCallback;
  delete (window as Partial<Window>).ResizeObserver;
});

const shapeWarningsSaid = () => warn.mock.calls.map((c) => String(c[0])).filter((m) => shapeWarning.test(m));
const shapeWarningsHeld = (s: Record<string, any>) =>
  (s.modelBundle.validation.warnings as { message: string }[]).filter((w) => shapeWarning.test(w.message));

describe("TuxArchitectureMap: work that waits for idle time (#226)", () => {
  it("runs neither before the first render, and each once idle time is given", async () => {
    const w = await mountSuspended(TuxArchitectureMap, { props: { model: model(), initialLevel: 3, initialFocus: "c-a" } });
    await nextTick();
    const s = stateOf(w);
    expect(w.find('[data-id="f:a/one.ts"]').exists()).toBe(true);
    expect(searchBuilds).not.toHaveBeenCalled();
    expect(linkBuilds).not.toHaveBeenCalled();
    const merged = s.mergedModel;

    await giveIdle();
    expect(searchBuilds).toHaveBeenCalledTimes(1);
    expect(linkBuilds).toHaveBeenCalledTimes(1);
    expect(s.mergedModel).toBe(merged);

    // more idle time does nothing more
    await giveIdle();
    expect(searchBuilds).toHaveBeenCalledTimes(1);
    expect(linkBuilds).toHaveBeenCalledTimes(1);
    w.unmount();
  });

  it("builds the Go-To index and the links on demand when they are asked for first", async () => {
    const w = await mountSuspended(TuxArchitectureMap, { props: { model: model(), initialLevel: 3, initialFocus: "c-a" } });
    const s = stateOf(w);
    s.goToQuery = "two";
    expect(
      s.goToGroupResults.flatMap((g: { hits: { entry: { id: string } }[] }) => g.hits.map((h) => h.entry.id)),
    ).toContain(
      "f:a/two.ts",
    );
    expect(searchBuilds).toHaveBeenCalledTimes(1);

    await w.find('[data-id="f:a/one.ts"]').trigger("click");
    await nextTick();
    expect(s.selectedId).toBe("f:a/one.ts");
    expect(s.selectionBlast?.hits.has("f:b/three.ts")).toBe(true);
    expect(linkBuilds).toHaveBeenCalledTimes(1);

    await giveIdle();
    expect(searchBuilds).toHaveBeenCalledTimes(1);
    expect(linkBuilds).toHaveBeenCalledTimes(1);
    w.unmount();
  });

  it("indexes a new model again, and does nothing after unmount", async () => {
    const w = await mountSuspended(TuxArchitectureMap, { props: { model: model(), initialLevel: 3, initialFocus: "c-a" } });
    await giveIdle();
    expect(searchBuilds).toHaveBeenCalledTimes(1);
    await w.setProps({ model: model() });
    await nextTick();
    expect(searchBuilds).toHaveBeenCalledTimes(1);
    await giveIdle();
    expect(searchBuilds).toHaveBeenCalledTimes(2);
    expect(linkBuilds).toHaveBeenCalledTimes(2);

    await w.setProps({ model: model() });
    w.unmount();
    await giveIdle();
    expect(searchBuilds).toHaveBeenCalledTimes(2);
    expect(linkBuilds).toHaveBeenCalledTimes(2);
  });

  it("checks the shape before the first render: the document is read as the validator repairs it", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const w = await mountSuspended(TuxArchitectureMap, { props: { model: model(), initialLevel: 2 } });
      expect(shapeWarningsSaid()).toHaveLength(1);
      expect(shapeWarningsHeld(stateOf(w))).toHaveLength(1);
      w.unmount();

      const doc = everyShapeError() as unknown as TuxMapLevelModel;
      const d = await mountSuspended(TuxArchitectureMap, { props: { model: doc, initialLevel: 2 } });
      expect(stateOf(d).activeModel).toEqual(collapseModelSubgraphs(sanitizeMapModel(doc).model).model);
      expect(d.find('[data-id="c-a"]').exists()).toBe(true);
      expect(warn.mock.calls.map((c) => String(c[0])).join("\n")).toContain("/level1/elements/0/kind");
      expect(error).not.toHaveBeenCalled();
      d.unmount();
    } finally {
      error.mockRestore();
    }
  });

  it("takes the first size of the viewport from the ResizeObserver", async () => {
    const w = await mountSuspended(TuxArchitectureMap, { props: { model: model(), initialLevel: 2 } });
    const s = stateOf(w);
    const viewport = w.find(".tux-map__viewport").element;
    // the map's own, and the overview's
    const watching = observers.filter((o) => o.targets.includes(viewport));
    expect(watching.length).toBeGreaterThanOrEqual(1);
    // jsdom lays nothing out: the map's width is read as the window's, once measured
    expect(s.containerWidth).toBe(1280);
    for (const o of watching) o.cb([], {} as ResizeObserver);
    expect(s.containerWidth).toBe(window.innerWidth);
    w.unmount();
  });

  it("finds the card under a resting pointer after a level change by arithmetic", async () => {
    const hitTest = vi.fn(() => null);
    const had = Object.getOwnPropertyDescriptor(document, "elementFromPoint");
    Object.defineProperty(document, "elementFromPoint", { value: hitTest, configurable: true });
    try {
      const w = await mountSuspended(TuxArchitectureMap, { props: { model: model(), initialLevel: 2 } });
      const s = stateOf(w);
      const r = s.stageData.rects["c-b"];
      const scale = s.stageScale || 1;
      const clientX = (r.x + r.w / 2) * scale + s.panX;
      const clientY = (r.y + r.h / 2) * scale;

      s.goToLevel(1, {});
      await nextTick();
      w.find(".tux-map__viewport").element.dispatchEvent(
        new window.MouseEvent("pointermove", { clientX, clientY, bubbles: true }),
      );
      s.goToLevel(2, {});
      await nextTick();
      await nextTick();
      expect(hitTest).not.toHaveBeenCalled();
      expect(s.currentHoveredId).toBe("c-b");
      w.unmount();
    } finally {
      if (had) Object.defineProperty(document, "elementFromPoint", had);
      else delete (document as Partial<Document>).elementFromPoint;
    }
  });
});
