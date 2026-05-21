<script setup lang="ts">
/**
 * TuxTeachingPopover — onboarding/guided-tour tooltip element.
 *
 * Pattern from Microsoft Fluent 2's `Teaching popover`: a richer
 * tooltip used to teach a feature in context. Distinguished from
 * `UTooltip` (passive hover help) and `TuxInfoLabel`'s popover (single
 * detail panel) by the guided-flow affordances: an optional header
 * image, a Next/Skip action pair in the footer, and an explicit step
 * counter ("2 of 5").
 *
 * Typical use:
 *   - tti-ai-studio first-run experience walking through corpus
 *     attach → composer → citations
 *   - Landscape onboarding tour explaining the facet panel
 *   - Single-tap teaching popovers anchored to a new feature
 *     (no step counter, just a "Got it" primary)
 *
 * The component owns the visual chrome + footer behavior; consumers
 * wire the actual anchor + step lifecycle. v-model binds the open
 * state; v-model:step binds the 1-indexed current step. Emits `next`,
 * `prev`, `skip`, `finish` so the host app can advance / dismiss the
 * tour.
 *
 *   <TuxTeachingPopover
 *     v-model="tourOpen"
 *     v-model:step="step"
 *     :total-steps="5"
 *     title="Attach a corpus"
 *     anchor="#composer-attach"
 *     @finish="onTourFinish"
 *     @skip="onTourSkip"
 *   >
 *     <template #image>
 *       <img src="/onboarding/corpus-attach.svg" alt="" />
 *     </template>
 *     Scope each session to a corpus so the model only sees the docs
 *     you've authorized. Click the attach button to pick one.
 *   </TuxTeachingPopover>
 */

interface Props {
  /** v-model: open state. */
  modelValue?: boolean;
  /** v-model:step — current 1-indexed step. Default 1. */
  step?: number;
  /** Total number of steps. Default 1 (single popover, no counter). */
  totalSteps?: number;
  /** Header eyebrow/title. */
  title?: string;
  /** Brand-tinted footer + image background. Matches Fluent's "On Brand"
   *  variant for emphasis tours. */
  onBrand?: boolean;
  /** Hide the dismiss `×` button in the header. */
  noDismiss?: boolean;
  /** Primary action label. Auto-switches to "Got it" on the last step;
   *  override via this prop. */
  primaryLabel?: string;
  /** Secondary action label. Defaults to "Skip" (or "" if hidden). */
  secondaryLabel?: string;
  /** Hide the secondary action button. */
  noSecondary?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  step: 1,
  totalSteps: 1,
  title: undefined,
  onBrand: false,
  noDismiss: false,
  primaryLabel: undefined,
  secondaryLabel: "Skip",
  noSecondary: false,
});

const emit = defineEmits<{
  "update:modelValue": [open: boolean];
  "update:step": [step: number];
  next: [step: number];
  prev: [step: number];
  skip: [];
  finish: [];
}>();

const isLast = computed(() => props.step >= props.totalSteps);
const showCounter = computed(() => props.totalSteps > 1);

const primaryLabelComputed = computed(() => {
  if (props.primaryLabel) return props.primaryLabel;
  return isLast.value ? "Got it" : "Next";
});

function dismiss() {
  emit("update:modelValue", false);
}

function onPrimary() {
  if (isLast.value) {
    emit("finish");
    emit("update:modelValue", false);
    return;
  }
  const next = props.step + 1;
  emit("update:step", next);
  emit("next", next);
}

function onSecondary() {
  emit("skip");
  emit("update:modelValue", false);
}
</script>

<template>
  <Teleport to="body">
    <Transition name="tux-teaching-popover">
      <section
        v-if="modelValue"
        class="tux-teaching-popover"
        :class="{ 'tux-teaching-popover--on-brand': onBrand }"
        role="dialog"
        aria-modal="false"
        :aria-label="title ?? 'Teaching popover'"
      >
        <header v-if="title || !noDismiss" class="tux-teaching-popover__head">
          <p v-if="title" class="tux-teaching-popover__title">{{ title }}</p>
          <button
            v-if="!noDismiss"
            type="button"
            class="tux-teaching-popover__dismiss"
            aria-label="Dismiss"
            @click="dismiss"
          >
            <Icon name="lucide:x" class="tux-teaching-popover__dismiss-icon" aria-hidden="true" />
          </button>
        </header>

        <div v-if="$slots.image" class="tux-teaching-popover__image">
          <slot name="image" />
        </div>

        <div class="tux-teaching-popover__body">
          <slot />
        </div>

        <footer class="tux-teaching-popover__foot">
          <span v-if="showCounter" class="tux-teaching-popover__counter">
            {{ step }} of {{ totalSteps }}
          </span>
          <span class="tux-teaching-popover__foot-spacer" />
          <button
            v-if="!noSecondary"
            type="button"
            class="tux-teaching-popover__btn tux-teaching-popover__btn--secondary"
            @click="onSecondary"
          >{{ secondaryLabel }}</button>
          <button
            type="button"
            class="tux-teaching-popover__btn tux-teaching-popover__btn--primary"
            @click="onPrimary"
          >{{ primaryLabelComputed }}</button>
        </footer>
      </section>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Positioning: the consumer normally anchors this via JS (Floating UI,
   tippy, custom). For ergonomic ad-hoc use we ship a sensible default —
   bottom-right of the viewport — with z-index that floats above app
   chrome. Real onboarding tours should layer in proper anchoring on
   top; this keeps the visual chrome consistent. */
.tux-teaching-popover {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 60;
  width: 22rem;
  max-width: calc(100vw - 3rem);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  box-shadow: 0 18px 50px -10px rgba(0,0,0,0.18), 0 4px 10px -2px rgba(0,0,0,0.08);
  font-family: var(--font-body);
  overflow: hidden;
}

.tux-teaching-popover--on-brand {
  background: var(--brand-primary);
  color: var(--text-inverse);
  border-color: var(--brand-primary-deep, var(--brand-primary));
}

.tux-teaching-popover__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0.875rem;
}

.tux-teaching-popover__title {
  flex: 1;
  margin: 0;
  font-weight: 700;
  font-size: 0.875rem;
  color: inherit;
}

.tux-teaching-popover__dismiss {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  color: currentColor;
  opacity: 0.7;
  cursor: pointer;
  transition: opacity 0.15s ease, background-color 0.15s ease;
}

.tux-teaching-popover__dismiss:hover,
.tux-teaching-popover__dismiss:focus-visible {
  opacity: 1;
  background: color-mix(in srgb, currentColor 14%, transparent);
  outline: none;
}

.tux-teaching-popover__dismiss-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.tux-teaching-popover__image {
  background: var(--surface-sunken);
  padding: 0.5rem;
}

.tux-teaching-popover--on-brand .tux-teaching-popover__image {
  background: color-mix(in srgb, #000 14%, var(--brand-primary));
}

.tux-teaching-popover__image :deep(img),
.tux-teaching-popover__image :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
}

.tux-teaching-popover__body {
  padding: 0.5rem 0.875rem 0.875rem;
  font-size: 0.8125rem;
  line-height: 1.5;
}

.tux-teaching-popover__foot {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  border-top: 1px solid var(--surface-border);
  background: var(--surface-sunken);
}

.tux-teaching-popover--on-brand .tux-teaching-popover__foot {
  background: color-mix(in srgb, #000 12%, var(--brand-primary));
  border-top-color: color-mix(in srgb, #fff 14%, var(--brand-primary));
}

.tux-teaching-popover__counter {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.tux-teaching-popover--on-brand .tux-teaching-popover__counter {
  color: color-mix(in srgb, var(--text-inverse) 78%, transparent);
}

.tux-teaching-popover__foot-spacer {
  flex: 1;
}

.tux-teaching-popover__btn {
  padding: 0.3125rem 0.75rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.tux-teaching-popover__btn--secondary {
  background: transparent;
  border: 0;
  color: var(--text-secondary);
}

.tux-teaching-popover__btn--secondary:hover,
.tux-teaching-popover__btn--secondary:focus-visible {
  color: var(--text-primary);
  background: color-mix(in srgb, var(--text-primary) 8%, transparent);
  outline: none;
}

.tux-teaching-popover--on-brand .tux-teaching-popover__btn--secondary {
  color: color-mix(in srgb, var(--text-inverse) 78%, transparent);
}

.tux-teaching-popover--on-brand .tux-teaching-popover__btn--secondary:hover {
  color: var(--text-inverse);
  background: color-mix(in srgb, var(--text-inverse) 14%, transparent);
}

.tux-teaching-popover__btn--primary {
  background: var(--brand-primary);
  color: var(--text-inverse);
  border: 1px solid var(--brand-primary);
}

.tux-teaching-popover__btn--primary:hover,
.tux-teaching-popover__btn--primary:focus-visible {
  background: var(--brand-primary-deep, var(--brand-primary));
  border-color: var(--brand-primary-deep, var(--brand-primary));
  outline: none;
}

.tux-teaching-popover--on-brand .tux-teaching-popover__btn--primary {
  background: var(--text-inverse);
  color: var(--brand-primary);
  border-color: var(--text-inverse);
}

.tux-teaching-popover--on-brand .tux-teaching-popover__btn--primary:hover {
  background: color-mix(in srgb, #000 10%, var(--text-inverse));
}

.tux-teaching-popover-enter-active,
.tux-teaching-popover-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.tux-teaching-popover-enter-from,
.tux-teaching-popover-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
