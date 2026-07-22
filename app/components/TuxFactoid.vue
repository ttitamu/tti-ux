<script setup lang="ts">
// TuxFactoid — institutional "by the numbers" block.
// One row of oversized statistics; numeral face changes per style variant.
//
// Three densities:
//   - 3-up · large numerals (96px)  — landing pages, hero stats
//   - 4-up · medium (72px)          — section breaks
//   - 5-up · small (56px)           — compact summaries, dashboards

interface FactoidItem {
  value: string | number;
  suffix?: string | null;
  label: string;
  source?: string | null;
}

interface Props {
  items: FactoidItem[];
  /** Numeral face. Defaults to 'default' (Open Sans heavy). */
  variant?: "default" | "bold" | "elegant";
  /** Number of columns / sizing tier. */
  density?: 3 | 4 | 5;
  /** Eyebrow text shown above the title. Optional. */
  eyebrow?: string;
  /** Block heading. Optional — omit for a bare grid. */
  title?: string;
  /** 1–2 sentence dek under the heading. Optional. */
  dek?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  density: 3,
  eyebrow: undefined,
  title: undefined,
  dek: undefined,
});

// Per-density sizing tier. `min` is the cell's minimum column width — below
// it the grid wraps to fewer columns rather than crushing the numerals into
// the suffix. The minmax(min, 1fr) approach lets CSS handle wrapping without
// JS viewport math.
const sizes = {
  3: { num: "6rem",   suf: "2.25rem",  lab: "0.9375rem", gap: "2.5rem",  min: "16rem" },
  4: { num: "4.5rem", suf: "1.75rem",  lab: "0.875rem",  gap: "1.75rem", min: "12rem" },
  5: { num: "3.5rem", suf: "1.375rem", lab: "0.8125rem", gap: "1.5rem",  min: "9.5rem" },
} as const;

const sized = computed(() => sizes[props.density]);

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

const headingClass = computed(() => {
  if (props.variant === "bold")    return "heading--bold";
  if (props.variant === "elegant") return "heading--elegant heading--elegant--italic";
  return "heading--display";
});

const visible = computed(() => props.items.slice(0, props.density));
</script>

<template>
  <section class="tux-factoid" :class="`tux-factoid--${variant}`">
    <header
      v-if="eyebrow || title || dek"
      class="tux-factoid__header"
    >
      <p v-if="eyebrow" class="eyebrow tux-factoid__eyebrow">{{ eyebrow }}</p>
      <h2 v-if="title" :class="headingClass" class="tux-factoid__title">{{ title }}</h2>
      <p v-if="dek" class="tux-factoid__dek">{{ dek }}</p>
    </header>

    <div
      class="tux-factoid__grid"
      :style="{
        gridTemplateColumns: `repeat(auto-fit, minmax(${sized.min}, 1fr))`,
        gap: sized.gap,
      }"
    >
      <article
        v-for="(item, idx) in visible"
        :key="idx"
        class="tux-factoid__cell"
      >
        <span
          class="tux-factoid__value"
          :style="{ ...numeralStyle, fontSize: sized.num }"
        >{{ item.value }}<span
          v-if="item.suffix"
          class="tux-factoid__suffix"
          :style="{ fontSize: sized.suf }"
        >{{ item.suffix }}</span></span>
        <p
          class="tux-factoid__label"
          :style="{ fontSize: sized.lab }"
        >{{ item.label }}</p>
        <p v-if="item.source" class="tux-factoid__source">{{ item.source }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.tux-factoid__header {
  margin-bottom: 2.25rem;
  max-width: 45rem;
}

.tux-factoid__title {
  margin: 0 0 0.75rem;
  font-size: 2.25rem;
  line-height: 1.15;
  color: var(--text-primary);
}

.tux-factoid__dek {
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.96875rem;
  line-height: 1.65;
  color: var(--text-secondary);
  max-width: 38rem;
}

.tux-factoid__grid {
  display: grid;
  padding-top: 0.25rem;
}

.tux-factoid__cell {
  padding-right: 0.75rem;
}

.tux-factoid__value {
  display: inline-flex;
  align-items: baseline;
  flex-wrap: nowrap;
  white-space: nowrap;
  line-height: 0.95;
  color: var(--brand-primary);
}

.tux-factoid__suffix {
  font-family: var(--font-bold);
  font-weight: 700;
  font-style: normal;
  line-height: 1;
  color: inherit;
  margin-left: 0.25rem;
  opacity: 0.85;
  white-space: nowrap;
}

.tux-factoid__label {
  margin: 0.75rem 0 0;
  font-family: var(--font-body);
  line-height: 1.5;
  color: var(--text-secondary);
  font-weight: 500;
}

.tux-factoid__source {
  margin: 0.5rem 0 0;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  line-height: 1.4;
  color: var(--text-muted);
  font-style: italic;
}
</style>
