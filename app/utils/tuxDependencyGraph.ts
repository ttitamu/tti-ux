/**
 * tuxDependencyGraph — the pure layout behind TuxDependencyGraph.
 *
 * Input: work items and "waits on" links (`to` waits on `from`, so `from`
 * has to finish first). Output: everything the component draws, in pixels,
 * with no DOM and no Vue — so it runs the same in Nuxt, in the forge's
 * plain-Vue island, and in a unit test. The component imports it by
 * relative path (the island does not auto-import TUX utils).
 *
 * The pipeline:
 *   1. Clean the links. Self-links, links to ids that are not in `nodes`,
 *      and repeated links are dropped and COUNTED (never thrown on). Links
 *      touching a done item hidden by `hideDone` are dropped silently.
 *   2. Split out the unlinked. Items with no remaining link go to
 *      `isolated` (the component's "Not linked" strip), not into the graph.
 *   3. Find loops. Tarjan's strongly-connected components: every component
 *      with two or more members is a loop — the items Kahn's algorithm can
 *      never place, because each waits on another. Items merely *downstream*
 *      of a loop are not in it; they are placed normally and flagged
 *      `behindLoop`.
 *   4. Layer. Kahn over the condensation (each loop collapsed to one unit,
 *      which is always acyclic): an item's column is the longest path from a
 *      source. A loop occupies one column per member, so whatever waits on
 *      it lands to its right and every link except the loop's own still
 *      points left → right.
 *   5. Order. Links that skip columns get a placeholder in every column they
 *      cross, so they route through a free slot instead of through a card.
 *      Within each column items are sorted by the barycenter of their
 *      neighbours — alternating forward (predecessors) and backward
 *      (successors) sweeps, keeping the order with the fewest crossings.
 *   6. Place and route. Integer rows (an item sits level with its
 *      predecessors when it can); loops go in a separate band below the
 *      graph, one row per loop, members in cycle order; every link is an
 *      orthogonal path from the right edge of `from` to the left edge of
 *      `to`, with vertical runs spread into lanes so parallel links stay
 *      distinguishable.
 *
 * Nothing here can hang: every loop is bounded by the node or edge count,
 * and the condensation is acyclic by construction.
 */

export type TuxGraphTone = "info" | "success" | "warning" | "error" | "neutral" | "muted";

export interface TuxGraphNode {
  /** Stable id, e.g. "184" or "tti/other#9". */
  id: string;
  /** The title. */
  label: string;
  /** Short reference shown in mono, e.g. "#184" or "tti/other#9". Falls back to the id. */
  ref?: string;
  /** Status badge. */
  status?: { label: string; tone: TuxGraphTone };
  /** Closed: drawn muted, and links out of it no longer block. */
  done?: boolean;
  /** Lives in another repository: dashed border. */
  external?: boolean;
  /** Small caption, e.g. the item's area of work. */
  group?: string;
}

/** `to` waits on `from`: `from` has to finish first. */
export interface TuxGraphEdge {
  from: string;
  to: string;
}

export interface TuxGraphMetrics {
  nodeWidth: number;
  nodeHeight: number;
  /** Horizontal space between columns — where links bend. */
  columnGap: number;
  rowGap: number;
  padding: number;
  /** Space above the first row for the "Step n" captions. */
  headerHeight: number;
  /** Distance between parallel link runs sharing a gap or channel. */
  laneGap: number;
  /** Space above a loop row for its "Loop" caption. */
  bandCaption: number;
}

export const TUX_GRAPH_METRICS: TuxGraphMetrics = {
  nodeWidth: 216,
  nodeHeight: 104,
  columnGap: 72,
  rowGap: 20,
  padding: 12,
  headerHeight: 26,
  laneGap: 6,
  bandCaption: 26,
};

export interface TuxGraphPlacedNode {
  id: string;
  node: TuxGraphNode;
  /** 0-based column ("Step column + 1"). */
  column: number;
  /** "main" = the ordered graph; "loop" = the loop band below it. */
  band: "main" | "loop";
  /** Row within its band. */
  row: number;
  /** Index into `loops` for loop members, else null. */
  loop: number | null;
  /** Top-left corner, px. */
  x: number;
  y: number;
  /** Ids this item waits on (input order). */
  blockers: string[];
  /** Ids waiting on this item (input order). */
  dependents: string[];
  /** Open items this open item still waits on — the "Waiting on N" count. */
  waitingOn: number;
  /** Open, had blockers, and every one of them is done. */
  unblocked: boolean;
  /** Not in a loop, but waits (directly or further up) on something that is. */
  behindLoop: boolean;
}

export interface TuxGraphRoutedEdge {
  /** Stable key (JSON of [from, to]). */
  key: string;
  from: string;
  to: string;
  /** Open → open: this link is holding work up right now. */
  blocking: boolean;
  /** Both ends are in the same loop. */
  loop: boolean;
  /** Orthogonal SVG path, right edge of `from` → left edge of `to`. */
  d: string;
  /** Arrowhead (a small filled triangle at the left edge of `to`). */
  arrow: string;
}

export interface TuxGraphFrame {
  loop: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TuxGraphLayout {
  width: number;
  height: number;
  /** Number of columns (steps) across the main graph and the loop band. */
  columns: number;
  /** x of each column's left edge. */
  columnX: number[];
  /** Main-graph columns: item ids top → bottom (placeholders removed). */
  layers: string[][];
  /** Each loop's members, in cycle order where there is one. */
  loops: string[][];
  /**
   * Per loop: true when `loops[i]` is one circle in that order — each member
   * waits on the one before it and the first on the last — so it can honestly
   * be read as "a → b → … → back to a". False for tangles with several paths.
   */
  loopIsCircle: boolean[];
  /** Every placed item, in tab order (column, then main before loop band, then top → bottom). */
  placed: TuxGraphPlacedNode[];
  byId: Record<string, TuxGraphPlacedNode>;
  /** Items with no link: the "Not linked" strip. Input order. */
  isolated: TuxGraphNode[];
  /** Valid, de-duplicated links, routed. Input order. */
  edges: TuxGraphRoutedEdge[];
  /** One frame per loop, drawn behind its row. */
  frames: TuxGraphFrame[];
  /** Links that were dropped, by reason. */
  ignored: { self: number; unknown: number; duplicate: number };
  /** Done items left out because of `hideDone`. */
  hiddenDone: number;
  metrics: TuxGraphMetrics;
}

export interface TuxGraphLayoutOptions {
  hideDone?: boolean;
  metrics?: Partial<TuxGraphMetrics>;
}

/** The key the layout uses for a link — stable and collision-free for any ids. */
export function tuxGraphEdgeKey(from: string, to: string): string {
  return JSON.stringify([from, to]);
}

type Point = [number, number];

const round1 = (n: number) => Math.round(n * 10) / 10;

/** Orthogonal polyline with softened corners. Drops repeated and collinear points. */
function roundedPath(raw: Point[], radius = 6): string {
  const pts: Point[] = [];
  for (const p of raw) {
    const last = pts[pts.length - 1];
    if (last && Math.abs(last[0] - p[0]) < 0.01 && Math.abs(last[1] - p[1]) < 0.01) continue;
    pts.push(p);
  }
  // Collinear middle points add nothing and break the corner maths.
  for (let i = pts.length - 2; i >= 1; i--) {
    const [ax, ay] = pts[i - 1]!;
    const [bx, by] = pts[i]!;
    const [cx, cy] = pts[i + 1]!;
    if (Math.abs((bx - ax) * (cy - by) - (by - ay) * (cx - bx)) < 0.01) pts.splice(i, 1);
  }
  if (pts.length < 2) return "";
  let d = `M${round1(pts[0]![0])} ${round1(pts[0]![1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1]!;
    const [cx, cy] = pts[i]!;
    const [nx, ny] = pts[i + 1]!;
    const inLen = Math.hypot(cx - px, cy - py);
    const outLen = Math.hypot(nx - cx, ny - cy);
    const r = Math.min(radius, inLen / 2, outLen / 2);
    const ax = cx - ((cx - px) / inLen) * r;
    const ay = cy - ((cy - py) / inLen) * r;
    const bx = cx + ((nx - cx) / outLen) * r;
    const by = cy + ((ny - cy) / outLen) * r;
    d += ` L${round1(ax)} ${round1(ay)} Q${round1(cx)} ${round1(cy)} ${round1(bx)} ${round1(by)}`;
  }
  const end = pts[pts.length - 1]!;
  d += ` L${round1(end[0])} ${round1(end[1])}`;
  return d;
}

function arrowHead(x: number, y: number): string {
  return `M${round1(x)} ${round1(y)} L${round1(x - 7)} ${round1(y - 4)} L${round1(x - 7)} ${round1(y + 4)} Z`;
}

/** Iterative Tarjan: strongly connected components, no recursion depth limit. */
function stronglyConnected(ids: string[], succs: Map<string, string[]>): string[][] {
  let counter = 0;
  const index = new Map<string, number>();
  const low = new Map<string, number>();
  const onStack = new Set<string>();
  const stack: string[] = [];
  const out: string[][] = [];

  const open = (v: string) => {
    index.set(v, counter);
    low.set(v, counter);
    counter++;
    stack.push(v);
    onStack.add(v);
  };

  for (const root of ids) {
    if (index.has(root)) continue;
    open(root);
    const work: { v: string; i: number }[] = [{ v: root, i: 0 }];
    while (work.length) {
      const frame = work[work.length - 1]!;
      const next = succs.get(frame.v) ?? [];
      if (frame.i < next.length) {
        const w = next[frame.i++]!;
        if (!index.has(w)) {
          open(w);
          work.push({ v: w, i: 0 });
        } else if (onStack.has(w)) {
          low.set(frame.v, Math.min(low.get(frame.v)!, index.get(w)!));
        }
        continue;
      }
      work.pop();
      if (low.get(frame.v) === index.get(frame.v)) {
        const comp: string[] = [];
        let w: string;
        do {
          w = stack.pop()!;
          onStack.delete(w);
          comp.push(w);
        } while (w !== frame.v);
        out.push(comp);
      }
      const parent = work[work.length - 1];
      if (parent) low.set(parent.v, Math.min(low.get(parent.v)!, low.get(frame.v)!));
    }
  }
  return out;
}

/** Links between adjacent columns that cross each other. */
function countCrossings(layers: string[][], succs: Map<string, string[]>): number {
  let total = 0;
  for (let k = 0; k < layers.length - 1; k++) {
    const here = new Map(layers[k]!.map((key, i) => [key, i]));
    const there = new Map(layers[k + 1]!.map((key, i) => [key, i]));
    const pairs: Point[] = [];
    for (const u of layers[k]!) {
      for (const v of succs.get(u) ?? []) {
        if (there.has(v)) pairs.push([here.get(u)!, there.get(v)!]);
      }
    }
    for (let i = 0; i < pairs.length; i++) {
      for (let j = i + 1; j < pairs.length; j++) {
        const [a1, b1] = pairs[i]!;
        const [a2, b2] = pairs[j]!;
        if ((a1 - a2) * (b1 - b2) < 0) total++;
      }
    }
  }
  return total;
}

/**
 * One barycenter sweep. `dir = 1` walks left → right ordering each column by
 * its predecessors; `dir = -1` walks right → left using successors. An item
 * with no neighbour in the reference column keeps its current position.
 */
function sweep(layers: string[][], neighbours: Map<string, string[]>, dir: 1 | -1): void {
  const n = layers.length;
  const ks: number[] = [];
  if (dir === 1) for (let k = 1; k < n; k++) ks.push(k);
  else for (let k = n - 2; k >= 0; k--) ks.push(k);
  for (const k of ks) {
    const ref = new Map(layers[k - dir]!.map((key, i) => [key, i]));
    const keyed = layers[k]!.map((key, i) => {
      const ns = (neighbours.get(key) ?? []).filter((x) => ref.has(x));
      const bary = ns.length ? ns.reduce((s, x) => s + ref.get(x)!, 0) / ns.length : i;
      return { key, bary, i };
    });
    keyed.sort((a, b) => a.bary - b.bary || a.i - b.i);
    layers[k] = keyed.map((x) => x.key);
  }
}

export function tuxLayoutDependencyGraph(
  nodes: readonly TuxGraphNode[] | null | undefined,
  edges: readonly TuxGraphEdge[] | null | undefined,
  options: TuxGraphLayoutOptions = {},
): TuxGraphLayout {
  const m: TuxGraphMetrics = { ...TUX_GRAPH_METRICS, ...options.metrics };
  const hideDone = options.hideDone ?? false;

  // ── 1. clean ──────────────────────────────────────────────────────────
  const known = new Set<string>();
  for (const n of nodes ?? []) if (n && typeof n.id === "string") known.add(n.id);

  const visible: TuxGraphNode[] = [];
  const index = new Map<string, number>();
  const hidden = new Set<string>();
  for (const n of nodes ?? []) {
    if (!n || typeof n.id !== "string" || index.has(n.id) || hidden.has(n.id)) continue;
    if (hideDone && n.done) {
      hidden.add(n.id);
      continue;
    }
    index.set(n.id, visible.length);
    visible.push(n);
  }
  const nodeOf = new Map(visible.map((n) => [n.id, n]));
  const byIndex = (a: string, b: string) => index.get(a)! - index.get(b)!;

  const ignored = { self: 0, unknown: 0, duplicate: 0 };
  const valid: TuxGraphEdge[] = [];
  const seen = new Set<string>();
  for (const e of edges ?? []) {
    const from = e?.from;
    const to = e?.to;
    if (typeof from !== "string" || typeof to !== "string" || !known.has(from) || !known.has(to)) {
      ignored.unknown++;
      continue;
    }
    if (!index.has(from) || !index.has(to)) continue; // an end is a hidden done item
    if (from === to) {
      ignored.self++;
      continue;
    }
    const key = tuxGraphEdgeKey(from, to);
    if (seen.has(key)) {
      ignored.duplicate++;
      continue;
    }
    seen.add(key);
    valid.push({ from, to });
  }

  const preds = new Map<string, string[]>();
  const succs = new Map<string, string[]>();
  for (const n of visible) {
    preds.set(n.id, []);
    succs.set(n.id, []);
  }
  for (const e of valid) {
    succs.get(e.from)!.push(e.to);
    preds.get(e.to)!.push(e.from);
  }
  for (const list of preds.values()) list.sort(byIndex);
  for (const list of succs.values()) list.sort(byIndex);

  // ── 2. unlinked ───────────────────────────────────────────────────────
  const isLinked = (id: string) => preds.get(id)!.length > 0 || succs.get(id)!.length > 0;
  const linked = visible.filter((n) => isLinked(n.id)).map((n) => n.id);
  const isolated = visible.filter((n) => !isLinked(n.id));

  // ── 3. loops ──────────────────────────────────────────────────────────
  const comps = stronglyConnected(linked, succs).map((c) => c.sort(byIndex));
  const compOf = new Map<string, number>();
  comps.forEach((c, i) => c.forEach((id) => compOf.set(id, i)));
  const isLoopComp = comps.map((c) => c.length > 1);

  const cycleOrder = (members: string[]): string[] => {
    const inside = new Set(members);
    const visited = new Set<string>();
    const out: string[] = [];
    const stack = [members[0]!];
    while (stack.length) {
      const v = stack.pop()!;
      if (visited.has(v)) continue;
      visited.add(v);
      out.push(v);
      const next = succs.get(v)!.filter((w) => inside.has(w) && !visited.has(w));
      for (let i = next.length - 1; i >= 0; i--) stack.push(next[i]!);
    }
    for (const id of members) if (!visited.has(id)) out.push(id);
    return out;
  };

  // ── 4. layer (Kahn over the condensation, longest path) ────────────────
  const span = comps.map((c) => c.length); // a loop takes one column per member
  const compSuccs = comps.map(() => new Set<number>());
  const indeg = comps.map(() => 0);
  for (const e of valid) {
    const a = compOf.get(e.from)!;
    const b = compOf.get(e.to)!;
    if (a !== b && !compSuccs[a]!.has(b)) {
      compSuccs[a]!.add(b);
      indeg[b]!++;
    }
  }
  const compFirst = comps.map((c) => index.get(c[0]!)!);
  const compLayer = comps.map(() => 0);
  const queue = comps.map((_, i) => i).filter((i) => indeg[i] === 0).sort((a, b) => compFirst[a]! - compFirst[b]!);
  for (let head = 0; head < queue.length; head++) {
    const c = queue[head]!;
    for (const s of compSuccs[c]!) {
      compLayer[s] = Math.max(compLayer[s]!, compLayer[c]! + span[c]!);
      if (--indeg[s]! === 0) queue.push(s);
    }
  }

  const columnOf = new Map<string, number>();
  const loopOf = new Map<string, number>();
  const loops: string[][] = [];
  const loopStart: number[] = [];
  comps
    .map((c, i) => ({ c, i }))
    .filter(({ i }) => isLoopComp[i])
    .sort((a, b) => compLayer[a.i]! - compLayer[b.i]! || compFirst[a.i]! - compFirst[b.i]!)
    .forEach(({ c, i }) => {
      const order = cycleOrder(c);
      const li = loops.length;
      loops.push(order);
      loopStart.push(compLayer[i]!);
      order.forEach((id, j) => {
        columnOf.set(id, compLayer[i]! + j);
        loopOf.set(id, li);
      });
    });
  for (const id of linked) if (!loopOf.has(id)) columnOf.set(id, compLayer[compOf.get(id)!]!);
  const loopIsCircle = loops.map((ms) =>
    ms.every((id, i) => seen.has(tuxGraphEdgeKey(id, ms[(i + 1) % ms.length]!))),
  );

  let columns = 0;
  for (const c of columnOf.values()) columns = Math.max(columns, c + 1);

  // Downstream of a loop, but not in it.
  const behind = new Set<string>();
  const reach = [...loopOf.keys()];
  while (reach.length) {
    const v = reach.pop()!;
    for (const w of succs.get(v)!) {
      if (loopOf.has(w) || behind.has(w)) continue;
      behind.add(w);
      reach.push(w);
    }
  }

  // ── 5. order (main graph only; loop rows are in cycle order) ──────────
  const mainIds = linked.filter((id) => !loopOf.has(id));
  const layerItems: string[][] = Array.from({ length: columns }, () => []);
  const itemPreds = new Map<string, string[]>();
  const itemSuccs = new Map<string, string[]>();
  const link = (a: string, b: string) => {
    itemSuccs.get(a)!.push(b);
    itemPreds.get(b)!.push(a);
  };
  const nodeItem = (id: string) => `n:${id}`;
  const addItem = (key: string, column: number) => {
    layerItems[column]!.push(key);
    itemPreds.set(key, []);
    itemSuccs.set(key, []);
  };
  for (const id of mainIds) addItem(nodeItem(id), columnOf.get(id)!);

  // Each main → main link's chain of items, one per column it touches.
  const chains = new Map<string, string[]>();
  for (const e of valid) {
    if (loopOf.has(e.from) || loopOf.has(e.to)) continue;
    const a = columnOf.get(e.from)!;
    const b = columnOf.get(e.to)!;
    const key = tuxGraphEdgeKey(e.from, e.to);
    const chain = [nodeItem(e.from)];
    for (let c = a + 1; c < b; c++) {
      const dummy = `d:${key}:${c}`;
      addItem(dummy, c);
      chain.push(dummy);
    }
    chain.push(nodeItem(e.to));
    for (let i = 0; i < chain.length - 1; i++) link(chain[i]!, chain[i + 1]!);
    chains.set(key, chain);
  }

  let best = layerItems.map((l) => [...l]);
  let bestCrossings = Number.POSITIVE_INFINITY;
  const work = layerItems.map((l) => [...l]);
  for (const dir of [1, -1, 1, -1] as const) {
    sweep(work, dir === 1 ? itemPreds : itemSuccs, dir);
    const crossings = countCrossings(work, itemSuccs);
    if (crossings < bestCrossings) {
      bestCrossings = crossings;
      best = work.map((l) => [...l]);
    }
  }

  // ── 6. place ──────────────────────────────────────────────────────────
  // Rows: an item sits level with the mean of its predecessors when that
  // slot is free, otherwise just below the item above it. An item whose
  // only blockers are in the loop band sits at the bottom of the graph,
  // next to the band, rather than at the top.
  const rowOf = new Map<string, number>();
  let mainRows = 0;
  const waitsOnlyOnLoops = (key: string) =>
    key.startsWith("n:") && preds.get(key.slice(2))!.some((p) => loopOf.has(p));
  best.forEach((layer) => {
    let last = -1;
    for (const key of layer) {
      const ps = (itemPreds.get(key) ?? []).filter((p) => rowOf.has(p));
      const desired = ps.length
        ? Math.round(ps.reduce((s, p) => s + rowOf.get(p)!, 0) / ps.length)
        : waitsOnlyOnLoops(key)
          ? Math.max(last + 1, mainRows - 1)
          : last + 1;
      const row = Math.max(desired, last + 1);
      rowOf.set(key, row);
      last = row;
      mainRows = Math.max(mainRows, row + 1);
    }
  });

  const top = m.padding + m.headerHeight;
  const rowY = (r: number) => top + r * (m.nodeHeight + m.rowGap);
  const mainBottom = rowY(mainRows) - m.rowGap;
  const midY = (y: number) => y + m.nodeHeight / 2;

  // Loop rows: pack loops whose columns don't overlap onto the same row.
  const loopRow: number[] = [];
  const rowEnds: number[] = [];
  loops.forEach((members, li) => {
    const start = loopStart[li]!;
    let r = rowEnds.findIndex((end) => end < start);
    if (r === -1) {
      r = rowEnds.length;
      rowEnds.push(-1);
    }
    rowEnds[r] = start + members.length - 1;
    loopRow.push(r);
  });

  // Which links cross between the main graph and the loop band (or between
  // loops) through the channel, and which loop links run under their row.
  type Kind = "main" | "channel" | "adjacent" | "straight" | "under";
  const kindOf = new Map<string, Kind>();
  const underLane = new Map<string, number>();
  const underCount = loops.map(() => 0);
  const channelEdges: TuxGraphEdge[] = [];
  for (const e of valid) {
    const key = tuxGraphEdgeKey(e.from, e.to);
    const la = loopOf.get(e.from);
    const lb = loopOf.get(e.to);
    const ca = columnOf.get(e.from)!;
    const cb = columnOf.get(e.to)!;
    if (la === undefined && lb === undefined) kindOf.set(key, "main");
    else if (la !== undefined && la === lb) {
      if (cb === ca + 1) kindOf.set(key, "straight");
      else {
        kindOf.set(key, "under");
        underLane.set(key, underCount[la]!++);
      }
    } else if (cb === ca + 1) kindOf.set(key, "adjacent");
    else {
      kindOf.set(key, "channel");
      channelEdges.push(e);
    }
  }
  channelEdges.sort(
    (a, b) => columnOf.get(a.from)! - columnOf.get(b.from)! || columnOf.get(a.to)! - columnOf.get(b.to)!,
  );
  const channelLane = new Map(channelEdges.map((e, i) => [tuxGraphEdgeKey(e.from, e.to), i]));

  // A loop link back to a member in column 0 bends to the left of it, so
  // that case gets a gutter the width of a column gap.
  const gutter = valid.some((e) => kindOf.get(tuxGraphEdgeKey(e.from, e.to)) === "under" && columnOf.get(e.to) === 0)
    ? m.columnGap
    : 0;
  const colX = (c: number) => m.padding + gutter + c * (m.nodeWidth + m.columnGap);
  const gapX = (c: number) => colX(c) + m.nodeWidth + m.columnGap / 2; // the gap after column c

  const hasBand = loops.length > 0;
  const channelTop = mainRows ? mainBottom + m.rowGap / 2 : top;
  const channelHeight = channelEdges.length ? (channelEdges.length - 1) * m.laneGap + m.rowGap : 0;
  const bandRowY: number[] = [];
  const bandRowUnder: number[] = [];
  let cursor = channelTop + channelHeight + (mainRows ? m.rowGap / 2 : 0);
  for (let r = 0; r < rowEnds.length; r++) {
    const lanes = Math.max(0, ...loops.map((_, li) => (loopRow[li] === r ? underCount[li]! : 0)));
    const under = lanes ? m.rowGap / 2 + lanes * m.laneGap : 0;
    bandRowY.push(cursor + m.bandCaption);
    bandRowUnder.push(under);
    cursor += m.bandCaption + m.nodeHeight + under + m.rowGap;
  }

  const posOf = new Map<string, Point>();
  for (const id of mainIds) posOf.set(id, [colX(columnOf.get(id)!), rowY(rowOf.get(nodeItem(id))!)]);
  loops.forEach((members, li) => {
    for (const id of members) posOf.set(id, [colX(columnOf.get(id)!), bandRowY[loopRow[li]!]!]);
  });

  const width = columns ? colX(columns) - m.columnGap + m.padding : 0;
  const height = !columns ? 0 : hasBand ? cursor - m.rowGap + m.padding : mainBottom + m.padding;

  // ── route ─────────────────────────────────────────────────────────────
  // Vertical runs are collected per gap, then spread into lanes. Runs that
  // leave the same item share a lane (a fan-out reads as one trunk); runs
  // into the same item share one too (a fan-in merges).
  interface Run { edge: string; gap: number; lane: string; y1: number; y2: number }
  const runs: Run[] = [];
  const addRun = (edge: string, gap: number, lane: string, y1: number, y2: number) => {
    runs.push({ edge, gap, lane, y1, y2 });
    return runs.length - 1;
  };
  // A long link that stays on one row runs along the row's centre line —
  // every slot it passes on that row is its own, so nothing can be mistaken
  // for it. One that changes rows runs through its free slots a little above
  // the centre, so it is never level with another card's own link stub.
  const dummyLift = Math.round(m.nodeHeight * 0.2);
  const itemY = (key: string, straight: boolean) => {
    if (key.startsWith("n:")) return midY(posOf.get(key.slice(2))![1]);
    return midY(rowY(rowOf.get(key)!)) - (straight ? 0 : dummyLift);
  };
  const itemCol = (key: string) =>
    key.startsWith("n:") ? columnOf.get(key.slice(2))! : Number(key.slice(key.lastIndexOf(":") + 1));

  interface Plan { edge: TuxGraphEdge; key: string; build: (laneX: (run: number) => number) => Point[] }
  const plans: Plan[] = [];
  for (const e of valid) {
    const key = tuxGraphEdgeKey(e.from, e.to);
    const kind = kindOf.get(key)!;
    const [fx, fy] = posOf.get(e.from)!;
    const [tx, ty] = posOf.get(e.to)!;
    const x1 = fx + m.nodeWidth;
    const y1 = midY(fy);
    const x2 = tx;
    const y2 = midY(ty);
    const ca = columnOf.get(e.from)!;
    const cb = columnOf.get(e.to)!;
    const srcLane = `s:${e.from}`;
    const dstLane = `t:${e.to}`;

    if (kind === "main") {
      const chain = chains.get(key)!;
      const straight = chain.every((item) => rowOf.get(item) === rowOf.get(chain[0]!));
      const ids = chain.slice(0, -1).map((item, i) =>
        addRun(key, itemCol(item), srcLane, itemY(item, straight), itemY(chain[i + 1]!, straight)),
      );
      plans.push({
        edge: e,
        key,
        build: (laneX) => {
          const pts: Point[] = [[x1, y1]];
          ids.forEach((run) => {
            const r = runs[run]!;
            pts.push([laneX(run), r.y1], [laneX(run), r.y2]);
          });
          pts.push([x2, y2]);
          return pts;
        },
      });
    } else if (kind === "straight" || kind === "adjacent") {
      const run = addRun(key, ca, kind === "adjacent" ? srcLane : `e:${key}`, y1, y2);
      plans.push({ edge: e, key, build: (laneX) => [[x1, y1], [laneX(run), y1], [laneX(run), y2], [x2, y2]] });
    } else if (kind === "channel") {
      const cy = channelTop + m.rowGap / 2 + channelLane.get(key)! * m.laneGap;
      const out = addRun(key, ca, srcLane, y1, cy);
      const into = addRun(key, cb - 1, dstLane, cy, y2);
      plans.push({
        edge: e,
        key,
        build: (laneX) => [[x1, y1], [laneX(out), y1], [laneX(out), cy], [laneX(into), cy], [laneX(into), y2], [x2, y2]],
      });
    } else {
      // Under the loop's row: back to an earlier member, or skipping ahead.
      const li = loopOf.get(e.from)!;
      const r = loopRow[li]!;
      const uy = bandRowY[r]! + m.nodeHeight + m.rowGap / 2 + underLane.get(key)! * m.laneGap;
      const out = addRun(key, ca, `e:${key}`, y1, uy);
      const into = addRun(key, cb - 1, `e:${key}:in`, uy, y2);
      plans.push({
        edge: e,
        key,
        build: (laneX) => [[x1, y1], [laneX(out), y1], [laneX(out), uy], [laneX(into), uy], [laneX(into), y2], [x2, y2]],
      });
    }
  }

  // Spread each gap's lanes around the gap's centre line; only runs that
  // actually move vertically claim a lane.
  const laneXByRun = new Map<number, number>();
  const byGap = new Map<number, number[]>();
  runs.forEach((r, i) => {
    if (Math.abs(r.y1 - r.y2) < 0.5) {
      laneXByRun.set(i, gapX(r.gap));
      return;
    }
    if (!byGap.has(r.gap)) byGap.set(r.gap, []);
    byGap.get(r.gap)!.push(i);
  });
  for (const [gap, ids] of byGap) {
    const lanes = new Map<string, number[]>();
    for (const i of ids) {
      const lane = runs[i]!.lane;
      if (!lanes.has(lane)) lanes.set(lane, []);
      lanes.get(lane)!.push(i);
    }
    const order = [...lanes.entries()]
      .map(([lane, members]) => ({
        lane,
        members,
        y: members.reduce((s, i) => s + Math.min(runs[i]!.y1, runs[i]!.y2), 0) / members.length,
      }))
      .sort((a, b) => a.y - b.y || (a.lane < b.lane ? -1 : 1));
    const usable = m.columnGap - 24;
    const step = order.length > 1 ? Math.min(m.laneGap, usable / (order.length - 1)) : 0;
    order.forEach(({ members }, i) => {
      const x = gapX(gap) + (i - (order.length - 1) / 2) * step;
      for (const run of members) laneXByRun.set(run, x);
    });
  }
  const laneX = (run: number) => laneXByRun.get(run)!;

  const routed: TuxGraphRoutedEdge[] = plans.map(({ edge, key, build }) => {
    const pts = build(laneX);
    const [ex, ey] = pts[pts.length - 1]!;
    // Stop the line inside the arrowhead so it doesn't poke through the tip.
    pts[pts.length - 1] = [ex - 4, ey];
    const a = nodeOf.get(edge.from)!;
    const b = nodeOf.get(edge.to)!;
    const la = loopOf.get(edge.from);
    return {
      key,
      from: edge.from,
      to: edge.to,
      blocking: !a.done && !b.done,
      loop: la !== undefined && la === loopOf.get(edge.to),
      d: roundedPath(pts),
      arrow: arrowHead(ex, ey),
    };
  });

  const frames: TuxGraphFrame[] = loops.map((members, li) => {
    const r = loopRow[li]!;
    const start = loopStart[li]!;
    const pad = 10;
    return {
      loop: li,
      x: colX(start) - pad,
      y: bandRowY[r]! - m.bandCaption,
      width: members.length * m.nodeWidth + (members.length - 1) * m.columnGap + pad * 2,
      height: m.bandCaption + m.nodeHeight + bandRowUnder[r]! + pad,
    };
  });

  // ── assemble ──────────────────────────────────────────────────────────
  const placed: TuxGraphPlacedNode[] = linked.map((id) => {
    const node = nodeOf.get(id)!;
    const blockers = preds.get(id)!;
    const [x, y] = posOf.get(id)!;
    const li = loopOf.get(id);
    const openBlockers = node.done ? 0 : blockers.filter((b) => !nodeOf.get(b)!.done).length;
    return {
      id,
      node,
      column: columnOf.get(id)!,
      band: li === undefined ? "main" : "loop",
      row: li === undefined ? rowOf.get(nodeItem(id))! : loopRow[li]!,
      loop: li ?? null,
      x,
      y,
      blockers,
      dependents: succs.get(id)!,
      waitingOn: openBlockers,
      unblocked: !node.done && blockers.length > 0 && openBlockers === 0,
      behindLoop: behind.has(id),
    };
  });
  placed.sort((a, b) =>
    a.column - b.column || (a.band === b.band ? 0 : a.band === "main" ? -1 : 1) || a.y - b.y || a.x - b.x,
  );

  const layers = best.map((l) => l.filter((k) => k.startsWith("n:")).map((k) => k.slice(2)));

  return {
    width,
    height,
    columns,
    columnX: Array.from({ length: columns }, (_, c) => colX(c)),
    layers,
    loops,
    loopIsCircle,
    placed,
    byId: Object.fromEntries(placed.map((p) => [p.id, p])),
    isolated,
    edges: routed,
    frames,
    ignored,
    hiddenDone: hidden.size,
    metrics: m,
  };
}

export interface TuxGraphChain {
  /** The item, everything it waits on (all the way up), and everything waiting on it (all the way down). */
  nodes: Set<string>;
  /** Edge keys on those chains — a link that bypasses the item is not included. */
  edges: Set<string>;
}

/** The whole upstream and downstream chain of one item. Loop-safe. */
export function tuxDependencyChain(layout: TuxGraphLayout, id: string): TuxGraphChain {
  const walk = (start: string, next: (p: TuxGraphPlacedNode) => string[]) => {
    const seen = new Set<string>();
    const stack = [start];
    while (stack.length) {
      const v = stack.pop()!;
      const p = layout.byId[v];
      if (!p) continue;
      for (const w of next(p)) {
        if (seen.has(w)) continue;
        seen.add(w);
        stack.push(w);
      }
    }
    return seen;
  };
  const up = walk(id, (p) => p.blockers);
  const down = walk(id, (p) => p.dependents);
  const nodes = new Set<string>([id, ...up, ...down]);
  const edges = new Set<string>();
  for (const e of layout.edges) {
    const upstream = up.has(e.from) && (e.to === id || up.has(e.to));
    const downstream = down.has(e.to) && (e.from === id || down.has(e.from));
    if (upstream || downstream) edges.add(e.key);
  }
  return { nodes, edges };
}

export type TuxGraphDirection = "left" | "right" | "up" | "down";

/** The placed item nearest to `id` in a direction, by card centres; null at the edge. */
export function tuxNearestGraphNode(layout: TuxGraphLayout, id: string, dir: TuxGraphDirection): string | null {
  const from = layout.byId[id];
  if (!from) return null;
  const { nodeWidth: w, nodeHeight: h } = layout.metrics;
  const cx = from.x + w / 2;
  const cy = from.y + h / 2;
  let best: string | null = null;
  let bestScore = Number.POSITIVE_INFINITY;
  for (const p of layout.placed) {
    if (p.id === id) continue;
    const dx = p.x + w / 2 - cx;
    const dy = p.y + h / 2 - cy;
    const ahead = dir === "right" ? dx : dir === "left" ? -dx : dir === "down" ? dy : -dy;
    if (ahead < 1) continue;
    const side = dir === "left" || dir === "right" ? Math.abs(dy) : Math.abs(dx);
    const score = ahead + side * 3;
    if (score < bestScore) {
      bestScore = score;
      best = p.id;
    }
  }
  return best;
}
