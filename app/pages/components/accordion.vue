<script setup lang="ts">
useHead({ title: "TuxAccordion · TUX" });

const faqItems = [
  {
    title: "What does PECAN do that diskover doesn't?",
    content: "PECAN ships per-institution themes and a classifier-aware indexing pipeline. The treemap, search facets, and audit trail are reimplemented on a modern stack — TanStack Virtual + OpenSearch instead of D3 v3 + ElasticSearch. It also bakes in TAMUS access tiers and ITAR compliance markers as first-class concerns.",
    defaultOpen: true,
  },
  {
    title: "How does authentication work for IT vs research staff?",
    content: "Entra ID via oauth2-proxy at the edge — the app receives header-based identity. IT users get full RBAC; research staff get scoped tokens issued via the agent-tokens v2 system (hashed, scoped, revocable per-corpus).",
  },
  {
    title: "Is there a CLI?",
    content: "Yes. `pecan agent watch /path` indexes a directory and streams events to the central OpenSearch. `pecan agent token` manages scoped tokens. `pecan classifier list` shows the classifier catalog.",
  },
  {
    title: "Can I deploy PECAN air-gapped?",
    content: "The current target is TAMUS-network deployments. Air-gapped is feasible — fonts self-host (already wired), OpenSearch is offline-installable, and the only outbound dependencies are the Lucide CDN (replaceable with the bundled Iconify set) and Google Fonts (replaceable with self-hosted equivalents).",
  },
];

const publicationItems = [
  {
    title: "Microsimulation in rural corridor planning",
    meta: "R. Chen, M. Acosta · Transportation Research Record · Vol. 2671 · pp. 88–101",
    content: "Microsimulation results from a twelve-county rural-roadway study, with before/after data spanning 36 months. Treated intersections received high-friction surface treatment, retroreflective markings, and chevron alignment packages. Compliance gains held steady through follow-up; three of twelve sites also showed reductions in late-night crashes.",
  },
  {
    title: "Equity-weighted outcome measures for state DOT performance frameworks",
    meta: "I. Park, S. Okonkwo · Transportation Policy · Vol. 156 · 2025",
    content: "Proposes an equity-weighted outcome measurement framework as a first-class component of state DOT performance dashboards. Validates against three years of Texas Triangle corridor data and demonstrates measurable shifts in resource-allocation decisions when equity outcomes are surfaced alongside efficiency metrics.",
  },
  {
    title: "Continuous instrumentation of the Texas Triangle freight network",
    meta: "TTI MovementLab · Annual Report · 2025",
    content: "Operational summary of the 412-mile continuously-instrumented freight corridor that came online during FY 2025. Includes deployment schedule, sensor types, data-volume estimates, and the schema decisions behind the OpenSearch ingest layer.",
  },
];

const exampleVue = `<TuxAccordion :items="faqItems" />`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxAccordion">
      Disclosure group for FAQ + publication lists. Native
      <code>&lt;details&gt;</code> + <code>&lt;summary&gt;</code> under the
      hood — zero JS, perfect a11y, keyboard navigation works without
      wiring. Two kinds: <strong>faq</strong> (Q&amp;A rhythm) and
      <strong>publication</strong> (italic title + meta line for citations).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">FAQ</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxAccordion :items="faqItems" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">single mode</p>
      <h2 class="heading--bold text-xl font-bold">Mutually exclusive</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>single</code> to make opening one item close the others
        (radio-style). Uses the native <code>name</code> attribute on
        <code>&lt;details&gt;</code> — graceful degradation in older
        browsers (they allow multiple open).
      </p>
      <TuxExample class="mt-4">
        <TuxAccordion single :items="faqItems" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">publication kind</p>
      <h2 class="heading--bold text-xl font-bold">Citation rhythm</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>kind="publication"</code>. Title renders Georgia italic
        (the elegant face), and the <code>meta</code> field surfaces the
        citation line below the title in the summary. Click to expand the
        abstract.
      </p>
      <TuxExample class="mt-4">
        <TuxAccordion kind="publication" :items="publicationItems" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">slot composition</p>
      <h2 class="heading--bold text-xl font-bold">Rich content per item</h2>
      <p class="text-sm text-text-secondary mb-3">
        Each item exposes a <code>#item-{idx}</code> slot for content
        richer than a single string — lists, tables, embedded components.
        Falls back to <code>item.content</code> when the slot is empty.
      </p>
      <TuxExample class="mt-4">
        <TuxAccordion :items="[
          { title: 'How does the agent file-watcher work?', defaultOpen: true },
          { title: 'What gets indexed by default?' },
        ]">
          <template #item-0>
            <p>The agent runs as a long-lived process and uses the OS-native file-watcher API (inotify on Linux, ReadDirectoryChangesW on Windows). Events are coalesced over a 250ms debounce window and shipped in batches:</p>
            <ul>
              <li>Create / modify / delete events for files</li>
              <li>Move detection via inode tracking on POSIX, fallback to hash-on-rename on Windows</li>
              <li>Soft-delete with 30-day retention before purge</li>
            </ul>
            <p>See <code>docs/agent-watching.md</code> for the full event schema.</p>
          </template>
          <template #item-1>
            <p>Filename, path, size, mtime, owner, file-type heuristic, and SHA-256. Classifier output (PII, ITAR markers, retention class) attaches asynchronously after the index pipeline picks up the new record.</p>
          </template>
        </TuxAccordion>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + item shape</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>items</code> — array of <code>{ title, eyebrow?, meta?, content?, defaultOpen? }</code>. Required.</li>
        <li><code>kind</code> — <code>"faq" | "publication"</code>. Defaults to <code>"faq"</code>.</li>
        <li><code>single</code> — exclusive group; opening one closes others. Defaults to <code>false</code>.</li>
        <li><code>#item-{idx}</code> slots — rich content for any item.</li>
      </ul>
    </section>
  </div>
</template>
