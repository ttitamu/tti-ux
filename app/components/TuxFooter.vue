<script setup lang="ts">
// TuxFooter — slim app footer for internal tools.
//
// The compact compliance strip that anchors PECAN, tti-ai-studio, and tux's
// own pages. Layout: version + © + name on the left; utility links on the
// right. Pair this with `<TuxSubfooter>` directly below for shipped
// products — the TAMUS legal strip is non-negotiable on every TTI surface.
//
// Marketing-site footers (4-column link grids + newsletter signup) live
// outside this component. None of our three target products need that
// shape; if a public marketing surface ever does, build it from slots
// rather than parameterizing this one.

interface FooterLink {
  label: string;
  to?: string;
  href?: string;
}

interface Props {
  /** Display name in the © line. Required. */
  name?: string;
  /** Version pill on the left. Renders monospace, brand color. */
  version?: string | null;
  /** Year for the © line. Defaults to current year. */
  year?: number;
  /** Right-side utility link list. Plain text labels rendered as links. */
  links?: FooterLink[];
}

withDefaults(defineProps<Props>(), {
  name: "Texas A&M Transportation Institute",
  version: null,
  year: () => new Date().getFullYear(),
  links: () => [],
});

function isInternal(href: string | undefined, to: string | undefined) {
  if (to) return true;
  if (!href) return false;
  return href.startsWith("/") || href.startsWith("#");
}
</script>

<template>
  <footer class="tux-footer">
    <div class="tux-footer__left">
      <span v-if="version" class="tux-footer__version">{{ version }}</span>
      <span v-if="version" class="tux-footer__sep" aria-hidden="true">·</span>
      <span class="tux-footer__copy">© {{ year }} {{ name }}</span>
      <template v-if="$slots.extra">
        <span class="tux-footer__sep" aria-hidden="true">·</span>
        <slot name="extra" />
      </template>
    </div>

    <ul v-if="links.length > 0" class="tux-footer__links">
      <li v-for="link in links" :key="link.label" class="tux-footer__link-item">
        <NuxtLink
          v-if="isInternal(link.href, link.to)"
          :to="link.to ?? link.href"
          class="tux-footer__link"
        >{{ link.label }}</NuxtLink>
        <a
          v-else-if="link.href"
          :href="link.href"
          target="_blank"
          rel="noopener"
          class="tux-footer__link"
        >{{ link.label }}</a>
        <span v-else class="tux-footer__link tux-footer__link--inert">{{ link.label }}</span>
      </li>
    </ul>
  </footer>
</template>

<style scoped>
.tux-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1.5rem;
  padding: 0.875rem 2rem;
  background: var(--surface-sunken);
  border-top: 1px solid var(--surface-border);
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.tux-footer__left {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;
}

.tux-footer__version {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--brand-primary);
}

[data-theme="tti-dark"] .tux-footer__version {
  color: var(--brand-accent);
}

.tux-footer__sep {
  opacity: 0.6;
}

.tux-footer__copy {
  color: var(--text-muted);
}

.tux-footer__links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.tux-footer__link {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.15s ease;
}

.tux-footer__link:hover,
.tux-footer__link:focus-visible {
  color: var(--text-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
  outline: none;
}

.tux-footer__link--inert {
  cursor: default;
}
.tux-footer__link--inert:hover {
  color: var(--text-muted);
  text-decoration: none;
}
</style>
