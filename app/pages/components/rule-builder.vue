<script setup>
import { corridorFields, initialQuery, emptyQuery } from "./rule-builder.demo-data";

useHead({ title: "TuxRuleBuilder · TUX" });

const query = ref(initialQuery);
const emptyTreeQuery = ref(emptyQuery);
const appliedSnapshot = ref(null);
const cleared = ref(false);

function onApply(q) {
  appliedSnapshot.value = JSON.parse(JSON.stringify(q));
  cleared.value = false;
}
function onClear() {
  cleared.value = true;
  appliedSnapshot.value = null;
}

const basicVue = `<tux-rule-builder
  v-model="query"
  :fields="fields"
  @apply="onApply"
  @clear="onClear"
/>`;

const fieldsTs = `interface FieldDef {
  key: string;
  label: string;
  type: "string" | "number" | "date" | "select" | "boolean";
  options?: { value: string; label: string }[]; // for select
  operators?: string[]; // override type defaults
}

// Operator defaults per type:
// string:  contains · equals · starts with · not contains
// number:  = · ≠ · < · ≤ · > · ≥ · between
// date:    on · before · after · between
// select:  is · is not
// boolean: is true · is false`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · data interaction" title="TuxRuleBuilder">
      Relational query UI — field + operator + value rows, AND/OR
      groupers, nestable groups (up to 3 levels deep by default).
      Pairs with the existing faceted <code>TuxFilterPanel</code>:
      reach for the rule builder when the user needs to express
      <em>relations between fields</em> ("compliance &lt; 50% AND
      district IS bryan"), not just multi-select narrowing.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · pre-seeded query</p>
      <h2 class="heading--bold text-xl font-bold">Length &gt; 5 mi AND (district IS bryan OR austin) AND compliance between 40 and 60</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        A realistic corridor-research query exercising every operator
        category. Toggle the inner group's combinator to flip
        OR → AND; add or remove rules; nest another group.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <div class="max-w-3xl">
          <TuxRuleBuilder
            v-model="query"
            :fields="corridorFields"
            @apply="onApply"
            @clear="onClear"
          />
        </div>
      </TuxExample>
      <div class="mt-3 text-xs text-text-muted font-mono max-w-3xl">
        <template v-if="cleared">cleared — query reset to empty root group</template>
        <template v-else-if="appliedSnapshot">
          <strong>applied tree (host evaluates against dataset):</strong>
          <pre class="mt-1 p-2 bg-surface-sunken border border-surface-border rounded overflow-x-auto">{{ JSON.stringify(appliedSnapshot, null, 2) }}</pre>
        </template>
        <template v-else>
          state: in-progress · press <em>Apply</em> to snapshot the tree
        </template>
      </div>
    </section>

    <section>
      <p class="eyebrow">empty state · build from scratch</p>
      <h2 class="heading--bold text-xl font-bold">Empty root</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        With no children, the root still shows its combinator toggle
        and the "Add rule" / "Add group" affordances. Useful for
        surfaces where the user starts from zero.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <div class="max-w-3xl">
          <TuxRuleBuilder
            v-model="emptyTreeQuery"
            :fields="corridorFields"
            :show-actions="false"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Field catalog</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        The consumer passes a field catalog via <code>:fields</code>.
        Each field declares its type; the operator set is derived
        from the type (overridable per field). Value editors switch
        based on type + operator: text input · numeric input · date
        picker · select · "between" pair · boolean (no input).
      </p>
      <TuxCodeBlock class="mt-4" :code="fieldsTs" lang="ts" filename="types.ts" />
    </section>

    <section>
      <p class="eyebrow">faceted vs relational</p>
      <h2 class="heading--bold text-xl font-bold">When to reach for which</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Same surface area as <code>TuxFilterPanel</code>, but a
        different shape of question. The two compose well — facets
        for the dominant narrowing dimensions, rule builder for the
        long-tail relational ones.
      </p>
      <ul class="mt-3 text-sm text-text-secondary leading-relaxed list-disc pl-5 space-y-1 max-w-2xl">
        <li>
          <strong>TuxFilterPanel</strong> — multi-select narrowing
          across a known set of facets ("owner ∈ {Chen, Kim} AND
          type ∈ {PDF, CSV}"). The user picks from buckets you've
          pre-aggregated. Right answer for browse / search results.
        </li>
        <li>
          <strong>TuxRuleBuilder</strong> — relational predicates
          across heterogeneous fields ("compliance &lt; 50% AND last
          inspected before 2024-01-01 AND treatment IS rumble"). The
          user writes the predicate; you evaluate at query time.
          Right answer for analytical / reporting surfaces.
        </li>
        <li>
          <strong>Both together</strong> — facets on the left rail
          for the narrowing axes (district, project), rule builder
          in a slideover for the "save this as a smart view" flow.
        </li>
      </ul>
    </section>
  </div>
</template>
