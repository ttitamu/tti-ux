<script setup lang="ts">
// TuxCTA — big promotional block.
//
// The loudest editorial surface short of a page header. Solid-color
// background, oversized heading, optional dek, an action area on the right
// (or below on narrow viewports). Use sparingly — it's meant to interrupt.
//
// Three tones map to the brand palette:
//   - maroon  (default) — TTI brand, inverted text. Strongest call.
//   - gold              — secondary brand, dark text. Friendlier "join us" tone.
//   - neutral           — sunken-gray ground, primary text. Quietest; for
//                         info-only blocks where the CTA isn't the point.
//
// Layout: 1.2fr / 1fr two-column at ≥48rem; stacks at narrower viewports.
// Pass any actions (one or more TuxButton, a form, a link list) into the
// `#actions` slot. Body sits in the default slot for prose flexibility,
// or use the `dek` prop for a quick one-line description.

interface Props {
  /** Eyebrow above the title. Tracked-out, lowercase by convention. */
  eyebrow?: string | null;
  /** Headline. Required — the CTA's reason to exist. */
  title: string;
  /** One- or two-sentence description. Optional; the default slot
   *  overrides this for richer body content. */
  dek?: string | null;
  /** Background tone. Defaults to maroon. */
  tone?: "maroon" | "gold" | "neutral";
  /** Style variant — Oswald (default) / Work Sans (bold) / Georgia (elegant). */
  variant?: "default" | "bold" | "elegant";
}

const props = withDefaults(defineProps<Props>(), {
  eyebrow: null,
  dek: null,
  tone: "maroon",
  variant: "default",
});

const headingClass = computed(() => {
  if (props.variant === "bold")    return "tux-cta__title heading--bold";
  if (props.variant === "elegant") return "tux-cta__title heading--elegant heading--elegant--italic";
  return "tux-cta__title heading--display";
});
</script>

<template>
  <section
    class="tux-cta"
    :class="[`tux-cta--${tone}`, `tux-cta--${variant}`]"
  >
    <div class="tux-cta__copy">
      <p v-if="eyebrow" class="tux-cta__eyebrow">{{ eyebrow }}</p>
      <h2 :class="headingClass">{{ title }}</h2>
      <p v-if="dek && !$slots.default" class="tux-cta__dek">{{ dek }}</p>
      <div v-if="$slots.default" class="tux-cta__body">
        <slot />
      </div>
    </div>
    <div v-if="$slots.actions" class="tux-cta__actions">
      <slot name="actions" />
    </div>
  </section>
</template>

<style scoped>
.tux-cta {
  container-type: inline-size;
  container-name: tux-cta;

  display: grid;
  gap: 2rem;
  padding: 1.75rem 1.75rem;
  border-radius: var(--radius-md);
}

@container tux-cta (min-width: 30rem) {
  .tux-cta { padding: 2.5rem 2.5rem; }
}

@container tux-cta (min-width: 44rem) {
  .tux-cta {
    grid-template-columns: 1.2fr 1fr;
    align-items: center;
    gap: 2.5rem;
    padding: 3rem 3.25rem;
  }
}

/* Tones --------------------------------------------------------- */
.tux-cta--maroon {
  background: var(--brand-primary);
  color: #fff;
}
.tux-cta--maroon .tux-cta__eyebrow,
.tux-cta--maroon .tux-cta__dek { color: rgba(255, 255, 255, 0.85); }
.tux-cta--maroon :deep(.tux-cta__title) { color: #fff; }

.tux-cta--gold {
  background: var(--brand-accent);
  color: #2A0E15;
}
.tux-cta--gold .tux-cta__eyebrow,
.tux-cta--gold .tux-cta__dek { color: rgba(42, 14, 21, 0.8); }
.tux-cta--gold :deep(.tux-cta__title) { color: #2A0E15; }

.tux-cta--neutral {
  background: var(--surface-sunken);
  color: var(--text-primary);
}
.tux-cta--neutral .tux-cta__eyebrow,
.tux-cta--neutral .tux-cta__dek { color: var(--text-secondary); }

/* Copy column --------------------------------------------------- */
.tux-cta__eyebrow {
  margin: 0 0 1rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.tux-cta__title {
  margin: 0;
  font-size: clamp(1.625rem, 1.1rem + 2.6cqi, 2.5rem);
  line-height: 1.1;
}

.tux-cta__dek {
  margin: 1.25rem 0 0;
  max-width: 32rem;
  font-family: var(--font-body);
  font-size: 0.96875rem;
  line-height: 1.65;
}

.tux-cta__body {
  margin-top: 1.25rem;
  font-family: var(--font-body);
  font-size: 0.96875rem;
  line-height: 1.65;
  max-width: 32rem;
}

/* Actions column ----------------------------------------------- */
.tux-cta__actions {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  align-items: flex-start;
}

@container tux-cta (min-width: 44rem) {
  .tux-cta__actions {
    align-items: stretch;
  }
}
</style>
