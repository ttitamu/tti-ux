<script setup lang="ts">
/**
 * The overview of the level `<TuxArchitectureMap>` shows (#211): each card a small rectangle
 * in its place, and a frame around the part in view. It is rendered only where the level is
 * larger than its viewport, it shows while the view moves, and a press or a drag on it moves
 * the view. `tuxArchitectureMapMinimap.ts` has the geometry and the timing.
 *
 * It lives here, not under `app/components`, so the layer does not register it: it is a part
 * of the map, imported by it, and not a component of the package.
 */
import { computed } from "vue";
import type { ComputedStageData } from "./tuxArchitectureMapStage";
import { minimapBox, useMapMinimap } from "./tuxArchitectureMapMinimap";

const props = defineProps<{
  /** The map's scrolling viewport. The overview is placed in its bottom-left corner. */
  viewport: HTMLElement | null;
  /** The stage data the map built for the level in view. */
  stage: Pick<ComputedStageData, "els" | "deployNodes" | "rects" | "width" | "height">;
  /** The scale the stage is drawn at. */
  scale: number;
  /** The stage's slide in px. */
  panX: number;
  selectedId?: string | null;
  /** The cards the stage draws as changed. */
  changedIds?: ReadonlySet<string> | null;
  /** While the stage dims the cards a highlight does not reach: whether a card is one it does. */
  lit?: ((id: string, parent?: string) => boolean) | null;
  /** A touch screen. */
  coarse?: boolean;
  /** A touch screen narrower than this gets no overview. */
  narrowBelow?: number;
}>();

const MARGIN = 12;

const m = useMapMinimap({
  viewport: () => props.viewport,
  stage: () => props.stage,
  scale: () => props.scale,
  panX: () => props.panX,
});

const rendered = computed<boolean>(
  () => m.overflows.value && !(props.coarse && m.measured.value.win < (props.narrowBelow ?? 0)),
);

const size = computed(() => ({
  width: Math.ceil(props.stage.width * m.k.value),
  height: Math.ceil(props.stage.height * m.k.value),
}));

/** The level's cards (Level 4: its deployment nodes), each where the stage data put it. */
const cards = computed(() => {
  const k = m.k.value;
  const out: { id: string; parent?: string; x: number; y: number; w: number; h: number }[] = [];
  for (const e of [...props.stage.els, ...props.stage.deployNodes]) {
    const r = props.stage.rects[e.id];
    if (r) out.push({ id: e.id, parent: (e as { parent?: string }).parent, ...minimapBox(r, k) });
  }
  return out;
});

// SVG lengths to a tenth of a px
const n = (v: number) => Math.round(v * 10) / 10;

function pointOf(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement;
  const box = el.getBoundingClientRect();
  return { x: e.clientX - box.left - el.clientLeft, y: e.clientY - box.top - el.clientTop };
}

/**
 * The map's own pointer move, in px from the viewport's content box. Shown and resting, the
 * overview lets the pointer through to the card under it; the pointer inside its box makes it
 * live (#228).
 */
function pointerAt(x: number, y: number) {
  const { width: w, height: h } = size.value;
  const top = m.measured.value.height - h - 2 - MARGIN;
  m.hold("pointer", rendered.value && m.shown.value && x >= MARGIN && x <= MARGIN + w + 2 && y >= top && y <= top + h + 2);
}

defineExpose({ pointerAt });

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0) return;
  e.preventDefault();
  try {
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  } catch {
    // a pointer that is already gone cannot be captured: the drag follows the moves it gets
  }
  m.hold("drag", true);
  m.moveTo(pointOf(e));
}

function onPointerMove(e: PointerEvent) {
  if ((e.buttons & 1) === 0) return;
  m.moveTo(pointOf(e));
}

const ARROWS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

function onKeydown(e: KeyboardEvent) {
  const by = e.ctrlKey || e.metaKey || e.altKey ? undefined : ARROWS[e.key];
  if (!by) return;
  e.preventDefault();
  e.stopPropagation();
  m.step(by[0], by[1]);
}
</script>

<template>
  <div
    v-if="rendered"
    class="tux-map__minimap"
    :class="{ 'tux-map__minimap--shown': m.shown.value, 'tux-map__minimap--live': m.live.value }"
    role="img"
    tabindex="0"
    :aria-label="`Overview of this level: ${cards.length} ${cards.length === 1 ? 'card' : 'cards'}. The frame is the part in view; the arrow keys move it.`"
    :style="{
      left: `${m.measured.value.x + MARGIN}px`,
      top: `${m.measured.value.y + m.measured.value.height - size.height - 2 - MARGIN}px`,
    }"
    @pointerenter="m.hold('pointer', true)"
    @pointerleave="m.hold('pointer', false)"
    @focus="m.hold('focus', true)"
    @blur="m.hold('focus', false)"
    @mousedown.prevent
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="m.hold('drag', false)"
    @pointercancel="m.hold('drag', false)"
    @lostpointercapture="m.hold('drag', false)"
    @keydown="onKeydown"
  >
    <svg :width="size.width" :height="size.height" aria-hidden="true" focusable="false">
      <rect
        v-for="c in cards"
        :key="c.id"
        class="tux-map__minimap-card"
        :class="{
          'tux-map__minimap-card--selected': c.id === selectedId,
          'tux-map__minimap-card--changed': Boolean(changedIds?.has(c.id)),
          'tux-map__minimap-card--faded': Boolean(lit && c.id !== selectedId && !lit(c.id, c.parent)),
        }"
        :data-id="c.id"
        :x="n(c.x)"
        :y="n(c.y)"
        :width="n(c.w)"
        :height="n(c.h)"
        rx="1"
      />
      <rect
        class="tux-map__minimap-view"
        :x="n(m.viewBox.value.x)"
        :y="n(m.viewBox.value.y)"
        :width="n(m.viewBox.value.w)"
        :height="n(m.viewBox.value.h)"
        rx="1.5"
      />
    </svg>
  </div>
</template>

<style scoped>
/* Out of the pointer's way unless live: the cards under it take their clicks, also while it is
   shown after a move (#228). It stays in the document, so the Tab key reaches it, and focus shows it. */
.tux-map__minimap {
  position: absolute;
  z-index: 24;
  box-sizing: content-box;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm, 4px);
  background: color-mix(in srgb, var(--surface-raised) 92%, transparent);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.16);
  line-height: 0;
  cursor: pointer;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.18s ease;
}

.tux-map__minimap--shown {
  opacity: 1;
}

.tux-map__minimap--live {
  pointer-events: auto;
}

.tux-map__minimap:focus-visible {
  outline: 3px solid var(--brand-primary);
  outline-offset: 2px;
}

.tux-map__minimap svg {
  display: block;
  overflow: visible;
}

.tux-map__minimap-card {
  fill: color-mix(in srgb, var(--text-muted) 55%, var(--surface-raised));
}

.tux-map__minimap-card--changed {
  fill: var(--status-warning);
}

/* the selection: the brand's fill inside an outline in the text colour, so it is not told
   from a changed card by its hue alone */
.tux-map__minimap-card--selected {
  fill: var(--brand-primary);
  stroke: var(--text-primary);
  stroke-width: 1;
}

/* a card the highlight does not reach: a lighter fill, opaque, as on the stage (#229) */
.tux-map__minimap-card--faded {
  fill: color-mix(in srgb, var(--text-muted) 18%, var(--surface-raised));
}

.tux-map__minimap-view {
  fill: color-mix(in srgb, var(--text-primary) 8%, transparent);
  stroke: var(--text-primary);
  stroke-width: 1.5;
}

@media (forced-colors: active) {
  .tux-map__minimap-card {
    fill: GrayText;
  }
  .tux-map__minimap-card--selected {
    fill: Highlight;
    stroke: CanvasText;
  }
  .tux-map__minimap-view {
    fill: none;
    stroke: CanvasText;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tux-map__minimap {
    transition: none;
  }
}
</style>
