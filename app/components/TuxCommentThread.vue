<script setup lang="ts">
/**
 * TuxCommentThread — peer-review / editorial-comment threads.
 *
 * The "open comments alongside a paper / report / shared draft" surface
 * Google-Docs and journal-review tools own. Sister to `TuxReactionBar`
 * (light-touch) — this is the heavyweight thread surface for actual
 * dialog.
 *
 * Each thread groups a root comment + replies. Threads have a status
 * (`open` / `resolved`) that consumers persist; resolving collapses
 * the thread to a one-line summary with a re-open affordance. Authors
 * are passed in as objects with `name` + `affiliation` + optional
 * `avatar` (initials fallback when absent). Mentions are detected as
 * `@token` and rendered with the brand accent.
 *
 * Threads are v-modeled — the component is a stateless renderer over
 * the array. Compose state in the host (Pinia store, Yjs doc, REST
 * API). Mutations emit semantic events (`comment:add`, `comment:edit`,
 * `comment:delete`, `thread:resolve`, `thread:reopen`).
 *
 * Usage:
 *   <tux-comment-thread
 *     v-model="threads"
 *     :current-user="me"
 *     @comment:add="onAdd"
 *     @thread:resolve="onResolve"
 *   />
 */

export interface CommentAuthor {
  id: string;
  name: string;
  affiliation?: string;
  /** Optional avatar URL; falls back to initials when absent. */
  avatar?: string;
}

export interface Comment {
  id: string;
  authorId: string;
  /** ISO 8601 timestamp. */
  createdAt: string;
  /** Edited timestamp; undefined if not edited. */
  editedAt?: string;
  body: string;
}

export interface CommentThread {
  id: string;
  /** Optional anchor — e.g., "Methods §2" or "Figure 3". Renders as
   *  an eyebrow above the root comment. */
  anchor?: string;
  status: "open" | "resolved";
  /** Resolution metadata; populated when status === "resolved". */
  resolvedBy?: string;
  resolvedAt?: string;
  comments: Comment[];
}

interface Props {
  modelValue: CommentThread[];
  /** Author directory; keyed by author id. */
  authors: Record<string, CommentAuthor>;
  /** Current viewer; used for reply attribution + edit/delete affordances. */
  currentUser: CommentAuthor;
  /** Hide resolved threads behind a "Show resolved (N)" toggle. */
  hideResolved?: boolean;
  /** Compact density for sidebar contexts. */
  size?: "sm" | "md";
}

const props = withDefaults(defineProps<Props>(), {
  hideResolved: true,
  size: "md",
});

const emit = defineEmits<{
  "update:modelValue": [v: CommentThread[]];
  "comment:add": [threadId: string, body: string];
  "comment:edit": [threadId: string, commentId: string, body: string];
  "comment:delete": [threadId: string, commentId: string];
  "thread:resolve": [threadId: string];
  "thread:reopen": [threadId: string];
}>();

const showResolved = ref(false);

const visibleThreads = computed(() =>
  props.hideResolved && !showResolved.value
    ? props.modelValue.filter((t) => t.status === "open")
    : props.modelValue,
);

const resolvedCount = computed(
  () => props.modelValue.filter((t) => t.status === "resolved").length,
);

// Per-thread reply draft + per-comment edit draft.
const replyDrafts = ref<Record<string, string>>({});
const editingId = ref<string | null>(null);
const editDraft = ref("");

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

function authorOf(id: string): CommentAuthor {
  return (
    props.authors[id] ?? {
      id,
      name: "Unknown",
      affiliation: undefined,
    }
  );
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

// Mention renderer — splits a body into a sequence of text + mention
// tokens. Mentions are `@word` (word-chars + dots + hyphens).
function tokenize(body: string): Array<{ kind: "text" | "mention"; value: string }> {
  const out: Array<{ kind: "text" | "mention"; value: string }> = [];
  const re = /@([\w.-]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    if (m.index > last) out.push({ kind: "text", value: body.slice(last, m.index) });
    out.push({ kind: "mention", value: m[1] ?? "" });
    last = m.index + m[0].length;
  }
  if (last < body.length) out.push({ kind: "text", value: body.slice(last) });
  return out;
}

function submitReply(threadId: string) {
  const body = (replyDrafts.value[threadId] ?? "").trim();
  if (!body) return;
  emit("comment:add", threadId, body);
  replyDrafts.value[threadId] = "";
}

function beginEdit(c: Comment) {
  editingId.value = c.id;
  editDraft.value = c.body;
}

function submitEdit(threadId: string, commentId: string) {
  const body = editDraft.value.trim();
  if (!body) return;
  emit("comment:edit", threadId, commentId, body);
  editingId.value = null;
  editDraft.value = "";
}

function cancelEdit() {
  editingId.value = null;
  editDraft.value = "";
}
</script>

<template>
  <div class="tux-comment-thread-list" :class="`tux-comment-thread-list--${size}`">
    <article
      v-for="thread in visibleThreads"
      :key="thread.id"
      class="tux-comment-thread"
      :class="thread.status === 'resolved' && 'tux-comment-thread--resolved'"
      :aria-label="`Comment thread${thread.anchor ? ' on ' + thread.anchor : ''}`"
    >
      <header v-if="thread.anchor || thread.status === 'resolved'" class="tux-comment-thread__header">
        <p v-if="thread.anchor" class="eyebrow tux-comment-thread__anchor">{{ thread.anchor }}</p>
        <span v-if="thread.status === 'resolved'" class="tux-comment-thread__status">
          <UIcon name="lucide:check-circle-2" class="tux-comment-thread__status-icon" aria-hidden="true" />
          Resolved
          <template v-if="thread.resolvedBy">
            by {{ authorOf(thread.resolvedBy).name }}
          </template>
          <template v-if="thread.resolvedAt">
            · {{ timeAgo(thread.resolvedAt) }}
          </template>
        </span>
      </header>

      <ol class="tux-comment-thread__comments">
        <li
          v-for="c in thread.comments"
          :key="c.id"
          class="tux-comment"
        >
          <div class="tux-comment__avatar" :aria-hidden="true">
            <img v-if="authorOf(c.authorId).avatar" :src="authorOf(c.authorId).avatar" alt="">
            <span v-else>{{ initialsOf(authorOf(c.authorId).name) }}</span>
          </div>
          <div class="tux-comment__body">
            <div class="tux-comment__meta">
              <span class="tux-comment__author">{{ authorOf(c.authorId).name }}</span>
              <span v-if="authorOf(c.authorId).affiliation" class="tux-comment__affiliation">
                · {{ authorOf(c.authorId).affiliation }}
              </span>
              <span class="tux-comment__time">{{ timeAgo(c.createdAt) }}</span>
              <span v-if="c.editedAt" class="tux-comment__edited">(edited)</span>
            </div>

            <div v-if="editingId === c.id" class="tux-comment__edit">
              <textarea
                v-model="editDraft"
                class="tux-comment__textarea"
                rows="3"
                :aria-label="`Edit comment by ${authorOf(c.authorId).name}`"
              />
              <div class="tux-comment__edit-actions">
                <button type="button" class="tux-comment__btn" @click="cancelEdit">Cancel</button>
                <button type="button" class="tux-comment__btn tux-comment__btn--primary" @click="submitEdit(thread.id, c.id)">Save</button>
              </div>
            </div>
            <p v-else class="tux-comment__text">
              <template v-for="(tok, i) in tokenize(c.body)" :key="i">
                <span v-if="tok.kind === 'mention'" class="tux-comment__mention">@{{ tok.value }}</span>
                <template v-else>{{ tok.value }}</template>
              </template>
            </p>

            <div v-if="editingId !== c.id && c.authorId === currentUser.id" class="tux-comment__actions">
              <button type="button" class="tux-comment__link" @click="beginEdit(c)">Edit</button>
              <button type="button" class="tux-comment__link" @click="emit('comment:delete', thread.id, c.id)">Delete</button>
            </div>
          </div>
        </li>
      </ol>

      <footer v-if="thread.status === 'open'" class="tux-comment-thread__footer">
        <textarea
          v-model="replyDrafts[thread.id]"
          class="tux-comment__textarea"
          rows="2"
          placeholder="Reply… (use @name to mention)"
          :aria-label="`Reply to thread${thread.anchor ? ' on ' + thread.anchor : ''}`"
          @keydown.meta.enter.prevent="submitReply(thread.id)"
          @keydown.ctrl.enter.prevent="submitReply(thread.id)"
        />
        <div class="tux-comment-thread__footer-actions">
          <button type="button" class="tux-comment__link" @click="emit('thread:resolve', thread.id)">
            <UIcon name="lucide:check" class="tux-comment__link-icon" aria-hidden="true" />
            Resolve
          </button>
          <button
            type="button"
            class="tux-comment__btn tux-comment__btn--primary"
            :disabled="!(replyDrafts[thread.id] ?? '').trim()"
            @click="submitReply(thread.id)"
          >
            Reply
          </button>
        </div>
      </footer>

      <footer v-else class="tux-comment-thread__footer tux-comment-thread__footer--resolved">
        <button type="button" class="tux-comment__link" @click="emit('thread:reopen', thread.id)">
          <UIcon name="lucide:rotate-ccw" class="tux-comment__link-icon" aria-hidden="true" />
          Re-open
        </button>
      </footer>
    </article>

    <button
      v-if="hideResolved && resolvedCount > 0"
      type="button"
      class="tux-comment-thread-list__toggle"
      @click="showResolved = !showResolved"
    >
      <UIcon
        :name="showResolved ? 'lucide:eye-off' : 'lucide:eye'"
        class="tux-comment__link-icon"
        aria-hidden="true"
      />
      {{ showResolved ? "Hide resolved" : `Show resolved (${resolvedCount})` }}
    </button>

    <p v-if="visibleThreads.length === 0" class="tux-comment-thread-list__empty">
      No open threads.
    </p>
  </div>
</template>

<style scoped>
.tux-comment-thread-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  container-type: inline-size;
}

.tux-comment-thread {
  border: 1px solid var(--surface-border);
  border-radius: 0.5rem;
  padding: 1rem;
  background: var(--surface-elevated, var(--surface-raised));
  transition: border-color 120ms ease;
}
.tux-comment-thread--resolved {
  border-style: dashed;
  background: transparent;
  opacity: 0.85;
}

.tux-comment-thread__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}
.tux-comment-thread__anchor {
  margin: 0;
}
.tux-comment-thread__status {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: var(--font-sans);
}
.tux-comment-thread__status-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: color-mix(in srgb, var(--brand-primary) 70%, var(--text-muted));
}

.tux-comment-thread__comments {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.tux-comment {
  display: grid;
  grid-template-columns: 2rem 1fr;
  gap: 0.625rem;
}
.tux-comment__avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--brand-primary) 12%, transparent);
  color: var(--brand-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  overflow: hidden;
}
.tux-comment__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tux-comment__body {
  min-width: 0;
}
.tux-comment__meta {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  flex-wrap: wrap;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: var(--font-sans);
}
.tux-comment__author {
  color: var(--text-primary);
  font-weight: 600;
}
.tux-comment__affiliation {
  color: var(--text-muted);
}
.tux-comment__time {
  margin-left: 0.25rem;
}
.tux-comment__edited {
  font-style: italic;
}

.tux-comment__text {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-primary);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.tux-comment__mention {
  color: var(--brand-accent);
  font-weight: 600;
}

.tux-comment__actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.375rem;
}

.tux-comment__link {
  background: transparent;
  border: none;
  padding: 0;
  font-size: 0.75rem;
  font-family: var(--font-sans);
  color: var(--text-muted);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
.tux-comment__link:hover {
  color: var(--brand-primary);
  text-decoration: underline;
}
.tux-comment__link-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.tux-comment__edit {
  margin-top: 0.375rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.tux-comment__edit-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.tux-comment__textarea {
  width: 100%;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-primary);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: 0.375rem;
  padding: 0.5rem 0.625rem;
  resize: vertical;
}
.tux-comment__textarea:focus {
  outline: 2px solid var(--brand-primary);
  outline-offset: 1px;
  border-color: var(--brand-primary);
}

.tux-comment__btn {
  background: transparent;
  border: 1px solid var(--surface-border);
  border-radius: 0.375rem;
  padding: 0.3125rem 0.75rem;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--text-primary);
  cursor: pointer;
}
.tux-comment__btn:hover {
  border-color: var(--brand-primary);
}
.tux-comment__btn--primary {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: var(--brand-on-primary, white);
}
.tux-comment__btn--primary:hover {
  background: color-mix(in srgb, var(--brand-primary) 88%, black);
}
.tux-comment__btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tux-comment-thread__footer {
  margin-top: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.875rem;
  border-top: 1px solid var(--surface-border);
}
.tux-comment-thread__footer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
.tux-comment-thread__footer--resolved {
  flex-direction: row;
  justify-content: flex-end;
  border-top: none;
  margin-top: 0;
  padding-top: 0;
}

.tux-comment-thread-list__toggle {
  align-self: flex-start;
  background: transparent;
  border: none;
  padding: 0.25rem 0;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--text-muted);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}
.tux-comment-thread-list__toggle:hover {
  color: var(--brand-primary);
}

.tux-comment-thread-list__empty {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-muted);
  font-style: italic;
}

/* Compact / sidebar density */
.tux-comment-thread-list--sm .tux-comment-thread {
  padding: 0.75rem;
}
.tux-comment-thread-list--sm .tux-comment {
  grid-template-columns: 1.5rem 1fr;
}
.tux-comment-thread-list--sm .tux-comment__avatar {
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.625rem;
}
.tux-comment-thread-list--sm .tux-comment__text {
  font-size: 0.8125rem;
}

@container (max-width: 22rem) {
  .tux-comment {
    grid-template-columns: 1.5rem 1fr;
  }
  .tux-comment__avatar {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.625rem;
  }
}
</style>
