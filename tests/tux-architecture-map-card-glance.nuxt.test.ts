// @vitest-environment nuxt
/**
 * A card is the box its ring, its ports and its wires are drawn to (#257), and it says what it is at
 * a glance (#258): a one-line title, a type line the body's size, a hairline over the body, and a
 * status line that names what it counts and what each state means.
 *
 * The test DOM does no layout. What is logic is tested mounted (the box each card is given, the
 * rectangle the ring and the wires are drawn to, the words); what is a rule of the stylesheet is
 * read from its source. The geometry was measured in a browser on the docs page: every card's
 * rendered box against its ring and ports, at rest, hovered and chosen.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import type { TuxMapLevelModel } from "../packages/diagrams/app/utils/tuxArchitectureMap";
import { cardDescriptionLines } from "../packages/diagrams/app/utils/internal/tuxArchitectureMapStage";

type SetupState = Record<string, any>;

const SFC = readFileSync(join(process.cwd(), "packages/diagrams/app/components/TuxArchitectureMap.vue"), "utf8");
const STYLE = SFC.slice(SFC.lastIndexOf("<style")).replace(/\/\*[\s\S]*?\*\//g, "");

/** The declarations of every rule whose selector list has exactly `selector`, in source order. */
function declarations(selector: string): string[] {
  return [...STYLE.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter((m) => m[1]!.split(",").some((s) => s.trim().replace(/\s+/g, " ") === selector))
    .map((m) => m[2]!);
}

/** Every rule whose selector names a stage card (`.tux-map__el` itself, not a row of it). */
function cardRules(): { selector: string; body: string }[] {
  return [...STYLE.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .map((m) => ({ selector: m[1]!.trim(), body: m[2]! }))
    .filter((r) => r.selector.split(",").some((s) => /\.tux-map__el(?![-\w])[^\s]*$/.test(s.trim())));
}

const px = (decl: string, prop: string) => Number(new RegExp(`(?:^|[;\\s])${prop}:\\s*([\\d.]+)px`).exec(decl)?.[1]);

const LONG_NAME = "Projects, Workflows, Approvals and Notifications Orchestration Engine";
const LONG_DESC =
  "Coordinates every project workflow: it reads the approval rules, schedules the reminders, sends the notifications, " +
  "writes the audit trail, retries what failed and reports what it could not finish, for every team and every project.";

const model = {
  schema: "tux-map/1",
  level1: { title: "x", elements: [{ id: "sys", kind: "system", name: "S", at: [1, 1], zoom: 2 }], rels: [] },
  level2: {
    title: "c",
    boundary: "sys",
    elements: [
      {
        id: "c-long",
        kind: "container",
        name: LONG_NAME,
        tech: "Go · REST & GraphQL · Event Bus · Postgres Driver",
        desc: LONG_DESC,
        at: [1, 1],
        live: { state: "running", running: 8, total: 10 },
      },
      { id: "c-run", kind: "container", name: "Web Portal", tech: "Nuxt", desc: "Pages.", at: [3, 1], live: { state: "running", running: 2, total: 2 } },
      { id: "c-none", kind: "container", name: "Workers", at: [1, 3], live: { state: "running", running: 0, total: 3 } },
      { id: "c-one", kind: "container", name: "Proxy", at: [3, 3], live: { state: "running" } },
      { id: "c-active", kind: "container", name: "Timer", at: [5, 1], live: { state: "active" } },
      { id: "c-present", kind: "container", name: "CLI", at: [5, 3], live: { state: "present" } },
      { id: "c-success", kind: "container", name: "Backup", at: [1, 5], live: { state: "success" } },
      { id: "c-inactive", kind: "container", name: "Search", at: [3, 5], live: { state: "inactive" } },
      { id: "c-declared", kind: "container", name: "Exporter", at: [5, 5], live: { state: "declared-not-installed" } },
      { id: "c-failed", kind: "container", name: "Mailer", at: [1, 7], live: { state: "failed" } },
      { id: "c-unknown", kind: "container", name: "Cache", at: [3, 7], live: { state: "unknown" } },
      { id: "c-lastok", kind: "container", name: "Nightly", at: [5, 7], live: { last_run: { result: "success" } } },
      { id: "c-lastbad", kind: "container", name: "Weekly", at: [1, 9], live: { last_run: { result: "failed" } } },
    ],
    rels: [
      { from: "c-run", to: "c-long", label: "calls" },
      { from: "c-long", to: "c-none", label: "queues" },
    ],
  },
  level3: {
    "c-run": [
      { id: "c-run/a", kind: "component", name: LONG_NAME, tech: "TypeScript", desc: LONG_DESC, at: [1, 1] },
      { id: "c-run/b", kind: "component", name: "Router", at: [2, 1] },
    ],
  },
  level4: { groups: [], nodes: [], links: [] },
} as unknown as TuxMapLevelModel;

/** What each case's card says, and its dot (#258). */
const WORDING: [id: string, text: string, dot: string][] = [
  ["c-long", "8 of 10 instances running", "warn"],
  ["c-run", "2 of 2 instances running", "ok"],
  ["c-none", "0 of 3 instances running", "bad"],
  ["c-one", "Running", "ok"],
  ["c-active", "Running", "ok"],
  ["c-present", "Installed", "ok"],
  ["c-success", "Last run succeeded", "ok"],
  ["c-inactive", "Installed, not running", "warn"],
  ["c-declared", "Declared, not installed", "warn"],
  ["c-failed", "Failed: stopped with an error", "bad"],
  ["c-unknown", "State not reported", ""],
  ["c-lastok", "Last run succeeded", "ok"],
  ["c-lastbad", "Last run failed", "bad"],
];

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];
afterEach(() => {
  for (const w of mounted.splice(0)) w.unmount();
});

async function mountMap(props: Record<string, unknown>) {
  const wrapper = await mountSuspended(TuxArchitectureMap, { props: { model, minimap: false, ...props } });
  mounted.push(wrapper);
  await nextTick();
  await nextTick();
  const state = (wrapper.vm as unknown as { $: { setupState: SetupState } }).$.setupState;
  return { wrapper, state };
}

describe("TuxArchitectureMap: a card is the box its ring, ports and wires are drawn to (#257)", () => {
  it("never sizes a card by its text: no rule gives a card, hovered or chosen, a height of its own", () => {
    const rules = cardRules();
    expect(rules.length).toBeGreaterThan(5);
    for (const r of rules) {
      // the stage writes each card's height inline; `height: auto !important` on :hover and
      // [aria-pressed] grew a long card past its ring, its ports and its wires
      expect(r.body, r.selector).not.toMatch(/(?:^|[;\s])(?:min-|max-)?height\s*:/);
    }
    expect(declarations(".tux-map__el")[0]).toMatch(/overflow:\s*hidden/);
    // and no row is let out of its clamp while the card is under the pointer or chosen
    for (const row of ["nm > span", "ty", "ds", "ft", "st"]) {
      expect(declarations(`.tux-map__el:hover .tux-map__el-${row}`), row).toEqual([]);
      expect(declarations(`.tux-map__el[aria-pressed="true"] .tux-map__el-${row}`), row).toEqual([]);
    }
  });

  it("clamps every row that could grow: the title, the type, the host, the description and the status", () => {
    for (const row of ["nm > span", "ty", "runs", "st"]) {
      const d = declarations(`.tux-map__el-${row}`).join(";");
      expect(d, row).toMatch(/white-space:\s*nowrap/);
      expect(d, row).toMatch(/text-overflow:\s*ellipsis/);
      expect(d, row).toMatch(/overflow:\s*hidden/);
    }
    expect(declarations(".tux-map__el-ds")[0]).toMatch(/-webkit-line-clamp:\s*2/);
    expect(declarations(".tux-map__el-ft")[0]).toMatch(/max-height:\s*1\.2rem/);
  });

  it("gives a long-title, long-description card its planned box, and draws its ring, ports and wires to it", async () => {
    const { wrapper, state } = await mountMap({ initialLevel: 2 });
    const el = wrapper.find('.tux-map__el[data-id="c-long"]').element as HTMLElement;
    const r = state.stageData.rects["c-long"] as { x: number; y: number; w: number; h: number };
    expect([el.style.left, el.style.top, el.style.width, el.style.height]).toEqual([`${r.x}px`, `${r.y}px`, `${r.w}px`, `${r.h}px`]);

    // the planned height holds every row the card shows (the numbers are the stylesheet's)
    const card = (state.renderedCards as any[]).find((c) => c.id === "c-long");
    expect(card.descLines).toBe(
      cardDescriptionLines(r.h, { type: Boolean(card.typeLabel), runsOn: Boolean(card.runsOnLabel), footer: true }),
    );
    expect(card.descLines).toBeGreaterThan(0);
    expect(wrapper.find('.tux-map__el[data-id="c-long"] .tux-map__el-ds').attributes("data-lines")).toBe(String(card.descLines));

    // the ring and its ports: drawn 6px outside the same rectangle, wherever the card is chosen or hovered
    await wrapper.find('.tux-map__el[data-id="c-long"]').trigger("click");
    await nextTick();
    expect(el.getAttribute("aria-pressed")).toBe("true");
    expect(el.style.height).toBe(`${r.h}px`);
    const near = state.findNearestCardToPoint(r.x + r.w / 2, r.y + r.h / 2);
    expect(near?.id).toBe("c-long");
    state.renderProximityMatch(near, r.x + r.w / 2, r.y + r.h / 2);
    await nextTick();
    const frame = wrapper.find(".tux-map__proximity-frame").element as HTMLElement;
    expect([frame.style.left, frame.style.top, frame.style.width, frame.style.height]).toEqual([
      `${r.x - 6}px`,
      `${r.y - 6}px`,
      `${r.w + 12}px`,
      `${r.h + 12}px`,
    ]);
    expect(wrapper.findAll(".tux-map__proximity-frame .tux-map__port")).toHaveLength(4);

    // each wire to it ends on its box's edge
    const box = { x: parseFloat(el.style.left), y: parseFloat(el.style.top), w: parseFloat(el.style.width), h: parseFloat(el.style.height) };
    const wires = (state.routedSvg.wires as { from: string; to: string; d: string }[]).filter((w) => w.from === "c-long" || w.to === "c-long");
    expect(wires.length).toBe(2);
    for (const w of wires) {
      const n = (w.d.match(/-?[\d.]+/g) ?? []).map(Number);
      const [x, y] = w.from === "c-long" ? [n[0]!, n[1]!] : [n.at(-2)!, n.at(-1)!];
      const toEdge = Math.min(
        Math.abs(x - box.x),
        Math.abs(x - (box.x + box.w)),
        Math.abs(y - box.y),
        Math.abs(y - (box.y + box.h)),
      );
      expect(x, w.d).toBeGreaterThanOrEqual(box.x - 12);
      expect(x, w.d).toBeLessThanOrEqual(box.x + box.w + 12);
      expect(y, w.d).toBeGreaterThanOrEqual(box.y - 12);
      expect(y, w.d).toBeLessThanOrEqual(box.y + box.h + 12);
      expect(toEdge, w.d).toBeLessThanOrEqual(12);
    }
  });

  it("gives a long title the description lines a short one gets", async () => {
    const { state } = await mountMap({ initialLevel: 3, initialFocus: "c-run" });
    const cards = state.renderedCards as { id: string; descLines: number; name: string }[];
    const long = cards.find((c) => c.id === "c-run/a")!;
    expect(long.name).toBe(LONG_NAME);
    expect(long.descLines).toBe(2);
  });
});

describe("TuxArchitectureMap: a card says what it is at a glance (#258)", () => {
  it("keeps the title on one line, with the full name in its tooltip and the card's accessible name", async () => {
    const { wrapper } = await mountMap({ initialLevel: 2 });
    const card = wrapper.find('.tux-map__el[data-id="c-long"]');
    const title = card.find(".tux-map__el-nm > span:last-child");
    expect(title.text()).toBe(LONG_NAME);
    expect(title.attributes("title")).toBe(LONG_NAME);
    expect(card.attributes("aria-label")!.startsWith(LONG_NAME)).toBe(true);
    const nm = declarations(".tux-map__el-nm > span").join(";");
    expect(nm).toMatch(/white-space:\s*nowrap/);
    expect(nm).not.toMatch(/line-clamp/);
  });

  it("sets the type line at the body's size or larger, in a colour that holds 7:1", () => {
    const ty = declarations(".tux-map__el-ty")[0]!;
    const ds = declarations(".tux-map__el-ds")[0]!;
    expect(px(ty, "font-size")).toBeGreaterThanOrEqual(px(ds, "font-size"));
    // --text-muted: 7.8:1 on --surface-raised in the light theme, the lowest of the four
    expect(ty).toMatch(/color:\s*var\(--text-muted\)/);
  });

  it("sets the body apart from the title area with a hairline in a TUX token", () => {
    const ds = declarations(".tux-map__el-ds")[0]!;
    expect(ds).toMatch(/border-top:\s*1px solid var\(--surface-border\)/);
    expect(px(ds, "padding-top")).toBeGreaterThanOrEqual(4);
  });

  it("names what the status line counts and what each state means, on the card and in its accessible name", async () => {
    const { wrapper } = await mountMap({ initialLevel: 2 });
    for (const [id, text, dot] of WORDING) {
      const card = wrapper.find(`.tux-map__el[data-id="${id}"]`);
      expect(card.find(".tux-map__el-st").text(), id).toBe(text);
      expect(card.find(".tux-map__dot").classes(), id).toEqual(dot ? ["tux-map__dot", `tux-map__dot--${dot}`] : ["tux-map__dot"]);
      expect(card.attributes("aria-label"), id).toContain(text);
    }
    expect(wrapper.text()).not.toMatch(/\d+\/\d+ running/);
  });

  it("says the same words in the list view and the details panel", async () => {
    const { wrapper } = await mountMap({ initialLevel: 2, initialView: "list" });
    for (const [id, text] of WORDING) {
      expect(wrapper.find(`[data-list-id="${id}"] .tux-map__el-st`).text(), id).toBe(text);
    }
    await wrapper.find('[data-list-id="c-long"]').trigger("click");
    await nextTick();
    const dl = wrapper.find(".tux-map__panel .tux-map__panel-dl");
    expect(dl.text()).toContain("8 of 10 instances running");
  });
});
