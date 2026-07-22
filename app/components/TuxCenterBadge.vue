<script setup lang="ts">
/**
 * TuxCenterBadge — TTI center / division marker.
 *
 * A small inline badge identifying which TTI center or division
 * a piece of content belongs to. Use on article cards, search
 * results, and content listings to signal provenance without
 * stealing visual weight from the headline.
 *
 * Six canonical TTI centers (pass `center` for a known one to
 * pick up the matched palette + icon), or pass `label` for a
 * custom value. Custom values use brand-primary as the accent.
 *
 * Sizes (sm / md) and layouts (chip or stacked).
 */

// Canonical TTI center tokens. Each gets a distinct accent tone
// (drawn from the `--chart-*` palette so the family stays
// cohesive across the chart + badge systems).
type CenterKey =
  | "mobility"
  | "safety"
  | "freight"
  | "roadways"
  | "policy"
  | "operations";

interface CenterDef {
  label: string;
  short: string;
  icon: string;
  /** Tone index (1-8) from the chart palette. */
  toneIndex: number;
}

const CENTERS: Record<CenterKey, CenterDef> = {
  mobility:   { label: "Mobility Division",        short: "Mobility",   icon: "lucide:car",            toneIndex: 1 },
  safety:     { label: "Roadway Safety Division",  short: "Safety",     icon: "lucide:shield-check",   toneIndex: 7 },
  freight:    { label: "Freight Operations Group", short: "Freight",    icon: "lucide:truck",          toneIndex: 3 },
  roadways:   { label: "Roadways Group",           short: "Roadways",   icon: "lucide:road",           toneIndex: 5 },
  policy:     { label: "Policy + Economics",       short: "Policy",     icon: "lucide:landmark",       toneIndex: 8 },
  operations: { label: "Field Operations",         short: "Operations", icon: "lucide:radar",          toneIndex: 4 },
};

interface Props {
  /** One of the six canonical center keys, OR custom — pass
   *  `label` + optional `icon` if center is "custom". */
  center?: CenterKey | "custom";
  /** Custom label (only when center="custom"). */
  label?: string;
  /** Custom Lucide icon name (only when center="custom"). */
  icon?: string;
  /** Custom tone index (1-8). Default 2 (slate teal) for custom
   *  centers. */
  toneIndex?: number;
  /** Use the short name (when supported by the center). Default false. */
  short?: boolean;
  /** Size. Default md. */
  size?: "sm" | "md";
  /** Layout. Default "chip" (inline pill); "stacked" puts icon above label. */
  layout?: "chip" | "stacked";
}

const props = withDefaults(defineProps<Props>(), {
  center: undefined,
  label: undefined,
  icon: undefined,
  toneIndex: 2,
  short: false,
  size: "md",
  layout: "chip",
});

const resolved = computed(() => {
  if (props.center && props.center !== "custom") {
    const def = CENTERS[props.center as CenterKey];
    return {
      label: props.short ? def.short : def.label,
      icon: def.icon,
      toneIndex: def.toneIndex,
    };
  }
  return {
    label: props.label ?? "Center",
    icon: props.icon ?? "lucide:landmark",
    toneIndex: props.toneIndex,
  };
});

const toneClass = computed(() => `tux-center-badge--c${Math.max(1, Math.min(8, resolved.value.toneIndex))}`);
</script>

<template>
  <span
    class="tux-center-badge"
    :class="[
      `tux-center-badge--${size}`,
      `tux-center-badge--${layout}`,
      toneClass,
    ]"
    :aria-label="`TTI ${resolved.label}`"
  >
    <Icon :name="resolved.icon" :size="size === 'sm' ? 12 : 14" class="tux-center-badge__icon" />
    <span class="tux-center-badge__label">{{ resolved.label }}</span>
  </span>
</template>

<style scoped>
.tux-center-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  font-family: var(--font-sans);
  font-weight: 600;
  border: 1px solid currentColor;
  background: color-mix(in srgb, currentColor 8%, var(--surface-page));
  border-radius: var(--radius-sm);
  padding: 0.1875rem 0.5rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  line-height: 1;
}

.tux-center-badge__icon {
  flex-shrink: 0;
}

.tux-center-badge__label {
  font-size: inherit;
}

.tux-center-badge--sm {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  gap: 0.25rem;
}

.tux-center-badge--md {
  font-size: 0.6875rem;
}

.tux-center-badge--stacked {
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.375rem 0.5rem;
  text-align: center;
}

/* Palette — same eight chart tones used elsewhere in the system. */
.tux-center-badge--c1 { color: var(--chart-1, var(--brand-primary)); }
.tux-center-badge--c2 { color: var(--chart-2, #3f5a6f); }
.tux-center-badge--c3 { color: var(--chart-3, #c7973c); }
.tux-center-badge--c4 { color: var(--chart-4, #6b8e5a); }
.tux-center-badge--c5 { color: var(--chart-5, #8c5a3c); }
.tux-center-badge--c6 { color: var(--chart-6, #5c7080); }
.tux-center-badge--c7 { color: var(--chart-7, #a33a3a); }
.tux-center-badge--c8 { color: var(--chart-8, #3c5a87); }
</style>
