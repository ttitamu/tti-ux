<script setup lang="ts">
// TuxCaptionedMedia — single image + caption + credit.
//
// The structured way to embed a photograph or video frame inline in body
// content. Provides:
//   - controlled aspect ratio (16:9 default; 1:1, 4:3, 3:4 available)
//   - caption + credit rhythm matching the institutional editorial style
//   - optional eyebrow above the caption (figure number, section tag)
//   - alignment options for column-flowing prose (full / wide / right)
//
// For galleries (multiple images at once), use `TuxPhotoGrid`. For an
// embedded video player, use plain `<iframe>` inside this component's
// `#media` slot — the wrapper handles aspect ratio.

interface Props {
  /** Image URL. If omitted, renders a labeled placeholder. */
  src?: string;
  /** Alt text. Required when `src` is set. */
  alt?: string;
  /** Caption — body of the figcaption. */
  caption?: string;
  /** Credit line — italic, smaller. Renders after the caption. */
  credit?: string;
  /** Optional eyebrow above the caption (e.g. "Figure 3", "On site"). */
  eyebrow?: string;
  /** Aspect ratio. */
  aspect?: "16/9" | "4/3" | "1/1" | "3/4";
  /** Width treatment in flowing prose. `full` (default) spans the column;
   *  `wide` breaks out beyond the column on wider viewports; `right`
   *  floats half-width to the right (text wraps left). */
  align?: "full" | "wide" | "right";
  /** Placeholder gradient tone. Used when `src` is omitted. */
  tone?: "maroon" | "gold" | "charcoal";
}

withDefaults(defineProps<Props>(), {
  src: undefined,
  alt: "",
  caption: undefined,
  credit: undefined,
  eyebrow: undefined,
  aspect: "16/9",
  align: "full",
  tone: "maroon",
});
</script>

<template>
  <figure
    class="tux-captioned-media"
    :class="[`tux-captioned-media--${align}`]"
    :style="{ '--tux-cm-aspect': aspect }"
  >
    <div class="tux-captioned-media__frame">
      <slot name="media">
        <img
          v-if="src"
          :src="src"
          :alt="alt"
          class="tux-captioned-media__img"
          loading="lazy"
        >
        <div
          v-else
          class="tux-captioned-media__placeholder"
          :class="`tux-captioned-media__placeholder--${tone}`"
          :aria-label="alt || 'placeholder'"
          role="img"
        >
          <span class="tux-captioned-media__placeholder-label">{{ alt || 'placeholder' }}</span>
        </div>
      </slot>
    </div>

    <figcaption v-if="caption || credit || eyebrow" class="tux-captioned-media__caption">
      <span v-if="eyebrow" class="tux-captioned-media__eyebrow">{{ eyebrow }}</span>
      <span v-if="caption" class="tux-captioned-media__text">{{ caption }}</span>
      <span v-if="credit" class="tux-captioned-media__credit">{{ credit }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.tux-captioned-media {
  margin: 1.75rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Width treatments
   ---------------------------------------------------------------
   Note on responsive strategy: every other tux component uses
   container queries so it responds to its own width. These three
   alignment modes are different — they're page-layout-aware
   breakouts that need to know the article column's width, not the
   figure's own. `wide` extends with negative margins (breaks the
   column); `right` floats half the column with text wrap. Both
   require a guarantee about the surrounding column, which container
   queries can't give us cleanly. So we keep viewport queries here
   and pick breakpoints that match common article column widths
   (typical marketing body = max-w-3xl ≈ 48rem, max-w-4xl ≈ 56rem,
   max-w-5xl ≈ 64rem). Adjust if your consumer uses a different
   column width. */
.tux-captioned-media--full {
  width: 100%;
}

.tux-captioned-media--wide {
  width: 100%;
}
@media (min-width: 60rem) {
  .tux-captioned-media--wide {
    width: calc(100% + 8rem);
    margin-left: -4rem;
    margin-right: -4rem;
  }
}

.tux-captioned-media--right {
  width: 100%;
}
@media (min-width: 48rem) {
  .tux-captioned-media--right {
    float: right;
    width: 50%;
    margin: 0.25rem 0 1rem 1.5rem;
    max-width: 22rem;
  }
}

/* Frame */
.tux-captioned-media__frame {
  width: 100%;
  aspect-ratio: var(--tux-cm-aspect, 16/9);
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
}

.tux-captioned-media__frame :deep(iframe),
.tux-captioned-media__frame :deep(video) {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.tux-captioned-media__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.tux-captioned-media__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  padding: 1.25rem;
  color: rgba(255, 255, 255, 0.85);
}

.tux-captioned-media__placeholder--maroon {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-deep));
}
.tux-captioned-media__placeholder--gold {
  background: linear-gradient(135deg, var(--brand-accent), #A87B1F);
  color: #2A0E15;
}
.tux-captioned-media__placeholder--charcoal {
  background: linear-gradient(135deg, #3a3a3a, #1f1f1f);
}

.tux-captioned-media__placeholder-label {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  opacity: 0.85;
}

/* Caption */
.tux-captioned-media__caption {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  line-height: 1.5;
  max-width: 36rem;
}

.tux-captioned-media--right .tux-captioned-media__caption {
  font-size: 0.8125rem;
}

.tux-captioned-media__eyebrow {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--brand-primary);
}

.tux-captioned-media__text {
  color: var(--text-primary);
}

.tux-captioned-media__credit {
  font-style: italic;
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
