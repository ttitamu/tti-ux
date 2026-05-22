<script setup lang="ts">
useHead({ title: "TuxAppFrame · TUX" });

const platform = useTuxPlatform();

const basicVue = `<tux-app-frame
  title="Landscape"
  eyebrow="research dashboard"
  :force-chrome="true"
/>`;

const withSlotsVue = `<tux-app-frame title="Landscape" :force-chrome="true">
  <template #left>
    <span class="font-bold text-brand-primary">TTI · Landscape</span>
  </template>
  <template #center>
    <UInput placeholder="Search…" icon="lucide:search" size="sm" />
  </template>
  <template #right>
    <UButton variant="ghost" icon="lucide:bell" />
    <UButton variant="ghost" icon="lucide:user" />
  </template>
</tux-app-frame>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · platform-aware chrome" title="TuxAppFrame">
      Custom Tauri titlebar with platform-correct window controls — traffic
      lights on macOS (top-left), min/max/close on Windows (top-right with
      native snap-layouts), close-only fallback on Linux. Hosts brand surfaces
      (eyebrow + title) and toolbar slots (#left / #center / #right).
      <br><br>
      <span class="text-sm text-text-muted">
        Detected host: <code>{{ platform.os }}</code> · Tauri:
        <code>{{ platform.tauri }}</code> · Modifier:
        <code>{{ platform.primaryModifier }}</code>. See
        <NuxtLink to="/design/platform-awareness" class="link-tti">platform-awareness doctrine</NuxtLink>.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic · platform-detected</p>
      <h2 class="heading--bold text-xl font-bold">Title + eyebrow only</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Renders platform-correct chrome based on the current host. Pass
        <code>forceChrome</code> to render the platform-correct chrome
        even outside Tauri (the showcase route does this so the controls
        are visible on plain web).
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <TuxAppFrame
          title="Landscape"
          eyebrow="research dashboard"
          :force-chrome="true"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">slots · brand + search + actions</p>
      <h2 class="heading--bold text-xl font-bold">All slots filled</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        <code>#left</code> for brand, <code>#center</code> for search /
        breadcrumbs, <code>#right</code> for toolbar items. The center
        slot stretches; left + right are content-width.
      </p>
      <TuxExample class="mt-4" :vue="withSlotsVue">
        <TuxAppFrame :force-chrome="true">
          <template #left>
            <span class="font-bold text-brand-primary">TTI · Landscape</span>
          </template>
          <template #center>
            <UInput placeholder="Search…" icon="lucide:search" size="sm" class="w-72" />
          </template>
          <template #right>
            <UButton variant="ghost" icon="lucide:bell" />
            <UButton variant="ghost" icon="lucide:user" />
          </template>
        </TuxAppFrame>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">when to use it</p>
      <h2 class="heading--bold text-xl font-bold">Tauri custom decoration</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        TuxAppFrame is for Tauri shells that disable native window decorations
        (<code>decorations: false</code> in <code>tauri.conf.json</code>) so
        the brand surface can host TUX content (eyebrow / display-face title /
        editorial chrome) inside the titlebar strip. On plain web, the frame
        renders without controls — useful as a top brand bar. See the
        platform-awareness doctrine for the constrained-use stance on Liquid
        Glass and Mica materials.
      </p>
    </section>
  </div>
</template>
