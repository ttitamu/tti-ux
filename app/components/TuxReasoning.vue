<script setup lang="ts">
/**
 * TuxReasoning — collapsible chain-of-thought accordion for AI planning.
 *
 * Authored by platform lead (TTI NIS).
 * Pattern from Claude 3.7 Sonnet, DeepSeek, and modern frontier models:
 * surfaces the model's inner reasoning stream in a collapsible,
 * distraction-free drawer above the final prose response.
 *
 * Includes duration tracking, token velocity metrics, and full WCAG AAA
 * keyboard/focus contracts.
 */

import { ref } from "vue";

interface Props {
  /** Elapsed planning duration in seconds. */
  duration?: number;
  /** Token generation speed during reasoning (e.g. 54.2 tok/s). */
  tokensPerSec?: number;
  /** Initial expanded state (defaults to false once finalized). */
  defaultOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3.4,
  tokensPerSec: undefined,
  defaultOpen: false,
});

const isExpanded = ref(props.defaultOpen);

function toggle() {
  isExpanded.value = !isExpanded.value;
}
</script>

<template>
  <div class="tux-reasoning my-2.5 rounded-xl border border-border-subtle bg-surface-raised overflow-hidden text-xs">
    <button
      type="button"
      class="w-full px-3 py-2.5 min-h-[44px] flex items-center justify-between text-left select-none text-text-secondary hover:text-text-primary hover:bg-surface-sunken/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-maroon focus-visible:ring-offset-1 focus-visible:ring-offset-surface-canvas"
      :aria-expanded="isExpanded"
      @click="toggle"
    >
      <div class="flex items-center space-x-2">
        <span class="text-brand-maroon dark:text-brand-gold" aria-hidden="true">
          <Icon name="lucide:sparkles" class="h-3.5 w-3.5" />
        </span>
        <span class="font-medium text-text-primary">Thought for {{ duration }}s</span>
        <span v-if="tokensPerSec" class="text-[10px] font-mono text-text-muted">
          ({{ tokensPerSec }} tok/s)
        </span>
      </div>

      <span
        class="transition-transform duration-150 text-text-secondary"
        :class="{ 'rotate-90': isExpanded }"
        aria-hidden="true"
      >
        ▸
      </span>
    </button>

    <div
      v-if="isExpanded"
      class="border-t border-border-subtle bg-surface-canvas px-3.5 py-3 text-text-secondary font-mono text-[11px] leading-relaxed whitespace-pre-wrap"
    >
      <slot />
    </div>
  </div>
</template>
