<script setup lang="ts">
/**
 * TuxVizRPlot — branded chrome around an R-language plot artifact.
 *
 * R workflows (RStudio, Quarto, ggplot2, plotly::ggplotly, R Markdown)
 * produce charts as one of three artifact types: a static raster (PNG /
 * JPG), a static vector (SVG), or an interactive widget (HTML). The
 * iframe wrapping that fits Tableau or Power BI doesn't fit here —
 * most R outputs aren't iframe URLs.
 *
 * This component normalizes the editorial frame across all three:
 *   - `kind="image"` → renders <img src> with optional retina <picture>
 *   - `kind="svg"`   → renders <object data> so the SVG stays
 *                       interactive (hover, links) but isolated
 *   - `kind="html"`  → sandboxed iframe to a self-contained htmlwidget
 *
 * The chrome includes an R chip + caption slot for the source script,
 * dataset, or `sessionInfo()` line. Use pre-rendered artifacts for
 * production — runtime R execution is out of scope; pair with
 * rserver / Plumber if you need live regen.
 */
type Kind = "image" | "svg" | "html";

interface Props {
  src: string;
  kind?: Kind;
  title: string;
  eyebrow?: string;
  /** CSS aspect-ratio. ggplot defaults assume 16/10 print; htmlwidgets often want 16/9. */
  ratio?: string;
  alt?: string;
  /** Optional retina src (2× resolution PNG). Only used when kind="image". */
  src2x?: string;
  /** What R produced this — shown in the caption gutter. */
  source?: string;
}

const props = withDefaults(defineProps<Props>(), {
  kind: "image",
  eyebrow: undefined,
  ratio: "16/10",
  alt: "",
  src2x: undefined,
  source: undefined,
});

const altText = computed(() => props.alt || props.title);
</script>

<template>
  <figure class="tux-viz-rplot">
    <header class="tux-viz-rplot__head">
      <div class="tux-viz-rplot__title-block">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h3 class="tux-viz-rplot__title">{{ title }}</h3>
      </div>
      <span class="tux-viz-rplot__chip" title="Rendered from R">
        <UIcon name="lucide:square-sigma" class="tux-viz-rplot__chip-icon" />
        R · {{ kind }}
      </span>
    </header>
    <div class="tux-viz-rplot__stage" :style="{ aspectRatio: ratio }">
      <img
        v-if="kind === 'image'"
        :src="src"
        :srcset="src2x ? `${src} 1x, ${src2x} 2x` : undefined"
        :alt="altText"
        loading="lazy"
        class="tux-viz-rplot__art"
      />
      <object
        v-else-if="kind === 'svg'"
        :data="src"
        type="image/svg+xml"
        :aria-label="altText"
        class="tux-viz-rplot__art"
      />
      <iframe
        v-else
        :src="src"
        :title="title"
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
        class="tux-viz-rplot__art"
      />
    </div>
    <figcaption v-if="source || $slots.caption" class="tux-viz-rplot__caption">
      <slot name="caption">
        <span class="tux-viz-rplot__source">{{ source }}</span>
      </slot>
    </figcaption>
  </figure>
</template>

<style scoped>
.tux-viz-rplot {
  margin: 0;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  overflow: hidden;
  container-type: inline-size;
  container-name: tux-viz-rplot;
}

.tux-viz-rplot__head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  border-bottom: 1px solid var(--surface-border);
  background: var(--surface-sunken);
}

.tux-viz-rplot__title-block {
  flex: 1;
  min-width: 0;
}

.tux-viz-rplot__title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tux-viz-rplot__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.1875rem 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--brand-secondary);
  background: color-mix(in srgb, var(--brand-secondary) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--brand-secondary) 22%, transparent);
  border-radius: var(--radius-sm);
}

.tux-viz-rplot__chip-icon {
  width: 0.8125rem;
  height: 0.8125rem;
}

.tux-viz-rplot__stage {
  position: relative;
  width: 100%;
  background: var(--neutral-0);
}

.tux-viz-rplot__art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
  object-fit: contain;
}

.tux-viz-rplot__caption {
  padding: 0.5rem 0.875rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
  border-top: 1px solid var(--surface-border);
  background: var(--surface-sunken);
}
</style>
