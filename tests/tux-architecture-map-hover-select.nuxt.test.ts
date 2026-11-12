// @vitest-environment nuxt
/**
 * Four interaction faults of the mounted map (#205): a hover-raised wire label
 * over the hovered card and its `+`, an empty wire popover, a selection that
 * slides the stage, and a blast radius that fades the stage without saying so.
 *
 * The test DOM does no layout, so where a position matters the tests read the
 * rectangles the component computed and the inline styles it wrote.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import { DEFAULT_TTI_LEVEL_MODEL } from "../packages/diagrams/app/utils/tuxArchitectureMapSample";

type SetupState = Record<string, any>;
type Box = { x: number; y: number; w: number; h: number };

const SFC = readFileSync(
  join(process.cwd(), "packages/diagrams/app/components/TuxArchitectureMap.vue"),
  "utf8",
);
const STYLE = SFC.slice(SFC.lastIndexOf("<style")).replace(/\/\*[\s\S]*?\*\//g, "");

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];
afterEach(() => {
  for (const w of mounted.splice(0)) w.unmount();
});

async function mountMap(props: Record<string, unknown>) {
  const wrapper = await mountSuspended(TuxArchitectureMap, { props });
  mounted.push(wrapper);
  await nextTick();
  await nextTick();
  const state = (wrapper.vm as unknown as { $: { setupState: SetupState } }).$.setupState;
  const card = (id: string) => wrapper.find(`.tux-map__el[data-id="${id}"]`).element as HTMLElement;
  const hover = async (id: string) => {
    card(id).dispatchEvent(new window.MouseEvent("pointerover", { bubbles: true }));
    await nextTick();
    await nextTick();
  };
  return { wrapper, state, card, hover };
}

const overlaps = (a: Box, b: Box) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

describe("TuxArchitectureMap: a hover-raised wire label and the hovered card (#205)", () => {
  /**
   * Where a raised label is drawn, from what the component wrote on it. At rest a label is centred
   * on `left`/`top`. Raised beside the lit card it carries `data-clear` and three custom
   * properties, which the stylesheet's `.tux-map__lab[data-clear]` rule turns into its position.
   */
  function drawnBox(el: HTMLElement, lbl: Box): Box {
    if (!el.hasAttribute("data-clear")) return { x: lbl.x, y: lbl.y, w: lbl.w, h: lbl.h };
    const left = Number.parseFloat(el.style.getPropertyValue("--tux-map-lab-left"));
    const top = Number.parseFloat(el.style.getPropertyValue("--tux-map-lab-top"));
    const shift = /translate\((-?[\d.]+)%,\s*(-?[\d.]+)%\)/.exec(el.style.getPropertyValue("--tux-map-lab-shift"))!;
    return {
      x: left + (Number(shift[1]) / 100) * lbl.w,
      y: top + (Number(shift[2]) / 100) * lbl.h,
      w: lbl.w,
      h: lbl.h,
    };
  }

  it("reads the place of a moved label from the properties the component sets", () => {
    const rule = /\.tux-map__lab\[data-clear\]\s*\{([^}]*)\}/.exec(STYLE)?.[1] ?? "";
    expect(rule).toMatch(/left:\s*var\(--tux-map-lab-left\)\s*!important/);
    expect(rule).toMatch(/top:\s*var\(--tux-map-lab-top\)\s*!important/);
    expect(rule).toMatch(/transform:\s*var\(--tux-map-lab-shift\)/);
  });

  it("draws no raised label over the card the pointer is on, on a level with long labels", async () => {
    const { wrapper, state, hover } = await mountMap({ model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2 });
    const labelById = new Map<string, Box & { from: string; to: string }>(
      state.routedSvg.labels.map((l: Box & { id: string }) => [l.id, l]),
    );
    const cards = state.stageData.els.map((e: { id: string }) => e.id) as string[];
    let raised = 0;
    const over: string[] = [];
    for (const id of cards) {
      await hover(id);
      const rect = state.stageData.rects[id] as Box;
      const labs = wrapper.findAll(".tux-map__lab.tux-map__lab--on");
      for (const lab of labs) {
        const el = lab.element as HTMLElement;
        const lbl = [...labelById.values()].find(
          (l) => l.from === el.dataset.from && l.to === el.dataset.to,
        )!;
        raised++;
        if (overlaps(drawnBox(el, lbl), rect)) over.push(`${id}: ${el.textContent?.trim()}`);
      }
    }
    // the sample's Level 2 has labels that land on their own cards: without them this proves nothing
    expect(raised).toBeGreaterThan(10);
    const restingOverEnd = state.routedSvg.labels.filter(
      (l: Box & { from: string; to: string }) =>
        [l.from, l.to].some((end) => state.stageData.rects[end] && overlaps(l, state.stageData.rects[end])),
    );
    expect(restingOverEnd.length).toBeGreaterThan(0);
    expect(over).toEqual([]);
  });

  it("puts a label back where its wire is when the pointer leaves the card", async () => {
    const { wrapper, state, hover } = await mountMap({ model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2 });
    const moved = (state.routedSvg.labels as (Box & { from: string; to: string })[]).find((l) =>
      [l.from, l.to].some((end) => state.stageData.rects[end] && overlaps(l, state.stageData.rects[end])),
    )!;
    const end = overlaps(moved, state.stageData.rects[moved.from] ?? { x: -1, y: -1, w: 0, h: 0 }) ? moved.from : moved.to;
    await hover(end);
    const sel = `.tux-map__lab[data-from="${moved.from}"][data-to="${moved.to}"]`;
    const lab = wrapper.find(sel).element as HTMLElement;
    expect(lab.hasAttribute("data-clear")).toBe(true);
    wrapper.find(".tux-map__stage").element.dispatchEvent(new window.MouseEvent("pointerleave"));
    await nextTick();
    expect(lab.hasAttribute("data-clear")).toBe(false);
    expect(lab.style.getPropertyValue("--tux-map-lab-left")).toBe("");
    expect(lab.classList.contains("tux-map__lab--on")).toBe(false);
    expect(lab.style.left).toBe(`${moved.x + moved.w / 2}px`);
  });

  it("clears the card as it is drawn: hovered, a card grows to show all its text", async () => {
    const { wrapper, state, card, hover } = await mountMap({ model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2 });
    const rects = state.stageData.rects as Record<string, Box>;
    // a label that rests clear of its card, within 90 px below it
    const below = (state.routedSvg.labels as (Box & { from: string; to: string })[])
      .flatMap((l) => [l.from, l.to].map((end) => ({ l, end, r: rects[end] })))
      .find(
        ({ l, r }) =>
          r && l.y >= r.y + r.h + 8 && l.y < r.y + r.h + 90 && l.x < r.x + r.w && l.x + l.w > r.x,
      )!;
    expect(below).toBeTruthy();
    const sel = `.tux-map__lab[data-from="${below.l.from}"][data-to="${below.l.to}"]`;
    const lab = wrapper.find(sel).element as HTMLElement;
    await hover(below.end);
    expect(lab.classList.contains("tux-map__lab--on")).toBe(true);
    expect(lab.hasAttribute("data-clear")).toBe(false);
    wrapper.find(".tux-map__stage").element.dispatchEvent(new window.MouseEvent("pointerleave"));
    await nextTick();
    // the test DOM lays nothing out: say how tall the hovered card is drawn
    const grown = below.r.h + 120;
    Object.defineProperty(card(below.end), "offsetHeight", { configurable: true, value: grown });
    await hover(below.end);
    expect(lab.hasAttribute("data-clear")).toBe(true);
    expect(overlaps(drawnBox(lab, below.l), { ...below.r, h: grown })).toBe(false);
  });

  it("stacks every card's + above every wire label, raised or under the pointer", () => {
    const z = (selector: string): number[] => {
      const out: number[] = [];
      const re = /([^{}]+)\{([^{}]*)\}/g;
      for (let m = re.exec(STYLE); m; m = re.exec(STYLE)) {
        if (!m[1]!.split(",").some((s) => s.trim() === selector)) continue;
        const zi = /z-index:\s*(\d+)/.exec(m[2]!);
        if (zi) out.push(Number(zi[1]));
      }
      return out;
    };
    const badge = z(".tux-map__el-zb");
    const labels = [
      ...z(".tux-map__lab"),
      ...z(".tux-map__lab--on"),
      ...z(".tux-map__lab:hover"),
      ...z('.tux-map__lab[aria-expanded="true"]'),
    ];
    expect(badge).toHaveLength(1);
    expect(labels.length).toBeGreaterThanOrEqual(3);
    expect(badge[0]).toBeGreaterThan(Math.max(...labels));
  });
});
