<script setup lang="ts">
/**
 * TuxDeskArticle — High-fidelity published article reading surface.
 * Renders prose mixed with canonical TUX module blocks, staleness alert, and feedback.
 */
import type { JSONContent } from "@tiptap/core";
import { splitDeskBlocks, renderDeskBody, type DeskBlock } from "../../utils/desk/render";
import TuxDeskModuleBlock from "./TuxDeskModuleBlock.vue";
import TuxStalenessBanner from "../TuxStalenessBanner.vue";
import TuxFeedback from "../TuxFeedback.vue";

interface Props {
  title?: string;
  kicker?: string;
  bodyJson?: JSONContent | null;
  html?: string;
  bodyMd?: string;
  stale?: boolean;
  verifiedUntil?: string | Date | null;
  lastVerified?: string | Date | null;
  reviewCadenceDays?: number;
  owner?: string;
  pageId?: string;
  showFeedback?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  kicker: "",
  bodyJson: null,
  html: "",
  bodyMd: "",
  stale: false,
  verifiedUntil: null,
  lastVerified: null,
  reviewCadenceDays: 90,
  owner: "",
  pageId: "",
  showFeedback: true,
});

const blocks = computed<DeskBlock[]>(() => {
  if (props.bodyJson) {
    return splitDeskBlocks(props.bodyJson);
  }
  return [];
});

const fallbackHtml = computed(() => {
  if (blocks.value.length > 0) return "";
  if (props.html) return props.html;
  return renderDeskBody({ bodyMd: props.bodyMd });
});
</script>

<template>
  <article class="tux-desk-article" data-testid="tux-desk-article">
    <!-- Header -->
    <header v-if="title || kicker" class="mb-8 space-y-2">
      <p v-if="kicker" class="eyebrow text-brand-primary m-0">{{ kicker }}</p>
      <h1 v-if="title" class="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary m-0">
        {{ title }}
      </h1>
    </header>

    <!-- Editorial Staleness Banner -->
    <TuxStalenessBanner
      :stale="stale"
      :verified-until="verifiedUntil"
      :last-verified="lastVerified"
      :review-cadence-days="reviewCadenceDays"
      :owner="owner"
      :page-id="pageId"
    />

    <!-- Mixed Prose & Module Blocks -->
    <div v-if="blocks.length > 0" class="tux-desk-article__body space-y-6">
      <template v-for="(block, index) in blocks" :key="index">
        <div
          v-if="block.type === 'html'"
          class="tux-prose"
          v-html="block.html"
        />
        <TuxDeskModuleBlock
          v-else-if="block.type === 'module'"
          :kind="block.kind"
          :payload="block.payload"
        />
      </template>
    </div>

    <!-- Fallback prose renderer -->
    <div
      v-else-if="fallbackHtml"
      class="tux-prose"
      v-html="fallbackHtml"
    />

    <!-- Reader Feedback Widget -->
    <TuxFeedback
      v-if="showFeedback"
      :page-id="pageId"
      class="mt-12"
    />
  </article>
</template>

<style scoped>
.tux-desk-article {
  max-width: 56rem;
  margin: 0 auto;
}
</style>
