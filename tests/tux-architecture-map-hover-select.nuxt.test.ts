// @vitest-environment nuxt
/**
 * Interaction faults of the mounted map (#205): an empty wire popover, a
 * selection that slides the stage, and a blast radius that fades the stage
 * without saying so; and the wire labels at the ports, which a hover lights
 * where they are (#210).
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

describe("TuxArchitectureMap: wire labels at the ports (#210)", () => {
  type Lbl = Box & { id: string; from: string; to: string; t1: string; t2: string; full: string; end?: string; side?: string; forced: boolean };
  const labelEls = (wrapper: Awaited<ReturnType<typeof mountMap>>["wrapper"]) =>
    wrapper.findAll("button.tux-map__lab").map((w) => w.element as HTMLElement);
  /** What a label's place is made of: the inline position and the side the stylesheet hangs it by. */
  const place = (el: HTMLElement) =>
    [el.style.left, el.style.top, el.style.maxWidth, el.dataset.side, el.style.transform, el.getAttribute("style")].join("|");

  it("draws a label at both ends of a wire, at its ports and over no card", async () => {
    const { wrapper, state } = await mountMap({ model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2 });
    const labels = state.routedSvg.labels as Lbl[];
    const rects = state.stageData.rects as Record<string, Box & { bound?: boolean }>;
    // the sample's Level 2 has a technology on every relationship: a label at each end of each wire
    const rel = labels.find((l) => l.from === "c-api" && l.to === "c-db" && l.t1)!;
    const els = labelEls(wrapper).filter((el) => el.dataset.from === "c-api" && el.dataset.to === "c-db");
    expect(els.map((el) => [el.dataset.end, el.textContent?.replace(/\s+/g, " ").trim()])).toEqual([
      ["from", "Reads & writes"],
      ["to", "[SQL 5432]"],
    ]);
    expect(rel.full).toBe("Reads & writes [SQL 5432]");
    const ends = new Map<string, Set<string>>();
    for (const el of labelEls(wrapper)) {
      const key = `${el.dataset.from}>${el.dataset.to}`;
      ends.set(key, (ends.get(key) ?? new Set()).add(el.dataset.end || ""));
    }
    expect([...ends.values()].filter((e) => e.has("from") && e.has("to")).length).toBeGreaterThan(15);
    // each button is placed on the box the router kept clear: hung by the edge that faces its card
    for (const [i, el] of labelEls(wrapper).entries()) {
      const l = labels[i]!;
      expect(el.dataset.from).toBe(l.from);
      const left = l.side === "l" ? l.x + l.w : l.side === "r" ? l.x : l.x + l.w / 2;
      expect(el.style.left).toBe(`${left}px`);
      expect(el.style.maxWidth).toBe(`${l.w}px`);
      for (const r of Object.values(rects)) if (!r.bound) expect(overlaps(l, r), `${l.id}`).toBe(false);
    }
    expect(STYLE).toMatch(/\.tux-map__lab\[data-side="r"\]\s*\{\s*transform:\s*translate\(0,\s*-50%\)/);
    expect(STYLE).toMatch(/\.tux-map__lab\[data-side="l"\]\s*\{\s*transform:\s*translate\(-100%,\s*-50%\)/);
  });

  it("names each label with the whole text, which the short text drawn leaves out", async () => {
    const { wrapper } = await mountMap({ model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2 });
    const [verb, tech] = labelEls(wrapper).filter((el) => el.dataset.from === "p-users" && el.dataset.to === "c-edge");
    expect(verb!.textContent?.trim()).toBe("Uses portal…");
    expect(verb!.getAttribute("aria-label")).toBe("Inspect wire Uses portal & API [HTTPS 443]");
    expect(verb!.getAttribute("title")).toBe("Uses portal & API [HTTPS 443]");
    expect(verb!.hasAttribute("tabindex")).toBe(false);
    expect(tech!.getAttribute("aria-label")).toBe("Inspect wire Uses portal & API [HTTPS 443], at its target");
    // the technology label opens the same popover: it is clickable, and out of the Tab order
    expect(tech!.getAttribute("tabindex")).toBe("-1");
    const planned = labelEls(wrapper).find((el) => el.dataset.from === "c-workers" && el.dataset.to === "c-sandbox" && el.dataset.end === "from");
    expect(planned).toBeUndefined();
    const { wrapper: shown } = await mountMap({ model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2, initialShowPlanned: true });
    const p = labelEls(shown).find((el) => el.dataset.from === "c-workers" && el.dataset.to === "c-sandbox" && el.dataset.end === "from")!;
    // crowded at its port, the planned label is cut to 6 characters
    expect(p.textContent?.trim()).toBe("Dispa…");
    expect(p.getAttribute("aria-label")).toBe("Inspect wire Dispatches plugins [gRPC] (planned)");
    expect(p.hasAttribute("data-planned")).toBe(true);
  });

  it("lights a hovered card's labels where they are: emphasis, and no move", async () => {
    const { wrapper, state, hover } = await mountMap({ model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2 });
    const els = labelEls(wrapper);
    const atRest = els.map(place);
    const cards = state.stageData.els.map((e: { id: string }) => e.id) as string[];
    let lit = 0;
    let shownHidden = 0;
    for (const id of cards) {
      await hover(id);
      for (const [i, el] of els.entries()) {
        const mine = el.dataset.from === id || el.dataset.to === id;
        expect(el.classList.contains("tux-map__lab--on"), `${id}: ${el.dataset.from} > ${el.dataset.to}`).toBe(mine);
        expect(place(el), `${id}: ${el.dataset.from} > ${el.dataset.to}`).toBe(atRest[i]);
        if (mine) lit++;
        if (mine && el.dataset.forced === "1") shownHidden++;
      }
    }
    expect(lit).toBeGreaterThan(40);
    // a label hidden at rest is drawn while its card is lit, at the port it was kept at
    expect(shownHidden).toBeGreaterThan(0);
    wrapper.find(".tux-map__stage").element.dispatchEvent(new window.MouseEvent("pointerleave"));
    await nextTick();
    expect(els.filter((el) => el.classList.contains("tux-map__lab--on"))).toEqual([]);
    expect(els.map(place)).toEqual(atRest);
    // the stylesheet moves no label: no rule sets a label's left, top or transform but by its side
    expect(STYLE).not.toMatch(/data-clear|--tux-map-lab-left/);
    const on = /\.tux-map__lab--on\s*\{([^}]*)\}/.exec(STYLE)?.[1] ?? "";
    expect(on).toMatch(/border-color:\s*var\(--brand-primary\)/);
    expect(on).not.toMatch(/left|top|transform/);
  });

  it("stacks every card's + above every wire label, lit or under the pointer", () => {
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

describe("TuxArchitectureMap: what a wire's popover says (#205)", () => {
  const c4Model = {
    schema: "tux-map/1",
    issueBaseUrl: "https://example.org/issues",
    level1: {
      title: "x",
      elements: [
        { id: "p-ops", kind: "person", name: "Operators", at: [0, 1] },
        { id: "sys", kind: "system", name: "Platform", at: [1, 1] },
        { id: "x-mail", kind: "external", name: "Mail relay", at: [2, 1] },
        { id: "x-plain", kind: "external", name: "Archive", at: [2, 2] },
      ],
      rels: [
        { from: "p-ops", to: "sys", label: "Operates", tech: "HTTPS" },
        { from: "sys", to: "x-mail", label: "Sends notices", tech: "SMTP / TLS", status: "planned", roadmap: [104, 112] },
        { from: "sys", to: "x-plain", label: "Archives to" },
      ],
    },
    level2: { boundary: "sys", elements: [{ id: "c-app", kind: "container", name: "App", at: [1, 1] }], rels: [] },
    level3: {},
    level4: { groups: [], nodes: [], links: [] },
  };

  async function openPopover(props: Record<string, unknown>, from: string, to: string) {
    const m = await mountMap(props);
    const label = m.wrapper.find(`button.tux-map__lab[data-from="${from}"][data-to="${to}"]`);
    expect(label.exists()).toBe(true);
    await label.trigger("click");
    await nextTick();
    const pop = m.wrapper.find('.tux-map__wire-pop[role="dialog"]');
    expect(pop.exists()).toBe(true);
    return { ...m, pop };
  }
  const facts = (pop: { findAll: (s: string) => { text: () => string }[] }) =>
    Object.fromEntries(
      pop.findAll(".tux-map__wire-pop-facts dt").map((dt, i) => [
        dt.text(),
        pop.findAll(".tux-map__wire-pop-facts dd")[i]!.text().replace(/\s+/g, " "),
      ]),
    );

  it("shows a relationship's label and technology, and says the model lists no code for it", async () => {
    const { pop } = await openPopover({ model: c4Model, initialLevel: 1, initialFocus: null }, "p-ops", "sys");
    expect(pop.find(".tux-map__wire-pop-title").text().replace(/\s+/g, " ")).toBe("Operators → Platform");
    expect(facts(pop)).toEqual({ Relationship: "Operates", Over: "HTTPS" });
    expect(pop.find(".tux-map__wire-pop-none").text()).toBe("The model lists no code references for this link.");
    expect(pop.find(".tux-map__wire-pop-list").exists()).toBe(false);
  });

  it("shows a planned relationship's status and its roadmap items as links", async () => {
    const { pop } = await openPopover(
      { model: c4Model, initialLevel: 1, initialFocus: null, initialShowPlanned: true },
      "sys",
      "x-mail",
    );
    expect(facts(pop)).toEqual({
      Relationship: "Sends notices",
      Over: "SMTP / TLS",
      Status: "Planned",
      Roadmap: "#104 #112",
    });
    expect(pop.findAll(".tux-map__wire-pop-facts a").map((a) => a.attributes("href"))).toEqual([
      "https://example.org/issues/104",
      "https://example.org/issues/112",
    ]);
  });

  it("shows the one field a bare relationship has", async () => {
    const { pop } = await openPopover({ model: c4Model, initialLevel: 1, initialFocus: null }, "sys", "x-plain");
    expect(facts(pop)).toEqual({ Relationship: "Archives to" });
    expect(pop.find(".tux-map__wire-pop-none").exists()).toBe(true);
  });

  it("is never an empty box on the sample model: every Level 1 and Level 2 wire says something", async () => {
    for (const level of [1, 2]) {
      const { wrapper } = await mountMap({ model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: level });
      const labels = wrapper.findAll("button.tux-map__lab");
      expect(labels.length).toBeGreaterThan(3);
      for (const label of labels) {
        await label.trigger("click");
        await nextTick();
        const pop = wrapper.find(".tux-map__wire-pop");
        const body = pop.text().replace(pop.find(".tux-map__wire-pop-hdr").text(), "").trim();
        expect(body, `${level}: ${label.text()}`).not.toBe("");
        await label.trigger("click");
        await nextTick();
      }
    }
  });

  it("keeps the code links of a lifted wire, and does not say there are none", async () => {
    const model = {
      level1: { elements: [{ id: "sys", kind: "system", name: "System" }], rels: [] },
      level2: { boundary: "sys", elements: [{ id: "c-app", kind: "container", name: "App" }], rels: [] },
      level3: {
        "c-app": [
          { id: "comp-ui", kind: "component", name: "UI Layer" },
          { id: "comp-db", kind: "component", name: "DB Layer" },
        ],
      },
      level4: { groups: [], nodes: [], links: [] },
      links: [
        { from: "comp-ui", to: "comp-db", kind: "imports", at: "ui/repo.ts:14" },
        { from: "comp-ui", to: "comp-db", kind: "calls", at: "ui/repo.ts:42" },
      ],
    };
    const { pop } = await openPopover({ model, initialLevel: 3, initialFocus: "c-app" }, "comp-ui", "comp-db");
    expect(pop.find(".tux-map__wire-pop-sum").text()).toContain("imports it 1");
    expect(pop.findAll(".tux-map__wire-pop-list li")).toHaveLength(2);
    expect(pop.find(".tux-map__wire-pop-none").exists()).toBe(false);
  });
});

describe("TuxArchitectureMap: selecting a card leaves the stage where it is (#205)", () => {
  // The test DOM gives the viewport no width, so the component keeps its 1280 px default, and
  // the details panel no width, so it counts 380 px: 864 px of the stage are clear of the panel.
  const FREE = 1280 - 380 - 36;

  async function mountLevel2() {
    const m = await mountMap({ model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2 });
    // The component asks the panel's computed position whether it overlays the map (a narrow map
    // puts it below). The test DOM applies no stylesheet, so say what the wide layout's rule says.
    (m.wrapper.find(".tux-map__panel").element as HTMLElement).style.position = "absolute";
    const stage = () => m.wrapper.find(".tux-map__stage").attributes("style") || "";
    const pan = () => Number(/translate3d\((-?[\d.]+)px/.exec(stage())![1]);
    const scale = () => Number(/scale\(([\d.]+)\)/.exec(stage())![1]);
    /** A card's left and right edge in viewport pixels, as the stage is drawn now. */
    const edges = (id: string) => {
      const r = m.state.stageData.rects[id] as Box;
      return { left: r.x * scale() + pan(), right: (r.x + r.w) * scale() + pan() };
    };
    const select = async (id: string) => {
      await m.wrapper.find(`.tux-map__el[data-id="${id}"]`).trigger("click");
      await nextTick();
      await nextTick();
    };
    const ids = (m.state.stageData.els as { id: string }[]).map((e) => e.id);
    const clear = ids.filter((id) => edges(id).right <= FREE && edges(id).left >= 12);
    const covered = ids.filter((id) => edges(id).right > FREE);
    return { ...m, pan, scale, edges, select, clear, covered };
  }

  it("does not move for a card that is clear of the details panel, whatever its wires reach", async () => {
    const { state, pan, edges, select, clear, covered } = await mountLevel2();
    // a card clear of the panel with a neighbour under it: the case that used to slide the stage
    const wires = state.routedSvg.wires as { from: string; to: string }[];
    const pick = clear.find((id) =>
      wires.some((w) => (w.from === id && covered.includes(w.to)) || (w.to === id && covered.includes(w.from))),
    )!;
    expect(pick).toBeTruthy();
    const before = edges(pick);
    await select(pick);
    expect(state.selectedId).toBe(pick);
    expect(pan()).toBe(0);
    expect(edges(pick)).toEqual(before);
  });

  it("moves only as far as brings a card out from under the panel", async () => {
    const { state, pan, edges, select, covered, scale } = await mountLevel2();
    expect(covered.length).toBeGreaterThan(0);
    // the covered card nearest the panel's edge needs the shortest move
    const pick = covered.reduce((a, b) => (edges(a).right <= edges(b).right ? a : b));
    // 24 px past the panel's edge, or as far as the stage goes: its own right end stops there
    const need = Math.round(FREE - edges(pick).right - 24);
    const stageEnd = -(state.stageData.width * scale() - FREE);
    await select(pick);
    expect(pan()).toBe(Math.max(need, stageEnd));
    expect(edges(pick).right).toBeLessThanOrEqual(FREE);
    expect(edges(pick).right).toBeGreaterThan(FREE - 26);
  });

  it("stays put for the next card too, and comes back when the selection is cleared", async () => {
    const { wrapper, pan, edges, select, clear, covered } = await mountLevel2();
    const far = covered.reduce((a, b) => (edges(a).right >= edges(b).right ? a : b));
    await select(far);
    const moved = pan();
    expect(moved).toBeLessThan(0);
    // a card still in view after that move: choosing it changes nothing
    const still = clear.find((id) => edges(id).left >= 12 && edges(id).right <= FREE)!;
    expect(still).toBeTruthy();
    await select(still);
    expect(pan()).toBe(moved);
    // a card that move pushed past the left edge comes back in, and no further
    const gone = clear.find((id) => edges(id).left < 0)!;
    expect(gone).toBeTruthy();
    await select(gone);
    expect(Math.round(edges(gone).left)).toBe(12);
    await wrapper.find(".tux-map__panel-close").trigger("click");
    await nextTick();
    expect(pan()).toBe(0);
  });
});

describe("TuxArchitectureMap: a model that carries a change, with the blast radius on (#205)", () => {
  // The sample model is a compare result: some of its elements carry a `diff`.
  async function mountChange(extra: Record<string, unknown> = {}) {
    const m = await mountMap({ model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2, initialShowBlastRadius: true, ...extra });
    (m.wrapper.find(".tux-map__panel").element as HTMLElement).style.position = "absolute";
    const cards = () => m.wrapper.findAll(".tux-map__stage .tux-map__el");
    const faded = () => cards().filter((c) => !c.classes().includes("tux-map__el--lit")).map((c) => c.attributes("data-id")!);
    const legend = () => m.wrapper.find(".tux-map__legend").text().replace(/\s+/g, " ");
    const note = () => m.wrapper.find(".tux-map__blast-note");
    return { ...m, cards, faded, legend, note };
  }

  it("says why cards are faded: in a line above the diagram and in the key", async () => {
    const { wrapper, faded, legend, note } = await mountChange();
    expect(wrapper.find(".tux-map__stage").classes()).toContain("tux-map__stage--dim");
    expect(faded().length).toBeGreaterThan(3);
    expect(note().exists()).toBe(true);
    expect(note().text().replace(/\s+/g, " ")).toBe(
      "Blast radius: the changed parts and what depends on them are lit. The rest of this view is faded.",
    );
    expect(legend()).toContain("PR Modified");
    expect(legend()).toContain("Not in the blast radius");
  });

  it("says nothing of fading when nothing is faded", async () => {
    // off: no fade
    const off = await mountChange({ initialShowBlastRadius: false });
    expect(off.faded()).toEqual([]);
    expect(off.note().exists()).toBe(false);
    expect(off.legend()).not.toContain("Not in the blast radius");
    // on, in a model with no change and nothing chosen: nothing to light, nothing faded
    const plain = await mountMap({
      model: {
        level1: { elements: [{ id: "sys", kind: "system", name: "S", at: [1, 1] }], rels: [] },
        level2: {
          boundary: "sys",
          elements: [
            { id: "c-a", kind: "container", name: "A", at: [1, 1] },
            { id: "c-b", kind: "container", name: "B", at: [2, 1] },
          ],
          rels: [{ from: "c-a", to: "c-b", label: "calls" }],
        },
        level3: {},
        level4: { groups: [], nodes: [], links: [] },
      },
      initialLevel: 2,
      initialFocus: null,
      initialShowBlastRadius: true,
    });
    expect(plain.wrapper.find(".tux-map__blast-note").exists()).toBe(false);
    expect(plain.wrapper.find(".tux-map__legend").text()).not.toContain("Not in the blast radius");
  });

  it("keeps the diagram when a faded card is chosen, and names what is lit then", async () => {
    const { wrapper, state, cards, faded, legend, note } = await mountChange();
    const before = cards().length;
    const changed = (state.stageData.els as { id: string; diff?: unknown }[]).filter((e) => e.diff).map((e) => e.id);
    expect(changed.length).toBeGreaterThan(0);
    // a faded card with no change of its own
    const pick = faded().find((id) => !changed.includes(id))!;
    expect(pick).toBeTruthy();
    const name = state.byId[pick].name as string;
    await wrapper.find(`.tux-map__el[data-id="${pick}"]`).trigger("click");
    await nextTick();
    await nextTick();
    expect(state.selectedId).toBe(pick);
    // every card is still drawn, the chosen one lit
    expect(cards().length).toBe(before);
    expect(wrapper.find(`.tux-map__el[data-id="${pick}"]`).classes()).toContain("tux-map__el--lit");
    // the key no longer calls the chosen card "PR Modified": it carries no change
    expect(legend()).toContain("Selected");
    expect(legend()).toContain("Depends on selection");
    expect(legend()).not.toContain("PR Modified");
    expect(legend()).toContain("Not in the blast radius");
    expect(note().text().replace(/\s+/g, " ")).toBe(
      `Blast radius of ${name}: it and what depends on it are lit. The rest of this view is faded.`,
    );
    // the changed cards keep their change chip while faded
    for (const id of changed) {
      expect(wrapper.find(`.tux-map__el[data-id="${id}"] [class*="tux-map__chip--diff-"]`).exists(), id).toBe(true);
    }
    // closing the panel brings the change's radius, and its wording, back
    await wrapper.find(".tux-map__panel-close").trigger("click");
    await nextTick();
    await nextTick();
    expect(legend()).toContain("PR Modified");
    expect(note().text()).toContain("the changed parts");
  });
});
