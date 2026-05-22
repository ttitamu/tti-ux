<script setup lang="ts">
/**
 * TuxAcknowledgments — funding + acknowledgments + ethics block.
 *
 * The bottom-of-paper block that lists who paid, who helped, who
 * approved, and any conflict-of-interest disclosures. Conventional
 * academic-paper rhythm.
 *
 * Four optional sections (each renders only when content passed):
 *   - **funding** — grant numbers + funder names
 *   - **acknowledgments** — collaborators, data sources, support
 *   - **conflicts** — declared conflicts of interest
 *   - **ethics** — IRB approval, consent statement, data access
 *
 * Use at the end of a paper, before references.
 */
interface FundingEntry {
  /** Funder name. */
  funder: string;
  /** Grant / contract number. */
  grant?: string;
  /** Optional URL to the grant on the funder's site. */
  url?: string;
}

interface Props {
  /** Funding list. */
  funding?: FundingEntry[];
  /** Acknowledgments prose (1-2 sentences typically). */
  acknowledgments?: string;
  /** Conflict-of-interest declaration. Pass "None declared." if
   *  there are no conflicts; leaving undefined hides the section. */
  conflicts?: string;
  /** Ethics / IRB / data-access statement. */
  ethics?: string;
}

withDefaults(defineProps<Props>(), {
  funding: undefined,
  acknowledgments: undefined,
  conflicts: undefined,
  ethics: undefined,
});
</script>

<template>
  <section class="tux-acknowledgments" aria-labelledby="ack-title">
    <p id="ack-title" class="eyebrow tux-acknowledgments__eyebrow">
      Acknowledgments &amp; declarations
    </p>

    <div v-if="funding && funding.length" class="tux-acknowledgments__section">
      <h4 class="tux-acknowledgments__heading">Funding</h4>
      <ul class="tux-acknowledgments__funding-list">
        <li v-for="(f, i) in funding" :key="i">
          <a v-if="f.url" :href="f.url" class="link-tti" target="_blank" rel="noopener">
            {{ f.funder }}
          </a>
          <template v-else>{{ f.funder }}</template>
          <span v-if="f.grant" class="tux-acknowledgments__grant">
            (grant <code>{{ f.grant }}</code>)
          </span>
        </li>
      </ul>
    </div>

    <div v-if="acknowledgments" class="tux-acknowledgments__section">
      <h4 class="tux-acknowledgments__heading">Acknowledgments</h4>
      <p class="tux-acknowledgments__body">{{ acknowledgments }}</p>
    </div>

    <div v-if="conflicts" class="tux-acknowledgments__section">
      <h4 class="tux-acknowledgments__heading">Conflicts of interest</h4>
      <p class="tux-acknowledgments__body">{{ conflicts }}</p>
    </div>

    <div v-if="ethics" class="tux-acknowledgments__section">
      <h4 class="tux-acknowledgments__heading">Ethics &amp; data access</h4>
      <p class="tux-acknowledgments__body">{{ ethics }}</p>
    </div>

    <slot />
  </section>
</template>

<style scoped>
.tux-acknowledgments {
  font-family: var(--font-sans);
  margin: 2rem 0;
  padding: 1.25rem 0;
  border-top: 1px solid var(--surface-border);
}

.tux-acknowledgments__eyebrow {
  margin: 0 0 0.875rem 0;
  color: var(--brand-primary);
  font-weight: 700;
}

.tux-acknowledgments__section {
  margin-bottom: 0.875rem;
}

.tux-acknowledgments__section:last-child {
  margin-bottom: 0;
}

.tux-acknowledgments__heading {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  color: var(--text-muted);
  margin: 0 0 0.375rem 0;
}

.tux-acknowledgments__body {
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--text-primary);
  margin: 0;
}

.tux-acknowledgments__funding-list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-primary);
}

.tux-acknowledgments__funding-list li {
  display: inline;
}

.tux-acknowledgments__funding-list li::after {
  content: "; ";
}

.tux-acknowledgments__funding-list li:last-child::after {
  content: "";
}

.tux-acknowledgments__grant {
  color: var(--text-muted);
  font-size: 0.8125rem;
}

.tux-acknowledgments__grant code {
  font-family: var(--font-mono);
  background: var(--surface-sunken);
  padding: 0 0.25rem;
  border-radius: 2px;
  font-size: 0.75rem;
}
</style>
