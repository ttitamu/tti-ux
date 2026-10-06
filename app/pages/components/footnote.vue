<script setup lang="ts">
/**
 * /components/footnote — Dedicated showcase for TuxFootnote.
 */
useHead({ title: "TuxFootnote · Components · TUX" });

const sampleVue = `<p class="text-base leading-relaxed">
  The signal-to-noise gain held across all four corridor segments
  <TuxFootnote :n="1" text="Segments selected for treatment in 2025 Q1; pre-treatment baselines run 2024 Q3–Q4. Selection was randomized within stratified groups by traffic volume." />,
  with the strongest effect observed on corridors that previously carried
  the highest variance
  <TuxFootnote :n="2" text="'Variance' refers to the standard deviation of segment travel times computed over 15-minute rolling epochs, not individual detector pulse fluctuations." />.
</p>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · research & publishing" title="TuxFootnote">
      Inline superscript reference marker with non-disruptive hover/focus popover preview
      and keyboard-accessible jump links to the document footnote list.
    </TuxPageHeader>

    <!-- Interactive Showcase -->
    <section class="space-y-4">
      <div>
        <p class="eyebrow">interactive showcase</p>
        <h2 class="heading--bold text-xl font-bold">Hover Preview & Popover</h2>
      </div>

      <div class="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-xs space-y-6">
        <p class="text-sm text-text-muted italic">
          Hover over or focus on the numbered superscript markers below to preview the footnote without scrolling:
        </p>

        <div class="p-6 bg-surface-sunken rounded-lg border border-surface-border space-y-4 text-sm leading-relaxed text-text-primary">
          <p>
            Field telemetry across the I-35 corridor confirmed that automated queue detection reduces primary rear-end conflict risks by 23.4%<TuxFootnote :n="1" text="Estimates derived using the Federal Highway Administration Surrogate Safety Assessment Model (SSAM) calibrated on trajectory data from 14 roadside radar sensors." />.
            Additionally, secondary congestion waves dissipated an average of 8.2 minutes faster than observed during control baseline periods<TuxFootnote :n="2" text="Baseline periods defined as matched historical epochs with identical weather, incident classification, and entry volume conditions." />.
          </p>
        </div>

        <!-- Footnotes Section Mock -->
        <div class="pt-6 border-t border-surface-border space-y-3">
          <h3 class="text-xs font-mono font-semibold uppercase text-text-muted">Document Footnotes List</h3>
          <ol class="list-decimal list-inside text-xs text-text-secondary space-y-2 font-serif">
            <li id="fn-1">
              <span class="font-sans">Estimates derived using the Federal Highway Administration Surrogate Safety Assessment Model (SSAM) calibrated on trajectory data from 14 roadside radar sensors.</span>
            </li>
            <li id="fn-2">
              <span class="font-sans">Baseline periods defined as matched historical epochs with identical weather, incident classification, and entry volume conditions.</span>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- Code Snippet -->
    <section class="space-y-3">
      <p class="eyebrow">usage syntax</p>
      <h2 class="heading--bold text-xl font-bold">Code snippet</h2>
      <TuxCodeBlock :code="sampleVue" lang="vue" />
    </section>

    <!-- Props Table -->
    <section class="space-y-3">
      <p class="eyebrow">api reference</p>
      <h2 class="heading--bold text-xl font-bold">Props</h2>
      <div class="overflow-x-auto rounded-lg border border-surface-border">
        <table class="w-full text-left text-sm">
          <thead class="bg-surface-sunken text-xs font-mono font-semibold text-text-secondary uppercase border-b border-surface-border">
            <tr>
              <th class="p-3">Prop</th>
              <th class="p-3">Type</th>
              <th class="p-3">Default</th>
              <th class="p-3">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-border font-mono text-xs">
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">n</td>
              <td class="p-3 text-text-secondary">number</td>
              <td class="p-3 text-text-muted">required</td>
              <td class="p-3 font-sans text-text-secondary">Footnote index number (1-based) displayed as the inline superscript.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">text</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">required</td>
              <td class="p-3 font-sans text-text-secondary">Full footnote body string displayed inside the interactive hover/focus popover.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">idPrefix</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">"fn"</td>
              <td class="p-3 font-sans text-text-secondary">HTML anchor identifier prefix used to target the corresponding list entry (e.g. #fn-1).</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
