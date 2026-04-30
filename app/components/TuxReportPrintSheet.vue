<script setup lang="ts">
/**
 * TuxReportPrintSheet — drop-in print stylesheet for any page that
 * needs a "Print" button to produce a clean paper version. Renders
 * nothing visible; injects a `<style media="print">` into the head.
 *
 * What it does (only when `@media print` matches):
 *  - hides chrome marked `data-print="hide"` (sidebars, nav, toggles)
 *  - hides the style-guide header + sidebar nav + footer
 *  - removes background colors/shadows from common surfaces so ink
 *    doesn't blanket the page
 *  - sets a `@page` margin reasonable for letter or a4
 *  - forces underlined link styling so links remain identifiable
 *
 * To opt sections out of print, add `data-print="hide"`. To force a
 * page break, add `data-print-break="before"` or `="after"` on a
 * block element. To keep an element together across pages, use
 * `data-print-break="avoid"`.
 */
interface Props {
  size?: "letter" | "a4";
  margin?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "letter",
  margin: "0.6in",
});

const css = computed(() => `
@page {
  size: ${props.size};
  margin: ${props.margin};
}
html, body {
  background: #fff !important;
  color: #000 !important;
}
[data-print="hide"],
header[role="banner"],
nav[aria-label="Main navigation"],
.tux-version-pill,
footer[role="contentinfo"] {
  display: none !important;
}
[data-print-break="before"] { page-break-before: always; }
[data-print-break="after"]  { page-break-after: always; }
[data-print-break="avoid"]  { page-break-inside: avoid; }
a, a:visited {
  color: #5C0025 !important;
  text-decoration: underline;
}
.tux-card, [class*="bg-surface"] {
  background: #fff !important;
  box-shadow: none !important;
}
`);

useHead({
  style: [
    {
      key: "tux-report-print-sheet",
      media: "print",
      innerHTML: css,
    },
  ],
});
</script>

<template>
  <span class="tux-report-print-sheet" aria-hidden="true" hidden />
</template>
