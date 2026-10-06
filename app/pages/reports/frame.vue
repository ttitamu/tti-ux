<script setup lang="ts">
import tuxReportFrameSource from "~/components/TuxReportFrame.vue?raw";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxReportFrame · Reports Studio · TUX" });

const factoid = [
  { value: "412", label: "active projects", note: "+28 vs FY25" },
  { value: "$84.2M", label: "total awarded", note: "+12.4%" },
  { value: "36.8%", label: "TxDOT share", note: "$31.0M" },
];

const frameControls: TuxPropControl[] = [
  {
    prop: "size",
    label: "Page Dimension",
    type: "select",
    options: [
      { label: "Letter (8.5″ × 11″)", value: "letter" },
      { label: "Letter Landscape (11″ × 8.5″)", value: "letter-landscape" },
      { label: "A4 (210mm × 297mm)", value: "a4" },
      { label: "A4 Landscape (297mm × 210mm)", value: "a4-landscape" },
    ],
    defaultValue: "letter",
    description: "Physical paper format and print orientation",
  },
  {
    prop: "density",
    label: "Typographic Density",
    type: "select",
    options: [
      { label: "Editorial (0.75in margins · spacious)", value: "editorial" },
      { label: "Compact (0.5in margins · data-dense)", value: "compact" },
    ],
    defaultValue: "editorial",
    description: "Gutter padding and vertical spacing rhythm",
  },
  {
    prop: "eyebrow",
    label: "Eyebrow Metadata",
    type: "text",
    defaultValue: "quarterly report · 2026 Q1",
    description: "Small uppercase tracking label above the document title",
  },
  {
    prop: "title",
    label: "Document Title",
    type: "text",
    defaultValue: "Sponsored research — TTI corridor program",
    description: "Display headline rendered with editorial weight",
  },
  {
    prop: "breakAfter",
    label: "Page Break After (Print)",
    type: "boolean",
    defaultValue: false,
    description: "Applies page-break-after: always in print stylesheets for multi-page deliverables",
  },
];

const framePresets: TuxPlaygroundPreset[] = [
  {
    name: "executive-quarterly",
    label: "Executive Quarterly Report (Letter)",
    description: "Standard 8.5×11 portrait layout with editorial margins, hero stats, and sponsor funding breakdown",
    icon: "lucide:file-text",
    values: {
      size: "letter",
      density: "editorial",
      eyebrow: "quarterly report · 2026 Q1",
      title: "Sponsored research — TTI corridor program",
      breakAfter: false,
    },
  },
  {
    name: "board-landscape",
    label: "Board Briefing Slide Deck (Landscape)",
    description: "11×8.5 landscape canvas optimized for executive slide decks, wide visualizations, and board presentations",
    icon: "lucide:presentation",
    values: {
      size: "letter-landscape",
      density: "editorial",
      eyebrow: "board briefing · may 2026",
      title: "Statewide Corridor Mobility & Safety Overview",
      breakAfter: false,
    },
  },
  {
    name: "technical-appendix",
    label: "Technical Appendix (A4 Editorial)",
    description: "International ISO 216 A4 format with page-break-after forced for multi-page research deliverables",
    icon: "lucide:book-open",
    values: {
      size: "a4",
      density: "editorial",
      eyebrow: "appendix b · methodology",
      title: "Sensor Calibration & Parametric Modeling",
      breakAfter: true,
    },
  },
  {
    name: "compact-datasheet",
    label: "Dense Operational Factsheet (Compact)",
    description: "Tight 0.5-inch padding with compact typographic rhythm for high-density monitoring data",
    icon: "lucide:table",
    values: {
      size: "letter",
      density: "compact",
      eyebrow: "corridor telemetry · daily summary",
      title: "IH-35 Central Incident Logs & Response Times",
      breakAfter: false,
    },
  },
];

const codeTemplate = (values: Record<string, any>) => {
  const sizeAttr = values.size && values.size !== "letter" ? `\n  size="${values.size}"` : "";
  const densityAttr = values.density && values.density !== "editorial" ? `\n  density="${values.density}"` : "";
  const breakAttr = values.breakAfter ? "\n  break-after" : "";
  const ebAttr = values.eyebrow ? `\n  eyebrow="${values.eyebrow}"` : "";
  const titleAttr = values.title ? `\n  title="${values.title}"` : "";

  return `<tux-report-frame${sizeAttr}${densityAttr}${breakAttr}${ebAttr}${titleAttr}
>
  <!-- Hero stat -->
  <tux-big-stat value="$84.2M" label="awarded · FY26 to date" />

  <!-- 3-up factoid row -->
  <tux-factoid :items="factoid" />

  <!-- Body narrative -->
  <p class="text-text-secondary leading-relaxed mt-4">
    FY26 Q1 closed with awarded funding 12.4% above the same quarter in FY25,
    driven primarily by a $9.2M IH-35 corridor-safety renewal from TxDOT.
  </p>

  <!-- Embedded exhibit from the Visualizations toolkit -->
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
};

function triggerPrint() {
  if (typeof window !== "undefined") {
    window.print();
  }
}
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="reports studio" title="TuxReportFrame">
      Page-sized canvas (letter / a4, portrait or landscape) for PDF
      export and print. The frame is the physical <em>page chrome</em> —
      paper-sheet elevation on screen, flush borderless under
      <code>@media print</code>, editorial header treatment, and footer
      gutter for page numbers and institutional source attribution.
      <strong>Visualizations, stats, prose, and charts go inside</strong>;
      the frame provides the standardized printable container.
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-report-frame"
        component-name="TuxReportFrame"
        title="Report Frame Canvas Workbench"
        eyebrow="Interactive Printable Sheet"
        :controls="frameControls"
        :presets="framePresets"
        :source="tuxReportFrameSource"
        :code-template="codeTemplate"
        preview-padding="p-4 sm:p-6"
      >
        <template #default="{ values }">
          <div class="w-full flex flex-col items-center">
            <!-- Canvas preview bar -->
            <div class="w-full max-w-4xl flex items-center justify-between text-xs text-text-muted mb-3 px-2">
              <span class="font-mono">
                Canvas: {{ values.size }} · {{ values.density }} density
                <span v-if="values.breakAfter" class="text-brand-primary font-bold ml-2">
                  [page-break-after: always]
                </span>
              </span>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded bg-surface-raised border border-surface-border text-text-primary hover:bg-surface-sunken transition-colors"
                @click="triggerPrint"
              >
                <UIcon name="lucide:printer" class="w-3.5 h-3.5 text-text-brand" />
                <span>Test Print Preview</span>
              </button>
            </div>

            <!-- Scrollable stage wrapper ensuring fixed-width canvas remains inspectable -->
            <div class="w-full overflow-x-auto pb-4 flex justify-center">
              <div class="transform-gpu transition-all duration-200">
                <TuxReportFrame
                  :size="values.size"
                  :density="values.density"
                  :eyebrow="values.eyebrow"
                  :title="values.title"
                  :break-after="values.breakAfter"
                >
                  <TuxBigStat value="$84.2M" label="awarded · FY26 to date" />

                  <TuxFactoid :items="factoid" class="mt-4" />

                  <p class="text-text-secondary leading-relaxed mt-4">
                    FY26 Q1 closed with awarded funding 12.4% above the same
                    quarter in FY25, driven primarily by a $9.2M IH-35
                    corridor-safety renewal from TxDOT and a $4.8M FHWA
                    work-zone classifier grant.
                  </p>
                  <p class="mt-3 text-text-secondary leading-relaxed">
                    Coordination with TxDOT followed the established cadence.
                    Outstanding action items track to the May steering review.
                  </p>

                  <div class="mt-4">
                    <TuxVizRPlot
                      kind="svg"
                      src="/viz-rplot-grants.svg"
                      title="Grant draws by sponsor"
                      eyebrow="figure 1"
                      ratio="8/5"
                      source="R 4.4.1 · ggplot2 3.5.1 · scripts/grants-by-quarter.R"
                      :level="2"
                    />
                  </div>

                  <template #footer>
                    <span>tti.tamu.edu · Texas A&amp;M Transportation Institute</span>
                    <span>page 1 of 4</span>
                  </template>
                </TuxReportFrame>
              </div>
            </div>
          </div>
        </template>
      </TuxPlayground>
    </section>

    <!-- Multi-Page Reports Guide -->
    <section class="space-y-4">
      <p class="eyebrow">multi-page architecture</p>
      <h2 class="heading--bold text-xl font-bold">Composing Multi-Page Deliverables</h2>
      <p class="text-text-secondary leading-relaxed max-w-3xl">
        To construct multi-page PDF documents or print packets, render sequential
        <code>&lt;TuxReportFrame&gt;</code> blocks. Set <code>break-after</code> (or <code>:break-after="true"</code>)
        on every page except the final page. In the browser viewport, consecutive frames appear stacked with paper shadows;
        in print and PDF rendering engines (Puppeteer, Playwright, PrinceXML), each frame renders to its own discrete sheet.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div class="p-5 bg-surface-raised border border-surface-border rounded-lg space-y-2">
          <div class="flex items-center gap-2 text-text-primary font-bold">
            <UIcon name="lucide:copy" class="w-5 h-5 text-brand-primary" />
            <span>Multi-Page Page Break Rule</span>
          </div>
          <p class="text-sm text-text-secondary leading-relaxed">
            The <code>breakAfter</code> prop automatically injects <code>page-break-after: always</code> under
            <code>@media print</code> without affecting screen layout or spacing.
          </p>
        </div>

        <div class="p-5 bg-surface-raised border border-surface-border rounded-lg space-y-2">
          <div class="flex items-center gap-2 text-text-primary font-bold">
            <UIcon name="lucide:maximize" class="w-5 h-5 text-brand-primary" />
            <span>Automatic Shadow Removal</span>
          </div>
          <p class="text-sm text-text-secondary leading-relaxed">
            During print preview and PDF generation, the outer border, elevation shadow, and margins
            collapse to 0, ensuring edge-to-edge ink precision with no unwanted gray boundaries.
          </p>
        </div>
      </div>
    </section>

    <!-- Dimension Reference Table -->
    <section class="space-y-4">
      <p class="eyebrow">specifications</p>
      <h2 class="heading--bold text-xl font-bold">Standard Physical Page Dimensions</h2>
      <div class="overflow-x-auto rounded-lg border border-surface-border">
        <table class="w-full text-left text-sm">
          <thead class="bg-surface-sunken text-xs font-mono font-semibold text-text-secondary uppercase border-b border-surface-border">
            <tr>
              <th class="p-3">Size Value</th>
              <th class="p-3">Physical Dimensions</th>
              <th class="p-3">Aspect Ratio</th>
              <th class="p-3">Target Use Case</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-border text-xs">
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-mono font-bold text-brand-primary">letter</td>
              <td class="p-3 font-mono text-text-secondary">8.5in × 11.0in (216 × 279 mm)</td>
              <td class="p-3 font-mono text-text-muted">1 : 1.294 (Portrait)</td>
              <td class="p-3 text-text-secondary">Default for US sponsor deliverables, quarterly reports, IRB forms</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-mono font-bold text-brand-primary">letter-landscape</td>
              <td class="p-3 font-mono text-text-secondary">11.0in × 8.5in (279 × 216 mm)</td>
              <td class="p-3 font-mono text-text-muted">1.294 : 1 (Landscape)</td>
              <td class="p-3 text-text-secondary">Executive briefing decks, wide corridor telemetry maps, dashboard printouts</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-mono font-bold text-brand-primary">a4</td>
              <td class="p-3 font-mono text-text-secondary">210mm × 297mm (8.27 × 11.69 in)</td>
              <td class="p-3 font-mono text-text-muted">1 : √2 ≈ 1.414 (Portrait)</td>
              <td class="p-3 text-text-secondary">International partner deliverables, ISO standard publications, academic journal preprints</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-mono font-bold text-brand-primary">a4-landscape</td>
              <td class="p-3 font-mono text-text-secondary">297mm × 210mm (11.69 × 8.27 in)</td>
              <td class="p-3 font-mono text-text-muted">√2 : 1 ≈ 1.414 (Landscape)</td>
              <td class="p-3 text-text-secondary">International conference poster handouts, multi-column technical diagrams</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Scope / Architectural Separation -->
    <section class="space-y-3">
      <p class="eyebrow">scope & guidance</p>
      <h2 class="heading--bold text-lg font-bold">When to Reach for TuxReportFrame</h2>
      <p class="text-text-secondary leading-relaxed">
        Reach for <code>TuxReportFrame</code> when producing deliverables destined to leave the
        application as paper or PDF — quarterly research reports, legislative briefs, IRB submissions,
        sponsor write-ups, or accreditation packages. If the output is meant to live <em>inside</em>
        the web app and support interactive filtering, pivoting, or drilling, use
        <NuxtLink to="/visualizations" class="link-tti">Visualizations</NuxtLink>, not a Report.
      </p>
    </section>
  </div>
</template>
