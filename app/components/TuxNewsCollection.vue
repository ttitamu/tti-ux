<script setup lang="ts">
// TuxNewsCollection — list of news articles.
//
// Each item: thumbnail + date eyebrow + headline + dek + read-more link.
// The institutional news-index pattern. Two layouts:
//   - stacked (default) — vertical list, thumbnail left, copy right.
//                         Right for /news landing pages.
//   - grid              — card grid (2 or 3 cols), thumbnail above copy.
//                         Right for "recent news" sections on a hub page.
//
// Renders dates as `<time>` with ISO `datetime` attributes for
// machine-readability + accessibility.

interface NewsItem {
  /** ISO date (YYYY-MM-DD or full timestamp). Renders as <time>. */
  date: string;
  /** Display date — defaults to a localized format from `date`. */
  dateLabel?: string;
  /** Headline. Required. */
  title: string;
  /** Optional category eyebrow (e.g. "Research", "Event", "Press release"). */
  category?: string;
  /** One- or two-sentence dek. */
  dek?: string;
  /** Article URL. Internal `to` path or external `href`. */
  to?: string;
  href?: string;
  /** Thumbnail URL. If omitted, renders a tone-keyed placeholder. */
  image?: string;
  /** Alt text for the thumbnail. */
  alt?: string;
  /** Placeholder tone when `image` is omitted. Cycles maroon/gold/charcoal. */
  tone?: "maroon" | "gold" | "charcoal";
}

interface Props {
  items: NewsItem[];
  layout?: "stacked" | "grid";
  /** Columns for grid layout. Defaults to 3. */
  columns?: 2 | 3;
  /** Read-more label. Defaults to "Read more". */
  readMore?: string;
}

const props = withDefaults(defineProps<Props>(), {
  layout: "stacked",
  columns: 3,
  readMore: "Read more",
});

const toneCycle: Array<"maroon" | "gold" | "charcoal"> = ["maroon", "gold", "charcoal"];

function toneFor(item: NewsItem, idx: number) {
  return item.tone ?? toneCycle[idx % toneCycle.length]!;
}

function formatDate(item: NewsItem) {
  if (item.dateLabel) return item.dateLabel;
  try {
    return new Date(item.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return item.date;
  }
}

function isInternal(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

function linkProps(item: NewsItem) {
  const href = item.to ?? item.href;
  if (!href) return null;
  return {
    component: isInternal(href) ? "NuxtLink" : "a",
    to: isInternal(href) ? href : undefined,
    href: isInternal(href) ? undefined : href,
  };
}
</script>

<template>
  <ul
    class="tux-news"
    :class="[
      `tux-news--${layout}`,
      layout === 'grid' ? `tux-news--cols-${columns}` : '',
    ]"
  >
    <li
      v-for="(item, idx) in items"
      :key="idx"
      class="tux-news__item"
    >
      <article class="tux-news__article">
        <component
          :is="linkProps(item)?.component ?? 'div'"
          :to="linkProps(item)?.to"
          :href="linkProps(item)?.href"
          class="tux-news__thumb-link"
        >
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.alt ?? ''"
            class="tux-news__thumb-img"
            loading="lazy"
          >
          <div
            v-else
            class="tux-news__thumb-placeholder"
            :class="`tux-news__thumb-placeholder--${toneFor(item, idx)}`"
            role="img"
            :aria-label="item.alt ?? item.title"
          >
            <span class="tux-news__thumb-label">{{ item.category ?? 'news' }}</span>
          </div>
        </component>

        <div class="tux-news__copy">
          <p class="tux-news__meta">
            <span v-if="item.category" class="tux-news__category">{{ item.category }}</span>
            <span v-if="item.category" class="tux-news__sep" aria-hidden="true">·</span>
            <time :datetime="item.date" class="tux-news__date">{{ formatDate(item) }}</time>
          </p>
          <h3 class="tux-news__title">
            <component
              :is="linkProps(item)?.component ?? 'span'"
              :to="linkProps(item)?.to"
              :href="linkProps(item)?.href"
              class="tux-news__title-link"
            >{{ item.title }}</component>
          </h3>
          <p v-if="item.dek" class="tux-news__dek">{{ item.dek }}</p>
          <component
            v-if="linkProps(item)"
            :is="linkProps(item)?.component"
            :to="linkProps(item)?.to"
            :href="linkProps(item)?.href"
            class="tux-news__more"
          >{{ readMore }} <span aria-hidden="true">→</span></component>
        </div>
      </article>
    </li>
  </ul>
</template>

<style scoped>
.tux-news {
  container-type: inline-size;
  container-name: tux-news;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Stacked layout — vertical list. Single column on narrow containers,
   thumb-left + copy-right when there's room. */
.tux-news--stacked .tux-news__item {
  border-bottom: 1px solid var(--surface-border);
}
.tux-news--stacked .tux-news__item:last-child {
  border-bottom: 0;
}

.tux-news--stacked .tux-news__article {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1.5rem 0;
}

@container tux-news (min-width: 32rem) {
  .tux-news--stacked .tux-news__article {
    grid-template-columns: 12rem 1fr;
    gap: 1.5rem;
  }
}

/* Grid layout — cards, thumb above copy */
.tux-news--grid {
  display: grid;
  gap: 1.75rem;
}
.tux-news--cols-2 { grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr)); }
.tux-news--cols-3 { grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); }

.tux-news--grid .tux-news__article {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Thumbnail */
.tux-news__thumb-link {
  display: block;
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: var(--radius-sm);
  text-decoration: none;
}

.tux-news__thumb-link:hover .tux-news__thumb-img,
.tux-news__thumb-link:focus-visible .tux-news__thumb-img {
  transform: scale(1.03);
}

.tux-news__thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.tux-news__thumb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.85);
}
.tux-news__thumb-placeholder--maroon {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-deep));
}
.tux-news__thumb-placeholder--gold {
  background: linear-gradient(135deg, var(--brand-accent), #A87B1F);
  color: #2A0E15;
}
.tux-news__thumb-placeholder--charcoal {
  background: linear-gradient(135deg, #3a3a3a, #1f1f1f);
}

.tux-news__thumb-label {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  opacity: 0.85;
}

/* Copy */
.tux-news__copy {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.tux-news__meta {
  margin: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-family: var(--font-bold);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
}

.tux-news__category {
  color: var(--brand-primary);
}

.tux-news__sep {
  color: var(--text-muted);
  opacity: 0.5;
}

.tux-news__date {
  color: var(--text-muted);
  font-weight: 500;
  font-family: var(--font-mono);
  letter-spacing: 0;
  text-transform: none;
  font-size: 0.75rem;
}

.tux-news__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.0625rem, 0.875rem + 1.4cqi, 1.375rem);
  line-height: 1.25;
  letter-spacing: -0.005em;
  font-weight: 500;
  color: var(--text-primary);
}

.tux-news--grid .tux-news__title {
  font-size: clamp(1rem, 0.875rem + 1cqi, 1.25rem);
}

.tux-news__title-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.15s ease;
}
.tux-news__title-link:hover,
.tux-news__title-link:focus-visible {
  color: var(--brand-primary);
  outline: none;
}

.tux-news__dek {
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--text-secondary);
}

.tux-news__more {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--brand-secondary);
  text-decoration: none;
  transition: color 0.15s ease, gap 0.15s ease;
  align-self: flex-start;
}

.tux-news__more:hover,
.tux-news__more:focus-visible {
  color: var(--brand-primary);
  gap: 0.5rem;
  outline: none;
}
</style>
