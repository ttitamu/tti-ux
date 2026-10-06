<script setup lang="ts">
/**
 * /p/[slug] — Public Published Page Route for TUX Desk.
 * High-performance rendered article surface for pages authored through the visual editorial desk.
 */
import TuxDeskArticle from "../../components/desk/TuxDeskArticle.vue";

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));

const { data: page, error } = await useAsyncData(
  `public-desk-page-${slug.value}`,
  () => $fetch<any>(`/api/public/pages/${slug.value}`),
  { watch: [slug] }
);

if (error.value || !page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `No published page found at "/p/${slug.value}"`,
  });
}

useHead({
  title: computed(() => `${page.value?.title || 'Documentation'} · TUX`),
});

const crumbs = computed(() => [
  { label: "Home", to: "/" },
  { label: "Desk", to: "/admin" },
  { label: page.value?.title || slug.value },
]);
</script>

<template>
  <div v-if="page" class="space-y-8">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <TuxBreadcrumbs :trail="crumbs" />
      <TuxDocSearch class="sm:max-w-xs" />
    </div>

    <div class="xl:grid xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_340px] gap-10 xl:gap-12 2xl:gap-16 items-start">
      <div class="min-w-0">
        <TuxDeskArticle
          :title="page.title"
          :body-json="page.revision?.bodyJson"
          :body-md="page.revision?.bodyMd"
          :stale="page.stale"
          :verified-until="page.verifiedUntil"
          :review-cadence-days="page.reviewCadenceDays"
          :owner="page.owner?.name || 'TTI Mobility Research Group'"
          :page-id="page.slug"
          show-feedback
        />
      </div>

      <!-- Right-rail sticky Table of Contents -->
      <aside class="hidden xl:block sticky top-20">
        <TuxTOC target="article" />
      </aside>
    </div>
  </div>
</template>
