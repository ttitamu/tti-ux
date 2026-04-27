<script setup lang="ts">
// TuxBreadcrumbs — page-depth navigation trail.
//
// Sits above the page header on every non-landing page. Home crumb is
// always present (icon + label, navy underlined). Intermediate crumbs are
// italic navy links. The final crumb is plain text — not a link to itself.
//
// Separator is a 1px vertical rule (14px tall) at viewports ≥560px,
// switching to a `›` chevron below — the rule reads cramped on phones.
//
// Don't reach for UBreadcrumb. Nuxt UI's primitive uses chevron separators
// throughout and a different italics rhythm; the TTI signature is the
// pipe-separator + italic-intermediates pattern.

interface Crumb {
  label: string;
  /** Where to navigate. Omit on the final crumb (current page). */
  to?: string;
  /** External href instead of a router `to`. */
  href?: string;
}

interface Props {
  trail: Crumb[];
  /** Show the home icon on the first crumb. Default true. */
  homeIcon?: boolean;
  /** Use chevron separators at all sizes (instead of pipes-collapse-to-chevron). */
  chevron?: boolean;
}

withDefaults(defineProps<Props>(), {
  homeIcon: true,
  chevron: false,
});
</script>

<template>
  <nav
    class="tux-breadcrumbs"
    :class="{ 'tux-breadcrumbs--chevron': chevron }"
    aria-label="Breadcrumb"
  >
    <ol class="tux-breadcrumbs__list">
      <li
        v-for="(crumb, idx) in trail"
        :key="idx"
        class="tux-breadcrumbs__item"
        :class="{
          'tux-breadcrumbs__item--home': idx === 0,
          'tux-breadcrumbs__item--current': idx === trail.length - 1,
          'tux-breadcrumbs__item--intermediate': idx !== 0 && idx !== trail.length - 1,
        }"
      >
        <span
          v-if="idx > 0"
          class="tux-breadcrumbs__separator"
          aria-hidden="true"
        >{{ chevron ? '›' : '' }}</span>

        <!-- Final crumb — non-link, plain text -->
        <span
          v-if="idx === trail.length - 1"
          aria-current="page"
          class="tux-breadcrumbs__current"
        >{{ crumb.label }}</span>

        <!-- Home crumb (with icon) -->
        <NuxtLink
          v-else-if="idx === 0"
          :to="crumb.to ?? '/'"
          :href="crumb.href"
          class="tux-breadcrumbs__home"
        >
          <Icon
            v-if="homeIcon"
            name="lucide:home"
            class="tux-breadcrumbs__home-icon"
            aria-hidden="true"
          />
          <span>{{ crumb.label }}</span>
        </NuxtLink>

        <!-- Intermediate crumbs — italic link -->
        <NuxtLink
          v-else
          :to="crumb.to"
          :href="crumb.href"
          class="tux-breadcrumbs__link"
        >{{ crumb.label }}</NuxtLink>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.tux-breadcrumbs {
  container-type: inline-size;
  container-name: tux-breadcrumbs;
  font-family: var(--font-bold);
  font-size: 0.875rem;
  line-height: 1;
  color: var(--text-secondary);
}

.tux-breadcrumbs__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.625rem;
}

.tux-breadcrumbs__item {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

.tux-breadcrumbs__separator {
  display: inline-block;
  width: 1px;
  height: 0.875rem;
  background: var(--surface-border);
  flex-shrink: 0;
}

/* On narrow containers, swap the pipe rule for a chevron — pipes feel
   cramped under ~30rem of inline space. */
@container tux-breadcrumbs (max-width: 30rem) {
  .tux-breadcrumbs__separator {
    width: auto;
    height: auto;
    background: transparent;
    color: var(--text-muted);
    font-size: 0.875rem;
  }
  .tux-breadcrumbs__separator::after {
    content: "›";
  }
}

/* Explicit `chevron` prop overrides the pipe at all sizes. */
.tux-breadcrumbs--chevron .tux-breadcrumbs__separator {
  width: auto;
  height: auto;
  background: transparent;
  color: var(--text-muted);
}

.tux-breadcrumbs__home,
.tux-breadcrumbs__link {
  color: var(--brand-secondary);
  font-weight: 700;
  text-decoration: none;
  transition: color 0.15s ease, text-decoration-color 0.15s ease;
}

.tux-breadcrumbs__home {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: color-mix(in srgb, var(--brand-secondary) 40%, transparent);
}

.tux-breadcrumbs__home-icon {
  width: 0.8125rem;
  height: 0.8125rem;
  flex-shrink: 0;
}

.tux-breadcrumbs__link {
  font-style: italic;
  font-weight: 400;
}

.tux-breadcrumbs__home:hover,
.tux-breadcrumbs__home:focus-visible,
.tux-breadcrumbs__link:hover,
.tux-breadcrumbs__link:focus-visible {
  color: color-mix(in srgb, var(--brand-secondary) 80%, black);
  text-decoration: underline;
  text-decoration-color: currentColor;
  outline: none;
}

.tux-breadcrumbs__current {
  font-weight: 400;
  color: var(--text-primary);
}
</style>
