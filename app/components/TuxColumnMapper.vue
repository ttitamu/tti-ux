<script setup lang="ts">
/**
 * TuxColumnMapper — tabular import and schema alignment wizard.
 *
 * Maps incoming CSV/spreadsheet source columns onto canonical target
 * field specifications with fuzzy alias auto-mapping, live first-row
 * sample previews, numeric type-mismatch warnings, and required-field gating.
 */
import { computed, ref, useId, watch } from "vue";

export interface TargetFieldSpec {
  key: string;
  label: string;
  required?: boolean;
  type?: "string" | "number" | "date";
  aliases?: string[];
}

interface Props {
  /** Column header names detected in the uploaded source file. */
  sourceColumns: string[];
  /** Representative sample rows keyed by source column header. */
  sampleRows: Array<Record<string, string | number>>;
  /** Canonical target schema fields to populate. */
  targetFields: TargetFieldSpec[];
  /** Active mapping dictionary of targetField.key -> sourceColumn. */
  modelValue: Record<string, string>;
  /** Label for the final confirmation button. */
  confirmLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  confirmLabel: "Apply Mapping",
});

const emit = defineEmits<{
  "update:modelValue": [mapping: Record<string, string>];
  confirm: [mapping: Record<string, string>];
}>();

const instanceId = useId();
const localMapping = ref<Record<string, string>>({ ...props.modelValue });

watch(
  () => props.modelValue,
  (next) => {
    localMapping.value = { ...next };
  },
  { deep: true },
);

function selectId(fieldKey: string): string {
  return `tux-colmap-${instanceId}-${fieldKey}`;
}

function onSelectColumn(fieldKey: string, sourceCol: string) {
  let next: Record<string, string>;
  if (!sourceCol) {
    const { [fieldKey]: _removed, ...rest } = localMapping.value;
    void _removed;
    next = rest;
  } else {
    next = {
      ...localMapping.value,
      [fieldKey]: sourceCol,
    };
  }
  localMapping.value = next;
  emit("update:modelValue", next);
}

function normalizeKey(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function tokenize(raw: string): string[] {
  return raw
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function scoreColumnMatch(field: TargetFieldSpec, sourceCol: string): number {
  const normCol = normalizeKey(sourceCol);
  if (!normCol) return 0;
  const colTokens = tokenize(sourceCol);
  const candidates = [field.key, field.label, ...(field.aliases ?? [])];

  let best = 0;
  for (const term of candidates) {
    const normTerm = normalizeKey(term);
    if (!normTerm) continue;
    if (normCol === normTerm) {
      best = Math.max(best, 100);
      continue;
    }
    const termTokens = tokenize(term);
    if (
      colTokens.length > 0 &&
      colTokens.length === termTokens.length &&
      colTokens.every((t) => termTokens.includes(t))
    ) {
      best = Math.max(best, 95);
      continue;
    }
    if (
      normCol.length >= 3 &&
      normTerm.length >= 3 &&
      (normCol.includes(normTerm) || normTerm.includes(normCol))
    ) {
      best = Math.max(best, 80);
      continue;
    }
    if (colTokens.some((t) => t.length >= 3 && termTokens.includes(t))) {
      best = Math.max(best, 65);
    }
  }
  return best;
}

function autoMapColumns() {
  const pairs: Array<{ fieldKey: string; sourceCol: string; score: number }> = [];
  for (const field of props.targetFields) {
    for (const sourceCol of props.sourceColumns) {
      const score = scoreColumnMatch(field, sourceCol);
      if (score >= 65) {
        pairs.push({ fieldKey: field.key, sourceCol, score });
      }
    }
  }
  pairs.sort((a, b) => b.score - a.score);

  const assignedFields = new Set<string>();
  const assignedCols = new Set<string>();
  const next: Record<string, string> = {};

  for (const pair of pairs) {
    if (assignedFields.has(pair.fieldKey) || assignedCols.has(pair.sourceCol)) {
      continue;
    }
    assignedFields.add(pair.fieldKey);
    assignedCols.add(pair.sourceCol);
    next[pair.fieldKey] = pair.sourceCol;
  }

  localMapping.value = next;
  emit("update:modelValue", next);
}

function sampleValueFor(fieldKey: string): string | number | undefined {
  const col = localMapping.value[fieldKey];
  if (!col || !props.sourceColumns.includes(col)) return undefined;
  return props.sampleRows[0]?.[col];
}

function isNumericValue(val: string | number | undefined): boolean {
  if (val === undefined) return true;
  if (typeof val === "number") return Number.isFinite(val);
  const cleaned = val.trim().replace(/,/g, "");
  if (cleaned === "") return false;
  return Number.isFinite(Number(cleaned));
}

function hasTypeMismatch(field: TargetFieldSpec): boolean {
  const col = localMapping.value[field.key];
  if (!col || props.sampleRows.length === 0) return false;
  const val = sampleValueFor(field.key);
  if (field.type === "number") {
    return !isNumericValue(val);
  }
  return false;
}

const requiredFields = computed(() =>
  props.targetFields.filter((f) => Boolean(f.required)),
);

const mappedRequiredCount = computed(() =>
  requiredFields.value.filter((f) => {
    const col = localMapping.value[f.key];
    return Boolean(col && props.sourceColumns.includes(col));
  }).length,
);

const mappedTotalCount = computed(() =>
  props.targetFields.filter((f) => {
    const col = localMapping.value[f.key];
    return Boolean(col && props.sourceColumns.includes(col));
  }).length,
);

const allRequiredMapped = computed(
  () => mappedRequiredCount.value === requiredFields.value.length,
);

const mismatchCount = computed(
  () => props.targetFields.filter((f) => hasTypeMismatch(f)).length,
);

function handleConfirm() {
  if (!allRequiredMapped.value) return;
  emit("confirm", { ...localMapping.value });
}
</script>

<template>
  <div class="tux-column-mapper">
    <div class="tux-column-mapper__toolbar">
      <div class="tux-column-mapper__status">
        <span class="tux-column-mapper__progress">
          {{ mappedTotalCount }} of {{ targetFields.length }} fields mapped
        </span>
        <span v-if="requiredFields.length > 0" class="tux-column-mapper__req-summary">
          · {{ mappedRequiredCount }}/{{ requiredFields.length }} required complete
        </span>
        <span
          v-if="mismatchCount > 0"
          class="tux-column-mapper__warning-pill"
          role="status"
        >
          {{ mismatchCount }} {{ mismatchCount === 1 ? "type warning" : "type warnings" }}
        </span>
      </div>

      <button
        type="button"
        class="tux-column-mapper__btn tux-column-mapper__btn--secondary"
        @click="autoMapColumns"
      >
        Auto-Map Columns
      </button>
    </div>

    <div class="tux-column-mapper__scroll">
      <table class="tux-column-mapper__table">
        <caption class="tux-column-mapper__caption">
          Source column to target schema field alignment
        </caption>
        <thead>
          <tr>
            <th scope="col" class="tux-column-mapper__th">Target Field</th>
            <th scope="col" class="tux-column-mapper__th">Expected Type</th>
            <th scope="col" class="tux-column-mapper__th">Source Column</th>
            <th scope="col" class="tux-column-mapper__th">Sample Preview</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="field in targetFields"
            :key="field.key"
            class="tux-column-mapper__row"
            :class="{ 'tux-column-mapper__row--mismatch': hasTypeMismatch(field) }"
          >
            <th scope="row" class="tux-column-mapper__field-th">
              <div class="tux-column-mapper__field-head">
                <label :for="selectId(field.key)" class="tux-column-mapper__label">
                  {{ field.label }}
                </label>
                <span
                  v-if="field.required"
                  class="tux-column-mapper__req-badge"
                >
                  Required
                </span>
              </div>
              <code class="tux-column-mapper__field-key">{{ field.key }}</code>
            </th>

            <td class="tux-column-mapper__td">
              <span class="tux-column-mapper__type-badge">
                {{ field.type ?? "string" }}
              </span>
            </td>

            <td class="tux-column-mapper__td tux-column-mapper__td--select">
              <select
                :id="selectId(field.key)"
                class="tux-column-mapper__select"
                :value="localMapping[field.key] ?? ''"
                @change="onSelectColumn(field.key, ($event.target as HTMLSelectElement).value)"
              >
                <option value="">— Unmapped —</option>
                <option
                  v-for="col in sourceColumns"
                  :key="col"
                  :value="col"
                >
                  {{ col }}
                </option>
              </select>
            </td>

            <td class="tux-column-mapper__td tux-column-mapper__td--preview">
              <template v-if="localMapping[field.key] && sourceColumns.includes(localMapping[field.key]!)">
                <div class="tux-column-mapper__preview-wrap">
                  <code class="tux-column-mapper__sample-val">
                    {{ sampleValueFor(field.key) !== undefined ? String(sampleValueFor(field.key)) : "—" }}
                  </code>
                  <span
                    v-if="hasTypeMismatch(field)"
                    class="tux-column-mapper__mismatch"
                    role="status"
                  >
                    Type mismatch: expected numeric value
                  </span>
                </div>
              </template>
              <span v-else class="tux-column-mapper__unmapped-hint">
                Not mapped
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="tux-column-mapper__footer">
      <p class="tux-column-mapper__footer-note">
        <template v-if="!allRequiredMapped">
          Map all required target fields before applying schema alignment.
        </template>
        <template v-else>
          All required target fields are mapped and ready to import.
        </template>
      </p>

      <button
        type="button"
        class="tux-column-mapper__btn tux-column-mapper__btn--primary"
        :disabled="!allRequiredMapped"
        @click="handleConfirm"
      >
        {{ confirmLabel }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.tux-column-mapper {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  font-family: var(--font-body);
  color: var(--text-primary);
  line-height: 1.5;
}

.tux-column-mapper__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  padding: var(--space-12) var(--space-16);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.tux-column-mapper__status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
}

.tux-column-mapper__progress {
  font-weight: 700;
  color: var(--text-primary);
}

.tux-column-mapper__req-summary {
  color: var(--text-secondary);
}

.tux-column-mapper__warning-pill {
  display: inline-block;
  padding: 2px var(--space-8);
  border-radius: var(--radius-full);
  background: var(--status-warning-fill);
  color: var(--status-warning-ink);
  border: 1px solid var(--status-warning);
  font-size: 0.75rem;
  font-weight: 700;
}

.tux-column-mapper__scroll {
  overflow-x: auto;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
}

.tux-column-mapper__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.tux-column-mapper__caption {
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

.tux-column-mapper__th {
  padding: var(--space-12) var(--space-16);
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

.tux-column-mapper__row {
  border-bottom: 1px solid var(--surface-border-subtle);
}

.tux-column-mapper__row:last-child {
  border-bottom: 0;
}

.tux-column-mapper__row--mismatch {
  background: var(--surface-eggshell);
}

.tux-column-mapper__field-th {
  padding: var(--space-12) var(--space-16);
  text-align: left;
  vertical-align: middle;
}

.tux-column-mapper__field-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.tux-column-mapper__label {
  font-weight: 700;
  color: var(--text-primary);
  cursor: pointer;
}

.tux-column-mapper__req-badge {
  display: inline-block;
  padding: 1px var(--space-8);
  border-radius: var(--radius-sm);
  background: var(--brand-fill);
  color: var(--text-on-brand);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.tux-column-mapper__field-key {
  display: inline-block;
  margin-top: 2px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-muted);
}

.tux-column-mapper__td {
  padding: var(--space-12) var(--space-16);
  vertical-align: middle;
}

.tux-column-mapper__type-badge {
  display: inline-block;
  padding: 2px var(--space-8);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
}

.tux-column-mapper__td--select {
  min-width: 14rem;
}

.tux-column-mapper__select {
  width: 100%;
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-12);
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.tux-column-mapper__select:hover {
  border-color: var(--brand-primary);
}

.tux-column-mapper__select:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-column-mapper__preview-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
}

.tux-column-mapper__sample-val {
  display: inline-block;
  padding: 2px var(--space-8);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border-subtle);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
}

.tux-column-mapper__mismatch {
  display: inline-block;
  padding: 2px var(--space-8);
  border-radius: var(--radius-sm);
  background: var(--status-warning-fill);
  color: var(--status-warning-ink);
  border: 1px solid var(--status-warning);
  font-size: 0.75rem;
  font-weight: 700;
}

.tux-column-mapper__unmapped-hint {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.tux-column-mapper__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  padding-top: var(--space-8);
}

.tux-column-mapper__footer-note {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.tux-column-mapper__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-16);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.tux-column-mapper__btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-column-mapper__btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.tux-column-mapper__btn--primary {
  background: var(--brand-fill);
  color: var(--text-on-brand);
  border-color: var(--brand-fill);
}

.tux-column-mapper__btn--primary:hover:not(:disabled) {
  background: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
}

.tux-column-mapper__btn--secondary {
  background: var(--surface-raised);
  color: var(--text-primary);
  border-color: var(--surface-border);
}

.tux-column-mapper__btn--secondary:hover:not(:disabled) {
  border-color: var(--brand-primary);
  background: var(--wash-brand-4);
}

@media (prefers-reduced-motion: reduce) {
  .tux-column-mapper__btn {
    transition: none;
  }
}
</style>
