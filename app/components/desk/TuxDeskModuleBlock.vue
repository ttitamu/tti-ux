<script setup lang="ts">
/**
 * TuxDeskModuleBlock — Renders visual TipTap module blocks directly using
 * canonical TUX components (<TuxPageHeader>, <TuxAlert>, <TuxCard>, <TuxBigStat>, <TuxCTA>).
 */
import { assertNever } from "../../utils/desk/types";
import {
  calloutTone,
  calloutToneLabel,
  isModuleKind,
  moduleAction,
  moduleCards,
  moduleGridStyle,
  moduleStats,
  moduleSteps,
  sanitizePayload,
  type ModuleAction,
  type ModuleCard,
  type ModuleKind,
  type ModuleStat,
  type ModuleStep,
} from "../../utils/desk/modules";

interface Props {
  kind: string;
  payload: Record<string, string>;
}

const props = defineProps<Props>();

type CardView = ModuleCard & { action: ModuleAction | null };

type ModuleView =
  | { kind: "hero"; payload: Record<string, string>; action: ModuleAction | null }
  | { kind: "callout"; payload: Record<string, string>; tone: ReturnType<typeof calloutTone>; toneLabel: string }
  | { kind: "split"; payload: Record<string, string> }
  | { kind: "cards"; payload: Record<string, string>; cards: CardView[] }
  | { kind: "steps"; payload: Record<string, string>; steps: ModuleStep[] }
  | { kind: "cta"; payload: Record<string, string>; action: ModuleAction | null }
  | { kind: "stats"; payload: Record<string, string>; stats: ModuleStat[] };

function viewFor(kind: ModuleKind, payload: Record<string, string>): ModuleView {
  switch (kind) {
    case "hero":
      return {
        kind,
        payload,
        action: moduleAction(payload.actionLabel || "", payload.actionHref || ""),
      };
    case "callout": {
      const tone = calloutTone(payload);
      return { kind, payload, tone, toneLabel: calloutToneLabel(tone) };
    }
    case "split":
      return { kind, payload };
    case "cards":
      return {
        kind,
        payload,
        cards: moduleCards(payload).map((card) => ({
          ...card,
          action: card.href ? moduleAction(card.title || "Open", card.href) : null,
        })),
      };
    case "steps":
      return { kind, payload, steps: moduleSteps(payload) };
    case "cta":
      return {
        kind,
        payload,
        action: moduleAction(payload.actionLabel || "", payload.actionHref || ""),
      };
    case "stats":
      return { kind, payload, stats: moduleStats(payload) };
    default:
      return assertNever(kind, "module kind");
  }
}

const view = computed(() => {
  const kind = isModuleKind(props.kind) ? props.kind : "callout";
  return viewFor(kind, sanitizePayload(kind, props.payload));
});

function alertVariant(tone: string): "note" | "tip" | "warning" | "important" {
  switch (tone) {
    case "tip": return "tip";
    case "note": return "note";
    case "important": return "important";
    case "warn":
    default:
      return "warning";
  }
}

const gridStyle = computed(() => moduleGridStyle(props.payload));
</script>

<template>
  <div
    class="tux-desk-module"
    :data-desk-module="view.kind"
    data-testid="tux-desk-module"
    :style="gridStyle"
  >
    <!-- HERO -->
    <header
      v-if="view.kind === 'hero'"
      class="tux-desk-hero p-8 my-8 rounded-xl bg-surface-raised border border-surface-border space-y-4"
    >
      <p v-if="view.payload.eyebrow" class="eyebrow text-brand-primary m-0">
        {{ view.payload.eyebrow }}
      </p>
      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary m-0">
        {{ view.payload.title }}
      </h2>
      <p v-if="view.payload.lead" class="text-lg text-text-muted leading-relaxed m-0 max-w-3xl">
        {{ view.payload.lead }}
      </p>
      <div v-if="view.action" class="pt-2">
        <TuxButton
          :to="view.action.to"
          intent="primary"
          size="lg"
        >
          {{ view.action.label }}
        </TuxButton>
      </div>
    </header>

    <!-- CALLOUT -->
    <div v-else-if="view.kind === 'callout'" class="my-6">
      <TuxAlert
        :variant="alertVariant(view.tone)"
        :title="view.payload.title"
        :description="view.payload.body"
      />
    </div>

    <!-- SPLIT -->
    <section
      v-else-if="view.kind === 'split'"
      class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 items-start"
    >
      <div class="md:col-span-2 space-y-3">
        <p v-if="view.payload.kicker" class="eyebrow text-brand-primary m-0">
          {{ view.payload.kicker }}
        </p>
        <h3 class="text-2xl font-bold text-text-primary m-0">
          {{ view.payload.title }}
        </h3>
        <p class="text-text-muted leading-relaxed m-0">
          {{ view.payload.body }}
        </p>
      </div>
      <aside class="md:col-span-1 p-5 rounded-lg bg-surface-raised border border-surface-border space-y-2">
        <strong class="block text-sm font-bold text-text-primary">
          {{ view.payload.asideTitle }}
        </strong>
        <p class="text-xs text-text-muted leading-relaxed m-0">
          {{ view.payload.asideBody }}
        </p>
      </aside>
    </section>

    <!-- CARDS -->
    <section v-else-if="view.kind === 'cards'" class="my-8 space-y-4">
      <h3 v-if="view.payload.heading" class="text-xl font-bold text-text-primary m-0">
        {{ view.payload.heading }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <template v-for="(card, i) in view.cards" :key="i">
          <TuxCard
            v-if="card.action"
            :to="card.action.to"
            :padded="true"
          >
            <h4 class="text-base font-bold text-text-primary mb-1">
              {{ card.title }}
            </h4>
            <p v-if="card.body" class="text-sm text-text-muted m-0">
              {{ card.body }}
            </p>
          </TuxCard>
          <div
            v-else
            class="p-5 rounded-lg bg-surface-raised border border-surface-border"
          >
            <h4 class="text-base font-bold text-text-primary mb-1">
              {{ card.title }}
            </h4>
            <p v-if="card.body" class="text-sm text-text-muted m-0">
              {{ card.body }}
            </p>
          </div>
        </template>
      </div>
    </section>

    <!-- STEPS -->
    <section v-else-if="view.kind === 'steps'" class="my-8 space-y-4">
      <h3 v-if="view.payload.heading" class="text-xl font-bold text-text-primary m-0">
        {{ view.payload.heading }}
      </h3>
      <ol class="space-y-4 list-none p-0 m-0">
        <li
          v-for="(step, i) in view.steps"
          :key="i"
          class="flex items-start gap-4 p-4 rounded-lg bg-surface-raised border border-surface-border"
        >
          <span class="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-brand-primary text-text-on-brand font-bold text-sm">
            {{ i + 1 }}
          </span>
          <div class="space-y-1 min-w-0">
            <strong class="block text-base font-bold text-text-primary">
              {{ step.title }}
            </strong>
            <p v-if="step.body" class="text-sm text-text-muted m-0">
              {{ step.body }}
            </p>
          </div>
        </li>
      </ol>
    </section>

    <!-- CTA -->
    <div v-else-if="view.kind === 'cta'" class="my-8">
      <TuxCTA
        :title="view.payload.title"
        :dek="view.payload.body"
        tone="maroon"
      >
        <template v-if="view.action" #actions>
          <TuxButton
            :to="view.action.to"
            intent="primary"
            size="lg"
          >
            {{ view.action.label }}
          </TuxButton>
        </template>
      </TuxCTA>
    </div>

    <!-- STATS -->
    <section
      v-else-if="view.kind === 'stats'"
      class="my-8 grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 rounded-xl bg-surface-raised border border-surface-border"
    >
      <div
        v-for="(stat, i) in view.stats"
        :key="i"
        class="flex flex-col items-center text-center justify-center"
      >
        <TuxBigStat
          :value="stat.value"
          :label="stat.label"
          size="sm"
          tone="maroon"
        />
      </div>
    </section>
  </div>
</template>
