<script setup>
// Per ADR-0010, keep top-level <script setup> expressions plain JS.
useHead({ title: "TuxActivityTimeline · TUX" });

const milestones = [
  { id: "m0", heading: true, title: "Phase II — deployment" },
  { id: "m1", time: "Aug 2026", datetime: "2026-08", title: "Corridor instrumentation complete", description: "All 42 Bluetooth re-identification stations reporting on I-35 between SH 45 and US 79.", tone: "success", icon: "lucide:check" },
  { id: "m2", time: "Jun 2026", datetime: "2026-06", title: "TxDOT quarterly review", description: "Sponsor sign-off on the revised detection threshold methodology.", current: true },
  { id: "m3", heading: true, title: "Phase I — pilot" },
  { id: "m4", time: "Mar 2026", datetime: "2026-03", title: "Sensor outage — segment 7", description: "11-day gap patched with probe-vehicle data; flagged in the data dictionary.", tone: "warning", icon: "lucide:triangle-alert" },
  { id: "m5", time: "Jan 2026", datetime: "2026-01", title: "Kickoff", description: "Project 0-7245 awarded. Research plan filed." },
];

const feed = [
  { id: "f1", time: "14:32", title: "Ingest completed", description: "TxDOT crash extract · 48,112 rows · 0 rejects.", tone: "success" },
  { id: "f2", time: "14:18", title: "Schema drift detected", description: "CRIS feed added column `rpt_autonomous_unit`. Mapped provisionally.", tone: "warning" },
  { id: "f3", time: "13:47", title: "Agent run started", description: "Corridor-screening pass over District 14.", current: true },
  { id: "f4", time: "12:02", title: "Export delivered", description: "Quarterly safety summary → SharePoint." },
];

const milestonesVue = `<tux-activity-timeline :items="milestones" />`;
const denseVue = `<tux-activity-timeline :items="feed" dense />`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · content" title="TuxActivityTimeline">
      Editorial vertical timeline — a maroon spine, mono timestamps,
      a gold-ringed "current" node. The activity-rail shape that
      program pages (milestones), Landscape dashboards (ingest and
      agent activity), and tti-ai-studio (session history) each
      sketch by hand today. Stateless: the host owns the feed, this
      renders it.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · project milestones</p>
      <h2 class="heading--bold text-xl font-bold">Grouped milestones with tones</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        <code>heading</code> items render as eyebrow-weight group
        rows the spine passes through. Semantic <code>tone</code> +
        optional <code>icon</code> markers use the same palette as
        the badge and alert families; the gold ring marks the one
        <code>current</code> item — "you are here."
      </p>
      <TuxExample class="mt-4" :vue="milestonesVue">
        <div class="max-w-lg">
          <TuxActivityTimeline :items="milestones" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">dense · dashboard rail</p>
      <h2 class="heading--bold text-xl font-bold">Activity feed, rail posture</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        <code>dense</code> tightens the rhythm for a sidebar or
        <code>#aside</code> rail — the Landscape recent-activity tile
        shape. Dot markers only; timestamps carry the cadence.
      </p>
      <TuxExample class="mt-4" :vue="denseVue">
        <div class="max-w-sm">
          <TuxActivityTimeline :items="feed" dense />
        </div>
      </TuxExample>
    </section>
  </div>
</template>
