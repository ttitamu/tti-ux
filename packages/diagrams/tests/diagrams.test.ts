import { describe, expect, it } from "vitest";
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
  getSmoothedFreehandSvgPath,
  getLaserPointerSvgPath,
  gridCellToPx,
  routeGridWires,
  routeDeploymentWires,
  buildLevelModelFromLegacyNodes,
  buildUnifiedArchitectureGraph,
  queryArchitectureLayer,
  queryMultiLevelBlastRadius,
  findShortestArchitecturePath,
  coordinateAcpSubgraphLease,
  buildMapParentIndex,
  liftLinksToView,
  computeLinkBlastRadius,
  DEFAULT_TTI_LEVEL_MODEL,
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

    const blast = computeDependencyBlastRadius("b", edges);
    expect([...blast.upstreamNodeIds]).toEqual(["a"]);
    expect([...blast.downstreamNodeIds]).toEqual(["c"]);
    expect(blast.activeEdgeIds.size).toBe(2);
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

  it("queries unified 6-level architecture graph, multi-hop blast radius, shortest path, and ACP subgraph leases", () => {
    const cpg = buildUnifiedArchitectureGraph(DEFAULT_TTI_LEVEL_MODEL);
    expect(cpg.nodes.size).toBeGreaterThan(25);
    expect(cpg.edges.length).toBeGreaterThan(25);

    const lvl5 = queryArchitectureLayer(DEFAULT_TTI_LEVEL_MODEL, {
      focusId: "ai-search-app",
    });
    expect(lvl5.nodeCount).toBeGreaterThanOrEqual(4);

    const blast = queryMultiLevelBlastRadius("c-api", DEFAULT_TTI_LEVEL_MODEL, 2);
    expect("error" in blast).toBe(false);
    if (!("error" in blast)) {
      expect(blast.descendantIds).toContain("c-api/1");
      expect(blast.upstreamDependents.some((u) => u.id === "c-edge" || u.id === "c-web")).toBe(true);
      expect(blast.downstreamDependencies.some((d) => d.id === "c-db" || d.id === "c-cache")).toBe(true);
      expect(blast.impactedSourceFiles.some((f) => f.path.includes("services/api"))).toBe(true);
    }

    const sp = findShortestArchitecturePath("p-users", "c-db", DEFAULT_TTI_LEVEL_MODEL);
    expect(sp.found).toBe(true);
    expect(sp.hops).toBeGreaterThanOrEqual(2);

    // ACP Subgraph Lease acquisition & conflict prevention
    const leaseA = coordinateAcpSubgraphLease("acquire", {
      agentId: "agent-alpha",
      rootNodeId: "c-api",
    });
    expect(leaseA.acquired).toBe(true);

    // Overlapping child node `c-api/1` requested by `agent-beta` must be rejected
    const leaseConflict = coordinateAcpSubgraphLease("acquire", {
      agentId: "agent-beta",
      rootNodeId: "c-api/1",
    });
    expect(leaseConflict.acquired).toBe(false);
    expect(leaseConflict.conflict?.heldByAgent).toBe("agent-alpha");

    // Non-overlapping node `ai-search-app` requested by `agent-beta` succeeds
    const leaseB = coordinateAcpSubgraphLease("acquire", {
      agentId: "agent-beta",
      rootNodeId: "ai-search-app",
    });
    expect(leaseB.acquired).toBe(true);

    // Release both leases
    coordinateAcpSubgraphLease("release", { agentId: "agent-alpha" });
    coordinateAcpSubgraphLease("release", { agentId: "agent-beta" });
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
    // changing check() reaches who() (calls it), data() (calls who), page.js (calls data), the test (one step)
    const { hits } = computeLinkBlastRadius(codeModel.links!, "s:forge.py#check", parentOf);
    expect([...hits.entries()].map(([id, h]) => [id, h.hop])).toEqual([
      ["s:routes.py#who", 1],
      ["s:routes.py#data", 2],
      ["f:page.js", 3],
      ["f:test_routes.py", 3],
      ["f:runbook.md", 4],
    ]);
    // a container's radius starts from everything inside it; nothing inside counts as reached
    const api = computeLinkBlastRadius(codeModel.links!, "c-api", parentOf);
    expect(api.seeds.has("s:forge.py#check")).toBe(true);
    expect([...api.hits.keys()].sort()).toEqual(["f:page.js", "f:runbook.md", "f:test_routes.py"]);
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
  });
});

