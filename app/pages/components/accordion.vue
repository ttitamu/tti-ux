<script setup lang="ts">
import tuxAccordionSource from "~/components/TuxAccordion.vue?raw";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxAccordion · TUX" });

const accordionControls: TuxPropControl[] = [
  {
    prop: "kind",
    label: "Disclosure Style",
    type: "select",
    options: ["faq", "publication"],
    defaultValue: "faq",
    description: "FAQ bold questions or publication Georgia-italic citations with meta line",
  },
  {
    prop: "single",
    label: "Mutually Exclusive (Single)",
    type: "boolean",
    defaultValue: false,
    description: "Opening an item closes the others (native details name group)",
  },
];

const accordionPresets: TuxPlaygroundPreset[] = [
  {
    name: "faq-corridor",
    label: "Technical FAQ (Multi)",
    description: "Standard disclosure group for system architecture and operations",
    icon: "lucide:help-circle",
    values: {
      kind: "faq",
      single: false,
    },
  },
  {
    name: "single-exclusive",
    label: "Mutually Exclusive (Single)",
    description: "Radio-style disclosure group where opening an item collapses others",
    icon: "lucide:list-collapse",
    values: {
      kind: "faq",
      single: true,
    },
  },
  {
    name: "publication-citations",
    label: "Research Publications",
    description: "Citation rhythm with elegant italic titles and metadata summary",
    icon: "lucide:book-open",
    values: {
      kind: "publication",
      single: false,
    },
  },
];

const faqItems = [
  {
    eyebrow: "architecture",
    title: "What does Landscape do that diskover doesn't?",
    content: "Landscape provides configurable institutional themes and a classifier-aware indexing pipeline. The treemap, search facets, and audit trail run on TanStack Virtual and OpenSearch, incorporating TTI data-governance tiers and ITAR compliance markers as first-class controls.",
    defaultOpen: true,
  },
  {
    eyebrow: "security · rbac",
    title: "How does authentication work for IT vs research staff?",
    content: "Entra ID via oauth2-proxy at the edge — the app receives header-based identity. IT users get full RBAC; research staff get scoped tokens issued via the agent-tokens v2 system (hashed, scoped, revocable per-corpus).",
  },
  {
    eyebrow: "tooling",
    title: "Is there a CLI?",
    content: "Yes. `landscape agent watch /path` indexes a directory and streams events to the central OpenSearch. `landscape agent token` manages scoped tokens. `landscape classifier list` shows the classifier catalog.",
  },
  {
    eyebrow: "deployment",
    title: "Can I deploy Landscape air-gapped?",
    content: "The primary target is TTI internal network deployments. Offline or air-gapped installations are supported: fonts self-host locally, OpenSearch runs on-premise, and icon bundles package locally with zero external network dependencies.",
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

const exampleVue = `<tux-accordion :items="faqItems" />`;
const singleVue = `<tux-accordion single :items="faqItems" />`;
const pubVue = `<tux-accordion kind="publication" :items="publicationItems" />`;
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

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-accordion"
        component-name="TuxAccordion"
        title="TuxAccordion Workbench"
        eyebrow="Interactive Component Playground"
        :controls="accordionControls"
        :presets="accordionPresets"
        :source="tuxAccordionSource"
        :code-template="(values) => {
          const kindAttr = values.kind !== 'faq' ? ` kind=\x22${values.kind}\x22` : '';
          const singleAttr = values.single ? ' single' : '';
          const itemsVar = values.kind === 'publication' ? 'publicationItems' : 'faqItems';
          return `<tux-accordion :items=\x22${itemsVar}\x22${kindAttr}${singleAttr} />`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full max-w-2xl">
            <TuxAccordion
              :items="values.kind === 'publication' ? publicationItems : faqItems"
              :kind="values.kind"
              :single="values.single"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">FAQ</h2>
      <TuxExample class="mt-4" :vue="exampleVue" :source="tuxAccordionSource">
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
      <TuxExample class="mt-4" :vue="singleVue" :source="tuxAccordionSource">
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
      <TuxExample class="mt-4" :vue="pubVue" :source="tuxAccordionSource">
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
      <TuxExample class="mt-4" :source="tuxAccordionSource">
        <TuxAccordion
:items="[
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
