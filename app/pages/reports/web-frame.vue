<script setup lang="ts">
useHead({ title: "TuxReportWebFrame · Reports · TUX" });

const factoid = [
  { value: "412", label: "active projects", note: "+28 vs FY25" },
  { value: "$84.2M", label: "total awarded", note: "+12.4%" },
  { value: "36.8%", label: "TxDOT share",   note: "$31.0M" },
];

const toc = [
  { to: "#summary",  label: "Executive summary" },
  { to: "#findings", label: "Key findings" },
  { to: "#data",     label: "Data and methods" },
  { to: "#next",     label: "What's next" },
];

const sourceVue = `<tux-report-web-frame
  eyebrow="annual report \u00b7 fy2026"
  title="Sponsored research \u2014 TTI corridor program"
  lede="A web-hosted summary of corridor program work, written
        for sponsors and the public. Distinct from the printed
        quarterly: this version lives at a permanent URL."
  byline="TTI Roadway Safety Program"
  date="April 2026"
  reading-time="12 min read"
  :toc="toc"
  width="default"
>
  <section id="summary">
    <h2>Executive summary</h2>
    <p>\u2026narrative\u2026</p>
  </section>

  <section id="findings">
    <h2>Key findings</h2>
    <tux-factoid :items="factoid" />
    <p>\u2026narrative\u2026</p>
  </section>

  <template #footer>
    <span>Source: tti.tamu.edu \u00b7 Published April 2026</span>
  </template>
</tux-report-web-frame>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="reports" title="TuxReportWebFrame">
      Long-form, web-hosted narrative canvas. Same family as
      <code>TuxReportFrame</code> — finished narrative, read top-to-
      bottom — but rendered as an HTML page rather than an 8.5×11
      sheet. Reach for it when the deliverable lives at a permanent
      URL (annual report, research findings, accreditation summary)
      instead of leaving the app as paper.
      <br><br>
      <span class="text-sm text-text-muted">
        Distinct from <NuxtLink to="/visualizations" class="link-tti">Visualizations</NuxtLink>:
        a web-hosted report is still <em>read</em>, not <em>pivoted</em>.
        If the reader is meant to filter and drill, it's a Visualization,
        not a Report.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Cover · TOC rail · body · footer</h2>
      <TuxExample class="mt-4" :vue="sourceVue">
        <div class="bg-surface-sunken py-6 -mx-6 px-6">
          <TuxReportWebFrame
            eyebrow="annual report · fy2026"
            title="Sponsored research — TTI corridor program"
            lede="A web-hosted summary of corridor program work, written for sponsors and the public. Distinct from the printed quarterly: this version lives at a permanent URL and updates between print cycles."
            byline="TTI Roadway Safety Program"
            date="April 2026"
            reading-time="12 min read"
            :toc="toc"
            width="default"
          >
            <section id="summary">
              <h2>Executive summary</h2>
              <p>
                FY26 Q1 closed with awarded funding 12.4% above the same
                quarter in FY25, driven primarily by a $9.2M IH-35
                corridor-safety renewal from TxDOT and a $4.8M FHWA
                work-zone classifier grant. Headcount on sponsored
                projects rose 6.1%; equipment capex held steady.
              </p>
              <p>
                <strong>The headline metric:</strong> 412 active projects
                across the corridor program, a record for the institute
                in any single quarter.
              </p>
            </section>

            <section id="findings">
              <h2>Key findings</h2>
              <TuxFactoid :items="factoid" class="my-6" />
              <p>
                Crash-rate reductions held in three of four corridors
                under active retrofit; the fourth (US-290 between
                Hempstead and Brenham) showed a 4% rise associated
                with construction-zone congestion, consistent with
                modeling. The interim signage refresh is on track for
                completion in the May steering review.
              </p>
              <h3>Methods</h3>
              <p>
                All metrics use TxDOT CRIS-2 records joined against the
                TTI corridor classifier. Confidence intervals are
                bootstrap percentile (B = 2,000) at the 95% level.
              </p>
            </section>

            <section id="data">
              <h2>Data and methods</h2>
              <p>
                Source datasets, classifier versions, and reproducibility
                pointers live in the program's PECAN workspace. Sponsor
                access is provisioned via Entra ID; public extracts are
                published to data.tti.tamu.edu in CSV and Parquet.
              </p>
            </section>

            <section id="next">
              <h2>What's next</h2>
              <p>
                Q2 work continues on the classifier-refresh roadmap and
                the FHWA work-zone deliverables. The next public update
                lands at the end of the fiscal quarter.
              </p>
            </section>

            <template #footer>
              <span>Source: tti.tamu.edu · Published April 2026</span>
            </template>
          </TuxReportWebFrame>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Three measure widths</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Web reading degrades fast past ~75 characters per line.
        <code>width="default"</code> caps the body at ~70ch (the
        recommended editorial measure); <code>narrow</code> drops to
        ~56ch for very prose-heavy pieces; <code>wide</code> lifts to
        ~82ch when the body interleaves data tables or charts that
        need horizontal room.
      </p>
    </section>

    <section>
      <p class="eyebrow">when not to reach for this</p>
      <h2 class="heading--bold text-lg font-bold">Three near-neighbors that aren't this</h2>
      <ul class="mt-2 text-text-secondary leading-relaxed list-disc pl-5 space-y-1">
        <li>
          <strong>TuxReportFrame</strong> — paper / PDF / print. Same
          family; different output medium. If the deliverable has to
          leave the app on paper, use the page-sized canvas.
        </li>
        <li>
          <strong>TuxPageHeader + free composition</strong> — most
          landing pages don't need the cover/TOC/byline rhythm.
          Reach for the page header and compose normally.
        </li>
        <li>
          <strong>A Visualization</strong> — if the reader pivots,
          filters, or drills in, it isn't a Report. Use
          <NuxtLink to="/visualizations" class="link-tti">/visualizations</NuxtLink>.
        </li>
      </ul>
    </section>
  </div>
</template>
