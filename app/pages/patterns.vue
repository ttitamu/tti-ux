<script setup lang="ts">
useHead({ title: "Patterns · tti-ux" });

const tableRows = ref<Array<{ id: string; path: string; status: "queued" | "running" | "completed" | "failed"; files: number }>>([]);
const tableLoading = ref(false);

const tableColumns = [
  { accessorKey: "path",   header: "Path" },
  { accessorKey: "files",  header: "Files" },
  { accessorKey: "status", header: "Status" },
];

function simulateLoad() {
  tableLoading.value = true;
  tableRows.value = [];
  setTimeout(() => {
    tableRows.value = [
      { id: "7f5bd95a", path: "/mnt/research/grants/q1",   status: "completed", files: 12402 },
      { id: "a31c7e14", path: "/mnt/research/grants/q2",   status: "running",   files:  3847 },
      { id: "b8e4f921", path: "/mnt/research/datasets/lidar", status: "failed", files:    12 },
    ];
    tableLoading.value = false;
  }, 1500);
}
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="beyond components" title="Patterns">
      Component-level decisions answered: "what does the empty state look like?",
      "what does the page show while data is loading?", "how do we ask for confirmation?".
      These are conventions, not components — borrow and tweak per context.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">no data yet</p>
      <h2 class="heading--bold text-xl font-bold">Empty state</h2>
      <p class="mt-2 max-w-2xl text-sm text-text-secondary">
        Show the user what action gets them to a filled state. Don't just say "No
        results." — tell them what to do next.
      </p>
      <TuxEmptyState
        class="mt-4"
        icon="lucide:folder-search"
        title="No scans yet"
        description="Point PECAN at a directory or S3 bucket and it'll start indexing. You'll see files appear here as classifiers finish running."
      >
        <TuxButton intent="primary" icon="lucide:play">Start your first scan</TuxButton>
      </TuxEmptyState>
    </section>

    <section>
      <p class="eyebrow">waiting for data</p>
      <h2 class="heading--bold text-xl font-bold">Loading skeleton</h2>
      <p class="mt-2 max-w-2xl text-sm text-text-secondary">
        Match the skeleton's shape to the content it's standing in for — rows for
        tables, lines for paragraphs, circles for avatars. Animated via pure CSS
        <code>@keyframes</code>, no JS timer needed.
      </p>
      <div class="mt-4 rounded-md border border-surface-border p-6 space-y-3">
        <div v-for="n in 4" :key="n" class="flex items-center gap-4">
          <div class="skeleton h-4 w-10 rounded" />
          <div class="skeleton h-4 flex-1 rounded" />
          <div class="skeleton h-4 w-20 rounded" />
        </div>
      </div>
    </section>

    <section>
      <p class="eyebrow">interactive</p>
      <h2 class="heading--bold text-xl font-bold">Load → data / empty</h2>
      <p class="mt-2 max-w-2xl text-sm text-text-secondary">
        Same table, three states: empty, loading skeleton, populated. Click the
        button to cycle.
      </p>
      <div class="mt-4 flex gap-2">
        <TuxButton intent="primary" :loading="tableLoading" @click="simulateLoad">
          Reload scans
        </TuxButton>
        <TuxButton intent="ghost" @click="tableRows = []">Clear</TuxButton>
      </div>
      <div class="mt-4">
        <div v-if="tableLoading" class="rounded-md border border-surface-border p-6 space-y-3">
          <div v-for="n in 3" :key="n" class="flex items-center gap-4">
            <div class="skeleton h-4 flex-1 rounded" />
            <div class="skeleton h-4 w-16 rounded" />
            <div class="skeleton h-4 w-20 rounded" />
          </div>
        </div>
        <TuxTable
          v-else-if="tableRows.length"
          :data="tableRows"
          :columns="tableColumns"
          status-accessor="status"
        />
        <TuxEmptyState
          v-else
          icon="lucide:inbox"
          title="No scans yet"
          description="Reload to populate."
        />
      </div>
    </section>

    <section>
      <p class="eyebrow">destructive</p>
      <h2 class="heading--bold text-xl font-bold">Confirmation flow</h2>
      <p class="mt-2 max-w-2xl text-sm text-text-secondary">
        For destructive actions (delete, revoke, purge) — always double-gate.
        The trigger lives in the table row / detail header; the confirmation
        uses a <code>TuxModal</code> with an explicit consequence statement.
        See <NuxtLink class="link-tti" to="/components/modal">TuxModal</NuxtLink>
        for a live demo.
      </p>
    </section>

    <section>
      <p class="eyebrow">inline feedback</p>
      <h2 class="heading--bold text-xl font-bold">Admonition stack</h2>
      <p class="mt-2 max-w-2xl text-sm text-text-secondary">
        Use <code>TuxAlert</code> inline above a form or between sections. Avoid
        toasts for anything the user needs to read — toasts disappear.
      </p>
      <div class="mt-4 space-y-3">
        <TuxAlert
          variant="important"
          title="Scheduled maintenance · Thursday 2am–4am"
          description="OpenSearch will be offline for a patch window. Queue any scans you need to run before 1am."
        />
        <TuxAlert
          variant="compliance"
          title="Export controlled"
          description="This index contains ITAR-designated records. Do not share outside TAMUS."
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Shimmer skeleton — pure CSS, GPU-cheap. Runs on the background stripe so it
   doesn't thrash layout. */
.skeleton {
  background:
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--surface-sunken) 70%, transparent) 0%,
      color-mix(in srgb, var(--surface-border) 60%, transparent) 50%,
      color-mix(in srgb, var(--surface-sunken) 70%, transparent) 100%
    );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
