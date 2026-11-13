/**
 * The trailing cursor of `<TuxArchitectureMap cursor>` (#208): the spring the disc follows
 * the pointer with, and the box it comes to rest on.
 *
 * The spring is critically damped and stepped in closed form, so a long frame cannot make it
 * unstable: from rest it never passes its target, and a disc that arrives with speed passes it
 * by no more than speed / (omega * e).
 */
import { describe, expect, it } from "vitest";
import {
  TUX_MAP_CURSOR_DISC,
  TUX_MAP_CURSOR_OMEGA,
  tuxMapCursorSpring,
  tuxMapCursorTarget,
} from "../app/composables/useTuxMapCursor";

const OMEGA = TUX_MAP_CURSOR_OMEGA;

/** Runs the spring at a fixed frame time; returns every position it passed through. */
function run(x: number, v: number, to: number, frames: number, dt = 1 / 60): { xs: number[]; v: number } {
  const xs: number[] = [];
  for (let i = 0; i < frames; i++) {
    [x, v] = tuxMapCursorSpring(x, v, to, dt, OMEGA);
    xs.push(x);
  }
  return { xs, v };
}

describe("tuxMapCursorSpring: a critically damped spring (#208)", () => {
  it("converges on its target and comes to rest there", () => {
    const { xs, v } = run(0, 0, 300, 60);
    expect(Math.abs(xs.at(-1)! - 300)).toBeLessThan(0.01);
    expect(Math.abs(v)).toBeLessThan(0.1);
  });

  it("from rest it only ever approaches: no step moves away and none passes the target", () => {
    const { xs } = run(0, 0, 300, 120);
    let prev = 0;
    for (const x of xs) {
      expect(x).toBeGreaterThanOrEqual(prev);
      expect(x).toBeLessThanOrEqual(300);
      prev = x;
    }
  });

  it("arriving with speed it passes the target by at most speed / (omega * e)", () => {
    const speed = 2400;
    const { xs } = run(300, speed, 300, 240);
    const over = Math.max(...xs) - 300;
    expect(over).toBeGreaterThan(0);
    expect(over).toBeLessThanOrEqual(speed / (OMEGA * Math.E) + 1e-6);
    expect(Math.abs(xs.at(-1)! - 300)).toBeLessThan(0.01);
  });

  it("is the same curve whatever the frame time, and stays finite across a stalled frame", () => {
    const at60 = run(0, 0, 100, 30, 1 / 60).xs.at(-1)!;
    const at120 = run(0, 0, 100, 60, 1 / 120).xs.at(-1)!;
    expect(at60).toBeCloseTo(at120, 9);
    const [x, v] = tuxMapCursorSpring(0, 5000, 100, 5, OMEGA);
    expect(x).toBeCloseTo(100, 6);
    expect(v).toBeCloseTo(0, 6);
  });

  it("at its target and still, it stays", () => {
    expect(tuxMapCursorSpring(42, 0, 42, 1 / 60, OMEGA)).toEqual([42, 0]);
  });

  it("follows faster than #208's spring did, and still trails (#256)", () => {
    /** Frames at 60 Hz until a 100 px move is within `left` px of the pointer. */
    const framesTo = (omega: number, left: number) => {
      let [x, v] = [0, 0];
      let n = 0;
      while (100 - x > left) {
        [x, v] = tuxMapCursorSpring(x, v, 100, 1 / 60, omega);
        n++;
      }
      return n;
    };
    // #208 took 13 frames to be within 10 px; a third or so less now, and not so fast it stops trailing
    expect(framesTo(18, 10)).toBe(13);
    expect(framesTo(OMEGA, 10)).toBeLessThanOrEqual(10);
    expect(framesTo(OMEGA, 10)).toBeGreaterThanOrEqual(6);
    expect(framesTo(OMEGA, 50)).toBeGreaterThanOrEqual(3);
  });
});

describe("tuxMapCursorTarget: where the disc rests (#208)", () => {
  it("over the background it is a round disc centred on the pointer", () => {
    expect(tuxMapCursorTarget(120, 80, null, 6, false)).toEqual([
      120,
      80,
      TUX_MAP_CURSOR_DISC,
      TUX_MAP_CURSOR_DISC,
      TUX_MAP_CURSOR_DISC / 2,
      1,
    ]);
  });

  it("over a card it is the card's box and the padding around it, with rounded corners, opaque", () => {
    // a 200 x 90 card at (40, 60), 6 px of padding: centre (140, 105), 212 x 102
    const t = tuxMapCursorTarget(50, 70, { x: 40, y: 60, w: 200, h: 90 }, 6, false);
    expect(t.slice(0, 5)).toEqual([140, 105, 212, 102, 13]);
    // opaque: it is drawn under the card (#256), so what shows is the 6 px ring at full colour
    expect(t[5]).toBe(1);
  });

  it("a small control gets a radius no larger than half its padded height", () => {
    // a 20 x 14 control, 4 px of padding: 28 x 22, so the radius stops at 11
    const [, , w, h, r] = tuxMapCursorTarget(0, 0, { x: 0, y: 0, w: 20, h: 14 }, 4, false);
    expect([w, h, r]).toEqual([28, 22, 11]);
    const [, , , h2, r2] = tuxMapCursorTarget(0, 0, { x: 0, y: 0, w: 20, h: 8 }, 4, false);
    expect(r2).toBe(h2 / 2);
  });

  it("while the map is dragged it is a small disc on the pointer, whatever is under it", () => {
    const t = tuxMapCursorTarget(120, 80, { x: 40, y: 60, w: 200, h: 90 }, 6, true);
    expect(t.slice(0, 2)).toEqual([120, 80]);
    expect(t[2]).toBe(t[3]);
    expect(t[2]).toBeLessThan(TUX_MAP_CURSOR_DISC / 2);
    expect(t[4]).toBe(t[2]! / 2);
    expect(t[5]).toBe(1);
  });
});
