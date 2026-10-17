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
  /**
   * Plain-Language / Legislative Brief summary (USWDS 3.0 / GOV.UK civic trust pattern).
   * When provided, enables an interactive toggle between the technical IMRaD abstract
   * and an accessible executive briefing for lawmakers and the public.
   */
  plainSummary?: string;
  /** Optional bulleted legislative or operational takeaways shown in Plain-Language mode. */
  policyTakeaways?: string[];
  /** Optional Digital Object Identifier (e.g. "10.1177/036119812604921"). */
  doi?: string;
  /** Optional TxDOT / TTI sponsored project or grant ID (e.g. "TxDOT Project 0-7142"). */
  projectNumber?: string;
  /** Optional formatted citation string for 1-click clipboard copy. */
  citation?: string;
  /** Optional TTI 5-band research division accent ("maroon" | "blue" | "teal" | "green" | "gold"). */
  division?: "maroon" | "blue" | "teal" | "green" | "gold";
}

const props = withDefaults(defineProps<Props>(), {
  background: undefined,
  methods: undefined,
  results: undefined,
  conclusion: undefined,
  keywords: undefined,
  variant: "structured",
  level: 4,
  plainSummary: undefined,
  policyTakeaways: undefined,
  doi: undefined,
  projectNumber: undefined,
  citation: undefined,
  division: undefined,
});

const headingTag = computed(() => `h${props.level}`);
const activeMode = ref<"technical" | "plain">("technical");
const hasPlainMode = computed(
  () => Boolean(props.plainSummary) || Boolean(props.policyTakeaways?.length),
);
const hasProvenance = computed(
  () => Boolean(props.doi) || Boolean(props.projectNumber) || Boolean(props.citation),
);

const citationCopied = ref(false);
async function copyCitation() {
  const textToCopy =
    props.citation ||
    [props.projectNumber, props.doi ? `DOI: ${props.doi}` : ""].filter(Boolean).join(" · ");
  if (!textToCopy) return;
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(textToCopy);
    }
    citationCopied.value = true;
    setTimeout(() => {
      citationCopied.value = false;
    }, 2000);
  } catch {
    citationCopied.value = true;
  }
}
</script>

<template>
  <section
    class="tux-abstract"
    :class="division ? `tux-abstract--division tux-abstract--division-${division}` : ''"
    aria-labelledby="abstract-title"
  >
    <div class="tux-abstract__header">
      <p id="abstract-title" class="eyebrow tux-abstract__eyebrow">
        {{ activeMode === "plain" ? "Plain-Language Legislative Brief" : "Abstract" }}
      </p>

      <div
        v-if="hasPlainMode"
        class="tux-abstract__mode-switch"
        role="group"
        aria-label="Abstract reading mode"
      >
        <button
          type="button"
          class="tux-abstract__mode-btn"
          :class="{ 'tux-abstract__mode-btn--active': activeMode === 'technical' }"
          :aria-pressed="activeMode === 'technical'"
          @click="activeMode = 'technical'"
        >
          Technical Abstract
        </button>
        <button
          type="button"
          class="tux-abstract__mode-btn"
          :class="{ 'tux-abstract__mode-btn--active': activeMode === 'plain' }"
          :aria-pressed="activeMode === 'plain'"
          @click="activeMode = 'plain'"
        >
          Plain-Language Brief
        </button>
      </div>
    </div>

    <div v-if="activeMode === 'plain' && hasPlainMode" class="tux-abstract__plain">
      <p v-if="plainSummary" class="tux-abstract__plain-summary">
        {{ plainSummary }}
      </p>
      <div v-if="policyTakeaways && policyTakeaways.length" class="tux-abstract__takeaways">
        <component :is="headingTag" class="tux-abstract__heading">
          Key Policy &amp; Operational Takeaways
        </component>
        <ul class="tux-abstract__takeaway-list">
          <li v-for="item in policyTakeaways" :key="item" class="tux-abstract__takeaway-item">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <div v-else-if="variant === 'structured'" class="tux-abstract__structured">
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

    <div v-if="hasProvenance" class="tux-abstract__provenance">
      <div class="tux-abstract__provenance-meta">
        <span v-if="projectNumber" class="tux-abstract__provenance-pill">
          Project: {{ projectNumber }}
        </span>
        <span v-if="doi" class="tux-abstract__provenance-pill">
          DOI: {{ doi }}
        </span>
      </div>
      <button
        v-if="citation || doi || projectNumber"
        type="button"
        class="tux-abstract__cite-btn"
        @click="copyCitation"
      >
        {{ citationCopied ? "Copied Citation" : "Copy Citation" }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.tux-abstract {
  --abstract-accent: var(--brand-primary);
  border-top: 2px solid var(--abstract-accent);
  border-bottom: 1px solid var(--surface-border);
  padding: 1.25rem 0 1.5rem 0;
  margin: 1.5rem 0;
  font-family: var(--font-body);
}

.tux-abstract--division-maroon {
  --abstract-accent: var(--spectrum-maroon, var(--brand-primary));
}
.tux-abstract--division-blue {
  --abstract-accent: var(--spectrum-blue, var(--brand-secondary));
}
.tux-abstract--division-teal {
  --abstract-accent: var(--spectrum-teal, var(--brand-primary));
}
.tux-abstract--division-green {
  --abstract-accent: var(--spectrum-green, var(--color-success));
}
.tux-abstract--division-gold {
  --abstract-accent: var(--spectrum-gold, var(--brand-accent));
}

.tux-abstract__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.tux-abstract__eyebrow {
  margin: 0;
  color: var(--abstract-accent);
  font-weight: 700;
}

.tux-abstract__mode-switch {
  display: inline-flex;
  border: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  padding: 0.125rem;
  border-radius: var(--radius-sm);
  gap: 0.125rem;
}

.tux-abstract__mode-btn {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;
}

.tux-abstract__mode-btn--active {
  background: var(--surface-raised);
  color: var(--abstract-accent);
  font-weight: 700;
  box-shadow: var(--shadow-sm);
}

.tux-abstract__plain {
  background: color-mix(in srgb, var(--abstract-accent) 4%, transparent);
  border-left: 3px solid var(--abstract-accent);
  padding: 0.875rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tux-abstract__plain-summary {
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--text-primary);
  margin: 0;
}

.tux-abstract__takeaways {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.tux-abstract__takeaway-list {
  margin: 0;
  padding-left: 1.25rem;
  color: var(--text-primary);
  font-size: 0.875rem;
  line-height: 1.55;
}

.tux-abstract__takeaway-item + .tux-abstract__takeaway-item {
  margin-top: 0.25rem;
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
  font-family: var(--font-body);
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
  color: var(--abstract-accent);
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

.tux-abstract__provenance {
  margin-top: 0.75rem;
  padding-top: 0.625rem;
  border-top: 1px solid var(--surface-border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.tux-abstract__provenance-meta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tux-abstract__provenance-pill {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-secondary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-sm);
}

.tux-abstract__cite-btn {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--abstract-accent);
  background: color-mix(in srgb, var(--abstract-accent) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--abstract-accent) 22%, transparent);
  padding: 0.1875rem 0.625rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
}
</style>
