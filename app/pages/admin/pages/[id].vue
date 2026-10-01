<script setup lang="ts">
/**
 * /admin/pages/[id] — TUX Editorial Web Builder & Page Editor.
 * Visual authoring canvas & bidirectional source code editor connecting TipTap to the in-process database backend.
 */
import type { JSONContent } from "@tiptap/core";
import TuxDeskWebBuilder from "../../../components/desk/TuxDeskWebBuilder.vue";

definePageMeta({
  fullWidth: true,
});

const route = useRoute();
const router = useRouter();
const pageId = computed(() => String(route.params.id));

const { data: page, refresh, error } = await useAsyncData(
  `admin-page-${pageId.value}`,
  () => $fetch<any>(`/api/pages/${pageId.value}`)
);

if (error.value && !page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found in Desk database.",
  });
}

useHead({
  title: computed(() => `${page.value?.title || 'Edit Page'} · TUX Admin Web Builder`),
});

const formTitle = ref(page.value?.title || "");
const formSlug = ref(page.value?.slug || "");
const formCadence = ref(page.value?.reviewCadenceDays || 90);
const bodyJson = ref<JSONContent>(page.value?.revision?.bodyJson || { type: "doc", content: [{ type: "paragraph" }] });

const pageMeta = computed({
  get: () => ({
    title: formTitle.value,
    slug: formSlug.value,
    reviewCadenceDays: formCadence.value,
    status: page.value?.status,
  }),
  set: (val) => {
    formTitle.value = val.title;
    formSlug.value = val.slug;
    formCadence.value = val.reviewCadenceDays;
  },
});

const saving = ref(false);
const publishing = ref(false);
const statusMessage = ref("");

// Revisions History Panel
const showRevisions = ref(false);
const revisionsList = ref<any[]>([]);
const loadingRevisions = ref(false);
const rollingBackId = ref<string | null>(null);

async function loadRevisions() {
  loadingRevisions.value = true;
  try {
    revisionsList.value = await $fetch(`/api/pages/${pageId.value}/revisions`);
  } catch (err) {
    console.error("Failed to load revisions", err);
  } finally {
    loadingRevisions.value = false;
  }
}

onMounted(() => {
  loadRevisions();
});

const highlightItems = computed(() => [
  {
    label: "Status",
    value: (page.value?.status || "draft").toUpperCase(),
    tone: page.value?.status === "published" ? "positive" : "neutral",
  },
  {
    label: "Review Cadence",
    value: `${formCadence.value} Days`,
    change: formCadence.value <= 30 ? "High Frequency" : "Standard",
    changeTone: "neutral" as const,
  },
  {
    label: "Verification",
    value: page.value?.stale ? "EXPIRED" : (page.value?.verifiedUntil ? "CURRENT" : "UNVERIFIED"),
    change: page.value?.stale ? "Needs Review" : "Valid",
    changeTone: page.value?.stale ? ("negative" as const) : ("positive" as const),
  },
  {
    label: "Revisions",
    value: `${revisionsList.value.length || 1} Snapshots`,
  },
]);

function toggleRevisions() {
  showRevisions.value = !showRevisions.value;
  if (showRevisions.value && revisionsList.value.length === 0) {
    loadRevisions();
  }
}

async function rollbackTo(revId: string) {
  if (!confirm("Are you sure you want to rollback to this revision? Current unsaved draft changes will be replaced.")) return;
  rollingBackId.value = revId;
  try {
    const rolledBack = await $fetch<any>(`/api/pages/${pageId.value}/revisions/${revId}/rollback`, {
      method: "POST",
    });
    if (rolledBack?.revision?.bodyJson) {
      bodyJson.value = rolledBack.revision.bodyJson;
    }
    statusMessage.value = "Rolled back to selected revision successfully!";
    await Promise.all([refresh(), loadRevisions()]);
  } catch (err) {
    alert("Failed to rollback revision.");
  } finally {
    rollingBackId.value = null;
  }
}

async function saveDraft() {
  saving.value = true;
  statusMessage.value = "";
  try {
    await $fetch(`/api/pages/${pageId.value}`, {
      method: "PUT",
      body: {
        title: formTitle.value.trim(),
        slug: formSlug.value.trim(),
        reviewCadenceDays: Number(formCadence.value),
        bodyJson: bodyJson.value,
      },
    });
    statusMessage.value = "Draft saved successfully.";
    await refresh();
    if (showRevisions.value) loadRevisions();
  } catch (err) {
    statusMessage.value = "Failed to save draft.";
  } finally {
    saving.value = false;
  }
}

async function publishPage() {
  publishing.value = true;
  statusMessage.value = "";
  try {
    // First save draft
    await $fetch(`/api/pages/${pageId.value}`, {
      method: "PUT",
      body: {
        title: formTitle.value.trim(),
        slug: formSlug.value.trim(),
        reviewCadenceDays: Number(formCadence.value),
        bodyJson: bodyJson.value,
      },
    });
    // Then trigger publish
    await $fetch(`/api/pages/${pageId.value}/publish`, {
      method: "POST",
    });
    statusMessage.value = "Page published successfully! Public route live at /p/" + formSlug.value;
    await refresh();
    if (showRevisions.value) loadRevisions();
  } catch (err) {
    statusMessage.value = "Failed to publish page.";
  } finally {
    publishing.value = false;
  }
}
</script>

<template>
  <div v-if="page" class="space-y-4 w-full">
    <!-- Breadcrumbs Bar -->
    <div class="flex items-center justify-between gap-4 border-b border-surface-border pb-3">
      <div class="flex items-center gap-3">
        <NuxtLink to="/admin" class="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-primary">
          <UIcon name="lucide:arrow-left" class="w-4 h-4" />
          <span>Back to Editorial Desk</span>
        </NuxtLink>
        <span class="text-text-muted">/</span>
        <span class="text-xs font-mono text-text-muted">ID: {{ pageId }}</span>
      </div>

      <div v-if="statusMessage" class="text-xs font-medium text-emerald-600 dark:text-emerald-400">
        {{ statusMessage }}
      </div>
    </div>

    <!-- Record Highlights Summary Bar -->
    <TuxRecordHighlights
      :title="formTitle || 'Untitled Document'"
      :eyebrow="page.visibility === 'public' ? 'Public Documentation Article' : 'Internal Research Document'"
      icon="lucide:file-text"
      :items="highlightItems"
    >
      <template #badge>
        <div class="flex items-center gap-1.5">
          <TuxBadge :tone="page.status === 'published' ? 'success' : 'warning'" dot>
            {{ page.status.toUpperCase() }}
          </TuxBadge>
          <TuxBadge v-if="page.stale" tone="danger" dot>
            EXPIRED
          </TuxBadge>
        </div>
      </template>

      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer"
          :class="showRevisions ? 'bg-brand-primary text-text-on-brand border-brand-primary' : 'bg-surface-raised border-surface-border text-text-primary hover:border-brand-primary'"
          @click="toggleRevisions"
        >
          <UIcon name="lucide:history" class="w-3.5 h-3.5" />
          <span>History ({{ revisionsList.length }})</span>
        </button>

        <NuxtLink
          v-if="page.status === 'published'"
          :to="`/p/${page.slug}`"
          target="_blank"
          class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-surface-raised border border-surface-border text-text-primary hover:border-brand-primary transition-colors"
        >
          <UIcon name="lucide:external-link" class="w-3.5 h-3.5" />
          <span>View Live</span>
        </NuxtLink>

        <TuxButton
          intent="secondary"
          size="sm"
          :disabled="saving || publishing"
          @click="saveDraft"
        >
          <UIcon v-if="saving" name="lucide:loader-2" class="w-3.5 h-3.5 animate-spin mr-1" />
          <UIcon v-else name="lucide:save" class="w-3.5 h-3.5 mr-1" />
          Save Draft
        </TuxButton>

        <TuxButton
          intent="primary"
          size="sm"
          :disabled="saving || publishing"
          @click="publishPage"
        >
          <UIcon v-if="publishing" name="lucide:loader-2" class="w-3.5 h-3.5 animate-spin mr-1" />
          <UIcon v-else name="lucide:send" class="w-3.5 h-3.5 mr-1" />
          Publish Page
        </TuxButton>
      </template>
    </TuxRecordHighlights>

    <!-- Revisions History Drawer -->
    <div
      v-if="showRevisions"
      class="p-5 rounded-xl bg-surface-raised border border-surface-border space-y-4"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="lucide:history" class="w-4 h-4 text-brand-primary" />
          <h3 class="text-sm font-bold text-text-primary uppercase tracking-wider m-0">
            Document Revision History
          </h3>
        </div>
        <button
          type="button"
          class="text-xs text-text-muted hover:text-text-primary"
          @click="showRevisions = false"
        >
          Close
        </button>
      </div>

      <div v-if="loadingRevisions" class="py-6 text-center text-xs text-text-muted">
        Loading revisions...
      </div>

      <div v-else-if="revisionsList.length === 0" class="py-6 text-center text-xs text-text-muted">
        No revision records found for this page.
      </div>

      <div v-else class="space-y-2 max-h-60 overflow-y-auto pr-1">
        <div
          v-for="(rev, idx) in revisionsList"
          :key="rev.id"
          class="p-3 rounded-lg bg-surface-sunken border border-surface-border flex items-center justify-between gap-4"
        >
          <div class="space-y-0.5 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-bold text-text-primary">
                Rev #{{ revisionsList.length - idx }}
              </span>
              <span v-if="rev.id === page.draftRevisionId" class="text-xs px-1.5 py-0.2 rounded bg-brand-primary text-text-on-brand font-mono">
                Current Draft
              </span>
              <span v-if="rev.id === page.liveRevisionId" class="text-xs px-1.5 py-0.2 rounded bg-emerald-600 text-white font-mono">
                Published Live
              </span>
              <span class="text-xs text-text-muted font-mono">
                {{ new Date(rev.createdAt).toLocaleString() }}
              </span>
            </div>
            <p class="text-xs text-text-muted truncate m-0 font-mono">
              {{ rev.id }} · author: {{ rev.authorUserId }}
            </p>
          </div>

          <button
            v-if="rev.id !== page.draftRevisionId"
            type="button"
            :disabled="rollingBackId === rev.id"
            class="px-2.5 py-1 text-xs font-semibold rounded bg-surface-raised border border-surface-border text-text-primary hover:border-brand-primary hover:text-brand-primary transition-colors flex items-center gap-1 flex-shrink-0"
            @click="rollbackTo(rev.id)"
          >
            <UIcon v-if="rollingBackId === rev.id" name="lucide:loader-2" class="w-3 h-3 animate-spin" />
            <UIcon v-else name="lucide:rotate-ccw" class="w-3 h-3" />
            Rollback
          </button>
        </div>
      </div>
    </div>

    <!-- Web Builder Suite -->
    <TuxDeskWebBuilder
      v-model="bodyJson"
      v-model:page-meta="pageMeta"
    >
      <template #actions>
        <TuxButton
          intent="secondary"
          :disabled="saving || publishing"
          @click="saveDraft"
        >
          <UIcon v-if="saving" name="lucide:loader-2" class="w-3.5 h-3.5 animate-spin mr-1" />
          <UIcon v-else name="lucide:save" class="w-3.5 h-3.5 mr-1" />
          Save Draft
        </TuxButton>
        <TuxButton
          intent="primary"
          :disabled="saving || publishing"
          @click="publishPage"
        >
          <UIcon v-if="publishing" name="lucide:loader-2" class="w-3.5 h-3.5 animate-spin mr-1" />
          <UIcon v-else name="lucide:send" class="w-3.5 h-3.5 mr-1" />
          Publish Page
        </TuxButton>
      </template>
    </TuxDeskWebBuilder>
  </div>
</template>
