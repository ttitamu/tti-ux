<script setup lang="ts">
/**
 * TuxReportFrame — page-sized canvas for reports that need to render
 * as a fixed-dimension surface (PDF export, print-to-paper, screenshot
 * targets). The frame draws a paper-sheet shadow on screen so editorial
 * preview matches what'll print, and switches to flush borderless on
 * `@media print`.
 *
 * Sizes: `letter` (8.5" × 11") and `letter-landscape` are the defaults
 * for TTI deliverables; `a4` and `a4-landscape` are available for
 * partner orgs. Use `density="compact"` for dashboards-as-PDF (more
 * content per page); `density="editorial"` for prose reports.
 *
 * For multi-page reports, render multiple `<TuxReportFrame>`
 * sequentially and add `page-break-after: always` between them via
 * the `breakAfter` prop on every frame except the last.
 */
type Size = "letter" | "letter-landscape" | "a4" | "a4-landscape";
type Density = "editorial" | "compact";

interface Props {
  size?: Size;
  density?: Density;
  /** Inserts `page-break-after: always` after this frame in print. */
  breakAfter?: boolean;
  /** Optional report title — rendered as an editorial header. */
  title?: string;
  eyebrow?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "letter",
  density: "editorial",
  breakAfter: false,
  title: undefined,
  eyebrow: undefined,
});

const dims = computed(() => {
  switch (props.size) {
    case "letter-landscape": return { w: "11in", h: "8.5in" };
    case "a4":               return { w: "210mm", h: "297mm" };
    case "a4-landscape":     return { w: "297mm", h: "210mm" };
    case "letter":
    default:                 return { w: "8.5in", h: "11in" };
  }
});
</script>

<template>
  <article
    class="tux-report-frame"
    :class="[
      `tux-report-frame--${size}`,
      `tux-report-frame--${density}`,
      breakAfter ? 'tux-report-frame--break-after' : '',
    ]"
    :style="{ width: dims.w, minHeight: dims.h }"
  >
    <header v-if="title || eyebrow || $slots.header" class="tux-report-frame__head">
      <slot name="header">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h1 v-if="title" class="heading--bold tux-report-frame__title">{{ title }}</h1>
      </slot>
    </header>
    <div class="tux-report-frame__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="tux-report-frame__foot">
      <slot name="footer" />
    </footer>
  </article>
</template>

<style scoped>
.tux-report-frame {
  background: var(--surface-raised);
  color: var(--text-primary);
  margin: 0 auto 2rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--surface-border);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.tux-report-frame--editorial {
  padding: 0.75in;
  gap: 1.25rem;
}

.tux-report-frame--compact {
  padding: 0.5in;
  gap: 0.875rem;
}

.tux-report-frame__head {
  border-bottom: 2px solid var(--brand-primary);
  padding-bottom: 0.875rem;
}

.tux-report-frame__title {
  margin: 0.25rem 0 0;
  font-size: 1.75rem;
  line-height: 1.15;
}

.tux-report-frame__body {
  flex: 1;
}

.tux-report-frame__foot {
  border-top: 1px solid var(--surface-border);
  padding-top: 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

@media print {
  .tux-report-frame {
    box-shadow: none;
    border: 0;
    margin: 0;
  }
  .tux-report-frame--break-after {
    page-break-after: always;
  }
}
</style>
