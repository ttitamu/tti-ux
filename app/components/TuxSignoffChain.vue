<script setup lang="ts">
/**
 * TuxSignoffChain — sequential multi-actor verification, attestation & continuation gate.
 *
 * Renders an ordered chain of verification stages with multi-channel status
 * indicators, actor credentials, tabular timestamps, and audit notes. When an
 * active stage is awaiting action, surfaces an accessible continuation gate with
 * optional decision radio options, mandatory attestation checkbox gating,
 * verification commentary, and Approve / Return actions.
 */
import { computed, ref, useId, watch } from "vue";

export interface SignoffStage {
  id: string;
  label: string;
  actorName: string;
  actorRole?: string;
  status: "approved" | "pending" | "rejected" | "skipped";
  timestamp?: string;
  note?: string;
}

export interface SignoffDecisionOption {
  value: string;
  label: string;
  description?: string;
}

interface Props {
  stages: SignoffStage[];
  activeStageId?: string;
  attestationText?: string;
  decisionOptions?: SignoffDecisionOption[];
  decisionLabel?: string;
  modelValue?: string;
  showActions?: boolean;
  approveLabel?: string;
  rejectLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  activeStageId: undefined,
  attestationText: undefined,
  decisionOptions: undefined,
  decisionLabel: "Continuation Decision",
  modelValue: undefined,
  showActions: true,
  approveLabel: "Approve & Sign Off",
  rejectLabel: "Return for Revision",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  approve: [
    payload: {
      stageId: string;
      attested: boolean;
      decision?: string;
      comment: string;
    },
  ];
  reject: [
    payload: {
      stageId: string;
      comment: string;
    },
  ];
}>();

const uid = useId();
const attestInputId = `tux-signoff-attest-${uid}`;
const commentInputId = `tux-signoff-comment-${uid}`;
const radioGroupName = `tux-signoff-decision-${uid}`;

const resolvedActiveId = computed<string | undefined>(() => {
  if (props.activeStageId !== undefined) {
    return props.activeStageId;
  }
  if (!props.showActions) {
    return undefined;
  }
  return props.stages.find((stage) => stage.status === "pending")?.id;
});

const activeStage = computed<SignoffStage | undefined>(() => {
  if (!resolvedActiveId.value) return undefined;
  return props.stages.find((stage) => stage.id === resolvedActiveId.value);
});

const attested = ref(false);
const comment = ref("");
const localDecision = ref<string | undefined>(
  props.modelValue ?? props.decisionOptions?.[0]?.value,
);

watch(
  () => props.modelValue,
  (nextVal) => {
    if (nextVal !== undefined) {
      localDecision.value = nextVal;
    }
  },
);

watch(resolvedActiveId, () => {
  attested.value = false;
  comment.value = "";
});

const canApprove = computed<boolean>(() => {
  if (props.attestationText) {
    return attested.value;
  }
  return true;
});

function statusText(status: SignoffStage["status"]): string {
  switch (status) {
    case "approved":
      return "Approved";
    case "pending":
      return "Pending";
    case "rejected":
      return "Rejected";
    case "skipped":
      return "Skipped";
  }
}

function formatStepNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

function onSelectDecision(value: string) {
  localDecision.value = value;
  emit("update:modelValue", value);
}

function handleApprove() {
  if (!activeStage.value || !canApprove.value) return;
  const payload: {
    stageId: string;
    attested: boolean;
    decision?: string;
    comment: string;
  } = {
    stageId: activeStage.value.id,
    attested: props.attestationText ? attested.value : false,
    comment: comment.value.trim(),
  };
  const chosen = props.modelValue ?? localDecision.value;
  if (chosen !== undefined) {
    payload.decision = chosen;
  }
  emit("approve", payload);
}

function handleReject() {
  if (!activeStage.value) return;
  emit("reject", {
    stageId: activeStage.value.id,
    comment: comment.value.trim(),
  });
}
</script>

<template>
  <div class="tux-signoff-chain">
    <ol class="tux-signoff-chain__list">
      <li
        v-for="(stage, idx) in stages"
        :key="stage.id"
        class="tux-signoff-chain__stage"
        :class="[
          `tux-signoff-chain__stage--${stage.status}`,
          resolvedActiveId === stage.id && 'tux-signoff-chain__stage--active',
        ]"
        :aria-current="resolvedActiveId === stage.id ? 'step' : undefined"
      >
        <div class="tux-signoff-chain__rail" aria-hidden="true">
          <span class="tux-signoff-chain__indicator">
            <svg
              v-if="stage.status === 'approved'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="tux-signoff-chain__icon"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <svg
              v-else-if="stage.status === 'rejected'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="tux-signoff-chain__icon"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <svg
              v-else-if="stage.status === 'skipped'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="tux-signoff-chain__icon"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <svg
              v-else
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.25"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="tux-signoff-chain__icon"
            >
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 14" />
            </svg>
          </span>
        </div>

        <div class="tux-signoff-chain__card">
          <div class="tux-signoff-chain__header">
            <div class="tux-signoff-chain__title-row">
              <span class="tux-signoff-chain__step-num">{{ formatStepNumber(idx) }}</span>
              <span class="tux-signoff-chain__label">{{ stage.label }}</span>
            </div>

            <span
              class="tux-signoff-chain__status-pill"
              :class="`tux-signoff-chain__status-pill--${stage.status}`"
            >
              {{ statusText(stage.status) }}
            </span>
          </div>

          <div class="tux-signoff-chain__meta">
            <span class="tux-signoff-chain__actor">{{ stage.actorName }}</span>
            <span v-if="stage.actorRole" class="tux-signoff-chain__role">
              {{ stage.actorRole }}
            </span>
            <time
              v-if="stage.timestamp"
              :datetime="stage.timestamp"
              class="tux-signoff-chain__timestamp"
            >
              {{ stage.timestamp }}
            </time>
          </div>

          <p v-if="stage.note" class="tux-signoff-chain__note">
            {{ stage.note }}
          </p>
        </div>
      </li>
    </ol>

    <div
      v-if="showActions && activeStage"
      class="tux-signoff-chain__gate"
      role="group"
      :aria-label="`Verification gate for ${activeStage.label}`"
    >
      <div class="tux-signoff-chain__gate-header">
        <span class="tux-signoff-chain__gate-eyebrow">Active Sign-Off Gate</span>
        <p class="tux-signoff-chain__gate-title">
          {{ activeStage.label }} · {{ activeStage.actorName }}
        </p>
      </div>

      <fieldset
        v-if="decisionOptions && decisionOptions.length > 0"
        class="tux-signoff-chain__decisions"
      >
        <legend class="tux-signoff-chain__legend">{{ decisionLabel }}</legend>
        <div class="tux-signoff-chain__decision-list">
          <label
            v-for="option in decisionOptions"
            :key="option.value"
            class="tux-signoff-chain__decision-option min-h-11"
            :class="
              (modelValue ?? localDecision) === option.value &&
                'tux-signoff-chain__decision-option--selected'
            "
          >
            <input
              type="radio"
              class="tux-signoff-chain__radio"
              :name="radioGroupName"
              :value="option.value"
              :checked="(modelValue ?? localDecision) === option.value"
              @change="onSelectDecision(option.value)"
            >
            <span class="tux-signoff-chain__decision-body">
              <span class="tux-signoff-chain__decision-label">{{ option.label }}</span>
              <span v-if="option.description" class="tux-signoff-chain__decision-desc">
                {{ option.description }}
              </span>
            </span>
          </label>
        </div>
      </fieldset>

      <label
        v-if="attestationText"
        :for="attestInputId"
        class="tux-signoff-chain__attest min-h-11"
      >
        <input
          :id="attestInputId"
          v-model="attested"
          type="checkbox"
          class="tux-signoff-chain__checkbox"
        >
        <span class="tux-signoff-chain__attest-text">{{ attestationText }}</span>
      </label>

      <div class="tux-signoff-chain__comment-field">
        <label :for="commentInputId" class="tux-signoff-chain__comment-label">
          Verification Comment (Optional)
        </label>
        <textarea
          :id="commentInputId"
          v-model="comment"
          rows="2"
          class="tux-signoff-chain__textarea min-h-11"
          placeholder="Record calibration reference, review findings, or revision notes..."
        />
      </div>

      <div class="tux-signoff-chain__actions">
        <button
          type="button"
          class="tux-signoff-chain__btn tux-signoff-chain__btn--reject min-h-11"
          @click="handleReject"
        >
          {{ rejectLabel }}
        </button>
        <button
          type="button"
          class="tux-signoff-chain__btn tux-signoff-chain__btn--approve min-h-11"
          :disabled="!canApprove"
          @click="handleApprove"
        >
          {{ approveLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tux-signoff-chain {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  font-family: var(--font-body);
  color: var(--text-primary);
}

.tux-signoff-chain__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.tux-signoff-chain__stage {
  position: relative;
  display: flex;
  gap: var(--space-12);
  padding-bottom: var(--space-12);
}

.tux-signoff-chain__stage:last-child {
  padding-bottom: 0;
}

.tux-signoff-chain__rail {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 2rem;
}

.tux-signoff-chain__stage:not(:last-child) .tux-signoff-chain__rail::after {
  content: "";
  position: absolute;
  top: 2rem;
  bottom: calc(-1 * var(--space-12));
  width: 2px;
  background: var(--surface-border);
}

.tux-signoff-chain__stage--approved:not(:last-child) .tux-signoff-chain__rail::after {
  background: var(--status-ok);
}

.tux-signoff-chain__indicator {
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--surface-border);
  background: var(--surface-raised);
  color: var(--text-secondary);
  z-index: 1;
}

.tux-signoff-chain__stage--approved .tux-signoff-chain__indicator {
  border-color: var(--status-ok);
  background: var(--status-ok-fill);
  color: var(--status-ok-ink);
}

.tux-signoff-chain__stage--rejected .tux-signoff-chain__indicator {
  border-color: var(--status-critical);
  background: var(--surface-raised);
  color: var(--status-critical);
}

.tux-signoff-chain__stage--pending .tux-signoff-chain__indicator {
  border-color: var(--brand-primary);
  background: var(--surface-raised);
  color: var(--brand-primary);
}

.tux-signoff-chain__stage--skipped .tux-signoff-chain__indicator {
  border-color: var(--surface-border);
  background: var(--surface-sunken);
  color: var(--text-muted);
}

.tux-signoff-chain__stage--active .tux-signoff-chain__indicator {
  box-shadow:
    0 0 0 2px var(--surface-page),
    0 0 0 4px var(--brand-primary);
}

.tux-signoff-chain__icon {
  width: 1rem;
  height: 1rem;
}

.tux-signoff-chain__card {
  flex: 1;
  min-width: 0;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: var(--space-12) var(--space-16);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.tux-signoff-chain__stage--active .tux-signoff-chain__card {
  border-color: var(--brand-primary);
  border-left-width: 4px;
  background: var(--wash-brand-4);
}

.tux-signoff-chain__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.tux-signoff-chain__title-row {
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-8);
  min-width: 0;
}

.tux-signoff-chain__step-num {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
}

.tux-signoff-chain__label {
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.5;
  color: var(--text-primary);
}

.tux-signoff-chain__status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  border: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  color: var(--text-primary);
}

.tux-signoff-chain__status-pill--approved {
  border-color: var(--status-ok);
  background: var(--status-ok-fill);
  color: var(--status-ok-ink);
}

.tux-signoff-chain__status-pill--pending {
  border-color: var(--status-warning);
  background: var(--status-warning-fill);
  color: var(--status-warning-ink);
}

.tux-signoff-chain__status-pill--rejected {
  border-color: var(--status-critical);
  background: var(--surface-raised);
  color: var(--text-primary);
}

.tux-signoff-chain__status-pill--skipped {
  border-color: var(--status-pending);
  background: var(--status-pending-fill);
  color: var(--status-pending-ink);
}

.tux-signoff-chain__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-8);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.tux-signoff-chain__actor {
  font-weight: 600;
  color: var(--text-primary);
}

.tux-signoff-chain__role {
  color: var(--text-secondary);
}

.tux-signoff-chain__role::before {
  content: "· ";
}

.tux-signoff-chain__timestamp {
  margin-left: auto;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.tux-signoff-chain__note {
  margin: var(--space-4) 0 0 0;
  padding: var(--space-8) var(--space-12);
  background: var(--surface-sunken);
  border-left: 3px solid var(--surface-border);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-secondary);
  max-width: 75ch;
}

.tux-signoff-chain__gate {
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-top: 3px solid var(--brand-primary);
  border-radius: var(--radius-md);
  padding: var(--space-16);
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.tux-signoff-chain__gate-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.tux-signoff-chain__gate-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-muted);
}

.tux-signoff-chain__gate-title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.5;
  color: var(--text-primary);
}

.tux-signoff-chain__decisions {
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: var(--space-12);
  margin: 0;
}

.tux-signoff-chain__legend {
  padding: 0 var(--space-8);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-signoff-chain__decision-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  margin-top: var(--space-4);
}

.tux-signoff-chain__decision-option {
  display: flex;
  align-items: flex-start;
  gap: var(--space-12);
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-12);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  background: var(--surface-page);
  cursor: pointer;
  transition: border-color var(--motion-fast) var(--ease-standard),
    background-color var(--motion-fast) var(--ease-standard);
}

.tux-signoff-chain__decision-option:hover {
  border-color: var(--brand-primary);
}

.tux-signoff-chain__decision-option--selected {
  border-color: var(--brand-primary);
  background: var(--wash-brand-4);
}

.tux-signoff-chain__decision-option:has(.tux-signoff-chain__radio:focus-visible) {
  box-shadow: var(--shadow-focus);
}

.tux-signoff-chain__radio {
  width: 1.125rem;
  height: 1.125rem;
  margin-top: 0.1875rem;
  flex-shrink: 0;
  accent-color: var(--brand-primary);
  cursor: pointer;
}

.tux-signoff-chain__radio:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-signoff-chain__decision-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tux-signoff-chain__decision-label {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.5;
  color: var(--text-primary);
}

.tux-signoff-chain__decision-desc {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.tux-signoff-chain__attest {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-12);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.tux-signoff-chain__attest:has(.tux-signoff-chain__checkbox:focus-visible) {
  box-shadow: var(--shadow-focus);
}

.tux-signoff-chain__checkbox {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
  accent-color: var(--brand-primary);
  cursor: pointer;
}

.tux-signoff-chain__checkbox:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-signoff-chain__attest-text {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.5;
  color: var(--text-primary);
}

.tux-signoff-chain__comment-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.tux-signoff-chain__comment-label {
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.5;
  color: var(--text-primary);
}

.tux-signoff-chain__textarea {
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-12);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  resize: vertical;
}

.tux-signoff-chain__textarea:focus-visible {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: var(--shadow-focus);
}

.tux-signoff-chain__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.tux-signoff-chain__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-16);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.5;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  cursor: pointer;
  transition: background-color var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard),
    opacity var(--motion-fast) var(--ease-standard);
}

.tux-signoff-chain__btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-signoff-chain__btn--reject {
  background: var(--surface-raised);
  color: var(--text-primary);
}

.tux-signoff-chain__btn--reject:hover {
  border-color: var(--status-critical);
  color: var(--status-critical);
}

.tux-signoff-chain__btn--approve {
  background: var(--brand-fill);
  border-color: var(--brand-fill);
  color: var(--text-on-brand);
}

.tux-signoff-chain__btn--approve:hover:not(:disabled) {
  background: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
}

.tux-signoff-chain__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@container (max-width: 32rem) {
  .tux-signoff-chain__timestamp {
    margin-left: 0;
    width: 100%;
  }
  .tux-signoff-chain__actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tux-signoff-chain__decision-option,
  .tux-signoff-chain__btn {
    transition: none;
  }
}
</style>
