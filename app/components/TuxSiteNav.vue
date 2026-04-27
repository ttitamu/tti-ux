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
  <header
    class="tux-site-nav"
    :class="{ 'tux-site-nav--sticky': sticky, 'tux-site-nav--mobile-open': mobileOpen }"
  >
    <!-- Utility bar — optional, small upper strip -->
    <div v-if="utilityNav.length > 0 || search" class="tux-site-nav__utility">
      <div class="tux-site-nav__utility-inner">
        <ul v-if="utilityNav.length > 0" class="tux-site-nav__utility-list">
          <li v-for="link in utilityNav" :key="link.label">
            <component
              v-bind="linkAttrs(link)"
              :is="linkAttrs(link).component"
              class="tux-site-nav__utility-link"
            >
              <Icon
                v-if="link.icon"
                :name="link.icon"
                class="tux-site-nav__utility-icon"
                aria-hidden="true"
              />
              <span>{{ link.label }}</span>
            </component>
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
            >
              <!-- Mega menu -->
              <TuxMegaMenu
                v-if="item.megaMenu"
                :label="item.label"
                :columns="item.megaMenu.columns"
                :featured="item.megaMenu.featured"
              />
              <!-- Dropdown -->
              <TuxDropdown
                v-else-if="item.dropdown"
                :label="item.label"
                :items="item.dropdown"
              />
              <!-- Plain link -->
              <component
                v-else
                v-bind="linkAttrs(item)"
                :is="linkAttrs(item).component"
                class="tux-site-nav__primary-link"
              >{{ item.label }}</component>
            </li>
          </ul>
        </nav>
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

.tux-site-nav__primary-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.25rem;
}

.tux-site-nav__primary-item {
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
  transition: background-color 0.15s ease, color 0.15s ease;
}

.tux-site-nav__primary-link:hover,
.tux-site-nav__primary-link:focus-visible,
.tux-site-nav__primary-link.router-link-active {
  background: color-mix(in srgb, var(--brand-primary) 6%, transparent);
  color: var(--brand-primary);
  outline: none;
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
