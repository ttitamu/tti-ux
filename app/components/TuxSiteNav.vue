<script setup lang="ts">
// TuxSiteNav — institutional top-bar.
//
// Two horizontal bars stacked: an optional utility bar (small upper
// strip — "Apply", "Visit", "Give", language toggle, search) and the
// identity bar (TuxIdentity lockup on the left, primary nav on the
// right). The five AggieUX site types (University / Center /
// Department / Application+nav / Application-only) all express via
// composition: pass a different identity level + nav set rather than
// flipping a "type" prop.
//
// Nav items can be:
//   - plain links (`{ label, to }`)
//   - dropdown triggers (`{ label, dropdown: [...] }`) — TuxDropdown picks up
//   - mega-menu triggers (`{ label, megaMenu: {...} }`) — TuxMegaMenu picks up
//
// The component owns layout + sticky behavior; each menu kind is
// rendered by its dedicated component composed inline.

interface UtilityLink {
  label: string;
  to?: string;
  href?: string;
  /** Optional Lucide icon prefixed before the label. */
  icon?: string;
}

interface DropdownColumn {
  label: string;
  to?: string;
  href?: string;
  description?: string;
}

interface MegaMenuColumn {
  heading: string;
  items: DropdownColumn[];
}

interface MegaMenuConfig {
  columns: MegaMenuColumn[];
  /** Optional featured panel on the right — single highlighted item. */
  featured?: {
    eyebrow?: string;
    title: string;
    description?: string;
    to?: string;
    href?: string;
    image?: string;
  };
}

interface PrimaryNavItem {
  label: string;
  /** Landing route. Used three ways:
   *    - on a plain link: where clicking goes (and source for active-
   *      route detection)
   *    - on a `dropdown` or `megaMenu` item: makes the trigger LABEL
   *      itself a link (clicking → navigate; hover/focus still opens
   *      the panel). When omitted on a menu item, the trigger acts
   *      as a pure toggle button.
   */
  to?: string;
  href?: string;
  /** Drop a flat column of links underneath. */
  dropdown?: DropdownColumn[];
  /** Drop a multi-column mega panel underneath. */
  megaMenu?: MegaMenuConfig;
}

interface IdentityProps {
  level?: "institution" | "center" | "department";
  superhead?: string | null;
  name: string;
  href?: string | null;
  kind?: "lockup" | "text";
  logoSize?: number;
}

interface Props {
  /** Identity props passed straight to TuxIdentity. */
  identity: IdentityProps;
  /** Primary nav items (right side of the identity bar). */
  primaryNav?: PrimaryNavItem[];
  /** Utility nav (upper strip) — small links above the identity bar. */
  utilityNav?: UtilityLink[];
  /** Show the search trigger in the utility bar. */
  search?: boolean;
  /** Sticky-position the whole nav at the top of the viewport. */
  sticky?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  primaryNav: () => [],
  utilityNav: () => [],
  search: false,
  sticky: false,
});

const emit = defineEmits<{
  "search:open": [];
}>();

const mobileOpen = ref(false);
const route = useRoute();

// Close mobile menu on route change
watch(() => route.fullPath, () => { mobileOpen.value = false; });

function isInternal(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

// Active-state for plain (no-dropdown) primary-nav links. Section-
// match (path-prefix) so a /docs/handbook link reads as active across
// all /docs/* sub-pages. `?tab=` and `#anchor` don't influence this —
// section membership is path-only, same as the menu triggers.
function isPlainLinkActive(item: { to?: string; href?: string }): boolean {
  const target = item.to ?? (item.href && isInternal(item.href) ? item.href : null);
  if (!target) return false;
  return isSectionActive(target, route);
}
</script>

<template>
  <header
    class="tux-site-nav"
    :class="{ 'tux-site-nav--sticky': sticky, 'tux-site-nav--mobile-open': mobileOpen }"
  >
    <!-- Utility bar — optional, small upper strip -->
    <div v-if="utilityNav.length > 0 || search" class="tux-site-nav__utility">
      <div class="tux-site-nav__utility-inner">
        <ul v-if="utilityNav.length > 0" class="tux-site-nav__utility-list">
          <li v-for="link in utilityNav" :key="link.label">
            <NuxtLink
              v-if="link.to"
              :to="link.to"
              class="tux-site-nav__utility-link"
            >
              <Icon
                v-if="link.icon"
                :name="link.icon"
                class="tux-site-nav__utility-icon"
                aria-hidden="true"
              />
              <span>{{ link.label }}</span>
            </NuxtLink>
            <NuxtLink
              v-else-if="link.href && isInternal(link.href)"
              :to="link.href"
              class="tux-site-nav__utility-link"
            >
              <Icon
                v-if="link.icon"
                :name="link.icon"
                class="tux-site-nav__utility-icon"
                aria-hidden="true"
              />
              <span>{{ link.label }}</span>
            </NuxtLink>
            <a
              v-else-if="link.href"
              :href="link.href"
              target="_blank"
              rel="noopener"
              class="tux-site-nav__utility-link"
            >
              <Icon
                v-if="link.icon"
                :name="link.icon"
                class="tux-site-nav__utility-icon"
                aria-hidden="true"
              />
              <span>{{ link.label }}</span>
            </a>
          </li>
        </ul>
        <button
          v-if="search"
          type="button"
          class="tux-site-nav__search-trigger"
          aria-label="Open search"
          @click="emit('search:open')"
        >
          <Icon name="lucide:search" class="tux-site-nav__search-icon" aria-hidden="true" />
          <span>Search</span>
        </button>
      </div>
    </div>

    <!-- Identity bar — TuxIdentity + primary nav -->
    <div class="tux-site-nav__bar">
      <div class="tux-site-nav__bar-inner">
        <TuxIdentity v-bind="identity" />

        <button
          type="button"
          class="tux-site-nav__mobile-toggle"
          :aria-expanded="mobileOpen"
          aria-label="Toggle navigation"
          @click="mobileOpen = !mobileOpen"
        >
          <Icon
            :name="mobileOpen ? 'lucide:x' : 'lucide:menu'"
            class="tux-site-nav__mobile-icon"
            aria-hidden="true"
          />
        </button>

        <nav
          class="tux-site-nav__primary"
          :class="{ 'tux-site-nav__primary--mobile-open': mobileOpen }"
          aria-label="Primary navigation"
        >
          <ul class="tux-site-nav__primary-list">
            <li
              v-for="item in primaryNav"
              :key="item.label"
              class="tux-site-nav__primary-item"
              :class="{ 'tux-site-nav__primary-item--mega': !!item.megaMenu }"
            >
              <!-- Mega menu -->
              <TuxMegaMenu
                v-if="item.megaMenu"
                :label="item.label"
                :columns="item.megaMenu.columns"
                :featured="item.megaMenu.featured"
                :to="item.to"
              />
              <!-- Dropdown -->
              <TuxDropdown
                v-else-if="item.dropdown"
                :label="item.label"
                :items="item.dropdown"
                :to="item.to"
              />
              <!-- Plain link — gets a section-active class when the
                   route matches `to` exactly OR is a strict descendant
                   path. Mirrors the active-state shape Tux{Dropdown,MegaMenu}
                   apply to their triggers so every primary-nav variant
                   shares the same active visual language. Explicit v-if
                   branches (vs `<component :is>`) for the same click-
                   reliability reason as the menu triggers. -->
              <NuxtLink
                v-else-if="item.to"
                :to="item.to"
                class="tux-site-nav__primary-link"
                :class="{
                  'tux-site-nav__primary-link--active': isPlainLinkActive(item),
                }"
                :aria-current="isPlainLinkActive(item) ? 'page' : undefined"
              >{{ item.label }}</NuxtLink>
              <NuxtLink
                v-else-if="item.href && isInternal(item.href)"
                :to="item.href"
                class="tux-site-nav__primary-link"
                :class="{
                  'tux-site-nav__primary-link--active': isPlainLinkActive(item),
                }"
                :aria-current="isPlainLinkActive(item) ? 'page' : undefined"
              >{{ item.label }}</NuxtLink>
              <a
                v-else-if="item.href"
                :href="item.href"
                target="_blank"
                rel="noopener"
                class="tux-site-nav__primary-link"
              >{{ item.label }}</a>
              <span v-else class="tux-site-nav__primary-link">{{ item.label }}</span>
            </li>
          </ul>
        </nav>

        <!--
          Trailing utility cluster — slot for app-shape consumers
          (PECAN, tti-ai-studio, future admin tools) to drop a
          search trigger / theme toggle / user dropdown / notification
          bell next to the primary nav.

          Marketing surfaces (tti.tamu.edu home) leave the slot empty
          and rely on the upper utility bar (`utilityNav` prop) for
          visit/give/apply links — different audience, different
          density.

          Slot is rendered inside `.tux-site-nav__bar-inner` so it
          shares the same vertical center as TuxIdentity and the
          primary nav. Hidden when mobileOpen=false on narrow
          viewports? — no: the trailing cluster stays visible because
          the items inside (theme toggle, user) are commonly the
          *first* affordances a mobile user reaches for. Consumers
          that don't want them on mobile can wrap the slot content
          in their own media query.
        -->
        <div v-if="$slots.trailing" class="tux-site-nav__trailing">
          <slot name="trailing" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.tux-site-nav {
  container-type: inline-size;
  container-name: tux-site-nav;
  width: 100%;
  background: var(--surface-page);
  border-bottom: 1px solid var(--surface-border);
  font-family: var(--font-body);
}

.tux-site-nav--sticky {
  position: sticky;
  top: 0;
  z-index: 30;
}

/* Utility bar */
.tux-site-nav__utility {
  background: var(--surface-sunken);
  border-bottom: 1px solid var(--surface-border);
  font-size: 0.75rem;
}

.tux-site-nav__utility-inner {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0.375rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1.25rem;
}

.tux-site-nav__utility-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1rem;
}

.tux-site-nav__utility-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.15s ease;
}

.tux-site-nav__utility-link:hover,
.tux-site-nav__utility-link:focus-visible {
  color: var(--brand-primary);
  outline: none;
}

.tux-site-nav__utility-icon {
  width: 0.75rem;
  height: 0.75rem;
}

.tux-site-nav__search-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  padding: 0.25rem 0.625rem;
  font-family: var(--font-bold);
  font-weight: 600;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.tux-site-nav__search-trigger:hover {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}

.tux-site-nav__search-icon {
  width: 0.8125rem;
  height: 0.8125rem;
}

/* Identity bar */
.tux-site-nav__bar {
  background: var(--surface-page);
}

.tux-site-nav__bar-inner {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
}

.tux-site-nav__primary {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

/* Trailing utility cluster — sits flush right of the primary nav.
   Slot content controls its own gap; we just provide the alignment
   wrapper. Border-left rule visually separates the cluster from the
   nav so theme/user controls don't read as "another nav item." */
.tux-site-nav__trailing {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 1rem;
  margin-left: 0.25rem;
  border-left: 1px solid var(--surface-border);
}

.tux-site-nav__primary-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.25rem;
}

.tux-site-nav__primary-item {
  /* Establishes a positioning context for `TuxDropdown` AND
     `TuxMegaMenu` panels. Both anchor to their trigger; the
     mega-menu just sizes to its content (capped) instead of
     extending bar-width. The previous "skip-positioning" trick
     made mega menus span the whole bar — fine in theory, jarring
     in practice next to the compact TuxDropdown. */
  position: relative;
}

.tux-site-nav__primary-link {
  display: inline-block;
  padding: 0.5rem 0.875rem;
  font-family: var(--font-bold);
  font-weight: 600;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  /* Reserve a 2px bottom border slot for the active state. Matches
     TuxDropdown / TuxMegaMenu trigger treatment so all three primary-
     nav variants share a coherent active visual language. */
  border-bottom: 2px solid transparent;
  transition: background-color 0.15s ease, color 0.15s ease,
    border-bottom-color 0.15s ease;
}

.tux-site-nav__primary-link:hover,
.tux-site-nav__primary-link:focus-visible,
.tux-site-nav__primary-link.router-link-active {
  background: color-mix(in srgb, var(--brand-primary) 6%, transparent);
  color: var(--brand-primary);
  outline: none;
}

.tux-site-nav__primary-link--active {
  color: var(--brand-primary);
  border-bottom-color: var(--brand-primary);
}

/* Mobile */
.tux-site-nav__mobile-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  margin-left: auto;
  background: transparent;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-primary);
}

.tux-site-nav__mobile-icon {
  width: 1.125rem;
  height: 1.125rem;
}

@container tux-site-nav (max-width: 48rem) {
  .tux-site-nav__utility { display: none; }

  .tux-site-nav__mobile-toggle { display: inline-flex; }

  .tux-site-nav__primary {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--surface-page);
    border-bottom: 1px solid var(--surface-border);
    padding: 0.5rem 1.5rem 1rem;
    flex-direction: column;
    align-items: stretch;
    box-shadow: var(--shadow-md);
    display: none;
  }

  .tux-site-nav__primary--mobile-open {
    display: flex;
  }

  .tux-site-nav__primary-list {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }

  .tux-site-nav__primary-link {
    padding: 0.625rem 0.5rem;
    border-bottom: 1px solid var(--surface-border);
    border-radius: 0;
  }
}
</style>
