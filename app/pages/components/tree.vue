<script setup lang="ts">
useHead({ title: "TuxTree · TUX" });

// Sitemap-style example: nav structure with route links + badges.
const sitemap = [
  {
    id: "design",
    label: "Design",
    icon: "lucide:book-open",
    children: [
      { id: "design-tux",        label: "Doctrine",   to: "/design/tux" },
      { id: "design-components", label: "Components", to: "/design/components" },
      { id: "design-palette",    label: "Palette",    to: "/design/palette" },
      { id: "design-roadmap",    label: "Roadmap",    to: "/design/roadmap", badge: "v1.3" },
    ],
  },
  {
    id: "foundations",
    label: "Foundations",
    icon: "lucide:layers",
    children: [
      { id: "tokens",     label: "Tokens",         to: "/tokens" },
      { id: "typography", label: "Typography",     to: "/typography" },
      { id: "variants",   label: "Style variants", to: "/style-variants" },
      { id: "icons",      label: "Icons",          to: "/icons", badge: "1.7K" },
    ],
  },
  {
    id: "composition",
    label: "Composition",
    icon: "lucide:layout-panel-left",
    children: [
      { id: "patterns", label: "Patterns",  to: "/patterns" },
      { id: "kits",     label: "UI kits",   to: "/kits" },
      { id: "markdown", label: "Markdown",  to: "/markdown" },
    ],
  },
];

// Corpus / filesystem browser — paths render in JetBrains Mono via
// `mono: true`. Leaf rows carry a row-count badge (typical "n files"
// hint a PECAN/research dashboard would show).
const corpus = [
  {
    id: "grants-2024",
    label: "grants-2024/",
    mono: true,
    children: [
      {
        id: "dod",
        label: "dod-xr-contracts/",
        mono: true,
        children: [
          { id: "dod-q1", label: "q1-2024-audit.md",    mono: true, badge: 12 },
          { id: "dod-fp", label: "false-positives.csv", mono: true, badge: 342 },
        ],
      },
      {
        id: "tex",
        label: "texdot-state/",
        mono: true,
        children: [
          { id: "tex-q1", label: "q1-2024-audit.md", mono: true, badge: 8 },
          { id: "tex-fp", label: "rejections.csv",   mono: true, badge: 218 },
        ],
      },
      {
        id: "nsf",
        label: "nsf-cdr/",
        mono: true,
        children: [
          { id: "nsf-prop", label: "proposals.json", mono: true, badge: 27 },
          { id: "nsf-fp",   label: "fp-log.csv",     mono: true, badge: 104 },
        ],
      },
    ],
  },
];

// BI dataset hierarchy — the kind of tree a Power BI / Fabric explorer
// shows. Dataset → tables → fields, each with a row count or type
// badge. Aligns with ADR-0009's BI-design-system direction.
const dataset = [
  {
    id: "rellis-fy24",
    label: "RELLIS Field Tests · FY24",
    icon: "lucide:database",
    description: "12.4M rows · refreshed 4h ago",
    children: [
      {
        id: "tests",
        label: "tests",
        icon: "lucide:table",
        badge: 8421,
        children: [
          { id: "tests-id",    label: "test_id",     icon: "lucide:hash",   mono: true, badge: "uuid" },
          { id: "tests-date",  label: "test_date",   icon: "lucide:calendar", mono: true, badge: "datetime" },
          { id: "tests-cond", label: "conditions",  icon: "lucide:cloud-sun",  mono: true, badge: "jsonb" },
        ],
      },
      {
        id: "vehicles",
        label: "vehicles",
        icon: "lucide:table",
        badge: 142,
        children: [
          { id: "veh-vin",    label: "vin",        icon: "lucide:hash",   mono: true, badge: "varchar(17)" },
          { id: "veh-model",  label: "model_year", icon: "lucide:hash",   mono: true, badge: "int" },
          { id: "veh-class",  label: "fhwa_class", icon: "lucide:type",   mono: true, badge: "enum" },
        ],
      },
      {
        id: "sensors",
        label: "sensor_readings",
        icon: "lucide:table",
        badge: "12.4M",
        children: [
          { id: "sen-ts",     label: "ts",         icon: "lucide:calendar", mono: true, badge: "timestamptz" },
          { id: "sen-id",     label: "sensor_id",  icon: "lucide:hash",   mono: true, badge: "varchar(32)" },
          { id: "sen-value",  label: "reading",    icon: "lucide:activity",  mono: true, badge: "float8" },
        ],
      },
    ],
  },
];

// Track selection for the dataset tree — demonstrates v-model:selected.
const selectedField = ref<string | undefined>("sen-value");

const sitemapVue = `<TuxTree :items="sitemap" />`;

const corpusVue = `<!-- mono: true on each row renders the label in JetBrains Mono -->
<TuxTree :items="corpus" :show-guides="true" />`;

const datasetVue = `<TuxTree
  :items="dataset"
  v-model:selected="selectedField"
  storage-key="bi-explorer-dataset"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxTree">
      Hierarchical list. Native (not a <code>UTree</code> wrapper) — the
      visual is brand-specific (maroon expand markers, maroon left bar
      for selection, optional sand guide lines under expanded
      branches), and the keyboard semantics are simple enough to own.
      Built for sitemap / IA explorers, corpus + filesystem browsers,
      and BI dataset hierarchies (the
      <NuxtLink to="/design/roadmap" class="link-tti">ADR-0009</NuxtLink>
      direction).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">navigation</p>
      <h2 class="heading--bold text-xl font-bold">Sitemap browser</h2>
      <p class="text-sm text-text-secondary mb-3 max-w-3xl">
        Each leaf is a real route. Click a branch to toggle; click a
        leaf to navigate. <code>badge</code> renders the small pill on
        the right (counts, version tags, status).
      </p>
      <TuxExample :vue="sitemapVue">
        <div class="max-w-md">
          <TuxTree :items="sitemap" aria-label="Sitemap" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">paths + ids</p>
      <h2 class="heading--bold text-xl font-bold">Corpus / filesystem browser</h2>
      <p class="text-sm text-text-secondary mb-3 max-w-3xl">
        Set <code>mono: true</code> on a node to render its label in
        JetBrains Mono with the maroon-on-sunken inline-code rhythm —
        reads as a machine path rather than editorial copy.
        <code>show-guides</code> draws a 1px sand guide line under
        expanded branches so deep nesting stays scan-able.
      </p>
      <TuxExample :vue="corpusVue">
        <div class="max-w-md">
          <TuxTree :items="corpus" :show-guides="true" aria-label="Corpus browser" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">selection</p>
      <h2 class="heading--bold text-xl font-bold">BI dataset hierarchy</h2>
      <p class="text-sm text-text-secondary mb-3 max-w-3xl">
        Drive a focused-field panel via <code>v-model:selected</code>.
        Selected row gets the maroon left bar + maroon label tint —
        same affordance shape as <code>.tux-cmd__item--active</code>
        for cross-component recognisability. The
        <code>storage-key</code> prop persists the expanded set in
        sessionStorage, so navigating away and back keeps the
        explorer's posture.
      </p>
      <TuxExample :vue="datasetVue">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TuxTree
            :items="dataset"
            v-model:selected="selectedField"
            storage-key="demo-bi-explorer-dataset"
            aria-label="Dataset explorer"
          />
          <aside class="p-4 bg-surface-sunken border border-surface-border rounded-md text-sm">
            <p class="eyebrow mb-1">selected field</p>
            <p class="font-mono text-text-primary">{{ selectedField ?? "(none)" }}</p>
            <p class="text-xs text-text-muted mt-3">
              Drives a real focused-field panel in BI explorer surfaces —
              field metadata, sample values, downstream visuals.
            </p>
          </aside>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>items</code> — array of <code>TreeItem</code>. Required.</li>
        <li><code>defaultExpanded</code> — initial set of expanded node IDs. Defaults to every root-level item.</li>
        <li><code>storageKey</code> — sessionStorage key for persistence. Omit to disable.</li>
        <li><code>showGuides</code> — sand guide lines under expanded branches. Defaults <code>true</code>.</li>
        <li><code>v-model:selected</code> — currently-selected node ID. Optional.</li>
        <li><code>ariaLabel</code> — passed to the root tree role. Defaults to <code>"Tree"</code>.</li>
        <li>Exposes <code>expandAll()</code> + <code>collapseAll()</code> via template ref.</li>
      </ul>
      <p class="text-sm text-text-secondary mt-4 max-w-3xl">
        Each <code>TreeItem</code> carries
        <code>{ id, label, icon?, description?, mono?, to?, href?, badge?, children? }</code>.
        Pass <code>to</code> for internal nav (renders a
        <code>&lt;NuxtLink&gt;</code>), <code>href</code> for external,
        or leave both off for a pure-toggle row that emits selection.
      </p>
    </section>
  </div>
</template>
