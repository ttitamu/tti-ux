<script setup lang="ts">
/**
 * TuxSimulator — interactive multi-parameter workload and resource cost
 * simulator with scenario presets, synced range + numeric inputs,
 * baseline pool comparison deltas, and budget ceiling utilization status.
 */
import { computed, ref, useId, watch } from "vue";

export interface SimulatorParameter {
  id: string;
  label: string;
  description?: string;
  unit: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  primaryRate: number;
  comparisonRate?: number;
}

export interface SimulatorPreset {
  id: string;
  label: string;
  values: Record<string, number>;
}

interface Props {
  /** Heading displayed at the top of the simulator card. */
  title?: string;
  /** Optional contextual description of the projection model. */
  subtitle?: string;
  /** Adjustable resource workload parameters and unit rates. */
  parameters: SimulatorParameter[];
  /** Optional named scenario presets for one-click workload configuration. */
  presets?: SimulatorPreset[];
  /** Label for the primary projected pool or tariff. */
  primaryLabel?: string;
  /** Label for the baseline or external comparison pool. */
  comparisonLabel?: string;
  /** Optional budget ceiling; when > 0, renders utilization % and over-ceiling status. */
  budgetLimit?: number;
  /** Currency symbol prepended to monetary amounts. */
  currencySymbol?: string;
  /** Show comparison rates, baseline total, and net delta / savings cards. */
  showComparison?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Workload & Cost Simulator",
  subtitle: undefined,
  presets: () => [],
  primaryLabel: "Proposed Pool",
  comparisonLabel: "Baseline Pool",
  budgetLimit: 0,
  currencySymbol: "$",
  showComparison: true,
});

const emit = defineEmits<{
  "update:parameters": [parameters: SimulatorParameter[]];
  applyPreset: [preset: SimulatorPreset];
  reset: [];
}>();

const instanceId = useId();

function cloneParams(source: SimulatorParameter[]): SimulatorParameter[] {
  return source.map((p) => ({ ...p }));
}

const initialValues = new Map<string, number>(
  props.parameters.map((p) => [p.id, p.value]),
);

const localParams = ref<SimulatorParameter[]>(cloneParams(props.parameters));

watch(
  () => props.parameters,
  (next) => {
    for (const p of next) {
      if (!initialValues.has(p.id)) {
        initialValues.set(p.id, p.value);
      }
    }
    localParams.value = cloneParams(next);
  },
  { deep: true },
);

function clampValue(param: SimulatorParameter, raw: number): number {
  if (!Number.isFinite(raw)) return param.min;
  return Math.min(param.max, Math.max(param.min, raw));
}

function rangeId(paramId: string): string {
  return `tux-sim-range-${instanceId}-${paramId}`;
}

function numberId(paramId: string): string {
  return `tux-sim-num-${instanceId}-${paramId}`;
}

function updateParameterValue(paramId: string, event: Event) {
  const raw = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(raw)) return;

  const next = localParams.value.map((p) =>
    p.id === paramId ? { ...p, value: clampValue(p, raw) } : p,
  );
  localParams.value = next;
  emit("update:parameters", cloneParams(next));
}

function isPresetActive(preset: SimulatorPreset): boolean {
  const entries = Object.entries(preset.values);
  if (entries.length === 0) return false;
  for (const [paramId, targetVal] of entries) {
    const found = localParams.value.find((p) => p.id === paramId);
    if (!found || found.value !== targetVal) return false;
  }
  return true;
}

function handleApplyPreset(preset: SimulatorPreset) {
  const next = localParams.value.map((p) => {
    const override = preset.values[p.id];
    if (override === undefined) return { ...p };
    return { ...p, value: clampValue(p, override) };
  });
  localParams.value = next;
  emit("update:parameters", cloneParams(next));
  emit("applyPreset", preset);
}

function handleReset() {
  const next = localParams.value.map((p) => {
    const initVal = initialValues.get(p.id);
    return {
      ...p,
      value: initVal !== undefined ? clampValue(p, initVal) : p.value,
    };
  });
  localParams.value = next;
  emit("update:parameters", cloneParams(next));
  emit("reset");
}

function linePrimaryCost(param: SimulatorParameter): number {
  return param.value * param.primaryRate;
}

function lineComparisonCost(param: SimulatorParameter): number {
  const compRate = param.comparisonRate ?? param.primaryRate;
  return param.value * compRate;
}

const primaryTotal = computed(() => {
  let sum = 0;
  for (const p of localParams.value) {
    sum += linePrimaryCost(p);
  }
  return sum;
});

const comparisonTotal = computed(() => {
  let sum = 0;
  for (const p of localParams.value) {
    sum += lineComparisonCost(p);
  }
  return sum;
});

const netSavings = computed(() => comparisonTotal.value - primaryTotal.value);

const deltaPercent = computed(() => {
  if (comparisonTotal.value <= 0) return 0;
  return ((primaryTotal.value - comparisonTotal.value) / comparisonTotal.value) * 100;
});

const budgetUtilizationPct = computed(() => {
  if (!props.budgetLimit || props.budgetLimit <= 0) return 0;
  return (primaryTotal.value / props.budgetLimit) * 100;
});

const isOverBudget = computed(
  () => Boolean(props.budgetLimit && props.budgetLimit > 0 && primaryTotal.value > props.budgetLimit),
);

const isNearBudget = computed(
  () =>
    Boolean(
      props.budgetLimit &&
        props.budgetLimit > 0 &&
        !isOverBudget.value &&
        budgetUtilizationPct.value >= 85,
    ),
);

function formatMoney(amount: number, decimals = 2): string {
  const sign = amount < 0 ? "-" : "";
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${sign}${props.currencySymbol}${formatted}`;
}

function formatUnitRate(rate: number): string {
  const decimals = rate !== 0 && Math.abs(rate) < 0.1 ? 4 : 2;
  return formatMoney(rate, decimals);
}

function formatSignedPercent(pct: number): string {
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}
</script>

<template>
  <section class="tux-simulator" :aria-label="title">
    <header class="tux-simulator__header">
      <div class="tux-simulator__titles">
        <h2 class="tux-simulator__title">{{ title }}</h2>
        <p v-if="subtitle" class="tux-simulator__subtitle">{{ subtitle }}</p>
      </div>

      <div class="tux-simulator__actions">
        <div
          v-if="presets && presets.length > 0"
          class="tux-simulator__presets"
          role="group"
          aria-label="Simulation scenario presets"
        >
          <button
            v-for="preset in presets"
            :key="preset.id"
            type="button"
            class="tux-simulator__preset-btn"
            :class="{ 'tux-simulator__preset-btn--active': isPresetActive(preset) }"
            :aria-pressed="isPresetActive(preset)"
            @click="handleApplyPreset(preset)"
          >
            {{ preset.label }}
          </button>
        </div>

        <button
          type="button"
          class="tux-simulator__reset-btn"
          aria-label="Reset simulation parameters"
          @click="handleReset"
        >
          Reset
        </button>
      </div>
    </header>

    <div class="tux-simulator__parameters">
      <div
        v-for="param in localParams"
        :key="param.id"
        class="tux-simulator__param-row"
      >
        <div class="tux-simulator__param-top">
          <div class="tux-simulator__param-info">
            <div class="tux-simulator__label-line">
              <label :for="rangeId(param.id)" class="tux-simulator__label">
                {{ param.label }}
              </label>
              <span class="tux-simulator__unit-badge">{{ param.unit }}</span>
            </div>
            <p v-if="param.description" class="tux-simulator__description">
              {{ param.description }}
            </p>
            <div class="tux-simulator__rates">
              <span>
                {{ primaryLabel }}: <strong>{{ formatUnitRate(param.primaryRate) }}</strong>/{{ param.unit }}
              </span>
              <span v-if="showComparison && param.comparisonRate !== undefined">
                &middot; {{ comparisonLabel }}:
                <strong>{{ formatUnitRate(param.comparisonRate) }}</strong>/{{ param.unit }}
              </span>
            </div>
          </div>

          <div class="tux-simulator__line-costs">
            <span class="tux-simulator__line-primary">
              {{ formatMoney(linePrimaryCost(param)) }}
            </span>
            <span
              v-if="showComparison && param.comparisonRate !== undefined"
              class="tux-simulator__line-comparison"
            >
              vs {{ formatMoney(lineComparisonCost(param)) }}
            </span>
          </div>
        </div>

        <div class="tux-simulator__controls">
          <div class="tux-simulator__range-wrap">
            <input
              :id="rangeId(param.id)"
              type="range"
              :min="param.min"
              :max="param.max"
              :step="param.step ?? 1"
              :value="param.value"
              class="tux-simulator__range"
              @input="updateParameterValue(param.id, $event)"
            >
            <div class="tux-simulator__bounds" aria-hidden="true">
              <span>{{ param.min.toLocaleString("en-US") }} {{ param.unit }}</span>
              <span>{{ param.max.toLocaleString("en-US") }} {{ param.unit }}</span>
            </div>
          </div>

          <div class="tux-simulator__num-wrap">
            <input
              :id="numberId(param.id)"
              type="number"
              :min="param.min"
              :max="param.max"
              :step="param.step ?? 1"
              :value="param.value"
              :aria-label="`${param.label} exact quantity in ${param.unit}`"
              class="tux-simulator__num-input"
              @input="updateParameterValue(param.id, $event)"
            >
            <span class="tux-simulator__num-unit" aria-hidden="true">{{ param.unit }}</span>
          </div>
        </div>
      </div>
    </div>

    <footer class="tux-simulator__footer">
      <div class="tux-simulator__summary-grid">
        <div class="tux-simulator__stat-card tux-simulator__stat-card--primary">
          <span class="tux-simulator__stat-eyebrow">Primary Projected Total</span>
          <span class="tux-simulator__stat-sub">{{ primaryLabel }}</span>
          <strong class="tux-simulator__stat-value">{{ formatMoney(primaryTotal) }}</strong>
        </div>

        <div v-if="showComparison" class="tux-simulator__stat-card">
          <span class="tux-simulator__stat-eyebrow">Baseline Comparison Total</span>
          <span class="tux-simulator__stat-sub">{{ comparisonLabel }}</span>
          <strong class="tux-simulator__stat-value">{{ formatMoney(comparisonTotal) }}</strong>
        </div>

        <div v-if="showComparison" class="tux-simulator__stat-card">
          <span class="tux-simulator__stat-eyebrow">Net Delta / Savings</span>
          <div class="tux-simulator__delta-pill">
            <span
              class="tux-simulator__status-dot"
              :class="netSavings >= 0 ? 'tux-simulator__status-dot--ok' : 'tux-simulator__status-dot--critical'"
              aria-hidden="true"
            />
            <span>
              {{ netSavings >= 0 ? "Projected Savings" : "Above Baseline" }}
              ({{ formatSignedPercent(deltaPercent) }})
            </span>
          </div>
          <strong class="tux-simulator__stat-value">
            {{ netSavings >= 0 ? formatMoney(netSavings) : `+${formatMoney(Math.abs(netSavings))}` }}
          </strong>
        </div>
      </div>

      <div
        v-if="budgetLimit && budgetLimit > 0"
        class="tux-simulator__budget"
        role="status"
      >
        <div class="tux-simulator__budget-top">
          <div class="tux-simulator__budget-title">
            <strong>Budget Utilization: {{ budgetUtilizationPct.toFixed(1) }}%</strong>
            <span class="tux-simulator__budget-meta">
              ({{ formatMoney(primaryTotal) }} of {{ formatMoney(budgetLimit) }} ceiling)
            </span>
          </div>

          <span class="tux-simulator__budget-pill">
            <span
              class="tux-simulator__status-dot"
              :class="{
                'tux-simulator__status-dot--critical': isOverBudget,
                'tux-simulator__status-dot--warning': isNearBudget,
                'tux-simulator__status-dot--ok': !isOverBudget && !isNearBudget,
              }"
              aria-hidden="true"
            />
            <span v-if="isOverBudget">
              Over Ceiling (+{{ formatMoney(primaryTotal - budgetLimit) }})
            </span>
            <span v-else-if="isNearBudget">Approaching Budget Ceiling</span>
            <span v-else>Within Budget Ceiling</span>
          </span>
        </div>

        <div class="tux-simulator__meter-track" aria-hidden="true">
          <div
            class="tux-simulator__meter-fill"
            :class="{
              'tux-simulator__meter-fill--over': isOverBudget,
              'tux-simulator__meter-fill--warn': isNearBudget,
            }"
            :style="{ width: `${Math.min(100, Math.max(0, budgetUtilizationPct))}%` }"
          />
        </div>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.tux-simulator {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: var(--space-16);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-top: 3px solid var(--accent-gold, var(--brand-accent));
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-body);
}

.tux-simulator *,
.tux-simulator *::before,
.tux-simulator *::after {
  box-sizing: border-box;
}

.tux-simulator__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-12);
  min-width: 0;
}

.tux-simulator__titles {
  flex: 1 1 240px;
  min-width: 0;
}

.tux-simulator__title {
  margin: 0;
  font-family: var(--font-bold);
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-primary);
}

.tux-simulator__subtitle {
  margin: var(--space-4) 0 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.tux-simulator__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
  min-width: 0;
}

.tux-simulator__presets {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
  min-width: 0;
}

.tux-simulator__preset-btn,
.tux-simulator__reset-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: var(--space-8) var(--space-12);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.tux-simulator__preset-btn:hover,
.tux-simulator__reset-btn:hover {
  border-color: var(--brand-primary);
}

.tux-simulator__preset-btn--active {
  background-color: var(--brand-fill);
  color: var(--text-on-brand);
  border-color: var(--brand-fill);
}

.tux-simulator__preset-btn--active:hover {
  background-color: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
  color: var(--text-on-brand);
}

.tux-simulator__parameters {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  min-width: 0;
}

.tux-simulator__param-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
  padding: var(--space-12);
  background: var(--surface-eggshell);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  min-width: 0;
}

.tux-simulator__param-top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-12);
  min-width: 0;
}

.tux-simulator__param-info {
  flex: 1 1 220px;
  min-width: 0;
}

.tux-simulator__label-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.tux-simulator__label {
  font-family: var(--font-bold);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
  cursor: pointer;
}

.tux-simulator__unit-badge {
  display: inline-block;
  padding: 2px var(--space-8);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
}

.tux-simulator__description {
  margin: var(--space-4) 0 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--text-secondary);
}

.tux-simulator__rates {
  margin-top: var(--space-4);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.tux-simulator__rates strong {
  color: var(--text-primary);
}

.tux-simulator__line-costs {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.tux-simulator__line-primary {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-simulator__line-comparison {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.tux-simulator__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--space-12);
  min-width: 0;
}

.tux-simulator__range-wrap {
  flex: 1 1 200px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tux-simulator__range {
  width: 100%;
  min-height: 44px;
  margin: 0;
  accent-color: var(--brand-fill);
  cursor: pointer;
  background: transparent;
}

.tux-simulator__bounds {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.tux-simulator__num-wrap {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  flex-shrink: 0;
}

.tux-simulator__num-input {
  width: 108px;
  min-height: 44px;
  padding: var(--space-8);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 700;
  text-align: right;
  color: var(--text-primary);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  font-variant-numeric: tabular-nums;
}

.tux-simulator__num-unit {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.tux-simulator__footer {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  padding-top: var(--space-8);
  border-top: 1px solid var(--surface-border);
  min-width: 0;
}

.tux-simulator__summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: var(--space-12);
  min-width: 0;
}

.tux-simulator__stat-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-12);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  min-width: 0;
}

.tux-simulator__stat-card--primary {
  border-left: 3px solid var(--accent-gold, var(--brand-accent));
}

.tux-simulator__stat-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--text-secondary);
}

.tux-simulator__stat-sub {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.tux-simulator__stat-value {
  margin-top: auto;
  font-family: var(--font-mono);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.tux-simulator__delta-pill,
.tux-simulator__budget-pill {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: var(--space-8);
  padding: 3px var(--space-10);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-full);
}

.tux-simulator__status-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.tux-simulator__status-dot--ok {
  background: var(--status-ok);
}

.tux-simulator__status-dot--warning {
  background: var(--status-warning);
}

.tux-simulator__status-dot--critical {
  background: var(--status-critical);
}

.tux-simulator__budget {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding: var(--space-12);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  min-width: 0;
}

.tux-simulator__budget-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
}

.tux-simulator__budget-title {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-8);
  font-size: 0.875rem;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.tux-simulator__budget-meta {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.tux-simulator__meter-track {
  width: 100%;
  height: 10px;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.tux-simulator__meter-fill {
  height: 100%;
  background: var(--brand-fill);
  transition: width 0.2s ease;
}

.tux-simulator__meter-fill--warn {
  background: var(--brand-secondary);
}

.tux-simulator__meter-fill--over {
  background: var(--status-critical);
}

.tux-simulator button:focus-visible,
.tux-simulator input:focus-visible,
.tux-simulator select:focus-visible {
  outline: 3px solid var(--focus-ring, var(--focus-ring-outer));
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .tux-simulator__preset-btn,
  .tux-simulator__reset-btn,
  .tux-simulator__meter-fill {
    transition: none;
  }
}
</style>
