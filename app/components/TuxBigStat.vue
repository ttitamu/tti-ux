<script setup lang="ts">
// TuxBigStat — single oversized statistic.
//
// The institutional "headline metric" pattern: one big number, one tracked
// label. Companion to TuxFactoid (which renders a row of these). Single most
// recognizable TTI design move — pulled directly from the factsheets.
//
// Use for: dashboard hero metrics (total indexed bytes, scan counts), landing
// pages ("$126M annual research expenditure"), product overviews.

interface Props {
  value: string | number;
  /** Trailing unit. Renders smaller, in Work Sans, anchored to the baseline. */
  suffix?: string | null;
  /** Tracked-out label below the value. */
  label: string;
  /** Optional attribution / source line, italic 11px. */
  source?: string | null;
  /** Numeral face. Defaults to 'default' (Open Sans heavy). */
  variant?: "default" | "bold" | "elegant";
  /** Color of the numeral. Maroon is canonical; gold for emphasis;
   *  neutral for supporting metrics that shouldn't compete with brand stats. */
  tone?: "maroon" | "gold" | "neutral";
  /** Numeral size tier. `lg` = 144px (landing hero), `md` = 96px (dashboard
   *  hero), `sm` = 64px (in-card metric, sidebar widget). */
  size?: "lg" | "md" | "sm";
}

const props = withDefaults(defineProps<Props>(), {
  suffix: null,
  source: null,
  variant: "default",
  tone: "maroon",
  size: "md",
});

const sizes = {
  lg: { num: "9rem",   suf: "3rem",     lab: "1rem" },
  md: { num: "6rem",   suf: "2.25rem",  lab: "0.9375rem" },
  sm: { num: "4rem",   suf: "1.5rem",   lab: "0.875rem" },
} as const;

const sized = computed(() => sizes[props.size]);

const numeralStyle = computed(() => {
  if (props.variant === "bold") {
    return {
      fontFamily: "var(--font-bold)",
      fontWeight: 800,
      fontStyle: "italic",
      letterSpacing: "-0.015em",
    };
  }
  if (props.variant === "elegant") {
    return {
      fontFamily: "var(--font-elegant)",
      fontWeight: 400,
      fontStyle: "italic",
      letterSpacing: "-0.025em",
    };
  }
  return {
    fontFamily: "var(--font-body)",
    fontWeight: 700,
    fontStyle: "normal",
    letterSpacing: "-0.01em",
  };
});

const toneColor = computed(() => {
  if (props.tone === "gold")    return "var(--brand-accent)";
  if (props.tone === "neutral") return "var(--text-primary)";
  return "var(--brand-primary)";
});
</script>

<template>
  <div class="tux-big-stat">
    <span
      class="tux-big-stat__value"
      :style="{ ...numeralStyle, fontSize: sized.num, color: toneColor }"
    >{{ value }}<span
      v-if="suffix"
      class="tux-big-stat__suffix"
      :style="{ fontSize: sized.suf }"
    >{{ suffix }}</span></span>
    <p class="tux-big-stat__label" :style="{ fontSize: sized.lab }">{{ label }}</p>
    <p v-if="source" class="tux-big-stat__source">{{ source }}</p>
  </div>
</template>

<style scoped>
.tux-big-stat {
  display: flex;
  flex-direction: column;
}

.tux-big-stat__value {
  display: inline-flex;
  align-items: baseline;
  flex-wrap: nowrap;
  white-space: nowrap;
  line-height: 0.95;
}

.tux-big-stat__suffix {
  font-family: var(--font-bold);
  font-weight: 700;
  font-style: normal;
  line-height: 1;
  color: inherit;
  margin-left: 0.25rem;
  opacity: 0.85;
  white-space: nowrap;
}

.tux-big-stat__label {
  margin: 0.875rem 0 0;
  font-family: var(--font-body);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-secondary);
  line-height: 1.4;
}

.tux-big-stat__source {
  margin: 0.5rem 0 0;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  line-height: 1.4;
  color: var(--text-muted);
  font-style: italic;
}
</style>
