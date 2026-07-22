<script setup lang="ts">
useHead({ title: "Skip to content · Accessibility · TUX" });
</script>

<template>
  <div class="space-y-8">
    <TuxPageHeader eyebrow="accessibility · keyboard" title="Skip to content">
      The "Skip to main content" link is a keyboard-first foundation —
      the first focusable element on the page, visible only when
      focused, that jumps the keyboard user past the navigation
      directly into the page's primary content.
      <br><br>
      <span class="text-sm text-text-muted">
        WCAG 2.4.1 (Bypass Blocks · Level A) requires "a mechanism is
        available to bypass blocks of content that are repeated on
        multiple Web pages." The skip link is the canonical mechanism.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">what's wired</p>
      <h2 class="heading--bold text-xl font-bold">Already shipping</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        <code>app/app.vue</code> renders a global skip link as its first
        focusable child:
      </p>
      <TuxCodeBlock
        class="mt-3"
        lang="vue"
        filename="app/app.vue"
        :code="'<a href=&quot;#main-content&quot; class=&quot;skip-to-content&quot;>\n  Skip to main content\n</a>'"
      />
      <p class="mt-3 text-sm text-text-secondary leading-relaxed max-w-2xl">
        The link is visually hidden until it receives keyboard focus,
        at which point it slides into the top-left corner with a
        maroon focus ring. <kbd>Tab</kbd> on any page reveals it.
      </p>
    </section>

    <section>
      <p class="eyebrow">the receiving anchor</p>
      <h2 class="heading--bold text-xl font-bold">Where it lands</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Every page surface renders its main content inside a wrapper
        with <code>id="main-content"</code> + <code>tabindex="-1"</code>.
        The skip link's <code>href="#main-content"</code> focuses that
        wrapper, so screen-reader announcements continue from the right
        place instead of the next link in the nav.
      </p>
    </section>

    <section>
      <p class="eyebrow">consumer guidance</p>
      <h2 class="heading--bold text-xl font-bold">When you embed TUX</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Downstream apps (Landscape, tti-ai-studio, marcom WordPress)
        either inherit the skip link automatically (when they consume
        the Nuxt layer with TUX's <code>app.vue</code>) or wire their
        own with the same anchor convention. The pattern is the
        constant; the chrome is yours.
      </p>
    </section>

    <section>
      <p class="eyebrow">testing</p>
      <h2 class="heading--bold text-xl font-bold">How to verify</h2>
      <ol class="mt-3 list-decimal pl-6 space-y-2 text-sm text-text-secondary leading-relaxed">
        <li>Open any TUX page in a browser.</li>
        <li>Press <kbd>Tab</kbd> — the skip link should slide in from
            the top-left with a visible focus ring.</li>
        <li>Press <kbd>Enter</kbd> — focus should land in the main
            content area (visually unchanged but next <kbd>Tab</kbd>
            should advance to the first interactive element inside
            the page).</li>
        <li>Press <kbd>Tab</kbd> again — focus should NOT cycle back
            to the nav; it should advance to the next focusable element
            in main content.</li>
      </ol>
    </section>

    <p class="text-xs text-text-muted">
      <NuxtLink to="/accessibility" class="link-tti">← Back to accessibility index</NuxtLink>
    </p>
  </div>
</template>
