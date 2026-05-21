<script setup lang="ts">
/**
 * TuxTooltip — keyboard-accessible hover-help.
 *
 * Thin wrapper around Nuxt UI 4's `UTooltip`. Adds:
 *   - hairline rule under the title when both `title` + `text` are
 *     present (the editorial anchor that distinguishes a tooltip from
 *     a generic popover)
 *   - max-width tuned to ~18ch so the body wraps to a comfortable
 *     2–3 line reading height
 *   - default `side="top"` with the small arrow exposed (reka-ui
 *     handles edge collision)
 *
 * For richer floating panels (title + body + CTA + dismiss), use
 * `TuxTeachingPopover` (onboarding) or `UPopover` directly. This
 * component is for short hover-help only.
 *
 * Usage:
 *   <tux-tooltip text="Last updated 8 minutes ago">
 *     <button>Refresh</button>
 *   </tux-tooltip>
 *
 *   <!-- With title: -->
 *   <tux-tooltip title="Drift reconciler" text="Closes stale index entries every 30 minutes.">
 *     <span class="info-anchor">i</span>
 *   </tux-tooltip>
 */

interface Props {
  /** Tooltip body text. Always required (it's a tooltip — needs to
   *  say something). */
  text: string;
  /** Optional title displayed above `text` with a hairline rule under
   *  it. Use when the tooltip is explaining a concept the trigger
   *  doesn't itself name. */
  title?: string;
  /** Keyboard shortcut glyphs displayed after the text. Pass-through
   *  to UTooltip's `kbds` array. */
  kbds?: string[];
  /** Side relative to trigger. Default `top`. */
  side?: "top" | "right" | "bottom" | "left";
  /** Show the arrow pointing at the trigger. Default true. */
  arrow?: boolean;
  /** Disable the tooltip (don't show on hover/focus). */
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: undefined,
  kbds: undefined,
  side: "top",
  arrow: true,
  disabled: false,
});
</script>

<template>
  <UTooltip
    :text="title ? undefined : text"
    :kbds="kbds"
    :side="side"
    :arrow="arrow"
    :disabled="disabled"
    :ui="{
      content: 'tux-tooltip__content',
      arrow: 'tux-tooltip__arrow',
    }"
  >
    <slot />
    <template v-if="title" #content>
      <div class="tux-tooltip__body">
        <p class="tux-tooltip__title">{{ title }}</p>
        <p class="tux-tooltip__text">{{ text }}</p>
        <span v-if="kbds?.length" class="tux-tooltip__kbds">
          <kbd v-for="k in kbds" :key="k">{{ k }}</kbd>
        </span>
      </div>
    </template>
  </UTooltip>
</template>

<style scoped>
:global(.tux-tooltip__content) {
  max-width: 22ch;
  padding: 0.5rem 0.625rem;
  background: var(--surface-raised);
  color: var(--text-primary);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm, 0.25rem);
  font-size: 0.75rem;
  line-height: 1.4;
  box-shadow: 0 6px 20px -8px rgba(0, 0, 0, 0.2);
}

.tux-tooltip__body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.tux-tooltip__title {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.75rem;
  color: var(--text-primary);
  padding-bottom: 0.25rem;
  margin: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--brand-primary) 40%, var(--surface-border));
}
.tux-tooltip__text {
  font-size: 0.72rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}
.tux-tooltip__kbds {
  display: inline-flex;
  gap: 0.1875rem;
  margin-top: 0.25rem;
}
.tux-tooltip__kbds kbd {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  padding: 1px 4px;
  border: 1px solid var(--surface-border);
  border-radius: 3px;
  background: var(--surface-page);
}

:global(.tux-tooltip__arrow) {
  fill: var(--surface-raised);
  stroke: var(--surface-border);
}
</style>
