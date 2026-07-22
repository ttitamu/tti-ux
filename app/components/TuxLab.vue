<script setup lang="ts">
/**
 * TuxLab — TTI lab / center identity card.
 *
 * The "what is this lab and who runs it" card. Surfaces the lab's
 * name, logo (optional), leadership, location, and active project
 * count. Use on landing pages, the Centers list, and search-result
 * cards for cross-lab queries.
 *
 * Pairs with `TuxResearcher` (often a lab card lists its leaders
 * via inline TuxResearcher) and `TuxProgram`.
 */
export interface TuxLabLeader {
  /** Leader name. */
  name: string;
  /** Role (Director / Associate Director / etc). */
  role: string;
  /** Portrait URL. */
  portrait?: string;
  /** Profile route. */
  to?: string;
}

interface Props {
  /** Lab / center name. */
  name: string;
  /** One-line summary of focus. */
  summary?: string;
  /** Optional logo URL (mark, not full lockup — the card adds the
   *  name as text). */
  logo?: string;
  /** Active projects count for headline stat. */
  projectsCount?: number;
  /** Researchers count for headline stat. */
  peopleCount?: number;
  /** Optional location string. */
  location?: string;
  /** Leadership row — usually 1-3 entries. */
  leaders?: TuxLabLeader[];
  /** Tags for research focus (e.g. ["Mobility", "Freight", "Safety"]). */
  focus?: string[];
  /** Route to the lab landing page. */
  to?: string;
}

withDefaults(defineProps<Props>(), {
  summary: undefined,
  logo: undefined,
  projectsCount: undefined,
  peopleCount: undefined,
  location: undefined,
  leaders: undefined,
  focus: undefined,
  to: undefined,
});
</script>

<template>
  <article class="tux-lab">
    <header class="tux-lab__header">
      <div v-if="logo" class="tux-lab__logo-wrap">
        <img :src="logo" :alt="`${name} logo`" class="tux-lab__logo" >
      </div>
      <div v-else class="tux-lab__logo-wrap tux-lab__logo-wrap--initials">
        <span>{{ name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("") }}</span>
      </div>

      <div class="tux-lab__title-stack">
        <p v-if="location" class="eyebrow tux-lab__location">{{ location }}</p>
        <h3 class="tux-lab__name">
          <NuxtLink v-if="to" :to="to" class="link-tti">{{ name }}</NuxtLink>
          <template v-else>{{ name }}</template>
        </h3>
        <p v-if="summary" class="tux-lab__summary">{{ summary }}</p>
      </div>
    </header>

    <div v-if="focus && focus.length" class="tux-lab__focus">
      <span v-for="tag in focus" :key="tag" class="tux-lab__focus-tag">{{ tag }}</span>
    </div>

    <div v-if="projectsCount !== undefined || peopleCount !== undefined" class="tux-lab__stats">
      <div v-if="projectsCount !== undefined" class="tux-lab__stat">
        <span class="tux-lab__stat-value">{{ projectsCount }}</span>
        <span class="tux-lab__stat-label">Active projects</span>
      </div>
      <div v-if="peopleCount !== undefined" class="tux-lab__stat">
        <span class="tux-lab__stat-value">{{ peopleCount }}</span>
        <span class="tux-lab__stat-label">Researchers</span>
      </div>
    </div>

    <div v-if="leaders && leaders.length" class="tux-lab__leaders">
      <p class="eyebrow">Leadership</p>
      <ul>
        <li v-for="leader in leaders" :key="leader.name" class="tux-lab__leader">
          <img
            v-if="leader.portrait"
            :src="leader.portrait"
            :alt="leader.name"
            class="tux-lab__leader-portrait"
            loading="lazy"
          >
          <div
            v-else
            class="tux-lab__leader-portrait tux-lab__leader-portrait--initials"
            :aria-label="leader.name"
          >
            {{ leader.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("") }}
          </div>
          <div class="tux-lab__leader-text">
            <p class="tux-lab__leader-name">
              <NuxtLink v-if="leader.to" :to="leader.to" class="link-tti">{{ leader.name }}</NuxtLink>
              <template v-else>{{ leader.name }}</template>
            </p>
            <p class="tux-lab__leader-role">{{ leader.role }}</p>
          </div>
        </li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.tux-lab {
  font-family: var(--font-sans);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-top: 3px solid var(--brand-primary);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tux-lab__header {
  display: grid;
  grid-template-columns: 3.5rem 1fr;
  gap: 1rem;
  align-items: start;
}

.tux-lab__logo-wrap {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tux-lab__logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.tux-lab__logo-wrap--initials {
  background: var(--brand-primary);
  color: var(--text-inverse, #fff);
  font-family: var(--font-display, var(--font-sans));
  font-size: 1.125rem;
  font-weight: 700;
}

.tux-lab__title-stack {
  min-width: 0;
}

.tux-lab__location {
  margin-bottom: 0.125rem;
}

.tux-lab__name {
  font-family: var(--font-display, var(--font-sans));
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.25;
}

.tux-lab__summary {
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--text-secondary);
  margin: 0.25rem 0 0 0;
}

.tux-lab__focus {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tux-lab__focus-tag {
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
  padding: 0.125rem 0.4375rem;
  border-radius: 2px;
}

.tux-lab__stats {
  display: flex;
  gap: 1.5rem;
  padding: 0.625rem 0;
  border-top: 1px solid var(--surface-border);
  border-bottom: 1px solid var(--surface-border);
}

.tux-lab__stat {
  display: flex;
  flex-direction: column;
}

.tux-lab__stat-value {
  font-family: var(--font-display, var(--font-sans));
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--brand-primary);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.tux-lab__stat-label {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  color: var(--text-muted);
  margin-top: 0.125rem;
}

.tux-lab__leaders ul {
  list-style: none;
  margin: 0.375rem 0 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tux-lab__leader {
  display: grid;
  grid-template-columns: 2rem 1fr;
  gap: 0.5rem;
  align-items: center;
}

.tux-lab__leader-portrait {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
  background: var(--surface-sunken);
}

.tux-lab__leader-portrait--initials {
  background: color-mix(in srgb, var(--brand-primary) 12%, var(--surface-sunken));
  color: var(--brand-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 700;
}

.tux-lab__leader-name {
  font-weight: 600;
  font-size: 0.8125rem;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.2;
}

.tux-lab__leader-role {
  font-size: 0.6875rem;
  color: var(--text-muted);
  margin: 0;
}
</style>
