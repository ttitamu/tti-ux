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
  /** Optional statistical sample size n (e.g. 14200 or "240 stations"). */
  sampleSize?: number | string | null;
  /** Optional confidence interval (e.g. "± 1.2% (95% CI)"). */
  confidenceInterval?: string | null;
  /** Optional DOI or sponsored project ID (e.g. "TxDOT 0-7142"). */
  doi?: string | null;
  /** Optional TTI 5-band research division accent ("maroon" | "blue" | "teal" | "green" | "gold"). */
  division?: "maroon" | "blue" | "teal" | "green" | "gold";
}

const props = withDefaults(defineProps<Props>(), {
  suffix: null,
  source: null,
  variant: "default",
  tone: "maroon",
  size: "md",
  sampleSize: null,
  confidenceInterval: null,
  doi: null,
  division: undefined,
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

const divisionColorMap: Record<NonNullable<Props["division"]>, string> = {
  maroon: "var(--spectrum-maroon, var(--brand-primary))",
  blue: "var(--spectrum-blue, var(--brand-secondary))",
  teal: "var(--spectrum-teal, var(--brand-primary))",
  green: "var(--spectrum-green, var(--color-success))",
  gold: "var(--spectrum-gold, var(--brand-accent))",
};

const toneColor = computed(() => {
  if (props.division) return divisionColorMap[props.division];
  if (props.tone === "gold")    return "var(--brand-accent)";
  if (props.tone === "neutral") return "var(--text-primary)";
  return "var(--brand-primary)";
});

const formattedSampleSize = computed(() => {
  if (props.sampleSize == null || props.sampleSize === "") return null;
  if (typeof props.sampleSize === "number") {
    return `n = ${props.sampleSize.toLocaleString("en-US")}`;
  }
  return `n = ${props.sampleSize}`;
});

const hasProvenancePills = computed(
  () => Boolean(formattedSampleSize.value) || Boolean(props.confidenceInterval) || Boolean(props.doi),
);
</script>

<template>
  <div
    class="tux-big-stat"
    :class="division ? `tux-big-stat--division tux-big-stat--division-${division}` : ''"
  >
    <span
      class="tux-big-stat__value"
      :style="{ ...numeralStyle, fontSize: sized.num, color: toneColor }"
    >{{ value }}<span
      v-if="suffix"
      class="tux-big-stat__suffix"
      :style="{ fontSize: sized.suf }"
    >{{ suffix }}</span></span>
    <p class="tux-big-stat__label" :style="{ fontSize: sized.lab }">{{ label }}</p>
    <div v-if="hasProvenancePills" class="tux-big-stat__provenance">
      <span v-if="confidenceInterval" class="tux-big-stat__pill">
        {{ confidenceInterval }}
      </span>
      <span v-if="formattedSampleSize" class="tux-big-stat__pill">
        {{ formattedSampleSize }}
      </span>
      <span v-if="doi" class="tux-big-stat__pill">
        {{ doi }}
      </span>
    </div>
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
  font-variant-numeric: tabular-nums;
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

.tux-big-stat__provenance {
  margin-top: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.tux-big-stat__pill {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  padding: 0.125rem 0.4375rem;
  border-radius: var(--radius-sm);
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
