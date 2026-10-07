<script setup lang="ts">
// /changelog — renders the repo's CHANGELOG.md as a navigable page.
import changelogSource from "../../CHANGELOG.md?raw";

useHead({ title: "Changelog · TUX" });

const { data: parsed } = await useAsyncData(
  "changelog",
  () => parseMarkdown(changelogSource),
);

const majorReleases = [
  { tag: "v3.0.1", date: "2026-10-07", id: "_301-2026-10-07", label: "Editorial Polish & Navigation", latest: true },
  { tag: "v3.0.0", date: "2026-10-01", id: "_300-2026-10-01", label: "Comm Brand & 100% Census" },
  { tag: "v2.2.0", date: "2026-09-08", id: "_220-2026-09-08", label: "Control Radius Standardization" },
  { tag: "v2.1.0", date: "2026-09-01", id: "_210-2026-09-01", label: "Navigation Restructure & Kits" },
  { tag: "v2.0.0", date: "2026-08-19", id: "_200-2026-08-19", label: "Multi-Language Monorepo" },
  { tag: "v1.8.0", date: "2026-07-30", id: "_180-2026-07-30", label: "Color Tokens & Themes" },
];
</script>

<template>
  <div class="space-y-8">
    <TuxBreadcrumbs :trail="[{ label: 'Home', to: '/' }, { label: 'Changelog' }]" />

    <TuxPageHeader eyebrow="releases" title="Changelog">
      Chronological release history documenting new components, accessibility enhancements,
      and architecture upgrades across all versions of TUX.
    </TuxPageHeader>

    <!-- Quick Milestone Navigation -->
    <div class="p-4 bg-surface-raised border border-surface-border rounded-md space-y-2">
      <p class="text-xs font-semibold text-text-muted uppercase tracking-wider">Major Release Milestones</p>
      <div class="flex flex-wrap gap-2">
        <a
          v-for="rel in majorReleases"
          :key="rel.tag"
          :href="'#' + rel.id"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded border border-surface-border bg-surface-sunken hover:border-brand-primary hover:text-brand-primary transition-colors text-text-primary"
        >
          <span class="font-bold">{{ rel.tag }}</span>
          <span class="text-text-muted font-sans hidden sm:inline">· {{ rel.label }}</span>
          <span v-if="rel.latest" class="px-1.5 py-0.5 text-[10px] rounded bg-brand-primary text-white font-sans font-semibold">latest</span>
        </a>
      </div>
    </div>

    <TuxProse>
      <MDCRenderer
        v-if="parsed"
        :body="parsed.body"
        :data="parsed.data"
      />
    </TuxProse>
  </div>
</template>
