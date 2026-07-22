<script setup lang="ts">
import tuxInfoLabelSource from "~/components/TuxInfoLabel.vue?raw";

useHead({ title: "TuxInfoLabel · TUX" });

const threshold = ref(0.62);
const tier = ref("itar");

const basicVue = `<tux-info-label for="cls-211-threshold" required>
  Classifier threshold
  <template #info>
    The cosine-similarity floor above which CLS-211 marks a document as
    ITAR-positive. Anything below this is sent to manual review.
  </template>
</tux-info-label>
<UInput id="cls-211-threshold" v-model="threshold" type="number" step="0.01" />`;

const clickVue = `<tux-info-label
  for="retention-class"
  trigger="click"
>
  Retention class
  <template #info>
    <p>Retention controls how long Landscape holds the artifact:</p>
    <p>
      <code>permanent</code> — keep until manual delete.<br>
      <code>30d</code> — auto-purge after 30 days.<br>
      <code>session</code> — discarded at session end.
    </p>
  </template>
</tux-info-label>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxInfoLabel">
      Form-field label with an <code>(i)</code> info button. Hover or
      click the button to reveal a <code>UPopover</code> with the
      extended explanation. Built for technical research forms where
      field meanings deserve context — ITAR rubrics, retention classes,
      classifier metric definitions, model-config knobs. Pair with form
      primitives via the standard <code>for=</code> attribute.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Required field with help</h2>
      <p class="text-sm text-text-secondary mb-3">
        <code>required</code> adds a maroon <code>*</code> after the
        label. The <code>#info</code> slot is the popover body — any
        Vue content, including inline code, fits.
      </p>
      <TuxExample class="mt-4" :vue="basicVue" :source="tuxInfoLabelSource">
        <div class="space-y-1.5 max-w-md">
          <TuxInfoLabel for="cls-211-threshold" required>
            Classifier threshold
            <template #info>
              The cosine-similarity floor above which CLS-211 marks a
              document as ITAR-positive. Anything below this is sent to
              manual review.
            </template>
          </TuxInfoLabel>
          <UInput id="cls-211-threshold" v-model="threshold" type="number" step="0.01" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">click trigger</p>
      <h2 class="heading--bold text-xl font-bold">Click instead of hover</h2>
      <p class="text-sm text-text-secondary mb-3">
        Default trigger is hover (matches Fluent 2). Pass
        <code>trigger="click"</code> for keyboard-first or touch-heavy
        surfaces, or when the help text is long enough that "tooltip on
        hover" feels too transient.
      </p>
      <TuxExample :vue="clickVue">
        <div class="space-y-1.5 max-w-md">
          <TuxInfoLabel for="retention-class" trigger="click">
            Retention class
            <template #info>
              <p>Retention controls how long Landscape holds the artifact:</p>
              <p>
                <code>permanent</code> — keep until manual delete.<br>
                <code>30d</code> — auto-purge after 30 days.<br>
                <code>session</code> — discarded at session end.
              </p>
            </template>
          </TuxInfoLabel>
          <USelect
            id="retention-class"
            v-model="tier"
            :items="[
              { label: 'permanent', value: 'permanent' },
              { label: '30 days',  value: '30d' },
              { label: 'session',   value: 'session' },
            ]"
          />
        </div>
      </TuxExample>
    </section>
  </div>
</template>
