/**
 * The overview of the level `<TuxArchitectureMap>` shows (#211): its geometry, and the state
 * that decides when it is on screen. `TuxArchitectureMapMinimap.vue` beside this file draws it.
 *
 * The cards come from the stage data the map already built (`ComputedStageData.rects`), scaled
 * by one factor: nothing here lays anything out, and no card is measured in the DOM. The one
 * thing read from the DOM is the viewport's scroll position and size, once a frame at most,
 * after a scroll or a resize.
 *
 * Internal to the component: nothing here is part of the package's API.
 */
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";

/** A width and a height in px: the stage's, or the box the overview is drawn in. */
export interface MinimapSize {
  width: number;
  height: number;
}

export interface MinimapBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** The viewport as measured: how far it is scrolled, and the size of what it shows. */
export interface MinimapView {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** The overview is at most this large; the stage's shape decides which side is shorter. */
export const MINIMAP_MAX: MinimapSize = { width: 168, height: 112 };
/** A card is drawn at least this many px wide and tall. */
export const MINIMAP_MIN_CARD = 2;
/** How long the overview stays after the view comes to rest. */
export const MINIMAP_REST_MS = 1200;
/**
 * A level this many px larger than its viewport has nothing worth an overview: the fitted
 * diagram's height is rounded up and the viewport's border is taken from it, which leaves 1-3px.
 */
export const MINIMAP_SLACK = 4;

/** The factor from stage px to overview px: the stage fits `max` and keeps its shape. */
export function minimapScale(stage: MinimapSize, max: MinimapSize = MINIMAP_MAX): number {
  if (!(stage.width > 0) || !(stage.height > 0)) return 0;
  return Math.min(max.width / stage.width, max.height / stage.height);
}

/** A stage rectangle (a card's `rects` entry) in the overview. */
export function minimapBox(r: MinimapBox, k: number): MinimapBox {
  return {
    x: r.x * k,
    y: r.y * k,
    w: Math.max(MINIMAP_MIN_CARD, r.w * k),
    h: Math.max(MINIMAP_MIN_CARD, r.h * k),
  };
}

/** The stage at `scale` is larger than the viewport: there is somewhere to scroll to. */
export function minimapOverflows(stage: MinimapSize, scale: number, view: MinimapView): boolean {
  if (!(view.width > 0) || !(view.height > 0)) return false;
  return (
    stage.width * scale > view.width + MINIMAP_SLACK || stage.height * scale > view.height + MINIMAP_SLACK
  );
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * The part of the stage in view, in the overview. `panX` is the stage's own slide (the px it is
 * translated by, 0 or less), which moves what is in view without scrolling the viewport.
 */
export function minimapViewBox(
  stage: MinimapSize,
  scale: number,
  panX: number,
  view: MinimapView,
  k: number,
): MinimapBox {
  if (!(scale > 0)) return { x: 0, y: 0, w: 0, h: 0 };
  const x0 = clamp((view.left - panX) / scale, 0, stage.width);
  const x1 = clamp((view.left - panX + view.width) / scale, 0, stage.width);
  const y0 = clamp(view.top / scale, 0, stage.height);
  const y1 = clamp((view.top + view.height) / scale, 0, stage.height);
  return { x: x0 * k, y: y0 * k, w: (x1 - x0) * k, h: (y1 - y0) * k };
}

/**
 * The scroll position that centres the viewport on a point of the overview, held to what the
 * viewport can scroll to.
 */
export function minimapScrollTarget(
  point: { x: number; y: number },
  stage: MinimapSize,
  scale: number,
  panX: number,
  view: MinimapView,
  k: number,
): { left: number; top: number } {
  if (!(k > 0)) return { left: view.left, top: view.top };
  const maxLeft = Math.max(0, stage.width * scale + panX - view.width);
  const maxTop = Math.max(0, stage.height * scale - view.height);
  return {
    left: Math.round(clamp((point.x / k) * scale + panX - view.width / 2, 0, maxLeft)),
    top: Math.round(clamp((point.y / k) * scale - view.height / 2, 0, maxTop)),
  };
}

/** What the composable reads from the map. Getters, so it follows the map's own state. */
export interface MapMinimapSource {
  /** The element that scrolls. */
  viewport: () => HTMLElement | null | undefined;
  /** The stage data's `width` and `height`. A new object is a new level (or a rebuilt one). */
  stage: () => MinimapSize;
  /** The scale the stage is drawn at. */
  scale: () => number;
  /** The stage's slide in px. */
  panX: () => number;
}

interface Measured extends MinimapView {
  /** The viewport's content box against the element the overview is placed in. */
  x: number;
  y: number;
  /** The window's width: a narrow touch screen gets no overview. */
  win: number;
}

/**
 * When the overview is on screen, and where the view is.
 *
 * It listens to the viewport's `scroll`, to its resize and to the window's, and measures in the
 * next animation frame, once for however many events arrived. A scroll, a change of scale and a
 * new stage each count as the view moving: the overview shows, and goes `MINIMAP_REST_MS` after
 * the last of them unless something holds it (the pointer over it, focus in it, a drag on it).
 */
export function useMapMinimap(src: MapMinimapSource) {
  const measured = shallowRef<Measured>({ left: 0, top: 0, width: 0, height: 0, x: 0, y: 0, win: 0 });
  const moving = ref(false);
  const holds = ref<Record<string, boolean>>({});

  let frame: number | null = null;
  let moved = false;
  // the map settles its own scale as it mounts: nothing before the first measurement is a move
  let ready = false;
  let restTimer: ReturnType<typeof setTimeout> | null = null;
  let listened: HTMLElement | null = null;
  let observer: ResizeObserver | null = null;

  function measure() {
    const vp = src.viewport();
    if (!vp) return;
    measured.value = {
      left: vp.scrollLeft,
      top: vp.scrollTop,
      width: vp.clientWidth,
      height: vp.clientHeight,
      x: vp.offsetLeft + vp.clientLeft,
      y: vp.offsetTop + vp.clientTop,
      win: window.innerWidth,
    };
  }

  function poke() {
    moving.value = true;
    if (restTimer) clearTimeout(restTimer);
    restTimer = setTimeout(() => {
      restTimer = null;
      moving.value = false;
    }, MINIMAP_REST_MS);
  }

  /** Measures in the next frame; `asMove` also counts it as the view moving. */
  function schedule(asMove: boolean) {
    moved = moved || (asMove && ready);
    if (frame !== null) return;
    frame = window.requestAnimationFrame(() => {
      frame = null;
      measure();
      if (moved) poke();
      moved = false;
      ready = true;
    });
  }

  const onScroll = () => schedule(true);
  const onResize = () => schedule(false);

  function listen(vp: HTMLElement | null) {
    if (vp === listened) return;
    listened?.removeEventListener("scroll", onScroll);
    observer?.disconnect();
    observer = null;
    listened = vp;
    if (!vp) return;
    vp.addEventListener("scroll", onScroll, { passive: true });
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(onResize);
      observer.observe(vp);
    }
    schedule(false);
  }

  onMounted(() => {
    window.addEventListener("resize", onResize);
    listen(src.viewport() ?? null);
  });
  watch(
    () => src.viewport() ?? null,
    (vp) => listen(vp),
  );
  // a new level, a toggle that rebuilt the stage, or a step of magnification: the view moved
  watch([src.stage, src.scale], () => schedule(true), { flush: "post" });
  watch(src.panX, () => schedule(false), { flush: "post" });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize);
    if (frame !== null) window.cancelAnimationFrame(frame);
    listen(null);
    if (restTimer) clearTimeout(restTimer);
  });

  const k = computed(() => minimapScale(src.stage()));
  const overflows = computed(() => minimapOverflows(src.stage(), src.scale(), measured.value));
  const viewBox = computed(() => minimapViewBox(src.stage(), src.scale(), src.panX(), measured.value, k.value));
  // Shown is not live (#228): resting after a move it is drawn and lets the pointer through, and
  // it takes the pointer only for a reason to hold it (the pointer in its box, focus, a drag)
  const live = computed(() => Object.values(holds.value).some(Boolean));
  const shown = computed(() => moving.value || live.value);

  /** Holds the overview on screen (or lets it go) for one reason: "pointer", "focus", "drag". */
  function hold(why: string, on: boolean) {
    if (Boolean(holds.value[why]) === on) return;
    holds.value = { ...holds.value, [why]: on };
    // let go: it stays for the rest time, as it does after a scroll
    if (!on) poke();
  }

  function scrollTo(target: { left: number; top: number }) {
    const vp = src.viewport();
    if (!vp) return;
    vp.scrollLeft = target.left;
    vp.scrollTop = target.top;
    // the viewport answers with a scroll event; where it does not, the move is still counted
    schedule(true);
  }

  /** Centres the viewport on a point of the overview. */
  function moveTo(point: { x: number; y: number }) {
    scrollTo(minimapScrollTarget(point, src.stage(), src.scale(), src.panX(), measured.value, k.value));
  }

  /** Moves the viewport by a quarter of its own size (`dx`, `dy` are -1, 0 or 1); the far end is the viewport's to hold. */
  function step(dx: number, dy: number) {
    const m = measured.value;
    scrollTo({
      left: Math.max(0, Math.round(m.left + (dx * m.width) / 4)),
      top: Math.max(0, Math.round(m.top + (dy * m.height) / 4)),
    });
  }

  return { measured, k, overflows, viewBox, shown, live, hold, moveTo, step };
}
