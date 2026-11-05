<script setup lang="ts">
/**
 * TuxResourceMeter — live compute & storage pool capacity vs. allocation efficiency meter.
 *
 * Renders dual-overlay capacity channels (0..capacity) contrasting reserved/allocated
 * slices against actual active utilization, computing per-channel and aggregate pool
 * efficiency while flagging idle over-reservation ("zombie" quota) and saturation.
 */
import { computed } from "vue";

export interface ResourceChannelMetric {
  id: string;
  label: string;
  capacity: number;
  allocated: number;
  utilized: number;
  unit: string;
}

type PoolStatusState = "ok" | "warning" | "critical" | "maintenance";
type ChannelHealthFlag = "nominal" | "idle-waste" | "saturated";

interface EnrichedChannel {
  raw: ResourceChannelMetric;
  allocatedPct: number;
  utilizedOfCapacityPct: number;
  efficiencyPct: number;
  flag: ChannelHealthFlag;
  flagLabel: string;
}

interface Props {
  title: string;
  subtitle?: string;
  poolStatus?: PoolStatusState;
  channels: ResourceChannelMetric[];
  wasteThresholdRatio?: number;
  saturationThresholdRatio?: number;
  reclaimLabel?: string;
  showReclaimAction?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: undefined,
  poolStatus: "ok",
  wasteThresholdRatio: 0.35,
  saturationThresholdRatio: 0.85,
  reclaimLabel: "Reclaim Idle",
  showReclaimAction: true,
});

const emit = defineEmits<{
  reclaim: [flaggedChannels: ResourceChannelMetric[]];
  selectChannel: [channel: ResourceChannelMetric];
}>();

function clampRatio(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), 1);
}

function formatMetric(value: number): string {
  return Number.isInteger(value)
    ? value.toLocaleString("en-US")
    : value.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

const enrichedChannels = computed<EnrichedChannel[]>(() =>
  props.channels.map((ch) => {
    const cap = ch.capacity > 0 ? ch.capacity : 0;
    const allocatedRatio = cap > 0 ? clampRatio(ch.allocated / cap) : 0;
    const utilizedRatio = cap > 0 ? clampRatio(ch.utilized / cap) : 0;
    const effRatio =
      ch.allocated > 0
        ? clampRatio(ch.utilized / ch.allocated)
        : ch.utilized > 0
          ? 1
          : 0;

    let flag: ChannelHealthFlag = "nominal";
    let flagLabel = "Balanced";

    if (cap > 0 && ch.utilized / cap >= props.saturationThresholdRatio) {
      flag = "saturated";
      flagLabel = "Saturated";
    } else if (
      cap > 0 &&
      ch.allocated / cap >= 0.25 &&
      ch.allocated > 0 &&
      ch.utilized / ch.allocated < props.wasteThresholdRatio
    ) {
      flag = "idle-waste";
      flagLabel = "Idle Waste";
    }

    return {
      raw: ch,
      allocatedPct: Number((allocatedRatio * 100).toFixed(1)),
      utilizedOfCapacityPct: Number((utilizedRatio * 100).toFixed(1)),
      efficiencyPct: Math.round(effRatio * 100),
      flag,
      flagLabel,
    };
  }),
);

const flaggedWasteChannels = computed<ResourceChannelMetric[]>(() =>
  enrichedChannels.value
    .filter((item) => item.flag === "idle-waste")
    .map((item) => item.raw),
);

const saturatedCount = computed<number>(
  () => enrichedChannels.value.filter((item) => item.flag === "saturated").length,
);

const poolEfficiencyPct = computed<number>(() => {
  const active = props.channels.filter((ch) => ch.allocated > 0);
  if (active.length === 0) return 100;
  const sum = active.reduce(
    (acc, ch) => acc + clampRatio(ch.utilized / ch.allocated),
    0,
  );
  return Math.round((sum / active.length) * 100);
});

const poolStatusLabel = computed<string>(() => {
  switch (props.poolStatus) {
    case "warning":
      return "Warning";
    case "critical":
      return "Critical";
    case "maintenance":
      return "Maintenance";
    case "ok":
    default:
      return "Operational";
  }
});

function onReclaimClick() {
  emit("reclaim", flaggedWasteChannels.value);
}
</script>

<template>
  <div class="tux-resource-meter">
    <!-- Header & Aggregate Efficiency Rollup -->
    <div class="tux-resource-meter__header">
      <div class="tux-resource-meter__heading-group">
        <div class="tux-resource-meter__title-row">
          <h3 class="tux-resource-meter__title">{{ title }}</h3>
          <span class="tux-resource-meter__status-pill">
            <span
              class="tux-resource-meter__dot"
              :class="`tux-resource-meter__dot--${poolStatus}`"
              aria-hidden="true"
            />
            <span>{{ poolStatusLabel }}</span>
          </span>
        </div>
        <p v-if="subtitle" class="tux-resource-meter__subtitle">
          {{ subtitle }}
        </p>
      </div>

      <div class="tux-resource-meter__header-actions">
        <div class="tux-resource-meter__rollup" role="group" aria-label="Pool efficiency summary">
          <span class="tux-resource-meter__rollup-pill">
            <span class="tux-resource-meter__rollup-key">Pool Efficiency</span>
            <span class="tux-resource-meter__rollup-val">{{ poolEfficiencyPct }}%</span>
          </span>
          <span
            v-if="flaggedWasteChannels.length > 0"
            class="tux-resource-meter__rollup-pill"
          >
            <span class="tux-resource-meter__dot tux-resource-meter__dot--warning" aria-hidden="true" />
            <span>{{ flaggedWasteChannels.length }} over-reserved</span>
          </span>
          <span
            v-if="saturatedCount > 0"
            class="tux-resource-meter__rollup-pill"
          >
            <span class="tux-resource-meter__dot tux-resource-meter__dot--critical" aria-hidden="true" />
            <span>{{ saturatedCount }} saturated</span>
          </span>
        </div>

        <button
          v-if="showReclaimAction && flaggedWasteChannels.length > 0"
          type="button"
          class="tux-resource-meter__reclaim-btn min-h-11"
          @click="onReclaimClick"
        >
          <span>{{ reclaimLabel }}</span>
          <span class="tux-resource-meter__reclaim-count">{{ flaggedWasteChannels.length }}</span>
        </button>
      </div>
    </div>

    <!-- Legend Strip -->
    <div class="tux-resource-meter__legend" aria-hidden="true">
      <span class="tux-resource-meter__legend-item">
        <span class="tux-resource-meter__swatch tux-resource-meter__swatch--utilized" />
        <span>Active Utilized</span>
      </span>
      <span class="tux-resource-meter__legend-item">
        <span class="tux-resource-meter__swatch tux-resource-meter__swatch--allocated" />
        <span>Reserved / Allocated</span>
      </span>
      <span class="tux-resource-meter__legend-item">
        <span class="tux-resource-meter__swatch tux-resource-meter__swatch--unallocated" />
        <span>Unallocated Pool Headroom</span>
      </span>
    </div>

    <!-- Channels List -->
    <ul v-if="enrichedChannels.length > 0" class="tux-resource-meter__channels">
      <li
        v-for="item in enrichedChannels"
        :key="item.raw.id"
        class="tux-resource-meter__channel-item"
      >
        <button
          type="button"
          class="tux-resource-meter__channel-btn min-h-11"
          :class="`tux-resource-meter__channel-btn--${item.flag}`"
          @click="emit('selectChannel', item.raw)"
        >
          <span class="tux-resource-meter__channel-top">
            <span class="tux-resource-meter__channel-label">{{ item.raw.label }}</span>

            <span class="tux-resource-meter__channel-badges">
              <span class="tux-resource-meter__efficiency-chip">
                {{ item.efficiencyPct }}% eff
              </span>
              <span class="tux-resource-meter__flag-pill">
                <span
                  class="tux-resource-meter__dot"
                  :class="{
                    'tux-resource-meter__dot--ok': item.flag === 'nominal',
                    'tux-resource-meter__dot--warning': item.flag === 'idle-waste',
                    'tux-resource-meter__dot--critical': item.flag === 'saturated',
                  }"
                  aria-hidden="true"
                />
                <span>{{ item.flagLabel }}</span>
              </span>
            </span>
          </span>

          <!-- Dual-overlay bar: 0..capacity -->
          <span class="tux-resource-meter__track" aria-hidden="true">
            <span
              class="tux-resource-meter__bar-allocated"
              :style="{ width: `${item.allocatedPct}%` }"
            />
            <span
              class="tux-resource-meter__bar-utilized"
              :class="{
                'tux-resource-meter__bar-utilized--ok': item.flag === 'nominal' && poolStatus !== 'maintenance',
                'tux-resource-meter__bar-utilized--warning': item.flag === 'idle-waste' && poolStatus !== 'maintenance',
                'tux-resource-meter__bar-utilized--critical': item.flag === 'saturated' && poolStatus !== 'maintenance',
                'tux-resource-meter__bar-utilized--maintenance': poolStatus === 'maintenance',
              }"
              :style="{ width: `${item.utilizedOfCapacityPct}%` }"
            />
          </span>

          <span class="tux-resource-meter__channel-meta">
            <span class="tux-resource-meter__readout">
              <strong>{{ formatMetric(item.raw.utilized) }}</strong>
              / {{ formatMetric(item.raw.allocated) }} allocated
              <span class="tux-resource-meter__capacity-note">
                (of {{ formatMetric(item.raw.capacity) }} {{ item.raw.unit }})
              </span>
            </span>
            <span class="tux-resource-meter__pct-note">
              {{ item.allocatedPct }}% reserved · {{ item.utilizedOfCapacityPct }}% active
            </span>
          </span>
        </button>
      </li>
    </ul>

    <p v-else class="tux-resource-meter__empty" role="status">
      No resource channels configured for this pool.
    </p>
  </div>
</template>

<style scoped>
.tux-resource-meter {
  --focus-ring: var(--focus-ring-outer);
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  padding: var(--space-16);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-body);
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.tux-resource-meter__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-12);
  min-width: 0;
}

.tux-resource-meter__heading-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
  flex: 1 1 14rem;
}

.tux-resource-meter__title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.tux-resource-meter__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5;
  color: var(--text-primary);
}

.tux-resource-meter__subtitle {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-secondary);
  max-width: 72ch;
}

.tux-resource-meter__header-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-8);
  min-width: 0;
}

.tux-resource-meter__rollup {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.tux-resource-meter__status-pill,
.tux-resource-meter__rollup-pill,
.tux-resource-meter__flag-pill,
.tux-resource-meter__efficiency-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  line-height: 1.5;
  white-space: nowrap;
}

.tux-resource-meter__status-pill,
.tux-resource-meter__flag-pill {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.6875rem;
  letter-spacing: var(--tracking-wide);
}

.tux-resource-meter__rollup-key {
  color: var(--text-secondary);
}

.tux-resource-meter__rollup-val {
  font-weight: 700;
  color: var(--text-primary);
}

.tux-resource-meter__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.tux-resource-meter__dot--ok {
  background: var(--status-ok);
}

.tux-resource-meter__dot--warning {
  background: var(--status-warning);
}

.tux-resource-meter__dot--critical {
  background: var(--status-critical);
}

.tux-resource-meter__dot--maintenance {
  background: var(--status-maintenance);
}

.tux-resource-meter__reclaim-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-16);
  border-radius: var(--radius-sm);
  border: 1px solid var(--brand-fill);
  background-color: var(--brand-fill);
  color: var(--text-on-brand);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.5;
  cursor: pointer;
  transition: background-color var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard);
}

.tux-resource-meter__reclaim-btn:hover {
  background-color: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
}

.tux-resource-meter__reclaim-btn:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}

.tux-resource-meter__reclaim-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.375rem;
  padding: 0 0.375rem;
  border-radius: 9999px;
  background-color: var(--surface-page);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.5;
}

.tux-resource-meter__legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-8) var(--space-16);
  padding: var(--space-8) var(--space-12);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.tux-resource-meter__legend-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
}

.tux-resource-meter__swatch {
  width: 0.875rem;
  height: 0.625rem;
  border-radius: 2px;
  flex-shrink: 0;
  border: 1px solid var(--surface-border);
}

.tux-resource-meter__swatch--utilized {
  background: var(--status-ok);
  border-color: var(--status-ok);
}

.tux-resource-meter__swatch--allocated {
  background: repeating-linear-gradient(
    -45deg,
    color-mix(in srgb, var(--text-muted) 32%, var(--surface-raised)),
    color-mix(in srgb, var(--text-muted) 32%, var(--surface-raised)) 3px,
    var(--surface-raised) 3px,
    var(--surface-raised) 6px
  );
  border-color: var(--text-muted);
}

.tux-resource-meter__swatch--unallocated {
  background: var(--surface-sunken);
}

.tux-resource-meter__channels {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
  min-width: 0;
}

.tux-resource-meter__channel-item {
  min-width: 0;
}

.tux-resource-meter__channel-btn {
  width: 100%;
  min-height: 44px;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding: var(--space-12);
  text-align: left;
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-left-width: 3px;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-body);
  cursor: pointer;
  box-sizing: border-box;
  transition: border-color var(--motion-fast) var(--ease-standard),
    background-color var(--motion-fast) var(--ease-standard);
}

.tux-resource-meter__channel-btn--nominal {
  border-left-color: var(--status-ok);
}

.tux-resource-meter__channel-btn--idle-waste {
  border-left-color: var(--status-warning);
}

.tux-resource-meter__channel-btn--saturated {
  border-left-color: var(--status-critical);
}

.tux-resource-meter__channel-btn:hover {
  background: var(--surface-sunken);
}

.tux-resource-meter__channel-btn:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}

.tux-resource-meter__channel-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-8);
  width: 100%;
  min-width: 0;
}

.tux-resource-meter__channel-label {
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.5;
  color: var(--text-primary);
}

.tux-resource-meter__channel-badges {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.tux-resource-meter__track {
  position: relative;
  display: block;
  width: 100%;
  height: 0.875rem;
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.tux-resource-meter__bar-allocated {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background: repeating-linear-gradient(
    -45deg,
    color-mix(in srgb, var(--text-muted) 28%, var(--surface-raised)),
    color-mix(in srgb, var(--text-muted) 28%, var(--surface-raised)) 4px,
    var(--surface-raised) 4px,
    var(--surface-raised) 8px
  );
  border-right: 2px solid var(--text-muted);
  box-sizing: border-box;
}

.tux-resource-meter__bar-utilized {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  border-radius: 1px;
}

.tux-resource-meter__bar-utilized--ok {
  background: var(--status-ok);
}

.tux-resource-meter__bar-utilized--warning {
  background: var(--status-warning);
}

.tux-resource-meter__bar-utilized--critical {
  background: var(--status-critical);
}

.tux-resource-meter__bar-utilized--maintenance {
  background: var(--status-maintenance);
}

.tux-resource-meter__channel-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4) var(--space-12);
  width: 100%;
  min-width: 0;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.tux-resource-meter__readout strong {
  color: var(--text-primary);
  font-weight: 700;
}

.tux-resource-meter__capacity-note,
.tux-resource-meter__pct-note {
  color: var(--text-muted);
}

.tux-resource-meter__empty {
  margin: 0;
  padding: var(--space-16);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

@media (prefers-reduced-motion: reduce) {
  .tux-resource-meter__reclaim-btn,
  .tux-resource-meter__channel-btn {
    transition: none;
  }
}
</style>
