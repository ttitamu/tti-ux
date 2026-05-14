<script setup lang="ts">
useHead({ title: "TuxProse · TUX" });

const basicVue = `<TuxProse>
  <MDCRenderer :body="parsed.body" :data="parsed.data" />
</TuxProse>`;

const handMarkupVue = `<TuxProse>
  <h1>Document title</h1>
  <p>Body paragraph…</p>
  <h2>Section heading</h2>
  <p>More body…</p>
</TuxProse>`;

const wrapperVue = `<!-- Inside a card, use a non-landmark wrapper -->
<TuxProse as="div" class="border rounded-md p-5">
  …
</TuxProse>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxProse">
      Typographic shell for long-form markdown content. Wraps
      <code>&lt;MDCRenderer&gt;</code> output, hand-authored HTML, or
      any slot that mixes headings, paragraphs, lists, tables, code,
      and blockquotes. Applies the four-family rule + the
      maroon-underlined H2 rhythm — same shape as
      <code>.heading--bold</code> but through the prose layer, so
      authors don't need to add utility classes inside markdown.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">why</p>
      <h2 class="heading--bold text-xl font-bold">One source of truth</h2>
      <p class="text-sm text-text-secondary max-w-3xl leading-relaxed">
        Before <code>TuxProse</code>,
        <NuxtLink to="/design/tux" class="link-tti">/design/[doc]</NuxtLink>,
        <NuxtLink to="/changelog" class="link-tti">/changelog</NuxtLink>,
        and <NuxtLink to="/markdown" class="link-tti">/markdown</NuxtLink>
        each shipped a ~130-line scoped <code>:deep()</code> block to
        style their renderer output, with a "keep these in sync"
        comment that nobody loves. <code>TuxProse</code> consolidates
        those into one component. Pull a new long-form surface into
        existence (an ADR page, a docs route) and wrap the renderer in
        <code>&lt;TuxProse&gt;</code> — done.
      </p>
    </section>

    <section>
      <p class="eyebrow">markdown renderer</p>
      <h2 class="heading--bold text-xl font-bold">With MDCRenderer</h2>
      <p class="text-sm text-text-secondary mb-3 max-w-3xl">
        The canonical use. Wrap the renderer in
        <code>&lt;TuxProse&gt;</code>; everything below picks up the
        rhythm automatically.
      </p>
      <TuxExample :vue="basicVue">
        <TuxProse as="div">
          <h1>How the agent watcher works</h1>
          <p>
            PECAN's file watcher is the long-running process on each
            agent host that detects file events
            (<code>create</code> / <code>modify</code> / <code>delete</code> / <code>move</code>)
            and ships them to the central index.
          </p>
          <h2>Event types</h2>
          <p>The watcher emits four event types upstream:</p>
          <table>
            <thead>
              <tr><th>Type</th><th>Triggers when…</th></tr>
            </thead>
            <tbody>
              <tr><td><code>create</code></td><td>A new inode appears in a watched root</td></tr>
              <tr><td><code>modify</code></td><td>An existing inode's content or mtime changes</td></tr>
              <tr><td><code>delete</code></td><td>An inode disappears (soft-delete with 30d retention)</td></tr>
              <tr><td><code>move</code></td><td>An inode's path changes — single event, never delete+create</td></tr>
            </tbody>
          </table>
          <blockquote>
            Move detection uses inode tracking on POSIX and SHA-256
            correlation on Windows. Either way, a single
            <code>move</code> event is emitted upstream rather than a
            <code>delete</code>+<code>create</code> pair.
          </blockquote>
        </TuxProse>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">hand-authored</p>
      <h2 class="heading--bold text-xl font-bold">Plain HTML slot</h2>
      <p class="text-sm text-text-secondary mb-3 max-w-3xl">
        Works the same for any HTML — useful when you want the prose
        rhythm in a hand-rolled section without going through MDC.
      </p>
      <TuxExample :vue="handMarkupVue">
        <TuxProse as="div">
          <h1>Document title</h1>
          <p>
            Body paragraph in <strong>Open Sans</strong>, 0.9375rem,
            1.75 leading. <em>Italic emphasis</em> reads as it should,
            and <code>inline code</code> picks up the maroon tint
            against the sunken surface.
          </p>
          <h2>Section heading</h2>
          <ul>
            <li>List items use the body face</li>
            <li>With comfortable 1.75 leading</li>
            <li>And generous nesting room</li>
          </ul>
        </TuxProse>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">wrapper tag</p>
      <h2 class="heading--bold text-xl font-bold">Non-landmark wrapper</h2>
      <p class="text-sm text-text-secondary mb-3 max-w-3xl">
        The wrapper defaults to <code>&lt;article&gt;</code> (the
        correct landmark for a long-form region). Pass
        <code>as="div"</code> when the parent already provides the
        landmark — e.g. inside a card preview.
      </p>
      <TuxExample :vue="wrapperVue">
        <TuxProse
          as="div"
          class="border border-surface-border rounded-md bg-surface-raised p-5"
        >
          <h2>Inside a card</h2>
          <p>
            Same prose rhythm, no duplicate landmark. The classes pass
            through to the wrapper — combine with
            <code>data-tux-elevation="rest"</code> for the Batch J
            shadow tier.
          </p>
        </TuxProse>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>as</code> — wrapper tag. Defaults to <code>"article"</code>; pass <code>"div"</code> inside another landmark.</li>
        <li>Default slot — any markup. Styles apply via <code>:deep()</code> selectors so slot content gets the rhythm regardless of authoring surface.</li>
      </ul>
    </section>

    <section>
      <p class="eyebrow">scope boundary</p>
      <h2 class="heading--bold text-xl font-bold">Prose vs chrome</h2>
      <p class="text-sm text-text-secondary max-w-3xl leading-relaxed">
        <code>TuxProse</code> styles long-form <em>content</em> — the
        kind of thing an author writes in markdown. Page chrome
        (the header lockup, the sidebar nav, breadcrumbs, page titles)
        stays on the utility classes —
        <code>.heading--bold</code>, <code>.heading--display</code>,
        <code>.eyebrow</code>, <code>.subhead</code>,
        <code>.link-tti</code>. The split keeps a Vue page from
        accidentally pulling prose rhythm into UI scaffolding where
        the type sizes would feel off.
      </p>
    </section>
  </div>
</template>
