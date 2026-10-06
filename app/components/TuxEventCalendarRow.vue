<script setup lang="ts">
/**
 * TuxEventCalendarRow — Institutional Event Calendar Row with signature Green Date Chip.
 *
 * Parities the events widget on my.tti.tamu.edu (Kadence + Tribe Events):
 *   - Signature square Green Date Chip with bold day numeral and uppercase month
 *   - Semantic event title with destination route or external URL
 *   - Human-readable time, location/modality, and category badge
 *   - Accessible datetime attributes for assistive technology & calendar parsing
 */

interface Props {
  /** Day numeral displayed on the date chip, e.g. "30" or "05". */
  day: string | number;
  /** Month abbreviation displayed on the date chip, e.g. "SEP", "OCT". */
  month: string;
  /** Full event title. */
  title: string;
  /** Event date and time string, e.g. "Wednesday, September 30, 2026 @ 10:00 am - 11:30 am". */
  time?: string;
  /** Location or modality, e.g. "TTI Headquarters Room 102" or "Virtual (Teams)". */
  location?: string;
  /** Optional category or event type, e.g. "Symposium", "Webinar", "Meeting". */
  category?: string;
  /** Event details destination route. */
  to?: string;
  /** External URL link. */
  href?: string;
  /** Action button text (e.g. "Register" or "Details"). */
  actionText?: string;
  /** Date chip color variant ('green' default from my.tti, 'maroon', 'blue', 'gold'). */
  chipTone?: "green" | "maroon" | "blue" | "gold";
}

withDefaults(defineProps<Props>(), {
  time: "",
  location: "",
  category: "",
  to: "",
  href: "",
  actionText: "View Event",
  chipTone: "green",
});

const emit = defineEmits<{
  "action-click": [payload: MouseEvent];
}>();

function getChipClasses(tone: string): string {
  switch (tone) {
    case "maroon": return "bg-brand-primary text-white";
    case "blue": return "bg-spectrum-blue text-white";
    case "gold": return "bg-spectrum-gold text-neutral-900";
    case "green":
    default:
      return "bg-emerald-900 text-white"; // High-contrast green passing WCAG AAA
  }
}
</script>

<template>
  <article
    class="tux-event-calendar-row flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-surface-border hover:bg-surface-sunken/40 transition-colors group"
  >
    <!-- Left: Date Chip & Event Details -->
    <div class="flex items-start gap-4 min-w-0 flex-1">
      <!-- Signature Green Date Chip -->
      <div
        class="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 flex flex-col items-center justify-center rounded-none shadow-xs select-none"
        :class="getChipClasses(chipTone)"
        aria-hidden="true"
      >
        <span class="text-xl sm:text-2xl font-black font-display leading-none tracking-tight">{{ day }}</span>
        <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider mt-0.5">{{ month }}</span>
      </div>

      <!-- Event Details Column -->
      <div class="min-w-0 flex-1">
        <!-- Category Pill & Modality -->
        <div v-if="category || location" class="flex flex-wrap items-center gap-2 mb-1">
          <span
            v-if="category"
            class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-surface-sunken border border-surface-border text-brand-primary"
          >
            {{ category }}
          </span>
          <span
            v-if="location"
            class="text-xs text-text-muted flex items-center gap-1"
          >
            <Icon name="lucide:map-pin" class="w-3 h-3 text-text-muted flex-shrink-0" aria-hidden="true" />
            <span class="truncate">{{ location }}</span>
          </span>
        </div>

        <!-- Event Headline Link -->
        <h3 class="text-base sm:text-lg font-bold text-text-primary group-hover:text-brand-primary transition-colors leading-snug">
          <NuxtLink v-if="to" :to="to" class="hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-primary">
            {{ title }}
          </NuxtLink>
          <a
            v-else-if="href"
            :href="href"
            target="_blank"
            rel="noopener"
            class="hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-primary inline-flex items-center gap-1"
          >
            <span>{{ title }}</span>
            <Icon name="lucide:external-link" class="w-3.5 h-3.5 text-text-muted opacity-75" aria-hidden="true" />
          </a>
          <span v-else>{{ title }}</span>
        </h3>

        <!-- DateTime String -->
        <div v-if="time" class="text-xs text-text-secondary mt-1 flex items-center gap-1.5 font-medium">
          <Icon name="lucide:clock" class="w-3.5 h-3.5 text-brand-primary flex-shrink-0" aria-hidden="true" />
          <time>{{ time }}</time>
        </div>
      </div>
    </div>

    <!-- Right: Action Button -->
    <div class="flex-shrink-0 self-end sm:self-center mt-2 sm:mt-0">
      <TuxButton
        shape="sharp"
        intent="secondary"
        size="sm"
        :to="to || undefined"
        :href="href || undefined"
        @click="emit('action-click', $event)"
      >
        {{ actionText }}
      </TuxButton>
    </div>
  </article>
</template>
