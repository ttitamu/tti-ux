<script setup lang="ts">
/**
 * TuxAvatar — the identity mark primitive: photo when available,
 * initials fallback otherwise, optional status dot.
 *
 * Extracted from TuxUserMenu's hand-rolled avatar (which now consumes
 * this) so consumers stop re-deriving initials per app — docs-tti's
 * AuthButton and AI Studio's AccountChip each carried their own copy of
 * the same logic. Initials derive from `name` (first letters of the
 * first two words) unless explicitly overridden.
 *
 * Sizes: sm (24px — dense rows, comment threads), md (28px — chrome
 * chips, the TuxUserMenu trigger), lg (40px — profile headers).
 *
 * Decorative by default (`aria-hidden`) — the accessible name belongs
 * to the interactive wrapper (button/link), not the visual. Pass
 * `:decorative="false"` + `alt` only when the avatar stands alone.
 */
interface Props {
  /** Display name — initials derive from its first two words. */
  name?: string;
  /** Explicit initials override (e.g. preferred-name initials). */
  initials?: string;
  /** Photo URL — falls back to initials while absent/broken. */
  photoUrl?: string;
  size?: "sm" | "md" | "lg";
  /** Status dot in the corner (online/away semantics owned by caller). */
  dot?: "success" | "warning" | "error" | "info";
  /** Set false (with `alt`) when the avatar is not inside a labelled control. */
  decorative?: boolean;
  /** Alt text when `decorative` is false. */
  alt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  initials: undefined,
  photoUrl: undefined,
  size: "md",
  dot: undefined,
  decorative: true,
  alt: undefined,
});

const derivedInitials = computed(() => {
  if (props.initials) return props.initials;
  return (props.name ?? "")
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
});

// A broken photo URL falls back to initials instead of an alt-text box.
const photoFailed = ref(false);
watch(() => props.photoUrl, () => { photoFailed.value = false; });
const showPhoto = computed(() => !!props.photoUrl && !photoFailed.value);
</script>

<template>
  <span
    class="tux-avatar"
    :class="[`tux-avatar--${size}`]"
    :aria-hidden="decorative ? 'true' : undefined"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : alt || name"
  >
    <img
      v-if="showPhoto"
      :src="photoUrl"
      alt=""
      @error="photoFailed = true"
    >
    <template v-else>{{ derivedInitials || "?" }}</template>
    <span
      v-if="dot"
      class="tux-avatar__dot"
      :class="`tux-avatar__dot--${dot}`"
      aria-hidden="true"
    />
  </span>
</template>

<style scoped>
.tux-avatar {
  position: relative;
  flex-shrink: 0;
  border-radius: var(--radius-full);
  background: var(--brand-primary);
  color: var(--text-inverse);
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.tux-avatar--sm { width: 24px; height: 24px; font-size: 0.625rem; }
.tux-avatar--md { width: 28px; height: 28px; font-size: 0.6875rem; }
.tux-avatar--lg { width: 40px; height: 40px; font-size: 0.9375rem; }

.tux-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Status dot sits outside the overflow-hidden circle would clip it, so
   the dot is positioned within the span but above the photo. */
.tux-avatar__dot {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 27%;
  height: 27%;
  border-radius: var(--radius-full);
  box-shadow: 0 0 0 2px var(--surface-raised);
}
.tux-avatar__dot--success { background: var(--color-success); }
.tux-avatar__dot--warning { background: var(--color-warning); }
.tux-avatar__dot--error   { background: var(--color-error); }
.tux-avatar__dot--info    { background: var(--color-info); }
</style>
