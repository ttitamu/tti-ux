<script setup lang="ts">
useHead({ title: "TuxChatMessage · TUX" });

const basicVue = `<tux-chat-message role="user" author="Alex Rivera" timestamp="10:42:14 CDT">
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

const groundedSources = [
  {
    id: 1,
    title: "TxDOT Work Zone Safety Guidelines 2026",
    domain: "tti.tamu.edu",
    snippet: "Longitudinal channelizing devices reduced work-zone intrusions by 18.4% across rural four-lane corridors.",
    url: "https://tti.tamu.edu",
    dlpChecked: true,
  },
  {
    id: 2,
    title: "FHWA MUTCD 11th Edition — Part 6 Temporary Traffic Control",
    domain: "fhwa.dot.gov",
    snippet: "Updated taper length and arrow board visibility criteria for high-speed interstate work zones.",
    url: "https://mutcd.fhwa.dot.gov",
    dlpChecked: true,
  },
];

const agenticVue = `<tux-chat-message role="assistant" author="tti-ai" timestamp="10:42:19 CDT" meta="tti-ai-studio · agentic">
  <tux-reasoning :duration="3.8" :tokens-per-sec="64.2">
    1. Querying TxDOT PeMS work-zone detector feed for TX-6...
    2. Cross-referencing queue length telemetry against MUTCD Part 6 thresholds.
  </tux-reasoning>
  <tux-tool-call verb="search" arg="tx6_workzone_crashes_2026_q1" :elapsed-ms="128" status="completed">
    Found 14 detector segments matching corridor filter.
  </tux-tool-call>
  <p>Three corridors cleared the threshold; segment B-04 was rolled forward to Q2 pending updated radar counts.</p>
  <tux-grounded-sources :sources="groundedSources" />
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
          <TuxChatMessage role="user" author="Alex Rivera" timestamp="10:42:14 CDT">
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

    <section>
      <p class="eyebrow">agentic reasoning, tool calls &amp; grounded sources</p>
      <h2 class="heading--bold text-xl font-bold">TuxReasoning · TuxToolCall · TuxGroundedSources</h2>
      <p class="mt-1 text-sm text-text-secondary max-w-2xl">
        Compose collapsible chain-of-thought planning (<code>&lt;TuxReasoning&gt;</code>), discrete tool-execution telemetry cards
        (<code>&lt;TuxToolCall&gt;</code>), and DLP-verified source strips (<code>&lt;TuxGroundedSources&gt;</code>) inside assistant turns.
      </p>
      <TuxExample class="mt-4" :vue="agenticVue">
        <div class="border border-surface-border rounded-md overflow-hidden">
          <TuxChatMessage
            role="assistant"
            author="tti-ai"
            timestamp="10:42:19 CDT"
            meta="tti-ai-studio · agentic"
          >
            <TuxReasoning :duration="3.8" :tokens-per-sec="64.2">
              1. Querying TxDOT PeMS work-zone detector feed for TX-6...
              2. Cross-referencing queue length telemetry against MUTCD Part 6 thresholds.
            </TuxReasoning>
            <TuxToolCall verb="search" arg="tx6_workzone_crashes_2026_q1" :elapsed-ms="128" status="completed">
              Found 14 detector segments matching corridor filter.
            </TuxToolCall>
            <p class="mt-2">
              Three corridors cleared the threshold; segment B-04 was rolled forward to Q2 pending updated radar counts.
            </p>
            <TuxGroundedSources :sources="groundedSources" />
          </TuxChatMessage>
        </div>
      </TuxExample>
    </section>
  </div>
</template>
