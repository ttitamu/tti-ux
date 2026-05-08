<script setup lang="ts">
useHead({ title: "TuxChartSunburst · TUX" });

const programs = [
  {
    label: "Capacity",
    children: [
      { label: "New mainlanes",       value: 480 },
      { label: "Frontage rebuild",    value: 220 },
      { label: "HOV / managed lanes", value: 180 },
    ],
  },
  {
    label: "Preservation",
    children: [
      { label: "Pavement",   value: 320 },
      { label: "Bridge",     value: 240 },
      { label: "Drainage",   value: 110 },
    ],
  },
  {
    label: "Safety",
    children: [
      { label: "Intersection",  value: 175 },
      { label: "Roadside",      value: 95 },
      { label: "Pedestrian",    value: 60 },
    ],
  },
  {
    label: "Operations",
    children: [
      { label: "ITS",          value: 90 },
      { label: "Signals",      value: 60 },
      { label: "Incident mgmt", value: 50 },
    ],
  },
];

const portfolio = [
  {
    label: "Safety",
    children: [
      { label: "Roadway",      value: 28 },
      { label: "Vehicle",      value: 14 },
      { label: "Driver / VRU", value: 10 },
    ],
  },
  {
    label: "Mobility",
    children: [
      { label: "Connected vehicle", value: 22 },
      { label: "Freight",           value: 18 },
      { label: "Transit",           value: 12 },
    ],
  },
  {
    label: "Infrastructure",
    children: [
      { label: "Pavement",  value: 16 },
      { label: "Bridge",    value: 10 },
      { label: "Materials", value:  6 },
    ],
  },
];
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="data viz · hierarchical" title="TuxChartSunburst">
      Two-ring radial breakdown — inner ring is top-level groups,
      outer ring is children with stepped opacity. Use when the
      audience needs to feel the radial structure of a program
      (budget, portfolio, capacity inventory).
      <br><br>
      <span class="text-sm text-text-muted">
        Sunburst is a sister to <code>TuxTreemap</code>. Treemap
        is better when comparative size of children matters
        (rectangles encode area, easier to read for tight ratios).
        Sunburst is better when the radial structure is the story.
        For ranked lists, prefer <code>TuxChartBar</code> — bars
        are far easier to read than any hierarchical chart. Two
        rings is the maximum that stays readable.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · two-ring with legend</p>
      <h2 class="heading--bold text-xl font-bold">Program portfolio</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Inner ring: the four MIP investment categories. Outer
        ring: each category's spend mix. Center carries the
        program total in display-grade tabular numerals. The
        right-side table lists every child with its share — so
        the precise number is always recoverable, not estimated
        off arc length.
      </p>
      <TuxExample class="mt-4">
        <TuxChartFrame
          eyebrow="Exhibit 12.01"
          title="MIP 2025 program portfolio · $2.08B"
          source="TTI Mobility Investment Priorities · 2025"
        >
          <TuxChartSunburst
            :data="programs"
            :size="320"
            center-label="Total"
            :format-total="t => `$${t.toLocaleString()}M`"
          />
        </TuxChartFrame>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">bare · no legend</p>
      <h2 class="heading--bold text-xl font-bold">Tight-layout variant</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        For dashboard tiles or composed exhibits where the legend
        would crowd the surface, set <code>:show-legend="false"</code>.
        Each arc carries an SVG <code>&lt;title&gt;</code> tooltip
        with label · value · share, so the data is still
        accessible — just not laid out beside the chart.
      </p>
      <TuxExample class="mt-4">
        <div class="cs-demo__bare">
          <TuxChartSunburst
            :data="portfolio"
            :size="240"
            :show-legend="false"
            :format-total="t => `$${t}M`"
          />
          <aside>
            <p class="eyebrow">research portfolio · FY 2025</p>
            <p>
              Hover any arc for the exact label, value, and share.
              Pair this density with a stat row beneath to call out
              the headline category totals — sunburst is great for
              "where does the money go?" but the precise totals
              belong on a stat row.
            </p>
          </aside>
        </div>
      </TuxExample>
    </section>
  </div>
</template>

<style scoped>
.cs-demo__bare {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: center;
}
.cs-demo__bare aside {
  font-size: 0.86rem;
  color: var(--text-secondary);
  line-height: 1.6;
}
.cs-demo__bare aside p:not(:first-child) { margin-top: 0.625rem; }
@container (max-width: 38rem) {
  .cs-demo__bare { grid-template-columns: 1fr; }
}
</style>
