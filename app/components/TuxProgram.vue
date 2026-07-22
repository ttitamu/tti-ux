<script setup lang="ts">
/**
 * TuxProgram — research-program identity card.
 *
 * The "what is this program / initiative" card. Sits between
 * `TuxLab` (organizational unit) and individual project pages.
 * Surfaces program name + dek + lead researcher(s) + funder
 * badges + key metrics (publications, datasets, sites).
 *
 * Three layouts:
 *   - **default** — full card with hero image, dek, metrics
 *   - **compact** — title + dek only (for index pages)
 *   - **featured** — large hero with overlaid title (for landing
 *     pages)
 */
interface Props {
  /** Program name. */
  name: string;
  /** Eyebrow above the title (e.g. "Active program · 2024-2027"). */
  eyebrow?: string;
  /** One- to three-sentence summary. */
  summary?: string;
  /** Hero image URL. */
  hero?: string;
  /** Lead PI name(s). */
  leads?: string[];
  /** Funder names (rendered as small badges). */
  funders?: string[];
  /** Key metrics — 2-4 entries. */
  metrics?: Array<{ label: string; value: string | number }>;
  /** Route to the program page. */
  to?: string;
  /** Layout variant. Default "default". */
  layout?: "default" | "compact" | "featured";
}

withDefaults(defineProps<Props>(), {
  eyebrow: undefined,
  summary: undefined,
  hero: undefined,
  leads: undefined,
  funders: undefined,
  metrics: undefined,
  to: undefined,
  layout: "default",
});
</script>

<template>
  <article
    class="tux-program"
    :class="`tux-program--${layout}`"
  >
    <div v-if="hero" class="tux-program__hero-wrap">
      <img :src="hero" :alt="name" class="tux-program__hero" loading="lazy" >
      <div v-if="layout === 'featured'" class="tux-program__hero-overlay">
        <p v-if="eyebrow" class="eyebrow tux-program__hero-eyebrow">{{ eyebrow }}</p>
        <h3 class="tux-program__hero-title">
          <NuxtLink v-if="to" :to="to">{{ name }}</NuxtLink>
          <template v-else>{{ name }}</template>
        </h3>
      </div>
    </div>

    <div v-if="layout !== 'featured' || !hero" class="tux-program__body">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h3 class="tux-program__title">
        <NuxtLink v-if="to" :to="to" class="link-tti">{{ name }}</NuxtLink>
        <template v-else>{{ name }}</template>
      </h3>
      <p v-if="summary" class="tux-program__summary">{{ summary }}</p>

      <p v-if="leads && leads.length" class="tux-program__leads">
        <span class="tux-program__leads-label">Lead</span>{{ leads.length > 1 ? "s" : "" }}:
        <span class="tux-program__leads-list">{{ leads.join(", ") }}</span>
      </p>

      <ul v-if="metrics && metrics.length" class="tux-program__metrics">
        <li v-for="m in metrics" :key="m.label">
          <span class="tux-program__metric-value">{{ m.value }}</span>
          <span class="tux-program__metric-label">{{ m.label }}</span>
        </li>
      </ul>

      <div v-if="funders && funders.length" class="tux-program__funders">
        <p class="eyebrow">Funded by</p>
        <div class="tux-program__funders-list">
          <span v-for="funder in funders" :key="funder" class="tux-program__funder">{{ funder }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.tux-program {
  font-family: var(--font-sans);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tux-program__hero-wrap {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--surface-sunken);
  overflow: hidden;
}

.tux-program__hero {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.tux-program__body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tux-program__title {
  font-family: var(--font-display, var(--font-sans));
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.25;
}

.tux-program__title :deep(a) {
  color: inherit;
  text-decoration: none;
}

.tux-program__title :deep(a:hover) {
  color: var(--brand-primary);
}

.tux-program__summary {
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--text-secondary);
  margin: 0;
}

.tux-program__leads {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0;
}

.tux-program__leads-label {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  font-size: 0.6875rem;
  color: var(--text-muted);
}

.tux-program__leads-list {
  margin-left: 0.375rem;
}

.tux-program__metrics {
  list-style: none;
  margin: 0;
  padding: 0.625rem 0;
  border-top: 1px solid var(--surface-border);
  border-bottom: 1px solid var(--surface-border);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
  gap: 0.5rem;
}

.tux-program__metrics li {
  display: flex;
  flex-direction: column;
}

.tux-program__metric-value {
  font-family: var(--font-display, var(--font-sans));
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--brand-primary);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.tux-program__metric-label {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  color: var(--text-muted);
  margin-top: 0.125rem;
}

.tux-program__funders-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.25rem;
}

.tux-program__funder {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  padding: 0.125rem 0.5rem;
  border-radius: 2px;
}

/* ---- Featured layout: title overlay on hero ---- */
.tux-program--featured {
  min-height: 18rem;
}

.tux-program--featured .tux-program__hero-wrap {
  flex: 1;
  aspect-ratio: auto;
}

.tux-program__hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  background: linear-gradient(to top, rgb(0 0 0 / 0.55), rgb(0 0 0 / 0.1) 60%, transparent);
  color: #fff;
}

.tux-program__hero-eyebrow {
  color: rgb(255 255 255 / 0.85);
  margin-bottom: 0.25rem;
}

.tux-program__hero-title {
  font-family: var(--font-display, var(--font-sans));
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.15;
  color: #fff;
}

.tux-program__hero-title :deep(a) {
  color: inherit;
  text-decoration: none;
}

.tux-program__hero-title :deep(a:hover) {
  color: var(--brand-accent, #fbbf24);
}

/* ---- Compact layout ---- */
.tux-program--compact .tux-program__body {
  padding: 1rem;
  gap: 0.375rem;
}

.tux-program--compact .tux-program__title {
  font-size: 1rem;
}

.tux-program--compact .tux-program__summary {
  font-size: 0.8125rem;
}

.tux-program--compact .tux-program__hero-wrap {
  display: none;
}

.tux-program--compact .tux-program__metrics,
.tux-program--compact .tux-program__funders {
  display: none;
}
</style>
