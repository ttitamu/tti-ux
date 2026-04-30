<script setup lang="ts">
/**
 * TuxSkeleton — placeholder shapes for loading states.
 *
 * Two ways to use:
 *   1. As a primitive — pass `width`, `height`, `radius`, `variant` and
 *      drop wherever a real piece of content will appear.
 *   2. Via a `kind` preset — `card` / `list` / `table` / `article` /
 *      `media` produce a composed shape (multiple internal lines)
 *      so a single `<TuxSkeleton kind="article" />` renders a
 *      believable article-body placeholder.
 *
 * Animation:
 *   - Default: a slow shimmer sweeps across the surface (1.6s linear).
 *   - Honors `prefers-reduced-motion: reduce` automatically — collapses
 *     to a static tinted block, no movement, no gradient sweep.
 *   - Pass `animated="never"` to force-disable the shimmer (e.g. inside
 *     a print stylesheet or a screenshot context).
 *   - Pass `animated="pulse"` to swap the sweep for an opacity pulse
 *     (cheaper, lower-distraction; recommended for dense lists).
 *
 * Theme-aware: the base tint is `--surface-sunken`; the highlight stop
 * is `--surface-border`. Both adapt to light / dark / HC.
 */
type Variant = "block" | "text" | "circle";
type Kind = "primitive" | "card" | "list" | "table" | "article" | "media" | "stat";
type Animation = "shimmer" | "pulse" | "never";

interface Props {
  kind?: Kind;
  variant?: Variant;
  /** CSS width — `100%`, `12rem`, `40ch`, etc. */
  width?: string;
  /** CSS height — `1em`, `2.5rem`, `12rem`. */
  height?: string;
  /** Border radius override — defaults vary by variant. */
  radius?: string;
  /** Number of repeat lines — applies to `kind="list" | "article" | "table"`. */
  count?: number;
  animated?: Animation;
  /** Accessible label announced by AT. Defaults to "Loading…". */
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  kind: "primitive",
  variant: "block",
  width: "100%",
  height: undefined,
  radius: undefined,
  count: 3,
  animated: "shimmer",
  label: "Loading…",
});

const computedHeight = computed(() => {
  if (props.height) return props.height;
  if (props.variant === "text") return "0.75em";
  if (props.variant === "circle") return props.width;
  return "1.25rem";
});

const computedRadius = computed(() => {
  if (props.radius) return props.radius;
  if (props.variant === "circle") return "50%";
  if (props.variant === "text") return "var(--radius-sm)";
  return "var(--radius-sm)";
});

const repeatLines = computed(() => Array.from({ length: props.count }));
</script>

<template>
  <div
    class="tux-skeleton-wrap"
    :class="[
      `tux-skeleton-wrap--${kind}`,
      `tux-skeleton-wrap--${animated}`,
    ]"
    role="status"
    :aria-label="label"
    aria-live="polite"
  >
    <span class="sr-only">{{ label }}</span>

    <!-- ── Primitive: a single shape ──────────────────────────── -->
    <span
      v-if="kind === 'primitive'"
      class="tux-skeleton"
      :style="{ width, height: computedHeight, borderRadius: computedRadius }"
      aria-hidden="true"
    />

    <!-- ── Card: thumbnail + 2 lines ──────────────────────────── -->
    <div v-else-if="kind === 'card'" class="tux-skeleton__card" aria-hidden="true">
      <span class="tux-skeleton tux-skeleton__media" />
      <span class="tux-skeleton tux-skeleton__heading" />
      <span class="tux-skeleton tux-skeleton__line" />
      <span class="tux-skeleton tux-skeleton__line tux-skeleton__line--short" />
    </div>

    <!-- ── List: N rows, each a heading + sub ──────────────────── -->
    <ul v-else-if="kind === 'list'" class="tux-skeleton__list" aria-hidden="true">
      <li v-for="(_, i) in repeatLines" :key="i" class="tux-skeleton__list-item">
        <span class="tux-skeleton tux-skeleton__avatar" />
        <span class="tux-skeleton__list-text">
          <span class="tux-skeleton tux-skeleton__heading" />
          <span class="tux-skeleton tux-skeleton__line tux-skeleton__line--short" />
        </span>
      </li>
    </ul>

    <!-- ── Table: header row + N body rows ─────────────────────── -->
    <div v-else-if="kind === 'table'" class="tux-skeleton__table" aria-hidden="true">
      <div class="tux-skeleton__table-row tux-skeleton__table-row--head">
        <span class="tux-skeleton tux-skeleton__cell" v-for="i in 4" :key="i" />
      </div>
      <div
        v-for="(_, i) in repeatLines"
        :key="i"
        class="tux-skeleton__table-row"
      >
        <span class="tux-skeleton tux-skeleton__cell" v-for="c in 4" :key="c" />
      </div>
    </div>

    <!-- ── Article: title + meta + N body lines ────────────────── -->
    <div v-else-if="kind === 'article'" class="tux-skeleton__article" aria-hidden="true">
      <span class="tux-skeleton tux-skeleton__title" />
      <span class="tux-skeleton tux-skeleton__meta" />
      <span
        v-for="(_, i) in repeatLines"
        :key="i"
        class="tux-skeleton tux-skeleton__line"
        :class="i === repeatLines.length - 1 ? 'tux-skeleton__line--short' : ''"
      />
    </div>

    <!-- ── Media: 16:9 figure ──────────────────────────────────── -->
    <div v-else-if="kind === 'media'" class="tux-skeleton__media-wrap" aria-hidden="true">
      <span class="tux-skeleton tux-skeleton__media tux-skeleton__media--full" />
    </div>

    <!-- ── Stat: big number + label ────────────────────────────── -->
    <div v-else-if="kind === 'stat'" class="tux-skeleton__stat" aria-hidden="true">
      <span class="tux-skeleton tux-skeleton__stat-eyebrow" />
      <span class="tux-skeleton tux-skeleton__stat-value" />
      <span class="tux-skeleton tux-skeleton__stat-label" />
    </div>
  </div>
</template>

<style scoped>
.tux-skeleton-wrap {
  display: block;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.tux-skeleton {
  display: block;
  background: var(--surface-sunken);
  border-radius: var(--radius-sm);
  position: relative;
  overflow: hidden;
}

/* Shimmer — gradient sweep across the placeholder. */
.tux-skeleton-wrap--shimmer .tux-skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, var(--surface-border) 60%, transparent) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: tux-skeleton-shimmer 1.6s linear infinite;
}

@keyframes tux-skeleton-shimmer {
  to { transform: translateX(100%); }
}

/* Pulse — cheaper alternative; opacity oscillation only. */
.tux-skeleton-wrap--pulse .tux-skeleton {
  animation: tux-skeleton-pulse 1.6s ease-in-out infinite;
}

@keyframes tux-skeleton-pulse {
  0%, 100% { opacity: 0.85; }
  50%      { opacity: 0.55; }
}

/* Reduced motion — collapse all motion to a static tint. */
@media (prefers-reduced-motion: reduce) {
  .tux-skeleton-wrap--shimmer .tux-skeleton::after,
  .tux-skeleton-wrap--pulse .tux-skeleton {
    animation: none;
  }
  .tux-skeleton-wrap--shimmer .tux-skeleton::after {
    display: none;
  }
}

/* Never — opt-out via prop (print, screenshots). */
.tux-skeleton-wrap--never .tux-skeleton::after {
  display: none;
}
.tux-skeleton-wrap--never .tux-skeleton {
  animation: none;
}

/* ── Composed shapes ─────────────────────────────────────────── */

.tux-skeleton__card {
  display: grid;
  gap: 0.625rem;
}

.tux-skeleton__media {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
  border-radius: var(--radius-md);
}

.tux-skeleton__media--full {
  aspect-ratio: 16 / 9;
}

.tux-skeleton__media-wrap {
  display: block;
}

.tux-skeleton__heading {
  height: 1.25rem;
  width: 70%;
}

.tux-skeleton__line {
  height: 0.75rem;
  width: 100%;
}

.tux-skeleton__line--short {
  width: 65%;
}

.tux-skeleton__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.875rem;
}

.tux-skeleton__list-item {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  gap: 0.875rem;
  align-items: center;
}

.tux-skeleton__list-text {
  display: grid;
  gap: 0.4375rem;
}

.tux-skeleton__avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: block;
}

.tux-skeleton__table {
  display: grid;
  gap: 0.5rem;
}

.tux-skeleton__table-row {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 0.6fr;
  gap: 0.625rem;
}

.tux-skeleton__cell {
  height: 0.875rem;
}

.tux-skeleton__table-row--head .tux-skeleton__cell {
  height: 0.625rem;
  opacity: 0.7;
}

.tux-skeleton__article {
  display: grid;
  gap: 0.625rem;
}

.tux-skeleton__title {
  height: 1.875rem;
  width: 80%;
}

.tux-skeleton__meta {
  height: 0.75rem;
  width: 35%;
  margin-bottom: 0.5rem;
}

.tux-skeleton__stat {
  display: grid;
  gap: 0.4375rem;
}

.tux-skeleton__stat-eyebrow {
  height: 0.625rem;
  width: 30%;
}

.tux-skeleton__stat-value {
  height: 2.5rem;
  width: 55%;
}

.tux-skeleton__stat-label {
  height: 0.875rem;
  width: 70%;
}
</style>
