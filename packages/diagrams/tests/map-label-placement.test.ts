/**
 * Wire-label placement in `routeGridWires` (#159).
 *
 * The overlap tests of the label pass read the layout grid's buckets. The labels must land where
 * the full scans put them, so every case below is compared with
 * `support/map-label-placement.snapshot.json`, which was recorded from the router as it was
 * before that change (`TUX_MAP_LABEL_SNAPSHOT=write npx vitest run tests/map-label-placement.test.ts`
 * records it again; do that only when a change of placement is intended).
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  GRID_METRICS,
  gridCellToPx,
  routeGridWires,
  type TuxMapGridCellRect,
  type TuxMapLevelElement,
  type TuxMapLevelRel,
} from "../app/utils/tuxArchitectureMap";
import { DEFAULT_TTI_LEVEL_MODEL } from "../app/utils/tuxArchitectureMapSample";
import { buildDenseViewFixture, createSeededRandom, layoutDenseView } from "./support/mapSyntheticModels";

const SNAPSHOT = join(import.meta.dirname, "support", "map-label-placement.snapshot.json");

interface LabelCase {
  id: string;
  rels: TuxMapLevelRel[];
  rects: Record<string, TuxMapGridCellRect>;
  els: TuxMapLevelElement[];
}

interface CaseRecord {
  wires: number;
  /** One entry per label, in order: `[x, y, w, h, forced]`. */
  labels: [number | null, number | null, number, number, 0 | 1][];
  /** sha256 of the whole result (every wire path and every label field). */
  sha256: string;
}

const WORDS = ["calls", "imports", "reads", "writes", "sends", "publishes to", "subscribes", "renders", "validates"];
const TECH = ["HTTPS", "gRPC", "SQL", "AMQP", "JSON over HTTPS"];

/** A dense view with a seeded choice of wires: labelled or not, short or long, with or without a second line. */
function seededCase(seed: number, opts: { inner: number; cols: number; perSide: number; wires: number; gridCells: boolean; longLabels: boolean }): LabelCase {
  const rnd = createSeededRandom(seed);
  const inner = Array.from({ length: opts.inner }, (_, i) => ({ id: `n${i}`, name: `Node ${i}` }));
  const ins = Array.from({ length: opts.perSide }, (_, i) => ({ id: `in${i}`, name: `Caller ${i}` }));
  const outs = Array.from({ length: opts.perSide }, (_, i) => ({ id: `out${i}`, name: `Dep ${i}` }));
  const { rects, els } = layoutDenseView({ inner, ins, outs, cols: opts.cols });
  if (opts.gridCells) {
    inner.forEach((card, i) => {
      rects[card.id] = { ...rects[card.id]!, c: i % opts.cols, r: Math.floor(i / opts.cols) };
    });
  }
  const rels: TuxMapLevelRel[] = [];
  const label = () => {
    const roll = rnd.next();
    if (roll < 0.12) return "";
    const base = rnd.pick(WORDS);
    if (opts.longLabels || roll > 0.8) return `${base} ${rnd.pick(WORDS)} and ${rnd.pick(WORDS)} ${rnd.int(10, 99)}`;
    return base;
  };
  for (let k = 0; k < opts.wires; k++) {
    const roll = rnd.next();
    const a = rnd.pick(inner).id;
    let rel: TuxMapLevelRel;
    if (opts.perSide > 0 && roll < 0.15) rel = { from: rnd.pick(ins).id, to: a, label: label() };
    else if (opts.perSide > 0 && roll < 0.3) rel = { from: a, to: rnd.pick(outs).id, label: label() };
    else if (opts.perSide > 0 && roll < 0.36) rel = { from: rnd.pick(ins).id, to: "@bound", label: label() };
    else if (opts.perSide > 0 && roll < 0.42) rel = { from: "@bound", to: rnd.pick(outs).id, label: label() };
    else {
      let b = rnd.pick(inner).id;
      if (b === a) b = inner[(inner.findIndex((c) => c.id === a) + 1) % inner.length]!.id;
      rel = { from: a, to: b, label: label() };
    }
    if (rel.label && rnd.next() < 0.3) rel.tech = rnd.pick(TECH);
    if (rnd.next() < 0.1) rel.status = "planned";
    rels.push(rel);
  }
  return { id: `seed-${seed}`, rels, rects, els };
}

function buildCases(): LabelCase[] {
  const cases: LabelCase[] = [];

  // The dense routed view the unit tests use: 100 wires, so every label is hidden at rest
  cases.push({ id: "dense-default", ...buildDenseViewFixture() });
  // The same shape under the 30-wire limit, as generated and with every wire labelled
  for (const [rows, cols, perSide, innerRels] of [
    [2, 3, 1, 6],
    [3, 4, 2, 10],
    [3, 3, 4, 6],
    [4, 5, 3, 12],
    [5, 6, 2, 18],
    [5, 6, 4, 6],
  ] as const) {
    const f = buildDenseViewFixture({ rows, cols, perSide, innerRels });
    const id = `dense-${rows}x${cols}-${perSide}-${innerRels}`;
    cases.push({ id, ...f });
    cases.push({
      id: `${id}-all-labelled`,
      ...f,
      rels: f.rels.map((r, k) => ({ ...r, label: r.label || `passes result ${k} to`, ...(k % 3 === 0 ? { tech: "JSON over HTTPS" } : {}) })),
    });
  }

  // The default Level 2 model on the cell grid
  const level2Rects: Record<string, TuxMapGridCellRect> = {};
  for (const el of DEFAULT_TTI_LEVEL_MODEL.level2.elements) {
    if (!el.at) continue;
    const pos = gridCellToPx(el.at);
    level2Rects[el.id] = { x: pos.x, y: pos.y, w: GRID_METRICS.CW, h: GRID_METRICS.CH, c: el.at[0], r: el.at[1] };
  }
  cases.push({
    id: "default-level2",
    rels: DEFAULT_TTI_LEVEL_MODEL.level2.rels,
    rects: level2Rects,
    els: DEFAULT_TTI_LEVEL_MODEL.level2.elements as TuxMapLevelElement[],
  });

  // Seeded views: few to many cards, 4 to 30 wires, and some above the limit
  let seed = 1590;
  for (const inner of [6, 12, 30, 60, 120, 240]) {
    for (const cols of [2, 4, 6]) {
      for (const wires of [4, 12, 30]) {
        seed++;
        cases.push(
          seededCase(seed, {
            inner,
            cols,
            perSide: seed % 3 === 0 ? 0 : (seed % 5) + 1,
            wires,
            gridCells: seed % 2 === 0,
            longLabels: seed % 4 === 0,
          }),
        );
      }
    }
  }
  for (const wires of [31, 45, 120]) {
    seed++;
    cases.push(seededCase(seed, { inner: 60, cols: 4, perSide: 4, wires, gridCells: true, longLabels: false }));
  }
  // Crowded: 30 long two-line labels between a handful of cards, so some find no free spot
  for (const [inner, cols] of [
    [4, 2],
    [6, 3],
    [9, 3],
    [6, 6],
  ] as const) {
    seed++;
    const c = seededCase(seed, { inner, cols, perSide: 2, wires: 30, gridCells: seed % 2 === 0, longLabels: true });
    c.rels = c.rels.map((r, k) => ({ ...r, label: r.label || `hands batch ${k} over to`, tech: "JSON over HTTPS" }));
    cases.push({ ...c, id: `crowded-${inner}x${cols}` });
  }
  // The same crowding in a corner of a large view, where the cover sum reads the buckets; once
  // more with a card that has no usable position, where it must go back to scanning every box
  for (const [inner, cols, ghost] of [
    [120, 4, false],
    [240, 6, false],
    [120, 4, true],
  ] as const) {
    seed++;
    const c = seededCase(seed, { inner, cols, perSide: 2, wires: 0, gridCells: seed % 2 === 0, longLabels: true });
    for (let k = 0; k < 30; k++) {
      const a = k % 6;
      c.rels.push({ from: `n${a}`, to: `n${(a + 1 + (k % 3)) % 8}`, label: `hands batch ${k} over to`, tech: "JSON over HTTPS" });
    }
    if (ghost) {
      c.rects.ghost = { x: Number.NaN, y: 96, w: GRID_METRICS.CW, h: GRID_METRICS.CH };
      c.els.push({ id: "ghost", name: "Ghost", kind: "module" });
    }
    cases.push({ ...c, id: `crowded-in-${inner}${ghost ? "-not-finite-card" : ""}` });
  }
  // A card with no usable position, alone and as the end of three wires: nothing can be bucketed
  // for it, so the pass falls back to testing every box
  for (const wired of [false, true]) {
    seed++;
    const c = seededCase(seed, { inner: 9, cols: 3, perSide: 2, wires: 27, gridCells: false, longLabels: true });
    c.rects.ghost = { x: Number.NaN, y: 96, w: GRID_METRICS.CW, h: GRID_METRICS.CH };
    c.els.push({ id: "ghost", name: "Ghost", kind: "module" });
    c.rels = c.rels.map((r, k) => ({ ...r, label: r.label || `hands batch ${k} over to`, tech: "JSON over HTTPS" }));
    if (wired) {
      c.rels.splice(3, 0, { from: "n0", to: "ghost", label: "reaches for" });
      c.rels.splice(11, 0, { from: "ghost", to: "n4", label: "answers", tech: "HTTPS" });
      c.rels.push({ from: "n8", to: "ghost", label: "waits on" });
    }
    cases.push({ ...c, id: wired ? "not-finite-card-wired" : "not-finite-card" });
  }
  return cases;
}

function record(c: LabelCase): CaseRecord {
  const routed = routeGridWires(c.rels, c.rects, c.els);
  return {
    wires: routed.wires.length,
    // Through JSON, as the snapshot is: a position that is not a number reads back as null
    labels: JSON.parse(JSON.stringify(routed.labels.map((l) => [l.x, l.y, l.w, l.h, l.forced ? 1 : 0]))),
    sha256: createHash("sha256").update(JSON.stringify(routed)).digest("hex"),
  };
}

describe("wire labels land where the full scans put them (#159)", () => {
  const cases = buildCases();
  const write = process.env.TUX_MAP_LABEL_SNAPSHOT === "write";

  it.runIf(write)("records the snapshot", () => {
    const out: Record<string, CaseRecord> = {};
    for (const c of cases) out[c.id] = record(c);
    writeFileSync(SNAPSHOT, `${JSON.stringify(out)}\n`);
  });

  it.skipIf(write)("every case matches the recorded positions and wire paths", () => {
    expect(existsSync(SNAPSHOT)).toBe(true);
    const snapshot = JSON.parse(readFileSync(SNAPSHOT, "utf8")) as Record<string, CaseRecord>;
    expect(Object.keys(snapshot).sort()).toEqual(cases.map((c) => c.id).sort());
    for (const c of cases) {
      const now = record(c);
      const then = snapshot[c.id]!;
      expect(now.labels, `${c.id}: label positions`).toEqual(then.labels);
      expect(now.sha256, `${c.id}: whole result`).toBe(then.sha256);
    }
  });

  it.skipIf(write)("the cases reach every branch of the label pass", () => {
    const snapshot = JSON.parse(readFileSync(SNAPSHOT, "utf8")) as Record<string, CaseRecord>;
    const records = Object.values(snapshot);
    const underLimit = records.filter((r) => r.wires <= 30);
    // Labels placed in a free spot
    expect(underLimit.reduce((n, r) => n + r.labels.filter((l) => l[4] === 0).length, 0)).toBeGreaterThan(300);
    // Labels that found no free spot and took the least-covered one (`forced` under the limit)
    expect(underLimit.reduce((n, r) => n + r.labels.filter((l) => l[4] === 1).length, 0)).toBeGreaterThan(20);
    // Views over the limit: every label hidden at rest, each still with a position
    const overLimit = records.filter((r) => r.wires > 30);
    expect(overLimit.length).toBeGreaterThanOrEqual(4);
    for (const r of overLimit) {
      expect(r.labels.length).toBeGreaterThan(0);
      expect(r.labels.every((l) => l[4] === 1 && Number.isFinite(l[0]) && Number.isFinite(l[1]))).toBe(true);
    }
    // A wire to a card with no usable position still gets its label entry, as before
    expect(snapshot["not-finite-card-wired"]!.labels.some((l) => l[0] === null)).toBe(true);
  });
});
