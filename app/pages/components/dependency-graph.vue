<script setup lang="ts">
import type { TuxGraphEdge, TuxGraphNode } from "~/utils/tuxDependencyGraph";

useHead({ title: "TuxDependencyGraph · TUX" });

// A realistic Roadmap slice: two areas of work (Identity, Work surface),
// one item that lives in another repository, finished items, a loop that
// somebody created by accident, and a few items nobody has linked yet.
const roadmap: TuxGraphNode[] = [
  // Identity — Entra ↔ Forgejo sync
  { id: "170", ref: "#170", label: "Export Entra groups nightly", group: "Identity", done: true, status: { label: "Done", tone: "success" } },
  { id: "171", ref: "#171", label: "Map Entra groups to Forgejo teams", group: "Identity", done: true, status: { label: "Done", tone: "success" } },
  { id: "174", ref: "#174", label: "Service accounts as Entra app registrations", group: "Identity", status: { label: "In progress", tone: "info" } },
  { id: "176", ref: "#176", label: "Suspend forge accounts when Entra disables them", group: "Identity", status: { label: "Ready", tone: "neutral" } },
  { id: "179", ref: "#179", label: "Weekly report of orphaned accounts", group: "Identity", status: { label: "Backlog", tone: "muted" } },
  // Work surface — the Roadmap tab
  { id: "tti/tti-ux#31", ref: "tti/tti-ux#31", label: "Shadow-DOM-safe dependency graph", group: "TUX", external: true, status: { label: "In review", tone: "warning" } },
  { id: "203", ref: "#203", label: "Mount the TUX island in repo tabs", group: "Work surface", done: true, status: { label: "Done", tone: "success" } },
  { id: "205", ref: "#205", label: "Roadmap “Order” view", group: "Work surface", status: { label: "Ready", tone: "neutral" } },
  { id: "207", ref: "#207", label: "Item side panel: read, edit, assign", group: "Work surface", status: { label: "In progress", tone: "info" } },
  { id: "209", ref: "#209", label: "Unblock an item from the side panel", group: "Work surface", status: { label: "Ready", tone: "neutral" } },
  { id: "212", ref: "#212", label: "Milestone roll-up on the Insights tab", group: "Work surface", status: { label: "Backlog", tone: "muted" } },
  // The accident: three Insights items that wait on each other.
  { id: "220", ref: "#220", label: "Burndown reads the roll-up totals", group: "Insights", status: { label: "Blocked", tone: "error" } },
  { id: "221", ref: "#221", label: "Roll-up counts items the bot closed", group: "Insights", status: { label: "Blocked", tone: "error" } },
  { id: "222", ref: "#222", label: "Bot closes an epic when its burndown hits zero", group: "Insights", status: { label: "Blocked", tone: "error" } },
  { id: "224", ref: "#224", label: "Quarterly delivery report", group: "Insights", status: { label: "Backlog", tone: "muted" } },
  // Nobody has linked these yet.
  { id: "230", ref: "#230", label: "Dark-theme status palette", group: "Work surface", status: { label: "Ready", tone: "neutral" } },
  { id: "231", ref: "#231", label: "Rename the Insights tab", group: "Work surface" },
  { id: "233", ref: "#233", label: "Glossary: what “blocked by” means", group: "Docs", done: true, status: { label: "Done", tone: "success" } },
];

const links: TuxGraphEdge[] = [
  { from: "170", to: "171" },
  { from: "171", to: "176" },
  { from: "174", to: "176" },
  { from: "176", to: "179" },
  { from: "203", to: "205" },
  { from: "tti/tti-ux#31", to: "205" },
  { from: "203", to: "207" },
  { from: "205", to: "209" },
  { from: "207", to: "209" },
  { from: "174", to: "209" }, // the bot needs its Entra identity to write
  { from: "209", to: "212" },
  { from: "212", to: "220" },
  { from: "220", to: "221" }, // 221 waits on 220 …
  { from: "221", to: "222" }, // … 222 waits on 221 …
  { from: "222", to: "220" }, // … and 220 waits on 222: a loop
  { from: "222", to: "224" },
];

const selected = ref<string | null>("209");
const hideDone = ref(false);
const selectedRef = computed(() => roadmap.find((n) => n.id === selected.value)?.ref ?? selected.value);

// Impossible data, on purpose: two loops (one of two items), a self-link,
// links to items that aren't in the view, and a repeated link.
const messyNodes: TuxGraphNode[] = [
  { id: "301", ref: "#301", label: "Adopt the new label taxonomy", group: "Boards" },
  { id: "302", ref: "#302", label: "Migrate old labels", group: "Boards" },
  { id: "303", ref: "#303", label: "Retire the legacy board", group: "Boards", done: true, status: { label: "Closed", tone: "muted" } },
  { id: "310", ref: "#310", label: "Epic roll-up bot", group: "Boards" },
  { id: "311", ref: "#311", label: "Epic progress bar", group: "Boards" },
  { id: "312", ref: "#312", label: "Burndown chart", group: "Boards" },
];
const messyLinks: TuxGraphEdge[] = [
  { from: "301", to: "302" },
  { from: "302", to: "301" }, // two-item loop
  { from: "303", to: "301" },
  { from: "310", to: "311" },
  { from: "311", to: "312" },
  { from: "312", to: "310" }, // three-item loop
  { from: "311", to: "311" }, // waits on itself
  { from: "310", to: "tti/other#9" }, // not in this view
  { from: "ghost", to: "312" }, // not in this view
  { from: "310", to: "311" }, // repeated
];

// Narrow: the same Identity chain in a 340px phone panel.
const identity = roadmap.filter((n) => n.group === "Identity");
const identityLinks = links.filter((l) => identity.some((n) => n.id === l.from) && identity.some((n) => n.id === l.to));
const narrowSelected = ref<string | null>(null);

const unlinkedOnly = roadmap.filter((n) => ["230", "231", "233"].includes(n.id));

const mainVue = `<TuxDependencyGraph
  :nodes="roadmap"
  :edges="links"
  :selected="selected"
  :hide-done="hideDone"
  aria-label="Roadmap order"
  @select="(id) => (selected = id)"
/>

<!-- roadmap: TuxGraphNode[]
  { id: "205", ref: "#205", label: "Roadmap “Order” view",
    group: "Work surface", status: { label: "Ready", tone: "neutral" } }
  { id: "tti/tti-ux#31", ref: "tti/tti-ux#31", external: true, … }
  { id: "203", …, done: true }

links: TuxGraphEdge[] — \`to\` waits on \`from\`
  { from: "203", to: "205" }       // #205 is blocked by #203
  { from: "222", to: "220" }       // …which closes a loop -->`;

const messyVue = `<TuxDependencyGraph :nodes="messyNodes" :edges="messyLinks" />

<!-- messyLinks includes:
  { from: "301", to: "302" }, { from: "302", to: "301" }   // two-item loop
  { from: "311", to: "311" }                               // waits on itself
  { from: "310", to: "tti/other#9" }                       // not in nodes
  { from: "310", to: "311" }  (twice)                      // repeated -->`;

const narrowVue = `<div style="width: 340px">
  <TuxDependencyGraph :nodes="identity" :edges="identityLinks"
    :selected="narrowSelected" @select="(id) => (narrowSelected = id)" />
</div>`;

const statesVue = `<TuxDependencyGraph :nodes="[]" :edges="[]" />
<TuxDependencyGraph :nodes="unlinkedOnly" :edges="[]" />
<TuxDependencyGraph :nodes="roadmap" :edges="links" loading />`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="work surface" title="TuxDependencyGraph">
      “What has to happen first.” A layered, left-to-right graph of work items
      where an arrow means <em>waits on</em>. It is the <strong>Order</strong> view
      of a repository’s Roadmap tab on the forge, drawn from Forgejo issue
      dependencies (cross-repository links included). Loops and blockers are
      made impossible to miss: a loop gets a banner in plain words, a framed
      band and red links; every open card with open blockers says
      “Waiting on N”.
      <br><br>
      <span class="text-sm text-text-muted">
        Not the same thing as <NuxtLink to="/components/diagram" class="link-tti">TuxDiagram</NuxtLink>,
        which renders Mermaid source you write by hand. This one takes data
        (<code>nodes</code> + <code>edges</code>), lays itself out, and every
        card is a real button you can select, trace and reach by keyboard.
        Safe to run in the forge’s shadow-DOM island: no Nuxt APIs, no
        document queries, no teleports.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">the roadmap order</p>
      <h2 class="heading--bold text-xl font-bold">Two areas, one external item, a loop, a selection</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-3xl">
        Columns are steps: an item sits one step right of the furthest thing it
        waits on. <code>#209</code> is selected, so its whole chain — everything
        upstream, everything downstream — is traced and the rest dims. Hover or
        tab to any card to preview its chain. Dashed links come out of finished
        items and no longer block. <code>tti/tti-ux#31</code> lives in another
        repository (dashed card). The three Insights items wait on each other,
        so they sit in the Loop band, and <code>#224</code>, which waits on the
        loop, carries the loop icon.
      </p>
      <div class="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <UCheckbox v-model="hideDone" label="Hide done items" />
        <span class="text-text-secondary">
          Selected: <code>{{ selectedRef ?? "none" }}</code>
          <button
            v-if="selected"
            type="button"
            class="link-tti ml-2"
            @click="selected = null"
          >clear</button>
        </span>
      </div>
      <TuxExample class="mt-4" :vue="mainVue">
        <TuxDependencyGraph
          :nodes="roadmap"
          :edges="links"
          :selected="selected"
          :hide-done="hideDone"
          aria-label="Roadmap order"
          @select="(id) => (selected = id)"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">impossible states</p>
      <h2 class="heading--bold text-xl font-bold">Two loops, a self-link, links to nowhere</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-3xl">
        Dependency data can be wrong, and the graph never hides that or
        crashes on it. Every loop is named in the banner (each reference is a
        button that selects the item, so the host can open it and remove a
        link). Links that can’t be drawn — to itself, to an item not in
        <code>nodes</code>, repeated — are counted in words under the key.
      </p>
      <TuxExample class="mt-4" :vue="messyVue">
        <TuxDependencyGraph :nodes="messyNodes" :edges="messyLinks" aria-label="Boards order (with loops)" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">narrow</p>
      <h2 class="heading--bold text-xl font-bold">In a 340px side panel</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-3xl">
        The graph keeps its shape and scrolls sideways inside its own box;
        the banner, the “Not linked” strip and the key wrap. Tabbing to a card
        scrolls it into view.
      </p>
      <TuxExample class="mt-4" :vue="narrowVue">
        <div class="max-w-[340px] border-l-2 border-brand-primary/40 pl-3">
          <TuxDependencyGraph
            :nodes="identity"
            :edges="identityLinks"
            :selected="narrowSelected"
            aria-label="Identity order"
            @select="(id) => (narrowSelected = id)"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">states</p>
      <h2 class="heading--bold text-xl font-bold">Empty, nothing linked, loading</h2>
      <TuxExample class="mt-4" :vue="statesVue">
        <div class="grid gap-6">
          <TuxDependencyGraph :nodes="[]" :edges="[]" aria-label="Empty order" />
          <TuxDependencyGraph :nodes="unlinkedOnly" :edges="[]" aria-label="Unlinked items" />
          <TuxDependencyGraph :nodes="roadmap" :edges="links" loading aria-label="Loading order" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">api</p>
      <h2 class="heading--bold text-xl font-bold">Props, events, slot</h2>
      <div class="mt-4 overflow-x-auto">
        <table class="w-full text-sm border border-surface-border">
          <thead class="bg-surface-sunken text-left">
            <tr>
              <th class="p-2 font-semibold">Name</th>
              <th class="p-2 font-semibold">Type</th>
              <th class="p-2 font-semibold">What it does</th>
            </tr>
          </thead>
          <tbody class="text-text-secondary">
            <tr class="border-t border-surface-border">
              <td class="p-2"><code>nodes</code></td>
              <td class="p-2"><code>TuxGraphNode[]</code></td>
              <td class="p-2"><code>{ id, label, ref?, status?: { label, tone }, done?, external?, group? }</code>. Order matters only as a tie-breaker.</td>
            </tr>
            <tr class="border-t border-surface-border">
              <td class="p-2"><code>edges</code></td>
              <td class="p-2"><code>TuxGraphEdge[]</code></td>
              <td class="p-2"><code>{ from, to }</code>: <code>to</code> waits on <code>from</code>. Bad links are dropped and counted, never thrown on.</td>
            </tr>
            <tr class="border-t border-surface-border">
              <td class="p-2"><code>selected</code></td>
              <td class="p-2"><code>string | null</code></td>
              <td class="p-2">Traces this item’s chain persistently and marks the card <code>aria-current</code>.</td>
            </tr>
            <tr class="border-t border-surface-border">
              <td class="p-2"><code>hideDone</code></td>
              <td class="p-2"><code>boolean</code> (false)</td>
              <td class="p-2">Leaves done items and their links out; the note says how many.</td>
            </tr>
            <tr class="border-t border-surface-border">
              <td class="p-2"><code>loading</code></td>
              <td class="p-2"><code>boolean</code> (false)</td>
              <td class="p-2">Placeholder columns while the host fetches dependencies.</td>
            </tr>
            <tr class="border-t border-surface-border">
              <td class="p-2"><code>ariaLabel</code></td>
              <td class="p-2"><code>string</code></td>
              <td class="p-2">Name of the graph group. Default “Dependency order”.</td>
            </tr>
            <tr class="border-t border-surface-border">
              <td class="p-2"><code>@select</code></td>
              <td class="p-2"><code>(nodeId: string)</code></td>
              <td class="p-2">A card, a “Not linked” chip, or a loop member in the banner was chosen.</td>
            </tr>
            <tr class="border-t border-surface-border">
              <td class="p-2"><code>#empty</code></td>
              <td class="p-2">slot</td>
              <td class="p-2">Replaces the “Nothing to order yet” message.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-sm text-text-secondary leading-relaxed max-w-3xl">
        The layout is a pure function, <code>tuxLayoutDependencyGraph(nodes, edges, { hideDone })</code>
        in <code>app/utils/tuxDependencyGraph.ts</code> (auto-imported in Nuxt; import it by path
        elsewhere), so a host can reuse it — for example to count loops for a tab badge
        before anything renders. <code>tuxDependencyChain</code> gives any item’s upstream and
        downstream chain.
      </p>
    </section>

    <section>
      <p class="eyebrow">accessibility</p>
      <h2 class="heading--bold text-lg font-bold">The lines, in words</h2>
      <ul class="mt-2 list-disc pl-5 space-y-1 text-text-secondary leading-relaxed max-w-3xl">
        <li>Every card is a <code>&lt;button&gt;</code> (Enter and Space select), in an ordered list, in step order — so Tab walks the graph left to right. Arrow keys jump to the nearest card in that direction.</li>
        <li>Each card is described by what it waits on and what needs it (“Waits on #203 (done), tti/tti-ux#31. Needed by #209.”), whether it is in or behind a loop, done, or in another repository. The drawing itself is hidden from assistive tech.</li>
        <li>Nothing depends on colour alone: done cards carry a check, external cards a dashed border and an arrow, loop involvement a loop icon and the word “Loop”, blocking links are solid and finished ones dashed.</li>
        <li>Tracing dims with opacity only while a card is hovered, focused or selected; the key lists only the line styles on screen.</li>
      </ul>
    </section>
  </div>
</template>
