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
 * All UButton props are still forwarded (size, icon, loading, disabled, to,
 * trailing-icon, etc.) — `intent` just picks the color + variant + class
 * combination. Pass `color` or `variant` explicitly and it wins.
 *
 * Usage:
 *   <tux-button intent="primary" icon="lucide:play">Run</tux-button>
 *   <tux-button intent="destructive" icon="lucide:trash-2">Delete</tux-button>
 */

type Intent = "primary" | "secondary" | "ghost" | "destructive";

interface Props {
  intent?: Intent;
}

const props = withDefaults(defineProps<Props>(), {
  intent: "primary",
});

const intentMap = {
  primary:     { color: "primary", variant: "solid",   klass: "" },
  secondary:   { color: "neutral", variant: "outline", klass: "" },
  ghost:       { color: "neutral", variant: "ghost",   klass: "" },
  destructive: { color: "error",   variant: "outline", klass: "btn-fill-on-hover" },
} as const;

const mapped = computed(() => intentMap[props.intent]);
</script>

<template>
  <UButton
    :color="mapped.color"
    :variant="mapped.variant"
    :class="mapped.klass"
    v-bind="$attrs"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </UButton>
</template>
