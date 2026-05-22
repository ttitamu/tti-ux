<script setup lang="ts">
/**
 * TuxAbstract — structured academic abstract block.
 *
 * Renders an abstract with up to five labeled sections in the
 * canonical IMRaD-extended shape: **Background / Methods / Results /
 * Conclusion / Keywords**. Each section uses a tight eyebrow +
 * paragraph rhythm so a researcher can scan the structure without
 * reading every word.
 *
 * Two render modes:
 *   - **structured** (default) — explicit eyebrow per section
 *   - **prose** — a single paragraph with optional bolded inline
 *     labels (legacy format compatibility)
 *
 * Use at the top of a `/research/<paper>` page above the body;
 * pairs with `TuxAuthorByline` + `TuxPaperMeta` in the canonical
 * publication header rhythm.
 */
interface Props {
  /** Background / motivation section. */
  background?: string;
  /** Methods / approach section. */
  methods?: string;
  /** Findings / results section. */
  results?: string;
  /** Conclusion / implications section. */
  conclusion?: string;
  /** Optional keyword list — rendered as small caps below the body. */
  keywords?: string[];
  /** Variant. Default "structured". */
  variant?: "structured" | "prose";
  /** Heading level for the section eyebrows (h3 / h4 / h5).
   *  Default h4 — assumes h2 is the paper title above. */
  level?: 2 | 3 | 4 | 5;
}

const props = withDefaults(defineProps<Props>(), {
  background: undefined,
  methods: undefined,
  results: undefined,
  conclusion: undefined,
  keywords: undefined,
  variant: "structured",
  level: 4,
});

const headingTag = computed(() => `h${props.level}`);
</script>

<template>
  <section class="tux-abstract" :aria-labelledby="`abstract-title`">
    <p id="abstract-title" class="eyebrow tux-abstract__eyebrow">Abstract</p>

    <div v-if="variant === 'structured'" class="tux-abstract__structured">
      <div v-if="background" class="tux-abstract__section">
        <component :is="headingTag" class="tux-abstract__heading">Background</component>
        <p class="tux-abstract__body">{{ background }}</p>
      </div>
      <div v-if="methods" class="tux-abstract__section">
        <component :is="headingTag" class="tux-abstract__heading">Methods</component>
        <p class="tux-abstract__body">{{ methods }}</p>
      </div>
      <div v-if="results" class="tux-abstract__section">
        <component :is="headingTag" class="tux-abstract__heading">Results</component>
        <p class="tux-abstract__body">{{ results }}</p>
      </div>
      <div v-if="conclusion" class="tux-abstract__section">
        <component :is="headingTag" class="tux-abstract__heading">Conclusion</component>
        <p class="tux-abstract__body">{{ conclusion }}</p>
      </div>
    </div>

    <div v-else class="tux-abstract__prose">
      <p v-if="background">
        <strong>Background.</strong> {{ background }}
      </p>
      <p v-if="methods">
        <strong>Methods.</strong> {{ methods }}
      </p>
      <p v-if="results">
        <strong>Results.</strong> {{ results }}
      </p>
      <p v-if="conclusion">
        <strong>Conclusion.</strong> {{ conclusion }}
      </p>
    </div>

    <p v-if="keywords && keywords.length" class="tux-abstract__keywords">
      <span class="tux-abstract__keywords-label">Keywords</span>
      <span class="tux-abstract__keywords-list">
        <span v-for="(kw, i) in keywords" :key="kw" class="tux-abstract__keyword">
          {{ kw }}<span v-if="i < keywords.length - 1">,</span>
        </span>
      </span>
    </p>
  </section>
</template>

<style scoped>
.tux-abstract {
  border-top: 2px solid var(--brand-primary);
  border-bottom: 1px solid var(--surface-border);
  padding: 1.25rem 0 1.5rem 0;
  margin: 1.5rem 0;
  font-family: var(--font-sans);
}

.tux-abstract__eyebrow {
  margin: 0 0 0.75rem 0;
  color: var(--brand-primary);
  font-weight: 700;
}

.tux-abstract__structured {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.tux-abstract__section {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: 1rem;
  align-items: baseline;
}

@media (max-width: 47.99rem) {
  .tux-abstract__section {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
}

.tux-abstract__heading {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  color: var(--text-muted);
  margin: 0;
  line-height: 1.45;
}

.tux-abstract__body {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-primary);
  margin: 0;
}

.tux-abstract__prose p {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-primary);
  margin: 0 0 0.625rem 0;
}

.tux-abstract__prose strong {
  color: var(--brand-primary);
  font-weight: 700;
}

.tux-abstract__keywords {
  margin: 1rem 0 0 0;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--surface-border);
  font-size: 0.8125rem;
  color: var(--text-secondary);
  display: flex;
  gap: 0.625rem;
  flex-wrap: wrap;
}

.tux-abstract__keywords-label {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  font-size: 0.6875rem;
  color: var(--text-muted);
  align-self: center;
}

.tux-abstract__keywords-list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.5rem;
}

.tux-abstract__keyword {
  font-style: italic;
}
</style>
