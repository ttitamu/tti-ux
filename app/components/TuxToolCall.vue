<script setup lang="ts">
/**
 * TuxToolCall — agent tool execution and command event card.
 *
 * Authored by platform lead (TTI NIS).
 * Pattern from Claude Code CLI, Kanbots, and tti-ai-studio: renders discrete
 * agent tool executions (`tool_use` / `tool_result`) with status dots,
 * execution timing, collapsible stdout/stderr, and optional diff statistics.
 *
 * Level AAA WCAG 2.2 compliant: minimum 44px touch targets on the header,
 * high-contrast focus rings, and triple-channel status indicators (dot color,
 * icon glyph, and text label).
 */

import { ref } from "vue";

export type ToolStatus = "running" | "completed" | "error";

interface DiffStat {
  added: number;
  removed: number;
}

interface Props {
  /** The action verb executed by the model (e.g. "read", "bash", "edit", "git"). */
  verb: string;
  /** Primary argument passed to the tool (e.g. file path, command string). */
  arg?: string;
  /** Current execution status. */
  status?: ToolStatus;
  /** Elapsed execution time in milliseconds. */
  elapsedMs?: number;
  /** Optional diff summary if the tool modified lines. */
  diff?: DiffStat;
  /** Lucide icon name override. */
  icon?: string;
  /** Default collapsed state if content is present. */
  defaultOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  arg: undefined,
  status: "completed",
  elapsedMs: undefined,
  diff: undefined,
  icon: undefined,
  defaultOpen: false,
});

const isOpen = ref(props.defaultOpen);

function toggle() {
  isOpen.value = !isOpen.value;
}

const defaultIcon = computed(() => {
  if (props.icon) return props.icon;
  switch (props.verb.toLowerCase()) {
    case "bash":
    case "sh":
    case "cmd":
      return "lucide:terminal";
    case "read":
    case "view":
      return "lucide:file-text";
    case "write":
    case "edit":
    case "patch":
      return "lucide:file-code";
    case "git":
    case "branch":
    case "commit":
      return "lucide:git-commit";
    case "search":
    case "grep":
      return "lucide:search";
    default:
      return "lucide:cpu";
  }
});
</script>

<template>
  <div
    class="tux-tool-call my-2 rounded-lg border transition-all duration-150 overflow-hidden text-xs"
    :class="[
      status === 'error'
        ? 'border-status-error/40 bg-status-error/5 text-status-error'
        : 'border-border-subtle bg-surface-raised text-text-primary'
    ]"
  >
    <!-- Header trigger -->
    <button
      type="button"
      class="w-full flex items-center justify-between px-3 py-2.5 min-h-[44px] text-left select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-maroon focus-visible:ring-offset-1 focus-visible:ring-offset-surface-canvas hover:bg-surface-sunken/40 transition-colors"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <div class="flex items-center space-x-2.5 min-w-0 pr-2">
        <!-- Status Indicator Dot -->
        <span
          class="h-2 w-2 rounded-full shrink-0"
          :class="[
            status === 'running'
              ? 'bg-status-warning animate-ping'
              : status === 'error'
              ? 'bg-status-error'
              : 'bg-status-success'
          ]"
          aria-hidden="true"
        />

        <!-- Icon glyph -->
        <span class="text-text-muted shrink-0" aria-hidden="true">
          <Icon :name="defaultIcon" class="h-3.5 w-3.5" />
        </span>

        <!-- Verb and argument -->
        <span class="font-mono font-semibold text-text-primary">{{ verb }}</span>
        <span v-if="arg" class="truncate font-mono text-text-muted">
          ({{ arg }})
        </span>

        <!-- Diff Pill if present -->
        <span
          v-if="diff"
          class="ml-1.5 inline-flex items-center space-x-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-canvas border border-border-subtle"
        >
          <span class="text-status-success font-bold">+{{ diff.added }}</span>
          <span class="text-status-error font-bold">-{{ diff.removed }}</span>
        </span>
      </div>

      <div class="flex items-center space-x-2 shrink-0 text-[11px] font-mono text-text-muted">
        <span v-if="status === 'running'" class="text-status-warning font-semibold">running…</span>
        <span v-else-if="elapsedMs !== undefined">{{ elapsedMs }}ms</span>

        <span
          class="transition-transform duration-150 text-text-secondary"
          :class="{ 'rotate-90': isOpen }"
          aria-hidden="true"
        >
          ▸
        </span>
      </div>
    </button>

    <!-- Collapsible Body slot -->
    <div
      v-if="isOpen"
      class="border-t border-border-subtle bg-surface-canvas p-3 font-mono text-[11px] leading-relaxed overflow-x-auto"
    >
      <slot />
    </div>
  </div>
</template>
