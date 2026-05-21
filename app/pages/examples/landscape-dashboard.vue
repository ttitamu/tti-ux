<script setup lang="ts">
useHead({ title: "Example · Landscape dashboard · TUX" });

// Disable auto-layout so we can use `<NuxtLayout name="sidebar">`
// explicitly below — that's the only way to access the layout's
// named slots (#header, #rail-header, #rail, #rail-footer) with
// typed scope. See `sidebar-shell.vue` for the same pattern.
// (Landscape was previously named PECAN; see CHANGELOG.)
definePageMeta({ layout: false });

const breadcrumb = [
  { label: "Home", to: "/" },
  { label: "Indices", to: "/examples/landscape-dashboard" },
  { label: "/research" },
];

// Primary rail nav for the Landscape app shell. Two groups so the
// secondary set (Activity / Settings) sits visually below a divider.
const railItems = [
  [
    {
      label: "Indices",
      icon: "lucide:database",
      defaultOpen: true,
      children: [
        { label: "/research",    icon: "lucide:circle-dot", to: "/examples/landscape-dashboard" },
        { label: "/movementlab", icon: "lucide:circle",     to: "#" },
        { label: "/publications", icon: "lucide:circle",    to: "#" },
      ],
    },
    { label: "Scans",        icon: "lucide:scan-line",      to: "#" },
    { label: "Classifiers",  icon: "lucide:tag",            to: "#" },
    { label: "Agents",       icon: "lucide:server",         to: "#" },
  ],
  [
    { label: "Activity",     icon: "lucide:activity",       to: "#" },
    { label: "Settings",     icon: "lucide:settings",       to: "#" },
  ],
];

// Headline KPIs. The `source` field carries the delta-vs-previous
// reading that Snow Dashboard's KPI tiles popularized — colored
// arrow + magnitude + comparison window. Captured here as text so
// it travels with the factoid; renders inline below the label.
const headlineFactoids = [
  { value: "47.2", suffix: " TB", label: "Indexed across all corpora", source: "↑ 1.4 TB · last 7 days" },
  { value: "12.8", suffix: "M",   label: "Files tracked",              source: "↑ 124k · vs last week" },
  { value: "203",  suffix: null,  label: "Active scans · last 24h",    source: "↓ 14 · vs yesterday" },
];

// Ingest-rate trend data feeding the inline TuxSparkline next to
// the section header. 28 days, files/hr scaled. Captures the
// "summary KPIs above a trend line" composition Snow flagged
// (carried forward in roadmap as a TuxChartLine note).
const ingestTrend = [
  142, 168, 155, 189, 210, 174, 198, 221, 240, 226,
  248, 263, 281, 254, 275, 290, 305, 287, 312, 334,
  321, 348, 360, 342, 371, 388, 412, 397,
];

const filterFacets = [
  {
    name: "tier",
    label: "Access tier",
    buckets: [
      { value: "public",     label: "Public",     count: 4_120_843 },
      { value: "internal",   label: "Internal",   count: 6_411_203 },
      { value: "restricted", label: "Restricted", count: 2_230_117 },
      { value: "itar",       label: "ITAR",       count: 174_022 },
    ],
  },
  {
    name: "type",
    label: "File type",
    buckets: [
      { value: "pdf",   label: "PDF",         count: 5_840_902 },
      { value: "docx",  label: "Word doc",    count: 1_421_330 },
      { value: "xlsx",  label: "Spreadsheet", count: 864_021 },
      { value: "csv",   label: "CSV",         count: 728_410 },
    ],
  },
  {
    name: "owner",
    label: "Owner",
    collapsed: true,
    buckets: [
      { value: "rchen",      label: "R. Chen",     count: 88_211 },
      { value: "macosta",    label: "M. Acosta",   count: 64_300 },
      { value: "lvelazquez", label: "L. Velazquez", count: 49_804 },
    ],
  },
];

const filterState = ref<Record<string, string[]>>({
  tier: ["restricted"],
});

const treeData = {
  name: "/research",
  children: [
    {
      name: "grants",
      children: [
        { name: "nsf-1234",  size: 4_200_000_000_000 },
        { name: "txdot-78",  size: 1_800_000_000_000 },
        { name: "fhwa-2024", size: 950_000_000_000 },
      ],
    },
    {
      name: "movementlab",
      children: [
        { name: "raw-corridor-feeds", size: 8_400_000_000_000 },
        { name: "processed",          size: 2_100_000_000_000 },
      ],
    },
    {
      name: "publications",
      children: [
        { name: "2025",  size: 1_400_000_000_000 },
        { name: "2024",  size: 1_100_000_000_000 },
      ],
    },
    { name: "scratch", size: 320_000_000_000 },
  ],
};

const recentScans = [
  { id: "scan-7f5bd95a", path: "/research/movementlab/raw-corridor-feeds", agent: "agent-04", started: "12:14:08", status: "running" as const, files: 412_843 },
  { id: "scan-83012ab1", path: "/research/grants/nsf-1234",                agent: "agent-02", started: "11:48:33", status: "completed" as const, files: 88_402 },
  { id: "scan-c0a18bbe", path: "/research/publications/2025",              agent: "agent-04", started: "11:21:19", status: "completed" as const, files: 12_207 },
  { id: "scan-d44ef902", path: "/research/scratch",                        agent: "agent-03", started: "10:55:00", status: "failed"   as const, files: 0 },
];

const page = ref(1);

// Right-rail activity feed. Mirrors the Snow Dashboard "Activities"
// rail — recent events with a category icon, body, and relative
// timestamp. Composed via TuxCard, not a new component.
const activity = [
  { id: "a1", icon: "lucide:check-circle-2", text: "Drift reconciler closed 412 stale entries.", when: "8 min ago", tone: "success" as const },
  { id: "a2", icon: "lucide:alert-triangle", text: "Agent-04 heartbeat quiet for 6 min — investigating.", when: "12 min ago", tone: "warning" as const },
  { id: "a3", icon: "lucide:scan-line",      text: "scan-7f5bd95a started: /movementlab/raw-corridor-feeds", when: "32 min ago", tone: "neutral" as const },
  { id: "a4", icon: "lucide:tag",            text: "Classifier CLS-204 promoted to production.", when: "1 hr ago", tone: "neutral" as const },
  { id: "a5", icon: "lucide:user-plus",      text: "M. Acosta added to /research/grants.", when: "3 hr ago", tone: "neutral" as const },
];

// Active agents tile. Compact list with status dot + heartbeat
// freshness. Composed via TuxCard.
const agents = [
  { id: "agent-02", status: "online"  as const, heartbeat: "1s ago",  load: "12%" },
  { id: "agent-03", status: "online"  as const, heartbeat: "2s ago",  load: "47%" },
  { id: "agent-04", status: "warning" as const, heartbeat: "6m ago",  load: "—"   },
  { id: "agent-05", status: "online"  as const, heartbeat: "1s ago",  load: "8%"  },
];
</script>

<template>
  <NuxtLayout name="sidebar">
    <!-- Top bar across the panel: page-shape breadcrumb + primary
         actions. Sidebar toggle (UDashboardSidebarToggle) is required
         here so the rail can collapse on narrow viewports. -->
    <template #header>
      <div class="flex items-center justify-between gap-3 px-6 py-3 border-b border-surface-border bg-surface-page">
        <div class="flex items-center gap-3 min-w-0">
          <UDashboardSidebarToggle />
          <TuxBreadcrumbs :trail="breadcrumb" />
        </div>
        <div class="flex items-center gap-2">
          <TuxButton intent="ghost"   icon="lucide:play"     size="sm">Start scan</TuxButton>
          <TuxButton intent="primary" icon="lucide:download" size="sm">Export catalog</TuxButton>
        </div>
      </div>
    </template>

    <!-- Brand lockup at the top of the rail. `collapsed` hides the
         text in icon-only mode (lg viewport). -->
    <template #rail-header="{ collapsed }">
      <div class="px-3 py-3 border-b border-surface-border">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-md bg-brand-primary text-text-inverse grid place-items-center font-bold text-xs flex-shrink-0">
            L
          </div>
          <div v-if="!collapsed" class="min-w-0">
            <p class="text-sm font-bold text-text-primary truncate">Landscape</p>
            <p class="text-xs text-text-muted truncate">data index</p>
          </div>
        </div>
      </div>
    </template>

    <!-- Rail nav body. Two groups (primary + secondary) rendered via
         UNavigationMenu so the collapse mechanics are inherited. -->
    <template #rail="{ collapsed }">
      <UNavigationMenu
        orientation="vertical"
        :items="railItems"
        :collapsed="collapsed"
        class="px-2 py-3"
      />
    </template>

    <!-- User chip pinned to the bottom of the rail. -->
    <template #rail-footer="{ collapsed }">
      <div class="px-3 py-3 border-t border-surface-border">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-full bg-surface-sunken text-text-secondary grid place-items-center font-semibold text-xs flex-shrink-0">
            AG
          </div>
          <div v-if="!collapsed" class="min-w-0 flex-1">
            <p class="text-xs font-semibold text-text-primary truncate">A. Guevara</p>
            <p class="text-xs text-text-muted truncate">IT · TTI</p>
          </div>
        </div>
      </div>
    </template>

    <!-- ──── Main panel content. ──── -->
    <div class="p-6 space-y-10">

      <!-- Composition-example notice. Shared shape across the three
           /examples pages so visitors recognize the scope. -->
      <div class="example-demo-notice">
        <Icon name="lucide:layers" class="example-demo-notice__icon" aria-hidden="true" />
        <p class="example-demo-notice__text">
          <strong>Composition example.</strong>
          Illustrative data assembled into a real-shape Landscape
          dashboard — sidebar shell, KPI row with deltas, ingest-rate
          sparkline, treemap, faceted file search, scan table,
          activity rail. Composes ~15 Tux* + Nuxt UI 4 primitives.
        </p>
      </div>

      <!-- Page header. The hero BigStat in #media anchors the page —
           Snow's "Total" stat top-left equivalent. -->
      <TuxPageHeader
        tone="neutral"
        rhythm="hero"
        eyebrow="indices"
        title="/research"
      >
        Continuously indexed by 4 agent runtimes. Drift reconciler last
        ran at 12:00 CST. Last 24h: 203 scans queued, 198 complete, 4
        failed, 1 in progress.
        <template #media>
          <TuxBigStat
            :value="47.2"
            suffix=" TB"
            label="Indexed across all corpora"
            tone="maroon"
            size="lg"
          />
        </template>
      </TuxPageHeader>

      <!-- Headline KPI row. Each item carries a delta-vs-previous
           reading in `source` — captured from the Snow Dashboard
           absorption (a TuxChartLine roadmap follow-up will lift
           these into proper trend overlays). -->
      <section>
        <TuxFactoid
          variant="default"
          :density="3"
          :items="headlineFactoids"
        />
      </section>

      <!-- Compliance alert: ITAR exists in this corpus. Session-level
           banner per the form-validation conventions doc. -->
      <TuxAlert
        variant="compliance"
        title="ITAR-tagged records in this corpus"
      >
        174,022 files carry ITAR markers under
        <code class="font-mono">/research/grants/dod-xr-contracts/</code>.
        Access requires Landscape tier-3 token; do not surface in
        cross-tenant exports.
      </TuxAlert>

      <!-- Treemap with an inline sparkline next to the section
           header — demonstrates the "section title + trend at a
           glance" pattern that Snow and the Charts UI Kit both
           lean on. -->
      <section class="space-y-3">
        <div class="flex items-end justify-between gap-4 flex-wrap">
          <TuxSectionHeader class="mb-0">Corpus size · by directory</TuxSectionHeader>
          <div class="flex items-center gap-3 text-xs text-text-muted">
            <span class="font-mono">Ingest · 28 days</span>
            <TuxSparkline
              :data="ingestTrend"
              :width="160"
              :height="28"
              tone="success"
              show-last-point
              show-delta
              aria-summary="Ingest rate, files per hour, last 28 days"
              units="files/hr"
            />
          </div>
        </div>
        <TuxTreemap :data="treeData" :max-depth="2" color-by="size" />
      </section>

      <!-- Files (filter + table) + right-rail aside. The right rail
           composes existing primitives (TuxCard + icon list) — not a
           layout-level slot; the carry-forward roadmap note on
           `sidebar.vue#aside` waits for a second consumer surface
           before being formalized. -->
      <section class="grid grid-cols-1 xl:grid-cols-[1fr_18rem] gap-6 items-start">

        <!-- Main column: filter panel + results table -->
        <div class="space-y-3">
          <TuxSectionHeader>Files · 1.2M results</TuxSectionHeader>
          <div class="grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6 items-start">
            <TuxFilterPanel
              v-model="filterState"
              :facets="filterFacets"
              title="Filter results"
            />
            <div class="space-y-4">
              <div class="flex items-center justify-between gap-3">
                <TuxSearch
                  size="slim"
                  placeholder="Search filename, path, owner…"
                />
                <TuxButton intent="secondary" icon="lucide:sliders-horizontal" size="sm">
                  Columns
                </TuxButton>
              </div>

              <table class="tux-table w-full">
                <thead>
                  <tr class="border-b-2 border-brand-primary">
                    <th class="text-left text-xs uppercase tracking-wider text-text-muted py-2 px-3 font-bold">Scan</th>
                    <th class="text-left text-xs uppercase tracking-wider text-text-muted py-2 px-3 font-bold">Path</th>
                    <th class="text-left text-xs uppercase tracking-wider text-text-muted py-2 px-3 font-bold">Agent</th>
                    <th class="text-left text-xs uppercase tracking-wider text-text-muted py-2 px-3 font-bold">Started</th>
                    <th class="text-left text-xs uppercase tracking-wider text-text-muted py-2 px-3 font-bold">Files</th>
                    <th class="text-left text-xs uppercase tracking-wider text-text-muted py-2 px-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="scan in recentScans" :key="scan.id" class="border-b border-surface-border text-sm">
                    <td class="py-2.5 px-3 font-mono text-xs">{{ scan.id }}</td>
                    <td class="py-2.5 px-3 font-mono text-xs text-text-secondary">{{ scan.path }}</td>
                    <td class="py-2.5 px-3 font-mono text-xs">{{ scan.agent }}</td>
                    <td class="py-2.5 px-3 font-mono text-xs tabular-nums">{{ scan.started }}</td>
                    <td class="py-2.5 px-3 font-mono text-xs tabular-nums">{{ scan.files.toLocaleString() }}</td>
                    <td class="py-2.5 px-3"><TuxBadge :status="scan.status" /></td>
                  </tr>
                </tbody>
              </table>

              <TuxPagination
                v-model="page"
                :total="1_215_402"
                :page-size="20"
                show-status
                noun="file"
              />
            </div>
          </div>
        </div>

        <!-- Right rail: Recent activity + Active agents. Snow's
             "Notifications / Activities / Contacts" trio collapsed
             to the two that matter for a data-index dashboard. -->
        <aside class="space-y-4">

          <TuxCard>
            <p class="eyebrow">Recent activity</p>
            <ul class="mt-3 space-y-3">
              <li
                v-for="ev in activity"
                :key="ev.id"
                class="flex gap-2.5 text-sm"
              >
                <Icon
                  :name="ev.icon"
                  class="w-4 h-4 mt-0.5 flex-shrink-0"
                  :class="{
                    'text-text-success': ev.tone === 'success',
                    'text-text-warning': ev.tone === 'warning',
                    'text-text-muted':   ev.tone === 'neutral',
                  }"
                  aria-hidden="true"
                />
                <div class="min-w-0">
                  <p class="text-text-primary leading-snug">{{ ev.text }}</p>
                  <p class="text-xs text-text-muted mt-0.5">{{ ev.when }}</p>
                </div>
              </li>
            </ul>
          </TuxCard>

          <TuxCard>
            <p class="eyebrow">Active agents</p>
            <ul class="mt-3 space-y-2.5">
              <li
                v-for="agent in agents"
                :key="agent.id"
                class="flex items-center gap-2 text-sm"
              >
                <span
                  class="agent-dot"
                  :class="`agent-dot--${agent.status}`"
                  aria-hidden="true"
                />
                <span class="font-mono text-xs text-text-primary">{{ agent.id }}</span>
                <span class="ml-auto text-xs font-mono tabular-nums text-text-muted">{{ agent.load }}</span>
              </li>
            </ul>
            <p class="mt-3 text-xs text-text-muted">
              <Icon name="lucide:clock" class="inline w-3 h-3 -mt-0.5" aria-hidden="true" />
              Heartbeats refreshed every 5s
            </p>
          </TuxCard>
        </aside>
      </section>

      <!-- File detail (full width). Description list with editorial
           emphasis "data" — mono terms, tabular numerics on values. -->
      <section>
        <TuxDescriptionList
          title="File · findings.pdf"
          emphasis="data"
          :items="[
            { term: 'path',       value: '/research/grants/nsf-1234/data/2026/Q4/findings.pdf' },
            { term: 'size',       value: '4,217,832 bytes' },
            { term: 'modified',   value: '2026-04-22T14:33:18Z' },
            { term: 'owner',      value: 'rchen@tti.tamu.edu' },
            { term: 'tier' },
            { term: 'classifier' },
          ]"
        >
          <template #value-4>
            <TuxBadge color="error">ITAR</TuxBadge>
            <TuxBadge color="warning">Restricted</TuxBadge>
          </template>
          <template #value-5>
            <code class="font-mono text-xs">CLS-204</code>
            · <span class="text-text-secondary">0.87 confidence</span>
          </template>
        </TuxDescriptionList>
      </section>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.tux-table {
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  overflow: hidden;
  border-collapse: separate;
  border-spacing: 0;
}

.tux-table thead tr {
  background: color-mix(in srgb, var(--brand-primary) 6%, var(--surface-raised));
}

/* Agent status dot — small filled circle whose color encodes the
   heartbeat tone. Used in the right-rail Active-agents tile. */
.agent-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: var(--text-muted);
  display: inline-block;
  flex-shrink: 0;
}
.agent-dot--online  { background: var(--color-success, #16a34a); }
.agent-dot--warning { background: var(--color-warning, #d97706); }
.agent-dot--offline { background: var(--color-error,   #dc2626); }
</style>
