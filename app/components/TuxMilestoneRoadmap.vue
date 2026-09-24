<script lang="ts">
/**
 * TuxMilestoneRoadmap — a Redmine-style milestone roadmap: one section
 * per milestone with its due date, how far along it is, and the items
 * in it. Built for the forge's Roadmap tab ("Milestones" view), useful
 * anywhere a program tracks work against dated milestones.
 *
 * Stateless apart from which sections are open: the host owns the data
 * and re-renders; nothing is persisted. Each section's starting state is
 * decided the first time its milestone appears (closed or 100%-done
 * collapse under `collapseDone`) and is then the user's — finishing the
 * last item during a session does not snap the section shut.
 *
 * Order (tuxMilestoneOrder, below): open milestones by due date,
 * then open ones with no date by title, then closed ones (most recently
 * due first); the `unscheduled` items form a final "No milestone" section.
 *
 * Interaction contract:
 *   - Each section header is a disclosure button (aria-expanded /
 *     aria-controls) inside a real heading; the whole header row is its
 *     click target. Collapsed bodies use hidden="until-found", so
 *     find-in-page still reaches items in a collapsed milestone (and
 *     opens it) where the browser supports that.
 *   - Rows are buttons that emit `select(item.id)`; the arrow-up-right
 *     button beside a milestone emits `selectMilestone(milestone.id)`.
 *   - ArrowUp / ArrowDown / Home / End move focus between section
 *     headers and visible rows (Tab order is unchanged).
 *   - `interactive=false` renders a read-only roadmap: rows are plain
 *     text, no select / selectMilestone; sections still open and close.
 *
 * Plain-Vue safe (the forge mounts it in a shadow-DOM island): no Nuxt
 * APIs, no document-global queries — keyboard focus moves via the
 * component's own root ref.
 *
 * Slots:
 *   #item="{ item, milestone }" — replace a row's body (milestone is null
 *     for "No milestone"). The row stays a <button>, so the slot content
 *     must be phrasing content with nothing focusable inside.
 *   #empty="{ hidden }" — shown when there is nothing to list; `hidden`
 *     counts milestones left out by `hideEmpty`.
 */

/*
 * ── Pure helpers ──────────────────────────────────────────────────
 * The pure logic behind TuxMilestoneRoadmap — section order, due-date
 * wording, progress, and which sections start collapsed — exported from
 * this plain <script> block so it is unit-testable without mounting
 * (import it from the .vue file). It lives in the SFC so the component
 * is one self-contained file: nothing to auto-import or path-import from
 * app/utils, in the Nuxt layer or in the forge's plain-Vue island.
 *
 * Every export is `tuxMilestone*` / `TuxMilestone*`-prefixed so a
 * consumer importing it next to other TUX names never collides.
 */
// One import block for both <script>s (eslint import/first sees them as one module).
import { computed, reactive, ref, useId, watch } from "vue";

export type TuxMilestoneTone = "info" | "success" | "warning" | "error" | "neutral" | "muted";

export interface TuxMilestoneItem {
  id: string | number;
  title: string;
  /** Short reference, e.g. "#184" or "tti/other#9" — shown small + mono. */
  ref?: string;
  /** Closed/finished: struck through, counts toward progress. */
  done?: boolean;
  /** Areas (epics) render with emphasis. */
  kind?: "area" | "item";
  /** e.g. In progress (warning), Ready (info). */
  status?: { label: string; tone: TuxMilestoneTone };
  /** e.g. "Waiting on 2" (error). */
  flag?: { label: string; tone: TuxMilestoneTone };
}

export interface TuxMilestone {
  id: string | number;
  title: string;
  /** ISO date or timestamp; null/absent = no due date. */
  dueOn?: string | null;
  state?: "open" | "closed";
  description?: string;
  items: TuxMilestoneItem[];
}

export interface TuxMilestoneProgress {
  done: number;
  total: number;
  /** 0–100, rounded down so a 99.6% milestone never reads as 100%. */
  percent: number;
  /** Has items and every one is done. An empty milestone is not complete. */
  complete: boolean;
}

export interface TuxMilestoneDue {
  /** The whole line: "due Oct 29 · in 36 days", "no due date". */
  text: string;
  /** "Oct 29" (or "Jan 15, 2027" outside `now`'s year); null without a date. */
  date: string | null;
  /** "in 36 days", "today", "12 days overdue", "3 days ago"; null when not shown. */
  relative: string | null;
  /** YYYY-MM-DD for a <time datetime>; null without a date. */
  iso: string | null;
  /** Calendar days from today to the due date (negative = past); null without a date. */
  days: number | null;
  /** muted (closed / no date / past but finished), neutral, warning (≤ 7 days), error (overdue). */
  tone: "muted" | "neutral" | "warning" | "error";
  /** Past due with open items — the words say so, never the colour alone. */
  overdue: boolean;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_MS = 86_400_000;
/** Open milestones due within this many days read as "soon" (warning). */
const SOON_DAYS = 7;

/**
 * The calendar date a due string names, read from its leading YYYY-MM-DD
 * AS WRITTEN. Forgejo writes `due_on` as 23:59:59 in the server's zone
 * (e.g. "2026-10-29T23:59:59-05:00"); converting that instant to UTC or to
 * the viewer's zone can move it to the next day, so it is never re-zoned.
 * Returns null for null/empty/unparseable input.
 */
function calendarDate(dueOn: string | null | undefined): { y: number; m: number; d: number } | null {
  if (!dueOn) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dueOn.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]) - 1;
  const d = Number(match[3]);
  const probe = new Date(Date.UTC(y, m, d));
  // Reject rollovers like 2026-02-31.
  if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== m || probe.getUTCDate() !== d) return null;
  return { y, m, d };
}

function plural(n: number, unit: string): string {
  return `${n} ${unit}${n === 1 ? "" : "s"}`;
}

/** "36 days" / "4 months" / "2 years" for a non-negative day span. */
function span(days: number): string {
  if (days < 100) return plural(days, "day");
  const months = Math.round(days / 30.44);
  if (months < 24) return plural(months, "month");
  return plural(Math.round(days / 365.25), "year");
}

export function tuxMilestoneProgress(items: readonly TuxMilestoneItem[]): TuxMilestoneProgress {
  const total = items.length;
  const done = items.filter((i) => i.done).length;
  return {
    done,
    total,
    percent: total ? Math.floor((done / total) * 100) : 0,
    complete: total > 0 && done === total,
  };
}

export function tuxMilestoneIsClosed(m: Pick<TuxMilestone, "state">): boolean {
  return m.state === "closed";
}

/**
 * Due-date wording for one milestone, relative to `now`'s LOCAL calendar
 * day (the viewer's "today").
 *
 * - closed: "due Oct 3" (no countdown — it is history), muted
 * - no/invalid date: "no due date", muted
 * - future: "due Oct 29 · in 36 days" — "tomorrow" at 1, warning within 7
 *   days while items are open
 * - today: "due Sep 24 · today" — warning while items are open
 * - past with open items: "due Oct 3 · 12 days overdue", error, overdue
 * - past with nothing open (finished, or empty): "… · 12 days ago", muted
 */
export function tuxMilestoneDue(
  m: Pick<TuxMilestone, "dueOn" | "state" | "items">,
  now: Date = new Date(),
): TuxMilestoneDue {
  const cal = calendarDate(m.dueOn);
  if (!cal) {
    return { text: "no due date", date: null, relative: null, iso: null, days: null, tone: "muted", overdue: false };
  }
  const iso = `${cal.y}-${String(cal.m + 1).padStart(2, "0")}-${String(cal.d).padStart(2, "0")}`;
  const date = `${MONTHS[cal.m]} ${cal.d}${cal.y !== now.getFullYear() ? `, ${cal.y}` : ""}`;
  const days = Math.round(
    (Date.UTC(cal.y, cal.m, cal.d) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / DAY_MS,
  );
  const base = { date, iso, days };

  if (tuxMilestoneIsClosed(m)) {
    return { ...base, text: `due ${date}`, relative: null, tone: "muted", overdue: false };
  }

  const hasOpen = m.items.some((i) => !i.done);
  let relative: string;
  let tone: TuxMilestoneDue["tone"];
  let overdue = false;
  if (days > 0) {
    relative = days === 1 ? "tomorrow" : `in ${span(days)}`;
    tone = hasOpen && days <= SOON_DAYS ? "warning" : "neutral";
  } else if (days === 0) {
    relative = "today";
    tone = hasOpen ? "warning" : "neutral";
  } else if (hasOpen) {
    relative = `${span(-days)} overdue`;
    tone = "error";
    overdue = true;
  } else {
    relative = `${span(-days)} ago`;
    tone = "muted";
  }
  return { ...base, text: `due ${date} · ${relative}`, relative, tone, overdue };
}

/**
 * Roadmap order, as a sorted copy:
 *   1. open milestones with a due date, soonest first (overdue ones lead);
 *   2. open milestones with no date, by title;
 *   3. closed milestones, most recently due first, undated last, then title.
 * Title ties compare numerically ("v9" before "v10"); remaining ties keep
 * input order. `state` absent means open.
 */
export function tuxMilestoneOrder<T extends Pick<TuxMilestone, "title" | "dueOn" | "state">>(
  milestones: readonly T[],
): T[] {
  const keyed = milestones.map((m, index) => {
    const cal = calendarDate(m.dueOn);
    const due = cal ? Date.UTC(cal.y, cal.m, cal.d) : null;
    const closed = tuxMilestoneIsClosed(m);
    const rank = closed ? 2 : due !== null ? 0 : 1;
    return { m, index, due, rank };
  });
  const byTitle = (a: T, b: T) =>
    a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: "base" });
  keyed.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    if (a.rank === 0 && a.due !== b.due) return (a.due as number) - (b.due as number);
    if (a.rank === 2 && a.due !== b.due) {
      if (a.due === null) return 1;
      if (b.due === null) return -1;
      return b.due - a.due;
    }
    return byTitle(a.m, b.m) || a.index - b.index;
  });
  return keyed.map((k) => k.m);
}

/** Closed, or every item done (only when `collapseDone`). Empty milestones stay open. */
export function tuxMilestoneStartsCollapsed(
  m: Pick<TuxMilestone, "state" | "items">,
  collapseDone = true,
): boolean {
  if (!collapseDone) return false;
  return tuxMilestoneIsClosed(m) || tuxMilestoneProgress(m.items).complete;
}
</script>

<script setup lang="ts">
interface Props {
  milestones: TuxMilestone[];
  /** Items with no milestone → a final "No milestone" section. */
  unscheduled?: TuxMilestoneItem[];
  /** "Today" for the due wording. Default: new Date() at render. */
  now?: Date;
  /** Leave out milestones with no items. Default true. */
  hideEmpty?: boolean;
  /** Closed or 100%-done milestones start collapsed. Default true. */
  collapseDone?: boolean;
  /** Placeholder sections + a polite "Loading milestones" status. */
  loading?: boolean;
  /** false = read-only: rows are text, no select emits. Default true. */
  interactive?: boolean;
  /** Heading level for milestone titles. Default 3. */
  level?: 2 | 3 | 4 | 5 | 6;
  /** Accessible name for the list of milestones. */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  unscheduled: undefined,
  now: undefined,
  hideEmpty: true,
  collapseDone: true,
  loading: false,
  interactive: true,
  level: 3,
  ariaLabel: "Milestones",
});

const emit = defineEmits<{
  select: [itemId: string | number];
  selectMilestone: [milestoneId: string | number];
}>();

defineSlots<{
  item?(props: { item: TuxMilestoneItem; milestone: TuxMilestone | null }): unknown;
  empty?(props: { hidden: number }): unknown;
}>();

interface Section {
  key: string;
  milestone: TuxMilestone | null;
  title: string;
  items: TuxMilestoneItem[];
  progress: TuxMilestoneProgress;
  due: TuxMilestoneDue | null;
  closed: boolean;
  startsCollapsed: boolean;
}

const UNSCHEDULED_KEY = "unscheduled";

const sections = computed<Section[]>(() => {
  const now = props.now ?? new Date();
  const out: Section[] = [];
  for (const m of tuxMilestoneOrder(props.milestones)) {
    if (props.hideEmpty && m.items.length === 0) continue;
    out.push({
      key: `m:${m.id}`,
      milestone: m,
      title: m.title,
      items: m.items,
      progress: tuxMilestoneProgress(m.items),
      due: tuxMilestoneDue(m, now),
      closed: tuxMilestoneIsClosed(m),
      startsCollapsed: tuxMilestoneStartsCollapsed(m, props.collapseDone),
    });
  }
  const loose = props.unscheduled;
  if (loose && (loose.length > 0 || !props.hideEmpty)) {
    out.push({
      key: UNSCHEDULED_KEY,
      milestone: null,
      title: "No milestone",
      items: loose,
      progress: tuxMilestoneProgress(loose),
      due: null,
      closed: false,
      startsCollapsed: tuxMilestoneStartsCollapsed({ items: loose }, props.collapseDone),
    });
  }
  return out;
});

const hiddenCount = computed(() =>
  props.hideEmpty ? props.milestones.filter((m) => m.items.length === 0).length : 0,
);

// Open/closed per section key. A key's starting state is fixed the first
// time it is seen; after that only the user (or find-in-page) changes it.
const openState = reactive<Record<string, boolean>>({});
watch(
  sections,
  (list) => {
    for (const s of list) {
      if (!(s.key in openState)) openState[s.key] = !s.startsCollapsed;
    }
  },
  { immediate: true },
);

function isOpen(s: Section): boolean {
  return openState[s.key] ?? !s.startsCollapsed;
}
function setOpen(s: Section, open: boolean) {
  openState[s.key] = open;
}

const uid = useId();
function ids(i: number) {
  const base = `${uid}-ms${i}`;
  return { body: `${base}-body`, due: `${base}-due`, progress: `${base}-progress` };
}
function describedBy(s: Section, i: number): string {
  const { due, progress } = ids(i);
  return s.due ? `${due} ${progress}` : progress;
}

const headingTag = computed(() => `h${props.level}`);

// The default row body is several flex items (badge, title, badge, ref);
// how engines join those into a button's name varies ("In progressItem
// 10"), so the default body names the button explicitly. A custom #item
// body names itself from its own content.
function rowLabel(item: TuxMilestoneItem): string {
  return [
    item.done ? "Done" : null,
    item.status?.label,
    item.kind === "area" ? `Area: ${item.title}` : item.title,
    item.flag?.label,
    item.ref,
  ]
    .filter(Boolean)
    .join(", ");
}

function onSelect(item: TuxMilestoneItem) {
  if (props.interactive) emit("select", item.id);
}

// ── Keyboard: arrows move between headers and visible rows ──────────
const rootEl = ref<HTMLElement | null>(null);
const NAV_KEYS = new Set(["ArrowDown", "ArrowUp", "Home", "End"]);

function onKeydown(e: KeyboardEvent) {
  if (!NAV_KEYS.has(e.key) || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
  const root = rootEl.value;
  const target = e.target as HTMLElement | null;
  if (!root || !target?.hasAttribute?.("data-tux-ms-nav")) return;
  const stops = Array.from(root.querySelectorAll<HTMLElement>("[data-tux-ms-nav]")).filter(
    (el) => !el.closest("[hidden]"),
  );
  const at = stops.indexOf(target);
  if (at < 0) return;
  const next =
    e.key === "Home" ? 0
    : e.key === "End" ? stops.length - 1
    : e.key === "ArrowDown" ? Math.min(at + 1, stops.length - 1)
    : Math.max(at - 1, 0);
  e.preventDefault();
  stops[next]?.focus();
}
</script>

<template>
  <div
    ref="rootEl"
    class="tux-milestone-roadmap"
    :class="{ 'tux-milestone-roadmap--static': !interactive }"
    @keydown="onKeydown"
  >
    <!-- Loading: section-shaped placeholders, one polite status. -->
    <div v-if="loading" class="tux-milestone-roadmap__loading" role="status">
      <span class="tux-milestone-roadmap__sr">Loading milestones…</span>
      <div
        v-for="n in 3"
        :key="n"
        class="tux-milestone-roadmap__skeleton"
        aria-hidden="true"
      >
        <span class="tux-milestone-roadmap__skel tux-milestone-roadmap__skel--title" />
        <span class="tux-milestone-roadmap__skel tux-milestone-roadmap__skel--meta" />
        <span class="tux-milestone-roadmap__skel tux-milestone-roadmap__skel--bar" />
      </div>
    </div>

    <div v-else-if="sections.length === 0" class="tux-milestone-roadmap__empty">
      <slot name="empty" :hidden="hiddenCount">
        <UIcon name="lucide:milestone" class="tux-milestone-roadmap__empty-icon" aria-hidden="true" />
        <p class="tux-milestone-roadmap__empty-text">
          {{ hiddenCount ? "No milestone has any items yet." : "No milestones yet." }}
        </p>
      </slot>
    </div>

    <ul v-else class="tux-milestone-roadmap__list" role="list" :aria-label="ariaLabel">
      <li
        v-for="(s, i) in sections"
        :key="s.key"
        class="tux-milestone-roadmap__milestone"
        :class="{
          'tux-milestone-roadmap__milestone--open': isOpen(s),
          'tux-milestone-roadmap__milestone--closed': s.closed,
          'tux-milestone-roadmap__milestone--overdue': s.due?.overdue,
          'tux-milestone-roadmap__milestone--complete': s.progress.complete,
          'tux-milestone-roadmap__milestone--unscheduled': !s.milestone,
        }"
        :data-milestone-key="s.key"
      >
        <div class="tux-milestone-roadmap__head">
          <component :is="headingTag" class="tux-milestone-roadmap__heading">
            <button
              type="button"
              class="tux-milestone-roadmap__toggle"
              data-tux-ms-nav
              :aria-expanded="isOpen(s) ? 'true' : 'false'"
              :aria-controls="ids(i).body"
              :aria-describedby="describedBy(s, i)"
              @click="setOpen(s, !isOpen(s))"
            >
              <UIcon name="lucide:chevron-right" class="tux-milestone-roadmap__chevron" aria-hidden="true" />
              <span class="tux-milestone-roadmap__title">{{ s.title }}</span><span v-if="s.closed" class="tux-milestone-roadmap__sr">, closed</span>
            </button>
            <!-- Visual twin of the sr-only ", closed" in the button's name. -->
            <TuxBadge v-if="s.closed" tone="muted" class="tux-milestone-roadmap__closed" aria-hidden="true">Closed</TuxBadge>
          </component>

          <p
            v-if="s.due"
            :id="ids(i).due"
            class="tux-milestone-roadmap__due"
            :class="[
              `tux-milestone-roadmap__due--${s.due.tone}`,
              s.due.tone === 'warning' && 'tux-warning-dark',
            ]"
          >
            <UIcon
              v-if="s.due.overdue"
              name="lucide:alarm-clock"
              class="tux-milestone-roadmap__due-icon"
              aria-hidden="true"
            />
            <!-- One text run, kept on one line: the spaces around "·" are
                 real text, so the description AT reads is "due Oct 29 · in
                 36 days", not "due Oct 29in 36 days". -->
            <span v-if="s.due.date">due <time :datetime="s.due.iso ?? undefined">{{ s.due.date }}</time><template v-if="s.due.relative"> · <span class="tux-milestone-roadmap__relative">{{ s.due.relative }}</span></template></span>
            <span v-else>{{ s.due.text }}</span>
          </p>

          <p :id="ids(i).progress" class="tux-milestone-roadmap__progress">
            <span class="tux-milestone-roadmap__count">{{ s.progress.done }} of {{ s.progress.total }} done</span>
            <span class="tux-milestone-roadmap__bar" aria-hidden="true">
              <span class="tux-milestone-roadmap__fill" :style="{ width: `${s.progress.percent}%` }" />
            </span>
          </p>

          <button
            v-if="interactive && s.milestone"
            type="button"
            class="tux-milestone-roadmap__open"
            :aria-label="`Open milestone ${s.title}`"
            :title="`Open milestone ${s.title}`"
            @click="emit('selectMilestone', s.milestone.id)"
          >
            <UIcon name="lucide:arrow-up-right" class="tux-milestone-roadmap__open-icon" aria-hidden="true" />
          </button>
        </div>

        <div
          :id="ids(i).body"
          class="tux-milestone-roadmap__body"
          :hidden="isOpen(s) ? false : 'until-found'"
          @beforematch="setOpen(s, true)"
        >
          <p v-if="s.milestone?.description" class="tux-milestone-roadmap__description">
            {{ s.milestone.description }}
          </p>
          <ul v-if="s.items.length" class="tux-milestone-roadmap__items" role="list">
            <li v-for="item in s.items" :key="`${s.key}/${item.id}`" class="tux-milestone-roadmap__item">
              <component
                :is="interactive ? 'button' : 'div'"
                :type="interactive ? 'button' : undefined"
                class="tux-milestone-roadmap__row"
                :class="{
                  'tux-milestone-roadmap__row--done': item.done,
                  'tux-milestone-roadmap__row--area': item.kind === 'area',
                }"
                :data-tux-ms-nav="interactive ? '' : undefined"
                :aria-label="interactive && !$slots.item ? rowLabel(item) : undefined"
                @click="onSelect(item)"
              >
                <slot name="item" :item="item" :milestone="s.milestone">
                  <span class="tux-milestone-roadmap__line">
                    <UIcon
                      v-if="item.done"
                      name="lucide:circle-check"
                      class="tux-milestone-roadmap__mark tux-milestone-roadmap__mark--done"
                      aria-hidden="true"
                    />
                    <UIcon v-else name="lucide:circle" class="tux-milestone-roadmap__mark" aria-hidden="true" />
                    <span class="tux-milestone-roadmap__main">
                      <span v-if="item.done" class="tux-milestone-roadmap__sr">Done: </span>
                      <TuxBadge
                        v-if="item.status"
                        :tone="item.status.tone"
                        class="tux-milestone-roadmap__status"
                      >{{ item.status.label }}</TuxBadge>
                      <span class="tux-milestone-roadmap__item-title">
                        <span v-if="item.kind === 'area'" class="tux-milestone-roadmap__sr">Area: </span>{{ item.title }}
                      </span>
                      <TuxBadge
                        v-if="item.flag"
                        :tone="item.flag.tone"
                        class="tux-milestone-roadmap__flag"
                      >{{ item.flag.label }}</TuxBadge>
                    </span>
                    <span v-if="item.ref" class="tux-milestone-roadmap__ref">{{ item.ref }}</span>
                  </span>
                </slot>
              </component>
            </li>
          </ul>
          <p v-else class="tux-milestone-roadmap__none">
            {{ s.milestone ? "No items in this milestone." : "Every item has a milestone." }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tux-milestone-roadmap {
  container-type: inline-size;
  container-name: tux-milestone-roadmap;
  font-family: var(--font-body);
  color: var(--text-primary);
}

.tux-milestone-roadmap__sr {
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

.tux-milestone-roadmap__list,
.tux-milestone-roadmap__items {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tux-milestone-roadmap__list {
  display: grid;
  gap: 0.75rem;
}

/* ── Section ─────────────────────────────────────────────────────── */
.tux-milestone-roadmap__milestone {
  --tux-ms-fill: var(--brand-primary);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  /* No overflow clipping: it would shave the universal focus ring off
     rows and the toggle near the section's edges. */
}

.tux-milestone-roadmap__milestone--closed { --tux-ms-fill: var(--text-muted); }
.tux-milestone-roadmap__milestone--complete { --tux-ms-fill: var(--color-success); }

/* Overdue with open items: an error rule down the leading edge, on top
   of the "N days overdue" wording and the alarm icon. */
.tux-milestone-roadmap__milestone--overdue {
  --tux-ms-fill: var(--color-error);
  border-inline-start: 4px solid var(--color-error);
}

.tux-milestone-roadmap__milestone--unscheduled {
  border-style: dashed;
}

/* ── Header ──────────────────────────────────────────────────────── */
/* Narrow (the base): title row, then due, then progress, each under
   the title. Wide: progress moves to its own right-hand column. */
.tux-milestone-roadmap__head {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    "heading  open"
    "due      due"
    "progress progress";
  align-items: center;
  column-gap: 0.75rem;
  row-gap: 0.25rem;
  /* 0.75rem start: the chevron lines up with the row marks below it. */
  padding: 0.75rem 0.5rem 0.75rem 0.75rem;
  border-radius: inherit;
  transition: background-color var(--motion-fast) var(--ease-standard);
}

.tux-milestone-roadmap__milestone--open .tux-milestone-roadmap__head {
  border-end-start-radius: 0;
  border-end-end-radius: 0;
}

.tux-milestone-roadmap__head:hover {
  background: color-mix(in srgb, var(--brand-primary) 5%, transparent);
}

.tux-milestone-roadmap__heading {
  grid-area: heading;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.5rem;
  min-width: 0;
  margin: 0;
  font-size: inherit;
}

.tux-milestone-roadmap__toggle {
  display: inline-flex;
  align-items: flex-start;
  gap: 0.5rem;
  min-width: 0;
  max-width: 100%;
  padding: 0.125rem 0.25rem 0.125rem 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}

/* The whole header row is the toggle's click target; the open button
   sits above this layer. */
.tux-milestone-roadmap__toggle::after {
  content: "";
  position: absolute;
  inset: 0;
}

.tux-milestone-roadmap__chevron {
  flex: none;
  width: 1rem;
  height: 1rem;
  margin-top: 0.1875rem;
  color: var(--text-muted);
  transition: transform var(--motion-fast) var(--ease-standard);
}

.tux-milestone-roadmap__milestone--open .tux-milestone-roadmap__chevron {
  transform: rotate(90deg);
}

.tux-milestone-roadmap__title {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.35;
  color: var(--text-primary);
  overflow-wrap: anywhere;
}

.tux-milestone-roadmap__milestone--closed .tux-milestone-roadmap__title,
.tux-milestone-roadmap__milestone--unscheduled .tux-milestone-roadmap__title {
  color: var(--text-secondary);
}

.tux-milestone-roadmap__due,
.tux-milestone-roadmap__progress {
  margin: 0;
  padding-inline-start: 1.5rem; /* under the title, past the chevron */
}

.tux-milestone-roadmap__due {
  grid-area: due;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 0.25rem;
  font-size: 0.8125rem;
  line-height: 1.4;
}

.tux-milestone-roadmap__due--neutral { color: var(--text-secondary); }
.tux-milestone-roadmap__due--muted { color: var(--text-muted); }
/* warning sets no colour here on purpose: the layer's .tux-warning-dark
   (the contrast-checked amber ink, per theme) colours it, and a scoped
   colour would out-rank that global class. Weight carries the rest. */
.tux-milestone-roadmap__due--warning .tux-milestone-roadmap__relative { font-weight: 600; }
.tux-milestone-roadmap__due--error {
  color: var(--color-error);
  font-weight: 600;
}

.tux-milestone-roadmap__due-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex: none;
}

.tux-milestone-roadmap__progress {
  grid-area: progress;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.tux-milestone-roadmap__count {
  flex: none;
  font-variant-numeric: tabular-nums;
}

.tux-milestone-roadmap__bar {
  flex: 1 1 auto;
  max-width: 14rem;
  height: 0.375rem;
  border-radius: var(--radius-full);
  background: var(--surface-sunken);
  box-shadow: inset 0 0 0 1px var(--surface-border-subtle);
  overflow: hidden;
}

.tux-milestone-roadmap__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--tux-ms-fill);
}

.tux-milestone-roadmap__open {
  grid-area: open;
  position: relative; /* above the toggle's stretched ::after */
  z-index: 1;
  align-self: start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 0;
  border-radius: var(--radius-sm);
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  transition:
    background-color var(--motion-fast) var(--ease-standard),
    color var(--motion-fast) var(--ease-standard);
}

.tux-milestone-roadmap__open:hover {
  background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
  color: var(--brand-primary);
}

.tux-milestone-roadmap__open-icon {
  width: 1rem;
  height: 1rem;
}

@container tux-milestone-roadmap (min-width: 34rem) {
  .tux-milestone-roadmap__head {
    /* The open column is reserved even where there is no button ("No
       milestone"), so every section's progress bar ends at the same x. */
    grid-template-columns: minmax(0, 1fr) minmax(9rem, 13rem) 2rem;
    grid-template-areas:
      "heading progress open"
      "due     progress open";
  }

  .tux-milestone-roadmap__progress {
    flex-direction: column;
    align-items: stretch;
    gap: 0.3125rem;
    padding-inline-start: 0;
    text-align: end;
  }

  .tux-milestone-roadmap__bar {
    flex: none;
    width: 100%;
    max-width: none;
  }

  .tux-milestone-roadmap__open { align-self: center; }

  .tux-milestone-roadmap--static .tux-milestone-roadmap__head {
    grid-template-columns: minmax(0, 1fr) minmax(9rem, 13rem);
    grid-template-areas:
      "heading progress"
      "due     progress";
  }
}

/* ── Body ────────────────────────────────────────────────────────── */
/* No box styling on __body itself: hidden="until-found" keeps the
   element's own box, so padding here would show as a gap when closed. */
.tux-milestone-roadmap__description {
  margin: 0;
  padding: 0.625rem 0.75rem 0.25rem 2.25rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-secondary);
  white-space: pre-line;
  border-top: 1px solid var(--surface-border-subtle);
}

.tux-milestone-roadmap__items {
  padding: 0.375rem;
  border-top: 1px solid var(--surface-border-subtle);
}

.tux-milestone-roadmap__description + .tux-milestone-roadmap__items {
  border-top: 0;
}

/* The row is a plain block so a custom #item body lays itself out; the
   default body's columns live on __line. */
.tux-milestone-roadmap__row {
  display: block;
  width: 100%;
  padding: 0.4375rem 0.5rem 0.4375rem 0.375rem;
  border: 0;
  border-radius: var(--radius-sm);
  background: none;
  color: var(--text-primary);
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.4;
  text-align: start;
}

button.tux-milestone-roadmap__row {
  cursor: pointer;
  transition: background-color var(--motion-fast) var(--ease-standard);
}

button.tux-milestone-roadmap__row:hover {
  background: color-mix(in srgb, var(--brand-primary) 6%, transparent);
}

.tux-milestone-roadmap__line {
  display: grid;
  grid-template-columns: 1rem minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 0.5rem;
}

.tux-milestone-roadmap__mark {
  width: 1rem;
  height: 1rem;
  color: var(--text-muted);
}

.tux-milestone-roadmap__mark--done { color: var(--color-success); }

.tux-milestone-roadmap__main {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.5rem;
  min-width: 0;
}

.tux-milestone-roadmap__item-title {
  flex: 1 1 12rem;
  min-width: 0;
  overflow-wrap: anywhere;
}

.tux-milestone-roadmap__row--area .tux-milestone-roadmap__item-title {
  font-weight: 700;
}

.tux-milestone-roadmap__row--done {
  color: var(--text-muted);
}

.tux-milestone-roadmap__row--done .tux-milestone-roadmap__item-title {
  text-decoration: line-through;
  text-decoration-color: color-mix(in srgb, var(--text-muted) 70%, transparent);
}

.tux-milestone-roadmap__status,
.tux-milestone-roadmap__flag {
  flex: none;
}

.tux-milestone-roadmap__ref {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
  white-space: nowrap;
}

.tux-milestone-roadmap__none {
  margin: 0;
  padding: 0.625rem 0.75rem 0.75rem 2.25rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
  border-top: 1px solid var(--surface-border-subtle);
}

/* Phone-panel widths: refs step aside so titles keep the line. */
@container tux-milestone-roadmap (max-width: 24rem) {
  .tux-milestone-roadmap__ref { display: none; }
  .tux-milestone-roadmap__line { grid-template-columns: 1rem minmax(0, 1fr); }
}

/* ── Empty + loading ─────────────────────────────────────────────── */
.tux-milestone-roadmap__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
  border: 1px dashed var(--surface-border);
  border-radius: var(--radius-md);
  text-align: center;
  color: var(--text-muted);
}

.tux-milestone-roadmap__empty-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.tux-milestone-roadmap__empty-text {
  margin: 0;
  font-size: 0.875rem;
}

.tux-milestone-roadmap__loading {
  display: grid;
  gap: 0.75rem;
}

.tux-milestone-roadmap__skeleton {
  display: grid;
  gap: 0.5rem;
  padding: 0.875rem 0.75rem 0.875rem 2.25rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
}

.tux-milestone-roadmap__skel {
  display: block;
  height: 0.75rem;
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  animation: tux-milestone-roadmap-pulse 1.6s ease-in-out infinite;
}

.tux-milestone-roadmap__skel--title { width: 45%; height: 1rem; }
.tux-milestone-roadmap__skel--meta { width: 30%; }
.tux-milestone-roadmap__skel--bar { width: min(14rem, 60%); height: 0.375rem; }

@keyframes tux-milestone-roadmap-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}

@media (prefers-reduced-motion: reduce) {
  .tux-milestone-roadmap__skel { animation: none; }
  .tux-milestone-roadmap__chevron,
  .tux-milestone-roadmap__head,
  .tux-milestone-roadmap__open,
  button.tux-milestone-roadmap__row { transition: none; }
}

@media (forced-colors: active) {
  .tux-milestone-roadmap__bar { border: 1px solid CanvasText; }
  .tux-milestone-roadmap__fill { background: CanvasText; forced-color-adjust: none; }
}
</style>
