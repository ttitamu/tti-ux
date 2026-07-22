<script setup lang="ts">
useHead({ title: "TuxCommandPalette · TUX" });

const paletteRef = ref<{ open: () => void } | null>(null);

const groups = [
  {
    heading: "Navigation",
    items: [
      { id: "nav-tokens",    label: "Tokens",        description: "Brand colors, surfaces, text roles", icon: "lucide:palette",       to: "/tokens",        shortcut: "g t" },
      { id: "nav-typography", label: "Typography",   description: "Type families, scale, utilities",     icon: "lucide:type",          to: "/typography",    shortcut: "g y" },
      { id: "nav-styles",    label: "Style variants", description: "Default / bold / elegant",            icon: "lucide:layout-template", to: "/style-variants" },
      { id: "nav-icons",     label: "Icons",         description: "1,755 Lucide glyphs",                  icon: "lucide:sparkles",      to: "/icons" },
    ],
  },
  {
    heading: "Components",
    items: [
      { id: "cmp-button",    label: "TuxButton",       icon: "lucide:rectangle-horizontal", to: "/components/button" },
      { id: "cmp-card",      label: "TuxCard",         icon: "lucide:square-stack",         to: "/components/card" },
      { id: "cmp-factoid",   label: "TuxFactoid",      icon: "lucide:hash",                 to: "/components/factoid" },
      { id: "cmp-search",    label: "TuxSearch",       icon: "lucide:search",               to: "/components/search" },
      { id: "cmp-table",     label: "TuxTable",        icon: "lucide:table",                to: "/components/table" },
    ],
  },
  {
    heading: "Actions",
    items: [
      {
        id: "act-toggle-theme",
        label: "Toggle dark mode",
        description: "Flip between light + dark palettes",
        icon: "lucide:moon",
        shortcut: "⌘ ⇧ D",
        action: () => {
          if (typeof document === "undefined") return;
          const root = document.documentElement;
          const next = root.dataset.theme === "tti-dark" ? "tti" : "tti-dark";
          root.dataset.theme = next;
        },
      },
      {
        id: "act-copy-url",
        label: "Copy current URL",
        description: "Useful for sharing a deep link",
        icon: "lucide:link",
        action: async () => {
          if (typeof navigator !== "undefined" && navigator.clipboard) {
            await navigator.clipboard.writeText(window.location.href);
          }
        },
      },
    ],
  },
];
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxCommandPalette">
      Global ⌘K jump bar. Search input + grouped command list, live
      substring filter, keyboard navigation. Built on the native
      <code>&lt;dialog&gt;</code> element so focus trap and scrim come
      free. Each command can navigate (<code>to</code> / <code>href</code>)
      or run an action (<code>action: () =&gt; void</code>). Use a single
      instance at app root.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">try it</p>
      <h2 class="heading--bold text-xl font-bold">Press <TuxKbd :keys="['meta', 'k']" size="lg" /> from anywhere</h2>
      <p class="text-sm text-text-secondary mb-3">
        The style-guide shell mounts a real palette globally — so the
        hotkey already works on this page, jumping to the same routes as
        the sidebar. The button below opens this page's <em>local</em>
        instance for visual reference; its hotkey is disabled to avoid
        racing with the global one.
      </p>
      <TuxExample>
        <div class="flex gap-3">
          <TuxButton intent="primary" icon="lucide:command" @click="paletteRef?.open()">
            Open local palette
          </TuxButton>
          <span class="text-sm text-text-muted self-center inline-flex items-center gap-1">
            …or press <TuxKbd :keys="['meta', 'k']" /> for the global one
          </span>
        </div>
        <TuxCommandPalette ref="paletteRef" :groups="groups" :disable-hotkey="true" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">design</p>
      <h2 class="heading--bold text-xl font-bold">Why native <code>&lt;dialog&gt;</code></h2>
      <p class="max-w-3xl text-sm text-text-secondary leading-relaxed">
        The browser handles focus trap, ESC-to-close, scrim rendering, and
        ARIA semantics out of the box when you use
        <code>showModal()</code>. Wrapping a custom modal would replicate
        all of that imperatively. The only thing we add: a global keydown
        listener for <code>⌘K</code> / <code>Ctrl+K</code> to toggle the
        dialog.
      </p>
    </section>

    <section>
      <p class="eyebrow">setup</p>
      <h2 class="heading--bold text-xl font-bold">Install at app root</h2>
      <p class="text-sm text-text-secondary mb-3">
        Place a single <code>&lt;TuxCommandPalette&gt;</code> in
        <code>app.vue</code>. It self-registers the ⌘K hotkey for the
        whole app. To open it from a button, hold a ref and call
        <code>.open()</code>:
      </p>
      <pre class="text-xs bg-surface-sunken border border-surface-border rounded p-4 overflow-x-auto"><code>&lt;script setup&gt;
const paletteRef = ref(null);
const groups = [/* ... */];
&lt;/script&gt;

&lt;template&gt;
  &lt;TuxCommandPalette ref="paletteRef" :groups="groups" /&gt;
  &lt;TuxButton @click="paletteRef.open()"&gt;Search&lt;/TuxButton&gt;
&lt;/template&gt;</code></pre>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + commands</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>groups</code> — array of <code>{ heading, items }</code>. Required.</li>
        <li>Each item — <code>{ id, label, description?, icon?, shortcut?, to?, href?, action? }</code>.</li>
        <li><code>placeholder</code> — input placeholder. Defaults to <code>"Type a command or search…"</code>.</li>
        <li><code>disableHotkey</code> — turn off the global ⌘K listener (rare).</li>
        <li><code>hotkey</code> — override the trigger key. Defaults to <code>"k"</code>.</li>
        <li>Exposes <code>.open()</code> + <code>.close()</code> via template ref.</li>
      </ul>
    </section>
  </div>
</template>
