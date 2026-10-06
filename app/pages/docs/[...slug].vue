<script setup lang="ts">
// /docs/[...slug] — renders any docs/**/*.md file as a navigable page.
// Imports all markdown in docs/ as raw text via Vite's eager glob,
// parsed at SSR via parseMarkdown with remark-md-links.

const route = useRoute();
const slugParam = computed(() => {
  const p = route.params.slug;
  if (Array.isArray(p)) return p.join("/");
  return String(p || "");
});

// Eager-glob all docs markdown
const docs = import.meta.glob("../../../docs/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Map relative path -> content
// e.g. "adr/0012-cross-framework-distribution-via-web-components" -> content
// e.g. "adr" -> content of adr/README.md
const docMap = computed(() => {
  const out: Record<string, string> = {};
  for (const [path, content] of Object.entries(docs)) {
    // path looks like "../../../docs/adr/0012-....md"
    const rel = path.replace(/^(\.\.\/)+docs\//, "").replace(/\.md$/, "");
    out[rel] = content;
    if (rel.endsWith("/README")) {
      const base = rel.replace(/\/README$/, "");
      out[base] = content;
    }
  }
  return out;
});

const currentSlug = computed(() => {
  const s = slugParam.value.replace(/\/$/, "");
  return s || "adr/README";
});

const source = computed(() => docMap.value[currentSlug.value] ?? null);

if (!source.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `No document found at "${currentSlug.value}"`,
  });
}

const pageTitle = computed(() => {
  if (!source.value) return "Docs";
  const firstHeading = source.value.match(/^#\s+(.+)$/m);
  if (firstHeading) return firstHeading[1].trim();
  return currentSlug.value.split("/").pop() || "Docs";
});

useHead({
  title: computed(() => `${pageTitle.value} · TUX Docs`),
});

const { data: parsed } = await useAsyncData(
  () => `doc-page:${currentSlug.value}`,
  () => parseMarkdown(source.value!, {
    remark: {
      plugins: {
        "remark-md-links": {
          options: { currentPath: `docs/${currentSlug.value}.md` },
        },
      },
    },
  }),
  { watch: [source] },
);

const crumbs = computed(() => {
  const parts = currentSlug.value.split("/").filter(Boolean);
  const items = [
    { label: "Home", to: "/" },
    { label: "Docs", to: "/docs/adr" },
  ];
  let accumulated = "/docs";
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    accumulated += `/${part}`;
    const isLast = i === parts.length - 1;
    items.push({
      label: isLast ? pageTitle.value : part.toUpperCase(),
      to: isLast ? undefined : accumulated,
    });
  }
  return items;
});
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <TuxBreadcrumbs :trail="crumbs" />
      <TuxDocSearch class="sm:max-w-xs" />
    </div>

    <div class="xl:grid xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_340px] gap-10 xl:gap-12 2xl:gap-16 items-start">
      <div class="space-y-8 min-w-0">
        <TuxStalenessBanner
          :verified-until="parsed?.data?.verifiedUntil"
          :last-verified="parsed?.data?.lastVerified || parsed?.data?.date"
          :review-cadence-days="parsed?.data?.reviewCadenceDays"
          :owner="parsed?.data?.owner || parsed?.data?.author"
          :page-id="currentSlug"
        />

        <article>
          <TuxProse>
            <MDCRenderer
              v-if="parsed?.body"
              :body="parsed.body"
              :data="parsed.data"
            />
          </TuxProse>
        </article>

        <TuxFeedback
          :page-id="`docs:${currentSlug}`"
        />
      </div>

      <!-- Right-rail sticky Table of Contents -->
      <aside class="hidden xl:block sticky top-20">
        <TuxTOC target="article" />
      </aside>
    </div>
  </div>
</template>
