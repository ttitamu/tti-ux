<script setup lang="ts">
// TuxBlockquote — standalone editorial pull quote.
//
// Two layouts:
//   - centered (default) — full-bleed feel, italic body, rules above + below.
//                          Use when the quote is the focal element of a section.
//   - drop-cap            — first character rendered oversized in brand color,
//                          rest flows alongside. Magazine-style, more
//                          decorative; reserve for hero / landing surfaces.
//
// For inline body callouts (a quote interrupting reading flow), use
// `<TuxCallout kind="quote">` instead — it's smaller and signals "aside".
// For a row of attributed quotes with portraits, use `<TuxTestimonial>`.

interface Props {
  /** The quote text. Required. */
  quote: string;
  /** Speaker name. Renders ALL-CAPS tracked-out. */
  attribution?: string | null;
  /** Speaker role / affiliation. Renders next to the attribution. */
  role?: string | null;
  /** Layout. `centered` is the default editorial pull-quote shape. */
  layout?: "centered" | "drop-cap";
  /** Style variant — affects body face + signature rule. */
  variant?: "default" | "bold" | "elegant";
}

const props = withDefaults(defineProps<Props>(), {
  attribution: null,
  role: null,
  layout: "centered",
  variant: "default",
});

const dropCapFirst = computed(() => props.quote.charAt(0));
const dropCapRest  = computed(() => props.quote.slice(1));
</script>

<template>
  <figure
    class="tux-blockquote"
    :class="[`tux-blockquote--${layout}`, `tux-blockquote--${variant}`]"
  >
    <!-- Top rule (centered layout only) -->
    <span
      v-if="layout === 'centered'"
      class="tux-blockquote__rule tux-blockquote__rule--top"
      aria-hidden="true"
    />

    <!-- Drop-cap layout -->
    <blockquote v-if="layout === 'drop-cap'" class="tux-blockquote__body">
      <span class="tux-blockquote__drop-cap" aria-hidden="true">{{ dropCapFirst }}</span>
      <p class="tux-blockquote__drop-text"><span aria-hidden="true">{{ dropCapFirst }}</span>{{ dropCapRest }}</p>
    </blockquote>

    <!-- Centered layout -->
    <blockquote v-else class="tux-blockquote__body">
      <p>"{{ quote }}"</p>
    </blockquote>

    <!-- Bottom signature rule -->
    <span
      v-if="layout === 'drop-cap'"
      class="tux-blockquote__rule tux-blockquote__rule--bottom"
      aria-hidden="true"
    />

    <figcaption v-if="attribution || role" class="tux-blockquote__caption">
      <span v-if="attribution" class="tux-blockquote__attribution">{{ attribution }}</span>
      <span
        v-if="role"
        class="tux-blockquote__role"
      ><template v-if="attribution"> · </template>{{ role }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.tux-blockquote {
  container-type: inline-size;
  container-name: tux-blockquote;
  margin: 0;
  padding: 1.5rem 0;
}

/* Centered layout ---------------------------------------------- */
.tux-blockquote--centered {
  max-width: 46rem;
  margin: 0 auto;
  text-align: center;
  padding: 2rem 0;
}

.tux-blockquote--centered .tux-blockquote__body {
  margin: 0 0 1.75rem;
}

.tux-blockquote--centered .tux-blockquote__body p {
  margin: 0;
  font-style: italic;
  font-size: 2rem;
  line-height: 1.35;
  color: var(--text-primary);
}

.tux-blockquote--centered.tux-blockquote--default .tux-blockquote__body p,
.tux-blockquote--centered.tux-blockquote--elegant .tux-blockquote__body p {
  font-family: var(--font-elegant);
  font-weight: 400;
}

.tux-blockquote--centered.tux-blockquote--bold .tux-blockquote__body p {
  font-family: var(--font-bold);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 1.75rem;
}

/* Drop-cap layout ---------------------------------------------- */
.tux-blockquote--drop-cap {
  max-width: 55rem;
}

.tux-blockquote--drop-cap .tux-blockquote__body {
  position: relative;
  margin: 0;
  padding: 0;
}

.tux-blockquote__drop-cap {
  float: left;
  margin: 0 0.875rem -0.5rem 0;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 8.75rem;
  line-height: 0.85;
  color: var(--brand-primary);
  user-select: none;
}

.tux-blockquote--drop-cap.tux-blockquote--bold .tux-blockquote__drop-cap {
  font-family: var(--font-bold);
  font-weight: 800;
  font-style: italic;
}

.tux-blockquote--drop-cap.tux-blockquote--elegant .tux-blockquote__drop-cap {
  font-family: var(--font-elegant);
  font-weight: 400;
  font-style: italic;
}

.tux-blockquote--drop-cap .tux-blockquote__drop-text {
  margin: 0;
  padding-top: 0.625rem;
  font-family: var(--font-elegant);
  font-style: italic;
  font-size: 1.625rem;
  line-height: 1.4;
  color: var(--text-primary);
}

/* The first char appears in the drop-cap; hide it from the
   prose while keeping it in the DOM for screen-reader continuity. */
.tux-blockquote--drop-cap .tux-blockquote__drop-text > span {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}

/* Signature rules ---------------------------------------------- */
.tux-blockquote__rule {
  display: block;
  height: 2px;
  width: 7.5rem;
  margin: 0 auto;
}

.tux-blockquote__rule--top    { margin-bottom: 1.75rem; }
.tux-blockquote__rule--bottom { margin: 1.75rem 0; }

.tux-blockquote--default .tux-blockquote__rule {
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--brand-primary) 15%,
    var(--brand-primary) 85%,
    transparent 100%
  );
  opacity: 0.85;
}

.tux-blockquote--bold .tux-blockquote__rule {
  height: 5px;
  width: 5rem;
  background:
    linear-gradient(to right,
      var(--brand-primary) 0 50%,
      transparent 50% 56%,
      color-mix(in srgb, var(--brand-primary) 50%, transparent) 56% 84%,
      transparent 84% 92%,
      color-mix(in srgb, var(--brand-primary) 25%, transparent) 92% 100%);
  border-radius: 2.5px;
}

.tux-blockquote--elegant .tux-blockquote__rule {
  height: 6px;
  background-image: repeating-linear-gradient(
    135deg,
    var(--brand-accent) 0,
    var(--brand-accent) 1px,
    transparent 1px,
    transparent 5px
  );
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%);
  opacity: 0.8;
}

/* Caption ------------------------------------------------------ */
.tux-blockquote__caption {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.tux-blockquote--centered .tux-blockquote__caption {
  text-align: center;
}

.tux-blockquote--drop-cap .tux-blockquote__caption {
  padding-left: 0;
  margin-top: 0.875rem;
}

@container tux-blockquote (min-width: 30rem) {
  .tux-blockquote--drop-cap .tux-blockquote__caption {
    padding-left: 9.5rem;
  }
}

.tux-blockquote__attribution {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--brand-primary);
}

.tux-blockquote__role {
  color: var(--text-muted);
}
</style>
