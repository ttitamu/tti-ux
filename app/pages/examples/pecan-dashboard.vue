<script setup lang="ts">
useHead({ title: "Example · PECAN dashboard · TUX" });

definePageMeta({
  // Composition example — assembled from real Tux* components, but
  // the data is illustrative (fake corpora, fake scan IDs, etc.). The
  // point is to show how PECAN's IT-facing dashboard composes from
  // tux primitives, not to ship a real PECAN view.
});

const breadcrumb = [
  { label: "Home", to: "/" },
  { label: "Indices", to: "/examples/pecan-dashboard" },
  { label: "/research" },
];

const headlineFactoids = [
  { value: "47.2", suffix: " TB", label: "Indexed across all corpora", source: "Updated 2 min ago" },
  { value: "12.8", suffix: "M",   label: "Files tracked", source: "After dedup" },
  { value: "203",  suffix: null,  label: "Active scans · last 24h" },
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
  { id: "scan-83012ab1", path: "/research/grants/nsf-1234",                agent: "agent-02", started: "11:48:33", status: "complete" as const, files: 88_402 },
  { id: "scan-c0a18bbe", path: "/research/publications/2025",              agent: "agent-04", started: "11:21:19", status: "complete" as const, files: 12_207 },
  { id: "scan-d44ef902", path: "/research/scratch",                        agent: "agent-03", started: "10:55:00", status: "failed"   as const, files: 0 },
];

const page = ref(1);

const drillIntoFileExample = ref<string | null>(null);
</script>

<template>
  <div class="space-y-10">
    <!-- "This is a demo" notice — same shape across all three example
         pages so visitors immediately recognize the scope. -->
    <div class="example-demo-notice">
      <Icon name="lucide:layers" class="example-demo-notice__icon" aria-hidden="true" />
      <p class="example-demo-notice__text">
        <strong>Composition example.</strong>
        Illustrative data assembled into a real-shape PECAN dashboard
        — treemap, faceted file search, scan table, compliance alert.
        Twelve Tux* components composed from primitives.
      </p>
    </div>

    <TuxBreadcrumbs :trail="breadcrumb" />

    <!-- Page header with quick-fact media slot -->
    <TuxPageHeader
      tone="neutral"
      rhythm="hero"
      eyebrow="indices"
      title="/research"
    >
      Continuously indexed by 4 agent runtimes. Drift reconciler last
      ran at 12:00 CST. Last 24h: 203 scans queued, 198 complete, 4
      failed, 1 in progress.
      <template #actions>
        <TuxButton intent="primary" icon="lucide:play">Start scan</TuxButton>
        <TuxButton intent="ghost"   icon="lucide:download">Export catalog</TuxButton>
      </template>
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

    <!-- Headline metrics row -->
    <section>
      <TuxFactoid
        variant="default"
        :density="3"
        :items="headlineFactoids"
      />
    </section>

    <!-- Compliance alert: ITAR exists in this corpus -->
    <TuxAlert
      variant="compliance"
      title="ITAR-tagged records in this corpus"
    >
      174,022 files carry ITAR markers under
      <code class="font-mono">/research/grants/dod-xr-contracts/</code>.
      Access requires PECAN tier-3 token; do not surface in
      cross-tenant exports.
    </TuxAlert>

    <!-- Treemap: corpus size visualization -->
    <section class="space-y-3">
      <TuxSectionHeader>Corpus size · by directory</TuxSectionHeader>
      <TuxTreemap :data="treeData" :max-depth="2" color-by="size" />
    </section>

    <!-- Two-column: filter panel + results table -->
    <section class="space-y-3">
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
    </section>

    <!-- Side-by-side: file detail metadata + recent activity callout -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div>
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
      </div>

      <div class="space-y-4">
        <TuxSectionHeader>Recent activity</TuxSectionHeader>

        <TuxCallout kind="stat" variant="default">
          <p>
            Drift reconciler closed 412 stale entries this morning —
            mostly research-scratch files older than 90 days.
            <span class="link-tti">View reconciliation log</span>.
          </p>
        </TuxCallout>

        <TuxCallout kind="fact" variant="default">
          <p>
            <strong>Agent-04</strong> has been quiet since 12:14. Heartbeat
            says alive but no file events for ~6 minutes — investigating.
          </p>
        </TuxCallout>
      </div>
    </section>
  </div>
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

</style>
