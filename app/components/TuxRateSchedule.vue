<script setup lang="ts">
/**
 * TuxRateSchedule — effective-dated resource rate schedule table with
 * status filtering, live sample-quantity charge calculation (flat, stepped
 * tiered, and volume brackets × overhead multiplier), inline rate editing,
 * and revision creation triggers.
 */
import { computed, ref, useId, watch } from "vue";

export interface RateTierBracket {
  id: string;
  label: string;
  fromQuantity: number;
  upToQuantity?: number | null;
  unitRate: number;
}

export interface RateScheduleItem {
  id: string;
  code: string;
  name: string;
  category?: string;
  unit: string;
  pricingModel: "flat" | "tiered" | "volume";
  baseRate: number;
  overheadMultiplier?: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  status: "active" | "scheduled" | "archived";
  tiers?: RateTierBracket[];
}

type StatusFilter = "all" | "active" | "scheduled" | "archived";

interface Props {
  /** Heading displayed at the top of the schedule panel. */
  title?: string;
  /** Optional contextual subtitle describing the schedule epoch or policy. */
  subtitle?: string;
  /** Rate schedule line items to display and evaluate. */
  items: RateScheduleItem[];
  /** Currency symbol prepended to monetary rates and charges. */
  currencySymbol?: string;
  /** Initial sample quantity used to compute effective row charges. */
  sampleQuantity?: number;
  /** Allow inline numeric editing of baseRate and overheadMultiplier. */
  editable?: boolean;
  /** Initial status filter selection. */
  statusFilter?: StatusFilter;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Effective-Dated Rate Schedule",
  subtitle: undefined,
  currencySymbol: "$",
  sampleQuantity: 100,
  editable: true,
  statusFilter: "all",
});

const emit = defineEmits<{
  "update:items": [items: RateScheduleItem[]];
  select: [item: RateScheduleItem];
  createRevision: [item: RateScheduleItem];
}>();

const instanceId = useId();
const qtyInputId = `tux-rate-qty-${instanceId}`;

function cloneItems(source: RateScheduleItem[]): RateScheduleItem[] {
  return source.map((item) => ({
    ...item,
    tiers: item.tiers ? item.tiers.map((t) => ({ ...t })) : undefined,
  }));
}

const localItems = ref<RateScheduleItem[]>(cloneItems(props.items));
const activeFilter = ref<StatusFilter>(props.statusFilter);
const previewQuantity = ref<number>(Math.max(0, props.sampleQuantity));
const expandedIds = ref<Record<string, boolean>>({});

watch(
  () => props.items,
  (next) => {
    localItems.value = cloneItems(next);
  },
  { deep: true },
);

watch(
  () => props.statusFilter,
  (next) => {
    activeFilter.value = next;
  },
);

watch(
  () => props.sampleQuantity,
  (next) => {
    if (Number.isFinite(next) && next >= 0) {
      previewQuantity.value = next;
    }
  },
);

const statusOptions = computed(() => {
  const counts = {
    all: localItems.value.length,
    active: 0,
    scheduled: 0,
    archived: 0,
  };
  for (const item of localItems.value) {
    counts[item.status] += 1;
  }
  return [
    { value: "all" as const, label: "All", count: counts.all },
    { value: "active" as const, label: "Active", count: counts.active },
    { value: "scheduled" as const, label: "Scheduled", count: counts.scheduled },
    { value: "archived" as const, label: "Archived", count: counts.archived },
  ];
});

const filteredItems = computed(() => {
  if (activeFilter.value === "all") return localItems.value;
  return localItems.value.filter((item) => item.status === activeFilter.value);
});

function hasTiers(item: RateScheduleItem): boolean {
  return (
    (item.pricingModel === "tiered" || item.pricingModel === "volume") &&
    Array.isArray(item.tiers) &&
    item.tiers.length > 0
  );
}

function isExpanded(id: string): boolean {
  return Boolean(expandedIds.value[id]);
}

function toggleExpanded(id: string) {
  expandedIds.value = {
    ...expandedIds.value,
    [id]: !expandedIds.value[id],
  };
}

function tierPanelId(id: string): string {
  return `tux-rate-tiers-${instanceId}-${id}`;
}

interface TierAllocation {
  bracket: RateTierBracket;
  allocatedQty: number;
  subtotal: number;
}

function evaluateTiers(item: RateScheduleItem, quantity: number): TierAllocation[] {
  const qty = Math.max(0, Number.isFinite(quantity) ? quantity : 0);
  const sorted = [...(item.tiers ?? [])].sort((a, b) => a.fromQuantity - b.fromQuantity);
  if (sorted.length === 0) return [];

  if (item.pricingModel === "volume") {
    let matched = sorted[0]!;
    for (const tier of sorted) {
      if (qty >= tier.fromQuantity) {
        matched = tier;
      }
    }
    return sorted.map((tier) => {
      const isMatch = tier.id === matched.id;
      const alloc = isMatch ? qty : 0;
      return {
        bracket: tier,
        allocatedQty: alloc,
        subtotal: alloc * tier.unitRate,
      };
    });
  }

  // Stepped tiered calculation
  const allocations: TierAllocation[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const tier = sorted[i]!;
    const prev = i > 0 ? sorted[i - 1] : undefined;
    const continuousStart =
      prev && prev.upToQuantity != null && tier.fromQuantity === prev.upToQuantity + 1
        ? prev.upToQuantity
        : tier.fromQuantity;
    const upper = tier.upToQuantity ?? Number.POSITIVE_INFINITY;
    const alloc = qty > continuousStart ? Math.max(0, Math.min(qty, upper) - continuousStart) : 0;
    allocations.push({
      bracket: tier,
      allocatedQty: alloc,
      subtotal: alloc * tier.unitRate,
    });
  }
  return allocations;
}

function computeEffectiveCharge(item: RateScheduleItem, quantity: number): number {
  const qty = Math.max(0, Number.isFinite(quantity) ? quantity : 0);
  const multiplier = item.overheadMultiplier ?? 1.0;

  if (!hasTiers(item)) {
    return qty * item.baseRate * multiplier;
  }

  const allocations = evaluateTiers(item, qty);
  let bracketSum = 0;
  for (const alloc of allocations) {
    bracketSum += alloc.subtotal;
  }
  return bracketSum * multiplier;
}

function stepSampleQuantity(delta: number) {
  const next = Math.max(0, Math.round((previewQuantity.value + delta) * 100) / 100);
  previewQuantity.value = next;
}

function onSampleInput(event: Event) {
  const raw = Number((event.target as HTMLInputElement).value);
  previewQuantity.value = Number.isFinite(raw) && raw >= 0 ? raw : 0;
}

function updateItemField(
  itemId: string,
  field: "baseRate" | "overheadMultiplier",
  event: Event,
) {
  const raw = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(raw) || raw < 0) return;

  const next = localItems.value.map((item) =>
    item.id === itemId ? { ...item, [field]: raw } : item,
  );
  localItems.value = next;
  emit("update:items", cloneItems(next));
}

function formatMoney(amount: number, decimals = 2): string {
  const sign = amount < 0 ? "-" : "";
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${sign}${props.currencySymbol}${formatted}`;
}

function formatRate(rate: number): string {
  const minDec = rate !== 0 && Math.abs(rate) < 0.1 ? 4 : 2;
  return formatMoney(rate, minDec);
}

function formatRange(tier: RateTierBracket, unit: string): string {
  const low = tier.fromQuantity.toLocaleString("en-US");
  if (tier.upToQuantity == null) {
    return `${low}+ ${unit} (∞)`;
  }
  return `${low} – ${tier.upToQuantity.toLocaleString("en-US")} ${unit}`;
}

function statusLabel(status: RateScheduleItem["status"]): string {
  if (status === "active") return "Active";
  if (status === "scheduled") return "Scheduled";
  return "Archived";
}

function modelLabel(model: RateScheduleItem["pricingModel"]): string {
  if (model === "tiered") return "Tiered";
  if (model === "volume") return "Volume";
  return "Flat";
}
</script>

<template>
  <section class="tux-rate-schedule" :aria-label="title">
    <header class="tux-rate-schedule__header">
      <div class="tux-rate-schedule__titles">
        <h2 class="tux-rate-schedule__title">{{ title }}</h2>
        <p v-if="subtitle" class="tux-rate-schedule__subtitle">{{ subtitle }}</p>
      </div>
      <span class="tux-rate-schedule__summary-pill">
        {{ filteredItems.length }} of {{ localItems.length }}
        {{ localItems.length === 1 ? "schedule" : "schedules" }}
      </span>
    </header>

    <div class="tux-rate-schedule__toolbar">
      <div
        class="tux-rate-schedule__filter-group"
        role="group"
        aria-label="Filter rate schedules by status"
      >
        <button
          v-for="opt in statusOptions"
          :key="opt.value"
          type="button"
          class="tux-rate-schedule__filter-pill"
          :class="{ 'tux-rate-schedule__filter-pill--active': activeFilter === opt.value }"
          :aria-pressed="activeFilter === opt.value"
          @click="activeFilter = opt.value"
        >
          <span>{{ opt.label }}</span>
          <span class="tux-rate-schedule__pill-count">{{ opt.count }}</span>
        </button>
      </div>

      <div class="tux-rate-schedule__stepper">
        <label :for="qtyInputId" class="tux-rate-schedule__stepper-label">
          Preview Qty:
        </label>
        <div class="tux-rate-schedule__stepper-controls">
          <button
            type="button"
            class="tux-rate-schedule__step-btn"
            aria-label="Decrease sample quantity"
            @click="stepSampleQuantity(-25)"
          >
            &minus;
          </button>
          <input
            :id="qtyInputId"
            type="number"
            min="0"
            step="25"
            :value="previewQuantity"
            aria-label="Sample quantity for rate preview"
            class="tux-rate-schedule__qty-input"
            @input="onSampleInput"
          >
          <button
            type="button"
            class="tux-rate-schedule__step-btn"
            aria-label="Increase sample quantity"
            @click="stepSampleQuantity(25)"
          >
            +
          </button>
        </div>
      </div>
    </div>

    <div
      class="tux-rate-schedule__scroll"
      tabindex="0"
      role="region"
      :aria-label="`${title} table`"
    >
      <table class="tux-rate-schedule__table">
        <caption class="tux-rate-schedule__sr-only">
          {{ title }} — effective charges evaluated at {{ previewQuantity }} sample units
        </caption>
        <thead>
          <tr>
            <th scope="col" class="tux-rate-schedule__th">Resource Schedule</th>
            <th scope="col" class="tux-rate-schedule__th">Status &amp; Effective Window</th>
            <th scope="col" class="tux-rate-schedule__th">Pricing Model</th>
            <th scope="col" class="tux-rate-schedule__th tux-rate-schedule__th--num">Base Rate</th>
            <th scope="col" class="tux-rate-schedule__th tux-rate-schedule__th--num">Overhead</th>
            <th scope="col" class="tux-rate-schedule__th tux-rate-schedule__th--num">
              Effective ({{ previewQuantity.toLocaleString("en-US") }} units)
            </th>
            <th scope="col" class="tux-rate-schedule__th tux-rate-schedule__th--actions">Actions</th>
          </tr>
        </thead>

        <tbody v-if="filteredItems.length === 0">
          <tr>
            <td colspan="7" class="tux-rate-schedule__empty">
              No rate schedule entries match the selected status filter.
            </td>
          </tr>
        </tbody>

        <tbody
          v-for="item in filteredItems"
          :key="item.id"
          class="tux-rate-schedule__tbody"
        >
          <tr class="tux-rate-schedule__row">
            <th scope="row" class="tux-rate-schedule__row-th">
              <button
                type="button"
                class="tux-rate-schedule__select-btn"
                @click="emit('select', item)"
              >
                <span class="tux-rate-schedule__code">{{ item.code }}</span>
                <span class="tux-rate-schedule__name">{{ item.name }}</span>
              </button>
              <span class="tux-rate-schedule__meta">
                <template v-if="item.category">{{ item.category }} &middot; </template>
                Billing unit: <code>{{ item.unit }}</code>
              </span>
            </th>

            <td class="tux-rate-schedule__td">
              <span class="tux-rate-schedule__status-pill">
                <span
                  class="tux-rate-schedule__status-dot"
                  :class="`tux-rate-schedule__status-dot--${item.status}`"
                  aria-hidden="true"
                />
                <span>{{ statusLabel(item.status) }}</span>
              </span>
              <span class="tux-rate-schedule__dates">
                {{ item.effectiveFrom }} &rarr; {{ item.effectiveTo || "Present" }}
              </span>
            </td>

            <td class="tux-rate-schedule__td">
              <button
                v-if="hasTiers(item)"
                type="button"
                class="tux-rate-schedule__tier-btn"
                :aria-expanded="isExpanded(item.id)"
                :aria-controls="isExpanded(item.id) ? tierPanelId(item.id) : undefined"
                @click="toggleExpanded(item.id)"
              >
                <span
                  class="tux-rate-schedule__chevron"
                  :class="{ 'tux-rate-schedule__chevron--open': isExpanded(item.id) }"
                  aria-hidden="true"
                >
                  &#9656;
                </span>
                <span>{{ modelLabel(item.pricingModel) }} ({{ item.tiers?.length }})</span>
              </button>
              <span v-else class="tux-rate-schedule__model-tag">
                {{ modelLabel(item.pricingModel) }}
              </span>
            </td>

            <td class="tux-rate-schedule__td tux-rate-schedule__td--num">
              <div v-if="editable" class="tux-rate-schedule__inline-field">
                <span class="tux-rate-schedule__affix" aria-hidden="true">{{ currencySymbol }}</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  :value="item.baseRate"
                  :aria-label="`Base rate for ${item.name} in ${currencySymbol} per ${item.unit}`"
                  class="tux-rate-schedule__inline-input"
                  @input="updateItemField(item.id, 'baseRate', $event)"
                >
              </div>
              <span v-else class="tux-rate-schedule__mono">
                {{ formatRate(item.baseRate) }} / {{ item.unit }}
              </span>
            </td>

            <td class="tux-rate-schedule__td tux-rate-schedule__td--num">
              <div v-if="editable" class="tux-rate-schedule__inline-field">
                <input
                  type="number"
                  min="0"
                  step="0.05"
                  :value="item.overheadMultiplier ?? 1"
                  :aria-label="`Overhead multiplier for ${item.name}`"
                  class="tux-rate-schedule__inline-input tux-rate-schedule__inline-input--narrow"
                  @input="updateItemField(item.id, 'overheadMultiplier', $event)"
                >
                <span class="tux-rate-schedule__affix" aria-hidden="true">&times;</span>
              </div>
              <span v-else class="tux-rate-schedule__mono">
                {{ (item.overheadMultiplier ?? 1).toFixed(2) }}&times;
              </span>
            </td>

            <td class="tux-rate-schedule__td tux-rate-schedule__td--num tux-rate-schedule__td--charge">
              <span class="tux-rate-schedule__charge">
                {{ formatMoney(computeEffectiveCharge(item, previewQuantity)) }}
              </span>
              <span class="tux-rate-schedule__charge-unit">
                for {{ previewQuantity.toLocaleString("en-US") }} {{ item.unit }}
              </span>
            </td>

            <td class="tux-rate-schedule__td tux-rate-schedule__td--actions">
              <button
                v-if="item.status === 'active'"
                type="button"
                class="tux-rate-schedule__action-btn"
                :aria-label="`Create new revision from ${item.code} ${item.name}`"
                @click="emit('createRevision', item)"
              >
                New Revision
              </button>
              <button
                v-else
                type="button"
                class="tux-rate-schedule__action-btn tux-rate-schedule__action-btn--subtle"
                :aria-label="`Inspect ${item.code} ${item.name}`"
                @click="emit('select', item)"
              >
                Inspect
              </button>
            </td>
          </tr>

          <tr
            v-if="hasTiers(item) && isExpanded(item.id)"
            :id="tierPanelId(item.id)"
            class="tux-rate-schedule__tier-row"
          >
            <td colspan="7" class="tux-rate-schedule__tier-cell">
              <div class="tux-rate-schedule__tier-panel">
                <div class="tux-rate-schedule__tier-heading">
                  <span>
                    {{ modelLabel(item.pricingModel) }} Bracket Breakdown &middot;
                    Overhead Factor {{ (item.overheadMultiplier ?? 1).toFixed(2) }}&times;
                  </span>
                </div>
                <div class="tux-rate-schedule__tier-grid">
                  <div
                    v-for="alloc in evaluateTiers(item, previewQuantity)"
                    :key="alloc.bracket.id"
                    class="tux-rate-schedule__tier-card"
                    :class="{ 'tux-rate-schedule__tier-card--active': alloc.allocatedQty > 0 }"
                  >
                    <div class="tux-rate-schedule__tier-card-top">
                      <span class="tux-rate-schedule__tier-label">{{ alloc.bracket.label }}</span>
                      <span class="tux-rate-schedule__tier-rate">
                        {{ formatRate(alloc.bracket.unitRate) }} / {{ item.unit }}
                      </span>
                    </div>
                    <div class="tux-rate-schedule__tier-range">
                      Range: {{ formatRange(alloc.bracket, item.unit) }}
                    </div>
                    <div class="tux-rate-schedule__tier-alloc">
                      <span>Allocated: {{ alloc.allocatedQty.toLocaleString("en-US") }} {{ item.unit }}</span>
                      <strong>{{ formatMoney(alloc.subtotal) }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.tux-rate-schedule {
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

.tux-rate-schedule *,
.tux-rate-schedule *::before,
.tux-rate-schedule *::after {
  box-sizing: border-box;
}

.tux-rate-schedule__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.tux-rate-schedule__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-12);
  min-width: 0;
}

.tux-rate-schedule__titles {
  min-width: 0;
  flex: 1 1 240px;
}

.tux-rate-schedule__title {
  margin: 0;
  font-family: var(--font-bold);
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-primary);
}

.tux-rate-schedule__subtitle {
  margin: var(--space-4) 0 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.tux-rate-schedule__summary-pill {
  display: inline-flex;
  align-items: center;
  padding: var(--space-4) var(--space-12);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-full);
  font-variant-numeric: tabular-nums;
}

.tux-rate-schedule__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  min-width: 0;
}

.tux-rate-schedule__filter-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
  min-width: 0;
}

.tux-rate-schedule__filter-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  min-height: 44px;
  padding: var(--space-8) var(--space-12);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-primary);
  background-color: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.tux-rate-schedule__filter-pill:hover {
  border-color: var(--brand-primary);
}

.tux-rate-schedule__filter-pill--active {
  background-color: var(--brand-fill);
  color: var(--text-on-brand);
  border-color: var(--brand-fill);
}

.tux-rate-schedule__filter-pill--active:hover {
  background-color: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
  color: var(--text-on-brand);
}

.tux-rate-schedule__pill-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  color: var(--text-primary);
}

.tux-rate-schedule__filter-pill--active .tux-rate-schedule__pill-count {
  background: var(--surface-page);
  border-color: var(--surface-border);
  color: var(--text-primary);
}

.tux-rate-schedule__stepper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
  min-width: 0;
}

.tux-rate-schedule__stepper-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-rate-schedule__stepper-controls {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
}

.tux-rate-schedule__step-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.tux-rate-schedule__step-btn:hover {
  border-color: var(--brand-primary);
}

.tux-rate-schedule__qty-input {
  width: 96px;
  min-height: 44px;
  padding: var(--space-8);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 700;
  text-align: center;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  font-variant-numeric: tabular-nums;
}

.tux-rate-schedule__scroll {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
}

.tux-rate-schedule__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.tux-rate-schedule__th {
  padding: var(--space-12);
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-secondary);
  background: var(--surface-sunken);
  border-bottom: 2px solid var(--surface-border);
  white-space: nowrap;
}

.tux-rate-schedule__th--num {
  text-align: right;
}

.tux-rate-schedule__th--actions {
  text-align: right;
}

.tux-rate-schedule__empty {
  padding: var(--space-24);
  text-align: center;
  color: var(--text-secondary);
}

.tux-rate-schedule__row {
  border-bottom: 1px solid var(--surface-border-subtle);
}

.tux-rate-schedule__row-th {
  padding: var(--space-12);
  text-align: left;
  font-weight: 600;
  vertical-align: middle;
  min-width: 210px;
}

.tux-rate-schedule__select-btn {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
  min-height: 44px;
  padding: var(--space-4) var(--space-8);
  margin-left: calc(-1 * var(--space-8));
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 700;
  text-align: left;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.tux-rate-schedule__select-btn:hover {
  background: var(--surface-sunken);
  border-color: var(--surface-border);
}

.tux-rate-schedule__code {
  display: inline-block;
  padding: 2px var(--space-8);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
}

.tux-rate-schedule__name {
  color: var(--text-primary);
}

.tux-rate-schedule__meta {
  display: block;
  margin-top: 2px;
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-secondary);
}

.tux-rate-schedule__td {
  padding: var(--space-12);
  vertical-align: middle;
  color: var(--text-primary);
  white-space: nowrap;
}

.tux-rate-schedule__td--num {
  text-align: right;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.tux-rate-schedule__td--actions {
  text-align: right;
}

.tux-rate-schedule__status-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  padding: 3px var(--space-10);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-full);
}

.tux-rate-schedule__status-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.tux-rate-schedule__status-dot--active {
  background: var(--status-ok);
}

.tux-rate-schedule__status-dot--scheduled {
  background: var(--status-warning);
}

.tux-rate-schedule__status-dot--archived {
  background: var(--status-maintenance);
}

.tux-rate-schedule__dates {
  display: block;
  margin-top: var(--space-4);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.tux-rate-schedule__tier-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
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
}

.tux-rate-schedule__tier-btn:hover {
  border-color: var(--brand-primary);
}

.tux-rate-schedule__chevron {
  display: inline-block;
  transition: transform 0.15s ease;
}

.tux-rate-schedule__chevron--open {
  transform: rotate(90deg);
}

.tux-rate-schedule__model-tag {
  display: inline-block;
  padding: var(--space-4) var(--space-10);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
}

.tux-rate-schedule__inline-field {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-4);
}

.tux-rate-schedule__affix {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.tux-rate-schedule__inline-input {
  width: 88px;
  min-height: 44px;
  padding: var(--space-8);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 600;
  text-align: right;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  font-variant-numeric: tabular-nums;
}

.tux-rate-schedule__inline-input--narrow {
  width: 72px;
}

.tux-rate-schedule__mono {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 600;
}

.tux-rate-schedule__charge {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-rate-schedule__charge-unit {
  display: block;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.tux-rate-schedule__action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: var(--space-8) var(--space-12);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-on-brand);
  background-color: var(--brand-fill);
  border: 1px solid var(--brand-fill);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.tux-rate-schedule__action-btn:hover {
  background-color: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
  color: var(--text-on-brand);
}

.tux-rate-schedule__action-btn--subtle {
  color: var(--text-primary);
  background-color: var(--surface-sunken);
  border-color: var(--surface-border);
}

.tux-rate-schedule__action-btn--subtle:hover {
  background-color: var(--surface-eggshell);
  border-color: var(--brand-primary);
  color: var(--text-primary);
}

.tux-rate-schedule__tier-row {
  background: var(--surface-sunken);
  border-bottom: 1px solid var(--surface-border);
}

.tux-rate-schedule__tier-cell {
  padding: var(--space-12) var(--space-16);
}

.tux-rate-schedule__tier-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
}

.tux-rate-schedule__tier-heading {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--text-secondary);
}

.tux-rate-schedule__tier-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 210px), 1fr));
  gap: var(--space-10);
}

.tux-rate-schedule__tier-card {
  padding: var(--space-10) var(--space-12);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.tux-rate-schedule__tier-card--active {
  border-left: 3px solid var(--accent-gold, var(--brand-accent));
}

.tux-rate-schedule__tier-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
}

.tux-rate-schedule__tier-label {
  font-weight: 700;
  font-size: 0.8125rem;
  color: var(--text-primary);
}

.tux-rate-schedule__tier-rate {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-rate-schedule__tier-range {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.tux-rate-schedule__tier-alloc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--surface-border-subtle);
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.tux-rate-schedule__tier-alloc strong {
  font-family: var(--font-mono);
  color: var(--text-primary);
}

.tux-rate-schedule button:focus-visible,
.tux-rate-schedule input:focus-visible,
.tux-rate-schedule select:focus-visible,
.tux-rate-schedule__scroll:focus-visible {
  outline: 3px solid var(--focus-ring, var(--focus-ring-outer));
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .tux-rate-schedule__filter-pill,
  .tux-rate-schedule__chevron {
    transition: none;
  }
}
</style>
