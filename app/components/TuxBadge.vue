<script setup lang="ts">
/**
 * TuxBadge — TTI-flavored badge family built on UBadge.
 *
 * Unified badge, tag, count, and operational lifecycle status component.
 * Supports:
 *   - Security / classification tiers: tier="public|internal|sensitive|restricted"
 *   - Operational & lifecycle status: status="running|completed|failed|queued|paused|cancelled|published|draft|expired|verified"
 *   - Semantic tone labels: tone="info|success|warning|error|danger|brand|neutral|muted|custom"
 *   - Bold mode: bold or variant="bold|solid"
 *   - Leading status indicators: dot (with optional pulsing animation) and icon="lucide:..."
 *   - Monospace tags: kind="tag"
 *   - Facet counts: kind="count" :count="11"
 */

export type TuxBadgeTier = "public" | "internal" | "sensitive" | "restricted";
export type TuxBadgeStatus =
  | "running"
  | "completed"
  | "failed"
  | "queued"
  | "paused"
  | "cancelled"
  | "published"
  | "draft"
  | "expired"
  | "verified";

export type TuxBadgeTone =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "danger"
  | "brand"
  | "neutral"
  | "muted"
  | "custom";

export type TuxBadgeKind = "tag" | "count" | "default";
export type TuxBadgeVariant = "solid" | "soft" | "outline" | "subtle" | "bold";

interface Props {
  tier?: TuxBadgeTier;
  status?: TuxBadgeStatus;
  tone?: TuxBadgeTone;
  kind?: TuxBadgeKind;
  variant?: TuxBadgeVariant;
  bold?: boolean;
  dot?: boolean;
  icon?: string;
  count?: number | string;
  label?: string;
  uppercase?: boolean;
  shape?: "default" | "sharp" | "pill";
  /**
   * Multi-channel shape encoding (WCAG 2.2 AAA / CVD accessibility).
   * Replaces uniform dots with distinct shape micro-glyphs:
   * (e.g. check-circle for completed/success, alert-triangle for warning/draft,
   * alert-octagon for failed/error/danger, clock for queued, shield for verified/tier).
   */
  glyph?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  kind: "default",
  tier: undefined,
  status: undefined,
  tone: undefined,
  variant: undefined,
  bold: false,
  dot: false,
  glyph: false,
  icon: undefined,
  count: undefined,
  label: undefined,
  uppercase: false,
  shape: "default",
});

const mode = computed<"tier" | "status" | "tone" | "kind">(() =>
  props.tier ? "tier" : props.status ? "status" : props.tone ? "tone" : "kind"
);

type UColor = "info" | "neutral" | "primary" | "success" | "warning" | "error";

const tierColor: Record<TuxBadgeTier, UColor> = {
  public: "info",
  internal: "neutral",
  sensitive: "primary",
  restricted: "primary",
};

// `tone` maps onto UBadge's semantic palette — it IS the open color set.
const toneColor: Record<TuxBadgeTone, UColor> = {
  info: "info",
  success: "success",
  warning: "warning",
  error: "error",
  danger: "error",
  brand: "primary",
  neutral: "neutral",
  muted: "neutral", // low-emphasis grey alias (used by split-pane showcase)
  custom: "neutral",
};

const statusColor: Record<TuxBadgeStatus, UColor> = {
  completed: "success",
  running: "warning",
  failed: "error",
  queued: "neutral",
  paused: "info",
  cancelled: "neutral",
  published: "success",
  draft: "warning",
  expired: "error",
  verified: "success",
};

const uColor = computed<UColor>(() => {
  if (mode.value === "tier") return tierColor[props.tier as TuxBadgeTier];
  if (mode.value === "status") return statusColor[props.status as TuxBadgeStatus];
  if (mode.value === "tone") return toneColor[props.tone as TuxBadgeTone];
  return "neutral";
});

const isBold = computed(
  () => props.bold || props.variant === "bold" || props.variant === "solid" || props.tier === "restricted"
);

const uVariant = computed<"solid" | "soft" | "outline" | "subtle">(() => {
  if (isBold.value) return "solid";
  if (props.kind === "tag" || props.variant === "outline") return "outline";
  if (props.variant === "subtle") return "subtle";
  return "soft";
});

const uBadgeUi = {
  base: "font-semibold tracking-tight inline-flex items-center gap-1.5 whitespace-nowrap max-w-full border border-surface-border/40",
};

const shapeClass = computed(() => {
  if (props.shape === "sharp") return "!rounded-none";
  if (props.shape === "pill") return "!rounded-full";
  return "!rounded-xs";
});

const dotColor = computed(() => {
  if (props.status) {
    return {
      completed: "var(--color-success)",
      running: "var(--brand-accent)",
      failed: "var(--color-error)",
      queued: "var(--text-muted)",
      paused: "var(--color-info)",
      cancelled: "var(--text-muted)",
      published: "var(--color-success)",
      draft: "var(--brand-accent)",
      expired: "var(--color-error)",
      verified: "var(--color-success)",
    }[props.status];
  }
  if (props.dot) {
    if (props.tone === "brand") return "var(--brand-primary)";
    if (props.tone === "success") return "var(--color-success)";
    if (props.tone === "warning") return "var(--brand-accent)";
    if (props.tone === "danger" || props.tone === "error") return "var(--color-error)";
    if (props.tone === "info") return "var(--color-info)";
    return "var(--text-muted)";
  }
  return "";
});

const hasDot = computed(() => {
  if (props.icon) return false;
  if (props.dot) return true;
  if (mode.value === "status" && props.status !== "running") return true;
  return false;
});

const shouldPulseDot = computed(() => {
  return (
    props.dot &&
    (props.tone === "success" ||
      props.tone === "danger" ||
      props.tone === "error" ||
      props.status === "published")
  );
});

const isTagFont = computed(() => props.kind === "tag");
// Nuxt UI's warning text on amber-50 bg under-contrasts. Tag so tux.css
// can pull it to amber-800 — mirrors the TuxAlert warning fix.
const isWarningColor = computed(() => uColor.value === "warning");

const statusGlyphIcon: Record<TuxBadgeStatus, string> = {
  completed: "lucide:check-circle-2",
  running: "lucide:loader-2",
  failed: "lucide:alert-octagon",
  queued: "lucide:clock",
  paused: "lucide:pause-circle",
  cancelled: "lucide:slash",
  published: "lucide:check-circle-2",
  draft: "lucide:file-edit",
  expired: "lucide:alert-octagon",
  verified: "lucide:shield-check",
};

const toneGlyphIcon: Record<TuxBadgeTone, string> = {
  success: "lucide:check-circle-2",
  warning: "lucide:alert-triangle",
  danger: "lucide:alert-octagon",
  error: "lucide:alert-octagon",
  info: "lucide:info",
  brand: "lucide:sparkles",
  neutral: "lucide:circle-dot",
  muted: "lucide:circle",
  custom: "lucide:circle",
};

const tierGlyphIcon: Record<TuxBadgeTier, string> = {
  public: "lucide:globe",
  internal: "lucide:building-2",
  sensitive: "lucide:shield-alert",
  restricted: "lucide:lock",
};

const { prefs: visionPrefs } = useTuxVisionPrefs();

const isGlyphActive = computed(() => {
  if (props.glyph) return true;
  return visionPrefs.value.distinctMarkers && (hasDot.value || props.status !== undefined || props.tone !== undefined || props.tier !== undefined);
});

const activeGlyphIcon = computed(() => {
  if (props.icon) return props.icon;
  if (!isGlyphActive.value) return undefined;
  if (props.status) return statusGlyphIcon[props.status];
  if (props.tone) return toneGlyphIcon[props.tone];
  if (props.tier) return tierGlyphIcon[props.tier];
  return undefined;
});
</script>

<template>
  <UBadge
    :color="uColor"
    :variant="uVariant"
    :ui="uBadgeUi"
    :class="[
      shapeClass,
      isTagFont && 'font-mono font-normal',
      props.uppercase && 'font-mono uppercase tracking-wider text-[10px] font-bold',
      isWarningColor && !isBold && 'tux-badge--warning',
      mode === 'tone' && tone === 'custom' && 'tux-badge--custom',
      mode === 'tier' && tier && `tux-badge--tier-${tier}`,
      mode === 'status' && status && `tux-badge--status-${status}`,
      isBold && 'font-bold shadow-xs',
    ]"
    data-testid="tux-badge"
  >
    <template v-if="props.icon" #leading>
      <UIcon :name="props.icon" class="w-3 h-3 flex-shrink-0" aria-hidden="true" />
    </template>
    <template v-else-if="activeGlyphIcon" #leading>
      <UIcon
        :name="activeGlyphIcon"
        class="w-3.5 h-3.5 flex-shrink-0"
        :class="[
          status === 'running' && 'animate-spin',
          shouldPulseDot && 'animate-pulse',
        ]"
        aria-hidden="true"
      />
    </template>
    <template v-else-if="mode === 'status' && status === 'running'" #leading>
      <UIcon name="lucide:loader-2" class="w-3 h-3 animate-spin" aria-hidden="true" />
    </template>
    <template v-else-if="hasDot" #leading>
      <span
        class="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
        :class="shouldPulseDot && 'animate-pulse'"
        :style="{ background: dotColor }"
        aria-hidden="true"
      />
    </template>

    <slot>
      <template v-if="mode === 'tier'">{{ label || tier }}</template>
      <template v-else-if="mode === 'status'">{{ label || status }}</template>
      <template v-else>{{ label }}</template>
    </slot>

    <span v-if="count != null" class="ml-0.5 font-semibold">{{ count }}</span>
  </UBadge>
</template>
