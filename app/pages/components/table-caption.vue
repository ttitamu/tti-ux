<script setup lang="ts">
/**
 * /components/table-caption — Dedicated showcase for TuxTableCaption.
 */
useHead({ title: "TuxTableCaption · Components · TUX" });

const tableNumber = ref("3");
const tableCaption = ref("Estimated regression parameters for variable speed limit compliance under rain conditions.");
const sourceCredit = ref("Models fitted on 48,000 detector scans across Texas I-35 test corridor.");

const sampleVue = `<TuxTableCaption
  number="3"
  caption="Estimated regression parameters for variable speed limit compliance under rain conditions."
  source="Models fitted on 48,000 detector scans across Texas I-35 test corridor."
  placement="above"
>
  <table class="w-full text-left text-xs border border-surface-border">
    <!-- Table head and body -->
  </table>
</TuxTableCaption>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · research & publishing" title="TuxTableCaption">
      Academic table caption container with conventional top-caption placement
      (<code>placement="above"</code>), numbered labels, and statistical footnote credits.
    </TuxPageHeader>

    <!-- Interactive Showcase -->
    <section class="space-y-4">
      <div>
        <p class="eyebrow">interactive showcase</p>
        <h2 class="heading--bold text-xl font-bold">Captioned Research Table</h2>
      </div>

      <div class="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-xs space-y-4">
        <TuxTableCaption
          :number="tableNumber"
          :caption="tableCaption"
          :source="sourceCredit"
          placement="above"
        >
          <div class="overflow-x-auto rounded-lg border border-surface-border">
            <table class="w-full text-left text-xs">
              <thead class="bg-surface-sunken font-mono text-[11px] font-semibold text-text-secondary uppercase border-b border-surface-border">
                <tr>
                  <th class="p-3">Variable</th>
                  <th class="p-3">Coefficient (β)</th>
                  <th class="p-3">Std. Error</th>
                  <th class="p-3">t-statistic</th>
                  <th class="p-3">p-value</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-border font-mono text-text-primary">
                <tr class="hover:bg-surface-sunken/40">
                  <td class="p-3 font-sans font-medium">Dynamic VSL Display</td>
                  <td class="p-3 text-status-success font-semibold">-4.82 mph</td>
                  <td class="p-3 text-text-muted">0.42</td>
                  <td class="p-3">-11.47</td>
                  <td class="p-3 text-brand-primary font-bold">&lt; 0.001</td>
                </tr>
                <tr class="hover:bg-surface-sunken/40">
                  <td class="p-3 font-sans font-medium">Precipitation (&gt; 0.1 in/hr)</td>
                  <td class="p-3 text-status-warn font-semibold">-2.15 mph</td>
                  <td class="p-3 text-text-muted">0.38</td>
                  <td class="p-3">-5.65</td>
                  <td class="p-3 text-brand-primary font-bold">&lt; 0.001</td>
                </tr>
                <tr class="hover:bg-surface-sunken/40">
                  <td class="p-3 font-sans font-medium">Heavy Vehicle Share (&gt; 15%)</td>
                  <td class="p-3 text-text-secondary">-1.04 mph</td>
                  <td class="p-3 text-text-muted">0.29</td>
                  <td class="p-3">-3.58</td>
                  <td class="p-3">0.002</td>
                </tr>
              </tbody>
            </table>
          </div>
        </TuxTableCaption>
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
              <td class="p-3 font-semibold text-brand-primary">number</td>
              <td class="p-3 text-text-secondary">number | string</td>
              <td class="p-3 text-text-muted">required</td>
              <td class="p-3 font-sans text-text-secondary">Table identifier index (e.g. 1, 2, 'A.1').</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">caption</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">undefined</td>
              <td class="p-3 font-sans text-text-secondary">Main title or description of the tabular data.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">placement</td>
              <td class="p-3 text-text-secondary">"above" | "below"</td>
              <td class="p-3 text-text-muted">"above"</td>
              <td class="p-3 font-sans text-text-secondary">Defaults to "above" per academic style guides (APA, IEEE).</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">source</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">undefined</td>
              <td class="p-3 font-sans text-text-secondary">Source citation or statistical significance legend.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
