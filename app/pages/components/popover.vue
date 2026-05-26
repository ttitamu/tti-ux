<script setup>
useHead({ title: "TuxPopover · TUX" });

const lastRun = "8 minutes ago";
const inspectVue = `<tux-popover
  title="Drift reconciler"
  body="Closes stale index entries every 30 minutes. Last run 8 min ago — 142 entries reconciled."
>
  <button class="trigger">Status</button>
  <template #actions>
    <button type="button">Run now</button>
    <button type="button" class="tux-popover__action--primary">Settings…</button>
  </template>
</tux-popover>`;

const hoverVue = `<tux-popover
  mode="hover"
  title="Stop-line compliance"
  body="Treated sites: 38% over 36-month window. Control: 78%. Effect persisted past the 12-month novelty horizon."
>
  <span class="info-anchor">i</span>
</tux-popover>`;

const richVue = `<tux-popover title="Filter by segment" width="lg">
  <button class="trigger">Filter</button>
  <template #body>
    <ul class="space-y-1.5 text-sm">
      <li class="flex items-center justify-between">
        <span>Treatment zone A</span>
        <kbd class="font-mono text-xs">8 sites</kbd>
      </li>
      <li class="flex items-center justify-between">
        <span>Treatment zone B</span>
        <kbd class="font-mono text-xs">4 sites</kbd>
      </li>
      <li class="flex items-center justify-between">
        <span>Control corridors</span>
        <kbd class="font-mono text-xs">12 sites</kbd>
      </li>
    </ul>
  </template>
  <template #actions>
    <button type="button">Clear</button>
    <button type="button" class="tux-popover__action--primary">Apply</button>
  </template>
</tux-popover>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · feedback" title="TuxPopover">
      Richer-than-tooltip floating panel — title + body + optional
      actions. The next tier above <code>TuxTooltip</code>: a panel
      that can hold a paragraph, a small data block, and one or two
      action buttons. For onboarding nudges with a dismiss, reach for
      <code>TuxTeachingPopover</code>; for fully bespoke content
      shapes, use <code>UPopover</code> directly.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · inspect-and-act</p>
      <h2 class="heading--bold text-xl font-bold">Click trigger with two actions</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Default <code>mode="click"</code> because hover-with-actions
        is bad UX — the panel disappears the moment the user reaches
        for a button. Click the <em>Status</em> button to open.
      </p>
      <TuxExample class="mt-4" :vue="inspectVue">
        <TuxPopover
          title="Drift reconciler"
          :body="`Closes stale index entries every 30 minutes. Last run ${lastRun} — 142 entries reconciled.`"
        >
          <button type="button" class="popover-demo__trigger">Status</button>
          <template #actions>
            <button type="button">Run now</button>
            <button type="button" class="tux-popover__action--primary">Settings…</button>
          </template>
        </TuxPopover>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">read-only · hover</p>
      <h2 class="heading--bold text-xl font-bold">Inspect a value without actions</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        For panels with no buttons, <code>mode="hover"</code> is
        fine. Use this for inspect / explain patterns — hover or
        focus the <em>i</em> anchor to reveal the panel.
      </p>
      <TuxExample class="mt-4" :vue="hoverVue">
        <div class="flex items-center gap-2">
          <span class="text-sm">Stop-line compliance</span>
          <TuxPopover
            mode="hover"
            title="Stop-line compliance"
            body="Treated sites: 38% over 36-month window. Control: 78%. Effect persisted past the 12-month novelty horizon."
          >
            <button type="button" class="popover-demo__info-anchor" aria-label="More info">i</button>
          </TuxPopover>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">structured body · filter</p>
      <h2 class="heading--bold text-xl font-bold">Use the <code>#body</code> slot for richer markup</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        The <code>body</code> prop covers prose. For lists, data
        blocks, or form controls, use the <code>#body</code> slot
        instead — and bump <code>width="lg"</code> if the content
        wants the room.
      </p>
      <TuxExample class="mt-4" :vue="richVue">
        <TuxPopover title="Filter by segment" width="lg">
          <button type="button" class="popover-demo__trigger">Filter</button>
          <template #body>
            <ul class="space-y-1.5 text-sm">
              <li class="flex items-center justify-between">
                <span>Treatment zone A</span>
                <kbd class="font-mono text-xs text-text-muted">8 sites</kbd>
              </li>
              <li class="flex items-center justify-between">
                <span>Treatment zone B</span>
                <kbd class="font-mono text-xs text-text-muted">4 sites</kbd>
              </li>
              <li class="flex items-center justify-between">
                <span>Control corridors</span>
                <kbd class="font-mono text-xs text-text-muted">12 sites</kbd>
              </li>
            </ul>
          </template>
          <template #actions>
            <button type="button">Clear</button>
            <button type="button" class="tux-popover__action--primary">Apply</button>
          </template>
        </TuxPopover>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">decision tree</p>
      <h2 class="heading--bold text-xl font-bold">Which floating-panel component?</h2>
      <ul class="mt-3 text-sm text-text-secondary leading-relaxed list-disc pl-5 space-y-1 max-w-2xl">
        <li>
          <strong>Hover hint, no action</strong> →
          <code>TuxTooltip</code>
        </li>
        <li>
          <strong>First-run / guided tour</strong> →
          <code>TuxTeachingPopover</code> (has a dismiss + step
          counter)
        </li>
        <li>
          <strong>Persistent inspect / configure panel</strong> →
          <code>TuxPopover</code> (this component)
        </li>
        <li>
          <strong>Bespoke content shape</strong> → <code>UPopover</code>
          directly
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.popover-demo__trigger {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-family: var(--font-sans);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: 0.375rem;
  cursor: pointer;
  color: var(--text-primary);
}
.popover-demo__trigger:hover {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}

.popover-demo__info-anchor {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--brand-primary) 14%, transparent);
  color: var(--brand-primary);
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  font-style: italic;
  border: none;
  cursor: pointer;
}
</style>
