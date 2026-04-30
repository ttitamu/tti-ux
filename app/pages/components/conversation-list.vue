<script setup lang="ts">
useHead({ title: "TuxConversationList · TUX" });

const groups = [
  { group: "TODAY", items: [
    { id: "c1", title: "TX-6 work-zone classifier scope",        meta: "4 turns" },
    { id: "c2", title: "Summarize Q1 corridor crash trends",     meta: "12 turns" },
  ]},
  { group: "YESTERDAY", items: [
    { id: "c3", title: "Extract sponsors from sponsored-research PDFs", meta: "27 turns · 3 corpora" },
    { id: "c4", title: "Draft data-management plan template",    meta: "6 turns" },
  ]},
  { group: "THIS WEEK", items: [
    { id: "c5", title: "Compare 2023 vs 2024 corridor reports",  meta: "18 turns · BI corpus" },
    { id: "c6", title: "Generate handoff notes for PECAN v1.2",  meta: "9 turns" },
  ]},
];

const active = ref("c2");

const basicVue = `<tux-conversation-list
  :groups="groups"
  :active-id="active"
  @pick="active = $event"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · chat" title="TuxConversationList">
      Left-rail conversation history grouped by temporal bucket
      (TODAY · YESTERDAY · THIS WEEK · …). Active item gets a 3px
      maroon left border and a 10%-tint background. Bucket grouping
      is caller-controlled.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Sidebar history</h2>
      <TuxExample class="mt-4" :vue="basicVue">
        <div
          class="border border-surface-border rounded-md overflow-hidden"
          style="width: 300px; height: 380px; display: flex; flex-direction: column; background: var(--surface-sunken);"
        >
          <TuxConversationList
            :groups="groups"
            :active-id="active"
            @pick="active = $event"
          />
        </div>
      </TuxExample>
    </section>
  </div>
</template>
