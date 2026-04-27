<script setup lang="ts">
// /changelog — renders the repo's CHANGELOG.md as a navigable page.
//
// Same pipeline as /design/[doc] — markdown imported as raw text at
// build time via Vite's ?raw query, parsed at SSR via parseMarkdown
// so fenced code blocks ship pre-highlighted through Shiki.
import changelogSource from "../../CHANGELOG.md?raw";

useHead({ title: "Changelog · tti-ux" });

const { data: parsed } = await useAsyncData(
  "changelog",
  () => parseMarkdown(changelogSource),
);
</script>

<template>
  <div class="space-y-8">
    <TuxPageHeader eyebrow="release log" title="Changelog">
      Versioned record of what's shipped — components added, doctrine
      changes, breaking adjustments. Follows
      <a href="https://keepachangelog.com/" target="_blank" rel="noopener" class="link-tti">Keep a Changelog</a>
      conventions and
      <a href="https://semver.org/" target="_blank" rel="noopener" class="link-tti">Semantic Versioning</a>.
      The canonical source is
      <a href="https://github.com/anthonyguevara/tti-ux-test/blob/main/CHANGELOG.md" target="_blank" rel="noopener" class="link-tti">CHANGELOG.md</a>
      in the repo; this page is just a friendlier read of it.
    </TuxPageHeader>

    <article class="prose-tux">
      <MDCRenderer
        v-if="parsed"
        :body="parsed.body"
        :data="parsed.data"
      />
    </article>
  </div>
</template>

<style scoped>
/* Mirrors the prose styles from /design/[doc] — keep these in sync
   if either evolves. Both pages render markdown via the same MDC
   pipeline so the type rhythm should match. */
.prose-tux :deep(h1) {
  font-family: var(--font-display);
  font-size: clamp(1.875rem, 1.4rem + 2cqi, 2.5rem);
  line-height: 1.1;
  margin: 0 0 1.5rem;
  color: var(--text-primary);
  letter-spacing: -0.005em;
}

.prose-tux :deep(h2) {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1.375rem;
  line-height: 1.25;
  margin: 2.5rem 0 0.875rem;
  color: var(--text-primary);
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--brand-primary);
}

.prose-tux :deep(h3) {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1.125rem;
  margin: 1.75rem 0 0.625rem;
  color: var(--text-primary);
}

.prose-tux :deep(p) {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.75;
  color: var(--text-secondary);
  margin: 0 0 1rem;
}

.prose-tux :deep(ul),
.prose-tux :deep(ol) {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.75;
  color: var(--text-secondary);
  padding-left: 1.5rem;
  margin: 0 0 1rem;
}

.prose-tux :deep(li) {
  margin: 0.375rem 0;
}

.prose-tux :deep(strong) {
  font-weight: 700;
  color: var(--text-primary);
}

.prose-tux :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  background: var(--surface-sunken);
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-sm);
  color: var(--brand-primary);
}

.prose-tux :deep(pre) {
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

.prose-tux :deep(pre code) {
  background: transparent;
  padding: 0;
  color: var(--text-primary);
}

.prose-tux :deep(a) {
  color: var(--brand-secondary);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: color-mix(in srgb, var(--brand-secondary) 40%, transparent);
}

.prose-tux :deep(hr) {
  border: 0;
  border-top: 1px solid var(--surface-border);
  margin: 2rem 0;
}

.prose-tux :deep(blockquote) {
  margin: 1.25rem 0;
  padding-left: 1.25rem;
  border-left: 3px solid var(--brand-primary);
  font-style: italic;
  color: var(--text-secondary);
}
</style>
