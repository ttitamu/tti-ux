<script lang="ts">
/**
 * Pure layout math for TuxTimeline — exported from this plain <script>
 * block so a host (and the tests) can import it from the component
 * module: `import { tuxDateToX } from ".../TuxTimeline.vue"`.
 *
 * It lives in the component module (not app/utils/) so it travels with
 * the component: the forge's plain-Vue island does not auto-import TUX
 * utils, and a host importing TuxTimeline.vue gets the math with it.
 * Framework-free and DOM-free.
 *
 * Date model: the timeline works in whole LOCAL calendar days. A date-only
 * string ("2026-10-29") is that local day — never UTC midnight, which
 * would render as Oct 28 anywhere west of Greenwich. Day arithmetic goes
 * through `tuxDayNumber` (days since the epoch, computed from the local
 * y/m/d via Date.UTC) so a daylight-saving change never makes a day 23 or
 * 25 hours wide.
 *
 * Span semantics:
 *   - `end` is INCLUSIVE: a bar due Oct 29 covers Oct 29, so it ends at the
 *     start of Oct 30 on the axis — exactly where a milestone line for an
 *     Oct 29 due date sits.
 *   - A dependency is impossible when `from`'s last day is AFTER `to`'s
 *     first day. Finishing and starting on the same day is allowed.
 */

import { computed, nextTick, onBeforeUnmount, ref, shallowRef, watch } from "vue";
// ^ used by the <script setup> block below (one module; imports go first).

export type TuxTimelineTone = "info" | "success" | "warning" | "error" | "neutral" | "muted";
export type TuxTimelineScale = "week" | "month" | "quarter";
export type TuxTimelineId = string | number;
export type TuxTimelineDateInput = string | Date | null | undefined;

export interface TuxTimelineMarker {
  id: TuxTimelineId;
  at: string | Date;
  label: string;
  tone?: TuxTimelineTone;
}

export interface TuxTimelineRow {
  id: TuxTimelineId;
  label: string;
  /** e.g. "#163 · In progress" */
  sublabel?: string;
  /** Rows sharing a group render under one group header. */
  group?: string;
  /** Child rows (items under an area) indent under their parent. */
  indent?: boolean;
  /** Bar start. */
  start?: string | Date | null;
  /** Bar end (due), inclusive. */
  end?: string | Date | null;
  tone?: TuxTimelineTone;
  /** 0..1, drawn as a fill inside the bar. */
  progress?: number;
  /** Muted. */
  done?: boolean;
  markers?: TuxTimelineMarker[];
}

export interface TuxTimelineMilestone {
  id: TuxTimelineId;
  at: string | Date;
  label: string;
}

/** `to` waits on `from`. */
export interface TuxTimelineDependency {
  from: TuxTimelineId;
  to: TuxTimelineId;
}

export const TUX_TIMELINE_DAY_MS = 86_400_000;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ── dates ───────────────────────────────────────────────────────────────────

/**
 * Parse a timeline date to a local calendar day (time stripped). Accepts a
 * Date, a date-only ISO string (read as a LOCAL day), or any string
 * `Date.parse` understands (a timestamp; its local day is used). Returns
 * null for null/empty/unparseable input and impossible dates (2026-02-31).
 */
export function tuxTimelineDate(value: TuxTimelineDateInput): Date | null {
  if (value == null || value === "") return null;
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  if (typeof value !== "string") return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const d = new Date(y, mo, Number(m[3]));
    return d.getMonth() === mo && d.getDate() === Number(m[3]) ? d : null;
  }
  const t = Date.parse(value);
  if (Number.isNaN(t)) return null;
  const d = new Date(t);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Whole days since 1970-01-01 for the date's LOCAL calendar day. */
export function tuxDayNumber(date: Date): number {
  return Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / TUX_TIMELINE_DAY_MS);
}

/** Inverse of `tuxDayNumber`: local midnight of that day. */
export function tuxDateFromDayNumber(day: number): Date {
  const u = new Date(day * TUX_TIMELINE_DAY_MS);
  return new Date(u.getUTCFullYear(), u.getUTCMonth(), u.getUTCDate());
}

/**
 * Date → x. The x of the START of `date`'s day, `pxPerDay` wide per day,
 * measured from the start of `rangeStart`'s day. DST-proof (whole days).
 */
export function tuxDateToX(date: Date, rangeStart: Date, pxPerDay: number): number {
  return (tuxDayNumber(date) - tuxDayNumber(rangeStart)) * pxPerDay;
}

/** "Oct 1, 2026" — or "Oct 1" with `withYear = false`. Locale-fixed (en-US
 *  short months) so labels are deterministic across hosts and tests. */
export function tuxTimelineFormatDate(date: Date, withYear = true): string {
  const base = `${MONTHS[date.getMonth()]} ${date.getDate()}`;
  return withYear ? `${base}, ${date.getFullYear()}` : base;
}

/**
 * Human date range for accessible names and tooltips:
 *   "Oct 1 to Oct 29, 2026" · "Dec 15, 2026 to Jan 20, 2027" ·
 *   "due Oct 29, 2026" (end only) · "from Oct 1, 2026, no due date".
 */
export function tuxTimelineFormatRange(start: Date | null, end: Date | null): string {
  if (start && end) {
    if (tuxDayNumber(start) === tuxDayNumber(end)) return tuxTimelineFormatDate(end);
    if (start.getFullYear() === end.getFullYear()) {
      return `${tuxTimelineFormatDate(start, false)} to ${tuxTimelineFormatDate(end)}`;
    }
    return `${tuxTimelineFormatDate(start)} to ${tuxTimelineFormatDate(end)}`;
  }
  if (end) return `due ${tuxTimelineFormatDate(end)}`;
  if (start) return `from ${tuxTimelineFormatDate(start)}, no due date`;
  return "no dates";
}

// ── scale + ticks ───────────────────────────────────────────────────────────

/** Minimum pixels per day at each scale (~120px per week / month / quarter
 *  cell). The component stretches past this to fill a wide container. */
export const TUX_TIMELINE_PX_PER_DAY: Readonly<Record<TuxTimelineScale, number>> = {
  week: 18,
  month: 4,
  quarter: 1.4,
};

/** Auto scale from a visible span in days: ≤ 10 weeks → week, ≤ ~18
 *  months → month, longer → quarter. */
export function tuxTimelineAutoScale(spanDays: number): TuxTimelineScale {
  if (spanDays <= 70) return "week";
  if (spanDays <= 550) return "month";
  return "quarter";
}

/** Start of the period containing `date`: the Monday of its ISO week, the
 *  1st of its month, or the 1st of its quarter. */
export function tuxTimelinePeriodStart(date: Date, scale: TuxTimelineScale): Date {
  if (scale === "week") {
    const n = tuxDayNumber(date);
    // Day 0 (1970-01-01) was a Thursday → Monday-based index 3.
    const dow = (((n + 3) % 7) + 7) % 7;
    return tuxDateFromDayNumber(n - dow);
  }
  if (scale === "month") return new Date(date.getFullYear(), date.getMonth(), 1);
  return new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3, 1);
}

/** Start of the period AFTER the one containing `date`. */
export function tuxTimelineNextPeriod(date: Date, scale: TuxTimelineScale): Date {
  const p = tuxTimelinePeriodStart(date, scale);
  if (scale === "week") return tuxDateFromDayNumber(tuxDayNumber(p) + 7);
  if (scale === "month") return new Date(p.getFullYear(), p.getMonth() + 1, 1);
  return new Date(p.getFullYear(), p.getMonth() + 3, 1);
}

export interface TuxTimelineTick {
  key: string;
  /** "Oct 5" (week; the Monday, with the year on the first tick and on a
   *  year change) · "Oct 2026" (month) · "2026-Q4" (quarter). */
  label: string;
  /** First day of the period, clamped to the range. */
  start: Date;
  /** First day AFTER the period, clamped to the range (exclusive). */
  end: Date;
}

/**
 * Header ticks: one per week / month / quarter overlapping
 * [start, end) — `end` exclusive. Periods cut by the range edges are
 * clamped, not dropped, so the header always covers the whole track.
 */
export function tuxTimelineTicks(start: Date, end: Date, scale: TuxTimelineScale): TuxTimelineTick[] {
  const s = tuxDayNumber(start);
  const e = tuxDayNumber(end);
  if (!(e > s)) return [];
  const out: TuxTimelineTick[] = [];
  let p = tuxTimelinePeriodStart(start, scale);
  let prevYear: number | null = null;
  // Guard: a malformed range can never spin forever.
  for (let guard = 0; tuxDayNumber(p) < e && guard < 5000; guard++) {
    const next = tuxTimelineNextPeriod(p, scale);
    const y = p.getFullYear();
    let label: string;
    if (scale === "week") {
      label = tuxTimelineFormatDate(p, prevYear === null || prevYear !== y);
    } else if (scale === "month") {
      label = `${MONTHS[p.getMonth()]} ${y}`;
    } else {
      label = `${y}-Q${Math.floor(p.getMonth() / 3) + 1}`;
    }
    out.push({
      key: `${scale}-${y}-${p.getMonth() + 1}-${p.getDate()}`,
      label,
      start: tuxDateFromDayNumber(Math.max(tuxDayNumber(p), s)),
      end: tuxDateFromDayNumber(Math.min(tuxDayNumber(next), e)),
    });
    prevYear = y;
    p = next;
  }
  return out;
}

// ── rows ────────────────────────────────────────────────────────────────────

export type TuxTimelineSpanKind = "bar" | "point" | "open" | "markers" | "unscheduled";

export interface TuxTimelineSpan {
  /**
   * bar — start and end · point — end only (a diamond at the due date) ·
   * open — start only (drawn to the range end, fading) · markers — no
   * dates but dated markers · unscheduled — nothing to place.
   */
  kind: TuxTimelineSpanKind;
  start: Date | null;
  end: Date | null;
  /** The row's end was before its start; the dates were swapped to draw. */
  inverted: boolean;
}

export function tuxTimelineSpan(row: TuxTimelineRow): TuxTimelineSpan {
  let s = tuxTimelineDate(row.start);
  let e = tuxTimelineDate(row.end);
  if (s && e) {
    const inverted = tuxDayNumber(e) < tuxDayNumber(s);
    if (inverted) [s, e] = [e, s];
    return { kind: "bar", start: s, end: e, inverted };
  }
  if (e) return { kind: "point", start: null, end: e, inverted: false };
  if (s) return { kind: "open", start: s, end: null, inverted: false };
  const dated = (row.markers ?? []).some((m) => tuxTimelineDate(m.at) !== null);
  return { kind: dated ? "markers" : "unscheduled", start: null, end: null, inverted: false };
}

export interface TuxTimelineSection {
  /** null for rows without a group. */
  group: string | null;
  rows: TuxTimelineRow[];
}

/**
 * Split rows into on-track sections and the Unscheduled block.
 * Sections appear in the order their group first appears; rows keep their
 * given order inside a section. Rows with nothing to place (no start, no
 * end, no dated marker) go to `unscheduled` — never silently dropped.
 */
export function tuxTimelineSections(rows: readonly TuxTimelineRow[]): {
  sections: TuxTimelineSection[];
  unscheduled: TuxTimelineRow[];
} {
  const sections: TuxTimelineSection[] = [];
  const unscheduled: TuxTimelineRow[] = [];
  const byGroup = new Map<string, TuxTimelineSection>();
  for (const row of rows) {
    if (tuxTimelineSpan(row).kind === "unscheduled") {
      unscheduled.push(row);
      continue;
    }
    const group = row.group ? row.group : null;
    const key = group === null ? "\u0000" : `g:${group}`;
    let section = byGroup.get(key);
    if (!section) {
      section = { group, rows: [] };
      byGroup.set(key, section);
      sections.push(section);
    }
    section.rows.push(row);
  }
  return { sections, unscheduled };
}

// ── range ───────────────────────────────────────────────────────────────────

export interface TuxTimelineRangeInput {
  rows: readonly TuxTimelineRow[];
  milestones?: readonly TuxTimelineMilestone[];
  today?: Date | null;
  scale?: TuxTimelineScale | "auto";
  range?: { start: string | Date; end: string | Date } | null;
}

export interface TuxTimelineResolvedRange {
  /** First visible day. */
  start: Date;
  /** First day AFTER the visible range (exclusive). */
  end: Date;
  days: number;
  scale: TuxTimelineScale;
}

const PAD_DAYS: Readonly<Record<TuxTimelineScale, number>> = { week: 3, month: 10, quarter: 21 };

/**
 * The visible range. An explicit `range` (end inclusive) wins when it is
 * valid. Otherwise: the span of every start, end, marker, milestone and
 * today, padded a little and snapped outward to whole periods of the
 * scale — so the header never opens or closes on a sliver.
 */
export function tuxTimelineRange(input: TuxTimelineRangeInput): TuxTimelineResolvedRange {
  const requested = input.scale && input.scale !== "auto" ? input.scale : null;

  if (input.range) {
    const a = tuxTimelineDate(input.range.start);
    const b = tuxTimelineDate(input.range.end);
    if (a && b && tuxDayNumber(b) >= tuxDayNumber(a)) {
      const s = tuxDayNumber(a);
      const e = tuxDayNumber(b) + 1;
      return { start: a, end: tuxDateFromDayNumber(e), days: e - s, scale: requested ?? tuxTimelineAutoScale(e - s) };
    }
  }

  let lo = Infinity;
  let hi = -Infinity;
  const take = (v: TuxTimelineDateInput) => {
    const d = tuxTimelineDate(v);
    if (!d) return;
    const n = tuxDayNumber(d);
    if (n < lo) lo = n;
    if (n > hi) hi = n;
  };
  take(input.today ?? null);
  for (const row of input.rows) {
    take(row.start);
    take(row.end);
    for (const m of row.markers ?? []) take(m.at);
  }
  for (const m of input.milestones ?? []) take(m.at);
  if (!Number.isFinite(lo)) {
    lo = hi = tuxDayNumber(new Date());
  }

  const scale = requested ?? tuxTimelineAutoScale(hi - lo + 1);
  const pad = PAD_DAYS[scale];
  const start = tuxTimelinePeriodStart(tuxDateFromDayNumber(lo - pad), scale);
  const end = tuxTimelineNextPeriod(tuxDateFromDayNumber(hi + pad), scale);
  return { start, end, days: tuxDayNumber(end) - tuxDayNumber(start), scale };
}

// ── dependencies ────────────────────────────────────────────────────────────

export interface TuxTimelineDependencyState {
  from: TuxTimelineId;
  to: TuxTimelineId;
  fromRow: TuxTimelineRow;
  toRow: TuxTimelineRow;
  /**
   * impossible — `from` ends after `to` starts · ok — the order works ·
   * unknown — `from` has no end or `to` has no date at all.
   */
  status: "ok" | "impossible" | "unknown";
  /** `from`'s last day (its end, or its due date for a point). */
  fromEnd: Date | null;
  /** `to`'s first day (its start, or its due date for a point). */
  toStart: Date | null;
}

/**
 * Resolve dependencies against rows (ids compared as strings, so 163 and
 * "163" match). Dependencies whose rows are missing — or that point a row
 * at itself — are skipped.
 */
export function tuxTimelineDependencies(
  rows: readonly TuxTimelineRow[],
  dependencies: readonly TuxTimelineDependency[],
): TuxTimelineDependencyState[] {
  const byId = new Map<string, TuxTimelineRow>();
  for (const r of rows) byId.set(String(r.id), r);
  const out: TuxTimelineDependencyState[] = [];
  for (const d of dependencies) {
    const fromRow = byId.get(String(d.from));
    const toRow = byId.get(String(d.to));
    if (!fromRow || !toRow || fromRow === toRow) continue;
    const a = tuxTimelineSpan(fromRow);
    const b = tuxTimelineSpan(toRow);
    const fromEnd = a.end;
    const toStart = b.start ?? b.end;
    const status = fromEnd && toStart
      ? (tuxDayNumber(fromEnd) > tuxDayNumber(toStart) ? "impossible" : "ok")
      : "unknown";
    out.push({ from: d.from, to: d.to, fromRow, toRow, status, fromEnd, toStart });
  }
  return out;
}

/** True when `to` cannot start before `from` ends — `from`'s last day is
 *  after `to`'s first day. Unknown dates are never "impossible". */
export function tuxTimelineIsImpossible(from: TuxTimelineRow, to: TuxTimelineRow): boolean {
  return tuxTimelineDependencies([from, to], [{ from: from.id, to: to.id }])[0]?.status === "impossible";
}

/** "Re-seed workflows can't start before Forgejo v17 hop ends (ends Oct 12, 2026; starts Oct 4, 2026)" */
export function tuxTimelineConflictText(dep: TuxTimelineDependencyState): string {
  const when = dep.fromEnd && dep.toStart
    ? ` (ends ${tuxTimelineFormatDate(dep.fromEnd)}; starts ${tuxTimelineFormatDate(dep.toStart)})`
    : "";
  return `${dep.toRow.label} can't start before ${dep.fromRow.label} ends${when}`;
}

/**
 * The accessible name of a row's bar / point:
 *   "Forgejo v17 hop — Oct 1 to Oct 29, 2026, 40% done"
 * plus what it waits on, and any impossible order it is part of.
 */
export function tuxTimelineRowLabel(
  row: TuxTimelineRow,
  dependencies: readonly TuxTimelineDependencyState[] = [],
): string {
  const span = tuxTimelineSpan(row);
  let text = `${row.label} — ${tuxTimelineFormatRange(span.start, span.end)}`;
  if (row.done) text += ", done";
  else if (typeof row.progress === "number" && Number.isFinite(row.progress)) {
    text += `, ${Math.round(Math.min(1, Math.max(0, row.progress)) * 100)}% done`;
  }
  if (span.inverted) text += " (the end date is before the start date)";
  const id = String(row.id);
  for (const d of dependencies) {
    if (String(d.to) === id) {
      text += d.status === "impossible"
        ? `. Can't start before ${d.fromRow.label} ends`
        : `. Waits on ${d.fromRow.label}`;
    } else if (String(d.from) === id && d.status === "impossible") {
      text += `. ${d.toRow.label} can't start before this ends`;
    }
  }
  return text;
}

// ── drawing helpers ─────────────────────────────────────────────────────────

const half = (n: number) => Math.round(n * 2) / 2;

/**
 * Elbow path for a dependency arrow, from the END of `from` (x1, y1) to
 * the START of `to` (x2, y2). The last segment always runs rightward into
 * `to`. When there is no room to go straight (x2 is left of x1 plus two
 * stubs — the impossible case, or a tight one) the path steps out, drops
 * to `turnY` (the gap between rows), runs back left, and comes in.
 */
export function tuxTimelineArrowPath(
  x1: number, y1: number, x2: number, y2: number, turnY: number, stub = 8,
): string {
  const [a, b, c, d, t] = [half(x1), half(y1), half(x2), half(y2), half(turnY)];
  if (c - a >= stub * 2) return `M${a} ${b}H${a + stub}V${d}H${c}`;
  return `M${a} ${b}H${a + stub}V${t}H${c - stub}V${d}H${c}`;
}

/** Right-pointing arrowhead with its tip at (x, y). */
export function tuxTimelineArrowHead(x: number, y: number, size = 5): string {
  const [a, b] = [half(x), half(y)];
  return `M${a - size} ${b - size * 0.8}L${a} ${b}L${a - size} ${b + size * 0.8}Z`;
}

export interface TuxTimelineFlagLayout {
  key: string;
  x: number;
  /** start — the label runs right of its line · end — left of it. */
  align: "start" | "end";
  /** Room before the next flag (px); the label truncates past it. */
  maxWidth: number;
}

/**
 * Header flags (milestones, "Today") share one band. Each label may run
 * right until the next flag; the LAST flag flips to the left of its line
 * when the track edge is too close, splitting the gap with its neighbour.
 */
export function tuxTimelineFlags(
  flags: ReadonlyArray<{ key: string; x: number }>,
  trackWidth: number,
  minWidth = 56,
  gap = 6,
): TuxTimelineFlagLayout[] {
  const sorted = [...flags].sort((p, q) => p.x - q.x);
  const out: TuxTimelineFlagLayout[] = sorted.map((f, i) => {
    const nextX = i < sorted.length - 1 ? sorted[i + 1]!.x : trackWidth;
    return { key: f.key, x: f.x, align: "start", maxWidth: Math.max(0, nextX - f.x - gap) };
  });
  const last = out[out.length - 1];
  if (last && last.maxWidth < minWidth) {
    const prev = out[out.length - 2];
    const leftRoom = prev ? last.x - prev.x : last.x;
    if (leftRoom - gap > last.maxWidth) {
      last.align = "end";
      if (prev) {
        const share = Math.max(0, leftRoom / 2 - gap);
        prev.maxWidth = Math.min(prev.maxWidth, share);
        last.maxWidth = share;
      } else {
        last.maxWidth = Math.max(0, leftRoom - gap);
      }
    }
  }
  return out;
}

export interface TuxTimelineTooltipPlacement {
  left: number;
  top: number;
  placement: "above" | "below";
}

/**
 * Place a tooltip for an anchor (x, and the anchor's top/bottom edges),
 * all relative to the component box. Horizontally it centres on the
 * anchor and is clamped inside the box — near the right edge it flips to
 * run leftward, near the left edge rightward. Vertically it sits below
 * the anchor unless that would overflow the box and there is more room
 * above — then it flips above.
 */
export function tuxTimelineTooltipPosition(
  anchor: { x: number; top: number; bottom: number },
  box: { width: number; height: number },
  tip: { width: number; height: number },
  gap = 8,
  edge = 4,
): TuxTimelineTooltipPlacement {
  const maxLeft = Math.max(edge, box.width - tip.width - edge);
  const left = Math.min(Math.max(anchor.x - tip.width / 2, edge), maxLeft);
  const belowTop = anchor.bottom + gap;
  const roomBelow = box.height - belowTop;
  const roomAbove = anchor.top - gap;
  const placement = tip.height <= roomBelow || roomBelow >= roomAbove ? "below" : "above";
  const top = placement === "below" ? belowTop : Math.max(0, anchor.top - gap - tip.height);
  return { left, top, placement };
}
</script>

<script setup lang="ts">
/**
 * TuxTimeline — the planning timeline (GitLab roadmap / GitHub Projects
 * roadmap shape): rows × a time axis, bars for spans, diamonds for due
 * dates, markers for points in time, milestone lines, a today line, and
 * dependency arrows that turn red when the order is impossible.
 *
 * Not TuxActivityTimeline. That one is an editorial VERTICAL event list
 * (what happened, newest first). This one is a HORIZONTAL plan (what
 * runs when, and what waits on what).
 *
 * On the forge it is the "Timeline" view of a repository's Roadmap tab:
 * rows are areas of work and their items; bars run from when work started
 * to when its milestone is due.
 *
 * Layout: one horizontal scroller holds a sticky label column (real
 * buttons, emit `select`) and the track (header ticks, gridlines,
 * milestone + today lines, bars, markers, an SVG dependency overlay).
 * Row heights are fixed px so the overlay and the label column line up
 * without measuring. The track stretches to fill a wide container and
 * scrolls in a narrow one; on mount it scrolls so today is in view.
 *
 * Runs outside Nuxt (the forge's shadow-DOM island): no Nuxt-only APIs,
 * no document-global queries (only this component's own refs), no
 * teleports, and nothing imported from app/utils or app/composables —
 * the pure math is the exported <script> block above.
 *
 * Keyboard: Tab reaches every label, bar, point and marker. In the label
 * column ↑/↓ move between rows, Home/End jump, → enters the row's track
 * items. On the track ←/→ walk a row's items (← from the first returns
 * to the label), ↑/↓ move to the nearest item in the next row, Escape
 * hides the tooltip. Enter/Space activate (native buttons).
 *
 * Slots:
 *   #label="{ row }" — replace a row's label content (inside its button)
 *   #empty           — replace the empty-state copy
 */
interface Props {
  rows: TuxTimelineRow[];
  /** Vertical dashed lines, labelled at the top. */
  milestones?: TuxTimelineMilestone[];
  /** `to` waits on `from`. */
  dependencies?: TuxTimelineDependency[];
  /** Default `auto`: week ≤ 10 weeks, month ≤ ~18 months, else quarter. */
  scale?: "week" | "month" | "quarter" | "auto";
  /** Visible range, end inclusive. Default: the data span padded, always including today. */
  range?: { start: string | Date; end: string | Date };
  /** Default: the current date. */
  today?: Date;
  /** Label column width. Default 16rem; never more than ~42% of a narrow container. */
  labelWidth?: string;
  /** Row id to highlight (e.g. the item open in a side panel); its label gets aria-current. */
  selected?: string | number | null;
  /** Skeleton rows while the host fetches. */
  loading?: boolean;
  /** Accessible name of the whole timeline. */
  ariaLabel?: string;
  /** Cap the height (any CSS length) — the header then sticks while rows scroll. */
  maxHeight?: string;
}

const props = withDefaults(defineProps<Props>(), {
  milestones: () => [],
  dependencies: () => [],
  scale: "auto",
  range: undefined,
  today: undefined,
  labelWidth: "16rem",
  selected: null,
  loading: false,
  ariaLabel: "Timeline",
  maxHeight: undefined,
});

const emit = defineEmits<{
  /** A row's label, bar or point was activated. */
  select: [rowId: string | number];
  /** A marker was activated. */
  selectMarker: [markerId: string | number];
}>();

// Fixed px geometry: the label column, the track and the SVG overlay all
// derive row positions from these, so they can never drift apart.
const ROW_H = 40;
const GROUP_H = 30;
const TICKS_H = 26;
const FLAGS_H = 22;
const HEADER_H = TICKS_H + FLAGS_H;
const POINT_W = 24; // hit box for points and markers (≥ 24px target)
const POINT_HALF = 8; // half-diagonal of the drawn diamond
const STUB_W = 20;
const MIN_BAR = 6;

type Shape = "bar" | "open" | "point" | "stub";

interface TrackItem {
  key: string;
  kind: "bar" | "marker";
  shape: Shape;
  /** Hit box. */
  left: number;
  width: number;
  /** Axis extent of what is drawn (arrows attach here; scroll-into-view uses it). */
  x1: number;
  x2: number;
  outside: "before" | "after" | null;
  clipStart: boolean;
  clipEnd: boolean;
  label: string;
  tone?: TuxTimelineTone;
  marker?: TuxTimelineMarker;
  markerDate?: Date;
}

interface RowView {
  kind: "row";
  key: string;
  row: TuxTimelineRow;
  span: TuxTimelineSpan;
  y: number;
  parent: boolean;
  conflictIn: boolean;
  conflictOut: boolean;
  bar: TrackItem | null;
  /** The bar (or point / stub) and markers, left to right. */
  items: TrackItem[];
}

interface GroupView {
  kind: "group";
  key: string;
  label: string;
  y: number;
}

type View = RowView | GroupView;

const px = (n: number) => `${Math.round(n * 100) / 100}px`;
const dayOf = (d: Date) => tuxDayNumber(d);

// ── time axis ───────────────────────────────────────────────────────────────

const todayDate = computed(() => tuxTimelineDate(props.today ?? new Date()) ?? new Date());

const resolved = computed(() =>
  tuxTimelineRange({
    rows: props.rows,
    milestones: props.milestones,
    today: todayDate.value,
    scale: props.scale,
    range: props.range ?? null,
  }),
);
const startDay = computed(() => dayOf(resolved.value.start));
const endDay = computed(() => dayOf(resolved.value.end));

/** Visible track width (scroller minus label column), measured on the client. */
const availableWidth = ref(0);
const pxPerDay = computed(() => {
  const base = TUX_TIMELINE_PX_PER_DAY[resolved.value.scale];
  const fill = availableWidth.value > 0 ? availableWidth.value / resolved.value.days : 0;
  return Math.max(base, fill);
});
const trackWidth = computed(() => Math.floor(resolved.value.days * pxPerDay.value));
const xOfDay = (day: number) => (day - startDay.value) * pxPerDay.value;

const ticks = computed(() =>
  tuxTimelineTicks(resolved.value.start, resolved.value.end, resolved.value.scale).map((t) => {
    const a = xOfDay(dayOf(t.start));
    const width = xOfDay(dayOf(t.end)) - a;
    // A period cut to a sliver by the range edge shows no label rather
    // than "202…" (≈6.5px per character at 12px, plus the cell padding).
    return { key: t.key, label: t.label, left: a, width, fits: width >= t.label.length * 6.5 + 16 };
  }),
);

const todayDay = computed(() => dayOf(todayDate.value));
const todayInRange = computed(() => todayDay.value >= startDay.value && todayDay.value < endDay.value);
const todayX = computed(() => xOfDay(todayDay.value) + pxPerDay.value / 2);

// A milestone line sits at the END of its due day, where bars due that
// day end (bar ends are inclusive).
const milestoneViews = computed(() =>
  props.milestones.flatMap((m) => {
    const date = tuxTimelineDate(m.at);
    if (!date) return [];
    const day = dayOf(date);
    if (day < startDay.value || day >= endDay.value) return [];
    return [{ key: `ms-${String(m.id)}`, milestone: m, date, x: xOfDay(day + 1) }];
  }),
);

const flagViews = computed(() => {
  const input = milestoneViews.value.map((m) => ({ key: m.key, x: m.x }));
  if (todayInRange.value) input.push({ key: "today", x: todayX.value });
  const byKey = new Map(milestoneViews.value.map((m) => [m.key, m]));
  return tuxTimelineFlags(input, trackWidth.value).map((f) => {
    const m = byKey.get(f.key);
    return {
      ...f,
      today: !m,
      label: m ? m.milestone.label : "Today",
      title: m
        ? `${m.milestone.label} — ${tuxTimelineFormatDate(m.date)}`
        : `Today — ${tuxTimelineFormatDate(todayDate.value)}`,
    };
  });
});

const srSummary = computed(() => {
  const parts: string[] = [];
  if (todayInRange.value) parts.push(`Today is ${tuxTimelineFormatDate(todayDate.value)}.`);
  if (milestoneViews.value.length) {
    parts.push(`Milestones: ${milestoneViews.value
      .map((m) => `${m.milestone.label}, ${tuxTimelineFormatDate(m.date)}`)
      .join("; ")}.`);
  }
  return parts.join(" ");
});

// ── rows ────────────────────────────────────────────────────────────────────

const split = computed(() => tuxTimelineSections(props.rows));
const unscheduled = computed(() => split.value.unscheduled);
const depStates = computed(() => tuxTimelineDependencies(props.rows, props.dependencies));

function barFor(key: string, span: TuxTimelineSpan, label: string): TrackItem | null {
  const W = trackWidth.value;
  const base = {
    key: `${key}:bar`,
    kind: "bar" as const,
    outside: null,
    clipStart: false,
    clipEnd: false,
    label,
  };
  const stub = (side: "before" | "after"): TrackItem => ({
    ...base,
    shape: "stub",
    outside: side,
    left: side === "before" ? 0 : W - STUB_W,
    width: STUB_W,
    x1: side === "before" ? 0 : W - STUB_W,
    x2: side === "before" ? STUB_W : W,
    label: `${label} (${side} the visible range)`,
  });
  if (span.kind === "bar" || span.kind === "open") {
    const a = xOfDay(dayOf(span.start!));
    const b = span.kind === "bar" ? xOfDay(dayOf(span.end!) + 1) : W;
    if (b <= 0) return stub("before");
    if (a >= W) return stub("after");
    const left = Math.max(0, a);
    const right = Math.min(W, Math.max(b, left + MIN_BAR));
    return {
      ...base,
      shape: span.kind,
      left,
      width: right - left,
      x1: left,
      x2: right,
      clipStart: a < 0,
      clipEnd: b > W || span.kind === "open",
    };
  }
  if (span.kind === "point") {
    const cx = xOfDay(dayOf(span.end!)) + pxPerDay.value / 2;
    if (cx < 0) return stub("before");
    if (cx > W) return stub("after");
    return { ...base, shape: "point", left: cx - POINT_W / 2, width: POINT_W, x1: cx - POINT_HALF, x2: cx + POINT_HALF };
  }
  return null;
}

function markersFor(key: string, row: TuxTimelineRow): TrackItem[] {
  const W = trackWidth.value;
  return (row.markers ?? []).flatMap((m, j) => {
    const date = tuxTimelineDate(m.at);
    if (!date) return [];
    const cx = xOfDay(dayOf(date)) + pxPerDay.value / 2;
    if (cx < 0 || cx > W) return [];
    return [{
      key: `${key}:m${j}`,
      kind: "marker" as const,
      shape: "point" as const,
      left: cx - POINT_W / 2,
      width: POINT_W,
      x1: cx,
      x2: cx,
      outside: null,
      clipStart: false,
      clipEnd: false,
      label: `${m.label} — ${tuxTimelineFormatDate(date)}, on ${row.label}`,
      tone: m.tone,
      marker: m,
      markerDate: date,
    }];
  });
}

const layout = computed(() => {
  const conflictIn = new Set<string>();
  const conflictOut = new Set<string>();
  for (const d of depStates.value) {
    if (d.status !== "impossible") continue;
    conflictIn.add(String(d.to));
    conflictOut.add(String(d.from));
  }
  const views: View[] = [];
  let y = 0;
  let n = 0;
  split.value.sections.forEach((section, si) => {
    if (section.group) {
      views.push({ kind: "group", key: `g${si}`, label: section.group, y });
      y += GROUP_H;
    }
    section.rows.forEach((row, ri) => {
      const key = `r${n++}`;
      const span = tuxTimelineSpan(row);
      const bar = barFor(key, span, tuxTimelineRowLabel(row, depStates.value));
      if (bar) bar.tone = row.tone;
      const items = [...(bar ? [bar] : []), ...markersFor(key, row)].sort((a, b) => a.x1 - b.x1);
      views.push({
        kind: "row",
        key,
        row,
        span,
        y,
        parent: !row.indent && !!section.rows[ri + 1]?.indent,
        conflictIn: conflictIn.has(String(row.id)),
        conflictOut: conflictOut.has(String(row.id)),
        bar,
        items,
      });
      y += ROW_H;
    });
  });
  return { views, height: y };
});

const rowViews = computed(() => layout.value.views.filter((v): v is RowView => v.kind === "row"));

// ── dependency arrows ───────────────────────────────────────────────────────

const arrows = computed(() => {
  const byId = new Map<string, RowView>();
  for (const v of rowViews.value) byId.set(String(v.row.id), v);
  return depStates.value.flatMap((d, i) => {
    const a = byId.get(String(d.from));
    const b = byId.get(String(d.to));
    // Skip what cannot be drawn honestly: a missing / unscheduled row,
    // a row off the visible range, or a `from` with no end to leave from.
    if (!a?.bar || !b?.bar || a.bar.outside || b.bar.outside || a.span.kind === "open") return [];
    const x1 = a.bar.x2;
    const x2 = b.bar.x1;
    const y1 = a.y + ROW_H / 2;
    const y2 = b.y + ROW_H / 2;
    const turnY = b.y > a.y ? b.y : b.y + ROW_H;
    const impossible = d.status === "impossible";
    return [{
      key: `dep-${i}-${a.key}-${b.key}`,
      impossible,
      path: tuxTimelineArrowPath(x1, y1, x2, y2, turnY),
      head: tuxTimelineArrowHead(x2, y2),
      title: impossible ? tuxTimelineConflictText(d) : `${d.toRow.label} waits on ${d.fromRow.label}`,
    }];
  });
});

// ── state ───────────────────────────────────────────────────────────────────

const rootEl = ref<HTMLElement | null>(null);
const scrollerEl = ref<HTMLElement | null>(null);
const labelsEl = ref<HTMLElement | null>(null);
const tipEl = ref<HTMLElement | null>(null);
const hoverKey = ref<string | null>(null);

const isSelected = (row: TuxTimelineRow) =>
  props.selected !== null && props.selected !== undefined && String(props.selected) === String(row.id);

function fillOf(row: TuxTimelineRow): number {
  if (row.done) return 1;
  const p = row.progress;
  return typeof p === "number" && Number.isFinite(p) ? Math.min(1, Math.max(0, p)) : 0;
}

// ── measuring + scrolling ───────────────────────────────────────────────────

function visibleTrackWidth(): number {
  const sc = scrollerEl.value;
  const lb = labelsEl.value;
  if (!sc || !lb) return 0;
  return Math.max(0, sc.clientWidth - lb.offsetWidth);
}

function measure() {
  // -1 so a track that exactly fills never rounds up into a scrollbar.
  availableWidth.value = Math.max(0, visibleTrackWidth() - 1);
}

function scrollToToday() {
  const sc = scrollerEl.value;
  if (!sc || !todayInRange.value) return;
  sc.scrollLeft = Math.max(0, todayX.value - visibleTrackWidth() * 0.3);
}

/** Keep a focused track item in the visible part of the track (right of the sticky labels). */
function ensureVisible(x1: number, x2: number) {
  const sc = scrollerEl.value;
  const avail = visibleTrackWidth();
  if (!sc || avail <= 0) return;
  const margin = Math.min(32, avail / 4);
  const viewL = sc.scrollLeft;
  const viewR = viewL + avail;
  const overlap = Math.min(x2, viewR) - Math.max(x1, viewL);
  if (overlap >= Math.min(x2 - x1, avail - 2 * margin)) return;
  if (x1 < viewL || x2 - x1 >= avail - 2 * margin) sc.scrollLeft = Math.max(0, x1 - margin);
  else sc.scrollLeft = x2 - avail + margin;
}

let resizeObserver: ResizeObserver | null = null;
watch(
  scrollerEl,
  async (el) => {
    resizeObserver?.disconnect();
    resizeObserver = null;
    if (!el) return;
    measure();
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => measure());
      resizeObserver.observe(el);
      if (labelsEl.value) resizeObserver.observe(labelsEl.value);
    }
    await nextTick();
    scrollToToday();
  },
  { flush: "post" },
);
onBeforeUnmount(() => resizeObserver?.disconnect());

// ── tooltip ─────────────────────────────────────────────────────────────────

type TipState = { kind: "row"; view: RowView } | { kind: "marker"; view: RowView; item: TrackItem };
const tip = shallowRef<TipState | null>(null);
const tipPos = ref<TuxTimelineTooltipPlacement | null>(null);
let tipAnchor: { el: HTMLElement; clientX: number | null; inTrack: boolean } | null = null;

function showTip(state: TipState, e: Event, inTrack: boolean) {
  const el = e.currentTarget as HTMLElement | null;
  if (!el) return;
  tipAnchor = { el, clientX: "clientX" in e ? (e as MouseEvent).clientX : null, inTrack };
  tip.value = state;
  tipPos.value = null;
  void nextTick(placeTip);
}

function placeTip() {
  const root = rootEl.value;
  const node = tipEl.value;
  if (!root || !node || !tipAnchor) return;
  const rb = root.getBoundingClientRect();
  const r = tipAnchor.el.getBoundingClientRect();
  let lo = r.left;
  let hi = r.right;
  if (tipAnchor.inTrack) {
    // Anchor on the part of the item that is actually visible.
    const lb = labelsEl.value?.getBoundingClientRect();
    const sc = scrollerEl.value?.getBoundingClientRect();
    if (lb) lo = Math.max(lo, lb.right);
    if (sc) hi = Math.min(hi, sc.right);
  }
  let x = tipAnchor.clientX ?? (lo + hi) / 2;
  if (hi >= lo) x = Math.min(Math.max(x, lo), hi);
  tipPos.value = tuxTimelineTooltipPosition(
    { x: x - rb.left, top: r.top - rb.top, bottom: r.bottom - rb.top },
    { width: root.clientWidth, height: root.clientHeight },
    { width: node.offsetWidth, height: node.offsetHeight },
  );
}

function hideTip() {
  tip.value = null;
  tipPos.value = null;
  tipAnchor = null;
}

function onScroll() {
  if (!tipAnchor) return;
  tipAnchor.clientX = null;
  placeTip();
}

const tipRow = computed(() => (tip.value ? tip.value.view.row : null));

const tipDates = computed(() => {
  const t = tip.value;
  if (!t || t.kind !== "row") return "";
  const { span, row } = t.view;
  const parts = [tuxTimelineFormatRange(span.start, span.end)];
  if (span.start && span.end) {
    const n = dayOf(span.end) - dayOf(span.start) + 1;
    parts.push(`${n} ${n === 1 ? "day" : "days"}`);
  }
  if (row.done) parts.push("done");
  else if (typeof row.progress === "number") parts.push(`${Math.round(fillOf(row) * 100)}% done`);
  return parts.join(" · ");
});

const tipLines = computed(() => {
  const t = tip.value;
  if (!t || t.kind !== "row") return [];
  const id = String(t.view.row.id);
  const lines: Array<{ key: string; text: string; error: boolean }> = [];
  if (t.view.span.inverted) {
    lines.push({ key: "inverted", text: "The end date is before the start date", error: true });
  }
  depStates.value.forEach((d, i) => {
    if (String(d.to) === id) {
      lines.push(d.status === "impossible"
        ? { key: `d${i}`, text: `Can't start before ${d.fromRow.label} ends${d.fromEnd ? ` (${tuxTimelineFormatDate(d.fromEnd)})` : ""}`, error: true }
        : { key: `d${i}`, text: `Waits on ${d.fromRow.label}`, error: false });
    } else if (String(d.from) === id && d.status === "impossible") {
      lines.push({ key: `d${i}`, text: `${d.toRow.label} can't start before this ends`, error: true });
    }
  });
  return lines;
});

// ── keyboard ────────────────────────────────────────────────────────────────

function focusKey(key: string | null | undefined) {
  if (!key) return;
  rootEl.value?.querySelector<HTMLElement>(`[data-tl-key="${key}"]`)?.focus();
}

function nearestItem(items: TrackItem[], x: number): TrackItem | undefined {
  let best: TrackItem | undefined;
  let bestD = Infinity;
  for (const it of items) {
    const d = x < it.x1 ? it.x1 - x : x > it.x2 ? x - it.x2 : 0;
    if (d < bestD) {
      best = it;
      bestD = d;
    }
  }
  return best;
}

function onLabelKeydown(view: RowView, e: KeyboardEvent) {
  const rows = rowViews.value;
  const i = rows.indexOf(view);
  let target: string | undefined;
  switch (e.key) {
    case "ArrowDown": target = rows[i + 1]?.key; break;
    case "ArrowUp": target = rows[i - 1]?.key; break;
    case "Home": target = rows[0]?.key; break;
    case "End": target = rows[rows.length - 1]?.key; break;
    case "ArrowRight": target = view.items[0]?.key; break;
    case "Escape": hideTip(); return;
    default: return;
  }
  e.preventDefault();
  focusKey(target);
}

function onItemKeydown(view: RowView, item: TrackItem, e: KeyboardEvent) {
  const idx = view.items.indexOf(item);
  let target: string | undefined;
  switch (e.key) {
    case "ArrowRight": target = view.items[idx + 1]?.key; break;
    case "ArrowLeft": target = idx > 0 ? view.items[idx - 1]?.key : view.key; break;
    case "Home": target = view.items[0]?.key; break;
    case "End": target = view.items[view.items.length - 1]?.key; break;
    case "ArrowDown":
    case "ArrowUp": {
      const rows = rowViews.value;
      const step = e.key === "ArrowDown" ? 1 : -1;
      const mid = (item.x1 + item.x2) / 2;
      for (let j = rows.indexOf(view) + step; j >= 0 && j < rows.length; j += step) {
        const hit = nearestItem(rows[j]!.items, mid);
        if (hit) {
          target = hit.key;
          break;
        }
      }
      break;
    }
    case "Escape": hideTip(); return;
    default: return;
  }
  e.preventDefault();
  focusKey(target);
}

// ── events ──────────────────────────────────────────────────────────────────

function activate(view: RowView, item: TrackItem) {
  if (item.kind === "marker" && item.marker) emit("selectMarker", item.marker.id);
  else emit("select", view.row.id);
}

function onItemEnter(view: RowView, item: TrackItem, e: MouseEvent) {
  hoverKey.value = view.key;
  showTip(item.kind === "marker" ? { kind: "marker", view, item } : { kind: "row", view }, e, true);
}

function onItemFocus(view: RowView, item: TrackItem, e: FocusEvent) {
  hoverKey.value = view.key;
  ensureVisible(item.x1, item.x2);
  showTip(item.kind === "marker" ? { kind: "marker", view, item } : { kind: "row", view }, e, true);
}

function onLabelShow(view: RowView, e: Event) {
  hoverKey.value = view.key;
  showTip({ kind: "row", view }, e, false);
}

function onLeave() {
  hoverKey.value = null;
  hideTip();
}

function onBandEnter(view: View) {
  hoverKey.value = view.kind === "row" ? view.key : null;
}

// ── classes ─────────────────────────────────────────────────────────────────

function itemClasses(view: RowView, item: TrackItem) {
  const tone = item.kind === "marker" ? item.tone : view.row.tone;
  return [
    `tux-timeline__item--${item.kind === "marker" ? "marker" : item.shape}`,
    tone && `tux-timeline__item--${tone}`,
    item.kind === "bar" && view.row.done && "tux-timeline__item--done",
    item.kind === "bar" && view.parent && "tux-timeline__item--parent",
  ];
}

function barClasses(view: RowView, item: TrackItem) {
  return {
    "tux-timeline__bar--open": item.shape === "open",
    "tux-timeline__bar--clip-start": item.clipStart,
    "tux-timeline__bar--clip-end": item.clipEnd && item.shape !== "open",
    "tux-timeline__bar--late-start": view.conflictIn && !item.clipStart,
    "tux-timeline__bar--late-end": view.conflictOut && !item.clipEnd,
    "tux-timeline__bar--inverted": view.span.inverted,
  };
}

const skeletons = [
  { left: 6, width: 34 },
  { left: 18, width: 22 },
  { left: 30, width: 40 },
  { left: 12, width: 18 },
  { left: 44, width: 30 },
];

const rootStyle = computed(() => ({
  "--tux-tl-label-w": props.labelWidth,
  ...(props.maxHeight ? { "--tux-tl-max-h": props.maxHeight } : {}),
}));
</script>

<template>
  <div
    ref="rootEl"
    class="tux-timeline"
    :style="rootStyle"
    role="group"
    :aria-label="ariaLabel"
    :aria-busy="loading ? 'true' : undefined"
  >
    <!-- Loading -->
    <div v-if="loading" class="tux-timeline__loading">
      <span class="tux-timeline__sr" role="status">Loading the timeline…</span>
      <div v-for="(s, i) in skeletons" :key="i" class="tux-timeline__skeleton-row" aria-hidden="true">
        <span class="tux-timeline__skeleton tux-timeline__skeleton--label" />
        <span class="tux-timeline__skeleton-track">
          <span
            class="tux-timeline__skeleton tux-timeline__skeleton--bar"
            :style="{ left: `${s.left}%`, width: `${s.width}%` }"
          />
        </span>
      </div>
    </div>

    <template v-else>
      <!-- Empty: nothing to place on the track (unscheduled rows still list below) -->
      <div v-if="rowViews.length === 0" class="tux-timeline__empty">
        <UIcon name="i-lucide-calendar-off" class="tux-timeline__empty-icon" aria-hidden="true" />
        <slot name="empty">
          <p class="tux-timeline__empty-title">Nothing on the timeline yet</p>
          <p class="tux-timeline__empty-body">
            Work appears here once it has a start or a due date.
          </p>
        </slot>
      </div>

      <template v-else>
        <p v-if="srSummary" class="tux-timeline__sr">{{ srSummary }}</p>

        <div ref="scrollerEl" class="tux-timeline__scroller" @scroll.passive="onScroll">
          <div class="tux-timeline__canvas">
            <!-- Sticky label column -->
            <div ref="labelsEl" class="tux-timeline__labels">
              <div class="tux-timeline__corner" :style="{ height: px(HEADER_H) }">
                <button
                  v-if="todayInRange"
                  type="button"
                  class="tux-timeline__today-btn"
                  aria-label="Scroll to today"
                  @click="scrollToToday"
                >
                  <UIcon name="i-lucide-locate-fixed" class="tux-timeline__today-icon" aria-hidden="true" />
                  <span>Today</span>
                </button>
              </div>

              <template v-for="view in layout.views" :key="view.key">
                <div
                  v-if="view.kind === 'group'"
                  class="tux-timeline__group"
                  :style="{ height: px(GROUP_H) }"
                >
                  <span class="tux-timeline__group-text">{{ view.label }}</span>
                </div>
                <div
                  v-else
                  class="tux-timeline__label-cell"
                  :class="{
                    'tux-timeline__label-cell--indent': view.row.indent,
                    'tux-timeline__label-cell--parent': view.parent,
                    'tux-timeline__label-cell--done': view.row.done,
                    'tux-timeline__label-cell--hover': hoverKey === view.key,
                    'tux-timeline__label-cell--selected': isSelected(view.row),
                  }"
                  :style="{ height: px(ROW_H) }"
                >
                  <button
                    type="button"
                    class="tux-timeline__label"
                    :data-tl-key="view.key"
                    data-tl-part="label"
                    :aria-current="isSelected(view.row) ? 'true' : undefined"
                    @click="emit('select', view.row.id)"
                    @keydown="onLabelKeydown(view, $event)"
                    @focus="onLabelShow(view, $event)"
                    @blur="onLeave"
                    @mouseenter="onLabelShow(view, $event)"
                    @mouseleave="onLeave"
                  >
                    <UIcon
                      v-if="view.row.done"
                      name="i-lucide-check"
                      class="tux-timeline__label-icon"
                      aria-hidden="true"
                    />
                    <span class="tux-timeline__label-text">
                      <slot name="label" :row="view.row">
                        <span class="tux-timeline__label-main">{{ view.row.label }}</span>
                        <span v-if="view.row.sublabel" class="tux-timeline__sublabel">{{ view.row.sublabel }}</span>
                      </slot>
                    </span>
                    <span v-if="view.conflictIn || view.conflictOut" class="tux-timeline__label-alert">
                      <UIcon name="i-lucide-triangle-alert" aria-hidden="true" />
                      <span class="tux-timeline__sr">, schedule conflict</span>
                    </span>
                  </button>
                </div>
              </template>
            </div>

            <!-- Track -->
            <div class="tux-timeline__track" :style="{ width: px(trackWidth) }">
              <div class="tux-timeline__header" :style="{ height: px(HEADER_H) }" aria-hidden="true">
                <div class="tux-timeline__ticks" :style="{ height: px(TICKS_H) }">
                  <div
                    v-for="t in ticks"
                    :key="t.key"
                    class="tux-timeline__tick"
                    :style="{ left: px(t.left), width: px(t.width) }"
                  >
                    <span v-if="t.fits" class="tux-timeline__tick-label">{{ t.label }}</span>
                  </div>
                </div>
                <div class="tux-timeline__flags" :style="{ height: px(FLAGS_H) }">
                  <span
                    v-for="f in flagViews"
                    :key="f.key"
                    class="tux-timeline__flag"
                    :class="{
                      'tux-timeline__flag--end': f.align === 'end',
                      'tux-timeline__flag--today': f.today,
                    }"
                    :style="f.align === 'end'
                      ? { right: px(trackWidth - f.x), maxWidth: px(f.maxWidth) }
                      : { left: px(f.x), maxWidth: px(f.maxWidth) }"
                    :title="f.title"
                  >{{ f.label }}</span>
                </div>
              </div>

              <div class="tux-timeline__body" :style="{ height: px(layout.height) }">
                <div
                  v-for="view in layout.views"
                  :key="`band-${view.key}`"
                  class="tux-timeline__band"
                  :class="{
                    'tux-timeline__band--group': view.kind === 'group',
                    'tux-timeline__band--hover': hoverKey === view.key,
                    'tux-timeline__band--selected': view.kind === 'row' && isSelected(view.row),
                  }"
                  :style="{ top: px(view.y), height: px(view.kind === 'group' ? GROUP_H : ROW_H) }"
                  aria-hidden="true"
                  @mouseenter="onBandEnter(view)"
                  @mouseleave="hoverKey = null"
                />
                <span
                  v-for="t in ticks.slice(1)"
                  :key="`grid-${t.key}`"
                  class="tux-timeline__gridline"
                  :style="{ left: px(t.left) }"
                  aria-hidden="true"
                />
                <span
                  v-for="m in milestoneViews"
                  :key="m.key"
                  class="tux-timeline__milestone-line"
                  :style="{ left: px(m.x) }"
                  aria-hidden="true"
                />

                <!-- Dependency arrows: under the bars, like any Gantt. The
                     overlay is aria-hidden — every bar's accessible name
                     already says what it waits on and any impossible order. -->
                <svg
                  class="tux-timeline__deps"
                  :width="trackWidth"
                  :height="layout.height"
                  :viewBox="`0 0 ${trackWidth} ${layout.height}`"
                  aria-hidden="true"
                >
                  <g
                    v-for="a in arrows"
                    :key="a.key"
                    class="tux-timeline__arrow"
                    :class="{ 'tux-timeline__arrow--impossible': a.impossible }"
                  >
                    <title>{{ a.title }}</title>
                    <path class="tux-timeline__arrow-hit" :d="a.path" />
                    <path class="tux-timeline__arrow-line" :d="a.path" />
                    <path class="tux-timeline__arrow-head" :d="a.head" />
                  </g>
                </svg>

                <template v-for="view in rowViews" :key="`items-${view.key}`">
                  <button
                    v-for="item in view.items"
                    :key="item.key"
                    type="button"
                    class="tux-timeline__item"
                    :class="itemClasses(view, item)"
                    :style="{ left: px(item.left), width: px(item.width), top: px(view.y + ROW_H / 2) }"
                    :aria-label="item.label"
                    :data-tl-key="item.key"
                    data-tl-part="track"
                    @click="activate(view, item)"
                    @keydown="onItemKeydown(view, item, $event)"
                    @focus="onItemFocus(view, item, $event)"
                    @blur="onLeave"
                    @mouseenter="onItemEnter(view, item, $event)"
                    @mouseleave="onLeave"
                  >
                    <span
                      v-if="item.shape === 'bar' || item.shape === 'open'"
                      class="tux-timeline__bar"
                      :class="barClasses(view, item)"
                    >
                      <span
                        v-if="fillOf(view.row) > 0"
                        class="tux-timeline__bar-fill"
                        :style="{ width: `${fillOf(view.row) * 100}%` }"
                      />
                    </span>
                    <span
                      v-else-if="item.shape === 'point' && item.kind === 'bar'"
                      class="tux-timeline__diamond"
                      :class="{ 'tux-timeline__diamond--late': view.conflictIn || view.conflictOut }"
                    />
                    <span v-else-if="item.shape === 'point'" class="tux-timeline__dot" />
                    <UIcon
                      v-else
                      :name="item.outside === 'before' ? 'i-lucide-chevron-left' : 'i-lucide-chevron-right'"
                      class="tux-timeline__stub-icon"
                      aria-hidden="true"
                    />
                  </button>
                </template>

                <span
                  v-if="todayInRange"
                  class="tux-timeline__today-line"
                  :style="{ left: px(todayX) }"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Unscheduled: labels only, never dropped -->
      <section v-if="unscheduled.length" class="tux-timeline__unscheduled">
        <p class="tux-timeline__unscheduled-title">
          Unscheduled <span class="tux-timeline__unscheduled-count">{{ unscheduled.length }}</span>
        </p>
        <ul class="tux-timeline__unscheduled-list" aria-label="Unscheduled">
          <li v-for="row in unscheduled" :key="String(row.id)">
            <button
              type="button"
              class="tux-timeline__unscheduled-item"
              :class="{ 'tux-timeline__unscheduled-item--selected': isSelected(row) }"
              :aria-current="isSelected(row) ? 'true' : undefined"
              @click="emit('select', row.id)"
            >
              <slot name="label" :row="row">
                <span class="tux-timeline__label-main">{{ row.label }}</span>
                <span v-if="row.sublabel" class="tux-timeline__sublabel">{{ row.sublabel }}</span>
              </slot>
            </button>
          </li>
        </ul>
      </section>

      <!-- Tooltip: a visual echo of the focused/hovered item's accessible
           name (so aria-hidden). Centred on the anchor, clamped inside
           the component, flipped above near the bottom edge. -->
      <div
        v-if="tip && tipRow"
        ref="tipEl"
        class="tux-timeline__tooltip"
        :class="{ 'tux-timeline__tooltip--placed': tipPos }"
        :style="tipPos ? { left: px(tipPos.left), top: px(tipPos.top) } : undefined"
        aria-hidden="true"
      >
        <template v-if="tip.kind === 'marker'">
          <p class="tux-timeline__tip-title">{{ tip.item.marker?.label }}</p>
          <p class="tux-timeline__tip-meta">
            {{ tip.item.markerDate ? tuxTimelineFormatDate(tip.item.markerDate) : "" }} · {{ tipRow.label }}
          </p>
        </template>
        <template v-else>
          <p class="tux-timeline__tip-title">{{ tipRow.label }}</p>
          <p v-if="tipRow.sublabel" class="tux-timeline__tip-sub">{{ tipRow.sublabel }}</p>
          <p class="tux-timeline__tip-meta">{{ tipDates }}</p>
          <p
            v-for="line in tipLines"
            :key="line.key"
            class="tux-timeline__tip-line"
            :class="{ 'tux-timeline__tip-line--error': line.error }"
          >
            <UIcon v-if="line.error" name="i-lucide-triangle-alert" class="tux-timeline__tip-icon" />
            <span>{{ line.text }}</span>
          </p>
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
.tux-timeline {
  container-type: inline-size;
  position: relative;
  min-width: 0;
  font-family: var(--font-body);
  color: var(--text-primary);
}

.tux-timeline *,
.tux-timeline *::before,
.tux-timeline *::after {
  box-sizing: border-box;
}

.tux-timeline__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

/* ── scroller + columns ─────────────────────────────────────────────── */

.tux-timeline__scroller {
  overflow: auto;
  max-height: var(--tux-tl-max-h, none);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  overscroll-behavior-x: contain;
  /* Focus-scrolling must not park an item under the sticky labels. */
  scroll-padding-inline-start: min(var(--tux-tl-label-w), 42cqi);
}

.tux-timeline__canvas {
  display: flex;
  width: max-content;
  min-width: 100%;
}

.tux-timeline__labels {
  position: sticky;
  left: 0;
  z-index: 5;
  flex: none;
  /* Narrow containers (a phone panel) never give more than ~42% to labels. */
  width: min(var(--tux-tl-label-w), 42cqi);
  background: var(--surface-raised);
  border-right: 1px solid var(--surface-border);
}

.tux-timeline__track {
  position: relative;
  flex: none;
}

/* ── header ─────────────────────────────────────────────────────────── */

.tux-timeline__corner {
  position: sticky;
  top: 0;
  z-index: 6;
  display: flex;
  align-items: flex-end;
  padding: 0 0.5rem 0.25rem;
  background: var(--surface-raised);
  border-bottom: 1px solid var(--surface-border);
}

.tux-timeline__today-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--brand-primary);
  background: transparent;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: background-color var(--motion-fast) var(--ease-standard);
}

.tux-timeline__today-btn:hover {
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
}

.tux-timeline__today-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.tux-timeline__header {
  position: sticky;
  top: 0;
  z-index: 4;
  background: var(--surface-raised);
  border-bottom: 1px solid var(--surface-border);
}

/* `clip`, not `hidden`: hidden would make these the scroll container
   and break the sticky tick labels below. */
.tux-timeline__ticks,
.tux-timeline__flags {
  position: relative;
  overflow: clip;
}

.tux-timeline__tick {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  overflow: clip;
  border-left: 1px solid var(--surface-border-subtle);
}

.tux-timeline__tick:first-child {
  border-left: 0;
}

/* The period in view keeps its label visible just right of the sticky
   label column while the track scrolls under it. */
.tux-timeline__tick-label {
  position: sticky;
  left: calc(min(var(--tux-tl-label-w), 42cqi) + 0.5rem);
  overflow: hidden;
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tux-timeline__flag {
  position: absolute;
  bottom: 3px;
  overflow: hidden;
  padding: 0 0.375rem;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1rem;
  color: var(--text-secondary);
  white-space: nowrap;
  text-overflow: ellipsis;
  border-left: 1px dashed var(--text-secondary);
}

.tux-timeline__flag--end {
  border-left: 0;
  border-right: 1px dashed var(--text-secondary);
  text-align: right;
}

.tux-timeline__flag--today {
  color: var(--surface-page);
  background: var(--brand-primary);
  border: 0;
  border-radius: var(--radius-sm);
}

/* ── label column rows ──────────────────────────────────────────────── */

.tux-timeline__group {
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  background: var(--surface-sunken);
  border-bottom: 1px solid var(--surface-border-subtle);
}

.tux-timeline__group-text {
  overflow: hidden;
  font-family: var(--font-bold);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tux-timeline__label-cell {
  display: flex;
  align-items: center;
  padding: 0.125rem 0.25rem;
  border-bottom: 1px solid var(--surface-border-subtle);
  transition: background-color var(--motion-fast) var(--ease-standard);
}

.tux-timeline__label-cell--hover {
  background: color-mix(in srgb, var(--brand-primary) 5%, var(--surface-raised));
}

.tux-timeline__label-cell--selected {
  background: color-mix(in srgb, var(--brand-primary) 10%, var(--surface-raised));
  box-shadow: inset 3px 0 0 var(--brand-primary);
}

.tux-timeline__label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0 0.5rem;
  font: inherit;
  color: inherit;
  text-align: left;
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.tux-timeline__label-cell--indent .tux-timeline__label {
  position: relative;
  padding-left: 1.5rem;
}

/* Tree guide for child rows. */
.tux-timeline__label-cell--indent .tux-timeline__label::before {
  content: "";
  position: absolute;
  left: 0.75rem;
  top: 50%;
  width: 0.4375rem;
  height: 1px;
  background: var(--surface-border);
}

.tux-timeline__label-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.tux-timeline__label-main {
  overflow: hidden;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.25;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tux-timeline__label-cell--parent .tux-timeline__label-main {
  font-weight: 700;
}

.tux-timeline__label-cell--done .tux-timeline__label-main {
  color: var(--text-muted);
}

.tux-timeline__sublabel {
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  line-height: 1.3;
  color: var(--text-muted);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tux-timeline__label-icon {
  flex: none;
  width: 0.875rem;
  height: 0.875rem;
  color: var(--color-success);
}

.tux-timeline__label-alert {
  display: inline-flex;
  flex: none;
  color: var(--color-error);
}

/* ── track body ─────────────────────────────────────────────────────── */

.tux-timeline__body {
  position: relative;
}

.tux-timeline__band {
  position: absolute;
  left: 0;
  right: 0;
  border-bottom: 1px solid var(--surface-border-subtle);
  transition: background-color var(--motion-fast) var(--ease-standard);
}

.tux-timeline__band--group {
  background: var(--surface-sunken);
}

.tux-timeline__band--hover {
  background: color-mix(in srgb, var(--brand-primary) 5%, transparent);
}

.tux-timeline__band--selected {
  background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
}

.tux-timeline__gridline,
.tux-timeline__milestone-line,
.tux-timeline__today-line {
  position: absolute;
  top: 0;
  bottom: 0;
  pointer-events: none;
}

.tux-timeline__gridline {
  width: 0;
  border-left: 1px solid var(--surface-border-subtle);
}

.tux-timeline__milestone-line {
  z-index: 1;
  width: 0;
  border-left: 1px dashed var(--text-secondary);
}

.tux-timeline__today-line {
  z-index: 4;
  width: 2px;
  margin-left: -1px;
  background: var(--brand-primary);
}

.tux-timeline__deps {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  overflow: visible;
  pointer-events: none;
}

.tux-timeline__arrow-line {
  fill: none;
  stroke: var(--text-secondary);
  stroke-width: 1.25;
}

.tux-timeline__arrow-head {
  fill: var(--text-secondary);
}

.tux-timeline__arrow-hit {
  fill: none;
  stroke: transparent;
  stroke-width: 8;
  pointer-events: stroke;
}

/* Impossible order: error tone AND a dashed, heavier line (not colour alone). */
.tux-timeline__arrow--impossible .tux-timeline__arrow-line {
  stroke: var(--color-error);
  stroke-width: 2;
  stroke-dasharray: 4 3;
}

.tux-timeline__arrow--impossible .tux-timeline__arrow-head {
  fill: var(--color-error);
}

/* ── items (bars, points, markers, stubs) ───────────────────────────── */

.tux-timeline__item {
  --tux-tl-tone: var(--brand-primary);
  position: absolute;
  z-index: 2;
  height: 28px;
  margin-top: -14px;
  padding: 0;
  color: var(--tux-tl-tone);
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.tux-timeline__item--marker {
  --tux-tl-tone: var(--text-primary);
  z-index: 3;
  height: 24px;
  margin-top: -12px;
}

.tux-timeline__item--point {
  height: 24px;
  margin-top: -12px;
}

.tux-timeline__item--info    { --tux-tl-tone: var(--color-info); }
.tux-timeline__item--success { --tux-tl-tone: var(--color-success); }
.tux-timeline__item--warning { --tux-tl-tone: var(--color-warning); }
.tux-timeline__item--error   { --tux-tl-tone: var(--color-error); }
.tux-timeline__item--neutral { --tux-tl-tone: var(--text-secondary); }
.tux-timeline__item--muted,
.tux-timeline__item--done    { --tux-tl-tone: var(--text-muted); }

.tux-timeline__item:focus-visible,
.tux-timeline__label:focus-visible,
.tux-timeline__today-btn:focus-visible,
.tux-timeline__unscheduled-item:focus-visible {
  outline: 2px solid var(--focus-ring-outer);
  outline-offset: 1px;
}

.tux-timeline__bar {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 14px;
  overflow: hidden;
  background: color-mix(in srgb, var(--tux-tl-tone) 16%, var(--surface-raised));
  border: 1px solid var(--tux-tl-tone);
  border-radius: var(--radius-md);
  transform: translateY(-50%);
  transition: background-color var(--motion-fast) var(--ease-standard);
}

.tux-timeline__item--parent .tux-timeline__bar {
  height: 18px;
}

.tux-timeline__item:hover .tux-timeline__bar {
  background: color-mix(in srgb, var(--tux-tl-tone) 28%, var(--surface-raised));
}

.tux-timeline__bar-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background: color-mix(in srgb, var(--tux-tl-tone) 62%, var(--surface-raised));
}

/* Start only: runs to the range end and fades — no due date. */
.tux-timeline__bar--open {
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  mask-image: linear-gradient(to right, #000 calc(100% - 3rem), transparent);
}

/* Cut by the visible range. */
.tux-timeline__bar--clip-start {
  border-left-style: dashed;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.tux-timeline__bar--clip-end {
  border-right-style: dashed;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.tux-timeline__bar--inverted {
  border-style: dashed;
  border-color: var(--color-error);
}

/* The edges an impossible dependency collides on. */
.tux-timeline__bar--late-start::before,
.tux-timeline__bar--late-end::after {
  content: "";
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--color-error);
}

.tux-timeline__bar--late-start::before { left: 0; }
.tux-timeline__bar--late-end::after { right: 0; }

.tux-timeline__diamond {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  background: var(--tux-tl-tone);
  border: 2px solid var(--surface-raised);
  box-shadow: 0 0 0 1px var(--tux-tl-tone);
  transform: translate(-50%, -50%) rotate(45deg);
}

.tux-timeline__diamond--late {
  box-shadow: 0 0 0 2px var(--color-error);
}

.tux-timeline__dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background: var(--surface-raised);
  border: 2px solid var(--tux-tl-tone);
  border-radius: var(--radius-full);
  transform: translate(-50%, -50%);
}

.tux-timeline__item--stub {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--tux-tl-tone) 12%, var(--surface-raised));
  border: 1px dashed var(--tux-tl-tone);
}

.tux-timeline__stub-icon {
  width: 0.875rem;
  height: 0.875rem;
}

/* ── unscheduled ────────────────────────────────────────────────────── */

.tux-timeline__unscheduled {
  margin-top: 0.75rem;
  padding: 0.625rem 0.75rem;
  background: var(--surface-sunken);
  border: 1px dashed var(--surface-border);
  border-radius: var(--radius-md);
}

.tux-timeline__unscheduled-title {
  margin: 0 0 0.375rem;
  font-family: var(--font-bold);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.tux-timeline__unscheduled-count {
  margin-left: 0.25rem;
  font-family: var(--font-mono);
  letter-spacing: 0;
  color: var(--text-muted);
}

.tux-timeline__unscheduled-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tux-timeline__unscheduled-list > li {
  min-width: 0;
  max-width: 100%;
}

.tux-timeline__unscheduled-item {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  padding: 0.25rem 0.625rem;
  font: inherit;
  color: inherit;
  text-align: left;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.tux-timeline__unscheduled-item:hover {
  border-color: var(--brand-primary);
}

.tux-timeline__unscheduled-item--selected {
  border-color: var(--brand-primary);
  box-shadow: inset 3px 0 0 var(--brand-primary);
}

/* ── empty + loading ────────────────────────────────────────────────── */

.tux-timeline__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 2rem 1rem;
  text-align: center;
  background: var(--surface-raised);
  border: 1px dashed var(--surface-border);
  border-radius: var(--radius-md);
}

.tux-timeline__empty-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--text-muted);
}

.tux-timeline__empty-title {
  margin: 0.25rem 0 0;
  font-weight: 600;
  font-size: 0.9375rem;
}

.tux-timeline__empty-body {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.tux-timeline__loading {
  padding: 0.5rem 0;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.tux-timeline__skeleton-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  height: 40px;
  padding: 0 0.75rem;
}

.tux-timeline__skeleton {
  display: block;
  height: 12px;
  background: color-mix(in srgb, var(--text-muted) 22%, var(--surface-raised));
  border-radius: var(--radius-sm);
  animation: tux-timeline-pulse 1.4s var(--ease-standard) infinite alternate;
}

.tux-timeline__skeleton--label {
  flex: none;
  width: min(9rem, 30cqi);
}

.tux-timeline__skeleton-track {
  position: relative;
  flex: 1;
  height: 14px;
}

.tux-timeline__skeleton--bar {
  position: absolute;
  top: 0;
  height: 14px;
}

@keyframes tux-timeline-pulse {
  from { opacity: 1; }
  to { opacity: 0.45; }
}

/* ── tooltip ────────────────────────────────────────────────────────── */

.tux-timeline__tooltip {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  max-width: min(20rem, calc(100cqi - 0.5rem));
  padding: 0.5rem 0.625rem;
  font-size: 0.75rem;
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  box-shadow: var(--elevation-overlay);
  pointer-events: none;
  visibility: hidden;
}

.tux-timeline__tooltip--placed {
  visibility: visible;
}

.tux-timeline__tooltip p {
  margin: 0;
}

.tux-timeline__tip-title {
  font-weight: 600;
  color: var(--text-primary);
  overflow-wrap: anywhere;
}

.tux-timeline__tip-sub {
  font-family: var(--font-mono);
  color: var(--text-muted);
}

.tux-timeline__tip-meta {
  margin-top: 0.125rem;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.tux-timeline__tip-line {
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;
  margin-top: 0.25rem;
  color: var(--text-secondary);
}

.tux-timeline__tip-line--error {
  font-weight: 600;
  color: var(--color-error);
}

.tux-timeline__tip-icon {
  flex: none;
  width: 0.875rem;
  height: 0.875rem;
  margin-top: 0.0625rem;
}

/* ── narrow containers (a phone panel, ~340px) ──────────────────────── */

@container (max-width: 30rem) {
  .tux-timeline__label {
    padding: 0 0.375rem;
  }

  .tux-timeline__label-cell--indent .tux-timeline__label {
    padding-left: 1rem;
  }

  .tux-timeline__label-cell--indent .tux-timeline__label::before {
    left: 0.375rem;
    width: 0.375rem;
  }

  .tux-timeline__label-main {
    font-size: 0.75rem;
  }

  .tux-timeline__corner {
    padding: 0 0.25rem 0.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tux-timeline__skeleton {
    animation: none;
  }

  .tux-timeline__label-cell,
  .tux-timeline__band,
  .tux-timeline__bar,
  .tux-timeline__today-btn {
    transition: none;
  }
}
</style>
