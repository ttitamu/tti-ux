<script setup lang="ts">
/**
 * /components/abstract — Dedicated showcase for TuxAbstract.
 */
useHead({ title: "TuxAbstract · Components · TUX" });

const variant = ref<"structured" | "prose">("structured");

const backgroundText = "Connected vehicle (CV) pilot programs frequently observe short-term compliance gains that decay once driver novelty subsides. This study evaluates whether roadside infrastructure-cues produce enduring speed harmonization across multi-lane arterial work zones.";
const methodsText = "We deployed roadside sensing units and dynamic variable speed limit (VSL) trailers across 12 rural intersection treatments over a 36-month observational period, tracking 1.4 million vehicle trajectories against matched baseline controls.";
const resultsText = "Speed variance decreased by 18.4% (p < 0.001) during active queue conditions, and compliance remained stable throughout the 3-year observation window with no evidence of longitudinal behavioral regression.";
const conclusionText = "Infrastructure-cue interventions provide durable safety benefits that resist the novelty-decay effects commonly documented in purely in-vehicle advisory deployments.";

const keywords = ["Connected vehicles", "Speed harmonization", "Work zone safety", "Variable speed limits", "Infrastructure-cues"];

const sampleVue = computed(() => `<TuxAbstract
  variant="${variant.value}"
  background="${backgroundText}"
  methods="${methodsText}"
  results="${resultsText}"
  conclusion="${conclusionText}"
  :keywords="['Connected vehicles', 'Speed harmonization', 'Work zone safety', 'Variable speed limits', 'Infrastructure-cues']"
/>`);
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · research & publishing" title="TuxAbstract">
      Structured academic abstract block supporting standard IMRaD section eyebrows
      (Background, Methods, Results, Conclusion), legacy continuous prose mode, and keyword tag clusters.
    </TuxPageHeader>

    <!-- Interactive Showcase -->
    <section class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p class="eyebrow">interactive showcase</p>
          <h2 class="heading--bold text-xl font-bold">Abstract Layouts</h2>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-3 text-xs bg-surface-sunken p-2 rounded-lg border border-surface-border">
          <div class="flex items-center gap-1.5">
            <span class="text-text-muted">Mode:</span>
            <select
              v-model="variant"
              aria-label="Abstract render mode"
              class="bg-surface-raised border border-surface-border rounded px-1.5 py-0.5 text-xs text-text-primary"
            >
              <option value="structured">structured (IMRaD)</option>
              <option value="prose">prose (continuous)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div class="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-xs space-y-4">
        <TuxAbstract
          :variant="variant"
          :level="3"
          :background="backgroundText"
          :methods="methodsText"
          :results="resultsText"
          :conclusion="conclusionText"
          :keywords="keywords"
        />
      </div>
    </section>

    <!-- Code Snippet -->
    <section class="space-y-3">
      <p class="eyebrow">usage syntax</p>
      <h2 class="heading--bold text-xl font-bold">Code snippet</h2>
      <TuxCodeBlock :code="sampleVue" lang="vue" />
    </section>

    <!-- Props Table -->
    <section class="space-y-3">
      <p class="eyebrow">api reference</p>
      <h2 class="heading--bold text-xl font-bold">Props</h2>
      <div class="overflow-x-auto rounded-lg border border-surface-border">
        <table class="w-full text-left text-sm">
          <thead class="bg-surface-sunken text-xs font-mono font-semibold text-text-secondary uppercase border-b border-surface-border">
            <tr>
              <th class="p-3">Prop</th>
              <th class="p-3">Type</th>
              <th class="p-3">Default</th>
              <th class="p-3">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-border font-mono text-xs">
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">variant</td>
              <td class="p-3 text-text-secondary">"structured" | "prose"</td>
              <td class="p-3 text-text-muted">"structured"</td>
              <td class="p-3 font-sans text-text-secondary">Structured eyebrows per section vs single flowing paragraph.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">background / methods / results / conclusion</td>
              <td class="p-3 text-text-secondary">string</td>
              <td class="p-3 text-text-muted">undefined</td>
              <td class="p-3 font-sans text-text-secondary">Individual section text contents formatted with appropriate typographic rhythm.</td>
            </tr>
            <tr class="hover:bg-surface-sunken/40">
              <td class="p-3 font-semibold text-brand-primary">keywords</td>
              <td class="p-3 text-text-secondary">string[]</td>
              <td class="p-3 text-text-muted">[]</td>
              <td class="p-3 font-sans text-text-secondary">Array of indexing keywords rendered in small-caps tags below the abstract.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
