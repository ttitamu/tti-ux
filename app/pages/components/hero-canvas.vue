<script setup lang="ts">
/**
 * Component Gallery: TuxHeroCanvas
 * Interactive documentation and sandbox demonstrating celestial & telemetry
 * simulation canvas hero presentations with WCAG 2.2 AAA accessibility and seamless body blending.
 */

useHead({ title: "TuxHeroCanvas · TUX" });

const activeVariant = ref("corridor");
const activeBlend = ref("seamless");
const interactive = ref(true);
const showControls = ref(true);

const variantOptions = [
  { value: "corridor", label: "Texas Corridor Network (Kinetic Arterial Flow)" },
  { value: "network", label: "Autonomous Telemetry Mesh" },
  { value: "sol", label: "Sol Celestial (Corona + Flare Belt)" },
  { value: "constellation", label: "Constellation Telemetry Mesh" },
];

const blendOptions = [
  { value: "seamless", label: "Seamless (Bottom Atmospheric Dissolve)" },
  { value: "contained", label: "Contained (Card Radius + Border)" },
  { value: "full-bleed", label: "Full Bleed (Edge to Edge)" },
];

const sampleCode = computed(() => {
  return `<TuxHeroCanvas
  variant="${activeVariant.value}"
  blend="${activeBlend.value}"
  :interactive="${interactive.value}"
  :show-controls="${showControls.value}"
>
  <div class="max-w-4xl mx-auto px-6 text-white text-center py-12">
    <span class="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/10 rounded-full border border-white/20 mb-4">
      Research Index
    </span>
    <h1 class="text-4xl sm:text-6xl font-bold font-display tracking-tight mb-4">
      Next-Gen Computing Cluster
    </h1>
    <p class="text-lg text-white/80 max-w-2xl mx-auto">
      Accelerating high-performance AI simulations across transportation research divisions.
    </p>
  </div>
</TuxHeroCanvas>`;
});
</script>

<template>
  <div class="min-h-screen bg-surface-page py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- Breadcrumb and title -->
      <div>
        <NuxtLink to="/components" class="text-xs font-mono text-brand-primary uppercase tracking-wider hover:underline">
          &larr; Component Lab
        </NuxtLink>
        <h1 class="mt-2 text-3xl font-display font-bold text-text-primary tracking-tight">
          TuxHeroCanvas
        </h1>
        <p class="mt-2 text-base text-text-secondary max-w-3xl leading-relaxed">
          High-performance HTML5 2D canvas simulation authentic to the Texas A&amp;M Transportation Institute (TTI).
          Features the <strong>Texas Corridor Network</strong> with double-cased arterial highway vectors, connected
          autonomous vehicle (CAV) telemetry pulses, radar sensor beacon wavefronts, interactive cursor HUD reticle,
          and an atmospheric bottom gradient mask that dissolves organically into the page body with zero card boundaries.
        </p>
      </div>

      <!-- Control Sandbox -->
      <section class="p-6 bg-surface-raised border border-surface-border rounded-md shadow-xs space-y-6">
        <h2 class="text-sm font-bold font-mono uppercase tracking-wider text-text-primary">
          Interactive Canvas Controls
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <!-- Variant selector -->
          <div>
            <label for="variant-select" class="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              Simulation Variant
            </label>
            <select
              id="variant-select"
              v-model="activeVariant"
              class="w-full text-sm bg-surface-sunken border border-surface-border rounded-xs px-3 py-2 text-text-primary focus:outline-hidden focus:ring-2 focus:ring-brand-primary"
            >
              <option v-for="opt in variantOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <!-- Blend selector -->
          <div>
            <label for="blend-select" class="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              Bottom Edge Blend
            </label>
            <select
              id="blend-select"
              v-model="activeBlend"
              class="w-full text-sm bg-surface-sunken border border-surface-border rounded-xs px-3 py-2 text-text-primary focus:outline-hidden focus:ring-2 focus:ring-brand-primary"
            >
              <option v-for="opt in blendOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <!-- Interactive checkbox -->
          <div class="flex items-center gap-2 pt-6">
            <input
              id="interactive-cb"
              v-model="interactive"
              type="checkbox"
              class="h-4 w-4 rounded-xs border-surface-border text-brand-primary focus:ring-brand-primary"
            >
            <label for="interactive-cb" class="text-sm font-medium text-text-primary select-none cursor-pointer">
              Cursor Proximity Physics
            </label>
          </div>

          <!-- Controls checkbox -->
          <div class="flex items-center gap-2 pt-6">
            <input
              id="controls-cb"
              v-model="showControls"
              type="checkbox"
              class="h-4 w-4 rounded-xs border-surface-border text-brand-primary focus:ring-brand-primary"
            >
            <label for="controls-cb" class="text-sm font-medium text-text-primary select-none cursor-pointer">
              Play/Pause Toggle (AAA)
            </label>
          </div>
        </div>
      </section>

      <!-- Live Interactive Preview Canvas Stage -->
      <section class="border border-surface-border rounded-md overflow-hidden bg-surface-sunken">
        <TuxHeroCanvas
          :variant="activeVariant"
          :blend="activeBlend"
          :interactive="interactive"
          :show-controls="showControls"
          min-height="28rem"
        >
          <div class="max-w-3xl mx-auto px-6 text-center py-12">
            <span class="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/12 text-white rounded-full border border-white/20 mb-4 backdrop-blur-md">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Research Index Presentation</span>
            </span>
            <h2 class="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white mb-4">
              Autonomous Systems & Corridor AI
            </h2>
            <p class="text-base sm:text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
              Evaluating multi-agent trajectory prediction, dynamic signal actuation, and edge computer-vision models.
            </p>
          </div>
        </TuxHeroCanvas>
      </section>

      <!-- Code Snippet -->
      <section class="space-y-3">
        <h2 class="text-sm font-bold font-mono uppercase tracking-wider text-text-primary">
          Nuxt Template Usage
        </h2>
        <div class="p-4 bg-surface-sunken border border-surface-border rounded-md font-mono text-xs overflow-x-auto text-text-primary">
          <pre>{{ sampleCode }}</pre>
        </div>
      </section>
    </div>
  </div>
</template>
