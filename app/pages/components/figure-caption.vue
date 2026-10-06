<script setup lang="ts">
/**
 * /components/figure-caption — Interactive workbench for TuxFigureCaption.
 */
import tuxFigureCaptionSource from "~/components/TuxFigureCaption.vue?raw";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxFigureCaption · Components · TUX" });

const figureControls: TuxPropControl[] = [
  {
    prop: "label",
    label: "Kind Prefix",
    type: "select",
    options: [
      { label: "Figure (Graphics & Charts standard)", value: "Figure" },
      { label: "Exhibit (Legal & Policy exhibits)", value: "Exhibit" },
      { label: "Table (Tabular datasets standard)", value: "Table" },
      { label: "Plate (High-resolution imagery)", value: "Plate" },
    ],
    defaultValue: "Figure",
    description: "Kind label prefix preceding the number identifier",
  },
  {
    prop: "number",
    label: "Figure Number",
    type: "text",
    defaultValue: "4",
    description: "Identification number (e.g. 1, 4, 3.2, or A-1)",
  },
  {
    prop: "placement",
    label: "Caption Placement",
    type: "select",
    options: [
      { label: "Below (Standard for figures and charts)", value: "below" },
      { label: "Above (Standard for tables and data matrices)", value: "above" },
    ],
    defaultValue: "below",
    description: "Vertical position of caption relative to the graphic content",
  },
  {
    prop: "caption",
    label: "Caption Text",
    type: "text",
    defaultValue: "Mean speed recovery trajectories following dynamic variable speed limit (VSL) alerts across 12 treated test sectors.",
    description: "Descriptive narrative explaining the exhibit",
  },
  {
    prop: "source",
    label: "Attribution / Source Note",
    type: "text",
    defaultValue: "Source: TTI Connected Work Zone Pilot Dataset (2025–2026), Federal Highway Administration.",
    description: "Source attribution rendered in muted typography",
  },
];

const figurePresets: TuxPlaygroundPreset[] = [
  {
    name: "standard-figure",
    label: "Standard Technical Figure (Below)",
    description: "Standard academic figure with caption and source credit placed beneath the visualization",
    icon: "lucide:image",
    values: {
      label: "Figure",
      number: "4",
      placement: "below",
      caption: "Mean speed recovery trajectories following dynamic variable speed limit (VSL) alerts across 12 treated test sectors.",
      source: "Source: TTI Connected Work Zone Pilot Dataset (2025–2026), Federal Highway Administration.",
    },
  },
  {
    name: "policy-exhibit",
    label: "Numbered Exhibit (Above)",
    description: "Formal numbered policy exhibit with top-anchored caption and institutional credit",
    icon: "lucide:file-text",
    values: {
      label: "Exhibit",
      number: "3.2",
      placement: "above",
      caption: "Corridor travel time buffer indices before and after ITS infrastructure deployment across IH-35.",
      source: "Source: TxDOT Project 0-6999 Final Report, Table 4.1.",
    },
  },
  {
    name: "data-table",
    label: "Formal Data Table (Above)",
    description: "Standard academic table header placement with source credit for statistical summaries",
    icon: "lucide:table",
    values: {
      label: "Table",
      number: "2",
      placement: "above",
      caption: "Estimated crash modification factors (CMF) for rural expressway access management treatments.",
      source: "Source: NCHRP Report 880 Synthesis.",
    },
  },
];

const codeTemplate = (values: Record<string, any>) => {
  const labelAttr = values.label && values.label !== "Figure" ? ` label="${values.label}"` : "";
  const numAttr = ` :number="${isNaN(Number(values.number)) ? `'${values.number}'` : values.number}"`;
  const placeAttr = values.placement && values.placement !== "below" ? ` placement="${values.placement}"` : "";
  const capAttr = values.caption ? `\n  caption="${values.caption}"` : "";
  const srcAttr = values.source ? `\n  source="${values.source}"` : "";

  return `<tux-figure-caption${labelAttr}${numAttr}${placeAttr}${capAttr}${srcAttr}
>
  <!-- Chart, image, diagram, or data table slot -->
  <div class="h-48 bg-surface-sunken rounded-lg flex items-center justify-center">
    ...visual element...
  </div>
</tux-figure-caption>`;
};
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · research & publishing" title="TuxFigureCaption">
      Accessible academic figure and diagram caption container providing semantic
      <code>&lt;figure&gt;</code> and <code>&lt;figcaption&gt;</code> wrapping,
      custom numbering, source credits, and flexible placement. Ensures screen
      readers announce the graphic and its editorial caption as a unified semantic block.
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-figure-caption"
        component-name="TuxFigureCaption"
        title="Figure Caption Workbench"
        eyebrow="Accessible Exhibit Container"
        :controls="figureControls"
        :presets="figurePresets"
        :source="tuxFigureCaptionSource"
        :code-template="codeTemplate"
        preview-padding="p-6 sm:p-8"
      >
        <template #default="{ values }">
          <div class="w-full max-w-2xl bg-surface-raised p-6 rounded-xl border border-surface-border shadow-xs">
            <TuxFigureCaption
              :label="values.label"
              :number="values.number"
              :caption="values.caption"
              :source="values.source"
              :placement="values.placement"
            >
              <div class="h-48 bg-surface-sunken rounded-lg border border-surface-border flex flex-col items-center justify-center gap-2 p-4 text-center">
                <UIcon name="lucide:line-chart" class="w-8 h-8 text-brand-primary/70" />
                <span class="text-xs font-mono text-text-muted">Simulated Visual Graphic / Chart Surface</span>
                <span class="text-[11px] text-text-secondary">Responsive container slotted into &lt;TuxFigureCaption&gt;</span>
              </div>
            </TuxFigureCaption>
          </div>
        </template>
      </TuxPlayground>
    </section>

    <!-- Placement Best Practices -->
    <section class="space-y-4">
      <p class="eyebrow">editorial standards</p>
      <h2 class="heading--bold text-xl font-bold">Placement Standards: Above vs. Below</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-5 bg-surface-raised border border-surface-border rounded-lg space-y-2">
          <div class="flex items-center gap-2 text-text-primary font-bold">
            <UIcon name="lucide:arrow-down" class="w-5 h-5 text-brand-primary" />
            <span>Figures &amp; Graphics (placement="below")</span>
          </div>
          <p class="text-sm text-text-secondary leading-relaxed">
            Standard academic practice (APA, Chicago, IEEE) dictates placing figure captions <em>beneath</em>
            the graphic. Readers first perceive the visual trajectory before reading the clarifying caption.
          </p>
        </div>

        <div class="p-5 bg-surface-raised border border-surface-border rounded-lg space-y-2">
          <div class="flex items-center gap-2 text-text-primary font-bold">
            <UIcon name="lucide:arrow-up" class="w-5 h-5 text-brand-primary" />
            <span>Tables &amp; Matrices (placement="above")</span>
          </div>
          <p class="text-sm text-text-secondary leading-relaxed">
            Standard practice places table captions <em>above</em> the table headers. This gives readers
            the framing context, sample sizes, and unit definitions before reading dense rows and columns.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
