<script setup lang="ts">
/**
 * TuxEditorialArticle — Flagship publication and article reader component.
 *
 * Implements the modern TTI publication design language (MyTTI / Inside Lane / Kadence)
 * combined with EmDash CMS 1.0 reading ergonomics and cutting-edge "AI Modern"
 * research styles inspired by Google DeepMind, Anthropic Research, and OpenAI:
 *  - 5 Hero Image Layouts: 'boxed' (default MyTTI 16:9 card), 'full-bleed' (immersive banner),
 *    'split' (editorial two-column), 'inset-banner' (panoramic framed banner),
 *    and 'ai-modern' (luminous aura mesh, DeepMind/Anthropic meta, stats grid, and key findings),
 *    plus 'none'.
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

export interface EditorialStat {
  label: string;
  value: string;
  detail?: string;
}

export interface EditorialCitation {
  title?: string;
  authors?: string;
  journal?: string;
  year?: number | string;
  doi?: string;
  bibtex?: string;
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
  heroLayout?: "boxed" | "full-bleed" | "split" | "inset-banner" | "ai-modern" | "interactive-canvas" | "none";
  /** AI Modern metrics & statistics cluster */
  stats?: EditorialStat[];
  /** AI Modern key findings & takeaways */
  highlights?: string[];
  /** Academic & research citation reference */
  citation?: EditorialCitation;
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
  stats: () => [],
  highlights: () => [],
  citation: undefined,
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
const copiedBibtex = ref(false);
let copyTimeout: ReturnType<typeof setTimeout> | null = null;
let bibtexTimeout: ReturnType<typeof setTimeout> | null = null;
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

const formattedCitationText = computed(() => {
  if (!props.citation) return "";
  const c = props.citation;
  const authors = c.authors || (normalizedAuthors.value.map((a) => a.name).join(", "));
  const title = c.title || props.title;
  const year = c.year || (props.date ? new Date(props.date).getFullYear() : 2026);
  const journal = c.journal || "Texas A&M Transportation Institute Publications";
  return `${authors} (${year}). "${title}." ${journal}.`;
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

async function copyBibtex() {
  if (!props.citation?.bibtex || typeof window === "undefined" || !navigator.clipboard) return;
  try {
    await navigator.clipboard.writeText(props.citation.bibtex);
    copiedBibtex.value = true;
    if (bibtexTimeout) clearTimeout(bibtexTimeout);
    bibtexTimeout = setTimeout(() => {
      copiedBibtex.value = false;
    }, 2500);
  } catch {
    copiedBibtex.value = false;
  }
}




onMounted(() => {
  if (props.showReadingProgress && typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", handleScroll);
  }
  if (copyTimeout) clearTimeout(copyTimeout);
  if (bibtexTimeout) clearTimeout(bibtexTimeout);
  if (rafId !== null) cancelAnimationFrame(rafId);
});
</script>

<template>
  <div class="tux-editorial-page">
    <!-- Pinned Reading Progress Bar (Top of viewport) -->
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

    <!-- INTERACTIVE CANVAS HERO (OpenAI Sol Inspired Presentation) -->
    <header
      v-if="heroLayout === 'interactive-canvas'"
      class="tux-editorial__hero-canvas-wrapper"
    >
      <TuxHeroCanvas variant="sol" blend="seamless">
        <!-- Foreground Atmospheric Copy & Typography -->
      <div class="tux-editorial__canvas-content">
        <div class="tux-editorial__container">
          <div class="tux-editorial__ai-eyebrow tux-editorial__ai-eyebrow--sol">
            <span class="tux-editorial__ai-pill tux-editorial__ai-pill--sol">
              <span class="tux-editorial__ai-pulse" aria-hidden="true">
                <span class="tux-editorial__ai-pulse-ring" />
                <span class="tux-editorial__ai-pulse-dot" />
              </span>
              <span>{{ category || 'Research Index' }}</span>
            </span>
            <span class="tux-editorial__ai-kicker tux-editorial__ai-kicker--sol">TECHNICAL BRIEF</span>
          </div>

          <h1 class="tux-editorial__title tux-editorial__title--sol">
            {{ title }}
          </h1>

          <p v-if="dek" class="tux-editorial__dek tux-editorial__dek--sol">
            {{ dek }}
          </p>

          <div class="tux-editorial__ai-meta tux-editorial__ai-meta--sol">
            <div v-if="normalizedAuthors.length > 0" class="tux-editorial__ai-authors">
              <div
                v-for="auth in normalizedAuthors"
                :key="auth.name"
                class="tux-editorial__ai-author-chip tux-editorial__ai-author-chip--sol"
              >
                <span class="tux-editorial__ai-avatar tux-editorial__ai-avatar--sol" aria-hidden="true">
                  {{ auth.name.charAt(0) }}
                </span>
                <div class="tux-editorial__ai-author-info">
                  <span class="tux-editorial__ai-author-name tux-editorial__ai-author-name--sol">{{ auth.name }}</span>
                  <span v-if="auth.title || auth.role" class="tux-editorial__ai-author-role tux-editorial__ai-author-role--sol">
                    {{ auth.title || auth.role }}
                  </span>
                </div>
              </div>
            </div>

            <div class="tux-editorial__ai-meta-pills">
              <time v-if="date" :datetime="date" class="tux-editorial__ai-date tux-editorial__ai-date--sol">
                <Icon name="lucide:calendar" class="w-3.5 h-3.5" aria-hidden="true" />
                <span>{{ formattedDate }}</span>
              </time>
              <span v-if="readTime" class="tux-editorial__ai-readtime tux-editorial__ai-readtime--sol">
                <Icon name="lucide:sparkles" class="w-3.5 h-3.5" aria-hidden="true" />
                <span>{{ readTime }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      </TuxHeroCanvas>
    </header>

    <!-- MAIN EDITORIAL CONTENT GRID -->
    <div class="tux-editorial__main">
      <div class="tux-editorial__container">
        <!-- AI MODERN HERO TREATMENT (Google DeepMind / Anthropic / OpenAI Style) -->
        <header
          v-if="heroLayout === 'ai-modern'"
          class="tux-editorial__header-ai"
        >
          <!-- Ambient Luminous Mesh Aura -->
          <div class="tux-editorial__ai-aura" aria-hidden="true" />

          <!-- Eyebrow Bar: Pulse dot + Category pill -->
          <div class="tux-editorial__ai-eyebrow">
            <span class="tux-editorial__ai-pill">
              <span class="tux-editorial__ai-pulse" aria-hidden="true">
                <span class="tux-editorial__ai-pulse-ring" />
                <span class="tux-editorial__ai-pulse-dot" />
              </span>
              <span>{{ category || 'Research Intelligence' }}</span>
            </span>
            <span class="tux-editorial__ai-kicker">TECHNICAL BRIEF</span>
          </div>

          <!-- High-Impact Display Headline -->
          <h1 class="tux-editorial__title tux-editorial__title--ai">
            {{ title }}
          </h1>

          <!-- Sleek Dek / Subtitle -->
          <p v-if="dek" class="tux-editorial__dek tux-editorial__dek--ai">
            {{ dek }}
          </p>

          <!-- DeepMind / Anthropic Style Metadata Cluster -->
          <div class="tux-editorial__ai-meta">
            <div v-if="normalizedAuthors.length > 0" class="tux-editorial__ai-authors">
              <div
                v-for="auth in normalizedAuthors"
                :key="auth.name"
                class="tux-editorial__ai-author-chip"
              >
                <span class="tux-editorial__ai-avatar" aria-hidden="true">
                  {{ auth.name.charAt(0) }}
                </span>
                <div class="tux-editorial__ai-author-info">
                  <span class="tux-editorial__ai-author-name">{{ auth.name }}</span>
                  <span v-if="auth.title || auth.role" class="tux-editorial__ai-author-role">
                    {{ auth.title || auth.role }}
                  </span>
                </div>
              </div>
            </div>

            <div class="tux-editorial__ai-meta-pills">
              <time v-if="date" :datetime="date" class="tux-editorial__ai-date">
                <Icon name="lucide:calendar" class="w-3.5 h-3.5" aria-hidden="true" />
                <span>{{ formattedDate }}</span>
              </time>
              <span v-if="readTime" class="tux-editorial__ai-readtime">
                <Icon name="lucide:sparkles" class="w-3.5 h-3.5" aria-hidden="true" />
                <span>{{ readTime }}</span>
              </span>
            </div>
          </div>

          <!-- Framed Cinematic Hero Media -->
          <div v-if="heroImage" class="tux-editorial__ai-media">
            <div class="tux-editorial__ai-card">
              <img
                :src="heroImage"
                :alt="heroAlt || title"
                class="tux-editorial__ai-img"
              >
              <div v-if="heroCaption" class="tux-editorial__ai-caption-badge">
                <Icon name="lucide:info" class="w-3.5 h-3.5 text-brand-primary" aria-hidden="true" />
                <span>{{ heroCaption }}</span>
              </div>
            </div>
          </div>
        </header>

        <!-- SPLIT HERO TREATMENT (Title left, Image right) -->
        <header
          v-else-if="heroLayout === 'split' && heroImage"
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
          v-else-if="heroLayout !== 'full-bleed' && heroLayout !== 'interactive-canvas'"
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

            <!-- OpenAI / DeepMind Style Metric Stats Grid -->
            <div
              v-if="(stats && stats.length > 0) || $slots.stats"
              class="tux-editorial__stats-wrapper"
            >
              <slot name="stats">
                <div class="tux-editorial__stats-grid">
                  <div
                    v-for="stat in stats"
                    :key="stat.label"
                    class="tux-editorial__stat-card"
                  >
                    <span class="tux-editorial__stat-value">{{ stat.value }}</span>
                    <span class="tux-editorial__stat-label">{{ stat.label }}</span>
                    <span v-if="stat.detail" class="tux-editorial__stat-detail">{{ stat.detail }}</span>
                  </div>
                </div>
              </slot>
            </div>

            <!-- Google DeepMind / Anthropic Style Key Findings & Highlights -->
            <div
              v-if="(highlights && highlights.length > 0) || $slots.highlights"
              class="tux-editorial__highlights-card"
            >
              <slot name="highlights">
                <div class="tux-editorial__highlights-header">
                  <div class="tux-editorial__highlights-icon-badge" aria-hidden="true">
                    <Icon name="lucide:sparkles" class="w-4 h-4 text-brand-primary" />
                  </div>
                  <span class="tux-editorial__highlights-title">KEY RESEARCH FINDINGS &amp; AT A GLANCE</span>
                </div>
                <ul class="tux-editorial__highlights-list">
                  <li
                    v-for="(highlight, hIdx) in highlights"
                    :key="hIdx"
                    class="tux-editorial__highlights-item"
                  >
                    <span class="tux-editorial__highlights-bullet" aria-hidden="true">
                      <Icon name="lucide:check" class="w-3.5 h-3.5 text-brand-primary" />
                    </span>
                    <span class="tux-editorial__highlights-text">{{ highlight }}</span>
                  </li>
                </ul>
              </slot>
            </div>

            <!-- Content Slot / Prose -->
            <div class="tux-editorial__body tux-prose">
              <slot />
            </div>

            <!-- Anthropic Style Research Citation Block -->
            <div
              v-if="citation || $slots.citation"
              class="tux-editorial__citation-card"
            >
              <slot name="citation">
                <div class="tux-editorial__citation-header">
                  <div class="flex items-center gap-2">
                    <Icon name="lucide:book-open" class="w-4 h-4 text-brand-primary" aria-hidden="true" />
                    <span class="tux-editorial__citation-title">HOW TO CITE THIS RESEARCH</span>
                  </div>
                  <button
                    v-if="citation?.bibtex"
                    type="button"
                    class="tux-editorial__citation-copy-btn"
                    :aria-label="copiedBibtex ? 'BibTeX citation copied' : 'Copy BibTeX citation'"
                    @click="copyBibtex"
                  >
                    <Icon :name="copiedBibtex ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{{ copiedBibtex ? 'BibTeX Copied!' : 'Copy BibTeX' }}</span>
                  </button>
                </div>
                <p class="tux-editorial__citation-text">{{ formattedCitationText }}</p>
                <div v-if="citation?.doi" class="tux-editorial__citation-doi">
                  <span class="font-mono text-xs uppercase tracking-wider text-text-muted">DOI:</span>
                  <code class="tux-editorial__citation-code">{{ citation.doi }}</code>
                </div>
              </slot>
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
  border-radius: var(--radius-sm);
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

/* ══════════════════════════════════════════════════════════════════════════
   AI MODERN HERO PRESENTATION (Google DeepMind / Anthropic / OpenAI Style)
   ══════════════════════════════════════════════════════════════════════════ */
.tux-editorial__header-ai {
  position: relative;
  margin-bottom: 3rem;
  padding-top: 1rem;
}

.tux-editorial__ai-aura {
  position: absolute;
  top: -2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 64rem;
  height: 18rem;
  background: radial-gradient(
    ellipse at 50% 20%,
    color-mix(in srgb, var(--brand-primary) 12%, transparent) 0%,
    color-mix(in srgb, var(--brand-accent) 6%, transparent) 40%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}

.tux-editorial__ai-eyebrow {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.tux-editorial__ai-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--surface-raised);
  border: 1px solid var(--surface-border);
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-family: var(--font-bold);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-primary);
  box-shadow: var(--elevation-flat);
}

.tux-editorial__ai-pulse {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 8px;
  height: 8px;
}

.tux-editorial__ai-pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--brand-primary);
  opacity: 0.35;
  animation: tux-ai-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes tux-ai-ping {
  75%, 100% {
    transform: scale(2.2);
    opacity: 0;
  }
}

.tux-editorial__ai-pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--brand-primary);
}

.tux-editorial__ai-kicker {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--brand-primary);
}

.tux-editorial__title--ai {
  font-size: clamp(2.25rem, 1.75rem + 2.75cqi, 3.75rem);
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: 1.25rem;
  max-width: 64rem;
}

.tux-editorial__dek--ai {
  font-size: clamp(1.1875rem, 1.05rem + 0.5cqi, 1.375rem);
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 56rem;
  margin-bottom: 2rem;
}

.tux-editorial__ai-meta {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 2rem;
  padding: 1.125rem 0;
  border-top: 1px solid var(--surface-border);
  border-bottom: 1px solid var(--surface-border);
  margin-bottom: 2rem;
}

.tux-editorial__ai-authors {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
}

.tux-editorial__ai-author-chip {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.tux-editorial__ai-avatar {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background-color: var(--brand-primary);
  color: var(--neutral-0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-bold);
  font-size: 0.8125rem;
  font-weight: 700;
  flex-shrink: 0;
}

.tux-editorial__ai-author-info {
  display: flex;
  flex-direction: column;
}

.tux-editorial__ai-author-name {
  font-family: var(--font-bold);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.tux-editorial__ai-author-role {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.tux-editorial__ai-meta-pills {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.tux-editorial__ai-date,
.tux-editorial__ai-readtime {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background-color: var(--surface-sunken);
  padding: 0.3125rem 0.625rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
}

.tux-editorial__ai-media {
  position: relative;
  z-index: 1;
  margin-top: 2rem;
  margin-bottom: 1.5rem;
}

.tux-editorial__ai-card {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--surface-border);
  box-shadow: 0 16px 36px -12px color-mix(in srgb, var(--brand-primary) 12%, transparent);
  background-color: var(--surface-sunken);
}

.tux-editorial__ai-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.tux-editorial__ai-caption-badge {
  position: absolute;
  bottom: 0.875rem;
  left: 0.875rem;
  right: 0.875rem;
  max-width: calc(100% - 1.75rem);
  background-color: color-mix(in srgb, var(--surface-page) 90%, transparent);
  backdrop-filter: blur(8px);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.875rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* ══════════════════════════════════════════════════════════════════════════
   SOL INTERACTIVE CANVAS HERO (OpenAI GPT-6.1 Sol Inspired)
   ══════════════════════════════════════════════════════════════════════════ */
.tux-editorial__hero-canvas-wrapper {
  position: relative;
  width: 100%;
}

.tux-editorial__canvas-content {
  position: relative;
  z-index: 10;
  width: 100%;
  background: radial-gradient(ellipse 75% 65% at 30% 45%, color-mix(in srgb, var(--neutral-1000) 50%, transparent) 0%, transparent 80%);
}

.tux-editorial__ai-eyebrow--sol {
  margin-bottom: 1.5rem;
}

.tux-editorial__ai-pill--sol {
  background-color: color-mix(in srgb, var(--neutral-1000) 65%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid color-mix(in srgb, var(--neutral-0) 22%, transparent);
  color: var(--neutral-0);
}

.tux-editorial__ai-kicker--sol {
  color: color-mix(in srgb, var(--brand-accent) 85%, var(--neutral-0));
}

.tux-editorial__title--sol {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 2rem + 3cqi, 4.25rem);
  line-height: 1.06;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--neutral-0);
  text-shadow: 0 2px 14px color-mix(in srgb, var(--neutral-1000) 95%, transparent), 0 8px 32px color-mix(in srgb, var(--neutral-1000) 80%, transparent);
  margin-bottom: 1.25rem;
  max-width: 68rem;
}

.tux-editorial__dek--sol {
  font-size: clamp(1.2rem, 1.08rem + 0.6cqi, 1.45rem);
  line-height: 1.6;
  color: color-mix(in srgb, var(--neutral-0) 92%, transparent);
  text-shadow: 0 2px 14px color-mix(in srgb, var(--neutral-1000) 90%, transparent);
  max-width: 58rem;
  margin-bottom: 2.25rem;
}

.tux-editorial__ai-meta--sol {
  border-top-color: color-mix(in srgb, var(--neutral-0) 18%, transparent);
  border-bottom-color: color-mix(in srgb, var(--neutral-0) 18%, transparent);
  margin-bottom: 0;
}

.tux-editorial__ai-author-chip--sol {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background-color: color-mix(in srgb, var(--neutral-1000) 65%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 0.375rem 0.875rem 0.375rem 0.5rem;
  border-radius: var(--radius-full);
  border: 1px solid color-mix(in srgb, var(--neutral-0) 22%, transparent);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--neutral-1000) 50%, transparent);
}

.tux-editorial__ai-avatar--sol {
  background-color: color-mix(in srgb, var(--brand-accent) 80%, var(--neutral-0));
  color: var(--neutral-900);
}

.tux-editorial__ai-author-name--sol {
  color: var(--neutral-0);
  font-weight: 600;
}

.tux-editorial__ai-author-role--sol {
  color: color-mix(in srgb, var(--neutral-0) 75%, transparent);
}

.tux-editorial__ai-date--sol,
.tux-editorial__ai-readtime--sol {
  background-color: color-mix(in srgb, var(--neutral-1000) 65%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid color-mix(in srgb, var(--neutral-0) 22%, transparent);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--neutral-1000) 50%, transparent);
  color: var(--neutral-0);
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-full);
}


/* ══════════════════════════════════════════════════════════════════════════
   AI MODERN STATS GRID & KEY FINDINGS
   ══════════════════════════════════════════════════════════════════════════ */
.tux-editorial__stats-wrapper {
  margin-bottom: 2.5rem;
}

.tux-editorial__stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 1rem;
}

.tux-editorial__stat-card {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  background-color: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  box-shadow: var(--elevation-rest);
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.tux-editorial__stat-card:hover {
  border-color: var(--brand-primary);
  transform: translateY(-2px);
}

.tux-editorial__stat-value {
  font-family: var(--font-display);
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--brand-primary);
  line-height: 1.1;
  margin-bottom: 0.25rem;
}

.tux-editorial__stat-label {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-primary);
  margin-bottom: 0.375rem;
}

.tux-editorial__stat-detail {
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.4;
}

/* Google DeepMind / Anthropic Style Key Findings Card */
.tux-editorial__highlights-card {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background-color: color-mix(in srgb, var(--brand-primary) 4%, var(--surface-raised));
  border: 1px solid color-mix(in srgb, var(--brand-primary) 22%, var(--surface-border));
  border-left: 4px solid var(--brand-primary);
  border-radius: var(--radius-sm);
}

.tux-editorial__highlights-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1.125rem;
}

.tux-editorial__highlights-icon-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--radius-sm);
  background-color: color-mix(in srgb, var(--brand-primary) 12%, transparent);
}

.tux-editorial__highlights-title {
  font-family: var(--font-bold);
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--brand-primary);
}

.tux-editorial__highlights-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.tux-editorial__highlights-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-primary);
}

.tux-editorial__highlights-bullet {
  margin-top: 0.125rem;
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background-color: color-mix(in srgb, var(--brand-primary) 12%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tux-editorial__highlights-text {
  flex: 1;
}

/* Anthropic Style Citation Block */
.tux-editorial__citation-card {
  margin-top: 2.75rem;
  padding: 1.25rem 1.5rem;
  background-color: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
}

.tux-editorial__citation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.tux-editorial__citation-title {
  font-family: var(--font-bold);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--brand-primary);
}

.tux-editorial__citation-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  min-height: 44px;
  background-color: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.tux-editorial__citation-copy-btn:hover,
.tux-editorial__citation-copy-btn:focus-visible {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
  background-color: var(--surface-raised);
  outline: none;
}

.tux-editorial__citation-text {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0 0 0.5rem;
}

.tux-editorial__citation-doi {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
}

.tux-editorial__citation-code {
  background-color: var(--surface-sunken);
  padding: 0.125rem 0.375rem;
  border-radius: 2px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--brand-primary);
  border: 1px solid var(--surface-border);
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
