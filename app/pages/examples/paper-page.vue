<script setup lang="ts">
// Per ADR-0010, keep top-level <script setup> expressions plain JS.
useHead({ title: "Example · Research paper · TUX" });

const breadcrumb = [
  { label: "Home", to: "/" },
  { label: "Publications", to: "#" },
  { label: "TRR · Vol 2671 · 2025" },
];

const paperCitation = {
  authors: ["Hassan, M.", "Velazquez, L.", "Chen, R."],
  title: "Enduring infrastructure cues vs novelty effects: a 36-month follow-up on twelve rural intersection treatments.",
  venue: "Transportation Research Record",
  year: 2025,
  volume: 2671,
  issue: 4,
  pages: "118-134",
  doi: "10.1177/03611981251123456",
};

const trendLabels = [
  "0-3 mo", "3-6 mo", "6-9 mo", "9-12 mo", "12-15 mo", "15-18 mo",
  "18-21 mo", "21-24 mo", "24-27 mo", "27-30 mo", "30-33 mo", "33-36 mo",
];

// Stop-line compliance % — treated vs control
const trendSeries = [
  { key: "treated", label: "Treated (n=12)", data: [42, 41, 40, 41, 39, 40, 39, 38, 39, 38, 38, 38] },
  { key: "control", label: "Control (n=12)", data: [79, 80, 78, 81, 79, 80, 77, 78, 78, 76, 77, 77] },
];

// Per-segment results for the corridor study sub-section
const corridorSegments = [
  { from: 174, to: 178, label: "Pre-treatment baseline", toneIndex: 6 },
  { from: 178, to: 184, label: "Treatment zone A", toneIndex: 4 },
  { from: 184, to: 188, label: "Construction zone", toneIndex: 7 },
  { from: 188, to: 192, label: "Treatment zone B", toneIndex: 1 },
  { from: 192, to: 195, label: "Post-treatment baseline", toneIndex: 6 },
];

const corridorEvents = [
  { mile: 175.5, label: "FM 60 intersection",  toneIndex: 2 },
  { mile: 180,   label: "Site 12 instrumentation", toneIndex: 3 },
  { mile: 189,   label: "Treatment applied",   toneIndex: 4 },
  { mile: 193,   label: "Site 18 instrumentation", toneIndex: 3 },
];
</script>

<template>
  <article class="space-y-8 max-w-4xl mx-auto py-8 px-4">
    <div class="example-demo-notice">
      <Icon name="lucide:layers" class="example-demo-notice__icon" aria-hidden="true" />
      <p class="example-demo-notice__text">
        <strong>Composition example.</strong>
        Real-shape academic paper page using the research-publishing
        cluster end-to-end — page header + author byline + paper meta
        + structured abstract + body prose + numbered figures /
        tables + inline footnotes + sticky <em>Cite</em> menu +
        acknowledgments. Composes ~10 Tux* components into the
        canonical paper rhythm.
      </p>
    </div>

    <TuxBreadcrumbs :trail="breadcrumb" />

    <!-- Paper header rhythm: title (PageHeader) → byline → meta -->
    <div class="space-y-1">
      <TuxCenterBadge center="safety" />
    </div>
    <TuxPageHeader
      eyebrow="article · transportation research record"
      title="Enduring infrastructure cues vs novelty effects"
    >
      A 36-month follow-up on twelve rural intersection treatments in
      central Texas reveals persistent behavior-change effects, with
      implications for treatment-effect attribution in long-window
      safety studies.
    </TuxPageHeader>

    <TuxAuthorByline
      :authors="[
        { name: 'M. Hassan',    affiliations: [1, 2], orcid: '0000-0002-1234-5678', corresponding: true, email: 'mhassan@tti.tamu.edu' },
        { name: 'L. Velazquez', affiliations: [1] },
        { name: 'R. Chen',      affiliations: [1] },
      ]"
      :affiliations="[
        'Texas A&M Transportation Institute, Roadway Safety Division',
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
      :funders="['FHWA HRDS-30-2022-04', 'TxDOT 0-7042']"
    />

    <!-- Sticky-actions row — Cite + funder badges + share -->
    <div class="paper-page__actions">
      <div class="flex flex-wrap items-center gap-2">
        <TuxFundingSource funder="FHWA" abbrev="FHWA" grant="HRDS-30-2022-04" size="sm" />
        <TuxFundingSource funder="TxDOT" grant="0-7042" size="sm" />
      </div>
      <div class="flex items-center gap-2">
        <TuxCitationExport :citation="paperCitation" label="Cite" />
        <UButton variant="ghost" icon="lucide:download" size="sm">PDF</UButton>
        <UButton variant="ghost" icon="lucide:share-2" size="sm" aria-label="Share" />
      </div>
    </div>

    <!-- Structured abstract -->
    <TuxAbstract
      background="Earlier evaluations of rural intersection treatments often suffered from short follow-up windows that conflated treatment effects with novelty effects. We extend the follow-up window to 36 months across twelve treated sites with matched controls."
      methods="Twelve treated rural intersections in central Texas were instrumented for 36 months post-construction; matched controls were observed in parallel. Stop-line non-compliance rates were sampled in 6-month windows; difference-in-differences with site-level fixed effects estimated treatment effects."
      results="Treated sites showed a 37 percent reduction in stop-line non-compliance vs controls; the reduction persisted across all 36 months, with no detectable decay over time (slope = −0.04 pp/month, p = 0.78)."
      conclusion="The persistence of the effect supports the infrastructure-cue hypothesis over the novelty hypothesis. Implications: treatment-effect attribution in safety evaluation should not rely on 12-month-or-shorter follow-up windows; persistence is itself a finding."
      :keywords="['rural roadway safety', 'long-term evaluation', 'stop-line compliance', 'difference-in-differences', 'TxDOT']"
    />

    <!-- 1. Introduction -->
    <section class="paper-page__section">
      <h2 class="paper-page__h2">1.  Introduction</h2>
      <p>
        Roadway-safety treatments — pavement markings, signage,
        geometric changes, rumble strips — are routinely evaluated
        in 6- to 12-month windows post-construction. This window
        captures the immediate behavior change but cannot
        distinguish <strong>infrastructure-cue effects</strong> from
        <strong>novelty effects</strong><TuxFootnote :n="1" text="The novelty hypothesis: drivers attend differently to anything new in their environment; once the environment becomes familiar, attention reverts to baseline. The infrastructure-cue hypothesis: the new physical configuration carries persistent legibility advantages independent of novelty." />.
        If treatment effects observed at 12 months reflect novelty
        rather than durable infrastructure cues, the
        cost-effectiveness frameworks built on those evaluations
        systematically overstate long-term benefits.
      </p>
      <p>
        We extend the follow-up window to 36 months across twelve
        treated rural intersections in central Texas. Our central
        finding — no detectable decay in treatment effect across the
        full 36-month window — supports the infrastructure-cue
        hypothesis<TuxFootnote :n="2" text="Decay would be expected if the effect were novelty-driven; the 12-15 month and later windows should show a regression toward control rates." />
        and has direct implications for safety-treatment evaluation
        methodology.
      </p>
    </section>

    <!-- 2. Methods -->
    <section class="paper-page__section">
      <h2 class="paper-page__h2">2.  Methods</h2>
      <p>
        Twelve treated rural intersections were selected from the
        TxDOT 2024 Q1 treatment program (geometric realignment +
        high-visibility signage). Matched controls were drawn from
        the same TxDOT district using propensity-score matching on
        traffic volume, lane configuration, and prior crash rate.
      </p>

      <TuxFigureCaption
        :number="1"
        kind="Figure"
        caption="Stop-line non-compliance rate over 36 months (6-month windows). Treated sites in maroon; matched controls in slate teal. End-of-line value labels in the same series color."
        source="TxDOT 0-7042 study dataset · n = 24 sites"
      >
        <TuxChartLine
          :labels="trendLabels"
          :series="trendSeries"
          :width="900"
          :height="280"
          legend
          markers
        />
      </TuxFigureCaption>

      <p>
        Figure 1 shows the canonical comparison: treated sites
        stabilized near 38–42% non-compliance within the first
        6-month window and held there through month 36; controls
        oscillated around 77–81% with no comparable trend.
      </p>

      <h3 class="paper-page__h3">2.1  Corridor sub-study (I-35 mile 174–195)</h3>
      <p>
        A parallel sub-study extracted segment-level results along
        the I-35 corridor in the same TxDOT district. Treatment
        zone A (mile 178–184) and treatment zone B (mile 188–192)
        bracket a construction zone; baseline segments precede and
        follow.
      </p>

      <TuxCorridorStrip
        name="I-35 corridor sub-study, mile 174–195"
        direction="Northbound  →"
        :from-mile="174"
        :to-mile="195"
        :segments="corridorSegments"
        :events="corridorEvents"
        :width="900"
        :height="120"
      />
    </section>

    <!-- 3. Results table -->
    <section class="paper-page__section">
      <h2 class="paper-page__h2">3.  Results</h2>

      <TuxTableCaption
        :number="1"
        kind="Table"
        caption="Treatment vs control compliance rates, by 6-month window. Difference-in-differences estimate in the rightmost column."
        source="Hassan et al. · TxDOT 0-7042"
      >
        <table class="paper-page__table">
          <thead>
            <tr>
              <th>Window</th>
              <th class="text-right">Treated</th>
              <th class="text-right">Control</th>
              <th class="text-right">Δ (pp)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>0–6 mo</td><td class="text-right">42</td><td class="text-right">79</td><td class="text-right paper-page__delta">−37</td></tr>
            <tr><td>6–12 mo</td><td class="text-right">41</td><td class="text-right">81</td><td class="text-right paper-page__delta">−40</td></tr>
            <tr><td>12–24 mo</td><td class="text-right">39</td><td class="text-right">78</td><td class="text-right paper-page__delta">−39</td></tr>
            <tr><td>24–36 mo</td><td class="text-right">38</td><td class="text-right">77</td><td class="text-right paper-page__delta">−39</td></tr>
          </tbody>
        </table>
      </TuxTableCaption>

      <p>
        Across the four 6-month windows, the treatment-control gap
        is statistically indistinguishable from constant (test of
        equal slopes across windows: F(3, 23) = 0.41, p = 0.75).
      </p>
    </section>

    <!-- 4. Discussion -->
    <section class="paper-page__section">
      <h2 class="paper-page__h2">4.  Discussion</h2>
      <p>
        The persistence finding has two methodological
        implications<TuxFootnote :n="3" text="And a third practical one: TxDOT can plan capital deployment with confidence that the treatment package's effects don't require maintenance / reinforcement to persist. This bears on benefit-cost ratios in the agency's standard evaluation framework." />.
        First, the standard 6- to 12-month evaluation window is
        sufficient to detect the treatment effect but not to
        distinguish it from novelty; researchers using shorter
        windows should be explicit about which claim they're
        making. Second, the cost-effectiveness frameworks that
        amortize treatment benefits over 5-, 10-, or 20-year
        horizons may be more defensible than the methodological
        literature suggests — at least for this class of
        treatments.
      </p>
    </section>

    <!-- Acknowledgments -->
    <TuxAcknowledgments
      :funding="[
        { funder: 'Federal Highway Administration', grant: 'HRDS-30-2022-04', url: 'https://highways.dot.gov' },
        { funder: 'Texas Department of Transportation', grant: '0-7042' },
      ]"
      acknowledgments="The authors thank the TTI MovementLab field team — Jordan Kim, Mariana Vega, and Daniel Park — for instrumentation and data quality assurance across the 36-month follow-up. Statistical review by D. Park."
      conflicts="The authors declare no competing financial or non-financial interests."
      ethics="All study protocols were reviewed and approved by the Texas A&M IRB (#IRB-2022-0418). Aggregated corridor data are available on request; per-subject data are not released to protect operator privacy."
    />

    <!-- Inline footnotes list at document end (anchors from the
         inline TuxFootnote refs target these) -->
    <section class="paper-page__footnotes">
      <h2 class="paper-page__h2">Notes</h2>
      <ol>
        <li id="fn-1">
          The novelty hypothesis: drivers attend differently to
          anything new in their environment; once the environment
          becomes familiar, attention reverts to baseline. The
          infrastructure-cue hypothesis: the new physical
          configuration carries persistent legibility advantages
          independent of novelty.
          <a href="#fn-ref-1" class="paper-page__footnote-back">↩</a>
        </li>
        <li id="fn-2">
          Decay would be expected if the effect were novelty-driven;
          the 12–15 month and later windows should show a regression
          toward control rates.
          <a href="#fn-ref-2" class="paper-page__footnote-back">↩</a>
        </li>
        <li id="fn-3">
          And a third practical one: TxDOT can plan capital deployment
          with confidence that the treatment package's effects don't
          require maintenance / reinforcement to persist. This bears
          on benefit-cost ratios in the agency's standard evaluation
          framework.
          <a href="#fn-ref-3" class="paper-page__footnote-back">↩</a>
        </li>
      </ol>
    </section>
  </article>
</template>

<style scoped>
.paper-page__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0.75rem 1rem;
  background: var(--surface-sunken);
  border-radius: var(--radius-md);
  margin-top: 0.5rem;
}

.paper-page__section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: var(--font-sans);
  color: var(--text-primary);
}

.paper-page__section p {
  font-size: 1rem;
  line-height: 1.7;
  margin: 0;
}

.paper-page__h2 {
  font-family: var(--font-display, var(--font-sans));
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--surface-border);
}

.paper-page__h3 {
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0.75rem 0 0 0;
}

.paper-page__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.paper-page__table th,
.paper-page__table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--surface-border);
}

.paper-page__table thead th {
  text-align: left;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  color: var(--text-muted);
  font-weight: 700;
  border-bottom: 2px solid var(--brand-primary);
}

.paper-page__table tbody tr:hover {
  background: var(--surface-sunken);
}

.paper-page__delta {
  color: var(--brand-primary);
  font-weight: 700;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.paper-page__footnotes ol {
  font-size: 0.8125rem;
  line-height: 1.5;
  padding-left: 1.5rem;
  color: var(--text-secondary);
}

.paper-page__footnotes li {
  margin-bottom: 0.625rem;
}

.paper-page__footnote-back {
  margin-left: 0.375rem;
  color: var(--brand-primary);
  text-decoration: none;
  font-weight: 600;
}

.paper-page__footnote-back:hover {
  text-decoration: underline;
}
</style>
