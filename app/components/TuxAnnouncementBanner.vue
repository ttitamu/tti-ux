<script setup lang="ts">
/**
 * TuxAnnouncementBanner — top-of-page dismissable strip for
 * site-wide notices ("TTI offices closed Friday", "scheduled
 * maintenance Sat 2-4am", "new corridor data published").
 *
 * Distinct from TuxAlert: TuxAlert is an inline-in-page admonition
 * (think: docs sidebar, form helper, page-body callout). This is
 * chrome — sits above the page header, full-width, persists across
 * routes until dismissed, and its dismissal is remembered in
 * localStorage by `id` so the user doesn't see the same banner on
 * every page load.
 *
 * Tones — matched to the broader brand vocabulary:
 *   - `info`     · blue accent (default)
 *   - `success`  · green accent
 *   - `warning`  · gold accent
 *   - `urgent`   · maroon fill (use sparingly — reserves for
 *                  service outages, security advisories)
 *
 * Pass an `id` prop and dismissal persists in `localStorage` under
 * the key `tux-announcement-{id}`. Omit `id` for non-persistent
 * banners (e.g. tied to a request-scoped state). Dismissal emits
 * `dismiss` so consumers can drive their own persistence.
 */
type Tone = "info" | "success" | "warning" | "urgent";

interface Action {
  label: string;
  to?: string;
  href?: string;
}

interface Props {
  /** Stable identifier for localStorage-backed dismissal memory. */
  id?: string;
  tone?: Tone;
  /** Lucide icon. Defaults vary by tone. */
  icon?: string;
  /** Optional eyebrow above the message — "scheduled maintenance" etc. */
  eyebrow?: string;
  /** Headline message text. Slot `default` overrides if richer markup needed. */
  message?: string;
  /** Optional CTA. */
  action?: Action;
  /** Allow user-dismissal. Defaults to true. */
  dismissable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  tone: "info",
  icon: undefined,
  eyebrow: undefined,
  message: undefined,
  action: undefined,
  dismissable: true,
});

const emit = defineEmits<{ dismiss: [] }>();

const defaultIcon: Record<Tone, string> = {
  info:    "lucide:info",
  success: "lucide:check-circle-2",
  warning: "lucide:alert-triangle",
  urgent:  "lucide:siren",
};

const storageKey = computed(() => (props.id ? `tux-announcement-${props.id}` : null));
const dismissed = ref(false);

onMounted(() => {
  if (!storageKey.value) return;
  try {
    if (localStorage.getItem(storageKey.value) === "1") {
      dismissed.value = true;
    }
  } catch { /* localStorage unavailable — render banner */ }
});

function dismiss() {
  dismissed.value = true;
  if (storageKey.value) {
    try { localStorage.setItem(storageKey.value, "1"); } catch { /* ignore */ }
  }
  emit("dismiss");
}
</script>

<template>
  <Transition name="tux-announcement">
    <aside
      v-if="!dismissed"
      class="tux-announcement"
      :class="`tux-announcement--${tone}`"
      role="region"
      :aria-label="eyebrow || 'Site announcement'"
    >
      <div class="tux-announcement__inner">
        <UIcon
          :name="icon ?? defaultIcon[tone]"
          class="tux-announcement__icon"
          aria-hidden="true"
        />
        <div class="tux-announcement__copy">
          <p v-if="eyebrow" class="eyebrow tux-announcement__eyebrow">{{ eyebrow }}</p>
          <p class="tux-announcement__message">
            <slot>{{ message }}</slot>
          </p>
        </div>
        <a
          v-if="action"
          :to="action.to"
          :href="action.href"
          class="tux-announcement__action"
        >
          {{ action.label }}
          <UIcon name="lucide:arrow-right" class="tux-announcement__action-icon" />
        </a>
        <button
          v-if="dismissable"
          type="button"
          class="tux-announcement__dismiss"
          aria-label="Dismiss announcement"
          @click="dismiss"
        >
          <UIcon name="lucide:x" class="tux-announcement__dismiss-icon" />
        </button>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.tux-announcement {
  width: 100%;
  border-bottom: 1px solid var(--surface-border);
}

.tux-announcement__inner {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0.625rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  font-size: 0.875rem;
}

.tux-announcement__icon {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}

.tux-announcement__copy {
  flex: 1;
  min-width: 0;
}

.tux-announcement__eyebrow {
  margin: 0 0 0.0625rem;
}

.tux-announcement__message {
  margin: 0;
  line-height: 1.4;
}

.tux-announcement__action {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  text-decoration: none;
  flex-shrink: 0;
}

.tux-announcement__action:hover {
  text-decoration: underline;
}

.tux-announcement__action-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.tux-announcement__dismiss {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--radius-sm);
  background: transparent;
  border: 0;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  transition:
    opacity var(--motion-fast) var(--ease-standard),
    background var(--motion-fast) var(--ease-standard);
}

.tux-announcement__dismiss:hover,
.tux-announcement__dismiss:focus-visible {
  opacity: 1;
  background: color-mix(in srgb, currentColor 12%, transparent);
}

.tux-announcement__dismiss-icon {
  width: 0.9375rem;
  height: 0.9375rem;
}

/* ── Tone variants ─────────────────────────────────────────── */
.tux-announcement--info {
  background: color-mix(in srgb, var(--color-info) 10%, var(--surface-raised));
  color: var(--text-primary);
}
.tux-announcement--info .tux-announcement__icon { color: var(--color-info); }
.tux-announcement--info .tux-announcement__action { color: var(--color-info); }

.tux-announcement--success {
  background: color-mix(in srgb, var(--color-success) 10%, var(--surface-raised));
  color: var(--text-primary);
}
.tux-announcement--success .tux-announcement__icon { color: var(--color-success); }
.tux-announcement--success .tux-announcement__action { color: var(--color-success); }

.tux-announcement--warning {
  background: color-mix(in srgb, var(--brand-accent) 18%, var(--surface-raised));
  color: var(--text-primary);
}
.tux-announcement--warning .tux-announcement__icon { color: var(--brand-accent-deep); }
.tux-announcement--warning .tux-announcement__action { color: var(--brand-accent-deep); }

.tux-announcement--urgent {
  background: var(--brand-fill);
  color: #ffffff;
  border-bottom-color: rgba(255, 255, 255, 0.15);
}
.tux-announcement--urgent .tux-announcement__icon,
.tux-announcement--urgent .tux-announcement__action,
.tux-announcement--urgent .tux-announcement__eyebrow { color: #ffffff; }

/* ── Transition ────────────────────────────────────────────── */
.tux-announcement-enter-active,
.tux-announcement-leave-active {
  transition: opacity var(--motion-base) var(--ease-standard),
              max-height var(--motion-base) var(--ease-standard);
  overflow: hidden;
}
.tux-announcement-enter-from,
.tux-announcement-leave-to {
  opacity: 0;
  max-height: 0;
}
.tux-announcement-enter-to,
.tux-announcement-leave-from {
  opacity: 1;
  max-height: 8rem;
}
</style>
