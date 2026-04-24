<script setup lang="ts">
/**
 * TuxAlert — TTI-flavored callout with Docusaurus-style left-bar.
 *
 * UAlert in `subtle` mode is fill-only (no left bar), which kills the
 * admonition rhythm we want for compliance messaging. We keep UAlert's
 * a11y + structure + color tokens, and add a 4px left border via inline
 * style so it doesn't fight Nuxt UI's Tailwind utilities.
 *
 * Eight variants:
 *   note · tip · info · important · success · warning · danger · compliance
 *
 * `important` and `compliance` both lean on brand-primary (maroon) —
 * intentional: the two signal "institutional" vs "compliance" but share
 * the same visual family. `danger` is distinctly red for "something broke."
 */

type Variant =
  | "note"
  | "tip"
  | "info"
  | "important"
  | "success"
  | "warning"
  | "danger"
  | "compliance";

interface Props {
  variant?: Variant;
  title?: string;
  description?: string;
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "info",
});

const variantMap = {
  note:       { color: "neutral", variant: "subtle", icon: "lucide:pencil",         bar: "var(--text-muted)",    width: "4px" },
  tip:        { color: "tip",     variant: "subtle", icon: "lucide:lightbulb",      bar: "#a78bfa",              width: "4px" },
  info:       { color: "info",    variant: "subtle", icon: "lucide:info",           bar: "var(--color-info)",    width: "4px" },
  important:  { color: "primary", variant: "subtle", icon: "lucide:bookmark",       bar: "var(--brand-primary)", width: "4px" },
  success:    { color: "success", variant: "subtle", icon: "lucide:check-circle-2", bar: "var(--color-success)", width: "4px" },
  warning:    { color: "warning", variant: "subtle", icon: "lucide:triangle-alert", bar: "var(--brand-accent)",  width: "4px" },
  danger:     { color: "error",   variant: "subtle", icon: "lucide:circle-x",       bar: "var(--color-error)",   width: "4px" },
  compliance: { color: "primary", variant: "solid",  icon: "lucide:shield-alert",   bar: "transparent",          width: "0" },
} as const;

const mapped = computed(() => variantMap[props.variant]);
</script>

<template>
  <UAlert
    :color="mapped.color"
    :variant="mapped.variant"
    :icon="icon || mapped.icon"
    :title="title"
    :description="description"
    :class="`tux-alert tux-alert--${variant}`"
    :style="{ borderLeftWidth: mapped.width, borderLeftStyle: 'solid', borderLeftColor: mapped.bar }"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </UAlert>
</template>
