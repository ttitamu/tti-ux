<script setup lang="ts">
useHead({ title: "TuxReportFrame · Reports · TUX" });

const factoid = [
  { value: "412", label: "active projects", note: "+28 vs FY25" },
  { value: "$84.2M", label: "total awarded", note: "+12.4%" },
  { value: "36.8%", label: "TxDOT share",   note: "$31.0M" },
];

const letterVue = `<tux-report-frame
  size="letter"
  density="editorial"
  eyebrow="quarterly report · 2026 Q1"
  title="Sponsored research — TTI corridor program"
>
  <!-- Hero stat -->
  <tux-big-stat value="$84.2M" label="awarded · FY26 to date" />

  <!-- 3-up factoid row -->
  <tux-factoid :items="factoid" />

  <!-- Body prose -->
  <p>… narrative summary …</p>

  <!-- Embedded R-rendered chart from the Visualizations toolkit -->
  <tux-viz-rplot
    kind="svg"
    src="/viz-rplot-grants.svg"
    title="Grant draws by sponsor"
    ratio="8/5"
  />

  <template #footer>
    <span>tti.tamu.edu</span>
    <span>page 1 of 4</span>
  </template>
</tux-report-frame>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="reports" title="TuxReportFrame">
      Page-sized canvas (letter / a4, portrait or landscape) for PDF
      export and print. The frame is just the <em>page chrome</em> —
      paper-shadow on screen, flush borderless under
      <code>@media print</code>, editorial header treatment, footer
      gutter for page numbers and source. <strong>Visualizations,
      stats, prose, and charts go inside</strong>; the frame doesn't
      pick what those are.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Letter · editorial · with stats and a chart inside</h2>
      <TuxExample class="mt-4" :vue="letterVue">
        <div class="bg-surface-sunken py-6 -mx-6 px-6" style="overflow-x: auto;">
          <TuxReportFrame
            size="letter"
            density="editorial"
            eyebrow="quarterly report · 2026 Q1"
            title="Sponsored research — TTI corridor program"
          >
            <TuxBigStat value="$84.2M" label="awarded · FY26 to date" />

            <TuxFactoid :items="factoid" />

            <p class="text-text-secondary leading-relaxed mt-4">
              FY26 Q1 closed with awarded funding 12.4% above the same
              quarter in FY25, driven primarily by a $9.2M IH-35
              corridor-safety renewal from TxDOT and a $4.8M FHWA
              work-zone classifier grant.
            </p>
            <p class="mt-4 text-text-secondary leading-relaxed">
              Coordination with TxDOT followed the established cadence.
              Outstanding action items track to the May steering review.
            </p>

            <TuxVizRPlot
              kind="svg"
              src="/viz-rplot-grants.svg"
              title="Grant draws by sponsor"
              eyebrow="figure 1"
              ratio="8/5"
              source="R 4.4.1 · ggplot2 3.5.1 · scripts/grants-by-quarter.R"
            />

            <template #footer>
              <span>tti.tamu.edu</span>
              <span>page 1 of 4</span>
            </template>
          </TuxReportFrame>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">scope</p>
      <h2 class="heading--bold text-lg font-bold">When to reach for TuxReportFrame</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        When you're producing a deliverable that has to leave the app
        as paper or PDF — quarterly research reports, IRB submissions,
        sponsor write-ups, accreditation packages. If the output is
        meant to live <em>inside</em> the app and stay interactive
        (filter, drill, pivot), it's a
        <NuxtLink to="/visualizations" class="link-tti">Visualization</NuxtLink>,
        not a Report.
      </p>
    </section>
  </div>
</template>
