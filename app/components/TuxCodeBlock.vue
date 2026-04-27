<script setup lang="ts">
import type { BundledLanguage, BundledTheme } from "shiki";

// TuxCodeBlock — standalone Shiki-backed code block.
//
// For docs, blog posts, ADRs, anywhere users want to embed a code
// sample outside the component-demo flow (`TuxExample` covers that).
// Supports any Shiki-bundled language.
//
// **Highlighting runs at SSR time** via `useTuxHighlighter` — a
// singleton highlighter shared across every TuxCodeBlock and
// TuxExample on the page. The initial document ships with already-
// colored HTML; no flash of unhighlighted code on first paint.
// Re-highlighting on color-mode change happens client-side.

interface Props {
  /** Source code as a string. Required. */
  code: string;
  /** Shiki language id — `ts`, `python`, `bash`, `json`, `vue`, etc.
   *  Falls back to `text` (no highlighting) for unknown langs. */
  lang?: BundledLanguage | "text";
  /** Optional caption — typically a filename like
   *  `app/components/TuxButton.vue` or `pecan/agent.py:42`. */
  filename?: string;
  /** Show 1-indexed line numbers in the gutter. */
  lineNumbers?: boolean;
  /** Hide the copy button. */
  noCopy?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  lang: "text",
  filename: undefined,
  lineNumbers: false,
  noCopy: false,
});

const colorMode = useColorMode();
const { highlight } = useTuxHighlighter();
const copied = ref(false);

const shikiTheme = computed<BundledTheme>(() => {
  if (colorMode.value === "tti-dark") return "github-dark";
  if (colorMode.value === "tti-hc")   return "github-light-high-contrast";
  return "github-light";
});

// Highlight at SSR time + re-run when props/theme change. useAsyncData
// dedupes the work across hydration so the initial paint is already
// colored.
const cacheKey = computed(() =>
  `tux-codeblock:${props.lang}:${shikiTheme.value}:${hashCode(props.code)}`
);

const { data: highlightedCode } = await useAsyncData(
  cacheKey.value,
  () => highlight(props.code, { lang: props.lang, theme: shikiTheme.value }),
  { watch: [() => props.code, () => props.lang, shikiTheme] },
);

function hashCode(s: string): string {
  // Tiny deterministic hash — only keys the asyncData cache. A
  // collision just causes a re-highlight; correctness never depends
  // on it.
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h.toString(36);
}

// Defensive fallback — only rendered if highlighter is somehow null
// (Shiki crashed during SSR). In practice, useAsyncData should always
// resolve to a string by paint time.
const lines = computed(() => props.code.split("\n"));

async function copy() {
  if (typeof navigator === "undefined" || !navigator.clipboard) return;
  await navigator.clipboard.writeText(props.code);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}
</script>

<template>
  <figure class="tux-codeblock" :class="{ 'tux-codeblock--with-lines': lineNumbers }">
    <figcaption v-if="filename" class="tux-codeblock__caption">
      <span class="tux-codeblock__filename">{{ filename }}</span>
      <span v-if="lang !== 'text'" class="tux-codeblock__lang">{{ lang }}</span>
    </figcaption>

    <div class="tux-codeblock__body">
      <button
        v-if="!noCopy"
        type="button"
        class="tux-codeblock__copy"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        @click="copy"
      >
        <Icon
          :name="copied ? 'lucide:check' : 'lucide:copy'"
          class="tux-codeblock__copy-icon"
        />
        <span>{{ copied ? "Copied" : "Copy" }}</span>
      </button>

      <!-- Highlighted output once Shiki has loaded -->
      <div
        v-if="highlightedCode"
        class="tux-codeblock__rendered"
        v-html="highlightedCode"
      />

      <!-- Line-numbered fallback (or text-mode source) -->
      <pre v-else class="tux-codeblock__fallback"><code><span
        v-for="(line, i) in lines"
        :key="i"
        class="tux-codeblock__line"
      ><span
        v-if="lineNumbers"
        class="tux-codeblock__line-no"
        aria-hidden="true"
      >{{ i + 1 }}</span><span>{{ line }}
</span></span></code></pre>
    </div>
  </figure>
</template>

<style scoped>
.tux-codeblock {
  container-type: inline-size;
  container-name: tux-codeblock;
  margin: 1.25rem 0;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  overflow: hidden;
}

.tux-codeblock__caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0.875rem;
  background: var(--surface-sunken);
  border-bottom: 1px solid var(--surface-border);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.tux-codeblock__filename {
  color: var(--text-secondary);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.tux-codeblock__lang {
  flex-shrink: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--brand-primary);
}

.tux-codeblock__body {
  position: relative;
}

.tux-codeblock__copy {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  font-family: var(--font-bold);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s ease, color 0.15s ease;
}

.tux-codeblock:hover .tux-codeblock__copy,
.tux-codeblock:focus-within .tux-codeblock__copy,
.tux-codeblock__copy:focus-visible {
  opacity: 1;
}

.tux-codeblock__copy:hover {
  color: var(--brand-primary);
  border-color: color-mix(in srgb, var(--brand-primary) 40%, var(--surface-border));
}

.tux-codeblock__copy-icon {
  width: 0.8125rem;
  height: 0.8125rem;
}

/* Shiki-rendered output. The `:deep(pre)` reaches into the
   highlighter's HTML to apply our padding/scroll/font conventions. */
.tux-codeblock__rendered :deep(pre) {
  margin: 0;
  padding: 1rem 1.125rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.6;
  overflow-x: auto;
}

.tux-codeblock__rendered :deep(code) {
  font-family: var(--font-mono);
}

/* Plain-text / pre-Shiki fallback */
.tux-codeblock__fallback {
  margin: 0;
  padding: 1rem 1.125rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--text-primary);
  overflow-x: auto;
  background: transparent;
}

.tux-codeblock__line {
  display: block;
  white-space: pre;
}

.tux-codeblock__line-no {
  display: inline-block;
  width: 2.5rem;
  margin-right: 1rem;
  text-align: right;
  color: var(--text-muted);
  user-select: none;
  font-variant-numeric: tabular-nums;
}

/* Line-numbered Shiki output — apply gutter via deep selector. */
.tux-codeblock--with-lines .tux-codeblock__rendered :deep(pre code) {
  counter-reset: tux-line;
}

.tux-codeblock--with-lines .tux-codeblock__rendered :deep(.line) {
  counter-increment: tux-line;
}

.tux-codeblock--with-lines .tux-codeblock__rendered :deep(.line)::before {
  content: counter(tux-line);
  display: inline-block;
  width: 2.25rem;
  margin-right: 1rem;
  text-align: right;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
</style>
