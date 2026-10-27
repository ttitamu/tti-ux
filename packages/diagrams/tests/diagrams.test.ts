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
  DEFAULT_TTI_LEVEL_MODEL,
  type TuxMapNode,
  type TuxMapEdge,
  type TuxMapGridCellRect,
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
});
