/**
 * tuxDependencyGraph — the pure layout behind TuxDependencyGraph.
 *
 * Locks the parts that are easy to get subtly wrong without a DOM:
 * longest-path layering, loops (a 3-cycle, and what sits up- and
 * downstream of it), self-links, links to unknown items, repeated
 * links, barycenter ordering, the "Not linked" split, hideDone, the
 * "Waiting on N" count, chain tracing and arrow-key targets — plus the
 * geometry invariants (no overlapping cards, paths start and end on the
 * right edges, nothing outside the canvas). The mounted contract lives
 * in tests/components/tux-dependency-graph.nuxt.test.ts.
 */
import { describe, expect, it } from "vitest";
import {
  tuxDependencyChain,
  tuxGraphEdgeKey,
  tuxLayoutDependencyGraph,
  tuxNearestGraphNode,
  type TuxGraphEdge,
  type TuxGraphNode,
} from "../app/utils/tuxDependencyGraph";

const n = (id: string, extra: Partial<TuxGraphNode> = {}): TuxGraphNode => ({
  id,
  label: `Item ${id}`,
  ref: `#${id}`,
  ...extra,
});
const e = (from: string, to: string): TuxGraphEdge => ({ from, to });

describe("tuxLayoutDependencyGraph — layering", () => {
  it("puts each item one column right of its furthest blocker (longest path)", () => {
    // a → b → c, plus a shortcut a → c: c still lands after b.
    const l = tuxLayoutDependencyGraph([n("a"), n("b"), n("c"), n("d")], [e("a", "b"), e("b", "c"), e("a", "c"), e("d", "c")]);
    expect(l.byId.a!.column).toBe(0);
    expect(l.byId.d!.column).toBe(0);
    expect(l.byId.b!.column).toBe(1);
    expect(l.byId.c!.column).toBe(2);
    expect(l.columns).toBe(3);
    expect(l.loops).toEqual([]);
  });

  it("tab order walks the columns left to right", () => {
    const l = tuxLayoutDependencyGraph([n("c"), n("b"), n("a")], [e("a", "b"), e("b", "c")]);
    expect(l.placed.map((p) => p.id)).toEqual(["a", "b", "c"]);
  });

  it("orders a column by the barycenter of its predecessors", () => {
    // Input order puts x before y, but x waits on b (row 1) and y on a (row 0):
    // uncrossed, y belongs above x.
    const l = tuxLayoutDependencyGraph([n("a"), n("b"), n("x"), n("y")], [e("b", "x"), e("a", "y")]);
    expect(l.layers[0]).toEqual(["a", "b"]);
    expect(l.layers[1]).toEqual(["y", "x"]);
    expect(l.byId.y!.y).toBeLessThan(l.byId.x!.y);
  });

  it("routes a column-skipping link through a free slot, never through a card", () => {
    // a → d skips columns 1 and 2, which b and c occupy on a's row.
    const l = tuxLayoutDependencyGraph([n("a"), n("b"), n("c"), n("d")], [e("a", "b"), e("b", "c"), e("c", "d"), e("a", "d")]);
    const w = l.metrics.nodeWidth;
    const h = l.metrics.nodeHeight;
    const long = l.edges.find((x) => x.key === tuxGraphEdgeKey("a", "d"))!;
    // Sample the path's horizontal runs: none may pass through b's or c's box.
    const nums = long.d.match(/-?\d+(\.\d+)?/g)!.map(Number);
    const ys = new Set<number>();
    for (let i = 1; i < nums.length; i += 2) ys.add(nums[i]!);
    for (const id of ["b", "c"]) {
      const p = l.byId[id]!;
      const inside = [...ys].some((y) => y > p.y && y < p.y + h);
      // A y inside the card's band is only OK if the run never reaches the card's x-range.
      if (inside) {
        const xs: number[] = [];
        for (let i = 0; i < nums.length; i += 2) if (nums[i + 1]! > p.y && nums[i + 1]! < p.y + h) xs.push(nums[i]!);
        expect(xs.every((x) => x < p.x || x > p.x + w)).toBe(true);
      }
    }
  });

  it("never overlaps two cards and keeps everything inside the canvas", () => {
    const nodes = "abcdefghij".split("").map((id) => n(id));
    const edges = [e("a", "c"), e("b", "c"), e("c", "d"), e("c", "e"), e("a", "e"), e("f", "g"), e("g", "h"), e("h", "f"), e("e", "i"), e("h", "i"), e("b", "e")];
    const l = tuxLayoutDependencyGraph(nodes, edges);
    const { nodeWidth: w, nodeHeight: h } = l.metrics;
    for (const a of l.placed) {
      expect(a.x).toBeGreaterThanOrEqual(0);
      expect(a.y).toBeGreaterThanOrEqual(0);
      expect(a.x + w).toBeLessThanOrEqual(l.width);
      expect(a.y + h).toBeLessThanOrEqual(l.height);
      for (const b of l.placed) {
        if (a === b) continue;
        const apart = a.x + w <= b.x || b.x + w <= a.x || a.y + h <= b.y || b.y + h <= a.y;
        expect(apart, `${a.id} overlaps ${b.id}`).toBe(true);
      }
    }
    for (const edge of l.edges) {
      const from = l.byId[edge.from]!;
      const to = l.byId[edge.to]!;
      // Starts at the right edge of `from`, arrow tip on the left edge of `to`.
      expect(edge.d.startsWith(`M${from.x + w} ${from.y + h / 2}`)).toBe(true);
      expect(edge.arrow.startsWith(`M${to.x} ${to.y + h / 2}`)).toBe(true);
    }
  });
});

describe("tuxLayoutDependencyGraph — loops and bad data", () => {
  it("puts a 3-node cycle in a loop band, in cycle order, and places what is up- and downstream of it", () => {
    const l = tuxLayoutDependencyGraph(
      [n("x"), n("a"), n("b"), n("c"), n("y")],
      [e("x", "a"), e("a", "b"), e("b", "c"), e("c", "a"), e("c", "y")],
    );
    expect(l.loops).toEqual([["a", "b", "c"]]);
    for (const id of ["a", "b", "c"]) {
      expect(l.byId[id]!.band).toBe("loop");
      expect(l.byId[id]!.loop).toBe(0);
    }
    // The loop's members never appear in the ordered layers.
    expect(l.layers.flat().sort()).toEqual(["x", "y"]);
    // x is upstream (left of the loop); y waits on it (right of it, flagged).
    expect(l.byId.x!.column).toBe(0);
    expect(l.byId.a!.column).toBe(1);
    expect(l.byId.c!.column).toBe(3);
    expect(l.byId.y!.column).toBe(4);
    expect(l.byId.y!.behindLoop).toBe(true);
    expect(l.byId.x!.behindLoop).toBe(false);
    // The loop's own links are marked; the ones in and out of it are not.
    const loopKeys = l.edges.filter((x) => x.loop).map((x) => x.key).sort();
    expect(loopKeys).toEqual([tuxGraphEdgeKey("a", "b"), tuxGraphEdgeKey("b", "c"), tuxGraphEdgeKey("c", "a")].sort());
    // The band sits below the main graph, framed.
    expect(l.byId.a!.y).toBeGreaterThan(l.byId.x!.y);
    expect(l.frames).toHaveLength(1);
  });

  it("says whether a loop is one circle (a → b → c → back to a) or a tangle", () => {
    const circle = tuxLayoutDependencyGraph([n("a"), n("b"), n("c")], [e("a", "b"), e("b", "c"), e("c", "a"), e("a", "c")]);
    expect(circle.loops).toEqual([["a", "b", "c"]]);
    expect(circle.loopIsCircle).toEqual([true]);
    // a ⇄ b and a ⇄ c: one loop, but no single circle through all three.
    const tangle = tuxLayoutDependencyGraph([n("a"), n("b"), n("c")], [e("a", "b"), e("b", "a"), e("a", "c"), e("c", "a")]);
    expect(tangle.loops).toHaveLength(1);
    expect(tangle.loopIsCircle).toEqual([false]);
  });

  it("finds a two-item loop and a loop with no way in (column 0) without leaving the canvas", () => {
    const l = tuxLayoutDependencyGraph([n("a"), n("b")], [e("a", "b"), e("b", "a")]);
    expect(l.loops).toEqual([["a", "b"]]);
    expect(l.layers.flat()).toEqual([]);
    for (const edge of l.edges) {
      const nums = edge.d.match(/-?\d+(\.\d+)?/g)!.map(Number);
      expect(Math.min(...nums)).toBeGreaterThanOrEqual(0);
    }
  });

  it("ignores and counts self-links, unknown ends, malformed and repeated links", () => {
    const edges = [
      e("a", "a"),
      e("a", "zz"),
      e("ghost", "b"),
      { from: undefined, to: "b" } as unknown as TuxGraphEdge,
      null as unknown as TuxGraphEdge,
      e("a", "b"),
      e("a", "b"),
    ];
    const l = tuxLayoutDependencyGraph([n("a"), n("b"), n("c")], edges);
    expect(l.ignored).toEqual({ self: 1, unknown: 4, duplicate: 1 });
    expect(l.edges.map((x) => x.key)).toEqual([tuxGraphEdgeKey("a", "b")]);
    expect(l.loops).toEqual([]);
  });

  it("an item whose only link was to itself is not linked", () => {
    const l = tuxLayoutDependencyGraph([n("a"), n("b"), n("c"), n("d")], [e("a", "a"), e("b", "c")]);
    expect(l.isolated.map((x) => x.id)).toEqual(["a", "d"]);
    expect(Object.keys(l.byId).sort()).toEqual(["b", "c"]);
  });

  it("survives a dense tangle: every item in one loop, repeated links, big fan-in", () => {
    const ids = Array.from({ length: 40 }, (_, i) => `n${i}`);
    const edges: TuxGraphEdge[] = [];
    ids.forEach((id, i) => {
      edges.push(e(id, ids[(i + 1) % ids.length]!), e(id, ids[(i + 7) % ids.length]!), e(id, id));
    });
    const l = tuxLayoutDependencyGraph(ids.map((id) => n(id)), [...edges, ...edges]);
    expect(l.loops).toHaveLength(1);
    expect(l.loops[0]).toHaveLength(40);
    expect(l.ignored.self).toBe(80);
  });
});

describe("tuxLayoutDependencyGraph — state", () => {
  it("counts only open blockers of open items as 'waiting on'", () => {
    const l = tuxLayoutDependencyGraph(
      [n("a"), n("b", { done: true }), n("c"), n("d"), n("e", { done: true })],
      [e("a", "c"), e("b", "c"), e("b", "d"), e("a", "e")],
    );
    expect(l.byId.c!.waitingOn).toBe(1);
    expect(l.byId.c!.unblocked).toBe(false);
    expect(l.byId.d!.waitingOn).toBe(0);
    expect(l.byId.d!.unblocked).toBe(true);
    expect(l.byId.e!.waitingOn).toBe(0); // done items wait on nothing
    const edge = (f: string, t: string) => l.edges.find((x) => x.key === tuxGraphEdgeKey(f, t))!;
    expect(edge("a", "c").blocking).toBe(true);
    expect(edge("b", "c").blocking).toBe(false);
    expect(edge("a", "e").blocking).toBe(false);
  });

  it("hideDone drops done items and their links without calling them unknown", () => {
    const l = tuxLayoutDependencyGraph(
      [n("a", { done: true }), n("b"), n("c")],
      [e("a", "b"), e("b", "c")],
      { hideDone: true },
    );
    expect(l.hiddenDone).toBe(1);
    expect(l.ignored.unknown).toBe(0);
    expect(l.byId.a).toBeUndefined();
    expect(l.byId.b!.column).toBe(0);
  });

  it("keeps unlinked items out of the graph, in input order", () => {
    const l = tuxLayoutDependencyGraph([n("q"), n("a"), n("p"), n("b")], [e("a", "b")]);
    expect(l.isolated.map((x) => x.id)).toEqual(["q", "p"]);
    expect(l.placed.map((x) => x.id)).toEqual(["a", "b"]);
  });

  it("handles nothing at all", () => {
    const l = tuxLayoutDependencyGraph([], []);
    expect(l.placed).toEqual([]);
    expect(l.width).toBe(0);
    expect(tuxLayoutDependencyGraph(undefined, null).placed).toEqual([]);
  });
});

describe("tuxDependencyChain + tuxNearestGraphNode", () => {
  const nodes = ["a", "b", "c", "d", "x"].map((id) => n(id));
  const edges = [e("a", "b"), e("b", "c"), e("a", "c"), e("c", "d"), e("x", "d")];
  const l = tuxLayoutDependencyGraph(nodes, edges);

  it("traces everything upstream and downstream, but not a link that bypasses the item", () => {
    const chain = tuxDependencyChain(l, "b");
    expect([...chain.nodes].sort()).toEqual(["a", "b", "c", "d"]);
    expect(chain.edges.has(tuxGraphEdgeKey("a", "b"))).toBe(true);
    expect(chain.edges.has(tuxGraphEdgeKey("b", "c"))).toBe(true);
    expect(chain.edges.has(tuxGraphEdgeKey("c", "d"))).toBe(true);
    expect(chain.edges.has(tuxGraphEdgeKey("a", "c"))).toBe(false); // skips b
    expect(chain.edges.has(tuxGraphEdgeKey("x", "d"))).toBe(false); // not b's blocker
  });

  it("is loop-safe", () => {
    const loop = tuxLayoutDependencyGraph([n("a"), n("b"), n("c")], [e("a", "b"), e("b", "c"), e("c", "a")]);
    expect([...tuxDependencyChain(loop, "a").nodes].sort()).toEqual(["a", "b", "c"]);
  });

  it("arrow targets: right follows the flow, up/down stay in the column, edges stop", () => {
    expect(tuxNearestGraphNode(l, "a", "right")).toBe("b");
    expect(tuxNearestGraphNode(l, "a", "left")).toBeNull();
    const [top, bottom] = l.layers[0]!;
    expect(tuxNearestGraphNode(l, top!, "down")).toBe(bottom);
    expect(tuxNearestGraphNode(l, bottom!, "up")).toBe(top);
    expect(tuxNearestGraphNode(l, "d", "right")).toBeNull();
  });
});
