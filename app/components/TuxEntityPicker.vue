<script setup lang="ts">
/**
 * TuxEntityPicker — accessible rich multi-line entity selector
 * implementing the W3C ARIA 1.2 combobox + listbox pattern.
 *
 * Filters across code, label, subtitle, and owner while keeping
 * disabled or closed entities visible in context (`aria-disabled="true"`)
 * so users understand why a record is non-selectable.
 */
import { computed, nextTick, ref, useId } from "vue";

export interface EntityOption {
  id: string;
  code?: string;
  label: string;
  subtitle?: string;
  owner?: string;
  status?: "active" | "expiring" | "closed";
  metaLabel?: string;
  disabled?: boolean;
}

interface Props {
  modelValue: string | null;
  options: EntityOption[];
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  placeholder: "Search by code, title, or owner…",
  clearable: true,
});

const emit = defineEmits<{
  "update:modelValue": [id: string | null];
  select: [option: EntityOption | null];
  search: [query: string];
}>();

const uid = useId();
const inputId = `${uid}-combobox`;
const listboxId = `${uid}-listbox`;

const comboboxRef = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);
const query = ref("");
const isSearching = ref(false);
const activeIndex = ref(-1);

function optionDomId(idx: number): string {
  return `${uid}-opt-${idx}`;
}

function isOptionDisabled(opt: EntityOption): boolean {
  return Boolean(opt.disabled || opt.status === "closed");
}

const selectedOption = computed<EntityOption | null>(
  () => props.options.find((o) => o.id === props.modelValue) ?? null,
);

const displayInputValue = computed<string>(() => {
  if (isSearching.value) return query.value;
  if (!selectedOption.value) return "";
  return selectedOption.value.code
    ? `${selectedOption.value.code} · ${selectedOption.value.label}`
    : selectedOption.value.label;
});

const filteredOptions = computed<EntityOption[]>(() => {
  if (!isSearching.value || query.value.trim().length === 0) {
    return props.options;
  }
  const needle = query.value.trim().toLowerCase();
  return props.options.filter((opt) =>
    [opt.code, opt.label, opt.subtitle, opt.owner].some((field) =>
      field?.toLowerCase().includes(needle),
    ),
  );
});

const activeOptionDomId = computed<string | undefined>(() => {
  if (!isOpen.value) return undefined;
  if (activeIndex.value < 0 || activeIndex.value >= filteredOptions.value.length) {
    return undefined;
  }
  return optionDomId(activeIndex.value);
});

function statusLabel(status: NonNullable<EntityOption["status"]>): string {
  if (status === "active") return "Active";
  if (status === "expiring") return "Expiring";
  return "Closed";
}

function defaultInitialIndex(): number {
  if (filteredOptions.value.length === 0) return -1;
  const selectedIdx = filteredOptions.value.findIndex(
    (o) => o.id === props.modelValue && !isOptionDisabled(o),
  );
  if (selectedIdx >= 0) return selectedIdx;
  const firstEnabled = filteredOptions.value.findIndex((o) => !isOptionDisabled(o));
  return firstEnabled >= 0 ? firstEnabled : 0;
}

function openDropdown() {
  if (!isOpen.value) {
    isOpen.value = true;
    activeIndex.value = defaultInitialIndex();
  }
}

function closeDropdown() {
  isOpen.value = false;
  isSearching.value = false;
  query.value = "";
  activeIndex.value = -1;
}

function toggleDropdown() {
  if (isOpen.value) {
    closeDropdown();
  } else {
    openDropdown();
    nextTick(() => comboboxRef.value?.focus());
  }
}

function onInput(event: Event) {
  const val = (event.target as HTMLInputElement).value;
  query.value = val;
  isSearching.value = true;
  isOpen.value = true;
  emit("search", val);
  const firstEnabled = filteredOptions.value.findIndex((o) => !isOptionDisabled(o));
  activeIndex.value =
    filteredOptions.value.length === 0
      ? -1
      : firstEnabled >= 0
        ? firstEnabled
        : 0;
}

function chooseOption(opt: EntityOption) {
  if (isOptionDisabled(opt)) return;
  isOpen.value = false;
  isSearching.value = false;
  query.value = "";
  activeIndex.value = -1;
  emit("update:modelValue", opt.id);
  emit("select", opt);
}

function clearSelection() {
  isSearching.value = false;
  query.value = "";
  activeIndex.value = -1;
  emit("update:modelValue", null);
  emit("select", null);
  nextTick(() => comboboxRef.value?.focus());
}

function onKeydown(event: KeyboardEvent) {
  const total = filteredOptions.value.length;

  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (!isOpen.value) {
      openDropdown();
      return;
    }
    if (total > 0) {
      activeIndex.value = (activeIndex.value + 1) % total;
    }
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (!isOpen.value) {
      isOpen.value = true;
      activeIndex.value = total > 0 ? total - 1 : -1;
      return;
    }
    if (total > 0) {
      activeIndex.value = (activeIndex.value - 1 + total) % total;
    }
    return;
  }

  if (event.key === "Enter") {
    if (isOpen.value && activeIndex.value >= 0 && activeIndex.value < total) {
      event.preventDefault();
      const targetOpt = filteredOptions.value[activeIndex.value];
      if (targetOpt) {
        chooseOption(targetOpt);
      }
    }
    return;
  }

  if (event.key === "Escape") {
    if (isOpen.value || isSearching.value) {
      event.preventDefault();
      closeDropdown();
    }
  }
}

function onFocusOut(event: FocusEvent) {
  const nextFocused = event.relatedTarget as Node | null;
  const currentRoot = event.currentTarget as HTMLElement | null;
  if (currentRoot && nextFocused && currentRoot.contains(nextFocused)) {
    return;
  }
  closeDropdown();
}
</script>

<template>
  <div class="tux-entity-picker" @focusout="onFocusOut">
    <label v-if="label" :for="inputId" class="tux-entity-picker__label">
      {{ label }}
    </label>

    <div class="tux-entity-picker__control">
      <div class="tux-entity-picker__input-wrap">
        <svg
          class="tux-entity-picker__search-icon"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5L14 14" />
        </svg>

        <input
          :id="inputId"
          ref="comboboxRef"
          type="text"
          role="combobox"
          class="tux-entity-picker__input"
          aria-autocomplete="list"
          :aria-expanded="isOpen ? 'true' : 'false'"
          :aria-controls="listboxId"
          :aria-activedescendant="activeOptionDomId"
          :aria-label="!label ? placeholder : undefined"
          :placeholder="placeholder"
          :value="displayInputValue"
          autocomplete="off"
          spellcheck="false"
          @click="openDropdown"
          @input="onInput"
          @keydown="onKeydown"
        >
      </div>

      <button
        v-if="clearable && modelValue !== null"
        type="button"
        class="tux-entity-picker__icon-btn"
        aria-label="Clear selected entity"
        @click="clearSelection"
      >
        <svg
          class="tux-entity-picker__btn-svg"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>

      <button
        type="button"
        class="tux-entity-picker__icon-btn"
        :aria-label="isOpen ? 'Close entity options' : 'Open entity options'"
        tabindex="-1"
        @click="toggleDropdown"
      >
        <svg
          class="tux-entity-picker__btn-svg"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path :d="isOpen ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4'" />
        </svg>
      </button>
    </div>

    <div
      v-if="selectedOption && !isOpen"
      class="tux-entity-picker__selected-meta"
    >
      <code v-if="selectedOption.code" class="tux-entity-picker__code">
        {{ selectedOption.code }}
      </code>
      <span v-if="selectedOption.owner" class="tux-entity-picker__owner">
        {{ selectedOption.owner }}
      </span>
      <span
        v-if="selectedOption.status"
        class="tux-entity-picker__status"
        :class="`tux-entity-picker__status--${selectedOption.status}`"
      >
        {{ statusLabel(selectedOption.status) }}
      </span>
      <span v-if="selectedOption.metaLabel" class="tux-entity-picker__meta">
        {{ selectedOption.metaLabel }}
      </span>
    </div>

    <div
      :id="listboxId"
      role="listbox"
      class="tux-entity-picker__listbox"
      :aria-label="label || 'Available entities'"
      :hidden="!isOpen || filteredOptions.length === 0"
    >
      <div
        v-for="(opt, idx) in filteredOptions"
        :id="optionDomId(idx)"
        :key="opt.id"
        role="option"
        class="tux-entity-picker__option"
        :class="{
          'tux-entity-picker__option--active': idx === activeIndex,
          'tux-entity-picker__option--selected': modelValue === opt.id,
          'tux-entity-picker__option--disabled': isOptionDisabled(opt),
        }"
        :aria-selected="modelValue === opt.id ? 'true' : 'false'"
        :aria-disabled="isOptionDisabled(opt) ? 'true' : undefined"
        @mouseenter="activeIndex = idx"
        @mousedown.prevent="chooseOption(opt)"
        @click="chooseOption(opt)"
      >
        <div class="tux-entity-picker__row-primary">
          <div class="tux-entity-picker__title-group">
            <code v-if="opt.code" class="tux-entity-picker__code">
              {{ opt.code }}
            </code>
            <span class="tux-entity-picker__opt-label">{{ opt.label }}</span>
          </div>

          <span
            v-if="opt.status"
            class="tux-entity-picker__status"
            :class="`tux-entity-picker__status--${opt.status}`"
          >
            {{ statusLabel(opt.status) }}
          </span>
        </div>

        <div
          v-if="opt.subtitle || opt.owner || opt.metaLabel"
          class="tux-entity-picker__row-secondary"
        >
          <span class="tux-entity-picker__sub-left">
            <span v-if="opt.subtitle">{{ opt.subtitle }}</span>
            <span v-if="opt.subtitle && opt.owner" aria-hidden="true"> · </span>
            <span v-if="opt.owner">{{ opt.owner }}</span>
          </span>
          <span v-if="opt.metaLabel" class="tux-entity-picker__meta">
            {{ opt.metaLabel }}
          </span>
        </div>
      </div>
    </div>

    <div
      v-if="isOpen && filteredOptions.length === 0"
      class="tux-entity-picker__empty"
      role="status"
      aria-live="polite"
    >
      No matching records for "{{ query }}".
    </div>
  </div>
</template>

<style scoped>
.tux-entity-picker {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  font-family: var(--font-body);
  color: var(--text-primary);
  container-type: inline-size;
}

.tux-entity-picker__label {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-entity-picker__control {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.tux-entity-picker__input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.tux-entity-picker__search-icon {
  position: absolute;
  left: var(--space-12);
  width: 1rem;
  height: 1rem;
  color: var(--text-muted);
  pointer-events: none;
}

.tux-entity-picker__input {
  width: 100%;
  min-height: 44px;
  padding: var(--space-8) var(--space-12) var(--space-8) 2.25rem;
  font: inherit;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.tux-entity-picker__input::placeholder {
  color: var(--text-muted);
}

.tux-entity-picker__icon-btn {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: color var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard),
    background-color var(--motion-fast) var(--ease-standard);
}

.tux-entity-picker__icon-btn:hover {
  color: var(--brand-primary);
  border-color: var(--brand-primary);
  background: var(--wash-brand-4);
}

.tux-entity-picker__btn-svg {
  width: 0.9375rem;
  height: 0.9375rem;
}

.tux-entity-picker__selected-meta {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex-wrap: wrap;
  padding: var(--space-4) var(--space-8);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border-subtle);
  border-radius: var(--radius-md);
  font-size: 0.75rem;
}

.tux-entity-picker__listbox {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-height: 18rem;
  overflow-y: auto;
  padding: var(--space-4);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.tux-entity-picker__listbox[hidden] {
  display: none;
}

.tux-entity-picker__option {
  min-height: 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-8) var(--space-12);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard);
}

.tux-entity-picker__option--active {
  background: var(--wash-brand-6);
  border-color: var(--brand-primary);
}

.tux-entity-picker__option--selected {
  background: var(--wash-brand-8);
}

.tux-entity-picker__option--disabled {
  opacity: 0.65;
  cursor: not-allowed;
  background: var(--surface-sunken);
}

.tux-entity-picker__row-primary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.tux-entity-picker__title-group {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  min-width: 0;
  flex-wrap: wrap;
}

.tux-entity-picker__code {
  padding: 1px var(--space-4);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--text-brand);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
}

.tux-entity-picker__opt-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.tux-entity-picker__status {
  display: inline-flex;
  align-items: center;
  padding: 1px var(--space-8);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-radius: var(--radius-full);
  border: 1px solid transparent;
}

.tux-entity-picker__status--active {
  background: var(--status-ok-fill);
  color: var(--status-ok-ink);
  border-color: var(--status-ok);
}

.tux-entity-picker__status--expiring {
  background: var(--status-warning-fill);
  color: var(--status-warning-ink);
  border-color: var(--status-warning);
}

.tux-entity-picker__status--closed {
  background: var(--status-pending-fill);
  color: var(--status-pending-ink);
  border-color: var(--status-pending);
}

.tux-entity-picker__row-secondary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  font-size: 0.75rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.tux-entity-picker__owner {
  color: var(--text-secondary);
}

.tux-entity-picker__meta {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
}

.tux-entity-picker__empty {
  padding: var(--space-12);
  font-size: 0.8125rem;
  color: var(--text-secondary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.tux-entity-picker__input:focus-visible,
.tux-entity-picker__icon-btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

@container (max-width: 24rem) {
  .tux-entity-picker__meta {
    margin-left: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tux-entity-picker__icon-btn,
  .tux-entity-picker__option {
    transition: none;
  }
}
</style>
