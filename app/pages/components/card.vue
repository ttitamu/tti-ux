<script setup lang="ts">
useHead({ title: "TuxCard · tti-ux" });

const staticVue = `<tux-card>
  <p class="eyebrow">scan · 2026-04-22</p>
  <h3 class="text-xl font-bold">Q1 research grants</h3>
  <p class="mt-2 text-sm text-text-secondary">
    Static card — no hover motion. Use for summary blocks inside a page.
  </p>
</tux-card>`;

const linkedVue = `<tux-card to="/tokens">
  <p class="eyebrow">foundations</p>
  <h3 class="text-xl font-bold">Browse tokens</h3>
  <p class="mt-2 text-sm text-text-secondary">
    Every CSS variable the system exposes.
  </p>
</tux-card>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxCard">
      A static branded block, or pass <code>to</code> and it becomes a <code>NuxtLink</code>
      with corner-drop choreography — the card shifts +6/-6px on hover and an arrow
      fades in at the top-right. The 2px maroon border is load-bearing, so we don't
      wrap <code>UCard</code>.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">static</p>
      <h2 class="heading--bold text-xl font-bold">Without `to`</h2>
      <TuxExample class="mt-4" :vue="staticVue">
        <TuxCard>
          <p class="eyebrow">scan · 2026-04-22</p>
          <h3 class="text-xl font-bold">Q1 research grants</h3>
          <p class="mt-2 text-sm text-text-secondary">
            Static card — no hover motion. Use for summary blocks inside a page.
          </p>
        </TuxCard>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">linked</p>
      <h2 class="heading--bold text-xl font-bold">With `to`</h2>
      <p class="text-sm text-text-secondary mb-3">
        Hover to see the corner-drop + arrow. The destination (/tokens) works —
        click to navigate back.
      </p>
      <TuxExample :vue="linkedVue">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TuxCard to="/tokens">
            <p class="eyebrow">foundations</p>
            <h3 class="text-xl font-bold">Browse tokens</h3>
            <p class="mt-2 text-sm text-text-secondary">
              Every CSS variable the system exposes.
            </p>
          </TuxCard>
          <TuxCard to="/typography">
            <p class="eyebrow">foundations</p>
            <h3 class="text-xl font-bold">Typography</h3>
            <p class="mt-2 text-sm text-text-secondary">
              The heading utilities + scale in context.
            </p>
          </TuxCard>
        </div>
      </TuxExample>
    </section>
  </div>
</template>
