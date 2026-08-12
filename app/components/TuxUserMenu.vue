<script setup lang="ts">
/**
 * TuxUserMenu — the suite's one identity affordance.
 *
 * Two blessed mounts per the two-shape rule (design/compositions.md
 * §Suite chrome): `placement="cluster"` renders a compact avatar chip
 * for the trailing utility cluster (site-shaped portals — always the
 * LAST seat); `placement="rail-footer"` renders the wide chip for
 * workbench rails (name + status line, avatar left — the AI Studio
 * AccountChip anatomy). Never a third home.
 *
 * Menu content order is law in both mounts:
 *   identity block → portal links (`items`) → preferences (`prefs`
 *   items, e.g. the high-contrast toggle) → sign out.
 *
 * State-complete by design — consumers have very different identity
 * sources (Landscape: async whoami/EasyAuth; AI Studio: local install
 * identity + optional cloud sign-in; docs site: none) and every state
 * must render deliberately:
 *   - `loading`    → inert skeleton chip (no menu).
 *   - `signed-out` → quiet "Sign in" affordance (link to signInHref).
 *   - `signed-in`  → avatar/initials chip + menu.
 *   - `local-only` → first-class, NOT an error (AccountChip doctrine):
 *     chip reads "Local only", menu offers the sign-in action.
 *   - `error`      → chip with warning tint; menu offers retry via the
 *     `refresh` emit. Never blocks the rest of the chrome.
 *
 * An unauthenticated *product* (docs site) renders no TuxUserMenu at
 * all — the seat is deliberately absent, never a placeholder.
 *
 * The trigger's accessible name is identical in both mounts:
 * "Account: {name}" signed in, "Sign in" signed out.
 */
import { computed } from "vue";

export interface TuxUserIdentity {
  name: string;
  email?: string;
  /** Falls back to initials derived from `name`. */
  initials?: string;
  photoUrl?: string;
  /** Shown in the identity block (e.g. budget-attribution unit). */
  department?: string;
}

export interface TuxUserMenuItem {
  label: string;
  icon?: string;
  to?: string;
  onSelect?: () => void;
}

interface Props {
  state: "loading" | "signed-out" | "signed-in" | "local-only" | "error";
  identity?: TuxUserIdentity;
  /** Where the sign-in affordance points (the portal's own auth edge). */
  signInHref?: string;
  signInLabel?: string;
  /** Portal-specific links — rendered after the identity block. */
  items?: TuxUserMenuItem[];
  /** Preferences section (e.g. high-contrast toggle) — after items. */
  prefs?: TuxUserMenuItem[];
  /** Show a "Sign out" action (emits `sign-out`). Default true when
   *  signed in. Local-only shows the sign-in action instead. */
  showSignOut?: boolean;
  placement?: "cluster" | "rail-footer";
  /** Status line under the name in rail-footer mount (e.g.
   *  "Signed in · TTI AI Chat" / "Local only"). */
  statusLine?: string;
}

const props = withDefaults(defineProps<Props>(), {
  identity: undefined,
  signInHref: undefined,
  signInLabel: "Sign in",
  items: () => [],
  prefs: () => [],
  showSignOut: true,
  placement: "cluster",
  statusLine: undefined,
});

const emit = defineEmits<{ (e: "sign-out" | "refresh"): void }>();

const triggerLabel = computed(() =>
  props.state === "signed-in" || props.state === "local-only"
    ? `Account: ${props.identity?.name ?? "unknown"}`
    : props.state === "error"
      ? "Account (error loading identity)"
      : props.signInLabel,
);

// UDropdownMenu group structure (array-of-arrays — same convention as
// TuxMenuBar). Identity block → items → prefs → sign out.
interface MenuEntry {
  label: string;
  icon?: string;
  to?: string;
  type?: "label";
  onSelect?: () => void;
}
const menuItems = computed(() => {
  const groups: MenuEntry[][] = [];
  if (props.identity) {
    groups.push([
      {
        type: "label",
        label: props.identity.name,
        // Nuxt UI renders `label` rows inert — the description slot in
        // the template below carries email/department.
      },
    ]);
  }
  if (props.items.length) {
    groups.push(props.items.map((i) => ({ ...i })));
  }
  if (props.prefs.length) {
    groups.push(props.prefs.map((i) => ({ ...i })));
  }
  if (props.state === "error") {
    groups.push([
      {
        label: "Retry",
        icon: "lucide:refresh-cw",
        onSelect: () => emit("refresh"),
      },
    ]);
  } else if (props.state === "local-only" && props.signInHref) {
    groups.push([
      { label: props.signInLabel, icon: "lucide:log-in", to: props.signInHref },
    ]);
  } else if (props.state === "signed-in" && props.showSignOut) {
    groups.push([
      {
        label: "Sign out",
        icon: "lucide:log-out",
        onSelect: () => emit("sign-out"),
      },
    ]);
  }
  return groups;
});
</script>

<template>
  <!-- Loading: inert skeleton, no menu. -->
  <div
    v-if="state === 'loading'"
    class="tux-user-menu__skeleton"
    :class="`tux-user-menu__skeleton--${placement}`"
    aria-hidden="true"
  />

  <!-- Signed out: a quiet link, not a menu. -->
  <NuxtLink
    v-else-if="state === 'signed-out'"
    :to="signInHref"
    class="tux-user-menu__sign-in"
  >
    <Icon name="lucide:log-in" :size="14" aria-hidden="true" />
    {{ signInLabel }}
  </NuxtLink>

  <!-- Signed in / local-only / error: chip + menu. -->
  <UDropdownMenu v-else :items="menuItems" :ui="{ content: 'w-60' }">
    <button
      type="button"
      class="tux-user-menu__trigger"
      :class="[
        `tux-user-menu__trigger--${placement}`,
        { 'tux-user-menu__trigger--error': state === 'error' },
      ]"
      :aria-label="triggerLabel"
    >
      <!-- Avatar primitive owns photo/initials fallback; the error tint
           stays here (state is TuxUserMenu's concern, not the avatar's). -->
      <TuxAvatar
        class="tux-user-menu__avatar"
        :name="identity?.name"
        :initials="identity?.initials"
        :photo-url="identity?.photoUrl"
        size="md"
      />
      <span v-if="placement === 'rail-footer'" class="tux-user-menu__text">
        <span class="tux-user-menu__name">{{ identity?.name }}</span>
        <span class="tux-user-menu__status">
          {{ statusLine ?? (state === "local-only" ? "Local only" : "") }}
        </span>
      </span>
    </button>

    <template #item-label="{ item }">
      <span class="tux-user-menu__id-block">
        <span class="tux-user-menu__id-name">{{ item.label }}</span>
        <span v-if="identity?.email" class="tux-user-menu__id-sub">{{ identity.email }}</span>
        <span v-if="identity?.department" class="tux-user-menu__id-sub">{{ identity.department }}</span>
      </span>
    </template>
  </UDropdownMenu>
</template>

<style scoped>
.tux-user-menu__skeleton {
  border-radius: 9999px;
  background: color-mix(in srgb, var(--text-primary) 8%, transparent);
}
.tux-user-menu__skeleton--cluster {
  width: 28px;
  height: 28px;
}
.tux-user-menu__skeleton--rail-footer {
  width: 100%;
  height: 40px;
  border-radius: var(--radius-md);
}

.tux-user-menu__sign-in {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  transition: color var(--motion-fast) var(--ease-survey);
}
.tux-user-menu__sign-in:hover {
  color: var(--brand-primary);
}

.tux-user-menu__trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 0;
  background: transparent;
  cursor: pointer;
  border-radius: 9999px;
  padding: 0;
  transition: background var(--motion-fast) var(--ease-survey);
}
.tux-user-menu__trigger--rail-footer {
  width: 100%;
  border-radius: var(--radius-md);
  padding: 0.375rem 0.5rem;
  text-align: left;
}
.tux-user-menu__trigger--rail-footer:hover,
.tux-user-menu__trigger--cluster:hover {
  background: color-mix(in srgb, var(--text-primary) 7%, transparent);
}

/* Base avatar look lives in TuxAvatar; only the error-state tint is
   this component's concern (scoped styles reach the child's root). */
.tux-user-menu__trigger--error .tux-user-menu__avatar {
  background: var(--color-warning);
  color: var(--text-primary);
}

.tux-user-menu__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.25;
}
.tux-user-menu__name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tux-user-menu__status {
  font-size: 0.6875rem;
  color: var(--text-muted);
}

.tux-user-menu__id-block {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.125rem 0;
}
.tux-user-menu__id-name {
  font-weight: 600;
  color: var(--text-primary);
}
.tux-user-menu__id-sub {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-muted);
}

@media (forced-colors: active) {
  .tux-user-menu__trigger:focus-visible,
  .tux-user-menu__sign-in:focus-visible {
    outline: 2px solid;
  }
}
@media (prefers-reduced-motion: reduce) {
  .tux-user-menu__trigger,
  .tux-user-menu__sign-in {
    transition: none;
  }
}
</style>
