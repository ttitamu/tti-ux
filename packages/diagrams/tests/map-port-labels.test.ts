/**
 * Wire labels sit at the ports (#210): a short label beside each end of a wire, outside the card,
 * never over any card. The rules are `routeGridWires`'s; they are asserted here on small layouts
 * made by hand, and then on every view of the fixtures.
 */
import { describe, expect, it } from "vitest";
import {
  GRID_METRICS,
  gridCellToPx,
  routeGridWires,
  shortWireLabel,
  type TuxMapGridCellRect,
  type TuxMapLevelElement,
  type TuxMapLevelRel,
  type TuxMapRoutedLabel,
} from "../app/utils/tuxArchitectureMap";
import { wireLabelAttrs } from "../app/utils/internal/tuxArchitectureMapStage";
import { labelFixtureViews, LARGEST_FIXTURE_DEEP_EVERY } from "./support/mapLabelViews";
import { buildDenseViewFixture } from "./support/mapSyntheticModels";

type Box = { x: number; y: number; w: number; h: number };
const overlaps = (a: Box, b: Box) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

/** A view of grid cards: `cells` maps an id to its `[column, row]`. */
function gridView(cells: Record<string, [number, number]>) {
  const rects: Record<string, TuxMapGridCellRect> = {};
  const els: TuxMapLevelElement[] = [];
  for (const [id, at] of Object.entries(cells)) {
    const pos = gridCellToPx(at);
    rects[id] = { x: pos.x, y: pos.y, w: GRID_METRICS.CW, h: GRID_METRICS.CH, c: at[0], r: at[1] };
    els.push({ id, name: id, kind: "container" });
  }
  return { rects, els };
}
const cardsOf = (rects: Record<string, TuxMapGridCellRect>) => Object.values(rects).filter((r) => !r.bound);
/** 0 a rule violation, 1 what a live link does, 2 what a planned one does, 3 a technology. */
const rank = (l: TuxMapRoutedLabel) => (l.violating ? 0 : l.t2 ? 3 : l.planned ? 2 : 1);
const text = (l: TuxMapRoutedLabel) => l.t1 || `[${l.t2}]`;

describe("shortWireLabel (#210)", () => {
  it("keeps a label of up to sixteen characters, and the leading words of a longer one", () => {
    const at16: [string, string][] = [
      ["Reads & writes", "Reads & writes"],
      ["Uses portal & API", "Uses portal…"],
      ["Signs users in; syncs roles", "Signs users in…"],
      ["Exports nightly datasets", "Exports nightly…"],
    ];
    for (const [full, short] of at16) {
      expect(shortWireLabel(full), full).toBe(short);
      expect(Array.from(shortWireLabel(full)).length, full).toBeLessThanOrEqual(16);
    }
  });

  it("cuts to ten characters where sixteen do not fit", () => {
    const cases: [string, string][] = [
      ["Reads", "Reads"],
      ["Calls REST", "Calls REST"],
      ["  3 links ", "3 links"],
      ["Reads & writes", "Reads…"],
      ["Uses portal & API", "Uses…"],
      ["Semantic queries", "Semantic…"],
      ["Routes /api/*", "Routes…"],
      ["Signs users in; syncs roles", "Signs…"],
      ["Pulls base images", "Pulls…"],
      ["Runs a job (nightly) there", "Runs a…"],
      ["1536d float32[]", "1536d…"],
      // a first word that does not fit is cut
      ["Dispatches plugins", "Dispatche…"],
      ["OpenTelemetry", "OpenTelem…"],
    ];
    for (const [full, short] of cases) {
      expect(shortWireLabel(full, 10), full).toBe(short);
      expect(Array.from(shortWireLabel(full, 10)).length, full).toBeLessThanOrEqual(10);
    }
  });

  it("cuts to the length it is given, and never through a character", () => {
    expect(shortWireLabel("imports", 6)).toBe("impor…");
    expect(shortWireLabel("calls", 6)).toBe("calls");
    expect(shortWireLabel("Fetches data", 6)).toBe("Fetch…");
    expect(shortWireLabel("😀😀😀😀😀😀😀😀", 6)).toBe("😀😀😀😀😀…");
  });
});

describe("where a wire's labels go (#210)", () => {
  it("puts what the link does at its source port and its technology at its target port, outside both cards", () => {
    const { rects, els } = gridView({ a: [0, 0], b: [2, 0] });
    const { labels } = routeGridWires([{ from: "a", to: "b", label: "Reads & writes", tech: "SQL 5432" }], rects, els);
    expect(labels).toHaveLength(2);
    const [verb, tech] = labels as [TuxMapRoutedLabel, TuxMapRoutedLabel];
    expect(verb).toMatchObject({ end: "from", side: "r", t1: "Reads & writes", t2: "", forced: false, full: "Reads & writes [SQL 5432]" });
    expect(tech).toMatchObject({ end: "to", side: "l", t1: "", t2: "SQL 5432", forced: false, full: "Reads & writes [SQL 5432]" });
    // 4 px off the card, on the wire's stub
    expect(verb.x).toBe(rects.a!.x + rects.a!.w + 4);
    expect(tech.x + tech.w).toBe(rects.b!.x - 4);
    for (const l of labels) {
      expect(l.h).toBe(17);
      expect(l.y + l.h / 2).toBe(rects.a!.y + rects.a!.h / 2);
      for (const c of cardsOf(rects)) expect(overlaps(l, c)).toBe(false);
    }
  });

  it("draws one label, at the source, when the target end would say the same thing", () => {
    const { rects, els } = gridView({ a: [0, 0], b: [2, 0] });
    const { labels } = routeGridWires([{ from: "a", to: "b", label: "Calls" }], rects, els);
    expect(labels.map((l) => [l.end, text(l), l.full])).toEqual([["from", "Calls", "Calls"]]);
  });

  it("labels a top or bottom port on the wire's stub, in the gap between the rows", () => {
    const { rects, els } = gridView({ a: [0, 0], b: [0, 1] });
    const { labels } = routeGridWires([{ from: "a", to: "b", label: "Starts", tech: "systemd" }], rects, els);
    const [verb, tech] = labels as [TuxMapRoutedLabel, TuxMapRoutedLabel];
    expect(verb).toMatchObject({ end: "from", side: "b", y: rects.a!.y + rects.a!.h + 4 });
    expect(tech).toMatchObject({ end: "to", side: "t", y: rects.b!.y - 4 - 17 });
    expect(verb.x + verb.w / 2).toBe(rects.a!.x + rects.a!.w / 2);
  });

  it("labels a wire to or from the boundary at its one card end, with what the link does", () => {
    const { rects, els } = gridView({ k: [1, 0] });
    rects["@bound"] = { x: 300, y: 28, w: 300, h: 220, bound: true };
    rects.caller = { x: 28, y: 80, w: 210, h: 92, mini: true, side: "in" };
    rects.dep = { x: 700, y: 80, w: 210, h: 92, mini: true, side: "out" };
    els.push({ id: "caller", name: "Caller", kind: "module", mini: true }, { id: "dep", name: "Dep", kind: "module", mini: true });
    const { labels } = routeGridWires(
      [
        { from: "caller", to: "@bound", label: "3 links", tech: "HTTPS" },
        { from: "@bound", to: "dep", label: "1 link" },
      ],
      rects,
      els,
    );
    expect(labels.map((l) => [l.from, l.end, l.side, text(l), l.full])).toEqual([
      ["caller", "from", "r", "3 links", "3 links [HTTPS]"],
      ["@bound", "to", "l", "1 link", "1 link"],
    ]);
  });

  it('reads "Planned" on a planned link the model gives no label, and marks every planned label', () => {
    const { rects, els } = gridView({ a: [0, 0], b: [2, 0], c: [2, 1] });
    const { labels } = routeGridWires(
      [
        { from: "a", to: "b", status: "planned" },
        { from: "a", to: "c", label: "Exports nightly datasets", tech: "Parquet", status: "planned" },
      ],
      rects,
      els,
    );
    expect(labels.map((l) => [text(l), l.full, l.planned])).toEqual([
      ["Planned", "Planned", true],
      ["Exports nightly…", "Exports nightly datasets [Parquet]", true],
      ["[Parquet]", "Exports nightly datasets [Parquet]", true],
    ]);
    expect(wireLabelAttrs(labels[1]!)["aria-label"]).toBe("Inspect wire Exports nightly datasets [Parquet] (planned)");
  });

  it("stacks the labels at one side of a card port by port, in the order the wires leave", () => {
    const { rects, els } = gridView({ a: [0, 1], b0: [2, 0], b1: [2, 1], b2: [2, 2], b3: [2, 3] });
    const rels = ["b2", "b0", "b3", "b1"].map((to) => ({ from: "a", to, label: `to ${to}` }));
    const { labels } = routeGridWires(rels, rects, els);
    const stack = labels.filter((l) => l.end === "from").sort((u, v) => u.y - v.y);
    expect(stack.map((l) => l.t1)).toEqual(["to b0", "to b1", "to b2", "to b3"]);
    expect(stack.every((l) => !l.forced && l.side === "r" && l.x === rects.a!.x + rects.a!.w + 4)).toBe(true);
    for (let i = 1; i < stack.length; i++) expect(stack[i]!.y - stack[i - 1]!.y).toBeGreaterThanOrEqual(17);
  });

  it("with no room at the port: beside the stub, then shorter, then the wire's other end, then hidden", () => {
    // Facing cards one gap apart, both labels on the same stub: 84 px holds one of them on the stub
    const near = gridView({ a: [0, 0], b: [1, 0] });
    const pair = routeGridWires([{ from: "a", to: "b", label: "Fetches data", tech: "REST / GraphQL" }], near.rects, near.els).labels;
    expect(pair.map((l) => [text(l), l.forced])).toEqual([["Fetches…", false], ["[REST…]", false]]);
    expect(overlaps(pair[0]!, pair[1]!)).toBe(false);
    // the technology gave way: it is off the stub, the label of what the link does is on it
    const portY = near.rects.a!.y + near.rects.a!.h / 2;
    expect(pair[0]!.y + pair[0]!.h / 2).toBe(portY);
    expect(Math.abs(pair[1]!.y + pair[1]!.h / 2 - portY)).toBeGreaterThan(8);

    // Nine wires leave one side: ports 11 px apart, labels 17 px tall. Some are shortened, some move
    // to their target's port, and no visible label lies over another
    const { rects, els } = gridView({ a: [0, 4], ...Object.fromEntries(Array.from({ length: 9 }, (_, i) => [`t${i}`, [2, i]])) });
    const rels = Array.from({ length: 9 }, (_, i) => ({ from: "a", to: `t${i}`, label: `imports ${i}` }));
    const { labels } = routeGridWires(rels, rects, els);
    expect(labels).toHaveLength(9);
    expect(labels.some((l) => l.end === "to")).toBe(true);
    expect(labels.every((l) => !l.forced)).toBe(true);
    const shown = labels.filter((l) => !l.forced);
    for (let i = 0; i < shown.length; i++) {
      for (let j = i + 1; j < shown.length; j++) expect(overlaps(shown[i]!, shown[j]!)).toBe(false);
    }
  });

  it("hides the label of the lower rank: violations, live links, planned links, then technologies; then the model's order", () => {
    // Sixteen wires between two facing cards: sixteen ports on each of the two facing sides
    const { rects, els } = gridView({ a: [0, 0], b: [1, 0] });
    const rels: TuxMapLevelRel[] = Array.from({ length: 16 }, (_, i) => ({
      from: "a",
      to: "b",
      label: `passes ${i}`,
      tech: "gRPC",
      ...(i === 13 ? { violations: [{ rule: "no-cycles", message: "cycle" }] } : {}),
      ...(i === 3 ? { status: "planned" as const } : {}),
    }));
    const { labels } = routeGridWires(rels, rects, els);
    const hidden = labels.filter((l) => l.forced);
    const shown = labels.filter((l) => !l.forced);
    expect(hidden.length).toBeGreaterThan(8);
    expect(shown.length).toBeGreaterThan(4);
    // the violation is drawn, at both ends, though thirteen wires come before it in the model
    expect(labels.filter((l) => l.violating).map((l) => l.forced)).toEqual([false, false]);
    // technologies give way first
    expect(hidden.filter((l) => l.t2).length).toBeGreaterThan(hidden.filter((l) => l.t1).length);
    const order = (l: TuxMapRoutedLabel) => labels.indexOf(l);
    for (const h of hidden) {
      // a hidden label keeps a place at a port, clear of every card, for when its card is lit
      expect(h.end).toBeDefined();
      for (const c of cardsOf(rects)) expect(overlaps(h, c)).toBe(false);
      // and what holds its spot outranks it, or came first
      const holders = shown.filter((s) => overlaps(s, h));
      expect(holders.length).toBeGreaterThan(0);
      for (const s of holders) {
        expect(rank(s) < rank(h) || (rank(s) === rank(h) && order(s) < order(h)), `${text(s)} over ${text(h)}`).toBe(true);
      }
    }
  });

  it("keeps a label for a wire with no spot clear of the cards, hidden, on the wire", () => {
    // Columns 30 px apart: no label fits between them
    const rects: Record<string, TuxMapGridCellRect> = {
      a: { x: 28, y: 58, w: 212, h: 128, c: 0, r: 0 },
      b: { x: 270, y: 58, w: 212, h: 128, c: 1, r: 0 },
    };
    const els: TuxMapLevelElement[] = [
      { id: "a", name: "A", kind: "container" },
      { id: "b", name: "B", kind: "container" },
    ];
    const { labels } = routeGridWires([{ from: "a", to: "b", label: "Reads & writes", tech: "SQL" }], rects, els);
    expect(labels).toHaveLength(1);
    expect(labels[0]).toMatchObject({ forced: true, t1: "Reads…", full: "Reads & writes [SQL]" });
    expect(labels[0]!.end).toBeUndefined();
  });
});

describe("what a wire label's button is given (#210)", () => {
  const base: TuxMapRoutedLabel = { id: "lbl-0-a-b", from: "a", to: "b", x: 100, y: 50, w: 60, h: 17, t1: "Reads…", t2: "", forced: false, full: "Reads & writes [SQL]" };

  it("hangs by the edge that faces the card, in a box no wider than the router kept clear", () => {
    expect(wireLabelAttrs({ ...base, end: "from", side: "r" }).style).toEqual({ left: "100px", top: "58.5px", maxWidth: "60px" });
    expect(wireLabelAttrs({ ...base, end: "from", side: "l" }).style).toEqual({ left: "160px", top: "58.5px", maxWidth: "60px" });
    expect(wireLabelAttrs({ ...base, end: "from", side: "b" }).style).toEqual({ left: "130px", top: "58.5px", maxWidth: "60px" });
    expect(wireLabelAttrs(base).style.left).toBe("130px");
  });

  it("names it with the whole text, and keeps the technology label out of the Tab order", () => {
    const verb = wireLabelAttrs({ ...base, end: "from", side: "r" });
    expect(verb).toMatchObject({ "aria-label": "Inspect wire Reads & writes [SQL]", title: "Reads & writes [SQL]", "data-end": "from", "data-side": "r" });
    expect(verb.tabindex).toBeUndefined();
    const tech = wireLabelAttrs({ ...base, t1: "", t2: "SQL", end: "to", side: "l", violating: true });
    expect(tech).toMatchObject({ "aria-label": "Inspect wire Reads & writes [SQL] (rule violation), at its target", tabindex: -1 });
  });
});

/**
 * Wires whose label of what the link does is hidden at rest, and labels drawn over a card, with the
 * labels placed along the wires as they were before #210 (recorded from the router at d56f677 over
 * the same views): `[fixture, level, views, labelled wires, hidden, over a card]`.
 */
const ALONG_THE_WIRES: [string, string, number, number, number, number][] = [
  ["sample", "1", 1, 11, 0, 0],
  ["sample", "2", 1, 23, 7, 5],
  ["sample", "3", 12, 39, 36, 33],
  ["sample", "5+", 4, 12, 7, 6],
  ["real-producer", "1", 1, 1, 1, 1],
  ["real-producer", "2", 1, 1, 1, 1],
  ["real-producer", "3", 1, 4, 1, 1],
  ["real-producer", "5+", 322, 972, 446, 126],
  ["synthetic-500", "1", 1, 5, 2, 2],
  ["synthetic-500", "2", 1, 3, 0, 0],
  ["synthetic-500", "3", 2, 4, 1, 0],
  ["synthetic-500", "5+", 51, 1358, 524, 157],
  ["synthetic-2500", "1", 1, 5, 2, 2],
  ["synthetic-2500", "2", 1, 4, 0, 0],
  ["synthetic-2500", "3", 3, 15, 5, 2],
  ["synthetic-2500", "5+", 282, 6810, 2364, 707],
  ["synthetic-10000", "1", 1, 5, 2, 2],
  ["synthetic-10000", "2", 1, 14, 0, 0],
  ["synthetic-10000", "3", 13, 67, 10, 6],
  ["synthetic-10000", "5+", 73, 1906, 746, 183],
];
/** The same counts with the labels at the ports: `[fixture, level, views, labelled wires, hidden]`. */
const AT_THE_PORTS: [string, string, number, number, number][] = [
  ["sample", "1", 1, 11, 0],
  ["sample", "2", 1, 23, 0],
  ["sample", "3", 12, 39, 0],
  ["sample", "5+", 4, 12, 0],
  ["real-producer", "1", 1, 1, 0],
  ["real-producer", "2", 1, 1, 0],
  ["real-producer", "3", 1, 4, 0],
  ["real-producer", "5+", 322, 972, 1],
  ["synthetic-500", "1", 1, 5, 0],
  ["synthetic-500", "2", 1, 3, 0],
  ["synthetic-500", "3", 2, 4, 0],
  ["synthetic-500", "5+", 51, 1358, 84],
  ["synthetic-2500", "1", 1, 5, 0],
  ["synthetic-2500", "2", 1, 4, 0],
  ["synthetic-2500", "3", 3, 15, 0],
  ["synthetic-2500", "5+", 282, 6810, 425],
  ["synthetic-10000", "1", 1, 5, 0],
  ["synthetic-10000", "2", 1, 14, 0],
  ["synthetic-10000", "3", 13, 67, 0],
  ["synthetic-10000", "5+", 73, 1906, 28],
];

describe("port labels on every level of the fixtures (#210)", () => {
  // The docs sample, the real producer's output and the synthetic repositories of 500 and 2,500
  // symbols: every view. Of the 10,000-symbol one: Levels 1 to 3 and one subgraph in sixteen, since
  // each of its 1,153 views costs a pass over 37,000 links (TUX_MAP_LABEL_SWEEP=all reads them all).
  const all = process.env.TUX_MAP_LABEL_SWEEP === "all";
  const views = labelFixtureViews(all);
  const routed = views.map((v) => ({ v, cards: cardsOf(v.rects), ...routeGridWires(v.rels, v.rects, v.els) }));

  it("reads every level of every fixture", () => {
    expect(LARGEST_FIXTURE_DEEP_EVERY).toBe(16);
    expect(views.length).toBeGreaterThanOrEqual(all ? 1853 : 773);
    for (const fixture of ["sample", "real-producer", "synthetic-500", "synthetic-2500", "synthetic-10000"]) {
      const levels = new Set(views.filter((v) => v.fixture === fixture).map((v) => Math.min(v.level, 5)));
      expect([...levels].sort(), fixture).toEqual([1, 2, 3, 5]);
    }
    // deep levels, and views far over the 30 wires above which every label used to be hidden
    expect(Math.max(...views.map((v) => v.level))).toBeGreaterThanOrEqual(7);
    expect(Math.max(...routed.map((r) => r.wires.length))).toBeGreaterThan(500);
    expect(routed.reduce((n, r) => n + r.labels.length, 0)).toBeGreaterThan(11_000);
  });

  it("no label rectangle, drawn or hidden, intersects any card rectangle", () => {
    const over: string[] = [];
    for (const { v, cards, labels } of routed) {
      for (const l of labels) {
        for (const c of cards) {
          if (overlaps(l, c)) over.push(`${v.fixture} L${v.level} ${v.focus}: ${l.id}`);
        }
      }
    }
    expect(over).toEqual([]);
  });

  it("every label sits at a port of its own wire, 4 px off the card, and no drawn label lies over another", () => {
    for (const { v, labels } of routed) {
      const where = `${v.fixture} L${v.level} ${v.focus}`;
      const shown = labels.filter((l) => !l.forced);
      for (const l of labels) {
        expect(l.end, `${where}: ${l.id}`).toBeDefined();
        const card = v.rects[l.end === "from" ? l.from : l.to]!;
        expect(card.bound, `${where}: ${l.id}`).toBeFalsy();
        if (l.side === "r") expect(l.x, l.id).toBeCloseTo(card.x + card.w + 4, 1);
        else if (l.side === "l") expect(l.x + l.w, l.id).toBeCloseTo(card.x - 4, 1);
        else if (l.side === "b") expect(l.y, l.id).toBeCloseTo(card.y + card.h + 4, 1);
        else expect(l.y + l.h, l.id).toBeCloseTo(card.y - 4, 1);
      }
      // by buckets of 128 px: a view here has up to 2,149 wires
      const buckets = new Map<string, TuxMapRoutedLabel[]>();
      for (const l of shown) {
        for (let gx = Math.floor(l.x / 128); gx <= Math.floor((l.x + l.w) / 128); gx++) {
          for (let gy = Math.floor(l.y / 128); gy <= Math.floor((l.y + l.h) / 128); gy++) {
            const key = `${gx},${gy}`;
            const near = buckets.get(key);
            if (!near) buckets.set(key, [l]);
            else {
              for (const o of near) expect(overlaps(l, o), `${where}: ${l.id} over ${o.id}`).toBe(false);
              near.push(l);
            }
          }
        }
      }
    }
  });

  it("hides fewer labels than along the wires on every level, and none where the along-wire labels hid none", () => {
    const counted = new Map<string, [number, number, number]>();
    for (const { v, labels } of routed) {
      const key = `${v.fixture} ${v.level >= 5 ? "5+" : v.level}`;
      const row = counted.get(key) ?? [0, 0, 0];
      const verbs = labels.filter((l) => l.t1);
      row[0]++;
      row[1] += verbs.length;
      row[2] += verbs.filter((l) => l.forced).length;
      counted.set(key, row);
    }
    if (!all) {
      expect([...counted].map(([key, row]) => [...key.split(" "), ...row])).toEqual(AT_THE_PORTS);
    }
    for (const [fixture, level, , wires, hiddenBefore] of ALONG_THE_WIRES) {
      const now = counted.get(`${fixture} ${level}`)!;
      if (!all) expect(now[1], `${fixture} ${level}: labelled wires`).toBe(wires);
      if (hiddenBefore === 0) expect(now[2], `${fixture} ${level}`).toBe(0);
      else if (!all) expect(now[2], `${fixture} ${level}`).toBeLessThan(hiddenBefore);
    }
  });

  it("draws labels in a view of 100 wires, where every label used to be hidden at rest", () => {
    const dense = buildDenseViewFixture();
    const { wires, labels } = routeGridWires(dense.rels, dense.rects, dense.els);
    expect(wires.length).toBe(100);
    expect(labels.filter((l) => !l.forced).length).toBeGreaterThan(labels.length / 2);
    for (const l of labels) for (const c of cardsOf(dense.rects)) expect(overlaps(l, c)).toBe(false);
  });
});
