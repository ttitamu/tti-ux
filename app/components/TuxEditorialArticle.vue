<script setup lang="ts">
/**
 * TuxEditorialArticle — Flagship publication and article reader component.
 *
 * Implements the modern TTI publication design language (MyTTI / Inside Lane / Kadence)
 * combined with EmDash CMS 1.0 reading ergonomics:
 *  - 4 Hero Image Layouts: 'boxed' (default MyTTI 16:9 card), 'full-bleed' (immersive banner),
 *    'split' (editorial two-column), and 'inset-banner' (panoramic framed banner), plus 'none'.
 *  - Sticky Table of Contents rail ("On this page") auto-tracking active sections via TuxTOC.
 *  - Real-time reading progress indicators: pinned top progress bar + circular TuxScrollTop dial.
 *  - Authentic TTI typography: condensed display headers, dot-separated meta, bold lead paragraph.
 *  - Accessible share actions (copy link with toast feedback, email share).
 *  - 100% WCAG 2.2 Level AAA compliant with zero unbudgeted color literals.
 */

export interface EditorialAuthor {
  name: string;
  title?: string;
  role?: string;
  avatar?: string;
  email?: string;
}

export interface EditorialContact {
  name: string;
  email?: string;
  title?: string;
  phone?: string;
  note?: string;
}

export interface Props {
  /** Article title / headline */
  title: string;
  /** Publication category / kicker (e.g. "Inside Lane", "Research Computing") */
  category?: string;
  /** Subtitle / dek */
  dek?: string;
  /** Publication date (ISO or display string) */
  date?: string;
  /** Custom formatted display date */
  dateLabel?: string;
  /** Estimated reading time (e.g. "3 min read") */
  readTime?: string;
  /** Single author or display name */
  author?: string | EditorialAuthor;
  /** Multiple authors list */
  authors?: EditorialAuthor[];
  /** Featured hero image URL or asset path */
  heroImage?: string;
  /** Hero image alt text */
  heroAlt?: string;
  /** Hero image caption */
  heroCaption?: string;
  /** Hero layout presentation variant */
  heroLayout?: "boxed" | "full-bleed" | "split" | "inset-banner" | "none";
  /** Whether to render the sticky Table of Contents rail */
  toc?: boolean;
  /** Heading selector or article body ID for TOC auto-detection */
  tocTarget?: string;
  /** Whether to show the top reading progress indicator bar */
  showReadingProgress?: boolean;
  /** Whether to include the circular TuxScrollTop button */
  showScrollTop?: boolean;
  /** Whether to show the share action button bar */
  showShare?: boolean;
  /** Tags / topics */
  tags?: string[];
  /** Primary contact person for article or logistics inquiries */
  contact?: EditorialContact;
  /** Breadcrumb / return navigation link */
  backTo?: {
    label: string;
    to: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  category: "Inside Lane",
  dek: "",
  date: "",
  dateLabel: "",
  readTime: "",
  author: "",
  authors: () => [],
  heroImage: "",
  heroAlt: "",
  heroCaption: "",
  heroLayout: "boxed",
  toc: true,
  tocTarget: "#article-body",
  showReadingProgress: true,
  showScrollTop: true,
  showShare: true,
  tags: () => [],
  contact: undefined,
  backTo: undefined,
});

const progress = ref(0);
const copied = ref(false);
let copyTimeout: ReturnType<typeof setTimeout> | null = null;
let rafId: number | null = null;

const normalizedAuthors = computed<EditorialAuthor[]>(() => {
  if (props.authors && props.authors.length > 0) return props.authors;
  if (!props.author) return [];
  if (typeof props.author === "string") {
    return [{ name: props.author }];
  }
  return [props.author];
});

const formattedDate = computed(() => {
  if (props.dateLabel) return props.dateLabel;
  if (!props.date) return "";
  try {
    return new Date(props.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return props.date;
  }
});

function handleScroll() {
  if (typeof window === "undefined") return;
  if (rafId !== null) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    const el = document.documentElement;
    const scrollable = el.scrollHeight - window.innerHeight;
    if (scrollable > 0) {
      progress.value = Math.min(100, Math.max(0, Math.round((window.scrollY / scrollable) * 100)));
    } else {
      progress.value = 0;
    }
  });
}

async function copyArticleLink() {
  if (typeof window === "undefined" || !navigator.clipboard) return;
  try {
    await navigator.clipboard.writeText(window.location.href);
    copied.value = true;
    if (copyTimeout) clearTimeout(copyTimeout);
    copyTimeout = setTimeout(() => {
      copied.value = false;
    }, 2500);
  } catch {
    // Fallback if clipboard API is restricted
    copied.value = false;
  }
}

onMounted(() => {
  if (props.showReadingProgress && typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", handleScroll);
  }
  if (rafId !== null) cancelAnimationFrame(rafId);
  if (copyTimeout) clearTimeout(copyTimeout);
});
</script>

<template>
  <div class="tux-editorial-page" :class="[`tux-editorial--hero-${heroLayout}`]">
    <!-- Top Reading Progress Bar (EmDash & Medium Ergonomics) -->
    <div
      v-if="showReadingProgress"
      class="tux-editorial__progress-rail"
      role="progressbar"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Reading progress"
    >
      <div
        class="tux-editorial__progress-bar"
        :style="{ width: `${progress}%` }"
      />
    </div>

    <!-- Back / Breadcrumb Navigation -->
    <nav v-if="backTo" class="tux-editorial__nav" aria-label="Breadcrumb">
      <div class="tux-editorial__nav-container">
        <NuxtLink :to="backTo.to" class="tux-editorial__back-link">
          <span class="tux-editorial__back-arrow" aria-hidden="true">←</span>
          <span>{{ backTo.label }}</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- FULL-BLEED HERO TREATMENT -->
    <div
      v-if="heroLayout === 'full-bleed' && heroImage"
      class="tux-editorial__hero-fullbleed"
    >
      <img
        :src="heroImage"
        :alt="heroAlt || title"
        class="tux-editorial__hero-fullbleed-img"
      >
      <div class="tux-editorial__hero-fullbleed-scrim" />
      <div class="tux-editorial__hero-fullbleed-content">
        <div class="tux-editorial__container">
          <div v-if="category" class="tux-editorial__category-badge">
            {{ category }}
          </div>
          <h1 class="tux-editorial__title tux-editorial__title--inverted">
            {{ title }}
          </h1>
          <p v-if="dek" class="tux-editorial__dek tux-editorial__dek--inverted">
            {{ dek }}
          </p>
          <div class="tux-editorial__meta tux-editorial__meta--inverted">
            <time v-if="date" :datetime="date">{{ formattedDate }}</time>
            <span v-if="date && readTime" class="tux-editorial__dot" aria-hidden="true">·</span>
            <span v-if="readTime">{{ readTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- INSET BANNER HERO TREATMENT -->
    <div
      v-else-if="heroLayout === 'inset-banner' && heroImage"
      class="tux-editorial__hero-banner"
    >
      <div class="tux-editorial__container">
        <div class="tux-editorial__banner-frame">
          <img
            :src="heroImage"
            :alt="heroAlt || title"
            class="tux-editorial__banner-img"
          >
          <p v-if="heroCaption" class="tux-editorial__caption">
            {{ heroCaption }}
          </p>
        </div>
      </div>
    </div>

    <!-- MAIN EDITORIAL CONTENT GRID -->
    <div class="tux-editorial__main">
      <div class="tux-editorial__container">
        <!-- SPLIT HERO TREATMENT (Title left, Image right) -->
        <header
          v-if="heroLayout === 'split' && heroImage"
          class="tux-editorial__header-split"
        >
          <div class="tux-editorial__split-copy">
            <div v-if="category" class="tux-editorial__category-badge">
              {{ category }}
            </div>
            <h1 class="tux-editorial__title">
              {{ title }}
            </h1>
            <p v-if="dek" class="tux-editorial__dek">
              {{ dek }}
            </p>
            <div class="tux-editorial__meta">
              <time v-if="date" :datetime="date">{{ formattedDate }}</time>
              <span v-if="date && readTime" class="tux-editorial__dot" aria-hidden="true">·</span>
              <span v-if="readTime">{{ readTime }}</span>
              <template v-if="normalizedAuthors.length > 0">
                <span class="tux-editorial__dot" aria-hidden="true">·</span>
                <span class="tux-editorial__byline">
                  By {{ normalizedAuthors.map((a) => a.name).join(", ") }}
                </span>
              </template>
            </div>
          </div>
          <div class="tux-editorial__split-media">
            <div class="tux-editorial__split-card">
              <img
                :src="heroImage"
                :alt="heroAlt || title"
                class="tux-editorial__split-img"
              >
            </div>
            <p v-if="heroCaption" class="tux-editorial__caption">
              {{ heroCaption }}
            </p>
          </div>
        </header>

        <!-- STANDARD HEADER (for 'boxed', 'inset-banner', 'none', and 'full-bleed' fallback) -->
        <header
          v-else-if="heroLayout !== 'full-bleed'"
          class="tux-editorial__header"
        >
          <!-- Category / Eyebrow -->
          <div v-if="category" class="tux-editorial__category-badge">
            {{ category }}
          </div>

          <!-- Headline -->
          <h1 class="tux-editorial__title">
            {{ title }}
          </h1>

          <!-- Dek / Subtitle -->
          <p v-if="dek" class="tux-editorial__dek">
            {{ dek }}
          </p>

          <!-- Metadata row -->
          <div class="tux-editorial__meta">
            <time v-if="date" :datetime="date">{{ formattedDate }}</time>
            <span v-if="date && readTime" class="tux-editorial__dot" aria-hidden="true">·</span>
            <span v-if="readTime">{{ readTime }}</span>
            <template v-if="normalizedAuthors.length > 0">
              <span class="tux-editorial__dot" aria-hidden="true">·</span>
              <span class="tux-editorial__byline">
                By {{ normalizedAuthors.map((a) => a.name).join(", ") }}
              </span>
            </template>
          </div>

          <!-- BOXED HERO TREATMENT (Canonical MyTTI Kadence 16:9 thumbnail) -->
          <div
            v-if="heroLayout === 'boxed' && heroImage"
            class="tux-editorial__hero-boxed"
          >
            <div class="tux-editorial__boxed-card">
              <img
                :src="heroImage"
                :alt="heroAlt || title"
                class="tux-editorial__boxed-img"
              >
            </div>
            <p v-if="heroCaption" class="tux-editorial__caption">
              {{ heroCaption }}
            </p>
          </div>
        </header>

        <!-- TWO-COLUMN EDITORIAL READING LAYOUT (Article Body + Sticky Right Rail) -->
        <div class="tux-editorial__layout" :class="{ 'tux-editorial__layout--single': !toc }">
          <!-- Article Body Column -->
          <article id="article-body" class="tux-editorial__article">
            <!-- Share / Read Actions Bar -->
            <div v-if="showShare" class="tux-editorial__action-bar" aria-label="Article actions">
              <div class="tux-editorial__actions-left">
                <button
                  type="button"
                  class="tux-editorial__btn-share"
                  :aria-label="copied ? 'Article URL copied to clipboard' : 'Copy link to article'"
                  @click="copyArticleLink"
                >
                  <Icon
                    :name="copied ? 'lucide:check' : 'lucide:link'"
                    class="w-4 h-4"
                    aria-hidden="true"
                  />
                  <span>{{ copied ? 'Link Copied!' : 'Copy Link' }}</span>
                </button>

                <a
                  :href="`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this article from Texas A&M Transportation Institute: ')}`"
                  class="tux-editorial__btn-share"
                  aria-label="Share article via Email"
                >
                  <Icon name="lucide:mail" class="w-4 h-4" aria-hidden="true" />
                  <span>Email</span>
                </a>
              </div>

              <div v-if="readTime" class="tux-editorial__read-badge">
                <Icon name="lucide:clock" class="w-3.5 h-3.5" aria-hidden="true" />
                <span>{{ readTime }}</span>
              </div>
            </div>

            <!-- Content Slot / Prose -->
            <div class="tux-editorial__body tux-prose">
              <slot />
            </div>

            <!-- Tags / Topics Footer -->
            <div v-if="tags && tags.length > 0" class="tux-editorial__tags-region">
              <p class="tux-editorial__tags-title">TOPICS</p>
              <ul class="tux-editorial__tags-list" aria-label="Article topics">
                <li v-for="tag in tags" :key="tag">
                  <span class="tux-editorial__tag-pill">{{ tag }}</span>
                </li>
              </ul>
            </div>

            <!-- Institutional Contact Box (e.g. for logistics or research leads) -->
            <aside
              v-if="contact"
              class="tux-editorial__contact-card"
              aria-label="Article Contact"
            >
              <div class="tux-editorial__contact-badge">
                <Icon name="lucide:user" class="w-5 h-5" aria-hidden="true" />
              </div>
              <div class="tux-editorial__contact-copy">
                <p class="tux-editorial__contact-title">
                  {{ contact.title || 'For More Information' }}
                </p>
                <p v-if="contact.note" class="tux-editorial__contact-note">
                  {{ contact.note }}
                </p>
                <div class="tux-editorial__contact-details">
                  <span class="font-bold text-text-primary">{{ contact.name }}</span>
                  <a
                    v-if="contact.email"
                    :href="`mailto:${contact.email}`"
                    class="tux-editorial__contact-link"
                  >
                    {{ contact.email }}
                  </a>
                  <span v-if="contact.phone" class="text-text-muted">{{ contact.phone }}</span>
                </div>
              </div>
            </aside>

            <!-- Custom Article Footer Slot -->
            <div v-if="$slots.footer" class="tux-editorial__footer-slot">
              <slot name="footer" />
            </div>
          </article>

          <!-- Sticky Right Rail (TOC & Auxiliary Cards) -->
          <aside v-if="toc" class="tux-editorial__rail" aria-label="Article navigation and resources">
            <div class="tux-editorial__rail-sticky">
              <!-- Sticky Table of Contents -->
              <div class="tux-editorial__toc-wrapper">
                <TuxTOC
                  :target="tocTarget"
                  title="ON THIS PAGE"
                  variant="comm"
                />
              </div>

              <!-- Rail Slot (Newsletter, Related Links, or Quick Contact) -->
              <slot name="rail" />
            </div>
          </aside>
        </div>
      </div>
    </div>

    <!-- Circular Reading Progress Scroll-To-Top Button (EmDash Exact) -->
    <TuxScrollTop
      v-if="showScrollTop"
      :threshold="200"
      position="bottom-right"
    />
  </div>
</template>

<style scoped>
.tux-editorial-page {
  width: 100%;
  min-height: 100vh;
  background-color: var(--surface-page);
  color: var(--text-primary);
  font-family: var(--font-body);
}

.tux-editorial__container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1.25rem;
}

@media (min-width: 640px) {
  .tux-editorial__container {
    padding: 0 2rem;
  }
}

/* Pinned Reading Progress Bar */
.tux-editorial__progress-rail {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--surface-sunken);
  z-index: 50;
}

.tux-editorial__progress-bar {
  height: 100%;
  background: var(--brand-primary);
  transition: width 0.1s linear;
}

/* Nav / Breadcrumbs */
.tux-editorial__nav {
  padding-top: 1.5rem;
  padding-bottom: 0.5rem;
}

.tux-editorial__nav-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1.25rem;
}

@media (min-width: 640px) {
  .tux-editorial__nav-container {
    padding: 0 2rem;
  }
}

.tux-editorial__back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-bold);
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--brand-primary);
  text-decoration: none;
  min-height: 44px;
  padding: 0.5rem 0;
  transition: color 0.15s ease;
}

.tux-editorial__back-link:hover,
.tux-editorial__back-link:focus-visible {
  color: var(--brand-primary-deep);
  text-decoration: underline;
  outline: none;
}

.tux-editorial__back-arrow {
  font-size: 1.125rem;
  transition: transform 0.15s ease;
}

.tux-editorial__back-link:hover .tux-editorial__back-arrow {
  transform: translateX(-3px);
}

/* FULL-BLEED HERO */
.tux-editorial__hero-fullbleed {
  position: relative;
  width: 100%;
  min-height: 28rem;
  max-height: 36rem;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  background-color: var(--brand-primary-deep);
  margin-bottom: 2.5rem;
}

.tux-editorial__hero-fullbleed-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tux-editorial__hero-fullbleed-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--neutral-1000) 22%, transparent) 0%,
    color-mix(in srgb, var(--brand-primary-deep) 65%, transparent) 50%,
    color-mix(in srgb, var(--neutral-1000) 90%, transparent) 100%
  );
}

.tux-editorial__hero-fullbleed-content {
  position: relative;
  z-index: 10;
  width: 100%;
  padding-bottom: 3rem;
  padding-top: 4rem;
}

/* INSET BANNER HERO */
.tux-editorial__hero-banner {
  margin-bottom: 2rem;
}

.tux-editorial__banner-frame {
  width: 100%;
  aspect-ratio: 21 / 9;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--surface-border);
  background-color: var(--surface-sunken);
}

.tux-editorial__banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* SPLIT HERO HEADER */
.tux-editorial__header-split {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--surface-border);
}

@media (min-width: 1024px) {
  .tux-editorial__header-split {
    grid-template-columns: 1fr 1fr;
    gap: 3.5rem;
  }
}

.tux-editorial__split-copy {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tux-editorial__split-card {
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--surface-border);
  box-shadow: var(--elevation-rest);
}

.tux-editorial__split-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* STANDARD ARTICLE HEADER */
.tux-editorial__header {
  margin-bottom: 2.5rem;
  max-width: 52rem;
}

/* Category Badge (Authentic MyTTI Inside Lane pill) */
.tux-editorial__category-badge {
  display: inline-flex;
  align-items: center;
  background-color: var(--brand-primary);
  color: var(--neutral-0);
  font-family: var(--font-bold);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  padding: 0.3125rem 0.75rem;
  border-radius: var(--radius-xs, 2px);
  margin-bottom: 1.25rem;
  border-left: 3px solid var(--brand-accent);
}

/* Headline */
.tux-editorial__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 1.5rem + 2.5cqi, 3rem);
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  margin: 0 0 1rem;
}

.tux-editorial__title--inverted {
  color: var(--neutral-0);
  text-shadow: 0 2px 8px color-mix(in srgb, var(--neutral-1000) 50%, transparent);
}

/* Dek / Subtitle */
.tux-editorial__dek {
  font-size: clamp(1.125rem, 1rem + 0.5cqi, 1.3125rem);
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0 0 1.25rem;
  font-weight: 400;
}

.tux-editorial__dek--inverted {
  color: color-mix(in srgb, var(--neutral-0) 90%, transparent);
}

/* Metadata row */
.tux-editorial__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.tux-editorial__meta--inverted {
  color: color-mix(in srgb, var(--neutral-0) 80%, transparent);
}

.tux-editorial__dot {
  opacity: 0.6;
}

.tux-editorial__byline {
  font-family: var(--font-body);
  font-weight: 500;
}

/* BOXED HERO MEDIA (MyTTI 16:9 thumbnail) */
.tux-editorial__hero-boxed {
  margin-top: 2rem;
  margin-bottom: 1.5rem;
}

.tux-editorial__boxed-card {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--surface-border);
  box-shadow: var(--elevation-rest);
}

.tux-editorial__boxed-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.tux-editorial__caption {
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
  font-style: italic;
}

/* TWO-COLUMN EDITORIAL READING LAYOUT */
.tux-editorial__layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: start;
}

@media (min-width: 1024px) {
  .tux-editorial__layout {
    grid-template-columns: minmax(0, 1fr) 18rem;
    gap: 3.5rem;
  }

  .tux-editorial__layout--single {
    grid-template-columns: 1fr;
    max-width: 52rem;
  }
}

.tux-editorial__article {
  min-width: 0;
  max-width: 52rem;
}

/* Action / Share Bar */
.tux-editorial__action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  margin-bottom: 2rem;
  border-top: 1px solid var(--surface-border);
  border-bottom: 1px solid var(--surface-border);
}

.tux-editorial__actions-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.tux-editorial__btn-share {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  min-height: 44px;
  background-color: var(--surface-sunken);
  color: var(--text-primary);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  font-family: var(--font-bold);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s ease;
}

.tux-editorial__btn-share:hover,
.tux-editorial__btn-share:focus-visible {
  background-color: var(--surface-raised);
  border-color: var(--brand-primary);
  color: var(--brand-primary);
  outline: none;
}

.tux-editorial__read-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-family: var(--font-mono);
  color: var(--text-muted);
}

/* ARTICLE BODY PROSE STYLING */
.tux-editorial__body :deep(p:first-of-type) {
  font-size: 1.1875rem;
  line-height: 1.7;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.tux-editorial__body :deep(p) {
  font-size: 1.0625rem;
  line-height: 1.75;
  color: var(--text-primary);
  margin-bottom: 1.35rem;
}

.tux-editorial__body :deep(h2) {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  scroll-margin-top: 5rem;
  border-bottom: 2px solid var(--brand-accent);
  padding-bottom: 0.375rem;
  display: inline-block;
}

.tux-editorial__body :deep(h3) {
  font-family: var(--font-bold);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  scroll-margin-top: 5rem;
}

.tux-editorial__body :deep(ul) {
  list-style: none;
  padding-left: 0;
  margin: 1.25rem 0 1.75rem;
}

.tux-editorial__body :deep(ul li) {
  position: relative;
  padding-left: 1.75rem;
  margin-bottom: 0.75rem;
  font-size: 1.0625rem;
  line-height: 1.65;
  color: var(--text-primary);
}

.tux-editorial__body :deep(ul li::before) {
  content: "";
  position: absolute;
  left: 0.25rem;
  top: 0.625rem;
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--brand-primary);
  border-radius: 50%;
}

.tux-editorial__body :deep(a) {
  color: var(--brand-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 600;
  transition: color 0.15s ease;
}

.tux-editorial__body :deep(a:hover),
.tux-editorial__body :deep(a:focus-visible) {
  color: var(--brand-primary-deep);
  outline: none;
}

/* TOPICS / TAGS REGION */
.tux-editorial__tags-region {
  margin-top: 3.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--surface-border);
}

.tux-editorial__tags-title {
  font-family: var(--font-bold);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin: 0 0 1rem;
}

.tux-editorial__tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.tux-editorial__tag-pill {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  background-color: var(--surface-sunken);
  color: var(--text-primary);
  border: 1px solid var(--surface-border);
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 500;
  transition: all 0.15s ease;
}

.tux-editorial__tag-pill:hover {
  background-color: var(--surface-raised);
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}

/* CONTACT CARD (Logistics / Lead Researcher) */
.tux-editorial__contact-card {
  margin-top: 2.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.5rem;
  background-color: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-left: 4px solid var(--brand-primary);
  border-radius: var(--radius-sm);
}

.tux-editorial__contact-badge {
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--brand-primary);
  color: var(--neutral-0);
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.tux-editorial__contact-copy {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.tux-editorial__contact-title {
  font-family: var(--font-bold);
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--brand-primary);
  margin: 0;
}

.tux-editorial__contact-note {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 0;
}

.tux-editorial__contact-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  font-size: 0.9375rem;
  margin-top: 0.25rem;
}

.tux-editorial__contact-link {
  color: var(--brand-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* STICKY RIGHT RAIL */
.tux-editorial__rail {
  min-width: 0;
}

.tux-editorial__rail-sticky {
  position: sticky;
  top: 5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tux-editorial__toc-wrapper {
  background-color: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  padding: 1.25rem;
}

.tux-editorial__footer-slot {
  margin-top: 3rem;
}
</style>
