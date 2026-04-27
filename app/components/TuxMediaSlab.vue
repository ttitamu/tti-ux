<script setup lang="ts">
// TuxMediaSlab — full-bleed hero band.
//
// The "big photo moment" — an edge-to-edge image, a single headline, and
// minimal copy. Used at the top of feature pages, between major sections,
// or as the first impression on a research-program landing.
//
// Two compositions:
//   - overlay (default) — copy sits on top of the image, dimmed gradient
//                         for legibility. Drama-forward.
//   - split             — image left, copy right (or right/left swap).
//                         More editorial, easier to read on long copy.
//
// For a band of multiple cards (not a single hero), use `<TuxCardSlab>`.

interface Props {
  /** Image URL. Omit for a tone-keyed gradient placeholder. */
  src?: string;
  /** Alt text. Required when `src` is set. */
  alt?: string;
  /** Eyebrow above the title — small tracked-out label. */
  eyebrow?: string;
  /** Headline. Required. */
  title: string;
  /** 1–2 sentence dek. */
  dek?: string;
  /** Composition. */
  layout?: "overlay" | "split";
  /** When `layout="split"`, which side does the image go on? */
  imageSide?: "left" | "right";
  /** Slab height — `tall` (32rem), `standard` (24rem, default), `short` (16rem). */
  height?: "tall" | "standard" | "short";
  /** Placeholder gradient tone when `src` is omitted. */
  tone?: "maroon" | "gold" | "charcoal";
}

const props = withDefaults(defineProps<Props>(), {
  src: undefined,
  alt: "",
  eyebrow: undefined,
  dek: undefined,
  layout: "overlay",
  imageSide: "right",
  height: "standard",
  tone: "maroon",
});

defineSlots<{
  /** Action area — buttons, link list, etc. Renders below the dek. */
  actions?: () => unknown;
}>();
</script>

<template>
  <section
    class="tux-media-slab"
    :class="[
      `tux-media-slab--${layout}`,
      `tux-media-slab--height-${height}`,
      layout === 'split' ? `tux-media-slab--image-${imageSide}` : '',
    ]"
  >
    <div class="tux-media-slab__media">
      <img
        v-if="src"
        :src="src"
        :alt="alt"
        class="tux-media-slab__img"
        loading="lazy"
      >
      <div
        v-else
        class="tux-media-slab__placeholder"
        :class="`tux-media-slab__placeholder--${tone}`"
        :aria-label="alt || 'placeholder'"
        role="img"
      />
    </div>

    <div class="tux-media-slab__copy">
      <p v-if="eyebrow" class="tux-media-slab__eyebrow">{{ eyebrow }}</p>
      <h2 class="tux-media-slab__title">{{ title }}</h2>
      <p v-if="dek" class="tux-media-slab__dek">{{ dek }}</p>
      <div v-if="$slots.actions" class="tux-media-slab__actions">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.tux-media-slab {
  /* Container queries so layout responds to the slab's width, not the viewport. */
  container-type: inline-size;
  container-name: tux-media-slab;

  position: relative;
  overflow: hidden;
  background: var(--surface-sunken);
  border-radius: var(--radius-md);
}

/* Heights — scale down on narrow containers so a 32rem hero slab in a
   500px column doesn't take up half the screen height. */
.tux-media-slab--height-tall     { min-height: 22rem; }
.tux-media-slab--height-standard { min-height: 18rem; }
.tux-media-slab--height-short    { min-height: 12rem; }

@container tux-media-slab (min-width: 40rem) {
  .tux-media-slab--height-tall     { min-height: 32rem; }
  .tux-media-slab--height-standard { min-height: 24rem; }
  .tux-media-slab--height-short    { min-height: 16rem; }
}

/* Overlay — image fills, copy sits on top with darkening gradient */
.tux-media-slab--overlay {
  display: grid;
  grid-template-areas: "stack";
}

.tux-media-slab--overlay .tux-media-slab__media,
.tux-media-slab--overlay .tux-media-slab__copy {
  grid-area: stack;
}

.tux-media-slab--overlay .tux-media-slab__media {
  position: relative;
  height: 100%;
  width: 100%;
}

.tux-media-slab--overlay .tux-media-slab__media::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.55) 60%,
    rgba(0, 0, 0, 0.78) 100%
  );
}

.tux-media-slab--overlay .tux-media-slab__copy {
  position: relative;
  z-index: 1;
  align-self: end;
  padding: 1.5rem 1.5rem 1.25rem;
  color: #fff;
  max-width: 42rem;
}

@container tux-media-slab (min-width: 30rem) {
  .tux-media-slab--overlay .tux-media-slab__copy { padding: 2.25rem 2.25rem 2rem; }
}
@container tux-media-slab (min-width: 50rem) {
  .tux-media-slab--overlay .tux-media-slab__copy { padding: 3rem 3.25rem 2.5rem; }
}

.tux-media-slab--overlay .tux-media-slab__eyebrow { color: rgba(255, 255, 255, 0.8); }
.tux-media-slab--overlay .tux-media-slab__title   { color: #fff; }
.tux-media-slab--overlay .tux-media-slab__dek     { color: rgba(255, 255, 255, 0.85); }

/* Split — image one side, copy the other. Stacks below 50rem container width. */
.tux-media-slab--split {
  display: grid;
  grid-template-columns: 1fr;
}

@container tux-media-slab (min-width: 50rem) {
  .tux-media-slab--split { grid-template-columns: 1fr 1fr; }
}

.tux-media-slab--split .tux-media-slab__media {
  width: 100%;
  height: 100%;
  min-height: 14rem;
}

.tux-media-slab--split .tux-media-slab__copy {
  padding: 1.75rem 1.5rem;
  max-width: 32rem;
  align-self: center;
}

@container tux-media-slab (min-width: 50rem) {
  .tux-media-slab--split .tux-media-slab__copy { padding: 3rem 3rem; }

  .tux-media-slab--image-right {
    grid-template-areas: "copy media";
    grid-template-columns: 1.1fr 1fr;
  }
  .tux-media-slab--image-right .tux-media-slab__copy  { grid-area: copy; }
  .tux-media-slab--image-right .tux-media-slab__media { grid-area: media; }

  .tux-media-slab--image-left {
    grid-template-areas: "media copy";
    grid-template-columns: 1fr 1.1fr;
  }
  .tux-media-slab--image-left .tux-media-slab__copy  { grid-area: copy; }
  .tux-media-slab--image-left .tux-media-slab__media { grid-area: media; }
}

/* Image / placeholder */
.tux-media-slab__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.tux-media-slab__placeholder {
  width: 100%;
  height: 100%;
  min-height: 16rem;
}

.tux-media-slab__placeholder--maroon {
  background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-deep) 60%, #2A0E15 100%);
}
.tux-media-slab__placeholder--gold {
  background: linear-gradient(135deg, var(--brand-accent) 0%, #A87B1F 100%);
}
.tux-media-slab__placeholder--charcoal {
  background: linear-gradient(135deg, #4a4747 0%, #2a2727 100%);
}

/* Copy */
.tux-media-slab__eyebrow {
  margin: 0 0 1rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--brand-primary);
}

.tux-media-slab__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 1rem + 3.5cqi, 3rem);
  line-height: 1.05;
  letter-spacing: -0.005em;
  font-weight: 500;
  color: var(--text-primary);
}

.tux-media-slab__dek {
  margin: 1.125rem 0 0;
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 32rem;
}

.tux-media-slab__actions {
  margin-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
}
</style>
