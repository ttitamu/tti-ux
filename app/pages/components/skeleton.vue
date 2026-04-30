<script setup lang="ts">
useHead({ title: "TuxSkeleton · TUX" });

const primitiveVue = `<tux-skeleton width="14rem" height="1rem" />
<tux-skeleton variant="circle" width="2.5rem" />
<tux-skeleton variant="text" width="22ch" />`;

const cardVue = `<tux-skeleton kind="card" />`;
const listVue = `<tux-skeleton kind="list" :count="5" />`;
const tableVue = `<tux-skeleton kind="table" :count="4" />`;
const articleVue = `<tux-skeleton kind="article" :count="6" />`;
const statVue = `<tux-skeleton kind="stat" />`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="status states" title="TuxSkeleton">
      Placeholder shapes for loading states. Use as a primitive
      (<code>width</code> / <code>height</code> / <code>variant</code>)
      or via a <code>kind</code> preset (<code>card</code>,
      <code>list</code>, <code>table</code>, <code>article</code>,
      <code>media</code>, <code>stat</code>) for a composed shape.
      <br><br>
      <span class="text-sm text-text-muted">
        Honors <code>prefers-reduced-motion</code> automatically — the
        shimmer collapses to a static tint. Pass <code>animated="pulse"</code>
        for opacity-only animation in dense lists, or
        <code>animated="never"</code> to opt out entirely.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">primitive</p>
      <h2 class="heading--bold text-xl font-bold">Variant + size control</h2>
      <TuxExample class="mt-4" :vue="primitiveVue">
        <div class="flex items-center gap-6">
          <TuxSkeleton width="14rem" height="1rem" />
          <TuxSkeleton variant="circle" width="2.5rem" />
          <TuxSkeleton variant="text" width="22ch" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">presets</p>
      <h2 class="heading--bold text-xl font-bold">Six composed shapes</h2>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <TuxExample :vue="cardVue">
          <div class="card-static p-4 max-w-md">
            <TuxSkeleton kind="card" />
          </div>
        </TuxExample>
        <TuxExample :vue="listVue">
          <div class="card-static p-4 max-w-md">
            <TuxSkeleton kind="list" :count="4" />
          </div>
        </TuxExample>
        <TuxExample :vue="tableVue">
          <div class="card-static p-4">
            <TuxSkeleton kind="table" :count="4" />
          </div>
        </TuxExample>
        <TuxExample :vue="articleVue">
          <div class="card-static p-4">
            <TuxSkeleton kind="article" :count="5" />
          </div>
        </TuxExample>
        <TuxExample :vue="statVue">
          <div class="card-static p-4">
            <TuxSkeleton kind="stat" />
          </div>
        </TuxExample>
      </div>
    </section>

    <section>
      <p class="eyebrow">animation modes</p>
      <h2 class="heading--bold text-xl font-bold">Shimmer · pulse · never</h2>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card-static p-4">
          <p class="eyebrow mb-2">shimmer (default)</p>
          <TuxSkeleton kind="card" animated="shimmer" />
        </div>
        <div class="card-static p-4">
          <p class="eyebrow mb-2">pulse</p>
          <TuxSkeleton kind="card" animated="pulse" />
        </div>
        <div class="card-static p-4">
          <p class="eyebrow mb-2">never</p>
          <TuxSkeleton kind="card" animated="never" />
        </div>
      </div>
    </section>

    <section>
      <p class="eyebrow">accessibility</p>
      <h2 class="heading--bold text-lg font-bold">Announced as a status region</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Each skeleton is wrapped in <code>role="status"</code> with
        <code>aria-live="polite"</code> and an SR-only "Loading…"
        label. Override via the <code>label</code> prop for surface-
        specific copy (e.g. <code>label="Loading conversation history…"</code>).
        The decorative shapes themselves are <code>aria-hidden</code>.
      </p>
    </section>
  </div>
</template>
