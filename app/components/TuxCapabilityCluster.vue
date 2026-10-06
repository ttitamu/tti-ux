<script setup lang="ts">
/**
 * TuxCapabilityCluster — Signature Capability Medallions from tti.tamu.edu/capabilities.
 *
 * Implements the distinctive circular orbital nodes seen across the public redesign:
 *   - Dark circular medallions with high-contrast white vector icons
 *   - Concentric Warm Gold and Maroon orbital halo rings
 *   - Bold capability titles and bulleted focus areas
 *   - Interactive hover elevation and touch targets >= 44px
 */

export interface CapabilityItem {
  id?: string;
  title: string;
  description?: string;
  icon?: string;
  to?: string;
  href?: string;
  topics?: string[];
  haloColor?: "gold" | "maroon" | "teal" | "blue" | "green";
}

interface Props {
  /** Optional section heading title (e.g. "CORE RESEARCH CAPABILITIES"). */
  title?: string;
  /** Section kicker or eyebrow. */
  kicker?: string;
  /** Subtitle or summary paragraph. */
  subtitle?: string;
  /** Array of capability items. Defaults to canonical TTI research pillars. */
  capabilities?: CapabilityItem[];
  /** Grid column configuration: 2, 3 (default), or 4 columns. */
  columns?: 2 | 3 | 4;
}

const props = withDefaults(defineProps<Props>(), {
  title: "RESEARCH CAPABILITIES",
  kicker: "Research Programs",
  subtitle: "Applied research and testing capabilities across nine core transportation disciplines.",
  columns: 3,
  capabilities: () => [
    {
      title: "Crash Safety & Roadside Hardware",
      description: "MASH crash testing, barrier design, impact biomechanics, and safety hardware certification at the RELLIS Proving Grounds.",
      icon: "lucide:shield-alert",
      topics: ["MASH Testing", "Roadside Hardware", "Impact Biomechanics"],
      haloColor: "gold",
    },
    {
      title: "Connected & Automated Transportation",
      description: "V2X vehicle-to-infrastructure communications, automated transit corridors, edge sensing, and roadside compute telemetry.",
      icon: "lucide:cpu",
      topics: ["V2X Communications", "Autonomous Fleet Guidance", "Edge AI Telemetry"],
      haloColor: "maroon",
    },
    {
      title: "Infrastructure & Materials",
      description: "Asphalt technology, concrete durability, pavement geotechnics, bridge condition telemetry, and accelerated loading simulation.",
      icon: "lucide:hammer",
      topics: ["Pavement Geotechnics", "Bridge Telemetry", "Advanced Binders"],
      haloColor: "blue",
    },
    {
      title: "Traffic Operations & Mobility",
      description: "Freeway management, active arterial optimization, incident response protocols, and smart work-zone deployment.",
      icon: "lucide:car",
      topics: ["Signal Optimization", "Incident Management", "Work Zone Safety"],
      haloColor: "teal",
    },
    {
      title: "Transit & Multimodal Freight",
      description: "Commercial logistics, intermodal freight corridors, rural transit efficiency, and active mobility networks.",
      icon: "lucide:truck",
      topics: ["Freight Modeling", "Intermodal Rail & Port", "Rural Mobility"],
      haloColor: "green",
    },
    {
      title: "Policy, Economics & Investment",
      description: "Highway financing, revenue forecasting, legislative data analysis, and long-range infrastructure asset stewardship.",
      icon: "lucide:landmark",
      topics: ["Funding Models", "Economic Analysis", "Policy Evaluation"],
      haloColor: "gold",
    },
  ],
});

const gridClass = computed(() => {
  switch (props.columns) {
    case 2: return "sm:grid-cols-2";
    case 4: return "sm:grid-cols-2 lg:grid-cols-4";
    case 3:
    default:
      return "sm:grid-cols-2 lg:grid-cols-3";
  }
});

function getHaloRingClass(halo: string | undefined): string {
  switch (halo) {
    case "maroon": return "border-brand-primary";
    case "blue": return "border-spectrum-blue";
    case "teal": return "border-spectrum-teal";
    case "green": return "border-spectrum-green";
    case "gold":
    default:
      return "border-brand-accent";
  }
}
</script>

<template>
  <section class="tux-capability-cluster w-full my-8 select-none" :aria-label="title || 'Research Capabilities'">
    <!-- Section Header with Two-Tone Keyline Rule -->
    <div class="mb-8">
      <TuxSectionHeader
        :title="title"
        :kicker="kicker || undefined"
        :subtitle="subtitle || undefined"
        variant="two-tone-rule"
      />
    </div>

    <!-- Cluster Grid -->
    <div class="grid grid-cols-1 gap-6 sm:gap-8" :class="gridClass">
      <article
        v-for="cap in capabilities"
        :key="cap.title"
        class="tux-capability-card group flex flex-col p-6 bg-surface-raised border border-surface-border shadow-xs hover:shadow-lg hover:border-brand-primary transition-all duration-300 relative overflow-hidden"
      >
        <!-- Orbital Medallion Container -->
        <div class="flex items-center justify-center my-4">
          <div class="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28">
            <!-- Concentric Outer Orbital Arc -->
            <div
              class="absolute inset-0 rounded-full border-2 border-dashed transition-transform duration-700 group-hover:rotate-45"
              :class="getHaloRingClass(cap.haloColor)"
              aria-hidden="true"
            />

            <!-- Concentric Inner Ring Halo -->
            <div
              class="absolute inset-1.5 rounded-full border border-surface-border transition-transform duration-500 group-hover:scale-95"
              aria-hidden="true"
            />

            <!-- Central Dark Node Medallion -->
            <div class="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-primary flex items-center justify-center text-white shadow-md group-hover:bg-brand-deep transition-colors">
              <Icon
                :name="cap.icon || 'lucide:compass'"
                class="w-8 h-8 sm:w-9 sm:h-9 text-brand-accent transition-transform duration-300 group-hover:scale-110"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <!-- Capability Title -->
        <h3 class="text-base sm:text-lg font-bold text-center uppercase tracking-tight text-text-primary group-hover:text-brand-primary transition-colors font-display mt-2 mb-2">
          <NuxtLink
            v-if="cap.to"
            :to="cap.to"
            class="hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            {{ cap.title }}
          </NuxtLink>
          <a
            v-else-if="cap.href"
            :href="cap.href"
            target="_blank"
            rel="noopener"
            class="hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            {{ cap.title }}
          </a>
          <span v-else>{{ cap.title }}</span>
        </h3>

        <!-- Description -->
        <p v-if="cap.description" class="text-xs sm:text-sm text-text-secondary text-center leading-relaxed mb-4 flex-1">
          {{ cap.description }}
        </p>

        <!-- Topic Tags List -->
        <div v-if="cap.topics && cap.topics.length > 0" class="flex flex-wrap items-center justify-center gap-1.5 mt-auto pt-3 border-t border-surface-border/50">
          <span
            v-for="topic in cap.topics"
            :key="topic"
            class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-surface-sunken text-text-muted border border-surface-border/80 rounded-none"
          >
            {{ topic }}
          </span>
        </div>

        <!-- Bottom Action Cue -->
        <div v-if="cap.to || cap.href" class="mt-4 pt-2 text-center text-xs font-bold uppercase tracking-wider text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <NuxtLink v-if="cap.to" :to="cap.to" class="hover:underline">
            Learn More &rarr;
          </NuxtLink>
          <a v-else-if="cap.href" :href="cap.href" target="_blank" rel="noopener" class="hover:underline">
            Learn More &rarr;
          </a>
        </div>
      </article>
    </div>
  </section>
</template>
