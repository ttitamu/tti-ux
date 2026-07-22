<script setup lang="ts">
/**
 * TuxRuleBuilder — relational query UI (field + op + value rows,
 * AND/OR groupers, nestable groups).
 *
 * Pairs with the existing faceted `TuxFilterPanel`. Reach for the
 * RuleBuilder when the user needs to express
 * **relations between fields** ("revenue > 1000 AND (region IS texas
 * OR region IS oklahoma)"), not just multi-select facet narrowing.
 *
 * **Data shape** — a tree of `Group`s; each group has a
 * `combinator` (`AND` | `OR`) and an ordered list of `Rule`s and/or
 * nested `Group`s. The root is always a Group (so the top-level
 * combinator is meaningful even with one rule).
 *
 * **Field catalog** — consumer-passed via `:fields`. Each field
 * declares its key, label, type, and (for `select`) options. The
 * operator set is derived from the field type, with a per-field
 * override available.
 *
 * **State ownership** — fully v-modeled. The component does not
 * persist or evaluate the query — it just renders the tree and
 * emits the new tree on every mutation. The host evaluates against
 * its dataset.
 *
 * Usage:
 *   <tux-rule-builder
 *     v-model="query"
 *     :fields="fields"
 *     @apply="onApply"
 *     @clear="onClear"
 *   />
 */

import TuxRuleBuilderGroup from "./TuxRuleBuilderGroup.vue";

export type Combinator = "AND" | "OR";
export type FieldType = "string" | "number" | "date" | "select" | "boolean";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  /** Required when `type === "select"`. */
  options?: FieldOption[];
  /** Override the default operator set for this field type. */
  operators?: string[];
}

export interface Rule {
  id: string;
  /** Discriminator for tree traversal. */
  kind: "rule";
  field: string;
  operator: string;
  /** Single value for most ops; `[lo, hi]` for `between`. */
  value: unknown;
}

export interface Group {
  id: string;
  kind: "group";
  combinator: Combinator;
  children: Array<Rule | Group>;
}

interface Props {
  modelValue: Group;
  fields: FieldDef[];
  /** Hide the Apply / Clear footer. The host might wire those to a
   *  global action bar instead. */
  showActions?: boolean;
  /** Maximum group-nesting depth. Default 3 — deeper nestings are
   *  almost always a sign the query should be split. */
  maxDepth?: number;
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  maxDepth: 3,
});

const emit = defineEmits<{
  "update:modelValue": [v: Group];
  apply: [v: Group];
  clear: [];
}>();

// Provide the field catalog to recursive group children.
provide("tux-rule-builder:fields", props.fields);
provide("tux-rule-builder:maxDepth", props.maxDepth);

function onGroupUpdate(next: Group) {
  emit("update:modelValue", next);
}

function clear() {
  emit("update:modelValue", {
    id: props.modelValue.id,
    kind: "group",
    combinator: "AND",
    children: [],
  });
  emit("clear");
}
</script>

<template>
  <!-- Using a plain <div>: a <section> with aria-label becomes a
       landmark, and multiple builders on one page collide on the
       `landmark-unique` axe rule. The host names the surface via
       surrounding headings. -->
  <div class="tux-rule-builder">
    <TuxRuleBuilderGroup
      :model-value="modelValue"
      :depth="0"
      :is-root="true"
      @update:model-value="onGroupUpdate"
    />

    <footer v-if="showActions" class="tux-rule-builder__footer">
      <button
        type="button"
        class="tux-rule-builder__btn"
        @click="clear"
      >
        Clear
      </button>
      <button
        type="button"
        class="tux-rule-builder__btn tux-rule-builder__btn--primary"
        @click="emit('apply', modelValue)"
      >
        Apply
      </button>
    </footer>
  </div>
</template>

<style scoped>
.tux-rule-builder {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-family: var(--font-sans);
  container-type: inline-size;
}

.tux-rule-builder__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--surface-border);
}

.tux-rule-builder__btn {
  font: inherit;
  font-size: 0.8125rem;
  padding: 0.375rem 0.875rem;
  background: transparent;
  border: 1px solid var(--surface-border);
  border-radius: 0.375rem;
  color: var(--text-primary);
  cursor: pointer;
}
.tux-rule-builder__btn:hover {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}
.tux-rule-builder__btn--primary {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: var(--brand-on-primary, white);
}
.tux-rule-builder__btn--primary:hover {
  background: color-mix(in srgb, var(--brand-primary) 88%, black);
  color: var(--brand-on-primary, white);
}
</style>
