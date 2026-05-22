<script setup lang="ts">
/**
 * TuxValidationSummary — error list at the top of a long form.
 *
 * Surfaces an aggregated list of form errors so the user sees
 * everything wrong without scrolling. Each error can link to its
 * field (anchor) so the user jumps directly to fix it.
 *
 * Use at the top of long / multi-section forms where individual
 * inline field errors are easy to miss. Renders nothing when the
 * `errors` list is empty.
 *
 * Pairs with `TuxFormField` — emit error messages into the
 * summary's `errors` array; users tab into the summary first.
 */
export interface TuxValidationError {
  /** Short error message. */
  message: string;
  /** Optional anchor target — when clicked, jumps to (and focuses)
   *  the field with this id. */
  fieldId?: string;
  /** Optional field label for context ("Email"). */
  fieldLabel?: string;
}

interface Props {
  errors: TuxValidationError[];
  /** Title shown above the error list. Default "Please fix the
   *  following before submitting:". */
  title?: string;
  /** Variant — error (default) or warning. */
  variant?: "error" | "warning";
}

withDefaults(defineProps<Props>(), {
  title: "Please fix the following before submitting:",
  variant: "error",
});

function jumpToField(fieldId: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(fieldId);
  if (!el) return;
  el.focus();
  el.scrollIntoView({ behavior: "smooth", block: "center" });
}
</script>

<template>
  <div
    v-if="errors.length > 0"
    class="tux-validation-summary"
    :class="`tux-validation-summary--${variant}`"
    role="alert"
    :aria-label="title"
  >
    <header class="tux-validation-summary__header">
      <Icon
        :name="variant === 'warning' ? 'lucide:alert-triangle' : 'lucide:alert-circle'"
        :size="20"
        class="tux-validation-summary__icon"
      />
      <p class="tux-validation-summary__title">{{ title }}</p>
      <p class="tux-validation-summary__count">{{ errors.length }} {{ errors.length === 1 ? "issue" : "issues" }}</p>
    </header>

    <ul class="tux-validation-summary__list">
      <li
        v-for="(err, i) in errors"
        :key="i"
        class="tux-validation-summary__item"
      >
        <button
          v-if="err.fieldId"
          type="button"
          class="tux-validation-summary__link"
          @click="jumpToField(err.fieldId)"
        >
          <span v-if="err.fieldLabel" class="tux-validation-summary__field">{{ err.fieldLabel }}:</span>
          <span class="tux-validation-summary__message">{{ err.message }}</span>
          <Icon name="lucide:arrow-down-right" :size="12" class="tux-validation-summary__jump" />
        </button>
        <span v-else>
          <span v-if="err.fieldLabel" class="tux-validation-summary__field">{{ err.fieldLabel }}:</span>
          <span class="tux-validation-summary__message">{{ err.message }}</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tux-validation-summary {
  border-left: 3px solid var(--status-error, #a33a3a);
  background: color-mix(in srgb, var(--status-error, #a33a3a) 6%, var(--surface-page));
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
  font-family: var(--font-sans);
}

.tux-validation-summary--warning {
  border-left-color: var(--status-warning, #c7973c);
  background: color-mix(in srgb, var(--status-warning, #c7973c) 6%, var(--surface-page));
}

.tux-validation-summary__header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.375rem;
}

.tux-validation-summary__icon {
  color: var(--status-error, #a33a3a);
}

.tux-validation-summary--warning .tux-validation-summary__icon {
  color: var(--status-warning, #c7973c);
}

.tux-validation-summary__title {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-primary);
  margin: 0;
}

.tux-validation-summary__count {
  font-size: 0.6875rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  margin: 0;
}

.tux-validation-summary__list {
  list-style: disc;
  margin: 0;
  padding: 0 0 0 1.25rem;
  font-size: 0.8125rem;
  color: var(--text-primary);
  line-height: 1.5;
}

.tux-validation-summary__item {
  margin-bottom: 0.125rem;
}

.tux-validation-summary__link {
  display: inline-flex;
  align-items: baseline;
  gap: 0.25rem;
  background: none;
  border: 0;
  padding: 0;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  font: inherit;
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--text-primary) 30%, transparent);
  text-underline-offset: 2px;
}

.tux-validation-summary__link:hover {
  color: var(--status-error, #a33a3a);
  text-decoration-color: currentColor;
}

.tux-validation-summary--warning .tux-validation-summary__link:hover {
  color: var(--status-warning, #c7973c);
}

.tux-validation-summary__field {
  font-weight: 600;
  margin-right: 0.25rem;
}

.tux-validation-summary__jump {
  opacity: 0.55;
  vertical-align: super;
}
</style>
