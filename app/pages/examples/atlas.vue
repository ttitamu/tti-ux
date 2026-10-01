<script setup lang="ts">
/**
 * Atlas Audit Portal Showcase — Flagship compliance & policy corpus showcase.
 *
 * Demonstrates:
 *   - Turnkey Intranet shell with TuxPortalHeader (intranet mode) + 5-band spectrum ribbon
 *   - The 5-Column Quick Facts Metric Banner (<TuxSpectrumFacts>) for security telemetry
 *   - 6-Tile Governance Suite Launcher Grid (<TuxTileGrid>) on warm eggshell background
 *   - Upcoming Audit Milestones (<TuxEventCalendarRow>)
 *   - High-density policy compliance ledger with status chips and remediation triggers
 *   - 100% WCAG 2.2 Level AAA compliance
 */

definePageMeta({
  layout: false,
});

useHead({
  title: "Atlas · M365 & Azure Policy Audit Corpus · TUX",
});

const atlasNav = [
  { label: "Audit Overview", to: "/examples/atlas" },
  {
    label: "Governance Frameworks",
    children: [
      { label: "NIST SP 800-171 / CMMC", to: "#frameworks", description: "Controlled unclassified research computing enclaves" },
      { label: "M365 Tenant CIS Baselines", to: "#frameworks", description: "Identity, Exchange, Teams, and SharePoint compliance" },
      { label: "CJIS Law Enforcement Telemetry", to: "#frameworks", description: "Criminal justice information handling and transit" },
      { label: "StateRAMP & TxRAMP Level 2", to: "#frameworks", description: "Texas Department of Information Resources certification" },
    ],
  },
  {
    label: "Enclaves & Tenants",
    children: [
      { label: "TTI Production Tenant", to: "#enclaves", description: "Primary employee and research operations" },
      { label: "Connected Vehicle Azure Enclave", to: "#enclaves", description: "High-throughput V2X streaming infrastructure" },
      { label: "ITAR Restricted Research VPC", to: "#enclaves", description: "Air-gapped and hardened defense computing" },
      { label: "Student & Intern Sub-Tenants", to: "#enclaves", description: "FERPA-partitioned collaborative sandboxes" },
    ],
  },
  { label: "Evidence Locker", to: "#evidence" },
  { label: "Audit Schedule", to: "#schedule" },
  { label: "Drift Telemetry", to: "#drift" },
];

const atlasFacts = [
  {
    icon: "lucide:shield-check",
    value: "98.4%",
    label: "Overall Posture",
    subtext: "↑ 0.6% vs previous cycle",
    color: "maroon" as const,
  },
  {
    icon: "lucide:cloud",
    value: "14",
    label: "Monitored Enclaves",
    subtext: "Azure & M365 tenants",
    color: "blue" as const,
  },
  {
    icon: "lucide:git-pull-request-draft",
    value: "3",
    label: "Drift Remediations",
    subtext: "Pending CAB verification",
    color: "teal" as const,
  },
  {
    icon: "lucide:database",
    value: "4.2M",
    label: "Evidence Rows",
    subtext: "Cryptographically verified",
    color: "green" as const,
  },
  {
    icon: "lucide:award",
    value: "100%",
    label: "NIST / TxRAMP",
    subtext: "Active StateRAMP Level 2",
    color: "gold" as const,
  },
];

const atlasTiles = [
  {
    icon: "lucide:layers",
    title: "M365 Tenant Governance",
    subtitle: "Automated verification of Conditional Access, MFA enrollment, and DLP rules.",
    to: "#m365",
  },
  {
    icon: "lucide:server",
    title: "Azure Enclave Policies",
    subtitle: "ARM template auditing, NSG flow logs, and Key Vault access hygiene.",
    to: "#azure",
  },
  {
    icon: "lucide:shield-alert",
    title: "CJIS Telemetry Enforcement",
    subtitle: "Encryption at rest and in transit for law-enforcement camera feeds.",
    to: "#cjis",
  },
  {
    icon: "lucide:users-round",
    title: "FERPA Student Privacy",
    subtitle: "Partitioned sandboxes preventing unauthorized access to student records.",
    to: "#ferpa",
  },
  {
    icon: "lucide:refresh-cw",
    title: "Drift Detection Engine",
    subtitle: "Real-time alerting when infrastructure configurations drift from approved baselines.",
    to: "#drift",
  },
  {
    icon: "lucide:archive",
    title: "Immutable Evidence Locker",
    subtitle: "Tamper-evident logs formatted for internal and state regulatory audits.",
    to: "#evidence",
  },
];

const auditMilestones = [
  {
    day: "15",
    month: "OCT",
    title: "Texas DIR StateRAMP Annual Recertification Audit",
    time: "9:00 AM – 3:00 PM CDT · Virtual Evidence Review",
    category: "State Compliance",
    to: "#audit-dir",
  },
  {
    day: "28",
    month: "OCT",
    title: "Quarterly M365 Global Administrator Access Recertification",
    time: "1:30 PM – 3:00 PM CDT · Security Operations Center",
    category: "Identity Governance",
    to: "#audit-m365",
  },
  {
    day: "12",
    month: "NOV",
    title: "Connected Vehicle ITAR/CMMC Enclave Penetration Test",
    time: "All Day · Security Research Lab",
    category: "Technical Assessment",
    to: "#audit-cmmc",
  },
];

const policyFindings = [
  {
    id: "POL-800-171-3.1.1",
    framework: "NIST SP 800-171",
    title: "Limit System Access to Authorized Users",
    resource: "Azure-VPC-ITAR-EastUS",
    status: "Passed",
    severity: "Critical",
    lastScanned: "12 minutes ago",
  },
  {
    id: "POL-CIS-M365-2.1",
    framework: "CIS M365 Baseline",
    title: "Ensure Multi-Factor Authentication is Enabled for All Users",
    resource: "TTI-AAD-Tenant-Production",
    status: "Passed",
    severity: "High",
    lastScanned: "18 minutes ago",
  },
  {
    id: "POL-CJIS-5.10.1",
    framework: "CJIS v5.9",
    title: "Boundary Protection for Streaming Video Feeds",
    resource: "V2X-Edge-Dist-12-Houston",
    status: "Review",
    severity: "Medium",
    lastScanned: "34 minutes ago",
  },
  {
    id: "POL-TxRAMP-SEC-04",
    framework: "StateRAMP L2",
    title: "Automated Incident Notification Webhook Verification",
    resource: "Atlas-Ingest-Worker-Pool",
    status: "Passed",
    severity: "Low",
    lastScanned: "1 hour ago",
  },
];
</script>

<template>
  <div class="min-h-screen bg-surface-eggshell text-text-primary font-sans flex flex-col">
    <!-- Two-Tier Institutional Header (Intranet Mode) -->
    <TuxPortalHeader
      mode="intranet"
      portal-title="Atlas Audit Portal"
      portal-badge="Security & Compliance"
      portal-badge-variant="gold"
      :nav-items="atlasNav"
      :show-spectrum="true"
    />

    <!-- Main Content Canvas on Eggshell Wash -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <!-- Institutional Page Heading Rhythm -->
      <TuxSectionHeader
        :level="1"
        title="Atlas"
        secondary-title="Policy & Enclave Audit Corpus"
        variant="two-tone-rule"
        kicker="INSTITUTIONAL SECURITY OPERATIONS"
        subtitle="Continuous M365 tenant posture, Azure enclave policy validation, and CJIS/NIST audit readiness for Texas A&M Transportation Institute research computing."
      />

      <!-- Quick Telemetry Facts Banner (5 Division Colors) -->
      <TuxSpectrumFacts :facts="atlasFacts" />

      <!-- Governance & Audit Suites Grid -->
      <div>
        <TuxTileGrid
          title="Governance & Audit Suites"
          subtitle="Direct operational launchers for compliance auditors, researchers, and system administrators"
          :tiles="atlasTiles"
        />
      </div>

      <!-- Split Layout: Policy Findings Table & Audit Calendar -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left 2 Cols: Continuous Policy Findings Table -->
        <section class="lg:col-span-2 space-y-4" aria-label="Active Policy Evaluation Ledger">
          <TuxSectionHeader
            :level="2"
            title="Policy Evaluation"
            secondary-title="Real-Time Ledger"
            variant="two-tone-rule"
            subtitle="Automated checks executed across TTI Azure subscriptions and Microsoft 365 cloud workloads."
          />

          <div class="bg-surface-raised border border-surface-border rounded-lg overflow-hidden shadow-xs">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <caption class="sr-only">Atlas Active Policy Evaluation Ledger</caption>
                <thead>
                  <tr class="bg-surface-sunken border-b border-surface-border text-text-muted font-mono uppercase tracking-wider text-[11px]">
                    <th scope="col" class="py-3 px-4">Policy ID &amp; Rule</th>
                    <th scope="col" class="py-3 px-3">Framework</th>
                    <th scope="col" class="py-3 px-3">Resource Target</th>
                    <th scope="col" class="py-3 px-3">Status</th>
                    <th scope="col" class="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-surface-border">
                  <tr v-for="finding in policyFindings" :key="finding.id" class="hover:bg-surface-eggshell/60 transition-colors">
                    <td class="py-3.5 px-4">
                      <div class="font-bold text-text-primary">{{ finding.title }}</div>
                      <div class="font-mono text-[10px] text-text-muted">{{ finding.id }} · Scanned {{ finding.lastScanned }}</div>
                    </td>
                    <td class="py-3.5 px-3">
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-surface-sunken border border-surface-border text-text-secondary">
                        {{ finding.framework }}
                      </span>
                    </td>
                    <td class="py-3.5 px-3 font-mono text-[11px] text-text-muted truncate max-w-[140px]">
                      {{ finding.resource }}
                    </td>
                    <td class="py-3.5 px-3">
                      <span
                        v-if="finding.status === 'Passed'"
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-spectrum-green/10 text-spectrum-green border border-spectrum-green/20"
                      >
                        <UIcon name="lucide:check-circle-2" class="w-3 h-3" />
                        <span>Passed</span>
                      </span>
                      <span
                        v-else
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-brand-accent/15 text-brand-primary border border-brand-accent/30"
                      >
                        <UIcon name="lucide:alert-circle" class="w-3 h-3" />
                        <span>Review</span>
                      </span>
                    </td>
                    <td class="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold font-mono text-brand-primary hover:bg-brand-primary/10 rounded transition-colors cursor-pointer"
                        :aria-label="`View evidence for policy ${finding.id}`"
                      >
                        <span>Evidence</span>
                        <UIcon name="lucide:external-link" class="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Right 1 Col: Audit Milestones Calendar -->
        <section class="space-y-4" aria-label="Upcoming Audit Milestones">
          <TuxSectionHeader
            :level="2"
            title="Audit Milestones"
            secondary-title="Timeline"
            variant="two-tone-rule"
            subtitle="Scheduled recertifications and state auditor review windows."
          />

          <div class="space-y-3">
            <TuxEventCalendarRow
              v-for="evt in auditMilestones"
              :key="evt.title"
              :day="evt.day"
              :month="evt.month"
              :title="evt.title"
              :time="evt.time"
              :category="evt.category"
              :to="evt.to"
            />
          </div>
        </section>
      </div>
    </main>

    <!-- Institutional Footer -->
    <TuxFooter
      :columns="[
        {
          heading: 'Atlas Security Operations',
          links: [
            { label: 'Security Operations Center', href: '#' },
            { label: 'TTI Information Security', href: 'https://tti.tamu.edu/' },
            { label: 'Incident Reporting Hotline', href: '#' },
          ]
        },
        {
          heading: 'State Compliance',
          links: [
            { label: 'Texas DIR StateRAMP', href: 'https://dir.texas.gov/' },
            { label: 'NIST Computer Security Resource Center', href: 'https://csrc.nist.gov/' },
            { label: 'Open Records Policy', href: 'https://tti.tamu.edu/notices-policies/open-records-policy/' },
          ]
        }
      ]"
      copyright-text="© 2026 Texas A&M Transportation Institute · Atlas Governance Engine"
      copyright-href="https://tti.tamu.edu/notices-policies/copyright-statement/"
    />
  </div>
</template>
