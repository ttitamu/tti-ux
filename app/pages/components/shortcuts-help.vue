<script setup lang="ts">
useHead({ title: "TuxShortcutsHelp · TUX" });

const helpRef = ref<{ open: () => void } | null>(null);

const groups = [
  {
    heading: "Navigation",
    items: [
      { keys: ["g", "t"], label: "Go to tokens",      description: "Jump to /tokens" },
      { keys: ["g", "y"], label: "Go to typography", description: "Jump to /typography" },
      { keys: ["g", "c"], label: "Go to components", description: "Jump to /components" },
    ],
  },
  {
    heading: "Search",
    items: [
      { keys: ["meta", "k"], label: "Open command palette",   description: "Search routes + run actions" },
      { keys: ["/"],          label: "Focus the search input", description: "When a search field is on the page" },
    ],
  },
  {
    heading: "Help",
    items: [
      { keys: ["?"],   label: "Open this shortcuts overlay" },
      { keys: ["esc"], label: "Close any overlay" },
    ],
  },
];
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxShortcutsHelp">
      Modal overlay listing every wired keyboard shortcut. Built on the native
      <code>&lt;dialog&gt;</code> element so focus trap, scrim, and ESC-to-close
      come free — same anatomy as <code>TuxCommandPalette</code> so the two
      read as siblings. Mount once at app root and open on
      <TuxKbd value="?" /> via <code>defineShortcuts</code>.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">try it</p>
      <h2 class="heading--bold text-xl font-bold">Press <TuxKbd value="?" size="lg" /> from anywhere</h2>
      <p class="text-sm text-text-secondary mb-3">
        The style-guide shell mounts a real shortcuts overlay globally — so
        the hotkey already works on this page. The button below opens this
        page's <em>local</em> instance for visual reference.
      </p>
      <TuxExample>
        <div class="flex gap-3">
          <TuxButton intent="primary" icon="lucide:keyboard" @click="helpRef?.open()">
            Open shortcuts help
          </TuxButton>
          <span class="text-sm text-text-muted self-center inline-flex items-center gap-1">
            …or press <TuxKbd value="?" /> for the global one
          </span>
        </div>
        <TuxShortcutsHelp ref="helpRef" :groups="groups" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">design</p>
      <h2 class="heading--bold text-xl font-bold">Combos vs sequences</h2>
      <p class="max-w-3xl text-sm text-text-secondary leading-relaxed">
        The component classifies each shortcut by inspecting its
        <code>keys</code> array. If any key is a modifier
        (<code>meta</code> / <code>ctrl</code> / <code>shift</code> /
        <code>alt</code>), the row renders a single <code>TuxKbd</code> with
        <code>+</code> joiners — a <em>combo</em>. Otherwise each key becomes
        its own <code>TuxKbd</code> separated by an italicized "then" — a
        <em>sequence</em> (Vim-style <code>g t</code>). Single-key shortcuts
        render as one <code>TuxKbd</code>.
      </p>
    </section>

    <section>
      <p class="eyebrow">setup</p>
      <h2 class="heading--bold text-xl font-bold">Install at app root</h2>
      <p class="text-sm text-text-secondary mb-3">
        Place a single <code>&lt;TuxShortcutsHelp&gt;</code> in
        <code>app.vue</code> alongside <code>TuxCommandPalette</code>, then
        wire <TuxKbd value="?" /> via Nuxt UI's <code>defineShortcuts</code>:
      </p>
      <pre class="text-xs bg-surface-sunken border border-surface-border rounded p-4 overflow-x-auto"><code>&lt;script setup&gt;
const helpRef = ref(null);
const groups = [/* ... */];

defineShortcuts({
  "?": { handler: () =&gt; helpRef.value?.toggle() },
});
&lt;/script&gt;

&lt;template&gt;
  &lt;TuxShortcutsHelp ref="helpRef" :groups="groups" /&gt;
&lt;/template&gt;</code></pre>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + shortcut shape</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>groups</code> — array of <code>{ heading, items }</code>. Required.</li>
        <li>Each item — <code>{ keys: string[], label: string, description?: string }</code>.</li>
        <li><code>sequenceSeparator</code> — text between sequence keys (defaults to <code>"then"</code>).</li>
        <li>Exposes <code>.open()</code>, <code>.close()</code>, <code>.toggle()</code> via template ref.</li>
      </ul>
    </section>
  </div>
</template>
