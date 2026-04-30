<script setup lang="ts">
useHead({ title: "Reports · TUX" });

/**
 * /reports — landing for the reports section.
 *
 * Reports are *finished narratives* read top-to-bottom; the reader
 * doesn't pivot or filter. That's the separation from
 * /visualizations, which deliver an interactive surface.
 *
 * Three output media, all in this section because they share the
 * same posture (finished narrative, top-to-bottom):
 *   - TuxReportFrame    — paper / PDF (page-sized canvas)
 *   - TuxReportPrintSheet — print stylesheet for any page
 *   - TuxReportWebFrame — web-hosted long-form (HTML page)
 */
const tiles = [
  {
    label: "TuxReportFrame",
    to: "/reports/frame",
    icon: "lucide:file-text",
    medium: "paper · PDF",
    blurb: "Page-sized canvas (letter / a4, portrait or landscape) for PDF export and print. Visualizations, stats, and prose go inside.",
  },
  {
    label: "TuxReportPrintSheet",
    to: "/reports/print-sheet",
    icon: "lucide:printer",
    medium: "print stylesheet",
    blurb: "Drop-in print stylesheet. Hides chrome, forces black ink, paginates with data-print-break attributes.",
  },
  {
    label: "TuxReportWebFrame",
    to: "/reports/web-frame",
    icon: "lucide:globe",
    medium: "web-hosted",
    blurb: "Long-form HTML canvas — cover, byline, lede, optional sticky TOC, body, footer. For permanent-URL deliverables (annual report, findings, accreditation summary).",
  },
];
</script>

<template>
  <div class="space-y-8">
    <TuxPageHeader eyebrow="section" title="Reports">
      Finished-narrative deliverables — paper, PDF, print, or
      web-hosted long-form. Distinct from
      <NuxtLink to="/visualizations" class="link-tti">Visualizations</NuxtLink>:
      reports are read top-to-bottom; visualizations are pivoted and
      filtered. The TuxReport primitives provide the chrome; what
      goes inside is your call (stats, charts, prose, embeds).
    </TuxPageHeader>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NuxtLink
        v-for="t in tiles"
        :key="t.to"
        :to="t.to"
        class="card-linked p-5 flex gap-4 items-start"
      >
        <UIcon :name="t.icon" class="w-6 h-6 text-text-brand flex-shrink-0 mt-1" />
        <div>
          <p class="eyebrow">{{ t.medium }}</p>
          <h3 class="heading--bold text-base font-bold">{{ t.label }}</h3>
          <p class="mt-1 text-sm text-text-secondary leading-relaxed">{{ t.blurb }}</p>
        </div>
      </NuxtLink>
    </section>

    <section>
      <p class="eyebrow">when to reach for which</p>
      <h2 class="heading--bold text-lg font-bold">Pick by output medium</h2>
      <ul class="mt-2 text-text-secondary leading-relaxed list-disc pl-5 space-y-1">
        <li>
          Deliverable leaves the app on <strong>paper or PDF</strong>
          (quarterly write-up, IRB submission, sponsor packet) →
          <NuxtLink to="/reports/frame" class="link-tti">TuxReportFrame</NuxtLink>.
        </li>
        <li>
          Existing page needs a <strong>"Print" button</strong> that
          produces a clean paper version of itself →
          <NuxtLink to="/reports/print-sheet" class="link-tti">TuxReportPrintSheet</NuxtLink>.
        </li>
        <li>
          Deliverable lives at a <strong>permanent URL</strong> on
          tti.tamu.edu or a program site (annual report, findings
          page, accreditation summary) →
          <NuxtLink to="/reports/web-frame" class="link-tti">TuxReportWebFrame</NuxtLink>.
        </li>
        <li>
          Reader is meant to <strong>pivot or filter</strong> the
          data — that's not a Report, it's a
          <NuxtLink to="/visualizations" class="link-tti">Visualization</NuxtLink>.
        </li>
      </ul>
    </section>
  </div>
</template>
