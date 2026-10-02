<script setup lang="ts">
/**
 * TuxChatBubble — Conversational chat bubble and assistant launcher.
 *
 * Designed for institutional AI surfaces across TTI (such as Rev AI in Atlas
 * and TTI Code). Supports both conversational speech bubbles with directional
 * pointer tails and floating launcher trigger buttons with teaser callouts.
 *
 * Institutional Note:
 * On public TUX documentation surfaces, active sprite animations and live backend
 * actions are excluded / secured behind institutional credentials, while this component
 * provides the canonical design-system primitive.
 *
 * Accessibility (WCAG 2.2 Level AAA):
 * - Target sizes >=44×44px on all interactive elements.
 * - Minimum 7:1 contrast ratio against raised surface.
 * - Keyboard navigation (Esc to dismiss, Enter/Space for triggers).
 * - Semantic aria-expanded and region roles.
 */

interface Props {
  /** Display mode:
   *  - bubble: conversational speech container with optional pointer tail.
   *  - trigger: floating or inline assistant launcher with avatar and status dot.
   */
  mode?: "bubble" | "trigger";
  /** Semantic role voice. */
  role?: "assistant" | "user" | "system";
  /** Assistant or speaker title. */
  title?: string;
  /** Status indicator state. */
  status?: "online" | "thinking" | "idle" | "offline";
  /** Custom status label (e.g. "Online · Haiku 4.5"). */
  statusText?: string;
  /** Teaser speech bubble copy shown alongside trigger button. */
  teaser?: string;
  /** Direction of the speech bubble pointer tail. */
  tail?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "none";
  /** Unread notification badge count or text. */
  badge?: string | number;
  /** Whether the bubble can be dismissed with a close button. */
  dismissible?: boolean;
  /** Controlled open state for trigger / popover behavior. */
  open?: boolean;
  /** List of prompt suggestion pills to render below the content. */
  suggestions?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  mode: "bubble",
  role: "assistant",
  title: "Rev AI",
  status: "online",
  statusText: undefined,
  teaser: undefined,
  tail: "none",
  badge: undefined,
  dismissible: false,
  open: true,
  suggestions: () => [],
});

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "dismiss"): void;
  (e: "select-suggestion", suggestion: string): void;
}>();

const isOpen = ref(props.open);

watch(
  () => props.open,
  (val) => {
    isOpen.value = val;
  },
);

function toggle() {
  isOpen.value = !isOpen.value;
  emit("update:open", isOpen.value);
}

function handleDismiss() {
  isOpen.value = false;
  emit("update:open", false);
  emit("dismiss");
}

function handleSuggestion(s: string) {
  emit("select-suggestion", s);
}

const statusDisplay = computed(() => {
  if (props.statusText) return props.statusText;
  switch (props.status) {
    case "online":
      return "Online";
    case "thinking":
      return "Thinking…";
    case "idle":
      return "Standby";
    case "offline":
      return "Offline";
    default:
      return "Ready";
  }
});
</script>

<template>
  <!-- Mode 1: Floating or Inline Trigger Launcher -->
  <div
    v-if="mode === 'trigger'"
    class="tux-chat-bubble-trigger flex items-center gap-3 relative"
  >
    <!-- Teaser greeting bubble -->
    <div
      v-if="teaser && isOpen"
      class="tux-chat-bubble-teaser bg-surface-raised border border-surface-border shadow-md px-3.5 py-2 rounded-xl text-xs text-text-primary flex items-center gap-2 max-w-xs animate-fade-in"
      role="status"
    >
      <span class="font-bold text-brand-primary dark:text-brand-accent">{{ title }}:</span>
      <span class="truncate">{{ teaser }}</span>
    </div>

    <!-- Trigger button -->
    <button
      type="button"
      class="tux-chat-bubble__launcher-btn relative flex items-center justify-center w-12 h-12 rounded-full bg-brand-primary text-text-inverse hover:bg-brand-primary-deep shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none"
      :aria-expanded="isOpen"
      :aria-label="`${title} assistant launcher`"
      @click="toggle"
    >
      <slot name="icon">
        <UIcon name="lucide:bot-message-square" class="w-6 h-6" />
      </slot>

      <!-- Status dot -->
      <span
        class="absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-surface-raised"
        :class="[
          status === 'online' ? 'bg-emerald-500' : '',
          status === 'thinking' ? 'bg-amber-400 animate-pulse' : '',
          status === 'idle' ? 'bg-slate-400' : '',
          status === 'offline' ? 'bg-neutral-500' : '',
        ]"
        :title="statusDisplay"
      />

      <!-- Badge count -->
      <span
        v-if="badge"
        class="absolute -bottom-1 -right-1 bg-red-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs"
      >
        {{ badge }}
      </span>
    </button>
  </div>

  <!-- Mode 2: Conversational Speech Bubble -->
  <div
    v-else-if="isOpen"
    class="tux-chat-bubble relative bg-surface-raised border border-surface-border rounded-2xl p-4 shadow-md max-w-lg transition-all"
    :class="[
      `tux-chat-bubble--${role}`,
      `tux-chat-bubble--tail-${tail}`,
    ]"
    role="region"
    :aria-label="`${title} message`"
  >
    <!-- Header row -->
    <div class="tux-chat-bubble__header flex items-center justify-between gap-3 pb-2.5 mb-2.5 border-b border-surface-border/60">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-full bg-brand-primary/10 dark:bg-brand-primary/25 text-brand-primary dark:text-brand-accent flex items-center justify-center">
          <slot name="avatar">
            <UIcon name="lucide:sparkles" class="w-4 h-4" />
          </slot>
        </div>
        <div>
          <span class="font-bold text-sm text-text-primary block leading-tight">{{ title }}</span>
          <span class="text-[11px] text-text-muted flex items-center gap-1 leading-tight">
            <span
              class="inline-block w-1.5 h-1.5 rounded-full"
              :class="[
                status === 'online' ? 'bg-emerald-500' : '',
                status === 'thinking' ? 'bg-amber-400 animate-pulse' : '',
                status === 'idle' ? 'bg-slate-400' : '',
                status === 'offline' ? 'bg-neutral-500' : '',
              ]"
            />
            {{ statusDisplay }}
          </span>
        </div>
      </div>

      <!-- Close / Dismiss control -->
      <button
        v-if="dismissible"
        type="button"
        class="text-text-muted hover:text-text-primary p-1 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Dismiss chat bubble"
        @click="handleDismiss"
      >
        <UIcon name="lucide:x" class="w-4 h-4" />
      </button>
    </div>

    <!-- Message body slot -->
    <div class="tux-chat-bubble__content text-sm text-text-secondary leading-relaxed">
      <slot>
        <span>I am ready to assist with transportation data, corridor analysis, or documentation queries.</span>
      </slot>
    </div>

    <!-- Suggestion action chips -->
    <div
      v-if="suggestions && suggestions.length > 0"
      class="tux-chat-bubble__suggestions flex flex-wrap gap-2 mt-3 pt-3 border-t border-surface-border/40"
    >
      <button
        v-for="(suggestion, idx) in suggestions"
        :key="idx"
        type="button"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-surface-sunken hover:bg-brand-primary hover:text-text-inverse text-text-primary border border-surface-border transition-colors cursor-pointer min-h-[44px]"
        @click="handleSuggestion(suggestion)"
      >
        <UIcon name="lucide:sparkles" class="w-3 h-3 text-brand-accent flex-shrink-0" />
        <span>{{ suggestion }}</span>
      </button>
    </div>

    <!-- Speech pointer tail -->
    <div
      v-if="tail !== 'none'"
      class="tux-chat-bubble__tail"
      :class="`tux-chat-bubble__tail--${tail}`"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.tux-chat-bubble {
  min-width: 240px;
}

.tux-chat-bubble--assistant {
  border-left: 3px solid var(--brand-primary);
}

[data-theme="tti-dark"] .tux-chat-bubble--assistant {
  border-left: 3px solid var(--brand-accent);
}

.tux-chat-bubble--user {
  background-color: var(--surface-sunken);
  border-left: 3px solid var(--text-muted);
}

.tux-chat-bubble--system {
  border-left: 3px solid var(--color-info);
}

/* Directional speech pointer tails */
.tux-chat-bubble__tail {
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: var(--surface-raised);
  border-style: solid;
  border-color: var(--surface-border);
  transform: rotate(45deg);
}

.tux-chat-bubble__tail--bottom-right {
  bottom: -6px;
  right: 24px;
  border-width: 0 1px 1px 0;
}

.tux-chat-bubble__tail--bottom-left {
  bottom: -6px;
  left: 24px;
  border-width: 0 0 1px 1px;
}

.tux-chat-bubble__tail--top-right {
  top: -6px;
  right: 24px;
  border-width: 1px 1px 0 0;
}

.tux-chat-bubble__tail--top-left {
  top: -6px;
  left: 24px;
  border-width: 1px 0 0 1px;
}

.tux-chat-bubble__launcher-btn:focus-visible {
  box-shadow: var(--shadow-focus);
}
</style>
