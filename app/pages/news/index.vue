<script setup lang="ts">
/**
 * News & Publications Feed — Inside Lane and Research Bulletins
 * Demonstrates the modern TTI news/newsletter/feed style with interactive
 * category filtering, featured hero story, and TuxNewsCollection integration.
 */

useHead({
  title: "Inside Lane · TTI News & Editorial Feed",
});

const selectedCategory = ref("All");
const searchQuery = ref("");
const viewLayout = ref<"stacked" | "grid">("stacked");

const categories = ["All", "Inside Lane", "Research Computing", "Talent Development", "Announcements"];

const articles = [
  {
    slug: "next-gen-computing-cluster-expands-transportation-ai",
    title: "Next-Gen Computing Cluster Expands Transportation AI Capabilities",
    category: "Research Computing",
    dek: "High-performance GPU infrastructure delivers accelerated computing power to advance real-time traffic modeling, predictive safety analytics, and connected vehicle simulations across research teams.",
    date: "2026-10-01",
    dateLabel: "Oct 1, 2026",
    readTime: "3 min read",
    image: "/resources/news/computing-cluster.jpg",
    alt: "High-performance GPU cluster server architecture",
    tone: "maroon" as const,
    featured: true,
  },
  {
    slug: "project-lifecycle-management-tools-and-fall-workshops",
    title: "Project Lifecycle Management Tools & Fall Workshop Series Announced",
    category: "Talent Development",
    dek: "Updated research administration tools, resource planning dashboards, and role-based training workshops roll out to strengthen project delivery and fiscal stewardship.",
    date: "2026-09-24",
    dateLabel: "Sep 24, 2026",
    readTime: "4 min read",
    image: "/resources/news/project-lifecycle.svg",
    alt: "Project lifecycle management and workshop timeline diagram",
    tone: "gold" as const,
    featured: false,
  },
  {
    slug: "twelve-county-roadway-study",
    title: "Twelve-County Roadway Study Reaches 36-Month Follow-Up Window",
    category: "Announcements",
    dek: "Compliance gains held steady; three of twelve test sites demonstrated measurable reductions in night-time crash frequency.",
    date: "2026-09-18",
    dateLabel: "Sep 18, 2026",
    readTime: "5 min read",
    tone: "maroon" as const,
    featured: false,
  },
  {
    slug: "freight-corridor-sensor-instrumentation",
    title: "412-Mile Freight Corridor Enters Second Phase of Instrumentation",
    category: "Research Computing",
    dek: "MovementLab announces the next deployment window for continuous-instrumentation sensors across the Texas Triangle network.",
    date: "2026-09-04",
    dateLabel: "Sep 4, 2026",
    readTime: "4 min read",
    tone: "charcoal" as const,
    featured: false,
  },
];

const featuredArticle = computed(() => articles.find((a) => a.featured) || articles[0]);

const filteredArticles = computed(() => {
  return articles.filter((art) => {
    const matchesCategory =
      selectedCategory.value === "All" || art.category === selectedCategory.value;
    const matchesSearch =
      !searchQuery.value ||
      art.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      art.dek.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesCategory && matchesSearch;
  });
});

const collectionItems = computed(() => {
  return filteredArticles.value.map((a) => ({
    date: a.date,
    dateLabel: a.dateLabel,
    title: a.title,
    category: a.category,
    dek: a.dek,
    to: `/news/${a.slug}`,
    image: a.image,
    alt: a.alt,
    tone: a.tone,
  }));
});
</script>

<template>
  <div class="min-h-screen bg-surface-page text-text-primary">
    <!-- Masthead / Feed Header -->
    <header class="border-b border-surface-border bg-surface-raised">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-2 mb-3">
              <span class="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-brand-primary text-white rounded-xs">
                INSIDE LANE
              </span>
              <span class="text-xs font-mono text-text-muted">TTI Publication Feed</span>
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold font-display uppercase tracking-tight text-text-primary m-0">
              News & Research Highlights
            </h1>
            <p class="mt-2 text-base text-text-secondary max-w-2xl">
              Official publications, computational infrastructure breakthroughs, and operational updates from the Texas A&amp;M Transportation Institute.
            </p>
          </div>

          <!-- Newsletter Subscribe Callout -->
          <div class="p-4 bg-surface-sunken border border-surface-border rounded-sm max-w-sm w-full">
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-primary font-display mb-1">
              <Icon name="lucide:mail" class="w-4 h-4" aria-hidden="true" />
              <span>Inside Lane Digest</span>
            </div>
            <p class="text-xs text-text-secondary mb-3 leading-relaxed">
              Receive weekly research briefings and internal announcements directly in your inbox.
            </p>
            <div class="flex gap-2">
              <input
                type="email"
                placeholder="netid@tamu.edu"
                aria-label="Email address for Inside Lane Digest"
                class="flex-1 min-h-[38px] text-xs px-2.5 bg-surface-raised border border-surface-border rounded-xs text-text-primary focus:outline-none focus:border-brand-primary"
              >
              <button
                type="button"
                class="min-h-[38px] px-3 text-xs font-bold uppercase tracking-wider bg-brand-primary text-white rounded-xs hover:bg-brand-primary-deep transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <!-- FEATURED HERO PUBLICATION CARD -->
      <section v-if="featuredArticle" aria-label="Featured Story" class="p-6 sm:p-8 bg-surface-raised border border-surface-border rounded-md shadow-xs">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-7 space-y-4">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-brand-accent text-brand-primary font-mono rounded-xs">
                FEATURED STORY
              </span>
              <time :datetime="featuredArticle.date" class="text-xs font-mono text-text-muted">
                {{ featuredArticle.dateLabel }}
              </time>
              <span class="text-xs font-mono text-text-muted" aria-hidden="true">·</span>
              <span class="text-xs font-mono text-text-muted">{{ featuredArticle.readTime }}</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold font-display uppercase tracking-tight text-text-primary">
              <NuxtLink :to="`/news/${featuredArticle.slug}`" class="hover:text-brand-primary transition-colors">
                {{ featuredArticle.title }}
              </NuxtLink>
            </h2>
            <p class="text-sm sm:text-base text-text-secondary leading-relaxed">
              {{ featuredArticle.dek }}
            </p>
            <div class="pt-2">
              <NuxtLink
                :to="`/news/${featuredArticle.slug}`"
                class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-brand-primary text-white rounded-xs hover:bg-brand-primary-deep transition-all"
              >
                <span>Read Full Article</span>
                <span aria-hidden="true">→</span>
              </NuxtLink>
            </div>
          </div>

          <div v-if="featuredArticle.image" class="lg:col-span-5">
            <NuxtLink :to="`/news/${featuredArticle.slug}`" class="block aspect-video rounded-sm overflow-hidden border border-surface-border shadow-xs hover:opacity-95 transition-opacity">
              <img
                :src="featuredArticle.image"
                :alt="featuredArticle.alt"
                class="w-full h-full object-cover"
              >
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- FILTER & SEARCH BAR -->
      <section aria-label="Filter Articles" class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
        <!-- Category Chips -->
        <div class="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter by topic">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            role="tab"
            :aria-selected="selectedCategory === cat"
            class="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all"
            :class="selectedCategory === cat ? 'bg-brand-primary text-white' : 'bg-surface-sunken text-text-secondary hover:text-text-primary hover:bg-surface-raised border border-surface-border'"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Search & Layout Controls -->
        <div class="flex items-center gap-3">
          <div class="relative w-full sm:w-60">
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search feed..."
              aria-label="Search articles"
              class="w-full text-xs px-3 py-1.5 pl-8 bg-surface-sunken border border-surface-border rounded-sm text-text-primary focus:outline-none focus:border-brand-primary"
            >
            <Icon name="lucide:search" class="w-3.5 h-3.5 absolute left-2.5 top-2 text-text-muted" aria-hidden="true" />
          </div>

          <div class="flex items-center border border-surface-border rounded-sm bg-surface-sunken p-0.5">
            <button
              type="button"
              class="p-1.5 rounded-xs transition-colors"
              :class="viewLayout === 'stacked' ? 'bg-surface-raised text-brand-primary shadow-xs' : 'text-text-muted hover:text-text-primary'"
              aria-label="Stacked view"
              @click="viewLayout = 'stacked'"
            >
              <Icon name="lucide:list" class="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              class="p-1.5 rounded-xs transition-colors"
              :class="viewLayout === 'grid' ? 'bg-surface-raised text-brand-primary shadow-xs' : 'text-text-muted hover:text-text-primary'"
              aria-label="Grid view"
              @click="viewLayout = 'grid'"
            >
              <Icon name="lucide:layout-grid" class="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <!-- FEED STREAM -->
      <section aria-label="Articles Feed">
        <div v-if="collectionItems.length > 0">
          <TuxNewsCollection
            :items="collectionItems"
            :layout="viewLayout"
            :columns="3"
            read-more="Read publication"
          />
        </div>
        <div v-else class="text-center py-12 border border-dashed border-surface-border rounded-md">
          <p class="text-sm text-text-muted">No articles found matching "{{ searchQuery }}".</p>
        </div>
      </section>
    </div>

    <!-- Scroll To Top Dial -->
    <TuxScrollTop position="bottom-right" />
  </div>
</template>
