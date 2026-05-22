<script setup lang="ts">
/**
 * TuxPaperMeta — academic paper metadata block.
 *
 * Surfaces DOI / license / funder / published / version / type in
 * a compact key-value grid. Use beneath `TuxAuthorByline` in the
 * publication header rhythm.
 *
 * Slots can override or extend the default fields; the props are
 * a convenience for the common ones.
 */
interface Props {
  /** DOI (just the suffix — e.g. "10.1234/example.5678"). */
  doi?: string;
  /** License (SPDX identifier or readable name). */
  license?: string;
  /** Funding source(s) — array for multi-funder papers. */
  funders?: string[];
  /** Published date (ISO 8601 or any parseable string). */
  published?: string;
  /** Version / revision (e.g. "v2.1", "Preprint 2026-04-21"). */
  version?: string;
  /** Type — "Article" / "Report" / "Preprint" / etc. */
  type?: string;
  /** Pages (e.g. "1-24" or "e0123"). */
  pages?: string;
  /** Journal / venue. */
  venue?: string;
}

withDefaults(defineProps<Props>(), {
  doi: undefined,
  license: undefined,
  funders: undefined,
  published: undefined,
  version: undefined,
  type: undefined,
  pages: undefined,
  venue: undefined,
});

function doiUrl(doi: string): string {
  return `https://doi.org/${doi}`;
}
</script>

<template>
  <dl class="tux-paper-meta">
    <template v-if="type">
      <dt>Type</dt>
      <dd>{{ type }}</dd>
    </template>
    <template v-if="venue">
      <dt>Venue</dt>
      <dd>{{ venue }}</dd>
    </template>
    <template v-if="published">
      <dt>Published</dt>
      <dd>
        <time :datetime="published">{{ published }}</time>
      </dd>
    </template>
    <template v-if="version">
      <dt>Version</dt>
      <dd>{{ version }}</dd>
    </template>
    <template v-if="pages">
      <dt>Pages</dt>
      <dd>{{ pages }}</dd>
    </template>
    <template v-if="doi">
      <dt>DOI</dt>
      <dd>
        <a :href="doiUrl(doi)" class="link-tti tux-paper-meta__doi" target="_blank" rel="noopener">
          {{ doi }}
          <Icon name="lucide:external-link" :size="11" />
        </a>
      </dd>
    </template>
    <template v-if="license">
      <dt>License</dt>
      <dd>{{ license }}</dd>
    </template>
    <template v-if="funders && funders.length">
      <dt>Funding</dt>
      <dd>
        <template v-for="(funder, i) in funders" :key="funder">
          {{ funder }}<span v-if="i < funders.length - 1">; </span>
        </template>
      </dd>
    </template>
    <slot />
  </dl>
</template>

<style scoped>
.tux-paper-meta {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: 0.375rem 1rem;
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  margin: 1rem 0;
  padding: 0.75rem 0;
  border-top: 1px solid var(--surface-border);
  border-bottom: 1px solid var(--surface-border);
}

.tux-paper-meta dt {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  font-size: 0.6875rem;
  color: var(--text-muted);
  align-self: baseline;
}

.tux-paper-meta dd {
  margin: 0;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.tux-paper-meta__doi {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

@media (max-width: 47.99rem) {
  .tux-paper-meta {
    grid-template-columns: 1fr;
    gap: 0.125rem;
  }
  .tux-paper-meta dt {
    margin-top: 0.5rem;
  }
  .tux-paper-meta dt:first-child {
    margin-top: 0;
  }
}
</style>
