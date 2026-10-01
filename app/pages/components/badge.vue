<script setup lang="ts">
useHead({ title: "TuxBadge · TUX" });

const tiers = ["public", "internal", "sensitive", "restricted"] as const;
const statuses = [
  "queued",
  "running",
  "completed",
  "failed",
  "published",
  "draft",
  "expired",
  "verified",
] as const;
const tags = ["topic:safety", "topic:mobility", "topic:bridges", "license:cc-by", "format:pdf"];

const tiersVue = `<TuxBadge tier="public" />
<TuxBadge tier="internal" />
<TuxBadge tier="sensitive" />
<TuxBadge tier="restricted" />`;

const statusVue = `<TuxBadge status="queued" />
<TuxBadge status="running" />   <!-- spinner renders automatically -->
<TuxBadge status="completed" />
<TuxBadge status="failed" />
<TuxBadge status="published" />
<TuxBadge status="draft" />
<TuxBadge status="expired" />
<TuxBadge status="verified" />`;

const boldVue = `<TuxBadge tone="brand" bold>BRAND SOLID</TuxBadge>
<TuxBadge tone="success" bold>LIVE STREAM</TuxBadge>
<TuxBadge tone="warning" bold>ACTION REQUIRED</TuxBadge>
<TuxBadge tone="danger" bold>OUTAGE</TuxBadge>
<TuxBadge tone="info" bold>SCHEDULED</TuxBadge>`;

const iconDotVue = `<TuxBadge tone="success" dot>Active Sensor</TuxBadge>
<TuxBadge tone="danger" dot>Alert Triggered</TuxBadge>
<TuxBadge tone="brand" icon="lucide:shield-check">Secured</TuxBadge>
<TuxBadge tone="info" icon="lucide:database">PostgreSQL</TuxBadge>
<TuxBadge tone="neutral" icon="lucide:file-text">Draft Spec</TuxBadge>`;

const tagsVue = `<TuxBadge kind="tag">topic:safety</TuxBadge>
<TuxBadge kind="tag">topic:mobility</TuxBadge>
<TuxBadge kind="tag">license:cc-by</TuxBadge>`;

const countVue = `<TuxBadge kind="count" :count="42">pdf</TuxBadge>
<TuxBadge kind="count" :count="11">md</TuxBadge>
<TuxBadge kind="count" :count="3">xlsx</TuxBadge>
<TuxBadge kind="count" :count="1204">csv</TuxBadge>`;

import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

const badgeControls: TuxPropControl[] = [
  {
    prop: "label",
    label: "Badge Label",
    type: "text",
    defaultValue: "Active Sensor Node",
  },
  {
    prop: "tone",
    label: "Tone",
    type: "select",
    options: ["brand", "neutral", "success", "warning", "danger", "info"],
    defaultValue: "brand",
  },
  {
    prop: "size",
    label: "Size",
    type: "select",
    options: ["xs", "sm", "md"],
    defaultValue: "sm",
  },
  {
    prop: "bold",
    label: "Bold Solid Mode",
    type: "boolean",
    defaultValue: false,
  },
  {
    prop: "dot",
    label: "Status Dot",
    type: "boolean",
    defaultValue: true,
  },
  {
    prop: "icon",
    label: "Leading Icon",
    type: "select",
    options: ["", "lucide:sparkles", "lucide:shield-check", "lucide:clock", "lucide:database", "lucide:activity"],
    defaultValue: "",
  },
];

const badgePresets: TuxPlaygroundPreset[] = [
  {
    name: "institutional-live",
    label: "Institutional Live Dot",
    description: "Subtle maroon pill badge with pulsing active sensor status dot",
    icon: "lucide:circle-dot",
    values: {
      tone: "brand",
      label: "Active Sensor Node",
      size: "sm",
      bold: false,
      dot: true,
      icon: "",
    },
  },
  {
    name: "security-gate",
    label: "Security Classification",
    description: "Solid high-contrast badge indicating restricted access",
    icon: "lucide:shield-check",
    values: {
      tone: "brand",
      label: "Confidential Tier 2",
      size: "sm",
      bold: true,
      dot: false,
      icon: "lucide:shield-check",
    },
  },
  {
    name: "operational-healthy",
    label: "Ingest Healthy",
    description: "Green success pill for validated data streams",
    icon: "lucide:activity",
    values: {
      tone: "success",
      label: "99.98% Ingest Rate",
      size: "sm",
      bold: false,
      dot: true,
      icon: "lucide:activity",
    },
  },
  {
    name: "database-record",
    label: "Storage Partition",
    description: "Neutral technical tag for dataset formats and shards",
    icon: "lucide:database",
    values: {
      tone: "neutral",
      label: "Parquet Shard 04",
      size: "xs",
      bold: false,
      dot: false,
      icon: "lucide:database",
    },
  },
];
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxBadge">
      Unified badge, tag, count, and operational lifecycle status component.
      Supports security classification tiers, background/job lifecycle states (with automatic spinner on <code>running</code>),
      bold solid modes, leading icons &amp; status dots, and facet counts.
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-badge"
        title="TuxBadge Workbench"
        eyebrow="Interactive Component Playground"
        :controls="badgeControls"
        :presets="badgePresets"
        slot-prop="label"
        default-slot-text="Active Sensor Node"
      >
        <template #default="{ values }">
          <TuxBadge
            :tone="values.tone"
            :size="values.size"
            :bold="values.bold"
            :dot="values.dot"
            :icon="values.icon || undefined"
          >
            {{ values.label }}
          </TuxBadge>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">tiers</p>
      <h2 class="heading--bold text-xl font-bold">Classification Tier</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pre-configured security classification badges according to institutional data policies.
      </p>
      <TuxExample class="mt-4" :vue="tiersVue">
        <div class="flex flex-wrap gap-2">
          <TuxBadge v-for="t in tiers" :key="t" :tier="t" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">state</p>
      <h2 class="heading--bold text-xl font-bold">Lifecycle &amp; Editorial Status</h2>
      <p class="text-sm text-text-secondary mb-3">
        Lifecycle states with integrated status-dot indicator and animated spinner for in-flight tasks.
      </p>
      <TuxExample class="mt-4" :vue="statusVue">
        <div class="flex flex-wrap gap-2">
          <TuxBadge v-for="s in statuses" :key="s" :status="s" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">emphasis</p>
      <h2 class="heading--bold text-xl font-bold">Bold / Solid Mode</h2>
      <p class="text-sm text-text-secondary mb-3">
        High-contrast solid backgrounds for urgent callouts, prominent table headers, or critical operational flags.
      </p>
      <TuxExample class="mt-4" :vue="boldVue">
        <div class="flex flex-wrap gap-2">
          <TuxBadge tone="brand" bold>BRAND SOLID</TuxBadge>
          <TuxBadge tone="success" bold>LIVE STREAM</TuxBadge>
          <TuxBadge tone="warning" bold>ACTION REQUIRED</TuxBadge>
          <TuxBadge tone="danger" bold>OUTAGE</TuxBadge>
          <TuxBadge tone="info" bold>SCHEDULED</TuxBadge>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">affordances</p>
      <h2 class="heading--bold text-xl font-bold">Leading Icons &amp; Status Dots</h2>
      <p class="text-sm text-text-secondary mb-3">
        Explicit <code>dot</code> prop with pulsing animation on active/critical tones, or <code>icon</code> prop for semantic icons.
      </p>
      <TuxExample class="mt-4" :vue="iconDotVue">
        <div class="flex flex-wrap gap-2">
          <TuxBadge tone="success" dot>Active Sensor</TuxBadge>
          <TuxBadge tone="danger" dot>Alert Triggered</TuxBadge>
          <TuxBadge tone="brand" icon="lucide:shield-check">Secured</TuxBadge>
          <TuxBadge tone="info" icon="lucide:database">PostgreSQL</TuxBadge>
          <TuxBadge tone="neutral" icon="lucide:file-text">Draft Spec</TuxBadge>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">machine tokens</p>
      <h2 class="heading--bold text-xl font-bold">Tags</h2>
      <p class="text-sm text-text-secondary mb-3">
        Monospace + outline to read as machine tokens, not editorial copy.
      </p>
      <TuxExample :vue="tagsVue">
        <div class="flex flex-wrap gap-2">
          <TuxBadge v-for="t in tags" :key="t" kind="tag">{{ t }}</TuxBadge>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">facet · count</p>
      <h2 class="heading--bold text-xl font-bold">Counts</h2>
      <TuxExample class="mt-4" :vue="countVue">
        <div class="flex flex-wrap gap-2">
          <TuxBadge kind="count" :count="42">pdf</TuxBadge>
          <TuxBadge kind="count" :count="11">md</TuxBadge>
          <TuxBadge kind="count" :count="3">xlsx</TuxBadge>
          <TuxBadge kind="count" :count="1204">csv</TuxBadge>
        </div>
      </TuxExample>
    </section>
  </div>
</template>
