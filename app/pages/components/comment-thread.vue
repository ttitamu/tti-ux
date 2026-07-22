<script setup>
import { authors, me, initialThreads } from "./comment-thread.demo-data";

useHead({ title: "TuxCommentThread · TUX" });

const threads = ref(initialThreads);

function nextId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function onAdd(threadId, body) {
  const t = threads.value.find((x) => x.id === threadId);
  if (!t) return;
  t.comments.push({
    id: nextId("c"),
    authorId: me.id,
    createdAt: new Date().toISOString(),
    body,
  });
}

function onEdit(threadId, commentId, body) {
  const t = threads.value.find((x) => x.id === threadId);
  const c = t && t.comments.find((x) => x.id === commentId);
  if (!c) return;
  c.body = body;
  c.editedAt = new Date().toISOString();
}

function onDelete(threadId, commentId) {
  const t = threads.value.find((x) => x.id === threadId);
  if (!t) return;
  t.comments = t.comments.filter((c) => c.id !== commentId);
}

function onResolve(threadId) {
  const t = threads.value.find((x) => x.id === threadId);
  if (!t) return;
  t.status = "resolved";
  t.resolvedBy = me.id;
  t.resolvedAt = new Date().toISOString();
}

function onReopen(threadId) {
  const t = threads.value.find((x) => x.id === threadId);
  if (!t) return;
  t.status = "open";
  t.resolvedBy = undefined;
  t.resolvedAt = undefined;
}

const basicVue = `<tux-comment-thread
  v-model="threads"
  :authors="authors"
  :current-user="me"
  @comment:add="onAdd"
  @comment:edit="onEdit"
  @comment:delete="onDelete"
  @thread:resolve="onResolve"
  @thread:reopen="onReopen"
/>`;

const compactVue = `<tux-comment-thread
  v-model="threads"
  :authors="authors"
  :current-user="me"
  size="sm"
  :hide-resolved="false"
/>`;

const shapesTs = `interface CommentAuthor {
  id: string;
  name: string;
  affiliation?: string;
  avatar?: string;        // URL; initials fallback when absent
}

interface Comment {
  id: string;
  authorId: string;
  createdAt: string;      // ISO 8601
  editedAt?: string;
  body: string;           // @mentions auto-detected on render
}

interface CommentThread {
  id: string;
  anchor?: string;        // e.g. "Methods §2"
  status: "open" | "resolved";
  resolvedBy?: string;
  resolvedAt?: string;
  comments: Comment[];
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · collaboration" title="TuxCommentThread">
      Peer-review / editorial-comment threads. Sister to
      <code>TuxReactionBar</code> — that's light-touch acknowledgement;
      this is the heavyweight thread surface for actual dialog. Each
      thread groups a root comment plus replies, has an
      <code>open</code> / <code>resolved</code> status, and supports
      <code>@mention</code> tokens. The component is a stateless
      renderer over a v-modeled array; mutations emit semantic events
      so the host owns persistence.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · paper-page sidebar</p>
      <h2 class="heading--bold text-xl font-bold">Open + resolved threads</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Hover a comment you authored to surface edit / delete. Use
        <kbd class="px-1 rounded border border-surface-border text-[0.7rem] font-mono">⌘↵</kbd>
        in the reply box to send. Resolved threads collapse behind a
        toggle by default — toggle off below to see the row.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <div class="max-w-2xl">
          <TuxCommentThread
            v-model="threads"
            :authors="authors"
            :current-user="me"
            @comment:add="onAdd"
            @comment:edit="onEdit"
            @comment:delete="onDelete"
            @thread:resolve="onResolve"
            @thread:reopen="onReopen"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">density · sidebar</p>
      <h2 class="heading--bold text-xl font-bold">Compact in a narrow rail</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        <code>size="sm"</code> shrinks avatars and tightens padding;
        the container-query fallback kicks in below ~22rem regardless
        of the prop, so the thread also adapts gracefully when dropped
        into a narrow slot.
      </p>
      <TuxExample class="mt-4" :vue="compactVue">
        <div class="max-w-xs border-l-2 border-brand-primary/40 pl-4">
          <TuxCommentThread
            v-model="threads"
            :authors="authors"
            :current-user="me"
            size="sm"
            :hide-resolved="false"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">What the host owns</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        The component renders; the host persists. Wire
        <code>@comment:add</code> / <code>@comment:edit</code> /
        <code>@comment:delete</code> / <code>@thread:resolve</code> /
        <code>@thread:reopen</code> to a Pinia store, Yjs doc, or REST
        endpoint — whatever the consumer surface uses.
      </p>
      <TuxCodeBlock class="mt-4" :code="shapesTs" lang="ts" filename="types.ts" />
    </section>

    <section>
      <p class="eyebrow">composes-with</p>
      <h2 class="heading--bold text-xl font-bold">Where it lives</h2>
      <ul class="mt-3 text-sm text-text-secondary leading-relaxed list-disc pl-5 space-y-1 max-w-2xl">
        <li>
          <strong>Paper page</strong> — right-rail aside on
          <code>/examples/paper-page</code>, anchored on the
          editorial-research cluster (<code>TuxAbstract</code>,
          <code>TuxFigureCaption</code>, <code>TuxFootnote</code>).
        </li>
        <li>
          <strong>Reports</strong> — drop into the
          <code>#aside</code> slot of <code>TuxReportWebFrame</code>
          for an open review pass.
        </li>
        <li>
          <strong>Inside a slideover</strong> — wrap in
          <code>TuxSlideover</code> for an "open comments" panel
          launched from a markdown editor toolbar button.
        </li>
      </ul>
    </section>
  </div>
</template>
