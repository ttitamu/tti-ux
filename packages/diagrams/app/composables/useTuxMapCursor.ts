/**
 * The trailing cursor of `<TuxArchitectureMap cursor>` (#208): a dot on the pointer and a disc
 * that follows it on a critically damped spring. Near a card, or over a control inside the
 * canvas, the disc comes to rest on that target's rounded box.
 *
 * It is drawn in the stage, under everything on it but the background (#256): resting on a card it
 * shows as a ring around the card's edge, and never covers the card's text or a control.
 *
 * Decoration only. It is drawn for a fine pointer with motion allowed, never takes a pointer
 * event, and its frame loop runs only while the disc is away from where it is going.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue";

/** Diameter of the free disc, in CSS px. The stylesheet draws the disc at this size. */
export const TUX_MAP_CURSOR_DISC = 40;

/** The spring's rate, per second: the disc is most of the way to the pointer in 1/OMEGA s (#256: 18 → 26). */
export const TUX_MAP_CURSOR_OMEGA = 26;

type Box = { x: number; y: number; w: number; h: number };

/**
 * One step of a critically damped spring, in closed form: stable for any `dt` (seconds).
 * Returns the new `[position, velocity]`.
 */
export function tuxMapCursorSpring(x: number, v: number, to: number, dt: number, omega: number): [number, number] {
  const d = x - to;
  const c = v + omega * d;
  const e = Math.exp(-omega * dt);
  return [to + (d + c * dt) * e, (v - c * omega * dt) * e];
}

/**
 * Where the disc rests, as `[centre x, centre y, width, height, corner radius, opacity]`: the
 * padded box of what it is on, a round disc on the pointer over the background, a small one
 * while the map is dragged. It is opaque everywhere: on a target, the target drawn over it
 * leaves the padding showing as a ring (#256).
 */
export function tuxMapCursorTarget(px: number, py: number, box: Box | null, pad: number, drag: boolean): number[] {
  if (drag || !box) {
    const d = drag ? 12 : TUX_MAP_CURSOR_DISC;
    return [px, py, d, d, d / 2, 1];
  }
  const w = box.w + pad * 2;
  const h = box.h + pad * 2;
  return [box.x + box.w / 2, box.y + box.h / 2, w, h, Math.min(pad + 7, h / 2), 1];
}

export function useTuxMapCursor(o: {
  /** The prop is on and the canvas is one the cursor belongs on */
  on: () => boolean;
  /** The card the map's proximity has picked, in stage units */
  card: Ref<Box | null>;
  /** Stage scale and horizontal pan: stage units to px inside the viewport */
  scale: Ref<number>;
  pan: Ref<number>;
  /** The background is being dragged */
  drag: Ref<boolean>;
  /** Where the viewport's scrolled content starts, in client px: the map's own reading, kept between moves (#224) */
  origin: () => number[];
}) {
  /** The cursor element: a child of the stage holding the dot, then the disc. The map undoes the
      stage's scale and pan on it, so the px set here are the viewport's content px. */
  const el = ref<HTMLElement | null>(null);
  const allowed = ref(false);
  const shown = ref(false);
  const on = computed(() => allowed.value && o.on());

  let mq: MediaQueryList | undefined;
  let raf = 0;
  let then = 0;
  let last: PointerEvent | null = null;
  let p = [0, 0, 0, 0, 0, 0];
  let to = p;
  const v = [0, 0, 0, 0, 0, 0];

  const sync = () => {
    allowed.value = Boolean(mq?.matches);
  };

  function paint() {
    const disc = el.value?.lastElementChild as HTMLElement | null;
    if (!disc) return;
    const sx = p[2]! / TUX_MAP_CURSOR_DISC;
    const sy = p[3]! / TUX_MAP_CURSOR_DISC;
    disc.style.transform = `translate(${p[0]}px,${p[1]}px) scale(${sx},${sy})`;
    disc.style.borderRadius = `${p[4]! / sx}px/${p[4]! / sy}px`;
    disc.style.opacity = `${p[5]}`;
  }

  function frame(now: number) {
    const dt = then ? Math.min(Math.max(now - then, 0) / 1000, 0.05) : 1 / 60;
    then = now;
    raf = 0;
    let busy = false;
    for (let i = 0; i < 6; i++) {
      const [x, s] = tuxMapCursorSpring(p[i]!, v[i]!, to[i]!, dt, TUX_MAP_CURSOR_OMEGA);
      if (Math.abs(x - to[i]!) < (i < 5 ? 0.1 : 0.01) && Math.abs(s) < 1) {
        p[i] = to[i]!;
        v[i] = 0;
      } else {
        p[i] = x;
        v[i] = s;
        busy = true;
      }
    }
    paint();
    if (busy) raf = requestAnimationFrame(frame);
  }

  /** Places the dot, and sets the disc going to its target: a control under the pointer is the one layout read. */
  function aim() {
    const e = last;
    if (!el.value || !e) return;
    const [ox, oy] = o.origin() as [number, number];
    const px = e.clientX - ox;
    const py = e.clientY - oy;
    (el.value!.firstElementChild as HTMLElement).style.transform = `translate(${px}px,${py}px)`;
    const drag = o.drag.value;
    const ctl = (e.target as Element | null)?.closest?.("button,a");
    const card = o.card.value;
    let box: Box | null = null;
    let pad = 6;
    if (ctl && !ctl.classList.contains("tux-map__el")) {
      const b = ctl.getBoundingClientRect();
      box = { x: b.left - ox, y: b.top - oy, w: b.width, h: b.height };
      pad = 4;
    } else if (card) {
      const s = o.scale.value;
      box = { x: card.x * s + o.pan.value, y: card.y * s, w: card.w * s, h: card.h * s };
    }
    to = tuxMapCursorTarget(px, py, box, pad, drag);
    if (!shown.value) {
      // it appears where the pointer came in, not from where it was last seen
      p = to.slice();
      v.fill(0);
      shown.value = true;
    } else if (drag) {
      p[0] = px;
      p[1] = py;
      v[0] = v[1] = 0;
    }
    if (!raf) {
      then = 0;
      raf = requestAnimationFrame(frame);
    }
  }

  /** A pointer move over the canvas; with no event (a scroll, a new target), the last one again. */
  function move(e?: PointerEvent) {
    if (e) {
      if (e.pointerType === "touch") return;
      last = e;
    }
    aim();
  }

  function leave() {
    last = null;
    shown.value = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  watch(o.card, () => shown.value && aim());
  watch(on, (is) => is || leave());

  onMounted(() => {
    mq = window.matchMedia?.("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    sync();
    mq?.addEventListener?.("change", sync);
  });
  onBeforeUnmount(() => {
    mq?.removeEventListener?.("change", sync);
    leave();
  });

  return { el, on, shown, move, leave };
}
