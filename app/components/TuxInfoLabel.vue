<script setup lang="ts">
/**
 * TuxInfoLabel — label text + `(i)` info button → popover with detail.
 *
 * Pattern from Microsoft Fluent 2's `Info label`: a form-field-style
 * label with an inline help affordance. Click (or hover) the `(i)`
 * button to reveal an `UPopover` with the extended explanation. Used
 * for technical research forms where field meanings need context —
 * ITAR rubrics, retention classes, classifier metric definitions,
 * model-config knobs.
 *
 * Pair with form primitives via the standard `for` attribute:
 *
 *   <TuxInfoLabel for="cls-211-threshold" required>
 *     Classifier threshold
 *     <template #info>
 *       The cosine-similarity floor above which CLS-211 marks a
 *       document as ITAR-positive. Anything below this is sent to
 *       manual review.
 *     </template>
 *   </TuxInfoLabel>
 *   <UInput id="cls-211-threshold" v-model="threshold" />
 *
 * Pure presentation; consumer wires the field. The popover trigger
 * defaults to hover (matches Fluent), but `trigger="click"` exists
 * for keyboard-only or touch-heavy surfaces.
 */

interface Props {
  /** `for=` attribute on the underlying `<label>`. Wire to a sibling
   *  input's `id` for proper label/control association. */
  for?: string;
  /** Show a maroon `*` after the label to indicate the field is required. */
  required?: boolean;
  /** How the info popover opens. `hover` matches Fluent; `click` is
   *  the better default for touch / keyboard-only. */
  trigger?: "hover" | "click";
  /** ARIA label for the info button. */
  infoAriaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  for: undefined,
  required: false,
  trigger: "hover",
  infoAriaLabel: "More information",
});

// Alias the `for` prop to dodge ESLint's vue/no-parsing-error — the
// Vue template parser treats bare `for` in expressions as the reserved
// word, not the prop name. The aliased ref reads identically in the
// template (`:for="labelFor"`) and keeps the consumer API natural
// (HTML's `<label for="…">`).
const labelFor = computed(() => props.for);
</script>

<template>
  <label :for="labelFor" class="tux-info-label">
    <span class="tux-info-label__text"><slot /></span>
    <span
      v-if="required"
      class="tux-info-label__required"
      aria-label="required"
    >*</span>
    <UPopover
      v-if="$slots.info"
      :mode="trigger"
      :open-delay="100"
      :close-delay="120"
    >
      <button
        type="button"
        class="tux-info-label__trigger"
        :aria-label="infoAriaLabel"
      >
        <Icon name="lucide:info" class="tux-info-label__trigger-icon" aria-hidden="true" />
      </button>
      <template #content>
        <div class="tux-info-label__panel">
          <slot name="info" />
        </div>
      </template>
    </UPopover>
  </label>
</template>

<style scoped>
.tux-info-label {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
}

.tux-info-label__text {
  /* Don't underline on hover — it's a label, not a link. */
}

.tux-info-label__required {
  color: var(--brand-primary);
  font-weight: 700;
  margin-left: -0.25rem;
}

.tux-info-label__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: var(--radius-full);
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.tux-info-label__trigger:hover,
.tux-info-label__trigger:focus-visible {
  color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
  outline: none;
}

.tux-info-label__trigger-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.tux-info-label__panel {
  max-width: 22rem;
  padding: 0.75rem 0.875rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--text-primary);
}

.tux-info-label__panel :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.875em;
  padding: 0.0625rem 0.25rem;
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
}

.tux-info-label__panel :deep(p) {
  margin: 0;
}

.tux-info-label__panel :deep(p + p) {
  margin-top: 0.5rem;
}
</style>
