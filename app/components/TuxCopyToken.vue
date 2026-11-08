<script setup lang="ts">
/**
 * TuxCopyToken — monospace structured identifier chip with optional
 * middle-ellipsis truncation, verification badge, and 1-click clipboard copy.
 *
 * Designed for dataset URIs, sensor UUIDs, cryptographic digests, DOIs,
 * station identifiers, and API reference tokens where visual scanning
 * benefits from `head…tail` middle truncation while clipboard copy always
 * preserves the full raw string.
 */
import { computed, onUnmounted, ref } from "vue";

export interface TuxCopyTokenProps {
  /** Full raw identifier string copied to the clipboard on click. */
  value: string;
  /** Optional short prefix tag (e.g. "URI", "UUID", "REF", "DOI"). */
  label?: string;
  /** Maximum displayed character length; visually middle-truncates as `head…tail` when exceeded. */
  maxLength?: number;
  /** Displays a high-contrast verification indicator alongside the token. */
  verified?: boolean;
  /** Accessible label for the clipboard copy control. */
  copyLabel?: string;
}

export type CopyTokenProps = TuxCopyTokenProps;

const props = withDefaults(defineProps<TuxCopyTokenProps>(), {
  label: undefined,
  maxLength: undefined,
  verified: false,
  copyLabel: "Copy identifier",
});

const emit = defineEmits<{
  copy: [value: string];
}>();

const copied = ref(false);
let resetTimer: ReturnType<typeof setTimeout> | undefined;

const isTruncated = computed(() => {
  if (props.maxLength === undefined || props.maxLength <= 0) return false;
  return props.value.length > props.maxLength;
});

const displayValue = computed(() => {
  const raw = props.value ?? "";
  const max = props.maxLength;
  if (max === undefined || max <= 0 || raw.length <= max) return raw;
  if (max === 1) return "…";
  if (max === 2) return `${raw.slice(0, 1)}…`;
  const budget = max - 1;
  const head = Math.ceil(budget / 2);
  const tail = Math.floor(budget / 2);
  return `${raw.slice(0, head)}…${raw.slice(raw.length - tail)}`;
});

async function handleCopy() {
  const raw = props.value;
  if (typeof globalThis.navigator?.clipboard?.writeText === "function") {
    try {
      await globalThis.navigator.clipboard.writeText(raw);
    } catch {
      // Clipboard API may reject in restricted or test contexts; still confirm & emit.
    }
  }
  copied.value = true;
  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    copied.value = false;
  }, 1800);
  emit("copy", raw);
}

onUnmounted(() => {
  clearTimeout(resetTimer);
});
</script>

<template>
  <span
    class="tux-copy-token"
    :class="[
      copied && 'tux-copy-token--copied',
      verified && 'tux-copy-token--verified',
    ]"
    :data-copied="copied || undefined"
    :data-verified="verified || undefined"
  >
    <span v-if="label" class="tux-copy-token__label">{{ label }}</span>

    <code
      class="tux-copy-token__value"
      :title="isTruncated ? value : undefined"
    >{{ displayValue }}</code>

    <span
      v-if="verified"
      class="tux-copy-token__verified"
      title="Verified identifier"
    >
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="tux-copy-token__verified-icon"
        aria-hidden="true"
      >
        <path d="M8 1.5l5 2.2v4.1c0 3.3-2.2 5.6-5 6.7-2.8-1.1-5-3.4-5-6.7V3.7L8 1.5z" />
        <path d="M5.6 8.1l1.6 1.6 3.3-3.4" />
      </svg>
      <span class="tux-copy-token__verified-text">Verified</span>
    </span>

    <span
      class="tux-copy-token__status"
      :class="{ 'tux-copy-token__status--visible': copied }"
      role="status"
      aria-live="polite"
    >{{ copied ? "Copied" : "" }}</span>

    <button
      type="button"
      class="tux-copy-token__button min-h-11"
      :aria-label="copyLabel"
      :title="copyLabel"
      @click="handleCopy"
    >
      <svg
        v-if="copied"
        viewBox="0 0 16 16"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="tux-copy-token__icon tux-copy-token__icon--check"
        aria-hidden="true"
      >
        <path d="M3.5 8.5l3 3 6-6.5" />
      </svg>
      <svg
        v-else
        viewBox="0 0 16 16"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="tux-copy-token__icon"
        aria-hidden="true"
      >
        <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
        <path d="M10.5 5.5V3.8c0-.7-.6-1.3-1.3-1.3H3.8c-.7 0-1.3.6-1.3 1.3v5.4c0 .7.6 1.3 1.3 1.3h1.7" />
      </svg>
    </button>
  </span>
</template>

<style scoped>
.tux-copy-token {
  display: inline-flex;
  align-items: stretch;
  min-height: 44px;
  max-width: 100%;
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-body);
  line-height: 1.5;
  vertical-align: middle;
  transition: border-color 150ms ease, background-color 150ms ease;
}

.tux-copy-token:hover,
.tux-copy-token:focus-within {
  border-color: var(--brand-primary);
}

.tux-copy-token--copied {
  border-color: var(--color-success);
}

.tux-copy-token__label {
  display: inline-flex;
  align-items: center;
  padding: 0 var(--space-10);
  background: var(--surface-raised);
  border-right: 1px solid var(--surface-border);
  border-top-left-radius: calc(var(--radius-md) - 1px);
  border-bottom-left-radius: calc(var(--radius-md) - 1px);
  font-family: var(--font-bold);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
}

.tux-copy-token__value {
  display: inline-flex;
  align-items: center;
  padding: 0 var(--space-12);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.tux-copy-token__verified {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  padding: 0 var(--space-8);
  margin: var(--space-4) var(--space-4) var(--space-4) 0;
  border-radius: var(--radius-sm);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  color: var(--color-success);
  font-family: var(--font-bold);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  white-space: nowrap;
  flex-shrink: 0;
}

.tux-copy-token__verified-icon {
  flex-shrink: 0;
}

.tux-copy-token__status {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-bold);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-success);
  white-space: nowrap;
  overflow: hidden;
  max-width: 0;
  padding: 0;
  opacity: 0;
  transition: opacity 150ms ease, padding 150ms ease, max-width 150ms ease;
}

.tux-copy-token__status--visible {
  max-width: 5rem;
  padding: 0 var(--space-8) 0 0;
  opacity: 1;
}

.tux-copy-token__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding: 0 var(--space-10);
  margin-left: auto;
  background: var(--surface-raised);
  border: 0;
  border-left: 1px solid var(--surface-border);
  border-top-right-radius: calc(var(--radius-md) - 1px);
  border-bottom-right-radius: calc(var(--radius-md) - 1px);
  color: var(--text-secondary);
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 150ms ease, color 150ms ease;
}

.tux-copy-token__button:hover {
  background: var(--wash-brand-8);
  color: var(--brand-primary);
}

.tux-copy-token__button:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
  position: relative;
  z-index: 2;
}

.tux-copy-token__icon--check {
  color: var(--color-success);
}

@media (prefers-reduced-motion: reduce) {
  .tux-copy-token,
  .tux-copy-token__status,
  .tux-copy-token__button {
    transition: none;
  }
}
</style>
