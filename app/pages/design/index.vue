<script setup lang="ts">
useHead({ title: "Design docs · TUX" });

// Same Vite glob trick — discover the docs at build time.
const docs = import.meta.glob("../../../design/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

interface DocEntry {
  slug: string;
  title: string;
  blurb: string;
  excerpt: string;
}

const titleMap: Record<string, { title: string; blurb: string }> = {
  tux: {
    title: "tux — design system",
    blurb: "Principles, stack, signature moves, theme variants, four-family typography rule, three section styles. Read first.",
  },
  components: {
    title: "Components doctrine",
    blurb: "What ships today, the pattern-coverage map (\"want X? use Y\"), and the guidance for adding a new component.",
  },
  palette: {
    title: "Palette + visual identity",
    blurb: "TTI palette reconciliation across PPTX/PDF sources, visual identity cues to preserve, relationship to TAMUS.",
  },
};

const entries = computed<DocEntry[]>(() => {
  return Object.entries(docs)
    .map(([path, content]) => {
      const slug = path.split("/").pop()?.replace(/\.md$/, "") ?? "";
      const meta = titleMap[slug] ?? { title: slug, blurb: "" };
      // Pull the first paragraph after the H1 as a short excerpt.
      const excerpt = content
        .replace(/^---[\s\S]*?---\s*/m, "")  // strip frontmatter
        .replace(/^#[^\n]*\n+/m, "")         // strip first H1
        .split("\n\n")[0]
        ?.replace(/\*\*/g, "")
        .slice(0, 240) ?? "";
      return { slug, title: meta.title, blurb: meta.blurb, excerpt };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
});
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="reference" title="Design docs">
      The long-form docs that live behind the component catalog.
      Source of truth for principles, palette reconciliation, and the
      pattern-coverage map. Authored as markdown in
      <code>design/</code>, rendered here via MDC. To edit one, open
      the file on GitHub from any doc's footer.
    </TuxPageHeader>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TuxCard v-for="d in entries" :key="d.slug" :to="`/design/${d.slug}`">
        <p class="eyebrow">{{ d.slug }}.md</p>
        <h3 class="text-xl font-bold">{{ d.title }}</h3>
        <p v-if="d.blurb" class="mt-2 text-sm text-text-secondary">{{ d.blurb }}</p>
      </TuxCard>
    </section>
  </div>
</template>
