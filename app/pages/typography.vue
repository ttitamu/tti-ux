<script setup lang="ts">
useHead({ title: "Typography · tti-ux" });
</script>

<template>
  <div class="space-y-12">
    <section>
      <p class="eyebrow">foundations</p>
      <h1 class="heading--bold text-3xl font-bold">Typography</h1>
      <p class="mt-3 max-w-2xl text-text-secondary">
        Public Sans as the body+display face, JetBrains Mono for IDs and paths. The
        <code>heading--bold</code> and <code>heading--display</code> utilities add the
        signature gold bar — opt-in, not applied to every heading in app chrome.
      </p>
    </section>

    <section>
      <p class="eyebrow">display heading</p>
      <h2 class="heading--bold text-xl font-bold">heading--display</h2>
      <p class="text-sm text-text-secondary mb-4">
        Editorial-maximalist variant — italic + uppercase + extrabold + gold bar. Used
        sparingly for landing copy.
      </p>
      <h1 class="heading--display text-5xl">Texas A&amp;M Transportation Institute</h1>
    </section>

    <section>
      <p class="eyebrow">section heading</p>
      <h2 class="heading--bold text-xl font-bold">heading--bold</h2>
      <p class="text-sm text-text-secondary mb-4">
        The workhorse — section titles and editorial callouts. Shorter bar, upright weight.
      </p>
      <h2 class="heading--bold text-3xl font-bold">Q1 research grants</h2>
    </section>

    <section>
      <p class="eyebrow">meta labels</p>
      <h2 class="heading--bold text-xl font-bold">Eyebrow &amp; subhead</h2>
      <div class="mt-4 space-y-4">
        <div>
          <p class="eyebrow">eyebrow · before</p>
          <h3 class="text-xl font-semibold">Scan 7f5bd95a</h3>
        </div>
        <div>
          <h3 class="text-xl font-semibold">Scan 7f5bd95a</h3>
          <p class="subhead">subhead · after</p>
        </div>
      </div>
    </section>

    <section>
      <p class="eyebrow">body copy</p>
      <h2 class="heading--bold text-xl font-bold">Paragraphs &amp; inline</h2>
      <div class="mt-4 max-w-2xl space-y-4 text-text-primary leading-relaxed">
        <p>
          The quick brown fox jumps over the lazy dog. Public Sans ships with
          OpenType features <code>ss01</code> and <code>cv11</code> enabled by default
          in globals.css — so digit shapes and the lowercase 'a' render with slightly
          more geometric treatment. Inline links like
          <a href="#" class="link-tti">this one</a> render in TTI navy with a subtle
          dotted underline until hover.
        </p>
        <p>
          Use <code>font-mono</code> for IDs, paths, and hashes — for example
          <code class="font-mono text-sm bg-surface-sunken px-1.5 py-0.5 rounded">7f5bd95a-2c24-4cde</code> —
          so they don't get confused with editorial copy.
        </p>
      </div>
    </section>

    <section>
      <p class="eyebrow">scale</p>
      <h2 class="heading--bold text-xl font-bold">Type scale</h2>
      <div class="mt-4 space-y-2">
        <div class="text-5xl">text-5xl · Display</div>
        <div class="text-4xl">text-4xl · Page title</div>
        <div class="text-3xl">text-3xl · Section</div>
        <div class="text-2xl">text-2xl · Subsection</div>
        <div class="text-xl">text-xl · Card heading</div>
        <div class="text-lg">text-lg · Lede</div>
        <div class="text-base">text-base · Body</div>
        <div class="text-sm">text-sm · Meta</div>
        <div class="text-xs">text-xs · Caption</div>
      </div>
    </section>
  </div>
</template>
