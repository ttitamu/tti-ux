<script setup lang="ts">
import tuxSuggestionChipsSource from "~/components/TuxSuggestionChips.vue?raw";

useHead({ title: "TuxSuggestionChips · TUX" });

const lastPicked = ref<string | null>(null);

const basicVue = `<tux-suggestion-chips
  label="Follow up with"
  :items="[
    'Why does CLS-211 drop on public-tier?',
    'Show per-document score deltas',
    'Promote CLS-211 to staging',
  ]"
  @pick="(p) => prompt = p"
/>`;

const richVue = `<tux-suggestion-chips
  :items="[
    'Plain string is both label and prompt',
    {
      label: 'Short chip text',
      prompt: 'A longer prompt that the chip expands to when picked.',
    },
  ]"
  @pick="onPick"
/>`;

const noArrowVue = `<tux-suggestion-chips
  no-arrow
  :items="['Tag-style chips without trailing arrow']"
/>`;

const basicItems = [
  "Why does CLS-211 drop on public-tier?",
  "Show per-document score deltas",
  "Promote CLS-211 to staging",
];

const richItems = [
  "Plain string is both label and prompt",
  { label: "Short chip text", prompt: "A longer prompt that the chip expands to when picked." },
];
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxSuggestionChips">
      Horizontal row of clickable prompt-suggestion chips. Surfaces "what
      could I ask?" examples in an empty-state composer or "what next?"
      follow-ups after an assistant response. Pure presentation — host
      app decides what happens on pick (typically: pre-fill the composer
      or dispatch the prompt to the chat pipeline).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Plain string items</h2>
      <p class="text-sm text-text-secondary mb-3">
        Each string is used as both the chip label and the emitted prompt.
        Optional <code>label</code> appears as an eyebrow above the row.
      </p>
      <TuxExample class="mt-4" :vue="basicVue" :source="tuxSuggestionChipsSource">
        <TuxSuggestionChips
          label="Follow up with"
          :items="basicItems"
          @pick="(p) => lastPicked = p"
        />
        <p v-if="lastPicked" class="mt-3 text-xs text-text-muted">
          last picked: <code>{{ lastPicked }}</code>
        </p>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">label vs prompt</p>
      <h2 class="heading--bold text-xl font-bold">Short label, longer prompt</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>{ label, prompt }</code> objects when you want a short
        chip but a fuller prompt on dispatch.
      </p>
      <TuxExample :vue="richVue">
        <TuxSuggestionChips
          aria-label="Short label vs longer prompt example"
          :items="richItems"
          @pick="(p) => lastPicked = p"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">no-arrow</p>
      <h2 class="heading--bold text-xl font-bold">Without trailing arrow</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>no-arrow</code> for a tag-style row without the
        arrow-up-right affordance — useful when the chips are pure
        filters rather than dispatchable prompts.
      </p>
      <TuxExample :vue="noArrowVue">
        <TuxSuggestionChips
          aria-label="Tag-style chips without trailing arrow"
          no-arrow
          :items="['Tag-style chips without trailing arrow']"
        />
      </TuxExample>
    </section>
  </div>
</template>
