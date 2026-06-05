<script setup lang="ts">
/**
 * TuxBadge — TTI-flavored badge family built on UBadge.
 *
 * Six shapes:
 *   <tux-badge tier="sensitive" />                 classification tier
 *   <tux-badge status="running" />                 lifecycle state (spinner on running)
 *   <tux-badge tone="warning">WIP</tux-badge>      generic semantic-color label
 *   <tux-badge kind="tag">topic:safety</tux-badge> mono-font tag
 *   <tux-badge kind="count" :count="11">md</tux-badge>  facet + count
 *   <tux-badge>generic</tux-badge>                 default neutral
 *
 * `tone` is the open-ended sibling of `tier`/`status`: a plain semantic
 * color (info/success/warning/error/neutral) with no lifecycle affordance
 * (no dot, no spinner). Use it for inline doc labels — "Work in Progress",
 * "Available", "Evolving Standard" — where tier/status semantics don't fit.
 *
 * Under the hood: UBadge with `:ui` saturation overrides, plus a `#leading`
 * slot for the status-dot / spinning-loader affordance that raw UBadge
 * strips. Keeps UBadge's accessibility + theming; adds editorial weight.
 */

type Tier = "public" | "internal" | "sensitive" | "restricted";
type Status = "running" | "completed" | "failed" | "queued" | "paused" | "cancelled";
type Tone = "info" | "success" | "warning" | "error" | "neutral";
type Kind = "tag" | "count" | "default";

interface Props {
  tier?: Tier;
  status?: Status;
  tone?: Tone;
  kind?: Kind;
  count?: number | string;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  kind: "default",
  tier: undefined,
  status: undefined,
  tone: undefined,
  count: undefined,
  label: undefined,
});

const mode = computed<"tier" | "status" | "tone" | "kind">(() =>
  props.tier ? "tier" : props.status ? "status" : props.tone ? "tone" : "kind"
);

type UColor = "info" | "neutral" | "primary" | "success" | "warning" | "error";

const tierColor: Record<Tier, UColor> = {
  public: "info",
  internal: "neutral",
  sensitive: "primary",
  restricted: "primary",
};

// `tone` maps 1:1 onto UBadge's semantic palette — it IS the open color set.
const toneColor: Record<Tone, UColor> = {
  info: "info",
  success: "success",
  warning: "warning",
  error: "error",
  neutral: "neutral",
};

const statusColor: Record<Status, UColor> = {
  completed: "success",
  running: "warning",
  failed: "error",
  queued: "neutral",
  // paused: an in-flight job the operator halted (resumable) — info blue,
  // distinct from the amber of an actively-running job.
  paused: "info",
  // cancelled: stopped on purpose (operator / restart), NOT an error —
  // neutral grey so it doesn't read as a failure.
  cancelled: "neutral",
};

const uColor = computed<UColor>(() => {
  if (mode.value === "tier") return tierColor[props.tier as Tier];
  if (mode.value === "status") return statusColor[props.status as Status];
  if (mode.value === "tone") return toneColor[props.tone as Tone];
  return "neutral";
});

const uVariant = computed<"solid" | "soft" | "outline">(() => {
  if (props.tier === "restricted") return "solid";
  if (props.kind === "tag") return "outline";
  return "soft";
});

const uBadgeUi = {
  base: "font-semibold",
};

const dotColor = computed(() => {
  if (mode.value !== "status") return "";
  return {
    completed: "var(--color-success)",
    running: "var(--brand-accent)",
    failed: "var(--color-error)",
    queued: "var(--text-muted)",
    paused: "var(--color-info)",
    cancelled: "var(--text-muted)",
  }[props.status as Status];
});

const isTagFont = computed(() => props.kind === "tag");
// Nuxt UI's warning text on amber-50 bg under-contrasts. Tag so tux.css
// can pull it to amber-800 — mirrors the TuxAlert warning fix.
const isWarningColor = computed(() => uColor.value === "warning");
</script>

<template>
  <UBadge
    :color="uColor"
    :variant="uVariant"
    :ui="uBadgeUi"
    :class="[
      isTagFont && 'font-mono font-normal',
      isWarningColor && 'tux-badge--warning',
      mode === 'tier' && tier && `tux-badge--tier-${tier}`,
      mode === 'status' && status && `tux-badge--status-${status}`,
    ]"
  >
    <template v-if="mode === 'status' && status === 'running'" #leading>
      <UIcon name="lucide:loader-2" class="w-3 h-3 animate-spin" />
    </template>
    <template v-else-if="mode === 'status'" #leading>
      <span
        class="inline-block w-1.5 h-1.5 rounded-full"
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
