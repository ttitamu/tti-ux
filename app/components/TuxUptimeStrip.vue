<script setup lang="ts">
/**
 * TuxUptimeStrip — SLI availability & rolling service uptime tick strip.
 *
 * Displays service identity, latest operational state pill, rolling availability %
 * evaluated against an SLA target, an accessible listbox tick strip supporting
 * ArrowLeft / ArrowRight / Home / End navigation plus 44×44px stepper buttons,
 * and a live bucket inspection callout bar.
 */
import { computed, ref, useId, watch } from "vue";

export type UptimeBucketState =
  | "operational"
  | "degraded"
  | "outage"
  | "maintenance"
  | "empty";

export interface UptimeBucketItem {
  id: string;
  label: string;
  state: UptimeBucketState;
  uptimePct?: number;
  incidentSummary?: string;
  latencyMs?: number;
}

interface Props {
  serviceName: string;
  serviceGroup?: string;
  buckets: UptimeBucketItem[];
  windowLabel?: string;
  slaTargetPct?: number;
  currentLatencyMs?: number;
}

const props = withDefaults(defineProps<Props>(), {
  serviceGroup: undefined,
  windowLabel: "Last 30 days",
  slaTargetPct: 99.9,
  currentLatencyMs: undefined,
});

const emit = defineEmits<{
  selectBucket: [bucket: UptimeBucketItem];
}>();

const uid = useId();

const activeIndex = ref<number>(
  props.buckets.length > 0 ? props.buckets.length - 1 : 0,
);

watch(
  () => props.buckets.length,
  (len) => {
    if (len === 0) {
      activeIndex.value = 0;
    } else if (activeIndex.value >= len) {
      activeIndex.value = len - 1;
    }
  },
);

function stateLabel(state: UptimeBucketState): string {
  switch (state) {
    case "operational":
      return "Operational";
    case "degraded":
      return "Degraded";
    case "outage":
      return "Outage";
    case "maintenance":
      return "Maintenance";
    case "empty":
      return "No Data";
  }
}

function defaultBucketUptime(state: UptimeBucketState): number {
  switch (state) {
    case "operational":
    case "maintenance":
      return 100;
    case "degraded":
      return 98.5;
    case "outage":
      return 0;
    case "empty":
      return 100;
  }
}

const nonEmptyBuckets = computed<UptimeBucketItem[]>(() =>
  props.buckets.filter((b) => b.state !== "empty"),
);

const latestState = computed<UptimeBucketState>(() => {
  for (let i = props.buckets.length - 1; i >= 0; i--) {
    const bucket = props.buckets[i];
    if (bucket && bucket.state !== "empty") {
      return bucket.state;
    }
  }
  return "empty";
});

const rollingAvailabilityPct = computed<number>(() => {
  if (nonEmptyBuckets.value.length === 0) return 100;
  const total = nonEmptyBuckets.value.reduce(
    (sum, b) => sum + (b.uptimePct ?? defaultBucketUptime(b.state)),
    0,
  );
  return Number((total / nonEmptyBuckets.value.length).toFixed(2));
});

const meetsSla = computed<boolean>(
  () => rollingAvailabilityPct.value >= props.slaTargetPct,
);

const inspectedBucket = computed<UptimeBucketItem | undefined>(
  () => props.buckets[activeIndex.value],
);

const firstLabel = computed<string>(() => props.buckets[0]?.label ?? "");
const lastLabel = computed<string>(
  () => props.buckets[props.buckets.length - 1]?.label ?? "",
);

function optionId(index: number): string {
  return `${uid}-bucket-${index}`;
}

const activeOptionId = computed<string | undefined>(() =>
  props.buckets.length > 0 ? optionId(activeIndex.value) : undefined,
);

function bucketAriaLabel(bucket: UptimeBucketItem): string {
  const parts = [`${bucket.label}: ${stateLabel(bucket.state)}`];
  if (bucket.uptimePct !== undefined) {
    parts.push(`${bucket.uptimePct.toFixed(2)}% availability`);
  }
  if (bucket.latencyMs !== undefined) {
    parts.push(`${bucket.latencyMs} ms`);
  }
  if (bucket.incidentSummary) {
    parts.push(bucket.incidentSummary);
  }
  return parts.join(", ");
}

function selectIndex(index: number, shouldEmit = true) {
  if (props.buckets.length === 0) return;
  const clamped = Math.min(Math.max(index, 0), props.buckets.length - 1);
  activeIndex.value = clamped;
  const selected = props.buckets[clamped];
  if (shouldEmit && selected) {
    emit("selectBucket", selected);
  }
}

function stepPrev() {
  if (activeIndex.value > 0) {
    selectIndex(activeIndex.value - 1, true);
  }
}

function stepNext() {
  if (activeIndex.value < props.buckets.length - 1) {
    selectIndex(activeIndex.value + 1, true);
  }
}

function onListboxKeydown(event: KeyboardEvent) {
  if (props.buckets.length === 0) return;
  switch (event.key) {
    case "ArrowLeft":
    case "ArrowUp":
      event.preventDefault();
      selectIndex(activeIndex.value - 1, true);
      break;
    case "ArrowRight":
    case "ArrowDown":
      event.preventDefault();
      selectIndex(activeIndex.value + 1, true);
      break;
    case "Home":
      event.preventDefault();
      selectIndex(0, true);
      break;
    case "End":
      event.preventDefault();
      selectIndex(props.buckets.length - 1, true);
      break;
    case "Enter":
    case " ": {
      event.preventDefault();
      const current = props.buckets[activeIndex.value];
      if (current) emit("selectBucket", current);
      break;
    }
  }
}
</script>

<template>
  <div class="tux-uptime-strip">
    <!-- Service Header & SLA Rollup -->
    <div class="tux-uptime-strip__header">
      <div class="tux-uptime-strip__identity">
        <span v-if="serviceGroup" class="tux-uptime-strip__group">
          {{ serviceGroup }}
        </span>
        <div class="tux-uptime-strip__name-row">
          <h3 class="tux-uptime-strip__name">{{ serviceName }}</h3>
          <span class="tux-uptime-strip__state-pill">
            <span
              class="tux-uptime-strip__dot"
              :class="`tux-uptime-strip__dot--${latestState}`"
              aria-hidden="true"
            />
            <span>{{ stateLabel(latestState) }}</span>
          </span>
        </div>
      </div>

      <div class="tux-uptime-strip__metrics" role="group" aria-label="Availability and SLA summary">
        <span
          v-if="currentLatencyMs !== undefined"
          class="tux-uptime-strip__metric-pill"
        >
          <span class="tux-uptime-strip__metric-key">Latency</span>
          <span class="tux-uptime-strip__metric-val">{{ currentLatencyMs }} ms</span>
        </span>

        <span class="tux-uptime-strip__metric-pill">
          <span
            class="tux-uptime-strip__dot"
            :class="meetsSla ? 'tux-uptime-strip__dot--operational' : 'tux-uptime-strip__dot--outage'"
            aria-hidden="true"
          />
          <span class="tux-uptime-strip__metric-val">
            {{ rollingAvailabilityPct.toFixed(2) }}%
          </span>
          <span class="tux-uptime-strip__metric-key">
            (SLA {{ slaTargetPct }}% {{ meetsSla ? "met" : "breached" }})
          </span>
        </span>
      </div>
    </div>

    <!-- Interactive Roving Tick Strip + 44×44 Steppers -->
    <div v-if="buckets.length > 0" class="tux-uptime-strip__strip-row">
      <button
        type="button"
        class="tux-uptime-strip__stepper min-h-11"
        aria-label="Inspect previous time bucket"
        :disabled="activeIndex <= 0"
        @click="stepPrev"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.25"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="tux-uptime-strip__stepper-icon"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div
        class="tux-uptime-strip__listbox min-h-11"
        role="listbox"
        tabindex="0"
        :aria-label="`${serviceName} ${windowLabel} uptime buckets`"
        :aria-activedescendant="activeOptionId"
        @keydown="onListboxKeydown"
      >
        <div
          v-for="(bucket, idx) in buckets"
          :id="optionId(idx)"
          :key="bucket.id"
          role="option"
          class="tux-uptime-strip__option"
          :class="{ 'tux-uptime-strip__option--active': idx === activeIndex }"
          :aria-selected="idx === activeIndex"
          :aria-label="bucketAriaLabel(bucket)"
          @click="selectIndex(idx, true)"
        >
          <span
            class="tux-uptime-strip__tick"
            :class="`tux-uptime-strip__tick--${bucket.state}`"
            aria-hidden="true"
          />
        </div>
      </div>

      <button
        type="button"
        class="tux-uptime-strip__stepper min-h-11"
        aria-label="Inspect next time bucket"
        :disabled="activeIndex >= buckets.length - 1"
        @click="stepNext"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.25"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="tux-uptime-strip__stepper-icon"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>

    <!-- Window Range Labels -->
    <div v-if="buckets.length > 0" class="tux-uptime-strip__range">
      <span>{{ firstLabel }}</span>
      <span>{{ windowLabel }}</span>
      <span>{{ lastLabel }}</span>
    </div>

    <!-- Live Inspected Bucket Callout -->
    <div
      v-if="inspectedBucket"
      class="tux-uptime-strip__callout"
      aria-live="polite"
    >
      <div class="tux-uptime-strip__callout-main">
        <span class="tux-uptime-strip__callout-date">
          {{ inspectedBucket.label }}
        </span>

        <span class="tux-uptime-strip__state-pill">
          <span
            class="tux-uptime-strip__dot"
            :class="`tux-uptime-strip__dot--${inspectedBucket.state}`"
            aria-hidden="true"
          />
          <span>{{ stateLabel(inspectedBucket.state) }}</span>
        </span>

        <span
          v-if="inspectedBucket.uptimePct !== undefined"
          class="tux-uptime-strip__callout-stat"
        >
          {{ inspectedBucket.uptimePct.toFixed(2) }}% uptime
        </span>

        <span
          v-if="inspectedBucket.latencyMs !== undefined"
          class="tux-uptime-strip__callout-stat"
        >
          {{ inspectedBucket.latencyMs }} ms
        </span>
      </div>

      <p class="tux-uptime-strip__callout-summary">
        {{
          inspectedBucket.incidentSummary ||
          (inspectedBucket.state === "empty"
            ? "No telemetry recorded for this interval."
            : "No incidents recorded during this interval.")
        }}
      </p>
    </div>

    <p v-else class="tux-uptime-strip__empty" role="status">
      No availability buckets recorded for {{ windowLabel }}.
    </p>
  </div>
</template>

<style scoped>
.tux-uptime-strip {
  --focus-ring: var(--focus-ring-outer);
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
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

.tux-uptime-strip__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-12);
  min-width: 0;
}

.tux-uptime-strip__identity {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1 1 12rem;
}

.tux-uptime-strip__group {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  line-height: 1.5;
  color: var(--text-muted);
}

.tux-uptime-strip__name-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.tux-uptime-strip__name {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.5;
  color: var(--text-primary);
}

.tux-uptime-strip__metrics {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-8);
  min-width: 0;
}

.tux-uptime-strip__state-pill,
.tux-uptime-strip__metric-pill {
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

.tux-uptime-strip__state-pill {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.tux-uptime-strip__metric-key {
  color: var(--text-secondary);
}

.tux-uptime-strip__metric-val {
  font-weight: 700;
  color: var(--text-primary);
}

.tux-uptime-strip__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.tux-uptime-strip__dot--operational {
  background: var(--status-ok);
}

.tux-uptime-strip__dot--degraded {
  background: var(--status-warning);
}

.tux-uptime-strip__dot--outage {
  background: var(--status-critical);
}

.tux-uptime-strip__dot--maintenance {
  background: var(--status-maintenance);
}

.tux-uptime-strip__dot--empty {
  background: var(--surface-border);
}

.tux-uptime-strip__strip-row {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  width: 100%;
  min-width: 0;
}

.tux-uptime-strip__stepper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-page);
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard);
}

.tux-uptime-strip__stepper:hover:not(:disabled) {
  background: var(--surface-sunken);
  border-color: var(--brand-primary);
}

.tux-uptime-strip__stepper:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tux-uptime-strip__stepper:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}

.tux-uptime-strip__stepper-icon {
  width: 1rem;
  height: 1rem;
}

.tux-uptime-strip__listbox {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 44px;
  display: flex;
  align-items: stretch;
  gap: 2px;
  padding: var(--space-4) var(--space-8);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  box-sizing: border-box;
}

.tux-uptime-strip__listbox:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}

.tux-uptime-strip__option {
  flex: 1 1 0%;
  min-width: 2px;
  display: flex;
  align-items: flex-end;
  padding: 2px 0;
  cursor: pointer;
  position: relative;
}

.tux-uptime-strip__tick {
  width: 100%;
  height: 1.625rem;
  border-radius: 2px;
  transition: transform var(--motion-fast) var(--ease-standard);
}

.tux-uptime-strip__tick--operational {
  background: var(--status-ok);
}

.tux-uptime-strip__tick--degraded {
  background: var(--status-warning);
  height: 1.25rem;
}

.tux-uptime-strip__tick--outage {
  background: var(--status-critical);
  height: 0.9375rem;
}

.tux-uptime-strip__tick--maintenance {
  background: var(--status-maintenance);
  height: 1.375rem;
}

.tux-uptime-strip__tick--empty {
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  box-sizing: border-box;
}

.tux-uptime-strip__option--active .tux-uptime-strip__tick {
  outline: 2px solid var(--text-primary);
  outline-offset: 1px;
}

.tux-uptime-strip__range {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--text-muted);
}

.tux-uptime-strip__callout {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-10) var(--space-12);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  min-width: 0;
}

.tux-uptime-strip__callout-main {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-8) var(--space-12);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  line-height: 1.5;
}

.tux-uptime-strip__callout-date {
  font-weight: 700;
  color: var(--text-primary);
}

.tux-uptime-strip__callout-stat {
  color: var(--text-secondary);
}

.tux-uptime-strip__callout-summary {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-primary);
  max-width: 75ch;
}

.tux-uptime-strip__empty {
  margin: 0;
  padding: var(--space-12);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

@media (prefers-reduced-motion: reduce) {
  .tux-uptime-strip__stepper,
  .tux-uptime-strip__tick {
    transition: none;
  }
}
</style>
