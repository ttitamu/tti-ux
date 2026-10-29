<script setup>
// Per ADR-0010, keep top-level <script setup> expressions plain JS.
useHead({ title: "TuxFeedStatus · TUX" });

const initialConnectors = [
  {
    id: "feed-loops",
    name: "Inductive Loop Telemetry Stream",
    category: "Roadside Detection",
    status: "healthy",
    lastSynced: "2026-10-29 10:08",
    recordCount: 482910,
    lagLabel: "4s",
  },
  {
    id: "feed-wim",
    name: "Weigh-in-Motion Axle Classifier",
    category: "Freight Corridor",
    status: "stale",
    lastSynced: "2026-10-29 06:15",
    recordCount: 91420,
    lagLabel: "3h 54m",
    message: "Cellular backhaul intermittent at Milepost 214 cabinet; buffering locally.",
  },
  {
    id: "feed-rwis",
    name: "Pavement Surface Weather Stations",
    category: "Environmental",
    status: "syncing",
    lastSynced: "2026-10-29 10:05",
    recordCount: 18640,
    lagLabel: "32s",
  },
  {
    id: "feed-probe",
    name: "Connected Probe Trajectory Relay",
    category: "Corridor Speed",
    status: "error",
    lastSynced: "2026-10-29 02:30",
    recordCount: 0,
    lagLabel: "7h 39m",
    message: "Upstream TLS certificate expired on regional aggregator endpoint.",
  },
];

const feeds = ref(structuredClone(initialConnectors));
const syncLog = ref("");

function onSync(feedId) {
  syncLog.value = `Triggered manual sync for ${feedId}`;
  feeds.value = feeds.value.map((f) =>
    f.id === feedId
      ? {
          ...f,
          status: "healthy",
          lastSynced: "2026-10-29 10:12",
          lagLabel: "1s",
          message: undefined,
        }
      : f,
  );
}

function onSyncAll() {
  syncLog.value = "Triggered Sync All across 4 upstream connectors";
  feeds.value = feeds.value.map((f) => ({
    ...f,
    status: "healthy",
    lastSynced: "2026-10-29 10:12",
    lagLabel: "1s",
    message: undefined,
  }));
}

function resetFeeds() {
  feeds.value = structuredClone(initialConnectors);
  syncLog.value = "";
}

const listVue = `<tux-feed-status
  title="Corridor Telemetry Ingestion"
  :feeds="feeds"
  layout="list"
  @sync="onSync"
  @sync-all="onSyncAll"
/>`;

const gridVue = `<tux-feed-status
  title="Laboratory Instrument Streams"
  :feeds="feeds"
  layout="grid"
  :syncable="false"
/>`;

const typesTs = `export interface FeedConnectorItem {
  id: string;
  name: string;
  category?: string;
  status: "healthy" | "stale" | "syncing" | "error";
  lastSynced: string;
  recordCount?: number;
  lagLabel?: string;
  message?: string;
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · operations & telemetry" title="TuxFeedStatus">
      Upstream data connector and ingestion health monitor. Combines an
      aggregate health rollup strip and <em>Sync All</em> trigger with list or
      grid connector cards displaying mono record counts, replication lag, and
      per-feed sync controls.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · list layout with manual sync</p>
      <h2 class="heading--bold text-xl font-bold">Corridor telemetry connector monitor</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Each connector surfaces multi-channel status pills, tabular record
        counts, lag indicators, and inline diagnostic messages when stale or
        faulted. Clicking <em>Sync</em> or <em>Sync All</em> emits events so the
        host can trigger upstream reconciliation.
      </p>
      <TuxExample class="mt-4" :vue="listVue">
        <div class="max-w-3xl space-y-3">
          <TuxFeedStatus
            title="Corridor Telemetry Ingestion"
            :feeds="feeds"
            layout="list"
            @sync="onSync"
            @sync-all="onSyncAll"
          />
          <div class="flex items-center justify-between gap-3 text-xs font-mono text-text-muted">
            <span>{{ syncLog || "state: 1 healthy · 1 stale · 1 syncing · 1 error" }}</span>
            <button
              type="button"
              class="min-h-11 px-3 py-1.5 border border-surface-border rounded bg-surface-sunken text-text-primary cursor-pointer"
              @click="resetFeeds"
            >
              Reset feeds
            </button>
          </div>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">grid layout · read-only wallboard</p>
      <h2 class="heading--bold text-xl font-bold">Multi-column ingestion health grid</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Switch to <code>layout="grid"</code> and <code>:syncable="false"</code>
        for passive operations-center displays.
      </p>
      <TuxExample class="mt-4" :vue="gridVue">
        <TuxFeedStatus
          title="Laboratory Instrument Streams"
          :feeds="initialConnectors"
          layout="grid"
          :syncable="false"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Connector item interface</h2>
      <TuxCodeBlock class="mt-4" :code="typesTs" lang="ts" filename="TuxFeedStatus.ts" />
    </section>
  </div>
</template>
