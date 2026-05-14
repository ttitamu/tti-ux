<script setup lang="ts">
useHead({ title: "Typography · TUX" });

// Four-family roster — what's loaded, what each is for, what token
// surfaces it. The roles match design/tux.md and tokens.css.
const families = [
  {
    token: "--font-body",
    name: "Open Sans",
    role: "Body, eyebrows, H4+, lists, captions, every form input label.",
    sample: "The quick brown fox jumps over the lazy dog. 0123456789",
    fontFamily: "var(--font-body)",
    fontWeight: 400,
  },
  {
    token: "--font-display",
    name: "Oswald",
    role: "Default-style H1–H3. Condensed, editorial, restrained.",
    sample: "Texas A&M Transportation Institute · 2026",
    fontFamily: "var(--font-display)",
    fontWeight: 500,
  },
  {
    token: "--font-bold",
    name: "Work Sans",
    role: "Bold-style H1–H3, all buttons, the heading--bold gold-bar utility.",
    sample: "Q1 Research Grants · 2026",
    fontFamily: "var(--font-bold)",
    fontWeight: 700,
  },
  {
    token: "--font-elegant",
    name: "Georgia",
    role: "Elegant-style H1–H3. Annual reports, policy, administrative surfaces.",
    sample: "An Annual Review of Funded Research",
    fontFamily: "var(--font-elegant)",
    fontWeight: 700,
  },
  {
    token: "--font-mono",
    name: "JetBrains Mono",
    role: "Paths, IDs, hashes, code, kbd hints. Never editorial copy.",
    sample: "/research/grants-2024/audit-7f5bd95a-2c24-4cde",
    fontFamily: "var(--font-mono)",
    fontWeight: 500,
  },
];
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="foundations" title="Typography">
      <strong>Four families, three style variants, one mono.</strong>
      <span class="block mt-2">
        Open Sans for body, Oswald for default H1–H3, Work Sans for bold
        H1–H3 + every button, Georgia for elegant H1–H3, JetBrains Mono
        for paths and IDs. Public Sans stays loaded as a back-compat
        alias, but new work commits to the four lane tokens. The full
        rule lives in
        <NuxtLink to="/design/tux" class="link-tti">design/tux.md</NuxtLink>;
        the token wiring is in
        <NuxtLink to="/tokens" class="link-tti">/tokens</NuxtLink>.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">five lanes</p>
      <h2 class="heading--bold text-xl font-bold">Family roster</h2>
      <p class="text-sm text-text-secondary mb-5 max-w-3xl">
        Every face on the page below is reached via a CSS variable
        rather than a hard-coded font-family. Swapping the underlying
        face is a single token change in
        <code>app/assets/css/tokens.css</code>.
      </p>
      <div class="mt-4 grid grid-cols-1 gap-5">
        <article
          v-for="f in families"
          :key="f.token"
          class="p-5 border border-surface-border rounded-md bg-surface-raised"
          data-tux-elevation="rest"
        >
          <header class="flex items-baseline gap-3 mb-2 flex-wrap">
            <span class="eyebrow">{{ f.token }}</span>
            <h3
              class="text-lg font-bold m-0"
              :style="{ fontFamily: f.fontFamily, fontWeight: f.fontWeight }"
            >{{ f.name }}</h3>
          </header>
          <p class="text-sm text-text-secondary m-0 mb-3 max-w-3xl">{{ f.role }}</p>
          <p
            class="m-0 text-text-primary"
            :style="{
              fontFamily: f.fontFamily,
              fontWeight: f.fontWeight,
              fontSize: '1.5rem',
              lineHeight: 1.25,
            }"
          >{{ f.sample }}</p>
        </article>
      </div>
    </section>

    <section>
      <p class="eyebrow">heading--display</p>
      <h2 class="heading--bold text-xl font-bold">Editorial maximalist</h2>
      <p class="text-sm text-text-secondary mb-4 max-w-3xl">
        Italic, uppercase, extrabold, gold accent bar. The most
        visually-loud heading utility — used sparingly for landing
        copy, not chrome.
      </p>
      <h1 class="heading--display text-5xl">Texas A&amp;M Transportation Institute</h1>
    </section>

    <section>
      <p class="eyebrow">heading--bold</p>
      <h2 class="heading--bold text-xl font-bold">Section workhorse</h2>
      <p class="text-sm text-text-secondary mb-4 max-w-3xl">
        Section titles + editorial callouts. Shorter gold rule below,
        upright Work Sans weight. Every "h2" you see on a Tux page
        carries this.
      </p>
      <h2 class="heading--bold text-3xl font-bold">Q1 research grants</h2>
    </section>

    <section>
      <p class="eyebrow">heading--elegant</p>
      <h2 class="heading--bold text-xl font-bold">Annual-report face</h2>
      <p class="text-sm text-text-secondary mb-4 max-w-3xl">
        Georgia, mixed-case, no rule — the restrained option for
        formal surfaces. Pair with
        <code>.heading--elegant--italic</code> for the italic body
        copy treatment.
      </p>
      <h2 class="heading--elegant text-3xl">An annual review of funded research</h2>
      <h3 class="heading--elegant heading--elegant--italic text-2xl mt-3">An annual review of funded research</h3>
    </section>

    <section>
      <p class="eyebrow">three variants</p>
      <h2 class="heading--bold text-xl font-bold">Style variants</h2>
      <p class="text-sm text-text-secondary mb-4 max-w-3xl">
        Opt in by adding <code>.style--bold</code> or
        <code>.style--elegant</code> to any ancestor (the body, a
        section, a card). Each variant rebinds
        <code>--font-display</code> so every H1–H3 in scope swaps
        family without per-element edits. Full demos at
        <NuxtLink to="/style-variants" class="link-tti">/style-variants</NuxtLink>.
      </p>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div class="p-5 border border-surface-border rounded-md bg-surface-raised">
          <p class="eyebrow mb-2">default · Oswald</p>
          <h3 class="text-2xl m-0" style="font-family: var(--font-display); font-weight: 500;">Bridge condition survey</h3>
        </div>
        <div class="p-5 border border-surface-border rounded-md bg-surface-raised style--bold">
          <p class="eyebrow mb-2">bold · Work Sans</p>
          <h3 class="text-2xl m-0">Bridge condition survey</h3>
        </div>
        <div class="p-5 border border-surface-border rounded-md bg-surface-raised style--elegant">
          <p class="eyebrow mb-2">elegant · Georgia</p>
          <h3 class="text-2xl m-0">Bridge condition survey</h3>
        </div>
      </div>
    </section>

    <section>
      <p class="eyebrow">meta labels</p>
      <h2 class="heading--bold text-xl font-bold">Eyebrow &amp; subhead</h2>
      <p class="text-sm text-text-secondary mb-4 max-w-3xl">
        Uppercase Work Sans, tracked-out, ~10px. Shipped as the
        <code>.eyebrow</code> and <code>.subhead</code> utilities in
        <code>globals.css</code>. Use eyebrow above a heading, subhead
        below; either works alone as a meta label inline with body
        copy.
      </p>
      <div class="mt-4 space-y-4">
        <div>
          <p class="eyebrow">eyebrow · before</p>
          <h3 class="text-xl font-semibold">Scan 7f5bd95a</h3>
        </div>
        <div>
          <h3 class="text-xl font-semibold">Scan 7f5bd95a</h3>
          <p class="subhead">subhead · after</p>
        </div>
      </div>
    </section>

    <section>
      <p class="eyebrow">body copy + mono</p>
      <h2 class="heading--bold text-xl font-bold">Paragraphs &amp; inline</h2>
      <div class="mt-4 max-w-2xl space-y-4 text-text-primary leading-relaxed">
        <p>
          The quick brown fox jumps over the lazy dog. Open Sans is the
          default body face — comfortable for long-form reading, with
          a humanist x-height that pairs cleanly with the more
          condensed Oswald display. Inline links like
          <a href="#" class="link-tti">this one</a> render in TTI navy
          with a hairline underline.
        </p>
        <p>
          Use <code>--font-mono</code> for IDs, paths, hashes, and
          shortcut hints — for example
          <code class="font-mono text-sm bg-surface-sunken px-1.5 py-0.5 rounded">7f5bd95a-2c24-4cde</code> —
          so they read as machine tokens, not editorial copy. Kbd
          glyphs use the same mono lane via
          <NuxtLink to="/components/kbd" class="link-tti">TuxKbd</NuxtLink>.
        </p>
      </div>
    </section>

    <section>
      <p class="eyebrow">long-form</p>
      <h2 class="heading--bold text-xl font-bold">TuxProse wrapper</h2>
      <p class="text-sm text-text-secondary mb-4 max-w-3xl">
        Every page that renders markdown (<NuxtLink to="/changelog" class="link-tti">/changelog</NuxtLink>,
        <NuxtLink to="/design/tux" class="link-tti">/design/[doc]</NuxtLink>,
        <NuxtLink to="/markdown" class="link-tti">/markdown</NuxtLink>,
        future ADR pages) wraps the renderer output in
        <code>&lt;TuxProse&gt;</code>. Single source of truth for
        H1/H2/H3/p/ul/blockquote/code/table styling — no more
        per-page <code>:deep()</code> blocks to keep in sync.
      </p>
      <TuxProse as="div" class="border border-surface-border rounded-md bg-surface-raised p-5 max-w-3xl">
        <h1>Document title</h1>
        <p>
          A paragraph in <strong>Open Sans</strong>, 0.9375rem,
          1.75 leading. <em>Italic emphasis</em> reads as it should,
          and <code>inline code</code> picks up the maroon tint
          against the sunken surface.
        </p>
        <h2>Section heading with maroon rule</h2>
        <p>
          H2s carry the same 2px maroon underline as
          <code>.heading--bold</code> but through the prose layer —
          authors don't need to add utility classes to their markdown.
        </p>
        <ul>
          <li>List items use the body face</li>
          <li>With comfortable 1.75 leading</li>
          <li>And generous nesting room</li>
        </ul>
        <blockquote>
          Pull quotes get a maroon left rule and italic body, matching
          the <code>TuxBlockquote</code> rhythm.
        </blockquote>
      </TuxProse>
    </section>

    <section>
      <p class="eyebrow">scale</p>
      <h2 class="heading--bold text-xl font-bold">Type scale</h2>
      <div class="mt-4 space-y-2">
        <div class="text-5xl">text-5xl · Display</div>
        <div class="text-4xl">text-4xl · Page title</div>
        <div class="text-3xl">text-3xl · Section</div>
        <div class="text-2xl">text-2xl · Subsection</div>
        <div class="text-xl">text-xl · Card heading</div>
        <div class="text-lg">text-lg · Lede</div>
        <div class="text-base">text-base · Body</div>
        <div class="text-sm">text-sm · Meta</div>
        <div class="text-xs">text-xs · Caption</div>
      </div>
    </section>
  </div>
</template>
