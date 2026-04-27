<script setup lang="ts">
// TuxCardSlab — full-bleed band of media-forward cards.
//
// The "explore the program" / "browse our research" pattern. A horizontal
// band that breaks out of the article column to show 2–4 large, image-led
// cards with minimal copy. Different from `<TuxPhotoGrid>` (which is
// caption-forward) and `<TuxNewsCollection grid>` (which is copy-forward) —
// this one is image-forward with a small overlay headline.
//
// Each card has an image (or placeholder), a title overlay, and an
// optional category eyebrow. Whole-card click area; the card becomes a
// link if `to` or `href` is set.

interface SlabCard {
  /** Card title shown over the image. Required. */
  title: string;
  /** Eyebrow above the title (e.g. "Program", "Research"). */
  eyebrow?: string;
  /** Image URL. If omitted, renders a tone-keyed gradient placeholder. */
  image?: string;
  alt?: string;
  /** Internal route or external href — makes the whole card clickable. */
  to?: string;
  href?: string;
  /** Placeholder gradient tone. Cycles maroon/charcoal/gold. */
  tone?: "maroon" | "gold" | "charcoal";
}

interface Props {
  cards: SlabCard[];
  /** Number of cards in the slab. Defaults to 3. */
  columns?: 2 | 3 | 4;
  /** Card aspect ratio — taller for narrower cards, wider for fewer. */
  aspect?: "3/4" | "1/1" | "4/5";
  /** Eyebrow + title shown above the slab. */
  heading?: string;
  eyebrow?: string;
  /** Tighter padding when embedded inside a content column rather than
   *  full-bleed across the page. Defaults to false (full-bleed feel). */
  inset?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  columns: 3,
  aspect: "4/5",
  heading: undefined,
  eyebrow: undefined,
  inset: false,
});

const toneCycle: Array<"maroon" | "gold" | "charcoal"> = ["maroon", "charcoal", "gold"];

function toneFor(card: SlabCard, idx: number) {
  return card.tone ?? toneCycle[idx % toneCycle.length]!;
}

function isInternal(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

function cardComponent(card: SlabCard) {
  const target = card.to ?? card.href;
  if (!target) return "div";
  return isInternal(target) ? "NuxtLink" : "a";
}
</script>

<template>
  <section
    class="tux-card-slab"
    :class="[
      `tux-card-slab--cols-${columns}`,
      inset ? 'tux-card-slab--inset' : '',
    ]"
    :style="{ '--tux-slab-aspect': aspect }"
  >
    <header v-if="heading || eyebrow" class="tux-card-slab__header">
      <p v-if="eyebrow" class="tux-card-slab__eyebrow">{{ eyebrow }}</p>
      <h2 v-if="heading" class="tux-card-slab__heading">{{ heading }}</h2>
    </header>

    <ul class="tux-card-slab__list">
      <li
        v-for="(card, idx) in cards"
        :key="idx"
        class="tux-card-slab__item"
      >
        <component
          :is="cardComponent(card)"
          :to="cardComponent(card) === 'NuxtLink' ? card.to : undefined"
          :href="cardComponent(card) === 'a' ? card.href : undefined"
          class="tux-card-slab__card"
        >
          <div class="tux-card-slab__media">
            <img
              v-if="card.image"
              :src="card.image"
              :alt="card.alt ?? ''"
              class="tux-card-slab__img"
              loading="lazy"
            >
            <div
              v-else
              class="tux-card-slab__placeholder"
              :class="`tux-card-slab__placeholder--${toneFor(card, idx)}`"
              :aria-label="card.alt ?? card.title"
              role="img"
            />
          </div>

          <div class="tux-card-slab__overlay">
            <p v-if="card.eyebrow" class="tux-card-slab__card-eyebrow">{{ card.eyebrow }}</p>
            <h3 class="tux-card-slab__card-title">{{ card.title }}</h3>
          </div>

          <span
            v-if="card.to || card.href"
            class="tux-card-slab__arrow"
            aria-hidden="true"
          >
            <Icon name="lucide:arrow-up-right" />
          </span>
        </component>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.tux-card-slab {
  container-type: inline-size;
  container-name: tux-card-slab;
  width: 100%;
}

/* Header */
.tux-card-slab__header {
  margin-bottom: 1.5rem;
  max-width: 32rem;
}

.tux-card-slab__eyebrow {
  margin: 0 0 0.625rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--brand-primary);
}

.tux-card-slab__heading {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.375rem, 1rem + 2.2cqi, 2rem);
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: -0.005em;
  color: var(--text-primary);
}

/* List */
.tux-card-slab__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1.25rem;
}

.tux-card-slab--cols-2 .tux-card-slab__list { grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); }
.tux-card-slab--cols-3 .tux-card-slab__list { grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); }
.tux-card-slab--cols-4 .tux-card-slab__list { grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); }

/* Card */
.tux-card-slab__card {
  position: relative;
  display: block;
  aspect-ratio: var(--tux-slab-aspect, 4/5);
  overflow: hidden;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: inherit;
  background: var(--surface-sunken);
  transition: transform 0.25s ease, box-shadow 0.35s ease-out;
}

.tux-card-slab__card:where(a, .router-link-active) {
  cursor: pointer;
}

.tux-card-slab__card:where(a, .router-link-active):hover,
.tux-card-slab__card:where(a, .router-link-active):focus-visible {
  outline: none;
  transform: translate(4px, -4px);
  box-shadow: -4px 4px 0 0 var(--brand-primary);
}

.tux-card-slab__card:where(a, .router-link-active):hover .tux-card-slab__img,
.tux-card-slab__card:where(a, .router-link-active):focus-visible .tux-card-slab__img {
  transform: scale(1.04);
}

.tux-card-slab__card:where(a, .router-link-active):hover .tux-card-slab__arrow,
.tux-card-slab__card:where(a, .router-link-active):focus-visible .tux-card-slab__arrow {
  opacity: 1;
  transform: translate(0, 0);
}

/* Media */
.tux-card-slab__media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.tux-card-slab__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.tux-card-slab__placeholder {
  width: 100%;
  height: 100%;
}

.tux-card-slab__placeholder--maroon {
  background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-deep) 60%, #2A0E15 100%);
}
.tux-card-slab__placeholder--gold {
  background: linear-gradient(135deg, var(--brand-accent) 0%, #A87B1F 100%);
}
.tux-card-slab__placeholder--charcoal {
  background: linear-gradient(135deg, #4a4747 0%, #2a2727 100%);
}

/* Darkening gradient for overlay legibility */
.tux-card-slab__media::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.05) 0%,
    rgba(0, 0, 0, 0.45) 60%,
    rgba(0, 0, 0, 0.78) 100%
  );
  pointer-events: none;
}

/* Overlay copy */
.tux-card-slab__overlay {
  position: absolute;
  inset: auto 0 0 0;
  padding: 1.25rem 1.375rem 1.5rem;
  color: #fff;
}

.tux-card-slab__card-eyebrow {
  margin: 0 0 0.4375rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.85);
}

.tux-card-slab__card-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.0625rem, 0.875rem + 1.6cqi, 1.5rem);
  line-height: 1.15;
  font-weight: 500;
  letter-spacing: -0.005em;
  color: #fff;
}

/* Hover arrow */
.tux-card-slab__arrow {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.92);
  color: var(--brand-primary);
  border-radius: 50%;
  opacity: 0;
  transform: translate(4px, -4px);
  transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1.2);
}

.tux-card-slab__arrow :deep(svg) {
  width: 1rem;
  height: 1rem;
}
</style>
