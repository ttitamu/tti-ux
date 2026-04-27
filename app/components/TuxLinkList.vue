<script setup lang="ts">
// TuxLinkList — categorized resource list.
//
// Grouped link list with optional category headings. The "for sponsors /
// for partners / for students" footer-of-section pattern, or a hub-page
// resource directory.
//
// Each group has a heading and a list of links. Each link can be marked
// as `external` to render the up-right arrow, or `featured` to bold +
// add a maroon left-bar.

interface LinkItem {
  label: string;
  to?: string;
  href?: string;
  /** Short subtitle / description shown beneath the label. */
  description?: string;
  /** Mark as external — adds the up-right arrow glyph. Auto-detected
   *  when `href` starts with `http`. */
  external?: boolean;
  /** Render with a maroon left-bar emphasis. */
  featured?: boolean;
}

interface LinkGroup {
  heading?: string;
  items: LinkItem[];
}

interface Props {
  /** Array of grouped link blocks. */
  groups: LinkGroup[];
  /** Layout — `columns` lays the groups side-by-side (footer of section);
   *  `stacked` runs them top-to-bottom (sidebar resource list). */
  layout?: "columns" | "stacked";
  /** When `layout="columns"`, target column count. Auto-fits to viewport. */
  columns?: 2 | 3 | 4;
}

const props = withDefaults(defineProps<Props>(), {
  layout: "columns",
  columns: 3,
});

function isExternal(item: LinkItem) {
  if (item.external !== undefined) return item.external;
  return Boolean(item.href && /^https?:/.test(item.href));
}

function isInternal(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

function linkProps(item: LinkItem) {
  const href = item.to ?? item.href;
  if (!href) return null;
  return {
    component: isInternal(href) ? "NuxtLink" : "a",
    to: isInternal(href) ? href : undefined,
    href: isInternal(href) ? undefined : href,
  };
}
</script>

<template>
  <div
    class="tux-link-list"
    :class="[
      `tux-link-list--${layout}`,
      layout === 'columns' ? `tux-link-list--cols-${columns}` : '',
    ]"
  >
    <section
      v-for="(group, gIdx) in groups"
      :key="gIdx"
      class="tux-link-list__group"
    >
      <h3
        v-if="group.heading"
        class="tux-link-list__heading"
      >{{ group.heading }}</h3>

      <ul class="tux-link-list__items">
        <li
          v-for="(item, iIdx) in group.items"
          :key="iIdx"
          class="tux-link-list__item"
          :class="{ 'tux-link-list__item--featured': item.featured }"
        >
          <component
            :is="linkProps(item)?.component ?? 'span'"
            :to="linkProps(item)?.to"
            :href="linkProps(item)?.href"
            :target="isExternal(item) ? '_blank' : undefined"
            :rel="isExternal(item) ? 'noopener' : undefined"
            class="tux-link-list__link"
          >
            <span class="tux-link-list__label">
              {{ item.label }}
              <Icon
                v-if="isExternal(item)"
                name="lucide:arrow-up-right"
                class="tux-link-list__external-icon"
                aria-hidden="true"
              />
            </span>
            <span
              v-if="item.description"
              class="tux-link-list__description"
            >{{ item.description }}</span>
          </component>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.tux-link-list--columns {
  display: grid;
  gap: 2rem 2.5rem;
}
.tux-link-list--cols-2 { grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); }
.tux-link-list--cols-3 { grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); }
.tux-link-list--cols-4 { grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr)); }

.tux-link-list--stacked {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.tux-link-list__heading {
  margin: 0 0 0.875rem;
  padding-bottom: 0.5rem;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-primary);
  border-bottom: 2px solid var(--brand-primary);
}

.tux-link-list__items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.tux-link-list__item {
  border-bottom: 1px solid var(--surface-border);
}
.tux-link-list__item:last-child {
  border-bottom: 0;
}

.tux-link-list__item--featured {
  border-bottom-color: transparent;
}

.tux-link-list__link {
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
  padding: 0.75rem 0;
  text-decoration: none;
  color: var(--text-primary);
  transition: color 0.15s ease, background-color 0.15s ease;
  position: relative;
}

.tux-link-list__item--featured .tux-link-list__link {
  padding-left: 0.875rem;
  border-left: 3px solid var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 4%, transparent);
}

.tux-link-list__link:hover,
.tux-link-list__link:focus-visible {
  color: var(--brand-primary);
  outline: none;
}

.tux-link-list__label {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.9375rem;
  line-height: 1.3;
}

.tux-link-list__item--featured .tux-link-list__label {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1rem;
}

.tux-link-list__external-icon {
  width: 0.75rem;
  height: 0.75rem;
  color: var(--text-muted);
  transition: transform 0.15s ease;
}

.tux-link-list__link:hover .tux-link-list__external-icon,
.tux-link-list__link:focus-visible .tux-link-list__external-icon {
  color: var(--brand-primary);
  transform: translate(1px, -1px);
}

.tux-link-list__description {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--text-muted);
}
</style>
