<script setup lang="ts" generic="T">
/**
 * TuxCardCarousel — horizontal scroll of cards with editorial chrome.
 *
 * Thin wrapper around Nuxt UI 4's `UCarousel` (embla-carousel-vue
 * under the hood). Adds TUX framing: optional eyebrow + display-face
 * title + signature rule above the carousel body, plus prev/next
 * controls styled to match the rest of the catalog.
 *
 * Use when: a row of comparable cards is more useful than a vertical
 * list — featured projects, image galleries, MCP tool result sets,
 * related publications, slideshow callouts in long-form articles.
 *
 * **Two ways to render the cards:**
 *   1. Pass `items` + use the `#item` scoped slot:
 *      <tux-card-carousel :items="projects">
 *        <template #item="{ item }">
 *          <tux-card>{{ item.name }}</tux-card>
 *        </template>
 *      </tux-card-carousel>
 *   2. Or skip `items` and put `<div class="tux-card-carousel__slide">`
 *      blocks in the default slot directly. Useful when the cards are
 *      heterogeneous (different shapes per slide).
 *
 * Composition note: the carousel ships **no card chrome** of its own.
 * Each item is the consumer's responsibility — typically a TuxCard,
 * TuxArtifact, TuxContactCard, or a custom block. The wrapper only
 * owns the scrollable rail + arrows + optional dots.
 *
 * Roadmap context: we deferred a carousel during the shadcn absorption
 * because no consumer surface needed it. The MCP-Apps for Claude
 * absorption (inline-carousel display tier) re-opened the question —
 * shipped now as the trigger consumer.
 */

interface Props {
  /** Items array. Renders one slide per item via the `#item` scoped
   *  slot. If omitted, slides come from the default slot directly. */
  items?: T[];
  /** Uppercase tracked eyebrow above the title. Optional. */
  eyebrow?: string;
  /** Display-face title above the carousel body. Optional. */
  title?: string;
  /** Hide the 2px maroon signature rule under the title.
   *  Default false (rule shown when title is present). */
  bare?: boolean;
  /** Show prev/next arrow buttons. Default true. */
  arrows?: boolean;
  /** Show pagination dots beneath the carousel. Default false. */
  dots?: boolean;
  /** Loop around at the ends. Default false. */
  loop?: boolean;
  /** Number of slides to advance on prev/next + auto-scroll. */
  slidesToScroll?: number;
  /** Embla `align` option — `"start" | "center" | "end"` or a custom
   *  px offset. Default `"start"` (left-edge alignment for card rails). */
  align?: "start" | "center" | "end";
  /** CSS gap between slides. Default `1rem`. */
  gap?: string;
  /** ARIA label for the carousel region. Important for SR users. */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  items: undefined,
  eyebrow: undefined,
  title: undefined,
  bare: false,
  arrows: true,
  dots: false,
  loop: false,
  slidesToScroll: 1,
  align: "start",
  gap: "1rem",
  ariaLabel: "Carousel",
});

defineSlots<{
  /** Per-item render. Receives `{ item, index }`. */
  item(props: { item: T; index: number }): unknown;
  /** Direct slide rendering (alternative to `items` + `#item`). */
  default(): unknown;
}>();

// UCarousel's `items` prop is typed as a specific `CarouselItem[]` shape
// (image-carousel default), but TuxCardCarousel is generic over T and
// delegates item rendering to the `#item` slot — UCarousel only uses the
// length for slide count. Cast through `unknown` so the template binding
// satisfies UCarousel's strict prop type without losing the generic T
// for the `#item` slot.
const carouselItems = computed(() => props.items as unknown as never[]);
</script>

<template>
  <!-- The bare <section> carries no accessible name, so it is NOT a
       region landmark — UCarousel below renders its own role="region"
       (with aria-roledescription="carousel"), and we name THAT region
       via :aria-label. Two same-named region landmarks would trip
       axe's landmark-unique. -->
  <section class="tux-card-carousel">
    <header
      v-if="eyebrow || title"
      class="tux-card-carousel__header"
    >
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h2
        v-if="title"
        class="tux-card-carousel__title"
      >
        {{ title }}
      </h2>
      <span
        v-if="title && !bare"
        class="tux-card-carousel__rule"
        aria-hidden="true"
      />
    </header>

    <UCarousel
      :items="carouselItems"
      :aria-label="ariaLabel"
      :arrows="arrows"
      :dots="dots"
      :loop="loop"
      :slides-to-scroll="slidesToScroll"
      :align="align"
      class="tux-card-carousel__rail"
      :ui="{
        container: 'tux-card-carousel__container',
        item: 'tux-card-carousel__item',
        controls: 'tux-card-carousel__controls',
        arrows: 'tux-card-carousel__arrows',
        prev: 'tux-card-carousel__prev',
        next: 'tux-card-carousel__next',
        dots: 'tux-card-carousel__dots',
        dot: 'tux-card-carousel__dot',
      }"
      :style="{ '--tux-card-carousel-gap': gap }"
    >
      <template #default="{ item, index }">
        <slot
          name="item"
          :item="(item as T)"
          :index="index"
        />
      </template>
    </UCarousel>

    <!-- Direct-slot mode: when `items` is omitted, the default slot
         feeds raw slide content. Consumers wrap each block in
         `<div class="tux-card-carousel__slide">` to get the right
         track behavior. Less common path; provided for heterogeneous
         slide shapes. -->
    <div v-if="!items && $slots.default" class="tux-card-carousel__raw">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.tux-card-carousel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tux-card-carousel__header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tux-card-carousel__title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.1;
  color: var(--text-primary);
  margin: 0;
}

.tux-card-carousel__rule {
  display: block;
  width: 3rem;
  height: 2px;
  background: var(--brand-primary);
  margin-top: 0.5rem;
}

/* UCarousel slot targeting — track gap, slide sizing, controls
   positioning. The wrapper provides defaults that work for ~280–
   360px cards; consumers override via `gap` prop or by wrapping
   slides in elements with explicit widths. */
.tux-card-carousel__rail :deep(.tux-card-carousel__container) {
  display: flex;
  gap: var(--tux-card-carousel-gap, 1rem);
  scroll-behavior: smooth;
}

.tux-card-carousel__rail :deep(.tux-card-carousel__item) {
  flex: 0 0 auto;
  min-width: 0;
}

.tux-card-carousel__rail :deep(.tux-card-carousel__controls) {
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
}

.tux-card-carousel__rail :deep(.tux-card-carousel__arrows) {
  display: flex;
  gap: 0.5rem;
}

.tux-card-carousel__rail :deep(.tux-card-carousel__prev),
.tux-card-carousel__rail :deep(.tux-card-carousel__next) {
  /* Defer to UButton's tonal/ghost styles; overrides for the icon
     hit-area sit alongside the existing pagination affordances. */
  --u-button-color: var(--brand-primary);
}

.tux-card-carousel__rail :deep(.tux-card-carousel__dots) {
  display: flex;
  gap: 0.375rem;
  justify-content: center;
  margin-top: 0.5rem;
}

.tux-card-carousel__rail :deep(.tux-card-carousel__dot) {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: var(--surface-border);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background 120ms ease;
}

.tux-card-carousel__rail :deep(.tux-card-carousel__dot[aria-current="true"]) {
  background: var(--brand-primary);
}

.tux-card-carousel__raw {
  display: flex;
  gap: var(--tux-card-carousel-gap, 1rem);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 0.5rem;
}
.tux-card-carousel__raw > * {
  scroll-snap-align: start;
  flex: 0 0 auto;
}
</style>
