<script setup>
// Per ADR-0010, keep top-level <script setup> expressions plain JS;
// typed fixtures live in the sibling demo-data module (ADR-0011).
import {
  emptyMilestones,
  oddMilestones,
  programMilestones,
  roadmapMilestones,
  roadmapUnscheduled,
} from "./milestone-roadmap.demo-data";

useHead({ title: "TuxMilestoneRoadmap · TUX" });

const milestones = roadmapMilestones();
const unscheduled = roadmapUnscheduled();
const program = programMilestones();
const odd = oddMilestones();
const empties = emptyMilestones();

const lastEvent = ref("Nothing selected yet.");
function onSelect(id) {
  lastEvent.value = `select(${JSON.stringify(id)}) — the forge opens this item in its side panel.`;
}
function onSelectMilestone(id) {
  lastEvent.value = `selectMilestone(${JSON.stringify(id)}) — the forge opens the milestone.`;
}

const flagshipVue = `<tux-milestone-roadmap
  :milestones="milestones"
  :unscheduled="unscheduled"
  @select="openItem"
  @select-milestone="openMilestone"
/>

<!-- milestones: [{
  id: 4, title: 'Forgejo v17 hop', dueOn: '2026-10-29', state: 'open',
  description: 'Upgrade from v16 once …',
  items: [
    { id: 162, kind: 'area', title: 'Forgejo v17 upgrade', ref: '#162',
      status: { label: 'In progress', tone: 'warning' } },
    { id: 187, title: 'Pin the v17 image by digest', ref: '#187', done: true },
    { id: 191, title: 'Runner image: bump act_runner', ref: 'tti/runner-image#9',
      status: { label: 'Ready', tone: 'info' },
      flag: { label: 'Waiting on 2', tone: 'error' } },
  ],
}, …] -->`;

const narrowVue = `<div style="max-width: 340px">
  <tux-milestone-roadmap :milestones="milestones" :unscheduled="unscheduled" />
</div>`;

const readonlyVue = `<h3>Project 0-7245 · milestones</h3>
<tux-milestone-roadmap :milestones="program" :interactive="false" :level="4" />`;

const slotVue = `<tux-milestone-roadmap :milestones="program">
  <template #item="{ item, milestone }">
    <span class="flex items-baseline gap-2">
      <span :class="item.done && 'line-through'">{{ item.title }}</span>
      <span class="text-xs text-text-muted">{{ milestone?.title }}</span>
    </span>
  </template>
</tux-milestone-roadmap>`;

const oddVue = `<tux-milestone-roadmap :milestones="odd" :hide-empty="false" />`;

const loadingVue = `<tux-milestone-roadmap :milestones="[]" loading />`;

const emptyVue = `<!-- nothing at all -->
<tux-milestone-roadmap :milestones="[]" />

<!-- milestones exist, none has items (hideEmpty) -->
<tux-milestone-roadmap :milestones="empties" />`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · work surface" title="TuxMilestoneRoadmap">
      A Redmine-style milestone roadmap: one section per milestone, with
      its due date, how far along it is, and the items in it. It is the
      "Milestones" view of a repository's Roadmap tab on the forge. It
      holds no data of its own: the host passes milestones in, gets
      <code>select</code> / <code>selectMilestone</code> back, and
      re-renders.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · the forge's Roadmap tab</p>
      <h2 class="heading--bold text-xl font-bold">Milestones, soonest first</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Open milestones run by due date, so an overdue one leads; then open
        milestones with no date, then closed ones; items with no milestone
        come last. <em>Build prod</em> is past due with work still open: it
        carries an error rule and says <em>overdue</em> in words. Closed
        and fully done milestones start collapsed. Empty milestones
        (<em>Someday</em>) are left out unless <code>hideEmpty</code> is off.
        Areas (epics) are bold; done items are struck through.
      </p>
      <TuxExample class="mt-4" :vue="flagshipVue">
        <TuxMilestoneRoadmap
          :milestones="milestones"
          :unscheduled="unscheduled"
          @select="onSelect"
          @select-milestone="onSelectMilestone"
        />
        <p class="mt-3 text-xs font-mono text-text-muted" role="status">{{ lastEvent }}</p>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">narrow · phone panel</p>
      <h2 class="heading--bold text-xl font-bold">340px wide</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Container queries, not the viewport: in a narrow panel the progress
        line drops under the title and the refs step aside so titles keep
        the line. The same component at full width puts progress in its
        own column.
      </p>
      <TuxExample class="mt-4" :vue="narrowVue">
        <div style="max-width: 340px">
          <TuxMilestoneRoadmap :milestones="milestones" :unscheduled="unscheduled" aria-label="Milestones (narrow)" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">read-only · program page</p>
      <h2 class="heading--bold text-xl font-bold">No item panel to open</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        <code>:interactive="false"</code> renders rows as text, with no
        select events and no "open milestone" buttons; sections still open
        and close. Use it where there is nowhere to send a click, such as a
        program page summary. <code>level</code> sets the heading level of
        the milestone titles (default 3); here they sit under the page's own
        h3, so they are h4.
      </p>
      <TuxExample class="mt-4" :vue="readonlyVue">
        <div class="max-w-2xl">
          <h3 class="heading--bold text-base font-bold mb-3">Project 0-7245 · milestones</h3>
          <TuxMilestoneRoadmap :milestones="program" :interactive="false" :level="4" aria-label="Program milestones" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">slot · custom row body</p>
      <h2 class="heading--bold text-xl font-bold"><code>#item</code></h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        The slot replaces a row's body and gets <code>{ item, milestone }</code>
        (<code>milestone</code> is <code>null</code> in "No milestone").
        The row stays a button that emits <code>select</code>, so slot
        content must be plain text and inline elements, with nothing
        focusable inside. A custom body names the button from its own text.
      </p>
      <TuxExample class="mt-4" :vue="slotVue">
        <div class="max-w-2xl">
          <TuxMilestoneRoadmap :milestones="program" aria-label="Program milestones (custom rows)">
            <template #item="{ item, milestone }">
              <span class="flex items-baseline gap-2">
                <span :class="item.done && 'line-through'">{{ item.title }}</span>
                <span class="text-xs text-text-muted">{{ milestone?.title }}</span>
              </span>
            </template>
          </TuxMilestoneRoadmap>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">states · data that shouldn't happen</p>
      <h2 class="heading--bold text-xl font-bold">Odd milestones, handled</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        An impossible date reads as "no due date". A closed milestone is
        never "overdue", even with open items. An open milestone whose
        items are all done after its date reads "3 days ago" and starts
        collapsed. Open work due today, or within a week, reads as a
        warning. With <code>:hide-empty="false"</code>, an empty milestone
        shows "0 of 0 done".
      </p>
      <TuxExample class="mt-4" :vue="oddVue">
        <div class="max-w-3xl">
          <TuxMilestoneRoadmap :milestones="odd" :hide-empty="false" aria-label="Odd milestones" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">states · loading and empty</p>
      <h2 class="heading--bold text-xl font-bold">Before there is anything to show</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        <code>loading</code> shows section-shaped placeholders and one
        polite "Loading milestones" status; the pulse stops under reduced
        motion. The empty state tells "no milestones" apart from "none has
        items yet". <code>#empty="{ hidden }"</code> replaces it.
      </p>
      <TuxExample class="mt-4" :vue="loadingVue">
        <div class="max-w-2xl">
          <TuxMilestoneRoadmap :milestones="[]" loading />
        </div>
      </TuxExample>
      <TuxExample class="mt-4" :vue="emptyVue">
        <div class="grid gap-4 max-w-2xl">
          <TuxMilestoneRoadmap :milestones="[]" />
          <TuxMilestoneRoadmap :milestones="empties" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">accessibility · keyboard</p>
      <h2 class="heading--bold text-lg font-bold">Headings, disclosures, buttons</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Each milestone title is a heading holding a disclosure button
        (<code>aria-expanded</code>, <code>aria-controls</code>), described
        by its due line and progress ("due Oct 29 · in 36 days, 1 of 5
        done"). Rows are real buttons. <kbd>↑</kbd> / <kbd>↓</kbd> move
        between headers and visible rows, and <kbd>Home</kbd> /
        <kbd>End</kbd> jump to the first and last; Tab order is unchanged.
        Collapsed sections use <code>hidden="until-found"</code>, so
        find-in-page still reaches their items and opens the section where
        the browser supports it. Done, area and overdue are carried by
        words, not colour alone.
      </p>
    </section>
  </div>
</template>
