/**
 * Where a raised wire label goes so that it is not over the card the pointer is on (#205).
 */
import { describe, expect, it } from "vitest";
import { placeLabelClearOfCard } from "../app/utils/internal/tuxArchitectureMapStage";

type Box = { x: number; y: number; w: number; h: number };

const card: Box = { x: 400, y: 200, w: 212, h: 128 };
const stage = { width: 1400, height: 900 };

/** The box a placement draws, for a label of the estimated size. */
function drawn(label: Box, at: { left: number; top: number; shift: string }): Box {
  const m = /translate\((-?\d+)%, (-?\d+)%\)/.exec(at.shift)!;
  return { x: at.left + (Number(m[1]) / 100) * label.w, y: at.top + (Number(m[2]) / 100) * label.h, w: label.w, h: label.h };
}
const overlaps = (a: Box, b: Box) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

describe("placeLabelClearOfCard (#205)", () => {
  it("leaves a label alone that is clear of the card", () => {
    expect(placeLabelClearOfCard({ x: 640, y: 250, w: 120, h: 19 }, card, stage)).toBeNull();
    expect(placeLabelClearOfCard({ x: 420, y: 150, w: 120, h: 32 }, card, stage)).toBeNull();
  });

  it("counts a label within the gap as touching, and moves it out to the gap", () => {
    // 3 px right of the card: closer than the 8 px gap
    const at = placeLabelClearOfCard({ x: 615, y: 250, w: 120, h: 19 }, card, stage)!;
    expect(at).toEqual({ left: 620, top: 259.5, shift: "translate(0%, -50%)" });
  });

  it("moves a long label on a wire that leaves the card's right side to the right of the card", () => {
    // centred in the 60 px gap right of the card, 300 px wide, at mid height: 120 px of it over the
    // card. Down is the shorter way off (88 px against 128), and would take it off its wire.
    const label = { x: 492, y: 248, w: 300, h: 32 };
    const at = placeLabelClearOfCard(label, card, stage)!;
    expect(at).toEqual({ left: card.x + card.w + 8, top: 264, shift: "translate(0%, -50%)" });
    expect(overlaps(drawn(label, at), card)).toBe(false);
  });

  it("moves a label that lies over the card's + off the card", () => {
    const badge: Box = { x: card.x + card.w - 28, y: card.y + 6, w: 22, h: 22 };
    const label = { x: 492, y: 204, w: 300, h: 32 };
    expect(overlaps(label, badge)).toBe(true);
    const box = drawn(label, placeLabelClearOfCard(label, card, stage)!);
    expect(overlaps(box, card)).toBe(false);
    expect(overlaps(box, badge)).toBe(false);
  });

  it("moves to the side its middle is on, and the shortest way when its middle is over the card", () => {
    const cases: [Box, string][] = [
      [{ x: 380, y: 250, w: 60, h: 19 }, "translate(-100%, -50%)"],
      [{ x: 590, y: 250, w: 60, h: 19 }, "translate(0%, -50%)"],
      [{ x: 470, y: 190, w: 60, h: 19 }, "translate(-50%, -100%)"],
      [{ x: 470, y: 320, w: 60, h: 19 }, "translate(-50%, 0%)"],
    ];
    for (const [label, shift] of cases) {
      const at = placeLabelClearOfCard(label, card, stage)!;
      expect(at.shift, JSON.stringify(label)).toBe(shift);
      expect(overlaps(drawn(label, at), card), JSON.stringify(label)).toBe(false);
    }
  });

  it("hangs the label by the edge that faces the card, so a wider drawn text still clears it", () => {
    const label = { x: 380, y: 250, w: 60, h: 19 };
    const at = placeLabelClearOfCard(label, card, stage)!;
    // drawn 40 px wider than estimated: its right edge stays 8 px left of the card
    const wide = drawn({ ...label, w: 100 }, at);
    expect(wide.x + wide.w).toBe(card.x - 8);
  });

  it("stays on the stage where another way off the card does", () => {
    const edgeCard: Box = { x: 24, y: 200, w: 212, h: 128 };
    // nearest way off is to the left, which would leave the stage
    const label = { x: 10, y: 250, w: 60, h: 19 };
    const at = placeLabelClearOfCard(label, edgeCard, stage)!;
    const box = drawn(label, at);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(overlaps(box, edgeCard)).toBe(false);
  });

  it("returns null for a box with no usable position", () => {
    expect(placeLabelClearOfCard({ x: Number.NaN, y: 250, w: 60, h: 19 }, card, stage)).toBeNull();
    expect(placeLabelClearOfCard({ x: 420, y: 250, w: 60, h: 19 }, { ...card, x: Number.NaN }, stage)).toBeNull();
  });
});
