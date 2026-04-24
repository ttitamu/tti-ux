<script setup lang="ts">
/**
 * TuxExample — live demo + code-reveal container for the style guide.
 *
 * Renders the default slot as a framed preview, then a tab strip with:
 *   - Vue       · the template source (passed via `vue` prop)
 *   - HTML      · the rendered DOM, auto-extracted from the preview on mount
 *                 and pretty-printed. Updates on theme swap (MutationObserver).
 *   - Source    · optional — full Tux component SFC (passed via `source` prop)
 *
 * The HTML tab is client-only because `innerHTML` relies on a mounted DOM.
 * During SSR that tab renders a placeholder, so the page still SSRs cleanly
 * for crawlers and then hydrates the HTML view in-browser.
 *
 * Usage:
 *   <tux-example :vue="vueSource">
 *     <tux-alert variant="tip" title="..." />
 *   </tux-example>
 */

interface Props {
  /** The Vue template source to show in the `Vue` tab. Multi-line template
   *  literals recommended; escape `{{ }}` as `{{ '{{ x }}' }}` if needed. */
  vue?: string;
  /** Optional component source SFC to expose in a third `Source` tab. */
  source?: string;
  /** Preview-pane label (small uppercase tag above the demo). */
  title?: string;
  /** Padding inside the preview area. Default "p-6". */
  previewPadding?: string;
}

const props = withDefaults(defineProps<Props>(), {
  previewPadding: "p-6",
});

type Tab = "vue" | "html" | "source";

const activeTab = ref<Tab>("vue");
const previewRef = ref<HTMLElement | null>(null);
const rendered = ref("");
const copied = ref(false);

// Pretty-print HTML by re-indenting on tag boundaries. Not a full formatter —
// it strips whitespace between tags then wraps each tag on its own line with
// depth-based indentation. Good enough for "look at what my component renders."
function formatHTML(html: string): string {
  const stripped = html.replace(/>\s+</g, "><").trim();
  let depth = 0;
  let out = "";
  const tokens = stripped.match(/<[^>]+>|[^<]+/g) || [];
  for (const token of tokens) {
    if (token.startsWith("<")) {
      const isClose = token.startsWith("</");
      const isSelfClose = token.endsWith("/>") || /<(br|img|input|hr|meta|link)\b/i.test(token);
      if (isClose) depth = Math.max(0, depth - 1);
      out += (out ? "\n" : "") + "  ".repeat(depth) + token;
      if (!isClose && !isSelfClose) depth++;
    } else if (token.trim()) {
      out += "\n" + "  ".repeat(depth) + token.trim();
    }
  }
  return out;
}

function captureHTML() {
  if (previewRef.value) {
    rendered.value = formatHTML(previewRef.value.innerHTML);
  }
}

let observer: MutationObserver | null = null;

onMounted(() => {
  captureHTML();
  // Re-extract on theme changes / reactive updates that mutate the preview.
  if (previewRef.value) {
    observer = new MutationObserver(() => captureHTML());
    observer.observe(previewRef.value, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
  }
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

// Auto-reveal the Source tab only when `source` is provided.
const tabs = computed(() => {
  const t: { id: Tab; label: string }[] = [
    { id: "vue", label: "Vue" },
    { id: "html", label: "HTML" },
  ];
  if (props.source) t.push({ id: "source", label: "Source" });
  return t;
});

const activeCode = computed(() => {
  if (activeTab.value === "vue") return props.vue ?? "";
  if (activeTab.value === "html") return rendered.value;
  return props.source ?? "";
});

async function copyActive() {
  if (!activeCode.value) return;
  try {
    await navigator.clipboard.writeText(activeCode.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  } catch {
    // Clipboard API unavailable (e.g. insecure context) — fail silently.
  }
}
</script>

<template>
  <div class="tux-example rounded-md border border-surface-border overflow-hidden">
    <div
      v-if="title"
      class="px-4 py-2 bg-surface-sunken border-b border-surface-border text-xs font-semibold uppercase text-text-secondary"
      style="letter-spacing: var(--tracking-wider)"
    >
      {{ title }}
    </div>

    <div
      ref="previewRef"
      :class="['tux-example__preview bg-surface-raised', previewPadding]"
    >
      <slot />
    </div>

    <div class="flex items-center border-t border-surface-border bg-surface-sunken">
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        class="px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2"
        :class="
          activeTab === t.id
            ? 'text-text-brand border-brand-primary bg-surface-raised'
            : 'text-text-muted hover:text-text-secondary border-transparent'
        "
        @click="activeTab = t.id"
      >
        {{ t.label }}
      </button>
      <div class="flex-1" />
      <button
        type="button"
        class="flex items-center gap-1 px-3 py-2 text-xs text-text-muted hover:text-text-brand"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        @click="copyActive"
      >
        <UIcon
          :name="copied ? 'lucide:check' : 'lucide:copy'"
          class="w-3.5 h-3.5"
        />
        <span>{{ copied ? "Copied" : "Copy" }}</span>
      </button>
    </div>

    <div class="bg-surface-sunken">
      <ClientOnly v-if="activeTab === 'html'">
        <pre class="m-0 p-4 text-xs font-mono overflow-auto max-h-96"><code>{{ rendered || "(awaiting mount)" }}</code></pre>
        <template #fallback>
          <pre class="m-0 p-4 text-xs font-mono text-text-muted">Loading rendered HTML…</pre>
        </template>
      </ClientOnly>
      <pre v-else class="m-0 p-4 text-xs font-mono overflow-auto max-h-96"><code>{{ activeCode }}</code></pre>
    </div>
  </div>
</template>
