<script setup lang="ts">
/**
 * TuxProportionalInput — constrained fixed-sum / percentage allocation control.
 *
 * Renders a stacked proportional preview bar, per-slice lock toggles, paired
 * range sliders + numeric inputs, share readouts, and helper actions
 * ("Split Evenly" and "Rebalance Unlocked") with live sum verification.
 */
import { computed, useId } from "vue";

export interface ProportionalSlice {
  id: string;
  label: string;
  code?: string;
  value: number;
  locked?: boolean;
}

interface Props {
  modelValue: ProportionalSlice[];
  targetTotal?: number;
  unit?: string;
  decimals?: number;
  step?: number;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  targetTotal: 100,
  unit: "%",
  decimals: 1,
  step: 1,
  title: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [v: ProportionalSlice[]];
}>();

const uid = useId();
const titleId = `${uid}-title`;

const SLICE_PALETTE = [
  "var(--chart-cvd-1)",
  "var(--chart-cvd-2)",
  "var(--chart-cvd-3)",
  "var(--chart-cvd-5)",
  "var(--chart-cvd-6)",
  "var(--chart-cvd-7)",
  "var(--chart-1)",
  "var(--chart-2)",
] as const;

function sliceColor(idx: number): string {
  return SLICE_PALETTE[idx % SLICE_PALETTE.length] ?? "var(--brand-primary)";
}

function roundToDecimals(val: number): number {
  const factor = Math.pow(10, props.decimals);
  return Math.round(val * factor) / factor;
}

function formatNum(val: number): string {
  const safe = Number.isFinite(val) ? val : 0;
  return safe.toFixed(props.decimals);
}

const currentSum = computed<number>(() =>
  roundToDecimals(
    props.modelValue.reduce(
      (sum, slice) => sum + (Number.isFinite(slice.value) ? slice.value : 0),
      0,
    ),
  ),
);

const delta = computed<number>(() =>
  roundToDecimals(props.targetTotal - currentSum.value),
);

const tolerance = computed<number>(() => Math.pow(10, -props.decimals) / 2);

const isBalanced = computed<boolean>(() => Math.abs(delta.value) <= tolerance.value);

const isOverAllocated = computed<boolean>(() => !isBalanced.value && delta.value < 0);

const unlockedCount = computed<number>(
  () => props.modelValue.filter((s) => !s.locked).length,
);

const barDenominator = computed<number>(() =>
  Math.max(props.targetTotal, currentSum.value, 1),
);

function sliceBarPercent(value: number): number {
  const clamped = Math.max(0, Number.isFinite(value) ? value : 0);
  return Math.min(100, (clamped / barDenominator.value) * 100);
}

function shareOfTargetPercent(value: number): string {
  if (props.targetTotal <= 0) return formatNum(0);
  const pct = (Math.max(0, value) / props.targetTotal) * 100;
  return pct.toFixed(1);
}

const unallocatedBarPercent = computed<number>(() => {
  if (delta.value <= tolerance.value) return 0;
  return Math.min(100, (delta.value / barDenominator.value) * 100);
});

const statusReadout = computed<string>(() => {
  const base = `${formatNum(currentSum.value)}${props.unit} / ${formatNum(props.targetTotal)}${props.unit}`;
  if (isBalanced.value) return `${base} · Balanced`;
  if (delta.value > 0) {
    return `${base} · ${formatNum(delta.value)}${props.unit} remaining`;
  }
  return `${base} · ${formatNum(Math.abs(delta.value))}${props.unit} overage`;
});

function updateSliceValue(id: string, rawVal: number) {
  const sanitized = Number.isFinite(rawVal) ? Math.max(0, roundToDecimals(rawVal)) : 0;
  emit(
    "update:modelValue",
    props.modelValue.map((slice) =>
      slice.id === id && !slice.locked ? { ...slice, value: sanitized } : slice,
    ),
  );
}

function onNumberInput(id: string, rawText: string) {
  const parsed = rawText.trim() === "" ? 0 : Number(rawText);
  updateSliceValue(id, parsed);
}

function toggleLock(id: string) {
  emit(
    "update:modelValue",
    props.modelValue.map((slice) =>
      slice.id === id ? { ...slice, locked: !slice.locked } : slice,
    ),
  );
}

function splitEvenly() {
  const unlockedIndices = props.modelValue
    .map((s, idx) => (!s.locked ? idx : -1))
    .filter((idx) => idx >= 0);

  if (unlockedIndices.length === 0) return;

  const lockedSum = props.modelValue
    .filter((s) => s.locked)
    .reduce((acc, s) => acc + Math.max(0, s.value), 0);

  const pool = Math.max(0, roundToDecimals(props.targetTotal - lockedSum));
  const baseShare = roundToDecimals(pool / unlockedIndices.length);
  const next = props.modelValue.map((s) => ({ ...s }));

  let allocated = 0;
  unlockedIndices.forEach((sliceIdx, pos) => {
    const target = next[sliceIdx];
    if (!target) return;
    if (pos < unlockedIndices.length - 1) {
      target.value = baseShare;
      allocated = roundToDecimals(allocated + baseShare);
    } else {
      target.value = Math.max(0, roundToDecimals(pool - allocated));
    }
  });

  emit("update:modelValue", next);
}

function rebalanceUnlocked() {
  const unlockedIndices = props.modelValue
    .map((s, idx) => (!s.locked ? idx : -1))
    .filter((idx) => idx >= 0);

  if (unlockedIndices.length === 0) return;

  const lockedSum = props.modelValue
    .filter((s) => s.locked)
    .reduce((acc, s) => acc + Math.max(0, s.value), 0);

  const pool = Math.max(0, roundToDecimals(props.targetTotal - lockedSum));
  const currentUnlockedSum = unlockedIndices.reduce(
    (acc, idx) => acc + Math.max(0, props.modelValue[idx]?.value ?? 0),
    0,
  );

  if (currentUnlockedSum <= 0) {
    splitEvenly();
    return;
  }

  const next = props.modelValue.map((s) => ({ ...s }));
  let allocated = 0;

  unlockedIndices.forEach((sliceIdx, pos) => {
    const target = next[sliceIdx];
    if (!target) return;
    if (pos < unlockedIndices.length - 1) {
      const scaled = roundToDecimals((Math.max(0, target.value) / currentUnlockedSum) * pool);
      target.value = scaled;
      allocated = roundToDecimals(allocated + scaled);
    } else {
      target.value = Math.max(0, roundToDecimals(pool - allocated));
    }
  });

  emit("update:modelValue", next);
}
</script>

<template>
  <div
    class="tux-prop-input"
    role="group"
    :aria-labelledby="title ? titleId : undefined"
  >
    <div class="tux-prop-input__header">
      <span v-if="title" :id="titleId" class="tux-prop-input__title">
        {{ title }}
      </span>
      <span
        class="tux-prop-input__sum"
        :class="{
          'tux-prop-input__sum--valid': isBalanced,
          'tux-prop-input__sum--warn': !isBalanced && !isOverAllocated,
          'tux-prop-input__sum--over': isOverAllocated,
        }"
        role="status"
        aria-live="polite"
      >
        {{ statusReadout }}
      </span>
    </div>

    <div class="tux-prop-input__bar" aria-hidden="true">
      <div
        v-for="(slice, idx) in modelValue"
        :key="`bar-${slice.id}`"
        class="tux-prop-input__bar-seg"
        :style="{
          '--tux-slice-color': sliceColor(idx),
          '--tux-slice-pct': `${sliceBarPercent(slice.value)}%`,
        }"
        :title="`${slice.label}: ${formatNum(slice.value)}${unit}`"
      />
      <div
        v-if="unallocatedBarPercent > 0"
        class="tux-prop-input__bar-rem"
        :style="{ '--tux-rem-pct': `${unallocatedBarPercent}%` }"
      />
    </div>

    <div class="tux-prop-input__rows">
      <div
        v-for="(slice, idx) in modelValue"
        :key="slice.id"
        class="tux-prop-input__row"
        :class="{ 'tux-prop-input__row--locked': slice.locked }"
      >
        <div class="tux-prop-input__identity">
          <span
            class="tux-prop-input__swatch"
            :style="{ '--tux-slice-color': sliceColor(idx) }"
            aria-hidden="true"
          />
          <code v-if="slice.code" class="tux-prop-input__code">
            {{ slice.code }}
          </code>
          <label
            :for="`${uid}-num-${slice.id}`"
            class="tux-prop-input__label"
          >
            {{ slice.label }}
          </label>
        </div>

        <div class="tux-prop-input__controls">
          <button
            type="button"
            class="tux-prop-input__lock"
            :class="{ 'tux-prop-input__lock--active': slice.locked }"
            :aria-pressed="Boolean(slice.locked)"
            :aria-label="slice.locked ? `Unlock ${slice.label}` : `Lock ${slice.label}`"
            @click="toggleLock(slice.id)"
          >
            <svg
              class="tux-prop-input__lock-icon"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <rect x="3.5" y="7" width="9" height="6.5" rx="1.25" />
              <path
                v-if="slice.locked"
                d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"
              />
              <path
                v-else
                d="M5.5 7V4.75a2.5 2.5 0 0 1 4.7-1.15"
              />
            </svg>
          </button>

          <input
            :id="`${uid}-range-${slice.id}`"
            type="range"
            class="tux-prop-input__slider"
            :min="0"
            :max="targetTotal"
            :step="step"
            :value="slice.value"
            :disabled="Boolean(slice.locked)"
            :aria-label="`${slice.label} slider`"
            @input="updateSliceValue(slice.id, Number(($event.target as HTMLInputElement).value))"
          >

          <div class="tux-prop-input__num-wrap">
            <input
              :id="`${uid}-num-${slice.id}`"
              type="number"
              class="tux-prop-input__num"
              :min="0"
              :max="targetTotal"
              :step="step"
              :value="slice.value"
              :disabled="Boolean(slice.locked)"
              @input="onNumberInput(slice.id, ($event.target as HTMLInputElement).value)"
            >
            <span class="tux-prop-input__unit" aria-hidden="true">{{ unit }}</span>
          </div>

          <span class="tux-prop-input__share">
            {{ shareOfTargetPercent(slice.value) }}% share
          </span>
        </div>
      </div>
    </div>

    <div class="tux-prop-input__footer">
      <div class="tux-prop-input__helpers">
        <button
          type="button"
          class="tux-prop-input__btn"
          :disabled="unlockedCount === 0"
          @click="splitEvenly"
        >
          Split Evenly
        </button>
        <button
          type="button"
          class="tux-prop-input__btn tux-prop-input__btn--primary"
          :disabled="unlockedCount === 0"
          @click="rebalanceUnlocked"
        >
          Rebalance Unlocked
        </button>
      </div>

      <span
        v-if="!isBalanced"
        class="tux-prop-input__delta-note"
        role="alert"
      >
        <template v-if="delta > 0">
          Allocate {{ formatNum(delta) }}{{ unit }} more to reach {{ formatNum(targetTotal) }}{{ unit }}.
        </template>
        <template v-else>
          Reduce by {{ formatNum(Math.abs(delta)) }}{{ unit }} to match {{ formatNum(targetTotal) }}{{ unit }}.
        </template>
      </span>
    </div>
  </div>
</template>

<style scoped>
.tux-prop-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding: var(--space-16);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
  color: var(--text-primary);
  container-type: inline-size;
}

.tux-prop-input__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.tux-prop-input__title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-prop-input__sum {
  display: inline-flex;
  align-items: center;
  padding: var(--space-4) var(--space-12);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  border-radius: var(--radius-full);
  border: 1px solid var(--surface-border);
}

.tux-prop-input__sum--valid {
  background: var(--status-ok-fill);
  color: var(--status-ok-ink);
  border-color: var(--status-ok);
}

.tux-prop-input__sum--warn {
  background: var(--status-warning-fill);
  color: var(--status-warning-ink);
  border-color: var(--status-warning);
}

.tux-prop-input__sum--over {
  background: var(--status-critical-fill);
  color: var(--status-critical-ink);
  border-color: var(--status-critical);
}

.tux-prop-input__bar {
  display: flex;
  width: 100%;
  height: 0.75rem;
  overflow: hidden;
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-full);
}

.tux-prop-input__bar-seg {
  width: var(--tux-slice-pct, 0%);
  background: var(--tux-slice-color, var(--brand-primary));
  border-right: 1px solid var(--surface-raised);
  transition: width var(--motion-fast) var(--ease-standard);
}

.tux-prop-input__bar-rem {
  width: var(--tux-rem-pct, 0%);
  background: repeating-linear-gradient(
    -45deg,
    var(--surface-sunken),
    var(--surface-sunken) 4px,
    var(--surface-border) 4px,
    var(--surface-border) 8px
  );
}

.tux-prop-input__rows {
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
}

.tux-prop-input__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  padding: var(--space-8) var(--space-12);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  flex-wrap: wrap;
}

.tux-prop-input__row--locked {
  background: var(--surface-sunken);
}

.tux-prop-input__identity {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  min-width: 11rem;
  flex: 1 1 12rem;
}

.tux-prop-input__swatch {
  width: 0.75rem;
  height: 0.75rem;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  background: var(--tux-slice-color, var(--brand-primary));
}

.tux-prop-input__code {
  padding: 1px var(--space-4);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-brand);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
}

.tux-prop-input__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.tux-prop-input__controls {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex: 2 1 18rem;
  flex-wrap: wrap;
}

.tux-prop-input__lock {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: color var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard),
    background-color var(--motion-fast) var(--ease-standard);
}

.tux-prop-input__lock:hover {
  color: var(--brand-primary);
  border-color: var(--brand-primary);
}

.tux-prop-input__lock--active {
  color: var(--text-on-brand);
  background: var(--brand-fill);
  border-color: var(--brand-fill);
}

.tux-prop-input__lock--active:hover {
  color: var(--text-on-brand);
  background: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
}

.tux-prop-input__lock-icon {
  width: 1rem;
  height: 1rem;
}

.tux-prop-input__slider {
  flex: 1 1 7rem;
  min-width: 6rem;
  min-height: 44px;
  accent-color: var(--brand-primary);
  cursor: pointer;
}

.tux-prop-input__slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tux-prop-input__num-wrap {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
}

.tux-prop-input__num {
  width: 5.25rem;
  min-height: 44px;
  padding: var(--space-8);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  text-align: right;
  color: var(--text-primary);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.tux-prop-input__num:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.tux-prop-input__unit {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.tux-prop-input__share {
  min-width: 5.5rem;
  text-align: right;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
}

.tux-prop-input__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  padding-top: var(--space-8);
  border-top: 1px solid var(--surface-border-subtle);
  flex-wrap: wrap;
}

.tux-prop-input__helpers {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.tux-prop-input__btn {
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-12);
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: color var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard),
    background-color var(--motion-fast) var(--ease-standard);
}

.tux-prop-input__btn:hover:not(:disabled) {
  color: var(--brand-primary);
  border-color: var(--brand-primary);
}

.tux-prop-input__btn--primary {
  color: var(--text-on-brand);
  background: var(--brand-fill);
  border-color: var(--brand-fill);
}

.tux-prop-input__btn--primary:hover:not(:disabled) {
  color: var(--text-on-brand);
  background: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
}

.tux-prop-input__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tux-prop-input__delta-note {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.tux-prop-input__lock:focus-visible,
.tux-prop-input__slider:focus-visible,
.tux-prop-input__num:focus-visible,
.tux-prop-input__btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

@container (max-width: 30rem) {
  .tux-prop-input__row {
    flex-direction: column;
    align-items: stretch;
  }

  .tux-prop-input__share {
    text-align: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tux-prop-input__bar-seg,
  .tux-prop-input__lock,
  .tux-prop-input__btn {
    transition: none;
  }
}
</style>
