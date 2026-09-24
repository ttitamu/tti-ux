// @vitest-environment nuxt
/**
 * TuxTimeline — the planning timeline. Two halves:
 *
 * 1. The pure layout math, exported from the component's plain <script>
 *    block: date → x (whole local days, DST-proof), scale + tick
 *    generation, the default range, row sectioning, impossible-order
 *    detection, accessible names, and the tooltip / flag / arrow
 *    geometry.
 * 2. The mounted interaction contract: every label, bar, point, marker
 *    and unscheduled row is a real button that emits the right event;
 *    impossible dependencies are drawn red with a <title>; missing rows
 *    are skipped; arrow keys move focus the documented way; focus shows
 *    the tooltip and Escape hides it; empty and loading states render.
 */
import { afterEach, describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxTimeline, {
  tuxDateToX,
  tuxDayNumber,
  tuxTimelineArrowPath,
  tuxTimelineAutoScale,
  tuxTimelineDate,
  tuxTimelineDependencies,
  tuxTimelineFlags,
  tuxTimelineFormatRange,
  tuxTimelineIsImpossible,
  tuxTimelinePeriodStart,
  tuxTimelineRange,
  tuxTimelineRowLabel,
  tuxTimelineSections,
  tuxTimelineTicks,
  tuxTimelineTooltipPosition,
} from "../../app/components/TuxTimeline.vue";
import type { TuxTimelineRow } from "../../app/components/TuxTimeline.vue";

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day);

// ── pure helpers ────────────────────────────────────────────────────────────

describe("date → x", () => {
  it("reads a date-only string as that LOCAL day (not UTC midnight)", () => {
    const x = tuxTimelineDate("2026-10-01")!;
    expect([x.getFullYear(), x.getMonth(), x.getDate()]).toEqual([2026, 9, 1]);
  });

  it("rejects empty, unparseable and impossible dates", () => {
    expect(tuxTimelineDate("")).toBeNull();
    expect(tuxTimelineDate(null)).toBeNull();
    expect(tuxTimelineDate("not a date")).toBeNull();
    expect(tuxTimelineDate("2026-02-31")).toBeNull();
    expect(tuxTimelineDate(new Date(Number.NaN))).toBeNull();
  });

  it("maps whole days to pixels from the range start", () => {
    expect(tuxDateToX(d(2026, 10, 1), d(2026, 10, 1), 4)).toBe(0);
    expect(tuxDateToX(d(2026, 10, 8), d(2026, 10, 1), 4)).toBe(28);
    expect(tuxDateToX(d(2026, 9, 24), d(2026, 10, 1), 10)).toBe(-70);
  });

  it("is DST-proof and ignores the time of day", () => {
    // US DST ends 2026-11-01: that local day is 25h long, still one day.
    expect(tuxDateToX(d(2026, 11, 2), d(2026, 10, 31), 10)).toBe(20);
    expect(tuxDateToX(new Date(2026, 9, 1, 23, 30), new Date(2026, 9, 1, 0, 5), 10)).toBe(0);
    expect(tuxDayNumber(d(2026, 3, 9)) - tuxDayNumber(d(2026, 3, 7))).toBe(2);
  });
});

describe("scale + ticks", () => {
  it("auto-picks week / month / quarter from the visible span", () => {
    expect(tuxTimelineAutoScale(30)).toBe("week");
    expect(tuxTimelineAutoScale(70)).toBe("week");
    expect(tuxTimelineAutoScale(71)).toBe("month");
    expect(tuxTimelineAutoScale(550)).toBe("month");
    expect(tuxTimelineAutoScale(551)).toBe("quarter");
  });

  it("month ticks read 'Oct 2026' and are clamped (not dropped) at the range edges", () => {
    const ticks = tuxTimelineTicks(d(2026, 9, 15), d(2027, 1, 10), "month");
    expect(ticks.map((t) => t.label)).toEqual(["Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026", "Jan 2027"]);
    expect(tuxDayNumber(ticks[0]!.start)).toBe(tuxDayNumber(d(2026, 9, 15)));
    expect(tuxDayNumber(ticks[1]!.start)).toBe(tuxDayNumber(d(2026, 10, 1)));
    expect(tuxDayNumber(ticks.at(-1)!.end)).toBe(tuxDayNumber(d(2027, 1, 10)));
  });

  it("quarter ticks read '2026-Q4'; the range end is exclusive", () => {
    const ticks = tuxTimelineTicks(d(2026, 8, 1), d(2027, 4, 1), "quarter");
    expect(ticks.map((t) => t.label)).toEqual(["2026-Q3", "2026-Q4", "2027-Q1"]);
  });

  it("weeks start on Monday and carry the year on the first tick and on a year change", () => {
    // 2026-09-24 is a Thursday.
    expect(tuxDayNumber(tuxTimelinePeriodStart(d(2026, 9, 24), "week"))).toBe(tuxDayNumber(d(2026, 9, 21)));
    expect(tuxTimelineTicks(d(2026, 9, 21), d(2026, 10, 12), "week").map((t) => t.label))
      .toEqual(["Sep 21, 2026", "Sep 28", "Oct 5"]);
    expect(tuxTimelineTicks(d(2026, 12, 21), d(2027, 1, 11), "week").map((t) => t.label))
      .toEqual(["Dec 21, 2026", "Dec 28", "Jan 4, 2027"]);
  });

  it("returns no ticks for an empty or inverted range", () => {
    expect(tuxTimelineTicks(d(2026, 10, 1), d(2026, 10, 1), "month")).toEqual([]);
    expect(tuxTimelineTicks(d(2026, 10, 2), d(2026, 10, 1), "month")).toEqual([]);
  });
});

describe("default range", () => {
  it("always includes today and snaps outward to whole periods", () => {
    const r = tuxTimelineRange({
      rows: [{ id: 1, label: "Later", start: "2027-01-10", end: "2027-03-20" }],
      today: d(2026, 9, 24),
    });
    expect(r.scale).toBe("month");
    expect(r.start.getDate()).toBe(1);
    expect(r.end.getDate()).toBe(1);
    expect(tuxDayNumber(r.start)).toBeLessThanOrEqual(tuxDayNumber(d(2026, 9, 24)));
    expect(tuxDayNumber(r.end)).toBeGreaterThan(tuxDayNumber(d(2027, 3, 20)));
    expect(r.days).toBe(tuxDayNumber(r.end) - tuxDayNumber(r.start));
  });

  it("an explicit range wins, end inclusive; an invalid one falls back", () => {
    const r = tuxTimelineRange({ rows: [], range: { start: "2026-10-01", end: "2026-10-31" } });
    expect(r.days).toBe(31);
    expect(r.scale).toBe("week");
    const bad = tuxTimelineRange({ rows: [], today: d(2026, 9, 24), range: { start: "2026-10-31", end: "2026-10-01" } });
    expect(bad.days).toBeGreaterThan(0);
    expect(tuxDayNumber(bad.start)).toBeLessThanOrEqual(tuxDayNumber(d(2026, 9, 24)));
  });
});

describe("rows + impossible order", () => {
  const hop: TuxTimelineRow = { id: 171, label: "Forgejo v17 hop", start: "2026-10-01", end: "2026-10-29" };

  it("flags `to` starting before `from` ends; the same day is allowed", () => {
    expect(tuxTimelineIsImpossible(hop, { id: 2, label: "Re-seed", start: "2026-10-20", end: "2026-11-10" })).toBe(true);
    expect(tuxTimelineIsImpossible(hop, { id: 2, label: "Re-seed", start: "2026-10-29", end: "2026-11-10" })).toBe(false);
    expect(tuxTimelineIsImpossible(hop, { id: 2, label: "Re-seed", start: "2026-10-30" })).toBe(false);
  });

  it("a due-date-only row starts on its due date; an open `from` is unknown, never impossible", () => {
    expect(tuxTimelineIsImpossible(hop, { id: 2, label: "Point", end: "2026-10-15" })).toBe(true);
    const [dep] = tuxTimelineDependencies(
      [{ id: 1, label: "Open", start: "2026-10-01" }, { id: 2, label: "Next", start: "2026-09-01", end: "2026-09-10" }],
      [{ from: 1, to: 2 }],
    );
    expect(dep!.status).toBe("unknown");
  });

  it("skips missing rows and self-dependencies; ids compare as strings", () => {
    const rows: TuxTimelineRow[] = [hop, { id: "172", label: "Re-seed", start: "2026-10-20", end: "2026-11-10" }];
    const deps = tuxTimelineDependencies(rows, [
      { from: 171, to: 172 },
      { from: 171, to: 999 },
      { from: "nope", to: 171 },
      { from: 171, to: "171" },
    ]);
    expect(deps).toHaveLength(1);
    expect(deps[0]!.status).toBe("impossible");
    expect(tuxDayNumber(deps[0]!.fromEnd!)).toBe(tuxDayNumber(d(2026, 10, 29)));
    expect(tuxDayNumber(deps[0]!.toStart!)).toBe(tuxDayNumber(d(2026, 10, 20)));
  });

  it("sections keep first-appearance group order; undated rows go to Unscheduled, dated markers stay", () => {
    const { sections, unscheduled } = tuxTimelineSections([
      { id: 1, label: "A", group: "Work surface", start: "2026-10-01", end: "2026-10-05" },
      { id: 2, label: "B", group: "Platform", end: "2026-10-05" },
      { id: 3, label: "C", group: "Work surface", start: "2026-10-01" },
      { id: 4, label: "No dates" },
      { id: 5, label: "Only a marker", markers: [{ id: "m", at: "2026-10-03", label: "Kickoff" }] },
      { id: 6, label: "Bad dates", start: "garbage", end: "" },
    ]);
    expect(sections.map((s) => s.group)).toEqual(["Work surface", "Platform", null]);
    expect(sections[0]!.rows.map((r) => r.id)).toEqual([1, 3]);
    expect(sections[2]!.rows.map((r) => r.id)).toEqual([5]);
    expect(unscheduled.map((r) => r.id)).toEqual([4, 6]);
  });
});

describe("names + geometry", () => {
  it("formats ranges for accessible names", () => {
    expect(tuxTimelineFormatRange(d(2026, 10, 1), d(2026, 10, 29))).toBe("Oct 1 to Oct 29, 2026");
    expect(tuxTimelineFormatRange(d(2026, 12, 15), d(2027, 1, 20))).toBe("Dec 15, 2026 to Jan 20, 2027");
    expect(tuxTimelineFormatRange(null, d(2026, 10, 29))).toBe("due Oct 29, 2026");
    expect(tuxTimelineFormatRange(d(2026, 10, 1), null)).toBe("from Oct 1, 2026, no due date");
  });

  it("a bar's accessible name carries its dates and progress", () => {
    expect(tuxTimelineRowLabel({ id: 1, label: "Forgejo v17 hop", start: "2026-10-01", end: "2026-10-29", progress: 0.4 }))
      .toBe("Forgejo v17 hop — Oct 1 to Oct 29, 2026, 40% done");
    expect(tuxTimelineRowLabel({ id: 1, label: "Staged", start: "2026-08-01", end: "2026-08-20", done: true, progress: 0.3 }))
      .toBe("Staged — Aug 1 to Aug 20, 2026, done");
  });

  it("tooltip stays inside the box: clamped at the right edge, flipped above near the bottom", () => {
    const box = { width: 400, height: 300 };
    const tip = { width: 160, height: 60 };
    const right = tuxTimelineTooltipPosition({ x: 390, top: 40, bottom: 60 }, box, tip);
    expect(right.left + tip.width).toBeLessThanOrEqual(box.width);
    expect(right.placement).toBe("below");
    const left = tuxTimelineTooltipPosition({ x: 5, top: 40, bottom: 60 }, box, tip);
    expect(left.left).toBeGreaterThanOrEqual(0);
    const bottom = tuxTimelineTooltipPosition({ x: 200, top: 260, bottom: 280 }, box, tip);
    expect(bottom.placement).toBe("above");
    expect(bottom.top + tip.height).toBeLessThanOrEqual(260);
  });

  it("header flags truncate at the next flag; the last one flips left near the edge", () => {
    const flags = tuxTimelineFlags([{ key: "b", x: 300 }, { key: "a", x: 100 }, { key: "today", x: 590 }], 600);
    expect(flags.map((f) => f.key)).toEqual(["a", "b", "today"]);
    expect(flags[0]).toMatchObject({ align: "start", maxWidth: 194 });
    expect(flags[2]!.align).toBe("end");
    expect(flags[1]!.maxWidth + flags[2]!.maxWidth).toBeLessThanOrEqual(290);
  });

  it("arrow paths go straight when there is room and loop back when the order is impossible", () => {
    expect(tuxTimelineArrowPath(100, 20, 200, 60, 40)).toBe("M100 20H108V60H200");
    expect(tuxTimelineArrowPath(200, 20, 150, 60, 40)).toBe("M200 20H208V40H142V60H150");
  });
});

// ── mounted contract ────────────────────────────────────────────────────────

const rows: TuxTimelineRow[] = [
  { id: 1, group: "Platform", label: "Forgejo v17 upgrade", sublabel: "#162 · Area", start: "2026-09-01", end: "2026-11-15", progress: 0.5 },
  { id: 2, group: "Platform", indent: true, label: "Forgejo v17 hop", sublabel: "#171", start: "2026-10-01", end: "2026-10-29",
    progress: 0.4, tone: "info", markers: [{ id: "rc1", at: "2026-10-10", label: "RC1 tagged" }] },
  { id: 3, group: "Platform", indent: true, label: "Re-seed workflows", start: "2026-10-20", end: "2026-11-10", tone: "warning" },
  { id: 4, group: "Platform", indent: true, label: "Cache warmers", end: "2026-11-30" },
  { id: 5, label: "Offboarding audit", sublabel: "#241 · Backlog" },
  { id: 6, group: "Other", label: "Staged on laptop", start: "2026-08-10", end: "2026-08-30", done: true },
];
const dependencies = [{ from: 2, to: 3 }, { from: 1, to: 999 }, { from: 6, to: 2 }];
const milestones = [{ id: "m1", at: "2026-10-29", label: "v17 live" }];
const today = new Date(2026, 8, 24);
const props = { rows, dependencies, milestones, today, ariaLabel: "Roadmap timeline" };

type Wrapper = Awaited<ReturnType<typeof mountSuspended>>;
let mounted: Wrapper | null = null;
afterEach(() => {
  mounted?.unmount();
  mounted = null;
});

async function mountTimeline(extra: Record<string, unknown> = {}, attach = false) {
  mounted = await mountSuspended(TuxTimeline, {
    props: { ...props, ...extra },
    ...(attach ? { attachTo: document.body } : {}),
  });
  return mounted;
}

const labelOf = (w: Wrapper, text: string) =>
  w.findAll(".tux-timeline__label").find((b) => b.text().includes(text))!;
const itemNamed = (w: Wrapper, start: string) =>
  w.findAll(".tux-timeline__item").find((b) => (b.attributes("aria-label") ?? "").startsWith(start))!;

describe("TuxTimeline rendering", () => {
  it("renders labels under group headers and lists undated rows as Unscheduled (never dropped)", async () => {
    const w = await mountTimeline();
    expect(w.attributes("role")).toBe("group");
    expect(w.attributes("aria-label")).toBe("Roadmap timeline");
    expect(w.findAll(".tux-timeline__group-text").map((g) => g.text())).toEqual(["Platform", "Other"]);
    expect(w.findAll(".tux-timeline__label")).toHaveLength(5);
    const unscheduled = w.find(".tux-timeline__unscheduled");
    expect(unscheduled.exists()).toBe(true);
    expect(unscheduled.text()).toContain("Offboarding audit");
  });

  it("bars are buttons whose accessible name carries dates and progress; end-only rows are diamonds", async () => {
    const w = await mountTimeline();
    const hop = itemNamed(w, "Forgejo v17 hop");
    expect(hop.element.tagName).toBe("BUTTON");
    expect(hop.attributes("aria-label")).toContain("Forgejo v17 hop — Oct 1 to Oct 29, 2026, 40% done");
    const point = itemNamed(w, "Cache warmers");
    expect(point.attributes("aria-label")).toContain("due Nov 30, 2026");
    expect(point.find(".tux-timeline__diamond").exists()).toBe(true);
    expect(itemNamed(w, "Staged on laptop").attributes("aria-label")).toContain(", done");
  });

  it("draws milestone lines, flags and a today line", async () => {
    const w = await mountTimeline();
    expect(w.findAll(".tux-timeline__milestone-line")).toHaveLength(1);
    expect(w.findAll(".tux-timeline__flag").map((f) => f.text())).toEqual(expect.arrayContaining(["v17 live", "Today"]));
    expect(w.find(".tux-timeline__today-line").exists()).toBe(true);
    expect(w.find(".tux-timeline__sr").text()).toContain("v17 live, Oct 29, 2026");
  });

  it("an impossible dependency is red with a <title>; both bar edges are marked; missing rows are skipped", async () => {
    const w = await mountTimeline();
    const arrows = w.findAll("g.tux-timeline__arrow");
    expect(arrows).toHaveLength(2); // 2→3 and 6→2; 1→999 skipped
    const bad = arrows.filter((a) => a.classes().includes("tux-timeline__arrow--impossible"));
    expect(bad).toHaveLength(1);
    expect(bad[0]!.find("title").text()).toContain("Re-seed workflows can't start before Forgejo v17 hop ends");
    expect(itemNamed(w, "Forgejo v17 hop").find(".tux-timeline__bar--late-end").exists()).toBe(true);
    expect(itemNamed(w, "Re-seed workflows").find(".tux-timeline__bar--late-start").exists()).toBe(true);
    expect(itemNamed(w, "Re-seed workflows").attributes("aria-label")).toContain("Can't start before Forgejo v17 hop ends");
    expect(labelOf(w, "Re-seed workflows").text()).toContain("schedule conflict");
  });

  it("empty and loading states", async () => {
    const empty = await mountSuspended(TuxTimeline, { props: { rows: [], today } });
    expect(empty.find(".tux-timeline__empty").text()).toContain("Nothing on the timeline yet");
    empty.unmount();
    const loading = await mountSuspended(TuxTimeline, { props: { rows: [], today, loading: true } });
    expect(loading.attributes("aria-busy")).toBe("true");
    expect(loading.findAll(".tux-timeline__skeleton-row").length).toBeGreaterThan(0);
    expect(loading.find(".tux-timeline__empty").exists()).toBe(false);
    loading.unmount();
  });
});

describe("TuxTimeline events", () => {
  it("labels, bars and unscheduled rows emit select(rowId); markers emit selectMarker(markerId)", async () => {
    const w = await mountTimeline();
    await labelOf(w, "Forgejo v17 hop").trigger("click");
    await itemNamed(w, "Cache warmers").trigger("click");
    await w.find(".tux-timeline__unscheduled-item").trigger("click");
    expect(w.emitted("select")?.map((e) => e[0])).toEqual([2, 4, 5]);
    await itemNamed(w, "RC1 tagged").trigger("click");
    expect(w.emitted("selectMarker")?.[0]).toEqual(["rc1"]);
    expect(w.emitted("select")).toHaveLength(3);
  });

  it("selected marks the row's label with aria-current", async () => {
    const w = await mountTimeline({ selected: "3" });
    expect(labelOf(w, "Re-seed workflows").attributes("aria-current")).toBe("true");
    expect(labelOf(w, "Forgejo v17 hop").attributes("aria-current")).toBeUndefined();
  });
});

describe("TuxTimeline keyboard", () => {
  it("↑/↓ walk labels, → enters the track, ←/→ walk a row's items, ← from the first returns to the label", async () => {
    const w = await mountTimeline({}, true);
    const upgrade = labelOf(w, "Forgejo v17 upgrade");
    (upgrade.element as HTMLElement).focus();
    await upgrade.trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(labelOf(w, "Forgejo v17 hop").element);

    await labelOf(w, "Forgejo v17 hop").trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement).toBe(itemNamed(w, "Forgejo v17 hop").element);

    await itemNamed(w, "Forgejo v17 hop").trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement).toBe(itemNamed(w, "RC1 tagged").element);

    await itemNamed(w, "RC1 tagged").trigger("keydown", { key: "ArrowLeft" });
    expect(document.activeElement).toBe(itemNamed(w, "Forgejo v17 hop").element);

    await itemNamed(w, "Forgejo v17 hop").trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(itemNamed(w, "Re-seed workflows").element);

    await itemNamed(w, "Re-seed workflows").trigger("keydown", { key: "ArrowLeft" });
    expect(document.activeElement).toBe(labelOf(w, "Re-seed workflows").element);

    await labelOf(w, "Re-seed workflows").trigger("keydown", { key: "End" });
    expect(document.activeElement).toBe(labelOf(w, "Staged on laptop").element);
    await labelOf(w, "Staged on laptop").trigger("keydown", { key: "Home" });
    expect(document.activeElement).toBe(upgrade.element);
  });

  it("focus shows the tooltip with dates and conflicts; Escape hides it", async () => {
    const w = await mountTimeline();
    const reseed = itemNamed(w, "Re-seed workflows");
    await reseed.trigger("focus");
    const tip = w.find(".tux-timeline__tooltip");
    expect(tip.exists()).toBe(true);
    expect(tip.attributes("aria-hidden")).toBe("true");
    expect(tip.text()).toContain("Oct 20 to Nov 10, 2026");
    expect(tip.text()).toContain("Can't start before Forgejo v17 hop ends");
    await reseed.trigger("keydown", { key: "Escape" });
    expect(w.find(".tux-timeline__tooltip").exists()).toBe(false);
  });
});
