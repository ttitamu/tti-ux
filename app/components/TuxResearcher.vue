<script setup lang="ts">
/**
 * TuxResearcher — researcher profile card.
 *
 * Surfaces a TTI researcher with portrait + name + role + ORCID +
 * key affiliations + selected projects + optional metrics
 * (h-index, citations, active grants).
 *
 * Three layouts:
 *   - **default** — vertical card (portrait on top, body below).
 *     Best fit for grid layouts (Our People page).
 *   - **horizontal** — portrait left, body right. Best for
 *     directory-list pages where you want denser rows.
 *   - **inline** — compact horizontal with just portrait + name +
 *     role + contact-card style. For "researcher mentioned in
 *     prose" surfaces.
 *
 * Pairs with `TuxLab` + `TuxProgram` + `TuxCenterBadge` in the
 * TTI identity rhythm.
 */
export interface TuxResearcherProject {
  /** Project title (one-line). */
  title: string;
  /** Optional link to the project page. */
  to?: string;
  /** Optional eyebrow (program / center). */
  eyebrow?: string;
}

export interface TuxResearcherMetric {
  /** Metric label (short, e.g. "h-index", "Active grants"). */
  label: string;
  /** Metric value. */
  value: string | number;
}

interface Props {
  /** Display name. */
  name: string;
  /** Role / title (e.g. "Senior Research Scientist"). */
  role: string;
  /** Portrait image URL. */
  portrait?: string;
  /** TTI center / division (e.g. "Mobility Division"). */
  center?: string;
  /** ORCID iD (just digits — "0000-0002-1234-5678"). */
  orcid?: string;
  /** Contact email. */
  email?: string;
  /** Optional one-line bio. */
  bio?: string;
  /** Selected projects. */
  projects?: TuxResearcherProject[];
  /** Key metrics. */
  metrics?: TuxResearcherMetric[];
  /** Layout. Default "default". */
  layout?: "default" | "horizontal" | "inline";
  /** Optional profile-page route for the "View profile" link. */
  to?: string;
}

withDefaults(defineProps<Props>(), {
  portrait: undefined,
  center: undefined,
  orcid: undefined,
  email: undefined,
  bio: undefined,
  projects: undefined,
  metrics: undefined,
  layout: "default",
  to: undefined,
});

function orcidUrl(orcid: string): string {
  return `https://orcid.org/${orcid}`;
}
</script>

<template>
  <article
    class="tux-researcher"
    :class="`tux-researcher--${layout}`"
  >
    <div v-if="portrait" class="tux-researcher__portrait-wrap">
      <img
        :src="portrait"
        :alt="`${name}, ${role}`"
        class="tux-researcher__portrait"
        loading="lazy"
      >
    </div>
    <div v-else class="tux-researcher__portrait-wrap">
      <div
        class="tux-researcher__portrait tux-researcher__portrait--initials"
        :aria-label="`${name} (no portrait)`"
      >
        {{ name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("") }}
      </div>
    </div>

    <div class="tux-researcher__body">
      <div class="tux-researcher__heading">
        <p v-if="center" class="eyebrow tux-researcher__center">{{ center }}</p>
        <h3 class="tux-researcher__name">
          <NuxtLink v-if="to" :to="to" class="link-tti">{{ name }}</NuxtLink>
          <template v-else>{{ name }}</template>
        </h3>
        <p class="tux-researcher__role">{{ role }}</p>
      </div>

      <p v-if="bio && layout !== 'inline'" class="tux-researcher__bio">{{ bio }}</p>

      <ul v-if="metrics && metrics.length && layout !== 'inline'" class="tux-researcher__metrics">
        <li v-for="m in metrics" :key="m.label">
          <span class="tux-researcher__metric-value">{{ m.value }}</span>
          <span class="tux-researcher__metric-label">{{ m.label }}</span>
        </li>
      </ul>

      <div v-if="projects && projects.length && layout !== 'inline'" class="tux-researcher__projects">
        <p class="eyebrow">Selected projects</p>
        <ul>
          <li v-for="(p, i) in projects" :key="i">
            <p v-if="p.eyebrow" class="tux-researcher__project-eyebrow">{{ p.eyebrow }}</p>
            <NuxtLink v-if="p.to" :to="p.to" class="link-tti">{{ p.title }}</NuxtLink>
            <span v-else>{{ p.title }}</span>
          </li>
        </ul>
      </div>

      <div class="tux-researcher__contact">
        <a v-if="email" :href="`mailto:${email}`" class="tux-researcher__contact-link">
          <Icon name="lucide:mail" :size="13" />
          <span class="tux-researcher__contact-label">{{ email }}</span>
        </a>
        <a
          v-if="orcid"
          :href="orcidUrl(orcid)"
          class="tux-researcher__contact-link tux-researcher__contact-link--orcid"
          target="_blank"
          rel="noopener"
        >
          <Icon name="simple-icons:orcid" :size="13" />
          <span class="tux-researcher__contact-label">{{ orcid }}</span>
        </a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.tux-researcher {
  font-family: var(--font-sans);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.tux-researcher__portrait-wrap {
  background: var(--surface-sunken);
  overflow: hidden;
}

.tux-researcher__portrait {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: var(--surface-sunken);
}

.tux-researcher__portrait--initials {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 8%, var(--surface-sunken));
  font-family: var(--font-display, var(--font-sans));
}

.tux-researcher__body {
  padding: 1rem 1.25rem 1.25rem 1.25rem;
}

.tux-researcher__heading {
  margin-bottom: 0.5rem;
}

.tux-researcher__center {
  margin-bottom: 0.25rem;
}

.tux-researcher__name {
  font-family: var(--font-display, var(--font-sans));
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.2;
}

.tux-researcher__role {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0.125rem 0 0 0;
  font-weight: 500;
}

.tux-researcher__bio {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0 0 0.75rem 0;
}

.tux-researcher__metrics {
  list-style: none;
  margin: 0 0 0.75rem 0;
  padding: 0.625rem 0;
  border-top: 1px solid var(--surface-border);
  border-bottom: 1px solid var(--surface-border);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
  gap: 0.5rem;
}

.tux-researcher__metrics li {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.tux-researcher__metric-value {
  font-family: var(--font-display, var(--font-sans));
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--brand-primary);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.tux-researcher__metric-label {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  color: var(--text-muted);
  margin-top: 0.125rem;
}

.tux-researcher__projects {
  margin: 0 0 0.75rem 0;
}

.tux-researcher__projects ul {
  list-style: none;
  margin: 0.25rem 0 0 0;
  padding: 0;
  font-size: 0.8125rem;
}

.tux-researcher__projects li {
  margin-bottom: 0.375rem;
  line-height: 1.4;
}

.tux-researcher__project-eyebrow {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  color: var(--text-muted);
  margin: 0;
}

.tux-researcher__contact {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin-top: 0.625rem;
  padding-top: 0.625rem;
  border-top: 1px solid var(--surface-border);
}

.tux-researcher__contact-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-family: var(--font-mono);
}

.tux-researcher__contact-link:hover {
  color: var(--brand-primary);
}

.tux-researcher__contact-link--orcid {
  color: #a6ce39;
}

.tux-researcher__contact-link--orcid:hover {
  color: #8fb330;
}

/* ---- Horizontal layout ---- */
.tux-researcher--horizontal {
  display: grid;
  grid-template-columns: 8rem 1fr;
}

.tux-researcher--horizontal .tux-researcher__portrait-wrap {
  height: 100%;
  min-height: 8rem;
}

/* ---- Inline layout ---- */
.tux-researcher--inline {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  align-items: center;
}

.tux-researcher--inline .tux-researcher__portrait-wrap {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}

.tux-researcher--inline .tux-researcher__portrait--initials {
  font-size: 0.875rem;
}

.tux-researcher--inline .tux-researcher__body {
  padding: 0;
}

.tux-researcher--inline .tux-researcher__name {
  font-size: 0.875rem;
  font-family: var(--font-sans);
}

.tux-researcher--inline .tux-researcher__role {
  font-size: 0.75rem;
}

.tux-researcher--inline .tux-researcher__heading {
  margin-bottom: 0;
}

.tux-researcher--inline .tux-researcher__contact {
  display: none;
}

@media (max-width: 47.99rem) {
  .tux-researcher--horizontal {
    grid-template-columns: 1fr;
  }
}
</style>
