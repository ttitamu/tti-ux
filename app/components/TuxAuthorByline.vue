<script setup lang="ts">
/**
 * TuxAuthorByline — multi-author byline with affiliations + ORCID.
 *
 * Renders the canonical academic byline format: superscript
 * affiliation markers next to author names, footnoted affiliation
 * list below, optional ORCID iD link, corresponding-author marker.
 *
 * Two layouts:
 *   - **compact** (default) — names inline, affiliations as a single
 *     small block below (good for paper headers, web pages)
 *   - **stacked** — each author on a row with their full affiliation
 *     inline (good for narrow columns, mobile)
 *
 * Pairs with `TuxAbstract` + `TuxPaperMeta` in the publication
 * header rhythm.
 */
import { computed } from "vue";

export interface TuxByLineAuthor {
  /** Display name (preferred form — "R. Chen" or "Ricardo Chen"). */
  name: string;
  /** Affiliation indices (1-based) into the affiliations array.
   *  Single-author papers can omit; multi-affiliation authors list
   *  multiple. */
  affiliations?: number[];
  /** Optional ORCID iD (just the digits — e.g. "0000-0002-1234-5678"). */
  orcid?: string;
  /** Mark this author as the corresponding author. */
  corresponding?: boolean;
  /** Optional contact email for the corresponding author. */
  email?: string;
}

interface Props {
  authors: TuxByLineAuthor[];
  /** Numbered affiliations list — `affiliations[0]` is index 1.
   *  Each is a single string like "Texas A&M Transportation Institute". */
  affiliations?: string[];
  /** Layout variant. Default "compact". */
  layout?: "compact" | "stacked";
}

const props = withDefaults(defineProps<Props>(), {
  affiliations: () => [],
  layout: "compact",
});

const correspondingAuthor = computed(() =>
  props.authors.find((a) => a.corresponding)
);

function orcidUrl(orcid: string): string {
  return `https://orcid.org/${orcid}`;
}
</script>

<template>
  <section class="tux-author-byline" :class="`tux-author-byline--${layout}`">
    <p class="eyebrow tux-author-byline__eyebrow">Authors</p>

    <ol v-if="layout === 'compact'" class="tux-author-byline__list">
      <li
        v-for="(author, i) in authors"
        :key="`${author.name}-${i}`"
        class="tux-author-byline__author"
      >
        <span class="tux-author-byline__name">{{ author.name }}</span>
        <sup v-if="author.affiliations && author.affiliations.length" class="tux-author-byline__affil-marks">
          <span v-for="(a, j) in author.affiliations" :key="a">
            {{ a }}<span v-if="j < author.affiliations.length - 1">,</span>
          </span>
        </sup>
        <sup v-if="author.corresponding" class="tux-author-byline__corresponding" title="Corresponding author">*</sup>
        <a
          v-if="author.orcid"
          :href="orcidUrl(author.orcid)"
          class="tux-author-byline__orcid"
          target="_blank"
          rel="noopener"
          :aria-label="`${author.name} ORCID iD`"
        >
          <Icon name="simple-icons:orcid" :size="12" />
        </a><span v-if="i < authors.length - 1">,</span>
      </li>
    </ol>

    <div v-else class="tux-author-byline__stacked-list">
      <div
        v-for="(author, i) in authors"
        :key="`${author.name}-${i}`"
        class="tux-author-byline__row"
      >
        <p class="tux-author-byline__row-name">
          {{ author.name }}
          <sup v-if="author.corresponding" class="tux-author-byline__corresponding" title="Corresponding author">*</sup>
          <a
            v-if="author.orcid"
            :href="orcidUrl(author.orcid)"
            class="tux-author-byline__orcid"
            target="_blank"
            rel="noopener"
            :aria-label="`${author.name} ORCID iD`"
          >
            <Icon name="simple-icons:orcid" :size="12" />
          </a>
        </p>
        <p v-if="author.affiliations && affiliations.length" class="tux-author-byline__row-affil">
          <template v-for="(a, j) in author.affiliations" :key="a">
            {{ affiliations[a - 1] ?? "" }}<span v-if="j < author.affiliations.length - 1">; </span>
          </template>
        </p>
      </div>
    </div>

    <ol v-if="layout === 'compact' && affiliations.length" class="tux-author-byline__affiliations">
      <li v-for="(aff, i) in affiliations" :key="i">
        <sup>{{ i + 1 }}</sup> {{ aff }}
      </li>
    </ol>

    <p v-if="correspondingAuthor" class="tux-author-byline__corresponding-note">
      <strong>*</strong> Corresponding author{{ correspondingAuthor.email ? `:` : "." }}
      <a v-if="correspondingAuthor.email" :href="`mailto:${correspondingAuthor.email}`" class="link-tti">
        {{ correspondingAuthor.email }}
      </a>
    </p>
  </section>
</template>

<style scoped>
.tux-author-byline {
  font-family: var(--font-sans);
  margin: 1rem 0;
}

.tux-author-byline__eyebrow {
  margin-bottom: 0.5rem;
}

/* Compact layout — authors inline. */
.tux-author-byline__list {
  list-style: none;
  margin: 0 0 0.625rem 0;
  padding: 0;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.125rem 0.375rem;
  font-size: 0.9375rem;
  color: var(--text-primary);
}

.tux-author-byline__author {
  display: inline-flex;
  align-items: baseline;
  gap: 0.125rem;
}

.tux-author-byline__name {
  font-weight: 500;
}

.tux-author-byline__affil-marks,
.tux-author-byline__corresponding {
  font-size: 0.625rem;
  color: var(--text-muted);
  font-weight: 600;
}

.tux-author-byline__orcid {
  display: inline-flex;
  align-items: center;
  color: #a6ce39; /* ORCID brand green */
  margin-left: 0.125rem;
  text-decoration: none;
  vertical-align: super;
  font-size: 0.625rem;
}

.tux-author-byline__orcid:hover {
  color: #8fb330;
}

.tux-author-byline__affiliations {
  list-style: none;
  margin: 0.625rem 0 0 0;
  padding: 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.tux-author-byline__affiliations li {
  margin-bottom: 0.125rem;
}

.tux-author-byline__corresponding-note {
  margin: 0.625rem 0 0 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Stacked layout — one author per row. */
.tux-author-byline__stacked-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tux-author-byline__row-name {
  margin: 0;
  font-weight: 500;
  font-size: 0.9375rem;
  color: var(--text-primary);
}

.tux-author-byline__row-affil {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-style: italic;
}
</style>
