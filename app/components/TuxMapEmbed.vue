<script setup lang="ts">
/**
 * TuxMapEmbed — library-agnostic map embed wrapper.
 *
 * Wraps a Mapbox / Leaflet / MapLibre / Google Maps embed with
 * TUX brand chrome (eyebrow + caption + source citation) and a
 * skeleton placeholder while the iframe loads.
 *
 * Two embed modes:
 *   - **iframe** (default) — pass `src` to render a third-party
 *     map iframe. Works with Mapbox Studio embeds, Google Maps
 *     embed URLs, ArcGIS Online embeds, any embed-friendly map.
 *   - **slot** — render your own map in the default slot. Use
 *     when you've initialized a Mapbox GL / Leaflet / MapLibre
 *     map directly in Vue.
 *
 * Pairs with `TuxMapLegend` (positioned absolutely inside the
 * map surface via the #legend slot) and `TuxMapMarker` (for
 * library-agnostic marker styling).
 */
import { onMounted, ref } from "vue";

interface Props {
  /** Iframe src URL — required for iframe mode. */
  src?: string;
  /** Eyebrow above the title. */
  eyebrow?: string;
  /** Title shown above the map. */
  title?: string;
  /** Subtitle / dek shown between title and map. */
  subtitle?: string;
  /** Source citation shown beneath the map (matches TuxChartFrame). */
  source?: string;
  /** Aspect ratio for the map surface. Default "16/9"; "4/3" for
   *  denser data maps, "21/9" for cinematic corridor strips. */
  aspect?: "16/9" | "4/3" | "21/9" | "1/1" | "auto";
  /** Render height in px (overrides aspect when set). */
  height?: number;
  /** Title for the iframe (a11y). Default falls back to `title`. */
  iframeTitle?: string;
  /** Allow attribution (Mapbox / Google / etc) — kept on for legal
   *  reasons; toggle off only when you have a custom attribution
   *  in the legend slot. */
  attribution?: boolean;
  /** Show the loading skeleton while the iframe loads. */
  skeleton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  src: undefined,
  eyebrow: undefined,
  title: undefined,
  subtitle: undefined,
  source: undefined,
  aspect: "16/9",
  height: undefined,
  iframeTitle: undefined,
  attribution: true,
  skeleton: true,
});

const loaded = ref(false);
const iframeEl = ref<HTMLIFrameElement | null>(null);

onMounted(() => {
  // If the iframe already loaded before mount (same-origin cached
  // navigation), reflect that. For cross-origin maps (the common case)
  // contentDocument is null and we'll wait for the `load` template
  // handler instead.
  if (iframeEl.value?.contentDocument?.readyState === "complete") {
    loaded.value = true;
  }
});

const surfaceStyle = computed(() => {
  if (props.height) return { height: `${props.height}px` };
  if (props.aspect === "auto") return {};
  return { aspectRatio: props.aspect };
});
</script>

<template>
  <figure class="tux-map-embed">
    <header v-if="eyebrow || title || subtitle" class="tux-map-embed__header">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h3 v-if="title" class="tux-map-embed__title">{{ title }}</h3>
      <p v-if="subtitle" class="tux-map-embed__subtitle">{{ subtitle }}</p>
    </header>

    <div class="tux-map-embed__surface" :style="surfaceStyle">
      <div
        v-if="skeleton && !loaded && src"
        class="tux-map-embed__skeleton"
        aria-hidden="true"
      >
        <Icon name="lucide:map" :size="32" />
        <p>Loading map…</p>
      </div>

      <iframe
        v-if="src"
        ref="iframeEl"
        :src="src"
        :title="iframeTitle || title || 'Map'"
        class="tux-map-embed__iframe"
        :class="{ 'tux-map-embed__iframe--loaded': loaded }"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups"
        @load="loaded = true"
      />
      <slot v-else />

      <!-- Optional in-surface overlay — legend, controls, etc. -->
      <div v-if="$slots.legend" class="tux-map-embed__legend">
        <slot name="legend" />
      </div>
      <div v-if="$slots.controls" class="tux-map-embed__controls">
        <slot name="controls" />
      </div>
    </div>

    <figcaption v-if="source || $slots.source || $slots.caption" class="tux-map-embed__caption">
      <slot name="caption" />
      <p v-if="source && !$slots.source" class="tux-map-embed__source">{{ source }}</p>
      <slot name="source" />
    </figcaption>
  </figure>
</template>

<style scoped>
.tux-map-embed {
  margin: 1.5rem 0;
  font-family: var(--font-sans);
}

.tux-map-embed__header {
  margin-bottom: 0.625rem;
}

.tux-map-embed__title {
  font-family: var(--font-display, var(--font-sans));
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.2;
}

.tux-map-embed__subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0.25rem 0 0 0;
}

.tux-map-embed__surface {
  position: relative;
  width: 100%;
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.tux-map-embed__skeleton {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--surface-sunken);
  color: var(--text-muted);
  font-size: 0.8125rem;
  z-index: 1;
}

.tux-map-embed__iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
  opacity: 0;
  transition: opacity 200ms ease-out;
}

.tux-map-embed__iframe--loaded {
  opacity: 1;
  position: relative;
  z-index: 2;
}

.tux-map-embed__legend {
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  z-index: 3;
  pointer-events: auto;
}

.tux-map-embed__controls {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  pointer-events: auto;
}

.tux-map-embed__caption {
  margin: 0.625rem 0 0 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.tux-map-embed__source {
  font-style: italic;
  color: var(--text-muted);
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .tux-map-embed__iframe {
    transition: none;
  }
}
</style>
