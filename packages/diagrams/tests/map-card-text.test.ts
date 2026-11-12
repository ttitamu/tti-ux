/**
 * What a card's text needs, and what the stage gives it (#205): the lines of a title, the height of
 * an outside card, the lines of a description an inner card has room for.
 *
 * The numbers are the stylesheet's rows. They were checked in a browser against the cards as drawn:
 * no card of the sample model or of the producer fixture has a row cut by its bottom edge.
 */
import { describe, expect, it } from "vitest";
import {
  GRID_METRICS,
  sanitizeMapModel,
  type TuxMapLevelElement,
  type TuxMapWireCategory,
} from "../app/utils/tuxArchitectureMap";
import { DEFAULT_TTI_LEVEL_MODEL } from "../app/utils/tuxArchitectureMapSample";
import {
  buildStageBase,
  buildStageData,
  cardDescriptionLines,
  cardTitleLines,
  estimateCardTitleWidth,
  outsideCardHeight,
} from "../app/utils/internal/tuxArchitectureMapStage";
import { STAGE_TOGGLES, stageContext } from "./support/mapStages";

describe("estimateCardTitleWidth (#205)", () => {
  // widths a browser measured for the title face at 13px, in px
  const measured: [string, number][] = [
    ["Package & image registries", 172.5],
    ["Edge Reverse Proxy", 125.9],
  ];

  it("is within 6% of the drawn width, and never under it", () => {
    for (const [text, px] of measured) {
      const est = estimateCardTitleWidth(text, 13);
      expect(est, text).toBeGreaterThanOrEqual(px);
      expect(est, text).toBeLessThan(px * 1.06);
    }
  });

  it("scales with the font size and counts a character it has no width for as a wide one", () => {
    expect(estimateCardTitleWidth("abc", 14)).toBeCloseTo((estimateCardTitleWidth("abc", 13) * 14) / 13, 6);
    expect(estimateCardTitleWidth("…", 13)).toBeGreaterThan(estimateCardTitleWidth("m", 13) * 0.95);
    expect(estimateCardTitleWidth("", 13)).toBe(0);
  });
});

describe("cardTitleLines (#205)", () => {
  it("gives one line to a title that fits and two to one that does not", () => {
    expect(cardTitleLines("Job Queue Producer", false)).toBe(1);
    expect(cardTitleLines("Webhook & Event Dispatcher", false)).toBe(2);
    // drawn 164.9px wide in a 165.2px line: within the margin, so it is given the second line
    expect(cardTitleLines("REST & GraphQL Router", false)).toBe(2);
  });

  it("measures against the narrower width when the card has a `+`", () => {
    expect(cardTitleLines("Auth & RBAC Guard", true)).toBe(1);
    expect(cardTitleLines("Job Queue Producer", true)).toBe(2);
  });
});

describe("outsideCardHeight (#205)", () => {
  it("holds a one-line title, the type and the chips: 60px did not", () => {
    expect(outsideCardHeight("Web Portal")).toBe(70);
    expect(outsideCardHeight("Web Portal")).toBeGreaterThan(GRID_METRICS.MH);
  });

  it("grows by a row for a two-line title and by a row for the owner line", () => {
    const one = outsideCardHeight("Web Portal");
    const two = outsideCardHeight("Package & image registries");
    const owned = outsideCardHeight("Web Portal", { owner: true });
    expect(two - one).toBeGreaterThanOrEqual(14);
    expect(owned - one).toBeGreaterThanOrEqual(14);
    const both = outsideCardHeight("Package & image registries", { owner: true });
    expect(Math.abs(both - (two + owned - one))).toBeLessThanOrEqual(1);
  });

  it("is shorter without a type row", () => {
    expect(outsideCardHeight("Web Portal", { type: false })).toBeLessThan(outsideCardHeight("Web Portal"));
  });
});

describe("cardDescriptionLines (#205)", () => {
  const full = { type: true, runsOn: true, footer: true };

  it("has room for two lines beside a one-line title and every other row", () => {
    expect(cardDescriptionLines(GRID_METRICS.CH, { titleLines: 1, ...full })).toBe(2);
  });

  it("has room for one whole line beside a two-line title and every other row, not for a line and a half", () => {
    expect(cardDescriptionLines(GRID_METRICS.CH, { titleLines: 2, ...full })).toBe(1);
  });

  it("never asks for more than two lines, or fewer than none", () => {
    expect(cardDescriptionLines(400, { titleLines: 1, type: false, runsOn: false, footer: false })).toBe(2);
    expect(cardDescriptionLines(40, { titleLines: 2, ...full })).toBe(0);
  });
});

describe("the outside stacks of a view (#205)", () => {
  const model = sanitizeMapModel(DEFAULT_TTI_LEVEL_MODEL).model;
  const ctx = stageContext(model);
  // as the component does: a Level 2 reference carries the fields of the Level 1 element it names
  for (const e of model.level2.elements) {
    if (!e.ref) continue;
    const named = model.level1.elements.find((x) => x.id === e.id);
    ctx.lookup[e.id] = { ...named, ...e, name: e.name ?? named?.name ?? e.id } as TuxMapLevelElement;
  }
  const stage = buildStageData(buildStageBase(ctx, 3, "c-api", null), {
    ...STAGE_TOGGLES,
    wireCategories: new Set<TuxMapWireCategory>(["prod"]),
  });

  it("gives every outside card the height its rows need", () => {
    const minis = stage.els.filter((e) => e.mini);
    expect(minis.length).toBeGreaterThan(3);
    for (const e of minis) {
      const shown = stage.displayNameById[e.id] || e.name;
      expect(stage.rects[e.id]!.h, e.name).toBeGreaterThanOrEqual(
        outsideCardHeight(shown, { owner: Boolean(stage.outsideMetaById[e.id]?.ownerLabel) }),
      );
    }
  });

  it("stacks them 14px apart, none over the next, inside the stage", () => {
    for (const side of ["in", "out"] as const) {
      const rects = stage.els
        .filter((e) => e.mini && stage.rects[e.id]!.side === side)
        .map((e) => stage.rects[e.id]!)
        .sort((a, b) => a.y - b.y);
      expect(rects.length).toBeGreaterThan(1);
      for (let i = 1; i < rects.length; i++) {
        const gap = rects[i]!.y - (rects[i - 1]!.y + rects[i - 1]!.h);
        expect(gap).toBeGreaterThanOrEqual(13);
        expect(gap).toBeLessThanOrEqual(15);
      }
      expect(rects.at(-1)!.y + rects.at(-1)!.h).toBeLessThanOrEqual(stage.height);
    }
  });
});
