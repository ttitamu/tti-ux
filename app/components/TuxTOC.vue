<script setup lang="ts">
// TuxTOC — article table-of-contents.
//
// Right-rail sticky list of headings on the current article. Auto-
// detects H2/H3 in a target element on mount, sets up an
// IntersectionObserver to track which heading is currently in view,
// and underlines that entry. Click a TOC entry to scroll to it.
//
// Two ways to populate:
//   - explicit `items` prop — pass a parsed AST or hand-curated list
//   - auto-detect — leave `items` empty and pass `target` (default
//     "main article") to scan the DOM at mount + watch for changes
//
// Sticky positioning is managed by the consumer's layout. This
// component just provides the list + active-state machinery.

interface TocItem {
  /** Anchor id — the `id` on the heading the entry links to. */
  id: string;
  /** Visible label. */
  label: string;
  /** Heading depth (2 for h2, 3 for h3). */
  depth: number;
}

interface Props {
  /** Pre-built items list. Skip auto-detect when provided. */
  items?: TocItem[];
  /** CSS selector for the article body. Defaults to `article`. */
  target?: string;
  /** Heading levels to include. Defaults to `[2, 3]`. */
  levels?: number[];
  /** Title above the list. */
  title?: string;
  /** Hide the title (useful when the consumer wraps in their own header). */
  noTitle?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  items: undefined,
  target: "article",
  levels: () => [2, 3],
  title: "On this page",
  noTitle: false,
});

const detectedItems = ref<TocItem[]>([]);
const items = computed(() => props.items ?? detectedItems.value);

const activeId = ref<string | null>(null);

let observer: IntersectionObserver | null = null;

function detect() {
  if (typeof document === "undefined") return;
  const article = document.querySelector(props.target);
  if (!article) return;

  const sel = props.levels.map(l => `h${l}`).join(",");
  const headings = article.querySelectorAll<HTMLHeadingElement>(sel);
  const out: TocItem[] = [];

  headings.forEach((h) => {
    if (!h.id) {
      // Generate a stable id from text content. Skip if the consumer
      // already has anchor wiring — only fill in when missing.
      h.id = h.textContent?.trim().toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        ?? "";
    }
    if (!h.id) return;
    out.push({
      id: h.id,
      label: h.textContent?.trim() ?? "",
      depth: parseInt(h.tagName.slice(1), 10),
    });
  });

  detectedItems.value = out;
}

function setupObserver() {
  if (typeof IntersectionObserver === "undefined") return;
  observer?.disconnect();

  observer = new IntersectionObserver(
    (entries) => {
      // Pick the topmost heading currently in the viewport. Falls
      // back to the last-passed heading if none are intersecting.
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length > 0) {
        const top = visible.sort((a, b) =>
          a.boundingClientRect.top - b.boundingClientRect.top
        )[0];
        activeId.value = top?.target.id ?? null;
      }
    },
    {
      // Margins: top edge starts ~80px below the viewport (offset for
      // sticky headers); bottom edge at 60% of viewport height. So a
      // heading "becomes active" once it enters the upper-middle band.
      rootMargin: "-80px 0px -40% 0px",
      threshold: 0,
    }
  );

  for (const item of items.value) {
    const el = document.getElementById(item.id);
    if (el) observer.observe(el);
  }
}

function scrollToId(e: Event, id: string) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  // Update the URL hash without a full navigation.
  if (typeof history !== "undefined") {
    history.replaceState(null, "", `#${id}`);
  }
}

onMounted(() => {
  if (!props.items) {
    detect();
    // Re-detect when content changes (e.g. MDC finished hydrating
    // its component children inside the article).
    nextTick(() => setupObserver());
  } else {
    setupObserver();
  }
});

watch(items, () => setupObserver());

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<template>
  <nav v-if="items.length > 0" class="tux-toc" :aria-label="title">
    <p v-if="!noTitle" class="tux-toc__title">{{ title }}</p>
    <ol class="tux-toc__list">
      <li
        v-for="item in items"
        :key="item.id"
        class="tux-toc__item"
        :class="`tux-toc__item--depth-${item.depth}`"
      >
        <a
          :href="`#${item.id}`"
          class="tux-toc__link"
          :class="{ 'tux-toc__link--active': activeId === item.id }"
          @click="(e) => scrollToId(e, item.id)"
        >{{ item.label }}</a>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.tux-toc {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  width: 100%;
  max-width: 14rem;
}

.tux-toc__title {
  margin: 0 0 0.625rem;
  padding-bottom: 0.4375rem;
  border-bottom: 1px solid var(--surface-border);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-muted);
}

.tux-toc__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tux-toc__item {
  margin: 0;
}

.tux-toc__item--depth-2 { padding-left: 0; }
.tux-toc__item--depth-3 { padding-left: 0.875rem; }
.tux-toc__item--depth-4 { padding-left: 1.75rem; }

.tux-toc__link {
  display: block;
  padding: 0.25rem 0 0.25rem 0.625rem;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--text-muted);
  text-decoration: none;
  border-left: 2px solid transparent;
  margin-left: -2px;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.tux-toc__link:hover,
.tux-toc__link:focus-visible {
  color: var(--text-primary);
  outline: none;
}

.tux-toc__link--active {
  color: var(--brand-primary);
  font-weight: 600;
  border-left-color: var(--brand-primary);
}
</style>
