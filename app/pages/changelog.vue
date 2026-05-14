<script setup lang="ts">
// /changelog — renders the repo's CHANGELOG.md as a navigable page.
//
// Same pipeline as /design/[doc] — markdown imported as raw text at
// build time via Vite's ?raw query, parsed at SSR via parseMarkdown
// so fenced code blocks ship pre-highlighted through Shiki. The
// prose typography is provided by `<TuxProse>` (the same wrapper
// /design/[doc] uses), so both pages stay in lock-step automatically.
import changelogSource from "../../CHANGELOG.md?raw";

useHead({ title: "Changelog · TUX" });

const { data: parsed } = await useAsyncData(
  "changelog",
  () => parseMarkdown(changelogSource),
);
</script>

<template>
  <div class="space-y-8">
    <TuxPageHeader eyebrow="release log" title="Changelog">
      Versioned record of what's shipped — components added, doctrine
      changes, breaking adjustments. Follows
      <a href="https://keepachangelog.com/" target="_blank" rel="noopener" class="link-tti">Keep a Changelog</a>
      conventions and
      <a href="https://semver.org/" target="_blank" rel="noopener" class="link-tti">Semantic Versioning</a>.
      The canonical source is
      <a href="https://github.com/anthonyguevara/tti-ux-test/blob/main/CHANGELOG.md" target="_blank" rel="noopener" class="link-tti">CHANGELOG.md</a>
      in the repo; this page is just a friendlier read of it.
    </TuxPageHeader>

    <TuxProse>
      <MDCRenderer
        v-if="parsed"
        :body="parsed.body"
        :data="parsed.data"
      />
    </TuxProse>
  </div>
</template>
