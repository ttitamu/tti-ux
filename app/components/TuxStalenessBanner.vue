<script setup lang="ts">
/**
 * TuxStalenessBanner — Editorial verification and cadence alert banner.
 *
 * Designed for research documentation, compliance runbooks, and enterprise knowledge.
 * Automatically checks whether a page's verification window has expired based on
 * `verifiedUntil` or `lastVerified` + `reviewCadenceDays`.
 */
import {
  isVerificationStale,
  calculateEffectiveVerifiedUntil,
  daysOverdue,
} from "../utils/desk/governance";

interface Props {
  stale?: boolean;
  verifiedUntil?: Date | string | null;
  lastVerified?: Date | string | null;
  reviewCadenceDays?: number;
  owner?: string;
  pageId?: string;
  dismissable?: boolean;
  showVerifiedBadge?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  stale: undefined,
  verifiedUntil: undefined,
  lastVerified: undefined,
  reviewCadenceDays: 90,
  owner: undefined,
  pageId: undefined,
  dismissable: true,
  showVerifiedBadge: false,
});

const emit = defineEmits<{
  (e: "request-review", payload: { pageId?: string; owner?: string; expiredAt?: Date | null }): void;
  (e: "dismiss"): void;
}>();

const dismissed = ref(false);
const requested = ref(false);

const effectiveExpiry = computed(() => {
  return calculateEffectiveVerifiedUntil({
    verifiedUntil: props.verifiedUntil,
    lastVerified: props.lastVerified,
    reviewCadenceDays: props.reviewCadenceDays,
  });
});

const isStale = computed(() => {
  if (typeof props.stale === "boolean") return props.stale;
  return isVerificationStale({
    verifiedUntil: props.verifiedUntil,
    lastVerified: props.lastVerified,
    reviewCadenceDays: props.reviewCadenceDays,
  });
});

const days = computed(() => {
  return daysOverdue(effectiveExpiry.value);
});

const formattedExpiryDate = computed(() => {
  if (!effectiveExpiry.value) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(effectiveExpiry.value);
});

function onRequestReview() {
  requested.value = true;
  emit("request-review", {
    pageId: props.pageId,
    owner: props.owner,
    expiredAt: effectiveExpiry.value,
  });
}

function dismiss() {
  dismissed.value = true;
  emit("dismiss");
}
</script>

<template>
  <div v-if="!dismissed && (isStale || showVerifiedBadge)" class="tux-staleness-wrapper">
    <div
      v-if="isStale"
      class="tux-staleness-banner"
      role="alert"
      aria-label="Documentation verification expired"
      data-testid="tux-staleness-banner"
    >
      <div class="tux-staleness-banner__inner">
        <div class="tux-staleness-banner__icon-wrap" aria-hidden="true">
          <UIcon name="lucide:clock-alert" class="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>

        <div class="tux-staleness-banner__body">
          <div class="flex items-center gap-2 flex-wrap">
            <h4 class="tux-staleness-banner__title">
              Verification window expired
            </h4>
            <span v-if="days > 0" class="tux-staleness-banner__badge">
              {{ days }} {{ days === 1 ? 'day' : 'days' }} overdue
            </span>
          </div>

          <p class="tux-staleness-banner__desc">
            This document's verification window expired
            <span v-if="formattedExpiryDate"> on <strong>{{ formattedExpiryDate }}</strong></span>.
            Instructions, code examples, or architectural guidance may no longer reflect current TTI standards.
            <span v-if="owner"> Maintained by <strong>{{ owner }}</strong>.</span>
          </p>
        </div>

        <div class="tux-staleness-banner__actions">
          <button
            v-if="!requested"
            type="button"
            class="tux-staleness-banner__btn"
            @click="onRequestReview"
          >
            <UIcon name="lucide:flag" class="w-3.5 h-3.5" aria-hidden="true" />
            <span>Request review</span>
          </button>
          <span v-else class="tux-staleness-banner__confirmed">
            <UIcon name="lucide:check" class="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            Review flagged
          </span>

          <button
            v-if="dismissable"
            type="button"
            class="tux-staleness-banner__dismiss"
            aria-label="Dismiss staleness alert"
            @click="dismiss"
          >
            <UIcon name="lucide:x" class="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <div
      v-else-if="showVerifiedBadge && effectiveExpiry"
      class="tux-staleness-verified"
      data-testid="tux-staleness-verified"
    >
      <UIcon name="lucide:shield-check" class="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
      <span class="text-xs text-text-muted">
        Verified documentation
        <span v-if="formattedExpiryDate"> · Valid through {{ formattedExpiryDate }}</span>
        <span v-if="owner"> · {{ owner }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.tux-staleness-wrapper {
  width: 100%;
  margin-bottom: 1.5rem;
}

.tux-staleness-banner {
  border: 1px solid color-mix(in srgb, var(--brand-accent) 35%, transparent);
  border-left: 4px solid var(--brand-accent);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--brand-accent) 8%, var(--surface-raised));
  padding: 0.875rem 1rem;
}

.tux-staleness-banner__inner {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
}

.tux-staleness-banner__icon-wrap {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.tux-staleness-banner__body {
  flex: 1;
  min-width: 0;
}

.tux-staleness-banner__title {
  margin: 0;
  font-family: var(--font-bold);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
}

.tux-staleness-banner__badge {
  font-family: var(--font-mono, monospace);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--brand-accent) 22%, transparent);
  color: var(--brand-accent-deep, #92400e);
}

.tux-staleness-banner__desc {
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--text-muted);
}

.tux-staleness-banner__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  margin-left: 0.5rem;
}

.tux-staleness-banner__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--motion-fast) var(--ease-standard);
  white-space: nowrap;
}

.tux-staleness-banner__btn:hover {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}

.tux-staleness-banner__confirmed {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-success, #16a34a);
}

.tux-staleness-banner__dismiss {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--radius-sm);
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  opacity: 0.7;
  transition: opacity var(--motion-fast) var(--ease-standard);
}

.tux-staleness-banner__dismiss:hover {
  opacity: 1;
  color: var(--text-primary);
}

.tux-staleness-verified {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: color-mix(in srgb, var(--color-success, #10b981) 8%, var(--surface-raised));
  border: 1px solid color-mix(in srgb, var(--color-success, #10b981) 22%, transparent);
  border-radius: var(--radius-sm);
}
</style>
