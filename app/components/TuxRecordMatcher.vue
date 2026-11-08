<script setup lang="ts">
/**
 * TuxRecordMatcher — side-by-side unlinked record to fuzzy candidate
 * resolution queue with rule creation option and batch confirmation.
 *
 * Pre-selects the highest-confidence candidate per item, surfaces
 * confidence scores, codes, and metadata via accessible radio groups,
 * and emits single-item, batch high-confidence (>=90%), or deferral events.
 */
import { computed, ref, useId, watch } from "vue";

export interface MatchCandidate {
  id: string;
  code?: string;
  label: string;
  confidence: number;
  meta?: string;
}

export interface UnmatchedRecordItem {
  id: string;
  sourceTitle: string;
  sourceCode?: string;
  sourceMeta?: string;
  amountLabel?: string;
  candidates: MatchCandidate[];
}

interface Props {
  /** Queue of unmatched source records and their candidate targets. */
  items: UnmatchedRecordItem[];
  /** Allow creating a persistent mapping rule when confirming an item. */
  allowRuleCreation?: boolean;
  /** Accessible label for the per-item rule creation checkbox. */
  ruleCheckboxLabel?: string;
  /** Label for the per-item accept action button. */
  acceptLabel?: string;
  /** Label for the per-item defer/dismiss action button. */
  dismissLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  allowRuleCreation: true,
  ruleCheckboxLabel: "Remember this mapping rule for future records",
  acceptLabel: "Confirm Match",
  dismissLabel: "Defer",
});

const emit = defineEmits<{
  resolve: [payload: { itemId: string; candidateId: string; createRule: boolean }];
  resolveBatch: [payload: Array<{ itemId: string; candidateId: string; createRule: boolean }>];
  dismiss: [itemId: string];
}>();

const instanceId = useId();

const selectedByItem = ref<Record<string, string>>({});
const createRuleByItem = ref<Record<string, boolean>>({});

const usesUnitScale = computed(() => {
  let hasPositive = false;
  for (const item of props.items) {
    for (const c of item.candidates) {
      if (c.confidence > 1) return false;
      if (c.confidence > 0) hasPositive = true;
    }
  }
  return hasPositive;
});

function toConfidencePct(raw: number): number {
  const scaled = usesUnitScale.value ? raw * 100 : raw;
  return Math.max(0, Math.min(100, Math.round(scaled)));
}

function highestConfidenceCandidate(candidates: MatchCandidate[]): MatchCandidate | undefined {
  if (candidates.length === 0) return undefined;
  let best = candidates[0]!;
  for (let i = 1; i < candidates.length; i++) {
    const candidate = candidates[i]!;
    if (candidate.confidence > best.confidence) {
      best = candidate;
    }
  }
  return best;
}

watch(
  () => props.items,
  (items) => {
    const nextSelected: Record<string, string> = {};
    const nextRules: Record<string, boolean> = {};
    for (const item of items) {
      const existingId = selectedByItem.value[item.id];
      const stillValid = existingId && item.candidates.some((c) => c.id === existingId);
      if (stillValid) {
        nextSelected[item.id] = existingId;
      } else {
        const best = highestConfidenceCandidate(item.candidates);
        if (best) {
          nextSelected[item.id] = best.id;
        }
      }
      nextRules[item.id] = createRuleByItem.value[item.id] ?? false;
    }
    selectedByItem.value = nextSelected;
    createRuleByItem.value = nextRules;
  },
  { immediate: true, deep: true },
);

function selectCandidate(itemId: string, candidateId: string) {
  selectedByItem.value = {
    ...selectedByItem.value,
    [itemId]: candidateId,
  };
}

function toggleRule(itemId: string, checked: boolean) {
  createRuleByItem.value = {
    ...createRuleByItem.value,
    [itemId]: checked,
  };
}

function selectedCandidateFor(item: UnmatchedRecordItem): MatchCandidate | undefined {
  const id = selectedByItem.value[item.id];
  if (!id) return undefined;
  return item.candidates.find((c) => c.id === id);
}

function confidenceTier(raw: number): "high" | "medium" | "low" {
  const pct = toConfidencePct(raw);
  if (pct >= 90) return "high";
  if (pct >= 70) return "medium";
  return "low";
}

const highConfidenceBatch = computed(() => {
  const batch: Array<{ itemId: string; candidateId: string; createRule: boolean }> = [];
  for (const item of props.items) {
    const selected = selectedCandidateFor(item);
    if (selected && toConfidencePct(selected.confidence) >= 90) {
      batch.push({
        itemId: item.id,
        candidateId: selected.id,
        createRule: props.allowRuleCreation ? Boolean(createRuleByItem.value[item.id]) : false,
      });
    }
  }
  return batch;
});

function confirmSingle(item: UnmatchedRecordItem) {
  const selected = selectedCandidateFor(item);
  if (!selected) return;
  emit("resolve", {
    itemId: item.id,
    candidateId: selected.id,
    createRule: props.allowRuleCreation ? Boolean(createRuleByItem.value[item.id]) : false,
  });
}

function confirmAllHighConfidence() {
  if (highConfidenceBatch.value.length === 0) return;
  emit("resolveBatch", highConfidenceBatch.value);
}

function radioGroupName(itemId: string): string {
  return `tux-matcher-${instanceId}-${itemId}`;
}
</script>

<template>
  <div class="tux-record-matcher">
    <div class="tux-record-matcher__toolbar">
      <div class="tux-record-matcher__summary">
        <span class="tux-record-matcher__count">
          {{ items.length }} {{ items.length === 1 ? "unlinked record" : "unlinked records" }}
        </span>
        <span class="tux-record-matcher__high-meta">
          · {{ highConfidenceBatch.length }} high-confidence (&ge;90%)
        </span>
      </div>

      <button
        type="button"
        class="tux-record-matcher__btn tux-record-matcher__btn--batch"
        :disabled="highConfidenceBatch.length === 0"
        @click="confirmAllHighConfidence"
      >
        <span>Confirm All High-Confidence (&ge;90%)</span>
        <span class="tux-record-matcher__batch-pill">{{ highConfidenceBatch.length }}</span>
      </button>
    </div>

    <div v-if="items.length === 0" class="tux-record-matcher__empty" role="status">
      All unlinked records have been reconciled.
    </div>

    <ul v-else class="tux-record-matcher__list">
      <li
        v-for="item in items"
        :key="item.id"
        class="tux-record-matcher__card"
      >
        <div class="tux-record-matcher__grid">
          <div class="tux-record-matcher__source">
            <div class="tux-record-matcher__source-eyebrow">Unlinked Record</div>
            <div class="tux-record-matcher__source-header">
              <span v-if="item.sourceCode" class="tux-record-matcher__code">
                {{ item.sourceCode }}
              </span>
              <h3 class="tux-record-matcher__source-title">{{ item.sourceTitle }}</h3>
            </div>
            <p v-if="item.sourceMeta" class="tux-record-matcher__source-meta">
              {{ item.sourceMeta }}
            </p>
            <div v-if="item.amountLabel" class="tux-record-matcher__amount">
              {{ item.amountLabel }}
            </div>
          </div>

          <div class="tux-record-matcher__connector" aria-hidden="true">
            <span class="tux-record-matcher__arrow">&rarr;</span>
          </div>

          <div class="tux-record-matcher__target">
            <fieldset v-if="item.candidates.length > 0" class="tux-record-matcher__fieldset">
              <legend class="tux-record-matcher__legend">
                Candidate matches for {{ item.sourceTitle }}
              </legend>

              <div class="tux-record-matcher__candidates">
                <label
                  v-for="candidate in item.candidates"
                  :key="candidate.id"
                  class="tux-record-matcher__candidate"
                  :class="{
                    'tux-record-matcher__candidate--selected': selectedByItem[item.id] === candidate.id,
                  }"
                >
                  <input
                    type="radio"
                    class="tux-record-matcher__radio"
                    :name="radioGroupName(item.id)"
                    :value="candidate.id"
                    :checked="selectedByItem[item.id] === candidate.id"
                    @change="selectCandidate(item.id, candidate.id)"
                  >
                  <span class="tux-record-matcher__candidate-body">
                    <span class="tux-record-matcher__candidate-top">
                      <span
                        v-if="candidate.code"
                        class="tux-record-matcher__code"
                      >
                        {{ candidate.code }}
                      </span>
                      <span class="tux-record-matcher__candidate-label">
                        {{ candidate.label }}
                      </span>
                    </span>
                    <span v-if="candidate.meta" class="tux-record-matcher__candidate-meta">
                      {{ candidate.meta }}
                    </span>
                  </span>
                  <span
                    class="tux-record-matcher__confidence"
                    :class="`tux-record-matcher__confidence--${confidenceTier(candidate.confidence)}`"
                  >
                    {{ toConfidencePct(candidate.confidence) }}%
                  </span>
                </label>
              </div>
            </fieldset>

            <div v-else class="tux-record-matcher__no-candidates">
              No candidate matches available for this record.
            </div>

            <div class="tux-record-matcher__footer">
              <label
                v-if="allowRuleCreation"
                class="tux-record-matcher__rule-toggle"
              >
                <input
                  type="checkbox"
                  class="tux-record-matcher__checkbox"
                  :checked="Boolean(createRuleByItem[item.id])"
                  @change="toggleRule(item.id, ($event.target as HTMLInputElement).checked)"
                >
                <span>{{ ruleCheckboxLabel }}</span>
              </label>
              <div v-else class="tux-record-matcher__spacer" />

              <div class="tux-record-matcher__actions">
                <button
                  type="button"
                  class="tux-record-matcher__btn tux-record-matcher__btn--secondary"
                  @click="emit('dismiss', item.id)"
                >
                  {{ dismissLabel }}
                </button>
                <button
                  type="button"
                  class="tux-record-matcher__btn tux-record-matcher__btn--primary"
                  :disabled="!selectedCandidateFor(item)"
                  @click="confirmSingle(item)"
                >
                  {{ acceptLabel }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tux-record-matcher {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  font-family: var(--font-body);
  color: var(--text-primary);
  line-height: 1.5;
}

.tux-record-matcher__toolbar {
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

.tux-record-matcher__summary {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-8);
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
}

.tux-record-matcher__count {
  font-weight: 700;
  color: var(--text-primary);
}

.tux-record-matcher__high-meta {
  color: var(--text-secondary);
}

.tux-record-matcher__empty {
  padding: var(--space-24);
  text-align: center;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.9375rem;
}

.tux-record-matcher__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.tux-record-matcher__card {
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: var(--space-16);
  box-shadow: var(--shadow-sm);
}

.tux-record-matcher__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1.45fr);
  gap: var(--space-16);
  align-items: start;
}

.tux-record-matcher__source {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding: var(--space-12);
  background: var(--surface-eggshell);
  border: 1px solid var(--surface-border-subtle);
  border-radius: var(--radius-md);
}

.tux-record-matcher__source-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-muted);
}

.tux-record-matcher__source-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.tux-record-matcher__source-title {
  margin: 0;
  font-family: var(--font-bold);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.4;
}

.tux-record-matcher__source-meta {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.tux-record-matcher__amount {
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
  padding-top: var(--space-4);
  border-top: 1px solid var(--surface-border-subtle);
}

.tux-record-matcher__connector {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: var(--space-24);
  color: var(--text-muted);
  font-weight: 700;
  font-size: 1.25rem;
}

.tux-record-matcher__target {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  min-width: 0;
}

.tux-record-matcher__fieldset {
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
}

.tux-record-matcher__legend {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-muted);
  margin-bottom: var(--space-8);
}

.tux-record-matcher__candidates {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.tux-record-matcher__candidate {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-12);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.tux-record-matcher__candidate:hover {
  border-color: var(--brand-primary);
  background: var(--wash-brand-4);
}

.tux-record-matcher__candidate--selected {
  border-color: var(--brand-primary);
  background: var(--wash-brand-8);
  box-shadow: inset 3px 0 0 var(--brand-primary);
}

.tux-record-matcher__candidate:has(.tux-record-matcher__radio:focus-visible) {
  box-shadow: var(--shadow-focus);
}

.tux-record-matcher__radio {
  width: 1.125rem;
  height: 1.125rem;
  accent-color: var(--brand-primary);
  flex-shrink: 0;
  cursor: pointer;
}

.tux-record-matcher__radio:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-record-matcher__candidate-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tux-record-matcher__candidate-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.tux-record-matcher__code {
  display: inline-block;
  padding: 2px var(--space-8);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
}

.tux-record-matcher__candidate-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.tux-record-matcher__candidate-meta {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.tux-record-matcher__confidence {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px var(--space-8);
  border-radius: var(--radius-full);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  border: 1px solid var(--surface-border);
}

.tux-record-matcher__confidence--high {
  background: var(--status-ok-fill);
  color: var(--status-ok-ink);
  border-color: var(--status-ok);
}

.tux-record-matcher__confidence--medium {
  background: var(--status-warning-fill);
  color: var(--status-warning-ink);
  border-color: var(--status-warning);
}

.tux-record-matcher__confidence--low {
  background: var(--surface-sunken);
  color: var(--text-secondary);
  border-color: var(--surface-border);
}

.tux-record-matcher__no-candidates {
  padding: var(--space-12);
  background: var(--surface-sunken);
  border: 1px dashed var(--surface-border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.tux-record-matcher__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  padding-top: var(--space-8);
  border-top: 1px solid var(--surface-border-subtle);
}

.tux-record-matcher__rule-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  min-height: 44px;
  min-width: 44px;
  padding: 0 var(--space-4);
  font-size: 0.8125rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.tux-record-matcher__checkbox {
  width: 1.125rem;
  height: 1.125rem;
  accent-color: var(--brand-primary);
  cursor: pointer;
  flex-shrink: 0;
}

.tux-record-matcher__checkbox:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-record-matcher__spacer {
  flex: 1;
}

.tux-record-matcher__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.tux-record-matcher__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
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

.tux-record-matcher__btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-record-matcher__btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.tux-record-matcher__btn--primary,
.tux-record-matcher__btn--batch {
  background: var(--brand-fill);
  color: var(--text-on-brand);
  border-color: var(--brand-fill);
}

.tux-record-matcher__btn--primary:hover:not(:disabled),
.tux-record-matcher__btn--batch:hover:not(:disabled) {
  background: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
}

.tux-record-matcher__btn--secondary {
  background: var(--surface-raised);
  color: var(--text-primary);
  border-color: var(--surface-border);
}

.tux-record-matcher__btn--secondary:hover:not(:disabled) {
  border-color: var(--brand-primary);
  background: var(--wash-brand-4);
}

.tux-record-matcher__batch-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  padding: 1px var(--space-8);
  border-radius: var(--radius-full);
  background: var(--brand-accent);
  color: var(--brand-accent-ink);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

@container (max-width: 46rem) {
  .tux-record-matcher__grid {
    grid-template-columns: 1fr;
  }

  .tux-record-matcher__connector {
    padding-top: 0;
    transform: rotate(90deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tux-record-matcher__candidate,
  .tux-record-matcher__btn {
    transition: none;
  }
}
</style>
