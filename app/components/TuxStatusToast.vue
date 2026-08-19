<script setup lang="ts">
/**
 * TuxStatusToast — the toast host/region. Mount ONCE in the app shell
 * (the docs site mounts it in app.vue); fire toasts from anywhere via
 * `useTuxToast()`. Promised by the doctrine since the motion table and
 * design/tauri-bindings.md first cited it — shipped v1.8.0.
 *
 * Semantics: the region is `role="status"` / `aria-live="polite"` so
 * screen readers announce arrivals without stealing focus; error-tone
 * toasts render `role="alert"` individually (assertive, still no focus
 * steal). Dismiss buttons are real buttons; an optional action renders
 * before dismiss.
 *
 * Motion: slide-from-edge + fade at --motion-fast/--ease-standard per
 * the components.md motion table; collapses to opacity-only under
 * prefers-reduced-motion.
 *
 * Placement: bottom-right (site shape default). `edge="top"` for
 * workbench shells whose bottom edge is owned by a composer/terminal.
 */
interface Props {
  edge?: "bottom" | "top";
}

withDefaults(defineProps<Props>(), { edge: "bottom" });

const { items, dismiss } = useTuxToast();

const toneIcon: Record<string, string> = {
  info: "lucide:info",
  success: "lucide:circle-check",
  warning: "lucide:triangle-alert",
  error: "lucide:circle-alert",
};
</script>

<template>
  <div
    class="tux-status-toast"
    :class="`tux-status-toast--${edge}`"
    role="status"
    aria-live="polite"
    aria-label="Notifications"
  >
    <TransitionGroup name="tux-toast">
      <div
        v-for="item in items"
        :key="item.id"
        class="tux-status-toast__item"
        :class="`tux-status-toast__item--${item.tone}`"
        :role="item.tone === 'error' ? 'alert' : undefined"
      >
        <UIcon
          :name="toneIcon[item.tone]!"
          class="tux-status-toast__icon"
          aria-hidden="true"
        />
        <div class="tux-status-toast__body">
          <p class="tux-status-toast__title">{{ item.title }}</p>
          <p v-if="item.description" class="tux-status-toast__description">
            {{ item.description }}
          </p>
        </div>
        <button
          v-if="item.action"
          type="button"
          class="tux-status-toast__action"
          @click="item.action.onClick(); dismiss(item.id)"
        >
          {{ item.action.label }}
        </button>
        <button
          type="button"
          class="tux-status-toast__dismiss"
          aria-label="Dismiss notification"
          @click="dismiss(item.id)"
        >
          <UIcon name="lucide:x" aria-hidden="true" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.tux-status-toast {
  position: fixed;
  right: 1rem;
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: min(24rem, calc(100vw - 2rem));
  pointer-events: none;
}
.tux-status-toast--bottom { bottom: 1rem; }
.tux-status-toast--top {
  top: calc(var(--tux-nav-height, 4rem) + 0.75rem);
  flex-direction: column-reverse;
}

.tux-status-toast__item {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.75rem 0.875rem;
  border-radius: var(--radius-md, 8px);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-left: 4px solid var(--toast-tone, var(--color-info));
  box-shadow: var(--elevation-overlay);
  color: var(--text-primary);
  font-family: var(--font-body);
}

.tux-status-toast__item--info    { --toast-tone: var(--color-info); }
.tux-status-toast__item--success { --toast-tone: var(--color-success); }
.tux-status-toast__item--warning { --toast-tone: var(--color-warning); }
.tux-status-toast__item--error   { --toast-tone: var(--color-error); }

.tux-status-toast__icon {
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;
  margin-top: 0.0625rem;
  color: var(--toast-tone);
}

.tux-status-toast__body { flex: 1; min-width: 0; }

.tux-status-toast__title {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3;
}

.tux-status-toast__description {
  margin-top: 0.125rem;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--text-secondary);
}

.tux-status-toast__action {
  flex-shrink: 0;
  align-self: center;
  font-family: var(--font-bold);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--brand-primary);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
}
.tux-status-toast__action:hover,
.tux-status-toast__action:focus-visible {
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
}

.tux-status-toast__dismiss {
  flex-shrink: 0;
  display: inline-flex;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
}
.tux-status-toast__dismiss:hover,
.tux-status-toast__dismiss:focus-visible {
  color: var(--text-primary);
  background: color-mix(in srgb, var(--text-primary) 7%, transparent);
}

/* Motion — slide-from-edge + fade, ~200ms (components.md motion table). */
.tux-toast-enter-active,
.tux-toast-leave-active,
.tux-toast-move {
  transition:
    transform var(--motion-fast) var(--ease-standard),
    opacity var(--motion-fast) var(--ease-standard);
}
.tux-toast-enter-from,
.tux-toast-leave-to {
  opacity: 0;
  transform: translateX(0.75rem);
}

@media (prefers-reduced-motion: reduce) {
  .tux-toast-enter-active,
  .tux-toast-leave-active,
  .tux-toast-move {
    transition: opacity var(--motion-fast) linear;
  }
  .tux-toast-enter-from,
  .tux-toast-leave-to {
    transform: none;
  }
}
</style>
