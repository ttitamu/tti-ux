<script setup lang="ts">
/**
 * TuxPopover — title + body + action floating panel.
 *
 * The richer-than-tooltip case. `TuxTooltip` is short hover-help with
 * an optional title + body; `TuxPopover` is the next tier up — a
 * panel that can hold a paragraph, a small data block, and one or
 * two action buttons. Sister to `TuxTooltip` (short hover-help) and
 * `TuxTeachingPopover` (onboarding nudge with a dismiss).
 *
 * When to reach for which:
 *   - hover hint, no action               → TuxTooltip
 *   - first-run / guided-tour            → TuxTeachingPopover
 *   - persistent inspect/configure panel → TuxPopover
 *   - bespoke content shape              → UPopover directly
 *
 * Default `mode="click"` because hover-with-actions is bad UX
 * (the panel disappears the moment the user reaches for the button).
 * Override to `"hover"` only for read-only inspect cases.
 *
 * Usage:
 *   <tux-popover title="Drift reconciler" body="Closes stale index entries every 30 minutes. Last run 8 min ago.">
 *     <button>Status</button>
 *     <template #actions>
 *       <button type="button">Run now</button>
 *       <button type="button">Settings…</button>
 *     </template>
 *   </tux-popover>
 */

interface Props {
  /** Optional title rendered above the body with a maroon hairline
   *  rule (the editorial anchor that distinguishes a TuxPopover from
   *  a bare UPopover). */
  title?: string;
  /** Body text. Short paragraphs work well; for richer markup, use
   *  the `#body` slot instead. */
  body?: string;
  /** Trigger interaction. Default `"click"` since
   *  hover-with-actions is bad UX. Use `"hover"` only for read-only
   *  inspect panels. */
  mode?: "click" | "hover";
  /** Side relative to trigger. Default `"bottom"`. */
  side?: "top" | "right" | "bottom" | "left";
  /** Show the arrow pointing at the trigger. Default true. */
  arrow?: boolean;
  /** Disable the popover (don't open on click/hover). */
  disabled?: boolean;
  /** Width tier. `auto` lets content size it; `sm` is ~16rem,
   *  `md` is ~22rem (default), `lg` is ~28rem. */
  width?: "auto" | "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  body: undefined,
  mode: "click",
  side: "bottom",
  arrow: true,
  disabled: false,
  width: "md",
});

const widthClass = computed(() => `tux-popover__panel--${props.width}`);
</script>

<template>
  <UPopover
    :mode="mode"
    :open-delay="mode === 'hover' ? 120 : 0"
    :close-delay="mode === 'hover' ? 160 : 0"
    :arrow="arrow"
    :content="{ side }"
    :disabled="disabled"
  >
    <slot />

    <template #content>
      <article class="tux-popover__panel" :class="widthClass">
        <header v-if="title || $slots.title" class="tux-popover__header">
          <slot name="title">
            <p class="tux-popover__title">{{ title }}</p>
          </slot>
        </header>

        <div class="tux-popover__body">
          <slot name="body">
            <p v-if="body" class="tux-popover__body-text">{{ body }}</p>
          </slot>
        </div>

        <footer v-if="$slots.actions" class="tux-popover__actions">
          <slot name="actions" />
        </footer>
      </article>
    </template>
  </UPopover>
</template>

<style scoped>
.tux-popover__panel {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 0.75rem 0.875rem;
  font-family: var(--font-sans);
  color: var(--text-primary);
  background: var(--surface-raised);
}
.tux-popover__panel--sm { width: 16rem; }
.tux-popover__panel--md { width: 22rem; max-width: min(22rem, 90vw); }
.tux-popover__panel--lg { width: 28rem; max-width: min(28rem, 90vw); }
.tux-popover__panel--auto { width: auto; }

.tux-popover__header {
  /* Editorial maroon hairline rule — same anchor used by TuxTooltip
     when a title is present. Distinguishes a structured popover from
     a bare UPopover content drop. */
  border-bottom: 1px solid color-mix(in srgb, var(--brand-primary) 24%, transparent);
  padding-bottom: 0.5rem;
}
.tux-popover__title {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-primary);
}

.tux-popover__body {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-secondary);
}
.tux-popover__body-text {
  margin: 0;
}

.tux-popover__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.125rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--surface-border);
}

/* Action buttons inside the footer get a consistent compact treatment.
   Hosts can pass their own buttons — these styles apply when bare
   <button> elements are used. */
.tux-popover__actions :deep(button) {
  font: inherit;
  font-size: 0.75rem;
  padding: 0.3125rem 0.75rem;
  background: transparent;
  border: 1px solid var(--surface-border);
  border-radius: 0.375rem;
  color: var(--text-primary);
  cursor: pointer;
}
.tux-popover__actions :deep(button:hover) {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}
.tux-popover__actions :deep(button.tux-popover__action--primary) {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: var(--brand-on-primary, white);
}
.tux-popover__actions :deep(button.tux-popover__action--primary:hover) {
  background: color-mix(in srgb, var(--brand-primary) 88%, black);
  color: var(--brand-on-primary, white);
}
</style>
