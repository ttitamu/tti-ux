<script setup lang="ts">
// TuxSearch — branded inline search bar.
//
// Bordered input + attached uppercase action button. The institutional
// search affordance — used in PECAN's finder, tti-ai-studio's conversation
// search, and any catalog page that needs a search input.
//
// Two sizes:
//   - regular (60px) — page-level search, dedicated search blocks
//   - slim    (51px) — header chrome, sidebar widgets, tight spaces
//
// The bar is a real working input (v-model). Submit fires on Enter or on
// the action button click; consumers handle the result.
//
// Don't reach for UInput. UInput's borders, focus rings, and inline
// addon-button rhythm don't match the TTI signature (3px maroon focus
// border, sharp corners, uppercase action label). Built native instead.

interface Props {
  /** v-model. The current input value. */
  modelValue?: string;
  /** Bar size — `regular` (60px) for page surfaces, `slim` (51px) for chrome. */
  size?: "regular" | "slim";
  /** Placeholder text. Italic when empty. */
  placeholder?: string;
  /** Action button label. Defaults to "Search". */
  actionLabel?: string;
  /** Lucide icon on the action button. Defaults to `lucide:search`. */
  actionIcon?: string;
  /** Disable the input + action. */
  disabled?: boolean;
  /** Force the focus border treatment for screenshot/demo purposes. */
  forceFocus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  size: "regular",
  placeholder: "Search",
  actionLabel: "Search",
  actionIcon: "lucide:search",
  disabled: false,
  forceFocus: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  /** Fires on Enter keypress in the input or click of the action button. */
  submit: [value: string];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const isFocused = ref(false);

const localValue = computed({
  get: () => props.modelValue,
  set: (v: string) => emit("update:modelValue", v),
});

const showFocusBorder = computed(() => props.forceFocus || isFocused.value);

function onSubmit() {
  if (props.disabled) return;
  emit("submit", localValue.value);
}
</script>

<template>
  <div
    class="tux-search"
    :class="[
      `tux-search--${size}`,
      { 'tux-search--focused': showFocusBorder, 'tux-search--disabled': disabled }
    ]"
  >
    <input
      ref="inputRef"
      v-model="localValue"
      type="search"
      :placeholder="placeholder"
      :disabled="disabled"
      class="tux-search__input"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keyup.enter="onSubmit"
    >
    <button
      type="button"
      class="tux-search__action"
      :disabled="disabled"
      @click="onSubmit"
    >
      <span>{{ actionLabel }}</span>
      <Icon :name="actionIcon" class="tux-search__action-icon" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.tux-search {
  display: flex;
  align-items: stretch;
  width: 100%;
  max-width: 35rem;
  background: var(--surface-page);
  border: 2px solid var(--text-primary);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.tux-search--regular { height: 3.75rem; }
.tux-search--slim    { height: 3.1875rem; }

.tux-search--focused {
  border-color: var(--brand-primary);
  border-width: 3px;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--brand-primary) 25%, transparent);
}

[data-theme="tti-dark"] .tux-search {
  background: color-mix(in srgb, #fff 8%, transparent);
  border-color: rgba(255, 255, 255, 0.6);
}
[data-theme="tti-dark"] .tux-search--focused {
  border-color: var(--brand-accent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--brand-accent) 35%, transparent);
}

.tux-search--disabled {
  opacity: 0.55;
  pointer-events: none;
}

.tux-search__input {
  flex: 1;
  min-width: 0;
  padding: 0 1rem;
  font-family: var(--font-bold);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  background: transparent;
  border: 0;
  outline: 0;
}

.tux-search__input::placeholder {
  font-style: italic;
  font-weight: 500;
  color: var(--text-muted);
}

[data-theme="tti-dark"] .tux-search__input {
  color: #fff;
}
[data-theme="tti-dark"] .tux-search__input::placeholder {
  color: rgba(255, 255, 255, 0.65);
}

.tux-search__action {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-bold);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--brand-primary);
  color: #fff;
  border: 0;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.tux-search--regular .tux-search__action {
  width: 9.6875rem;
  font-size: 0.875rem;
}
.tux-search--slim .tux-search__action {
  width: 7.6875rem;
  font-size: 0.8125rem;
}

.tux-search__action:hover,
.tux-search__action:focus-visible {
  background: var(--brand-primary-deep);
  outline: none;
}

[data-theme="tti-dark"] .tux-search__action {
  background: var(--brand-accent);
  color: #2A0E15;
}
[data-theme="tti-dark"] .tux-search__action:hover,
[data-theme="tti-dark"] .tux-search__action:focus-visible {
  background: var(--brand-accent-deep);
}

.tux-search__action-icon {
  width: 0.9375rem;
  height: 0.9375rem;
  flex-shrink: 0;
}
.tux-search--slim .tux-search__action-icon {
  width: 0.875rem;
  height: 0.875rem;
}
</style>
