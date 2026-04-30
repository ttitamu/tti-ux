<script setup lang="ts">
useHead({ title: "TuxContextPanel · TUX" });

const basicVue = `<tux-context-panel>
  <tux-section-header level="3" subtitle="Docs the model will ground answers against.">
    CORPUS
  </tux-section-header>
  <ul>
    <li><code>tti-corridors</code> — 1,204 docs</li>
    <li><code>tti-research</code> — 312 docs</li>
    <li><code>txdot-rule-43</code> — 1 doc · §31.12</li>
  </ul>

  <tux-section-header level="3" subtitle="What the retriever will surface.">
    RETRIEVAL
  </tux-section-header>
  <dl>
    <dt>top-k</dt>     <dd>8</dd>
    <dt>min-score</dt> <dd>0.72</dd>
    <dt>rerank</dt>    <dd>cohere-v3</dd>
  </dl>
</tux-context-panel>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · chat" title="TuxContextPanel">
      Right-rail surface for the assistant's grounding context — corpora
      attached, retrieval settings, usage metrics. Slot-driven; the
      panel contributes the chrome (border, scroll, width, padding) and
      the host arranges sections inside. Pair with <code>TuxSectionHeader</code>
      for editorial rhythm.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Three-zone panel</h2>
      <TuxExample class="mt-4" :vue="basicVue">
        <div class="border border-surface-border rounded-md overflow-hidden" style="height: 480px; display: flex; justify-content: flex-end;">
          <TuxContextPanel>
            <TuxSectionHeader :level="3" subtitle="Docs the model will ground answers against.">
              CORPUS
            </TuxSectionHeader>
            <ul class="text-sm text-text-secondary leading-relaxed">
              <li><code>tti-corridors</code> — 1,204 docs</li>
              <li><code>tti-research</code> — 312 docs</li>
              <li><code>txdot-rule-43</code> — 1 doc · §31.12</li>
            </ul>
            <TuxSectionHeader :level="3" subtitle="What the retriever will surface.">
              RETRIEVAL
            </TuxSectionHeader>
            <dl class="text-sm text-text-secondary leading-relaxed grid grid-cols-2 gap-y-1">
              <dt>top-k</dt>     <dd class="text-right font-mono">8</dd>
              <dt>min-score</dt> <dd class="text-right font-mono">0.72</dd>
              <dt>rerank</dt>    <dd class="text-right font-mono">cohere-v3</dd>
            </dl>
          </TuxContextPanel>
        </div>
      </TuxExample>
    </section>
  </div>
</template>
