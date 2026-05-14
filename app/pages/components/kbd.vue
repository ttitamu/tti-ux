<script setup lang="ts">
useHead({ title: "TuxKbd · TUX" });

const singleVue = `<TuxKbd value="esc" />
<TuxKbd value="enter" />
<TuxKbd value="?" />
<TuxKbd value="/" />`;

const comboVue = `<TuxKbd :keys="['meta', 'k']" />
<TuxKbd :keys="['meta', 'shift', 'p']" />
<TuxKbd :keys="['ctrl', 'enter']" separator="+" />`;

const sequenceVue = `<TuxKbd value="g" /> then <TuxKbd value="t" />
<TuxKbd value="g" /> then <TuxKbd value="c" />`;

const sizeVue = `<TuxKbd value="esc" size="xs" />   <!-- 0.625rem, footer-row hints -->
<TuxKbd value="esc" size="sm" />   <!-- 0.6875rem, default in-list -->
<TuxKbd value="esc" size="lg" />   <!-- 0.8125rem, help overlays -->`;

const arrowsVue = `<TuxKbd value="arrowup" />
<TuxKbd value="arrowdown" />
<TuxKbd value="arrowleft" />
<TuxKbd value="arrowright" />`;

const slotVue = `<TuxKbd><span class="text-xs">F1</span></TuxKbd>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxKbd">
      Token-styled <code>&lt;kbd&gt;</code> for keyboard-shortcut hints.
      One canonical look for every key glyph that ships in the system —
      command-palette esc indicator, per-item shortcut hints, the
      <code>?</code> shortcuts-help overlay, inline doc hints. Mac
      modifiers render as <TuxKbd :keys="['meta']" />, PC modifiers as
      <TuxKbd :keys="['ctrl']" />, with the swap happening
      post-hydration so SSR stays consistent.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">single keys</p>
      <h2 class="heading--bold text-xl font-bold">One key</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass a single key as <code>value</code>. Known names —
        <code>escape</code>, <code>enter</code>, <code>arrowup</code>,
        <code>tab</code>, <code>space</code>, etc. — render their canonical
        glyph; everything else passes through verbatim (single letters
        get upper-cased).
      </p>
      <TuxExample :vue="singleVue">
        <div class="flex flex-wrap items-center gap-3">
          <TuxKbd value="esc" />
          <TuxKbd value="enter" />
          <TuxKbd value="?" />
          <TuxKbd value="/" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">combos</p>
      <h2 class="heading--bold text-xl font-bold">Multi-key combos</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>keys</code> as an array. Each renders as a separate
        <code>&lt;kbd&gt;</code>; a <code>separator</code> prop sets the
        glue between them ( <code>""</code> for tight, <code>"+"</code> for
        explicit ). Modifier names use the defineShortcuts grammar
        (<code>meta</code>, <code>ctrl</code>, <code>shift</code>,
        <code>alt</code>) so a binding declaration and its rendered hint
        share a vocabulary.
      </p>
      <TuxExample :vue="comboVue">
        <div class="flex flex-wrap items-center gap-3">
          <TuxKbd :keys="['meta', 'k']" />
          <TuxKbd :keys="['meta', 'shift', 'p']" />
          <TuxKbd :keys="['ctrl', 'enter']" separator="+" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">sequences</p>
      <h2 class="heading--bold text-xl font-bold">Sequence shortcuts</h2>
      <p class="text-sm text-text-secondary mb-3">
        For GitHub-style two-key sequences (<code>g</code> then
        <code>c</code>), render each step as its own TuxKbd with a
        plaintext "then" between. The shortcuts-help overlay uses this
        idiom automatically — any keys array without a modifier is
        classified as a sequence.
      </p>
      <TuxExample :vue="sequenceVue">
        <div class="flex flex-wrap items-center gap-2 text-sm text-text-muted">
          <TuxKbd value="g" /> <span>then</span> <TuxKbd value="t" />
          <span class="px-3 text-text-muted">·</span>
          <TuxKbd value="g" /> <span>then</span> <TuxKbd value="c" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">arrows + glyphs</p>
      <h2 class="heading--bold text-xl font-bold">Built-in glyphs</h2>
      <p class="text-sm text-text-secondary mb-3">
        Recognised keys render the corresponding Unicode glyph instead
        of the raw name. Useful so a shortcut hint reads as the actual
        key on the keyboard rather than the JavaScript event name.
      </p>
      <TuxExample :vue="arrowsVue">
        <div class="flex flex-wrap items-center gap-3">
          <TuxKbd value="arrowup" />
          <TuxKbd value="arrowdown" />
          <TuxKbd value="arrowleft" />
          <TuxKbd value="arrowright" />
          <TuxKbd value="tab" />
          <TuxKbd value="space" />
          <TuxKbd value="backspace" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">size</p>
      <h2 class="heading--bold text-xl font-bold">Three sizes</h2>
      <p class="text-sm text-text-secondary mb-3">
        <code>xs</code> for compact footer-row hints (smallest chrome,
        fits multiple pairs on one line), <code>sm</code> for in-list
        affordances (the default), <code>lg</code> for the shortcuts-help
        overlay and standalone documentation.
      </p>
      <TuxExample :vue="sizeVue">
        <div class="flex items-end gap-4">
          <div class="flex flex-col items-center gap-1">
            <TuxKbd value="esc" size="xs" />
            <span class="text-xs text-text-muted">xs</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <TuxKbd value="esc" size="sm" />
            <span class="text-xs text-text-muted">sm (default)</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <TuxKbd value="esc" size="lg" />
            <span class="text-xs text-text-muted">lg</span>
          </div>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">slot</p>
      <h2 class="heading--bold text-xl font-bold">Custom content</h2>
      <p class="text-sm text-text-secondary mb-3">
        For anything that doesn't fit a single key string — function
        keys, multi-character glyphs, icons — pass content via the
        default slot.
      </p>
      <TuxExample :vue="slotVue">
        <div class="flex flex-wrap items-center gap-3">
          <TuxKbd><span class="text-xs">F1</span></TuxKbd>
          <TuxKbd><span class="text-xs">Page Up</span></TuxKbd>
          <TuxKbd><Icon name="lucide:command" class="w-3 h-3" /></TuxKbd>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>value</code> — single key name. Mutually exclusive with <code>keys</code>.</li>
        <li><code>keys</code> — array of key names for a combo.</li>
        <li><code>size</code> — <code>"xs" | "sm" | "lg"</code>. Defaults to <code>"sm"</code>.</li>
        <li><code>separator</code> — string rendered between keys in a combo. Empty by default (kbds sit flush).</li>
        <li>Default slot — used when neither <code>value</code> nor <code>keys</code> is set.</li>
      </ul>
    </section>
  </div>
</template>
