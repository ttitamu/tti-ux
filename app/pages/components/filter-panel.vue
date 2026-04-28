<script setup lang="ts">
useHead({ title: "TuxFilterPanel · TUX" });

const facets = [
  {
    name: "type",
    label: "File type",
    buckets: [
      { value: "pdf",   label: "PDF",       count: 12480 },
      { value: "docx",  label: "Word doc",  count: 4321 },
      { value: "xlsx",  label: "Spreadsheet", count: 1864 },
      { value: "csv",   label: "CSV",       count: 728 },
      { value: "image", label: "Image",     count: 342 },
    ],
  },
  {
    name: "tier",
    label: "Access tier",
    buckets: [
      { value: "public",      label: "Public",      count: 8120 },
      { value: "internal",    label: "Internal",    count: 6411 },
      { value: "restricted",  label: "Restricted",  count: 2230 },
      { value: "itar",        label: "ITAR",        count: 174 },
    ],
  },
  {
    name: "owner",
    label: "Owner",
    buckets: [
      { value: "rchen",     label: "R. Chen",     count: 1822 },
      { value: "macosta",   label: "M. Acosta",   count: 1340 },
      { value: "lvelazquez", label: "L. Velazquez", count: 980 },
      { value: "jhassan",   label: "J. Hassan",   count: 612 },
    ],
  },
  {
    name: "retention",
    label: "Retention class",
    collapsed: true,
    buckets: [
      { value: "permanent",  label: "Permanent",   count: 4218 },
      { value: "10yr",       label: "10 years",    count: 8932 },
      { value: "7yr",        label: "7 years",     count: 5040 },
      { value: "3yr",        label: "3 years",     count: 1144 },
    ],
  },
];

const selected = ref<Record<string, string[]>>({});

const exampleVue = `<TuxFilterPanel
  v-model="selected"
  :facets="facets"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxFilterPanel">
      Left-rail facet panel for list pages — collapsible facet groups,
      checkbox lists with counts, applied-filter chips at the top,
      <strong>Clear all</strong> when any filter is applied. Built on native
      <code>&lt;details&gt;</code> for zero-JS accordion + perfect a11y.
      v-model'd as a flat <code>{ facetName: ["v1", "v2"] }</code> record.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">PECAN-style facets</h2>
      <p class="text-sm text-text-secondary mb-3">
        Toggle checkboxes — applied filters surface as chips at the top.
        Click a chip or <strong>Clear all</strong> to remove. The
        Retention class facet starts collapsed via <code>collapsed: true</code>.
      </p>
      <TuxExample class="mt-4" :vue="exampleVue">
        <div class="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
          <TuxFilterPanel v-model="selected" :facets="facets" title="Filter results" />
          <div class="border border-surface-border rounded-md p-6 bg-surface-sunken">
            <p class="eyebrow">live state</p>
            <h3 class="heading--bold text-base font-bold mt-1">Selected filters</h3>
            <pre class="mt-3 font-mono text-xs whitespace-pre-wrap text-text-secondary">{{ JSON.stringify(selected, null, 2) }}</pre>
            <p class="mt-4 text-xs text-text-muted">
              The component v-models its state out as this object — wire it
              up to your query layer (OpenSearch facets, TanStack column
              filters, etc.) and re-fetch on change.
            </p>
          </div>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + shape</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>facets</code> — array of <code>{ name, label, buckets, collapsed? }</code>. Required.</li>
        <li>Each bucket — <code>{ value, label, count? }</code>. Counts are formatted with thousands separators.</li>
        <li><code>v-model</code> — <code>Record&lt;string, string[]&gt;</code>. Map of facet name to array of selected values.</li>
        <li><code>title</code> — heading shown above the panel. Defaults to <code>"Filter"</code>.</li>
        <li><code>collapsed: true</code> on a facet — start that group collapsed. Defaults to open.</li>
      </ul>
    </section>
  </div>
</template>
