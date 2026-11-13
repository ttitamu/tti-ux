/**
 * What a selection and a stage build no longer recompute (#227), and that each
 * shortcut gives what the long way gives:
 *
 * - `computeLinkBlastRadius` keeps the tables it reads from `model` (subgraph
 *   owners, hosts, node metadata) per model object: a warm call equals a call
 *   on a copy of every input, which no cache has seen.
 * - `cmpCodepoint` compares natively when neither string has a surrogate: the
 *   two orders agree on every string without one, and the comparator still
 *   gives code-point order where they differ.
 * - `filterLinksByCategories` keeps each link's category, and `splitNodeId` its
 *   answer per id: both equal what they give from scratch.
 */
import { describe, expect, it } from "vitest";
import {
  buildMapParentIndex,
  classifyLinkDependencyCategory,
  cmpCodepoint,
  collapseModelSubgraphs,
  computeLinkBlastRadius,
  extractModelLinks,
  filterLinksByCategories,
  sanitizeMapModel,
  splitNodeId,
  TUX_MAP_WIRE_CATEGORIES,
  type TuxMapBlastIntent,
  type TuxMapLink,
  type TuxMapWireCategory,
} from "../app/utils/tuxArchitectureMap";
import { buildSyntheticMapModel, createSeededRandom } from "./support/mapSyntheticModels";

const g = buildSyntheticMapModel({ symbols: 2500, cardsPerView: 40 });
const model = collapseModelSubgraphs(sanitizeMapModel(g.model).model).model;
const parentOf = buildMapParentIndex(model);
const links = extractModelLinks(model, { parentOf });
const INTENTS: TuxMapBlastIntent[] = ["default", "patch", "refactor", "cut", "supply-chain"];

/** Seeds of every kind: the benchmark's symbol, a few spread over the link ends, a container and a host. */
function seeds(): string[] {
  const rnd = createSeededRandom(227);
  const ends = [...new Set(links.map((l) => l.to))].sort(cmpCodepoint);
  const out = [g.focus.symbolId, g.focus.fileId, g.focus.componentId, g.focus.containerId];
  for (let i = 0; i < 12; i++) out.push(ends[Math.floor(rnd.next() * ends.length)]!);
  if (model.level4.nodes[0]) out.push(model.level4.nodes[0].id);
  return out;
}

describe("the blast radius tables are kept per model (#227)", () => {
  it("gives what a call on fresh copies of the inputs gives", () => {
    for (const intent of INTENTS) {
      for (const seed of seeds()) {
        // twice on the same inputs, so the second call reads what the first kept
        computeLinkBlastRadius(links, seed, parentOf, { model, intent });
        const warm = computeLinkBlastRadius(links, seed, parentOf, { model, intent });
        const coldModel = structuredClone(model);
        const cold = computeLinkBlastRadius(structuredClone(links), seed, new Map(parentOf), {
          model: coldModel,
          intent,
        });
        expect(warm, `${intent} ${seed}`).toEqual(cold);
      }
    }
  }, 30_000); // a full radius per intent and seed, twice; a shared runner needs more than the 5 s default

  it("keeps the tables of each model apart", () => {
    const o = buildSyntheticMapModel({ symbols: 500, cardsPerView: 12, seed: 9 });
    const other = collapseModelSubgraphs(sanitizeMapModel(o.model).model).model;
    const otherParents = buildMapParentIndex(other);
    const otherLinks = extractModelLinks(other, { parentOf: otherParents });
    const host = (m: typeof model) => m.level4.nodes[0]!.id;
    for (let round = 0; round < 2; round++) {
      for (const [m, p, l] of [
        [model, parentOf, links],
        [other, otherParents, otherLinks],
      ] as const) {
        for (const seed of [host(m), m.level2.elements[0]!.id]) {
          const warm = computeLinkBlastRadius(l, seed, p, { model: m, intent: "cut" });
          const cold = computeLinkBlastRadius(structuredClone(l), seed, new Map(p), { model: structuredClone(m), intent: "cut" });
          expect(warm, `${round} ${seed}`).toEqual(cold);
        }
      }
    }
  });

  it("reads a model changed in place again when asked to verify the inputs", () => {
    const m = structuredClone(model);
    const host = m.level4.nodes[0]!;
    const before = computeLinkBlastRadius(links, host.id, parentOf, { model: m });
    // the host no longer hosts anything: its radius is its own
    host.hosts = [];
    for (const e of m.level2.elements) if ("deployed" in e) e.deployed = [];
    const stale = computeLinkBlastRadius(links, host.id, parentOf, { model: m });
    const verified = computeLinkBlastRadius(links, host.id, parentOf, { model: m, verifyInputs: true });
    const fresh = computeLinkBlastRadius(links, host.id, parentOf, { model: structuredClone(m) });
    expect(fresh).not.toEqual(before);
    expect(stale).toEqual(before);
    expect(verified).toEqual(fresh);
    // and the verified tables are the ones kept from then on
    expect(computeLinkBlastRadius(links, host.id, parentOf, { model: m })).toEqual(fresh);
  });

  it("reads a model again when one of its level or subgraph records is replaced", () => {
    const m = structuredClone(model);
    const hostId = m.level4.nodes[0]!.id;
    const before = computeLinkBlastRadius(links, hostId, parentOf, { model: m });
    m.level4 = { ...m.level4, nodes: m.level4.nodes.map((n) => (n.id === hostId ? { ...n, hosts: [] } : n)) };
    m.level2 = { ...m.level2, elements: m.level2.elements.map((e) => ({ ...e, deployed: [] })) };
    const after = computeLinkBlastRadius(links, hostId, parentOf, { model: m });
    expect(after).not.toEqual(before);
    expect(after).toEqual(computeLinkBlastRadius(links, hostId, parentOf, { model: structuredClone(m) }));
  });
});

/** Code-point order as `cmpCodepoint` defines it (a lone surrogate is its own code point), by sign. */
function codepointSign(a: string, b: string): number {
  let ia = 0;
  let ib = 0;
  while (ia < a.length && ib < b.length) {
    const ca = a.codePointAt(ia)!;
    const cb = b.codePointAt(ib)!;
    if (ca !== cb) return Math.sign(ca - cb);
    ia += ca > 0xffff ? 2 : 1;
    ib += cb > 0xffff ? 2 : 1;
  }
  return Math.sign(a.length - b.length);
}

const nativeSign = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

function randomStrings(n: number, alphabet: string[], seed: number): string[] {
  const rnd = createSeededRandom(seed);
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    let s = "";
    const len = 1 + Math.floor(rnd.next() * 6);
    for (let j = 0; j < len; j++) s += alphabet[Math.floor(rnd.next() * alphabet.length)]!;
    out.push(s);
  }
  return out;
}

describe("cmpCodepoint compares natively without surrogates (#227)", () => {
  it("agrees with native order on every pair without a surrogate", () => {
    const bmp = ["a", "b", "/", ":", "#", "é", "一", "퟿", "", "", "�", "￿"];
    const corpus = [...parentOf.keys(), ...randomStrings(400, bmp, 1)];
    let pairs = 0;
    for (let i = 0; i < corpus.length; i += 7) {
      for (let j = 0; j < 400; j++) {
        const a = corpus[i]!;
        const b = corpus[(i * 31 + j * 17) % corpus.length]!;
        expect(Math.sign(cmpCodepoint(a, b)), `${a} ${b}`).toBe(nativeSign(a, b));
        expect(nativeSign(a, b)).toBe(codepointSign(a, b));
        pairs++;
      }
    }
    expect(pairs).toBeGreaterThan(100_000);
    const sorted = [...parentOf.keys()].sort(cmpCodepoint);
    expect(sorted).toEqual([...parentOf.keys()].sort());
  });

  it("keeps code-point order where native order differs: astral characters and lone surrogates", () => {
    const mixed = ["a", "", "￿", "�", "\u{1f600}", "\u{10000}", "\u{10ffff}", "\ud800", "\udc00", "z"];
    const corpus = randomStrings(600, mixed, 2);
    let differ = 0;
    for (const a of corpus) {
      for (let k = 0; k < 60; k++) {
        const b = corpus[(a.length * 97 + k * 13) % corpus.length]!;
        expect(Math.sign(cmpCodepoint(a, b)), JSON.stringify([a, b])).toBe(codepointSign(a, b));
        if (codepointSign(a, b) !== nativeSign(a, b)) differ++;
      }
    }
    expect(differ).toBeGreaterThan(0);
    expect(cmpCodepoint("\u{1f600}", "￿")).toBeGreaterThan(0);
    expect(nativeSign("\u{1f600}", "￿")).toBeLessThan(0);
    expect(cmpCodepoint("x", "x")).toBe(0);
  });
});

describe("filterLinksByCategories and splitNodeId keep what they computed (#227)", () => {
  it("filters as classifying every link from scratch does, on every call", () => {
    // links of one kind in every category, so a category is not a function of the kind
    const mixed: TuxMapLink[] = [
      ...links,
      { from: "f:src/a.test.ts", to: "f:src/a.ts", kind: "imports" },
      { from: "f:src/b.ts", to: "f:src/a.ts", kind: "imports" },
      { from: "f:docs/guide.md", to: "f:src/a.ts", kind: "imports" },
      { from: "f:.forgejo/workflows/ci.yml", to: "f:src/a.ts", kind: "imports" },
    ];
    expect(new Set(mixed.slice(-4).map(classifyLinkDependencyCategory)).size).toBe(4);
    const subsets: TuxMapWireCategory[][] = [[], ...TUX_MAP_WIRE_CATEGORIES.map((c) => [c]), ["prod", "tests"], ["ci", "docs"]];
    for (let round = 0; round < 2; round++) {
      for (const cats of subsets) {
        const set = new Set(cats);
        const want = mixed.filter((l: TuxMapLink) => set.has(classifyLinkDependencyCategory(l)));
        expect(filterLinksByCategories(mixed, cats), `${round} ${cats.join(",")}`).toEqual(want);
      }
    }
  });

  it("splits every id as it did, and keeps the answers from changing", () => {
    expect(splitNodeId("owner/repo:f:src/a.ts")).toEqual({ repo: "owner/repo", kind: "f", rest: "src/a.ts" });
    expect(splitNodeId("repo:s:a.ts#f")).toEqual({ repo: "repo", kind: "s", rest: "a.ts#f" });
    expect(splitNodeId("f:a.ts")).toEqual({ repo: "", kind: "f", rest: "a.ts" });
    expect(splitNodeId("p:pkg:vue")).toEqual({ repo: "", kind: "p", rest: "pkg:vue" });
    expect(splitNodeId("r:GET /x")).toEqual({ repo: "", kind: "r", rest: "GET /x" });
    expect(splitNodeId("plain")).toEqual({ repo: null, kind: null, rest: "plain" });
    expect(splitNodeId("")).toEqual({ repo: null, kind: null, rest: "" });
    expect(splitNodeId("owner/repo:d:pkg@1")).toBe(splitNodeId("owner/repo:d:pkg@1"));
    // more ids than the memo holds: the earlier ones are still split right
    for (let i = 0; i < 70_000; i++) splitNodeId(`f:gen/${i}.ts`);
    expect(splitNodeId("owner/repo:d:pkg@1")).toEqual({ repo: "owner/repo", kind: "d", rest: "pkg@1" });
    expect(splitNodeId("f:gen/3.ts")).toEqual({ repo: "", kind: "f", rest: "gen/3.ts" });
  });
});
