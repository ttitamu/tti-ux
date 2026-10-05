<script setup lang="ts">
/**
 * Workflow Kits & Application Suites Hub — TUX
 *
 * Provides live multi-device interactive preview, architectural blueprints,
 * component composition graphs, copyable starter scaffolds, and transition
 * mappings from legacy frozen reference prototypes to native TUX components.
 */

useHead({ title: "Workflow Kits & Application Suites · TUX" });

interface KitDefinition {
  id: string;
  title: string;
  eyebrow: string;
  category: "operations" | "marcom" | "intranet" | "publishing" | "developer";
  categoryLabel: string;
  exampleRoute: string;
  legacyUrl: string | null;
  summary: string;
  archetype: string;
  layoutShell: string;
  components: string[];
  keyRules: string[];
  scaffoldCode: string;
  reactScaffoldCode: string;
}

const kits: KitDefinition[] = [
  {
    id: "landscape",
    title: "Landscape Sensitive-Data Classifier",
    eyebrow: "product · security & IT",
    category: "operations",
    categoryLabel: "Operations & Telemetry",
    exampleRoute: "/examples/landscape-dashboard",
    legacyUrl: "/kits/landscape/index.html",
    summary: "Sensitive-data index overview with high-density KPI tiles, inline ingest-rate sparkline, treemap taxonomy, faceted file search, right-rail activity stream, and active-agent monitor.",
    archetype: "High-Density Operations",
    layoutShell: "sidebar layout + #header + #rail + #rail-footer + #aside",
    components: [
      "TuxBreadcrumbs",
      "TuxPageHeader",
      "TuxBigStat",
      "TuxFactoid",
      "TuxSparkline",
      "TuxAlert",
      "TuxTreemap",
      "TuxFilterPanel",
      "TuxSearch",
      "TuxBadge",
      "TuxPagination",
      "TuxSectionHeader",
      "TuxDescriptionList",
      "TuxCard",
    ],
    keyRules: [
      "Status is --status-*, never --brand-primary. Maroon is chrome, not state.",
      "High data density: hairline borders and tabular numbers throughout.",
      "Inline trendlines (TuxSparkline) accompany all core KPI summaries.",
    ],
    scaffoldCode: `<template>
  <NuxtLayout name="sidebar">
    <template #header>
      <UDashboardSidebarToggle />
      <TuxBreadcrumbs :trail="trail" />
      <div class="ml-auto flex items-center gap-3">
        <TuxBadge tone="brand">Indexed: 47.2 TB</TuxBadge>
        <TuxButton size="sm" icon="lucide:refresh-cw">Sync Indices</TuxButton>
      </div>
    </template>

    <template #rail-header="{ collapsed }">
      <div class="p-3 font-bold text-brand-primary">Landscape</div>
    </template>

    <template #rail="{ collapsed }">
      <UNavigationMenu :items="railItems" :collapsed="collapsed" />
    </template>

    <!-- Main High-Density Monitoring Grid -->
    <div class="p-6 space-y-6">
      <TuxPageHeader eyebrow="RESEARCH CORPUS" title="Index Overview" />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TuxFactoid value="47.2 TB" label="Indexed corpora" source="↑ 1.4 TB / 7d" />
        <TuxFactoid value="12.8M" label="Files tracked" source="↑ 124k / 7d" />
        <TuxFactoid value="203" label="Active scans" source="↓ 14 / 24h" />
      </div>

      <div class="flex items-center justify-between border-t border-surface-border pt-4">
        <TuxSectionHeader>Ingest Activity</TuxSectionHeader>
        <TuxSparkline :data="ingestTrend" :width="200" :height="36" />
      </div>
    </div>

    <template #aside>
      <div class="p-4 space-y-4">
        <p class="eyebrow">Realtime Agents</p>
        <!-- Agent status feed -->
      </div>
    </template>
  </NuxtLayout>
</template>`,
    reactScaffoldCode: `import React from 'react';
import {
  TuxBreadcrumbs,
  TuxFactoid,
  TuxBadge,
  TuxButton,
  TuxSectionHeader
} from '@tti/tti-ux-react';

export function LandscapeDashboard() {
  return (
    <div className="flex min-h-screen bg-surface-page text-text-primary">
      {/* Sidebar Rail */}
      <aside className="w-64 border-r border-surface-border p-4">
        <h2 className="font-bold text-brand-primary">Landscape</h2>
      </aside>

      {/* Main High-Density Workspace */}
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <TuxFactoid value="47.2 TB" label="Indexed Corpora" source="↑ 1.4 TB / 7d" />
          <TuxFactoid value="12.8M" label="Files Tracked" source="↑ 124k / 7d" />
          <TuxFactoid value="203" label="Active Scans" source="↓ 14 / 24h" />
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "ai-studio",
    title: "TTI AI Studio & Agentic Chat Session",
    eyebrow: "product · conversational AI",
    category: "publishing",
    categoryLabel: "Conversational & Agentic",
    exampleRoute: "/examples/tti-ai-studio-session",
    legacyUrl: "/kits/tti-ai-chat/index.html",
    summary: "Research LLM session interface featuring compliance policy banner, conversation history grouped by day, citation attribution blocks, context usage meter, and prompt composer.",
    archetype: "Conversational & Agentic Workspace",
    layoutShell: "Dual-rail workspace with sticky composer and right context rail",
    components: [
      "TuxBreadcrumbs",
      "TuxAlert",
      "TuxSectionHeader",
      "TuxCallout",
      "TuxDescriptionList",
      "TuxFactoid",
      "TuxAccordion",
      "TuxCommandPalette",
      "TuxButton",
      "TuxBadge",
    ],
    keyRules: [
      "Mandatory compliance disclaimer at the top of active session streams.",
      "Citations must bind to verified institutional publications and reports.",
      "Context meter warns operators prior to token exhaustion boundaries.",
    ],
    scaffoldCode: `<template>
  <div class="flex h-screen bg-surface-page text-text-primary">
    <!-- Day-Grouped Conversation History Rail -->
    <aside class="w-64 border-r border-surface-border p-4 flex flex-col justify-between">
      <div class="space-y-4">
        <TuxButton icon="lucide:plus" block>New Research Chat</TuxButton>
        <!-- Conversation List -->
      </div>
    </aside>

    <!-- Chat Conversation Stream -->
    <main class="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
      <TuxAlert tone="warning" title="Institutional Data Governance Notice">
        Restricted to CUI Level 2. Do not input ITAR export-controlled defense data.
      </TuxAlert>

      <div class="flex-1 space-y-4">
        <!-- Message bubbles, citation chips, artifact blocks -->
      </div>

      <!-- Sticky Prompt Composer -->
      <div class="border-t border-surface-border pt-4">
        <div class="flex items-center gap-2">
          <input class="flex-1 bg-surface-raised border border-surface-border rounded-md px-3 py-2 text-sm" placeholder="Ask TTI AI Studio..." />
          <TuxButton icon="lucide:send">Send</TuxButton>
        </div>
      </div>
    </main>

    <!-- Context & Grounding Rail -->
    <aside class="w-80 border-l border-surface-border p-4 space-y-4">
      <TuxSectionHeader>Grounding Sources</TuxSectionHeader>
      <!-- Active RAG sources and context meters -->
    </aside>
  </div>
</template>`,
    reactScaffoldCode: `import React from 'react';
import { TuxAlert, TuxButton, TuxSectionHeader, TuxBadge } from '@tti/tti-ux-react';

export function AIStudioSession() {
  return (
    <div className="flex h-screen bg-surface-page text-text-primary">
      <main className="flex-1 p-6 flex flex-col justify-between">
        <TuxAlert tone="warning" title="Research Data Policy">
          Restricted to CUI Level 2 data.
        </TuxAlert>
        <div className="border-t border-surface-border pt-3 flex gap-2">
          <input className="flex-1 border border-surface-border rounded p-2" placeholder="Prompt..." />
          <TuxButton>Send</TuxButton>
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "comm-portal",
    title: "TTI Communications & Public Portal",
    eyebrow: "marcom · flagship redesign",
    category: "marcom",
    categoryLabel: "Public Marcom & Editorial",
    exampleRoute: "/examples/comm-portal",
    legacyUrl: null,
    summary: "Flagship public redesign showcasing tti.tamu.edu conventions: two-tier portal header, architectural hero slab with diagonal chamfer, two-tone rules, orbital capability medallions, and sharp Kadence buttons.",
    archetype: "Public Brand & Editorial",
    layoutShell: "TuxPortalShell (Two-tier maroon utility bar + brand ribbon)",
    components: [
      "TuxPortalHeader",
      "TuxCommHero",
      "TuxSectionHeader",
      "TuxCapabilityCluster",
      "TuxTOC",
      "TuxButton",
      "TuxFooter",
    ],
    keyRules: [
      "Sharp button corners (shape='sharp') replicating Kadence WP theme conventions.",
      "Warm eggshell surface (#F9F9F7) used behind capability medallions.",
      "Two-tone section rules: maroon accent segment followed by warm gray keyline.",
    ],
    scaffoldCode: `<template>
  <div class="min-h-screen bg-surface-page text-text-primary">
    <!-- Two-Tier Institutional Header (Comm Mode) -->
    <TuxPortalHeader
      mode="comm"
      portal-title="Center for Transportation Innovation"
      portal-badge="Division 01"
      :nav-items="commNav"
      action-text="Partner With Us"
      sticky
    />

    <!-- Architectural Hero Slab (Diagonal Chamfer) -->
    <TuxCommHero
      title="Connected Mobility & Automated Corridors"
      subtitle="Transforming statewide transportation safety through rigorous proving-ground testing."
      kicker="DIVISION 01 · AUTOMATED SYSTEMS"
      cta-text="Explore Proving Grounds"
      cta-link="#capabilities"
    />

    <main class="max-w-7xl mx-auto py-12 px-6 space-y-12">
      <TuxSectionHeader
        variant="two-tone-rule"
        kicker="CORE EXPERTISE"
        title="Research Capabilities"
      />
      <TuxCapabilityCluster :items="capabilities" />
    </main>

    <TuxFooter />
  </div>
</template>`,
    reactScaffoldCode: `import React from 'react';
import { TuxButton, TuxSectionHeader } from '@tti/tti-ux-react';

export function CommPortal() {
  return (
    <div className="min-h-screen bg-surface-page text-text-primary">
      <header className="bg-brand-primary text-text-on-brand p-4">
        <h1 className="text-xl font-bold">Texas A&M Transportation Institute</h1>
      </header>
      <main className="max-w-6xl mx-auto py-12 px-6">
        <TuxSectionHeader kicker="DISCOVERY" title="Core Research Capabilities" />
      </main>
    </div>
  );
}`,
  },
  {
    id: "intranet",
    title: "MyTTI Intranet & Employee Portal",
    eyebrow: "internal · my.tti.tamu.edu",
    category: "intranet",
    categoryLabel: "Internal Enterprise & Operations",
    exampleRoute: "/examples/intranet-dashboard",
    legacyUrl: null,
    summary: "Flagship employee portal reproducing my.tti.tamu.edu: charcoal utility bar, 5-band institutional brand spectrum ribbon, 5-column metric banner, 6-tile fundamentals launcher grid, and signature green date chips.",
    archetype: "Internal Enterprise & Operations",
    layoutShell: "TuxPortalShell (Intranet mode with social icons + MY APPS launcher)",
    components: [
      "TuxPortalHeader",
      "TuxSpectrumRibbon",
      "TuxSpectrumFacts",
      "TuxTileGrid",
      "TuxEventCalendarRow",
      "TuxFooter",
    ],
    keyRules: [
      "5-band institutional spectrum ribbon acts as the brand divider between header and content.",
      "Green date chips (#2F6F4E) used exclusively for upcoming event calendar dates.",
      "Warm eggshell canvas background maintains friendly internal intranet warmth.",
    ],
    scaffoldCode: `<template>
  <div class="min-h-screen bg-surface-eggshell text-text-primary font-sans flex flex-col">
    <!-- Two-Tier Institutional Header (Intranet Mode) -->
    <TuxPortalHeader
      mode="intranet"
      portal-title="MyTTI Portal"
      portal-badge="Employee Hub"
      :nav-items="intranetNav"
    />

    <!-- 5-Band Institutional Brand Spectrum Ribbon -->
    <TuxSpectrumRibbon />

    <!-- 5-Column Quick Facts Metric Banner -->
    <TuxSpectrumFacts :facts="intranetFacts" />

    <main class="max-w-7xl mx-auto py-10 px-6 space-y-12">
      <!-- 6-Tile Fundamentals Launcher Grid -->
      <TuxTileGrid :tiles="coreServiceTiles" />

      <!-- Upcoming Events Row -->
      <TuxEventCalendarRow :events="upcomingEvents" />
    </main>

    <TuxFooter />
  </div>
</template>`,
    reactScaffoldCode: `import React from 'react';
import { TuxFactoid, TuxCard, TuxBadge } from '@tti/tti-ux-react';

export function MyTTIIntranet() {
  return (
    <div className="min-h-screen bg-surface-eggshell text-text-primary">
      <header className="bg-surface-raised border-b border-surface-border p-4">
        <h1 className="text-xl font-bold">MyTTI Intranet Portal</h1>
      </header>
      <main className="max-w-6xl mx-auto py-8 px-6 space-y-8">
        <div className="grid grid-cols-4 gap-4">
          <TuxFactoid value="60+" label="Internal Apps" />
          <TuxFactoid value="1,400" label="Researchers & Staff" />
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "atlas",
    title: "Atlas Policy Audit & Compliance Console",
    eyebrow: "security · atlas.tti.tamu.edu",
    category: "operations",
    categoryLabel: "Security, Governance & Audit",
    exampleRoute: "/examples/atlas",
    legacyUrl: null,
    summary: "Continuous compliance and tenant policy audit console reproducing atlas.tti.tamu.edu: M365 and Azure posture telemetry, 6-tile governance launcher, audit milestones, and findings ledger with remediation actions.",
    archetype: "Security & Governance",
    layoutShell: "Enterprise compliance console shell with telemetry header and findings ledger",
    components: [
      "TuxPortalHeader",
      "TuxSpectrumFacts",
      "TuxTileGrid",
      "TuxEventCalendarRow",
      "TuxStatus",
      "TuxButton",
      "TuxBadge",
    ],
    keyRules: [
      "100% WCAG 2.2 Level AAA compliance verified across all audit ledgers.",
      "Status chips use --status-* semantic tokens with accompanying text icons.",
      "Evidence lockers provide instant export for CMMC and TxRAMP auditors.",
    ],
    scaffoldCode: `<template>
  <div class="min-h-screen bg-surface-eggshell text-text-primary">
    <TuxPortalHeader mode="intranet" portal-title="Atlas Audit Console" />
    <TuxSpectrumFacts :facts="compliancePosture" />
    <main class="max-w-7xl mx-auto py-8 px-6 space-y-8">
      <TuxTileGrid :tiles="governanceEnclaves" />
      <!-- Policy Findings Ledger Table with TuxStatus -->
      <div class="border border-surface-border rounded-md bg-surface-raised p-4">
        <TuxSectionHeader>High-Priority Compliance Findings</TuxSectionHeader>
      </div>
    </main>
  </div>
</template>`,
    reactScaffoldCode: `import React from 'react';
import { TuxStatus, TuxBadge, TuxButton } from '@tti/tti-ux-react';

export function AtlasConsole() {
  return (
    <div className="min-h-screen bg-surface-page p-6 space-y-6">
      <h1 className="text-2xl font-bold">Atlas Policy Audit Console</h1>
      <div className="flex items-center gap-3">
        <TuxStatus state="warning" label="Review Pending" />
        <TuxBadge tone="brand">TxRAMP Level 2</TuxBadge>
      </div>
    </div>
  );
}`,
  },
  {
    id: "forgejo",
    title: "TTI Code / Forgejo Developer Platform",
    eyebrow: "developer · code.tti.tamu.edu",
    category: "developer",
    categoryLabel: "Developer Tools & Code Collaboration",
    exampleRoute: "/examples/forgejo-code",
    legacyUrl: null,
    summary: "Self-hosted Git repository portal reproducing code.tti.tamu.edu: branded Comm language with sharp buttons, 5-band spectrum division tags, Warm Gold keylines, file explorer tree, and eggshell README well.",
    archetype: "Developer Tools & Code Collaboration",
    layoutShell: "Repository header with commit metadata bar, tree explorer, and README renderer",
    components: [
      "TuxBreadcrumbs",
      "TuxTabs",
      "TuxButton",
      "TuxBadge",
      "TuxCodeBlock",
      "TuxStatus",
    ],
    keyRules: [
      "Sharp Kadence tabs with maroon underline indicators on active selection.",
      "Division-specific color chips (e.g. Connected Vehicles · #005480).",
      "Monospace fonts (JetBrains Mono) for commit SHAs, file paths, and branch names.",
    ],
    scaffoldCode: `<template>
  <div class="min-h-screen bg-surface-page text-text-primary">
    <TuxPortalHeader mode="comm" portal-title="TTI Code" />
    <div class="max-w-7xl mx-auto p-6 space-y-6">
      <div class="flex items-center justify-between">
        <TuxBreadcrumbs :trail="repoBreadcrumbs" />
        <div class="flex items-center gap-2">
          <TuxButton size="sm" icon="lucide:star">Star</TuxButton>
          <TuxButton size="sm" icon="lucide:git-fork">Fork</TuxButton>
        </div>
      </div>
      <!-- Repository Tabs (Code, Issues, PRs, Actions) -->
      <TuxTabs :items="repoTabs" v-model="activeTab" />
      <!-- File Tree + README well -->
    </div>
  </div>
</template>`,
    reactScaffoldCode: `import React from 'react';
import { TuxTabs, TuxBreadcrumbs, TuxButton, TuxBadge } from '@tti/tti-ux-react';

export function ForgejoCode() {
  return (
    <div className="min-h-screen bg-surface-page p-6 space-y-6">
      <h1 className="text-xl font-bold font-mono">tti / trans-analytics-engine</h1>
      <TuxBadge tone="brand">v3.4.0</TuxBadge>
    </div>
  );
}`,
  },
  {
    id: "corridor",
    title: "Connected Corridor Telemetry Feed",
    eyebrow: "product · research telemetry",
    category: "operations",
    categoryLabel: "Operational Telemetry & Transportation Research",
    exampleRoute: "/examples/corridor-analytics",
    legacyUrl: null,
    summary: "High-density operational research pane for Texas multimodal transportation networks: real-time sensor stations, speed trends, roadside unit health, and citation export.",
    archetype: "High-Density Operations",
    layoutShell: "Corridor selector header + speed trend sparkline + detector station table",
    components: [
      "TuxPageHeader",
      "TuxStatus",
      "TuxSparkline",
      "TuxAlert",
      "TuxBadge",
      "TuxCitationExport",
      "TuxButton",
    ],
    keyRules: [
      "High-frequency detector station telemetry updated without reflow jumps.",
      "Inline speed-profile sparkline captures 24h diurnal congestion profiles.",
      "Dataset citation export supports 6 standard formats (BibTeX, RIS, APA...).",
    ],
    scaffoldCode: `<template>
  <div class="p-6 space-y-6">
    <TuxPageHeader eyebrow="TELEMETRY FEED" title="I-35 Connected Corridor Operations" />
    <div class="flex items-center gap-4">
      <span class="text-sm text-text-secondary">24h Speed Trend:</span>
      <TuxSparkline :data="speedTrend" :width="240" :height="48" />
    </div>
    <!-- Station detector ledger with TuxStatus -->
    <TuxCitationExport :citation="corridorDatasetCitation" />
  </div>
</template>`,
    reactScaffoldCode: `import React from 'react';
import { TuxStatus, TuxBadge, TuxButton } from '@tti/tti-ux-react';

export function CorridorTelemetry() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">I-35 Multimodal Corridor Feed</h1>
      <TuxStatus state="ok" label="Sensors Operational" />
    </div>
  );
}`,
  },
  {
    id: "ops-board",
    title: "Operations & NOC Monitoring Board",
    eyebrow: "product · network operations",
    category: "operations",
    categoryLabel: "Operations & Network Monitoring",
    exampleRoute: "/examples/ops-board",
    legacyUrl: null,
    summary: "Zero-fork operational monitoring pane: status chips, row tints, gold heading keylines, hairline tables, and tux-ops.css overlay class API.",
    archetype: "High-Density Operations",
    layoutShell: "Monitoring pane with poller load sparkline and hairline status table",
    components: ["TuxStatus", "TuxSparkline", "TuxCard", "TuxBadge"],
    keyRules: [
      "Status is --status-*, never --brand-primary. Maroon is chrome. CRITICAL is true red.",
      "Gold is a keyline (.tux-ops-heading), never text.",
      "Chrome is a hairline (.tux-ops-rail, .tux-ops-table) using --surface-border.",
    ],
    scaffoldCode: `<template>
  <div class="p-6 space-y-6">
    <h2 class="tux-ops-heading text-lg font-bold">Network Operations Center</h2>
    <div class="grid grid-cols-4 gap-4">
      <div class="p-3 bg-surface-raised border border-surface-border">
        <TuxStatus state="ok" label="1,248 OK" />
      </div>
      <div class="p-3 bg-surface-raised border border-surface-border">
        <TuxStatus state="warning" label="14 WARNING" />
      </div>
      <div class="p-3 bg-surface-raised border border-surface-border">
        <TuxStatus state="critical" label="2 CRITICAL" />
      </div>
    </div>
  </div>
</template>`,
    reactScaffoldCode: `import React from 'react';
import { TuxStatus } from '@tti/tti-ux-react';

export function OpsBoard() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-lg font-bold">Operations Board</h2>
      <TuxStatus state="ok" label="All Pollers Healthy" />
    </div>
  );
}`,
  },
  {
    id: "paper-page",
    title: "Research Paper & Academic Publication",
    eyebrow: "publishing · academic article",
    category: "publishing",
    categoryLabel: "Research Publishing & Editorial",
    exampleRoute: "/examples/paper-page",
    legacyUrl: null,
    summary: "Full editorial-research paper page exercising the publishing cluster: author bylines, paper metadata, abstract, figure captions, inline citations, footnotes, and multi-format citation export.",
    archetype: "Research & Academic Publishing",
    layoutShell: "Academic article layout with centered prose, side margin notes, and bottom apparatus",
    components: [
      "TuxPageHeader",
      "TuxAuthorByline",
      "TuxPaperMeta",
      "TuxAbstract",
      "TuxFigureCaption",
      "TuxFootnote",
      "TuxCitationExport",
    ],
    keyRules: [
      "Optimal measure (65-75ch) for high readability in dense academic text.",
      "Full citation export (BibTeX, RIS, EndNote, APA 7th, Chicago, MLA).",
      "Figure captions include persistent permalink anchor targets.",
    ],
    scaffoldCode: `<template>
  <article class="max-w-4xl mx-auto py-12 px-6 space-y-8">
    <TuxPageHeader eyebrow="RESEARCH REPORT 0-7052-1" title="Connected Infrastructure Evaluation" />
    <TuxAuthorByline :authors="authors" />
    <TuxPaperMeta :doi="doi" :published="publishDate" />
    <TuxAbstract>Comprehensive evaluation of multimodal roadside sensors in Texas...</TuxAbstract>
    <!-- Paper content + TuxFigureCaption + TuxFootnote -->
    <TuxCitationExport :citation="paperCitation" />
  </article>
</template>`,
    reactScaffoldCode: `import React from 'react';
import { TuxSectionHeader } from '@tti/tti-ux-react';

export function ResearchPaper() {
  return (
    <article className="max-w-4xl mx-auto py-12 px-6">
      <TuxSectionHeader kicker="REPORT 0-7052" title="Connected Corridors" />
    </article>
  );
}`,
  },
  {
    id: "slides",
    title: "Executive Slide Deck & Briefing Suite",
    eyebrow: "deck system · 16:9 presentation",
    category: "publishing",
    categoryLabel: "Presentations & Executive Briefings",
    exampleRoute: "/kits/slides/index.html",
    legacyUrl: "/kits/slides/index.html",
    summary: "Executive presentation template in plain HTML and CSS: title slide, content slides, factoid slide, quote slide, and summary layout.",
    archetype: "Presentations & Executive Briefings",
    layoutShell: "16:9 widescreen presentation deck frame",
    components: ["TuxReportFrame", "TuxFactoid", "TuxBlockquote", "TuxSectionHeader"],
    keyRules: [
      "16:9 aspect ratio standard for modern high-resolution displays and projectors.",
      "High-contrast text sizing with clear hierarchical typography.",
      "Institutional Maroon and Warm Gold keyline accents.",
    ],
    scaffoldCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="/colors_and_type.css">
  <link rel="stylesheet" href="/kits/slides/deck.css">
</head>
<body>
  <div class="deck">
    <section class="slide slide--title">
      <p class="slide__eyebrow">Texas A&M Transportation Institute</p>
      <h1 class="slide__heading">Annual Transportation Research Briefing</h1>
    </section>
  </div>
</body>
</html>`,
    reactScaffoldCode: `import React from 'react';
import { TuxFactoid, TuxSectionHeader } from '@tti/tti-ux-react';

export function SlideDeck() {
  return (
    <div className="aspect-video bg-surface-page p-12 flex flex-col justify-between">
      <TuxSectionHeader kicker="TTI BRIEFING" title="Executive Summary" />
      <TuxFactoid value="\$124M" label="Research Expenditures" />
    </div>
  );
}`,
  },
];

// Active selection state
const selectedKitId = ref<string>("landscape");
const activeViewMode = ref<"stage" | "architecture" | "scaffold" | "legacy">("stage");
const selectedViewport = ref<"desktop" | "laptop" | "tablet" | "mobile">("desktop");
const selectedScaffoldTarget = ref<"nuxt" | "react">("nuxt");
const copied = ref(false);

const activeKit = computed(() => {
  return kits.find((k) => k.id === selectedKitId.value) ?? kits[0];
});

// Viewport pixel dimensions
const viewportWidthStyle = computed(() => {
  switch (selectedViewport.value) {
    case "laptop":
      return "1024px";
    case "tablet":
      return "768px";
    case "mobile":
      return "375px";
    case "desktop":
    default:
      return "100%";
  }
});

// Legacy prototype mappings
interface LegacyMapping {
  slug: string;
  legacyName: string;
  role: string;
  modernEquivalent: string;
  modernRoute: string;
  reason: string;
}

const legacyMappings: LegacyMapping[] = [
  {
    slug: "aggieux",
    legacyName: "AggieUX",
    role: "Static component catalog",
    modernEquivalent: "TUX Component Lab & Token Explorer",
    modernRoute: "/components",
    reason: "Static Babel-in-the-browser cards replaced with 110+ reactive Tux*.vue components, interactive knobs, live documentation, and zero-drift tests.",
  },
  {
    slug: "landscape",
    legacyName: "Landscape Prototype",
    role: "Sensitive-data classifier shell",
    modernEquivalent: "Landscape Dashboard Suite",
    modernRoute: "/examples/landscape-dashboard",
    reason: "Upgraded from static layout into a responsive multi-slot sidebar shell (NuxtLayout name='sidebar') with real KPI sparklines and faceted filters.",
  },
  {
    slug: "tti-docs",
    legacyName: "tti-docs Prototype",
    role: "Living style guide prototype",
    modernEquivalent: "Tux Desk Visual Web Builder & Design Docs",
    modernRoute: "/desk",
    reason: "Transformed into bidirectional block-canvas CMS (Tux Desk) and live MDC documentation (/design/*, /docs/*).",
  },
  {
    slug: "tti-ai-chat",
    legacyName: "tti-ai-chat Prototype",
    role: "Internal LLM chat UI",
    modernEquivalent: "TTI AI Studio Session",
    modernRoute: "/examples/tti-ai-studio-session",
    reason: "Rebuilt with full compliance alert boundaries, context meter gauge, prompt composer, citation attribution blocks, and command palette.",
  },
  {
    slug: "slides",
    legacyName: "Slides Kit",
    role: "HTML presentation deck",
    modernEquivalent: "TuxReportFrame Deck Kit & Studio",
    modernRoute: "/reports/frame",
    reason: "Added responsive print sheet engine, dimension switchers (16:9, Letter, A4), ink-saver simulation, and multi-format citation export.",
  },
];

function selectKit(id: string) {
  selectedKitId.value = id;
  // If the user selected legacy mode but the kit has no legacy prototype, reset to stage
  if (activeViewMode.value === "legacy" && !activeKit.value.legacyUrl) {
    activeViewMode.value = "stage";
  }
}

function copyScaffoldCode() {
  const code = selectedScaffoldTarget.value === "nuxt"
    ? activeKit.value.scaffoldCode
    : activeKit.value.reactScaffoldCode;
  navigator.clipboard.writeText(code);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}
</script>

<template>
  <div class="space-y-12">
    <!-- Hub Header -->
    <TuxPageHeader
      eyebrow="APPLICATION SUITES & WORKFLOW KITS"
      title="Workflow Kits & Application Suites"
    >
      Production application archetypes, multi-device viewport simulators, and
      architectural blueprints for Texas A&M Transportation Institute digital systems.
      Toggle between the live interactive stage, component composition maps, and ready-to-copy
      starter scaffolding.
    </TuxPageHeader>

    <!-- Key Metrics Ribbon -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="p-4 rounded-md bg-surface-raised border border-surface-border">
        <p class="eyebrow">Application Suites</p>
        <p class="text-2xl font-bold text-text-primary mt-1">10 Suites</p>
        <p class="text-xs text-text-muted mt-0.5">Turnkey production archetypes</p>
      </div>
      <div class="p-4 rounded-md bg-surface-raised border border-surface-border">
        <p class="eyebrow">Accessibility Standard</p>
        <p class="text-2xl font-bold text-brand-primary mt-1">WCAG 2.2 AAA</p>
        <p class="text-xs text-text-muted mt-0.5">Audited & verified contrast</p>
      </div>
      <div class="p-4 rounded-md bg-surface-raised border border-surface-border">
        <p class="eyebrow">Responsive Simulation</p>
        <p class="text-2xl font-bold text-text-primary mt-1">4 Viewports</p>
        <p class="text-xs text-text-muted mt-0.5">Desktop, Laptop, Tablet, Mobile</p>
      </div>
      <div class="p-4 rounded-md bg-surface-raised border border-surface-border">
        <p class="eyebrow">Framework Targets</p>
        <p class="text-2xl font-bold text-text-primary mt-1">11 Targets</p>
        <p class="text-xs text-text-muted mt-0.5">Vue 3, React 19, Blazor, WP...</p>
      </div>
    </div>

    <!-- Quick-Start Scaffolding Bar -->
    <div class="p-5 rounded-xl border border-surface-border bg-surface-card space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 class="text-sm font-bold text-text-primary flex items-center gap-2">
            <UIcon name="lucide:rocket" class="w-4 h-4 text-brand-primary" />
            <span>Fast Scaffolding Paths for Production Applications</span>
          </h2>
          <p class="text-xs text-text-muted mt-0.5">
            Select the fastest path to launch a new digital asset aligned with TTI Communications guidelines:
          </p>
        </div>
        <NuxtLink
          to="/docs/comm-handover"
          class="text-xs text-brand-primary hover:underline font-mono font-medium inline-flex items-center gap-1 shrink-0"
        >
          <span>Comm Handover Guide</span>
          <UIcon name="lucide:arrow-right" class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        <div class="p-3 rounded-lg bg-surface-sunken border border-surface-border flex flex-col justify-between space-y-2">
          <div>
            <span class="text-[10px] font-mono font-bold uppercase text-brand-primary">1. Visual Microsites &amp; Papers</span>
            <p class="text-xs font-semibold text-text-primary mt-1">Nuxt Studio Starter Template</p>
            <p class="text-[11px] text-text-muted mt-0.5">Zero-code markdown editing for researchers &amp; communications authors.</p>
          </div>
          <NuxtLink to="/install/nuxt-studio" class="text-xs text-brand-primary hover:underline font-medium inline-flex items-center gap-1">
            <span>templates/tux-starter-content</span>
            <UIcon name="lucide:arrow-right" class="w-3 h-3" />
          </NuxtLink>
        </div>

        <div class="p-3 rounded-lg bg-surface-sunken border border-surface-border flex flex-col justify-between space-y-2">
          <div>
            <span class="text-[10px] font-mono font-bold uppercase text-brand-primary">2. WordPress &amp; Intranets</span>
            <p class="text-xs font-semibold text-text-primary mt-1">Kadence Child Theme &amp; Plugin</p>
            <p class="text-[11px] text-text-muted mt-0.5">Pre-wired palette, 0px button geometry, utility bar, and Gutenberg patterns.</p>
          </div>
          <NuxtLink to="/install/wordpress" class="text-xs text-brand-primary hover:underline font-medium inline-flex items-center gap-1">
            <span>packages/wordpress/kadence-child-tti</span>
            <UIcon name="lucide:arrow-right" class="w-3 h-3" />
          </NuxtLink>
        </div>

        <div class="p-3 rounded-lg bg-surface-sunken border border-surface-border flex flex-col justify-between space-y-2">
          <div>
            <span class="text-[10px] font-mono font-bold uppercase text-brand-primary">3. Enterprise Nuxt &amp; React</span>
            <p class="text-xs font-semibold text-text-primary mt-1">Layer &amp; Component Packages</p>
            <p class="text-[11px] text-text-muted mt-0.5">183 auto-imported Nuxt components or 26 native React TSX primitives.</p>
          </div>
          <NuxtLink to="/docs" class="text-xs text-brand-primary hover:underline font-medium inline-flex items-center gap-1">
            <span>Multi-Platform SDK Hub</span>
            <UIcon name="lucide:arrow-right" class="w-3 h-3" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Live Stage & Inspector -->
    <section class="border border-surface-border rounded-lg bg-surface-raised overflow-hidden shadow-sm">
      <!-- Stage Control Bar -->
      <div class="p-4 border-b border-surface-border bg-surface-sunken flex flex-wrap items-center justify-between gap-4">
        <!-- Kit Selector -->
        <div class="flex items-center gap-2">
          <label for="kit-select" class="text-xs font-semibold text-text-muted uppercase tracking-wider hidden sm:inline">
            Suite:
          </label>
          <select
            id="kit-select"
            v-model="selectedKitId"
            class="bg-surface-raised text-text-primary border border-surface-border rounded-md px-3 py-1.5 text-sm font-medium focus:ring-1 focus:ring-brand-primary"
            @change="selectKit(selectedKitId)"
          >
            <option v-for="k in kits" :key="k.id" :value="k.id">
              {{ k.title }} ({{ k.categoryLabel }})
            </option>
          </select>
        </div>

        <!-- View Mode Switcher -->
        <div class="flex items-center gap-1 bg-surface-raised p-1 rounded-md border border-surface-border">
          <button
            type="button"
            class="px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5"
            :class="activeViewMode === 'stage' ? 'bg-brand-primary text-text-on-brand' : 'text-text-secondary hover:text-text-primary'"
            @click="activeViewMode = 'stage'"
          >
            <UIcon name="lucide:monitor" class="w-3.5 h-3.5" />
            <span>Interactive Stage</span>
          </button>
          <button
            type="button"
            class="px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5"
            :class="activeViewMode === 'architecture' ? 'bg-brand-primary text-text-on-brand' : 'text-text-secondary hover:text-text-primary'"
            @click="activeViewMode = 'architecture'"
          >
            <UIcon name="lucide:layers" class="w-3.5 h-3.5" />
            <span>Architecture & Slots</span>
          </button>
          <button
            type="button"
            class="px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5"
            :class="activeViewMode === 'scaffold' ? 'bg-brand-primary text-text-on-brand' : 'text-text-secondary hover:text-text-primary'"
            @click="activeViewMode = 'scaffold'"
          >
            <UIcon name="lucide:code-2" class="w-3.5 h-3.5" />
            <span>Starter Scaffold</span>
          </button>
          <button
            v-if="activeKit.legacyUrl"
            type="button"
            class="px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5"
            :class="activeViewMode === 'legacy' ? 'bg-brand-primary text-text-on-brand' : 'text-text-secondary hover:text-text-primary'"
            @click="activeViewMode = 'legacy'"
          >
            <UIcon name="lucide:history" class="w-3.5 h-3.5" />
            <span>Frozen Reference</span>
          </button>
        </div>

        <!-- Right Side: Viewport Controls & External Link -->
        <div class="flex items-center gap-2">
          <!-- Viewport toggles (active when on stage or legacy) -->
          <div
            v-if="activeViewMode === 'stage' || activeViewMode === 'legacy'"
            class="flex items-center gap-1 bg-surface-raised p-1 rounded-md border border-surface-border"
          >
            <button
              type="button"
              class="p-1 rounded text-xs transition-colors"
              :class="selectedViewport === 'desktop' ? 'bg-brand-primary text-text-on-brand' : 'text-text-muted hover:text-text-primary'"
              title="Desktop (100% / 1440px)"
              @click="selectedViewport = 'desktop'"
            >
              <UIcon name="lucide:monitor" class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-1 rounded text-xs transition-colors"
              :class="selectedViewport === 'laptop' ? 'bg-brand-primary text-text-on-brand' : 'text-text-muted hover:text-text-primary'"
              title="Laptop (1024px)"
              @click="selectedViewport = 'laptop'"
            >
              <UIcon name="lucide:laptop" class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-1 rounded text-xs transition-colors"
              :class="selectedViewport === 'tablet' ? 'bg-brand-primary text-text-on-brand' : 'text-text-muted hover:text-text-primary'"
              title="Tablet (768px)"
              @click="selectedViewport = 'tablet'"
            >
              <UIcon name="lucide:tablet" class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-1 rounded text-xs transition-colors"
              :class="selectedViewport === 'mobile' ? 'bg-brand-primary text-text-on-brand' : 'text-text-muted hover:text-text-primary'"
              title="Mobile (375px)"
              @click="selectedViewport = 'mobile'"
            >
              <UIcon name="lucide:smartphone" class="w-4 h-4" />
            </button>
          </div>

          <!-- Open in standalone window -->
          <a
            :href="activeViewMode === 'legacy' ? activeKit.legacyUrl! : activeKit.exampleRoute"
            target="_blank"
            rel="noopener"
            class="px-2.5 py-1 text-xs font-semibold rounded-md bg-surface-raised border border-surface-border text-text-primary hover:border-brand-primary flex items-center gap-1.5 transition-colors"
            title="Open live suite in a new browser window"
          >
            <span>Launch</span>
            <UIcon name="lucide:external-link" class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <!-- Active Kit Info Summary Header -->
      <div class="px-6 py-4 bg-surface-raised border-b border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <TuxBadge tone="primary">{{ activeKit.categoryLabel }}</TuxBadge>
            <span class="eyebrow">{{ activeKit.eyebrow }}</span>
          </div>
          <h2 class="text-xl font-bold text-text-primary mt-1">{{ activeKit.title }}</h2>
          <p class="text-sm text-text-secondary mt-0.5 max-w-3xl leading-relaxed">
            {{ activeKit.summary }}
          </p>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <div class="text-right hidden sm:block">
            <p class="text-[11px] font-mono text-text-muted">ARCHETYPE</p>
            <p class="text-xs font-semibold text-text-primary">{{ activeKit.archetype }}</p>
          </div>
          <NuxtLink
            :to="activeKit.exampleRoute"
            class="px-3 py-1.5 text-xs font-semibold rounded-md bg-brand-primary text-text-on-brand hover:opacity-95 transition-opacity"
          >
            View Full Example
          </NuxtLink>
        </div>
      </div>

      <!-- Stage Content Frame -->
      <div class="bg-surface-sunken p-4 flex justify-center min-h-[640px] overflow-x-auto">
        <!-- MODE 1: Interactive Live Stage -->
        <div
          v-if="activeViewMode === 'stage'"
          class="transition-all duration-200 border border-surface-border rounded-lg bg-surface-page overflow-hidden shadow-md flex flex-col"
          :style="{ width: viewportWidthStyle, height: '700px' }"
        >
          <!-- Simulated Browser Bar -->
          <div class="px-3 py-2 bg-surface-raised border-b border-surface-border flex items-center gap-2 text-xs text-text-muted">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-red-400 inline-block opacity-75" />
              <span class="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block opacity-75" />
              <span class="w-2.5 h-2.5 rounded-full bg-green-400 inline-block opacity-75" />
            </div>
            <div class="flex-1 bg-surface-sunken rounded px-2.5 py-0.5 font-mono text-[11px] text-text-secondary border border-surface-border/50 text-center truncate">
              https://tti.tamu.edu{{ activeKit.exampleRoute }}
            </div>
            <span class="font-mono text-[10px] text-text-muted uppercase">{{ selectedViewport }}</span>
          </div>

          <!-- Embedded Iframe -->
          <iframe
            :src="activeKit.exampleRoute"
            :title="activeKit.title"
            class="w-full flex-1 border-0"
            loading="lazy"
          />
        </div>

        <!-- MODE 2: Architecture & Blueprints -->
        <div v-else-if="activeViewMode === 'architecture'" class="w-full max-w-4xl space-y-6 p-4">
          <div class="p-6 rounded-lg bg-surface-page border border-surface-border space-y-4">
            <h3 class="text-lg font-bold text-text-primary flex items-center gap-2">
              <UIcon name="lucide:layers" class="w-5 h-5 text-brand-primary" />
              <span>Layout Shell & Named Slots</span>
            </h3>
            <p class="text-sm text-text-secondary">
              This application suite is organized around the <code>{{ activeKit.layoutShell }}</code> paradigm:
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div class="p-4 rounded border border-surface-border bg-surface-raised">
                <p class="text-xs font-mono font-bold text-brand-primary">#header</p>
                <p class="text-xs text-text-muted mt-1">
                  Breadcrumb trails, sidebar toggles, search inputs, and top-level action buttons.
                </p>
              </div>
              <div class="p-4 rounded border border-surface-border bg-surface-raised">
                <p class="text-xs font-mono font-bold text-brand-primary">#rail & #rail-header</p>
                <p class="text-xs text-text-muted mt-1">
                  Brand lockup, collapsible navigation menu, and persistent identity indicators.
                </p>
              </div>
              <div class="p-4 rounded border border-surface-border bg-surface-raised">
                <p class="text-xs font-mono font-bold text-brand-primary">default (Main Content)</p>
                <p class="text-xs text-text-muted mt-1">
                  High-density telemetry cards, KPI factoids, charts, data grids, and forms.
                </p>
              </div>
              <div class="p-4 rounded border border-surface-border bg-surface-raised">
                <p class="text-xs font-mono font-bold text-brand-primary">#aside / right-rail</p>
                <p class="text-xs text-text-muted mt-1">
                  Real-time activity logs, notification feeds, agent status, and contextual grounding.
                </p>
              </div>
            </div>
          </div>

          <!-- Composed Components -->
          <div class="p-6 rounded-lg bg-surface-page border border-surface-border space-y-4">
            <h3 class="text-lg font-bold text-text-primary flex items-center gap-2">
              <UIcon name="lucide:box" class="w-5 h-5 text-brand-primary" />
              <span>Composed TUX Components ({{ activeKit.components.length }})</span>
            </h3>
            <div class="flex flex-wrap gap-2">
              <NuxtLink
                v-for="c in activeKit.components"
                :key="c"
                :to="`/components/${c.replace(/^Tux/, '').toLowerCase()}`"
                class="px-2.5 py-1 rounded bg-surface-raised border border-surface-border text-xs font-mono text-text-primary hover:border-brand-primary hover:text-brand-primary transition-colors"
              >
                &lt;{{ c }} /&gt;
              </NuxtLink>
            </div>
          </div>

          <!-- Doctrine & Visual Rules -->
          <div class="p-6 rounded-lg bg-surface-page border border-surface-border space-y-3">
            <h3 class="text-lg font-bold text-text-primary flex items-center gap-2">
              <UIcon name="lucide:shield-check" class="w-5 h-5 text-brand-primary" />
              <span>Institutional Doctrine & Visual Rules</span>
            </h3>
            <ul class="space-y-2 text-sm text-text-secondary list-disc pl-5">
              <li v-for="(rule, idx) in activeKit.keyRules" :key="idx">
                {{ rule }}
              </li>
            </ul>
          </div>
        </div>

        <!-- MODE 3: Starter Scaffold -->
        <div v-else-if="activeViewMode === 'scaffold'" class="w-full max-w-4xl space-y-4 p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors"
                :class="selectedScaffoldTarget === 'nuxt' ? 'bg-brand-primary text-text-on-brand border-brand-primary' : 'bg-surface-raised text-text-secondary border-surface-border hover:text-text-primary'"
                @click="selectedScaffoldTarget = 'nuxt'"
              >
                Nuxt 4 / Vue 3 SFC
              </button>
              <button
                type="button"
                class="px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors"
                :class="selectedScaffoldTarget === 'react' ? 'bg-brand-primary text-text-on-brand border-brand-primary' : 'bg-surface-raised text-text-secondary border-surface-border hover:text-text-primary'"
                @click="selectedScaffoldTarget = 'react'"
              >
                React 19 / TSX
              </button>
            </div>

            <button
              type="button"
              class="px-3 py-1.5 text-xs font-semibold rounded-md bg-surface-raised border border-surface-border text-text-primary hover:border-brand-primary flex items-center gap-1.5 transition-colors"
              @click="copyScaffoldCode"
            >
              <UIcon :name="copied ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5" :class="copied ? 'text-green-500' : ''" />
              <span>{{ copied ? 'Copied!' : 'Copy Code' }}</span>
            </button>
          </div>

          <div class="rounded-lg overflow-hidden border border-surface-border bg-surface-page">
            <TuxCodeBlock
              :code="selectedScaffoldTarget === 'nuxt' ? activeKit.scaffoldCode : activeKit.reactScaffoldCode"
              :language="selectedScaffoldTarget === 'nuxt' ? 'vue' : 'tsx'"
            />
          </div>
        </div>

        <!-- MODE 4: Frozen Reference (Legacy Specimen) -->
        <div
          v-else-if="activeViewMode === 'legacy' && activeKit.legacyUrl"
          class="transition-all duration-200 border border-surface-border rounded-lg bg-surface-page overflow-hidden shadow-md flex flex-col"
          :style="{ width: viewportWidthStyle, height: '700px' }"
        >
          <div class="px-3 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs flex items-center justify-between text-amber-700 dark:text-amber-300">
            <span class="font-semibold flex items-center gap-1.5">
              <UIcon name="lucide:history" class="w-3.5 h-3.5" />
              Frozen Reference Prototype (Babel/Vanilla React from download phase)
            </span>
            <span class="font-mono text-[11px]">{{ activeKit.legacyUrl }}</span>
          </div>

          <iframe
            :src="activeKit.legacyUrl"
            :title="`${activeKit.title} legacy prototype`"
            class="w-full flex-1 border-0"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <!-- Institutional Application Archetypes -->
    <section class="space-y-6">
      <div>
        <p class="eyebrow">ARCHITECTURAL BLUEPRINTS</p>
        <h2 class="heading--bold text-2xl font-bold">Three Institutional Archetypes</h2>
        <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-3xl">
          TUX organizes all application suites into three foundational archetypes, each encoding
          distinct navigation patterns, data densities, and accessibility mandates.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Archetype 1 -->
        <div class="p-6 rounded-lg bg-surface-raised border border-surface-border space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="w-10 h-10 rounded-md bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <UIcon name="lucide:activity" class="w-5 h-5" />
            </div>
            <h3 class="text-lg font-bold text-text-primary">High-Density Operations & Telemetry</h3>
            <p class="text-sm text-text-secondary leading-relaxed">
              Designed for monitoring consoles, network operation centers, and data classifiers.
              Hairline tables, sparklines, and status chips deliver maximum information density with zero cognitive clutter.
            </p>
            <ul class="text-xs text-text-muted space-y-1.5 list-disc pl-4">
              <li>Status is <code>--status-*</code>, never maroon chrome</li>
              <li>Gold is an accent keyline, never text</li>
              <li>Hairline tables on <code>--surface-border</code></li>
            </ul>
          </div>
          <div class="pt-4 border-t border-surface-border">
            <p class="text-xs font-semibold text-text-primary">Featured Suites:</p>
            <div class="flex flex-wrap gap-1.5 mt-2">
              <button
                type="button"
                class="text-xs px-2 py-0.5 rounded bg-surface-page border border-surface-border hover:border-brand-primary"
                @click="selectKit('landscape')"
              >
                Landscape
              </button>
              <button
                type="button"
                class="text-xs px-2 py-0.5 rounded bg-surface-page border border-surface-border hover:border-brand-primary"
                @click="selectKit('ops-board')"
              >
                Ops Board
              </button>
              <button
                type="button"
                class="text-xs px-2 py-0.5 rounded bg-surface-page border border-surface-border hover:border-brand-primary"
                @click="selectKit('corridor')"
              >
                Corridor Telemetry
              </button>
            </div>
          </div>
        </div>

        <!-- Archetype 2 -->
        <div class="p-6 rounded-lg bg-surface-raised border border-surface-border space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="w-10 h-10 rounded-md bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <UIcon name="lucide:globe" class="w-5 h-5" />
            </div>
            <h3 class="text-lg font-bold text-text-primary">Public Brand & Editorial Portals</h3>
            <p class="text-sm text-text-secondary leading-relaxed">
              External marketing, institute division portals, and public research communication matching
              tti.tamu.edu conventions. Signature Kadence sharp buttons, 5-band spectrum ribbons, and orbital medallions.
            </p>
            <ul class="text-xs text-text-muted space-y-1.5 list-disc pl-4">
              <li>Two-tier maroon utility bar + brand ribbon</li>
              <li>Diagonal chamfer hero slabs with gold square</li>
              <li>Warm eggshell backgrounds (#F9F9F7)</li>
            </ul>
          </div>
          <div class="pt-4 border-t border-surface-border">
            <p class="text-xs font-semibold text-text-primary">Featured Suites:</p>
            <div class="flex flex-wrap gap-1.5 mt-2">
              <button
                type="button"
                class="text-xs px-2 py-0.5 rounded bg-surface-page border border-surface-border hover:border-brand-primary"
                @click="selectKit('comm-portal')"
              >
                Comm Portal
              </button>
              <button
                type="button"
                class="text-xs px-2 py-0.5 rounded bg-surface-page border border-surface-border hover:border-brand-primary"
                @click="selectKit('intranet')"
              >
                MyTTI Intranet
              </button>
            </div>
          </div>
        </div>

        <!-- Archetype 3 -->
        <div class="p-6 rounded-lg bg-surface-raised border border-surface-border space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="w-10 h-10 rounded-md bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <UIcon name="lucide:bot" class="w-5 h-5" />
            </div>
            <h3 class="text-lg font-bold text-text-primary">Workspaces, AI & Developer Platforms</h3>
            <p class="text-sm text-text-secondary leading-relaxed">
              Interactive employee tools, self-hosted code repositories, policy compliance consoles, and conversational
              LLM assistants. Grounded in command palettes, split panes, and verified citation blocks.
            </p>
            <ul class="text-xs text-text-muted space-y-1.5 list-disc pl-4">
              <li>Prompt composers with grounding context meters</li>
              <li>Strict CUI / ITAR compliance alert barriers</li>
              <li>Sharp tabs and monospace git commit ledgers</li>
            </ul>
          </div>
          <div class="pt-4 border-t border-surface-border">
            <p class="text-xs font-semibold text-text-primary">Featured Suites:</p>
            <div class="flex flex-wrap gap-1.5 mt-2">
              <button
                type="button"
                class="text-xs px-2 py-0.5 rounded bg-surface-page border border-surface-border hover:border-brand-primary"
                @click="selectKit('ai-studio')"
              >
                AI Studio
              </button>
              <button
                type="button"
                class="text-xs px-2 py-0.5 rounded bg-surface-page border border-surface-border hover:border-brand-primary"
                @click="selectKit('forgejo')"
              >
                TTI Code (Forgejo)
              </button>
              <button
                type="button"
                class="text-xs px-2 py-0.5 rounded bg-surface-page border border-surface-border hover:border-brand-primary"
                @click="selectKit('atlas')"
              >
                Atlas Audit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Transition Matrix: Frozen Reference Prototypes → Native TUX Components -->
    <section class="space-y-6">
      <div>
        <p class="eyebrow">EVOLUTION & MODERNIZATION</p>
        <h2 class="heading--bold text-2xl font-bold">Frozen Reference vs. Native TUX Components</h2>
        <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-3xl">
          The original five static reference kits in <code>/kits/&lt;name&gt;/</code> date from the portable-download
          phase. They are maintained as historical design source. In production, always compose the native
          <code>Tux*</code> components. Here is how every legacy prototype maps to its modern equivalent:
        </p>
      </div>

      <div class="border border-surface-border rounded-lg overflow-hidden bg-surface-raised">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="border-b border-surface-border bg-surface-sunken text-xs font-semibold uppercase text-text-muted">
              <th class="p-4">Legacy Kit</th>
              <th class="p-4">Original Prototype</th>
              <th class="p-4">Modern Native TUX Equivalent</th>
              <th class="p-4">Architectural Rationale</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-border">
            <tr v-for="m in legacyMappings" :key="m.slug" class="hover:bg-surface-page/50 transition-colors">
              <td class="p-4 font-mono font-bold text-brand-primary">
                <a :href="`/kits/${m.slug}/index.html`" target="_blank" rel="noopener" class="hover:underline flex items-center gap-1">
                  <span>/kits/{{ m.slug }}/</span>
                  <UIcon name="lucide:external-link" class="w-3 h-3 text-text-muted" />
                </a>
              </td>
              <td class="p-4 font-medium text-text-primary">{{ m.legacyName }}</td>
              <td class="p-4">
                <NuxtLink :to="m.modernRoute" class="font-semibold text-brand-primary hover:underline">
                  {{ m.modernEquivalent }} →
                </NuxtLink>
              </td>
              <td class="p-4 text-xs text-text-secondary leading-relaxed max-w-md">
                {{ m.reason }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Multi-Platform Kit Pipeline -->
    <section class="space-y-6">
      <div>
        <p class="eyebrow">DISTRIBUTION PIPELINE</p>
        <h2 class="heading--bold text-2xl font-bold">Multi-Platform Kit Targets</h2>
        <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-3xl">
          TUX distributes tokens and components across 11 target platforms through automated emitters
          and intermediate representation sync engines. Applications outside Nuxt 4 consume these targets directly:
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-5 rounded-lg bg-surface-raised border border-surface-border space-y-2">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-text-primary">React 19</h3>
            <TuxBadge tone="brand">Tier 2</TuxBadge>
          </div>
          <p class="text-xs text-text-secondary leading-relaxed">
            Typed TSX components and theme hooks for React SPA and Next.js applications.
          </p>
          <p class="text-[11px] font-mono text-text-muted pt-2">packages/react & kit/react</p>
        </div>

        <div class="p-5 rounded-lg bg-surface-raised border border-surface-border space-y-2">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-text-primary">CSS & Ops Overlay</h3>
            <TuxBadge tone="brand">Tier 1</TuxBadge>
          </div>
          <p class="text-xs text-text-secondary leading-relaxed">
            Zero-build token variables (tux-tokens.css), ops overlay (tux-ops.css), and WCAG bridge (tux-bridge.css).
          </p>
          <p class="text-[11px] font-mono text-text-muted pt-2">kit/css/</p>
        </div>

        <div class="p-5 rounded-lg bg-surface-raised border border-surface-border space-y-2">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-text-primary">.NET & Blazor</h3>
            <TuxBadge tone="brand">Tier 1 & 2</TuxBadge>
          </div>
          <p class="text-xs text-text-secondary leading-relaxed">
            Strongly typed C# classes (TuxTokens.cs) and Razor component wrappers for ASP.NET web apps.
          </p>
          <p class="text-[11px] font-mono text-text-muted pt-2">kit/csharp/</p>
        </div>

        <div class="p-5 rounded-lg bg-surface-raised border border-surface-border space-y-2">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-text-primary">WordPress / Kadence</h3>
            <TuxBadge tone="brand">Tier 1 & 2</TuxBadge>
          </div>
          <p class="text-xs text-text-secondary leading-relaxed">
            Gutenberg theme.json block settings and PHP 8 associative arrays matching tti.tamu.edu.
          </p>
          <p class="text-[11px] font-mono text-text-muted pt-2">kit/wp/ & kit/php/</p>
        </div>

        <div class="p-5 rounded-lg bg-surface-raised border border-surface-border space-y-2">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-text-primary">Power BI Desktop & Fabric</h3>
            <TuxBadge tone="brand">Tier 1</TuxBadge>
          </div>
          <p class="text-xs text-text-secondary leading-relaxed">
            Official institutional JSON theme files (tti-theme.json, tti-theme-dark.json, tti-theme-hc.json).
          </p>
          <p class="text-[11px] font-mono text-text-muted pt-2">kit/powerbi/</p>
        </div>

        <div class="p-5 rounded-lg bg-surface-raised border border-surface-border space-y-2">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-text-primary">Python / Streamlit / Dash</h3>
            <TuxBadge tone="brand">Tier 1 & 2</TuxBadge>
          </div>
          <p class="text-xs text-text-secondary leading-relaxed">
            Resolved color tokens (tux_tokens.py) and component renderers for research data science pipelines.
          </p>
          <p class="text-[11px] font-mono text-text-muted pt-2">kit/python/</p>
        </div>
      </div>
    </section>
  </div>
</template>
