// @vitest-environment nuxt
/**
 * TuxMilestoneRoadmap — the roadmap's contract. Two halves:
 *
 * 1. The pure helpers exported from the SFC's plain <script> block:
 *    section order and
 *    the due-date wording (overdue, today, no date, closed), including
 *    Forgejo's due_on shape, which must never be re-zoned into the next
 *    day.
 * 2. The mounted component: disclosure semantics, which sections start
 *    collapsed (and that the start state sticks across re-renders),
 *    select / selectMilestone emits, arrow-key movement, the read-only,
 *    loading and empty states, and the #item slot scope.
 *
 * Plus a source guard for the forge island: the component must stay
 * free of Nuxt-only APIs and document-global DOM access.
 */
import { afterEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { h, nextTick } from "vue";
import TuxMilestoneRoadmap, {
  tuxMilestoneDue,
  tuxMilestoneOrder,
  tuxMilestoneProgress,
  tuxMilestoneStartsCollapsed,
} from "../../app/components/TuxMilestoneRoadmap.vue";
import type { TuxMilestone, TuxMilestoneItem } from "../../app/components/TuxMilestoneRoadmap.vue";

// Local-time constructor: "today" is the viewer's calendar day, so the
// tests must not depend on the runner's time zone.
const NOW = new Date(2026, 8, 23, 12, 0, 0); // Wed Sep 23 2026, noon local

const open = (id: number, extra: Partial<TuxMilestoneItem> = {}): TuxMilestoneItem => ({
  id,
  title: `Item ${id}`,
  ...extra,
});
const done = (id: number, extra: Partial<TuxMilestoneItem> = {}): TuxMilestoneItem => ({
  id,
  title: `Item ${id}`,
  done: true,
  ...extra,
});

// ── Pure helpers ───────────────────────────────────────────────────

describe("tuxMilestoneDue", () => {
  it("future: date + days to go, neutral beyond a week", () => {
    const d = tuxMilestoneDue({ dueOn: "2026-10-29", items: [open(1)] }, NOW);
    expect(d.text).toBe("due Oct 29 · in 36 days");
    expect(d).toMatchObject({ days: 36, tone: "neutral", overdue: false, iso: "2026-10-29" });
  });

  it("overdue with open items: the words say overdue, error tone", () => {
    const d = tuxMilestoneDue({ dueOn: "2026-09-11", items: [open(1), done(2)] }, NOW);
    expect(d.text).toBe("due Sep 11 · 12 days overdue");
    expect(d).toMatchObject({ days: -12, tone: "error", overdue: true });
    expect(tuxMilestoneDue({ dueOn: "2026-09-22", items: [open(1)] }, NOW).relative).toBe("1 day overdue");
  });

  it("past due with nothing open is history, not overdue", () => {
    const finished = tuxMilestoneDue({ dueOn: "2026-09-11", items: [done(1)] }, NOW);
    expect(finished.text).toBe("due Sep 11 · 12 days ago");
    expect(finished).toMatchObject({ tone: "muted", overdue: false });
    expect(tuxMilestoneDue({ dueOn: "2026-09-11", items: [] }, NOW).overdue).toBe(false);
  });

  it("today and tomorrow: warning while items are open", () => {
    const today = tuxMilestoneDue({ dueOn: "2026-09-23", items: [open(1)] }, NOW);
    expect(today.text).toBe("due Sep 23 · today");
    expect(today).toMatchObject({ days: 0, tone: "warning", overdue: false });
    expect(tuxMilestoneDue({ dueOn: "2026-09-23", items: [done(1)] }, NOW).tone).toBe("neutral");
    expect(tuxMilestoneDue({ dueOn: "2026-09-24", items: [open(1)] }, NOW).text).toBe("due Sep 24 · tomorrow");
    expect(tuxMilestoneDue({ dueOn: "2026-09-30", items: [open(1)] }, NOW).tone).toBe("warning");
    expect(tuxMilestoneDue({ dueOn: "2026-10-01", items: [open(1)] }, NOW).tone).toBe("neutral");
  });

  it("no date — null, empty, unparseable or impossible — reads 'no due date'", () => {
    for (const dueOn of [null, undefined, "", "soon", "2026-02-31", "2026-13-01"]) {
      const d = tuxMilestoneDue({ dueOn, items: [open(1)] }, NOW);
      expect(d.text, String(dueOn)).toBe("no due date");
      expect(d).toMatchObject({ date: null, days: null, tone: "muted", overdue: false });
    }
  });

  it("closed: the date only, muted, never overdue", () => {
    const d = tuxMilestoneDue({ dueOn: "2026-08-03", state: "closed", items: [open(1)] }, NOW);
    expect(d.text).toBe("due Aug 3");
    expect(d).toMatchObject({ relative: null, tone: "muted", overdue: false, days: -51 });
    expect(tuxMilestoneDue({ dueOn: null, state: "closed", items: [] }, NOW).text).toBe("no due date");
  });

  it("reads Forgejo's due_on calendar date as written (no re-zoning into the next day)", () => {
    for (const dueOn of ["2026-10-29T23:59:59-05:00", "2026-10-29T23:59:59Z", "2026-10-29T00:00:00+09:00"]) {
      expect(tuxMilestoneDue({ dueOn, items: [open(1)] }, NOW).date, dueOn).toBe("Oct 29");
    }
  });

  it("adds the year outside the current one; long spans read in months/years", () => {
    const d = tuxMilestoneDue({ dueOn: "2027-01-15", items: [open(1)] }, NOW);
    expect(d.text).toBe("due Jan 15, 2027 · in 4 months"); // 114 days out
    expect(tuxMilestoneDue({ dueOn: "2029-01-15", items: [open(1)] }, NOW).relative).toBe("in 2 years");
    expect(tuxMilestoneDue({ dueOn: "2026-12-30", items: [open(1)] }, NOW).relative).toBe("in 98 days");
  });
});

describe("tuxMilestoneOrder", () => {
  const ms = (title: string, dueOn: string | null, state?: "open" | "closed") => ({ title, dueOn, state });

  it("open dated (soonest first, overdue leading) → open undated (by title) → closed (latest due first, undated last)", () => {
    const order = tuxMilestoneOrder([
      ms("Closed old", "2026-06-01", "closed"),
      ms("Undated B", null),
      ms("Later", "2026-12-01"),
      ms("Closed undated", null, "closed"),
      ms("Overdue", "2026-09-01", "open"),
      ms("Undated A", null),
      ms("Closed recent", "2026-09-10", "closed"),
      ms("Soon", "2026-10-01"),
    ]).map((m) => m.title);
    expect(order).toEqual([
      "Overdue",
      "Soon",
      "Later",
      "Undated A",
      "Undated B",
      "Closed recent",
      "Closed old",
      "Closed undated",
    ]);
  });

  it("breaks date ties by title, numerically; does not mutate its input", () => {
    const input = [ms("v10 hop", "2026-10-01"), ms("v9 hop", "2026-10-01"), ms("Alpha", null)];
    const snapshot = input.map((m) => m.title);
    expect(tuxMilestoneOrder(input).map((m) => m.title)).toEqual(["v9 hop", "v10 hop", "Alpha"]);
    expect(input.map((m) => m.title)).toEqual(snapshot);
  });
});

describe("tuxMilestoneProgress / tuxMilestoneStartsCollapsed", () => {
  it("counts done items; an empty milestone is 0 of 0, never complete", () => {
    expect(tuxMilestoneProgress([done(1), open(2), open(3)])).toEqual({ done: 1, total: 3, percent: 33, complete: false });
    expect(tuxMilestoneProgress([])).toEqual({ done: 0, total: 0, percent: 0, complete: false });
    expect(tuxMilestoneProgress([done(1), done(2)]).complete).toBe(true);
  });

  it("collapses closed and 100%-done milestones only when asked", () => {
    expect(tuxMilestoneStartsCollapsed({ state: "closed", items: [open(1)] })).toBe(true);
    expect(tuxMilestoneStartsCollapsed({ items: [done(1)] })).toBe(true);
    expect(tuxMilestoneStartsCollapsed({ items: [] })).toBe(false);
    expect(tuxMilestoneStartsCollapsed({ items: [done(1), open(2)] })).toBe(false);
    expect(tuxMilestoneStartsCollapsed({ state: "closed", items: [done(1)] }, false)).toBe(false);
  });
});

// ── Mounted ────────────────────────────────────────────────────────

const roadmap = (): TuxMilestone[] => [
  {
    id: 3,
    title: "Before opening",
    dueOn: null,
    items: [open(30, { kind: "area", title: "Accessibility pass" }), done(31)],
  },
  {
    id: 1,
    title: "Forgejo v17 hop",
    dueOn: "2026-10-29",
    description: "Upgrade the forge.",
    items: [
      open(10, { ref: "#184", status: { label: "In progress", tone: "warning" }, flag: { label: "Waiting on 2", tone: "error" } }),
      done(11, { ref: "#185" }),
    ],
  },
  { id: 2, title: "Build prod", dueOn: "2026-09-11", items: [open(20), done(21)] },
  { id: 4, title: "Pilot", dueOn: "2026-08-01", state: "closed", items: [done(40)] },
  { id: 5, title: "Everything shipped", dueOn: "2026-10-10", items: [done(50)] },
  { id: 6, title: "Someday", dueOn: null, items: [] },
];

const titles = (w: Awaited<ReturnType<typeof mountSuspended>>) =>
  w.findAll(".tux-milestone-roadmap__title").map((t) => t.text());
const section = (w: Awaited<ReturnType<typeof mountSuspended>>, key: string) =>
  w.find(`[data-milestone-key="${key}"]`);

afterEach(() => {
  document.body.innerHTML = "";
});

describe("TuxMilestoneRoadmap rendering", () => {
  it("orders sections, hides empty milestones by default, and puts No milestone last", async () => {
    const w = await mountSuspended(TuxMilestoneRoadmap, {
      props: { milestones: roadmap(), unscheduled: [open(90)], now: NOW },
    });
    expect(titles(w)).toEqual(["Build prod", "Everything shipped", "Forgejo v17 hop", "Before opening", "Pilot", "No milestone"]);

    const all = await mountSuspended(TuxMilestoneRoadmap, {
      props: { milestones: roadmap(), unscheduled: [], now: NOW, hideEmpty: false },
    });
    expect(titles(all)).toContain("Someday");
    expect(section(all, "m:6").text()).toContain("No items in this milestone.");
    expect(section(all, "unscheduled").exists()).toBe(true);
  });

  it("headers are disclosure buttons inside headings, described by due + progress", async () => {
    const w = await mountSuspended(TuxMilestoneRoadmap, {
      props: { milestones: roadmap(), now: NOW, level: 2 },
      attachTo: document.body,
    });
    const hop = section(w, "m:1");
    expect(hop.find("h2 button.tux-milestone-roadmap__toggle").exists()).toBe(true);
    const toggle = hop.find(".tux-milestone-roadmap__toggle");
    expect(toggle.attributes("aria-expanded")).toBe("true");
    const body = document.getElementById(toggle.attributes("aria-controls")!);
    expect(body?.classList.contains("tux-milestone-roadmap__body")).toBe(true);
    const described = toggle
      .attributes("aria-describedby")!
      .split(" ")
      .map((id) => document.getElementById(id)?.textContent?.replace(/\s+/g, " ").trim());
    expect(described).toEqual(["due Oct 29 · in 36 days", "1 of 2 done"]);
    expect(hop.text()).toContain("Upgrade the forge.");
  });

  it("an overdue milestone says so in words and carries the overdue class; closed ones get a Closed badge", async () => {
    const w = await mountSuspended(TuxMilestoneRoadmap, { props: { milestones: roadmap(), now: NOW } });
    const prod = section(w, "m:2");
    expect(prod.classes()).toContain("tux-milestone-roadmap__milestone--overdue");
    expect(prod.find(".tux-milestone-roadmap__due").text().replace(/\s+/g, " ")).toBe("due Sep 11 · 12 days overdue");
    expect(section(w, "m:4").find(".tux-milestone-roadmap__heading").text()).toContain("Closed");
    expect(section(w, "m:4").find(".tux-milestone-roadmap__toggle").text()).toBe("Pilot, closed");
    expect(section(w, "m:3").find(".tux-milestone-roadmap__due").text()).toBe("no due date");
  });

  it("rows: status, title, flag, ref; done rows marked for AT, areas named as areas", async () => {
    const w = await mountSuspended(TuxMilestoneRoadmap, { props: { milestones: roadmap(), now: NOW } });
    const rows = section(w, "m:1").findAll(".tux-milestone-roadmap__row");
    expect(rows[0]!.element.tagName).toBe("BUTTON");
    expect(rows[0]!.attributes("type")).toBe("button");
    expect(rows[0]!.find(".tux-milestone-roadmap__status").text()).toBe("In progress");
    expect(rows[0]!.find(".tux-milestone-roadmap__flag").text()).toBe("Waiting on 2");
    expect(rows[0]!.find(".tux-milestone-roadmap__ref").text()).toBe("#184");
    // The default body names its button explicitly (flex items join
    // unpredictably into a name otherwise).
    expect(rows[0]!.attributes("aria-label")).toBe("In progress, Item 10, Waiting on 2, #184");
    expect(rows[1]!.classes()).toContain("tux-milestone-roadmap__row--done");
    expect(rows[1]!.attributes("aria-label")).toBe("Done, Item 11, #185");
    const area = section(w, "m:3").find(".tux-milestone-roadmap__row");
    expect(area.classes()).toContain("tux-milestone-roadmap__row--area");
    expect(area.attributes("aria-label")).toBe("Area: Accessibility pass");
  });
});

describe("TuxMilestoneRoadmap collapse", () => {
  it("closed and 100%-done milestones start collapsed; the rest start open", async () => {
    const w = await mountSuspended(TuxMilestoneRoadmap, { props: { milestones: roadmap(), now: NOW } });
    const expanded = (key: string) =>
      section(w, key).find(".tux-milestone-roadmap__toggle").attributes("aria-expanded");
    expect(expanded("m:4")).toBe("false"); // closed
    expect(expanded("m:5")).toBe("false"); // open, all done
    expect(expanded("m:1")).toBe("true");
    expect(expanded("m:2")).toBe("true");
    expect(section(w, "m:4").find(".tux-milestone-roadmap__body").attributes("hidden")).toBeDefined();
    expect(section(w, "m:1").find(".tux-milestone-roadmap__body").attributes("hidden")).toBeUndefined();

    const flat = await mountSuspended(TuxMilestoneRoadmap, {
      props: { milestones: roadmap(), now: NOW, collapseDone: false },
    });
    expect(flat.findAll('[aria-expanded="false"]')).toHaveLength(0);
  });

  it("clicking a header toggles it", async () => {
    const w = await mountSuspended(TuxMilestoneRoadmap, { props: { milestones: roadmap(), now: NOW } });
    const toggle = () => section(w, "m:1").find(".tux-milestone-roadmap__toggle");
    const body = () => section(w, "m:1").find(".tux-milestone-roadmap__body");
    await toggle().trigger("click");
    expect(toggle().attributes("aria-expanded")).toBe("false");
    expect(body().attributes("hidden")).toBeDefined();
    await toggle().trigger("click");
    expect(toggle().attributes("aria-expanded")).toBe("true");
    expect(body().attributes("hidden")).toBeUndefined();
  });

  it("find-in-page (beforematch on a hidden=until-found body) opens the section", async () => {
    const w = await mountSuspended(TuxMilestoneRoadmap, { props: { milestones: roadmap(), now: NOW } });
    const pilot = () => section(w, "m:4");
    expect(pilot().find(".tux-milestone-roadmap__toggle").attributes("aria-expanded")).toBe("false");
    pilot().find(".tux-milestone-roadmap__body").element.dispatchEvent(new Event("beforematch"));
    await nextTick();
    expect(pilot().find(".tux-milestone-roadmap__toggle").attributes("aria-expanded")).toBe("true");
    expect(pilot().find(".tux-milestone-roadmap__body").attributes("hidden")).toBeUndefined();
  });

  it("the start state sticks: finishing the last item on re-render does not snap a section shut", async () => {
    const w = await mountSuspended(TuxMilestoneRoadmap, { props: { milestones: roadmap(), now: NOW } });
    const next = roadmap().map((m) => (m.id === 2 ? { ...m, items: m.items.map((i) => ({ ...i, done: true })) } : m));
    await w.setProps({ milestones: next });
    const prod = section(w, "m:2");
    expect(prod.find(".tux-milestone-roadmap__count").text()).toBe("2 of 2 done");
    expect(prod.find(".tux-milestone-roadmap__toggle").attributes("aria-expanded")).toBe("true");
  });
});

describe("TuxMilestoneRoadmap emits", () => {
  it("a row emits select(item.id); the milestone button emits selectMilestone(milestone.id)", async () => {
    const w = await mountSuspended(TuxMilestoneRoadmap, {
      props: { milestones: roadmap(), unscheduled: [open(90)], now: NOW },
    });
    await section(w, "m:1").find(".tux-milestone-roadmap__row").trigger("click");
    expect(w.emitted("select")).toEqual([[10]]);

    const openBtn = section(w, "m:1").find(".tux-milestone-roadmap__open");
    expect(openBtn.attributes("aria-label")).toBe("Open milestone Forgejo v17 hop");
    await openBtn.trigger("click");
    expect(w.emitted("selectMilestone")).toEqual([[1]]);
    // Opening a milestone is not a disclosure click.
    expect(section(w, "m:1").find(".tux-milestone-roadmap__toggle").attributes("aria-expanded")).toBe("true");

    // "No milestone" has no milestone to open.
    expect(section(w, "unscheduled").find(".tux-milestone-roadmap__open").exists()).toBe(false);
  });

  it("read-only (interactive=false): rows are text, no milestone buttons, no emits", async () => {
    const w = await mountSuspended(TuxMilestoneRoadmap, {
      props: { milestones: roadmap(), now: NOW, interactive: false },
    });
    expect(w.findAll("button.tux-milestone-roadmap__row")).toHaveLength(0);
    expect(w.findAll(".tux-milestone-roadmap__open")).toHaveLength(0);
    await section(w, "m:1").find(".tux-milestone-roadmap__row").trigger("click");
    expect(w.emitted("select")).toBeUndefined();
    // Read as text, so the done/area cues live in visually-hidden text.
    expect(section(w, "m:1").findAll(".tux-milestone-roadmap__row")[1]!.text()).toMatch(/^Done:/);
    expect(section(w, "m:3").find(".tux-milestone-roadmap__row").text()).toContain("Area: Accessibility pass");
    // Sections still open and close.
    await section(w, "m:1").find(".tux-milestone-roadmap__toggle").trigger("click");
    expect(section(w, "m:1").find(".tux-milestone-roadmap__toggle").attributes("aria-expanded")).toBe("false");
  });
});

describe("TuxMilestoneRoadmap keyboard", () => {
  it("ArrowDown/ArrowUp/Home/End move between headers and visible rows, skipping collapsed ones", async () => {
    const w = await mountSuspended(TuxMilestoneRoadmap, {
      props: {
        milestones: [
          { id: 1, title: "A", dueOn: "2026-10-01", items: [open(10), open(11)] },
          { id: 2, title: "B", dueOn: "2026-10-02", items: [done(20)] }, // starts collapsed
          { id: 3, title: "C", dueOn: "2026-10-03", items: [open(30)] },
        ],
        now: NOW,
      },
      attachTo: document.body,
    });
    const label = () => {
      const el = document.activeElement as HTMLElement;
      return el.classList.contains("tux-milestone-roadmap__toggle")
        ? `head ${el.textContent!.trim()}`
        : `row ${el.textContent!.replace(/\s+/g, " ").trim()}`;
    };
    const press = async (key: string) => {
      document.activeElement!.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
      await nextTick();
    };

    (w.find(".tux-milestone-roadmap__toggle").element as HTMLElement).focus();
    expect(label()).toBe("head A");
    await press("ArrowDown");
    expect(label()).toBe("row Item 10");
    await press("ArrowDown");
    await press("ArrowDown");
    expect(label()).toBe("head B");
    await press("ArrowDown"); // B's row is collapsed → straight to C
    expect(label()).toBe("head C");
    await press("End");
    expect(label()).toBe("row Item 30");
    await press("ArrowDown"); // clamps at the end
    expect(label()).toBe("row Item 30");
    await press("Home");
    expect(label()).toBe("head A");
    await press("ArrowUp"); // clamps at the start
    expect(label()).toBe("head A");
  });
});

describe("TuxMilestoneRoadmap states + slots", () => {
  it("loading shows one polite status and no sections", async () => {
    const w = await mountSuspended(TuxMilestoneRoadmap, { props: { milestones: roadmap(), loading: true } });
    const status = w.find('[role="status"]');
    expect(status.text()).toContain("Loading milestones");
    expect(w.findAll(".tux-milestone-roadmap__milestone")).toHaveLength(0);
  });

  it("empty: default copy distinguishes 'none' from 'all hidden'; #empty overrides", async () => {
    const none = await mountSuspended(TuxMilestoneRoadmap, { props: { milestones: [] } });
    expect(none.text()).toContain("No milestones yet.");
    const hidden = await mountSuspended(TuxMilestoneRoadmap, {
      props: { milestones: [{ id: 1, title: "Empty", items: [] }] },
    });
    expect(hidden.text()).toContain("No milestone has any items yet.");
    const custom = await mountSuspended(TuxMilestoneRoadmap, {
      props: { milestones: [{ id: 1, title: "Empty", items: [] }] },
      slots: { empty: (p: { hidden: number }) => h("p", `Nothing here (${p.hidden} hidden)`) },
    });
    expect(custom.text()).toContain("Nothing here (1 hidden)");
  });

  it("#item replaces the row body, gets { item, milestone } (null for No milestone), and the row stays a button", async () => {
    const w = await mountSuspended(TuxMilestoneRoadmap, {
      props: { milestones: roadmap(), unscheduled: [open(90)], now: NOW },
      slots: {
        item: (p: { item: TuxMilestoneItem; milestone: TuxMilestone | null }) =>
          h("span", { class: "custom" }, `${p.item.title} @ ${p.milestone?.title ?? "none"}`),
      },
    });
    const hopRow = section(w, "m:1").find(".tux-milestone-roadmap__row");
    expect(hopRow.element.tagName).toBe("BUTTON");
    expect(hopRow.find(".custom").text()).toBe("Item 10 @ Forgejo v17 hop");
    expect(section(w, "unscheduled").find(".custom").text()).toBe("Item 90 @ none");
    await hopRow.trigger("click");
    expect(w.emitted("select")).toEqual([[10]]);
  });
});

describe("TuxMilestoneRoadmap island safety (source guard)", () => {
  it("uses no Nuxt-only APIs, no Teleport, and no document-global DOM access", () => {
    // The nuxt environment's import.meta.url is not a file: URL; vitest runs from the repo root.
    const src = readFileSync(resolve(process.cwd(), "app/components/TuxMilestoneRoadmap.vue"), "utf8")
      // comments may mention what the component avoids
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/<!--[\s\S]*?-->/g, "");
    for (const banned of [
      /NuxtLink/, /\buseRoute\b/, /\buseRouter\b/, /navigateTo/, /\buseHead\b/, /\buseState\b/,
      /\buseFetch\b/, /\buseTux\w+/, /#app/, /<Teleport/i, /\bdocument\./, /\bwindow\./,
    ]) {
      expect(src, String(banned)).not.toMatch(banned);
    }
  });
});
