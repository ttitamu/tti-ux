/**
 * The camera's travel (#212): the duration rule, the curve, the path a move
 * follows, where a zoom starts from, and what ending a travel early does.
 * Pure functions: the mounted behaviour is in `tests/tux-architecture-map-travel.nuxt.test.ts`.
 */
import { describe, expect, it } from "vitest";
import {
  TRAVEL_BASE_MS,
  TRAVEL_EASING,
  TRAVEL_MAX_MS,
  TRAVEL_MS_PER_PX,
  cameraAlong,
  clearOffset,
  flipStart,
  pointAlong,
  startTravel,
  travelDuration,
  travelEase,
  wirePolyline,
  type TravelPoint,
} from "../app/utils/internal/tuxArchitectureMapTravel";
import { roundOrthogonalCorners } from "../app/utils/tuxArchitectureMap";

describe("travel duration (#212)", () => {
  it("is 180ms plus 0.25ms a pixel", () => {
    expect([TRAVEL_BASE_MS, TRAVEL_MS_PER_PX, TRAVEL_MAX_MS]).toEqual([180, 0.25, 600]);
    expect(travelDuration(1)).toBe(180);
    expect(travelDuration(100)).toBe(205);
    expect(travelDuration(400)).toBe(280);
    expect(travelDuration(1000)).toBe(430);
  });

  it("grows with the distance and never passes 600ms", () => {
    let prev = 0;
    for (let px = 1; px <= 6000; px += 37) {
      const ms = travelDuration(px);
      expect(ms).toBeGreaterThanOrEqual(prev);
      expect(ms).toBeLessThanOrEqual(600);
      prev = ms;
    }
    expect(travelDuration(1680)).toBe(600);
    expect(travelDuration(1e6)).toBe(600);
  });

  it("is no travel for less than half a pixel, and for a distance that is not a number", () => {
    expect(travelDuration(0)).toBe(0);
    expect(travelDuration(0.4)).toBe(0);
    expect(travelDuration(-20)).toBe(0);
    expect(travelDuration(Number.NaN)).toBe(0);
  });
});

describe("the one curve (#212)", () => {
  it("is a cubic ease-out: fast first, 0 at the start and exactly 1 at the end", () => {
    expect(travelEase(0)).toBe(0);
    expect(travelEase(1)).toBe(1);
    expect(travelEase(1.7)).toBe(1);
    expect(travelEase(-1)).toBe(0);
    expect(travelEase(0.5)).toBeCloseTo(0.875, 10);
    let prev = 0;
    for (let t = 0.01; t <= 1; t += 0.01) {
      const u = travelEase(t);
      expect(u).toBeGreaterThan(prev);
      prev = u;
    }
  });

  // 1 - (1 - t)^3 is a cubic, so a bezier whose x runs evenly (1/3, 2/3) draws it exactly
  it("is the same curve in CSS: the bezier is the function, to a tenth of a percent", () => {
    const [x1, y1, x2, y2] = TRAVEL_EASING.match(/[\d.]+/g)!.map(Number) as [number, number, number, number];
    const bez = (a: number, b: number, s: number) => 3 * a * s * (1 - s) ** 2 + 3 * b * s * s * (1 - s) + s ** 3;
    for (let s = 0; s <= 1; s += 0.02) {
      expect(Math.abs(bez(y1, y2, s) - travelEase(bez(x1, x2, s)))).toBeLessThan(0.001);
    }
  });
});

describe("the path of a move (#212)", () => {
  const corners: [number, number][] = [
    [100, 40],
    [220, 40],
    [220, 300],
    [480, 300],
  ];
  const wire = wirePolyline(roundOrthogonalCorners(corners));

  /** How far along the polyline `p` is, for a point that is on it. */
  function lengthTo(pts: TravelPoint[], p: TravelPoint): number {
    let run = 0;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1]!;
      const b = pts[i]!;
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const t = len ? ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / len ** 2 : 0;
      const off = Math.hypot(a[0] + (b[0] - a[0]) * t - p[0], a[1] + (b[1] - a[1]) * t - p[1]);
      if (off < 1e-6 && t >= -1e-9 && t <= 1 + 1e-9) return run + t * len;
      run += len;
    }
    return Number.NaN;
  }

  it("reads a routed wire's corners from its path, the first and the last as routed", () => {
    expect(wire[0]).toEqual([100, 40]);
    expect(wire[wire.length - 1]).toEqual([480, 300]);
    expect(wire).toContainEqual([220, 40]);
    expect(wire).toContainEqual([220, 300]);
    expect(wirePolyline("")).toEqual([]);
    expect(wirePolyline("M-4.5,10 L20,-3")).toEqual([
      [-4.5, 10],
      [20, -3],
    ]);
  });

  it("moves along the polyline by length: every sample is on it and further along than the last", () => {
    let prev = -1;
    for (let i = 0; i <= 200; i++) {
      const at = lengthTo(corners, pointAlong(corners, i / 200));
      expect(Number.isNaN(at)).toBe(false);
      expect(at).toBeGreaterThan(prev);
      prev = at;
    }
    expect(prev).toBeCloseTo(120 + 260 + 260, 6);
    expect(pointAlong(corners, 0.5)).toEqual([220, 240]);
  });

  it("starts at the first point and ends on the last point itself", () => {
    expect(pointAlong(corners, 0)).toEqual([100, 40]);
    expect(pointAlong(corners, 1)).toBe(corners[3]);
    expect(pointAlong(corners, 3)).toBe(corners[3]);
    expect(pointAlong(corners, -1)).toEqual([100, 40]);
    expect(pointAlong([[5, 5]], 0.3)).toEqual([5, 5]);
    expect(pointAlong([], 0.3)).toEqual([0, 0]);
    // a doubled point is a segment of no length, not a division by zero
    expect(pointAlong([[0, 0], [0, 0], [10, 0]], 0.5)).toEqual([5, 0]);
  });

  it("takes the view from where it is to its target exactly, whatever the path", () => {
    const from: TravelPoint = [0.1, 0.7];
    const to: TravelPoint = [0.3, 911.3];
    expect(cameraAlong(from, to, wire, 1.5, 0)).toEqual(from);
    expect(cameraAlong(from, to, wire, 1.5, 1)).toBe(to);
    expect(cameraAlong(from, to, wire, 1.5, 1.2)).toBe(to);
    const half = cameraAlong(from, to, [], 1, 0.5);
    expect(half[0]).toBeCloseTo(0.2, 10);
    expect(half[1]).toBeCloseTo(456, 10);
  });

  it("follows the wire where the move is as long as the wire, and a straight line where there is none", () => {
    // the view moves by the wire's own chord at this scale: it is on the wire throughout
    const scale = 2;
    const from: TravelPoint = [300, 500];
    const to: TravelPoint = [300 + 380 * scale, 500 + 260 * scale];
    for (let i = 0; i <= 50; i++) {
      const [x, y] = cameraAlong(from, to, corners, scale, i / 50);
      const onWire = lengthTo(corners, [100 + (x - 300) / scale, 40 + (y - 500) / scale]);
      expect(onWire).toBeCloseTo((i / 50) * 640, 6);
    }
    const mid = cameraAlong(from, to, [corners[0]!, corners[3]!], scale, 0.5);
    expect(mid).toEqual([300 + 190 * scale, 500 + 130 * scale]);
  });

  it("does not swing wider than the move is long", () => {
    // 40px of scroll along a wire whose chord is 460px: the bend is scaled down with it
    const from: TravelPoint = [0, 0];
    const to: TravelPoint = [40, 0];
    let widest = 0;
    for (let i = 0; i <= 50; i++) {
      const [x, y] = cameraAlong(from, to, corners, 1, i / 50);
      widest = Math.max(widest, Math.hypot(x - 40 * (i / 50), y));
    }
    expect(widest).toBeGreaterThan(0);
    expect(widest).toBeLessThan(40);
  });
});

describe("keeping a card clear, and no further (#212)", () => {
  it("leaves the view where it is for a card that is inside the window", () => {
    expect(clearOffset(100, 150, 300, 600, 24)).toBe(100);
  });

  it("brings a card past the far edge in by what it is over, and one before the start back to 12", () => {
    expect(clearOffset(0, 500, 700, 600, 24)).toBe(124);
    expect(clearOffset(400, 200, 380, 600, 24)).toBe(188);
    expect(clearOffset(50, 0, 30, 600, 24)).toBe(0);
  });

  it("lets the start win for a card wider than the window", () => {
    expect(clearOffset(0, 300, 1200, 600, 24)).toBe(288);
  });
});

describe("where a zoom starts (#212)", () => {
  const frame = { x: 24, y: 24, w: 1200, h: 600 };
  const card = { x: 400, y: 200, w: 240, h: 96 };

  it("places the level's frame inside the card it grows out of: centred, touching on the tighter axis", () => {
    const s = flipStart(frame, card, 0, 0.9);
    expect(s.k).toBeCloseTo(96 / 600, 4);
    const left = s.x + frame.x * s.k;
    const top = s.y + frame.y * s.k;
    expect(top).toBeCloseTo(card.y, 1);
    expect(frame.h * s.k).toBeCloseTo(card.h, 1);
    expect(left + (frame.w * s.k) / 2).toBeCloseTo(card.x + card.w / 2, 1);
    expect(left).toBeGreaterThanOrEqual(card.x);
    expect(frame.w * s.k).toBeLessThanOrEqual(card.w);
  });

  it("places the card inside the frame it shrinks back from, on the way out", () => {
    const s = flipStart(card, frame, 0, 0.9);
    expect(s.k).toBeCloseTo(5, 4);
    expect(s.x + (card.x + card.w / 2) * s.k).toBeCloseTo(frame.x + frame.w / 2, 1);
    expect(s.y + (card.y + card.h / 2) * s.k).toBeCloseTo(frame.y + frame.h / 2, 1);
  });

  it("measures the travel by the corner that goes furthest, and is no travel from where it ends", () => {
    const onScreen = { x: 30 + frame.x * 0.9, y: frame.y * 0.9, w: frame.w * 0.9, h: frame.h * 0.9 };
    const still = flipStart(frame, onScreen, 30, 0.9);
    expect(still.px).toBeLessThan(0.01);
    expect(travelDuration(still.px)).toBe(0);
    const s = flipStart(frame, card, 0, 0.9);
    // the frame's bottom-right corner: from the card's to (24 + 1200, 24 + 600) × 0.9
    expect(s.px).toBeCloseTo(Math.hypot(1224 * 0.9 - (520 + 96), 624 * 0.9 - 296), 0);
  });
});

describe("ending a travel (#212)", () => {
  function clock() {
    let t = 0;
    let next = 1;
    const queue = new Map<number, () => void>();
    return {
      seen: [] as number[],
      cancelled: [] as number[],
      raf: (cb: () => void) => (queue.set(next, cb), next++),
      caf(id: number) {
        this.cancelled.push(id);
        queue.delete(id);
      },
      now: () => t,
      /** Advance the clock and run the frame that was asked for. */
      frame(ms: number) {
        t += ms;
        const [id, cb] = [...queue][0] ?? [];
        if (id === undefined) return false;
        queue.delete(id);
        cb!();
        return true;
      },
      pending: () => queue.size,
    };
  }

  it("steps with the eased progress on each frame and ends on 1, once", () => {
    const c = clock();
    startTravel(400, (u) => c.seen.push(u), c.raf, (id) => c.caf(id), c.now);
    expect(c.seen).toEqual([]);
    // the clock starts on the first frame, however long after the call that frame comes
    c.frame(90);
    expect(c.seen).toEqual([0]);
    c.frame(100);
    c.frame(100);
    expect(c.seen).toEqual([0, travelEase(0.25), travelEase(0.5)]);
    c.frame(250);
    expect(c.seen[c.seen.length - 1]).toBe(1);
    expect(c.seen.filter((u) => u === 1)).toHaveLength(1);
    expect(c.pending()).toBe(0);
    expect(c.frame(16)).toBe(false);
  });

  it("cut short, lands on the target at once: one last step of 1 and no frame after it", () => {
    const c = clock();
    const end = startTravel(400, (u) => c.seen.push(u), c.raf, (id) => c.caf(id), c.now);
    c.frame(16);
    c.frame(100);
    end();
    expect(c.seen).toEqual([0, travelEase(0.25), 1]);
    expect(c.pending()).toBe(0);
    expect(c.cancelled).toHaveLength(1);
    // ending it again, or a frame that was already on its way, does nothing
    end();
    c.frame(16);
    expect(c.seen).toEqual([0, travelEase(0.25), 1]);
  });

  it("cut short before its first frame, still lands on the target", () => {
    const c = clock();
    const end = startTravel(400, (u) => c.seen.push(u), c.raf, (id) => c.caf(id), c.now);
    end();
    expect(c.seen).toEqual([1]);
    expect(c.pending()).toBe(0);
  });
});
