<script setup>
// Per ADR-0010, keep top-level <script setup> expressions plain JS;
// typed fixtures live in the sibling demo-data module (ADR-0011).
import {
  roadmapDependencies,
  roadmapMilestones,
  roadmapRows,
  sprintDependencies,
  sprintMilestones,
  sprintRows,
  yearMilestones,
  yearRange,
  yearRows,
} from "./timeline.demo-data";

useHead({ title: "TuxTimeline · TUX" });

const selected = ref(162);
const lastEvent = ref("Nothing yet. Click or press Enter on a label, a bar or a marker.");

function onSelect(id) {
  selected.value = id;
  lastEvent.value = `select → ${id}`;
}

function onSelectMarker(id) {
  lastEvent.value = `selectMarker → ${id}`;
}

const roadmapVue = `<TuxTimeline
  :rows="rows"
  :milestones="milestones"
  :dependencies="dependencies"
  :selected="openItemId"
  aria-label="Roadmap timeline"
  @select="openItemPanel"
  @select-marker="openMarker"
/>

<!-- rows: areas of work and their items -->
{ id: 171, group: "Forge platform", indent: true,
  label: "Forgejo v17 hop", sublabel: "#171 · In progress",
  start: "2026-09-12", end: "2026-10-12", tone: "info", progress: 0.4,
  markers: [{ id: "v17-rc1", at: "2026-09-21", label: "v17.0-rc1 tagged" }] }

<!-- dependencies: \`to\` waits on \`from\` -->
{ from: 171, to: 172 }`;

const sprintVue = `<TuxTimeline
  :rows="sprintRows"
  :milestones="[{ id: 'review', at: '2026-10-08', label: 'Sprint review' }]"
  :dependencies="sprintDependencies"
  scale="week"
/>`;

const yearVue = `<TuxTimeline
  :rows="yearRows"
  :milestones="yearMilestones"
  :range="{ start: '2026-05-27', end: '2027-12-17' }"
  scale="quarter"
/>`;

const narrowVue = `<div style="width: 340px">
  <TuxTimeline :rows="rows" :milestones="milestones" :dependencies="dependencies" />
</div>`;

const emptyVue = `<TuxTimeline :rows="[]" />`;
const loadingVue = `<TuxTimeline :rows="[]" loading />`;
const unscheduledOnlyVue = `<TuxTimeline :rows="[
  { id: 240, label: 'Boards analytics export', sublabel: '#240 · Backlog' },
  { id: 241, label: 'Offboarding audit', sublabel: '#241 · Backlog' },
]" />`;

const unscheduledOnlyRows = [
  { id: 240, label: "Boards analytics export", sublabel: "#240 · Backlog" },
  { id: 241, label: "Offboarding audit", sublabel: "#241 · Backlog" },
];
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component · planning" title="TuxTimeline">
      A planning timeline in the shape of a GitLab or GitHub Projects
      roadmap: rows against a time axis, with bars for spans, diamonds for
      due dates, markers for points in time, milestone lines, a today
      line, and dependency arrows that turn red when the order can't
      work. On the forge it is the <strong>Timeline</strong> view of a
      repository's Roadmap tab. Rows are areas of work and their items,
      and each bar runs from when work started to when its milestone is
      due.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · roadmap tab</p>
      <h2 class="heading--bold text-xl font-bold">Areas, items, milestones and one impossible order</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-3xl">
        About six months of a forge roadmap, grouped by theme. Areas
        (bold) have their items indented under them. <em>Re-seed org
        workflows</em> starts before <em>Forgejo v17 hop</em> ends, so
        that arrow is red and dashed, both bar edges it joins are drawn in
        the error colour, and both labels carry a warning icon. Every bar
        and marker is a button whose accessible name includes its dates.
        Two rows have no dates, so they are listed under Unscheduled
        rather than dropped. The track scrolls so that today is in view.
      </p>
      <TuxExample class="mt-4" :vue="roadmapVue" preview-padding="p-4">
        <TuxTimeline
          :rows="roadmapRows"
          :milestones="roadmapMilestones"
          :dependencies="roadmapDependencies"
          :selected="selected"
          aria-label="Roadmap timeline"
          @select="onSelect"
          @select-marker="onSelectMarker"
        />
        <p class="mt-3 text-xs font-mono text-text-secondary" role="status">
          {{ lastEvent }}
        </p>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">scale · week</p>
      <h2 class="heading--bold text-xl font-bold">One sprint, by the week</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-3xl">
        The default <code>scale="auto"</code> picks a scale from the span
        it has to show: weeks up to 10 weeks, months up to about 18
        months, quarters beyond that. Week ticks start on a Monday. A row
        with only an <code>end</code> is drawn as a diamond on its due
        date (<em>Showcase page</em>).
      </p>
      <TuxExample class="mt-4" :vue="sprintVue" preview-padding="p-4">
        <TuxTimeline
          :rows="sprintRows"
          :milestones="sprintMilestones"
          :dependencies="sprintDependencies"
          scale="week"
          aria-label="Sprint timeline"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">scale · quarter · explicit range</p>
      <h2 class="heading--bold text-xl font-bold">A year and a half, by quarter</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-3xl">
        <code>range</code> sets the visible window (its end is inclusive).
        A row with only a <code>start</code> is an open-ended bar that
        fades out (<em>Buckets</em>). Bars that run past the edge of the
        range get a dashed end. A row that falls entirely outside the
        range becomes a small chevron at that edge, which is still a
        focusable button.
      </p>
      <TuxExample class="mt-4" :vue="yearVue" preview-padding="p-4">
        <TuxTimeline
          :rows="yearRows"
          :milestones="yearMilestones"
          :range="yearRange"
          scale="quarter"
          label-width="13rem"
          aria-label="Eighteen-month plan"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">narrow · phone panel</p>
      <h2 class="heading--bold text-xl font-bold">340px wide</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-3xl">
        The label column never takes more than about 42% of the
        component's width. This uses a container query, not the viewport
        width. Labels are truncated, and the full text shows in a tooltip
        on hover or focus. The track still scrolls sideways, and the label
        column stays pinned while it does.
      </p>
      <TuxExample class="mt-4" :vue="narrowVue" preview-padding="p-4">
        <div style="width: 340px; max-width: 100%">
          <TuxTimeline
            :rows="roadmapRows"
            :milestones="roadmapMilestones"
            :dependencies="roadmapDependencies"
            aria-label="Roadmap timeline, narrow"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">states</p>
      <h2 class="heading--bold text-xl font-bold">Empty, loading, nothing scheduled</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-3xl">
        With no rows, the component shows an empty state; the
        <code>#empty</code> slot replaces its text. <code>loading</code>
        shows skeleton rows and sets <code>aria-busy</code>. If every row
        is unscheduled, the empty state is shown with those rows listed
        below it.
      </p>
      <div class="mt-4 grid gap-4 lg:grid-cols-3">
        <TuxExample :vue="emptyVue" preview-padding="p-4">
          <TuxTimeline :rows="[]" aria-label="Empty timeline" />
        </TuxExample>
        <TuxExample :vue="loadingVue" preview-padding="p-4">
          <TuxTimeline :rows="[]" loading aria-label="Loading timeline" />
        </TuxExample>
        <TuxExample :vue="unscheduledOnlyVue" preview-padding="p-4">
          <TuxTimeline :rows="unscheduledOnlyRows" aria-label="Unscheduled work" />
        </TuxExample>
      </div>
    </section>

    <section>
      <p class="eyebrow">contract</p>
      <h2 class="heading--bold text-xl font-bold">Props, events, keyboard</h2>
      <ul class="mt-3 space-y-2 text-sm text-text-secondary leading-relaxed max-w-3xl list-disc pl-5">
        <li>
          <code>rows</code>: <code>id, label, sublabel?, group?, indent?, start?, end?, tone?, progress?, done?, markers?</code>.
          Dates can be <code>Date</code> objects or <code>"YYYY-MM-DD"</code>
          strings, and a date-only string is read as a local day.
          <code>end</code> is inclusive.
        </li>
        <li>
          <code>milestones</code> are drawn as dashed lines at the end of
          their day, so bars due that day end exactly on the line.
          <code>dependencies</code> are <code>{ from, to }</code> pairs, where
          <code>to</code> waits on <code>from</code>. An arrow is red when
          <code>from</code>'s last day falls after <code>to</code>'s first
          day. Finishing and starting on the same day is allowed.
        </li>
        <li>
          Optional props: <code>scale</code>, <code>range</code>,
          <code>today</code>, <code>labelWidth</code>,
          <code>selected</code> (highlights a row and sets
          <code>aria-current</code>), <code>loading</code>,
          <code>ariaLabel</code>, and <code>maxHeight</code> (caps the
          height so the header sticks).
        </li>
        <li>
          Events: <code>select(rowId)</code> fires for a label, bar,
          diamond or unscheduled row, and <code>selectMarker(markerId)</code>
          fires for a marker. Slots: <code>#label="{ row }"</code> and
          <code>#empty</code>.
        </li>
        <li>
          Keyboard: in the label column, <kbd>↑</kbd>/<kbd>↓</kbd> move
          between rows, <kbd>Home</kbd>/<kbd>End</kbd> jump to the first or
          last row, and <kbd>→</kbd> moves onto the row's bar. On the track,
          <kbd>←</kbd>/<kbd>→</kbd> step through a row's bar and markers
          (<kbd>←</kbd> from the first one goes back to the label),
          <kbd>↑</kbd>/<kbd>↓</kbd> move to the nearest item in the next
          row, and <kbd>Esc</kbd> hides the tooltip.
        </li>
        <li>
          The date helpers (date → x, ticks, detecting an impossible order)
          are named exports of the component module, for example
          <code>import { tuxTimelineDependencies } from "…/TuxTimeline.vue"</code>.
        </li>
      </ul>
    </section>

    <section>
      <p class="eyebrow">which timeline?</p>
      <h2 class="heading--bold text-xl font-bold">TuxTimeline vs TuxActivityTimeline</h2>
      <div class="mt-3 grid gap-4 md:grid-cols-2 max-w-4xl text-sm leading-relaxed">
        <div>
          <p class="font-bold">TuxTimeline (this page)</p>
          <p class="text-text-secondary mt-1">
            A horizontal plan: what runs when, and what waits on what.
            Rows share a time axis and have spans, due dates, dependencies
            and a today line. Use it for roadmaps, release plans and
            sprints.
          </p>
        </div>
        <div>
          <p class="font-bold">
            <NuxtLink to="/components/activity-timeline" class="link-tti">TuxActivityTimeline</NuxtLink>
          </p>
          <p class="text-text-secondary mt-1">
            A vertical, editorial list of events that already happened,
            each with a timestamp. It has no axis and no spans. Use it for
            project history, ingest and agent feeds, and session logs.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
