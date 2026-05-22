<script setup lang="ts">
useHead({ title: "TuxSplashScreen · TUX" });

const splashOpen = ref(false);
let splashTimer: ReturnType<typeof setTimeout> | null = null;

function showSplash() {
  splashOpen.value = true;
  if (splashTimer) clearTimeout(splashTimer);
  splashTimer = setTimeout(() => {
    splashOpen.value = false;
  }, 1800);
}

onBeforeUnmount(() => {
  if (splashTimer) clearTimeout(splashTimer);
});

// `loaded` is the inverse of "show splash" — when loaded becomes true, splash hides.
const loaded = computed(() => !splashOpen.value);

const basicVue = `<tux-splash-screen :loaded="appReady" />`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · platform-aware chrome" title="TuxSplashScreen">
      Branded app-launch overlay for Tauri shells. Shown while the
      WebView mounts the Vue app and any first-paint data loads. Covers
      the viewport with the TTI brand mark + maroon hairline + optional
      status text. Fades out when <code>loaded</code> flips true (with a
      short delay to let Tauri's window-show event settle).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Default brand mark</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Click below to preview the splash for ~1.8 seconds. In a real
        Tauri shell, host the splash from <code>app.vue</code> and bind
        <code>loaded</code> to your "app-ready" signal (Pinia store,
        first API response, etc.).
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <UButton @click="showSplash">Preview splash</UButton>
        <TuxSplashScreen :loaded="loaded" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">with status + footer</p>
      <h2 class="heading--bold text-xl font-bold">Custom copy</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Override the default "Loading…" status with anything load-stage-
        specific ("Connecting to TTI data…"). Use the <code>#footer</code>
        slot for a version pill or build hash.
      </p>
      <UAlert
        color="info"
        icon="lucide:info"
        title="Showcase note"
        description="The splash above is the same component instance; preview it via the button to see the alternate status copy."
      />
    </section>

    <section>
      <p class="eyebrow">accessibility</p>
      <h2 class="heading--bold text-xl font-bold">aria-busy + reduced motion</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        The splash sets <code>role="status"</code> +
        <code>aria-busy="true"</code> + <code>aria-live="polite"</code>
        so assistive tech announces the app-loading state. With
        <code>prefers-reduced-motion: reduce</code>, the fade collapses
        to a near-instant transition (80ms).
      </p>
    </section>
  </div>
</template>
