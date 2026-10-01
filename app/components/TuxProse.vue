<script setup lang="ts">
// TuxProse — typographic shell for long-form markdown content.
//
// Wraps `<MDCRenderer>` output, hand-authored HTML, or any other slot
// content that mixes headings, paragraphs, lists, tables, code, and
// blockquotes. Applies the four-family typography rule (display
// headings for H1, Work Sans bold for H2/H3, Open Sans for body
// + lists, JetBrains Mono for code) and the maroon-underlined H2
// rhythm shipped on /design/[doc] and /changelog.
//
// Replaces the ad-hoc `.prose-tux :deep(…)` blocks that previously
// lived inline in `app/pages/changelog.vue`, `app/pages/design/[doc].vue`,
// and `app/pages/markdown.vue`. Single source of truth — the three
// pages now wrap their renderer output in a single `<TuxProse>`.
//
// Usage:
//   <TuxProse>
//     <MDCRenderer :body="parsed.body" :data="parsed.data" />
//   </TuxProse>
//
//   <TuxProse as="div" class="border p-5">  <!-- when you need a different wrapper -->
//     hand-authored markup…
//   </TuxProse>
//
// The wrapper defaults to `<article>` (correct landmark for a
// long-form region). Pass `as="div"` when the parent already provides
// the landmark — e.g. inside a card preview on /markdown.

interface Props {
  /** Tag used for the wrapper. Defaults to `article`. */
  as?: string;
}

withDefaults(defineProps<Props>(), {
  as: "article",
});
</script>

<template>
  <component :is="as" class="tux-prose">
    <slot />
  </component>
</template>

<style scoped>
/* Headings — Oswald for H1 (display tier), Work Sans for H2/H3 (the
   `--font-bold` lane). H2 carries the maroon underline that signals
   the start of a major section — same affordance as `.heading--bold`,
   but applied through the prose layer so authors don't have to add
   utility classes inside markdown. */
.tux-prose :deep(h1) {
  font-family: var(--font-display);
  font-size: clamp(1.875rem, 1.4rem + 2cqi, 2.5rem);
  line-height: 1.1;
  margin: 0 0 1.5rem;
  color: var(--text-primary);
  letter-spacing: -0.005em;
}

.tux-prose :deep(h2) {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1.375rem;
  line-height: 1.25;
  margin: 2.5rem 0 0.875rem;
  color: var(--text-primary);
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--brand-primary);
}

.tux-prose :deep(h3) {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1.125rem;
  margin: 1.75rem 0 0.625rem;
  color: var(--text-primary);
}

.tux-prose :deep(h4) {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 1rem;
  margin: 1.25rem 0 0.5rem;
  color: var(--text-primary);
}

.tux-prose :deep(h1),
.tux-prose :deep(h2),
.tux-prose :deep(h3),
.tux-prose :deep(h4),
.tux-prose :deep(h5),
.tux-prose :deep(h6) {
  color: var(--text-primary);
}

.tux-prose :deep(h1 a),
.tux-prose :deep(h2 a),
.tux-prose :deep(h3 a),
.tux-prose :deep(h4 a),
.tux-prose :deep(h5 a),
.tux-prose :deep(h6 a) {
  color: inherit !important;
  text-decoration: none !important;
  border-bottom: none !important;
}

.tux-prose :deep(h1 a:hover),
.tux-prose :deep(h2 a:hover),
.tux-prose :deep(h3 a:hover),
.tux-prose :deep(h4 a:hover),
.tux-prose :deep(h5 a:hover),
.tux-prose :deep(h6 a:hover) {
  color: inherit !important;
  text-decoration: none !important;
}

/* Body — Open Sans, comfortably leaded for sustained reading. */
.tux-prose :deep(p) {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.75;
  color: var(--text-secondary);
  margin: 0 0 1rem;
}

.tux-prose :deep(ul),
.tux-prose :deep(ol) {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.75;
  color: var(--text-secondary);
  padding-left: 1.5rem;
  margin: 0 0 1rem;
}

.tux-prose :deep(li) {
  margin: 0.375rem 0;
}

.tux-prose :deep(li > ul),
.tux-prose :deep(li > ol) {
  margin: 0.375rem 0 0;
}

.tux-prose :deep(strong) {
  font-weight: 700;
  color: var(--text-primary);
}

.tux-prose :deep(em) {
  font-style: italic;
}

/* Inline code — JetBrains Mono in sunken surface with clean readable tone */
.tux-prose :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  background: var(--surface-sunken);
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  color: var(--text-primary);
  font-weight: 500;
}

/* Fenced code — let Shiki / the parser own coloring; we only set the
   container chrome and clear the inline-code styles from any `<code>`
   nested inside `<pre>`. */
.tux-prose :deep(pre) {
  margin: 1.25rem 0;
  padding: 1rem 1.125rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.6;
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow-x: auto;
}

.tux-prose :deep(pre code) {
  background: transparent;
  padding: 0;
  border: none;
  color: var(--text-primary);
}

/* Links — clean, dignified link styling in TTI maroon or subtle secondary, never loud blue */
.tux-prose :deep(a) {
  color: var(--brand-primary);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: color-mix(in srgb, var(--brand-primary) 35%, transparent);
  transition: color 0.15s ease, text-decoration-color 0.15s ease;
}

.tux-prose :deep(a:hover) {
  color: color-mix(in srgb, var(--brand-primary) 85%, black);
  text-decoration-color: currentColor;
}

.tux-prose :deep(a code) {
  color: inherit;
  border-color: currentColor;
}

[data-theme="tti-dark"] .tux-prose :deep(a) {
  color: var(--brand-accent);
  text-decoration-color: color-mix(in srgb, var(--brand-accent) 35%, transparent);
}

[data-theme="tti-dark"] .tux-prose :deep(a:hover) {
  color: color-mix(in srgb, var(--brand-accent) 85%, white);
  text-decoration-color: currentColor;
}

/* Tables — same rhythm as `TuxTable`: uppercase Work Sans headers,
   2px maroon underline on the header row, 1px sand border between
   rows. Body cells in Open Sans, mono content in JetBrains. */
.tux-prose :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.25rem 0;
  font-size: 0.875rem;
  font-family: var(--font-body);
}

.tux-prose :deep(th) {
  text-align: left;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  padding: 0.625rem 0.875rem;
  border-bottom: 2px solid var(--brand-primary);
  background: var(--surface-sunken);
}

.tux-prose :deep(td) {
  padding: 0.625rem 0.875rem;
  border-bottom: 1px solid var(--surface-border);
  vertical-align: top;
}

.tux-prose :deep(td code) {
  font-size: 0.75rem;
}

/* Horizontal rule — hairline sand, generous breathing room. */
.tux-prose :deep(hr) {
  border: 0;
  border-top: 1px solid var(--surface-border);
  margin: 2rem 0;
}

/* Blockquote — maroon left rule. Italic, secondary text tone. */
.tux-prose :deep(blockquote) {
  margin: 1.25rem 0;
  padding-left: 1.25rem;
  border-left: 3px solid var(--brand-primary);
  font-style: italic;
  color: var(--text-secondary);
}

/* Images — full-width by default with the same hairline + radius as
   `TuxCaptionedMedia`. */
.tux-prose :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--surface-border);
  margin: 1.25rem 0;
}
</style>
