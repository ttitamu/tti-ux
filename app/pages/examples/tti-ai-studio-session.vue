<script setup lang="ts">
useHead({ title: "Example · tti-ai-studio session · TUX" });

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

// Branch alternates — the assistant produced 3 candidate responses; we
// show the 2nd as the selected one to demo the nav in a non-edge state.
const currentBranch = ref(2);
const branchTotal = 3;

// Mid-session token budget. Numbers chosen to land in the amber band so
// the meter's tone-coding is visible without looking alarming.
const contextMeter = {
  used: 142_000,
  max: 200_000,
  modelLabel: "opus-4-7 · 200k context",
  breakdown: {
    input:  { tokens: 118_400, cost: "$0.59" },
    output: { tokens:  23_600, cost: "$1.18" },
    totalCost: "$1.77",
  },
};

// Follow-up prompts surfaced after the assistant's first answer. Mix of
// plain strings + label/prompt pairs to demo both TuxSuggestionChips shapes.
const followupSuggestions = [
  "Why does CLS-211 drop on public-tier?",
  "Show the per-document score deltas",
  { label: "Promote CLS-211 to staging", prompt: "Draft the changelog entry to promote CLS-211 to staging." },
  { label: "Export ITAR-only comparison", prompt: "Export the comparison filtered to ITAR-tier documents only, as CSV." },
];

// Reasoning trace shown above the assistant body. Emitted by the model
// while planning; collapsed once streaming finishes.
const reasoningText = `I'll need to load grants-2024-2026, filter to ITAR tier 1+, and run both CLS-204 (production) and CLS-211 (candidate) over the same subset. Precision and recall by tier give us the apples-to-apples view — public-tier numbers also matter for regression analysis since the retrain shouldn't sacrifice public-tier accuracy for ITAR gains.`;

// Tool call surfaced inside the message — what the model actually did.
const toolBody = `SELECT precision, recall FROM classifier_metrics
WHERE classifier IN ('CLS-204','CLS-211')
  AND corpus = 'grants-2024-2026'
  AND tier   IN ('itar','public')
GROUP BY classifier, tier;
-- 4 rows returned in 312ms`;

// Reproducibility artifact — Python that reproduces the comparison.
const comparisonPy = `# Reproduces the CLS-204 vs CLS-211 ITAR comparison shown above.
from tti_ai_studio import corpora, models

scope = corpora.load("grants-2024-2026")
itar   = scope.filter(tier="itar")
public = scope.filter(tier="public")

for label, subset in [("itar", itar), ("public", public)]:
    for cls in ("CLS-204", "CLS-211"):
        m = models.classifier(cls)
        p, r = m.evaluate(subset)
        print(f"{cls} {label}: precision={p:.3f} recall={r:.3f}")
`;

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

// Cross-app switcher — visible in the page header. Marks "AI Studio"
// as current; other tiles link out (in a real Tauri shell these
// would open in the host browser or switch the Tauri window).
const ttiApps = [
  {
    id: "ai-studio",
    name: "AI Studio",
    tagline: "Conversational research assistant",
    icon: "lucide:bot",
    to: "/examples/tti-ai-studio-session",
    current: true,
  },
  {
    id: "landscape",
    name: "Landscape",
    tagline: "Research dashboard · runs, corpora, KPIs",
    icon: "lucide:map",
    to: "/examples/landscape-dashboard",
  },
  {
    id: "tux",
    name: "TUX style guide",
    tagline: "Design system docs · components, charts, tokens",
    icon: "lucide:palette",
    to: "/",
  },
];

// Focus-mode for the artifact — when the researcher wants to read /
// edit the reproducibility script in a distraction-free overlay.
const artifactFocusOpen = ref(false);

// Reaction state on the assistant turn. Replaces the inline thumbs.
const assistantReaction = ref<string | undefined>(undefined);

// Composer draft (dogfood 2026-05-22) — backing the new
// TuxMarkdownEditor below.
const composerDraft = ref("");
</script>

<template>
  <div class="space-y-10">
    <div class="example-demo-notice">
      <Icon name="lucide:layers" class="example-demo-notice__icon" aria-hidden="true" />
      <p class="example-demo-notice__text">
        <strong>Composition example.</strong>
        Real-shape tti-ai-studio session — composer, citations,
        right-rail corpus + usage + recent sessions, ⌘K palette, plus
        the AI-elements pieces (context meter, branch nav, inline
        citations, artifact, follow-up chips, reaction bar) and the
        Nuxt UI 4 Chat suite (reasoning trace, tool call, shimmer).
        Refreshed 2026-05-22: app switcher in header, focus-mode
        overlay on the artifact, entrance animations on the rail.
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
        <TuxContextMeter
          :used="contextMeter.used"
          :max="contextMeter.max"
          :breakdown="contextMeter.breakdown"
          :model-label="contextMeter.modelLabel"
        />
        <TuxButton intent="primary" icon="lucide:command" @click="cmdRef?.open()">
          Commands · ⌘K
        </TuxButton>
        <TuxButton intent="ghost" icon="lucide:download">
          Export transcript
        </TuxButton>
        <!-- Cross-app switcher — hop to Landscape or the TUX docs
             without leaving the tab. Lives next to the other header
             actions per the AppSwitcher absorption guidance. -->
        <TuxAppSwitcher
          :apps="ttiApps"
          footer-text="Each app uses TUX components; tokens + theme follow."
        />
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
        <TuxChatMessage role="user" author="R. Chen" timestamp="12:14:08">
          <p>
            Compare classifier CLS-204 (current production) and CLS-211
            (candidate retrain) on the <code>grants-2024-2026</code>
            subset. Show precision and recall by ITAR-tier.
          </p>
        </TuxChatMessage>

        <!-- Assistant turn — uses TuxChatMessage as the canonical chat
             component. `meta` carries the model + latency (split from
             the timestamp clock-time per the component's API); the
             header-trailing slot is where TuxBranchNav lives. -->
        <TuxChatMessage
          role="assistant"
          author="tti-ai-studio"
          timestamp="12:14:11"
          meta="opus-4-7 · 0.038s"
        >
          <template #header-trailing>
            <TuxBranchNav v-model="currentBranch" :total="branchTotal" />
          </template>

          <div class="space-y-4">
            <!-- Reasoning + tool trace. UChatReasoning auto-opens during
                 streaming, closes after; we render a finalized snapshot
                 here. UChatTool shows the actual SQL the model ran. -->
            <UChatReasoning :text="reasoningText" :duration="2.4" />

            <UChatTool
              text="grants-corpus.query"
              suffix="Completed"
              icon="lucide:database"
              chevron="trailing"
            >
              <pre class="text-xs font-mono text-text-secondary whitespace-pre-wrap m-0">{{ toolBody }}</pre>
            </UChatTool>

            <p>
              Across <strong>12,480 documents</strong><TuxInlineCitation
                :n="1"
                title="CLS retrain methodology · v3.1"
                href="#"
                excerpt="The retrain pipeline runs nightly on the grants-2024-2026 corpus and emits both classifier checkpoints to the model registry."
                score="0.91"
              /> in the grants-2024-2026 subset, here's the comparison broken
              out by ITAR tier<TuxInlineCitation
                :n="2"
                title="ITAR rubric · §3.2 boundary cases"
                href="#"
                excerpt="Boundary-case classification follows §3.2 (dual-use determination) with a 0.62 confidence threshold."
                score="0.88"
              />:
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
          </div>

          <template #citations>
            <p class="text-sm text-text-secondary mb-2">
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
          </template>

          <!-- Standard message-action set per design/components.md →
               Conventions → Chat-message actions. Order: Copy ·
               Regenerate · Share · Helpful · Off (Regenerate + Share
               omitted on this turn since the demo doesn't wire them). -->
          <template #tools>
            <button class="text-xs text-text-muted hover:text-brand-primary inline-flex items-center gap-1">
              <UIcon name="lucide:copy" class="w-3 h-3" /> Copy
            </button>
            <!-- TuxReactionBar replaces the inline thumb buttons.
                 Captures helpful / question / disagree without the
                 friction of opening a full feedback form. -->
            <TuxReactionBar
              v-model="assistantReaction"
              :counts="{ helpful: 7, question: 1, disagree: 0 }"
            />
          </template>
        </TuxChatMessage>

        <!-- Generated artifact — reproducibility script the assistant
             produced alongside the comparison. Demonstrates TuxArtifact
             wrapping a TuxCodeBlock with its new download affordance,
             plus an "open in focus mode" button that pins the code in
             a distraction-free TuxFocusView. -->
        <TuxArtifact
          title="compare.py"
          meta="Reproducibility script · 14 lines · python · Updated just now"
          icon="lucide:file-code"
        >
          <template #actions>
            <UButton
              variant="ghost"
              size="xs"
              icon="lucide:maximize"
              aria-label="Open artifact in focus mode"
              @click="artifactFocusOpen = true"
            >
              Focus
            </UButton>
          </template>
          <TuxCodeBlock
            :code="comparisonPy"
            lang="python"
            filename="compare.py"
            :line-numbers="true"
          />
        </TuxArtifact>

        <!-- Focus-mode overlay for the artifact. Real apps would put
             the code editor + a diff pane + a "Run" button here. -->
        <TuxFocusView
          v-model:open="artifactFocusOpen"
          eyebrow="Artifact"
          title="compare.py"
        >
          <template #actions>
            <UButton variant="ghost" icon="lucide:download">Download</UButton>
            <UButton variant="primary" icon="lucide:play">Run</UButton>
          </template>
          <TuxCodeBlock
            :code="comparisonPy"
            lang="python"
            filename="compare.py"
            :line-numbers="true"
          />
        </TuxFocusView>

        <!-- Follow-up suggestions surfaced after the assistant's answer.
             Picks pre-fill the composer in a real consumer; here we
             just log them. -->
        <TuxSuggestionChips
          label="Follow up with"
          :items="followupSuggestions"
          @pick="(p) => console.log('picked:', p)"
        />

        <!-- UChatShimmer placeholder showing what a streaming response
             would look like above the composer. In production this
             renders while tokens stream; here it's static for the demo. -->
        <div class="rounded-md border border-surface-border bg-surface-page p-4">
          <UChatShimmer text="Drafting follow-up response…" />
        </div>

        <!-- Composer with TuxMarkdownEditor (refresh 2026-05-22).
             Drops the prior plain textarea for the branded markdown
             editor — researchers can format their follow-ups with
             markdown shortcuts, see a live preview, and the editor
             handles char/word counts and reduced-motion. -->
        <div class="rounded-md border-2 border-brand-primary bg-surface-page p-2 space-y-2">
          <TuxMarkdownEditor
            v-model="composerDraft"
            :rows="5"
            :min-length="3"
            :max-length="8000"
            placeholder="Ask a follow-up — markdown supported · ⌘B / ⌘I / ⌘K · ⌘↵ to send"
            aria-label="Compose a follow-up message"
          />
          <div class="flex items-center justify-between gap-3 px-1">
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
      <aside class="space-y-6 tux-mount-in tux-mount-in--stagger">
        <section class="space-y-3" :style="{ '--tux-mount-stagger-index': 0 }">
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

        <section class="space-y-3" :style="{ '--tux-mount-stagger-index': 1 }">
          <TuxSectionHeader :level="3">Usage</TuxSectionHeader>
          <TuxFactoid variant="default" :density="3" :items="usageStats" />
        </section>

        <section class="space-y-3" :style="{ '--tux-mount-stagger-index': 2 }">
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
