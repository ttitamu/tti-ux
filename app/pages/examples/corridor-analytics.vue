<script setup lang="ts">
/**
 * /examples/corridor-analytics — Composition example demonstrating a high-density
 * operational research telemetry portal for connected transportation corridors.
 */
import type { TuxCitationData } from "../../components/TuxCitationExport.vue";

useHead({ title: "Example · Corridor Analytics · TUX" });

const selectedCorridor = ref("i35-austin");
const timeWindow = ref("live");
const segmentSearch = ref("");

const corridorOptions = [
  { id: "i35-austin", name: "I-35 Central Austin (MP 230 – 248)" },
  { id: "i10-katy", name: "I-10 Katy Freeway Managed (MP 750 – 768)" },
  { id: "sh130-bypass", name: "SH-130 Seguin to Georgetown (MP 40 – 85)" },
  { id: "us290-houston", name: "US-290 Northwest Corridor (MP 12 – 34)" },
];

const speedTrend = [
  62, 61, 59, 58, 54, 48, 42, 38, 41, 49, 55, 58, 60, 61, 59, 57, 53, 46, 43, 48, 54, 57, 58, 59
];

const sensorStations = ref([
  { id: "ST-35N-231", location: "Oltorf St Interchange", dir: "NB", milepost: "231.4", speed: 61, volume: 1840, occ: "14%", status: "ok" as const, rsu: "online" },
  { id: "ST-35N-233", location: "Riverside Dr Underpass", dir: "NB", milepost: "233.1", speed: 56, volume: 2120, occ: "18%", status: "ok" as const, rsu: "online" },
  { id: "ST-35N-235", location: "Lady Bird Lake Bridge", dir: "NB", milepost: "234.8", speed: 42, volume: 2480, occ: "28%", status: "warn" as const, rsu: "online" },
  { id: "ST-35N-237", location: "MLK Jr Blvd Exit 235B", dir: "NB", milepost: "236.2", speed: 45, volume: 2310, occ: "25%", status: "warn" as const, rsu: "online" },
  { id: "ST-35N-239", location: "Airport Blvd Overpass", dir: "NB", milepost: "238.9", speed: 58, volume: 1950, occ: "16%", status: "ok" as const, rsu: "online" },
  { id: "ST-35N-242", location: "US-290 E Split / St Johns", dir: "NB", milepost: "242.0", speed: 63, volume: 1720, occ: "12%", status: "ok" as const, rsu: "online" },
  { id: "ST-35S-235", location: "Lady Bird Lake Bridge SB", dir: "SB", milepost: "234.8", speed: 59, volume: 1980, occ: "15%", status: "ok" as const, rsu: "online" },
  { id: "ST-35S-238", location: "E 51st St Interchange", dir: "SB", milepost: "237.6", speed: 34, volume: 2600, occ: "34%", status: "critical" as const, rsu: "degraded" },
]);

const filteredStations = computed(() => {
  const q = segmentSearch.value.trim().toLowerCase();
  if (!q) return sensorStations.value;
  return sensorStations.value.filter(
    (s) =>
      s.id.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q) ||
      s.dir.toLowerCase().includes(q) ||
      s.milepost.includes(q)
  );
});

const datasetCitation: TuxCitationData = {
  authors: ["TTI Connected Infrastructure Team", "Texas Department of Transportation"],
  title: "I-35 Multimodal Connected Corridor Telemetry Feed: High-Resolution Roadside Sensing and C-V2X Telemetry",
  venue: "Texas A&M Transportation Institute Open Data Registry",
  year: 2026,
  doi: "10.5555/tti-data-corridor-i35-2026",
  publisher: "Texas A&M Transportation Institute",
};

const downloadedToast = ref(false);
function triggerDownload() {
  downloadedToast.value = true;
  setTimeout(() => {
    downloadedToast.value = false;
  }, 2500);
}
</script>

<template>
  <div class="space-y-8">
    <!-- Page Header with Corridor Metadata -->
    <TuxPageHeader eyebrow="product · telemetry & research" title="Corridor Analytics">
      Connected corridor operations pane for Texas multimodal transportation networks.
      Demonstrates high-density real-time detector feeds, speed/volume deltas,
      roadside unit (RSU) health, active traffic advisories, and instant academic citation & CSV dataset exports.
    </TuxPageHeader>

    <!-- Operational Control Strip -->
    <div class="p-4 bg-surface-raised border border-surface-border rounded-xl shadow-xs flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center gap-3 flex-wrap min-w-0 max-w-full">
        <div class="flex items-center gap-2 min-w-0 max-w-full">
          <UIcon name="lucide:route" class="w-4 h-4 shrink-0 text-brand-primary" />
          <span class="text-xs font-mono font-semibold uppercase text-text-muted">Corridor:</span>
          <select
            v-model="selectedCorridor"
            aria-label="Select Transportation Corridor"
            class="min-w-0 max-w-full bg-surface-sunken border border-surface-border rounded-md px-2.5 py-1.5 text-xs font-medium text-text-primary focus:border-brand-primary"
          >
            <option v-for="c in corridorOptions" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-1 bg-surface-sunken p-1 rounded-lg border border-surface-border text-xs">
          <button
            v-for="w in ['live', '1h', '24h', '7d']"
            :key="w"
            type="button"
            class="px-2.5 py-1 rounded font-mono font-semibold transition-colors cursor-pointer"
            :class="timeWindow === w ? 'bg-brand-primary text-text-inverse' : 'text-text-muted hover:text-text-primary'"
            @click="timeWindow = w"
          >
            {{ w.toUpperCase() }}
          </button>
        </div>
      </div>

      <div class="flex items-center gap-3 flex-wrap min-w-0 max-w-full">
        <div class="flex items-center gap-2 text-xs font-mono text-text-secondary">
          <TuxStatus state="ok" />
          <span>Feed Ingest Active (20ms latency)</span>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <TuxCitationExport :citation="datasetCitation" label="Cite dataset" variant="outline" />
          <TuxButton intent="primary" size="sm" icon="lucide:download" @click="triggerDownload">
            Export CSV
          </TuxButton>
        </div>
      </div>
    </div>

    <!-- Download Notification Toast -->
    <div
      v-if="downloadedToast"
      class="p-3 bg-brand-primary/10 border border-brand-primary/30 rounded-lg text-xs font-mono text-brand-primary flex items-center justify-between"
    >
      <span>✓ Telemetry snapshot staged: i35-austin-telemetry-live.csv (8 detector stations)</span>
      <button type="button" class="text-text-muted hover:text-text-primary" @click="downloadedToast = false">
        ✕
      </button>
    </div>

    <!-- KPI Factoids Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-4 bg-surface-raised border border-surface-border rounded-xl space-y-2">
        <div class="flex items-center justify-between text-xs text-text-muted font-mono">
          <span>AVERAGE SPEED</span>
          <span class="text-status-success font-semibold">↑ 3.2 mph</span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-bold font-mono tracking-tight text-text-primary">58.4</span>
          <span class="text-xs text-text-secondary">mph</span>
        </div>
        <div class="pt-2">
          <TuxSparkline :data="speedTrend" :width="160" :height="26" show-area />
        </div>
      </div>

      <div class="p-4 bg-surface-raised border border-surface-border rounded-xl space-y-2">
        <div class="flex items-center justify-between text-xs text-text-muted font-mono">
          <span>CORRIDOR VOLUME</span>
          <span class="text-text-muted font-semibold">↓ 4.1%</span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-bold font-mono tracking-tight text-text-primary">4,820</span>
          <span class="text-xs text-text-secondary">vph</span>
        </div>
        <p class="text-[11px] text-text-muted">Total across all monitored mainline lanes</p>
      </div>

      <div class="p-4 bg-surface-raised border border-surface-border rounded-xl space-y-2">
        <div class="flex items-center justify-between text-xs text-text-muted font-mono">
          <span>ACTIVE INCIDENTS</span>
          <TuxBadge tone="warn" size="xs">1 Advisory</TuxBadge>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-bold font-mono tracking-tight text-status-warn">1</span>
          <span class="text-xs text-text-secondary">work zone</span>
        </div>
        <p class="text-[11px] text-text-muted">MP 234.8 Lady Bird Lake (Right shoulder)</p>
      </div>

      <div class="p-4 bg-surface-raised border border-surface-border rounded-xl space-y-2">
        <div class="flex items-center justify-between text-xs text-text-muted font-mono">
          <span>CV BROADCAST RATE</span>
          <span class="text-status-success font-semibold">99.8%</span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-bold font-mono tracking-tight text-text-primary">18.6%</span>
          <span class="text-xs text-text-secondary">BSM share</span>
        </div>
        <p class="text-[11px] text-text-muted">Connected vehicle penetration in live platoon</p>
      </div>
    </div>

    <!-- Active Advisory Alert -->
    <TuxAlert
      tone="warn"
      title="Dynamic Variable Speed Limit Active (MP 234.8 – 236.2)"
    >
      Variable speed advisory in effect due to maintenance crew activity on the Lady Bird Lake bridge.
      Mainline posted limit reduced to 45 mph. Field compliance is currently <strong>89.2%</strong>.
    </TuxAlert>

    <!-- Geometric Roadway Cross-Section & 3D Spatial Corridor Analysis -->
    <section class="space-y-3">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p class="eyebrow">highway geometry & multi-lane cross-section</p>
          <h2 class="heading--bold text-lg font-bold">Cross-Sectional Corridor Analysis & 3D Spatial Geometry</h2>
        </div>
      </div>
      <TuxRoadwayCrossSection
        preset="urban-managed"
        initial-view="3d-perspective"
        height="520px"
      />
    </section>

    <!-- Detector Telemetry Table -->
    <section class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p class="eyebrow">field instrumentation</p>
          <h2 class="heading--bold text-lg font-bold">Detector Stations & Roadside Telemetry</h2>
        </div>

        <div class="relative w-64">
          <UIcon name="lucide:search" class="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            v-model="segmentSearch"
            type="search"
            placeholder="Filter stations by name or MP…"
            class="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-surface-sunken border border-surface-border text-text-primary placeholder:text-text-muted focus:border-brand-primary"
          />
        </div>
      </div>

      <div class="overflow-x-auto rounded-xl border border-surface-border bg-surface-raised shadow-xs">
        <table class="w-full text-left text-xs">
          <thead class="bg-surface-sunken font-mono text-[11px] font-semibold text-text-secondary uppercase border-b border-surface-border">
            <tr>
              <th class="p-3">Station</th>
              <th class="p-3">Location</th>
              <th class="p-3">Dir</th>
              <th class="p-3">Milepost</th>
              <th class="p-3">Speed</th>
              <th class="p-3">Volume</th>
              <th class="p-3">Occupancy</th>
              <th class="p-3">RSU Status</th>
              <th class="p-3">Health</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-border font-mono">
            <tr
              v-for="s in filteredStations"
              :key="s.id"
              class="hover:bg-surface-sunken/40 transition-colors"
            >
              <td class="p-3 font-semibold text-brand-primary">{{ s.id }}</td>
              <td class="p-3 font-sans text-text-primary font-medium">{{ s.location }}</td>
              <td class="p-3 text-text-secondary">{{ s.dir }}</td>
              <td class="p-3 text-text-muted">{{ s.milepost }}</td>
              <td class="p-3">
                <span
                  class="px-1.5 py-0.5 rounded font-semibold"
                  :class="[
                    s.speed >= 55
                      ? 'bg-status-success/15 text-status-success'
                      : s.speed >= 40
                      ? 'bg-status-warn/15 text-status-warn'
                      : 'bg-status-danger/15 text-status-danger'
                  ]"
                >
                  {{ s.speed }} mph
                </span>
              </td>
              <td class="p-3 text-text-secondary">{{ s.volume }} vph</td>
              <td class="p-3 text-text-muted">{{ s.occ }}</td>
              <td class="p-3">
                <span
                  class="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border"
                  :class="[
                    s.rsu === 'online'
                      ? 'border-status-success/30 text-status-success bg-status-success/10'
                      : 'border-status-warn/30 text-status-warn bg-status-warn/10'
                  ]"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="s.rsu === 'online' ? 'bg-status-success' : 'bg-status-warn'" />
                  {{ s.rsu }}
                </span>
              </td>
              <td class="p-3">
                <TuxStatus :state="s.status" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Composition Architecture Card -->
    <div class="p-6 bg-surface-sunken rounded-xl border border-surface-border space-y-3">
      <p class="eyebrow">tux composition architecture</p>
      <h3 class="heading--bold text-base font-bold">Components assembled on this surface</h3>
      <p class="text-xs text-text-secondary leading-relaxed max-w-3xl">
        This template composes <strong>8 TUX primitives</strong> into a production research dashboard:
        <code>TuxPageHeader</code>, <code>TuxStatus</code> (sensor health), <code>TuxSparkline</code> (velocity trend curves),
        <code>TuxAlert</code> (connected work zone warning), <code>TuxBadge</code> (status chips),
        <code>TuxCitationExport</code> (academic citation dropdown), <code>TuxButton</code> (primary download),
        and high-density tabular CSS variables.
      </p>
    </div>
  </div>
</template>
