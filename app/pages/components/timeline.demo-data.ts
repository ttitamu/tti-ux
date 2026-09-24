// Relative path (not `~/`) so this resolves the same whether tti-ux is
// built standalone or consumed as a Nuxt layer.
import type {
  TuxTimelineDependency,
  TuxTimelineMilestone,
  TuxTimelineRow,
} from "../../components/TuxTimeline.vue";

// Sibling demo data per ADR-0011 — the tone literals would widen to
// `string` in the page's JS-only <script setup>.
//
// Dates are RELATIVE to the day the page loads, so "today" always sits
// inside the plan and the demo never goes stale. `iso(n)` is the local
// calendar day n days from today, as the forge sends it ("2026-10-29").
function iso(offsetDays: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0); // midday: a DST change can't move the day
  d.setDate(d.getDate() + offsetDays);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// ── Roadmap tab · Timeline view (month scale, ~6 months) ────────────────────
// Areas of work (type/epic issues) with their items indented under them;
// bars run from when work started to when its milestone is due.

export const roadmapRows: TuxTimelineRow[] = [
  { id: 162, group: "Forge platform", label: "Forgejo v17 upgrade", sublabel: "#162 · Area · In progress",
    start: iso(-40), end: iso(35), tone: "info", progress: 0.45 },
  { id: 170, group: "Forge platform", indent: true, label: "Stage v17 on the laptop stack", sublabel: "#170 · Done",
    start: iso(-40), end: iso(-20), done: true },
  { id: 171, group: "Forge platform", indent: true, label: "Forgejo v17 hop", sublabel: "#171 · In progress",
    start: iso(-12), end: iso(18), tone: "info", progress: 0.4,
    markers: [{ id: "v17-rc1", at: iso(-3), label: "v17.0-rc1 tagged" }] },
  // Starts on day +10 but waits on #171, which ends on day +18: impossible.
  { id: 172, group: "Forge platform", indent: true, label: "Re-seed org workflows", sublabel: "#172 · Blocked",
    start: iso(10), end: iso(35), tone: "warning" },
  { id: 180, group: "Forge platform", label: "Runner image A1.1", sublabel: "#180 · Area · Next",
    start: iso(36), end: iso(95) },
  { id: 181, group: "Forge platform", indent: true, label: "Rootless BuildKit", sublabel: "#181 · Next",
    start: iso(36), end: iso(66) },
  // Due date only: a diamond.
  { id: 182, group: "Forge platform", indent: true, label: "Cache warmers", sublabel: "#182 · Due only",
    end: iso(95) },
  { id: 241, group: "Forge platform", label: "Offboarding audit", sublabel: "#241 · Backlog" },

  { id: 163, group: "Work surface", label: "Roadmap tab", sublabel: "#163 · Area · In progress",
    start: iso(-25), end: iso(60), progress: 0.3 },
  { id: 255, group: "Work surface", indent: true, label: "Item panel gateway", sublabel: "#255 · Done",
    start: iso(-25), end: iso(-2), done: true },
  { id: 260, group: "Work surface", indent: true, label: "Timeline view", sublabel: "#260 · In progress",
    start: iso(-1), end: iso(30), progress: 0.1,
    markers: [{ id: "timeline-design-review", at: iso(7), label: "Design review", tone: "neutral" }] },
  { id: 261, group: "Work surface", indent: true, label: "Burndown in Insights", sublabel: "#261 · Next",
    start: iso(31), end: iso(60) },
  { id: 190, group: "Work surface", label: "TUX 3.0 re-skin", sublabel: "#190 · Area · Planned",
    start: iso(45), end: iso(130), tone: "neutral" },
  { id: 191, group: "Work surface", indent: true, label: "Status palette", sublabel: "#191 · Planned",
    start: iso(45), end: iso(75), tone: "neutral" },
  { id: 192, group: "Work surface", indent: true, label: "Dark teal canon", sublabel: "#192 · Planned",
    start: iso(76), end: iso(130), tone: "neutral",
    markers: [{ id: "hc-audit", at: iso(110), label: "High-contrast audit", tone: "success" }] },
  // No start, no end, no markers: the Unscheduled block, never dropped.
  { id: 240, group: "Work surface", label: "Boards analytics export", sublabel: "#240 · Backlog" },
];

export const roadmapMilestones: TuxTimelineMilestone[] = [
  { id: "v17-live", at: iso(35), label: "Forgejo v17 live" },
  { id: "q4-freeze", at: iso(68), label: "Q4 freeze" },
];

export const roadmapDependencies: TuxTimelineDependency[] = [
  { from: 170, to: 171 },
  { from: 171, to: 172 }, // the impossible one
  { from: 162, to: 180 },
  { from: 181, to: 182 },
  { from: 260, to: 261 },
  { from: 191, to: 192 },
];

// ── A sprint (week scale) ───────────────────────────────────────────────────

export const sprintRows: TuxTimelineRow[] = [
  { id: "s1", label: "Pure helpers + unit tests", sublabel: "#260 · Done", start: iso(-4), end: iso(1), done: true },
  { id: "s2", label: "Label column + track", sublabel: "#260 · In progress", start: iso(2), end: iso(8), progress: 0.2 },
  { id: "s3", label: "Dependency arrows", sublabel: "#260 · Next", start: iso(5), end: iso(12) },
  { id: "s4", label: "Keyboard + tooltip", sublabel: "#260 · Next", start: iso(13), end: iso(17),
    markers: [{ id: "a11y-pass", at: iso(16), label: "Accessibility pass", tone: "success" }] },
  // Due date only: a diamond.
  { id: "s5", label: "Showcase page", sublabel: "#260 · Due", end: iso(18) },
  { id: "s6", label: "Wire into the forge island", sublabel: "#262 · Next", start: iso(19), end: iso(30), tone: "info" },
];

export const sprintMilestones: TuxTimelineMilestone[] = [
  { id: "sprint-review", at: iso(14), label: "Sprint review" },
];

export const sprintDependencies: TuxTimelineDependency[] = [
  { from: "s1", to: "s2" },
  { from: "s3", to: "s4" },
  { from: "s4", to: "s5" },
  { from: "s5", to: "s6" },
];

// ── A year+ plan (quarter scale, explicit range) ────────────────────────────

export const yearRows: TuxTimelineRow[] = [
  // Starts before the visible range: the bar is cut with a dashed start.
  { id: "y0", label: "Forgejo v15 → v16", sublabel: "Platform · done", start: iso(-260), end: iso(-60), done: true },
  // Entirely before the visible range: a chevron stub at the left edge.
  { id: "y00", label: "Gitea exit", sublabel: "Platform · done", start: iso(-400), end: iso(-300), done: true },
  { id: "y1", label: "Forgejo LTS track", sublabel: "Platform", start: iso(-80), end: iso(200), tone: "info", progress: 0.35 },
  { id: "y2", label: "Runner fleet on the Sparks", sublabel: "Platform", start: iso(30), end: iso(260) },
  { id: "y3", label: "Entra group sync v2", sublabel: "Identity", start: iso(120), end: iso(300), tone: "success" },
  // Runs past the end of the visible range: a dashed end.
  { id: "y4", label: "TUX 3.0 everywhere", sublabel: "Work surface", start: iso(45), end: iso(520), tone: "neutral" },
  // Start only: an open-ended bar that fades out — no due date yet.
  { id: "y5", label: "Buckets (Area N)", sublabel: "Storage · no due date", start: iso(200) },
  { id: "y6", label: "CUI enclave decision", sublabel: "Compliance · due only", end: iso(420), tone: "warning" },
];

export const yearRange = { start: iso(-120), end: iso(450) };

export const yearMilestones: TuxTimelineMilestone[] = [
  { id: "fy-start", at: iso(160), label: "FY start" },
];
