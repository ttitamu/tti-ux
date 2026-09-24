<script setup lang="ts">
import type { TuxKanbanMove } from "~/components/TuxKanbanBoard.vue";

useHead({ title: "TuxKanbanBoard · TUX" });

interface Card { id: string; title: string; ref: string; waitingOn?: string; people?: string[] }
interface Lane { id: string; title: string; hint: string; tone: "warning" | "info" | "neutral" | "success"; cards: Card[] }

const lanes = ref<Lane[]>([
  { id: "now", title: "Now", hint: "Being worked on", tone: "warning", cards: [
    { id: "163", ref: "#163", title: "Forgejo v17 upgrade before v16 end of life", people: ["Rojo, Alex"] },
    { id: "170", ref: "#170", title: "CI runners: isolation, capacity and platforms", waitingOn: "#212" },
  ] },
  { id: "next", title: "Next", hint: "Planned", tone: "info", cards: [
    { id: "164", ref: "#164", title: "Production host built from the repo" },
    { id: "165", ref: "#165", title: "Secrets, backups and the move to prod", waitingOn: "#164" },
    { id: "166", ref: "#166", title: "Opening sign-in: identity, department orgs and personal repos" },
  ] },
  { id: "later", title: "Later", hint: "Proposed or under review", tone: "neutral", cards: [
    { id: "171", ref: "#171", title: "Kubernetes lift and SSR hosting" },
    { id: "172", ref: "#172", title: "Post-launch showcase and polish" },
  ] },
  { id: "shipped", title: "Shipped", hint: "Done", tone: "success", cards: [] },
]);

const opened = ref("");
const log = ref<string[]>([]);

// Anything still waiting on open work can't be shipped.
function canDrop(cardId: string, toLane: string): true | string {
  const card = lanes.value.flatMap((l) => l.cards).find((c) => c.id === cardId);
  if (toLane === "shipped" && card?.waitingOn) return `${card.ref} still waits on ${card.waitingOn}`;
  return true;
}

function onMove(m: TuxKanbanMove) {
  const from = lanes.value.find((l) => l.id === m.fromLaneId)!;
  const to = lanes.value.find((l) => l.id === m.toLaneId)!;
  const card = from.cards.splice(from.cards.findIndex((c) => c.id === m.cardId), 1)[0]!;
  const at = m.beforeCardId ? to.cards.findIndex((c) => c.id === m.beforeCardId) : -1;
  to.cards.splice(at < 0 ? to.cards.length : at, 0, card);
  log.value.unshift(`${card.ref} → ${to.title}${m.beforeCardId ? ` (before #${m.beforeCardId})` : ""}`);
}

const boardVue = `<TuxKanbanBoard label="Roadmap: Now, Next, Later" :can-drop="canDrop" @move="onMove">
  <TuxKanbanLane
    v-for="lane in lanes" :key="lane.id"
    :lane-id="lane.id" :title="lane.title" :hint="lane.hint" :tone="lane.tone" :count="lane.cards.length"
  >
    <TuxKanbanCard
      v-for="card in lane.cards" :key="card.id"
      :card-id="card.id" :lane-id="lane.id" :label="card.title"
      @open="openPanel"
    >
      <p class="text-xs font-mono text-text-muted">{{ card.ref }}</p>
      <p class="text-sm font-medium">{{ card.title }}</p>
    </TuxKanbanCard>
  </TuxKanbanLane>
</TuxKanbanBoard>

<!-- and in your script setup: -->
// The board holds no data: apply the move to your own lists
// (optimistically, or after the server agrees).
function onMove({ cardId, fromLaneId, toLaneId, beforeCardId }) { … }

// true, or the reason a lane refuses the card — shown while dragging over it.
function canDrop(cardId, toLaneId, fromLaneId) {
  return toLaneId === "shipped" && isWaiting(cardId) ? "#170 still waits on #212" : true;
}`;

const readOnlyVue = `<TuxKanbanBoard label="Roadmap" disabled>
  …the same lanes and cards: they open, they don't move
</TuxKanbanBoard>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="work management" title="TuxKanbanBoard">
      Lanes of cards you can drag between — with a pointer or entirely from
      the keyboard. The board holds no data: it emits one <code>move</code>
      intent and your code updates its own lists, so the same parts serve a
      Now / Next / Later roadmap, an execution kanban, or a triage queue.
      <br><br>
      <span class="text-sm text-text-muted">
        Parts: <code>TuxKanbanBoard</code> › <code>TuxKanbanLane</code> ›
        <code>TuxKanbanCard</code> (your markup in the card's slot).
        Promoted from TTI AI Studio; safe inside a shadow root.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">drag, or use the keyboard</p>
      <h2 class="heading--bold text-xl font-bold">A roadmap board</h2>
      <p class="mt-2 text-sm text-text-secondary max-w-3xl">
        Try it: drag a card to another lane. Or Tab to a card, press
        <kbd>Space</kbd>, move it with the arrow keys and press <kbd>Space</kbd>
        again. <kbd>Esc</kbd> cancels. #170 and #165 still wait on other work,
        so the Shipped lane refuses them and says why.
      </p>
      <TuxExample class="mt-4" :vue="boardVue">
        <TuxKanbanBoard label="Roadmap: Now, Next, Later" :can-drop="canDrop" @move="onMove">
          <TuxKanbanLane
            v-for="lane in lanes"
            :key="lane.id"
            :lane-id="lane.id"
            :title="lane.title"
            :hint="lane.hint"
            :tone="lane.tone"
            :count="lane.cards.length"
          >
            <TuxKanbanCard
              v-for="card in lane.cards"
              :key="card.id"
              :card-id="card.id"
              :lane-id="lane.id"
              :label="card.title"
              @open="opened = card.ref + ' ' + card.title"
            >
              <p class="text-xs font-mono text-text-muted">{{ card.ref }}</p>
              <p class="text-sm font-medium leading-snug mt-1">{{ card.title }}</p>
              <p v-if="card.waitingOn" class="text-xs mt-2" style="color: var(--color-error)">Waits on {{ card.waitingOn }}</p>
              <p v-if="card.people" class="text-xs text-text-muted mt-2">{{ card.people.join(", ") }}</p>
            </TuxKanbanCard>
            <template #empty>Nothing shipped yet</template>
          </TuxKanbanLane>
        </TuxKanbanBoard>
        <p class="mt-3 text-sm text-text-secondary" aria-live="polite">
          <template v-if="opened">Opened: {{ opened }}</template>
          <template v-else>Click or press Enter on a card to open it.</template>
        </p>
        <ul v-if="log.length" class="mt-1 text-xs text-text-muted font-mono">
          <li v-for="(l, i) in log.slice(0, 5)" :key="i">{{ l }}</li>
        </ul>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">read-only</p>
      <h2 class="heading--bold text-xl font-bold">For people who can't change it</h2>
      <p class="mt-2 text-sm text-text-secondary max-w-3xl">
        <code>disabled</code>: cards still open, nothing moves, and the
        keyboard hint drops the move instructions.
      </p>
      <TuxExample class="mt-4" :vue="readOnlyVue">
        <TuxKanbanBoard label="Roadmap (read-only)" disabled lane-width="15rem">
          <TuxKanbanLane v-for="lane in lanes.slice(0, 3)" :key="lane.id" :lane-id="`ro-${lane.id}`" :title="lane.title" :tone="lane.tone" :count="lane.cards.length">
            <TuxKanbanCard v-for="card in lane.cards" :key="card.id" :card-id="`ro-${card.id}`" :lane-id="`ro-${lane.id}`" :label="card.title">
              <p class="text-sm">{{ card.title }}</p>
            </TuxKanbanCard>
          </TuxKanbanLane>
        </TuxKanbanBoard>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">contract</p>
      <h2 class="heading--bold text-xl font-bold">What it does and doesn't do</h2>
      <ul class="mt-3 list-disc pl-5 space-y-1 text-sm text-text-secondary max-w-3xl">
        <li><code>move({ cardId, fromLaneId, toLaneId, beforeCardId })</code> fires once per completed move; <code>beforeCardId: null</code> means the end of the lane. Nothing fires for a drop where the card already was.</li>
        <li><code>can-drop</code> returns <code>true</code> or a sentence. A refusing lane shows the sentence while the drag is over it, and the drop is cancelled and announced.</li>
        <li>Keyboard: <kbd>Space</kbd> lifts, <kbd>←</kbd>/<kbd>→</kbd> lane, <kbd>↑</kbd>/<kbd>↓</kbd> position, <kbd>Space</kbd>/<kbd>Enter</kbd> drop, <kbd>Esc</kbd> or <kbd>Tab</kbd> cancel. Each step is spoken through a live region. After a move the card keeps focus, even if your code re-renders it in the new lane.</li>
        <li>Pointer: a drag arms after 4px, never from a button or link inside the card; the click that ends a drag doesn't also open the card. Lanes and the board auto-scroll near their edges. On touch, vertical swipes still scroll a lane.</li>
        <li>Narrow containers show one lane per screen with snap scrolling.</li>
      </ul>
    </section>
  </div>
</template>
