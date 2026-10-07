<script setup lang="ts">
/**
 * TuxButton — UButton with a single `intent` prop that encodes the four
 * semantic button roles TTI apps reach for repeatedly:
 *
 *   primary      · the go-button — brand maroon fill
 *   secondary    · the "safe choice" — neutral outline
 *   ghost        · subtle, chrome-like — transparent until hover
 *   destructive  · outline-red that fills solid on hover (btn-fill-on-hover)
 *
 * Geometry:
 *   shape="sharp" | "square" · 0px border radius (!rounded-none), matching
 *                             the rectangular button style of tti.tamu.edu
 *                             and TTI's Kadence theme.
 *   shape="pill"             · fully rounded pill (!rounded-full)
 *   shape="default"          · system default token radius
 *
 * All UButton props are still forwarded (size, icon, loading, disabled, to,
 * trailing-icon, etc.) — `intent` just picks the color + variant + class
 * combination. Pass `color` or `variant` explicitly and it wins.
 *
 * Usage:
 *   <tux-button intent="primary" icon="lucide:play">Run</tux-button>
 *   <tux-button intent="primary" shape="sharp">About TTI</tux-button>
 *   <tux-button intent="destructive" icon="lucide:trash-2">Delete</tux-button>
 */

type Intent = "primary" | "secondary" | "ghost" | "destructive";
type Shape = "default" | "sharp" | "square" | "pill";

interface Props {
  intent?: Intent;
  shape?: Shape;
}

const props = withDefaults(defineProps<Props>(), {
  intent: "primary",
  shape: "default",
});

const intentMap = {
  primary:     { color: "primary", variant: "solid",   klass: "" },
  secondary:   { color: "neutral", variant: "outline", klass: "" },
  ghost:       { color: "neutral", variant: "ghost",   klass: "" },
  destructive: { color: "error",   variant: "outline", klass: "btn-fill-on-hover" },
} as const;

const mapped = computed(() => intentMap[props.intent]);

const shapeClass = computed(() => {
  if (props.shape === "sharp" || props.shape === "square") {
    return "!rounded-none";
  }
  if (props.shape === "pill") {
    return "!rounded-full";
  }
  return "!rounded-xs";
});
</script>

<template>
  <UButton
    :color="mapped.color"
    :variant="mapped.variant"
    :class="[
      mapped.klass,
      shapeClass,
      'active:scale-[0.98] transition-all duration-150 font-semibold tracking-tight min-h-[38px] sm:min-h-[34px] focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2',
    ]"
    v-bind="$attrs"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </UButton>
</template>
