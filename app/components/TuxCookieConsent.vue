<script setup lang="ts">
/**
 * TuxCookieConsent — privacy notice required on public TTI surfaces.
 *
 * State machine:
 *   - On mount, check `localStorage["tux-cookie-consent"]`. If set
 *     to `accepted` or `rejected`, hide the prompt.
 *   - User clicks Accept / Reject / Customize. Accept + Reject
 *     persist immediately and emit. Customize opens the per-category
 *     panel (slot-driven so the host renders a real preferences UI).
 *
 * Layout:
 *   - `position="bottom-right"` (default) — floating card, ~28rem.
 *   - `position="bottom"` — full-width strip across the bottom.
 *
 * Categories slot:
 *   - When the user clicks "Customize", the `#categories` slot
 *     renders. Use this for the per-category checkbox grid (e.g.
 *     necessary / analytics / marketing). The component doesn't
 *     ship opinions about category names; it just expands.
 *
 * Compliance posture:
 *   - "Necessary" cookies are implicitly accepted (no toggle).
 *   - This component is the surface only. The actual decision-routing
 *     (e.g. enabling Google Analytics, Plausible, etc.) lives in the
 *     host app and listens to the emitted decision events.
 */
type Decision = "accepted" | "rejected" | "custom";
type Position = "bottom-right" | "bottom";

interface Props {
  /** Stable key for localStorage. Different surfaces can use different keys. */
  storageKey?: string;
  position?: Position;
  /** Override the lede paragraph. */
  message?: string;
  /** Privacy-policy link. */
  privacyHref?: string;
  /** Render in customize mode by default (admin / preview surface). */
  initiallyExpanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  storageKey: "tux-cookie-consent",
  position: "bottom-right",
  message: "We use cookies to keep you signed in, remember your preferences, and understand how the site is used. Necessary cookies are always on.",
  privacyHref: "/privacy",
  initiallyExpanded: false,
});

const emit = defineEmits<{
  decision: [Decision];
}>();

const visible = ref(false);
const expanded = ref(props.initiallyExpanded);

onMounted(() => {
  try {
    const stored = localStorage.getItem(props.storageKey);
    visible.value = stored === null;
  } catch {
    visible.value = true;
  }
});

function persist(value: Decision) {
  try { localStorage.setItem(props.storageKey, value); } catch { /* ignore */ }
}

function accept() {
  persist("accepted");
  emit("decision", "accepted");
  visible.value = false;
}

function reject() {
  persist("rejected");
  emit("decision", "rejected");
  visible.value = false;
}

function saveCustom() {
  persist("custom");
  emit("decision", "custom");
  visible.value = false;
}

function toggleExpanded() {
  expanded.value = !expanded.value;
}
</script>

<template>
  <Teleport to="body">
    <Transition name="tux-cookie">
      <div
        v-if="visible"
        class="tux-cookie"
        :class="`tux-cookie--${position}`"
        role="dialog"
        aria-modal="false"
        aria-label="Cookie preferences"
      >
        <div class="tux-cookie__inner">
          <div class="tux-cookie__head">
            <UIcon name="lucide:cookie" class="tux-cookie__icon" aria-hidden="true" />
            <h2 class="tux-cookie__title">Cookies on this site</h2>
          </div>

          <p class="tux-cookie__message">{{ message }}</p>

          <p class="tux-cookie__links">
            <NuxtLink :to="privacyHref" class="link-tti">Privacy notice</NuxtLink>
            <button
              type="button"
              class="tux-cookie__expand-toggle link-tti"
              @click="toggleExpanded"
            >
              {{ expanded ? "Hide preferences" : "Customize preferences" }}
            </button>
          </p>

          <div v-if="expanded" class="tux-cookie__categories">
            <slot name="categories">
              <p class="tux-cookie__categories-fallback">
                Pass a <code>#categories</code> slot to render per-category
                toggles (e.g. necessary · analytics · marketing). The
                component renders the surface; the host owns the categories.
              </p>
            </slot>
          </div>

          <div class="tux-cookie__actions">
            <TuxButton
              v-if="!expanded"
              intent="ghost"
              size="sm"
              @click="reject"
            >
              Reject all
            </TuxButton>
            <TuxButton
              v-if="expanded"
              intent="secondary"
              size="sm"
              @click="saveCustom"
            >
              Save preferences
            </TuxButton>
            <TuxButton
              intent="primary"
              size="sm"
              @click="accept"
            >
              Accept all
            </TuxButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.tux-cookie {
  position: fixed;
  z-index: 60;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  color: var(--text-primary);
}

.tux-cookie--bottom-right {
  bottom: 1.25rem;
  right: 1.25rem;
  width: min(28rem, calc(100vw - 2.5rem));
}

.tux-cookie--bottom {
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 0;
  border-left: 0;
  border-right: 0;
  border-bottom: 0;
}

.tux-cookie__inner {
  padding: 1.125rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tux-cookie--bottom .tux-cookie__inner {
  max-width: 70rem;
  margin: 0 auto;
}

.tux-cookie__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tux-cookie__icon {
  width: 1.125rem;
  height: 1.125rem;
  color: var(--brand-primary);
}

.tux-cookie__title {
  margin: 0;
  font-family: var(--font-bold, var(--font-display));
  font-size: 1rem;
  font-weight: 600;
}

.tux-cookie__message {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.tux-cookie__links {
  margin: 0;
  font-size: 0.8125rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.tux-cookie__expand-toggle {
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  font: inherit;
}

.tux-cookie__categories {
  padding: 0.625rem 0.75rem;
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.tux-cookie__categories-fallback {
  margin: 0;
  font-style: italic;
}

.tux-cookie__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
}

/* ── Transitions ──────────────────────────────────────────── */
.tux-cookie-enter-active,
.tux-cookie-leave-active {
  transition: opacity var(--motion-base) var(--ease-standard),
              transform var(--motion-base) var(--ease-emphasis);
}
.tux-cookie-enter-from,
.tux-cookie-leave-to {
  opacity: 0;
  transform: translateY(0.75rem);
}
</style>
