<script setup lang="ts">
// Renders any design/*.md file as a navigable page. Markdown is
// imported as raw text at build time (via Vite's ?raw query) so SSR
// has the content and MDC handles the rendering. Adding a new design
// doc just needs a file in design/ — no route changes.

const route = useRoute();
const docName = computed(() => String(route.params.doc));

// Eager-glob so SSR has all docs at hand; bundle cost is negligible
// (few KB of markdown). Switch to lazy if the design dir grows.
const docs = import.meta.glob("../../../design/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Map slug → file content. Vite's import paths are absolute-ish; we
// normalize to just the filename stem.
const docMap = computed(() => {
  const out: Record<string, string> = {};
  for (const [path, content] of Object.entries(docs)) {
    const stem = path.split("/").pop()?.replace(/\.md$/, "");
    if (stem) out[stem] = content;
  }
  return out;
});

const source = computed(() => docMap.value[docName.value] ?? null);

const titles: Record<string, string> = {
  tux:        "tux — design system",
  components: "Components doctrine",
  palette:    "Palette + visual identity",
};

function titleFor(slug: string): string {
  return titles[slug] ?? slug;
}

useHead({
  title: computed(() => `${titleFor(docName.value)} · TUX`),
});

// 404 if the slug doesn't match a design doc.
if (!source.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `No design doc named "${docName.value}"`,
  });
}

// Parse at SSR time so fenced code blocks ship pre-highlighted via
// the Shiki pipeline configured in nuxt.config.ts. The runtime
// `<MDC :value>` shortcut would render code blocks as plain <pre>;
// this path uses the same parser the build-time pipeline does.
const { data: parsed } = await useAsyncData(
  () => `design-doc:${docName.value}`,
  () => parseMarkdown(source.value!),
  { watch: [source] },
);

// Sibling doc surround — prev / next at article bottom, mirroring
// Nuxt UI's ContentSurround pattern. Sorted slugs make the order
// stable; the current doc is excluded.
const sortedSlugs = computed(() =>
  Object.keys(docMap.value).sort(),
);

const surround = computed(() => {
  const slugs = sortedSlugs.value;
  const idx = slugs.indexOf(docName.value);
  return {
    prev: idx > 0 ? slugs[idx - 1] : null,
    next: idx >= 0 && idx < slugs.length - 1 ? slugs[idx + 1] : null,
  };
});

const otherDocs = computed(() =>
  sortedSlugs.value.filter(s => s !== docName.value),
);
</script>

<template>
  <div class="space-y-8">
    <TuxBreadcrumbs
      :trail="[
        { label: 'Home',   to: '/' },
        { label: 'Design', to: '/design' },
        { label: titleFor(docName) },
      ]"
    />

    <TuxProse>
      <MDCRenderer
        v-if="parsed"
        :body="parsed.body"
        :data="parsed.data"
      />
    </TuxProse>

    <!-- Prev / next surround — same idiom as Nuxt UI's ContentSurround.
         Anchored at article bottom for long-form reading flow. -->
    <nav
      v-if="surround.prev || surround.next"
      class="tux-doc-surround"
      aria-label="Adjacent design docs"
    >
      <NuxtLink
        v-if="surround.prev"
        :to="`/design/${surround.prev}`"
        class="tux-doc-surround__link tux-doc-surround__link--prev"
        data-tux-elevation="rest"
      >
        <span class="eyebrow tux-doc-surround__eyebrow">
          <Icon name="lucide:arrow-left" aria-hidden="true" class="w-3 h-3" />
          previous
        </span>
        <span class="tux-doc-surround__title">{{ titleFor(surround.prev) }}</span>
      </NuxtLink>
      <span v-else class="tux-doc-surround__spacer" />

      <NuxtLink
        v-if="surround.next"
        :to="`/design/${surround.next}`"
        class="tux-doc-surround__link tux-doc-surround__link--next"
        data-tux-elevation="rest"
      >
        <span class="eyebrow tux-doc-surround__eyebrow">
          next
          <Icon name="lucide:arrow-right" aria-hidden="true" class="w-3 h-3" />
        </span>
        <span class="tux-doc-surround__title">{{ titleFor(surround.next) }}</span>
      </NuxtLink>
    </nav>

    <aside class="border-t border-surface-border pt-6">
      <p class="eyebrow">other design docs</p>
      <ul class="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        <li v-for="d in otherDocs" :key="d">
          <NuxtLink :to="`/design/${d}`" class="link-tti">{{ d }}.md</NuxtLink>
        </li>
        <li>
          <a
            :href="`https://github.com/ttitamu/tti-ux/blob/main/design/${docName}.md`"
            target="_blank"
            rel="noopener"
            class="link-tti"
          >view on github ↗</a>
        </li>
      </ul>
    </aside>
  </div>
</template>

<style scoped>
.tux-doc-surround {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 2.5rem;
}

.tux-doc-surround__link {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.875rem 1rem;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-primary);
}

.tux-doc-surround__link:hover {
  border-color: var(--brand-primary);
  transform: translateY(-1px);
}

.tux-doc-surround__link--next {
  text-align: right;
  align-items: flex-end;
}

.tux-doc-surround__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0;
  color: var(--text-muted);
}

.tux-doc-surround__title {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.9375rem;
  line-height: 1.3;
}

.tux-doc-surround__spacer {
  /* Empty grid cell to keep "next" right-aligned when there's no prev. */
}
</style>
