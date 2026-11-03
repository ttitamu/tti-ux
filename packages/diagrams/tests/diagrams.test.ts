import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import * as publishedMapRuntime from "../runtime/tuxArchitectureMap.mjs";
import { useTuxMermaid } from "../app/composables/useTuxMermaid";
import {
  resolveSemanticLoD,
  screenToWorld,
  worldToScreen,
  zoomAroundScreenPoint,
  getSmoothStepEdgePath,
  getBezierEdgePath,
  getStraightEdgePath,
  computeMapAutoLayout,
  computeDependencyBlastRadius,
  resetArchitectureDeprecationWarnings,
  getSmoothedFreehandSvgPath,
  getLaserPointerSvgPath,
  gridCellToPx,
  routeGridWires,
  routeDeploymentWires,
  buildLevelModelFromLegacyNodes,
  buildUnifiedArchitectureGraph,
  getMapQueryIndex,
  queryArchitectureNodes,
  queryArchitectureImpact,
  findArchitecturePath,
  queryArchitectureLayer,
  queryMultiLevelBlastRadius,
  findShortestArchitecturePath,
  coordinateAcpSubgraphLease,
  buildMapParentIndex,
  levelForFocus,
  extractModelLinks,
  liftLinksToView,
  computeLinkBlastRadius,
  computeGraphDelta,
  classifyBlastLink,
  inferLinkCoupling,
  inferLinkPhase,
  normalizeArchitectureModelInput,
  suggestCloseNodeIds,
  TUX_MAP_LINK_STRENGTH_ORDER,
  DEFAULT_TTI_LEVEL_MODEL,
  type TuxMapBlastIntent,
  type TuxMapNode,
  type TuxMapEdge,
  type TuxMapGridCellRect,
  type TuxMapLevelModel,
} from "../app/utils/tuxArchitectureMap";

describe("@tti/tti-ux-diagrams composables and utilities", () => {
  it("provides useTuxMermaid with render and estimateHeight methods", () => {
    const { render, estimateHeight } = useTuxMermaid();
    expect(typeof render).toBe("function");
    expect(typeof estimateHeight).toBe("function");
  });

  it("calculates realistic layout-reservation heights based on code density", () => {
    const { estimateHeight } = useTuxMermaid();

    // Short code snippet (min bound is 140)
    const shortCode = "graph TD\n  A --> B";
    expect(estimateHeight(shortCode)).toBeGreaterThanOrEqual(140);

    // Multi-line code should grow dynamically
    const mediumCode = [
      "flowchart TD",
      "  A[Start] --> B[Process 1]",
      "  B --> C[Process 2]",
      "  C --> D[Decision]",
      "  D -->|Yes| E[End]",
      "  D -->|No| B",
    ].join("\n");
    const mediumHeight = estimateHeight(mediumCode);
    expect(mediumHeight).toBeGreaterThan(140);
    expect(mediumHeight).toBeLessThanOrEqual(720);

    // Extremely large code is capped at 720
    const hugeCode = Array.from({ length: 50 }, (_, i) => `  Node${i} --> Node${i + 1}`).join("\n");
    expect(estimateHeight(hugeCode)).toBe(720);
  });

  it("safely returns null during SSR / node rendering where document is undefined", async () => {
    const { render } = useTuxMermaid();
    const result = await render("graph TD; A-->B;", {
      id: "test-diagram-ssr",
      theme: "default",
    });
    // In node environment without browser DOM, returns null gracefully
    expect(result).toBeNull();
  });

  it("resolves semantic zoom Level-of-Detail (LoD) across executive, resources, and packages tiers", () => {
    expect(resolveSemanticLoD(0.45)).toBe("executive");
    expect(resolveSemanticLoD(0.85)).toBe("resources");
    expect(resolveSemanticLoD(1.45)).toBe("packages");
    expect(resolveSemanticLoD(0.45, "packages")).toBe("packages");
  });

  it("converts screen <-> world coordinates and zooms around a cursor focal point", () => {
    const vp = { x: 100, y: 50, zoom: 2 };
    const world = screenToWorld(300, 250, vp);
    expect(world).toEqual({ x: 100, y: 100 });
    expect(worldToScreen(world.x, world.y, vp)).toEqual({ x: 300, y: 250 });

    const zoomed = zoomAroundScreenPoint(vp, 1, 300, 250);
    expect(screenToWorld(300, 250, zoomed)).toEqual(world);
  });

  it("computes smoothstep and bezier SVG edge paths, auto-layout, and BFS blast-radius", () => {
    const step = getSmoothStepEdgePath({
      sourceX: 100,
      sourceY: 100,
      sourcePosition: "right",
      targetX: 400,
      targetY: 220,
      targetPosition: "left",
    });
    expect(step.path).toContain("M100.0 100.0");
    expect(step.labelX).toBeGreaterThan(100);

    const bezier = getBezierEdgePath({
      sourceX: 100,
      sourceY: 100,
      targetX: 400,
      targetY: 220,
    });
    expect(bezier.path).toContain("C");

    const straight = getStraightEdgePath({
      sourceX: 100,
      sourceY: 100,
      targetX: 400,
      targetY: 220,
    });
    expect(straight.path).toBe("M100.0,100.0 L400.0,220.0");
    expect(straight.labelX).toBe(250);
    expect(straight.labelY).toBe(160);

    const nodes: TuxMapNode[] = [
      { id: "a", name: "Portal", status: "ok", summary: "A", resources: [], packages: [] },
      { id: "b", name: "API", status: "ok", summary: "B", resources: [], packages: [] },
      { id: "c", name: "DB", status: "ok", summary: "C", resources: [], packages: [] },
    ];
    const edges: TuxMapEdge[] = [
      { id: "e1", source: "a", target: "b" },
      { id: "e2", source: "b", target: "c" },
    ];

    const layout = computeMapAutoLayout(nodes, edges, "resources");
    expect(layout.get("a")!.x).toBeLessThan(layout.get("b")!.x);
    expect(layout.get("b")!.x).toBeLessThan(layout.get("c")!.x);

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const blast = computeDependencyBlastRadius("b", edges);
      expect([...blast.upstreamNodeIds]).toEqual(["a"]);
      expect([...blast.downstreamNodeIds]).toEqual(["c"]);
      expect(blast.activeEdgeIds.size).toBe(2);
    } finally {
      warnSpy.mockRestore();
    }
  });

  it("generates smoothed freehand ink and decaying laser pointer SVG paths", () => {
    const now = Date.now();
    const pts = [
      { x: 10, y: 10, pressure: 0.5, timestamp: now - 200 },
      { x: 40, y: 25, pressure: 0.6, timestamp: now - 100 },
      { x: 80, y: 60, pressure: 0.7, timestamp: now - 20 },
      { x: 120, y: 90, pressure: 0.5, timestamp: now },
    ];
    const inkPath = getSmoothedFreehandSvgPath(pts, { size: 8 });
    expect(inkPath.startsWith("M")).toBe(true);
    expect(inkPath.endsWith("Z")).toBe(true);

    const laserPath = getLaserPointerSvgPath(pts, now, 7, 1000, 48);
    expect(laserPath.startsWith("M")).toBe(true);

    // Expired laser points should produce empty path
    const expiredLaser = getLaserPointerSvgPath(pts, now + 5000, 7, 1000, 48);
    expect(expiredLaser).toBe("");
  });

  it("routes orthogonal gap wires across Level 1, Level 2, Level 3, and Level 4 without overlapping cards", () => {
    const rects: Record<string, TuxMapGridCellRect> = {};
    for (const el of DEFAULT_TTI_LEVEL_MODEL.level2.elements) {
      if (el.at) {
        const pos = gridCellToPx(el.at);
        rects[el.id] = { x: pos.x, y: pos.y, w: 224, h: 120, c: el.at[0], r: el.at[1] };
      }
    }
    const level2Routed = routeGridWires(
      DEFAULT_TTI_LEVEL_MODEL.level2.rels,
      rects,
      DEFAULT_TTI_LEVEL_MODEL.level2.elements,
    );
    expect(level2Routed.wires.length).toBeGreaterThan(5);
    expect(level2Routed.wires[0]!.d.startsWith("M")).toBe(true);

    // Verify that all wire labels (both always-visible and hover-forced) do not overlap each other
    for (let i = 0; i < level2Routed.labels.length; i++) {
      const l1 = level2Routed.labels[i]!;
      for (let j = i + 1; j < level2Routed.labels.length; j++) {
        const l2 = level2Routed.labels[j]!;
        const overlapX = Math.max(0, Math.min(l1.x + l1.w, l2.x + l2.w) - Math.max(l1.x, l2.x));
        const overlapY = Math.max(0, Math.min(l1.y + l1.h, l2.y + l2.h) - Math.max(l1.y, l2.y));
        expect(overlapX * overlapY).toBe(0);
      }
    }

    const deployRects: Record<string, TuxMapGridCellRect> = {
      "app-vm-01": { x: 28, y: 80, w: 210, h: 92 },
      "worker-node-01": { x: 254, y: 80, w: 210, h: 92 },
      "ai-search-app": { x: 520, y: 80, w: 210, h: 92 },
      "blob-backup-store": { x: 520, y: 200, w: 210, h: 92 },
    };
    const level4Wires = routeDeploymentWires(
      DEFAULT_TTI_LEVEL_MODEL.level4.links,
      deployRects,
      "app-vm-01",
    );
    expect(level4Wires.length).toBeGreaterThan(0);

    const converted = buildLevelModelFromLegacyNodes(
      [
        {
          id: "sys-a",
          name: "System A",
          status: "ok",
          summary: "Core service",
          resources: [{ id: "r1", kind: "container", name: "API Container", spec: "Go 1.24" }],
          packages: [{ name: "chi", version: "5.0.0", scope: "runtime" }],
        },
        {
          id: "sys-b",
          name: "System B",
          status: "ok",
          summary: "Storage",
          resources: [{ id: "r2", kind: "database", name: "PG 16", spec: "NVMe" }],
          packages: [],
        },
      ],
      [{ id: "e1", source: "sys-a", target: "sys-b", protocol: "TCP :5432" }],
    );
    expect(converted.level1.elements.length).toBeGreaterThanOrEqual(2);
    expect(converted.level2.elements.length).toBeGreaterThanOrEqual(2);
    expect(converted.level3["sys-a"]?.length).toBeGreaterThan(0);
    expect(converted.level4.nodes.length).toBe(2);
  });

  it("queries unified architecture nodes, impact blast radius, and directed paths (#111)", () => {
    const cpg = buildUnifiedArchitectureGraph(DEFAULT_TTI_LEVEL_MODEL);
    expect(cpg.nodes.size).toBeGreaterThan(25);
    expect(cpg.edges.length).toBeGreaterThan(25);

    const lvl5 = queryArchitectureNodes(DEFAULT_TTI_LEVEL_MODEL, {
      focusId: "ai-search-app",
    });
    expect(lvl5.nodeCount).toBeGreaterThanOrEqual(4);

    // Downstream is off by default and opt-in through `includeDownstream: true`
    const defaultImpact = queryArchitectureImpact("c-api", DEFAULT_TTI_LEVEL_MODEL, { maxHops: 2 });
    expect("error" in defaultImpact).toBe(false);
    if (!("error" in defaultImpact)) {
      expect(defaultImpact.descendantIds).toContain("c-api/1");
      expect(defaultImpact.hits.some((u) => u.id === "c-edge" || u.id === "c-web")).toBe(true);
      expect(defaultImpact.hits[0]?.node).toBeUndefined(); // compact by default
      expect(defaultImpact.downstreamIncluded).toBe(false);
      expect(defaultImpact.downstreamDependencies).toEqual([]);
      expect(defaultImpact.impactedSourceFiles.some((f) => f.path.includes("services/api"))).toBe(true);
    }

    const withDownstream = queryArchitectureImpact("c-api", DEFAULT_TTI_LEVEL_MODEL, {
      maxHops: 2,
      includeDownstream: true,
      compact: false,
    });
    expect("error" in withDownstream).toBe(false);
    if (!("error" in withDownstream)) {
      expect(withDownstream.downstreamIncluded).toBe(true);
      expect(withDownstream.downstreamDependencies.some((d) => d.id === "c-db" || d.id === "c-cache")).toBe(true);
      expect(withDownstream.hits[0]?.node).toBeDefined();
    }

    const forwardPath = findArchitecturePath("p-users", "c-db", DEFAULT_TTI_LEVEL_MODEL);
    expect("error" in forwardPath).toBe(false);
    if (!("error" in forwardPath)) {
      expect(forwardPath.found).toBe(true);
      expect(forwardPath.hops).toBeGreaterThanOrEqual(2);
    }

    // Reverse path `c-db -> p-users` is false unless `{ direction: "upstream" }` is requested
    const reverseBlocked = findArchitecturePath("c-db", "p-users", DEFAULT_TTI_LEVEL_MODEL);
    expect("error" in reverseBlocked).toBe(false);
    if (!("error" in reverseBlocked)) {
      expect(reverseBlocked.found).toBe(false);
    }

    const reverseAllowed = findArchitecturePath("c-db", "p-users", DEFAULT_TTI_LEVEL_MODEL, {
      direction: "upstream",
    });
    expect("error" in reverseAllowed).toBe(false);
    if (!("error" in reverseAllowed)) {
      expect(reverseAllowed.found).toBe(true);
      expect(reverseAllowed.nodeIds[0]).toBe("c-db");
      expect(reverseAllowed.nodeIds.at(-1)).toBe("p-users");
    }
  });

  // A model with code levels: container c-api → component c-api/routes → file f:routes.py → its
  // functions, and component c-api/core → file f:forge.py → check(); a page outside, in c-web.
  const codeModel: TuxMapLevelModel = {
    level1: { elements: [{ id: "sys", kind: "system", name: "System" }], rels: [] },
    level2: {
      boundary: "sys",
      elements: [
        { id: "c-api", kind: "container", name: "API" },
        { id: "c-web", kind: "container", name: "Web" },
      ],
      rels: [],
    },
    level3: {
      "c-api": [
        { id: "c-api/routes", name: "Routes" },
        { id: "c-api/core", name: "Core" },
      ],
      "c-web": [{ id: "c-web/pages", name: "Pages" }],
    },
    level4: { groups: [], nodes: [], links: [] },
    subgraphs: {
      "c-api/routes": { elements: [{ id: "f:routes.py", kind: "module", name: "routes.py" }] },
      "c-api/core": { elements: [{ id: "f:forge.py", kind: "module", name: "forge.py" }] },
      "c-web/pages": { elements: [{ id: "f:page.js", kind: "module", name: "page.js" }] },
      "f:routes.py": {
        elements: [
          { id: "s:routes.py#data", kind: "symbol", name: "data()" },
          { id: "s:routes.py#who", kind: "symbol", name: "who()" },
        ],
      },
      "f:forge.py": { elements: [{ id: "s:forge.py#check", kind: "symbol", name: "check()" }] },
    },
    links: [
      { from: "s:routes.py#data", to: "s:routes.py#who", kind: "calls" },
      { from: "s:routes.py#who", to: "s:forge.py#check", kind: "calls" },
      { from: "f:page.js", to: "s:routes.py#data", kind: "calls", at: "page.js:12" },
      { from: "f:test_routes.py", to: "s:routes.py#data", kind: "tests", stop: true },
      { from: "f:runbook.md", to: "f:page.js", kind: "mentions", stop: true },
    ],
  };

  it("indexes every element below Level 2 under its parent", () => {
    const parentOf = buildMapParentIndex(codeModel);
    expect(parentOf.get("c-api/routes")).toBe("c-api");
    expect(parentOf.get("f:routes.py")).toBe("c-api/routes");
    expect(parentOf.get("s:routes.py#who")).toBe("f:routes.py");
  });

  it("lifts code links onto a view: wires between its cards, and outside cards at their depth", () => {
    const parentOf = buildMapParentIndex(codeModel);
    // inside routes.py: data() calls who(); page.js calls in; who() calls out to check() in forge.py
    const view = liftLinksToView(codeModel.links!, "f:routes.py", ["s:routes.py#data", "s:routes.py#who"], parentOf);
    expect(view.rels).toEqual([{ from: "s:routes.py#data", to: "s:routes.py#who", label: "calls" }]);
    expect(view.ins.map((o) => o.id)).toEqual(["f:page.js"]);
    expect(view.ins[0]!.wires).toEqual([{ kid: "s:routes.py#data", label: "calls" }]);
    expect(view.outs.map((o) => o.id)).toEqual(["s:forge.py#check"]);
    // inside the API container: the routes component calls the core component
    const l3 = liftLinksToView(codeModel.links!, "c-api", ["c-api/routes", "c-api/core"], parentOf);
    expect(l3.rels).toEqual([{ from: "c-api/routes", to: "c-api/core", label: "calls" }]);
  });

  it("puts the outside cards a change travels through before the busier ones that only check", () => {
    const parentOf = buildMapParentIndex(codeModel);
    const links = [
      ...codeModel.links!,
      { from: "f:ci.yml", to: "s:routes.py#data", kind: "checks", stop: true },
      { from: "f:ci.yml", to: "s:routes.py#who", kind: "checks", stop: true },
    ];
    const view = liftLinksToView(links, "f:routes.py", ["s:routes.py#data", "s:routes.py#who"], parentOf, {
      maxPerSide: 1,
      isKnown: (id) => id !== "f:test_routes.py",
    });
    expect(view.ins.map((o) => o.id)).toEqual(["f:page.js"]);
    expect(view.moreIns).toBe(1);
  });

  it("computes the blast radius of a selection upstream, stopping one step after a stopping link", () => {
    const parentOf = buildMapParentIndex(codeModel);
    // by default (quietSeedOnly = true), mentions are followed only from the seed, so runbook.md (which mentions page.js) is excluded
    const { hits } = computeLinkBlastRadius(codeModel.links!, "s:forge.py#check", parentOf);
    expect([...hits.entries()].map(([id, h]) => [id, h.hop])).toEqual([
      ["s:routes.py#who", 1],
      ["s:routes.py#data", 2],
      ["f:page.js", 3],
      ["f:test_routes.py", 3],
    ]);
    // opting into quietSeedOnly: false also includes downstream prose mentions one step off reached files
    const verbose = computeLinkBlastRadius(codeModel.links!, "s:forge.py#check", parentOf, {
      quietSeedOnly: false,
    });
    expect([...verbose.hits.entries()].map(([id, h]) => [id, h.hop])).toEqual([
      ["s:routes.py#who", 1],
      ["s:routes.py#data", 2],
      ["f:page.js", 3],
      ["f:test_routes.py", 3],
      ["f:runbook.md", 4],
    ]);
    // a container's radius starts from everything inside it; nothing inside counts as reached
    const api = computeLinkBlastRadius(codeModel.links!, "c-api", parentOf);
    expect(api.seeds.has("s:forge.py#check")).toBe(true);
    expect([...api.hits.keys()].sort()).toEqual(["f:page.js", "f:test_routes.py"]);
  });

  it("follows a part both kinds of link reach through the spreading one, so what depends on it is reached too", () => {
    // D checks B (stops) but also calls C (spreads); E calls D. B is reached first, at the same hop as C.
    const links = [
      { from: "B", to: "A", kind: "calls" },
      { from: "C", to: "A", kind: "calls" },
      { from: "D", to: "B", kind: "checks", stop: true },
      { from: "D", to: "C", kind: "calls" },
      { from: "E", to: "D", kind: "calls" },
    ];
    const { hits } = computeLinkBlastRadius(links, "A", new Map());
    expect(hits.get("D")).toMatchObject({ hop: 2, via: { from: "D", to: "C" } });
    expect(hits.get("E")?.hop).toBe(3);
  });

  it("draws an outside part both sides hold with each side's own count of links that spread", () => {
    const parentOf = new Map([
      ["k1", "v"],
      ["k2", "v"],
      ["v", "c"],
      ["o1", "w"],
      ["o2", "w"],
      ["w", "c"],
    ]);
    // k1 imports o1 (spreads, right side); o1 only tests k2 (stops, left side); o2 calls k2 once (spreads)
    const links = [
      { from: "k1", to: "o1", kind: "imports" },
      { from: "o1", to: "k2", kind: "tests", stop: true },
      { from: "o1", to: "k2", kind: "tests", stop: true },
      { from: "o2", to: "k2", kind: "calls" },
    ];
    const view = liftLinksToView(links, "v", ["k1", "k2"], parentOf);
    expect(view.outs.map((o) => [o.id, o.spreading])).toEqual([["o1", 1]]);
    // on the left, o2's one call comes before o1's two tests
    expect(view.ins.map((o) => [o.id, o.spreading])).toEqual([
      ["o2", 1],
      ["o1", 0],
    ]);
  });

  it("adds code links to the unified graph the MCP tools query", () => {
    const { edges } = buildUnifiedArchitectureGraph(codeModel);
    expect(edges.some((e) => e.from === "f:page.js" && e.to === "s:routes.py#data" && e.label === "calls")).toBe(true);
    expect(edges.some((e) => e.from === "s:routes.py#who" && e.to === "s:forge.py#check" && e.label === "calls")).toBe(true);
    // a link from a part the model does not hold (the test file) is left out
    expect(edges.some((e) => e.from === "f:test_routes.py")).toBe(false);
    // WeakMap query index memoizes repeated queries on the same model object
    expect(getMapQueryIndex(codeModel)).toBe(getMapQueryIndex(codeModel));
  });

  it("passes every level, blast-radius, and branch-delta case in the published map-conformance.json fixture (#110)", () => {
    const pkgJson = JSON.parse(
      readFileSync(join(import.meta.dirname, "../package.json"), "utf8"),
    ) as { files?: string[] };
    expect(pkgJson.files).toContain("tests/fixtures/map-conformance.json");

    const fixture = JSON.parse(
      readFileSync(join(import.meta.dirname, "fixtures/map-conformance.json"), "utf8"),
    ) as {
      schemaVersion: string;
      models: Record<string, TuxMapLevelModel>;
      levelChecks: Array<{
        id: string;
        model: string;
        expectedLevels: Record<string, number>;
        expectedLevel7Ids?: string[];
        expectedFocusLevels?: Record<string, number>;
        expectedParent?: Record<string, string>;
      }>;
      blastCases: Array<{
        id: string;
        model: string;
        useExtractedModelLinks?: boolean;
        seeds: string[];
        opts: {
          maxHops?: number;
          quietSeedOnly?: boolean;
          kinds?: string[];
          intent?: TuxMapBlastIntent;
        };
        expected: {
          truncated: boolean;
          hits?: Array<{ id: string; hop: number; kind?: string; at?: string; sites?: number[] }>;
          hitCount?: number;
          firstHit?: { id: string; hop: number };
          lastHit?: { id: string; hop: number };
          blockers?: string[];
          coCutCandidates?: string[];
          testsToRun?: string[];
          stampsToRebuild?: string[];
          buildExecImpacted?: string[];
          hostsImpacted?: string[];
        };
      }>;
      deltaCases: Array<{
        id: string;
        baseModel: TuxMapLevelModel;
        headModel: TuxMapLevelModel;
        expected: {
          addedIds: string[];
          deletedIds: string[];
          movedIds: string[];
          movedPairs?: Array<{ id: string; previousId: string }>;
          sigChangedIds: string[];
          bodyPatchedIds: string[];
          blastSeedIds: string[];
          recommendedIntent: TuxMapBlastIntent;
          addedWires: Array<{ from: string; to: string; kind: string }>;
          removedWires: Array<{ from: string; to: string; kind: string }>;
          danglingWires: Array<{ from: string; to: string; kind: string }>;
          ghostChecks?: Array<{
            location: "level1" | "level2" | "level3" | "level4" | "subgraph" | "inline" | "l4-inline";
            parentId?: string;
            id: string;
            changeType: string;
          }>;
          absentSubgraphKeys?: string[];
        };
      }>;
    };

    expect(fixture.schemaVersion).toBe("1.0.0");

    for (const lc of fixture.levelChecks) {
      const m = fixture.models[lc.model]!;
      const cpg = buildUnifiedArchitectureGraph(m);
      const parentOf = buildMapParentIndex(m);
      for (const [nodeId, expLvl] of Object.entries(lc.expectedLevels)) {
        expect(cpg.nodes.get(nodeId)?.level, `${lc.id}: level(${nodeId})`).toBe(expLvl);
      }
      if (lc.expectedLevel7Ids) {
        const l7 = queryArchitectureNodes(m, { level: 7 });
        expect(l7.nodes.map((n) => n.id).sort(), `${lc.id}: level 7 query`).toEqual(
          lc.expectedLevel7Ids,
        );
      }
      if (lc.expectedFocusLevels) {
        for (const [fid, expFocusLvl] of Object.entries(lc.expectedFocusLevels)) {
          expect(levelForFocus(fid, m, parentOf), `${lc.id}: levelForFocus(${fid})`).toBe(
            expFocusLvl,
          );
        }
      }
      if (lc.expectedParent) {
        for (const [cid, expPid] of Object.entries(lc.expectedParent)) {
          expect(parentOf.get(cid), `${lc.id}: parentOf(${cid})`).toBe(expPid);
        }
      }
    }

    for (const bc of fixture.blastCases) {
      const m = fixture.models[bc.model]!;
      const parentOf = buildMapParentIndex(m);
      const links = bc.useExtractedModelLinks ? extractModelLinks(m) : m.links ?? [];
      const res = computeLinkBlastRadius(links, bc.seeds, parentOf, {
        ...bc.opts,
        model: m,
      });
      expect(res.truncated, `${bc.id}: truncated`).toBe(bc.expected.truncated);
      const actualHits = [...res.hits.entries()].map(([id, h]) => ({
        id,
        hop: h.hop,
        ...(h.via.kind !== undefined ? { kind: h.via.kind } : {}),
        ...(h.at !== undefined ? { at: h.at } : {}),
        ...(h.sites !== undefined ? { sites: h.sites } : {}),
      }));
      if (bc.expected.hits) {
        expect(actualHits, `${bc.id}: hits`).toEqual(bc.expected.hits);
      }
      if (bc.expected.hitCount !== undefined) {
        expect(actualHits.length, `${bc.id}: hitCount`).toBe(bc.expected.hitCount);
      }
      if (bc.expected.firstHit) {
        expect(
          { id: actualHits[0]?.id, hop: actualHits[0]?.hop },
          `${bc.id}: firstHit`,
        ).toEqual(bc.expected.firstHit);
      }
      if (bc.expected.lastHit) {
        const last = actualHits.at(-1);
        expect({ id: last?.id, hop: last?.hop }, `${bc.id}: lastHit`).toEqual(
          bc.expected.lastHit,
        );
      }
      if (bc.expected.blockers) expect(res.blockers, `${bc.id}: blockers`).toEqual(bc.expected.blockers);
      if (bc.expected.coCutCandidates) {
        expect(res.coCutCandidates, `${bc.id}: coCutCandidates`).toEqual(bc.expected.coCutCandidates);
      }
      if (bc.expected.testsToRun) {
        expect(res.testsToRun, `${bc.id}: testsToRun`).toEqual(bc.expected.testsToRun);
      }
      if (bc.expected.stampsToRebuild) {
        expect(res.stampsToRebuild, `${bc.id}: stampsToRebuild`).toEqual(bc.expected.stampsToRebuild);
      }
      if (bc.expected.buildExecImpacted) {
        expect(res.buildExecImpacted, `${bc.id}: buildExecImpacted`).toEqual(bc.expected.buildExecImpacted);
      }
      if (bc.expected.hostsImpacted) {
        expect(res.hostsImpacted, `${bc.id}: hostsImpacted`).toEqual(bc.expected.hostsImpacted);
      }

      // Section 8 contract parity (#111): on EVERY case in #110's conformance fixture,
      // `queryArchitectureImpact` and `computeLinkBlastRadius` return the exact same node set and triage buckets.
      const qImpact = queryArchitectureImpact(bc.seeds, m, {
        ...bc.opts,
        bridgeUncovered: Boolean(bc.useExtractedModelLinks),
      });
      expect("error" in qImpact, `${bc.id}: queryArchitectureImpact succeeded`).toBe(false);
      if (!("error" in qImpact)) {
        expect(qImpact.truncated, `${bc.id}: queryArchitectureImpact.truncated`).toBe(res.truncated);
        expect(
          qImpact.hits.map((h) => ({ id: h.id, hop: h.hop })),
          `${bc.id}: queryArchitectureImpact exact node set & hops`,
        ).toEqual(actualHits.map((h) => ({ id: h.id, hop: h.hop })));
        expect(qImpact.blockers, `${bc.id}: queryArchitectureImpact.blockers`).toEqual(res.blockers);
        expect(qImpact.coCutCandidates, `${bc.id}: queryArchitectureImpact.coCutCandidates`).toEqual(
          res.coCutCandidates,
        );
        expect(qImpact.testsToRun, `${bc.id}: queryArchitectureImpact.testsToRun`).toEqual(res.testsToRun);
        expect(qImpact.stampsToRebuild, `${bc.id}: queryArchitectureImpact.stampsToRebuild`).toEqual(
          res.stampsToRebuild,
        );
        expect(qImpact.buildExecImpacted, `${bc.id}: queryArchitectureImpact.buildExecImpacted`).toEqual(
          res.buildExecImpacted,
        );
        expect(qImpact.hostsImpacted, `${bc.id}: queryArchitectureImpact.hostsImpacted`).toEqual(
          res.hostsImpacted,
        );
      }

      // Also verify default `bridgeUncovered: true` matches on all 19 conformance blastCases
      const qImpactDefault = queryArchitectureImpact(bc.seeds, m, bc.opts);
      expect("error" in qImpactDefault, `${bc.id}: queryArchitectureImpact default bridge`).toBe(false);
      if (!("error" in qImpactDefault)) {
        expect(
          qImpactDefault.hits.map((h) => h.id),
          `${bc.id}: queryArchitectureImpact default node set`,
        ).toEqual(actualHits.map((h) => h.id));
      }
    }

    for (const dc of fixture.deltaCases) {
      const delta = computeGraphDelta(dc.baseModel, dc.headModel);
      expect(delta.addedIds, `${dc.id}: addedIds`).toEqual(dc.expected.addedIds);
      expect(delta.deletedIds, `${dc.id}: deletedIds`).toEqual(dc.expected.deletedIds);
      expect(delta.movedIds, `${dc.id}: movedIds`).toEqual(dc.expected.movedIds);
      if (dc.expected.movedPairs) {
        const gotPairs = delta.nodeChanges
          .filter((c) => c.change === "moved" && c.previousId)
          .map((c) => ({ id: c.id, previousId: c.previousId! }));
        expect(gotPairs, `${dc.id}: movedPairs`).toEqual(dc.expected.movedPairs);
      }
      expect(delta.sigChangedIds, `${dc.id}: sigChangedIds`).toEqual(dc.expected.sigChangedIds);
      expect(delta.bodyPatchedIds, `${dc.id}: bodyPatchedIds`).toEqual(dc.expected.bodyPatchedIds);
      expect(delta.blastSeedIds, `${dc.id}: blastSeedIds`).toEqual(dc.expected.blastSeedIds);
      expect(delta.recommendedIntent, `${dc.id}: recommendedIntent`).toBe(
        dc.expected.recommendedIntent,
      );
      expect(
        delta.addedWires.map((w) => ({ from: w.from, to: w.to, kind: w.kind })),
        `${dc.id}: addedWires`,
      ).toEqual(dc.expected.addedWires);
      expect(
        delta.removedWires.map((w) => ({ from: w.from, to: w.to, kind: w.kind })),
        `${dc.id}: removedWires`,
      ).toEqual(dc.expected.removedWires);
      expect(
        delta.danglingWires.map((w) => ({ from: w.from, to: w.to, kind: w.kind })),
        `${dc.id}: danglingWires`,
      ).toEqual(dc.expected.danglingWires);

      for (const gc of dc.expected.ghostChecks ?? []) {
        let foundDiff: string | undefined;
        if (gc.location === "level1") {
          foundDiff = delta.mergedModel.level1.elements.find((e) => e.id === gc.id)?.diff?.changeType;
        } else if (gc.location === "level2") {
          foundDiff = delta.mergedModel.level2.elements.find((e) => !e.ref && e.id === gc.id)?.diff?.changeType;
        } else if (gc.location === "level3") {
          foundDiff = delta.mergedModel.level3[gc.parentId!]?.find((e) => e.id === gc.id)?.diff?.changeType;
        } else if (gc.location === "level4") {
          foundDiff = delta.mergedModel.level4.nodes.find((n) => n.id === gc.id)?.diff?.changeType;
        } else if (gc.location === "subgraph") {
          foundDiff = delta.mergedModel.subgraphs?.[gc.parentId!]?.elements.find((e) => e.id === gc.id)?.diff?.changeType;
        } else if (gc.location === "inline") {
          const allL3 = Object.values(delta.mergedModel.level3).flat();
          foundDiff = allL3.find((e) => e.id === gc.parentId)?.children?.find((c) => c.id === gc.id)?.diff?.changeType;
        } else if (gc.location === "l4-inline") {
          foundDiff = delta.mergedModel.level4.nodes.find((n) => n.id === gc.parentId)?.children?.find((c) => c.id === gc.id)?.diff?.changeType;
        }
        expect(foundDiff, `${dc.id}: ghostCheck ${gc.location}/${gc.id}`).toBe(gc.changeType);
      }

      for (const k of dc.expected.absentSubgraphKeys ?? []) {
        expect(Object.prototype.hasOwnProperty.call(delta.mergedModel.subgraphs ?? {}, k), `${dc.id}: absent subgraph ${k}`).toBe(false);
      }

      // Lightweight mode (`includeMergedModel: false`) returns identical delta metadata without cloning
      const slim = computeGraphDelta(dc.baseModel, dc.headModel, { includeMergedModel: false });
      expect(slim.blastSeedIds, `${dc.id}: slim blastSeedIds`).toEqual(delta.blastSeedIds);
      expect(slim.mergedModel, `${dc.id}: slim mergedModel reference`).toBe(dc.headModel);
    }
  });

  it("handles malformed maxHops, empty link endpoints, partial models, and cyclic d: subgraphs safely", () => {
    const cycModel: TuxMapLevelModel = {
      level1: { elements: [], rels: [] },
      level2: { boundary: "sys", elements: [], rels: [] },
      level3: {},
      level4: { groups: [], nodes: [], links: [] },
      subgraphs: {
        "d:cyc/a": { elements: [{ id: "d:cyc/b", kind: "module", name: "b" }] },
        "d:cyc/b": { elements: [{ id: "d:cyc/a", kind: "module", name: "a" }] },
      },
      links: [
        { from: "", to: "f:a.py", kind: "calls" },
        { from: "f:b.py", to: "", kind: "calls" },
        { from: "f:c.py", to: "f:a.py", kind: "calls" },
      ],
    };
    const parentOf = buildMapParentIndex(cycModel);
    expect(computeLinkBlastRadius(cycModel.links!, "f:a.py", parentOf, { maxHops: -5 }).hits.size).toBe(0);
    expect(computeLinkBlastRadius(cycModel.links!, "f:a.py", parentOf, { maxHops: Number.NaN }).hits.has("f:c.py")).toBe(true);
    expect(() => computeGraphDelta({} as TuxMapLevelModel, cycModel)).not.toThrow();
  });

  it("caps unknown-ID errors under 2 KB with <= 10 suggestions on a 2,500-node model, labels coarse-parent steps, supports paging, and warns once per deprecated API (#111)", () => {
    // 1. 2,500-node model: unknown ID returns < 2 KB and at most 10 ranked suggestions
    const largeElements = Array.from({ length: 2496 }, (_, i) => ({
      id: `f:packages/mod_${String(i).padStart(4, "0")}/service_${i}.ts`,
      kind: "module",
      name: `service_${i}.ts`,
      desc: "A".repeat(160),
    }));
    const largeModel: TuxMapLevelModel = {
      level1: { elements: [{ id: "sys-big", kind: "system", name: "Big System" }], rels: [] },
      level2: {
        boundary: "sys-big",
        elements: [{ id: "c-core", kind: "container", name: "Core Container" }],
        rels: [],
      },
      level3: {
        "c-core": [{ id: "c-core/app", kind: "component", name: "App Component" }],
      },
      level4: {
        groups: [{ id: "rg-1", zone: "cloud-prod", title: "rg-1" }],
        nodes: [{ id: "vm-1", group: "rg-1", kind: "vm", title: "vm-1", role: "Host", hosts: ["c-core"] }],
        links: [],
      },
      subgraphs: {
        "c-core/app": { elements: largeElements },
      },
      links: [],
    };
    expect(buildUnifiedArchitectureGraph(largeModel).nodes.size).toBeGreaterThanOrEqual(2500);

    const errImpact = queryArchitectureImpact("service_12", largeModel);
    expect("error" in errImpact).toBe(true);
    if ("error" in errImpact) {
      const bytes = Buffer.byteLength(JSON.stringify(errImpact), "utf8");
      expect(bytes).toBeLessThan(2048);
      expect(errImpact.suggestions.length).toBeGreaterThan(0);
      expect(errImpact.suggestions.length).toBeLessThanOrEqual(10);
      expect(errImpact.suggestions.some((s) => s.includes("service_12"))).toBe(true);
    }

    // Adversarial 5,000-byte unknown ID still stays under 2 KB
    const errHuge = findArchitecturePath("x".repeat(5000), "c-core", largeModel);
    expect("error" in errHuge).toBe(true);
    if ("error" in errHuge) {
      expect(Buffer.byteLength(JSON.stringify(errHuge), "utf8")).toBeLessThan(2048);
      expect(errHuge.suggestions.length).toBeLessThanOrEqual(10);
    }

    // 2. Paging & compact node/impact queries
    const pagedNodes = queryArchitectureNodes(largeModel, {
      focusId: "c-core/app",
      compact: true,
      limit: 25,
      offset: 10,
    });
    expect(pagedNodes.totalNodeCount).toBe(2497);
    expect(pagedNodes.nodeCount).toBe(25);
    expect(pagedNodes.offset).toBe(10);
    expect(pagedNodes.hasMore).toBe(true);
    expect("desc" in pagedNodes.nodes[0]!).toBe(false);

    // 3. C4-only coarse-parent step is never added to `seeds` and is explicitly labelled
    const coarseRes = queryArchitectureImpact("c-api/0", DEFAULT_TTI_LEVEL_MODEL);
    expect("error" in coarseRes).toBe(false);
    if (!("error" in coarseRes)) {
      expect(coarseRes.seeds).toEqual(["c-api/0"]);
      expect(coarseRes.coarseParentSteps).toEqual([
        {
          seedId: "c-api/0",
          parentId: "c-api",
          reason: "Component has no direct links; stepped via enclosing container C4 relationships.",
        },
      ]);
      expect(coarseRes.hits.length).toBeGreaterThan(0);
      expect(coarseRes.hits.every((h) => h.coarseParentVia === "c-api")).toBe(true);
    }
    const noCoarse = queryArchitectureImpact("c-api/0", DEFAULT_TTI_LEVEL_MODEL, {
      allowCoarseParentStep: false,
    });
    if (!("error" in noCoarse)) {
      expect(noCoarse.hits).toEqual([]);
      expect(noCoarse.coarseParentSteps).toEqual([]);
    }

    // 4. Directed path descends, labelled, into code below an element without climbing child -> parent
    //    or fabricating transitive hops through unrelated sibling children of an intermediate container
    const descendPath = findArchitecturePath("ai-search-app", "ai-search-app/retriever/rrf", DEFAULT_TTI_LEVEL_MODEL);
    expect("error" in descendPath).toBe(false);
    if (!("error" in descendPath)) {
      expect(descendPath.found).toBe(true);
      expect(descendPath.edges.every((e) => e.kind === "parent-child" && e.label === "contains")).toBe(true);
    }
    const noClimbPath = findArchitecturePath("ai-search-app/retriever/rrf", "ai-search-app", DEFAULT_TTI_LEVEL_MODEL);
    expect("error" in noClimbPath).toBe(false);
    if (!("error" in noClimbPath)) {
      expect(noClimbPath.found).toBe(false);
    }
    const siblingLeakModel: TuxMapLevelModel = {
      level1: { elements: [{ id: "sys", kind: "system", name: "Sys" }], rels: [] },
      level2: {
        boundary: "sys",
        elements: [
          { id: "c-web", kind: "container", name: "Web" },
          { id: "c-api", kind: "container", name: "API" },
          { id: "c-vault", kind: "container", name: "Vault" },
        ],
        rels: [{ from: "c-web", to: "c-api", label: "Calls public router" }],
      },
      level3: {
        "c-api": [
          { id: "c-api/router", kind: "component", name: "Router" },
          { id: "c-api/audit", kind: "component", name: "Audit" },
        ],
      },
      level4: { groups: [], nodes: [], links: [] },
      links: [{ from: "c-api/audit", to: "c-vault", kind: "calls" }],
    };
    const siblingLeak = findArchitecturePath("c-web", "c-vault", siblingLeakModel);
    expect("error" in siblingLeak).toBe(false);
    if (!("error" in siblingLeak)) {
      expect(siblingLeak.found).toBe(false);
    }
    const ownCodeOut = findArchitecturePath("c-api", "c-vault", siblingLeakModel);
    expect("error" in ownCodeOut).toBe(false);
    if (!("error" in ownCodeOut)) {
      expect(ownCodeOut.found).toBe(true);
      expect(ownCodeOut.edges[0]?.label).toBe("contains");
      expect(ownCodeOut.edges[1]?.label).toBe("calls");
    }

    // 5. `links` kind parity with code-graph.py (#706)
    expect(TUX_MAP_LINK_STRENGTH_ORDER.at(-2)).toBe("links");
    expect(TUX_MAP_LINK_STRENGTH_ORDER.at(-1)).toBe("mentions");
    expect(inferLinkCoupling({ from: "a", to: "b", kind: "links", stop: true })).toBe("contract");
    expect(inferLinkPhase({ from: "a", to: "b", kind: "links", stop: true })).toBe("client-bundle");

    // 6. All 5 deprecated functions emit a single console.warn once and still return backwards-compatible results
    resetArchitectureDeprecationWarnings();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const rLayer1 = queryArchitectureLayer(DEFAULT_TTI_LEVEL_MODEL, { level: 2 });
      const rLayer2 = queryArchitectureLayer(DEFAULT_TTI_LEVEL_MODEL, { level: 2 });
      expect(rLayer1.nodeCount).toBeGreaterThan(0);
      expect(rLayer2.nodeCount).toBe(rLayer1.nodeCount);
      expect(warnSpy).toHaveBeenCalledTimes(1);

      const rBlast1 = queryMultiLevelBlastRadius("c-api", DEFAULT_TTI_LEVEL_MODEL, 1);
      queryMultiLevelBlastRadius("c-api", DEFAULT_TTI_LEVEL_MODEL, 1);
      expect("error" in rBlast1).toBe(false);
      expect(warnSpy).toHaveBeenCalledTimes(2);

      const rPath1 = findShortestArchitecturePath("p-users", "c-db", DEFAULT_TTI_LEVEL_MODEL);
      findShortestArchitecturePath("p-users", "c-db", DEFAULT_TTI_LEVEL_MODEL);
      expect("found" in rPath1 && rPath1.found).toBe(true);
      expect(warnSpy).toHaveBeenCalledTimes(3);

      const rDep1 = computeDependencyBlastRadius("b", [{ id: "e1", source: "a", target: "b" }]);
      computeDependencyBlastRadius("b", [{ id: "e1", source: "a", target: "b" }]);
      expect([...rDep1.upstreamNodeIds]).toEqual(["a"]);
      expect(warnSpy).toHaveBeenCalledTimes(4);

      const rLease1 = coordinateAcpSubgraphLease("acquire", { agentId: "a1", rootNodeId: "c-api" });
      const rLeaseConflict = coordinateAcpSubgraphLease("acquire", { agentId: "a2", rootNodeId: "c-api/1" });
      coordinateAcpSubgraphLease("release", { agentId: "a1" });
      expect(rLease1.acquired).toBe(true);
      expect(rLeaseConflict.acquired).toBe(false);
      expect(warnSpy).toHaveBeenCalledTimes(5);
    } finally {
      warnSpy.mockRestore();
    }
  });

  it("enforces Gate B hardening invariants across normalization, path isolation, intents, spoofing, multi-seed coarse steps, and cache stamps (#111)", () => {
    // F-04: Reject invalid intents instead of silently falling into supply-chain
    expect(() =>
      classifyBlastLink({ from: "a", to: "b", kind: "imports", coupling: "type-only" }, 0, "add" as TuxMapBlastIntent),
    ).toThrow(RangeError);
    const badIntentRes = queryArchitectureImpact("c-api", DEFAULT_TTI_LEVEL_MODEL, {
      intent: "add" as TuxMapBlastIntent,
    });
    expect("error" in badIntentRes).toBe(true);
    if ("error" in badIntentRes) {
      expect(Buffer.byteLength(JSON.stringify(badIntentRes), "utf8")).toBeLessThan(2048);
      expect(badIntentRes.suggestions).toContain("supply-chain");
    }

    // F-14 & S-05: kind='links' skipped under patch/supply-chain; spoofed build-exec/verification/ci-test rejected on calls
    const linkAndSpoofModel: TuxMapLevelModel = {
      level1: { elements: [{ id: "sys", kind: "system", name: "Sys" }], rels: [] },
      level2: {
        boundary: "sys",
        elements: [
          { id: "c-web", kind: "container", name: "Web", deployed: ["vm-web"] },
          { id: "c-api", kind: "container", name: "API", deployed: ["vm-api"] },
        ],
        rels: [],
      },
      level3: {},
      level4: {
        groups: [{ id: "rg", zone: "cloud-prod", title: "rg" }],
        nodes: [
          { id: "vm-web", group: "rg", kind: "vm", title: "vm-web", role: "Web", hosts: ["c-web"] },
          { id: "vm-api", group: "rg", kind: "vm", title: "vm-api", role: "API", hosts: ["c-api"] },
        ],
        links: [],
      },
      subgraphs: {
        "c-web": {
          elements: [
            { id: "f:web/nav.html", kind: "module", name: "nav.html", source: { path: "web/nav.html" } },
            { id: "f:web/caller.ts", kind: "module", name: "caller.ts", source: { path: "web/caller.ts" } },
          ],
        },
        "c-api": {
          elements: [{ id: "f:api/page.py", kind: "module", name: "page.py", source: { path: "api/page.py" } }],
        },
      },
      links: [
        { from: "f:web/nav.html", to: "f:api/page.py", kind: "links", stop: true },
        {
          from: "f:web/caller.ts",
          to: "f:api/page.py",
          kind: "calls",
          coupling: "build-exec",
          phase: "ci-test",
        },
      ],
    };
    const patchRes = queryArchitectureImpact("f:api/page.py", linkAndSpoofModel, { intent: "patch" });
    expect("error" in patchRes).toBe(false);
    if (!("error" in patchRes)) {
      expect(patchRes.blockers).toEqual(["f:web/caller.ts"]);
      expect(patchRes.hostsImpacted).toEqual(["vm-api", "vm-web"]);
    }
    const cutRes = queryArchitectureImpact("f:api/page.py", linkAndSpoofModel, { intent: "cut" });
    if (!("error" in cutRes)) {
      expect(cutRes.blockers).toEqual(["f:web/caller.ts", "f:web/nav.html"]);
    }

    // F-05a..d, N-03, S-11: findArchitecturePath & includeDownstream boundary/prose/hosts invariants
    const pClimb = findArchitecturePath("ai-search-app/retriever/embed", "ai-search-app", DEFAULT_TTI_LEVEL_MODEL);
    expect("found" in pClimb && pClimb.found).toBe(false);
    const pUsersDb = findArchitecturePath("p-users", "c-db", DEFAULT_TTI_LEVEL_MODEL);
    expect("found" in pUsersDb && pUsersDb.found).toBe(true);
    if (!("error" in pUsersDb)) {
      expect(pUsersDb.nodeIds).toContain("c-edge");
      expect(pUsersDb.nodeIds).not.toContain("s-platform");
    }

    const pathIsolationModel: TuxMapLevelModel = {
      level1: { elements: [{ id: "sys", kind: "system", name: "Sys" }], rels: [] },
      level2: {
        boundary: "sys",
        elements: [
          { id: "c-web", kind: "container", name: "Web" },
          { id: "c-api", kind: "container", name: "API" },
          { id: "c-vault", kind: "container", name: "Vault" },
        ],
        rels: [{ from: "c-web", to: "c-api", label: "Calls public router" }],
      },
      level3: {
        "c-api": [
          { id: "c-api/router", kind: "component", name: "Router" },
          { id: "c-api/audit", kind: "component", name: "Audit" },
        ],
      },
      level4: {
        groups: [{ id: "rg", zone: "cloud-prod", title: "rg" }],
        nodes: [{ id: "vm-api", group: "rg", kind: "vm", title: "API VM", role: "Host", hosts: ["c-api"] }],
        links: [],
      },
      links: [
        { from: "c-web", to: "c-api/audit", kind: "mentions", stop: true },
        { from: "c-api/audit", to: "c-vault", kind: "calls" },
      ],
    };
    const sibDescent = findArchitecturePath("c-web", "c-api/audit", pathIsolationModel);
    expect("found" in sibDescent && sibDescent.found).toBe(false);
    const proseLeak = findArchitecturePath("c-web", "c-vault", pathIsolationModel);
    expect("found" in proseLeak && proseLeak.found).toBe(false);
    const hostPath = findArchitecturePath("c-web", "vm-api", pathIsolationModel);
    expect("found" in hostPath && hostPath.found).toBe(true);
    const downImpact = queryArchitectureImpact("c-web", pathIsolationModel, { includeDownstream: true });
    if (!("error" in downImpact)) {
      expect(downImpact.downstreamDependencies.some((d) => d.id === "c-api/audit" || d.id === "c-vault")).toBe(false);
      expect(downImpact.downstreamDependencies.some((d) => d.id === "vm-api")).toBe(true);
    }

    // F-09 + Check 5a: Multi-seed coarseParentVia attribution, mixed seeds, and sibling host isolation
    const multiCoarseModel: TuxMapLevelModel = {
      level1: { elements: [{ id: "sys", kind: "system", name: "Sys" }], rels: [] },
      level2: {
        boundary: "sys",
        elements: [
          { id: "c-web", kind: "container", name: "Web" },
          { id: "c-cli", kind: "container", name: "CLI" },
          { id: "c-api", kind: "container", name: "API" },
          { id: "c-search", kind: "container", name: "Search" },
        ],
        rels: [
          { from: "c-web", to: "c-api", label: "HTTP" },
          { from: "c-cli", to: "c-search", label: "gRPC" },
        ],
      },
      level3: {
        "c-api": [
          { id: "c-api/0", kind: "component", name: "Router", deployed: ["vm-router"] },
          { id: "c-api/1", kind: "component", name: "Sibling Worker", deployed: ["vm-sibling"] },
        ],
        "c-search": [{ id: "c-search/0", kind: "component", name: "Indexer" }],
      },
      level4: {
        groups: [{ id: "rg", zone: "cloud-prod", title: "rg" }],
        nodes: [
          { id: "vm-router", group: "rg", kind: "vm", title: "vm-router", role: "Router" },
          { id: "vm-sibling", group: "rg", kind: "vm", title: "vm-sibling", role: "Sibling" },
        ],
        links: [],
      },
    };
    const multiCoarse = queryArchitectureImpact(["c-api/0", "c-search/0"], multiCoarseModel);
    expect("error" in multiCoarse).toBe(false);
    if (!("error" in multiCoarse)) {
      expect(multiCoarse.hits.find((h) => h.id === "c-web")?.coarseParentVia).toBe("c-api");
      expect(multiCoarse.hits.find((h) => h.id === "c-cli")?.coarseParentVia).toBe("c-search");
      expect(multiCoarse.hostsImpacted).toEqual(["vm-router"]);
    }
    const mixedCoarse = queryArchitectureImpact(["c-search/0", "c-api"], multiCoarseModel);
    if (!("error" in mixedCoarse)) {
      expect(mixedCoarse.hits.some((h) => h.id === "c-cli")).toBe(true);
      expect(mixedCoarse.hits.some((h) => h.id === "c-web")).toBe(true);
    }

    // F-13: focusId + level intersection & NaN limit clamp
    const focusLvl = queryArchitectureNodes(DEFAULT_TTI_LEVEL_MODEL, { focusId: "c-api", level: 3 });
    expect(focusLvl.nodes.length).toBeGreaterThan(0);
    expect(focusLvl.nodes.every((n) => n.level === 3)).toBe(true);
    expect(queryArchitectureNodes(DEFAULT_TTI_LEVEL_MODEL, { limit: Number.NaN }).nodeCount).toBe(0);

    // N-01: normalizeArchitectureModelInput on schema-2 architecture.json, CPG --json, code-map.json, and empty {}
    const schema2Norm = normalizeArchitectureModelInput(
      {
        schema: 2,
        generated_at: "2026-11-03T00:00:00Z",
        c4: {
          context: { elements: [{ id: "s-code", kind: "system", name: "Code", zoom: "containers" }], rels: [] },
          containers: {
            boundary: "s-code",
            elements: [{ id: "c-gw", kind: "container", name: "Gateway", zoom: "components" }],
            rels: [],
          },
          components: { "c-gw": [{ id: "c-gw/0", kind: "component", name: "BFF" }] },
        },
        groups: [{ id: "rg-1", zone: "cloud-prod", title: "rg-1" }],
        nodes: [{ id: "code-vm", group: "rg-1", kind: "vm", title: "VM", role: "Host", hosts: ["c-gw"] }],
        links: [],
        neighbors: [{ name: "other-vm", type: "VM", "resource group": "rg-1", reason: "Shared" }],
        code: {
          sourceBaseUrl: "https://example.org/src/main",
          subgraphs: { "c-gw/0": { elements: [{ id: "f:bff/main.py", kind: "module", name: "main.py" }] } },
          links: [],
        },
      },
      { allowEmpty: false },
    );
    expect(schema2Norm.level1.elements[0]?.zoom).toBe(2);
    expect(schema2Norm.level4.neighbors?.[0]?.resourceGroup).toBe("rg-1");
    expect(getMapQueryIndex(schema2Norm).nodes.has("f:bff/main.py")).toBe(true);

    const cpgNorm = normalizeArchitectureModelInput(
      {
        subgraphs: { "c-gw/0": { elements: [{ id: "f:bff/main.py", kind: "module", name: "main.py" }] } },
        links: [],
      },
      { allowEmpty: false },
    );
    expect(getMapQueryIndex(cpgNorm).nodes.has("c-gw/0")).toBe(true);
    expect(() => normalizeArchitectureModelInput({ rules: [{ match: "ops/**", inside: "code-vm" }] })).toThrow(
      /code-map\.json/,
    );
    expect(() => normalizeArchitectureModelInput({}, { allowEmpty: false })).toThrow(/0 indexed nodes/);

    // S-08, S-10, S-13, S-14: in-place mutation stamp, delta subgraphOwners + dn.title, NaN clamp
    const mutableModel: TuxMapLevelModel = {
      level1: { elements: [{ id: "sys", kind: "system", name: "Sys" }], rels: [] },
      level2: {
        boundary: "sys",
        elements: [
          { id: "c-a", kind: "container", name: "A" },
          { id: "c-b", kind: "container", name: "B" },
          { id: "c-c", kind: "container", name: "C" },
        ],
        rels: [{ from: "c-a", to: "c-b", label: "Calls" }],
      },
      level3: {},
      level4: { groups: [], nodes: [], links: [] },
    };
    expect("found" in findArchitecturePath("c-a", "c-b", mutableModel) && (findArchitecturePath("c-a", "c-b", mutableModel) as { found: boolean }).found).toBe(true);
    mutableModel.level2.rels[0]!.to = "c-c";
    expect("found" in findArchitecturePath("c-a", "c-b", mutableModel) && (findArchitecturePath("c-a", "c-b", mutableModel) as { found: boolean }).found).toBe(false);
    expect("found" in findArchitecturePath("c-a", "c-c", mutableModel) && (findArchitecturePath("c-a", "c-c", mutableModel) as { found: boolean }).found).toBe(true);

    const idxNodes = getMapQueryIndex(DEFAULT_TTI_LEVEL_MODEL).nodes;
    expect(suggestCloseNodeIds("c-api", idxNodes, Number.NaN).length).toBeGreaterThan(0);

    resetArchitectureDeprecationWarnings();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const nanLease = coordinateAcpSubgraphLease("acquire", {
        agentId: "nan-agent",
        rootNodeId: "c-db",
        ttlSeconds: Number.NaN,
      });
      expect(nanLease.acquired).toBe(true);
      coordinateAcpSubgraphLease("release", { agentId: "nan-agent" });
    } finally {
      warnSpy.mockRestore();
    }
  });

  it("requires --model in tux-mcp, omits architecture tools without a model, and matches map-conformance.json with a model (#112)", async () => {
    const repoRoot = join(import.meta.dirname, "..", "..", "..");
    const mcpScriptPath = join(repoRoot, "scripts", "tux-mcp.mjs");
    const fixturePath = join(import.meta.dirname, "fixtures", "map-conformance.json");
    const fixture = JSON.parse(readFileSync(fixturePath, "utf8")) as {
      models: Record<string, TuxMapLevelModel>;
      levelChecks: Array<{
        id: string;
        model: string;
        expectedLevels: Record<string, number>;
        expectedLevel7Ids?: string[];
      }>;
      blastCases: Array<{
        id: string;
        model: string;
        seeds: string[];
        useExtractedModelLinks?: boolean;
        opts?: {
          maxHops?: number;
          intent?: TuxMapBlastIntent;
          kinds?: string[];
          quietSeedOnly?: boolean;
          includePlanned?: boolean;
        };
      }>;
      deltaCases: Array<{
        id: string;
        baseModel: TuxMapLevelModel;
        headModel: TuxMapLevelModel;
        expected: {
          addedIds: string[];
          deletedIds: string[];
          movedIds: string[];
          sigChangedIds: string[];
          bodyPatchedIds: string[];
          blastSeedIds: string[];
          recommendedIntent: TuxMapBlastIntent;
          danglingWires: Array<{ from: string; to: string; kind: string }>;
        };
      }>;
    };

    // Published zero-dep ESM runtime exports the exact engine functions used by tux-mcp
    expect(typeof publishedMapRuntime.computeLinkBlastRadius).toBe("function");
    expect(typeof publishedMapRuntime.queryArchitectureImpact).toBe("function");

    // @ts-expect-error .mjs script import
    const mcpMod = await import("../../../scripts/tux-mcp.mjs");

    // 1. Without `--model`: architecture tools and `tux://architecture/c4-graph` are omitted
    const noModelServer = mcpMod.createTuxMcpServer();
    const noModelToolNames = noModelServer.getTools().map((t: { name: string }) => t.name);
    expect(noModelToolNames).toEqual([
      "tux_list_components",
      "tux_get_component",
      "tux_search_tokens",
      "tux_validate_contrast",
      "tux_audit_snippet",
    ]);
    const noModelResources = noModelServer.getResources().map((r: { uri: string }) => r.uri);
    expect(noModelResources).not.toContain("tux://architecture/c4-graph");
    expect(noModelResources).toContain("tux://architecture/layers-and-api");

    const blockedCall = noModelServer.handleRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name: "tux_query_architecture_impact", arguments: { seedIds: "c-api" } },
    });
    expect(blockedCall.error?.code).toBe(-32602);
    expect(blockedCall.error?.message).toContain("--model");

    const blockedRes = noModelServer.handleRequest({
      jsonrpc: "2.0",
      id: 2,
      method: "resources/read",
      params: { uri: "tux://architecture/c4-graph" },
    });
    expect(blockedRes.error?.code).toBe(-32602);
    expect(blockedRes.error?.message).toContain("--model");

    // Verify CLI subprocess without `--model` omits architecture tools on plain Node
    const cliNoModel = spawnSync(process.execPath, [mcpScriptPath, "--list-tools"], {
      encoding: "utf8",
    });
    expect(cliNoModel.status).toBe(0);
    const cliNoModelTools = (JSON.parse(cliNoModel.stdout) as Array<{ name: string }>).map(
      (t) => t.name,
    );
    expect(cliNoModelTools).toEqual(noModelToolNames);

    // Missing `--model` file fails fast with exit status 1
    const cliMissingModel = spawnSync(
      process.execPath,
      [mcpScriptPath, "--model", "/nonexistent/map-model-112.json", "--list-tools"],
      { encoding: "utf8" },
    );
    expect(cliMissingModel.status).toBe(1);
    expect(cliMissingModel.stderr).toContain("Architecture model file not found");

    // 2. With a model: every answer equals the contract across all conformance cases
    const primaryModel = fixture.models[fixture.blastCases[0]!.model]!;
    const modelServer = mcpMod.createTuxMcpServer({ model: primaryModel });
    const withModelToolNames = modelServer.getTools().map((t: { name: string }) => t.name);
    expect(withModelToolNames).toContain("tux_query_architecture_nodes");
    expect(withModelToolNames).toContain("tux_query_architecture_impact");
    expect(withModelToolNames).toContain("tux_find_architecture_path");
    expect(withModelToolNames).toContain("tux_compute_graph_delta");
    expect(withModelToolNames).not.toContain("tux_acp_subgraph_lease");

    for (const lc of fixture.levelChecks) {
      const m = fixture.models[lc.model]!;
      const srv = mcpMod.createTuxMcpServer({ model: m });
      for (const [nodeId, expLvl] of Object.entries(lc.expectedLevels)) {
        const nodeRes = srv.callTool("tux_query_architecture_nodes", { focusId: nodeId });
        const selfNode = nodeRes.nodes.find((n: { id: string }) => n.id === nodeId);
        expect(selfNode?.level, `${lc.id}: level(${nodeId})`).toBe(expLvl);
      }
      if (lc.expectedLevel7Ids) {
        const l7 = srv.callTool("tux_query_architecture_nodes", { level: 7 });
        expect(
          l7.nodes.map((n: { id: string }) => n.id).sort(),
          `${lc.id}: level 7`,
        ).toEqual(lc.expectedLevel7Ids);
      }
    }

    for (const bc of fixture.blastCases) {
      const m = fixture.models[bc.model]!;
      const parentOf = buildMapParentIndex(m);
      const links = bc.useExtractedModelLinks ? extractModelLinks(m) : m.links ?? [];
      const contract = computeLinkBlastRadius(links, bc.seeds, parentOf, {
        ...bc.opts,
        model: m,
      });
      const srv = mcpMod.createTuxMcpServer({ model: m });
      const impact = srv.callTool("tux_query_architecture_impact", {
        seedIds: bc.seeds,
        ...(bc.opts ?? {}),
        bridgeUncovered: Boolean(bc.useExtractedModelLinks),
      });
      expect(impact.truncated, `${bc.id}: truncated`).toBe(contract.truncated);
      expect(
        impact.hits.map((h: { id: string; hop: number }) => ({ id: h.id, hop: h.hop })),
        `${bc.id}: exact hit set`,
      ).toEqual([...contract.hits.entries()].map(([id, h]) => ({ id, hop: h.hop })));
      expect(impact.blockers, `${bc.id}: blockers`).toEqual(contract.blockers);
      expect(impact.coCutCandidates, `${bc.id}: coCutCandidates`).toEqual(contract.coCutCandidates);
      expect(impact.testsToRun, `${bc.id}: testsToRun`).toEqual(contract.testsToRun);
      expect(impact.stampsToRebuild, `${bc.id}: stampsToRebuild`).toEqual(contract.stampsToRebuild);
      expect(impact.buildExecImpacted, `${bc.id}: buildExecImpacted`).toEqual(contract.buildExecImpacted);
      expect(impact.hostsImpacted, `${bc.id}: hostsImpacted`).toEqual(contract.hostsImpacted);
    }

    for (const dc of fixture.deltaCases) {
      const deltaServer = mcpMod.createTuxMcpServer({ model: dc.headModel, baseModel: dc.baseModel });
      const got = deltaServer.callTool("tux_compute_graph_delta", {});
      expect(got.addedIds, dc.id).toEqual(dc.expected.addedIds);
      expect(got.deletedIds, dc.id).toEqual(dc.expected.deletedIds);
      expect(got.movedIds, dc.id).toEqual(dc.expected.movedIds);
      expect(got.sigChangedIds, dc.id).toEqual(dc.expected.sigChangedIds);
      expect(got.bodyPatchedIds, dc.id).toEqual(dc.expected.bodyPatchedIds);
      expect(
        got.danglingWires.map((w: { from: string; to: string; kind: string }) => ({
          from: w.from,
          to: w.to,
          kind: w.kind,
        })),
        dc.id,
      ).toEqual(dc.expected.danglingWires);
      expect(got.blastSeedIds, dc.id).toEqual(dc.expected.blastSeedIds);
      expect(got.recommendedIntent, dc.id).toBe(dc.expected.recommendedIntent);
    }

    // 3. End-to-end CLI `--model <file>` subprocess execution matches contract
    const tmpDir = mkdtempSync(join(tmpdir(), "tux-mcp-112-"));
    try {
      const firstCase = fixture.blastCases[0]!;
      const firstModel = fixture.models[firstCase.model]!;
      const firstContract = computeLinkBlastRadius(
        firstCase.useExtractedModelLinks ? extractModelLinks(firstModel) : firstModel.links ?? [],
        firstCase.seeds,
        buildMapParentIndex(firstModel),
        { ...firstCase.opts, model: firstModel },
      );
      const tmpModelFile = join(tmpDir, "model.json");
      writeFileSync(tmpModelFile, JSON.stringify(firstModel), "utf8");

      const cliList = spawnSync(
        process.execPath,
        [mcpScriptPath, "--model", tmpModelFile, "--list-tools"],
        { encoding: "utf8" },
      );
      expect(cliList.status).toBe(0);
      const cliTools = (JSON.parse(cliList.stdout) as Array<{ name: string }>).map((t) => t.name);
      expect(cliTools).toEqual(withModelToolNames);

      const cliCall = spawnSync(
        process.execPath,
        [
          mcpScriptPath,
          `--model=${tmpModelFile}`,
          "--call",
          "tux_query_architecture_impact",
          JSON.stringify({
            seedIds: firstCase.seeds,
            ...(firstCase.opts ?? {}),
            bridgeUncovered: Boolean(firstCase.useExtractedModelLinks),
          }),
        ],
        { encoding: "utf8" },
      );
      expect(cliCall.status).toBe(0);
      const cliImpact = JSON.parse(cliCall.stdout);
      expect(cliImpact.blockers).toEqual(firstContract.blockers);
      expect(cliImpact.hits.map((h: { id: string }) => h.id)).toEqual([...firstContract.hits.keys()]);

      // Symlinked bin invocation (`node_modules/.bin/tux-mcp` pattern) also resolves IS_MAIN
      const symlinkBin = join(tmpDir, "tux-mcp-bin");
      symlinkSync(mcpScriptPath, symlinkBin);
      const symlinkList = spawnSync(
        process.execPath,
        [symlinkBin, "--model", tmpModelFile, "--list-tools"],
        { encoding: "utf8" },
      );
      expect(symlinkList.status).toBe(0);
      expect((JSON.parse(symlinkList.stdout) as Array<{ name: string }>).map((t) => t.name)).toEqual(
        withModelToolNames,
      );

      // CLI `--call` of an architecture tool without `--model` exits non-zero with a clean message
      const cliNoModelErr = spawnSync(
        process.execPath,
        [symlinkBin, "--call", "tux_query_architecture_impact", JSON.stringify({ seedIds: firstCase.seeds })],
        { encoding: "utf8" },
      );
      expect(cliNoModelErr.status).toBe(1);
      expect(cliNoModelErr.stderr).toContain("--model");
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});

