<script setup lang="ts">
/**
 * TuxRemovableChip — interactive dismissible-pill primitive.
 *
 * Pattern from Primer Web's `Token` component, factored out of
 * existing hand-rolled instances in
 * [TuxFilterPanel](./TuxFilterPanel.vue) (applied-filter chips at the
 * top of the panel) and [TuxComposer](./TuxComposer.vue)
 * (attached-corpus chips next to the textarea).
 *
 * **Distinct from [TuxBadge](./TuxBadge.vue)** — that's a *decorative*
 * label (tier / status / kind). This is *interactive*: it click-toggles
 * (via `selected`) and removes via the `×` button. Different semantic,
 * different a11y story (button-shaped, focusable, emits events).
 *
 * Typical uses:
 *   - Applied-filter chips on a search/list page (removable)
 *   - Tag-input pills inside a multi-select / comma-entry field
 *   - Recipient chips in a To/Cc field
 *   - Selected-corpus chip next to a chat composer
 *
 * The label is a slot — pass plain text, `<code>` for monospace, or a
 * small composition. Leading icon is a prop (Lucide name).
 */

interface Props {
  /** Optional Lucide icon shown before the label. */
  icon?: string;
  /** Show an `×` button on the right that emits `@remove`. */
  removable?: boolean;
  /** Size step. Mirrors TuxBadge sizing for visual coherence. */
  size?: "sm" | "md" | "lg";
  /** Selected/filled visual state. Use for toggle-style chips (e.g.,
   *  filter facet that's currently applied). */
  selected?: boolean;
  /** Non-interactive presentation; pointer-events stay live so a screen
   *  reader can announce, but visually de-emphasized and click/remove
   *  are no-ops. */
  disabled?: boolean;
  /** ARIA label for the remove button. Default speaks to the label
   *  text, but consumers can override (e.g., "Remove filter: ITAR"). */
  removeLabel?: string;
  /** When `removable`, render the whole chip as a single button that
   *  removes on click (no separate `×`). Useful for stacked-filter
   *  rows where the whole pill is the affordance. Default false. */
  clickToRemove?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  removable: false,
  size: "md",
  selected: false,
  disabled: false,
  removeLabel: undefined,
  clickToRemove: false,
});

const emit = defineEmits<{
  remove: [];
  click: [];
}>();

function onClick(e: MouseEvent) {
  if (props.disabled) return;
  if (props.clickToRemove && props.removable) {
    e.stopPropagation();
    emit("remove");
    return;
  }
  emit("click");
}

function onRemove(e: MouseEvent) {
  if (props.disabled) return;
  e.stopPropagation();
  emit("remove");
}
</script>

<template>
  <span
    class="tux-removable-chip"
    :class="[
      `tux-removable-chip--${size}`,
      selected && 'tux-removable-chip--selected',
      disabled && 'tux-removable-chip--disabled',
      removable && 'tux-removable-chip--removable',
    ]"
    :data-selected="selected || undefined"
    @click="onClick"
  >
    <Icon
      v-if="icon"
      :name="icon"
      class="tux-removable-chip__icon"
      aria-hidden="true"
    />
    <span class="tux-removable-chip__label">
      <slot />
    </span>
    <button
      v-if="removable && !clickToRemove"
      type="button"
      class="tux-removable-chip__remove"
      :aria-label="removeLabel || 'Remove'"
      :disabled="disabled"
      @click="onRemove"
    >
      <Icon name="lucide:x" class="tux-removable-chip__remove-icon" aria-hidden="true" />
    </button>
    <Icon
      v-else-if="removable && clickToRemove"
      name="lucide:x"
      class="tux-removable-chip__remove-glyph"
      aria-hidden="true"
    />
  </span>
</template>

<style scoped>
.tux-removable-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-body);
  color: var(--text-primary);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-full);
  white-space: nowrap;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.tux-removable-chip:hover:not(.tux-removable-chip--disabled),
.tux-removable-chip:focus-within:not(.tux-removable-chip--disabled) {
  background: color-mix(in srgb, var(--brand-primary) 6%, var(--surface-page));
  border-color: color-mix(in srgb, var(--brand-primary) 35%, var(--surface-border));
}

/* Selected fills with brand color — used for toggle-style chips and
   "this filter is currently applied" states. */
.tux-removable-chip--selected {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: var(--text-inverse);
}

.tux-removable-chip--selected:hover:not(.tux-removable-chip--disabled),
.tux-removable-chip--selected:focus-within:not(.tux-removable-chip--disabled) {
  background: var(--brand-primary-deep, var(--brand-primary));
  border-color: var(--brand-primary-deep, var(--brand-primary));
}

.tux-removable-chip--disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* Make the whole pill behave as a click target when click-to-remove is
   on, or when the consumer wires @click. The `removable` flag without
   `clickToRemove` keeps the pill itself non-clickable. */
.tux-removable-chip[data-clickable] {
  cursor: pointer;
}

/* Sizes */
.tux-removable-chip--sm {
  font-size: 0.6875rem;
  padding: 0.125rem 0.5rem;
  gap: 0.25rem;
}
.tux-removable-chip--sm .tux-removable-chip__icon { width: 0.75rem; height: 0.75rem; }
.tux-removable-chip--sm .tux-removable-chip__remove { width: 1rem; height: 1rem; }
.tux-removable-chip--sm .tux-removable-chip__remove-icon,
.tux-removable-chip--sm .tux-removable-chip__remove-glyph { width: 0.625rem; height: 0.625rem; }

.tux-removable-chip--md {
  font-size: 0.8125rem;
  padding: 0.1875rem 0.625rem;
}
.tux-removable-chip--md .tux-removable-chip__icon { width: 0.875rem; height: 0.875rem; }
.tux-removable-chip--md .tux-removable-chip__remove { width: 1.125rem; height: 1.125rem; }
.tux-removable-chip--md .tux-removable-chip__remove-icon,
.tux-removable-chip--md .tux-removable-chip__remove-glyph { width: 0.75rem; height: 0.75rem; }

.tux-removable-chip--lg {
  font-size: 0.9375rem;
  padding: 0.3125rem 0.75rem;
  gap: 0.4375rem;
}
.tux-removable-chip--lg .tux-removable-chip__icon { width: 1rem; height: 1rem; }
.tux-removable-chip--lg .tux-removable-chip__remove { width: 1.25rem; height: 1.25rem; }
.tux-removable-chip--lg .tux-removable-chip__remove-icon,
.tux-removable-chip--lg .tux-removable-chip__remove-glyph { width: 0.875rem; height: 0.875rem; }

.tux-removable-chip__icon {
  flex-shrink: 0;
  color: var(--brand-primary);
}

.tux-removable-chip--selected .tux-removable-chip__icon {
  color: var(--text-inverse);
}

.tux-removable-chip__label {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 16rem;
  font-weight: 500;
}

.tux-removable-chip__label :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.875em;
}

.tux-removable-chip__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-left: 0.125rem;
  background: transparent;
  border: 0;
  border-radius: var(--radius-full);
  color: var(--text-muted);
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.tux-removable-chip__remove:hover,
.tux-removable-chip__remove:focus-visible {
  background: color-mix(in srgb, var(--text-primary) 12%, transparent);
  color: var(--text-primary);
  outline: none;
}

.tux-removable-chip--selected .tux-removable-chip__remove {
  color: color-mix(in srgb, var(--text-inverse) 75%, transparent);
}

.tux-removable-chip--selected .tux-removable-chip__remove:hover,
.tux-removable-chip--selected .tux-removable-chip__remove:focus-visible {
  background: color-mix(in srgb, var(--text-inverse) 18%, transparent);
  color: var(--text-inverse);
}

.tux-removable-chip__remove:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.tux-removable-chip__remove:disabled:hover {
  background: transparent;
  color: var(--text-muted);
}

/* Decorative × glyph for clickToRemove mode — visual affordance only,
   the whole pill is the actual click target via `onClick`. */
.tux-removable-chip__remove-glyph {
  flex-shrink: 0;
  margin-left: 0.125rem;
  color: var(--text-muted);
  transition: color 0.15s ease;
}

.tux-removable-chip:hover .tux-removable-chip__remove-glyph,
.tux-removable-chip:focus-within .tux-removable-chip__remove-glyph {
  color: var(--brand-primary);
}

.tux-removable-chip--selected .tux-removable-chip__remove-glyph {
  color: color-mix(in srgb, var(--text-inverse) 75%, transparent);
}

.tux-removable-chip--selected:hover .tux-removable-chip__remove-glyph,
.tux-removable-chip--selected:focus-within .tux-removable-chip__remove-glyph {
  color: var(--text-inverse);
}
</style>
