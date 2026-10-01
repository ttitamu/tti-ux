<script setup lang="ts">
/**
 * TuxCommHero — Signature Architectural Hero Slab from the new tti.tamu.edu redesign.
 *
 * Replicates the exact visual composition from the flagship /centers and /directory portals:
 *   - Diagonal chamfered cool-gray canvas backdrop
 *   - Deep Aggie Maroon primary slab
 *   - Warm Ochre Gold square anchor accent block
 *   - 3-tier heading typography (Light white line 1 + Bold white line 2 + Warm gold accent line 3)
 *   - Rectangular Kadence-style sharp action buttons
 *   - Framed 0px scientific photography
 */

interface Props {
  /** Line 1: Light uppercase kicker/eyebrow (e.g. "TEXAS A&M TRANSPORTATION INSTITUTE"). */
  eyebrow?: string;
  /** Line 2: Bold high-impact primary headline (e.g. "RESEARCH CENTERS"). */
  title: string;
  /** Line 3: Warm Ochre Gold sub-headline or focus area (e.g. "ADVANCING TRANSPORTATION INNOVATION"). */
  accentTitle?: string;
  /** Editorial lead paragraph describing the mission, capabilities, or center scope. */
  lead?: string;
  /** Primary action CTA button label. */
  primaryActionText?: string;
  /** Primary action destination route. */
  primaryActionTo?: string;
  /** Primary action external URL. */
  primaryActionHref?: string;
  /** Secondary action button label. */
  secondaryActionText?: string;
  /** Secondary action destination route. */
  secondaryActionTo?: string;
  /** Secondary action external URL. */
  secondaryActionHref?: string;
  /** Image source URL for the framed hero photograph. */
  imageSrc?: string;
  /** Image alt text for screen readers. */
  imageAlt?: string;
  /** Optional badge overlay text on the image. */
  imageBadge?: string;
  /** Whether to enable the diagonal cut chamfer at the bottom edge. */
  chamfer?: boolean;
}

withDefaults(defineProps<Props>(), {
  eyebrow: "TEXAS A&M TRANSPORTATION INSTITUTE",
  accentTitle: "",
  lead: "",
  primaryActionText: "",
  primaryActionTo: "",
  primaryActionHref: "",
  secondaryActionText: "",
  secondaryActionTo: "",
  secondaryActionHref: "",
  imageSrc: "",
  imageAlt: "TTI Research Facility and Operations",
  imageBadge: "",
  chamfer: true,
});

const emit = defineEmits<{
  "primary-click": [payload: MouseEvent];
  "secondary-click": [payload: MouseEvent];
}>();
</script>

<template>
  <section
    class="tux-comm-hero relative w-full overflow-hidden bg-surface-cool-gray text-text-primary"
    :class="{ 'pb-12 sm:pb-16 [clip-path:polygon(0_0,100%_0,100%_calc(100%-2.5rem),0_100%)]': chamfer }"
    aria-label="Hero Banner"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <!-- Content Column: Deep Maroon Slab -->
        <div class="lg:col-span-7 xl:col-span-7 relative z-10">
          <div class="bg-brand-primary text-white p-6 sm:p-10 lg:p-12 shadow-2xl relative">
            <!-- Left Warm Gold Anchor Accent Block -->
            <div
              class="absolute left-0 top-0 w-3 sm:w-4 h-16 sm:h-24 bg-brand-accent"
              aria-hidden="true"
            />

            <!-- 3-Tier Signature Headings Rhythm -->
            <div class="space-y-1 sm:space-y-2 pl-2 sm:pl-3">
              <!-- Tier 1: Light White Eyebrow -->
              <p
                v-if="eyebrow"
                class="text-xs sm:text-sm font-light uppercase tracking-widest text-white/90"
              >
                {{ eyebrow }}
              </p>

              <!-- Tier 2: Bold White Primary Title -->
              <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight font-display">
                {{ title }}
              </h1>

              <!-- Tier 3: Warm Ochre Gold Accent Line -->
              <p
                v-if="accentTitle"
                class="text-base sm:text-xl font-bold uppercase tracking-wider text-brand-accent pt-1"
              >
                {{ accentTitle }}
              </p>
            </div>

            <!-- Lead Paragraph -->
            <div
              v-if="lead"
              class="mt-4 sm:mt-6 text-sm sm:text-base text-white/90 leading-relaxed pl-2 sm:pl-3 border-l border-white/20 ml-2 sm:ml-3"
            >
              {{ lead }}
            </div>

            <!-- Action Buttons -->
            <div
              v-if="primaryActionText || secondaryActionText"
              class="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4 pl-2 sm:pl-3"
            >
              <TuxButton
                v-if="primaryActionText"
                shape="sharp"
                intent="secondary"
                :to="primaryActionTo || undefined"
                :href="primaryActionHref || undefined"
                class="!bg-brand-accent !text-neutral-900 !border-brand-accent hover:!bg-brand-accent/90"
                @click="emit('primary-click', $event)"
              >
                {{ primaryActionText }}
              </TuxButton>

              <TuxButton
                v-if="secondaryActionText"
                shape="sharp"
                intent="ghost"
                :to="secondaryActionTo || undefined"
                :href="secondaryActionHref || undefined"
                class="!text-white !border-white/40 hover:!bg-white/10 hover:!border-white"
                @click="emit('secondary-click', $event)"
              >
                {{ secondaryActionText }}
              </TuxButton>
            </div>

            <slot name="extra" />
          </div>
        </div>

        <!-- Media Column: Framed Photography -->
        <div class="lg:col-span-5 xl:col-span-5 relative">
          <div class="relative shadow-2xl overflow-hidden border-2 border-white/80 bg-black">
            <img
              v-if="imageSrc"
              :src="imageSrc"
              :alt="imageAlt"
              class="w-full h-64 sm:h-80 lg:h-96 object-cover object-center transition-transform duration-500 hover:scale-102"
              loading="lazy"
            />
            <div
              v-else
              class="w-full h-64 sm:h-80 lg:h-96 bg-neutral-800 flex flex-col items-center justify-center p-6 text-center text-white/60"
            >
              <Icon name="lucide:image" class="w-12 h-12 mb-2 text-brand-accent/60" aria-hidden="true" />
              <span class="text-xs font-mono uppercase tracking-wider">Scientific Photography Slab</span>
            </div>

            <!-- Image Badge Pill -->
            <div
              v-if="imageBadge"
              class="absolute bottom-3 left-3 bg-brand-primary/90 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 border-l-2 border-brand-accent shadow"
            >
              {{ imageBadge }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
