<script setup lang="ts">
/**
 * TuxBadge — TTI-flavored badge family built on UBadge.
 *
 * Five shapes:
 *   <tux-badge tier="sensitive" />                 classification tier
 *   <tux-badge status="running" />                 lifecycle state (spinner on running)
 *   <tux-badge kind="tag">topic:safety</tux-badge> mono-font tag
 *   <tux-badge kind="count" :count="11">md</tux-badge>  facet + count
 *   <tux-badge>generic</tux-badge>                 default neutral
 *
 * Under the hood: UBadge with `:ui` saturation overrides, plus a `#leading`
 * slot for the status-dot / spinning-loader affordance that raw UBadge
 * strips. Keeps UBadge's accessibility + theming; adds editorial weight.
 */

type Tier = "public" | "internal" | "sensitive" | "restricted";
type Status = "running" | "completed" | "failed" | "queued";
type Kind = "tag" | "count" | "default";

interface Props {
  tier?: Tier;
  status?: Status;
  kind?: Kind;
  count?: number | string;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  kind: "default",
});

const mode = computed<"tier" | "status" | "kind">(() =>
  props.tier ? "tier" : props.status ? "status" : "kind"
);

type UColor = "info" | "neutral" | "primary" | "success" | "warning" | "error";

const tierColor: Record<Tier, UColor> = {
  public: "info",
  internal: "neutral",
  sensitive: "primary",
  restricted: "primary",
};

const statusColor: Record<Status, UColor> = {
  completed: "success",
  running: "warning",
  failed: "error",
  queued: "neutral",
};

const uColor = computed<UColor>(() => {
  if (mode.value === "tier") return tierColor[props.tier as Tier];
  if (mode.value === "status") return statusColor[props.status as Status];
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
