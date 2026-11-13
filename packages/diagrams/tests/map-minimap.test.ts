/**
 * The geometry of the architecture map's overview (#211): the stage's rectangles drawn small,
 * the rectangle of the part in view, and where a point on the overview sends the view.
 * All of it is arithmetic on the stage data and on the viewport's scroll position and size.
 */
import { describe, expect, it } from "vitest";
import {
  MINIMAP_MAX,
  MINIMAP_MIN_CARD,
  MINIMAP_SLACK,
  minimapBox,
  minimapOverflows,
  minimapScale,
  minimapScrollTarget,
  minimapViewBox,
} from "../app/utils/internal/tuxArchitectureMapMinimap";

const stage = { width: 1680, height: 840 };

describe("architecture map overview: geometry (#211)", () => {
  it("scales the stage to fit the overview's box, keeping its shape", () => {
    // 1680 × 840 in 168 × 112: the width decides
    expect(minimapScale(stage)).toBeCloseTo(0.1, 6);
    // a tall stage: the height decides
    expect(minimapScale({ width: 400, height: 2240 })).toBeCloseTo(MINIMAP_MAX.height / 2240, 6);
    // a caller's own box
    expect(minimapScale(stage, { width: 84, height: 84 })).toBeCloseTo(0.05, 6);
    // a stage with no size draws nothing, and divides nothing by zero
    expect(minimapScale({ width: 0, height: 0 })).toBe(0);
    expect(minimapScale({ width: 100, height: 0 })).toBe(0);
  });

  it("puts a card's rectangle in its place, and keeps a small one visible", () => {
    expect(minimapBox({ x: 400, y: 200, w: 210, h: 130 }, 0.1)).toEqual({ x: 40, y: 20, w: 21, h: 13 });
    const tiny = minimapBox({ x: 100, y: 100, w: 8, h: 4 }, 0.1);
    expect(tiny.x).toBe(10);
    expect(tiny.w).toBe(MINIMAP_MIN_CARD);
    expect(tiny.h).toBe(MINIMAP_MIN_CARD);
  });

  it("says a level overflows only when there is something to scroll to", () => {
    // fitted: the stage at 0.5 is 840 × 420 in an 842 × 440 viewport
    expect(minimapOverflows(stage, 0.5, { left: 0, top: 0, width: 842, height: 440 })).toBe(false);
    // the viewport's border and a rounded-up height leave a pixel or two: still nothing to scroll to
    expect(minimapOverflows(stage, 0.5, { left: 0, top: 0, width: 840, height: 420 - MINIMAP_SLACK })).toBe(false);
    // magnified: wider than the viewport
    expect(minimapOverflows(stage, 1, { left: 0, top: 0, width: 842, height: 840 })).toBe(true);
    // a fixed height shorter than the fitted diagram
    expect(minimapOverflows(stage, 0.5, { left: 0, top: 0, width: 842, height: 300 })).toBe(true);
    // a viewport that has not been measured overflows nothing
    expect(minimapOverflows(stage, 1, { left: 0, top: 0, width: 0, height: 0 })).toBe(false);
  });

  it("draws the part in view from the scroll position, the viewport's size and the scale", () => {
    const k = minimapScale(stage); // 0.1
    // at 150% a 600 × 300 viewport shows 400 × 200 of the stage
    expect(minimapViewBox(stage, 1.5, 0, { left: 0, top: 0, width: 600, height: 300 }, k)).toEqual({
      x: 0,
      y: 0,
      w: 40,
      h: 20,
    });
    expect(minimapViewBox(stage, 1.5, 0, { left: 300, top: 150, width: 600, height: 300 }, k)).toEqual({
      x: 20,
      y: 10,
      w: 40,
      h: 20,
    });
    // a stage slid 90px to the left (panX) shows the part 90px further right
    expect(minimapViewBox(stage, 0.5, -90, { left: 0, top: 0, width: 600, height: 300 }, k)).toEqual({
      x: 18,
      y: 0,
      w: 120,
      h: 60,
    });
  });

  it("keeps the part in view inside the overview", () => {
    const k = minimapScale(stage);
    // a viewport larger than what is left of the stage: the rectangle ends at the stage's edge
    const end = minimapViewBox(stage, 1, 0, { left: 1400, top: 700, width: 600, height: 300 }, k);
    expect(end.x).toBeCloseTo(140, 6);
    expect(end.y).toBeCloseTo(70, 6);
    expect(end.x + end.w).toBeCloseTo(168, 6);
    expect(end.y + end.h).toBeCloseTo(84, 6);
    // scrolled past the start (an elastic overscroll): it starts at the stage's edge
    const start = minimapViewBox(stage, 1, 0, { left: -50, top: -30, width: 600, height: 300 }, k);
    expect(start.x).toBe(0);
    expect(start.y).toBe(0);
    expect(start.w).toBeCloseTo(55, 6);
    expect(start.h).toBeCloseTo(27, 6);
  });

  it("centres the viewport on a point of the overview", () => {
    const k = minimapScale(stage);
    const view = { left: 0, top: 0, width: 600, height: 300 };
    // the overview's centre (84, 42) is the stage's centre (840, 420): at 150% that is 1260, 630
    expect(minimapScrollTarget({ x: 84, y: 42 }, stage, 1.5, 0, view, k)).toEqual({ left: 960, top: 480 });
    // and the part in view is then centred on that point
    const box = minimapViewBox(stage, 1.5, 0, { ...view, left: 960, top: 480 }, k);
    expect(box.x + box.w / 2).toBeCloseTo(84, 6);
    expect(box.y + box.h / 2).toBeCloseTo(42, 6);
    // where the view is does not matter, only where the point is
    expect(minimapScrollTarget({ x: 84, y: 42 }, stage, 1.5, 0, { ...view, left: 700, top: 20 }, k)).toEqual({
      left: 960,
      top: 480,
    });
  });

  it("clamps the scroll target to what the viewport can scroll to", () => {
    const k = minimapScale(stage);
    const view = { left: 500, top: 200, width: 600, height: 300 };
    // a corner: the view cannot centre on it
    expect(minimapScrollTarget({ x: 0, y: 0 }, stage, 1.5, 0, view, k)).toEqual({ left: 0, top: 0 });
    // the far corner: 1680 × 1.5 − 600 and 840 × 1.5 − 300
    expect(minimapScrollTarget({ x: 168, y: 84 }, stage, 1.5, 0, view, k)).toEqual({ left: 1920, top: 960 });
    // a drag that leaves the overview is held at its edge
    expect(minimapScrollTarget({ x: 900, y: -40 }, stage, 1.5, 0, view, k)).toEqual({ left: 1920, top: 0 });
    // an axis with nothing to scroll stays at 0
    expect(minimapScrollTarget({ x: 84, y: 42 }, stage, 1.5, 0, { ...view, height: 2000 }, k)).toEqual({
      left: 960,
      top: 0,
    });
    // no scale, no target: the view stays where it is
    expect(minimapScrollTarget({ x: 84, y: 42 }, stage, 1.5, 0, view, 0)).toEqual({ left: 500, top: 200 });
  });
});
