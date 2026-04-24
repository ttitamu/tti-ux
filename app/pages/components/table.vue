<script setup lang="ts">
useHead({ title: "TuxTable · tti-ux" });

interface Scan {
  id: string;
  path: string;
  status: "queued" | "running" | "completed" | "failed";
  files: number;
  started: string;
}

const scans: Scan[] = [
  { id: "7f5bd95a", path: "/mnt/research/grants/q1",     status: "completed", files: 12402, started: "2026-04-22 09:14" },
  { id: "a31c7e14", path: "/mnt/research/grants/q2",     status: "running",   files:  3847, started: "2026-04-24 11:02" },
  { id: "b8e4f921", path: "/mnt/research/datasets/lidar", status: "failed",    files:    12, started: "2026-04-24 10:47" },
  { id: "c2d0a3b5", path: "/mnt/research/datasets/traffic", status: "queued",  files:     0, started: "—" },
];

const columns = [
  { accessorKey: "path",    header: "Path" },
  { accessorKey: "files",   header: "Files" },
  { accessorKey: "status",  header: "Status" },
  { accessorKey: "started", header: "Started" },
];
</script>

<template>
  <div class="space-y-10">
    <section>
      <p class="eyebrow">component</p>
      <h1 class="heading--bold text-3xl font-bold">TuxTable</h1>
      <p class="mt-3 max-w-2xl text-text-secondary">
        Wraps <code>UTable</code>. Adds the maroon-wash header, uppercase tracked
        labels, brand-tinted row hover, and a rounded card frame. Body cells default
        to <code>font-mono</code> because most of what lands in our tables is paths
        and IDs — override per-column with a <code>#{column}-cell</code> slot.
      </p>
    </section>

    <section>
      <p class="eyebrow">auto status cell</p>
      <h2 class="heading--bold text-xl font-bold">With `status-accessor`</h2>
      <p class="text-sm text-text-secondary mb-3">
        Point <code>status-accessor</code> at a column key and TuxTable auto-renders
        that cell as a <code>TuxBadge :status</code>.
      </p>
      <TuxTable :data="scans" :columns="columns" status-accessor="status" />
    </section>

    <section>
      <p class="eyebrow">usage</p>
      <h2 class="heading--bold text-xl font-bold">Source</h2>
      <pre v-pre class="mt-3 p-4 rounded-md bg-surface-sunken text-xs font-mono overflow-auto border border-surface-border"><code>&lt;tux-table :data="scans" :columns="cols" status-accessor="status"&gt;
  &lt;!-- custom cell override --&gt;
  &lt;template #path-cell="{ row }"&gt;
    &lt;NuxtLink :to="`/scans/${row.id}`" class="font-mono"&gt;
      {{ row.path }}
    &lt;/NuxtLink&gt;
  &lt;/template&gt;
&lt;/tux-table&gt;</code></pre>
    </section>
  </div>
</template>
