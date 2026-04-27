<script setup lang="ts">
useHead({ title: "TuxTOC · tti-ux" });

const exampleVue = `<TuxTOC
  target="#article"
  :levels="[2, 3]"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxTOC">
      Article table-of-contents. Right-rail sticky list of headings,
      auto-detected from a target element. Active state tracked via
      <code>IntersectionObserver</code> — the heading currently in
      the upper-middle band of the viewport gets the maroon left-bar
      and bold treatment. Clicking an entry smooth-scrolls to the
      anchor.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical · auto-detect</p>
      <h2 class="heading--bold text-xl font-bold">Article + TOC three-column layout</h2>
      <p class="text-sm text-text-secondary mb-3">
        Scroll the article column on the left to see the TOC active
        state on the right update as headings cross into the
        upper-middle viewport band.
      </p>
      <TuxExample class="mt-4" :vue="exampleVue">
        <div class="grid grid-cols-1 md:grid-cols-[1fr_14rem] gap-8 items-start">
          <article id="article" class="prose-toc-demo space-y-4 max-h-[28rem] overflow-y-auto pr-4 border-r border-surface-border">
            <h2 id="introduction">Introduction</h2>
            <p>The PECAN agent watcher is a long-running process on each agent host that detects file events and ships them to the central index. This is an intro paragraph long enough to push the next heading down the page so the TOC has something to track.</p>
            <p>The watcher coalesces events over a 250ms window to avoid shipping every keystroke during text-editor saves. Output is batched and pushed via the central transport channel.</p>

            <h2 id="event-types">Event types</h2>
            <p>Four event types flow upstream — create, modify, delete, and move. Each carries the absolute path, inode (POSIX) or stable hash (Windows), size, mtime, and owner.</p>

            <h3 id="create">Create</h3>
            <p>Triggered when a new inode appears in a watched root. The watcher correlates with the parent directory's last-snapshot to skip events from initial-bootstrap scans.</p>

            <h3 id="modify">Modify</h3>
            <p>Existing inode's content or mtime changes. The watcher debounces to avoid amplifying every save during streaming writes.</p>

            <h3 id="delete">Delete</h3>
            <p>Soft-delete with 30-day retention before purge. The drift reconciler closes any local→central mismatches every hour.</p>

            <h3 id="move">Move</h3>
            <p>Inode path changes. POSIX uses inode tracking for atomic correlation; Windows uses SHA-256 hashing of the file content. Either way a single move event is emitted, never delete + create.</p>

            <h2 id="heartbeats">Heartbeats</h2>
            <p>Default cadence is every 60 seconds. Override with <code>--heartbeat=30s</code> for tighter monitoring during a deploy or rolling restart.</p>

            <h3 id="staleness">Staleness</h3>
            <p>An agent is considered stale after six minutes of no heartbeat. The dashboard surfaces a "needs investigation" chip on stale agents.</p>

            <h2 id="reconciliation">Drift reconciliation</h2>
            <p>The drift reconciler runs hourly. It compares the agent's local index against the central record and closes entries that disagree.</p>
          </article>

          <aside class="sticky top-4">
            <TuxTOC target="#article" />
          </aside>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">explicit items</p>
      <h2 class="heading--bold text-xl font-bold">Pre-built items list</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>:items</code> when you have a parsed AST or a
        hand-curated list (e.g. from <code>parseMarkdown</code>'s
        TOC output). Skips the auto-detect pass entirely.
      </p>
      <TuxExample class="mt-4">
        <div class="border border-surface-border rounded-md bg-surface-raised p-4 max-w-xs">
          <TuxTOC :items="[
            { id: 'sec-1', label: 'Get started',          depth: 2 },
            { id: 'sec-2', label: 'Install',              depth: 3 },
            { id: 'sec-3', label: 'First scan',           depth: 3 },
            { id: 'sec-4', label: 'Configuration',         depth: 2 },
            { id: 'sec-5', label: 'Environment vars',     depth: 3 },
            { id: 'sec-6', label: 'Tokens',               depth: 3 },
            { id: 'sec-7', label: 'Operations',           depth: 2 },
          ]" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props reference</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>items</code> — pre-built TOC list. Each <code>{ id, label, depth }</code>. Skips auto-detect.</li>
        <li><code>target</code> — CSS selector for the article body. Defaults to <code>"article"</code>.</li>
        <li><code>levels</code> — heading levels to include. Defaults to <code>[2, 3]</code>.</li>
        <li><code>title</code> — heading above the list. Defaults to <code>"On this page"</code>.</li>
        <li><code>noTitle</code> — hide the title (e.g. when wrapping in a custom header).</li>
        <li>Auto-generates <code>id</code> on headings that don't have one (slugified text content).</li>
        <li>Active state via IntersectionObserver. Smooth-scroll on click; updates URL hash without page navigation.</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.prose-toc-demo :deep(h2) {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1.25rem;
  margin: 1.5rem 0 0.5rem;
  color: var(--text-primary);
  scroll-margin-top: 1rem;
}

.prose-toc-demo :deep(h2:first-child) { margin-top: 0; }

.prose-toc-demo :deep(h3) {
  font-family: var(--font-bold);
  font-weight: 600;
  font-size: 1rem;
  margin: 1rem 0 0.375rem;
  color: var(--text-primary);
  scroll-margin-top: 1rem;
}

.prose-toc-demo :deep(p) {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0 0 0.5rem;
}
</style>
