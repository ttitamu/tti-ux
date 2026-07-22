<script setup lang="ts">
/**
 * TuxTabBar — bottom-anchored mobile navigation bar (3-5 tabs).
 *
 * Canonical shape distilled from the 50-mobile-bottom-navigation-bar
 * absorption: flat bar, icon + label, **maroon top-edge rule** as the
 * active indicator (TUX signature, not Material's underline-bottom or
 * iOS 26's filled glass pill).
 *
 * Use this for **Tauri Mobile** targets (iOS, Android) where the
 * primary nav is bottom-anchored rather than a desktop sidebar.
 * Desktop / wide-viewport pages should stay on `app/layouts/sidebar.vue`.
 *
 * Geometry:
 *   - 64px tall + `env(safe-area-inset-bottom)` clearance
 *   - 3-5 tabs (component warns + collapses if you pass 6+)
 *   - 24×24 icons, 11pt labels
 *   - 44×44 minimum tap target per Apple HIG
 *
 * Items shape:
 *
 *   const tabs = [
 *     { label: "Home", to: "/", icon: "lucide:home" },
 *     { label: "Browse", to: "/browse", icon: "lucide:search" },
 *     { label: "Profile", to: "/me", icon: "lucide:user", badge: 3 },
 *   ];
 */
import { computed } from "vue";

export interface TuxTabBarItem {
  label: string;
  /** Route to navigate to. */
  to: string;
  /** Lucide icon name (`lucide:home` etc). */
  icon: string;
  /** Optional badge count (e.g. unread count). */
  badge?: number | string;
  /** Disabled tab. */
  disabled?: boolean;
  /** Override the active-route match. By default the tab is active
   *  if `route.path === to` or starts with `to + "/"`. */
  exactMatch?: boolean;
}

interface Props {
  /** 3-5 items. Excess items are clipped with a console.warn in dev. */
  items: TuxTabBarItem[];
  /** Accessible label for the nav landmark. */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: "Primary navigation",
});

const route = useRoute();

const tabs = computed(() => {
  if (props.items.length > 5 && import.meta.dev) {
    // Keep this informative — bottom-nav consensus is firmly 3-5.
    console.warn(
      "[TuxTabBar] received " + props.items.length +
        " tabs; only the first 5 will render. Move overflow into a sidebar / more menu."
    );
  }
  return props.items.slice(0, 5);
});

function isActive(item: TuxTabBarItem): boolean {
  if (item.exactMatch) return route.path === item.to;
  return route.path === item.to || route.path.startsWith(item.to + "/");
}
</script>

<template>
  <nav class="tux-tab-bar" :aria-label="ariaLabel">
    <NuxtLink
      v-for="(item, i) in tabs"
      :key="i"
      :to="item.disabled ? undefined : item.to"
      class="tux-tab-bar__tab"
      :class="{
        'tux-tab-bar__tab--active': isActive(item),
        'tux-tab-bar__tab--disabled': item.disabled,
      }"
      :aria-current="isActive(item) ? 'page' : undefined"
      :aria-disabled="item.disabled || undefined"
    >
      <div class="tux-tab-bar__icon-wrap">
        <Icon :name="item.icon" :size="24" />
        <span v-if="item.badge !== undefined" class="tux-tab-bar__badge">
          {{ item.badge }}
        </span>
      </div>
      <span class="tux-tab-bar__label">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.tux-tab-bar {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  align-items: stretch;
  background: var(--surface-page);
  border-top: 1px solid var(--surface-border);
  height: 64px;
  padding-bottom: env(safe-area-inset-bottom);
  padding-inline: env(safe-area-inset-left) env(safe-area-inset-right);
  font-family: var(--font-sans);
}

.tux-tab-bar__tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.125rem;
  position: relative;
  color: var(--text-muted);
  text-decoration: none;
  padding: 0.5rem 0.25rem;
  min-height: 44px;
  cursor: pointer;
  transition: color 120ms ease-out;
}

.tux-tab-bar__tab:hover {
  color: var(--text-secondary);
}

.tux-tab-bar__tab--active {
  color: var(--brand-primary);
}

/* TUX-signature active indicator: maroon hairline on the top edge. */
.tux-tab-bar__tab--active::before {
  content: "";
  position: absolute;
  top: 0;
  left: 12%;
  right: 12%;
  height: 2px;
  background: var(--brand-primary);
  border-radius: 1px;
}

.tux-tab-bar__tab--disabled {
  pointer-events: none;
  opacity: 0.4;
}

.tux-tab-bar__icon-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tux-tab-bar__badge {
  position: absolute;
  top: -4px;
  right: -10px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: var(--brand-primary);
  color: var(--text-inverse, #fff);
  font-size: 0.625rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.tux-tab-bar__label {
  font-size: 0.625rem;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.tux-tab-bar__tab--active .tux-tab-bar__label {
  font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
  .tux-tab-bar__tab {
    transition: none;
  }
}
</style>
