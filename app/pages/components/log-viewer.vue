<script setup lang="ts">
import tuxLogViewerSource from "~/components/TuxLogViewer.vue?raw";
import type { LogLineEntry } from "~/components/TuxLogViewer.vue";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxLogViewer · TUX" });

const sampleLogLines: LogLineEntry[] = [
  {
    id: 101,
    timestamp: "2026-11-04 14:02:11.042",
    level: "info",
    source: "corridor-ingest-broker",
    message: "Initialized partition consumer group for Study 02-411085 (12 active roadside cabinets).",
  },
  {
    id: 102,
    timestamp: "2026-11-04 14:02:11.318",
    level: "debug",
    source: "table-catalog-service",
    message: "Loaded snapshot manifest rev=4819 with 64 columnar data files (total 18.4 GiB).",
  },
  {
    id: 103,
    timestamp: "2026-11-04 14:02:14.890",
    level: "info",
    source: "distributed-query-pool",
    message: "Allocated 16 worker slots on On-Prem GPU Cluster for axle-classification batch window.",
  },
  {
    id: 104,
    timestamp: "2026-11-04 14:02:19.504",
    level: "warn",
    source: "corridor-ingest-broker",
    message: "Cabinet MP-214 backhaul jitter exceeded 250ms threshold (observed 412ms); switching to buffered replay.",
  },
  {
    id: 105,
    timestamp: "2026-11-04 14:02:23.115",
    level: "error",
    source: "table-catalog-service",
    message: "Optimistic commit conflict on partition date=2026-11-04: concurrent compaction lock held by worker-07.",
  },
  {
    id: 106,
    timestamp: "2026-11-04 14:02:24.002",
    level: "warn",
    source: "table-catalog-service",
    message: "Retrying metadata commit (attempt 2 of 3) with exponential backoff 800ms.",
  },
  {
    id: 107,
    timestamp: "2026-11-04 14:02:24.845",
    level: "info",
    source: "table-catalog-service",
    message: "Snapshot rev=4820 committed cleanly; published 48,920 validated loop-detector records.",
  },
  {
    id: 108,
    timestamp: "2026-11-04 14:02:29.610",
    level: "error",
    source: "on-prem-gpu-cluster",
    message: "Node gpu-worker-03 reported ECC memory page retirement warning; draining node for post-job diagnostics.",
  },
];

const eventStatus = ref<string>("");

function onCopy(text: string) {
  const count = text ? text.split("\n").length : 0;
  eventStatus.value = `Copied ${count} visible log line(s) to clipboard`;
}

function onDownload(text: string) {
  eventStatus.value = `Prepared plain-text log export (${text.length} bytes)`;
}

function onSelectLine(line: LogLineEntry) {
  eventStatus.value = `Selected line #${line.id} [${line.level.toUpperCase()}] from ${line.source ?? "system"}`;
}

const logControls: TuxPropControl[] = [
  {
    prop: "title",
    label: "Viewport Title",
    type: "text",
    defaultValue: "Operational Job & Telemetry Logs",
  },
  {
    prop: "initialLevel",
    label: "Initial Severity Filter",
    type: "select",
    options: ["all", "debug", "info", "warn", "error"],
    defaultValue: "all",
  },
  {
    prop: "wrapLines",
    label: "Wrap Long Lines",
    type: "boolean",
    defaultValue: true,
  },
  {
    prop: "showLineNumbers",
    label: "Show Line Numbers",
    type: "boolean",
    defaultValue: true,
  },
  {
    prop: "maxHeight",
    label: "Viewport Max Height",
    type: "select",
    options: ["16rem", "24rem", "32rem"],
    defaultValue: "24rem",
  },
];

const logPresets: TuxPlaygroundPreset[] = [
  {
    name: "full-stream",
    label: "Full Telemetry Stream",
    description: "All log severities with wrapped lines and tabular line numbers",
    icon: "lucide:terminal",
    values: {
      title: "Operational Job & Telemetry Logs",
      initialLevel: "all",
      wrapLines: true,
      showLineNumbers: true,
      maxHeight: "24rem",
    },
  },
  {
    name: "errors-triage",
    label: "Errors Only Triage",
    description: "Pre-filtered to ERROR severity for rapid failure root-cause analysis",
    icon: "lucide:alert-octagon",
    values: {
      title: "Corridor Pipeline Fault Log",
      initialLevel: "error",
      wrapLines: true,
      showLineNumbers: true,
      maxHeight: "16rem",
    },
  },
  {
    name: "compact-nowrap",
    label: "Horizontal Scroll (No Wrap)",
    description: "Single-line monospace rows without line numbers for wide stack traces",
    icon: "lucide:align-justify",
    values: {
      title: "Distributed Query Pool Worker Output",
      initialLevel: "all",
      wrapLines: false,
      showLineNumbers: false,
      maxHeight: "16rem",
    },
  },
];

const flagshipVue = `<tux-log-viewer
  title="Study 02-411085 · Batch & Telemetry Stream"
  :lines="lines"
  initial-level="all"
  :wrap-lines="true"
  :show-line-numbers="true"
  @copy="onCopy"
  @download="onDownload"
  @select-line="onSelectLine"
/>`;

const errorOnlyVue = `<tux-log-viewer
  title="Critical Fault Excerpts"
  :lines="lines"
  initial-level="error"
  max-height="14rem"
/>`;

const typesTs = `export type LogSeverity = "debug" | "info" | "warn" | "error";

export interface LogLineEntry {
  id: string | number;
  timestamp: string;
  level: LogSeverity;
  source?: string;
  message: string;
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · operations & telemetry" title="TuxLogViewer">
      Accessible operational job and telemetry log viewer. Pairs 44px search,
      severity count filters, wrap toggle, and copy/download actions with a
      keyboard-focusable monospace scroll region that preserves WCAG 2.2 AAA
      contrast across all four TUX themes instead of hardcoding dark-only ANSI
      colors.
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-log-viewer"
        component-name="TuxLogViewer"
        title="TuxLogViewer Workbench"
        eyebrow="Interactive Component Playground"
        :controls="logControls"
        :presets="logPresets"
        :source="tuxLogViewerSource"
      >
        <template #default="{ values }">
          <div class="max-w-4xl w-full">
            <TuxLogViewer
              :title="values.title"
              :lines="sampleLogLines"
              :initial-level="values.initialLevel"
              :wrap-lines="values.wrapLines"
              :show-line-numbers="values.showLineNumbers"
              :max-height="values.maxHeight"
              @copy="onCopy"
              @download="onDownload"
              @select-line="onSelectLine"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <!-- Flagship Stream -->
    <section>
      <p class="eyebrow">flagship · searchable multi-service log stream</p>
      <h2 class="heading--bold text-xl font-bold">Pipeline &amp; cluster execution log</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Filter by substring or source tag, toggle severity pills with live line
        counts, switch line wrapping, or copy/export the currently filtered slice.
      </p>
      <TuxExample class="mt-4" :vue="flagshipVue" :source="tuxLogViewerSource">
        <div class="max-w-4xl space-y-3">
          <TuxLogViewer
            title="Study 02-411085 · Batch & Telemetry Stream"
            :lines="sampleLogLines"
            @copy="onCopy"
            @download="onDownload"
            @select-line="onSelectLine"
          />
          <p class="text-xs font-mono text-text-muted">
            {{ eventStatus || "Click any log line, filter pill, Copy, or Download to inspect emitted events." }}
          </p>
        </div>
      </TuxExample>
    </section>

    <!-- Pre-filtered Error Stream -->
    <section>
      <p class="eyebrow">focused triage · initialLevel="error"</p>
      <h2 class="heading--bold text-xl font-bold">Pre-filtered error excerpts</h2>
      <TuxExample class="mt-4" :vue="errorOnlyVue" :source="tuxLogViewerSource">
        <div class="max-w-4xl">
          <TuxLogViewer
            title="Critical Fault Excerpts"
            :lines="sampleLogLines"
            initial-level="error"
            max-height="14rem"
          />
        </div>
      </TuxExample>
    </section>

    <!-- Data Shape -->
    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Log line entry interface</h2>
      <TuxCodeBlock class="mt-4" :code="typesTs" lang="ts" filename="TuxLogViewer.ts" />
    </section>
  </div>
</template>
