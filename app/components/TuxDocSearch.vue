<script setup lang="ts">
// TuxDocSearch — lightweight instant search for documentation sites.
//
// Key features:
//   - Keyboard shortcut: '/' focuses the input (unless already typing in an input/textarea)
//   - Live fuzzy/substring filtering across titles, paths, and descriptions
//   - Keyboard navigation with ArrowUp / ArrowDown / Enter
//   - Escape key dismisses the dropdown
//   - Accessible listbox with aria-activedescendant and screen-reader status

export interface DocSearchItem {
  title: string;
  to: string;
  description?: string;
  section?: string;
}

const props = withDefaults(defineProps<{
  items?: DocSearchItem[];
  placeholder?: string;
  maxResults?: number;
}>(), {
  items: undefined,
  placeholder: "Search docs (Press / to focus)…",
  maxResults: 8,
});

const emit = defineEmits<{
  select: [item: DocSearchItem];
}>();

const route = useRoute();
const query = ref("");
const isOpen = ref(false);
const selectedIndex = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);

// Default items if not passed explicitly: design docs + core doc hubs
const defaultItems = computed<DocSearchItem[]>(() => [
  { title: "Components Doctrine", to: "/design/components", section: "Design", description: "Standard component census and rules" },
  { title: "Palette & Visual Identity", to: "/design/palette", section: "Design", description: "Colors, tints, and accessible combinations" },
  { title: "Design System Architecture", to: "/design/tux", section: "Design", description: "Three-theme structure and layer doctrine" },
  { title: "Roadmap", to: "/design/roadmap", section: "Design", description: "Design system priorities and upcoming work" },
  { title: "Compositions & Patterns", to: "/design/compositions", section: "Design", description: "Multi-component layouts and UX flows" },
  { title: "Kit Pipeline", to: "/design/kit-pipeline", section: "Design", description: "Framework targets and distribution architecture" },
  { title: "Operational Surfaces", to: "/design/ops-surfaces", section: "Design", description: "Ops board and operational status ramps" },
  { title: "Chart Foundations", to: "/design/chart-foundations", section: "Design", description: "Data visualization doctrine and accessible charts" },
  { title: "Platform Awareness", to: "/design/platform-awareness", section: "Design", description: "Adapting UX for Web, Desktop, and Mobile" },
  { title: "Changelog", to: "/changelog", section: "Project", description: "Version history and release notes" },
  { title: "Design Tokens", to: "/tokens", section: "Tokens", description: "Interactive CSS tokens catalog" },
  { title: "Installation Hub", to: "/install", section: "Install", description: "Install guides for Nuxt, React, .NET, WordPress" },
  { title: "React Integration", to: "/install/react", section: "Install", description: "Using TUX in React applications" },
  { title: "C# / .NET Integration", to: "/install/dotnet", section: "Install", description: "ASP.NET Core Tag Helpers and Blazor" },
  { title: "WordPress Integration", to: "/install/wordpress", section: "Install", description: "Official plugin for Kadence and Gutenberg" },
  { title: "Nuxt Studio Visual CMS", to: "/install/nuxt-studio", section: "Install", description: "Visual editing with Git backing" },
  { title: "ADR-0012: Cross-Framework Distribution", to: "/docs/adr/0012-cross-framework-distribution-via-web-components", section: "ADR", description: "Web components distribution architecture" },
  { title: "ADR-0013: Operational Status Ramp", to: "/docs/adr/0013-operational-status-ramp", section: "ADR", description: "Palette tokens for operations surfaces" },
  { title: "ADR-0014: Operational Surfaces", to: "/docs/adr/0014-operational-surfaces", section: "ADR", description: "Board and layout specifications" },
  { title: "ADR Index", to: "/docs/adr", section: "ADR", description: "Architectural decision records index" },
]);

const searchableItems = computed<DocSearchItem[]>(() => props.items ?? defaultItems.value);

const results = computed(() => {
  const needle = query.value.trim().toLowerCase();
  if (needle.length < 1) return [];

  return searchableItems.value
    .filter((item) => {
      const haystack = `${item.title} ${item.to} ${item.section || ""} ${item.description || ""}`.toLowerCase();
      return haystack.includes(needle);
    })
    .slice(0, props.maxResults);
});

watch(query, (val) => {
  isOpen.value = val.trim().length > 0;
  selectedIndex.value = 0;
});

watch(() => route.path, () => {
  close();
  query.value = "";
});

function close() {
  isOpen.value = false;
  selectedIndex.value = 0;
}

function onBlur() {
  // Allow link clicks to trigger before closing
  setTimeout(close, 150);
}

async function select(item: DocSearchItem) {
  emit("select", item);
  close();
  query.value = "";
  await navigateTo(item.to);
}

function onKeydown(e: KeyboardEvent) {
  // Global '/' shortcut focuses search when not in another input
  if (
    e.key === "/" &&
    !(e.target instanceof HTMLInputElement) &&
    !(e.target instanceof HTMLTextAreaElement)
  ) {
    e.preventDefault();
    inputRef.value?.focus();
    return;
  }

  if (!isOpen.value) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    selectedIndex.value = (selectedIndex.value + 1) % (results.value.length || 1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    selectedIndex.value = (selectedIndex.value - 1 + results.value.length) % (results.value.length || 1);
  } else if (e.key === "Enter") {
    e.preventDefault();
    const item = results.value[selectedIndex.value];
    if (item) select(item);
  } else if (e.key === "Escape") {
    e.preventDefault();
    close();
  }
}

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", onKeydown);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", onKeydown);
  }
});
</script>

<template>
  <div class="tux-doc-search relative w-full max-w-md">
    <div class="relative flex items-center">
      <UIcon
        name="lucide:search"
        class="absolute left-3 w-4 h-4 text-text-muted pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref="inputRef"
        v-model="query"
        type="search"
        class="w-full pl-9 pr-8 py-1.5 text-xs bg-surface-raised border border-surface-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-primary transition-shadow"
        :placeholder="placeholder"
        aria-label="Search documentation"
        autocomplete="off"
        role="combobox"
        :aria-expanded="isOpen"
        aria-autocomplete="list"
        aria-controls="tux-doc-search-results"
        @focus="isOpen = query.trim().length > 0"
        @blur="onBlur"
      />
      <span
        v-if="!query"
        class="absolute right-2 px-1.5 py-0.5 text-[10px] font-mono border border-surface-border text-text-muted rounded bg-surface-sunken pointer-events-none"
      >
        /
      </span>
      <button
        v-else
        type="button"
        class="absolute right-2 text-text-muted hover:text-text-secondary"
        aria-label="Clear search"
        @click="query = ''; close()"
      >
        <UIcon name="lucide:x" class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Dropdown results -->
    <div
      v-if="isOpen"
      id="tux-doc-search-results"
      class="absolute left-0 right-0 top-full mt-1.5 bg-surface-raised border border-surface-border rounded-md shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto"
      :role="results.length > 0 ? 'listbox' : 'status'"
      aria-label="Search results"
    >
      <div v-if="results.length === 0" class="p-3 text-xs text-text-muted text-center">
        No matching documentation found
      </div>

      <ul v-else class="divide-y divide-surface-border/50" role="presentation">
        <li
          v-for="(item, index) in results"
          :key="item.to"
          role="option"
          :aria-selected="selectedIndex === index"
        >
          <a
            :href="item.to"
            class="flex items-start justify-between p-2.5 transition-colors text-left group"
            :class="selectedIndex === index ? 'bg-surface-sunken text-text-brand' : 'hover:bg-surface-sunken text-text-primary'"
            @mousedown.prevent
            @click.prevent="select(item)"
          >
            <div class="min-w-0 pr-2">
              <div class="flex items-center gap-1.5">
                <span v-if="item.section" class="text-[10px] uppercase font-semibold tracking-wider text-text-muted px-1 rounded bg-surface-sunken border border-surface-border">
                  {{ item.section }}
                </span>
                <strong class="text-xs font-semibold group-hover:text-text-brand truncate">
                  {{ item.title }}
                </strong>
              </div>
              <p v-if="item.description" class="text-[11px] text-text-secondary mt-0.5 line-clamp-1">
                {{ item.description }}
              </p>
            </div>
            <UIcon
              name="lucide:arrow-up-right"
              class="w-3.5 h-3.5 text-text-muted group-hover:text-text-brand shrink-0 mt-0.5"
            />
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
