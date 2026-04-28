<script setup lang="ts">
useHead({ title: "Markdown (MDC) · TUX" });

// Parse markdown at SSR time via `parseMarkdown()` so fenced code
// blocks ship pre-highlighted (Shiki runs during the parse, using the
// theme + langs configured in nuxt.config.ts). Then `<MDCRenderer>`
// renders the AST into Vue. The runtime `<MDC :value>` shortcut is
// available, but it doesn't run the Shiki pipeline — code blocks
// would render as plain <pre> with the runtime renderer.
//
// Tux components are auto-imported by Nuxt; MDC picks them up via
// the same resolver, so `::tux-alert{...}` block syntax just works.

const sample = `---
title: How the agent watcher works
date: 2026-04-22
author: R. Chen
---

# How the agent watcher works

PECAN's file watcher is the long-running process on each agent host
that detects file events (create / modify / delete / move) and ships
them to the central index.

::tux-alert{variant="compliance" title="ITAR-tagged paths"}
This watcher must run with a tier-3 token when watching corpora that
contain ITAR-marked records. The default agent token is tier-1 and
will refuse the scope.
::

## Event types

The watcher emits four event types upstream:

| Type | Triggers when… |
|---|---|
| \`create\` | A new inode appears in a watched root |
| \`modify\` | An existing inode's content or mtime changes |
| \`delete\` | An inode disappears (soft-delete with 30d retention) |
| \`move\`  | An inode's path changes — single event, never delete+create |

::tux-callout{kind="stat"}
Move detection uses inode tracking on POSIX and SHA-256 correlation
on Windows. Either way, a single \`move\` event is emitted upstream
rather than a delete+create pair.
::

## Implementation note

\`\`\`ts
// Coalesce events over a 250ms window to avoid shipping every
// keystroke during text-editor saves.
const debounced = debounce(events, { window: 250 });
\`\`\`

Run it locally:

\`\`\`bash
$ pecan agent watch /research/grants --root=local
[12:14:08] watcher: 4 paths registered
[12:14:09] heartbeat: ok (latency 38ms)
\`\`\`

::tux-alert{variant="tip" title="Heartbeat cadence"}
The default heartbeat is every 60 seconds. Override with
\`--heartbeat=30s\` for tighter monitoring during a deploy or rolling
restart.
::
`;

// Parse at SSR time. parseMarkdown runs Shiki on every fenced code
// block, so the highlighted HTML is in the initial document — same
// no-flash benefit as TuxCodeBlock, applied to markdown content.
const { data: parsed } = await useAsyncData(
  "markdown-demo-sample",
  () => parseMarkdown(sample),
);
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="composition" title="Markdown (MDC)">
      Author content in markdown with Tux* components inline. Powered
      by <code>@nuxtjs/mdc</code>; Tux components are auto-imported so
      no per-component configuration is needed. Use this for
      tti-docs, blog posts, ADRs, and any marcom content where the
      author shouldn't have to write Vue.
    </TuxPageHeader>

    <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div class="space-y-3">
        <p class="eyebrow">source</p>
        <h2 class="heading--bold text-xl font-bold">Markdown input</h2>
        <p class="text-sm text-text-secondary">
          Frontmatter for metadata, GFM for prose, the
          <code>:::name{`{prop=value}`}</code> block syntax for invoking
          Tux components, and fenced code blocks with language ids for
          syntax highlighting.
        </p>
        <TuxCodeBlock lang="md" :code="sample" filename="how-watcher-works.md" />
      </div>

      <div class="space-y-3">
        <p class="eyebrow">rendered</p>
        <h2 class="heading--bold text-xl font-bold">MDC output</h2>
        <p class="text-sm text-text-secondary">
          The same source rendered live. Notice the
          <code>tux-alert</code> and <code>tux-callout</code> blocks
          render as the actual Vue components — same TTI rhythm as
          everything else in the style guide.
        </p>
        <article class="prose-tux border border-surface-border rounded-md bg-surface-raised p-5">
          <MDCRenderer
            v-if="parsed"
            :body="parsed.body"
            :data="parsed.data"
          />
        </article>
      </div>
    </section>

    <section class="space-y-3">
      <p class="eyebrow">syntax</p>
      <h2 class="heading--bold text-xl font-bold">Block syntax for Tux components</h2>
      <p class="text-sm text-text-secondary max-w-3xl leading-relaxed">
        MDC's block syntax invokes Vue components via
        <code>:::name{`{prop=value}`}</code>, with content between the
        opening fence and the matching close. Props are stringly-typed
        — wrap with <code>:</code> prefix for booleans and numbers
        (<code>:dismissible="true"</code>). Slots use
        <code>#slot</code>:
      </p>
      <TuxCodeBlock
        lang="md"
        filename="syntax-crib-sheet.md"
        :code="`# Inline component (default slot)

::tux-alert{variant=\&quot;warning\&quot; title=\&quot;Be careful\&quot;}
Body content goes here.
::

# With a named slot

::tux-cta{tone=\&quot;maroon\&quot; title=\&quot;Ship it\&quot; dek=\&quot;Two clicks.\&quot;}
  ::tux-button{intent=\&quot;primary\&quot;}
  Start scan
  ::
::

# Self-closing (no body)

::tux-section-header
Storage overview
::

# Inline span (one-line components)

A :badge[ITAR]{kind=\&quot;tag\&quot;} flag here.

# Booleans + numbers — note the colon prefix

::tux-pagination{:total=\&quot;412\&quot; :page-size=\&quot;20\&quot; :show-status=\&quot;true\&quot;}
::`"
      />
    </section>

    <section class="space-y-3">
      <p class="eyebrow">where to use</p>
      <h2 class="heading--bold text-xl font-bold">Markdown vs Vue authoring</h2>
      <ul class="text-sm space-y-2 max-w-3xl">
        <li>
          <strong>Use markdown (this)</strong> when content authors
          aren't writing Vue — tti-docs articles, blog posts, ADRs,
          changelog entries, marcom landing copy.
        </li>
        <li>
          <strong>Use Vue templates</strong> when the surface needs
          interactivity beyond what MDC components expose, or when the
          page is structurally a layout (a dashboard, a session view,
          a directory) rather than long-form prose.
        </li>
        <li>
          <strong>Mix freely</strong> — a Vue page can render an
          <code>&lt;MDC :value="..." /&gt;</code> block for the prose
          section and Vue components for the chrome. The PECAN docs
          site does this for product overviews.
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
/* Editorial prose styling for MDC output. Keeps the tux rhythm but
   doesn't turn into the heavy heading--bold / heading--display
   utilities — those are for chrome, not body prose. */
.prose-tux :deep(h1) {
  font-family: var(--font-display);
  font-size: 1.875rem;
  line-height: 1.15;
  margin: 0 0 1.25rem;
  color: var(--text-primary);
}

.prose-tux :deep(h2) {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1.375rem;
  line-height: 1.25;
  margin: 2rem 0 0.75rem;
  color: var(--text-primary);
  padding-bottom: 0.375rem;
  border-bottom: 1px solid var(--surface-border);
}

.prose-tux :deep(h3) {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1.0625rem;
  margin: 1.5rem 0 0.5rem;
}

.prose-tux :deep(p) {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0 0 1rem;
}

.prose-tux :deep(ul),
.prose-tux :deep(ol) {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--text-secondary);
  padding-left: 1.5rem;
  margin: 0 0 1rem;
}

.prose-tux :deep(li) {
  margin: 0.25rem 0;
}

.prose-tux :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  background: var(--surface-sunken);
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-sm);
  color: var(--brand-primary);
}

.prose-tux :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.875rem;
}

.prose-tux :deep(th) {
  text-align: left;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  padding: 0.5rem 0.75rem;
  border-bottom: 2px solid var(--brand-primary);
}

.prose-tux :deep(td) {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--surface-border);
  vertical-align: top;
}

.prose-tux :deep(pre) {
  margin: 1rem 0;
  padding: 1rem 1.125rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.6;
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow-x: auto;
}

.prose-tux :deep(pre code) {
  background: transparent;
  padding: 0;
  color: var(--text-primary);
}

.prose-tux :deep(a) {
  color: var(--brand-secondary);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: color-mix(in srgb, var(--brand-secondary) 40%, transparent);
}
</style>
