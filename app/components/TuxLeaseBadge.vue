<script setup lang="ts">
/**
 * TuxLeaseBadge — time-to-live (TTL) countdown & expiration status pill
 * with optional inline lifecycle actions (Extend / Release).
 *
 * Automatically derives lifecycle state ("active" | "expiring" | "expired" | "indefinite")
 * from `remainingHours` and `warningHours`, renders multi-channel shape + semantic
 * status indicators, and provides 44×44px accessible action triggers.
 */
import { computed } from "vue";

export type LeaseBadgeState = "active" | "expiring" | "expired" | "indefinite";

interface Props {
  label?: string;
  remainingHours?: number;
  expiresLabel?: string;
  warningHours?: number;
  extendable?: boolean;
  releasable?: boolean;
  extendLabel?: string;
  releaseLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  remainingHours: undefined,
  expiresLabel: undefined,
  warningHours: 72,
  extendable: false,
  releasable: false,
  extendLabel: "Extend",
  releaseLabel: "Release",
});

const emit = defineEmits<{
  extend: [];
  release: [];
}>();

const state = computed<LeaseBadgeState>(() => {
  if (props.remainingHours === undefined) {
    return "indefinite";
  }
  if (props.remainingHours < 0) {
    return "expired";
  }
  if (props.remainingHours <= props.warningHours) {
    return "expiring";
  }
  return "active";
});

function formatDurationSpan(absHours: number): string {
  const rounded = Math.round(absHours);
  if (absHours > 0 && rounded === 0) {
    return "<1h";
  }
  const days = Math.floor(rounded / 24);
  const hours = rounded % 24;
  if (days > 0 && hours > 0) {
    return `${days}d ${hours}h`;
  }
  if (days > 0) {
    return `${days}d`;
  }
  return `${rounded}h`;
}

const countdownText = computed<string>(() => {
  if (props.remainingHours === undefined) {
    return "No expiration";
  }
  if (props.remainingHours < 0) {
    return `Expired ${formatDurationSpan(Math.abs(props.remainingHours))} ago`;
  }
  return `${formatDurationSpan(props.remainingHours)} left`;
});

const stateLabel = computed<string>(() => {
  if (state.value === "active") return "Active";
  if (state.value === "expiring") return "Expiring Soon";
  if (state.value === "expired") return "Expired";
  return "Indefinite";
});

const groupAriaLabel = computed<string>(() => {
  const prefix = props.label ? `${props.label}: ` : "Lease status: ";
  const suffix = props.expiresLabel ? ` (${props.expiresLabel})` : "";
  return `${prefix}${stateLabel.value}, ${countdownText.value}${suffix}`;
});
</script>

<template>
  <div
    class="tux-lease-badge"
    :class="`tux-lease-badge--${state}`"
    role="group"
    :aria-label="groupAriaLabel"
  >
    <div class="tux-lease-badge__pill">
      <span class="tux-lease-badge__glyph" aria-hidden="true">
        <svg
          v-if="state === 'active'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.25"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="tux-lease-badge__icon"
        >
          <circle cx="12" cy="12" r="9" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
        <svg
          v-else-if="state === 'expiring'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.25"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="tux-lease-badge__icon"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <svg
          v-else-if="state === 'expired'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.25"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="tux-lease-badge__icon"
        >
          <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.25"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="tux-lease-badge__icon"
        >
          <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
        </svg>
      </span>

      <span v-if="label" class="tux-lease-badge__label">{{ label }}</span>

      <span class="tux-lease-badge__countdown">{{ countdownText }}</span>

      <span v-if="expiresLabel" class="tux-lease-badge__expires">
        · {{ expiresLabel }}
      </span>
    </div>

    <div v-if="extendable || releasable" class="tux-lease-badge__actions">
      <button
        v-if="extendable"
        type="button"
        class="tux-lease-badge__btn tux-lease-badge__btn--extend min-h-11"
        :aria-label="label ? `${extendLabel} ${label}` : extendLabel"
        @click="emit('extend')"
      >
        {{ extendLabel }}
      </button>
      <button
        v-if="releasable"
        type="button"
        class="tux-lease-badge__btn tux-lease-badge__btn--release min-h-11"
        :aria-label="label ? `${releaseLabel} ${label}` : releaseLabel"
        @click="emit('release')"
      >
        {{ releaseLabel }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.tux-lease-badge {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  max-width: 100%;
  gap: var(--space-8);
  font-family: var(--font-body);
  color: var(--text-primary);
}

.tux-lease-badge__pill {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-8);
  min-height: 2.25rem;
  padding: var(--space-4) var(--space-12);
  border-radius: var(--radius-full);
  border: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  color: var(--text-primary);
  line-height: 1.5;
}

.tux-lease-badge--active .tux-lease-badge__pill {
  border-color: var(--status-ok);
  background: var(--status-ok-fill);
  color: var(--status-ok-ink);
}

.tux-lease-badge--expiring .tux-lease-badge__pill {
  border-color: var(--status-warning);
  background: var(--status-warning-fill);
  color: var(--status-warning-ink);
}

.tux-lease-badge--expired .tux-lease-badge__pill {
  border-color: var(--status-critical);
  background: var(--surface-raised);
  color: var(--text-primary);
}

.tux-lease-badge--indefinite .tux-lease-badge__pill {
  border-color: var(--surface-border);
  background: var(--surface-sunken);
  color: var(--text-primary);
}

.tux-lease-badge__glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tux-lease-badge--expired .tux-lease-badge__glyph {
  color: var(--status-critical);
}

.tux-lease-badge__icon {
  width: 0.9375rem;
  height: 0.9375rem;
}

.tux-lease-badge__label {
  font-size: 0.8125rem;
  font-weight: 700;
}

.tux-lease-badge__label::after {
  content: " ·";
  opacity: 0.7;
}

.tux-lease-badge__countdown {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.8125rem;
  font-weight: 700;
}

.tux-lease-badge__expires {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  opacity: 0.85;
}

.tux-lease-badge__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
}

.tux-lease-badge__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-8) var(--space-12);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.5;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-raised);
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard),
    color var(--motion-fast) var(--ease-standard);
}

.tux-lease-badge__btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-lease-badge__btn--extend {
  background: var(--brand-fill);
  border-color: var(--brand-fill);
  color: var(--text-on-brand);
}

.tux-lease-badge__btn--extend:hover {
  background: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
}

.tux-lease-badge__btn--release:hover {
  border-color: var(--status-critical);
  color: var(--status-critical);
}

@media (prefers-reduced-motion: reduce) {
  .tux-lease-badge__btn {
    transition: none;
  }
}
</style>
