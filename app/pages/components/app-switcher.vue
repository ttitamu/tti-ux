<script setup lang="ts">
useHead({ title: "TuxAppSwitcher · TUX" });

const apps = [
  {
    id: "tux",
    name: "TUX style guide",
    tagline: "You are here — TTI design system docs",
    icon: "lucide:palette",
    to: "/",
    current: true,
  },
  {
    id: "landscape",
    name: "Landscape",
    tagline: "Research dashboard · runs, corpora, KPIs",
    icon: "lucide:map",
    to: "https://landscape.tti.tamu.edu",
    target: "_blank" as const,
  },
  {
    id: "ai-studio",
    name: "AI Studio",
    tagline: "Conversational research assistant",
    icon: "lucide:bot",
    to: "https://ai.tti.tamu.edu",
    target: "_blank" as const,
  },
  {
    id: "tti-www",
    name: "TTI public site",
    tagline: "Reports, news, programs",
    icon: "lucide:globe",
    to: "https://tti.tamu.edu",
    target: "_blank" as const,
  },
];

const basicVue = `<tux-app-switcher :apps="apps" />`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · platform-aware chrome" title="TuxAppSwitcher">
      Waffle-button trigger + popover grid for hopping between TTI's
      consumer apps (Landscape ↔ AI Studio ↔ TUX docs ↔ future).
      Lives in <code>TuxAppFrame</code>'s <code>#right</code> slot
      on Tauri shells or in <code>TuxSiteNav</code>'s utility row on
      plain-web consumers. Source: Microsoft Fabric "Suite header"
      absorption.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic · four apps</p>
      <h2 class="heading--bold text-xl font-bold">Click the waffle</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        The button below opens a popover with a 2-column grid of app
        tiles. The "current app" tile is visually disabled and
        carries <code>aria-current="page"</code>. Below ~30rem
        width the grid drops to one column.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <div class="flex justify-start p-4 rounded-md border border-surface-border bg-surface-sunken">
          <TuxAppSwitcher
            :apps="apps"
            footer-text="Need access to another app? Email it-support@tti.tamu.edu."
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">composition</p>
      <h2 class="heading--bold text-xl font-bold">Place it where it belongs</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        On <code>TuxAppFrame</code>, drop the switcher in the
        <code>#right</code> slot alongside user-menu and
        notifications. On <code>TuxSiteNav</code>, place it in the
        utility row before TuxIdentity. Single instance per app —
        not a navigation pattern, an inter-app handoff.
      </p>
    </section>
  </div>
</template>
