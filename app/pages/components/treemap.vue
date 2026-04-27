<script setup lang="ts">
useHead({ title: "TuxTreemap · tti-ux" });

// Mock PECAN-style filesystem tree — sizes in bytes for the byte formatter.
const data = {
  name: "/research",
  children: [
    {
      name: "grants",
      children: [
        { name: "nsf-1234",   size: 4_200_000_000 },
        { name: "txdot-78",   size: 1_800_000_000 },
        { name: "fhwa-2024",  size: 950_000_000 },
        { name: "doe-csp",    size: 320_000_000 },
      ],
    },
    {
      name: "publications",
      children: [
        { name: "2025",  size: 1_400_000_000 },
        { name: "2024",  size: 1_100_000_000 },
        { name: "2023",  size: 880_000_000 },
        { name: "older", size: 240_000_000 },
      ],
    },
    {
      name: "movementlab",
      children: [
        { name: "raw-corridor-feeds", size: 8_400_000_000 },
        { name: "processed",          size: 2_100_000_000 },
        { name: "exports",            size: 540_000_000 },
      ],
    },
    {
      name: "field-photos",
      children: [
        { name: "site-04", size: 380_000_000 },
        { name: "site-07", size: 290_000_000 },
        { name: "site-09", size: 180_000_000 },
      ],
    },
    {
      name: "code",
      children: [
        { name: "pecan",        size: 240_000_000 },
        { name: "movementlab",  size: 180_000_000 },
        { name: "tti-ai-studio", size: 92_000_000 },
        { name: "tools",        size: 48_000_000 },
      ],
    },
    { name: "scratch", size: 320_000_000 },
  ],
};

const exampleVue = `<TuxTreemap :data="data" :max-depth="2" color-by="size" />`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxTreemap">
      Squarified hierarchical-size visualization. PECAN's headline viz —
      replaces diskover's D3 v3 treemap. Self-contained SVG (no external
      viz library), implements the Bruls-Huijsen-van Wijk squarified
      algorithm so cells stay near-square at every level, which is what
      makes large hierarchies readable. Click a cell to drill in;
      breadcrumb to zoom out.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Filesystem · 2-deep</h2>
      <p class="text-sm text-text-secondary mb-3">
        Hover a cell for path + size + child count. Click any aggregate
        with children to drill in. Maroon ramp colors by size (log-scaled,
        because file-size distributions are heavy-tailed).
      </p>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxTreemap :data="data" :max-depth="2" color-by="size" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">depth coloring</p>
      <h2 class="heading--bold text-xl font-bold">Color by depth instead of size</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>color-by="depth"</code> when the visual story is about
        hierarchy levels rather than absolute size. Useful for showing
        nested folder structure where every level matters equally.
      </p>
      <TuxExample class="mt-4">
        <TuxTreemap :data="data" :max-depth="2" color-by="depth" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">single-level</p>
      <h2 class="heading--bold text-xl font-bold">Flat treemap (max-depth=1)</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>:max-depth="1"</code> for a flat one-level treemap —
        useful for top-level overviews where you don't want the eye
        distracted by sub-hierarchies.
      </p>
      <TuxExample class="mt-4">
        <TuxTreemap :data="data" :max-depth="1" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + data shape</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>data</code> — recursive <code>{ name, size?, children? }</code>. Required.</li>
        <li><code>maxDepth</code> — render depth before showing aggregate cells. Defaults to <code>2</code>.</li>
        <li><code>colorBy</code> — <code>"size" | "depth"</code>. Defaults to <code>"size"</code>.</li>
        <li><code>unit</code> — <code>"bytes" | "count" | "percent"</code>. Sets the size formatter.</li>
        <li><code>width</code> + <code>height</code> — SVG viewBox dimensions (component renders responsive).</li>
      </ul>
    </section>

    <section>
      <p class="eyebrow">algorithm</p>
      <h2 class="heading--bold text-xl font-bold">Why squarified</h2>
      <p class="max-w-3xl text-sm text-text-secondary leading-relaxed">
        Naive treemaps (slice-and-dice) produce strip-shaped cells that get
        unreadable as the dataset grows. The squarified algorithm
        (<a href="https://www.win.tue.nl/~vanwijk/stm.pdf" class="link-tti" target="_blank" rel="noopener">Bruls et al., 1999</a>)
        chooses each row's contents to minimize the worst aspect ratio —
        the result is cells that stay near-square, which keeps labels
        readable and area perception accurate. This is the algorithm D3,
        ECharts, and Tableau all use. We implement it directly in ~80
        lines of Vue so we don't take a viz-library dependency just for
        this one chart.
      </p>
    </section>
  </div>
</template>
