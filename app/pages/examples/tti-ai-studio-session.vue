<script setup lang="ts">
useHead({ title: "Example · tti-ai-studio session · TUX" });

const corpora = [
  { value: "grants-2024-2026",        label: "grants-2024-2026 · 12,480 docs",  count: 12480 },
  { value: "movementlab-corridors",   label: "movementlab-corridors · 8,422 docs", count: 8422 },
  { value: "publications-internal",   label: "publications-internal · 4,180 docs", count: 4180 },
  { value: "policy-briefs-2025",      label: "policy-briefs-2025 · 2,344 docs",   count: 2344 },
];

const recentSessions = [
  { id: "session-04ab", title: "Compare CLS-204 vs CLS-211 on grant subset", relTime: "8 min ago" },
  { id: "session-12cd", title: "Draft response to TxDOT IAC 2020-78-104 RFI",  relTime: "1 hr ago" },
  { id: "session-39ef", title: "Pull rural-roadway findings citations",         relTime: "Yesterday" },
  { id: "session-7811", title: "Equity framework — literature scan",            relTime: "2 days ago" },
];

const usageStats = [
  { value: "1,240", suffix: null,  label: "Tokens used · this session", source: null },
  { value: "0.04",  suffix: " s",  label: "Avg latency", source: "p50 across 4 calls" },
  { value: "12",    suffix: null,  label: "Citations attached" },
];

const cmdRef = ref<{ open: () => void } | null>(null);

const cmdGroups = [
  {
    heading: "Session",
    items: [
      { id: "new-session",    label: "New session",       icon: "lucide:plus",  shortcut: "⌘ N",  action: () => {} },
      { id: "switch-corpus",  label: "Switch corpus…",    icon: "lucide:database", shortcut: "⌘ ⇧ C", action: () => {} },
      { id: "export",         label: "Export transcript", icon: "lucide:download", action: () => {} },
    ],
  },
  {
    heading: "Navigate",
    items: [
      { id: "nav-sessions", label: "All sessions", icon: "lucide:history", to: "#" },
      { id: "nav-corpora",  label: "Corpora",      icon: "lucide:database", to: "#" },
      { id: "nav-keys",     label: "API keys",     icon: "lucide:key",      to: "#" },
    ],
  },
];
</script>

<template>
  <div class="space-y-10">
    <div class="example-demo-notice">
      <Icon name="lucide:layers" class="example-demo-notice__icon" aria-hidden="true" />
      <p class="example-demo-notice__text">
        <strong>Composition example.</strong>
        Real-shape tti-ai-studio session — composer, citations,
        right-rail corpus + usage + recent sessions, ⌘K palette.
        Nine Tux* components, app-shape register.
      </p>
    </div>

    <!-- Session breadcrumb -->
    <TuxBreadcrumbs
      :trail="[
        { label: 'Home',         to: '/' },
        { label: 'Sessions',     to: '#' },
        { label: 'Compare CLS-204 vs CLS-211 on grant subset' },
      ]"
    />

    <!-- Session header — neutral tone, not the loud maroon panel; chat
         products live in this register. -->
    <TuxPageHeader
      eyebrow="session · 04ab"
      title="Compare CLS-204 vs CLS-211 on grant subset"
    >
      Started 8 minutes ago by R. Chen. Scoped to
      <code>grants-2024-2026</code>. Model: <code>opus-4-7</code>.
      <template #actions>
        <TuxButton intent="primary" icon="lucide:command" @click="cmdRef?.open()">
          Commands · ⌘K
        </TuxButton>
        <TuxButton intent="ghost" icon="lucide:download">
          Export transcript
        </TuxButton>
      </template>
    </TuxPageHeader>

    <!-- Compliance alert — corpus scope -->
    <TuxAlert
      variant="compliance"
      title="ITAR-tagged corpus segment"
    >
      Your scoped corpus (<code>grants-2024-2026</code>) includes
      ITAR-marked documents. Generated outputs may not be exported
      outside TAMUS without tier-3 token verification.
    </TuxAlert>

    <!-- Two-column: main chat + right rail with corpus + sessions -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_18rem] gap-8 items-start">
      <!-- Main chat column -->
      <div class="space-y-6 min-w-0">
        <TuxSectionHeader>Conversation</TuxSectionHeader>

        <!-- User turn -->
        <article class="rounded-md border border-surface-border bg-surface-page p-5 space-y-2">
          <header class="flex items-baseline gap-3">
            <span class="font-mono text-xs text-text-muted">R. Chen</span>
            <span class="text-xs text-text-muted">12:14:08</span>
          </header>
          <p class="text-text-primary leading-relaxed">
            Compare classifier CLS-204 (current production) and CLS-211
            (candidate retrain) on the <code>grants-2024-2026</code>
            subset. Show precision and recall by ITAR-tier.
          </p>
        </article>

        <!-- Assistant turn -->
        <article class="rounded-md border-2 border-brand-primary bg-surface-raised p-5 space-y-4">
          <header class="flex items-baseline gap-3">
            <span class="font-mono text-xs uppercase tracking-wider font-bold text-brand-primary">tti-ai-studio</span>
            <span class="text-xs text-text-muted">12:14:11 · 0.038s</span>
          </header>

          <p class="text-text-primary leading-relaxed">
            Across <strong>12,480 documents</strong> in the grants-2024-2026
            subset, here's the comparison broken out by ITAR tier:
          </p>

          <TuxDescriptionList
            emphasis="data"
            :items="[
              { term: 'CLS-204 precision · ITAR',  value: '0.872' },
              { term: 'CLS-211 precision · ITAR',  value: '0.918  (+5.3%)' },
              { term: 'CLS-204 recall · ITAR',     value: '0.794' },
              { term: 'CLS-211 recall · ITAR',     value: '0.821  (+3.4%)' },
              { term: 'CLS-204 precision · public', value: '0.962' },
              { term: 'CLS-211 precision · public', value: '0.954  (-0.8%)' },
            ]"
          />

          <TuxCallout kind="stat" variant="default">
            <p>
              CLS-211 is a clear win on ITAR — both precision and recall
              up. Public-tier precision drops slightly; you'll want to
              decide whether the 5pp ITAR gain is worth a 1pp public-tier
              regression.
            </p>
          </TuxCallout>

          <p class="text-text-primary leading-relaxed">
            Citations from the 4 most-discriminating documents:
          </p>

          <ol class="space-y-2 text-sm">
            <li class="flex items-baseline gap-3">
              <span class="font-mono text-xs text-brand-primary font-bold">[1]</span>
              <div>
                <p class="font-medium"><span class="link-tti">CLS retrain methodology · v3.1.pdf</span></p>
                <p class="text-xs text-text-muted font-mono">/grants-2024-2026/retrain/methodology.pdf · cosine 0.91</p>
              </div>
            </li>
            <li class="flex items-baseline gap-3">
              <span class="font-mono text-xs text-brand-primary font-bold">[2]</span>
              <div>
                <p class="font-medium"><span class="link-tti">ITAR rubric · §3.2 boundary cases</span></p>
                <p class="text-xs text-text-muted font-mono">/policy-briefs-2025/itar-rubric.docx · cosine 0.88</p>
              </div>
            </li>
            <li class="flex items-baseline gap-3">
              <span class="font-mono text-xs text-brand-primary font-bold">[3]</span>
              <div>
                <p class="font-medium"><span class="link-tti">DoD-XR contract addendum</span></p>
                <p class="text-xs text-text-muted font-mono">/grants-2024-2026/dod-xr/addendum.pdf · cosine 0.84</p>
              </div>
            </li>
          </ol>

          <footer class="flex items-center gap-3 pt-3 border-t border-surface-border">
            <button class="text-xs text-text-muted hover:text-brand-primary inline-flex items-center gap-1">
              <UIcon name="lucide:copy" class="w-3 h-3" /> Copy
            </button>
            <button class="text-xs text-text-muted hover:text-brand-primary inline-flex items-center gap-1">
              <UIcon name="lucide:thumbs-up" class="w-3 h-3" /> Helpful
            </button>
            <button class="text-xs text-text-muted hover:text-brand-primary inline-flex items-center gap-1">
              <UIcon name="lucide:thumbs-down" class="w-3 h-3" /> Off
            </button>
          </footer>
        </article>

        <!-- Composer -->
        <div class="rounded-md border-2 border-brand-primary bg-surface-page p-3">
          <textarea
            class="w-full min-h-[5rem] bg-transparent border-0 outline-0 resize-y font-body text-sm leading-relaxed"
            placeholder="Ask a follow-up — Cmd+Enter to send, Cmd+K for commands"
          />
          <div class="flex items-center justify-between gap-3 pt-2 border-t border-surface-border mt-2">
            <div class="flex items-center gap-2 text-xs text-text-muted">
              <UIcon name="lucide:database" class="w-3.5 h-3.5" />
              <code class="font-mono">grants-2024-2026</code>
              <span>·</span>
              <code class="font-mono">opus-4-7</code>
            </div>
            <TuxButton intent="primary" icon="lucide:send-horizontal" size="sm">Send</TuxButton>
          </div>
        </div>
      </div>

      <!-- Right rail -->
      <aside class="space-y-6">
        <section class="space-y-3">
          <TuxSectionHeader :level="3">Corpus</TuxSectionHeader>
          <TuxDescriptionList
            emphasis="editorial"
            :items="[
              { term: 'Scope', value: 'grants-2024-2026' },
              { term: 'Docs',  value: '12,480' },
              { term: 'Tier',  value: 'Mixed (incl. ITAR)' },
              { term: 'Last sync', value: '2 min ago' },
            ]"
          />
        </section>

        <section class="space-y-3">
          <TuxSectionHeader :level="3">Usage</TuxSectionHeader>
          <TuxFactoid variant="default" :density="3" :items="usageStats" />
        </section>

        <section class="space-y-3">
          <TuxSectionHeader :level="3">Recent sessions</TuxSectionHeader>
          <TuxAccordion
            :items="recentSessions.map((s) => ({
              title: s.title,
              meta: `${s.id} · ${s.relTime}`,
              content: 'Click to switch sessions. The right rail and conversation history will reload.',
            }))"
            single
          />
        </section>
      </aside>
    </div>

    <!-- Command palette — invokable from the page header. Single
         instance lives in app.vue normally, but this example
         shows the trigger pattern locally for clarity. -->
    <TuxCommandPalette ref="cmdRef" :groups="cmdGroups" />
  </div>
</template>
