<script setup lang="ts">
useHead({ title: "Research-publishing cluster · TUX" });

const sampleCitation = {
  authors: ["Hassan, M.", "Velazquez, L.", "Chen, R."],
  title: "Enduring infrastructure cues vs novelty effects: a 36-month follow-up on twelve rural intersection treatments.",
  venue: "Transportation Research Record",
  year: 2025,
  volume: 2671,
  issue: 4,
  pages: "118-134",
  doi: "10.1177/03611981251123456",
};

const headerVue = `<TuxAuthorByline
  :authors="[
    { name: 'M. Hassan',    affiliations: [1, 2], orcid: '0000-0002-1234-5678', corresponding: true, email: 'mhassan@tti.tamu.edu' },
    { name: 'L. Velazquez', affiliations: [1] },
    { name: 'R. Chen',      affiliations: [1] },
  ]"
  :affiliations="[
    'Texas A&M Transportation Institute',
    'Department of Civil Engineering, Texas A&M University',
  ]"
/>

<TuxPaperMeta
  type="Article"
  venue="Transportation Research Record"
  published="2025-08-14"
  pages="118-134"
  doi="10.1177/03611981251123456"
  license="CC-BY 4.0"
  :funders="['FHWA HRDS-30', 'TxDOT 0-7042']"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · research-publishing cluster" title="Research-publishing">
      Eight components that make "TUX is for research publishing"
      tangible at the page level. Structured abstracts, byline +
      affiliations + ORCID, paper meta, numbered figure / table
      captions, footnotes with hover preview, multi-format citation
      export, and the acknowledgments block.
    </TuxPageHeader>

    <section class="space-y-3">
      <p class="eyebrow">paper header rhythm</p>
      <h2 class="heading--bold text-xl font-bold">Byline + meta</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        The canonical academic header: title (rendered via
        <code>TuxPageHeader</code>) + byline + meta strip. The byline
        supports affiliations (numbered superscripts + footnoted list),
        ORCID iDs, and a corresponding-author marker.
      </p>
      <TuxExample :vue="headerVue">
        <TuxPageHeader
          eyebrow="article"
          title="Enduring infrastructure cues vs novelty effects"
        />
        <TuxAuthorByline
          :authors="[
            { name: 'M. Hassan',    affiliations: [1, 2], orcid: '0000-0002-1234-5678', corresponding: true, email: 'mhassan@tti.tamu.edu' },
            { name: 'L. Velazquez', affiliations: [1] },
            { name: 'R. Chen',      affiliations: [1] },
          ]"
          :affiliations="[
            'Texas A&M Transportation Institute',
            'Department of Civil Engineering, Texas A&M University',
          ]"
        />
        <TuxPaperMeta
          type="Article"
          venue="Transportation Research Record"
          published="2025-08-14"
          pages="118-134"
          doi="10.1177/03611981251123456"
          license="CC-BY 4.0"
          :funders="['FHWA HRDS-30', 'TxDOT 0-7042']"
        />
      </TuxExample>
    </section>

    <section class="space-y-3">
      <p class="eyebrow">structured abstract</p>
      <h2 class="heading--bold text-xl font-bold">TuxAbstract</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        Background / Methods / Results / Conclusion in four
        labeled sections. Reader can scan the structure without
        reading every word — the rhythm matches how journals
        format abstracts.
      </p>
      <TuxAbstract
        background="Earlier evaluations of rural intersection treatments often suffered from short follow-up windows that conflated treatment effects with novelty effects."
        methods="Twelve treated rural intersections in central Texas were instrumented for 36 months post-construction; matched controls were observed in parallel."
        results="Treated sites showed a 37 percent reduction in stop-line non-compliance vs controls; the reduction persisted across all 36 months, with no detectable decay over time."
        conclusion="The persistence of the effect supports the infrastructure-cue hypothesis over the novelty hypothesis; treatments cause-not-correlate with sustained behavior change."
        :keywords="['rural roadway safety', 'long-term evaluation', 'stop-line compliance', 'TxDOT']"
      />
    </section>

    <section class="space-y-3">
      <p class="eyebrow">numbered captions · figure + table</p>
      <h2 class="heading--bold text-xl font-bold">TuxFigureCaption / TuxTableCaption</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        Auto-styled, consumer-numbered captions. Figures default to
        caption-below; tables to caption-above (academic convention).
        Optional <code>source</code> shown in muted italics below the
        caption.
      </p>
      <TuxFigureCaption
        :number="3"
        kind="Figure"
        caption="Mean stop-line non-compliance rate over 36 months. Treated sites (n=12) in maroon; matched controls (n=12) in dashed slate."
        source="Hassan et al. 2025 · TxDOT 0-7042 dataset"
      >
        <div class="rounded-md border border-surface-border bg-surface-sunken h-48 grid place-items-center text-text-muted">
          [Figure placeholder — line chart of compliance over 36 months]
        </div>
      </TuxFigureCaption>

      <TuxTableCaption
        :number="2"
        kind="Table"
        caption="Treatment vs control compliance rates, by 6-month window."
        source="Hassan et al. 2025"
      >
        <table class="w-full text-sm border border-surface-border">
          <thead class="bg-surface-sunken">
            <tr>
              <th class="text-left py-1 px-3 border-b">Window</th>
              <th class="text-right py-1 px-3 border-b">Treated</th>
              <th class="text-right py-1 px-3 border-b">Control</th>
              <th class="text-right py-1 px-3 border-b">Δ (pp)</th>
            </tr>
          </thead>
          <tbody class="font-mono tabular-nums text-xs">
            <tr><td class="py-1 px-3 border-b">0-6 mo</td><td class="text-right py-1 px-3 border-b">42</td><td class="text-right py-1 px-3 border-b">79</td><td class="text-right py-1 px-3 border-b text-brand-primary font-bold">-37</td></tr>
            <tr><td class="py-1 px-3 border-b">6-12 mo</td><td class="text-right py-1 px-3 border-b">41</td><td class="text-right py-1 px-3 border-b">81</td><td class="text-right py-1 px-3 border-b text-brand-primary font-bold">-40</td></tr>
            <tr><td class="py-1 px-3 border-b">12-24 mo</td><td class="text-right py-1 px-3 border-b">39</td><td class="text-right py-1 px-3 border-b">78</td><td class="text-right py-1 px-3 border-b text-brand-primary font-bold">-39</td></tr>
            <tr><td class="py-1 px-3">24-36 mo</td><td class="text-right py-1 px-3">38</td><td class="text-right py-1 px-3">77</td><td class="text-right py-1 px-3 text-brand-primary font-bold">-39</td></tr>
          </tbody>
        </table>
      </TuxTableCaption>
    </section>

    <section class="space-y-3">
      <p class="eyebrow">inline footnote · hover preview</p>
      <h2 class="heading--bold text-xl font-bold">TuxFootnote</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        Inline superscript reference + hover/focus popover that shows
        the footnote without forcing a scroll. The anchor still jumps
        to the document-end footnotes list when clicked.
      </p>
      <p class="text-base leading-relaxed max-w-3xl">
        The signal-to-noise gain held across all four corridor
        segments<TuxFootnote :n="3" text="Segments selected for treatment in 2024 Q1; pre-treatment baselines run 2023 Q3–Q4. Selection was randomized within stratified groups by traffic volume." />,
        with the strongest effect on segments that had previously
        carried the highest noise<TuxFootnote :n="4" text="'Noise' here refers to data-quality flags raised by the corridor-feed reconciler, not acoustic noise." />.
      </p>
    </section>

    <section class="space-y-3">
      <p class="eyebrow">citation export · 6 formats</p>
      <h2 class="heading--bold text-xl font-bold">TuxCitationExport</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        Single "Cite" button → dropdown with APA / Chicago / MLA /
        IEEE / BibTeX / RIS. Each row copies the formatted citation
        to the clipboard. Useful in a sticky-actions sidebar or near
        the paper meta strip.
      </p>
      <div>
        <TuxCitationExport :citation="sampleCitation" label="Cite this paper" />
      </div>
    </section>

    <section class="space-y-3">
      <p class="eyebrow">paper footer · funding + conflicts + ethics</p>
      <h2 class="heading--bold text-xl font-bold">TuxAcknowledgments</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        Four optional sections — funding (with grant numbers),
        acknowledgments, conflicts of interest, ethics + data access.
        Renders nothing for any section left empty.
      </p>
      <TuxAcknowledgments
        :funding="[
          { funder: 'Federal Highway Administration', grant: 'HRDS-30-2022-04', url: 'https://highways.dot.gov' },
          { funder: 'Texas Department of Transportation', grant: '0-7042' },
        ]"
        acknowledgments="The authors thank the TTI MovementLab field team — Jordan Kim, Mariana Vega, and Daniel Park — for instrumentation and data quality assurance across the 36-month follow-up."
        conflicts="The authors declare no competing financial or non-financial interests."
        ethics="All study protocols were reviewed and approved by the Texas A&M IRB (#IRB-2022-0418). Aggregated corridor data are available on request; per-subject data are not released to protect operator privacy."
      />
    </section>
  </div>
</template>
