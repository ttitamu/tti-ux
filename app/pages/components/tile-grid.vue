<script setup lang="ts">
import tuxTileGridSource from "~/components/TuxTileGrid.vue?raw";

useHead({ title: "TuxTileGrid · TUX" });

const currentCols = ref<2 | 3 | 4>(3);
const currentSurface = ref<"eggshell" | "raised">("eggshell");

const snippet = computed(() => {
  return `<TuxTileGrid
  title="TTI FUNDAMENTALS"
  subtitle="Core operational standards and service launchers"
  surface="${currentSurface.value}"
  :columns="${currentCols.value}"
/>`;
});
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader
      eyebrow="navigation & service launch"
      title="TuxTileGrid"
    >
      The 6-tile service and fundamentals launcher grid from my.tti.tamu.edu.
      Features maroon icon headers, bold uppercase titles, descriptive copy, and warm gold indicators.
    </TuxPageHeader>

    <!-- Interactive Demo -->
    <section class="space-y-4">
      <TuxSectionHeader variant="two-tone-rule" title="INTERACTIVE" secondary-title="GRID" />

      <div class="p-6 bg-surface-raised border border-surface-border space-y-6">
        <TuxTileGrid
          title="TTI FUNDAMENTALS"
          subtitle="Core operational standards, ethics, and employee service launchers"
          :surface="currentSurface"
          :columns="currentCols"
        />

        <div class="pt-4 border-t border-surface-border flex flex-wrap items-center gap-6">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Columns</label>
            <div class="flex gap-2">
              <button
                v-for="c in [2, 3, 4] as const"
                :key="c"
                type="button"
                class="px-3 py-1 text-xs font-mono uppercase border cursor-pointer"
                :class="currentCols === c ? 'bg-brand-primary text-white border-brand-primary' : 'bg-surface-sunken text-text-primary border-surface-border'"
                @click="currentCols = c"
              >
                {{ c }} Cols
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Surface Style</label>
            <div class="flex gap-2">
              <button
                type="button"
                class="px-3 py-1 text-xs font-mono uppercase border cursor-pointer"
                :class="currentSurface === 'eggshell' ? 'bg-[#500000] text-white border-brand-primary' : 'bg-surface-sunken text-text-primary border-surface-border'"
                @click="currentSurface = 'eggshell'"
              >
                Eggshell (#F9F9F7)
              </button>
              <button
                type="button"
                class="px-3 py-1 text-xs font-mono uppercase border cursor-pointer"
                :class="currentSurface === 'raised' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-surface-sunken text-text-primary border-surface-border'"
                @click="currentSurface = 'raised'"
              >
                White Raised
              </button>
            </div>
          </div>
        </div>

        <TuxCodeBlock :code="snippet" lang="vue" filename="Template Usage" />
      </div>
    </section>

    <!-- Source Code Tab -->
    <section class="space-y-4">
      <TuxSectionHeader variant="two-tone-rule" title="COMPONENT" secondary-title="SOURCE" />
      <TuxCodeBlock :code="tuxTileGridSource" lang="vue" filename="app/components/TuxTileGrid.vue" />
    </section>
  </div>
</template>
