<script setup lang="ts">
// TuxPhotoGrid — uniform grid of images.
//
// Two kinds:
//   - photo (default) — research photography, project galleries, event
//                       coverage. Items render at full color, optional
//                       caption strip below each tile.
//   - logo            — partner / sponsor / agency logo wall. Items
//                       render grayscale by default, color on hover.
//                       No captions; the alt text carries the name.
//
// Aspect ratios are fixed per kind: 4:3 for photos (the institutional
// editorial ratio), 1:1 for logos (square keeps mismatched shapes from
// breaking the grid). Override with the `aspect` prop.
//
// Items can be either real `src` URLs or labeled placeholders (gradient
// + tone label) for design mocks before real assets land.

interface PhotoItem {
  /** Image URL. If omitted, renders a labeled gradient placeholder. */
  src?: string;
  /** Alt text. Required when `src` is set; used as caption fallback. */
  alt?: string;
  /** Optional caption rendered below the image. */
  caption?: string;
  /** Optional credit line (italic, smaller). */
  credit?: string;
  /** Placeholder tone — cycles maroon/gold/charcoal when `src` is omitted. */
  tone?: "maroon" | "gold" | "charcoal";
  /** Optional href — wraps the tile in a link. */
  href?: string;
}

interface Props {
  items: PhotoItem[];
  /** Grid kind. Photo (full color, captions) vs logo (grayscale wall). */
  kind?: "photo" | "logo";
  /** Number of columns. Auto-fits to viewport. */
  columns?: 2 | 3 | 4 | 5 | 6;
  /** Aspect ratio override. Defaults: 4/3 (photo), 1/1 (logo). */
  aspect?: "4/3" | "1/1" | "16/9" | "3/4";
}

const props = withDefaults(defineProps<Props>(), {
  kind: "photo",
  columns: 3,
  aspect: undefined,
});

const computedAspect = computed(() => {
  if (props.aspect) return props.aspect;
  return props.kind === "logo" ? "1/1" : "4/3";
});

const minColWidth = computed(() => {
  if (props.kind === "logo") return "9rem";
  if (props.columns >= 5) return "10rem";
  if (props.columns === 4) return "12rem";
  return "16rem";
});

const toneCycle: Array<"maroon" | "gold" | "charcoal"> = ["maroon", "gold", "charcoal"];

function toneFor(item: PhotoItem, idx: number) {
  return item.tone ?? toneCycle[idx % toneCycle.length]!;
}

function isInternal(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}
</script>

<template>
  <ul
    class="tux-photo-grid"
    :class="`tux-photo-grid--${kind}`"
    :style="{
      gridTemplateColumns: `repeat(auto-fit, minmax(${minColWidth}, 1fr))`,
      '--tux-photo-aspect': computedAspect,
    }"
  >
    <li
      v-for="(item, idx) in items"
      :key="idx"
      class="tux-photo-grid__item"
    >
      <component
        :is="item.href ? (isInternal(item.href) ? 'NuxtLink' : 'a') : 'figure'"
        :to="item.href && isInternal(item.href) ? item.href : undefined"
        :href="item.href && !isInternal(item.href) ? item.href : undefined"
        class="tux-photo-grid__tile"
      >
        <img
          v-if="item.src"
          :src="item.src"
          :alt="item.alt ?? ''"
          class="tux-photo-grid__img"
          loading="lazy"
        >
        <div
          v-else
          class="tux-photo-grid__placeholder"
          :class="`tux-photo-grid__placeholder--${toneFor(item, idx)}`"
          :aria-label="item.alt ?? 'placeholder'"
          role="img"
        >
          <span class="tux-photo-grid__placeholder-label">{{ item.alt ?? 'placeholder' }}</span>
        </div>
      </component>

      <figcaption
        v-if="kind === 'photo' && (item.caption || item.credit)"
        class="tux-photo-grid__caption"
      >
        <span v-if="item.caption" class="tux-photo-grid__caption-text">{{ item.caption }}</span>
        <span v-if="item.credit" class="tux-photo-grid__caption-credit">{{ item.credit }}</span>
      </figcaption>
    </li>
  </ul>
</template>

<style scoped>
.tux-photo-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.tux-photo-grid__item {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.tux-photo-grid__tile {
  position: relative;
  display: block;
  aspect-ratio: var(--tux-photo-aspect, 4/3);
  overflow: hidden;
  background: var(--surface-sunken);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: inherit;
}

.tux-photo-grid__tile:where(a, .router-link-active) {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.25s ease-out;
}

.tux-photo-grid__tile:where(a, .router-link-active):hover,
.tux-photo-grid__tile:where(a, .router-link-active):focus-visible {
  outline: none;
  transform: translate(2px, -2px);
  box-shadow: -2px 2px 0 0 var(--brand-primary);
}

.tux-photo-grid__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Logo wall — grayscale-by-default, color-on-hover. The institutional
   convention; keeps a logo wall from screaming with mismatched palettes. */
.tux-photo-grid--logo .tux-photo-grid__tile {
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.tux-photo-grid--logo .tux-photo-grid__img {
  object-fit: contain;
  filter: grayscale(1);
  opacity: 0.7;
  transition: filter 0.2s ease, opacity 0.2s ease;
}

.tux-photo-grid--logo .tux-photo-grid__tile:hover .tux-photo-grid__img,
.tux-photo-grid--logo .tux-photo-grid__tile:focus-visible .tux-photo-grid__img {
  filter: none;
  opacity: 1;
}

/* Placeholder — labeled gradient block when no src is provided. */
.tux-photo-grid__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.85);
}

.tux-photo-grid__placeholder--maroon {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-deep));
}
.tux-photo-grid__placeholder--gold {
  background: linear-gradient(135deg, var(--brand-accent), #A87B1F);
  color: #2A0E15;
}
.tux-photo-grid__placeholder--charcoal {
  background: linear-gradient(135deg, #3a3a3a, #1f1f1f);
}

.tux-photo-grid__placeholder-label {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  opacity: 0.85;
}

/* Caption */
.tux-photo-grid__caption {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.tux-photo-grid__caption-text {
  color: var(--text-primary);
}

.tux-photo-grid__caption-credit {
  font-style: italic;
  font-size: 0.6875rem;
  color: var(--text-muted);
}
</style>
