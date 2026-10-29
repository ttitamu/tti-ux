<script setup lang="ts">
/**
 * TuxKeyValueInput — schema-aware `key = value` metadata & tag editor.
 *
 * Supports optional key/value autocomplete via native `<datalist>` suggestions,
 * required-key completeness banners with one-click population, duplicate-key
 * detection, and strict schema enforcement.
 */
import { computed, useId } from "vue";

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface KeySchemaDef {
  key: string;
  label?: string;
  required?: boolean;
  suggestions?: string[];
}

interface Props {
  modelValue: KeyValuePair[];
  schema?: KeySchemaDef[];
  strictKeys?: boolean;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  addLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  schema: () => [],
  strictKeys: false,
  keyPlaceholder: "key",
  valuePlaceholder: "value",
  addLabel: "Add attribute",
});

const emit = defineEmits<{
  "update:modelValue": [v: KeyValuePair[]];
}>();

const uid = useId();
const keyDatalistId = `${uid}-keys`;

const schemaMap = computed(() => {
  const map = new Map<string, KeySchemaDef>();
  for (const item of props.schema) {
    map.set(item.key, item);
  }
  return map;
});

function suggestionsForKey(rawKey: string): string[] {
  const match = schemaMap.value.get(rawKey.trim());
  return match?.suggestions ?? [];
}

const keyCounts = computed(() => {
  const counts = new Map<string, number>();
  for (const pair of props.modelValue) {
    const k = pair.key.trim();
    if (k.length > 0) {
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }
  return counts;
});

const duplicateKeys = computed<string[]>(() =>
  [...keyCounts.value.entries()]
    .filter(([, count]) => count > 1)
    .map(([key]) => key),
);

const unapprovedKeys = computed<string[]>(() => {
  if (!props.strictKeys || props.schema.length === 0) return [];
  const invalid = new Set<string>();
  for (const pair of props.modelValue) {
    const k = pair.key.trim();
    if (k.length > 0 && !schemaMap.value.has(k)) {
      invalid.add(k);
    }
  }
  return [...invalid];
});

const missingRequired = computed<KeySchemaDef[]>(() =>
  props.schema.filter(
    (s) => s.required && !props.modelValue.some((p) => p.key.trim() === s.key),
  ),
);

function isRowDuplicate(rawKey: string): boolean {
  const k = rawKey.trim();
  return k.length > 0 && (keyCounts.value.get(k) ?? 0) > 1;
}

function isRowUnapproved(rawKey: string): boolean {
  if (!props.strictKeys || props.schema.length === 0) return false;
  const k = rawKey.trim();
  return k.length > 0 && !schemaMap.value.has(k);
}

function isRowRequired(rawKey: string): boolean {
  const k = rawKey.trim();
  return Boolean(schemaMap.value.get(k)?.required);
}

function updateRowKey(idx: number, nextKey: string) {
  emit(
    "update:modelValue",
    props.modelValue.map((pair, i) =>
      i === idx ? { key: nextKey, value: pair.value } : pair,
    ),
  );
}

function updateRowValue(idx: number, nextValue: string) {
  emit(
    "update:modelValue",
    props.modelValue.map((pair, i) =>
      i === idx ? { key: pair.key, value: nextValue } : pair,
    ),
  );
}

function removeRow(idx: number) {
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== idx),
  );
}

function addRow() {
  emit("update:modelValue", [...props.modelValue, { key: "", value: "" }]);
}

function addMissingRequired() {
  if (missingRequired.value.length === 0) return;
  const additions: KeyValuePair[] = missingRequired.value.map((s) => ({
    key: s.key,
    value: "",
  }));
  emit("update:modelValue", [...props.modelValue, ...additions]);
}
</script>

<template>
  <div class="tux-kv-input">
    <datalist v-if="schema.length > 0" :id="keyDatalistId">
      <option
        v-for="item in schema"
        :key="item.key"
        :value="item.key"
      >
        {{ item.label ?? item.key }}
      </option>
    </datalist>

    <div
      v-if="missingRequired.length > 0"
      class="tux-kv-input__missing"
      role="status"
      aria-live="polite"
    >
      <div class="tux-kv-input__missing-copy">
        <span class="tux-kv-input__missing-title">Missing required keys:</span>
        <code
          v-for="req in missingRequired"
          :key="req.key"
          class="tux-kv-input__chip"
        >
          {{ req.key }}
        </code>
      </div>
      <button
        type="button"
        class="tux-kv-input__missing-btn"
        @click="addMissingRequired"
      >
        Add missing required keys
      </button>
    </div>

    <div
      v-if="duplicateKeys.length > 0 || unapprovedKeys.length > 0"
      class="tux-kv-input__warnings"
      role="alert"
    >
      <p v-if="duplicateKeys.length > 0" class="tux-kv-input__warning-line">
        Duplicate key{{ duplicateKeys.length > 1 ? "s" : "" }} detected:
        <strong>{{ duplicateKeys.join(", ") }}</strong>
      </p>
      <p v-if="unapprovedKeys.length > 0" class="tux-kv-input__warning-line">
        Unapproved key{{ unapprovedKeys.length > 1 ? "s" : "" }} outside schema:
        <strong>{{ unapprovedKeys.join(", ") }}</strong>
      </p>
    </div>

    <div v-if="modelValue.length > 0" class="tux-kv-input__rows">
      <div
        v-for="(pair, idx) in modelValue"
        :key="`${uid}-row-${idx}`"
        class="tux-kv-input__row"
        :class="{
          'tux-kv-input__row--warn': isRowDuplicate(pair.key) || isRowUnapproved(pair.key),
        }"
      >
        <div class="tux-kv-input__key-cell">
          <input
            :id="`${uid}-key-${idx}`"
            type="text"
            class="tux-kv-input__input tux-kv-input__input--key"
            :value="pair.key"
            :placeholder="keyPlaceholder"
            :list="schema.length > 0 ? keyDatalistId : undefined"
            :aria-label="`Attribute key ${idx + 1}`"
            :aria-invalid="isRowDuplicate(pair.key) || isRowUnapproved(pair.key) ? 'true' : undefined"
            autocomplete="off"
            spellcheck="false"
            @input="updateRowKey(idx, ($event.target as HTMLInputElement).value)"
          >
          <span
            v-if="isRowRequired(pair.key)"
            class="tux-kv-input__req-badge"
            title="Required schema attribute"
          >
            req
          </span>
        </div>

        <span class="tux-kv-input__eq" aria-hidden="true">=</span>

        <div class="tux-kv-input__val-cell">
          <input
            :id="`${uid}-val-${idx}`"
            type="text"
            class="tux-kv-input__input tux-kv-input__input--value"
            :value="pair.value"
            :placeholder="valuePlaceholder"
            :list="suggestionsForKey(pair.key).length > 0 ? `${uid}-vals-${idx}` : undefined"
            :aria-label="pair.key.trim() ? `Value for ${pair.key.trim()}` : `Attribute value ${idx + 1}`"
            autocomplete="off"
            @input="updateRowValue(idx, ($event.target as HTMLInputElement).value)"
          >
          <datalist
            v-if="suggestionsForKey(pair.key).length > 0"
            :id="`${uid}-vals-${idx}`"
          >
            <option
              v-for="sug in suggestionsForKey(pair.key)"
              :key="sug"
              :value="sug"
            />
          </datalist>
        </div>

        <button
          type="button"
          class="tux-kv-input__remove"
          :aria-label="pair.key.trim() ? `Remove ${pair.key.trim()}` : `Remove attribute row ${idx + 1}`"
          @click="removeRow(idx)"
        >
          <svg
            class="tux-kv-input__icon"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>
    </div>

    <p v-else class="tux-kv-input__empty">
      No metadata attributes defined yet.
    </p>

    <div class="tux-kv-input__actions">
      <button
        type="button"
        class="tux-kv-input__add"
        @click="addRow"
      >
        <svg
          class="tux-kv-input__icon"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M8 3v10M3 8h10" />
        </svg>
        <span>{{ addLabel }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.tux-kv-input {
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

.tux-kv-input__missing {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  padding: var(--space-8) var(--space-12);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-left: 3px solid var(--brand-primary);
  border-radius: var(--radius-md);
  flex-wrap: wrap;
}

.tux-kv-input__missing-copy {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex-wrap: wrap;
  font-size: 0.8125rem;
}

.tux-kv-input__missing-title {
  font-weight: 600;
  color: var(--text-primary);
}

.tux-kv-input__chip {
  padding: var(--space-2) var(--space-8);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-brand);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
}

.tux-kv-input__missing-btn {
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-12);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-on-brand);
  background: var(--brand-fill);
  border: 1px solid var(--brand-fill);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--motion-fast) var(--ease-standard);
}

.tux-kv-input__missing-btn:hover {
  background: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
}

.tux-kv-input__warnings {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-8) var(--space-12);
  background: var(--status-warning-fill);
  border: 1px solid var(--status-warning);
  border-radius: var(--radius-md);
  color: var(--status-warning-ink);
  font-size: 0.8125rem;
}

.tux-kv-input__warning-line {
  margin: 0;
  line-height: 1.5;
}

.tux-kv-input__rows {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.tux-kv-input__row {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.tux-kv-input__row--warn .tux-kv-input__input--key {
  border-color: var(--color-error);
}

.tux-kv-input__key-cell {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1 1 40%;
  min-width: 0;
}

.tux-kv-input__val-cell {
  display: flex;
  align-items: center;
  flex: 1 1 55%;
  min-width: 0;
}

.tux-kv-input__input {
  width: 100%;
  min-height: 44px;
  padding: var(--space-8) var(--space-12);
  font-size: 0.8125rem;
  color: var(--text-primary);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.tux-kv-input__input--key {
  font-family: var(--font-mono);
  padding-right: 3.25rem;
}

.tux-kv-input__input--value {
  font-family: var(--font-body);
}

.tux-kv-input__req-badge {
  position: absolute;
  right: var(--space-8);
  padding: 1px var(--space-4);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-brand);
  background: var(--wash-brand-8);
  border-radius: var(--radius-sm);
  pointer-events: none;
}

.tux-kv-input__eq {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-muted);
}

.tux-kv-input__remove {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: color var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard),
    background-color var(--motion-fast) var(--ease-standard);
}

.tux-kv-input__remove:hover {
  color: var(--color-error);
  border-color: var(--color-error);
  background: var(--surface-sunken);
}

.tux-kv-input__empty {
  margin: 0;
  padding: var(--space-12);
  font-size: 0.8125rem;
  color: var(--text-secondary);
  background: var(--surface-sunken);
  border: 1px dashed var(--surface-border);
  border-radius: var(--radius-md);
  text-align: center;
}

.tux-kv-input__actions {
  display: flex;
  justify-content: flex-start;
}

.tux-kv-input__add {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  padding: var(--space-8) var(--space-12);
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--surface-page);
  border: 1px dashed var(--surface-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: color var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard);
}

.tux-kv-input__add:hover {
  color: var(--brand-primary);
  border-color: var(--brand-primary);
  border-style: solid;
}

.tux-kv-input__icon {
  width: 0.875rem;
  height: 0.875rem;
}

.tux-kv-input__missing-btn:focus-visible,
.tux-kv-input__input:focus-visible,
.tux-kv-input__remove:focus-visible,
.tux-kv-input__add:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

@container (max-width: 28rem) {
  .tux-kv-input__row {
    flex-wrap: wrap;
    padding-bottom: var(--space-8);
    border-bottom: 1px solid var(--surface-border-subtle);
  }

  .tux-kv-input__key-cell,
  .tux-kv-input__val-cell {
    flex: 1 1 100%;
  }

  .tux-kv-input__eq {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tux-kv-input__missing-btn,
  .tux-kv-input__remove,
  .tux-kv-input__add {
    transition: none;
  }
}
</style>
