<script setup lang="ts">
// TuxTestimonial — collection of attributed quotes.
//
// Two layouts:
//   - grid (default) — card grid, photo + quote stacked. 2 or 3 columns.
//                      Right for landing pages, "what people say" sections.
//   - row            — horizontal rows, photo + quote side-by-side.
//                      Right for editorial pages, denser information density.
//
// Portraits use a circular gradient placeholder with the speaker's initial.
// Three color variants — maroon (brand), gold (accent), navy (secondary).
// When real photos are available, swap the placeholder via the `image` prop
// on each item; the component renders an `<img>` instead of the initial.

interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  /** Single character to render in the portrait placeholder. Defaults to
   *  the first letter of `name`. */
  initial?: string;
  /** Portrait gradient color. Cycles through maroon/gold/navy by default. */
  color?: "maroon" | "gold" | "navy";
  /** Real portrait URL. Overrides the initial placeholder. */
  image?: string;
}

interface Props {
  items: Testimonial[];
  layout?: "grid" | "row";
  /** Columns for grid layout. Defaults to 3. */
  columns?: 2 | 3;
  /** Style variant — affects body face. */
  variant?: "default" | "bold" | "elegant";
}

const props = withDefaults(defineProps<Props>(), {
  layout: "grid",
  columns: 3,
  variant: "default",
});

const colorCycle: Array<"maroon" | "gold" | "navy"> = ["maroon", "navy", "gold"];

function colorFor(item: Testimonial, idx: number): "maroon" | "gold" | "navy" {
  return item.color ?? colorCycle[idx % colorCycle.length]!;
}

function initialFor(item: Testimonial): string {
  return item.initial ?? item.name.charAt(0).toUpperCase();
}
</script>

<template>
  <ul
    class="tux-testimonial"
    :class="[
      `tux-testimonial--${layout}`,
      `tux-testimonial--${variant}`,
      layout === 'grid' ? `tux-testimonial--cols-${columns}` : '',
    ]"
  >
    <li
      v-for="(item, idx) in items"
      :key="idx"
      class="tux-testimonial__item"
    >
      <article
        v-if="layout === 'grid'"
        class="tux-testimonial__card"
      >
        <span class="tux-testimonial__quote-mark" aria-hidden="true">"</span>
        <p class="tux-testimonial__body">{{ item.quote }}</p>
        <footer class="tux-testimonial__attribution">
          <span
            v-if="!item.image"
            class="tux-testimonial__portrait"
            :class="`tux-testimonial__portrait--${colorFor(item, idx)}`"
            aria-hidden="true"
          >{{ initialFor(item) }}</span>
          <img
            v-else
            :src="item.image"
            :alt="item.name"
            class="tux-testimonial__portrait tux-testimonial__portrait--image"
            width="48"
            height="48"
          >
          <div class="tux-testimonial__name-block">
            <span class="tux-testimonial__name">{{ item.name }}</span>
            <span v-if="item.role" class="tux-testimonial__role">{{ item.role }}</span>
          </div>
        </footer>
      </article>

      <article v-else class="tux-testimonial__row">
        <span
          v-if="!item.image"
          class="tux-testimonial__portrait tux-testimonial__portrait--lg"
          :class="`tux-testimonial__portrait--${colorFor(item, idx)}`"
          aria-hidden="true"
        >{{ initialFor(item) }}</span>
        <img
          v-else
          :src="item.image"
          :alt="item.name"
          class="tux-testimonial__portrait tux-testimonial__portrait--image tux-testimonial__portrait--lg"
          width="80"
          height="80"
        >
        <div class="tux-testimonial__row-body">
          <p class="tux-testimonial__body">"{{ item.quote }}"</p>
          <p class="tux-testimonial__row-meta">
            <span class="tux-testimonial__name">{{ item.name }}</span>
            <span v-if="item.role" class="tux-testimonial__role"> · {{ item.role }}</span>
          </p>
        </div>
      </article>
    </li>
  </ul>
</template>

<style scoped>
.tux-testimonial {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tux-testimonial--grid {
  display: grid;
  gap: 1.5rem;
}
.tux-testimonial--grid.tux-testimonial--cols-2 {
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
}
.tux-testimonial--grid.tux-testimonial--cols-3 {
  grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
}

.tux-testimonial--row .tux-testimonial__item {
  border-bottom: 1px solid var(--surface-border);
}
.tux-testimonial--row .tux-testimonial__item:last-child {
  border-bottom: 0;
}

/* Card -------------------------------------------------------- */
.tux-testimonial__card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.75rem 1.625rem 1.5rem;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.tux-testimonial__quote-mark {
  font-family: var(--font-elegant);
  font-style: italic;
  font-weight: 400;
  font-size: 3.5rem;
  line-height: 0.5;
  color: var(--brand-accent);
  opacity: 0.7;
  margin-bottom: 0.625rem;
}

.tux-testimonial__body {
  margin: 0 0 1.5rem;
  flex: 1;
  font-size: 1rem;
  line-height: 1.55;
  color: var(--text-primary);
}

.tux-testimonial--default .tux-testimonial__body  { font-family: var(--font-body); font-style: normal; }
.tux-testimonial--bold .tux-testimonial__body     { font-family: var(--font-body); font-style: italic; }
.tux-testimonial--elegant .tux-testimonial__body  { font-family: var(--font-elegant); font-style: italic; }

.tux-testimonial__attribution {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding-top: 1.125rem;
  border-top: 1px solid var(--surface-border);
}

/* Row --------------------------------------------------------- */
.tux-testimonial__row {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem 0;
}

.tux-testimonial__row-body {
  flex: 1;
  padding-top: 0.25rem;
}

.tux-testimonial__row-body .tux-testimonial__body {
  margin: 0 0 0.875rem;
  font-style: italic;
  font-size: 1.0625rem;
  line-height: 1.5;
}

.tux-testimonial__row-meta {
  margin: 0;
  font-size: 0.75rem;
}

/* Portrait ---------------------------------------------------- */
.tux-testimonial__portrait {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  flex-shrink: 0;
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.tux-testimonial__portrait--lg {
  width: 5rem;
  height: 5rem;
  font-size: 2rem;
}

.tux-testimonial__portrait--maroon {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-deep));
}
.tux-testimonial__portrait--navy {
  background: linear-gradient(135deg, #2E4A6B, #1A2E45);
}
.tux-testimonial__portrait--gold {
  background: linear-gradient(135deg, var(--brand-accent), #A87B1F);
  color: #2A0E15;
}

.tux-testimonial__portrait::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.18) 0%, transparent 50%);
  pointer-events: none;
}

.tux-testimonial__portrait--image {
  background: var(--surface-sunken);
  object-fit: cover;
}

/* Name + role ------------------------------------------------- */
.tux-testimonial__name {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.78125rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--brand-primary);
}

.tux-testimonial__role {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.tux-testimonial__name-block {
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
  min-width: 0;
}
</style>
