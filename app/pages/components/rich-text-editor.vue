<script setup>
useHead({ title: "TuxRichTextEditor · TUX" });

const html = ref(`<h2>Field notes — corridor compliance pass</h2>
<p>Visited <strong>three sites</strong> in the Bryan district. Two showed the expected post-treatment behavior; one (<em>FM-60 / Wellborn</em>) regressed toward baseline. <u>Possible causes</u>:</p>
<ul>
  <li>Construction-phase signage degraded sight lines</li>
  <li>Beacon battery on the eastern approach drained — needs replacement</li>
  <li>Driver-population shift after the spring semester start</li>
</ul>
<blockquote>The compliance figure dropped from 51% (Q3 2025) to 38% (Q1 2026) at this site only. Treatment-effect persistence cannot be claimed without explaining the regression.</blockquote>
<h3>Action items</h3>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="true"><div>Open a maintenance ticket for the eastern beacon</div></li>
  <li data-type="taskItem" data-checked="false"><div>Re-instrument for one quarter</div></li>
  <li data-type="taskItem" data-checked="false"><div>Compare against the I-35 corridor regression model</div></li>
</ul>
<h3>Sample analysis</h3>
<table>
  <thead>
    <tr><th>Quarter</th><th>Treated %</th><th>Control %</th><th>Δ</th></tr>
  </thead>
  <tbody>
    <tr><td>Q3 2025</td><td>51</td><td>78</td><td>-27</td></tr>
    <tr><td>Q4 2025</td><td>45</td><td>77</td><td>-32</td></tr>
    <tr><td>Q1 2026</td><td>38</td><td>78</td><td>-40</td></tr>
  </tbody>
</table>
<p>Quick code reference:</p>
<pre><code class="language-python">def compliance_delta(treated, control):
    """Return treated minus control as a percent point."""
    return round(treated - control, 1)
</code></pre>
<p>Try → <code>"smart quotes"</code> and an em dash --- and a horizontal rule below.</p>
<hr>
<p>End of field-note draft.</p>`);

const compactHtml = ref("<p>What changed in the latest revision?</p>");
const minimalHtml = ref("<p>Add a note…</p>");
const saveCount = ref(0);
const lastMode = ref("wysiwyg");
const lastFullscreen = ref(false);

const basicVue = `<tux-rich-text-editor
  v-model="html"
  placeholder="Start writing…"
  @update="onUpdate"
  @save="onSave"
  @mode-change="onModeChange"
  @fullscreen-change="onFullscreenChange"
/>`;

const compactVue = `<tux-rich-text-editor
  v-model="html"
  :toolbar="['format', 'lists', 'media']"
  :heading-levels="[]"
  min-height="6rem"
  max-height="14rem"
  :show-count="false"
  :fullscreenable="false"
  placeholder="What changed?"
/>`;

const minimalVue = `<tux-rich-text-editor
  v-model="html"
  :toolbar="['format', 'mode']"
  :heading-levels="[]"
  min-height="5rem"
  placeholder="Add a note…"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · authoring" title="TuxRichTextEditor">
      Tiptap-based WYSIWYG editor — canonical TUX rich-text surface.
      Sister to <code>TuxMarkdownEditor</code> for the rendered-only
      case. Feature set mirrors the
      <a href="#" class="underline">docs.it.tamu.edu</a> admin-center
      editor so consumers across the TTI stack (Landscape,
      tti-ai-studio, internal CMS surfaces) can adopt one shared
      editor with one shared chrome.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · full feature set</p>
      <h2 class="heading--bold text-xl font-bold">Seven toolbar groups + source mode + full-screen</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Format · Headings (H1–H4) · Lists (bullet · numbered · task) ·
        Block (quote · code · rule) · Media (link · image) · Table
        (insert + manipulate when in-table) · Mode (WYSIWYG ↔ raw
        HTML source). Plus undo / redo, full-screen, and word
        count.
      </p>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        <strong>Try:</strong> Click <em>Source</em> to view the raw
        HTML, edit it, click <em>WYSIWYG</em> to see your changes
        rendered. The pre-seeded content already exercises a task
        list, table, and Python code block (with syntax highlighting
        via lowlight). Press <kbd class="px-1 rounded border border-surface-border text-[0.7rem] font-mono">⌘S</kbd>
        to emit the <code>save</code> event.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <TuxRichTextEditor
          v-model="html"
          @save="saveCount++"
          @mode-change="(m) => lastMode = m"
          @fullscreen-change="(v) => lastFullscreen = v"
        />
      </TuxExample>
      <p class="mt-3 text-xs text-text-muted font-mono">
        events: save count = <strong>{{ saveCount }}</strong> ·
        mode = <strong>{{ lastMode }}</strong> ·
        fullscreen = <strong>{{ lastFullscreen }}</strong>
      </p>
    </section>

    <section>
      <p class="eyebrow">density · trimmed</p>
      <h2 class="heading--bold text-xl font-bold">Inline comment field</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass a subset of toolbar groups via <code>:toolbar</code>,
        zero out <code>:heading-levels</code>, hide the word count
        and full-screen for tight contexts.
      </p>
      <TuxExample class="mt-4" :vue="compactVue">
        <TuxRichTextEditor
          v-model="compactHtml"
          :toolbar="['format', 'lists', 'media']"
          :heading-levels="[]"
          min-height="6rem"
          max-height="14rem"
          :show-count="false"
          :fullscreenable="false"
          placeholder="What changed?"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">minimal</p>
      <h2 class="heading--bold text-xl font-bold">Source-mode only chrome</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Three buttons (bold · italic · underline + the mode toggle)
        for surfaces where the user mostly wants a textarea with the
        occasional formatting tag.
      </p>
      <TuxExample class="mt-4" :vue="minimalVue">
        <TuxRichTextEditor
          v-model="minimalHtml"
          :toolbar="['format', 'mode']"
          :heading-levels="[]"
          min-height="5rem"
          placeholder="Add a note…"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">feature inventory</p>
      <h2 class="heading--bold text-xl font-bold">What ships</h2>
      <ul class="mt-3 text-sm text-text-secondary leading-relaxed list-disc pl-5 space-y-1 max-w-2xl">
        <li><strong>Inline marks:</strong> bold, italic, underline, strikethrough, inline code</li>
        <li><strong>Headings:</strong> H1 · H2 · H3 · H4 (configurable per consumer)</li>
        <li><strong>Lists:</strong> bullet, numbered, task (checkable, nestable)</li>
        <li><strong>Blocks:</strong> blockquote, code block (with <code>lowlight</code> syntax highlighting), horizontal rule</li>
        <li><strong>Media:</strong> link (⌘K prompt, brand-color rendering), image (URL + alt prompt, base64 allowed)</li>
        <li><strong>Tables:</strong> insert 3×3 with header row; add / remove columns and rows; resizable column widths; delete table</li>
        <li><strong>Mode toggle:</strong> WYSIWYG ↔ raw HTML source textarea — edits in either view round-trip cleanly</li>
        <li><strong>Full-screen:</strong> overlay mode (Esc exits); useful for long-form drafting</li>
        <li><strong>Word / character count:</strong> live footer; pure DOM-text count, ignores tags</li>
        <li><strong>Save event:</strong> ⌘S / Ctrl+S emits <code>save</code> — host wires to persist</li>
        <li><strong>Typography substitutions:</strong> smart quotes, em dashes, ellipses (Tiptap Typography extension)</li>
        <li><strong>Undo / redo:</strong> with disabled-state derived from <code>editor.can()</code></li>
      </ul>
    </section>

    <section>
      <p class="eyebrow">why this is the canonical surface</p>
      <h2 class="heading--bold text-xl font-bold">One editor across the stack</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        The feature set mirrors the <code>TipTapEditor</code>
        component in
        <code>docs-tti-tamu-edu/nuxt-site/app/components/</code> so
        the same chrome can land in Landscape's draft surfaces,
        tti-ai-studio's chat composition, and the docs platform's
        admin center — without each consumer maintaining its own
        Tiptap wrapper. Things the docs editor does that this one
        defers to a follow-on:
      </p>
      <ul class="mt-2 text-sm text-text-secondary leading-relaxed list-disc pl-5 space-y-1 max-w-2xl">
        <li>
          <strong>Markdown ↔ HTML round-trip</strong> — needs
          <code>turndown</code> + a markdown parser; defer until a
          consumer surface stores markdown rather than HTML. The
          <code>:sourceFormat</code> prop is the planned extension
          point.
        </li>
        <li>
          <strong>YAML frontmatter preservation</strong> — coupled
          to the markdown round-trip above.
        </li>
        <li>
          <strong>Slash-command palette</strong> — Tiptap supports
          via <code>extension-mention</code>; defer to a follow-on
          if AI-studio chat composition adopts it.
        </li>
      </ul>
    </section>
  </div>
</template>
