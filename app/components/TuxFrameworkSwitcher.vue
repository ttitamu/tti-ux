<script setup lang="ts">
/**
 * TuxFrameworkSwitcher — interactive framework preference switcher for
 * the TTI-UX component library and showcase surfaces.
 *
 * Lets developers instantly switch all showcase examples between:
 *   - Vue 3 / Nuxt (@tti/tti-ux)
 *   - React JSX (@tti/tti-ux-react)
 *   - Web Components (@tti/tti-ux-elements)
 *   - .NET Razor / Blazor (Tti.Tux.AspNetCore / Blazor)
 *
 * Modes:
 *   - "compact"   : Small dropdown button for headers/toolbars
 *   - "segmented" : Inline pill strip for documentation pages
 *   - "auto"      : Segmented on xl+, dropdown on smaller screens
 */
import { computed } from "vue";
import { useTuxFramework, type TuxFrameworkId } from "../composables/useTuxFramework";

interface Props {
  /** Display mode: "compact" (dropdown) | "segmented" (pill strip) | "auto" */
  mode?: "compact" | "segmented" | "auto";
}

const props = withDefaults(defineProps<Props>(), {
  mode: "compact",
});

const { framework, setFramework, currentMeta, frameworks } = useTuxFramework();

const menuItems = computed(() => [
  frameworks.map((f) => ({
    label: f.label,
    icon: f.icon,
    description: f.description,
    badge: f.badge,
    active: framework.value === f.id,
    onSelect: () => setFramework(f.id, { notify: true }),
  })),
]);
</script>

<template>
  <div class="tux-framework-switcher inline-flex items-center">
    <!-- Segmented Mode -->
    <div
      v-if="props.mode === 'segmented' || props.mode === 'auto'"
      :class="[
        'items-center p-0.5 rounded-md bg-surface-sunken border border-surface-border',
        props.mode === 'auto' ? 'hidden xl:inline-flex' : 'inline-flex',
      ]"
      role="tablist"
      aria-label="Preferred code framework"
    >
      <button
        v-for="f in frameworks"
        :key="f.id"
        type="button"
        role="tab"
        :aria-selected="framework === f.id"
        class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer"
        :class="
          framework === f.id
            ? 'bg-surface-raised text-brand-primary border border-surface-border shadow-xs font-bold'
            : 'text-text-muted hover:text-text-primary hover:bg-surface-raised/50 border border-transparent'
        "
        :title="`${f.label} (${f.targetPackage})`"
        @click="setFramework(f.id, { notify: true })"
      >
        <UIcon :name="f.icon" class="w-3.5 h-3.5" />
        <span>{{ f.shortLabel }}</span>
      </button>
    </div>

    <!-- Compact Dropdown Mode -->
    <div
      v-if="props.mode === 'compact' || props.mode === 'auto'"
      :class="props.mode === 'auto' ? 'hidden sm:inline-flex xl:hidden' : 'inline-flex'"
    >
      <UDropdownMenu :items="menuItems" :ui="{ content: 'w-64' }">
        <button
          type="button"
          class="tux-framework-btn inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-semibold bg-surface-sunken border border-surface-border rounded-md text-text-primary hover:bg-surface-raised hover:border-brand-primary transition-colors cursor-pointer focus:outline-hidden whitespace-nowrap shrink-0"
          :title="`Preferred code syntax: ${currentMeta.label} (click to switch)`"
          aria-label="Select preferred framework syntax"
        >
          <UIcon :name="currentMeta.icon" class="w-3.5 h-3.5 text-brand-primary shrink-0" />
          <span class="hidden xl:inline font-sans text-xs font-semibold text-text-secondary whitespace-nowrap">Code:</span>
          <span class="font-bold text-text-primary whitespace-nowrap">{{ currentMeta.shortLabel }}</span>
          <UIcon name="lucide:chevron-down" class="w-3 h-3 text-text-muted ml-0.5 shrink-0" />
        </button>

        <template #item-trailing="{ item }">
          <UIcon
            v-if="item.active"
            name="lucide:check"
            class="w-4 h-4 text-brand-primary ml-auto"
          />
          <span
            v-else-if="item.badge"
            class="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-surface-sunken border border-surface-border text-text-muted ml-auto"
          >
            {{ item.badge }}
          </span>
        </template>
      </UDropdownMenu>
    </div>
  </div>
</template>

<style scoped>
.tux-framework-btn {
  letter-spacing: 0.02em;
}
</style>
