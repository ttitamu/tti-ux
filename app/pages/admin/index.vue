<script setup lang="ts">
/**
 * /admin — TUX Editorial Desk Dashboard.
 *
 * Self-hosted CMS editorial desk for research personnel and communicators.
 * Staff can author, review, and publish documentation without terminal commands or git commits.
 */
import TuxDeskPresetPicker from "../../components/desk/TuxDeskPresetPicker.vue";
import type { TuxDeskPreset } from "../../utils/desk/presets";

useHead({
  title: "Editorial Desk · TUX Admin",
});

interface DeskPage {
  id: string;
  slug: string;
  title: string;
  status: string;
  visibility: string;
  updatedAt: string;
  verifiedUntil: string | null;
  reviewCadenceDays: number;
  stale: boolean;
}

interface DeskIssue {
  id: string;
  pageId: string;
  pageTitle: string;
  pageSlug: string;
  kind: string;
  status: string;
  payload: {
    vote?: string;
    reason?: string;
    note?: string;
    sessionId?: string;
    resolvedNote?: string;
    resolvedAt?: string;
  };
  createdAt: string;
}

interface SystemStats {
  status: string;
  version: string;
  engine: string;
  counts: {
    totalPages: number;
    publishedPages: number;
    draftPages: number;
    stalePages: number;
    totalRevisions: number;
    openIssues: number;
    totalIssues: number;
  };
  uptimeSeconds: number;
}

const activeTab = ref<"pages" | "issues">("pages");

const { data: pages, refresh: refreshPages } = await useAsyncData<DeskPage[]>(
  "admin-pages-list",
  () => $fetch("/api/pages")
);

const { data: systemStats, refresh: refreshStats } = await useAsyncData<SystemStats>(
  "admin-system-stats",
  () => $fetch("/api/system/stats")
);

const { data: issuesList, refresh: refreshIssues } = await useAsyncData<DeskIssue[]>(
  "admin-issues-list",
  () => $fetch("/api/issues")
);

const newTitle = ref("");
const creating = ref(false);
const searchQuery = ref("");
const statusFilter = ref("all");
const issueFilter = ref("all");
const resolvingId = ref<string | null>(null);
const showPresetDrawer = ref(false);

async function createPage(preset?: TuxDeskPreset) {
  const title = preset ? preset.title : newTitle.value.trim();
  if (!title) return;
  creating.value = true;
  try {
    const payload: any = { title };
    if (preset) {
      payload.slug = preset.suggestedSlug;
      payload.bodyJson = preset.doc;
      payload.reviewCadenceDays = preset.reviewCadenceDays;
    }
    const res = await $fetch<{ id: string }>("/api/pages", {
      method: "POST",
      body: payload,
    });
    newTitle.value = "";
    showPresetDrawer.value = false;
    await navigateTo(`/admin/pages/${res.id}`);
  } catch (err) {
    // If backend API endpoint is unavailable (e.g. static site preview mode),
    // fallback seamlessly to the interactive client-side Tux Desk Web Builder playground!
    const presetId = preset?.id || "research-program";
    await navigateTo(`/desk?title=${encodeURIComponent(title)}&preset=${presetId}`);
  } finally {
    creating.value = false;
  }
}

async function resolveIssue(id: string) {
  resolvingId.value = id;
  try {
    await $fetch(`/api/issues/${id}/resolve`, {
      method: "POST",
      body: { note: "Resolved by editorial staff in TUX Admin" },
    });
    await Promise.all([refreshIssues(), refreshStats()]);
  } catch (err) {
    alert("Failed to resolve issue.");
  } finally {
    resolvingId.value = null;
  }
}

const filteredPages = computed(() => {
  let list = pages.value || [];
  if (statusFilter.value !== "all") {
    list = list.filter((p) => p.status === statusFilter.value);
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
    );
  }
  return list;
});

const filteredIssues = computed(() => {
  let list = issuesList.value || [];
  if (issueFilter.value !== "all") {
    list = list.filter((i) => i.status === issueFilter.value);
  }
  return list;
});
</script>

<template>
  <div class="space-y-8 w-full max-w-7xl 2xl:max-w-[1536px] mx-auto">
    <!-- Header with Live Telemetry -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <TuxBadge tone="primary">Zero-Terminal CMS</TuxBadge>
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-semibold bg-surface-sunken border border-surface-border text-text-muted">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {{ systemStats?.engine || "PGlite Wasm" }} // v{{ systemStats?.version || "3.0.0" }}
          </span>
        </div>
        <h1 class="text-3xl font-bold tracking-tight text-text-primary m-0">
          Editorial Desk
        </h1>
        <p class="text-text-muted text-sm m-0">
          Self-hosted documentation platform for TTI research groups, centers, and staff.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink to="/desk" class="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:underline">
          <UIcon name="lucide:layout-template" class="w-4 h-4" />
          Open Editor Playground
        </NuxtLink>
      </div>
    </div>

    <!-- Live Telemetry Metric Counters -->
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
      <div class="p-4 rounded-xl bg-surface-raised border border-surface-border">
        <p class="text-xs text-text-muted font-semibold uppercase">Total Pages</p>
        <p class="text-2xl font-bold text-text-primary m-0">{{ systemStats?.counts?.totalPages ?? (pages?.length || 0) }}</p>
      </div>
      <div class="p-4 rounded-xl bg-surface-raised border border-surface-border">
        <p class="text-xs text-text-muted font-semibold uppercase">Published</p>
        <p class="text-2xl font-bold text-emerald-600 m-0">{{ systemStats?.counts?.publishedPages ?? 0 }}</p>
      </div>
      <div class="p-4 rounded-xl bg-surface-raised border border-surface-border">
        <p class="text-xs text-text-muted font-semibold uppercase">Drafts</p>
        <p class="text-2xl font-bold text-amber-600 m-0">{{ systemStats?.counts?.draftPages ?? 0 }}</p>
      </div>
      <div class="p-4 rounded-xl bg-surface-raised border border-surface-border">
        <p class="text-xs text-text-muted font-semibold uppercase">Stale Alerts</p>
        <p class="text-2xl font-bold" :class="(systemStats?.counts?.stalePages ?? 0) > 0 ? 'text-red-600' : 'text-text-muted'">
          {{ systemStats?.counts?.stalePages ?? 0 }}
        </p>
      </div>
      <div class="p-4 rounded-xl bg-surface-raised border border-surface-border">
        <p class="text-xs text-text-muted font-semibold uppercase">Open Issues</p>
        <p class="text-2xl font-bold" :class="(systemStats?.counts?.openIssues ?? 0) > 0 ? 'text-amber-500' : 'text-text-muted'">
          {{ systemStats?.counts?.openIssues ?? 0 }}
        </p>
      </div>
    </div>

    <!-- Tab Switcher -->
    <div class="flex items-center gap-2 border-b border-surface-border pb-2 overflow-x-auto max-w-full">
      <button
        type="button"
        class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 sm:gap-2 shrink-0"
        :class="activeTab === 'pages' ? 'bg-brand-primary text-text-on-brand shadow-sm' : 'text-text-muted hover:text-text-primary hover:bg-surface-raised'"
        @click="activeTab = 'pages'"
      >
        <UIcon name="lucide:files" class="w-4 h-4" />
        <span class="sm:hidden">Pages</span>
        <span class="hidden sm:inline">Documentation Pages</span>
        <span class="text-xs px-1.5 py-0.2 rounded bg-black/20 text-white font-mono">
          {{ filteredPages.length }}
        </span>
      </button>

      <button
        type="button"
        class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 sm:gap-2 shrink-0"
        :class="activeTab === 'issues' ? 'bg-brand-primary text-text-on-brand shadow-sm' : 'text-text-muted hover:text-text-primary hover:bg-surface-raised'"
        @click="activeTab = 'issues'"
      >
        <UIcon name="lucide:message-square-warning" class="w-4 h-4" />
        <span class="sm:hidden">Issues Triage</span>
        <span class="hidden sm:inline">Reader Issues Triage</span>
        <span
          class="text-xs px-1.5 py-0.2 rounded font-mono"
          :class="(systemStats?.counts?.openIssues ?? 0) > 0 ? 'bg-amber-500 text-black font-bold' : 'bg-surface-sunken text-text-muted'"
        >
          {{ systemStats?.counts?.openIssues ?? 0 }}
        </span>
      </button>
    </div>

    <!-- TAB 1: Documentation Pages -->
    <div v-if="activeTab === 'pages'" class="space-y-4">
      <!-- Enterprise Action Ribbon -->
      <TuxCommandBar>
        <template #actions>
          <div class="flex flex-wrap items-center gap-2 max-w-full">
            <input
              v-model="newTitle"
              type="text"
              placeholder="Quick create page title (e.g. Smart Corridors)..."
              class="px-3 py-1 text-xs rounded bg-surface-raised border border-surface-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary w-full sm:w-80 min-w-0"
              @keydown.enter="createPage()"
            />
            <TuxButton
              intent="primary"
              size="sm"
              icon="lucide:plus"
              :disabled="creating || !newTitle.trim()"
              @click="createPage()"
            >
              New Page
            </TuxButton>
            <TuxButton
              intent="secondary"
              size="sm"
              icon="lucide:layout-template"
              :disabled="creating"
              @click="showPresetDrawer = !showPresetDrawer"
            >
              From Preset
            </TuxButton>
          </div>
        </template>

        <template #views>
          <div class="flex items-center gap-0.5 bg-surface-raised p-0.5 rounded border border-surface-border text-xs font-mono">
            <button
              v-for="f in ['all', 'published', 'draft']"
              :key="f"
              type="button"
              class="px-2 py-0.5 rounded capitalize transition-colors"
              :class="statusFilter === f ? 'bg-brand-primary text-text-on-brand font-bold' : 'text-text-muted hover:text-text-primary'"
              @click="statusFilter = f"
            >
              {{ f }}
            </button>
          </div>
        </template>

        <template #filter>
          <div class="relative flex items-center">
            <UIcon name="lucide:search" class="w-3.5 h-3.5 absolute left-2.5 text-text-muted pointer-events-none" />
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Filter pages..."
              class="pl-8 pr-2.5 py-1 text-xs rounded bg-surface-raised border border-surface-border text-text-primary focus:outline-none focus:border-brand-primary"
            />
          </div>
        </template>
      </TuxCommandBar>

      <!-- Presets Drawer -->
      <TuxDeskPresetPicker
        v-if="showPresetDrawer"
        :confirm-replace="false"
        @select="createPage"
        @close="showPresetDrawer = false"
      />

      <!-- Page List Table -->
      <div class="border border-surface-border rounded-xl overflow-hidden bg-surface-raised shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-surface-sunken text-xs text-text-muted uppercase border-b border-surface-border">
              <tr>
                <th class="py-3 px-4">Title & Route</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4">Verification</th>
                <th class="py-3 px-4">Cadence</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-border">
              <tr v-for="page in filteredPages" :key="page.id" class="hover:bg-surface-sunken/50 transition-colors">
                <td class="py-3.5 px-4">
                  <NuxtLink :to="`/admin/pages/${page.id}`" class="font-bold text-text-primary hover:text-brand-primary block">
                    {{ page.title }}
                  </NuxtLink>
                  <span class="text-xs text-text-muted font-mono">/p/{{ page.slug }}</span>
                </td>
                <td class="py-3.5 px-4">
                  <TuxBadge
                    :tone="page.status === 'published' ? 'success' : 'warning'"
                    :dot="page.status === 'published'"
                  >
                    {{ page.status.toUpperCase() }}
                  </TuxBadge>
                </td>
                <td class="py-3.5 px-4">
                  <TuxBadge v-if="page.stale" tone="danger" dot>
                    EXPIRED
                  </TuxBadge>
                  <TuxBadge v-else-if="page.verifiedUntil" tone="success">
                    VERIFIED
                  </TuxBadge>
                  <TuxBadge v-else tone="neutral">
                    UNVERIFIED
                  </TuxBadge>
                </td>
                <td class="py-3.5 px-4 text-xs text-text-muted">
                  {{ page.reviewCadenceDays }} days
                </td>
                <td class="py-3.5 px-4 text-right space-x-2">
                  <NuxtLink
                    :to="`/admin/pages/${page.id}`"
                    class="inline-flex items-center gap-1 text-xs font-semibold text-text-primary hover:text-brand-primary px-2.5 py-1 rounded bg-surface-sunken border border-surface-border"
                  >
                    <UIcon name="lucide:pencil" class="w-3.5 h-3.5" />
                    Edit
                  </NuxtLink>

                  <NuxtLink
                    v-if="page.status === 'published'"
                    :to="`/p/${page.slug}`"
                    target="_blank"
                    class="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline"
                  >
                    View Live ↗
                  </NuxtLink>
                </td>
              </tr>

              <tr v-if="filteredPages.length === 0">
                <td colspan="5" class="py-8 text-center text-text-muted text-sm">
                  No documentation pages found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: Reader Issues Triage -->
    <div v-else-if="activeTab === 'issues'" class="space-y-6">
      <div class="flex items-center justify-between gap-3">
        <p class="text-sm text-text-muted m-0">
          Automated reader feedback and reported documentation defects captured by &lt;TuxFeedback&gt;.
        </p>

        <div class="flex items-center gap-1.5">
          <button
            v-for="f in ['all', 'open', 'resolved']"
            :key="f"
            type="button"
            class="px-2.5 py-1 text-xs font-semibold rounded capitalize"
            :class="issueFilter === f ? 'bg-brand-primary text-text-on-brand' : 'bg-surface-raised text-text-muted hover:text-text-primary'"
            @click="issueFilter = f"
          >
            {{ f }}
          </button>
        </div>
      </div>

      <div class="border border-surface-border rounded-xl overflow-hidden bg-surface-raised shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-surface-sunken text-xs text-text-muted uppercase border-b border-surface-border">
              <tr>
                <th class="py-3 px-4">Reason & Target Page</th>
                <th class="py-3 px-4">Reader Feedback / Notes</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4">Reported</th>
                <th class="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-border">
              <tr v-for="issue in filteredIssues" :key="issue.id" class="hover:bg-surface-sunken/50 transition-colors">
                <td class="py-3.5 px-4">
                  <div class="space-y-1">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-bold uppercase"
                      :class="issue.payload?.reason === 'outdated' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' : 'bg-surface-sunken text-text-primary border border-surface-border'"
                    >
                      <UIcon name="lucide:alert-circle" class="w-3 h-3" />
                      {{ issue.payload?.reason || issue.kind }}
                    </span>
                    <NuxtLink :to="`/admin/pages/${issue.pageId}`" class="block font-semibold text-text-primary hover:text-brand-primary text-sm">
                      {{ issue.pageTitle }}
                    </NuxtLink>
                  </div>
                </td>
                <td class="py-3.5 px-4 max-w-md">
                  <p class="text-xs text-text-secondary m-0 leading-relaxed italic">
                    "{{ issue.payload?.note || 'No additional details provided.' }}"
                  </p>
                  <p v-if="issue.payload?.resolvedNote" class="text-xs text-emerald-600 dark:text-emerald-400 mt-1 m-0">
                    Resolution: {{ issue.payload.resolvedNote }}
                  </p>
                </td>
                <td class="py-3.5 px-4">
                  <TuxBadge :tone="issue.status === 'resolved' ? 'success' : 'warning'">
                    {{ issue.status }}
                  </TuxBadge>
                </td>
                <td class="py-3.5 px-4 text-xs text-text-muted font-mono">
                  {{ new Date(issue.createdAt).toLocaleDateString() }}
                </td>
                <td class="py-3.5 px-4 text-right">
                  <button
                    v-if="issue.status === 'open'"
                    type="button"
                    :disabled="resolvingId === issue.id"
                    class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-brand-primary text-text-on-brand hover:opacity-90 transition-opacity"
                    @click="resolveIssue(issue.id)"
                  >
                    <UIcon v-if="resolvingId === issue.id" name="lucide:loader-2" class="w-3.5 h-3.5 animate-spin" />
                    <UIcon v-else name="lucide:check-circle" class="w-3.5 h-3.5" />
                    Resolve
                  </button>
                  <span v-else class="text-xs text-text-muted font-semibold flex items-center justify-end gap-1">
                    <UIcon name="lucide:check" class="w-3.5 h-3.5 text-emerald-600" />
                    Resolved
                  </span>
                </td>
              </tr>

              <tr v-if="filteredIssues.length === 0">
                <td colspan="5" class="py-8 text-center text-text-muted text-sm">
                  No reader issues currently logged.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
