<script setup lang="ts">
/**
 * TuxDependencyGraph — "what has to happen first".
 *
 * A layered, left-to-right graph of work items where an arrow means
 * "waits on": `{ from: "a", to: "b" }` says #b cannot finish until
 * #a does. Built for the forge's Roadmap tab ("Order" view), where the
 * data are Forgejo issue dependencies, cross-repository links included.
 *
 * Not TuxDiagram: that one renders Mermaid source you write by hand. This
 * one takes data, lays it out itself (app/utils/tuxDependencyGraph.ts —
 * pure, unit-tested), and every card is a real button.
 *
 * What it makes impossible to miss:
 *   - Loops. Items that wait on each other in a circle can never finish.
 *     They go in a framed "Loop" band under the graph, in cycle order,
 *     with red links and a plain-words banner that names every member.
 *   - Blockers. A link from an open item to an open item is solid; once
 *     the blocker is done it turns dashed and quiet. Open cards with open
 *     blockers say "Waiting on N"; ones whose blockers are all done say
 *     "Unblocked"; ones stuck downstream of a loop carry the loop icon.
 *   - Bad data. Self-links, links to items that aren't in the view and
 *     repeated links are never drawn and never crash anything — they are
 *     counted in a note under the graph.
 *
 * Interaction: click / Enter / Space selects (emits `select`). Hover or
 * focus traces a card's whole chain — everything it waits on, all the way
 * up, and everything waiting on it, all the way down — and dims the rest;
 * `selected` does the same persistently. Tab walks the cards in step
 * order; the arrow keys jump to the nearest card in that direction.
 *
 * Island-safe (the forge mounts it in a shadow root, in plain Vue): no
 * Nuxt APIs, no document-level queries, no teleports. Links elsewhere are
 * the host's job — this component only emits ids.
 *
 * Usage:
 *   <TuxDependencyGraph :nodes="items" :edges="links" :selected="open"
 *     @select="(id) => (open = id)" />
 */
import { computed, ref, useId } from "vue";
// Explicit, relative: the forge island does not auto-import TUX utils.
import {
  tuxDependencyChain,
  tuxGraphEdgeKey,
  tuxLayoutDependencyGraph,
  tuxNearestGraphNode,
} from "../utils/tuxDependencyGraph";
import type {
  TuxGraphDirection,
  TuxGraphEdge,
  TuxGraphNode,
  TuxGraphPlacedNode,
  TuxGraphRoutedEdge,
} from "../utils/tuxDependencyGraph";

interface Props {
  nodes: TuxGraphNode[];
  /** `to` waits on `from` — `from` has to finish first. */
  edges: TuxGraphEdge[];
  /** Highlight this item and its whole upstream + downstream chain. */
  selected?: string | null;
  /** Leave done items out entirely (their links go with them). */
  hideDone?: boolean;
  /** The host is still fetching: show a placeholder instead of the graph. */
  loading?: boolean;
  /** Accessible name for the graph. */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  selected: null,
  hideDone: false,
  loading: false,
  ariaLabel: "Dependency order",
});

const emit = defineEmits<{
  /** A card (or a loop member named in the banner) was chosen. */
  select: [nodeId: string];
}>();

defineSlots<{
  /** Replaces the "nothing to order" message when there are no items at all. */
  empty?: () => unknown;
}>();

const uid = useId();

const layout = computed(() =>
  tuxLayoutDependencyGraph(props.nodes, props.edges, { hideDone: props.hideDone }),
);
const m = computed(() => layout.value.metrics);

const nodeById = computed(() => {
  const map = new Map<string, TuxGraphNode>();
  for (const p of layout.value.placed) map.set(p.id, p.node);
  for (const n of layout.value.isolated) map.set(n.id, n);
  return map;
});
const refOf = (id: string) => nodeById.value.get(id)?.ref ?? id;

// ── tracing ────────────────────────────────────────────────────────────
// Hover beats focus beats `selected`, so pointing at another card while
// one is selected previews that card's chain without losing the selection.
const hoverId = ref<string | null>(null);
const focusId = ref<string | null>(null);
const activeId = computed(() => {
  for (const id of [hoverId.value, focusId.value, props.selected]) {
    if (id && nodeById.value.has(id)) return id;
  }
  return null;
});
const chain = computed(() => (activeId.value ? tuxDependencyChain(layout.value, activeId.value) : null));

const inChain = (id: string) => !chain.value || chain.value.nodes.has(id);

function nodeClasses(id: string, node: TuxGraphNode, loop: number | null) {
  return {
    "tux-dependency-graph__node--done": node.done,
    "tux-dependency-graph__node--external": node.external,
    "tux-dependency-graph__node--loop": loop !== null,
    "tux-dependency-graph__node--selected": props.selected === id,
    "tux-dependency-graph__node--active": activeId.value === id,
    "tux-dependency-graph__node--dim": !inChain(id),
  };
}

// Chain links draw last so they sit on top of the ones they cross.
const drawnEdges = computed(() => {
  const c = chain.value;
  const rank = (e: TuxGraphRoutedEdge) => (c?.edges.has(e.key) ? 2 : e.loop ? 1 : 0);
  return [...layout.value.edges].sort((a, b) => rank(a) - rank(b));
});

function edgeClasses(e: TuxGraphRoutedEdge) {
  const c = chain.value;
  return {
    "tux-dependency-graph__edge--blocking": e.blocking,
    "tux-dependency-graph__edge--quiet": !e.blocking,
    "tux-dependency-graph__edge--loop": e.loop,
    "tux-dependency-graph__edge--chain": !!c && c.edges.has(e.key),
    "tux-dependency-graph__edge--dim": !!c && !c.edges.has(e.key),
  };
}

// ── words ──────────────────────────────────────────────────────────────
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function nameList(ids: string[]): string {
  const shown = ids.slice(0, 6).map((id) => {
    const n = nodeById.value.get(id);
    return `${refOf(id)}${n?.done ? " (done)" : ""}`;
  });
  const rest = ids.length - shown.length;
  return rest > 0 ? `${shown.join(", ")} and ${rest} more` : shown.join(", ");
}

/** What the lines say, for people who can't see them. */
function describe(p: TuxGraphPlacedNode): string {
  const parts: string[] = [];
  const total = layout.value.columns;
  parts.push(
    p.loop !== null
      ? `In a loop${layout.value.loops.length > 1 ? ` (loop ${p.loop + 1})` : ""}: it can't finish until one of its links is removed.`
      : `Step ${p.column + 1} of ${total}.`,
  );
  if (p.node.done) parts.push("Done.");
  if (p.node.external) parts.push("In another repository.");
  if (p.blockers.length) parts.push(`Waits on ${nameList(p.blockers)}.`);
  if (p.dependents.length) parts.push(`Needed by ${nameList(p.dependents)}.`);
  if (p.behindLoop) parts.push("Something it waits on is stuck in a loop.");
  return parts.join(" ");
}

const descId = (i: number) => `${uid}-d${i}`;
const stripTitleId = `${uid}-strip`;
const bannerId = `${uid}-banner`;

// The key lists only the kinds of line and card actually on screen.
const legend = computed(() => {
  const { edges, placed } = layout.value;
  return {
    blocking: edges.some((e) => e.blocking && !e.loop),
    quiet: edges.some((e) => !e.blocking && !e.loop),
    loop: edges.some((e) => e.loop),
    external: placed.some((p) => p.node.external) || layout.value.isolated.some((n) => n.external),
  };
});

const ignoredNote = computed(() => {
  const { ignored, hiddenDone } = layout.value;
  const parts: string[] = [];
  if (ignored.self) parts.push(`${plural(ignored.self, "link from an item to itself", "links from items to themselves")}`);
  if (ignored.unknown) parts.push(`${plural(ignored.unknown, "link to an item", "links to items")} not in this view`);
  if (ignored.duplicate) parts.push(`${plural(ignored.duplicate, "repeated link", "repeated links")}`);
  const hidden = hiddenDone ? ` ${plural(hiddenDone, "done item is", "done items are")} hidden.` : "";
  return parts.length ? `Not drawn: ${parts.join("; ")}.${hidden}` : hidden.trim();
});

// ── keyboard ───────────────────────────────────────────────────────────
// Elements are tracked through function refs on this component's own
// template — no document-level queries (the forge renders us in a shadow root).
const graphEls = new Map<string, HTMLElement>();
const stripEls = new Map<string, HTMLElement>();
function track(map: Map<string, HTMLElement>, id: string) {
  return (el: unknown) => {
    if (el instanceof HTMLElement) map.set(id, el);
    else map.delete(id);
  };
}

const ARROWS: Record<string, TuxGraphDirection> = {
  ArrowRight: "right",
  ArrowLeft: "left",
  ArrowUp: "up",
  ArrowDown: "down",
};

function onGraphKeydown(e: KeyboardEvent, id: string) {
  const dir = ARROWS[e.key];
  if (!dir) return;
  const next = tuxNearestGraphNode(layout.value, id, dir);
  e.preventDefault();
  if (next) graphEls.get(next)?.focus();
}

function onStripKeydown(e: KeyboardEvent, index: number) {
  const dir = ARROWS[e.key];
  if (!dir) return;
  e.preventDefault();
  const list = layout.value.isolated;
  const next = list[index + (dir === "right" || dir === "down" ? 1 : -1)];
  if (next) stripEls.get(next.id)?.focus();
}

function select(id: string) {
  emit("select", id);
}

// ── geometry helpers for the template ─────────────────────────────────
const px = (n: number) => `${n}px`;
const slotStyle = (x: number, y: number) => ({
  left: px(x),
  top: px(y),
  width: px(m.value.nodeWidth),
  height: px(m.value.nodeHeight),
});
const SKELETON = [2, 3, 1];
const loopKey = (loop: string[]) => tuxGraphEdgeKey(loop[0] ?? "", loop[loop.length - 1] ?? "");
</script>

<template>
  <div
    class="tux-dependency-graph"
    :class="{ 'tux-dependency-graph--tracing': !!chain }"
  >
    <!-- Loop banner: above the graph, in words, naming every member. -->
    <div
      v-if="!loading && layout.loops.length"
      :id="bannerId"
      class="tux-dependency-graph__banner"
      role="note"
    >
      <UIcon name="i-lucide-repeat" class="tux-dependency-graph__banner-icon" aria-hidden="true" />
      <div class="tux-dependency-graph__banner-body">
        <p class="tux-dependency-graph__banner-title">
          These items wait on each other in a loop — nothing in it can finish until one link is removed.
        </p>
        <p
          v-for="(loop, li) in layout.loops"
          :key="loopKey(loop)"
          class="tux-dependency-graph__banner-loop"
        >
          <span v-if="layout.loops.length > 1" class="tux-dependency-graph__banner-count">{{ `Loop ${li + 1}: ` }}</span>
          <span class="tux-dependency-graph__sr">{{
            layout.loopIsCircle[li]
              ? "Each waits on the one before it, and the first on the last: "
              : "Each of these waits on another of them: "
          }}</span>
          <template v-for="(id, j) in loop" :key="id">
            <button
              type="button"
              class="tux-dependency-graph__banner-ref"
              :aria-label="`${refOf(id)} ${nodeById.get(id)?.label ?? ''} — open it to remove a link`"
              @click="select(id)"
            >{{ refOf(id) }}</button>
            <span
              v-if="j < loop.length - 1"
              class="tux-dependency-graph__banner-arrow"
              aria-hidden="true"
            >{{ layout.loopIsCircle[li] ? " → " : " · " }}</span>
          </template>
          <span v-if="layout.loopIsCircle[li]" class="tux-dependency-graph__banner-back" aria-hidden="true">{{
            ` → back to ${refOf(loop[0]!)}`
          }}</span>
        </p>
      </div>
    </div>

    <!-- Loading: the host is still fetching links. -->
    <div
      v-if="loading"
      class="tux-dependency-graph__loading"
      role="status"
      aria-live="polite"
    >
      <span class="tux-dependency-graph__sr">Loading the dependency order…</span>
      <div v-for="(cards, c) in SKELETON" :key="c" class="tux-dependency-graph__loading-col" aria-hidden="true">
        <span v-for="r in cards" :key="r" class="tux-dependency-graph__loading-card" />
      </div>
    </div>

    <template v-else>
      <!-- Nothing at all. -->
      <div
        v-if="!layout.placed.length && !layout.isolated.length"
        class="tux-dependency-graph__empty"
      >
        <slot name="empty">
          <UIcon name="i-lucide-git-fork" class="tux-dependency-graph__empty-icon" aria-hidden="true" />
          <p class="tux-dependency-graph__empty-title">Nothing to order yet</p>
          <p class="tux-dependency-graph__empty-text">
            When an item is marked as blocked by another, the order they have to happen in shows up here.
          </p>
        </slot>
      </div>

      <!-- Items, but none of them linked. -->
      <p
        v-else-if="!layout.placed.length"
        class="tux-dependency-graph__empty-text tux-dependency-graph__empty-text--inline"
      >
        None of these items wait on each other yet.
      </p>

      <!-- The graph. Scrolls sideways inside its own box when narrow. -->
      <div v-if="layout.placed.length" class="tux-dependency-graph__scroll">
        <div
          class="tux-dependency-graph__canvas"
          role="group"
          :aria-label="ariaLabel"
          :aria-describedby="layout.loops.length ? bannerId : undefined"
          :style="{ width: px(layout.width), height: px(layout.height) }"
        >
          <svg
            class="tux-dependency-graph__edges"
            :width="layout.width"
            :height="layout.height"
            :viewBox="`0 0 ${layout.width} ${layout.height}`"
            aria-hidden="true"
            focusable="false"
          >
            <rect
              v-for="f in layout.frames"
              :key="`frame-${f.loop}`"
              class="tux-dependency-graph__frame"
              :x="f.x"
              :y="f.y"
              :width="f.width"
              :height="f.height"
              rx="10"
            />
            <g
              v-for="e in drawnEdges"
              :key="e.key"
              class="tux-dependency-graph__edge"
              :class="edgeClasses(e)"
            >
              <path class="tux-dependency-graph__edge-line" :d="e.d" />
              <path class="tux-dependency-graph__edge-arrow" :d="e.arrow" />
            </g>
          </svg>

          <span
            v-for="(x, c) in layout.columnX"
            :key="`step-${c}`"
            class="tux-dependency-graph__step"
            aria-hidden="true"
            :style="{ left: px(x), top: px(m.padding), width: px(m.nodeWidth) }"
          >Step {{ c + 1 }}</span>

          <span
            v-for="f in layout.frames"
            :key="`caption-${f.loop}`"
            class="tux-dependency-graph__frame-caption"
            aria-hidden="true"
            :style="{ left: px(f.x + 10), top: px(f.y + 6) }"
          >
            <UIcon name="i-lucide-repeat" class="tux-dependency-graph__frame-icon" />
            Loop{{ layout.loops.length > 1 ? ` ${f.loop + 1}` : "" }}
          </span>

          <ol class="tux-dependency-graph__nodes">
            <li
              v-for="(p, i) in layout.placed"
              :key="p.id"
              class="tux-dependency-graph__slot"
              :style="slotStyle(p.x, p.y)"
            >
              <button
                :ref="track(graphEls, p.id)"
                type="button"
                class="tux-dependency-graph__node"
                :class="nodeClasses(p.id, p.node, p.loop)"
                :data-node-id="p.id"
                :aria-current="selected === p.id ? 'true' : undefined"
                :aria-describedby="descId(i)"
                @click="select(p.id)"
                @keydown="onGraphKeydown($event, p.id)"
                @mouseenter="hoverId = p.id"
                @mouseleave="hoverId = null"
                @focus="focusId = p.id"
                @blur="focusId = null"
              >
                <span class="tux-dependency-graph__node-head">
                  <UIcon
                    v-if="p.node.done"
                    name="i-lucide-circle-check"
                    class="tux-dependency-graph__node-done"
                    aria-hidden="true"
                  />
                  <span class="tux-dependency-graph__node-ref">{{ p.node.ref ?? p.id }}</span>
                  <UIcon
                    v-if="p.node.external"
                    name="i-lucide-arrow-up-right"
                    class="tux-dependency-graph__node-external"
                    aria-hidden="true"
                  />
                  <span v-if="p.node.group" class="tux-dependency-graph__node-group">{{ p.node.group }}</span>
                </span>
                <span class="tux-dependency-graph__node-label">{{ p.node.label }}</span>
                <span class="tux-dependency-graph__node-foot">
                  <TuxBadge
                    v-if="p.node.status"
                    :tone="p.node.status.tone"
                    :label="p.node.status.label"
                  />
                  <span
                    v-if="p.waitingOn > 0"
                    class="tux-dependency-graph__flag"
                    :class="{ 'tux-dependency-graph__flag--loop': p.loop !== null || p.behindLoop }"
                  >
                    <UIcon
                      v-if="p.loop !== null || p.behindLoop"
                      name="i-lucide-repeat"
                      class="tux-dependency-graph__flag-icon"
                      aria-hidden="true"
                    />
                    <UIcon
                      v-else
                      name="i-lucide-hourglass"
                      class="tux-dependency-graph__flag-icon"
                      aria-hidden="true"
                    />
                    Waiting on {{ p.waitingOn }}
                  </span>
                  <span
                    v-else-if="p.unblocked"
                    class="tux-dependency-graph__flag tux-dependency-graph__flag--ready"
                  >
                    <UIcon name="i-lucide-circle-check" class="tux-dependency-graph__flag-icon" aria-hidden="true" />
                    Unblocked
                  </span>
                </span>
              </button>
              <span :id="descId(i)" class="tux-dependency-graph__sr">{{ describe(p) }}</span>
            </li>
          </ol>
        </div>
      </div>

      <!-- Items with no links at all: a compact strip, not the graph. -->
      <div
        v-if="layout.isolated.length"
        class="tux-dependency-graph__strip"
        role="group"
        :aria-labelledby="stripTitleId"
      >
        <p :id="stripTitleId" class="tux-dependency-graph__strip-title">
          <UIcon name="i-lucide-unlink" class="tux-dependency-graph__strip-icon" aria-hidden="true" />
          Not linked
          <span class="tux-dependency-graph__strip-count">{{ layout.isolated.length }}</span>
        </p>
        <ul class="tux-dependency-graph__chips">
          <li v-for="(n, i) in layout.isolated" :key="n.id" class="tux-dependency-graph__chip-item">
            <button
              :ref="track(stripEls, n.id)"
              type="button"
              class="tux-dependency-graph__chip"
              :class="nodeClasses(n.id, n, null)"
              :data-node-id="n.id"
              :aria-current="selected === n.id ? 'true' : undefined"
              @click="select(n.id)"
              @keydown="onStripKeydown($event, i)"
              @mouseenter="hoverId = n.id"
              @mouseleave="hoverId = null"
              @focus="focusId = n.id"
              @blur="focusId = null"
            >
              <UIcon
                v-if="n.done"
                name="i-lucide-circle-check"
                class="tux-dependency-graph__node-done"
                aria-hidden="true"
              />
              <span class="tux-dependency-graph__node-ref">{{ n.ref ?? n.id }}</span>
              <span class="tux-dependency-graph__chip-label">{{ n.label }}</span>
              <span v-if="n.done || n.external" class="tux-dependency-graph__sr">
                {{ [n.done ? "Done." : "", n.external ? "In another repository." : ""].join(" ") }}
              </span>
              <TuxBadge v-if="n.status" :tone="n.status.tone" :label="n.status.label" />
            </button>
          </li>
        </ul>
      </div>

      <!-- Key + what was left out. -->
      <div v-if="layout.placed.length || ignoredNote" class="tux-dependency-graph__footer">
        <ul v-if="layout.placed.length" class="tux-dependency-graph__legend" aria-label="Key">
          <li v-if="legend.blocking" class="tux-dependency-graph__legend-item">
            <svg class="tux-dependency-graph__legend-line" viewBox="0 0 28 8" aria-hidden="true" focusable="false">
              <path class="tux-dependency-graph__legend-blocking" d="M1 4 H21" /><path class="tux-dependency-graph__legend-blocking-head" d="M27 4 L20 0 L20 8 Z" />
            </svg>
            Waits on (still open)
          </li>
          <li v-if="legend.quiet" class="tux-dependency-graph__legend-item">
            <svg class="tux-dependency-graph__legend-line" viewBox="0 0 28 8" aria-hidden="true" focusable="false">
              <path class="tux-dependency-graph__legend-quiet" d="M1 4 H21" /><path class="tux-dependency-graph__legend-quiet-head" d="M27 4 L20 0 L20 8 Z" />
            </svg>
            Blocker done
          </li>
          <li v-if="legend.loop" class="tux-dependency-graph__legend-item">
            <svg class="tux-dependency-graph__legend-line" viewBox="0 0 28 8" aria-hidden="true" focusable="false">
              <path class="tux-dependency-graph__legend-loop" d="M1 4 H21" /><path class="tux-dependency-graph__legend-loop-head" d="M27 4 L20 0 L20 8 Z" />
            </svg>
            Part of a loop
          </li>
          <li v-if="legend.external" class="tux-dependency-graph__legend-item">
            <span class="tux-dependency-graph__legend-box" aria-hidden="true" />
            Another repository
          </li>
        </ul>
        <p v-if="ignoredNote" class="tux-dependency-graph__note">{{ ignoredNote }}</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.tux-dependency-graph {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
  font-family: var(--font-body);
  color: var(--text-primary);
}

.tux-dependency-graph__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

/* ── loop banner ─────────────────────────────────────────────────────── */
.tux-dependency-graph__banner {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.75rem 0.875rem;
  border: 1px solid color-mix(in srgb, var(--color-error) 50%, transparent);
  border-left: 4px solid var(--color-error);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--color-error) 8%, var(--surface-raised));
}

.tux-dependency-graph__banner-icon {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  margin-top: 0.0625rem;
  color: var(--color-error);
}

.tux-dependency-graph__banner-body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.tux-dependency-graph__banner-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.45;
  color: var(--text-primary);
}

.tux-dependency-graph__banner-loop {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: var(--text-secondary);
}


.tux-dependency-graph__banner-count {
  font-weight: 600;
  color: var(--text-primary);
}

.tux-dependency-graph__banner-ref {
  padding: 0 0.25rem;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--color-error) 60%, transparent);
  text-underline-offset: 2px;
  cursor: pointer;
}

.tux-dependency-graph__banner-ref:hover {
  border-color: color-mix(in srgb, var(--color-error) 50%, transparent);
  background: var(--surface-raised);
}

.tux-dependency-graph__banner-ref:focus-visible {
  outline: 2px solid transparent;
  box-shadow: var(--shadow-focus);
}

.tux-dependency-graph__banner-back {
  font-weight: 600;
  color: var(--text-primary);
}

/* ── graph box ───────────────────────────────────────────────────────── */
.tux-dependency-graph__scroll {
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-sunken);
}

.tux-dependency-graph__canvas {
  position: relative;
}

.tux-dependency-graph__edges {
  position: absolute;
  inset: 0;
  overflow: visible;
  pointer-events: none;
}

.tux-dependency-graph__frame {
  fill: color-mix(in srgb, var(--color-error) 6%, transparent);
  stroke: color-mix(in srgb, var(--color-error) 50%, transparent);
  stroke-width: 1.5;
}

.tux-dependency-graph__step,
.tux-dependency-graph__frame-caption {
  position: absolute;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1rem;
  text-transform: uppercase;
  pointer-events: none;
  user-select: none;
}

.tux-dependency-graph__step {
  color: var(--text-muted);
}

.tux-dependency-graph__frame-caption {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-error);
}

.tux-dependency-graph__frame-icon {
  width: 0.75rem;
  height: 0.75rem;
}

/* ── links ───────────────────────────────────────────────────────────── */
.tux-dependency-graph__edge-line {
  fill: none;
  stroke: var(--text-secondary);
  stroke-width: 1.5;
  stroke-linejoin: round;
  transition:
    stroke var(--motion-fast) var(--ease-standard),
    opacity var(--motion-fast) var(--ease-standard);
}

.tux-dependency-graph__edge-arrow {
  fill: var(--text-secondary);
  stroke: none;
  transition:
    fill var(--motion-fast) var(--ease-standard),
    opacity var(--motion-fast) var(--ease-standard);
}

.tux-dependency-graph__edge--quiet .tux-dependency-graph__edge-line {
  stroke: var(--text-muted);
  stroke-width: 1.25;
  stroke-dasharray: 4 3;
}

.tux-dependency-graph__edge--quiet .tux-dependency-graph__edge-arrow {
  fill: var(--text-muted);
}

.tux-dependency-graph__edge--loop .tux-dependency-graph__edge-line {
  stroke: var(--color-error);
  stroke-width: 2;
}

.tux-dependency-graph__edge--loop .tux-dependency-graph__edge-arrow {
  fill: var(--color-error);
}

.tux-dependency-graph__edge--chain:not(.tux-dependency-graph__edge--loop) .tux-dependency-graph__edge-line {
  stroke: var(--brand-primary);
}

.tux-dependency-graph__edge--chain:not(.tux-dependency-graph__edge--loop) .tux-dependency-graph__edge-arrow {
  fill: var(--brand-primary);
}

.tux-dependency-graph__edge--chain .tux-dependency-graph__edge-line {
  stroke-width: 2.5;
}

.tux-dependency-graph__edge--dim {
  opacity: 0.18;
}

/* ── cards ───────────────────────────────────────────────────────────── */
.tux-dependency-graph__nodes {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tux-dependency-graph__slot {
  position: absolute;
}

.tux-dependency-graph__node {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  color: var(--text-primary);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    opacity var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard),
    background-color var(--motion-fast) var(--ease-standard);
}

.tux-dependency-graph__node:hover {
  border-color: var(--brand-primary);
}

.tux-dependency-graph__node:focus-visible,
.tux-dependency-graph__chip:focus-visible {
  outline: 2px solid transparent;
  box-shadow: var(--shadow-focus);
}

.tux-dependency-graph__node--external,
.tux-dependency-graph__chip.tux-dependency-graph__node--external {
  border-style: dashed;
  border-color: var(--text-muted);
}

.tux-dependency-graph__node--done {
  background: var(--surface-sunken);
}

.tux-dependency-graph__node--done .tux-dependency-graph__node-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.tux-dependency-graph__node--loop {
  border-color: var(--color-error);
}

.tux-dependency-graph__node--active {
  border-color: var(--brand-primary);
}

.tux-dependency-graph__node--selected {
  border-color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 8%, var(--surface-raised));
  box-shadow: inset 0 0 0 1px var(--brand-primary);
}

.tux-dependency-graph__node--selected:focus-visible {
  box-shadow: inset 0 0 0 1px var(--brand-primary), var(--shadow-focus);
}

.tux-dependency-graph--tracing .tux-dependency-graph__node--dim {
  opacity: 0.45;
}

.tux-dependency-graph__node-head {
  display: flex;
  align-items: center;
  gap: 0.3125rem;
  min-width: 0;
  font-size: 0.75rem;
  line-height: 1rem;
}

.tux-dependency-graph__node-ref {
  flex: none;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
}

.tux-dependency-graph__node-done {
  flex: none;
  width: 0.875rem;
  height: 0.875rem;
  color: var(--color-success);
}

.tux-dependency-graph__node-external {
  flex: none;
  width: 0.75rem;
  height: 0.75rem;
  color: var(--text-muted);
}

.tux-dependency-graph__node-group {
  margin-left: auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.tux-dependency-graph__node-label {
  flex: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.tux-dependency-graph__node-foot {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  min-width: 0;
  white-space: nowrap;
}

.tux-dependency-graph__flag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: auto;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.tux-dependency-graph__flag--loop {
  color: var(--color-error);
}

.tux-dependency-graph__flag--ready {
  color: var(--color-success);
}

.tux-dependency-graph__flag-icon {
  flex: none;
  width: 0.8125rem;
  height: 0.8125rem;
}

/* ── not linked ──────────────────────────────────────────────────────── */
.tux-dependency-graph__strip {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tux-dependency-graph__strip-title {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.tux-dependency-graph__strip-icon {
  width: 0.8125rem;
  height: 0.8125rem;
}

.tux-dependency-graph__strip-count {
  font-family: var(--font-mono);
  letter-spacing: 0;
}

.tux-dependency-graph__chips {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.tux-dependency-graph__chip-item {
  min-width: 0;
  max-width: 100%;
}

.tux-dependency-graph__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  max-width: 100%;
  padding: 0.25rem 0.375rem 0.25rem 0.5rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  color: var(--text-primary);
  font: inherit;
  font-size: 0.8125rem;
  text-align: left;
  cursor: pointer;
  transition:
    opacity var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard);
}

.tux-dependency-graph__chip:hover {
  border-color: var(--brand-primary);
}

.tux-dependency-graph__chip.tux-dependency-graph__node--selected {
  border-color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 8%, var(--surface-raised));
}

.tux-dependency-graph__chip.tux-dependency-graph__node--done {
  background: var(--surface-sunken);
}

.tux-dependency-graph--tracing .tux-dependency-graph__chip.tux-dependency-graph__node--dim {
  opacity: 0.45;
}

.tux-dependency-graph__chip-label {
  min-width: 0;
  max-width: 22ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}

/* ── footer: key + note ─────────────────────────────────────────────── */
.tux-dependency-graph__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.375rem 1rem;
}

.tux-dependency-graph__legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.tux-dependency-graph__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.tux-dependency-graph__legend-line {
  width: 1.75rem;
  height: 0.5rem;
  overflow: visible;
}

.tux-dependency-graph__legend-blocking,
.tux-dependency-graph__legend-quiet,
.tux-dependency-graph__legend-loop {
  fill: none;
  stroke-width: 1.5;
}

.tux-dependency-graph__legend-blocking { stroke: var(--text-secondary); }
.tux-dependency-graph__legend-blocking-head { fill: var(--text-secondary); }
.tux-dependency-graph__legend-quiet { stroke: var(--text-muted); stroke-dasharray: 4 3; }
.tux-dependency-graph__legend-quiet-head { fill: var(--text-muted); }
.tux-dependency-graph__legend-loop { stroke: var(--color-error); stroke-width: 2; }
.tux-dependency-graph__legend-loop-head { fill: var(--color-error); }

.tux-dependency-graph__legend-box {
  width: 1.125rem;
  height: 0.75rem;
  border: 1px dashed var(--text-muted);
  border-radius: var(--radius-sm);
}

.tux-dependency-graph__note {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* ── empty + loading ─────────────────────────────────────────────────── */
.tux-dependency-graph__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 2rem 1rem;
  border: 1px dashed var(--surface-border);
  border-radius: var(--radius-md);
  text-align: center;
}

.tux-dependency-graph__empty-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--text-muted);
}

.tux-dependency-graph__empty-title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
}

.tux-dependency-graph__empty-text {
  margin: 0;
  max-width: 36rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.tux-dependency-graph__empty-text--inline {
  max-width: none;
}

.tux-dependency-graph__loading {
  display: flex;
  gap: 2.5rem;
  padding: 2.25rem 0.75rem 0.75rem;
  overflow: hidden;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-sunken);
}

.tux-dependency-graph__loading-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tux-dependency-graph__loading-card {
  display: block;
  width: 12rem;
  height: 5.5rem;
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border-subtle);
  animation: tux-dependency-graph-pulse 1.4s var(--ease-standard) infinite alternate;
}

@keyframes tux-dependency-graph-pulse {
  from { opacity: 1; }
  to { opacity: 0.55; }
}

/* ── narrow containers (a phone-width side panel) ───────────────────── */
@container (max-width: 30rem) {
  .tux-dependency-graph__banner {
    padding: 0.625rem 0.75rem;
  }

  .tux-dependency-graph__banner-title {
    font-size: 0.8125rem;
  }

  .tux-dependency-graph__chip-label {
    max-width: 14ch;
  }

  .tux-dependency-graph__legend {
    gap: 0.25rem 0.75rem;
  }

  .tux-dependency-graph__loading {
    gap: 1.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tux-dependency-graph__node,
  .tux-dependency-graph__chip,
  .tux-dependency-graph__edge-line,
  .tux-dependency-graph__edge-arrow {
    transition: none;
  }

  .tux-dependency-graph__loading-card {
    animation: none;
  }
}
</style>
