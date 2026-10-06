<script setup lang="ts">
import tuxCapabilityClusterSource from "~/components/TuxCapabilityCluster.vue?raw";

useHead({ title: "TuxCapabilityCluster · TUX" });

const currentCols = ref<2 | 3>(3);

const snippet = `<TuxCapabilityCluster
  title="RESEARCH CAPABILITIES"
  kicker="Multidisciplinary Excellence"
  subtitle="TTI operations span specialized proving grounds, high-performance simulation laboratories, and field testing facilities."
  :columns="3"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader
      eyebrow="marcom & research pillars"
      title="TuxCapabilityCluster"
    >
      The signature capability medallions from tti.tamu.edu/capabilities.
      Features dark circular medallions with vector icons enveloped in concentric Warm Gold and Maroon orbital halos.
    </TuxPageHeader>

    <!-- Interactive Demo -->
    <section class="space-y-4">
      <TuxSectionHeader variant="two-tone-rule" title="ORBITAL" secondary-title="CLUSTER DEMO" />

      <div class="space-y-6">
        <TuxCapabilityCluster
          title="RESEARCH CAPABILITIES"
          kicker="Multidisciplinary Excellence"
          subtitle="TTI operations span specialized proving grounds, high-performance simulation laboratories, and field testing facilities."
          :columns="currentCols"
        />

        <div class="p-4 bg-surface-raised border border-surface-border flex items-center justify-between">
          <label class="block text-xs font-bold uppercase tracking-wider text-text-muted">Columns</label>
          <div class="flex gap-2">
            <button
              v-for="c in [2, 3] as const"
              :key="c"
              type="button"
              class="px-3 py-1 text-xs font-mono uppercase border cursor-pointer"
              :class="currentCols === c ? 'bg-brand-primary text-white border-brand-primary' : 'bg-surface-sunken text-text-primary border-surface-border'"
              @click="currentCols = c"
            >
              {{ c }} Columns
            </button>
          </div>
        </div>

        <TuxCodeBlock :code="snippet" lang="vue" filename="Template Usage" />
      </div>
    </section>

    <!-- Source Code Tab -->
    <section class="space-y-4">
      <TuxSectionHeader variant="two-tone-rule" title="COMPONENT" secondary-title="SOURCE" />
      <TuxCodeBlock :code="tuxCapabilityClusterSource" lang="vue" filename="app/components/TuxCapabilityCluster.vue" />
    </section>
  </div>
</template>
