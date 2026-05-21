<script setup lang="ts">
useHead({ title: "Focus model · Accessibility · TUX" });
</script>

<template>
  <div class="space-y-8">
    <TuxPageHeader eyebrow="accessibility · keyboard" title="Focus model">
      Visible focus, focus-trap behavior, tab order — the three things
      that make a keyboard-only user feel oriented on a TUX page.
      <br><br>
      <span class="text-sm text-text-muted">
        WCAG 2.4.7 (Focus Visible · Level AA) requires "any keyboard
        operable user interface has a mode of operation where the
        keyboard focus indicator is visible." TUX guarantees this
        across every focusable surface.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">the indicator</p>
      <h2 class="heading--bold text-xl font-bold">Visible focus ring</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Every focusable element gets a 2px maroon outline with a 2px
        offset on <code>:focus-visible</code>. Mouse-click doesn't
        trigger the ring (avoids the "ring on every button I click"
        noise); only keyboard navigation does.
      </p>
      <TuxCodeBlock
        class="mt-3"
        lang="css"
        filename="app/assets/css/globals.css"
        :code="'/* Universal focus ring — every focusable surface inherits this */\\n*:focus-visible {\\n  outline: 2px solid var(--brand-primary);\\n  outline-offset: 2px;\\n  border-radius: var(--radius-sm);\\n}'"
      />
      <p class="mt-3 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Three exceptions:
      </p>
      <ul class="mt-2 list-disc pl-6 space-y-1.5 text-sm text-text-secondary leading-relaxed">
        <li><strong>Inputs / textareas</strong> use a ring + a
            subtle border-color shift so the entire field reads as
            focused, not just the outline.</li>
        <li><strong>Cards (linked)</strong> use a corner-drop hover +
            focus tint instead of an outline — the chrome IS the
            indicator.</li>
        <li><strong>HC theme</strong> bumps outline-width to 3px and
            uses pure black for guaranteed contrast.</li>
      </ul>
    </section>

    <section>
      <p class="eyebrow">trapping focus</p>
      <h2 class="heading--bold text-xl font-bold">Modals, slideovers, popovers</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        When an overlay opens, focus moves into it and is trapped
        until the overlay closes. Components that own this:
      </p>
      <ul class="mt-2 list-disc pl-6 space-y-1.5 text-sm text-text-secondary leading-relaxed">
        <li><code>TuxModal</code> — focus moves to the first focusable
            element; <kbd>Esc</kbd> closes; <kbd>Tab</kbd> cycles only
            within the modal.</li>
        <li><code>TuxSlideover</code> — same focus-trap behavior; built
            on the native <code>&lt;dialog&gt;</code> which provides
            the trap for free.</li>
        <li><code>TuxShortcutsHelp</code> — modal overlay triggered
            by <kbd>?</kbd>; focus traps in the dialog.</li>
        <li><code>TuxCommandPalette</code> — composes Reka UI's command
            primitive; same trap.</li>
      </ul>
      <p class="mt-3 text-sm text-text-secondary leading-relaxed max-w-2xl">
        On close, focus restores to the trigger element — clicking
        "Close" returns the keyboard to the button that opened the
        overlay, not the top of the document.
      </p>
    </section>

    <section>
      <p class="eyebrow">tab order</p>
      <h2 class="heading--bold text-xl font-bold">Document order, with rare overrides</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        TUX components render their internals in semantic document
        order. <code>tabindex="-1"</code> is reserved for two cases:
      </p>
      <ol class="mt-2 list-decimal pl-6 space-y-1.5 text-sm text-text-secondary leading-relaxed">
        <li><strong>Skip-link target</strong> — the <code>#main-content</code>
            wrapper has <code>tabindex="-1"</code> so it can receive
            programmatic focus from the skip link without being part
            of the normal tab sequence.</li>
        <li><strong>Roving tabindex inside composite widgets</strong> —
            menubars, listboxes, treeviews. Arrow keys move within;
            <kbd>Tab</kbd> moves to the next widget. Reka UI provides
            this behavior for its own primitives.</li>
      </ol>
      <p class="mt-3 text-sm text-text-secondary leading-relaxed max-w-2xl">
        <strong>Positive <code>tabindex</code> values are forbidden</strong>
        — they create unpredictable jumps and break user expectation.
        If a piece of content needs to be reached earlier, restructure
        the DOM order, don't reorder the tab sequence.
      </p>
    </section>

    <section>
      <p class="eyebrow">testing</p>
      <h2 class="heading--bold text-xl font-bold">How to verify a page</h2>
      <ol class="mt-3 list-decimal pl-6 space-y-2 text-sm text-text-secondary leading-relaxed">
        <li>Press <kbd>Tab</kbd> from the top of any page; the skip
            link should appear first.</li>
        <li>Continue tabbing — every interactive element must show a
            visible focus ring.</li>
        <li>Open any modal / slideover / shortcuts-help; <kbd>Tab</kbd>
            must cycle within (not escape to the page behind).</li>
        <li>Close the overlay; focus must return to the trigger.</li>
        <li>No <code>tabindex</code> values &gt; 0 anywhere — search the
            built HTML with browser devtools to confirm.</li>
      </ol>
    </section>

    <p class="text-xs text-text-muted">
      <NuxtLink to="/accessibility" class="link-tti">← Back to accessibility index</NuxtLink>
    </p>
  </div>
</template>
