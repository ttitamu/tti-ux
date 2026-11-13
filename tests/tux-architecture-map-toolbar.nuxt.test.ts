// @vitest-environment nuxt
/**
 * The map's own bar (#273): one line of controls at the widths a desktop map has, each control and
 * each group the map's target height on one centre line, the groups 12px apart and the controls in a
 * group 8px (TUX's spacing steps), and the breadcrumb on a line of its own with the Wires filter at
 * its end. The drawing tools went into the canvas and the blast intent beside the line that defines it.
 *
 * The test DOM does no layout: what is markup is tested mounted, what is the stylesheet's contract is
 * read from its source. The geometry (one line at 1,920, 1,754 and 1,440 px, filtering or not; every
 * control 44px tall on one centre line; nothing overlapping at 792 and 390 px) was measured in a
 * browser with puppeteer, and is in the PR.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import { DEFAULT_TTI_LEVEL_MODEL } from "../packages/diagrams/app/utils/tuxArchitectureMapSample";

const SFC = readFileSync(join(process.cwd(), "packages/diagrams/app/components/TuxArchitectureMap.vue"), "utf8");
const STYLE = SFC.slice(SFC.lastIndexOf("<style")).replace(/\/\*[\s\S]*?\*\//g, "");

function blockAt(css: string, at: number): string {
  const open = css.indexOf("{", at);
  for (let i = open, depth = 0; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i);
  }
  return "";
}

/** The declarations of every top-level rule (outside an at-rule) whose selector list has exactly `selector`. */
function rule(selector: string, css = STYLE): string {
  // at-rules are skipped by removing their balanced blocks
  let flat = css;
  for (let at = flat.indexOf("@"); at !== -1; at = flat.indexOf("@")) {
    const body = blockAt(flat, at);
    const end = flat.indexOf("{", at) + body.length + 2;
    flat = flat.slice(0, at) + flat.slice(end);
  }
  return [...flat.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter((m) => m[1]!.split(",").some((s) => s.trim().replace(/\s+/g, " ") === selector))
    .map((m) => m[2]!)
    .join(";");
}

/** Every `@container tux-map (max-width: <px>)` block, joined. */
function containerBlocks(px: number): string {
  const head = `@container tux-map (max-width: ${px}px)`;
  let out = "";
  for (let at = STYLE.indexOf(head); at !== -1; at = STYLE.indexOf(head, at + 1)) out += blockAt(STYLE, at);
  return out;
}

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];
afterEach(() => {
  for (const w of mounted.splice(0)) w.unmount();
});

async function mountMap(props: Record<string, unknown> = {}) {
  const wrapper = await mountSuspended(TuxArchitectureMap, { props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2, ...props } });
  mounted.push(wrapper);
  await nextTick();
  return wrapper;
}

const TARGET = "var(--tux-map-target)";
const INSIDE_A_GROUP = "calc(var(--tux-map-target) - 2px)";

describe("TuxArchitectureMap: the bar's controls are one height on one line (#273)", () => {
  it("makes every control and every group the target height, a group's border inside it", () => {
    // standalone controls: the target, border included (the layer is border-box)
    for (const sel of [".tux-map__goto-btn", ".tux-map__search-input", ".tux-map__more-btn", ".tux-map__switch", ".tux-map__wire-chip", ".tux-map__wire-filter-btn"]) {
      expect(rule(sel), sel).toMatch(new RegExp(`min-height:\\s*${TARGET.replace(/[()]/g, "\\$&")}`));
    }
    expect(rule(".tux-map__iconbtn")).toMatch(/(?:^|[;\s])height:\s*var\(--tux-map-target\)/);
    // a group (the stepper, a segmented pair) is 1px of border around controls 2px shorter than the target
    expect(rule(".tux-map__stepper")).toMatch(/border:\s*1px solid/);
    expect(rule(".tux-map__seg")).toMatch(/border:\s*1px solid/);
    const inGroup = INSIDE_A_GROUP.replace(/[()]/g, "\\$&");
    expect(rule(".tux-map__seg button")).toMatch(new RegExp(`min-height:\\s*${inGroup}`));
    expect(rule(".tux-map__stepper .tux-map__iconbtn")).toMatch(new RegExp(`(?:^|[;\\s])height:\\s*${inGroup}`));
    // the level's name between − and + was 32px in a 46px group: off the line by 7px each side
    const stratum = rule(".tux-map__stepper-stratum");
    expect(stratum).toMatch(new RegExp(`(?:^|[;\\s])height:\\s*${inGroup}`));
    expect(stratum).not.toMatch(/height:\s*32px/);
    // one centre line
    for (const sel of [".tux-map__tools", ".tux-map__tools-end", ".tux-map__tools-pair", ".tux-map__more-inline", ".tux-map__subbar", ".tux-map__wire-filters"]) {
      expect(rule(sel), sel).toMatch(/align-items:\s*center/);
    }
  });

  it("separates the groups by TUX's spacing steps: 12px between groups, 8px inside one", () => {
    expect(rule(".tux-map__tools")).toMatch(/gap:\s*var\(--space-8, 8px\) var\(--space-12, 12px\)/);
    expect(rule(".tux-map__more-inline")).toMatch(/gap:\s*var\(--space-8, 8px\) var\(--space-12, 12px\)/);
    expect(rule(".tux-map__tools-end")).toMatch(/gap:\s*var\(--space-8, 8px\)/);
    expect(rule(".tux-map__tools-pair")).toMatch(/gap:\s*var\(--space-8, 8px\)/);
    expect(rule(".tux-map__subbar")).toMatch(/gap:\s*var\(--space-8, 8px\) var\(--space-16, 16px\)/);
    // no raw rem gaps left on the bar
    for (const sel of [".tux-map__tools", ".tux-map__tools-end", ".tux-map__tools-pair", ".tux-map__more-inline", ".tux-map__subbar"]) {
      expect(rule(sel), sel).not.toMatch(/gap:\s*[\d.]+rem/);
    }
  });

  it("keeps one line by width: the switches go into More below 1,440px, the toggles show icons below 1,250px", () => {
    const more = containerBlocks(1439);
    expect(more).toMatch(/\.tux-map__more-btn\s*\{[^}]*display:\s*inline-flex/);
    expect(more).toMatch(/\.tux-map__more-inline\s*\{[^}]*display:\s*none/);
    expect(containerBlocks(760)).not.toMatch(/\.tux-map__more-btn/);
    const icons = containerBlocks(1249);
    // visually hidden, not removed: the name stays for assistive technology
    expect(icons).toMatch(/\.tux-map__tools \.tux-map__btn-lbl\s*\{[^}]*clip-path:\s*inset\(50%\)/);
    expect(icons).not.toMatch(/display:\s*none/);
  });

  it("names every toggle that can lose its label, by the label and a title", async () => {
    const wrapper = await mountMap();
    for (const name of ["Outline", "Infrastructure", "Diagram", "List"]) {
      const b = wrapper.findAll(".tux-map__tools button").find((x) => x.text() === name);
      expect(b, name).toBeTruthy();
      expect(b!.find(".tux-map__btn-lbl").text()).toBe(name);
      expect(b!.attributes("title")?.length, name).toBeGreaterThan(0);
    }
  });
});

describe("TuxArchitectureMap: the breadcrumb has its own line, the Wires filter at its end (#273)", () => {
  it("puts the trail first, taking the room, and the filter after it on the same line", async () => {
    const wrapper = await mountMap();
    const sub = wrapper.find(".tux-map__subbar");
    const kids = [...sub.element.children].map((e) => e.tagName === "NAV" ? "nav" : e.className);
    expect(kids).toEqual(["nav", "tux-map__wire-filters"]);
    expect(rule(".tux-map__subbar > nav")).toMatch(/flex:\s*1 1 auto/);
    expect(rule(".tux-map__subbar > nav")).toMatch(/min-width:\s*0/);
    expect(rule(".tux-map__subbar")).toMatch(/justify-content:\s*space-between/);
    expect(rule(".tux-map__subbar")).toMatch(/min-height:\s*var\(--tux-map-target\)/);
    // the trail has no margin of its own to push it off the line
    expect(rule(".tux-map__crumbs")).toMatch(/margin:\s*0(;|$)/);
    // the toolbar holds neither the breadcrumb nor the filter
    expect(wrapper.find(".tux-map__tools .tux-map__crumbs").exists()).toBe(false);
    expect(wrapper.find(".tux-map__tools .tux-map__wire-filters").exists()).toBe(false);
  });
});

describe("TuxArchitectureMap: what left the bar (#273)", () => {
  it("draws the annotation tools in the canvas's top-left corner, icons named by their labels", async () => {
    const wrapper = await mountMap({ annotations: true });
    expect(wrapper.find('.tux-map__tools [aria-label="Annotation tools"]').exists()).toBe(false);
    const tools = wrapper.find('.tux-map__canvas > .tux-map__drawtools[aria-label="Annotation tools"]');
    expect(tools.attributes("role")).toBe("group");
    expect(tools.findAll("button").map((b) => b.text())).toEqual(["Select", "Pen", "Laser", "Note"]);
    for (const b of tools.findAll("button")) expect(b.attributes("title")).toBeTruthy();
    expect(rule(".tux-map__drawtools")).toMatch(/position:\s*absolute/);
    expect(rule(".tux-map__drawtools")).toMatch(/left:\s*var\(--space-12, 12px\)/);
    expect(rule(".tux-map__drawtools .tux-map__btn-lbl")).toMatch(/clip-path:\s*inset\(50%\)/);
    await tools.findAll("button")[1]!.trigger("click");
    expect(tools.findAll("button")[1]!.attributes("aria-pressed")).toBe("true");
    // none without `annotations`, and none in the list view
    expect((await mountMap()).find(".tux-map__drawtools").exists()).toBe(false);
    expect((await mountMap({ annotations: true, initialView: "list" })).find(".tux-map__drawtools").exists()).toBe(false);
  });

  it("puts the blast intent beside the line that defines it, and nothing of it in the bar", async () => {
    const wrapper = await mountMap({ initialShowBlastRadius: true });
    expect(wrapper.find(".tux-map__tools .tux-map__intent-select").exists()).toBe(false);
    const row = wrapper.find(".tux-map__blast-intent-row");
    expect(row.find("select.tux-map__intent-select").exists()).toBe(true);
    const key = row.find("[data-blast-intent-key]");
    expect(row.find("select").attributes("aria-describedby")).toBe(key.attributes("id"));
  });

  it("keeps the corner groups in the viewport's cell when the outline makes the canvas a grid", () => {
    const placed = rule(".tux-map__canvas--with-outline > .tux-map__zoomctl");
    expect(placed).toMatch(/grid-column:\s*2/);
    expect(placed).toMatch(/grid-row:\s*1/);
    expect(rule(".tux-map__canvas--with-outline > .tux-map__viewport")).toMatch(/grid-row:\s*1/);
    expect(containerBlocks(760)).toMatch(/\.tux-map__canvas--with-outline > \.tux-map__drawtools\s*\{[^}]*grid-row:\s*2/);
  });
});
