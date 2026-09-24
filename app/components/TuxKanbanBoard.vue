<script lang="ts">
// The drag context shared by TuxKanbanBoard, TuxKanbanLane and TuxKanbanCard.
// It lives in this SFC's exporting <script> (not app/composables) so the
// lane and card can import it explicitly — in Nuxt, in plain-Vue hosts such
// as the forge's island (which doesn't auto-import TUX composables), and in
// the nuxt test environment (where an explicit import of an auto-imported
// module deadlocks setup). Promoted from TTI AI Studio's kanban primitive
// (app/components/kanban/useKanbanDnd.ts there), with what it listed as the
// prerequisite for promotion: keyboard drag-and-drop.
//
// The components are DUMB. They hold no board data; they track the in-flight
// drag here and the board emits ONE intent — move(cardId, fromLaneId,
// toLaneId, beforeCardId) — to the parent, which owns the data. So drag,
// layout and a11y stay uniform while card visuals vary by slot.
//
// Two ways to move a card, same outcome:
//   Pointer — pointer events + hit-testing against the `data-kanban-lane` /
//     `data-kanban-card` attributes the components stamp (not HTML5 DnD:
//     desktop webviews such as Tauri's swallow it). Arms after 4px so clicks
//     still open cards.
//   Keyboard — Space lifts the focused card, arrows move it (←/→ lane,
//     ↑/↓ position), Space or Enter drops, Escape cancels. Every step is
//     announced through the board's live region.
//
// Shadow-DOM safe: hit-testing asks the card's own root node (a document or
// a ShadowRoot — both have elementFromPoint), and nothing touches
// document.body. The forge mounts TUX inside a shadow root.

import { inject, provide, ref, toRef, useId, type InjectionKey, type Ref } from "vue";

export interface TuxKanbanMove {
  cardId: string;
  fromLaneId: string;
  toLaneId: string;
  /** The card it lands before; null = the end of the lane. */
  beforeCardId: string | null;
}

/** true = allowed; a string = refused, and says why. */
export type TuxKanbanCanDrop = (cardId: string, toLaneId: string, fromLaneId: string) => true | string;

export interface TuxKanbanDndContext {
  /** Card being dragged (pointer or keyboard), or null. */
  draggingId: Ref<string | null>;
  /** Lane the drag is over. */
  overLaneId: Ref<string | null>;
  /** Card the dragged card would land before; null = append. */
  beforeCardId: Ref<string | null>;
  /** Why the lane under the drag refuses it (null when allowed). */
  refusal: Ref<string | null>;
  /** "pointer" | "keyboard" while a drag is live. */
  mode: Ref<"pointer" | "keyboard" | null>;
  /** Read-only board: nothing moves. */
  disabled: Ref<boolean>;
  /** Card to focus when it (re)mounts — keeps focus on a card the parent moved. */
  pendingFocus: Ref<string | null>;
  beginDrag(cardId: string, laneId: string, e: PointerEvent): void;
  onCardKey(cardId: string, laneId: string, label: string, e: KeyboardEvent): void;
  cancelKeyboard(): void;
}

export const TUX_KANBAN_DND: InjectionKey<TuxKanbanDndContext> = Symbol("tux-kanban-dnd");

const ARM_DISTANCE = 4;
const SCROLL_ZONE = 48;
const SCROLL_STEP = 14;
const INTERACTIVE = 'button, a, input, textarea, select, [contenteditable="true"]';

type Root = Document | ShadowRoot;
const rootOf = (el: Element | null): Root => (el?.getRootNode() as Root) || document;

export interface TuxKanbanDndOptions {
  /** The scrolling row of lanes. */
  boardEl: Ref<HTMLElement | null>;
  /** A positioned ancestor the drag ghost is drawn in (position: relative). */
  hostEl: Ref<HTMLElement | null>;
  disabled: Ref<boolean>;
  canDrop: () => TuxKanbanCanDrop | undefined;
  announce: (text: string) => void;
  onMove: (m: TuxKanbanMove) => void;
}

export function provideTuxKanbanDnd(opts: TuxKanbanDndOptions): TuxKanbanDndContext {
  const draggingId = ref<string | null>(null);
  const overLaneId = ref<string | null>(null);
  const beforeCardId = ref<string | null>(null);
  const refusal = ref<string | null>(null);
  const mode = ref<"pointer" | "keyboard" | null>(null);
  const pendingFocus = ref<string | null>(null);
  let fromLane = "";

  // ── what the DOM says (render order is the parent's data order) ────────────
  const lanes = (): HTMLElement[] =>
    Array.from(opts.boardEl.value?.querySelectorAll<HTMLElement>("[data-kanban-lane]") || []);
  const laneEl = (id: string) => lanes().find((l) => l.dataset.kanbanLane === id) || null;
  const laneTitle = (id: string) => laneEl(id)?.dataset.kanbanTitle || id;
  /** Card ids in a lane, in order, leaving out the one being moved. */
  const cardsIn = (laneId: string, without: string | null) =>
    Array.from(laneEl(laneId)?.querySelectorAll<HTMLElement>("[data-kanban-card]") || [])
      .map((c) => c.dataset.kanbanCard as string)
      .filter((id) => id !== without);

  function judge(cardId: string, toLane: string | null) {
    if (!toLane) return (refusal.value = null);
    const rule = opts.canDrop();
    const verdict = rule ? rule(cardId, toLane, fromLane) : true;
    refusal.value = verdict === true ? null : verdict;
  }

  function commit() {
    const card = draggingId.value, to = overLaneId.value;
    if (!card || !to) return false;
    if (refusal.value) {
      opts.announce(`Not moved: ${refusal.value}`);
      return false;
    }
    // Unchanged? Same lane and it would land where it already is.
    if (to === fromLane) {
      const ids = cardsIn(to, null);
      const at = ids.indexOf(card);
      const nextId = ids[at + 1] ?? null;
      if (beforeCardId.value === nextId || beforeCardId.value === card) return false;
    }
    pendingFocus.value = mode.value === "keyboard" ? card : null;
    opts.onMove({ cardId: card, fromLaneId: fromLane, toLaneId: to, beforeCardId: beforeCardId.value });
    return true;
  }

  function reset() {
    draggingId.value = null;
    overLaneId.value = null;
    beforeCardId.value = null;
    refusal.value = null;
    mode.value = null;
    opts.boardEl.value?.classList.remove("tux-kanban-board--dragging");
  }

  // ── pointer ────────────────────────────────────────────────────────────────
  function beginDrag(cardId: string, laneId: string, down: PointerEvent) {
    if (opts.disabled.value || mode.value === "keyboard") return;
    if (down.button !== 0) return;
    if ((down.target as Element | null)?.closest(INTERACTIVE)) return;
    const cardEl = down.currentTarget as HTMLElement | null;
    const root = rootOf(cardEl);
    const startX = down.clientX, startY = down.clientY;
    let armed = false, lastX = startX, lastY = startY, raf = 0;
    let ghost: HTMLElement | null = null, offX = 0, offY = 0;

    function hover(x: number, y: number) {
      const el = root.elementFromPoint(x, y);
      const lane = el?.closest("[data-kanban-lane]") as HTMLElement | null;
      if (!lane || !opts.boardEl.value?.contains(lane)) {
        overLaneId.value = null; beforeCardId.value = null; refusal.value = null;
        return;
      }
      overLaneId.value = lane.dataset.kanbanLane ?? null;
      const slot = el?.closest("[data-kanban-card]") as HTMLElement | null;
      if (!slot || slot.dataset.kanbanCard === cardId) {
        beforeCardId.value = slot ? beforeCardId.value : null;
      } else {
        const r = slot.getBoundingClientRect();
        if ((y - r.top) / r.height <= 0.5) beforeCardId.value = slot.dataset.kanbanCard ?? null;
        else {
          const next = slot.nextElementSibling as HTMLElement | null;
          beforeCardId.value = next?.dataset?.kanbanCard ?? null;
        }
      }
      judge(cardId, overLaneId.value);
    }

    function autoScroll() {
      raf = 0;
      if (!armed) return;
      let moved = false;
      const under = root.elementFromPoint(lastX, lastY);
      const list = under?.closest("[data-kanban-lane]")?.querySelector(".tux-kanban-lane__cards") as HTMLElement | null;
      if (list) {
        const r = list.getBoundingClientRect();
        const dy = lastY < r.top + SCROLL_ZONE ? -Math.ceil(((r.top + SCROLL_ZONE - lastY) / SCROLL_ZONE) * SCROLL_STEP)
          : lastY > r.bottom - SCROLL_ZONE ? Math.ceil(((lastY - (r.bottom - SCROLL_ZONE)) / SCROLL_ZONE) * SCROLL_STEP) : 0;
        if (dy) { list.scrollTop += dy; moved = true; }
      }
      const board = opts.boardEl.value;
      if (board) {
        const r = board.getBoundingClientRect();
        const dx = lastX < r.left + SCROLL_ZONE ? -Math.ceil(((r.left + SCROLL_ZONE - lastX) / SCROLL_ZONE) * SCROLL_STEP)
          : lastX > r.right - SCROLL_ZONE ? Math.ceil(((lastX - (r.right - SCROLL_ZONE)) / SCROLL_ZONE) * SCROLL_STEP) : 0;
        if (dx) { board.scrollLeft += dx; moved = true; }
      }
      if (moved) { hover(lastX, lastY); raf = requestAnimationFrame(autoScroll); }
    }

    function move(e: PointerEvent) {
      if (!armed) {
        if (Math.hypot(e.clientX - startX, e.clientY - startY) < ARM_DISTANCE) return;
        armed = true;
        fromLane = laneId;
        mode.value = "pointer";
        draggingId.value = cardId;
        // Start "where it is", so a nudge released over itself moves nothing.
        overLaneId.value = laneId;
        const here = cardsIn(laneId, null);
        beforeCardId.value = here[here.indexOf(cardId) + 1] ?? null;
        opts.boardEl.value?.classList.add("tux-kanban-board--dragging");
        (root as Document).getSelection?.()?.removeAllRanges();
        if (cardEl && opts.hostEl.value) {
          // A lightweight ghost: a clone that follows the pointer, drawn
          // ABSOLUTELY inside the board's host. Not position: fixed — any
          // container-query ancestor (the board's own wrapper included) is
          // the containing block for fixed elements, so fixed would drift.
          const r = cardEl.getBoundingClientRect();
          offX = startX - r.left; offY = startY - r.top;
          ghost = cardEl.cloneNode(true) as HTMLElement;
          ghost.classList.add("tux-kanban-ghost");
          ghost.removeAttribute("id");
          ghost.setAttribute("aria-hidden", "true");
          ghost.style.width = `${r.width}px`;
          opts.hostEl.value.appendChild(ghost);
        }
      }
      if (ghost && opts.hostEl.value) {
        const h = opts.hostEl.value.getBoundingClientRect();
        ghost.style.left = `${e.clientX - offX - h.left}px`;
        ghost.style.top = `${e.clientY - offY - h.top}px`;
      }
      lastX = e.clientX; lastY = e.clientY;
      hover(lastX, lastY);
      if (!raf) raf = requestAnimationFrame(autoScroll);
    }

    function finish(ok: boolean) {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("keydown", key, true);
      if (raf) cancelAnimationFrame(raf);
      ghost?.remove();
      ghost = null;
      if (armed) {
        // The click that follows a real drag must not also open the card.
        const squelch = (ce: MouseEvent) => { ce.stopPropagation(); ce.preventDefault(); };
        window.addEventListener("click", squelch, { capture: true, once: true });
        setTimeout(() => window.removeEventListener("click", squelch, { capture: true }), 50);
        if (ok) commit();
        else opts.announce("Move cancelled.");
      }
      reset();
    }
    const up = () => finish(true);
    const cancel = () => finish(false);
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") { e.stopPropagation(); e.preventDefault(); finish(false); }
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("keydown", key, true);
  }

  // ── keyboard ───────────────────────────────────────────────────────────────
  let kbLabel = "";

  function describe() {
    const lane = overLaneId.value as string;
    const ids = cardsIn(lane, draggingId.value);
    const pos = beforeCardId.value ? ids.indexOf(beforeCardId.value) + 1 : ids.length + 1;
    const where = `${laneTitle(lane)}, position ${pos} of ${ids.length + 1}`;
    return refusal.value ? `${where}. Can't drop here: ${refusal.value}` : where;
  }

  function onCardKey(cardId: string, laneId: string, label: string, e: KeyboardEvent) {
    if (opts.disabled.value) return;
    const lifted = mode.value === "keyboard" && draggingId.value === cardId;
    if (!lifted) {
      if (e.key !== " " || mode.value) return;
      e.preventDefault();
      fromLane = laneId;
      kbLabel = label;
      mode.value = "keyboard";
      draggingId.value = cardId;
      overLaneId.value = laneId;
      const ids = cardsIn(laneId, null);
      beforeCardId.value = ids[ids.indexOf(cardId) + 1] ?? null;
      judge(cardId, laneId);
      opts.announce(`Picked up ${label}. ${describe()}. Arrow keys move it, Space drops it, Escape cancels.`);
      return;
    }
    const all = lanes().map((l) => l.dataset.kanbanLane as string);
    const lane = overLaneId.value as string;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowLeft": {
        e.preventDefault();
        const next = all[all.indexOf(lane) + (e.key === "ArrowRight" ? 1 : -1)];
        if (!next) return opts.announce(`${describe()}. No more lanes that way.`);
        overLaneId.value = next;
        beforeCardId.value = null;
        judge(cardId, next);
        return opts.announce(describe());
      }
      case "ArrowUp":
      case "ArrowDown": {
        e.preventDefault();
        const ids = cardsIn(lane, cardId);
        const pos = beforeCardId.value ? ids.indexOf(beforeCardId.value) : ids.length;
        const next = pos + (e.key === "ArrowDown" ? 1 : -1);
        if (next < 0 || next > ids.length) return opts.announce(`${describe()}. That's the ${next < 0 ? "top" : "end"}.`);
        beforeCardId.value = ids[next] ?? null;
        return opts.announce(describe());
      }
      case " ":
      case "Enter": {
        e.preventDefault();
        const to = laneTitle(lane);
        const moved = commit();
        if (moved) opts.announce(`Dropped ${kbLabel} in ${to}.`);
        else if (!refusal.value) opts.announce(`${kbLabel} stays where it was.`);
        reset();
        return;
      }
      case "Escape": {
        e.preventDefault();
        e.stopPropagation();          // inside a modal dialog: close the drag, not the dialog
        cancelKeyboard();
        return;
      }
      case "Tab":
        cancelKeyboard();
        return;
    }
  }

  function cancelKeyboard() {
    if (mode.value !== "keyboard") return;
    opts.announce(`Move cancelled. ${kbLabel} is back in ${laneTitle(fromLane)}.`);
    reset();
  }

  const ctx: TuxKanbanDndContext = {
    draggingId, overLaneId, beforeCardId, refusal, mode, disabled: opts.disabled, pendingFocus,
    beginDrag, onCardKey, cancelKeyboard,
  };
  provide(TUX_KANBAN_DND, ctx);
  return ctx;
}

export function useTuxKanbanDnd(): TuxKanbanDndContext {
  const ctx = inject(TUX_KANBAN_DND, null);
  if (!ctx) throw new Error("TuxKanbanLane and TuxKanbanCard must be used inside TuxKanbanBoard");
  return ctx;
}
</script>

<script setup lang="ts">
/**
 * TuxKanbanBoard — lanes of cards you can drag between, by pointer or by
 * keyboard. Holds no data: it emits ONE `move` intent and the parent updates
 * its own lists (optimistically, or after the server agrees).
 *
 *   <TuxKanbanBoard label="Now / Next / Later" :can-drop="rule" @move="onMove">
 *     <TuxKanbanLane v-for="l in lanes" :key="l.id" :lane-id="l.id" :title="l.title" :count="l.cards.length">
 *       <TuxKanbanCard v-for="c in l.cards" :key="c.id" :card-id="c.id" :lane-id="l.id" :label="c.title" @open="…">
 *         …card body…
 *       </TuxKanbanCard>
 *     </TuxKanbanLane>
 *   </TuxKanbanBoard>
 *
 * Keyboard: Tab to a card, Space lifts it, ←/→ change lane, ↑/↓ change
 * position, Space or Enter drops, Escape cancels. Every step is announced.
 * `canDrop(cardId, toLaneId, fromLaneId)` returns true or the reason a lane
 * refuses the card ("#n still waits on #m"); the lane shows the reason
 * while the drag is over it and the drop is cancelled.
 *
 * Promoted from TTI AI Studio's kanban primitive; shadow-DOM safe (the forge
 * mounts TUX inside a shadow root).
 */

const props = withDefaults(defineProps<{
  /** Accessible name for the board region. */
  label?: string;
  /** Read-only: cards open but never move. */
  disabled?: boolean;
  /** Returns true, or the reason the lane refuses the card. */
  canDrop?: TuxKanbanCanDrop;
  /** Lane width (any CSS length). */
  laneWidth?: string;
}>(), {
  label: "Board",
  disabled: false,
  canDrop: undefined,
  laneWidth: "18rem",
});

const emit = defineEmits<{ move: [m: TuxKanbanMove] }>();

const hostEl = ref<HTMLElement | null>(null);
const boardEl = ref<HTMLElement | null>(null);
const live = ref("");
let clear: ReturnType<typeof setTimeout> | undefined;
function announce(text: string) {
  // Re-set even when the text repeats, so screen readers read it again.
  live.value = "";
  clearTimeout(clear);
  requestAnimationFrame(() => { live.value = text; });
  clear = setTimeout(() => { live.value = ""; }, 8000);
}

provideTuxKanbanDnd({
  boardEl,
  hostEl,
  disabled: toRef(props, "disabled"),
  canDrop: () => props.canDrop,
  announce,
  onMove: (m) => emit("move", m),
});

const hintId = `tux-kanban-hint-${useId()}`;     // SSR-stable (panel finding on tti-ux#61)
</script>

<template>
  <div ref="hostEl" class="tux-kanban" :style="{ '--tux-kanban-lane-width': laneWidth }">
    <div
      ref="boardEl"
      class="tux-kanban-board"
      role="region"
      :aria-label="label"
      :aria-describedby="hintId"
    >
      <slot />
    </div>
    <p :id="hintId" class="tux-kanban__sr">
      Press Enter on a card to open it.<template v-if="!disabled"> To move it, press Space, choose a lane and a position with the arrow keys, then press Space to drop or Escape to cancel.</template>
    </p>
    <div class="tux-kanban__sr" aria-live="assertive" aria-atomic="true">{{ live }}</div>
  </div>
</template>

<style scoped>
.tux-kanban {
  container-type: inline-size;
  container-name: tux-kanban;
  position: relative;
}

.tux-kanban-board {
  display: flex;
  gap: 12px;
  align-items: stretch;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 2px 12px;
  scroll-padding: 0 12px;
}

.tux-kanban-board--dragging,
.tux-kanban-board--dragging * {
  cursor: grabbing !important;
  user-select: none;
  -webkit-user-select: none;
}

/* The pointer-drag ghost (added to the host by useTuxKanbanDnd). */
.tux-kanban :deep(.tux-kanban-ghost) {
  position: absolute;
  z-index: 50;
  margin: 0;
  pointer-events: none;
  opacity: 0.92;
  transform: rotate(1.5deg);
  box-shadow: var(--shadow-lg);
}

.tux-kanban__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Phone width: one lane per screen, snapping. */
@container tux-kanban (max-width: 36rem) {
  .tux-kanban-board {
    scroll-snap-type: x mandatory;
  }
  .tux-kanban-board > :deep(.tux-kanban-lane) {
    scroll-snap-align: start;
    min-width: min(var(--tux-kanban-lane-width), 88cqi);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tux-kanban :deep(.tux-kanban-ghost) { transform: none; }
}
</style>
