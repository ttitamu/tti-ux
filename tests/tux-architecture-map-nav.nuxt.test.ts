// Moving around <TuxArchitectureMap> (#205): the Go-To palette's route rows, the
// level numbers, double-click and the level filter. The model has the shape a
// code-graph producer writes: route elements in a "Routes" subgraph, a
// `handled-by` link from each to its handler, the handler's own `tech` naming
// the route, and the same routes again in `model.routes`.
import { describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import type { TuxMapLevelModel } from "../packages/diagrams/app/utils/tuxArchitectureMap";

const R = "acme/app";
const ROUTE_ME = `${R}:r:me`;
const ROUTE_CHAT = `${R}:r:chat_completions`;
const FILE_ME = `${R}:f:bff/routes/me.py`;
const FILE_CHAT = `${R}:f:bff/routes/chat.py`;
const FN_WHOAMI = `${R}:s:bff/routes/me.py#whoami`;
const FN_STATUS = `${R}:s:bff/routes/me.py#status`;
const FN_CHAT = `${R}:s:bff/routes/chat.py#completions`;

/** The functions of me.py are not in the model: a host loads a file's inside when it is opened. */
function producerModel(): TuxMapLevelModel {
  return {
    schema: "tux-map/1",
    level1: { elements: [{ id: "sys", kind: "system", name: "App" }], rels: [] },
    level2: {
      boundary: "sys",
      elements: [
        { id: "c-gateway", kind: "container", name: "Gateway" },
        { id: "c-runner", kind: "container", name: "Job runner" },
        { id: "c-store", kind: "database", name: "Store" },
      ],
      rels: [
        { from: "c-gateway", to: "c-store", label: "Reads" },
        { from: "c-runner", to: "c-store", label: "Writes" },
      ],
    },
    level3: {
      "c-gateway": [
        { id: "c-gateway/routes", kind: "component", name: "Routes" },
        { id: "c-gateway/core", kind: "component", name: "Core" },
      ],
    },
    level4: { groups: [], nodes: [], links: [] },
    subgraphs: {
      "c-gateway/routes": {
        stratum: "Routes",
        elements: [
          { id: ROUTE_ME, kind: "route", name: "GET /v1/me", tech: "full" },
          { id: ROUTE_CHAT, kind: "route", name: "POST /v1/chat/completions", tech: "full · AI" },
        ],
      },
      "c-gateway/core": {
        stratum: "Files",
        elements: [
          { id: FILE_ME, kind: "module", name: "me.py", source: { path: "bff/routes/me.py" }, subgraphRef: FILE_ME },
          { id: FILE_CHAT, kind: "module", name: "chat.py", source: { path: "bff/routes/chat.py" } },
        ],
      },
      [FILE_CHAT]: {
        stratum: "Functions and classes",
        elements: [
          {
            id: FN_CHAT,
            kind: "symbol",
            name: "completions()",
            tech: "POST /v1/chat/completions",
            source: { path: "bff/routes/chat.py", lineRange: [3, 9], symbol: "completions" },
          },
        ],
      },
    },
    links: [
      { from: ROUTE_ME, to: FN_WHOAMI, kind: "handled-by" },
      { from: ROUTE_CHAT, to: FN_CHAT, kind: "handled-by" },
    ],
    routes: [
      { method: "GET", pattern: "/v1/me", handler: FN_WHOAMI, framework: "gateway" },
      { method: "POST", pattern: "/v1/chat/completions", handler: FN_CHAT, framework: "gateway" },
      // no route element for these two; the handler of the second is in no file the model has
      { method: "GET", pattern: "/v1/status", handler: FN_STATUS, framework: "gateway" },
      { method: "GET", pattern: "/v1/gone", handler: "elsewhere#gone", framework: "gateway" },
    ],
  };
}

async function settle() {
  for (let i = 0; i < 6; i++) await nextTick();
}

async function mountMap(props: Record<string, unknown> = {}) {
  return mountSuspended(TuxArchitectureMap, {
    props: { model: producerModel(), initialLevel: 2, resolveSubgraph: () => Promise.resolve(null), ...props },
    attachTo: document.body,
  });
}

type Mounted = Awaited<ReturnType<typeof mountMap>>;

const levelText = (w: Mounted) => w.find(".tux-map__level-text").text();
const focusedCardId = () => (document.activeElement as HTMLElement | null)?.dataset?.id;

async function openGoTo(w: Mounted, query: string) {
  await w.find(".tux-map__viewport").trigger("keydown", { key: "/" });
  await nextTick();
  await w.find("input.tux-map__goto-input").setValue(query);
  await nextTick();
}

const routeRows = (w: Mounted) =>
  w.findAll(".tux-map__goto-opt").filter((o) => o.find(".tux-map__goto-opt-grp").text() === "Routes");
const rowText = (w: Mounted) =>
  routeRows(w).map((r) => `${r.find(".tux-map__goto-opt-nm").text()} ${r.find(".tux-map__goto-opt-lvl").text()}`);
const pressEnter = async (w: Mounted) => {
  await w.find("input.tux-map__goto-input").trigger("keydown", { key: "Enter" });
  await settle();
};

describe("TuxArchitectureMap Go to: route results (#205)", () => {
  it("lists a route once, with the level it opens, however many places in the model name it", async () => {
    const w = await mountMap();
    await openGoTo(w, "completions");
    expect(rowText(w)).toEqual(["POST /v1/chat/completions L6"]);
    await routeRows(w)[0]!.trigger("click");
    await settle();

    expect(w.find(".tux-map__goto-dialog").exists()).toBe(false);
    expect(levelText(w)).toContain("Level 6");
    expect(w.emitted("update:selectedId")?.at(-1)).toEqual([FN_CHAT]);
    w.unmount();
  });

  it("opens a route whose handler is in a file not loaded yet: the route's own card, on Enter", async () => {
    const w = await mountMap();
    await openGoTo(w, "whoami");
    expect(rowText(w)).toEqual(["GET /v1/me L5"]);
    expect(w.find(".tux-map__goto-opt--active .tux-map__goto-opt-grp").text()).toBe("Routes");
    await pressEnter(w);

    expect(w.find(".tux-map__goto-dialog").exists()).toBe(false);
    expect(levelText(w)).toContain("Level 5");
    expect(w.emitted("update:focus")?.at(-1)).toEqual(["c-gateway/routes"]);
    expect(w.emitted("update:selectedId")?.at(-1)).toEqual([ROUTE_ME]);
    expect(focusedCardId()).toBe(ROUTE_ME);
    w.unmount();
  });

  it("opens the same route on a click", async () => {
    const w = await mountMap();
    await openGoTo(w, "/v1/me");
    expect(rowText(w)[0]).toBe("GET /v1/me L5");
    await routeRows(w)[0]!.trigger("click");
    await settle();

    expect(levelText(w)).toContain("Level 5");
    expect(w.emitted("update:selectedId")?.at(-1)).toEqual([ROUTE_ME]);
    w.unmount();
  });

  it("opens the handler's file for a route that has no card and an unloaded handler", async () => {
    const w = await mountMap();
    await openGoTo(w, "/v1/status");
    expect(rowText(w)).toEqual(["GET /v1/status L5"]);
    await pressEnter(w);

    expect(levelText(w)).toContain("Level 5");
    expect(w.emitted("update:focus")?.at(-1)).toEqual(["c-gateway/core"]);
    expect(w.emitted("update:selectedId")?.at(-1)).toEqual([FILE_ME]);
    w.unmount();
  });

  it("keeps the palette open, and says why, for a route whose handler the model does not have", async () => {
    vi.useFakeTimers();
    try {
      const w = await mountMap();
      await openGoTo(w, "/v1/gone");
      expect(rowText(w)).toEqual(["GET /v1/gone L5"]);
      await pressEnter(w);
      vi.advanceTimersByTime(150);
      await nextTick();

      expect(w.find(".tux-map__goto-dialog").exists()).toBe(true);
      expect(levelText(w)).toContain("Level 2");
      expect(w.findAll(".tux-map__sr").map((n) => n.text()).join(" ")).toContain("GET /v1/gone is not on this map.");
      w.unmount();
    } finally {
      vi.useRealTimers();
    }
  });
});
