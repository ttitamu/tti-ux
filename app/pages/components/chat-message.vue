<script setup lang="ts">
useHead({ title: "TuxChatMessage · TUX" });

const basicVue = `<tux-chat-message role="user" author="Joe Aggie" timestamp="10:42:14 CDT">
  Summarize Q1 work-zone crash trends on TX-6.
</tux-chat-message>
<tux-chat-message
  role="assistant"
  author="tti-ai"
  timestamp="10:42:17 CDT"
  meta="anthropic/haiku-4.5 · 2.1s"
>
  Three corridors cleared the threshold; one was rolled forward to Q2
  pending updated detector counts.
</tux-chat-message>`;

const citations = [
  { title: "TX-6-Q1-2026-summary.pdf",  path: "tti-corridors/2026-Q1.pdf",         score: "0.94" },
  { title: "work-zone-protocol.md",      path: "tti-research/protocol/work-zone.md", score: "0.81" },
];

const citationsVue = `<tux-chat-message role="assistant" author="tti-ai" timestamp="10:42:17 CDT">
  Three corridors cleared the threshold…
  <template #citations>
    <tux-citations :items="citations" />
  </template>
</tux-chat-message>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · chat" title="TuxChatMessage">
      A single message in a tti-ai-chat-style conversation. Two roles
      (<code>user</code> · <code>assistant</code>); the assistant
      variant sits on <code>--surface-sunken</code> and uses the TTI
      road-glyph as its avatar so model output reads as a distinct,
      institutionally-branded lane. Slot citations into
      <code>#citations</code> and tools into <code>#tools</code>.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">User · Assistant pair</h2>
      <TuxExample class="mt-4" :vue="basicVue">
        <div class="border border-surface-border rounded-md overflow-hidden">
          <TuxChatMessage role="user" author="Joe Aggie" timestamp="10:42:14 CDT">
            Summarize Q1 work-zone crash trends on TX-6.
          </TuxChatMessage>
          <TuxChatMessage
            role="assistant"
            author="tti-ai"
            timestamp="10:42:17 CDT"
            meta="anthropic/haiku-4.5 · 2.1s"
          >
            Three corridors cleared the threshold; one was rolled forward to Q2 pending updated detector counts.
          </TuxChatMessage>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">with citations</p>
      <h2 class="heading--bold text-xl font-bold">Knowledge-grounded reply</h2>
      <TuxExample class="mt-4" :vue="citationsVue">
        <div class="border border-surface-border rounded-md overflow-hidden">
          <TuxChatMessage
            role="assistant"
            author="tti-ai"
            timestamp="10:42:17 CDT"
            meta="anthropic/haiku-4.5 · 2.1s"
          >
            Three corridors cleared the threshold; one was rolled forward to Q2 pending updated detector counts.
            <template #citations>
              <TuxCitations :items="citations" />
            </template>
          </TuxChatMessage>
        </div>
      </TuxExample>
    </section>
  </div>
</template>
