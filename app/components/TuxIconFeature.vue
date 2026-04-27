<script setup lang="ts">
// TuxIconFeature — icon + headline + body grid.
//
// The classic "our services" / "focus areas" block. Each item: a Lucide
// icon in a tinted circle, a short headline, a 1–2-sentence body, and an
// optional CTA link.
//
// Two layouts:
//   - grid (default) — 2/3/4-column card grid. Right for landing pages
//                      that need to introduce multiple capabilities at once.
//   - list           — vertical stack with icons on the left. Denser; right
//                      for sidebars and inline content where a grid would
//                      feel too marketing-y.
//
// Icons are Lucide via @nuxt/icon. Pass `name="lucide:radar"` etc.

interface FeatureItem {
  /** Lucide icon name, e.g. "lucide:radar". */
  icon: string;
  /** Short headline. Required. */
  title: string;
  /** 1–2 sentence body. Optional. */
  body?: string;
  /** Optional CTA link. */
  cta?: { label: string; to?: string; href?: string };
  /** Icon circle tone. Cycles maroon/gold/navy by default. */
  tone?: "maroon" | "gold" | "navy";
}

interface Props {
  items: FeatureItem[];
  layout?: "grid" | "list";
  /** Columns for grid layout. */
  columns?: 2 | 3 | 4;
}

const props = withDefaults(defineProps<Props>(), {
  layout: "grid",
  columns: 3,
});

const toneCycle: Array<"maroon" | "gold" | "navy"> = ["maroon", "navy", "gold"];

function toneFor(item: FeatureItem, idx: number) {
  return item.tone ?? toneCycle[idx % toneCycle.length]!;
}

function isInternal(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

function ctaProps(cta: FeatureItem["cta"]) {
  if (!cta) return null;
  const target = cta.to ?? cta.href;
  if (!target) return null;
  return {
    component: isInternal(target) ? "NuxtLink" : "a",
    to: isInternal(target) ? target : undefined,
    href: isInternal(target) ? undefined : target,
  };
}
</script>

<template>
  <ul
    class="tux-icon-feature"
    :class="[
      `tux-icon-feature--${layout}`,
      layout === 'grid' ? `tux-icon-feature--cols-${columns}` : '',
    ]"
  >
    <li
      v-for="(item, idx) in items"
      :key="idx"
      class="tux-icon-feature__item"
    >
      <span
        class="tux-icon-feature__icon-wrap"
        :class="`tux-icon-feature__icon-wrap--${toneFor(item, idx)}`"
        aria-hidden="true"
      >
        <Icon :name="item.icon" class="tux-icon-feature__icon" />
      </span>

      <div class="tux-icon-feature__copy">
        <h3 class="tux-icon-feature__title">{{ item.title }}</h3>
        <p v-if="item.body" class="tux-icon-feature__body">{{ item.body }}</p>
        <component
          v-if="ctaProps(item.cta)"
          :is="ctaProps(item.cta)?.component"
          :to="ctaProps(item.cta)?.to"
          :href="ctaProps(item.cta)?.href"
          class="tux-icon-feature__cta"
        >
          {{ item.cta?.label }} <span aria-hidden="true">→</span>
        </component>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.tux-icon-feature {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Grid layout */
.tux-icon-feature--grid {
  display: grid;
  gap: 2rem 1.5rem;
}
.tux-icon-feature--cols-2 { grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr)); }
.tux-icon-feature--cols-3 { grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); }
.tux-icon-feature--cols-4 { grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); }

.tux-icon-feature--grid .tux-icon-feature__item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

/* List layout */
.tux-icon-feature--list .tux-icon-feature__item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.125rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--surface-border);
}
.tux-icon-feature--list .tux-icon-feature__item:last-child {
  border-bottom: 0;
}

/* Icon wrap */
.tux-icon-feature__icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.tux-icon-feature--list .tux-icon-feature__icon-wrap {
  width: 2.5rem;
  height: 2.5rem;
}

.tux-icon-feature__icon-wrap--maroon {
  background: color-mix(in srgb, var(--brand-primary) 12%, transparent);
  color: var(--brand-primary);
}

.tux-icon-feature__icon-wrap--gold {
  background: color-mix(in srgb, var(--brand-accent) 18%, transparent);
  color: #6b4f1c;
}

.tux-icon-feature__icon-wrap--navy {
  background: color-mix(in srgb, var(--brand-secondary) 14%, transparent);
  color: var(--brand-secondary);
}

.tux-icon-feature__icon {
  width: 1.5rem;
  height: 1.5rem;
}
.tux-icon-feature--list .tux-icon-feature__icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Copy */
.tux-icon-feature__copy {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.tux-icon-feature__title {
  margin: 0;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1.0625rem;
  line-height: 1.3;
  color: var(--text-primary);
}

.tux-icon-feature--list .tux-icon-feature__title {
  font-size: 0.9375rem;
}

.tux-icon-feature__body {
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--text-secondary);
}

.tux-icon-feature--list .tux-icon-feature__body {
  font-size: 0.8125rem;
}

.tux-icon-feature__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--brand-secondary);
  text-decoration: none;
  transition: color 0.15s ease, gap 0.15s ease;
  align-self: flex-start;
  margin-top: 0.125rem;
}

.tux-icon-feature__cta:hover,
.tux-icon-feature__cta:focus-visible {
  color: var(--brand-primary);
  gap: 0.5rem;
  outline: none;
}
</style>
