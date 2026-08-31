<script setup lang="ts">
/**
 * TuxAppSwitcher — waffle-button + popover grid of TTI consumer apps.
 *
 * Source: Microsoft Fabric "Suite header" pattern (see absorption notes
 * at reference/figma-cache/microsoft-fabric-ui-kit/NOTES.md §Absorb #3).
 * Lets users hop between TTI's portals without leaving their browser
 * tab — TTI ↔ my.TTI ↔ TUX docs ↔ Landscape ↔ Atlas ↔ TTI Code.
 *
 * Lives in `TuxAppFrame`'s `#right` slot (Tauri shells) or in
 * `TuxSiteNav`'s utility row (plain-web consumers). It's a single
 * floating-affordance trigger, not a full nav structure.
 *
 * The `apps` array should come from `useTuxApps()` (the canonical
 * registry in design/apps.json) — never hand-declared in a consumer.
 *
 * Behavior contract (suite doctrine — design/compositions.md):
 *   - Tiles render in REGISTRY ORDER on every portal. Never reorder by
 *     context: spatial constancy is the whole point of a suite switcher.
 *   - The current app's tile stays a real, focusable link (a self-link
 *     is harmless) carrying `aria-current="page"` + a visual badge.
 *   - Navigation is same-tab by default — the user is going somewhere,
 *     not opening a reference. `target="_blank"` is the exception and
 *     is announced in the accessible name.
 *   - `kind: "desktop"` tiles carry a visible "Desktop app" affix and
 *     should point at the launcher interstitial, never a raw scheme.
 *   - Esc / outside click close and focus-return come from UPopover.
 *   - Tab-only traversal (no arrow-key grid) — fine at ≤6 tiles; do not
 *     promise APG-grid behavior in ports of this component.
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
   *  work too (Tauri shells route through the host's opener command). */
  to: string;
  /** Mark this as the currently-active app. The tile stays focusable
   *  and carries `aria-current="page"`. Defaults to false. */
  current?: boolean;
  /** Navigation target. Default is same-tab (`_self`) — suite
   *  convention. `_blank` tiles get "(opens in new tab)" appended to
   *  their accessible name. */
  target?: "_self" | "_blank";
  /** "desktop" renders a "Desktop app" affix on the tile. Default "web". */
  kind?: "web" | "desktop";
}

interface Props {
  apps: TuxAppSwitcherApp[];
  /** Trigger button label for screen readers. Default "Switch apps". */
  ariaLabel?: string;
  /** Header text inside the popover. Default "TTI Portals". */
  heading?: string;
  /** Optional footer line (rendered above the #footer slot). Used for
   *  filtered-state summaries, e.g. "Showing 4 of 6 apps · Sign in to
   *  see all." */
  footerText?: string;
  /** Presentation mode. "popover" (default) is the only implemented
   *  mode today; "sheet" is RESERVED for compact/touch hosts (Tauri
   *  Mobile) so the prop exists before consumers freeze the contract.
   *  Passing "sheet" currently renders the popover. */
  presentation?: "popover" | "sheet";
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: "Switch apps",
  heading: "TTI Portals",
  footerText: undefined,
  presentation: "popover",
});

// Registry order, verbatim. (An earlier revision sorted the current app
// last; that made the grid differ per portal and defeated the muscle
// memory the switcher exists to build. See plan Appendix B/C.)
const apps = computed(() => props.apps);
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
          <p class="eyebrow">texas a&amp;m transportation institute</p>
          <h3>{{ heading }}</h3>
        </header>

        <ul class="tux-app-switcher__grid" role="list">
          <li v-for="app in apps" :key="app.id" class="tux-app-switcher__cell">
            <NuxtLink
              :to="app.to"
              :target="app.target ?? '_self'"
              class="tux-app-switcher__tile"
              :class="{ 'tux-app-switcher__tile--current': app.current }"
              :aria-current="app.current ? 'page' : undefined"
            >
              <div class="tux-app-switcher__tile-icon" aria-hidden="true">
                <Icon :name="app.icon" :size="22" />
              </div>
              <div class="tux-app-switcher__tile-text">
                <p class="tux-app-switcher__tile-name">{{ app.name }}</p>
                <p v-if="app.tagline" class="tux-app-switcher__tile-tagline">
                  {{ app.tagline }}
                </p>
                <p v-if="app.kind === 'desktop'" class="tux-app-switcher__tile-kind">
                  <Icon name="lucide:monitor-down" :size="11" aria-hidden="true" />
                  Desktop app
                </p>
              </div>
              <span
                v-if="app.current"
                class="tux-app-switcher__tile-badge"
                aria-hidden="true"
              >
                You are here
              </span>
              <span v-if="app.target === '_blank'" class="sr-only">
                (opens in new tab)
              </span>
            </NuxtLink>
          </li>
        </ul>

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
  transition:
    background var(--motion-fast) var(--ease-survey),
    color var(--motion-fast) var(--ease-survey);
}

.tux-app-switcher__trigger:hover,
.tux-app-switcher__trigger[aria-expanded="true"] {
  background: color-mix(in srgb, var(--text-primary) 8%, transparent);
  color: var(--text-primary);
}

@media (prefers-reduced-motion: reduce) {
  .tux-app-switcher__trigger {
    transition: none;
  }
}

@media (forced-colors: active) {
  .tux-app-switcher__trigger:focus-visible {
    outline: 2px solid;
  }
}

.tux-app-switcher__panel {
  padding: 1rem;
}

.tux-app-switcher__heading {
  margin-bottom: 0.75rem;
}
.tux-app-switcher__heading h3 {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.tux-app-switcher__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

@media (max-width: 30rem) {
  .tux-app-switcher__grid {
    grid-template-columns: 1fr;
  }
}

.tux-app-switcher__cell {
  display: contents;
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
  transition:
    background var(--motion-fast) var(--ease-survey),
    border-color var(--motion-fast) var(--ease-survey),
    transform var(--motion-fast) var(--ease-survey);
}

.tux-app-switcher__tile:hover:not(.tux-app-switcher__tile--current) {
  background: var(--surface-sunken);
  border-color: color-mix(in srgb, var(--brand-primary) 35%, var(--surface-border));
  transform: translateY(-1px);
}

.tux-app-switcher__tile--current {
  background: color-mix(in srgb, var(--brand-primary) 6%, var(--surface-page));
  border-color: color-mix(in srgb, var(--brand-primary) 30%, var(--surface-border));
}

@media (prefers-reduced-motion: reduce) {
  .tux-app-switcher__tile {
    transition: none;
  }
  .tux-app-switcher__tile:hover {
    transform: none;
  }
}

@media (forced-colors: active) {
  .tux-app-switcher__tile:focus-visible {
    outline: 2px solid;
  }
  .tux-app-switcher__tile--current {
    border: 2px solid;
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

.tux-app-switcher__tile-kind {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0.25rem 0 0 0;
  line-height: 1;
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
