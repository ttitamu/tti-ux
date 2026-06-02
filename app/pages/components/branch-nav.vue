<script setup lang="ts">
import tuxBranchNavSource from "~/components/TuxBranchNav.vue?raw";

useHead({ title: "TuxBranchNav · TUX" });

const current = ref(2);
const looped = ref(1);
const singleton = ref(1);

const basicVue = `<tux-branch-nav v-model="current" :total="3" />`;
const loopVue = `<tux-branch-nav v-model="current" :total="5" loop />`;
const hideSingleVue = `<tux-branch-nav v-model="current" :total="1" />
<!-- Renders nothing — hideSingleton defaults true so a single response
     doesn't get a useless nav. Pass :hide-singleton="false" to force. -->`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxBranchNav">
      <code>‹ N of M ›</code> navigator for response alternatives. When the
      model produces multiple candidates for the same prompt (regeneration
      / branching), surface a small prev/next pair so users can cycle.
      Position is rendered as text so screen readers announce the change.
      Lives well in <code>TuxChatMessage</code>'s
      <code>#header-trailing</code> slot.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Three alternatives</h2>
      <p class="text-sm text-text-secondary mb-3">
        v-model is 1-indexed. At the start, the prev button is disabled;
        at the end, next is disabled.
      </p>
      <TuxExample class="mt-4" :vue="basicVue" :source="tuxBranchNavSource">
        <TuxBranchNav v-model="current" :total="3" aria-label="Response alternatives — basic" />
        <p class="mt-3 text-xs text-text-muted">
          current: <code>{{ current }}</code>
        </p>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">wrap</p>
      <h2 class="heading--bold text-xl font-bold">Loop at the ends</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>loop</code> to wrap around at both ends. Use when the
        alternates form a cycle (e.g., circular regeneration history).
      </p>
      <TuxExample :vue="loopVue">
        <TuxBranchNav v-model="looped" :total="5" loop aria-label="Response alternatives — looping" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">singleton</p>
      <h2 class="heading--bold text-xl font-bold">Hidden when N = 1</h2>
      <p class="text-sm text-text-secondary mb-3">
        Default behavior: a single response doesn't need a nav, so the
        component renders nothing. Pass
        <code>:hide-singleton="false"</code> to force render.
      </p>
      <TuxExample :vue="hideSingleVue">
        <div class="flex items-center gap-3">
          <span class="text-xs text-text-muted">(renders nothing →)</span>
          <TuxBranchNav v-model="singleton" :total="1" />
          <span class="text-xs text-text-muted">← only one branch</span>
        </div>
      </TuxExample>
    </section>
  </div>
</template>
