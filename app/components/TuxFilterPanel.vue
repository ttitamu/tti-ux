<script setup lang="ts">
// TuxFilterPanel — left-rail facet panel for list pages.
//
// PECAN's results UI lives or dies on this. Multiple facet groups (Owner,
// Type, Extension, Access tier, Grant ID, Retention class), each collapsible,
// each with a checkbox list + counts. Applied filters surface as chips at
// the top so the user can scan + remove without scrolling.
//
// State is v-modeled as a flat record: `{ owner: ["chen"], type: ["pdf"] }`.
// Empty arrays/missing keys = no filter applied for that facet. Consumers
// pass the facet shape + buckets; the panel handles render + state.
//
// Implementation note: native `<details>`/`<summary>` for the accordion.
// Zero JS, perfect a11y. No dependency on UAccordion.

interface Bucket {
  value: string;
  label: string;
  count?: number;
}

interface Facet {
  name: string;
  label: string;
  buckets: Bucket[];
  /** Start collapsed. Defaults to false (open). */
  collapsed?: boolean;
}

interface Props {
  facets: Facet[];
  /** v-model. Map of facet name → array of selected values. */
  modelValue?: Record<string, string[]>;
  /** Heading shown above the panel. */
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  title: "Filter",
});

const emit = defineEmits<{
  "update:modelValue": [value: Record<string, string[]>];
}>();

function isSelected(facet: string, value: string): boolean {
  return (props.modelValue[facet] ?? []).includes(value);
}

function toggle(facet: string, value: string) {
  const current = props.modelValue[facet] ?? [];
  const next = current.includes(value)
    ? current.filter(v => v !== value)
    : [...current, value];
  const updated = { ...props.modelValue, [facet]: next };
  if (next.length === 0) delete updated[facet];
  emit("update:modelValue", updated);
}

function clearFacet(facet: string) {
  const updated = { ...props.modelValue };
  delete updated[facet];
  emit("update:modelValue", updated);
}

function clearAll() {
  emit("update:modelValue", {});
}

function bucketLabel(facetName: string, value: string): string {
  const facet = props.facets.find(f => f.name === facetName);
  return facet?.buckets.find(b => b.value === value)?.label ?? value;
}

const appliedCount = computed(() =>
  Object.values(props.modelValue).reduce((sum, arr) => sum + arr.length, 0)
);

interface AppliedChip {
  facet: string;
  facetLabel: string;
  value: string;
  label: string;
}

const applied = computed<AppliedChip[]>(() => {
  const out: AppliedChip[] = [];
  for (const facet of props.facets) {
    const selected = props.modelValue[facet.name] ?? [];
    for (const value of selected) {
      out.push({
        facet: facet.name,
        facetLabel: facet.label,
        value,
        label: bucketLabel(facet.name, value),
      });
    }
  }
  return out;
});
</script>

<template>
  <aside class="tux-filter-panel" aria-label="Filters">
    <header class="tux-filter-panel__header">
      <h2 class="tux-filter-panel__title">{{ title }}</h2>
      <button
        v-if="appliedCount > 0"
        type="button"
        class="tux-filter-panel__clear-all"
        @click="clearAll"
      >Clear all</button>
    </header>

    <div v-if="applied.length > 0" class="tux-filter-panel__applied" role="list">
      <button
        v-for="chip in applied"
        :key="`${chip.facet}:${chip.value}`"
        type="button"
        class="tux-filter-panel__chip"
        role="listitem"
        :aria-label="`Remove ${chip.facetLabel}: ${chip.label}`"
        @click="toggle(chip.facet, chip.value)"
      >
        <span class="tux-filter-panel__chip-prefix">{{ chip.facetLabel }}:</span>
        <span class="tux-filter-panel__chip-value">{{ chip.label }}</span>
        <Icon name="lucide:x" class="tux-filter-panel__chip-remove" aria-hidden="true" />
      </button>
    </div>

    <details
      v-for="facet in facets"
      :key="facet.name"
      class="tux-filter-panel__facet"
      :open="!facet.collapsed"
    >
      <summary class="tux-filter-panel__summary">
        <span class="tux-filter-panel__facet-label">{{ facet.label }}</span>
        <span
          v-if="(modelValue[facet.name] ?? []).length > 0"
          class="tux-filter-panel__facet-count"
        >{{ (modelValue[facet.name] ?? []).length }}</span>
        <Icon
          name="lucide:chevron-down"
          class="tux-filter-panel__facet-chevron"
          aria-hidden="true"
        />
      </summary>
      <ul class="tux-filter-panel__buckets">
        <li
          v-for="bucket in facet.buckets"
          :key="bucket.value"
          class="tux-filter-panel__bucket"
        >
          <label class="tux-filter-panel__bucket-label">
            <input
              type="checkbox"
              :checked="isSelected(facet.name, bucket.value)"
              class="tux-filter-panel__checkbox"
              @change="toggle(facet.name, bucket.value)"
            >
            <span class="tux-filter-panel__bucket-text">{{ bucket.label }}</span>
            <span
              v-if="bucket.count !== undefined"
              class="tux-filter-panel__bucket-count"
            >{{ bucket.count.toLocaleString() }}</span>
          </label>
        </li>
      </ul>
    </details>
  </aside>
</template>

<style scoped>
.tux-filter-panel {
  width: 100%;
  max-width: 18rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
}

.tux-filter-panel__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0 0 0.75rem;
  border-bottom: 2px solid var(--brand-primary);
  margin-bottom: 0.875rem;
}

.tux-filter-panel__title {
  margin: 0;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-primary);
}

.tux-filter-panel__clear-all {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--brand-secondary);
  background: transparent;
  border: 0;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--brand-secondary) 40%, transparent);
  text-underline-offset: 2px;
}
.tux-filter-panel__clear-all:hover {
  color: var(--brand-primary);
  text-decoration-color: currentColor;
}

.tux-filter-panel__applied {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 1rem;
}

.tux-filter-panel__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem 0.25rem 0.625rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--brand-primary) 30%, transparent);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.tux-filter-panel__chip:hover {
  background: color-mix(in srgb, var(--brand-primary) 14%, transparent);
}

.tux-filter-panel__chip-prefix {
  color: var(--text-muted);
  font-weight: 500;
}
.tux-filter-panel__chip-value {
  font-weight: 600;
}
.tux-filter-panel__chip-remove {
  width: 0.75rem;
  height: 0.75rem;
  color: var(--brand-primary);
}

.tux-filter-panel__facet {
  border-bottom: 1px solid var(--surface-border);
}
.tux-filter-panel__facet:last-child {
  border-bottom: 0;
}

.tux-filter-panel__summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.8125rem;
  cursor: pointer;
  list-style: none;
  user-select: none;
  color: var(--text-primary);
}
.tux-filter-panel__summary::-webkit-details-marker { display: none; }

.tux-filter-panel__facet-label { flex: 1; }

.tux-filter-panel__facet-count {
  display: inline-block;
  min-width: 1.25rem;
  padding: 0 0.375rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  text-align: center;
  background: var(--brand-primary);
  color: #fff;
  border-radius: var(--radius-sm);
  line-height: 1.4;
}

.tux-filter-panel__facet-chevron {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--text-muted);
  transition: transform 0.15s ease;
}

.tux-filter-panel__facet[open] .tux-filter-panel__facet-chevron {
  transform: rotate(180deg);
}

.tux-filter-panel__buckets {
  list-style: none;
  margin: 0 0 0.625rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tux-filter-panel__bucket-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  cursor: pointer;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}
.tux-filter-panel__bucket-label:hover {
  color: var(--text-primary);
}

.tux-filter-panel__checkbox {
  width: 0.875rem;
  height: 0.875rem;
  accent-color: var(--brand-primary);
  cursor: pointer;
  flex-shrink: 0;
}

.tux-filter-panel__bucket-text {
  flex: 1;
}

.tux-filter-panel__bucket-count {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
</style>
