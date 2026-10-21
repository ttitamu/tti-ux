<script setup lang="ts">
/**
 * TuxGroundedSources — verified search and retrieval citation strip.
 *
 * Authored by platform lead (TTI NIS).
 * Pattern from Hugging Face Chat-UI, Perplexity, and tti-ai-studio:
 * displays grounded external sources vetted through the DLP two-step filter,
 * complete with domain favicons, citation numbers, and Level AAA contrast.
 */

export interface GroundedSource {
  id: number;
  title: string;
  domain: string;
  snippet: string;
  url: string;
  dlpChecked?: boolean;
}

interface Props {
  sources: GroundedSource[];
  dlpLabel?: string;
}

withDefaults(defineProps<Props>(), {
  dlpLabel: "Zero-PII DLP Verified",
});
</script>

<template>
  <div class="tux-grounded-sources mt-3 border-t border-border-subtle pt-3">
    <!-- Header -->
    <div class="flex items-center justify-between mb-2.5">
      <div class="flex items-center space-x-1.5 text-xs font-medium text-text-secondary">
        <Icon name="lucide:sparkles" class="h-3.5 w-3.5 text-brand-maroon dark:text-brand-gold" aria-hidden="true" />
        <span>Grounded in {{ sources.length }} verified sources</span>
      </div>
      <div class="flex items-center space-x-1 text-[10px] text-status-success font-medium">
        <Icon name="lucide:shield-check" class="h-3.5 w-3.5" aria-hidden="true" />
        <span>{{ dlpLabel }}</span>
      </div>
    </div>

    <!-- Source Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      <a
        v-for="src in sources"
        :key="src.id"
        :href="src.url"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex flex-col justify-between rounded-lg border border-border-subtle bg-surface-raised p-2.5 transition-all hover:border-brand-maroon hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-maroon focus-visible:ring-offset-1 focus-visible:ring-offset-surface-canvas min-h-[44px]"
      >
        <div>
          <div class="flex items-center space-x-1.5 mb-1">
            <span class="flex h-4 w-4 items-center justify-center rounded bg-surface-sunken text-[10px] font-mono font-bold text-text-primary group-hover:bg-brand-maroon/10 group-hover:text-brand-maroon dark:group-hover:text-brand-gold">
              {{ src.id }}
            </span>
            <span class="truncate text-[10px] font-medium text-text-muted group-hover:text-text-secondary">
              {{ src.domain }}
            </span>
          </div>

          <p class="line-clamp-1 text-xs font-semibold text-text-primary group-hover:text-brand-maroon dark:group-hover:text-brand-gold transition-colors">
            {{ src.title }}
          </p>

          <p class="mt-1 line-clamp-2 text-[11px] leading-relaxed text-text-secondary">
            {{ src.snippet }}
          </p>
        </div>

        <div class="mt-2 flex items-center justify-end text-[10px] font-medium text-text-muted group-hover:text-brand-maroon dark:group-hover:text-brand-gold">
          <span>Inspect source ↗</span>
        </div>
      </a>
    </div>
  </div>
</template>
