<script setup lang="ts">
// TuxCallout — pulled-aside editorial accent.
//
// A short statement that interrupts the body flow — a fact worth noting, a
// finding from a study, a quote from a stakeholder. Inline (sits in the
// reading column, doesn't break out into a side-rail).
//
// The leading rule on the left adopts the page's style signature:
//   - default: 2px soft-faded maroon gradient
//   - bold:    three stacked maroon bars (55% / 18% / 8% length)
//   - elegant: 8px diagonal maroon hash with vertical fade
//
// Use sparingly — the AggieUX guidance is ≤2 callouts per article. Each one
// breaks reading flow.

interface Props {
  /** Eyebrow kind. Maps to canonical labels: fact → "Worth noting",
   *  stat → "Key finding", quote → "Voice". Override with `eyebrow` if needed. */
  kind?: "fact" | "stat" | "quote";
  /** Custom eyebrow label. Overrides `kind`'s default mapping. */
  eyebrow?: string | null;
  /** Style variant — inherits from a `.style--bold|elegant` ancestor when
   *  not set, or set directly for per-component opt-in. */
  variant?: "default" | "bold" | "elegant";
}

const props = withDefaults(defineProps<Props>(), {
  kind: "fact",
  eyebrow: null,
  variant: "default",
});

const eyebrowLabel = computed(() => {
  if (props.eyebrow) return props.eyebrow;
  if (props.kind === "stat")  return "Key finding";
  if (props.kind === "quote") return "Voice";
  return "Worth noting";
});
</script>

<template>
  <aside
    class="tux-callout"
    :class="`tux-callout--${variant}`"
    role="note"
  >
    <div class="tux-callout__rule" aria-hidden="true">
      <!-- bold: three stacked bars -->
      <template v-if="variant === 'bold'">
        <span class="tux-callout__bar tux-callout__bar--1" />
        <span class="tux-callout__bar tux-callout__bar--2" />
        <span class="tux-callout__bar tux-callout__bar--3" />
      </template>
      <!-- elegant: diagonal hash (CSS-only, no children) -->
      <!-- default: gradient hairline (CSS-only, no children) -->
    </div>
    <div class="tux-callout__body">
      <p class="tux-callout__eyebrow">{{ eyebrowLabel }}</p>
      <div class="tux-callout__content">
        <slot />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.tux-callout {
  display: flex;
  gap: 1.375rem;
  padding: 0.5rem 0;
  margin: 0.75rem 0;
  max-width: 42.5rem;
}

.tux-callout__rule {
  flex-shrink: 0;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.375rem 0;
}

/* default: soft-faded maroon hairline gradient */
.tux-callout--default .tux-callout__rule {
  width: 2px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--brand-primary) 12%,
    var(--brand-primary) 88%,
    transparent 100%
  );
  opacity: 0.9;
}

/* bold: three stacked bars, decreasing length */
.tux-callout--bold .tux-callout__rule {
  width: 6px;
}
.tux-callout__bar {
  display: block;
  width: 6px;
  border-radius: 3px;
  background: var(--brand-primary);
}
.tux-callout__bar--1 { flex: 1 1 55%; }
.tux-callout__bar--2 { flex: 1 1 18%; opacity: 0.5; }
.tux-callout__bar--3 { flex: 1 1 8%;  opacity: 0.25; }

/* elegant: diagonal hash with vertical fade mask */
.tux-callout--elegant .tux-callout__rule {
  width: 8px;
  background-image: repeating-linear-gradient(
    45deg,
    var(--brand-accent) 0 1.4px,
    transparent 1.4px 7px
  );
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, black 12%, black 88%, transparent 100%);
          mask-image: linear-gradient(180deg, transparent 0%, black 12%, black 88%, transparent 100%);
  opacity: 0.85;
}

.tux-callout__body {
  flex: 1;
  padding: 0.25rem 0;
  min-width: 0;
}

.tux-callout__eyebrow {
  margin: 0 0 0.5rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--brand-primary);
}

.tux-callout__content {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.65;
  color: var(--text-primary);
}

.tux-callout__content :deep(p) {
  margin: 0 0 0.75rem;
}

.tux-callout__content :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
