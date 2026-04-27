<script setup lang="ts">
// TuxMegaMenu — full-width multi-column panel from a top-bar nav item.
//
// Used as a primary-nav item in TuxSiteNav. Hover/focus reveals a
// full-bleed panel with multiple labeled columns + an optional
// featured tile on the right (eyebrow + title + description + CTA
// + optional image).
//
// Differs from TuxDropdown:
//   - panel is full-width (anchored to the nav bar, not the trigger)
//   - multi-column with column headings
//   - supports a featured-content tile distinct from the link grid
//
// Same hover/focus/escape/click semantics as TuxDropdown.

interface MegaMenuLink {
  label: string;
  to?: string;
  href?: string;
  description?: string;
}

interface MegaMenuColumn {
  heading: string;
  items: MegaMenuLink[];
}

interface FeaturedTile {
  eyebrow?: string;
  title: string;
  description?: string;
  to?: string;
  href?: string;
  image?: string;
}

interface Props {
  /** Trigger label shown in the nav bar. */
  label: string;
  /** Link columns. */
  columns: MegaMenuColumn[];
  /** Optional featured tile rendered on the right of the panel. */
  featured?: FeaturedTile;
}

const props = defineProps<Props>();

const open = ref(false);
const root = ref<HTMLElement | null>(null);
let closeTimer: ReturnType<typeof setTimeout> | null = null;

function show() {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
  open.value = true;
}

function hide(delay = 120) {
  if (closeTimer) clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    open.value = false;
    closeTimer = null;
  }, delay);
}

function toggle() {
  open.value = !open.value;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    open.value = false;
    (root.value?.querySelector("button") as HTMLButtonElement)?.focus();
  }
}

function onFocusOut(e: FocusEvent) {
  if (!root.value?.contains(e.relatedTarget as Node)) {
    hide(0);
  }
}

function isInternal(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

function linkAttrs(item: { to?: string; href?: string }) {
  if (item.to) return { component: "NuxtLink" as const, to: item.to };
  if (item.href) {
    if (isInternal(item.href)) return { component: "NuxtLink" as const, to: item.href };
    return { component: "a" as const, href: item.href, target: "_blank", rel: "noopener" };
  }
  return { component: "span" as const };
}
</script>

<template>
  <div
    ref="root"
    class="tux-mega-menu"
    @mouseenter="show"
    @mouseleave="() => hide()"
    @focusout="onFocusOut"
    @keydown="onKeydown"
  >
    <button
      type="button"
      class="tux-mega-menu__trigger"
      :aria-expanded="open"
      aria-haspopup="true"
      @click="toggle"
    >
      <span>{{ label }}</span>
      <Icon
        name="lucide:chevron-down"
        class="tux-mega-menu__chevron"
        :class="{ 'tux-mega-menu__chevron--open': open }"
        aria-hidden="true"
      />
    </button>

    <Transition name="tux-mega-menu">
      <div
        v-show="open"
        class="tux-mega-menu__panel"
        :class="{ 'tux-mega-menu__panel--with-featured': featured }"
        role="menu"
      >
        <div class="tux-mega-menu__columns">
          <section
            v-for="col in columns"
            :key="col.heading"
            class="tux-mega-menu__column"
          >
            <h3 class="tux-mega-menu__heading">{{ col.heading }}</h3>
            <ul class="tux-mega-menu__list">
              <li v-for="item in col.items" :key="item.label" role="none">
                <component
                  v-bind="linkAttrs(item)"
                  :is="linkAttrs(item).component"
                  class="tux-mega-menu__link"
                  role="menuitem"
                >
                  <span class="tux-mega-menu__link-label">{{ item.label }}</span>
                  <span
                    v-if="item.description"
                    class="tux-mega-menu__link-description"
                  >{{ item.description }}</span>
                </component>
              </li>
            </ul>
          </section>
        </div>

        <component
          v-if="featured"
          v-bind="linkAttrs(featured)"
          :is="linkAttrs(featured).component"
          class="tux-mega-menu__featured"
        >
          <div
            v-if="featured.image"
            class="tux-mega-menu__featured-image"
            :style="{ backgroundImage: `url('${featured.image}')` }"
            role="img"
            :aria-label="featured.title"
          />
          <div
            v-else
            class="tux-mega-menu__featured-placeholder"
            aria-hidden="true"
          />
          <div class="tux-mega-menu__featured-body">
            <span v-if="featured.eyebrow" class="tux-mega-menu__featured-eyebrow">{{ featured.eyebrow }}</span>
            <span class="tux-mega-menu__featured-title">{{ featured.title }}</span>
            <span
              v-if="featured.description"
              class="tux-mega-menu__featured-description"
            >{{ featured.description }}</span>
          </div>
        </component>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tux-mega-menu {
  /* The trigger is positioned in the nav-bar flow; the panel breaks
     out to full-width via fixed positioning. */
}

.tux-mega-menu__trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.5rem 0.875rem;
  font-family: var(--font-bold);
  font-weight: 600;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-primary);
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.tux-mega-menu__trigger:hover,
.tux-mega-menu__trigger:focus-visible,
.tux-mega-menu__trigger[aria-expanded="true"] {
  background: color-mix(in srgb, var(--brand-primary) 6%, transparent);
  color: var(--brand-primary);
  outline: none;
}

.tux-mega-menu__chevron {
  width: 0.75rem;
  height: 0.75rem;
  transition: transform 0.18s ease;
}

.tux-mega-menu__chevron--open {
  transform: rotate(180deg);
}

.tux-mega-menu__panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 80rem;
  margin: 0.375rem auto 0;
  padding: 1.75rem 2rem;
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-top: 2px solid var(--brand-primary);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-lg);
}

@container tux-site-nav (min-width: 60rem) {
  .tux-mega-menu__panel--with-featured {
    grid-template-columns: 3fr 1fr;
  }
}

.tux-mega-menu__columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 1.5rem 2rem;
}

.tux-mega-menu__column {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.tux-mega-menu__heading {
  margin: 0 0 0.25rem;
  padding-bottom: 0.4375rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--brand-primary);
  border-bottom: 1px solid var(--surface-border);
}

.tux-mega-menu__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.tux-mega-menu__link {
  display: block;
  padding: 0.4375rem 0.5rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: background-color 0.15s ease, color 0.15s ease;
}

.tux-mega-menu__link:hover,
.tux-mega-menu__link:focus-visible {
  background: color-mix(in srgb, var(--brand-primary) 6%, transparent);
  color: var(--brand-primary);
  outline: none;
}

.tux-mega-menu__link-label {
  display: block;
  font-weight: 600;
}

.tux-mega-menu__link-description {
  display: block;
  margin-top: 0.125rem;
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-muted);
  line-height: 1.4;
}

/* Featured tile */
.tux-mega-menu__featured {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1.125rem;
  background: var(--surface-sunken);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--text-primary);
  transition: transform 0.2s ease, box-shadow 0.25s ease;
}

.tux-mega-menu__featured:hover,
.tux-mega-menu__featured:focus-visible {
  outline: none;
  transform: translate(2px, -2px);
  box-shadow: -2px 2px 0 0 var(--brand-primary);
}

.tux-mega-menu__featured-image {
  width: 100%;
  aspect-ratio: 4/3;
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-sm);
}

.tux-mega-menu__featured-placeholder {
  width: 100%;
  aspect-ratio: 4/3;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-deep));
  border-radius: var(--radius-sm);
}

.tux-mega-menu__featured-eyebrow {
  display: block;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--brand-primary);
  margin-bottom: 0.375rem;
}

.tux-mega-menu__featured-title {
  display: block;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.9375rem;
  line-height: 1.3;
  color: var(--text-primary);
}

.tux-mega-menu__featured-description {
  display: block;
  margin-top: 0.4375rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Transitions */
.tux-mega-menu-enter-active,
.tux-mega-menu-leave-active {
  transition: opacity 0.18s ease, transform 0.2s ease;
}

.tux-mega-menu-enter-from,
.tux-mega-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .tux-mega-menu-enter-active,
  .tux-mega-menu-leave-active {
    transition: opacity 0.1s linear;
  }
  .tux-mega-menu-enter-from,
  .tux-mega-menu-leave-to {
    transform: none;
  }
}
</style>
