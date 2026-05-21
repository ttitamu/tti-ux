<script setup lang="ts">
/**
 * TuxStatComparison — before/after stat block with delta.
 *
 * One headline metric with a comparison reading (vs prior period, vs
 * target, vs baseline). Anatomy:
 *
 *   ┌──────────────────────────────────┐
 *   │ EYEBROW                          │
 *   │ 47.2 TB         ↗ +1.4 (3.1%)    │
 *   │ Indexed corpus  vs last week     │
 *   └──────────────────────────────────┘
 *
 * Pairs with `TuxBigStat` (which is just a value + label — no
 * comparison) and `TuxFactoid` (which is a row of stats with no
 * comparison logic). Use this when the comparison reading is the
 * point of the stat block — "we moved by X."
 *
 * The delta arrow is computed from `current` vs `previous`. The
 * tone (success / error / neutral) reflects direction; consumers
 * can override with `polarity="invert"` when going down is good
 * (response time, error count).
 *
 * Three layouts:
 *   - row (default) — value + delta on one line, side by side
 *   - stack — value above, delta below; for narrow tile placement
 *   - inline — small format for KPI rows next to other stats
 *
 * Usage:
 *   <tux-stat-comparison
 *     eyebrow="indexed corpus"
 *     :current="47.2"
 *     :previous="45.8"
 *     suffix=" TB"
 *     label="vs last week"
 *   />
 *
 *   <!-- Inverted polarity (down is good): -->
 *   <tux-stat-comparison
 *     eyebrow="median response time"
 *     :current="180"
 *     :previous="240"
 *     suffix=" ms"
 *     label="vs last release"
 *     polarity="invert"
 *   />
 */

interface Props {
  /** Eyebrow text above the number. */
  eyebrow?: string;
  /** Current value (the headline number). */
  current: number;
  /** Previous value (for delta computation). */
  previous: number;
  /** Suffix appended after the current value (` TB`, ` ms`, `%`). */
  suffix?: string;
  /** Label under the value / delta, typically the comparison window
   *  ("vs last week", "vs Q3", "vs baseline"). */
  label?: string;
  /** Layout. Default `row`. */
  layout?: "row" | "stack" | "inline";
  /** Decimal places on the current + previous values. Default 1. */
  decimals?: number;
  /** Polarity. Default `direct` (up is success, down is error).
   *  Pass `invert` when going *down* is good (latency, error rate,
   *  cost). Pass `neutral` to suppress tone entirely. */
  polarity?: "direct" | "invert" | "neutral";
  /** Delta display. Default shows both absolute and percent. */
  deltaFormat?: "abs+pct" | "abs" | "pct";
}

const props = withDefaults(defineProps<Props>(), {
  eyebrow: undefined,
  suffix: undefined,
  label: undefined,
  layout: "row",
  decimals: 1,
  polarity: "direct",
  deltaFormat: "abs+pct",
});

const delta = computed(() => props.current - props.previous);
const pct = computed(() =>
  props.previous === 0 ? null : (delta.value / Math.abs(props.previous)) * 100
);

const direction = computed<"up" | "down" | "flat">(() => {
  if (delta.value === 0) return "flat";
  return delta.value > 0 ? "up" : "down";
});

const tone = computed<"success" | "error" | "neutral">(() => {
  if (props.polarity === "neutral" || direction.value === "flat") return "neutral";
  const good =
    props.polarity === "direct" ? direction.value === "up" : direction.value === "down";
  return good ? "success" : "error";
});

const arrow = computed(() => {
  if (direction.value === "up") return "lucide:arrow-up-right";
  if (direction.value === "down") return "lucide:arrow-down-right";
  return "lucide:minus";
});

function fmt(n: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals,
  });
}
</script>

<template>
  <div
    class="tux-stat-comparison"
    :class="[`tux-stat-comparison--${layout}`, `tux-stat-comparison--${tone}`]"
  >
    <p v-if="eyebrow" class="eyebrow tux-stat-comparison__eyebrow">{{ eyebrow }}</p>

    <div class="tux-stat-comparison__row">
      <span class="tux-stat-comparison__value">
        {{ fmt(current) }}<span v-if="suffix" class="tux-stat-comparison__suffix">{{ suffix }}</span>
      </span>
      <span
        class="tux-stat-comparison__delta"
        :aria-label="`${direction === 'up' ? 'Up' : direction === 'down' ? 'Down' : 'Unchanged'} from ${fmt(previous)}${suffix ?? ''}`"
      >
        <UIcon :name="arrow" class="tux-stat-comparison__arrow" aria-hidden="true" />
        <span class="tux-stat-comparison__delta-num">
          <template v-if="deltaFormat !== 'pct'">
            {{ delta > 0 ? '+' : '' }}{{ fmt(delta) }}<span v-if="suffix">{{ suffix }}</span>
          </template>
          <template v-if="deltaFormat === 'abs+pct' && pct !== null">
            <span class="tux-stat-comparison__delta-pct">
              ({{ pct > 0 ? '+' : '' }}{{ pct.toFixed(1) }}%)
            </span>
          </template>
          <template v-else-if="deltaFormat === 'pct' && pct !== null">
            {{ pct > 0 ? '+' : '' }}{{ pct.toFixed(1) }}%
          </template>
        </span>
      </span>
    </div>

    <p v-if="label" class="tux-stat-comparison__label">{{ label }}</p>
  </div>
</template>

<style scoped>
.tux-stat-comparison {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.tux-stat-comparison__row {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}
.tux-stat-comparison--stack .tux-stat-comparison__row {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
}
.tux-stat-comparison--inline {
  flex-direction: row;
  align-items: baseline;
  gap: 0.5rem;
}
.tux-stat-comparison--inline .tux-stat-comparison__row {
  gap: 0.375rem;
}
.tux-stat-comparison--inline .tux-stat-comparison__value {
  font-size: 1.25rem;
}
.tux-stat-comparison--inline .tux-stat-comparison__delta {
  font-size: 0.75rem;
}
.tux-stat-comparison--inline .tux-stat-comparison__label {
  font-size: 0.75rem;
}

.tux-stat-comparison__eyebrow {
  margin: 0;
}
.tux-stat-comparison__value {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}
.tux-stat-comparison__suffix {
  font-size: 0.6em;
  margin-left: 0.125rem;
  color: var(--text-secondary);
}
.tux-stat-comparison__delta {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.tux-stat-comparison--success .tux-stat-comparison__delta {
  color: var(--color-success, #166534);
  background: color-mix(in srgb, var(--color-success, #16a34a) 12%, transparent);
}
.tux-stat-comparison--error .tux-stat-comparison__delta {
  color: var(--color-error, #991b1b);
  background: color-mix(in srgb, var(--color-error, #dc2626) 12%, transparent);
}
.tux-stat-comparison--neutral .tux-stat-comparison__delta {
  color: var(--text-secondary);
  background: var(--surface-sunken, var(--surface-border));
}
.tux-stat-comparison__arrow {
  width: 0.875rem;
  height: 0.875rem;
}
.tux-stat-comparison__delta-pct {
  margin-left: 0.25rem;
  opacity: 0.85;
}
.tux-stat-comparison__label {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin: 0;
}
</style>
