<script setup lang="ts">
/**
 * TuxPeriodPicker — keyboard-accessible reporting cycle, quarter & date-range
 * selector with optional prior-period comparison toggle.
 *
 * Designed for analytical dashboards, telemetry summaries, and longitudinal
 * corridor reporting where users switch between standard reporting cycles,
 * step forward/backward by window length, or pick custom start/end bounds.
 */
import { computed, useId } from "vue";

export interface PeriodRangeValue {
  start: string;
  end: string;
  preset?: string;
  comparePrevious?: boolean;
}

export interface PeriodPreset {
  key: string;
  label: string;
  start: string;
  end: string;
}

const DEFAULT_PRESETS: PeriodPreset[] = [
  { key: "7d", label: "Last 7 Days", start: "2026-03-25", end: "2026-03-31" },
  { key: "30d", label: "Last 30 Days", start: "2026-03-02", end: "2026-03-31" },
  { key: "q1", label: "Q1 Cycle", start: "2026-01-01", end: "2026-03-31" },
  { key: "q2", label: "Q2 Cycle", start: "2026-04-01", end: "2026-06-30" },
  { key: "ytd", label: "Year to Date", start: "2026-01-01", end: "2026-09-30" },
];

interface Props {
  modelValue: PeriodRangeValue;
  presets?: PeriodPreset[];
  label?: string;
  allowCompare?: boolean;
  stepDays?: number;
}

const props = withDefaults(defineProps<Props>(), {
  presets: undefined,
  label: undefined,
  allowCompare: true,
  stepDays: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [v: PeriodRangeValue];
  apply: [v: PeriodRangeValue];
}>();

const uid = useId();
const startInputId = `${uid}-start`;
const endInputId = `${uid}-end`;
const compareInputId = `${uid}-compare`;
const headingId = `${uid}-heading`;

const resolvedPresets = computed<PeriodPreset[]>(() =>
  props.presets && props.presets.length > 0 ? props.presets : DEFAULT_PRESETS,
);

const MS_PER_DAY = 86_400_000;

function parseIsoUtc(iso: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const parts = iso.split("-").map(Number);
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  if (y === undefined || m === undefined || d === undefined) return null;
  const ms = Date.UTC(y, m - 1, d);
  const check = new Date(ms);
  if (
    check.getUTCFullYear() !== y ||
    check.getUTCMonth() !== m - 1 ||
    check.getUTCDate() !== d
  ) {
    return null;
  }
  return ms;
}

function formatIsoUtc(ms: number): string {
  const dt = new Date(ms);
  const y = String(dt.getUTCFullYear()).padStart(4, "0");
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const spanDays = computed<number | null>(() => {
  const s = parseIsoUtc(props.modelValue.start);
  const e = parseIsoUtc(props.modelValue.end);
  if (s === null || e === null) return null;
  return Math.floor((e - s) / MS_PER_DAY) + 1;
});

const isValidRange = computed(() => spanDays.value !== null && spanDays.value >= 1);

const durationSummary = computed<string>(() => {
  if (spanDays.value === null) return "Select dates";
  if (spanDays.value < 1) return "End precedes start";
  return spanDays.value === 1 ? "1 day" : `${spanDays.value} days`;
});

const priorWindowSummary = computed<string | null>(() => {
  if (!props.allowCompare || !props.modelValue.comparePrevious || !isValidRange.value) {
    return null;
  }
  const s = parseIsoUtc(props.modelValue.start);
  const span = spanDays.value;
  if (s === null || span === null) return null;
  const prevEnd = s - MS_PER_DAY;
  const prevStart = prevEnd - (span - 1) * MS_PER_DAY;
  return `${formatIsoUtc(prevStart)} – ${formatIsoUtc(prevEnd)}`;
});

function isPresetActive(preset: PeriodPreset): boolean {
  if (props.modelValue.preset) {
    return props.modelValue.preset === preset.key;
  }
  return (
    props.modelValue.start === preset.start &&
    props.modelValue.end === preset.end
  );
}

function findMatchingPresetKey(start: string, end: string): string | undefined {
  return resolvedPresets.value.find((p) => p.start === start && p.end === end)?.key;
}

function selectPreset(preset: PeriodPreset) {
  emit("update:modelValue", {
    ...props.modelValue,
    start: preset.start,
    end: preset.end,
    preset: preset.key,
  });
}

function onDateChange(bound: "start" | "end", nextIso: string) {
  const start = bound === "start" ? nextIso : props.modelValue.start;
  const end = bound === "end" ? nextIso : props.modelValue.end;
  emit("update:modelValue", {
    ...props.modelValue,
    start,
    end,
    preset: findMatchingPresetKey(start, end),
  });
}

function shiftCycle(direction: -1 | 1) {
  const s = parseIsoUtc(props.modelValue.start);
  const e = parseIsoUtc(props.modelValue.end);
  if (s === null || e === null) return;
  const inferredSpan = Math.max(1, Math.floor((e - s) / MS_PER_DAY) + 1);
  const step = props.stepDays && props.stepDays > 0 ? props.stepDays : inferredSpan;
  const offsetMs = direction * step * MS_PER_DAY;
  const nextStart = formatIsoUtc(s + offsetMs);
  const nextEnd = formatIsoUtc(e + offsetMs);
  emit("update:modelValue", {
    ...props.modelValue,
    start: nextStart,
    end: nextEnd,
    preset: findMatchingPresetKey(nextStart, nextEnd),
  });
}

function onToggleCompare(checked: boolean) {
  emit("update:modelValue", {
    ...props.modelValue,
    comparePrevious: checked,
  });
}

function onApply() {
  emit("apply", { ...props.modelValue });
}
</script>

<template>
  <div
    class="tux-period-picker"
    role="group"
    :aria-labelledby="label ? headingId : undefined"
  >
    <div v-if="label" class="tux-period-picker__header">
      <span :id="headingId" class="tux-period-picker__title">{{ label }}</span>
      <span
        class="tux-period-picker__duration"
        :class="{ 'tux-period-picker__duration--invalid': spanDays !== null && spanDays < 1 }"
        role="status"
        aria-live="polite"
      >
        {{ durationSummary }}
      </span>
    </div>

    <div
      class="tux-period-picker__presets"
      role="group"
      aria-label="Reporting cycle presets"
    >
      <button
        v-for="preset in resolvedPresets"
        :key="preset.key"
        type="button"
        class="tux-period-picker__preset"
        :class="{ 'tux-period-picker__preset--active': isPresetActive(preset) }"
        :aria-pressed="isPresetActive(preset)"
        @click="selectPreset(preset)"
      >
        {{ preset.label }}
      </button>
    </div>

    <div class="tux-period-picker__controls">
      <div class="tux-period-picker__stepper" role="group" aria-label="Step reporting window">
        <button
          type="button"
          class="tux-period-picker__step-btn"
          aria-label="Previous period"
          :disabled="!isValidRange"
          @click="shiftCycle(-1)"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <button
          type="button"
          class="tux-period-picker__step-btn"
          aria-label="Next period"
          :disabled="!isValidRange"
          @click="shiftCycle(1)"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div class="tux-period-picker__dates">
        <div class="tux-period-picker__field">
          <label :for="startInputId" class="tux-period-picker__field-label">Start date</label>
          <input
            :id="startInputId"
            type="date"
            class="tux-period-picker__input"
            :value="modelValue.start"
            @input="onDateChange('start', ($event.target as HTMLInputElement).value)"
          >
        </div>

        <span class="tux-period-picker__range-sep" aria-hidden="true">to</span>

        <div class="tux-period-picker__field">
          <label :for="endInputId" class="tux-period-picker__field-label">End date</label>
          <input
            :id="endInputId"
            type="date"
            class="tux-period-picker__input"
            :value="modelValue.end"
            @input="onDateChange('end', ($event.target as HTMLInputElement).value)"
          >
        </div>
      </div>

      <span
        v-if="!label"
        class="tux-period-picker__duration"
        :class="{ 'tux-period-picker__duration--invalid': spanDays !== null && spanDays < 1 }"
        role="status"
        aria-live="polite"
      >
        {{ durationSummary }}
      </span>
    </div>

    <div class="tux-period-picker__footer">
      <div class="tux-period-picker__compare-wrap">
        <label
          v-if="allowCompare"
          :for="compareInputId"
          class="tux-period-picker__compare"
        >
          <input
            :id="compareInputId"
            type="checkbox"
            class="tux-period-picker__checkbox"
            :checked="Boolean(modelValue.comparePrevious)"
            @change="onToggleCompare(($event.target as HTMLInputElement).checked)"
          >
          <span>Compare to prior period</span>
        </label>
        <span
          v-if="priorWindowSummary"
          class="tux-period-picker__prior-hint"
        >
          vs. {{ priorWindowSummary }}
        </span>
      </div>

      <button
        type="button"
        class="tux-period-picker__apply"
        :disabled="!isValidRange"
        @click="onApply"
      >
        Apply
      </button>
    </div>
  </div>
</template>

<style scoped>
.tux-period-picker {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  padding: var(--space-16);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
  color: var(--text-primary);
  container-type: inline-size;
}

.tux-period-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.tux-period-picker__title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-period-picker__presets {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.tux-period-picker__preset {
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-12);
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: background-color var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard),
    color var(--motion-fast) var(--ease-standard);
}

.tux-period-picker__preset:hover {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}

.tux-period-picker__preset--active {
  background: var(--brand-fill);
  border-color: var(--brand-fill);
  color: var(--text-on-brand);
}

.tux-period-picker__preset--active:hover {
  background: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
  color: var(--text-on-brand);
}

.tux-period-picker__controls {
  display: flex;
  align-items: flex-end;
  gap: var(--space-12);
  flex-wrap: wrap;
}

.tux-period-picker__stepper {
  display: inline-flex;
  gap: var(--space-4);
}

.tux-period-picker__step-btn {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font: inherit;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
  color: var(--text-primary);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color var(--motion-fast) var(--ease-standard),
    background-color var(--motion-fast) var(--ease-standard);
}

.tux-period-picker__step-btn:hover:not(:disabled) {
  border-color: var(--brand-primary);
  background: var(--wash-brand-4);
  color: var(--brand-primary);
}

.tux-period-picker__step-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tux-period-picker__dates {
  display: flex;
  align-items: flex-end;
  gap: var(--space-8);
  flex: 1;
  flex-wrap: wrap;
}

.tux-period-picker__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  flex: 1;
  min-width: 9.5rem;
}

.tux-period-picker__field-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.tux-period-picker__input {
  min-height: 44px;
  padding: var(--space-8) var(--space-12);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.tux-period-picker__range-sep {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.tux-period-picker__duration {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: var(--space-4) var(--space-12);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-full);
}

.tux-period-picker__duration--invalid {
  background: var(--status-critical-fill);
  border-color: var(--status-critical);
  color: var(--status-critical-ink);
}

.tux-period-picker__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  padding-top: var(--space-8);
  border-top: 1px solid var(--surface-border-subtle);
  flex-wrap: wrap;
}

.tux-period-picker__compare-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  flex-wrap: wrap;
}

.tux-period-picker__compare {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
}

.tux-period-picker__checkbox {
  width: 1.125rem;
  height: 1.125rem;
  accent-color: var(--brand-primary);
  cursor: pointer;
}

.tux-period-picker__prior-hint {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
}

.tux-period-picker__apply {
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-16);
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-on-brand);
  background: var(--brand-fill);
  border: 1px solid var(--brand-fill);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--motion-fast) var(--ease-standard);
}

.tux-period-picker__apply:hover:not(:disabled) {
  background: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
}

.tux-period-picker__apply:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tux-period-picker__preset:focus-visible,
.tux-period-picker__step-btn:focus-visible,
.tux-period-picker__input:focus-visible,
.tux-period-picker__checkbox:focus-visible,
.tux-period-picker__apply:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

@container (max-width: 30rem) {
  .tux-period-picker__controls {
    flex-direction: column;
    align-items: stretch;
  }

  .tux-period-picker__dates {
    flex-direction: column;
    align-items: stretch;
  }

  .tux-period-picker__range-sep {
    min-height: auto;
  }

  .tux-period-picker__footer {
    flex-direction: column;
    align-items: stretch;
  }

  .tux-period-picker__apply {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tux-period-picker__preset,
  .tux-period-picker__step-btn,
  .tux-period-picker__apply {
    transition: none;
  }
}
</style>
