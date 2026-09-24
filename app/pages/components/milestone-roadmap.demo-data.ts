// Relative path (not `~/`) so this resolves the same whether tti-ux is
// built standalone or consumed as a Nuxt layer.
import type { TuxMilestone, TuxMilestoneItem } from "../../components/TuxMilestoneRoadmap.vue";

// Sibling demo data per ADR-0011: status/flag tones are string unions
// that page-level inference would widen to `string`.
//
// Due dates are computed from today on each call (not at module load),
// so the showcase always reads "in 36 days" / "12 days overdue" — and a
// dev server left running past midnight doesn't hydrate yesterday's data.

function daysFromToday(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const inProgress = { label: "In progress", tone: "warning" } as const;
const ready = { label: "Ready", tone: "info" } as const;
const review = { label: "In review", tone: "info" } as const;
const waiting = (n: number) => ({ label: `Waiting on ${n}`, tone: "error" } as const);

/** The forge's own roadmap, roughly: the Roadmap tab's "Milestones" view. */
export function roadmapMilestones(): TuxMilestone[] {
  return [
    {
      id: 7,
      title: "Before opening",
      dueOn: null,
      description: "Everything that has to be true before the forge opens to all of TTI.",
      items: [
        { id: 201, kind: "area", title: "Accessibility pass", ref: "#201", status: inProgress },
        { id: 202, kind: "area", title: "Docs and the guided tour", ref: "#202", status: ready },
        { id: 203, title: "Keyboard map for the Roadmap tab", ref: "#203", status: ready },
        { id: 204, title: "Contrast audit on every injected panel", ref: "#204", done: true },
        { id: 205, title: "Screen-reader pass on the item panel", ref: "#205", flag: waiting(1) },
        { id: 206, title: "Tour: first repository", ref: "#206" },
        { id: 207, title: "Tour: first pull request with the review panel", ref: "#207" },
        { id: 208, title: "Help page: what the AI panel does and does not do", ref: "#208", status: review },
        { id: 209, title: "Help page: service accounts live in Entra", ref: "#209", done: true },
        { id: 210, title: "Status page link in the footer", ref: "#210" },
        { id: 211, title: "Retire the old wiki landing page", ref: "tti/wiki#14", flag: waiting(2) },
        { id: 212, title: "Offboarding: archive a departed owner's repositories", ref: "#212" },
        { id: 213, title: "Support channel and on-call rotation", ref: "#213" },
        { id: 214, title: "Quota defaults per organization", ref: "#214" },
        { id: 215, title: "Large-file storage limits documented", ref: "#215", done: true },
        { id: 216, title: "Email templates in TTI voice", ref: "#216" },
        { id: 217, title: "Search: index wiki pages", ref: "#217" },
        { id: 218, title: "Renovate onboarding for the pilot orgs", ref: "#218", status: ready },
        { id: 219, title: "Security page: how to report a finding", ref: "#219" },
        { id: 220, title: "Branch-protection presets", ref: "#220" },
        { id: 221, title: "Default labels for new repositories", ref: "#221" },
        { id: 222, title: "Migrate the ten busiest GitLab projects", ref: "#222", flag: waiting(3) },
        { id: 223, title: "Announcement copy for the all-hands", ref: "#223" },
        { id: 224, title: "Training session recording", ref: "#224" },
        { id: 225, title: "Feedback form linked from every page", ref: "#225" },
      ],
    },
    {
      id: 4,
      title: "Forgejo v17 hop",
      dueOn: daysFromToday(36),
      description: "Upgrade from v16 once the branding overlay and runner image are verified against it.",
      items: [
        { id: 162, kind: "area", title: "Forgejo v17 upgrade", ref: "#162", status: inProgress },
        { id: 187, title: "Pin the v17 image by manifest-list digest", ref: "#187", done: true },
        { id: 188, title: "Rebase the branding templates on v17", ref: "#188", status: inProgress },
        { id: 190, title: "Re-verify the Actions status integers", ref: "#190", status: ready },
        { id: 191, title: "Runner image: bump act_runner for v17", ref: "tti/runner-image#9", status: ready, flag: waiting(2) },
      ],
    },
    {
      id: 5,
      title: "Roadmap tab v1",
      dueOn: daysFromToday(6),
      items: [
        { id: 250, kind: "area", title: "Work surface in TUX", ref: "#250", status: inProgress },
        { id: 254, title: "Shadow-DOM island spike", ref: "#254", done: true },
        { id: 255, title: "Item panel gateway", ref: "#255", done: true },
        { id: 256, title: "Milestones view", ref: "#256", status: review },
      ],
    },
    {
      id: 2,
      title: "Build prod",
      dueOn: daysFromToday(-12),
      items: [
        { id: 170, kind: "area", title: "Production VM", ref: "#170", status: inProgress },
        { id: 172, title: "NSG: 443 only, SSH from campus", ref: "#172", done: true },
        { id: 173, title: "Quadlet units for the gateway", ref: "#173", done: true },
        { id: 174, title: "Caddy route for the AI gateway", ref: "#174", done: true },
        { id: 176, title: "Nightly backup: a real restore drill", ref: "#176", status: ready, flag: waiting(1) },
        { id: 177, title: "Secrets rotation runbook", ref: "#177", done: true },
      ],
    },
    {
      id: 1,
      title: "Pilot on boards-demo",
      dueOn: daysFromToday(-40),
      state: "closed",
      items: [
        { id: 120, kind: "area", title: "Boards parity pilot", ref: "#120", done: true },
        { id: 121, title: "Label taxonomy", ref: "#121", done: true },
        { id: 122, title: "Epic roll-up", ref: "#122", done: true },
        { id: 123, title: "Burndown", ref: "#123", done: true },
      ],
    },
    // Empty: left out while hideEmpty is on (the default).
    { id: 9, title: "Someday", dueOn: null, items: [] },
  ];
}

export function roadmapUnscheduled(): TuxMilestoneItem[] {
  return [
    { id: 241, title: "Investigate the monthly GCM consent popup", ref: "#241", status: ready },
    { id: 9001, title: "Label taxonomy cleanup across pilot orgs", ref: "tti/boards#9" },
    { id: 243, title: "Remove stale runner labels", ref: "#243", done: true },
  ];
}

/** A program page's read-only summary. */
export function programMilestones(): TuxMilestone[] {
  return [
    {
      id: "p2",
      title: "Phase II — corridor deployment",
      dueOn: daysFromToday(58),
      items: [
        { id: "a", kind: "area", title: "Instrument I-35, SH 45 to US 79", status: inProgress },
        { id: "b", title: "42 re-identification stations reporting", done: true },
        { id: "c", title: "Probe-vehicle backfill for segment 7", status: ready },
      ],
    },
    {
      id: "p1",
      title: "Phase I — pilot",
      dueOn: daysFromToday(-120),
      state: "closed",
      items: [
        { id: "d", title: "Sponsor sign-off on detection thresholds", done: true },
        { id: "e", title: "Kickoff and research plan", done: true },
      ],
    },
  ];
}

/**
 * States that "shouldn't happen" but do: a date that isn't one, a closed
 * milestone with open items, an open milestone whose items are all done
 * after its due date, one due today, and an empty milestone.
 */
export function oddMilestones(): TuxMilestone[] {
  return [
    {
      id: "bad-date",
      title: "Typo in the due date",
      dueOn: "2026-02-31",
      items: [{ id: 1, title: "Reads as “no due date”, not a crash", ref: "#1" }],
    },
    {
      id: "closed-open",
      title: "Closed with work left",
      dueOn: daysFromToday(-5),
      state: "closed",
      items: [
        { id: 2, title: "Closed milestones are history: never “overdue”", ref: "#2" },
        { id: 3, title: "This one was finished", ref: "#3", done: true },
      ],
    },
    {
      id: "done-late",
      title: "Finished, never closed",
      dueOn: daysFromToday(-3),
      items: [{ id: 4, title: "Past due, nothing open: “3 days ago”, starts collapsed", ref: "#4", done: true }],
    },
    {
      id: "today",
      title: "Due today",
      dueOn: daysFromToday(0),
      items: [{ id: 5, title: "Open work due today reads as a warning", ref: "#5", status: inProgress }],
    },
    { id: "empty", title: "Nothing in it yet", dueOn: daysFromToday(20), items: [] },
  ];
}

export function emptyMilestones(): TuxMilestone[] {
  return [
    { id: 1, title: "Q4", dueOn: daysFromToday(60), items: [] },
    { id: 2, title: "Q1", dueOn: daysFromToday(150), items: [] },
  ];
}
