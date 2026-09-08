<script setup lang="ts">
useHead({ title: "TuxSearch · TUX" });

const q1 = ref("");
const q2 = ref("");
const q3 = ref("traffic safety");
const q4 = ref("");
const q5 = ref("");
const q6 = ref("rumble");

const lastSubmitted = ref<string | null>(null);

const CORPUS = [
  "Rumble strip effectiveness on rural two-lane highways",
  "Rural intersection sight-distance audit",
  "Ruralized signal timing for small-city corridors",
  "Work-zone queue warning systems",
  "Wrong-way driving countermeasures on urban freeways",
];

const matches = computed(() => {
  const q = q6.value.trim().toLowerCase();
  if (!q) return [];
  return CORPUS.filter((c) => c.toLowerCase().includes(q));
});

const exampleField = `<TuxSearch
  v-model="q"
  placeholder="Search filename, path, owner…"
  @submit="onSearch"
/>`;

const exampleSlab = `<TuxSearch
  v-model="q"
  variant="slab"
  placeholder="Search tti.tamu.edu"
  @submit="onSearch"
/>`;

const exampleBlock = `<TuxSearch
  v-model="q"
  variant="block"
  heading="Search publications"
  lede="2,400+ reports, technical memoranda, and journal
        articles from 1950 to today."
/>`;

const exampleSuggest = `<TuxSearch v-model="q" placeholder="Try &quot;ru&quot;">
  <template #suggestions="{ close }">
    <ul role="listbox">
      <li v-for="m in matches" :key="m" role="option">
        <button @click="q = m; close()">{{ m }}</button>
      </li>
    </ul>
  </template>
</TuxSearch>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxSearch">
      The tux search surface. Three shapes —
      <strong>field</strong> for toolbars and chrome,
      <strong>slab</strong> for page-level editorial surfaces,
      <strong>block</strong> for labeled standalone units. Two-ring focus
      ring, leading search glyph, clear affordance, optional suggestions
      panel. Submit fires on Enter or on the slab's action button.
    </TuxPageHeader>

    <TuxAlert variant="important" title="Changed in 2.2.0">
      <template #description>
        Through 2.1.0 this component was a straight port of the AggieUX
        search bar, and the attached-button slab was the only shape.
        <code>field</code> is now the default; the slab is opt-in via
        <code>variant="slab"</code>. Everything mechanical — focus,
        motion, elevation, spacing, dark-theme color — now runs on tux
        tokens rather than AggieUX's spec numbers and raw hexes.
      </template>
    </TuxAlert>

    <section>
      <p class="eyebrow">default</p>
      <h2 class="heading--bold text-xl font-bold">Field</h2>
      <p class="text-sm text-text-secondary mb-3">
        The tux-native bar. Leading glyph, 1px hairline border, clear (×)
        once there's a value. Sits beside other controls without
        overpowering them — this is what belongs in a table toolbar or a
        sidebar widget.
      </p>
      <TuxExample class="mt-4" :vue="exampleField">
        <TuxSearch
          v-model="q1"
          placeholder="Search Landscape indices"
          @submit="(v) => (lastSubmitted = v)"
        />
      </TuxExample>
      <p v-if="lastSubmitted" class="mt-3 font-mono text-xs text-text-muted">
        last submitted: <code>{{ lastSubmitted }}</code>
      </p>
    </section>

    <section>
      <p class="eyebrow">density</p>
      <h2 class="heading--bold text-xl font-bold">Slim field</h2>
      <p class="text-sm text-text-secondary mb-3">
        <code>size="slim"</code> — 36px. For header chrome and constrained
        columns where even the 44px field is too tall.
      </p>
      <TuxExample class="mt-4">
        <TuxSearch v-model="q2" size="slim" placeholder="Search conversations" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">editorial</p>
      <h2 class="heading--bold text-xl font-bold">Slab</h2>
      <p class="text-sm text-text-secondary mb-3">
        The attached uppercase action button and a hard 2px rule — the
        institutional-print treatment. The corner radius follows Batch
        K.2 like every other control; the weight comes from the rule and
        the button, not from square corners. Use on hero strips
        and dedicated search pages where search <em>is</em> the page. The
        slab keeps the 60px / 51px editorial heights.
      </p>
      <TuxExample class="mt-4" :vue="exampleSlab">
        <TuxSearch
          v-model="q4"
          variant="slab"
          placeholder="Search tti.tamu.edu"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">labeled unit</p>
      <h2 class="heading--bold text-xl font-bold">Block</h2>
      <p class="text-sm text-text-secondary mb-3">
        Heading + bar + optional lede, on the rhythm ramp (16px heading→bar,
        12px bar→lede). Carries <code>role="search"</code>. Use in footers,
        standalone search pages, and empty states where search is the
        primary next action. Pass <code>block-bar="slab"</code> when the
        block is the page's primary CTA.
      </p>
      <TuxExample class="mt-4" :vue="exampleBlock">
        <TuxSearch
          v-model="q5"
          variant="block"
          heading="Search publications"
          placeholder="title, author, TRID number"
          lede="Searches 2,400+ TTI research reports, technical memoranda, and journal articles from 1950 to today."
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">focus</p>
      <h2 class="heading--bold text-xl font-bold">Two-ring ring + corner-drop</h2>
      <p class="text-sm text-text-secondary mb-3">
        Focus applies the two-ring token (2px sand inner halo + 2px maroon
        outer) at a <em>constant</em> border width — the old AggieUX
        2px→3px thickening shifted the bar by 1px on every focus. On slab
        and block the corner-drop also lands: the brand slab drops in
        behind the bar, adapted from
        <NuxtLink to="/components/card" class="text-brand underline">TuxCard</NuxtLink>
        minus the translate, so the caret never moves. Off by default on
        <code>field</code>; override with <code>corner-drop</code>.
      </p>
      <TuxExample class="mt-4">
        <div class="space-y-10 py-2">
          <TuxSearch v-model="q3" force-focus />
          <TuxSearch v-model="q3" variant="slab" force-focus />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">typeahead</p>
      <h2 class="heading--bold text-xl font-bold">Suggestions panel</h2>
      <p class="text-sm text-text-secondary mb-3">
        Fill the <code>#suggestions</code> slot and the bar opens an
        overlay panel on focus. The bar wires
        <code>role="combobox"</code>, <code>aria-expanded</code>,
        <code>aria-controls</code>, Escape-to-close and focus-out; you own
        the listbox semantics inside. Type <code>ru</code> to see it.
      </p>
      <TuxExample class="mt-4" :vue="exampleSuggest">
        <TuxSearch v-model="q6" placeholder="Search the corpus…">
          <template #suggestions="{ close }">
            <ul v-if="matches.length" role="listbox" class="py-1">
              <li v-for="m in matches" :key="m" role="option" :aria-selected="false">
                <button
                  type="button"
                  class="w-full px-3 py-2 text-left text-sm hover:bg-surface-sunken"
                  @click="q6 = m; close()"
                >
                  {{ m }}
                </button>
              </li>
            </ul>
            <p v-else class="px-3 py-3 text-sm text-text-muted">
              No matches for “{{ q6 }}”.
            </p>
          </template>
        </TuxSearch>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">states</p>
      <h2 class="heading--bold text-xl font-bold">Loading and disabled</h2>
      <p class="text-sm text-text-secondary mb-3">
        <code>loading</code> swaps the leading glyph for a spinner and sets
        <code>aria-busy</code>. <code>disabled</code> dims the whole bar.
      </p>
      <TuxExample class="mt-4">
        <div class="space-y-4">
          <TuxSearch model-value="corridor throughput" loading />
          <TuxSearch placeholder="Search unavailable" disabled />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">custom action</p>
      <h2 class="heading--bold text-xl font-bold">Override label + icon</h2>
      <p class="text-sm text-text-secondary mb-3">
        Use <code>action-label</code> + <code>action-icon</code> on a slab
        when the input isn't a search per se — a filter input, a query
        builder. <code>leading-icon</code> retargets or removes the glyph.
      </p>
      <TuxExample class="mt-4">
        <TuxSearch
          v-model="q1"
          variant="slab"
          action-label="Filter"
          action-icon="lucide:filter"
          leading-icon="lucide:sliders-horizontal"
          placeholder="Filter classifiers"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props, slots, events</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>v-model</code> — current input value.</li>
        <li><code>variant</code> — <code>"field" | "slab" | "block"</code>. Defaults to <code>"field"</code>.</li>
        <li><code>blockBar</code> — <code>"field" | "slab"</code>, the bar anatomy inside a block. Defaults to <code>"field"</code>.</li>
        <li><code>size</code> — <code>"regular" | "slim"</code>. Field 44/36px, slab 60/51px.</li>
        <li><code>placeholder</code> — italic placeholder text.</li>
        <li><code>heading</code> / <code>lede</code> — block chrome. Ignored on other variants.</li>
        <li><code>ariaLabel</code> — accessible name. Falls back to <code>heading</code>, then <code>placeholder</code>.</li>
        <li><code>actionLabel</code> — uppercase slab button label. Defaults to <code>"Search"</code>.</li>
        <li><code>actionIcon</code> — icon on the slab button. Off by default; the leading glyph carries the signal.</li>
        <li><code>leadingIcon</code> — leading glyph. Defaults to <code>"lucide:search"</code>; pass <code>false</code> to drop it.</li>
        <li><code>clearable</code> — show the × once there's a value. Defaults to <code>true</code>.</li>
        <li><code>loading</code> — spinner glyph + <code>aria-busy</code>.</li>
        <li><code>disabled</code> — disable input + controls.</li>
        <li><code>cornerDrop</code> — force the focus corner-drop on or off. Defaults on for slab/block.</li>
        <li><code>forceFocus</code> — render focused for docs/demos.</li>
        <li><code>#suggestions</code> — scoped slot, receives <code>{ query, close }</code>.</li>
        <li>Emits <code>@submit</code> (Enter or slab button) and <code>@clear</code>.</li>
        <li>Exposes <code>focus()</code> and <code>clear()</code> via template ref.</li>
      </ul>
    </section>
  </div>
</template>
