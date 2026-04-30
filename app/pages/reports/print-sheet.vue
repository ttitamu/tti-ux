<script setup lang="ts">
useHead({ title: "TuxReportPrintSheet · Reports · TUX" });

function printPage() {
  if (typeof window !== "undefined") window.print();
}

const basicVue = `<!-- Drop into any page that needs a printable view -->
<tux-report-print-sheet size="letter" margin="0.6in" />

<!-- Hide pieces that shouldn't print -->
<aside data-print="hide">…sidebar chrome…</aside>

<!-- Force a page break before a section -->
<section data-print-break="before">…new page…</section>

<!-- Keep a block from breaking across pages -->
<table data-print-break="avoid">…</table>`;
</script>

<template>
  <div class="space-y-10">
    <!-- The actual sheet — invisible; only acts during print -->
    <TuxReportPrintSheet />

    <TuxPageHeader eyebrow="reports" title="TuxReportPrintSheet">
      Drop-in print stylesheet for any page that needs a "Print" button
      to produce a clean paper version. Renders nothing on screen;
      injects a <code>&lt;style media="print"&gt;</code> into the head.
      Hides chrome with <code>data-print="hide"</code>; paginates with
      <code>data-print-break="before|after|avoid"</code>.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">try it</p>
      <h2 class="heading--bold text-xl font-bold">Print this page</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        The page header and the section below are <code>data-print="hide"</code>
        targets — they'll vanish in the print preview. The section
        marked <code>data-print-break="before"</code> will start on a
        fresh page.
      </p>
      <TuxButton class="mt-4" intent="primary" icon="lucide:printer" @click="printPage">
        Open print preview
      </TuxButton>
    </section>

    <section data-print="hide" class="card-static p-5">
      <p class="eyebrow">screen-only</p>
      <h3 class="heading--bold text-lg font-bold">Hidden from print</h3>
      <p class="mt-2 text-text-secondary">
        This card has <code>data-print="hide"</code>. The print-sheet
        injects <code>display: none</code> for any matching element,
        so it disappears from the print preview without altering the
        on-screen layout.
      </p>
    </section>

    <section data-print-break="before">
      <p class="eyebrow">page 2</p>
      <h2 class="heading--bold text-xl font-bold">Forced page break</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        This section has <code>data-print-break="before"</code> so it
        starts on a fresh sheet. Useful for separating cover · summary
        · appendix in a long report.
      </p>
    </section>

    <section>
      <p class="eyebrow">api</p>
      <h2 class="heading--bold text-xl font-bold">Usage</h2>
      <TuxExample class="mt-4" :vue="basicVue">
        <p class="text-sm text-text-muted">
          (No live demo — the sheet acts in print only. Click the
          button above to see it work.)
        </p>
      </TuxExample>
    </section>
  </div>
</template>
