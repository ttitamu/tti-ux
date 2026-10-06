<script setup lang="ts">
import tuxReportWebFrameSource from "~/components/TuxReportWebFrame.vue?raw";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxReportWebFrame · Reports Studio · TUX" });

const factoid = [
  { value: "412", label: "active projects", note: "+28 vs FY25" },
  { value: "$84.2M", label: "total awarded", note: "+12.4%" },
  { value: "36.8%", label: "TxDOT share", note: "$31.0M" },
];

const toc = [
  { to: "#summary", label: "Executive summary" },
  { to: "#findings", label: "Key findings" },
  { to: "#data", label: "Data and methods" },
  { to: "#next", label: "What's next" },
];

const webFrameControls: TuxPropControl[] = [
  {
    prop: "width",
    label: "Reading Measure Width",
    type: "select",
    options: [
      { label: "Default (~70ch · optimal reading measure)", value: "default" },
      { label: "Narrow (~56ch · prose-intensive policy briefs)", value: "narrow" },
      { label: "Wide (~82ch · data tables & wide charts)", value: "wide" },
    ],
    defaultValue: "default",
    description: "Line-length constraint applied to body text for reading ergonomics",
  },
  {
    prop: "eyebrow",
    label: "Eyebrow Category",
    type: "text",
    defaultValue: "annual report · fy2026",
    description: "Uppercase tracking category badge in report cover",
  },
  {
    prop: "title",
    label: "Headline Title",
    type: "text",
    defaultValue: "Sponsored research — TTI corridor program",
    description: "Major report title formatted with responsive container-query sizing",
  },
  {
    prop: "lede",
    label: "Lede Paragraph (Dek)",
    type: "text",
    defaultValue: "A web-hosted summary of corridor program work, written for sponsors and the public. Distinct from the printed quarterly: this version lives at a permanent URL and updates between print cycles.",
    description: "High-contrast editorial introduction setting the document tone",
  },
  {
    prop: "byline",
    label: "Author / Division Byline",
    type: "text",
    defaultValue: "TTI Roadway Safety Program",
    description: "Attribution to research program, author, or laboratory",
  },
  {
    prop: "date",
    label: "Publication Date",
    type: "text",
    defaultValue: "April 2026",
    description: "Date string or ISO timestamp displayed in metadata rail",
  },
  {
    prop: "readingTime",
    label: "Reading Time Estimate",
    type: "text",
    defaultValue: "12 min read",
    description: "Estimated reading time badge with clock icon",
  },
  {
    prop: "showToc",
    label: "Sticky Table of Contents Rail",
    type: "boolean",
    defaultValue: true,
    description: "Renders the desktop sticky navigation rail tracking article headings",
  },
];

const webFramePresets: TuxPlaygroundPreset[] = [
  {
    name: "annual-corridor-report",
    label: "Annual Corridor Report (~70ch Default)",
    description: "Standard editorial web report with full cover, TOC rail, factoid row, and methodology",
    icon: "lucide:globe",
    values: {
      width: "default",
      eyebrow: "annual report · fy2026",
      title: "Sponsored research — TTI corridor program",
      lede: "A web-hosted summary of corridor program work, written for sponsors and the public. Distinct from the printed quarterly: this version lives at a permanent URL and updates between print cycles.",
      byline: "TTI Roadway Safety Program",
      date: "April 2026",
      readingTime: "12 min read",
      showToc: true,
    },
  },
  {
    name: "policy-brief",
    label: "Policy & Legislative Brief (~56ch Narrow)",
    description: "Prose-heavy brief with constrained column measure for effortless continuous reading",
    icon: "lucide:file-text",
    values: {
      width: "narrow",
      eyebrow: "policy brief · may 2026",
      title: "Autonomous Freight Regulations & Rural Corridors",
      lede: "Evaluating state and federal regulatory frameworks for heavy vehicle platooning on rural interstate networks.",
      byline: "Freight Mobility & Policy Division",
      date: "May 2026",
      readingTime: "6 min read",
      showToc: true,
    },
  },
  {
    name: "compendium-wide",
    label: "Technical Compendium (~82ch Wide)",
    description: "Wide canvas granting extra horizontal room for wide charts, exhibits, and data matrices",
    icon: "lucide:table",
    values: {
      width: "wide",
      eyebrow: "technical compendium · v2.4",
      title: "Statewide Travel Time Reliability Modeling",
      lede: "Methodological framework, empirical validation, and sensor calibration metrics across 4,200 lane miles.",
      byline: "Multimodal Systems Analysis Program",
      date: "June 2026",
      readingTime: "18 min read",
      showToc: true,
    },
  },
  {
    name: "executive-snapshot",
    label: "Executive Snapshot (No Rail TOC)",
    description: "Single-column narrative without the right rail navigation for quick reading memos",
    icon: "lucide:newspaper",
    values: {
      width: "default",
      eyebrow: "executive memo · june 2026",
      title: "Corridor Safety Emergency Review",
      lede: "Urgent findings from the Q2 statewide high-crash corridor telemetry assessment.",
      byline: "Executive Directorate",
      date: "June 2026",
      readingTime: "4 min read",
      showToc: false,
    },
  },
];

const codeTemplate = (values: Record<string, any>) => {
  const widthAttr = values.width && values.width !== "default" ? `\n  width="${values.width}"` : "";
  const ebAttr = values.eyebrow ? `\n  eyebrow="${values.eyebrow}"` : "";
  const titleAttr = values.title ? `\n  title="${values.title}"` : "";
  const ledeAttr = values.lede ? `\n  lede="${values.lede}"` : "";
  const byAttr = values.byline ? `\n  byline="${values.byline}"` : "";
  const dateAttr = values.date ? `\n  date="${values.date}"` : "";
  const readAttr = values.readingTime ? `\n  reading-time="${values.readingTime}"` : "";
  const tocAttr = values.showToc ? `\n  :toc="toc"` : "";

  const tocSlot = values.showToc
    ? `\n  <!-- Wire TuxTOC for active-section scroll-spy tracking -->\n  <template #toc>\n    <tux-toc target=".tux-report-web-frame article" />\n  </template>\n`
    : "";

  return `<tux-report-web-frame${ebAttr}${titleAttr}${ledeAttr}${byAttr}${dateAttr}${readAttr}${tocAttr}${widthAttr}
>
  <section id="summary">
    <h2>Executive summary</h2>
    <p>FY26 Q1 closed with awarded funding 12.4% above FY25...</p>
  </section>

  <section id="findings">
    <h2>Key findings</h2>
    <tux-factoid :items="factoid" />
    <p>Crash-rate reductions held in three of four corridors...</p>
  </section>

  <section id="data">
    <h2>Data and methods</h2>
    <p>Source datasets, classifier versions, and pointers live in Landscape...</p>
  </section>

  <section id="next">
    <h2>What's next</h2>
    <p>Q2 work continues on the classifier-refresh roadmap...</p>
  </section>${tocSlot}
  <template #footer>
    <span>Source: tti.tamu.edu · Published April 2026</span>
  </template>
</tux-report-web-frame>`;
};
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="reports studio" title="TuxReportWebFrame">
      Long-form, web-hosted narrative canvas. The screen-native sibling of
      <code>TuxReportFrame</code>: same Reports family (finished narrative,
      read top-to-bottom), but rendered as an HTML web page rather than a
      paper-sized sheet. Reach for it when the deliverable lives at a permanent
      URL on tti.tamu.edu or a program microsite (annual reports, research findings,
      accreditation summaries).
      <br><br>
      <span class="text-sm text-text-muted">
        Distinct from <NuxtLink to="/visualizations" class="link-tti">Visualizations</NuxtLink>:
        a web-hosted report is still <em>read</em>, not <em>pivoted</em>.
        If the reader is meant to filter, drill, or slice data, use a Visualization.
      </span>
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-report-web-frame"
        component-name="TuxReportWebFrame"
        title="Web Report Canvas Workbench"
        eyebrow="Interactive Long-Form Frame"
        :controls="webFrameControls"
        :presets="webFramePresets"
        :source="tuxReportWebFrameSource"
        :code-template="codeTemplate"
        preview-padding="p-4 sm:p-6"
      >
        <template #default="{ values }">
          <div class="w-full bg-surface-page rounded-xl border border-surface-border p-6 sm:p-8 shadow-xs">
            <TuxReportWebFrame
              :width="values.width"
              :eyebrow="values.eyebrow"
              :title="values.title"
              :lede="values.lede"
              :byline="values.byline"
              :date="values.date"
              :reading-time="values.readingTime"
              :toc="values.showToc ? toc : []"
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
                  pointers live in the program's Landscape workspace. Sponsor
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

              <!-- Optional TOC Slot with active scroll-spy -->
              <template v-if="values.showToc" #toc>
                <TuxTOC target=".tux-report-web-frame article" />
              </template>

              <template #footer>
                <span>Source: tti.tamu.edu · Published April 2026 · Texas A&amp;M Transportation Institute</span>
              </template>
            </TuxReportWebFrame>
          </div>
        </template>
      </TuxPlayground>
    </section>

    <!-- Reading Measure Guide -->
    <section class="space-y-4">
      <p class="eyebrow">typographic measure</p>
      <h2 class="heading--bold text-xl font-bold">Three Editorial Reading Measures</h2>
      <p class="text-text-secondary leading-relaxed max-w-3xl">
        Digital reading comprehension drops steeply past ~75 characters per line due to saccadic eye fatigue.
        <code>TuxReportWebFrame</code> enforces strict character measures through CSS <code>ch</code> units
        and container queries:
      </p>

      <div class="overflow-x-auto rounded-lg border border-surface-border">
        <table class="w-full text-left text-sm">
          <thead class="bg-surface-sunken text-xs font-mono font-semibold text-text-secondary uppercase border-b border-surface-border">
            <tr>
              <th class="p-3">Width Prop</th>
              <th class="p-3">Max Measure</th>
              <th class="p-3">Reading Rhythm</th>
              <th class="p-3">Recommended Content</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-border text-xs">
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-mono font-bold text-brand-primary">narrow</td>
              <td class="p-3 font-mono text-text-secondary">max-width: 56ch</td>
              <td class="p-3 text-text-secondary">Fast scan, dense narrative</td>
              <td class="p-3 text-text-secondary">Policy briefs, legislative position memos, executive summaries, interviews</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-mono font-bold text-brand-primary">default</td>
              <td class="p-3 font-mono text-text-secondary">max-width: 70ch</td>
              <td class="p-3 text-text-secondary">Optimal editorial standard</td>
              <td class="p-3 text-text-secondary">Annual institute reports, research discoveries, academic articles, general long-form</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-mono font-bold text-brand-primary">wide</td>
              <td class="p-3 font-mono text-text-secondary">max-width: 82ch</td>
              <td class="p-3 text-text-secondary">Spacious data-rich layout</td>
              <td class="p-3 text-text-secondary">Methodological compendia with wide multi-column statistical tables, code blocks, or wide charts</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Scroll-Spy & TOC Section -->
    <section class="space-y-4">
      <p class="eyebrow">navigation rail</p>
      <h2 class="heading--bold text-xl font-bold">Sticky Table of Contents &amp; Scroll-Spy</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-5 bg-surface-raised border border-surface-border rounded-lg space-y-2">
          <div class="flex items-center gap-2 text-text-primary font-bold">
            <UIcon name="lucide:list" class="w-5 h-5 text-brand-primary" />
            <span>SSR-Safe Anchor Fallback</span>
          </div>
          <p class="text-sm text-text-secondary leading-relaxed">
            Passing the <code>:toc="toc"</code> prop supplies static anchor links for web crawlers,
            search engines, and non-JavaScript readers. When JavaScript mounts, <code>TuxTOC</code>
            in the <code>#toc</code> slot takes over with smooth scroll-spy indicators.
          </p>
        </div>

        <div class="p-5 bg-surface-raised border border-surface-border rounded-lg space-y-2">
          <div class="flex items-center gap-2 text-text-primary font-bold">
            <UIcon name="lucide:columns" class="w-5 h-5 text-brand-primary" />
            <span>Container-Queried Rail</span>
          </div>
          <p class="text-sm text-text-secondary leading-relaxed">
            At container widths above <code>60rem</code>, the frame automatically switches to a two-column
            grid (<code>minmax(0, 1fr) 14rem</code>) and anchors the TOC with <code>position: sticky; top: 5rem</code>.
            On smaller screens, the rail tucks away cleanly.
          </p>
        </div>
      </div>
    </section>

    <!-- Scope Comparison -->
    <section class="space-y-3">
      <p class="eyebrow">family guide</p>
      <h2 class="heading--bold text-lg font-bold">Choosing Between Report Primitives</h2>
      <ul class="mt-2 text-text-secondary leading-relaxed list-disc pl-5 space-y-1">
        <li>
          <strong>TuxReportFrame:</strong> Deliverable leaves the app on physical paper or PDF.
          Fixed 8.5×11 or A4 canvas with page breaks and print shadows.
        </li>
        <li>
          <strong>TuxReportPrintSheet:</strong> Any existing interactive view needs a "Print" button
          that cleanly removes chrome and paginates without changing the route.
        </li>
        <li>
          <strong>TuxReportWebFrame:</strong> Deliverable lives at a permanent web URL
          (e.g., <code>tti.tamu.edu/reports/corridor-2026</code>) with responsive cover, reading metrics, and TOC.
        </li>
        <li>
          <strong>Visualizations:</strong> Reader interacts, filters, or pivots data.
          Reports are read linearly; visualizations are explored dynamically.
        </li>
      </ul>
    </section>
  </div>
</template>
