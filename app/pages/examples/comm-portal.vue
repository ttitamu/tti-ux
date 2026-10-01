<script setup lang="ts">
/**
 * Comm Portal Example — Showcase demonstrating the tti.tamu.edu design language.
 *
 * Demonstrates:
 *   - Two-tier public header with Maroon utility bar
 *   - Architectural Hero Slab (<TuxCommHero>) with diagonal chamfer, maroon block, left gold square
 *   - Two-tone section headers (<TuxSectionHeader variant="two-tone-rule">)
 *   - Capability Medallion Cluster (<TuxCapabilityCluster>) with concentric orbital halos
 *   - Editorial right-rail Table of Contents (<TuxTOC variant="comm">) with Warm Gold rule
 *   - Zero-radius rectangular Kadence button geometry (TuxButton shape="sharp")
 *   - 100% WCAG 2.2 Level AAA contrast compliance
 */

definePageMeta({
  layout: false, // Turnkey standalone portal layout
});

useHead({
  title: "TTI Communications Portal · Flagship Redesign Showcase",
});

const commNav = [
  { label: "Home", to: "/examples/comm-portal" },
  {
    label: "Research",
    children: [
      { label: "Automated Vehicles", to: "#capabilities", description: "V2X and connected roadside infrastructure" },
      { label: "Crash Testing & Hardware", to: "#capabilities", description: "MASH testing and roadside barrier design" },
      { label: "Pavement & Materials", to: "#capabilities", description: "Asphalt binders and structural durability" },
      { label: "Multimodal Logistics", to: "#capabilities", description: "Commercial freight corridors and rail systems" },
    ],
  },
  { label: "Capabilities", to: "#capabilities" },
  { label: "Facilities", to: "#facilities" },
  { label: "Directory", to: "#" },
  { label: "Contact", to: "#" },
];

const tocItems = [
  { id: "overview", label: "Executive Overview", depth: 2 },
  { id: "capabilities", label: "Core Research Capabilities", depth: 2 },
  { id: "facilities", label: "World-Class Proving Grounds", depth: 2 },
  { id: "partnerships", label: "Institutional Partnerships", depth: 2 },
];
</script>

<template>
  <div class="min-h-screen bg-surface-page text-text-primary font-sans flex flex-col">
    <!-- Two-Tier Institutional Header (Comm Mode) -->
    <TuxPortalHeader
      mode="comm"
      portal-title="Center for Transportation Innovation"
      portal-badge="Division 01"
      :nav-items="commNav"
      action-text="Partner With Us"
      sticky
    />

    <!-- Architectural Hero Slab (Parities tti.tamu.edu /centers and /directory) -->
    <TuxCommHero
      eyebrow="TEXAS A&M TRANSPORTATION INSTITUTE"
      title="RESEARCH CENTERS & CAPABILITIES"
      accent-title="SOLVING MULTIMODAL CHALLENGES FOR TEXAS & THE NATION"
      lead="Texas A&M Transportation Institute conducts transportation research, testing, and technology transfer across multimodal networks, maintaining active research programs for public and private sponsors."
      primary-action-text="Explore Capabilities"
      primary-action-href="#capabilities"
      secondary-action-text="Contact Research Leads"
      secondary-action-href="#overview"
      image-src="/resources/images/proving-grounds-aerial.jpg"
      image-alt="TTI RELLIS Proving Grounds and Heavy Vehicle Impact Track"
      image-badge="RELLIS Proving Grounds"
      :chamfer="true"
    />

    <!-- Main Editorial Container -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <!-- Primary Article Body -->
        <article class="lg:col-span-8 space-y-12">
          <!-- Section 1: Executive Overview -->
          <section id="overview" class="space-y-4">
            <TuxSectionHeader
              title="EXECUTIVE"
              secondary-title="OVERVIEW"
              variant="two-tone-rule"
            />
            <p class="text-base sm:text-lg text-text-primary leading-relaxed">
              For more than 75 years, the Texas A&M Transportation Institute has addressed the nation's most pressing
              infrastructure, mobility, and safety challenges. Our interdisciplinary team of engineers, planners, economists,
              and behavioral scientists partners directly with TxDOT, FHWA, AASHTO, and private industry sponsors to turn
              theoretical science into real-world roadside deployments.
            </p>
            <div class="p-6 bg-surface-eggshell border-l-4 border-brand-primary my-6">
              <h3 class="text-sm font-bold uppercase tracking-wider text-brand-primary mb-1">
                The 2026 Comm Design System Alignment
              </h3>
              <p class="text-xs sm:text-sm text-text-secondary leading-relaxed">
                This portal demonstrator implements the exact visual tokens, sharp 0px button geometry, two-tone heading rhythm,
                and high-contrast typography developed by the TTI Communications team, achieving seamless aesthetic continuity
                with public web properties while maintaining 100% WCAG 2.2 Level AAA accessibility.
              </p>
            </div>
          </section>

          <!-- Section 2: Core Capabilities with Orbital Medallions -->
          <section id="capabilities" class="space-y-6">
            <TuxCapabilityCluster
              title="RESEARCH"
              kicker="Specialized Disciplines"
              subtitle="TTI operations span specialized proving grounds, high-performance simulation laboratories, and field testing facilities."
              :columns="2"
            />
          </section>

          <!-- Section 3: Facilities & Proving Grounds -->
          <section id="facilities" class="space-y-4">
            <TuxSectionHeader
              title="PROVING"
              secondary-title="GROUNDS & LABS"
              variant="two-tone-rule"
            />
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 my-4">
              <div class="p-5 border border-surface-border bg-surface-raised shadow-xs">
                <div class="w-10 h-10 bg-brand-primary text-white flex items-center justify-center mb-3">
                  <Icon name="lucide:gauge" class="w-5 h-5 text-brand-accent" aria-hidden="true" />
                </div>
                <h3 class="text-base font-bold uppercase text-text-primary font-display mb-1">
                  RELLIS Proving Grounds
                </h3>
                <p class="text-xs text-text-secondary leading-relaxed">
                  2,000-acre testing complex accommodating full-scale crash testing, heavy vehicle dynamic braking,
                  and autonomous guidance sensor calibration at highway speeds.
                </p>
              </div>

              <div class="p-5 border border-surface-border bg-surface-raised shadow-xs">
                <div class="w-10 h-10 bg-brand-primary text-white flex items-center justify-center mb-3">
                  <Icon name="lucide:cpu" class="w-5 h-5 text-brand-accent" aria-hidden="true" />
                </div>
                <h3 class="text-base font-bold uppercase text-text-primary font-display mb-1">
                  Connected Corridor Testbed
                </h3>
                <p class="text-xs text-text-secondary leading-relaxed">
                  Instrumented live freeway network equipped with roadside DSRC/C-V2X radios, lidar towers, and edge AI
                  servers analyzing real-time conflict telemetry.
                </p>
              </div>
            </div>
          </section>

          <!-- Section 4: Partnerships -->
          <section id="partnerships" class="space-y-4">
            <TuxSectionHeader
              title="SPONSORS &"
              secondary-title="COLLABORATORS"
              variant="two-tone-rule"
            />
            <p class="text-sm text-text-secondary leading-relaxed">
              We work collaboratively across university networks, state departments of transportation, metropolitan planning
              organizations, and global Tier-1 automotive suppliers.
            </p>
            <div class="pt-4 flex flex-wrap gap-4 items-center">
              <TuxButton shape="sharp" intent="primary">
                Initiate Sponsored Research
              </TuxButton>
              <TuxButton shape="sharp" intent="secondary">
                Download Capabilities Factsheet (PDF)
              </TuxButton>
            </div>
          </section>
        </article>

        <!-- Right Rail: Sticky On This Page Card (Comm Styled TOC) -->
        <aside class="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div class="p-6 bg-surface-raised border border-surface-border shadow-xs">
            <TuxTOC
              variant="comm"
              title="ON THIS PAGE"
              :items="tocItems"
            />
          </div>

          <!-- Quick Contact Card -->
          <div class="p-6 bg-neutral-900 text-white shadow-md border-t-4 border-brand-accent">
            <h3 class="text-xs font-bold uppercase tracking-widest text-brand-accent mb-2">
              Communications Office
            </h3>
            <p class="text-xs text-white/80 leading-relaxed mb-4">
              Need research briefing materials, high-res photography, or faculty expert commentary?
            </p>
            <div class="text-xs font-mono text-white/90 space-y-1">
              <div>Phone: (979) 317-2000</div>
              <div>Email: communications@tti.tamu.edu</div>
            </div>
            <div class="mt-4">
              <TuxButton shape="sharp" intent="secondary" size="sm" class="w-full justify-center">
                Media Inquiries
              </TuxButton>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <!-- Institutional Footer -->
    <TuxFooter />
  </div>
</template>
