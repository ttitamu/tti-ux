<script setup lang="ts">
// TuxDiagram — Mermaid wrapper for diagrams-as-code.
//
// Architecture diagrams, flowcharts, sequence diagrams, ERDs, gantt.
// Mermaid is ~3MB; this component delegates to the `useTuxMermaid`
// singleton so all diagrams on a page share one import + one
// initialize() call. Render still happens client-side (Mermaid is
// DOM-dependent), but **SSR reserves the estimated height** so the
// client-side commit doesn't trigger a layout shift.
//
// Theme tracks page color-mode. Brand palette is mapped into
// Mermaid's themeVariables in the composable.

interface Props {
  /** Mermaid source. Required. */
  code: string;
  /** Optional caption shown below the rendered diagram (figcaption). */
  caption?: string;
  /** Optional eyebrow above the diagram (e.g. "Figure 3"). */
  eyebrow?: string;
}

const props = withDefaults(defineProps<Props>(), {
  caption: undefined,
  eyebrow: undefined,
});

const colorMode = useColorMode();
const { render: renderMermaid, estimateHeight } = useTuxMermaid();
const svg = ref<string | null>(null);
const error = ref<string | null>(null);
const renderId = ref(0);

const instanceId = useId();

const mermaidTheme = computed<"default" | "dark">(() =>
  colorMode.value === "tti-dark" ? "dark" : "default"
);

// Reserved height — emitted at SSR + during the brief window before
// the client-side render commits. Prevents the layout shift from a
// "Rendering…" placeholder collapsing to a 400px diagram.
const reservedHeight = computed(() => estimateHeight(props.code));

async function doRender() {
  error.value = null;
  const id = ++renderId.value;

  try {
    const result = await renderMermaid(props.code, {
      id: `tux-diagram-${instanceId}-${id}`,
      theme: mermaidTheme.value,
    });
    if (id !== renderId.value) return;
    if (result) svg.value = result;
  } catch (e) {
    if (id !== renderId.value) return;
    error.value = e instanceof Error ? e.message : String(e);
    svg.value = null;
  }
}

onMounted(doRender);

watch(
  () => [props.code, mermaidTheme.value],
  () => doRender(),
);
</script>

<template>
  <figure class="tux-diagram">
    <p v-if="eyebrow" class="tux-diagram__eyebrow">{{ eyebrow }}</p>

    <div
      class="tux-diagram__canvas"
      :class="{ 'tux-diagram__canvas--error': error }"
      :style="!svg && !error ? { minHeight: `${reservedHeight}px` } : {}"
    >
      <div v-if="svg" v-html="svg" class="tux-diagram__svg" />
      <div v-else-if="error" class="tux-diagram__error">
        <Icon name="lucide:triangle-alert" class="tux-diagram__error-icon" aria-hidden="true" />
        <div>
          <p class="tux-diagram__error-title">Diagram failed to render</p>
          <pre class="tux-diagram__error-message">{{ error }}</pre>
        </div>
      </div>
      <!-- Reserved-space skeleton: estimated height + dimmed icon. No
           "Rendering…" copy — the visual gap conveys the same thing
           without a layout-shift candidate text node. -->
      <div v-else class="tux-diagram__skeleton" aria-busy="true" aria-label="Rendering diagram">
        <Icon name="lucide:workflow" class="tux-diagram__skeleton-icon" aria-hidden="true" />
      </div>
    </div>

    <figcaption v-if="caption" class="tux-diagram__caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.tux-diagram {
  container-type: inline-size;
  container-name: tux-diagram;
  margin: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tux-diagram__eyebrow {
  margin: 0;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--brand-primary);
}

.tux-diagram__canvas {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 8rem;
  padding: 1.5rem;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow-x: auto;
}

.tux-diagram__canvas--error {
  background: color-mix(in srgb, var(--color-error) 4%, var(--surface-raised));
  border-color: color-mix(in srgb, var(--color-error) 50%, var(--surface-border));
  align-items: flex-start;
}

.tux-diagram__svg {
  max-width: 100%;
}

.tux-diagram__svg :deep(svg) {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Skeleton fills the reserved-height container with a quiet pulse —
   no text, no spinner. Just enough motion to signal "loading" without
   competing with the diagram about to land. */
.tux-diagram__skeleton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: inherit;
}

.tux-diagram__skeleton-icon {
  width: 2rem;
  height: 2rem;
  color: var(--text-muted);
  opacity: 0.3;
  animation: tux-diagram-pulse 1.5s ease-in-out infinite;
}

@keyframes tux-diagram-pulse {
  0%, 100% { opacity: 0.2; }
  50%      { opacity: 0.4; }
}

@media (prefers-reduced-motion: reduce) {
  .tux-diagram__skeleton-icon { animation: none; }
}

.tux-diagram__error {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  font-family: var(--font-body);
  width: 100%;
}

.tux-diagram__error-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-error);
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.tux-diagram__error-title {
  margin: 0 0 0.375rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--color-error);
}

.tux-diagram__error-message {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: pre-wrap;
  word-break: break-word;
}

.tux-diagram__caption {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--text-muted);
  text-align: center;
  max-width: 36rem;
  margin: 0 auto;
  line-height: 1.5;
}
</style>
