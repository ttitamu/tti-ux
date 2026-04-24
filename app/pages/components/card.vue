<script setup lang="ts">
useHead({ title: "TuxCard · tti-ux" });
</script>

<template>
  <div class="space-y-10">
    <section>
      <p class="eyebrow">component</p>
      <h1 class="heading--bold text-3xl font-bold">TuxCard</h1>
      <p class="mt-3 max-w-2xl text-text-secondary">
        A static branded block, or pass <code>to</code> and it becomes a <code>NuxtLink</code>
        with corner-drop choreography — the card shifts +6/-6px on hover and an arrow
        fades in at the top-right. The 2px maroon border is load-bearing, so we don't
        wrap <code>UCard</code>.
      </p>
    </section>

    <section>
      <p class="eyebrow">static</p>
      <h2 class="heading--bold text-xl font-bold">Without `to`</h2>
      <div class="mt-4">
        <TuxCard>
          <p class="eyebrow">scan · 2026-04-22</p>
          <h3 class="text-xl font-bold">Q1 research grants</h3>
          <p class="mt-2 text-sm text-text-secondary">
            Static card — no hover motion. Use for summary blocks inside a page.
          </p>
        </TuxCard>
      </div>
    </section>

    <section>
      <p class="eyebrow">linked</p>
      <h2 class="heading--bold text-xl font-bold">With `to`</h2>
      <p class="text-sm text-text-secondary mb-3">
        Hover to see the corner-drop + arrow. The destination (/tokens) works —
        click to navigate back.
      </p>
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
    </section>

    <section>
      <p class="eyebrow">usage</p>
      <h2 class="heading--bold text-xl font-bold">Source</h2>
      <pre class="mt-3 p-4 rounded-md bg-surface-sunken text-xs font-mono overflow-auto border border-surface-border"><code>&lt;tux-card to="/scans/7f5bd95"&gt;
  &lt;p class="eyebrow"&gt;scan · 2026-04-22&lt;/p&gt;
  &lt;h3&gt;Q1 research grants&lt;/h3&gt;
&lt;/tux-card&gt;</code></pre>
    </section>
  </div>
</template>
