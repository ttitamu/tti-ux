<script setup lang="ts">
/**
 * TuxEmptyState — the "no data yet" pattern extracted.
 *
 * Icon in a tinted circle, heading, one-sentence explanation, and an
 * optional CTA slot. Wrapped in a TuxCard by default so the empty
 * state reads as its own bordered block in a page grid.
 *
 * **Preset kinds.** Pass `kind="no-data"` (etc.) to get sensible
 * defaults for the five empty-state cases consumers reach for most
 * often. Each preset pre-fills icon + title + description; explicit
 * props still win on a per-field basis.
 *
 * Surveyed kinds (Backstage Design System v2.0 has seven dedicated
 * empty-state pages; we collapse to the five most-reused shapes):
 *
 *   - `no-data`         — empty dataset, nothing's been created yet
 *   - `no-results`      — query / filter returned nothing
 *   - `not-found`       — the resource doesn't exist (or moved)
 *   - `no-permissions`  — auth-gated; user lacks access
 *   - `first-run`       — onboarding; "welcome, get started"
 *
 * Usage:
 *   <tux-empty-state kind="no-results">
 *     <tux-button intent="ghost" icon="lucide:filter-x">Clear filters</tux-button>
 *   </tux-empty-state>
 *
 *   <!-- Override one field per case: -->
 *   <tux-empty-state kind="no-data" title="Inbox is empty">
 *     <tux-button intent="primary" icon="lucide:plus">Compose</tux-button>
 *   </tux-empty-state>
 *
 *   <!-- Fully custom (legacy / out-of-preset case): -->
 *   <tux-empty-state icon="lucide:folder-plus" title="No projects yet">
 *     ...CTA...
 *   </tux-empty-state>
 *
 * Pass `no-card` to drop the card frame — useful when the empty state
 * IS the page (not a block inside another layout).
 *
 * Pass `compact` for a smaller-scale variant — used when the empty
 * state lives inside a narrow column / tight panel. Reduces icon
 * size, heading scale, and vertical padding without changing content
 * shape.
 *
 * **Design stance: no decorative illustrations.** TUX deliberately
 * avoids the saturated-cartoon empty-state illustrations common in
 * consumer SaaS kits (cf. Empty State Illustration Kit absorption,
 * 2026-05-21). Editorial / research-publishing identity outweighs
 * the "consumer SaaS expectation." If warmth is needed, use a real
 * photograph via `TuxPhotoCard` next to (not inside) the empty
 * state — never a stylized illustration.
 */

type Kind = "no-data" | "no-results" | "not-found" | "no-permissions" | "first-run";

interface Props {
  /** Named preset. Pre-fills icon + title + description; explicit
   *  props override per-field. */
  kind?: Kind;
  /** Lucide icon. Overrides the preset icon when set. Required when
   *  `kind` is not provided. */
  icon?: string;
  /** Heading text. Overrides the preset title when set. Required when
   *  `kind` is not provided. */
  title?: string;
  /** Supporting copy. Overrides the preset description when set. */
  description?: string;
  /** Drop the surrounding TuxCard frame. */
  noCard?: boolean;
  /** Smaller-scale variant for in-card / in-panel placements. */
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  kind: undefined,
  icon: undefined,
  title: undefined,
  description: undefined,
  noCard: false,
  compact: false,
});

// Five preset shapes — tuned to read as "explanatory + actionable"
// for the most-used cases. Consumers always have the option to
// override any field per call site.
const PRESETS: Record<Kind, { icon: string; title: string; description: string }> = {
  "no-data": {
    icon: "lucide:inbox",
    title: "No data yet",
    description: "When records arrive, they'll show up here.",
  },
  "no-results": {
    icon: "lucide:search-x",
    title: "No matches",
    description: "Try a broader query, or clear the active filters.",
  },
  "not-found": {
    icon: "lucide:circle-off",
    title: "Not found",
    description: "The item you're looking for doesn't exist or has been removed.",
  },
  "no-permissions": {
    icon: "lucide:lock",
    title: "Access required",
    description: "You don't have permission to view this. Contact your administrator if you think that's a mistake.",
  },
  "first-run": {
    icon: "lucide:sparkles",
    title: "Welcome",
    description: "Get started by creating your first item.",
  },
};

const resolvedIcon = computed(() =>
  props.icon ?? (props.kind ? PRESETS[props.kind].icon : "lucide:inbox")
);
const resolvedTitle = computed(() =>
  props.title ?? (props.kind ? PRESETS[props.kind].title : "")
);
const resolvedDescription = computed(() =>
  props.description ?? (props.kind ? PRESETS[props.kind].description : undefined)
);
</script>

<template>
  <!-- `<component :is>` lets us toggle the TuxCard wrapper without
       duplicating the inner content (`noCard` was previously two
       separate template branches that drifted — `compact` only worked
       inside the with-card branch). Auto-import + `global: true` in
       nuxt.config means `'TuxCard'` resolves at runtime. -->
  <component :is="noCard ? 'div' : 'TuxCard'">
    <div
      class="flex flex-col items-center text-center"
      :class="compact ? 'py-3 gap-2' : 'py-6 gap-3'"
    >
      <div
        class="rounded-full flex items-center justify-center"
        :class="compact ? 'w-10 h-10' : 'w-14 h-14'"
        style="background: color-mix(in srgb, var(--brand-primary) 8%, var(--surface-raised))"
      >
        <UIcon
          :name="resolvedIcon"
          :class="compact ? 'w-5 h-5' : 'w-7 h-7'"
          style="color: var(--brand-primary)"
        />
      </div>
      <h3
        class="font-bold text-text-primary"
        :class="compact ? 'text-base' : 'text-lg'"
      >{{ resolvedTitle }}</h3>
      <p
        v-if="resolvedDescription"
        class="text-text-secondary leading-relaxed"
        :class="compact ? 'text-xs max-w-xs' : 'text-sm max-w-md'"
      >
        {{ resolvedDescription }}
      </p>
      <div v-if="$slots.default" class="mt-1">
        <slot />
      </div>
    </div>
  </component>
</template>
