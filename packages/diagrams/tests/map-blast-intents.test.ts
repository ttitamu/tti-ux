/**
 * The blast intents' definitions (`TUX_MAP_BLAST_INTENTS`, `tti/tti-ux#259`) against the walk that
 * applies them: one definition per `TuxMapBlastIntent`, every link class in exactly one of `follows`,
 * `stops` and `skips`, and `classifyBlastLink` doing what each one says.
 */
import { describe, expect, it } from "vitest";
import {
  TUX_MAP_BLAST_INTENTS,
  TUX_MAP_BLAST_LINK_CLASS_LABELS,
  TUX_MAP_VALID_BLAST_INTENTS,
  buildMapParentIndex,
  classifyBlastLink,
  computeLinkBlastRadius,
  extractModelLinks,
  inferLinkCoupling,
  type TuxMapBlastIntent,
  type TuxMapBlastLinkClass,
  type TuxMapLink,
} from "../app/utils/tuxArchitectureMap";
import { DEFAULT_TTI_LEVEL_MODEL } from "../app/utils/tuxArchitectureMapSample";

/** One link of each class, none marked `stop`: the class is what the walk reads from it. */
const LINK_OF_CLASS: Record<TuxMapBlastLinkClass, TuxMapLink> = {
  contract: { from: "a", to: "b", kind: "routes" },
  runtime: { from: "a", to: "b", kind: "calls" },
  "type-only": { from: "a", to: "b", kind: "imports", coupling: "type-only" },
  "artifact-stamp": { from: "a", to: "b", kind: "stamps" },
  "build-exec": { from: "a", to: "b", kind: "generates", coupling: "build-exec" },
  verification: { from: "a", to: "b", kind: "tests" },
  prose: { from: "a", to: "b", kind: "mentions" },
  "page-link": { from: "a", to: "b", kind: "links" },
};
const CLASSES = Object.keys(TUX_MAP_BLAST_LINK_CLASS_LABELS) as TuxMapBlastLinkClass[];
const EVERY_INTENT: TuxMapBlastIntent[] = ["default", "patch", "refactor", "cut", "supply-chain"];

describe("the blast intents' definitions (tti/tti-ux#259)", () => {
  it("define every intent once, in picker order, with a label and a description", () => {
    expect(TUX_MAP_BLAST_INTENTS.map((d) => d.id)).toEqual(EVERY_INTENT);
    expect([...TUX_MAP_VALID_BLAST_INTENTS]).toEqual(EVERY_INTENT);
    for (const d of TUX_MAP_BLAST_INTENTS) {
      expect(d.label.length, d.id).toBeGreaterThan(2);
      expect(d.description.length, d.id).toBeGreaterThan(20);
    }
  });

  it("put every link class in exactly one of follows, stops and skips", () => {
    expect(Object.keys(LINK_OF_CLASS).sort()).toEqual([...CLASSES].sort());
    for (const d of TUX_MAP_BLAST_INTENTS) {
      expect([...d.follows, ...d.stops, ...d.skips].sort(), d.id).toEqual([...CLASSES].sort());
    }
  });

  it("the sample links stand for their class", () => {
    for (const c of CLASSES) {
      if (c !== "page-link") expect(inferLinkCoupling(LINK_OF_CLASS[c]), c).toBe(c);
    }
  });

  it("say what classifyBlastLink does with each class, one step from the change", () => {
    for (const d of TUX_MAP_BLAST_INTENTS) {
      for (const c of CLASSES) {
        const want = d.follows.includes(c) ? "spread" : d.stops.includes(c) ? "stop" : "skip";
        expect(classifyBlastLink(LINK_OF_CLASS[c], 0, d.id), `${d.id} / ${c}`).toBe(want);
      }
    }
  });

  it("light a doc that mentions it one step from the change only, under every intent", () => {
    for (const d of TUX_MAP_BLAST_INTENTS) {
      expect(classifyBlastLink(LINK_OF_CLASS.prose, 1, d.id), d.id).toBe("skip");
    }
  });

  it("General walks no further than a link marked stop", () => {
    for (const c of CLASSES) {
      expect(classifyBlastLink({ ...LINK_OF_CLASS[c], stop: true }, 0, "default"), c).not.toBe("spread");
    }
  });

  it("light a different set for each walk on the docs sample's Background Workers, and Cut the cards Refactor does", () => {
    const M = DEFAULT_TTI_LEVEL_MODEL;
    const parentOf = buildMapParentIndex(M);
    const links = extractModelLinks(M, { bridgeUncoveredPairs: true, parentOf });
    const lit = (intent: TuxMapBlastIntent) =>
      [...computeLinkBlastRadius(links, "c-workers", parentOf, { model: M, intent }).hits.keys()].sort();
    expect(lit("patch")).toEqual(["c-web"]);
    expect(lit("supply-chain")).toEqual(["c-scheduler", "c-web"]);
    expect(lit("refactor")).toEqual(["c-observability", "c-scheduler", "c-web"]);
    expect(lit("cut")).toEqual(lit("refactor"));
    // General walks on past the Web Portal's build stamp to everything that reaches the portal
    expect(lit("default")).toEqual(expect.arrayContaining(["c-observability", "c-scheduler", "c-web", "c-edge", "p-users"]));
    expect(lit("default").length).toBeGreaterThan(lit("refactor").length);
  });
});
