<script setup lang="ts">
useHead({ title: "TuxDescriptionList · tti-ux" });

const eventItems = [
  { term: "Date",      value: "Thursday, May 14, 2026" },
  { term: "Time",      value: "9:00 AM – 4:00 PM CDT" },
  { term: "Location",  value: "Rellis Conference Center · Building 4202" },
  { term: "Capacity",  value: "120 attendees" },
  { term: "Cost",      value: "Free for TAMUS staff; $75 external" },
];

const fileItems = [
  { term: "path",       value: "/research/grants/nsf-1234/data/2026/Q4/findings.pdf" },
  { term: "size",       value: "4,217,832 bytes" },
  { term: "modified",   value: "2026-04-22T14:33:18Z" },
  { term: "owner",      value: "rchen@tti.tamu.edu" },
  { term: "tier",       value: "Restricted · ITAR" },
  { term: "retention",  value: "Permanent" },
  { term: "classifier", value: "CLS-204 · 0.87 confidence" },
];

const exampleVue = `<TuxDescriptionList
  title="Event details"
  :items="[
    { term: 'Date',     value: 'Thursday, May 14, 2026' },
    { term: 'Time',     value: '9:00 AM – 4:00 PM CDT' },
    { term: 'Location', value: 'Rellis Conference Center' },
  ]"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxDescriptionList">
      Term / definition pairs. The right semantic structure for spec tables,
      event details, file metadata — anything shaped as "label : value".
      Renders as native <code>&lt;dl&gt;</code> + <code>&lt;dt&gt;</code> +
      <code>&lt;dd&gt;</code> for screen-reader and search-engine benefits.
      Two layouts (<strong>inline</strong> / <strong>stacked</strong>) and
      two emphases (<strong>editorial</strong> for content,
      <strong>data</strong> for product metadata).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Editorial · inline</h2>
      <p class="text-sm text-text-secondary mb-3">
        Marketing surfaces — event details, exhibit captions, sponsor info.
        Eyebrow-styled terms, body-text values.
      </p>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxDescriptionList title="Event details" :items="eventItems" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data emphasis</p>
      <h2 class="heading--bold text-xl font-bold">PECAN file metadata</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>emphasis="data"</code> for product surfaces. Mono-font
        terms, tabular numerals on values. <code>&lt;code&gt;</code> tags
        inside values render in brand maroon.
      </p>
      <TuxExample class="mt-4">
        <TuxDescriptionList
          title="File · findings.pdf"
          emphasis="data"
          :items="fileItems"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">stacked layout</p>
      <h2 class="heading--bold text-xl font-bold">More breathing room</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>layout="stacked"</code>. Term above, value below. Right
        for full-width metadata blocks where each pair deserves real
        estate — research project overview, dataset description.
      </p>
      <TuxExample class="mt-4">
        <TuxDescriptionList
          layout="stacked"
          :items="[
            { term: 'Project', value: 'Twelve-County Rural Roadway Study' },
            { term: 'Sponsor', value: 'TxDOT IAC 2020-78-104' },
            { term: 'Period of performance', value: '2020-09-01 through 2026-08-31' },
            { term: 'Principal investigators', value: 'Dr. Lina Hassan (TTI), Dr. Imani Park (CTE)' },
          ]"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">slot composition</p>
      <h2 class="heading--bold text-xl font-bold">Rich values</h2>
      <p class="text-sm text-text-secondary mb-3">
        Each item exposes a <code>#value-{idx}</code> slot for richer
        content than a string — links, badges, code snippets, embedded
        components.
      </p>
      <TuxExample class="mt-4">
        <TuxDescriptionList
          emphasis="data"
          :items="[
            { term: 'classifier' },
            { term: 'tier' },
            { term: 'agent' },
          ]"
        >
          <template #value-0>
            <code>CLS-204</code> · <span class="link-tti">View confidence breakdown</span>
          </template>
          <template #value-1>
            <TuxBadge color="error">ITAR</TuxBadge>
            <TuxBadge color="warning">Restricted</TuxBadge>
          </template>
          <template #value-2>
            <code>pecan-agent@host-04</code> · last beat 3s ago
          </template>
        </TuxDescriptionList>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + item shape</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>items</code> — array of <code>{ term, value? }</code>. Required.</li>
        <li><code>layout</code> — <code>"inline" | "stacked"</code>. Defaults to <code>"inline"</code>.</li>
        <li><code>emphasis</code> — <code>"editorial" | "data"</code>. Defaults to <code>"editorial"</code>.</li>
        <li><code>title</code> — optional heading above the list with maroon underline.</li>
        <li><code>#value-{idx}</code> slots — rich values for any item.</li>
      </ul>
    </section>
  </div>
</template>
