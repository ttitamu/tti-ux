<script setup lang="ts">
useHead({ title: "TuxSidebarBlock · TUX" });

const exampleVue = `<TuxSidebarBlock title="Related research" icon="lucide:link">
  <ul>
    <li><a href="#">Twelve-county roadway safety study</a></li>
    <li><a href="#">Equity-weighted DOT performance</a></li>
    <li><a href="#">Connected vehicle pilot · 2024</a></li>
  </ul>
</TuxSidebarBlock>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxSidebarBlock">
      Generic sidebar widget wrapper. Provides the consistent editorial
      rhythm (eyebrow → maroon underline → content) that makes a stack
      of distinct sidebar widgets read as a unified rail rather than
      orphan boxes. Compose any content inside the default slot —
      lists of NuxtLinks, TuxDescriptionList, TuxFactoid, prose, or a
      mix.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical · related links</p>
      <h2 class="heading--bold text-xl font-bold">Default variant</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <div class="max-w-xs">
          <TuxSidebarBlock title="Related research" icon="lucide:link">
            <ul>
              <li><a href="#">Twelve-county roadway safety study</a></li>
              <li><a href="#">Equity-weighted DOT performance</a></li>
              <li><a href="#">Connected vehicle pilot · 2024</a></li>
              <li><a href="#">Field instrumentation methodology</a></li>
            </ul>
          </TuxSidebarBlock>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">stacked rail</p>
      <h2 class="heading--bold text-xl font-bold">Multiple blocks compose into a sidebar</h2>
      <p class="text-sm text-text-secondary mb-3">
        Drop a series of blocks in a column. The maroon underline + eyebrow
        rhythm visually unifies them. Mix block contents freely — a
        TuxDescriptionList, a list of NuxtLinks, a TuxFactoid, a TuxBigStat.
      </p>
      <TuxExample class="mt-4">
        <div class="max-w-xs">
          <TuxSidebarBlock title="In this article" icon="lucide:list-tree">
            <ul>
              <li><a href="#methodology">Methodology</a></li>
              <li><a href="#results">Results · 36-month follow-up</a></li>
              <li><a href="#discussion">Discussion</a></li>
              <li><a href="#references">References</a></li>
            </ul>
          </TuxSidebarBlock>

          <TuxSidebarBlock title="Quick facts" icon="lucide:zap">
            <TuxDescriptionList
              emphasis="editorial"
              :items="[
                { term: 'Sites',     value: '12' },
                { term: 'Period',    value: '2020 – 2026' },
                { term: 'Sponsor',   value: 'TxDOT IAC 2020-78-104' },
                { term: 'Status',    value: 'Active · 36-mo follow-up' },
              ]"
            />
          </TuxSidebarBlock>

          <TuxSidebarBlock title="Contact" icon="lucide:mail">
            <p><strong>Dr. Lina Hassan</strong></p>
            <p>Principal Investigator</p>
            <p><a href="mailto:lhassan@tti.tamu.edu">lhassan@tti.tamu.edu</a></p>
          </TuxSidebarBlock>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">variants</p>
      <h2 class="heading--bold text-xl font-bold">default / bordered / filled</h2>
      <p class="text-sm text-text-secondary mb-3">
        <strong>Bordered</strong> wraps the block in a maroon hairline
        border — useful for "important sidebar" emphasis. <strong>Filled</strong>
        gives a sunken-gray background panel for "this is meta-content,
        not body."
      </p>
      <TuxExample class="mt-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
          <TuxSidebarBlock title="Default" eyebrow="standard">
            <p>No background. The maroon underline anchors the title.</p>
          </TuxSidebarBlock>
          <TuxSidebarBlock title="Bordered" eyebrow="emphasis" variant="bordered">
            <p>Maroon hairline border. Use sparingly to call out one block.</p>
          </TuxSidebarBlock>
          <TuxSidebarBlock title="Filled" eyebrow="meta" variant="filled">
            <p>Sunken-gray background. For meta-content alongside body.</p>
          </TuxSidebarBlock>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props reference</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>title</code> — block heading. Required. Renders ALL-CAPS tracked-out with maroon underline.</li>
        <li><code>eyebrow</code> — optional small lead-in above the title.</li>
        <li><code>icon</code> — Lucide icon name (e.g. <code>"lucide:link"</code>). Renders next to the title.</li>
        <li><code>variant</code> — <code>"default" | "bordered" | "filled"</code>. Defaults to <code>"default"</code>.</li>
        <li>Default slot — block content. Plain prose, lists of NuxtLinks (auto-styled), a TuxDescriptionList, etc.</li>
      </ul>
    </section>
  </div>
</template>
