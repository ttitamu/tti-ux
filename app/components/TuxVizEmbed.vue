<script setup lang="ts">
/**
 * TuxVizEmbed — branded chrome around a third-party visualization
 * iframe. Wraps Tableau · Power BI · Apache Superset · Grafana ·
 * any URL.
 *
 * What this component is and isn't:
 *  - IS: an editorial wrapper (eyebrow · title · provider chip ·
 *    open-in-new affordance · loading state · error state) around a
 *    sandboxed iframe sized by aspect ratio. With `posterSrc` set, a
 *    static screenshot renders instead of the iframe — useful for
 *    style-guide demos and any context where the live BI tool isn't
 *    reachable.
 *  - IS NOT: an embedding SDK. Tableau and Power BI both ship JS
 *    SDKs with richer features (drill-down events, filter sync). Use
 *    this when an iframe URL is enough; reach for the SDK directly
 *    when you need bidirectional state.
 *
 * Per provider, a sensible default `sandbox` and `referrerpolicy`
 * are applied. Override either via props if your deployment needs
 * different posture.
 */
type Provider =
  | "tableau"
  | "powerbi"
  | "superset"
  | "grafana"
  | "generic";

interface Props {
  src: string;
  provider?: Provider;
  title: string;
  eyebrow?: string;
  /** CSS aspect-ratio. Tableau dashboards default to 16/10; BI tiles to 16/9. */
  ratio?: string;
  /** Override the iframe sandbox. Defaults are provider-specific. */
  sandbox?: string;
  referrerpolicy?: ReferrerPolicy;
  /** Show an "Open in <provider>" button that targets `src` in a new tab. */
  openInNew?: boolean;
  /** Static screenshot URL. When set, renders the poster instead of
   *  the iframe — useful when the live tenant isn't reachable. */
  posterSrc?: string;
  posterAlt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  provider: "generic",
  eyebrow: undefined,
  ratio: "16/9",
  sandbox: undefined,
  referrerpolicy: "strict-origin-when-cross-origin",
  openInNew: true,
  posterSrc: undefined,
  posterAlt: "",
});

const providerLabel: Record<Provider, string> = {
  tableau:  "Tableau",
  powerbi:  "Power BI",
  superset: "Apache Superset",
  grafana:  "Grafana",
  generic:  "External viz",
};

const providerIcon: Record<Provider, string> = {
  tableau:  "lucide:bar-chart-3",
  powerbi:  "lucide:pie-chart",
  superset: "lucide:line-chart",
  grafana:  "lucide:activity",
  generic:  "lucide:external-link",
};

const defaultSandbox: Record<Provider, string> = {
  tableau:  "allow-scripts allow-same-origin allow-popups allow-forms",
  powerbi:  "allow-scripts allow-same-origin allow-popups allow-forms",
  superset: "allow-scripts allow-same-origin allow-popups allow-forms",
  grafana:  "allow-scripts allow-same-origin allow-popups",
  generic:  "allow-scripts allow-same-origin",
};

const sandboxValue = computed(() => props.sandbox ?? defaultSandbox[props.provider]);

const loaded = ref(false);
const errored = ref(false);
const usePoster = computed(() => !!props.posterSrc);

function onLoad() { loaded.value = true; }
function onError() { errored.value = true; loaded.value = true; }
</script>

<template>
  <figure class="tux-viz-embed">
    <header class="tux-viz-embed__head">
      <div class="tux-viz-embed__title-block">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h3 class="tux-viz-embed__title">{{ title }}</h3>
      </div>
      <span class="tux-viz-embed__chip">
        <UIcon :name="providerIcon[provider]" class="tux-viz-embed__chip-icon" />
        {{ providerLabel[provider] }}
      </span>
      <a
        v-if="openInNew"
        :href="src"
        target="_blank"
        rel="noopener noreferrer"
        class="tux-viz-embed__open"
      >
        <UIcon name="lucide:arrow-up-right" class="tux-viz-embed__open-icon" />
        Open
      </a>
    </header>
    <div class="tux-viz-embed__stage" :style="{ aspectRatio: ratio }">
      <img
        v-if="usePoster"
        :src="posterSrc"
        :alt="posterAlt || title"
        loading="lazy"
        class="tux-viz-embed__poster"
      />
      <template v-else>
        <iframe
          :src="src"
          :title="title"
          :sandbox="sandboxValue"
          :referrerpolicy="referrerpolicy"
          loading="lazy"
          allowfullscreen
          class="tux-viz-embed__iframe"
          @load="onLoad"
          @error="onError"
        />
        <div v-if="!loaded" class="tux-viz-embed__veil" aria-hidden="true">
          <UIcon name="lucide:loader-circle" class="tux-viz-embed__spinner" />
          <span>Loading {{ providerLabel[provider] }}…</span>
        </div>
        <div v-if="errored" class="tux-viz-embed__veil tux-viz-embed__veil--error">
          <UIcon name="lucide:alert-triangle" class="tux-viz-embed__spinner" />
          <span>Couldn't load this viz. Open it directly →</span>
        </div>
      </template>
    </div>
    <figcaption v-if="$slots.caption" class="tux-viz-embed__caption">
      <slot name="caption" />
    </figcaption>
  </figure>
</template>

<style scoped>
.tux-viz-embed {
  margin: 0;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  overflow: hidden;
  container-type: inline-size;
  container-name: tux-viz-embed;
}

.tux-viz-embed__head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  border-bottom: 1px solid var(--surface-border);
  background: var(--surface-sunken);
}

.tux-viz-embed__title-block {
  flex: 1;
  min-width: 0;
}

.tux-viz-embed__title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tux-viz-embed__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.1875rem 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--brand-primary) 22%, transparent);
  border-radius: var(--radius-sm);
}

.tux-viz-embed__chip-icon,
.tux-viz-embed__open-icon {
  width: 0.8125rem;
  height: 0.8125rem;
}

.tux-viz-embed__open {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: inherit;
  font-size: 0.76rem;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  transition: background var(--motion-fast) var(--ease-standard);
}

.tux-viz-embed__open:hover {
  background: var(--surface-border);
  color: var(--text-primary);
}

.tux-viz-embed__stage {
  position: relative;
  width: 100%;
  background: var(--surface-sunken);
}

.tux-viz-embed__iframe,
.tux-viz-embed__poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.tux-viz-embed__poster {
  object-fit: cover;
  background: var(--neutral-0);
}

.tux-viz-embed__veil {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: color-mix(in srgb, var(--surface-sunken) 92%, transparent);
  font-family: var(--font-mono);
  font-size: 0.76rem;
  color: var(--text-muted);
  pointer-events: none;
}

.tux-viz-embed__veil--error {
  pointer-events: auto;
  color: var(--color-error);
  background: var(--surface-raised);
}

.tux-viz-embed__spinner {
  width: 1.5rem;
  height: 1.5rem;
  animation: tux-viz-spin var(--motion-slow) linear infinite;
}

.tux-viz-embed__veil--error .tux-viz-embed__spinner {
  animation: none;
}

@keyframes tux-viz-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.tux-viz-embed__caption {
  padding: 0.625rem 0.875rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  border-top: 1px solid var(--surface-border);
}

@container tux-viz-embed (max-width: 480px) {
  .tux-viz-embed__chip span:not(.eyebrow),
  .tux-viz-embed__open span {
    display: none;
  }
}
</style>
