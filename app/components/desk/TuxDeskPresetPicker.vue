<script setup lang="ts">
/**
 * TuxDeskPresetPicker.vue — Visual Template Preset Selector for Tux Desk.
 *
 * Provides a categorized catalog of institutional template presets
 * with block anatomy previews, metadata badges, and one-click application.
 */
import { ref, computed } from "vue";
import {
  TUX_DESK_PRESETS,
  type TuxDeskPreset,
  type TuxDeskPresetCategory,
} from "../../utils/desk/presets";

interface Props {
  activePresetId?: string;
  confirmReplace?: boolean;
  showClose?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  activePresetId: undefined,
  confirmReplace: false,
  showClose: true,
});

const emit = defineEmits<{
  (e: "select", preset: TuxDeskPreset): void;
  (e: "close"): void;
}>();

const selectedCategory = ref<"all" | TuxDeskPresetCategory>("all");
const searchQuery = ref("");

const categoryTabs = [
  { id: "all", label: "All Presets" },
  { id: "research", label: "Research Programs" },
  { id: "technical", label: "Technical Reports" },
  { id: "academic", label: "Academic Publications" },
  { id: "operations", label: "Corridor Advisories" },
  { id: "starter", label: "Blank Starters" },
] as const;

const filteredPresets = computed(() => {
  let list = TUX_DESK_PRESETS;
  if (selectedCategory.value !== "all") {
    list = list.filter((p) => p.category === selectedCategory.value);
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q)
    );
  }
  return list;
});

function handleSelect(preset: TuxDeskPreset) {
  if (props.confirmReplace) {
    const ok = window.confirm(
      `Load "${preset.title}" preset? Any unsaved edits in the active editor canvas will be replaced.`
    );
    if (!ok) return;
  }
  emit("select", preset);
}
</script>

<template>
  <div class="tux-desk-preset-picker flex flex-col gap-4 p-4 sm:p-5 bg-surface-sunken border-b border-surface-border animate-fadeIn">
    <!-- Top Bar: Header, Search, Close -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
      <div class="space-y-0.5">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold bg-brand-primary text-text-on-brand">
            Template Presets
          </span>
          <span class="text-xs text-text-muted">
            Choose a canonical publishing layout to jumpstart your page.
          </span>
        </div>
        <h3 class="text-sm font-bold text-text-primary tracking-tight m-0">
          Institutional Document Presets & Blueprints
        </h3>
      </div>

      <div class="flex items-center gap-2">
        <div class="relative">
          <UIcon
            name="lucide:search"
            class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search templates..."
            class="pl-8 pr-3 py-1 text-xs rounded-md bg-surface-raised border border-surface-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary w-44 sm:w-56"
          />
        </div>

        <button
          v-if="showClose"
          type="button"
          class="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
          title="Close Presets Drawer"
          @click="emit('close')"
        >
          <UIcon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Category Filter Pills -->
    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar" role="tablist">
      <button
        v-for="tab in categoryTabs"
        :key="tab.id"
        type="button"
        role="tab"
        :aria-selected="selectedCategory === tab.id"
        class="px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border"
        :class="
          selectedCategory === tab.id
            ? 'bg-brand-primary text-text-on-brand border-brand-primary shadow-xs font-semibold'
            : 'bg-surface-raised text-text-muted border-surface-border hover:text-text-primary hover:border-text-muted'
        "
        @click="selectedCategory = tab.id as any"
      >
        <span>{{ tab.label }}</span>
        <span
          class="text-[10px] px-1 py-0.2 rounded-full font-mono"
          :class="selectedCategory === tab.id ? 'bg-black/20 text-white' : 'bg-surface-sunken text-text-muted'"
        >
          {{ tab.id === 'all' ? TUX_DESK_PRESETS.length : TUX_DESK_PRESETS.filter(p => p.category === tab.id).length }}
        </span>
      </button>
    </div>

    <!-- Presets Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
      <div
        v-for="preset in filteredPresets"
        :key="preset.id"
        class="tux-preset-card p-4 rounded-xl bg-surface-raised border transition-all duration-150 flex flex-col justify-between gap-3 relative group hover:shadow-sm"
        :class="
          activePresetId === preset.id
            ? 'border-brand-primary ring-1 ring-brand-primary/50'
            : 'border-surface-border hover:border-brand-primary/60'
        "
      >
        <!-- Card Top: Icon, Category Badge -->
        <div class="space-y-2">
          <div class="flex items-center justify-between gap-2">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-sunken border border-surface-border text-brand-primary group-hover:scale-105 transition-transform">
              <UIcon :name="preset.icon" class="w-4 h-4" />
            </div>
            <TuxBadge :tone="preset.badgeTone" size="xs">
              {{ preset.categoryLabel }}
            </TuxBadge>
          </div>

          <!-- Title & Description -->
          <div class="space-y-1">
            <h4 class="text-sm font-bold text-text-primary m-0 tracking-tight flex items-center gap-1.5">
              <span>{{ preset.title }}</span>
              <span
                v-if="activePresetId === preset.id"
                class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-primary/10 text-brand-primary font-semibold"
              >
                Active
              </span>
            </h4>
            <p class="text-xs text-text-muted leading-relaxed line-clamp-2 m-0">
              {{ preset.description }}
            </p>
          </div>

          <!-- Block Anatomy Chips Ribbon -->
          <div class="space-y-1 pt-1">
            <span class="text-[10px] uppercase font-mono tracking-wider text-text-muted block">
              Block Anatomy:
            </span>
            <div class="flex flex-wrap items-center gap-1">
              <span
                v-for="(chip, cIdx) in preset.blocksSummary"
                :key="cIdx"
                class="px-1.5 py-0.5 rounded text-[10px] font-mono border border-surface-border bg-surface-sunken text-text-primary flex items-center gap-1"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :class="{
                    'bg-brand-primary': chip.tone === 'brand',
                    'bg-amber-500': chip.tone === 'warning',
                    'bg-emerald-500': chip.tone === 'ok',
                    'bg-blue-500': chip.tone === 'info',
                    'bg-text-muted': !chip.tone || chip.tone === 'neutral',
                  }"
                />
                {{ chip.label }}
              </span>
            </div>
          </div>
        </div>

        <!-- Card Footer: Meta & Action -->
        <div class="pt-2.5 border-t border-surface-border/60 flex items-center justify-between gap-2 text-[11px] text-text-muted">
          <div class="flex items-center gap-2">
            <span class="font-mono">{{ preset.blocksSummary.length }} Blocks</span>
            <span>·</span>
            <span>{{ preset.reviewCadenceDays }}d Review</span>
          </div>

          <TuxButton
            intent="primary"
            size="xs"
            icon="lucide:arrow-right"
            @click="handleSelect(preset)"
          >
            Apply Preset
          </TuxButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
