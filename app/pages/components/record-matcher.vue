<script setup lang="ts">
import type { UnmatchedRecordItem } from "~/components/TuxRecordMatcher.vue";

useHead({ title: "TuxRecordMatcher · TUX" });

const initialQueue: UnmatchedRecordItem[] = [
  {
    id: "stream-101",
    sourceCode: "RAD-IH35-NB-241",
    sourceTitle: "Side-Fire Radar Feed · Milepost 241.4 NB",
    sourceMeta: "Detected 4 lanes · 60-sec polling · District 14",
    amountLabel: "28,450 veh/day",
    candidates: [
      {
        id: "sta-14-0241",
        code: "STA-14-0241N",
        label: "IH-35 Northbound Mainlanes @ Rundberg",
        confidence: 96,
        meta: "Permanent ATR Station · 4 mainlanes · 0.08 mi offset",
      },
      {
        id: "sta-14-0241f",
        code: "STA-14-0241FR",
        label: "IH-35 Northbound Frontage @ Rundberg",
        confidence: 64,
        meta: "Signalized arterial approach · 2 lanes",
      },
    ],
  },
  {
    id: "stream-102",
    sourceCode: "WIM-US290-EB-088",
    sourceTitle: "Piezoelectric Axle Classifier · US-290 East",
    sourceMeta: "FHWA 13-bin vehicle classification · Manor corridor",
    amountLabel: "19,120 veh/day",
    candidates: [
      {
        id: "sta-14-0882",
        code: "WIM-14-0882E",
        label: "US-290 Eastbound Express @ Parmer Ln",
        confidence: 92,
        meta: "Calibrated WIM site · Class 9 share 14.2%",
      },
      {
        id: "sta-14-0885",
        code: "WIM-14-0885E",
        label: "US-290 Eastbound @ Giles Ln",
        confidence: 77,
        meta: "Auxiliary count station · 1.9 mi east",
      },
    ],
  },
  {
    id: "stream-103",
    sourceCode: "LID-SH6-SB-119",
    sourceTitle: "Roadside LiDAR Intersection Unit · University Dr",
    sourceMeta: "Pedestrian + turning-movement stream · Unassigned junction",
    amountLabel: "3,840 ped/day",
    candidates: [
      {
        id: "int-17-044",
        code: "INT-17-0044",
        label: "University Dr (FM-60) & Texas Ave",
        confidence: 83,
        meta: "High-pedestrian crossing · 4-leg signalized",
      },
      {
        id: "int-17-045",
        code: "INT-17-0045",
        label: "University Dr (FM-60) & Bizzell St",
        confidence: 78,
        meta: "Campus transit crossing · 3-leg signalized",
      },
    ],
  },
];

const queue = ref<UnmatchedRecordItem[]>(structuredClone(initialQueue));
const eventLog = ref<string[]>([]);

function onResolve(payload: { itemId: string; candidateId: string; createRule: boolean }) {
  queue.value = queue.value.filter((item) => item.id !== payload.itemId);
  eventLog.value.unshift(
    `Resolved ${payload.itemId} → ${payload.candidateId} (createRule: ${payload.createRule})`,
  );
}

function onResolveBatch(
  payload: Array<{ itemId: string; candidateId: string; createRule: boolean }>,
) {
  const ids = new Set(payload.map((entry) => entry.itemId));
  queue.value = queue.value.filter((item) => !ids.has(item.id));
  eventLog.value.unshift(
    `Batch confirmed ${payload.length} high-confidence records: ${payload.map((p) => `${p.itemId}→${p.candidateId}`).join(", ")}`,
  );
}

function onDismiss(itemId: string) {
  queue.value = queue.value.filter((item) => item.id !== itemId);
  eventLog.value.unshift(`Deferred ${itemId} for manual field verification`);
}

function resetDemo() {
  queue.value = structuredClone(initialQueue);
  eventLog.value = [];
}

const basicVue = `<TuxRecordMatcher
  :items="queue"
  @resolve="onResolve"
  @resolve-batch="onResolveBatch"
  @dismiss="onDismiss"
/>`;

const noRuleVue = `<TuxRecordMatcher
  :items="queue.slice(0, 1)"
  :allow-rule-creation="false"
  accept-label="Link Station"
  dismiss-label="Skip"
/>`;

const typesCode = `export interface MatchCandidate {
  id: string;
  code?: string;
  label: string;
  confidence: number;
  meta?: string;
}

export interface UnmatchedRecordItem {
  id: string;
  sourceTitle: string;
  sourceCode?: string;
  sourceMeta?: string;
  amountLabel?: string;
  candidates: MatchCandidate[];
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · reconciliation" title="TuxRecordMatcher">
      Side-by-side reconciliation queue pairing unlinked incoming records
      against ranked fuzzy candidates. Pre-selects the top-scoring match,
      allows one-click batch confirmation of high-confidence (&ge;90%) items,
      and optionally persists recurring mapping rules.
    </TuxPageHeader>

    <section>
      <div class="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p class="eyebrow">flagship · roadside sensor stream matching</p>
          <h2 class="heading--bold text-xl font-bold">
            Telemetry feed to permanent station inventory reconciliation
          </h2>
        </div>
        <button
          type="button"
          class="min-h-11 px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-surface-border rounded bg-surface-raised text-text-primary cursor-pointer"
          @click="resetDemo"
        >
          Reset Queue
        </button>
      </div>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Field-ingested radar, weigh-in-motion, and LiDAR telemetry streams
        arrive with raw controller tags. Operators review fuzzy inventory
        candidates, optionally check <strong>Remember this mapping rule</strong>,
        or batch-confirm all matches above 90% confidence.
      </p>

      <TuxExample class="mt-4" :vue="basicVue">
        <TuxRecordMatcher
          :items="queue"
          @resolve="onResolve"
          @resolve-batch="onResolveBatch"
          @dismiss="onDismiss"
        />
      </TuxExample>

      <div v-if="eventLog.length > 0" class="mt-3 p-3 rounded border border-surface-border bg-surface-sunken text-xs font-mono text-text-secondary space-y-1">
        <div class="font-bold text-text-primary uppercase tracking-wider">Recent Queue Events</div>
        <div v-for="(entry, idx) in eventLog" :key="idx">{{ entry }}</div>
      </div>
    </section>

    <section>
      <p class="eyebrow">compact · custom action labels without rule creation</p>
      <h2 class="heading--bold text-xl font-bold">One-time linking mode</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Set <code>:allow-rule-creation="false"</code> when links are ad-hoc
        and customize button copy with <code>accept-label</code> and
        <code>dismiss-label</code>.
      </p>
      <TuxExample class="mt-4" :vue="noRuleVue">
        <TuxRecordMatcher
          :items="initialQueue.slice(0, 1)"
          :allow-rule-creation="false"
          accept-label="Link Station"
          dismiss-label="Skip"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">data shape</p>
      <h2 class="heading--bold text-xl font-bold">Exported TypeScript interfaces</h2>
      <TuxCodeBlock class="mt-4" :code="typesCode" lang="ts" filename="TuxRecordMatcher.ts" />
    </section>
  </div>
</template>
