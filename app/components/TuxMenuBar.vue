<script setup lang="ts">
/**
 * TuxMenuBar — in-window menu strip for Windows / Linux Tauri shells.
 *
 * Renders the classic File / Edit / View / Help menu strip under the
 * titlebar on hosts where the menu isn't drawn by the OS itself.
 *
 * Platform behavior:
 *   - macOS: **does not render**. macOS users expect the system menu
 *     strip at the top of the screen, populated by Tauri Rust config.
 *     Drawing a fake one here would feel wrong + duplicate.
 *   - Windows / Linux: renders a row of `UDropdownMenu` triggers
 *     anchored under the titlebar. Items follow the Nuxt UI menu-item
 *     shape (label / icon / shortcut / children / click handler).
 *   - Web (no Tauri): renders by default so the showcase route works.
 *     Hide manually if a consumer doesn't want it in a plain-web build.
 *
 * Items shape:
 *
 *   const menus = [
 *     {
 *       label: "File",
 *       items: [
 *         [{ label: "New",  icon: "lucide:file-plus", kbds: ["meta", "n"], onSelect: () => ... }],
 *         [{ label: "Open…", icon: "lucide:folder-open", kbds: ["meta", "o"] }],
 *         [{ label: "Quit", kbds: ["meta", "q"] }],
 *       ],
 *     },
 *     { label: "Edit", items: [...] },
 *   ];
 *
 * The inner array structure (array-of-arrays) is the UDropdownMenu
 * convention — outer groups create dividers between sections.
 */
import { computed } from "vue";
import type { DropdownMenuItem } from "@nuxt/ui";

export interface TuxMenu {
  label: string;
  items: DropdownMenuItem[][];
}

interface Props {
  /** Menu definitions; rendered left-to-right. */
  menus: TuxMenu[];
  /** Render even on macOS. Default false — defer to system menu on Mac. */
  renderOnMac?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  renderOnMac: false,
});

const platform = useTuxPlatform();

const shouldRender = computed(() => {
  if (platform.value.os === "mac" || platform.value.os === "ios") {
    return props.renderOnMac;
  }
  return true;
});
</script>

<template>
  <div v-if="shouldRender" class="tux-menu-bar" role="menubar">
    <UDropdownMenu
      v-for="menu in menus"
      :key="menu.label"
      :items="menu.items"
      :popper="{ placement: 'bottom-start' }"
    >
      <button type="button" class="tux-menu-bar__trigger" role="menuitem">
        {{ menu.label }}
      </button>
    </UDropdownMenu>
  </div>
</template>

<style scoped>
.tux-menu-bar {
  display: flex;
  align-items: stretch;
  height: 28px;
  background: var(--surface-page);
  border-bottom: 1px solid var(--surface-border);
  padding-inline: 0.25rem;
  font-family: var(--font-sans);
  font-size: 0.8125rem;
}

.tux-menu-bar__trigger {
  display: inline-flex;
  align-items: center;
  padding: 0 0.625rem;
  background: transparent;
  border: 0;
  color: var(--text-primary);
  cursor: pointer;
  transition: background 80ms ease-out;
  border-radius: var(--radius-xs, 2px);
}

.tux-menu-bar__trigger:hover,
.tux-menu-bar__trigger[aria-expanded="true"] {
  background: color-mix(in srgb, var(--text-primary) 7%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .tux-menu-bar__trigger {
    transition: none;
  }
}
</style>
