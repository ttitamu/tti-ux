<script setup lang="ts">
/**
 * TuxAnomalyCard — statistical baseline excursion & budget/telemetry spike alert card.
 *
 * Adheres strictly to the TUX Ops Doctrine (`ACK != MAINT`): acknowledged or snoozed
 * anomalies sink onto `--surface-sunken` with muted borders rather than masquerading
 * as scheduled maintenance. Includes an inline SVG baseline-envelope + spike sparkband
 * and 44px triage actions.
 */
import { computed } from "vue";

export interface AnomalySeriesPoint {
  label: string;
  actual: number;
  baselineMin: number;
  baselineMax: number;
}

type AnomalySeverity = "warning" | "critical";
type AnomalyLifecycleState = "open" | "acknowledged" | "snoozed";

interface Props {
  id?: string;
  title: string;
  metricLabel: string;
  currentValue: string;
  baselineLabel: string;
  deltaLabel: string;
  projectionLabel?: string;
  severity?: AnomalySeverity;
  state?: AnomalyLifecycleState;
  ruleSummary?: string;
  series?: AnomalySeriesPoint[];
  targetEntity?: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: "anomaly-card",
  projectionLabel: undefined,
  severity: "critical",
  state: "open",
  ruleSummary: undefined,
  series: () => [],
  targetEntity: undefined,
});

const emit = defineEmits<{
  acknowledge: [id: string];
  snooze: [id: string];
  escalate: [id: string];
}>();

const isTriaged = computed<boolean>(
  () => props.state === "acknowledged" || props.state === "snoozed",
);

const severityLabel = computed<string>(() =>
  props.severity === "critical" ? "CRITICAL" : "WARNING",
);

const stateBadgeText = computed<string>(() => {
  switch (props.state) {
    case "acknowledged":
      return "ACKNOWLEDGED";
    case "snoozed":
      return "SNOOZED";
    case "open":
    default:
      return "OPEN";
  }
});

// SVG Sparkband geometry (viewBox 360 x 88)
const SVG_WIDTH = 360;
const SVG_HEIGHT = 88;
const PAD_X = 10;
const PAD_Y = 10;

interface PlottedGeometry {
  envelopePolygon: string;
  upperPolyline: string;
  lowerPolyline: string;
  actualPolyline: string;
  spikeX: number;
  spikeY: number;
  firstLabel: string;
  lastLabel: string;
}

const sparkband = computed<PlottedGeometry | null>(() => {
  const pts = props.series;
  if (!pts || pts.length < 2) return null;

  let minVal = Infinity;
  let maxVal = -Infinity;

  for (const p of pts) {
    minVal = Math.min(minVal, p.actual, p.baselineMin, p.baselineMax);
    maxVal = Math.max(maxVal, p.actual, p.baselineMin, p.baselineMax);
  }

  const span = maxVal - minVal > 0 ? maxVal - minVal : 1;
  const plotW = SVG_WIDTH - PAD_X * 2;
  const plotH = SVG_HEIGHT - PAD_Y * 2;

  const toX = (idx: number): number =>
    Number((PAD_X + (idx / (pts.length - 1)) * plotW).toFixed(2));
  const toY = (val: number): number =>
    Number((PAD_Y + plotH - ((val - minVal) / span) * plotH).toFixed(2));

  const upperCoords = pts.map((p, i) => `${toX(i)},${toY(p.baselineMax)}`);
  const lowerCoords = pts.map((p, i) => `${toX(i)},${toY(p.baselineMin)}`);
  const actualCoords = pts.map((p, i) => `${toX(i)},${toY(p.actual)}`);

  const lastIdx = pts.length - 1;
  const lastPt = pts[lastIdx]!;

  return {
    envelopePolygon: [...upperCoords, ...[...lowerCoords].reverse()].join(" "),
    upperPolyline: upperCoords.join(" "),
    lowerPolyline: lowerCoords.join(" "),
    actualPolyline: actualCoords.join(" "),
    spikeX: toX(lastIdx),
    spikeY: toY(lastPt.actual),
    firstLabel: pts[0]!.label,
    lastLabel: lastPt.label,
  };
});

const sparkbandAriaLabel = computed<string>(() => {
  const pts = props.series;
  if (!pts || pts.length < 2) {
    return `${props.metricLabel} anomaly chart: ${props.currentValue}, ${props.deltaLabel}`;
  }
  const latest = pts[pts.length - 1]!;
  return `${props.metricLabel} trend across ${pts.length} intervals (${pts[0]!.label} to ${latest.label}). Latest actual ${latest.actual} outside baseline ${latest.baselineMin} to ${latest.baselineMax} (${props.deltaLabel}).`;
});
</script>

<template>
  <article
    class="tux-anomaly-card"
    :class="[
      `tux-anomaly-card--${severity}`,
      isTriaged ? 'tux-anomaly-card--triaged' : 'tux-anomaly-card--open',
    ]"
    :aria-label="`${severityLabel} anomaly: ${title}`"
  >
    <!-- Header Row -->
    <div class="tux-anomaly-card__header">
      <div class="tux-anomaly-card__identity">
        <span v-if="targetEntity" class="tux-anomaly-card__entity">
          {{ targetEntity }}
        </span>
        <h3 class="tux-anomaly-card__title">{{ title }}</h3>
      </div>

      <div class="tux-anomaly-card__pills">
        <span class="tux-anomaly-card__pill">
          <span
            class="tux-anomaly-card__dot"
            :class="`tux-anomaly-card__dot--${severity}`"
            aria-hidden="true"
          />
          <span>{{ severityLabel }}</span>
        </span>

        <span class="tux-anomaly-card__pill">
          <span>{{ stateBadgeText }}</span>
        </span>
      </div>
    </div>

    <!-- Primary Metric & Baseline Delta Readout -->
    <div class="tux-anomaly-card__metrics">
      <div class="tux-anomaly-card__primary-stat">
        <span class="tux-anomaly-card__metric-label">{{ metricLabel }}</span>
        <div class="tux-anomaly-card__value-row">
          <span class="tux-anomaly-card__value">{{ currentValue }}</span>
          <span class="tux-anomaly-card__delta-pill">
            <span
              class="tux-anomaly-card__dot"
              :class="`tux-anomaly-card__dot--${severity}`"
              aria-hidden="true"
            />
            <span>{{ deltaLabel }}</span>
          </span>
        </div>
        <span class="tux-anomaly-card__baseline">{{ baselineLabel }}</span>
      </div>

      <p v-if="projectionLabel" class="tux-anomaly-card__projection">
        {{ projectionLabel }}
      </p>
    </div>

    <!-- Inline Native SVG Baseline Envelope + Spike Sparkband -->
    <div v-if="sparkband" class="tux-anomaly-card__chart-box">
      <svg
        class="tux-anomaly-card__svg"
        :viewBox="`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`"
        role="img"
        :aria-label="sparkbandAriaLabel"
      >
        <line
          :x1="PAD_X"
          :y1="SVG_HEIGHT / 2"
          :x2="SVG_WIDTH - PAD_X"
          :y2="SVG_HEIGHT / 2"
          class="tux-anomaly-card__gridline"
        />
        <polygon
          :points="sparkband.envelopePolygon"
          class="tux-anomaly-card__envelope"
        />
        <polyline
          :points="sparkband.upperPolyline"
          class="tux-anomaly-card__envelope-edge"
        />
        <polyline
          :points="sparkband.lowerPolyline"
          class="tux-anomaly-card__envelope-edge"
        />
        <polyline
          :points="sparkband.actualPolyline"
          class="tux-anomaly-card__actual-line"
          :class="`tux-anomaly-card__actual-line--${severity}`"
        />
        <circle
          :cx="sparkband.spikeX"
          :cy="sparkband.spikeY"
          r="6.5"
          class="tux-anomaly-card__spike-halo"
          :class="`tux-anomaly-card__spike-halo--${severity}`"
        />
        <circle
          :cx="sparkband.spikeX"
          :cy="sparkband.spikeY"
          r="3.5"
          class="tux-anomaly-card__spike-dot"
          :class="`tux-anomaly-card__spike-dot--${severity}`"
        />
      </svg>

      <div class="tux-anomaly-card__chart-caption" aria-hidden="true">
        <span>{{ sparkband.firstLabel }}</span>
        <span>Shaded band: expected baseline envelope</span>
        <span>{{ sparkband.lastLabel }}</span>
      </div>
    </div>

    <!-- Rule Summary -->
    <p v-if="ruleSummary" class="tux-anomaly-card__rule">
      Rule: {{ ruleSummary }}
    </p>

    <!-- 44px Triage Action Bar -->
    <div class="tux-anomaly-card__actions" role="group" :aria-label="`Triage actions for ${title}`">
      <button
        type="button"
        class="tux-anomaly-card__btn min-h-11"
        :aria-pressed="state === 'acknowledged'"
        @click="emit('acknowledge', id)"
      >
        Acknowledge
      </button>

      <button
        type="button"
        class="tux-anomaly-card__btn min-h-11"
        :aria-pressed="state === 'snoozed'"
        @click="emit('snooze', id)"
      >
        Snooze 24h
      </button>

      <button
        type="button"
        class="tux-anomaly-card__btn tux-anomaly-card__btn--primary min-h-11"
        @click="emit('escalate', id)"
      >
        Escalate
      </button>
    </div>
  </article>
</template>

<style scoped>
.tux-anomaly-card {
  --focus-ring: var(--focus-ring-outer);
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  padding: var(--space-16);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-left-width: 4px;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-body);
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.tux-anomaly-card--open.tux-anomaly-card--critical {
  border-left-color: var(--status-critical);
}

.tux-anomaly-card--open.tux-anomaly-card--warning {
  border-left-color: var(--status-warning);
}

/* ACK != MAINT: acknowledged/snoozed sinks onto --surface-sunken with muted border */
.tux-anomaly-card--triaged {
  background: var(--surface-sunken);
  border-color: var(--surface-border);
  border-left-color: var(--surface-border);
}

.tux-anomaly-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-8) var(--space-12);
  min-width: 0;
}

.tux-anomaly-card__identity {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1 1 12rem;
}

.tux-anomaly-card__entity {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  line-height: 1.5;
  color: var(--text-muted);
}

.tux-anomaly-card__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5;
  color: var(--text-primary);
}

.tux-anomaly-card__pills {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.tux-anomaly-card__pill,
.tux-anomaly-card__delta-pill {
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
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: var(--tracking-wide);
  white-space: nowrap;
}

.tux-anomaly-card--triaged .tux-anomaly-card__pill,
.tux-anomaly-card--triaged .tux-anomaly-card__delta-pill {
  background: var(--surface-page);
}

.tux-anomaly-card__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.tux-anomaly-card__dot--critical {
  background: var(--status-critical);
}

.tux-anomaly-card__dot--warning {
  background: var(--status-warning);
}

.tux-anomaly-card__metrics {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  min-width: 0;
}

.tux-anomaly-card__primary-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tux-anomaly-card__metric-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  line-height: 1.5;
  color: var(--text-secondary);
}

.tux-anomaly-card__value-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-8) var(--space-12);
}

.tux-anomaly-card__value {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.5;
  color: var(--text-primary);
}

.tux-anomaly-card__baseline {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.tux-anomaly-card__projection {
  margin: 0;
  padding: var(--space-8) var(--space-12);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.5;
  color: var(--text-primary);
  max-width: 75ch;
}

.tux-anomaly-card--triaged .tux-anomaly-card__projection {
  background: var(--surface-page);
}

.tux-anomaly-card__chart-box {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-8) var(--space-10);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  min-width: 0;
}

.tux-anomaly-card__svg {
  display: block;
  width: 100%;
  height: auto;
  max-height: 6rem;
  overflow: visible;
}

.tux-anomaly-card__gridline {
  stroke: var(--surface-border);
  stroke-width: 1;
  stroke-dasharray: 2 3;
}

.tux-anomaly-card__envelope {
  fill: color-mix(in srgb, var(--text-muted) 18%, transparent);
}

.tux-anomaly-card__envelope-edge {
  fill: none;
  stroke: var(--text-muted);
  stroke-opacity: 0.55;
  stroke-width: 1;
  stroke-dasharray: 3 3;
}

.tux-anomaly-card__actual-line {
  fill: none;
  stroke-width: 2.25;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.tux-anomaly-card__actual-line--critical {
  stroke: var(--status-critical);
}

.tux-anomaly-card__actual-line--warning {
  stroke: var(--status-warning);
}

.tux-anomaly-card__spike-halo {
  fill: none;
  stroke-width: 1.75;
}

.tux-anomaly-card__spike-halo--critical {
  stroke: var(--status-critical);
}

.tux-anomaly-card__spike-halo--warning {
  stroke: var(--status-warning);
}

.tux-anomaly-card__spike-dot--critical {
  fill: var(--status-critical);
}

.tux-anomaly-card__spike-dot--warning {
  fill: var(--status-warning);
}

.tux-anomaly-card__chart-caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-8);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.6875rem;
  line-height: 1.5;
  color: var(--text-muted);
}

.tux-anomaly-card__rule {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--text-muted);
  max-width: 75ch;
}

.tux-anomaly-card__actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-8);
  padding-top: var(--space-8);
  border-top: 1px solid var(--surface-border);
}

.tux-anomaly-card__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-12);
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-page);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.5;
  cursor: pointer;
  transition: background-color var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard),
    color var(--motion-fast) var(--ease-standard);
}

.tux-anomaly-card__btn:hover {
  background: var(--surface-sunken);
  border-color: var(--brand-primary);
}

.tux-anomaly-card__btn[aria-pressed="true"] {
  background-color: var(--brand-fill);
  border-color: var(--brand-fill);
  color: var(--text-on-brand);
}

.tux-anomaly-card__btn--primary {
  margin-left: auto;
  background-color: var(--brand-fill);
  border-color: var(--brand-fill);
  color: var(--text-on-brand);
}

.tux-anomaly-card__btn--primary:hover {
  background-color: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
}

.tux-anomaly-card__btn:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}

@container (max-width: 28rem) {
  .tux-anomaly-card__btn--primary {
    margin-left: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tux-anomaly-card__btn {
    transition: none;
  }
}
</style>
