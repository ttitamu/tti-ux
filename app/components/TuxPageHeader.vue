<script setup lang="ts">
/**
 * TuxPageHeader — composite: eyebrow + gold-bar heading + subtitle.
 *
 * The rhythm most pages open with. The compact / plain default (no
 * background, h1 + body) is what every existing page uses:
 *
 *   <TuxPageHeader eyebrow="primitives" title="TuxButton">
 *     One-sentence description of what this page covers.
 *   </TuxPageHeader>
 *
 * For marketing landing surfaces, opt into the standard-page-header rhythm
 * with `tone`, `rhythm`, the `#media` slot (image / quick-fact), and the
 * `#actions` slot (CTAs):
 *
 *   <TuxPageHeader
 *     eyebrow="research"
 *     title="Connected & Automated Vehicles"
 *     tone="maroon"
 *     rhythm="hero"
 *   >
 *     Field-deployed sensor networks across the Texas Triangle…
 *     <template #actions>
 *       <TuxButton intent="primary">Browse projects</TuxButton>
 *       <TuxButton intent="ghost">Read the report</TuxButton>
 *     </template>
 *     <template #media>
 *       <img src="/cav-hero.jpg" alt="…" />
 *     </template>
 *   </TuxPageHeader>
 *
 * `level` flips h1 vs h2 without changing visual weight — use h2 when
 * the header sits inside a card or under a layout-level h1.
 */

interface Props {
  eyebrow?: string;
  title: string;
  level?: 1 | 2;
  /** Background treatment.
   *  - plain (default) — no background, body text on page surface.
   *  - neutral         — sunken-gray panel, padded.
   *  - maroon          — brand-primary panel, inverted text.
   */
  tone?: "plain" | "neutral" | "maroon";
  /** Visual size.
   *  - compact (default) — text-3xl heading. Used by every existing page.
   *  - hero              — text-5xl heading + larger body. Landing surfaces.
   */
  rhythm?: "compact" | "hero";
}

withDefaults(defineProps<Props>(), {
  level: 1,
  tone: "plain",
  rhythm: "compact",
});

defineSlots<{
  default?: () => unknown;
  /** Action area — buttons, link list, etc. Renders below the body. */
  actions?: () => unknown;
  /** Right-column media slot — image, quick-fact box, decorative element. */
  media?: () => unknown;
}>();
</script>

<template>
  <header
    class="tux-page-header"
    :class="[
      `tux-page-header--${tone}`,
      `tux-page-header--${rhythm}`,
      $slots.media ? 'tux-page-header--has-media' : '',
    ]"
  >
    <div class="tux-page-header__copy">
      <p v-if="eyebrow" class="eyebrow tux-page-header__eyebrow">{{ eyebrow }}</p>
      <component
        :is="`h${level}`"
        class="heading--bold font-bold tux-page-header__title"
      >
        {{ title }}
      </component>
      <div v-if="$slots.default" class="tux-page-header__body">
        <slot />
      </div>
      <div v-if="$slots.actions" class="tux-page-header__actions">
        <slot name="actions" />
      </div>
    </div>
    <div v-if="$slots.media" class="tux-page-header__media">
      <slot name="media" />
    </div>
  </header>
</template>

<style scoped>
.tux-page-header {
  /* Container queries so the layout responds to the header's own width,
     not the viewport. Critical when the page header sits in a narrow
     column (component demos, sidebar tiles, narrow article frames). */
  container-type: inline-size;
  container-name: tux-page-header;

  margin-bottom: 1.5rem;
  display: grid;
  gap: 2.5rem;
}

.tux-page-header--has-media {
  grid-template-columns: 1fr;
}

@container tux-page-header (min-width: 44rem) {
  .tux-page-header--has-media {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    align-items: center;
  }
}

/* Tone — background + padding. Plain inherits zero chrome. */
.tux-page-header--neutral {
  background: var(--surface-sunken);
  padding: 1.5rem 1.5rem;
  border-radius: var(--radius-md);
}

@container tux-page-header (min-width: 36rem) {
  .tux-page-header--neutral { padding: 2.25rem 2rem; }
  .tux-page-header--maroon  { padding: 2.25rem 2rem; }
}

.tux-page-header--maroon {
  background: var(--brand-primary);
  color: #fff;
  padding: 1.5rem 1.5rem;
  border-radius: var(--radius-md);
}

.tux-page-header--maroon :deep(.eyebrow),
.tux-page-header--maroon .tux-page-header__eyebrow {
  color: rgba(255, 255, 255, 0.72);
}
.tux-page-header--maroon .tux-page-header__title {
  color: #fff;
}
.tux-page-header--maroon .tux-page-header__body {
  color: rgba(255, 255, 255, 0.85);
}

/* Rhythm — heading + body sizes. Hero title uses clamp() so it scales
   fluidly with the container instead of jumping at a breakpoint. */
.tux-page-header--compact .tux-page-header__title {
  font-size: clamp(1.5rem, 1rem + 1.6cqi, 1.875rem);
  line-height: 1.15;
}

.tux-page-header--hero .tux-page-header__title {
  font-size: clamp(2rem, 1.2rem + 4.5cqi, 3.5rem);
  line-height: 1.05;
}

.tux-page-header__body {
  margin-top: 0.75rem;
  max-width: 36rem;
  color: var(--text-secondary);
  line-height: 1.55;
}

.tux-page-header--hero .tux-page-header__body {
  font-size: 1.0625rem;
  margin-top: 1rem;
  max-width: 38rem;
}

.tux-page-header__actions {
  margin-top: 1.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
}

.tux-page-header__media {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tux-page-header__media :deep(img) {
  width: 100%;
  height: auto;
  display: block;
  border-radius: var(--radius-md);
}
</style>
