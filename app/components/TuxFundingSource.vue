<script setup lang="ts">
/**
 * TuxFundingSource — funder identity strip / chip.
 *
 * A small, brand-aligned badge for a funder (FHWA, TxDOT, NSF,
 * USDOT, etc.). Use as inline credit on research outputs, in a
 * `TuxAcknowledgments` block, or as a list at the bottom of a
 * paper / report.
 *
 * Three sizes (sm / md / lg) and two layouts (inline pill or
 * stacked badge). Optional logo + grant number.
 */
interface Props {
  /** Funder name. */
  funder: string;
  /** Short / abbreviated form (e.g. "FHWA", "NSF" for ARIA labels
   *  + extra-tight layouts). */
  abbrev?: string;
  /** Optional logo URL. */
  logo?: string;
  /** Optional grant / contract number. */
  grant?: string;
  /** Optional URL — wraps the badge in a link if set. */
  to?: string;
  /** Size. Default md. */
  size?: "sm" | "md" | "lg";
  /** Layout. Default "inline" (logo + name + grant on one row);
   *  "stacked" puts the logo above the name. */
  layout?: "inline" | "stacked";
}

const props = withDefaults(defineProps<Props>(), {
  abbrev: undefined,
  logo: undefined,
  grant: undefined,
  to: undefined,
  size: "md",
  layout: "inline",
});

const Wrapper = computed(() => (props.to ? "a" : "div"));
</script>

<template>
  <component
    :is="Wrapper"
    :href="to"
    :target="to && to.startsWith('http') ? '_blank' : undefined"
    :rel="to && to.startsWith('http') ? 'noopener' : undefined"
    class="tux-funding-source"
    :class="[`tux-funding-source--${size}`, `tux-funding-source--${layout}`]"
  >
    <div v-if="logo" class="tux-funding-source__logo-wrap">
      <img :src="logo" :alt="`${funder} logo`" class="tux-funding-source__logo" >
    </div>

    <div class="tux-funding-source__body">
      <p class="tux-funding-source__funder">
        <span v-if="abbrev && size === 'sm'" class="tux-funding-source__abbrev">{{ abbrev }}</span>
        <span v-else>{{ funder }}</span>
      </p>
      <p v-if="grant" class="tux-funding-source__grant">{{ grant }}</p>
    </div>
  </component>
</template>

<style scoped>
.tux-funding-source {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-sans);
  border: 1px solid var(--surface-border);
  background: var(--surface-page);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--text-primary);
  transition: border-color 80ms ease-out, background 80ms ease-out;
}

a.tux-funding-source:hover,
a.tux-funding-source:focus-visible {
  border-color: color-mix(in srgb, var(--brand-primary) 50%, var(--surface-border));
  background: color-mix(in srgb, var(--brand-primary) 4%, var(--surface-page));
  outline: none;
}

.tux-funding-source__logo-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-sunken);
  border-right: 1px solid var(--surface-border);
}

.tux-funding-source__logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.tux-funding-source__body {
  padding: 0.25rem 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tux-funding-source__funder {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}

.tux-funding-source__grant {
  margin: 0;
  font-family: var(--font-mono);
  color: var(--text-muted);
  line-height: 1.2;
}

/* ---- Sizes ---- */
.tux-funding-source--sm .tux-funding-source__logo-wrap {
  width: 1.5rem;
  height: 1.5rem;
}
.tux-funding-source--sm .tux-funding-source__funder { font-size: 0.6875rem; }
.tux-funding-source--sm .tux-funding-source__grant  { font-size: 0.625rem; }
.tux-funding-source--sm .tux-funding-source__body   { padding: 0.1875rem 0.4375rem; }

.tux-funding-source--md .tux-funding-source__logo-wrap {
  width: 2rem;
  height: 2rem;
}
.tux-funding-source--md .tux-funding-source__funder { font-size: 0.75rem; }
.tux-funding-source--md .tux-funding-source__grant  { font-size: 0.6875rem; }

.tux-funding-source--lg .tux-funding-source__logo-wrap {
  width: 2.5rem;
  height: 2.5rem;
}
.tux-funding-source--lg .tux-funding-source__funder { font-size: 0.875rem; }
.tux-funding-source--lg .tux-funding-source__grant  { font-size: 0.75rem; }
.tux-funding-source--lg .tux-funding-source__body   { padding: 0.375rem 0.625rem; }

/* ---- Stacked layout ---- */
.tux-funding-source--stacked {
  flex-direction: column;
  align-items: stretch;
  text-align: center;
}

.tux-funding-source--stacked .tux-funding-source__logo-wrap {
  width: 100%;
  border-right: none;
  border-bottom: 1px solid var(--surface-border);
  padding: 0.5rem;
}

.tux-funding-source--stacked .tux-funding-source__logo-wrap {
  height: 3rem;
}

@media (prefers-reduced-motion: reduce) {
  .tux-funding-source {
    transition: none;
  }
}
</style>
