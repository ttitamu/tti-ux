<script setup lang="ts">
/**
 * /components/acknowledgments — Dedicated showcase for TuxAcknowledgments.
 */
useHead({ title: "TuxAcknowledgments · Components · TUX" });

const sampleFunding = [
  { funder: "Federal Highway Administration (FHWA)", grant: "HRDS-30-2022-04", url: "https://highways.dot.gov" },
  { funder: "Texas Department of Transportation (TxDOT)", grant: "0-7042", url: "https://www.txdot.gov" },
];

const sampleAcknowledgments = "The authors thank the TTI Connected Infrastructure and Field Operations teams — Jordan Kim, Mariana Vega, and Daniel Park — for sensor calibration and real-time telemetry verification across the 36-month pilot deployment.";

const sampleConflicts = "The authors declare no competing financial or non-financial interests regarding the findings or technical recommendations of this study.";

const sampleEthics = "All field sensor testing protocols were conducted in compliance with Texas A&M Institutional Review Board standards (IRB-2022-0418). Aggregated speed and volume telemetry are available through the TTI Open Data Registry; individual vehicle broadcast trajectories are withheld to preserve motorist privacy.";

const sampleVue = `<TuxAcknowledgments
  :funding="[
    { funder: 'Federal Highway Administration (FHWA)', grant: 'HRDS-30-2022-04', url: 'https://highways.dot.gov' },
    { funder: 'Texas Department of Transportation (TxDOT)', grant: '0-7042' },
  ]"
  acknowledgments="The authors thank the TTI Connected Infrastructure and Field Operations teams..."
  conflicts="The authors declare no competing financial or non-financial interests..."
  ethics="All field sensor testing protocols were conducted in compliance with Texas A&M IRB standards..."
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · research & publishing" title="TuxAcknowledgments">
      Standard academic disclosure block supporting sponsor grant references, collaborator
      acknowledgments, conflict of interest statements, and IRB ethical oversight notices.
    </TuxPageHeader>

    <!-- Interactive Showcase -->
    <section class="space-y-4">
      <div>
        <p class="eyebrow">interactive showcase</p>
        <h2 class="heading--bold text-xl font-bold">Research Disclosure Block</h2>
      </div>

      <div class="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-xs space-y-4">
        <TuxAcknowledgments
          :level="3"
          :funding="sampleFunding"
          :acknowledgments="sampleAcknowledgments"
          :conflicts="sampleConflicts"
          :ethics="sampleEthics"
        />
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
              <td class="p-3 font-semibold text-brand-primary">funding</td>
              <td class="p-3 text-text-secondary">FundingEntry[]</td>
              <td class="p-3 text-text-muted">[]</td>
              <td class="p-3 font-sans text-text-secondary">Array of funding entities with grant/contract numbers and external agency links.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">acknowledgments</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">undefined</td>
              <td class="p-3 font-sans text-text-secondary">Narrative text recognizing technical support, research staff, or facilities.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">conflicts</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">undefined</td>
              <td class="p-3 font-sans text-text-secondary">Conflict of interest declarations ("None declared" or disclosures).</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">ethics</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">undefined</td>
              <td class="p-3 font-sans text-text-secondary">Human subject review (IRB), privacy disclosures, and open-data access criteria.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
