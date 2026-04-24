<script setup lang="ts">
import { lucideIconNames, lucideIconCount } from "~/utils/lucide-names";

useHead({ title: "Icons · tti-ux" });

// Curated: the icons the Tux components + existing pages actually reach for.
// Keeps a quick-scan grid at the top for the 80% case. Full catalog below.
const curated = [
  // Status / state
  "check", "check-circle-2", "circle-x", "triangle-alert", "info",
  "loader-2", "clock", "shield-alert", "bookmark", "lightbulb", "pencil",
  // Navigation / chrome
  "home", "search", "menu", "x", "arrow-left", "arrow-right", "arrow-up-right",
  "chevron-down", "chevron-up", "external-link", "log-out",
  // Data / content
  "database", "folder", "folder-search", "folder-clock", "file", "inbox",
  "layers", "boxes", "hard-drive", "cloud", "table", "list", "layout-dashboard",
  // Actions
  "play", "square", "plus", "download", "upload", "refresh-cw", "trash-2",
  "filter", "copy", "edit", "save", "send",
  // UI / theme
  "sun", "moon", "contrast", "palette", "type", "zap", "heading",
  "message-square", "badge", "panel-top-open", "rectangle-horizontal",
  "square-stack", "clipboard-list",
  // Misc
  "sparkles", "scroll-text", "key", "users", "user", "settings", "eye",
  "eye-off", "lock", "unlock",
];

const search = ref("");
const pageSize = 120;
const visibleCount = ref(pageSize);

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return lucideIconNames;
  return lucideIconNames.filter((n) => n.includes(q));
});

const visible = computed(() => filtered.value.slice(0, visibleCount.value));

watch(search, () => {
  visibleCount.value = pageSize;
});

const copied = ref<string | null>(null);

async function copyName(name: string) {
  const full = `lucide:${name}`;
  try {
    await navigator.clipboard.writeText(full);
    copied.value = full;
    setTimeout(() => {
      if (copied.value === full) copied.value = null;
    }, 1200);
  } catch {
    // clipboard unavailable — silently fail
  }
}
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="foundations" title="Icons">
      <code>{{ lucideIconCount.toLocaleString() }}</code> icons from
      <a class="link-tti" href="https://lucide.dev/" target="_blank" rel="noopener">
        Lucide
      </a>, served by <code>@nuxt/icon</code> via Iconify. Click any icon to
      copy its <code>lucide:name</code> string — paste directly into any
      <code>&lt;UIcon /&gt;</code>, <code>&lt;Icon /&gt;</code>, or Tux
      component's <code>icon</code> prop.
    </TuxPageHeader>

    <TuxAlert
      variant="tip"
      title="Adding other icon sets"
      description="Install another @iconify-json/* package and @nuxt/icon picks it up automatically — e.g. `@iconify-json/carbon` lets you use `carbon:data-set`. This catalog only lists Lucide because that's all we've installed."
    />

    <section>
      <TuxSectionHeader :level="2" subtitle="The icons our components reach for">
        Curated
      </TuxSectionHeader>
      <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        <button
          v-for="name in curated"
          :key="name"
          type="button"
          class="group relative flex flex-col items-center gap-1 p-3 rounded-md border border-surface-border bg-surface-raised hover:border-brand-primary hover:bg-surface-sunken transition-colors"
          :title="`lucide:${name}`"
          @click="copyName(name)"
        >
          <UIcon :name="`lucide:${name}`" class="w-5 h-5 text-text-secondary group-hover:text-text-brand" />
          <span class="text-[10px] font-mono text-text-muted leading-tight text-center break-all line-clamp-2">
            {{ name }}
          </span>
          <span
            v-if="copied === `lucide:${name}`"
            class="absolute -top-1 -right-1 bg-brand-primary text-text-inverse text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-sm"
            style="letter-spacing: var(--tracking-wider)"
          >
            Copied
          </span>
        </button>
      </div>
    </section>

    <section>
      <TuxSectionHeader :level="2">
        Full catalog
      </TuxSectionHeader>

      <div class="flex flex-col sm:flex-row gap-3 mb-4 items-stretch sm:items-center">
        <UInput
          v-model="search"
          icon="lucide:search"
          placeholder="Filter by name — e.g. arrow, cloud, database…"
          class="flex-1"
        />
        <div class="text-sm text-text-muted font-mono whitespace-nowrap">
          {{ filtered.length.toLocaleString() }}
          {{ filtered.length === 1 ? "match" : "matches" }}
          <template v-if="filtered.length > visibleCount">
            (showing {{ visibleCount.toLocaleString() }})
          </template>
        </div>
      </div>

      <div
        v-if="filtered.length === 0"
        class="rounded-md border border-surface-border py-10"
      >
        <TuxEmptyState
          no-card
          icon="lucide:search-x"
          :title="`No icons match \`${search}\``"
          description="Try a shorter prefix — Lucide uses kebab-case (e.g. 'arrow-up' not 'arrowUp')."
        />
      </div>

      <div
        v-else
        class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2"
      >
        <button
          v-for="name in visible"
          :key="name"
          type="button"
          class="group relative flex flex-col items-center gap-1 p-3 rounded-md border border-surface-border bg-surface-raised hover:border-brand-primary hover:bg-surface-sunken transition-colors"
          :title="`lucide:${name}`"
          @click="copyName(name)"
        >
          <UIcon :name="`lucide:${name}`" class="w-5 h-5 text-text-secondary group-hover:text-text-brand" />
          <span class="text-[10px] font-mono text-text-muted leading-tight text-center break-all line-clamp-2">
            {{ name }}
          </span>
          <span
            v-if="copied === `lucide:${name}`"
            class="absolute -top-1 -right-1 bg-brand-primary text-text-inverse text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-sm"
            style="letter-spacing: var(--tracking-wider)"
          >
            Copied
          </span>
        </button>
      </div>

      <div v-if="filtered.length > visibleCount" class="mt-6 text-center">
        <TuxButton
          intent="secondary"
          icon="lucide:chevron-down"
          @click="visibleCount += pageSize"
        >
          Load {{ Math.min(pageSize, filtered.length - visibleCount).toLocaleString() }} more
        </TuxButton>
      </div>
    </section>

    <section>
      <TuxSectionHeader :level="2">
        Usage
      </TuxSectionHeader>
      <div class="mt-4 space-y-4 text-sm text-text-secondary max-w-2xl">
        <p>
          Every Tux component that takes an icon accepts a full Iconify string —
          collection prefix + name, joined by a colon.
        </p>
        <pre v-pre class="p-4 rounded-md bg-surface-sunken text-xs font-mono overflow-auto border border-surface-border m-0"><code>&lt;tux-button icon="lucide:play"&gt;Start&lt;/tux-button&gt;
&lt;tux-alert variant="info" icon="lucide:database" title="..." /&gt;

&lt;!-- Or directly via Nuxt UI's UIcon --&gt;
&lt;UIcon name="lucide:sparkles" class="w-5 h-5" /&gt;</code></pre>
        <p>
          To use another icon family — e.g. Carbon for data-viz glyphs or
          Simple Icons for brand marks — install the matching
          <code>@iconify-json/*</code> package and reference it by prefix:
        </p>
        <pre v-pre class="p-4 rounded-md bg-surface-sunken text-xs font-mono overflow-auto border border-surface-border m-0"><code>npm install @iconify-json/carbon
# then anywhere
&lt;UIcon name="carbon:data-set" /&gt;</code></pre>
      </div>
    </section>
  </div>
</template>
