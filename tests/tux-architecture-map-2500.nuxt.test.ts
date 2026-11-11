// @vitest-environment nuxt
/**
 * One mounted run of a 2,500-symbol model (#166): the view of a 60-symbol file
 * shows the cards the model implies, the compact list opens by itself above
 * `denseListThreshold` (40) and not at or below it, and a hover and a selection
 * each change the page without the component mounting again.
 *
 * The model comes from the seeded generator the map benchmark uses (no
 * `Math.random`; the same bytes on every machine), asked for a little over
 * 2,500 symbols so the count is not under it. The real
 * producer output in `packages/diagrams/tests/fixtures` holds 2,048 symbols,
 * under the size this test is about, and padding it would no longer be a
 * producer's output.
 *
 * Everything is read from the rendered page and driven through props, clicks
 * and pointer events. The component is mounted once; every test below uses
 * that one mount, in order.
 *
 * The DOM is jsdom, so the milliseconds are not a browser's. The two timing
 * checks compare a hover and a selection with work measured in the same run on
 * the same machine: the first mount, and a move to another view and back.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { defineComponent, h, nextTick, reactive } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import {
  buildMapParentIndex,
  collapseModelSubgraphs,
  levelForFocus,
  sanitizeMapModel,
  type TuxMapLevelElement,
} from "../packages/diagrams/app/utils/tuxArchitectureMap";
import { buildSyntheticMapModel } from "../packages/diagrams/tests/support/mapSyntheticModels";

const SYMBOLS = 2500;
/** What the generator is asked for. It plans whole folders, so it lands near the figure, not on it. */
const SYMBOLS_ASKED = 2600;
const CARDS_IN_VIEW = 60;
/** The component's default `denseListThreshold`. */
const DEFAULT_THRESHOLD = 40;

/**
 * The timing bounds, each a share of work measured in the same run.
 *
 * - Against the first mount, which reads the whole model: a hover or a
 *   selection that mounted again, or read the model again, would cost about
 *   one mount. On a laptop a hover is under 0.01 of it and a selection under 0.03.
 * - Against a move to another view and back, which builds and routes two
 *   stages: a hover that built the stage again would cost at least half of
 *   it, on top of its own work. A selection also fills the details panel,
 *   so its bound is the whole round trip.
 */
const MAX_SHARE_OF_MOUNT = 0.1;
const HOVER_MAX_SHARE_OF_VIEW_CHANGE = 0.5;
const SELECTION_MAX_SHARE_OF_VIEW_CHANGE = 1;
const SAMPLES = 7;

type Mounted = Awaited<ReturnType<typeof mountSuspended>>;

const g = buildSyntheticMapModel({ symbols: SYMBOLS_ASKED, cardsPerView: CARDS_IN_VIEW });

/** The level the component gives a focus id, from the package's own exported helpers. */
const collapsed = collapseModelSubgraphs(sanitizeMapModel(g.model).model);
const parentOf = buildMapParentIndex(collapsed.model);
const viewLevel = (id: string) => levelForFocus(collapsed.aliases[id] ?? id, collapsed.model, parentOf);

/** With planned work hidden (the default), the cards a view of `id` holds. */
const shownChildren = (id: string): TuxMapLevelElement[] =>
  (g.model.subgraphs?.[id]?.elements ?? []).filter((e) => e.status !== "planned");

const bigFileId = g.focus.fileId;
const bigCards = shownChildren(bigFileId);
/** A file beside it, in the same folder, whose symbols are in the model and number 40 or fewer. */
const smallFileId = (g.model.subgraphs?.[g.focus.folderId]?.elements ?? [])
  .map((e) => e.id)
  .find((id) => {
    const n = shownChildren(id).length;
    return id !== bigFileId && n > 0 && n <= DEFAULT_THRESHOLD;
  })!;
const smallCards = shownChildren(smallFileId);

const ms = (n: number) => `${n.toFixed(2)} ms`;

describe("TuxArchitectureMap: one mount of a 2,500-symbol model (#166)", () => {
  const host = reactive({
    level: viewLevel(bigFileId),
    focus: bigFileId as string | null,
    denseListThreshold: undefined as number | undefined,
  });
  let mounts = 0;
  let unmounts = 0;
  let wrapper: Mounted;
  let root: Element;
  let mountMs = 0;
  let restageMs = Number.POSITIVE_INFINITY;

  const Host = defineComponent({
    setup: () => () =>
      h(TuxArchitectureMap, {
        model: g.model,
        level: host.level,
        focus: host.focus,
        denseListThreshold: host.denseListThreshold,
        "onUpdate:level": (v: number) => (host.level = v),
        "onUpdate:focus": (v: string | null) => (host.focus = v),
        onVnodeMounted: () => mounts++,
        onVnodeUnmounted: () => unmounts++,
      }),
  });

  const settle = async () => {
    await nextTick();
    await nextTick();
  };
  const el = () => wrapper.element as HTMLElement;
  const q = <T extends Element = HTMLElement>(sel: string) => el().querySelector<T>(sel);
  const qa = <T extends Element = HTMLElement>(sel: string) => [...el().querySelectorAll<T>(sel)];
  const stage = () => q(".tux-map__stage")!;
  /** The cards of the view itself: not the smaller cards for what lies outside it. */
  const innerCards = () => qa(".tux-map__stage .tux-map__el[data-id]:not(.tux-map__el--mini)");
  const card = (id: string) => innerCards().find((c) => c.dataset.id === id)!;
  const listOpen = () => q(".tux-map__list") !== null;
  const listIds = () => qa(".tux-map__list [data-list-id]").map((b) => b.dataset.listId);
  const modeButton = (name: "Diagram" | "List") =>
    qa<HTMLButtonElement>(".tux-map__seg button").find((b) => b.textContent?.trim() === name)!;
  const panelOpen = () => q(".tux-map__panel--open") !== null;
  const dimmed = () => stage().classList.contains("tux-map__stage--dim");
  const litIds = () => qa(".tux-map__stage .tux-map__el--lit").map((c) => c.dataset.id);

  const goTo = async (fileId: string) => {
    host.level = viewLevel(fileId);
    host.focus = fileId;
    await settle();
  };
  const hover = async (target: Element) => {
    target.dispatchEvent(new window.MouseEvent("pointerover", { bubbles: true }));
    await settle();
  };
  const click = async (target: HTMLElement) => {
    target.click();
    await settle();
  };
  const timed = async (fn: () => Promise<void>) => {
    const t0 = performance.now();
    await fn();
    return performance.now() - t0;
  };
  const expectSameMount = () => {
    expect(mounts, "mounted once").toBe(1);
    expect(unmounts, "never unmounted").toBe(0);
    expect(wrapper.element, "the same root element").toBe(root);
    expect(root.classList.contains("tux-map"), "the root is the map").toBe(true);
  };

  beforeAll(async () => {
    const t0 = performance.now();
    wrapper = await mountSuspended(Host);
    await settle();
    mountMs = performance.now() - t0;
    root = wrapper.element;
  });

  afterAll(() => {
    wrapper?.unmount();
  });

  it("is given a model of at least 2,500 symbols, a 60-symbol view and a small view beside it", () => {
    expect(g.counts.symbols).toBeGreaterThanOrEqual(SYMBOLS);
    const inModel = Object.values(g.model.subgraphs ?? {})
      .filter((sg) => sg.stratum === "Symbols")
      .reduce((n, sg) => n + sg.elements.length, 0);
    expect(inModel).toBe(g.counts.symbols);
    expect(bigCards.length).toBe(CARDS_IN_VIEW);
    expect(bigCards.length).toBeGreaterThan(DEFAULT_THRESHOLD);
    expect(smallFileId, "a file with 40 symbols or fewer in the same folder").toBeTruthy();
    expect(smallCards.length).toBeGreaterThan(0);
    expect(smallCards.length).toBeLessThanOrEqual(DEFAULT_THRESHOLD);
    expect(viewLevel(bigFileId)).toBeGreaterThanOrEqual(6);
    expect(viewLevel(smallFileId)).toBe(viewLevel(bigFileId));
  });

  it("shows one card per symbol of the file, and opens the list by itself above 40", () => {
    expectSameMount();
    expect(innerCards().map((c) => c.dataset.id).sort()).toEqual(bigCards.map((e) => e.id).sort());
    expect(innerCards()).toHaveLength(bigCards.length);

    expect(listOpen(), "60 cards is more than 40").toBe(true);
    expect(modeButton("List").getAttribute("aria-pressed")).toBe("true");
    expect(modeButton("Diagram").getAttribute("aria-pressed")).toBe("false");
    expect(q(".tux-map__dense-note")?.textContent).toContain(`${bigCards.length} items`);
    // Every card of the view is a row of the list
    const rows = new Set(listIds());
    for (const e of bigCards) expect(rows.has(e.id), `${e.id} is listed`).toBe(true);
  });

  it("keeps the diagram at the threshold and opens the list one above it", async () => {
    // Exactly at the threshold is not "more than"
    host.denseListThreshold = bigCards.length;
    await settle();
    expect(listOpen(), `${bigCards.length} cards, threshold ${bigCards.length}`).toBe(false);
    expect(q(".tux-map__dense-note")).toBeNull();
    expect(modeButton("Diagram").getAttribute("aria-pressed")).toBe("true");

    host.denseListThreshold = bigCards.length - 1;
    await settle();
    expect(listOpen(), `${bigCards.length} cards, threshold ${bigCards.length - 1}`).toBe(true);

    host.denseListThreshold = undefined;
    await settle();
    expect(listOpen()).toBe(true);
    expectSameMount();
  });

  it("does not open the list on a view of 40 cards or fewer, and opens it again on the way back", async () => {
    const out = await timed(() => goTo(smallFileId));
    expect(innerCards().map((c) => c.dataset.id).sort()).toEqual(smallCards.map((e) => e.id).sort());
    expect(listOpen(), `${smallCards.length} cards`).toBe(false);
    expect(q(".tux-map__dense-note")).toBeNull();

    const back = await timed(() => goTo(bigFileId));
    expect(innerCards()).toHaveLength(bigCards.length);
    expect(listOpen()).toBe(true);
    restageMs = Math.min(restageMs, out + back);

    // Twice more for the baseline the timing checks read: the fastest round trip
    for (let i = 0; i < 2; i++) {
      const again = (await timed(() => goTo(smallFileId))) + (await timed(() => goTo(bigFileId)));
      restageMs = Math.min(restageMs, again);
    }
    expectSameMount();
  });

  it("answers a hover and a selection on the 60-card diagram without mounting again, each well under a mount and a view change", async () => {
    // The reader's own way out of the list
    const anyway = qa<HTMLButtonElement>(".tux-map__dense-note button")[0]!;
    await click(anyway);
    expect(listOpen()).toBe(false);
    expect(innerCards()).toHaveLength(bigCards.length);

    const cardsBefore = innerCards();
    const target = card(g.focus.symbolId);
    const other = cardsBefore.find((c) => c !== target)!;
    expect(target, "the symbol other parts depend on has a card").toBeTruthy();
    expect(dimmed()).toBe(false);
    expect(panelOpen()).toBe(false);

    // --- Hover ---
    await hover(target); // untimed: the first highlight indexes the stage
    expect(dimmed(), "a hover dims the rest of the stage").toBe(true);
    expect(litIds()).toContain(g.focus.symbolId);
    expect(litIds().length).toBeLessThan(qa(".tux-map__stage .tux-map__el[data-id]").length);
    await hover(stage());
    expect(dimmed(), "leaving the card puts the stage back").toBe(false);

    const hoverSamples: number[] = [];
    for (let i = 0; i < SAMPLES; i++) {
      hoverSamples.push(await timed(() => hover(i % 2 ? other : target)));
      expect(dimmed()).toBe(true);
      await hover(stage());
    }
    expect(dimmed()).toBe(false);
    expectSameMount();
    expect(innerCards(), "the same card elements, in the same order").toEqual(cardsBefore);

    // --- Selection ---
    const selectSamples: number[] = [];
    for (let i = 0; i < SAMPLES; i++) {
      selectSamples.push(await timed(() => click(target)));
      expect(target.getAttribute("aria-pressed")).toBe("true");
      expect(panelOpen(), "a selection opens the details panel").toBe(true);
      await click(target);
      expect(target.getAttribute("aria-pressed")).toBe("false");
      expect(panelOpen()).toBe(false);
    }
    await click(target);
    expect(qa(".tux-map__stage .tux-map__el[aria-pressed='true']").map((c) => c.dataset.id)).toEqual([
      g.focus.symbolId,
    ]);
    const name = bigCards.find((e) => e.id === g.focus.symbolId)!.name;
    expect(q(".tux-map__panel--open")?.textContent).toContain(name);
    expect(dimmed(), "a selection dims the rest of the stage").toBe(true);
    await click(target);
    expectSameMount();
    expect(innerCards(), "the same card elements, in the same order").toEqual(cardsBefore);

    // --- Timing: the fastest of several, against work measured in this run ---
    const hoverMs = Math.min(...hoverSamples);
    const selectMs = Math.min(...selectSamples);
    const share = (part: number, whole: number) => (part / whole).toFixed(3);
    console.info(
      `[map 2,500] symbols ${g.counts.symbols}, cards in view ${bigCards.length}: ` +
        `mount ${ms(mountMs)}, view change and back ${ms(restageMs)}, ` +
        `hover ${ms(hoverMs)} (${share(hoverMs, mountMs)} of the mount, ${share(hoverMs, restageMs)} of the view change), ` +
        `selection ${ms(selectMs)} (${share(selectMs, mountMs)} of the mount, ${share(selectMs, restageMs)} of the view change); ` +
        `fastest of ${SAMPLES}`,
    );
    expect(hoverMs, `hover ${ms(hoverMs)} against a mount of ${ms(mountMs)}`).toBeLessThan(
      mountMs * MAX_SHARE_OF_MOUNT,
    );
    expect(selectMs, `selection ${ms(selectMs)} against a mount of ${ms(mountMs)}`).toBeLessThan(
      mountMs * MAX_SHARE_OF_MOUNT,
    );
    expect(hoverMs, `hover ${ms(hoverMs)} against a view change and back of ${ms(restageMs)}`).toBeLessThan(
      restageMs * HOVER_MAX_SHARE_OF_VIEW_CHANGE,
    );
    expect(selectMs, `selection ${ms(selectMs)} against a view change and back of ${ms(restageMs)}`).toBeLessThan(
      restageMs * SELECTION_MAX_SHARE_OF_VIEW_CHANGE,
    );
  });
});
