<script setup lang="ts">
useHead({ title: "TuxChatBubble · TUX" });

const assistantBubbleVue = `<tux-chat-bubble
  role="assistant"
  title="Assistant"
  subtitle="Transportation Research"
  tail="bottom-left"
  :suggestions="['Summarize TX-6 corridors', 'Compare crash rates', 'Export shapefiles']"
  @select-suggestion="onSelect"
>
  Good morning! I have refreshed the statewide corridor safety models. Which segment would you like to inspect?
</tux-chat-bubble>`;

const triggerVue = `<!-- Standard Ready Launcher -->
<tux-chat-bubble
  mode="trigger"
  title="Assistant"
  teaser="Need help analyzing this corridor?"
/>

<!-- Thinking / Busy State -->
<tux-chat-bubble
  mode="trigger"
  title="Assistant"
  state="thinking"
/>

<!-- Attention / Notification State -->
<tux-chat-bubble
  mode="trigger"
  title="Assistant"
  state="attention"
  teaser="Analysis complete — ready for review."
/>`;

const userBubbleVue = `<tux-chat-bubble
  role="user"
  title="You"
  subtitle="10:45 AM"
  tail="bottom-right"
>
  Can you generate a summary of work-zone incidents on I-35 for Q1 2026?
</tux-chat-bubble>`;

const selectedSuggestion = ref<string | null>(null);

function onSelect(suggestion: string) {
  selectedSuggestion.value = suggestion;
}
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · communication" title="TuxChatBubble">
      Conversational speech bubble and floating assistant launcher primitive for interactive queries and institutional tools.
      Supports speech containers with suggestion chips, directional pointer tails, and floating launchers with idle, thinking, and attention states.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">assistant bubble</p>
      <h2 class="text-xl font-bold">Speech container with suggestion actions</h2>
      <TuxExample class="mt-4" :vue="assistantBubbleVue">
        <div class="p-6 border border-surface-border rounded-xl bg-surface-sunken flex flex-col items-start gap-4">
          <TuxChatBubble
            role="assistant"
            title="Assistant"
            subtitle="Transportation Research"
            tail="bottom-left"
            :suggestions="['Summarize TX-6 corridors', 'Compare crash rates', 'Export shapefiles']"
            @select-suggestion="onSelect"
          >
            Good morning! I have refreshed the statewide corridor safety models. Which segment would you like to inspect?
          </TuxChatBubble>

          <p v-if="selectedSuggestion" class="text-xs text-text-muted mt-2">
            Selected chip: <span class="font-mono text-brand-primary dark:text-brand-accent">{{ selectedSuggestion }}</span>
          </p>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">launcher states</p>
      <h2 class="text-xl font-bold">Floating trigger with idle, thinking, and attention states</h2>
      <p class="mt-2 text-sm text-text-secondary">
        The launcher indicates activity through subtle institutional cues rather than cluttering number badges or online dots.
        When processing a query, it displays a thinking state; when an update requires review, it transitions to an attention alert with gentle harmonic motion.
      </p>
      <TuxExample class="mt-4" :vue="triggerVue">
        <div class="p-6 border border-surface-border rounded-xl bg-surface-raised flex flex-wrap items-center justify-end gap-6">
          <TuxChatBubble
            mode="trigger"
            title="Assistant"
            teaser="Need help analyzing this corridor?"
          />

          <TuxChatBubble
            mode="trigger"
            title="Assistant"
            state="thinking"
          />

          <TuxChatBubble
            mode="trigger"
            title="Assistant"
            state="attention"
            teaser="Analysis complete — ready for review."
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">user bubble</p>
      <h2 class="text-xl font-bold">User speech voice</h2>
      <TuxExample class="mt-4" :vue="userBubbleVue">
        <div class="p-6 border border-surface-border rounded-xl bg-surface-raised flex justify-end">
          <TuxChatBubble
            role="user"
            title="You"
            subtitle="10:45 AM"
            tail="bottom-right"
          >
            Can you generate a summary of work-zone incidents on I-35 for Q1 2026?
          </TuxChatBubble>
        </div>
      </TuxExample>
    </section>
  </div>
</template>
