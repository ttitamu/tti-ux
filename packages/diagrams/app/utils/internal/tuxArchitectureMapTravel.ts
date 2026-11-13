/**
 * The camera's travel in `<TuxArchitectureMap>` (#212): one easing curve and one
 * duration rule for a zoom into or out of a card and for a move to another card
 * on the same level. Nothing here reads the DOM: the component passes rectangles
 * and scroll positions in, and plays what comes back.
 */

/** A travel lasts `TRAVEL_BASE_MS` plus `TRAVEL_MS_PER_PX` for each pixel it covers, and never more than `TRAVEL_MAX_MS`. */
export const TRAVEL_BASE_MS = 180;
export const TRAVEL_MS_PER_PX = 0.25;
export const TRAVEL_MAX_MS = 600;
/** A fade that goes with a travel, or stands in for one where the map jumps to a level. */
export const TRAVEL_FADE_MS = 120;

/** The one curve: a cubic ease-out, as CSS and (`travelEase`) as a function. */
export const TRAVEL_EASING = "cubic-bezier(0.333, 1, 0.667, 1)";

export type TravelPoint = [number, number];

export interface TravelRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Progress of the travel at `t` (0 to 1) of its time: `1 - (1 - t)^3`. */
export function travelEase(t: number): number {
  return t >= 1 ? 1 : t > 0 ? 1 - (1 - t) ** 3 : 0;
}

/** How long a travel of `px` pixels lasts, in ms. Less than half a pixel is no travel: 0. */
export function travelDuration(px: number): number {
  return px >= 0.5 ? Math.round(Math.min(TRAVEL_MAX_MS, TRAVEL_BASE_MS + TRAVEL_MS_PER_PX * px)) : 0;
}

/** The corners of a routed wire's path (`M`, `L` and `Q` of an orthogonal route), in order. */
export function wirePolyline(d: string): TravelPoint[] {
  const n = d.match(/-?\d+(\.\d+)?/g) ?? [];
  const out: TravelPoint[] = [];
  for (let i = 0; i + 1 < n.length; i += 2) out.push([Number(n[i]), Number(n[i + 1])]);
  return out;
}

/** The point `u` (0 to 1) of the way along a polyline, by length. `u = 1` is the last point itself. */
export function pointAlong(pts: TravelPoint[], u: number): TravelPoint {
  const last = pts[pts.length - 1] ?? [0, 0];
  if (u >= 1 || pts.length < 2) return last;
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i]![0], p[1] - pts[i]![1]));
  let left = Math.max(0, u) * seg.reduce((a, b) => a + b, 0);
  for (let i = 0; i < seg.length; i++) {
    const len = seg[i]!;
    if (left <= len && len > 0) {
      const a = pts[i]!;
      const b = pts[i + 1]!;
      return [a[0] + ((b[0] - a[0]) * left) / len, a[1] + ((b[1] - a[1]) * left) / len];
    }
    left -= len;
  }
  return last;
}

/**
 * Where the view is at `u` of a travel from `from` to `to` that follows `path`.
 * The view goes from `from` to `to` and leaves the straight line between them as
 * the path leaves its own chord, at `scale`, and by no more than the travel is
 * long: a short move along a long wire does not swing wide. `u = 1` is `to` itself.
 */
export function cameraAlong(
  from: TravelPoint,
  to: TravelPoint,
  path: TravelPoint[],
  scale: number,
  u: number,
): TravelPoint {
  if (u >= 1) return to;
  const t = Math.max(0, u);
  const at: TravelPoint = [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
  if (path.length < 3) return at;
  const a = path[0]!;
  const b = path[path.length - 1]!;
  const chord = Math.hypot(b[0] - a[0], b[1] - a[1]) * scale;
  const bend = chord > 0 ? Math.min(1, Math.hypot(to[0] - from[0], to[1] - from[1]) / chord) * scale : 0;
  const p = pointAlong(path, t);
  return [at[0] + bend * (p[0] - a[0] - (b[0] - a[0]) * t), at[1] + bend * (p[1] - a[1] - (b[1] - a[1]) * t)];
}

/**
 * The scroll offset that brings `lo`…`hi` inside a window `size` long that starts
 * at `pos`, and moves it no further than that: `far` clear of the window's end,
 * 12 clear of its start, the start winning where both cannot hold.
 */
export function clearOffset(pos: number, lo: number, hi: number, size: number, far: number): number {
  if (hi - pos > size - far) pos = hi - size + far;
  if (lo - pos < 12) pos = lo - 12;
  return Math.max(0, Math.round(pos));
}

/**
 * Where a level starts a zoom from. `inner` is a rectangle of the level as it is laid out
 * (its frame on the way in, the card it came from on the way out), `outer` is the rectangle on
 * screen that it grows out of or shrinks back from, and `pan` and `scale` are the transform the
 * level ends on. The start places `inner` inside `outer`, centred, as large as fits. `px` is
 * the furthest any corner of `inner` then has to go.
 */
export function flipStart(
  inner: TravelRect,
  outer: TravelRect,
  pan: number,
  scale: number,
): { x: number; y: number; k: number; px: number } {
  const k = Math.min(outer.w / inner.w, outer.h / inner.h);
  const x = outer.x + outer.w / 2 - (inner.x + inner.w / 2) * k;
  const y = outer.y + outer.h / 2 - (inner.y + inner.h / 2) * k;
  let px = 0;
  for (const cx of [inner.x, inner.x + inner.w]) {
    for (const cy of [inner.y, inner.y + inner.h]) {
      px = Math.max(px, Math.hypot(x + cx * k - pan - cx * scale, y + cy * k - cy * scale));
    }
  }
  return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100, k: Math.round(k * 1e4) / 1e4, px };
}

/**
 * Runs `step` with the eased progress of a travel on each animation frame for `ms`, and
 * returns what ends it. Ending it early is not stopping halfway: `step(1)` runs, once,
 * so the view is on its target whether the travel ran out or was cut short. The clock starts
 * on the first frame, not on the call: the work a click sets off before that frame (a selection
 * drawn, a panel opened) is not time the travel has spent, and would be its first third gone.
 */
export function startTravel(
  ms: number,
  step: (u: number) => void,
  raf: (cb: () => void) => number = (cb) => requestAnimationFrame(cb),
  caf: (id: number) => void = (id) => cancelAnimationFrame(id),
  now: () => number = () => performance.now(),
): () => void {
  let t0: number | undefined;
  let over = false;
  let id = 0;
  const end = () => {
    if (over) return;
    over = true;
    caf(id);
    step(1);
  };
  const tick = () => {
    if (over) return;
    const t = (now() - (t0 ??= now())) / ms;
    if (t >= 1) return end();
    step(travelEase(t));
    id = raf(tick);
  };
  id = raf(tick);
  return end;
}
