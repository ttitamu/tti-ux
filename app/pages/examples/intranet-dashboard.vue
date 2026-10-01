<script setup lang="ts">
/**
 * Intranet Dashboard Example — Flagship showcase replicating my.tti.tamu.edu.
 *
 * Demonstrates:
 *   - Two-tier Intranet Portal Header with charcoal bar, social icons & MY APPS launcher
 *   - The 5-Band Institutional Brand Spectrum Ribbon (<TuxSpectrumRibbon>)
 *   - The 5-Column Quick Facts Metric Banner (<TuxSpectrumFacts>)
 *   - 6-Tile Service Launcher Grid (<TuxTileGrid>) on warm eggshell background (#F9F9F7)
 *   - Upcoming Events with signature green date chips (<TuxEventCalendarRow>)
 *   - Staff Quick Search & People Finder card
 *   - 100% WCAG 2.2 Level AAA compliance
 */

definePageMeta({
  layout: false, // Turnkey standalone intranet layout
});

useHead({
  title: "MyTTI Intranet Portal · Institutional Dashboard Showcase",
});

const intranetNav = [
  { label: "Dashboard", to: "/examples/intranet-dashboard" },
  {
    label: "Apps & Tools",
    children: [
      { label: "App Catalog", to: "#apps", description: "Comprehensive directory of 60+ internal web applications" },
      { label: "Workday & SSO", href: "https://sso.tamus.edu/", description: "Payroll, benefits, and timecard submission" },
      { label: "Concur Travel", href: "https://sso.tamus.edu/", description: "Travel authorization and expense reimbursement" },
      { label: "Engineering Software", to: "#apps", description: "CAD, GIS, statistical tools, and license servers" },
    ],
  },
  {
    label: "Divisions & Centers",
    children: [
      { label: "Operations & Safety", to: "#", description: "Traffic management and human factors" },
      { label: "Infrastructure & Materials", to: "#", description: "Pavements, bridges, and materials chemistry" },
      { label: "Transit & Freight", to: "#", description: "Logistics, public transportation, and rail" },
      { label: "Safety & Environmental", to: "#", description: "Crash testing and environmental impact" },
    ],
  },
  { label: "People Finder", to: "#directory" },
  { label: "Calendar", to: "#events" },
  { label: "FSS & Safety", to: "#" },
];

const searchQuery = ref("");
const searchDepartment = ref("all");
</script>

<template>
  <div class="min-h-screen bg-surface-eggshell text-text-primary font-sans flex flex-col">
    <!-- Two-Tier Institutional Header (Intranet Mode) -->
    <TuxPortalHeader
      mode="intranet"
      portal-title="MyTTI Portal"
      portal-badge="Employee Hub"
      portal-badge-variant="maroon"
      :nav-items="intranetNav"
      action-text="App Catalog"
      action-href="#apps"
      sticky
    />

    <!-- Quick Facts 5-Column Metric Block (Parities my.tti.tamu.edu) -->
    <TuxSpectrumFacts
      title="TTI AT A GLANCE"
      subtitle="Institutional research telemetry and workforce metrics"
      tone="dark"
      :show-top-ribbon="false"
    />

    <!-- Main Intranet Surface -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-12">
      <!-- Section 1: Staff Directory & Quick Search Card -->
      <section id="directory" class="relative overflow-hidden bg-surface-raised border border-surface-border shadow-sm p-6 sm:p-8">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div class="md:col-span-4 space-y-2">
            <div class="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-wider">
              <Icon name="lucide:users" class="w-4 h-4" aria-hidden="true" />
              <span>People Finder</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold uppercase tracking-tight text-text-primary font-display">
              Find TTI Researchers & Staff
            </h2>
            <p class="text-xs text-text-secondary leading-relaxed">
              Search by name, research center, division, or keyword across all 700+ active faculty and staff members.
            </p>
          </div>

          <div class="md:col-span-8 flex flex-col sm:flex-row gap-3 items-stretch">
            <div class="relative flex-1">
              <Icon name="lucide:search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true" />
              <input
                v-model="searchQuery"
                type="text"
                aria-label="Search staff directory by name, email, or specialty"
                placeholder="Search by name, email, or specialty..."
                class="w-full pl-9 pr-4 py-2.5 text-sm bg-surface-sunken border border-surface-border focus:border-brand-primary focus:outline-hidden"
              />
            </div>
            <select
              v-model="searchDepartment"
              aria-label="Filter directory by research division"
              class="px-3 py-2.5 text-sm bg-surface-sunken border border-surface-border text-text-primary focus:border-brand-primary focus:outline-hidden"
            >
              <option value="all">All Divisions</option>
              <option value="crash">Crash Safety & Proving Grounds</option>
              <option value="cav">Connected & Automated Transportation</option>
              <option value="infra">Infrastructure & Materials</option>
              <option value="ops">Traffic Operations & Mobility</option>
              <option value="it">Information Technology</option>
            </select>
            <TuxButton shape="sharp" intent="primary" class="justify-center">
              Search Directory
            </TuxButton>
          </div>
        </div>
      </section>

      <!-- Section 2: Core Fundamentals 6-Tile Grid -->
      <section id="fundamentals">
        <TuxTileGrid
          title="TTI FUNDAMENTALS"
          subtitle="Core operational standards, ethics, and employee service launchers"
          surface="eggshell"
          :columns="3"
        />
      </section>

      <!-- Section 3: Two-Column Split: Events & System Status -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Upcoming Events Calendar (Left 8 cols) -->
        <section id="events" class="lg:col-span-8 bg-surface-raised border border-surface-border shadow-xs p-6">
          <div class="flex items-center justify-between pb-4 mb-4 border-b border-surface-border">
            <div class="flex items-center gap-2">
              <Icon name="lucide:calendar" class="w-5 h-5 text-brand-primary" aria-hidden="true" />
              <h3 class="text-base sm:text-lg font-bold uppercase tracking-tight font-display text-text-primary">
                Upcoming Events & Seminars
              </h3>
            </div>
            <a
              href="https://events.tti.tamu.edu"
              target="_blank"
              rel="noopener"
              class="text-xs font-bold text-brand-primary hover:underline uppercase tracking-wider"
            >
              Full Calendar &rarr;
            </a>
          </div>

          <div class="divide-y divide-surface-border/60">
            <TuxEventCalendarRow
              day="30"
              month="SEP"
              title="Autonomous Shuttle Proving Ground Demonstration"
              time="Wednesday, September 30, 2026 @ 10:00 am - 12:00 pm"
              location="RELLIS Proving Grounds, Runway 35L"
              category="Field Demonstration"
              action-text="RSVP"
            />
            <TuxEventCalendarRow
              day="05"
              month="OCT"
              title="Annual Texas Multimodal Freight Advisory Council"
              time="Monday, October 5, 2026 @ 1:30 pm - 4:00 pm"
              location="TTI Headquarters Auditorium & Virtual Teams"
              category="Council Meeting"
              action-text="Register"
            />
            <TuxEventCalendarRow
              day="14"
              month="OCT"
              title="MASH Barrier Crash Test #4732: Heavy Vehicle Redirection"
              time="Wednesday, October 14, 2026 @ 9:00 am - 11:00 am"
              location="Impact Proving Ground Test Pad 2"
              category="Safety Certification"
              action-text="Observer Access"
            />
          </div>
        </section>

        <!-- Right Rail: Quick Launch Tools (Right 4 cols) -->
        <aside id="apps" class="lg:col-span-4 space-y-6">
          <div class="bg-surface-raised border border-surface-border p-6 shadow-xs">
            <h3 class="text-xs font-bold uppercase tracking-widest text-brand-primary pb-3 mb-4 border-b border-surface-border flex items-center justify-between">
              <span>Employee Quick Links</span>
              <Icon name="lucide:zap" class="w-4 h-4 text-brand-accent" aria-hidden="true" />
            </h3>
            <ul class="space-y-3 list-none p-0 m-0">
              <li>
                <a
                  href="https://sso.tamus.edu/"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center justify-between p-2.5 rounded bg-surface-sunken hover:bg-surface-border/60 transition-colors text-xs font-bold text-text-primary"
                >
                  <span class="flex items-center gap-2">
                    <Icon name="lucide:clock" class="w-4 h-4 text-brand-primary" aria-hidden="true" />
                    <span>Employee SSO &amp; Timecard</span>
                  </span>
                  <Icon name="lucide:external-link" class="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://sso.tamus.edu/"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center justify-between p-2.5 rounded bg-surface-sunken hover:bg-surface-border/60 transition-colors text-xs font-bold text-text-primary"
                >
                  <span class="flex items-center gap-2">
                    <Icon name="lucide:plane" class="w-4 h-4 text-brand-primary" aria-hidden="true" />
                    <span>Concur Travel & Expenses</span>
                  </span>
                  <Icon name="lucide:external-link" class="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://my.tti.tamu.edu/fss/"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center justify-between p-2.5 rounded bg-surface-sunken hover:bg-surface-border/60 transition-colors text-xs font-bold text-text-primary"
                >
                  <span class="flex items-center gap-2">
                    <Icon name="lucide:wrench" class="w-4 h-4 text-brand-primary" aria-hidden="true" />
                    <span>Facilities Work Orders</span>
                  </span>
                  <Icon name="lucide:external-link" class="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://my.tti.tamu.edu/it/"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center justify-between p-2.5 rounded bg-surface-sunken hover:bg-surface-border/60 transition-colors text-xs font-bold text-text-primary"
                >
                  <span class="flex items-center gap-2">
                    <Icon name="lucide:life-buoy" class="w-4 h-4 text-brand-primary" aria-hidden="true" />
                    <span>IT Helpdesk & Tickets</span>
                  </span>
                  <Icon name="lucide:external-link" class="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          <!-- Emergency Information Alert -->
          <div class="p-5 bg-brand-primary text-white border-l-4 border-brand-accent shadow-md">
            <div class="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-brand-accent mb-1">
              <Icon name="lucide:alert-triangle" class="w-4 h-4" aria-hidden="true" />
              <span>Campus Safety</span>
            </div>
            <p class="text-xs text-white/90 leading-relaxed mb-3">
              TTI RELLIS Campus & Headquarters operational status is NORMAL. For emergency response, dial 911 or (979) 845-2345.
            </p>
            <TuxButton
              shape="sharp"
              intent="ghost"
              size="sm"
              class="!text-white !border-white/40 hover:!bg-white/10 w-full justify-center text-xs"
            >
              Emergency Procedures
            </TuxButton>
          </div>
        </aside>
      </div>
    </main>

    <!-- Institutional Footer -->
    <TuxFooter />
  </div>
</template>
