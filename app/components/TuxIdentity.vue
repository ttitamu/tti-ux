<script setup lang="ts">
// TuxIdentity — institutional header lockup.
//
// The site identity that goes in the top-left of every product. Two
// kinds × two orientations × three levels:
//
//   kind:        lockup  — logo + wordmark
//                text    — wordmark only (no logo)
//
//   orientation: horizontal — logo + text side-by-side (header chrome)
//                stacked    — logo above, text centered (landing covers)
//
//   level:       institution — "Texas A&M Transportation Institute"
//                center      — superhead + center name
//                department  — superhead + department name + thin rule
//
// Pair with `<TuxFooter>` and the mandatory TAMUS subfooter on every
// shipped surface. Logo swaps light/dark via the existing
// `.logo-light-only` / `.logo-dark-only` rules in tux.css.

interface Props {
  /** Display name. Required. Examples: "Texas A&M Transportation Institute",
   *  "Center for Transportation Safety", "Networking & Information Services". */
  name: string;
  /** Eyebrow above the name. Required for `center` and `department` levels;
   *  omit for `institution`. */
  superhead?: string | null;
  /** Hierarchy depth — adjusts type sizes + adds a thin rule on `department`. */
  level?: "institution" | "center" | "department";
  /** Layout. Horizontal for header chrome; stacked for hero/landing. */
  orientation?: "horizontal" | "stacked";
  /** Lockup (logo + text) or text-only. Defaults to lockup. */
  kind?: "lockup" | "text";
  /** Optional href — wraps the identity in a link (NuxtLink if internal,
   *  plain `<a>` if external). Common case: home `/`. */
  href?: string | null;
  /** Override logo size. Defaults are 46px (horizontal) and 56px (stacked). */
  logoSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  superhead: null,
  level: "institution",
  orientation: "horizontal",
  kind: "lockup",
  href: null,
  logoSize: 0,
});

const computedLogoSize = computed(() => {
  if (props.logoSize > 0) return props.logoSize;
  return props.orientation === "stacked" ? 56 : 46;
});

const showRule = computed(() => props.level === "department");
const showSuperhead = computed(() => props.superhead && props.level !== "institution");

// Choose the wrapping element based on whether href is provided. If it
// starts with `/`, NuxtLink; otherwise plain anchor (external).
const isInternalLink = computed(() =>
  props.href && (props.href.startsWith("/") || props.href.startsWith("#"))
);
</script>

<template>
  <component
    :is="href ? (isInternalLink ? 'NuxtLink' : 'a') : 'div'"
    :to="isInternalLink ? href : undefined"
    :href="!isInternalLink && href ? href : undefined"
    class="tux-identity"
    :class="[
      `tux-identity--${orientation}`,
      `tux-identity--${kind}`,
      `tux-identity--${level}`,
    ]"
  >
    <template v-if="kind === 'lockup'">
      <img
        src="/logo.svg"
        alt=""
        aria-hidden="true"
        :width="computedLogoSize"
        :height="computedLogoSize"
        class="tux-identity__logo logo-light-only"
      >
      <img
        src="/logo-dark.svg"
        alt=""
        aria-hidden="true"
        :width="computedLogoSize"
        :height="computedLogoSize"
        class="tux-identity__logo logo-dark-only"
      >
    </template>

    <div class="tux-identity__copy">
      <span v-if="showSuperhead" class="tux-identity__superhead">{{ superhead }}</span>
      <div v-if="showRule" class="tux-identity__rule" aria-hidden="true" />
      <span class="tux-identity__name">{{ name }}</span>
    </div>
  </component>
</template>

<style scoped>
.tux-identity {
  display: flex;
  text-decoration: none;
  color: inherit;
  max-width: 22.5rem;
}

/* Wraps a link — kill default focus ring; rely on the focus pseudo we add. */
.tux-identity:is(a, .router-link-active):focus { outline: none; }

.tux-identity:is(a, .router-link-active):focus-visible {
  outline: 2px solid var(--brand-primary);
  outline-offset: 4px;
}

/* Horizontal: logo + stacked-text-block side-by-side */
.tux-identity--horizontal {
  flex-direction: row;
  align-items: center;
  gap: 0.875rem;
}
.tux-identity--horizontal.tux-identity--text {
  gap: 0;
}

/* Stacked: logo on top, text below + centered */
.tux-identity--stacked {
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  text-align: center;
  max-width: 16.25rem;
}

.tux-identity__logo {
  flex-shrink: 0;
}

.tux-identity__copy {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.tux-identity__superhead {
  font-family: var(--font-body);
  font-size: 0.65625rem;
  letter-spacing: 0.02em;
  line-height: 1.15;
  color: var(--text-muted);
}

.tux-identity__name {
  font-family: var(--font-body);
  font-weight: 500;
  letter-spacing: -0.005em;
  line-height: 1.15;
  color: var(--text-primary);
}

/* Per-level type sizes */
.tux-identity--institution .tux-identity__name { font-size: 1.0625rem; }
.tux-identity--center      .tux-identity__name { font-size: 1.125rem; }
.tux-identity--department  .tux-identity__name { font-size: 1.125rem; }

/* Stacked + text-only is larger (it's the focal element) */
.tux-identity--stacked.tux-identity--text .tux-identity__name {
  font-size: 1.375rem;
  line-height: 1.2;
}
.tux-identity--stacked.tux-identity--lockup .tux-identity__name {
  font-size: 1.125rem;
  line-height: 1.2;
}

/* Department-level rule */
.tux-identity__rule {
  width: 2.625rem;
  height: 1px;
  background: color-mix(in srgb, var(--text-primary) 55%, transparent);
  margin: 0.25rem 0 0.125rem;
}
.tux-identity--stacked .tux-identity__rule {
  width: 2.875rem;
  margin: 0.25rem auto;
}
</style>
