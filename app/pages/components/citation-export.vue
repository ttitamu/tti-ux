<script setup lang="ts">
/**
 * /components/citation-export — Interactive workbench for TuxCitationExport.
 */
import tuxCitationExportSource from "~/components/TuxCitationExport.vue?raw";
import type { TuxCitationData } from "~/components/TuxCitationExport.vue";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxCitationExport · Components · TUX" });

const citationsDatabase: Record<string, TuxCitationData> = {
  journal: {
    authors: ["Hassan, M.", "Velazquez, L.", "Chen, R."],
    title: "Enduring infrastructure cues vs novelty effects: a 36-month follow-up on twelve rural intersection treatments.",
    venue: "Transportation Research Record",
    year: 2025,
    volume: 2671,
    issue: 4,
    pages: "118-134",
    doi: "10.1177/03611981251123456",
    publisher: "SAGE Publications",
  },
  conference: {
    authors: ["Guevara, A.", "Perez, K.", "Balke, K."],
    title: "Connected corridor telemetry and automated queue-warning optimization under high-speed rural conditions.",
    venue: "Transportation Research Board 105th Annual Meeting",
    year: 2026,
    pages: "1-16",
    doi: "10.1145/trb.2026.1042",
    publisher: "National Academies of Sciences, Engineering, and Medicine",
  },
  "technical-report": {
    authors: ["Texas A&M Transportation Institute", "FHWA Office of Safety"],
    title: "National Work Zone Data Initiative (WZDI) Technical Implementation & Architecture Specification.",
    venue: "Federal Highway Administration Technical Report Series",
    year: 2026,
    volume: "FHWA-HRT-26-004",
    doi: "10.21949/1528741",
    publisher: "U.S. Department of Transportation",
  },
};

const citationControls: TuxPropControl[] = [
  {
    prop: "label",
    label: "Trigger Button Label",
    type: "text",
    defaultValue: "Cite this paper",
    description: "Visible button label text for the citation dropdown trigger",
  },
  {
    prop: "variant",
    label: "Button Variant",
    type: "select",
    options: [
      { label: "Outline (Institutional Default)", value: "outline" },
      { label: "Solid (Brand Primary)", value: "solid" },
      { label: "Ghost (Minimal Utility)", value: "ghost" },
    ],
    defaultValue: "outline",
    description: "Visual styling variant of the dropdown button",
  },
  {
    prop: "sampleType",
    label: "Publication Schema",
    type: "select",
    options: [
      { label: "Peer-Reviewed Journal Article (TRR)", value: "journal" },
      { label: "Conference Proceedings Paper (TRB)", value: "conference" },
      { label: "Federal Technical Report (FHWA)", value: "technical-report" },
    ],
    defaultValue: "journal",
    description: "Sample citation metadata dataset passed to the export formatter",
  },
];

const citationPresets: TuxPlaygroundPreset[] = [
  {
    name: "journal-paper",
    label: "Journal Article (Outline)",
    description: "Standard peer-reviewed TRR journal article with full volume, issue, and DOI",
    icon: "lucide:book-open",
    values: {
      label: "Cite this paper",
      variant: "outline",
      sampleType: "journal",
    },
  },
  {
    name: "conference-proceeding",
    label: "TRB Proceedings (Solid)",
    description: "High-contrast primary button trigger for national conference papers and preprints",
    icon: "lucide:presentation",
    values: {
      label: "Cite presentation",
      variant: "solid",
      sampleType: "conference",
    },
  },
  {
    name: "technical-brief",
    label: "Technical Report (Ghost)",
    description: "Subtle ghost button for document sidebars, appendix pages, and sponsor data packages",
    icon: "lucide:file-text",
    values: {
      label: "Cite report",
      variant: "ghost",
      sampleType: "technical-report",
    },
  },
];

const codeTemplate = (values: Record<string, any>) => {
  const currentCitation = citationsDatabase[values.sampleType || "journal"] || citationsDatabase.journal!;
  const labelAttr = values.label ? `\n  label="${values.label}"` : "";
  const variantAttr = values.variant && values.variant !== "outline" ? `\n  variant="${values.variant}"` : "";

  return `<tux-citation-export
  :citation="{
    authors: ${JSON.stringify(currentCitation.authors)},
    title: ${JSON.stringify(currentCitation.title)},
    venue: ${JSON.stringify(currentCitation.venue)},
    year: ${currentCitation.year},
    doi: ${JSON.stringify(currentCitation.doi)}
  }"${labelAttr}${variantAttr}
/>`;
};
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · research & publishing" title="TuxCitationExport">
      Standardized academic citation export menu supporting APA, Chicago,
      MLA, IEEE, BibTeX, and RIS formats with 1-click clipboard copying.
      Pairs seamlessly with <code>TuxPaperMeta</code>, publication headers,
      or sticky action sidebars on research deliverables.
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-citation-export"
        component-name="TuxCitationExport"
        title="Citation Export Workbench"
        eyebrow="Interactive Academic Exporter"
        :controls="citationControls"
        :presets="citationPresets"
        :source="tuxCitationExportSource"
        :code-template="codeTemplate"
        preview-padding="p-6 sm:p-8"
      >
        <template #default="{ values }">
          <div class="w-full max-w-3xl space-y-4">
            <!-- Simulated Paper Header Card -->
            <div class="flex items-center justify-between flex-wrap gap-4 p-5 bg-surface-raised rounded-xl border border-surface-border shadow-xs">
              <div class="space-y-1 max-w-xl">
                <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-sunken border border-surface-border text-brand-primary font-bold">
                  {{ values.sampleType === 'journal' ? 'Peer-Reviewed Paper' : values.sampleType === 'conference' ? 'Conference Paper' : 'Technical Report' }}
                </span>
                <h3 class="text-base font-bold text-text-primary leading-snug">
                  {{ citationsDatabase[values.sampleType || 'journal']?.title }}
                </h3>
                <p class="text-xs text-text-secondary">
                  {{ citationsDatabase[values.sampleType || 'journal']?.authors.join(', ') }} ·
                  <span class="font-medium text-text-primary">{{ citationsDatabase[values.sampleType || 'journal']?.venue }}</span>
                  ({{ citationsDatabase[values.sampleType || 'journal']?.year }})
                </p>
                <p class="text-xs font-mono text-text-muted">
                  DOI: {{ citationsDatabase[values.sampleType || 'journal']?.doi }}
                </p>
              </div>

              <!-- Interactive Citation Trigger Component -->
              <div class="flex-shrink-0">
                <TuxCitationExport
                  :citation="citationsDatabase[values.sampleType || 'journal'] || citationsDatabase.journal!"
                  :label="values.label"
                  :variant="values.variant"
                />
              </div>
            </div>
          </div>
        </template>
      </TuxPlayground>
    </section>

    <!-- Supported Formats Matrix -->
    <section class="space-y-4">
      <p class="eyebrow">supported formats</p>
      <h2 class="heading--bold text-xl font-bold">Academic Formats &amp; Compatibility</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 bg-surface-raised rounded-lg border border-surface-border space-y-1.5">
          <span class="font-mono font-bold text-brand-primary block text-sm">APA (7th Edition)</span>
          <p class="text-xs text-text-secondary leading-relaxed">
            Standard author-date format required across social sciences, human factors, and transportation behavior studies.
          </p>
        </div>
        <div class="p-4 bg-surface-raised rounded-lg border border-surface-border space-y-1.5">
          <span class="font-mono font-bold text-brand-primary block text-sm">IEEE</span>
          <p class="text-xs text-text-secondary leading-relaxed">
            Bracketed numerical citation schema standard across ITS, connected vehicle engineering, and computational disciplines.
          </p>
        </div>
        <div class="p-4 bg-surface-raised rounded-lg border border-surface-border space-y-1.5">
          <span class="font-mono font-bold text-brand-primary block text-sm">BibTeX &amp; RIS</span>
          <p class="text-xs text-text-secondary leading-relaxed">
            Structured machine-readable formats for instant import into Overleaf, Zotero, Mendeley, and EndNote libraries.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
