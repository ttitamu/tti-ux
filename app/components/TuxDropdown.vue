<script setup lang="ts">
// TuxDropdown — single-column dropdown menu from a top-bar nav item.
//
// Used as a primary-nav item in TuxSiteNav. Hover/focus reveals a
// column of links beneath the trigger. Built on Headless UI-style
// behavior:
//   - hover open / unhover close (with a small delay to allow
//     diagonal mouse paths from trigger → panel)
//   - focus-within keeps the panel open while keyboard-traversing
//   - Escape closes; Tab through panel works naturally
//   - click on trigger toggles (touch + keyboard friendly)
//
// For a multi-column featured panel, use `<TuxMegaMenu>` instead.

interface DropdownItem {
  label: string;
  to?: string;
  href?: string;
  description?: string;
}

interface Props {
  /** Trigger label shown in the nav bar. */
  label: string;
  /** Column of links shown when open. */
  items: DropdownItem[];
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
  // Delay so focus moves between trigger and panel without flicker.
  if (!root.value?.contains(e.relatedTarget as Node)) {
    hide(0);
  }
}

function isInternal(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

function linkAttrs(item: DropdownItem) {
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
    class="tux-dropdown"
    @mouseenter="show"
    @mouseleave="() => hide()"
    @focusout="onFocusOut"
    @keydown="onKeydown"
  >
    <button
      type="button"
      class="tux-dropdown__trigger"
      :aria-expanded="open"
      aria-haspopup="true"
      @click="toggle"
    >
      <span>{{ label }}</span>
      <Icon
        name="lucide:chevron-down"
        class="tux-dropdown__chevron"
        :class="{ 'tux-dropdown__chevron--open': open }"
        aria-hidden="true"
      />
    </button>

    <Transition name="tux-dropdown">
      <div
        v-show="open"
        class="tux-dropdown__panel"
        role="menu"
      >
        <ul class="tux-dropdown__list">
          <li v-for="item in items" :key="item.label" class="tux-dropdown__item" role="none">
            <component
              v-bind="linkAttrs(item)"
              :is="linkAttrs(item).component"
              class="tux-dropdown__link"
              role="menuitem"
            >
              <span class="tux-dropdown__link-label">{{ item.label }}</span>
              <span
                v-if="item.description"
                class="tux-dropdown__link-description"
              >{{ item.description }}</span>
            </component>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tux-dropdown {
  position: relative;
}

.tux-dropdown__trigger {
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

.tux-dropdown__trigger:hover,
.tux-dropdown__trigger:focus-visible,
.tux-dropdown__trigger[aria-expanded="true"] {
  background: color-mix(in srgb, var(--brand-primary) 6%, transparent);
  color: var(--brand-primary);
  outline: none;
}

.tux-dropdown__chevron {
  width: 0.75rem;
  height: 0.75rem;
  transition: transform 0.18s ease;
}

.tux-dropdown__chevron--open {
  transform: rotate(180deg);
}

.tux-dropdown__panel {
  position: absolute;
  top: calc(100% + 0.375rem);
  left: 0;
  min-width: 14rem;
  padding: 0.375rem;
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-top: 2px solid var(--brand-primary);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  z-index: 10;
}

.tux-dropdown__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tux-dropdown__link {
  display: block;
  padding: 0.5rem 0.75rem;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: background-color 0.15s ease, color 0.15s ease;
}

.tux-dropdown__link:hover,
.tux-dropdown__link:focus-visible {
  background: color-mix(in srgb, var(--brand-primary) 6%, transparent);
  color: var(--brand-primary);
  outline: none;
}

.tux-dropdown__link-label {
  display: block;
  font-weight: 600;
}

.tux-dropdown__link-description {
  display: block;
  margin-top: 0.125rem;
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-muted);
  line-height: 1.4;
}

.tux-dropdown__link:hover .tux-dropdown__link-description,
.tux-dropdown__link:focus-visible .tux-dropdown__link-description {
  color: color-mix(in srgb, var(--brand-primary) 60%, var(--text-muted));
}

/* Transitions */
.tux-dropdown-enter-active,
.tux-dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.18s ease;
}

.tux-dropdown-enter-from,
.tux-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .tux-dropdown-enter-active,
  .tux-dropdown-leave-active {
    transition: opacity 0.1s linear;
  }
  .tux-dropdown-enter-from,
  .tux-dropdown-leave-to {
    transform: none;
  }
}
</style>
