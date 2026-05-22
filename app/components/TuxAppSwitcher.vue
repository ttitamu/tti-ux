<script setup lang="ts">
/**
 * TuxAppSwitcher — waffle-button + popover grid of TTI consumer apps.
 *
 * Source: Microsoft Fabric "Suite header" pattern (see absorption notes
 * at reference/figma-cache/microsoft-fabric-ui-kit/NOTES.md §Absorb #3).
 * Lets users hop between TTI's research apps without leaving their
 * browser tab — Landscape ↔ tti-ai-studio ↔ future surfaces.
 *
 * Lives in `TuxAppFrame`'s `#right` slot (Tauri shells) or in
 * `TuxSiteNav`'s utility row (plain-web consumers). It's a single
 * floating-affordance trigger, not a full nav structure.
 *
 * Items shape:
 *
 *   const apps = [
 *     {
 *       id: "landscape",
 *       name: "Landscape",
 *       tagline: "Research dashboard",
 *       icon: "lucide:map",
 *       to: "https://landscape.tti.tamu.edu",
 *       current: true,   // mark the app the user is in
 *     },
 *     {
 *       id: "ai-studio",
 *       name: "AI Studio",
 *       tagline: "Conversational research assistant",
 *       icon: "lucide:bot",
 *       to: "https://ai.tti.tamu.edu",
 *     },
 *   ];
 *
 * Behavior:
 *   - Click waffle → popover opens beneath/below the button.
 *   - 2-column grid of app tiles by default; tightens to 1-column on
 *     narrow viewports.
 *   - "Current app" tile is visually disabled + carries
 *     aria-current="page".
 *   - Esc / outside click closes.
 */
import { computed } from "vue";

export interface TuxAppSwitcherApp {
  /** Stable identifier for the app. */
  id: string;
  /** Display name. */
  name: string;
  /** One-line description shown beneath the name. */
  tagline?: string;
  /** Lucide icon name for the tile. */
  icon: string;
  /** Target URL — usually external (other TTI app) but in-app routes
   *  work too (Tauri shells may route in-window). */
  to: string;
  /** Mark this as the currently-active app. The tile renders disabled
   *  with `aria-current="page"`. Defaults to false. */
  current?: boolean;
  /** Optional external-link target. Default "_blank" for cross-origin,
   *  same-tab for relative routes. */
  target?: "_self" | "_blank";
}

interface Props {
  apps: TuxAppSwitcherApp[];
  /** Trigger button label for screen readers. Default "Switch apps". */
  ariaLabel?: string;
  /** Header text inside the popover. Default "TTI Research Suite". */
  heading?: string;
  /** Optional footer slot description (rendered above the slot). */
  footerText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: "Switch apps",
  heading: "TTI Research Suite",
  footerText: undefined,
});

const sortedApps = computed(() => {
  // Current app sorts last so it doesn't visually dominate the grid.
  const list = [...props.apps];
  list.sort((a, b) => Number(!!a.current) - Number(!!b.current));
  return list;
});
</script>

<template>
  <UPopover :ui="{ content: 'w-[min(28rem,90vw)] p-0' }">
    <button
      type="button"
      class="tux-app-switcher__trigger"
      :aria-label="ariaLabel"
    >
      <Icon name="lucide:layout-grid" :size="18" />
    </button>

    <template #content>
      <div class="tux-app-switcher__panel">
        <header class="tux-app-switcher__heading">
          <p class="eyebrow">research suite</p>
          <h3>{{ heading }}</h3>
        </header>

        <div class="tux-app-switcher__grid">
          <NuxtLink
            v-for="app in sortedApps"
            :key="app.id"
            :to="app.current ? undefined : app.to"
            :target="app.target"
            class="tux-app-switcher__tile"
            :class="{ 'tux-app-switcher__tile--current': app.current }"
            :aria-current="app.current ? 'page' : undefined"
            :aria-disabled="app.current || undefined"
          >
            <div class="tux-app-switcher__tile-icon">
              <Icon :name="app.icon" :size="22" />
            </div>
            <div class="tux-app-switcher__tile-text">
              <p class="tux-app-switcher__tile-name">{{ app.name }}</p>
              <p v-if="app.tagline" class="tux-app-switcher__tile-tagline">
                {{ app.tagline }}
              </p>
            </div>
            <span v-if="app.current" class="tux-app-switcher__tile-badge">
              You are here
            </span>
          </NuxtLink>
        </div>

        <footer v-if="$slots.footer || footerText" class="tux-app-switcher__footer">
          <p v-if="footerText">{{ footerText }}</p>
          <slot name="footer" />
        </footer>
      </div>
    </template>
  </UPopover>
</template>

<style scoped>
.tux-app-switcher__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 80ms ease-out, color 80ms ease-out;
}

.tux-app-switcher__trigger:hover,
.tux-app-switcher__trigger[aria-expanded="true"] {
  background: color-mix(in srgb, var(--text-primary) 7%, transparent);
  color: var(--text-primary);
}

@media (prefers-reduced-motion: reduce) {
  .tux-app-switcher__trigger {
    transition: none;
  }
}

.tux-app-switcher__panel {
  padding: 1rem;
}

.tux-app-switcher__heading {
  margin-bottom: 0.75rem;
}
.tux-app-switcher__heading h3 {
  font-family: var(--font-display, var(--font-sans));
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.tux-app-switcher__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

@media (max-width: 30rem) {
  .tux-app-switcher__grid {
    grid-template-columns: 1fr;
  }
}

.tux-app-switcher__tile {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-page);
  color: var(--text-primary);
  text-decoration: none;
  position: relative;
  transition: background 80ms ease-out, border-color 80ms ease-out, transform 80ms ease-out;
}

.tux-app-switcher__tile:hover:not(.tux-app-switcher__tile--current) {
  background: var(--surface-sunken);
  border-color: color-mix(in srgb, var(--brand-primary) 35%, var(--surface-border));
  transform: translateY(-1px);
}

.tux-app-switcher__tile--current {
  background: color-mix(in srgb, var(--brand-primary) 6%, var(--surface-page));
  border-color: color-mix(in srgb, var(--brand-primary) 30%, var(--surface-border));
  cursor: default;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .tux-app-switcher__tile {
    transition: none;
  }
  .tux-app-switcher__tile:hover {
    transform: none;
  }
}

.tux-app-switcher__tile-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--brand-primary) 8%, var(--surface-page));
  color: var(--brand-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tux-app-switcher__tile-text {
  flex: 1;
  min-width: 0;
}

.tux-app-switcher__tile-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.2;
}

.tux-app-switcher__tile-tagline {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0.125rem 0 0 0;
  line-height: 1.3;
}

.tux-app-switcher__tile-badge {
  position: absolute;
  top: 0.375rem;
  right: 0.5rem;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--brand-primary);
}

.tux-app-switcher__footer {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--surface-border);
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
