<script setup lang="ts">
// TuxCodeMaroon — institutional emergency alert banner.
//
// TAMU's Code Maroon is TAMUS's mandatory emergency-notification
// system. Rellis Campus (where TTI lives) routes through
// https://rellis.tamus.edu/emergency/ — same system, RELLIS-scoped
// alerts. When an alert is active, this banner pins to the top of
// every page (above all other chrome) until the user explicitly
// dismisses it (when allowed) or the alert clears upstream.
//
// **This banner doesn't theme.** Code Maroon is system-wide safety
// messaging, not a brand surface. Severity colors (alert / warning /
// info) are hard-coded — they don't honor `data-theme="tti-dark"` or
// `tti-hc`. Visual recognition matters more than palette consistency
// during emergencies.
//
// Wiring: pass `:active="false"` when no alert. Mount the banner
// above your site header. Real consumers will fetch alert state from
// the institutional feed (Rellis API, Code Maroon RSS, etc.) and
// drive `active` + `message` from that.

interface Props {
  /** Show the banner. Drive from your alert feed. Defaults to false
   *  so an unconfigured banner renders nothing. */
  active?: boolean;
  /** Severity color. `alert` (red, urgent), `warning` (amber, advisory),
   *  `info` (navy, informational). */
  severity?: "alert" | "warning" | "info";
  /** Short title — e.g. "Emergency alert" or "Code Maroon active". */
  title?: string;
  /** The alert message. Required when active. */
  message?: string;
  /** Link to the full alert page. Defaults to the Rellis emergency
   *  portal — override for non-Rellis consumers. */
  detailsUrl?: string;
  /** Link text. */
  detailsLabel?: string;
  /** Show a dismiss button. Defaults to false — emergency messages
   *  are non-dismissible by institutional convention. */
  dismissible?: boolean;
  /** v-model: dismissal state when `dismissible` is true. */
  modelValue?: boolean;
  /** Fixed position at the top of the viewport. */
  sticky?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  severity: "alert",
  title: "Emergency alert",
  message: undefined,
  detailsUrl: "https://rellis.tamus.edu/emergency/",
  detailsLabel: "View details",
  dismissible: false,
  modelValue: false,
  sticky: false,
});

const emit = defineEmits<{
  "update:modelValue": [dismissed: boolean];
  dismiss: [];
}>();

const dismissed = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v),
});

const visible = computed(() => props.active && !dismissed.value);

function onDismiss() {
  dismissed.value = true;
  emit("dismiss");
}

const severityIcon = computed(() => {
  if (props.severity === "warning") return "lucide:triangle-alert";
  if (props.severity === "info")    return "lucide:info";
  return "lucide:siren";
});
</script>

<template>
  <Transition name="tux-codemaroon">
    <aside
      v-if="visible"
      class="tux-codemaroon"
      :class="[
        `tux-codemaroon--${severity}`,
        { 'tux-codemaroon--sticky': sticky },
      ]"
      role="alert"
      aria-live="assertive"
    >
      <div class="tux-codemaroon__inner">
        <Icon
          :name="severityIcon"
          class="tux-codemaroon__icon"
          aria-hidden="true"
        />
        <div class="tux-codemaroon__copy">
          <span class="tux-codemaroon__title">{{ title }}</span>
          <span v-if="message" class="tux-codemaroon__message">{{ message }}</span>
        </div>
        <a
          v-if="detailsUrl"
          :href="detailsUrl"
          target="_blank"
          rel="noopener"
          class="tux-codemaroon__details"
        >
          {{ detailsLabel }}
          <Icon name="lucide:arrow-up-right" class="tux-codemaroon__details-icon" aria-hidden="true" />
        </a>
        <button
          v-if="dismissible"
          type="button"
          class="tux-codemaroon__dismiss"
          aria-label="Dismiss alert"
          @click="onDismiss"
        >
          <Icon name="lucide:x" aria-hidden="true" />
        </button>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.tux-codemaroon {
  container-type: inline-size;
  container-name: tux-codemaroon;
  width: 100%;
  font-family: var(--font-bold);
  /* Hard-coded colors — emergency messaging doesn't theme. Same
     red/amber/navy regardless of light/dark/hc mode. */
}

.tux-codemaroon--sticky {
  position: sticky;
  top: 0;
  z-index: 50;
}

.tux-codemaroon--alert {
  background: #b3261e;
  color: #fff;
}

.tux-codemaroon--warning {
  background: #c47800;
  color: #fff;
}

.tux-codemaroon--info {
  background: #15457e;
  color: #fff;
}

.tux-codemaroon__inner {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1.25rem;
  max-width: 80rem;
  margin: 0 auto;
}

@container tux-codemaroon (max-width: 36rem) {
  .tux-codemaroon__inner {
    flex-wrap: wrap;
    gap: 0.5rem 0.75rem;
  }
}

.tux-codemaroon__icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  /* Subtle pulse so the icon catches the eye even when the message
     wraps. Slow enough that it doesn't trigger vestibular issues. */
  animation: tux-codemaroon-pulse 2s ease-in-out infinite;
}

.tux-codemaroon--info .tux-codemaroon__icon {
  animation: none;
}

@keyframes tux-codemaroon-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.7; transform: scale(1.08); }
}

@media (prefers-reduced-motion: reduce) {
  .tux-codemaroon__icon { animation: none; }
}

.tux-codemaroon__copy {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 0.625rem;
  min-width: 0;
}

.tux-codemaroon__title {
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  flex-shrink: 0;
}

.tux-codemaroon__message {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.4;
}

.tux-codemaroon__details {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #fff;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
  transition: text-decoration-color 0.15s ease, gap 0.15s ease;
}

.tux-codemaroon__details:hover,
.tux-codemaroon__details:focus-visible {
  text-decoration-color: currentColor;
  gap: 0.5rem;
  outline: none;
}

.tux-codemaroon__details-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.tux-codemaroon__dismiss {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  background: transparent;
  border: 0;
  color: #fff;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background-color 0.15s ease;
}

.tux-codemaroon__dismiss:hover,
.tux-codemaroon__dismiss:focus-visible {
  background: rgba(255, 255, 255, 0.18);
  outline: none;
}

.tux-codemaroon__dismiss :deep(svg) {
  width: 1rem;
  height: 1rem;
}

/* Transition — slides down from the top. */
.tux-codemaroon-enter-active,
.tux-codemaroon-leave-active {
  transition: transform 0.25s ease, opacity 0.2s ease;
}

.tux-codemaroon-enter-from,
.tux-codemaroon-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .tux-codemaroon-enter-active,
  .tux-codemaroon-leave-active {
    transition: opacity 0.1s linear;
  }
  .tux-codemaroon-enter-from,
  .tux-codemaroon-leave-to {
    transform: none;
  }
}
</style>
