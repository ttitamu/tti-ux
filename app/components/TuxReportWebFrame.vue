<script setup lang="ts">
/**
 * TuxReportWebFrame — long-form, web-hosted narrative canvas. The
 * screen-native sibling of TuxReportFrame: same Reports family
 * (finished narrative, read top-to-bottom), but rendered as an
 * HTML page rather than a paper-sized sheet. Use it for the kind
 * of thing tti.tamu.edu publishes as a web feature: an annual
 * report, a research findings write-up, an accreditation summary
 * meant to live at a permanent URL.
 *
 * The frame supplies editorial chrome only — cover (eyebrow / title
 * / lede), byline + date row, an optional sticky table-of-contents
 * rail, the body slot, and a closing source/citation footer. What
 * goes inside the body is normal page composition (TuxBigStat,
 * TuxFactoid, TuxVizEmbed, prose, TuxBlockquote).
 *
 * Distinct from TuxReportFrame: no fixed paper dimensions, no
 * page-break primitives, no `@media print` repaint. If the
 * deliverable is print-bound, use TuxReportFrame; if it's
 * interactive (pivot/filter), it's a Visualization, not a Report.
 *
 * Distinct from TuxPageHeader + free-form sections: this is a
 * deliberately bounded reading frame with a max measure, an
 * optional anchored TOC, and editorial type rhythm tuned for
 * long-form prose. TuxPageHeader is the right reach for most
 * landing pages.
 */
type Width = "narrow" | "default" | "wide";

interface TocEntry {
  /** href fragment, e.g. "#findings" */
  to: string;
  label: string;
}

interface Props {
  eyebrow?: string;
  title?: string;
  /** One-paragraph dek under the title — sets the editorial tone. */
  lede?: string;
  /** Author or program name, e.g. "TTI Roadway Safety Program". */
  byline?: string;
  /** ISO date or display string, e.g. "April 2026". */
  date?: string;
  /** Reading-time estimate, e.g. "12 min read". */
  readingTime?: string;
  /** Optional inline TOC rendered as a sticky right rail (≥ md). */
  toc?: TocEntry[];
  /** Reading measure for the body. `default` ≈ 70ch; `narrow` ≈ 56ch; `wide` ≈ 82ch. */
  width?: Width;
}

const props = withDefaults(defineProps<Props>(), {
  eyebrow: undefined,
  title: undefined,
  lede: undefined,
  byline: undefined,
  date: undefined,
  readingTime: undefined,
  toc: () => [],
  width: "default",
});

const hasMeta = computed(() => !!(props.byline || props.date || props.readingTime));
const hasCover = computed(
  () => !!(props.eyebrow || props.title || props.lede),
);
</script>

<template>
  <article
    class="tux-report-web-frame"
    :class="`tux-report-web-frame--${width}`"
  >
    <header v-if="hasCover" class="tux-report-web-frame__cover">
      <slot name="cover">
        <p v-if="eyebrow" class="eyebrow tux-report-web-frame__eyebrow">{{ eyebrow }}</p>
        <h1 v-if="title" class="heading--bold tux-report-web-frame__title">{{ title }}</h1>
        <p v-if="lede" class="tux-report-web-frame__lede">{{ lede }}</p>
        <div v-if="hasMeta" class="tux-report-web-frame__meta">
          <span v-if="byline" class="tux-report-web-frame__meta-item">
            <UIcon name="lucide:user" class="tux-report-web-frame__meta-icon" />
            {{ byline }}
          </span>
          <span v-if="date" class="tux-report-web-frame__meta-item">
            <UIcon name="lucide:calendar" class="tux-report-web-frame__meta-icon" />
            {{ date }}
          </span>
          <span v-if="readingTime" class="tux-report-web-frame__meta-item">
            <UIcon name="lucide:clock" class="tux-report-web-frame__meta-icon" />
            {{ readingTime }}
          </span>
        </div>
      </slot>
    </header>

    <div class="tux-report-web-frame__shell">
      <div class="tux-report-web-frame__body">
        <slot />
      </div>

      <aside
        v-if="toc.length || $slots.toc"
        class="tux-report-web-frame__toc"
        aria-label="On this page"
      >
        <slot name="toc">
          <p class="eyebrow tux-report-web-frame__toc-eyebrow">on this page</p>
          <ol class="tux-report-web-frame__toc-list">
            <li v-for="entry in toc" :key="entry.to">
              <a :href="entry.to" class="tux-report-web-frame__toc-link">
                {{ entry.label }}
              </a>
            </li>
          </ol>
        </slot>
      </aside>
    </div>

    <footer v-if="$slots.footer" class="tux-report-web-frame__foot">
      <slot name="footer" />
    </footer>
  </article>
</template>

<style scoped>
.tux-report-web-frame {
  container-type: inline-size;
  container-name: tux-report-web-frame;
  color: var(--text-primary);
  background: var(--surface-page);
}

.tux-report-web-frame__cover {
  border-bottom: 2px solid var(--brand-primary);
  padding: 0 0 1.5rem;
  margin: 0 0 2rem;
  max-width: 64rem;
}

.tux-report-web-frame__eyebrow {
  margin: 0 0 0.625rem;
}

.tux-report-web-frame__title {
  margin: 0 0 0.875rem;
  font-size: clamp(2rem, 4cqw + 1rem, 3.25rem);
  line-height: 1.08;
  letter-spacing: -0.01em;
}

.tux-report-web-frame__lede {
  margin: 0;
  font-family: var(--font-elegant, Georgia, serif);
  font-size: clamp(1.0625rem, 0.9cqw + 0.875rem, 1.3125rem);
  line-height: 1.55;
  color: var(--text-secondary);
  max-width: 50rem;
}

.tux-report-web-frame__meta {
  margin-top: 1.125rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-muted);
}

.tux-report-web-frame__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.tux-report-web-frame__meta-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.tux-report-web-frame__shell {
  display: grid;
  gap: 2.5rem;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
}

.tux-report-web-frame__body {
  min-width: 0;
  font-size: 1rem;
  line-height: 1.7;
}

.tux-report-web-frame--narrow .tux-report-web-frame__body { max-width: 56ch; }
.tux-report-web-frame--default .tux-report-web-frame__body { max-width: 70ch; }
.tux-report-web-frame--wide .tux-report-web-frame__body { max-width: 82ch; }

.tux-report-web-frame__body :deep(h2) {
  margin: 2.25rem 0 0.75rem;
  font-family: var(--font-bold, var(--font-display));
  font-size: 1.625rem;
  line-height: 1.2;
  scroll-margin-top: 5rem;
}

.tux-report-web-frame__body :deep(h3) {
  margin: 1.75rem 0 0.5rem;
  font-family: var(--font-bold, var(--font-display));
  font-size: 1.25rem;
  line-height: 1.25;
  scroll-margin-top: 5rem;
}

.tux-report-web-frame__body :deep(p) {
  margin: 0 0 1.125rem;
  color: var(--text-secondary);
}

.tux-report-web-frame__body :deep(p strong) {
  color: var(--text-primary);
}

.tux-report-web-frame__toc {
  font-size: 0.875rem;
}

.tux-report-web-frame__toc-eyebrow {
  margin: 0 0 0.625rem;
}

.tux-report-web-frame__toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-left: 2px solid var(--surface-border);
}

.tux-report-web-frame__toc-link {
  display: block;
  padding: 0.3125rem 0 0.3125rem 0.75rem;
  margin-left: -2px;
  border-left: 2px solid transparent;
  color: var(--text-secondary);
  text-decoration: none;
  line-height: 1.4;
  transition: color var(--motion-fast) var(--ease-standard),
              border-color var(--motion-fast) var(--ease-standard);
}

.tux-report-web-frame__toc-link:hover,
.tux-report-web-frame__toc-link:focus-visible {
  color: var(--brand-primary);
  border-left-color: var(--brand-primary);
}

.tux-report-web-frame__foot {
  margin-top: 3rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--surface-border);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-muted);
}

@container tux-report-web-frame (min-width: 60rem) {
  .tux-report-web-frame__shell {
    grid-template-columns: minmax(0, 1fr) 14rem;
  }

  .tux-report-web-frame__toc {
    position: sticky;
    top: 5rem;
    align-self: start;
  }
}
</style>
