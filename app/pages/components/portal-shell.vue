<script setup lang="ts">
import tuxPortalHeaderSource from "~/components/TuxPortalHeader.vue?raw";
import tuxPortalShellSource from "~/components/TuxPortalShell.vue?raw";

useHead({ title: "TuxPortalShell & TuxPortalHeader · TUX" });

const sampleNav = [
  {
    label: "Research",
    children: [
      { label: "Connected Infrastructure", to: "#", description: "Sensor networks & vehicle-to-everything (V2X) telemetry" },
      { label: "Automated Mobility", to: "#", description: "Autonomous fleet testing and corridor coordination" },
      { label: "Safety & Human Factors", to: "#", description: "Crash records analysis and driver behavior models" },
      { label: "Active Solicitations", to: "#", badge: "FY26" },
    ],
  },
  {
    label: "Data & Tools",
    children: [
      { label: "Corridor Telemetry", to: "#", description: "Live loop detector and probe vehicle data feeds" },
      { label: "Crash Analytics System", to: "#", description: "County and district spatial heatmaps" },
      { label: "API Gateway", to: "#", badge: "v2.4" },
    ],
  },
  { label: "Publications", to: "#" },
  { label: "About", to: "#" },
];

const sampleBreadcrumbs = [
  { label: "TTI Portals", to: "#" },
  { label: "Connected Corridors", to: "#" },
  { label: "Real-Time Telemetry" },
];

const lastSearchEvent = ref<string | null>(null);
const lastActionEvent = ref<string | null>(null);
const lastFeedbackEvent = ref<string | null>(null);

function onSearch() {
  lastSearchEvent.value = `Search triggered at ${new Date().toLocaleTimeString()}`;
}

function onAction() {
  lastActionEvent.value = `CTA clicked at ${new Date().toLocaleTimeString()}`;
}

function onFeedback() {
  lastFeedbackEvent.value = `Feedback opened at ${new Date().toLocaleTimeString()}`;
}

const headerSnippet = `<TuxPortalHeader
  portal-title="Connected Corridors Initiative"
  portal-badge="Lab Portal"
  portal-badge-variant="gold"
  :nav-items="navItems"
  action-text="Launch Portal"
  @search-click="onSearch"
  @action-click="onAction"
/>`;

const shellSnippet = `<TuxPortalShell
  portal-title="Connected Corridors Initiative"
  portal-badge="Live Telemetry"
  :nav-items="navItems"
  :breadcrumbs="breadcrumbs"
  action-text="Access Data"
  @search-click="onSearch"
  @action-click="onAction"
  @feedback-click="onFeedback"
>
  <template #hero>
    <div class="bg-brand-primary text-white py-12 px-6">
      <h1 class="text-3xl font-bold">Research Portal Hero</h1>
    </div>
  </template>

  <div class="space-y-6">
    <TuxSectionHeader variant="institutional">Corridor Status</TuxSectionHeader>
    <p>Main content area adhering to standard or wide container rules.</p>
  </div>
</TuxPortalShell>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader
      eyebrow="institutional chrome"
      title="TuxPortalHeader & TuxPortalShell"
    >
      The official Two-Tier Institutional Portal chrome for Texas A&M Transportation Institute.
      Directly models the design system of <a href="https://tti.tamu.edu/" target="_blank" rel="noopener" class="underline text-brand-primary">tti.tamu.edu</a>
      and <a href="https://my.tti.tamu.edu/" target="_blank" rel="noopener" class="underline text-brand-primary">my.tti.tamu.edu</a>.
      Features an Aggie Maroon utility bar, crisp brand ribbon with official winged-A mark,
      flyout navigation dropdowns, active Warm Gold indicators, sharp Kadence-profile buttons,
      and turnkey layout scaffolding.
    </TuxPageHeader>

    <div class="flex items-center gap-3">
      <NuxtLink
        to="/examples/portal-shell"
        class="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-none hover:bg-brand-primary/90 transition-colors"
      >
        <Icon name="lucide:external-link" class="w-4 h-4" />
        <span>View Full Portal Example</span>
      </NuxtLink>
      <NuxtLink
        to="/tokens/playground"
        class="inline-flex items-center gap-2 px-4 py-2 border border-surface-border text-text-primary text-xs font-bold uppercase tracking-wider rounded-none hover:bg-surface-sunken transition-colors"
      >
        <Icon name="lucide:sliders-horizontal" class="w-4 h-4" />
        <span>Token Playground</span>
      </NuxtLink>
    </div>

    <!-- Section 1: Header in Isolation -->
    <section class="space-y-4">
      <TuxSectionHeader variant="institutional">
        TuxPortalHeader (Two-Tier Header)
      </TuxSectionHeader>
      <p class="text-sm text-text-secondary">
        Tier 1 is an Aggie Maroon bar with agency branding, institutional links, and search affordance.
        Tier 2 provides the crisp white brand ribbon, portal title, multi-tier navigation dropdowns,
        and sharp Kadence action button.
      </p>

      <div class="border border-surface-border bg-surface-sunken p-2 overflow-hidden shadow-sm">
        <TuxPortalHeader
          nav-aria-label="Standalone Header Navigation"
          portal-title="Connected Corridors Initiative"
          portal-badge="Lab Portal"
          portal-badge-variant="gold"
          :nav-items="sampleNav"
          action-text="Launch Portal"
          @search-click="onSearch"
          @action-click="onAction"
        />
      </div>

      <div v-if="lastSearchEvent || lastActionEvent" class="p-3 bg-surface-sunken border border-surface-border text-xs font-mono text-text-secondary">
        <div>{{ lastSearchEvent || 'No search clicked yet' }}</div>
        <div>{{ lastActionEvent || 'No CTA clicked yet' }}</div>
      </div>

      <TuxExample :vue="headerSnippet" :source="tuxPortalHeaderSource" />
    </section>

    <!-- Section 2: Full Turnkey Shell -->
    <section class="space-y-4">
      <TuxSectionHeader variant="institutional">
        TuxPortalShell (Turnkey Layout Container)
      </TuxSectionHeader>
      <p class="text-sm text-text-secondary">
        <code class="font-mono text-xs bg-surface-sunken px-1.5 py-0.5 rounded">TuxPortalShell</code> wraps
        header, sticky positioning, breadcrumbs subnav with signature 2px Warm Gold accent rule,
        full-bleed hero slot, responsive main container, floating feedback pill, and institutional footer.
      </p>

      <div class="border border-surface-border rounded-none overflow-hidden max-h-[520px] overflow-y-auto bg-surface-page relative shadow-md">
        <TuxPortalShell
          as="div"
          :header-props="{ navAriaLabel: 'Portal Layout Navigation' }"
          portal-title="Connected Corridors Initiative"
          portal-badge="v3.0"
          :nav-items="sampleNav"
          :breadcrumbs="sampleBreadcrumbs"
          action-text="Request Access"
          :sticky-header="false"
          :show-footer="true"
          @search-click="onSearch"
          @action-click="onAction"
          @feedback-click="onFeedback"
        >
          <div class="space-y-6">
            <div class="p-6 bg-surface-raised border border-surface-border shadow-xs">
              <h3 class="text-xl font-bold text-text-primary mb-2">Connected Research Testbed</h3>
              <p class="text-sm text-text-secondary leading-relaxed">
                This is a realistic page viewport inside <code class="font-mono text-xs">TuxPortalShell</code>.
                Notice the floating feedback pill pinned at the bottom right, the Warm Gold breadcrumbs divider,
                and the institutional legal footer at the bottom.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 bg-surface-raised border border-surface-border">
                <div class="text-2xl font-bold text-brand-primary">1,420</div>
                <div class="text-xs uppercase text-text-muted font-semibold mt-1">Active V2X Detectors</div>
              </div>
              <div class="p-4 bg-surface-raised border border-surface-border">
                <div class="text-2xl font-bold text-brand-primary">99.8%</div>
                <div class="text-xs uppercase text-text-muted font-semibold mt-1">Telemetry Uptime</div>
              </div>
              <div class="p-4 bg-surface-raised border border-surface-border">
                <div class="text-2xl font-bold text-brand-primary">12</div>
                <div class="text-xs uppercase text-text-muted font-semibold mt-1">Texas DOT Districts</div>
              </div>
            </div>
          </div>
        </TuxPortalShell>
      </div>

      <div v-if="lastFeedbackEvent" class="p-3 bg-surface-sunken border border-surface-border text-xs font-mono text-text-secondary">
        {{ lastFeedbackEvent }}
      </div>

      <TuxExample :vue="shellSnippet" :source="tuxPortalShellSource" />
    </section>

    <!-- Section 3: Architecture & Comm Alignment -->
    <section class="space-y-4">
      <TuxSectionHeader variant="institutional">
        Architecture & Brand Parity
      </TuxSectionHeader>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-text-secondary">
        <div class="p-5 bg-surface-raised border border-surface-border">
          <h3 class="font-bold text-text-primary text-base mb-2">Visual Alignment with Comm</h3>
          <ul class="space-y-2 list-disc pl-5">
            <li><strong>Aggie Maroon Utility Bar:</strong> Exact color parity with <code class="text-xs">var(--brand-primary)</code> and white links.</li>
            <li><strong>Warm Gold Underline:</strong> 2px <code class="text-xs">var(--brand-accent)</code> rule on active navigation items and breadcrumbs strip.</li>
            <li><strong>Sharp Kadence Button:</strong> Clean 0px border radius matching the default buttons on <code class="text-xs">tti.tamu.edu</code>.</li>
            <li><strong>Sub-Brand Lockup:</strong> Hairline divider allowing any division, research lab, or tool to sit beside the official winged-A logo.</li>
          </ul>
        </div>
        <div class="p-5 bg-surface-raised border border-surface-border">
          <h3 class="font-bold text-text-primary text-base mb-2">Developer Experience</h3>
          <ul class="space-y-2 list-disc pl-5">
            <li><strong>Zero Boilerplate:</strong> Single component gives any app institutional compliance in one line.</li>
            <li><strong>Deep Slots:</strong> Full customization via <code class="text-xs">#brand</code>, <code class="text-xs">#nav</code>, <code class="text-xs">#hero</code>, <code class="text-xs">#subnav</code>, and <code class="text-xs">#feedback</code>.</li>
            <li><strong>Responsive Mobile Drawer:</strong> Complete slideover menu with accordion sub-sections and utility links.</li>
            <li><strong>Accessibility:</strong> Full ARIA landmarks, keyboard esc dismissal, and focus ring compliance.</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>
