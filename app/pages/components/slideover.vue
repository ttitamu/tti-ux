<script setup lang="ts">
useHead({ title: "TuxSlideover · TUX" });

const rightOpen = ref(false);
const leftOpen = ref(false);
const bottomOpen = ref(false);
const filterOpen = ref(false);

// Sample filter state for the right-edge filter panel demo.
const filters = ref({
  tier: ["public", "internal"] as string[],
  format: "all",
  hasDoi: false,
});

const tiers = [
  { value: "public",      label: "Public" },
  { value: "internal",    label: "Internal" },
  { value: "sensitive",   label: "Sensitive" },
  { value: "restricted",  label: "Restricted" },
];

const rightVue = `<TuxSlideover v-model="open" title="Field details" eyebrow="schema">
  <p>Body content scrolls here.</p>
  <template #footer>
    <TuxButton intent="ghost" @click="open = false">Cancel</TuxButton>
    <TuxButton intent="primary">Save</TuxButton>
  </template>
</TuxSlideover>`;

const leftVue = `<TuxSlideover v-model="open" side="left" title="Navigation drawer">
  …mobile-style nav reveal…
</TuxSlideover>`;

const bottomVue = `<TuxSlideover v-model="open" side="bottom" title="Quick actions">
  …action sheet…
</TuxSlideover>`;

const filterVue = `<TuxSlideover v-model="filterOpen" title="Filters" eyebrow="catalog">
  <fieldset>
    <legend class="eyebrow">classification tier</legend>
    <label v-for="t in tiers" :key="t.value">
      <input type="checkbox" :value="t.value" v-model="filters.tier" />
      {{ t.label }}
    </label>
  </fieldset>
  <!-- more filter fields… -->
  <template #footer>
    <TuxButton intent="ghost" @click="filters.tier = []">Reset</TuxButton>
    <TuxButton intent="primary" @click="filterOpen = false">Apply</TuxButton>
  </template>
</TuxSlideover>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxSlideover">
      Edge-anchored drawer. Distinct from <code>TuxModal</code> —
      slides in from a viewport edge, preserves the reading context
      behind the scrim. Built on the native <code>&lt;dialog&gt;</code>
      element so focus trap + escape + scrim come from the platform.
      Slide animation rides Batch J's <code>--ease-corridor</code>
      curve. Three sides: <code>right</code> (default, row detail and
      filters), <code>left</code> (mobile nav), <code>bottom</code>
      (action sheet).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">right edge</p>
      <h2 class="heading--bold text-xl font-bold">Row detail (default)</h2>
      <p class="text-sm text-text-secondary mb-3 max-w-3xl">
        The default posture. Use for clicking a
        <code>TuxRichDataGrid</code> row to inspect its full record,
        or for the "details" pane of a list view. Width defaults to
        <code>28rem</code>; override via the <code>size</code> prop
        for wider panels (e.g. a side-by-side editor).
      </p>
      <TuxExample :vue="rightVue">
        <div class="flex gap-3">
          <TuxButton intent="primary" icon="lucide:panel-right-open" @click="rightOpen = true">
            Open right slideover
          </TuxButton>
        </div>
        <TuxSlideover v-model="rightOpen" eyebrow="schema" title="Field details">
          <div class="space-y-3">
            <p>
              The slide animation respects <code>prefers-reduced-motion</code>;
              users with that preference see the panel appear without the slide.
            </p>
            <p>
              Escape closes; clicking the scrim closes (unless
              <code>:close-on-backdrop="false"</code>); the close button in
              the header always closes.
            </p>
            <p class="font-mono text-xs bg-surface-sunken p-2 rounded">
              data-tux-overlay + data-tux-elevation="overlay" wired by default
            </p>
          </div>
          <template #footer>
            <TuxButton intent="ghost" @click="rightOpen = false">Cancel</TuxButton>
            <TuxButton intent="primary" @click="rightOpen = false">Save</TuxButton>
          </template>
        </TuxSlideover>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">left edge</p>
      <h2 class="heading--bold text-xl font-bold">Mobile nav drawer</h2>
      <p class="text-sm text-text-secondary mb-3 max-w-3xl">
        Symmetric to the right variant — slides from the left. The
        style-guide shell uses a similar pattern for the mobile
        sidebar reveal; this component packages the affordance so a
        consuming app doesn't reinvent the trap-focus + animation
        stack.
      </p>
      <TuxExample :vue="leftVue">
        <div class="flex gap-3">
          <TuxButton intent="secondary" icon="lucide:panel-left-open" @click="leftOpen = true">
            Open left slideover
          </TuxButton>
        </div>
        <TuxSlideover v-model="leftOpen" side="left" title="Navigation">
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/" class="link-tti">Home</NuxtLink></li>
            <li><NuxtLink to="/components" class="link-tti">Components</NuxtLink></li>
            <li><NuxtLink to="/tokens" class="link-tti">Tokens</NuxtLink></li>
            <li><NuxtLink to="/typography" class="link-tti">Typography</NuxtLink></li>
            <li><NuxtLink to="/design/tux" class="link-tti">Doctrine</NuxtLink></li>
          </ul>
        </TuxSlideover>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">bottom edge</p>
      <h2 class="heading--bold text-xl font-bold">Action sheet</h2>
      <p class="text-sm text-text-secondary mb-3 max-w-3xl">
        Phone-style action sheet. Slides up from the bottom edge of
        the viewport; the panel takes full viewport width and the
        configured <code>size</code> (height). Use for quick actions
        that don't deserve a full modal — bulk row operations,
        "share" sheets, sort controls.
      </p>
      <TuxExample :vue="bottomVue">
        <div class="flex gap-3">
          <TuxButton intent="ghost" icon="lucide:panel-bottom-open" @click="bottomOpen = true">
            Open bottom slideover
          </TuxButton>
        </div>
        <TuxSlideover v-model="bottomOpen" side="bottom" title="Quick actions" eyebrow="bulk">
          <div class="flex flex-wrap gap-3">
            <TuxButton intent="ghost" icon="lucide:download">Export selected</TuxButton>
            <TuxButton intent="ghost" icon="lucide:share-2">Share</TuxButton>
            <TuxButton intent="ghost" icon="lucide:archive">Archive</TuxButton>
            <TuxButton intent="destructive" icon="lucide:trash-2">Delete</TuxButton>
          </div>
        </TuxSlideover>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">canonical use</p>
      <h2 class="heading--bold text-xl font-bold">Filter panel</h2>
      <p class="text-sm text-text-secondary mb-3 max-w-3xl">
        The most common posture in a real app — clicking a "Filter"
        button on a list view opens a right-edge panel of filter
        controls, with Reset / Apply at the footer. The panel
        preserves the catalog context behind the scrim so users can
        see what they're filtering against.
      </p>
      <TuxExample :vue="filterVue">
        <div class="flex gap-3 items-center">
          <TuxButton intent="primary" icon="lucide:list-filter" @click="filterOpen = true">
            Open filters
          </TuxButton>
          <span class="text-sm text-text-muted">
            Selected: <code>{{ filters.tier.length || 0 }}</code> tiers,
            <code>{{ filters.format }}</code> format
          </span>
        </div>
        <TuxSlideover v-model="filterOpen" eyebrow="catalog" title="Filters">
          <fieldset class="border-0 p-0 m-0 mb-5">
            <legend class="eyebrow mb-2">classification tier</legend>
            <div class="space-y-1.5">
              <label v-for="t in tiers" :key="t.value" class="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  :value="t.value"
                  v-model="filters.tier"
                  class="h-3.5 w-3.5"
                />
                {{ t.label }}
              </label>
            </div>
          </fieldset>
          <fieldset class="border-0 p-0 m-0 mb-5">
            <legend class="eyebrow mb-2">format</legend>
            <div class="space-y-1.5">
              <label v-for="f in ['all', 'pdf', 'csv', 'md']" :key="f" class="flex items-center gap-2 text-sm">
                <input type="radio" :value="f" v-model="filters.format" class="h-3.5 w-3.5" />
                <span class="font-mono">{{ f }}</span>
              </label>
            </div>
          </fieldset>
          <fieldset class="border-0 p-0 m-0">
            <legend class="eyebrow mb-2">metadata</legend>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="filters.hasDoi" class="h-3.5 w-3.5" />
              Has DOI assigned
            </label>
          </fieldset>
          <template #footer>
            <TuxButton intent="ghost" @click="filters.tier = []; filters.format = 'all'; filters.hasDoi = false">
              Reset
            </TuxButton>
            <TuxButton intent="primary" @click="filterOpen = false">
              Apply
            </TuxButton>
          </template>
        </TuxSlideover>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>v-model</code> — open / closed. Boolean.</li>
        <li><code>side</code> — <code>"left" | "right" | "bottom"</code>. Defaults <code>"right"</code>.</li>
        <li><code>size</code> — CSS length for the panel width (left/right) or height (bottom). Defaults <code>28rem</code> (left/right) or <code>24rem</code> (bottom).</li>
        <li><code>title</code> — header heading. Pair with <code>eyebrow</code> above it.</li>
        <li><code>eyebrow</code> — uppercase mini-label above the title.</li>
        <li><code>showClose</code> — top-right close button. Defaults <code>true</code>.</li>
        <li><code>closeOnBackdrop</code> — dismiss when scrim is clicked. Defaults <code>true</code>.</li>
        <li>Slots: default (body), <code>#header</code> (replace eyebrow + title region), <code>#footer</code> (action row).</li>
        <li>Exposes <code>open()</code> + <code>close()</code> via template ref.</li>
      </ul>
    </section>

    <section>
      <p class="eyebrow">when to reach for which</p>
      <h2 class="heading--bold text-xl font-bold">Slideover vs Modal</h2>
      <ul class="mt-4 space-y-2 text-sm max-w-3xl">
        <li><strong>TuxSlideover</strong> — user is <em>drilling into</em> the page they're on. Row detail, filter panel, side-by-side editor. Context behind the scrim is still relevant.</li>
        <li><strong>TuxModal</strong> — the page below doesn't matter. Confirmation, full-attention form, fatal error. Center-screen makes the page recede.</li>
        <li>Both ship the native dialog primitives — focus trap, escape, scrim. Choose based on whether the underlying page is part of the user's mental model for the current action.</li>
      </ul>
    </section>
  </div>
</template>
