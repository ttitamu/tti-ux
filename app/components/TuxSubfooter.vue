<script setup lang="ts">
// TuxSubfooter — mandatory TAMUS legal strip.
//
// Required on every page of every TTI website. The Texas A&M University
// System mandates this for all member institutions. It must include:
//   - the TAMUS lockup (left-anchored, links to tamus.edu)
//   - the "Coordinated Statewide Transportation Research Program" tagline
//     — TTI-specific, must appear verbatim
//   - the © line with institute name + address
//   - state-agency compliance links (State Link Policy, Texas Veterans
//     Portal, Open Records, Risk/Fraud Hotline, Statewide Search,
//     Site Links & Policies)
//   - State of Texas seal placeholder (right-anchored)
//
// **Do not modify the link list, tagline wording, or lockup placement.**
// The only thing the consumer configures is the institute name + address
// in the © line and the year. AggieUX guidance is explicit about this.

interface Props {
  /** Institute name in the © line. Defaults to TTI but can be overridden
   *  for sibling-institution builds (PVAMU, Tarleton, WTAMU, etc.). */
  name?: string;
  /** Address line in the ©. Defaults to TTI's "3135 TAMU · College Station, TX 77843-3135". */
  address?: string;
  /** Year for the © line. Defaults to current year. */
  year?: number;
}

withDefaults(defineProps<Props>(), {
  name: "Texas A&M Transportation Institute",
  address: "3135 TAMU · College Station, TX 77843-3135",
  year: () => new Date().getFullYear(),
});

// State-agency link list. Mandatory order, mandatory labels. Per the
// AggieUX rules: "Do not rename or remove."
const stateLinks = [
  { label: "State Link Policy",                  href: "https://statelinkpolicy.texas.gov/" },
  { label: "Texas Veterans Portal",              href: "https://veterans.portal.texas.gov/" },
  { label: "Open Records / Public Information",  href: "https://www.tamus.edu/open-records/" },
  { label: "Risk, Fraud & Misconduct Hotline",   href: "https://www.tamus.edu/business/risk-management/" },
  { label: "Statewide Search",                   href: "https://www.tsl.texas.gov/trail/" },
  { label: "Site Links & Policies",              href: "https://www.tamus.edu/site-policies/" },
];
</script>

<template>
  <div class="tux-subfooter">
    <div class="tux-subfooter__grid">
      <!-- TAMUS lockup -->
      <a
        href="https://www.tamus.edu/"
        target="_blank"
        rel="noopener"
        class="tux-subfooter__lockup"
        aria-label="The Texas A&M University System"
      >
        <span class="tux-subfooter__lockup-glyph" aria-hidden="true">A</span>
        <span class="tux-subfooter__lockup-text">
          <span class="tux-subfooter__lockup-eyebrow">A Member of</span>
          <span class="tux-subfooter__lockup-name">The Texas A&amp;M University System</span>
        </span>
      </a>

      <!-- Tagline + © + state links -->
      <div class="tux-subfooter__content">
        <p class="tux-subfooter__tagline">
          Coordinated Statewide Transportation Research Program
        </p>
        <p class="tux-subfooter__copy">
          © {{ year }} {{ name }} · {{ address }}
        </p>
        <ul class="tux-subfooter__links">
          <li v-for="l in stateLinks" :key="l.label">
            <a
              :href="l.href"
              target="_blank"
              rel="noopener"
              class="tux-subfooter__link"
            >{{ l.label }}</a>
          </li>
        </ul>

        <!-- Optional preferences slot — accessibility toggles, locale
             switchers, etc. Rendered subtly below the state-links so
             it doesn't compete with the legal copy. tti-ux uses this
             for the high-contrast toggle (per ADR-0006). -->
        <div v-if="$slots.preferences" class="tux-subfooter__preferences">
          <slot name="preferences" />
        </div>
      </div>

      <!-- State seal placeholder -->
      <div class="tux-subfooter__seal" aria-hidden="true">
        <span class="tux-subfooter__seal-circle" />
        <span class="tux-subfooter__seal-label">State of Texas</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tux-subfooter {
  container-type: inline-size;
  container-name: tux-subfooter;

  background: #1f1c1c;
  color: rgba(255, 255, 255, 0.85);
  font-family: var(--font-body);
  font-size: 0.75rem;
  line-height: 1.6;
  padding: 1.375rem 2rem;
}

.tux-subfooter__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  align-items: flex-start;
  max-width: 80rem;
  margin: 0 auto;
}

@container tux-subfooter (min-width: 48rem) {
  .tux-subfooter__grid {
    grid-template-columns: auto 1fr auto;
    gap: 2rem;
  }
}

.tux-subfooter__lockup {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
  flex-shrink: 0;
}

.tux-subfooter__lockup:hover .tux-subfooter__lockup-name,
.tux-subfooter__lockup:focus-visible .tux-subfooter__lockup-name {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.tux-subfooter__lockup-glyph {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(221, 172, 55, 0.3);
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--brand-accent);
  flex-shrink: 0;
}

.tux-subfooter__lockup-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.tux-subfooter__lockup-eyebrow {
  font-size: 0.625rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.tux-subfooter__lockup-name {
  font-family: var(--font-bold);
  font-weight: 600;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.85);
}

.tux-subfooter__content {
  min-width: 0;
}

.tux-subfooter__tagline {
  margin: 0 0 0.25rem;
  color: rgba(255, 255, 255, 0.55);
}

.tux-subfooter__copy {
  margin: 0;
}

.tux-subfooter__links {
  list-style: none;
  margin: 0.375rem 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
}

.tux-subfooter__link {
  color: var(--brand-accent);
  text-decoration: none;
  border-bottom: 1px solid var(--brand-accent);
  padding-bottom: 1px;
  transition: opacity 0.15s ease;
}
.tux-subfooter__link:hover,
.tux-subfooter__link:focus-visible {
  opacity: 0.8;
  outline: none;
}

.tux-subfooter__preferences {
  margin-top: 0.625rem;
  padding-top: 0.625rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.55);
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
}

.tux-subfooter__preferences :deep(button) {
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  background: transparent;
  border: 0;
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  transition: color 0.15s ease;
}

.tux-subfooter__preferences :deep(button:hover),
.tux-subfooter__preferences :deep(button:focus-visible) {
  color: var(--brand-accent);
  outline: none;
}

.tux-subfooter__seal {
  display: none;
  text-align: right;
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.55);
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

@container tux-subfooter (min-width: 48rem) {
  .tux-subfooter__seal { display: flex; }
}

.tux-subfooter__seal-circle {
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.55);
}
</style>
