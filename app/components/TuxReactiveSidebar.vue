<script setup lang="ts">
/**
 * TuxReactiveSidebar.vue — Canonical TUX Reactive Collapsible Sidebar Navigation.
 *
 * Supports two responsive desktop states:
 * 1. Expanded Mode (18rem / w-72): Rich taxonomy hierarchy, search filter, scope toggle,
 *    collapsible section groups, and custom enterprise scrollbar.
 * 2. Collapsed Mode (4rem / w-16): Sleek icon rail, active page indicator bar,
 *    and smooth animated flyout popout cards on hover with child navigation.
 *
 * Strictly adheres to TTI wash ladder ({4, 6, 8, 12, 18, 22, 35, 50}) and
 * token-based elevation tiers.
 */
import { isExactActive } from "../utils/nav-active";

export interface NavChild {
  label: string;
  to: string;
  icon?: string;
  badge?: string | number;
  description?: string;
}

export interface NavSection {
  label: string;
  icon?: string;
  to?: string;
  badge?: string | number;
  children?: NavChild[];
}

interface Props {
  sections: NavSection[];
  allSections?: NavSection[];
  collapsed?: boolean;
  activeAreaTitle?: string;
  activeAreaIcon?: string;
  search?: boolean;
  searchPlaceholder?: string;
  showAll?: boolean;
  defaultExpanded?: boolean;
  exclusive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  activeAreaTitle: "Workspace Navigation",
  activeAreaIcon: "lucide:layers",
  search: true,
  searchPlaceholder: "Filter pages…",
  allSections: undefined,
  showAll: false,
  defaultExpanded: false,
  exclusive: false,
});

const emit = defineEmits<{
  (e: "update:collapsed", value: boolean): void;
  (e: "toggle-collapse"): void;
  (e: "update:showAll", value: boolean): void;
}>();

const route = useRoute();
const searchQuery = ref("");
const hoveredSectionIndex = ref<number | null>(null);
const flyoutTop = ref<number>(0);
const flyoutTimer = ref<ReturnType<typeof setTimeout> | null>(null);

// Section expansion tracking for accordions.
// By default, sections start compacted (collapsed) to keep the navigation tidy and scannable.
const expandedSectionLabels = ref<Set<string>>(
  props.defaultExpanded
    ? new Set(props.sections.map((s) => s.label))
    : new Set()
);

function isSectionExpanded(label: string): boolean {
  if (searchQuery.value.trim()) return true;
  return expandedSectionLabels.value.has(label);
}

function toggleSection(label: string) {
  if (expandedSectionLabels.value.has(label)) {
    expandedSectionLabels.value.delete(label);
  } else {
    if (props.exclusive) {
      expandedSectionLabels.value.clear();
    }
    expandedSectionLabels.value.add(label);
  }
}

function expandAll() {
  expandedSectionLabels.value = new Set(
    filteredSections.value.map((s) => s.label)
  );
}

function collapseAll() {
  expandedSectionLabels.value.clear();
}

function isChildActive(child: NavChild): boolean {
  if (!child.to) return false;
  return isExactActive(child.to, route);
}

function isSectionActive(section: NavSection): boolean {
  if (section.to && isExactActive(section.to, route)) return true;
  return Boolean(section.children?.some((c) => isChildActive(c)));
}

function sectionIcon(section: NavSection): string {
  if (section.icon) return section.icon;
  if (section.children?.[0]?.icon) return section.children[0].icon;
  return "lucide:folder";
}

function sectionTarget(section: NavSection): string {
  if (section.to) return section.to;
  if (section.children?.[0]?.to) return section.children[0].to;
  return "#";
}

function parseSectionLabel(rawLabel: string): { prefix: string | null; title: string } {
  if (rawLabel.includes("//")) {
    const parts = rawLabel.split("//");
    const prefix = parts[0].trim().toUpperCase();
    const title = parts[1].trim();
    return { prefix, title };
  }
  return { prefix: null, title: rawLabel };
}

// Compute total counts for scope toggle
const areaPageCount = computed(() => {
  return props.sections.reduce(
    (acc, sec) => acc + (sec.children?.length || (sec.to ? 1 : 0)),
    0
  );
});

const allPageCount = computed(() => {
  const list = props.allSections || props.sections;
  return list.reduce(
    (acc, sec) => acc + (sec.children?.length || (sec.to ? 1 : 0)),
    0
  );
});

// Source sections: if search query active, search across allSections (if available)
const sourceSections = computed(() => {
  if (searchQuery.value.trim() && props.allSections?.length) {
    return props.allSections;
  }
  if (props.showAll && props.allSections?.length) {
    return props.allSections;
  }
  return props.sections;
});

// Filtered sections in expanded mode
const filteredSections = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return sourceSections.value;

  return sourceSections.value
    .map((section) => {
      const sectionMatches = section.label.toLowerCase().includes(q);
      const matchingChildren = (section.children || []).filter(
        (c) => c.label.toLowerCase().includes(q) || (c.to && c.to.toLowerCase().includes(q))
      );

      if (sectionMatches || matchingChildren.length > 0) {
        return {
          ...section,
          children: sectionMatches ? section.children : matchingChildren,
        };
      }
      return null;
    })
    .filter((s): s is NavSection => s !== null);
});

const totalMatchCount = computed(() => {
  return filteredSections.value.reduce(
    (acc, sec) => acc + (sec.children?.length || (sec.to ? 1 : 0)),
    0
  );
});

// Sections for collapsed mini-rail mode (use allSections if available for a complete rail)
const railSections = computed(() => {
  return props.allSections && props.allSections.length > 0
    ? props.allSections
    : props.sections;
});

// Popout flyout hover handling in collapsed mode
function onMouseEnterSection(index: number, event: MouseEvent) {
  if (!props.collapsed) return;
  if (flyoutTimer.value) clearTimeout(flyoutTimer.value);

  const target = event.currentTarget as HTMLElement | null;
  if (target) {
    const rect = target.getBoundingClientRect();
    flyoutTop.value = Math.max(65, Math.min(window.innerHeight - 340, rect.top));
  }
  hoveredSectionIndex.value = index;
}

function onMouseLeaveSection() {
  if (!props.collapsed) return;
  flyoutTimer.value = setTimeout(() => {
    hoveredSectionIndex.value = null;
  }, 140);
}

function onMouseEnterFlyout() {
  if (flyoutTimer.value) clearTimeout(flyoutTimer.value);
}

function onMouseLeaveFlyout() {
  hoveredSectionIndex.value = null;
}
</script>

<template>
  <nav
    class="tux-reactive-sidebar select-none transition-all duration-200 h-full min-h-0 flex flex-col overflow-hidden"
    :class="collapsed ? 'w-16' : 'w-72 lg:w-80'"
    :aria-label="activeAreaTitle"
    data-testid="tux-reactive-sidebar"
  >
    <!-- 1. Expanded Header: Area Title & Collapse Action -->
    <div
      v-if="!collapsed"
      class="px-3.5 py-3 border-b border-surface-border flex items-center justify-between gap-2 flex-shrink-0 bg-surface-sunken/60"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-7 h-7 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0">
          <UIcon :name="props.activeAreaIcon" class="w-4 h-4" />
        </div>
        <div class="min-w-0">
          <span class="block text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted leading-tight">
            Navigation
          </span>
          <span class="block text-sm font-bold text-text-primary truncate leading-tight">
            {{ activeAreaTitle }}
          </span>
        </div>
      </div>

      <button
        type="button"
        class="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors cursor-pointer"
        title="Collapse sidebar"
        aria-label="Collapse sidebar"
        @click="emit('toggle-collapse')"
      >
        <UIcon name="lucide:panel-left-close" class="w-4 h-4" />
      </button>
    </div>

    <!-- 1b. Scope Switcher (Current Area vs All Sections) -->
    <div
      v-if="!collapsed && allSections && allSections.length > 0"
      class="px-3 py-1.5 bg-surface-sunken/40 border-b border-surface-border flex items-center gap-1.5 flex-shrink-0"
    >
      <button
        type="button"
        class="flex-1 py-1 px-2 rounded-md text-[11px] font-mono font-bold transition-all text-center cursor-pointer"
        :class="!showAll ? 'bg-surface-raised text-brand-primary shadow-xs border border-surface-border' : 'text-text-muted hover:text-text-primary'"
        title="Show current area sections"
        @click="emit('update:showAll', false)"
      >
        Area ({{ areaPageCount }})
      </button>
      <button
        type="button"
        class="flex-1 py-1 px-2 rounded-md text-[11px] font-mono font-bold transition-all text-center cursor-pointer"
        :class="showAll ? 'bg-surface-raised text-brand-primary shadow-xs border border-surface-border' : 'text-text-muted hover:text-text-primary'"
        title="Show all sections across entire design system"
        @click="emit('update:showAll', true)"
      >
        All ({{ allPageCount }})
      </button>
    </div>

    <!-- 2. Search Filter (Expanded Mode only) -->
    <div v-if="!collapsed && search" class="p-2.5 border-b border-surface-border flex-shrink-0">
      <div class="relative flex items-center">
        <UIcon
          name="lucide:search"
          class="w-3.5 h-3.5 text-text-muted absolute left-2.5 pointer-events-none"
        />
        <input
          v-model="searchQuery"
          type="search"
          :placeholder="searchPlaceholder"
          class="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg bg-surface-sunken border border-surface-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-colors"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="absolute right-2 text-text-muted hover:text-text-primary p-0.5 cursor-pointer"
          title="Clear filter"
          @click="searchQuery = ''"
        >
          <UIcon name="lucide:x" class="w-3 h-3" />
        </button>
      </div>
      <div
        v-if="searchQuery"
        class="pt-1.5 px-0.5 flex items-center justify-between text-[10px] font-mono text-text-muted"
      >
        <span>Matches: {{ totalMatchCount }}</span>
        <button
          type="button"
          class="text-brand-primary hover:underline cursor-pointer"
          @click="searchQuery = ''"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- 3. Navigation List (Expanded Mode) -->
    <div
      v-if="!collapsed"
      class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-2.5 space-y-2.5 tux-sidebar-scroll"
    >
      <!-- Sections Control Strip (when not searching) -->
      <div
        v-if="!searchQuery && filteredSections.length > 0"
        class="px-1 pt-0.5 pb-1 flex items-center justify-between text-[10px] font-mono text-text-muted select-none border-b border-surface-border/40 mb-1"
      >
        <span class="uppercase tracking-wider font-semibold">
          Sections ({{ filteredSections.length }})
        </span>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="hover:text-brand-primary transition-colors cursor-pointer"
            title="Expand all sections"
            @click="expandAll"
          >
            Expand all
          </button>
          <span>·</span>
          <button
            type="button"
            class="hover:text-brand-primary transition-colors cursor-pointer"
            title="Collapse all sections"
            @click="collapseAll"
          >
            Collapse all
          </button>
        </div>
      </div>

      <div
        v-if="filteredSections.length === 0"
        class="py-8 text-center text-xs text-text-muted space-y-1"
      >
        <UIcon name="lucide:search-x" class="w-6 h-6 mx-auto text-text-muted/60" />
        <p class="m-0 font-medium">No pages matching "{{ searchQuery }}"</p>
      </div>

      <div
        v-for="(section, sIdx) in filteredSections"
        :key="section.label || sIdx"
        class="space-y-1"
      >
        <!-- Section Heading / Direct Link with Accordion Toggle -->
        <div
          class="px-2 py-1.5 flex items-center justify-between rounded-lg cursor-pointer hover:bg-surface-sunken/80 transition-colors select-none group border"
          :class="[
            isSectionActive(section)
              ? 'bg-brand-primary/8 border-brand-primary/25 text-brand-primary font-bold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          ]"
          @click="toggleSection(section.label)"
        >
          <div class="flex items-center gap-1.5 min-w-0">
            <UIcon
              v-if="section.children?.length"
              name="lucide:chevron-right"
              class="w-3.5 h-3.5 transition-transform duration-150 flex-shrink-0"
              :class="[
                isSectionExpanded(section.label) ? 'rotate-90' : '',
                isSectionActive(section) ? 'text-brand-primary' : 'text-text-muted'
              ]"
            />
            <NuxtLink
              v-if="section.to"
              :to="section.to"
              class="flex items-center gap-1.5 min-w-0 transition-colors truncate"
              :class="isSectionActive(section) ? 'text-brand-primary font-bold' : 'text-text-muted hover:text-brand-primary'"
              @click.stop
            >
              <span class="sr-only">{{ section.label }}</span>
              <span aria-hidden="true" class="flex items-center gap-1.5 min-w-0 truncate">
                <UIcon v-if="section.icon" :name="section.icon" class="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                <span
                  v-if="parseSectionLabel(section.label).prefix"
                  class="text-[10px] font-mono font-bold px-1 py-0.5 rounded bg-surface-sunken border border-surface-border text-text-muted flex-shrink-0"
                >
                  {{ parseSectionLabel(section.label).prefix }}
                </span>
                <span class="text-xs font-sans font-semibold tracking-tight truncate">
                  {{ parseSectionLabel(section.label).title }}
                </span>
              </span>
            </NuxtLink>
            <div
              v-else
              class="flex items-center gap-1.5 min-w-0 transition-colors truncate"
              :class="isSectionActive(section) ? 'text-brand-primary' : 'text-text-primary group-hover:text-brand-primary'"
            >
              <span class="sr-only">{{ section.label }}</span>
              <span aria-hidden="true" class="flex items-center gap-1.5 min-w-0 truncate">
                <span
                  v-if="parseSectionLabel(section.label).prefix"
                  class="text-[10px] font-mono font-bold px-1 py-0.5 rounded bg-surface-sunken border border-surface-border text-text-muted flex-shrink-0"
                >
                  {{ parseSectionLabel(section.label).prefix }}
                </span>
                <span class="text-xs font-sans font-semibold tracking-tight truncate">
                  {{ parseSectionLabel(section.label).title }}
                </span>
              </span>
            </div>
          </div>

          <div class="flex items-center gap-1.5 flex-shrink-0">
            <!-- Active indicator dot when compacted -->
            <span
              v-if="isSectionActive(section) && !isSectionExpanded(section.label)"
              class="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse"
              title="Current page is in this section"
            />
            <span
              v-if="section.badge || section.children?.length"
              class="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-surface-sunken border border-surface-border text-text-muted"
              :class="{ 'border-brand-primary/30 text-brand-primary': isSectionActive(section) }"
            >
              {{ section.badge || section.children?.length }}
            </span>
          </div>
        </div>

        <!-- Section Children Links (collapsible) -->
        <ul
          v-if="isSectionExpanded(section.label) && section.children?.length"
          class="space-y-0.5 list-none m-0 p-0 pl-2.5 pt-0.5"
        >
          <li v-for="child in section.children" :key="child.to">
            <NuxtLink
              :to="child.to"
              class="tux-sidebar-link group flex items-center justify-between px-2.5 py-1 rounded-md text-xs font-medium transition-all"
              :class="[
                isChildActive(child)
                  ? 'tux-sidebar-link--active bg-brand-primary/10 text-brand-primary font-bold shadow-xs'
                  : 'text-text-primary hover:bg-surface-sunken hover:text-brand-primary',
              ]"
            >
              <div class="flex items-center gap-2 min-w-0">
                <UIcon
                  v-if="child.icon"
                  :name="child.icon"
                  class="w-3.5 h-3.5 flex-shrink-0 transition-colors"
                  :class="isChildActive(child) ? 'text-brand-primary' : 'text-text-muted group-hover:text-brand-primary'"
                />
                <span class="truncate text-[12.5px] leading-tight">{{ child.label }}</span>
              </div>
              <span
                v-if="child.badge !== undefined"
                class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-sunken text-text-muted flex-shrink-0"
              >
                {{ child.badge }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- 4. Collapsed Mini-Rail (Width w-16 / 4rem) -->
    <div
      v-else
      class="flex-1 flex flex-col items-center py-2.5 space-y-2 overflow-y-auto overflow-x-visible relative tux-sidebar-scroll"
    >
      <!-- Expand Button at top of collapsed rail -->
      <button
        type="button"
        class="w-10 h-10 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-sunken transition-colors mb-0.5 cursor-pointer"
        title="Expand sidebar"
        aria-label="Expand sidebar"
        @click="emit('toggle-collapse')"
      >
        <UIcon name="lucide:panel-left-open" class="w-4 h-4" />
      </button>

      <div class="w-8 h-px bg-surface-border my-0.5" />

      <!-- Item Icons List with Popouts -->
      <div
        v-for="(section, sIdx) in railSections"
        :key="section.label || sIdx"
        class="relative flex items-center justify-center w-full px-2"
        @mouseenter="onMouseEnterSection(sIdx, $event)"
        @mouseleave="onMouseLeaveSection"
      >
        <!-- Active indicator bar on far left -->
        <div
          v-if="isSectionActive(section)"
          class="absolute left-0 top-1.5 bottom-1.5 w-1 bg-brand-accent rounded-r-sm shadow-xs"
        />

        <!-- Collapsed Icon Link -->
        <NuxtLink
          :to="sectionTarget(section)"
          class="w-10 h-10 rounded-lg flex items-center justify-center transition-all relative group border border-transparent"
          :class="[
            isSectionActive(section)
              ? 'bg-brand-primary/12 text-brand-primary border-brand-primary/22 shadow-xs'
              : 'text-text-muted hover:text-text-primary hover:bg-surface-sunken hover:border-surface-border',
          ]"
          :aria-label="section.label"
        >
          <UIcon
            :name="sectionIcon(section)"
            class="w-5 h-5 transition-transform group-hover:scale-110"
          />
        </NuxtLink>
      </div>

      <!-- 5. Hover Flyout Popout Card (Teleported to body for overflow break-out) -->
      <Teleport to="body">
        <div
          v-if="collapsed && hoveredSectionIndex !== null && railSections[hoveredSectionIndex]"
          class="tux-sidebar-popout-flyout fixed z-50 animate-flyoutIn"
          :style="{
            top: `${flyoutTop}px`,
            left: '4.5rem',
          }"
          data-testid="tux-sidebar-popout"
          @mouseenter="onMouseEnterFlyout"
          @mouseleave="onMouseLeaveFlyout"
        >
          <div
            class="bg-surface-raised/95 backdrop-blur-xl border border-surface-border rounded-xl shadow-2xl p-3 min-w-[220px] max-w-[280px] space-y-2 text-xs"
          >
            <!-- Popout Header -->
            <div class="flex items-center justify-between pb-2 border-b border-surface-border">
              <div class="flex items-center gap-2 min-w-0">
                <div class="w-6 h-6 rounded bg-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0">
                  <UIcon :name="sectionIcon(railSections[hoveredSectionIndex])" class="w-3.5 h-3.5" />
                </div>
                <div class="min-w-0">
                  <h4 class="font-bold text-text-primary m-0 truncate text-xs flex items-center gap-1.5">
                    <span
                      v-if="parseSectionLabel(railSections[hoveredSectionIndex].label).prefix"
                      class="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-surface-sunken border border-surface-border text-text-muted flex-shrink-0"
                    >
                      {{ parseSectionLabel(railSections[hoveredSectionIndex].label).prefix }}
                    </span>
                    <span class="truncate">{{ parseSectionLabel(railSections[hoveredSectionIndex].label).title }}</span>
                  </h4>
                  <span class="text-[9px] font-mono text-text-muted block truncate uppercase tracking-wider">
                    {{ railSections[hoveredSectionIndex].children?.length || 1 }} destinations
                  </span>
                </div>
              </div>
              <NuxtLink
                :to="sectionTarget(railSections[hoveredSectionIndex])"
                class="text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-0.5 flex-shrink-0"
              >
                <span>Jump</span>
                <UIcon name="lucide:arrow-right" class="w-3 h-3" />
              </NuxtLink>
            </div>

            <!-- Popout Children Links -->
            <ul
              v-if="railSections[hoveredSectionIndex].children?.length"
              class="space-y-1 list-none m-0 p-0 max-h-[260px] overflow-y-auto pr-1"
            >
              <li
                v-for="child in railSections[hoveredSectionIndex].children"
                :key="child.to"
              >
                <NuxtLink
                  :to="child.to"
                  class="flex items-center justify-between px-2 py-1.5 rounded-md transition-colors group text-xs"
                  :class="[
                    isChildActive(child)
                      ? 'bg-brand-primary/10 text-brand-primary font-bold'
                      : 'text-text-primary hover:bg-surface-sunken hover:text-brand-primary',
                  ]"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <UIcon
                      v-if="child.icon"
                      :name="child.icon"
                      class="w-3.5 h-3.5 flex-shrink-0"
                      :class="isChildActive(child) ? 'text-brand-primary' : 'text-text-muted group-hover:text-brand-primary'"
                    />
                    <span class="truncate">{{ child.label }}</span>
                  </div>
                  <span
                    v-if="isChildActive(child)"
                    class="w-1.5 h-1.5 rounded-full bg-brand-primary flex-shrink-0"
                  />
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </Teleport>
    </div>
  </nav>
</template>

<style scoped>
@keyframes flyoutIn {
  from {
    opacity: 0;
    transform: translateX(-6px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

.animate-flyoutIn {
  animation: flyoutIn 0.14s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.tux-sidebar-link--active {
  box-shadow: inset 3px 0 0 var(--brand-accent, #CFA935);
}

.tux-sidebar-scroll {
  scrollbar-width: thin;
  scrollbar-color: var(--surface-border) transparent;
}

.tux-sidebar-scroll::-webkit-scrollbar {
  width: 5px;
}

.tux-sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.tux-sidebar-scroll::-webkit-scrollbar-thumb {
  background: var(--surface-border);
  border-radius: 9999px;
}

.tux-sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}
</style>

