<script setup lang="ts">
/**
 * TuxFeedback — Institutional documentation feedback block.
 *
 * Adapted from emberloom-docs for TUX.
 * Captures 1-click reader sentiment (helpful / needs improvement), categorized
 * triage reasons (outdated, inaccurate, missing steps, etc.), and optional editorial notes.
 */
import { FEEDBACK_REASONS, type FeedbackReason } from "../utils/desk/governance";

export interface FeedbackPayload {
  pageId: string;
  vote: "up" | "down";
  reason?: FeedbackReason | string;
  note?: string;
  sessionId: string;
  timestamp: string;
}

interface Props {
  pageId?: string;
  title?: string;
  endpoint?: string;
  allowDetails?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  pageId: "",
  title: "Was this page helpful?",
  endpoint: "/api/feedback",
  allowDetails: true,
});

const emit = defineEmits<{
  (e: "submit", payload: FeedbackPayload): void;
}>();

const route = useRoute();
const effectivePageId = computed(() => props.pageId || route.path || "general");

// Stable per-session ID
const sessionId = ref("");
onMounted(() => {
  try {
    let sid = sessionStorage.getItem("tux_feedback_session");
    if (!sid) {
      sid = "tux-" + Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem("tux_feedback_session", sid);
    }
    sessionId.value = sid;
  } catch {
    sessionId.value = "tux-anonymous";
  }
});

const vote = ref<"up" | "down" | "">("");
const reason = ref<FeedbackReason | "">("");
const note = ref("");
const pending = ref(false);
const submitted = ref(false);
const statusMessage = ref("");

async function recordFeedback(v: "up" | "down", explicitSubmit = false) {
  vote.value = v;

  if (v === "down" && props.allowDetails && !explicitSubmit) {
    // Reveal details form first
    return;
  }

  pending.value = true;
  const payload: FeedbackPayload = {
    pageId: effectivePageId.value,
    vote: v,
    reason: v === "down" ? (reason.value || undefined) : undefined,
    note: note.value.trim() || undefined,
    sessionId: sessionId.value,
    timestamp: new Date().toISOString(),
  };

  submitted.value = true;
  statusMessage.value = v === "up"
    ? "Thank you! Your feedback helps us keep TUX documentation high quality."
    : "Thank you for letting us know. Your notes have been flagged for editorial review.";
  emit("submit", payload);

  if (props.endpoint) {
    try {
      await $fetch(props.endpoint, {
        method: "POST",
        body: payload,
      }).catch(() => {
        // Degrades gracefully for static hosting or dev without endpoint
      });
    } catch {
      // Ignored
    } finally {
      pending.value = false;
    }
  } else {
    pending.value = false;
  }
}

function onSendDetails() {
  recordFeedback("down", true);
}
</script>

<template>
  <section
    class="tux-feedback"
    role="region"
    aria-label="Documentation feedback"
    data-testid="tux-feedback"
  >
    <div v-if="!submitted" class="tux-feedback__content">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p class="tux-feedback__title">{{ title }}</p>

        <div class="tux-feedback__actions">
          <button
            type="button"
            class="tux-feedback__vote-btn"
            :class="{ 'tux-feedback__vote-btn--active': vote === 'up' }"
            :aria-pressed="vote === 'up'"
            :disabled="pending"
            @click="recordFeedback('up')"
          >
            <UIcon name="lucide:thumbs-up" class="w-4 h-4" aria-hidden="true" />
            <span>Yes</span>
          </button>

          <button
            type="button"
            class="tux-feedback__vote-btn"
            :class="{ 'tux-feedback__vote-btn--active': vote === 'down' }"
            :aria-pressed="vote === 'down'"
            :disabled="pending"
            @click="recordFeedback('down')"
          >
            <UIcon name="lucide:thumbs-down" class="w-4 h-4" aria-hidden="true" />
            <span>No</span>
          </button>
        </div>
      </div>

      <!-- Downvote detail expansion -->
      <div
        v-if="vote === 'down' && allowDetails"
        class="tux-feedback__details"
        data-testid="tux-feedback-details"
      >
        <p class="tux-feedback__details-prompt">
          How can we make this page better?
        </p>

        <div class="space-y-3">
          <div>
            <label for="tux-feedback-reason" class="block text-xs font-semibold text-text-muted mb-1">
              Issue category
            </label>
            <select
              id="tux-feedback-reason"
              v-model="reason"
              class="tux-feedback__select"
            >
              <option value="">Select a reason (optional)</option>
              <option
                v-for="item in FEEDBACK_REASONS"
                :key="item.id"
                :value="item.id"
              >
                {{ item.label }} — {{ item.description }}
              </option>
            </select>
          </div>

          <div>
            <label for="tux-feedback-note" class="block text-xs font-semibold text-text-muted mb-1">
              Additional context (optional)
            </label>
            <textarea
              id="tux-feedback-note"
              v-model="note"
              rows="3"
              placeholder="What specifically was missing or confusing?"
              class="tux-feedback__textarea"
            />
          </div>

          <div class="flex justify-end gap-2 pt-1">
            <button
              type="button"
              class="tux-feedback__submit-btn"
              :disabled="pending"
              @click="onSendDetails"
            >
              <UIcon v-if="pending" name="lucide:loader-2" class="w-3.5 h-3.5 animate-spin" />
              <span>Submit feedback</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success state -->
    <div
      v-else
      class="tux-feedback__success"
      role="status"
      aria-live="polite"
      data-testid="tux-feedback-success"
    >
      <UIcon name="lucide:check-circle-2" class="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
      <p class="text-sm font-medium text-text-primary m-0">
        {{ statusMessage }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.tux-feedback {
  margin-top: 2.5rem;
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
}

.tux-feedback__title {
  margin: 0;
  font-family: var(--font-bold);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-feedback__actions {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.tux-feedback__vote-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--motion-fast) var(--ease-standard);
}

.tux-feedback__vote-btn:hover {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
  transform: translateY(-1px);
}

.tux-feedback__vote-btn--active {
  background: color-mix(in srgb, var(--brand-primary) 12%, transparent);
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}

.tux-feedback__details {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
}

.tux-feedback__details-prompt {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.75rem;
}

.tux-feedback__select,
.tux-feedback__textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-raised);
  color: var(--text-primary);
  outline: none;
  transition: border-color var(--motion-fast) var(--ease-standard);
}

.tux-feedback__select option {
  background: var(--surface-raised);
  color: var(--text-primary);
}

.tux-feedback__select:focus,
.tux-feedback__textarea:focus {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 1px var(--brand-primary);
}

.tux-feedback__submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  background: var(--brand-primary);
  color: var(--text-on-brand, #ffffff);
  border: 1px solid transparent;
  cursor: pointer;
  transition: opacity var(--motion-fast) var(--ease-standard);
}

.tux-feedback__submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.tux-feedback__submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.tux-feedback__success {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}
</style>
