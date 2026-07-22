<script setup lang="ts">
/**
 * TuxErrorPage — full-page error template for 404 / 500 / 403 / 503
 * scenarios. Renders an editorial header (status code in display
 * type, title, lede), an icon medallion, recovery actions, and an
 * optional support / status-page link block. Designed to be the
 * `error.vue` Nuxt route for consuming apps and to be usable
 * inline (e.g. inside a content area) via the `inline` prop.
 *
 * Variants:
 *   - `code="404"` — not-found. Default actions: home + back.
 *   - `code="500"` — server error. Default actions: retry + status page.
 *   - `code="403"` — forbidden. Default actions: sign-in + home.
 *   - `code="503"` — maintenance. Default actions: status page only.
 *   - `code` set to anything else — generic error template.
 *
 * Props give defaults; slots override anything for app-specific copy.
 * The status-code numeral is rendered in display type at editorial
 * scale — TTI uses this rhythm on tti.tamu.edu's error templates.
 */
type ErrorCode = "404" | "500" | "403" | "503" | (string & {});

interface Action {
  label: string;
  to?: string;
  href?: string;
  intent?: "primary" | "secondary" | "ghost";
  icon?: string;
}

interface Props {
  code?: ErrorCode;
  title?: string;
  lede?: string;
  actions?: Action[];
  /** Render as an inline block (no full-page min-height). */
  inline?: boolean;
  /** Lucide icon for the medallion. Defaults are per-code. */
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  code: "404",
  title: undefined,
  lede: undefined,
  actions: undefined,
  inline: false,
  icon: undefined,
});

const defaults: Record<string, { title: string; lede: string; icon: string; actions: Action[] }> = {
  "404": {
    title: "Page not found",
    lede: "The page you're looking for has moved, been retired, or never existed. The links below should get you back on track.",
    icon: "lucide:compass",
    actions: [
      { label: "Back to home", to: "/", intent: "primary", icon: "lucide:home" },
      { label: "Go back", to: "#back", intent: "ghost", icon: "lucide:arrow-left" },
    ],
  },
  "500": {
    title: "Something went wrong on our end",
    lede: "An unexpected error stopped this page from loading. The team has been notified. Try again in a minute, or check the status page if it persists.",
    icon: "lucide:server-crash",
    actions: [
      { label: "Try again", to: "#retry", intent: "primary", icon: "lucide:refresh-cw" },
      { label: "Status page", href: "https://status.tti.tamu.edu", intent: "secondary", icon: "lucide:activity" },
    ],
  },
  "403": {
    title: "You don't have access to this page",
    lede: "Your TAMUS account doesn't have permission for this resource. Sign in with a different account, or request access from the resource owner.",
    icon: "lucide:lock",
    actions: [
      { label: "Sign in", to: "/sign-in", intent: "primary", icon: "lucide:log-in" },
      { label: "Back to home", to: "/", intent: "ghost", icon: "lucide:home" },
    ],
  },
  "503": {
    title: "Down for maintenance",
    lede: "We're upgrading the system. Service will be back shortly. Check the status page for the latest.",
    icon: "lucide:hard-hat",
    actions: [
      { label: "Status page", href: "https://status.tti.tamu.edu", intent: "primary", icon: "lucide:activity" },
    ],
  },
};

const fallback: { title: string; lede: string; icon: string; actions: Action[] } = {
  title: "Something unexpected happened",
  lede: "An error stopped this page from loading. Try the home page or contact support if the problem persists.",
  icon: "lucide:circle-alert",
  actions: [
    { label: "Back to home", to: "/", intent: "primary", icon: "lucide:home" },
  ],
};

const preset = computed(() => defaults[String(props.code)] ?? fallback);
const resolvedTitle = computed(() => props.title ?? preset.value.title);
const resolvedLede = computed(() => props.lede ?? preset.value.lede);
const resolvedIcon = computed(() => props.icon ?? preset.value.icon);
const resolvedActions = computed(() => props.actions ?? preset.value.actions);
</script>

<template>
  <section
    class="tux-error-page"
    :class="{ 'tux-error-page--inline': inline }"
    role="alert"
    aria-live="polite"
  >
    <div class="tux-error-page__inner">
      <div class="tux-error-page__medallion" aria-hidden="true">
        <UIcon :name="resolvedIcon" class="tux-error-page__icon" />
      </div>

      <p class="eyebrow tux-error-page__eyebrow">error</p>
      <p class="tux-error-page__code" aria-hidden="true">{{ code }}</p>

      <h1 class="heading--bold tux-error-page__title">{{ resolvedTitle }}</h1>
      <p class="tux-error-page__lede">{{ resolvedLede }}</p>

      <div v-if="resolvedActions.length" class="tux-error-page__actions">
        <TuxButton
          v-for="(a, i) in resolvedActions"
          :key="i"
          :to="a.to"
          :href="a.href"
          :intent="a.intent ?? (i === 0 ? 'primary' : 'ghost')"
          :icon="a.icon"
        >
          {{ a.label }}
        </TuxButton>
      </div>

      <div v-if="$slots.support" class="tux-error-page__support">
        <slot name="support" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.tux-error-page {
  container-type: inline-size;
  container-name: tux-error-page;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 3rem 1.5rem;
  text-align: center;
  background: var(--surface-page);
}

.tux-error-page--inline {
  min-height: 0;
  padding: 2.5rem 1.5rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
}

.tux-error-page__inner {
  max-width: 36rem;
  width: 100%;
}

.tux-error-page__medallion {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--brand-primary) 22%, transparent);
  margin-bottom: 1rem;
}

.tux-error-page__icon {
  width: 2rem;
  height: 2rem;
  color: var(--brand-primary);
}

.tux-error-page__eyebrow {
  margin: 0;
}

.tux-error-page__code {
  margin: 0.25rem 0 0.625rem;
  font-family: var(--font-display, var(--font-bold));
  font-size: clamp(3.5rem, 6cqw + 2rem, 5.5rem);
  line-height: 0.9;
  color: var(--brand-primary);
  letter-spacing: -0.02em;
}

.tux-error-page__title {
  margin: 0 0 0.625rem;
  font-size: clamp(1.5rem, 2cqw + 1rem, 2rem);
  line-height: 1.15;
}

.tux-error-page__lede {
  margin: 0 0 1.5rem;
  font-size: 1rem;
  line-height: 1.55;
  color: var(--text-secondary);
}

.tux-error-page__actions {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.625rem;
}

.tux-error-page__support {
  margin-top: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--surface-border);
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.55;
}
</style>
