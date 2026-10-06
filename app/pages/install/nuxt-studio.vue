<script setup lang="ts">
useHead({ title: "Nuxt Studio & Visual Authoring · TUX" });

const cloneCmd = `git clone https://github.com/ttitamu/tux-starter-content.git my-microsite
cd my-microsite
npm install
npm run dev`;

const mdcSnippet = `---
title: Connected Corridors Study
description: Field operational findings from Interstate 35.
---

::tux-page-header{eyebrow="Research Report" title="Connected Corridors Study"}
Summary of empirical V2X broadcast metrics.
::

::tux-big-stat{value="21.4" suffix=" ms" label="Broadcast Latency" tone="maroon"}
::

::tux-card
### Methodological Overview
Sensor fusion nodes captured over 14 million timestamped vehicle passes.
::`;
</script>

<template>
  <div class="space-y-8">
    <TuxBreadcrumbs :trail="[{ label: 'Home', to: '/' }, { label: 'Install', to: '/install' }, { label: 'Nuxt Studio' }]" />

    <TuxPageHeader eyebrow="Target · Visual Authoring" title="Using TUX with Nuxt Studio">
      Visual, Git-backed content editing for researchers and marcom teams. Build microsites, papers, and lab portals without writing code.
    </TuxPageHeader>

    <section class="space-y-3">
      <TuxSectionHeader title="1. The Turnkey Starter Template" />
      <p class="text-sm text-text-secondary">
        Spin up a new content site using the <code>tux-starter-content</code> template (located at <code>templates/tux-starter-content</code>):
      </p>
      <TuxCodeBlock :code="cloneCmd" language="sh" filename="terminal" />
    </section>

    <section class="space-y-3">
      <TuxSectionHeader title="2. Visual In-Browser Editing" />
      <p class="text-sm text-text-secondary leading-relaxed">
        Connect your repository to <a href="https://nuxt.studio" target="_blank" rel="noopener" class="text-brand-primary underline">Nuxt Studio</a>.
        Non-technical authors can navigate the live site preview, edit copy, insert TUX components via the <code>/</code> block inserter, and customize component props (tones, variants, sizes) in the visual sidebar panel.
      </p>
    </section>

    <section class="space-y-3">
      <TuxSectionHeader title="3. Markdown (MDC) Syntax" />
      <p class="text-sm text-text-secondary">
        Under the hood, Studio edits clean Markdown and MDC components:
      </p>
      <TuxCodeBlock :code="mdcSnippet" language="md" filename="content/index.md" />
    </section>

    <section class="space-y-3">
      <TuxSectionHeader title="4. Zero-Server Static Deployment" />
      <p class="text-sm text-text-secondary leading-relaxed">
        When an author publishes, Nuxt Studio commits to Git. Continuous integration (GitHub Actions / Forgejo CI) generates 100% static HTML, deployable directly to GitHub Pages, Forgejo Pages, or Cloudflare Pages with zero database vulnerabilities.
      </p>
    </section>
  </div>
</template>
