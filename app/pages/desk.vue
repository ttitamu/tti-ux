<script setup lang="ts">
/**
 * /desk — Interactive Playground for Tux Desk Visual Web Builder.
 *
 * Demonstrates the full visual web builder with TUX components,
 * responsive device simulation, document outline navigator, dedicated
 * properties inspector, and live bidirectional source editing (Markdown/MDC, HTML, JSON).
 */
import type { JSONContent } from "@tiptap/core";
import TuxDeskWebBuilder from "../components/desk/TuxDeskWebBuilder.vue";
import {
  TUX_DESK_PRESETS,
  getDeskPreset,
  clonePresetDoc,
} from "../utils/desk/presets";

definePageMeta({
  fullWidth: true,
});

useHead({
  title: "Tux Desk · Visual Web Builder & Source Editor",
});

const route = useRoute();
const initialPresetId = (typeof route.query.preset === "string" && getDeskPreset(route.query.preset)) ? route.query.preset : "research-program";
const initialTitle = (typeof route.query.title === "string" && route.query.title.trim()) ? route.query.title.trim() : null;

const selectedPresetId = ref(initialPresetId);
const defaultPreset = getDeskPreset(initialPresetId)!;

const doc = ref<JSONContent>(clonePresetDoc(initialPresetId)!);
const pageMeta = ref({
  title: initialTitle || defaultPreset.title,
  slug: initialTitle ? initialTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : defaultPreset.suggestedSlug,
  reviewCadenceDays: defaultPreset.reviewCadenceDays,
  status: "draft",
});
const compiledHtml = ref<string>("");

function applyPreset(presetId: string) {
  const preset = getDeskPreset(presetId);
  if (!preset) return;
  const cloned = clonePresetDoc(presetId);
  if (cloned) {
    doc.value = cloned;
    selectedPresetId.value = presetId;
    pageMeta.value = {
      title: preset.title,
      slug: preset.suggestedSlug,
      reviewCadenceDays: preset.reviewCadenceDays,
      status: "draft",
    };
  }
}

function onResetDoc() {
  if (confirm(`Reset playground content back to "${getDeskPreset(selectedPresetId.value)?.title || 'selected'}" preset?`)) {
    applyPreset(selectedPresetId.value);
  }
}

function onUpdateHtml(html: string) {
  compiledHtml.value = html;
}

watch(
  () => pageMeta.value.slug,
  (newSlug) => {
    const matched = TUX_DESK_PRESETS.find((p) => p.suggestedSlug === newSlug);
    if (matched) {
      selectedPresetId.value = matched.id;
    }
  }
);
</script>

<template>
  <div class="space-y-4 w-full">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-5">
      <div class="space-y-1">
        <div class="flex flex-wrap items-center gap-2">
          <TuxBadge tone="primary">v3.0.0 Web Builder</TuxBadge>
          <span class="eyebrow">Zero-Terminal CMS Authoring Suite</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary m-0">
          Tux Desk Web Builder & Source Editor
        </h1>
        <p class="text-text-muted text-sm m-0">
          Visual block canvas, outline navigator, device simulator, and bidirectional Markdown/MDC & HTML source code editing.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2 self-start sm:self-auto">
        <!-- Preset Quick Switcher -->
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-raised border border-surface-border text-xs max-w-full">
          <UIcon name="lucide:layout-template" class="w-3.5 h-3.5 text-brand-primary shrink-0" />
          <span class="text-text-muted text-[11px] font-medium hidden md:inline">Preset:</span>
          <select
            v-model="selectedPresetId"
            data-test="preset-select"
            aria-label="Preset quick switcher"
            class="bg-transparent text-text-primary text-xs font-semibold focus:outline-none cursor-pointer max-w-[140px] sm:max-w-[220px] lg:max-w-[280px] xl:max-w-none truncate"
            @change="applyPreset(selectedPresetId)"
          >
            <option
              v-for="p in TUX_DESK_PRESETS"
              :key="p.id"
              :value="p.id"
              class="bg-surface-raised text-text-primary"
            >
              {{ p.title }} ({{ p.categoryLabel }})
            </option>
          </select>
        </div>

        <button
          type="button"
          class="px-3 py-1.5 text-xs font-semibold rounded-md bg-surface-raised border border-surface-border text-text-primary hover:border-brand-primary flex items-center gap-1.5 transition-colors"
          title="Reset back to preset defaults"
          @click="onResetDoc"
        >
          <UIcon name="lucide:rotate-ccw" class="w-3.5 h-3.5 text-text-muted" />
          <span>Reset</span>
        </button>

        <NuxtLink
          to="/admin"
          class="px-3 py-1.5 text-xs font-semibold rounded-md bg-brand-primary text-text-on-brand hover:opacity-95 flex items-center gap-1.5 transition-opacity"
        >
          <UIcon name="lucide:layout-dashboard" class="w-3.5 h-3.5" />
          <span>Go to Staff CMS Desk</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Web Builder Suite -->
    <TuxDeskWebBuilder
      v-model="doc"
      v-model:page-meta="pageMeta"
      @update:html="onUpdateHtml"
    >
      <template #actions>
        <TuxBadge tone="warning">
          Playground Sandbox
        </TuxBadge>
      </template>
    </TuxDeskWebBuilder>
  </div>
</template>
