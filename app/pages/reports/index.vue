<script setup lang="ts">
useHead({ title: "Publication & Reports Studio · TUX" });

/**
 * /reports — landing hub for the Publication & Reports Studio.
 *
 * Reports are *finished narratives* read top-to-bottom; the reader
 * doesn't pivot or filter. That's the core distinction from
 * /visualizations, which deliver an interactive exploratory surface.
 */
const reportEngines = [
  {
    label: "TuxReportFrame",
    to: "/reports/frame",
    icon: "lucide:file-text",
    medium: "paper · PDF export",
    badge: "Interactive Canvas",
    blurb: "Page-sized canvas (letter / a4, portrait or landscape) for PDF export and print. Visualizations, stats, and prose go inside.",
    specs: ["Letter & A4 dimensions", "Automatic print shadow removal", "page-break-after support", "Compact vs Editorial density"],
  },
  {
    label: "TuxReportPrintSheet",
    to: "/reports/print-sheet",
    icon: "lucide:printer",
    medium: "print stylesheet engine",
    badge: "Zero-DOM Utility",
    blurb: "Drop-in print stylesheet. Hides screen chrome, enforces ink-saver backgrounds, and paginates with data-print-break attributes.",
    specs: ["@media print injection", "data-print='hide' support", "data-print-break pagination", "Preserved Aggie maroon links"],
  },
  {
    label: "TuxReportWebFrame",
    to: "/reports/web-frame",
    icon: "lucide:globe",
    medium: "web-hosted long-form",
    badge: "Permanent URL",
    blurb: "Long-form HTML canvas — cover, byline, lede, sticky TOC rail, reading time, and footer. For permanent-URL deliverables.",
    specs: ["3 reading measures (~56ch/70ch/82ch)", "Sticky scroll-spy rail", "Container queried (60rem)", "Accessible typography rhythm"],
  },
];

const editorialTools = [
  {
    label: "TuxEditorialArticle",
    to: "/components/editorial-article",
    icon: "lucide:newspaper",
    category: "reader experience",
    blurb: "Flagship research article reader with 7 hero variants (including AI Modern atmospheric aura and Interactive Canvas), reading progress, and metric stats.",
  },
  {
    label: "TuxCitationExport",
    to: "/components/citation-export",
    icon: "lucide:quote",
    category: "citation utility",
    blurb: "Standardized academic citation menu supporting APA 7th, Chicago, MLA, IEEE, BibTeX, and RIS formats with 1-click clipboard copying.",
  },
  {
    label: "TuxFigureCaption",
    to: "/components/figure-caption",
    icon: "lucide:image",
    category: "academic figure",
    blurb: "Accessible <figure> and <figcaption> container for charts and diagrams with numbered exhibits and source credits.",
  },
  {
    label: "TuxInlineCitation",
    to: "/components/inline-citation",
    icon: "lucide:bookmark",
    category: "inline reference",
    blurb: "Superscript footnote pill [N] within body prose with hover/click popover revealing source title, DOI link, excerpt, and retrieval score.",
  },
  {
    label: "TuxCitations",
    to: "/components/citations",
    icon: "lucide:list-ordered",
    category: "reference list",
    blurb: "Numbered source list grid displaying title, monospace file path, and retrieval similarity score for assistant messages and report appendices.",
  },
];
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="publishing studio" title="Publication & Reports Studio">
      Finished-narrative deliverables — paper sheets, PDF exports, drop-in
      print stylesheets, and web-hosted long-form research publications.
      Distinct from
      <NuxtLink to="/visualizations" class="link-tti">Visualizations</NuxtLink>:
      reports are read linearly top-to-bottom; visualizations are pivoted and
      filtered interactively. The TuxReport primitives provide the standardized
      chrome and geometry; what goes inside is your call (stats, charts, prose, embeds).
    </TuxPageHeader>

    <!-- Core Report Engines -->
    <section class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p class="eyebrow">core engines</p>
          <h2 class="heading--bold text-xl font-bold">Three Publication Delivery Primitives</h2>
        </div>
        <span class="text-xs font-mono text-text-muted">Interactive Workbenches · Multi-Framework Code</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <NuxtLink
          v-for="e in reportEngines"
          :key="e.to"
          :to="e.to"
          class="card-linked p-6 flex flex-col justify-between group"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-lg bg-surface-sunken border border-surface-border flex items-center justify-center text-text-brand group-hover:scale-105 transition-transform">
                <UIcon :name="e.icon" class="w-5 h-5" />
              </div>
              <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-sunken border border-surface-border text-text-muted">
                {{ e.badge }}
              </span>
            </div>

            <div>
              <p class="eyebrow">{{ e.medium }}</p>
              <h3 class="heading--bold text-lg font-bold group-hover:text-brand-primary transition-colors">
                {{ e.label }}
              </h3>
              <p class="mt-1.5 text-xs text-text-secondary leading-relaxed">
                {{ e.blurb }}
              </p>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-surface-border/60">
            <ul class="text-[11px] text-text-muted space-y-1 font-mono">
              <li v-for="spec in e.specs" :key="spec" class="flex items-center gap-1.5">
                <UIcon name="lucide:check" class="w-3 h-3 text-brand-primary flex-shrink-0" />
                <span>{{ spec }}</span>
              </li>
            </ul>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Editorial & Academic Publishing Primitives -->
    <section class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p class="eyebrow">editorial &amp; citations</p>
          <h2 class="heading--bold text-xl font-bold">Academic Citations &amp; Publishing Primitives</h2>
        </div>
        <span class="text-xs font-mono text-text-muted">Inside Lane · TRR / IEEE Standards</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink
          v-for="item in editorialTools"
          :key="item.to"
          :to="item.to"
          class="card-linked p-5 flex items-start gap-4 group"
        >
          <div class="w-9 h-9 rounded-md bg-surface-sunken border border-surface-border flex items-center justify-center text-text-brand flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
            <UIcon :name="item.icon" class="w-5 h-5" />
          </div>
          <div>
            <p class="eyebrow">{{ item.category }}</p>
            <h3 class="heading--bold text-sm font-bold group-hover:text-brand-primary transition-colors">
              {{ item.label }}
            </h3>
            <p class="mt-1 text-xs text-text-secondary leading-relaxed">
              {{ item.blurb }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Architecture Comparison Matrix -->
    <section class="space-y-4">
      <p class="eyebrow">decision guide</p>
      <h2 class="heading--bold text-xl font-bold">Choosing the Right Delivery Mechanism</h2>
      <div class="overflow-x-auto rounded-lg border border-surface-border">
        <table class="w-full text-left text-sm">
          <thead class="bg-surface-sunken text-xs font-mono font-semibold text-text-secondary uppercase border-b border-surface-border">
            <tr>
              <th class="p-3.5">Component</th>
              <th class="p-3.5">Target Medium</th>
              <th class="p-3.5">CSS Architecture</th>
              <th class="p-3.5">Key Capability</th>
              <th class="p-3.5">Primary Audience</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-border text-xs">
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3.5 font-bold font-mono text-brand-primary">
                <NuxtLink to="/reports/frame" class="hover:underline">TuxReportFrame</NuxtLink>
              </td>
              <td class="p-3.5">Paper sheet / PDF export</td>
              <td class="p-3.5 font-mono text-text-muted">Fixed in/mm + @media print</td>
              <td class="p-3.5 text-text-secondary">Bound page canvas with paper elevation and break-after</td>
              <td class="p-3.5 text-text-secondary">Sponsors, legislative boards, IRB reviewers</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3.5 font-bold font-mono text-brand-primary">
                <NuxtLink to="/reports/print-sheet" class="hover:underline">TuxReportPrintSheet</NuxtLink>
              </td>
              <td class="p-3.5">Drop-in print button</td>
              <td class="p-3.5 font-mono text-text-muted">Dynamic &lt;style media="print"&gt;</td>
              <td class="p-3.5 text-text-secondary">data-print="hide" chrome stripping + ink-saver overrides</td>
              <td class="p-3.5 text-text-secondary">App end-users printing current application views</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3.5 font-bold font-mono text-brand-primary">
                <NuxtLink to="/reports/web-frame" class="hover:underline">TuxReportWebFrame</NuxtLink>
              </td>
              <td class="p-3.5">Permanent web URL</td>
              <td class="p-3.5 font-mono text-text-muted">Container queries (cqw) + ch measure</td>
              <td class="p-3.5 text-text-secondary">Responsive cover, sticky TOC rail, and reading-time metrics</td>
              <td class="p-3.5 text-text-secondary">Public readership, stakeholders, web researchers</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3.5 font-bold font-mono text-brand-primary">
                <NuxtLink to="/components/editorial-article" class="hover:underline">TuxEditorialArticle</NuxtLink>
              </td>
              <td class="p-3.5">Inside Lane news &amp; AI lab</td>
              <td class="p-3.5 font-mono text-text-muted">Tailwind + canvas animations</td>
              <td class="p-3.5 text-text-secondary">7 hero variants, metric stats cards, and reading progress bar</td>
              <td class="p-3.5 text-text-secondary">Faculty, research teams, institutional announcements</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
