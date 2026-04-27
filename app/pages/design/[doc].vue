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

useHead({
  title: computed(() => `${titles[docName.value] ?? docName.value} · tti-ux`),
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

const otherDocs = computed(() =>
  Object.keys(docMap.value)
    .filter(s => s !== docName.value)
    .sort()
);
</script>

<template>
  <div class="space-y-8">
    <TuxBreadcrumbs
      :trail="[
        { label: 'Home',   to: '/' },
        { label: 'Design', to: '/design' },
        { label: titles[docName] ?? docName },
      ]"
    />

    <article class="prose-tux">
      <MDCRenderer
        v-if="parsed"
        :body="parsed.body"
        :data="parsed.data"
      />
    </article>

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
.prose-tux :deep(h1) {
  font-family: var(--font-display);
  font-size: clamp(1.875rem, 1.4rem + 2cqi, 2.5rem);
  line-height: 1.1;
  margin: 0 0 1.5rem;
  color: var(--text-primary);
  letter-spacing: -0.005em;
}

.prose-tux :deep(h2) {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1.375rem;
  line-height: 1.25;
  margin: 2.5rem 0 0.875rem;
  color: var(--text-primary);
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--brand-primary);
}

.prose-tux :deep(h3) {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1.125rem;
  margin: 1.75rem 0 0.625rem;
  color: var(--text-primary);
}

.prose-tux :deep(p) {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.75;
  color: var(--text-secondary);
  margin: 0 0 1rem;
}

.prose-tux :deep(ul),
.prose-tux :deep(ol) {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.75;
  color: var(--text-secondary);
  padding-left: 1.5rem;
  margin: 0 0 1rem;
}

.prose-tux :deep(li) {
  margin: 0.375rem 0;
}

.prose-tux :deep(strong) {
  font-weight: 700;
  color: var(--text-primary);
}

.prose-tux :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  background: var(--surface-sunken);
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-sm);
  color: var(--brand-primary);
}

.prose-tux :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.25rem 0;
  font-size: 0.875rem;
  font-family: var(--font-body);
}

.prose-tux :deep(th) {
  text-align: left;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  padding: 0.625rem 0.875rem;
  border-bottom: 2px solid var(--brand-primary);
  background: var(--surface-sunken);
}

.prose-tux :deep(td) {
  padding: 0.625rem 0.875rem;
  border-bottom: 1px solid var(--surface-border);
  vertical-align: top;
}

.prose-tux :deep(td code) {
  font-size: 0.75rem;
}

.prose-tux :deep(pre) {
  margin: 1.25rem 0;
  padding: 1rem 1.125rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.6;
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow-x: auto;
}

.prose-tux :deep(pre code) {
  background: transparent;
  padding: 0;
  color: var(--text-primary);
}

.prose-tux :deep(a) {
  color: var(--brand-secondary);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: color-mix(in srgb, var(--brand-secondary) 40%, transparent);
}

.prose-tux :deep(hr) {
  border: 0;
  border-top: 1px solid var(--surface-border);
  margin: 2rem 0;
}

.prose-tux :deep(blockquote) {
  margin: 1.25rem 0;
  padding-left: 1.25rem;
  border-left: 3px solid var(--brand-primary);
  font-style: italic;
  color: var(--text-secondary);
}
</style>
