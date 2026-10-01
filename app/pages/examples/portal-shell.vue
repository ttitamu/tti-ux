<script setup lang="ts">
/**
 * Composition Example: Connected Transportation & Infrastructure Portal.
 *
 * Demonstrates TuxPortalShell and TuxPortalHeader in a realistic, production-grade
 * institutional portal context with hero banner, live corridor detector telemetry,
 * project cards, KPI metrics, search modal, and floating feedback affordance.
 */

useHead({ title: "Connected Transportation Portal · Composition Examples · TUX" });

definePageMeta({ layout: false });

const navItems = [
  {
    label: "Corridors",
    children: [
      { label: "I-35 Texas Corridor", to: "#", description: "Multimodal sensor network and freight throughput analytics" },
      { label: "I-10 Freight Testbed", to: "#", description: "Automated truck platoon and CAV dedicated lane pilot" },
      { label: "US-290 Smart Arterial", to: "#", description: "Adaptive signal timing and transit priority telemetry" },
      { label: "SH-130 High-Speed Proving Ground", to: "#", description: "High-speed CAV telemetry and safety test facility" },
    ],
  },
  {
    label: "Telemetry & Data",
    children: [
      { label: "Real-Time Sensor Feeds", to: "#", description: "Inductive loops, radar, and Bluetooth sensor streams" },
      { label: "Probe Vehicle Ingest", to: "#", description: "15-second connected vehicle trajectory feeds" },
      { label: "Safety & Incident Heatmaps", to: "#", description: "District and county historical incident rates" },
      { label: "Open Data Portal (API)", to: "#", badge: "REST & gRPC" },
    ],
  },
  {
    label: "Research Projects",
    children: [
      { label: "TxDOT 0-7132: Connected Corridors", to: "#", description: "Active research sponsorship FY24-FY27" },
      { label: "FHWA CAV Testbed Evaluation", to: "#", description: "Federal highway cooperative agreement" },
      { label: "NCHRP 20-102: CAV Operations", to: "#", description: "National guidance for automated fleets" },
    ],
  },
  { label: "Publications", to: "#" },
  { label: "Directory", to: "#" },
];

const breadcrumbs = [
  { label: "TTI Systems", to: "/examples" },
  { label: "Mobility Division", to: "#" },
  { label: "Connected Infrastructure Portal" },
];

const projects = [
  {
    id: "txdot-07132",
    title: "I-35 Automated Corridor Operations",
    sponsor: "Texas Department of Transportation",
    district: "Austin & San Antonio",
    detectors: "482 roadside units",
    status: "Active",
    statusVariant: "success" as const,
    summary: "Real-time edge processing for vehicle-to-infrastructure (V2I) safety messages, dynamic lane assignment, and incident detection.",
    updated: "12 mins ago",
  },
  {
    id: "fhwa-cav-2025",
    title: "Multimodal Freight Platooning Field Test",
    sponsor: "Federal Highway Administration",
    district: "Houston & Beaumont",
    detectors: "126 telemetry nodes",
    status: "Active",
    statusVariant: "success" as const,
    summary: "Three-truck commercial platoon testing on rural interstate segments with automated headway control and fuel efficiency sensors.",
    updated: "1 hour ago",
  },
  {
    id: "tti-arterial-ai",
    title: "Adaptive Urban Signal Synchronization",
    sponsor: "Texas A&M Transportation Institute",
    district: "Bryan / College Station",
    detectors: "64 intersections",
    status: "Evaluation",
    statusVariant: "gold" as const,
    summary: "Reinforcement learning agents adjusting split times dynamically based on pedestrian counts and transit bus GPS signals.",
    updated: "3 hours ago",
  },
  {
    id: "txdot-06899",
    title: "Rural High-Speed Intersection Collision Warning",
    sponsor: "TxDOT Traffic Safety Division",
    district: "Waco & Tyler",
    detectors: "38 radar radar units",
    status: "Completed",
    statusVariant: "neutral" as const,
    summary: "Flashing beacon and in-cab warning activation when high-speed cross-traffic failure-to-yield is predicted.",
    updated: "Yesterday",
  },
];

const searchOpen = ref(false);
const feedbackOpen = ref(false);
const feedbackSuccess = ref(false);
const feedbackComment = ref("");

function handleSearch() {
  searchOpen.value = true;
}

function handleFeedback() {
  feedbackOpen.value = true;
  feedbackSuccess.value = false;
  feedbackComment.value = "";
}

function submitFeedback() {
  feedbackSuccess.value = true;
  setTimeout(() => {
    feedbackOpen.value = false;
  }, 1500);
}
</script>

<template>
  <TuxPortalShell
    portal-title="Connected Transportation & Infrastructure Portal"
    portal-badge="Mobility Division"
    portal-badge-variant="gold"
    :nav-items="navItems"
    :breadcrumbs="breadcrumbs"
    action-text="Launch Console"
    max-width="wide"
    @search-click="handleSearch"
    @feedback-click="handleFeedback"
  >
    <!-- Full-Bleed Institutional Hero Banner -->
    <template #hero>
      <div class="relative bg-brand-primary text-text-inverse overflow-hidden py-14 px-4 sm:px-6 lg:px-12 border-b border-brand-accent/30">
        <!-- Subtle background texture grid -->
        <div class="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

        <div class="max-w-[96rem] mx-auto relative z-10">
          <div class="max-w-3xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-brand-accent/20 border border-brand-accent/40 text-brand-accent text-xs font-bold uppercase tracking-widest mb-4">
              <span>Statewide Research Infrastructure</span>
              <span class="w-1.5 h-1.5 rounded-full bg-brand-accent animate-ping" />
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Connected Corridors & Autonomous Systems
            </h1>

            <p class="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl font-sans">
              Advancing next-generation transportation operations through high-fidelity field telemetry,
              automated freight coordination, and multi-agency edge data exchange across 25 Texas DOT districts.
            </p>

            <div class="mt-8 flex flex-wrap items-center gap-3">
              <TuxButton
                shape="sharp"
                intent="primary"
                class="!bg-brand-accent !text-neutral-900 hover:!bg-brand-accent/90 !border-none font-bold text-sm px-5 py-2.5 shadow-md"
              >
                Explore Live Sensor Feeds
              </TuxButton>
              <TuxButton
                shape="sharp"
                intent="secondary"
                class="!bg-transparent !text-white !border !border-white/50 hover:!bg-white/15 font-bold text-sm px-5 py-2.5"
              >
                Research Reports & Solicitations
              </TuxButton>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Main Content Area -->
    <div class="space-y-12">
      <!-- KPI Metric Row -->
      <section>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-5 bg-surface-raised border border-surface-border shadow-xs">
            <div class="text-xs uppercase tracking-wider font-semibold text-text-muted">Active Corridors</div>
            <div class="text-3xl font-extrabold text-brand-primary mt-1">4</div>
            <div class="text-xs text-text-secondary mt-1 flex items-center gap-1 font-mono">
              <Icon name="lucide:check-circle" class="w-3.5 h-3.5 text-emerald-600" />
              <span>100% online</span>
            </div>
          </div>

          <div class="p-5 bg-surface-raised border border-surface-border shadow-xs">
            <div class="text-xs uppercase tracking-wider font-semibold text-text-muted">Roadside RSUs</div>
            <div class="text-3xl font-extrabold text-brand-primary mt-1">710</div>
            <div class="text-xs text-text-secondary mt-1 font-mono">DSRC & C-V2X dual-mode</div>
          </div>

          <div class="p-5 bg-surface-raised border border-surface-border shadow-xs">
            <div class="text-xs uppercase tracking-wider font-semibold text-text-muted">Telemetry Ingest</div>
            <div class="text-3xl font-extrabold text-brand-primary mt-1">14.8M</div>
            <div class="text-xs text-text-secondary mt-1 font-mono">msgs/24h window</div>
          </div>

          <div class="p-5 bg-surface-raised border border-surface-border shadow-xs">
            <div class="text-xs uppercase tracking-wider font-semibold text-text-muted">Active Projects</div>
            <div class="text-3xl font-extrabold text-brand-primary mt-1">18</div>
            <div class="text-xs text-text-secondary mt-1 font-mono">$12.4M sponsored research</div>
          </div>
        </div>
      </section>

      <!-- Active Research Testbeds -->
      <section class="space-y-6">
        <div class="flex items-center justify-between">
          <TuxSectionHeader variant="institutional">
            Active Research Corridors & Testbeds
          </TuxSectionHeader>
          <div class="hidden sm:flex items-center gap-2 text-xs font-mono text-text-muted">
            <Icon name="lucide:radio" class="w-3.5 h-3.5 text-brand-accent animate-pulse" />
            <span>Telemetry streams operational</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="project in projects"
            :key="project.id"
            class="bg-surface-raised border border-surface-border p-6 shadow-xs hover:border-brand-primary/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div class="flex items-start justify-between gap-4 mb-2">
                <span class="text-xs font-mono uppercase tracking-wider text-text-muted">
                  {{ project.id }}
                </span>
                <span
                  class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none"
                  :class="[
                    project.statusVariant === 'success' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : '',
                    project.statusVariant === 'gold' ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200' : '',
                    project.statusVariant === 'neutral' ? 'bg-surface-sunken text-text-secondary border border-surface-border' : ''
                  ]"
                >
                  {{ project.status }}
                </span>
              </div>

              <h2 class="text-lg font-bold text-text-primary hover:text-brand-primary transition-colors cursor-pointer">
                {{ project.title }}
              </h2>

              <p class="text-sm text-text-secondary mt-2 leading-relaxed">
                {{ project.summary }}
              </p>
            </div>

            <div class="mt-6 pt-4 border-t border-surface-border flex items-center justify-between text-xs text-text-muted">
              <div class="space-y-0.5">
                <div><strong>Sponsor:</strong> {{ project.sponsor }}</div>
                <div><strong>Coverage:</strong> {{ project.district }} ({{ project.detectors }})</div>
              </div>
              <div class="text-right">
                <TuxButton shape="sharp" intent="ghost" size="xs">
                  <span>View Details</span>
                  <Icon name="lucide:arrow-right" class="w-3 h-3 ml-1" />
                </TuxButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Institutional Notice / Marcom Card -->
      <section class="p-6 bg-surface-sunken border-l-4 border-brand-primary">
        <h3 class="text-base font-bold text-brand-primary uppercase tracking-wide">
          Statewide Collaboration Notice
        </h3>
        <p class="text-sm text-text-secondary mt-1 leading-relaxed">
          The Connected Transportation Portal is managed under the Texas A&M Transportation Institute
          Coordinated Statewide Transportation Research Program. Data access requests from external
          research organizations require an active data use agreement (DUA).
        </p>
      </section>
    </div>

    <!-- Interactive Search Command Modal (Demo) -->
    <div
      v-if="searchOpen"
      class="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4"
      @click="searchOpen = false"
    >
      <div
        class="w-full max-w-lg bg-surface-raised border border-surface-border shadow-2xl p-6"
        @click.stop
      >
        <div class="flex items-center justify-between border-b border-surface-border pb-3 mb-4">
          <div class="flex items-center gap-2">
            <Icon name="lucide:search" class="w-5 h-5 text-brand-primary" />
            <h3 class="text-base font-bold text-text-primary">Search Portal Resources</h3>
          </div>
          <button
            type="button"
            class="text-text-muted hover:text-text-primary p-1 cursor-pointer"
            @click="searchOpen = false"
          >
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Search corridors, sensors, datasets, or researchers..."
          class="w-full px-3 py-2 text-sm bg-surface-page border border-surface-border rounded-none focus:outline-none focus:border-brand-primary"
          autofocus
        />

        <div class="mt-4 space-y-2 text-xs text-text-secondary">
          <div class="font-semibold uppercase tracking-wider text-text-muted">Suggested Queries</div>
          <div class="flex flex-wrap gap-1.5">
            <span class="px-2 py-1 bg-surface-sunken border border-surface-border cursor-pointer hover:border-brand-primary">I-35 RSU telemetry</span>
            <span class="px-2 py-1 bg-surface-sunken border border-surface-border cursor-pointer hover:border-brand-primary">Truck platooning logs</span>
            <span class="px-2 py-1 bg-surface-sunken border border-surface-border cursor-pointer hover:border-brand-primary">Austin district crash records</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive Feedback Modal (Demo) -->
    <div
      v-if="feedbackOpen"
      class="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4"
      @click="feedbackOpen = false"
    >
      <div
        class="w-full max-w-md bg-surface-raised border border-surface-border shadow-2xl p-6"
        @click.stop
      >
        <div class="flex items-center justify-between border-b border-surface-border pb-3 mb-4">
          <div class="flex items-center gap-2">
            <Icon name="lucide:message-square-plus" class="w-5 h-5 text-brand-primary" />
            <h3 class="text-base font-bold text-text-primary">Portal Feedback</h3>
          </div>
          <button
            type="button"
            class="text-text-muted hover:text-text-primary p-1 cursor-pointer"
            @click="feedbackOpen = false"
          >
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <div v-if="feedbackSuccess" class="py-6 text-center text-emerald-700 dark:text-emerald-400 font-bold">
          <Icon name="lucide:check-circle" class="w-10 h-10 mx-auto mb-2 text-emerald-600" />
          Thank you! Your feedback has been received.
        </div>

        <div v-else class="space-y-4">
          <p class="text-xs text-text-secondary">
            Help us improve the Connected Transportation Portal. Provide feedback on data freshness,
            dashboard usability, or research tools.
          </p>
          <textarea
            v-model="feedbackComment"
            rows="4"
            placeholder="Describe your suggestion or report an issue..."
            class="w-full p-2.5 text-xs bg-surface-page border border-surface-border rounded-none focus:outline-none focus:border-brand-primary"
          />
          <div class="flex justify-end gap-2">
            <TuxButton shape="sharp" intent="secondary" size="sm" @click="feedbackOpen = false">
              Cancel
            </TuxButton>
            <TuxButton shape="sharp" intent="primary" size="sm" @click="submitFeedback">
              Submit Feedback
            </TuxButton>
          </div>
        </div>
      </div>
    </div>
  </TuxPortalShell>
</template>
