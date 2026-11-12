/**
 * The Go-To index's route entries (`tti/tti-ux#205`). A producer can name one route in three
 * places: a `route` element, the `tech` of the function that handles it, and `model.routes`.
 * The index lists it once, and every entry opens something the model has, also while the
 * handler's subgraph has not been loaded.
 */
import { describe, expect, it } from "vitest";
import {
  buildMapParentIndex,
  buildMapSearchIndex,
  buildMapSearchIndexKept,
  mergeLazyMapSubgraphs,
  searchArchitectureMap,
  type TuxMapLevelModel,
  type TuxMapSearchEntry,
  type TuxMapSubgraph,
} from "../app/utils/tuxArchitectureMap";

const R = "acme/app";
const ROUTE_ME = `${R}:r:me`;
const ROUTE_CTX = `${R}:r:repo_context`;
const FILE_ME = `${R}:f:bff/routes/me.py`;
const FN_WHOAMI = `${R}:s:bff/routes/me.py#whoami`;
const FN_CTX = `${R}:s:bff/routes/me.py#ctx`;
const FN_STATUS = `${R}:s:bff/routes/me.py#status`;

const meSymbols = (): TuxMapSubgraph => ({
  stratum: "Functions and classes",
  elements: [
    { id: FN_WHOAMI, kind: "symbol", name: "whoami()", tech: "GET /v1/me", source: { path: "bff/routes/me.py", symbol: "whoami" } },
    { id: FN_CTX, kind: "symbol", name: "ctx()", tech: "GET /v1/repos/{owner}/{repo}/context", source: { path: "bff/routes/me.py", symbol: "ctx" } },
    { id: FN_STATUS, kind: "symbol", name: "status()", tech: "GET /v1/status", source: { path: "bff/routes/me.py", symbol: "status" } },
  ],
});

/** `loaded` puts the file's functions in the model; without it they are what a host loads on demand. */
function model(loaded: boolean): TuxMapLevelModel {
  return {
    schema: "tux-map/1",
    level1: { elements: [{ id: "sys", kind: "system", name: "App" }], rels: [] },
    level2: { boundary: "sys", elements: [{ id: "c-gateway", kind: "container", name: "Gateway" }], rels: [] },
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
          { id: ROUTE_ME, kind: "route", name: "GET /v1/me" },
          { id: ROUTE_CTX, kind: "route", name: "GET /v1/repos/{owner}/{repo}/context" },
        ],
      },
      "c-gateway/core": {
        stratum: "Files",
        elements: [{ id: FILE_ME, kind: "module", name: "me.py", source: { path: "bff/routes/me.py" }, subgraphRef: FILE_ME }],
      },
      ...(loaded ? { [FILE_ME]: meSymbols() } : {}),
    },
    links: [
      { from: ROUTE_ME, to: FN_WHOAMI, kind: "handled-by" },
      { from: ROUTE_CTX, to: FN_CTX, kind: "handled-by" },
    ],
    routes: [
      { method: "GET", pattern: "/v1/me", handler: FN_WHOAMI, framework: "gateway" },
      // the table writes this one as the router matches it, the element as a person reads it
      { method: "GET", pattern: "/v1/repos/(?P<owner>[A-Za-z0-9_.-]+)/(?P<repo>[A-Za-z0-9_.-]+)/context", handler: FN_CTX, framework: "gateway" },
      // no route element for this one
      { method: "GET", pattern: "/v1/status", handler: FN_STATUS, framework: "gateway" },
      // and its handler is nowhere in the model
      { method: "GET", pattern: "/v1/gone", handler: "elsewhere#gone", framework: "gateway" },
    ],
  };
}

const routes = (entries: readonly TuxMapSearchEntry[]) => entries.filter((e) => e.group === "Routes");
const brief = (entries: readonly TuxMapSearchEntry[]) =>
  routes(entries).map((e) => ({ id: e.id, revealId: e.revealId, level: e.level }));

describe("the Go-To index's route entries (#205)", () => {
  it("lists a route once when an element, its handler's tech and model.routes all name it", () => {
    const entries = buildMapSearchIndex(model(true));
    expect(brief(entries)).toEqual([
      // the element's entry opens the handler, and says the level the handler is on
      { id: ROUTE_ME, revealId: FN_WHOAMI, level: 6 },
      { id: ROUTE_CTX, revealId: FN_CTX, level: 6 },
      // a route with no element keeps the entry its handler's tech gives
      { id: `route:GET /v1/status->${FN_STATUS}`, revealId: FN_STATUS, level: 6 },
      { id: "route:GET /v1/gone->elsewhere#gone", revealId: "elsewhere#gone", level: 5 },
    ]);
  });

  it("opens the route's own card while its handler's subgraph is not loaded, and the handler's file when it has no card", () => {
    const m = model(false);
    const entries = buildMapSearchIndex(m);
    expect(brief(entries)).toEqual([
      { id: ROUTE_ME, revealId: ROUTE_ME, level: 5 },
      { id: ROUTE_CTX, revealId: ROUTE_CTX, level: 5 },
      { id: `route:GET /v1/status->${FN_STATUS}`, revealId: FILE_ME, level: 5 },
      { id: "route:GET /v1/gone->elsewhere#gone", revealId: "elsewhere#gone", level: 5 },
    ]);
    // every entry but the last opens something the model has
    const parents = buildMapParentIndex(m);
    expect(routes(entries).map((e) => parents.has(e.revealId))).toEqual([true, true, true, false]);
  });

  it("finds a route by the name of a handler that is not loaded", () => {
    const hits = searchArchitectureMap(model(false), "whoami").flatHits.map((h) => h.entry.id);
    expect(hits).toEqual([ROUTE_ME]);
    const entry = routes(buildMapSearchIndex(model(false)))[0]!;
    expect(entry.handlerName).toBe("whoami");
    expect(entry.path).toBe("bff/routes/me.py");
  });

  it("gives the same index when the handler's subgraph arrives as when the model is read whole", () => {
    const raw = model(false);
    const first = mergeLazyMapSubgraphs(raw, Object.create(null));
    const kept = buildMapSearchIndexKept(first.model, buildMapParentIndex(first.model));
    const lazy: Record<string, TuxMapSubgraph> = Object.assign(Object.create(null), { [FILE_ME]: meSymbols() });
    const next = mergeLazyMapSubgraphs(raw, lazy, first);
    const parents = buildMapParentIndex(next.model);
    const arrived = buildMapSearchIndexKept(next.model, parents, kept, next.added);
    const whole = buildMapSearchIndexKept(next.model, parents);
    expect(arrived).toEqual(whole);
    expect(brief(arrived)).toEqual(brief(buildMapSearchIndex(model(true))));
  });

  it("gives the same index when a route element arrives after the handler that named its route", () => {
    const raw = model(true);
    const routesSg = raw.subgraphs!["c-gateway/routes"]!;
    delete raw.subgraphs!["c-gateway/routes"];
    raw.level3["c-gateway"]![0]!.subgraphRef = "c-gateway/routes";
    const first = mergeLazyMapSubgraphs(raw, Object.create(null));
    const kept = buildMapSearchIndexKept(first.model, buildMapParentIndex(first.model));
    // before the elements arrive, the handlers' tech is what lists the routes
    expect(routes(kept).map((e) => e.id)).toContain(`route:GET /v1/me->${FN_WHOAMI}`);
    const lazy: Record<string, TuxMapSubgraph> = Object.assign(Object.create(null), { "c-gateway/routes": routesSg });
    const next = mergeLazyMapSubgraphs(raw, lazy, first);
    const parents = buildMapParentIndex(next.model);
    const arrived = buildMapSearchIndexKept(next.model, parents, kept, next.added);
    expect(arrived).toEqual(buildMapSearchIndexKept(next.model, parents));
    expect(routes(arrived).filter((e) => e.name === "GET /v1/me").map((e) => e.id)).toEqual([ROUTE_ME]);
  });
});
