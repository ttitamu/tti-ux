<script setup lang="ts">
/**
 * TuxRuleBuilderGroup — recursive child of `TuxRuleBuilder`.
 *
 * Renders one group: its combinator toggle (AND/OR), an ordered list
 * of rules and nested groups, and the "+ Add rule" / "+ Add group"
 * affordances. Recurses on itself for child groups (depth-bounded
 * via the `tux-rule-builder:maxDepth` inject).
 *
 * Not for direct consumer use — consumer wires `TuxRuleBuilder`,
 * which owns the field catalog + footer actions.
 */

import type {
  Combinator,
  FieldDef,
  FieldType,
  Group,
  Rule,
} from "./TuxRuleBuilder.vue";

// Default operator sets per field type. Consumers can override per
// field via `FieldDef.operators`. Lives here (not in TuxRuleBuilder)
// because `<script setup>` cannot contain ES module value exports,
// and the recursive child is the only consumer.
const DEFAULT_OPERATORS: Record<FieldType, string[]> = {
  string:  ["contains", "equals", "starts with", "not contains"],
  number:  ["=", "≠", "<", "≤", ">", "≥", "between"],
  date:    ["on", "before", "after", "between"],
  select:  ["is", "is not"],
  boolean: ["is true", "is false"],
};

interface Props {
  modelValue: Group;
  depth: number;
  isRoot?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isRoot: false,
});

const emit = defineEmits<{
  "update:modelValue": [v: Group];
  remove: [];
}>();

const fields = inject<FieldDef[]>("tux-rule-builder:fields", []);
const maxDepth = inject<number>("tux-rule-builder:maxDepth", 3);

const canNest = computed(() => props.depth < maxDepth - 1);

function fieldOf(key: string): FieldDef | undefined {
  return fields.find((f) => f.key === key);
}

function operatorsFor(key: string): string[] {
  const f = fieldOf(key);
  if (!f) return [];
  return f.operators ?? DEFAULT_OPERATORS[f.type];
}

function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function defaultValueFor(field: FieldDef, operator: string): unknown {
  if (operator === "between") {
    return [null, null];
  }
  if (field.type === "select") {
    return field.options?.[0]?.value ?? "";
  }
  if (field.type === "boolean") {
    return true;
  }
  if (field.type === "number") {
    return null;
  }
  return "";
}

function newRule(): Rule {
  const f = fields[0];
  if (!f) {
    return {
      id: newId("r"),
      kind: "rule",
      field: "",
      operator: "",
      value: "",
    };
  }
  const op = (f.operators ?? DEFAULT_OPERATORS[f.type])[0] ?? "";
  return {
    id: newId("r"),
    kind: "rule",
    field: f.key,
    operator: op,
    value: defaultValueFor(f, op),
  };
}

function emitWith(children: Array<Rule | Group>, combinator?: Combinator) {
  emit("update:modelValue", {
    ...props.modelValue,
    combinator: combinator ?? props.modelValue.combinator,
    children,
  });
}

function setCombinator(c: Combinator) {
  emitWith(props.modelValue.children, c);
}

function addRule() {
  emitWith([...props.modelValue.children, newRule()]);
}

function addGroup() {
  const newG: Group = {
    id: newId("g"),
    kind: "group",
    combinator: "AND",
    children: [newRule()],
  };
  emitWith([...props.modelValue.children, newG]);
}

function removeChild(id: string) {
  emitWith(props.modelValue.children.filter((c) => c.id !== id));
}

function updateRule(updated: Rule) {
  emitWith(
    props.modelValue.children.map((c) =>
      c.id === updated.id ? updated : c,
    ),
  );
}

function updateChildGroup(updated: Group) {
  emitWith(
    props.modelValue.children.map((c) =>
      c.id === updated.id ? updated : c,
    ),
  );
}

function onFieldChange(rule: Rule, newKey: string) {
  const f = fieldOf(newKey);
  if (!f) return;
  const ops = f.operators ?? DEFAULT_OPERATORS[f.type];
  const op = ops.includes(rule.operator) ? rule.operator : (ops[0] ?? "");
  updateRule({
    ...rule,
    field: newKey,
    operator: op,
    value: defaultValueFor(f, op),
  });
}

function onOperatorChange(rule: Rule, newOp: string) {
  const f = fieldOf(rule.field);
  if (!f) return;
  // If switching to/from `between`, the value shape changes.
  const wasBetween = rule.operator === "between";
  const isBetween = newOp === "between";
  const value = wasBetween === isBetween
    ? rule.value
    : defaultValueFor(f, newOp);
  updateRule({ ...rule, operator: newOp, value });
}

function onValueChange(rule: Rule, newValue: unknown) {
  updateRule({ ...rule, value: newValue });
}

function onBetweenChange(rule: Rule, idx: 0 | 1, raw: string) {
  const [lo, hi] = Array.isArray(rule.value) ? rule.value : [null, null];
  const next = raw === "" ? null : Number(raw);
  const tuple = idx === 0 ? [next, hi] : [lo, next];
  updateRule({ ...rule, value: tuple });
}
</script>

<template>
  <div
    class="tux-rule-builder-group"
    :class="{
      'tux-rule-builder-group--root': isRoot,
      'tux-rule-builder-group--nested': !isRoot,
    }"
  >
    <header class="tux-rule-builder-group__header">
      <div
        class="tux-rule-builder-group__combinator"
        role="radiogroup"
        aria-label="Combinator"
      >
        <button
          type="button"
          class="tux-rule-builder-group__combinator-btn"
          :class="modelValue.combinator === 'AND' && 'tux-rule-builder-group__combinator-btn--active'"
          :aria-pressed="modelValue.combinator === 'AND'"
          @click="setCombinator('AND')"
        >
          AND
        </button>
        <button
          type="button"
          class="tux-rule-builder-group__combinator-btn"
          :class="modelValue.combinator === 'OR' && 'tux-rule-builder-group__combinator-btn--active'"
          :aria-pressed="modelValue.combinator === 'OR'"
          @click="setCombinator('OR')"
        >
          OR
        </button>
      </div>
      <button
        v-if="!isRoot"
        type="button"
        class="tux-rule-builder-group__remove"
        aria-label="Remove group"
        @click="emit('remove')"
      >
        <UIcon name="lucide:x" class="tux-rule-builder-group__remove-icon" aria-hidden="true" />
      </button>
    </header>

    <ol class="tux-rule-builder-group__children">
      <li
        v-for="child in modelValue.children"
        :key="child.id"
        class="tux-rule-builder-group__child"
      >
        <template v-if="child.kind === 'rule'">
          <div class="tux-rule-builder-row">
            <select
              class="tux-rule-builder-row__select tux-rule-builder-row__select--field"
              :value="child.field"
              :aria-label="`Field for rule`"
              @change="onFieldChange(child, ($event.target as HTMLSelectElement).value)"
            >
              <option
                v-for="f in fields"
                :key="f.key"
                :value="f.key"
              >
                {{ f.label }}
              </option>
            </select>

            <select
              class="tux-rule-builder-row__select tux-rule-builder-row__select--op"
              :value="child.operator"
              :aria-label="`Operator`"
              @change="onOperatorChange(child, ($event.target as HTMLSelectElement).value)"
            >
              <option
                v-for="op in operatorsFor(child.field)"
                :key="op"
                :value="op"
              >
                {{ op }}
              </option>
            </select>

            <template v-if="fieldOf(child.field)?.type === 'select'">
              <select
                class="tux-rule-builder-row__select tux-rule-builder-row__select--value"
                :value="String(child.value ?? '')"
                :aria-label="`Value`"
                @change="onValueChange(child, ($event.target as HTMLSelectElement).value)"
              >
                <option
                  v-for="o in fieldOf(child.field)?.options ?? []"
                  :key="o.value"
                  :value="o.value"
                >
                  {{ o.label }}
                </option>
              </select>
            </template>

            <template v-else-if="fieldOf(child.field)?.type === 'boolean'">
              <span class="tux-rule-builder-row__noinput">—</span>
            </template>

            <template v-else-if="child.operator === 'between'">
              <input
                class="tux-rule-builder-row__input tux-rule-builder-row__input--between"
                type="number"
                :value="Array.isArray(child.value) ? (child.value[0] ?? '') : ''"
                aria-label="From"
                placeholder="From"
                @input="onBetweenChange(child, 0, ($event.target as HTMLInputElement).value)"
              >
              <span class="tux-rule-builder-row__sep">–</span>
              <input
                class="tux-rule-builder-row__input tux-rule-builder-row__input--between"
                type="number"
                :value="Array.isArray(child.value) ? (child.value[1] ?? '') : ''"
                aria-label="To"
                placeholder="To"
                @input="onBetweenChange(child, 1, ($event.target as HTMLInputElement).value)"
              >
            </template>

            <template v-else-if="fieldOf(child.field)?.type === 'number'">
              <input
                class="tux-rule-builder-row__input"
                type="number"
                :value="child.value === null || child.value === undefined ? '' : String(child.value)"
                aria-label="Value"
                @input="onValueChange(child, ($event.target as HTMLInputElement).value === '' ? null : Number(($event.target as HTMLInputElement).value))"
              >
            </template>

            <template v-else-if="fieldOf(child.field)?.type === 'date'">
              <input
                class="tux-rule-builder-row__input"
                type="date"
                :value="String(child.value ?? '')"
                aria-label="Value"
                @input="onValueChange(child, ($event.target as HTMLInputElement).value)"
              >
            </template>

            <template v-else>
              <input
                class="tux-rule-builder-row__input"
                type="text"
                :value="String(child.value ?? '')"
                aria-label="Value"
                @input="onValueChange(child, ($event.target as HTMLInputElement).value)"
              >
            </template>

            <button
              type="button"
              class="tux-rule-builder-row__remove"
              aria-label="Remove rule"
              @click="removeChild(child.id)"
            >
              <UIcon name="lucide:x" class="tux-rule-builder-row__remove-icon" aria-hidden="true" />
            </button>
          </div>
        </template>

        <template v-else>
          <TuxRuleBuilderGroup
            :model-value="child"
            :depth="depth + 1"
            @update:model-value="updateChildGroup"
            @remove="removeChild(child.id)"
          />
        </template>
      </li>
    </ol>

    <div class="tux-rule-builder-group__actions">
      <button
        type="button"
        class="tux-rule-builder-group__add"
        @click="addRule"
      >
        <UIcon name="lucide:plus" class="tux-rule-builder-group__add-icon" aria-hidden="true" />
        Add rule
      </button>
      <button
        v-if="canNest"
        type="button"
        class="tux-rule-builder-group__add"
        @click="addGroup"
      >
        <UIcon name="lucide:plus-square" class="tux-rule-builder-group__add-icon" aria-hidden="true" />
        Add group
      </button>
    </div>
  </div>
</template>

<style scoped>
.tux-rule-builder-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.tux-rule-builder-group--root {
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: 0.5rem;
  padding: 0.75rem;
}
.tux-rule-builder-group--nested {
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: 0.375rem;
  padding: 0.625rem;
  border-left: 3px solid color-mix(in srgb, var(--brand-primary) 35%, var(--surface-border));
}

.tux-rule-builder-group__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.tux-rule-builder-group__combinator {
  display: inline-flex;
  border: 1px solid var(--surface-border);
  border-radius: 0.375rem;
  overflow: hidden;
}
.tux-rule-builder-group__combinator-btn {
  font: inherit;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 0.25rem 0.625rem;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}
.tux-rule-builder-group__combinator-btn + .tux-rule-builder-group__combinator-btn {
  border-left: 1px solid var(--surface-border);
}
.tux-rule-builder-group__combinator-btn--active {
  background: var(--brand-primary);
  color: var(--brand-on-primary, white);
}

.tux-rule-builder-group__remove {
  background: transparent;
  border: none;
  padding: 0.25rem;
  border-radius: 0.25rem;
  color: var(--text-muted);
  cursor: pointer;
}
.tux-rule-builder-group__remove:hover {
  color: var(--color-error, oklch(0.55 0.18 25));
  background: var(--surface-raised);
}
.tux-rule-builder-group__remove-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.tux-rule-builder-group__children {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.tux-rule-builder-group__child {
  /* Display a tiny combinator hint between siblings to make the
     AND/OR semantics visible at a glance. */
  position: relative;
}
.tux-rule-builder-group__child + .tux-rule-builder-group__child::before {
  content: attr(data-combinator);
}

.tux-rule-builder-row {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.tux-rule-builder-row__select,
.tux-rule-builder-row__input {
  font: inherit;
  font-size: 0.8125rem;
  padding: 0.3125rem 0.5rem;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: 0.3125rem;
  color: var(--text-primary);
  min-width: 0;
}
.tux-rule-builder-row__select:focus,
.tux-rule-builder-row__input:focus {
  outline: 2px solid var(--brand-primary);
  outline-offset: 1px;
  border-color: var(--brand-primary);
}
.tux-rule-builder-row__select--field { min-width: 9rem; }
.tux-rule-builder-row__select--op    { min-width: 6rem; }
.tux-rule-builder-row__select--value,
.tux-rule-builder-row__input         { flex: 1; min-width: 7rem; }
.tux-rule-builder-row__input--between { flex: 0 1 6rem; min-width: 5rem; }

.tux-rule-builder-row__sep {
  font-size: 0.8125rem;
  color: var(--text-muted);
}
.tux-rule-builder-row__noinput {
  flex: 1;
  font-size: 0.8125rem;
  color: var(--text-muted);
  padding: 0.3125rem 0.5rem;
}

.tux-rule-builder-row__remove {
  background: transparent;
  border: none;
  padding: 0.25rem;
  border-radius: 0.25rem;
  color: var(--text-muted);
  cursor: pointer;
}
.tux-rule-builder-row__remove:hover {
  color: var(--color-error, oklch(0.55 0.18 25));
  background: var(--surface-sunken);
}
.tux-rule-builder-row__remove-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.tux-rule-builder-group__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.tux-rule-builder-group__add {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: 1px dashed var(--surface-border);
  border-radius: 0.3125rem;
  color: var(--text-muted);
  cursor: pointer;
}
.tux-rule-builder-group__add:hover {
  border-color: var(--brand-primary);
  border-style: solid;
  color: var(--brand-primary);
}
.tux-rule-builder-group__add-icon {
  width: 0.75rem;
  height: 0.75rem;
}

@container (max-width: 28rem) {
  .tux-rule-builder-row {
    flex-direction: column;
    align-items: stretch;
  }
  .tux-rule-builder-row__select,
  .tux-rule-builder-row__input {
    width: 100%;
  }
  .tux-rule-builder-row__remove {
    align-self: flex-end;
  }
}
</style>
