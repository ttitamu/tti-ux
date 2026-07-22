<script setup lang="ts">
useHead({ title: "TuxCitations · TUX" });

const items = [
  { title: "TX-6-Q1-2026-summary.pdf", path: "tti-corridors/2026-Q1.pdf",            score: "0.94" },
  { title: "work-zone-protocol.md",     path: "tti-research/protocol/work-zone.md",   score: "0.81" },
  { title: "TxDOT rule 43 §31.12",       path: "txdot-rules/43-31-12.pdf",             score: "0.74" },
];

const basicVue = `<tux-citations :items="[
  { title: 'TX-6-Q1-2026-summary.pdf', path: 'tti-corridors/2026-Q1.pdf', score: '0.94' },
  { title: 'work-zone-protocol.md',     path: 'tti-research/protocol/work-zone.md', score: '0.81' },
  { title: 'TxDOT rule 43 §31.12',       path: 'txdot-rules/43-31-12.pdf', score: '0.74' },
]" />`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · chat" title="TuxCitations">
      Numbered source list under an assistant message. Renders title
      (editorial) · path (monospace) · score (monospace) in a
      3-column grid so paths can ellipsize without pushing the score
      off-screen. Designed to slot into <code>TuxChatMessage</code>'s
      <code>#citations</code> slot.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Three sources</h2>
      <TuxExample class="mt-4" :vue="basicVue">
        <TuxCitations :items="items" />
      </TuxExample>
    </section>
  </div>
</template>
