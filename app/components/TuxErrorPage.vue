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
type ErrorCode = "404" | "500" | "403" | "401" | "503" | (string & {});

interface Action {
  label: string;
  to?: string;
  href?: string;
  intent?: "primary" | "secondary" | "ghost";
  icon?: string;
  onClick?: (event: MouseEvent) => void;
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
  /** Technical details or stack trace for debugging. */
  details?: string;
}

const props = withDefaults(defineProps<Props>(), {
  code: "404",
  title: undefined,
  lede: undefined,
  actions: undefined,
  inline: false,
  icon: undefined,
  details: undefined,
});

const defaults: Record<string, { title: string; lede: string; icon: string; actions: Action[] }> = {
  "404": {
    title: "Page Not Found",
    lede: "The requested route has moved, been retired, or never existed in the TUX ecosystem. Use the links below to return to safety or search the catalog.",
    icon: "lucide:compass",
    actions: [
      { label: "Return to Home", to: "/", intent: "primary", icon: "lucide:home" },
      { label: "Browse Component Lab", to: "/components", intent: "secondary", icon: "lucide:blocks" },
    ],
  },
  "401": {
    title: "Authentication Required",
    lede: "Your session has expired or requires valid TTI credentials to proceed.",
    icon: "lucide:shield-alert",
    actions: [
      { label: "Sign in with TTI Account", to: "/login", intent: "primary", icon: "lucide:log-in" },
      { label: "Return to Home", to: "/", intent: "ghost", icon: "lucide:home" },
    ],
  },
  "403": {
    title: "Access Forbidden",
    lede: "Your account does not have permission to access this resource. Contact your division administrator or TTI IT support.",
    icon: "lucide:lock",
    actions: [
      { label: "Request Access", href: "mailto:helpdesk@tti.tamu.edu?subject=Access%20Request", intent: "primary", icon: "lucide:mail" },
      { label: "Return to Home", to: "/", intent: "ghost", icon: "lucide:home" },
    ],
  },
  "500": {
    title: "Internal System Error",
    lede: "An unexpected server condition halted this request. Automated telemetry has recorded this exception for the TTI DevOps team. Try refreshing the page.",
    icon: "lucide:server-crash",
    actions: [
      { label: "Reload Page", href: "javascript:window.location.reload()", intent: "primary", icon: "lucide:refresh-cw" },
      { label: "Check System Health", to: "/components/health", intent: "secondary", icon: "lucide:activity" },
    ],
  },
  "503": {
    title: "Service Under Scheduled Maintenance",
    lede: "The requested service is temporarily offline for scheduled system upgrades and database migrations. All data remains secure and service will restore shortly.",
    icon: "lucide:wrench",
    actions: [
      { label: "Check System Health", to: "/components/health", intent: "primary", icon: "lucide:activity" },
      { label: "Return to Home", to: "/", intent: "ghost", icon: "lucide:home" },
    ],
  },
};

const fallback: { title: string; lede: string; icon: string; actions: Action[] } = {
  title: "Something Unexpected Happened",
  lede: "An unhandled condition interrupted this page. Please return home or contact TTI Help Desk if the problem persists.",
  icon: "lucide:circle-alert",
  actions: [
    { label: "Return to Home", to: "/", intent: "primary", icon: "lucide:home" },
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
      <TuxSpectrumRibbon height="sm" class="mb-6 rounded-none shadow-xs" />

      <div class="tux-error-page__medallion" aria-hidden="true">
        <UIcon :name="resolvedIcon" class="tux-error-page__icon" />
      </div>

      <p class="eyebrow tux-error-page__eyebrow">system response</p>
      <p class="tux-error-page__code" aria-hidden="true">{{ code }}</p>

      <h1 class="heading--bold tux-error-page__title">{{ resolvedTitle }}</h1>
      <span class="tux-error-page__rule" aria-hidden="true" />
      <p class="tux-error-page__lede">{{ resolvedLede }}</p>

      <div v-if="resolvedActions.length" class="tux-error-page__actions">
        <TuxButton
          v-for="(a, i) in resolvedActions"
          :key="i"
          :to="a.to"
          :href="a.href"
          :intent="a.intent ?? (i === 0 ? 'primary' : 'ghost')"
          :icon="a.icon"
          shape="sharp"
          @click="a.onClick ? a.onClick($event) : undefined"
        >
          {{ a.label }}
        </TuxButton>
      </div>

      <div v-if="details" class="mt-6 text-left p-3 rounded-none bg-surface-sunken border border-surface-border text-xs font-mono text-text-muted overflow-x-auto">
        <p class="font-bold text-text-secondary mb-1">Diagnostic Details:</p>
        <pre class="m-0 whitespace-pre-wrap">{{ details }}</pre>
      </div>

      <div v-if="$slots.support" class="tux-error-page__support">
        <slot name="support" />
      </div>
      <div v-else class="tux-error-page__support">
        <p class="m-0 text-xs text-text-muted">
          Need assistance? Contact <a href="mailto:helpdesk@tti.tamu.edu" class="text-brand-primary underline font-medium">TTI Help Desk</a> (979-317-2000) or check the <NuxtLink to="/components/health" class="text-brand-primary underline">Component Health Matrix</NuxtLink>.
        </p>
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
  box-sizing: border-box;
  width: 100%;
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
  background: var(--wash-brand-8);
  border: 1px solid var(--wash-brand-22);
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
  font-family: var(--font-display);
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
