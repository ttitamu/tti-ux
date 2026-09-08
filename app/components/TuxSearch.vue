<script setup lang="ts">
// TuxSearch — the tux search surface.
//
// Three shapes, one component:
//
//   field  — bordered input, leading search glyph, clear affordance.
//            THE DEFAULT. Toolbars, table headers, sidebar widgets,
//            app chrome — anywhere search sits beside other controls.
//   slab   — field plus an attached uppercase action button. The
//            editorial page-level treatment: hero strips, dedicated
//            /search pages, marketing surfaces. Its weight comes from
//            the hard 2px rule and the button, NOT from square corners
//            — the corner radius follows Batch K.2 like every other
//            control.
//   block  — a labeled unit: heading + bar + optional lede. Footers,
//            standalone search pages, empty states where search is the
//            primary next action.
//
// LINEAGE. Through v2.1.0 this was a direct port of the AggieUX search
// bar — its 60/51px heights, its 2px→3px border-thickening focus, its
// italic placeholder, its raw hexes. Every mechanical part now runs on
// tux tokens instead: two-ring focus (--shadow-focus, sand inner halo,
// visual-language-evolution.md § Batch E-prelude 1), the survey easing,
// the elevation tiers, the rhythm ramp, the wash ladder. Zero raw color
// literals remain. The slab keeps the attached-button anatomy because
// it is genuinely the right editorial shape — it is simply no longer
// what you get by default.
//
// SIGNATURE MOVES carried here (design/tux.md § Signature moves):
//
//   Two-ring focus — the sand-halo ring, at a constant border width.
//     The old 2px→3px border jump shifted layout by 1px on every focus.
//
//   Leading glyph — lucide:search at the leading edge, matching
//     TuxCommandPalette's input row. This is what lets the action
//     button become optional: the field reads as search without it.
//
//   Corner-drop — the brand slab drops in behind the bar on focus,
//     adapted from TuxCard. Deliberately drops WITHOUT the translate:
//     TuxCard moves +6/-6px on hover, but moving a text field out from
//     under an active caret is hostile, so only the shadow lands. On by
//     default for slab and block; off for field, where a flourish would
//     fight a dense toolbar. Override with `corner-drop`.
//
// Don't reach for UInput — its borders, focus rings, and inline
// addon-button rhythm don't match the tux signature. Built native.

import { computed, nextTick, ref, useId, useSlots } from "vue";

type Variant = "field" | "slab" | "block";
type BarVariant = "field" | "slab";

interface Props {
  /** v-model. The current input value. */
  modelValue?: string;
  /**
   * Shape. `field` (default) is the tux-native bar for chrome and
   * toolbars; `slab` attaches the uppercase action button for
   * page-level surfaces; `block` wraps a bar in a heading + lede.
   */
  variant?: Variant;
  /** Bar anatomy inside a `block`. Ignored for other variants. */
  blockBar?: BarVariant;
  /** Density. `slim` is for header chrome and tight columns. */
  size?: "regular" | "slim";
  /** Placeholder text. Italic when empty. */
  placeholder?: string;
  /** Heading text. `block` only. */
  heading?: string;
  /** Helper copy under the bar — scope, corpus size, syntax hints. `block` only. */
  lede?: string;
  /** Accessible name for the input. Falls back to heading, then placeholder. */
  ariaLabel?: string;
  /** Action button label. `slab` only. */
  actionLabel?: string;
  /**
   * Icon on the action button. Off by default now that the leading
   * glyph carries the search signal — set it when the action isn't a
   * search (a filter, a query run).
   */
  actionIcon?: string;
  /** Leading glyph inside the field. Pass `false` to drop it. */
  leadingIcon?: string | false;
  /** Show the clear (×) affordance once there's a value. */
  clearable?: boolean;
  /** In-flight state — glyph becomes a spinner, input goes aria-busy. */
  loading?: boolean;
  /** Disable the input and its controls. */
  disabled?: boolean;
  /**
   * Corner-drop on focus. Defaults on for `slab` / `block`, off for
   * `field`. Pass explicitly to override either way.
   */
  cornerDrop?: boolean;
  /** Force the focus treatment for screenshots / docs / demos. */
  forceFocus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  variant: "field",
  blockBar: "field",
  size: "regular",
  placeholder: "Search",
  heading: undefined,
  lede: undefined,
  ariaLabel: undefined,
  actionLabel: "Search",
  actionIcon: undefined,
  leadingIcon: "lucide:search",
  clearable: true,
  loading: false,
  disabled: false,
  cornerDrop: undefined,
  forceFocus: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  /** Enter in the input, or a click on the action button. */
  submit: [value: string];
  /** The clear (×) affordance was used. */
  clear: [];
}>();

const slots = useSlots();
const uid = useId();
const panelId = `tux-search-panel-${uid}`;

const inputRef = ref<HTMLInputElement | null>(null);
const isFocused = ref(false);
const panelOpen = ref(false);

const localValue = computed({
  get: () => props.modelValue,
  set: (v: string) => emit("update:modelValue", v),
});

/** `block` delegates its bar anatomy to blockBar. */
const barVariant = computed<BarVariant>(() =>
  props.variant === "block" ? props.blockBar : props.variant,
);

const showFocus = computed(() => props.forceFocus || isFocused.value);

/** Flourish suits page-level surfaces; a dense toolbar doesn't want it. */
const showCornerDrop = computed(() =>
  props.cornerDrop ?? props.variant !== "field",
);

const hasSuggestions = computed(() => Boolean(slots.suggestions));
const panelVisible = computed(
  () => hasSuggestions.value && panelOpen.value && !props.disabled,
);

const showClear = computed(
  () => props.clearable && Boolean(localValue.value) && !props.disabled,
);

const inputLabel = computed(
  () => props.ariaLabel ?? props.heading ?? props.placeholder,
);

function onFocus() {
  isFocused.value = true;
  if (hasSuggestions.value) panelOpen.value = true;
}

/**
 * Only surrender focus when it actually left the component — clicking
 * the clear button or a suggestion must not collapse the panel.
 */
function onFocusout(e: FocusEvent) {
  const next = e.relatedTarget as Node | null;
  if (next && (e.currentTarget as HTMLElement).contains(next)) return;
  isFocused.value = false;
  panelOpen.value = false;
}

function onSubmit() {
  if (props.disabled) return;
  panelOpen.value = false;
  emit("submit", localValue.value);
}

function onClear() {
  if (props.disabled) return;
  localValue.value = "";
  emit("clear");
  nextTick(() => inputRef.value?.focus());
}

function onEscape() {
  if (panelOpen.value) {
    panelOpen.value = false;
    return;
  }
  if (localValue.value) onClear();
}

function closePanel() {
  panelOpen.value = false;
}

defineExpose({ focus: () => inputRef.value?.focus(), clear: onClear });
</script>

<template>
  <div
    class="tux-search"
    :class="[
      `tux-search--${variant}`,
      `tux-search--${size}`,
      `tux-search--bar-${barVariant}`,
      {
        'tux-search--focused': showFocus,
        'tux-search--disabled': disabled,
        'tux-search--drop': showCornerDrop,
        'tux-search--loading': loading,
      },
    ]"
    :role="variant === 'block' ? 'search' : undefined"
    @focusout="onFocusout"
  >
    <h3 v-if="variant === 'block' && heading" class="tux-search__heading">
      {{ heading }}
    </h3>

    <div class="tux-search__anchor">
      <div class="tux-search__bar">
        <span v-if="leadingIcon" class="tux-search__leading" aria-hidden="true">
          <Icon
            :name="loading ? 'lucide:loader-circle' : leadingIcon"
            class="tux-search__leading-icon"
            :class="{ 'tux-search__leading-icon--spin': loading }"
          />
        </span>

        <input
          ref="inputRef"
          v-model="localValue"
          type="search"
          class="tux-search__input"
          :placeholder="placeholder"
          :disabled="disabled"
          :aria-label="inputLabel"
          :aria-busy="loading || undefined"
          :role="hasSuggestions ? 'combobox' : undefined"
          :aria-expanded="hasSuggestions ? panelVisible : undefined"
          :aria-controls="hasSuggestions ? panelId : undefined"
          :aria-haspopup="hasSuggestions ? 'listbox' : undefined"
          autocomplete="off"
          @focus="onFocus"
          @keyup.enter="onSubmit"
          @keydown.esc.stop.prevent="onEscape"
        >

        <button
          v-if="showClear"
          type="button"
          class="tux-search__clear"
          aria-label="Clear search"
          @click="onClear"
        >
          <Icon name="lucide:x" class="tux-search__clear-icon" aria-hidden="true" />
        </button>

        <button
          v-if="barVariant === 'slab'"
          type="button"
          class="tux-search__action"
          :disabled="disabled"
          @click="onSubmit"
        >
          <span>{{ actionLabel }}</span>
          <Icon
            v-if="actionIcon"
            :name="actionIcon"
            class="tux-search__action-icon"
            aria-hidden="true"
          />
        </button>
      </div>

      <div
        v-if="panelVisible"
        :id="panelId"
        class="tux-search__panel"
        data-tux-overlay
        data-tux-elevation="overlay"
      >
        <!--
          Consumers own the option semantics — render a role="listbox"
          with role="option" children here. The bar wires
          combobox/aria-expanded/aria-controls and handles Escape and
          focus-out; it does not manage active-descendant.
        -->
        <slot name="suggestions" :query="localValue" :close="closePanel" />
      </div>
    </div>

    <p v-if="variant === 'block' && lede" class="tux-search__lede">
      {{ lede }}
    </p>
  </div>
</template>

<style scoped>
.tux-search {
  --bar-height: 2.75rem;
  --bar-pad: var(--rhythm-normal);
  --bar-border: 1px;
  --bar-font: 0.9375rem;
  --glyph: 1.0625rem;
  --bar-max: 35rem;

  font-family: var(--font-body);
  width: 100%;
  max-width: var(--bar-max);
}

/* Block stacks heading → bar → lede on the rhythm ramp. */
.tux-search--block {
  display: flex;
  flex-direction: column;
  gap: var(--rhythm-loose);
}

.tux-search__anchor {
  position: relative;
}

/* --- sizing -------------------------------------------------------- */

.tux-search--bar-field.tux-search--slim {
  --bar-height: 2.25rem;
  --bar-pad: var(--rhythm-snug);
  --bar-font: 0.875rem;
  --glyph: 1rem;
}

/* The slab keeps the editorial 60/51px heights and the 2px rule — it's
   the page-level shape, and at hero scale that weight is correct. It
   also earns more width: it's usually the page's primary affordance,
   not one control among several. */
.tux-search--bar-slab {
  --bar-height: 3.75rem;
  --bar-pad: var(--rhythm-loose);
  --bar-border: 2px;
  --bar-font: 1rem;
  --glyph: 1.125rem;
  --bar-max: 44rem;
}

.tux-search--bar-slab.tux-search--slim {
  --bar-height: 3.1875rem;
  --bar-font: 0.9375rem;
}

/* --- the bar ------------------------------------------------------- */

.tux-search__bar {
  display: flex;
  align-items: stretch;
  height: var(--bar-height);
  background: var(--surface-raised);
  border: var(--bar-border) solid var(--surface-border);
  /* Batch K.2 binds every app control to --radius-md so the U* and Tux
     vocabularies stop reading as different systems. AggieUX's square
     corners were the loudest remaining tell in this component. */
  border-radius: var(--radius-md);
  /* Clips the attached slab button's outer corners to the bar's radius.
     Safe for the focus ring and corner-drop — an element's own
     box-shadow isn't clipped by its own overflow, only its children. */
  overflow: hidden;
  box-shadow: var(--elevation-rest);
  transition:
    border-color var(--motion-fast) var(--ease-survey),
    box-shadow var(--motion-base) var(--ease-survey),
    background-color var(--motion-fast) var(--ease-survey);
}

/* The slab's weight comes from the hard rule and the attached button,
   not from square corners. */
.tux-search--bar-slab .tux-search__bar {
  border-color: var(--text-primary);
}

.tux-search__bar:hover {
  border-color: var(--brand-primary);
}

.tux-search--disabled .tux-search__bar {
  opacity: 0.55;
  pointer-events: none;
}

/*
 * Focus. Two-ring token at a CONSTANT border width — the AggieUX
 * 2px→3px thickening shifted the whole bar by 1px on every focus.
 */
.tux-search--focused .tux-search__bar {
  border-color: var(--brand-primary);
  background: var(--wash-brand-4);
  box-shadow: var(--shadow-focus);
}

/*
 * Corner-drop. The brand slab lands behind the bar, offset down-left,
 * sitting just outside the 4px focus ring. Adapted from TuxCard's
 * corner-drop minus the translate: the card moves because it's a
 * navigation target, but a text field must not move out from under a
 * live caret.
 */
.tux-search--drop.tux-search--focused .tux-search__bar {
  box-shadow:
    var(--shadow-focus),
    -12px 12px 0 -2px var(--brand-primary);
}

/* --- leading glyph ------------------------------------------------- */

.tux-search__leading {
  display: inline-flex;
  align-items: center;
  padding-inline-start: var(--bar-pad);
  color: var(--text-muted);
  flex-shrink: 0;
  transition: color var(--motion-fast) var(--ease-survey);
}

.tux-search--focused .tux-search__leading {
  color: var(--brand-primary);
}

.tux-search__leading-icon {
  width: var(--glyph);
  height: var(--glyph);
}

.tux-search__leading-icon--spin {
  animation: tux-search-spin 0.9s linear infinite;
}

@keyframes tux-search-spin {
  to { transform: rotate(360deg); }
}

/* --- input --------------------------------------------------------- */

.tux-search__input {
  flex: 1;
  min-width: 0;
  padding-inline: var(--rhythm-snug) var(--bar-pad);
  font-family: var(--font-bold);
  font-size: var(--bar-font);
  font-weight: 500;
  color: var(--text-primary);
  background: transparent;
  border: 0;
  outline: 0;
}

/* No leading glyph — the input owns the full leading pad. */
.tux-search__bar > .tux-search__input:first-child {
  padding-inline-start: var(--bar-pad);
}

.tux-search__input::placeholder {
  font-style: italic;
  font-weight: 400;
  color: var(--text-muted);
}

/* Our own clear affordance replaces the WebKit one. */
.tux-search__input::-webkit-search-cancel-button,
.tux-search__input::-webkit-search-decoration {
  appearance: none;
  display: none;
}

/* --- clear --------------------------------------------------------- */

.tux-search__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  align-self: center;
  width: 1.75rem;
  height: 1.75rem;
  margin-inline-end: var(--rhythm-snug);
  padding: 0;
  border: 0;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition:
    color var(--motion-fast) var(--ease-survey),
    background-color var(--motion-fast) var(--ease-survey);
}

.tux-search__clear:hover,
.tux-search__clear:focus-visible {
  color: var(--brand-primary);
  background: var(--wash-brand-8);
  outline: none;
}

.tux-search__clear-icon {
  width: 0.875rem;
  height: 0.875rem;
}

/* --- slab action --------------------------------------------------- */

.tux-search__action {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--rhythm-snug);
  width: 9.6875rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  /*
   * --brand-fill, not --brand-primary: brand-primary lifts to light
   * teal in the dark theme, which would strand white label copy at
   * ~2.4:1. brand-fill stays dark maroon in every theme, so the slab
   * keeps its maroon presence on dark instead of flipping to gold the
   * way the AggieUX port did.
   */
  background: var(--brand-fill);
  color: var(--text-on-brand);
  border: 0;
  cursor: pointer;
  transition: background-color var(--motion-fast) var(--ease-survey);
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

.tux-search__action-icon {
  width: 0.9375rem;
  height: 0.9375rem;
  flex-shrink: 0;
}

/* --- block chrome -------------------------------------------------- */

.tux-search__heading {
  margin: 0;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1.375rem;
  line-height: 1.3;
  letter-spacing: var(--tracking-tight);
  color: var(--text-primary);
}

.tux-search__lede {
  margin: 0;
  margin-block-start: calc(var(--rhythm-normal) - var(--rhythm-loose));
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--text-secondary);
}

/* --- suggestions --------------------------------------------------- */

.tux-search__panel {
  position: absolute;
  z-index: 20;
  inset-inline: 0;
  top: calc(100% + var(--rhythm-snug));
  max-height: 20rem;
  overflow-y: auto;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  box-shadow: var(--elevation-overlay);
}

@media (prefers-reduced-motion: reduce) {
  .tux-search__bar,
  .tux-search__leading,
  .tux-search__clear,
  .tux-search__action {
    transition: none;
  }
  .tux-search__leading-icon--spin {
    animation: none;
  }
}
</style>
