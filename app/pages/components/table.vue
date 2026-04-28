<script setup lang="ts">
useHead({ title: "TuxTable · TUX" });

interface Project {
  id: string;
  title: string;
  status: "queued" | "running" | "completed" | "failed";
  owner: string;
  updated: string;
}

// Illustrative project data — not specific to any consuming app.
const projects: Project[] = [
  { id: "2024-0142", title: "Rural intersection safety — Phase II",          status: "completed", owner: "M. Ortiz",   updated: "2026-04-22 09:14" },
  { id: "2024-0317", title: "Corridor speed study — I-35 north of Austin",    status: "running",   owner: "A. Nguyen",  updated: "2026-04-24 11:02" },
  { id: "2025-0008", title: "Connected-vehicle pilot — preliminary findings", status: "failed",    owner: "J. Reese",   updated: "2026-04-24 10:47" },
  { id: "2025-0019", title: "Bridge deck condition inventory",                status: "queued",    owner: "K. Patel",   updated: "—" },
];

const columns = [
  { accessorKey: "title",   header: "Title" },
  { accessorKey: "owner",   header: "Owner" },
  { accessorKey: "status",  header: "Status" },
  { accessorKey: "updated", header: "Updated" },
];

const basicVue = `<tux-table
  :data="projects"
  :columns="columns"
  status-accessor="status"
/>`;

const customCellVue = `<tux-table :data="projects" :columns="columns" status-accessor="status">
  <!-- custom cell override -->
  <template #title-cell="{ row }">
    <NuxtLink :to="\`/projects/\${row.id}\`" class="font-mono">
      {{ '{{ row.title }}' }}
    </NuxtLink>
  </template>
</tux-table>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxTable">
      Wraps <code>UTable</code>. Adds the maroon-wash header, uppercase tracked
      labels, brand-tinted row hover, and a rounded card frame. Body cells
      default to <code>font-mono</code> because most of what lands in our
      tables is IDs, paths, and short strings — override per-column with a
      <code>#{column}-cell</code> slot.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">auto status cell</p>
      <h2 class="heading--bold text-xl font-bold">With `status-accessor`</h2>
      <p class="text-sm text-text-secondary mb-3">
        Point <code>status-accessor</code> at a column key and TuxTable
        auto-renders that cell as a <code>TuxBadge :status</code>.
      </p>
      <TuxExample :vue="basicVue" preview-padding="p-0">
        <TuxTable :data="projects" :columns="columns" status-accessor="status" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">custom cell slots</p>
      <h2 class="heading--bold text-xl font-bold">Override a column</h2>
      <p class="text-sm text-text-secondary mb-3">
        Any column slot from UTable is forwarded. Use
        <code>#{accessorKey}-cell</code> to replace a column's renderer — e.g.
        turn titles into links.
      </p>
      <TuxExample :vue="customCellVue" preview-padding="p-0">
        <TuxTable :data="projects" :columns="columns" status-accessor="status">
          <template #title-cell="{ row }">
            <NuxtLink :to="`/components/table`" class="font-mono text-text-brand hover:underline">
              {{ (row.original || row).title }}
            </NuxtLink>
          </template>
        </TuxTable>
      </TuxExample>
    </section>
  </div>
</template>
