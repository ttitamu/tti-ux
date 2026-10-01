<script setup lang="ts">
import tuxCommHeroSource from "~/components/TuxCommHero.vue?raw";

useHead({ title: "TuxCommHero · TUX" });

const chamfer = ref(true);

const snippet = `<TuxCommHero
  eyebrow="TEXAS A&M TRANSPORTATION INSTITUTE"
  title="RESEARCH CENTERS & CAPABILITIES"
  accent-title="SOLVING MULTIMODAL CHALLENGES FOR TEXAS & THE NATION"
  lead="TTI is the largest higher-education-affiliated transportation research institute in the United States, conducting over 700 concurrent research investigations annually."
  primary-action-text="Explore Capabilities"
  primary-action-to="#capabilities"
  secondary-action-text="Contact Leads"
  secondary-action-to="#contact"
  image-src="/resources/images/proving-grounds-aerial.jpg"
  image-alt="RELLIS Proving Grounds"
  image-badge="RELLIS Proving Grounds"
  :chamfer="true"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader
      eyebrow="marcom & hero banners"
      title="TuxCommHero"
    >
      The signature architectural hero slab from the new tti.tamu.edu redesign (seen on /centers and /directory).
      Features diagonal chamfer cut, deep Aggie Maroon slab (#500000), left Warm Gold square anchor block,
      and 3-tier heading typography.
    </TuxPageHeader>

    <!-- Interactive Demo -->
    <section class="space-y-4">
      <TuxSectionHeader variant="two-tone-rule" title="LIVE" secondary-title="DEMO" />

      <div class="border border-surface-border overflow-hidden">
        <TuxCommHero
          eyebrow="TEXAS A&M TRANSPORTATION INSTITUTE"
          title="RESEARCH CENTERS & CAPABILITIES"
          accent-title="SOLVING MULTIMODAL CHALLENGES FOR TEXAS & THE NATION"
          lead="TTI is an agency of the Texas A&M University System and the largest higher-education-affiliated transportation research institute in the United States."
          primary-action-text="Explore Capabilities"
          primary-action-href="#"
          secondary-action-text="Contact Leads"
          secondary-action-href="#"
          image-src="/resources/images/proving-grounds-aerial.jpg"
          image-alt="RELLIS Proving Grounds"
          image-badge="RELLIS Proving Grounds"
          :chamfer="chamfer"
        />
      </div>

      <div class="p-4 bg-surface-raised border border-surface-border flex items-center justify-between">
        <label class="inline-flex items-center gap-2 text-xs font-bold text-text-primary cursor-pointer">
          <input v-model="chamfer" type="checkbox" class="accent-brand-primary" />
          <span>Enable Diagonal Chamfer Canvas Cut</span>
        </label>
      </div>

      <TuxCodeBlock :code="snippet" lang="vue" filename="Template Usage" />
    </section>

    <!-- Source Code Tab -->
    <section class="space-y-4">
      <TuxSectionHeader variant="two-tone-rule" title="COMPONENT" secondary-title="SOURCE" />
      <TuxCodeBlock :code="tuxCommHeroSource" lang="vue" filename="app/components/TuxCommHero.vue" />
    </section>
  </div>
</template>
