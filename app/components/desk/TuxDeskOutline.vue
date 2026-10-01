<script setup lang="ts">
/**
 * TuxDeskOutline.vue — Document Structure Outline & Block Tree Navigator.
 * Enables quick navigation, reordering, duplicating, and deleting blocks in the document.
 */
import type { JSONContent } from "@tiptap/core";
import { moduleSpec, type ModuleKind, isModuleKind } from "../../utils/desk/modules";

interface Props {
  doc: JSONContent;
  selectedIndex?: number | null;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selectedIndex: null,
  disabled: false,
});

const emit = defineEmits<{
  (e: "select", index: number): void;
  (e: "move-up", index: number): void;
  (e: "move-down", index: number): void;
  (e: "duplicate", index: number): void;
  (e: "delete", index: number): void;
  (e: "insert-at", index: number, kind: ModuleKind | "paragraph" | "heading"): void;
  (e: "close"): void;
}>();

const blocks = computed(() => {
  const content = props.doc?.content || [];
  return content.map((node, index) => {
    let title = "Block";
    let subtitle = "";
    let icon = "lucide:box";
    let isModule = false;
    let kind = "";

    if (node.type === "deskModule") {
      isModule = true;
      const rawKind = String(node.attrs?.kind || "callout");
      kind = isModuleKind(rawKind) ? rawKind : "callout";
      const spec = moduleSpec(kind as ModuleKind);
      title = spec.label;
      const payload = (node.attrs?.payload || {}) as Record<string, string>;
      subtitle = payload.title || payload.heading || payload.eyebrow || payload.v1 || "";

      switch (kind) {
        case "hero": icon = "lucide:layout-template"; break;
        case "callout": icon = "lucide:alert-circle"; break;
        case "stats": icon = "lucide:bar-chart-3"; break;
        case "cards": icon = "lucide:grid"; break;
        case "split": icon = "lucide:columns"; break;
        case "steps": icon = "lucide:list-ordered"; break;
        case "cta": icon = "lucide:megaphone"; break;
      }
    } else if (node.type === "heading") {
      const level = node.attrs?.level || 2;
      title = `Heading ${level}`;
      subtitle = (node.content || []).map((n: any) => n.text || "").join("");
      icon = `lucide:heading-${level}`;
    } else if (node.type === "paragraph") {
      title = "Paragraph";
      subtitle = (node.content || []).map((n: any) => n.text || "").join("");
      icon = "lucide:pilcrow";
    } else if (node.type === "blockquote") {
      title = "Quote";
      subtitle = (node.content?.[0]?.content || []).map((n: any) => n.text || "").join("");
      icon = "lucide:quote";
    } else if (node.type === "bulletList") {
      title = "Bullet List";
      subtitle = `${node.content?.length || 0} items`;
      icon = "lucide:list";
    } else if (node.type === "orderedList") {
      title = "Numbered List";
      subtitle = `${node.content?.length || 0} items`;
      icon = "lucide:list-ordered";
    } else if (node.type === "codeBlock") {
      title = `Code (${node.attrs?.language || "plain"})`;
      subtitle = (node.content || []).map((n: any) => n.text || "").join("").slice(0, 30);
      icon = "lucide:code";
    } else if (node.type === "image") {
      title = "Image";
      subtitle = node.attrs?.src || "";
      icon = "lucide:image";
    } else if (node.type === "deskVideo") {
      title = "Video";
      subtitle = node.attrs?.src || "";
      icon = "lucide:video";
    }

    return {
      index,
      type: node.type,
      kind,
      isModule,
      title,
      subtitle: subtitle || "(empty)",
      icon,
    };
  });
});
</script>

<template>
  <aside class="tux-desk-outline flex flex-col h-full bg-surface-raised border-r border-surface-border text-xs">
    <!-- Header -->
    <div class="px-3.5 py-2.5 border-b border-surface-border flex items-center justify-between bg-surface-sunken">
      <div class="flex items-center gap-2">
        <UIcon name="lucide:list-tree" class="w-4 h-4 text-brand-primary" aria-hidden="true" />
        <span class="font-bold uppercase tracking-wider text-text-primary text-[11px]">Outline Navigator</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="font-mono text-[10px] text-text-muted px-1.5 py-0.5 rounded bg-surface-raised border border-surface-border">
          {{ blocks.length }} blocks
        </span>
        <button
          type="button"
          class="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-raised"
          title="Close Navigator"
          aria-label="Close Navigator"
          @click="emit('close')"
        >
          <UIcon name="lucide:x" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Tree Node List -->
    <div class="flex-1 overflow-y-auto p-2 space-y-1">
      <div
        v-for="b in blocks"
        :key="b.index"
        class="group relative rounded-lg border transition-all p-2 cursor-pointer flex items-center justify-between gap-2"
        :class="[
          selectedIndex === b.index
            ? 'bg-brand-primary/10 border-brand-primary shadow-xs'
            : 'bg-surface-sunken border-surface-border hover:border-brand-primary/40 hover:bg-surface-raised',
        ]"
        @click="emit('select', b.index)"
      >
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <UIcon
            :name="b.icon"
            class="w-4 h-4 flex-shrink-0"
            :class="b.isModule ? 'text-brand-primary' : 'text-text-muted'"
          />
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5">
              <span class="font-semibold text-text-primary truncate text-xs">{{ b.title }}</span>
              <span v-if="b.isModule" class="text-[9px] px-1 py-0.2 rounded font-mono uppercase bg-brand-primary/15 text-brand-primary">
                TUX
              </span>
            </div>
            <p class="text-[11px] text-text-muted truncate m-0 font-mono">
              {{ b.subtitle }}
            </p>
          </div>
        </div>

        <!-- Quick Action Buttons on Hover or Active -->
        <div
          v-if="!disabled"
          class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          :class="{ '!opacity-100': selectedIndex === b.index }"
          @click.stop
        >
          <button
            type="button"
            :disabled="b.index === 0"
            class="p-1 rounded text-text-muted hover:text-text-primary disabled:opacity-20 hover:bg-surface-raised"
            title="Move block up"
            aria-label="Move block up"
            @click="emit('move-up', b.index)"
          >
            <UIcon name="lucide:arrow-up" class="w-3 h-3" />
          </button>

          <button
            type="button"
            :disabled="b.index === blocks.length - 1"
            class="p-1 rounded text-text-muted hover:text-text-primary disabled:opacity-20 hover:bg-surface-raised"
            title="Move block down"
            aria-label="Move block down"
            @click="emit('move-down', b.index)"
          >
            <UIcon name="lucide:arrow-down" class="w-3 h-3" />
          </button>

          <button
            type="button"
            class="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-raised"
            title="Duplicate block"
            aria-label="Duplicate block"
            @click="emit('duplicate', b.index)"
          >
            <UIcon name="lucide:copy" class="w-3 h-3" />
          </button>

          <button
            type="button"
            class="p-1 rounded text-text-muted hover:text-rose-500 hover:bg-surface-raised"
            title="Delete block"
            aria-label="Delete block"
            @click="emit('delete', b.index)"
          >
            <UIcon name="lucide:trash-2" class="w-3 h-3" />
          </button>
        </div>
      </div>

      <div v-if="blocks.length === 0" class="p-6 text-center text-text-muted text-xs">
        No blocks yet. Use the inserter to add your first section.
      </div>
    </div>
  </aside>
</template>

<style scoped>
.tux-desk-outline {
  width: 260px;
  min-width: 240px;
}
</style>
