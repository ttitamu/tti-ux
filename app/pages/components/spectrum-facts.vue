<script setup lang="ts">
import tuxSpectrumFactsSource from "~/components/TuxSpectrumFacts.vue?raw";

useHead({ title: "TuxSpectrumFacts · TUX" });

const currentTone = ref<"dark" | "light">("dark");
const showRibbon = ref(true);

const snippet = computed(() => {
  return `<TuxSpectrumFacts
  title="TTI AT A GLANCE"
  subtitle="Institutional research telemetry and workforce metrics"
  tone="${currentTone.value}"
  :show-top-ribbon="${showRibbon.value}"
/>`;
});
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader
      eyebrow="data display & metrics"
      title="TuxSpectrumFacts"
    >
      The 5-column institutional Quick Facts banner directly mapping the 5 spectrum division colors
      (Maroon, Blue, Teal, Green, Gold). Replicates the flagship telemetry block on my.tti.tamu.edu.
    </TuxPageHeader>

    <!-- Interactive Demo -->
    <section class="space-y-4">
      <TuxSectionHeader variant="two-tone-rule" title="INTERACTIVE" secondary-title="DEMO" />

      <div class="space-y-6">
        <TuxSpectrumFacts
          title="TTI AT A GLANCE"
          subtitle="Institutional research telemetry and workforce metrics"
          :tone="currentTone"
          :show-top-ribbon="showRibbon"
        />

        <div class="p-4 bg-surface-raised border border-surface-border flex flex-wrap items-center gap-6">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Surface Tone</label>
            <div class="flex gap-2">
              <button
                type="button"
                class="px-3 py-1 text-xs font-mono uppercase border cursor-pointer"
                :class="currentTone === 'dark' ? 'bg-[#232323] text-white border-black' : 'bg-surface-sunken text-text-primary border-surface-border'"
                @click="currentTone = 'dark'"
              >
                Dark (Intranet Parity)
              </button>
              <button
                type="button"
                class="px-3 py-1 text-xs font-mono uppercase border cursor-pointer"
                :class="currentTone === 'light' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-surface-sunken text-text-primary border-surface-border'"
                @click="currentTone = 'light'"
              >
                Light Surface
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Top Spectrum Ribbon</label>
            <label class="inline-flex items-center gap-2 text-xs font-medium text-text-primary cursor-pointer mt-1">
              <input v-model="showRibbon" type="checkbox" class="accent-brand-primary" />
              <span>Show 5-Band Top Ribbon</span>
            </label>
          </div>
        </div>

        <TuxCodeBlock :code="snippet" lang="vue" filename="Template Usage" />
      </div>
    </section>

    <!-- Source Code Tab -->
    <section class="space-y-4">
      <TuxSectionHeader variant="two-tone-rule" title="COMPONENT" secondary-title="SOURCE" />
      <TuxCodeBlock :code="tuxSpectrumFactsSource" lang="vue" filename="app/components/TuxSpectrumFacts.vue" />
    </section>
  </div>
</template>
