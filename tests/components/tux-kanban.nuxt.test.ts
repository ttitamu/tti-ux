// @vitest-environment nuxt
/**
 * TuxKanbanBoard / Lane / Card — the move contract. The board holds no data,
 * so everything is asserted through the one `move` intent it emits, the live
 * region, and the refusal text: keyboard lift/move/drop/cancel, canDrop
 * refusals, "dropped where it already was" emits nothing, read-only boards,
 * Escape never reaching a surrounding dialog, and one pointer drag through
 * the hit-testing path.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, ref } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxKanbanBoard from "../../app/components/TuxKanbanBoard.vue";
import TuxKanbanLane from "../../app/components/TuxKanbanLane.vue";
import TuxKanbanCard from "../../app/components/TuxKanbanCard.vue";
import type { TuxKanbanMove } from "../../app/components/TuxKanbanBoard.vue";

const frame = () => new Promise((r) => setTimeout(r, 40));

function harness(opts: { disabled?: boolean; canDrop?: (c: string, to: string) => true | string } = {}) {
  const moves: TuxKanbanMove[] = [];
  const opened: string[] = [];
  const lanes = ref([
    { id: "now", title: "Now", cards: ["a", "b", "c"] },
    { id: "next", title: "Next", cards: ["d"] },
    { id: "done", title: "Done", cards: [] as string[] },
  ]);
  const Harness = defineComponent({
    setup() {
      return () => h(TuxKanbanBoard, {
        label: "Test board",
        disabled: opts.disabled,
        canDrop: opts.canDrop,
        onMove: (m: TuxKanbanMove) => moves.push(m),
      }, () => lanes.value.map((l) => h(TuxKanbanLane, { key: l.id, laneId: l.id, title: l.title, count: l.cards.length },
        () => l.cards.map((c) => h(TuxKanbanCard, {
          key: c, cardId: c, laneId: l.id, label: `Card ${c.toUpperCase()}`,
          onOpen: (id: string) => opened.push(id),
        }, () => h("span", `Card ${c.toUpperCase()}`))))));
    },
  });
  return { Harness, moves, opened };
}

const card = (w: { find: (s: string) => { element: Element } }, id: string) =>
  w.find(`[data-kanban-card="${id}"] .tux-kanban-card`).element as HTMLElement;
const key = (el: HTMLElement, k: string) => {
  const e = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true });
  el.dispatchEvent(e);
  return e;
};
const live = (w: { find: (s: string) => { text: () => string } }) => w.find('[aria-live="assertive"]').text();

afterEach(() => vi.restoreAllMocks());

describe("TuxKanbanBoard keyboard moves", () => {
  it("Space lifts, → changes lane, Space drops: one move to the end of that lane", async () => {
    const { Harness, moves } = harness();
    const w = await mountSuspended(Harness);
    const a = card(w, "a");
    key(a, " ");
    await frame();
    expect(live(w)).toContain("Picked up Card A");
    key(a, "ArrowRight");
    await frame();
    expect(live(w)).toContain("Next, position 2 of 2");
    key(a, " ");
    expect(moves).toEqual([{ cardId: "a", fromLaneId: "now", toLaneId: "next", beforeCardId: null }]);
  });

  it("↓ moves within the lane: a lands between b and c", async () => {
    const { Harness, moves } = harness();
    const w = await mountSuspended(Harness);
    const a = card(w, "a");
    key(a, " ");
    key(a, "ArrowDown");
    key(a, "Enter");
    expect(moves).toEqual([{ cardId: "a", fromLaneId: "now", toLaneId: "now", beforeCardId: "c" }]);
  });

  it("dropping where it already was emits nothing", async () => {
    const { Harness, moves } = harness();
    const w = await mountSuspended(Harness);
    const b = card(w, "b");
    key(b, " ");
    key(b, " ");
    expect(moves).toEqual([]);
  });

  it("Escape cancels and does not reach a surrounding dialog", async () => {
    const { Harness, moves } = harness();
    const w = await mountSuspended(Harness);
    const outside = vi.fn();
    (w.element as HTMLElement).parentElement?.addEventListener("keydown", outside);
    const a = card(w, "a");
    key(a, " ");
    key(a, "ArrowRight");
    const esc = key(a, "Escape");
    await frame();
    expect(esc.defaultPrevented).toBe(true);
    expect(outside).toHaveBeenCalledTimes(2);            // Space and →, not Escape
    expect(moves).toEqual([]);
    expect(live(w)).toContain("Move cancelled");
  });

  it("a refusing lane says why and the drop is cancelled", async () => {
    const { Harness, moves } = harness({ canDrop: (c, to) => (to === "next" ? `${c} still waits on #9` : true) });
    const w = await mountSuspended(Harness);
    const a = card(w, "a");
    key(a, " ");
    key(a, "ArrowRight");
    await frame();
    expect(w.find('[data-kanban-lane="next"] .tux-kanban-lane__refusal').text()).toBe("a still waits on #9");
    expect(live(w)).toContain("Can't drop here: a still waits on #9");
    key(a, " ");
    await frame();
    expect(moves).toEqual([]);
    expect(live(w)).toContain("Not moved: a still waits on #9");
  });

  it("read-only: Space does nothing, Enter and click open", async () => {
    const { Harness, moves, opened } = harness({ disabled: true });
    const w = await mountSuspended(Harness);
    const a = card(w, "a");
    key(a, " ");
    key(a, "ArrowRight");
    key(a, " ");
    expect(moves).toEqual([]);
    key(a, "Enter");
    a.click();
    expect(opened).toEqual(["a", "a"]);
  });
});

describe("TuxKanbanBoard pointer moves", () => {
  it("a drag over another lane emits one move, and its click doesn't open the card", async () => {
    const { Harness, moves, opened } = harness();
    // Attached, like a real page: the click squelch listens on window.
    const w = await mountSuspended(Harness, { attachTo: document.body });
    const a = card(w, "a");
    const nextLane = w.find('[data-kanban-lane="next"]').element;
    // Hit-testing asks the card's root node; point every lookup at the Next lane.
    // (jsdom has no elementFromPoint, so it is defined for this test only.)
    const root = a.getRootNode() as Document & { elementFromPoint?: unknown };
    const had = Object.getOwnPropertyDescriptor(root, "elementFromPoint");
    Object.defineProperty(root, "elementFromPoint", { configurable: true, value: () => nextLane });
    a.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0, clientX: 10, clientY: 10 }));
    window.dispatchEvent(new PointerEvent("pointermove", { clientX: 60, clientY: 12 }));
    await frame();
    expect(w.find('[data-kanban-lane="next"]').classes()).toContain("tux-kanban-lane--over");
    window.dispatchEvent(new PointerEvent("pointerup", { clientX: 60, clientY: 12 }));
    a.click();
    if (had) Object.defineProperty(root, "elementFromPoint", had);
    else delete root.elementFromPoint;
    expect(moves).toEqual([{ cardId: "a", fromLaneId: "now", toLaneId: "next", beforeCardId: null }]);
    expect(opened).toEqual([]);
    w.unmount();
  });

  it("a click without movement opens the card and moves nothing", async () => {
    const { Harness, moves, opened } = harness();
    const w = await mountSuspended(Harness);
    const a = card(w, "a");
    a.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0, clientX: 10, clientY: 10 }));
    window.dispatchEvent(new PointerEvent("pointerup", { clientX: 11, clientY: 10 }));
    a.click();
    expect(moves).toEqual([]);
    expect(opened).toEqual(["a"]);
  });
});
