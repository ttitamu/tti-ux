<script setup lang="ts">
/**
 * TuxFormField — label + help + input + error stack.
 *
 * The wrapper that consistently arranges the four pieces of a
 * form field: **label** + **optional help** (TuxInfoLabel-style
 * info icon → popover) + **input** (your `<UInput>` / `<USelect>`
 * / etc in the default slot) + **error message**.
 *
 * Captures the "label cluster" noted in the Interactive Dropdown
 * absorption (see SKIP-RATIONALE for the deferral path) — the
 * wrapping target was always the label-stack, not the input
 * itself.
 *
 * Auto-generates an id + wires aria-describedby / aria-invalid /
 * aria-required so consumer inputs inherit a11y plumbing for free.
 * Slot scope provides `inputId`, `descId`, `errorId` so the
 * consumer can bind them onto their input.
 */
import { computed, useId } from "vue";

interface Props {
  /** Field label. */
  label: string;
  /** Optional help text shown via an info icon popover. */
  help?: string;
  /** Optional inline help text shown below the label (always
   *  visible — for short hints that always need to be on screen). */
  hint?: string;
  /** Validation error message. When set, the field renders as
   *  invalid. */
  error?: string;
  /** Show required indicator next to the label. */
  required?: boolean;
  /** Optional id for the input. Auto-generated when omitted. */
  inputId?: string;
  /** Layout. Default "stacked" (label above input); "inline"
   *  places label + input on the same row (good for compact
   *  filter forms). */
  layout?: "stacked" | "inline";
}

const props = withDefaults(defineProps<Props>(), {
  help: undefined,
  hint: undefined,
  error: undefined,
  required: false,
  inputId: undefined,
  layout: "stacked",
});

const generatedId = useId();
const inputId = computed(() => props.inputId || `tux-field-${generatedId}`);
const descId = computed(() => `${inputId.value}-desc`);
const errorId = computed(() => `${inputId.value}-error`);

const describedBy = computed(() => {
  const ids: string[] = [];
  if (props.hint) ids.push(descId.value);
  if (props.error) ids.push(errorId.value);
  return ids.length ? ids.join(" ") : undefined;
});
</script>

<template>
  <div
    class="tux-form-field"
    :class="[
      `tux-form-field--${layout}`,
      { 'tux-form-field--invalid': error, 'tux-form-field--required': required },
    ]"
  >
    <div class="tux-form-field__label-row">
      <label :for="inputId" class="tux-form-field__label">
        {{ label }}
        <span v-if="required" class="tux-form-field__required" aria-label="required">*</span>
      </label>
      <UPopover v-if="help">
        <button
          type="button"
          class="tux-form-field__help-trigger"
          :aria-label="`Help: ${label}`"
        >
          <Icon name="lucide:info" :size="14" />
        </button>
        <template #content>
          <p class="tux-form-field__help-text">{{ help }}</p>
        </template>
      </UPopover>
    </div>

    <p v-if="hint" :id="descId" class="tux-form-field__hint">{{ hint }}</p>

    <!-- Consumer's input — slot exposes ids + aria flags so the
         consumer just binds them. -->
    <div class="tux-form-field__input-wrap">
      <slot
        :input-id="inputId"
        :desc-id="descId"
        :error-id="errorId"
        :aria-describedby="describedBy"
        :aria-invalid="!!error"
        :aria-required="required"
      />
    </div>

    <p v-if="error" :id="errorId" class="tux-form-field__error" role="alert">
      <Icon name="lucide:alert-circle" :size="14" class="tux-form-field__error-icon" />
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.tux-form-field {
  font-family: var(--font-sans);
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.tux-form-field--inline {
  flex-direction: row;
  align-items: center;
  gap: 0.625rem;
}

.tux-form-field--inline .tux-form-field__input-wrap {
  flex: 1;
}

.tux-form-field__label-row {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.tux-form-field__label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
}

.tux-form-field__required {
  color: var(--status-error, #a33a3a);
  font-weight: 700;
  margin-left: 0.0625rem;
}

.tux-form-field__help-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.125rem;
  height: 1.125rem;
  border: 0;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 50%;
  transition: color 80ms ease-out, background 80ms ease-out;
}

.tux-form-field__help-trigger:hover,
.tux-form-field__help-trigger:focus-visible {
  color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
  outline: none;
}

.tux-form-field__help-text {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-primary);
  margin: 0;
  padding: 0.5rem 0.625rem;
  max-width: 18rem;
}

.tux-form-field__hint {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.45;
}

.tux-form-field__input-wrap {
  /* Consumer inputs sit here. */
}

.tux-form-field__error {
  display: inline-flex;
  align-items: flex-start;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--status-error, #a33a3a);
  margin: 0;
  line-height: 1.45;
  font-weight: 500;
}

.tux-form-field__error-icon {
  flex-shrink: 0;
  margin-top: 0.0625rem;
}

@media (prefers-reduced-motion: reduce) {
  .tux-form-field__help-trigger {
    transition: none;
  }
}
</style>
