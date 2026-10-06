<script setup lang="ts">
/**
 * /components/inline-citation — Interactive workbench for TuxInlineCitation.
 */
import tuxInlineCitationSource from "~/components/TuxInlineCitation.vue?raw";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxInlineCitation · Components · TUX" });

const inlineControls: TuxPropControl[] = [
  {
    prop: "n",
    label: "Citation Index (n)",
    type: "number",
    defaultValue: 1,
    description: "1-indexed reference number displayed in the superscript pill",
  },
  {
    prop: "title",
    label: "Source Title",
    type: "text",
    defaultValue: "CLS retrain methodology · v3.1",
    description: "Title of the cited source displayed in the popover header",
  },
  {
    prop: "href",
    label: "Source URL (href)",
    type: "text",
    defaultValue: "https://example.com/cls-retrain",
    description: "External target hyperlink for the citation source",
  },
  {
    prop: "excerpt",
    label: "Context Excerpt",
    type: "text",
    defaultValue: "The retrain pipeline runs nightly on the grants-2024-2026 corpus and emits both classifier checkpoints to the model registry.",
    description: "Quotational snippet or methodological context shown in the popover body",
  },
  {
    prop: "score",
    label: "Retrieval Score",
    type: "text",
    defaultValue: "0.91",
    description: "RAG similarity or confidence score badge",
  },
  {
    prop: "label",
    label: "Custom Pill Label",
    type: "text",
    defaultValue: "",
    description: "Custom label (e.g., roman numerals 'iv', letters 'b') overriding numerical n",
  },
];

const inlinePresets: TuxPlaygroundPreset[] = [
  {
    name: "rag-retrieval",
    label: "RAG Retrieval Citation with Score",
    description: "AI assistant and LLM RAG reference with retrieval confidence score and context excerpt",
    icon: "lucide:sparkles",
    values: {
      n: 1,
      title: "CLS retrain methodology · v3.1",
      href: "https://example.com/cls-retrain",
      excerpt: "The retrain pipeline runs nightly on the grants-2024-2026 corpus and emits both classifier checkpoints to the model registry.",
      score: "0.91",
      label: "",
    },
  },
  {
    name: "minimal-link",
    label: "Minimal Source Link",
    description: "Clean title-and-URL pill without excerpt or confidence score",
    icon: "lucide:link",
    values: {
      n: 2,
      title: "TxDOT Standard Specifications for Construction",
      href: "https://example.com/specs",
      excerpt: "",
      score: "",
      label: "",
    },
  },
  {
    name: "roman-statute",
    label: "Statutory Reference (Roman)",
    description: "Legal or legislative citation with roman numeral pill label",
    icon: "lucide:scale",
    values: {
      n: 3,
      title: "Texas Transportation Code §545.351",
      href: "https://statutes.capitol.texas.gov",
      excerpt: "Maximum speed requirement: An operator may not drive at a speed greater than is reasonable and prudent under the conditions.",
      score: "0.98",
      label: "iii",
    },
  },
];

const codeTemplate = (values: Record<string, any>) => {
  const nAttr = ` :n="${values.n || 1}"`;
  const titleAttr = values.title ? ` title="${values.title}"` : "";
  const hrefAttr = values.href ? ` href="${values.href}"` : "";
  const excerptAttr = values.excerpt ? `\n  excerpt="${values.excerpt}"` : "";
  const scoreAttr = values.score ? ` score="${values.score}"` : "";
  const labelAttr = values.label ? ` label="${values.label}"` : "";

  return `<p>
  CLS-211 outperforms CLS-204 on ITAR-tier documents<tux-inline-citation${nAttr}${titleAttr}${hrefAttr}${scoreAttr}${labelAttr}${excerptAttr}
  /> by ~5 percentage points across all 12 test sectors.
</p>`;
};
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · research & publishing" title="TuxInlineCitation">
      Academic-style inline reference pill. Renders as a superscripted
      <code>[N]</code> inside body text; hover or focus reveals a rich popover
      with source title, URL, contextual excerpt, and retrieval similarity score.
      Distinct from <code>TuxCitations</code> (the footer list); the two compose
      together — inline pills index directly into the source list.
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-inline-citation"
        component-name="TuxInlineCitation"
        title="Inline Citation Workbench"
        eyebrow="Academic Superscript Pill"
        :controls="inlineControls"
        :presets="inlinePresets"
        :source="tuxInlineCitationSource"
        :code-template="codeTemplate"
        preview-padding="p-6 sm:p-8"
      >
        <template #default="{ values }">
          <div class="w-full max-w-2xl bg-surface-raised p-6 rounded-xl border border-surface-border shadow-xs">
            <p class="text-xs font-mono uppercase tracking-wider text-text-muted mb-2">
              Body Prose Reading Simulation (Hover or focus pill to inspect popover)
            </p>
            <p class="text-base text-text-primary leading-relaxed">
              Recent comparative evaluations demonstrate that the upgraded pipeline
              achieves a 14.8% reduction in false-positive incident detection alarms<TuxInlineCitation
                :n="values.n || 1"
                :title="values.title"
                :href="values.href || undefined"
                :excerpt="values.excerpt || undefined"
                :score="values.score || undefined"
                :label="values.label || undefined"
              /> across rural freeway corridors, while preserving baseline latency.
            </p>
          </div>
        </template>
      </TuxPlayground>
    </section>

    <!-- Composition & Design Guidelines -->
    <section class="space-y-4">
      <p class="eyebrow">composition patterns</p>
      <h2 class="heading--bold text-xl font-bold">Composing with TuxCitations</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-5 bg-surface-raised border border-surface-border rounded-lg space-y-2">
          <div class="flex items-center gap-2 text-text-primary font-bold">
            <UIcon name="lucide:arrow-right-left" class="w-5 h-5 text-brand-primary" />
            <span>One Source Per Pill</span>
          </div>
          <p class="text-sm text-text-secondary leading-relaxed">
            Unlike commercial AI aggregations (e.g. "+5 sources"), TTI academic convention
            uses one discrete pill per reference citation. Readers know exactly which
            finding maps to which institutional dataset.
          </p>
        </div>

        <div class="p-5 bg-surface-raised border border-surface-border rounded-lg space-y-2">
          <div class="flex items-center gap-2 text-text-primary font-bold">
            <UIcon name="lucide:corner-down-right" class="w-5 h-5 text-brand-primary" />
            <span>Zero-Gap Placement</span>
          </div>
          <p class="text-sm text-text-secondary leading-relaxed">
            Always place the <code>&lt;TuxInlineCitation&gt;</code> tag immediately adjacent
            to the preceding word with no whitespace. Superscripts are styled to snuggle up
            to the word being referenced.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
