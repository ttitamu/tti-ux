<script setup lang="ts">
/**
 * /components/citations — Interactive workbench for TuxCitations.
 */
import tuxCitationsSource from "~/components/TuxCitations.vue?raw";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxCitations · Components · TUX" });

const datasets = {
  corridor: [
    { title: "TX-6-Q1-2026-summary.pdf", path: "tti-corridors/2026-Q1.pdf", score: "0.94", href: "#" },
    { title: "work-zone-protocol.md", path: "tti-research/protocol/work-zone.md", score: "0.81", href: "#" },
    { title: "TxDOT rule 43 §31.12", path: "txdot-rules/43-31-12.pdf", score: "0.74", href: "#" },
  ],
  statutes: [
    { title: "Texas Transportation Code §545.351", path: "statutes/title-7/ch-545/subch-h.html", score: "0.99", href: "#" },
    { title: "43 TAC §25.1 — Uniform Traffic Control", path: "admin-code/title-43/pt-1/ch-25.pdf", score: "0.91", href: "#" },
    { title: "MUTCD Section 6C.01 — Work Zone Principles", path: "standards/mutcd-11th-ed/part-6.pdf", score: "0.86", href: "#" },
  ],
  "ai-reranker": [
    { title: "Corridor Sensor Telemetry Checkpoint (v4.2)", path: "models/wz-classifier/weights-v4.2.onnx", score: "0.97", href: "#" },
    { title: "Inductive Loop Micro-Calibration Logs", path: "telemetry/austin-ih35/sector-4-loops.parquet", score: "0.89", href: "#" },
    { title: "CRIS Incident Database Cross-Reference", path: "databases/cris-2/export-20260401.arrow", score: "0.82", href: "#" },
  ],
};

const citationsControls: TuxPropControl[] = [
  {
    prop: "label",
    label: "Eyebrow Section Label",
    type: "text",
    defaultValue: "sources",
    description: "Header label preceding the item count in the citations eyebrow",
  },
  {
    prop: "dataset",
    label: "Sample Source Dataset",
    type: "select",
    options: [
      { label: "Corridor Research Papers (3 sources)", value: "corridor" },
      { label: "TxDOT Rules & Administrative Code (3 sources)", value: "statutes" },
      { label: "Semantic Reranker Weights & Telemetry (3 sources)", value: "ai-reranker" },
    ],
    defaultValue: "corridor",
    description: "Knowledge-grounded reference source collection",
  },
];

const citationsPresets: TuxPlaygroundPreset[] = [
  {
    name: "corridor-sources",
    label: "Research Publications (Corridor)",
    description: "Multi-document PDF report grounding for AI assistant research answers",
    icon: "lucide:file-text",
    values: {
      label: "sources",
      dataset: "corridor",
    },
  },
  {
    name: "statutes-sources",
    label: "Statutory & Legislative Authorities",
    description: "Texas Transportation Code and Administrative Code citation citations",
    icon: "lucide:scale",
    values: {
      label: "legal authorities",
      dataset: "statutes",
    },
  },
  {
    name: "ai-reranker-sources",
    label: "Reranker Context & Telemetry",
    description: "Model checkpoints and Parquet sensor tables with high similarity scores",
    icon: "lucide:sparkles",
    values: {
      label: "retrieved context",
      dataset: "ai-reranker",
    },
  },
];

const codeTemplate = (values: Record<string, any>) => {
  const currentItems = datasets[values.dataset as keyof typeof datasets] || datasets.corridor;
  const labelAttr = values.label && values.label !== "sources" ? ` label="${values.label}"` : "";

  return `<tux-citations
  :items="${JSON.stringify(currentItems, null, 2)}"${labelAttr}
/>`;
};
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · chat & publishing" title="TuxCitations">
      Numbered source list under an assistant message or report appendix. Renders
      title (editorial) · path (monospace) · score (monospace) in a 3-column grid
      so long file paths can ellipsize without pushing the retrieval score off-screen.
      Designed to slot into <code>TuxChatMessage</code>'s <code>#citations</code> slot
      or anchor long-form report reference appendices.
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-citations"
        component-name="TuxCitations"
        title="Citations List Workbench"
        eyebrow="Knowledge-Grounded Source List"
        :controls="citationsControls"
        :presets="citationsPresets"
        :source="tuxCitationsSource"
        :code-template="codeTemplate"
        preview-padding="p-6 sm:p-8"
      >
        <template #default="{ values }">
          <div class="w-full max-w-2xl bg-surface-raised p-6 rounded-xl border border-surface-border shadow-xs">
            <TuxCitations
              :items="datasets[values.dataset as keyof typeof datasets] || datasets.corridor"
              :label="values.label"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <!-- Layout & Architecture -->
    <section class="space-y-4">
      <p class="eyebrow">layout ergonomics</p>
      <h2 class="heading--bold text-xl font-bold">3-Column Grid Architecture</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-5 bg-surface-raised border border-surface-border rounded-lg space-y-2">
          <div class="flex items-center gap-2 text-text-primary font-bold">
            <UIcon name="lucide:layout-grid" class="w-5 h-5 text-brand-primary" />
            <span>Ellipsis Protection</span>
          </div>
          <p class="text-sm text-text-secondary leading-relaxed">
            Long file paths (e.g. <code>telemetry/austin-ih35/sector-4-loops.parquet</code>)
            can wrap or ellipsize safely without displacing the retrieval confidence score
            from the right gutter.
          </p>
        </div>

        <div class="p-5 bg-surface-raised border border-surface-border rounded-lg space-y-2">
          <div class="flex items-center gap-2 text-text-primary font-bold">
            <UIcon name="lucide:message-square" class="w-5 h-5 text-brand-primary" />
            <span>Chat &amp; Report Pairing</span>
          </div>
          <p class="text-sm text-text-secondary leading-relaxed">
            Integrates natively into <code>&lt;TuxChatMessage&gt;</code> under assistant responses,
            or stands alone at the bottom of long-form reports as a structured bibliography.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
