<script setup lang="ts">
import tuxSpectrumRibbonSource from "~/components/TuxSpectrumRibbon.vue?raw";

useHead({ title: "TuxSpectrumRibbon · TUX" });

const currentSize = ref<"xs" | "sm" | "md" | "lg" | "xl">("md");
const showLabels = ref(false);
const rounded = ref(false);

const sizes: Array<"xs" | "sm" | "md" | "lg" | "xl"> = ["xs", "sm", "md", "lg", "xl"];

const snippet = computed(() => {
  return `<TuxSpectrumRibbon
  size="${currentSize.value}"
  :show-labels="${showLabels.value}"
  :rounded="${rounded.value}"
/>`;
});
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader
      eyebrow="institutional identity"
      title="TuxSpectrumRibbon"
    >
      The 5-band institutional brand spectrum ribbon sampled from my.tti.tamu.edu and the TTI Communications redesign.
      Spans the five signature institutional colors: Aggie Maroon, Slate Blue, Slate Teal, Sage Green, and Warm Ochre Gold.
    </TuxPageHeader>

    <!-- Interactive Demo / Playground -->
    <section class="space-y-4">
      <TuxSectionHeader variant="two-tone-rule" title="INTERACTIVE" secondary-title="PLAYGROUND" />

      <div class="p-6 bg-surface-raised border border-surface-border space-y-6">
        <!-- Live Ribbon Display -->
        <div class="p-4 bg-surface-sunken border border-surface-border/60">
          <TuxSpectrumRibbon
            :size="currentSize"
            :show-labels="showLabels"
            :rounded="rounded"
          />
        </div>

        <!-- Controls -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-surface-border">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Ribbon Size</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="s in sizes"
                :key="s"
                type="button"
                class="px-2.5 py-1 text-xs font-mono uppercase border cursor-pointer transition-colors"
                :class="currentSize === s ? 'bg-brand-primary text-white border-brand-primary' : 'bg-surface-raised border-surface-border text-text-primary'"
                @click="currentSize = s"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Division Labels</label>
            <label class="inline-flex items-center gap-2 text-xs font-medium text-text-primary cursor-pointer">
              <input v-model="showLabels" type="checkbox" class="accent-brand-primary" />
              <span>Show Division Names (lg/xl)</span>
            </label>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Border Geometry</label>
            <label class="inline-flex items-center gap-2 text-xs font-medium text-text-primary cursor-pointer">
              <input v-model="rounded" type="checkbox" class="accent-brand-primary" />
              <span>Rounded Corners (rounded-md)</span>
            </label>
          </div>
        </div>

        <!-- Generated Snippet -->
        <div class="mt-4">
          <TuxCodeBlock :code="snippet" lang="vue" filename="Template Usage" />
        </div>
      </div>
    </section>

    <!-- Source Code Tab -->
    <section class="space-y-4">
      <TuxSectionHeader variant="two-tone-rule" title="COMPONENT" secondary-title="SOURCE" />
      <TuxCodeBlock :code="tuxSpectrumRibbonSource" lang="vue" filename="app/components/TuxSpectrumRibbon.vue" />
    </section>
  </div>
</template>
