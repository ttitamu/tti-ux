<script setup lang="ts">
/**
 * TuxThresholdBar — multi-segment horizontal capacity, allocation & projection bar
 * evaluated against a hard threshold limit.
 *
 * Scales gracefully beyond 100% when total allocation exceeds `limit`, repositioning
 * the vertical threshold marker proportionally inside the bar track. Supports
 * diagonal hatched patterns for projected/forecasted segments so color is never
 * the sole visual channel.
 */
import { computed } from "vue";

export interface ThresholdSegment {
  key: string;
  label: string;
  value: number;
  tone?: "primary" | "secondary" | "accent" | "success" | "warning" | "danger";
  pattern?: "solid" | "hatched";
}

interface Props {
  title?: string;
  segments: ThresholdSegment[];
  limit: number;
  unit?: string;
  unitPosition?: "prefix" | "suffix";
  decimals?: number;
  warningRatio?: number;
  showLegend?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  unit: "",
  unitPosition: "suffix",
  decimals: 1,
  warningRatio: 0.85,
  showLegend: true,
});

const normalizedSegments = computed(() =>
  props.segments.map((seg) => ({
    ...seg,
    tone: seg.tone ?? "primary",
    pattern: seg.pattern ?? "solid",
    safeValue: Math.max(0, Number.isFinite(seg.value) ? seg.value : 0),
  })),
);

const totalValue = computed<number>(() =>
  normalizedSegments.value.reduce((acc, seg) => acc + seg.safeValue, 0),
);

const safeLimit = computed<number>(() => (props.limit > 0 ? props.limit : 1));

const trackMax = computed<number>(() =>
  Math.max(safeLimit.value, totalValue.value),
);

const thresholdPositionPct = computed<number>(() =>
  Math.min(100, Math.max(0, (safeLimit.value / trackMax.value) * 100)),
);

const utilizationRatio = computed<number>(() =>
  props.limit > 0 ? totalValue.value / props.limit : 0,
);

const utilizationPctText = computed<string>(
  () => `${(utilizationRatio.value * 100).toFixed(1)}%`,
);

const isOverLimit = computed<boolean>(
  () => props.limit > 0 && totalValue.value > props.limit,
);

const isWarning = computed<boolean>(
  () => !isOverLimit.value && utilizationRatio.value >= props.warningRatio,
);

const headroomOrOverage = computed<number>(() =>
  Math.abs(props.limit - totalValue.value),
);

function formatMetric(val: number): string {
  const formatted = val.toLocaleString("en-US", {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals,
  });
  if (!props.unit) return formatted;
  if (props.unitPosition === "prefix") {
    const sep = props.unit.length > 1 ? " " : "";
    return `${props.unit}${sep}${formatted}`;
  }
  const sep = props.unit === "%" ? "" : " ";
  return `${formatted}${sep}${props.unit}`;
}

function segmentWidthPct(safeValue: number): number {
  if (trackMax.value <= 0 || safeValue <= 0) return 0;
  return (safeValue / trackMax.value) * 100;
}

function segmentShareOfLimitPct(safeValue: number): string {
  if (props.limit <= 0) return "0.0%";
  return `${((safeValue / props.limit) * 100).toFixed(1)}%`;
}

const statusSummaryText = computed<string>(() => {
  if (isOverLimit.value) {
    return `Over limit by ${formatMetric(headroomOrOverage.value)}`;
  }
  if (isWarning.value) {
    return `Approaching limit · ${formatMetric(headroomOrOverage.value)} remaining`;
  }
  return `${formatMetric(headroomOrOverage.value)} available`;
});

const meterAriaLabel = computed<string>(
  () => props.title || "Capacity threshold utilization",
);

const meterValueText = computed<string>(
  () =>
    `${formatMetric(totalValue.value)} of ${formatMetric(props.limit)} limit (${utilizationPctText.value}) — ${statusSummaryText.value}`,
);
</script>

<template>
  <div
    class="tux-threshold-bar"
    :class="[
      isOverLimit && 'tux-threshold-bar--over',
      isWarning && 'tux-threshold-bar--warning',
    ]"
  >
    <div class="tux-threshold-bar__header">
      <div class="tux-threshold-bar__title-group">
        <span v-if="title" class="tux-threshold-bar__title">{{ title }}</span>
        <span
          class="tux-threshold-bar__chip"
          :class="[
            isOverLimit
              ? 'tux-threshold-bar__chip--critical'
              : isWarning
                ? 'tux-threshold-bar__chip--warning'
                : 'tux-threshold-bar__chip--ok',
          ]"
        >
          <svg
            v-if="isOverLimit"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.25"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="tux-threshold-bar__chip-icon"
            aria-hidden="true"
          >
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <svg
            v-else-if="isWarning"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.25"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="tux-threshold-bar__chip-icon"
            aria-hidden="true"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="tux-threshold-bar__chip-icon"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{{ statusSummaryText }}</span>
        </span>
      </div>

      <div class="tux-threshold-bar__figures">
        <span class="tux-threshold-bar__total">{{ formatMetric(totalValue) }}</span>
        <span class="tux-threshold-bar__slash">/</span>
        <span class="tux-threshold-bar__limit">{{ formatMetric(limit) }}</span>
        <span class="tux-threshold-bar__pct">({{ utilizationPctText }})</span>
      </div>
    </div>

    <div class="tux-threshold-bar__track-wrap">
      <div
        role="meter"
        class="tux-threshold-bar__track"
        :aria-label="meterAriaLabel"
        :aria-valuemin="0"
        :aria-valuemax="trackMax"
        :aria-valuenow="totalValue"
        :aria-valuetext="meterValueText"
      >
        <span
          v-for="seg in normalizedSegments"
          :key="seg.key"
          class="tux-threshold-bar__segment"
          :class="[
            `tux-threshold-bar__segment--${seg.tone}`,
            seg.pattern === 'hatched' && 'tux-threshold-bar__segment--hatched',
          ]"
          :style="{ width: `${segmentWidthPct(seg.safeValue)}%` }"
          aria-hidden="true"
        />
      </div>

      <div
        class="tux-threshold-bar__marker"
        :class="isOverLimit && 'tux-threshold-bar__marker--inside'"
        :style="{ left: `${thresholdPositionPct}%` }"
        aria-hidden="true"
      >
        <span class="tux-threshold-bar__marker-line" />
        <span class="tux-threshold-bar__marker-tag">
          Limit {{ formatMetric(limit) }}
        </span>
      </div>
    </div>

    <ul v-if="showLegend && normalizedSegments.length > 0" class="tux-threshold-bar__legend">
      <li
        v-for="seg in normalizedSegments"
        :key="seg.key"
        class="tux-threshold-bar__legend-item"
      >
        <span
          class="tux-threshold-bar__swatch"
          :class="[
            `tux-threshold-bar__swatch--${seg.tone}`,
            seg.pattern === 'hatched' && 'tux-threshold-bar__swatch--hatched',
          ]"
          aria-hidden="true"
        />
        <span class="tux-threshold-bar__legend-label">
          {{ seg.label }}
          <span v-if="seg.pattern === 'hatched'" class="tux-threshold-bar__legend-pattern">
            (projected)
          </span>
        </span>
        <span class="tux-threshold-bar__legend-val">
          {{ formatMetric(seg.safeValue) }}
          <span class="tux-threshold-bar__legend-share">
            · {{ segmentShareOfLimitPct(seg.safeValue) }}
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tux-threshold-bar {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  padding: var(--space-16);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  color: var(--text-primary);
}

.tux-threshold-bar:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-threshold-bar--over {
  border-color: var(--status-critical);
}

.tux-threshold-bar__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-12);
  flex-wrap: wrap;
}

.tux-threshold-bar__title-group {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.tux-threshold-bar__title {
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.5;
  color: var(--text-primary);
}

.tux-threshold-bar__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1.5;
  border: 1px solid var(--surface-border);
}

.tux-threshold-bar__chip--ok {
  border-color: var(--status-ok);
  background: var(--status-ok-fill);
  color: var(--status-ok-ink);
}

.tux-threshold-bar__chip--warning {
  border-color: var(--status-warning);
  background: var(--status-warning-fill);
  color: var(--status-warning-ink);
}

.tux-threshold-bar__chip--critical {
  border-color: var(--status-critical);
  background: var(--surface-sunken);
  color: var(--text-primary);
}

.tux-threshold-bar__chip-icon {
  width: 0.8125rem;
  height: 0.8125rem;
  flex-shrink: 0;
}

.tux-threshold-bar__chip--critical .tux-threshold-bar__chip-icon {
  color: var(--status-critical);
}

.tux-threshold-bar__figures {
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-4);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  line-height: 1.5;
}

.tux-threshold-bar__total {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-threshold-bar__slash,
.tux-threshold-bar__limit {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.tux-threshold-bar__pct {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-muted);
}

.tux-threshold-bar--over .tux-threshold-bar__pct {
  color: var(--status-critical);
}

.tux-threshold-bar__track-wrap {
  position: relative;
  padding-bottom: 1.25rem;
}

.tux-threshold-bar__track {
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 1.25rem;
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.tux-threshold-bar__segment {
  display: block;
  height: 100%;
  min-width: 0;
  transition: width var(--motion-base) var(--ease-standard);
  --tux-tb-fill: var(--brand-primary);
  background-color: var(--tux-tb-fill);
}

.tux-threshold-bar__segment + .tux-threshold-bar__segment {
  border-left: 1px solid var(--surface-raised);
}

.tux-threshold-bar__segment--primary,
.tux-threshold-bar__swatch--primary {
  --tux-tb-fill: var(--brand-primary);
}

.tux-threshold-bar__segment--secondary,
.tux-threshold-bar__swatch--secondary {
  --tux-tb-fill: var(--brand-secondary);
}

.tux-threshold-bar__segment--accent,
.tux-threshold-bar__swatch--accent {
  --tux-tb-fill: var(--spectrum-teal);
}

.tux-threshold-bar__segment--success,
.tux-threshold-bar__swatch--success {
  --tux-tb-fill: var(--color-success);
}

.tux-threshold-bar__segment--warning,
.tux-threshold-bar__swatch--warning {
  --tux-tb-fill: var(--status-warning);
}

.tux-threshold-bar__segment--danger,
.tux-threshold-bar__swatch--danger {
  --tux-tb-fill: var(--color-error);
}

.tux-threshold-bar__segment--hatched,
.tux-threshold-bar__swatch--hatched {
  background-image: repeating-linear-gradient(
    -45deg,
    color-mix(in srgb, var(--neutral-0) 35%, transparent) 0px,
    color-mix(in srgb, var(--neutral-0) 35%, transparent) 4px,
    transparent 4px,
    transparent 8px
  );
}

.tux-threshold-bar__marker {
  position: absolute;
  top: -3px;
  bottom: 0;
  transform: translateX(-100%);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none;
}

.tux-threshold-bar__marker--inside {
  transform: translateX(-50%);
  align-items: center;
}

.tux-threshold-bar__marker-line {
  width: 2px;
  height: calc(1.25rem + 6px);
  background: var(--text-primary);
}

.tux-threshold-bar__marker--inside .tux-threshold-bar__marker-line {
  width: 3px;
  background: var(--status-critical);
}

.tux-threshold-bar__marker-tag {
  margin-top: 2px;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  color: var(--text-muted);
}

.tux-threshold-bar__marker--inside .tux-threshold-bar__marker-tag {
  color: var(--text-primary);
}

.tux-threshold-bar__legend {
  list-style: none;
  margin: 0;
  padding: var(--space-8) 0 0 0;
  border-top: 1px solid var(--surface-border-subtle);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8) var(--space-16);
}

.tux-threshold-bar__legend-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.tux-threshold-bar__swatch {
  width: 0.875rem;
  height: 0.875rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  flex-shrink: 0;
  --tux-tb-fill: var(--brand-primary);
  background-color: var(--tux-tb-fill);
}

.tux-threshold-bar__legend-label {
  font-weight: 600;
  color: var(--text-primary);
}

.tux-threshold-bar__legend-pattern {
  font-weight: 400;
  color: var(--text-muted);
}

.tux-threshold-bar__legend-val {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
}

.tux-threshold-bar__legend-share {
  color: var(--text-muted);
}

@container (max-width: 30rem) {
  .tux-threshold-bar__header {
    flex-direction: column;
    align-items: flex-start;
  }
  .tux-threshold-bar__legend {
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tux-threshold-bar__segment {
    transition: none;
  }
}
</style>
