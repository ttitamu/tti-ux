<script setup lang="ts">
useHead({ title: "TuxReactionBar · TUX" });

const active1 = ref<string[]>([]);
const active2 = ref<string[]>(["helpful"]);
const active3 = ref<string[]>([]);

const counts = { helpful: 24, question: 3, disagree: 1 };

const customReactions = [
  { key: "agree",  icon: "lucide:check",   label: "Agree",  tone: "success" as const },
  { key: "unsure", icon: "lucide:circle-help", label: "Unsure", tone: "warning" as const },
  { key: "object", icon: "lucide:x",       label: "Object", tone: "neutral" as const },
];

const basicVue = `<tux-reaction-bar
  v-model="active"
  :counts="{ helpful: 24, question: 3 }"
  @react="onReact"
/>`;

const customVue = `<tux-reaction-bar
  v-model="active"
  :reactions="[
    { key: 'agree',  icon: 'lucide:check',       label: 'Agree',  tone: 'success' },
    { key: 'unsure', icon: 'lucide:circle-help', label: 'Unsure', tone: 'warning' },
    { key: 'object', icon: 'lucide:x',           label: 'Object', tone: 'neutral' },
  ]"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · feedback" title="TuxReactionBar">
      Light-touch acknowledgement strip — a small row of single-glyph
      reactions sitting under content. The point isn't a social-network
      like-count — it's a lower-friction "did this help?" / "I have a
      question" signal than a full feedback form. Use in research-paper
      appendices, editorial articles, or tti-ai-studio responses
      (alongside the standard 5-icon action row).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · default trio</p>
      <h2 class="heading--bold text-xl font-bold">Helpful · Question · Disagree</h2>
      <TuxExample class="mt-4" :vue="basicVue">
        <TuxReactionBar v-model="active1" :counts="counts" />
      </TuxExample>
      <p class="mt-3 text-xs text-text-muted">
        Active: <strong>{{ active1.length ? active1.join(', ') : '(none)' }}</strong>
      </p>
    </section>

    <section>
      <p class="eyebrow">with preselection</p>
      <h2 class="heading--bold text-xl font-bold">Already responded</h2>
      <TuxExample class="mt-4" :vue="basicVue">
        <TuxReactionBar v-model="active2" :counts="counts" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">custom set</p>
      <h2 class="heading--bold text-xl font-bold">Peer-review reactions</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>reactions</code> to swap the default trio. Each
        entry needs a unique <code>key</code>, a Lucide icon, a label
        (used for both the visible text and the aria-label), and an
        optional tone.
      </p>
      <TuxExample class="mt-4" :vue="customVue">
        <TuxReactionBar v-model="active3" :reactions="customReactions" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">compact</p>
      <h2 class="heading--bold text-xl font-bold">Inline-article size</h2>
      <TuxExample class="mt-4" :vue="basicVue">
        <TuxReactionBar v-model="active1" :counts="counts" size="sm" />
      </TuxExample>
    </section>
  </div>
</template>
