<script setup lang="ts">
/**
 * TuxSectionHeader — the signature TTI editorial section header.
 *
 * Implements the institutional header rhythm found across tti.tamu.edu:
 * bold Maroon title (var(--brand-primary)) paired with
 * a signature Warm Gold accent rule (var(--brand-accent)).
 *
 * Variants:
 *   - 'institutional' (default): Maroon uppercase/bold heading with warm gold underline rule
 *   - 'classic': Traditional tracked-out maroon underline
 *   - 'rule-full': Section title with full-width gold rule line extending to container edge
 *   - 'minimal': Subtle border-bottom divider
 *
 * Usage:
 *   <TuxSectionHeader title="Research Groups" subtitle="Active transportation programs" />
 *   <TuxSectionHeader :level="1">About TTI</TuxSectionHeader>
 */
interface Props {
  level?: 1 | 2 | 3 | 4;
  title?: string;
  /** Second word or phrase rendered in light weight for 'two-tone-rule' variant. */
  secondaryTitle?: string;
  subtitle?: string;
  kicker?: string;
  variant?: "institutional" | "classic" | "rule-full" | "minimal" | "two-tone-rule";
  /** Optional TTI 5-band research division accent ("maroon" | "blue" | "teal" | "green" | "gold"). */
  division?: "maroon" | "blue" | "teal" | "green" | "gold";
}

const props = withDefaults(defineProps<Props>(), {
  level: 2,
  title: undefined,
  secondaryTitle: undefined,
  subtitle: undefined,
  kicker: undefined,
  variant: "institutional",
  division: undefined,
});
</script>

<template>
  <header
    class="mb-6 group tux-section-header"
    :class="props.division ? `tux-section-header--division tux-section-header--division-${props.division}` : ''"
  >
    <!-- Optional Kicker / Eyebrow -->
    <div
      v-if="props.kicker"
      class="text-[11px] font-mono uppercase tracking-wider text-text-muted mb-1 font-semibold"
    >
      {{ props.kicker }}
    </div>

    <!-- Institutional / Rule-Full Variant -->
    <div v-if="props.variant === 'institutional' || props.variant === 'rule-full'" class="relative">
      <div class="flex items-baseline justify-between">
        <component
          :is="`h${props.level}`"
          class="uppercase font-extrabold text-brand-primary transition-colors tracking-tight"
          :class="{
            'text-2xl md:text-3xl': props.level === 1,
            'text-xl md:text-2xl': props.level === 2,
            'text-lg': props.level === 3,
            'text-sm font-bold': props.level === 4,
          }"
        >
          <slot>{{ props.title }}</slot>
        </component>
      </div>

      <!-- Signature Gold Underline Accent Rule (parities tti.tamu.edu) -->
      <div
        class="mt-2 h-[3px] bg-brand-accent transition-all duration-300 tux-section-header__rule"
        :class="props.variant === 'rule-full' ? 'w-full' : 'w-full max-w-full'"
        role="presentation"
      />
    </div>

    <!-- Classic Variant (Historical Tux) -->
    <div v-else-if="props.variant === 'classic'">
      <component
        :is="`h${props.level}`"
        class="uppercase font-bold text-text-primary inline-block pb-1.5"
        :class="{
          'text-2xl': props.level === 1,
          'text-lg': props.level === 2,
          'text-sm': props.level === 3,
          'text-xs': props.level === 4,
        }"
        :style="{
          letterSpacing: 'var(--tracking-wider)',
          borderBottom: '2px solid var(--section-division-accent, var(--brand-primary))',
        }"
      >
        <slot>{{ props.title }}</slot>
      </component>
    </div>

    <!-- Two-Tone Rule Variant (tti.tamu.edu/capabilities parity) -->
    <div v-else-if="props.variant === 'two-tone-rule'" class="relative min-w-0 max-w-full">
      <div class="flex items-center gap-2 sm:gap-4 w-full min-w-0">
        <component
          :is="`h${props.level}`"
          class="uppercase tracking-tight text-brand-primary sm:whitespace-nowrap flex items-baseline flex-wrap sm:flex-nowrap gap-1.5 sm:gap-2 font-display min-w-0"
          :class="{
            'text-2xl md:text-3xl': props.level === 1,
            'text-xl md:text-2xl': props.level === 2,
            'text-lg': props.level === 3,
            'text-sm': props.level === 4,
          }"
        >
          <span class="font-extrabold"><slot>{{ props.title }}</slot></span>
          <span v-if="props.secondaryTitle" class="font-light text-brand-primary/80">{{ props.secondaryTitle }}</span>
        </component>
        <!-- Trailing Warm Gold Keyline Rule -->
        <div class="flex-1 min-w-[16px] h-[2px] sm:h-[3px] bg-brand-accent shrink-0 sm:shrink tux-section-header__rule" role="presentation" />
      </div>
    </div>

    <!-- Minimal Variant -->
    <div v-else class="pb-2 border-b border-surface-border">
      <component
        :is="`h${props.level}`"
        class="font-bold text-text-primary"
        :class="{
          'text-2xl': props.level === 1,
          'text-xl': props.level === 2,
          'text-base': props.level === 3,
          'text-sm': props.level === 4,
        }"
      >
        <slot>{{ props.title }}</slot>
      </component>
    </div>

    <!-- Subtitle -->
    <p v-if="props.subtitle" class="text-sm text-text-secondary mt-2 max-w-3xl">
      {{ props.subtitle }}
    </p>
  </header>
</template>

<style scoped>
.tux-section-header--division .tux-section-header__rule {
  background: var(--section-division-accent, var(--brand-accent));
}
.tux-section-header--division-maroon {
  --section-division-accent: var(--spectrum-maroon, var(--brand-primary));
}
.tux-section-header--division-blue {
  --section-division-accent: var(--spectrum-blue, var(--brand-secondary));
}
.tux-section-header--division-teal {
  --section-division-accent: var(--spectrum-teal, var(--brand-primary));
}
.tux-section-header--division-green {
  --section-division-accent: var(--spectrum-green, var(--color-success));
}
.tux-section-header--division-gold {
  --section-division-accent: var(--spectrum-gold, var(--brand-accent));
}
</style>
