<script setup lang="ts">
/**
 * TuxTileGrid — 6-Tile Service & Fundamentals Launcher Grid.
 *
 * Direct parity with the flagship 6-tile fundamentals grid on my.tti.tamu.edu:
 *   - 2 to 3 column responsive layout
 *   - Maroon icon header with warm-gold accent hover glow
 *   - Bold title and descriptive summary text
 *   - Accessible card interaction with focus ring and touch targets >= 44px
 */

export interface TuxTileItem {
  title: string;
  description?: string;
  icon?: string;
  to?: string;
  href?: string;
  badge?: string;
  badgeTone?: "maroon" | "gold" | "neutral" | "success";
}

interface Props {
  /** Optional section heading title above the grid. */
  title?: string;
  /** Optional subtitle or description. */
  subtitle?: string;
  /** Array of tile items (typically 3 to 6 tiles). */
  tiles?: TuxTileItem[];
  /** Grid column configuration on desktop: 2, 3 (default), or 4. */
  columns?: 2 | 3 | 4;
  /** Tile background style: 'eggshell' (intranet neutral surface) or 'raised' (white). */
  surface?: "eggshell" | "raised";
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  subtitle: "",
  columns: 3,
  surface: "eggshell",
  tiles: () => [
    {
      title: "Safety First",
      description: "Dedicated to zero-incident work environments and rigorous laboratory safety protocols.",
      icon: "lucide:shield-check",
      badge: "Core Value",
    },
    {
      title: "Ethical Integrity",
      description: "Transparent, objective, and unbiased scientific research serving public safety and trust.",
      icon: "lucide:scale",
      badge: "Standard",
    },
    {
      title: "Collaborative Spirit",
      description: "Partnering across academic disciplines, industry leaders, and state/federal transportation agencies.",
      icon: "lucide:users",
    },
    {
      title: "Research Excellence",
      description: "Pioneering state-of-the-art transportation innovations that shape national policy and infrastructure.",
      icon: "lucide:award",
    },
    {
      title: "Continuous Learning",
      description: "Fostering professional development, graduate mentorship, and ongoing workforce education.",
      icon: "lucide:book-open",
    },
    {
      title: "Public Stewardship",
      description: "Honoring our charter as a Texas state agency committed to taxpayer value and public mobility.",
      icon: "lucide:heart-handshake",
    },
  ],
});

const gridColumnsClass = computed(() => {
  switch (props.columns) {
    case 2: return "sm:grid-cols-2";
    case 4: return "sm:grid-cols-2 lg:grid-cols-4";
    case 3:
    default:
      return "sm:grid-cols-2 lg:grid-cols-3";
  }
});

const surfaceClass = computed(() => {
  return props.surface === "eggshell"
    ? "bg-surface-eggshell border-surface-border"
    : "bg-surface-raised border-surface-border";
});
</script>

<template>
  <section class="tux-tile-grid w-full my-6 select-none" :aria-label="title || 'Service Launcher'">
    <!-- Section Header (Optional) -->
    <div v-if="title || subtitle" class="mb-6">
      <TuxSectionHeader
        v-if="title"
        :title="title"
        :subtitle="subtitle || undefined"
        variant="two-tone-rule"
      />
    </div>

    <!-- Grid Container -->
    <div class="grid grid-cols-1 gap-4 sm:gap-6" :class="gridColumnsClass">
      <div
        v-for="tile in tiles"
        :key="tile.title"
        class="tux-tile group relative flex flex-col p-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-brand-primary"
        :class="surfaceClass"
      >
        <!-- Top Bar: Icon + Badge -->
        <div class="flex items-center justify-between gap-3 mb-4">
          <div class="p-3 bg-white dark:bg-neutral-800 border border-surface-border rounded-none text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors shadow-xs">
            <Icon
              :name="tile.icon || 'lucide:layers'"
              class="w-6 h-6 flex-shrink-0"
              aria-hidden="true"
            />
          </div>

          <span
            v-if="tile.badge"
            class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-brand-accent/40 bg-brand-accent/15 text-text-primary"
          >
            {{ tile.badge }}
          </span>
        </div>

        <!-- Title -->
        <h3 class="text-base sm:text-lg font-bold uppercase tracking-tight text-text-primary group-hover:text-brand-primary transition-colors mb-2 font-display">
          <NuxtLink
            v-if="tile.to"
            :to="tile.to"
            class="hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            {{ tile.title }}
          </NuxtLink>
          <a
            v-else-if="tile.href"
            :href="tile.href"
            target="_blank"
            rel="noopener"
            class="hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-primary inline-flex items-center gap-1"
          >
            <span>{{ tile.title }}</span>
            <Icon name="lucide:external-link" class="w-3.5 h-3.5 text-text-muted opacity-75" aria-hidden="true" />
          </a>
          <span v-else>{{ tile.title }}</span>
        </h3>

        <!-- Description -->
        <p v-if="tile.description" class="text-xs sm:text-sm text-text-secondary leading-relaxed flex-1">
          {{ tile.description }}
        </p>

        <!-- Bottom Accent Indicator -->
        <div class="mt-4 pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs font-semibold text-brand-primary">
          <NuxtLink
            v-if="tile.to"
            :to="tile.to"
            class="opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider text-[11px] hover:underline"
          >
            Explore &rarr;
          </NuxtLink>
          <a
            v-else-if="tile.href"
            :href="tile.href"
            target="_blank"
            rel="noopener"
            class="opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider text-[11px] hover:underline"
          >
            Explore &rarr;
          </a>
          <span v-else class="opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider text-[11px]">
            Explore &rarr;
          </span>
          <div class="w-2 h-2 bg-brand-accent transition-transform group-hover:scale-150" aria-hidden="true" />
        </div>
      </div>
    </div>
  </section>
</template>
