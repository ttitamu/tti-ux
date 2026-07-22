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
//   - click on trigger:
//       · if `to` is set → navigate (real link semantics, NuxtLink
//         intercepts the click). Menu stays available via hover.
//       · if `to` is not set → toggle the panel (dropdown-only mode).
//
// Active-state awareness:
//   - The trigger lights up when the current route matches the
//     trigger's own `to` OR any descendant item's `to` (operator
//     immediately sees "I'm inside this section").
//   - Each item lights up when the current route matches its `to`.
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
  /** Optional landing route for the trigger label itself. When set,
   *  clicking the trigger NAVIGATES (the menu still opens on hover/
   *  focus). When omitted, the trigger acts as a pure toggle button.
   *  Use the route the operator most likely wants when they "just
   *  click on Workflow" — typically the overview/index of the
   *  section. */
  to?: string;
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
    (root.value?.querySelector("button, a") as HTMLElement)?.focus();
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

// ─── Route awareness — auto-close + active-state highlights ──────────
const route = useRoute();

// Close any open menu when the operator navigates. Without this, a
// click on an item navigates AND leaves the panel open for the next
// page — confusing because nothing on that next page corresponds to
// the now-stale open state.
watch(() => route.fullPath, () => {
  open.value = false;
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
});

// Per-item active: full-target match (path + query + hash). Items with
// hash or query (`/admin#fleet`, `/policies?tab=approvals`) need the
// nav helper so siblings under the same path don't all light up at
// once — see `app/utils/nav-active.ts`.
function isItemActive(item: DropdownItem): boolean {
  const target = item.to ?? (item.href && isInternal(item.href) ? item.href : null);
  if (!target) return false;
  return isExactActive(target, route);
}

// Trigger active: lights up when the operator is inside this section.
// Section membership = path-prefix match on `to` OR on any item's path.
// We use `isSectionActive` (path-only) so a `?tab=` or `#anchor`
// on the route still counts as "inside this section."
const isTriggerActive = computed<boolean>(() => {
  if (props.to && isSectionActive(props.to, route)) return true;
  return props.items.some((item) => {
    const target = item.to ?? null;
    return target ? isSectionActive(target, route) : false;
  });
});
</script>

<template>
  <div
    ref="root"
    class="tux-dropdown"
    :class="{ 'tux-dropdown--active': isTriggerActive }"
    @mouseenter="show"
    @mouseleave="() => hide()"
    @focusout="onFocusOut"
    @keydown="onKeydown"
  >
    <!-- Trigger: NuxtLink when `to` is set (click → navigate, hover
         still opens the panel via the wrapper's mouseenter). Plain
         button otherwise (click → toggle). Explicit v-if branches
         instead of `<component :is>` because dynamic-component
         resolution from a string was eating clicks intermittently in
         hover-open state — the static branches give vue-router the
         resolved component at compile time and clicks land reliably. -->
    <NuxtLink
      v-if="to"
      :to="to"
      class="tux-dropdown__trigger"
      :class="{ 'tux-dropdown__trigger--active': isTriggerActive }"
      :aria-expanded="open"
      :aria-current="route.fullPath === to ? 'page' : undefined"
      aria-haspopup="true"
    >
      <span>{{ label }}</span>
      <Icon
        name="lucide:chevron-down"
        class="tux-dropdown__chevron"
        :class="{ 'tux-dropdown__chevron--open': open }"
        aria-hidden="true"
      />
    </NuxtLink>
    <button
      v-else
      type="button"
      class="tux-dropdown__trigger"
      :class="{ 'tux-dropdown__trigger--active': isTriggerActive }"
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
            <!-- Same explicit-branch reasoning as the trigger. The
                 previous `<component v-bind="linkAttrs(item)" :is>`
                 pattern leaked the `component` key onto the rendered
                 element AND was vulnerable to the same string-resolution
                 click-eating issue under hover state. -->
            <NuxtLink
              v-if="item.to"
              :to="item.to"
              class="tux-dropdown__link"
              :class="{ 'tux-dropdown__link--active': isItemActive(item) }"
              :aria-current="isItemActive(item) ? 'page' : undefined"
              role="menuitem"
            >
              <span class="tux-dropdown__link-label">{{ item.label }}</span>
              <span
                v-if="item.description"
                class="tux-dropdown__link-description"
              >{{ item.description }}</span>
            </NuxtLink>
            <NuxtLink
              v-else-if="item.href && isInternal(item.href)"
              :to="item.href"
              class="tux-dropdown__link"
              :class="{ 'tux-dropdown__link--active': isItemActive(item) }"
              :aria-current="isItemActive(item) ? 'page' : undefined"
              role="menuitem"
            >
              <span class="tux-dropdown__link-label">{{ item.label }}</span>
              <span
                v-if="item.description"
                class="tux-dropdown__link-description"
              >{{ item.description }}</span>
            </NuxtLink>
            <a
              v-else-if="item.href"
              :href="item.href"
              target="_blank"
              rel="noopener"
              class="tux-dropdown__link"
              role="menuitem"
            >
              <span class="tux-dropdown__link-label">{{ item.label }}</span>
              <span
                v-if="item.description"
                class="tux-dropdown__link-description"
              >{{ item.description }}</span>
            </a>
            <span v-else class="tux-dropdown__link" role="menuitem">
              <span class="tux-dropdown__link-label">{{ item.label }}</span>
              <span
                v-if="item.description"
                class="tux-dropdown__link-description"
              >{{ item.description }}</span>
            </span>
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
  text-decoration: none;
  /* Reserve a 2px bottom border slot so the active-state border
     doesn't shift the label vertically. The transparent border
     occupies the space; the active rule replaces the color. */
  border-bottom: 2px solid transparent;
  transition: background-color 0.15s ease, color 0.15s ease,
    border-bottom-color 0.15s ease;
}

.tux-dropdown__trigger:hover,
.tux-dropdown__trigger:focus-visible,
.tux-dropdown__trigger[aria-expanded="true"] {
  background: color-mix(in srgb, var(--brand-primary) 6%, transparent);
  color: var(--brand-primary);
  outline: none;
}

/* Section-active (operator is inside this area). The maroon bottom
   bar reads as "I'm here" — same shape as the tab pattern most
   ops dashboards use, just integrated into the trigger button. */
.tux-dropdown__trigger--active {
  color: var(--brand-primary);
  border-bottom-color: var(--brand-primary);
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

/* Per-item active — soft bg + maroon left rail. The rail reads as a
   directory marker; the bg is just enough to confirm "this row is
   the one you're on." */
.tux-dropdown__link--active {
  background: color-mix(in srgb, var(--brand-primary) 9%, transparent);
  color: var(--brand-primary);
  /* Border on left rather than the whole row outline keeps it from
     fighting the active-section indicator on the trigger. */
  box-shadow: inset 2px 0 0 0 var(--brand-primary);
}

.tux-dropdown__link--active .tux-dropdown__link-label {
  font-weight: 700;
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
