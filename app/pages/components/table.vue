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

const basicVue = `<tux-table
  :data="scans"
  :columns="columns"
  status-accessor="status"
/>`;

const customCellVue = `<tux-table :data="scans" :columns="columns" status-accessor="status">
  <!-- custom cell override -->
  <template #path-cell="{ row }">
    <NuxtLink :to="\`/scans/\${row.id}\`" class="font-mono">
      {{ '{{ row.path }}' }}
    </NuxtLink>
  </template>
</tux-table>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxTable">
      Wraps <code>UTable</code>. Adds the maroon-wash header, uppercase tracked
      labels, brand-tinted row hover, and a rounded card frame. Body cells default
      to <code>font-mono</code> because most of what lands in our tables is paths
      and IDs — override per-column with a <code>#{column}-cell</code> slot.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">auto status cell</p>
      <h2 class="heading--bold text-xl font-bold">With `status-accessor`</h2>
      <p class="text-sm text-text-secondary mb-3">
        Point <code>status-accessor</code> at a column key and TuxTable auto-renders
        that cell as a <code>TuxBadge :status</code>.
      </p>
      <TuxExample :vue="basicVue" preview-padding="p-0">
        <TuxTable :data="scans" :columns="columns" status-accessor="status" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">custom cell slots</p>
      <h2 class="heading--bold text-xl font-bold">Override a column</h2>
      <p class="text-sm text-text-secondary mb-3">
        Any column slot from UTable is forwarded. Use
        <code>#{accessorKey}-cell</code> to replace a column's renderer — e.g.
        turn paths into links.
      </p>
      <TuxExample :vue="customCellVue" preview-padding="p-0">
        <TuxTable :data="scans" :columns="columns" status-accessor="status">
          <template #path-cell="{ row }">
            <NuxtLink :to="`/components/table`" class="font-mono text-text-brand hover:underline">
              {{ (row.original || row).path }}
            </NuxtLink>
          </template>
        </TuxTable>
      </TuxExample>
    </section>
  </div>
</template>
