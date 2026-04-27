<script setup lang="ts">
useHead({ title: "TuxSearch · tti-ux" });

const q1 = ref("");
const q2 = ref("");
const q3 = ref("traffic safety");

const lastSubmitted = ref<string | null>(null);

const exampleVue = `<TuxSearch
  v-model="q"
  placeholder="Search the corpus"
  @submit="onSearch"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxSearch">
      Branded inline search bar — bordered input + attached uppercase action
      button. Two sizes (<strong>regular</strong> 60px / <strong>slim</strong>
      51px). Focus border pulls to maroon (gold on dark), 3px wide. Submit
      fires on Enter or button click.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Regular · 60px</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxSearch
          v-model="q1"
          placeholder="Search PECAN indices"
          @submit="(v) => (lastSubmitted = v)"
        />
      </TuxExample>
      <p v-if="lastSubmitted" class="mt-3 font-mono text-xs text-text-muted">
        last submitted: <code>{{ lastSubmitted }}</code>
      </p>
    </section>

    <section>
      <p class="eyebrow">slim</p>
      <h2 class="heading--bold text-xl font-bold">Header / sidebar size</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>size="slim"</code> for header chrome and sidebar widgets.
        51px tall, 123px button width.
      </p>
      <TuxExample class="mt-4">
        <TuxSearch v-model="q2" size="slim" placeholder="Search conversations" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">focus state</p>
      <h2 class="heading--bold text-xl font-bold">Forced focus border</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>force-focus</code> for screenshots / docs / demos. In
        normal use, the focus border applies on input focus automatically.
      </p>
      <TuxExample class="mt-4">
        <TuxSearch v-model="q3" force-focus />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">custom action</p>
      <h2 class="heading--bold text-xl font-bold">Override label + icon</h2>
      <p class="text-sm text-text-secondary mb-3">
        Use <code>action-label</code> + <code>action-icon</code> when the
        input isn't a search per se — a filter input, a query builder, etc.
      </p>
      <TuxExample class="mt-4">
        <TuxSearch
          v-model="q1"
          action-label="Filter"
          action-icon="lucide:filter"
          placeholder="Filter classifiers"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">composed block</p>
      <h2 class="heading--bold text-xl font-bold">Heading + bar + lede</h2>
      <p class="text-sm text-text-secondary mb-3">
        Trivial composition — heading, search, optional helper text. No
        dedicated component for this; just stack them.
      </p>
      <TuxExample class="mt-4">
        <div class="max-w-xl space-y-3">
          <h3 class="text-2xl font-bold">Find a research project</h3>
          <TuxSearch v-model="q1" size="slim" placeholder="grant ID, PI name, or keyword" />
          <p class="text-sm text-text-muted">
            Searches across all 650+ active projects. Use quotes for exact match.
          </p>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + events</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>v-model</code> — current input value.</li>
        <li><code>size</code> — <code>"regular" | "slim"</code>. Defaults to <code>"regular"</code>.</li>
        <li><code>placeholder</code> — italic placeholder text.</li>
        <li><code>actionLabel</code> — uppercase button label. Defaults to <code>"Search"</code>.</li>
        <li><code>actionIcon</code> — Lucide icon name. Defaults to <code>"lucide:search"</code>.</li>
        <li><code>disabled</code> — disable input + action.</li>
        <li><code>forceFocus</code> — render with focus border for docs/demos.</li>
        <li>Emits <code>@submit</code> with the current value on Enter or button click.</li>
      </ul>
    </section>
  </div>
</template>
