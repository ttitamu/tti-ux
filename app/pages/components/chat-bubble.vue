<script setup lang="ts">
useHead({ title: "TuxChatBubble · TUX" });

const assistantBubbleVue = `<tux-chat-bubble
  role="assistant"
  title="Rev AI"
  status="online"
  tail="bottom-left"
  :suggestions="['Summarize TX-6 corridors', 'Compare crash rates', 'Export shapefiles']"
  @select-suggestion="onSelect"
>
  Good morning! I have refreshed the statewide corridor safety models. Which segment would you like to inspect?
</tux-chat-bubble>`;

const triggerVue = `<tux-chat-bubble
  mode="trigger"
  title="Rev AI"
  status="online"
  teaser="Need help analyzing this corridor?"
  badge="1"
/>`;

const userBubbleVue = `<tux-chat-bubble
  role="user"
  title="You"
  statusText="10:45 AM"
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
    <TuxPageHeader eyebrow="component · ai" title="TuxChatBubble">
      Conversational speech bubble and assistant launcher primitive for institutional AI.
      Powers conversational surfaces like Rev AI across Atlas and TTI Code, supporting
      floating launchers with greeting teasers and speech bubbles with suggestion chips.
    </TuxPageHeader>

    <!-- Institutional Architecture Callout -->
    <div class="p-4 rounded-xl border border-brand-primary/20 bg-brand-primary/5 dark:bg-brand-primary/10 flex items-start gap-3">
      <UIcon name="lucide:shield-check" class="w-5 h-5 text-brand-primary dark:text-brand-accent flex-shrink-0 mt-0.5" />
      <div class="text-xs text-text-secondary leading-relaxed">
        <strong class="text-text-primary">Institutional Integration Note:</strong>
        Rev AI's animated sprite and live inference actions are secured behind institutional authentication
        in Atlas and TTI Code. <code>TuxChatBubble</code> provides the uncoupled, accessible UI primitive that
        can be rendered in any TTI environment.
      </div>
    </div>

    <section>
      <p class="eyebrow">assistant bubble</p>
      <h2 class="text-xl font-bold">Speech container with suggestion actions</h2>
      <TuxExample class="mt-4" :vue="assistantBubbleVue">
        <div class="p-6 border border-surface-border rounded-xl bg-surface-sunken flex flex-col items-start gap-4">
          <TuxChatBubble
            role="assistant"
            title="Rev AI"
            status="online"
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
      <p class="eyebrow">launcher mode</p>
      <h2 class="text-xl font-bold">Floating trigger with teaser bubble</h2>
      <TuxExample class="mt-4" :vue="triggerVue">
        <div class="p-6 border border-surface-border rounded-xl bg-surface-raised flex items-center justify-end">
          <TuxChatBubble
            mode="trigger"
            title="Rev AI"
            status="online"
            teaser="Need help analyzing this corridor?"
            badge="1"
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
            status-text="10:45 AM"
            tail="bottom-right"
          >
            Can you generate a summary of work-zone incidents on I-35 for Q1 2026?
          </TuxChatBubble>
        </div>
      </TuxExample>
    </section>
  </div>
</template>
