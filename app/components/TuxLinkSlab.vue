<script setup lang="ts">
// TuxLinkSlab — full-width horizontal band of prominent links.
//
// The "footer-of-section navigation" pattern. Distinct from TuxLinkList
// (which is a multi-column grouped list — for "for sponsors / for
// partners / for students" footers): TuxLinkSlab is one band, one row
// of equal-weight calls. Right for routing rows like
// "About · Programs · News · Contact" between major sections.
//
// Each link has a label, optional icon, and optional description. The
// slab can be plain (transparent), neutral (sunken-gray), or maroon
// (brand band) for visual emphasis. Whole link is clickable with the
// corner-drop hover signature.

interface SlabLink {
  label: string;
  to?: string;
  href?: string;
  /** Lucide icon name. Renders large on the left of the label. */
  icon?: string;
  /** Optional subtitle below the label. */
  description?: string;
}

interface Props {
  links: SlabLink[];
  /** Background tone. */
  tone?: "plain" | "neutral" | "maroon";
}

withDefaults(defineProps<Props>(), {
  tone: "plain",
});

function isInternal(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

function linkProps(link: SlabLink) {
  const target = link.to ?? link.href;
  if (!target) return null;
  return {
    component: isInternal(target) ? "NuxtLink" : "a",
    to: isInternal(target) ? target : undefined,
    href: isInternal(target) ? undefined : target,
  };
}
</script>

<template>
  <nav
    class="tux-link-slab"
    :class="`tux-link-slab--${tone}`"
    aria-label="Section navigation"
  >
    <ul class="tux-link-slab__list">
      <li
        v-for="(link, idx) in links"
        :key="idx"
        class="tux-link-slab__item"
      >
        <component
          :is="linkProps(link)?.component ?? 'span'"
          :to="linkProps(link)?.to"
          :href="linkProps(link)?.href"
          class="tux-link-slab__link"
        >
          <Icon
            v-if="link.icon"
            :name="link.icon"
            class="tux-link-slab__icon"
            aria-hidden="true"
          />
          <span class="tux-link-slab__text">
            <span class="tux-link-slab__label">{{ link.label }}</span>
            <span
              v-if="link.description"
              class="tux-link-slab__description"
            >{{ link.description }}</span>
          </span>
          <Icon
            name="lucide:arrow-right"
            class="tux-link-slab__arrow"
            aria-hidden="true"
          />
        </component>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.tux-link-slab {
  container-type: inline-size;
  container-name: tux-link-slab;
  width: 100%;
  border-radius: var(--radius-md);
}

.tux-link-slab--neutral { background: var(--surface-sunken); }
.tux-link-slab--maroon  { background: var(--brand-primary); }

.tux-link-slab__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
}

@container tux-link-slab (min-width: 38rem) {
  .tux-link-slab__list {
    grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  }
}

.tux-link-slab__item {
  display: contents;
}

.tux-link-slab__link {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.125rem 1.25rem;
  text-decoration: none;
  color: inherit;
  border-right: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-bottom: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  transition: background-color 0.15s ease, gap 0.15s ease;
  font-family: var(--font-body);
}

.tux-link-slab__item:last-child .tux-link-slab__link {
  border-right: 0;
}

@container tux-link-slab (max-width: 38rem) {
  .tux-link-slab__link {
    border-right: 0;
  }
}

.tux-link-slab__link:hover,
.tux-link-slab__link:focus-visible {
  outline: none;
  background: color-mix(in srgb, currentColor 6%, transparent);
}

.tux-link-slab__link:hover .tux-link-slab__arrow,
.tux-link-slab__link:focus-visible .tux-link-slab__arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Tone-specific text colors */
.tux-link-slab--plain .tux-link-slab__link,
.tux-link-slab--neutral .tux-link-slab__link {
  color: var(--text-primary);
}
.tux-link-slab--maroon .tux-link-slab__link {
  color: #fff;
}

.tux-link-slab__icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  color: var(--brand-primary);
}

.tux-link-slab--maroon .tux-link-slab__icon {
  color: var(--brand-accent);
}

.tux-link-slab__text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.tux-link-slab__label {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.9375rem;
  line-height: 1.3;
}

.tux-link-slab__description {
  font-family: var(--font-body);
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--text-muted);
}

.tux-link-slab--maroon .tux-link-slab__description {
  color: rgba(255, 255, 255, 0.72);
}

.tux-link-slab__arrow {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  opacity: 0.4;
  transform: translateX(-3px);
  transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1.2);
}

.tux-link-slab--maroon .tux-link-slab__arrow {
  color: var(--brand-accent);
}
</style>
