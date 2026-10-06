<script setup lang="ts">
import tuxReportPrintSheetSource from "~/components/TuxReportPrintSheet.vue?raw";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxReportPrintSheet · Reports Studio · TUX" });

const printControls: TuxPropControl[] = [
  {
    prop: "size",
    label: "Paper Format",
    type: "select",
    options: [
      { label: "Letter (8.5″ × 11″)", value: "letter" },
      { label: "A4 (210mm × 297mm)", value: "a4" },
    ],
    defaultValue: "letter",
    description: "Target paper size injected into @page rule",
  },
  {
    prop: "margin",
    label: "Print Margins",
    type: "select",
    options: [
      { label: "0.5in (Compact / Dense Archival)", value: "0.5in" },
      { label: "0.6in (Standard TTI Default)", value: "0.6in" },
      { label: "0.75in (Editorial Book Margin)", value: "0.75in" },
      { label: "1.0in (Legal / Formal Submission)", value: "1.0in" },
    ],
    defaultValue: "0.6in",
    description: "Page margins injected into @page rule",
  },
  {
    prop: "simulatePrintMode",
    label: "Simulate Print View On-Screen",
    type: "boolean",
    defaultValue: false,
    description: "Applies ink-saver monochrome preview and hides data-print='hide' elements directly inside the playground stage",
  },
];

const printPresets: TuxPlaygroundPreset[] = [
  {
    name: "standard-letter",
    label: "Standard US Letter (0.6in Margin)",
    description: "Default TTI institutional print geometry with balanced margins for reports and briefs",
    icon: "lucide:file-text",
    values: {
      size: "letter",
      margin: "0.6in",
      simulatePrintMode: false,
    },
  },
  {
    name: "compact-a4",
    label: "Compact Archival A4 (0.5in Margin)",
    description: "International ISO 216 paper format with tight margins for data-heavy archival sheets",
    icon: "lucide:printer",
    values: {
      size: "a4",
      margin: "0.5in",
      simulatePrintMode: false,
    },
  },
  {
    name: "editorial-wide",
    label: "Editorial Book (0.75in Margin)",
    description: "Generous editorial whitespace tailored for executive memos and legislative summaries",
    icon: "lucide:book-open",
    values: {
      size: "letter",
      margin: "0.75in",
      simulatePrintMode: false,
    },
  },
  {
    name: "simulated-preview",
    label: "Simulated Ink-Saver Preview",
    description: "Live on-screen simulation of print media overrides, hiding chrome and marking page breaks",
    icon: "lucide:eye",
    values: {
      size: "letter",
      margin: "0.6in",
      simulatePrintMode: true,
    },
  },
];

const codeTemplate = (values: Record<string, any>) => {
  const sizeAttr = values.size !== "letter" ? ` size="${values.size}"` : "";
  const marginAttr = values.margin !== "0.6in" ? ` margin="${values.margin}"` : "";

  return `<!-- Drop into any Nuxt or Vue page requiring clean print output -->
<tux-report-print-sheet${sizeAttr}${marginAttr} />

<!-- Chrome element hidden from paper / PDF print output -->
<aside data-print="hide" class="sidebar">
  ...navigation tabs, filter knobs, and action buttons...
</aside>

<!-- Printable content section 1 -->
<article>
  <header>
    <h1>Corridor Mobility Evaluation — IH-35 Central</h1>
    <p class="eyebrow">Executive Summary · FY2026</p>
  </header>
  <p>During the primary evaluation interval...</p>
</article>

<!-- Force a clean page break before appendix or section 2 -->
<section data-print-break="before">
  <h2>Appendix A · Sensor Telemetry &amp; Confidence Bands</h2>
  <table data-print-break="avoid">
    ...keep table rows unified without breaking across sheets...
  </table>
</section>`;
};

function triggerPrint() {
  if (typeof window !== "undefined") {
    window.print();
  }
}
</script>

<template>
  <div class="space-y-12">
    <!-- Active drop-in print sheet component -->
    <TuxReportPrintSheet />

    <TuxPageHeader eyebrow="reports studio" title="TuxReportPrintSheet">
      Drop-in print stylesheet engine for any application page that needs
      a "Print" button to produce a publication-grade paper or PDF output.
      Renders nothing visible on screen; dynamically injects a
      <code>&lt;style media="print"&gt;</code> rule with <code>@page</code>
      dimensions, ink-saver background overrides, and smart link styling.
      Hides interactive chrome with <code>data-print="hide"</code>;
      paginates cleanly with <code>data-print-break="before|after|avoid"</code>.
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-report-print-sheet"
        component-name="TuxReportPrintSheet"
        title="Print Stylesheet Workbench"
        eyebrow="Print Engine & Geometry"
        :controls="printControls"
        :presets="printPresets"
        :source="tuxReportPrintSheetSource"
        :code-template="codeTemplate"
        preview-padding="p-4 sm:p-6"
      >
        <template #default="{ values }">
          <div class="w-full flex flex-col items-center">
            <!-- Dynamic Print Sheet Instance matching current playground values -->
            <TuxReportPrintSheet :size="values.size" :margin="values.margin" />

            <!-- Action & Status Toolbar -->
            <div class="w-full max-w-4xl flex items-center justify-between text-xs text-text-muted mb-4 px-2">
              <div class="flex items-center gap-2">
                <span class="font-mono bg-surface-sunken px-2 py-0.5 rounded border border-surface-border">
                  @page { size: {{ values.size }}; margin: {{ values.margin }}; }
                </span>
                <span
                  v-if="values.simulatePrintMode"
                  class="font-mono text-xs px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/30 font-bold"
                >
                  Simulation Active
                </span>
              </div>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors shadow-xs"
                @click="triggerPrint"
              >
                <UIcon name="lucide:printer" class="w-4 h-4" />
                <span>Open System Print Dialog</span>
              </button>
            </div>

            <!-- Simulated Document Stage -->
            <div
              class="w-full max-w-4xl transition-all duration-300 rounded-lg p-6 sm:p-8 border"
              :class="values.simulatePrintMode
                ? 'bg-white text-black border-neutral-300 shadow-md font-serif'
                : 'bg-surface-raised text-text-primary border-surface-border shadow-xs'"
            >
              <!-- Screen Chrome Banner (tagged data-print="hide") -->
              <div
                v-if="!values.simulatePrintMode"
                data-print="hide"
                class="mb-6 p-4 rounded-md border border-brand-primary/20 bg-brand-primary/5 flex items-start justify-between gap-3"
              >
                <div class="flex items-start gap-2.5">
                  <UIcon name="lucide:eye-off" class="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span class="text-xs font-mono font-bold uppercase text-brand-primary block">
                      Screen-Only UI Chrome (data-print="hide")
                    </span>
                    <p class="text-xs text-text-secondary mt-0.5">
                      This filter toolbar, side navigation, and action strip automatically vanish when printed or exported as PDF.
                    </p>
                  </div>
                </div>
                <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-raised border border-surface-border text-text-muted">
                  Hidden in Print
                </span>
              </div>

              <!-- When simulation is active, show small hint badge -->
              <div v-else class="mb-4 pb-2 border-b border-neutral-200 text-xs font-mono text-neutral-500 flex justify-between">
                <span>[SIMULATION: Screen chrome hidden; ink-saver active]</span>
                <span>Margin: {{ values.margin }} · Size: {{ values.size }}</span>
              </div>

              <!-- Page 1 Document Content -->
              <article class="space-y-4">
                <div class="border-b-2 border-brand-primary pb-3">
                  <p class="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    TTI Research Evaluation · FY2026 Q1
                  </p>
                  <h2 class="text-2xl font-bold font-sans tracking-tight" :class="values.simulatePrintMode ? 'text-black' : 'text-text-primary'">
                    Corridor Mobility &amp; Autonomous Transit Operations
                  </h2>
                  <p class="text-xs text-neutral-500 mt-1">
                    Texas A&amp;M Transportation Institute · Project 0-7114 · Austin &amp; San Antonio Corridors
                  </p>
                </div>

                <p class="text-sm leading-relaxed" :class="values.simulatePrintMode ? 'text-neutral-800' : 'text-text-secondary'">
                  During the continuous 90-day test period on the IH-35 managed lanes, connected vehicle telemetry
                  demonstrated a 14.8% decrease in stop-and-go wave propagation following automated variable speed advisory
                  activations. Cross-sectional detector stations logged 4.2 million discrete vehicle passages with zero lost-time
                  safety events attributable to sensor latency.
                </p>

                <!-- Data Table with avoid break attribute -->
                <div data-print-break="avoid" class="my-4 overflow-hidden rounded border" :class="values.simulatePrintMode ? 'border-neutral-300' : 'border-surface-border'">
                  <table class="w-full text-left text-xs">
                    <thead :class="values.simulatePrintMode ? 'bg-neutral-100 text-neutral-700' : 'bg-surface-sunken text-text-secondary'">
                      <tr>
                        <th class="p-2.5 font-semibold">Test Corridor</th>
                        <th class="p-2.5 font-semibold">Mean Travel Time</th>
                        <th class="p-2.5 font-semibold">Buffer Index</th>
                        <th class="p-2.5 font-semibold">Incident Clear Time</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y" :class="values.simulatePrintMode ? 'divide-neutral-200 text-neutral-900' : 'divide-surface-border text-text-primary'">
                      <tr>
                        <td class="p-2.5 font-mono">IH-35 Segment North</td>
                        <td class="p-2.5 font-mono">22.4 min</td>
                        <td class="p-2.5 font-mono">1.18 (-8.2%)</td>
                        <td class="p-2.5 font-mono">14.1 min</td>
                      </tr>
                      <tr>
                        <td class="p-2.5 font-mono">US-290 East Gateway</td>
                        <td class="p-2.5 font-mono">18.1 min</td>
                        <td class="p-2.5 font-mono">1.12 (-12.0%)</td>
                        <td class="p-2.5 font-mono">11.8 min</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Page Break Indicator -->
                <div
                  data-print-break="before"
                  class="my-6 pt-4 border-t-2 border-dashed flex items-center justify-between gap-3 text-xs font-mono"
                  :class="values.simulatePrintMode ? 'border-neutral-400 text-neutral-600' : 'border-brand-primary/40 text-brand-primary'"
                >
                  <div class="flex items-center gap-2">
                    <UIcon name="lucide:scissors" class="w-4 h-4" />
                    <span>Page Break Boundary (data-print-break="before")</span>
                  </div>
                  <span>Sheet 2 begins here</span>
                </div>

                <!-- Page 2 Document Content -->
                <div class="space-y-3 pt-2">
                  <h3 class="text-lg font-bold font-sans" :class="values.simulatePrintMode ? 'text-black' : 'text-text-primary'">
                    Appendix · Methodological Calibration &amp; Verification
                  </h3>
                  <p class="text-sm leading-relaxed" :class="values.simulatePrintMode ? 'text-neutral-800' : 'text-text-secondary'">
                    All inductive loop and radar telemetry underwent secondary validation against TxDOT CRIS
                    crash report records. Bootstrap confidence intervals (B = 2,000 resamples) yielded a 95%
                    interval of [12.2%, 17.4%] for travel time reliability enhancements.
                  </p>
                  <p class="text-xs pt-4 border-t text-neutral-500 font-mono" :class="values.simulatePrintMode ? 'border-neutral-200' : 'border-surface-border'">
                    Published by Texas A&amp;M Transportation Institute · <a href="https://tti.tamu.edu" class="underline text-brand-primary">tti.tamu.edu</a>
                  </p>
                </div>
              </article>
            </div>
          </div>
        </template>
      </TuxPlayground>
    </section>

    <!-- Print Attributes Guide -->
    <section class="space-y-4">
      <p class="eyebrow">attributes</p>
      <h2 class="heading--bold text-xl font-bold">Print Control Data Attributes</h2>
      <p class="text-text-secondary leading-relaxed max-w-3xl">
        <code>TuxReportPrintSheet</code> automatically recognizes and processes standard
        HTML data attributes on any DOM element without needing component-specific wrappers:
      </p>

      <div class="overflow-x-auto rounded-lg border border-surface-border">
        <table class="w-full text-left text-sm">
          <thead class="bg-surface-sunken text-xs font-mono font-semibold text-text-secondary uppercase border-b border-surface-border">
            <tr>
              <th class="p-3">Attribute</th>
              <th class="p-3">CSS Rule Applied</th>
              <th class="p-3">Behavior &amp; Purpose</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-border font-mono text-xs">
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">data-print="hide"</td>
              <td class="p-3 text-text-secondary">display: none !important;</td>
              <td class="p-3 font-sans text-text-secondary">Hides interactive screen chrome (headers, navigations, filters, buttons) from the printed paper or PDF.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">data-print-break="before"</td>
              <td class="p-3 text-text-secondary">page-break-before: always;</td>
              <td class="p-3 font-sans text-text-secondary">Forces the browser or PDF printer to start the annotated section on a fresh page sheet.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">data-print-break="after"</td>
              <td class="p-3 text-text-secondary">page-break-after: always;</td>
              <td class="p-3 font-sans text-text-secondary">Paginates immediately after the target element, pushing subsequent content to the next sheet.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">data-print-break="avoid"</td>
              <td class="p-3 text-text-secondary">page-break-inside: avoid;</td>
              <td class="p-3 font-sans text-text-secondary">Guarantees that tables, chart exhibits, or callout cards remain intact and do not split across page seams.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Architecture & Standards -->
    <section class="space-y-4">
      <p class="eyebrow">architecture</p>
      <h2 class="heading--bold text-xl font-bold">Print Optimization &amp; Ink Savings</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-5 bg-surface-raised border border-surface-border rounded-lg space-y-2">
          <div class="flex items-center gap-2 text-text-primary font-bold">
            <UIcon name="lucide:droplet" class="w-5 h-5 text-brand-primary" />
            <span>Pure White Canvas</span>
          </div>
          <p class="text-xs text-text-secondary leading-relaxed">
            Forces <code>background: #fff !important</code> on <code>html</code>, <code>body</code>,
            and surface cards to avoid consuming printer ink across large tinted surfaces.
          </p>
        </div>

        <div class="p-5 bg-surface-raised border border-surface-border rounded-lg space-y-2">
          <div class="flex items-center gap-2 text-text-primary font-bold">
            <UIcon name="lucide:link" class="w-5 h-5 text-brand-primary" />
            <span>Preserved Hyperlinks</span>
          </div>
          <p class="text-xs text-text-secondary leading-relaxed">
            Forces authentic Aggie maroon color (#5C0025) and underlines on all link elements so citations
            and URL references remain distinct and recognizable on printouts.
          </p>
        </div>

        <div class="p-5 bg-surface-raised border border-surface-border rounded-lg space-y-2">
          <div class="flex items-center gap-2 text-text-primary font-bold">
            <UIcon name="lucide:shield-check" class="w-5 h-5 text-brand-primary" />
            <span>Zero Runtime Overhead</span>
          </div>
          <p class="text-xs text-text-secondary leading-relaxed">
            The component renders a hidden marker in the DOM and uses Nuxt's <code>useHead</code> to attach
            the stylesheet once to the document head with media="print".
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
